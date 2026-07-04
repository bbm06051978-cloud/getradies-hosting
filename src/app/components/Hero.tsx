"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Search, Zap, X, ArrowRight, ShieldCheck, Star, MapPin, Lock } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// ── WebGL Neon Ribbon Shader ──────────────────────────────────
const VERT = `attribute vec2 a; void main(){ gl_Position = vec4(a, 0, 1); }`;

const FRAG = `
precision highp float;
uniform vec2 u_res;
uniform float u_time;
uniform vec2 u_mouse;

#define PI 3.14159265

float hash(float n){ return fract(sin(n)*43758.5453); }
float noise(float x){
  float i=floor(x); float f=fract(x);
  f=f*f*(3.-2.*f);
  return mix(hash(i), hash(i+1.), f);
}

void main(){
  vec2 uv = gl_FragCoord.xy / u_res;
  float asp = u_res.x / u_res.y;
  float t = u_time * 0.18;
  vec2 m = u_mouse / u_res;

  // Vivid electric blue base — matches image 1
  vec3 col = vec3(0.06, 0.22, 0.82);

  // Vivid blue ribbon colours — light on vibrant blue
  vec3 cyan    = vec3(0.55, 0.85, 1.00);
  vec3 blue    = vec3(0.75, 0.90, 1.00);
  vec3 purple  = vec3(0.90, 0.95, 1.00);
  vec3 magenta = vec3(1.00, 0.98, 0.90);

  float ribbons = 0.0;
  vec3  rColor  = vec3(0.0);

  // 14 neon ribbons sweeping from right
  for(int i = 0; i < 14; i++){
    float fi = float(i);
    float speed  = 0.25 + fi * 0.015;
    float yBase  = 0.72 - fi * 0.045;
    float amp    = 0.28 + fi * 0.018;
    float freq   = 0.55 + fi * 0.04;
    float phase  = fi * 0.42;

    // S-curve sweeping from right side
    float xNorm = uv.x * asp;
    float wave  = sin(xNorm * freq * PI + t * speed + phase) * amp;
    wave += sin(xNorm * freq * 1.8 * PI + t * speed * 1.4 + phase + 2.1) * amp * 0.35;

    // Mouse subtle influence
    wave += (m.y - 0.5) * 0.06 * (1.0 - uv.x);

    float ry   = yBase + wave * (1.0 - uv.x * 0.5);
    float dist = abs(uv.y - ry);

    // Line width — thinner = sharper neon
    float w = 0.004 + fi * 0.0006;

    // Sharp neon line with soft glow
    float core = exp(-dist * dist / (w * w * 0.15));
    float glow = exp(-dist * dist / (w * w * 4.0)) * 0.4;
    float line = core + glow;

    // Color gradient along ribbon — cyan to purple to magenta
    float ct = fi / 13.0;
    vec3 rc;
    if(ct < 0.4)      rc = mix(cyan,    blue,   ct / 0.4);
    else if(ct < 0.7) rc = mix(blue,    purple, (ct - 0.4) / 0.3);
    else               rc = mix(purple,  magenta,(ct - 0.7) / 0.3);

    // Brighter on right side, fade left
    float xFade = smoothstep(0.15, 0.65, uv.x);
    rColor += rc * line * xFade;
    ribbons += line * xFade;
  }

  // Additive neon blend
  col += rColor * 0.7;

  // Floor glow — neon reflection at bottom
  float floorGlow = exp(-(1.0 - uv.y) * 5.0) * 0.35;
  col += mix(vec3(0.7,0.9,1.0), vec3(1.0,1.0,1.0), uv.x) * floorGlow * 0.4 * smoothstep(0.2, 0.8, uv.x);

  // Very soft vignette — keep vivid blue bright
  float vig = 1.0 - smoothstep(0.45, 1.4, length((uv - vec2(0.5, 0.5)) * vec2(0.9, 1.1))) * 0.55;
  col *= vig;

  // Tone map — preserve vivid blue saturation
  col = col / (col + vec3(0.35));
  col = pow(max(col, vec3(0.0)), vec3(0.88));

  gl_FragColor = vec4(col, 1.0);
}`;

