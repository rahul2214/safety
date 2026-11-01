'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FileText,
  Search,
  Filter,
  ArrowRight,
  Clock,
  MapPin,
  Calendar,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Shield,
  Eye,
  Plus,
  X,
  MessageSquare,
  Lock,
  ThumbsUp,
  Heart,
  RefreshCw,
  Radio,
  Trash2,
  AlertTriangle,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Modal } from '@/components/ui/Modal';
import { api, BackendPost } from '@/lib/api-client';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/components/Toast';
import { PostCardSkeleton, Skeleton } from '@/components/ui/Skeleton';

export default function MyPostsPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [posts, setPosts] = useState<BackendPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [deleteTarget, setDeleteTarget] = useState<BackendPost | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { showToast } = useToast();
  const router = useRouter();

  const handleDeletePost = async () => {
    if (!deleteTarget || !deleteTarget.uuid) return;
    setIsDeleting(true);
    const res = await api.deletePost(deleteTarget.uuid);
    setIsDeleting(false);
    if (!res.ok) {
      showToast(res.error || 'Could not delete this post. Please try again.', 'error');
      return;
    }
    const removedUuid = deleteTarget.uuid;
    setPosts((prev) => prev.filter((p) => p.uuid !== removedUuid));
    // The report form also keeps a local copy of the user's posts
    try {
      const ids: any[] = JSON.parse(localStorage.getItem('safecircle_my_post_ids') || '[]');
      localStorage.setItem('safecircle_my_post_ids', JSON.stringify(ids.filter((id) => id !== removedUuid && id !== deleteTarget.id)));
      const cached: any[] = JSON.parse(localStorage.getItem('safecircle_my_posted_posts') || '[]');
      localStorage.setItem('safecircle_my_posted_posts', JSON.stringify(cached.filter((p) => p?.uuid !== removedUuid && p?.id !== deleteTarget.id)));
    } catch {
      // Local cache is best-effort
    }
    setDeleteTarget(null);
    showToast('Post deleted.', 'success');
  };

  const loadUserPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch authenticated posts directly and strictly from the database for this user
      const res = await api.getMyPosts({ limit: 50 });

      let backendPosts: BackendPost[] = [];
      if (res.ok && res.data && Array.isArray(res.data)) {
        backendPosts = res.data.map((item: any, idx: number) => ({
          ...item,
          uuid: item.uuid || item.Uuid || '',
          categoryName: item.categoryName || item.category?.name || 'Safety Alert',
          solutionsCount: item.solutionsCount ?? item.solutionCount ?? 0,
          supportCount: item.supportCount ?? 0,
        }));
      }

      // Display exclusively data from the DB posted by this user
      setPosts(backendPosts);
    } catch (err: any) {
      console.error('Failed to load user posts:', err);
      setError('Unable to load your posts from the database right now. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoading) {
      loadUserPosts();
    }
  }, [isLoading, isAuthenticated, user?.id, user?.displayName]);

  // Tab definitions
  const tabs = ['All', 'Approved', 'Pending', 'Concerning', 'Serious', 'Advice Needed'];

  const filteredPosts = posts.filter((post) => {
    // Tab filtering
    if (activeTab === 'Approved') {
      const isApproved = (post as any).moderationState === 'APPROVED' || post.status?.toLowerCase() === 'approved';
      if (!isApproved) return false;
    } else if (activeTab === 'Pending') {
      const isPending =
        (post as any).moderationState === 'PENDING' ||
        post.status?.toLowerCase().includes('review') ||
        post.status?.toLowerCase().includes('submitted');
      if (!isPending) return false;
    } else if (activeTab === 'Concerning') {
      if (post.severity !== 'CONCERNING') return false;
    } else if (activeTab === 'Serious') {
      if (post.severity !== 'SERIOUS' && post.severity !== 'IMMEDIATE_DANGER') return false;
    } else if (activeTab === 'Advice Needed') {
      if (post.severity !== 'ADVICE_NEEDED') return false;
    }

    // Search query matching
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;

    return (
      post.id.toString().includes(query) ||
      post.content.toLowerCase().includes(query) ||
      (post.categoryName && post.categoryName.toLowerCase().includes(query)) ||
      (post.location && post.location.toLowerCase().includes(query))
    );
  });

  const getSeverityBadge = (severity?: string) => {
    const s = severity?.toUpperCase() || 'CONCERNING';
    switch (s) {
      case 'ADVICE_NEEDED':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
            Advice Needed
          </span>
        );
      case 'CONCERNING':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            Concerning
          </span>
        );
      case 'SERIOUS':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-50 text-orange-700 border border-orange-200">
            Serious
          </span>
        );
      case 'IMMEDIATE_DANGER':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-50 text-red-700 border border-red-200">
            Critical
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-50 text-slate-700 border border-slate-200">
            {s}
          </span>
        );
    }
  };

  const getModerationBadge = (post: BackendPost) => {
    const mod = ((post as any).moderationState || post.status || 'Approved').toUpperCase();
    if (mod === 'APPROVED' || mod === 'RESOLVED') {
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
          <CheckCircle2 className="h-3 w-3 text-emerald-600" />
          <span>Approved</span>
        </span>
      );
    }
    if (mod === 'REJECTED') {
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-50 text-red-700 border border-red-200">
          Declined
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-yellow-50 text-yellow-800 border border-yellow-200 flex items-center gap-1">
        <Clock className="h-3 w-3 text-yellow-600" />
        <span>In Review</span>
      </span>
    );
  };

  // Compute summary metrics
  const totalSupports = posts.reduce((sum, p) => sum + (p.supportCount || 0), 0);
  const totalSolutions = posts.reduce((sum, p) => sum + (p.solutionsCount || (p as any).solutionCount || 0), 0);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-[-0.02em] text-ink">My Posts</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            View, track, and manage safety incidents, advisories, and community posts you shared.
          </p>
        </div>

        <div className="flex items-center gap-2">
          
          <Link href="/report">
            <Button variant="primary" size="sm">
              <Plus className="h-4 w-4 mr-1.5" />
              <span>Create New Post</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-lg border border-slate-200 bg-white">
          <p className="text-[11px] font-medium text-slate-500">Total Posts</p>
          {loading ? (
            <Skeleton className="h-6 w-12 mt-1 rounded" />
          ) : (
            <p className="text-lg font-bold text-slate-900 mt-0.5">{posts.length}</p>
          )}
        </div>
        <div className="p-3.5 rounded-lg border border-slate-200 bg-white">
          <p className="text-[11px] font-medium text-slate-500">Approved &amp; Live</p>
          {loading ? (
            <Skeleton className="h-6 w-12 mt-1 rounded" />
          ) : (
            <p className="text-lg font-bold text-emerald-600 mt-0.5">
              {posts.filter((p) => ((p as any).moderationState || p.status || '').toUpperCase() === 'APPROVED' || p.status === 'Resolved').length}
            </p>
          )}
        </div>
        <div className="p-3.5 rounded-lg border border-slate-200 bg-white">
          <p className="text-[11px] font-medium text-slate-500">Supports Received</p>
          {loading ? (
            <Skeleton className="h-6 w-12 mt-1 rounded" />
          ) : (
            <p className="text-lg font-bold text-blue-600 mt-0.5">{totalSupports}</p>
          )}
        </div>
        <div className="p-3.5 rounded-lg border border-slate-200 bg-white">
          <p className="text-[11px] font-medium text-slate-500">Helpful Solutions</p>
          {loading ? (
            <Skeleton className="h-6 w-12 mt-1 rounded" />
          ) : (
            <p className="text-lg font-bold text-purple-600 mt-0.5">{totalSolutions}</p>
          )}
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Category & Status Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 max-w-full text-xs font-medium no-scrollbar">
          {tabs.map((tab) => {
            const isSelected = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-slate-900 text-white font-semibold shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>{tab}</span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="search"
            placeholder="Search posts, location, tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-8 pl-8 pr-3 rounded-lg border border-slate-200 bg-white text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
      </div>

      {/* Posts List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <PostCardSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <Card className="p-8 text-center text-xs space-y-3 border-red-200 bg-red-50/50">
          <AlertCircle className="h-6 w-6 text-red-600 mx-auto" />
          <p className="font-bold text-red-900">{error}</p>
          <Button variant="outline" size="sm" onClick={loadUserPosts}>
            Try Again
          </Button>
        </Card>
      ) : filteredPosts.length > 0 ? (
        <div className="space-y-3">
          {filteredPosts.map((post, index) => (
            <Card
              key={post.uuid || (post as any).id || `mypost-${index}`}
              className="p-4 sm:p-5 hover:border-blue-300 transition-colors cursor-pointer group"
              onClick={() => {
                if (post.uuid) router.push(`/posts/${post.uuid}`);
              }}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                {/* Left: Badges, Content & Metadata */}
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    {post.categoryName && (
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700">
                        {post.categoryName}
                      </span>
                    )}
                    {getSeverityBadge(post.severity)}
                    {getModerationBadge(post)}
                    {post.isAnonymous && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-500">
                        ANONYMOUS
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-800 line-clamp-3 leading-relaxed whitespace-pre-wrap">
                    {post.content}
                  </p>

                  {/* Metadata bar */}
                  <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400 pt-1 border-t border-slate-100">
                    {post.location && (
                      <span className="flex items-center gap-1 text-slate-600">
                        <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                        <span className="max-w-[200px] truncate">{post.location}</span>
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-slate-400 shrink-0" />
                      <span>
                        Posted {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </span>
                    <span className="flex items-center gap-1 text-slate-600">
                      <ThumbsUp className="h-3 w-3 text-blue-500" />
                      <span>{post.supportCount || 0} supports</span>
                    </span>
                    <span className="flex items-center gap-1 text-slate-600">
                      <MessageSquare className="h-3 w-3 text-purple-500" />
                      <span>{post.solutionsCount || (post as any).solutionCount || 0} solutions</span>
                    </span>
                  </div>
                </div>

                {/* Right: CTA */}
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteTarget(post);
                    }}
                    className="h-9 w-9 rounded-full flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    aria-label="Delete post"
                    title="Delete post"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <span className="text-xs font-semibold text-blue-600 group-hover:underline flex items-center gap-1">
                    <span>View Post</span>
                    <ChevronRight className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center space-y-3">
          <FileText className="h-10 w-10 text-slate-300 mx-auto" />
          <div>
            <h3 className="text-sm font-bold text-slate-900">No posts found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              {searchQuery || activeTab !== 'All'
                ? 'No posts match your selected filter or search term. Try resetting your search.'
                : 'You have not submitted any posts or safety reports yet. When you share an advisory or report a hazard, it will appear here.'}
            </p>
          </div>
          <div className="pt-2">
            <Link href="/report">
              <Button variant="primary">
                <Plus className="h-4 w-4 mr-1.5" />
                <span>Create Your First Post</span>
              </Button>
            </Link>
          </div>
        </Card>
      )}

      {/* Delete confirmation */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => !isDeleting && setDeleteTarget(null)}
        title="Delete this post?"
        size="sm"
      >
        {deleteTarget && (
          <div className="space-y-5">
            <div className="flex items-start gap-3 rounded-2xl bg-red-50 border border-red-200 p-4">
              <AlertTriangle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
              <p className="text-sm text-red-900 leading-relaxed">
                This permanently removes the post and its supports and solutions from Sabhijude. It can&rsquo;t be undone.
              </p>
            </div>
            <p className="text-sm text-slate-600 line-clamp-3 rounded-xl bg-mist p-3 italic">&ldquo;{deleteTarget.content}&rdquo;</p>
            <div className="flex items-center justify-end gap-2.5">
              <Button variant="outline" onClick={() => setDeleteTarget(null)} disabled={isDeleting}>
                Keep it
              </Button>
              <Button variant="emergency" onClick={handleDeletePost} loading={isDeleting} leftIcon={<Trash2 className="h-4 w-4" />}>
                Delete permanently
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
