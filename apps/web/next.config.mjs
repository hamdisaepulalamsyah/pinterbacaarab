/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@pinterbacaarab/shared'],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
