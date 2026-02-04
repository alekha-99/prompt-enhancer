import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  output: "standalone",

  // Allow local network access during development
  allowedDevOrigins: [
    'http://192.168.1.76:3000',
    'http://localhost:3000',
  ],
};

export default nextConfig;
