"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Navbar } from "@/app/components/Navbar";
import { Footer } from "@/app/components/Footer";
import {
  Mail, Phone, MapPin, Clock, Send,
  MessageSquare, HelpCircle, Briefcase,
  CheckCircle, ArrowRight,
} from "lucide-react";

const contactReasons = [
  { value: "general", label: "General Enquiry" },
  { value: "homeowner", label: "I am a Homeowner" },
  { value: "tradie", label: "I am a Tradie" },
  { value: "dispute", label: "Dispute or Complaint" },
  { value: "billing", label: "Billing Issue" },
  { value: "technical", label: "Technical Support" },
  { value: "partnership", label: "Partnership / Business" },
  { value: "media", label: "Media Enquiry" },
];

const faqs = [
  { q: "How do I post a job?", a: "Sign up as a homeowner, click Post a Job, describe your job and hit submit. It takes under 2 minutes and is completely free." },
  { q: "How do I join as a tradie?", a: "Click Sign Up as Tradie, complete your profile and upload your licence. Once verified you will start receiving job leads in your area." },
  { q: "How long does tradie verification take?", a: "Most tradies are verified within 24–48 business hours. You will receive an email once your account is approved." },
  { q: "Is GeTradie free for homeowners?", a: "Yes, posting jobs, receiving quotes and using the AI estimate are all completely free for homeowners." },
  { q: "How do I raise a dispute?", a: "Go to your Bookings page, find the booking and click Raise a Dispute. Our team will contact you within 24 hours." },
  { q: "How do I cancel a booking?", a: "Go to your Bookings page and click Cancel Booking. Cancellations before the scheduled time are free." },
];

