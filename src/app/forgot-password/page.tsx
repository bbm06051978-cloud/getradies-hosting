"use client";
import { useState } from "react";
import { Mail } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setSent(true);
    } catch {}
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#060d4a] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-xl">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Mail size={24} className="text-blue-900"/>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Forgot Password?</h1>
          <p className="text-gray-500 text-sm mt-1">Enter your email and we&apos;ll send you a reset link</p>
        </div>

        {sent ? (
          <div className="text-center">
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
              <p className="text-green-700 text-sm font-semibold">Reset link sent!</p>
              <p className="text-green-600 text-xs mt-1">Check your email for the reset link. For MVP the link appears in the server console.</p>
            </div>
            <Link href="/login" className="text-blue-600 text-sm hover:underline">Back to Login</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="Enter your email" required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400"/>
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-blue-900 hover:bg-blue-800 text-white py-3 rounded-xl font-bold text-sm transition-colors">
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
            <div className="text-center">
              <Link href="/login" className="text-gray-500 text-sm hover:text-gray-700">Back to Login</Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}