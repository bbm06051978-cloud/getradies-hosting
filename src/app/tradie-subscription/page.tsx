"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  Check, X, Zap, MapPin, Crown, Rocket, Building2, Star,
  ChevronDown, ChevronUp, ShieldCheck, Clock, TrendingUp,
  Brain, FileText, Calculator, Wrench, BarChart3, Globe,
} from "lucide-react";
import { TradieSidebar } from "@/app/components/tradie/TradieSidebar";
import { TradieTopbar } from "@/app/components/tradie/TradieTopbar";

// ── Plan data ─────────────────────────────────────────────────
const METRO_PLANS = [
  {
    id: "starter",
    name: "Starter",
    icon: Rocket,
    color: "#3B82F6",
    bg: "rgba(59,130,246,0.08)",
    border: "rgba(59,130,246,0.25)",
    monthlyPrice: 49,
    annualPrice: 39,
    radius: "20km",
    zone: "Metro",
    tagline: "Perfect for getting started",
    highlight: false,
    leads: "Up to 15 leads/month",
    exclusivity: "Standard access",
    features: [
      { text: "20km radius from your suburb",   ok: true  },
      { text: "Up to 15 job leads per month",   ok: true  },
      { text: "Basic tradie profile",            ok: true  },
      { text: "GST Calculator",                  ok: true  },
      { text: "Material Calculator",             ok: true  },
      { text: "In-app chat",                     ok: true  },
      { text: "Priority access window",          ok: false },
      { text: "AI Quote Assistant",              ok: false },
      { text: "Invoice Generator",               ok: false },
      { text: "Profit Analysis",                 ok: false },
      { text: "Business Reports",                ok: false },
    ],
  },
  {
    id: "professional",
    name: "Professional",
    icon: Star,
    color: "#F97316",
    bg: "rgba(249,115,22,0.08)",
    border: "rgba(249,115,22,0.35)",
    monthlyPrice: 79,
    annualPrice: 63,
    radius: "40km",
    zone: "Metro",
    tagline: "Most popular — best value",
    highlight: true,
    leads: "Up to 40 leads/month",
    exclusivity: "10-min head start",
    features: [
      { text: "40km radius from your suburb",   ok: true  },
      { text: "Up to 40 job leads per month",   ok: true  },
      { text: "Priority profile placement",      ok: true  },
      { text: "GST Calculator",                  ok: true  },
      { text: "Material Calculator",             ok: true  },
      { text: "In-app chat",                     ok: true  },
      { text: "10-min priority access window",   ok: true  },
      { text: "AI Quote Assistant ✨",           ok: true  },
      { text: "Invoice Generator",               ok: true  },
      { text: "Profit Analysis",                 ok: false },
      { text: "Business Reports",                ok: false },
    ],
  },
  {
    id: "business",
    name: "Business",
    icon: Building2,
    color: "#8B5CF6",
    bg: "rgba(139,92,246,0.08)",
    border: "rgba(139,92,246,0.30)",
    monthlyPrice: 129,
    annualPrice: 103,
    radius: "60km",
    zone: "Metro",
    tagline: "For growing trade businesses",
    highlight: false,
    leads: "Up to 100 leads/month",
    exclusivity: "15-min head start",
    features: [
      { text: "60km radius from your suburb",   ok: true  },
      { text: "Up to 100 job leads per month",  ok: true  },
      { text: "Top profile placement",           ok: true  },
      { text: "GST Calculator",                  ok: true  },
      { text: "Material Calculator",             ok: true  },
      { text: "In-app chat",                     ok: true  },
      { text: "15-min priority access window",   ok: true  },
      { text: "AI Quote Assistant ✨",           ok: true  },
      { text: "Invoice Generator",               ok: true  },
      { text: "Profit Analysis ✨",              ok: true  },
      { text: "Business Reports ✨",             ok: true  },
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    icon: Crown,
    color: "#22C55E",
    bg: "rgba(34,197,94,0.08)",
    border: "rgba(34,197,94,0.25)",
    monthlyPrice: 199,
    annualPrice: 159,
    radius: "Entire State",
    zone: "Metro",
    tagline: "State-wide coverage",
    highlight: false,
    leads: "Unlimited leads",
    exclusivity: "20-min head start",
    features: [
      { text: "Entire state coverage",           ok: true  },
      { text: "Unlimited job leads",             ok: true  },
      { text: "Featured tradie status",          ok: true  },
      { text: "GST Calculator",                  ok: true  },
      { text: "Material Calculator",             ok: true  },
      { text: "In-app chat",                     ok: true  },
      { text: "20-min priority access window",   ok: true  },
      { text: "AI Quote Assistant ✨",           ok: true  },
      { text: "Invoice Generator",               ok: true  },
      { text: "Profit Analysis ✨",              ok: true  },
      { text: "Business Reports ✨",             ok: true  },
    ],
  },
];

const REGIONAL_PLANS = [
  {
    id: "regional-starter",
    name: "Starter",
    icon: Rocket,
    color: "#3B82F6",
    monthlyPrice: 29,
    annualPrice: 23,
    radius: "50km",
    leads: "Up to 10 leads/month",
  },
  {
    id: "regional-professional",
    name: "Professional",
    icon: Star,
    color: "#F97316",
    monthlyPrice: 49,
    annualPrice: 39,
    radius: "100km",
    leads: "Up to 25 leads/month",
  },
  {
    id: "regional-business",
    name: "Business",
    icon: Building2,
    color: "#8B5CF6",
    monthlyPrice: 79,
    annualPrice: 63,
    radius: "200km",
    leads: "Up to 60 leads/month",
  },
  {
    id: "regional-enterprise",
    name: "Enterprise",
    icon: Crown,
    color: "#22C55E",
    monthlyPrice: 99,
    annualPrice: 79,
    radius: "Entire State",
    leads: "Unlimited leads",
  },
];

const TOOLS = [
  { name: "GST Calculator",      icon: Calculator, starter: true,  pro: true,  biz: true,  ent: true,  ai: false },
  { name: "Material Calculator", icon: Wrench,     starter: true,  pro: true,  biz: true,  ent: true,  ai: false },
  { name: "Invoice Generator",   icon: FileText,   starter: false, pro: true,  biz: true,  ent: true,  ai: false },
  { name: "AI Quote Assistant",  icon: Brain,      starter: false, pro: true,  biz: true,  ent: true,  ai: true  },
  { name: "AI Material List",    icon: Zap,        starter: false, pro: false, biz: true,  ent: true,  ai: true  },
  { name: "Profit Analysis",     icon: TrendingUp, starter: false, pro: false, biz: true,  ent: true,  ai: false },
  { name: "Business Reports",    icon: BarChart3,  starter: false, pro: false, biz: true,  ent: true,  ai: false },
  { name: "Custom Branding",     icon: Star,       starter: false, pro: false, biz: false, ent: true,  ai: false },
];

const FAQS = [
  { q: "Can I change my plan anytime?",         a: "Yes — upgrade or downgrade anytime. Changes take effect immediately and billing is prorated." },
  { q: "Is there a free trial?",                a: "Yes — all new tradies get a 14-day free trial on Professional. No credit card required." },
  { q: "How is my radius calculated?",          a: "Your radius is measured as a straight-line distance from your nominated base suburb using GPS coordinates. A 40km radius from Penrith covers roughly Parramatta, Blacktown, and the Blue Mountains foothills." },
  { q: "What is the priority access window?",   a: "Professional and above tradies see new jobs before Starter tradies. A 10-minute head start means you are often first to quote — tradies who quote first win 70% of jobs." },
  { q: "What is metro vs regional pricing?",    a: "Metro areas (Sydney, Melbourne, Brisbane) have denser job supply so radius is smaller but jobs are more frequent. Regional areas have larger radius to compensate for lower job density." },
  { q: "Can I cancel anytime?",                 a: "Yes — no lock-in contracts. Cancel anytime from your account settings." },
  { q: "What is the AI Quote Assistant?",       a: "It reads the job details and generates a complete professional quote in under 30 seconds — materials, labour, travel allowance, recommended price and profit margin. Available on Professional and above." },
  { q: "Do homeowners pay anything?",           a: "Posting a job is free. A small booking deposit is held when they confirm — refunded if the job doesn't proceed." },
];

export default function TradieSubscriptionPage() {
  const [billing, setBilling]   = useState<"monthly"|"annual">("monthly");
  const [zone, setZone]         = useState<"metro"|"regional">("metro");
  const [openFaq, setOpenFaq]   = useState<number|null>(null);
  const [currentPlan]           = useState("starter");

  const price = (p: { monthlyPrice: number; annualPrice: number }) =>
    billing === "annual" ? p.annualPrice : p.monthlyPrice;

  return (
    <div className="flex min-h-screen bg-slate-50">
      <TradieSidebar />
      <main className="flex-1 flex flex-col min-w-0">
        <TradieTopbar />
        <div className="flex-1 overflow-y-auto">

          {/* ── Hero header ── */}
          <div className="bg-gradient-to-br from-[#0F172A] to-[#1E3A5F] px-8 py-12 text-center">
            <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6 }}>
              <div className="inline-flex items-center gap-2 bg-orange-500/15 border border-orange-500/30 rounded-full px-4 py-1.5 mb-4">
                <Crown size={13} className="text-orange-400" />
                <span className="text-xs font-bold text-orange-400 tracking-wider uppercase">TradiePro Suite</span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-3">Choose your plan</h1>
              <p className="text-blue-200 text-base max-w-lg mx-auto mb-6">
                14-day free trial on Professional. No credit card required.
              </p>

              {/* Zone toggle */}
              <div className="flex justify-center gap-3 mb-5">
                <button onClick={() => setZone("metro")}
                  className={`px-5 py-2 rounded-xl text-sm font-bold transition-all border ${
                    zone === "metro"
                      ? "bg-white text-gray-900 border-white"
                      : "bg-white/10 text-white/70 border-white/20 hover:bg-white/15"
                  }`}>
                  🏙️ Metro
                </button>
                <button onClick={() => setZone("regional")}
                  className={`px-5 py-2 rounded-xl text-sm font-bold transition-all border ${
                    zone === "regional"
                      ? "bg-white text-gray-900 border-white"
                      : "bg-white/10 text-white/70 border-white/20 hover:bg-white/15"
                  }`}>
                  🌾 Regional
                </button>
              </div>

              {/* Billing toggle */}
              <div className="inline-flex items-center bg-white/10 border border-white/15 rounded-xl p-1 gap-1">
                <button onClick={() => setBilling("monthly")}
                  className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                    billing === "monthly" ? "bg-white text-gray-900" : "text-white/70 hover:text-white"
                  }`}>Monthly</button>
                <button onClick={() => setBilling("annual")}
                  className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                    billing === "annual" ? "bg-white text-gray-900" : "text-white/70 hover:text-white"
                  }`}>
                  Annual
                  <span className="bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">Save 20%</span>
                </button>
              </div>
            </motion.div>
          </div>

          <div className="px-6 py-10 max-w-6xl mx-auto">

            {/* ── Metro Plans ── */}
            {zone === "metro" && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-12 -mt-6">
                {METRO_PLANS.map((plan, i) => {
                  const Icon = plan.icon;
                  const isCurrent = plan.id === currentPlan;
                  return (
                    <motion.div key={plan.id}
                      initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }}
                      transition={{ duration:0.5, delay:i*0.08 }}
                      className="relative">
                      {plan.highlight && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                          <div className="bg-orange-500 text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg whitespace-nowrap">
                            ⭐ Most Popular
                          </div>
                        </div>
                      )}
                      <div className="h-full bg-white rounded-2xl shadow-sm flex flex-col overflow-hidden"
                        style={{ border: plan.highlight ? `2px solid ${plan.color}` : `1px solid ${plan.border}`, background: plan.highlight ? plan.bg : "white" }}>

                        {/* Header */}
                        <div className="p-5 pb-3">
                          <div className="flex items-center justify-between mb-3">
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                              style={{ background: plan.bg, border: `1px solid ${plan.border}` }}>
                              <Icon size={18} style={{ color: plan.color }} />
                            </div>
                            {isCurrent && (
                              <span className="text-xs font-bold text-green-600 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full">Current</span>
                            )}
                          </div>
                          <h3 className="font-bold text-gray-900 text-lg">{plan.name}</h3>
                          <p className="text-xs text-gray-400 mb-3">{plan.tagline}</p>
                          <div className="flex items-baseline gap-1 mb-1">
                            <span className="text-3xl font-bold text-gray-900">${price(plan)}</span>
                            <span className="text-sm text-gray-400">/mo</span>
                          </div>
                          {billing === "annual" && (
                            <p className="text-xs text-green-600 font-semibold mb-2">
                              Save ${(plan.monthlyPrice - plan.annualPrice) * 12}/year
                            </p>
                          )}
                          {/* Radius pill */}
                          <div className="flex items-center gap-1.5 mb-1">
                            <MapPin size={12} style={{ color: plan.color }} />
                            <span className="text-xs font-bold" style={{ color: plan.color }}>{plan.radius} radius</span>
                          </div>
                          {/* Leads */}
                          <div className="flex items-center gap-1.5 mb-1">
                            <Zap size={12} className="text-amber-500" />
                            <span className="text-xs text-gray-500 font-medium">{plan.leads}</span>
                          </div>
                          {/* Exclusivity */}
                          <div className="flex items-center gap-1.5">
                            <Clock size={12} className="text-purple-500" />
                            <span className="text-xs text-gray-500 font-medium">{plan.exclusivity}</span>
                          </div>
                        </div>

                        {/* CTA */}
                        <div className="px-5 pb-4">
                          {isCurrent ? (
                            <div className="w-full py-2.5 rounded-xl text-center text-sm font-semibold text-gray-400 bg-gray-50 border border-gray-200">
                              Current plan
                            </div>
                          ) : (
                            <button className="w-full py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 active:scale-95"
                              style={{ background: `linear-gradient(135deg,${plan.color},${plan.color}cc)` }}>
                              {plan.id === "starter" ? "Downgrade" : "Upgrade"} →
                            </button>
                          )}
                        </div>

                        {/* Features */}
                        <div className="px-5 pb-5 flex-1 border-t border-gray-100 pt-4 space-y-2">
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">What's included</p>
                          {plan.features.map((f, fi) => (
                            <div key={fi} className="flex items-start gap-2">
                              {f.ok
                                ? <Check size={13} className="flex-shrink-0 mt-0.5" style={{ color: plan.color }} />
                                : <X size={13} className="flex-shrink-0 mt-0.5 text-gray-300" />}
                              <span className={`text-xs leading-relaxed ${f.ok ? "text-gray-600" : "text-gray-300"}`}>{f.text}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* ── Regional Plans ── */}
            {zone === "regional" && (
              <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
                className="mb-12 -mt-6">
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 flex items-start gap-3">
                  <Globe size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-amber-800 text-sm">Regional pricing — bigger radius, lower price</p>
                    <p className="text-amber-700 text-xs mt-0.5">
                      Regional areas (Gosford, Kiama, Bathurst, etc.) get larger radius coverage at reduced rates
                      to account for lower job density. All Professional tools still included from $49/mo.
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                  {REGIONAL_PLANS.map((plan, i) => {
                    const Icon = plan.icon;
                    return (
                      <motion.div key={plan.id}
                        initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }}
                        transition={{ duration:0.5, delay:i*0.08 }}>
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 h-full flex flex-col">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-gray-50 border border-gray-100">
                              <Icon size={18} style={{ color: plan.color }} />
                            </div>
                            <div>
                              <p className="font-bold text-gray-900">{plan.name}</p>
                              <p className="text-xs text-gray-400">Regional</p>
                            </div>
                          </div>
                          <div className="flex items-baseline gap-1 mb-3">
                            <span className="text-3xl font-bold text-gray-900">${price(plan)}</span>
                            <span className="text-sm text-gray-400">/mo</span>
                          </div>
                          <div className="space-y-1.5 mb-4 flex-1">
                            <div className="flex items-center gap-2">
                              <MapPin size={12} style={{ color: plan.color }} />
                              <span className="text-xs font-bold" style={{ color: plan.color }}>{plan.radius} radius</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Zap size={12} className="text-amber-500" />
                              <span className="text-xs text-gray-500">{plan.leads}</span>
                            </div>
                          </div>
                          <button className="w-full py-2.5 rounded-xl text-sm font-bold text-white"
                            style={{ background: `linear-gradient(135deg,${plan.color},${plan.color}cc)` }}>
                            Select →
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* ── How radius works ── */}
            <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
              transition={{ delay:0.3 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
              <h2 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">
                <MapPin size={18} className="text-orange-500" /> How Your Radius Works
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    step: "1",
                    title: "Set your base suburb",
                    desc: "Enter your home suburb when signing up. e.g. Penrith, NSW",
                    color: "#3B82F6",
                  },
                  {
                    step: "2",
                    title: "Jobs within your radius",
                    desc: "Every job posted within your radius triggers an instant notification — SMS + app push within 60 seconds.",
                    color: "#F97316",
                  },
                  {
                    step: "3",
                    title: "Priority access window",
                    desc: "Professional+ tradies see jobs first. Starter tradies are unlocked after 10 minutes. First to quote wins 70% of jobs.",
                    color: "#8B5CF6",
                  },
                ].map(s => (
                  <div key={s.step} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white text-sm font-bold"
                      style={{ background: s.color }}>
                      {s.step}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm mb-1">{s.title}</p>
                      <p className="text-xs text-gray-500 leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Example */}
              <div className="mt-5 bg-slate-50 rounded-xl p-4 border border-slate-100">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Example — Penrith Plumber on Professional (40km)</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {[
                    { suburb: "St Marys",    km: "7.8km",  status: "✅" },
                    { suburb: "Parramatta",  km: "22.4km", status: "✅" },
                    { suburb: "Blacktown",   km: "18.6km", status: "✅" },
                    { suburb: "Lithgow",     km: "62.4km", status: "🔒" },
                  ].map(e => (
                    <div key={e.suburb} className="bg-white rounded-lg p-2.5 border border-gray-100 text-center">
                      <p className="text-lg">{e.status}</p>
                      <p className="text-xs font-bold text-gray-700">{e.suburb}</p>
                      <p className="text-xs text-gray-400">{e.km}</p>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-2">🔒 Lithgow is outside 40km radius — upgrade to Business (60km) to unlock</p>
              </div>
            </motion.div>

            {/* ── Tool comparison table ── */}
            <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
              transition={{ delay:0.4 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
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
                      {["Starter","Pro","Business","Enterprise"].map(p => (
                        <th key={p} className="px-4 py-4 text-center text-sm font-bold text-gray-600">{p}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {TOOLS.map((row, i) => {
                      const Icon = row.icon;
                      return (
                        <tr key={row.name} className={`border-b border-gray-50 ${i%2===0?"bg-white":"bg-gray-50/40"}`}>
                          <td className="px-6 py-3.5">
                            <div className="flex items-center gap-3">
                              <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${row.ai?"bg-orange-50 border border-orange-200":"bg-blue-50 border border-blue-100"}`}>
                                <Icon size={13} className={row.ai?"text-orange-500":"text-blue-500"} />
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-gray-900">{row.name}</span>
                                {row.ai && <span className="text-xs bg-orange-100 text-orange-600 font-bold px-1.5 py-0.5 rounded-full">AI</span>}
                              </div>
                            </div>
                          </td>
                          {[row.starter, row.pro, row.biz, row.ent].map((has, j) => (
                            <td key={j} className="px-4 py-3.5 text-center">
                              {has
                                ? <div className="inline-flex w-6 h-6 rounded-full bg-green-100 items-center justify-center mx-auto"><Check size={13} className="text-green-600" /></div>
                                : <div className="inline-flex w-6 h-6 rounded-full bg-gray-100 items-center justify-center mx-auto"><X size={12} className="text-gray-300" /></div>}
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* ── AI Quote Assistant spotlight ── */}
            <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
              transition={{ delay:0.5 }}
              className="bg-gradient-to-br from-[#0F172A] to-[#1E3A5F] rounded-2xl p-8 mb-8 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 pointer-events-none"
                style={{ background:"radial-gradient(circle,rgba(249,115,22,0.12) 0%,transparent 70%)" }} />
              <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="inline-flex items-center gap-2 bg-orange-500/15 border border-orange-500/30 rounded-full px-3 py-1.5 mb-4">
                    <Zap size={12} className="text-orange-400 fill-orange-400" />
                    <span className="text-xs font-bold text-orange-400 uppercase tracking-wider">Signature Feature</span>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-3">AI Quote Assistant</h2>
                  <p className="text-blue-200 text-sm leading-relaxed mb-5">
                    Stop spending 30 minutes writing quotes. Read the job, click generate, send in under 2 minutes.
                  </p>
                  <div className="space-y-2">
                    {["Materials with quantities","Labour hours estimate","Travel allowance by suburb","Recommended price range","Expected profit margin","Professional quote ready to send"].map(f => (
                      <div key={f} className="flex items-center gap-2">
                        <Check size={13} className="text-orange-400 flex-shrink-0" />
                        <span className="text-sm text-blue-100">{f}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-blue-400 mt-4">Available on Professional, Business and Enterprise</p>
                </div>
                {/* Mock quote card */}
                <div className="bg-white/08 backdrop-blur-sm border border-white/15 rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-xs text-blue-300 mb-0.5">Incoming Job • Penrith • 12km</p>
                      <p className="font-bold text-white">Kitchen Tap Replacement</p>
                    </div>
                    <div className="w-10 h-10 bg-orange-500/20 border border-orange-500/30 rounded-xl flex items-center justify-center">
                      <Wrench size={16} className="text-orange-400" />
                    </div>
                  </div>
                  <button className="w-full bg-orange-500 text-white py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 mb-4">
                    <Zap size={14} className="fill-white" /> ✨ Generate AI Quote
                  </button>
                  <div className="space-y-2 border-t border-white/10 pt-4">
                    {[
                      { label:"Materials",         value:"$85"         },
                      { label:"Labour (1.5 hrs)",  value:"$142"        },
                      { label:"Travel (12km)",      value:"$18"         },
                      { label:"Recommended quote",  value:"$245–$280"   },
                      { label:"Est. profit margin", value:"31–38%"      },
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

            {/* ── FAQ ── */}
            <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
              transition={{ delay:0.6 }} className="mb-10">
              <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">Frequently Asked Questions</h2>
              <div className="space-y-3 max-w-2xl mx-auto">
                {FAQS.map((faq, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <button onClick={() => setOpenFaq(openFaq===i?null:i)}
                      className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors">
                      <p className="font-semibold text-gray-900 text-sm">{faq.q}</p>
                      {openFaq===i ? <ChevronUp size={16} className="text-gray-400 flex-shrink-0" /> : <ChevronDown size={16} className="text-gray-400 flex-shrink-0" />}
                    </button>
                    {openFaq===i && (
                      <div className="px-5 pb-4 text-sm text-gray-500 leading-relaxed border-t border-gray-100 pt-3 bg-slate-50">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Trust strip */}
            <div className="flex flex-wrap gap-6 justify-center pb-8">
              {[
                { icon:<ShieldCheck size={15}/>, text:"Cancel anytime"       },
                { icon:<Star size={15}/>,        text:"14-day free trial"    },
                { icon:<Zap size={15}/>,         text:"No lock-in contracts" },
                { icon:<Check size={15}/>,       text:"Instant activation"   },
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
