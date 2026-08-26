import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET - get current verification status
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

// POST - submit verification documents
export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== "TRADIE") return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

    const body = await req.json();
    const { licenceNumber, licenceState, licenceExpiry, abn, licenceDocUrl, insuranceDocUrl, insurancePolicyNo, insuranceExpiry } = body;

    console.log("Verification POST:", { licenceNumber, licenceState, hasDoc: !!licenceDocUrl });

    if (!licenceNumber || !licenceState) {
      return NextResponse.json({ error: "Licence number and state are required." }, { status: 400 });
    }

    const tradieProfile = await prisma.tradieProfile.findUnique({ where: { userId: decoded.id } });
    if (!tradieProfile) return NextResponse.json({ error: "Tradie profile not found" }, { status: 404 });

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

    await prisma.tradieDocument.deleteMany({ where: { tradieProfileId: tradieProfile.id } });

    if (licenceDocUrl) {
      await prisma.tradieDocument.create({
        data: {
          tradieProfileId: tradieProfile.id,
          url: licenceDocUrl,
          documentType: "LICENCE",
          status: "PENDING",
          expiryDate: licenceExpiry ? new Date(licenceExpiry) : null,
        },
      });
    }

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

    // Notify admin
    fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Authorization": `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "GeTradie <noreply@getradie.com.au>",
        to: "admin@getradie.au",
        subject: `New Tradie Verification - ${tradieProfile.businessName}`,
        html: `<p>New verification submission from <strong>${tradieProfile.businessName}</strong> (${tradieProfile.specialty}). Licence: ${licenceNumber} (${licenceState}). <a href="https://getradie.com.au/admin">Review in Admin</a></p>`,
      }),
    }).catch(err => console.error("Admin email error:", err));

    // Confirm to tradie
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (user) {
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "Authorization": `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: "GeTradie <noreply@getradie.com.au>",
          to: user.email,
          subject: "GeTradie - Verification documents received",
          html: `<div style="font-family:Arial,sans-serif;padding:32px;max-width:500px;"><h2 style="color:#0047AB;">Documents received, ${user.name}!</h2><p>Our team will review within 24-48 hours. You will receive an email once verified.</p></div>`,
        }),
      }).catch(err => console.error("Tradie email error:", err));
    }

    return NextResponse.json({ success: true, message: "Documents submitted successfully." });
  } catch (err) {
    console.error("Verification POST error:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
