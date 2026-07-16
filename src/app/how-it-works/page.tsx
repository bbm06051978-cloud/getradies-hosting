import Link from "next/link";
import { Metadata } from "next";
import { Navbar } from "@/app/components/Navbar";
import { Footer } from "@/app/components/Footer";
import {
  ArrowRight, CheckCircle, Star, ShieldCheck,
  Zap, MessageSquare, DollarSign, Calendar,
  Briefcase, Search, FileText, ThumbsUp,
} from "lucide-react";

export const metadata: Metadata = {
  title: "How GeTradie Works — Find & Hire Verified Tradies in Australia",
  description: "Learn how GeTradie connects homeowners with verified local tradies. Get AI-powered estimates, compare quotes and hire with confidence.",
};

const homeownerSteps = [
  {
    number: "01",
    icon: Zap,
    title: "Get an Instant AI Estimate",
    description: "Before posting anything, describe your job and get an instant AI-powered price estimate. Know your budget before you even speak to a tradie — with 80% accuracy based on real Australian job data.",
    color: "bg-blue-600",
    lightColor: "bg-blue-50",
    textColor: "text-blue-600",
    tip: "Tip: Be as specific as possible — mention your suburb, job size and any urgency to get the most accurate estimate.",
  },
  {
    number: "02",
    icon: FileText,
    title: "Post Your Job",
    description: "Create a free job post in minutes. Describe what you need, add your location and any photos. Your job is instantly visible to verified tradies in your area who specialise in your trade.",
    color: "bg-orange-500",
    lightColor: "bg-orange-50",
    textColor: "text-orange-500",
    tip: "Tip: Jobs with photos and detailed descriptions receive 3x more quotes from tradies.",
  },
  {
    number: "03",
    icon: MessageSquare,
    title: "Receive & Compare Quotes",
    description: "Verified tradies review your job and send fixed-price quotes. Compare their ratings, reviews, experience and prices side by side. Chat directly with tradies before committing to anything.",
    color: "bg-purple-600",
    lightColor: "bg-purple-50",
    textColor: "text-purple-600",
    tip: "Tip: Most jobs receive 3–5 quotes within 24 hours. You are never obligated to accept any quote.",
  },
  {
    number: "04",
    icon: ShieldCheck,
    title: "Hire with Confidence",
    description: "Accept the quote that best fits your needs and budget. Every tradie on GeTradie is background-checked and verified. Your booking is confirmed instantly and the tradie is notified.",
    color: "bg-green-600",
    lightColor: "bg-green-50",
    textColor: "text-green-600",
    tip: "Tip: Check the tradie's reviews and completed job count before accepting their quote.",
  },
  {
    number: "05",
    icon: ThumbsUp,
    title: "Job Done — Confirm & Review",
    description: "Once the tradie marks the job complete, you confirm it is done to your satisfaction. Leave a review to help other homeowners find great tradies. Dispute resolution is available if needed.",
    color: "bg-red-500",
    lightColor: "bg-red-50",
    textColor: "text-red-500",
    tip: "Tip: Honest reviews help the GeTradie community and reward quality tradies.",
  },
];

const tradieSteps = [
  {
    number: "01",
    icon: Briefcase,
    title: "Create Your Free Profile",
    description: "Sign up and build your tradie profile in minutes. Add your business name, specialty, license number, service area and a bio. A complete profile gets 5x more job leads.",
    color: "bg-orange-500",
    lightColor: "bg-orange-50",
    textColor: "text-orange-500",
  },
  {
    number: "02",
    icon: Search,
    title: "Browse Job Leads",
    description: "See real jobs posted by homeowners in your area that match your specialty. New leads appear daily — browse available jobs, review the details and decide which ones to quote on.",
    color: "bg-blue-600",
    lightColor: "bg-blue-50",
    textColor: "text-blue-600",
  },
  {
    number: "03",
    icon: DollarSign,
    title: "Send Competitive Quotes",
    description: "Send a fixed-price quote directly to the homeowner. Include a clear description of what is covered and your availability. No lead fees — you only pay a small subscription to access leads.",
    color: "bg-green-600",
    lightColor: "bg-green-50",
    textColor: "text-green-600",
  },
  {
    number: "04",
    icon: Calendar,
    title: "Get Booked & Scheduled",
    description: "When a homeowner accepts your quote, you get instantly notified and a booking is created. Manage your schedule, view homeowner contact details and confirm the appointment.",
    color: "bg-purple-600",
    lightColor: "bg-purple-50",
    textColor: "text-purple-600",
  },
  {
    number: "05",
    icon: Star,
    title: "Complete & Get Reviewed",
    description: "Complete the job, mark it as done on GeTradie and collect your payment. Homeowner confirms completion and leaves a review. Build your reputation and get more leads over time.",
    color: "bg-red-500",
    lightColor: "bg-red-50",
    textColor: "text-red-500",
  },
];

