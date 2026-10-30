'use client';

import { useState, useEffect } from 'react';
import { adminFetch } from '@/portals/admin/lib/api';
import {
  Flag,
  CheckCircle2,
  AlertCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  Loader2,
  X,
} from 'lucide-react';

export default function SafetyReportsPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [resolvedFilter, setResolvedFilter] = useState<string>('false');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<any>({ total: 0, totalPages: 1 });

  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [resolutionAction, setResolutionAction] = useState('NO_ACTION');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchReports = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (resolvedFilter !== '') params.set('resolved', resolvedFilter);
    params.set('page', page.toString());
    params.set('limit', '10');

    const res = await adminFetch(`/api/admin/moderation/reports?${params.toString()}`);
    if (res.ok && res.data) {
      setReports(res.data.data || []);
      setPagination(res.data.pagination || { total: 0, totalPages: 1 });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchReports();
  }, [page, resolvedFilter]);

  const handleResolve = async () => {
    if (!selectedReport) return;
    setActionLoading(true);

    const res = await adminFetch(`/api/admin/moderation/reports/${selectedReport.id}/resolve`, {
      method: 'PATCH',
      body: JSON.stringify({ action: resolutionAction }),
    });

    if (res.ok) {
      setSelectedReport(null);
      fetchReports();
    }
    setActionLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-[#e8e8f0] rounded-[18px] p-4 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-bold text-[#9797ab] uppercase tracking-wider mr-1">Filter:</span>
          <button
            onClick={() => {
              setResolvedFilter('false');
              setPage(1);
            }}
            className={`px-3 py-1.5 rounded-[10px] text-xs font-bold transition-all ${
              resolvedFilter === 'false'
                ? 'bg-[#6d4aff] text-white shadow-xs'
                : 'bg-[#f7f7fa] text-[#5b5b6e] hover:text-[#16161d] hover:bg-[#ededf4] border border-[#e8e8f0]'
            }`}
          >
            Pending Resolution
          </button>
          <button
            onClick={() => {
              setResolvedFilter('true');
              setPage(1);
            }}
            className={`px-3 py-1.5 rounded-[10px] text-xs font-bold transition-all ${
              resolvedFilter === 'true'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-[#f7f7fa] text-[#5b5b6e] hover:text-[#16161d] hover:bg-[#ededf4] border border-[#e8e8f0]'
            }`}
          >
            Resolved
          </button>
          <button
            onClick={() => {
              setResolvedFilter('');
              setPage(1);
            }}
            className={`px-3 py-1.5 rounded-[10px] text-xs font-bold transition-all ${
              resolvedFilter === ''
                ? 'bg-[#16161d] text-white shadow-xs'
                : 'bg-[#f7f7fa] text-[#5b5b6e] hover:text-[#16161d] hover:bg-[#ededf4] border border-[#e8e8f0]'
            }`}
          >
            All Reports
          </button>
        </div>
      </div>

      {/* Reports List */}
      <div className="bg-white border border-[#e8e8f0] rounded-[18px] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#fcfcfe] text-[#717184] uppercase tracking-wider font-bold border-b border-[#e8e8f0] text-[10.5px]">
              <tr>
                <th className="px-5 py-3.5">Report ID</th>
                <th className="px-5 py-3.5">Reason & Details</th>
                <th className="px-5 py-3.5">Target Subject</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Reported At</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0f0f5]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-[#5b5b6e]">
                    <Loader2 size={22} className="animate-spin inline-block text-[#6d4aff] mr-2" />
                    Loading community reports...
                  </td>
                </tr>
              ) : reports.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-[#5b5b6e]">
                    No safety reports found for this filter.
                  </td>
                </tr>
              ) : (
                reports.map((r) => (
                  <tr key={r.id} className="hover:bg-[#fafafc] transition-colors">
                    <td className="px-5 py-3.5 font-mono text-[#6d4aff] font-bold text-[11.5px]">
                      #{r.id}
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="font-bold text-[#16161d]">{r.reason}</p>
                      {r.details && <p className="text-[11.5px] text-[#717184] line-clamp-1 mt-0.5">{r.details}</p>}
                    </td>
                    <td className="px-5 py-3.5 text-[#5b5b6e] font-semibold text-[11.5px]">
                      {r.postId
                        ? `Post #${r.postId}`
                        : r.reportedUserId
                        ? `User #${r.reportedUserId}`
                        : r.solutionId
                        ? `Solution #${r.solutionId}`
                        : 'General Grievance'}
                    </td>
                    <td className="px-5 py-3.5">
                      {r.resolvedAt ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold">
                          <CheckCircle2 size={11} /> Resolved
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold">
                          <Clock size={11} /> Needs Review
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-[#717184] text-[11.5px]">
                      {new Date(r.createdAt).toLocaleString()}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      {!r.resolvedAt && (
                        <button
                          onClick={() => {
                            setSelectedReport(r);
                            setResolutionAction('CONTENT_REMOVED');
                          }}
                          className="px-3 py-1.5 rounded-[10px] bg-[#6d4aff] hover:bg-[#5833e4] text-white text-xs font-bold transition-colors shadow-xs"
                        >
                          Resolve
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-[#e8e8f0] bg-[#fafafc] flex items-center justify-between text-xs text-[#5b5b6e]">
          <span className="font-medium">Total {pagination.total} reports</span>
          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="p-1.5 rounded-[8px] bg-white border border-[#e8e8f0] hover:bg-[#f1f1f6] disabled:opacity-40 text-[#16161d] transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="font-semibold text-[#16161d]">
              Page {pagination.page} of {pagination.totalPages || 1}
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

      {/* Resolution Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#e8e8f0] rounded-[22px] max-w-md w-full p-6 space-y-4 shadow-xl text-[#16161d]">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#16161d]">Resolve Grievance #{selectedReport.id}</h3>
              <button
                onClick={() => setSelectedReport(null)}
                className="p-1 rounded-lg text-[#9797ab] hover:text-[#16161d] hover:bg-[#f7f7fa]"
              >
                <X size={16} />
              </button>
            </div>
            <div className="bg-[#fafafc] p-3.5 rounded-[14px] border border-[#ececf2] text-xs text-[#2b2b36] space-y-1">
              <p className="font-bold text-rose-700">Reason: {selectedReport.reason}</p>
              <p className="text-[#5b5b6e] leading-relaxed">{selectedReport.details || 'No additional details provided.'}</p>
            </div>

            <div>
              <label className="block text-[10.5px] font-bold text-[#717184] uppercase tracking-wider mb-2">
                Resolution Action Taken
              </label>
              <select
                value={resolutionAction}
                onChange={(e) => setResolutionAction(e.target.value)}
                className="w-full bg-white border border-[#e2e2ec] text-[#16161d] rounded-[12px] p-2.5 text-xs font-medium focus:outline-none focus:border-[#6d4aff] focus:ring-2 focus:ring-[#6d4aff]/15 shadow-2xs"
              >
                <option value="CONTENT_REMOVED">Content Removed & Warning Issued</option>
                <option value="USER_BANNED">Offending Account Suspended</option>
                <option value="DISMISSED_FALSE_REPORT">Dismissed (Did Not Violate Policy)</option>
                <option value="NO_ACTION">Addressed via Support Note</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedReport(null)}
                className="px-4 py-2 rounded-[10px] text-xs font-semibold text-[#5b5b6e] hover:bg-[#f7f7fa] border border-[#e8e8f0]"
              >
                Cancel
              </button>
              <button
                disabled={actionLoading}
                onClick={handleResolve}
                className="px-4 py-2 rounded-[10px] text-xs font-bold bg-[#059669] hover:bg-[#047857] text-white shadow-xs"
              >
                {actionLoading ? 'Saving...' : 'Mark as Resolved'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
