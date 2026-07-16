import { Navbar } from "@/app/components/Navbar";
import { Hero } from "@/app/components/Hero";
import { WhyGeTradie } from "@/app/components/WhyGeTradie";
import { HowItWorks } from "@/app/components/HowItWorks";
import { TradeCategories } from "@/app/components/TradeCategories";
import { CTABanner } from "@/app/components/CTABanner";
import { Footer } from "@/app/components/Footer";

export default function Home() {
  return (
    <div className="bg-white">
      <Navbar />
      <Hero />
      <WhyGeTradie />
      <HowItWorks />
<div className="py-8" />
      <TradeCategories />
<div className="py-8" />
      <CTABanner />
      <Footer />
    </div>
  );
}