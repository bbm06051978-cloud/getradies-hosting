import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email, suburb } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email is required." }, { status: 400 });
    }

    // Send notification to admin
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "GeTradie <noreply@getradie.com.au>",
        to: "admin@getradie.com.au",
        subject: `New waitlist signup — ${email}`,
        html: `
          <div style="font-family:Arial,sans-serif;padding:24px;max-width:480px;">
            <h2 style="color:#0047AB;">New Waitlist Signup</h2>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Suburb:</strong> ${suburb || "Not provided"}</p>
            <p style="color:#667085;font-size:13px;">They are outside the Greater Parramatta pilot area.</p>
          </div>
        `,
      }),
    });

    // Send confirmation to user
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "GeTradie <noreply@getradie.com.au>",
        to: email,
        subject: "You're on the GeTradie waitlist! 🚀",
        html: `
          <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;">
            <div style="background:#0047AB;padding:28px;border-radius:12px 12px 0 0;text-align:center;">
              <h1 style="color:#fff;margin:0;font-size:24px;">GeTradie</h1>
            </div>
            <div style="background:#fff;padding:32px;border:1px solid #e5e7eb;border-radius:0 0 12px 12px;">
              <h2 style="color:#111827;">You're on the list! 🎉</h2>
              <p style="color:#6B7280;font-size:15px;line-height:1.7;">
                Thanks for your interest in GeTradie${suburb ? ` from ${suburb}` : ""}! We're currently serving the <strong>Greater Parramatta</strong> region and expanding fast.
              </p>
              <p style="color:#6B7280;font-size:15px;line-height:1.7;">
                We'll send you an email the moment GeTradie launches in your area.
              </p>
              <div style="background:#EFF6FF;border-left:4px solid #0047AB;border-radius:8px;padding:16px;margin:24px 0;">
                <p style="color:#1E40AF;font-size:13px;margin:0;font-weight:700;">Currently serving:</p>
                <p style="color:#1E40AF;font-size:13px;margin:8px 0 0;">Parramatta · Blacktown · Bankstown · Liverpool · Castle Hill · Fairfield · Auburn · Merrylands · Ryde · Strathfield and surrounds</p>
              </div>
              <p style="color:#6B7280;font-size:13px;">Questions? Email <a href="mailto:support@getradie.com.au" style="color:#0047AB;">support@getradie.com.au</a></p>
            </div>
          </div>
        `,
      }),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Waitlist error:", err);
    return NextResponse.json({ error: "Failed to join waitlist." }, { status: 500 });
  }
}
