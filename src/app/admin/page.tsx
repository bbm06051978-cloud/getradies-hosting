"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users, Briefcase, CheckCircle, AlertCircle,
  ShieldCheck, XCircle, DollarSign, BarChart2,
  LogOut, Star, Clock, MessageSquare,
} from "lucide-react";

type Stats = {
  totalHomeowners: number;
  totalTradies: number;
  totalJobs: number;
  totalQuotes: number;
  totalBookings: number;
  completedJobs: number;
  disputedJobs: number;
  openJobs: number;
  totalRevenue: number;
  getradieRevenue: number;
  tradieEarnings: number;
  totalTransactions: number;
};

type User = {
  id: string; name: string; email: string; role: string;
  suburb: string | null; createdAt: string;
  tradieProfile?: { businessName: string; specialty: string; isVerified: boolean; rating: number };
};

type Job = {
  id: string; title: string; trade: string; suburb: string;
  state: string; status: string; createdAt: string;
  user: { name: string };
  _count: { quotes: number };
};

type Booking = {
  id: string; status: string; totalAmount: number; createdAt: string;
  job: { title: string; user: { name: string } };
  tradieProfile: { businessName: string };
};

export default function AdminPage() {
  const [tab, setTab]         = useState("dashboard");
  const [stats, setStats]     = useState<Stats | null>(null);
  const [users, setUsers]     = useState<User[]>([]);
  const [jobs, setJobs]       = useState<Job[]>([]);
  const [disputes, setDisputes] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [userFilter, setUserFilter] = useState("ALL");
  const [jobFilter, setJobFilter]   = useState("ALL");
  const [busy, setBusy]       = useState<string | null>(null);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res  = await fetch("/api/admin");
      const data = await res.json();
      if (data.stats)    setStats(data.stats);
      if (data.users)    setUsers(data.users);
      if (data.jobs)     setJobs(data.jobs);
      if (data.disputes) setDisputes(data.disputes);
    } catch {}
    finally { setLoading(false); }
  };

  const handleVerify = async (tradieProfileId: string, verified: boolean) => {
    setBusy(tradieProfileId);
    try {
      await fetch("/api/admin", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "verify_tradie", tradieProfileId, verified }),
      });
      await fetchData();
    } catch {}
    finally { setBusy(null); }
  };

  const handleResolveDispute = async (bookingId: string) => {
    setBusy(bookingId);
    try {
      await fetch("/api/admin", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "resolve_dispute", bookingId }),
      });
      await fetchData();
    } catch {}
    finally { setBusy(null); }
  };

  const filteredUsers = userFilter === "ALL" ? users : users.filter(u => u.role === userFilter);
  const filteredJobs  = jobFilter  === "ALL" ? jobs  : jobs.filter(j => j.status === jobFilter);
  const unverifiedTradies = users.filter(u => u.role === "TRADIE" && !u.tradieProfile?.isVerified);

  const TABS = [
    { key: "dashboard",    label: "Dashboard",    icon: BarChart2   },
    { key: "users",        label: "Users",         icon: Users       },
    { key: "jobs",         label: "Jobs",          icon: Briefcase   },
    { key: "disputes",     label: "Disputes",      icon: AlertCircle },
    { key: "verification", label: "Verification",  icon: ShieldCheck },
  ];

  return (
    <div className="flex min-h-screen bg-gray-950">
      {/* Sidebar */}
      <aside className="w-56 bg-gray-900 border-r border-gray-800 flex flex-col flex-shrink-0">
        <div className="p-5 border-b border-gray-800">
          <p className="font-bold text-white text-lg">GeTradie</p>
          <p className="text-xs text-gray-400">Admin Panel</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {TABS.map(t => {
            const Icon = t.icon;
            return (
              <button key={t.key} onClick={() => setTab(t.key)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  tab === t.key ? "bg-orange-500 text-white" : "text-gray-400 hover:text-white hover:bg-gray-800"
                }`}>
                <Icon size={16}/>
                {t.label}
                {t.key === "disputes" && disputes.length > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                    {disputes.length}
                  </span>
                )}
                {t.key === "verification" && unverifiedTradies.length > 0 && (
                  <span className="ml-auto bg-yellow-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                    {unverifiedTradies.length}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
        <div className="p-3 border-t border-gray-800">
          <Link href="/dashboard">
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">
              <LogOut size={16}/> Exit Admin
            </button>
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col min-w-0 overflow-auto">
        {/* Topbar */}
        <div className="bg-gray-900 border-b border-gray-800 px-8 py-4 flex items-center justify-between">
          <h1 className="font-bold text-white text-lg capitalize">{tab}</h1>
          <button onClick={fetchData} className="text-xs text-gray-400 hover:text-white transition-colors">
            Refresh
          </button>
        </div>

        <div className="p-8">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <svg className="animate-spin h-8 w-8 text-orange-500" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
              </svg>
            </div>
          ) : (
            <>
              {/* ── DASHBOARD ── */}
              {tab === "dashboard" && stats && (
                <div className="space-y-6">
                  {/* Platform Health */}
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Platform Overview</p>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      {[
                        { label:"Homeowners",  value:stats.totalHomeowners, icon:Users,       color:"text-blue-400",   bg:"bg-blue-500/10",   border:"border-blue-500/20",   change:"Total registered" },
                        { label:"Tradies",     value:stats.totalTradies,    icon:ShieldCheck, color:"text-orange-400", bg:"bg-orange-500/10", border:"border-orange-500/20", change:"Active on platform" },
                        { label:"Jobs Posted", value:stats.totalJobs,       icon:Briefcase,   color:"text-purple-400", bg:"bg-purple-500/10", border:"border-purple-500/20", change:"All time total" },
                        { label:"Bookings",    value:stats.totalBookings,   icon:CheckCircle, color:"text-green-400",  bg:"bg-green-500/10",  border:"border-green-500/20",  change:"All time total" },
                      ].map(s => {
                        const Icon = s.icon;
                        return (
                          <div key={s.label} className={`${s.bg} border ${s.border} rounded-2xl p-5`}>
                            <div className="flex items-center justify-between mb-4">
                              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{s.label}</p>
                              <div className={`w-8 h-8 rounded-lg ${s.bg} border ${s.border} flex items-center justify-center`}>
                                <Icon size={15} className={s.color}/>
                              </div>
                            </div>
                            <p className={`text-4xl font-bold ${s.color} mb-1`}>{s.value}</p>
                            <p className="text-xs text-gray-500">{s.change}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Job Activity */}
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Job Activity</p>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      {[
                        { label:"Open Jobs",    value:stats.openJobs,      icon:Clock,        color:"text-yellow-400", bg:"bg-yellow-500/10", border:"border-yellow-500/20", desc:"Awaiting quotes"    },
                        { label:"Quotes Sent",  value:stats.totalQuotes,   icon:MessageSquare,color:"text-cyan-400",   bg:"bg-cyan-500/10",   border:"border-cyan-500/20",   desc:"Total across all jobs" },
                        { label:"Completed",    value:stats.completedJobs, icon:Star,         color:"text-green-400", bg:"bg-green-500/10",  border:"border-green-500/20",  desc:"Successfully done"  },
                        { label:"Disputes",     value:stats.disputedJobs,  icon:AlertCircle,  color:"text-red-400",   bg:"bg-red-500/10",    border:"border-red-500/20",    desc:stats.disputedJobs > 0 ? "Needs attention" : "No active disputes" },
                      ].map(s => {
                        const Icon = s.icon;
                        return (
                          <div key={s.label} className={`${s.bg} border ${s.border} rounded-2xl p-5`}>
                            <div className="flex items-center justify-between mb-4">
                              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{s.label}</p>
                              <div className={`w-8 h-8 rounded-lg ${s.bg} border ${s.border} flex items-center justify-center`}>
                                <Icon size={15} className={s.color}/>
                              </div>
                            </div>
                            <p className={`text-4xl font-bold ${s.color} mb-1`}>{s.value}</p>
                            <p className={`text-xs ${s.label === "Disputes" && stats.disputedJobs > 0 ? "text-red-400 font-semibold" : "text-gray-500"}`}>{s.desc}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

{/* Revenue */}
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Revenue</p>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      {[
                        { label:"Total Collected",    value:`$${stats.totalRevenue.toFixed(2)}`,    icon:DollarSign, color:"text-green-400",  bg:"bg-green-500/10",  border:"border-green-500/20",  desc:"All lock amounts" },
                        { label:"GeTradie Revenue",   value:`$${stats.getradieRevenue.toFixed(2)}`, icon:DollarSign, color:"text-orange-400", bg:"bg-orange-500/10", border:"border-orange-500/20", desc:"Platform fees earned" },
                        { label:"Tradie Earnings",    value:`$${stats.tradieEarnings.toFixed(2)}`,  icon:DollarSign, color:"text-blue-400",   bg:"bg-blue-500/10",   border:"border-blue-500/20",   desc:"Released to tradies" },
                        { label:"Transactions",       value:stats.totalTransactions,                icon:CheckCircle,color:"text-purple-400", bg:"bg-purple-500/10", border:"border-purple-500/20", desc:"Completed payments" },
                      ].map(s => {
                        const Icon = s.icon;
                        return (
                          <div key={s.label} className={`${s.bg} border ${s.border} rounded-2xl p-5`}>
                            <div className="flex items-center justify-between mb-4">
                              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{s.label}</p>
                              <div className={`w-8 h-8 rounded-lg ${s.bg} border ${s.border} flex items-center justify-center`}>
                                <Icon size={15} className={s.color}/>
                              </div>
                            </div>
                            <p className={`text-3xl font-bold ${s.color} mb-1`}>{s.value}</p>
                            <p className="text-xs text-gray-500">{s.desc}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Quick actions */}
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Quick Actions</p>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                      {[
                        { label:"View Disputes",     action: () => setTab("disputes"),     color:"bg-red-500/10 border-red-500/20 hover:bg-red-500/20 text-red-400",     show: stats.disputedJobs > 0, badge: stats.disputedJobs },
                        { label:"Verify Tradies",    action: () => setTab("verification"), color:"bg-yellow-500/10 border-yellow-500/20 hover:bg-yellow-500/20 text-yellow-400", show: true, badge: 0 },
                        { label:"View All Jobs",     action: () => setTab("jobs"),         color:"bg-purple-500/10 border-purple-500/20 hover:bg-purple-500/20 text-purple-400", show: true, badge: 0 },
                        { label:"View All Users",    action: () => setTab("users"),        color:"bg-blue-500/10 border-blue-500/20 hover:bg-blue-500/20 text-blue-400",   show: true, badge: 0 },
                      ].map(a => (
                        <button key={a.label} onClick={a.action}
                          className={`border rounded-xl p-4 text-left transition-colors ${a.color}`}>
                          <p className="font-bold text-sm">{a.label}</p>
                          {a.badge > 0 && (
                            <p className="text-xs mt-1 opacity-75">{a.badge} pending</p>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ── USERS ── */}
              {tab === "users" && (
                <div>
                  <div className="flex gap-2 mb-5">
                    {["ALL","HOMEOWNER","TRADIE"].map(f => (
                      <button key={f} onClick={() => setUserFilter(f)}
                        className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
                          userFilter === f ? "bg-orange-500 text-white" : "bg-gray-800 text-gray-400 hover:text-white"
                        }`}>
                        {f === "ALL" ? "All" : f.charAt(0) + f.slice(1).toLowerCase()}s
                        <span className="ml-1.5 text-xs opacity-70">
                          ({f === "ALL" ? users.length : users.filter(u => u.role === f).length})
                        </span>
                      </button>
                    ))}
                  </div>
                  <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-800">
                          <th className="text-left px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-widest">Name</th>
                          <th className="text-left px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-widest">Email</th>
                          <th className="text-left px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-widest">Role</th>
                          <th className="text-left px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-widest">Location</th>
                          <th className="text-left px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-widest">Joined</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map((u, i) => (
                          <tr key={u.id} className={`border-b border-gray-800 ${i % 2 === 0 ? "bg-gray-900" : "bg-gray-900/50"}`}>
                            <td className="px-5 py-3">
                              <p className="text-sm font-semibold text-white">{u.name}</p>
                              {u.tradieProfile && (
                                <p className="text-xs text-orange-400">{u.tradieProfile.businessName}</p>
                              )}
                            </td>
                            <td className="px-5 py-3 text-sm text-gray-400">{u.email}</td>
                            <td className="px-5 py-3">
                              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                                u.role === "TRADIE" ? "bg-orange-500/20 text-orange-400" :
                                u.role === "ADMIN"  ? "bg-red-500/20 text-red-400" :
                                "bg-blue-500/20 text-blue-400"
                              }`}>{u.role}</span>
                            </td>
                            <td className="px-5 py-3 text-sm text-gray-400">{u.suburb || "—"}</td>
                            <td className="px-5 py-3 text-xs text-gray-500">
                              {new Date(u.createdAt).toLocaleDateString("en-AU", { day:"numeric", month:"short", year:"numeric" })}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ── JOBS ── */}
              {tab === "jobs" && (
                <div>
                  <div className="flex gap-2 mb-5 flex-wrap">
                    {["ALL","OPEN","QUOTED","BOOKED","COMPLETED","CANCELLED"].map(f => (
                      <button key={f} onClick={() => setJobFilter(f)}
                        className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
                          jobFilter === f ? "bg-orange-500 text-white" : "bg-gray-800 text-gray-400 hover:text-white"
                        }`}>
                        {f === "ALL" ? "All" : f.charAt(0) + f.slice(1).toLowerCase()}
                      </button>
                    ))}
                  </div>
                  <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-800">
                          <th className="text-left px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-widest">Job</th>
                          <th className="text-left px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-widest">Homeowner</th>
                          <th className="text-left px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-widest">Trade</th>
                          <th className="text-left px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                          <th className="text-left px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-widest">Quotes</th>
                          <th className="text-left px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-widest">Posted</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredJobs.map((j, i) => (
                          <tr key={j.id} className={`border-b border-gray-800 ${i % 2 === 0 ? "bg-gray-900" : "bg-gray-900/50"}`}>
                            <td className="px-5 py-3 text-sm font-semibold text-white">{j.title}</td>
                            <td className="px-5 py-3 text-sm text-gray-400">{j.user.name}</td>
                            <td className="px-5 py-3 text-xs text-orange-400 font-semibold">{j.trade}</td>
                            <td className="px-5 py-3">
                              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                                j.status === "OPEN"      ? "bg-blue-500/20 text-blue-400" :
                                j.status === "BOOKED"    ? "bg-purple-500/20 text-purple-400" :
                                j.status === "COMPLETED" ? "bg-green-500/20 text-green-400" :
                                j.status === "CANCELLED" ? "bg-red-500/20 text-red-400" :
                                "bg-yellow-500/20 text-yellow-400"
                              }`}>{j.status}</span>
                            </td>
                            <td className="px-5 py-3 text-sm text-gray-400">{j._count.quotes}</td>
                            <td className="px-5 py-3 text-xs text-gray-500">
                              {new Date(j.createdAt).toLocaleDateString("en-AU", { day:"numeric", month:"short" })}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ── DISPUTES ── */}
              {tab === "disputes" && (
                <div className="space-y-4">
                  {disputes.length === 0 ? (
                    <div className="bg-gray-900 rounded-2xl border border-gray-800 p-12 text-center">
                      <CheckCircle size={48} className="text-gray-700 mx-auto mb-4"/>
                      <p className="text-gray-400">No active disputes</p>
                    </div>
                  ) : disputes.map(d => (
                    <div key={d.id} className="bg-gray-900 rounded-2xl border border-red-900 p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-bold text-white">{d.job.title}</h3>
                          <p className="text-sm text-gray-400 mt-1">
                            Homeowner: {d.job.user.name} · Tradie: {d.tradieProfile.businessName}
                          </p>
                          <p className="text-sm text-gray-400">Amount: ${d.totalAmount}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Raised: {new Date(d.createdAt).toLocaleDateString("en-AU")}
                          </p>
                        </div>
                        <button onClick={() => handleResolveDispute(d.id)} disabled={busy === d.id}
                          className="bg-green-600 hover:bg-green-700 disabled:bg-green-900 text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2">
                          <CheckCircle size={13}/>
                          {busy === d.id ? "Resolving..." : "Mark Resolved"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* ── VERIFICATION ── */}
              {tab === "verification" && (
                <div className="space-y-4">
                  {unverifiedTradies.length === 0 ? (
                    <div className="bg-gray-900 rounded-2xl border border-gray-800 p-12 text-center">
                      <ShieldCheck size={48} className="text-gray-700 mx-auto mb-4"/>
                      <p className="text-gray-400">All tradies are verified</p>
                    </div>
                  ) : unverifiedTradies.map(u => (
                    <div key={u.id} className="bg-gray-900 rounded-2xl border border-yellow-900 p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-bold text-white">{u.tradieProfile?.businessName}</h3>
                          <p className="text-sm text-gray-400">{u.name} · {u.email}</p>
                          <p className="text-sm text-orange-400 font-semibold">{u.tradieProfile?.specialty}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Joined: {new Date(u.createdAt).toLocaleDateString("en-AU")}
                          </p>
                        </div>
                        <button
                          onClick={() => u.tradieProfile && handleVerify(u.id, true)}
                          disabled={busy === u.id}
                          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-900 text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2">
                          <ShieldCheck size={13}/>
                          {busy === u.id ? "Verifying..." : "Verify Tradie"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
