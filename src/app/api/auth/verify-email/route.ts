import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/auth";

const sendWelcomeEmail = async (name: string, email: string, role: string) => {
  const isTradie = role === "TRADIE";
  const subject = isTradie
    ? `Welcome to GeTradie, ${name}! Your tradie journey starts now 🔧`
    : `Welcome to GeTradie, ${name}! Post your first job today 🏠`;

  const html = isTradie ? `
    <div style="font-family:Arial,sans-serif;max-width:580px;margin:0 auto;background:#f8faff;">
      <!-- Header -->
      <div style="background:#0047AB;padding:32px 24px;border-radius:12px 12px 0 0;text-align:center;">
        <h1 style="color:#fff;margin:0;font-size:28px;font-weight:900;">GeTradie</h1>
        <p style="color:rgba(255,255,255,0.7);font-size:13px;margin:8px 0 0;">Australia's Only AI-Powered Tradie Marketplace</p>
      </div>

      <!-- Hero -->
      <div style="background:#fff;padding:36px 32px 24px;border-left:1px solid #e5e7eb;border-right:1px solid #e5e7eb;">
        <h2 style="color:#111827;font-size:22px;margin:0 0 12px;">G'day ${name}! 👋</h2>
        <p style="color:#6B7280;font-size:15px;line-height:1.7;margin:0 0 20px;">
          Welcome to GeTradie — Australia's smarter way for tradies to find genuine local jobs. 
          Your account is now verified and ready to go!
        </p>

        <!-- Orange divider -->
        <div style="height:4px;background:linear-gradient(90deg,#F97316,#0047AB);border-radius:4px;margin:0 0 28px;"></div>

        <!-- What you can do -->
        <h3 style="color:#111827;font-size:16px;margin:0 0 16px;">Here's what you can do on GeTradie:</h3>
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="padding:10px 12px;background:#EFF6FF;border-radius:10px;margin-bottom:8px;vertical-align:top;width:40px;">📋</td>
            <td style="padding:10px 12px;background:#EFF6FF;border-radius:10px;">
              <strong style="color:#1D4ED8;">Get Job Leads Instantly</strong><br>
              <span style="color:#6B7280;font-size:13px;">Job leads matching your trade and suburb are sent to you automatically — no searching required</span>
            </td>
          </tr>
          <tr><td colspan="2" style="height:8px;"></td></tr>
          <tr>
            <td style="padding:10px 12px;background:#FFF7ED;border-radius:10px;vertical-align:top;width:40px;">💰</td>
            <td style="padding:10px 12px;background:#FFF7ED;border-radius:10px;">
              <strong style="color:#C2410C;">Send Quotes</strong><br>
              <span style="color:#6B7280;font-size:13px;">Your first 3 quotes are FREE. After that, just a flat monthly subscription — no per-lead fees ever!</span>
            </td>
          </tr>
          <tr><td colspan="2" style="height:8px;"></td></tr>
          <tr>
            <td style="padding:10px 12px;background:#F0FDF4;border-radius:10px;vertical-align:top;width:40px;">⭐</td>
            <td style="padding:10px 12px;background:#F0FDF4;border-radius:10px;">
              <strong style="color:#15803D;">Build Your Reputation</strong><br>
              <span style="color:#6B7280;font-size:13px;">Earn verified reviews and ratings. The more jobs you complete, the more leads you receive</span>
            </td>
          </tr>
          <tr><td colspan="2" style="height:8px;"></td></tr>
          <tr>
            <td style="padding:10px 12px;background:#EFF6FF;border-radius:10px;vertical-align:top;width:40px;">🛡️</td>
            <td style="padding:10px 12px;background:#EFF6FF;border-radius:10px;">
              <strong style="color:#1D4ED8;">Payment Protection</strong><br>
              <span style="color:#6B7280;font-size:13px;">Lock amount held securely — you always get paid for your work</span>
            </td>
          </tr>
        </table>

        <!-- CTA Button -->
        <div style="text-align:center;margin:32px 0 8px;">
          <a href="https://getradie.com.au/tradie-jobs" style="background:#F97316;color:#fff;padding:14px 36px;border-radius:12px;font-weight:900;font-size:15px;text-decoration:none;display:inline-block;box-shadow:0 4px 14px rgba(249,115,22,0.4);">
            View Job Leads Now →
          </a>
        </div>
        <p style="text-align:center;color:#9CA3AF;font-size:12px;margin:12px 0 0;">No commitment required. Your first 3 quotes are free.</p>

        <!-- Tips -->
        <div style="background:#FEF3C7;border-left:4px solid #F97316;border-radius:8px;padding:16px;margin:28px 0 0;">
          <p style="color:#92400E;font-size:13px;margin:0 0 8px;font-weight:700;">💡 Pro Tips to Win More Jobs:</p>
          <ul style="color:#92400E;font-size:13px;margin:0;padding-left:20px;line-height:1.8;">
            <li>Complete your profile — add a photo and bio</li>
            <li>Respond to quotes quickly — speed wins jobs</li>
            <li>Chat with homeowners before quoting to understand the scope</li>
            <li>Ask every happy customer for a review</li>
          </ul>
        </div>
      </div>

      <!-- Footer -->
      <div style="background:#F8FAFF;padding:24px;border-radius:0 0 12px 12px;border:1px solid #e5e7eb;border-top:none;text-align:center;">
        <p style="color:#6B7280;font-size:13px;margin:0 0 8px;">Need help? We're here for you.</p>
        <p style="color:#6B7280;font-size:13px;margin:0;">
          📧 <a href="mailto:support@getradie.com.au" style="color:#0047AB;">support@getradie.com.au</a>
        </p>
        <p style="color:#9CA3AF;font-size:11px;margin:16px 0 0;">GeTradie Pty Ltd &bull; Parramatta NSW 2150 &bull; getradie.com.au</p>
      </div>
    </div>
  ` : `
    <div style="font-family:Arial,sans-serif;max-width:580px;margin:0 auto;background:#f8faff;">
      <!-- Header -->
      <div style="background:#0047AB;padding:32px 24px;border-radius:12px 12px 0 0;text-align:center;">
        <h1 style="color:#fff;margin:0;font-size:28px;font-weight:900;">GeTradie</h1>
        <p style="color:rgba(255,255,255,0.7);font-size:13px;margin:8px 0 0;">Australia's Only AI-Powered Tradie Marketplace</p>
      </div>

      <!-- Hero -->
      <div style="background:#fff;padding:36px 32px 24px;border-left:1px solid #e5e7eb;border-right:1px solid #e5e7eb;">
        <h2 style="color:#111827;font-size:22px;margin:0 0 12px;">G'day ${name}! 👋</h2>
        <p style="color:#6B7280;font-size:15px;line-height:1.7;margin:0 0 20px;">
          Welcome to GeTradie — Australia's smarter way to find and hire verified local tradies. 
          Your account is now verified and you're ready to post your first job!
        </p>

        <!-- Orange divider -->
        <div style="height:4px;background:linear-gradient(90deg,#0047AB,#F97316);border-radius:4px;margin:0 0 28px;"></div>

        <!-- What you can do -->
        <h3 style="color:#111827;font-size:16px;margin:0 0 16px;">Here's what you can do on GeTradie:</h3>
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="padding:10px 12px;background:#EFF6FF;border-radius:10px;vertical-align:top;width:40px;">🤖</td>
            <td style="padding:10px 12px;background:#EFF6FF;border-radius:10px;">
              <strong style="color:#1D4ED8;">Get an AI Price Estimate</strong><br>
              <span style="color:#6B7280;font-size:13px;">Know the fair price BEFORE you post — so you're never overcharged</span>
            </td>
          </tr>
          <tr><td colspan="2" style="height:8px;"></td></tr>
          <tr>
            <td style="padding:10px 12px;background:#FFF7ED;border-radius:10px;vertical-align:top;width:40px;">📝</td>
            <td style="padding:10px 12px;background:#FFF7ED;border-radius:10px;">
              <strong style="color:#C2410C;">Post a Job — Always Free</strong><br>
              <span style="color:#6B7280;font-size:13px;">Describe your job and let verified tradies come to you with quotes</span>
            </td>
          </tr>
          <tr><td colspan="2" style="height:8px;"></td></tr>
          <tr>
            <td style="padding:10px 12px;background:#F0FDF4;border-radius:10px;vertical-align:top;width:40px;">💬</td>
            <td style="padding:10px 12px;background:#F0FDF4;border-radius:10px;">
              <strong style="color:#15803D;">Chat Before You Commit</strong><br>
              <span style="color:#6B7280;font-size:13px;">Message tradies directly to clarify your job before accepting any quote</span>
            </td>
          </tr>
          <tr><td colspan="2" style="height:8px;"></td></tr>
          <tr>
            <td style="padding:10px 12px;background:#EFF6FF;border-radius:10px;vertical-align:top;width:40px;">🛡️</td>
            <td style="padding:10px 12px;background:#EFF6FF;border-radius:10px;">
              <strong style="color:#1D4ED8;">Hire With Confidence</strong><br>
              <span style="color:#6B7280;font-size:13px;">All tradies are licence-verified. Lock amount protects you until the job is done right</span>
            </td>
          </tr>
        </table>

        <!-- CTA Button -->
        <div style="text-align:center;margin:32px 0 8px;">
          <a href="https://getradie.com.au/post-job" style="background:#0047AB;color:#fff;padding:14px 36px;border-radius:12px;font-weight:900;font-size:15px;text-decoration:none;display:inline-block;box-shadow:0 4px 14px rgba(0,71,171,0.4);">
            Post Your First Job Free →
          </a>
        </div>
        <p style="text-align:center;color:#9CA3AF;font-size:12px;margin:12px 0 0;">It only takes 2 minutes. Always free for homeowners.</p>

        <!-- Tips -->
        <div style="background:#EFF6FF;border-left:4px solid #0047AB;border-radius:8px;padding:16px;margin:28px 0 0;">
          <p style="color:#1E40AF;font-size:13px;margin:0 0 8px;font-weight:700;">💡 Tips for Getting the Best Results:</p>
          <ul style="color:#1E40AF;font-size:13px;margin:0;padding-left:20px;line-height:1.8;">
            <li>Add photos to your job post — tradies can quote more accurately</li>
            <li>Use the AI estimate to check if quotes are fair</li>
            <li>Chat with tradies before choosing — ask questions!</li>
            <li>Check tradie reviews and verified badge before hiring</li>
          </ul>
        </div>
      </div>

      <!-- Footer -->
      <div style="background:#F8FAFF;padding:24px;border-radius:0 0 12px 12px;border:1px solid #e5e7eb;border-top:none;text-align:center;">
        <p style="color:#6B7280;font-size:13px;margin:0 0 8px;">Need help? We're here for you.</p>
        <p style="color:#6B7280;font-size:13px;margin:0;">
          📧 <a href="mailto:support@getradie.com.au" style="color:#0047AB;">support@getradie.com.au</a>
        </p>
        <p style="color:#9CA3AF;font-size:11px;margin:16px 0 0;">GeTradie Pty Ltd &bull; Parramatta NSW 2150 &bull; getradie.com.au</p>
      </div>
    </div>
  `;

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "GeTradie <noreply@getradie.com.au>",
      to: email,
      subject,
      html,
    }),
  });
};

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

    // Send welcome email (non-blocking)
    sendWelcomeEmail(user.name, user.email, user.role).catch(err =>
      console.error("Welcome email error:", err)
    );

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