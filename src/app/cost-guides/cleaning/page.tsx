import { getTradeGuide } from "../data";
import TradeGuideContent from "../TradeGuideContent";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Cleaner Cost Guide Australia 2026 | GeTradie",
  description: "How much does a cleaner cost in Australia? Get accurate cleaner pricing, hourly rates and job estimates. Free AI price estimate on GeTradie.",
  keywords: "cleaner cost australia, cleaning prices sydney, how much does a cleaner cost",
  openGraph: {
    title: "Cleaner Cost Guide Australia 2026 | GeTradie",
    description: "How much does a cleaner cost in Australia? Get accurate pricing and free AI estimates.",
    url: "https://getradie.com.au/cost-guides/cleaning",
    siteName: "GeTradie",
    type: "article",
  },
};
export default function Page() {
  const guide = getTradeGuide("cleaning");
  if (!guide) return <div>Not found</div>;
  return <TradeGuideContent guide={guide} />;
}