"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Zap, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function Hero() {
  const [job, setJob] = useState("");
  const [estimate, setEstimate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [locationName, setLocationName] = useState("");

  const handleEstimate = async () => {
    if (!job.trim()) {
      setError("Please describe your job first.");
      return;
    }
    setLoading(true);
    setError("");
    setEstimate("");

    let currentLocation = "Sydney, NSW";
    if (navigator.geolocation) {
      try {
        const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            timeout: 5000,
          })
        );
        const { latitude, longitude } = pos.coords;
        const geoRes = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
        );
        const geoData = await geoRes.json();
        const suburb =
          geoData.address?.suburb ||
          geoData.address?.city ||
          geoData.address?.town ||
          "";
        const state = geoData.address?.state || "";
        currentLocation = suburb
          ? `${suburb}, ${state}`
          : state || "Sydney, NSW";
        setLocationName(currentLocation);
      } catch {
        currentLocation = "Sydney, NSW";
      }
    }

    try {
      const res = await fetch("/api/estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ job, location: currentLocation }),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setEstimate(data.estimate);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className="relative overflow-hidden py-12 lg:py-16"
      style={{
        backgroundImage: "url(/imports/hero_baground.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* LEFT — Content */}
          <div className="space-y-6">

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
              className="text-4xl lg:text-5xl font-bold text-white leading-tight"
            >
              Know the Price{" "}
              <span className="text-orange-400">Before</span>{" "}
              You Hire a Tradie.
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="text-blue-100 text-lg leading-relaxed"
            >
              Get an instant AI estimate, compare verified tradies,
              and hire with confidence — all in one place.
            </motion.p>

            {/* Search bar */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="flex flex-col sm:flex-row gap-2 max-w-lg"
            >
              <div className="flex-1 flex items-center border-2 border-gray-200 focus-within:border-blue-400 rounded-xl bg-white px-4 py-3 gap-2 shadow-sm transition-colors">
                <Search size={18} className="text-gray-400 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="e.g. fix leaking tap, paint bedroom"
                  value={job}
                  onChange={(e) => setJob(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleEstimate()}
                  className="flex-1 text-sm text-gray-700 outline-none bg-transparent"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleEstimate}
                disabled={loading}
                className="bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white px-5 py-3 rounded-xl font-semibold text-sm transition-colors whitespace-nowrap shadow-md flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Estimating...
                  </>
                ) : (
                  "Get an AI Estimate"
                )}
              </motion.button>
            </motion.div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 max-w-lg"
              >
                {error}
              </motion.div>
            )}

            {/* AI Estimate Result */}
            <AnimatePresence>
              {estimate && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="bg-white/95 backdrop-blur-sm rounded-2xl p-5 shadow-xl max-w-lg border border-blue-100"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center">
                        <Zap size={14} className="text-white fill-white" />
                      </div>
                      <span className="font-bold text-gray-900 text-sm">
                        AI Estimate
                      </span>
                    </div>
                    <button
                      onClick={() => setEstimate("")}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  {locationName && (
                    <p className="text-xs text-blue-600 font-medium mb-3 flex items-center gap-1">
                      📍 Based on your location: {locationName}
                    </p>
                  )}

                  {estimate.split("\n").find((line) => line.startsWith("🔧")) && (
                    <div className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1.5 rounded-full mb-3">
                      {estimate.split("\n").find((line) => line.startsWith("🔧"))}
                    </div>
                  )}

                  <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                    {estimate
                      .split("\n")
                      .filter((line) => !line.startsWith("🔧"))
                      .join("\n")}
                  </p>

                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <Link href="/login">
                      <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl text-sm font-semibold transition-colors">
                        Find a Tradie for This Job →
                      </button>
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* CTA Buttons */}
            {!estimate && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.45 }}
                className="flex flex-col sm:flex-row gap-3"
              >
                <Link href="/login">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl transition-colors shadow-md font-semibold text-sm"
                  >
                    Find A Tradie
                  </motion.button>
                </Link>
                <Link href="/login-tradie">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-xl transition-colors shadow-md font-semibold text-sm"
                  >
                    I am a Tradie
                  </motion.button>
                </Link>
              </motion.div>
            )}

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-wrap gap-4 pt-2"
            >
              {["✓ Verified Tradies", "✓ Free Estimates", "✓ No Lead Fees", "✓ Instant AI Pricing"].map((badge) => (
                <span key={badge} className="text-xs text-blue-200 font-medium">
                  {badge}
                </span>
              ))}
            </motion.div>
          </div>

          {/* RIGHT — Video */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            {/* Floating card */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-4 -right-4 z-10 bg-white rounded-2xl shadow-xl px-4 py-3 flex items-center gap-2"
            >
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-sm">✓</span>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900">Job Booked!</p>
                <p className="text-xs text-gray-500">Plumber · 2 mins ago</p>
              </div>
            </motion.div>

            {/* Video card */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gray-900">
              <video
                className="w-full h-auto"
                src="/imports/Hero_Video.mp4"
                autoPlay
                muted
                loop
                playsInline
              />
            </div>

            {/* Stats below video */}
            <div className="grid grid-cols-3 gap-3 mt-4">
              {[
                { value: "10,000+", label: "Jobs Posted" },
                { value: "5,000+", label: "Verified Tradies" },
                { value: "4.8★", label: "Average Rating" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 text-center border border-white/10"
                >
                  <p className="text-white font-bold text-lg">{stat.value}</p>
                  <p className="text-blue-200 text-xs mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}