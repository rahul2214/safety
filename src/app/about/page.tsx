import type { Metadata } from 'next';
import { AboutPageClient } from './AboutPageClient';
import { JsonLd } from '@/components/seo/JsonLd';
import { getBreadcrumbSchema, getFaqSchema } from '@/lib/seo-schemas';
import { FAQ_LIST } from '@/lib/about-data';

export const metadata: Metadata = {
  title: 'About Sabhijude | Mission, Principles & Safety Network',
  description:
    'Discover why Sabhijude was built: a privacy-first, community-powered personal safety platform offering emergency SOS dispatch, discreet tools, and verified safety defense.',
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: 'About Sabhijude | Mission, Principles & Safety Network',
    description:
      'A privacy-first personal safety network delivering rapid emergency SOS alerts, live location sharing, and discreet protection for everyone.',
    url: '/about',
    type: 'website',
  },
};

export default function AboutPage() {
  const breadcrumbs = getBreadcrumbSchema([
    { name: 'Home', item: '/' },
    { name: 'About', item: '/about' },
  ]);

  const faqSchema = getFaqSchema(FAQ_LIST);

  return (
    <>
      <JsonLd data={breadcrumbs} />
      <JsonLd data={faqSchema} />
      <AboutPageClient />
    </>
  );
}
