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
          user: { select: { name: true, phone: true, email: true, suburb: true, state: true } },
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

if (action === "confirm") {
    const booking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status: "CONFIRMED" },
      include: {
        job: { select: { userId: true, title: true } },
        tradieProfile: { select: { businessName: true } },
      },
    });
    try {
      await prisma.notification.create({
        data: {
          userId: booking.job.userId,
          title: "✅ Booking Confirmed!",
          message: `${booking.tradieProfile.businessName} confirmed your booking for "${booking.job.title}" on ${new Date(booking.scheduledAt).toLocaleDateString("en-AU", { weekday: "short", day: "numeric", month: "long" })} at ${new Date(booking.scheduledAt).toLocaleTimeString("en-AU", { hour: "2-digit", minute: "2-digit" })}.`,
        },
      });
    } catch (err) {
      console.error("Failed to send booking confirmed notification:", err);
    }
    return NextResponse.json({ success: true });
  }
  if (action === "mark_done") {
    const booking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status: "PENDING_CONFIRMATION" },
      include: {
        job: { select: { userId: true, title: true } },
        tradieProfile: { select: { businessName: true } },
      },
    });
    try {
      await prisma.notification.create({
        data: {
          userId: booking.job.userId,
          title: "🔧 Job Complete — Please Confirm",
          message: `${booking.tradieProfile.businessName} has marked "${booking.job.title}" as complete. Please confirm to release payment.`,
        },
      });
    } catch (err) {
      console.error("Failed to send job complete notification:", err);
    }

    const bookingForJob = await prisma.booking.findUnique({
      where: { id: bookingId },
      select: { jobId: true },
    });
    if (bookingForJob) {
      await prisma.job.update({
        where: { id: bookingForJob.jobId },
        data: { status: "IN_PROGRESS" },
      });
    }
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Invalid action." }, { status: 400 });
}
