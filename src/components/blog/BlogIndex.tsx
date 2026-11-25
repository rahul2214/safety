import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, Clock, Phone } from 'lucide-react';
import { JsonLd } from '@/components/seo/JsonLd';
import { getBreadcrumbSchema } from '@/lib/seo-schemas';
import { BLOG_POSTS, formatPostDate, getCategory, getFeaturedPost, paginate, readingMinutes } from '@/lib/blog-posts';
import { BlogPostCard, PostArt } from '@/components/blog/PostCard';
import { CategoryNav } from '@/components/blog/CategoryNav';
import { Pagination, pageHref } from '@/components/blog/Pagination';

/** The featured article first, then everything else newest first. */
function orderedPosts() {
  const featured = getFeaturedPost();
  return [featured, ...BLOG_POSTS.filter((p) => p.slug !== featured.slug)];
}

export const blogIndexPageCount = () => paginate(orderedPosts(), 1)!.totalPages;

/**
 * The blog listing, 10 articles a page. Page 1 opens with the header and shows its first
 * article (the featured one) large; later pages are a plain grid. /blog is page 1,
 * /blog/page/<n> the rest.
 */
export function BlogIndex({ page }: { page: number }) {
  const result = paginate(orderedPosts(), page);
  if (!result) notFound();
  const { items, totalPages } = result;
  const first = page === 1;
  const [hero, ...cards] = first ? items : [undefined, ...items];

  const crumbs = [
    { name: 'Home', item: '/' },
    { name: 'Blog', item: '/blog' },
  ];
  if (!first) crumbs.push({ name: `Page ${page}`, item: pageHref('/blog', page) });

  return (
    <div className="bg-white">
      <JsonLd data={getBreadcrumbSchema(crumbs)} />

      {/* Header */}
      <section className="relative overflow-hidden border-b border-slate-200/70">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 right-[-8%] h-[420px] w-[420px] rounded-full bg-coral/10 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(#0b16300d_1px,transparent_1px)] [background-size:22px_22px] [mask-image:linear-gradient(to_bottom,black,transparent_80%)]" />
        </div>
        <div className={`public-container relative space-y-8 ${first ? 'py-16 sm:py-20' : 'py-12 sm:py-14'}`}>
          <div className="max-w-3xl space-y-5">
            <span className="eyebrow"><span className="h-px w-6 bg-brand" />The Sabhijude blog</span>
            {first ? (
              <>
                <h1 className="display-1">Know what to do, before you need to.</h1>
                <p className="text-lg sm:text-xl text-slate-600 leading-relaxed">
                  Practical guides on online harassment, personal safety, emergencies and blood donation in India. Written plainly, checked
                  against official sources, and updated when things change.
                </p>
              </>
            ) : (
              <h1 className="display-2">All guides · Page {page} of {totalPages}</h1>
            )}
          </div>
          <CategoryNav />
        </div>
      </section>

      {/* Featured (page 1 only) */}
      {hero && (
        <section className="public-container py-14 sm:py-16">
          <Link href={`/blog/${hero.slug}`} className="group grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-7 transition-transform duration-300 group-hover:-translate-y-0.5">
              <PostArt post={hero} />
            </div>
            <div className="lg:col-span-5 space-y-4">
              <span className="eyebrow">{getCategory(hero.category)?.name}</span>
              <h2 className="display-2 group-hover:text-brand transition-colors">{hero.title}</h2>
              <p className="text-lg text-slate-600 leading-relaxed">{hero.description}</p>
              <div className="flex items-center gap-3 text-sm text-slate-500">
                <time dateTime={hero.updatedAt}>{formatPostDate(hero.updatedAt)}</time>
                <span aria-hidden className="h-1 w-1 rounded-full bg-slate-300" />
                <span className="inline-flex items-center gap-1"><Clock className="h-4 w-4" /> {readingMinutes(hero)} min read</span>
              </div>
              <span className="inline-flex items-center gap-2 font-semibold text-brand">
                Read the guide <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </Link>
        </section>
      )}

      {/* Articles on this page */}
      <section className={`public-container pb-20 sm:pb-28 space-y-10 ${first ? '' : 'pt-12 sm:pt-14'}`}>
        <div className={`flex items-end justify-between gap-4 ${first ? 'border-t border-slate-200 pt-10' : ''}`}>
          <h2 className="font-display text-2xl font-bold text-ink">{first ? 'All guides' : 'More guides'}</h2>
          <span className="text-sm text-slate-500">
            {BLOG_POSTS.length} articles · page {page} of {totalPages}
          </span>
        </div>
        <div className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
          {cards.map((p) => p && <BlogPostCard key={p.slug} post={p} />)}
        </div>
        <Pagination current={page} total={totalPages} basePath="/blog" />
      </section>

      {/* Help now */}
      <section className="pb-24 sm:pb-32">
        <div className="public-container">
          <div className="relative overflow-hidden rounded-[2rem] bg-ink p-8 sm:p-14 text-white grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div aria-hidden className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-red-500/25 blur-3xl" />
            <div className="relative lg:col-span-8 space-y-3">
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight">Need help right now?</h2>
              <p className="text-white/70 text-lg">
                Call 112 for any emergency in India. For online fraud or cybercrime, call 1930 or report at cybercrime.gov.in.
              </p>
            </div>
            <div className="relative lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 lg:items-end">
              <a href="tel:112" className="btn-sos"><Phone className="h-4 w-4" /> Call 112</a>
              <Link href="/blog/emergency-helpline-numbers-india" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 px-6 py-3.5 text-sm font-semibold text-white hover:bg-white/10 transition">
                All helpline numbers <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
