import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-06-24.dahlia",
});

// POST — homeowner clicks Accept Quote
// Only creates payment intent, does NOT accept the quote yet
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: "Invalid token." }, { status: 401 });

    const { id } = await params;
    let lockAmount = 100;
    try {
      const body = await req.json();
      if (body.lockAmount) lockAmount = body.lockAmount;
    } catch {}

    const quote = await prisma.quote.findUnique({
      where: { id },
      include: {
        job: {
          include: {
            user: { select: { id: true, name: true } },
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
    if (quote.job.userId !== decoded.id) return NextResponse.json({ error: "Not authorised." }, { status: 403 });
    if (quote.status === "ACCEPTED") return NextResponse.json({ error: "Already accepted." }, { status: 400 });

    // Create Stripe payment intent only
    const amount = Math.round(lockAmount * 100);
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "aud",
      metadata: {
        quoteId:   quote.id,
        jobId:     quote.jobId,
        tradieProfileId: quote.tradieProfileId,
      },
      description: `GeTradie deposit — ${quote.job.title}`,
    });

    return NextResponse.json({
      success:      true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount:       quote.amount,
      jobTitle:     quote.job.title,
      tradie:       quote.tradieProfile.user.name,
      quoteId:      quote.id,
    });

  } catch (err) {
    console.error("Quote accept error:", err);
    return NextResponse.json({ error: "Server error: " + String(err) }, { status: 500 });
  }
}