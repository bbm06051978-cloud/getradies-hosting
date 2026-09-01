"use client";
import { LockAmountBanner } from "@/app/components/dashboard/LockAmountBanner";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Briefcase, MessageCircle, Calendar, CheckCircle,
  ShieldCheck, ArrowRight, Plus, Bell, Zap,
} from "lucide-react";
import { Sidebar } from "@/app/components/dashboard/Sidebar";
import { Topbar } from "@/app/components/dashboard/Topbar";

type Job = {
  id: string;
  title: string;
  trade: string;
  status: string;
  createdAt: string;
  aiEstimate: string | null;
};

type Stats = {
  activeJobs: number;
  quotesReceived: number;
  upcomingBookings: number;
  completedJobs: number;
};

const statusStyle: Record<string, { bg: string; text: string; dot: string }> = {
  COMPLETED:  { bg: "bg-green-50",  text: "text-green-700",  dot: "bg-green-500"  },
  BOOKED:     { bg: "bg-blue-50",   text: "text-blue-700",   dot: "bg-blue-500"   },
  CANCELLED:  { bg: "bg-red-50",    text: "text-red-700",    dot: "bg-red-500"    },
  OPEN:       { bg: "bg-orange-50", text: "text-orange-700", dot: "bg-orange-500" },
  IN_PROGRESS:{ bg: "bg-purple-50", text: "text-purple-700", dot: "bg-purple-500" },
};

