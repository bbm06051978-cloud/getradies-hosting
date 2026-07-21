"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { Search, Zap, X, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { HeroSearchBox } from "@/app/components/HeroSearchBox";

// ── Hero ─────────────────────────────────────────────────────
export function Hero() {
  const [job, setJob]             = useState("");
  const [estimate, setEstimate]   = useState("");
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");
  const [mousePos, setMousePos]   = useState({ x: -999, y: -999 });
  const [loc, setLoc]             = useState("");

  useEffect(() => {
    try {
      navigator.geolocation?.getCurrentPosition(async pos => {
        try {
          const r = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json`);
          const d = await r.json();
          const suburb = d.address?.suburb || d.address?.town || d.address?.city || "";
          const state  = d.address?.state || "";
          if (suburb) setLoc(`${suburb}, ${state}`);
        } catch {}
      });
    } catch {}
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const r = e.currentTarget.getBoundingClientRect();
    setMousePos({ x: e.clientX - r.left, y: e.clientY - r.top });
  }, []);

  const handleEstimate = async (jobText: string) => {
    setJob(jobText);
    setLoading(true);
    setEstimate("");
    setError("");
    try {
      const d = await (await fetch("/api/estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ job: jobText, location: loc }),
      })).json();
      d.error ? setError(d.error) : setEstimate(d.estimate);
    } catch { setError("Something went wrong."); }
    finally { setLoading(false); }
  };

  const suggestions = ["fix leaking tap", "paint bedroom", "blocked drain", "house clean", "move furniture"];

  return (
    <section
      className="relative overflow-hidden pt-20"
      style={{
        minHeight: "100svh",
        background: "linear-gradient(135deg,#060d4a 0%,#0d1a8a 30%,#1A3ADB 60%,#1e6fd4 100%)",
      }}
      onMouseMove={handleMouseMove}
    >
      <style>{`
        @keyframes spin { to { transform:rotate(360deg); } }
        input::placeholder { color: rgba(255,255,255,0.75); opacity: 1; }
        .btn-estimate { background:#ffffff; border:none; border-radius:10px; padding:10px 20px; color:#0047ff; font-weight:700; font-size:14px; cursor:pointer; display:flex; align-items:center; gap:6px; flex-shrink:0; white-space:nowrap; box-shadow:0 4px 20px rgba(255,255,255,0.3); transition:all 0.2s; }
        .btn-estimate:hover { background:#f0f4ff; box-shadow:0 6px 25px rgba(255,255,255,0.4); transform:translateY(-1px); }
        .btn-estimate:disabled { opacity:.5; cursor:not-allowed; }
        .spin-icon { animation:spin 1s linear infinite; width:14px; height:14px; }
        .btn-find-cta { background:linear-gradient(135deg,#1a6fff,#0047ff); border:none; border-radius:12px; padding:14px 48px; color:#FFF; font-weight:700; font-size:15px; cursor:pointer; box-shadow:0 4px 20px rgba(0,71,255,0.55); transition:all 0.2s; min-width:200px; }
        .btn-find-cta:hover { transform:translateY(-2px); box-shadow:0 8px 28px rgba(0,71,255,0.7); }
        .btn-tradie-cta { background:linear-gradient(135deg,#F97316,#EA580C); border:none; border-radius:12px; padding:14px 48px; color:#FFF; font-weight:700; font-size:15px; cursor:pointer; box-shadow:0 4px 20px rgba(249,115,22,0.55); transition:all 0.2s; min-width:200px; }
        .btn-tradie-cta:hover { transform:translateY(-2px); box-shadow:0 8px 28px rgba(249,115,22,0.65); }
        @keyframes sparkle { 0%,100% { box-shadow:0 4px 20px rgba(0,180,255,0.6), 0 0 10px rgba(0,229,255,0.3); } 50% { box-shadow:0 4px 30px rgba(0,180,255,0.8), 0 0 20px rgba(0,229,255,0.5), 0 0 40px rgba(0,180,255,0.2); } }
        .pill-btn { background:rgba(96,165,250,0.12); border:1px solid rgba(96,165,250,0.38); border-radius:100px; padding:4px 12px; color:#60A5FA; font-size:11px; cursor:pointer; font-weight:600; }
        .pill-btn:hover { border-color:rgba(249,115,22,0.55); color:#FB923C; background:rgba(249,115,22,0.10); }
      `}</style>

      {/* Cursor flare */}
      <div className="absolute inset-0 pointer-events-none hidden md:block" style={{
        background: mousePos.x > 0
          ? `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(99,179,255,0.12), rgba(139,92,246,0.06) 40%, transparent 70%)`
          : "transparent",
        transition: "background 0.1s ease",
        zIndex: 1,
      }}/>

      {/* Hard hat — bottom right */}
      <div className="absolute bottom-0 right-0 hidden lg:block pointer-events-none"
        style={{
          width: "50%", height: "100%",
          backgroundImage: "url(/imports/hero_baground.png)",
          backgroundSize: "cover", backgroundPosition: "right bottom",
          WebkitMaskImage: "linear-gradient(to left, black 0%, black 25%, rgba(0,0,0,0.75) 50%, transparent 78%)",
          maskImage: "linear-gradient(to left, black 0%, black 25%, rgba(0,0,0,0.75) 50%, transparent 78%)",
          zIndex: 1,
        }}
      />

      {/* Left gradient overlay */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "linear-gradient(to right, rgba(6,13,74,0.88) 0%, rgba(6,13,74,0.60) 35%, rgba(6,13,74,0.15) 48%, transparent 72%)",
        zIndex: 2,
      }}/>

     

      {/* Content */}
      <div className="relative max-w-6xl mx-auto px-4 sm:px-8 lg:px-12"
        style={{ paddingTop: "72px", paddingBottom: "64px", zIndex: 10, position: "relative" }}>

        {/* Badge */}
        <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5 }} className="mb-7">
          <div style={{
            display:"inline-flex", alignItems:"center", gap:"7px",
            background:"rgba(249,115,22,0.12)", border:"1px solid rgba(249,115,22,0.30)",
            borderRadius:"100px", padding:"5px 16px",
          }}>
            <Zap size={12} style={{ color:"#F97316", fill:"#F97316" }} />
            <span style={{ fontSize:"12px", fontWeight:600, color:"#FB923C", letterSpacing:".05em" }}>
              Australia&apos;s AI-Powered Tradie Marketplace
            </span>
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1 initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.75, delay:0.1 }}
          style={{ fontSize:"clamp(40px,6vw,62px)", fontWeight:900, lineHeight:1.05, letterSpacing:"-.03em", margin:"0 0 22px", maxWidth:"600px" }}>
          <span style={{
            background:"linear-gradient(90deg, #FFFFFF 0%, #E0EAFF 30%, #F97316 70%, #FB923C 100%)",
            WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text",
          }}>Find. Estimate.</span>
          <br/>
          <span style={{
            background:"linear-gradient(90deg, #93C5FD 0%, #FFFFFF 35%, #FFFFFF 65%, #F97316 100%)",
            WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text",
          }}>Compare. Hire.</span>
          <br/>
          <span style={{
            background:"linear-gradient(90deg, #F97316 0%, #FB923C 30%, #FFFFFF 60%, #93C5FD 100%)",
            WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text",
          }}>Done.</span>
        </motion.h1>

        {/* Subheading */}
        <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ duration:0.6, delay:0.25 }}
          style={{ color:"rgba(255,255,255,0.78)", fontSize:"17px", lineHeight:1.65, marginBottom:"36px", maxWidth:"460px" }}>
          Post your job, get an AI estimate instantly,<br/>
          compare verified tradies and hire with confidence.
        </motion.p>

        {/* Search bar */}
        <motion.div initial={{ opacity:0, y:18 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.7, delay:0.35 }}>
          <HeroSearchBox onEstimate={handleEstimate} loading={loading}/>
        </motion.div>

        {/* Suggestions */}
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.5 }}
          style={{ display:"flex", flexWrap:"wrap", gap:"8px", marginTop:"14px", marginBottom:"32px" }}>
          <span style={{ fontSize:"12px", color:"rgba(255,255,255,0.45)", alignSelf:"center" }}>Try:</span>
          {suggestions.map(s => (
            <button key={s} className="pill-btn" onClick={() => handleEstimate(s)}>{s}</button>
          ))}
        </motion.div>

        {/* Estimate result */}
        <AnimatePresence>
          {(estimate || error || loading) && (
            <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
              style={{
                background:"rgba(255,255,255,0.08)", backdropFilter:"blur(20px)",
                border:"1px solid rgba(255,255,255,0.15)", borderRadius:"16px",
                padding:"20px 24px", marginBottom:"28px", maxWidth:"520px", position:"relative",
              }}>
              <button onClick={() => { setEstimate(""); setError(""); setJob(""); }}
                style={{ position:"absolute", top:"12px", right:"12px", background:"none", border:"none", cursor:"pointer", color:"rgba(255,255,255,0.4)" }}>
                <X size={16}/>
              </button>
              {loading ? (
                <div style={{ display:"flex", alignItems:"center", gap:"10px", color:"rgba(255,255,255,0.7)" }}>
                  <svg className="spin-icon" fill="none" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3"/>
                    <path fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                  </svg>
                  <span style={{ fontSize:"14px" }}>Getting AI estimate...</span>
                </div>
              ) : error ? (
                <p style={{ color:"#FCA5A5", fontSize:"14px" }}>{error}</p>
              ) : (
                <>
                  <p style={{ fontSize:"11px", fontWeight:700, color:"rgba(249,115,22,0.9)", letterSpacing:".08em", textTransform:"uppercase", marginBottom:"8px" }}>
                    AI Estimate for &ldquo;{job}&rdquo;
                  </p>
                  <p style={{ color:"#fff", fontSize:"14px", lineHeight:1.7, whiteSpace:"pre-line" }}>{estimate}</p>
                  <Link href="/post-job">
                    <button style={{
                      marginTop:"14px", display:"inline-flex", alignItems:"center", gap:"6px",
                      background:"linear-gradient(135deg,#F97316,#EA580C)", border:"none",
                      borderRadius:"10px", padding:"9px 18px", color:"#fff", fontWeight:700,
                      fontSize:"13px", cursor:"pointer",
                    }}>
                      Post This Job <ArrowRight size={13}/>
                    </button>
                  </Link>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* CTA buttons */}
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.55 }}
          style={{ display:"flex", gap:"12px", marginTop:"24px", flexWrap:"wrap" }}>
          <Link href="/login"><button className="btn-find-cta">I Want a Tradie</button></Link>
          <Link href="/login-tradie"><button className="btn-tradie-cta">I am a Tradie</button></Link>
        </motion.div>

        {/* Trust badges */}
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.7 }}
          style={{ display:"flex", flexWrap:"wrap", gap:"20px", marginTop:"32px" }}>
          {[
            { icon:"🛡️", text:"Verified Tradies" },
            { icon:"💰", text:"Upfront Pricing" },
            { icon:"🔒", text:"Secure Payments" },
          ].map(b => (
            <div key={b.text} style={{ display:"flex", alignItems:"center", gap:"6px" }}>
              <span style={{ fontSize:"14px" }}>{b.icon}</span>
              <span style={{ fontSize:"12px", fontWeight:600, color:"rgba(255,255,255,0.65)" }}>{b.text}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}