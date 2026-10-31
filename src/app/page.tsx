import type { Metadata } from 'next';
import { HomePageClient } from './HomePageClient';
import { JsonLd } from '@/components/seo/JsonLd';
import {
  getOrganizationSchema,
  getWebSiteSchema,
  getSoftwareApplicationSchema,
} from '@/lib/seo-schemas';

export const metadata: Metadata = {
  title: 'Sabhijude — Personal Safety App & Emergency SOS Platform',
  description:
    'Protect yourself, your family, and your campus with Sabhijude. Instant emergency SOS alerts, live GPS location sharing, discreet fake call exits, and verified safety reports.',
  alternates: {
    canonical: 'https://sabhijude.com/',
  },
  openGraph: {
    title: 'Sabhijude — Personal Safety App & Emergency SOS Platform',
    description:
      'Instant emergency SOS alerts, live GPS location sharing, discreet exit tools, and verified community safety defense for everyone.',
    url: 'https://sabhijude.com',
    type: 'website',
  },
};

export default function HomePage() {
  return (
    <>
      <JsonLd data={getOrganizationSchema()} />
      <JsonLd data={getWebSiteSchema()} />
      <JsonLd data={getSoftwareApplicationSchema()} />
      <HomePageClient />
    </>
  );
}
