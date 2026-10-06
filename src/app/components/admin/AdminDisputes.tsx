"use client";
import { useCallback, useEffect, useState } from "react";
import { CheckCircle } from "lucide-react";
import { formatWhen } from "@/lib/dateTime";

type Party = { id: string; name: string; email: string; businessName?: string };
type AdminDispute = {
  id: string; status: string; category: string; categoryLabel: string; description: string;
  raisedByRole: string; createdAt: string; responseDueAt: string; overdue: boolean;
  responseType: string | null; response: string | null; respondedAt: string | null;
  outcome: string | null; refundAmount: number | null; tradieAmount: number | null;
  resolutionNote: string | null; resolvedBy: string | null; resolvedAt: string | null; lastError: string | null;
  bookingSummary: {
    id: string; status: string; scheduledAt: string; hasAgreedTime: boolean; markedDoneAt: string | null;
    quoteAmount: number; jobTitle: string; location: string;
    homeowner: Party; tradie: Party;
    lockAmount: number; heldAmount: number; paymentStatus: string | null; hasStripeReference: boolean;
  };
};
type LegacyBooking = {
  id: string; totalAmount: number; createdAt: string;
  job: { title: string; user: { name: string } };
  tradieProfile: { businessName: string };
};

const money = (n: number | null | undefined) => `$${(n ?? 0).toLocaleString("en-AU", { maximumFractionDigits: 2 })}`;
const OUTCOMES = [
  { key: "REFUND_HOMEOWNER", label: "Refund homeowner in full" },
  { key: "RELEASE_TRADIE",   label: "Release to tradie" },
  { key: "SPLIT",            label: "Split" },
];

