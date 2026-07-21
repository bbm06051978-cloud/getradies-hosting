"use client";
import { motion } from "motion/react";
import { Zap, FileText, MessageSquare, ShieldCheck, ThumbsUp, Search, Star, CheckCircle, DollarSign, Bell } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Get an AI Estimate",
    description: "Describe your job and instantly get an AI-powered price estimate based on real Australian job data.",
    color: "#3B82F6",
    gradient: "linear-gradient(135deg, #3B82F6, #1D4ED8)",
    icon: Zap,
    screenIcon: Search,
    screenTitle: "AI Estimate",
    screenContent: ["Electrical job", "$120 – $350 AUD", "2–3 hours estimate"],
  },
  {
    number: "02",
    title: "Post Your Job",
    description: "Create a free job post in minutes. Your job is instantly visible to verified tradies in your area.",
    color: "#F97316",
    gradient: "linear-gradient(135deg, #F97316, #EA580C)",
    icon: FileText,
    screenIcon: FileText,
    screenTitle: "Post a Job",
    screenContent: ["Fan installation", "Westmead, NSW", "3 tradies notified"],
  },
  {
    number: "03",
    title: "Compare Quotes",
    description: "Verified tradies send fixed-price quotes. Compare ratings and prices side by side.",
    color: "#8B5CF6",
    gradient: "linear-gradient(135deg, #8B5CF6, #7C3AED)",
    icon: MessageSquare,
    screenIcon: DollarSign,
    screenTitle: "Quotes Received",
    screenContent: ["hapa & co — $300", "chikka & co — $280", "⭐ 5.0 · Verified"],
  },
  {
    number: "04",
    title: "Hire with Confidence",
    description: "Accept the best quote and lock in your booking with a secure deposit.",
    color: "#10B981",
    gradient: "linear-gradient(135deg, #10B981, #059669)",
    icon: ShieldCheck,
    screenIcon: CheckCircle,
    screenTitle: "Booking Confirmed",
    screenContent: ["Mon 20 July · 10am", "chikka & co", "Deposit secured ✓"],
  },
  {
    number: "05",
    title: "Job Done — Review",
    description: "Tradie completes the job. You confirm and leave a review. Deposit released.",
    color: "#F59E0B",
    gradient: "linear-gradient(135deg, #F59E0B, #D97706)",
    icon: ThumbsUp,
    screenIcon: Star,
    screenTitle: "Leave a Review",
    screenContent: ["Fan installation", "⭐⭐⭐⭐⭐ 5.0", "Payment released ✓"],
  },
];

