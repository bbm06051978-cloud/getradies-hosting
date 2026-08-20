import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, password, role, suburb, state, businessName, specialty, abn } = await req.json();
    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: "Name, email, password and role are required." }, { status: 400 });
    }
    const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
    if (existing && existing.isVerified) {
      return NextResponse.json({ error: "An account with this email already exists." }, { status: 400 });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpiry = new Date(Date.now() + 15 * 60 * 1000);
    let user;
    if (existing && !existing.isVerified) {
      // Update existing unverified user
      user = await prisma.user.update({
        where: { email: email.toLowerCase().trim() },
        data: { name, phone, passwordHash, otpCode: otp, otpExpiry, suburb: suburb || null, state: state || "NSW" },
      });
    } else {
      user = await prisma.user.create({
        data: {
          name, email: email.toLowerCase().trim(), phone, passwordHash,
          role: role === "TRADIE" ? "TRADIE" : "HOMEOWNER",
          suburb: suburb || null, state: state || "NSW",
          isVerified: false, otpCode: otp, otpExpiry,
        },
      });
    }
    // Create tradie profile if tradie
    if (role === "TRADIE" && specialty) {
      const existingProfile = await prisma.tradieProfile.findUnique({ where: { userId: user.id } });
      if (!existingProfile) {
        await prisma.tradieProfile.create({
          data: {
            userId: user.id,
            businessName: businessName || name,
            specialty, isVerified: false, rating: 0, totalReviews: 0,
          },
        });
      }
    }
    // Send OTP email via Resend
    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "GeTradie <noreply@getradie.com.au>",
        to: email.toLowerCase().trim(),
        subject: "Verify your GeTradie account",
        html: `
          <div style="font-family:Arial,sans-serif;padding:40px;max-width:500px;margin:0 auto;">
            <div style="background:#0047AB;padding:24px;border-radius:12px 12px 0 0;text-align:center;">
              <h1 style="color:#fff;margin:0;font-size:24px;">GeTradie</h1>
              <p style="color:rgba(255,255,255,0.7);font-size:13px;margin:8px 0 0;">Australia's Only AI-Powered Tradie Marketplace</p>
            </div>
            <div style="background:#fff;padding:32px;border:1px solid #e5e7eb;border-radius:0 0 12px 12px;">
              <h2 style="color:#111827;font-size:20px;margin:0 0 8px;">Verify Your Email</h2>
              <p style="color:#6B7280;font-size:15px;line-height:1.6;">Hi ${name},<br><br>Welcome to GeTradie! Use the code below to verify your email address.</p>
              <div style="background:#EFF6FF;border:2px solid #BFDBFE;border-radius:12px;padding:24px;text-align:center;margin:24px 0;">
                <p style="color:#6B7280;font-size:12px;margin:0 0 8px;text-transform:uppercase;letter-spacing:1px;">Your Verification Code</p>
                <p style="font-size:42px;font-weight:900;color:#0047AB;letter-spacing:10px;margin:0;font-family:monospace;">${otp}</p>
                <p style="color:#9CA3AF;font-size:12px;margin:12px 0 0;">Expires in <strong>15 minutes</strong></p>
              </div>
              <div style="background:#F0FDF4;border-left:4px solid #10B981;border-radius:8px;padding:14px 16px;">
                <p style="color:#065F46;font-size:13px;margin:0;">Once verified, you can start posting jobs and connecting with tradies across Australia.</p>
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
      console.error("Resend error:", await resendRes.json());
      return NextResponse.json({ error: "Failed to send verification email. Please try again." }, { status: 500 });
    }
    return NextResponse.json({ success: true, requiresVerification: true, email: email.toLowerCase().trim() });
  } catch (err) {
    console.error("Register error:", err);
    return NextResponse.json({ error: "Registration failed. Please try again." }, { status: 500 });
  }
}