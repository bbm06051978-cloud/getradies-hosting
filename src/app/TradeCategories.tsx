"use client";

import Image from "next/image";
import { motion } from "motion/react";

const categories = [
  { label: "Plumbing",   img: "/imports/plumber.png",     shadow: "hover:shadow-blue-300" },
  { label: "Electrical", img: "/imports/electrician.png", shadow: "hover:shadow-yellow-300" },
  { label: "Removals",   img: "/imports/mover.png",       shadow: "hover:shadow-indigo-300" },
  { label: "Painting",   img: "/imports/painter.png",     shadow: "hover:shadow-sky-300" },
  { label: "Cleaning",   img: "/imports/cleaner.png",     shadow: "hover:shadow-cyan-300" },
  { label: "Handyman",   img: "/imports/handyman.png",    shadow: "hover:shadow-amber-300" },
  { label: "Carpentry",  img: "/imports/carpenter.png",   shadow: "hover:shadow-orange-300" },
];

export function TradeCategories() {
  return (
    <section className="relative overflow-hidden py-16 lg:py-20 bg-gradient-to-b from-white to-gray-50">
      {/* Decorative blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-72 h-72 rounded-full bg-blue-50 opacity-70 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full bg-orange-50 opacity-70 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
            Tradies You <span className="text-grey-900">Can Hire</span>
          </h2>
          <p className="text-gray-900 mt-3 max-w-xl mx-auto text-sm">
            Whatever the job, we&apos;ve got a verified tradie ready to help you today.
          </p>
        </motion.div>

        {/* Category grid */}
        <div className="grid grid-cols-4 lg:grid-cols-7 gap-4 lg:gap-6 justify-items-center">
          {categories.map((cat, i) => (
            <motion.button
              key={cat.label}
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              whileHover={{ y: -10, scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center gap-3 group cursor-pointer"
            >
              {/* Image circle */}
              <div
                className={`relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden shadow-lg transition-all duration-300 group-hover:shadow-2xl ${cat.shadow} ring-2 ring-transparent group-hover:ring-4 group-hover:ring-white`}
              >
                <Image
                  src={cat.img}
                  alt={cat.label}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>

              {/* Label */}
              <span className="text-sm font-semibold text-gray-700 group-hover:text-red-600 transition-colors duration-200">
                {cat.label}
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
