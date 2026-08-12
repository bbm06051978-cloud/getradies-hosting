// src/app/api/auth/forgot-password/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
export async function POST(req: NextRequest) {
  try {
    console.log("Step 1: parsing request");
    const { email } = await req.json();
    console.log("Step 2: email =", email);
    if (!email) return NextResponse.json({ error: "Email is required." }, { status: 400 });
    console.log("Step 3: finding user");
    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
    console.log("Step 4: user found =", !!user);
    if (!user) return NextResponse.json({ success: true });
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpiry = new Date(Date.now() + 15 * 60 * 1000);
    console.log("Step 5: otp generated =", otp);
    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken: otp, resetTokenExpiry: otpExpiry },
    });
    console.log("Step 6: otp saved to db");
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
        html: `<div style="font-family:Arial,sans-serif;padding:40px;"><h1 style="color:#0047AB;">GeTradie</h1><p>Hi ${user.name},</p><p>Your password reset code is:</p><h2 style="color:#0047AB;letter-spacing:8px;font-size:36px;">${otp}</h2><p>This code expires in 15 minutes.</p></div>`,
      }),
    });
    console.log("Step 7: resend status =", resendRes.status);
    const resendData = await resendRes.json();
    console.log("Step 8: resend response =", JSON.stringify(resendData));
    if (!resendRes.ok) {
      return NextResponse.json({ error: "Failed to send email: " + JSON.stringify(resendData) }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("FULL ERROR:", err?.message, err?.stack);
    return NextResponse.json({ error: "Server error: " + (err?.message || "unknown") }, { status: 500 });
  }
}
