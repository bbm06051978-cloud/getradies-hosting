import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/auth";
export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json();
    if (!email || !otp) {
      return NextResponse.json({ error: "Email and verification code are required." }, { status: 400 });
    }
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });
    if (!user || !user.otpCode || !user.otpExpiry) {
      return NextResponse.json({ error: "Invalid or expired code. Please register again." }, { status: 400 });
    }
    if (new Date() > user.otpExpiry) {
      return NextResponse.json({ error: "This code has expired. Please register again." }, { status: 400 });
    }
    if (user.otpCode !== otp.trim()) {
      return NextResponse.json({ error: "Incorrect code. Please check and try again." }, { status: 400 });
    }
    // Verify user and clear OTP
    await prisma.user.update({
      where: { id: user.id },
      data: { isVerified: true, otpCode: null, otpExpiry: null },
    });
    const token = signToken({
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });
    const response = NextResponse.json({
      success: true,
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
    return response;
  } catch (err) {
    console.error("Verify email error:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
export async function PUT(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: "Email is required." }, { status: 400 });
    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
    if (!user) return NextResponse.json({ error: "User not found." }, { status: 404 });
    if (user.isVerified) return NextResponse.json({ error: "Account already verified." }, { status: 400 });
    const crypto = await import("crypto");
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpiry = new Date(Date.now() + 15 * 60 * 1000);
    await prisma.user.update({
      where: { id: user.id },
      data: { otpCode: otp, otpExpiry },
    });
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "GeTradie <noreply@getradie.com.au>",
        to: user.email,
        subject: "Your new GeTradie verification code",
        html: `<div style="font-family:Arial,sans-serif;padding:40px;max-width:500px;margin:0 auto;"><div style="background:#0047AB;padding:24px;border-radius:12px 12px 0 0;text-align:center;"><h1 style="color:#fff;margin:0;">GeTradie</h1></div><div style="background:#fff;padding:32px;border:1px solid #e5e7eb;border-radius:0 0 12px 12px;"><h2 style="color:#111827;">New Verification Code</h2><div style="background:#EFF6FF;border:2px solid #BFDBFE;border-radius:12px;padding:24px;text-align:center;margin:24px 0;"><p style="font-size:42px;font-weight:900;color:#0047AB;letter-spacing:10px;margin:0;font-family:monospace;">${otp}</p><p style="color:#9CA3AF;font-size:12px;margin:12px 0 0;">Expires in 15 minutes</p></div></div></div>`,
      }),
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Resend OTP error:", err);
    return NextResponse.json({ error: "Failed to resend code." }, { status: 500 });
  }
}