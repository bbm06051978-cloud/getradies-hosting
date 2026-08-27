"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  quotesAccepted: number;
  quotesRejected: number;
  quotesPending: number;
  bookingsConfirmed: number;
  bookingsCompleted: number;
  bookingsPending: number;
  bookingsDisputed: number;
  earnings: number;
  winRate: number;
};

type GetradiePoints = {
  points: number;
  badge: string;
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
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [jobLeads, setJobLeads] = useState<JobLead[]>([]);
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [stats, setStats] = useState<Stats>({
    newJobLeads: 0, quotesSent: 0, quotesAccepted: 0, quotesRejected: 0,
    quotesPending: 0, bookingsConfirmed: 0, bookingsCompleted: 0,
    bookingsPending: 0, bookingsDisputed: 0, earnings: 0, winRate: 0,
  });

const [getradiePoints, setGetradiePoints] = useState<GetradiePoints>({ points: 0, badge: "Bronze" });
const [subscription, setSubscription] = useState({ plan: "Free", expiry: null as string | null, freeQuotesUsed: 0 });
  const [verificationStatus, setVerificationStatus] = useState<string>("EMAIL_VERIFIED");
  const [profile, setProfile] = useState<ProfileCompletion>({
    businessDetails: false,
    servicesPricing: false,
    photosGallery: false,
    licenseInsurance: false,
  });

  useEffect(() => {
   fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setUser(data.user);
        else router.replace("/login");
      })
      .catch(() => router.replace("/login"));

    fetch("/api/dashboard/tradie")
      .then((res) => res.json())
      .then((data) => {
        if (data.jobLeads) setJobLeads(data.jobLeads);
        if (data.schedule) setSchedule(data.schedule);
        if (data.stats) setStats(data.stats);
        if (data.profile) setProfile(data.profile);
        if (data.getradiePoints) setGetradiePoints(data.getradiePoints);
if (data.subscription) setSubscription(data.subscription);
      })
      .catch(() => {});

    // Fetch verification status
    fetch("/api/verification")
      .then(r => r.json())
      .then(d => {
        console.log("vStatus:", d.tradieProfile?.verificationStatus);
        if (d.tradieProfile?.verificationStatus) setVerificationStatus(d.tradieProfile.verificationStatus);
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
      <style>{`@keyframes marqueeScroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }`}</style>
      <TradieSidebar />

      <main className="flex-1 flex flex-col min-w-0">
        <TradieTopbar />

        <div className="p-6 flex-1">

          {/* Verification Banner */}
          {verificationStatus === "MORE_INFO_REQUIRED" && (
            <div className="mb-6 bg-orange-50 border border-orange-300 rounded-xl p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">⚠️</span>
                <div>
                  <p className="font-bold text-orange-800 text-sm">Additional documents required</p>
                  <p className="text-orange-600 text-xs mt-0.5">GeTradie has requested more information. Please check your verification page.</p>
                </div>
              </div>
              <Link href="/tradie-verification" className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors">
                Upload Documents →
              </Link>
            </div>
          )}
          {verificationStatus === "REJECTED" && (
            <div className="mb-6 bg-red-50 border border-red-300 rounded-xl p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">❌</span>
                <div>
                  <p className="font-bold text-red-800 text-sm">Verification unsuccessful — please resubmit</p>
                  <p className="text-red-600 text-xs mt-0.5">Your documents were not approved. Check your email for details.</p>
                </div>
              </div>
              <Link href="/tradie-verification" className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors">
                Resubmit →
              </Link>
            </div>
          )}
          {verificationStatus === "DOCS_SUBMITTED" && (
            <div className="mb-6 bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center gap-3">
              <span className="text-2xl">🔍</span>
              <div>
                <p className="font-bold text-blue-800 text-sm">Documents under review</p>
                <p className="text-blue-600 text-xs mt-0.5">Our team is reviewing your documents. You will hear back within 24-48 hours.</p>
              </div>
            </div>
          )}
          {verificationStatus === "EMAIL_VERIFIED" && (
            <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🛡️</span>
                <div>
                  <p className="font-bold text-amber-800 text-sm">Complete your verification to start quoting</p>
                  <p className="text-amber-600 text-xs mt-0.5">Upload your trade licence to get your Verified Tradie badge and access job leads.</p>
                </div>
              </div>
              <Link href="/tradie-verification" className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors">
                Verify Now →
              </Link>
            </div>
          )}

          {/* Verified Badge Banner */}
          {verificationStatus === "APPROVED" && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
              <span className="text-2xl">✅</span>
              <p className="font-bold text-green-800 text-sm">Your account is verified — you can quote on all available jobs!</p>
            </div>
          )}

          


{/* GeTradie Points Banner */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-500 rounded-2xl p-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 shadow-lg">
            {/* Points + Badge */}
            <div>
              <p className="text-orange-100 text-xs font-semibold uppercase tracking-widest mb-1">Your GeTradie Points</p>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-black text-white">{getradiePoints.points}</span>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                  getradiePoints.badge === "Platinum" ? "bg-purple-200 text-purple-900" :
                  getradiePoints.badge === "Gold"     ? "bg-yellow-200 text-yellow-900" :
                  getradiePoints.badge === "Silver"   ? "bg-gray-200 text-gray-900" :
                  "bg-orange-200 text-orange-900"
                }`}>
                  {getradiePoints.badge === "Platinum" ? "🏆" : getradiePoints.badge === "Gold" ? "🥇" : getradiePoints.badge === "Silver" ? "🥈" : "🥉"} {getradiePoints.badge}
                </span>
              </div>
            </div>
            {/* Divider */}
              <div className="hidden sm:block w-px h-10 bg-orange-400"/>
              <div className="sm:hidden w-full h-px bg-orange-400"/>
            {/* Earn more info */}
            <div className="flex-1">
              <div className="overflow-hidden">
                <p className="text-orange font-bold text-sm mb-0.5">
                  🔥 Earn MORE POINTS to RANK HIGHER! 🔥 Ask homeowner for more Lock amount🔥 
                </p>
              </div>
              <p className="text-orange-100 text-xs">$50 lock = 1 pt &nbsp;·&nbsp; $100 = 2 pts &nbsp;·&nbsp; $250 = 5 pts &nbsp;·&nbsp; $500 = 10 pts</p>
            </div>
            {/* Divider */}
            <div className="w-px h-10 bg-orange-600"/>
            {/* Progress + CTA */}
            <div className="text-right min-w-[180px]">
              {(() => {
                const nextBadge = getradiePoints.badge === "Bronze" ? { name: "Silver", needed: 11 } :
                                  getradiePoints.badge === "Silver" ? { name: "Gold", needed: 26 } :
                                  getradiePoints.badge === "Gold"   ? { name: "Platinum", needed: 51 } : null;
                if (!nextBadge) return (
                  <p className="text-white font-bold text-sm">🏆 Maximum Rank Achieved!</p>
                );
                const progress = Math.min((getradiePoints.points / nextBadge.needed) * 100, 100);
                return (
                  <>
                    <p className="text-orange-100 text-xs mb-1">Next: <span className="text-white font-bold">{nextBadge.name} Badge</span></p>
                    <div className="bg-orange-200 rounded-full h-1 mb-2 w-full">
                      <div className="bg-white rounded-full h-1 transition-all" style={{ width: `${progress}%` }}/>
                    </div>
                    <p className="text-orange-100 text-xs mb-2">{getradiePoints.points}/{nextBadge.needed} points</p>
                    <Link href="/tradie-chats">
                      <button className="flex items-center gap-1.5 bg-white text-orange-600 px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-orange-50 transition-colors">
                        <MessageSquare size={12}/> Request Higher Lock
                      </button>
                    </Link>
                  </>
                );
              })()}
            </div>
          </div>


          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {statCards.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.title} className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 flex flex-col lg:flex-row items-start lg:items-center gap-2">
                  <div className={`w-8 h-8 lg:w-12 lg:h-12 rounded-xl ${s.iconBg} flex items-center justify-center flex-shrink-0`}>
                      <Icon size={16} className={s.iconColor} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-lg lg:text-2xl font-bold text-gray-900 truncate">{s.value}</div>
                      <div className="text-xs font-semibold text-gray-700 truncate">{s.title}</div>
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
                <Link href="/tradie-jobs" className="text-blue-600 text-sm font-medium flex items-center gap-1 hover:text-blue-800">
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
                  <Link href="/tradie-schedule" className="text-blue-600 text-xs font-medium hover:text-blue-800">
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
        {/* My Performance */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-base text-gray-900">📊 My Performance - {new Date().toLocaleString("en-AU", { month: "long", year: "numeric" })}</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-widest pb-2 w-1/2">Metric</th>
                    <th className="text-right text-xs font-bold text-gray-500 uppercase tracking-widest pb-2">Count</th>
                    <th className="text-right text-xs font-bold text-gray-500 uppercase tracking-widest pb-2 pl-4">Insight</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  <tr><td className="py-2.5 text-gray-600"><span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-500 inline-block"/>Jobs Available (Leads)</span></td><td className="py-2.5 text-right font-bold text-blue-600">{stats.newJobLeads}</td><td className="py-2.5 text-right text-xs text-gray-400 pl-4">Leads in your area</td></tr>
                  <tr><td className="py-2.5 text-gray-600"><span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-indigo-500 inline-block"/>Quotes Sent</span></td><td className="py-2.5 text-right font-bold text-indigo-600">{stats.quotesSent}</td><td className="py-2.5 text-right text-xs text-gray-400 pl-4">You responded</td></tr>
                  <tr><td className="py-2.5 text-gray-600"><span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red-400 inline-block"/>Jobs Missed (Not Quoted)</span></td><td className="py-2.5 text-right font-bold text-red-500">{Math.max((stats.newJobLeads - stats.quotesSent), 0)}</td><td className="py-2.5 text-right text-xs text-gray-400 pl-4">You ignored</td></tr>
                  <tr><td className="py-2.5 text-gray-600"><span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-500 inline-block"/>Quotes Accepted (Won)</span></td><td className="py-2.5 text-right font-bold text-green-600">{stats.quotesAccepted}</td><td className="py-2.5 text-right text-xs text-gray-400 pl-4">Converted to jobs</td></tr>
                  <tr><td className="py-2.5 text-gray-600"><span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red-500 inline-block"/>Quotes Rejected (Lost)</span></td><td className="py-2.5 text-right font-bold text-red-600">{stats.quotesRejected}</td><td className="py-2.5 text-right text-xs text-gray-400 pl-4">Homeowner chose another</td></tr>
                  <tr><td className="py-2.5 text-gray-600"><span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-yellow-500 inline-block"/>Quotes Pending</span></td><td className="py-2.5 text-right font-bold text-yellow-600">{stats.quotesPending}</td><td className="py-2.5 text-right text-xs text-gray-400 pl-4">Awaiting decision</td></tr>
                  <tr><td className="py-2.5 text-gray-600"><span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-600 inline-block"/>Jobs Confirmed</span></td><td className="py-2.5 text-right font-bold text-blue-700">{stats.bookingsConfirmed}</td><td className="py-2.5 text-right text-xs text-gray-400 pl-4">Active bookings</td></tr>
                  <tr><td className="py-2.5 text-gray-600"><span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-600 inline-block"/>Jobs Completed</span></td><td className="py-2.5 text-right font-bold text-green-700">{stats.bookingsCompleted}</td><td className="py-2.5 text-right text-xs text-gray-400 pl-4">Successfully done</td></tr>
                  <tr><td className="py-2.5 text-gray-600"><span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-orange-500 inline-block"/>Jobs Pending</span></td><td className="py-2.5 text-right font-bold text-orange-600">{stats.bookingsPending}</td><td className="py-2.5 text-right text-xs text-gray-400 pl-4">In progress</td></tr>
                  <tr className="border-t-2 border-gray-200"><td className="py-2.5 text-gray-700 font-semibold"><span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-purple-500 inline-block"/>Earnings This Month</span></td><td className="py-2.5 text-right font-bold text-purple-600">${stats.earnings.toLocaleString()} AUD</td><td className="py-2.5 text-right text-xs text-gray-400 pl-4">Lock amount released</td></tr>
                </tbody>
              </table>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100 grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs font-bold text-gray-600">Quote Win Rate</span>
                  <span className="text-xs font-bold text-green-600">{stats.winRate}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-green-500 rounded-full h-2 transition-all" style={{ width: `${stats.winRate}%` }}/>
                </div>
              </div>
              <div className="text-xs text-gray-500 space-y-1">
                {stats.winRate < 30 && stats.quotesSent > 0 && <p className="text-red-500">⚠️ Low win rate. Review your pricing or quote quality.</p>}
                {stats.newJobLeads > 0 && stats.quotesSent < stats.newJobLeads && <p className="text-orange-500">⚠️ Missing leads. Quote more available jobs.</p>}
                {stats.winRate >= 60 && <p className="text-green-600">✅ Excellent win rate! Keep it up.</p>}
                {stats.winRate >= 30 && stats.winRate < 60 && stats.quotesSent > 0 && <p className="text-blue-600">💡 Good performance. Keep improving your quotes.</p>}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}