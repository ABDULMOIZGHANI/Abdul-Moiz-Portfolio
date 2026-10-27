/** @type {import('next').NextConfig} */
const nextConfig = {
  // Self-contained server (server.js + minimal node_modules) that cPanel's "Setup Node.js App" can run.
  // Vercel builds Next.js its own way, so standalone output is only used off Vercel.
  output: process.env.VERCEL ? undefined : "standalone",
  // Shared hosting usually can't run the image optimiser (needs sharp + memory), so serve images as-is.
  images: {
    unoptimized: true,
    remotePatterns: [{ protocol: "https", hostname: "abdulmoizghani.vercel.app" }],
  },
  eslint: { ignoreDuringBuilds: true },
  poweredByHeader: false,
};

export default nextConfig;
