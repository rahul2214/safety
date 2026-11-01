'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Heart,
  Users,
  MessageSquare,
  Share2,
  EyeOff,
  Clock,
  MapPin,
  CheckCircle2,
  Send,
  Loader2,
  Sparkles,
  Trash2,
  AlertTriangle,
  Lock,
  Globe,
  ShieldCheck,
  FileQuestion,
  ChevronDown,
  ChevronUp,
  CornerDownRight,
} from 'lucide-react';
import { api, type BackendPost, type Solution, type SolutionReply } from '@/lib/api-client';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/components/Toast';
import { buildWhatsAppLink } from '@/lib/location';
import { getCategoryName, getAuthorName } from '@/components/PostCard';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Skeleton, SolutionSkeleton } from '@/components/ui/Skeleton';

const SEVERITY: Record<string, { label: string; chip: string; dot: string }> = {
  ADVICE_NEEDED: { label: 'Advice needed', chip: 'bg-emerald-50 text-emerald-700', dot: 'bg-emerald-500' },
  CONCERNING: { label: 'Concerning', chip: 'bg-amber-50 text-amber-700', dot: 'bg-amber-500' },
  SERIOUS: { label: 'Serious', chip: 'bg-orange-50 text-orange-700', dot: 'bg-orange-500' },
  IMMEDIATE_DANGER: { label: 'Immediate danger', chip: 'bg-red-50 text-red-700', dot: 'bg-red-600' },
  CRITICAL: { label: 'Urgent', chip: 'bg-red-50 text-red-700', dot: 'bg-red-600' },
};

const AUDIENCE: Record<number, string> = { 1: 'Everyone', 2: 'Women only', 3: 'Men only', 4: 'Other' };

function timeAgo(iso?: string) {
  if (!iso) return 'Recently';
  const diff = Date.now() - new Date(iso).getTime();
  if (Number.isNaN(diff)) return 'Recently';
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'Just now';
  if (m < 60) return `${m} min ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} h ago`;
  return `${Math.floor(h / 24)} d ago`;
}

