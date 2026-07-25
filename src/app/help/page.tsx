"use client";
import { useState } from "react";
import { Navbar } from "@/app/components/Navbar";
import { Footer } from "@/app/components/Footer";
import { ChevronDown, ChevronUp, Search, Home, Wrench, ShieldCheck, CreditCard, Star, HelpCircle } from "lucide-react";
import Link from "next/link";

const categories = [
  {
    id: "homeowners",
    icon: Home,
    color: "#3B82F6",
    bg: "bg-blue-50",
    label: "For Homeowners",
    faqs: [
      {
        q: "How do I post a job?",
        a: "Click 'Post New Job' from your dashboard or homepage. Describe what you need, add your location and any photos. Your job is instantly visible to verified tradies in your area. It's completely free for homeowners.",
      },
      {
        q: "How does the AI estimate work?",
        a: "Our AI analyses thousands of real Australian jobs to give you an accurate price range before you speak to any tradie. Simply describe your job and location — you'll get an instant estimate with 80% accuracy.",
      },
      {
        q: "How do I compare and accept quotes?",
        a: "Once tradies send quotes, go to 'My Quotes' to compare them side by side. You can view their ratings, reviews, and pricing. Chat with tradies before committing. When ready, click 'Accept Quote' to proceed to payment.",
      },
      {
        q: "What is the lock amount?",
        a: "The lock amount ($50–$500) is your security deposit when accepting a quote. It's held safely by GeTradie until you confirm the job is done. The more you lock, the more seriously tradies treat your job. This is part of your total job cost — pay the remaining balance directly to the tradie after completion.",
      },
      {
        q: "When do I pay the tradie?",
        a: "Payment works in two parts: (1) Lock amount paid via GeTradie when accepting the quote — held securely until job completion. (2) Remaining job balance paid directly to the tradie after the job is done to your satisfaction.",
      },
      {
        q: "How do I confirm job completion?",
        a: "Once the tradie marks the job as done, you'll receive a notification. Go to 'My Bookings', review the work, and click 'Confirm Complete'. This releases the lock amount to the tradie. If you're not satisfied, you can raise a dispute instead.",
      },
      {
        q: "What if the tradie doesn't show up?",
        a: "If a tradie fails to show up or cancels, contact GeTradie support immediately via the Contact page. Your lock amount is protected and will be refunded. You can then hire another tradie for your job.",
      },
    ],
  },
  {
    id: "tradies",
    icon: Wrench,
    color: "#F97316",
    bg: "bg-orange-50",
    label: "For Tradies",
    faqs: [
      {
        q: "How do I get verified on GeTradie?",
        a: "After signing up, complete your profile with your licence number, insurance details and a profile photo. Our team verifies your credentials within 24–48 hours. Verified tradies get significantly more quote acceptances.",
      },
      {
        q: "How does the subscription work?",
        a: "GeTradie offers two plans: Basic ($49/month) — up to 15 job leads in a 20km radius, and Pro ($99/month) — unlimited leads in a 40km radius. New tradies get 3 free quotes before subscribing. Subscriptions are monthly with no lock-in.",
      },
      {
        q: "What are GeTradie Points?",
        a: "GeTradie Points are earned when homeowners lock higher amounts when accepting your quotes. $50 lock = 1 point, $100 = 2 points, $250 = 5 points, $500 = 10 points. More points means a stronger profile and higher ranking in search results.",
      },
      {
        q: "What badge levels are there?",
        a: "Bronze (0–10 points), Silver (11–25 points), Gold (26–50 points), Platinum (51+ points). Higher badges signal trust and experience to homeowners, leading to more job acceptances.",
      },
      {
        q: "When do I receive my payment?",
        a: "The lock amount is held by GeTradie and released to you when the homeowner confirms job completion. GeTradie deducts a small fixed fee ($5–$20 depending on lock amount). The remaining job balance is paid directly by the homeowner.",
      },
      {
        q: "What is GeTradie's fee?",
        a: "GeTradie charges a fixed fee from the lock amount: $5 for $50 lock, $10 for $100 lock, $15 for $250 lock, $20 for $500 lock. There are no per-lead fees or commissions on the total job value.",
      },
      {
        q: "How do I encourage homeowners to lock more?",
        a: "Communicate clearly in your messages that a higher lock amount earns you more GeTradie Points, which strengthens your profile ranking. You can use the 'Request Higher Lock' button on your dashboard to send a message to homeowners.",
      },
    ],
  },
  {
    id: "disputes",
    icon: ShieldCheck,
    color: "#10B981",
    bg: "bg-green-50",
    label: "Disputes & Safety",
    faqs: [
      {
        q: "How do I raise a dispute?",
        a: "If you're unhappy with the work, go to 'My Bookings', find the relevant booking and click 'Raise Dispute'. Describe the issue clearly and our team will review it within 24 hours. The lock amount is held by GeTradie until the dispute is resolved.",
      },
      {
        q: "What happens during a dispute?",
        a: "GeTradie holds the lock amount securely. Our team reviews evidence from both parties (photos, messages, job description). We aim to resolve disputes within 24–48 hours. The outcome determines whether the lock amount is released to the tradie or refunded to the homeowner.",
      },
      {
        q: "Is my money safe?",
        a: "Yes. All payments are processed by Stripe — Australia's most trusted payment platform with 256-bit SSL encryption. Your lock amount is held in escrow by GeTradie until job completion or dispute resolution.",
      },
      {
        q: "Are tradies background checked?",
        a: "All tradies on GeTradie go through a verification process including licence checks, insurance verification and identity confirmation before they can quote on any jobs.",
      },
    ],
  },
  {
    id: "payments",
    icon: CreditCard,
    color: "#8B5CF6",
    bg: "bg-purple-50",
    label: "Payments & Billing",
    faqs: [
      {
        q: "What payment methods are accepted?",
        a: "GeTradie accepts all major credit and debit cards (Visa, Mastercard, American Express) via Stripe. All transactions are encrypted and secure.",
      },
      {
        q: "Can I get a refund on the lock amount?",
        a: "Yes — if the tradie cancels or fails to complete the job, your lock amount is fully refunded. Refunds typically appear within 3–5 business days depending on your bank.",
      },
      {
        q: "How does tradie subscription billing work?",
        a: "Tradie subscriptions are billed monthly. You can cancel at any time before the next billing date. Your access continues until the end of the current billing period.",
      },
    ],
  },
  {
    id: "account",
    icon: Star,
    color: "#F59E0B",
    bg: "bg-amber-50",
    label: "Account & Profile",
    faqs: [
      {
        q: "How do I reset my password?",
        a: "Currently password reset is done through our support team. Contact us via the Contact page and we'll help you reset your password within 24 hours. Self-service password reset is coming soon.",
      },
      {
        q: "How do I update my profile?",
        a: "Homeowners: Go to Dashboard → Profile. Tradies: Go to Dashboard → Profile or click your name in the top bar → My Profile. You can update your name, phone, suburb, and other details.",
      },
      {
        q: "How are reviews collected?",
        a: "After a job is marked complete and confirmed, the homeowner is prompted to leave a review. Reviews include a star rating and written comment. All reviews are from verified bookings — no fake reviews.",
      },
      {
        q: "Can I delete my account?",
        a: "Yes. Contact our support team via the Contact page to request account deletion. We'll process your request within 48 hours. Note that completed job history and reviews may be retained as required by Australian law.",
      },
    ],
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-100 rounded-2xl overflow-hidden bg-white shadow-sm">
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors">
        <span className="font-semibold text-gray-900 text-sm pr-4">{q}</span>
        {open ? <ChevronUp size={16} className="text-orange-500 flex-shrink-0"/> : <ChevronDown size={16} className="text-gray-400 flex-shrink-0"/>}
      </button>
      {open && (
        <div className="px-5 pb-4 pt-2 text-sm text-gray-600 leading-relaxed border-t border-gray-100">
          {a}
        </div>
      )}
    </div>
  );
}

