"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ChevronLeft, ChevronRight, Calendar, Clock,
  MapPin, User, MessageSquare, Navigation, CheckCircle, AlertCircle,
} from "lucide-react";
import { TradieSidebar } from "@/app/components/tradie/TradieSidebar";
import { TradieTopbar } from "@/app/components/tradie/TradieTopbar";

type Booking = {
  id: string; scheduledAt: string; status: string; totalAmount: number;
  job: { id: string; title: string; trade: string; suburb: string; state: string; };
  homeowner?: { name: string; phone: string; email: string; suburb: string; state: string; };
};

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function getWeekDays(date: Date): Date[] {
  const day = date.getDay();
  const monday = new Date(date);
  monday.setDate(date.getDate() - day + (day === 0 ? -6 : 1));
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

function isSameDay(a: Date, b: Date) {
  return a.getDate() === b.getDate() &&
    a.getMonth() === b.getMonth() &&
    a.getFullYear() === b.getFullYear();
}

export default function TradieSchedulePage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading]   = useState(true);
  const [weekStart, setWeekStart] = useState(() => {
    const today = new Date();
    const days = getWeekDays(today);
    return days[0];
  });

  useEffect(() => {
    fetch("/api/tradie-bookings")
      .then(r => r.json())
      .then(d => { if (d.bookings) setBookings(d.bookings); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const weekDays = getWeekDays(weekStart);

  const prevWeek = () => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() - 7);
    setWeekStart(getWeekDays(d)[0]);
  };

  const nextWeek = () => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + 7);
    setWeekStart(getWeekDays(d)[0]);
  };

  const goToday = () => {
    setWeekStart(getWeekDays(new Date())[0]);
  };

  const getBookingsForDay = (day: Date) =>
    bookings
      .filter(b => ["CONFIRMED", "IN_PROGRESS", "PENDING"].includes(b.status))
      .filter(b => isSameDay(new Date(b.scheduledAt), day))
      .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());

  const totalThisWeek = weekDays.reduce((sum, day) => sum + getBookingsForDay(day).length, 0);
  const today = new Date();

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "CONFIRMED":   return { bg: "bg-green-500/10 border-green-500/30",  dot: "bg-green-400",  label: "Confirmed",   text: "text-green-600" };
      case "IN_PROGRESS": return { bg: "bg-yellow-500/10 border-yellow-500/30", dot: "bg-yellow-400", label: "In Progress", text: "text-yellow-600" };
      case "PENDING":     return { bg: "bg-blue-500/10 border-blue-500/30",    dot: "bg-blue-400",   label: "Pending",     text: "text-blue-600" };
      default:            return { bg: "bg-gray-100 border-gray-200",           dot: "bg-gray-400",   label: status,        text: "text-gray-600" };
    }
  };

  const weekLabel = `${DAYS[weekDays[0].getDay()]} ${weekDays[0].getDate()} ${MONTHS[weekDays[0].getMonth()]} — ${DAYS[weekDays[6].getDay()]} ${weekDays[6].getDate()} ${MONTHS[weekDays[6].getMonth()]} ${weekDays[6].getFullYear()}`;

  return (
    <div className="flex min-h-screen bg-slate-50">
      <TradieSidebar/>
      <main className="flex-1 flex flex-col min-w-0">
        <TradieTopbar/>
        <div className="p-8">

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Schedule</h1>
              <p className="text-gray-500 text-sm mt-0.5">
                {totalThisWeek === 0 ? "No jobs this week" : `${totalThisWeek} job${totalThisWeek !== 1 ? "s" : ""} this week`}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={goToday}
                className="px-4 py-2 text-sm font-semibold border border-gray-200 rounded-xl hover:border-orange-300 text-gray-600 transition-colors">
                Today
              </button>
              <div className="flex items-center gap-1">
                <button onClick={prevWeek}
                  className="w-9 h-9 rounded-xl border border-gray-200 hover:border-orange-300 flex items-center justify-center transition-colors">
                  <ChevronLeft size={16} className="text-gray-600"/>
                </button>
                <button onClick={nextWeek}
                  className="w-9 h-9 rounded-xl border border-gray-200 hover:border-orange-300 flex items-center justify-center transition-colors">
                  <ChevronRight size={16} className="text-gray-600"/>
                </button>
              </div>
            </div>
          </div>

          {/* Week label */}
          <div className="flex items-center gap-2 mb-5">
            <Calendar size={15} className="text-orange-500"/>
            <span className="text-sm font-semibold text-gray-700">{weekLabel}</span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <svg className="animate-spin h-8 w-8 text-orange-500" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
              </svg>
            </div>
          ) : (
            <div className="space-y-3">
              {weekDays.map(day => {
                const dayBookings = getBookingsForDay(day);
                const isToday     = isSameDay(day, today);
                const isPast      = day < today && !isToday;

                return (
                  <div key={day.toISOString()}
                    className={`bg-white rounded-2xl border transition-all ${
                      isToday ? "border-orange-300 shadow-md" : "border-gray-100"
                    }`}>
                    {/* Day header */}
                    <div className={`flex items-center gap-3 px-5 py-3 border-b ${
                      isToday ? "border-orange-100 bg-orange-50/50 rounded-t-2xl" : "border-gray-100"
                    }`}>
                      <div className={`w-10 h-10 rounded-xl flex flex-col items-center justify-center flex-shrink-0 ${
                        isToday ? "bg-orange-500 text-white" : isPast ? "bg-gray-100 text-gray-400" : "bg-blue-50 text-blue-700"
                      }`}>
                        <span className="text-xs font-bold leading-none">{DAYS[day.getDay()]}</span>
                        <span className="text-lg font-bold leading-none">{day.getDate()}</span>
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm font-bold ${isToday ? "text-orange-600" : isPast ? "text-gray-400" : "text-gray-700"}`}>
                          {isToday ? "Today" : `${DAYS[day.getDay()]}, ${day.getDate()} ${MONTHS[day.getMonth()]}`}
                        </p>
                        <p className="text-xs text-gray-400">
                          {dayBookings.length === 0 ? "No jobs scheduled" : `${dayBookings.length} job${dayBookings.length !== 1 ? "s" : ""}`}
                        </p>
                      </div>
                      {dayBookings.length > 0 && (
                        <span className="bg-orange-100 text-orange-600 text-xs font-bold px-2 py-0.5 rounded-full">
                          {dayBookings.length} job{dayBookings.length !== 1 ? "s" : ""}
                        </span>
                      )}
                    </div>

                    {/* Jobs for this day */}
                    {dayBookings.length > 0 && (
                      <div className="p-4 space-y-3">
                        {dayBookings.map(booking => {
                          const s = getStatusStyle(booking.status);
                          const time = new Date(booking.scheduledAt).toLocaleTimeString("en-AU", { hour:"2-digit", minute:"2-digit" });
                          return (
                            <div key={booking.id} className={`border rounded-xl p-4 ${s.bg}`}>
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex items-start gap-3 flex-1">
                                  {/* Time */}
                                  <div className="flex-shrink-0 text-center">
                                    <div className="flex items-center gap-1.5">
                                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${s.dot}`}/>
                                      <span className="text-sm font-bold text-gray-900">{time}</span>
                                    </div>
                                    <span className={`text-xs font-semibold ${s.text}`}>{s.label}</span>
                                  </div>

                                  {/* Job info */}
                                  <div className="flex-1">
                                    <p className="font-bold text-gray-900">{booking.job.title}</p>
                                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                                      <span className="text-xs bg-orange-100 text-orange-700 font-semibold px-2 py-0.5 rounded-full">{booking.job.trade}</span>
                                      <span className="flex items-center gap-1 text-xs text-gray-500">
                                        <MapPin size={11}/>{booking.job.suburb}, {booking.job.state}
                                      </span>
                                      <span className="text-xs font-bold text-gray-700">${booking.totalAmount}</span>
                                    </div>

                                    {/* Homeowner */}
                                    {booking.homeowner && (
                                      <div className="flex items-center gap-1.5 mt-2">
                                        <User size={12} className="text-gray-400"/>
                                        <span className="text-xs text-gray-600 font-medium">{booking.homeowner.name}</span>
                                        {booking.homeowner.phone && (
                                          <span className="text-xs text-gray-400">· {booking.homeowner.phone}</span>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* Action buttons */}
                                <div className="flex flex-col gap-2 flex-shrink-0">
                                  <a href={`https://maps.google.com/?q=${booking.job.suburb}+${booking.job.state}+Australia`}
                                    target="_blank" rel="noopener noreferrer"
                                    className="flex items-center gap-1.5 bg-white border border-gray-200 hover:border-orange-300 text-gray-600 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors">
                                    <Navigation size={11}/> Directions
                                  </a>
                                  <Link href={`/tradie-chats?jobId=${booking.job.id}`}>
                                    <button className="w-full flex items-center gap-1.5 bg-white border border-gray-200 hover:border-blue-300 text-gray-600 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors">
                                      <MessageSquare size={11}/> Message
                                    </button>
                                  </Link>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
