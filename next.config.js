/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ["your-image-domain.com"],
  },
};

module.exports = nextConfig;
