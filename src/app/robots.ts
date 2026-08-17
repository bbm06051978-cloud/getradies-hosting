import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/dashboard",
          "/dashboard-tradie",
          "/admin",
          "/my-jobs",
          "/my-quotes",
          "/bookings",
          "/chats",
          "/profile",
          "/tradie-bookings",
          "/tradie-chats",
          "/tradie-jobs",
          "/tradie-profile",
          "/tradie-quotes",
          "/tradie-schedule",
          "/tradie-settings",
          "/tradie-subscription",
          "/notifications",
          "/payment",
          "/post-job",
          "/quotes",
        ],
      },
    ],
    sitemap: "https://getradie.com.au/sitemap.xml",
  };
}