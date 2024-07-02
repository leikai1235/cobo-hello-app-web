/** @type {import('next').NextConfig} */

const nextConfig = {
  async rewrites() {
    return [
      // 跨域转发
      {
        source: '/:locale/web/v2/:path*',
        destination: 'https://api.sandbox.cobo.com/web/v2/:path*',
      },
    ]
  },
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
