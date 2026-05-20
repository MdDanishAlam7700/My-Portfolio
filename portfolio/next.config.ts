import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow Three.js and @react-three packages
  transpilePackages: ["three"],
};

export default nextConfig;
