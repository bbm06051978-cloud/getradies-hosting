"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  Briefcase, MapPin, Calendar, Clock, CheckCircle,
  AlertCircle, DollarSign, MessageSquare, ChevronRight,
  Zap, User, ArrowLeft, Send,
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
  { key: "available", label: "Available Leads", icon: Briefcase },
  { key: "quoted", label: "My Quotes", icon: Send },
  { key: "active", label: "Active Jobs", icon: Clock },
  { key: "completed", label: "Completed", icon: CheckCircle },
];

export default function TradieJobsPage() {
  const [tab, setTab] = useState("available");
  const [loading, setLoading] = useState(true);
  const [availableJobs, setAvailableJobs] = useState<AvailableJob[]>([]);
  const [myQuotes, setMyQuotes] = useState<MyQuote[]>([]);
  const [activeBookings, setActiveBookings] = useState<Booking[]>([]);
  const [completedBookings, setCompletedBookings] = useState<Booking[]>([]);

  useEffect(() => {
    fetch("/api/tradie-jobs")
      .then(r => r.json())
      .then(d => {
        if (d.availableJobs) setAvailableJobs(d.availableJobs);
        if (d.myQuotes) setMyQuotes(d.myQuotes);
        if (d.activeBookings) setActiveBookings(d.activeBookings);
        if (d.completedBookings) setCompletedBookings(d.completedBookings);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const getBookingStatusStyle = (status: string) => {
    switch (status) {
      case "CONFIRMED": return { bg: "bg-green-100 text-green-700", label: "Confirmed" };
      case "PENDING": return { bg: "bg-orange-100 text-orange-700", label: "Pending" };
      case "PENDING_CONFIRMATION": return { bg: "bg-yellow-100 text-yellow-700", label: "Awaiting Confirmation" };
      case "COMPLETED": return { bg: "bg-blue-100 text-blue-700", label: "Completed" };
      default: return { bg: "bg-gray-100 text-gray-600", label: status };
    }
  };

  const getQuoteStatusStyle = (status: string) => {
    switch (status) {
      case "ACCEPTED": return { bg: "bg-green-100 text-green-700", label: "Accepted" };
      case "REJECTED": return { bg: "bg-red-100 text-red-700", label: "Rejected" };
      default: return { bg: "bg-orange-100 text-orange-700", label: "Pending" };
    }
  };

  const counts = {
    available: availableJobs.length,
    quoted: myQuotes.length,
    active: activeBookings.length,
    completed: completedBookings.length,
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <TradieSidebar />
      <main className="flex-1 flex flex-col min-w-0">
        <TradieTopbar />
        <div className="p-8 flex-1">

          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link href="/dashboard-tradie" className="text-gray-400 hover:text-gray-600">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Jobs</h1>
              <p className="text-gray-500 text-sm mt-0.5">Manage your job leads, quotes and bookings</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {TABS.map(t => {
              const Icon = t.icon;
              return (
                <div key={t.key} onClick={() => setTab(t.key)}
                  className={`rounded-2xl p-4 flex items-center gap-3 cursor-pointer transition-all border-2 ${
                    tab === t.key ? "bg-orange-500 border-orange-500" : "bg-white border-gray-100 hover:border-orange-200"
                  }`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    tab === t.key ? "bg-orange-400" : "bg-orange-50"
                  }`}>
                    <Icon size={18} className={tab === t.key ? "text-white" : "text-orange-500"} />
                  </div>
                  <div>
                    <p className={`text-2xl font-bold ${tab === t.key ? "text-white" : "text-gray-900"}`}>
                      {counts[t.key as keyof typeof counts]}
                    </p>
                    <p className={`text-xs font-medium ${tab === t.key ? "text-orange-100" : "text-gray-500"}`}>
                      {t.label}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Filter tabs */}
          <div className="flex gap-2 mb-6 bg-white rounded-xl p-1 shadow-sm border border-gray-100 w-fit">
            {TABS.map(t => (
              <button key={t.key} onClick={() => setTab(t.key)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
                  tab === t.key ? "bg-orange-500 text-white" : "text-gray-500 hover:text-gray-700"
                }`}>
                {t.label}
                {counts[t.key as keyof typeof counts] > 0 && (
                  <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-xs font-bold ${
                    tab === t.key ? "bg-orange-400 text-white" : "bg-gray-100 text-gray-600"
                  }`}>
                    {counts[t.key as keyof typeof counts]}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <svg className="animate-spin h-8 w-8 text-orange-500" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
            </div>
          ) : (
            <div className="space-y-4">

              {/* AVAILABLE JOB LEADS */}
              {tab === "available" && (
                availableJobs.length === 0 ? (
                  <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
                    <Briefcase size={48} className="text-gray-200 mx-auto mb-4" />
                    <h3 className="font-bold text-gray-700 text-lg mb-2">No job leads available</h3>
                    <p className="text-gray-400 text-sm">New jobs matching your specialty will appear here</p>
                  </div>
                ) : availableJobs.map(job => (
                  <motion.div key={job.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
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
                            <span className="flex items-center gap-1 text-xs text-gray-500"><MapPin size={11} />{job.suburb}, {job.state}</span>
                            <span className="flex items-center gap-1 text-xs text-gray-400"><Calendar size={11} />{new Date(job.createdAt).toLocaleDateString("en-AU", { day: "numeric", month: "short" })}</span>
                          </div>
                          <p className="text-sm text-gray-500 mt-2 line-clamp-2">{job.description}</p>
                          {job.aiEstimate && (
                            <div className="flex items-center gap-1.5 mt-2">
                              <Zap size={11} className="text-blue-500 fill-blue-500" />
                              <span className="text-xs text-blue-600 font-medium">
                                {job.aiEstimate.split("\n").find(l => l.startsWith("💰"))?.replace("💰", "").trim()}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        <span className="text-xs text-gray-400">{job._count.quotes} quote{job._count.quotes !== 1 ? "s" : ""} sent</span>
                        <div className="flex gap-2">
                          <Link href={`/quotes?jobId=${job.id}`}>
                            <button className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5">
                              <Send size={12} />Send Quote
                            </button>
                          </Link>
                          <Link href={`/job/${job.id}`}>
                            <Link href={`/tradie-jobs/${job.id}`}>
  <button className="text-sm text-gray-600 border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50">
    View
  </button>
</Link>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}

              {/* MY QUOTES */}
              {tab === "quoted" && (
                myQuotes.length === 0 ? (
                  <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
                    <Send size={48} className="text-gray-200 mx-auto mb-4" />
                    <h3 className="font-bold text-gray-700 text-lg mb-2">No quotes sent yet</h3>
                    <p className="text-gray-400 text-sm">Quotes you send will appear here</p>
                  </div>
                ) : myQuotes.map(quote => {
                  const s = getQuoteStatusStyle(quote.status);
                  return (
                    <motion.div key={quote.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                      className={`bg-white rounded-2xl p-5 shadow-sm border-2 transition-all ${
                        quote.status === "ACCEPTED" ? "border-green-200" : "border-gray-100"
                      }`}>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Briefcase size={20} className="text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900">{quote.job.title}</h3>
                            <div className="flex items-center gap-2 flex-wrap mt-1">
                              <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded-full">{quote.job.trade}</span>
                              <span className="flex items-center gap-1 text-xs text-gray-500"><MapPin size={11} />{quote.job.suburb}, {quote.job.state}</span>
                              <span className="flex items-center gap-1 text-xs text-gray-500"><User size={11} />{quote.job.user.name}</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-2 line-clamp-2">{quote.description}</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2 flex-shrink-0">
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${s.bg}`}>{s.label}</span>
                          <div className="flex items-center gap-1">
                            <DollarSign size={14} className="text-gray-400" />
                            <span className="text-lg font-bold text-gray-900">{quote.amount.toLocaleString()}</span>
                            <span className="text-xs text-gray-400">AUD</span>
                          </div>
                          <span className="text-xs text-gray-400">
                            {new Date(quote.createdAt).toLocaleDateString("en-AU", { day: "numeric", month: "short" })}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}

              {/* ACTIVE JOBS */}
              {tab === "active" && (
                activeBookings.length === 0 ? (
                  <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
                    <Clock size={48} className="text-gray-200 mx-auto mb-4" />
                    <h3 className="font-bold text-gray-700 text-lg mb-2">No active jobs</h3>
                    <p className="text-gray-400 text-sm">Confirmed bookings will appear here</p>
                  </div>
                ) : activeBookings.map(booking => {
                  const s = getBookingStatusStyle(booking.status);
                  return (
                    <motion.div key={booking.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:border-orange-200 transition-all">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Briefcase size={20} className="text-green-600" />
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900">{booking.job.title}</h3>
                            <div className="flex items-center gap-2 flex-wrap mt-1">
                              <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full">{booking.job.trade}</span>
                              <span className="flex items-center gap-1 text-xs text-gray-500"><MapPin size={11} />{booking.job.suburb}, {booking.job.state}</span>
                              <span className="flex items-center gap-1 text-xs text-gray-500"><User size={11} />{booking.job.user.name}</span>
                            </div>
                            <div className="flex items-center gap-4 mt-2">
                              <div className="flex items-center gap-1.5 text-sm text-gray-700">
                                <Calendar size={13} className="text-orange-500" />
                                <span className="font-medium">{new Date(booking.scheduledAt).toLocaleDateString("en-AU", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-sm text-gray-700">
                                <Clock size={13} className="text-orange-500" />
                                <span className="font-medium">{new Date(booking.scheduledAt).toLocaleTimeString("en-AU", { hour: "2-digit", minute: "2-digit" })}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2 flex-shrink-0">
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${s.bg}`}>{s.label}</span>
                          <div className="flex items-center gap-1">
                            <DollarSign size={14} className="text-gray-400" />
                            <span className="text-lg font-bold text-gray-900">{booking.totalAmount.toLocaleString()}</span>
                            <span className="text-xs text-gray-400">AUD</span>
                          </div>
                          <Link href="/tradie-bookings">
                            <button className="flex items-center gap-1 text-xs text-orange-500 font-semibold hover:text-orange-700">
                              Manage <ChevronRight size={13} />
                            </button>
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}

              {/* COMPLETED JOBS */}
              {tab === "completed" && (
                completedBookings.length === 0 ? (
                  <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
                    <CheckCircle size={48} className="text-gray-200 mx-auto mb-4" />
                    <h3 className="font-bold text-gray-700 text-lg mb-2">No completed jobs yet</h3>
                    <p className="text-gray-400 text-sm">Jobs confirmed as complete will appear here</p>
                  </div>
                ) : completedBookings.map(booking => (
                  <motion.div key={booking.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl p-5 shadow-sm border border-green-100 transition-all">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                          <CheckCircle size={20} className="text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900">{booking.job.title}</h3>
                          <div className="flex items-center gap-2 flex-wrap mt-1">
                            <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full">{booking.job.trade}</span>
                            <span className="flex items-center gap-1 text-xs text-gray-500"><MapPin size={11} />{booking.job.suburb}, {booking.job.state}</span>
                            <span className="flex items-center gap-1 text-xs text-gray-500"><User size={11} />{booking.job.user.name}</span>
                          </div>
                          <div className="flex items-center gap-1.5 mt-2 text-xs text-gray-400">
                            <Calendar size={11} />
                            Completed: {new Date(booking.scheduledAt).toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" })}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        <span className="bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                          <CheckCircle size={11} />Completed
                        </span>
                        <div className="flex items-center gap-1">
                          <DollarSign size={14} className="text-gray-400" />
                          <span className="text-lg font-bold text-gray-900">{booking.totalAmount.toLocaleString()}</span>
                          <span className="text-xs text-gray-400">AUD</span>
                        </div>
                      </div>
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
