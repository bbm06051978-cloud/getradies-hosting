import { getTradeGuide } from "../data";
import TradeGuideContent from "../TradeGuideContent";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Electrician Cost Guide Australia 2026 | GeTradie",
  description: "How much does a electrician cost in Australia? Get accurate electrician pricing, hourly rates and job estimates. Free AI price estimate on GeTradie.",
  keywords: "electrician cost australia, electrical prices sydney, how much does an electrician cost",
  openGraph: {
    title: "Electrician Cost Guide Australia 2026 | GeTradie",
    description: "How much does a electrician cost in Australia? Get accurate pricing and free AI estimates.",
    url: "https://getradie.com.au/cost-guides/electrical",
    siteName: "GeTradie",
    type: "article",
  },
};
export default function Page() {
  const guide = getTradeGuide("electrical");
  if (!guide) return <div>Not found</div>;
  return <TradeGuideContent guide={guide} />;
}