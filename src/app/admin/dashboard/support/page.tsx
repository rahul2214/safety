'use client';

import { useState, useEffect } from 'react';
import {
  supportTicketsApi,
  type AdminSupportTicket,
  type SupportTicketStats,
} from '@/portals/admin/lib/api';
import {
  LifeBuoy,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  MessageSquare,
  RefreshCw,
  X,
  Phone,
  Mail,
  User,
  Filter,
  Send,
  HelpCircle,
  Tag,
  Calendar,
} from 'lucide-react';

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<AdminSupportTicket[]>([]);
  const [stats, setStats] = useState<SupportTicketStats>({
    total: 0,
    open: 0,
    inProgress: 0,
    waitingForUser: 0,
    resolved: 0,
    closed: 0,
  });
  const [loading, setLoading] = useState(true);

  // Filters
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  // Selected Ticket Modal
  const [selectedTicket, setSelectedTicket] = useState<AdminSupportTicket | null>(null);
  const [modalStatus, setModalStatus] = useState<string>('Open');
  const [modalPriority, setModalPriority] = useState<string>('Medium');
  const [modalAdminNotes, setModalAdminNotes] = useState<string>('');
  const [modalReply, setModalReply] = useState<string>('');
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchTickets = async () => {
    setLoading(true);
    const res = await supportTicketsApi.list({
      status: statusFilter !== 'ALL' ? statusFilter : undefined,
      priority: priorityFilter !== 'ALL' ? priorityFilter : undefined,
      category: categoryFilter !== 'ALL' ? categoryFilter : undefined,
      search: search.trim() || undefined,
      limit: 100,
    });

    if (res.ok && res.data) {
      setTickets(res.data.data || []);
      if (res.data.stats) {
        setStats(res.data.stats);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTickets();
  }, [statusFilter, priorityFilter, categoryFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTickets();
  };

  const openTicketModal = (ticket: AdminSupportTicket) => {
    setSelectedTicket(ticket);
    setModalStatus(ticket.status);
    setModalPriority(ticket.priority);
    setModalAdminNotes(ticket.adminNotes || '');
    setModalReply('');
  };

  const handleSaveTicket = async () => {
    if (!selectedTicket) return;
    setSaving(true);

    const res = await supportTicketsApi.update(selectedTicket.id, {
      status: modalStatus,
      priority: modalPriority,
      adminNotes: modalAdminNotes.trim(),
      reply: modalReply.trim() || undefined,
    });

    if (res.ok && res.data) {
      setToastMessage(`Ticket ${selectedTicket.ticketCode} updated successfully.`);
      setTimeout(() => setToastMessage(null), 4000);
      setSelectedTicket(null);
      fetchTickets();
    } else {
      alert(res.error?.message || 'Failed to update ticket.');
    }
    setSaving(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Open':
        return (
          <span className="px-2.5 py-1 rounded-[8px] text-[11px] font-bold bg-[#fee2e2] text-[#e11d48] border border-[#fecdd3]">
            OPEN
          </span>
        );
      case 'In Progress':
        return (
          <span className="px-2.5 py-1 rounded-[8px] text-[11px] font-bold bg-[#fef3c7] text-[#d97706] border border-[#fde68a]">
            IN PROGRESS
          </span>
        );
      case 'Waiting for User':
        return (
          <span className="px-2.5 py-1 rounded-[8px] text-[11px] font-bold bg-[#f1edff] text-[#6d4aff] border border-[#ddd6fe]">
            WAITING FOR USER
          </span>
        );
      case 'Resolved':
        return (
          <span className="px-2.5 py-1 rounded-[8px] text-[11px] font-bold bg-[#d1fae5] text-[#059669] border border-[#a7f3d0]">
            RESOLVED
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-[8px] text-[11px] font-bold bg-[#f1f1f6] text-[#5b5b6e] border border-[#e8e8f0]">
            CLOSED
          </span>
        );
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'Critical':
      case 'High':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-red-100 text-red-700">
            {priority}
          </span>
        );
      case 'Medium':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-100 text-amber-700">
            Medium
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-slate-100 text-slate-600">
            Low
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#16161d] text-white px-4 py-3 rounded-[14px] shadow-lg flex items-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-bottom-3">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded-full bg-[#f1edff] text-[#6d4aff] text-[10px] font-black uppercase tracking-wider">
              HELP DESK
            </span>
          </div>
          <h1 className="text-2xl font-black text-[#16161d] tracking-tight">
            User Support &amp; Ticket Operations
          </h1>
          <p className="text-xs text-[#5b5b6e] mt-1">
            Review user inquiries, troubleshoot reporting issues, update ticket status, and provide official support assistance.
          </p>
        </div>

        <button
          onClick={fetchTickets}
          disabled={loading}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-[12px] bg-white border border-[#e8e8f0] text-xs font-bold text-[#16161d] hover:bg-[#f7f7fa] transition shrink-0"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          <span>Refresh Tickets</span>
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-[18px] bg-white border border-[#e8e8f0] space-y-1">
          <div className="text-[11px] font-bold text-[#5b5b6e]">Total Tickets</div>
          <div className="text-2xl font-black text-[#16161d]">{stats.total}</div>
        </div>
        <div className="p-4 rounded-[18px] bg-white border border-red-200 bg-red-50/20 space-y-1">
          <div className="text-[11px] font-bold text-red-600">Open Tickets</div>
          <div className="text-2xl font-black text-red-600">{stats.open}</div>
        </div>
        <div className="p-4 rounded-[18px] bg-white border border-amber-200 bg-amber-50/20 space-y-1">
          <div className="text-[11px] font-bold text-amber-600">In Progress</div>
          <div className="text-2xl font-black text-amber-600">{stats.inProgress}</div>
        </div>
        <div className="p-4 rounded-[18px] bg-white border border-emerald-200 bg-emerald-50/20 space-y-1">
          <div className="text-[11px] font-bold text-emerald-600">Resolved</div>
          <div className="text-2xl font-black text-emerald-600">{stats.resolved}</div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="p-4 rounded-[20px] bg-white border border-[#e8e8f0] space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search Input */}
          <form onSubmit={handleSearch} className="relative flex-1 max-w-md">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9797ab]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by code, subject, user, email, or issue..."
              className="w-full pl-9 pr-4 py-2 rounded-[12px] bg-[#f7f7fa] border border-[#e8e8f0] text-xs text-[#16161d] focus:outline-none focus:border-[#6d4aff]"
            />
          </form>

          {/* Priority & Category Selectors */}
          <div className="flex items-center gap-2">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 rounded-[12px] bg-[#f7f7fa] border border-[#e8e8f0] text-xs font-semibold text-[#5b5b6e] focus:outline-none focus:border-[#6d4aff]"
            >
              <option value="ALL">All Categories</option>
              <option value="Report Status">Report Status</option>
              <option value="Technical Problem">Technical Problem</option>
              <option value="Account / Privacy">Account / Privacy</option>
              <option value="Emergency Dispatch Help">Emergency Dispatch Help</option>
              <option value="Other">Other</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-2 rounded-[12px] bg-[#f7f7fa] border border-[#e8e8f0] text-xs font-semibold text-[#5b5b6e] focus:outline-none focus:border-[#6d4aff]"
            >
              <option value="ALL">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>

        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-[#e8e8f0]">
          {[
            { id: 'ALL', label: `All (${stats.total})` },
            { id: 'Open', label: `Open (${stats.open})` },
            { id: 'In Progress', label: `In Progress (${stats.inProgress})` },
            { id: 'Waiting for User', label: `Waiting for User (${stats.waitingForUser})` },
            { id: 'Resolved', label: `Resolved (${stats.resolved})` },
            { id: 'Closed', label: `Closed (${stats.closed})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-[10px] text-xs font-bold transition whitespace-nowrap ${
                statusFilter === tab.id
                  ? 'bg-[#6d4aff] text-white shadow-xs'
                  : 'bg-[#f7f7fa] text-[#5b5b6e] hover:text-[#16161d]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tickets Table */}
      <div className="bg-white border border-[#e8e8f0] rounded-[20px] overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-[#5b5b6e] flex items-center justify-center gap-2">
            <RefreshCw size={15} className="animate-spin" />
            <span>Loading support tickets from database...</span>
          </div>
        ) : tickets.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#5b5b6e] space-y-2">
            <LifeBuoy size={28} className="mx-auto text-[#9797ab]" />
            <p className="font-bold text-[#16161d]">No support tickets found</p>
            <p className="text-[11.5px] max-w-sm mx-auto">
              There are no tickets matching your active filter criteria. Check another status tab or clear the search query.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f7f7fa] border-b border-[#e8e8f0] text-[#5b5b6e] font-bold text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Ticket</th>
                  <th className="py-3 px-4">User Details</th>
                  <th className="py-3 px-4">Subject &amp; Category</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Submitted</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e8e8f0]">
                {tickets.map((t) => (
                  <tr key={t.id} className="hover:bg-[#fcfcff] transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#6d4aff]">
                      {t.ticketCode}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#16161d]">
                        {t.userName || 'Anonymous User'}
                      </div>
                      <div className="text-[11px] text-[#5b5b6e]">
                        {t.userEmail || (t.userId ? `User #${t.userId}` : 'No email')}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="font-bold text-[#16161d] truncate">{t.subject}</div>
                      <div className="text-[11px] text-[#9797ab] flex items-center gap-1 mt-0.5">
                        <Tag size={11} />
                        <span>{t.category}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">{getPriorityBadge(t.priority)}</td>
                    <td className="py-3.5 px-4">{getStatusBadge(t.status)}</td>
                    <td className="py-3.5 px-4 text-[11px] text-[#5b5b6e]">
                      {new Date(t.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => openTicketModal(t)}
                        className="px-3 py-1.5 rounded-[10px] bg-[#f1edff] hover:bg-[#6d4aff] hover:text-white text-[#6d4aff] font-bold text-xs transition"
                      >
                        Inspect &amp; Reply
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Ticket Details & Reply Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-[#e8e8f0] shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in-95">
            {/* Header */}
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#e8e8f0]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#6d4aff] px-2 py-0.5 rounded-full bg-[#f1edff]">
                    {selectedTicket.ticketCode}
                  </span>
                  {getStatusBadge(selectedTicket.status)}
                  {getPriorityBadge(selectedTicket.priority)}
                </div>
                <h2 className="text-lg font-black text-[#16161d] mt-2">
                  {selectedTicket.subject}
                </h2>
              </div>
              <button
                onClick={() => setSelectedTicket(null)}
                className="w-8 h-8 rounded-full bg-[#f7f7fa] hover:bg-[#e8e8f0] text-[#5b5b6e] flex items-center justify-center transition"
              >
                <X size={16} />
              </button>
            </div>

            {/* Submitter Details Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 p-3 rounded-[16px] bg-[#f7f7fa] border border-[#e8e8f0] text-xs">
              <div className="flex items-center gap-2">
                <User size={14} className="text-[#6d4aff]" />
                <div>
                  <div className="text-[10px] text-[#5b5b6e]">Submitter</div>
                  <div className="font-bold text-[#16161d]">
                    {selectedTicket.userName || 'Guest User'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Mail size={14} className="text-[#6d4aff]" />
                <div className="truncate">
                  <div className="text-[10px] text-[#5b5b6e]">Contact Email</div>
                  <div className="font-bold text-[#16161d] truncate">
                    {selectedTicket.userEmail || 'N/A'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-[#6d4aff]" />
                <div>
                  <div className="text-[10px] text-[#5b5b6e]">Submitted On</div>
                  <div className="font-bold text-[#16161d]">
                    {new Date(selectedTicket.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>

            {/* User Issue Description */}
            <div className="space-y-1.5">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#5b5b6e]">
                User Issue Description
              </div>
              <div className="p-4 rounded-[16px] bg-[#fcfcff] border border-[#e8e8f0] text-xs text-[#16161d] leading-relaxed whitespace-pre-wrap">
                {selectedTicket.description}
              </div>
            </div>

            {/* Previous Reply / Status */}
            {selectedTicket.lastReply && (
              <div className="space-y-1.5">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#5b5b6e]">
                  Current Status Note
                </div>
                <div className="p-3 rounded-[14px] bg-[#f1edff]/40 border border-[#ddd6fe] text-xs text-[#6d4aff]">
                  {selectedTicket.lastReply}
                </div>
              </div>
            )}

            {/* Admin Management Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#e8e8f0]">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#5b5b6e]">Update Status</label>
                <select
                  value={modalStatus}
                  onChange={(e) => setModalStatus(e.target.value)}
                  className="w-full px-3 py-2 rounded-[12px] bg-white border border-[#e8e8f0] text-xs font-bold text-[#16161d] focus:outline-none focus:border-[#6d4aff]"
                >
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Waiting for User">Waiting for User</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#5b5b6e]">Update Priority</label>
                <select
                  value={modalPriority}
                  onChange={(e) => setModalPriority(e.target.value)}
                  className="w-full px-3 py-2 rounded-[12px] bg-white border border-[#e8e8f0] text-xs font-bold text-[#16161d] focus:outline-none focus:border-[#6d4aff]"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
            </div>

            {/* Official Reply Message */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[#5b5b6e]">
                Post Official Response to User (Visible on User Portal)
              </label>
              <textarea
                value={modalReply}
                onChange={(e) => setModalReply(e.target.value)}
                placeholder="Type your official resolution or status message here..."
                rows={3}
                className="w-full p-3 rounded-[14px] bg-white border border-[#e8e8f0] text-xs text-[#16161d] focus:outline-none focus:border-[#6d4aff]"
              />
            </div>

            {/* Internal Admin Notes */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[#5b5b6e]">
                Internal Staff Notes (Staff only)
              </label>
              <input
                type="text"
                value={modalAdminNotes}
                onChange={(e) => setModalAdminNotes(e.target.value)}
                placeholder="e.g. Verified municipal ticket ID with city dispatch"
                className="w-full px-3 py-2 rounded-[12px] bg-[#f7f7fa] border border-[#e8e8f0] text-xs text-[#16161d] focus:outline-none focus:border-[#6d4aff]"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#e8e8f0]">
              <button
                type="button"
                onClick={() => setSelectedTicket(null)}
                className="px-4 py-2 rounded-[12px] bg-[#f7f7fa] hover:bg-[#e8e8f0] text-xs font-bold text-[#5b5b6e] transition"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSaveTicket}
                disabled={saving}
                className="flex items-center gap-1.5 px-5 py-2 rounded-[12px] bg-[#6d4aff] hover:bg-[#5325e8] text-xs font-bold text-white transition shadow-sm shadow-[#6d4aff]/30"
              >
                {saving ? (
                  <RefreshCw size={14} className="animate-spin" />
                ) : (
                  <CheckCircle2 size={14} />
                )}
                <span>Save Changes &amp; Send Reply</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
