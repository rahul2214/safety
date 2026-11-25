import type { MetadataRoute } from 'next';
import { BLOG_POSTS, CATEGORIES } from '@/lib/blog-posts';

const BASE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://sabhijude.veltria.in')
).replace(/\/+$/, '');

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date().toISOString();

  // Public indexable routes
  return [
    {
      url: `${BASE_URL}/blood-donation`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...BLOG_POSTS.map((p) => ({
      url: `${BASE_URL}/blog/${p.slug}`,
      lastModified: `${p.updatedAt}T00:00:00+05:30`,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    // Category pages, only for categories that have published articles (as the pages do).
    ...CATEGORIES.filter((c) => BLOG_POSTS.some((p) => p.category === c.slug)).map((c) => ({
      url: `${BASE_URL}/blog/category/${c.slug}`,
      lastModified: BLOG_POSTS.filter((p) => p.category === c.slug)
        .map((p) => p.updatedAt)
        .sort()
        .reverse()[0] + 'T00:00:00+05:30',
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    })),
    {
      url: `${BASE_URL}/`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/emergency`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/feed`,
      lastModified: currentDate,
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/safety-measures`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/resources`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/organization-request`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.75,
    },
    {
      url: `${BASE_URL}/support`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.65,
    },
    {
      url: `${BASE_URL}/map`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.6,
    },
  ];
}
