"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowLeft, Check, X, Zap, Star, ShieldCheck,
  MapPin, FileText, Calculator, TrendingUp,
  BarChart3, Brain, Wrench, Crown, Rocket, Building2,
  ChevronDown, ChevronUp,
} from "lucide-react";
import { TradieSidebar } from "@/app/components/tradie/TradieSidebar";
import { TradieTopbar } from "@/app/components/tradie/TradieTopbar";

const plans = [
  {
    id: "starter",
    name: "Starter",
    price: 49,
    period: "month",
    color: "#3B82F6",
    bg: "rgba(59,130,246,0.08)",
    border: "rgba(59,130,246,0.25)",
    icon: Rocket,
    tagline: "Perfect for getting started",
    suburbs: "5 suburbs",
    popular: false,
    features: [
      "Job leads in 5 suburbs",
      "Send up to 10 quotes/month",
      "Basic tradie profile",
      "GST Calculator",
      "Material Calculator",
      "In-app chat with homeowners",
      "Email support",
    ],
  },
  {
    id: "professional",
    name: "Professional",
    price: 79,
    period: "month",
    color: "#F97316",
    bg: "rgba(249,115,22,0.08)",
    border: "rgba(249,115,22,0.35)",
    icon: Star,
    tagline: "Most popular — best value",
    suburbs: "10 suburbs",
    popular: true,
    features: [
      "Job leads in 10 suburbs",
      "Unlimited quotes",
      "Priority profile placement",
      "GST Calculator",
      "Material Calculator",
      "AI Quote Assistant ✨",
      "Invoice Generator",
      "Verified badge",
      "Priority support",
    ],
  },
  {
    id: "business",
    name: "Business",
    price: 129,
    period: "month",
    color: "#8B5CF6",
    bg: "rgba(139,92,246,0.08)",
    border: "rgba(139,92,246,0.30)",
    icon: Building2,
    tagline: "For growing trade businesses",
    suburbs: "Unlimited suburbs (one city)",
    popular: false,
    features: [
      "Unlimited suburbs (one city)",
      "Unlimited quotes",
      "Top profile placement",
      "GST Calculator",
      "Material Calculator",
      "AI Quote Assistant ✨",
      "Invoice Generator",
      "AI Material List ✨",
      "Profit Analysis",
      "Business Reports",
      "Dedicated account manager",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 199,
    period: "month",
    color: "#22C55E",
    bg: "rgba(34,197,94,0.08)",
    border: "rgba(34,197,94,0.25)",
    icon: Crown,
    tagline: "Entire state coverage",
    suburbs: "Entire state",
    popular: false,
    features: [
      "Entire state coverage",
      "Unlimited quotes",
      "Featured tradie status",
      "All Pro tools included",
      "AI Quote Assistant ✨",
      "AI Material List ✨",
      "Profit Analysis",
      "Business Reports",
      "Custom branding",
      "API access",
      "Dedicated account manager",
    ],
  },
];

const toolRows = [
  { tool: "GST Calculator",       icon: Calculator, starter: true,  professional: true,  business: true,  enterprise: true  },
  { tool: "Material Calculator",  icon: Wrench,     starter: true,  professional: true,  business: true,  enterprise: true  },
  { tool: "Invoice Generator",    icon: FileText,   starter: false, professional: true,  business: true,  enterprise: true  },
  { tool: "AI Quote Assistant",   icon: Brain,      starter: false, professional: true,  business: true,  enterprise: true  },
  { tool: "AI Material List",     icon: Zap,        starter: false, professional: false, business: true,  enterprise: true  },
  { tool: "Profit Analysis",      icon: TrendingUp, starter: false, professional: false, business: true,  enterprise: true  },
  { tool: "Business Reports",     icon: BarChart3,  starter: false, professional: false, business: true,  enterprise: true  },
  { tool: "Custom Branding",      icon: Star,       starter: false, professional: false, business: false, enterprise: true  },
];

const faqs = [
  { q: "Can I change plans anytime?", a: "Yes. You can upgrade or downgrade your plan at any time. Changes take effect immediately and billing is prorated." },
  { q: "Is there a free trial?", a: "Yes — all new tradies get a 14-day free trial with full Professional access. No credit card required to start." },
  { q: "What happens when my trial ends?", a: "You'll be prompted to choose a plan. If you don't subscribe, your account moves to view-only mode — you can see jobs but cannot send quotes." },
  { q: "What is the AI Quote Assistant?", a: "It reads the job details and instantly generates a professional quote including materials, labour, travel and margin. Available on Professional and above." },
  { q: "Can I cancel anytime?", a: "Yes. No lock-in contracts. Cancel anytime from your account settings and you won't be charged again." },
  { q: "Do homeowners pay anything?", a: "Posting a job is free for homeowners. A small booking deposit is held when they confirm a booking — this is refunded if the job doesn't proceed." },
];

export default function TradieSubscriptionPage() {
  const [billing, setBilling] = useState<"monthly" | "annual">("monthly");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [currentPlan] = useState("starter");

  const getPrice = (price: number) => billing === "annual" ? Math.round(price * 0.8) : price;

  return (
    <div className="flex min-h-screen bg-slate-50">
      <TradieSidebar />
      <main className="flex-1 flex flex-col min-w-0">
        <TradieTopbar />
        <div className="flex-1 overflow-y-auto">

          {/* Header */}
          <div className="bg-gradient-to-br from-[#0F172A] to-[#1E3A5F] px-8 py-12 text-center">
            <div className="flex items-center gap-3 mb-6">
              <Link href="/dashboard-tradie" className="text-gray-400 hover:text-white transition-colors">
                <ArrowLeft size={20} />
              </Link>
            </div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="inline-flex items-center gap-2 bg-orange-500/15 border border-orange-500/30 rounded-full px-4 py-1.5 mb-4">
                <Crown size={13} className="text-orange-400" />
                <span className="text-xs font-bold text-orange-400 tracking-wider uppercase">TradiePro Suite</span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-3">
                Choose your plan
              </h1>
              <p className="text-blue-200 text-base max-w-xl mx-auto mb-6">
                Every plan includes a 14-day free trial. No credit card required.
              </p>

              {/* Billing toggle */}
              <div className="inline-flex items-center bg-white/10 border border-white/15 rounded-xl p-1 gap-1">
                <button
                  onClick={() => setBilling("monthly")}
                  className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                    billing === "monthly" ? "bg-white text-gray-900" : "text-white/70 hover:text-white"
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBilling("annual")}
                  className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                    billing === "annual" ? "bg-white text-gray-900" : "text-white/70 hover:text-white"
                  }`}
                >
                  Annual
                  <span className="bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">Save 20%</span>
                </button>
              </div>
            </motion.div>
          </div>

          <div className="px-6 py-10 max-w-6xl mx-auto">

            {/* Plan cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-12 -mt-6">
              {plans.map((plan, i) => {
                const Icon = plan.icon;
                const isCurrent = plan.id === currentPlan;
                return (
                  <motion.div
                    key={plan.id}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="relative"
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                        <div className="bg-orange-500 text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg whitespace-nowrap">
                          ⭐ Most Popular
                        </div>
                      </div>
                    )}
                    <div
                      className="h-full bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col"
                      style={{
                        border: plan.popular ? `2px solid ${plan.color}` : `1px solid ${plan.border}`,
                        background: plan.popular ? plan.bg : "white",
                      }}
                    >
                      {/* Plan header */}
                      <div className="p-5 pb-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: plan.bg, border: `1px solid ${plan.border}` }}>
                            <Icon size={18} style={{ color: plan.color }} />
                          </div>
                          {isCurrent && (
                            <span className="text-xs font-bold text-green-600 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full">
                              Current
                            </span>
                          )}
                        </div>
                        <h3 className="font-bold text-gray-900 text-lg">{plan.name}</h3>
                        <p className="text-xs text-gray-400 mb-3">{plan.tagline}</p>
                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl font-bold text-gray-900">${getPrice(plan.price)}</span>
                          <span className="text-sm text-gray-400">/mo</span>
                        </div>
                        {billing === "annual" && (
                          <p className="text-xs text-green-600 font-medium mt-0.5">
                            Save ${(plan.price - getPrice(plan.price)) * 12}/year
                          </p>
                        )}
                        <div className="flex items-center gap-1.5 mt-2">
                          <MapPin size={12} style={{ color: plan.color }} />
                          <span className="text-xs font-semibold" style={{ color: plan.color }}>{plan.suburbs}</span>
                        </div>
                      </div>

                      {/* CTA */}
                      <div className="px-5 pb-4">
                        {isCurrent ? (
                          <div className="w-full py-2.5 rounded-xl text-center text-sm font-semibold text-gray-400 bg-gray-50 border border-gray-200">
                            Current plan
                          </div>
                        ) : (
                          <button
                            className="w-full py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 active:scale-95"
                            style={{ background: `linear-gradient(135deg, ${plan.color}, ${plan.color}dd)` }}
                          >
                            {plan.id === "starter" ? "Downgrade" : "Upgrade"} →
                          </button>
                        )}
                      </div>

                      {/* Features */}
                      <div className="px-5 pb-5 flex-1 border-t border-gray-100 pt-4">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Includes</p>
                        <div className="space-y-2">
                          {plan.features.map((f, fi) => (
                            <div key={fi} className="flex items-start gap-2">
                              <Check size={13} className="flex-shrink-0 mt-0.5" style={{ color: plan.color }} />
                              <span className="text-xs text-gray-600 leading-relaxed">{f}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* TradiePro Suite — Tool comparison table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-12"
            >
              {/* Table header */}
              <div className="bg-gradient-to-r from-[#0F172A] to-[#1E3A5F] px-6 py-5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-orange-500/20 border border-orange-500/30 rounded-xl flex items-center justify-center">
                    <Wrench size={16} className="text-orange-400" />
                  </div>
                  <div>
                    <h2 className="font-bold text-white text-lg">TradiePro Suite</h2>
                    <p className="text-blue-200 text-xs">AI-powered tools to run your trade business smarter</p>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest w-1/3">Tool</th>
                      {plans.map(p => (
                        <th key={p.id} className="px-4 py-4 text-center">
                          <span className="text-sm font-bold" style={{ color: p.color }}>{p.name}</span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {toolRows.map((row, i) => {
                      const Icon = row.icon;
                      const isAI = row.tool.startsWith("AI");
                      return (
                        <tr key={row.tool} className={`border-b border-gray-50 ${i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${isAI ? "bg-orange-50 border border-orange-200" : "bg-blue-50 border border-blue-100"}`}>
                                <Icon size={13} className={isAI ? "text-orange-500" : "text-blue-500"} />
                              </div>
                              <div>
                                <span className="text-sm font-semibold text-gray-900">{row.tool}</span>
                                {isAI && (
                                  <span className="ml-2 text-xs bg-orange-100 text-orange-600 font-bold px-1.5 py-0.5 rounded-full">AI</span>
                                )}
                              </div>
                            </div>
                          </td>
                          {[row.starter, row.professional, row.business, row.enterprise].map((has, j) => (
                            <td key={j} className="px-4 py-4 text-center">
                              {has ? (
                                <div className="inline-flex w-6 h-6 rounded-full bg-green-100 items-center justify-center mx-auto">
                                  <Check size={13} className="text-green-600" />
                                </div>
                              ) : (
                                <div className="inline-flex w-6 h-6 rounded-full bg-gray-100 items-center justify-center mx-auto">
                                  <X size={12} className="text-gray-300" />
                                </div>
                              )}
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* AI Quote Assistant spotlight */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-gradient-to-br from-[#0F172A] to-[#1E3A5F] rounded-2xl p-8 mb-12 overflow-hidden relative"
            >
              {/* Glow */}
              <div className="absolute top-0 right-0 w-64 h-64 pointer-events-none" style={{
                background: "radial-gradient(circle, rgba(249,115,22,0.15) 0%, transparent 70%)",
              }} />

              <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="inline-flex items-center gap-2 bg-orange-500/15 border border-orange-500/30 rounded-full px-3 py-1.5 mb-4">
                    <Zap size={12} className="text-orange-400 fill-orange-400" />
                    <span className="text-xs font-bold text-orange-400 uppercase tracking-wider">Signature Feature</span>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-3">
                    AI Quote Assistant
                  </h2>
                  <p className="text-blue-200 text-sm leading-relaxed mb-6">
                    Stop spending 30 minutes writing quotes. Our AI reads the job details and generates a complete professional quote in under 30 seconds — including materials, labour, travel and profit margin.
                  </p>
                  <div className="space-y-2">
                    {[
                      "Bill of materials with quantities",
                      "Labour hours estimate",
                      "Travel allowance by suburb",
                      "Recommended price range",
                      "Expected profit margin",
                      "Professional quote letter ready to send",
                    ].map(f => (
                      <div key={f} className="flex items-center gap-2">
                        <Check size={13} className="text-orange-400 flex-shrink-0" />
                        <span className="text-sm text-blue-100">{f}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6">
                    <span className="text-sm text-blue-300 font-medium">Available on Professional, Business and Enterprise</span>
                  </div>
                </div>

                {/* Mock quote card */}
                <div className="bg-white/08 backdrop-blur-sm border border-white/15 rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-xs text-blue-300 font-medium mb-0.5">Incoming Job</p>
                      <p className="font-bold text-white">Kitchen Splashback Tiling</p>
                      <p className="text-xs text-blue-300">Parramatta · 5m² · 600×300 tiles</p>
                    </div>
                    <div className="w-10 h-10 bg-orange-500/20 border border-orange-500/30 rounded-xl flex items-center justify-center">
                      <Wrench size={16} className="text-orange-400" />
                    </div>
                  </div>

                  <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2.5 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2 mb-4">
                    <Zap size={14} className="fill-white" />
                    ✨ Generate AI Quote
                  </button>

                  <div className="space-y-2 border-t border-white/10 pt-4">
                    {[
                      { label: "Materials", value: "$340" },
                      { label: "Labour (4hrs)", value: "$480" },
                      { label: "Travel allowance", value: "$25" },
                      { label: "Recommended quote", value: "$920–$1,080" },
                      { label: "Est. profit margin", value: "28–34%" },
                    ].map(r => (
                      <div key={r.label} className="flex items-center justify-between">
                        <span className="text-xs text-blue-300">{r.label}</span>
                        <span className="text-xs font-bold text-white">{r.value}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 bg-green-500/15 border border-green-500/25 rounded-xl px-3 py-2.5">
                    <p className="text-xs text-green-400 font-semibold">✅ Professional quote ready to send</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* FAQ */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mb-10"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">Frequently Asked Questions</h2>
              <div className="space-y-3 max-w-2xl mx-auto">
                {faqs.map((faq, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors"
                    >
                      <p className="font-semibold text-gray-900 text-sm">{faq.q}</p>
                      {openFaq === i
                        ? <ChevronUp size={16} className="text-gray-400 flex-shrink-0" />
                        : <ChevronDown size={16} className="text-gray-400 flex-shrink-0" />}
                    </button>
                    {openFaq === i && (
                      <div className="px-5 pb-4 text-sm text-gray-500 leading-relaxed border-t border-gray-100 pt-3 bg-slate-50">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Trust footer */}
            <div className="flex flex-wrap gap-6 justify-center pb-8">
              {[
                { icon: <ShieldCheck size={15} />, text: "Cancel anytime" },
                { icon: <Star size={15} />, text: "14-day free trial" },
                { icon: <Zap size={15} />, text: "No lock-in contracts" },
                { icon: <Check size={15} />, text: "Instant activation" },
              ].map(b => (
                <div key={b.text} className="flex items-center gap-2">
                  <span className="text-green-500">{b.icon}</span>
                  <span className="text-sm text-gray-500 font-medium">{b.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
