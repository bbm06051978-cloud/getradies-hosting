import withPWA from "@ducanh2912/next-pwa";

const nextConfig = withPWA({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  disable: process.env.NODE_ENV === "development",
})({
  turbopack: {},
  allowedDevOrigins: ["172.20.10.2", "172.21.208.1"],
});
export default nextConfig;