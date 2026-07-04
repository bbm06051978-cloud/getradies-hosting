"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft, Search, ChevronDown, ChevronUp,
  MessageSquare, Phone, Mail, FileText,
  Briefcase, Calendar, DollarSign, ShieldCheck,
  User, HelpCircle, ExternalLink, CheckCircle, Send,
} from "lucide-react";
import { Sidebar } from "@/app/components/dashboard/Sidebar";
import { Topbar } from "@/app/components/dashboard/Topbar";

const categories = [
  {
    icon: Briefcase,
    label: "Posting Jobs",
    color: "text-blue-600",
    bg: "bg-blue-50",
    href: "#posting-jobs",
  },
  {
    icon: DollarSign,
    label: "Quotes & Pricing",
    color: "text-green-600",
    bg: "bg-green-50",
    href: "#quotes",
  },
  {
    icon: Calendar,
    label: "Bookings",
    color: "text-purple-600",
    bg: "bg-purple-50",
    href: "#bookings",
  },
  {
    icon: MessageSquare,
    label: "Chat & Messaging",
    color: "text-orange-500",
    bg: "bg-orange-50",
    href: "#chat",
  },
  {
    icon: ShieldCheck,
    label: "Safety & Trust",
    color: "text-red-500",
    bg: "bg-red-50",
    href: "#safety",
  },
  {
    icon: User,
    label: "My Account",
    color: "text-indigo-600",
    bg: "bg-indigo-50",
    href: "#account",
  },
];

const faqs = [
  {
    section: "posting-jobs",
    title: "Posting Jobs",
    items: [
      {
        q: "How do I post a job?",
        a: "Go to My Jobs in the sidebar and click 'Post New Job'. Fill in the job title, description, trade category and your location. The more detail you provide, the better quality quotes you will receive.",
      },
      {
        q: "Is posting a job free?",
        a: "Yes, posting a job on GeTradie is completely free for homeowners. You only pay the tradie directly once you accept their quote.",
      },
      {
        q: "How do I get an AI estimate before posting?",
        a: "On the home page, type your job description in the search bar and click 'Get an AI Estimate'. You will receive an instant price range based on your location and job type.",
      },
      {
        q: "Can I edit or cancel a job after posting?",
        a: "Yes. Go to My Jobs, find the job and click Cancel Job. You can cancel any job that is still in Open or Quoted status. Once a booking is confirmed, contact support to make changes.",
      },
      {
        q: "How long does it take to receive quotes?",
        a: "Most jobs receive their first quote within a few hours. You can expect 3–5 quotes within 24–48 hours depending on your suburb and trade type.",
      },
    ],
  },
  {
    section: "quotes",
    title: "Quotes & Pricing",
    items: [
      {
        q: "How do I compare quotes?",
        a: "Go to Quotes in the sidebar. You will see all quotes received for your jobs, including the tradie's price, rating and reviews. You can also message each tradie before deciding.",
      },
      {
        q: "What happens after I accept a quote?",
        a: "A booking is automatically created and the tradie is notified. You can view the booking details in the Bookings section of the sidebar.",
      },
      {
        q: "Can I negotiate the price with a tradie?",
        a: "Yes. Use the chat feature to message the tradie and discuss the scope or price before accepting their quote.",
      },
      {
        q: "Are the quotes fixed price?",
        a: "Yes, all quotes on GeTradie are fixed-price. The tradie quotes a specific amount for the job as described. If the scope changes, the tradie may provide a revised quote.",
      },
    ],
  },
  {
    section: "bookings",
    title: "Bookings",
    items: [
      {
        q: "How do I confirm a job is complete?",
        a: "When the tradie marks the job as done, you will receive a notification. Go to Bookings, find the booking and click 'Yes, Job Complete' to confirm. You can also raise a dispute if you are not satisfied.",
      },
      {
        q: "What if I need to reschedule?",
        a: "Go to Bookings, expand the booking and use the Reschedule option to pick a new date and time. The tradie will be notified of the change.",
      },
      {
        q: "How do I cancel a booking?",
        a: "Go to Bookings and click Cancel Booking. Please give the tradie as much notice as possible. Cancelling confirmed bookings may affect your account standing.",
      },
      {
        q: "What is PENDING CONFIRMATION status?",
        a: "This means the tradie has marked the job as done and is waiting for you to confirm completion. Review the work and either confirm it is complete or raise a dispute.",
      },
    ],
  },
  {
    section: "chat",
    title: "Chat & Messaging",
    items: [
      {
        q: "How do I message a tradie?",
        a: "Go to Quotes and click the Message button on any quote card. This opens the chat window with that tradie. You can also access all conversations from the Chats section in the sidebar.",
      },
      {
        q: "Are my messages private?",
        a: "Yes, messages between you and a tradie are private. GeTradie staff can only view messages in the event of a formal dispute.",
      },
      {
        q: "Can I share photos in chat?",
        a: "Photo sharing in chat is coming soon. For now, you can add photos when posting your job.",
      },
    ],
  },
  {
    section: "safety",
    title: "Safety & Trust",
    items: [
      {
        q: "How are tradies verified?",
        a: "All tradies on GeTradie undergo a verification process including licence checks, insurance verification and identity confirmation before they can quote on jobs.",
      },
      {
        q: "What if I have a dispute with a tradie?",
        a: "Go to Bookings, expand the booking and click 'Raise a Dispute'. Our team will review the dispute and contact both parties within 24 hours to help resolve the issue.",
      },
      {
        q: "Are my personal details safe?",
        a: "Yes. Your contact details are only shared with a tradie after you accept their quote. GeTradie never sells your personal information to third parties.",
      },
    ],
  },
  {
    section: "account",
    title: "My Account",
    items: [
      {
        q: "How do I update my profile?",
        a: "Go to Profile in the sidebar. Click Edit Profile to update your name, phone number, suburb and postcode. Click Save Changes when done.",
      },
      {
        q: "How do I change my password?",
        a: "Go to Profile and scroll to the Password & Security section. Click Change Password, enter your current password and your new password, then click Update Password.",
      },
      {
        q: "How do I delete my account?",
        a: "To delete your account, please contact our support team at hello@getradie.com.au. Please note that account deletion is permanent and cannot be undone.",
      },
    ],
  },
];

