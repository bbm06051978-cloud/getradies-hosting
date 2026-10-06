import { NextRequest, NextResponse } from "next/server";
import { getAdminFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { money, processDueItems } from "@/lib/disputes";
import { emailPara, emailWrap, escapeHtml, sendEmail } from "@/lib/email";

const round2 = (n: number) => Math.round(n * 100) / 100;

type PayRow = { amount: number; refundedAmount: number | null; tradieEarning: number | null };

// What GeTradie owes the tradie for a finished job: their share of the lock amount,
// never more than what is still held after any refund.
function owedAmount(p: PayRow): number {
  const held = Math.max(0, round2(p.amount - (p.refundedAmount ?? 0)));
  return Math.max(0, round2(Math.min(p.tradieEarning ?? 0, held)));
}

// GET /api/admin/payouts -> amounts owed to tradies for completed jobs, and payouts already made
export async function GET(req: NextRequest) {
  if (!getAdminFromRequest(req)) return NextResponse.json({ error: "Not authorised." }, { status: 403 });

  await processDueItems();

  const payments = await prisma.payment.findMany({
    where: { status: { in: ["paid", "partially_refunded"] }, booking: { status: "COMPLETED" } },
    orderBy: { createdAt: "desc" },
    take: 500,
    include: {
      booking: {
        select: {
          id: true, updatedAt: true, totalAmount: true,
          job: { select: { title: true, suburb: true, state: true } },
          tradieProfile: { select: { businessName: true, abn: true, user: { select: { name: true, email: true, phone: true } } } },
        },
      },
    },
  });

  const rows = payments.map(p => ({
    paymentId: p.id,
    bookingId: p.booking.id,
    jobTitle: p.booking.job.title,
    location: [p.booking.job.suburb, p.booking.job.state].filter(Boolean).join(", "),
    completedAt: p.booking.updatedAt,
    tradie: {
      businessName: p.booking.tradieProfile.businessName,
      name: p.booking.tradieProfile.user.name,
      email: p.booking.tradieProfile.user.email,
      phone: p.booking.tradieProfile.user.phone,
      abn: p.booking.tradieProfile.abn,
    },
    lockAmount: p.amount,
    refunded: p.refundedAmount ?? 0,
    platformFee: p.getradieFee ?? 0,
    hasStripeReference: !!p.stripePaymentIntentId,
    owed: owedAmount(p),
    paidAmount: p.payoutAmount,
    paidAt: p.payoutPaidAt,
    reference: p.payoutReference,
  }));

  const owed = rows.filter(r => !r.paidAt && r.owed > 0);
  const paid = rows.filter(r => !!r.paidAt).sort((a, b) => new Date(b.paidAt!).getTime() - new Date(a.paidAt!).getTime());

  return NextResponse.json({
    owed,
    paid,
    totalOwed: round2(owed.reduce((s, r) => s + r.owed, 0)),
    totalPaid: round2(paid.reduce((s, r) => s + (r.paidAmount ?? 0), 0)),
  });
}

// PATCH /api/admin/payouts { paymentId, reference } -> record that the tradie has been paid
export async function PATCH(req: NextRequest) {
  if (!getAdminFromRequest(req)) return NextResponse.json({ error: "Not authorised." }, { status: 403 });

  const body = await req.json().catch(() => ({}));
  const paymentId = typeof body.paymentId === "string" ? body.paymentId : "";
  const reference = typeof body.reference === "string" ? body.reference.trim().slice(0, 200) : "";
  if (!paymentId) return NextResponse.json({ error: "Payment not found." }, { status: 404 });
  if (reference.length < 3) {
    return NextResponse.json({ error: "Please enter the bank transfer reference (at least 3 characters)." }, { status: 400 });
  }

  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: {
      booking: {
        select: {
          status: true,
          job: { select: { title: true } },
          tradieProfile: { select: { user: { select: { id: true, name: true, email: true } } } },
        },
      },
    },
  });
  if (!payment) return NextResponse.json({ error: "Payment not found." }, { status: 404 });
  if (payment.booking.status !== "COMPLETED" || !["paid", "partially_refunded"].includes(payment.status)) {
    return NextResponse.json({ error: "This job is not completed, so nothing is owed on it yet." }, { status: 400 });
  }
  const owed = owedAmount(payment);
  if (owed <= 0) return NextResponse.json({ error: "Nothing is owed to the tradie on this job." }, { status: 400 });

  // Only records it once, even if the button is pressed twice.
  const claimed = await prisma.payment.updateMany({
    where: { id: payment.id, payoutPaidAt: null },
    data: { payoutPaidAt: new Date(), payoutAmount: owed, payoutReference: reference },
  });
  if (claimed.count !== 1) return NextResponse.json({ error: "This payout has already been recorded." }, { status: 409 });

  const tradie = payment.booking.tradieProfile.user;
  const title = payment.booking.job.title;
  const text = `GeTradie has paid you ${money(owed)} for "${title}". Reference: ${reference}. It can take 1-2 business days to reach your account.`;
  try {
    await prisma.notification.create({ data: { userId: tradie.id, title: "Payout sent", message: text } });
    if (tradie.email) {
      await sendEmail(tradie.email, `Payout sent: ${title}`,
        emailWrap("Payout sent", emailPara(`Hi ${escapeHtml(tradie.name)},<br><br>${escapeHtml(text)}`)));
    }
  } catch (err) {
    console.error("Payout notification error:", err);
  }

  return NextResponse.json({ success: true, paidAmount: owed });
}
