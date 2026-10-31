import type { Metadata } from 'next';
import { SupportClient } from './SupportClient';
import { JsonLd } from '@/components/seo/JsonLd';
import { getBreadcrumbSchema, getFaqSchema } from '@/lib/seo-schemas';
import { FAQS } from '@/lib/support-data';

export const metadata: Metadata = {
  title: 'Help Center & Contact Support | Sabhijude',
  description:
    'Need help? Access the Sabhijude 24/7 support desk, browse safety and privacy FAQs, submit assistance tickets, and connect with platform administrators.',
  alternates: {
    canonical: '/support',
  },
  openGraph: {
    title: 'Help Center & Contact Support | Sabhijude',
    description:
      '24/7 assistance, response triage, support ticket submission, and verified helpline contacts.',
    url: '/support',
    type: 'website',
  },
};

export default function SupportPage() {
  const breadcrumbs = getBreadcrumbSchema([
    { name: 'Home', item: '/' },
    { name: 'Help & Support', item: '/support' },
  ]);

  const faqSchema = getFaqSchema(
    FAQS.map((f) => ({ question: f.q, answer: f.a }))
  );

  return (
    <>
      <JsonLd data={breadcrumbs} />
      <JsonLd data={faqSchema} />
      <SupportClient />
    </>
  );
}
