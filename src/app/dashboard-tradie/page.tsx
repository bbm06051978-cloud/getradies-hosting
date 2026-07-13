"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Briefcase,
  MessageSquare,
  Calendar,
  DollarSign,
  ArrowRight,
  CheckCircle,
  Clock,
  RefreshCw,
  Image as ImageIcon,
  BarChart2,
} from "lucide-react";

import { TradieSidebar } from "@/app/components/tradie/TradieSidebar";
import { TradieTopbar } from "@/app/components/tradie/TradieTopbar";
import { QuickTools } from "@/app/components/tradie/TradiTools";

type JobLead = {
  id: string;
  title: string;
  trade: string;
  suburb: string;
  state: string;
  status: string;
  createdAt: string;
  aiEstimate: string | null;
};

type ScheduleItem = {
  id: string;
  scheduledAt: string;
  status: string;
  job: { title: string; user: { suburb: string; state: string } };
};

type Stats = {
  newJobLeads: number;
  quotesSent: number;
  bookingsConfirmed: number;
  earnings: number;
};

type ProfileCompletion = {
  businessDetails: boolean;
  servicesPricing: boolean;
  photosGallery: boolean;
  licenseInsurance: boolean;
};

const quickActions = [
  { label: "Update Availability", icon: RefreshCw },
  { label: "Add Services", icon: Briefcase },
  { label: "Add Photos", icon: ImageIcon },
  { label: "View Reports", icon: BarChart2 },
];

