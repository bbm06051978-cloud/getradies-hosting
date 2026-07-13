"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowLeft, Star, CheckCircle, Phone, MessageCircle,
  ShieldCheck, DollarSign, Briefcase, MapPin, X,
} from "lucide-react";
import { Sidebar } from "@/app/components/dashboard/Sidebar";
import { Topbar } from "@/app/components/dashboard/Topbar";

type Quote = {
  id: string; amount: number; description: string; status: string; createdAt: string;
  job: { id: string; title: string; trade: string; suburb: string; state: string; };
  tradieProfile: {
    businessName: string; specialty: string; rating: number; totalReviews: number; isVerified: boolean;
    user: { id: string; name: string; phone: string };
  };
};

export default function MyQuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/quotes").then(r => r.json()).then(d => { if (d.quotes) setQuotes(d.quotes); }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleAccept = async (quoteId: string) => {
    setAccepting(quoteId);
    try {
      const res = await fetch(`/api/quotes/${quoteId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (res.ok) {
        // Accept this quote + auto-reject all others for same job
        setQuotes(prev => prev.map(q => {
          const acceptedQuote = prev.find(x => x.id === quoteId);
          if (q.id === quoteId) return { ...q, status: "ACCEPTED" };
          if (acceptedQuote && q.job?.id === acceptedQuote.job?.id) return { ...q, status: "REJECTED" };
          return q;
        }));
        // Show homeowner contact details if returned
        if (data.homeowner) {
          alert(`✅ Quote accepted!\n\nTradie: ${data.tradie?.name}\n${data.tradie?.phone ? `Phone: ${data.tradie.phone}` : "Contact via messages"}`);
        }
      } else {
        alert(data.error || "Failed to accept quote.");
      }
    } catch (err) { 
      console.error("Accept error:", err); 
      console.error("Error details:", JSON.stringify(err));
      alert(`Error: ${err instanceof Error ? err.message : String(err)}`); 
    } finally { setAccepting(null); }
  };

  const groupedByJob = quotes.reduce((acc, quote) => {
    if (!quote.job) return acc;
    const jobId = quote.job.id;
    if (!acc[jobId]) acc[jobId] = { job: quote.job, quotes: [] };
    acc[jobId].quotes.push(quote);
    return acc;
  }, {} as Record<string, { job: Quote["job"]; quotes: Quote[] }>);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <div className="p-8 flex-1">

          <div className="flex items-center gap-4 mb-8">
	<Link href="/my-jobs?filter=ALL" className="text-gray-400 hover:text-gray-600">
              <ArrowLeft size={20} />
            </Link>            
          <div>
              <h1 className="text-2xl font-bold text-gray-900">Quotes Received</h1>
              <p className="text-gray-500 text-sm mt-0.5">Review and accept quotes from verified tradies</p>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <svg className="animate-spin h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
            </div>
          ) : quotes.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
              <Briefcase size={48} className="text-gray-200 mx-auto mb-4" />
              <h3 className="font-bold text-gray-700 text-lg mb-2">No quotes yet</h3>
              <p className="text-gray-400 text-sm">Once tradies send quotes they will appear here.</p>
              <Link href="/post-job">
                <button className="mt-6 bg-blue-900 hover:bg-blue-800 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-colors">Post a New Job</button>
              </Link>
            </div>
          ) : (
            <div className="space-y-8">
              {Object.values(groupedByJob).map(({ job, quotes: jobQuotes }) => (
                <div key={job.id}>
                  {/* Job header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Briefcase size={18} className="text-blue-600" />
                    </div>
                    <div>
                      <h2 className="font-bold text-gray-900">{job.title}</h2>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                        <span className="bg-blue-100 text-blue-700 font-semibold px-2 py-0.5 rounded-full">{job.trade}</span>
                        <MapPin size={11} />{job.suburb}, {job.state}
                        <span className="text-gray-400">·</span>
                        <span>{jobQuotes.length} quote{jobQuotes.length > 1 ? "s" : ""}</span>
                      </div>
                    </div>
                  </div>

                  {/* Quotes grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                    {jobQuotes.map(quote => (
                      <motion.div key={quote.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                        className={`bg-white rounded-xl p-4 shadow-sm border-2 transition-all ${
                          quote.status === "ACCEPTED" ? "border-green-300 bg-green-50/30" : "border-gray-100 hover:border-blue-200"
                        }`}>

                        {/* Tradie info */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className="w-9 h-9 bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-white font-bold text-xs">
                                {quote.tradieProfile?.businessName?.charAt(0) || "T"}
                              </span>
                            </div>
                            <div>
                              <div className="flex items-center gap-1">
                                <p className="font-bold text-gray-900 text-xs">{quote.tradieProfile?.businessName || "Tradie"}</p>
                                {quote.tradieProfile?.isVerified && <ShieldCheck size={11} className="text-green-500" />}
                              </div>
                              <p className="text-xs text-gray-400">{quote.tradieProfile?.specialty}</p>
                              <div className="flex items-center gap-0.5 mt-0.5">
                                <Star size={9} className="text-yellow-400 fill-yellow-400" />
                                <span className="text-xs text-gray-500">{quote.tradieProfile?.rating?.toFixed(1) || "0.0"} ({quote.tradieProfile?.totalReviews || 0})</span>
                              </div>
                            </div>
                          </div>
                          {quote.status === "ACCEPTED" && (
                            <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                              <CheckCircle size={10} />Accepted
                            </span>
                          )}
                        </div>

                        {/* Price */}
                        <div className="flex items-center gap-1.5 bg-blue-50 rounded-lg px-3 py-2 mb-3">
                          <DollarSign size={16} className="text-blue-600" />
                          <span className="text-xl font-bold text-blue-900">${quote.amount.toLocaleString()}</span>
                          <span className="text-xs text-blue-600 font-medium">AUD</span>
                        </div>

                        {/* Description */}
                        <p className="text-xs text-gray-600 leading-relaxed mb-3 whitespace-pre-line line-clamp-3">
                          {quote.description}
                        </p>

                        <p className="text-xs text-gray-400 mb-3">
                          {new Date(quote.createdAt).toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" })}
                        </p>

                        {/* Actions */}
                        {quote.status === "PENDING" && (
                          <div className="space-y-1.5">
                            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                              onClick={() => handleAccept(quote.id)} disabled={accepting === quote.id}
                              className="w-full bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white py-2 rounded-lg font-bold text-xs transition-colors flex items-center justify-center gap-1.5">
                              {accepting === quote.id ? (
                                <><svg className="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg>Accepting...</>
                              ) : (
                                <><CheckCircle size={12} />Accept Quote</>
                              )}
                            </motion.button>
                            <div className="grid grid-cols-2 gap-1.5">
                              <a href={`tel:${quote.tradieProfile?.user?.phone || ""}`}
                                className="flex items-center justify-center gap-1 border border-gray-200 hover:border-blue-300 text-gray-600 hover:text-blue-700 py-1.5 rounded-lg text-xs font-semibold transition-colors">
                                <Phone size={11} />Call
                              </a>
                              <Link href={`/chats?jobId=${quote.job.id}&receiverId=${quote.tradieProfile?.user?.id}&receiverName=${encodeURIComponent(quote.tradieProfile?.user?.name || "")}&jobTitle=${encodeURIComponent(quote.job.title || "")}&trade=${encodeURIComponent(quote.job.trade || "")}`}>
                                <button className="flex items-center justify-center gap-1 border border-gray-200 hover:border-blue-300 text-gray-600 hover:text-blue-700 py-1.5 rounded-lg text-xs font-semibold transition-colors w-full">
                                  <MessageCircle size={11} />Message
                                </button>
                              </Link>
                            </div>
                          </div>
                        )}

                        {quote.status === "ACCEPTED" && (
                          <div className="flex items-center gap-1.5 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                            <CheckCircle size={13} className="text-green-500" />
                            <p className="text-xs text-green-700 font-semibold">Quote accepted</p>
                          </div>
                        )}
                        {quote.status === "REJECTED" && (
                          <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                            <X size={13} className="text-gray-400" />
                            <p className="text-xs text-gray-500 font-semibold">Another tradie was selected</p>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}