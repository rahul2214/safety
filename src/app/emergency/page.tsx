import type { Metadata } from 'next';
import { EmergencyClient } from './EmergencyClient';
import { JsonLd } from '@/components/seo/JsonLd';
import { getBreadcrumbSchema, getSoftwareApplicationSchema } from '@/lib/seo-schemas';

export const metadata: Metadata = {
  title: 'Emergency SOS & Live GPS Location Alert | Sabhijude',
  description:
    'How Sabhijude Emergency SOS works: one tap in the mobile app sends your live location to your trusted contacts. Try the demo, or call 112 directly.',
  alternates: {
    canonical: '/emergency',
  },
  openGraph: {
    title: 'Emergency SOS & Live GPS Location Alert | Sabhijude',
    description:
      'One tap in the Sabhijude app sends your live location to the people you trust.',
    url: '/emergency',
    type: 'website',
  },
};

export default function EmergencyPage() {
  const breadcrumbs = getBreadcrumbSchema([
    { name: 'Home', item: '/' },
    { name: 'Emergency SOS', item: '/emergency' },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbs} />
      <JsonLd data={getSoftwareApplicationSchema()} />
      <EmergencyClient />
    </>
  );
}
