// src/app/api/auth/forgot-password/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: "Email is required." }, { status: 400 });
    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
    if (!user) return NextResponse.json({ success: true });
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpiry = new Date(Date.now() + 15 * 60 * 1000);
    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken: otp, resetTokenExpiry: otpExpiry },
    });
    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "GeTradie <onboarding@resend.dev>",
        to: user.email,
        subject: "Your GeTradie Password Reset Code",
        html: `<div style="font-family:Arial,sans-serif;max-width:520px;margin:40px auto;background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(0,71,171,0.08);"><div style="background:linear-gradient(135deg,#0047AB,#003d99);padding:32px 40px;text-align:center;"><h1 style="color:#fff;font-size:28px;font-weight:900;margin:0;">GeTradie</h1><p style="color:rgba(255,255,255,0.7);font-size:13px;margin:8px 0 0;">Australia is Only AI-Powered Tradie Marketplace</p></div><div style="padding:40px;"><h2 style="color:#111827;font-size:20px;font-weight:800;margin:0 0 8px;">Password Reset Request</h2><p style="color:#6B7280;font-size:15px;margin:0 0 24px;line-height:1.6;">Hi ${user.name},<br><br>Use the code below to reset your GeTradie password.</p><div style="background:#EFF6FF;border:2px solid #BFDBFE;border-radius:16px;padding:32px;text-align:center;margin:0 0 24px;"><p style="color:#6B7280;font-size:13px;font-weight:600;margin:0 0 12px;text-transform:uppercase;letter-spacing:1px;">Your One-Time Code</p><div style="font-size:48px;font-weight:900;color:#0047AB;letter-spacing:12px;font-family:monospace;">${otp}</div><p style="color:#9CA3AF;font-size:12px;margin:16px 0 0;">Expires in <strong>15 minutes</strong></p></div><div style="background:#FEF3C7;border-left:4px solid #F97316;border-radius:8px;padding:14px 16px;"><p style="color:#92400E;font-size:13px;margin:0;">Did not request this? Ignore this email.</p></div></div><div style="background:#F8FAFF;padding:20px 40px;text-align:center;border-top:1px solid #F1F5F9;"><p style="color:#9CA3AF;font-size:12px;margin:0;">GeTradie Pty Ltd &bull; Parramatta NSW 2150</p></div></div>`,
      }),
    });
    const resendData = await resendRes.json();
    console.log("Resend response:", JSON.stringify(resendData));
    if (!resendRes.ok) {
      console.error("Resend error:", resendData);
      return NextResponse.json({ error: "Failed to send email. Please try again." }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Forgot password error:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
