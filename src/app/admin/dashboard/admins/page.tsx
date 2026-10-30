'use client';

import { useState, useEffect } from 'react';
import { adminFetch } from '@/portals/admin/lib/api';
import { useAdminAuth } from '@/portals/admin/lib/auth-context';
import {
  ShieldCheck,
  Plus,
  Trash2,
  Lock,
  Mail,
  User,
  AlertCircle,
  Loader2,
  Shield,
  CheckCircle2,
  X,
} from 'lucide-react';

export default function AdminStaffManagementPage() {
  const { admin } = useAdminAuth();
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // New admin modal
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'ADMIN' | 'MODERATOR'>('ADMIN');
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchAdmins = async () => {
    setLoading(true);
    const res = await adminFetch('/api/admin/admins');
    if (res.ok && res.data) {
      setAdmins(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setActionLoading(true);

    const res = await adminFetch('/api/admin/admins', {
      method: 'POST',
      body: JSON.stringify({ email, fullName, password, role }),
    });

    if (res.ok) {
      setCreateModalOpen(false);
      setEmail('');
      setFullName('');
      setPassword('');
      fetchAdmins();
    } else {
      setError(res.error?.message || 'Failed to create administrator account.');
    }
    setActionLoading(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to remove administrative access for this staff member?')) return;

    const res = await adminFetch(`/api/admin/admins/${id}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      fetchAdmins();
    } else {
      alert(res.error?.message || 'Failed to delete staff member.');
    }
  };

  if (admin?.role !== 'SUPER_ADMIN') {
    return (
      <div className="bg-white border border-[#e8e8f0] rounded-[18px] p-12 text-center text-[#5b5b6e] text-xs flex flex-col items-center gap-2 shadow-xs">
        <div className="w-12 h-12 rounded-[14px] bg-[#f4f0ff] text-[#6d4aff] flex items-center justify-center mb-1">
          <Shield size={26} />
        </div>
        <span className="font-bold text-[#16161d] text-sm">Restricted Section</span>
        <span>Only Super Administrators have authority to manage staff and system roles.</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white border border-[#e8e8f0] rounded-[18px] p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-xs">
        <p className="text-xs text-[#5b5b6e] font-medium">
          Super Admin panel: Provision, rotate, or terminate administrative and moderation credentials.
        </p>
        <button
          onClick={() => {
            setError('');
            setCreateModalOpen(true);
          }}
          className="px-4 py-2 rounded-[12px] bg-[#6d4aff] hover:bg-[#5833e4] text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs shrink-0"
        >
          <Plus size={15} /> Add Staff Admin
        </button>
      </div>

      {/* Admins Table */}
      <div className="bg-white border border-[#e8e8f0] rounded-[18px] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#fcfcfe] text-[#717184] uppercase tracking-wider font-bold border-b border-[#e8e8f0] text-[10.5px]">
              <tr>
                <th className="px-5 py-3.5">Administrator</th>
                <th className="px-5 py-3.5">Assigned Role</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Last Sign-In</th>
                <th className="px-5 py-3.5">Created</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0f0f5]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-[#5b5b6e]">
                    <Loader2 size={22} className="animate-spin inline-block text-[#6d4aff] mr-2" />
                    Loading staff directory...
                  </td>
                </tr>
              ) : (
                admins.map((item) => (
                  <tr key={item.id} className="hover:bg-[#fafafc] transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-[10px] bg-[#f4f0ff] border border-[#e5dcff] flex items-center justify-center text-[#6d4aff] font-bold text-xs shrink-0 shadow-2xs">
                          {item.fullName?.[0] || 'A'}
                        </div>
                        <div>
                          <p className="font-bold text-[#16161d]">{item.fullName}</p>
                          <p className="text-[11.5px] text-[#717184] font-mono">{item.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-bold border ${
                          item.role === 'SUPER_ADMIN'
                            ? 'bg-purple-50 text-purple-700 border-purple-200'
                            : item.role === 'ADMIN'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-[#fafafc] text-[#5b5b6e] border-[#e8e8f0]'
                        }`}
                      >
                        {item.role}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      {item.isActive ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold">
                          <CheckCircle2 size={11} /> Active
                        </span>
                      ) : (
                        <span className="text-[#9797ab] text-[10.5px] font-medium">Suspended</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-[#717184] text-[11.5px]">
                      {item.lastLoginAt ? new Date(item.lastLoginAt).toLocaleString() : 'Never'}
                    </td>
                    <td className="px-5 py-3.5 text-[#717184] text-[11.5px]">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      {item.id !== admin.id && item.role !== 'SUPER_ADMIN' && (
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 rounded-[8px] bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors shadow-2xs"
                          title="Revoke Access"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleCreate}
            className="bg-white border border-[#e8e8f0] rounded-[22px] max-w-sm w-full p-6 space-y-4 shadow-xl text-[#16161d]"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#16161d]">Provision Admin Credentials</h3>
              <button
                type="button"
                onClick={() => setCreateModalOpen(false)}
                className="p-1 rounded-lg text-[#9797ab] hover:text-[#16161d] hover:bg-[#f7f7fa]"
              >
                <X size={16} />
              </button>
            </div>

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-[12px] flex items-center gap-2 text-rose-700 text-xs">
                <AlertCircle size={15} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-[10.5px] font-bold text-[#717184] uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 text-[#9797ab]" size={15} />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Security Lead"
                  className="w-full bg-white border border-[#e2e2ec] text-[#16161d] rounded-[12px] pl-9 pr-3 py-2 text-xs font-medium focus:outline-none focus:border-[#6d4aff] focus:ring-2 focus:ring-[#6d4aff]/15 shadow-2xs placeholder-[#9797ab]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10.5px] font-bold text-[#717184] uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 text-[#9797ab]" size={15} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="moderator@sabhijude.com"
                  className="w-full bg-white border border-[#e2e2ec] text-[#16161d] rounded-[12px] pl-9 pr-3 py-2 text-xs font-medium focus:outline-none focus:border-[#6d4aff] focus:ring-2 focus:ring-[#6d4aff]/15 shadow-2xs placeholder-[#9797ab]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10.5px] font-bold text-[#717184] uppercase tracking-wider mb-1.5">
                Initial Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 text-[#9797ab]" size={15} />
                <input
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white border border-[#e2e2ec] text-[#16161d] rounded-[12px] pl-9 pr-3 py-2 text-xs font-medium focus:outline-none focus:border-[#6d4aff] focus:ring-2 focus:ring-[#6d4aff]/15 shadow-2xs placeholder-[#9797ab]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10.5px] font-bold text-[#717184] uppercase tracking-wider mb-1.5">
                Staff Role
              </label>
              <select
                value={role}
                onChange={(e: any) => setRole(e.target.value)}
                className="w-full bg-white border border-[#e2e2ec] text-[#16161d] rounded-[12px] p-2.5 text-xs font-medium focus:outline-none focus:border-[#6d4aff] focus:ring-2 focus:ring-[#6d4aff]/15 shadow-2xs"
              >
                <option value="ADMIN">Administrator (Full Access)</option>
                <option value="MODERATOR">Moderator (Queue Triage Only)</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setCreateModalOpen(false)}
                className="px-4 py-2 rounded-[10px] text-xs font-semibold text-[#5b5b6e] hover:bg-[#f7f7fa] border border-[#e8e8f0]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={actionLoading}
                className="px-4 py-2 rounded-[10px] text-xs font-bold bg-[#6d4aff] hover:bg-[#5833e4] text-white shadow-xs"
              >
                {actionLoading ? 'Creating...' : 'Create Account'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
