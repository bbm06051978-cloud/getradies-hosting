import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Privacy Policy | GeTradie",
  description: "GeTradie privacy policy. Learn how we collect, use and protect your personal information.",
  keywords: "getradie privacy policy",
  openGraph: { title: "Privacy Policy | GeTradie", description: "GeTradie privacy policy. Learn how we collect, use and protect your personal information.", url: "https://getradie.com.au/privacy", siteName: "GeTradie", type: "website" },
};
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }