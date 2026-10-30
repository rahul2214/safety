'use client';

import React, { useState, useEffect } from'react';
import Link from'next/link';
import { Compass, TrendingUp, BookOpen, ArrowUpRight, ArrowLeft, Loader2 } from'lucide-react';
import { api, type Category } from'@/lib/api-client';
import { TopicCardSkeleton } from'@/components/ui/Skeleton';

const CATEGORY_ICONS: Record<string, string> = {
  'harassment': '🚨',
  'stalking': '👁️',
  'threat': '⚠️',
  'unsafe location': '📍',
  'cyber harassment': '💻',
  'workplace issue': '💼',
  'college/university issue': '🎓',
  'domestic/social issue': '🏠',
  'immediate danger / emergency': '🆘',
  'other safety concern': '🛡️',
  // Backward compatibility
  'harassment & stalking': '🚨',
  'workplace issues': '💼',
  'campus & college life': '🎓',
  'school safety': '🎒',
  'cyber safety': '💻',
  'public transport': '🚌',
  'domestic & family': '🏠',
  'general': '⭐',
};

const SAFETY_TIPS = [
  {
  title: 'The"Two Turns"Verification Rule',
  desc: 'If you suspect someone is following your car or walking pace, make two consecutive right turns. If they mirror both, you have verified intentional pursuit. Head immediately into a lit commercial store.',
  readTime: '2 min read',
  },
  {
  title: 'Discreet Audio Presence',
  desc: 'Holding your phone to your ear and speaking with clear energy ("Hey Dad, I am right outside your building") deters opportunistic approaches.',
  readTime: '3 min read',
  },
  {
  title: 'Metro & Bus Positioning',
  desc: 'When traveling past 8pm, stay near the conductor, driver cabin, or in clear view of the passenger emergency communications system.',
  readTime: '2 min read',
  },
];

export default function DiscoverPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
  setLoading(true);
  setError(null);
  try {
  const res = await api.getCategories();
  if (res.ok && res.data) {
  setCategories(res.data);
  } else if (!res.ok) {
  setError(res.error || 'Failed to load safety topics from database.');
  setCategories([]);
  }
  } catch (e: any) {
  console.warn('Error loading categories:', e);
  setError(e?.message || 'Unable to connect to backend database.');
  setCategories([]);
  } finally {
  setLoading(false);
  }
  };

  useEffect(() => {
  loadData();
  }, []);

  const filteredTopics = categories.filter((t) =>
  t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  (t.description && t.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
  <div className="space-y-6 max-w-4xl mx-auto select-none pb-8">
  {/* Header */}
  <div>
  <Link
  href="/"
  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5b5b6e] hover:text-[#16161d] mb-2 transition"
  >
  <ArrowLeft className="h-4 w-4" />
  Back to Feed
  </Link>
  <h1 className="text-[24px] font-black tracking-[-0.5px] leading-[30px] text-[#16161d]">
  Discover Topics
  </h1>
  <p className="text-[13px] text-[#5b5b6e] mt-0.5">
  Browse verified community reports, safety advisories, and prevention playbooks.
  </p>
  </div>

  {/* Backend Connection Error */}
  {error && (
  <div className="p-6 text-center bg-red-50 border border-red-200 rounded-[18px] space-y-3">
  <p className="text-sm font-bold text-red-900">Backend Connection Error</p>
  <p className="text-xs text-red-700">{error}</p>
  <button
  onClick={loadData}
  className="px-4 py-2 rounded-[12px] bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition shadow-xs"
  >
  Retry Connection
  </button>
  </div>
  )}

  {/* Search Input */}
  <div>
  <input
  type="text"
  placeholder="Search safety topics (e.g. Metro, Hostel, Stalking)..."
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
  className="w-full h-11 bg-white border border-[#e8e8f0] rounded-[14px] px-4 text-[14px] text-[#16161d] placeholder-[#9797ab] focus:outline-none focus:border-[#6d4aff] transition shadow-sm"
  />
  </div>

  {/* Topic Grid */}
  <section className="space-y-3">
  <h2 className="text-[14px] font-black uppercase text-[#5b5b6e] tracking-[1px]">
  ACTIVE TOPICS
  </h2>
  {loading ? (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
  {[1, 2, 3, 4, 5, 6].map((i) => (
  <TopicCardSkeleton key={i} />
  ))}
  </div>
  ) : error ? null : (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
  {filteredTopics.map((topic) => (
  <Link
  key={topic.id}
  href="/"
  className="p-4 rounded-[16px] bg-white border border-[#e8e8f0] hover:border-[#6d4aff] transition shadow-sm flex items-center justify-between group"
  >
  <div className="flex items-center gap-3">
  <span className="text-xl">
  {CATEGORY_ICONS[topic.name.toLowerCase()] || '🛡️'}
  </span>
  <div>
  <h4 className="text-[14px] font-bold text-[#16161d] group-hover:text-[#6d4aff] transition-colors">
  {topic.name}
  </h4>
  <p className="text-[11.5px] text-[#5b5b6e] line-clamp-1">
  {topic.description || 'Verified safety sector'}
  </p>
  </div>
  </div>
  <ArrowUpRight className="h-4 w-4 text-[#9797ab] group-hover:text-[#6d4aff] transition-colors" />
  </Link>
  ))}
  </div>
  )}
  </section>

  {/* Verified Safety Guides */}
  <section className="space-y-3 pt-3">
  <h2 className="text-[14px] font-black uppercase text-[#5b5b6e] tracking-[1px]">
  SAFETY PLAYBOOKS
  </h2>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
  {SAFETY_TIPS.map((tip, i) => (
  <div
  key={i}
  className="p-5 rounded-[18px] bg-white border border-[#e8e8f0] shadow-sm space-y-2 flex flex-col justify-between"
  >
  <div className="space-y-1.5">
  <h3 className="text-[14.5px] font-bold text-[#16161d]">
  {tip.title}
  </h3>
  <p className="text-[13px] text-[#5b5b6e] leading-[19px]">
  {tip.desc}
  </p>
  </div>
  <span className="text-[11px] font-semibold text-[#6d4aff] pt-2">
  {tip.readTime}
  </span>
  </div>
  ))}
  </div>
  </section>
  </div>
  );
}
