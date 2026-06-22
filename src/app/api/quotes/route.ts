import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// POST — Tradie sends a quote
export async function POST(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const decoded = verifyToken(token);
  if (!decoded || decoded.role !== "TRADIE") {
    return NextResponse.json({ error: "Only tradies can send quotes." }, { status: 403 });
  }

  const { jobId, amount, description } = await req.json();

  if (!jobId || !amount || !description) {
    return NextResponse.json(
      { error: "Job, amount and description are required." },
      { status: 400 }
    );
  }

  const tradieProfile = await prisma.tradieProfile.findUnique({
    where: { userId: decoded.id },
  });

  if (!tradieProfile) {
    return NextResponse.json({ error: "Tradie profile not found." }, { status: 404 });
  }

  const existing = await prisma.quote.findFirst({
    where: { jobId, tradieProfileId: tradieProfile.id },
  });

  if (existing) {
    return NextResponse.json(
      { error: "You have already sent a quote for this job." },
      { status: 400 }
    );
  }

  const quote = await prisma.quote.create({
    data: {
      jobId,
      tradieProfileId: tradieProfile.id,
      amount: parseFloat(amount),
      description,
      status: "PENDING",
    },
  });

  await prisma.job.update({
    where: { id: jobId },
    data: { status: "QUOTED" },
  });

  return NextResponse.json({ success: true, quote });
}

// GET — Fetch quotes
export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return NextResponse.json({ error: "Invalid token." }, { status: 401 });
  }

  if (decoded.role === "HOMEOWNER") {
    const quotes = await prisma.quote.findMany({
      where: {
        job: { userId: decoded.id },
      },
      include: {
        job: {
          select: { id: true, title: true, trade: true, suburb: true, state: true },
        },
        tradieProfile: {
          select: {
            businessName: true,
            specialty: true,
            rating: true,
            totalReviews: true,
            isVerified: true,
            user: { select: { id: true, name: true, phone: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ quotes });
  }

  if (decoded.role === "TRADIE") {
    const tradieProfile = await prisma.tradieProfile.findUnique({
      where: { userId: decoded.id },
    });

    if (!tradieProfile) {
      return NextResponse.json({ quotes: [] });
    }

    const quotes = await prisma.quote.findMany({
      where: { tradieProfileId: tradieProfile.id },
      include: {
        job: {
          select: {
            id: true,
            title: true,
            trade: true,
            suburb: true,
            state: true,
            user: { select: { name: true, phone: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ quotes });
  }

  return NextResponse.json({ quotes: [] });
}

// PATCH — Accept a quote
export async function PATCH(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return NextResponse.json({ error: "Invalid token." }, { status: 401 });
  }

  const { quoteId } = await req.json();

const quote = await prisma.quote.update({
    where: { id: quoteId },
    data: { status: "ACCEPTED" },
  });

  await prisma.job.update({
    where: { id: quote.jobId },
    data: { status: "BOOKED" },
  });

  // Create a booking record
  await prisma.booking.create({
    data: {
      jobId: quote.jobId,
      tradieProfileId: quote.tradieProfileId,
      scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // default next day
      status: "CONFIRMED",
      totalAmount: quote.amount,
    },
  });

  return NextResponse.json({ success: true });
}