import { Navbar } from "@/app/components/Navbar";
import { Hero } from "@/app/components/Hero";
import { WhyGeTradie } from "@/app/components/WhyGeTradie";
import { HowItWorks } from "@/app/components/HowItWorks";
import { TradeCategories } from "@/app/components/TradeCategories";
import { CTABanner } from "@/app/components/CTABanner";
import { Footer } from "@/app/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <WhyGeTradie />
      <HowItWorks />
      <TradeCategories />
      <CTABanner />
      <Footer />
    </div>
  );
}