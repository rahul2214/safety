import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
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
