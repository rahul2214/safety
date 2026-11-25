import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BlogIndex, blogIndexPageCount } from '@/components/blog/BlogIndex';

interface Props {
  params: Promise<{ n: string }>;
}

// /blog is page 1, so this route serves pages 2 and up; anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  const total = blogIndexPageCount();
  return Array.from({ length: Math.max(0, total - 1) }, (_, i) => ({ n: String(i + 2) }));
}

const toPage = (n: string) => (/^\d+$/.test(n) ? Number(n) : NaN);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = toPage((await params).n);
  // Decide "not found" here, before anything streams, so the response really is a 404.
  if (!(page >= 2 && page <= blogIndexPageCount())) notFound();
  return {
    title: `Safety Guides · Page ${page}`,
    description: `Page ${page} of Sabhijude’s practical safety guides for India: online harassment, personal safety, emergencies and blood donation.`,
    // Each page is its own canonical: it lists different articles from page 1.
    alternates: { canonical: `/blog/page/${page}` },
  };
}

export default async function BlogIndexPageN({ params }: Props) {
  const page = toPage((await params).n);
  if (!(page >= 2)) notFound();
  return <BlogIndex page={page} />;
}
