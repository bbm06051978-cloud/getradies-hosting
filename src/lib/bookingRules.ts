// Booking rules: when a booking can be cancelled and when a dispute can be raised.
// Pure functions with no database access, so the same rules can be used by the
// API (to enforce) and by screens (to decide which buttons to show).

export const CANCEL_CUTOFF_HOURS = 12;
export const NO_SHOW_GRACE_MINUTES = 60;
export const DISPUTE_AFTER_DONE_DAYS = 3;
export const NO_SHOW_RESPONSE_HOURS = 24;
export const DISPUTE_RESPONSE_HOURS = 48;
export const MIN_DESCRIPTION_LENGTH = 20;
export const MAX_DESCRIPTION_LENGTH = 2000;

export type PartyRole = "HOMEOWNER" | "TRADIE";

export interface RuleBooking {
  status: string;
  scheduledAt: Date | string;
  scheduleSetAt?: Date | string | null;
  markedDoneAt?: Date | string | null;
}

export interface ActionState {
  allowed: boolean;
  reason: string;
  opensAt: Date | null;
  closesAt: Date | null;
}

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;
const ms = (d: Date | string) => new Date(d).getTime();

const yes = (closesAt: Date | null = null): ActionState => ({ allowed: true, reason: "", opensAt: null, closesAt });
const no = (reason: string, opensAt: Date | null = null): ActionState => ({ allowed: false, reason, opensAt, closesAt: null });

// A booking only has a real start time once the tradie has set one.
// Until then the date on the booking is a placeholder and the time-based rules do not apply.
export function hasAgreedTime(b: RuleBooking): boolean {
  return !!b.scheduleSetAt;
}

export function cancelState(b: RuleBooking, now: Date = new Date()): ActionState {
  if (b.status === "PENDING") return yes();
  if (b.status === "CONFIRMED") {
    if (!hasAgreedTime(b)) return yes();
    const cutoff = new Date(ms(b.scheduledAt) - CANCEL_CUTOFF_HOURS * HOUR);
    if (now.getTime() < cutoff.getTime()) return yes(cutoff);
    return no(`Cancellation closed ${CANCEL_CUTOFF_HOURS} hours before the job. If something has gone wrong, raise a dispute.`);
  }
  return no("This booking can no longer be cancelled.");
}

export function disputeState(b: RuleBooking, now: Date = new Date()): ActionState {
  if (b.status === "PENDING") {
    return no("The tradie has not confirmed this booking yet. You can cancel it for a full refund.");
  }
  if (b.status === "CONFIRMED") {
    if (hasAgreedTime(b)) {
      const opens = new Date(ms(b.scheduledAt) - CANCEL_CUTOFF_HOURS * HOUR);
      if (now.getTime() < opens.getTime()) {
        return no(`You can still cancel this booking. Disputes open ${CANCEL_CUTOFF_HOURS} hours before the job starts.`, opens);
      }
    }
    return yes();
  }
  if (b.status === "PENDING_CONFIRMATION") {
    if (b.markedDoneAt) {
      const closes = new Date(ms(b.markedDoneAt) + DISPUTE_AFTER_DONE_DAYS * DAY);
      if (now.getTime() > closes.getTime()) return no(`The ${DISPUTE_AFTER_DONE_DAYS}-day dispute window has closed.`);
      return yes(closes);
    }
    return yes();
  }
  if (b.status === "DISPUTED") return no("A dispute is already open on this booking.");
  return no("This booking is closed.");
}

export const DISPUTE_CATEGORIES = [
  { key: "TRADIE_NO_SHOW",        label: "Tradie didn't arrive",                              roles: ["HOMEOWNER"],           noShow: true  },
  { key: "HOMEOWNER_UNAVAILABLE", label: "Homeowner wasn't there or I couldn't get access",   roles: ["TRADIE"],              noShow: true  },
  { key: "WORK_INCOMPLETE",       label: "Work wasn't finished",                              roles: ["HOMEOWNER"],           noShow: false },
  { key: "WORK_QUALITY",          label: "Work is poor quality",                              roles: ["HOMEOWNER"],           noShow: false },
  { key: "DAMAGE",                label: "Damage to my property",                             roles: ["HOMEOWNER"],           noShow: false },
  { key: "BALANCE_UNPAID",        label: "Homeowner hasn't paid the balance",                 roles: ["TRADIE"],              noShow: false },
  { key: "PRICE_OR_SCOPE",        label: "Price or scope changed from the quote",             roles: ["HOMEOWNER", "TRADIE"], noShow: false },
  { key: "OTHER",                 label: "Something else",                                    roles: ["HOMEOWNER", "TRADIE"], noShow: false },
] as const;

export type DisputeCategoryKey = (typeof DISPUTE_CATEGORIES)[number]["key"];

export function findCategory(key: string) {
  return DISPUTE_CATEGORIES.find(c => c.key === key) || null;
}

export function categoryLabel(key: string): string {
  return findCategory(key)?.label || "Other";
}

export function isNoShowCategory(key: string): boolean {
  return !!findCategory(key)?.noShow;
}

export function categoryState(key: string, role: PartyRole, b: RuleBooking, now: Date = new Date()): ActionState {
  const cat = findCategory(key);
  if (!cat) return no("Please choose a reason from the list.");
  if (!(cat.roles as readonly string[]).includes(role)) return no("This reason is not available to you.");
  if (cat.noShow) {
    if (b.status !== "CONFIRMED") return no("This can only be reported before the job has been marked done.");
    if (hasAgreedTime(b)) {
      const opens = new Date(ms(b.scheduledAt) + NO_SHOW_GRACE_MINUTES * 60 * 1000);
      if (now.getTime() < opens.getTime()) {
        return no("You can report this from one hour after the scheduled start. Please try calling or messaging first.", opens);
      }
    }
  }
  return yes();
}

export function categoriesFor(role: PartyRole, b: RuleBooking, now: Date = new Date()) {
  return DISPUTE_CATEGORIES
    .filter(c => (c.roles as readonly string[]).includes(role))
    .map(c => ({ key: c.key as string, label: c.label as string, ...categoryState(c.key, role, b, now) }));
}

export function responseHoursFor(category: string): number {
  return isNoShowCategory(category) ? NO_SHOW_RESPONSE_HOURS : DISPUTE_RESPONSE_HOURS;
}

// A tradie no-show is decided automatically if the tradie stays silent, but only
// when there was a real agreed start time to miss.
export function silenceDecides(category: string, b: RuleBooking): boolean {
  return category === "TRADIE_NO_SHOW" && hasAgreedTime(b);
}

export function autoCompleteAt(b: RuleBooking): Date | null {
  if (b.status !== "PENDING_CONFIRMATION" || !b.markedDoneAt) return null;
  return new Date(ms(b.markedDoneAt) + DISPUTE_AFTER_DONE_DAYS * DAY);
}

export function isAutoCompleteDue(b: RuleBooking, now: Date = new Date()): boolean {
  const at = autoCompleteAt(b);
  return !!at && now.getTime() >= at.getTime();
}

export function validateScheduleTime(value: unknown, now: Date = new Date()): { date: Date | null; error: string } {
  if (typeof value !== "string" && !(value instanceof Date)) return { date: null, error: "Please choose a date and time." };
  const d = new Date(value);
  if (isNaN(d.getTime())) return { date: null, error: "That date and time is not valid." };
  if (d.getTime() <= now.getTime()) return { date: null, error: "The job time must be in the future." };
  if (d.getTime() > now.getTime() + 365 * DAY) return { date: null, error: "The job time is too far in the future." };
  return { date: d, error: "" };
}
