import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  output: "standalone", // สำหรับ Docker

  async rewrites() {
    const apiUrl = process.env.INTERNAL_API_URL || "http://api:3000"
    return [
      {
        source: "/openapi/:path*",
        destination: `${apiUrl}/openapi/:path*`,
      },
      {
        source: "/auth/:path*",
        destination: `${apiUrl}/auth/:path*`,
      },
      {
        source: "/api/:path*",
        destination: `${apiUrl}/api/:path*`,
      },
    ]
  },
};

export default nextConfig;
