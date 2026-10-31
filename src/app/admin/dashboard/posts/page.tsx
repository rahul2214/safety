'use client';

import { useState, useEffect } from 'react';
import { adminFetch } from '@/portals/admin/lib/api';
import {
  FileText,
  Search,
  Trash2,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Eye,
  CheckCircle,
  X,
  Filter,
} from 'lucide-react';

export default function CommunityPostsPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<any>({ total: 0, totalPages: 1 });

  // Inspection & Delete
  const [inspectPost, setInspectPost] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    adminFetch('/api/admin/categories').then((res) => {
      if (res.ok && res.data) setCategories(res.data);
    });
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search.trim()) params.set('search', search.trim());
    if (categoryFilter) params.set('categoryId', categoryFilter);
    if (severityFilter) params.set('severity', severityFilter);
    params.set('page', page.toString());
    params.set('limit', '12');

    const res = await adminFetch(`/api/admin/posts?${params.toString()}`);
    if (res.ok && res.data) {
      setPosts(res.data.data || []);
      setPagination(res.data.pagination || { total: 0, totalPages: 1 });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, [page, categoryFilter, severityFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchPosts();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setActionLoading(true);

    const res = await adminFetch(`/api/admin/posts/${deleteId}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      setDeleteId(null);
      fetchPosts();
    }
    setActionLoading(false);
  };

  const handleUpdateStatus = async (postId: number, newStatus: string) => {
    setActionLoading(true);
    const res = await adminFetch(`/api/admin/posts/${postId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status: newStatus }),
    });

    if (res.ok) {
      if (inspectPost && inspectPost.id === postId) {
        setInspectPost({ ...inspectPost, status: newStatus });
      }
      fetchPosts();
    }
    setActionLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* Search & Filters */}
      <div className="bg-white border border-[#e8e8f0] rounded-[18px] p-4 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between shadow-xs">
        <form onSubmit={handleSearch} className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-2.5 text-[#9797ab]" size={16} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search post text..."
            className="w-full bg-white border border-[#e2e2ec] text-[#16161d] rounded-[12px] pl-10 pr-4 py-2 text-xs focus:outline-none focus:border-[#6d4aff] focus:ring-2 focus:ring-[#6d4aff]/15 placeholder-[#9797ab] shadow-2xs transition-colors"
          />
        </form>

        <div className="flex items-center gap-2.5 flex-wrap">
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setPage(1);
            }}
            className="bg-white border border-[#e2e2ec] text-[#16161d] rounded-[12px] px-3.5 py-2 text-xs font-medium focus:outline-none focus:border-[#6d4aff] focus:ring-2 focus:ring-[#6d4aff]/15 shadow-2xs"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={severityFilter}
            onChange={(e) => {
              setSeverityFilter(e.target.value);
              setPage(1);
            }}
            className="bg-white border border-[#e2e2ec] text-[#16161d] rounded-[12px] px-3.5 py-2 text-xs font-medium focus:outline-none focus:border-[#6d4aff] focus:ring-2 focus:ring-[#6d4aff]/15 shadow-2xs"
          >
            <option value="">All Severities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>
      </div>

      {/* Posts Table */}
      <div className="bg-white border border-[#e8e8f0] rounded-[18px] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#fcfcfe] text-[#717184] uppercase tracking-wider font-bold border-b border-[#e8e8f0] text-[10.5px]">
              <tr>
                <th className="px-5 py-3.5">Post Content</th>
                <th className="px-5 py-3.5">Category</th>
                <th className="px-5 py-3.5">Severity</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Author</th>
                <th className="px-5 py-3.5">Created</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0f0f5]">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-[#5b5b6e]">
                    <Loader2 size={22} className="animate-spin inline-block text-[#6d4aff] mr-2" />
                    Loading community posts...
                  </td>
                </tr>
              ) : posts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-[#5b5b6e]">
                    No community posts found matching current filters.
                  </td>
                </tr>
              ) : (
                posts.map((p) => (
                  <tr key={p.id} className="hover:bg-[#fafafc] transition-colors">
                    <td className="px-5 py-3.5 max-w-xs">
                      <p className="font-semibold text-[#16161d] line-clamp-2 leading-snug">{p.content}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-[#f4f0ff] text-[#6d4aff] border border-[#e5dcff]">
                        {p.categoryName || 'General'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-bold border ${
                          p.severity === 'CRITICAL'
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : p.severity === 'HIGH'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-[#f7f7fa] text-[#5b5b6e] border-[#e8e8f0]'
                        }`}
                      >
                        {p.severity}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-[11.5px] font-mono font-medium text-[#5b5b6e]">{p.status}</span>
                    </td>
                    <td className="px-5 py-3.5 text-[#5b5b6e] text-[11.5px] font-medium">
                      {p.authorName}
                    </td>
                    <td className="px-5 py-3.5 text-[#717184] text-[11.5px]">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3.5 text-right space-x-1.5">
                      <button
                        onClick={() => setInspectPost(p)}
                        className="p-1.5 rounded-[8px] bg-[#f4f0ff] hover:bg-[#eae3ff] text-[#6d4aff] transition-colors shadow-2xs"
                        title="View Details"
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        onClick={() => setDeleteId(p.id)}
                        className="p-1.5 rounded-[8px] bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors shadow-2xs"
                        title="Delete Post"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-[#e8e8f0] bg-[#fafafc] flex items-center justify-between text-xs text-[#5b5b6e]">
          <span className="font-medium">Total {pagination.total ?? 0} posts</span>
          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="p-1.5 rounded-[8px] bg-white border border-[#e8e8f0] hover:bg-[#f1f1f6] disabled:opacity-40 text-[#16161d] transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="font-semibold text-[#16161d]">
              Page {pagination.page || page} of {pagination.totalPages || 1}
            </span>
            <button
              disabled={page >= pagination.totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="p-1.5 rounded-[8px] bg-white border border-[#e8e8f0] hover:bg-[#f1f1f6] disabled:opacity-40 text-[#16161d] transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Inspect Modal */}
      {inspectPost && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#e8e8f0] rounded-[22px] max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono text-[#9797ab]">Post #{inspectPost.id}</span>
                <h3 className="text-base font-bold text-[#16161d] mt-0.5">
                  {inspectPost.category?.name ?? 'Community Post Details'}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-[#f4f0ff] text-[#6d4aff] border border-[#e5dcff]">
                  {inspectPost.severity}
                </span>
                <button
                  onClick={() => setInspectPost(null)}
                  className="p-1 rounded-lg text-[#9797ab] hover:text-[#16161d] hover:bg-[#f7f7fa]"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            <div className="bg-[#fafafc] p-4 rounded-[14px] border border-[#ececf2] text-xs text-[#2b2b36] whitespace-pre-wrap leading-relaxed">
              {inspectPost.content}
            </div>

            <div className="grid grid-cols-2 gap-3 text-[11.5px] text-[#5b5b6e] bg-[#fafafc] p-3.5 rounded-[14px] border border-[#ececf2]">
              <div>
                <p className="text-[#9797ab] uppercase font-bold text-[9.5px]">Author</p>
                <p className="text-[#16161d] font-bold mt-0.5">{inspectPost.authorName}</p>
              </div>
              <div>
                <p className="text-[#9797ab] uppercase font-bold text-[9.5px]">Category</p>
                <p className="text-[#16161d] font-bold mt-0.5">{inspectPost.categoryName}</p>
              </div>
              <div>
                <p className="text-[#9797ab] uppercase font-bold text-[9.5px]">Status</p>
                <p className="text-[#16161d] font-bold mt-0.5">{inspectPost.status}</p>
              </div>
              <div>
                <p className="text-[#9797ab] uppercase font-bold text-[9.5px]">Moderation State</p>
                <p className="text-[#16161d] font-bold mt-0.5">{inspectPost.moderationState}</p>
              </div>
            </div>

            <div className="pt-2 border-t border-[#f0f0f5] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#717184] font-medium">Update status:</span>
                <button
                  disabled={actionLoading}
                  onClick={() => handleUpdateStatus(inspectPost.id, 'RESOLVED')}
                  className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-[10px] text-xs font-bold transition-colors shadow-2xs"
                >
                  Mark Resolved
                </button>
              </div>

              <button
                onClick={() => setInspectPost(null)}
                className="px-4 py-2 rounded-[10px] text-xs font-semibold text-[#5b5b6e] hover:bg-[#f7f7fa] border border-[#e8e8f0]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#e8e8f0] rounded-[22px] max-w-sm w-full p-6 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-[#16161d]">Permanently Delete Post</h3>
            <p className="text-xs text-[#5b5b6e] leading-relaxed">
              Are you sure you want to delete Post #{deleteId}? This will remove all associated solution comments and peer recommendations.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 rounded-[10px] text-xs font-semibold text-[#5b5b6e] hover:bg-[#f7f7fa] border border-[#e8e8f0]"
              >
                Cancel
              </button>
              <button
                disabled={actionLoading}
                onClick={handleDelete}
                className="px-4 py-2 rounded-[10px] text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-xs"
              >
                {actionLoading ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
