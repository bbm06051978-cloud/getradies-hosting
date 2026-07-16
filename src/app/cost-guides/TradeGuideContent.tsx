import Link from "next/link";
import { Navbar } from "@/app/components/Navbar";
import { Footer } from "@/app/components/Footer";
import { TradeGuide, tradeGuides } from "./data";
import {
  CheckCircle, Zap, ChevronRight, DollarSign,
  MapPin, TrendingUp, ShieldCheck,
} from "lucide-react";

export default function TradeGuideContent({ guide }: { guide: TradeGuide }) {
  const otherGuides = tradeGuides.filter(t => t.slug !== guide.slug);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

     
      {/* Hero */}
      <section className="relative py-20 px-4 overflow-hidden"
        style={{
          backgroundImage: "url(/imports/trade_background.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}>
        <div className="absolute inset-0 bg-blue-950/60"/>

{/* Breadcrumb + Back button */}
      <div className="py-3 px-4 mt-20 relative z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-white/70">
            <Link href="/" className="hover:text-white">Home</Link>
            <ChevronRight size={14} />
            <Link href="/cost-guides" className="hover:text-white">Cost Guides</Link>
            <ChevronRight size={14} />
            <span className="text-white font-medium">{guide.name}</span>
          </div>
          <a href="/cost-guides"
            className="flex items-center gap-1.5 bg-white/50 hover:bg-white/70 text-yellow px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors">
            ← Back to Cost Guides
          </a>
        </div>
      </div>

        <div className="relative max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <span className="text-5xl mb-4 block">{guide.emoji}</span>
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                {guide.tagline}
              </h1>
              <p className="text-blue-100 text-lg leading-relaxed mb-6">{guide.description}</p>
              <div className="flex items-center gap-4 flex-wrap">
                <div className="bg-white rounded-2xl px-5 py-3 shadow-sm border border-gray-100">
                  <p className="text-xs text-gray-400 font-medium mb-0.5">Typical Job Cost</p>
                  <p className={`text-2xl font-bold ${guide.color}`}>
                    ${guide.avgMin.toLocaleString()} – ${guide.avgMax.toLocaleString()}
                  </p>
                </div>
                <div className="bg-white rounded-2xl px-5 py-3 shadow-sm border border-gray-100">
                  <p className="text-xs text-gray-400 font-medium mb-0.5">Hourly Rate</p>
                  <p className="text-2xl font-bold text-gray-800">
                    ${guide.hourlyMin}–${guide.hourlyMax}/hr
                  </p>
                </div>
              </div>
            </div>

            {/* AI Estimate box */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <Zap size={16} className="text-white fill-white" />
                </div>
                <span className="font-bold text-gray-900">Get Your Instant AI Estimate</span>
              </div>
              <p className="text-sm text-gray-500 mb-4">
                Get a personalised price estimate for your location — free and instant.
              </p>
              <Link href="/">
                <button className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-bold text-sm transition-colors">
                  Get Free AI Estimate →
                </button>
              </Link>
              <div className="flex items-center gap-2 mt-3 justify-center">
                <ShieldCheck size={14} className="text-green-500" />
                <span className="text-xs text-gray-400">80% accuracy · Based on real Australian jobs</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Jobs table */}
      <section className="py-14 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <DollarSign size={22} className="text-blue-600" />
            Common {guide.name} Jobs & Prices
          </h2>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="grid grid-cols-4 bg-gray-50 px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-widest border-b border-gray-100">
              <div className="col-span-2">Job Type</div>
              <div>Price Range</div>
              <div>Notes</div>
            </div>
            {guide.jobs.map((job, i) => (
              <div key={job.name} className={`grid grid-cols-4 px-6 py-4 ${i % 2 === 0 ? "bg-white" : "bg-gray-50/50"} border-b border-gray-100 last:border-0`}>
                <div className="col-span-2">
                  <p className="font-semibold text-gray-900 text-sm">{job.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{job.unit}</p>
                </div>
                <div>
                  <p className={`font-bold text-sm ${guide.color}`}>
                    ${job.min.toLocaleString()} – ${job.max.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">{job.notes}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-3 flex items-center gap-1">
            <TrendingUp size={12} />
            Prices are estimates based on Australian market rates.
          </p>
        </div>
      </section>

      {/* Factors + Tips */}
      <section className="py-14 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <TrendingUp size={22} className="text-blue-600" />
              Factors That Affect {guide.name} Costs
            </h2>
            <div className="space-y-3">
              {guide.factors.map((factor, i) => (
                <div key={i} className="flex items-start gap-3 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className={`w-6 h-6 rounded-full ${guide.bgColor} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                    <span className={`text-xs font-bold ${guide.color}`}>{i + 1}</span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{factor}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <CheckCircle size={22} className="text-green-600" />
              How to Save Money
            </h2>
            <div className="space-y-3">
              {guide.savingTips.map((tip, i) => (
                <div key={i} className="flex items-start gap-3 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <CheckCircle size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-700 leading-relaxed">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Location note */}
      <section className="py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 flex items-start gap-4">
            <MapPin size={24} className="text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-gray-900 mb-2">Location Affects Pricing</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {guide.name} costs vary significantly across Australia. <strong>Sydney and Melbourne</strong> are typically 15–20% higher than other cities. Use GeTradie to get quotes from local tradies in your area.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-14 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {guide.faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-2 text-sm">{faq.q}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 px-4 bg-blue-900">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Hire a {guide.name} Professional?
          </h2>
          <p className="text-blue-200 mb-8">
            Get free quotes from verified local {guide.name.toLowerCase()} professionals on GeTradie.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login">
              <button className="bg-white hover:bg-gray-50 text-blue-900 px-8 py-4 rounded-2xl font-bold text-sm transition-colors shadow-lg">
                Find a {guide.name} Professional →
              </button>
            </Link>
            <Link href="/cost-guides">
              <button className="border-2 border-blue-400 hover:border-white text-white px-8 py-4 rounded-2xl font-bold text-sm transition-colors">
                View Other Cost Guides
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Other guides */}
      <section className="py-14 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Other Cost Guides</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {otherGuides.map(t => (
              <Link key={t.slug} href={`/cost-guides/${t.slug}`}>
                <div className={`${t.bgColor} rounded-xl p-4 text-center hover:scale-105 transition-transform cursor-pointer`}>
                  <span className="text-3xl block mb-2">{t.emoji}</span>
                  <p className="text-xs font-bold text-gray-700">{t.name}</p>
                  <p className={`text-xs font-semibold ${t.color} mt-1`}>${t.avgMin}–${t.avgMax}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
