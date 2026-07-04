"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "motion/react";
import {
  ArrowLeft, MapPin, Calendar, Briefcase, Zap,
  Send, CheckCircle, Clock, DollarSign, User,
} from "lucide-react";
import { TradieSidebar } from "@/app/components/tradie/TradieSidebar";
import { TradieTopbar } from "@/app/components/tradie/TradieTopbar";

type Job = {
  id: string;
  title: string;
  description: string;
  trade: string;
  suburb: string;
  state: string;
  status: string;
  aiEstimate: string | null;
  createdAt: string;
  user: { name: string; suburb: string; state: string };
  _count: { quotes: number };
};

export default function TradieJobDetailPage() {
  const { jobId } = useParams();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [quoteAmount, setQuoteAmount] = useState("");
  const [quoteNote, setQuoteNote] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!jobId) return;
    fetch(`/api/tradie-jobs/${jobId}`)
      .then(r => r.json())
      .then(d => { if (d.job) setJob(d.job); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [jobId]);

  const handleSendQuote = async () => {
    if (!quoteAmount || isNaN(Number(quoteAmount))) { setError("Enter a valid quote amount."); return; }
    setSending(true); setError("");
    try {
      const res = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId, amount: Number(quoteAmount), note: quoteNote }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed to send quote."); return; }
      setSent(true);
    } catch { setError("Something went wrong."); }
    finally { setSending(false); }
  };

  if (loading) return (
    <div className="flex min-h-screen bg-slate-50">
      <TradieSidebar />
      <main className="flex-1 flex flex-col min-w-0">
        <TradieTopbar />
        <div className="flex items-center justify-center py-20">
          <svg className="animate-spin h-8 w-8 text-orange-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
        </div>
      </main>
    </div>
  );

  if (!job) return (
    <div className="flex min-h-screen bg-slate-50">
      <TradieSidebar />
      <main className="flex-1 flex flex-col min-w-0">
        <TradieTopbar />
        <div className="p-8 text-center">
          <p className="text-gray-500">Job not found.</p>
          <Link href="/tradie-jobs" className="text-orange-500 font-semibold mt-4 inline-block">← Back to Jobs</Link>
        </div>
      </main>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-slate-50">
      <TradieSidebar />
      <main className="flex-1 flex flex-col min-w-0">
        <TradieTopbar />
        <div className="p-8 max-w-3xl mx-auto w-full">

          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link href="/tradie-jobs" className="text-gray-400 hover:text-gray-600">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
              <p className="text-gray-500 text-sm mt-0.5">Job details and quote submission</p>
            </div>
          </div>

          {/* Job card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
            <div className="flex items-start gap-4 mb-5">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Briefcase size={20} className="text-orange-500" />
              </div>
              <div className="flex-1">
                <h2 className="font-bold text-gray-900 text-lg">{job.title}</h2>
                <div className="flex flex-wrap gap-3 mt-2">
                  <span className="bg-orange-100 text-orange-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                    {job.trade}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-gray-500">
                    <MapPin size={12} />{job.suburb}, {job.state}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-gray-500">
                    <Calendar size={12} />{new Date(job.createdAt).toLocaleDateString("en-AU", { day:"numeric", month:"long", year:"numeric" })}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-gray-500">
                    <User size={12} />{job._count.quotes} quote{job._count.quotes !== 1 ? "s" : ""} sent
                  </span>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-5">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Job Description</p>
              <p className="text-sm text-gray-700 leading-relaxed">{job.description || "No description provided."}</p>
            </div>

            {job.aiEstimate && (
              <div className="mt-5 bg-blue-50 border border-blue-100 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Zap size={14} className="text-blue-600 fill-blue-600" />
                  <span className="text-xs font-bold text-blue-800 uppercase tracking-widest">AI Estimate</span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-line">
                  {job.aiEstimate.split("\n").filter(l => !l.startsWith("🔧")).join("\n")}
                </p>
              </div>
            )}

            <div className="mt-4 flex items-center gap-2">
              <User size={14} className="text-gray-400" />
              <span className="text-sm text-gray-500">Posted by {job.user.name} from {job.user.suburb}, {job.user.state}</span>
            </div>
          </div>

          {/* Quote form */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-bold text-gray-900 mb-5 flex items-center gap-2">
              <Send size={18} className="text-orange-500" />
              Send Your Quote
            </h3>

            {sent ? (
              <div className="flex flex-col items-center py-8 text-center">
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-3">
                  <CheckCircle size={28} className="text-green-500" />
                </div>
                <p className="font-bold text-gray-900 text-lg mb-1">Quote Sent!</p>
                <p className="text-gray-400 text-sm mb-5">The homeowner will be notified of your quote.</p>
                <Link href="/tradie-jobs">
                  <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition-colors">
                    Back to Jobs
                  </button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">
                    Quote Amount (AUD)
                  </label>
                  <div className="flex items-center border border-gray-200 focus-within:border-orange-400 rounded-xl px-4 py-3 gap-3 transition-colors">
                    <DollarSign size={16} className="text-gray-400" />
                    <input
                      type="number"
                      placeholder="e.g. 250"
                      value={quoteAmount}
                      onChange={e => setQuoteAmount(e.target.value)}
                      className="flex-1 text-sm text-gray-700 outline-none bg-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">
                    Note to Homeowner (optional)
                  </label>
                  <textarea
                    value={quoteNote}
                    onChange={e => setQuoteNote(e.target.value)}
                    placeholder="Describe your approach, experience or timeline..."
                    rows={4}
                    className="w-full border border-gray-200 focus:border-orange-400 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none transition-colors resize-none"
                  />
                </div>

                <button
                  onClick={handleSendQuote}
                  disabled={sending}
                  className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white py-3 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2"
                >
                  <Send size={15} />
                  {sending ? "Sending Quote..." : "Send Quote to Homeowner"}
                </button>

                <p className="text-xs text-gray-400 text-center">
                  The homeowner will see your quote alongside others and can message you before accepting.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
