'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowUpRight, CheckCircle2, Hash, Search, TrendingUp } from 'lucide-react';
import { api, type DiscoverFeed } from '@/lib/api-client';
import { PostCard, type PostItem, getCategoryName } from '@/components/PostCard';
import { TopicCardSkeleton } from '@/components/ui/Skeleton';

const CATEGORY_ICONS: Record<string, string> = {
  harassment: '🚨',
  stalking: '👁️',
  threat: '⚠️',
  'unsafe location': '📍',
  'cyber harassment': '💻',
  'workplace issue': '💼',
  'college/university issue': '🎓',
  'domestic/social issue': '🏠',
  'immediate danger / emergency': '🆘',
  'other safety concern': '🛡️',
  ragging: '🎓',
};

/** The feed's post shape, from the API's. Same mapping the feed itself uses. */
function toPostItem(item: any): PostItem {
  return {
    ...item,
    uuid: item.uuid || item.Uuid || '',
    categoryId: item.categoryId || item.category_id || item.category?.id,
    categoryName: getCategoryName(item.category || item.categoryName),
  };
}

/**
 * Discover: what the community is talking about right now. Same data as the mobile app's
 * Discover tab — trending reports, topics with live counts, resolved stories and hashtags.
 */
export default function DiscoverPage() {
  const router = useRouter();
  const [data, setData] = useState<DiscoverFeed | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  const load = async () => {
    setLoading(true);
    setError(null);
    const res = await api.getDiscover();
    if (res.ok && res.data) setData(res.data);
    else setError(res.error || 'Could not load Discover.');
    setLoading(false);
  };

  useEffect(() => {
    void load();
  }, []);

  // Busiest topics first, so the grid leads with where the conversation is.
  const topics = useMemo(
    () => [...(data?.topics ?? [])].sort((a, b) => b.postCount - a.postCount),
    [data]
  );
  const trending = useMemo(() => (data?.trending ?? []).map(toPostItem), [data]);
  const stories = useMemo(() => (data?.successStories ?? []).map(toPostItem), [data]);
  const hashtags = data?.trendingHashtags ?? [];

  const search = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (q) router.push(`/feed?q=${encodeURIComponent(q)}`);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-8">
      <div>
        <Link
          href="/feed"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-ink mb-2 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to feed
        </Link>
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-[-0.02em] text-ink">Discover</h1>
        <p className="text-[13px] text-slate-600 mt-0.5">
          What the community is reporting, and the cases that ended well.
        </p>
      </div>

      <form onSubmit={search} role="search" className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <label htmlFor="discover-search" className="sr-only">
          Search posts
        </label>
        <input
          id="discover-search"
          type="search"
          placeholder="Search posts, places and topics"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full h-11 bg-white border border-slate-200 rounded-[14px] pl-10 pr-4 text-[14px] text-ink placeholder-slate-400 focus:outline-none focus:border-brand transition shadow-sm"
        />
      </form>

      {error && (
        <div className="p-6 text-center bg-red-50 border border-red-200 rounded-[18px] space-y-3">
          <p className="text-sm font-bold text-red-900">Discover could not be loaded</p>
          <p className="text-xs text-red-700">{error}</p>
          <button
            onClick={load}
            className="px-4 py-2 rounded-[12px] bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition"
          >
            Try again
          </button>
        </div>
      )}

      <section className="space-y-3">
        <h2 className="text-[13px] font-black uppercase text-slate-600 tracking-[1px]">Topics</h2>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <TopicCardSkeleton key={i} />
            ))}
          </div>
        ) : topics.length === 0 ? (
          !error && <p className="text-sm text-slate-500">No topics yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {topics.map((topic) => (
              <Link
                key={topic.categoryId}
                href={`/feed?category=${topic.categoryId}`}
                className="p-4 rounded-[16px] bg-white border border-slate-200 hover:border-brand transition shadow-sm flex items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xl" aria-hidden>
                    {CATEGORY_ICONS[topic.name.toLowerCase()] || '🛡️'}
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-[14px] font-bold text-ink group-hover:text-brand transition-colors truncate">
                      {topic.name}
                    </h3>
                    <p className="text-[11.5px] text-slate-500">
                      {topic.postCount === 0
                        ? 'No posts yet'
                        : `${topic.postCount} post${topic.postCount === 1 ? '' : 's'}`}
                    </p>
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-400 group-hover:text-brand transition-colors" />
              </Link>
            ))}
          </div>
        )}
      </section>

      {hashtags.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-[13px] font-black uppercase text-slate-600 tracking-[1px]">Trending tags</h2>
          <div className="flex flex-wrap gap-2">
            {hashtags.map((tag) => (
              <Link
                key={tag.id}
                href={`/feed?q=${encodeURIComponent('#' + tag.name)}`}
                className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-ink hover:border-brand hover:text-brand transition"
              >
                <Hash className="h-3 w-3" />
                {tag.name}
                <span className="text-slate-400 font-normal">{tag.usageCount}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {!loading && trending.length > 0 && (
        <section className="space-y-3">
          <h2 className="flex items-center gap-2 text-[13px] font-black uppercase text-slate-600 tracking-[1px]">
            <TrendingUp className="h-4 w-4" /> Trending now
          </h2>
          <div className="space-y-3">
            {trending.map((post) => (
              <PostCard key={post.uuid || post.id} post={post} />
            ))}
          </div>
        </section>
      )}

      {!loading && stories.length > 0 && (
        <section className="space-y-3">
          <h2 className="flex items-center gap-2 text-[13px] font-black uppercase text-slate-600 tracking-[1px]">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Resolved with community help
          </h2>
          <div className="space-y-3">
            {stories.map((post) => (
              <PostCard key={post.uuid || post.id} post={post} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
