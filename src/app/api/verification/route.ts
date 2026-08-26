import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const config = {
  api: { bodyParser: { sizeLimit: "20mb" } },
};

// GET — get current verification status
export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  const decoded = verifyToken(token);
  if (!decoded || decoded.role !== "TRADIE") return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const tradieProfile = await prisma.tradieProfile.findUnique({
    where: { userId: decoded.id },
    include: { documents: true },
  });

  if (!tradieProfile) return NextResponse.json({ error: "Tradie profile not found" }, { status: 404 });

  return NextResponse.json({ tradieProfile });
}

// POST — submit verification documents
export async function POST(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  const decoded = verifyToken(token);
  if (!decoded || decoded.role !== "TRADIE") return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const {
    licenseNumber: licenceNumber, licenseState: licenceState, licenceExpiry, abn,
    licenceDocUrl, insuranceDocUrl, insurancePolicyNo, insuranceExpiry,
  } = await req.json();

  if (!licenceNumber || !licenceState) {
    return NextResponse.json({ error: "Licence number and state are required." }, { status: 400 });
  }
  if (!licenceDocUrl || licenceDocUrl.length < 10) {
    return NextResponse.json({ error: "Please upload a licence document." }, { status: 400 });
  }

  const tradieProfile = await prisma.tradieProfile.findUnique({ where: { userId: decoded.id } });
  if (!tradieProfile) return NextResponse.json({ error: "Tradie profile not found" }, { status: 404 });

  // Update tradie profile with verification details
  await prisma.tradieProfile.update({
    where: { userId: decoded.id },
    data: {
      licenseNumber: licenceNumber,
      licenceState: licenceState,
      licenceExpiry: licenceExpiry ? new Date(licenceExpiry) : null,
      abn: abn || null,
      insurancePolicyNo: insurancePolicyNo || null,
      insuranceExpiry: insuranceExpiry ? new Date(insuranceExpiry) : null,
      verificationStatus: "DOCS_SUBMITTED",
    },
  });

  // Delete old documents and create new ones
  await prisma.tradieDocument.deleteMany({ where: { tradieProfileId: tradieProfile.id } });

  // Create licence document record
  await prisma.tradieDocument.create({
    data: {
      tradieProfileId: tradieProfile.id,
      url: licenceDocUrl,
      documentType: "LICENCE",
      status: "PENDING",
      expiryDate: licenceExpiry ? new Date(licenceExpiry) : null,
    },
  });

  // Create insurance document record if provided
  if (insuranceDocUrl) {
    await prisma.tradieDocument.create({
      data: {
        tradieProfileId: tradieProfile.id,
        url: insuranceDocUrl,
        documentType: "INSURANCE",
        status: "PENDING",
        expiryDate: insuranceExpiry ? new Date(insuranceExpiry) : null,
      },
    });
  }

  // Notify admin via email
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "GeTradie <noreply@getradie.com.au>",
      to: "admin@getradie.au",
      subject: `New Tradie Verification Submission — ${tradieProfile.businessName}`,
      html: `
        <div style="font-family:Arial,sans-serif;padding:32px;max-width:500px;">
          <h2 style="color:#0047AB;">New Verification Submission</h2>
          <p><strong>Business:</strong> ${tradieProfile.businessName}</p>
          <p><strong>Specialty:</strong> ${tradieProfile.specialty}</p>
          <p><strong>Licence No:</strong> ${licenceNumber}</p>
          <p><strong>Licence State:</strong> ${licenceState}</p>
          <p><strong>ABN:</strong> ${abn || "Not provided"}</p>
          <p><strong>Insurance:</strong> ${insuranceDocUrl ? "Provided" : "Not provided"}</p>
          <a href="https://getradie.com.au/admin" style="background:#0047AB;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block;margin-top:16px;font-weight:bold;">
            Review in Admin Dashboard →
          </a>
        </div>
      `,
    }),
  }).catch(err => console.error("Admin notification error:", err));

  // Send confirmation to tradie
  const user = await prisma.user.findUnique({ where: { id: decoded.id } });
  if (user) {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "GeTradie <noreply@getradie.com.au>",
        to: user.email,
        subject: "GeTradie — Verification documents received 📋",
        html: `
          <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;">
            <div style="background:#0047AB;padding:28px;border-radius:12px 12px 0 0;text-align:center;">
              <h1 style="color:#fff;margin:0;font-size:24px;">GeTradie</h1>
            </div>
            <div style="background:#fff;padding:32px;border:1px solid #e5e7eb;border-radius:0 0 12px 12px;">
              <h2 style="color:#111827;">Documents received, ${user.name}! 📋</h2>
              <p style="color:#6B7280;font-size:15px;line-height:1.7;">
                Thank you for submitting your verification documents. Our team will review them within <strong>24-48 hours</strong>.
              </p>
              <div style="background:#EFF6FF;border-left:4px solid #0047AB;border-radius:8px;padding:16px;margin:24px 0;">
                <p style="color:#1E40AF;font-size:13px;margin:0;font-weight:700;">What happens next?</p>
                <ul style="color:#1E40AF;font-size:13px;margin:8px 0 0;padding-left:20px;line-height:1.8;">
                  <li>Our team reviews your licence and documents</li>
                  <li>You'll receive an email once verified (24-48 hours)</li>
                  <li>Once approved, you can start quoting on jobs</li>
                </ul>
              </div>
              <p style="color:#6B7280;font-size:13px;">Need help? Email us at <a href="mailto:support@getradie.com.au" style="color:#0047AB;">support@getradie.com.au</a></p>
            </div>
          </div>
        `,
      }),
    }).catch(err => console.error("Tradie confirmation email error:", err));
  }

  return NextResponse.json({ success: true, message: "Documents submitted successfully. Under review within 24-48 hours." });
}
