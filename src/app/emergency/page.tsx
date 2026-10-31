import type { Metadata } from 'next';
import { EmergencyClient } from './EmergencyClient';
import { JsonLd } from '@/components/seo/JsonLd';
import { getBreadcrumbSchema, getSoftwareApplicationSchema } from '@/lib/seo-schemas';

export const metadata: Metadata = {
  title: 'Emergency SOS & Live GPS Location Alert | Sabhijude',
  description:
    'Instant emergency SOS dispatch tool. Share your real-time GPS coordinates with trusted contacts via WhatsApp and SMS, and connect directly to 112 emergency services.',
  alternates: {
    canonical: 'https://sabhijude.com/emergency',
  },
  openGraph: {
    title: 'Emergency SOS & Live GPS Location Alert | Sabhijude',
    description:
      'Instant emergency SOS dispatch tool with live location sharing and direct 112 calling.',
    url: 'https://sabhijude.com/emergency',
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
