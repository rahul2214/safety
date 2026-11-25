import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, BadgeCheck, Clock, Droplet, ExternalLink, ListOrdered, Phone, ShieldCheck } from 'lucide-react';
import { JsonLd } from '@/components/seo/JsonLd';
import { getArticleSchema, getBreadcrumbSchema, getFaqSchema } from '@/lib/seo-schemas';
import {
  AUTHORS,
  BLOG_POSTS,
  documentTitle,
  formatPostDate,
  getCategory,
  getPost,
  getRelatedPosts,
  readingMinutes,
  stripMarks,
  tableOfContents,
  wordCount,
} from '@/lib/blog-posts';
import { ArticleBody, Inline } from '@/components/blog/ArticleBody';
import { BlogPostCard, PostArt } from '@/components/blog/PostCard';

interface Props {
  params: Promise<{ slug: string }>;
}

// Only published articles exist; anything else (including drafts) is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

const ist = (d: string) => `${d}T00:00:00+05:30`;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: 'Article not found' };
  const description = post.seoDescription || post.description;
  const url = `/blog/${post.slug}`;
  return {
    // Brand suffix only when the whole title still fits in Google's ~60 characters.
    title: documentTitle(post.seoTitle || post.title),
    description,
    keywords: post.keywords,
    authors: [{ name: AUTHORS[post.authorId].name, url: AUTHORS[post.authorId].url }],
    alternates: { canonical: post.canonicalUrl || url },
    openGraph: {
      title: post.seoTitle || post.title,
      description,
      url,
      type: 'article',
      publishedTime: ist(post.publishedAt),
      modifiedTime: ist(post.updatedAt),
      section: getCategory(post.category)?.name,
      tags: post.tags,
      siteName: 'Sabhijude',
      locale: 'en_IN',
    },
    twitter: { card: 'summary_large_image', title: post.seoTitle || post.title, description },
  };
}

