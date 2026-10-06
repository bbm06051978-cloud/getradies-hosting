"use client";
import { useCallback, useEffect, useState } from "react";
import { formatWhen } from "@/lib/dateTime";

type Row = {
  paymentId: string; bookingId: string; bookingStatus: string; jobTitle: string; location: string;
  homeowner: string; tradie: string; lockAmount: number; refunded: number; fee: number;
  completedAt: string | null; hasStripeReference: boolean;
};
type Month = { month: string; fees: number; jobs: number };

const money = (n: number | null | undefined) => `$${(n ?? 0).toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const monthLabel = (key: string) => { const [y, m] = key.split("-"); return `${MONTHS[Number(m) - 1] || m} ${y}`; };
const STATUS: Record<string, string> = {
  PENDING: "Waiting for tradie to confirm", CONFIRMED: "Confirmed", PENDING_CONFIRMATION: "Marked done", DISPUTED: "In dispute",
};

export function AdminEarnings() {
  const [earned, setEarned] = useState<Row[]>([]);
  const [pending, setPending] = useState<Row[]>([]);
  const [months, setMonths] = useState<Month[]>([]);
  const [totals, setTotals] = useState({ earned: 0, thisMonth: 0, pending: 0 });
  const [loaded, setLoaded] = useState(false);
  const [showPending, setShowPending] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/earnings");
      const data = await res.json();
      if (res.ok) {
        setEarned(data.earned || []); setPending(data.pending || []); setMonths(data.months || []);
        setTotals({ earned: data.totalEarned || 0, thisMonth: data.earnedThisMonth || 0, pending: data.totalPending || 0 });
      }
    } catch {} finally { setLoaded(true); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const row = (r: Row, isPending: boolean) => (
    <div key={r.paymentId} className="bg-gray-900 rounded-2xl border border-gray-800 p-4 flex items-start justify-between gap-4 flex-wrap">
      <div>
        <p className="font-bold text-white text-sm">{r.jobTitle} <span className="font-normal text-gray-500">· {r.location}</span></p>
        <p className="text-sm text-gray-400">Homeowner: {r.homeowner} · Tradie: {r.tradie}</p>
        <p className="text-xs text-gray-500">
          Lock {money(r.lockAmount)}{r.refunded > 0 ? ` · refunded to homeowner ${money(r.refunded)}` : ""}
          {isPending ? ` · ${STATUS[r.bookingStatus] || r.bookingStatus}` : r.completedAt ? ` · completed ${formatWhen(r.completedAt)}` : ""}
        </p>
        {!r.hasStripeReference && <p className="text-xs text-orange-400 mt-1">Older payment with no Stripe reference.</p>}
      </div>
      <p className={`text-lg font-black ${isPending ? "text-yellow-400" : "text-green-400"}`}>{money(r.fee)}</p>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="bg-gray-900 rounded-2xl border border-green-900 p-5">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Fees earned</p>
          <p className="text-2xl font-black text-white mt-1">{money(totals.earned)}</p>
          <p className="text-xs text-gray-500 mt-1">{earned.length} completed job{earned.length === 1 ? "" : "s"}</p>
        </div>
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Earned this month</p>
          <p className="text-2xl font-black text-white mt-1">{money(totals.thisMonth)}</p>
        </div>
        <div className="bg-gray-900 rounded-2xl border border-yellow-900 p-5">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Expected from jobs in progress</p>
          <p className="text-2xl font-black text-white mt-1">{money(totals.pending)}</p>
          <p className="text-xs text-gray-500 mt-1">{pending.length} job{pending.length === 1 ? "" : "s"} · not earned until completed</p>
        </div>
      </div>

      <p className="text-xs text-gray-500">
        These are GeTradie&apos;s platform fees before Stripe&apos;s card processing fees. A fee is earned when a job is completed. A cancelled or fully refunded job earns no fee, and Stripe does not return its own fee on refunds.
      </p>

      {months.length > 0 && (
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">By month</p>
          <div className="space-y-2">
            {months.map(m => (
              <div key={m.month} className="flex items-center justify-between text-sm">
                <span className="text-gray-300">{monthLabel(m.month)} <span className="text-gray-500">· {m.jobs} job{m.jobs === 1 ? "" : "s"}</span></span>
                <span className="font-bold text-white">{money(m.fees)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {pending.length > 0 && (
        <div>
          <button onClick={() => setShowPending(s => !s)} className="text-xs font-bold text-gray-400 hover:text-gray-200">
            {showPending ? "Hide" : "Show"} jobs in progress ({pending.length})
          </button>
          {showPending && <div className="space-y-3 mt-3">{pending.map(r => row(r, true))}</div>}
        </div>
      )}

      {loaded && earned.length === 0 && (
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-12 text-center">
          <p className="text-gray-400">No fees earned yet</p>
        </div>
      )}
      {earned.length > 0 && <p className="text-xs font-bold text-gray-500 uppercase tracking-widest pt-2">Completed jobs</p>}
      {earned.map(r => row(r, false))}
    </div>
  );
}
