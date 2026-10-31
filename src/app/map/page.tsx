import type { Metadata } from 'next';
import { SafetyMapClient } from './SafetyMapClient';
import { JsonLd } from '@/components/seo/JsonLd';
import { getBreadcrumbSchema } from '@/lib/seo-schemas';

export const metadata: Metadata = {
  title: 'Interactive Safety Map & Incident Zones | Sabhijude',
  description:
    'Explore verified neighborhood safety zones, local police stations, 24/7 hospitals, women shelters, and live incident markers across India on Sabhijude.',
  alternates: {
    canonical: 'https://sabhijude.com/map',
  },
  openGraph: {
    title: 'Interactive Safety Map & Incident Zones | Sabhijude',
    description:
      'Explore verified safety zones, police stations, 24/7 hospitals, and live incident markers.',
    url: 'https://sabhijude.com/map',
    type: 'website',
  },
};

export default function SafetyMapPage() {
  const breadcrumbs = getBreadcrumbSchema([
    { name: 'Home', item: '/' },
    { name: 'Safety Map', item: '/map' },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbs} />
      <SafetyMapClient />
    </>
  );
}
