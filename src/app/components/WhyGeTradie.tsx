"use client";

import {
  Clock,
  ShieldCheck,
  Tag,
  CalendarCheck,
  ThumbsUp,
} from "lucide-react";
import { motion } from "motion/react";

const benefits = [
  {
    icon: Clock,
    title: "Post Your Job in Minutes",
    description:
      "Describe what you need and post instantly to hundreds of local tradies.",
    color: "from-blue-500 to-blue-700",
    bg: "bg-blue-100",
    ring: "group-hover:ring-blue-300",
  },
  {
    icon: ShieldCheck,
    title: "Receive Quotes from Verified Tradies",
    description:
      "Only licensed and background-checked tradies can respond to your job.",
    color: "from-green-500 to-emerald-700",
    bg: "bg-green-100",
    ring: "group-hover:ring-green-300",
  },
  {
    icon: Tag,
    title: "Compare The Price & Chat",
    description:
      "Compare multiple fixed-price quotes & Chat directly before you commit to anything.",
    color: "from-orange-400 to-orange-600",
    bg: "bg-orange-100",
    ring: "group-hover:ring-orange-300",
  },
  {
    icon: CalendarCheck,
    title: "Convenience & Availability",
    description:
      "Book at a time that suits you — tradies show real availability upfront.",
    color: "from-purple-500 to-purple-700",
    bg: "bg-purple-100",
    ring: "group-hover:ring-purple-300",
  },
  {
    icon: ThumbsUp,
    title: "Hire with Confidence",
    description:
      "Read genuine reviews from real customers before you decide.",
    color: "from-red-500 to-rose-700",
    bg: "bg-red-100",
    ring: "group-hover:ring-red-300",
  },
];

export function WhyGeTradie() {
  return (
    <section
      className="relative overflow-hidden pt-8 pb-20"
      style={{
        backgroundImage: "url(/imports/handyman1.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Background Decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 right-10 w-64 h-64 rounded-full bg-blue-50 opacity-10 blur-3xl" />
        <div className="absolute bottom-10 left-10 w-64 h-64 rounded-full bg-orange-50 opacity-10 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center mb-16"
        >
          <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-4 py-1.5 rounded-full uppercase tracking-widest mb-4">
            Why Choose Us
          </span>

          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
            Why <span className="text-orange-600">GeTradie?</span>
          </h2>

          <p className="text-gray-700 mt-4 max-w-2xl mx-auto">
            We've built the smartest way to find, compare, and hire the right
            tradie.
          </p>
        </motion.div>

        {/* Benefit Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
          {benefits.map((benefit, i) => {
            const Icon = benefit.icon;

            return (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.35,
                  delay: i * 0.08,
                }}
                whileHover={{
                  y: -8,
                  scale: 1.03,
                }}
                className={`group flex flex-col items-center text-center p-4 rounded-2xl ${benefit.bg}
                  ring-2 ring-transparent ${benefit.ring}
                  transition-all duration-300
                  shadow-md hover:shadow-2xl cursor-pointer`}
              >
                <div
                  className={`w-16 h-6 rounded-2xl bg-gradient-to-br ${benefit.color}
                  flex items-center justify-center shadow-lg mb-2`}
                >
                  <Icon size={24} className="text-white" />
                </div>

                <h3 className="font-bold text-gray-900 text-lg leading-snug">
                  {benefit.title}
                </h3>

                <p className="text-gray-600 text-sm leading-relaxed mt-3">
                  {benefit.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}