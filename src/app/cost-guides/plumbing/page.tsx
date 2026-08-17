import { getTradeGuide } from "../data";
import TradeGuideContent from "../TradeGuideContent";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Plumber Cost Guide Australia 2026 | GeTradie",
  description: "How much does a plumber cost in Australia? Get accurate plumber pricing, hourly rates and job estimates. Free AI price estimate on GeTradie.",
  keywords: "plumber cost australia, plumbing prices sydney, how much does a plumber cost",
  openGraph: {
    title: "Plumber Cost Guide Australia 2026 | GeTradie",
    description: "How much does a plumber cost in Australia? Get accurate pricing and free AI estimates.",
    url: "https://getradie.com.au/cost-guides/plumbing",
    siteName: "GeTradie",
    type: "article",
  },
};
export default function Page() {
  const guide = getTradeGuide("plumbing");
  if (!guide) return <div>Not found</div>;
  return <TradeGuideContent guide={guide} />;
}