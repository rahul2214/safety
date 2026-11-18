import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, Clock, Droplet } from 'lucide-react';
import { JsonLd } from '@/components/seo/JsonLd';
import { getArticleSchema, getBreadcrumbSchema } from '@/lib/seo-schemas';
import { BLOG_POSTS, formatPostDate, getPost } from '@/lib/blog-posts';
import { ArticleBody } from '@/components/blog/ArticleBody';
import { BlogPostCard, PostArt } from '@/components/blog/PostCard';

interface Props {
  params: Promise<{ slug: string }>;
}

// Only the articles in lib/blog-posts.ts exist; anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Article not found" };
  return {
    title: `${post.title} · Blog`,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `/blog/${post.slug}`,
      type: 'article',
      publishedTime: `${post.date}T00:00:00+05:30`,
      siteName: 'Sabhijude',
    },
    twitter: { card: 'summary_large_image', title: post.title, description: post.description },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const related = BLOG_POSTS.filter((p) => p.slug !== post.slug).slice(0, 3);
  const isBlood = post.category !== 'Guides' || post.slug.includes('blood');

  return (
    <div className="bg-white">
      <JsonLd data={getBreadcrumbSchema([{ name: 'Home', item: '/' }, { name: 'Blog', item: '/blog' }, { name: post.title, item: `/blog/${post.slug}` }])} />
      <JsonLd
        data={getArticleSchema({
          title: post.title,
          description: post.description,
          url: `/blog/${post.slug}`,
          datePublished: `${post.date}T00:00:00+05:30`,
          dateModified: `${post.date}T00:00:00+05:30`,
          category: post.category,
        })}
      />

      <article>
        <header className="public-container pt-10 sm:pt-14 space-y-8">
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-ink transition-colors">
            <ArrowLeft className="h-4 w-4" /> All articles
          </Link>
          <div className="mx-auto max-w-3xl space-y-5 text-center">
            <span className="eyebrow justify-center">{post.category}</span>
            <h1 className="font-display text-[2.1rem] leading-[1.12] font-extrabold tracking-[-0.02em] text-ink sm:text-5xl">{post.title}</h1>
            <p className="text-lg sm:text-xl text-slate-600 leading-relaxed">{post.description}</p>
            <div className="flex items-center justify-center gap-3 text-sm text-slate-500">
              <span className="font-medium text-ink">Sabhijude Team</span>
              <span aria-hidden className="h-1 w-1 rounded-full bg-slate-300" />
              <time dateTime={post.date}>{formatPostDate(post.date)}</time>
              <span aria-hidden className="h-1 w-1 rounded-full bg-slate-300" />
              <span className="inline-flex items-center gap-1"><Clock className="h-4 w-4" /> {post.readMinutes} min</span>
            </div>
          </div>
          <div className="mx-auto max-w-5xl">
            <PostArt post={post} size="hero" />
          </div>
        </header>

        <div className="public-container py-12 sm:py-16">
          <div className="mx-auto max-w-[44rem]">
            <ArticleBody blocks={post.body} />

            {/* In-article CTA */}
            {isBlood && (
              <div className="mt-14 rounded-3xl border border-red-100 bg-gradient-to-br from-red-50 via-white to-coral-tint p-7 sm:p-9 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-600 text-white"><Droplet className="h-5 w-5" /></span>
                  <h2 className="font-display text-xl sm:text-2xl font-bold text-ink">Need blood, or ready to give it?</h2>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Post a request in under a minute, or see open requests from people near you. Free, with no middlemen.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href="/blood" className="btn-sos">Request blood</Link>
                  <Link href="/blood-donation" className="btn-ghost">How it works <ArrowRight className="h-4 w-4" /></Link>
                </div>
              </div>
            )}

            <p className="mt-10 border-t border-slate-200 pt-6 text-sm leading-relaxed text-slate-500">
              This article is general information, not medical advice. Your hospital and its blood bank make every decision about donation and
              transfusion. In an emergency, call 112.
            </p>
          </div>
        </div>
      </article>

      {/* Related */}
      <section className="bg-mist py-16 sm:py-20">
        <div className="public-container space-y-10">
          <div className="flex items-end justify-between gap-4">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink">Keep reading</h2>
            <Link href="/blog" className="text-sm font-semibold text-brand hover:text-brand-deep inline-flex items-center gap-1">
              All articles <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <BlogPostCard key={p.slug} post={p} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
