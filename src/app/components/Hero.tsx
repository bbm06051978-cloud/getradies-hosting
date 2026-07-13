"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { Search, Zap, X, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// ── Cursor-only particle system ───────────────────────────────
function useParticles(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  const mouseRef = useRef({ x: -999, y: -999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio, 2);
    const resize = () => {
      canvas.width  = canvas.offsetWidth  * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    type Particle = {
      x: number; y: number;
      vx: number; vy: number;
      life: number; maxLife: number;
      size: number;
      hue: number;
    };

    const particles: Particle[] = [];
    let lastSpawn = 0;
    let raf = 0;

    const spawn = (x: number, y: number) => {
      for (let i = 0; i < 1; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 0.5 + 0.1;
        particles.push({
          x: x + (Math.random() - 0.5) * 8,
          y: y + (Math.random() - 0.5) * 8,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.3,
          life: 0,
          maxLife: 0.6 + Math.random() * 0.5,
          size: Math.random() * 16 + 14,
          hue: Math.random() > 0.8 ? 25 + Math.random() * 15 : 210 + Math.random() * 40,
        });
      }
    };

    const draw = (now: number) => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;

      // Full clear — no trail, no discolouration
      ctx.clearRect(0, 0, w, h);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      // Only spawn when mouse is inside hero
      if (now - lastSpawn > 35 && mx > 0 && mx < w && my > 0 && my < h) {
        spawn(mx, my);
        lastSpawn = now;
      }

      // Update + draw
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x  += p.vx;
        p.y  += p.vy;
        p.vy -= 0.006;
        p.vx *= 0.98;
        p.vy *= 0.98;
        p.life += 0.015;

        if (p.life >= p.maxLife) { particles.splice(i, 1); continue; }

        const alpha = Math.sin((p.life / p.maxLife) * Math.PI) * 0.9;

        // Tiny glow — radius matches fullstop
        const glowR = p.size * 1.0;
        const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowR);
        grd.addColorStop(0, `hsla(${p.hue},100%,90%,${alpha})`);
        grd.addColorStop(1, `hsla(${p.hue},100%,70%,0)`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, glowR, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();

        // Core dot — fullstop sized
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue},100%,95%,${alpha})`;
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, [canvasRef]);

  return mouseRef;
}

// ── Hero ─────────────────────────────────────────────────────
export function Hero() {
  const [job, setJob] = useState("");
  const [estimate, setEstimate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [locationName, setLocationName] = useState("");

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef  = useParticles(canvasRef);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const r = e.currentTarget.getBoundingClientRect();
    mouseRef.current = { x: e.clientX - r.left, y: e.clientY - r.top };
  }, [mouseRef]);

  const postcodeMap: Record<string, string> = {
    "2150":"Parramatta","2151":"North Parramatta","2145":"Westmead",
    "2160":"Merrylands","2161":"Granville","2148":"Blacktown",
    "2000":"Sydney CBD","2010":"Surry Hills","2026":"Bondi",
    "2042":"Newtown","2060":"North Sydney","2067":"Chatswood",
    "2077":"Hornsby","2110":"Ryde","2170":"Liverpool","2750":"Penrith",
  };

  const handleEstimate = async () => {
    if (!job.trim()) { setError("Describe your job first."); return; }
    setLoading(true); setError(""); setEstimate("");
    let loc = "Sydney, NSW";
    if (navigator.geolocation) {
      try {
        const pos = await new Promise<GeolocationPosition>((res, rej) =>
          navigator.geolocation.getCurrentPosition(res, rej, { timeout: 5000 }));
        const g = await (await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json&zoom=16&addressdetails=1`)).json();
        const a = g.address || {};
        const sm: Record<string,string> = {
          "New South Wales":"NSW","Victoria":"VIC","Queensland":"QLD",
          "Western Australia":"WA","South Australia":"SA","Tasmania":"TAS",
          "Australian Capital Territory":"ACT","Northern Territory":"NT",
        };
        const suburb = postcodeMap[a.postcode||""]||a.suburb||a.neighbourhood||a.town||a.city||"";
        const state  = sm[a.state||""]||a.state||"";
        loc = suburb ? `${suburb}, ${state}` : state || "Sydney, NSW";
        setLocationName(loc);
      } catch {}
    }
    try {
      const d = await (await fetch("/api/estimate", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ job, location: loc }),
      })).json();
      d.error ? setError(d.error) : setEstimate(d.estimate);
    } catch { setError("Something went wrong."); }
    finally { setLoading(false); }
  };

  const suggestions = ["fix leaking tap","paint bedroom","blocked drain","house clean","move furniture"];

  return (
    <section
      className="relative overflow-hidden"
      style={{ minHeight:"600px", background:"linear-gradient(135deg,#060d4a 0%,#0d1a8a 30%,#1A3ADB 60%,#1e6fd4 100%)" }}
      onMouseMove={handleMouseMove}
    >
      {/* Cursor particle canvas — transparent, no background */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ background:"transparent" }} />

      {/* Hard hat — bottom right */}
      <div className="absolute bottom-0 right-0 hidden lg:block pointer-events-none"
        style={{
          width:"50%", height:"100%",
          backgroundImage:"url(/imports/hero_baground.png)",
          backgroundSize:"cover", backgroundPosition:"right bottom",
          WebkitMaskImage:"linear-gradient(to left, black 0%, black 25%, rgba(0,0,0,0.75) 50%, transparent 78%)",
          maskImage:"linear-gradient(to left, black 0%, black 25%, rgba(0,0,0,0.75) 50%, transparent 78%)",
        }}
      />

      {/* Left text overlay */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background:"linear-gradient(to right, rgba(6,13,74,0.88) 0%, rgba(6,13,74,0.60) 35%, rgba(6,13,74,0.15) 58%, transparent 72%)",
      }} />

      {/* 10 animated parallel wavy lines — left side vertical cluster */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 1440 600" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          {/* Vertical gradients — fade top and bottom */}
          {["og1","bl1","og2","bl2","og3","bl3","og4","bl4","og5","bl5"].map((id, i) => (
            <linearGradient key={id} id={id} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%"   stopColor={i%2===0?"#F97316":"#60A5FA"} stopOpacity="0"/>
              <stop offset="15%"  stopColor={i%2===0?"#F97316":"#93C5FD"} stopOpacity={String(0.95 - i*0.08)}/>
              <stop offset="50%"  stopColor={i%2===0?"#FB923C":"#BFDBFE"} stopOpacity={String(1.0 - i*0.08)}/>
              <stop offset="85%"  stopColor={i%2===0?"#F97316":"#60A5FA"} stopOpacity={String(0.75 - i*0.07)}/>
              <stop offset="100%" stopColor={i%2===0?"#F97316":"#60A5FA"} stopOpacity="0"/>
            </linearGradient>
          ))}
        </defs>

        {/* 10 lines, x from 152 to 170, 2px apart, amplitude 3px, staggered */}
        {[148,150,152,154,156,158,160,162,164,166,168,170,172,174,176,178,180,182,184,186].map((x, i) => {
          const amp = 8;
          const dur = 5 + i * 0.1;
          const begin = `${i * 0.18}s`;
          const id = ["og1","bl1","og2","bl2","og3","bl3","og4","bl4","og5","bl5","og1","bl1","og2","bl2","og3","bl3","og4","bl4","og5","bl5"][i];
          const sw = i < 4 ? 0.8 : i < 8 ? 0.7 : i < 12 ? 0.6 : 0.5;
          const v1 = `M${x},-10 C${x-amp},150 ${x+amp},300 ${x},450 C${x-amp},525 ${x},590 ${x},610`;
          const v2 = `M${x},-10 C${x+amp},150 ${x-amp},300 ${x},450 C${x+amp},525 ${x},590 ${x},610`;
          return (
            <path key={i} fill="none" stroke={`url(#${id})`} strokeWidth={sw}>
              <animate attributeName="d"
                values={`${v1};${v2};${v1}`}
                dur={`${dur}s`} repeatCount="indefinite"
                calcMode="spline" keySplines="0.4 0 0.6 1; 0.4 0 0.6 1"
                begin={begin}/>
            </path>
          );
        })}
      </svg>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
        style={{ background:"linear-gradient(to bottom, transparent, #060d4a)" }} />

      {/* ── Content ── */}
      <div className="relative max-w-6xl mx-auto px-8 lg:px-12"
        style={{ paddingTop:"72px", paddingBottom:"64px" }}>

        {/* Badge */}
        <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5 }}
          className="mb-7">
          <div style={{
            display:"inline-flex", alignItems:"center", gap:"7px",
            background:"rgba(249,115,22,0.12)", border:"1px solid rgba(249,115,22,0.30)",
            borderRadius:"100px", padding:"5px 16px",
          }}>
            <Zap size={12} style={{ color:"#F97316", fill:"#F97316" }} />
            <span style={{ fontSize:"12px", fontWeight:600, color:"#FB923C", letterSpacing:".05em" }}>
              Australia's AI-Powered Tradie Marketplace
            </span>
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.75, delay:0.1 }}
          style={{ fontSize:"clamp(40px,6vw,62px)", fontWeight:900, lineHeight:1.05, letterSpacing:"-.03em", margin:"0 0 22px", maxWidth:"600px" }}
        >
