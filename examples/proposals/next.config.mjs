/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  // Allow reading markdown files from outside the docs directory
  // Useful when content is in a sibling directory like ../LPs
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3002'],
    },
  },
};

export default config;
