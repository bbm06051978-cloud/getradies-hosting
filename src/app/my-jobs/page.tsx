"use client";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import {
  ArrowLeft, Briefcase, MapPin, Calendar, ChevronRight,
  Plus, Clock, CheckCircle, XCircle, RefreshCw, ChevronDown,
  ChevronUp, Zap, MessageSquare, AlertTriangle, ThumbsUp,
} from "lucide-react";
import { Sidebar } from "@/app/components/dashboard/Sidebar";
import { Topbar } from "@/app/components/dashboard/Topbar";

type Quote = { id: string; amount: number; status: string };
type BookingRef = {
  id: string; status: string; scheduledAt: string; totalAmount: number;
  tradieProfile: {
    businessName: string; specialty: string;
    user: { id: string; name: string; phone: string };
  };
};
type Job = {
  id: string; title: string; trade: string; suburb: string;
  state: string; postcode: string | null; status: string;
  aiEstimate: string | null; createdAt: string; description: string;
  quotes: Quote[]; bookings: BookingRef[];
};

const getStatusBadge = (job: Job) => {
  const bookingStatus = job.bookings[0]?.status;
  if (bookingStatus === "DISPUTED")             return { label: "⚠️ Disputed",              color: "bg-red-100 text-red-700" };
  if (bookingStatus === "CANCELLED")            return { label: "❌ Cancelled",              color: "bg-gray-100 text-gray-600" };
  if (bookingStatus === "COMPLETED")            return { label: "✅ Completed",              color: "bg-green-100 text-green-700" };
  if (bookingStatus === "PENDING_CONFIRMATION") return { label: "🔔 Awaiting Your Confirmation", color: "bg-purple-100 text-purple-700" };
  if (bookingStatus === "CONFIRMED")            return { label: "📅 Confirmed",              color: "bg-blue-100 text-blue-700" };
  if (bookingStatus === "PENDING")              return { label: "🔨 In Progress",            color: "bg-orange-100 text-orange-700" };
  if (job.status === "COMPLETED")               return { label: "✅ Completed",              color: "bg-green-100 text-green-700" };
  if (job.status === "CANCELLED")               return { label: "❌ Cancelled",              color: "bg-gray-100 text-gray-600" };
  if (job.status === "DISPUTED")                return { label: "⚠️ Disputed",              color: "bg-red-100 text-red-700" };
  if (job.status === "BOOKED")                  return { label: "🔵 Booked",                color: "bg-blue-100 text-blue-700" };
  if (job.quotes.length > 0)                    return { label: "💬 Quotes Received",        color: "bg-yellow-100 text-yellow-700" };
  return { label: "🟡 Waiting for Quotes", color: "bg-gray-100 text-gray-500" };
};

const getJobTab = (job: Job): "open" | "inprogress" | "closed" => {
  const bookingStatus = job.bookings[0]?.status;
  if (bookingStatus === "COMPLETED" || bookingStatus === "CANCELLED" || bookingStatus === "DISPUTED") return "closed";
  if (job.status === "COMPLETED" || job.status === "CANCELLED" || job.status === "DISPUTED") return "closed";
  if (bookingStatus === "PENDING_CONFIRMATION" || bookingStatus === "CONFIRMED" || bookingStatus === "PENDING" || job.status === "IN_PROGRESS") return "inprogress";
  if (job.status === "BOOKED") return "inprogress";
  return "open";
};

