import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Terms of Service | GeTradie",
  description: "GeTradie terms of service. Read our terms and conditions for homeowners and tradies.",
  keywords: "getradie terms of service",
  openGraph: { title: "Terms of Service | GeTradie", description: "GeTradie terms of service. Read our terms and conditions for homeowners and tradies.", url: "https://getradie.com.au/terms", siteName: "GeTradie", type: "website" },
};
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }