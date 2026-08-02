"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Briefcase, MessageSquare, Clock, User,
  Settings, Home, CreditCard,
  ChevronLeft, ChevronRight, Menu, X,
} from "lucide-react";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Dashboard",    icon: Home,          href: "/dashboard-tradie"    },
  { label: "Jobs",         icon: Briefcase,     href: "/tradie-jobs"         },
  { label: "Messages",     icon: MessageSquare, href: "/tradie-chats"        },
  { label: "My Schedule",  icon: Clock,         href: "/tradie-schedule"     },
  { label: "Profile",      icon: User,          href: "/tradie-profile"      },
  { label: "Subscription", icon: CreditCard,    href: "/tradie-subscription" },
  { label: "Settings",     icon: Settings,      href: "#"                    },
];

export function TradieSidebar() {
  const [collapsed,   setCollapsed]   = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const [isMobile,    setIsMobile]    = useState(false);
  const [user,        setUser]        = useState<{ name: string } | null>(null);
  const [profile,     setProfile]     = useState<{ specialty: string; isVerified: boolean; rating: number } | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  useEffect(() => {
    fetch("/api/auth/me").then(r => r.json()).then(d => { if (d.user) setUser(d.user); }).catch(() => {});
    fetch("/api/tradie/profile").then(r => r.json()).then(d => { if (d.profile) setProfile(d.profile); }).catch(() => {});
  }, []);

  const isActive = (href: string) =>
    href === "/dashboard-tradie" ? pathname === "/dashboard-tradie" : pathname.startsWith(href);

  const NavContent = () => (
    <>
      {/* Logo */}
      <div className={`border-b border-gray-100 flex items-center ${collapsed && !isMobile ? "p-3 justify-center" : "p-5"}`}>
        <Link href="/dashboard-tradie" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-white font-black text-sm">G</span>
          </div>
          {(!collapsed || isMobile) && (
            <span className="text-lg font-black text-gray-900 tracking-tight">
              Ge<span className="text-orange-500">Tradie</span>
            </span>
          )}
        </Link>
        {isMobile && (
          <button onClick={() => setMobileOpen(false)} className="ml-auto text-gray-400 hover:text-gray-600">
            <X size={20}/>
          </button>
        )}
      </div>

      {/* Tradie profile card */}
      {(!collapsed || isMobile) && user && (
        <div className="mx-3 mt-4 bg-blue-50 rounded-xl p-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-900 flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-sm">
              {user.name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="min-w-0">
            <p className="font-bold text-gray-900 text-sm truncate">{user.name}</p>
            <p className="text-xs text-gray-500 truncate">{profile?.specialty || "Tradie"}</p>
            {profile?.isVerified && (
              <span className="text-xs text-green-600 font-semibold">✓ Verified</span>
            )}
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.label} href={item.href}
              title={collapsed && !isMobile ? item.label : ""}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors group ${
                isActive(item.href)
                  ? "bg-orange-500 text-white"
                  : "text-gray-600 hover:bg-slate-50 hover:text-gray-900"
              } ${collapsed && !isMobile ? "justify-center" : ""}`}
            >
              <Icon size={17} className="flex-shrink-0"/>
              {(!collapsed || isMobile) && item.label}
            </Link>
          );
        })}
      </nav>

      {/* Get More Jobs promo */}
      {(!collapsed || isMobile) && (
        <div className="m-3 bg-blue-900 rounded-2xl p-4 text-white relative overflow-hidden">
          <div className="absolute right-2 top-2 text-3xl opacity-20">🚀</div>
          <p className="font-bold text-sm text-yellow-400">Get More Jobs</p>
          <p className="text-xs text-blue-200 mt-1 leading-relaxed">
            Upgrade your plan to get more leads daily.
          </p>
          <Link href="/tradie-subscription">
            <button className="mt-3 w-full bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-bold text-xs py-2 rounded-lg transition-colors">
              Upgrade Plan →
            </button>
          </Link>
        </div>
      )}
    </>
  );

  return (
    <>
      {/* Mobile hamburger */}
      {isMobile && (
        <button
          onClick={() => setMobileOpen(true)}
          style={{
            position: "fixed", top: "12px", left: "12px", zIndex: 9990,
            background: "#F97316", color: "white",
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
            position: "fixed", inset: 0,
            background: "rgba(0,0,0,0.4)",
            zIndex: 9991,
          }}
        />
      )}

      {/* Mobile sidebar */}
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
          className={`relative min-h-screen bg-white border-r border-gray-100 flex flex-col flex-shrink-0 ${collapsed ? "w-16" : "w-60"}`}
        >
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
