import Link from "next/link";
import { Metadata } from "next";
import { Navbar } from "@/app/components/Navbar";
import { Footer } from "@/app/components/Footer";
import { ArrowRight, CheckCircle, ChevronRight, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "Services — GeTradie | Find Local Plumbers, Electricians & More",
  description: "Browse all trade services on GeTradie. Find verified plumbers, electricians, cleaners, painters, handymen, carpenters and removalists across Australia.",
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
    tagline: "Licensed electricians for safe, reliable work",
    description: "All electrical work by licensed professionals. Power points, lighting, switchboard upgrades, EV chargers and more.",
    avgCost: "$150 – $800",
    hourly: "$80 – $200/hr",
    color: "text-yellow-600",
    bg: "bg-yellow-50",
    border: "border-yellow-100",
    button: "bg-yellow-500 hover:bg-yellow-600",
    jobs: ["Power point installation", "Light fittings", "Ceiling fans", "Switchboard upgrades", "Safety switches", "EV charger installation"],
  },
  {
    slug: "cleaning",
    emoji: "🧹",
    name: "Cleaning",
    tagline: "Professional home and office cleaning services",
    description: "Experienced cleaners for regular, deep, end-of-lease and commercial cleaning. Bond back guarantee available.",
    avgCost: "$150 – $400",
    hourly: "$35 – $60/hr",
    color: "text-cyan-600",
    bg: "bg-cyan-50",
    border: "border-cyan-100",
    button: "bg-cyan-600 hover:bg-cyan-700",
    jobs: ["Regular house clean", "End of lease clean", "Deep clean", "Carpet cleaning", "Window cleaning", "Office cleaning"],
  },
  {
    slug: "painting",
    emoji: "🎨",
    name: "Painting",
    tagline: "Interior and exterior painting by professionals",
    description: "Professional painters for interior rooms, full home repaints, exterior painting, fences, decks and more.",
    avgCost: "$300 – $8,000",
    hourly: "$35 – $60/hr",
    color: "text-purple-600",
    bg: "bg-purple-50",
    border: "border-purple-100",
    button: "bg-purple-600 hover:bg-purple-700",
    jobs: ["Interior room painting", "Full house repaint", "Exterior painting", "Feature walls", "Fence painting", "Deck staining"],
  },
  {
    slug: "handyman",
    emoji: "🔨",
    name: "Handyman",
    tagline: "General repairs and installations around the home",
    description: "Reliable handymen for small repairs, furniture assembly, mounting, door repairs and general maintenance jobs.",
    avgCost: "$100 – $400",
    hourly: "$60 – $120/hr",
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-100",
    button: "bg-amber-500 hover:bg-amber-600",
    jobs: ["Furniture assembly", "TV & picture mounting", "Door repairs", "Gutter cleaning", "Shelf installation", "Lock replacement"],
  },
  {
    slug: "carpentry",
    emoji: "🪚",
    name: "Carpentry",
    tagline: "Custom joinery, decking and timber work",
    description: "Skilled carpenters for decks, custom shelving, wardrobes, timber flooring, fences, pergolas and cabinet making.",
    avgCost: "$200 – $1,000",
    hourly: "$70 – $150/hr",
    color: "text-orange-600",
    bg: "bg-orange-50",
    border: "border-orange-100",
    button: "bg-orange-500 hover:bg-orange-600",
    jobs: ["Deck construction", "Custom shelving", "Wardrobe installation", "Timber flooring", "Fence installation", "Pergola construction"],
  },
  {
    slug: "removalists",
    emoji: "🚚",
    name: "Removalists",
    tagline: "Safe and reliable moving services across Australia",
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
      <section
        className="relative py-22 lg:py-28 overflow-hidden"
        style={{
          backgroundImage: "url(/imports/hero_baground2.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-blue-900/10" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block bg-orange-500 text-white text-xs font-bold px-4 py-1.5 rounded-full mb-5 uppercase tracking-widest">
            7 Trade Categories
          </span>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-5 leading-tight">
            Find the Right <span className="text-orange-400">Tradie</span> for Any Job
          </h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto mb-8">
            GeTradie connects you with verified local tradies across 7 major trade categories. Get AI-powered estimates and fixed-price quotes — all in one place.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            {trades.map(t => (
              <Link key={t.slug} href={`#${t.slug}`}>
                <span className="bg-white/20 hover:bg-white/30 text-white text-sm font-semibold px-4 py-2 rounded-full transition-colors cursor-pointer">
                  {t.emoji} {t.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-[#1a2744] py-10 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          {[
            { value: "2,500+", label: "Verified Tradies" },
            { value: "7", label: "Trade Categories" },
            { value: "80%", label: "AI Estimate Accuracy" },
            { value: "Free", label: "For Homeowners" },
          ].map(s => (
            <div key={s.label}>
              <p className="text-3xl font-bold text-orange-400">{s.value}</p>
              <p className="text-blue-200 text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trade cards */}
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

          <div className="space-y-6">
            {trades.map((trade, i) => (
              <div
                key={trade.slug}
                id={trade.slug}
                className={`${trade.bg} rounded-2xl border-2 ${trade.border} p-6 lg:p-8`}
              >
                <div className="flex flex-col lg:flex-row gap-6 items-start">

                  {/* Left — trade info */}
                  <div className="flex items-start gap-5 flex-1">
                    <div className="text-5xl flex-shrink-0">{trade.emoji}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 flex-wrap mb-1">
                        <h2 className="text-2xl font-bold text-gray-900">{trade.name}</h2>
                        <span className={`text-xs font-bold ${trade.color} uppercase tracking-widest`}>
                          #{i + 1} most popular
                        </span>
                      </div>
                      <p className={`font-semibold ${trade.color} mb-2`}>{trade.tagline}</p>
                      <p className="text-gray-600 text-sm leading-relaxed mb-4 max-w-xl">
                        {trade.description}
                      </p>

                      {/* Common jobs */}
                      <div className="flex flex-wrap gap-2">
                        {trade.jobs.map(job => (
                          <span key={job} className="bg-white text-gray-700 text-xs font-medium px-3 py-1.5 rounded-full border border-gray-200">
                            {job}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right — pricing + CTAs */}
                  <div className="flex-shrink-0 lg:w-56 space-y-3">
                    <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                      <p className="text-xs text-gray-400 font-medium mb-1">Typical Cost</p>
                      <p className={`text-xl font-bold ${trade.color}`}>{trade.avgCost}</p>
                      <p className="text-xs text-gray-400 mt-1">{trade.hourly}</p>
                    </div>

                    <Link href="/login" className="block">
                      <button className={`w-full ${trade.button} text-white py-3 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2`}>
                        Find a {trade.name} Pro
                        <ArrowRight size={15} />
                      </button>
                    </Link>

                    <Link href={`/cost-guides/${trade.slug}`} className="block">
                      <button className="w-full border border-gray-200 hover:border-gray-400 text-gray-600 py-2.5 rounded-xl font-semibold text-xs transition-colors flex items-center justify-center gap-1">
                        View Cost Guide
                        <ChevronRight size={13} />
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works quick */}
      <section
        className="py-16 px-4 relative"
        style={{
          backgroundImage: "url(/imports/HowItWork.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <span className="inline-block bg-orange-500 text-white text-xs font-bold px-4 py-1.5 rounded-full mb-3 uppercase tracking-widest">
              Simple Process
            </span>
            <h2 className="text-3xl font-bold text-white">
              How to Hire Any Tradie on <span className="text-orange-400">GeTradie</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {howItWorks.map(s => (
              <div key={s.step} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20">
                <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-lg">{s.step}</span>
                </div>
                <h3 className="font-bold text-white mb-2">{s.title}</h3>
                <p className="text-blue-100 text-xs leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/signup">
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-xl font-bold text-sm transition-colors shadow-lg inline-flex items-center gap-2">
                Post a Job Free <ArrowRight size={16} />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* AI Estimate CTA */}
      <section className="py-16 px-4 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#1a2744] rounded-2xl p-8 lg:p-12 flex flex-col lg:flex-row items-center gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <Zap size={16} className="text-white fill-white" />
                </div>
                <span className="text-orange-400 font-bold text-sm uppercase tracking-widest">AI-Powered</span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">
                Not Sure How Much Your Job Should Cost?
              </h2>
              <p className="text-blue-200 leading-relaxed">
                Use our free AI estimate tool to get an accurate price range before posting your job. Based on real Australian job data with 80% accuracy.
              </p>
              <div className="flex flex-wrap gap-3 mt-5">
                {["✓ Instant results", "✓ Location-based", "✓ 80% accuracy", "✓ Completely free"].map(b => (
                  <span key={b} className="text-blue-300 text-xs font-medium">{b}</span>
                ))}
              </div>
            </div>
            <div className="flex-shrink-0">
              <Link href="/">
                <button className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-xl font-bold text-sm transition-colors shadow-lg whitespace-nowrap">
                  Get Free AI Estimate →
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why verified matters */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <span className="inline-block bg-green-100 text-green-700 text-xs font-bold px-4 py-1.5 rounded-full mb-3 uppercase tracking-widest">
              Verified Tradies
            </span>
            <h2 className="text-3xl font-bold text-gray-900">
              Every Tradie is <span className="text-orange-500">Verified Before Joining</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { title: "Licence Check", desc: "We verify trade licences with state licensing authorities before a tradie can access any job leads.", icon: "🪪" },
              { title: "Insurance Verified", desc: "All tradies must hold current public liability insurance. We check certificates before approval.", icon: "🛡️" },
              { title: "Identity Confirmed", desc: "Identity documents are verified to ensure every tradie on our platform is who they say they are.", icon: "✅" },
              { title: "Reviews from Real Jobs", desc: "Only homeowners who booked through GeTradie can leave reviews — no fake testimonials.", icon: "⭐" },
              { title: "Ongoing Monitoring", desc: "Tradie accounts are monitored for complaints. Low-rated tradies are removed from the platform.", icon: "👁️" },
              { title: "Dispute Protection", desc: "If something goes wrong, our team steps in to help resolve it within 24 hours.", icon: "⚖️" },
            ].map(f => (
              <div key={f.title} className="bg-slate-50 rounded-2xl p-6 border border-gray-100">
                <span className="text-3xl block mb-3">{f.icon}</span>
                <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-[#1a2744] py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Find Your <span className="text-orange-400">Perfect Tradie?</span>
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
            <Link href="/cost-guides">
              <button className="border-2 border-blue-400 hover:border-white text-white px-8 py-4 rounded-xl font-bold text-sm transition-colors">
                View Cost Guides
              </button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