function useNeonGL(ref: React.RefObject<HTMLCanvasElement | null>, mouse: React.RefObject<{x:number,y:number}>) {
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const gl = c.getContext("webgl", { antialias: true, alpha: false });
    if (!gl) return;
    const mk = (t: number, s: string) => {
      const sh = gl.createShader(t)!;
      gl.shaderSource(sh, s); gl.compileShader(sh); return sh;
    };
    const pg = gl.createProgram()!;
    gl.attachShader(pg, mk(gl.VERTEX_SHADER, VERT));
    gl.attachShader(pg, mk(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(pg); gl.useProgram(pg);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,1,1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(pg, "a");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const uR = gl.getUniformLocation(pg, "u_res");
    const uT = gl.getUniformLocation(pg, "u_time");
    const uM = gl.getUniformLocation(pg, "u_mouse");
    const dpr = Math.min(window.devicePixelRatio, 2);
    const resize = () => {
      c.width = c.offsetWidth * dpr;
      c.height = c.offsetHeight * dpr;
      gl.viewport(0, 0, c.width, c.height);
    };
    resize();
    window.addEventListener("resize", resize);
    const t0 = performance.now();
    let raf = 0;
    const draw = (now: number) => {
      gl.uniform2f(uR, c.width, c.height);
      gl.uniform1f(uT, (now - t0) / 1000);
      gl.uniform2f(uM, mouse.current!.x * dpr, (c.offsetHeight - mouse.current!.y) * dpr);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, [ref, mouse]);
}

// ── Hero ─────────────────────────────────────────────────────
export function Hero() {
  const [job, setJob] = useState("");
  const [estimate, setEstimate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [locationName, setLocationName] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  useNeonGL(canvasRef, mouseRef);

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
          "Australian Capital Territory":"ACT","Northern Territory":"NT"
        };
        const suburb = postcodeMap[a.postcode||""]||a.suburb||a.neighbourhood||a.town||a.city||"";
        const state = sm[a.state||""]||a.state||"";
        loc = suburb ? `${suburb}, ${state}` : state || "Sydney, NSW";
        setLocationName(loc);
      } catch {}
    }
    try {
      const d = await (await fetch("/api/estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ job, location: loc }),
      })).json();
      d.error ? setError(d.error) : setEstimate(d.estimate);
    } catch { setError("Something went wrong."); }
    finally { setLoading(false); }
  };

  const suggestions = ["fix leaking tap", "paint bedroom", "blocked drain", "house clean", "move furniture"];

  return (
    <section
      className="relative overflow-hidden"
      style={{ minHeight: "600px", background: "linear-gradient(135deg,#0a2adb 0%,#1A3ADB 40%,#1e6fd4 70%,#1a9cd4 100%)" }}
      onMouseMove={e => {
        const r = e.currentTarget.getBoundingClientRect();
        mouseRef.current = { x: e.clientX - r.left, y: e.clientY - r.top };
      }}
    >
      {/* WebGL neon ribbons */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Hard hat — bottom right, sharp and fully visible */}
      <div
        className="absolute bottom-0 right-0 hidden lg:block pointer-events-none"
        style={{
          width: "50%",
          height: "100%",
          backgroundImage: "url(/imports/hero_baground.png)",
          backgroundSize: "cover",
          backgroundPosition: "right bottom",
          backgroundRepeat: "no-repeat",
          WebkitMaskImage: "linear-gradient(to left, black 0%, black 25%, rgba(0,0,0,0.75) 50%, transparent 78%)",
          maskImage: "linear-gradient(to left, black 0%, black 25%, rgba(0,0,0,0.75) 50%, transparent 78%)",
        }}
      />

      {/* Left overlay — text readable, right stays vivid blue */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "linear-gradient(to right, rgba(8,18,75,0.80) 0%, rgba(8,18,75,0.50) 35%, rgba(8,18,75,0.10) 55%, transparent 70%)",
      }} />

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, transparent, #070b1f)" }} />

      {/* ── Content — left aligned like reference ── */}
      <div className="relative max-w-6xl mx-auto px-8 lg:px-12"
        style={{ paddingTop: "80px", paddingBottom: "64px" }}>

        {/* Badge */}
        <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5 }}
          className="mb-7">
          <div style={{
            display:"inline-flex", alignItems:"center", gap:"7px",
            background:"rgba(59,130,246,0.15)", border:"1px solid rgba(96,165,250,0.35)",
            borderRadius:"100px", padding:"5px 16px",
          }}>
            <Zap size={12} style={{ color:"#60A5FA", fill:"#60A5FA" }} />
            <span style={{ fontSize:"12px", fontWeight:400, color:"#50C5FD", letterSpacing:".05em" }}>
              Australia's AI-Powered Tradie Marketplace
            </span>
          </div>
        </motion.div>

        {/* Headline — left aligned, large */}
        <motion.h1
          initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.75, delay:0.1 }}
          style={{ fontSize:"clamp(40px,6vw,52px)", fontWeight:900, lineHeight:1.05, letterSpacing:"-.03em", margin:"0 0 24px", maxWidth:"580px" }}
        >
          <span style={{
            background:"linear-gradient(135deg,#F97316 0%,#FB923C 40%,#60A5FA 75%,#3B82F6 100%)",
            WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text",
          }}>Find. Estimate.</span><br />
          <span style={{
            background:"linear-gradient(135deg,#F97316 0%,#FB923C 40%,#60A5FA 75%,#3B82F6 100%)",
            WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text",
          }}>Compare. Hire.</span><br />
          <span style={{
            background:"linear-gradient(135deg,#F97316 0%,#FB923C 40%,#60A5FA 75%,#3B82F6 100%)",
            WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text",
          }}>Done.</span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ duration:0.6, delay:0.28 }}
          style={{ color:"rgba(255,255,255,0.75)", fontSize:"17px", lineHeight:1.65, marginBottom:"36px", maxWidth:"460px" }}
        >
          Post your job, get an AI estimate instantly,<br />
          compare verified tradies and hire with confidence.
        </motion.p>

        {/* Search bar — left aligned */}
        <motion.div initial={{ opacity:0, y:18 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.7, delay:0.38 }}>
          <div style={{
            display:"flex", maxWidth:"580px",
            background:"rgba(255,255,255,0.08)", backdropFilter:"blur(20px)",
            border:"1px solid rgba(255,255,255,0.18)", borderRadius:"14px", padding:"5px",
            boxShadow:"0 8px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.10)",
            marginBottom:"14px",
          }}>
            <div style={{ display:"flex", alignItems:"center", flex:1, gap:"10px", padding:"10px 14px" }}>
              <Search size={16} style={{ color:"rgba(255,255,255,0.45)", flexShrink:0 }} />
              <input
                type="text"
                placeholder="e.g. Kitchen renovation, Plumbing, Cleaning..."
                value={job}
                onChange={e => setJob(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleEstimate()}
                style={{ flex:1, background:"transparent", border:"none", outline:"none", color:"#FFFFFF", fontSize:"14px" }}
              />
              {job && (
                <button onClick={() => setJob("")}
                  style={{ color:"rgba(255,255,255,0.4)", background:"none", border:"none", cursor:"pointer", padding:0 }}>
                  <X size={14} />
                </button>
              )}
            </div>
            <button onClick={handleEstimate} disabled={loading} className="btn-ai-estimate">
              {loading ? (
                <><svg className="spin-icon" fill="none" viewBox="0 0 24 24">
                  <circle style={{ opacity:0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path style={{ opacity:0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>Estimating...</>
              ) : <>Get AI Estimate <ArrowRight size={14} /></>}
            </button>
          </div>

          {/* Pills */}
          <div style={{ display:"flex", gap:"6px", flexWrap:"wrap", alignItems:"center" }}>
            <span style={{ fontSize:"11px", color:"rgba(255,255,255,0.35)", lineHeight:"24px" }}>Try:</span>
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
              style={{
                maxWidth:"580px", marginTop:"16px",
                background:"rgba(255,255,255,0.07)", backdropFilter:"blur(32px)",
                border:"1px solid rgba(255,255,255,0.15)", borderRadius:"18px",
                padding:"20px", textAlign:"left",
              }}
            >
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"12px" }}>
                <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
                  <div style={{ width:"30px", height:"30px", background:"rgba(96,165,250,0.20)", borderRadius:"8px", display:"flex", alignItems:"center", justifyContent:"center", border:"1px solid rgba(96,165,250,0.30)" }}>
                    <Zap size={14} style={{ color:"#60A5FA", fill:"#60A5FA" }} />
                  </div>
                  <div>
                    <p style={{ margin:0, fontWeight:700, color:"#FFFFFF", fontSize:"14px" }}>AI Estimate</p>
                    {locationName && <p style={{ margin:0, fontSize:"11px", color:"rgba(255,255,255,0.5)" }}>📍 {locationName}</p>}
                  </div>
                </div>
                <button onClick={() => setEstimate("")}
                  style={{ color:"rgba(255,255,255,0.4)", background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.15)", borderRadius:"50%", width:"24px", height:"24px", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
                  <X size={13} />
                </button>
              </div>

              {estimate.split("\n").find(l => l.startsWith("🔧")) && (
                <div style={{ display:"inline-flex", marginBottom:"10px", background:"rgba(96,165,250,0.12)", border:"1px solid rgba(96,165,250,0.25)", borderRadius:"100px", padding:"2px 12px" }}>
                  <span style={{ fontSize:"12px", color:"#93C5FD", fontWeight:600 }}>{estimate.split("\n").find(l => l.startsWith("🔧"))}</span>
                </div>
              )}

              <p style={{ fontSize:"14px", color:"rgba(255,255,255,0.75)", whiteSpace:"pre-line", lineHeight:1.7, margin:"0 0 16px" }}>
                {estimate.split("\n").filter(l => !l.startsWith("🔧")).join("\n")}
              </p>

              <Link href="/login" style={{ textDecoration:"none", display:"block" }}>
                <button className="btn-find-tradie">Find a Tradie for This Job <ArrowRight size={14} /></button>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CTA buttons */}
        {!estimate && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.55 }}
            style={{ display:"flex", gap:"12px", marginTop:"24px", flexWrap:"wrap" }}>
            <Link href="/login">
              <button className="btn-find-tradie-cta">I Want a Tradie</button>
            </Link>
            <Link href="/login-tradie">
              <button className="btn-iam-tradie-cta">I am a Tradie</button>
            </Link>
          </motion.div>
        )}

        {/* Trust badges */}
        {!estimate && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.65 }}
            style={{ display:"flex", gap:"20px", marginTop:"20px", flexWrap:"wrap" }}>
            {[
              { icon:"🛡️", text:"Verified Tradies" },
              { icon:"💰", text:"Upfront Pricing" },
              { icon:"🔒", text:"Secure Payments" },
            ].map(b => (
              <div key={b.text} style={{ display:"flex", alignItems:"center", gap:"6px" }}>
                <span style={{ fontSize:"15px" }}>{b.icon}</span>
                <span style={{ fontSize:"11px", color:"#00FF88", fontWeight:200 }}>{b.text}</span>
              </div>
            ))}
          </motion.div>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes shimmer1 {
          0%,100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes shimmer2 {
          0%,100% { background-position: 100% 50%; }
          50% { background-position: 0% 50%; }
        }
        @keyframes shimmer3 {
          0%,100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        .btn-find-tradie-cta {
          background: linear-gradient(135deg, #1D4ED8, #2563EB);
          border: none; border-radius: 12px; padding: 13px 30px;
          color: #FFFFFF; font-weight: 700; font-size: 15px; cursor: pointer;
          box-shadow: 0 4px 20px rgba(37,99,235,0.55);
          transition: all 0.2s;
        }
        .btn-find-tradie-cta:hover { background: linear-gradient(135deg,#2563EB,#3B82F6); transform: translateY(-1px); }

        .btn-iam-tradie-cta {
          background: linear-gradient(135deg, #F97316, #EA580C);
          border: none; border-radius: 12px; padding: 13px 30px;
          color: #FFFFFF; font-weight: 700; font-size: 15px; cursor: pointer;
          box-shadow: 0 4px 20px rgba(249,115,22,0.55);
          transition: all 0.2s;
        }
        .btn-iam-tradie-cta:hover { background: linear-gradient(135deg,#FB923C,#F97316); transform: translateY(-1px); }
        input::placeholder { color: rgba(255,255,255,0.30); }

        .btn-ai-estimate {
          background: linear-gradient(135deg, #3B82F6, #6366F1);
          border: none; border-radius: 10px; padding: 10px 20px;
          color: #FFFFFF; font-weight: 700; font-size: 14px; cursor: pointer;
          display: flex; align-items: center; gap: 6px;
          flex-shrink: 0; white-space: nowrap;
          box-shadow: 0 4px 20px rgba(99,102,241,0.45);
        }
        .btn-ai-estimate:disabled { opacity: 0.5; cursor: not-allowed; }
        .spin-icon { animation: spin 1s linear infinite; width: 14px; height: 14px; }

        .btn-find-tradie {
          width: 100%; background: linear-gradient(135deg, #3B82F6, #6366F1);
          border: none; border-radius: 12px; padding: 12px; color: white;
          font-weight: 700; font-size: 14px; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 6px;
          box-shadow: 0 4px 20px rgba(99,102,241,0.40);
        }
        .pill-btn {
          background: rgba(0,149,255,0.12);
          border: 1px solid rgba(0,149,255,0.45);
          border-radius: 100px; padding: 4px 12px;
          color: #38BDF8; font-size: 11px; cursor: pointer;
          font-weight: 600;
        }
        .pill-btn:hover { border-color: rgba(249,115,22,0.55); color: #FB923C; background: rgba(249,115,22,0.10); }
      `}</style>
    </section>
  );
}