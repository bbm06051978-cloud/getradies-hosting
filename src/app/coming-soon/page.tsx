"use client";
import { useState } from "react";
import Link from "next/link";

export default function ComingSoonPage() {
  const [email, setEmail] = useState("");
  const [suburb, setSuburb] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) { setError("Please enter your email address."); return; }
    setLoading(true);
    setError("");
    try {
      await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), suburb: suburb.trim() }),
      });
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0047AB 0%, #003d94 50%, #172B4D 100%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <style>{`
        .waitlist-input::placeholder { color: #98A2B3 !important; opacity: 1; }
        .waitlist-input { color: #172B4D !important; }
      `}</style>

      {/* Logo */}
      <Link href="/">
        <img src="/imports/GeTradie_Logo.webp" alt="GeTradie" style={{ height: "48px", objectFit: "contain", marginBottom: "40px" }} />
      </Link>

      <div style={{ background: "#FFFFFF", borderRadius: "20px", padding: "40px", maxWidth: "520px", width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.3)", textAlign: "center" }}>

        {/* Icon */}
        <div style={{ fontSize: "56px", marginBottom: "16px" }}>🚀</div>

        <h1 style={{ color: "#17324D", fontSize: "28px", fontWeight: 800, margin: "0 0 12px" }}>
          Coming to your area soon!
        </h1>

        <p style={{ color: "#667085", fontSize: "15px", lineHeight: 1.7, margin: "0 0 8px" }}>
          GeTradie is currently available in <strong style={{ color: "#0047AB" }}>Greater Parramatta</strong> and surrounding Western Sydney suburbs.
        </p>

        <p style={{ color: "#667085", fontSize: "14px", lineHeight: 1.7, margin: "0 0 28px" }}>
          We're expanding fast! Enter your details below and we'll notify you the moment we launch in your area.
        </p>

        {/* Coverage area */}
        <div style={{ background: "#F5F8FC", borderRadius: "12px", padding: "16px", marginBottom: "28px", textAlign: "left" }}>
          <p style={{ color: "#17324D", fontSize: "13px", fontWeight: 700, margin: "0 0 8px" }}>📍 Currently serving:</p>
          <p style={{ color: "#667085", fontSize: "13px", margin: 0, lineHeight: 1.7 }}>
            Parramatta · Blacktown · Bankstown · Liverpool · Castle Hill · Fairfield · Auburn · Merrylands · Ryde · Strathfield and surrounds
          </p>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={e => { setEmail(e.target.value); setError(""); }}
              className="waitlist-input"
              style={{ borderRadius: "10px", border: "1.5px solid #D0D5DD", padding: "12px 16px", fontSize: "14px", color: "#172B4D", background: "#FFFFFF", outline: "none", width: "100%", boxSizing: "border-box" } as any}
            />
            <input
              type="text"
              placeholder="Your suburb (optional)"
              value={suburb}
              onChange={e => setSuburb(e.target.value)}
              className="waitlist-input"
              style={{ borderRadius: "10px", border: "1.5px solid #D0D5DD", padding: "12px 16px", fontSize: "14px", color: "#172B4D", background: "#FFFFFF", outline: "none", width: "100%", boxSizing: "border-box" } as any}
            />
            {error && <p style={{ color: "#D92D20", fontSize: "12px", margin: 0 }}>{error}</p>}
            <button
              type="submit"
              disabled={loading}
              style={{
                background: loading ? "#93AECF" : "#0047AB",
                color: "#fff", border: "none", borderRadius: "10px",
                padding: "13px", fontSize: "14px", fontWeight: 700,
                cursor: loading ? "not-allowed" : "pointer",
                boxShadow: "0 4px 14px rgba(0,71,171,0.3)",
              }}
            >
              {loading ? "Submitting..." : "Notify me when you launch →"}
            </button>
          </form>
        ) : (
          <div style={{ background: "#F0FDF4", border: "1px solid #16803C", borderRadius: "12px", padding: "20px" }}>
            <span style={{ fontSize: "32px" }}>✅</span>
            <p style={{ color: "#16803C", fontWeight: 700, fontSize: "15px", margin: "8px 0 4px" }}>You're on the list!</p>
            <p style={{ color: "#15803D", fontSize: "13px", margin: 0 }}>We'll email you as soon as GeTradie launches in your area.</p>
          </div>
        )}

        <div style={{ marginTop: "28px", paddingTop: "20px", borderTop: "1px solid #F2F4F7" }}>
          <p style={{ color: "#98A2B3", fontSize: "12px", margin: "0 0 12px" }}>Already in Greater Parramatta?</p>
          <Link href="/signup" style={{ color: "#0047AB", fontWeight: 700, fontSize: "13px" }}>
            Create your account →
          </Link>
        </div>

      </div>

      <div style={{ marginTop: "20px", display: "flex", gap: "16px", alignItems: "center" }}>
        <Link href="/dashboard" style={{ color: "rgba(255,255,255,0.8)", fontSize: "13px", fontWeight: 600 }}>
          ← Go to Dashboard
        </Link>
        <span style={{ color: "rgba(255,255,255,0.3)" }}>|</span>
        <Link href="/" style={{ color: "rgba(255,255,255,0.8)", fontSize: "13px", fontWeight: 600 }}>
          Go to Home →
        </Link>
      </div>
      <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "12px", marginTop: "16px" }}>
        © 2026 GeTradie Pty Ltd · <Link href="/privacy" style={{ color: "rgba(255,255,255,0.5)" }}>Privacy</Link> · <Link href="/terms" style={{ color: "rgba(255,255,255,0.5)" }}>Terms</Link>
      </p>

    </div>
  );
}
