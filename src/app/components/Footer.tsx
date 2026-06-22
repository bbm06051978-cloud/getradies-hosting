import Image from "next/image";
import { Share2, MessageCircle, Camera, Briefcase } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#111827] text-gray-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="space-y-4">
            <div className="relative h-10 w-40">
              <Image
                src="/imports/GeTradie_Logo.png"
                alt="GeTradie"
                fill
                className="object-contain"
              />
            </div>
            <p className="text-sm leading-relaxed">
              Australia&apos;s trusted platform for finding verified local tradies. Get
              quotes, compare prices, and hire with confidence.
            </p>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold mb-4 uppercase text-xs tracking-widest">
              Company
            </h4>
            <ul className="space-y-2 text-sm">
              {["About Us", "How It Works", "Blog"].map((link) => (
                <li key={link}>
                  <a href="#" className="hover:text-white transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-semibold mb-4 uppercase text-xs tracking-widest">
              Support
            </h4>
            <ul className="space-y-2 text-sm">
              {[
                "Help Centre",
                "Contact Us",
                "Privacy Policy",
                "Terms of Service",
                "Cookie Policy",
              ].map((link) => (
                <li key={link}>
                  <a href="#" className="hover:text-white transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Follow Us */}
          <div>
            <h4 className="text-white font-semibold mb-4 uppercase text-xs tracking-widest">
              Follow Us
            </h4>
            <div className="flex gap-3">
              {[Share2, MessageCircle, Camera, Briefcase].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 bg-gray-800 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors"
                >
                  <Icon size={16} className="text-white" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 pt-6 text-center text-xs text-gray-600">
          © {new Date().getFullYear()} GeTradie. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
