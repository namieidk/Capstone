import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  allowedDevOrigins: ["http://localhost:3000", "making-bagel-riveting.ngrok-free.dev"],
  async redirects() {
    return [
      {
        source: "/scholarMessages",
        destination: "/scholarMessage",
        permanent: false,
      },
      {
        source: "/ScholarMessages",
        destination: "/scholarMessage",
        permanent: false,
      },
      {
        source: "/ScholarForum",
        destination: "/SchoForum",
        permanent: false,
      },
      {
        source: "/ScholarProfile",
        destination: "/schoProfile",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
