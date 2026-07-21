"use client";
import { useState, useEffect, useRef } from "react";
import { Search, Zap, ArrowRight, Sparkles } from "lucide-react";

const PLACEHOLDERS = [
  "e.g. Fix leaking tap in bathroom...",
  "e.g. Paint 3 bedroom house exterior...",
  "e.g. Install ceiling fan in bedroom...",
  "e.g. Blocked drain in kitchen sink...",
  "e.g. Move furniture to new apartment...",
  "e.g. Build a deck in backyard...",
];

type Props = {
  onEstimate: (job: string) => void;
  loading: boolean;
};

export function HeroSearchBox({ onEstimate, loading }: Props) {
  const [job, setJob]                   = useState("");
  const [placeholder, setPlaceholder]   = useState("");
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const [isTyping, setIsTyping]         = useState(true);
  const [isFocused, setIsFocused]       = useState(false);
  const [isHovered, setIsHovered]       = useState(false);
  const inputRef                        = useRef<HTMLInputElement>(null);
  const charRef                         = useRef(0);
  const timerRef                        = useRef<NodeJS.Timeout>();

  // Typing animation
  useEffect(() => {
    const target = PLACEHOLDERS[placeholderIdx];

    if (isTyping) {
      if (charRef.current < target.length) {
        timerRef.current = setTimeout(() => {
          setPlaceholder(target.slice(0, charRef.current + 1));
          charRef.current += 1;
        }, 45);
      } else {
        timerRef.current = setTimeout(() => setIsTyping(false), 2000);
      }
    } else {
      if (charRef.current > 0) {
        timerRef.current = setTimeout(() => {
          setPlaceholder(target.slice(0, charRef.current - 1));
          charRef.current -= 1;
        }, 25);
      } else {
        setPlaceholderIdx(i => (i + 1) % PLACEHOLDERS.length);
        setIsTyping(true);
      }
    }

    return () => clearTimeout(timerRef.current);
  }, [placeholder, isTyping, placeholderIdx]);

  const handleSubmit = () => {
    if (job.trim()) onEstimate(job);
  };

  const glowColor = isFocused
    ? "rgba(249,115,22,0.6)"
    : isHovered
    ? "rgba(249,115,22,0.3)"
    : "rgba(255,255,255,0.1)";

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: "relative",
        maxWidth: "600px",
        width: "100%",
        transition: "all 0.3s ease",
      }}
    >
      {/* Glow effect */}
      <div style={{
        position: "absolute",
        inset: "-2px",
        borderRadius: "18px",
        background: `linear-gradient(135deg, ${glowColor}, rgba(99,102,241,0.3))`,
        filter: "blur(8px)",
        transition: "all 0.4s ease",
        zIndex: 0,
      }}/>

      {/* Glass container */}
      <div
        onClick={() => inputRef.current?.focus()}
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          alignItems: "center",
          background: isFocused
            ? "rgba(255,255,255,0.18)"
            : "rgba(255,255,255,0.10)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: isFocused
            ? "1.5px solid rgba(249,115,22,0.6)"
            : "1.5px solid rgba(255,255,255,0.25)",
          borderRadius: "16px",
          padding: "6px",
          flexWrap: "wrap",
          gap: "6px",
          boxShadow: isFocused
            ? "0 8px 40px rgba(249,115,22,0.2), inset 0 1px 0 rgba(255,255,255,0.15)"
            : "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.12)",
          transition: "all 0.3s ease",
          cursor: "text",
        }}
      >
        {/* Search icon */}
        <div style={{ marginRight: "10px", flexShrink: 0 }}>
          {loading ? (
            <svg className="animate-spin" width="18" height="18" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="rgba(249,115,22,0.8)" strokeWidth="4"/>
              <path className="opacity-75" fill="rgba(249,115,22,0.8)" d="M4 12a8 8 0 018-8v8H4z"/>
            </svg>
          ) : (
            <Search size={18} color={isFocused ? "rgba(249,115,22,0.9)" : "rgba(255,255,255,0.5)"} style={{ transition: "all 0.3s" }}/>
          )}
        </div>

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          value={job}
          onChange={e => setJob(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSubmit()}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
         style={{
            flex: 1,
            minWidth: "120px",
            background: "transparent",
            border: "none",
            outline: "none",
            color: "#FFFFFF",
            fontSize: "14px",
            letterSpacing: "0.01em",
          }}
            />

        {/* CTA Button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            background: loading ? "rgba(255,255,255,0.5)" : "#ffffff",
            color: "#0047ff",
            border: "none",
            borderRadius: "12px",
            padding: "10px 14px",
            fontSize: "12px",
            fontWeight: 700,
            cursor: loading ? "not-allowed" : "pointer",
            flexShrink: 0,
            boxShadow: "0 4px 15px rgba(249,115,22,0.4)",
            transition: "all 0.2s ease",
            whiteSpace: "nowrap",
            maxWidth: "160px",
          }}
        >
          <Zap size={13} style={{ fill: "#fff" }}/>
          {loading ? "Estimating..." : "Get AI Estimate"}
          {!loading && <ArrowRight size={13}/>}
        </button>
      </div>

      {/* Sparkle hints */}
      {!isFocused && !job && (
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          marginTop: "10px",
          paddingLeft: "4px",
        }}>
          <Sparkles size={13} color="#F97316"/>
          <span style={{ fontSize: "14px", color: "#FFFFFF", fontWeight: 600 }}>
            Powered by AI · Accurate to 80% · Free to use
          </span>
        </div>
      )}
    </div>
  );
}
