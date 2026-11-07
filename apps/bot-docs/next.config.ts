import { resolve } from 'path';
import createBundleAnalyzer from '@next/bundle-analyzer';
import { createMDX } from '@hanzo/docs/mdx/next';
import type { NextConfig } from 'next';

const withAnalyzer = createBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

// eslint-disable-next-line @typescript-eslint/no-require-imports
const withGui = require('@hanzo/ui/next') as <T>(config: T, dir: string) => T;

const config: NextConfig = {
  // Both ship ESM with 'use client' boundaries, so the client/server split
  // and the JSX runtime resolve only when the app build compiles them.
  transpilePackages: ['@hanzogui/shell', '@hanzo/brand'],
  output: 'export',
  trailingSlash: true,
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@hanzo/mdx:collections/server': resolve(__dirname, './.docs/server.ts'),
      '@hanzo/mdx:collections/browser': resolve(__dirname, './.docs/browser.ts'),
      '@hanzo/mdx:collections/dynamic': resolve(__dirname, './.docs/dynamic.ts'),
    };
    config.resolve.extensionAlias = {
      ...config.resolve.extensionAlias,
      '.js': ['.web.js', '.js', '.web.ts', '.web.tsx', '.ts', '.tsx'],
    };
    return config;
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  serverExternalPackages: [
    'shiki',
  ],
  images: {
    unoptimized: true,
  },
};

const withMDX = createMDX();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default withAnalyzer(withMDX(withGui(config, __dirname) as any) as NextConfig);
