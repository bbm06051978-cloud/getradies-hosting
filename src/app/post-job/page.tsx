"use client";
import Image from 'next/image';
import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  Briefcase,
  MapPin,
  Calendar,
  DollarSign,
  FileText,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Zap,
  Search,
  X,
} from "lucide-react";
import { Sidebar } from "@/app/components/dashboard/Sidebar";
import { Topbar } from "@/app/components/dashboard/Topbar";

const trades = [
  { label: "Plumbing", emoji: "🔧" },
  { label: "Electrical", emoji: "⚡" },
  { label: "Cleaning", emoji: "🧹" },
  { label: "Painting", emoji: "🎨" },
  { label: "Handyman", emoji: "🔨" },
  { label: "Carpentry", emoji: "🪚" },
  { label: "Removalists", emoji: "🚚" },
];

const urgencyOptions = [
  { label: "Emergency", desc: "Within 24 hours", color: "bg-red-50 border-red-200 text-red-700" },
  { label: "Urgent", desc: "Within 3 days", color: "bg-orange-50 border-orange-200 text-orange-700" },
  { label: "This Week", desc: "Within 7 days", color: "bg-yellow-50 border-yellow-200 text-yellow-700" },
  { label: "Flexible", desc: "I can wait", color: "bg-green-50 border-green-200 text-green-700" },
];

const budgetOptions = [
  "Under $200",
  "$200 - $500",
  "$500 - $1,000",
  "$1,000 - $3,000",
  "$3,000 - $5,000",
  "$5,000+",
  "Not Sure",
];

const australianStates = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "ACT", "NT"];

const steps = [
  { number: 1, title: "Job Details" },
  { number: 2, title: "Location" },
  { number: 3, title: "Schedule & Budget" },
  { number: 4, title: "Review & Post" },
];

export default function PostJobPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [aiEstimate, setAiEstimate] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

 const [form, setForm] = useState({
    title: searchParams.get("job") || "",
    description: searchParams.get("job") || "",
    trade: "",
    suburb: "",
    state: "",
    postcode: "",
    urgency: "",
    budget: "",
    preferredDate: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const getAiEstimate = async () => {
    if (!form.title || !form.trade) return;
    setAiLoading(true);
    try {
      const res = await fetch("/api/estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          job: form.title + (form.description ? ". " + form.description : ""),
          location: form.suburb ? `${form.suburb}, ${form.state}` : "Australia",
        }),
      });
      const data = await res.json();
      if (data.estimate && !data.estimate.startsWith("❌")) {
        setAiEstimate(data.estimate);
      }
    } catch {
      // silently fail
    } finally {
      setAiLoading(false);
    }
  };

  const validateStep = () => {
    if (currentStep === 1) {
      if (!form.title.trim()) return "Job title is required.";
      if (!form.trade) return "Please select a trade.";
      if (!form.description.trim()) return "Please describe your job.";
    }
    if (currentStep === 2) {
      if (!form.suburb.trim()) return "Suburb is required.";
      if (!form.state) return "Please select your state.";
    }
    if (currentStep === 3) {
      if (!form.urgency) return "Please select urgency.";
      if (!form.budget) return "Please select a budget range.";
    }
    return null;
  };

  const handleNext = () => {
    const err = validateStep();
    if (err) { setError(err); return; }
    setError("");
    if (currentStep === 2) getAiEstimate();
    setCurrentStep((s) => s + 1);
  };

  const handleBack = () => {
    setError("");
    setCurrentStep((s) => s - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, aiEstimate }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to post job.");
        setLoading(false);
        return;
      }

      router.push("/dashboard?jobPosted=true");
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0">
        <Topbar />

        <div className="p-8 flex-1 max-w-3xl mx-auto w-full">

          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link href="/dashboard" className="text-gray-400 hover:text-gray-600">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Post a New Job</h1>
              <p className="text-gray-500 text-sm mt-0.5">
                Tell us what you need and get quotes from verified tradies
              </p>
            </div>
          </div>

          {/* Progress */}
          <div className="flex gap-2 mb-8">
            {steps.map((s) => (
              <div key={s.number} className="flex-1">
                <div className={`h-1.5 rounded-full transition-all duration-300 ${
                  s.number <= currentStep ? "bg-blue-900" : "bg-gray-200"
                }`} />
                <p className={`text-xs mt-1 font-medium ${
                  s.number === currentStep ? "text-blue-900" : "text-gray-400"
                }`}>
                  {s.title}
                </p>
              </div>
            ))}
          </div>

          {/* Card */}
         {/* <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"> */}

