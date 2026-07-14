"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  Briefcase, MapPin, Calendar, Clock, CheckCircle,
  AlertCircle, DollarSign, Send, Zap, User,
  XCircle, MessageSquare, ChevronRight, Star,
} from "lucide-react";
import { TradieSidebar } from "@/app/components/tradie/TradieSidebar";
import { TradieTopbar } from "@/app/components/tradie/TradieTopbar";

type UserRef = { name: string; suburb: string | null; state: string | null };
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

const TABS = [
  { key: "leads",       label: "Leads",       icon: Briefcase,    color: "orange" },
  { key: "booking",     label: "Booking",      icon: Calendar,     color: "blue"   },
  { key: "inprogress",  label: "In Progress",  icon: Clock,        color: "purple" },
  { key: "completed",   label: "Completed",    icon: CheckCircle,  color: "green"  },
  { key: "cancelled",   label: "Cancelled",    icon: XCircle,      color: "red"    },
  { key: "rejected",    label: "Rejected",     icon: AlertCircle,  color: "gray"   },
  { key: "disputed",    label: "Disputed",     icon: AlertCircle,  color: "red"    },
];

const LEADS_SUBTABS = [
  { key: "available", label: "Available" },
  { key: "myquotes",  label: "My Quotes" },
];

const TAB_COLORS: Record<string, string> = {
  orange: "bg-orange-500 border-orange-500 text-white",
  blue:   "bg-blue-600 border-blue-600 text-white",
  purple: "bg-purple-600 border-purple-600 text-white",
  green:  "bg-green-600 border-green-600 text-white",
  red:    "bg-red-500 border-red-500 text-white",
  gray:   "bg-gray-500 border-gray-500 text-white",
};

const BADGE_COLORS: Record<string, string> = {
  orange: "bg-orange-100 text-orange-700",
  blue:   "bg-blue-100 text-blue-700",
  purple: "bg-purple-100 text-purple-700",
  green:  "bg-green-100 text-green-700",
  red:    "bg-red-100 text-red-700",
  gray:   "bg-gray-100 text-gray-600",
};

