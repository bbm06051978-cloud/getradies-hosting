"use client";
import { LockAmountBanner } from "@/app/components/dashboard/LockAmountBanner";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Briefcase,
  MessageCircle,
  Calendar,
  CheckCircle,
  ShieldCheck,
  ArrowRight,
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

export default function Dashboard() {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [stats, setStats] = useState<Stats>({
    activeJobs: 0,
    quotesReceived: 0,
    upcomingBookings: 0,
    completedJobs: 0,
  });
const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    // Fetch user
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setUser(data.user);
      })
      .catch(() => {});

    // Fetch dashboard data
    fetch("/api/dashboard/homeowner")
      .then((res) => res.json())
      .then((data) => {
        if (data.jobs) setJobs(data.jobs);
        if (data.stats) setStats(data.stats);
      })
      .catch(() => {})
      .finally(() => setStatsLoading(false));
  }, []);

  const statCards = [
    {
      title: "Active Jobs",
      value: statsLoading ? "..." : String(stats.activeJobs),
      subtitle: "In progress",
      icon: Briefcase,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Quotes Received",
      value: statsLoading ? "..." : String(stats.quotesReceived),
      subtitle: "New quotes available",
      icon: MessageCircle,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "Upcoming Bookings",
      value: statsLoading ? "..." : String(stats.upcomingBookings),
      subtitle: "This week",
      icon: Calendar,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-500",
    },
    {
      title: "Jobs Completed",
      value: statsLoading ? "..." : String(stats.completedJobs),
      subtitle: "Total",
      icon: CheckCircle,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0">
        <Topbar />

        <div className="p-8 flex-1">

          {/* Welcome header */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Welcome back, {user?.name?.split(" ")[0] || "there"}! 👋
              </h2>
              <p className="text-gray-500 mt-1 text-sm">
                Here&apos;s what&apos;s happening with your jobs today.
              </p>
            </div>
            <Link href="/post-job">
              <button className="flex items-center gap-2 bg-blue-900 hover:bg-blue-800 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-colors shadow-sm">
                + Post New Job
              </button>
            </Link>
          </div>

{/* Lock Amount Awareness Banner */}
          <LockAmountBanner />

          {/* Stats */}
          {/* Stats tabs */}
          <div className="flex border-b border-gray-200 mb-8 overflow-x-auto">
            {statCards.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.title} className="flex-1 min-w-[140px] flex flex-col items-center gap-1 px-4 py-4 border-b-2 border-blue-900 cursor-default">
                  <div className={`w-8 h-8 rounded-lg ${s.iconBg} flex items-center justify-center mb-1`}>
                    <Icon size={16} className={s.iconColor}/>
                  </div>
                  <span className="text-2xl font-black text-gray-900">{s.value}</span>
                  <span className="text-xs font-semibold text-gray-700 text-center whitespace-nowrap">{s.title}</span>
                  <span className="text-xs text-gray-400 text-center">{s.subtitle}</span>
                </div>
              );
            })}
          </div>

          {/* Recent Jobs */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg text-gray-900">Recent Jobs</h3>
<Link href="/my-jobs" className="text-blue-600 text-sm font-medium flex items-center gap-1 hover:text-blue-800">
                View All Jobs <ArrowRight size={14} />
              </Link>
            </div>

            {jobs.length === 0 ? (
              <div className="text-center py-12">
                <Briefcase size={40} className="text-gray-200 mx-auto mb-3" />
                <p className="text-gray-400 font-medium">No jobs posted yet</p>
                <p className="text-gray-400 text-sm mt-1">
                  Click &quot;Post New Job&quot; to get started
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                {jobs.map((job) => (
                  <Link key={job.id} href={`/my-jobs?jobId=${job.id}`}>
                  <div
                    className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 rounded-xl px-2 -mx-2 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <Briefcase size={16} className="text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{job.title}</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {job.trade} · {new Date(job.createdAt).toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {job.aiEstimate && (
                        <span className="text-xs text-gray-500 max-w-[200px] truncate hidden sm:block">
                          {job.aiEstimate.split("\n")[0]}
                        </span>
                      )}
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        job.status === "COMPLETED"
                          ? "bg-green-100 text-green-700"
                          : job.status === "BOOKED"
                          ? "bg-blue-100 text-blue-700"
                          : job.status === "CANCELLED"
                          ? "bg-red-100 text-red-700"
                          : "bg-orange-100 text-orange-700"
                      }`}>
                        {job.status.charAt(0) + job.status.slice(1).toLowerCase()}
                      </span>
                    </div>
                  </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Hire with confidence banner */}
            <div className="mt-4 flex items-center justify-between bg-blue-50 rounded-xl px-4 py-3">
              <div className="flex items-center gap-3">
                <ShieldCheck size={22} className="text-blue-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-gray-800">Hire with confidence</p>
                  <p className="text-xs text-gray-500">
                    All tradies are background checked, verified and reviewed by real customers.
                  </p>
                </div>
              </div>
              <button className="ml-4 bg-white border border-gray-200 hover:border-blue-900 text-gray-700 hover:text-blue-900 text-xs font-semibold px-4 py-2 rounded-lg transition-colors whitespace-nowrap">
                Learn More
              </button>
            </div>
          </div>

          {/* How It Works */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-bold text-lg text-gray-900 mb-6">How GeTradie Works</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {[
                { step: 1, title: "Post Your Job", desc: "Tell us what you need in minutes" },
                { step: 2, title: "Receive Estimates", desc: "Get fixed-price quotes from verified tradies" },
                { step: 3, title: "Compare & Chat", desc: "Compare quotes and chat with tradies" },
                { step: 4, title: "Hire & Book", desc: "Choose the best tradie and book with ease" },
                { step: 5, title: "Job Done!", desc: "Job completed with confidence" },
              ].map((item, i) => (
                <div key={item.step} className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {item.step}
                    </div>
                    {i < 4 && (
                      <ArrowRight size={14} className="text-gray-300 hidden lg:block" />
                    )}
                  </div>
                  <h4 className="font-semibold text-gray-800 text-sm">{item.title}</h4>
                  <p className="text-xs text-gray-400 mt-1 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}