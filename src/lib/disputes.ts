// Dispute process: raise, respond, withdraw, resolve, plus the timed rules
// (tradie no-show decided on silence, 3-day auto-complete after a job is marked done).

import { BookingStatus, JobStatus } from "@prisma/client";
import type { Dispute, Payment, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { emailBox, emailPara, emailWrap, escapeHtml, sendEmail } from "@/lib/email";
import {
  DISPUTE_AFTER_DONE_DAYS,
  MAX_DESCRIPTION_LENGTH,
  MIN_DESCRIPTION_LENGTH,
  NO_SHOW_RESPONSE_HOURS,
  categoryLabel,
  categoryState,
  disputeState,
  responseHoursFor,
  silenceDecides,
} from "@/lib/bookingRules";
import type { PartyRole } from "@/lib/bookingRules";

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;
const OPEN_STATUSES = ["OPEN", "RESPONDED"];
const OUTCOMES = ["REFUND_HOMEOWNER", "RELEASE_TRADIE", "SPLIT"];

export class DisputeError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

const userSelect = { id: true, name: true, email: true, emailNotifications: true } as const;

export const bookingWithParties = {
  payment: true,
  job: { select: { id: true, title: true, suburb: true, state: true, status: true, userId: true, preferredAt: true, user: { select: userSelect } } },
  tradieProfile: { select: { id: true, userId: true, businessName: true, user: { select: userSelect } } },
} satisfies Prisma.BookingInclude;

export type BookingWithParties = Prisma.BookingGetPayload<{ include: typeof bookingWithParties }>;
type Party = BookingWithParties["job"]["user"];

export async function loadBooking(bookingId: string): Promise<BookingWithParties> {
  const booking = typeof bookingId === "string" && bookingId
    ? await prisma.booking.findUnique({ where: { id: bookingId }, include: bookingWithParties })
    : null;
  if (!booking) throw new DisputeError("Booking not found.", 404);
  return booking;
}

export function partyRole(booking: BookingWithParties, userId: string): PartyRole | null {
  if (booking.job.userId === userId) return "HOMEOWNER";
  if (booking.tradieProfile.userId === userId) return "TRADIE";
  return null;
}

// ---------- formatting ----------

const round2 = (n: number) => Math.round(n * 100) / 100;

export function money(n: number): string {
  return "$" + (Number.isInteger(n) ? String(n) : n.toFixed(2));
}

export function sydneyTime(d: Date): string {
  return d.toLocaleString("en-AU", {
    timeZone: "Australia/Sydney", weekday: "short", day: "numeric", month: "short",
    hour: "numeric", minute: "2-digit", hour12: true,
  }) + " (Sydney time)";
}

// ---------- notifications ----------

async function notify(userId: string, title: string, message: string): Promise<void> {
  try {
    await prisma.notification.create({ data: { userId, title, message } });
  } catch (err) {
    console.error("Notification error:", err);
  }
}

export async function notifyAdmins(title: string, message: string): Promise<void> {
  try {
    const admins = await prisma.user.findMany({ where: { role: "ADMIN" }, select: { id: true } });
    for (const a of admins) await notify(a.id, title, message);
  } catch (err) {
    console.error("Admin notification error:", err);
  }
}

// Dispute and deadline emails are always sent: missing one can cost someone money.
// Other emails respect the person's email setting.
async function mail(user: Party, subject: string, heading: string, bodyHtml: string, always = false): Promise<void> {
  if (!user?.email) return;
  if (!always && user.emailNotifications === false) return;
  await sendEmail(user.email, subject, emailWrap(heading, bodyHtml));
}

// ---------- refunds ----------

function heldAmount(payment: Payment | null): number {
  if (!payment) return 0;
  if (payment.status !== "paid" && payment.status !== "partially_refunded") return 0;
  return Math.max(0, round2(payment.amount - (payment.refundedAmount ?? 0)));
}

async function recordRefund(payment: Payment, amount: number): Promise<void> {
  const total = round2((payment.refundedAmount ?? 0) + amount);
  await prisma.payment.update({
    where: { id: payment.id },
    data: { refundedAmount: total, status: total >= payment.amount - 0.005 ? "refunded" : "partially_refunded" },
  });
}

// Refunds some or all of the lock amount still held.
// - Returns manualNeeded when the payment has no Stripe reference (older payments).
// - Throws when Stripe refuses, so the caller never reports a refund that did not happen.
export async function refundPayment(
  payment: Payment | null,
  opts: { amount?: number; idempotencyKey: string; metadata?: Record<string, string> }
): Promise<{ refunded: number; manualNeeded: boolean }> {
  const held = heldAmount(payment);
  if (!payment || held <= 0) return { refunded: 0, manualNeeded: false };
  const amount = round2(opts.amount ?? held);
  if (amount <= 0) return { refunded: 0, manualNeeded: false };
  if (amount > held + 0.005) throw new DisputeError("The refund is more than the amount still held.");
  if (!payment.stripePaymentIntentId) return { refunded: 0, manualNeeded: true };

  await stripe.refunds.create(
    { payment_intent: payment.stripePaymentIntentId, amount: Math.round(amount * 100), metadata: opts.metadata },
    { idempotencyKey: opts.idempotencyKey }
  );
  await recordRefund(payment, amount);
  return { refunded: amount, manualNeeded: false };
}

// Same scale as the points awarded when a lock amount is paid (see api/payment/confirm).
function pointsForLock(lockAmount: number): number {
  return lockAmount >= 500 ? 200 : lockAmount >= 250 ? 75 : lockAmount >= 100 ? 25 : 10;
}

function badgeFor(points: number): string {
  return points >= 51 ? "Platinum" : points >= 26 ? "Gold" : points >= 11 ? "Silver" : "Bronze";
}

// ---------- raise ----------

export async function raiseDispute(args: {
  bookingId: string;
  userId: string;
  category: string;
  description: string;
  legacy?: boolean;
}): Promise<Dispute> {
  const booking = await loadBooking(args.bookingId);
  const role = partyRole(booking, args.userId);
  if (!role) throw new DisputeError("This booking is not yours.", 403);

  const now = new Date();
  const state = disputeState(booking, now);
  if (!state.allowed) throw new DisputeError(state.reason);

  const description = String(args.description || "").trim();
  if (!args.legacy) {
    const cat = categoryState(args.category, role, booking, now);
    if (!cat.allowed) throw new DisputeError(cat.reason);
    if (description.length < MIN_DESCRIPTION_LENGTH) {
      throw new DisputeError(`Please describe what happened (at least ${MIN_DESCRIPTION_LENGTH} characters).`);
    }
  }
  if (description.length > MAX_DESCRIPTION_LENGTH) {
    throw new DisputeError(`Please keep the description under ${MAX_DESCRIPTION_LENGTH} characters.`);
  }

  const existing = await prisma.dispute.findFirst({
    where: { bookingId: booking.id, status: { in: OPEN_STATUSES } },
    select: { id: true },
  });
  if (existing) throw new DisputeError("A dispute is already open on this booking.");

  const responseDueAt = new Date(now.getTime() + responseHoursFor(args.category) * HOUR);

  const dispute = await prisma.$transaction(async tx => {
    const claimed = await tx.booking.updateMany({
      where: { id: booking.id, status: booking.status },
      data: { status: "DISPUTED" },
    });
    if (claimed.count !== 1) throw new DisputeError("This booking has just changed. Please refresh and try again.", 409);
    await tx.job.update({ where: { id: booking.job.id }, data: { status: "DISPUTED" } });
    return tx.dispute.create({
      data: {
        bookingId: booking.id,
        raisedById: args.userId,
        raisedByRole: role,
        category: args.category,
        description,
        previousBookingStatus: booking.status,
        previousJobStatus: booking.job.status,
        responseDueAt,
      },
    });
  });

  const title = booking.job.title;
  const label = categoryLabel(dispute.category);
  const raiser = role === "HOMEOWNER" ? booking.job.user : booking.tradieProfile.user;
  const other = role === "HOMEOWNER" ? booking.tradieProfile.user : booking.job.user;
  const raiserLabel = role === "HOMEOWNER" ? "The homeowner" : "The tradie";
  const due = sydneyTime(responseDueAt);
  const silence = silenceDecides(dispute.category, booking)
    ? ` If we don't hear from you by then, the lock amount will be refunded to the homeowner.`
    : "";

  await notify(other.id, "Dispute raised - please respond",
    `${raiserLabel} has raised a dispute on "${title}": ${label}. Please respond by ${due}.${silence}`);
  await mail(other, `Dispute raised on "${title}" - please respond`, "A dispute has been raised",
    emailPara(`Hi ${escapeHtml(other.name)},<br><br>${raiserLabel} has raised a dispute on <strong>${escapeHtml(title)}</strong>.`) +
    emailBox(`<strong>Reason:</strong> ${escapeHtml(label)}<br><br><strong>What they said:</strong><br>${escapeHtml(description).replace(/\n/g, "<br>")}`, "amber") +
    emailPara(`Please open the booking in GeTradie and respond by <strong>${escapeHtml(due)}</strong>.${escapeHtml(silence)}`) +
    emailPara("The lock amount is on hold until this is resolved."),
    true);

  await notify(raiser.id, "Dispute received",
    `Your dispute on "${title}" has been received and the lock amount is on hold. The other party has until ${due} to respond.`);

  await notifyAdmins("Dispute raised", `${raiserLabel} raised "${label}" on "${title}" (booking ${booking.id}).`);

  return dispute;
}

// ---------- respond ----------

export async function respondToDispute(args: {
  disputeId: string;
  userId: string;
  responseType: string;
  response?: string;
}): Promise<Dispute> {
  const dispute = typeof args.disputeId === "string" && args.disputeId
    ? await prisma.dispute.findUnique({ where: { id: args.disputeId } })
    : null;
  if (!dispute) throw new DisputeError("Dispute not found.", 404);
  if (dispute.status !== "OPEN") throw new DisputeError("This dispute is no longer waiting for a response.", 409);

  const booking = await loadBooking(dispute.bookingId);
  const role = partyRole(booking, args.userId);
  if (!role) throw new DisputeError("This booking is not yours.", 403);
  if (role === dispute.raisedByRole) throw new DisputeError("You raised this dispute. Only the other party can respond.", 403);

  if (args.responseType !== "ACCEPT" && args.responseType !== "CONTEST") {
    throw new DisputeError("Please choose whether you accept or disagree.");
  }
  const response = String(args.response || "").trim();
  if (args.responseType === "CONTEST" && response.length < MIN_DESCRIPTION_LENGTH) {
    throw new DisputeError(`Please explain your side (at least ${MIN_DESCRIPTION_LENGTH} characters).`);
  }
  if (response.length > MAX_DESCRIPTION_LENGTH) {
    throw new DisputeError(`Please keep your response under ${MAX_DESCRIPTION_LENGTH} characters.`);
  }

  const updated = await prisma.dispute.updateMany({
    where: { id: dispute.id, status: "OPEN" },
    data: { status: "RESPONDED", responseType: args.responseType, response: response || null, respondedAt: new Date() },
  });
  if (updated.count !== 1) throw new DisputeError("This dispute has just changed. Please refresh and try again.", 409);

  const title = booking.job.title;
  const raiser = dispute.raisedByRole === "HOMEOWNER" ? booking.job.user : booking.tradieProfile.user;
  const responderLabel = role === "HOMEOWNER" ? "The homeowner" : "The tradie";

  // Acceptance settles it straight away in favour of whoever raised it. The one exception is
  // "homeowner not available", where GeTradie decides how much of the lock goes to the tradie.
  if (args.responseType === "ACCEPT" && dispute.category !== "HOMEOWNER_UNAVAILABLE") {
    try {
      return await resolveDispute({
        disputeId: dispute.id,
        outcome: dispute.raisedByRole === "HOMEOWNER" ? "REFUND_HOMEOWNER" : "RELEASE_TRADIE",
        note: `${responderLabel} accepted the dispute.`,
        by: "PARTY",
        byId: args.userId,
      });
    } catch (err) {
      // resolveDispute has recorded the failure and told the admins. The dispute stays open for them.
      console.error("Auto-resolve after acceptance failed:", err);
      return prisma.dispute.findUniqueOrThrow({ where: { id: dispute.id } });
    }
  }

  if (args.responseType === "ACCEPT") {
    await notify(raiser.id, "Dispute accepted", `${responderLabel} has accepted your dispute on "${title}". GeTradie will now confirm the outcome.`);
    await notifyAdmins("Dispute accepted - decision needed", `${responderLabel} accepted the dispute on "${title}" (booking ${booking.id}). Please set the outcome.`);
  } else {
    await notify(raiser.id, "Response to your dispute", `${responderLabel} has responded to your dispute on "${title}" and disagrees. GeTradie will review both sides and decide.`);
    await mail(raiser, `Response to your dispute on "${title}"`, "The other party has responded",
      emailPara(`Hi ${escapeHtml(raiser.name)},<br><br>${responderLabel} has responded to your dispute on <strong>${escapeHtml(title)}</strong> and disagrees.`) +
      emailBox(`<strong>What they said:</strong><br>${escapeHtml(response).replace(/\n/g, "<br>")}`, "blue") +
      emailPara("GeTradie will review both sides and let you both know the decision. The lock amount stays on hold until then."),
      true);
    await notifyAdmins("Dispute contested - decision needed", `${responderLabel} disagreed with the dispute on "${title}" (booking ${booking.id}). Both statements are ready for review.`);
  }

  return prisma.dispute.findUniqueOrThrow({ where: { id: dispute.id } });
}

// ---------- withdraw ----------

export async function withdrawDispute(args: { disputeId: string; userId: string }): Promise<Dispute> {
  const dispute = typeof args.disputeId === "string" && args.disputeId
    ? await prisma.dispute.findUnique({ where: { id: args.disputeId } })
    : null;
  if (!dispute) throw new DisputeError("Dispute not found.", 404);
  if (!OPEN_STATUSES.includes(dispute.status)) throw new DisputeError("This dispute has already been closed.", 409);
  if (dispute.raisedById !== args.userId) throw new DisputeError("Only the person who raised the dispute can withdraw it.", 403);

  const booking = await loadBooking(dispute.bookingId);
  const prevBooking = dispute.previousBookingStatus as BookingStatus;
  const prevJob = dispute.previousJobStatus as JobStatus;
  if (!Object.values(BookingStatus).includes(prevBooking) || !Object.values(JobStatus).includes(prevJob)) {
    throw new DisputeError("This dispute cannot be withdrawn. Please contact support.", 409);
  }
  const now = new Date();

  await prisma.$transaction(async tx => {
    const closed = await tx.dispute.updateMany({
      where: { id: dispute.id, status: { in: OPEN_STATUSES } },
      data: { status: "WITHDRAWN", outcome: "WITHDRAWN", resolvedBy: "PARTY", resolvedById: args.userId, resolvedAt: now },
    });
    if (closed.count !== 1) throw new DisputeError("This dispute has just changed. Please refresh and try again.", 409);
    const restored = await tx.booking.updateMany({
      where: { id: booking.id, status: "DISPUTED" },
      // Restart the 3-day clock so nobody loses time because of the dispute.
      data: { status: prevBooking, ...(prevBooking === "PENDING_CONFIRMATION" ? { markedDoneAt: now } : {}) },
    });
    if (restored.count !== 1) throw new DisputeError("This booking has just changed. Please refresh and try again.", 409);
    await tx.job.update({ where: { id: booking.job.id }, data: { status: prevJob } });
  });

  const title = booking.job.title;
  const other = dispute.raisedByRole === "HOMEOWNER" ? booking.tradieProfile.user : booking.job.user;
  const raiserLabel = dispute.raisedByRole === "HOMEOWNER" ? "The homeowner" : "The tradie";
  await notify(other.id, "Dispute withdrawn", `${raiserLabel} has withdrawn the dispute on "${title}". The booking continues as normal.`);
  await notifyAdmins("Dispute withdrawn", `${raiserLabel} withdrew the dispute on "${title}" (booking ${booking.id}).`);

  return prisma.dispute.findUniqueOrThrow({ where: { id: dispute.id } });
}

// ---------- resolve ----------

export async function resolveDispute(args: {
  disputeId: string;
  outcome: string;
  refundAmount?: number;
  note?: string;
  by: "ADMIN" | "AUTO" | "PARTY";
  byId?: string;
  manualRefund?: boolean;
}): Promise<Dispute> {
  const dispute = typeof args.disputeId === "string" && args.disputeId
    ? await prisma.dispute.findUnique({ where: { id: args.disputeId } })
    : null;
  if (!dispute) throw new DisputeError("Dispute not found.", 404);
  if (!OPEN_STATUSES.includes(dispute.status)) throw new DisputeError("This dispute has already been closed.", 409);
  if (!OUTCOMES.includes(args.outcome)) throw new DisputeError("Please choose an outcome.");

  const note = String(args.note || "").trim();
  if (args.by === "ADMIN" && note.length < 10) {
    throw new DisputeError("Please write a short note explaining the decision. Both parties will see it.");
  }
  if (note.length > MAX_DESCRIPTION_LENGTH) throw new DisputeError(`Please keep the note under ${MAX_DESCRIPTION_LENGTH} characters.`);

  const booking = await loadBooking(dispute.bookingId);
  const payment = booking.payment;
  const lock = payment?.amount ?? 0;
  const held = heldAmount(payment);

  let refund = 0;
  if (args.outcome === "REFUND_HOMEOWNER") refund = held;
  if (args.outcome === "SPLIT") {
    if (held <= 0) throw new DisputeError("There is no lock amount held on this booking, so it cannot be split.");
    refund = round2(Number(args.refundAmount));
    if (!isFinite(refund) || refund <= 0 || refund >= held) {
      throw new DisputeError(`For a split, the refund must be more than $0 and less than the ${money(held)} held.`);
    }
  }

  // 1. Money first. If the refund fails, nothing else changes and the dispute stays open.
  let manual = false;
  if (refund > 0 && payment) {
    try {
      if (!payment.stripePaymentIntentId) {
        if (!args.manualRefund) {
          throw new DisputeError("This payment has no Stripe reference, so it cannot be refunded automatically. Refund it in the Stripe dashboard first, then resolve again and confirm it was refunded manually.");
        }
        await recordRefund(payment, refund);
        manual = true;
      } else {
        await refundPayment(payment, {
          amount: refund,
          idempotencyKey: `dispute-${dispute.id}-${Math.round(refund * 100)}`,
          metadata: { disputeId: dispute.id, bookingId: booking.id },
        });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      const firstFailure = !dispute.lastError;
      await prisma.dispute.update({ where: { id: dispute.id }, data: { lastError: message.slice(0, 500) } }).catch(() => {});
      if (args.by !== "ADMIN" && firstFailure) {
        await notifyAdmins("Dispute refund failed - action needed",
          `The refund for the dispute on "${booking.job.title}" (booking ${booking.id}) could not be processed: ${message.slice(0, 200)}`);
      }
      throw err instanceof DisputeError ? err : new DisputeError("The refund could not be processed: " + message, 502);
    }
  }

  // 2. Records.
  const fullRefund = args.outcome === "REFUND_HOMEOWNER";
  const tradieAmount = fullRefund ? 0 : round2(held - refund);
  // If an earlier attempt refunded the money but could not close the dispute, report that refund.
  const refunded = fullRefund && refund === 0 && payment?.status === "refunded"
    ? round2(payment.refundedAmount || payment.amount)
    : refund;
  const now = new Date();
  let resolved: Dispute;
  try {
    resolved = await prisma.$transaction(async tx => {
      const closed = await tx.dispute.updateMany({
        where: { id: dispute.id, status: { in: OPEN_STATUSES } },
        data: {
          status: "RESOLVED", outcome: args.outcome, refundAmount: refunded, tradieAmount,
          resolutionNote: note || null, resolvedBy: args.by, resolvedById: args.byId || null,
          resolvedAt: now, lastError: null,
        },
      });
      if (closed.count !== 1) throw new DisputeError("This dispute has already been closed.", 409);

      if (fullRefund) {
        // Same as a tradie cancellation: the job reopens so the homeowner can accept another quote.
        await tx.booking.update({ where: { id: booking.id }, data: { status: "CANCELLED" } });
        await tx.job.update({ where: { id: booking.job.id }, data: { status: "OPEN" } });
        await tx.quote.updateMany({ where: { jobId: booking.job.id }, data: { status: "PENDING" } });

        const profile = await tx.tradieProfile.findUnique({ where: { id: booking.tradieProfile.id }, select: { getradiePoints: true } });
        const points = Math.max(0, (profile?.getradiePoints ?? 0) - (payment ? pointsForLock(lock) : 0));
        await tx.tradieProfile.update({
          where: { id: booking.tradieProfile.id },
          data: {
            getradiePoints: points,
            pointsBadge: badgeFor(points),
            ...(dispute.category === "TRADIE_NO_SHOW" ? { noShowCount: { increment: 1 } } : {}),
          },
        });
      } else {
        await tx.booking.update({ where: { id: booking.id }, data: { status: "COMPLETED" } });
        await tx.job.update({ where: { id: booking.job.id }, data: { status: "COMPLETED" } });
      }
      return tx.dispute.findUniqueOrThrow({ where: { id: dispute.id } });
    });
  } catch (err) {
    if (refund > 0 && !(err instanceof DisputeError && err.status === 409)) {
      const message = err instanceof Error ? err.message : String(err);
      await prisma.dispute.update({
        where: { id: dispute.id },
        data: { lastError: ("Refund was issued but the records were not updated: " + message).slice(0, 500) },
      }).catch(() => {});
      await notifyAdmins("Dispute needs attention",
        `A refund of ${money(refund)} was issued for "${booking.job.title}" (booking ${booking.id}) but the dispute could not be closed. Please resolve it again.`);
    }
    throw err;
  }

  // 3. Tell everyone.
  const title = booking.job.title;
  const homeowner = booking.job.user;
  const tradie = booking.tradieProfile.user;
  const reason = args.by === "ADMIN" ? `GeTradie's note: ${note}`
    : args.by === "AUTO" ? `The tradie did not respond within ${NO_SHOW_RESPONSE_HOURS} hours.`
    : note;
  const refundTiming = manual
    ? "GeTradie is processing this refund manually."
    : "It can take 3-5 business days to appear on your card.";

  let hwText: string;
  let tradieText: string;
  if (fullRefund) {
    hwText = refunded > 0
      ? `Your lock amount of ${money(refunded)} for "${title}" is being refunded. ${refundTiming} Your job has been reopened so you can accept another quote.`
      : `The dispute on "${title}" was decided in your favour. No lock amount was held on this booking. Your job has been reopened so you can accept another quote.`;
    tradieText = `The dispute on "${title}" was decided in the homeowner's favour and the lock amount has been refunded to them.`;
  } else if (args.outcome === "SPLIT") {
    hwText = `The dispute on "${title}" has been decided. ${money(refund)} of your lock amount is being refunded. ${refundTiming} The remaining ${money(tradieAmount)} goes to the tradie.`;
    tradieText = `The dispute on "${title}" has been decided. ${money(refund)} of the lock amount has been refunded to the homeowner. The remaining ${money(tradieAmount)} will be released to you as normal.`;
  } else {
    hwText = `The dispute on "${title}" was decided in the tradie's favour. The lock amount will be released to them.`;
    tradieText = `The dispute on "${title}" was decided in your favour. The lock amount will be released to you as normal.`;
  }

  await notify(homeowner.id, "Dispute resolved", `${hwText} ${reason}`.trim());
  await notify(tradie.id, "Dispute resolved", `${tradieText} ${reason}`.trim());
  const emailBody = (name: string, text: string) =>
    emailPara(`Hi ${escapeHtml(name)},<br><br>${escapeHtml(text)}`) + (reason ? emailBox(escapeHtml(reason).replace(/\n/g, "<br>"), "blue") : "") +
    emailPara("This decision relates only to the lock amount held by GeTradie.");
  await mail(homeowner, `Dispute resolved: ${title}`, "Dispute resolved", emailBody(homeowner.name, hwText), true);
  await mail(tradie, `Dispute resolved: ${title}`, "Dispute resolved", emailBody(tradie.name, tradieText), true);
  if (args.by !== "ADMIN") {
    await notifyAdmins("Dispute closed automatically",
      `The dispute on "${title}" (booking ${booking.id}) was closed: ${args.outcome.replace(/_/g, " ").toLowerCase()}. ${reason}`);
  }

  return resolved;
}

// ---------- complete a job ----------

// Marks a job complete after the homeowner confirms, or automatically when the
// 3-day window passes with no dispute. Returns false if the booking was not waiting for confirmation.
export async function completeBooking(bookingId: string, by: "HOMEOWNER" | "AUTO"): Promise<boolean> {
  const claimed = await prisma.booking.updateMany({
    where: { id: bookingId, status: "PENDING_CONFIRMATION" },
    data: { status: "COMPLETED" },
  });
  if (claimed.count !== 1) return false;

  const booking = await loadBooking(bookingId);
  await prisma.job.update({ where: { id: booking.job.id }, data: { status: "COMPLETED" } });

  const title = booking.job.title;
  const homeowner = booking.job.user;
  const tradie = booking.tradieProfile.user;
  const location = [booking.job.suburb, booking.job.state].filter(Boolean).join(", ");
  const where = location ? ` in ${escapeHtml(location)}` : "";
  const auto = by === "AUTO";

  await notify(tradie.id, "Job Confirmed Complete!",
    auto
      ? `"${title}" has been completed automatically because no dispute was raised within ${DISPUTE_AFTER_DONE_DAYS} days. Payment will be released shortly.`
      : `The homeowner confirmed "${title}" is complete. Payment will be released shortly.`);
  if (auto) {
    await notify(homeowner.id, "Job completed automatically",
      `"${title}" was marked done ${DISPUTE_AFTER_DONE_DAYS} days ago and no dispute was raised, so it has been completed and the lock amount released to the tradie.`);
  }

  await mail(homeowner, `Job Completed: ${title}`, "Job Completed",
    emailPara(`Hi ${escapeHtml(homeowner.name)},<br><br>` + (auto
      ? `<strong>${escapeHtml(title)}</strong>${where} was marked done ${DISPUTE_AFTER_DONE_DAYS} days ago and no dispute was raised, so it has now been completed.`
      : `You've confirmed that <strong>${escapeHtml(title)}</strong>${where} is complete.`)) +
    emailBox("Payment has been released to your tradie. Thank you for using GeTradie!") +
    emailPara("Had a great experience? Leave a review for your tradie in the app under My Jobs."));

  await mail(tradie, `Job Confirmed Complete: ${title}`, "Job Confirmed Complete",
    emailPara(`Hi ${escapeHtml(tradie.name)},<br><br>` + (auto
      ? `<strong>${escapeHtml(title)}</strong>${where} has been completed automatically because no dispute was raised within ${DISPUTE_AFTER_DONE_DAYS} days.`
      : `The homeowner has confirmed <strong>${escapeHtml(title)}</strong>${where} is complete.`)) +
    emailBox("Your payment will be released shortly. Great work!"));

  return true;
}

// Sent when the tradie marks a job done: starts the homeowner's 3-day window.
export async function notifyMarkedDone(bookingId: string, markedDoneAt: Date): Promise<void> {
  const booking = await loadBooking(bookingId);
  const homeowner = booking.job.user;
  const title = booking.job.title;
  const deadline = sydneyTime(new Date(markedDoneAt.getTime() + DISPUTE_AFTER_DONE_DAYS * DAY));
  await mail(homeowner, `Job marked done: ${title} - please confirm`, "Your tradie has marked the job done",
    emailPara(`Hi ${escapeHtml(homeowner.name)},<br><br><strong>${escapeHtml(booking.tradieProfile.businessName)}</strong> has marked <strong>${escapeHtml(title)}</strong> as done.`) +
    emailPara("Please check the work, then open the booking in GeTradie and either <strong>Confirm Complete</strong> or <strong>raise a dispute</strong> if something is wrong.") +
    emailBox(`If we don't hear from you by <strong>${escapeHtml(deadline)}</strong>, the job will be completed automatically and the lock amount released to the tradie.`, "amber"),
    true);
}

// ---------- timed rules ----------

let lastSweep = 0;

// Runs the timed rules. There is no scheduler, so this is called when people load their
// bookings; it does real work at most once a minute per server instance.
export async function processDueItems(force = false): Promise<void> {
  const nowMs = Date.now();
  if (!force && nowMs - lastSweep < 60 * 1000) return;
  lastSweep = nowMs;
  const now = new Date(nowMs);

  try {
    const silent = await prisma.dispute.findMany({
      where: {
        status: "OPEN",
        category: "TRADIE_NO_SHOW",
        responseDueAt: { lt: now },
        lastError: null,
        booking: { scheduleSetAt: { not: null } },
      },
      select: { id: true },
      take: 20,
    });
    for (const d of silent) {
      try {
        await resolveDispute({ disputeId: d.id, outcome: "REFUND_HOMEOWNER", by: "AUTO" });
      } catch (err) {
        console.error("Auto-resolve failed for dispute", d.id, err);
      }
    }

    const cutoff = new Date(nowMs - DISPUTE_AFTER_DONE_DAYS * DAY);
    const done = await prisma.booking.findMany({
      where: { status: "PENDING_CONFIRMATION", markedDoneAt: { lt: cutoff } },
      select: { id: true },
      take: 20,
    });
    for (const b of done) {
      try {
        await completeBooking(b.id, "AUTO");
      } catch (err) {
        console.error("Auto-complete failed for booking", b.id, err);
      }
    }
  } catch (err) {
    console.error("processDueItems error:", err);
  }
}
