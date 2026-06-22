"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { User, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    "Home",
    "About Us",
    "How It Works",
    "Services",
    "Cost Guides",
    "Contact",
  ];

  return (
    <motion.nav
      className={`sticky top-0 z-50 bg-cover bg-center bg-no-repeat transition-all duration-300 ${
        scrolled
          ? "shadow-lg border-b border-gray-100"
          : "border-b border-transparent"
      }`}
      style={{ backgroundImage: "url(/imports/navbar_background.png)" }}
      initial={{ y: -64 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <div className="relative h-16 w-40">
          <Image
            src="/imports/GeTradie_Logo.png"
            alt="GeTradie"
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Nav links */}
        <div className="hidden sm:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link}
              href="#"
              className={`text-sm font-medium transition-colors ${
                link === "Home"
                  ? "text-red-600 border-b-2 border-red-600 pb-0.5"
                  : "text-gray-900 hover:text-red-600"
              }`}
            >
              {link}
            </a>
          ))}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          {/* Desktop Login Button */}
          <button className="hidden sm:flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white rounded-full px-4 py-1.5 text-sm font-medium transition-colors">
            <User size={15} />
            Login
          </button>

          {/* Mobile hamburger */}
          <button
            className="sm:hidden p-1.5 rounded-lg text-gray-600 hover:bg-gray-100"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="sm:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-3"
          >
            {navLinks.map((link) => (
              <a
                key={link}
                href="#"
                className="block text-sm text-gray-700 hover:text-red-600 font-medium py-1"
              >
                {link}
              </a>
            ))}

          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
