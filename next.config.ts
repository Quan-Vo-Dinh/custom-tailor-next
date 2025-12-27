import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Disable image optimization completely to prevent DNS errors
    unoptimized: true,
  },
};

export default nextConfig;
