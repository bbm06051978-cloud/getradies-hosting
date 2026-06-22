import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GeTradie – Australia's Smarter Tradie Marketplace",
  description:
    "Get quotes, compare prices, and hire verified local tradies with confidence. AI-powered price estimates — instant & free.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
