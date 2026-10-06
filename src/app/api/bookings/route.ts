import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { cancelState, hasAgreedTime, validateScheduleTime } from "@/lib/bookingRules";
import {
  DisputeError,
  completeBooking,
  loadBooking,
  money,
  notifyAdmins,
  processDueItems,
  raiseDispute,
  refundPayment,
} from "@/lib/disputes";
import type { BookingWithParties } from "@/lib/disputes";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value || req.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return NextResponse.json({ error: "Invalid token." }, { status: 401 });
  }

  await processDueItems();

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
      payment: true,
    },
    orderBy: { scheduledAt: "asc" },
  });

  return NextResponse.json({ bookings });
}

export async function PATCH(req: NextRequest) {
  const token = req.cookies.get("token")?.value || req.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return NextResponse.json({ error: "Invalid token." }, { status: 401 });
  }

  const { bookingId, action, scheduledAt } = await req.json();

  // Every action here is the homeowner acting on their own booking.
  let booking: BookingWithParties;
  try {
    booking = await loadBooking(bookingId);
  } catch {
    return NextResponse.json({ error: "Booking not found." }, { status: 404 });
  }
  if (booking.job.userId !== decoded.id) {
    return NextResponse.json({ error: "This booking is not yours." }, { status: 403 });
  }

  if (action === "confirm_complete") {
    const done = await completeBooking(booking.id, "HOMEOWNER");
    if (!done) {
      return NextResponse.json({ error: "This job is not waiting for your confirmation." }, { status: 400 });
    }
    return NextResponse.json({ success: true });
  }

  if (action === "dispute") {
    // Older versions of the app raise a dispute here without a reason.
    // Newer screens use /api/disputes, which asks for a reason.
    try {
      await raiseDispute({
        bookingId: booking.id,
        userId: decoded.id,
        category: "OTHER",
        description: "No reason was given (raised from an older version of the app).",
        legacy: true,
      });
    } catch (err) {
      if (err instanceof DisputeError) return NextResponse.json({ error: err.message }, { status: err.status });
      console.error("Raise dispute error:", err);
      return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  }

  if (action === "cancel") {
    const state = cancelState(booking);
    if (!state.allowed) {
      return NextResponse.json({ error: state.reason }, { status: 400 });
    }

    // Refund first. If the refund fails the booking is not cancelled, so nobody is
    // told a refund is coming when it is not.
    let refund: { refunded: number; manualNeeded: boolean };
    try {
      refund = await refundPayment(booking.payment, {
        idempotencyKey: `cancel-${booking.id}`,
        metadata: { bookingId: booking.id, reason: "booking_cancelled" },
      });
    } catch (refundErr) {
      console.error("Stripe refund error:", refundErr);
      await notifyAdmins("Refund failed on cancellation",
        `The homeowner tried to cancel "${booking.job.title}" (booking ${booking.id}) but the refund could not be processed. The booking has not been cancelled.`);
      return NextResponse.json(
        { error: "We couldn't process your refund, so the booking has not been cancelled. Please try again shortly or contact support." },
        { status: 502 }
      );
    }

    const claimed = await prisma.booking.updateMany({
      where: { id: booking.id, status: booking.status },
      data: { status: "CANCELLED" },
    });
    if (claimed.count !== 1) {
      // The tradie may have cancelled at the same moment: then it is already done, with one refund.
      const latest = await prisma.booking.findUnique({ where: { id: booking.id }, select: { status: true } });
      if (latest?.status === "CANCELLED") {
        return NextResponse.json({ success: true, message: "Booking cancelled." });
      }
      if (refund.refunded > 0) {
        await notifyAdmins("Cancellation needs attention",
          `${money(refund.refunded)} was refunded for "${booking.job.title}" (booking ${booking.id}) but the booking changed before it could be cancelled. Please check it.`);
      }
      return NextResponse.json({ error: "This booking has just changed. Please refresh and try again." }, { status: 409 });
    }

    // HW cancelled - close the job
    await prisma.job.update({
      where: { id: booking.job.id },
      data: { status: "CANCELLED" },
    });

    // Notify tradie
    await prisma.notification.create({
      data: {
        userId: booking.tradieProfile.user.id,
        title: "Booking Cancelled by Homeowner",
        message: `The homeowner has cancelled the booking for "${booking.job.title}".`,
      },
    });

    // Notify HW of refund if applicable
    if (refund.refunded > 0) {
      await prisma.notification.create({
        data: {
          userId: booking.job.userId,
          title: "Lock Amount Refunded",
          message: `Your lock amount of $${refund.refunded} AUD for "${booking.job.title}" has been refunded to your card. It may take 3-5 business days to appear.`,
        },
      });
    }
    if (refund.manualNeeded && booking.payment) {
      await prisma.notification.create({
        data: {
          userId: booking.job.userId,
          title: "Refund Being Processed",
          message: `Your lock amount of $${booking.payment.amount} AUD for "${booking.job.title}" will be refunded by GeTradie support. We'll be in touch if we need anything from you.`,
        },
      });
      await notifyAdmins("Manual refund needed",
        `The homeowner cancelled "${booking.job.title}" (booking ${booking.id}). The lock amount of ${money(booking.payment.amount)} has no Stripe reference and must be refunded manually.`);
    }

    return NextResponse.json({ success: true, message: "Booking cancelled. Job reopened." });
  }

  if (action === "reschedule" && scheduledAt) {
    if (!["PENDING", "CONFIRMED"].includes(booking.status)) {
      return NextResponse.json({ error: "This booking can no longer be rescheduled." }, { status: 400 });
    }
    if (hasAgreedTime(booking)) {
      return NextResponse.json(
        { error: "The tradie has already set the job time. Please message them to arrange a change." },
        { status: 400 }
      );
    }
    const when = validateScheduleTime(scheduledAt);
    if (!when.date) {
      return NextResponse.json({ error: when.error }, { status: 400 });
    }
    await prisma.booking.update({
      where: { id: booking.id },
      data: { scheduledAt: when.date },
    });

    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Invalid action." }, { status: 400 });
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get("token")?.value || req.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });

  const decoded = verifyToken(token);
  if (!decoded) return NextResponse.json({ error: "Invalid token." }, { status: 401 });

  const { jobId, quoteId, tradieProfileId, totalAmount } = await req.json();

  if (!jobId || !quoteId || !tradieProfileId) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  // Check job belongs to this user
  const job = await prisma.job.findUnique({ where: { id: jobId, userId: decoded.id } });
  if (!job) return NextResponse.json({ error: "Job not found." }, { status: 404 });

  // A job can only have one live booking (cancelled ones don't count)
  const existingBooking = await prisma.booking.findFirst({
    where: { jobId, status: { not: "CANCELLED" } },
    select: { id: true },
  });
  if (existingBooking) {
    return NextResponse.json({ error: "This job already has a booking." }, { status: 400 });
  }

  // Accept the quote and reject others
  await prisma.quote.update({ where: { id: quoteId }, data: { status: "ACCEPTED" } });
  await prisma.quote.updateMany({
    where: { jobId, id: { not: quoteId } },
    data: { status: "REJECTED" },
  });

  // Create booking
  const booking = await prisma.booking.create({
    data: {
      job: { connect: { id: jobId } },
      tradieProfile: { connect: { id: tradieProfileId } },
      totalAmount: parseFloat(totalAmount) || 0,
      status: "PENDING",
      scheduledAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // default 1 week
    },
  });

  // Update job status
  await prisma.job.update({ where: { id: jobId }, data: { status: "BOOKED" } });

  // Notify tradie - quote accepted
  const tradieProfile = await prisma.tradieProfile.findUnique({
    where: { id: tradieProfileId },
    select: { userId: true },
  });
  if (tradieProfile) {
    await prisma.notification.create({
      data: {
        userId: tradieProfile.userId,
        title: "Quote Accepted!",
        message: `Your quote for "${job.title}" was accepted. The job is now confirmed.`,
      },
    });
  }

  return NextResponse.json({ success: true, booking });
}