const contactInfo = [
  {
    icon: Mail,
    label: "Email Us",
    value: "hello@getradie.com.au",
    subValue: "We respond within 24 hours",
    href: "mailto:hello@getradie.com.au",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    icon: Phone,
    label: "Call Us",
    value: "1800 GET TRADIE",
    subValue: "Mon–Fri, 9am–6pm AEST",
    href: "tel:1800438872343",
    color: "text-green-600",
    bg: "bg-green-50",
  },
  {
    icon: MapPin,
    label: "Our Location",
    value: "Sydney, NSW",
    subValue: "Australia",
    href: "#",
    color: "text-orange-500",
    bg: "bg-orange-50",
  },
  {
    icon: Clock,
    label: "Support Hours",
    value: "Mon–Fri 9am–6pm",
    subValue: "AEST timezone",
    href: "#",
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
];

const supportCategories = [
  { icon: MessageSquare, title: "General Support", desc: "Questions about how GeTradie works", color: "text-blue-600", bg: "bg-blue-50" },
  { icon: HelpCircle, title: "Homeowner Help", desc: "Help posting jobs, managing quotes and bookings", color: "text-green-600", bg: "bg-green-50" },
  { icon: Briefcase, title: "Tradie Support", desc: "Help with your tradie profile, leads and payments", color: "text-orange-500", bg: "bg-orange-50" },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", reason: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.message) return;
    setSubmitting(true);
    // Simulate submission
    await new Promise(r => setTimeout(r, 1500));
    setSubmitted(true);
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />



      {/* Hero Section */}
	<section className="relative py-20 lg:py-[22rem] overflow-hidden bg-[url('/imports/contactus.png')] bg-cover bg-[center]">

        <div className="absolute inset-0 bg-blue-950/40" />
        <div className="relative max-w-5xl mx-auto px-6 lg:px-12 text-left w-full z-10">
          <span className="inline-block bg-orange-500 text-white text-xs font-bold px-4 py-1.5 rounded-full mb-5 uppercase tracking-widest shadow-sm">
            Get in Touch
          </span>
          
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-5 leading-tight drop-shadow-md">
            We are Here to <span className="text-orange-400">Help</span>
          </h1>
          
          <p className="text-blue-100 font-medium text-base lg:text-lg max-w-xl leading-relaxed drop-shadow-sm">
            Have a question, need support or want to partner with us? Our team is ready to help. We respond to all enquiries within 24 hours.
          </p>
        </div>
      </section>





      {/* Contact info cards */}
      <section className="bg-[#1a2744] py-10 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4">
          {contactInfo.map(c => {
            const Icon = c.icon;
            return (
              <a key={c.label} href={c.href} className="bg-white/10 hover:bg-white/20 rounded-2xl p-5 text-center transition-colors">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Icon size={20} className="text-white" />
                </div>
                <p className="text-blue-200 text-xs font-medium mb-1">{c.label}</p>
                <p className="text-white font-bold text-sm">{c.value}</p>
                <p className="text-blue-300 text-xs mt-1">{c.subValue}</p>
              </a>
            );
          })}
        </div>
      </section>

      {/* Main content */}
      <section className="py-16 lg:py-20 px-4 bg-slate-50">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Send Us a Message</h2>
            <p className="text-gray-500 text-sm mb-6">Fill in the form and we will get back to you within 24 hours.</p>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-12 text-center"
              >
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle size={32} className="text-green-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                <p className="text-gray-500 text-sm mb-6">
                  Thank you for reaching out. Our team will get back to you within 24 hours.
                </p>
                <button
                  onClick={() => { setSubmitted(false); setForm({ name: "", email: "", phone: "", reason: "", message: "" }); }}
                  className="text-blue-600 hover:text-blue-800 font-semibold text-sm"
                >
                  Send another message
                </button>
              </motion.div>
            ) : (
              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Full Name *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Sarah Johnson"
                    className="w-full border border-gray-200 focus:border-blue-400 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none transition-colors"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Email Address *</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    placeholder="e.g. sarah@email.com"
                    className="w-full border border-gray-200 focus:border-blue-400 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none transition-colors"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Phone Number <span className="text-gray-400 normal-case font-normal">(optional)</span></label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                    placeholder="e.g. 0412 345 678"
                    className="w-full border border-gray-200 focus:border-blue-400 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none transition-colors"
                  />
                </div>

                {/* Reason */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Reason for Contact</label>
                  <select
                    value={form.reason}
                    onChange={e => setForm({ ...form, reason: e.target.value })}
                    className="w-full border border-gray-200 focus:border-blue-400 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none transition-colors bg-white"
                  >
                    <option value="">Select a reason...</option>
                    {contactReasons.map(r => (
                      <option key={r.value} value={r.value}>{r.label}</option>
                    ))}
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Message *</label>
                  <textarea
                    value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell us how we can help..."
                    rows={5}
                    className="w-full border border-gray-200 focus:border-blue-400 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none transition-colors resize-none"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubmit}
                  disabled={submitting || !form.name || !form.email || !form.message}
                  className="w-full bg-blue-900 hover:bg-blue-800 disabled:bg-gray-300 text-white py-3.5 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      Send Message
                    </>
                  )}
                </motion.button>

                <p className="text-xs text-gray-400 text-center">
                  By submitting this form you agree to our{" "}
                  <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
                </p>
              </div>
            )}
          </div>

          {/* Right side */}
          <div className="space-y-6">

            {/* Support categories */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-5">How Can We Help?</h2>
              <div className="space-y-3">
                {supportCategories.map(s => {
                  const Icon = s.icon;
                  return (
                    <div key={s.title} className={`${s.bg} rounded-2xl p-5 flex items-start gap-4`}>
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                        <Icon size={18} className={s.color} />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 mb-1">{s.title}</h3>
                        <p className="text-sm text-gray-600">{s.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Response time */}
            <div className="bg-[#1a2744] rounded-2xl p-6">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <Clock size={18} className="text-orange-400" />
                Response Times
              </h3>
              <div className="space-y-3">
                {[
                  { label: "General enquiries", time: "Within 24 hours" },
                  { label: "Dispute resolution", time: "Within 24 hours" },
                  { label: "Tradie verification", time: "Within 48 hours" },
                  { label: "Technical support", time: "Within 12 hours" },
                  { label: "Billing issues", time: "Within 24 hours" },
                ].map(r => (
                  <div key={r.label} className="flex items-center justify-between border-b border-blue-800 pb-2">
                    <p className="text-blue-200 text-sm">{r.label}</p>
                    <p className="text-orange-400 text-sm font-bold">{r.time}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick links */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-bold text-gray-900 mb-4">Quick Links</h3>
              <div className="space-y-2">
                {[
                  { label: "How GeTradie Works", href: "/how-it-works" },
                  { label: "Post a Job", href: "/signup" },
                  { label: "Join as a Tradie", href: "/signup-tradie" },
                  { label: "Cost Guides", href: "/cost-guides" },
                  { label: "About GeTradie", href: "/about" },
                ].map(l => (
                  <Link key={l.label} href={l.href}>
                    <div className="flex items-center justify-between py-2 px-3 rounded-xl hover:bg-orange-50 hover:text-orange-600 transition-colors group">
                      <span className="text-sm font-medium text-gray-700 group-hover:text-orange-600">{l.label}</span>
                      <ArrowRight size={14} className="text-gray-400 group-hover:text-orange-500" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <span className="inline-block bg-blue-100 text-blue-700 text-xs font-bold px-4 py-1.5 rounded-full mb-3 uppercase tracking-widest">
              FAQ
            </span>
            <h2 className="text-3xl font-bold text-gray-900">
              Frequently Asked <span className="text-orange-500">Questions</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-slate-50 rounded-2xl p-6 border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-2 text-sm">{faq.q}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-[#1a2744] py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-blue-200 mb-8">
            Post a job for free and receive quotes from verified local tradies within hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-xl font-bold text-sm transition-colors shadow-lg flex items-center gap-2">
                Post a Job Free <ArrowRight size={16} />
              </button>
            </Link>
            <Link href="/signup-tradie">
              <button className="border-2 border-blue-400 hover:border-white text-white px-8 py-4 rounded-xl font-bold text-sm transition-colors">
                Join as a Tradie
              </button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
