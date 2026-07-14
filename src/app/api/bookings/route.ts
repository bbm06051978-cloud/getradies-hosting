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

  const bookings = await prisma.booking.findMany({
    where: {
      job: { userId: decoded.id },
    },
    include: {
      job: {
        select: {
          id: true,
          title: true,
          trade: true,
          suburb: true,
          state: true,
          description: true,
        },
      },
      tradieProfile: {
        select: {
          businessName: true,
          specialty: true,
          rating: true,
          totalReviews: true,
          isVerified: true,
          user: {
            select: { name: true, phone: true, email: true },
          },
        },
      },
    },
    orderBy: { scheduledAt: "asc" },
  });

  return NextResponse.json({ bookings });
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

  const { bookingId, action, scheduledAt } = await req.json();

  if (action === "confirm_complete") {
    const booking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status: "COMPLETED" },
      select: { jobId: true },
    });
    await prisma.job.update({
      where: { id: booking.jobId },
      data: { status: "COMPLETED" },
    });
    return NextResponse.json({ success: true });
  }

  if (action === "dispute") {
    // Homeowner raises a dispute
    await prisma.booking.update({
      where: { id: bookingId },
      data: { status: "DISPUTED" },
    });

    // Create a notification for admin
    const adminUser = await prisma.user.findFirst({
      where: { role: "ADMIN" },
    });

    if (adminUser) {
      await prisma.notification.create({
        data: {
          userId: adminUser.id,
          title: "Booking Dispute Raised",
          message: `Homeowner raised a dispute for booking ${bookingId}. Please review.`,
        },
      });
    }

    return NextResponse.json({ success: true });
  }

  if (action === "cancel") {
    await prisma.booking.update({
      where: { id: bookingId },
      data: { status: "CANCELLED" },
    });

    await prisma.job.update({
      where: {
        bookings: { some: { id: bookingId } },
      },
      data: { status: "CANCELLED" },
    });

    return NextResponse.json({ success: true });
  }

  if (action === "reschedule" && scheduledAt) {
    await prisma.booking.update({
      where: { id: bookingId },
      data: { scheduledAt: new Date(scheduledAt) },
    });

    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Invalid action." }, { status: 400 });
}