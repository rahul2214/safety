import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, Clock } from 'lucide-react';
import { formatPostDate, getCategory, readingMinutes, type BlogPost } from '@/lib/blog-posts';

const ART = {
  red: 'from-red-600 via-rose-500 to-coral text-white',
  blue: 'from-brand-deep via-brand to-sky-400 text-white',
  coral: 'from-coral-tint via-white to-rose-100 text-red-700',
  ink: 'from-ink via-ink-soft to-brand-deep text-white',
} as const;

/** Typographic cover art: no stock photos, so every card looks consistent and loads instantly. */
export function PostArt({ post, size = 'card' }: { post: BlogPost; size?: 'card' | 'hero' }) {
  const hero = size === 'hero';
  return (
    <div className={`relative overflow-hidden bg-gradient-to-br ${ART[post.accent]} ${hero ? 'rounded-[2rem] aspect-[21/9]' : 'rounded-2xl aspect-[16/10]'}`}>
      <div aria-hidden className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/15 blur-2xl" />
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(currentColor_1px,transparent_1px)] [background-size:18px_18px] opacity-[0.12]" />
      {/* a soft drop motif */}
      <svg aria-hidden viewBox="0 0 100 130" className={`absolute opacity-20 ${hero ? 'right-[6%] bottom-[-10%] h-[95%]' : 'right-[-4%] bottom-[-14%] h-[90%]'}`}>
        <path d="M50 4 C 30 40, 8 62, 8 86 a42 42 0 0 0 84 0 C 92 62, 70 40, 50 4 Z" fill="currentColor" />
      </svg>
      <div className={`absolute inset-0 flex flex-col justify-between ${hero ? 'p-8 sm:p-12' : 'p-5'}`}>
        <span className={`self-start rounded-full bg-white/20 backdrop-blur px-3 py-1 font-semibold ${hero ? 'text-sm' : 'text-[11px]'} ${post.accent === 'coral' ? 'bg-white/70' : ''}`}>
          {getCategory(post.category)?.name}
        </span>
        <span className={`font-display font-extrabold tracking-tight leading-none ${hero ? 'text-6xl sm:text-8xl' : 'text-5xl'}`}>{post.art}</span>
      </div>
    </div>
  );
}

export function BlogPostCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group flex flex-col gap-4 rounded-3xl p-2 -m-2 transition hover:bg-mist/70 focus-visible:outline-2 focus-visible:outline-brand">
      <div className="transition-transform duration-300 group-hover:-translate-y-0.5">
        <PostArt post={post} />
      </div>
      <div className="space-y-2 px-1">
        <div className="flex items-center gap-3 text-[13px] text-slate-500">
          <time dateTime={post.updatedAt}>{formatPostDate(post.updatedAt)}</time>
          <span aria-hidden className="h-1 w-1 rounded-full bg-slate-300" />
          <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {readingMinutes(post)} min read</span>
        </div>
        <h3 className="font-display text-xl font-bold leading-snug tracking-tight text-ink group-hover:text-brand transition-colors">
          {post.title}
          <ArrowUpRight className="ml-1 inline h-4 w-4 opacity-0 -translate-y-0.5 transition group-hover:opacity-100" aria-hidden />
        </h3>
        <p className="text-[15px] leading-relaxed text-slate-600">{post.description}</p>
      </div>
    </Link>
  );
}
