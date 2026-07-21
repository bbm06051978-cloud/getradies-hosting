import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-06-24.dahlia",
});

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: "Invalid token." }, { status: 401 });

    const { bookingId } = await req.json();

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        job: {
          include: {
            user: { select: { id: true, name: true, email: true } },
          },
        },
        tradieProfile: { select: { businessName: true } },
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found." }, { status: 404 });
    }

    if (booking.job.userId !== decoded.id) {
      return NextResponse.json({ error: "Not authorised." }, { status: 403 });
    }

    // Create Stripe payment intent
    // Amount in cents (AUD)
    const amount = Math.round(booking.totalAmount * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "aud",
      metadata: {
        bookingId: booking.id,
        jobTitle:  booking.job.title,
        tradie:    booking.tradieProfile.businessName,
        homeowner: booking.job.user.name,
      },
      description: `GeTradie — ${booking.job.title} by ${booking.tradieProfile.businessName}`,
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      amount:       booking.totalAmount,
      jobTitle:     booking.job.title,
      tradie:       booking.tradieProfile.businessName,
    });

  } catch (err) {
    console.error("Payment intent error:", err);
    return NextResponse.json({ error: "Failed to create payment." }, { status: 500 });
  }
}
