"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft, Briefcase, Calendar, Clock, MapPin,
  Phone, Mail, Star, ShieldCheck, CheckCircle,
  XCircle, AlertCircle, ChevronDown, ChevronUp,
} from "lucide-react";
import { Sidebar } from "@/app/components/dashboard/Sidebar";
import { Topbar } from "@/app/components/dashboard/Topbar";

type Booking = {
  id: string; scheduledAt: string; status: string; totalAmount: number; createdAt: string;
  job: { id: string; title: string; trade: string; suburb: string; state: string; description: string; };
  tradieProfile: { businessName: string; specialty: string; rating: number; totalReviews: number; isVerified: boolean; user: { name: string; phone: string; email: string }; };
};

type StatusStyle = {
  bg: string; border: string; card: string; icon: typeof CheckCircle; label: string;
};

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [rescheduling, setRescheduling] = useState<string | null>(null);
  const [newDate, setNewDate] = useState("");
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    fetch("/api/bookings").then(r => r.json()).then(d => { if (d.bookings) setBookings(d.bookings); }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const patch = async (bookingId: string, action: string, extra?: object) => {
    const r = await fetch("/api/bookings", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ bookingId, action, ...extra }) });
    return r.ok;
  };

  const updateStatus = (id: string, status: string) => setBookings(p => p.map(b => b.id === id ? { ...b, status } : b));

  const handleCancel = async (id: string) => {
    if (!confirm("Cancel this booking?")) return;
    setBusy(id);
    if (await patch(id, "cancel").catch(() => false)) updateStatus(id, "CANCELLED");
    setBusy(null);
  };

  const handleReschedule = async (id: string) => {
    if (!newDate) return;
    setRescheduling(id);
    if (await patch(id, "reschedule", { scheduledAt: newDate }).catch(() => false)) {
      setBookings(p => p.map(b => b.id === id ? { ...b, scheduledAt: newDate } : b));
      setNewDate(""); setExpandedId(null);
    }
    setRescheduling(null);
  };

  const refetchBookings = async () => {
    try {
      const res = await fetch("/api/bookings");
      const data = await res.json();
      if (data.bookings) setBookings(data.bookings);
    } catch {}
  };

  const handleConfirm = async (id: string) => {
    if (!confirm("Confirm job completed to your satisfaction?")) return;
    setBusy(id);
    if (await patch(id, "confirm_complete").catch(() => false)) await refetchBookings();
    setBusy(null);
  };

  const handleDispute = async (id: string) => {
    if (!confirm("Raise a dispute? GeTradie team will review within 24 hours.")) return;
    setBusy(id);
    if (await patch(id, "dispute").catch(() => false)) await refetchBookings();
    setBusy(null);
  };

  const getStyle = (status: string): StatusStyle => {
    switch (status) {
      case "CONFIRMED": return { bg: "bg-green-100 text-green-700", border: "border-green-400", card: "bg-green-50", icon: CheckCircle, label: "Confirmed" };
      case "PENDING": return { bg: "bg-orange-100 text-orange-700", border: "border-orange-300", card: "bg-orange-50", icon: AlertCircle, label: "Pending" };
      case "PENDING_CONFIRMATION": return { bg: "bg-orange-100 text-orange-700", border: "border-orange-300", card: "bg-orange-50", icon: Clock, label: "Please Confirm" };
      case "COMPLETED": return { bg: "bg-blue-100 text-blue-700", border: "border-blue-200", card: "bg-white", icon: CheckCircle, label: "Completed" };
      case "CANCELLED": return { bg: "bg-gray-100 text-gray-500", border: "border-gray-200", card: "bg-gray-100", icon: XCircle, label: "Cancelled" };
      case "DISPUTED": return { bg: "bg-orange-100 text-orange-700", border: "border-orange-300", card: "bg-orange-50", icon: AlertCircle, label: "Disputed" };
      default: return { bg: "bg-gray-100 text-gray-700", border: "border-gray-200", card: "bg-white", icon: Clock, label: status };
    }
  };

  const filtered = filter === "ALL" ? bookings : bookings.filter(b => b.status === filter);
  const upcoming = bookings.filter(b => b.status === "CONFIRMED" && new Date(b.scheduledAt) >= new Date()).length;
  const completed = bookings.filter(b => b.status === "COMPLETED").length;
  const cancelled = bookings.filter(b => b.status === "CANCELLED").length;

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <div className="p-8 flex-1">
          <div className="flex items-center gap-4 mb-8">
	<Link href="/my-jobs?filter=ALL" className="text-gray-400 hover:text-gray-600">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
              <p className="text-gray-500 text-sm mt-0.5">Manage your confirmed tradie bookings</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { label: "Upcoming", value: upcoming, color: "text-green-600", bg: "bg-green-50", border: "border-green-100" },
              { label: "Completed", value: completed, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" },
              { label: "Cancelled", value: cancelled, color: "text-red-500", bg: "bg-red-50", border: "border-red-100" },
            ].map(s => (
              <div key={s.label} className={`${s.bg} border ${s.border} rounded-2xl p-4 text-center`}>
                <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-sm text-gray-600 font-medium mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="flex gap-2 mb-6 bg-white rounded-xl p-1 shadow-sm border border-gray-100 w-fit flex-wrap">
            {["ALL", "CONFIRMED", "PENDING_CONFIRMATION", "COMPLETED", "CANCELLED", "DISPUTED"].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${filter === f ? "bg-blue-900 text-white" : "text-gray-500 hover:text-gray-700"}`}>
                {f === "ALL" ? "All" : f === "PENDING_CONFIRMATION" ? "To Confirm" : f.charAt(0) + f.slice(1).toLowerCase()}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <svg className="animate-spin h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
              <Calendar size={48} className="text-gray-200 mx-auto mb-4" />
              <h3 className="font-bold text-gray-700 text-lg mb-2">No bookings found</h3>
              <p className="text-gray-400 text-sm">Accept a quote to create your first booking</p>
              <Link href="/my-quotes">
                <button className="mt-6 bg-blue-900 hover:bg-blue-800 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-colors">View Quotes</button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map(booking => {
                const st = getStyle(booking.status);
                const Icon = st.icon;
                const isExpanded = expandedId === booking.id;
                const isPast = new Date(booking.scheduledAt) < new Date();
                return (
                  <motion.div key={booking.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                    className={`${st.card} rounded-2xl shadow-sm border-2 overflow-hidden ${st.border}`}>
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Briefcase size={20} className="text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900 text-base">{booking.job?.title}</h3>
                            <div className="flex items-center gap-2 flex-wrap mt-1">
                              <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded-full">{booking.job?.trade}</span>
                              <span className="flex items-center gap-1 text-xs text-gray-500"><MapPin size={11} />{booking.job?.suburb}, {booking.job?.state}</span>
                            </div>
                            <div className="flex items-center gap-4 mt-2">
                              <div className="flex items-center gap-1.5 text-sm text-gray-700">
                                <Calendar size={14} className="text-blue-500" />
                                <span className="font-medium">{new Date(booking.scheduledAt).toLocaleDateString("en-AU", { weekday: "short", day: "numeric", month: "long", year: "numeric" })}</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-sm text-gray-700">
                                <Clock size={14} className="text-blue-500" />
                                <span className="font-medium">{new Date(booking.scheduledAt).toLocaleTimeString("en-AU", { hour: "2-digit", minute: "2-digit" })}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full ${st.bg}`}><Icon size={12} />{st.label}</span>
                          <p className="text-xl font-bold text-gray-900">${booking.totalAmount.toLocaleString()}<span className="text-xs text-gray-400 font-normal ml-1">AUD</span></p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-blue-900 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-bold">{booking.tradieProfile?.businessName?.charAt(0) || "T"}</span>
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <p className="font-semibold text-gray-900 text-sm">{booking.tradieProfile?.businessName || "Tradie"}</p>
                              {booking.tradieProfile?.isVerified && <ShieldCheck size={13} className="text-green-500" />}
                            </div>
                            <div className="flex items-center gap-1">
                              <Star size={11} className="text-yellow-400 fill-yellow-400" />
                              <span className="text-xs text-gray-500">{booking.tradieProfile?.rating?.toFixed(1) || "0.0"} ({booking.tradieProfile?.totalReviews || 0} reviews)</span>
                            </div>
                          </div>
                        </div>
                        <button onClick={() => setExpandedId(isExpanded ? null : booking.id)} className="flex items-center gap-1 text-blue-600 text-xs font-semibold hover:text-blue-800">
                          {isExpanded ? "Less" : "More details"}
                          {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </button>
                      </div>
                    </div>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                          className="border-t border-gray-200 bg-white bg-opacity-60 px-5 py-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Tradie Contact</p>
                              <div className="space-y-2">
                                <p className="text-sm text-gray-700 font-medium">{booking.tradieProfile?.user?.name}</p>
                                <a href={`tel:${booking.tradieProfile?.user?.phone}`} className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-medium">
                                  <Phone size={14} />{booking.tradieProfile?.user?.phone}
                                </a>
                                <a href={`mailto:${booking.tradieProfile?.user?.email}`} className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-medium">
                                  <Mail size={14} />{booking.tradieProfile?.user?.email}
                                </a>
                              </div>
                            </div>
                            <div>
                              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Job Description</p>
                              <p className="text-sm text-gray-600 leading-relaxed">{booking.job?.description || "No description provided."}</p>
                            </div>
                          </div>

                          {booking.status === "PENDING_CONFIRMATION" && (
                            <div className="mt-5 pt-4 border-t border-gray-200">
                              <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3 mb-4">
                                <p className="text-sm font-bold text-yellow-800 mb-1">🔔 Tradie says the job is done!</p>
                                <p className="text-xs text-yellow-700">Please confirm if you are satisfied, or raise a dispute if there are issues.</p>
                              </div>
                              <div className="flex gap-3">
                                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                  onClick={() => handleConfirm(booking.id)} disabled={busy === booking.id}
                                  className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white py-3 rounded-xl font-bold text-sm transition-colors">
                                  <CheckCircle size={15} />Yes, Job Complete
                                </motion.button>
                                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                  onClick={() => handleDispute(booking.id)} disabled={busy === booking.id}
                                  className="flex-1 flex items-center justify-center gap-2 border-2 border-red-300 hover:border-red-500 text-red-600 hover:text-red-800 py-3 rounded-xl font-bold text-sm transition-colors">
                                  <AlertCircle size={15} />Raise a Dispute
                                </motion.button>
                              </div>
                            </div>
                          )}

                          {booking.status === "CONFIRMED" && !isPast && (
                            <div className="mt-5 pt-4 border-t border-gray-200">
                              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Actions</p>
                              <div className="flex flex-col sm:flex-row gap-3">
                                <div className="flex-1 flex gap-2">
                                  <input type="datetime-local" value={newDate} onChange={e => setNewDate(e.target.value)}
                                    min={new Date().toISOString().slice(0, 16)}
                                    className="flex-1 border border-gray-200 focus:border-blue-400 rounded-xl px-3 py-2 text-sm outline-none transition-colors" />
                                  <button onClick={() => handleReschedule(booking.id)} disabled={!newDate || rescheduling === booking.id}
                                    className="bg-blue-900 hover:bg-blue-800 disabled:bg-gray-300 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors whitespace-nowrap">
                                    {rescheduling === booking.id ? "Saving..." : "Reschedule"}
                                  </button>
                                </div>
                                <button onClick={() => handleCancel(booking.id)} disabled={busy === booking.id}
                                  className="flex items-center gap-2 border-2 border-red-200 hover:border-red-400 text-red-500 hover:text-red-700 px-4 py-2 rounded-xl text-sm font-semibold transition-colors">
                                  <XCircle size={15} />{busy === booking.id ? "Cancelling..." : "Cancel Booking"}
                                </button>
                              </div>
                            </div>
                          )}

                          {booking.status === "COMPLETED" && (
                            <div className="mt-4 flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                              <CheckCircle size={16} className="text-green-500" />
                              <p className="text-sm text-green-700 font-semibold">Job completed — thank you for using GeTradie!</p>
                            </div>
                          )}

                          {booking.status === "DISPUTED" && (
                            <div className="mt-4 flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                              <AlertCircle size={16} className="text-red-600 flex-shrink-0" />
                              <p className="text-sm text-red-700 font-semibold">Dispute raised — GeTradie team will contact you within 24 hours</p>
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