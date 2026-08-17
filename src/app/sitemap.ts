import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://getradie.com.au";
  const lastModified = new Date();

  return [
    // Public pages
    { url: baseUrl, lastModified, changeFrequency: "daily", priority: 1.0 },
    { url: `${baseUrl}/how-it-works`, lastModified, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/about`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/services`, lastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/contact`, lastModified, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/help`, lastModified, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/privacy`, lastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/cookies`, lastModified, changeFrequency: "yearly", priority: 0.3 },

    // Cost guides
    { url: `${baseUrl}/cost-guides`, lastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/cost-guides/plumbing`, lastModified, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/cost-guides/electrical`, lastModified, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/cost-guides/cleaning`, lastModified, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/cost-guides/painting`, lastModified, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/cost-guides/handyman`, lastModified, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/cost-guides/carpentry`, lastModified, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/cost-guides/removalists`, lastModified, changeFrequency: "weekly", priority: 0.8 },

    // Auth pages
    { url: `${baseUrl}/login`, lastModified, changeFrequency: "yearly", priority: 0.5 },
    { url: `${baseUrl}/login-tradie`, lastModified, changeFrequency: "yearly", priority: 0.5 },
    { url: `${baseUrl}/register`, lastModified, changeFrequency: "yearly", priority: 0.6 },
    { url: `${baseUrl}/signup-tradie`, lastModified, changeFrequency: "yearly", priority: 0.6 },
  ];
}