function MyJobsPageInner() {
  const router = useRouter();
  const [jobs, setJobs]             = useState<Job[]>([]);
  const [loading, setLoading]       = useState(true);
  const [tab, setTab]               = useState<"open" | "inprogress" | "closed">("open");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [busy, setBusy]             = useState<string | null>(null);
  const searchParams                = useSearchParams();

  useEffect(() => {
    const t = searchParams.get("tab");
    if (t === "inprogress" || t === "closed") setTab(t);
  }, [searchParams]);

  useEffect(() => {
    fetch("/api/my-jobs")
      .then(r => r.json())
      .then(d => { if (d.jobs) setJobs(d.jobs); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleCancel = async (jobId: string) => {
    const res = await fetch("/api/my-jobs", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobId, action: "cancel" }),
    });
    if (res.ok) setJobs(prev => prev.map(j => j.id === jobId ? { ...j, status: "CANCELLED" } : j));
  };

  const handleConfirmDone = async (bookingId: string) => {
    setBusy(bookingId);
    try {
      const res = await fetch("/api/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, action: "confirm_done" }),
      });
      if (res.ok) {
        setJobs(prev => prev.map(j => ({
          ...j,
          bookings: j.bookings.map(b => b.id === bookingId ? { ...b, status: "COMPLETED" } : b)
        })));
      }
    } catch {} finally { setBusy(null); }
  };

  const handleDispute = async (bookingId: string) => {
    setBusy(bookingId);
    try {
      const res = await fetch("/api/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, action: "dispute" }),
      });
      if (res.ok) {
        setJobs(prev => prev.map(j => ({
          ...j,
          bookings: j.bookings.map(b => b.id === bookingId ? { ...b, status: "DISPUTED" } : b)
        })));
      }
    } catch {} finally { setBusy(null); }
  };

  const openJobs       = jobs.filter(j => getJobTab(j) === "open");
  const inProgressJobs = jobs.filter(j => getJobTab(j) === "inprogress");
  const closedJobs     = jobs.filter(j => getJobTab(j) === "closed");
  const currentJobs    = tab === "open" ? openJobs : tab === "inprogress" ? inProgressJobs : closedJobs;

  const TABS = [
    { key: "open",       label: "Open",       icon: Clock,       count: openJobs.length },
    { key: "inprogress", label: "In Progress", icon: RefreshCw,   count: inProgressJobs.length },
    { key: "closed",     label: "Closed",      icon: CheckCircle, count: closedJobs.length },
  ] as const;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar/>
      <div className="flex-1 flex flex-col">
        <Topbar/>
        <div className="p-4 lg:p-8 flex-1 overflow-hidden">

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <button onClick={() => router.back()} className="text-gray-400 hover:text-gray-600"><ArrowLeft size={20}/></button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">My Jobs</h1>
                <p className="text-gray-500 text-sm mt-0.5">All your jobs and bookings in one place</p>
              </div>
            </div>
            <Link href="/post-job">
              <button className="flex items-center gap-2 bg-blue-900 hover:bg-blue-800 text-white px-4 py-2.5 rounded-xl font-bold text-sm transition-colors">
                <Plus size={16}/> Post New Job
              </button>
            </Link>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-6 bg-white rounded-2xl p-1.5 shadow-sm border border-gray-100 w-full overflow-x-auto">
            {TABS.map(t => {
              const Icon = t.icon;
              return (
                <button key={t.key} onClick={() => { setTab(t.key); setExpandedId(null); }}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    tab === t.key ? "bg-blue-900 text-white shadow" : "text-gray-500 hover:text-gray-700"
                  }`}>
                  <Icon size={14}/>
                  {t.label}
                  <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                    tab === t.key ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
                  }`}>{t.count}</span>
                </button>
              );
            })}
          </div>

          {/* Content */}
          {loading ? (
            <div className="text-center py-20 text-gray-400">Loading your jobs...</div>
          ) : currentJobs.length === 0 ? (
            <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100">
              <Briefcase size={48} className="text-gray-200 mx-auto mb-4"/>
              <h3 className="font-bold text-gray-700 text-lg mb-2">
                {tab === "open" ? "No open jobs" : tab === "inprogress" ? "No jobs in progress" : "No closed jobs"}
              </h3>
              <p className="text-gray-400 text-sm mb-6">
                {tab === "open" ? "Post a new job to get quotes from verified tradies." : "Jobs will appear here as they progress."}
              </p>
              {tab === "open" && (
                <Link href="/post-job">
                  <button className="bg-blue-900 text-white px-6 py-2.5 rounded-xl font-bold text-sm">Post a Job</button>
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {currentJobs.map(job => {
                const badge         = getStatusBadge(job);
                const booking       = job.bookings[0];
                const acceptedQuote = job.quotes.find(q => q.status === "ACCEPTED");
                const isExpanded    = expandedId === job.id;
                const showConfirmDone = booking?.status === "PENDING_CONFIRMATION";
                const showDispute     = booking?.status === "PENDING_CONFIRMATION";
                const showChat        = booking && !["COMPLETED", "CANCELLED"].includes(booking.status);

                return (
                  <motion.div key={job.id}
                    initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">

                    {/* Card header */}
                    <div className="p-5 cursor-pointer" onClick={() => setExpandedId(isExpanded ? null : job.id)}>
                      <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Briefcase size={20} className="text-blue-600"/>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-bold text-gray-900">{job.title}</h3>
                              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${badge.color}`}>{badge.label}</span>
                            </div>
                            <div className="flex items-center gap-3 flex-wrap mt-1.5">
                              <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded-full">{job.trade}</span>
                              <span className="flex items-center gap-1 text-xs text-gray-500"><MapPin size={11}/>{job.suburb}, {job.state}</span>
                              <span className="flex items-center gap-1 text-xs text-gray-400"><Calendar size={11}/>{new Date(job.createdAt).toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" })}</span>
                            </div>
                            {job.quotes.length > 0 && (
                              <div className="mt-2 flex items-center gap-3 flex-wrap">
                                <span className="text-xs text-gray-500">{job.quotes.length} quote{job.quotes.length !== 1 ? "s" : ""} received</span>
                                {acceptedQuote && <span className="text-xs font-bold text-green-600">${acceptedQuote.amount.toLocaleString()} AUD accepted</span>}
                              </div>
                            )}
                            {booking && (
                              <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                                <span className="font-semibold text-gray-700">{booking.tradieProfile.businessName}</span>
                                {booking.scheduledAt && <span>· {new Date(booking.scheduledAt).toLocaleDateString("en-AU", { weekday: "short", day: "numeric", month: "short" })}</span>}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {isExpanded ? <ChevronUp size={16} className="text-gray-400"/> : <ChevronDown size={16} className="text-gray-400"/>}
                        </div>
                      </div>
                    </div>

                    {/* Expanded panel */}
                    <div style={{ maxHeight: isExpanded ? "800px" : "0", overflow: "hidden", transition: "max-height 0.3s ease, opacity 0.3s ease", opacity: isExpanded ? 1 : 0 }}
                      className="border-t border-gray-100 bg-slate-50">
                      <div className="p-5 space-y-4">

                        {/* Description */}
                        {job.description && (
                          <div>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Job Description</p>
                            <p className="text-sm text-gray-700 leading-relaxed">{job.description}</p>
                          </div>
                        )}

                        {/* Details */}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Location</p>
                            <p className="text-sm text-gray-700">{job.suburb}, {job.state}{job.postcode ? ` ${job.postcode}` : ""}</p>
                          </div>
                          <div>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Posted On</p>
                            <p className="text-sm text-gray-700">{new Date(job.createdAt).toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" })}</p>
                          </div>
                        </div>

                        {/* AI Estimate */}
                        {job.aiEstimate && (
                          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                            <p className="text-xs font-bold text-blue-700 uppercase tracking-widest mb-2 flex items-center gap-1"><Zap size={12}/> AI Estimate</p>
                            <p className="text-sm text-blue-800 whitespace-pre-line leading-relaxed">{job.aiEstimate}</p>
                          </div>
                        )}

                        {/* Booking info */}
                        {booking && (
                          <div className="bg-orange-50 border border-orange-100 rounded-xl p-4">
                            <p className="text-xs font-bold text-orange-700 uppercase tracking-widest mb-2">Booked Tradie</p>
                            <p className="text-sm font-semibold text-gray-800">{booking.tradieProfile.businessName}</p>
                            <p className="text-xs text-gray-500">{booking.tradieProfile.specialty}</p>
                            {booking.scheduledAt && (
                              <p className="text-xs text-gray-600 mt-1">
                                Scheduled: {new Date(booking.scheduledAt).toLocaleDateString("en-AU", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                              </p>
                            )}
                            {booking.totalAmount > 0 && (
                              <p className="text-xs font-bold text-green-700 mt-1">Lock Amount: ${booking.totalAmount} AUD</p>
                            )}
                          </div>
                        )}

                        {/* PENDING_CONFIRMATION alert */}
                        {showConfirmDone && (
                          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                            <p className="text-sm font-bold text-purple-800 mb-1">🔔 Tradie has marked this job as done</p>
                            <p className="text-xs text-purple-600">Please confirm the job is complete to release payment, or raise a dispute if you are not satisfied.</p>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex flex-wrap gap-2 pt-1">
                          {/* View Quotes */}
                          {tab === "open" && job.quotes.length > 0 && (
                            <Link href={`/my-quotes?jobId=${job.id}`}>
                              <button className="flex items-center gap-1 bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors">
                                View Quotes <ChevronRight size={12}/>
                              </button>
                            </Link>
                          )}

                          {/* Confirm Job Done */}
                          {showConfirmDone && (
                            <button
                              onClick={(e) => { e.stopPropagation(); handleConfirmDone(booking.id); }}
                              disabled={busy === booking.id}
                              className="flex items-center gap-1 bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors">
                              <ThumbsUp size={12}/>{busy === booking.id ? "Confirming..." : "Confirm Job Done"}
                            </button>
                          )}

                          {/* Raise Dispute */}
                          {showDispute && (
                            <button
                              onClick={(e) => { e.stopPropagation(); handleDispute(booking.id); }}
                              disabled={busy === booking.id}
                              className="flex items-center gap-1 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors">
                              <AlertTriangle size={12}/> Raise Dispute
                            </button>
                          )}

                          {/* Chat with Tradie */}
                          {showChat && (
                            <Link href={`/chats?jobId=${job.id}&receiverId=${booking.tradieProfile.user.id}&receiverName=${encodeURIComponent(booking.tradieProfile.businessName)}&jobTitle=${encodeURIComponent(job.title)}&trade=${encodeURIComponent(job.trade)}`}>
                              <button className="flex items-center gap-1 text-xs font-semibold text-gray-600 border border-gray-200 hover:border-gray-400 px-4 py-2 rounded-xl transition-colors">
                                <MessageSquare size={12}/> Chat with Tradie
                              </button>
                            </Link>
                          )}

                          {/* Cancel Job */}
                          {tab === "open" && job.status === "OPEN" && (
                            <button onClick={(e) => { e.stopPropagation(); handleCancel(job.id); }}
                              className="flex items-center gap-1 text-xs font-semibold text-red-500 hover:text-red-700 border border-red-200 hover:border-red-400 px-4 py-2 rounded-xl transition-colors">
                              <XCircle size={12}/> Cancel Job
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MyJobsPage() {
  return <Suspense><MyJobsPageInner/></Suspense>;
}
