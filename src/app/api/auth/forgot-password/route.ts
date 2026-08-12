import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  const results: any = {};
  try {
    const { email } = await req.json();
    results.email = email;

    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
    results.userFound = !!user;
    results.userId = user?.id;

    if (!user) return NextResponse.json({ success: true, debug: results });

    const otp = crypto.randomInt(100000, 999999).toString();
    results.otp = otp;

    try {
      await prisma.user.update({
        where: { id: user.id },
        data: { resetToken: otp, resetTokenExpiry: new Date(Date.now() + 15 * 60 * 1000) },
      });
      results.dbUpdated = true;
    } catch (dbErr: any) {
      results.dbError = dbErr?.message;
      return NextResponse.json({ error: "DB update failed", debug: results }, { status: 500 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    results.hasApiKey = !!apiKey;
    results.apiKeyStart = apiKey?.substring(0, 8);

    try {
      const resendRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "GeTradie <noreply@getradie.com.au>",
          to: user.email,
          subject: "Your GeTradie Password Reset Code",
          html: `<p>Hi ${user.name}, your code is: <strong>${otp}</strong>. Expires in 15 minutes.</p>`,
        }),
      });
      const resendData = await resendRes.json();
      results.resendStatus = resendRes.status;
      results.resendData = resendData;

      if (!resendRes.ok) {
        return NextResponse.json({ error: "Resend failed", debug: results }, { status: 500 });
      }
    } catch (emailErr: any) {
      results.emailError = emailErr?.message;
      return NextResponse.json({ error: "Email fetch failed", debug: results }, { status: 500 });
    }

    return NextResponse.json({ success: true, debug: results });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message, debug: results }, { status: 500 });
  }
}