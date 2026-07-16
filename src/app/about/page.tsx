import Link from "next/link";
import { Metadata } from "next";
import { Navbar } from "@/app/components/Navbar";
import { Footer } from "@/app/components/Footer";
import {
  ArrowRight, ShieldCheck, Zap, Star,
  Heart, Users, Target, TrendingUp,
  CheckCircle, MapPin,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About Us — GeTradie | Australia's Smarter Tradie Marketplace",
  description: "Learn about GeTradie — the Australian platform connecting homeowners with verified local tradies using AI-powered price estimates. Our mission, values and story.",
};

const values = [
  {
    icon: ShieldCheck,
    title: "Trust & Transparency",
    description: "Every tradie is verified before joining. Every quote is fixed-price. No hidden fees, no surprise bills — ever.",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    icon: Zap,
    title: "Smart Technology",
    description: "Our AI-powered estimates give homeowners accurate price ranges before engaging any tradie — putting you in control.",
    color: "text-orange-500",
    bg: "bg-orange-50",
  },
  {
    icon: Heart,
    title: "Community First",
    description: "We support local Australian tradies by connecting them with real homeowners in their area — no excessive lead fees.",
    color: "text-red-500",
    bg: "bg-red-50",
  },
  {
    icon: Star,
    title: "Quality Always",
    description: "Our review system holds tradies accountable and rewards those who consistently deliver outstanding work.",
    color: "text-yellow-500",
    bg: "bg-yellow-50",
  },
  {
    icon: Target,
    title: "Fair for Everyone",
    description: "Homeowners get competitive quotes. Tradies get quality leads. Our model is built to be fair for both sides.",
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  {
    icon: TrendingUp,
    title: "Always Improving",
    description: "We continuously improve our platform based on feedback from real homeowners and tradies across Australia.",
    color: "text-green-600",
    bg: "bg-green-50",
  },
];

const stats = [
  { value: "10,000+", label: "Jobs Completed" },
  { value: "2,500+", label: "Verified Tradies" },
  { value: "7", label: "Trade Categories" },
  { value: "4.8★", label: "Average Rating" },
];

const trades = [
  { emoji: "🔧", label: "Plumbing" },
  { emoji: "⚡", label: "Electrical" },
  { emoji: "🧹", label: "Cleaning" },
  { emoji: "🎨", label: "Painting" },
  { emoji: "🔨", label: "Handyman" },
  { emoji: "🪚", label: "Carpentry" },
  { emoji: "🚚", label: "Removalists" },
];

const teamValues = [
  "We never sell homeowner data to advertisers",
  "Tradies are verified before accessing any leads",
  "All prices are fixed — no hidden charges",
  "Dispute resolution is always available",
  "We respond to support requests within 24 hours",
  "We continuously improve based on user feedback",
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="w-full max-w-full py-20 lg:py-[18rem] overflow-hidden bg-[url('/imports/aboutus.png')] bg-contain lg:bg-cover bg-top bg-no-repeat">
        {/* Transparent layout to let the original background shine perfectly */}
            <div className="absolute inset-0 bg-blue-950/40" />
        
        <div className="relative max-w-4xl mx-auto px-4 text-left">
          <span className="inline-block bg-orange-500 text-white text-xs font-bold px-4 py-1.5 rounded-full mb-5 uppercase tracking-widest">
            Our Story
          </span>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-5 leading-tight">
            Australia's Smarter Way to <br />
	    <span className="text-orange-400">Hire a Tradie</span>
          </h1>
          <p className="text-blue-100 text-lg max-w-2xl mb-8">
            GeTradie was built out of frustration. Finding a reliable tradie in Australia meant endless phone calls, vague quotes and no way to know if you were being overcharged. We built a better way.
          </p>
          <Link href="/signup">
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3.5 rounded-xl font-bold text-sm transition-colors shadow-lg inline-flex items-center gap-2">
              Get Started Free <ArrowRight size={16} />
            </button>
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-[#1a2744] py-10 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          {stats.map(s => (
            <div key={s.label}>
              <p className="text-3xl font-bold text-orange-400">{s.value}</p>
              <p className="text-blue-200 text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 lg:py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block bg-blue-100 text-blue-700 text-xs font-bold px-4 py-1.5 rounded-full mb-4 uppercase tracking-widest">
              Why We Built GeTradie
            </span>
            <h2 className="text-3xl font-bold text-gray-900 mb-5">
              Tired of Dodgy Quotes and <span className="text-orange-500">No-Show Tradies?</span>
            </h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                Every Australian homeowner has a story — the plumber who quoted $200 and charged $800, the painter who never showed up, or the electrician who took three weeks to respond.
              </p>
              <p>
                GeTradie was founded to solve exactly this. We built a platform where homeowners know the price <strong>before</strong> they even post a job, where tradies are verified before they can quote, and where reviews hold everyone accountable.
              </p>
              <p>
                Our AI-powered estimate tool was the first of its kind in Australia — giving homeowners an accurate price range in seconds, based on real job data from across the country.
              </p>
              <p>
                We are based in Australia, built for Australians, and we understand how the local tradie market works. Every decision we make is guided by one question — <em>is this fair for both the homeowner and the tradie?</em>
              </p>
            </div>
          </div>

          {/* Right — image/visual */}
          <div
            className="rounded-2xl overflow-hidden h-80 lg:h-96 relative shadow-xl"
            style={{
              backgroundImage: "url(/imports/hero_baground.png)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 bg-blue-900/40" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
              <MapPin size={36} className="text-orange-400 mb-3" />
              <p className="text-2xl font-bold text-white mb-2">Built in Australia</p>
              <p className="text-blue-200 text-sm">For Australian homeowners and tradies</p>
              <div className="flex flex-wrap gap-2 justify-center mt-6">
                {["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide"].map(city => (
                  <span key={city} className="bg-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                    {city}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission */}
      <section className="py-16 px-4 bg-slate-50">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block bg-orange-100 text-orange-700 text-xs font-bold px-4 py-1.5 rounded-full mb-4 uppercase tracking-widest">
            Our Mission
          </span>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Making Home Maintenance <span className="text-orange-500">Stress-Free</span>
          </h2>
          <div className="bg-[#1a2744] rounded-2xl p-8 lg:p-12 text-left">
            <p className="text-2xl font-bold text-white leading-relaxed mb-4">
              &ldquo;To make hiring a tradie as simple, transparent and trustworthy as possible for every Australian homeowner — while helping local tradies build sustainable businesses.&rdquo;
            </p>
            <p className="text-blue-300 text-sm">— The GeTradie Team</p>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 lg:py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block bg-blue-100 text-blue-700 text-xs font-bold px-4 py-1.5 rounded-full mb-4 uppercase tracking-widest">
              Our Values
            </span>
            <h2 className="text-3xl font-bold text-gray-900">
              What We <span className="text-orange-500">Stand For</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {values.map(v => {
              const Icon = v.icon;
              return (
                <div key={v.title} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:border-orange-200 transition-all">
                  <div className={`w-12 h-12 rounded-xl ${v.bg} flex items-center justify-center mb-4`}>
                    <Icon size={22} className={v.color} />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{v.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{v.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* What we cover */}
      <section
        className="py-16 px-4 relative"
        style={{
          backgroundImage: "url(/imports/HowItWork.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative max-w-4xl mx-auto text-center">
          <span className="inline-block bg-orange-500 text-white text-xs font-bold px-4 py-1.5 rounded-full mb-4 uppercase tracking-widest">
            Trade Categories
          </span>
          <h2 className="text-3xl font-bold text-white mb-4">
            7 Trades. One Platform.
          </h2>
          <p className="text-blue-100 mb-10 max-w-xl mx-auto">
            GeTradie covers the most common home maintenance and improvement trades across Australia.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
            {trades.map(t => (
              <div key={t.label} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center hover:bg-white/20 transition-colors">
                <span className="text-3xl block mb-2">{t.emoji}</span>
                <p className="text-white text-xs font-semibold">{t.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Promises */}
      <section className="py-16 px-4 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <span className="inline-block bg-green-100 text-green-700 text-xs font-bold px-4 py-1.5 rounded-full mb-4 uppercase tracking-widest">
              Our Promises
            </span>
            <h2 className="text-3xl font-bold text-gray-900">
              What You Can Always <span className="text-orange-500">Expect from Us</span>
            </h2>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {teamValues.map((v, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle size={18} className="text-green-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-700 font-medium">{v}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* For tradies */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <span className="inline-block bg-orange-100 text-orange-700 text-xs font-bold px-4 py-1.5 rounded-full mb-4 uppercase tracking-widest">
              For Tradies
            </span>
            <h2 className="text-3xl font-bold text-gray-900 mb-5">
              We Support <span className="text-orange-500">Local Tradies</span>
            </h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                GeTradie was designed to be fair for tradies too. Unlike other platforms that charge per lead and make it impossible to grow profitably, we charge a flat monthly subscription.
              </p>
              <p>
                That means you can quote on as many jobs as you like, build your reputation through reviews, and grow your business without worrying about escalating costs.
              </p>
            </div>
            <div className="mt-6 space-y-3">
              {["No per-lead fees", "Unlimited quotes per month", "Build your reputation with reviews", "Get matched to jobs in your area"].map(p => (
                <div key={p} className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-orange-500" />
                  <p className="text-sm font-medium text-gray-700">{p}</p>
                </div>
              ))}
            </div>
            <Link href="/signup-tradie">
              <button className="mt-8 bg-orange-500 hover:bg-orange-600 text-white px-8 py-3.5 rounded-xl font-bold text-sm transition-colors shadow-lg inline-flex items-center gap-2">
                Join as a Tradie <ArrowRight size={16} />
              </button>
            </Link>
          </div>

          <div className="bg-[#1a2744] rounded-2xl p-8 text-white">
            <Users size={36} className="text-orange-400 mb-4" />
            <h3 className="text-2xl font-bold mb-4">Join 2,500+ Tradies</h3>
            <div className="space-y-4">
              {[
                { label: "Average new jobs per month", value: "8–12" },
                { label: "Average review rating", value: "4.8 / 5" },
                { label: "Quote acceptance rate", value: "32%" },
                { label: "Time to first job lead", value: "24 hrs" },
              ].map(s => (
                <div key={s.label} className="flex items-center justify-between border-b border-blue-800 pb-3">
                  <p className="text-blue-200 text-sm">{s.label}</p>
                  <p className="text-orange-400 font-bold">{s.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-[#1a2744] py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Experience <span className="text-orange-400">GeTradie?</span>
          </h2>
          <p className="text-blue-200 mb-8">
            Join thousands of Australians who trust GeTradie to connect them with verified local tradies.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-xl font-bold text-sm transition-colors shadow-lg flex items-center gap-2">
                Post a Job Free <ArrowRight size={16} />
              </button>
            </Link>
            <Link href="/how-it-works">
              <button className="border-2 border-blue-400 hover:border-white text-white px-8 py-4 rounded-xl font-bold text-sm transition-colors">
                How It Works
              </button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
