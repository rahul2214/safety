import React from 'react';
import Link from 'next/link';
import { BLOG_POSTS, CATEGORIES, type CategorySlug } from '@/lib/blog-posts';

/** Category chips. Only categories that have published articles are shown, so no chip leads to an empty page. */
export function CategoryNav({ active }: { active?: CategorySlug }) {
  const counts = new Map<string, number>();
  BLOG_POSTS.forEach((p) => counts.set(p.category, (counts.get(p.category) ?? 0) + 1));
  const cats = CATEGORIES.filter((c) => counts.has(c.slug));

  const chip = (on: boolean) =>
    `inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold transition ${
      on ? 'border-ink bg-ink text-white' : 'border-slate-200 bg-white text-slate-700 hover:border-ink/40 hover:text-ink'
    }`;

  return (
    <nav aria-label="Blog categories" className="flex flex-wrap gap-2">
      <Link href="/blog" className={chip(!active)} aria-current={!active ? 'page' : undefined}>
        All <span className="opacity-60">{BLOG_POSTS.length}</span>
      </Link>
      {cats.map((c) => (
        <Link
          key={c.slug}
          href={`/blog/category/${c.slug}`}
          className={chip(active === c.slug)}
          aria-current={active === c.slug ? 'page' : undefined}
        >
          {c.name} <span className="opacity-60">{counts.get(c.slug)}</span>
        </Link>
      ))}
    </nav>
  );
}
