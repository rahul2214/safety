'use client';

import React, { useState } from'react';
import { useRouter } from'next/navigation';
import {
  Heart,
  MessageSquare,
  Users,
  EyeOff,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Sparkles,
  Share2,
  MapPin,
} from'lucide-react';
import { api } from '@/lib/api-client';
import { useAuth } from'@/lib/auth-context';
import { useToast } from'@/components/Toast';

export interface PostItem {
  id: number;
  uuid?: string;
  authorName?: string;
  isAnonymous?: boolean;
  category?: string;
  categoryName?: string;
  categoryId?: number;
  content: string;
  timeAgo?: string;
  createdAt?: string;
  incidentDateTime?: string;
  location?: string;
  severity?: 'CONCERNING' | 'ADVICE_NEEDED' | 'CRITICAL' | 'RESOLVED' | string;
  status?: string;
  postSeverityId?: number;
  postStatusId?: number;
  postVisibilityId?: number;
  supportCount?: number;
  similarCount?: number;
  facedThisCount?: number;
  solutionCount?: number;
  solutionsCount?: number;
  hasSupported?: boolean;
  hasFacedThis?: boolean;
  riskScore?: number;
  safetyAdvice?: string;
}

export function getCategoryName(category: any): string {
  if (!category) return'General Safety';
  if (typeof category === 'string') return category;
  if (typeof category === 'object') {
  if (typeof category.name === 'string' && category.name) return category.name;
  if (typeof category.title === 'string' && category.title) return category.title;
  }
  return'General Safety';
}

export function getAuthorName(post: any): string {
  if (post?.isAnonymous) return'Anonymous';
  if (typeof post?.authorName === 'string' && post.authorName.trim()) {
  return post.authorName.trim();
  }
  if (typeof post?.author === 'object' && post.author) {
  if (typeof post.author.displayName === 'string' && post.author.displayName.trim()) {
  return post.author.displayName.trim();
  }
  }
  return'Community Member';
}

export function parseUtcDate(dateStr?: string): Date | null {
  if (!dateStr) return null;
  const s = String(dateStr).trim();
  const hasTz = s.endsWith('Z') || s.endsWith('z') || /[+-]\d{2}:?\d{2}$/.test(s);
  const normalized = hasTz ? s : `${s}Z`;
  const parsed = new Date(normalized);
  if (!isNaN(parsed.getTime())) return parsed;
  const fallback = new Date(s);
  return isNaN(fallback.getTime()) ? null : fallback;
}

export function formatTimeAgo(dateStr?: string): string {
  if (!dateStr) return 'Recently';
  try {
    const d = parseUtcDate(dateStr);
    if (!d || isNaN(d.getTime())) return 'Recently';
    const diffMs = Date.now() - d.getTime();
    if (diffMs < 0) return 'Just now';
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 30) return `${diffDays}d ago`;
    return d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return 'Recently';
  }
}

