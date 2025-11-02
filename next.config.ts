import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
  images: {
    domains: ['i.scdn.co'], // tambahkan domain ini
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
