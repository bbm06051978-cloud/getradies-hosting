"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowLeft, Briefcase, MapPin, Calendar,
  CheckCircle, XCircle, AlertCircle, Clock,
  MessageCircle, Plus, Zap, ChevronRight, User,
} from "lucide-react";
import { Sidebar } from "@/app/components/dashboard/Sidebar";
import { Topbar } from "@/app/components/dashboard/Topbar";

type Quote = { id: string; amount: number; status: string };
type BookingRef = {
  id: string; status: string; scheduledAt: string;
  tradieProfile?: {
    businessName: string; specialty: string;
    user: { phone: string };
  };
};
type Job = {
  id: string; title: string; description: string;
  trade: string; suburb: string; state: string;
  postcode: string | null; status: string;
  aiEstimate: string | null; createdAt: string;
  quotes: Quote[];
  bookings: BookingRef[];
};

const STATUS_FILTERS = ["ALL", "OPEN", "BOOKED", "IN_PROGRESS", "COMPLETED", "CANCELLED"];

export default function MyJobsPage() {
  const [jobs, setJobs]           = useState<Job[]>([]);
  const [loading, setLoading]     = useState(true);
  const [filter, setFilter]       = useState("ALL");
  const [cancelling, setCancelling] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const f = searchParams.get("filter");
    if (f) setFilter(f);
    const jobId = searchParams.get("jobId");
    if (jobId) {
      setTimeout(() => {
        const el = document.getElementById(`job-${jobId}`);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 500);
    }
  }, [searchParams]);

  useEffect(() => {
    fetch("/api/my-jobs")
      .then(r => r.json())
      .then(d => { if (d.jobs) setJobs(d.jobs); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleCancel = async (jobId: string) => {
    if (!confirm("Are you sure you want to cancel this job?")) return;
    setCancelling(jobId);
    try {
      const res = await fetch("/api/my-jobs", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId, action: "cancel" }),
      });
      if (res.ok) {
        setJobs(prev => prev.map(j => j.id === jobId ? { ...j, status: "CANCELLED" } : j));
      }
    } catch {} finally { setCancelling(null); }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "OPEN":        return { bg: "bg-blue-100 text-blue-700",    icon: Clock,         label: "Open"        };
      case "QUOTED":      return { bg: "bg-orange-100 text-orange-700", icon: MessageCircle, label: "Quotes In"   };
      case "BOOKED":      return { bg: "bg-purple-100 text-purple-700", icon: Calendar,      label: "Booked"      };
      case "IN_PROGRESS": return { bg: "bg-yellow-100 text-yellow-700", icon: AlertCircle,   label: "In Progress" };
      case "COMPLETED":   return { bg: "bg-green-100 text-green-700",   icon: CheckCircle,   label: "Completed"   };
      case "CANCELLED":   return { bg: "bg-red-100 text-red-700",       icon: XCircle,       label: "Cancelled"   };
      default:            return { bg: "bg-gray-100 text-gray-700",     icon: Clock,         label: status        };
    }
  };

  const jobIdParam = searchParams.get("jobId");
  const filtered = jobIdParam
    ? jobs.filter(j => j.id === jobIdParam)
    : filter === "ALL" ? jobs : jobs.filter(j => j.status === filter);
  const stats = {
    total:     jobs.length,
    active:    jobs.filter(j => ["OPEN","QUOTED","IN_PROGRESS"].includes(j.status)).length,
    booked:    jobs.filter(j => j.status === "BOOKED").length,
    completed: jobs.filter(j => j.status === "COMPLETED").length,
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <div className="p-8 flex-1">

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
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
              <button className="flex items-center gap-2 bg-blue-900 hover:bg-blue-800 text-white px-5 py-3 rounded-xl font-semibold text-sm transition-colors shadow-sm">
                <Plus size={16}/> Post New Job
              </button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              { label:"Total Posted", value:stats.total,     color:"text-blue-600",   bg:"bg-blue-50",   border:"border-blue-100"   },
              { label:"Active",       value:stats.active,    color:"text-orange-600", bg:"bg-orange-50", border:"border-orange-100" },
              { label:"Booked",       value:stats.booked,    color:"text-purple-600", bg:"bg-purple-50", border:"border-purple-100" },
              { label:"Completed",    value:stats.completed, color:"text-green-600",  bg:"bg-green-50",  border:"border-green-100"  },
            ].map(s => (
              <div key={s.label} className={`${s.bg} border ${s.border} rounded-2xl p-4 text-center`}>
                <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-sm text-gray-600 font-medium mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Filter tabs */}
          <div className="flex gap-2 mb-6 bg-white rounded-xl p-1 shadow-sm border border-gray-100 w-fit flex-wrap">
            {STATUS_FILTERS.map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
                  filter === f ? "bg-blue-900 text-white" : "text-gray-500 hover:text-gray-700"
                }`}>
                {f === "ALL" ? "All" : f === "IN_PROGRESS" ? "In Progress" : f === "QUOTED" ? "Quotes" : f.charAt(0) + f.slice(1).toLowerCase()}
              </button>
            ))}
          </div>

          {/* Jobs list */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <svg className="animate-spin h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
              </svg>
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
              <Briefcase size={48} className="text-gray-200 mx-auto mb-4"/>
              <h3 className="font-bold text-gray-700 text-lg mb-2">No jobs found</h3>
              <p className="text-gray-400 text-sm">
                {filter === "ALL" ? "You haven't posted any jobs yet." : `No jobs with status "${filter.toLowerCase()}".`}
              </p>
              <Link href="/post-job">
                <button className="mt-6 bg-blue-900 hover:bg-blue-800 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-colors">
                  Post Your First Job
                </button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map(job => {
                const style     = getStatusStyle(job.status);
                const StatusIcon = style.icon;
                const acceptedQuote = job.quotes.find(q => q.status === "ACCEPTED");
                const booking       = job.bookings[0];
                const tradie        = booking?.tradieProfile;

                return (
                  <motion.div key={job.id} id={`job-${job.id}`}
                    animate={jobIdParam === job.id ? { scale: [1, 1.02, 1] } : {}}
                    transition={{ duration: 0.5, repeat: 2 }}
                    initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
                    className={`bg-white rounded-2xl shadow-sm border transition-all overflow-hidden ${
                      jobIdParam === job.id 
                        ? "border-orange-400 shadow-orange-100 shadow-lg" 
                        : "border-gray-100 hover:border-blue-200"
                    }`}>
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        {/* Left */}
                        <div className="flex items-start gap-4 flex-1">
                          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Briefcase size={20} className="text-blue-600"/>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <h3 className="font-bold text-gray-900">{job.title}</h3>
                              <span className={`flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${style.bg}`}>
                                <StatusIcon size={10}/>{style.label}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 flex-wrap text-xs text-gray-500 mb-2">
                              <span className="bg-gray-100 px-2 py-0.5 rounded-full font-medium">{job.trade}</span>
                              <span className="flex items-center gap-1"><MapPin size={11}/>{job.suburb}, {job.state}</span>
                              <span className="flex items-center gap-1"><Calendar size={11}/>{new Date(job.createdAt).toLocaleDateString("en-AU", { day:"numeric", month:"short", year:"numeric" })}</span>
                            </div>
                            <p className="text-sm text-gray-500 line-clamp-2">{job.description}</p>

                            {/* AI Estimate */}
                            {job.aiEstimate && (
                              <div className="flex items-center gap-1.5 mt-2">
                                <Zap size={11} className="text-blue-500 fill-blue-500"/>
                                <span className="text-xs text-blue-600 font-medium">
                                  {job.aiEstimate.split("\n").find(l => l.includes("AUD") || l.includes("$"))?.trim()}
                                </span>
                              </div>
                            )}

                            {/* Accepted tradie info */}
                            {tradie && (
                              <div className="mt-3 flex items-center gap-2 bg-green-50 border border-green-100 rounded-xl px-3 py-2">
                                <User size={13} className="text-green-600 flex-shrink-0"/>
                                <div>
                                  <p className="text-xs font-bold text-green-800">{tradie.businessName}</p>
                                  <p className="text-xs text-green-600">{tradie.specialty}{tradie.user.phone ? ` · ${tradie.user.phone}` : ""}</p>
                                </div>
                                {booking.scheduledAt && (
                                  <div className="ml-auto flex items-center gap-1.5 text-xs text-green-700">
                                    <Calendar size={11}/>
                                    {new Date(booking.scheduledAt).toLocaleDateString("en-AU", { weekday:"short", day:"numeric", month:"short" })}
                                    {" at "}
                                    {new Date(booking.scheduledAt).toLocaleTimeString("en-AU", { hour:"2-digit", minute:"2-digit" })}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Right — quote count + accepted amount */}
                        <div className="flex flex-col items-end gap-2 flex-shrink-0">
                          <span className="text-xs text-gray-400">{job.quotes.length} quote{job.quotes.length !== 1 ? "s" : ""}</span>
                          {acceptedQuote && (
                            <div className="bg-green-100 border border-green-200 rounded-xl px-3 py-1.5 text-center">
                              <p className="text-sm font-bold text-green-700">${acceptedQuote.amount.toLocaleString()}</p>
                              <p className="text-xs text-green-600">accepted</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-100 flex-wrap">
                        {job.status === "OPEN" || job.status === "QUOTED" ? (
                          <>
                            <Link href={`/my-quotes?jobId=${job.id}`}>
                              <button className="flex items-center gap-1.5 bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors">
                                <MessageCircle size={13}/> View Quotes ({job.quotes.length})
                              </button>
                            </Link>
                            <button onClick={() => handleCancel(job.id)} disabled={cancelling === job.id}
                              className="flex items-center gap-1.5 border border-red-200 text-red-500 hover:bg-red-50 px-4 py-2 rounded-xl text-xs font-semibold transition-colors disabled:opacity-50">
                              <XCircle size={13}/>
                              {cancelling === job.id ? "Cancelling..." : "Cancel Job"}
                            </button>
                          </>
                        ) : job.status === "BOOKED" || job.status === "IN_PROGRESS" ? (
                          <>
                            <Link href={`/bookings?bookingId=${booking?.id}`}>
                                <button className="flex items-center gap-1.5 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors">
                                  <Calendar size={13}/> View Booking <ChevronRight size={12}/>
                                </button>
                              </Link>
                            <Link href={`/chats?jobId=${job.id}`}>
                              <button className="flex items-center gap-1.5 border border-gray-200 text-gray-600 hover:border-blue-300 px-4 py-2 rounded-xl text-xs font-semibold transition-colors">
                                <MessageCircle size={13}/> Message Tradie
                              </button>
                            </Link>
                          </>
                        ) : job.status === "COMPLETED" ? (
                          <Link href={`/bookings?bookingId=${booking?.id}`}>
                              <button className="flex items-center gap-1.5 border border-gray-200 text-gray-600 px-4 py-2 rounded-xl text-xs font-semibold">
                                <CheckCircle size={13}/> View Details
                              </button>
                            </Link>
                        ) : null}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
