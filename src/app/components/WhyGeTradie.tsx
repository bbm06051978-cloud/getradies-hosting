"use client";
import { motion } from "motion/react";
import { ShieldCheck, Zap, Star, DollarSign, MessageSquare, Clock, Search, Bell, FileText } from "lucide-react";

const features = [
  { icon: Zap,          title: "AI-Powered Estimates",    desc: "Know your budget before hiring anyone", color: "#F97316" },
  { icon: ShieldCheck,  title: "Verified Tradies Only",   desc: "Every tradie background-checked",       color: "#3B82F6" },
  { icon: DollarSign,   title: "Booking Protection",      desc: "Pay a small lock amount to confirm your booking and protect against disputes",      color: "#10B981" },
  { icon: Star,         title: "Genuine Reviews",         desc: "Real reviews from verified homeowners", color: "#F59E0B" },
  { icon: MessageSquare,title: "Direct Messaging",        desc: "Chat with tradies before committing",   color: "#8B5CF6" },
  { icon: Clock,        title: "Fast Response",           desc: "Most jobs get quotes within 24 hours",  color: "#EC4899" },
];

function AppScreen() {
  return (
    <motion.div initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
      transition={{ duration:0.7 }} className="flex items-center justify-center">
      <div className="relative w-64 h-[500px] rounded-[3rem] border-4 border-gray-800 bg-gray-900 shadow-2xl overflow-hidden"
        style={{ boxShadow: "0 40px 80px rgba(249,115,22,0.25), 0 0 0 1px rgba(255,255,255,0.05)" }}>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-gray-900 rounded-b-2xl z-10"/>
        <div className="absolute inset-0 bg-gradient-to-br from-[#060d4a] to-[#1a2066] flex flex-col">
          <div className="flex justify-between px-5 pt-8 pb-2">
            <span className="text-white/50 text-sm font-medium">9:41</span>
            <span className="text-white/50 text-xs">●●● WiFi</span>
          </div>
          <div className="px-5 pb-3">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-white/50 text-xs">Welcome back</p>
                <p className="text-white font-bold text-base">Bidhu 👋</p>
              </div>
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <Bell size={14} className="text-white"/>
              </div>
            </div>
            <div className="bg-white/10 rounded-2xl px-3 py-2 flex items-center gap-2">
              <Search size={13} className="text-white/40"/>
              <span className="text-white/40 text-xs">Search jobs, tradies...</span>
            </div>
          </div>
          <div className="px-5 pb-3 grid grid-cols-3 gap-2">
            {[
              { label: "Active Jobs", value: "2", color: "#F97316" },
              { label: "Quotes In",   value: "5", color: "#3B82F6" },
              { label: "Done",   value: "8", color: "#10B981" },
            ].map(s => (
              <div key={s.label} className="bg-white/5 rounded-2xl p-2 text-center border border-white/10">
                <p className="font-bold text-base" style={{ color: s.color }}>{s.value}</p>
                <p className="text-white/40 text-xs leading-tight">{s.label}</p>
              </div>
            ))}
          </div>
          <div className="px-5 flex-1">
            <p className="text-white/50 text-xs font-bold uppercase tracking-widest mb-2">Recent Jobs</p>
            <div className="space-y-2">
              {[
                { title: "Fan Installation",  trade: "Electrical", status: "Booked", statusColor: "#8B5CF6", amount: "$300" },
                { title: "Blocked Drain Fix", trade: "Plumbing",   status: "Open",   statusColor: "#F97316", amount: "$150" },
                { title: "House Cleaning",    trade: "Cleaning",   status: "Done",   statusColor: "#10B981", amount: "$220" },
              ].map(job => (
                <div key={job.title} className="bg-white/5 border border-white/10 rounded-2xl p-2.5 flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${job.statusColor}20` }}>
                    <FileText size={12} style={{ color: job.statusColor }}/>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-xs font-semibold truncate">{job.title}</p>
                    <p className="text-white/40 text-xs">{job.trade}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs font-bold" style={{ color: job.statusColor }}>{job.status}</p>
                    <p className="text-white/50 text-xs">{job.amount}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-around px-5 py-3 border-t border-white/10 mt-2">
            {[Search, FileText, Bell, Star].map((Icon, i) => (
              <div key={i} className={`flex flex-col items-center gap-0.5 ${i === 0 ? "opacity-100" : "opacity-30"}`}>
                <Icon size={16} className="text-white"/>
                {i === 0 && <div className="w-1 h-1 bg-orange-400 rounded-full"/>}
              </div>
            ))}
          </div>
        </div>
        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-20 h-1 bg-white/20 rounded-full"/>
      </div>
    </motion.div>
  );
}

export function WhyGeTradie() {
  return (
    <section className="py-24 bg-gray-50 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">

        {/* Centered header */}
        <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }}
          viewport={{ once:true }} transition={{ duration:0.6 }} className="text-center mb-16">
          <div className="block mb-4">
            <span className="inline-block bg-orange-100 text-orange-600 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest">
              Why Choose Us
            </span>
          </div>
          <div className="block mb-4">
            <h2 className="inline-block text-4xl lg:text-5xl font-bold text-gray-900 bg-blue-100/50 backdrop-blur-md border border-blue-200 px-6 py-3 rounded-2xl">
              Why <span className="text-orange-500">GeTradie</span>?
            </h2>
          </div>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
            Australia's only tradie marketplace with AI-powered estimates, verified tradies and built-in dispute protection.
          </p>
        </motion.div>

        {/* Phone + Features side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <AppScreen/>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div key={f.title}
                  initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }}
                  viewport={{ once:true }} transition={{ duration:0.4, delay: i * 0.08 }}
                  className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md hover:border-orange-300 transition-all">
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center mb-3"
                    style={{ background: `${f.color}15` }}>
                    <Icon size={18} style={{ color: f.color }}/>
                  </div>
                  <p className="font-bold text-gray-900 text-md mb-1">{f.title}</p>
                  <p className="text-gray-700 text-xs leading-relaxed">{f.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
