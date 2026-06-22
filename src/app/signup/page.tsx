"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  MessageSquare,
  ShieldCheck,
} from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (!/\d/.test(form.password)) {
      setError("Password must include a number.");
      return;
    }
    if (!/[!@#$%^&*]/.test(form.password)) {
      setError("Password must include a special character.");
      return;
    }
    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          password: form.password,
          role: "HOMEOWNER",
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Signup failed.");
        setLoading(false);
        return;
      }

      router.push("/dashboard");
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const features = [
    {
      icon: CheckCircle,
      title: "Verified Professionals",
      desc: "All pros are background-checked and verified.",
    },
    {
      icon: MessageSquare,
      title: "Easy Communication",
      desc: "Chat, get quotes, and book services with ease.",
    },
    {
      icon: ShieldCheck,
      title: "Secure & Reliable",
      desc: "Your data is safe with us. We value your privacy.",
    },
  ];

  return (
    <div className="min-h-screen bg-grey-00 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex"
      >
        {/* LEFT PANEL */}
        <div className="hidden md:flex flex-col w-[45%] bg-blue-50 p-8 justify-between">
          {/* Logo */}
          <div>
            <div className="relative h-14 w-44 mb-6">
              <Image
                src="/imports/GeTradie_Logo.png"
                alt="GeTradie"
                fill
                className="object-contain"
                priority
              />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome to{" "}
              <span className="text-orange-600">GeTradie</span>
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              Find trusted professionals for your home service needs.
              Fast, easy, and reliable.
            </p>

            {/* Illustration */}
            <div className="relative h-52 w-full my-6 rounded-2xl overflow-hidden bg-blue-100">
              <Image
                src="/imports/GeTredie_Mascot.jpg"
                alt="GeTradie"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Features */}
          <div className="space-y-4">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon size={18} className="text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{f.title}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{f.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="flex-1 p-8 overflow-y-auto">
          {/* Close button */}
          <div className="flex justify-end mb-2">
            <Link href="/" className="text-gray-400 hover:text-gray-600 text-xl font-light">
              ✕
            </Link>
          </div>

          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Create Your Account
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Sign up to get started with{" "}
              <span className="text-orange-600 font-semibold">GeTradie.</span>
            </p>
          </div>

          {/* Error */}
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
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Full Name */}
            <div className="flex items-center border border-gray-200 focus-within:border-blue-500 rounded-xl px-4 py-3 gap-3 bg-white transition-colors">
              <User size={18} className="text-gray-400" />
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                required
                className="flex-1 text-sm text-gray-700 outline-none bg-transparent"
              />
            </div>

            {/* Email */}
            <div className="flex items-center border border-gray-200 focus-within:border-blue-500 rounded-xl px-4 py-3 gap-3 bg-white transition-colors">
              <Mail size={18} className="text-gray-400" />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange}
                required
                className="flex-1 text-sm text-gray-700 outline-none bg-transparent"
              />
            </div>

            {/* Phone */}
            <div className="flex items-center border border-gray-200 focus-within:border-blue-500 rounded-xl px-4 py-3 gap-3 bg-white transition-colors">
              <Phone size={18} className="text-gray-400" />
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number (Optional)"
                value={form.phone}
                onChange={handleChange}
                className="flex-1 text-sm text-gray-700 outline-none bg-transparent"
              />
            </div>

            {/* Password */}
            <div className="flex items-center border border-gray-200 focus-within:border-blue-500 rounded-xl px-4 py-3 gap-3 bg-white transition-colors">
              <Lock size={18} className="text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
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

            {/* Confirm Password */}
            <div className="flex items-center border border-gray-200 focus-within:border-blue-500 rounded-xl px-4 py-3 gap-3 bg-white transition-colors">
              <Lock size={18} className="text-gray-400" />
              <input
                type={showConfirm ? "text" : "password"}
                name="confirm"
                placeholder="Confirm Password"
                value={form.confirm}
                onChange={handleChange}
                required
                className="flex-1 text-sm text-gray-700 outline-none bg-transparent"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="text-gray-400 hover:text-gray-600"
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Password hint */}
            <p className="text-xs text-gray-400 px-1">
              Password must be at least 8 characters and include a number and a special character.
            </p>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white py-3.5 rounded-xl font-bold text-sm transition-colors shadow-md flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Creating Account...
                </>
              ) : (
                "Sign Up"
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">or continue with</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Social buttons */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <button className="flex items-center justify-center gap-2 border border-gray-200 hover:border-gray-300 rounded-xl py-3 text-sm font-semibold text-gray-700 transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </button>
            <button className="flex items-center justify-center gap-2 border border-gray-200 hover:border-gray-300 rounded-xl py-3 text-sm font-semibold text-gray-700 transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              Apple
            </button>
          </div>

          {/* Login link */}
          <p className="text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-500 hover:text-blue-600 font-semibold">
              Log In
            </Link>
          </p>

          {/* Terms */}
          <p className="text-center text-xs text-gray-400 mt-3">
            By signing up, you agree to our{" "}
            <a href="#" className="text-blue-500 hover:underline">Terms of Service</a>{" "}
            and{" "}
            <a href="#" className="text-blue-500 hover:underline">Privacy Policy.</a>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
