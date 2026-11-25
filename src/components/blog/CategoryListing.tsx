import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { JsonLd } from '@/components/seo/JsonLd';
import { getBreadcrumbSchema, SITE_URL } from '@/lib/seo-schemas';
import { BLOG_POSTS, CATEGORIES, getCategory, getPostsByCategory, paginate, POSTS_PER_PAGE } from '@/lib/blog-posts';
import { BlogPostCard } from '@/components/blog/PostCard';
import { CategoryNav } from '@/components/blog/CategoryNav';
import { Pagination, pageHref } from '@/components/blog/Pagination';

/** Categories with published articles, and how many listing pages each has. */
export function categoryPages(): Array<{ category: string; pages: number }> {
  const used = new Set(BLOG_POSTS.map((p) => p.category));
  return CATEGORIES.filter((c) => used.has(c.slug)).map((c) => ({
    category: c.slug,
    pages: paginate(getPostsByCategory(c.slug), 1)!.totalPages,
  }));
}

/** One page of a category, 10 articles a page. /blog/category/<slug> is page 1. */
export function CategoryListing({ category, page }: { category: string; page: number }) {
  const cat = getCategory(category);
  if (!cat) notFound();
  const all = getPostsByCategory(cat.slug);
  const result = paginate(all, page);
  if (!all.length || !result) notFound();
  const { items, totalPages } = result;
  const base = `/blog/category/${cat.slug}`;
  const url = pageHref(base, page);
  const offset = (page - 1) * POSTS_PER_PAGE;

  const crumbs = [
    { name: 'Home', item: '/' },
    { name: 'Blog', item: '/blog' },
    { name: cat.name, item: base },
  ];
  if (page > 1) crumbs.push({ name: `Page ${page}`, item: url });

  return (
    <div className="bg-white">
      <JsonLd data={getBreadcrumbSchema(crumbs)} />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: page > 1 ? `${cat.name} guides, page ${page}` : `${cat.name} guides`,
          description: cat.description,
          url: `${SITE_URL}${url}`,
          mainEntity: {
            '@type': 'ItemList',
            itemListElement: items.map((p, i) => ({
              '@type': 'ListItem',
              position: offset + i + 1,
              url: `${SITE_URL}/blog/${p.slug}`,
              name: p.title,
            })),
          },
        }}
      />

      <section className="border-b border-slate-200/70">
        <div className="public-container py-14 sm:py-16 space-y-8">
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-ink transition-colors">
            <ArrowLeft className="h-4 w-4" /> All articles
          </Link>
          <div className="max-w-3xl space-y-4">
            <span className="eyebrow"><span className="h-px w-6 bg-brand" />Category</span>
            <h1 className="display-2">
              {cat.name}
              {page > 1 && <span className="text-slate-400"> · Page {page}</span>}
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed">{cat.description}</p>
          </div>
          <CategoryNav active={cat.slug} />
        </div>
      </section>

      <section className="public-container py-14 sm:py-20 space-y-12">
        <div className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
          {items.map((p) => (
            <BlogPostCard key={p.slug} post={p} />
          ))}
        </div>
        <Pagination current={page} total={totalPages} basePath={base} />
      </section>
    </div>
  );
}
