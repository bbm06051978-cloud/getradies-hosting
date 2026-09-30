"use client";
import { useState, useEffect } from "react";

type LegalModalProps = {
  href: string;
  label: string;
  className?: string;
  style?: React.CSSProperties;
};

export default function LegalModal({ href, label, className, style }: LegalModalProps) {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(href + "?raw=1");
      if (res.ok) {
        setContent(await res.text());
      }
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    if (open && !content) load();
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={className}
        style={style}
      >
        {label}
      </button>

      {open && (
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 9999,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "16px",
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
        >
          <div style={{
            backgroundColor: "#fff", borderRadius: "16px",
            width: "100%", maxWidth: "720px",
            maxHeight: "85vh", display: "flex", flexDirection: "column",
            boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          }}>
            {/* Header */}
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "16px 20px", borderBottom: "1px solid #E5E7EB",
            }}>
              <span style={{ fontWeight: 700, fontSize: "16px", color: "#111827" }}>{label}</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  fontSize: "22px", color: "#6B7280", lineHeight: 1,
                }}
              >✕</button>
            </div>
            {/* Content */}
            <div style={{ overflowY: "auto", padding: "20px 24px", flex: 1 }}>
              {loading ? (
                <p style={{ color: "#9CA3AF", textAlign: "center", marginTop: "40px" }}>Loading...</p>
              ) : (
                <iframe
                  src={href}
                  style={{ width: "100%", height: "600px", border: "none" }}
                  title={label}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
