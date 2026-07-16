"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { usePathname } from "next/navigation";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Services", href: "/services" },
  { label: "Cost Guides", href: "/cost-guides" },
  { label: "Contact", href: "/contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out h-20 flex items-center ${
        scrolled 
          ? "bg-[#060d4a]/40 backdrop-blur-md shadow-lg border-b border-white/10" 
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl w-full mx-auto px-6 sm:px-8 lg:px-12 flex items-center justify-between relative">
        
        <div className="relative">

    {/* Globe */}
    <div className="absolute left-9 top-15 z-20">

        

        <img
            src="/imports/globe.gif"
            alt=""
            className="relative w-13 h-13 rounded-full"
        />

    </div>

    {/* Logo */}
    <a
      href="/"
      className="relative h-48 w-48 sm:w-56 md:w-60 flex-shrink-0 block"
    >
      <Image
        src="/imports/GeTradie_Logo.png"
        alt="GeTradie Logo"
        fill
        className="object-contain object-left mix-blend-screen"
        priority
      />
    </a>

</div>

        {/* Nav Links — Centered One-Line Container with Small Caps Styling */}
        <div className="hidden md:flex items-center gap-4 lg:gap-8 absolute left-[55%] -translate-x-1/2 whitespace-nowrap flex-nowrap">
          {navLinks.map((link, idx) => {
            const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            
            return (
              <a
                key={link.label}
                href={link.href}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{ fontVariant: "small-caps" }}
className={`relative py-2 text-xl lg:text-base tracking-[0.05em] normal-case transition-colors duration-300 whitespace-nowrap block ${
                  isActive ? "text-yellow-400" : "text-white/80 hover:text-yellow-300"
                }`}
                style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "20px", fontWeight: "100" }}
              >
                {link.label}

                {/* Underline expansion */}
                <span 
                  className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.6)] transition-all duration-300 ease-out ${
                    isActive || hoveredIndex === idx ? "w-full opacity-100" : "w-0 opacity-0"
                  }`}
                />
              </a>
            );
          })}
        </div>

        {/* Mobile menu toggle button */}
        <button
          className="md:hidden p-2 text-white transition-colors hover:bg-white/10 rounded"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={20} strokeWidth={2} /> : <Menu size={20} strokeWidth={2} />}
        </button>
      </div>

      {/* Mobile drawer layout */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
            className="md:hidden fixed top-20 left-0 right-0 bottom-0 bg-[#060d4a]/95 backdrop-blur-lg px-8 py-12 flex flex-col z-40 border-t border-white/10"
          >
            <div className="space-y-6">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  style={{ fontVariant: "small-caps" }}
                  className="block text-xl tracking-[0.12em] text-white font-semibold hover:text-yellow-400 transition-colors py-2"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
