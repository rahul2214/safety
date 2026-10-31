import type { MetadataRoute } from 'next';

const BASE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://sabhijude.veltria.in')
).replace(/\/+$/, '');

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/about',
          '/safety-measures',
          '/resources',
          '/organization-request',
          '/feed',
          '/privacy',
          '/support',
          '/emergency',
          '/map',
          '/posts/',
        ],
        disallow: [
          '/admin/',
          '/org/',
          '/api/',
          '/profile',
          '/settings',
          '/contacts',
          '/myposts',
          '/my-posts',
          '/notifications',
          '/create',
          '/play',
          '/reports',
          '/login?*',
          '/signup?*',
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
