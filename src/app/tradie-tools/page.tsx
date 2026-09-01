"use client";
import { Suspense } from "react";
import { QuickTools } from "@/app/components/tradie/TradiTools";

export default function Page() {
  return (
    <div style={{ minHeight: "100vh", background: "#F8FAFF", padding: "16px" }}>
      <Suspense fallback={<div>Loading...</div>}>
        <QuickTools />
      </Suspense>
    </div>
  );
}
