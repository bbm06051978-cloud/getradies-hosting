"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft, Bell, CheckCircle, Trash2,
  BellOff, MessageSquare, Calendar, Briefcase,
  AlertCircle, DollarSign, X,
} from "lucide-react";
import { Sidebar } from "@/app/components/dashboard/Sidebar";
import { Topbar } from "@/app/components/dashboard/Topbar";

type Notification = {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

const getNotificationIcon = (title: string) => {
  const t = title.toLowerCase();
  if (t.includes("quote")) return { icon: DollarSign, color: "text-blue-600", bg: "bg-blue-50" };
  if (t.includes("booking")) return { icon: Calendar, color: "text-green-600", bg: "bg-green-50" };
  if (t.includes("message") || t.includes("chat")) return { icon: MessageSquare, color: "text-purple-600", bg: "bg-purple-50" };
  if (t.includes("dispute")) return { icon: AlertCircle, color: "text-red-600", bg: "bg-red-50" };
  if (t.includes("complete") || t.includes("done")) return { icon: CheckCircle, color: "text-green-600", bg: "bg-green-50" };
  if (t.includes("job")) return { icon: Briefcase, color: "text-orange-500", bg: "bg-orange-50" };
  return { icon: Bell, color: "text-blue-600", bg: "bg-blue-50" };
};

const formatTime = (dateStr: string) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  if (diff < 60000) return "Just now";
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;
  return date.toLocaleDateString("en-AU", { day: "numeric", month: "short" });
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"ALL" | "UNREAD">("ALL");
  const [markingAll, setMarkingAll] = useState(false);
  const [deletingAll, setDeletingAll] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");
      const data = await res.json();
      if (data.notifications) setNotifications(data.notifications);
    } catch {} finally { setLoading(false); }
  };

  const handleMarkRead = async (id: string) => {
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationId: id, action: "mark_read" }),
      });
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch {}
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationId: id, action: "delete" }),
      });
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch {}
  };

  const handleMarkAllRead = async () => {
    setMarkingAll(true);
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "mark_all_read" }),
      });
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch {} finally { setMarkingAll(false); }
  };

  const handleDeleteAll = async () => {
    if (!confirm("Delete all notifications?")) return;
    setDeletingAll(true);
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete_all" }),
      });
      setNotifications([]);
    } catch {} finally { setDeletingAll(false); }
  };

  const filtered = filter === "UNREAD"
    ? notifications.filter(n => !n.isRead)
    : notifications;

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <div className="p-8 flex-1 max-w-3xl mx-auto w-full">

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="text-gray-400 hover:text-gray-600">
                <ArrowLeft size={20} />
              </Link>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
                  {unreadCount > 0 && (
                    <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </div>
                <p className="text-gray-500 text-sm mt-0.5">Stay updated on your jobs and bookings</p>
              </div>
            </div>

            {/* Actions */}
            {notifications.length > 0 && (
              <div className="flex gap-2">
                {unreadCount > 0 && (
                  <button onClick={handleMarkAllRead} disabled={markingAll}
                    className="flex items-center gap-1.5 border border-gray-200 hover:border-blue-400 hover:text-blue-700 text-gray-600 px-3 py-2 rounded-xl text-xs font-semibold transition-colors">
                    <CheckCircle size={14} />
                    {markingAll ? "Marking..." : "Mark all read"}
                  </button>
                )}
                <button onClick={handleDeleteAll} disabled={deletingAll}
                  className="flex items-center gap-1.5 border border-gray-200 hover:border-red-400 hover:text-red-600 text-gray-400 px-3 py-2 rounded-xl text-xs font-semibold transition-colors">
                  <Trash2 size={14} />
                  {deletingAll ? "Clearing..." : "Clear all"}
                </button>
              </div>
            )}
          </div>

          {/* Filter tabs */}
          <div className="flex gap-2 mb-6 bg-white rounded-xl p-1 shadow-sm border border-gray-100 w-fit">
            {(["ALL", "UNREAD"] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-5 py-2 rounded-lg text-xs font-semibold transition-colors ${
                  filter === f ? "bg-blue-900 text-white" : "text-gray-500 hover:text-gray-700"
                }`}>
                {f === "ALL" ? `All (${notifications.length})` : `Unread (${unreadCount})`}
              </button>
            ))}
          </div>

          {/* Notifications */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <svg className="animate-spin h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <BellOff size={28} className="text-blue-300" />
              </div>
              <h3 className="font-bold text-gray-700 text-lg mb-2">
                {filter === "UNREAD" ? "No unread notifications" : "No notifications yet"}
              </h3>
              <p className="text-gray-400 text-sm">
                {filter === "UNREAD"
                  ? "You are all caught up!"
                  : "Notifications about your jobs, quotes and bookings will appear here."}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                {filtered.map(notification => {
                  const { icon: Icon, color, bg } = getNotificationIcon(notification.title);
                  return (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className={`bg-white rounded-2xl shadow-sm border-2 transition-all ${
                        notification.isRead ? "border-gray-100" : "border-blue-200"
                      }`}
                    >
                      <div className="p-4 flex items-start gap-4">
                        {/* Icon */}
                        <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                          <Icon size={18} className={color} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0" onClick={() => !notification.isRead && handleMarkRead(notification.id)}>
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <p className={`text-sm font-bold ${notification.isRead ? "text-gray-700" : "text-gray-900"}`}>
                                  {notification.title}
                                </p>
                                {!notification.isRead && (
                                  <span className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0" />
                                )}
                              </div>
                              <p className="text-sm text-gray-500 mt-0.5 leading-relaxed">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-400 mt-1.5">
                                {formatTime(notification.createdAt)}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 flex-shrink-0">
                          {!notification.isRead && (
                            <button
                              onClick={() => handleMarkRead(notification.id)}
                              title="Mark as read"
                              className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500 transition-colors"
                            >
                              <CheckCircle size={15} />
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(notification.id)}
                            title="Delete"
                            className="p-1.5 rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-500 transition-colors"
                          >
                            <X size={15} />
                          </button>
                        </div>
                      </div>

                      {/* Unread indicator bar */}
                      {!notification.isRead && (
                        <div className="h-0.5 bg-blue-500 rounded-b-2xl mx-4 mb-0" />
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
