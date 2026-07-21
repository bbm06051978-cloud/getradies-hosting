"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Home,
  Briefcase,
  MessageCircle,
  MessageSquare,
  Calendar,
  CheckCircle,
  XCircle,
  User,
  MapPin,
  CreditCard,
  Bell,
  HelpCircle,
  Gift,
} from "lucide-react";


const myJobs = [
  { label: "My Jobs", icon: Briefcase, href: "/my-jobs", badge: null },
  { label: "Quotes", icon: MessageCircle, href: "/my-quotes", badge: null },
  { label: "Chats", icon: MessageSquare, href: "/chats", badge: null },
];

const myAccount = [
  { label: "Profile", icon: User, href: "/profile" },
  { label: "Payment Methods", icon: CreditCard, href: "#" },
  { label: "Notifications", icon: Bell, href: "/notifications", badge: null },
  { label: "Help & Support", icon: HelpCircle, href: "/help" },
];

export function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-white border-r border-gray-100 flex flex-col">
 


     {/* Logo */}
      <div className="p-5 border-b border-gray-100">
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
        <p className="text-xs text-gray-800 mt-1 ml-1">
          Find. Estimate. Compare. Hire. Done.
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {/* Dashboard */}
        <div>
          <Link
            href="/dashboard"
            className="flex items-center gap-3 bg-blue-900 text-white px-4 py-3 rounded-xl font-semibold text-sm"
          >
            <Home size={18} />
            Dashboard
          </Link>
        </div>

        {/* My Jobs */}
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest px-2 mb-2">
            My Jobs
          </p>
          <div className="space-y-1">
            {myJobs.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm text-gray-900 hover:bg-slate-50 hover:text-gray-900 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <Icon size={17} className="text-gray-900 group-hover:text-blue-900" />
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
          </div>
        </div>

        {/* My Account */}
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest px-2 mb-2">
            My Account
          </p>
          <div className="space-y-1">
            {myAccount.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-900 hover:bg-slate-50 hover:text-gray-900 transition-colors group"
                >
                  <Icon size={17} className="text-gray-400 group-hover:text-blue-900" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Refer & Earn */}
      <div className="m-3 bg-blue-900 rounded-2xl p-4 text-white">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-bold text-sm flex items-center gap-1">
              <Gift size={15} className="text-yellow-400" />
              Refer &amp; Earn
            </p>
            <p className="text-xs text-blue-200 mt-1 leading-relaxed">
              Invite friends and earn{" "}
              <span className="text-yellow-400 font-bold">$25 credit</span> when
              they complete a job!
            </p>
          </div>
          <span className="text-2xl">🎁</span>
        </div>
        <button className="mt-3 w-full bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-bold text-xs py-2 rounded-lg transition-colors">
          Invite Now →
        </button>
      </div>
    </aside>
  );
}
