"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  Home, Briefcase, MessageCircle, MessageSquare,
  User, CreditCard, Bell, HelpCircle,
  ChevronLeft, ChevronRight,
} from "lucide-react";
import { usePathname } from "next/navigation";

const myJobs = [
  { label: "My Jobs",  icon: Briefcase,      href: "/my-jobs"    },
  { label: "Quotes",   icon: MessageCircle,  href: "/my-quotes"  },
  { label: "Chats",    icon: MessageSquare,  href: "/chats"      },
];

const myAccount = [
  { label: "Profile",          icon: User,        href: "/profile"       },
  { label: "Payment Methods",  icon: CreditCard,  href: "#"              },
  { label: "Notifications",    icon: Bell,        href: "/notifications" },
  { label: "Help & Support",   icon: HelpCircle,  href: "/help"          },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);

  return (
    <aside
      style={{ transition: "width 0.3s ease" }}
      className={`relative min-h-screen bg-white border-r border-gray-100 flex flex-col flex-shrink-0 ${collapsed ? "w-16" : "w-64"}`}
    >
      {/* Toggle button */}
      <button
        onClick={() => setCollapsed(c => !c)}
        className="absolute -right-3 top-20 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-shadow z-10"
      >
        {collapsed ? <ChevronRight size={12} className="text-gray-500"/> : <ChevronLeft size={12} className="text-gray-500"/>}
      </button>

      {/* Logo */}
      <div className={`border-b border-gray-100 flex items-center ${collapsed ? "p-3 justify-center" : "p-5"}`}>
        {collapsed ? (
          <Link href="/">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-sm">G</span>
            </div>
          </Link>
        ) : (
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-black text-sm">G</span>
            </div>
            <span className="text-lg font-black text-gray-900 tracking-tight">
              Ge<span className="text-orange-500">Tradie</span>
            </span>
          </Link>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-6">

        {/* Dashboard */}
        <div>
          <Link href="/dashboard"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-sm transition-colors ${
              isActive("/dashboard") ? "bg-blue-900 text-white" : "text-gray-700 hover:bg-slate-50"
            } ${collapsed ? "justify-center" : ""}`}
            title={collapsed ? "Dashboard" : ""}
          >
            <Home size={18} className="flex-shrink-0"/>
            {!collapsed && "Dashboard"}
          </Link>
        </div>

        {/* My Jobs */}
        <div>
          {!collapsed && (
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest px-2 mb-2">My Jobs</p>
          )}
          <div className="space-y-1">
            {myJobs.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.label} href={item.href}
                  title={collapsed ? item.label : ""}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors group ${
                    isActive(item.href) ? "bg-blue-50 text-blue-900 font-semibold" : "text-gray-700 hover:bg-slate-50"
                  } ${collapsed ? "justify-center" : ""}`}
                >
                  <Icon size={17} className="flex-shrink-0"/>
                  {!collapsed && item.label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* My Account */}
        <div>
          {!collapsed && (
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest px-2 mb-2">My Account</p>
          )}
          <div className="space-y-1">
            {myAccount.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.label} href={item.href}
                  title={collapsed ? item.label : ""}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors group ${
                    isActive(item.href) ? "bg-blue-50 text-blue-900 font-semibold" : "text-gray-700 hover:bg-slate-50"
                  } ${collapsed ? "justify-center" : ""}`}
                >
                  <Icon size={17} className="flex-shrink-0"/>
                  {!collapsed && item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Bottom — Post Job */}
      {!collapsed && (
        <div className="p-4 border-t border-gray-100">
          <Link href="/post-job">
            <button className="w-full bg-blue-900 hover:bg-blue-800 text-white py-2.5 rounded-xl font-bold text-sm transition-colors">
              + Post New Job
            </button>
          </Link>
        </div>
      )}
      {collapsed && (
        <div className="p-2 border-t border-gray-100">
          <Link href="/post-job" title="Post New Job">
            <button className="w-full bg-blue-900 hover:bg-blue-800 text-white py-2.5 rounded-xl font-bold text-sm transition-colors flex items-center justify-center">
              +
            </button>
          </Link>
        </div>
      )}
    </aside>
  );
}