export default function TradieDashboard() {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [jobLeads, setJobLeads] = useState<JobLead[]>([]);
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [stats, setStats] = useState<Stats>({
    newJobLeads: 0,
    quotesSent: 0,
    bookingsConfirmed: 0,
    earnings: 0,
  });
  const [profile, setProfile] = useState<ProfileCompletion>({
    businessDetails: false,
    servicesPricing: false,
    photosGallery: false,
    licenseInsurance: false,
  });

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => { if (data.user) setUser(data.user); })
      .catch(() => {});

    fetch("/api/dashboard/tradie")
      .then((res) => res.json())
      .then((data) => {
        if (data.jobLeads) setJobLeads(data.jobLeads);
        if (data.schedule) setSchedule(data.schedule);
        if (data.stats) setStats(data.stats);
        if (data.profile) setProfile(data.profile);
      })
      .catch(() => {});
  }, []);

  const statCards = [
    {
      title: "New Job Leads",
      value: stats.newJobLeads,
      subtitle: "This Week",
      trend: null,
      icon: Briefcase,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Quotes Sent",
      value: stats.quotesSent,
      subtitle: "This Week",
      trend: null,
      icon: MessageSquare,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "Bookings Confirmed",
      value: stats.bookingsConfirmed,
      subtitle: "This Week",
      trend: null,
      icon: Calendar,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-500",
    },
    {
      title: "Earnings",
      value: `$${stats.earnings.toLocaleString()}`,
      subtitle: "This Month",
      trend: null,
      icon: DollarSign,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
  ];

  const profileItems = [
    { label: "Business Details", done: profile.businessDetails },
    { label: "Services & Pricing", done: profile.servicesPricing },
    { label: "Photos & Gallery", done: profile.photosGallery },
    { label: "License & Insurance", done: profile.licenseInsurance, action: "Add Now" },
  ];

  const completedCount = Object.values(profile).filter(Boolean).length;
  const completionPercent = Math.round((completedCount / 4) * 100);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <TradieSidebar />

      <main className="flex-1 flex flex-col min-w-0">
        <TradieTopbar />

        <div className="p-6 flex-1">

          {/* Welcome */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Welcome back, {user?.name?.split(" ")[0] || "there"}! 👋
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                Here&apos;s what&apos;s happening with your business today.
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {statCards.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.title} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl ${s.iconBg} flex items-center justify-center flex-shrink-0`}>
                    <Icon size={22} className={s.iconColor} />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{s.value}</div>
                    <div className="text-xs font-semibold text-gray-700">{s.title}</div>
                    <div className="text-xs text-gray-400">{s.subtitle}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Main grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

            {/* Recent Job Leads */}
            <div className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-base text-gray-900">Recent Job Leads</h3>
                <Link href="#" className="text-blue-600 text-sm font-medium flex items-center gap-1 hover:text-blue-800">
                  View All <ArrowRight size={14} />
                </Link>
              </div>

              {jobLeads.length === 0 ? (
                <div className="text-center py-12">
                  <Briefcase size={40} className="text-gray-200 mx-auto mb-3" />
                  <p className="text-gray-400 font-medium">No job leads yet</p>
                  <p className="text-gray-400 text-sm mt-1">
                    Job leads from homeowners will appear here
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {jobLeads.map((job) => (
                    <div key={job.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                      <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <Briefcase size={18} className="text-blue-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 text-sm">{job.title}</h4>
                        <p className="text-xs text-gray-400">
                          {job.suburb}, {job.state} · {new Date(job.createdAt).toLocaleDateString("en-AU", { day: "numeric", month: "short" })}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0 mr-2">
                        <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                          {job.trade}
                        </span>
                        {job.aiEstimate && (
                          <p className="text-xs text-gray-400 mt-1">
                            {job.aiEstimate.split("\n").find(l => l.startsWith("💰"))?.replace("💰", "").trim() || ""}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
			<Link href={`/quotes?jobId=${job.id}`}>
                          <button className="bg-blue-900 hover:bg-blue-800 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors">
                            Send Quote
                          </button>
                        </Link>
                        <Link href={`/tradie-jobs/${job.id}`}>
  <button className="text-sm text-gray-500 border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50">
    View
  </button>
</Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

        {/* Quick Tools */}
          <QuickTools />

            {/* Right column */}
            <div className="flex flex-col gap-6">

              {/* My Schedule */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-base text-gray-900">My Schedule</h3>
                  <Link href="#" className="text-blue-600 text-xs font-medium hover:text-blue-800">
                    View Calendar
                  </Link>
                </div>

                {schedule.length === 0 ? (
                  <div className="text-center py-6">
                    <Calendar size={32} className="text-gray-200 mx-auto mb-2" />
                    <p className="text-gray-400 text-sm">No bookings scheduled</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {schedule.map((item) => (
                      <div key={item.id} className="flex items-start gap-3">
                        <div className="flex-shrink-0 text-xs text-gray-500 w-16">
                          {new Date(item.scheduledAt).toLocaleTimeString("en-AU", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-800 truncate">
                            {item.job.title}
                          </p>
                          <p className="text-xs text-gray-400">
                            {item.job.user.suburb}, {item.job.user.state}
                          </p>
                        </div>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${
                          item.status === "CONFIRMED"
                            ? "bg-blue-50 text-blue-600"
                            : "bg-orange-50 text-orange-600"
                        }`}>
                          {item.status.charAt(0) + item.status.slice(1).toLowerCase()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Profile Completion */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-base text-gray-900">Profile Completion</h3>
                  <span className="text-sm font-bold text-gray-700">{completionPercent}% Complete</span>
                </div>

                <div className="w-full bg-gray-100 rounded-full h-2.5 mb-4">
                  <div
                    className="bg-green-500 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${completionPercent}%` }}
                  />
                </div>

                <div className="space-y-2.5">
                  {profileItems.map((item) => (
                    <div key={item.label} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {item.done ? (
                          <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                        ) : (
                          <Clock size={16} className="text-gray-300 flex-shrink-0" />
                        )}
                        <span className="text-sm text-gray-700">{item.label}</span>
                      </div>
                      {item.done ? (
                        <span className="text-xs text-gray-400">Completed</span>
                      ) : (
                        <button className="text-xs text-blue-600 font-semibold hover:text-blue-800">
                          {item.action || "Add Now"}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <h3 className="font-bold text-base text-gray-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-4 gap-2">
                  {quickActions.map((action) => {
                    const Icon = action.icon;
                    return (
                      <button key={action.label} className="flex flex-col items-center gap-1.5 group">
                        <div className="w-11 h-11 bg-blue-900 hover:bg-blue-800 rounded-xl flex items-center justify-center transition-colors">
                          <Icon size={18} className="text-white" />
                        </div>
                        <span className="text-xs text-gray-500 text-center leading-tight group-hover:text-gray-700">
                          {action.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}