import type { Metadata } from 'next';
import { HomePageClient } from './HomePageClient';
import { JsonLd } from '@/components/seo/JsonLd';
import {
  getOrganizationSchema,
  getWebSiteSchema,
  getSoftwareApplicationSchema,
  getFaqSchema,
  HOMEPAGE_FAQS,
  SITE_URL,
} from '@/lib/seo-schemas';

export const metadata: Metadata = {
  title: 'Sabhijude — Feel Safe, Wherever You Go | Personal Safety App',
  description:
    'One tap sends your live location to the people you trust. A fake call gets you out of uncomfortable moments. And a community of women keeps each other informed.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Sabhijude — Feel Safe, Wherever You Go',
    description:
      'One tap sends your live location to the people you trust. A fake call gets you out of uncomfortable moments. And a community of women keeps each other informed.',
    url: SITE_URL,
    type: 'website',
  },
};

export default function HomePage() {
  return (
    <>
      <JsonLd data={getOrganizationSchema()} />
      <JsonLd data={getWebSiteSchema()} />
      <JsonLd data={getSoftwareApplicationSchema()} />
      <JsonLd data={getFaqSchema(HOMEPAGE_FAQS)} />
      <HomePageClient />
    </>
  );
}
