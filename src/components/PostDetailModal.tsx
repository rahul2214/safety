'use client';

import React, { useState, useEffect } from'react';
import {
  X,
  Heart,
  Users,
  MessageSquare,
  Share2,
  ShieldCheck,
  EyeOff,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Send,
  Loader2,
  Sparkles,
  MapPin,
} from'lucide-react';
import { api, type BackendPost } from'@/lib/api-client';
import { useAuth } from'@/lib/auth-context';
import { useToast } from'@/components/Toast';
import { buildWhatsAppLink } from'@/lib/location';
import { getCategoryName, getAuthorName } from'@/components/PostCard';
import { SolutionSkeleton } from'@/components/ui/Skeleton';

interface PostDetailModalProps {
  post: any | null;
  isOpen: boolean;
  onClose: () => void;
  onPostUpdated?: () => void;
}

export function PostDetailModal({ post, isOpen, onClose, onPostUpdated }: PostDetailModalProps) {
  const { isAuthenticated, user } = useAuth();
  const { showToast } = useToast();

  const [solutions, setSolutions] = useState<any[]>([]);
  const [loadingSolutions, setLoadingSolutions] = useState(false);
  const [newSolutionText, setNewSolutionText] = useState('');
  const [submittingSolution, setSubmittingSolution] = useState(false);

  // Optimistic Support & Faced State
  const [supported, setSupported] = useState(false);
  const [supportCount, setSupportCount] = useState(0);
  const [facedThis, setFacedThis] = useState(false);
  const [facedCount, setFacedCount] = useState(0);

  useEffect(() => {
  if (post && isOpen) {
  setSupported(post.hasSupported || false);
  setSupportCount(post.supportCount || 0);
  setFacedThis(post.hasFacedThis || false);
  setFacedCount(post.similarCount || post.facedThisCount || 0);

  // Load live solutions from DB
  setLoadingSolutions(true);
  api.getSolutions(post.id)
  .then((res) => {
  if (res.ok && res.data) {
  setSolutions(res.data);
  } else {
  setSolutions([]);
  }
  })
  .catch(() => setSolutions([]))
  .finally(() => setLoadingSolutions(false));
  }
  }, [post, isOpen]);

  if (!isOpen || !post) return null;

  const toggleSupport = async () => {
  if (!isAuthenticated) {
  showToast('Please log in to support this incident.', 'info');
  return;
  }
  const nextVal = !supported;
  setSupported(nextVal);
  setSupportCount((c) => Math.max(0, nextVal ? c + 1 : c - 1));

  try {
  await api.supportPost(post.id);
  } catch {
  // Revert if error
  setSupported(!nextVal);
  setSupportCount((c) => Math.max(0, !nextVal ? c + 1 : c - 1));
  }
  };

  const toggleFacedThis = async () => {
  if (!isAuthenticated) {
  showToast('Please log in to react to this incident.', 'info');
  return;
  }
  const nextVal = !facedThis;
  setFacedThis(nextVal);
  setFacedCount((c) => Math.max(0, nextVal ? c + 1 : c - 1));

  try {
  await api.facedThisPost(post.id);
  } catch {
  setFacedThis(!nextVal);
  setFacedCount((c) => Math.max(0, !nextVal ? c + 1 : c - 1));
  }
  };

  const handleSendSolution = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!newSolutionText.trim()) return;

  if (!isAuthenticated) {
  showToast('Please sign in to contribute community safety solutions.', 'info');
  return;
  }

  setSubmittingSolution(true);
  try {
  const res = await api.createSolution(post.id, newSolutionText.trim());
  if (res.ok) {
  showToast('Your advice has been added to the incident.', 'success');
  setNewSolutionText('');
  // Reload solutions
  const refreshed = await api.getSolutions(post.id);
  if (refreshed.ok && refreshed.data) {
  setSolutions(refreshed.data);
  }
  if (onPostUpdated) onPostUpdated();
  } else {
  showToast(res.error || 'Failed to submit advice.', 'error');
  }
  } catch (err: any) {
  showToast(err.message || 'Error communicating with database.', 'error');
  } finally {
  setSubmittingSolution(false);
  }
  };

  const handleShareWhatsApp = () => {
  const text = `Sabhijude Community Advisory: "${post.content.slice(0, 120)}..."Stay alert in your neighborhood.`;
  const url = buildWhatsAppLink('', text);
  window.open(url, '_blank');
  };

  const isResolved = post.severity === 'RESOLVED' || post.status === 'RESOLVED';
  const isUrgent = post.severity === 'CRITICAL' || post.severity === 'IMMEDIATE_DANGER';
  const isAnon = post?.isAnonymous ?? false;
  const authorDisplay = getAuthorName(post);
  const avatarLetter = (authorDisplay === 'Anonymous' ? 'A' : authorDisplay).charAt(0).toUpperCase() || 'C';
  const categoryDisplay = getCategoryName(post?.category || post?.categoryName);

  return (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm select-none">
  <div className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-[24px] border border-[#e8e8f0] shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
  {/* Modal Top Header */}
  <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-[#e8e8f0]">
  <div className="flex items-center gap-2.5">
  <span
  className={`w-2.5 h-2.5 rounded-full ${
  isUrgent ? 'bg-[#e11d48]' : isResolved ? 'bg-[#059669]' : 'bg-[#d97706]'
  }`}
  />
  <h2 className="text-[16px] font-black text-[#16161d]">
  Incident Details &amp; Solutions
  </h2>
  </div>

  <button
  onClick={onClose}
  className="w-8 h-8 rounded-full bg-[#f1f1f6] hover:bg-[#e8e8f0] flex items-center justify-center text-[#5b5b6e] transition"
  >
  <X className="h-4 w-4" />
  </button>
  </div>

  {/* Scrollable Modal Content */}
  <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
  {/* Post Author Row */}
  <div className="flex items-center justify-between">
  <div className="flex items-center gap-3">
  <div className="w-10 h-10 rounded-full bg-[#f1edff] text-[#6d4aff] flex items-center justify-center font-bold text-sm shrink-0">
  {isAnon ? (
  <EyeOff className="h-5 w-5" />
  ) : (
  avatarLetter
  )}
  </div>
  <div>
  <div className="flex items-center gap-2">
  <span className="font-bold text-[#16161d] text-[15px]">
  {authorDisplay}
  </span>
  {isAnon && (
  <span className="text-[10px] font-bold text-[#6d4aff] bg-[#f1edff] px-2 py-0.5 rounded-full">
  Private
  </span>
  )}
  </div>
  <p className="text-[11.5px] text-[#9797ab]">{post.timeAgo || 'Recently'}</p>
  </div>
  </div>

  <span
  className={`px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider ${
  isUrgent
  ? 'bg-[#ffe4e6] text-[#e11d48]'
  : isResolved
  ? 'bg-[#d1fae5] text-[#059669]'
  : 'bg-[#fef3c7] text-[#d97706]'
  }`}
  >
  {isUrgent ? 'URGENT' : isResolved ? 'SOLVED' : 'CONCERNING'}
  </span>
  </div>

  {/* Post Full Content */}
  <div className="p-4 rounded-[16px] bg-[#f7f7fa] border border-[#e8e8f0]">
  <p className="text-[15px] text-[#16161d] leading-[22px] whitespace-pre-wrap">
  {post.content}
  </p>
  </div>

  {/* Chips & Tags */}
  <div className="flex flex-wrap items-center gap-2">
  <span className="px-3 py-1 rounded-full bg-[#f1edff] text-[#6d4aff] text-xs font-bold">
  {categoryDisplay}
  </span>
  <span
  className={`px-3 py-1 rounded-full text-xs font-bold ${
  isResolved
  ? 'bg-[#ecfdf5] text-[#059669]'
  : 'bg-[#ecfeff] text-[#0891b2]'
  }`}
  >
  {isResolved ? '✓ Solved' : '● Open Issue'}
  </span>
  {post.location && (
  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
  <MapPin className="h-3.5 w-3.5 text-rose-500 shrink-0" />
  <span>{post.location}</span>
  </span>
  )}
  {post.incidentDateTime && (
  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
  <Clock className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
  <span>
  {new Date(post.incidentDateTime).toLocaleDateString(undefined, {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  })}
  </span>
  </span>
  )}
  {post.safetyAdvice && (
  <div className="w-full mt-1 p-3 rounded-[12px] bg-blue-50 border border-blue-200 flex items-start gap-2">
  <Sparkles className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
  <p className="text-xs text-blue-700 font-medium leading-relaxed">
  <strong>Safety Guidance:</strong> {post.safetyAdvice}
  </p>
  </div>
  )}
  </div>

  {/* Interaction Bar */}
  <div className="flex items-center justify-between pt-2 border-t border-[#e8e8f0]">
  <div className="flex items-center gap-4">
  <button
  onClick={toggleSupport}
  className={`flex items-center gap-1.5 text-xs font-bold transition ${
  supported
  ? 'text-[#e0308e]'
  : 'text-[#5b5b6e] hover:text-[#16161d]'
  }`}
  >
  <Heart className={`h-4 w-4 ${supported ? 'fill-[#e0308e]' : ''}`} />
  <span>{supportCount} Supported</span>
  </button>

  <button
  onClick={toggleFacedThis}
  className={`flex items-center gap-1.5 text-xs font-bold transition ${
  facedThis
  ? 'text-[#6d4aff]'
  : 'text-[#5b5b6e] hover:text-[#16161d]'
  }`}
  >
  <Users className="h-4 w-4" />
  <span>{facedCount} Faced This Too</span>
  </button>
  </div>

  <button
  onClick={handleShareWhatsApp}
  className="flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] bg-[#f1f1f6] hover:bg-[#e8e8f0] text-xs font-bold text-[#16161d] transition"
  >
  <Share2 className="h-3.5 w-3.5 text-[#059669]" />
  <span>Share Alert</span>
  </button>
  </div>

  {/* Community Solutions Section (From mobile-app post/[id].tsx) */}
  <div className="space-y-3 pt-2">
  <div className="flex items-center justify-between">
  <h3 className="text-sm font-black text-[#16161d] flex items-center gap-2">
  <MessageSquare className="h-4 w-4 text-[#0891b2]" />
  <span>Community Solutions &amp; Advice ({solutions.length})</span>
  </h3>
  </div>

  {/* Solutions List */}
  {loadingSolutions ? (
  <div className="space-y-2.5">
  <SolutionSkeleton />
  <SolutionSkeleton />
  <SolutionSkeleton />
  </div>
  ) : solutions.length > 0 ? (
  <div className="space-y-2.5">
  {solutions.map((sol) => (
  <div
  key={sol.id}
  className="p-3.5 rounded-[14px] bg-[#f7f7fa] border border-[#e8e8f0] space-y-1.5"
  >
  <div className="flex items-center justify-between">
  <div className="flex items-center gap-2">
  <span className="text-xs font-bold text-[#16161d]">
  {sol.author?.displayName || 'Community Member'}
  </span>
  {sol.isAccepted && (
  <span className="text-[10px] font-bold text-[#059669] bg-[#ecfdf5] px-2 py-0.5 rounded-full">
  ✓ Verified Solution
  </span>
  )}
  </div>
  <span className="text-[10.5px] text-[#9797ab]">Recently</span>
  </div>
  <p className="text-xs text-[#5b5b6e] leading-relaxed">
  {sol.content}
  </p>
  </div>
  ))}
  </div>
  ) : (
  <div className="p-6 rounded-[16px] bg-[#f7f7fa] border border-dashed border-[#e8e8f0] text-center space-y-1 text-xs text-[#9797ab]">
  <p className="font-semibold text-[#16161d]">
  No solutions shared yet
  </p>
  <p>Be the first member to share trusted advice or practical steps.</p>
  </div>
  )}
  </div>
  </div>

  {/* Modal Bottom: Submit New Solution Form */}
  <div className="p-4 bg-white border-t border-[#e8e8f0]">
  <form onSubmit={handleSendSolution} className="flex gap-2">
  <input
  type="text"
  placeholder={
  isAuthenticated
  ? 'Add your verified advice or practical solution…'
  : 'Sign in to add a solution…'
  }
  value={newSolutionText}
  onChange={(e) => setNewSolutionText(e.target.value)}
  disabled={submittingSolution}
  className="flex-1 h-11 bg-[#f7f7fa] border border-[#e8e8f0] rounded-[14px] px-3.5 text-xs text-[#16161d] focus:outline-none focus:border-[#6d4aff]"
  />
  <button
  type="submit"
  disabled={submittingSolution || !newSolutionText.trim()}
  className="h-11 px-4 rounded-[14px] bg-[#6d4aff] hover:bg-[#5325e8] text-white font-bold text-xs shadow-sm transition flex items-center gap-1.5 disabled:opacity-50"
  >
  {submittingSolution ? (
  <Loader2 className="h-4 w-4 animate-spin" />
  ) : (
  <>
  <Send className="h-3.5 w-3.5" />
  <span>Post Advice</span>
  </>
  )}
  </button>
  </form>
  </div>
  </div>
  </div>
  );
}
