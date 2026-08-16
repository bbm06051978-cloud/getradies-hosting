"use client";
import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, Briefcase, TrendingUp, Users, DollarSign } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";

function validate(field: string, value: string) {
  if (field === "email") {
    if (!value) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Enter a valid email address";
  }
  if (field === "password") {
    if (!value) return "Password is required";
    if (value.length < 8) return "Password must be at least 8 characters";
  }
  return "";
}

function TradieLoginInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard-tradie";
  const [email, setEmail]               = useState("");
  const [password, setPassword]         = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors]             = useState<Record<string, string>>({});
  const [serverError, setServerError]   = useState("");
  const [loading, setLoading]           = useState(false);

  const handleChange = (field: string, value: string) => {
    if (field === "email") setEmail(value);
    if (field === "password") setPassword(value);
    setErrors(e => ({ ...e, [field]: validate(field, value) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailErr = validate("email", email);
    const passErr  = validate("password", password);
    if (emailErr || passErr) { setErrors({ email: emailErr, password: passErr }); return; }
    setLoading(true);
    setServerError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setServerError(data.error || "Invalid email or password."); return; }
      if (data.user?.role === "HOMEOWNER") setServerError("Please use the Homeowner login page.");
      else if (data.user?.role === "ADMIN") router.push("/admin");
      else router.push(redirect);
    } catch { setServerError("Something went wrong. Please try again."); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex" style={{
      background: "linear-gradient(135deg, #1a0a00 0%, #7c2d12 50%, #ea580c 100%)"
    }}>
      {/* Left panel — branding */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: "url('/imports/hero_baground.webp')",
          backgroundSize: "cover", backgroundPosition: "center",
        }}/>
        <div className="relative z-10">
          <Link href="/">
            <div className="relative h-30 w-40 mb-12">
              <Image src="/imports/GeTradie_Logo.webp" alt="GeTradie" fill className="object-contain object-left"/>
            </div>
          </Link>
          <h2 className="text-4xl font-black text-white leading-tight mb-4">
            Grow Your<br/>
            <span className="text-orange-200">Tradie Business</span>
          </h2>
          <p className="text-orange-100 text-lg leading-relaxed">
            Access quality job leads, manage bookings and build your reputation — all in one place.
          </p>
        </div>
        <div className="relative z-10 space-y-4">
          {[
            { icon: TrendingUp, text: "More leads — less time wasted chasing work" },
            { icon: Users,      text: "Thousands of homeowners looking for tradies" },
            { icon: DollarSign, text: "No per-lead fees — flat monthly subscription" },
          ].map(f => (
            <div key={f.text} className="flex items-center gap-3">
              <div className="w-8 h-8 bg-orange-500/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <f.icon size={16} className="text-orange-200"/>
              </div>
              <span className="text-orange-100 text-sm">{f.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 w-full flex items-center justify-center px-4 py-8 lg:px-6 lg:py-12">
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md">

         {/* Mobile logo + back */}
          <div className="lg:hidden flex items-center justify-between mb-8">
            <Link href="/">
              <div className="relative h-10 w-36">
                <Image src="/imports/GeTradie_Logo.webp" alt="GeTradie" fill className="object-contain object-left"/>
              </div>
            </Link>
            <Link href="/" className="text-blue-200 text-sm hover:text-white flex items-center gap-1">
              ← Home
            </Link>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                <Briefcase size={20} className="text-orange-600"/>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Tradie Login</h1>
                <p className="text-gray-500 text-xs">Access your tradie dashboard</p>
              </div>
            </div>

            {serverError && (
              <div className="bg-red-50 border border-red-300 text-red-700 text-sm rounded-xl px-4 py-3 mb-4 font-medium">
                {serverError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <div className={`flex items-center border-2 rounded-xl px-4 py-3 gap-3 transition-colors ${
                  errors.email ? "border-red-400 bg-red-50" : "border-gray-200 focus-within:border-orange-500"
                }`}>
                  <Mail size={16} className="text-gray-400 flex-shrink-0"/>
                  <input type="email" placeholder="your@email.com" value={email}
                    onChange={e => handleChange("email", e.target.value)}
                    className="flex-1 text-sm text-gray-900 outline-none bg-transparent placeholder-gray-400"/>
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                  <Link href="/forgot-password" className="text-xs text-orange-500 hover:text-orange-700 font-medium">Forgot password?</Link>
                </div>
                <div className={`flex items-center border-2 rounded-xl px-4 py-3 gap-3 transition-colors ${
                  errors.password ? "border-red-400 bg-red-50" : "border-gray-200 focus-within:border-orange-500"
                }`}>
                  <Lock size={16} className="text-gray-400 flex-shrink-0"/>
                  <input type={showPassword ? "text" : "password"} placeholder="Min 8 characters" value={password}
                    onChange={e => handleChange("password", e.target.value)}
                    className="flex-1 text-sm text-gray-900 outline-none bg-transparent placeholder-gray-400"/>
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-400 hover:text-gray-600">
                    {showPassword ? <EyeOff size={16}/> : <Eye size={16}/>}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>

              <button type="submit" disabled={loading}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-bold text-sm transition-colors shadow-lg">
                {loading ? "Signing in..." : "Sign In as Tradie"}
              </button>
            </form>

            <div className="mt-5 pt-5 border-t border-gray-100 text-center space-y-2">
              <p className="text-sm text-gray-500">
                New to GeTradie?{" "}
                <Link href="/signup-tradie" className="text-orange-500 font-semibold hover:underline">Create tradie account</Link>
              </p>
              <p className="text-xs text-gray-400">
                Are you a homeowner?{" "}
                <Link href="/login" className="text-blue-600 font-semibold hover:underline">Homeowner Login →</Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function TradieLoginPage() {
  return <Suspense><TradieLoginInner/></Suspense>;
}
