import type { MetadataRoute } from 'next';

const BASE_URL = 'https://sabhijude.com';

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
