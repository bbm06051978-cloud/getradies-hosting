import { Metadata } from "next";
export const metadata: Metadata = {
  title: "About GeTradie | Australia's Only AI-Powered Tradie Marketplace",
  description: "GeTradie is Australia's only AI-powered tradie marketplace. Connecting homeowners with verified local tradies. Get instant AI price estimates.",
  keywords: "about getradie, australian tradie marketplace, verified tradies australia",
  openGraph: { title: "About GeTradie | Australia's Only AI-Powered Tradie Marketplace", description: "GeTradie is Australia's only AI-powered tradie marketplace. Connecting homeowners with verified local tradies. Get instant AI price estimates.", url: "https://getradie.com.au/about", siteName: "GeTradie", type: "website" },
};
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }