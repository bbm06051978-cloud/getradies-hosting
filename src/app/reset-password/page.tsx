// src/app/reset-password/page.tsx
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword]   = useState("");
  const [confirm, setConfirm]     = useState("");
  const [showPw, setShowPw]       = useState(false);
  const [showCf, setShowCf]       = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");
  const [success, setSuccess]     = useState(false);
  const [email, setEmail]         = useState("");

  const pwChecks = [
    { label: "8+ characters", pass: password.length >= 8 },
    { label: "Uppercase",     pass: /[A-Z]/.test(password) },
    { label: "Lowercase",     pass: /[a-z]/.test(password) },
    { label: "Number",        pass: /[0-9]/.test(password) },
  ];
  const pwStrong = pwChecks.every((c) => c.pass);

  useEffect(() => {
    const stored = sessionStorage.getItem("reset_email");
    if (!stored) { router.push("/forgot-password"); return; }
    setEmail(stored);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!pwStrong) { setError("Password does not meet all requirements."); return; }
    if (password !== confirm) { setError("Passwords do not match."); return; }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        sessionStorage.removeItem("reset_email");
        setTimeout(() => router.push("/login"), 3000);
      } else {
        setError(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setError("Could not connect. Please try again.");
    } finally {
      setLoading(false);
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
            <div className="text-4xl mb-3">🔑</div>
            <h1 className="text-2xl font-black text-white mb-1">Set New Password</h1>
            <p className="text-blue-200 text-sm">Choose a strong password for your account</p>
          </div>

          <div className="px-8 py-8">
            {!success ? (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                {/* New Password */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    New Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPw ? "text" : "password"}
                      placeholder="Min 8 characters"
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setError(""); }}
                      className="w-full rounded-xl border-2 px-4 py-3 pr-16 text-sm outline-none
                        transition bg-gray-50 focus:border-[#0047AB] border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600"
                    >
                      {showPw ? "Hide" : "Show"}
                    </button>
                  </div>

                  {/* Strength indicators */}
                  {password.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {pwChecks.map((c) => (
                        <span
                          key={c.label}
                          className={`text-xs font-medium px-2 py-0.5 rounded-full transition
                            ${c.pass ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-400"}`}
                        >
                          {c.pass ? "✓" : "○"} {c.label}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showCf ? "text" : "password"}
                      placeholder="Repeat your password"
                      value={confirm}
                      onChange={(e) => { setConfirm(e.target.value); setError(""); }}
                      className={`w-full rounded-xl border-2 px-4 py-3 pr-16 text-sm outline-none
                        transition bg-gray-50 focus:border-[#0047AB]
                        ${confirm && confirm !== password ? "border-red-300" : confirm && confirm === password ? "border-green-400" : "border-gray-200"}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowCf((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600"
                    >
                      {showCf ? "Hide" : "Show"}
                    </button>
                  </div>
                  {confirm && confirm === password && (
                    <p className="text-xs text-green-600 mt-1">✓ Passwords match</p>
                  )}
                  {confirm && confirm !== password && (
                    <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
                  )}
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !pwStrong || password !== confirm}
                  className="w-full py-4 rounded-2xl bg-[#0047AB] hover:bg-[#003d99] text-white
                    font-black text-base transition disabled:opacity-50 mt-2"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4"/>
                        <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8z"/>
                      </svg>
                      Resetting Password...
                    </span>
                  ) : "Reset Password →"}
                </button>
              </form>
            ) : (
              // Success state
              <div className="text-center">
                <div className="text-5xl mb-4">🎉</div>
                <h2 className="text-xl font-black text-gray-900 mb-2">Password Reset!</h2>
                <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                  Your password has been updated successfully.<br/>
                  Redirecting you to sign in...
                </p>
                <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-[#0047AB] h-1.5 rounded-full animate-[width_3s_ease-in-out]" style={{width:"100%",transition:"width 3s"}}/>
                </div>
                <Link href="/login" className="block mt-6 text-sm text-[#0047AB] font-bold hover:underline">
                  Go to Sign In →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
