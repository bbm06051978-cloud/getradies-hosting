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

  if (action === "confirm_complete") {
    const booking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status: "COMPLETED" },
      include: {
        tradieProfile: { select: { userId: true, businessName: true, user: { select: { name: true, email: true, emailNotifications: true } } } },
        job: { select: { title: true, suburb: true, state: true, user: { select: { name: true, email: true, emailNotifications: true } } } },
      },
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

    const homeowner = booking.job.user;
    const tradieUser = booking.tradieProfile?.user;
    const jobTitle = booking.job.title;
    const location = [booking.job.suburb, booking.job.state].filter(Boolean).join(", ");

    const emailWrap = (heading: string, bodyHtml: string) => `
      <div style="font-family:Arial,sans-serif;padding:40px;max-width:500px;margin:0 auto;">
        <div style="background:#0047AB;padding:24px;border-radius:12px 12px 0 0;text-align:center;">
          <h1 style="color:#fff;margin:0;font-size:24px;">GeTradie</h1>
        </div>
        <div style="background:#fff;padding:32px;border:1px solid #e5e7eb;border-radius:0 0 12px 12px;">
          <h2 style="color:#111827;font-size:20px;margin:0 0 8px;">${heading}</h2>
          ${bodyHtml}
        </div>
        <div style="padding:20px;text-align:center;">
          <p style="color:#9CA3AF;font-size:12px;margin:0;">GeTradie Pty Ltd &bull; Parramatta NSW 2150 &bull; getradie.com.au</p>
        </div>
      </div>
    `;

    const sendCompletionEmail = async (to: string, subject: string, html: string) => {
      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { "Authorization": `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
          body: JSON.stringify({ from: "GeTradie <noreply@getradie.com.au>", to, subject, html }),
        });
      } catch (emailErr) {
        console.error("Job completion email error:", emailErr);
      }
    };

    if (homeowner?.email && homeowner.emailNotifications !== false) {
      await sendCompletionEmail(
        homeowner.email,
        `Job Completed: ${jobTitle}`,
        emailWrap("Job Completed", `
          <p style="color:#6B7280;font-size:15px;line-height:1.6;">Hi ${homeowner.name},<br><br>
          You've confirmed that <strong>${jobTitle}</strong>${location ? ` in ${location}` : ""} is complete.</p>
          <div style="background:#F0FDF4;border-left:4px solid #10B981;border-radius:8px;padding:14px 16px;margin:20px 0;">
            <p style="color:#065F46;font-size:13px;margin:0;">Payment has been released to your tradie. Thank you for using GeTradie!</p>
          </div>
          <p style="color:#6B7280;font-size:14px;line-height:1.6;">Had a great experience? Leave a review for your tradie in the app under My Jobs.</p>
        `)
      );
    }

    if (tradieUser?.email && tradieUser.emailNotifications !== false) {
      await sendCompletionEmail(
        tradieUser.email,
        `Job Confirmed Complete: ${jobTitle}`,
        emailWrap("Job Confirmed Complete", `
          <p style="color:#6B7280;font-size:15px;line-height:1.6;">Hi ${tradieUser.name},<br><br>
          The homeowner has confirmed <strong>${jobTitle}</strong>${location ? ` in ${location}` : ""} is complete.</p>
          <div style="background:#F0FDF4;border-left:4px solid #10B981;border-radius:8px;padding:14px 16px;margin:20px 0;">
            <p style="color:#065F46;font-size:13px;margin:0;">Your payment will be released shortly. Great work!</p>
          </div>
        `)
      );
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

    // HW cancelled â€” close the job
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

  // Notify tradie â€” quote accepted
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


