"use client";
import { useState } from "react";
import { X, ShieldCheck, AlertTriangle, CheckCircle, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";

export function LockAmountBanner() {
  const [dismissed, setDismissed] = useState(false);

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className="relative mb-6 rounded-2xl overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 50%, #0369a1 100%)",
            boxShadow: "0 8px 32px rgba(29,78,216,0.3)",
          }}
        >
          {/* Background glow */}
          <div style={{
            position: "absolute", top: "-30px", right: "-30px",
            width: "150px", height: "150px", borderRadius: "50%",
            background: "rgba(249,115,22,0.15)", filter: "blur(40px)",
          }}/>

          <div className="relative p-5">
            {/* Close button */}
            <button onClick={() => setDismissed(true)}
              className="absolute top-3 right-3 text-white/50 hover:text-white transition-colors">
              <X size={16}/>
            </button>

            {/* Header */}
            <div className="flex items-start gap-4 pr-6 mb-4">
              <div style={{
                width: "48px", height: "48px", borderRadius: "14px", flexShrink: 0,
                background: "rgba(249,115,22,0.25)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <ShieldCheck size={24} color="#FB923C"/>
              </div>
              <div>
                <span className="text-orange-300 text-xs font-bold uppercase tracking-widest">
                  💡 Your Protection Tip
                </span>
                <h3 className="text-white font-bold text-base lg:text-lg leading-snug mt-1">
                  Lock More = You Are Better Protected!
                </h3>
                <p className="text-blue-200 text-xs">
                  📌 Lock amount is your deposit — held by GeTradie. Pay the tradie the remaining balance directly. GeTradie releases your deposit to the tradie once you confirm job completion.
                </p>
              </div>
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
              {[
                {
                  icon: ShieldCheck, color: "#10B981",
                  title: "Dispute Protection",
                  desc: "If something goes wrong, GeTradie holds the full lock amount until the dispute is resolved in your favour.",
                },
                {
                  icon: CheckCircle, color: "#60A5FA",
                  title: "Tradies Work Harder",
                  desc: "A higher lock amount shows you are serious — tradies prioritise jobs with stronger commitment.",
                },
                {
                  icon: AlertTriangle, color: "#F59E0B",
                  title: "You Are in Control",
                  desc: "Your lock amount is never released to the tradie unless YOU confirm the job is complete.",
                },
              ].map(b => {
                const Icon = b.icon;
                return (
                  <div key={b.title} style={{
                    background: "rgba(255,255,255,0.08)",
                    borderRadius: "12px", padding: "12px",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}>
                    <div className="flex items-center gap-2 mb-1">
                      <Icon size={14} color={b.color}/>
                      <span className="text-white text-xs font-bold">{b.title}</span>
                    </div>
                    <p className="text-blue-200 text-xs leading-relaxed">{b.desc}</p>
                  </div>
                );
              })}
            </div>

            {/* Bottom note + CTA */}
            <div className="flex items-center justify-between flex-wrap gap-3" style={{
              background: "rgba(255,255,255,0.06)",
              borderRadius: "12px", padding: "12px",
              border: "1px solid rgba(255,255,255,0.1)",
            }}>
              <div>
                <p className="text-white text-xs font-bold mb-0.5">
                  🔒 The more you lock, tradies take your job more seriously!
                </p>
                <p className="text-blue-200 text-xs">
                  📌 Lock amount is separate from job payment. Pay the tradie directly after job completion.
                </p>
              </div>
              <Link href="/my-jobs">
                <button style={{
                  background: "#F97316", color: "white", border: "none",
                  borderRadius: "10px", padding: "8px 16px",
                  fontSize: "12px", fontWeight: 700, cursor: "pointer",
                  display: "flex", alignItems: "center", gap: "4px",
                  whiteSpace: "nowrap",
                }}>
                  View My Jobs <ChevronRight size={12}/>
                </button>
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
