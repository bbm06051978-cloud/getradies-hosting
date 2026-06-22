"use client";

import Image from "next/image";
import { motion } from "motion/react";

const steps = [
  {
    img: "/imports/Step1.png",
    title: "Describe Your Job",
    description:
      "Tell us what you need — add details like location, job type, and urgency.",
    color: "from-blue-500 to-blue-700",
    glow: "shadow-blue-200",
  },
  {
    img: "/imports/Step2.png",
    title: "Get an Estimated Price",
    description: "Our AI instantly shows a price range before you contact anyone.",
    color: "from-orange-400 to-orange-600",
    glow: "shadow-orange-200",
  },
  {
    img: "/imports/Step3.png",
    title: "Compare Tradies",
    description:
      "Browse verified tradies and compare ratings, reviews, and quotes.",
    color: "from-purple-500 to-purple-700",
    glow: "shadow-purple-200",
  },
  {
    img: "/imports/Step4.png",
    title: "Hire a Verified Tradie",
    description: "Choose with confidence — every tradie is background-checked.",
    color: "from-green-500 to-emerald-700",
    glow: "shadow-green-200",
  },
  {
    img: "/imports/Step5.png",
    title: "Job Done & Review",
    description:
      "Once complete, leave a review and help others find great tradies.",
    color: "from-red-500 to-rose-700",
    glow: "shadow-red-200",
  },
];

export function HowItWorks() {
  return (
    <section className="relative overflow-hidden bg-white-50 py-8 lg:py-10 border border-dotted border-gray-900">
      {/* Background blur */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-40 bg-blue-50 opacity-60 blur-3xl rounded-full" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="inline-block bg-orange-100 text-orange-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-3 uppercase tracking-widest">
            Simple Process
          </span>
          <h2 className="text-4xl font-bold text-gray-900">
            How <span className="text-red-600">GeTradie</span> Works
          </h2>
          <p className="text-gray-900 mt-3 max-w-xl mx-auto text-sm">
            From job post to completed work — our streamlined process gets it done fast.
          </p>
        </motion.div>

        {/* Steps grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 relative">
          {/* Connecting line (desktop only) */}
          <div className="hidden lg:block absolute top-[88px] left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-blue-300 via-purple-300 to-red-300 z-0" />

          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.12 }}
              whileHover={{ y: -6 }}
              className="relative flex flex-col items-center text-center gap-3 z-10 group"
            >
              {/* Image circle */}
              <div
                className={`relative w-40 h-40 max-w-full flex items-center justify-center rounded-full bg-white shadow-xl ${step.glow} group-hover:shadow-2xl transition-all duration-300`}
              >
                <motion.div
                  className={`absolute inset-0 rounded-full bg-gradient-to-br ${step.color} opacity-10 group-hover:opacity-20 transition-opacity`}
                />
                <div className="relative w-32 h-32">
                  <Image
                    src={step.img}
                    alt={step.title}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>

              {/* Number badge */}
              <div
                className={`w-9 h-9 rounded-full bg-gradient-to-br ${step.color} text-white flex items-center justify-center text-sm font-bold shadow-lg`}
              >
                {index + 1}
              </div>

              {/* Text */}
              <div>
                <h3 className="font-bold text-gray-900 text-sm mb-1">
                  {step.title}
                </h3>
                <p className="text-gray-900 text-xs leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
