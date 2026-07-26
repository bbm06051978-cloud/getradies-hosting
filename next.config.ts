import withPWA from "@ducanh2912/next-pwa";
process.env.DATABASE_URL = process.env.DATABASE_URL || "postgresql://postgres.udmlgmmbcuvtpbhdalfb:AJSaanvi1234@aws-1-ap-southeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true";
process.env.DIRECT_URL = process.env.DIRECT_URL || "postgresql://postgres.udmlgmmbcuvtpbhdalfb:AJSaanvi1234@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres";
const nextConfig = withPWA({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  disable: process.env.NODE_ENV === "development",
})({
  turbopack: {},
  allowedDevOrigins: ["172.20.10.2", "172.21.208.1", "*.ngrok-free.app", "*.ngrok-free.dev", "*.ngrok.io"],
});
export default nextConfig;