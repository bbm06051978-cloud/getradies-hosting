import { getTradeGuide } from "../data";
import TradeGuideContent from "../TradeGuideContent";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Removalist Cost Guide Australia 2026 | GeTradie",
  description: "How much does a removalist cost in Australia? Get accurate removalist pricing, hourly rates and job estimates. Free AI price estimate on GeTradie.",
  keywords: "removalist cost australia, moving prices sydney, how much do removalists cost",
  openGraph: {
    title: "Removalist Cost Guide Australia 2026 | GeTradie",
    description: "How much does a removalist cost in Australia? Get accurate pricing and free AI estimates.",
    url: "https://getradie.com.au/cost-guides/removalists",
    siteName: "GeTradie",
    type: "article",
  },
};
export default function Page() {
  const guide = getTradeGuide("removalists");
  if (!guide) return <div>Not found</div>;
  return <TradeGuideContent guide={guide} />;
}