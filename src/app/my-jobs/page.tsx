"use client";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import {
  ArrowLeft, Briefcase, MapPin, Calendar, ChevronRight,
  Plus, Clock, CheckCircle, XCircle, AlertCircle, RefreshCw,
} from "lucide-react";
import { Sidebar } from "@/app/components/dashboard/Sidebar";
import { Topbar } from "@/app/components/dashboard/Topbar";

type Quote = { id: string; amount: number; status: string };
type BookingRef = {
  id: string; status: string; scheduledAt: string;
  tradieProfile: { businessName: string; specialty: string; user: { phone: string } };
};
type Job = {
  id: string; title: string; trade: string; suburb: string;
  state: string; postcode: string | null; status: string;
  aiEstimate: string | null; createdAt: string;
  quotes: Quote[]; bookings: BookingRef[];
};

// Map job/booking status to display badge
const getStatusBadge = (job: Job) => {
  const bookingStatus = job.bookings[0]?.status;
  if (bookingStatus === "DISPUTED")           return { label: "⚠️ Disputed",              color: "bg-red-100 text-red-700" };
  if (bookingStatus === "CANCELLED")          return { label: "❌ Cancelled",              color: "bg-gray-100 text-gray-600" };
  if (bookingStatus === "COMPLETED")          return { label: "✅ Completed",              color: "bg-green-100 text-green-700" };
  if (bookingStatus === "PENDING_CONFIRMATION") return { label: "🔔 Awaiting Confirmation", color: "bg-purple-100 text-purple-700" };
  if (bookingStatus === "CONFIRMED")          return { label: "📅 Confirmed",              color: "bg-blue-100 text-blue-700" };
  if (bookingStatus === "PENDING")            return { label: "🔨 In Progress",            color: "bg-orange-100 text-orange-700" };
  if (job.status === "COMPLETED")             return { label: "✅ Completed",              color: "bg-green-100 text-green-700" };
  if (job.status === "CANCELLED")             return { label: "❌ Cancelled",              color: "bg-gray-100 text-gray-600" };
  if (job.status === "DISPUTED")              return { label: "⚠️ Disputed",              color: "bg-red-100 text-red-700" };
  if (job.status === "BOOKED")               return { label: "🔵 Booked",                color: "bg-blue-100 text-blue-700" };
  if (job.quotes.length > 0)                 return { label: "💬 Quotes Received",        color: "bg-yellow-100 text-yellow-700" };
  return { label: "🟡 Waiting for Quotes", color: "bg-gray-100 text-gray-500" };
};

// Determine which tab a job belongs to
const getJobTab = (job: Job): "open" | "inprogress" | "closed" => {
  const bookingStatus = job.bookings[0]?.status;
  if (bookingStatus === "COMPLETED" || bookingStatus === "CANCELLED" || bookingStatus === "DISPUTED") return "closed";
  if (job.status === "COMPLETED" || job.status === "CANCELLED" || job.status === "DISPUTED") return "closed";
  if (bookingStatus === "PENDING_CONFIRMATION" || bookingStatus === "CONFIRMED" || bookingStatus === "PENDING" || job.status === "IN_PROGRESS") return "inprogress";
  if (job.status === "BOOKED") return "inprogress";
  return "open";
};