/** Blood articles carry a medical note; everything else a general/legal one. */
function Disclaimer({ blood }: { blood: boolean }) {
  return (
    <p className="text-sm leading-relaxed text-slate-500">
      {blood
        ? 'This article is general information, not medical advice. Your hospital and its blood bank make every decision about donation and transfusion.'
        : 'This article is general information to help you understand your options. It is not legal advice. Laws, helplines and official procedures change, so check the official sources above, and speak to the police or a lawyer about your own situation.'}{' '}
      In an emergency in India, call <a href="tel:112" className="font-semibold text-ink underline">112</a>.
    </p>
  );
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const category = getCategory(post.category)!;
  const author = AUTHORS[post.authorId];
  const related = getRelatedPosts(post);
  const toc = tableOfContents(post);
  const isBlood = post.category === 'blood-donation';
  const url = `/blog/${post.slug}`;
  const updated = post.updatedAt !== post.publishedAt;

  return (
    <div className="bg-white">
      <JsonLd
        data={getBreadcrumbSchema([
          { name: 'Home', item: '/' },
          { name: 'Blog', item: '/blog' },
          { name: category.name, item: `/blog/category/${category.slug}` },
          { name: post.title, item: url },
        ])}
      />
      <JsonLd
        data={getArticleSchema({
          title: post.title,
          description: post.seoDescription || post.description,
          url,
          datePublished: ist(post.publishedAt),
          dateModified: ist(post.updatedAt),
          category: category.name,
          author: { name: author.name, url: author.url },
          image: `${url}/opengraph-image`,
          keywords: post.keywords,
          wordCount: wordCount(post),
        })}
      />
      {/* FAQ schema only where the page really shows those questions and answers. */}
      {post.faqs?.length ? (
        <JsonLd data={getFaqSchema(post.faqs.map((f) => ({ question: f.question, answer: stripMarks(f.answer) })))} />
      ) : null}

      <article>
        <header className="public-container pt-10 sm:pt-14 space-y-8">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm font-semibold text-slate-500">
            <Link href="/blog" className="inline-flex items-center gap-2 hover:text-ink transition-colors">
              <ArrowLeft className="h-4 w-4" /> Blog
            </Link>
            <span aria-hidden>/</span>
            <Link href={`/blog/category/${category.slug}`} className="hover:text-ink transition-colors">{category.name}</Link>
          </nav>
          <div className="mx-auto max-w-3xl space-y-5 text-center">
            <Link href={`/blog/category/${category.slug}`} className="eyebrow justify-center hover:text-brand-deep">{category.name}</Link>
            <h1 className="font-display text-[2.1rem] leading-[1.12] font-extrabold tracking-[-0.02em] text-ink sm:text-5xl">{post.title}</h1>
            <p className="text-lg sm:text-xl text-slate-600 leading-relaxed">{post.description}</p>
            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm text-slate-500">
              <Link href={author.url} className="font-medium text-ink hover:text-brand">{author.name}</Link>
              <span aria-hidden className="h-1 w-1 rounded-full bg-slate-300" />
              {updated ? (
                <span>
                  Updated <time dateTime={post.updatedAt}>{formatPostDate(post.updatedAt)}</time>
                </span>
              ) : (
                <time dateTime={post.publishedAt}>{formatPostDate(post.publishedAt)}</time>
              )}
              <span aria-hidden className="h-1 w-1 rounded-full bg-slate-300" />
              <span className="inline-flex items-center gap-1"><Clock className="h-4 w-4" /> {readingMinutes(post)} min read</span>
            </div>
          </div>
          <div className="mx-auto max-w-5xl">
            <PostArt post={post} size="hero" />
          </div>
        </header>

        <div className="public-container py-12 sm:py-16">
          <div className="mx-auto max-w-[44rem]">
            {/* Emergency line first on safety articles: someone may be reading this mid-crisis. */}
            {!isBlood && (
              <aside className="mb-8 flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50/70 p-4 text-[15px] leading-relaxed text-slate-700">
                <Phone className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
                <p>
                  <strong className="text-ink">In danger right now?</strong> Call <a href="tel:112" className="font-bold text-red-700 underline">112</a>.
                  For online fraud or cybercrime, call <a href="tel:1930" className="font-bold text-red-700 underline">1930</a> or report at{' '}
                  <a href="https://cybercrime.gov.in" target="_blank" rel="noopener noreferrer" className="font-semibold text-red-700 underline">cybercrime.gov.in</a>.
                </p>
              </aside>
            )}

            {toc.length >= 4 && (
              <details open className="group mb-10 rounded-2xl border border-slate-200 bg-mist/60 p-5 sm:p-6">
                <summary className="flex cursor-pointer list-none items-center gap-2 font-display text-lg font-bold text-ink">
                  <ListOrdered className="h-5 w-5 text-brand" /> On this page
                  <span className="ml-auto text-sm font-semibold text-slate-500 group-open:hidden">Show</span>
                </summary>
                <ol className="mt-4 space-y-2 text-[15px]">
                  {toc.map((t, i) => (
                    <li key={t.id} className="flex gap-3">
                      <span className="w-5 shrink-0 text-right font-semibold text-slate-400">{i + 1}.</span>
                      <a href={`#${t.id}`} className="text-slate-700 hover:text-brand hover:underline">{t.text}</a>
                    </li>
                  ))}
                </ol>
              </details>
            )}

            <ArticleBody blocks={post.body} />

            {post.faqs?.length ? (
              <section aria-labelledby="faqs" className="mt-14 space-y-5">
                <h2 id="faqs" className="font-display text-2xl sm:text-[1.7rem] font-bold tracking-tight text-ink scroll-mt-24">
                  Frequently asked questions
                </h2>
                <div className="divide-y divide-slate-200 rounded-2xl border border-slate-200">
                  {post.faqs.map((f) => (
                    <details key={f.question} className="group p-5 sm:p-6">
                      <summary className="flex cursor-pointer list-none items-start justify-between gap-4 font-semibold text-ink">
                        <h3 className="text-[17px] leading-snug">{f.question}</h3>
                        <span aria-hidden className="mt-0.5 text-xl leading-none text-slate-400 transition group-open:rotate-45">+</span>
                      </summary>
                      <p className="mt-3 text-[16px] leading-relaxed text-slate-700"><Inline text={f.answer} /></p>
                    </details>
                  ))}
                </div>
              </section>
            ) : null}

            {post.sources?.length ? (
              <section aria-labelledby="sources" className="mt-14 space-y-4">
                <h2 id="sources" className="font-display text-xl sm:text-2xl font-bold tracking-tight text-ink scroll-mt-24">
                  Sources and official resources
                </h2>
                <ul className="space-y-3">
                  {post.sources.map((s) => (
                    <li key={s.url} className="flex gap-3 text-[15px] leading-relaxed">
                      <ExternalLink className="mt-1 h-4 w-4 shrink-0 text-slate-400" />
                      <span>
                        <a href={s.url} target="_blank" rel="noopener noreferrer" className="font-medium text-brand hover:underline">{s.title}</a>
                        <span className="text-slate-500"> · {s.publisher}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {/* In-article CTA: product second, and only where it genuinely fits the topic. */}
            {isBlood ? (
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
            ) : (
              <div className="mt-14 rounded-3xl border border-brand/15 bg-gradient-to-br from-brand-tint via-white to-white p-7 sm:p-9 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand text-white"><ShieldCheck className="h-5 w-5" /></span>
                  <h2 className="font-display text-xl sm:text-2xl font-bold text-ink">Have help ready before you need it</h2>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Sabhijude is a free app for trusted contacts, SOS alerts with your live location, and reporting unsafe places and
                  behaviour, anonymously if you prefer.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href="/signup" className="btn-brand">Create a free account</Link>
                  <Link href="/about" className="btn-ghost">How Sabhijude works <ArrowRight className="h-4 w-4" /></Link>
                </div>
              </div>
            )}

            {/* Who wrote it and how it was checked: no invented reviewers or credentials. */}
            <div className="mt-10 space-y-4 border-t border-slate-200 pt-8">
              <div className="flex gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ink text-white"><BadgeCheck className="h-5 w-5" /></span>
                <div className="space-y-1.5 text-[15px] leading-relaxed">
                  <p className="font-semibold text-ink">
                    Written by <Link href={author.url} className="hover:text-brand">{author.name}</Link>
                    {post.reviewedBy && (
                      <span className="font-normal text-slate-600">
                        {' '}· Reviewed by {post.reviewedBy.name}, {post.reviewedBy.credential}
                      </span>
                    )}
                  </p>
                  <p className="text-slate-600">{author.bio}</p>
                  <p className="text-slate-500">
                    Published {formatPostDate(post.publishedAt)}
                    {updated && <> · Last updated {formatPostDate(post.updatedAt)}</>}
                    {' '}· Spotted something out of date?{' '}
                    <Link href="/feedback" className="font-medium text-brand hover:underline">Tell us</Link>.
                  </p>
                </div>
              </div>
              <Disclaimer blood={isBlood} />
            </div>
          </div>
        </div>
      </article>

      {/* Related */}
      <section className="bg-mist py-16 sm:py-20">
        <div className="public-container space-y-10">
          <div className="flex items-end justify-between gap-4">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink">Keep reading</h2>
            <Link href={`/blog/category/${category.slug}`} className="text-sm font-semibold text-brand hover:text-brand-deep inline-flex items-center gap-1">
              More in {category.name} <ArrowRight className="h-4 w-4" />
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
