import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['lh3.googleusercontent.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/a/**',
      },
    ],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  // ✅ Multi-zone support for dashboard
  async rewrites() {
    return [
      {
        source: '/dashboard-static/_next/:path+',
        destination: '/_next/:path+',
      },
    ];
  },
};

export default nextConfig;