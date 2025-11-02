import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
  images: {
    domains: ['i.scdn.co'], // tambahkan domain ini
  },
};

export default nextConfig;
