"use client";

import { useState } from "react";
import { Zap } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { HeroSearchBox } from "@/app/components/HeroSearchBox";

export function Hero() {
  const [loading, setLoading]   = useState(false);
  const [estimate, setEstimate] = useState("");
  const [jobText, setJobText]   = useState("");

  const handleEstimate = async (job: string) => {
    setJobText(job);
    setLoading(true);
    setEstimate("");
    try {
      const res = await fetch("/api/estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ job }),
      });
      const data = await res.json();
      if (data.estimate) setEstimate(data.estimate);
    } catch {}
    finally { setLoading(false); }
  };

  const sentences = [
    "Australia's Only Tradie Marketplace with Built-in AI Price Estimates",
    "Real Jobs. Real Tradies. Real Results",
    "Verified Through Government Licensing Databases",
    "No Unnecessary Lead Fees For Tradies",
    "Simple, Secure, And Hassle-free Experience",
  ];

  const singleTrackText = sentences.join(" ⭐ ") + " ⭐ ";

  return (
    <section
      className="relative overflow-hidden"
      style={{
        backgroundImage: "url(/imports/hero_baground.png)",
        backgroundSize: "cover",
        backgroundPosition: "center top",
        backgroundRepeat: "no-repeat",
      }}
    >
      <style>{`
        @keyframes slideLeft {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        .animate-marquee-track {
          display: inline-block;
          white-space: nowrap;
          animation: slideLeft 30s linear infinite;
        }
        .btn-find { background: linear-gradient(135deg,#1a6fff,#0047ff); border:none; border-radius:10px; padding:8px 28px; color:#FFF; font-weight:700; font-size:13px; cursor:pointer; box-shadow:0 4px 20px rgba(0,71,255,0.55); transition:all 0.2s; }; font-weight:700; font-size:15px; cursor:pointer; box-shadow:0 4px 20px rgba(0,71,255,0.55); transition:all 0.2s; }
        .btn-find:hover { transform:translateY(-2px); box-shadow:0 8px 28px rgba(0,71,255,0.7); }
        .btn-tradie { background: linear-gradient(135deg,#F97316,#EA580C); border:none; border-radius:10px; padding:8px 28px; color:#FFF; font-weight:700; font-size:13px; cursor:pointer; box-shadow:0 4px 20px rgba(249,115,22,0.55); transition:all 0.2s; }FF; font-weight:700; font-size:15px; cursor:pointer; box-shadow:0 4px 20px rgba(249,115,22,0.55); transition:all 0.2s; }
        .btn-tradie:hover { transform:translateY(-2px); box-shadow:0 8px 28px rgba(249,115,22,0.65); }
      `}</style>

      

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16 lg:pt-54 lg:pb-20">
        <div className="max-w-2xl space-y-6">

          {/* Mini marquee */}
          <div style={{
            overflow: "hidden", whiteSpace: "nowrap",
            maxWidth: "480px", marginBottom: "8px",
            display: "flex",
          }}>
            <div className="animate-marquee-track text-xs font-medium text-white/60 tracking-wide pr-4">
              {singleTrackText}
            </div>
            <div className="animate-marquee-track text-xs font-medium text-white/60 tracking-wide pr-4" aria-hidden="true">
              {singleTrackText}
            </div>
          </div>

          {/* AI badge */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-orange-500 text-white text-xs font-semibold px-4 py-1.0 rounded-full shadow-lg"
          >
            <Zap size={12} className="fill-white" />
            AI-Powered Price Estimates — Instant &amp; Free
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl lg:text-4xl font-bold text-white leading-tight"
          >
            Know the Estimate First.<br/>
            Then Connect To{" "}
            <span className="text-orange-400">Tradie.</span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-white/80 text-lg leading-relaxed"
          >
            Get quotes, compare prices, chat instantly, hire with confidence.
          </motion.p>

       {/* Search bar */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            style={{ marginBottom: "16px" }}
          >
            <HeroSearchBox onEstimate={handleEstimate} loading={loading}/>
          </motion.div>

{/* Estimate result */}
          {estimate && (
            <div style={{
              background: "rgba(255,255,255,0.12)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: "16px",
              padding: "16px 20px",
              maxWidth: "520px",
            }}>
              <p style={{ fontSize: "11px", fontWeight: 700, color: "rgba(249,115,22,0.9)", letterSpacing: ".08em", textTransform: "uppercase", marginBottom: "8px" }}>
                AI Estimate for &ldquo;{jobText}&rdquo;
              </p>
              <p style={{ color: "#fff", fontSize: "13px", lineHeight: 1.7, whiteSpace: "pre-line" }}>{estimate}</p>
            </div>
          )}

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55 }}
            className="flex flex-wrap gap-3"
          >
            <Link href="/login">
              <button className="btn-find">I Want a Tradie</button>
            </Link>
            <Link href="/login-tradie">
              <button className="btn-tradie">I am a Tradie</button>
            </Link>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex flex-wrap gap-5"
          >
            {[
              { icon: "🛡️", text: "Verified Tradies" },
              { icon: "💰", text: "Upfront Pricing" },
              { icon: "🔒", text: "Secure Payments" },
            ].map(b => (
              <div key={b.text} className="flex items-center gap-1.5">
                <span className="text-sm">{b.icon}</span>
                <span className="text-xs font-semibold text-white/70">{b.text}</span>
              </div>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  );
}