const faqs = [
  { q: "Is GeTradie free for homeowners?", a: "Yes — posting a job, receiving quotes and using the AI estimate is completely free for homeowners. You only pay the tradie directly for the work." },
  { q: "How are tradies verified?", a: "All tradies on GeTradie go through a verification process that includes licence checks, insurance verification and identity confirmation before they can quote on jobs." },
  { q: "How long does it take to get quotes?", a: "Most jobs receive their first quote within a few hours. You can expect 3–5 quotes within 24–48 hours depending on your location and trade type." },
  { q: "What if I am not happy with the work?", a: "GeTradie has a dispute resolution process. If the job is not completed to your satisfaction, raise a dispute and our team will review and help resolve the issue within 24 hours." },
  { q: "Is there a fee for tradies?", a: "Tradies pay a small monthly subscription to access job leads in their area. There are no per-lead fees or commissions — unlimited quotes for a flat monthly rate." },
  { q: "What trades does GeTradie cover?", a: "GeTradie covers 7 major trade categories: Plumbing, Electrical, Cleaning, Painting, Handyman, Carpentry and Removalists. More trades are being added regularly." },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="relative py-20 lg:py-[22rem] overflow-hidden bg-[url('/imports/HowItWork.png')] bg-cover bg-[center_top]">
        <div className="absolute inset-0 bg-blue-900/30" />
        
        {/* Added negative margin to pull the content upward over the background */}
        <div className="relative max-w-4xl mx-auto px-4 text-left -mt-12 lg:-mt-24">
          <span className="inline-block bg-orange-500 text-white text-xs font-bold px-4 py-1.5 rounded-full mb-5 uppercase tracking-widest">
            Simple 5-Step Process
          </span>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-5 leading-tight">
            How <span className="text-orange-400">GeTradie</span> Works
          </h1>
          <p className="text-blue-100 text-lg max-w-2xl mb-8">
            From AI-powered estimates to job completion — GeTradie makes hiring a tradie simple, transparent and stress-free.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-left">
            <Link href="/signup">
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3.5 rounded-xl font-bold text-sm transition-colors shadow-lg flex items-center gap-2">
                Post a Job Free <ArrowRight size={16} />
              </button>
            </Link>
            <Link href="/login-tradie">
              <button className="border-2 border-white/40 hover:border-white text-white px-8 py-3.5 rounded-xl font-bold text-sm transition-colors">
                I am a Tradie
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Quick stats */}
      <section className="bg-[#1a2744] py-10 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          {[
            { value: "10,000+", label: "Jobs Posted" },
            { value: "2,500+", label: "Verified Tradies" },
            { value: "80%", label: "AI Estimate Accuracy" },
            { value: "4.8★", label: "Average Rating" },
          ].map(s => (
            <div key={s.label}>
              <p className="text-3xl font-bold text-orange-400">{s.value}</p>
              <p className="text-blue-200 text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* For Homeowners */}
      <section className="py-16 lg:py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block bg-blue-100 text-blue-700 text-xs font-bold px-4 py-1.5 rounded-full mb-3 uppercase tracking-widest">
              For Homeowners
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Find & Hire a Tradie in <span className="text-orange-500">5 Easy Steps</span>
            </h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">
              No more awkward phone calls or surprise bills. GeTradie puts you in control from start to finish.
            </p>
          </div>

          <div className="space-y-6">
            {homeownerSteps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={step.number} className={`flex flex-col lg:flex-row gap-6 items-start ${i % 2 === 1 ? "lg:flex-row-reverse" : ""}`}>
                  {/* Number + icon */}
                  <div className="flex-shrink-0 flex flex-col items-center gap-3">
                    <div className={`w-16 h-16 rounded-2xl ${step.color} flex items-center justify-center shadow-lg`}>
                      <Icon size={28} className="text-white" />
                    </div>
                    {i < homeownerSteps.length - 1 && (
                      <div className="w-0.5 h-12 bg-gray-200 hidden lg:block" />
                    )}
                  </div>

                  {/* Content */}
                  <div className={`flex-1 ${step.lightColor} rounded-2xl p-6 border border-gray-100`}>
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`text-xs font-bold ${step.textColor} uppercase tracking-widest`}>
                        Step {step.number}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                    <p className="text-gray-600 leading-relaxed mb-4">{step.description}</p>
                    <div className="flex items-start gap-2 bg-white rounded-xl px-4 py-3 border border-gray-100">
                      <Zap size={14} className={`${step.textColor} flex-shrink-0 mt-0.5`} />
                      <p className="text-xs text-gray-500 leading-relaxed">{step.tip}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-10 text-center">
            <Link href="/signup">
              <button className="bg-blue-900 hover:bg-blue-800 text-white px-10 py-4 rounded-xl font-bold text-sm transition-colors shadow-lg inline-flex items-center gap-2">
                Post Your First Job Free <ArrowRight size={16} />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="bg-[#1a2744] py-10 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-2">
            Are you a <span className="text-orange-400">Tradie?</span>
          </h2>
          <p className="text-blue-200 text-sm">
            Join thousands of tradies growing their business on GeTradie
          </p>
        </div>
      </div>

      {/* For Tradies */}
      <section
        className="py-16 lg:py-20 px-4 relative"
        style={{
          backgroundImage: "url(/imports/HowItWork.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block bg-orange-500 text-white text-xs font-bold px-4 py-1.5 rounded-full mb-3 uppercase tracking-widest">
              For Tradies
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-white">
              Grow Your Business in <span className="text-orange-400">5 Steps</span>
            </h2>
            <p className="text-blue-100 mt-3 max-w-xl mx-auto">
              No more chasing leads. GeTradie brings verified job leads directly to you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {tradieSteps.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.number} className="bg-white rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-12 h-12 rounded-xl ${step.color} flex items-center justify-center flex-shrink-0`}>
                      <Icon size={22} className="text-white" />
                    </div>
                    <span className={`text-xs font-bold ${step.textColor} uppercase tracking-widest`}>
                      Step {step.number}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{step.description}</p>
                </div>
              );
            })}

            {/* CTA card */}
            <div className="bg-orange-500 rounded-2xl p-6 shadow-lg flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-white text-lg mb-2">Ready to Get Started?</h3>
                <p className="text-orange-100 text-sm leading-relaxed mb-6">
                  Join 2,500+ verified tradies already growing their business on GeTradie.
                </p>
              </div>
              <Link href="/signup-tradie">
                <button className="w-full bg-white hover:bg-gray-50 text-orange-600 py-3 rounded-xl font-bold text-sm transition-colors">
                  Join as a Tradie →
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why GeTradie */}
      <section className="py-16 px-4 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900">
              Why Choose <span className="text-orange-500">GeTradie?</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: Zap, title: "AI-Powered Estimates", desc: "Know your budget before engaging any tradie. Our AI provides accurate price estimates with 80% confidence.", color: "text-blue-600", bg: "bg-blue-50" },
              { icon: ShieldCheck, title: "Verified Tradies Only", desc: "Every tradie is background-checked, licence-verified and insured before joining GeTradie.", color: "text-green-600", bg: "bg-green-50" },
              { icon: DollarSign, title: "No Surprise Bills", desc: "Fixed-price quotes mean you know exactly what you will pay before the tradie starts work.", color: "text-orange-500", bg: "bg-orange-50" },
              { icon: MessageSquare, title: "Chat Before You Hire", desc: "Message tradies directly, ask questions and clarify details before accepting any quote.", color: "text-purple-600", bg: "bg-purple-50" },
              { icon: Star, title: "Real Reviews", desc: "Read honest reviews from real homeowners who have used each tradie on GeTradie.", color: "text-yellow-500", bg: "bg-yellow-50" },
              { icon: CheckCircle, title: "Dispute Protection", desc: "If something goes wrong, our dispute resolution team steps in to help resolve the issue.", color: "text-red-500", bg: "bg-red-50" },
            ].map(f => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <div className={`w-12 h-12 rounded-xl ${f.bg} flex items-center justify-center mb-4`}>
                    <Icon size={22} className={f.color} />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-slate-50 rounded-2xl p-6 border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
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
            Join thousands of Australians who use GeTradie to find trusted local tradies every day.
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
