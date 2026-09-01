"use client";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";

function UnsubscribePage() {
  const params = useSearchParams();
  const email = params.get("email");
  const success = params.get("success");
  const error = params.get("error");

  return (
    <div style={{ minHeight: "100vh", background: "#F8FAFF", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <div style={{ background: "#fff", borderRadius: "20px", padding: "40px", maxWidth: "480px", width: "100%", textAlign: "center", boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
        {success ? (
          <>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>✅</div>
            <h1 style={{ color: "#111827", fontSize: "22px", fontWeight: 800, marginBottom: "12px" }}>Successfully Unsubscribed</h1>
            <p style={{ color: "#667085", fontSize: "14px", lineHeight: 1.7, marginBottom: "8px" }}>
              <strong>{decodeURIComponent(email || "")}</strong> has been removed from our mailing list.
            </p>
            <p style={{ color: "#667085", fontSize: "13px", lineHeight: 1.7, marginBottom: "24px" }}>
              You will no longer receive marketing emails from GeTradie. Note: you may still receive transactional emails such as booking confirmations and receipts.
            </p>
            <Link href="/" style={{ display: "inline-block", background: "#0047AB", color: "#fff", borderRadius: "10px", padding: "12px 28px", fontWeight: 700, fontSize: "14px", textDecoration: "none" }}>
              Go to Home →
            </Link>
          </>
        ) : error ? (
          <>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>❌</div>
            <h1 style={{ color: "#111827", fontSize: "22px", fontWeight: 800, marginBottom: "12px" }}>Something went wrong</h1>
            <p style={{ color: "#667085", fontSize: "14px", marginBottom: "24px" }}>
              We couldn't process your unsubscribe request. Please email us at <a href="mailto:support@getradie.com.au" style={{ color: "#0047AB" }}>support@getradie.com.au</a> and we'll remove you manually.
            </p>
            <Link href="/" style={{ display: "inline-block", background: "#0047AB", color: "#fff", borderRadius: "10px", padding: "12px 28px", fontWeight: 700, fontSize: "14px", textDecoration: "none" }}>
              Go to Home →
            </Link>
          </>
        ) : (
          <>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>📧</div>
            <h1 style={{ color: "#111827", fontSize: "22px", fontWeight: 800, marginBottom: "12px" }}>Unsubscribe from GeTradie</h1>
            <p style={{ color: "#667085", fontSize: "14px", lineHeight: 1.7, marginBottom: "24px" }}>
              Use the unsubscribe link in the email you received to unsubscribe, or contact us at <a href="mailto:support@getradie.com.au" style={{ color: "#0047AB" }}>support@getradie.com.au</a>.
            </p>
            <Link href="/" style={{ display: "inline-block", background: "#0047AB", color: "#fff", borderRadius: "10px", padding: "12px 28px", fontWeight: 700, fontSize: "14px", textDecoration: "none" }}>
              Go to Home →
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UnsubscribePage />
    </Suspense>
  );
}
