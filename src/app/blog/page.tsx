import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Clock, Droplet } from 'lucide-react';
import { JsonLd } from '@/components/seo/JsonLd';
import { getBreadcrumbSchema } from '@/lib/seo-schemas';
import { BLOG_POSTS, formatPostDate } from '@/lib/blog-posts';
import { BlogPostCard, PostArt } from '@/components/blog/PostCard';

export const metadata: Metadata = {
  title: 'Blog: Blood Donation, Safety & Community',
  description:
    'Stories, guides and product updates from Sabhijude: blood requests, first-time donation, blood group compatibility and community safety.',
  alternates: { canonical: '/blog' },
  openGraph: {
    title: 'The Sabhijude Blog',
    description: 'Guides and updates on blood donation, community support and personal safety.',
    url: '/blog',
    type: 'website',
  },
};

export default function BlogIndexPage() {
  const [featured, ...rest] = BLOG_POSTS;
  const breadcrumbs = getBreadcrumbSchema([
    { name: 'Home', item: '/' },
    { name: 'Blog', item: '/blog' },
  ]);

  return (
    <div className="bg-white">
      <JsonLd data={breadcrumbs} />

      {/* Header */}
      <section className="relative overflow-hidden border-b border-slate-200/70">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 right-[-8%] h-[420px] w-[420px] rounded-full bg-coral/10 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(#0b16300d_1px,transparent_1px)] [background-size:22px_22px] [mask-image:linear-gradient(to_bottom,black,transparent_80%)]" />
        </div>
        <div className="public-container relative py-16 sm:py-20">
          <div className="max-w-3xl space-y-5">
            <span className="eyebrow"><span className="h-px w-6 bg-brand" />The Sabhijude blog</span>
            <h1 className="display-1">Stories of people helping people.</h1>
            <p className="text-lg sm:text-xl text-slate-600 leading-relaxed">
              Guides on blood donation and community safety, plus what&rsquo;s new in Sabhijude. Written plainly, checked carefully.
            </p>
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="public-container py-14 sm:py-16">
        <Link href={`/blog/${featured.slug}`} className="group grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-7 transition-transform duration-300 group-hover:-translate-y-0.5">
            <PostArt post={featured} />
          </div>
          <div className="lg:col-span-5 space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-600">
              <Droplet className="h-3.5 w-3.5" /> New feature
            </span>
            <h2 className="display-2 group-hover:text-brand transition-colors">{featured.title}</h2>
            <p className="text-lg text-slate-600 leading-relaxed">{featured.description}</p>
            <div className="flex items-center gap-3 text-sm text-slate-500">
              <time dateTime={featured.date}>{formatPostDate(featured.date)}</time>
              <span aria-hidden className="h-1 w-1 rounded-full bg-slate-300" />
              <span className="inline-flex items-center gap-1"><Clock className="h-4 w-4" /> {featured.readMinutes} min read</span>
            </div>
            <span className="inline-flex items-center gap-2 font-semibold text-brand">
              Read the story <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </Link>
      </section>

      {/* All posts */}
      <section className="public-container pb-20 sm:pb-28 space-y-8">
        <div className="flex items-end justify-between gap-4 border-t border-slate-200 pt-10">
          <h2 className="font-display text-2xl font-bold text-ink">More to read</h2>
          <span className="text-sm text-slate-500">{BLOG_POSTS.length} articles</span>
        </div>
        <div className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((p) => (
            <BlogPostCard key={p.slug} post={p} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="pb-24 sm:pb-32">
        <div className="public-container">
          <div className="relative overflow-hidden rounded-[2rem] bg-ink p-8 sm:p-14 text-white grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div aria-hidden className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-red-500/25 blur-3xl" />
            <div className="relative lg:col-span-8 space-y-3">
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight">Someone nearby may need your blood group today.</h2>
              <p className="text-white/70 text-lg">See how blood requests work, and how you can help.</p>
            </div>
            <div className="relative lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 lg:items-end">
              <Link href="/blood-donation" className="btn-sos">Blood requests <ArrowRight className="h-4 w-4" /></Link>
              <Link href="/signup" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 px-6 py-3.5 text-sm font-semibold text-white hover:bg-white/10 transition">
                Create free account
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
