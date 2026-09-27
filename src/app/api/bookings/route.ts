import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2026-06-24.dahlia" });

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value || req.headers.get("Authorization")?.replace("Bearer ", "");
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
  const token = req.cookies.get("token")?.value || req.headers.get("Authorization")?.replace("Bearer ", "");
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
      include: { tradieProfile: { select: { userId: true } }, job: { select: { title: true } } },
    });
    await prisma.job.update({
      where: { id: booking.jobId },
      data: { status: "COMPLETED" },
    });
    // Notify tradie
    if (booking.tradieProfile?.userId) {
      await prisma.notification.create({
        data: {
          userId: booking.tradieProfile.userId,
          title: "Job Confirmed Complete!",
          message: `The homeowner confirmed "${booking.job.title}" is complete. Payment will be released shortly.`,
        },
      });
    }
    return NextResponse.json({ success: true });
  }

  if (action === "dispute") {
    // Homeowner raises a dispute
    const disputeBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status: "DISPUTED" },
    });
    // Also update job status to DISPUTED
    await prisma.job.update({
      where: { id: disputeBooking.jobId },
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
    // Get booking with payment and job info
    const bookingToCancel = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { payment: true, job: { select: { id: true } } },
    });

    if (!bookingToCancel) return NextResponse.json({ error: "Booking not found" }, { status: 404 });

    // Only allow cancel on PENDING or CONFIRMED
    if (!["PENDING", "CONFIRMED"].includes(bookingToCancel.status)) {
      return NextResponse.json({ error: "Cannot cancel at this stage." }, { status: 400 });
    }

    // Cancel booking
    await prisma.booking.update({
      where: { id: bookingId },
      data: { status: "CANCELLED" },
    });

    // HW cancelled — close the job
    await prisma.job.update({
      where: { id: bookingToCancel.job.id },
      data: { status: "CANCELLED" },
    });

    // Stripe refund
    try {
      const payment = await prisma.payment.findUnique({ where: { bookingId } });
      if (payment && payment.stripePaymentIntentId) {
        await stripe.refunds.create({ payment_intent: payment.stripePaymentIntentId });
        await prisma.payment.update({ where: { bookingId }, data: { status: "refunded" } });
      }
    } catch (refundErr) {
      console.error("Stripe refund error:", refundErr);
    }

    // Get full booking details for notifications
    const fullBooking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        job: { select: { id: true, title: true, userId: true } },
        tradieProfile: {
          select: { businessName: true, user: { select: { id: true } } },
        },
        payment: true,
      },
    });

    if (fullBooking) {
      // Notify tradie
      await prisma.notification.create({
        data: {
          userId: fullBooking.tradieProfile.user.id,
          title: "Booking Cancelled by Homeowner",
          message: `The homeowner has cancelled the booking for "${fullBooking.job.title}".`,
        },
      });

      // Notify HW of refund if applicable
      const payment = await prisma.payment.findUnique({ where: { bookingId } });
      if (payment && payment.status === "refunded") {
        await prisma.notification.create({
          data: {
            userId: fullBooking.job.userId,
            title: "Lock Amount Refunded",
            message: `Your lock amount of $${payment.amount} AUD for "${fullBooking.job.title}" has been refunded to your card. It may take 3-5 business days to appear.`,
          },
        });
      }
    }

    return NextResponse.json({ success: true, message: "Booking cancelled. Job reopened." });
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

  // Notify tradie — quote accepted
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


