import type { Metadata } from 'next';
import { ResourcesClient } from './ResourcesClient';
import { JsonLd } from '@/components/seo/JsonLd';
import { getBreadcrumbSchema, getArticleSchema } from '@/lib/seo-schemas';
import { RESOURCES_DATA } from '@/lib/resources-data';

export const metadata: Metadata = {
  title: 'Safety Guides, POSH Act & Legal Rights in India | Sabhijude',
  description:
    'Comprehensive safety guides and legal protections: POSH Act 2013 workplace rights, Bharatiya Nyaya Sanhita (BNS) penal codes, college anti-ragging protocols, and cyber safety.',
  alternates: {
    canonical: '/resources',
  },
  openGraph: {
    title: 'Safety Guides, POSH Act & Legal Rights in India | Sabhijude',
    description:
      'Explore verified safety guides covering workplace POSH compliance, Indian criminal safety laws (BNS), campus regulations, and cyber safety.',
    url: '/resources',
    type: 'article',
  },
};

export default function ResourcesPage() {
  const breadcrumbs = getBreadcrumbSchema([
    { name: 'Home', item: '/' },
    { name: 'Safety Guides', item: '/resources' },
  ]);

  const articleSchemas = RESOURCES_DATA.map((guide) =>
    getArticleSchema({
      title: guide.title,
      description: guide.summary,
      url: `/resources#${guide.id}`,
      category: guide.category,
    })
  );

  return (
    <>
      <JsonLd data={breadcrumbs} />
      {articleSchemas.map((schema, i) => (
        <JsonLd key={i} data={schema} />
      ))}
      <ResourcesClient />
    </>
  );
}
