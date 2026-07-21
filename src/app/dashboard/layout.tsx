"use client";
import { MobileWarning } from "@/app/components/MobileWarning";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <MobileWarning />
      {children}
    </>
  );
}