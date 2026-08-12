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
        from: "GeTradie <noreply@getradie.com.au>",
        to: user.email,
        subject: "Your GeTradie Password Reset Code",
        html: `
          <div style="font-family:Arial,sans-serif;padding:40px;max-width:500px;margin:0 auto;">
            <div style="background:#0047AB;padding:24px;border-radius:12px 12px 0 0;text-align:center;">
              <h1 style="color:#fff;margin:0;font-size:24px;">GeTradie</h1>
              <p style="color:rgba(255,255,255,0.7);font-size:13px;margin:8px 0 0;">Australia's Only AI-Powered Tradie Marketplace</p>
            </div>
            <div style="background:#fff;padding:32px;border:1px solid #e5e7eb;border-radius:0 0 12px 12px;">
              <h2 style="color:#111827;font-size:20px;margin:0 0 8px;">Password Reset Request</h2>
              <p style="color:#6B7280;font-size:15px;line-height:1.6;">Hi ${user.name},<br><br>Use the code below to reset your GeTradie password.</p>
              <div style="background:#EFF6FF;border:2px solid #BFDBFE;border-radius:12px;padding:24px;text-align:center;margin:24px 0;">
                <p style="color:#6B7280;font-size:12px;margin:0 0 8px;text-transform:uppercase;letter-spacing:1px;">Your One-Time Code</p>
                <p style="font-size:42px;font-weight:900;color:#0047AB;letter-spacing:10px;margin:0;font-family:monospace;">${otp}</p>
                <p style="color:#9CA3AF;font-size:12px;margin:12px 0 0;">Expires in <strong>15 minutes</strong></p>
              </div>
              <div style="background:#FEF3C7;border-left:4px solid #F97316;border-radius:8px;padding:14px 16px;">
                <p style="color:#92400E;font-size:13px;margin:0;">Did not request this? Ignore this email — your password will not change.</p>
              </div>
            </div>
            <div style="padding:20px;text-align:center;">
              <p style="color:#9CA3AF;font-size:12px;margin:0;">GeTradie Pty Ltd &bull; Parramatta NSW 2150 &bull; getradie.com.au</p>
            </div>
          </div>
        `,
      }),
    });

    if (!resendRes.ok) {
      const err = await resendRes.json();
      console.error("Resend error:", err);
      return NextResponse.json({ error: "Failed to send email. Please try again." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Forgot password error:", err?.message);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}