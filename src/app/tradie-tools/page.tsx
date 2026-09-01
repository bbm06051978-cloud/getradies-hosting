"use client";
import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { QuickTools } from "@/app/components/tradie/TradiTools";

function AutoOpenTool() {
  const params = useSearchParams();
  const tool = params.get("tool");

  useEffect(() => {
    if (tool) {
      setTimeout(() => {
        const btns = document.querySelectorAll("button");
        btns.forEach(btn => {
          const label = btn.textContent?.toLowerCase() || "";
          if (
            (tool === "gst" && label.includes("gst")) ||
            (tool === "materials" && label.includes("material")) ||
            (tool === "timer" && label.includes("timer")) ||
            (tool === "travel" && label.includes("travel")) ||
            (tool === "invoice" && label.includes("invoice"))
          ) {
            btn.click();
          }
        });
      }, 500);
    }
  }, [tool]);

  return <QuickTools />;
}

export default function Page() {
  return (
    <div style={{ minHeight: "100vh", background: "#F8FAFF", padding: "16px" }}>
      <Suspense fallback={<div>Loading...</div>}>
        <AutoOpenTool />
      </Suspense>
    </div>
  );
}