function MyJobsPageInner() {
  const [jobs, setJobs]       = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab]         = useState<"open" | "inprogress" | "closed">("open");
  const searchParams          = useSearchParams();

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

  const openJobs      = jobs.filter(j => getJobTab(j) === "open");
  const inProgressJobs = jobs.filter(j => getJobTab(j) === "inprogress");
  const closedJobs    = jobs.filter(j => getJobTab(j) === "closed");

  const currentJobs = tab === "open" ? openJobs : tab === "inprogress" ? inProgressJobs : closedJobs;

  const TABS = [
    { key: "open",       label: "Open",        icon: Clock,         count: openJobs.length,       color: "text-blue-600" },
    { key: "inprogress", label: "In Progress",  icon: RefreshCw,     count: inProgressJobs.length, color: "text-orange-500" },
    { key: "closed",     label: "Closed",       icon: CheckCircle,   count: closedJobs.length,     color: "text-green-600" },
  ] as const;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar/>
      <div className="flex-1 flex flex-col">
        <Topbar/>
        <div className="p-6 lg:p-8 flex-1">

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="text-gray-400 hover:text-gray-600">
                <ArrowLeft size={20}/>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">My Jobs</h1>
                <p className="text-gray-500 text-sm mt-0.5">All jobs you have posted on GeTradie</p>
              </div>
            </div>
            <Link href="/post-job">
              <button className="flex items-center gap-2 bg-blue-900 hover:bg-blue-800 text-white px-4 py-2.5 rounded-xl font-bold text-sm transition-colors">
                <Plus size={16}/> Post New Job
              </button>
            </Link>
          </div>

          {/* 3 Tabs */}
          <div className="flex gap-2 mb-6 bg-white rounded-2xl p-1.5 shadow-sm border border-gray-100 w-fit">
            {TABS.map(t => {
              const Icon = t.icon;
              return (
                <button key={t.key} onClick={() => setTab(t.key)}
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
            <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
              <Briefcase size={48} className="text-gray-200 mx-auto mb-4"/>
              <h3 className="font-bold text-gray-700 text-lg mb-2">
                {tab === "open" ? "No open jobs" : tab === "inprogress" ? "No jobs in progress" : "No closed jobs"}
              </h3>
              <p className="text-gray-400 text-sm mb-6">
                {tab === "open" ? "Post a new job to get quotes from verified tradies." : "Jobs will appear here as they progress."}
              </p>
              {tab === "open" && (
                <Link href="/post-job">
                  <button className="bg-blue-900 text-white px-6 py-2.5 rounded-xl font-bold text-sm">
                    Post a Job
                  </button>
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {currentJobs.map(job => {
                const badge = getStatusBadge(job);
                const booking = job.bookings[0];
                const acceptedQuote = job.quotes.find(q => q.status === "ACCEPTED");
                return (
                  <motion.div key={job.id}
                    initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
                    <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Briefcase size={20} className="text-blue-600"/>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-bold text-gray-900">{job.title}</h3>
                            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${badge.color}`}>
                              {badge.label}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 flex-wrap mt-1.5">
                            <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded-full">{job.trade}</span>
                            <span className="flex items-center gap-1 text-xs text-gray-500">
                              <MapPin size={11}/>{job.suburb}, {job.state}
                            </span>
                            <span className="flex items-center gap-1 text-xs text-gray-400">
                              <Calendar size={11}/>
                              {new Date(job.createdAt).toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" })}
                            </span>
                          </div>

                          {/* Quote info */}
                          {job.quotes.length > 0 && (
                            <div className="mt-2 flex items-center gap-3 flex-wrap">
                              <span className="text-xs text-gray-500">{job.quotes.length} quote{job.quotes.length !== 1 ? "s" : ""} received</span>
                              {acceptedQuote && (
                                <span className="text-xs font-bold text-green-600">${acceptedQuote.amount.toLocaleString()} AUD accepted</span>
                              )}
                            </div>
                          )}

                          {/* Booking info */}
                          {booking && (
                            <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                              <span className="font-semibold text-gray-700">{booking.tradieProfile.businessName}</span>
                              {booking.scheduledAt && (
                                <span>· {new Date(booking.scheduledAt).toLocaleDateString("en-AU", { weekday: "short", day: "numeric", month: "short" })}</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2 flex-shrink-0 min-w-0">
                        {tab === "open" && job.quotes.length > 0 && (
                          <Link href={`/my-quotes?jobId=${job.id}`}>
                            <button className="flex items-center gap-1 bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold px-3 py-2 rounded-xl transition-colors">
                              View Quotes <ChevronRight size={12}/>
                            </button>
                          </Link>
                        )}
                        {booking && (
                          <Link href={`/bookings?bookingId=${booking.id}`}>
                            <button className="flex items-center gap-1 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold px-3 py-2 rounded-xl transition-colors">
                              Manage <ChevronRight size={12}/>
                            </button>
                          </Link>
                        )}
                        {tab === "open" && job.status === "OPEN" && (
                          <button onClick={() => handleCancel(job.id)}
                            className="flex items-center gap-1 text-xs font-semibold text-red-500 hover:text-red-700 border border-red-200 hover:border-red-400 px-3 py-2 rounded-xl transition-colors">
                            <XCircle size={12}/> Cancel
                          </button>
                        )}
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
