"use client";
import { motion } from "motion/react";
import { Search, Bell, Briefcase, Star, MessageSquare, ShieldCheck, ChevronRight, MapPin, Zap } from "lucide-react";

export function AppScreenIllustration() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      className="flex items-center justify-center"
    >
      <div className="relative" style={{ width: "280px" }}>

        {/* Floating notification card — top right */}
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          style={{
            position: "absolute", top: "-20px", right: "-30px", zIndex: 10,
            background: "white", borderRadius: "14px", padding: "10px 14px",
            boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
            display: "flex", alignItems: "center", gap: "8px",
            minWidth: "160px",
          }}
        >
          <div style={{ width: "32px", height: "32px", borderRadius: "10px", background: "#FFF7ED", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Bell size={15} color="#F97316"/>
          </div>
          <div>
            <p style={{ fontSize: "11px", fontWeight: 700, color: "#111", margin: 0 }}>New Quote!</p>
            <p style={{ fontSize: "10px", color: "#6B7280", margin: 0 }}>hapa & co sent $280</p>
          </div>
        </motion.div>

        {/* Floating rating card — bottom left */}
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          style={{
            position: "absolute", bottom: "40px", left: "-35px", zIndex: 10,
            background: "white", borderRadius: "14px", padding: "10px 14px",
            boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
            display: "flex", alignItems: "center", gap: "8px",
          }}
        >
          <div style={{ width: "32px", height: "32px", borderRadius: "10px", background: "#FFFBEB", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Star size={15} color="#F59E0B" fill="#F59E0B"/>
          </div>
          <div>
            <p style={{ fontSize: "11px", fontWeight: 700, color: "#111", margin: 0 }}>5.0 ⭐⭐⭐⭐⭐</p>
            <p style={{ fontSize: "10px", color: "#6B7280", margin: 0 }}>Job Completed!</p>
          </div>
        </motion.div>

        {/* Phone frame */}
        <div style={{
          width: "280px", height: "560px",
          borderRadius: "44px",
          background: "linear-gradient(145deg, #1e1e1e, #111)",
          boxShadow: "0 40px 80px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.08), inset 0 0 0 2px rgba(255,255,255,0.04)",
          padding: "12px",
          position: "relative",
        }}>
          {/* Side buttons */}
          <div style={{ position: "absolute", left: "-3px", top: "100px", width: "3px", height: "32px", background: "#2a2a2a", borderRadius: "2px 0 0 2px" }}/>
          <div style={{ position: "absolute", left: "-3px", top: "145px", width: "3px", height: "56px", background: "#2a2a2a", borderRadius: "2px 0 0 2px" }}/>
          <div style={{ position: "absolute", left: "-3px", top: "215px", width: "3px", height: "56px", background: "#2a2a2a", borderRadius: "2px 0 0 2px" }}/>
          <div style={{ position: "absolute", right: "-3px", top: "155px", width: "3px", height: "80px", background: "#2a2a2a", borderRadius: "0 2px 2px 0" }}/>

          {/* Screen */}
          <div style={{
            width: "100%", height: "100%",
            borderRadius: "34px",
            overflow: "hidden",
            background: "#F8FAFF",
            display: "flex", flexDirection: "column",
            position: "relative",
          }}>
            {/* Dynamic Island */}
            <div style={{
              position: "absolute", top: "12px", left: "50%", transform: "translateX(-50%)",
              width: "110px", height: "28px",
              background: "#000", borderRadius: "20px", zIndex: 20,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <img src="/imports/GeTradie_Logo.png" alt="GeTradie" style={{ height: "20px", objectFit: "contain", filter: "brightness(0) invert(1)" }}/>
            </div>

            {/* Status bar */}
            <div style={{ display: "flex", justifyContent: "space-between", padding: "50px 16px 6px", zIndex: 5 }}>
              <span style={{ fontSize: "11px", fontWeight: 700, color: "#000" }}>9:41</span>
              <span style={{ fontSize: "10px", color: "#666" }}>●●● WiFi</span>
            </div>

            {/* Header */}
            <div style={{ padding: "4px 16px 10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ fontSize: "11px", color: "#9CA3AF", margin: 0 }}>Good morning 👋</p>
                <p style={{ fontSize: "15px", fontWeight: 800, color: "#111", margin: 0 }}>Bidhu</p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{ position: "relative" }}>
                  <div style={{ width: "32px", height: "32px", background: "#FFF3EB", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Bell size={14} color="#F97316"/>
                  </div>
                  <div style={{ position: "absolute", top: "-2px", right: "-2px", width: "8px", height: "8px", background: "#EF4444", borderRadius: "50%", border: "1.5px solid white" }}/>
                </div>
              </div>
            </div>

            {/* Search bar */}
            <div style={{ margin: "0 14px 12px", background: "#F1F5F9", borderRadius: "12px", padding: "8px 12px", display: "flex", alignItems: "center", gap: "8px" }}>
              <Search size={13} color="#9CA3AF"/>
              <span style={{ fontSize: "11px", color: "#9CA3AF" }}>Search tradies, jobs...</span>
            </div>

            {/* Stats row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", padding: "0 14px 12px" }}>
              {[
                { label: "Active", value: "3", color: "#3B82F6", bg: "#EFF6FF" },
                { label: "Quotes", value: "5", color: "#F97316", bg: "#FFF7ED" },
                { label: "Done",   value: "12", color: "#10B981", bg: "#ECFDF5" },
              ].map(s => (
                <div key={s.label} style={{ background: s.bg, borderRadius: "10px", padding: "8px", textAlign: "center" }}>
                  <p style={{ fontSize: "16px", fontWeight: 800, color: s.color, margin: 0 }}>{s.value}</p>
                  <p style={{ fontSize: "9px", color: "#6B7280", margin: 0 }}>{s.label}</p>
                </div>
              ))}
            </div>

            {/* AI Estimate banner */}
            <div style={{ margin: "0 14px 12px", background: "linear-gradient(135deg, #1D4ED8, #3B82F6)", borderRadius: "14px", padding: "10px 12px", display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ width: "28px", height: "28px", background: "rgba(255,255,255,0.2)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Zap size={14} color="#fff" fill="#fff"/>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: "10px", fontWeight: 700, color: "#fff", margin: 0 }}>AI Estimate Ready</p>
                <p style={{ fontSize: "9px", color: "rgba(255,255,255,0.7)", margin: 0 }}>Fan install · $120–$280</p>
              </div>
              <ChevronRight size={14} color="rgba(255,255,255,0.7)"/>
            </div>

            {/* Recent jobs */}
            <div style={{ padding: "0 14px", flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <p style={{ fontSize: "11px", fontWeight: 700, color: "#111", margin: 0 }}>Recent Jobs</p>
                <p style={{ fontSize: "10px", color: "#3B82F6", margin: 0 }}>View all</p>
              </div>
              {[
                { title: "Fan Installation", trade: "Electrical", status: "Booked", statusColor: "#3B82F6", statusBg: "#EFF6FF", icon: "⚡" },
                { title: "Leaking Tap Fix",  trade: "Plumbing",   status: "Open",   statusColor: "#F97316", statusBg: "#FFF7ED", icon: "🔧" },
                { title: "House Painting",   trade: "Painting",   status: "Done",   statusColor: "#10B981", statusBg: "#ECFDF5", icon: "🎨" },
              ].map((job, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "7px 0", borderBottom: i < 2 ? "1px solid #F1F5F9" : "none" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{ width: "28px", height: "28px", background: "#F1F5F9", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}>
                      {job.icon}
                    </div>
                    <div>
                      <p style={{ fontSize: "10px", fontWeight: 600, color: "#111", margin: 0 }}>{job.title}</p>
                      <p style={{ fontSize: "9px", color: "#9CA3AF", margin: 0 }}>{job.trade}</p>
                    </div>
                  </div>
                  <span style={{ fontSize: "9px", fontWeight: 700, color: job.statusColor, background: job.statusBg, padding: "2px 7px", borderRadius: "20px" }}>
                    {job.status}
                  </span>
                </div>
              ))}
            </div>

            {/* Bottom nav */}
            <div style={{ display: "flex", justifyContent: "space-around", padding: "10px 16px 20px", borderTop: "1px solid #F1F5F9", marginTop: "auto" }}>
              {[
                { icon: "🏠", label: "Home",    active: true  },
                { icon: "💼", label: "Jobs",    active: false },
                { icon: "💬", label: "Chats",   active: false },
                { icon: "👤", label: "Profile", active: false },
              ].map(n => (
                <div key={n.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" }}>
                  <span style={{ fontSize: "16px" }}>{n.icon}</span>
                  <span style={{ fontSize: "8px", color: n.active ? "#3B82F6" : "#9CA3AF", fontWeight: n.active ? 700 : 400 }}>{n.label}</span>
                  {n.active && <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: "#3B82F6" }}/>}
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </motion.div>
  );
}
