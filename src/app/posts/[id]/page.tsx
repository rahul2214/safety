import type { Metadata } from 'next';
import { PostDetailClient } from './PostDetailClient';
import { JsonLd } from '@/components/seo/JsonLd';
import { getBreadcrumbSchema } from '@/lib/seo-schemas';

interface PostPageProps {
  params: Promise<{ id: string }>;
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { id } = await params;
  if (!UUID_REGEX.test(id)) {
    return {
      title: 'Report Not Found | Sabhijude Community',
      robots: { index: false, follow: false },
    };
  }

  return {
    title: 'Safety Report | Sabhijude Community',
    description: 'Verified community safety report on Sabhijude. View neighborhood hazard details, community solutions, and real-time updates.',
    alternates: {
      canonical: `/posts/${id}`,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: 'Safety Report | Sabhijude Community',
      description: 'Verified community safety report on Sabhijude.',
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
    { name: 'Safety Report', item: `/posts/${id}` },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbs} />
      <PostDetailClient />
    </>
  );
}
