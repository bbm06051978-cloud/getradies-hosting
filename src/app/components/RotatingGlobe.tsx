"use client";

import { motion } from "framer-motion";

export default function RotatingGlobe() {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{
        duration: 40,
        repeat: Infinity,
        ease: "linear",
      }}
      className="absolute top-10 right-12 hidden lg:block z-20"
    >
      <div className="relative w-40 h-40">

        {/* Blue Glow */}
        <div className="absolute inset-0 rounded-full bg-blue-500/30 blur-3xl"></div>

        <svg
          viewBox="0 0 200 200"
          className="relative w-full h-full drop-shadow-[0_0_30px_rgba(59,130,246,0.7)]"
        >

          {/* Outer Glow */}
          <circle
            cx="100"
            cy="100"
            r="82"
            fill="url(#globeFill)"
            stroke="#8fd3ff"
            strokeWidth="2"
          />

          {/* Horizontal Lines */}
          <ellipse cx="100" cy="100" rx="70" ry="55"
            fill="none"
            stroke="#9dd9ff"
            strokeOpacity=".45"
          />

          <ellipse cx="100" cy="100" rx="70" ry="35"
            fill="none"
            stroke="#9dd9ff"
            strokeOpacity=".35"
          />

          <ellipse cx="100" cy="100" rx="70" ry="18"
            fill="none"
            stroke="#9dd9ff"
            strokeOpacity=".30"
          />

          {/* Vertical Lines */}
          <ellipse
            cx="100"
            cy="100"
            rx="22"
            ry="82"
            fill="none"
            stroke="#9dd9ff"
            strokeOpacity=".40"
          />

          <ellipse
            cx="100"
            cy="100"
            rx="45"
            ry="82"
            fill="none"
            stroke="#9dd9ff"
            strokeOpacity=".30"
          />

          <ellipse
            cx="100"
            cy="100"
            rx="65"
            ry="82"
            fill="none"
            stroke="#9dd9ff"
            strokeOpacity=".20"
          />

          {/* Equator */}
          <line
            x1="18"
            y1="100"
            x2="182"
            y2="100"
            stroke="#d6f0ff"
            strokeOpacity=".45"
          />

          {/* Vertical Axis */}
          <line
            x1="100"
            y1="18"
            x2="100"
            y2="182"
            stroke="#d6f0ff"
            strokeOpacity=".25"
          />

          {/* Gradient */}
          <defs>
            <radialGradient id="globeFill">
              <stop offset="0%" stopColor="#60A5FA"/>
              <stop offset="60%" stopColor="#2563EB"/>
              <stop offset="100%" stopColor="#0B1F63"/>
            </radialGradient>
          </defs>

        </svg>

      </div>
    </motion.div>
  );
}