"use client";
import { useState, useEffect } from "react";
import { Monitor, X } from "lucide-react";

export function MobileWarning() {
  const [isMobile, setIsMobile] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  if (!isMobile || dismissed) return null;

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      background: "#060d4a", zIndex: 99999,
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "24px", textAlign: "center",
    }}>
      <div style={{
        background: "rgba(255,255,255,0.08)",
        border: "1px solid rgba(255,255,255,0.15)",
        borderRadius: "24px", padding: "32px 24px",
        maxWidth: "340px", width: "100%",
      }}>
        <div style={{
          width: "64px", height: "64px", borderRadius: "20px",
          background: "rgba(249,115,22,0.2)",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 20px",
        }}>
          <Monitor size={32} color="#F97316"/>
        </div>

        <h2 style={{ color: "#fff", fontSize: "20px", fontWeight: 700, marginBottom: "12px" }}>
          Best on Desktop
        </h2>
        <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "14px", lineHeight: 1.6, marginBottom: "24px" }}>
          The GeTradie dashboard is optimised for desktop. For the best experience please use a laptop or desktop computer.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <a href="/" style={{
            display: "block", background: "#F97316", color: "white",
            padding: "12px", borderRadius: "12px",
            fontWeight: 700, fontSize: "14px", textDecoration: "none",
          }}>
            Go to Homepage
          </a>
          <button onClick={() => setDismissed(true)} style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
            background: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.2)",
            color: "white", padding: "12px", borderRadius: "12px",
            fontWeight: 600, fontSize: "14px", cursor: "pointer",
            width: "100%",
          }}>
            Continue Anyway
          </button>
        </div>

        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px", marginTop: "16px" }}>
          Tip: Install GeTradie as an app from your browser menu for a better mobile experience.
        </p>
      </div>
    </div>
  );
}
