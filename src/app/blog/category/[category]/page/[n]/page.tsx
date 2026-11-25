import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCategory, getPostsByCategory, paginate } from '@/lib/blog-posts';
import { CategoryListing, categoryPages } from '@/components/blog/CategoryListing';

interface Props {
  params: Promise<{ category: string; n: string }>;
}

// The category's own URL is page 1, so this serves pages 2 and up of categories that have them.
export const dynamicParams = false;

export function generateStaticParams() {
  return categoryPages().flatMap(({ category, pages }) =>
    Array.from({ length: Math.max(0, pages - 1) }, (_, i) => ({ category, n: String(i + 2) })),
  );
}

const toPage = (n: string) => (/^\d+$/.test(n) ? Number(n) : NaN);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, n } = await params;
  const cat = getCategory(category);
  const page = toPage(n);
  // Decide "not found" here, before anything streams, so the response really is a 404.
  if (!cat || !(page >= 2) || !paginate(getPostsByCategory(cat.slug), page)) notFound();
  return {
    title: `${cat.name} Guides · Page ${page}`,
    description: cat.description,
    alternates: { canonical: `/blog/category/${cat.slug}/page/${page}` },
  };
}

export default async function BlogCategoryPageN({ params }: Props) {
  const { category, n } = await params;
  const page = toPage(n);
  if (!(page >= 2)) notFound();
  return <CategoryListing category={category} page={page} />;
}
