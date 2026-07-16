"use client";

import Image from "next/image";
import { motion } from "motion/react";

const categories = [
  {
    label: "Plumbing",
    img: "/imports/plumber.png",
    shadow: "hover:shadow-blue-300",
  },
  {
    label: "Electrical",
    img: "/imports/electrician.png",
    shadow: "hover:shadow-yellow-300",
  },
  {
    label: "Removals",
    img: "/imports/mover.png",
    shadow: "hover:shadow-indigo-300",
  },
  {
    label: "Painting",
    img: "/imports/painter.png",
    shadow: "hover:shadow-sky-300",
  },
  {
    label: "Cleaning",
    img: "/imports/cleaner.png",
    shadow: "hover:shadow-cyan-300",
  },
  {
    label: "Handyman",
    img: "/imports/handyman.png",
    shadow: "hover:shadow-amber-300",
  },
  {
    label: "Carpentry",
    img: "/imports/carpenter.png",
    shadow: "hover:shadow-orange-300",
  },
];

export function TradeCategories() {
  return (
    <section>
      {/* Premium Overlay */}
      {/*<div className="absolute inset-0 bg-gradient-to-br from-slate-900/85 via-blue-900/75 to-slate-900/85" />*/}

      {/* Decorative Blobs */}
      <div className="absolute inset-0 pointer-events-none">
        
        <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full bg-orange-500/10 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-3 uppercase tracking-widest">
            All Trades Covered
          </span>

          <h2 className="text-3xl lg:text-5xl font-bold text-orange-600">
            Tradies <span className="text-black">You Can Hire</span>
          </h2>

          <p className="text-black mt-3 max-w-xl mx-auto text-sm md:text-base">
            Whatever the job, we've got a verified tradie ready to help you
            today.
          </p>
        </motion.div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-6 justify-items-center">
          {categories.map((cat, i) => (
            <motion.button
              key={cat.label}
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.45,
                delay: i * 0.08,
              }}
              whileHover={{
                y: -10,
                scale: 1.2,
              }}
              whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center gap-3 group cursor-pointer"
            >
              {/* Image Circle */}
              <div
                className={`relative w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-full overflow-hidden bg-white/95 backdrop-blur-sm shadow-xl transition-all duration-300 group-hover:shadow-2xl ${cat.shadow} ring-2 ring-transparent group-hover:ring-4 group-hover:ring-white/80`}
              >
                <Image
                  src={cat.img}
                  alt={cat.label}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>

              {/* Label */}
              <span className="text-sm md:text-base font-semibold text-black group-hover:text-orange-400 transition-colors duration-200">
                {cat.label}
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}