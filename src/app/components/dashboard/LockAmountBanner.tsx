"use client";
import { useState } from "react";
import { X, ChevronRight } from "lucide-react";
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
          style={{ background: "linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 50%, #0369a1 100%)", boxShadow: "0 4px 20px rgba(29,78,216,0.3)" }}
        >
          <div className="relative px-5 py-4">
            {/* Close button */}
            <button onClick={() => setDismissed(true)} className="absolute top-3 right-3 text-white/50 hover:text-white transition-colors">
              <X size={14}/>
            </button>

            {/* Header + Headline on same row */}
            <div className="flex items-center gap-2 mb-2 pr-6">
              <span className="text-orange-300 text-xs font-bold uppercase tracking-widest whitespace-nowrap">🛡️ Protection Tip</span>
              <span className="text-white/30">|</span>
              <p className="text-white font-bold text-sm">🔒 Every booking needs a lock amount. Here&apos;s how it protects you.</p>
            </div>

            {/* Body */}
            <p className="text-blue-200 text-xs mb-3">
              Your lock is held securely by GeTradie — not the tradie. Pay the tradie balance directly after the job is done.
            </p>

            {/* Pills + CTA on same row */}
            <div className="flex items-center gap-2 flex-wrap">
              <span style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "20px", padding: "4px 12px", fontSize: "11px", color: "white", fontWeight: 600 }}>
                ⚖️ Dispute? Lock held by GeTradie
              </span>
              <span style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "20px", padding: "4px 12px", fontSize: "11px", color: "white", fontWeight: 600 }}>
                ✅ You decide when lock is released
              </span>
              <span style={{ background: "rgba(249,115,22,0.2)", border: "1px solid rgba(249,115,22,0.3)", borderRadius: "20px", padding: "4px 12px", fontSize: "11px", color: "#FB923C", fontWeight: 600 }}>
                💡 Higher lock = stronger commitment
              </span>
              <div className="ml-auto">
                <Link href="/my-jobs">
                  <button style={{ background: "#F97316", color: "white", border: "none", borderRadius: "8px", padding: "6px 14px", fontSize: "11px", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", whiteSpace: "nowrap" }}>
                    View My Jobs <ChevronRight size={11}/>
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
