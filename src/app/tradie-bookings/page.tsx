"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft, Briefcase, Calendar, Clock, MapPin,
  Phone, Mail, CheckCircle, XCircle, AlertCircle,
  ChevronDown, ChevronUp, DollarSign, User, Zap,
} from "lucide-react";
import { TradieSidebar } from "@/app/components/tradie/TradieSidebar";
import { TradieTopbar } from "@/app/components/tradie/TradieTopbar";

type Homeowner = { name: string; phone: string; email: string; suburb: string; state: string; };

type Booking = {
  id: string; scheduledAt: string; status: string; totalAmount: number; createdAt: string;
  homeowner?: Homeowner;
  job: { id: string; title: string; trade: string; suburb: string; state: string; description: string; aiEstimate: string | null; };
  payment: { id: string; amount: number; status: string; } | null;
};

export default function TradieBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [filter, setFilter] = useState("ALL");
  const [tradiePhoto, setTradiePhoto] = useState<string | null>(null);
  const [tradieName, setTradieName] = useState<string>("");

  useEffect(() => {
    fetch("/api/tradie/profile")
      .then(r => r.json())
      .then(d => {
        if (d.user) {
          setTradiePhoto(d.user.tradieProfile?.profilePhoto || null);
          setTradieName(d.user.tradieProfile?.businessName || d.user.name || "");
        }
      })
      .catch(() => {});

    fetch("/api/tradie-bookings")
      .then(r => r.json())
      .then(d => { if (d.bookings) setBookings(d.bookings); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const patch = async (bookingId: string, action: string) => {
    const r = await fetch("/api/tradie-bookings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookingId, action }),
    });
    return r.ok;
  };

const refetchBookings = async () => {
    try {
      const res = await fetch("/api/tradie-bookings");
      const data = await res.json();
      if (data.bookings) setBookings(data.bookings);
    } catch {}
  };

  const handleConfirm = async (bookingId: string) => {
    setBusy(bookingId);
    const ok = await patch(bookingId, "confirm").catch(() => false);
    if (ok) await refetchBookings();
    setBusy(null);
  };

  const handleMarkDone = async (bookingId: string) => {
    if (!confirm("Mark this job as done? The homeowner will be asked to confirm completion.")) return;
    setBusy(bookingId);
    const ok = await patch(bookingId, "mark_done").catch(() => false);
    if (ok) await refetchBookings();
    setBusy(null);
  };

  const getStyle = (status: string) => {
    switch (status) {
      case "CONFIRMED": return { bg: "bg-green-100 text-green-700", border: "border-green-200", icon: CheckCircle, label: "Confirmed" };
      case "PENDING": return { bg: "bg-orange-100 text-orange-700", border: "border-orange-200", icon: AlertCircle, label: "Pending" };
      case "PENDING_CONFIRMATION": return { bg: "bg-yellow-100 text-yellow-700", border: "border-yellow-300", icon: Clock, label: "Awaiting Homeowner" };
      case "COMPLETED": return { bg: "bg-blue-100 text-blue-700", border: "border-blue-200", icon: CheckCircle, label: "Completed" };
      case "CANCELLED": return { bg: "bg-red-100 text-red-700", border: "border-red-200", icon: XCircle, label: "Cancelled" };
      case "DISPUTED": return { bg: "bg-red-200 text-red-800", border: "border-red-400", icon: AlertCircle, label: "Disputed" };
      default: return { bg: "bg-gray-100 text-gray-700", border: "border-gray-200", icon: Clock, label: status };
    }
  };

  const filtered = filter === "ALL" ? bookings : bookings.filter(b => b.status === filter);
  const upcoming = bookings.filter(b => b.status === "CONFIRMED" && new Date(b.scheduledAt) >= new Date()).length;
  const completed = bookings.filter(b => b.status === "COMPLETED").length;
  const totalEarnings = bookings.filter(b => b.status === "COMPLETED").reduce((sum, b) => sum + b.totalAmount, 0);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <TradieSidebar />
      <main className="flex-1 flex flex-col min-w-0">
        <TradieTopbar />
        <div className="p-8 flex-1">

          <div className="flex items-center gap-4 mb-8">
            <Link href="/dashboard-tradie" className="text-gray-400 hover:text-gray-600"><ArrowLeft size={20} /></Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
              <p className="text-gray-500 text-sm mt-0.5">Manage your confirmed jobs and schedule</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { label: "Upcoming Jobs", value: upcoming, color: "text-green-600", bg: "bg-green-50", border: "border-green-100", icon: Calendar },
              { label: "Completed Jobs", value: completed, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100", icon: CheckCircle },
              { label: "Total Earned", value: `$${totalEarnings.toLocaleString()}`, color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-100", icon: DollarSign },
            ].map(s => {
              const Icon = s.icon;
              return (
                <div key={s.label} className={`${s.bg} border ${s.border} rounded-2xl p-4 flex items-center gap-4`}>
                  <div className={`w-12 h-12 rounded-xl ${s.bg} flex items-center justify-center flex-shrink-0`}>
                    <Icon size={22} className={s.color} />
                  </div>
                  <div>
                    <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                    <p className="text-sm text-gray-600 font-medium">{s.label}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex gap-2 mb-6 bg-white rounded-xl p-1 shadow-sm border border-gray-100 w-fit flex-wrap">
            {["ALL", "CONFIRMED", "PENDING_CONFIRMATION", "COMPLETED", "CANCELLED", "DISPUTED"].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${filter === f ? "bg-orange-500 text-white" : "text-gray-500 hover:text-gray-700"}`}>
                {f === "ALL" ? "All" : f === "PENDING_CONFIRMATION" ? "Awaiting" : f.charAt(0) + f.slice(1).toLowerCase()}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <svg className="animate-spin h-8 w-8 text-orange-500" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
              <Calendar size={48} className="text-gray-200 mx-auto mb-4" />
              <h3 className="font-bold text-gray-700 text-lg mb-2">No bookings found</h3>
              <p className="text-gray-400 text-sm">Send quotes to homeowners to get your first booking</p>
              <Link href="/dashboard-tradie">
                <button className="mt-6 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-colors">
                  View Job Leads
                </button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map(booking => {
                const s = getStyle(booking.status);
                const Icon = s.icon;
                const isExpanded = expandedId === booking.id;

                return (
                  <motion.div key={booking.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                    className={`bg-white rounded-2xl shadow-sm border-2 overflow-hidden ${s.border}`}>
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Briefcase size={20} className="text-orange-500" />
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900 text-base">{booking.job?.title}</h3>
                            <div className="flex items-center gap-2 flex-wrap mt-1">
                              <span className="bg-orange-100 text-orange-700 text-xs font-semibold px-2 py-0.5 rounded-full">{booking.job?.trade}</span>
                              <span className="flex items-center gap-1 text-xs text-gray-500"><MapPin size={11} />{booking.job?.suburb}, {booking.job?.state}</span>
                            </div>
                            <div className="flex items-center gap-4 mt-2 flex-wrap">
                              <div className="flex items-center gap-1.5 text-sm text-gray-700">
                                <Calendar size={14} className="text-orange-500" />
                                <span className="font-medium">{new Date(booking.scheduledAt).toLocaleDateString("en-AU", { weekday: "short", day: "numeric", month: "long", year: "numeric" })}</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-sm text-gray-700">
                                <Clock size={14} className="text-orange-500" />
                                <span className="font-medium">{new Date(booking.scheduledAt).toLocaleTimeString("en-AU", { hour: "2-digit", minute: "2-digit" })}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full ${s.bg}`}><Icon size={12} />{s.label}</span>
                          <div className="flex items-center gap-1">
                            <DollarSign size={16} className="text-gray-400" />
                            <span className="text-xl font-bold text-gray-900">{booking.totalAmount.toLocaleString()}</span>
                            <span className="text-xs text-gray-400">AUD</span>
                          </div>
                        </div>
                      </div>

                      {/* Tradie + Homeowner row */}
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-2">
                          {/* Tradie photo */}
                          <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 border-2 border-orange-200">
                            {tradiePhoto ? (
                              <img src={tradiePhoto} alt={tradieName} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full bg-orange-500 flex items-center justify-center">
                                <span className="text-white text-xs font-bold">{tradieName.charAt(0).toUpperCase() || "T"}</span>
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-800">{booking.homeowner?.name || "Homeowner"}</p>
                            <p className="text-xs text-gray-400">{booking.homeowner?.suburb}, {booking.homeowner?.state}</p>
                          </div>
                        </div>
                        <button onClick={() => setExpandedId(isExpanded ? null : booking.id)}
                          className="flex items-center gap-1 text-orange-500 text-xs font-semibold hover:text-orange-700">
                          {isExpanded ? "Less" : "More details"}
                          {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </button>
                      </div>
                    </div>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                          className="border-t border-gray-100 bg-slate-50 px-5 py-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Homeowner Contact</p>
                              <div className="space-y-2">
                                {/* Homeowner avatar */}
                                <div className="flex items-center gap-2 mb-2">
                                  <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <User size={16} className="text-blue-600" />
                                  </div>
                                  <p className="text-sm font-semibold text-gray-900">{booking.homeowner?.name || "Unknown"}</p>
                                </div>
                                {booking.homeowner?.phone && (
                                  <a href={`tel:${booking.homeowner.phone}`} className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-medium">
                                    <Phone size={14} />{booking.homeowner.phone}
                                  </a>
                                )}
                                {booking.homeowner?.email && (
                                  <a href={`mailto:${booking.homeowner.email}`} className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-medium">
                                    <Mail size={14} />{booking.homeowner.email}
                                  </a>
                                )}
                              </div>
                            </div>
                            <div>
                              {booking.job?.aiEstimate && (
                                <div className="mt-3 bg-blue-50 rounded-xl p-3 border border-blue-100">
                                  <p className="text-xs text-gray-600 whitespace-pre-line leading-relaxed">
                                    {booking.job.aiEstimate.split("\n").filter(l => !l.startsWith("🔧")).join("\n")}
                                  </p>
                                </div>
                              )}
                              <div className="mt-3 bg-blue-50 border border-blue-100 rounded-xl px-3 py-2">
                                <p className="text-xs text-blue-700 font-semibold">💰 Payment Info</p>
                                <p className="text-xs text-blue-600 mt-0.5">
                                  {"📌 The lock amount of $"}{booking.totalAmount}{" AUD is held securely by GeTradie. Please collect the remaining job amount directly from the homeowner after job completion."}
                                </p>
                              </div>
                            </div>
                          </div>

                          {booking.status === "PENDING" && (
                            <div className="mt-5 pt-4 border-t border-gray-200">
                              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Job Actions</p>
                              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                onClick={() => handleConfirm(booking.id)} disabled={busy === booking.id}
                                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-6 py-3 rounded-xl font-bold text-sm transition-colors shadow-sm">
                                <CheckCircle size={16} />
                                {busy === booking.id ? "Confirming..." : "Confirm Booking"}
                              </motion.button>
                              <p className="text-xs text-gray-400 mt-2">
                                Confirm you will attend this job on the scheduled date.
                              </p>
                            </div>
                          )}

                          {booking.status === "CONFIRMED" && (
                            <div className="mt-5 pt-4 border-t border-gray-200">
                              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Job Actions</p>
                              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                onClick={() => handleMarkDone(booking.id)} disabled={busy === booking.id}
                                className="flex items-center gap-2 bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white px-6 py-3 rounded-xl font-bold text-sm transition-colors shadow-sm">
                                <CheckCircle size={16} />
                                {busy === booking.id ? "Submitting..." : "Mark Job as Done"}
                              </motion.button>
                              <p className="text-xs text-gray-400 mt-2">
                                This will notify the homeowner to confirm completion. Payment releases after their confirmation.
                              </p>
                            </div>
                          )}

                          {booking.status === "PENDING_CONFIRMATION" && (
                            <div className="mt-4 flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3">
                              <Clock size={16} className="text-yellow-600 flex-shrink-0" />
                              <p className="text-sm text-yellow-700 font-semibold">Waiting for homeowner to confirm job completion</p>
                            </div>
                          )}

                          {booking.status === "COMPLETED" && (
                            <div className="mt-4 flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                              <CheckCircle size={16} className="text-green-500" />
                              <p className="text-sm text-green-700 font-semibold">
                                Job completed — payment of ${booking.totalAmount.toLocaleString()} AUD recorded
                              </p>
                            </div>
                          )}

                          {booking.status === "DISPUTED" && (
                            <div className="mt-4 flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                              <AlertCircle size={16} className="text-red-600 flex-shrink-0" />
                              <p className="text-sm text-red-700 font-semibold">Dispute raised — GeTradie team is reviewing this booking</p>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
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