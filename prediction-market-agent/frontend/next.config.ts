import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [],
  serverExternalPackages: ['pino', 'pino-pretty', 'thread-stream'],
  // Empty turbopack config to silence the warning
  turbopack: {},
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      };
    }

    return config;
  },
};

export default nextConfig;
