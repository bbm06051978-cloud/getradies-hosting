import { getTradeGuide } from "../data";
import TradeGuideContent from "../TradeGuideContent";

export default function Page() {
  const guide = getTradeGuide("cleaning");
  if (!guide) return <div>Not found</div>;
  return <TradeGuideContent guide={guide} />;
}
