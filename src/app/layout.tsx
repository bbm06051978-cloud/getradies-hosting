import ChatbotWidget from "@/app/components/ChatbotWidget";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GeTradie-Australia's Only AI-Powered Tradie Marketplace",
  description:
    "Australia's only AI-powered tradie marketplace. Get instant AI price estimates, compare verified tradies and hire with confidence. Free for homeowners.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>

<link rel="manifest" href="/manifest.json" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="GeTradie" />
        <link rel="apple-touch-icon" href="/imports/GeTradie_shortcut.png" />
        <link rel="preload" as="image" href="/imports/hero_baground.webp" fetchPriority="high"/>
        <link rel="preload" as="image" href="/imports/GeTradie_Logo.webp" fetchPriority="high"/>
        
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
{children}
<ChatbotWidget />
     </body>
    </html>
  );
}