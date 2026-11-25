import type { Metadata } from 'next';
import { getCategory } from '@/lib/blog-posts';
import { CategoryListing, categoryPages } from '@/components/blog/CategoryListing';

interface Props {
  params: Promise<{ category: string }>;
}

// Only categories with published articles get a page; empty ones would be thin content.
export const dynamicParams = false;

export function generateStaticParams() {
  return categoryPages().map(({ category }) => ({ category }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const cat = getCategory(category);
  if (!cat) return { title: 'Category not found' };
  return {
    title: `${cat.name} Guides`,
    description: cat.description,
    alternates: { canonical: `/blog/category/${cat.slug}` },
    openGraph: { title: `${cat.name} · Sabhijude blog`, description: cat.description, url: `/blog/category/${cat.slug}`, type: 'website' },
  };
}

export default async function BlogCategoryPage({ params }: Props) {
  const { category } = await params;
  return <CategoryListing category={category} page={1} />;
}
