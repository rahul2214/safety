import type { Metadata } from 'next';
import { FeedClient } from './FeedClient';
import { JsonLd } from '@/components/seo/JsonLd';
import { getBreadcrumbSchema } from '@/lib/seo-schemas';

export const metadata: Metadata = {
  title: 'Live Community Safety Feed & Verified Local Alerts | Sabhijude',
  description:
    'Browse real-time, verified community safety reports, hazard warnings, and neighborhood incidents. Filter by category, location, and severity.',
  alternates: {
    canonical: '/feed',
  },
  openGraph: {
    title: 'Live Community Safety Feed & Verified Local Alerts | Sabhijude',
    description:
      'Real-time, verified community safety reports and neighborhood alerts to help you stay informed and travel safely.',
    url: '/feed',
    type: 'website',
  },
};

export default function FeedPage() {
  const breadcrumbs = getBreadcrumbSchema([
    { name: 'Home', item: '/' },
    { name: 'Community Safety Feed', item: '/feed' },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbs} />
      <FeedClient />
    </>
  );
}
