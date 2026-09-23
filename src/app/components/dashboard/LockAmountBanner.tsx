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
          style={{ background: "linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 50%, #0369a1 100%)", boxShadow: "0 8px 32px rgba(29,78,216,0.3)" }}
        >
          <div style={{ position: "absolute", top: "-30px", right: "-30px", width: "150px", height: "150px", borderRadius: "50%", background: "rgba(249,115,22,0.15)", filter: "blur(40px)" }}/>

          <div className="relative p-5">
            {/* Close button */}
            <button onClick={() => setDismissed(true)} className="absolute top-3 right-3 text-white/50 hover:text-white transition-colors">
              <X size={16}/>
            </button>

            {/* Header */}
            <p className="text-orange-300 text-xs font-bold uppercase tracking-widest mb-1">🛡️ Your Protection Tip</p>
            <h3 className="text-white font-bold text-base lg:text-lg leading-snug mb-3">🔒 Lock an amount. Stay protected.</h3>

            {/* What it is */}
            <p className="text-blue-200 text-sm mb-4">
              Your lock amount is held securely by GeTradie. After the job is done, you pay the remaining balance directly to the tradie.
            </p>

            {/* Benefits */}
            <div className="space-y-2 mb-4">
              <div className="flex items-start gap-2">
                <span className="text-base">⚖️</span>
                <p className="text-white text-sm">Something goes wrong? Your lock stays with GeTradie while the issue is sorted.</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-base">✅</span>
                <p className="text-white text-sm">Job done? You decide when your lock amount is released.</p>
              </div>
            </div>

            {/* Pitch + CTA */}
            <div className="flex items-center justify-between flex-wrap gap-3" style={{ background: "rgba(255,255,255,0.06)", borderRadius: "12px", padding: "12px", border: "1px solid rgba(255,255,255,0.1)" }}>
              <div>
                <p className="text-white text-xs font-bold mb-0.5">💡 A higher lock can show stronger commitment from the tradie.</p>
                <p className="text-blue-200 text-xs">You&apos;re in control. Always.</p>
              </div>
              <Link href="/my-jobs">
                <button style={{ background: "#F97316", color: "white", border: "none", borderRadius: "10px", padding: "8px 16px", fontSize: "12px", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", whiteSpace: "nowrap" }}>
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