export default function HelpPage() {
  const [search, setSearch] = useState("");
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [contactForm, setContactForm] = useState({ subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const allFaqs = faqs.flatMap(s => s.items.map(item => ({ ...item, section: s.section, sectionTitle: s.title })));

  const filteredFaqs = search.trim()
    ? allFaqs.filter(f =>
        f.q.toLowerCase().includes(search.toLowerCase()) ||
        f.a.toLowerCase().includes(search.toLowerCase())
      )
    : null;

  const handleContactSubmit = async () => {
    if (!contactForm.subject || !contactForm.message) return;
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1500));
    setSubmitted(true);
    setSubmitting(false);
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <div className="p-8 flex-1 max-w-4xl mx-auto w-full">

          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link href="/dashboard" className="text-gray-400 hover:text-gray-600">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Help & Support</h1>
              <p className="text-gray-500 text-sm mt-0.5">Find answers or contact our support team</p>
            </div>
          </div>

          {/* Search */}
          <div className="bg-blue-900 rounded-2xl p-6 mb-8">
            <h2 className="text-xl font-bold text-white mb-1">How can we help you?</h2>
            <p className="text-blue-200 text-sm mb-4">Search our help articles or browse by category</p>
            <div className="flex items-center bg-white rounded-xl px-4 py-3 gap-3 shadow-sm">
              <Search size={18} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search help articles..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="flex-1 text-sm text-gray-700 outline-none bg-transparent"
              />
              {search && (
                <button onClick={() => setSearch("")} className="text-gray-400 hover:text-gray-600 text-xs">
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Search results */}
          {filteredFaqs && (
            <div className="mb-8">
              <p className="text-sm text-gray-500 mb-4">
                {filteredFaqs.length} result{filteredFaqs.length !== 1 ? "s" : ""} for &quot;{search}&quot;
              </p>
              {filteredFaqs.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 text-center border border-gray-100">
                  <HelpCircle size={36} className="text-gray-200 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">No results found</p>
                  <p className="text-gray-400 text-sm mt-1">Try different keywords or contact support below</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredFaqs.map((faq, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                      <button
                        onClick={() => setOpenFaq(openFaq === `search-${i}` ? null : `search-${i}`)}
                        className="w-full text-left px-5 py-4 flex items-center justify-between gap-4"
                      >
                        <div>
                          <span className="text-xs text-blue-600 font-semibold uppercase tracking-widest">{faq.sectionTitle}</span>
                          <p className="font-semibold text-gray-900 text-sm mt-0.5">{faq.q}</p>
                        </div>
                        {openFaq === `search-${i}` ? <ChevronUp size={16} className="text-gray-400 flex-shrink-0" /> : <ChevronDown size={16} className="text-gray-400 flex-shrink-0" />}
                      </button>
                      <AnimatePresence>
                        {openFaq === `search-${i}` && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                            className="px-5 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                            {faq.a}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Categories */}
          {!search && (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
                {categories.map(cat => {
                  const Icon = cat.icon;
                  return (
                    <a key={cat.label} href={cat.href}
                      className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:border-blue-200 hover:shadow-md transition-all flex items-center gap-3 group">
                      <div className={`w-10 h-10 rounded-xl ${cat.bg} flex items-center justify-center flex-shrink-0`}>
                        <Icon size={18} className={cat.color} />
                      </div>
                      <span className="font-semibold text-gray-700 text-sm group-hover:text-blue-700 transition-colors">{cat.label}</span>
                    </a>
                  );
                })}
              </div>

              {/* FAQ sections */}
              <div className="space-y-6 mb-8">
                {faqs.map(section => (
                  <div key={section.section} id={section.section}>
                    <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <span className="text-lg">{section.title}</span>
                    </h3>
                    <div className="space-y-2">
                      {section.items.map((faq, i) => {
                        const key = `${section.section}-${i}`;
                        return (
                          <div key={key} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            <button
                              onClick={() => setOpenFaq(openFaq === key ? null : key)}
                              className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors"
                            >
                              <p className="font-semibold text-gray-900 text-sm">{faq.q}</p>
                              {openFaq === key
                                ? <ChevronUp size={16} className="text-gray-400 flex-shrink-0" />
                                : <ChevronDown size={16} className="text-gray-400 flex-shrink-0" />}
                            </button>
                            <AnimatePresence>
                              {openFaq === key && (
                                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                                  className="px-5 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3 bg-slate-50">
                                  {faq.a}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Contact support */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

            {/* Contact cards */}
            <div className="space-y-3">
              <h3 className="font-bold text-gray-900 mb-4">Still need help?</h3>
              {[
                { icon: Mail, label: "Email Support", value: "hello@getradie.com.au", sub: "Response within 24 hours", href: "mailto:hello@getradie.com.au", color: "text-blue-600", bg: "bg-blue-50" },
                { icon: Phone, label: "Phone Support", value: "1800 GET TRADIE", sub: "Mon–Fri, 9am–6pm AEST", href: "tel:1800438872343", color: "text-green-600", bg: "bg-green-50" },
                { icon: FileText, label: "Contact Form", value: "Send us a message", sub: "For detailed enquiries", href: "/contact", color: "text-purple-600", bg: "bg-purple-50" },
              ].map(c => {
                const Icon = c.icon;
                return (
                  <a key={c.label} href={c.href}
                    className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:border-blue-200 transition-all flex items-center gap-4 group">
                    <div className={`w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center flex-shrink-0`}>
                      <Icon size={18} className={c.color} />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-400 font-medium">{c.label}</p>
                      <p className="font-semibold text-gray-900 text-sm">{c.value}</p>
                      <p className="text-xs text-gray-400">{c.sub}</p>
                    </div>
                    <ExternalLink size={14} className="text-gray-300 group-hover:text-blue-500 transition-colors" />
                  </a>
                );
              })}
            </div>

            {/* Quick message */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-bold text-gray-900 mb-1">Quick Message</h3>
              <p className="text-gray-400 text-xs mb-4">Send us a quick message and we will get back to you.</p>

              {submitted ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-3">
                    <CheckCircle size={28} className="text-green-500" />
                  </div>
                  <p className="font-bold text-gray-900 mb-1">Message Sent!</p>
                  <p className="text-sm text-gray-400">We will get back to you within 24 hours.</p>
                  <button onClick={() => { setSubmitted(false); setContactForm({ subject: "", message: "" }); }}
                    className="mt-4 text-blue-600 text-sm font-semibold hover:text-blue-800">
                    Send another message
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Subject</label>
                    <input type="text" value={contactForm.subject}
                      onChange={e => setContactForm({ ...contactForm, subject: e.target.value })}
                      placeholder="e.g. Problem with my booking"
                      className="w-full border border-gray-200 focus:border-blue-400 rounded-xl px-4 py-2.5 text-sm text-gray-700 outline-none transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Message</label>
                    <textarea value={contactForm.message}
                      onChange={e => setContactForm({ ...contactForm, message: e.target.value })}
                      placeholder="Describe your issue..."
                      rows={4}
                      className="w-full border border-gray-200 focus:border-blue-400 rounded-xl px-4 py-2.5 text-sm text-gray-700 outline-none transition-colors resize-none" />
                  </div>
                  <button onClick={handleContactSubmit}
                    disabled={submitting || !contactForm.subject || !contactForm.message}
                    className="w-full bg-blue-900 hover:bg-blue-800 disabled:bg-gray-200 disabled:text-gray-400 text-white py-3 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2">
                    {submitting ? (
                      <><svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg>Sending...</>
                    ) : (
                      <><Send size={15} />Send Message</>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Quick links */}
          <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
            <h3 className="font-bold text-gray-900 mb-4">Useful Links</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "How It Works", href: "/how-it-works" },
                { label: "Cost Guides", href: "/cost-guides" },
                { label: "About GeTradie", href: "/about" },
                { label: "Contact Us", href: "/contact" },
              ].map(l => (
                <Link key={l.label} href={l.href}>
                  <div className="bg-white rounded-xl px-4 py-3 text-sm font-semibold text-blue-700 hover:bg-blue-600 hover:text-white transition-colors text-center border border-blue-100">
                    {l.label}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
