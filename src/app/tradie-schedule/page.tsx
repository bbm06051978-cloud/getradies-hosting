"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowLeft, Calendar, Clock, MapPin, Phone,
  CheckCircle, AlertCircle, User, ChevronRight,
  Briefcase, Mail,
} from "lucide-react";
import { TradieSidebar } from "@/app/components/tradie/TradieSidebar";
import { TradieTopbar } from "@/app/components/tradie/TradieTopbar";

type HomeownerRef = {
  name: string; phone: string; email: string;
  suburb: string | null; state: string | null;
};

type Booking = {
  id: string; scheduledAt: string; status: string; totalAmount: number;
  job: {
    id: string; title: string; trade: string;
    suburb: string; state: string;
    user: HomeownerRef;
  };
};

type GroupedSchedule = {
  label: string;
  date: string;
  bookings: Booking[];
  isToday: boolean;
  isTomorrow: boolean;
};

export default function TradieSchedulePage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [overdue, setOverdue] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [completing, setCompleting] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/tradie-schedule")
      .then(r => r.json())
      .then(d => {
        if (d.bookings) setBookings(d.bookings);
        if (d.overdue) setOverdue(d.overdue);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleMarkDone = async (bookingId: string) => {
    if (!confirm("Mark this job as done? The homeowner will be asked to confirm.")) return;
    setCompleting(bookingId);
    try {
      const res = await fetch("/api/tradie-bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, action: "mark_done" }),
      });
      if (res.ok) {
        setBookings(prev => prev.filter(b => b.id !== bookingId));
      }
    } catch {} finally { setCompleting(null); }
  };

  // Group bookings by date
  const groupByDate = (bookings: Booking[]): GroupedSchedule[] => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const groups: Record<string, GroupedSchedule> = {};

    bookings.forEach(b => {
      const date = new Date(b.scheduledAt);
      date.setHours(0, 0, 0, 0);
      const key = date.toISOString().split("T")[0];

      if (!groups[key]) {
        const isToday = date.getTime() === today.getTime();
        const isTomorrow = date.getTime() === tomorrow.getTime();
        let label = date.toLocaleDateString("en-AU", { weekday: "long", day: "numeric", month: "long" });
        if (isToday) label = "Today — " + date.toLocaleDateString("en-AU", { day: "numeric", month: "long" });
        if (isTomorrow) label = "Tomorrow — " + date.toLocaleDateString("en-AU", { day: "numeric", month: "long" });

        groups[key] = { label, date: key, bookings: [], isToday, isTomorrow };
      }
      groups[key].bookings.push(b);
    });

    return Object.values(groups).sort((a, b) => a.date.localeCompare(b.date));
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "CONFIRMED": return { bg: "bg-green-100 text-green-700", dot: "bg-green-500", label: "Confirmed" };
      case "PENDING": return { bg: "bg-orange-100 text-orange-700", dot: "bg-orange-500", label: "Pending" };
      case "PENDING_CONFIRMATION": return { bg: "bg-yellow-100 text-yellow-700", dot: "bg-yellow-500", label: "Awaiting Confirmation" };
      default: return { bg: "bg-gray-100 text-gray-600", dot: "bg-gray-400", label: status };
    }
  };

  const grouped = groupByDate(bookings);
  const totalToday = bookings.filter(b => {
    const d = new Date(b.scheduledAt); d.setHours(0, 0, 0, 0);
    const t = new Date(); t.setHours(0, 0, 0, 0);
    return d.getTime() === t.getTime();
  }).length;

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
              <h1 className="text-2xl font-bold text-gray-900">My Schedule</h1>
              <p className="text-gray-500 text-sm mt-0.5">Your upcoming jobs and bookings</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { label: "Today", value: totalToday, color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-100" },
              { label: "Upcoming", value: bookings.length, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" },
              { label: "Overdue", value: overdue.length, color: "text-red-600", bg: "bg-red-50", border: "border-red-100" },
            ].map(s => (
              <div key={s.label} className={`${s.bg} border ${s.border} rounded-2xl p-4 text-center`}>
                <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-sm text-gray-600 font-medium mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <svg className="animate-spin h-8 w-8 text-orange-500" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
            </div>
          ) : (
            <div className="space-y-8">

              {/* Overdue */}
              {overdue.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <AlertCircle size={18} className="text-red-500" />
                    <h2 className="font-bold text-red-600">Overdue Jobs</h2>
                  </div>
                  <div className="space-y-3">
                    {overdue.map(booking => {
                      const s = getStatusStyle(booking.status);
                      return (
                        <motion.div key={booking.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                          className="bg-white rounded-2xl border-2 border-red-200 overflow-hidden">
                          <div className="p-4 flex items-start justify-between gap-4">
                            <div className="flex items-start gap-3 flex-1">
                              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                <Briefcase size={18} className="text-red-500" />
                              </div>
                              <div>
                                <h3 className="font-bold text-gray-900 text-sm">{booking.job.title}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="flex items-center gap-1 text-xs text-gray-500"><MapPin size={10} />{booking.job.suburb}, {booking.job.state}</span>
                                  <span className="flex items-center gap-1 text-xs text-gray-500"><User size={10} />{booking.job.user.name}</span>
                                </div>
                                <div className="flex items-center gap-1.5 mt-1 text-xs text-red-500 font-medium">
                                  <Clock size={11} />
                                  Was scheduled: {new Date(booking.scheduledAt).toLocaleDateString("en-AU", { day: "numeric", month: "short" })} at {new Date(booking.scheduledAt).toLocaleTimeString("en-AU", { hour: "2-digit", minute: "2-digit" })}
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <a href={`tel:${booking.job.user.phone}`}>
                                <button className="bg-red-500 hover:bg-red-600 text-white text-xs font-bold px-3 py-2 rounded-lg transition-colors flex items-center gap-1">
                                  <Phone size={12} />Call
                                </button>
                              </a>
                              <button onClick={() => handleMarkDone(booking.id)} disabled={completing === booking.id}
                                className="bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white text-xs font-bold px-3 py-2 rounded-lg transition-colors flex items-center gap-1">
                                <CheckCircle size={12} />Done
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* No upcoming */}
              {grouped.length === 0 && overdue.length === 0 && (
                <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
                  <Calendar size={48} className="text-gray-200 mx-auto mb-4" />
                  <h3 className="font-bold text-gray-700 text-lg mb-2">No upcoming jobs</h3>
                  <p className="text-gray-400 text-sm">Your confirmed bookings will appear here</p>
                  <Link href="/tradie-jobs">
                    <button className="mt-6 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-colors">
                      View Job Leads
                    </button>
                  </Link>
                </div>
              )}

              {/* Grouped schedule */}
              {grouped.map(group => (
                <div key={group.date}>
                  {/* Day header */}
                  <div className={`flex items-center gap-3 mb-4 ${group.isToday ? "text-orange-600" : "text-gray-700"}`}>
                    <div className={`w-3 h-3 rounded-full flex-shrink-0 ${group.isToday ? "bg-orange-500" : group.isTomorrow ? "bg-blue-500" : "bg-gray-300"}`} />
                    <h2 className={`font-bold text-base ${group.isToday ? "text-orange-600" : ""}`}>{group.label}</h2>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      group.isToday ? "bg-orange-100 text-orange-600" :
                      group.isTomorrow ? "bg-blue-100 text-blue-600" :
                      "bg-gray-100 text-gray-500"
                    }`}>
                      {group.bookings.length} job{group.bookings.length > 1 ? "s" : ""}
                    </span>
                  </div>

                  {/* Timeline */}
                  <div className="space-y-3 ml-4 border-l-2 border-gray-100 pl-6">
                    {group.bookings.map(booking => {
                      const s = getStatusStyle(booking.status);
                      const isExpanded = expandedId === booking.id;

                      return (
                        <motion.div key={booking.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                          className={`bg-white rounded-2xl shadow-sm border-2 overflow-hidden transition-all ${
                            group.isToday ? "border-orange-100" : "border-gray-100"
                          }`}>
                          <div className="p-4">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex items-start gap-3 flex-1">
                                {/* Time */}
                                <div className="flex-shrink-0 text-center w-16">
                                  <p className={`text-lg font-bold ${group.isToday ? "text-orange-600" : "text-gray-800"}`}>
                                    {new Date(booking.scheduledAt).toLocaleTimeString("en-AU", { hour: "2-digit", minute: "2-digit" })}
                                  </p>
                                  <p className="text-xs text-gray-400">
                                    {new Date(booking.scheduledAt).toLocaleTimeString("en-AU", { hour12: true }).split(" ")[1]}
                                  </p>
                                </div>

                                <div className="w-px h-12 bg-gray-200 flex-shrink-0 mt-1" />

                                {/* Job info */}
                                <div className="flex-1">
                                  <h3 className="font-bold text-gray-900">{booking.job.title}</h3>
                                  <div className="flex items-center gap-2 flex-wrap mt-1">
                                    <span className="bg-orange-100 text-orange-700 text-xs font-semibold px-2 py-0.5 rounded-full">{booking.job.trade}</span>
                                    <span className="flex items-center gap-1 text-xs text-gray-500"><MapPin size={10} />{booking.job.suburb}, {booking.job.state}</span>
                                  </div>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className="flex items-center gap-1 text-xs text-gray-500"><User size={10} />{booking.job.user.name}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Right */}
                              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                                <span className={`text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 ${s.bg}`}>
                                  <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                                  {s.label}
                                </span>
                                <p className="text-base font-bold text-gray-900">
                                  ${booking.totalAmount.toLocaleString()}
                                  <span className="text-xs text-gray-400 font-normal ml-1">AUD</span>
                                </p>
                              </div>
                            </div>

                            {/* Quick actions */}
                            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                              <a href={`tel:${booking.job.user.phone}`}
                                className="flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors">
                                <Phone size={12} />Call Homeowner
                              </a>
                              <a href={`https://maps.google.com/?q=${booking.job.suburb}+${booking.job.state}+Australia`} target="_blank" rel="noreferrer"
                                className="flex items-center gap-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors">
                                <MapPin size={12} />Directions
                              </a>
                              {booking.status === "CONFIRMED" && (
                                <button onClick={() => handleMarkDone(booking.id)} disabled={completing === booking.id}
                                  className="ml-auto flex items-center gap-1.5 bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors">
                                  <CheckCircle size={12} />
                                  {completing === booking.id ? "Submitting..." : "Mark Done"}
                                </button>
                              )}
                              <button onClick={() => setExpandedId(isExpanded ? null : booking.id)}
                                className="flex items-center gap-1 text-gray-400 hover:text-gray-600 text-xs ml-auto">
                                {isExpanded ? "Less" : "More"}
                                <ChevronRight size={12} className={`transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                              </button>
                            </div>
                          </div>

                          {/* Expanded details */}
                          {isExpanded && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                              className="border-t border-gray-100 bg-slate-50 px-4 py-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Homeowner Contact</p>
                                  <div className="space-y-1.5">
                                    <p className="text-sm font-semibold text-gray-900">{booking.job.user.name}</p>
                                    <a href={`tel:${booking.job.user.phone}`} className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-medium">
                                      <Phone size={13} />{booking.job.user.phone}
                                    </a>
                                    <a href={`mailto:${booking.job.user.email}`} className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-medium">
                                      <Mail size={13} />{booking.job.user.email}
                                    </a>
                                  </div>
                                </div>
                                <div>
                                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Job Location</p>
                                  <div className="flex items-start gap-2">
                                    <MapPin size={14} className="text-orange-500 mt-0.5 flex-shrink-0" />
                                    <div>
                                      <p className="text-sm font-semibold text-gray-800">{booking.job.suburb}, {booking.job.state}</p>
                                      <a href={`https://maps.google.com/?q=${booking.job.suburb}+${booking.job.state}+Australia`}
                                        target="_blank" rel="noreferrer"
                                        className="text-xs text-blue-600 hover:text-blue-800 font-medium">
                                        Open in Google Maps →
                                      </a>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {booking.status === "PENDING_CONFIRMATION" && (
                                <div className="mt-3 flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-xl px-3 py-2">
                                  <AlertCircle size={14} className="text-yellow-600" />
                                  <p className="text-xs text-yellow-700 font-semibold">Waiting for homeowner to confirm job completion</p>
                                </div>
                              )}
                            </motion.div>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
