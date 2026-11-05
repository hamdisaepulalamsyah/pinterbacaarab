/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@pinterbacaarab/shared'],
  serverExternalPackages: ['pdf-parse', 'mammoth'],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
