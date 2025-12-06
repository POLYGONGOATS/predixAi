import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [],
  serverExternalPackages: ['pino', 'pino-pretty', 'thread-stream'],
  // Empty turbopack config to silence Next.js 16 warning
  turbopack: {},
  webpack: (config, { isServer, webpack }) => {
    if (!isServer) {
      // Prevent bundling of server-only packages on the client
      config.resolve.alias = {
        ...config.resolve.alias,
        'pino': false,
        'thread-stream': false,
        'pino-pretty': false,
      };

      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        'pino': false,
        'thread-stream': false,
      };
    }

    return config;
  },
};

export default nextConfig;
