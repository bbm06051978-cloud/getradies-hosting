"use client";
import { useCallback, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { AlertTriangle } from "lucide-react";
import { formatWhen } from "@/lib/dateTime";

type ActionState = { allowed: boolean; reason: string; opensAt: string | null; closesAt: string | null };
type Category = ActionState & { key: string; label: string };
type DisputeView = {
  id: string; status: string; category: string; categoryLabel: string; description: string;
  raisedByRole: string; raisedByMe: boolean; canRespond: boolean; canWithdraw: boolean;
  responseDueAt: string; responseType: string | null; response: string | null;
  outcome: string | null; refundAmount: number | null; tradieAmount: number | null;
  resolutionNote: string | null; resolvedBy: string | null;
};
type Info = {
  role: string;
  dispute: DisputeView | null;
  cancel: ActionState;
  canDispute: ActionState;
  categories: Category[];
  rules: { minDescriptionLength: number; maxDescriptionLength: number; cancelCutoffHours: number };
};

type Props = {
  bookingId: string;
  // Passed in so the panel re-checks whenever the booking changes.
  bookingStatus: string;
  scheduledAt?: string | null;
  // The page's own Cancel button. It is only shown while cancelling is still allowed.
  cancelButton?: ReactNode;
  // Called after a dispute is raised, answered, or withdrawn, so the page can reload.
  onChanged: () => void;
};

const money = (n: number | null | undefined) => `$${(n ?? 0).toLocaleString("en-AU", { maximumFractionDigits: 2 })}`;

function outcomeText(d: DisputeView): string {
  if (d.status === "WITHDRAWN") return "The dispute was withdrawn and the booking carried on.";
  if (d.outcome === "REFUND_HOMEOWNER") return `Resolved: full refund of ${money(d.refundAmount)} to the homeowner.`;
  if (d.outcome === "RELEASE_TRADIE") return "Resolved: the lock amount goes to the tradie.";
  if (d.outcome === "SPLIT") return `Resolved: ${money(d.refundAmount)} refunded to the homeowner and ${money(d.tradieAmount)} to the tradie.`;
  return "The dispute has been closed.";
}

export function DisputePanel({ bookingId, bookingStatus, scheduledAt, cancelButton, onChanged }: Props) {
  const [info, setInfo] = useState<Info | null>(null);
  const [step, setStep] = useState<"idle" | "nudge" | "form" | "contest">("idle");
  const [category, setCategory] = useState("");
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      const res = await fetch(`/api/disputes?bookingId=${encodeURIComponent(bookingId)}`);
      const data = await res.json();
      if (res.ok) setInfo(data);
    } catch {}
  }, [bookingId]);

  useEffect(() => { load(); }, [load, bookingStatus, scheduledAt]);

  const close = () => { setStep("idle"); setCategory(""); setText(""); setError(""); };

  const send = async (method: "POST" | "PATCH", body: object) => {
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/disputes", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) { setError(data.error || "Something went wrong. Please try again."); return false; }
      close();
      await load();
      onChanged();
      return true;
    } catch {
      setError("Something went wrong. Please try again.");
      return false;
    } finally { setBusy(false); }
  };

  if (!info) return null;

  const d = info.dispute;
  const live = !!d && (d.status === "OPEN" || d.status === "RESPONDED");
  const other = info.role === "HOMEOWNER" ? "tradie" : "homeowner";
  const minLen = info.rules.minDescriptionLength;
  const chosen = info.categories.find(c => c.key === category);
  const stop = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <div className="w-full space-y-3" onClick={stop}>

      {/* A dispute that is open right now */}
      {live && d && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 space-y-2">
          <p className="text-sm font-bold text-red-800 flex items-center gap-1.5"><AlertTriangle size={14}/> Dispute open: {d.categoryLabel}</p>
          <p className="text-xs text-gray-600">{d.raisedByMe ? "You raised this." : `Raised by the ${other}.`} The booking is on hold until it is resolved.</p>
          <p className="text-sm text-gray-800 bg-white/70 border border-red-100 rounded-lg p-2 whitespace-pre-line">{d.description}</p>

          {d.status === "OPEN" && (
            <p className="text-xs text-gray-700">
              {d.raisedByMe ? `Waiting for the ${other} to reply` : "Please reply"} by <span className="font-semibold">{formatWhen(d.responseDueAt)}</span>.
            </p>
          )}
          {d.status === "RESPONDED" && (
            <>
              <p className="text-xs text-gray-700">
                {d.raisedByMe ? `The ${other}` : "You"} {d.responseType === "ACCEPT" ? "accepted" : "disagreed"}. GeTradie is reviewing and will decide.
              </p>
              {d.response && <p className="text-sm text-gray-800 bg-white/70 border border-red-100 rounded-lg p-2 whitespace-pre-line">{d.response}</p>}
            </>
          )}

          {step === "contest" && (
            <div className="space-y-2">
              <textarea value={text} onChange={e => setText(e.target.value)} rows={3} maxLength={info.rules.maxDescriptionLength}
                placeholder="Explain your side of what happened"
                className="w-full text-sm border border-gray-300 rounded-lg p-2 bg-white"/>
              <div className="flex gap-2 flex-wrap">
                <button disabled={busy || text.trim().length < minLen}
                  onClick={() => send("PATCH", { disputeId: d.id, action: "respond", responseType: "CONTEST", response: text })}
                  className="bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white text-xs font-bold px-4 py-2 rounded-xl">
                  {busy ? "Sending..." : "Send my response"}
                </button>
                <button onClick={close} className="text-xs font-semibold text-gray-600 border border-gray-200 px-4 py-2 rounded-xl bg-white">Close</button>
              </div>
              {text.trim().length < minLen && <p className="text-xs text-gray-500">At least {minLen} characters.</p>}
            </div>
          )}

          {step !== "contest" && (d.canRespond || d.canWithdraw) && (
            <div className="flex gap-2 flex-wrap pt-1">
              {d.canRespond && (
                <>
                  <button disabled={busy}
                    onClick={() => { if (confirm("Accept this dispute? This agrees with what they have said and cannot be undone.")) send("PATCH", { disputeId: d.id, action: "respond", responseType: "ACCEPT" }); }}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white text-xs font-bold px-4 py-2 rounded-xl">
                    I accept
                  </button>
                  <button disabled={busy} onClick={() => { setText(""); setError(""); setStep("contest"); }}
                    className="bg-white text-red-700 border border-red-300 hover:border-red-500 text-xs font-bold px-4 py-2 rounded-xl">
                    I disagree
                  </button>
                </>
              )}
              {d.canWithdraw && (
                <button disabled={busy}
                  onClick={() => { if (confirm("Withdraw this dispute? The booking will carry on as before.")) send("PATCH", { disputeId: d.id, action: "withdraw" }); }}
                  className="bg-white text-gray-700 border border-gray-300 hover:border-gray-500 text-xs font-semibold px-4 py-2 rounded-xl">
                  Withdraw dispute
                </button>
              )}
            </div>
          )}
          {!!error && <p className="text-xs font-semibold text-red-700">{error}</p>}
        </div>
      )}

      {/* The result of the last dispute */}
      {!live && d && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-3">
          <p className="text-xs font-bold text-gray-700">Dispute ({d.categoryLabel})</p>
          <p className="text-xs text-gray-600 mt-0.5">{outcomeText(d)}</p>
          {d.resolutionNote && <p className="text-xs text-gray-500 mt-1 whitespace-pre-line">{d.resolutionNote}</p>}
        </div>
      )}

      {/* Cancel while it is still allowed, otherwise say why it is not */}
      {!live && (info.cancel.allowed || info.canDispute.allowed) && (
        <div className="flex flex-wrap gap-2 items-center">
          {info.cancel.allowed && cancelButton}
          {info.canDispute.allowed && step === "idle" && (
            <button onClick={() => { setError(""); setStep("nudge"); }}
              className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors">
              <AlertTriangle size={12}/> Raise Dispute
            </button>
          )}
        </div>
      )}
      {!live && !info.cancel.allowed && bookingStatus === "CONFIRMED" && (
        <p className="text-xs text-gray-500">{info.cancel.reason}</p>
      )}
      {!live && info.cancel.allowed && info.cancel.closesAt && (
        <p className="text-xs text-gray-500">You can cancel for a full refund of the lock amount until {formatWhen(info.cancel.closesAt)}.</p>
      )}

      {/* Step 1: have you talked first? */}
      {step === "nudge" && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-3">
          <p className="text-sm font-bold text-amber-900">Have you talked to the {other} first?</p>
          <p className="text-xs text-amber-800 leading-relaxed">
            Most problems are sorted out with a message or a call. If you have not spoken yet, chat first.
            Keep your messages and photos, because they are your evidence if the dispute goes ahead.
            While a dispute is open the booking is on hold.
          </p>
          <div className="flex gap-2 flex-wrap">
            <button onClick={close} className="text-xs font-semibold text-gray-700 border border-gray-300 px-4 py-2 rounded-xl bg-white">Close</button>
            <button onClick={() => setStep("form")} className="bg-red-500 hover:bg-red-600 text-white text-xs font-bold px-4 py-2 rounded-xl">Yes, continue</button>
          </div>
        </div>
      )}

      {/* Step 2: reason and description */}
      {step === "form" && (
        <div className="bg-white border border-red-200 rounded-xl p-4 space-y-3">
          <p className="text-sm font-bold text-gray-900">Raise a dispute</p>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Reason</p>
            <select value={category} onChange={e => { setCategory(e.target.value); setError(""); }}
              className="w-full text-sm border border-gray-300 rounded-lg p-2 bg-white">
              <option value="">Choose a reason</option>
              {info.categories.map(c => <option key={c.key} value={c.key}>{c.label}{c.allowed ? "" : " (not available yet)"}</option>)}
            </select>
            {chosen && !chosen.allowed && <p className="text-xs text-amber-700 mt-1">{chosen.reason}</p>}
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">What happened?</p>
            <textarea value={text} onChange={e => setText(e.target.value)} rows={4} maxLength={info.rules.maxDescriptionLength}
              placeholder="Describe the problem clearly. The other party and GeTradie will read this."
              className="w-full text-sm border border-gray-300 rounded-lg p-2"/>
            <p className="text-xs text-gray-400">At least {minLen} characters.</p>
          </div>
          {!!error && <p className="text-xs font-semibold text-red-700">{error}</p>}
          <div className="flex gap-2 flex-wrap">
            <button onClick={close} className="text-xs font-semibold text-gray-700 border border-gray-300 px-4 py-2 rounded-xl bg-white">Close</button>
            <button disabled={busy || !chosen || !chosen.allowed || text.trim().length < minLen}
              onClick={() => send("POST", { bookingId, category, description: text })}
              className="bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white text-xs font-bold px-4 py-2 rounded-xl">
              {busy ? "Submitting..." : "Confirm dispute"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
