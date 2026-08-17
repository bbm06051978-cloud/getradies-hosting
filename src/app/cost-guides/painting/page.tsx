import { getTradeGuide } from "../data";
import TradeGuideContent from "../TradeGuideContent";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Painter Cost Guide Australia 2026 | GeTradie",
  description: "How much does a painter cost in Australia? Get accurate painter pricing, hourly rates and job estimates. Free AI price estimate on GeTradie.",
  keywords: "painter cost australia, painting prices sydney, how much does a painter cost",
  openGraph: {
    title: "Painter Cost Guide Australia 2026 | GeTradie",
    description: "How much does a painter cost in Australia? Get accurate pricing and free AI estimates.",
    url: "https://getradie.com.au/cost-guides/painting",
    siteName: "GeTradie",
    type: "article",
  },
};
export default function Page() {
  const guide = getTradeGuide("painting");
  if (!guide) return <div>Not found</div>;
  return <TradeGuideContent guide={guide} />;
}