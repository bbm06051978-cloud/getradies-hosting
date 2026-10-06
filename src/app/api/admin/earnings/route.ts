import { NextRequest, NextResponse } from "next/server";
import { getAdminFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { processDueItems } from "@/lib/disputes";

const round2 = (n: number) => Math.round(n * 100) / 100;
const SYDNEY = "Australia/Sydney";

// "2026-10" for the Sydney month a date falls in.
function monthKey(d: Date): string {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: SYDNEY, year: "numeric", month: "2-digit" }).formatToParts(d);
  return `${parts.find(p => p.type === "year")!.value}-${parts.find(p => p.type === "month")!.value}`;
}

type PayRow = { amount: number; refundedAmount: number | null; getradieFee: number | null };

// GeTradie's platform fee on a job, never more than what is still held after any refund.
function feeAmount(p: PayRow): number {
  const held = Math.max(0, round2(p.amount - (p.refundedAmount ?? 0)));
  return Math.max(0, round2(Math.min(p.getradieFee ?? 0, held)));
}

// GET /api/admin/earnings -> GeTradie's platform fees: earned on completed jobs, and expected on jobs in progress
export async function GET(req: NextRequest) {
  if (!getAdminFromRequest(req)) return NextResponse.json({ error: "Not authorised." }, { status: 403 });

  await processDueItems();

  const payments = await prisma.payment.findMany({
    where: {
      status: { in: ["paid", "partially_refunded"] },
      booking: { status: { in: ["COMPLETED", "PENDING", "CONFIRMED", "PENDING_CONFIRMATION", "DISPUTED"] } },
    },
    orderBy: { createdAt: "desc" },
    take: 1000,
    include: {
      booking: {
        select: {
          id: true, status: true, updatedAt: true,
          job: { select: { title: true, suburb: true, state: true, user: { select: { name: true } } } },
          tradieProfile: { select: { businessName: true } },
        },
      },
    },
  });

  const rows = payments.map(p => ({
    paymentId: p.id,
    bookingId: p.booking.id,
    bookingStatus: p.booking.status as string,
    jobTitle: p.booking.job.title,
    location: [p.booking.job.suburb, p.booking.job.state].filter(Boolean).join(", "),
    homeowner: p.booking.job.user.name,
    tradie: p.booking.tradieProfile.businessName,
    lockAmount: p.amount,
    refunded: p.refundedAmount ?? 0,
    fee: feeAmount(p),
    // A completed booking is not changed again, so its last update is when it was completed.
    completedAt: p.booking.status === "COMPLETED" ? p.booking.updatedAt : null,
    paidAt: p.paidAt,
    hasStripeReference: !!p.stripePaymentIntentId,
  }));

  const earned = rows
    .filter(r => r.bookingStatus === "COMPLETED" && r.fee > 0)
    .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime());
  const pending = rows.filter(r => r.bookingStatus !== "COMPLETED" && r.fee > 0);

  const byMonth = new Map<string, { month: string; fees: number; jobs: number }>();
  for (const r of earned) {
    const key = monthKey(new Date(r.completedAt!));
    const m = byMonth.get(key) || { month: key, fees: 0, jobs: 0 };
    m.fees = round2(m.fees + r.fee);
    m.jobs += 1;
    byMonth.set(key, m);
  }
  const months = [...byMonth.values()].sort((a, b) => b.month.localeCompare(a.month));
  const thisMonth = monthKey(new Date());

  return NextResponse.json({
    earned,
    pending,
    months,
    totalEarned: round2(earned.reduce((s, r) => s + r.fee, 0)),
    earnedThisMonth: byMonth.get(thisMonth)?.fees ?? 0,
    totalPending: round2(pending.reduce((s, r) => s + r.fee, 0)),
  });
}
