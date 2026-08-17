import { getTradeGuide } from "../data";
import TradeGuideContent from "../TradeGuideContent";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Carpenter Cost Guide Australia 2026 | GeTradie",
  description: "How much does a carpenter cost in Australia? Get accurate carpenter pricing, hourly rates and job estimates. Free AI price estimate on GeTradie.",
  keywords: "carpenter cost australia, carpentry prices sydney, how much does a carpenter cost",
  openGraph: {
    title: "Carpenter Cost Guide Australia 2026 | GeTradie",
    description: "How much does a carpenter cost in Australia? Get accurate pricing and free AI estimates.",
    url: "https://getradie.com.au/cost-guides/carpentry",
    siteName: "GeTradie",
    type: "article",
  },
};
export default function Page() {
  const guide = getTradeGuide("carpentry");
  if (!guide) return <div>Not found</div>;
  return <TradeGuideContent guide={guide} />;
}