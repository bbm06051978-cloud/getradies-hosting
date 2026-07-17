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

// Check subscription
  const now = new Date();
  const hasActiveSubscription = tradieProfile.subscriptionPlan !== "Free" && 
    tradieProfile.subscriptionExpiry && 
    new Date(tradieProfile.subscriptionExpiry) > now;

  const freeQuotesUsed = tradieProfile.freeQuotesUsed ?? 0;

  if (!hasActiveSubscription && freeQuotesUsed >= 3) {
    return NextResponse.json({ 
      error: "subscription_required",
      message: "You have used all 3 free quotes. Please subscribe to continue quoting.",
    }, { status: 403 });
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

// Notify homeowner about new quote
  try {
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      select: { userId: true, title: true, suburb: true },
    });
    if (job) {
      await prisma.notification.create({
        data: {
          userId: job.userId,
          title: "📋 New Quote Received!",
          message: `${tradieProfile.businessName} sent a quote of $${parseFloat(amount).toFixed(0)} for your "${job.title}" job in ${job.suburb}. Review now!`,
        },
      });
    }
  } catch (err) {
    console.error("Failed to send quote notification:", err);
  }

// Increment free quotes used if on free plan
  if (!hasActiveSubscription) {
    await prisma.tradieProfile.update({
      where: { id: tradieProfile.id },
      data: { freeQuotesUsed: { increment: 1 } },
    });
  }

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
          select: {
            id: true, title: true, trade: true, suburb: true, state: true,
            bookings: { select: { id: true, status: true }, take: 1, orderBy: { createdAt: "desc" } },
          },
        },
        tradieProfile: {
          select: {
            id: true,
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