import { NextRequest, NextResponse } from "next/server";
import { getAdminFromRequest, verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  DisputeError,
  bookingWithParties,
  loadBooking,
  partyRole,
  processDueItems,
  raiseDispute,
  resolveDispute,
  respondToDispute,
  withdrawDispute,
} from "@/lib/disputes";
import {
  CANCEL_CUTOFF_HOURS,
  DISPUTE_AFTER_DONE_DAYS,
  DISPUTE_RESPONSE_HOURS,
  MAX_DESCRIPTION_LENGTH,
  MIN_DESCRIPTION_LENGTH,
  NO_SHOW_GRACE_MINUTES,
  NO_SHOW_RESPONSE_HOURS,
  cancelState,
  categoriesFor,
  categoryLabel,
  disputeState,
  hasAgreedTime,
} from "@/lib/bookingRules";

function getUser(req: NextRequest) {
  const token = req.cookies.get("token")?.value || req.headers.get("Authorization")?.replace("Bearer ", "");
  return token ? verifyToken(token) : null;
}

function fail(err: unknown) {
  if (err instanceof DisputeError) return NextResponse.json({ error: err.message }, { status: err.status });
  console.error("Dispute API error:", err);
  return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
}

const RULES = {
  cancelCutoffHours: CANCEL_CUTOFF_HOURS,
  noShowGraceMinutes: NO_SHOW_GRACE_MINUTES,
  disputeAfterDoneDays: DISPUTE_AFTER_DONE_DAYS,
  noShowResponseHours: NO_SHOW_RESPONSE_HOURS,
  disputeResponseHours: DISPUTE_RESPONSE_HOURS,
  minDescriptionLength: MIN_DESCRIPTION_LENGTH,
  maxDescriptionLength: MAX_DESCRIPTION_LENGTH,
};

// GET /api/disputes?bookingId=...  -> the dispute and what this person can do on that booking
// GET /api/disputes                -> admin only: every dispute, newest first
export async function GET(req: NextRequest) {
  const bookingId = new URL(req.url).searchParams.get("bookingId");
  // The full list is the admin panel's request, which carries the admin session.
  const user = bookingId ? getUser(req) : (getAdminFromRequest(req) || getUser(req));
  if (!user) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });

  try {
    await processDueItems();
    const now = new Date();

    if (!bookingId) {
      if (user.role !== "ADMIN") return NextResponse.json({ error: "bookingId is required." }, { status: 400 });
      const rows = await prisma.dispute.findMany({
        orderBy: { createdAt: "desc" },
        take: 200,
        include: { booking: { include: bookingWithParties } },
      });
      const disputes = rows.map(d => {
        const held = d.booking.payment && ["paid", "partially_refunded"].includes(d.booking.payment.status)
          ? Math.max(0, d.booking.payment.amount - (d.booking.payment.refundedAmount ?? 0))
          : 0;
        return {
          ...d,
          booking: undefined,
          categoryLabel: categoryLabel(d.category),
          overdue: d.status === "OPEN" && d.responseDueAt.getTime() < now.getTime(),
          bookingSummary: {
            id: d.booking.id,
            status: d.booking.status,
            scheduledAt: d.booking.scheduledAt,
            hasAgreedTime: hasAgreedTime(d.booking),
            markedDoneAt: d.booking.markedDoneAt,
            quoteAmount: d.booking.totalAmount,
            jobId: d.booking.job.id,
            jobTitle: d.booking.job.title,
            location: [d.booking.job.suburb, d.booking.job.state].filter(Boolean).join(", "),
            homeowner: { id: d.booking.job.user.id, name: d.booking.job.user.name, email: d.booking.job.user.email },
            tradie: {
              id: d.booking.tradieProfile.user.id, name: d.booking.tradieProfile.user.name,
              email: d.booking.tradieProfile.user.email, businessName: d.booking.tradieProfile.businessName,
            },
            lockAmount: d.booking.payment?.amount ?? 0,
            heldAmount: held,
            paymentStatus: d.booking.payment?.status ?? null,
            hasStripeReference: !!d.booking.payment?.stripePaymentIntentId,
          },
        };
      });
      return NextResponse.json({ disputes, rules: RULES });
    }

    const booking = await loadBooking(bookingId);
    const role = partyRole(booking, user.id);
    if (!role && user.role !== "ADMIN") return NextResponse.json({ error: "This booking is not yours." }, { status: 403 });

    const all = await prisma.dispute.findMany({ where: { bookingId: booking.id }, orderBy: { createdAt: "desc" } });
    const current = all.find(d => d.status === "OPEN" || d.status === "RESPONDED") || all[0] || null;
    const dispute = current && {
      ...current,
      categoryLabel: categoryLabel(current.category),
      raisedByMe: current.raisedById === user.id,
      canRespond: !!role && current.status === "OPEN" && current.raisedByRole !== role,
      canWithdraw: (current.status === "OPEN" || current.status === "RESPONDED") && current.raisedById === user.id,
    };

    return NextResponse.json({
      role: role || "ADMIN",
      dispute,
      hasAgreedTime: hasAgreedTime(booking),
      cancel: cancelState(booking, now),
      canDispute: disputeState(booking, now),
      categories: role ? categoriesFor(role, booking, now) : [],
      rules: RULES,
    });
  } catch (err) {
    return fail(err);
  }
}

// POST /api/disputes  { bookingId, category, description }  -> raise a dispute
export async function POST(req: NextRequest) {
  const user = getUser(req);
  if (!user) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });

  try {
    const body = await req.json().catch(() => ({}));
    const dispute = await raiseDispute({
      bookingId: body.bookingId,
      userId: user.id,
      category: String(body.category || ""),
      description: String(body.description || ""),
    });
    return NextResponse.json({ success: true, dispute });
  } catch (err) {
    return fail(err);
  }
}

// PATCH /api/disputes  { disputeId, action: "respond" | "withdraw" | "resolve", ... }
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    // Deciding a dispute is the admin panel's request, which carries the admin session.
    const user = body.action === "resolve" ? (getAdminFromRequest(req) || getUser(req)) : getUser(req);
    if (!user) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });

    if (body.action === "respond") {
      const dispute = await respondToDispute({
        disputeId: body.disputeId,
        userId: user.id,
        responseType: String(body.responseType || ""),
        response: String(body.response || ""),
      });
      return NextResponse.json({ success: true, dispute });
    }

    if (body.action === "withdraw") {
      const dispute = await withdrawDispute({ disputeId: body.disputeId, userId: user.id });
      return NextResponse.json({ success: true, dispute });
    }

    if (body.action === "resolve") {
      if (user.role !== "ADMIN") return NextResponse.json({ error: "Not authorised." }, { status: 403 });
      const dispute = await resolveDispute({
        disputeId: body.disputeId,
        outcome: String(body.outcome || ""),
        refundAmount: body.refundAmount === undefined || body.refundAmount === null ? undefined : Number(body.refundAmount),
        note: String(body.note || ""),
        by: "ADMIN",
        byId: user.id,
        manualRefund: body.manualRefund === true,
      });
      return NextResponse.json({ success: true, dispute });
    }

    return NextResponse.json({ error: "Invalid action." }, { status: 400 });
  } catch (err) {
    return fail(err);
  }
}
