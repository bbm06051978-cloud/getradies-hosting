"use client";
import { useState, useEffect, Suspense, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import {
  Briefcase, MapPin, Calendar, Clock, ChevronRight,
  Send, CheckCircle, XCircle, AlertCircle, MessageSquare,
  DollarSign, User, Zap, RefreshCw,
} from "lucide-react";
import { TradieSidebar } from "@/app/components/tradie/TradieSidebar";
import { TradieTopbar } from "@/app/components/tradie/TradieTopbar";

type UserRef = { id: string; name: string; suburb: string | null; state: string | null };
type AvailableJob = {
  id: string; title: string; description: string; trade: string;
  suburb: string; state: string; status: string; aiEstimate: string | null;
  createdAt: string; user: UserRef; _count: { quotes: number };
};
type MyQuote = {
  id: string; amount: number; description: string; status: string; createdAt: string;
  job: { id: string; title: string; trade: string; suburb: string; state: string; user: UserRef };
};
type Booking = {
  id: string; scheduledAt: string; status: string; totalAmount: number;
  job: { id: string; title: string; trade: string; suburb: string; state: string; user: UserRef };
};

const getQuoteStatusBadge = (status: string) => {
  switch (status) {
    case "ACCEPTED": return { label: "✅ Accepted", color: "bg-green-100 text-green-700" };
    case "REJECTED": return { label: "❌ Rejected", color: "bg-red-100 text-red-700" };
    default:         return { label: "⏳ Pending",  color: "bg-yellow-100 text-yellow-700" };
  }
};

const getBookingStatusBadge = (status: string) => {
  switch (status) {
    case "PENDING":              return { label: "🔔 Awaiting Confirmation", color: "bg-yellow-100 text-yellow-700" };
    case "CONFIRMED":            return { label: "📅 Confirmed",             color: "bg-blue-100 text-blue-700" };
    case "PENDING_CONFIRMATION": return { label: "🏠 Awaiting Homeowner",    color: "bg-purple-100 text-purple-700" };
    case "COMPLETED":            return { label: "✅ Completed",             color: "bg-green-100 text-green-700" };
    case "CANCELLED":            return { label: "❌ Cancelled",             color: "bg-gray-100 text-gray-600" };
    case "DISPUTED":             return { label: "⚠️ Disputed",             color: "bg-red-100 text-red-700" };
    default:                     return { label: status,                      color: "bg-gray-100 text-gray-600" };
  }
};

function TradieJobsPageInner() {
  const [tab, setTab]                           = useState<"available" | "active" | "closed">("available");
  const [availableJobs, setAvailableJobs]       = useState<AvailableJob[]>([]);
  const [myQuotes, setMyQuotes]                 = useState<MyQuote[]>([]);
  const [bookings, setBookings]                 = useState<Booking[]>([]);
  const [completedBookings, setCompletedBookings] = useState<Booking[]>([]);
  const [loading, setLoading]                   = useState(true);
  const [busy, setBusy]                         = useState<string | null>(null);
  const searchParams                            = useSearchParams();
  const pollRef                                 = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const t = searchParams.get("tab");
    if (t === "active" || t === "closed") setTab(t);
  }, [searchParams]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/tradie-jobs");
        const data = await res.json();
        setAvailableJobs(data.availableJobs || []);
        setMyQuotes(data.myQuotes || []);
        setBookings(data.activeBookings || []);
        setCompletedBookings(data.completedBookings || []);
      } catch {} finally { setLoading(false); }
    };
    load();
    pollRef.current = setInterval(load, 30000);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, []);

  const handleConfirmBooking = async (bookingId: string) => {
    setBusy(bookingId);
    try {
      await fetch("/api/tradie-bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, action: "confirm" }),
      });
      setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: "CONFIRMED" } : b));
    } catch {} finally { setBusy(null); }
  };

  const handleMarkDone = async (bookingId: string) => {
    setBusy(bookingId);
    try {
      await fetch("/api/tradie-bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, action: "mark_done" }),
      });
      setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: "PENDING_CONFIRMATION" } : b));
    } catch {} finally { setBusy(null); }
  };

  // Active = quotes pending/accepted + bookings not closed
  const activeQuotes   = myQuotes.filter(q => q.status === "PENDING");
  const activeBookings = bookings.filter(b => !["COMPLETED", "CANCELLED", "DISPUTED"].includes(b.status));
  const closedBookings = [...bookings, ...completedBookings].filter(b => ["COMPLETED", "CANCELLED", "DISPUTED"].includes(b.status));
  const rejectedQuotes = myQuotes.filter(q => q.status === "REJECTED");

  const activeCount = activeQuotes.length + activeBookings.length;
  const closedCount = closedBookings.length + rejectedQuotes.length;

  const TABS = [
    { key: "available", label: "Available Jobs", count: availableJobs.length },
    { key: "active",    label: "Active",          count: activeCount },
    { key: "closed",    label: "Closed",           count: closedCount },
  ] as const;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <TradieSidebar/>
      <div className="flex-1 flex flex-col">
        <TradieTopbar/>
        <div className="p-6 lg:p-8 flex-1">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">My Jobs</h1>
            <p className="text-gray-500 text-sm mt-0.5">Manage your leads, quotes and bookings</p>
          </div>

          {/* 3 Tabs */}
          <div className="flex gap-2 mb-6 bg-white rounded-2xl p-1.5 shadow-sm border border-gray-100 w-fit">
            {TABS.map(t => (
              <button key={t.key} onClick={() => setTab(t.key)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  tab === t.key ? "bg-orange-500 text-white shadow" : "text-gray-500 hover:text-gray-700"
                }`}>
                {t.label}
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                  tab === t.key ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
                }`}>{t.count}</span>
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-20 text-gray-400">Loading...</div>
          ) : (
            <>
              {/* ── AVAILABLE JOBS ── */}
              {tab === "available" && (
                availableJobs.length === 0 ? (
                  <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
                    <Briefcase size={48} className="text-gray-200 mx-auto mb-4"/>
                    <h3 className="font-bold text-gray-700 mb-2">No job leads available</h3>
                    <p className="text-gray-400 text-sm">New jobs matching your specialty will appear here.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {availableJobs.map(job => (
                      <motion.div key={job.id} initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
                        className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-4 flex-1">
                            <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center flex-shrink-0">
                              <Briefcase size={20} className="text-orange-500"/>
                            </div>
                            <div className="flex-1">
                              <h3 className="font-bold text-gray-900">{job.title}</h3>
                              <div className="flex items-center gap-2 flex-wrap mt-1">
                                <span className="bg-orange-100 text-orange-700 text-xs font-semibold px-2 py-0.5 rounded-full">{job.trade}</span>
                                <span className="flex items-center gap-1 text-xs text-gray-500"><MapPin size={11}/>{job.suburb}, {job.state}</span>
                                <span className="flex items-center gap-1 text-xs text-gray-400"><Calendar size={11}/>{new Date(job.createdAt).toLocaleDateString("en-AU", { day:"numeric", month:"short" })}</span>
                                <span className="text-xs text-gray-400">{job._count.quotes} quote{job._count.quotes !== 1 ? "s" : ""} sent</span>
                              </div>
                              <p className="text-sm text-gray-500 mt-2 line-clamp-2">{job.description}</p>
                              {job.aiEstimate && (
                                <div className="flex items-center gap-1.5 mt-2">
                                  <Zap size={11} className="text-blue-500 fill-blue-500"/>
                                  <span className="text-xs text-blue-600 font-medium">
                                    {job.aiEstimate.split("\n").find(l => l.includes("AUD") || l.includes("$"))?.trim()}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                          <Link href={`/tradie-jobs/${job.id}`}>
                            <button className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5">
                              <Send size={12}/> Send Quote
                            </button>
                          </Link>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )
              )}

              {/* ── ACTIVE ── */}
              {tab === "active" && (
                activeCount === 0 ? (
                  <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
                    <RefreshCw size={48} className="text-gray-200 mx-auto mb-4"/>
                    <h3 className="font-bold text-gray-700 mb-2">No active jobs</h3>
                    <p className="text-gray-400 text-sm">Send quotes on available jobs to see them here.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Active quotes */}
                    {activeQuotes.map(q => {
                      const badge = getQuoteStatusBadge(q.status);
                      return (
                        <motion.div key={q.id} initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
                          className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-4 flex-1">
                              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                                <Send size={20} className="text-blue-600"/>
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h3 className="font-bold text-gray-900">{q.job.title}</h3>
                                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${badge.color}`}>{badge.label}</span>
                                </div>
                                <div className="flex items-center gap-2 flex-wrap mt-1">
                                  <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded-full">{q.job.trade}</span>
                                  <span className="flex items-center gap-1 text-xs text-gray-500"><MapPin size={11}/>{q.job.suburb}, {q.job.state}</span>
                                  <span className="flex items-center gap-1 text-xs text-gray-500"><User size={11}/>{q.job.user.name}</span>
                                </div>
                                <div className="flex items-center gap-1 mt-2">
                                  <DollarSign size={14} className="text-gray-400"/>
                                  <span className="font-bold text-gray-900">${q.amount.toLocaleString()} AUD</span>
                                  <span className="text-xs text-gray-400 ml-2">· {new Date(q.createdAt).toLocaleDateString("en-AU", { day:"numeric", month:"short" })}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col gap-2">
                              <Link href={`/tradie-jobs/${q.job.id}`}>
                                <button className="text-xs font-semibold text-blue-600 border border-blue-200 hover:border-blue-400 px-3 py-2 rounded-xl transition-colors flex items-center gap-1">
                                  <Briefcase size={12}/> View Job
                                </button>
                              </Link>
                              <Link href={`/tradie-chats?jobId=${q.job.id}&receiverId=${q.job.user.id}&receiverName=${encodeURIComponent(q.job.user.name)}&jobTitle=${encodeURIComponent(q.job.title)}&trade=${encodeURIComponent(q.job.trade)}`}>
                                <button className="text-xs font-semibold text-gray-600 border border-gray-200 hover:border-gray-400 px-3 py-2 rounded-xl transition-colors flex items-center gap-1">
                                  <MessageSquare size={12}/> Chat
                                </button>
                              </Link>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}

                    {/* Active bookings */}
                    {activeBookings.map(booking => {
                      const badge = getBookingStatusBadge(booking.status);
                      const showConfirm = booking.status === "PENDING";
                      const showMarkDone = booking.status === "CONFIRMED";
                      return (
                        <motion.div key={booking.id} initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
                          className="bg-white rounded-2xl p-5 shadow-sm border-2 border-orange-100">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-4 flex-1">
                              <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center flex-shrink-0">
                                <Calendar size={20} className="text-orange-500"/>
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h3 className="font-bold text-gray-900">{booking.job.title}</h3>
                                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${badge.color}`}>{badge.label}</span>
                                </div>
                                <div className="flex items-center gap-2 flex-wrap mt-1">
                                  <span className="bg-orange-100 text-orange-700 text-xs font-semibold px-2 py-0.5 rounded-full">{booking.job.trade}</span>
                                  <span className="flex items-center gap-1 text-xs text-gray-500"><MapPin size={11}/>{booking.job.suburb}, {booking.job.state}</span>
                                  <span className="flex items-center gap-1 text-xs text-gray-500"><User size={11}/>{booking.job.user.name}</span>
                                </div>
                                <div className="flex items-center gap-4 mt-2 flex-wrap">
                                  <span className="flex items-center gap-1.5 text-sm font-semibold text-gray-700">
                                    <Calendar size={13} className="text-orange-500"/>
                                    {new Date(booking.scheduledAt).toLocaleDateString("en-AU", { weekday:"short", day:"numeric", month:"long" })}
                                  </span>
                                  <span className="flex items-center gap-1.5 text-sm text-gray-700">
                                    <Clock size={13} className="text-orange-500"/>
                                    {new Date(booking.scheduledAt).toLocaleTimeString("en-AU", { hour:"2-digit", minute:"2-digit" })}
                                  </span>
                                  <span className="text-sm font-bold text-green-600">${booking.totalAmount.toLocaleString()} AUD</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100 flex-wrap">
                            {showConfirm && (
                              <button onClick={() => handleConfirmBooking(booking.id)} disabled={busy === booking.id}
                                className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors">
                                <CheckCircle size={13}/>{busy === booking.id ? "Confirming..." : "Confirm Booking"}
                              </button>
                            )}
                            {showMarkDone && (
                              <button onClick={() => handleMarkDone(booking.id)} disabled={busy === booking.id}
                                className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors">
                                <CheckCircle size={13}/>{busy === booking.id ? "Submitting..." : "Mark Job as Done"}
                              </button>
                            )}
                            <Link href={`/tradie-chats?jobId=${booking.job.id}&receiverId=${booking.job.user.id}&receiverName=${encodeURIComponent(booking.job.user.name)}&jobTitle=${encodeURIComponent(booking.job.title)}&trade=${encodeURIComponent(booking.job.trade)}`}>
                              <button className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 border border-gray-200 hover:border-gray-400 px-4 py-2 rounded-xl transition-colors">
                                <MessageSquare size={13}/> Message
                              </button>
                            </Link>
                            <Link href={`/tradie-bookings?bookingId=${booking.id}`}>
                              <button className="flex items-center gap-1.5 text-xs font-semibold text-orange-500 border border-orange-200 hover:border-orange-400 px-4 py-2 rounded-xl transition-colors">
                                Manage <ChevronRight size={13}/>
                              </button>
                            </Link>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )
              )}

              {/* ── CLOSED ── */}
              {tab === "closed" && (
                closedCount === 0 ? (
                  <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
                    <CheckCircle size={48} className="text-gray-200 mx-auto mb-4"/>
                    <h3 className="font-bold text-gray-700 mb-2">No closed jobs yet</h3>
                    <p className="text-gray-400 text-sm">Completed, cancelled and rejected jobs appear here.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {closedBookings.map(booking => {
                      const badge = getBookingStatusBadge(booking.status);
                      return (
                        <motion.div key={booking.id} initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
                          className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 opacity-80">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-4 flex-1">
                              <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center flex-shrink-0">
                                <Briefcase size={20} className="text-gray-400"/>
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h3 className="font-bold text-gray-700">{booking.job.title}</h3>
                                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${badge.color}`}>{badge.label}</span>
                                </div>
                                <div className="flex items-center gap-2 flex-wrap mt-1">
                                  <span className="text-xs text-gray-400">{booking.job.trade}</span>
                                  <span className="flex items-center gap-1 text-xs text-gray-400"><MapPin size={11}/>{booking.job.suburb}, {booking.job.state}</span>
                                  <span className="text-xs font-semibold text-gray-600">${booking.totalAmount.toLocaleString()} AUD</span>
                                </div>
                              </div>
                            </div>
                            <Link href={`/tradie-bookings?bookingId=${booking.id}`}>
                              <button className="text-xs font-semibold text-gray-500 border border-gray-200 px-3 py-2 rounded-xl hover:border-gray-400 transition-colors">
                                View
                              </button>
                            </Link>
                          </div>
                        </motion.div>
                      );
                    })}
                    {rejectedQuotes.map(q => (
                      <motion.div key={q.id} initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
                        className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 opacity-70">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
                            <XCircle size={20} className="text-red-400"/>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold text-gray-700">{q.job.title}</h3>
                              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-red-100 text-red-700">❌ Quote Rejected</span>
                            </div>
                            <div className="flex items-center gap-2 flex-wrap mt-1">
                              <span className="text-xs text-gray-400">{q.job.trade}</span>
                              <span className="flex items-center gap-1 text-xs text-gray-400"><MapPin size={11}/>{q.job.suburb}, {q.job.state}</span>
                              <span className="text-xs font-semibold text-gray-500">${q.amount.toLocaleString()} AUD</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function TradieJobsPage() {
  return <Suspense><TradieJobsPageInner/></Suspense>;
}