export function PostDetailClient() {
  const params = useParams<{ id: string }>();
  const postIdentifier = params?.id ? String(params.id).trim() : '';
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { showToast } = useToast();

  const [post, setPost] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [loadingSolutions, setLoadingSolutions] = useState(true);
  const [newSolution, setNewSolution] = useState('');
  const [submittingSolution, setSubmittingSolution] = useState(false);

  // Interactive advice actions: Support, Replies, Delete
  const [replyingToId, setReplyingToId] = useState<number | null>(null);
  const [replyTexts, setReplyTexts] = useState<Record<number, string>>({});
  const [submittingReplyId, setSubmittingReplyId] = useState<number | null>(null);
  const [expandedReplies, setExpandedReplies] = useState<Set<number>>(new Set());

  const [solutionToDelete, setSolutionToDelete] = useState<Solution | null>(null);
  const [isDeletingSolution, setIsDeletingSolution] = useState(false);
  const [replyToDelete, setReplyToDelete] = useState<{ solutionId: number; replyId: number } | null>(null);
  const [isDeletingReply, setIsDeletingReply] = useState(false);

  const [supported, setSupported] = useState(false);
  const [supportCount, setSupportCount] = useState(0);
  const [facedThis, setFacedThis] = useState(false);
  const [facedCount, setFacedCount] = useState(0);

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isResolving, setIsResolving] = useState(false);

  // Load the post once auth has settled, strictly validating UUID format
  useEffect(() => {
    if (authLoading) return;

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!postIdentifier || !uuidRegex.test(postIdentifier)) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    api.getPost(postIdentifier, true).then((res) => {
      if (cancelled) return;
      if (!res.ok || !res.data) {
        setNotFound(true);
      } else {
        const p = res.data;
        setPost(p);
        setSupported(!!p.hasSupported);
        setSupportCount(p.supportCount || 0);
        setFacedThis(!!(p.hasFacedThisToo ?? p.hasFacedThis));
        setFacedCount(p.similarExperienceCount ?? p.similarCount ?? p.facedThisCount ?? 0);
      }
      setLoading(false);
    });

    api
      .getSolutions(postIdentifier)
      .then((res) => !cancelled && setSolutions(res.ok && Array.isArray(res.data) ? res.data : []))
      .finally(() => !cancelled && setLoadingSolutions(false));

    // Ownership comes from the server's own list for this session, not from comparing ids here
    if (isAuthenticated) {
      api.getMyPosts({ limit: 100 }).then((res) => {
        if (!cancelled && res.ok && Array.isArray(res.data)) {
          setIsOwner(
            res.data.some(
              (p: BackendPost) =>
                p.uuid && p.uuid.toLowerCase() === postIdentifier.toLowerCase()
            )
          );
        }
      });
    }

    return () => {
      cancelled = true;
    };
  }, [postIdentifier, authLoading, isAuthenticated]);

  const targetPostUuid = post?.uuid || postIdentifier;

  const requireSignIn = (message: string) => {
    if (isAuthenticated) return false;
    showToast(message, 'info');
    return true;
  };

  const toggleSupport = async () => {
    if (requireSignIn('Please sign in to support this report.')) return;
    const next = !supported;
    setSupported(next);
    setSupportCount((c) => Math.max(0, c + (next ? 1 : -1)));
    const res = await api.supportPost(targetPostUuid);
    if (!res.ok) {
      showToast(res.error || 'Could not update support.', 'error');
      setSupported(!next);
      setSupportCount((c) => Math.max(0, c + (next ? -1 : 1)));
    } else if (res.data) {
      const d = res.data as any;
      if (typeof d.supported === 'boolean') setSupported(d.supported);
      if (typeof d.supportCount === 'number') setSupportCount(d.supportCount);
      else if (typeof d.count === 'number') setSupportCount(d.count);
    }
  };

  const toggleFaced = async () => {
    if (requireSignIn('Please sign in to react to this report.')) return;
    const next = !facedThis;
    setFacedThis(next);
    setFacedCount((c) => Math.max(0, c + (next ? 1 : -1)));
    const res = await api.facedThisPost(targetPostUuid);
    if (!res.ok) {
      showToast(res.error || 'Could not update reaction.', 'error');
      setFacedThis(!next);
      setFacedCount((c) => Math.max(0, c + (next ? -1 : 1)));
    } else if (res.data) {
      const d = res.data as any;
      if (typeof d.faced === 'boolean') setFacedThis(d.faced);
      if (typeof d.count === 'number') setFacedCount(d.count);
    }
  };

  const handleSendSolution = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSolution.trim()) return;
    if (requireSignIn('Please sign in to share advice.')) return;

    setSubmittingSolution(true);
    const res = await api.createSolution(targetPostUuid, newSolution.trim());
    setSubmittingSolution(false);
    if (!res.ok) {
      showToast(res.error || 'Could not post your advice.', 'error');
      return;
    }
    setNewSolution('');
    showToast('Your advice has been added.', 'success');
    const refreshed = await api.getSolutions(targetPostUuid, true);
    if (refreshed.ok && Array.isArray(refreshed.data)) setSolutions(refreshed.data);
  };

  const handleSupportSolution = async (sol: Solution) => {
    if (requireSignIn('Please sign in to support this advice.')) return;

    const currentSupported = !!sol.hasSupported;
    const currentCount = sol.helpfulCount || 0;
    const nextSupported = !currentSupported;
    const nextCount = Math.max(0, currentCount + (nextSupported ? 1 : -1));

    // Optimistic UI update
    setSolutions((prev) =>
      prev.map((s) =>
        s.id === sol.id ? { ...s, hasSupported: nextSupported, helpfulCount: nextCount } : s
      )
    );

    const res = await api.supportSolution(targetPostUuid, sol.id);
    if (!res.ok) {
      showToast(res.error || 'Could not update support.', 'error');
      // Revert on error
      setSolutions((prev) =>
        prev.map((s) =>
          s.id === sol.id ? { ...s, hasSupported: currentSupported, helpfulCount: currentCount } : s
        )
      );
    } else if (res.data) {
      setSolutions((prev) =>
        prev.map((s) =>
          s.id === sol.id
            ? { ...s, hasSupported: res.data!.supported, helpfulCount: res.data!.helpfulCount }
            : s
        )
      );
    }
  };

  const handleSendReply = async (solutionId: number) => {
    const text = (replyTexts[solutionId] || '').trim();
    if (!text) return;
    if (requireSignIn('Please sign in to reply to advice.')) return;

    setSubmittingReplyId(solutionId);
    const res = await api.createSolutionReply(targetPostUuid, solutionId, text);
    setSubmittingReplyId(null);

    if (!res.ok || !res.data) {
      showToast(res.error || 'Could not post your reply.', 'error');
      return;
    }

    const createdReply = res.data;
    setReplyTexts((prev) => ({ ...prev, [solutionId]: '' }));
    setReplyingToId(null);
    setExpandedReplies((prev) => new Set(prev).add(solutionId));

    setSolutions((prev) =>
      prev.map((s) => {
        if (s.id !== solutionId) return s;
        return {
          ...s,
          replies: [...(s.replies || []), createdReply],
        };
      })
    );
    showToast('Your reply has been added.', 'success');
  };

  const handleDeleteSolution = async () => {
    if (!solutionToDelete) return;
    setIsDeletingSolution(true);
    const res = await api.deleteSolution(targetPostUuid, solutionToDelete.id);
    setIsDeletingSolution(false);

    if (!res.ok) {
      showToast(res.error || 'Could not delete advice.', 'error');
      return;
    }

    setSolutions((prev) => prev.filter((s) => s.id !== solutionToDelete.id));
    setSolutionToDelete(null);
    showToast('Advice deleted successfully.', 'success');
  };

  const handleDeleteReply = async () => {
    if (!replyToDelete) return;
    setIsDeletingReply(true);
    const { solutionId, replyId } = replyToDelete;
    const res = await api.deleteSolutionReply(targetPostUuid, solutionId, replyId);
    setIsDeletingReply(false);

    if (!res.ok) {
      showToast(res.error || 'Could not delete reply.', 'error');
      return;
    }

    setSolutions((prev) =>
      prev.map((s) => {
        if (s.id !== solutionId) return s;
        return {
          ...s,
          replies: (s.replies || []).filter((r) => r.id !== replyId),
        };
      })
    );
    setReplyToDelete(null);
    showToast('Reply deleted.', 'success');
  };

  const toggleRepliesExpanded = (solutionId: number) => {
    setExpandedReplies((prev) => {
      const next = new Set(prev);
      if (next.has(solutionId)) next.delete(solutionId);
      else next.add(solutionId);
      return next;
    });
  };

  const handleShare = () => {
    const text = `Sabhijude community alert: "${(post?.content || '').slice(0, 120)}…" Stay alert in your area.`;
    window.open(buildWhatsAppLink('', text), '_blank');
  };

  const handleMarkResolved = async () => {
    setIsResolving(true);
    const res = await api.updatePostStatus(targetPostUuid, 'RESOLVED');
    setIsResolving(false);
    if (!res.ok) {
      showToast(res.error || 'Could not update this post.', 'error');
      return;
    }
    setPost((p: any) => ({ ...p, status: res.data?.status || 'Resolved' }));
    showToast('Marked as resolved.', 'success');
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    const res = await api.deletePost(targetPostUuid);
    setIsDeleting(false);
    if (!res.ok) {
      showToast(res.error || 'Could not delete this post.', 'error');
      return;
    }
    // The report form also keeps a local copy of the user's posts
    try {
      const ids: any[] = JSON.parse(localStorage.getItem('safecircle_my_post_ids') || '[]');
      localStorage.setItem(
        'safecircle_my_post_ids',
        JSON.stringify(ids.filter((id) => id !== post?.id && id !== post?.uuid && String(id) !== postIdentifier))
      );
      const cached: any[] = JSON.parse(localStorage.getItem('safecircle_my_posted_posts') || '[]');
      localStorage.setItem(
        'safecircle_my_posted_posts',
        JSON.stringify(cached.filter((p) => p?.id !== post?.id && p?.uuid !== post?.uuid && String(p?.id) !== postIdentifier))
      );
    } catch {
      // Local cache is best-effort
    }
    showToast('Post deleted.', 'success');
    router.push('/myposts');
  };

  const goBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) router.back();
    else router.push(isAuthenticated ? '/feed' : '/');
  };

  // ── Loading / not found ──────────────────────────────────────
  if (loading) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <Skeleton className="h-5 w-24" />
        <div className="rounded-3xl bg-white border border-slate-200/80 p-6 sm:p-8 space-y-4">
          <Skeleton className="h-10 w-1/3" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-6 w-1/2" />
        </div>
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="max-w-xl mx-auto rounded-3xl bg-white border border-slate-200/80 p-10 text-center space-y-4">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-mist text-slate-400">
          <FileQuestion className="h-7 w-7" />
        </span>
        <h1 className="font-display text-2xl font-extrabold text-ink">Post not found</h1>
        <p className="text-slate-500">It may have been deleted, or it isn&rsquo;t shared with you.</p>
        <Button variant="primary" onClick={() => router.push(isAuthenticated ? '/feed' : '/')}>
          Back to the feed
        </Button>
      </div>
    );
  }

  const severity = SEVERITY[post.severity] || { label: 'Open', chip: 'bg-cyan-50 text-cyan-700', dot: 'bg-cyan-500' };
  const resolved = /resolv/i.test(post.status || '');
  const isAnon = !!post.isAnonymous;
  const author = isOwner && isAnon ? 'You (anonymous)' : getAuthorName(post);
  const category = getCategoryName(post.category || post.categoryName);
  const pending = post.moderationState && post.moderationState !== 'APPROVED';

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <button
        type="button"
        onClick={goBack}
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-ink transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* ── Main column ─────────────────────────────────────── */}
        <div className="lg:col-span-8 space-y-6">
          <article className="rounded-3xl bg-white border border-slate-200/80 overflow-hidden">
            <div className={`h-1.5 ${severity.dot}`} />
            <div className="p-6 sm:p-8 space-y-6">
              {/* Author + status */}
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="h-12 w-12 shrink-0 rounded-full bg-brand-tint text-brand flex items-center justify-center font-bold text-lg">
                    {isAnon ? <EyeOff className="h-5 w-5" /> : author.charAt(0).toUpperCase()}
                  </span>
                  <div>
                    <p className="font-semibold text-ink">{author}</p>
                    <p className="text-sm text-slate-500">
                      Posted {timeAgo(post.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${severity.chip}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${severity.dot}`} /> {severity.label}
                  </span>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      resolved ? 'bg-emerald-50 text-emerald-700' : 'bg-mist text-slate-600'
                    }`}
                  >
                    {resolved ? '✓ Resolved' : 'Open'}
                  </span>
                </div>
              </div>

              {pending && isOwner && (
                <div className="rounded-2xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-900">
                  Only you can see this post until a moderator approves it.
                </div>
              )}

              {/* Content */}
              <p className="text-lg leading-relaxed text-ink whitespace-pre-wrap">{post.content}</p>

              {/* Meta chips */}
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-brand-tint px-3 py-1.5 text-sm font-semibold text-brand">{category}</span>
                {post.location && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-mist px-3 py-1.5 text-sm text-slate-700">
                    <MapPin className="h-3.5 w-3.5 text-coral" /> {post.location}
                  </span>
                )}
                {post.incidentDateTime && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-mist px-3 py-1.5 text-sm text-slate-700">
                    <Clock className="h-3.5 w-3.5 text-brand" />
                    {new Date(post.incidentDateTime).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                  </span>
                )}
              </div>

              {post.safetyAdvice && (
                <div className="flex items-start gap-3 rounded-2xl bg-brand-tint/60 border border-brand/15 p-4">
                  <Sparkles className="h-5 w-5 text-brand shrink-0 mt-0.5" />
                  <p className="text-sm text-ink leading-relaxed">
                    <strong>Safety guidance:</strong> {post.safetyAdvice}
                  </p>
                </div>
              )}

              {/* Reactions */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-5 border-t border-slate-100">
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={toggleSupport}
                    aria-pressed={supported}
                    className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                      supported ? 'border-coral/30 bg-coral-tint text-coral' : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <Heart className={`h-4 w-4 ${supported ? 'fill-coral' : ''}`} /> {supportCount} support
                  </button>
                  <button
                    type="button"
                    onClick={toggleFaced}
                    aria-pressed={facedThis}
                    className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                      facedThis ? 'border-brand/30 bg-brand-tint text-brand' : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <Users className="h-4 w-4" /> {facedCount} faced this too
                  </button>
                </div>
                <button
                  type="button"
                  onClick={handleShare}
                  className="inline-flex items-center gap-2 rounded-full bg-emerald-600 hover:bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition"
                >
                  <Share2 className="h-4 w-4" /> Share on WhatsApp
                </button>
              </div>
            </div>
          </article>

          {/* Solutions & Community Advice */}
          <section className="rounded-3xl bg-white border border-slate-200/80 p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 font-display text-lg sm:text-xl font-bold text-ink">
                <MessageSquare className="h-5 w-5 text-brand" /> Community advice
                <span className="rounded-full bg-mist px-2.5 py-0.5 text-xs sm:text-sm font-semibold text-slate-500">
                  {solutions.length}
                </span>
              </h2>
              <span className="text-xs text-slate-400 hidden sm:inline">
                Guidance & support
              </span>
            </div>

            {/* Advice Composer */}
            <form onSubmit={handleSendSolution} className="space-y-3">
              <div className="relative rounded-2xl border border-slate-200 bg-mist/50 focus-within:bg-white focus-within:border-brand focus-within:ring-4 focus-within:ring-brand/10 transition-all p-3 sm:p-4">
                <label htmlFor="new-solution" className="sr-only">Your advice</label>
                <textarea
                  id="new-solution"
                  rows={3}
                  value={newSolution}
                  onChange={(e) => setNewSolution(e.target.value)}
                  disabled={submittingSolution}
                  placeholder={
                    isAuthenticated
                      ? 'Share practical advice, precautions, or safety guidance for the community…'
                      : 'Sign in to share advice…'
                  }
                  className="w-full bg-transparent text-sm sm:text-base text-ink placeholder:text-slate-400 focus:outline-none resize-none leading-relaxed"
                />
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2.5 border-t border-slate-200/60">
                  <span className="text-[11px] sm:text-xs text-slate-400 flex items-center gap-1">
                    <Sparkles className="h-3.5 w-3.5 text-brand" /> Practical advice helps most
                  </span>
                  <Button
                    type="submit"
                    size="sm"
                    disabled={submittingSolution || !newSolution.trim()}
                    loading={submittingSolution}
                    leftIcon={<Send className="h-3.5 w-3.5" />}
                    className="rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold ml-auto"
                  >
                    Post advice
                  </Button>
                </div>
              </div>
            </form>

            {/* Advice Cards List */}
            {loadingSolutions ? (
              <div className="space-y-3">
                <SolutionSkeleton />
                <SolutionSkeleton />
              </div>
            ) : solutions.length > 0 ? (
              <ul className="space-y-3 sm:space-y-4">
                {solutions.map((sol) => {
                  const canDeleteSol =
                    !!user?.id && (String(sol.authorId) === String(user.id) || isOwner);
                  const replies = sol.replies || [];
                  const isReplying = replyingToId === sol.id;
                  const areRepliesExpanded = expandedReplies.has(sol.id);

                  return (
                    <li
                      key={sol.id}
                      className="rounded-2xl bg-white border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)] p-4 sm:p-5 space-y-3 transition hover:border-slate-300"
                    >
                      {/* Header: Author + Badges + Delete */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                          <span className="h-9 w-9 shrink-0 rounded-full bg-gradient-to-br from-brand/15 to-brand/5 text-brand flex items-center justify-center font-bold text-sm ring-1 ring-brand/20">
                            {(sol.author?.displayName || 'C').charAt(0).toUpperCase()}
                          </span>
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                              <span className="font-semibold text-sm text-ink truncate">
                                {sol.author?.displayName || 'Community member'}
                              </span>
                              {sol.isAccepted && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] sm:text-[11px] font-bold text-emerald-700">
                                  <CheckCircle2 className="h-3 w-3" /> Verified
                                </span>
                              )}
                              {sol.author?.isVerifiedExpert && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] sm:text-[11px] font-bold text-indigo-700">
                                  <ShieldCheck className="h-3 w-3" /> Expert
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] sm:text-xs text-slate-400">
                              {timeAgo(sol.createdAt)}
                            </p>
                          </div>
                        </div>

                        {canDeleteSol && (
                          <button
                            type="button"
                            onClick={() => setSolutionToDelete(sol)}
                            className="shrink-0 p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                            title="Delete this advice"
                            aria-label="Delete this advice"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>

                      {/* Content */}
                      <p className="text-sm sm:text-base text-slate-800 leading-relaxed whitespace-pre-wrap break-words">
                        {sol.content}
                      </p>

                      {/* Actions Bar: Support, Reply, View/Hide replies */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                        <div className="flex items-center gap-2">
                          {/* Support Button */}
                          <button
                            type="button"
                            onClick={() => handleSupportSolution(sol)}
                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs sm:text-sm font-semibold transition cursor-pointer ${
                              sol.hasSupported
                                ? 'bg-rose-50 text-rose-600 border border-rose-200'
                                : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/80'
                            }`}
                            aria-pressed={!!sol.hasSupported}
                          >
                            <Heart
                              className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${
                                sol.hasSupported ? 'fill-rose-600 text-rose-600' : 'text-slate-500'
                              }`}
                            />
                            <span>{sol.hasSupported ? 'Supported' : 'Support'}</span>
                            {(sol.helpfulCount || 0) > 0 && (
                              <span className="ml-0.5 rounded-full bg-black/5 px-1.5 py-0.2 text-xs font-bold">
                                {sol.helpfulCount}
                              </span>
                            )}
                          </button>

                          {/* Reply Button */}
                          <button
                            type="button"
                            onClick={() => {
                              setReplyingToId((cur) => (cur === sol.id ? null : sol.id));
                              setExpandedReplies((prev) => new Set(prev).add(sol.id));
                            }}
                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs sm:text-sm font-semibold transition cursor-pointer ${
                              isReplying
                                ? 'bg-brand-tint text-brand border border-brand/30'
                                : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/80'
                            }`}
                          >
                            <MessageSquare className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-500" />
                            <span>Reply</span>
                            {replies.length > 0 && (
                              <span className="ml-0.5 rounded-full bg-black/5 px-1.5 py-0.2 text-xs font-bold">
                                {replies.length}
                              </span>
                            )}
                          </button>
                        </div>

                        {replies.length > 0 && (
                          <button
                            type="button"
                            onClick={() => toggleRepliesExpanded(sol.id)}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-brand hover:underline cursor-pointer"
                          >
                            {areRepliesExpanded ? (
                              <>
                                <span>Hide {replies.length === 1 ? 'reply' : 'replies'}</span>
                                <ChevronUp className="h-3.5 w-3.5" />
                              </>
                            ) : (
                              <>
                                <span>
                                  View {replies.length} {replies.length === 1 ? 'reply' : 'replies'}
                                </span>
                                <ChevronDown className="h-3.5 w-3.5" />
                              </>
                            )}
                          </button>
                        )}
                      </div>

                      {/* Replies List */}
                      {areRepliesExpanded && replies.length > 0 && (
                        <div className="space-y-2.5 pl-3 sm:pl-4 border-l-2 border-brand/20 mt-3 pt-1">
                          {replies.map((reply) => {
                            const canDeleteReply =
                              !!user?.id && (String(reply.authorId) === String(user.id) || isOwner);
                            return (
                              <div
                                key={reply.id}
                                className="group relative rounded-xl bg-slate-50 border border-slate-100 p-3 space-y-1"
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <div className="flex items-center gap-2 min-w-0">
                                    <span className="h-6 w-6 shrink-0 rounded-full bg-brand/10 text-brand flex items-center justify-center font-bold text-xs">
                                      {(reply.author?.displayName || 'C').charAt(0).toUpperCase()}
                                    </span>
                                    <span className="text-xs font-semibold text-ink truncate">
                                      {reply.author?.displayName || 'Community member'}
                                    </span>
                                    <span className="text-[10px] text-slate-400 shrink-0">
                                      {timeAgo(reply.createdAt)}
                                    </span>
                                  </div>
                                  {canDeleteReply && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setReplyToDelete({ solutionId: sol.id, replyId: reply.id })
                                      }
                                      className="shrink-0 text-slate-400 hover:text-red-600 p-1 rounded hover:bg-red-50 transition cursor-pointer"
                                      title="Delete reply"
                                      aria-label="Delete reply"
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                  )}
                                </div>
                                <p className="text-xs sm:text-sm text-slate-700 pl-8 leading-relaxed whitespace-pre-wrap break-words">
                                  {reply.content}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Inline Reply Composer */}
                      {isReplying && (
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            handleSendReply(sol.id);
                          }}
                          className="pt-2 pl-3 sm:pl-4 border-l-2 border-brand/40 space-y-2"
                        >
                          <div className="relative rounded-xl border border-slate-200 bg-white focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/10 p-2.5">
                            <textarea
                              rows={2}
                              value={replyTexts[sol.id] || ''}
                              onChange={(e) =>
                                setReplyTexts((prev) => ({ ...prev, [sol.id]: e.target.value }))
                              }
                              placeholder={
                                isAuthenticated
                                  ? 'Write a reply to this advice…'
                                  : 'Sign in to reply…'
                              }
                              className="w-full bg-transparent text-xs sm:text-sm text-ink placeholder:text-slate-400 focus:outline-none resize-none leading-relaxed"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                  e.preventDefault();
                                  handleSendReply(sol.id);
                                }
                              }}
                            />
                            <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
                              <span className="text-[10px] text-slate-400">Press Enter to send</span>
                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => setReplyingToId(null)}
                                  className="px-2.5 py-1 text-xs text-slate-500 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition cursor-pointer"
                                >
                                  Cancel
                                </button>
                                <Button
                                  type="submit"
                                  size="sm"
                                  disabled={
                                    submittingReplyId === sol.id || !(replyTexts[sol.id] || '').trim()
                                  }
                                  loading={submittingReplyId === sol.id}
                                  leftIcon={<Send className="h-3 w-3" />}
                                  className="rounded-xl px-3 py-1 text-xs font-semibold"
                                >
                                  Reply
                                </Button>
                              </div>
                            </div>
                          </div>
                        </form>
                      )}
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="rounded-2xl border-2 border-dashed border-slate-200 p-6 sm:p-8 text-center space-y-1">
                <p className="font-semibold text-ink">No advice yet</p>
                <p className="text-sm text-slate-500">
                  Be the first to share practical tips or precautions that could help.
                </p>
              </div>
            )}
          </section>
        </div>

        {/* ── Side column ─────────────────────────────────────── */}
        <aside className="lg:col-span-4 space-y-4 lg:sticky lg:top-28">
          {isOwner && (
            <div className="rounded-3xl bg-white border border-slate-200/80 p-6 space-y-5">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">Your post</p>
              <dl className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <dt className="sr-only">Identity</dt>
                  {isAnon ? <EyeOff className="h-4 w-4 text-emerald-600" /> : <Users className="h-4 w-4 text-slate-400" />}
                  <dd className="text-ink">{isAnon ? 'Posted anonymously' : 'Posted with your name'}</dd>
                </div>
                <div className="flex items-center gap-3">
                  <dt className="sr-only">Audience</dt>
                  {post.visibility === 'PRIVATE' ? <Lock className="h-4 w-4 text-slate-400" /> : <Globe className="h-4 w-4 text-slate-400" />}
                  <dd className="text-ink">
                    {post.visibility === 'PRIVATE' ? 'Only you' : `Visible to ${AUDIENCE[post.postVisibilityId] || 'everyone'}`}
                  </dd>
                </div>
                <div className="flex items-center gap-3">
                  <dt className="sr-only">Review</dt>
                  <ShieldCheck className={`h-4 w-4 ${pending ? 'text-amber-500' : 'text-emerald-600'}`} />
                  <dd className="text-ink">{pending ? 'Waiting for moderator review' : 'Approved and published'}</dd>
                </div>
              </dl>
              <div className="space-y-2 pt-1">
                {resolved ? (
                  <p className="flex items-center justify-center gap-2 rounded-full bg-emerald-50 py-2.5 text-sm font-semibold text-emerald-700">
                    <CheckCircle2 className="h-4 w-4" /> Resolved
                  </p>
                ) : (
                  <Button variant="success" className="w-full" onClick={handleMarkResolved} loading={isResolving} leftIcon={<CheckCircle2 className="h-4 w-4" />}>
                    Mark as resolved
                  </Button>
                )}
                <Button
                  variant="ghost"
                  className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => setConfirmDelete(true)}
                  leftIcon={<Trash2 className="h-4 w-4" />}
                >
                  Delete post
                </Button>
              </div>
            </div>
          )}

          {!isAuthenticated && (
            <div className="rounded-3xl bg-white border border-slate-200/80 p-6 space-y-3">
              <p className="font-semibold text-ink">Join the conversation</p>
              <p className="text-sm text-slate-500">Sign in to support this report and share advice.</p>
              <Link href={`/login?redirect=${encodeURIComponent(`/posts/${post?.uuid || postIdentifier}`)}`} className="btn-brand w-full py-3">
                Sign in
              </Link>
            </div>
          )}
        </aside>
      </div>

      <Modal isOpen={confirmDelete} onClose={() => !isDeleting && setConfirmDelete(false)} title="Delete this post?" size="sm">
        <div className="space-y-5">
          <div className="flex items-start gap-3 rounded-2xl bg-red-50 border border-red-200 p-4">
            <AlertTriangle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
            <p className="text-sm text-red-900 leading-relaxed">
              This permanently removes the post and its supports and advice. It can&rsquo;t be undone.
            </p>
          </div>
          <div className="flex items-center justify-end gap-2.5">
            <Button variant="outline" onClick={() => setConfirmDelete(false)} disabled={isDeleting}>
              Keep it
            </Button>
            <Button variant="emergency" onClick={handleDelete} loading={isDeleting} leftIcon={<Trash2 className="h-4 w-4" />}>
              Delete permanently
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Advice Modal */}
      <Modal
        isOpen={!!solutionToDelete}
        onClose={() => !isDeletingSolution && setSolutionToDelete(null)}
        title="Delete this advice?"
        size="sm"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 rounded-2xl bg-red-50 border border-red-200 p-4">
            <AlertTriangle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
            <p className="text-sm text-red-900 leading-relaxed">
              This will permanently delete this piece of advice and all of its replies. It cannot be undone.
            </p>
          </div>
          <div className="flex items-center justify-end gap-2.5">
            <Button
              variant="outline"
              onClick={() => setSolutionToDelete(null)}
              disabled={isDeletingSolution}
            >
              Cancel
            </Button>
            <Button
              variant="emergency"
              onClick={handleDeleteSolution}
              loading={isDeletingSolution}
              leftIcon={<Trash2 className="h-4 w-4" />}
            >
              Delete advice
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Reply Modal */}
      <Modal
        isOpen={!!replyToDelete}
        onClose={() => !isDeletingReply && setReplyToDelete(null)}
        title="Delete this reply?"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600 leading-relaxed">
            Are you sure you want to delete this reply? This cannot be undone.
          </p>
          <div className="flex items-center justify-end gap-2.5">
            <Button
              variant="outline"
              onClick={() => setReplyToDelete(null)}
              disabled={isDeletingReply}
            >
              Cancel
            </Button>
            <Button
              variant="emergency"
              onClick={handleDeleteReply}
              loading={isDeletingReply}
              leftIcon={<Trash2 className="h-4 w-4" />}
            >
              Delete reply
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
