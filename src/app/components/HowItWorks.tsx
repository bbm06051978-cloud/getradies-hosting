"use client";

import Image from "next/image";
import { motion } from "motion/react";

const steps = [
  {
    img: "/imports/Step1.png",
    title: "Describe Your Job",
    description:
      "Tell us what you need — add details like location, job type, and urgency.",
    color: "from-blue-600 to-blue-700",
    glow: "shadow-blue-800",
  },
  {
    img: "/imports/Step2.png",
    title: "Get an Estimated Price",
    description:
      "Our AI instantly shows a price range before you contact anyone.",
    color: "from-orange-500 to-orange-600",
    glow: "shadow-orange-800",
  },
  {
    img: "/imports/Step3.png",
    title: "Compare Tradies",
    description:
      "Browse verified tradies and compare ratings, reviews, and quotes.",
    color: "from-purple-600 to-purple-700",
    glow: "shadow-purple-800",
  },
  {
    img: "/imports/Step4.png",
    title: "Hire a Verified Tradie",
    description:
      "Choose with confidence — every tradie is background-checked.",
    color: "from-green-600 to-emerald-700",
    glow: "shadow-green-800",
  },
  {
    img: "/imports/Step5.png",
    title: "Job Done & Review",
    description:
      "Once complete, leave a review and help others find great tradies.",
    color: "from-red-600 to-rose-700",
    glow: "shadow-red-800",
  },
];

export function HowItWorks() {
  return (
    <section
      className="relative overflow-hidden py-16 lg:py-20 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/imports/HowItWork.png')",
      }}
    >
      {/* Premium Overlay */}
      {/* <div className="absolute inset-0 bg-gradient-to-br from-slate-900/85 via-blue-900/75 to-slate-900/85" /> */}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

          <h2 className="text-4xl lg:text-5xl font-bold text-black">
            How <span className="text-orange-600">GeTradie</span> Works
          </h2>

          <p className="text-black mt-3 max-w-xl mx-auto text-sm md:text-base">
            From job post to completed work — our streamlined process gets it
            done fast.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 relative">
          {/* Connecting line for desktop */}
          <div className="hidden lg:block absolute top-[88px] left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-blue-300 via-purple-300 to-red-300 z-0 opacity-70" />

          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: index * 0.12,
              }}
              whileHover={{
                y: -8,
                scale: 1.2,
              }}
              className="relative flex flex-col items-center text-center gap-3 z-10 group"
            >
              {/* Image Circle */}
              <div
                className={`relative w-40 h-40 max-w-full flex items-center justify-center rounded-full bg-white/95 backdrop-blur-sm shadow-xl ${step.glow} group-hover:shadow-2xl transition-all duration-300`}
              >
                <motion.div
                  className={`absolute inset-0 rounded-full bg-gradient-to-br ${step.color} opacity-10 group-hover:opacity-20 transition-opacity duration-300`}
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

              {/* Step Number */}
              <div
                className={`w-10 h-10 rounded-full bg-gradient-to-br ${step.color} text-white flex items-center justify-center text-sm font-bold shadow-lg`}
              >
                {index + 1}
              </div>

              {/* Text */}
              <div>
                <h3 className="font-bold text-white text-sm md:text-base mb-1">
                  {step.title}
                </h3>

                <p className="text-blue-800 text-xs md:text-sm leading-relaxed">
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