export default function TradieJobsPage() {
  const [tab, setTab]               = useState("leads");
  const [leadsSubtab, setLeadsSubtab] = useState("available");
  const [loading, setLoading]       = useState(true);
  const [busy, setBusy]             = useState<string | null>(null);

  const [availableJobs, setAvailableJobs]     = useState<AvailableJob[]>([]);
  const [myQuotes, setMyQuotes]               = useState<MyQuote[]>([]);
  const [bookings, setBookings]               = useState<Booking[]>([]);
  const [completedBookings, setCompletedBookings] = useState<Booking[]>([]);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/tradie-jobs");
      const data = await res.json();
      setAvailableJobs(data.availableJobs || []);
      setMyQuotes(data.myQuotes || []);
      setBookings(data.activeBookings || []);
      setCompletedBookings(data.completedBookings || []);
    } catch {}
    finally { setLoading(false); }
  };

  const patchBooking = async (bookingId: string, action: string) => {
    const r = await fetch("/api/tradie-bookings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookingId, action }),
    });
    return r.ok;
  };

  const handleConfirmBooking = async (bookingId: string) => {
    setBusy(bookingId);
    const ok = await patchBooking(bookingId, "confirm").catch(() => false);
    if (ok) await fetchAll();
    setBusy(null);
  };

  const handleMarkDone = async (bookingId: string) => {
    if (!confirm("Mark this job as done? The homeowner will be asked to confirm completion.")) return;
    setBusy(bookingId);
    const ok = await patchBooking(bookingId, "mark_done").catch(() => false);
    if (ok) await fetchAll();
    setBusy(null);
  };

  // Split bookings by status
  const pendingBookings    = bookings.filter(b => b.status === "PENDING");
  const confirmedBookings  = bookings.filter(b => b.status === "CONFIRMED");
  const inProgressBookings = bookings.filter(b => ["IN_PROGRESS", "ON_THE_WAY", "PENDING_CONFIRMATION"].includes(b.status));
  const cancelledBookings  = [...bookings, ...completedBookings].filter(b => b.status === "CANCELLED");
  const disputedBookings   = [...bookings, ...completedBookings].filter(b => b.status === "DISPUTED");
  const rejectedQuotes     = myQuotes.filter(q => q.status === "REJECTED");
  const activeQuotes       = myQuotes.filter(q => q.status !== "REJECTED");

  const counts = {
    leads:      availableJobs.length + activeQuotes.length,
    booking:    pendingBookings.length + confirmedBookings.length,
    inprogress: inProgressBookings.length,
    completed:  completedBookings.filter(b => b.status === "COMPLETED").length,
    cancelled:  cancelledBookings.length,
    rejected:   rejectedQuotes.length,
    disputed:   disputedBookings.length,
  };

  const getQuoteStatusStyle = (status: string) => {
    switch (status) {
      case "ACCEPTED": return { bg: "bg-green-100 text-green-700", label: "Accepted" };
      case "REJECTED": return { bg: "bg-red-100 text-red-700",     label: "Rejected" };
      default:         return { bg: "bg-yellow-100 text-yellow-700", label: "Pending" };
    }
  };

  const getBookingStatusStyle = (status: string) => {
    switch (status) {
      case "CONFIRMED":            return { bg: "bg-green-100 text-green-700",  label: "Confirmed"    };
      case "PENDING":              return { bg: "bg-orange-100 text-orange-700", label: "Pending"      };
      case "IN_PROGRESS":          return { bg: "bg-blue-100 text-blue-700",    label: "In Progress"  };
      case "PENDING_CONFIRMATION": return { bg: "bg-yellow-100 text-yellow-700", label: "Awaiting Confirmation" };
      case "COMPLETED":            return { bg: "bg-teal-100 text-teal-700",    label: "Completed"    };
      case "CANCELLED":            return { bg: "bg-gray-100 text-gray-600",    label: "Cancelled"    };
      case "DISPUTED":             return { bg: "bg-red-100 text-red-700",      label: "Disputed"     };
      default:                     return { bg: "bg-gray-100 text-gray-600",    label: status         };
    }
  };

  // ── Reusable card components ──────────────────────────────

  const JobCard = ({ job }: { job: AvailableJob }) => (
    <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
      className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:border-orange-200 transition-all">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4 flex-1">
          <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <Briefcase size={20} className="text-orange-500" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900">{job.title}</h3>
            <div className="flex items-center gap-2 flex-wrap mt-1">
              <span className="bg-orange-100 text-orange-700 text-xs font-semibold px-2 py-0.5 rounded-full">{job.trade}</span>
              <span className="flex items-center gap-1 text-xs text-gray-500"><MapPin size={11}/>{job.suburb}, {job.state}</span>
              <span className="flex items-center gap-1 text-xs text-gray-400"><Calendar size={11}/>{new Date(job.createdAt).toLocaleDateString("en-AU", { day:"numeric", month:"short" })}</span>
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
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          <span className="text-xs text-gray-400">{job._count.quotes} quote{job._count.quotes !== 1 ? "s" : ""} sent</span>
          <div className="flex gap-2">
            <Link href={`/tradie-jobs/${job.id}`}>
              <button className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5">
                <Send size={12}/>Send Quote
              </button>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const QuoteCard = ({ quote }: { quote: MyQuote }) => {
    const s = getQuoteStatusStyle(quote.status);
    return (
      <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
        className={`bg-white rounded-2xl p-5 shadow-sm border-2 transition-all ${quote.status === "ACCEPTED" ? "border-green-200" : "border-gray-100"}`}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4 flex-1">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Briefcase size={20} className="text-blue-600"/>
            </div>
            <div>
              <h3 className="font-bold text-gray-900">{quote.job.title}</h3>
              <div className="flex items-center gap-2 flex-wrap mt-1">
                <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded-full">{quote.job.trade}</span>
                <span className="flex items-center gap-1 text-xs text-gray-500"><MapPin size={11}/>{quote.job.suburb}, {quote.job.state}</span>
                <span className="flex items-center gap-1 text-xs text-gray-500"><User size={11}/>{quote.job.user.name}</span>
              </div>
              <p className="text-xs text-gray-500 mt-2 line-clamp-2">{quote.description}</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${s.bg}`}>{s.label}</span>
            <div className="flex items-center gap-1">
              <DollarSign size={14} className="text-gray-400"/>
              <span className="text-lg font-bold text-gray-900">{quote.amount.toLocaleString()}</span>
              <span className="text-xs text-gray-400">AUD</span>
            </div>
            <span className="text-xs text-gray-400">{new Date(quote.createdAt).toLocaleDateString("en-AU", { day:"numeric", month:"short" })}</span>
          </div>
        </div>
      </motion.div>
    );
  };

  const BookingCard = ({ booking, showActions }: { booking: Booking; showActions?: "confirm" | "markdone" | "none" }) => {
    const s = getBookingStatusStyle(booking.status);
    return (
      <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
        className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:border-orange-200 transition-all">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4 flex-1">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Briefcase size={20} className="text-green-600"/>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900">{booking.job.title}</h3>
              <div className="flex items-center gap-2 flex-wrap mt-1">
                <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full">{booking.job.trade}</span>
                <span className="flex items-center gap-1 text-xs text-gray-500"><MapPin size={11}/>{booking.job.suburb}, {booking.job.state}</span>
                <span className="flex items-center gap-1 text-xs text-gray-500"><User size={11}/>{booking.job.user.name}</span>
              </div>
              <div className="flex items-center gap-4 mt-2 flex-wrap">
                <span className="flex items-center gap-1.5 text-sm text-gray-700">
                  <Calendar size={13} className="text-orange-500"/>
                  {new Date(booking.scheduledAt).toLocaleDateString("en-AU", { weekday:"short", day:"numeric", month:"long" })}
                </span>
                <span className="flex items-center gap-1.5 text-sm text-gray-700">
                  <Clock size={13} className="text-orange-500"/>
                  {new Date(booking.scheduledAt).toLocaleTimeString("en-AU", { hour:"2-digit", minute:"2-digit" })}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${s.bg}`}>{s.label}</span>
            <div className="flex items-center gap-1">
              <DollarSign size={14} className="text-gray-400"/>
              <span className="text-lg font-bold text-gray-900">{booking.totalAmount.toLocaleString()}</span>
              <span className="text-xs text-gray-400">AUD</span>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        {showActions === "confirm" && (
          <div className="mt-4 pt-4 border-t border-gray-100 flex gap-3">
            <button onClick={() => handleConfirmBooking(booking.id)} disabled={busy === booking.id}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors">
              <CheckCircle size={15}/>
              {busy === booking.id ? "Confirming..." : "Confirm Booking"}
            </button>
            <Link href={`/tradie-chats?jobId=${booking.job.id}`}>
              <button className="px-4 py-2.5 border border-gray-200 hover:border-blue-300 text-gray-600 rounded-xl text-sm font-semibold flex items-center gap-2 transition-colors">
                <MessageSquare size={14}/>Message
              </button>
            </Link>
          </div>
        )}

        {showActions === "markdone" && (
          <div className="mt-4 pt-4 border-t border-gray-100 flex gap-3">
            <button onClick={() => handleMarkDone(booking.id)} disabled={busy === booking.id}
              className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors">
              <CheckCircle size={15}/>
              {busy === booking.id ? "Submitting..." : "Mark Job as Done"}
            </button>
            <Link href={`/tradie-chats?jobId=${booking.job.id}`}>
              <button className="px-4 py-2.5 border border-gray-200 hover:border-blue-300 text-gray-600 rounded-xl text-sm font-semibold flex items-center gap-2 transition-colors">
                <MessageSquare size={14}/>Message
              </button>
            </Link>
          </div>
        )}

        {showActions === "none" && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <Link href="/tradie-bookings">
              <button className="flex items-center gap-1 text-orange-500 text-xs font-semibold hover:text-orange-700">
                Manage <ChevronRight size={13}/>
              </button>
            </Link>
          </div>
        )}
      </motion.div>
    );
  };

  const Empty = ({ icon: Icon, message }: { icon: any; message: string }) => (
    <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
      <Icon size={48} className="text-gray-200 mx-auto mb-4"/>
      <p className="text-gray-400 text-sm">{message}</p>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-slate-50">
      <TradieSidebar/>
      <main className="flex-1 flex flex-col min-w-0">
        <TradieTopbar/>
        <div className="p-8 flex-1">

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Jobs</h1>
              <p className="text-gray-500 text-sm mt-0.5">Manage your leads, quotes and bookings</p>
            </div>
          </div>

          {/* 7 Tab buttons */}
          <div className="flex flex-wrap gap-2 mb-6">
            {TABS.map(t => {
              const Icon = t.icon;
              const count = counts[t.key as keyof typeof counts];
              const isActive = tab === t.key;
              return (
                <button key={t.key} onClick={() => setTab(t.key)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all border-2 ${
                    isActive ? TAB_COLORS[t.color] : "bg-white border-gray-100 text-gray-600 hover:border-gray-200"
                  }`}>
                  <Icon size={15}/>
                  {t.label}
                  {count > 0 && (
                    <span className={`px-1.5 py-0.5 rounded-full text-xs font-bold ${
                      isActive ? "bg-white/20 text-white" : BADGE_COLORS[t.color]
                    }`}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <svg className="animate-spin h-8 w-8 text-orange-500" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
              </svg>
            </div>
          ) : (
            <div className="space-y-4">

              {/* ── TAB 1: LEADS ── */}
              {tab === "leads" && (
                <>
                  {/* Subtabs */}
                  <div className="flex items-center gap-1 mb-4 bg-gray-100 rounded-lg p-1 w-fit">
                    {LEADS_SUBTABS.map(st => (
                      <button key={st.key} onClick={() => setLeadsSubtab(st.key)}
                        className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                          leadsSubtab === st.key
                            ? "bg-white text-gray-900 shadow-sm"
                            : "text-gray-500 hover:text-gray-700"
                        }`}>
                        {st.label}
                        <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-xs font-bold ${
                          leadsSubtab === st.key ? "bg-orange-100 text-orange-600" : "bg-gray-200 text-gray-500"
                        }`}>
                          {st.key === "available" ? availableJobs.length : activeQuotes.length}
                        </span>
                      </button>
                    ))}
                  </div>

                  {leadsSubtab === "available" && (
                    availableJobs.length === 0
                      ? <Empty icon={Briefcase} message="No job leads available. New jobs matching your specialty will appear here."/>
                      : availableJobs.map(job => <JobCard key={job.id} job={job}/>)
                  )}

                  {leadsSubtab === "myquotes" && (
                    activeQuotes.length === 0
                      ? <Empty icon={Send} message="No quotes sent yet. Send quotes on available jobs to see them here."/>
                      : activeQuotes.map(q => <QuoteCard key={q.id} quote={q}/>)
                  )}
                </>
              )}

              {/* ── TAB 2: BOOKING ── */}
              {tab === "booking" && (
                pendingBookings.length === 0 && confirmedBookings.length === 0
                  ? <Empty icon={Calendar} message="No bookings yet. When a homeowner accepts your quote it will appear here."/>
                  : <>
                    {pendingBookings.length > 0 && (
                      <>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Awaiting Your Confirmation</p>
                        {pendingBookings.map(b => <BookingCard key={b.id} booking={b} showActions="confirm"/>)}
                      </>
                    )}
                    {confirmedBookings.length > 0 && (
                      <>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-4">Confirmed — Upcoming</p>
                        {confirmedBookings.map(b => <BookingCard key={b.id} booking={b} showActions="none"/>)}
                      </>
                    )}
                  </>
              )}

              {/* ── TAB 3: IN PROGRESS ── */}
              {tab === "inprogress" && (
                inProgressBookings.length === 0
                  ? <Empty icon={Clock} message="No jobs in progress. Confirm a booking to start working."/>
                  : inProgressBookings.map(b => (
                    <BookingCard key={b.id} booking={b}
                      showActions={b.status === "PENDING_CONFIRMATION" ? "none" : "markdone"}/>
                  ))
              )}

              {/* ── TAB 4: COMPLETED ── */}
              {tab === "completed" && (
                completedBookings.filter(b => b.status === "COMPLETED").length === 0
                  ? <Empty icon={CheckCircle} message="No completed jobs yet."/>
                  : completedBookings.filter(b => b.status === "COMPLETED").map(b => (
                    <motion.div key={b.id} initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
                      className="bg-white rounded-2xl p-5 shadow-sm border border-green-100">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                            <CheckCircle size={20} className="text-green-600"/>
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900">{b.job.title}</h3>
                            <div className="flex items-center gap-2 flex-wrap mt-1">
                              <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full">{b.job.trade}</span>
                              <span className="flex items-center gap-1 text-xs text-gray-500"><MapPin size={11}/>{b.job.suburb}, {b.job.state}</span>
                              <span className="flex items-center gap-1 text-xs text-gray-500"><User size={11}/>{b.job.user.name}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className="bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full">Completed</span>
                          <div className="flex items-center gap-1">
                            <DollarSign size={14} className="text-gray-400"/>
                            <span className="text-lg font-bold text-gray-900">{b.totalAmount.toLocaleString()}</span>
                            <span className="text-xs text-gray-400">AUD</span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-3">
                        <Star size={13} className="text-yellow-400"/>
                        <span className="text-xs text-gray-500">Job completed — request a review to boost your profile</span>
                      </div>
                    </motion.div>
                  ))
              )}

              {/* ── TAB 5: CANCELLED ── */}
              {tab === "cancelled" && (
                cancelledBookings.length === 0
                  ? <Empty icon={XCircle} message="No cancelled jobs."/>
                  : cancelledBookings.map(b => <BookingCard key={b.id} booking={b} showActions="none"/>)
              )}

              {/* ── TAB 6: REJECTED ── */}
              {tab === "rejected" && (
                rejectedQuotes.length === 0
                  ? <Empty icon={AlertCircle} message="No rejected quotes. Keep sending quotes to win more jobs!"/>
                  : rejectedQuotes.map(q => <QuoteCard key={q.id} quote={q}/>)
              )}

              {/* ── TAB 7: DISPUTED ── */}
              {tab === "disputed" && (
                disputedBookings.length === 0
                  ? <Empty icon={AlertCircle} message="No disputed jobs."/>
                  : disputedBookings.map(b => (
                    <motion.div key={b.id} initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
                      className="bg-white rounded-2xl p-5 shadow-sm border-2 border-red-200">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                            <AlertCircle size={20} className="text-red-500"/>
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900">{b.job.title}</h3>
                            <div className="flex items-center gap-2 flex-wrap mt-1">
                              <span className="bg-red-100 text-red-700 text-xs font-semibold px-2 py-0.5 rounded-full">{b.job.trade}</span>
                              <span className="flex items-center gap-1 text-xs text-gray-500"><MapPin size={11}/>{b.job.suburb}, {b.job.state}</span>
                              <span className="flex items-center gap-1 text-xs text-gray-500"><User size={11}/>{b.job.user.name}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className="bg-red-100 text-red-700 text-xs font-bold px-2.5 py-1 rounded-full">Disputed</span>
                          <div className="flex items-center gap-1">
                            <DollarSign size={14} className="text-gray-400"/>
                            <span className="text-lg font-bold text-gray-900">{b.totalAmount.toLocaleString()}</span>
                            <span className="text-xs text-gray-400">AUD</span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-red-100">
                        <p className="text-xs text-red-600 font-semibold">GeTradie team is reviewing this dispute and will contact you within 24 hours.</p>
                      </div>
                    </motion.div>
                  ))
              )}

            </div>
          )}
        </div>
      </main>
    </div>
  );
}
