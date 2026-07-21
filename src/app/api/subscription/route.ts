import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-06-24.dahlia",
});

const PLANS = {
  basic: { price: 49, name: "Basic", radius: "20km", leads: 15 },
  pro:   { price: 99, name: "Pro",   radius: "40km", leads: 999 },
};

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: "Invalid token." }, { status: 401 });

    const { plan } = await req.json();
    if (!PLANS[plan as keyof typeof PLANS]) {
      return NextResponse.json({ error: "Invalid plan." }, { status: 400 });
    }

    const selectedPlan = PLANS[plan as keyof typeof PLANS];

    const paymentIntent = await stripe.paymentIntents.create({
      amount: selectedPlan.price * 100,
      currency: "aud",
      metadata: {
        userId: decoded.id,
        plan,
        planName: selectedPlan.name,
      },
      description: `GeTradie ${selectedPlan.name} Subscription — 1 month`,
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      amount: selectedPlan.price,
      planName: selectedPlan.name,
    });

  } catch (err) {
    console.error("Subscription error:", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: "Invalid token." }, { status: 401 });

    const { paymentIntentId, plan } = await req.json();

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (paymentIntent.status !== "succeeded") {
      return NextResponse.json({ error: "Payment not completed." }, { status: 400 });
    }

    // Set subscription expiry to 30 days from now
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 30);

    await prisma.tradieProfile.update({
      where: { userId: decoded.id },
      data: {
        subscriptionPlan:   plan === "pro" ? "Pro" : "Basic",
        subscriptionExpiry: expiry,
        freeQuotesUsed:     0,
      },
    });

    return NextResponse.json({ success: true, expiry });

  } catch (err) {
    console.error("Subscription confirm error:", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
