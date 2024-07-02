/** @type {import('next').NextConfig} */

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config) => {
    config.resolve = {
      ...config.resolve,
      fallback: {
        "fs": false,
        "path": false,
        "os": false,
      }
    }
    return config
  },
};

export default nextConfig;
