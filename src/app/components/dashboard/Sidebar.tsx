"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Home, Briefcase, MessageCircle, MessageSquare,
  User, CreditCard, Bell, HelpCircle,
  ChevronLeft, ChevronRight, Menu, X,
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
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Close mobile sidebar on route change
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);

  const NavContent = () => (
    <>
      {/* Logo */}
      <div className={`border-b border-gray-100 flex items-center ${collapsed && !isMobile ? "p-3 justify-center" : "p-1"}`}>
        <Link href="/dashboard" className="flex items-center gap-2">
<div className="relative h-14 w-44 bg-[#0047AB] rounded-lg">
            <img src="/imports/GeTradie_Logo.webp" alt="GeTradie" style={{ objectFit: "contain", height: "100%", width: "100%" }}/>
          </div>
        </Link>
        {isMobile && (
          <button onClick={() => setMobileOpen(false)} className="ml-auto text-gray-400 hover:text-gray-600">
            <X size={20}/>
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-6">
        {/* Dashboard */}
        <div>
          <Link href="/dashboard"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-sm transition-colors ${
              isActive("/dashboard") ? "bg-blue-900 text-white" : "text-gray-700 hover:bg-slate-50"
            } ${collapsed && !isMobile ? "justify-center" : ""}`}
            title={collapsed && !isMobile ? "Dashboard" : ""}
          >
            <Home size={18} className="flex-shrink-0"/>
            {(!collapsed || isMobile) && "Dashboard"}
          </Link>
        </div>

        {/* My Jobs */}
        <div>
          {(!collapsed || isMobile) && (
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest px-2 mb-2">My Jobs</p>
          )}
          <div className="space-y-1">
            {myJobs.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.label} href={item.href}
                  title={collapsed && !isMobile ? item.label : ""}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors group ${
                    isActive(item.href) ? "bg-blue-50 text-blue-900 font-semibold" : "text-gray-700 hover:bg-slate-50"
                  } ${collapsed && !isMobile ? "justify-center" : ""}`}
                >
                  <Icon size={17} className="flex-shrink-0"/>
                  {(!collapsed || isMobile) && item.label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* My Account */}
        <div>
          {(!collapsed || isMobile) && (
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest px-2 mb-2">My Account</p>
          )}
          <div className="space-y-1">
            {myAccount.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.label} href={item.href}
                  title={collapsed && !isMobile ? item.label : ""}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors group ${
                    isActive(item.href) ? "bg-blue-50 text-blue-900 font-semibold" : "text-gray-700 hover:bg-slate-50"
                  } ${collapsed && !isMobile ? "justify-center" : ""}`}
                >
                  <Icon size={17} className="flex-shrink-0"/>
                  {(!collapsed || isMobile) && item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Post Job button */}
      <div className={`border-t border-gray-100 ${collapsed && !isMobile ? "p-2" : "p-4"}`}>
        <Link href="/post-job" title={collapsed && !isMobile ? "Post New Job" : ""}>
          <button className={`w-full bg-blue-900 hover:bg-blue-800 text-white rounded-xl font-bold text-sm transition-colors flex items-center justify-center ${
            collapsed && !isMobile ? "py-2.5" : "py-2.5 gap-1"
          }`}>
            {collapsed && !isMobile ? "+" : "+ Post New Job"}
          </button>
        </Link>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile hamburger button — shown in topbar area */}
      {isMobile && (
        <button
          onClick={() => setMobileOpen(true)}
          style={{
            position: "fixed", top: "12px", left: "12px", zIndex: 9990,
            background: "#1e3a8a", color: "white",
            border: "none", borderRadius: "10px",
            width: "40px", height: "40px",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
          }}
        >
          <Menu size={20}/>
        </button>
      )}

      {/* Mobile overlay */}
      {isMobile && mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)",
            zIndex: 9991,
          }}
        />
      )}

      {/* Mobile sidebar — slide in */}
      {isMobile ? (
        <div style={{
          position: "fixed", top: 0, left: 0, bottom: 0,
          width: "260px", background: "white",
          zIndex: 9992, display: "flex", flexDirection: "column",
          transform: mobileOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.3s ease",
          boxShadow: "4px 0 20px rgba(0,0,0,0.1)",
        }}>
          <NavContent/>
        </div>
      ) : (
        /* Desktop sidebar */
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
          <NavContent/>
        </aside>
      )}
    </>
  );
}
