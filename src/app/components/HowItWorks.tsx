"use client";
import { motion } from "motion/react";
import { Zap, FileText, MessageSquare, ShieldCheck, ThumbsUp, Search, Star, CheckCircle, DollarSign, Bell } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Get an AI Estimate",
    description: "Describe your job and instantly get an AI-powered price estimate based on real Australian job data. Know your budget before speaking to any tradie.",
    color: "#3B82F6",
    gradient: "from-blue-400 to-blue-600",
    icon: Zap,
    screenIcon: Search,
    screenTitle: "AI Estimate",
    screenContent: ["Electrical job", "$120 – $350 AUD", "2–3 hours estimate"],
  },
  {
    number: "02",
    title: "Post Your Job",
    description: "Create a free job post in minutes. Your job is instantly visible to verified tradies in your area who specialise in your trade.",
    color: "#F97316",
    gradient: "from-orange-400 to-orange-600",
    icon: FileText,
    screenIcon: FileText,
    screenTitle: "Post a Job",
    screenContent: ["Fan installation", "Westmead, NSW", "3 tradies notified"],
  },
  {
    number: "03",
    title: "Receive & Compare Quotes",
    description: "Verified tradies send fixed-price quotes. Compare ratings, reviews and prices side by side. Chat directly before committing.",
    color: "#8B5CF6",
    gradient: "from-purple-400 to-purple-600",
    icon: MessageSquare,
    screenIcon: DollarSign,
    screenTitle: "Quotes Received",
    screenContent: ["hapa & co — $300", "chikka & co — $280", "⭐ 5.0 · Verified"],
  },
  {
    number: "04",
    title: "Hire with Confidence",
    description: "Accept the best quote and lock in your booking with a secure deposit. Every tradie is background-checked and verified.",
    color: "#10B981",
    gradient: "from-emerald-400 to-emerald-600",
    icon: ShieldCheck,
    screenIcon: CheckCircle,
    screenTitle: "Booking Confirmed",
    screenContent: ["Mon 20 July · 10am", "chikka & co", "Deposit secured ✓"],
  },
  {
    number: "05",
    title: "Job Done — Confirm & Review",
    description: "Tradie completes the job. You confirm and leave a review. Dispute resolution available if needed.",
    color: "#F59E0B",
    gradient: "from-amber-400 to-amber-600",
    icon: ThumbsUp,
    screenIcon: Star,
    screenTitle: "Leave a Review",
    screenContent: ["Fan installation", "⭐⭐⭐⭐⭐ 5.0", "Payment released ✓"],
  },
];

