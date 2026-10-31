import type { Metadata } from 'next';
import { PostDetailClient } from './PostDetailClient';
import { JsonLd } from '@/components/seo/JsonLd';
import { getBreadcrumbSchema } from '@/lib/seo-schemas';

interface PostPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Safety Report #${id} | Sabhijude Community`,
    description: `Verified community safety report #${id} on Sabhijude. View neighborhood hazard details, community solutions, and real-time updates.`,
    alternates: {
      canonical: `/posts/${id}`,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: `Safety Report #${id} | Sabhijude Community`,
      description: `Verified community safety report #${id} on Sabhijude.`,
      url: `/posts/${id}`,
      type: 'article',
    },
  };
}

export default async function PostDetailPage({ params }: PostPageProps) {
  const { id } = await params;
  const breadcrumbs = getBreadcrumbSchema([
    { name: 'Home', item: '/' },
    { name: 'Safety Feed', item: '/feed' },
    { name: `Report #${id}`, item: `/posts/${id}` },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbs} />
      <PostDetailClient />
    </>
  );
}
