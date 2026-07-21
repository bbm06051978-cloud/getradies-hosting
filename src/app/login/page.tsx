"use client";

import { useState, Suspense } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { User, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

function LoginPageInner() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed.");
        setLoading(false);
        return;
      }

     if (data.user.role === "HOMEOWNER") {
        router.push(redirect);
      } else if (data.user.role === "ADMIN") {
        router.push("/admin");
      } else {
        setError("Please use the Tradie login page.");
        setLoading(false);
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundImage: "url(/imports/hero_baground_4.png)",
        backgroundSize: "cover",
        backgroundPosition: "left",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Navbar */}
      <nav
        className="sticky top-0 z-50 bg-cover bg-center bg-no-repeat"
        style={{ backgroundColor: "white" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Link href="/">
            <div className="relative h-16 w-40">
              <Image
                src="/imports/GeTradie_Logo1111.png"
                alt="GeTradie"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-900 hover:text-red-600 text-sm font-medium transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>
        </div>
      </nav>

      {/* Login Card */}
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}

className="w-full max-w-md bg-blue-1000 backdrop-blur-md rounded-2xl shadow-2xl p-8"        >
          

          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-100">Welcome Back</h1>
            <p className="text-blue-500 text-sm mt-1">
              Sign in to find and hire trusted tradies
            </p>
          </div>



          {/* Error message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-4"
            >
              {error}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-100 mb-1">
                Username
              </label>
              <div className="flex items-center border-2 border-gray-200 focus-within:border-blue-400 rounded-xl px-4 py-3 gap-3 bg-white transition-colors">
                <User size={18} className="text-gray-400" />
                <input
                  type="text"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 text-sm text-gray-700 outline-none bg-transparent"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-100 mb-1">
                Password
              </label>
              <div className="flex items-center border-2 border-gray-200 focus-within:border-blue-400 rounded-xl px-4 py-3 gap-3 bg-white transition-colors">
                <Lock size={18} className="text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="flex-1 text-sm text-gray-700 outline-none bg-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Forgot password */}
            <div className="flex justify-end">
              <a href="#" className="text-xs text-blue-600 hover:text-blue-800 font-medium">
                Forgot password?
              </a>
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-xl font-semibold text-sm transition-colors shadow-md flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Signing in...
                </>
              ) : (
                "Sign In as Homeowner"
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 font-medium">OR</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Google login */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center gap-3 border-2 border-gray-100 hover:border-gray-300 rounded-xl py-3 text-sm font-medium text-gray-100 transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </motion.button>

          {/* Register link */}
          <p className="text-center text-sm text-gray-500 mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-blue-500 hover:text-blue-600 font-semibold">
              Sign up free
            </Link>
          </p>

          {/* Hint */}
          <p className="text-center text-xs text-gray-400 mt-3">
            Demo: username <span className="font-mono font-bold">abcd</span> / password <span className="font-mono font-bold">1234</span>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginPageInner />
    </Suspense>
  );
}