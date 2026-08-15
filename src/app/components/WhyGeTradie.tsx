"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Zap, FileText, Users, ShieldCheck, Lock, MessageSquare, Star, Trophy } from "lucide-react";

const features = [
  {
    icon: Zap,
    color: "#3B82F6",
    gradient: "linear-gradient(135deg, #3B82F6, #1D4ED8)",
    title: "AI Price Estimate Before You Post",
    desc: "The only Australian tradie platform that shows homeowners a fair price range before contacting anyone. Homeowners arrive informed. Conversations start fairly.",
    tag: "Australia's First",
  },
  {
    icon: FileText,
    color: "#F97316",
    gradient: "linear-gradient(135deg, #F97316, #EA580C)",
    title: "Post a Job for Free",
    desc: "No sign-up fees, no commissions, no per-lead charges. Post in 2 minutes and receive competing quotes from verified local tradies.",
    tag: "Zero Cost to Homeowners",
  },
  {
    icon: Users,
    color: "#8B5CF6",
    gradient: "linear-gradient(135deg, #8B5CF6, #7C3AED)",
    title: "Maximum 5 Tradies Per Job",
    desc: "Smart matching limits each job to 5 best-fit tradies — not dozens. A 1-in-5 chance means your quote gets proper consideration every time.",
    tag: "Better Odds for Tradies",
  },
  {
    icon: ShieldCheck,
    color: "#10B981",
    gradient: "linear-gradient(135deg, #10B981, #059669)",
    title: "Verified Tradies Only",
    desc: "Trade licence and public liability insurance independently verified — not self-declared — before any tradie appears in search results.",
    tag: "Full Verification",
  },
  {
    icon: Lock,
    color: "#EC4899",
    gradient: "linear-gradient(135deg, #EC4899, #DB2777)",
    title: "Stripe Payment Protection — Both Sides",
    desc: "Homeowners lock part of payment via Stripe before work starts. Tradies know their money is guaranteed. No other Australian platform protects both parties simultaneously.",
    tag: "Unique to GeTradie",
  },
  {
    icon: MessageSquare,
    color: "#0891B2",
    gradient: "linear-gradient(135deg, #0891B2, #0E7490)",
    title: "Direct In-App Messaging",
    desc: "Chat directly with tradies before committing. No sharing personal phone numbers. All communication stays secure within the GeTradie platform.",
    tag: "Safe & Secure",
  },
  {
    icon: Star,
    color: "#F59E0B",
    gradient: "linear-gradient(135deg, #F59E0B, #D97706)",
    title: "Genuine Reviews That Actually Matter",
    desc: "Real reviews from verified homeowners only. Every review directly impacts tradie search ranking — so quality work is always rewarded.",
    tag: "Verified Reviews Only",
  },
  {
    icon: Trophy,
    color: "#EF4444",
    gradient: "linear-gradient(135deg, #EF4444, #DC2626)",
    title: "Points & Ranking System",
    desc: "The only platform where quality work automatically improves your search ranking. Earn GeTradie Points, reach Trusted or Premium Tradie status, get more leads.",
    tag: "Rewards Quality",
  },
];

export function WhyGeTradie() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setCurrent(c => (c + 1) % features.length), 4000);
    return () => clearInterval(t);
  }, [paused]);

  const f = features[current];
  const Icon = f.icon;

  return (
    <section className="py-24 overflow-hidden" style={{ background: "linear-gradient(135deg, #060d4a 0%, #0d1a8a 60%, #1a3adb 100%)" }}>
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <span className="inline-block bg-orange-500/20 text-orange-400 text-xs font-bold px-4 py-1.5 rounded-full mb-4 uppercase tracking-widest border border-orange-500/30">
            Why Choose GeTradie
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            The <span className="text-orange-400">7 Key Differences</span>
          </h2>
          <p className="text-blue-200 text-sm max-w-xl mx-auto">
            Australia's only AI-powered tradie marketplace — built differently from the ground up.
          </p>
        </motion.div>

        {/* Main slide */}
        <div
          className="relative"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5 }}
              style={{
                background: "rgba(255,255,255,0.07)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: "1.5px solid rgba(255,255,255,0.12)",
                borderRadius: 28,
                padding: "48px 48px",
                boxShadow: `0 32px 80px rgba(0,0,0,0.3), 0 0 0 1px ${f.color}20`,
                minHeight: 280,
              }}
            >
              {/* Top accent */}
              <div style={{ position: "absolute", top: 0, left: 48, right: 48, height: 3, borderRadius: "0 0 4px 4px", background: f.gradient }}/>

              <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8">
                {/* Icon */}
                <div style={{ width: 80, height: 80, borderRadius: 24, background: f.gradient, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: `0 16px 40px ${f.color}40` }}>
                  <Icon size={36} color="#fff"/>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3 flex-wrap">
                    <span style={{ background: `${f.color}20`, border: `1px solid ${f.color}40`, color: f.color, fontSize: 11, fontWeight: 700, padding: "3px 12px", borderRadius: 20, letterSpacing: 0.5 }}>
                      {f.tag}
                    </span>
                    <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 13, fontWeight: 700 }}>
                      {String(current + 1).padStart(2, "0")} / {String(features.length).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4">{f.title}</h3>
                  <p className="text-blue-200 text-base leading-relaxed">{f.desc}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation arrows */}
          <button
            onClick={() => setCurrent(c => (c - 1 + features.length) % features.length)}
            style={{ position: "absolute", left: -20, top: "50%", transform: "translateY(-50%)", width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
          >‹</button>
          <button
            onClick={() => setCurrent(c => (c + 1) % features.length)}
            style={{ position: "absolute", right: -20, top: "50%", transform: "translateY(-50%)", width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
          >›</button>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {features.map((feat, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              style={{
                width: i === current ? 28 : 8,
                height: 8,
                borderRadius: 4,
                background: i === current ? features[i].color : "rgba(255,255,255,0.2)",
                border: "none",
                cursor: "pointer",
                transition: "all 0.3s",
              }}
            />
          ))}
        </div>

        {/* Progress bar */}
        <div style={{ height: 2, background: "rgba(255,255,255,0.1)", borderRadius: 2, marginTop: 16, overflow: "hidden" }}>
          <motion.div
            key={current}
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: paused ? 0 : 4, ease: "linear" }}
            style={{ height: "100%", background: f.color, borderRadius: 2 }}
          />
        </div>

        {/* All features grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-12">
          {features.map((feat, i) => {
            const FeatIcon = feat.icon;
            return (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                style={{
                  background: i === current ? `${feat.color}20` : "rgba(255,255,255,0.05)",
                  border: `1px solid ${i === current ? feat.color + "40" : "rgba(255,255,255,0.08)"}`,
                  borderRadius: 14,
                  padding: "12px",
                  cursor: "pointer",
                  transition: "all 0.3s",
                  textAlign: "left",
                }}
              >
                <FeatIcon size={16} color={i === current ? feat.color : "rgba(255,255,255,0.4)"} style={{ marginBottom: 6 }}/>
                <p style={{ color: i === current ? "#fff" : "rgba(255,255,255,0.5)", fontSize: 11, fontWeight: 700, lineHeight: 1.4, margin: 0 }}>
                  {feat.title.split(" ").slice(0, 4).join(" ")}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