export function formatIncidentDate(dateStr?: string): string {
  if (!dateStr) return '';
  try {
    const d = parseUtcDate(dateStr);
    if (!d || isNaN(d.getTime())) return '';
    return d.toLocaleString('en-IN', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return '';
  }
}

export function PostCard({ post }: { post: PostItem }) {
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const openPost = () => {
    if (post.uuid) router.push(`/posts/${post.uuid}`);
  };

  const isAnon = post.isAnonymous ?? false;
  const displayName = getAuthorName(post);
  const avatarLetter = (displayName === 'Anonymous' ? 'A' : displayName).charAt(0).toUpperCase() || 'C';

  const categoryName = getCategoryName(post.category || (post as any).categoryName);
  const displayTime = post.timeAgo || (post.createdAt ? formatTimeAgo(post.createdAt) : 'Recently');

  const initialSupport: number = post.supportCount ?? 0;
  const initialSimilar: number = post.similarCount ?? (post as any).similarExperienceCount ?? post.facedThisCount ?? 0;
  const initialSolutions: number = post.solutionCount ?? post.solutionsCount ?? 0;

  const [supported, setSupported] = useState<boolean>(post.hasSupported || false);
  const [supportCount, setSupportCount] = useState<number>(initialSupport);
  const [facedThis, setFacedThis] = useState<boolean>(post.hasFacedThis || (post as any).hasFacedThisToo || false);
  const [similarCount, setSimilarCount] = useState<number>(initialSimilar);
  const [isTogglingSupport, setIsTogglingSupport] = useState<boolean>(false);
  const [isTogglingFacedThis, setIsTogglingFacedThis] = useState<boolean>(false);

  const toggleSupport = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      showToast('Please sign in to support community incident reports.', 'info');
      return;
    }
    if (isTogglingSupport || !post.uuid) return;
    setIsTogglingSupport(true);

    const nextVal = !supported;
    setSupported(nextVal);
    setSupportCount((c: number) => Math.max(0, nextVal ? c + 1 : c - 1));

    try {
      const res = await api.supportPost(post.uuid);
      if (!res.ok) {
        showToast(res.error || 'Could not update support.', 'error');
        setSupported(!nextVal);
        setSupportCount((c: number) => Math.max(0, !nextVal ? c + 1 : c - 1));
      } else if (res && res.data) {
        const d = res.data as any;
        if (typeof d.supported === 'boolean') setSupported(d.supported);
        if (typeof d.supportCount === 'number') setSupportCount(d.supportCount);
        else if (typeof d.count === 'number') setSupportCount(d.count);
      }
    } catch (err) {
      console.warn('Failed to persist support to DB:', err);
      setSupported(!nextVal);
      setSupportCount((c: number) => Math.max(0, !nextVal ? c + 1 : c - 1));
    } finally {
      setIsTogglingSupport(false);
    }
  };

  const toggleFacedThis = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      showToast('Please sign in to react to community incidents.', 'info');
      return;
    }
    if (isTogglingFacedThis || !post.uuid) return;
    setIsTogglingFacedThis(true);

    const nextVal = !facedThis;
    setFacedThis(nextVal);
    setSimilarCount((c: number) => Math.max(0, nextVal ? c + 1 : c - 1));

    try {
      const res = await api.facedThisPost(post.uuid);
      if (!res.ok) {
        showToast(res.error || 'Could not update reaction.', 'error');
        setFacedThis(!nextVal);
        setSimilarCount((c: number) => Math.max(0, !nextVal ? c + 1 : c - 1));
      } else if (res && res.data) {
        const d = res.data as any;
        if (typeof d.faced === 'boolean') setFacedThis(d.faced);
        if (typeof d.count === 'number') setSimilarCount(d.count);
      }
    } catch (err) {
      console.warn('Failed to persist faced-this to DB:', err);
      setFacedThis(!nextVal);
      setSimilarCount((c: number) => Math.max(0, !nextVal ? c + 1 : c - 1));
    } finally {
      setIsTogglingFacedThis(false);
    }
  };

  const isResolved = post.severity === 'RESOLVED';
  const isUrgent = post.severity === 'CRITICAL';
  const isConcerning = post.severity === 'CONCERNING';

  // Severity 4px stripe on leading edge (Matching mobile-app PostCard STRIPE_WIDTH)
  const stripeColor = isUrgent
  ? 'border-l-[#e11d48]'
  : isConcerning
  ? 'border-l-[#d97706]'
  : isResolved
  ? 'border-l-[#059669]'
  : 'border-l-[#0891b2]';

  // Severity chip (Matching mobile-app SoftChip / headline tone)
  const severityChip = isUrgent ? (
  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10.5px] font-black uppercase tracking-wider bg-[#ffe4e6] text-[#e11d48]">
  <AlertTriangle className="h-3 w-3" /> URGENT
  </span>
  ) : isConcerning ? (
  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10.5px] font-black uppercase tracking-wider bg-[#fef3c7] text-[#d97706]">
  <Clock className="h-3 w-3" /> CONCERNING
  </span>
  ) : isResolved ? (
  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10.5px] font-black uppercase tracking-wider bg-[#d1fae5] text-[#059669]">
  <CheckCircle2 className="h-3 w-3" /> SOLVED
  </span>
  ) : (
  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10.5px] font-black uppercase tracking-wider bg-[#ecfeff] text-[#0891b2]">
  OPEN
  </span>
  );

  return (
  <>
  <article
  onClick={openPost}
  onKeyDown={(e) => {
  if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) {
  e.preventDefault();
  openPost();
  }
  }}
  role="link"
  tabIndex={0}
  aria-label={`Open post: ${post.content.slice(0, 60)}`}
  className={`relative bg-white rounded-[20px] border border-slate-200 border-l-4 ${stripeColor} p-4 sm:p-5 space-y-3.5 shadow-xs hover:shadow-md transition-all cursor-pointer group`}
  >
  {/* 1. Author row */}
  <div className="flex items-center justify-between">
  <div className="flex items-center gap-2.5">
  {/* 36px Avatar */}
  <div className="w-9 h-9 rounded-full bg-brand-tint text-brand flex items-center justify-center font-bold text-sm shrink-0">
  {isAnon ? (
  <EyeOff className="h-4 w-4" />
  ) : (
  avatarLetter
  )}
  </div>

  <div>
  <div className="flex items-center gap-1.5">
  <span className="font-semibold text-ink text-[14px]">
  {displayName}
  </span>
  {isAnon && (
  <span className="text-[10px] font-semibold text-brand bg-brand-tint px-2 py-0.5 rounded-full">
  Private
  </span>
  )}
  </div>
  <p className="text-[11.5px] text-slate-400">{displayTime}</p>
  </div>
  </div>

  <div>{severityChip}</div>
  </div>

  {/* 2. Post content (line-clamped with 15px leading-21px Stitch spec) */}
  <p className="text-[15px] text-ink leading-[21px] font-normal line-clamp-4">
  {post.content}
  </p>

  {/* 3. Chip row (Category, Solved/Open status) */}
  <div className="flex flex-wrap items-center gap-2 pt-0.5">
  <span className="text-[12px] font-bold text-brand bg-brand-tint px-3 py-1 rounded-full">
  {categoryName}
  </span>

  <span
  className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
  isResolved ? 'bg-[#ecfdf5] text-[#059669]' : 'bg-[#ecfeff] text-[#0891b2]'
  }`}
  >
  {isResolved ? '✓ Solved' : '● Open'}
  </span>

  {post.location && (
  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full">
  <MapPin className="h-3 w-3 text-rose-500 shrink-0" />
  <span className="max-w-[150px] truncate">{post.location}</span>
  </span>
  )}

  {post.incidentDateTime && (
  <span
    className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full"
    title={`Incident date: ${formatIncidentDate(post.incidentDateTime)}`}
  >
  <Clock className="h-3 w-3 text-indigo-500 shrink-0" />
  <span>Incident: {formatIncidentDate(post.incidentDateTime)}</span>
  </span>
  )}

  {post.safetyAdvice && (
  <div className="w-full mt-1 p-2.5 rounded-[12px] bg-blue-50 border border-blue-200 flex items-start gap-1.5 text-xs text-blue-700">
  <Sparkles className="h-3.5 w-3.5 shrink-0 mt-0.5" />
  <span>
  <strong>Safety Guidance:</strong> {post.safetyAdvice}
  </span>
  </div>
  )}
  </div>

  {/* 4. Hairline divider & Interactions Footer */}
  <div className="pt-2.5 border-t border-slate-200 flex items-center justify-between text-[13px] text-slate-600">
  <div className="flex flex-wrap items-center gap-3 sm:gap-4">
  {/* Heart / Support */}
  <button
  type="button"
  disabled={isTogglingSupport}
  onClick={toggleSupport}
  title="Support this report"
  aria-label={`Support this report: ${supportCount} supports`}
  className={`flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-60 ${
  supported ? 'text-coral font-bold' : 'hover:text-ink'
  }`}
  >
  <Heart
  className={`h-4 w-4 ${supported ? 'fill-coral text-coral' : ''}`}
  />
  <span>{supportCount}</span>
  </button>

  {/* Faced This Too */}
  <button
  type="button"
  disabled={isTogglingFacedThis}
  onClick={toggleFacedThis}
  title="I faced this incident too"
  aria-label={`I faced this too: ${similarCount} people faced this`}
  className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs transition-colors cursor-pointer disabled:opacity-60 ${
  facedThis ? 'bg-brand-tint text-brand font-bold border border-brand/30' : 'hover:text-ink hover:bg-slate-100'
  }`}
  >
  <Users className={`h-3.5 w-3.5 ${facedThis ? 'text-brand' : ''}`} />
  <span>{similarCount} faced this</span>
  </button>
  </div>

  {/* Solutions count (whole card opens the post page) */}
  <div className="flex items-center gap-1.5 text-[#0891b2] font-semibold group-hover:underline">
  <MessageSquare className="h-4 w-4" />
  <span>
  {initialSolutions} {initialSolutions === 1 ? 'solution' : 'solutions'}
  </span>
  </div>
  </div>
  </article>
  </>
  );
}