export function AdminDisputes({ legacy, onLegacyResolve, legacyBusy, onChanged }: {
  legacy: LegacyBooking[];
  onLegacyResolve: (bookingId: string) => void;
  legacyBusy: string | null;
  onChanged: () => void;
}) {
  const [disputes, setDisputes] = useState<AdminDispute[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [showClosed, setShowClosed] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);
  const [outcome, setOutcome] = useState("");
  const [refund, setRefund] = useState("");
  const [note, setNote] = useState("");
  const [manual, setManual] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/disputes");
      const data = await res.json();
      if (res.ok) setDisputes(data.disputes || []);
    } catch {} finally { setLoaded(true); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const startDecision = (id: string) => { setOpenId(id); setOutcome(""); setRefund(""); setNote(""); setManual(false); setError(""); };

  const resolve = async (d: AdminDispute) => {
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/disputes", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          disputeId: d.id, action: "resolve", outcome, note,
          refundAmount: outcome === "SPLIT" ? Number(refund) : undefined,
          manualRefund: manual,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) { setError(data.error || "Could not resolve the dispute."); return; }
      setOpenId(null);
      await load();
      onChanged();
    } catch { setError("Something went wrong. Please try again."); }
    finally { setBusy(false); }
  };

  const live = disputes.filter(d => d.status === "OPEN" || d.status === "RESPONDED");
  const closed = disputes.filter(d => d.status !== "OPEN" && d.status !== "RESPONDED");
  // Bookings disputed before reasons were recorded have no dispute record of their own.
  const legacyOnly = legacy.filter(b => !live.some(d => d.bookingSummary.id === b.id));

  const outcomeLine = (d: AdminDispute) => {
    if (d.status === "WITHDRAWN") return "Withdrawn by the person who raised it";
    if (d.outcome === "REFUND_HOMEOWNER") return `Refunded homeowner ${money(d.refundAmount)}`;
    if (d.outcome === "RELEASE_TRADIE") return `Released to tradie (${money(d.tradieAmount)})`;
    if (d.outcome === "SPLIT") return `Split: homeowner ${money(d.refundAmount)}, tradie ${money(d.tradieAmount)}`;
    return d.status;
  };

  const card = (d: AdminDispute, isLive: boolean) => {
    const b = d.bookingSummary;
    const refundNum = Number(refund);
    const splitOk = outcome !== "SPLIT" || (isFinite(refundNum) && refundNum > 0 && refundNum < b.heldAmount);
    const willRefund = outcome === "REFUND_HOMEOWNER" || outcome === "SPLIT";
    const needsManual = willRefund && b.heldAmount > 0 && !b.hasStripeReference;
    const canSubmit = !!outcome && splitOk && note.trim().length >= 10 && (!needsManual || manual) && !busy;
    return (
      <div key={d.id} className={`bg-gray-900 rounded-2xl border p-5 space-y-3 ${isLive ? "border-red-900" : "border-gray-800"}`}>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h3 className="font-bold text-white">{b.jobTitle}</h3>
            <p className="text-xs text-gray-500">{b.location} · Booking {b.id}</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <span className="text-xs font-bold px-2 py-1 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20">{d.categoryLabel}</span>
            {isLive && d.status === "OPEN" && !d.overdue && <span className="text-xs font-bold px-2 py-1 rounded-lg bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">Waiting for reply</span>}
            {isLive && d.status === "OPEN" && d.overdue && <span className="text-xs font-bold px-2 py-1 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20">No reply - decide now</span>}
            {isLive && d.status === "RESPONDED" && <span className="text-xs font-bold px-2 py-1 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">Replied - decide now</span>}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-3 text-sm">
          <div className="text-gray-400">
            <p>Homeowner: <span className="text-gray-200">{b.homeowner.name}</span> <span className="text-gray-500">({b.homeowner.email})</span></p>
            <p>Tradie: <span className="text-gray-200">{b.tradie.businessName || b.tradie.name}</span> <span className="text-gray-500">({b.tradie.email})</span></p>
            <p>Start time: <span className="text-gray-200">{b.hasAgreedTime ? formatWhen(b.scheduledAt) : "Not agreed"}</span></p>
            {b.markedDoneAt && <p>Marked done: <span className="text-gray-200">{formatWhen(b.markedDoneAt)}</span></p>}
          </div>
          <div className="text-gray-400">
            <p>Quote: <span className="text-gray-200">{money(b.quoteAmount)}</span></p>
            <p>Lock paid: <span className="text-gray-200">{money(b.lockAmount)}</span></p>
            <p>Still held: <span className="text-white font-bold">{money(b.heldAmount)}</span></p>
            {!b.hasStripeReference && b.lockAmount > 0 && <p className="text-orange-400 text-xs">No Stripe reference: refunds must be done by hand.</p>}
          </div>
        </div>

        <div className="bg-gray-950 border border-gray-800 rounded-xl p-3">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">
            {d.raisedByRole === "HOMEOWNER" ? "Homeowner" : "Tradie"} raised · {formatWhen(d.createdAt)}
          </p>
          <p className="text-sm text-gray-200 whitespace-pre-line">{d.description}</p>
        </div>

        {d.respondedAt ? (
          <div className="bg-gray-950 border border-gray-800 rounded-xl p-3">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">
              {d.raisedByRole === "HOMEOWNER" ? "Tradie" : "Homeowner"} {d.responseType === "ACCEPT" ? "accepted" : "disagreed"} · {formatWhen(d.respondedAt)}
            </p>
            <p className="text-sm text-gray-200 whitespace-pre-line">{d.response || "No comment given."}</p>
          </div>
        ) : isLive && (
          <p className="text-xs text-gray-500">
            {d.overdue ? "The other party did not reply by" : "The other party has until"} {formatWhen(d.responseDueAt)}{d.overdue ? "." : " to reply. You can still decide now."}
          </p>
        )}

        {d.lastError && isLive && <p className="text-xs text-orange-400">Last refund attempt failed: {d.lastError}</p>}

        {!isLive && (
          <div className="text-sm text-gray-300">
            <p className="font-semibold">{outcomeLine(d)}{d.resolvedBy ? ` · by ${d.resolvedBy === "ADMIN" ? "admin" : d.resolvedBy === "AUTO" ? "automatic rule" : "agreement"}` : ""}{d.resolvedAt ? ` · ${formatWhen(d.resolvedAt)}` : ""}</p>
            {d.resolutionNote && <p className="text-xs text-gray-500 mt-1 whitespace-pre-line">{d.resolutionNote}</p>}
          </div>
        )}

        {isLive && openId !== d.id && (
          <button onClick={() => startDecision(d.id)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold">Decide this dispute</button>
        )}

        {isLive && openId === d.id && (
          <div className="bg-gray-950 border border-blue-900 rounded-xl p-4 space-y-3">
            <div className="flex gap-2 flex-wrap">
              {OUTCOMES.map(o => (
                <button key={o.key} onClick={() => { setOutcome(o.key); setError(""); }}
                  disabled={o.key === "SPLIT" && b.heldAmount <= 0}
                  className={`px-3 py-2 rounded-xl text-xs font-bold border disabled:opacity-40 ${outcome === o.key ? "bg-blue-600 border-blue-600 text-white" : "border-gray-700 text-gray-300 hover:border-gray-500"}`}>
                  {o.label}
                </button>
              ))}
            </div>

            {outcome === "REFUND_HOMEOWNER" && <p className="text-xs text-gray-400">Homeowner gets {money(b.heldAmount)} back, including the GeTradie fee. The booking is cancelled, the job reopens{d.category === "TRADIE_NO_SHOW" ? " and a no-show is recorded against the tradie" : ""}.</p>}
            {outcome === "RELEASE_TRADIE" && <p className="text-xs text-gray-400">No refund. The lock amount of {money(b.heldAmount)} goes to the tradie and the job is completed. The payout to the tradie is still made by hand.</p>}
            {outcome === "SPLIT" && (
              <div>
                <p className="text-xs text-gray-400 mb-1">Refund to homeowner (more than $0, less than {money(b.heldAmount)}):</p>
                <input type="number" min="0" step="0.01" value={refund} onChange={e => setRefund(e.target.value)}
                  className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white w-40"/>
                {splitOk && refund !== "" && <p className="text-xs text-gray-400 mt-1">Tradie keeps {money(Math.round((b.heldAmount - refundNum) * 100) / 100)}.</p>}
              </div>
            )}

            <div>
              <p className="text-xs text-gray-400 mb-1">Reason for the decision (both parties will see this, at least 10 characters):</p>
              <textarea value={note} onChange={e => setNote(e.target.value)} rows={3}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white"/>
            </div>

            {needsManual && (
              <label className="flex items-start gap-2 text-xs text-orange-300">
                <input type="checkbox" checked={manual} onChange={e => setManual(e.target.checked)} className="mt-0.5"/>
                This payment has no Stripe reference. I have already refunded it by hand in the Stripe dashboard.
              </label>
            )}

            {!!error && <p className="text-xs font-semibold text-red-400">{error}</p>}

            <div className="flex gap-2 flex-wrap">
              <button onClick={() => setOpenId(null)} className="border border-gray-700 text-gray-300 px-4 py-2 rounded-xl text-xs font-bold">Close</button>
              <button disabled={!canSubmit}
                onClick={() => { if (confirm(willRefund ? "Confirm this decision? The refund is sent straight away and cannot be undone." : "Confirm this decision? It cannot be undone.")) resolve(d); }}
                className="bg-green-600 hover:bg-green-700 disabled:bg-green-900 disabled:text-gray-500 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2">
                <CheckCircle size={13}/>{busy ? "Resolving..." : "Confirm decision"}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {loaded && live.length === 0 && legacyOnly.length === 0 && (
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-12 text-center">
          <CheckCircle size={48} className="text-gray-700 mx-auto mb-4"/>
          <p className="text-gray-400">No active disputes</p>
        </div>
      )}

      {live.map(d => card(d, true))}

      {legacyOnly.map(b => (
        <div key={b.id} className="bg-gray-900 rounded-2xl border border-red-900 p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-bold text-white">{b.job.title}</h3>
              <p className="text-sm text-gray-400 mt-1">Homeowner: {b.job.user.name} · Tradie: {b.tradieProfile.businessName}</p>
              <p className="text-sm text-gray-400">Amount: ${b.totalAmount}</p>
              <p className="text-xs text-gray-500 mt-1">Older dispute with no reason recorded. Marking it resolved releases the lock to the tradie.</p>
            </div>
            <button onClick={() => onLegacyResolve(b.id)} disabled={legacyBusy === b.id}
              className="bg-green-600 hover:bg-green-700 disabled:bg-green-900 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2">
              <CheckCircle size={13}/>{legacyBusy === b.id ? "Resolving..." : "Mark Resolved"}
            </button>
          </div>
        </div>
      ))}

      {closed.length > 0 && (
        <div>
          <button onClick={() => setShowClosed(s => !s)} className="text-xs font-bold text-gray-400 hover:text-gray-200">
            {showClosed ? "Hide" : "Show"} closed disputes ({closed.length})
          </button>
          {showClosed && <div className="space-y-4 mt-3">{closed.map(d => card(d, false))}</div>}
        </div>
      )}
    </div>
  );
}
