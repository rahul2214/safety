import type { Metadata } from 'next';
import { PrivacyCenterClient } from './PrivacyCenterClient';
import { JsonLd } from '@/components/seo/JsonLd';
import { getBreadcrumbSchema } from '@/lib/seo-schemas';

export const metadata: Metadata = {
  title: 'Privacy Policy & Personal Data Safeguards | Sabhijude',
  description:
    'Sabhijude Privacy Policy: zero commercial data selling, no background location tracking, default anonymous incident reporting, and encrypted emergency telemetry.',
  alternates: {
    canonical: 'https://sabhijude.com/privacy',
  },
  openGraph: {
    title: 'Privacy Policy & Personal Data Safeguards | Sabhijude',
    description:
      'Zero commercial data selling, strict purpose-limited GPS access, anonymous community reporting, and DPDP Act compliance.',
    url: 'https://sabhijude.com/privacy',
    type: 'website',
  },
};

export default function PrivacyPage() {
  const breadcrumbs = getBreadcrumbSchema([
    { name: 'Home', item: '/' },
    { name: 'Privacy Policy', item: '/privacy' },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbs} />
      <PrivacyCenterClient />
    </>
  );
}
