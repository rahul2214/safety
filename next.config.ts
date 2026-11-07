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
    // next/image is not used with remote sources; no remotePatterns so the
    // image optimizer cannot be abused as an open proxy (SEC-03).
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
