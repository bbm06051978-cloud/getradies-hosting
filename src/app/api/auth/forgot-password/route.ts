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
    const apiKey = process.env.RESEND_API_KEY;
    const payload = {
      from: "GeTradie <noreply@getradie.com.au>",
      to: user.email,
      subject: "Your GeTradie Password Reset Code",
      html: `<div style="font-family:Arial,sans-serif;padding:40px;max-width:500px;margin:0 auto;"><div style="background:#0047AB;padding:24px;border-radius:12px 12px 0 0;text-align:center;"><h1 style="color:#fff;margin:0;font-size:24px;">GeTradie</h1></div><div style="background:#fff;padding:32px;border:1px solid #e5e7eb;border-radius:0 0 12px 12px;"><p style="color:#374151;font-size:15px;">Hi ${user.name},</p><p style="color:#374151;font-size:15px;">Your password reset code is:</p><div style="background:#EFF6FF;border:2px solid #BFDBFE;border-radius:12px;padding:24px;text-align:center;margin:24px 0;"><p style="font-size:42px;font-weight:900;color:#0047AB;letter-spacing:10px;margin:0;font-family:monospace;">${otp}</p><p style="color:#9CA3AF;font-size:12px;margin:12px 0 0;">Expires in 15 minutes</p></div><p style="color:#6B7280;font-size:13px;">If you did not request this, ignore this email.</p></div></div>`,
    };
    console.log("Sending to:", user.email);
    console.log("API key starts with:", apiKey?.substring(0, 8));
    console.log("Payload from:", payload.from);
    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const resendData = await resendRes.json();
    console.log("Resend status:", resendRes.status);
    console.log("Resend response:", JSON.stringify(resendData));
    if (!resendRes.ok) {
      return NextResponse.json({ 
        error: "Email failed", 
        status: resendRes.status,
        details: resendData 
      }, { status: 500 });
    }
    return NextResponse.json({ success: true, emailId: resendData.id });
  } catch (err: any) {
    console.error("Error:", err?.message);
    return NextResponse.json({ error: err?.message || "unknown" }, { status: 500 });
  }
}
