// src/app/forgot-password/page.tsx
"use client";
import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [sent, setSent]         = useState(false);
  const [error, setError]       = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim()) { setError("Please enter your email address."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError("Please enter a valid email address."); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.toLowerCase().trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setSent(true);
        // Store email for next step
        sessionStorage.setItem("reset_email", email.toLowerCase().trim());
      } else {
        setError(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setError("Could not connect. Please check your internet connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFF] flex flex-col items-center justify-center px-4">

      {/* Logo */}
      <Link href="/" className="mb-8">
        <img src="/imports/GeTradie_Logo.webp" alt="GeTradie" className="h-10 object-contain" />
      </Link>

      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-xl border border-blue-50 overflow-hidden">

          {/* Header */}
          <div className="bg-gradient-to-r from-[#0047AB] to-[#003d99] px-8 py-8 text-center">
            <div className="text-4xl mb-3">🔐</div>
            <h1 className="text-2xl font-black text-white mb-1">Forgot Password?</h1>
            <p className="text-blue-200 text-sm">Enter your email and we will send you a reset code</p>
          </div>

          <div className="px-8 py-8">
            {!sent ? (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(""); }}
                    className={`w-full rounded-xl border-2 px-4 py-3 text-sm outline-none transition bg-gray-50
                      focus:border-[#0047AB] ${error ? "border-red-400" : "border-gray-200"}`}
                    autoFocus
                  />
                  {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-2xl bg-[#0047AB] hover:bg-[#003d99] text-white
                    font-black text-base transition disabled:opacity-60 mt-2"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4"/>
                        <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8z"/>
                      </svg>
                      Sending Code...
                    </span>
                  ) : "Send Reset Code →"}
                </button>

                <Link href="/login" className="text-center text-sm text-gray-400 hover:text-[#0047AB] transition">
                  ← Back to Sign In
                </Link>
              </form>
            ) : (
              // Success state
              <div className="text-center">
                <div className="text-5xl mb-4">📬</div>
                <h2 className="text-xl font-black text-gray-900 mb-2">Check Your Email</h2>
                <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                  We sent a 6-digit code to<br/>
                  <strong className="text-gray-800">{email}</strong><br/>
                  The code expires in <strong>15 minutes</strong>.
                </p>
                <Link
                  href="/verify-otp"
                  className="block w-full py-4 rounded-2xl bg-[#0047AB] hover:bg-[#003d99]
                    text-white font-black text-base text-center transition"
                >
                  Enter Code →
                </Link>
                <button
                  onClick={() => { setSent(false); setEmail(""); }}
                  className="mt-4 text-sm text-gray-400 hover:text-gray-600 transition"
                >
                  Use a different email
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
