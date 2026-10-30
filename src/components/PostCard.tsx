'use client';

import React, { useState } from'react';
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
import { api } from'@/lib/api-client';
import { useAuth } from'@/lib/auth-context';
import { useToast } from'@/components/Toast';
import { PostDetailModal } from'@/components/PostDetailModal';

export interface PostItem {
  id: number;
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
  hashtags?: string[];
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

function formatTimeAgo(dateStr?: string): string {
  if (!dateStr) return'Recently';
  try {
  const time = new Date(dateStr).getTime();
  if (isNaN(time)) return'Recently';
  const diffMs = Date.now() - time;
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return'Just now';
  if (diffMins < 60) return`${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return`${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return`${diffDays}d ago`;
  } catch {
  return'Recently';
  }
}

export function PostCard({ post }: { post: PostItem }) {
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();

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
  const [detailOpen, setDetailOpen] = useState(false);

  const toggleSupport = async (e: React.MouseEvent) => {
  e.stopPropagation();
  if (!isAuthenticated) {
  showToast('Please sign in to support community incident reports.', 'info');
  return;
  }
  const nextVal = !supported;
  setSupported(nextVal);
  setSupportCount((c: number) => Math.max(0, nextVal ? c + 1 : c - 1));

  try {
  await api.supportPost(post.id);
  } catch (err) {
  console.warn('Failed to persist support to DB:', err);
  setSupported(!nextVal);
  setSupportCount((c: number) => Math.max(0, !nextVal ? c + 1 : c - 1));
  }
  };

  const toggleFacedThis = async (e: React.MouseEvent) => {
  e.stopPropagation();
  if (!isAuthenticated) {
  showToast('Please sign in to react to community incidents.', 'info');
  return;
  }
  const nextVal = !facedThis;
  setFacedThis(nextVal);
  setSimilarCount((c: number) => Math.max(0, nextVal ? c + 1 : c - 1));

  try {
  await api.facedThisPost(post.id);
  } catch (err) {
  console.warn('Failed to persist faced-this to DB:', err);
  setFacedThis(!nextVal);
  setSimilarCount((c: number) => Math.max(0, !nextVal ? c + 1 : c - 1));
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
  onClick={() => setDetailOpen(true)}
  className={`relative bg-white rounded-[20px] border border-[#e8e8f0] border-l-4 ${stripeColor} p-4 sm:p-5 space-y-3.5 shadow-xs hover:shadow-md transition-all cursor-pointer group`}
  >
  {/* 1. Author row */}
  <div className="flex items-center justify-between">
  <div className="flex items-center gap-2.5">
  {/* 36px Avatar */}
  <div className="w-9 h-9 rounded-full bg-[#f1edff] text-[#6d4aff] flex items-center justify-center font-bold text-sm shrink-0">
  {isAnon ? (
  <EyeOff className="h-4 w-4" />
  ) : (
  avatarLetter
  )}
  </div>

  <div>
  <div className="flex items-center gap-1.5">
  <span className="font-semibold text-[#16161d] text-[14px]">
  {displayName}
  </span>
  {isAnon && (
  <span className="text-[10px] font-semibold text-[#6d4aff] bg-[#f1edff] px-2 py-0.5 rounded-full">
  Private
  </span>
  )}
  </div>
  <p className="text-[11.5px] text-[#9797ab]">{displayTime}</p>
  </div>
  </div>

  <div>{severityChip}</div>
  </div>

  {/* 2. Post content (line-clamped with 15px leading-21px Stitch spec) */}
  <p className="text-[15px] text-[#16161d] leading-[21px] font-normal line-clamp-4">
  {post.content}
  </p>

  {/* 3. Chip row (Category, Solved/Open status, hashtags) */}
  <div className="flex flex-wrap items-center gap-2 pt-0.5">
  <span className="text-[12px] font-bold text-[#6d4aff] bg-[#f1edff] px-3 py-1 rounded-full">
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
  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full">
  <Clock className="h-3 w-3 text-indigo-500 shrink-0" />
  <span>
  {new Date(post.incidentDateTime).toLocaleDateString(undefined, {
  month: 'short',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  })}
  </span>
  </span>
  )}

  {post.hashtags && post.hashtags.length > 0 && (
  <span className="text-[11.5px] text-[#9797ab]">
  {post.hashtags
  .map((t: any) => {
  const tagStr = typeof t === 'string' ? t : (t?.name || '');
  if (!tagStr) return'';
  return tagStr.startsWith('#') ? tagStr : `#${tagStr}`;
  })
  .filter(Boolean)
  .join(' ')}
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
  <div className="pt-2.5 border-t border-[#e8e8f0] flex items-center justify-between text-[13px] text-[#5b5b6e]">
  <div className="flex items-center gap-4">
  {/* Heart / Support */}
  <button
  onClick={toggleSupport}
  className={`flex items-center gap-1.5 transition-colors ${
  supported ? 'text-[#e0308e] font-bold' : 'hover:text-[#16161d]'
  }`}
  >
  <Heart
  className={`h-4 w-4 ${supported ? 'fill-[#e0308e] text-[#e0308e]' : ''}`}
  />
  <span>{supportCount}</span>
  </button>

  {/* Faced This Too */}
  <button
  onClick={toggleFacedThis}
  className={`flex items-center gap-1.5 transition-colors ${
  facedThis ? 'text-[#6d4aff] font-bold' : 'hover:text-[#16161d]'
  }`}
  >
  <Users className={`h-4 w-4 ${facedThis ? 'text-[#6d4aff]' : ''}`} />
  <span className="hidden sm:inline">{similarCount} faced this</span>
  <span className="sm:hidden">{similarCount}</span>
  </button>
  </div>

  {/* Solutions button (opens detail modal) */}
  <div className="flex items-center gap-1.5 text-[#0891b2] font-semibold group-hover:underline">
  <MessageSquare className="h-4 w-4" />
  <span>
  {initialSolutions} {initialSolutions === 1 ? 'solution' : 'solutions'}
  </span>
  </div>
  </div>
  </article>

  {/* Post Detail & Community Solutions Modal */}
  <PostDetailModal
  post={post}
  isOpen={detailOpen}
  onClose={() => setDetailOpen(false)}
  />
  </>
  );
}
