'use client';

import { useState, useEffect } from 'react';
import { adminFetch } from '@/portals/admin/lib/api';
import {
  ShieldAlert,
  CheckCircle,
  XCircle,
  Trash2,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Eye,
  Filter,
} from 'lucide-react';

export default function ModerationQueuePage() {
  const [queue, setQueue] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [riskFilter, setRiskFilter] = useState('');
  const [stateFilter, setStateFilter] = useState('PENDING');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<any>({ total: 0, totalPages: 1 });

  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [actionNote, setActionNote] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchQueue = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (stateFilter) params.set('state', stateFilter);
    if (riskFilter) params.set('risk', riskFilter);
    params.set('page', page.toString());
    params.set('limit', '10');

    const res = await adminFetch(`/api/admin/moderation/queue?${params.toString()}`);
    if (res.ok && res.data) {
      setQueue(res.data.data || []);
      setPagination(res.data.pagination || { total: 0, totalPages: 1 });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchQueue();
  }, [page, stateFilter, riskFilter]);

  const handleModeration = async (postId: number, action: 'APPROVE' | 'REJECT' | 'REMOVE') => {
    setActionLoading(true);
    const res = await adminFetch(`/api/admin/moderation/posts/${postId}/action`, {
      method: 'POST',
      body: JSON.stringify({ action, note: actionNote }),
    });

    if (res.ok) {
      setSelectedPost(null);
      setActionNote('');
      fetchQueue();
    }
    setActionLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* Queue Filters */}
      <div className="bg-white border border-[#e8e8f0] rounded-[18px] p-4 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between shadow-xs">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-bold text-[#9797ab] uppercase tracking-wider mr-1">Status:</span>
          {['PENDING', 'REVIEW', 'REJECTED', 'APPROVED'].map((st) => (
            <button
              key={st}
              onClick={() => {
                setStateFilter(st);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-[10px] text-xs font-bold transition-all ${
                stateFilter === st
                  ? 'bg-[#6d4aff] text-white shadow-xs'
                  : 'bg-[#f7f7fa] text-[#5b5b6e] hover:text-[#16161d] hover:bg-[#ededf4] border border-[#e8e8f0]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Filter size={14} className="text-[#9797ab]" />
          <select
            value={riskFilter}
            onChange={(e) => {
              setRiskFilter(e.target.value);
              setPage(1);
            }}
            className="bg-white border border-[#e2e2ec] text-[#16161d] rounded-[12px] px-3 py-1.5 text-xs font-medium focus:outline-none focus:border-[#6d4aff] focus:ring-2 focus:ring-[#6d4aff]/15 shadow-2xs"
          >
            <option value="">All Risk Levels</option>
            <option value="CRITICAL">Critical Risk</option>
            <option value="HIGH">High Risk</option>
            <option value="MEDIUM">Medium Risk</option>
            <option value="LOW">Low Risk</option>
          </select>
        </div>
      </div>

      {/* Queue Items */}
      <div className="space-y-4">
        {loading ? (
          <div className="bg-white border border-[#e8e8f0] rounded-[18px] p-12 text-center text-[#5b5b6e] text-xs shadow-xs">
            <Loader2 size={24} className="animate-spin inline-block text-[#6d4aff] mb-2" />
            <p>Loading moderation triage items...</p>
          </div>
        ) : queue.length === 0 ? (
          <div className="bg-white border border-[#e8e8f0] rounded-[18px] p-12 text-center text-[#5b5b6e] text-xs shadow-xs flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-[14px] bg-[#ecfdf5] text-[#059669] flex items-center justify-center mb-1">
              <CheckCircle size={26} />
            </div>
            <p className="font-bold text-[#16161d] text-sm">Moderation Queue is Clean</p>
            <span className="text-[#717184]">No safety reports or posts are currently awaiting staff review.</span>
          </div>
        ) : (
          queue.map((post) => (
            <div
              key={post.id}
              className="bg-white border border-[#e8e8f0] rounded-[18px] p-6 hover:border-[#6d4aff]/40 hover:shadow-md transition-all space-y-4 shadow-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-bold uppercase tracking-wider border ${
                        post.riskLevel === 'CRITICAL' || post.riskLevel === 'HIGH'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                    >
                      {post.riskLevel || 'STANDARD'} RISK
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-[#f4f0ff] text-[#6d4aff] border border-[#e5dcff]">
                      State: {post.moderationState}
                    </span>
                    <span className="text-[11.5px] text-[#9797ab] font-medium">
                      Post #{post.id} &bull; {new Date(post.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-[#16161d] leading-relaxed whitespace-pre-wrap">{post.content}</p>
                </div>

                {/* Quick Action Buttons */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    disabled={actionLoading}
                    onClick={() => handleModeration(post.id, 'APPROVE')}
                    className="px-3 py-1.5 rounded-[10px] bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
                  >
                    <CheckCircle size={14} /> Approve
                  </button>
                  <button
                    disabled={actionLoading}
                    onClick={() => handleModeration(post.id, 'REJECT')}
                    className="px-3 py-1.5 rounded-[10px] bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
                  >
                    <XCircle size={14} /> Reject
                  </button>
                  <button
                    disabled={actionLoading}
                    onClick={() => handleModeration(post.id, 'REMOVE')}
                    className="px-3 py-1.5 rounded-[10px] bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
                  >
                    <Trash2 size={14} /> Remove
                  </button>
                </div>
              </div>

              {/* Inner Post Content Container */}
              <div className="bg-[#fafafc] border border-[#ececf2] rounded-[14px] p-4 text-xs text-[#2b2b36] leading-relaxed whitespace-pre-wrap">
                {post.content}
              </div>

              {/* Meta details */}
              <div className="flex items-center justify-between text-[11.5px] text-[#717184] pt-1 border-t border-[#f0f0f5]">
                <span className="font-medium">
                  Author: <span className="text-[#16161d] font-bold">{post.isAnonymous ? 'Anonymous Member' : `User #${post.authorId}`}</span>
                </span>
                <span>Severity: <span className="font-semibold text-[#16161d]">{post.severity}</span> &bull; Status: <span className="font-semibold text-[#16161d]">{post.status}</span></span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination Footer */}
      <div className="bg-white border border-[#e8e8f0] rounded-[16px] p-4 flex items-center justify-between text-xs text-[#5b5b6e] shadow-xs">
        <span className="font-medium">Total {pagination.total} queue records</span>
        <div className="flex items-center gap-2">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="p-1.5 rounded-[8px] bg-white border border-[#e8e8f0] hover:bg-[#f7f7fa] disabled:opacity-40 text-[#16161d] transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="font-semibold text-[#16161d]">
            Page {pagination.page} of {pagination.totalPages || 1}
          </span>
          <button
            disabled={page >= pagination.totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="p-1.5 rounded-[8px] bg-white border border-[#e8e8f0] hover:bg-[#f7f7fa] disabled:opacity-40 text-[#16161d] transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
