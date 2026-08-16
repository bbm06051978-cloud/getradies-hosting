"use client";
import { motion } from "motion/react";
import { Zap, FileText, MessageSquare, ShieldCheck, ThumbsUp } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Get an AI Estimate",
    description: "Describe your job and instantly get an AI-powered price estimate based on real Australian job data.",
    color: "#3B82F6",
    gradient: "linear-gradient(135deg, #3B82F6, #1D4ED8)",
    icon: Zap,
    image: "/imports/AI Estimate.webp",
  },
  {
    number: "02",
    title: "Post Your Job",
    description: "Create a free job post in minutes. Your job is instantly visible to verified tradies in your area.",
    color: "#F97316",
    gradient: "linear-gradient(135deg, #F97316, #EA580C)",
    icon: FileText,
    image: "/imports/AI post a job.webp",
  },
  {
    number: "03",
    title: "Compare Quotes",
    description: "Verified tradies send fixed-price quotes. Compare ratings and prices side by side.",
    color: "#8B5CF6",
    gradient: "linear-gradient(135deg, #8B5CF6, #7C3AED)",
    icon: MessageSquare,
    image: "/imports/AI quote and compare.webp",
  },
  {
    number: "04",
    title: "Hire with Confidence",
    description: "Accept the best quote and lock in your booking with a secure deposit.",
    color: "#10B981",
    gradient: "linear-gradient(135deg, #10B981, #059669)",
    icon: ShieldCheck,
    image: "/imports/AI completed and review.webp",
  },
  {
    number: "05",
    title: "Job Done — Review",
    description: "Tradie completes the job. You confirm and leave a review. Deposit released.",
    color: "#F59E0B",
    gradient: "linear-gradient(135deg, #F59E0B, #D97706)",
    icon: ThumbsUp,
    image: "/imports/AI dispute and resolution.webp",
  },
];

function StepImage({ step }: { step: typeof steps[0] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      className="flex justify-center"
    >
      <div style={{ position: "relative" }}>
        {/* Glow */}
        <div style={{
          position: "absolute", inset: "-20px",
          background: `radial-gradient(ellipse, ${step.color}30 0%, transparent 70%)`,
          filter: "blur(20px)", zIndex: 0,
        }}/>
        <img
          src={step.image}
          alt={step.title}
          style={{
            position: "relative", zIndex: 1,
            width: "100%", maxWidth: "320px",
            borderRadius: "20px",
            boxShadow: `0 20px 60px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05)`,
          }}
        />
      </div>
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
          <h2 className="inline-block text-2xl lg:text-3xl font-bold text-gray-900 bg-blue-100/50 backdrop-blur-md border border-blue-200 px-4 py-2 rounded-2xl mb-4">
            How <span className="text-orange-500">GeTradie</span> Works
          </h2>
          <p className="text-black-500 text-sm max-w-2xl mx-auto leading-relaxed">
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
                  <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-500 text-lg leading-relaxed mb-6">{step.description}</p>
                  <div className="flex items-center gap-2">
                    <motion.div animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 2, repeat: Infinity }}
                      className="w-2.5 h-2.5 rounded-full" style={{ background: step.color }}/>
                    <div className="h-px w-12" style={{ background: `${step.color}50` }}/>
                    <div className="w-2 h-2 rounded-full" style={{ background: `${step.color}30` }}/>
                  </div>
                </motion.div>

                {/* Image */}
                <div style={{ direction: "ltr" }}>
                  <StepImage step={step}/>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
