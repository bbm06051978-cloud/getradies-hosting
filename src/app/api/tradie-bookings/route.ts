import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CANCEL_CUTOFF_HOURS, DISPUTE_AFTER_DONE_DAYS, cancelState, hasAgreedTime, validateScheduleTime } from "@/lib/bookingRules";
import {
  loadBooking,
  money,
  notifyAdmins,
  notifyMarkedDone,
  processDueItems,
  refundPayment,
  sydneyTime,
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

  const tradieProfile = await prisma.tradieProfile.findUnique({
    where: { userId: decoded.id },
  });

  if (!tradieProfile) {
    return NextResponse.json({ error: "Tradie profile not found." }, { status: 404 });
  }

  await processDueItems();

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
          user: { select: { id: true, name: true, phone: true, email: true, suburb: true, state: true } },
        },
      });
      return { ...booking, homeowner: job?.user };
    })
  );

  return NextResponse.json({ bookings: bookingsWithHomeowner });
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

  // Every action here is the tradie acting on their own booking.
  let booking: BookingWithParties;
  try {
    booking = await loadBooking(bookingId);
  } catch {
    return NextResponse.json({ error: "Booking not found." }, { status: 404 });
  }
  if (booking.tradieProfile.userId !== decoded.id) {
    return NextResponse.json({ error: "This booking is not yours." }, { status: 403 });
  }

  const businessName = booking.tradieProfile.businessName;
  const jobTitle = booking.job.title;

  if (action === "confirm") {
    if (booking.status !== "PENDING") {
      return NextResponse.json({ error: "This booking has already been confirmed." }, { status: 400 });
    }
    // The tradie sets the real job time when confirming. Older app versions do not send one.
    let when: Date | null = null;
    if (scheduledAt !== undefined && scheduledAt !== null && scheduledAt !== "") {
      const checked = validateScheduleTime(scheduledAt);
      if (!checked.date) return NextResponse.json({ error: checked.error }, { status: 400 });
      when = checked.date;
    }
    const claimed = await prisma.booking.updateMany({
      where: { id: booking.id, status: "PENDING" },
      data: { status: "CONFIRMED", ...(when ? { scheduledAt: when, scheduleSetAt: new Date() } : {}) },
    });
    if (claimed.count !== 1) {
      return NextResponse.json({ error: "This booking has just changed. Please refresh and try again." }, { status: 409 });
    }
    try {
      await prisma.notification.create({
        data: {
          userId: booking.job.userId,
          title: "✅ Booking Confirmed!",
          message: when
            ? `${businessName} confirmed your booking for "${jobTitle}" on ${sydneyTime(when)}. You can cancel free of charge until ${CANCEL_CUTOFF_HOURS} hours before the start.`
            : `${businessName} confirmed your booking for "${jobTitle}".`,
        },
      });
    } catch (err) {
      console.error("Failed to send booking confirmed notification:", err);
    }
    return NextResponse.json({ success: true });
  }

  if (action === "set_time") {
    if (booking.status !== "CONFIRMED") {
      return NextResponse.json({ error: "The job time can only be set on a confirmed booking." }, { status: 400 });
    }
    if (hasAgreedTime(booking) && !cancelState(booking).allowed) {
      return NextResponse.json(
        { error: `The job time can't be changed within ${CANCEL_CUTOFF_HOURS} hours of the start. Please message the homeowner.` },
        { status: 400 }
      );
    }
    const checked = validateScheduleTime(scheduledAt);
    if (!checked.date) return NextResponse.json({ error: checked.error }, { status: 400 });
    const changed = hasAgreedTime(booking);
    const claimed = await prisma.booking.updateMany({
      where: { id: booking.id, status: "CONFIRMED" },
      data: { scheduledAt: checked.date, scheduleSetAt: new Date() },
    });
    if (claimed.count !== 1) {
      return NextResponse.json({ error: "This booking has just changed. Please refresh and try again." }, { status: 409 });
    }
    try {
      await prisma.notification.create({
        data: {
          userId: booking.job.userId,
          title: changed ? "Job Time Changed" : "Job Time Set",
          message: `${businessName} ${changed ? "changed" : "set"} the time for "${jobTitle}" to ${sydneyTime(checked.date)}. You can cancel free of charge until ${CANCEL_CUTOFF_HOURS} hours before the start.`,
        },
      });
    } catch (err) {
      console.error("Failed to send job time notification:", err);
    }
    return NextResponse.json({ success: true });
  }

  if (action === "mark_done") {
    if (booking.status !== "CONFIRMED") {
      return NextResponse.json({ error: "Only a confirmed job can be marked done." }, { status: 400 });
    }
    const markedDoneAt = new Date();
    const claimed = await prisma.booking.updateMany({
      where: { id: booking.id, status: "CONFIRMED" },
      data: { status: "PENDING_CONFIRMATION", markedDoneAt },
    });
    if (claimed.count !== 1) {
      return NextResponse.json({ error: "This booking has just changed. Please refresh and try again." }, { status: 409 });
    }
    await prisma.job.update({
      where: { id: booking.job.id },
      data: { status: "IN_PROGRESS" },
    });
    try {
      await prisma.notification.create({
        data: {
          userId: booking.job.userId,
          title: "🔧 Job Complete — Please Confirm",
          message: `${businessName} has marked "${jobTitle}" as complete. Please confirm to release payment, or raise a dispute if something is wrong. If you do nothing, it will complete automatically after ${DISPUTE_AFTER_DONE_DAYS} days.`,
        },
      });
    } catch (err) {
      console.error("Failed to send job complete notification:", err);
    }
    try {
      await notifyMarkedDone(booking.id, markedDoneAt);
    } catch (err) {
      console.error("Failed to send job complete email:", err);
    }
    return NextResponse.json({ success: true });
  }

  if (action === "cancel") {
    const state = cancelState(booking);
    if (!state.allowed) {
      return NextResponse.json({ error: state.reason }, { status: 400 });
    }

    // Refund first. If the refund fails the booking is not cancelled, so the homeowner
    // is never told a refund is coming when it is not.
    let refund: { refunded: number; manualNeeded: boolean };
    try {
      refund = await refundPayment(booking.payment, {
        idempotencyKey: `cancel-${booking.id}`,
        metadata: { bookingId: booking.id, reason: "booking_cancelled" },
      });
    } catch (refundErr) {
      console.error("Stripe refund error:", refundErr);
      await notifyAdmins("Refund failed on cancellation",
        `${businessName} tried to cancel "${jobTitle}" (booking ${booking.id}) but the homeowner's refund could not be processed. The booking has not been cancelled.`);
      return NextResponse.json(
        { error: "We couldn't process the homeowner's refund, so the booking has not been cancelled. Please try again shortly or contact support." },
        { status: 502 }
      );
    }

    const claimed = await prisma.booking.updateMany({
      where: { id: booking.id, status: booking.status },
      data: { status: "CANCELLED" },
    });
    if (claimed.count !== 1) {
      // The homeowner may have cancelled at the same moment: then it is already done, with one refund.
      const latest = await prisma.booking.findUnique({ where: { id: booking.id }, select: { status: true } });
      if (latest?.status === "CANCELLED") {
        return NextResponse.json({ success: true, message: "Booking cancelled." });
      }
      if (refund.refunded > 0) {
        await notifyAdmins("Cancellation needs attention",
          `${money(refund.refunded)} was refunded for "${jobTitle}" (booking ${booking.id}) but the booking changed before it could be cancelled. Please check it.`);
      }
      return NextResponse.json({ error: "This booking has just changed. Please refresh and try again." }, { status: 409 });
    }
    await prisma.job.update({ where: { id: booking.job.id }, data: { status: "OPEN" } });
    await prisma.quote.updateMany({ where: { jobId: booking.job.id }, data: { status: "PENDING" } });

    // Notify homeowner
    if (refund.refunded > 0) {
      await prisma.notification.create({
        data: {
          userId: booking.job.userId,
          title: "Lock Amount Refunded",
          message: `Your lock amount of $${refund.refunded} AUD for "${jobTitle}" has been refunded to your card. It may take 3-5 business days to appear.`,
        },
      });
    }
    if (refund.manualNeeded && booking.payment) {
      await prisma.notification.create({
        data: {
          userId: booking.job.userId,
          title: "Refund Being Processed",
          message: `Your lock amount of $${booking.payment.amount} AUD for "${jobTitle}" will be refunded by GeTradie support. We'll be in touch if we need anything from you.`,
        },
      });
      await notifyAdmins("Manual refund needed",
        `${businessName} cancelled "${jobTitle}" (booking ${booking.id}). The lock amount of ${money(booking.payment.amount)} has no Stripe reference and must be refunded manually.`);
    }
    await prisma.notification.create({
      data: {
        userId: booking.job.userId,
        title: "Booking Cancelled by Tradie",
        message: `${businessName} has cancelled the booking for "${jobTitle}". Your job has been reopened and you can receive new quotes.`,
      },
    });

    return NextResponse.json({ success: true, message: "Booking cancelled. Job reopened." });
  }

  return NextResponse.json({ error: "Invalid action." }, { status: 400 });
}
