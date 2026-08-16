import withPWA from "@ducanh2912/next-pwa";

const nextConfig = withPWA({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  disable: process.env.NODE_ENV === "development",
})({
  turbopack: {},
  allowedDevOrigins: ["172.20.10.2", "172.21.208.1", "*.ngrok-free.app", "*.ngrok-free.dev", "*.ngrok.io"],
  async headers() {
    return [
      {
        source: "/imports/(.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
});

export default nextConfig;