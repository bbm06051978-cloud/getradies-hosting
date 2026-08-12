// src/app/api/auth/reset-password/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    // Password validation
    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
    }
    if (!/[A-Z]/.test(password)) {
      return NextResponse.json({ error: "Password must include at least one uppercase letter." }, { status: 400 });
    }
    if (!/[a-z]/.test(password)) {
      return NextResponse.json({ error: "Password must include at least one lowercase letter." }, { status: 400 });
    }
    if (!/[0-9]/.test(password)) {
      return NextResponse.json({ error: "Password must include at least one number." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user || !user.resetToken || !user.resetTokenExpiry) {
      return NextResponse.json({ error: "Session expired. Please start again." }, { status: 400 });
    }

    // Check token is verified and not expired
    if (!user.resetToken.startsWith("VERIFIED:")) {
      return NextResponse.json({ error: "OTP not verified. Please verify your code first." }, { status: 400 });
    }

    if (new Date() > user.resetTokenExpiry) {
      return NextResponse.json({ error: "Session expired. Please start again." }, { status: 400 });
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(password, 10);

    // Update password and clear reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return NextResponse.json({ success: true, message: "Password reset successfully." });
  } catch (err) {
    console.error("Reset password error:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
