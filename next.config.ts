import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
  // Transpile third-party packages that may use modern syntax
  transpilePackages: ["framer-motion"],
};

export default nextConfig;
