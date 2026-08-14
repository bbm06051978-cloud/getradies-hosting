import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-06-24.dahlia",
});

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value || req.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: "Invalid token." }, { status: 401 });

    const { quoteId, jobId, tradieProfileId, lockAmount } = await req.json();

    if (!quoteId || !jobId || !tradieProfileId || !lockAmount) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const quote = await prisma.quote.findUnique({
      where: { id: quoteId },
      include: {
        job: { select: { title: true, userId: true } },
        tradieProfile: { select: { businessName: true } },
      },
    });

    if (!quote) return NextResponse.json({ error: "Quote not found." }, { status: 404 });
    if (quote.job.userId !== decoded.id) return NextResponse.json({ error: "Not authorised." }, { status: 403 });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(lockAmount * 100),
      currency: "aud",
      metadata: {
        quoteId,
        jobId,
        tradieProfileId,
        lockAmount: String(lockAmount),
        jobTitle: quote.job.title,
        tradie: quote.tradieProfile.businessName,
      },
      description: `GeTradie Lock — ${quote.job.title} by ${quote.tradieProfile.businessName}`,
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      amount: lockAmount,
      jobTitle: quote.job.title,
      tradie: quote.tradieProfile.businessName,
    });
  } catch (err) {
    console.error("Mobile payment intent error:", err);
    return NextResponse.json({ error: "Failed to create payment." }, { status: 500 });
  }
}