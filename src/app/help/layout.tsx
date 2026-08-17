import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Help Centre | GeTradie Support",
  description: "Get help with GeTradie. Find answers to common questions about posting jobs, getting quotes, payments and more.",
  keywords: "getradie help, getradie support, tradie marketplace help",
  openGraph: { title: "Help Centre | GeTradie Support", description: "Get help with GeTradie. Find answers to common questions about posting jobs, getting quotes, payments and more.", url: "https://getradie.com.au/help", siteName: "GeTradie", type: "website" },
};
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }