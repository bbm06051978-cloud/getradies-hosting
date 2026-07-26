"use client";
import { useState } from "react";
import { Mail } from "lucide-react";
import Link from "next/link";
import { motion } from "motion/react";

export default function ForgotPasswordPage() {
  const [email, setEmail]     = useState("");
  const [emailError, setEmailError] = useState("");
  const [sent, setSent]       = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const validateEmail = (val: string) => {
    if (!val) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return "Enter a valid email address";
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validateEmail(email);
    if (err) { setEmailError(err); return; }

    setLoading(true);
    setServerError("");
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setServerError(data.error || "No account found with this email address.");
        return;
      }
      setSent(true);
    } catch { setServerError("Something went wrong. Please try again."); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{
      background: "linear-gradient(135deg, #060d4a 0%, #0d1a8a 50%, #1a3adb 100%)"
    }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 w-full max-w-md shadow-2xl">

        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Mail size={28} className="text-blue-300"/>
          </div>
          <h1 className="text-2xl font-bold text-white">Forgot Password?</h1>
          <p className="text-blue-200 text-sm mt-1">Enter your email and we&apos;ll send you a reset link</p>
        </div>

        {sent ? (
          <div className="text-center">
            <div className="bg-green-500/20 border border-green-400 rounded-xl p-4 mb-5">
              <p className="text-green-300 font-semibold text-sm">✅ Reset link sent!</p>
              <p className="text-green-200 text-xs mt-1">Check your email inbox. The link expires in 1 hour.</p>
            </div>
            <Link href="/login" className="text-blue-300 text-sm hover:text-white hover:underline">
              ← Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {serverError && (
              <div className="bg-red-500/20 border border-red-400 text-red-200 text-sm rounded-xl px-4 py-3">
                {serverError}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">Email Address</label>
              <div className={`flex items-center border-2 rounded-xl px-4 py-3 gap-3 bg-white/5 transition-colors ${
                emailError ? "border-red-400" : "border-white/20 focus-within:border-blue-400"
              }`}>
                <Mail size={16} className="text-gray-400 flex-shrink-0"/>
                <input type="email" placeholder="Enter your email address" value={email}
                  onChange={e => { setEmail(e.target.value); setEmailError(validateEmail(e.target.value)); }}
                  className="flex-1 text-sm text-white outline-none bg-transparent placeholder-white/40"/>
              </div>
              {emailError && <p className="text-red-400 text-xs mt-1">{emailError}</p>}
            </div>

            <motion.button type="submit" disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold text-sm transition-colors">
              {loading ? "Sending..." : "Send Reset Link"}
            </motion.button>

            <div className="text-center">
              <Link href="/login" className="text-blue-300 text-sm hover:text-white hover:underline">
                ← Back to Login
              </Link>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
}
