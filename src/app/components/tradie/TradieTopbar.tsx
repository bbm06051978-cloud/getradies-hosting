"use client";
import { useState, useEffect, useRef } from "react";
import { Bell, ChevronDown, MapPin, Star, X, CheckCheck } from "lucide-react";

type TradieUser = {
  name: string;
  email: string;
  tradieProfile: {
    businessName: string;
    specialty: string;
    rating: number;
    totalReviews: number;
    profilePhoto: string | null;
  } | null;
};

type Notification = {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

export function TradieTopbar() {
  const [user, setUser] = useState<TradieUser | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/tradie/profile")
      .then(r => r.json())
      .then(d => { if (d.user) setUser(d.user); })
      .catch(() => {});

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");
      const data = await res.json();
      if (data.notifications) {
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch {}
  };

  const markAllRead = async () => {
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "mark_all_read" }),
      });
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch {}
  };

  const markRead = async (id: string) => {
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "mark_read", notificationId: id }),
      });
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch {}
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    if (diff < 60000) return "Just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return date.toLocaleDateString("en-AU", { day: "numeric", month: "short" });
  };

  const profilePhoto = user?.tradieProfile?.profilePhoto;
  const initial = user?.tradieProfile?.businessName?.charAt(0).toUpperCase() || user?.name?.charAt(0).toUpperCase() || "T";

  return (
    <div className="bg-white border-b border-gray-100 px-8 py-3 flex items-center justify-between sticky top-0 z-10">
      {/* Location */}
      <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 cursor-pointer hover:border-gray-300 transition-colors">
        <MapPin size={15} className="text-yellow-500" />
        <span className="text-sm font-medium text-gray-700">Sydney, NSW</span>
        <ChevronDown size={15} className="text-gray-400" />
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        {/* Online status */}
        <button className="flex items-center gap-2 border border-gray-200 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:border-gray-300 transition-colors">
          <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
          Go Offline
        </button>

        {/* Notifications bell */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-full hover:bg-gray-50 transition-colors">
            <Bell size={20} className="text-gray-600" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {/* Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <h3 className="font-bold text-gray-900 text-sm">Notifications</h3>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button onClick={markAllRead}
                      className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-semibold">
                      <CheckCheck size={12} /> Mark all read
                    </button>
                  )}
                  <button onClick={() => setShowNotifications(false)}
                    className="text-gray-400 hover:text-gray-600">
                    <X size={14} />
                  </button>
                </div>
              </div>

              {/* Notification list */}
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center">
                    <Bell size={24} className="text-gray-200 mx-auto mb-2" />
                    <p className="text-xs text-gray-400">No notifications yet</p>
                  </div>
                ) : (
                  notifications.map(n => (
                    <div key={n.id}
                      onClick={() => !n.isRead && markRead(n.id)}
                      className={`px-4 py-3 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors ${!n.isRead ? "bg-blue-50" : ""}`}>
                      <div className="flex items-start gap-2">
                        {!n.isRead && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1.5" />
                        )}
                        <div className={!n.isRead ? "" : "pl-4"}>
                          <p className="text-xs font-bold text-gray-900">{n.title}</p>
                          <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{n.message}</p>
                          <p className="text-xs text-gray-400 mt-1">{formatTime(n.createdAt)}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User profile */}
        <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-3 py-2 hover:border-orange-300 transition-colors cursor-pointer">
          <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 border-2 border-orange-200">
            {profilePhoto ? (
              <img src={profilePhoto} alt={user?.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-orange-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">{initial}</span>
              </div>
            )}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-bold text-gray-900 leading-tight">
              {user?.tradieProfile?.businessName || user?.name || "Tradie"}
            </p>
            <p className="text-xs text-gray-400 leading-tight">
              {user?.tradieProfile?.specialty || "Tradie"}
            </p>
            <div className="flex items-center gap-1 mt-0.5">
              <Star size={10} className="text-yellow-400 fill-yellow-400" />
              <span className="text-xs text-gray-500">
                {user?.tradieProfile?.rating?.toFixed(1) || "0.0"} ({user?.tradieProfile?.totalReviews || 0} reviews)
              </span>
            </div>
          </div>
          <ChevronDown size={14} className="text-gray-400" />
        </div>
      </div>
    </div>
  );
}
