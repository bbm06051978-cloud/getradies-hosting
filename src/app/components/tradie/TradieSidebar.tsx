"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Briefcase,
  MessageSquare,
  Clock,
  User,
  Settings,
  Rocket,
  Home,
} from "lucide-react";

const navItems = [
  { label: "Dashboard",   icon: Home,          href: "/dashboard-tradie" },
  { label: "Jobs",        icon: Briefcase,     href: "/tradie-jobs"    },
  { label: "Messages",    icon: MessageSquare, href: "/tradie-chats"   },
  { label: "My Schedule", icon: Clock,         href: "/tradie-schedule"},
  { label: "Profile",     icon: User,          href: "/tradie-profile" },
  { label: "Settings",    icon: Settings,      href: "#"               },
];

export function TradieSidebar() {
const [user, setUser] = useState<{ name: string } | null>(null);
  const [profile, setProfile] = useState<{ specialty: string; isVerified: boolean; rating: number; totalReviews: number } | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => { if (data.user) setUser(data.user); })
      .catch(() => {});

    fetch("/api/tradie/profile")
      .then((res) => res.json())
      .then((data) => { if (data.profile) setProfile(data.profile); })
      .catch(() => {});
  }, []);

  return (
    <aside className="w-60 min-h-screen bg-white border-r border-gray-100 flex flex-col flex-shrink-0">
      {/* Logo */}
      <div className="p-4 border-b border-gray-100">
        <Link href="/">
          <div className="relative h-14 w-40">
            <Image
              src="/imports/GeTradie_Logo1111.png"
              alt="GeTradie"
              fill
              className="object-contain"
              priority
            />
          </div>
        </Link>
      </div>

      {/* Tradie profile card */}
      <div className="m-3 bg-blue-900 rounded-2xl p-4 text-white">
        <div className="flex items-center gap-3">
          
<div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <p className="font-bold text-sm">{user?.name || "Tradie"}</p>
                {profile?.isVerified && (
                  <span className="bg-green-400 text-green-900 text-xs font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                    ✓ Verified
                  </span>
                )}
              </div>
              <p className="text-blue-300 text-xs">{profile?.specialty || "Tradie"}</p>
              <p className="text-yellow-400 text-xs font-medium mt-0.5">
                ⭐ {profile?.rating?.toFixed(1) || "0.0"} ({profile?.totalReviews || 0} reviews)
              </p>
            </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors group ${
                item.active
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:bg-slate-50 hover:text-gray-900"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  size={17}
                  className={item.active ? "text-white" : "text-gray-400 group-hover:text-blue-900"}
                />
                {item.label}
              </div>
              {item.badge && (
                <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Get More Jobs promo */}
      <div className="m-3 bg-blue-900 rounded-2xl p-4 text-white relative overflow-hidden">
        <div className="absolute right-2 top-2 text-4xl opacity-30">🚀</div>
        <p className="font-bold text-sm text-yellow-400">Get More Jobs</p>
        <p className="text-xs text-blue-200 mt-1 leading-relaxed">
          Increase your visibility and get more leads daily.
        </p>
        <button className="mt-3 w-full bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-bold text-xs py-2 rounded-lg transition-colors flex items-center justify-center gap-1">
          <Rocket size={12} />
          Upgrade Now →
        </button>
      </div>
    </aside>
  );
}
