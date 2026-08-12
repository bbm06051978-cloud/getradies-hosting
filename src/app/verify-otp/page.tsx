// src/app/verify-otp/page.tsx
"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function VerifyOTPPage() {
  const router = useRouter();
  const [otp, setOtp]           = useState(["","","","","",""]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [resending, setResending] = useState(false);
  const [resent, setResent]     = useState(false);
  const [countdown, setCountdown] = useState(15 * 60); // 15 min
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [email, setEmail]       = useState("");

  useEffect(() => {
    const stored = sessionStorage.getItem("reset_email");
    if (!stored) { router.push("/forgot-password"); return; }
    setEmail(stored);

    // Countdown timer
    const interval = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) { clearInterval(interval); return 0; }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // Handle each digit input
  const handleDigit = (index: number, val: string) => {
    const digit = val.replace(/\D/g, "").slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);
    setError("");
    // Auto-advance
    if (digit && index < 5) inputRefs.current[index + 1]?.focus();
    // Auto-submit when all 6 filled
    if (digit && index === 5 && newOtp.every((d) => d)) {
      handleVerify(newOtp.join(""));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(""));
      handleVerify(pasted);
    }
  };

  const handleVerify = async (code?: string) => {
    const otpValue = code || otp.join("");
    if (otpValue.length < 6) { setError("Please enter all 6 digits."); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otpValue }),
      });
      const data = await res.json();
      if (data.success) {
        router.push("/reset-password");
      } else {
        setError(data.error || "Invalid code. Please try again.");
        setOtp(["","","","","",""]);
        inputRefs.current[0]?.focus();
      }
    } catch {
      setError("Could not connect. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setError("");
    try {
      await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setResent(true);
      setCountdown(15 * 60);
      setOtp(["","","","","",""]);
      inputRefs.current[0]?.focus();
      setTimeout(() => setResent(false), 4000);
    } catch {
      setError("Could not resend. Please try again.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFF] flex flex-col items-center justify-center px-4">

      <Link href="/" className="mb-8">
        <img src="/imports/GeTradie_Logo.png" alt="GeTradie" className="h-10 object-contain" />
      </Link>

      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-xl border border-blue-50 overflow-hidden">

          {/* Header */}
          <div className="bg-gradient-to-r from-[#0047AB] to-[#003d99] px-8 py-8 text-center">
            <div className="text-4xl mb-3">📱</div>
            <h1 className="text-2xl font-black text-white mb-1">Enter Your Code</h1>
            <p className="text-blue-200 text-sm">
              We sent a 6-digit code to<br/>
              <strong className="text-white">{email}</strong>
            </p>
          </div>

          <div className="px-8 py-8">

            {/* Countdown */}
            <div className={`text-center mb-6 text-sm font-semibold
              ${countdown < 60 ? "text-red-500" : "text-gray-400"}`}>
              {countdown > 0 ? `Code expires in ${formatTime(countdown)}` : "Code has expired — please request a new one"}
            </div>

            {/* 6-digit OTP inputs */}
            <div className="flex gap-3 justify-center mb-6" onPaste={handlePaste}>
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => { inputRefs.current[i] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleDigit(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  autoFocus={i === 0}
                  className={`w-12 h-14 text-center text-2xl font-black rounded-xl border-2
                    outline-none transition bg-gray-50
                    ${error ? "border-red-400 bg-red-50" : digit ? "border-[#0047AB] bg-blue-50 text-[#0047AB]" : "border-gray-200"}
                    focus:border-[#0047AB] focus:bg-blue-50`}
                />
              ))}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600 text-center mb-4">
                {error}
              </div>
            )}

            {resent && (
              <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm text-green-700 text-center mb-4">
                ✓ New code sent to your email
              </div>
            )}

            {/* Verify button */}
            <button
              onClick={() => handleVerify()}
              disabled={loading || otp.some((d) => !d) || countdown === 0}
              className="w-full py-4 rounded-2xl bg-[#0047AB] hover:bg-[#003d99] text-white
                font-black text-base transition disabled:opacity-50 mb-4"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4"/>
                    <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Verifying...
                </span>
              ) : "Verify Code →"}
            </button>

            {/* Resend */}
            <div className="text-center">
              <span className="text-sm text-gray-400">Did not receive the code? </span>
              <button
                onClick={handleResend}
                disabled={resending || countdown > 13 * 60}
                className="text-sm font-bold text-[#0047AB] disabled:text-gray-300 transition hover:underline"
              >
                {resending ? "Sending..." : "Resend"}
              </button>
              {countdown > 13 * 60 && (
                <span className="text-xs text-gray-300 ml-1">(wait {formatTime(countdown - 13*60)})</span>
              )}
            </div>

            <Link href="/forgot-password" className="block text-center text-sm text-gray-400 hover:text-gray-600 mt-4">
              ← Use a different email
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
