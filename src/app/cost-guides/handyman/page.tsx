import { getTradeGuide } from "../data";
import TradeGuideContent from "../TradeGuideContent";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Handyman Cost Guide Australia 2026 | GeTradie",
  description: "How much does a handyman cost in Australia? Get accurate handyman pricing, hourly rates and job estimates. Free AI price estimate on GeTradie.",
  keywords: "handyman cost australia, handyman prices sydney, how much does a handyman cost",
  openGraph: {
    title: "Handyman Cost Guide Australia 2026 | GeTradie",
    description: "How much does a handyman cost in Australia? Get accurate pricing and free AI estimates.",
    url: "https://getradie.com.au/cost-guides/handyman",
    siteName: "GeTradie",
    type: "article",
  },
};
export default function Page() {
  const guide = getTradeGuide("handyman");
  if (!guide) return <div>Not found</div>;
  return <TradeGuideContent guide={guide} />;
}