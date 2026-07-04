import { getTradeGuide } from "../data";
import TradeGuideContent from "../TradeGuideContent";

export default function Page() {
  const guide = getTradeGuide("carpentry");
  if (!guide) return <div>Not found</div>;
  return <TradeGuideContent guide={guide} />;
}
