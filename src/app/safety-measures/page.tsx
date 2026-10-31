import type { Metadata } from 'next';
import { SafetyMeasuresClient } from './SafetyMeasuresClient';
import { JsonLd } from '@/components/seo/JsonLd';
import { getBreadcrumbSchema } from '@/lib/seo-schemas';

export const metadata: Metadata = {
  title: 'India Emergency Helplines & Safety Measures | Sabhijude',
  description:
    'Complete directory of official 24/7 emergency helplines in India including Police 112, Women Helpline 1091, Distress 181, and Cyber Crime 1930, with actionable emergency safety measures.',
  alternates: {
    canonical: '/safety-measures',
  },
  openGraph: {
    title: 'India Emergency Helplines & Safety Measures | Sabhijude',
    description:
      'Official 24/7 emergency helplines in India including 112, 1091, 181, and 1930, with practical safety guidelines and tools.',
    url: '/safety-measures',
    type: 'website',
  },
};

export default function SafetyMeasuresPage() {
  const breadcrumbs = getBreadcrumbSchema([
    { name: 'Home', item: '/' },
    { name: 'Safety Measures & Helplines', item: '/safety-measures' },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbs} />
      <SafetyMeasuresClient />
    </>
  );
}
