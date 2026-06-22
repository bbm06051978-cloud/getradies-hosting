"use client";

import { Search, Zap } from "lucide-react";
import { motion } from "motion/react";

export function Hero() {
  const sentences = [
    "Australia's Smarter Tradie Marketplace",
    "Where Trusted Tradies Meet Genuine Customers",
    "Real Jobs. Real Tradies. Real Results",
    "Verified And Trusted Local Tradies",
    "No Unnecessary Lead Fees For Tradies",
    "Simple, Secure, And Hassle-free Experience",
  ];

  const singleTrackText = sentences.join(" ⭐ ") + " ⭐ ";

  return (
    <section
      className="relative overflow-hidden bg-white-50 pb-8 pt-4 lg:pb-10 border border-dotted border-gray-500"
      style={{
        backgroundImage: "url(/imports/hero_baground.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <style>{`
        @keyframes slideLeft {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        .animate-marquee-track {
          display: inline-block;
          white-space: nowrap;
          animation: slideLeft 30s linear infinite;
        }
      `}</style>

      {/* Infinite marquee */}
      <div className="w-full bg-blue-900/10 backdrop-blur-sm border-y border-blue-900/10 py-2.5 mb-6 overflow-hidden whitespace-nowrap flex select-none">
        <div className="animate-marquee-track text-s font-bold text-blue-300 tracking-wider uppercase pr-4">
          {singleTrackText}
        </div>
        <div
          className="animate-marquee-track text-s font-bold text-blue-300 tracking-wider uppercase pr-4"
          aria-hidden="true"
        >
          {singleTrackText}
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative">
          <div className="space-y-6 max-w-2xl">

            {/* AI badge */}
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-blue-600 text-white text-xs font-semibold px-4 py-1.5 rounded-full shadow-lg"
            >
              <Zap size={12} className="fill-white" />
              AI-Powered Price Estimates — Instant &amp; Free
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl lg:text-4xl font-bold text-blue-300 leading-tight"
            >
              Know the Estimate First Then Connect To Tradie.{" "}
              <span className="relative inline-block mt-2">
                <span className="text-orange-500">GeTradie.</span>
                <br />
                <span className="text-3xl lg:text-4xl text-yellow-400 font-bold block mt-1" />
                <motion.span
                  className="absolute bottom-0 left-0 h-1 bg-blue-400 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 0.8, delay: 0.7 }}
                />
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="text-blue-100 text-lg"
            >
              Get quotes, compare prices, chat instantly, hire with confidence.
            </motion.p>

            {/* Trust badges placeholder */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="flex flex-wrap gap-3"
            />

            {/* Search bar */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="flex flex-col sm:flex-row gap-2 max-w-lg"
            >
              <div className="flex-1 flex items-center border-2 border-gray-200 focus-within:border-blue-400 rounded-xl bg-white px-4 py-3 gap-2 shadow-sm transition-colors">
                <Search size={18} className="text-gray-500" />
                <input
                  type="text"
                  placeholder="Tell Us Your Job"
                  className="flex-1 text-sm text-gray-700 outline-none bg-transparent"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="bg-green-500 hover:bg-orange-400 text-white px-5 py-3 rounded-xl font-semibold text-sm transition-colors whitespace-nowrap shadow-md"
              >
                Get an AI Estimate
              </motion.button>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.55 }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 8px 25px rgba(37,99,235,0.4)" }}
                whileTap={{ scale: 0.97 }}
                className="bg-indigo-600 hover:bg-blue-500 text-white px-8 py-1 rounded-xl transition-colors shadow-md"
              >
                Find A Tradie
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 8px 25px rgba(234,88,12,0.4)" }}
                whileTap={{ scale: 0.97 }}
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-1 rounded-xl transition-colors shadow-md"
              >
                I am a Tradie
              </motion.button>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
}
