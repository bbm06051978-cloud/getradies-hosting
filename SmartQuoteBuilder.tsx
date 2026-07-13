"use client";

import { useState } from "react";
import { Zap, X, Copy, Check, ChevronDown, Sparkles } from "lucide-react";

type QuoteFields = {
  amount: string;
  description: string;
  availability: string;
  warranty: string;
};

type Job = {
  id: string;
  title: string;
  description: string;
  trade: string;
  suburb: string;
  state: string;
  aiEstimate?: string | null;
};

type Props = {
  job: Job;
  onClose: () => void;
  onApply: (fields: QuoteFields) => void;
};

export function SmartQuoteBuilder({ job, onClose, onApply }: Props) {
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState<QuoteFields | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  const generate = async () => {
    setLoading(true); setError(""); setGenerated(null);
    try {
      const res = await fetch("/api/smart-quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobTitle:       job.title,
          jobDescription: job.description,
          trade:          job.trade,
          suburb:         job.suburb,
          state:          job.state,
          aiEstimate:     job.aiEstimate || "",
        }),
      });
      const data = await res.json();
      if (data.error) { setError(data.error); return; }
      setGenerated(data);
    } catch { setError("Something went wrong. Please try again."); }
    finally { setLoading(false); }
  };

  const copy = (field: string, val: string) => {
    navigator.clipboard.writeText(val);
    setCopied(field);
    setTimeout(() => setCopied(null), 1500);
  };

  const applyAll = () => {
    if (generated) { onApply(generated); onClose(); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col max-h-[90vh]"
        style={{ animation: "slideUp 0.22s cubic-bezier(.22,1,.36,1)" }}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: "rgba(249,115,22,0.12)", border: "1px solid rgba(249,115,22,0.25)" }}>
              <Zap size={18} className="text-orange-500 fill-orange-500" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900">✨ AI Quote Builder</h2>
              <p className="text-xs text-gray-400">Auto-fills your quote form</p>
            </div>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center">
            <X size={16} className="text-gray-500" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-6">

          {/* Job summary */}
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 mb-5">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Job</p>
            <p className="font-bold text-gray-900">{job.title}</p>
            <p className="text-xs text-gray-500 mt-0.5">{job.suburb}, {job.state} · {job.trade}</p>
            {job.description && (
              <p className="text-xs text-gray-500 mt-2 leading-relaxed line-clamp-2">{job.description}</p>
            )}
          </div>

          {/* Generate button */}
          {!generated && (
            <button onClick={generate} disabled={loading}
              className="w-full py-3.5 rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2 mb-4 disabled:opacity-60"
              style={{ background: "linear-gradient(135deg,#F97316,#EA580C)", boxShadow: "0 4px 20px rgba(249,115,22,0.35)" }}>
              {loading ? (
                <><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle style={{ opacity:.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path style={{ opacity:.75 }} fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                </svg>Generating your quote...</>
              ) : (
                <><Zap size={15} className="fill-white"/>Generate AI Quote Fields</>
              )}
            </button>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-4">
              {error}
            </div>
          )}

          {/* Generated fields */}
          {generated && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                  <Check size={11} className="text-green-600"/>
                </div>
                <p className="text-sm font-semibold text-green-700">Quote generated — review and apply</p>
              </div>

              {/* Quote Amount */}
              <div className="bg-orange-50 border border-orange-100 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-bold text-orange-600 uppercase tracking-widest">Quote Amount (AUD)</p>
                  <button onClick={() => copy("amount", generated.amount)}
                    className="flex items-center gap-1 text-xs text-orange-500 hover:text-orange-700 font-semibold">
                    {copied === "amount" ? <><Check size={11}/>Copied</> : <><Copy size={11}/>Copy</>}
                  </button>
                </div>
                <p className="text-2xl font-bold text-gray-900">${generated.amount}</p>
                <p className="text-xs text-gray-400 mt-1">Total fixed price inc. labour and materials</p>
              </div>

              {/* Quote Description */}
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">Quote Description</p>
                  <button onClick={() => copy("description", generated.description)}
                    className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-700 font-semibold">
                    {copied === "description" ? <><Check size={11}/>Copied</> : <><Copy size={11}/>Copy</>}
                  </button>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{generated.description}</p>
              </div>

              {/* Availability */}
              <div className="bg-purple-50 border border-purple-100 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-bold text-purple-600 uppercase tracking-widest">Availability</p>
                  <button onClick={() => copy("availability", generated.availability)}
                    className="flex items-center gap-1 text-xs text-purple-500 hover:text-purple-700 font-semibold">
                    {copied === "availability" ? <><Check size={11}/>Copied</> : <><Copy size={11}/>Copy</>}
                  </button>
                </div>
                <p className="text-sm text-gray-700 font-medium">{generated.availability}</p>
              </div>

              {/* Warranty */}
              <div className="bg-green-50 border border-green-100 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-bold text-green-600 uppercase tracking-widest">Warranty / Guarantee</p>
                  <button onClick={() => copy("warranty", generated.warranty)}
                    className="flex items-center gap-1 text-xs text-green-500 hover:text-green-700 font-semibold">
                    {copied === "warranty" ? <><Check size={11}/>Copied</> : <><Copy size={11}/>Copy</>}
                  </button>
                </div>
                <p className="text-sm text-gray-700">{generated.warranty}</p>
              </div>

              {/* Apply all button */}
              <button onClick={applyAll}
                className="w-full py-3.5 rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2"
                style={{ background: "linear-gradient(135deg,#1D4ED8,#2563EB)", boxShadow: "0 4px 20px rgba(37,99,235,0.35)" }}>
                <Zap size={15} className="fill-white"/>
                Apply All Fields to Quote Form
              </button>

              <button onClick={generate} disabled={loading}
                className="w-full py-2.5 rounded-xl font-semibold text-orange-500 text-sm border-2 border-orange-200 hover:border-orange-400 hover:bg-orange-50 transition-all">
                🔄 Regenerate
              </button>
            </div>
          )}
        </div>
      </div>
      <style>{`@keyframes slideUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );
}
