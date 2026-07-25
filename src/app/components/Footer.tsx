"use client";
import Image from "next/image";
import Link from "next/link";
import { Share2, MessageCircle, Camera, Briefcase } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#111827] text-gray-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">

          {/* Brand */}
          <div className="space-y-4">
            <div className="relative h-10 w-40">
              <Image src="/imports/GeTradie_Logo.png" alt="GeTradie" fill className="object-contain"/>
            </div>
            <p className="text-sm leading-relaxed">
              Australia&apos;s trusted platform for finding verified local tradies. Get quotes, compare prices, and hire with confidence.
            </p>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold mb-4 uppercase text-xs tracking-widest">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about"        className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/how-it-works" className="hover:text-white transition-colors">How It Works</Link></li>
              <li><Link href="/services"     className="hover:text-white transition-colors">Services</Link></li>
              <li><Link href="/cost-guides"  className="hover:text-white transition-colors">Cost Guides</Link></li>
              <li><a href="#"               className="hover:text-white transition-colors">Blog</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-semibold mb-4 uppercase text-xs tracking-widest">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/help"    className="hover:text-white transition-colors">Help Centre</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms"  className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="/cookies" className="hover:text-white transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>

          {/* Follow Us */}
          <div>
            <h4 className="text-white font-semibold mb-4 uppercase text-xs tracking-widest">Follow Us</h4>
            <div className="flex gap-3">
              {[Share2, MessageCircle, Camera, Briefcase].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 bg-gray-800 hover:bg-orange-500 rounded-full flex items-center justify-center transition-colors">
                  <Icon size={16} className="text-white"/>
                </a>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-600">
          <span>© {new Date().getFullYear()} GeTradie. All rights reserved.</span>
          <span>Built for Australia 🇦🇺</span>
        </div>
      </div>
    </footer>
  );
}