<span style={{
            background: "linear-gradient(90deg, #FFFFFF 0%, #E0EAFF 30%, #F97316 70%, #FB923C 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
          }}>Find. Estimate.</span>
          <br />
          <span style={{
            background: "linear-gradient(90deg, #93C5FD 0%, #FFFFFF 35%, #FFFFFF 65%, #F97316 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
          }}>Compare. Hire.</span>
          <br />
          <span style={{
            background: "linear-gradient(90deg, #F97316 0%, #FB923C 30%, #FFFFFF 60%, #93C5FD 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
          }}>Done.</span>
          
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ duration:0.6, delay:0.25 }}
          style={{ color:"rgba(255,255,255,0.78)", fontSize:"17px", lineHeight:1.65, marginBottom:"36px", maxWidth:"460px" }}
        >
          Post your job, get an AI estimate instantly,<br />
          compare verified tradies and hire with confidence.
        </motion.p>

        {/* Search bar */}
        <motion.div initial={{ opacity:0, y:18 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.7, delay:0.35 }}>
          <div style={{
            display:"flex", maxWidth:"580px",
            background:"rgba(255,255,255,0.10)", backdropFilter:"blur(24px)",
            border:"1px solid rgba(255,255,255,0.22)", borderRadius:"14px", padding:"5px",
            boxShadow:"0 8px 40px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.12)",
            marginBottom:"14px",
          }}>
            <div style={{ display:"flex", alignItems:"center", flex:1, gap:"10px", padding:"10px 14px" }}>
              <Search size={16} style={{ color:"rgba(255,255,255,0.45)", flexShrink:0 }} />
              <input type="text" placeholder="e.g. Kitchen renovation, Plumbing, Cleaning..."
                value={job} onChange={e => setJob(e.target.value)}
                onKeyDown={e => e.key==="Enter" && handleEstimate()}
                style={{ flex:1, background:"transparent", border:"none", outline:"none", color:"#FFFFFF", fontSize:"14px" }}
              />
              {job && (
                <button onClick={() => setJob("")}
                  style={{ color:"rgba(255,255,255,0.4)", background:"none", border:"none", cursor:"pointer", padding:0 }}>
                  <X size={14} />
                </button>
              )}
            </div>
            <button onClick={handleEstimate} disabled={loading} className="btn-estimate">
              {loading ? (
                <><svg className="spin-icon" fill="none" viewBox="0 0 24 24">
                  <circle style={{ opacity:0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path style={{ opacity:0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                </svg>Estimating...</>
              ) : <>Get AI Estimate <ArrowRight size={14}/></>}
            </button>
          </div>

          {/* Pills */}
          <div style={{ display:"flex", gap:"6px", flexWrap:"wrap", alignItems:"center" }}>
            <span style={{ fontSize:"12px", color:"rgba(255,255,255,20.35)", lineHeight:"24px" }}>Try:</span>
            {suggestions.map(s => (
              <button key={s} onClick={() => setJob(s)} className="pill-btn">{s}</button>
            ))}
          </div>
        </motion.div>

        {/* Error */}
        {error && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}
            style={{ maxWidth:"580px", marginTop:"10px", background:"rgba(239,68,68,0.12)", border:"1px solid rgba(239,68,68,0.30)", borderRadius:"10px", padding:"8px 14px", color:"#FCA5A5", fontSize:"13px" }}>
            {error}
          </motion.div>
        )}

        {/* Estimate result */}
        <AnimatePresence>
          {estimate && (
            <motion.div
              initial={{ opacity:0, y:16, scale:0.98 }}
              animate={{ opacity:1, y:0, scale:1 }}
              exit={{ opacity:0, y:-8 }}
              transition={{ type:"spring", stiffness:220, damping:24 }}
              style={{ maxWidth:"580px", marginTop:"16px", background:"rgba(255,255,255,0.08)", backdropFilter:"blur(32px)", border:"1px solid rgba(255,255,255,0.16)", borderRadius:"18px", padding:"20px", textAlign:"left", boxShadow:"0 24px 60px rgba(0,0,0,0.4)" }}
            >
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"12px" }}>
                <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
                  <div style={{ width:"30px", height:"30px", background:"rgba(249,115,22,0.20)", borderRadius:"8px", display:"flex", alignItems:"center", justifyContent:"center", border:"1px solid rgba(249,115,22,0.30)" }}>
                    <Zap size={14} style={{ color:"#F97316", fill:"#F97316" }} />
                  </div>
                  <div>
                    <p style={{ margin:0, fontWeight:700, color:"#FFFFFF", fontSize:"14px" }}>AI Estimate</p>
                    {locationName && <p style={{ margin:0, fontSize:"11px", color:"rgba(255,255,255,0.5)" }}>📍 {locationName}</p>}
                  </div>
                </div>
                <button onClick={() => setEstimate("")}
                  style={{ color:"rgba(255,255,255,0.4)", background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.15)", borderRadius:"50%", width:"24px", height:"24px", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
                  <X size={13}/>
                </button>
              </div>
              {estimate.split("\n").find(l => l.startsWith("🔧")) && (
                <div style={{ display:"inline-flex", marginBottom:"10px", background:"rgba(249,115,22,0.12)", border:"1px solid rgba(249,115,22,0.25)", borderRadius:"100px", padding:"2px 12px" }}>
                  <span style={{ fontSize:"12px", color:"#FB923C", fontWeight:600 }}>{estimate.split("\n").find(l => l.startsWith("🔧"))}</span>
                </div>
              )}
              <p style={{ fontSize:"14px", color:"rgba(255,255,255,0.80)", whiteSpace:"pre-line", lineHeight:1.72, margin:"0 0 16px" }}>
                {estimate.split("\n").filter(l => !l.startsWith("🔧")).join("\n")}
              </p>
              <Link href={`/login?redirect=/post-job&job=${encodeURIComponent(job)}`} style={{ textDecoration:"none", display:"block" }}>
                <button className="btn-find-tradie-result">Post This Job &amp; Get Quotes <ArrowRight size={14}/></button>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CTA buttons */}
        {!estimate && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.55 }}
            style={{ display:"flex", gap:"12px", marginTop:"24px", flexWrap:"wrap" }}>
            <Link href="/login"><button className="btn-find-cta">I Want a Tradie</button></Link>
            <Link href="/login-tradie"><button className="btn-tradie-cta">I am a Tradie</button></Link>
          </motion.div>
        )}

        {/* Trust badges */}
        {!estimate && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.65 }}
            style={{ display:"flex", gap:"20px", marginTop:"22px", flexWrap:"wrap" }}>
            {[{ icon:"🛡️", text:"Verified Tradies" },{ icon:"💰", text:"Upfront Pricing" },{ icon:"🔒", text:"Secure Payments" }].map(b => (
              <div key={b.text} style={{ display:"flex", alignItems:"center", gap:"6px" }}>
                <span style={{ fontSize:"14px" }}>{b.icon}</span>
                <span style={{ fontSize:"12px", color:"#00FF88", fontWeight:600 }}>{b.text}</span>
              </div>
            ))}
          </motion.div>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform:rotate(360deg); } }
        input::placeholder { color: rgba(255,255,255,0.28); }
        .btn-estimate { background:linear-gradient(135deg,#1D4ED8,#2563EB); border:none; border-radius:10px; padding:10px 20px; color:#FFF; font-weight:700; font-size:14px; cursor:pointer; display:flex; align-items:center; gap:6px; flex-shrink:0; white-space:nowrap; box-shadow:0 4px 20px rgba(37,99,235,0.50); }
        .btn-estimate:disabled { opacity:.5; cursor:not-allowed; }
        .spin-icon { animation:spin 1s linear infinite; width:14px; height:14px; }
        .btn-find-cta { background:linear-gradient(135deg,#1D4ED8,#2563EB); border:none; border-radius:12px; padding:13px 30px; color:#FFF; font-weight:700; font-size:15px; cursor:pointer; box-shadow:0 4px 20px rgba(37,99,235,0.55); transition:all 0.2s; }
        .btn-find-cta:hover { transform:translateY(-2px); box-shadow:0 8px 28px rgba(37,99,235,0.65); }
        .btn-tradie-cta { background:linear-gradient(135deg,#F97316,#EA580C); border:none; border-radius:12px; padding:13px 30px; color:#FFF; font-weight:700; font-size:15px; cursor:pointer; box-shadow:0 4px 20px rgba(249,115,22,0.55); transition:all 0.2s; }
        .btn-tradie-cta:hover { transform:translateY(-2px); box-shadow:0 8px 28px rgba(249,115,22,0.65); }
        .btn-find-tradie-result { width:100%; background:linear-gradient(135deg,#F97316,#EA580C); border:none; border-radius:12px; padding:12px; color:white; font-weight:700; font-size:14px; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:6px; box-shadow:0 4px 20px rgba(249,115,22,0.40); }
        .pill-btn { background:rgba(96,165,250,0.12); border:1px solid rgba(96,165,250,0.38); border-radius:100px; padding:4px 12px; color:#60A5FA; font-size:11px; cursor:pointer; font-weight:600; }
        .pill-btn:hover { border-color:rgba(249,115,22,0.55); color:#FB923C; background:rgba(249,115,22,0.10); }
      `}</style>
    </section>
  );
}