import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GeTradie — Australia's Smarter Tradie Marketplace",
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
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}