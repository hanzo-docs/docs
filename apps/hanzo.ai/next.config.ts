import type { NextConfig } from 'next';

const config: NextConfig = {
  output: 'export',
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  // Trailing slashes for GitHub Pages compatibility
  trailingSlash: true,
};

export default config;
