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
  title: 'Sabhijude — Women & Safety App | Emergency SOS & Live Location',
  description:
    'Sabhijude is a personal safety app for women: one tap sends your emergency live location to people you trust, with fake calls and verified community reports.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Sabhijude — Women & Safety App | Emergency SOS & Live Location',
    description:
      'Sabhijude is a personal safety app for women: one tap sends your emergency live location to people you trust, with fake calls and verified community reports.',
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
