// src/app/api/auth/forgot-password/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import crypto from "crypto";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    // Find user
    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });

    // Always return success to prevent email enumeration
    if (!user) {
      return NextResponse.json({ success: true, message: "If that email exists, an OTP has been sent." });
    }

    // Generate 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Store OTP in resetToken field (format: "OTP:expiry")
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken: otp,
        resetTokenExpiry: otpExpiry,
      },
    });

    // Send email via Resend
    await resend.emails.send({
      from: "GeTradie <noreply@getradie.com.au>",
      to: user.email,
      subject: "Your GeTradie Password Reset Code",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin:0;padding:0;background:#F8FAFF;font-family:Calibri,Arial,sans-serif;">
          <div style="max-width:520px;margin:40px auto;background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(0,71,171,0.08);">
            
            <!-- Header -->
            <div style="background:linear-gradient(135deg,#0047AB,#003d99);padding:32px 40px;text-align:center;">
              <h1 style="color:#fff;font-size:28px;font-weight:900;margin:0;">GeTradie</h1>
              <p style="color:rgba(255,255,255,0.7);font-size:13px;margin:8px 0 0;">Australia's Only AI-Powered Tradie Marketplace</p>
            </div>

            <!-- Body -->
            <div style="padding:40px;">
              <h2 style="color:#111827;font-size:20px;font-weight:800;margin:0 0 8px;">Password Reset Request</h2>
              <p style="color:#6B7280;font-size:15px;margin:0 0 24px;line-height:1.6;">
                Hi ${user.name},<br><br>
                We received a request to reset your GeTradie password. Use the code below to proceed.
              </p>

              <!-- OTP Box -->
              <div style="background:#EFF6FF;border:2px solid #BFDBFE;border-radius:16px;padding:32px;text-align:center;margin:0 0 24px;">
                <p style="color:#6B7280;font-size:13px;font-weight:600;margin:0 0 12px;text-transform:uppercase;letter-spacing:1px;">Your One-Time Code</p>
                <div style="font-size:48px;font-weight:900;color:#0047AB;letter-spacing:12px;font-family:monospace;">${otp}</div>
                <p style="color:#9CA3AF;font-size:12px;margin:16px 0 0;">This code expires in <strong>15 minutes</strong></p>
              </div>

              <!-- Warning -->
              <div style="background:#FEF3C7;border-left:4px solid #F97316;border-radius:8px;padding:14px 16px;margin:0 0 24px;">
                <p style="color:#92400E;font-size:13px;margin:0;line-height:1.5;">
                  <strong>Did not request this?</strong> Ignore this email — your password will not change and this code will expire automatically.
                </p>
              </div>

              <p style="color:#9CA3AF;font-size:13px;margin:0;line-height:1.6;">
                For security, never share this code with anyone. GeTradie will never ask for your OTP by phone or chat.
              </p>
            </div>

            <!-- Footer -->
            <div style="background:#F8FAFF;padding:20px 40px;text-align:center;border-top:1px solid #F1F5F9;">
              <p style="color:#9CA3AF;font-size:12px;margin:0;">
                GeTradie Pty Ltd &bull; Parramatta NSW 2150<br>
                <a href="https://getradie.com.au" style="color:#0047AB;text-decoration:none;">getradie.com.au</a>
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    return NextResponse.json({ success: true, message: "If that email exists, an OTP has been sent." });
  } catch (err) {
    console.error("Forgot password error:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
