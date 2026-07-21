import Link from "next/link";
import { Metadata } from "next";
import { Navbar } from "@/app/components/Navbar";
import { Footer } from "@/app/components/Footer";
import { ArrowRight, CheckCircle, ChevronRight, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "Services — GeTradie | Find Local Plumbers, Electricians & More",
  description: "Browse all trade services on GeTradie. Find verified plumbers, electricians, cleaners, painters, carpenters and removalists across Australia.",
};

const trades = [
  {
    slug: "plumbing",
    emoji: "🔧",
    name: "Plumbing",
    tagline: "Fix leaks, blocked drains, hot water and more",
    description: "Licensed plumbers for all residential and commercial plumbing needs. From emergency repairs to full bathroom renovations.",
    avgCost: "$150 – $600",
    hourly: "$80 – $250/hr",
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-100",
    button: "bg-blue-600 hover:bg-blue-700",
    jobs: ["Leaking taps", "Blocked drains", "Hot water systems", "Toilet repairs", "Shower installation", "Pipe replacement"],
  },
  {
    slug: "electrical",
    emoji: "⚡",
    name: "Electrical",
    tagline: "Safe, licensed electrical work for your home",
    description: "Certified electricians for installations, repairs and inspections. All work is compliant with Australian electrical standards.",
    avgCost: "$120 – $500",
    hourly: "$90 – $220/hr",
    color: "text-yellow-600",
    bg: "bg-yellow-50",
    border: "border-yellow-100",
    button: "bg-yellow-500 hover:bg-yellow-600",
    jobs: ["Power point installation", "Light fitting", "Switchboard upgrade", "Safety inspection", "Fan installation", "EV charger install"],
  },
  {
    slug: "cleaning",
    emoji: "🧹",
    name: "Cleaning",
    tagline: "Professional cleaning for homes and offices",
    description: "Experienced cleaners for regular, deep clean, end of lease and commercial cleaning services across Australia.",
    avgCost: "$120 – $400",
    hourly: "$40 – $80/hr",
    color: "text-green-600",
    bg: "bg-green-50",
    border: "border-green-100",
    button: "bg-green-600 hover:bg-green-700",
    jobs: ["Regular cleaning", "Deep cleaning", "End of lease", "Carpet cleaning", "Window cleaning", "Office cleaning"],
  },
  {
    slug: "painting",
    emoji: "🎨",
    name: "Painting",
    tagline: "Interior and exterior painting done right",
    description: "Professional painters for interior, exterior and commercial painting. Quality finishes with minimal disruption.",
    avgCost: "$300 – $2,000",
    hourly: "$50 – $100/hr",
    color: "text-purple-600",
    bg: "bg-purple-50",
    border: "border-purple-100",
    button: "bg-purple-600 hover:bg-purple-700",
    jobs: ["Interior painting", "Exterior painting", "Deck staining", "Fence painting", "Roof painting", "Pressure washing"],
  },

  {
    slug: "carpentry",
    emoji: "🪚",
    name: "Carpentry",
    tagline: "Custom woodwork and structural carpentry",
    description: "Experienced carpenters for decks, pergolas, wardrobes, doors and all timber work.",
    avgCost: "$200 – $1,500",
    hourly: "$70 – $150/hr",
    color: "text-orange-600",
    bg: "bg-orange-50",
    border: "border-orange-100",
    button: "bg-orange-500 hover:bg-orange-600",
    jobs: ["Deck building", "Pergola construction", "Wardrobe installation", "Door fitting", "Fence building", "Flooring"],
  },
  {
    slug: "removalists",
    emoji: "🚚",
    name: "Removalists",
    tagline: "Safe and reliable moving services",
    description: "Professional removalists for local, interstate and single-item moves. Packing services and storage available.",
    avgCost: "$400 – $1,200",
    hourly: "$100 – $200/hr",
    color: "text-indigo-600",
    bg: "bg-indigo-50",
    border: "border-indigo-100",
    button: "bg-indigo-600 hover:bg-indigo-700",
    jobs: ["Local moves", "Interstate moves", "Single item delivery", "Packing service", "Storage solutions", "Piano removal"],
  },
];

