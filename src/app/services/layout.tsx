import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Tradie Services Australia | Plumbing, Electrical, Cleaning & More | GeTradie",
  description: "Find verified tradies for any job in Australia. Plumbers, electricians, cleaners, painters, handymen and more. Get free AI price estimates instantly.",
  keywords: "tradie services australia, find plumber sydney, electrician melbourne, cleaner brisbane, handyman near me",
  openGraph: { title: "Tradie Services Australia | Plumbing, Electrical, Cleaning & More | GeTradie", description: "Find verified tradies for any job in Australia. Plumbers, electricians, cleaners, painters, handymen and more. Get free AI price estimates instantly.", url: "https://getradie.com.au/services", siteName: "GeTradie", type: "website" },
};
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }