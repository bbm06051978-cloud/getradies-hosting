"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Briefcase,
  MapPin,
  FileText,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Star,
  DollarSign,
} from "lucide-react";

const trades = [
  "Plumbing",
  "Electrical",
  "Cleaning",
  "Painting",
  "Handyman",
  "Carpentry",
  "Removalists",
];

const australianStates = [
  "NSW", "VIC", "QLD", "WA", "SA", "TAS", "ACT", "NT",
];

const steps = [
  { number: 1, title: "Personal Info" },
  { number: 2, title: "Business Info" },
  { number: 3, title: "Location" },
  { number: 4, title: "Security" },
];

export default function TradieSignupPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    // Step 1 — Personal
    name: "",
    email: "",
    phone: "",
    // Step 2 — Business
    businessName: "",
    specialty: "",
    licenseNumber: "",
    bio: "",
    // Step 3 — Location
    suburb: "",
    state: "",
    // Step 4 — Security
    password: "",
    confirm: "",
    agreeTerms: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const target = e.target as HTMLInputElement;
    setForm({
      ...form,
      [target.name]: target.type === "checkbox" ? target.checked : target.value,
    });
    setError("");
  };

  const validateStep = () => {
    if (currentStep === 1) {
      if (!form.name.trim()) return "Full name is required.";
      if (!form.email.trim()) return "Email is required.";
      if (!/\S+@\S+\.\S+/.test(form.email)) return "Invalid email address.";
      if (!form.phone.trim()) return "Phone number is required.";
    }
    if (currentStep === 2) {
      if (!form.businessName.trim()) return "Business name is required.";
      if (!form.specialty) return "Please select your trade specialty.";
    }
    if (currentStep === 3) {
      if (!form.suburb.trim()) return "Suburb is required.";
      if (!form.state) return "Please select your state.";
    }
    if (currentStep === 4) {
      if (form.password.length < 8) return "Password must be at least 8 characters.";
      if (!/\d/.test(form.password)) return "Password must include a number.";
      if (!/[!@#$%^&*]/.test(form.password)) return "Password must include a special character (!@#$%^&*).";
      if (form.password !== form.confirm) return "Passwords do not match.";
      if (!form.agreeTerms) return "Please agree to the Terms of Service.";
    }
    return null;
  };

  const handleNext = () => {
    const err = validateStep();
    if (err) {
      setError(err);
      return;
    }
    setError("");
    setCurrentStep((s) => s + 1);
  };

  const handleBack = () => {
    setError("");
    setCurrentStep((s) => s - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validateStep();
    if (err) {
      setError(err);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup-tradie", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          password: form.password,
          businessName: form.businessName,
          specialty: form.specialty,
          licenseNumber: form.licenseNumber,
          suburb: form.suburb,
          state: form.state,
          bio: form.bio,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Signup failed.");
        setLoading(false);
        return;
      }

      router.push("/dashboard-tradie");
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const features = [
    {
      icon: DollarSign,
      title: "Get More Job Leads",
      desc: "Access thousands of homeowners looking for your trade.",
    },
    {
      icon: Star,
      title: "Build Your Reputation",
      desc: "Collect reviews and grow your business online.",
    },
    {
      icon: ShieldCheck,
      title: "Verified Badge",
      desc: "Get verified to stand out and win more jobs.",
    },
  ];

  return (
    <div className="min-h-screen bg-blue-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex"
      >
        {/* LEFT PANEL */}
        <div className="hidden md:flex flex-col w-[42%] bg-orange-50 p-8 justify-between">
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

            <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-600 text-xs font-bold px-3 py-1.5 rounded-full mb-4">
              <Briefcase size={12} />
              Tradie Registration
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Grow Your Business with{" "}
              <span className="text-orange-500">GeTradie</span>
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              Join thousands of tradies already winning jobs and growing their business on GeTradie.
            </p>

            {/* Mascot */}
            <div className="relative h-44 w-full my-6 rounded-2xl overflow-hidden bg-orange-100">
              <Image
                src="/imports/GeTredie_Mascot.jpg"
                alt="GeTradie Mascot"
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
                  <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
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
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Create Tradie Account
              </h1>
              <p className="text-gray-500 text-xs mt-0.5">
                Step {currentStep} of {steps.length}
              </p>
            </div>
            <Link href="/" className="text-gray-400 hover:text-gray-600 text-xl">
              ✕
            </Link>
          </div>

          {/* Progress bar */}
          <div className="flex gap-2 mb-6">
            {steps.map((s) => (
              <div key={s.number} className="flex-1">
                <div
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    s.number <= currentStep ? "bg-orange-500" : "bg-gray-200"
                  }`}
                />
                <p className={`text-xs mt-1 font-medium ${
                  s.number === currentStep ? "text-orange-500" : "text-gray-400"
                }`}>
                  {s.title}
                </p>
              </div>
            ))}
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

          <AnimatePresence mode="wait">
            {/* STEP 1 — Personal Info */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-3"
              >
                <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <User size={18} className="text-orange-500" />
                  Personal Information
                </h2>

                <div className="flex items-center border border-gray-200 focus-within:border-orange-400 rounded-xl px-4 py-3 gap-3 transition-colors">
                  <User size={17} className="text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name *"
                    value={form.name}
                    onChange={handleChange}
                    className="flex-1 text-sm text-gray-700 outline-none bg-transparent"
                  />
                </div>

                <div className="flex items-center border border-gray-200 focus-within:border-orange-400 rounded-xl px-4 py-3 gap-3 transition-colors">
                  <Mail size={17} className="text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address *"
                    value={form.email}
                    onChange={handleChange}
                    className="flex-1 text-sm text-gray-700 outline-none bg-transparent"
                  />
                </div>

                <div className="flex items-center border border-gray-200 focus-within:border-orange-400 rounded-xl px-4 py-3 gap-3 transition-colors">
                  <Phone size={17} className="text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number *"
                    value={form.phone}
                    onChange={handleChange}
                    className="flex-1 text-sm text-gray-700 outline-none bg-transparent"
                  />
                </div>
              </motion.div>
            )}

            {/* STEP 2 — Business Info */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-3"
              >
                <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Briefcase size={18} className="text-orange-500" />
                  Business Information
                </h2>

                <div className="flex items-center border border-gray-200 focus-within:border-orange-400 rounded-xl px-4 py-3 gap-3 transition-colors">
                  <Briefcase size={17} className="text-gray-400" />
                  <input
                    type="text"
                    name="businessName"
                    placeholder="Business Name *"
                    value={form.businessName}
                    onChange={handleChange}
                    className="flex-1 text-sm text-gray-700 outline-none bg-transparent"
                  />
                </div>

                {/* Trade specialty */}
                <div className="border border-gray-200 focus-within:border-orange-400 rounded-xl px-4 py-3 transition-colors">
                  <label className="text-xs text-gray-400 block mb-1">Trade Specialty *</label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {trades.map((trade) => (
                      <button
                        key={trade}
                        type="button"
                        onClick={() => {
                          setForm({ ...form, specialty: trade });
                          setError("");
                        }}
                        className={`text-sm py-2 px-3 rounded-lg border transition-colors text-left font-medium ${
                          form.specialty === trade
                            ? "bg-orange-500 text-white border-orange-500"
                            : "border-gray-200 text-gray-600 hover:border-orange-300"
                        }`}
                      >
                        {trade}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center border border-gray-200 focus-within:border-orange-400 rounded-xl px-4 py-3 gap-3 transition-colors">
                  <FileText size={17} className="text-gray-400" />
                  <input
                    type="text"
                    name="licenseNumber"
                    placeholder="License Number (Optional)"
                    value={form.licenseNumber}
                    onChange={handleChange}
                    className="flex-1 text-sm text-gray-700 outline-none bg-transparent"
                  />
                </div>

                <div className="border border-gray-200 focus-within:border-orange-400 rounded-xl px-4 py-3 transition-colors">
                  <textarea
                    name="bio"
                    placeholder="Tell homeowners about your experience (Optional)"
                    value={form.bio}
                    onChange={handleChange}
                    rows={3}
                    className="w-full text-sm text-gray-700 outline-none bg-transparent resize-none"
                  />
                </div>
              </motion.div>
            )}

            {/* STEP 3 — Location */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-3"
              >
                <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <MapPin size={18} className="text-orange-500" />
                  Service Location
                </h2>

                <p className="text-xs text-gray-500 mb-3">
                  This helps homeowners find you in their area.
                </p>

                <div className="flex items-center border border-gray-200 focus-within:border-orange-400 rounded-xl px-4 py-3 gap-3 transition-colors">
                  <MapPin size={17} className="text-gray-400" />
                  <input
                    type="text"
                    name="suburb"
                    placeholder="Suburb *"
                    value={form.suburb}
                    onChange={handleChange}
                    className="flex-1 text-sm text-gray-700 outline-none bg-transparent"
                  />
                </div>

                <div className="border border-gray-200 focus-within:border-orange-400 rounded-xl px-4 py-3 transition-colors">
                  <label className="text-xs text-gray-400 block mb-2">State *</label>
                  <div className="grid grid-cols-4 gap-2">
                    {australianStates.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => {
                          setForm({ ...form, state: s });
                          setError("");
                        }}
                        className={`text-sm py-2 rounded-lg border font-medium transition-colors ${
                          form.state === s
                            ? "bg-orange-500 text-white border-orange-500"
                            : "border-gray-200 text-gray-600 hover:border-orange-300"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 4 — Security */}
            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-3"
              >
                <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Lock size={18} className="text-orange-500" />
                  Create Password
                </h2>

                <div className="flex items-center border border-gray-200 focus-within:border-orange-400 rounded-xl px-4 py-3 gap-3 transition-colors">
                  <Lock size={17} className="text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password *"
                    value={form.password}
                    onChange={handleChange}
                    className="flex-1 text-sm text-gray-700 outline-none bg-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>

                <div className="flex items-center border border-gray-200 focus-within:border-orange-400 rounded-xl px-4 py-3 gap-3 transition-colors">
                  <Lock size={17} className="text-gray-400" />
                  <input
                    type={showConfirm ? "text" : "password"}
                    name="confirm"
                    placeholder="Confirm Password *"
                    value={form.confirm}
                    onChange={handleChange}
                    className="flex-1 text-sm text-gray-700 outline-none bg-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    {showConfirm ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>

                <p className="text-xs text-gray-400 px-1">
                  Must be 8+ characters with a number and special character (!@#$%^&*)
                </p>

                {/* Summary */}
                <div className="bg-orange-50 rounded-xl p-4 mt-4">
                  <p className="text-xs font-bold text-gray-700 mb-3">Account Summary</p>
                  <div className="space-y-1.5 text-xs text-gray-600">
                    <p><span className="font-semibold">Name:</span> {form.name}</p>
                    <p><span className="font-semibold">Email:</span> {form.email}</p>
                    <p><span className="font-semibold">Business:</span> {form.businessName}</p>
                    <p><span className="font-semibold">Trade:</span> {form.specialty}</p>
                    <p><span className="font-semibold">Location:</span> {form.suburb}, {form.state}</p>
                  </div>
                </div>

                {/* Terms */}
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="agreeTerms"
                    checked={form.agreeTerms}
                    onChange={handleChange}
                    className="mt-0.5 accent-orange-500"
                  />
                  <span className="text-xs text-gray-500">
                    I agree to the{" "}
                    <a href="#" className="text-orange-500 hover:underline">Terms of Service</a>{" "}
                    and{" "}
                    <a href="#" className="text-orange-500 hover:underline">Privacy Policy</a>
                  </span>
                </label>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation buttons */}
          <div className="flex gap-3 mt-6">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handleBack}
                className="flex items-center gap-2 border border-gray-200 hover:border-gray-300 text-gray-600 px-5 py-3 rounded-xl font-semibold text-sm transition-colors"
              >
                <ArrowLeft size={16} />
                Back
              </button>
            )}

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex-1 flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-3 rounded-xl font-bold text-sm transition-colors"
              >
                Continue
                <ArrowRight size={16} />
              </button>
            ) : (
              <motion.button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                className="flex-1 flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white py-3 rounded-xl font-bold text-sm transition-colors shadow-md"
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
                  <>
                    <CheckCircle size={16} />
                    Create Tradie Account
                  </>
                )}
              </motion.button>
            )}
          </div>

          {/* Login link */}
          <p className="text-center text-sm text-gray-500 mt-4">
            Already have an account?{" "}
            <Link href="/login-tradie" className="text-orange-500 hover:text-orange-600 font-semibold">
              Log In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
