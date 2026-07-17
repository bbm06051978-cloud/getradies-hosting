import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-05-28.basil",
});

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: "Invalid token." }, { status: 401 });

    const { paymentIntentId } = await req.json();

    // Verify payment succeeded with Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (paymentIntent.status !== "succeeded") {
      return NextResponse.json({ error: "Payment not completed." }, { status: 400 });
    }

    // Get quote details from payment metadata
    const quoteId        = paymentIntent.metadata.quoteId;
    const jobId          = paymentIntent.metadata.jobId;
    const tradieProfileId = paymentIntent.metadata.tradieProfileId;

    // Get quote with all needed relations
    const quote = await prisma.quote.findUnique({
      where: { id: quoteId },
      include: {
        job: {
          include: {
            user: { select: { id: true, name: true, phone: true, suburb: true, state: true } },
          },
        },
        tradieProfile: {
          include: {
            user: { select: { id: true, name: true, phone: true } },
          },
        },
      },
    });

    if (!quote) return NextResponse.json({ error: "Quote not found." }, { status: 404 });
    if (quote.status === "ACCEPTED") return NextResponse.json({ error: "Quote already accepted." }, { status: 400 });

    // Now do everything in a transaction
    const booking = await prisma.$transaction(async (tx) => {
      // Accept this quote
      await tx.quote.update({
        where: { id: quoteId },
        data: { status: "ACCEPTED" },
      });

      // Reject all other quotes for same job
      await tx.quote.updateMany({
        where: { jobId, id: { not: quoteId }, status: "PENDING" },
        data: { status: "REJECTED" },
      });

      // Update job status
      await tx.job.update({
        where: { id: jobId },
        data: { status: "BOOKED" },
      });

      // Create booking
      const newBooking = await tx.booking.create({
        data: {
          jobId,
          tradieProfileId,
          totalAmount:  quote.amount,
          scheduledAt:  new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          status:       "PENDING",
        },
      });

      // Create payment record
      await tx.payment.create({
        data: {
          bookingId: newBooking.id,
          amount:    paymentIntent.amount / 100,
          status:    "paid",
          method:    "card",
          paidAt:    new Date(),
        },
      });

      return newBooking;
    });

// Award GeTradie points to tradie based on lock amount
    try {
      const lockAmount = paymentIntent.amount / 100;
      const pointsToAdd = lockAmount >= 500 ? 10 :
                          lockAmount >= 250 ? 5  :
                          lockAmount >= 100 ? 2  : 1;

      const updatedProfile = await prisma.tradieProfile.update({
        where: { id: tradieProfileId },
        data: {
          getradiePoints: { increment: pointsToAdd },
        },
        select: { getradiePoints: true },
      });

      // Update badge based on new points total
      const totalPoints = updatedProfile.getradiePoints;
      const newBadge = totalPoints >= 51 ? "Platinum" :
                       totalPoints >= 26 ? "Gold"     :
                       totalPoints >= 11 ? "Silver"   : "Bronze";

      await prisma.tradieProfile.update({
        where: { id: tradieProfileId },
        data: { pointsBadge: newBadge },
      });

      console.log(`Awarded ${pointsToAdd} GeTradie points to tradie. Total: ${totalPoints} (${newBadge})`);
    } catch (err) {
      console.error("Failed to award GeTradie points:", err);
    }

    // Notify accepted tradie
    try {
      await prisma.notification.create({
        data: {
          userId:  quote.tradieProfile.user.id,
          title:   "Quote Accepted!",
          message: `Your quote of $${quote.amount} for "${quote.job.title}" in ${quote.job.suburb} was accepted by ${quote.job.user.name}. Contact: ${quote.job.user.phone || "via messages"}.`,
        },
      });
    } catch (e) { console.error("Notify accepted tradie error:", e); }

    // Notify rejected tradies
    try {
      const rejectedQuotes = await prisma.quote.findMany({
        where: { jobId, id: { not: quoteId }, status: "REJECTED" },
        include: { tradieProfile: { include: { user: { select: { id: true } } } } },
      });
      for (const rq of rejectedQuotes) {
        await prisma.notification.create({
          data: {
            userId:  rq.tradieProfile.user.id,
            title:   "Quote Not Selected",
            message: `Your quote for "${quote.job.title}" was not selected this time. Keep quoting!`,
          },
        });
      }
    } catch (e) { console.error("Notify rejected tradies error:", e); }

    return NextResponse.json({
      success:   true,
      bookingId: booking.id,
      tradie: {
        name:  quote.tradieProfile.user.name,
        phone: quote.tradieProfile.user.phone,
      },
    });

  } catch (err) {
    console.error("Payment confirm error:", err);
    return NextResponse.json({ error: "Server error: " + String(err) }, { status: 500 });
  }
}
