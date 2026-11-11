import { createMDX } from '@hanzo/docs-mdx/next';
import type { NextConfig } from 'next';

const withMDX = createMDX();

const config: NextConfig = {
  reactStrictMode: true,
};

export default withMDX(config);
