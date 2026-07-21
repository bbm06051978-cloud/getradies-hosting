"use client";
import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/app/components/Navbar";
import { Footer } from "@/app/components/Footer";
import { motion } from "motion/react";
import {
  Zap, FileText, MessageSquare, ShieldCheck, ThumbsUp,
  Star, ArrowRight, CheckCircle, Search, DollarSign,
  ChevronDown, ChevronUp,
} from "lucide-react";

const homeownerSteps = [
  {
    number: "01", icon: Zap, color: "#3B82F6", gradient: "from-blue-500 to-blue-700",
    title: "Get an Instant AI Estimate",
    description: "Describe your job and get an instant AI-powered price estimate. Know your budget before speaking to any tradie — with 80% accuracy based on real Australian job data.",
    tip: "Be as specific as possible — mention suburb, job size and urgency.",
  },
  {
    number: "02", icon: FileText, color: "#F97316", gradient: "from-orange-500 to-orange-700",
    title: "Post Your Job",
    description: "Create a free job post in minutes. Your job is instantly visible to verified tradies in your area who specialise in your trade.",
    tip: "Jobs with photos receive 3x more quotes from tradies.",
  },
  {
    number: "03", icon: MessageSquare, color: "#8B5CF6", gradient: "from-purple-500 to-purple-700",
    title: "Receive & Compare Quotes",
    description: "Verified tradies send fixed-price quotes. Compare ratings, reviews and prices side by side. Chat directly before committing.",
    tip: "Most jobs receive 3–5 quotes within 24 hours.",
  },
  {
    number: "04", icon: ShieldCheck, color: "#10B981", gradient: "from-emerald-500 to-emerald-700",
    title: "Hire with Confidence",
    description: "Accept the best quote and lock in your booking with a secure deposit. Every tradie is background-checked and verified.",
    tip: "Check reviews and completed job count before accepting.",
  },
  {
    number: "05", icon: ThumbsUp, color: "#F59E0B", gradient: "from-amber-500 to-amber-700",
    title: "Job Done — Confirm & Review",
    description: "Tradie completes the job. You confirm and leave a review. Your deposit is released. Dispute resolution available if needed.",
    tip: "Your honest review helps other homeowners find great tradies.",
  },
];

const tradieSteps = [
  {
    number: "01", icon: Search, color: "#3B82F6", gradient: "from-blue-500 to-blue-700",
    title: "Sign Up & Get Verified",
    description: "Create your tradie profile, upload your licence and insurance. Our team verifies your credentials before you can quote on jobs.",
    tip: "Verified tradies get 5x more quote acceptances.",
  },
  {
    number: "02", icon: DollarSign, color: "#F97316", gradient: "from-orange-500 to-orange-700",
    title: "Browse & Quote on Jobs",
    description: "See job leads in your area that match your trade. Send fixed-price quotes with your availability and approach.",
    tip: "Quotes with a personal message get accepted more often.",
  },
  {
    number: "03", icon: CheckCircle, color: "#10B981", gradient: "from-emerald-500 to-emerald-700",
    title: "Get Booked & Confirmed",
    description: "When a homeowner accepts your quote they pay a lock amount. You confirm the booking and schedule the job.",
    tip: "Confirm bookings quickly — homeowners appreciate fast responses.",
  },
  {
    number: "04", icon: Star, color: "#F59E0B", gradient: "from-amber-500 to-amber-700",
    title: "Complete & Build Reputation",
    description: "Complete the job, mark it done on GeTradie. Homeowner confirms and leaves a review. Build your GeTradie Points and ranking.",
    tip: "More GeTradie Points = higher profile ranking = more leads.",
  },
];

const faqs = [
  { q: "Is GeTradie free for homeowners?", a: "Yes — posting a job, receiving quotes and using the AI estimate is completely free for homeowners. You only pay the tradie directly for the work." },
  { q: "How are tradies verified?", a: "All tradies go through a verification process including licence checks, insurance verification and identity confirmation before they can quote on jobs." },
  { q: "How long does it take to get quotes?", a: "Most jobs receive their first quote within a few hours. You can expect 3–5 quotes within 24–48 hours." },
  { q: "What if I am not happy with the work?", a: "GeTradie has a dispute resolution process. Raise a dispute and our team will review and resolve the issue within 24 hours." },
  { q: "Is there a fee for tradies?", a: "Tradies pay a small monthly subscription to access job leads. No per-lead fees or commissions — unlimited quotes for a flat monthly rate." },
  { q: "What is the lock amount?", a: "The lock amount is a security deposit ($50–$500) paid by the homeowner when accepting a quote. It's held by GeTradie and released to the tradie after job completion." },
];

