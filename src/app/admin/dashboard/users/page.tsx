'use client';

import { useState, useEffect } from 'react';
import { adminFetch } from '@/portals/admin/lib/api';
import {
  Users,
  Search,
  Shield,
  Ban,
  CheckCircle2,
  AlertTriangle,
  UserX,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  Loader2,
  X,
  Trash2,
} from 'lucide-react';

export default function UsersManagementPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [bannedFilter, setBannedFilter] = useState<string>('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<any>({ total: 0, totalPages: 1 });

  // Modal states
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [banModalOpen, setBanModalOpen] = useState(false);
  const [banReason, setBanReason] = useState('');
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [newRole, setNewRole] = useState('USER');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<any>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search.trim()) params.set('search', search.trim());
    if (roleFilter) params.set('role', roleFilter);
    if (bannedFilter !== '') params.set('isBanned', bannedFilter);
    params.set('page', page.toString());
    params.set('limit', '15');

    const res = await adminFetch(`/api/admin/users?${params.toString()}`);
    if (res.ok && res.data) {
      setUsers(res.data.data || []);
      setPagination(res.data.pagination || { total: 0, totalPages: 1 });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, [page, roleFilter, bannedFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  const handleBanToggle = async () => {
    if (!selectedUser) return;
    setActionLoading(true);

    if (selectedUser.isBanned) {
      const res = await adminFetch(`/api/admin/users/${selectedUser.id}/unban`, {
        method: 'POST',
      });
      if (res.ok) {
        setBanModalOpen(false);
        fetchUsers();
      }
    } else {
      const res = await adminFetch(`/api/admin/users/${selectedUser.id}/ban`, {
        method: 'POST',
        body: JSON.stringify({ reason: banReason }),
      });
      if (res.ok) {
        setBanModalOpen(false);
        setBanReason('');
        fetchUsers();
      }
    }
    setActionLoading(false);
  };

  const handleUpdateRole = async () => {
    if (!selectedUser) return;
    setActionLoading(true);

    const res = await adminFetch(`/api/admin/users/${selectedUser.id}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role: newRole }),
    });

    if (res.ok) {
      setRoleModalOpen(false);
      fetchUsers();
    }
    setActionLoading(false);
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    setActionLoading(true);

    const res = await adminFetch(`/api/admin/users/${userToDelete.id}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      setDeleteModalOpen(false);
      setUserToDelete(null);
      fetchUsers();
    } else {
      alert(res.error?.message || 'Failed to delete user.');
    }
    setActionLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="bg-white border border-[#e8e8f0] rounded-[18px] p-4 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between shadow-xs">
        <form onSubmit={handleSearch} className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-2.5 text-[#9797ab]" size={16} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or phone..."
            className="w-full bg-white border border-[#e2e2ec] text-[#16161d] rounded-[12px] pl-10 pr-4 py-2 text-xs focus:outline-none focus:border-[#6d4aff] focus:ring-2 focus:ring-[#6d4aff]/15 placeholder-[#9797ab] shadow-2xs transition-colors"
          />
        </form>

        <div className="flex items-center gap-2.5 flex-wrap">
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setPage(1);
            }}
            className="bg-white border border-[#e2e2ec] text-[#16161d] rounded-[12px] px-3.5 py-2 text-xs font-medium focus:outline-none focus:border-[#6d4aff] focus:ring-2 focus:ring-[#6d4aff]/15 shadow-2xs"
          >
            <option value="">All Roles</option>
            <option value="USER">User</option>
            <option value="EXPERT">Expert</option>
            <option value="MODERATOR">Moderator</option>
            <option value="ADMIN">Admin</option>
            <option value="SUPER_ADMIN">Super Admin</option>
          </select>

          <select
            value={bannedFilter}
            onChange={(e) => {
              setBannedFilter(e.target.value);
              setPage(1);
            }}
            className="bg-white border border-[#e2e2ec] text-[#16161d] rounded-[12px] px-3.5 py-2 text-xs font-medium focus:outline-none focus:border-[#6d4aff] focus:ring-2 focus:ring-[#6d4aff]/15 shadow-2xs"
          >
            <option value="">All Statuses</option>
            <option value="false">Active Only</option>
            <option value="true">Banned Only</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-[#e8e8f0] rounded-[18px] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#fcfcfe] text-[#717184] uppercase tracking-wider font-bold border-b border-[#e8e8f0] text-[10.5px]">
              <tr>
                <th className="px-5 py-3.5">Member</th>
                <th className="px-5 py-3.5">Role</th>
                <th className="px-5 py-3.5">Phone</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Joined</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0f0f5]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-[#5b5b6e]">
                    <Loader2 size={22} className="animate-spin inline-block text-[#6d4aff] mr-2" />
                    Loading user directory...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-[#5b5b6e]">
                    No users matching criteria found.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-[#fafafc] transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-[10px] bg-[#f4f0ff] border border-[#e5dcff] flex items-center justify-center text-[#6d4aff] font-bold text-xs shrink-0 shadow-2xs">
                          {u.displayName?.[0] || u.email?.[0] || 'U'}
                        </div>
                        <div>
                          <p className="font-bold text-[#16161d]">{u.displayName || 'Anonymous User'}</p>
                          <p className="text-[11.5px] text-[#717184]">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-[#f4f0ff] text-[#6d4aff] border border-[#e5dcff]">
                        {u.role}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-[#5b5b6e] font-mono text-[11.5px]">
                      {u.phoneNumber || '—'}
                    </td>
                    <td className="px-5 py-3.5">
                      {u.isBanned ? (
                        <span className="inline-flex items-center gap-1 text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold">
                          <Ban size={11} /> Banned
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold">
                          <CheckCircle2 size={11} /> Active
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-[#717184] text-[11.5px]">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3.5 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => {
                          setSelectedUser(u);
                          setNewRole(u.role);
                          setRoleModalOpen(true);
                        }}
                        className="px-2.5 py-1 rounded-[8px] bg-white border border-[#e8e8f0] hover:bg-[#f7f7fa] text-[#16161d] text-[11.5px] font-semibold transition-colors shadow-2xs"
                        title="Change Role"
                      >
                        Role
                      </button>
                      <button
                        onClick={() => {
                          setSelectedUser(u);
                          setBanReason(u.bannedReason || '');
                          setBanModalOpen(true);
                        }}
                        className={`px-2.5 py-1 rounded-[8px] text-[11.5px] font-bold transition-colors shadow-2xs ${
                          u.isBanned
                            ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200'
                        }`}
                        title={u.isBanned ? 'Unban Account' : 'Suspend Account'}
                      >
                        {u.isBanned ? 'Unban' : 'Ban'}
                      </button>
                      <button
                        onClick={() => {
                          setUserToDelete(u);
                          setDeleteModalOpen(true);
                        }}
                        className="p-1 rounded-[8px] bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors shadow-2xs inline-flex items-center justify-center align-middle"
                        title="Permanently Delete User"
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 border-t border-[#e8e8f0] bg-[#fafafc] flex items-center justify-between text-xs text-[#5b5b6e]">
          <span className="font-medium">Total {pagination.total ?? 0} registered users</span>
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

      {/* Role Change Modal */}
      {roleModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#e8e8f0] rounded-[22px] max-w-sm w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#16161d]">
                Update Role for {selectedUser.displayName || selectedUser.email}
              </h3>
              <button
                onClick={() => setRoleModalOpen(false)}
                className="p-1 rounded-lg text-[#9797ab] hover:text-[#16161d] hover:bg-[#f7f7fa]"
              >
                <X size={16} />
              </button>
            </div>
            <div>
              <label className="block text-[10.5px] font-bold text-[#717184] uppercase tracking-wider mb-2">
                Assigned Platform Role
              </label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className="w-full bg-white border border-[#e2e2ec] text-[#16161d] rounded-[12px] p-2.5 text-xs font-medium focus:outline-none focus:border-[#6d4aff] focus:ring-2 focus:ring-[#6d4aff]/15 shadow-2xs"
              >
                <option value="USER">User (Standard Member)</option>
                <option value="EXPERT">Expert (Verified Safety Counselor)</option>
                <option value="MODERATOR">Moderator (Community Triage)</option>
                <option value="ADMIN">Admin (Full Management)</option>
                <option value="SUPER_ADMIN">Super Admin (System Owner)</option>
              </select>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setRoleModalOpen(false)}
                className="px-4 py-2 rounded-[10px] text-xs font-semibold text-[#5b5b6e] hover:bg-[#f7f7fa] border border-[#e8e8f0]"
              >
                Cancel
              </button>
              <button
                disabled={actionLoading}
                onClick={handleUpdateRole}
                className="px-4 py-2 rounded-[10px] text-xs font-bold bg-[#6d4aff] hover:bg-[#5833e4] text-white shadow-xs"
              >
                {actionLoading ? 'Saving...' : 'Save Role'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ban / Unban Modal */}
      {banModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#e8e8f0] rounded-[22px] max-w-sm w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#16161d]">
                {selectedUser.isBanned ? 'Unban User' : 'Ban User Account'}
              </h3>
              <button
                onClick={() => setBanModalOpen(false)}
                className="p-1 rounded-lg text-[#9797ab] hover:text-[#16161d] hover:bg-[#f7f7fa]"
              >
                <X size={16} />
              </button>
            </div>
            <p className="text-xs text-[#5b5b6e]">
              {selectedUser.isBanned
                ? `Restore posting and account access for ${selectedUser.email}?`
                : `Are you sure you want to suspend ${selectedUser.email} from Sabhijude?`}
            </p>

            {!selectedUser.isBanned && (
              <div>
                <label className="block text-[10.5px] font-bold text-[#717184] uppercase tracking-wider mb-2">
                  Suspension Reason
                </label>
                <textarea
                  rows={3}
                  value={banReason}
                  onChange={(e) => setBanReason(e.target.value)}
                  placeholder="Violated community harassment policy..."
                  className="w-full bg-white border border-[#e2e2ec] text-[#16161d] rounded-[12px] p-2.5 text-xs focus:outline-none focus:border-[#6d4aff] focus:ring-2 focus:ring-[#6d4aff]/15 placeholder-[#9797ab] shadow-2xs"
                />
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setBanModalOpen(false)}
                className="px-4 py-2 rounded-[10px] text-xs font-semibold text-[#5b5b6e] hover:bg-[#f7f7fa] border border-[#e8e8f0]"
              >
                Cancel
              </button>
              <button
                disabled={actionLoading}
                onClick={handleBanToggle}
                className={`px-4 py-2 rounded-[10px] text-xs font-bold text-white shadow-xs ${
                  selectedUser.isBanned
                    ? 'bg-emerald-600 hover:bg-emerald-500'
                    : 'bg-rose-600 hover:bg-rose-500'
                }`}
              >
                {actionLoading ? 'Processing...' : selectedUser.isBanned ? 'Confirm Unban' : 'Confirm Suspension'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete User Modal */}
      {deleteModalOpen && userToDelete && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#e8e8f0] rounded-[22px] max-w-sm w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-rose-600 flex items-center gap-1.5">
                <Trash2 size={16} /> Permanently Delete User
              </h3>
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="p-1 rounded-lg text-[#9797ab] hover:text-[#16161d] hover:bg-[#f7f7fa]"
              >
                <X size={16} />
              </button>
            </div>

            <p className="text-xs text-[#5b5b6e] leading-relaxed">
              Are you sure you want to permanently delete{' '}
              <strong className="text-[#16161d]">{userToDelete.displayName || userToDelete.email}</strong> (User #{userToDelete.id})?
            </p>

            <div className="p-3 bg-rose-50 border border-rose-200 rounded-[12px] text-rose-800 text-[11px] leading-relaxed">
              <p className="font-bold mb-0.5">Warning: Irreversible Action</p>
              This will remove the user account, their distress logs, posted safety reports, and emergency preferences from the database.
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2 rounded-[10px] text-xs font-semibold text-[#5b5b6e] hover:bg-[#f7f7fa] border border-[#e8e8f0]"
              >
                Cancel
              </button>
              <button
                disabled={actionLoading}
                onClick={handleDeleteUser}
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
