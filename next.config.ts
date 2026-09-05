import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  allowedDevOrigins: ["http://localhost:3000", "making-bagel-riveting.ngrok-free.dev"],
};

export default nextConfig;