function StepCard({ step, index }: { step: typeof homeownerSteps[0]; index: number }) {
  const Icon = step.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -6, scale: 1.02 }}
      className="relative group cursor-default"
    >
      {/* Shiny glow */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `radial-gradient(circle at 50% 0%, ${step.color}30, transparent 70%)`, filter: "blur(8px)" }}/>

      {/* Card */}
      <div className="relative bg-white rounded-2xl p-8 border border-gray-100 shadow-sm group-hover:shadow-xl group-hover:border-gray-200 transition-all duration-300 overflow-hidden">

        {/* Shine sweep effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
          style={{
            background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.4) 50%, transparent 60%)",
            transform: "translateX(-100%)",
            animation: "none",
          }}/>

        {/* Top accent line */}
        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${step.gradient} rounded-t-2xl`}/>

        {/* Number + Icon */}
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center flex-shrink-0 shadow-lg`}
            style={{ boxShadow: `0 8px 20px ${step.color}40` }}>
            <Icon size={22} className="text-white"/>
          </div>
          <span className="text-5xl font-black" style={{ color: `${step.color}15` }}>{step.number}</span>
        </div>

        <h3 className="font-bold text-gray-900 text-xl mb-3">{step.title}</h3>
        <p className="text-gray-500 text-base leading-relaxed mb-4">{step.description}</p>

        {/* Tip */}
        <div className="flex items-start gap-2 bg-gray-50 rounded-xl px-3 py-2">
          <span className="text-orange-400 text-xs mt-0.5">💡</span>
          <p className="text-sm text-gray-500 leading-relaxed">{step.tip}</p>
        </div>
      </div>
    </motion.div>
  );
}

function FAQItem({ faq }: { faq: typeof faqs[0] }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="border border-gray-100 rounded-2xl overflow-hidden bg-white shadow-sm"
    >
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors">
        <span className="font-semibold text-gray-900 text-sm">{faq.q}</span>
        {open ? <ChevronUp size={16} className="text-orange-500 flex-shrink-0"/> : <ChevronDown size={16} className="text-gray-400 flex-shrink-0"/>}
      </button>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="px-6 pb-4 text-sm text-gray-500 leading-relaxed border-t border-gray-100 pt-3">
          {faq.a}
        </motion.div>
      )}
    </motion.div>
  );
}

export default function HowItWorksPage() {
  const [activeTab, setActiveTab] = useState<"homeowner" | "tradie">("homeowner");

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="relative py-20 lg:py-[22rem] overflow-hidden bg-[url('/imports/HowItWork.png')] bg-cover bg-[center]">
        <div className="absolute inset-0 bg-blue-900/30"/>
        <div className="relative max-w-4xl mx-auto px-6 text-left">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-block bg-orange-500 text-white text-xs font-bold px-4 py-1.5 rounded-full mb-5 uppercase tracking-widest">
              Simple 5-Step Process
            </span>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-5 leading-tight">
              How <span className="text-orange-400">GeTradie</span> Works
            </h1>
            <p className="text-blue-100 text-lg max-w-2xl leading-relaxed mb-8">
              From AI-powered estimates to job completion — GeTradie makes hiring a tradie simple, transparent and stress-free.
            </p>
            <Link href="/login">
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3.5 rounded-xl font-bold text-sm transition-colors shadow-lg inline-flex items-center gap-2">
                Post a Job Free <ArrowRight size={16}/>
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Tab selector */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Step by Step Guide</h2>
            <div className="inline-flex bg-white rounded-2xl p-1.5 border border-gray-200 shadow-sm">
              <button onClick={() => setActiveTab("homeowner")}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  activeTab === "homeowner" ? "bg-blue-900 text-white shadow" : "text-gray-500 hover:text-gray-700"
                }`}>
                🏠 I'm a Homeowner
              </button>
              <button onClick={() => setActiveTab("tradie")}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  activeTab === "tradie" ? "bg-orange-500 text-white shadow" : "text-gray-500 hover:text-gray-700"
                }`}>
                🔧 I'm a Tradie
              </button>
            </div>
          </div>

          {/* Steps — alternating left right */}
          <div className="max-w-4xl mx-auto space-y-6">
            {(activeTab === "homeowner" ? homeownerSteps : tradieSteps).map((step, i) => (
              <div key={step.number} className={`flex gap-6 items-center ${i % 2 === 1 ? "flex-row-reverse" : "flex-row"}`}>
                <div className="flex-1 min-w-[320px]">
                  <StepCard step={step} index={i}/>
                </div>
                {/* Connector line */}
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center font-black text-white text-lg"
                    style={{ background: `linear-gradient(135deg, ${step.color}, ${step.color}cc)`, boxShadow: `0 8px 20px ${step.color}50` }}>
                    {i + 1}
                  </div>
                  {i < (activeTab === "homeowner" ? homeownerSteps : tradieSteps).length - 1 && (
                    <div className="w-0.5 h-16 mt-2" style={{ background: `linear-gradient(to bottom, ${step.color}50, transparent)` }}/>
                  )}
                </div>
                <div className="flex-1"/>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Frequently Asked <span className="text-orange-500">Questions</span></h2>
            <p className="text-gray-500">Everything you need to know about GeTradie</p>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => <FAQItem key={i} faq={faq}/>)}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-[#060d4a]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to get started?</h2>
          <p className="text-blue-200 mb-8">Join thousands of Australians who trust GeTradie for their home service needs.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/login">
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3.5 rounded-xl font-bold text-sm transition-colors shadow-lg flex items-center gap-2">
                Post a Job Free <ArrowRight size={16}/>
              </button>
            </Link>
            <Link href="/login-tradie">
              <button className="border border-white/30 hover:border-white text-white px-8 py-3.5 rounded-xl font-bold text-sm transition-colors">
                Join as a Tradie
              </button>
            </Link>
          </div>
        </div>
      </section>

      <Footer/>
    </div>
  );
}
