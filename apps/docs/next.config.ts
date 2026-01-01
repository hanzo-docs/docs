import createBundleAnalyzer from '@next/bundle-analyzer';
import { createMDX } from '@hanzo/docs/mdx/next';
import type { NextConfig } from 'next';

const withAnalyzer = createBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const config: NextConfig = {
  reactStrictMode: true,
  // Use webpack resolve aliases instead of turbopack to avoid .json resolution issues
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@hanzo/mdx:collections/server': './.docs/server.ts',
      '@hanzo/mdx:collections/browser': './.docs/browser.ts',
      '@hanzo/mdx:collections/dynamic': './.docs/dynamic.ts',
    };
    return config;
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  serverExternalPackages: [
    'ts-morph',
    'typescript',
    'oxc-transform',
    'twoslash',
    'shiki',
    '@takumi-rs/image-response',
    // Turbopack JSON file issues with these packages
    'mcp-handler',
    '@modelcontextprotocol/sdk',
    'raw-body',
    'iconv-lite',
    'statuses',
    'ajv',
  ],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        port: '',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/docs/:path*.mdx',
        destination: '/llms.mdx/:path*',
      },
      {
        source: '/docs.mdx',
        destination: '/llms.mdx',
      },
    ];
  },
};

const withMDX = createMDX();

export default withAnalyzer(withMDX(config));
