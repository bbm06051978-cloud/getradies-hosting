import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return NextResponse.json({ error: "Invalid token." }, { status: 401 });
  }

  const tradieProfile = await prisma.tradieProfile.findUnique({
    where: { userId: decoded.id },
  });

  if (!tradieProfile) {
    return NextResponse.json({ error: "Tradie profile not found." }, { status: 404 });
  }

  const bookings = await prisma.booking.findMany({
    where: { tradieProfileId: tradieProfile.id },
    include: {
      job: {
        select: {
          id: true,
          title: true,
          trade: true,
          suburb: true,
          state: true,
          description: true,
          aiEstimate: true,
        },
      },
      tradieProfile: {
        select: {
          businessName: true,
          specialty: true,
        },
      },
      payment: true,
    },
    orderBy: { scheduledAt: "asc" },
  });

  // Fetch homeowner details separately
  const bookingsWithHomeowner = await Promise.all(
    bookings.map(async (booking) => {
      const job = await prisma.job.findUnique({
        where: { id: booking.jobId },
        include: {
          user: { select: { name: true, phone: true, email: true, suburb: true, state: true, profilePhoto: true } },
        },
      });
      return { ...booking, homeowner: job?.user };
    })
  );

  return NextResponse.json({ bookings: bookingsWithHomeowner });
}

export async function PATCH(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return NextResponse.json({ error: "Invalid token." }, { status: 401 });
  }

  const { bookingId, action } = await req.json();

  if (action === "mark_done") {
    // Tradie marks job done — sets to PENDING_CONFIRMATION
    // Homeowner must confirm before it becomes COMPLETED
    await prisma.booking.update({
      where: { id: bookingId },
      data: { status: "PENDING_CONFIRMATION" },
    });

    await prisma.job.update({
      where: {
        bookings: { some: { id: bookingId } },
      },
      data: { status: "IN_PROGRESS" },
    });

    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Invalid action." }, { status: 400 });
}