const howItWorks = [
  { step: "01", title: "Post Your Job", desc: "Describe what you need in under 2 minutes. It's free for homeowners." },
  { step: "02", title: "Get AI Estimate", desc: "Instantly see a price range before any tradie contacts you." },
  { step: "03", title: "Receive Quotes", desc: "Verified local tradies send you fixed-price quotes within hours." },
  { step: "04", title: "Hire with Confidence", desc: "Compare quotes, chat with tradies and hire the best fit." },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      
	<section className="relative py-20 lg:py-[22rem] overflow-hidden bg-[url('/imports/services.png')] bg-cover bg-[center]">
        {/* Transparent layout to let the original background shine perfectly */}
            <div className="absolute inset-0 bg-blue-950/40" />

        <div className="relative max-w-4xl mx-auto px-6 text-left">
          <span className="inline-block bg-orange-500 text-white text-xs font-bold px-4 py-1.5 rounded-full mb-5 uppercase tracking-widest">
            7 Trade Categories
          </span>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-5 leading-tight">
            Find the Right <span className="text-orange-400">Tradie</span> for Any Job
          </h1>
          <p className="text-blue-100 text-lg max-w-2xl mb-8">
            GeTradie connects you with verified local tradies across 7 major trade categories. Get AI-powered estimates and fixed-price quotes — all in one place.
          </p>
          <div className="flex flex-wrap gap-3 justify-start">
            {trades.map((t) => (
              <a key={t.slug} href={`#${t.slug}`}>
                <span className="bg-white/20 hover:bg-white/30 text-white text-sm font-semibold px-4 py-2 rounded-full transition-colors cursor-pointer">
                  {t.emoji} {t.name}
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-[#1a2744] py-10 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          {[
            { value: "2,500+", label: "Verified Tradies" },
            { value: "7",      label: "Trade Categories" },
            { value: "80%",    label: "AI Estimate Accuracy" },
            { value: "Free",   label: "For Homeowners" },
          ].map(s => (
            <div key={s.label}>
              <p className="text-3xl font-bold text-orange-400">{s.value}</p>
              <p className="text-blue-200 text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trade cards — 3 column grid */}
      <section className="py-16 lg:py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block bg-blue-100 text-blue-700 text-xs font-bold px-4 py-1.5 rounded-full mb-3 uppercase tracking-widest">
              All Services
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Browse by <span className="text-orange-500">Trade Category</span>
            </h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">
              Every tradie on GeTradie is verified, insured and rated by real Australian homeowners.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trades.map((trade, i) => (
              <div
                key={trade.slug}
                id={trade.slug}
                className={`${trade.bg} rounded-2xl border-2 ${trade.border} p-6 flex flex-col hover:shadow-lg transition-shadow`}
              >
                {/* Header */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-4xl">{trade.emoji}</div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{trade.name}</h2>
                    <p className={`text-xs font-bold ${trade.color} uppercase tracking-widest`}>#{i + 1} most popular</p>
                  </div>
                </div>

                {/* Tagline */}
                <p className={`font-semibold ${trade.color} text-sm mb-2`}>{trade.tagline}</p>

                {/* Description */}
                <p className="text-gray-600 text-sm leading-relaxed mb-4">{trade.description}</p>

                {/* Pricing */}
                <div className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm mb-4">
                  <p className="text-xs text-gray-400 font-medium mb-1">Typical Cost</p>
                  <p className={`text-lg font-bold ${trade.color}`}>{trade.avgCost}</p>
                  <p className="text-xs text-gray-400">{trade.hourly}</p>
                </div>

                {/* Common jobs */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {trade.jobs.slice(0, 4).map(job => (
                    <span key={job} className="bg-white text-gray-700 text-xs font-medium px-2.5 py-1 rounded-full border border-gray-200">
                      {job}
                    </span>
                  ))}
                </div>

                {/* CTAs */}
                <div className="mt-auto space-y-2">
                  <Link href="/login" className="block">
                    <button className={`w-full ${trade.button} text-white py-2.5 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2`}>
                      Find a {trade.name} Pro <ArrowRight size={14}/>
                    </button>
                  </Link>
                  <Link href={`/cost-guides/${trade.slug}`} className="block">
                    <button className="w-full border border-gray-200 hover:border-gray-400 text-gray-600 py-2 rounded-xl font-semibold text-xs transition-colors flex items-center justify-center gap-1">
                      View Cost Guide <ChevronRight size={12}/>
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="relative py-16 px-4 overflow-hidden" style={{
        backgroundImage: "url('/imports/hero_baground_5.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}>
        <div className="absolute inset-0 bg-black/55"/>
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-bold text-white mb-3">
              How It <span className="text-orange-500">Works</span>
            </h2>
            <p className="text-blue-100">Get a tradie in 4 simple steps</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {howItWorks.map((step, i) => (
              <div key={step.step} className="bg-white/10 backdrop-blur-sm rounded-2xl p-10 text-center hover:bg-white/20 transition-colors">
                <span className="text-5xl block mb-2">{["📋","🤖","💬","✅"][i]}</span>
                <p className="text-blue-100 text-lg font-bold mb-1">{step.title}</p>
                <p className="text-white text-lg leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 px-4 bg-[#060d4a]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to find a <span className="text-orange-400">trusted tradie</span>?
          </h2>
          <p className="text-blue-200 mb-8">Post your job free and get quotes from verified local tradies within hours.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/login">
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3.5 rounded-xl font-bold text-sm transition-colors shadow-lg flex items-center gap-2">
                Post a Job Free <ArrowRight size={16}/>
              </button>
            </Link>
            <Link href="/cost-guides">
              <button className="border border-white/30 hover:border-white text-white px-8 py-3.5 rounded-xl font-bold text-sm transition-colors flex items-center gap-2">
                View Cost Guides <ChevronRight size={16}/>
              </button>
            </Link>
          </div>
        </div>
      </section>



      <Footer />
    </div>
  );
}
