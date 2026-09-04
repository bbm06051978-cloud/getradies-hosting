import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function verifyAdmin(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) return null;
  const decoded = verifyToken(token);
  if (!decoded || decoded.role !== "ADMIN") return null;
  return decoded;
}

// GET — list all tradies pending verification
export async function GET(req: NextRequest) {
  const admin = await verifyAdmin(req);
  if (!admin) return NextResponse.json({ error: "Not authorised." }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") || "DOCS_SUBMITTED";

  const tradies = await prisma.tradieProfile.findMany({
    where: { verificationStatus: status as any },
    include: {
      user: { select: { id: true, name: true, email: true, phone: true, createdAt: true } },
      documents: true,
    },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json({ tradies });
}

// PATCH — approve or reject a tradie
export async function PATCH(req: NextRequest) {
  const admin = await verifyAdmin(req);
  if (!admin) return NextResponse.json({ error: "Not authorised." }, { status: 403 });

  const { tradieProfileId, action, notes } = await req.json();

  if (!tradieProfileId || !action) {
    return NextResponse.json({ error: "tradieProfileId and action are required." }, { status: 400 });
  }

  const tradieProfile = await prisma.tradieProfile.findUnique({
    where: { id: tradieProfileId },
    include: { user: true, documents: true },
  });

  if (!tradieProfile) return NextResponse.json({ error: "Tradie not found." }, { status: 404 });

  if (action === "APPROVE") {
    // Update tradie profile
    await prisma.tradieProfile.update({
      where: { id: tradieProfileId },
      data: {
        isVerified: true,
        verificationStatus: "APPROVED",
        verificationDate: new Date(),
        verificationNotes: notes || null,
      },
    });

    // Update all pending documents to approved
    await prisma.tradieDocument.updateMany({
      where: { tradieProfileId, status: "PENDING" },
      data: { status: "APPROVED", verifiedAt: new Date() },
    });

    // Send approval email to tradie
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "GeTradie <noreply@getradie.com.au>",
        to: tradieProfile.user.email,
        subject: `You're verified on GeTradie! Start quoting now 🎉`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;">
            <div style="background:#0047AB;padding:28px;border-radius:12px 12px 0 0;text-align:center;">
              <h1 style="color:#fff;margin:0;font-size:24px;">GeTradie</h1>
            </div>
            <div style="background:#fff;padding:32px;border:1px solid #e5e7eb;border-radius:0 0 12px 12px;">
              <h2 style="color:#111827;">Congratulations ${tradieProfile.user.name}! ✅</h2>
              <p style="color:#6B7280;font-size:15px;line-height:1.7;">
                Your GeTradie account has been <strong>verified</strong>! You can now quote on jobs in your area.
              </p>
              <div style="background:#F0FDF4;border-left:4px solid #16803C;border-radius:8px;padding:16px;margin:24px 0;">
                <p style="color:#15803D;font-size:13px;margin:0;font-weight:700;">Your Verified Tradie badge is now active</p>
                <ul style="color:#15803D;font-size:13px;margin:8px 0 0;padding-left:20px;line-height:1.8;">
                  <li>Browse available jobs in your area</li>
                  <li>Send unlimited quotes (after free quota)</li>
                  <li>Build your reputation with reviews</li>
                  <li>Get paid securely via GeTradie</li>
                </ul>
              </div>
              <div style="text-align:center;margin:28px 0;">
                <a href="https://getradie.com.au/tradie-jobs" style="background:#F97316;color:#fff;padding:14px 32px;border-radius:12px;font-weight:900;font-size:15px;text-decoration:none;display:inline-block;">
                  View Job Leads Now →
                </a>
              </div>
              ${notes ? `<div style="background:#FFF7ED;border-left:4px solid #F97316;border-radius:8px;padding:14px;margin-top:16px;"><p style="color:#92400E;font-size:13px;margin:0;"><strong>Note from GeTradie team:</strong> ${notes}</p></div>` : ""}
              <p style="color:#6B7280;font-size:13px;margin-top:24px;">Questions? Email <a href="mailto:support@getradie.com.au" style="color:#0047AB;">support@getradie.com.au</a></p>
            </div>
          </div>
        `,
      }),
    }).catch(err => console.error("Approval email error:", err));

    // Create in-app notification
    await prisma.notification.create({
      data: {
        userId: tradieProfile.userId,
        title: "Account Verified! 🎉",
        message: "Your GeTradie account is now verified. You can start quoting on jobs.",
        type: "VERIFICATION_APPROVED",
      } as any,
    }).catch(() => {});

    return NextResponse.json({ success: true, message: "Tradie approved successfully." });

  } else if (action === "REJECT") {
    if (!notes) return NextResponse.json({ error: "Rejection reason is required." }, { status: 400 });

    await prisma.tradieProfile.update({
      where: { id: tradieProfileId },
      data: {
        isVerified: false,
        verificationStatus: "REJECTED",
        verificationNotes: notes,
      },
    });

    await prisma.tradieDocument.updateMany({
      where: { tradieProfileId, status: "PENDING" },
      data: { status: "REJECTED", rejectedAt: new Date(), rejectionNote: notes },
    });

    // Send rejection email
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "GeTradie <noreply@getradie.com.au>",
        to: tradieProfile.user.email,
        subject: "GeTradie — Action required for your verification",
        html: `
          <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;">
            <div style="background:#0047AB;padding:28px;border-radius:12px 12px 0 0;text-align:center;">
              <h1 style="color:#fff;margin:0;font-size:24px;">GeTradie</h1>
            </div>
            <div style="background:#fff;padding:32px;border:1px solid #e5e7eb;border-radius:0 0 12px 12px;">
              <h2 style="color:#111827;">Verification — Action Required</h2>
              <p style="color:#6B7280;font-size:15px;line-height:1.7;">
                Hi ${tradieProfile.user.name}, we were unable to verify your account with the documents provided.
              </p>
              <div style="background:#FEF2F2;border-left:4px solid #D92D20;border-radius:8px;padding:16px;margin:24px 0;">
                <p style="color:#991B1B;font-size:13px;margin:0;font-weight:700;">Reason:</p>
                <p style="color:#991B1B;font-size:13px;margin:8px 0 0;">${notes}</p>
              </div>
              <p style="color:#6B7280;font-size:14px;">Please re-upload your documents addressing the issue above.</p>
              <div style="text-align:center;margin:28px 0;">
                <a href="https://getradie.com.au/tradie-verification" style="background:#0047AB;color:#fff;padding:14px 32px;border-radius:12px;font-weight:900;font-size:15px;text-decoration:none;display:inline-block;">
                  Re-submit Documents →
                </a>
              </div>
              <p style="color:#6B7280;font-size:13px;">Need help? Email <a href="mailto:support@getradie.com.au" style="color:#0047AB;">support@getradie.com.au</a></p>
            </div>
          </div>
        `,
      }),
    }).catch(err => console.error("Rejection email error:", err));

    return NextResponse.json({ success: true, message: "Tradie rejected. Notification sent." });

  } else if (action === "MORE_INFO") {
    if (!notes) return NextResponse.json({ error: "Please specify what info is needed." }, { status: 400 });

    await prisma.tradieProfile.update({
      where: { id: tradieProfileId },
      data: { verificationStatus: "MORE_INFO_REQUIRED", verificationNotes: notes },
    });

    // Send more info email
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "GeTradie <noreply@getradie.com.au>",
        to: tradieProfile.user.email,
        subject: "GeTradie — Additional information needed for verification",
        html: `
          <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;">
            <div style="background:#0047AB;padding:28px;border-radius:12px 12px 0 0;text-align:center;">
              <h1 style="color:#fff;margin:0;font-size:24px;">GeTradie</h1>
            </div>
            <div style="background:#fff;padding:32px;border:1px solid #e5e7eb;border-radius:0 0 12px 12px;">
              <h2 style="color:#111827;">Additional Information Required</h2>
              <p style="color:#6B7280;font-size:15px;line-height:1.7;">
                Hi ${tradieProfile.user.name}, we need a little more information to complete your verification.
              </p>
              <div style="background:#FFF7ED;border-left:4px solid #F97316;border-radius:8px;padding:16px;margin:24px 0;">
                <p style="color:#92400E;font-size:13px;margin:0;font-weight:700;">What we need:</p>
                <p style="color:#92400E;font-size:13px;margin:8px 0 0;">${notes}</p>
              </div>
              <div style="text-align:center;margin:28px 0;">
                <a href="https://getradie.com.au/tradie-verification" style="background:#F97316;color:#fff;padding:14px 32px;border-radius:12px;font-weight:900;font-size:15px;text-decoration:none;display:inline-block;">
                  Upload Additional Documents →
                </a>
              </div>
            </div>
          </div>
        `,
      }),
    }).catch(err => console.error("More info email error:", err));

    return NextResponse.json({ success: true, message: "More info requested. Tradie notified." });
  }

  return NextResponse.json({ error: "Invalid action." }, { status: 400 });
}
