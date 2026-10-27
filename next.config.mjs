/** @type {import('next').NextConfig} */
const nextConfig = {
  // Self-contained server (server.js + minimal node_modules) that cPanel's "Setup Node.js App" can run.
  output: "standalone",
  // Shared hosting usually can't run the image optimiser (needs sharp + memory), so serve images as-is.
  images: {
    unoptimized: true,
    remotePatterns: [{ protocol: "https", hostname: "abdulmoizghani.vercel.app" }],
  },
  eslint: { ignoreDuringBuilds: true },
  poweredByHeader: false,
};

export default nextConfig;
