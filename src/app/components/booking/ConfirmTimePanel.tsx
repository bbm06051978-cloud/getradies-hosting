"use client";
import { useState } from "react";
import { CheckCircle, Clock } from "lucide-react";
import { CANCEL_CUTOFF_HOURS } from "@/lib/bookingRules";
import { combineLocal, formatWhen, toDateInput, toTimeInput, todayInput } from "@/lib/dateTime";

type Props = {
  bookingId: string;
  // "confirm" accepts the booking with a start time; "set_time" changes the time on a confirmed booking
  action: "confirm" | "set_time";
  // pre-filled start time, if there is one worth suggesting
  initialIso?: string | null;
  // what the homeowner asked for when posting the job
  homeownerAskedIso?: string | null;
  onDone: (scheduledAtIso: string) => void;
  onClose: () => void;
};

// The tradie chooses (or accepts) the job's start time. This is the time both sides are held to.
export function ConfirmTimePanel({ bookingId, action, initialIso, homeownerAskedIso, onDone, onClose }: Props) {
  const suggested = initialIso && new Date(initialIso).getTime() > Date.now() ? new Date(initialIso) : null;
  const [date, setDate] = useState(suggested ? toDateInput(suggested) : "");
  const [time, setTime] = useState(suggested ? toTimeInput(suggested) : "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const asked = homeownerAskedIso ? new Date(homeownerAskedIso) : null;
  const askedStillAhead = !!asked && asked.getTime() > Date.now();
  const chosen = combineLocal(date, time);
  const differs = !!asked && !!chosen && Math.abs(asked.getTime() - chosen.getTime()) > 60 * 1000;

  const submit = async () => {
    if (!chosen) { setError("Please choose both a date and a time."); return; }
    if (chosen.getTime() <= Date.now()) { setError("The start time must be in the future."); return; }
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/tradie-bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, action, scheduledAt: chosen.toISOString() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) { setError(data.error || "Something went wrong. Please try again."); return; }
      onDone(chosen.toISOString());
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div onClick={e => e.stopPropagation()} className="w-full bg-white border border-blue-200 rounded-xl p-4 text-left space-y-3">
      <div className="flex items-center gap-2">
        <Clock size={15} className="text-blue-600"/>
        <p className="text-sm font-bold text-gray-900">
          {action === "confirm" ? "When will you start this job?" : "Change the start time"}
        </p>
      </div>

      {asked && (
        <p className="text-xs text-gray-600">
          The homeowner asked for <span className="font-semibold text-gray-900">{formatWhen(asked)}</span>.
          {!askedStillAhead && " That time has passed, so please choose a new one."}
        </p>
      )}

      <div className="grid grid-cols-2 gap-2">
        <label className="block">
          <span className="block text-xs font-medium text-gray-500 mb-1">Date</span>
          <input type="date" value={date} min={todayInput()} onChange={e => { setDate(e.target.value); setError(""); }}
            className="w-full border border-gray-200 focus:border-blue-400 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none"/>
        </label>
        <label className="block">
          <span className="block text-xs font-medium text-gray-500 mb-1">Start time</span>
          <input type="time" value={time} step={900} onChange={e => { setTime(e.target.value); setError(""); }}
            className="w-full border border-gray-200 focus:border-blue-400 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none"/>
        </label>
      </div>

      {differs && (
        <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
          This is different from the time the homeowner asked for. They will be told, and can cancel for a full refund if it doesn&apos;t suit them.
        </p>
      )}

      <p className="text-xs text-gray-400">
        You are committing to this time. Either of you can cancel free of charge until {CANCEL_CUTOFF_HOURS} hours before it.
      </p>

      {error && <p className="text-xs font-semibold text-red-600">{error}</p>}

      <div className="flex gap-2">
        <button type="button" onClick={submit} disabled={busy}
          className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors">
          <CheckCircle size={13}/>
          {busy ? "Saving..." : action === "confirm" ? "Confirm booking for this time" : "Save new time"}
        </button>
        <button type="button" onClick={onClose} disabled={busy}
          className="text-xs font-semibold text-gray-600 border border-gray-200 hover:border-gray-400 px-4 py-2 rounded-xl transition-colors">
          Back
        </button>
      </div>
    </div>
  );
}
