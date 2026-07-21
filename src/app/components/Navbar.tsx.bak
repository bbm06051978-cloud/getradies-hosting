"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";

const navLinks = [
  { label: "Home",         href: "/" },
  { label: "About Us",     href: "/about" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Services",     href: "/services" },
  { label: "Cost Guides",  href: "/cost-guides" },
  { label: "Contact",      href: "/contact" },
];

export function Navbar() {
  const [scrolled,      setScrolled]      = useState(false);
  const [menuOpen,      setMenuOpen]      = useState(false);
  const [hoveredIndex,  setHoveredIndex]  = useState<number | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => setMenuOpen(prev => !prev);

  return (
    <>
      <nav style={{ zIndex: 9999 }} className={`fixed top-0 left-0 right-0 transition-all duration-500 ease-in-out h-30 flex items-center ${
        scrolled
          ? "bg-[#060d4a]/40 backdrop-blur-md shadow-lg border-b border-white/10"
          : "bg-transparent border-b border-transparent"
      }`}>
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-12 flex items-center justify-between">

          {/* Logo + Globe */}
          <div className="flex items-center gap-1">
            <a href="/" className="relative h-50 w-80 flex-shrink-0 block">
              <Image
                src="/imports/GeTradie_Logo.png"
                alt="GeTradie Logo"
                fill
                className="object-contain object-left"
                priority
              />
            </a>
            <img
              src="/imports/globe.gif"
              alt=""
              className="w-20 h-20 rounded-full hidden md:block"
            />
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8 absolute left-[55%] -translate-x-1/2 whitespace-nowrap flex-nowrap">
            {navLinks.map((link, idx) => {
              const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
              return (
                <a
                  key={link.label}
                  href={link.href}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className={`relative py-2 transition-colors duration-300 whitespace-nowrap ${
                    isActive ? "text-yellow-400" : "text-white/80 hover:text-yellow-300"
                  }`}
                  style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "19px", fontWeight: "400" }}
                >
                  {link.label}
                  <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] bg-yellow-400 transition-all duration-300 ${
                    isActive || hoveredIndex === idx ? "w-full opacity-100" : "w-0 opacity-0"
                  }`}/>
                </a>
              );
            })}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">

           {/* Hamburger — mobile only */}
            <button
              type="button"
              className="md:hidden flex items-center justify-center w-10 h-10 text-white bg-white/10 rounded-lg"
              onClick={toggleMenu}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer — rendered outside nav to avoid z-index issues */}
      {menuOpen && (
        <div
          style={{ zIndex: 9998 }}
          className="fixed inset-0 top-20 bg-[#060d4a] px-6 py-8 flex flex-col md:hidden"
        >
          <div className="space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="block text-xl text-white font-semibold hover:text-yellow-400 transition-colors py-3 border-b border-white/10"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="mt-8 space-y-3">
            <a href="/login" onClick={() => setMenuOpen(false)}
              className="block w-full text-center bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-bold transition-colors">
              I Want a Tradie
            </a>
            <a href="/login-tradie" onClick={() => setMenuOpen(false)}
              className="block w-full text-center border border-white/30 text-white py-3 rounded-xl font-bold transition-colors">
              I am a Tradie
            </a>
          </div>
        </div>
      )}
    </>
  );
}
