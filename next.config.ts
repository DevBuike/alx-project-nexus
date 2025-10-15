import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  compress: false,
  reactStrictMode: true,
  images: {
    domains: ['res.cloudinary.com'],
  }

};

export default nextConfig;