export default function HelpPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("homeowners");

  const activeData = categories.find(c => c.id === activeCategory)!;
  const filtered = search
    ? categories.flatMap(c => c.faqs.filter(f =>
        f.q.toLowerCase().includes(search.toLowerCase()) ||
        f.a.toLowerCase().includes(search.toLowerCase())
      ))
    : activeData.faqs;

  return (
    <div className="min-h-screen bg-white">
      <Navbar/>

      {/* Hero */}
      <section className="relative py-20 lg:py-28 overflow-hidden" style={{
        background: "linear-gradient(135deg, #060d4a 0%, #1d4ed8 60%, #0369a1 100%)",
      }}>
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}/>
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <div className="w-14 h-14 bg-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <HelpCircle size={28} className="text-white"/>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Help <span className="text-orange-400">Centre</span>
          </h1>
          <p className="text-blue-100 text-lg mb-8">
            Find answers to common questions about GeTradie
          </p>
          {/* Search */}
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-5 py-3 max-w-xl mx-auto">
            <Search size={18} className="text-white/60 flex-shrink-0"/>
            <input
              type="text"
              placeholder="Search for answers..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-white outline-none text-sm placeholder-white/50"
            />
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">

          {/* Category tabs */}
          {!search && (
            <div className="flex flex-wrap gap-3 mb-10 justify-center">
              {categories.map(cat => {
                const Icon = cat.icon;
                return (
                  <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      activeCategory === cat.id
                        ? "bg-blue-900 text-white shadow-md"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}>
                    <Icon size={15}/>
                    {cat.label}
                  </button>
                );
              })}
            </div>
          )}

          {/* FAQs */}
          {search && (
            <p className="text-gray-500 text-sm mb-6 text-center">
              {filtered.length} result{filtered.length !== 1 ? "s" : ""} for &ldquo;{search}&rdquo;
            </p>
          )}

          <div className="space-y-3">
            {filtered.length > 0 ? (
              filtered.map((faq, i) => <FAQItem key={i} q={faq.q} a={faq.a}/>)
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg mb-4">No results found for &ldquo;{search}&rdquo;</p>
                <p className="text-gray-400 text-sm">Try different keywords or browse categories below</p>
                <button onClick={() => setSearch("")} className="mt-4 text-orange-500 font-semibold text-sm hover:text-orange-600">
                  Clear search
                </button>
              </div>
            )}
          </div>

          {/* Still need help */}
          <div className="mt-16 bg-blue-50 border border-blue-100 rounded-2xl p-8 text-center">
            <h3 className="font-bold text-gray-900 text-xl mb-2">Still need help?</h3>
            <p className="text-gray-500 text-sm mb-6">Our support team responds within 24 hours</p>
            <Link href="/contact">
              <button className="bg-blue-900 hover:bg-blue-800 text-white px-8 py-3 rounded-xl font-bold text-sm transition-colors">
                Contact Support
              </button>
            </Link>
          </div>
        </div>
      </section>

      <Footer/>
    </div>
  );
}
