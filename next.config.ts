import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Standalone mode is only needed for self-hosted container / Docker deployments.
  // On Vercel, Vercel natively handles serverless function packaging and onBuildComplete
  // fails with ENOENT for next-server.js.nft.json when standalone is forced.
  output: process.env.VERCEL ? undefined : 'standalone',
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/safety',
        destination: '/safety-measures',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
