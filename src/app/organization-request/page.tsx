import type { Metadata } from 'next';
import { OrganizationRequestClient } from './OrganizationRequestClient';
import { JsonLd } from '@/components/seo/JsonLd';
import { getBreadcrumbSchema } from '@/lib/seo-schemas';

export const metadata: Metadata = {
  title: 'Campus & Workplace Safety Platform | Sabhijude for Organizations',
  description:
    'Equip your university, college, or corporate campus with real-time geofenced incident dispatch, dedicated security desks, and verified member safety with Sabhijude.',
  alternates: {
    canonical: '/organization-request',
  },
  openGraph: {
    title: 'Campus & Workplace Safety Platform | Sabhijude for Organizations',
    description:
      'Empower on-ground campus security with geofenced incident dispatch, anonymous reporting, and real-time response consoles.',
    url: '/organization-request',
    type: 'website',
  },
};

export default function OrganizationRequestPage() {
  const breadcrumbs = getBreadcrumbSchema([
    { name: 'Home', item: '/' },
    { name: 'For Organizations', item: '/organization-request' },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbs} />
      <OrganizationRequestClient />
    </>
  );
}