function IPhoneFrame({ step }: { step: typeof steps[0] }) {
  const Icon = step.screenIcon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      className="flex justify-center"
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        style={{ position: "relative" }}
      >
        {/* Glow */}
        <div style={{
          position: "absolute", inset: "-20px",
          background: `radial-gradient(ellipse, ${step.color}40 0%, transparent 70%)`,
          filter: "blur(20px)", zIndex: 0,
        }}/>

        {/* iPhone outer shell */}
        <div style={{
          position: "relative", zIndex: 1,
          width: "220px", height: "460px",
          borderRadius: "44px",
          background: "linear-gradient(145deg, #2a2a2a, #1a1a1a)",
          boxShadow: `0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.08), inset 0 0 0 1px rgba(255,255,255,0.05), 0 20px 40px ${step.color}30`,
          padding: "10px",
        }}>
          {/* Side buttons */}
          <div style={{ position: "absolute", left: "-3px", top: "80px", width: "3px", height: "28px", background: "#333", borderRadius: "2px 0 0 2px" }}/>
          <div style={{ position: "absolute", left: "-3px", top: "120px", width: "3px", height: "48px", background: "#333", borderRadius: "2px 0 0 2px" }}/>
          <div style={{ position: "absolute", left: "-3px", top: "180px", width: "3px", height: "48px", background: "#333", borderRadius: "2px 0 0 2px" }}/>
          <div style={{ position: "absolute", right: "-3px", top: "130px", width: "3px", height: "70px", background: "#333", borderRadius: "0 2px 2px 0" }}/>

          {/* Inner bezel */}
          <div style={{
            width: "100%", height: "100%",
            borderRadius: "36px",
            background: "#000",
            overflow: "hidden",
            position: "relative",
          }}>
            {/* White screen */}
            <div style={{
              width: "100%", height: "100%",
              background: "linear-gradient(145deg, #f8faff, #ffffff)",
              display: "flex", flexDirection: "column",
              position: "relative",
            }}>
              {/* Dynamic Island with GeTradie logo */}
              <div style={{
                position: "absolute", top: "10px", left: "50%",
                transform: "translateX(-50%)",
                width: "120px", height: "28px",
                background: "#000",
                borderRadius: "20px",
                zIndex: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "5px",
              }}>
                <div style={{
                  width: "14px", height: "14px",
                  background: "#F97316",
                  borderRadius: "4px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <span style={{ color: "#fff", fontSize: "8px", fontWeight: 900 }}>G</span>
                </div>
                <span style={{ color: "#fff", fontSize: "9px", fontWeight: 700 }}>GeTradie</span>
              </div>

              {/* Status bar */}
              <div style={{ display: "flex", justifyContent: "space-between", padding: "48px 16px 8px", zIndex: 5 }}>
                <span style={{ color: "#000", fontSize: "11px", fontWeight: 600 }}>9:41</span>
                <span style={{ color: "#000", fontSize: "11px" }}>●●● WiFi</span>
              </div>

              {/* App header */}
              <div style={{ padding: "0 16px 12px", borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
                <p style={{ color: "rgba(0,0,0,0.4)", fontSize: "10px", marginBottom: "2px" }}>GeTradie</p>
                <p style={{ color: "#111", fontWeight: 700, fontSize: "14px" }}>{step.screenTitle}</p>
              </div>

              {/* Content */}
              <div style={{ flex: 1, padding: "12px 14px", display: "flex", flexDirection: "column", gap: "8px" }}>
                <motion.div
                  animate={{ scale: [1, 1.02, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{
                    background: `${step.color}15`,
                    borderRadius: "14px", padding: "10px 12px",
                    display: "flex", alignItems: "center", gap: "10px",
                  }}
                >
                  <div style={{
                    width: "32px", height: "32px",
                    background: `${step.color}20`,
                    borderRadius: "10px",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    <Icon size={16} color={step.color}/>
                  </div>
                  <div>
                    {step.screenContent.map((line, i) => (
                      <p key={i} style={{
                        color: i === 0 ? "#111" : "rgba(0,0,0,0.5)",
                        fontSize: i === 0 ? "12px" : "11px",
                        fontWeight: i === 0 ? 700 : 400,
                        margin: 0,
                      }}>{line}</p>
                    ))}
                  </div>
                </motion.div>

                {/* Skeleton bars */}
                {[0.75, 1, 0.6].map((w, i) => (
                  <motion.div key={i}
                    animate={{ opacity: [0.3, 0.7, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                    style={{
                      height: "32px",
                      background: "rgba(0,0,0,0.06)",
                      borderRadius: "10px",
                      width: `${w * 100}%`,
                    }}
                  />
                ))}

                {/* Action button */}
                <motion.div
                  animate={{ scale: [1, 1.03, 1] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                  style={{
                    background: step.gradient,
                    borderRadius: "12px",
                    padding: "10px",
                    textAlign: "center",
                    marginTop: "4px",
                    boxShadow: `0 4px 12px ${step.color}40`,
                  }}
                >
                  <span style={{ color: "#fff", fontWeight: 700, fontSize: "12px" }}>Continue →</span>
                </motion.div>
              </div>

              {/* Bottom nav */}
              <div style={{
                display: "flex", justifyContent: "space-around",
                padding: "10px 16px 16px",
                borderTop: "1px solid rgba(0,0,0,0.08)",
              }}>
                {[Search, FileText, Bell, Star].map((NavIcon, i) => (
                  <NavIcon key={i} size={16} color={i === 0 ? step.color : "rgba(0,0,0,0.25)"}/>
                ))}
              </div>

              {/* Home indicator */}
              <div style={{
                position: "absolute", bottom: "6px", left: "50%",
                transform: "translateX(-50%)",
                width: "80px", height: "4px",
                background: "rgba(0,0,0,0.2)",
                borderRadius: "4px",
              }}/>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function HowItWorks() {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} className="text-center mb-20">
          <span className="inline-block bg-orange-100 text-orange-600 text-xs font-bold px-4 py-1.5 rounded-full mb-4 uppercase tracking-widest">
            Simple 5-Step Process
          </span>
          
<br/>         

          <h2 className="inline-block text-4xl lg:text-5xl font-bold text-gray-900 bg-blue-100/50 backdrop-blur-md border border-blue-200 px-6 py-3 rounded-2xl mb-4">
            How <span className="text-orange-500">GeTradie</span> Works
          </h2>


          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            From AI-powered estimates to job completion — simple, transparent and stress-free.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="space-y-28">
          {steps.map((step, i) => {
            const StepIcon = step.icon;
            const flip = i % 2 === 1;
            return (
              <div key={step.number}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${flip ? "lg:[direction:rtl]" : ""}`}>

                {/* Text */}
                <motion.div
                  initial={{ opacity: 0, x: flip ? 40 : -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  style={{ direction: "ltr" }}
                >
                  <div className="flex items-center gap-3 mb-5">
                    <motion.div
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 4, repeat: Infinity }}
                      className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                      style={{ background: step.gradient, boxShadow: `0 8px 20px ${step.color}40` }}>
                      <StepIcon size={22} color="#fff"/>
                    </motion.div>
                    <motion.span
                      animate={{ opacity: [0.1, 0.35, 0.1] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="text-7xl font-black"
                      style={{ color: step.color }}>
                      {step.number}
                    </motion.span>
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">{step.title}</h3>
                  <p className="text-gray-500 text-lg leading-relaxed mb-6">{step.description}</p>
                  <div className="flex items-center gap-2">
                    <motion.div animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 2, repeat: Infinity }}
                      className="w-2.5 h-2.5 rounded-full" style={{ background: step.color }}/>
                    <div className="h-px w-12" style={{ background: `${step.color}50` }}/>
                    <div className="w-2 h-2 rounded-full" style={{ background: `${step.color}30` }}/>
                  </div>
                </motion.div>

                {/* iPhone */}
                <div style={{ direction: "ltr" }}>
                  <IPhoneFrame step={step}/>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
