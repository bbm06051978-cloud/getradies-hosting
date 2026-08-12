// src/app/api/auth/verify-otp/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json({ error: "Email and OTP are required." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user || !user.resetToken || !user.resetTokenExpiry) {
      return NextResponse.json({ error: "Invalid or expired code. Please request a new one." }, { status: 400 });
    }

    // Check expiry
    if (new Date() > user.resetTokenExpiry) {
      return NextResponse.json({ error: "This code has expired. Please request a new one." }, { status: 400 });
    }

    // Check OTP
    if (user.resetToken !== otp.trim()) {
      return NextResponse.json({ error: "Incorrect code. Please check and try again." }, { status: 400 });
    }

    // OTP valid — return a short-lived reset token for next step
    // We'll reuse resetToken field but mark as verified with prefix
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken: `VERIFIED:${otp}`,
        resetTokenExpiry: new Date(Date.now() + 10 * 60 * 1000), // 10 more minutes to reset
      },
    });

    return NextResponse.json({ success: true, message: "OTP verified successfully." });
  } catch (err) {
    console.error("Verify OTP error:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