{/* Card */}
<div className="relative overflow-hidden bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
  



            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-5"
              >
                {error}
              </motion.div>
            )}

            <AnimatePresence mode="wait">

              {/* STEP 1 — Job Details */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-5"
                >
                  <h2 className="font-bold text-gray-800 flex items-center gap-2">
                    <FileText size={18} className="text-blue-900" />
                    Job Details
                  </h2>

                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Job Title *
                    </label>
                    <div className="flex items-center border border-gray-200 focus-within:border-blue-400 rounded-xl px-4 py-3 gap-3 transition-colors">
                      <Search size={17} className="text-gray-400" />
                      <input
                        type="text"
                        name="title"
                        placeholder="e.g. Fix leaking kitchen tap"
                        value={form.title}
                        onChange={handleChange}
                        className="flex-1 text-sm text-gray-700 outline-none bg-transparent"
                      />
                    </div>
                  </div>

                  {/* Trade */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Trade Category *
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {trades.map((trade) => (
                        <button
                          key={trade.label}
                          type="button"
                          onClick={() => {
                            setForm({ ...form, trade: trade.label });
                            setError("");
                          }}
                          className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-colors ${
                            form.trade === trade.label
                              ? "bg-blue-900 text-white border-blue-900"
                              : "border-gray-200 text-gray-600 hover:border-blue-300 hover:bg-blue-50"
                          }`}
                        >
                          <span>{trade.emoji}</span>
                          {trade.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Job Description *
                    </label>
                    <textarea
                      name="description"
                      placeholder="Describe your job in detail — what needs to be done, any specific requirements, access details, etc."
                      value={form.description}
                      onChange={handleChange}
                      rows={4}
                      className="w-full border border-gray-200 focus:border-blue-400 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none resize-none transition-colors"
                    />
                  </div>
                </motion.div>
              )}

              {/* STEP 2 — Location */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-5"
                >
                  <h2 className="font-bold text-gray-800 flex items-center gap-2">
                    <MapPin size={18} className="text-blue-900" />
                    Job Location
                  </h2>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Suburb *
                    </label>
                    <div className="flex items-center border border-gray-200 focus-within:border-blue-400 rounded-xl px-4 py-3 gap-3 transition-colors">
                      <MapPin size={17} className="text-gray-400" />
                      <input
                        type="text"
                        name="suburb"
                        placeholder="e.g. Bondi"
                        value={form.suburb}
                        onChange={handleChange}
                        className="flex-1 text-sm text-gray-700 outline-none bg-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State *
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {australianStates.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => {
                            setForm({ ...form, state: s });
                            setError("");
                          }}
                          className={`py-2 rounded-xl border text-sm font-medium transition-colors ${
                            form.state === s
                              ? "bg-blue-900 text-white border-blue-900"
                              : "border-gray-200 text-gray-600 hover:border-blue-300"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Postcode (Optional)
                    </label>
                    <input
                      type="text"
                      name="postcode"
                      placeholder="e.g. 2026"
                      value={form.postcode}
                      onChange={handleChange}
                      maxLength={4}
                      className="w-full border border-gray-200 focus:border-blue-400 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none transition-colors"
                    />
                  </div>
                </motion.div>
              )}

              {/* STEP 3 — Schedule & Budget */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-5"
                >
                  <h2 className="font-bold text-gray-800 flex items-center gap-2">
                    <Calendar size={18} className="text-blue-900" />
                    Schedule & Budget
                  </h2>

                  {/* Urgency */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      How urgent is this? *
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {urgencyOptions.map((opt) => (
                        <button
                          key={opt.label}
                          type="button"
                          onClick={() => {
                            setForm({ ...form, urgency: opt.label });
                            setError("");
                          }}
                          className={`flex flex-col items-start px-4 py-3 rounded-xl border text-sm font-medium transition-colors ${
                            form.urgency === opt.label
                              ? "bg-blue-900 text-white border-blue-900"
                              : `${opt.color} border`
                          }`}
                        >
                          <span className="font-bold">{opt.label}</span>
                          <span className={`text-xs mt-0.5 ${form.urgency === opt.label ? "text-blue-200" : "opacity-70"}`}>
                            {opt.desc}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Preferred Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Preferred Date (Optional)
                    </label>
                    <input
                      type="date"
                      name="preferredDate"
                      value={form.preferredDate}
                      onChange={handleChange}
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full border border-gray-200 focus:border-blue-400 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none transition-colors"
                    />
                  </div>

                  {/* Budget */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Budget Range *
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {budgetOptions.map((b) => (
                        <button
                          key={b}
                          type="button"
                          onClick={() => {
                            setForm({ ...form, budget: b });
                            setError("");
                          }}
                          className={`py-2.5 px-3 rounded-xl border text-sm font-medium transition-colors ${
                            form.budget === b
                              ? "bg-blue-900 text-white border-blue-900"
                              : "border-gray-200 text-gray-600 hover:border-blue-300 hover:bg-blue-50"
                          }`}
                        >
                          {b}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 4 — Review */}
              {currentStep === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-5"
                >
                  <h2 className="font-bold text-gray-800 flex items-center gap-2">
                    <CheckCircle size={18} className="text-blue-900" />
                    Review & Post
                  </h2>

                  {/* Summary */}
                  <div className="bg-slate-50 rounded-2xl p-5 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 font-medium">Job Title</span>
                      <span className="text-gray-900 font-semibold text-right max-w-[60%]">{form.title}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 font-medium">Trade</span>
                      <span className="text-gray-900 font-semibold">{form.trade}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 font-medium">Location</span>
                      <span className="text-gray-900 font-semibold">{form.suburb}, {form.state} {form.postcode}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 font-medium">Urgency</span>
                      <span className="text-gray-900 font-semibold">{form.urgency}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 font-medium">Budget</span>
                      <span className="text-gray-900 font-semibold">{form.budget}</span>
                    </div>
                    {form.preferredDate && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500 font-medium">Preferred Date</span>
                        <span className="text-gray-900 font-semibold">
                          {new Date(form.preferredDate).toLocaleDateString("en-AU", {
                            day: "numeric", month: "long", year: "numeric"
                          })}
                        </span>
                      </div>
                    )}
                    <div className="pt-2 border-t border-gray-200">
                      <p className="text-xs text-gray-500 font-medium mb-1">Description</p>
                      <p className="text-sm text-gray-700 leading-relaxed">{form.description}</p>
                    </div>
                  </div>

                  {/* AI Estimate */}
                  {aiLoading && (
                    <div className="flex items-center gap-3 bg-blue-50 rounded-xl px-4 py-3">
                      <svg className="animate-spin h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      <span className="text-sm text-blue-700 font-medium">Getting AI estimate...</span>
                    </div>
                  )}

                  {aiEstimate && (
                    <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                            <Zap size={12} className="text-white fill-white" />
                          </div>
                          <span className="text-sm font-bold text-blue-900">AI Price Estimate</span>
                        </div>
                        <button onClick={() => setAiEstimate("")} className="text-gray-400 hover:text-gray-600">
                          <X size={14} />
                        </button>
                      </div>
                      <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                        {aiEstimate.split("\n").filter((l) => !l.startsWith("🔧")).join("\n")}
                      </p>
                    </div>
                  )}

                  {!aiEstimate && !aiLoading && (
                    <button
                      type="button"
                      onClick={getAiEstimate}
                      className="w-full flex items-center justify-center gap-2 border-2 border-blue-200 hover:border-blue-400 text-blue-700 py-3 rounded-xl text-sm font-semibold transition-colors"
                    >
                      <Zap size={16} className="fill-blue-600 text-blue-600" />
                      Get AI Price Estimate
                    </button>
                  )}

                  <div className="bg-green-50 border border-green-100 rounded-xl px-4 py-3 flex items-start gap-3">
                    <CheckCircle size={18} className="text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-gray-800">Ready to post!</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Your job will be visible to verified tradies in {form.suburb}, {form.state} immediately.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex gap-3 mt-6 pt-5 border-t border-gray-100">
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
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-900 hover:bg-blue-800 text-white px-5 py-3 rounded-xl font-bold text-sm transition-colors"
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
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-900 hover:bg-blue-800 disabled:bg-blue-300 text-white py-3 rounded-xl font-bold text-sm transition-colors shadow-md"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Posting Job...
                    </>
                  ) : (
                    <>
                      <Briefcase size={16} />
                      Post Job Now
                    </>
                  )}
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
