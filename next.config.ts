import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/garden-planner",
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
