"use client";

import { SmartQuoteBuilder } from "@/app/components/tradie/SmartQuoteBuilder";
import { useState, useEffect , Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowLeft,
  Briefcase,
  DollarSign,
  FileText,
  CheckCircle,
  MapPin,
  Zap,
} from "lucide-react";
import { TradieSidebar } from "@/app/components/tradie/TradieSidebar";
import { TradieTopbar } from "@/app/components/tradie/TradieTopbar";

type Job = {
  id: string;
  title: string;
  description: string;
  trade: string;
  suburb: string;
  state: string;
  aiEstimate: string | null;
  createdAt: string;
  user: { name: string };
};

function SendQuotePageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const jobId = searchParams.get("jobId");

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showAIBuilder, setShowAIBuilder] = useState(false);
  const [form, setForm] = useState({
    amount: "",
    description: "",
    availability: "",
    warranty: "",
  });

  useEffect(() => {
    if (!jobId) return;
    fetch(`/api/jobs/${jobId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.job) setJob(data.job);
      })
      .catch(() => {})
      .finally(() => setFetching(false));
  }, [jobId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.amount || !form.description) {
      setError("Amount and description are required.");
      return;
    }
    if (isNaN(parseFloat(form.amount)) || parseFloat(form.amount) <= 0) {
      setError("Please enter a valid amount.");
      return;
    }

    setLoading(true);
    try {
      const description = `${form.description}${form.availability ? `\n\nAvailability: ${form.availability}` : ""}${form.warranty ? `\nWarranty: ${form.warranty}` : ""}`;

      const res = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId,
          amount: form.amount,
          description,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to send quote.");
        setLoading(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => router.push("/dashboard-tradie"), 2000);
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <TradieSidebar />

      <main className="flex-1 flex flex-col min-w-0">
        <TradieTopbar />

        <div className="p-8 flex-1 max-w-3xl mx-auto w-full">

          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link href="/dashboard-tradie" className="text-gray-400 hover:text-gray-600">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Send a Quote</h1>
              <p className="text-gray-500 text-sm mt-0.5">
                Submit your quote for this job
              </p>
            </div>
          </div>

          {fetching ? (
            <div className="flex items-center justify-center py-20">
              <svg className="animate-spin h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
            </div>
          ) : success ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} className="text-green-500" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Quote Sent!</h2>
              <p className="text-gray-500 text-sm">
                Your quote has been sent to the homeowner. Redirecting...
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* Job Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 sticky top-6">
                  <h3 className="font-bold text-gray-900 mb-4">Job Details</h3>

                  {job ? (
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Briefcase size={16} className="text-blue-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{job.title}</p>
                          <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded-full mt-1">
                            {job.trade}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <MapPin size={14} className="text-gray-400" />
                        {job.suburb}, {job.state}
                      </div>

                      <div className="border-t border-gray-100 pt-3">
                        <p className="text-xs text-gray-500 font-medium mb-1">Description</p>
                        <p className="text-sm text-gray-700 leading-relaxed">{job.description}</p>
                      </div>

                      {job.aiEstimate && (
                        <div className="bg-blue-50 rounded-xl p-3 border border-blue-100">
                          <div className="flex items-center gap-1.5 mb-1.5">
                            <Zap size={12} className="text-blue-600 fill-blue-600" />
                            <span className="text-xs font-bold text-blue-800">AI Estimate</span>
                          </div>
                          <p className="text-xs text-gray-600 whitespace-pre-line leading-relaxed">
                            {job.aiEstimate.split("\n").filter((l) => !l.startsWith("🔧")).join("\n")}
                          </p>
                        </div>
                      )}

                      <div className="text-xs text-gray-400">
                        Posted by {job.user?.name || "Homeowner"} · {new Date(job.createdAt).toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" })}
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-400 text-sm">Job not found.</p>
                  )}
                </div>
              </div>

              {/* Quote Form */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h3 className="font-bold text-gray-900 mb-4">Your Quote</h3>

                  {/* AI Quote Builder button */}
                  <button
                    type="button"
                    onClick={() => setShowAIBuilder(true)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-white text-sm mb-5 w-full justify-center"
                    style={{ background: "linear-gradient(135deg,#F97316,#EA580C)", boxShadow: "0 4px 16px rgba(249,115,22,0.35)" }}
                  >
                    <Zap size={14} style={{ fill: "white" }} /> ✨ Generate Quote with AI
                  </button>

                  {showAIBuilder && job && (
                    <SmartQuoteBuilder
                      job={job}
                      onClose={() => setShowAIBuilder(false)}
                      onApply={(fields) => {
                        setForm({
                          amount: fields.amount,
                          description: fields.description,
                          availability: fields.availability,
                          warranty: fields.warranty,
                        });
                        setShowAIBuilder(false);
                      }}
                    />
                  )}

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-4"
                    >
                      {error}
                    </motion.div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Amount */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Quote Amount (AUD) *
                      </label>
                      <div className="flex items-center border border-gray-200 focus-within:border-blue-400 rounded-xl px-4 py-3 gap-3 transition-colors">
                        <DollarSign size={17} className="text-gray-400" />
                        <input
                          type="number"
                          name="amount"
                          placeholder="e.g. 250"
                          value={form.amount}
                          onChange={handleChange}
                          min="1"
                          step="0.01"
                          className="flex-1 text-sm text-gray-700 outline-none bg-transparent"
                        />
                        <span className="text-sm text-gray-400 font-medium">AUD</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        Enter your total fixed price including labour and materials
                      </p>
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Quote Description *
                      </label>
                      <textarea
                        name="description"
                        placeholder="Describe what's included in your quote — labour, materials, any site visit requirements, etc."
                        value={form.description}
                        onChange={handleChange}
                        rows={4}
                        className="w-full border border-gray-200 focus:border-blue-400 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none resize-none transition-colors"
                      />
                    </div>

                    {/* Availability */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Availability
                      </label>
                      <select
                        name="availability"
                        value={form.availability}
                        onChange={handleChange}
                        className="w-full border border-gray-200 focus:border-blue-400 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none transition-colors"
                      >
                        <option value="">Select availability</option>
                        <option value="Available Today">Available Today</option>
                        <option value="Available Tomorrow">Available Tomorrow</option>
                        <option value="Available This Week">Available This Week</option>
                        <option value="Available Next Week">Available Next Week</option>
                        <option value="Flexible">Flexible — contact me</option>
                      </select>
                    </div>

                    {/* Warranty */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Warranty / Guarantee (Optional)
                      </label>
                      <div className="flex items-center border border-gray-200 focus-within:border-blue-400 rounded-xl px-4 py-3 gap-3 transition-colors">
                        <FileText size={17} className="text-gray-400" />
                        <input
                          type="text"
                          name="warranty"
                          placeholder="e.g. 12 months parts and labour warranty"
                          value={form.warranty}
                          onChange={handleChange}
                          className="flex-1 text-sm text-gray-700 outline-none bg-transparent"
                        />
                      </div>
                    </div>

                    {/* Tips */}
                    <div className="bg-orange-50 border border-orange-100 rounded-xl p-4">
                      <p className="text-xs font-bold text-orange-800 mb-2">💡 Tips for winning jobs</p>
                      <ul className="text-xs text-orange-700 space-y-1">
                        <li>• Be specific about what&apos;s included in your price</li>
                        <li>• Mention your experience and any relevant certifications</li>
                        <li>• A warranty builds trust with homeowners</li>
                        <li>• Quick availability gets you more jobs</li>
                      </ul>
                    </div>

                    {/* Submit */}
                    <motion.button
                      type="submit"
                      disabled={loading}
                      whileHover={{ scale: loading ? 1 : 1.02 }}
                      whileTap={{ scale: loading ? 1 : 0.98 }}
                      className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white py-3.5 rounded-xl font-bold text-sm transition-colors shadow-md"
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                          </svg>
                          Sending Quote...
                        </>
                      ) : (
                        <>
                          <CheckCircle size={16} />
                          Send Quote to Homeowner
                        </>
                      )}
                    </motion.button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}


export default function SendQuotePage() {
  return (
    <Suspense>
      <SendQuotePageInner />
    </Suspense>
  );
}