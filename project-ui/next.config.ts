import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Allow reading files from parent directory (the project root)
  serverExternalPackages: ['gray-matter', 'js-yaml'],
};

export default nextConfig;
