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
} from 'lucide-react';
import { api, hashtagText, type BackendPost } from '@/lib/api-client';
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

export default function PostDetailPage() {
  const params = useParams<{ id: string }>();
  const postId = Number(params?.id);
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { showToast } = useToast();

  const [post, setPost] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  const [solutions, setSolutions] = useState<any[]>([]);
  const [loadingSolutions, setLoadingSolutions] = useState(true);
  const [newSolution, setNewSolution] = useState('');
  const [submittingSolution, setSubmittingSolution] = useState(false);

  const [supported, setSupported] = useState(false);
  const [supportCount, setSupportCount] = useState(0);
  const [facedThis, setFacedThis] = useState(false);
  const [facedCount, setFacedCount] = useState(0);

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isResolving, setIsResolving] = useState(false);

  // Load the post once auth has settled, so an author's own unpublished post can be read
  useEffect(() => {
    if (authLoading) return;
    if (!Number.isFinite(postId) || postId <= 0) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    api.getPost(postId, true).then((res) => {
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
      .getSolutions(postId)
      .then((res) => !cancelled && setSolutions(res.ok && Array.isArray(res.data) ? res.data : []))
      .finally(() => !cancelled && setLoadingSolutions(false));

    // Ownership comes from the server's own list for this session, not from comparing ids here
    if (isAuthenticated) {
      api.getMyPosts({ limit: 100 }).then((res) => {
        if (!cancelled && res.ok && Array.isArray(res.data)) {
          setIsOwner(res.data.some((p: BackendPost) => p.id === postId));
        }
      });
    }

    return () => {
      cancelled = true;
    };
  }, [postId, authLoading, isAuthenticated]);

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
    const res = await api.supportPost(postId);
    if (!res.ok) {
      setSupported(!next);
      setSupportCount((c) => Math.max(0, c + (next ? -1 : 1)));
    }
  };

  const toggleFaced = async () => {
    if (requireSignIn('Please sign in to react to this report.')) return;
    const next = !facedThis;
    setFacedThis(next);
    setFacedCount((c) => Math.max(0, c + (next ? 1 : -1)));
    const res = await api.facedThisPost(postId);
    if (!res.ok) {
      setFacedThis(!next);
      setFacedCount((c) => Math.max(0, c + (next ? -1 : 1)));
    }
  };

  const handleSendSolution = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSolution.trim()) return;
    if (requireSignIn('Please sign in to share advice.')) return;

    setSubmittingSolution(true);
    const res = await api.createSolution(postId, newSolution.trim());
    setSubmittingSolution(false);
    if (!res.ok) {
      showToast(res.error || 'Could not post your advice.', 'error');
      return;
    }
    setNewSolution('');
    showToast('Your advice has been added.', 'success');
    const refreshed = await api.getSolutions(postId, true);
    if (refreshed.ok && Array.isArray(refreshed.data)) setSolutions(refreshed.data);
  };

  const handleShare = () => {
    const text = `Sabhijude community alert: "${(post?.content || '').slice(0, 120)}…" Stay alert in your area.`;
    window.open(buildWhatsAppLink('', text), '_blank');
  };

  const handleMarkResolved = async () => {
    setIsResolving(true);
    const res = await api.updatePostStatus(postId, 'RESOLVED');
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
    const res = await api.deletePost(postId);
    setIsDeleting(false);
    if (!res.ok) {
      showToast(res.error || 'Could not delete this post.', 'error');
      return;
    }
    // The report form also keeps a local copy of the user's posts
    try {
      const ids: number[] = JSON.parse(localStorage.getItem('safecircle_my_post_ids') || '[]');
      localStorage.setItem('safecircle_my_post_ids', JSON.stringify(ids.filter((id) => id !== postId)));
      const cached: any[] = JSON.parse(localStorage.getItem('safecircle_my_posted_posts') || '[]');
      localStorage.setItem('safecircle_my_posted_posts', JSON.stringify(cached.filter((p) => p?.id !== postId)));
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
  const tags: string[] = (post.hashtags || []).map(hashtagText).filter(Boolean);
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
                      Posted {timeAgo(post.createdAt)} · #{post.id}
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
                {tags.map((t) => (
                  <span key={t} className="rounded-full px-3 py-1.5 text-sm text-slate-500">#{t}</span>
                ))}
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

          {/* Solutions */}
          <section className="rounded-3xl bg-white border border-slate-200/80 p-6 sm:p-8 space-y-5">
            <h2 className="flex items-center gap-2 font-display text-xl font-bold text-ink">
              <MessageSquare className="h-5 w-5 text-brand" /> Community advice
              <span className="rounded-full bg-mist px-2.5 py-0.5 text-sm font-semibold text-slate-500">{solutions.length}</span>
            </h2>

            <form onSubmit={handleSendSolution} className="flex flex-col sm:flex-row gap-2">
              <label htmlFor="new-solution" className="sr-only">Your advice</label>
              <input
                id="new-solution"
                type="text"
                value={newSolution}
                onChange={(e) => setNewSolution(e.target.value)}
                disabled={submittingSolution}
                placeholder={isAuthenticated ? 'Share practical advice or a safer alternative…' : 'Sign in to share advice…'}
                className="flex-1 h-12 rounded-full border border-slate-200 bg-mist px-5 text-sm text-ink placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/10"
              />
              <Button type="submit" disabled={submittingSolution || !newSolution.trim()} loading={submittingSolution} leftIcon={<Send className="h-4 w-4" />}>
                Post advice
              </Button>
            </form>

            {loadingSolutions ? (
              <div className="space-y-3">
                <SolutionSkeleton />
                <SolutionSkeleton />
              </div>
            ) : solutions.length > 0 ? (
              <ul className="space-y-3">
                {solutions.map((sol) => (
                  <li key={sol.id} className="rounded-2xl bg-mist p-4 space-y-1.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="flex items-center gap-2 text-sm font-semibold text-ink">
                        {sol.author?.displayName || 'Community member'}
                        {sol.isAccepted && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700">
                            <CheckCircle2 className="h-3 w-3" /> Verified
                          </span>
                        )}
                      </span>
                      <span className="text-xs text-slate-400">{timeAgo(sol.createdAt)}</span>
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed">{sol.content}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="rounded-2xl border-2 border-dashed border-slate-200 p-8 text-center">
                <p className="font-semibold text-ink">No advice yet</p>
                <p className="text-sm text-slate-500">Be the first to share something that could help.</p>
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

          <div className="rounded-3xl bg-ink text-white p-6 space-y-3">
            <p className="flex items-center gap-2 font-semibold">
              <AlertTriangle className="h-5 w-5 text-coral" /> Nearby and in danger?
            </p>
            <p className="text-sm text-white/65">Don&rsquo;t wait for replies here — call for help now.</p>
            <div className="grid grid-cols-2 gap-2">
              <a href="tel:112" className="rounded-xl bg-red-600 hover:bg-red-700 py-2.5 text-center text-sm font-bold transition">Call 112</a>
              <a href="tel:1091" className="rounded-xl bg-white/10 hover:bg-white/15 py-2.5 text-center text-sm font-bold transition">Call 1091</a>
            </div>
          </div>

          {!isAuthenticated && (
            <div className="rounded-3xl bg-white border border-slate-200/80 p-6 space-y-3">
              <p className="font-semibold text-ink">Join the conversation</p>
              <p className="text-sm text-slate-500">Sign in to support this report and share advice.</p>
              <Link href={`/login?redirect=${encodeURIComponent(`/posts/${postId}`)}`} className="btn-brand w-full py-3">
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
    </div>
  );
}