function StatusBadge({ status }: { status: string }) {
  const s = statusStyle[status] || statusStyle.OPEN;
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${s.bg} ${s.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`}/>
      {status.charAt(0) + status.slice(1).toLowerCase().replace("_", " ")}
    </span>
  );
}

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser]           = useState<{ name: string; email: string } | null>(null);
  const [jobs, setJobs]           = useState<Job[]>([]);
  const [statsLoading, setStatsLoading] = useState(true);
  const [stats, setStats]         = useState<Stats>({
    activeJobs: 0, quotesReceived: 0, upcomingBookings: 0, completedJobs: 0,
  });

  useEffect(() => {
    const checkAuth = () => {
      fetch("/api/auth/me").then(r => r.json()).then(d => {
        if (!d.user) { router.replace("/login"); return; }
        if (d.user.role === "TRADIE") { router.replace("/dashboard-tradie"); return; }
        if (d.user.role === "ADMIN") { router.replace("/admin"); return; }
        setUser(d.user);
      }).catch(() => {});
    };
    checkAuth();
    document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible") checkAuth(); });
    fetch("/api/dashboard/homeowner").then(r => r.json()).then(d => {
      if (d.jobs)  setJobs(d.jobs);
      if (d.stats) setStats(d.stats);
    }).catch(() => {}).finally(() => setStatsLoading(false));
  }, []);

  const statCards = [
    { title: "Active Jobs",        value: stats.activeJobs,        subtitle: "In progress",        icon: Briefcase,     color: "blue",   href: "/my-jobs"   },
    { title: "Quotes Received",    value: stats.quotesReceived,     subtitle: "Awaiting review",    icon: MessageCircle, color: "green",  href: "/my-quotes" },
    { title: "Upcoming Bookings",  value: stats.upcomingBookings,   subtitle: "This week",          icon: Calendar,      color: "orange", href: "/my-jobs?tab=inprogress"  },
    { title: "Jobs Completed",     value: stats.completedJobs,      subtitle: "All time",           icon: CheckCircle,   color: "purple", href: "/my-jobs?tab=closed"   },
  ];

  const colorMap: Record<string, { icon: string; bg: string; border: string; val: string }> = {
    blue:   { icon: "text-blue-600",   bg: "bg-blue-50",   border: "border-blue-100",   val: "text-blue-700"   },
    green:  { icon: "text-green-600",  bg: "bg-green-50",  border: "border-green-100",  val: "text-green-700"  },
    orange: { icon: "text-orange-500", bg: "bg-orange-50", border: "border-orange-100", val: "text-orange-600" },
    purple: { icon: "text-purple-600", bg: "bg-purple-50", border: "border-purple-100", val: "text-purple-700" },
  };

  const firstName = user?.name?.split(" ")[0] || "there";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar/>
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar/>
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 lg:p-8 max-w-6xl mx-auto">

            {/* Welcome header */}
            <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {greeting}, {firstName}! 👋
                </h2>
                <p className="text-gray-500 mt-1 text-sm">
                  Here&apos;s what&apos;s happening with your jobs today.
                </p>
              </div>
              <Link href="/post-job">
                <button className="flex items-center gap-2 bg-blue-900 hover:bg-blue-800 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors shadow-sm">
                  <Plus size={16}/> Post New Job
                </button>
              </Link>
            </div>

            {/* Lock Amount Banner */}
            <LockAmountBanner/>

            {/* Stats cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
              {statCards.map((s) => {
                const Icon = s.icon;
                const c = colorMap[s.color];
                return (
                  <Link key={s.title} href={s.href}>
                    <div className={`bg-white rounded-2xl p-4 border ${c.border} hover:shadow-md transition-all cursor-pointer group`}>
                      <div className="flex items-center justify-between mb-3">
                        <div className={`w-9 h-9 rounded-xl ${c.bg} flex items-center justify-center`}>
                          <Icon size={18} className={c.icon}/>
                        </div>
                        <ArrowRight size={14} className="text-gray-300 group-hover:text-gray-500 transition-colors"/>
                      </div>
                      <p className={`text-2xl font-black ${c.val}`}>
                        {statsLoading ? "..." : s.value}
                      </p>
                      <p className="text-xs font-semibold text-gray-700 mt-0.5">{s.title}</p>
                      <p className="text-xs text-gray-400">{s.subtitle}</p>
                    </div>
                  </Link>
                );
              })}
            </div>

            

            {/* Recent Jobs */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-6">
              <div className="flex items-center justify-between p-5 border-b border-gray-100">
                <h3 className="font-bold text-gray-900">Recent Jobs</h3>
                <Link href="/my-jobs" className="text-blue-600 text-xs font-semibold flex items-center gap-1 hover:text-blue-800">
                  View All <ArrowRight size={12}/>
                </Link>
              </div>

              {jobs.length === 0 ? (
                <div className="text-center py-12 px-4">
                  <Briefcase size={36} className="text-gray-200 mx-auto mb-3"/>
                  <p className="text-gray-500 font-semibold text-sm">No jobs posted yet</p>
                  <p className="text-gray-400 text-xs mt-1 mb-4">Post your first job and get quotes from verified tradies</p>
                  <Link href="/post-job">
                    <button className="bg-blue-900 text-white px-5 py-2.5 rounded-xl text-sm font-semibold">
                      Post a Job
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {jobs.slice(0, 6).map((job) => (
                    <Link key={job.id} href={`/my-jobs?jobId=${job.id}&tab=${job.status === "COMPLETED" || job.status === "CANCELLED" || job.status === "DISPUTED" ? "closed" : job.status === "BOOKED" || job.status === "IN_PROGRESS" ? "inprogress" : "open"}`}>
                      <div className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 transition-colors cursor-pointer">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                            <Briefcase size={15} className="text-blue-600"/>
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-gray-900 text-sm truncate">{job.title}</p>
                            <p className="text-xs text-gray-400 mt-0.5">
                              {job.trade} · {new Date(job.createdAt).toLocaleDateString("en-AU", { day: "numeric", month: "short" })}
                            </p>
                          </div>
                        </div>
                        <StatusBadge status={job.status}/>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* AI Estimate CTA */}
              <div className="bg-gradient-to-br from-blue-900 to-blue-700 rounded-2xl p-5 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <Zap size={18} className="text-orange-300"/>
                  <span className="text-xs font-bold uppercase tracking-widest text-blue-200">AI Feature</span>
                </div>
                <h4 className="font-bold text-base mb-1">Get an AI Estimate</h4>
                <p className="text-blue-200 text-xs mb-4 leading-relaxed">Know the price range before hiring any tradie.</p>
                <Link href="/">
                  <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors">
                    Try AI Estimate →
                  </button>
                </Link>
              </div>

              {/* Hire with confidence */}
              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck size={18} className="text-green-600"/>
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Protection</span>
                </div>
                <h4 className="font-bold text-gray-900 text-base mb-1">Hire with Confidence</h4>
                <p className="text-gray-500 text-xs mb-4 leading-relaxed">All tradies are verified. Your lock amount is secured until job completion.</p>
                <Link href="/how-it-works">
                  <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl text-xs font-bold transition-colors">
                    How It Works →
                  </button>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
