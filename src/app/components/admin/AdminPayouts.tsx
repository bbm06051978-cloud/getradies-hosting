"use client";
import { useCallback, useEffect, useState } from "react";
import { CheckCircle } from "lucide-react";
import { formatWhen } from "@/lib/dateTime";

type Row = {
  paymentId: string; bookingId: string; jobTitle: string; location: string; completedAt: string;
  tradie: { businessName: string; name: string; email: string; phone: string | null; abn: string | null };
  lockAmount: number; refunded: number; platformFee: number; hasStripeReference: boolean;
  owed: number; paidAmount: number | null; paidAt: string | null; reference: string | null;
};

const money = (n: number | null | undefined) => `$${(n ?? 0).toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export function AdminPayouts() {
  const [owed, setOwed] = useState<Row[]>([]);
  const [paid, setPaid] = useState<Row[]>([]);
  const [totals, setTotals] = useState({ owed: 0, paid: 0 });
  const [loaded, setLoaded] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);
  const [reference, setReference] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [showPaid, setShowPaid] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/payouts");
      const data = await res.json();
      if (res.ok) { setOwed(data.owed || []); setPaid(data.paid || []); setTotals({ owed: data.totalOwed || 0, paid: data.totalPaid || 0 }); }
    } catch {} finally { setLoaded(true); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const markPaid = async (r: Row) => {
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/admin/payouts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentId: r.paymentId, reference }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) { setError(data.error || "Could not record the payout."); return; }
      setOpenId(null);
      setReference("");
      await load();
    } catch { setError("Something went wrong. Please try again."); }
    finally { setBusy(false); }
  };

  const breakdown = (r: Row) => (
    <p className="text-xs text-gray-500">
      Lock {money(r.lockAmount)}{r.refunded > 0 ? ` · refunded to homeowner ${money(r.refunded)}` : ""} · GeTradie fee {money(r.platformFee)}
    </p>
  );

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="bg-gray-900 rounded-2xl border border-orange-900 p-5">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Owed to tradies</p>
          <p className="text-2xl font-black text-white mt-1">{money(totals.owed)}</p>
          <p className="text-xs text-gray-500 mt-1">{owed.length} payout{owed.length === 1 ? "" : "s"} waiting</p>
        </div>
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Paid out</p>
          <p className="text-2xl font-black text-white mt-1">{money(totals.paid)}</p>
          <p className="text-xs text-gray-500 mt-1">{paid.length} payout{paid.length === 1 ? "" : "s"} recorded</p>
        </div>
      </div>

      <p className="text-xs text-gray-500">
        This list does not move any money. Pay the tradie by bank transfer first, then record it here with the transfer reference. The tradie is notified when you record it.
      </p>

      {loaded && owed.length === 0 && (
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-12 text-center">
          <CheckCircle size={48} className="text-gray-700 mx-auto mb-4"/>
          <p className="text-gray-400">No payouts waiting</p>
        </div>
      )}

      {owed.map(r => (
        <div key={r.paymentId} className="bg-gray-900 rounded-2xl border border-orange-900 p-5 space-y-3">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h3 className="font-bold text-white">{r.tradie.businessName || r.tradie.name}</h3>
              <p className="text-sm text-gray-400">{r.tradie.name} · {r.tradie.email}{r.tradie.phone ? ` · ${r.tradie.phone}` : ""}{r.tradie.abn ? ` · ABN ${r.tradie.abn}` : ""}</p>
              <p className="text-sm text-gray-300 mt-2">{r.jobTitle} <span className="text-gray-500">· {r.location} · completed {formatWhen(r.completedAt)}</span></p>
              {breakdown(r)}
              {!r.hasStripeReference && <p className="text-xs text-orange-400 mt-1">Older payment with no Stripe reference. Check it was really received before paying.</p>}
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Pay tradie</p>
              <p className="text-2xl font-black text-white">{money(r.owed)}</p>
            </div>
          </div>

          {openId !== r.paymentId ? (
            <button onClick={() => { setOpenId(r.paymentId); setReference(""); setError(""); }}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-xs font-bold">Mark as paid</button>
          ) : (
            <div className="bg-gray-950 border border-green-900 rounded-xl p-4 space-y-3">
              <p className="text-xs text-gray-400">Bank transfer reference for the {money(r.owed)} you sent:</p>
              <input value={reference} onChange={e => setReference(e.target.value)} maxLength={200} placeholder="e.g. receipt number or transfer description"
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white"/>
              {!!error && <p className="text-xs font-semibold text-red-400">{error}</p>}
              <div className="flex gap-2 flex-wrap">
                <button onClick={() => setOpenId(null)} className="border border-gray-700 text-gray-300 px-4 py-2 rounded-xl text-xs font-bold">Close</button>
                <button disabled={busy || reference.trim().length < 3}
                  onClick={() => { if (confirm(`Record that ${money(r.owed)} has been paid to ${r.tradie.businessName || r.tradie.name}? This cannot be undone here.`)) markPaid(r); }}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-green-900 disabled:text-gray-500 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2">
                  <CheckCircle size={13}/>{busy ? "Saving..." : "Confirm paid"}
                </button>
              </div>
            </div>
          )}
        </div>
      ))}

      {paid.length > 0 && (
        <div>
          <button onClick={() => setShowPaid(s => !s)} className="text-xs font-bold text-gray-400 hover:text-gray-200">
            {showPaid ? "Hide" : "Show"} paid payouts ({paid.length})
          </button>
          {showPaid && (
            <div className="space-y-3 mt-3">
              {paid.map(r => (
                <div key={r.paymentId} className="bg-gray-900 rounded-2xl border border-gray-800 p-4 flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <p className="font-bold text-white text-sm">{r.tradie.businessName || r.tradie.name}</p>
                    <p className="text-sm text-gray-400">{r.jobTitle} <span className="text-gray-500">· {r.location}</span></p>
                    {breakdown(r)}
                    <p className="text-xs text-gray-400 mt-1">Paid {r.paidAt ? formatWhen(r.paidAt) : ""} · Ref: {r.reference}</p>
                  </div>
                  <p className="text-lg font-black text-green-400">{money(r.paidAmount)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