function PhoneMockup({ step }: { step: typeof steps[0] }) {
  const Icon = step.screenIcon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="flex items-center justify-center relative"
    >
      {/* Glow ring */}
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-56 h-[400px] rounded-[2.5rem]"
        style={{ background: `radial-gradient(ellipse, ${step.color}40 0%, transparent 70%)` }}
      />

      {/* Floating phone */}
      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        className="relative w-52 h-96 rounded-[2.5rem] border-4 border-gray-800 bg-gray-900 shadow-2xl overflow-hidden"
        style={{ boxShadow: `0 25px 60px ${step.color}50` }}
      >
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-5 bg-gray-900 rounded-b-xl z-10"/>

        {/* Screen */}
        <div className={`absolute inset-0 bg-gradient-to-br ${step.gradient} flex flex-col`}>
          {/* Status bar */}
          <div className="flex justify-between px-4 pt-7 pb-2">
            <span className="text-white/60 text-xs">9:41</span>
            <span className="text-white/60 text-xs">●●●</span>
          </div>

          {/* App header */}
          <div className="px-4 pb-3 border-b border-white/10">
            <p className="text-white/60 text-xs">GeTradie</p>
            <p className="text-white font-bold text-sm">{step.screenTitle}</p>
          </div>

          {/* Content card */}
          <div className="flex-1 px-4 pt-4 space-y-3">
            <motion.div
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="bg-white/15 backdrop-blur rounded-2xl p-3 flex items-center gap-3"
            >
              <div className="w-8 h-8 bg-white/25 rounded-xl flex items-center justify-center flex-shrink-0">
                <Icon size={16} className="text-white"/>
              </div>
              <div className="flex-1">
                {step.screenContent.map((line, i) => (
                  <p key={i} className={`text-white ${i === 0 ? "font-bold text-xs" : "text-xs opacity-70"}`}>{line}</p>
                ))}
              </div>
            </motion.div>

            {/* Fake UI skeleton */}
            <motion.div animate={{ opacity: [0.4, 0.8, 0.4] }} transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
              className="bg-white/15 rounded-xl h-8 w-3/4"/>
            <motion.div animate={{ opacity: [0.4, 0.8, 0.4] }} transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
              className="bg-white/15 rounded-xl h-8 w-full"/>
            <motion.div animate={{ opacity: [0.4, 0.8, 0.4] }} transition={{ duration: 2, repeat: Infinity, delay: 0.9 }}
              className="bg-white/15 rounded-xl h-8 w-2/3"/>

            <motion.div
              animate={{ scale: [1, 1.03, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="mt-4 bg-white rounded-xl py-2 px-4 text-center">
              <span className="text-xs font-bold" style={{ color: step.color }}>Continue →</span>
            </motion.div>
          </div>

          {/* Bottom nav */}
          <div className="flex justify-around px-4 py-3 border-t border-white/10">
            {[Search, FileText, Bell, Star].map((NavIcon, i) => (
              <NavIcon key={i} size={16} className={i === 0 ? "text-white" : "text-white/40"}/>
            ))}
          </div>
        </div>

        {/* Home indicator */}
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-16 h-1 bg-white/30 rounded-full"/>
      </motion.div>
    </motion.div>
  );
}

export function HowItWorks() {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
          className="text-center mb-20">
          <span className="inline-block bg-orange-100 text-orange-600 text-xs font-bold px-4 py-1.5 rounded-full mb-4 uppercase tracking-widest">
            Simple 5-Step Process
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            How <span className="text-orange-500">GeTradie</span> Works
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            From AI-powered estimates to job completion — GeTradie makes hiring a tradie simple, transparent and stress-free.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="space-y-24">
          {steps.map((step, i) => {
            const StepIcon = step.icon;
            const flip = i % 2 === 1;
            return (
              <div key={step.number}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${flip ? "lg:[direction:rtl]" : ""}`}>

                {/* Text side */}
                <motion.div
                  initial={{ opacity:0, x: flip ? 40 : -40 }}
                  whileInView={{ opacity:1, x:0 }}
                  viewport={{ once:true }}
                  transition={{ duration:0.6 }}
                  style={{ direction: "ltr" }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <motion.div
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
                      style={{ background: `${step.color}20` }}>
                      <StepIcon size={20} style={{ color: step.color }}/>
                    </motion.div>
                    <motion.span
                      animate={{ opacity: [0.15, 0.4, 0.15] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="text-6xl font-black"
                      style={{ color: step.color }}>
                      {step.number}
                    </motion.span>
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">{step.title}</h3>
                  <p className="text-gray-500 text-lg leading-relaxed mb-6">{step.description}</p>
                  <div className="flex items-center gap-2">
                    <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 2, repeat: Infinity }}
                      className="w-2 h-2 rounded-full" style={{ background: step.color }}/>
                    <div className="w-8 h-0.5" style={{ background: `${step.color}50` }}/>
                    <div className="w-2 h-2 rounded-full" style={{ background: `${step.color}30` }}/>
                    <div className="w-4 h-0.5" style={{ background: `${step.color}20` }}/>
                  </div>
                </motion.div>

                {/* Phone side */}
                <div style={{ direction: "ltr" }}>
                  <PhoneMockup step={step}/>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}