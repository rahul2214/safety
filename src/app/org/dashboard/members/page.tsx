'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Users,
  Search,
  Filter,
  Plus,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  X,
  ShieldCheck,
  Mail,
  MoreVertical,
  Link as LinkIcon,
  Copy,
  Clock,
  History,
  UserCheck,
  UserX,
  ShieldAlert,
  Send,
  Trash2,
  RefreshCw,
  Key
} from 'lucide-react';
import {
  organizationsApi,
  organizationMembersApi,
  type Organization,
  type OrganizationMember,
  type OrgInvitation,
  type OrgAuditLog,
} from '@/portals/org/lib/api';
import { useOrgId } from '@/portals/org/lib/org-context';

export default function OrganizationMembersRosterPage() {
  const orgId = useOrgId();

  const [activeTab, setActiveTab] = useState<'roster' | 'pending' | 'invitations' | 'audit'>('roster');

  const [org, setOrg] = useState<Organization | null>(null);
  const [members, setMembers] = useState<OrganizationMember[]>([]);
  const [pendingRequests, setPendingRequests] = useState<OrganizationMember[]>([]);
  const [invitations, setInvitations] = useState<OrgInvitation[]>([]);
  const [auditLogs, setAuditLogs] = useState<OrgAuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  // Single Add Modal
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [formEmail, setFormEmail] = useState('');
  const [formRole, setFormRole] = useState('MEMBER');
  const [formType, setFormType] = useState('STUDENT');
  const [formDept, setFormDept] = useState('');
  const [formCode, setFormCode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  // Invite Modal
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteRole, setInviteRole] = useState('MEMBER');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteMaxUses, setInviteMaxUses] = useState(1);
  const [inviteDays, setInviteDays] = useState(7);
  const [generatedInvite, setGeneratedInvite] = useState<OrgInvitation | null>(null);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [copiedToken, setCopiedToken] = useState(false);

  // Role Edit Modal
  const [editingMember, setEditingMember] = useState<OrganizationMember | null>(null);
  const [newRole, setNewRole] = useState('');
  const [roleUpdating, setRoleUpdating] = useState(false);
  const [roleError, setRoleError] = useState<string | null>(null);

  // Remove Modal
  const [removingMember, setRemovingMember] = useState<OrganizationMember | null>(null);
  const [removeSubmitting, setRemoveSubmitting] = useState(false);
  const [removeError, setRemoveError] = useState<string | null>(null);

  const loadData = async () => {
    if (!orgId) return;
    setLoading(true);
    const [orgRes, membersRes, pendingRes, invitesRes, auditRes] = await Promise.all([
      organizationsApi.getByIdOrSlug(orgId),
      organizationsApi.getMembers(orgId),
      organizationsApi.getJoinRequests(orgId),
      organizationsApi.getInvitations(orgId),
      organizationsApi.getAuditLogs(orgId),
    ]);

    if (orgRes.data) setOrg(orgRes.data);
    if (membersRes.data) setMembers(membersRes.data);
    if (pendingRes.data) setPendingRequests(pendingRes.data);
    if (invitesRes.data) setInvitations(invitesRes.data);
    if (auditRes.data) setAuditLogs(auditRes.data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [orgId]);

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formEmail || orgId == null) return;

    setSubmitting(true);
    setAddError(null);

    const res = await organizationsApi.addMember(orgId, {
      email: formEmail,
      role: formRole,
      department: formDept,
      title: `${formType} - ${formCode || 'General'}`,
    });

    setSubmitting(false);

    if (!res.ok || !res.data) {
      setAddError(res.error?.message ?? 'Could not add this member.');
      return;
    }

    setMembers((prev) => [res.data!, ...prev]);
    setIsAddOpen(false);
    setFormEmail('');
    loadData();
  };

  const handleCreateInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgId) return;

    setSubmitting(true);
    setInviteError(null);

    const res = await organizationsApi.createInvitation(orgId, {
      role: inviteRole,
      email: inviteEmail ? inviteEmail.trim() : undefined,
      maxUses: Number(inviteMaxUses),
      expiresInDays: Number(inviteDays),
    });

    setSubmitting(false);

    if (res.ok && res.data) {
      setGeneratedInvite(res.data);
      setInvitations((prev) => [res.data!, ...prev]);
      loadData();
    } else {
      setInviteError(res.error?.message || 'Could not generate invitation.');
    }
  };

  const handleRevokeInvite = async (invitationUuid: string) => {
    if (!orgId) return;
    const res = await organizationsApi.revokeInvitation(orgId, invitationUuid);
    if (res.ok) {
      setInvitations((prev) =>
        prev.map((i) => (i.uuid === invitationUuid ? { ...i, isRevoked: true } : i))
      );
    } else {
      alert(res.error?.message || 'Could not revoke invitation.');
    }
  };

  const handleReviewPending = async (memberId: number, approve: boolean, role = 'MEMBER') => {
    if (!orgId) return;
    const res = await organizationsApi.reviewJoinRequest(orgId, memberId, { approve, role });
    if (res.ok) {
      setPendingRequests((prev) => prev.filter((p) => p.id !== memberId));
      if (approve && res.data) {
        setMembers((prev) => [res.data!, ...prev]);
      }
      loadData();
    } else {
      alert(res.error?.message || 'Failed to review join request.');
    }
  };

  const handleSaveRole = async () => {
    if (!orgId || !editingMember || !newRole) return;
    setRoleUpdating(true);
    setRoleError(null);

    const res = await organizationsApi.updateMemberRole(orgId, editingMember.id, newRole);
    setRoleUpdating(false);

    if (res.ok && res.data) {
      setMembers((prev) =>
        prev.map((m) => (m.id === editingMember.id ? { ...m, role: newRole } : m))
      );
      setEditingMember(null);
      loadData();
    } else {
      setRoleError(res.error?.message || 'Failed to update member role.');
    }
  };

  const handleConfirmRemove = async () => {
    if (!orgId || !removingMember) return;
    setRemoveSubmitting(true);
    setRemoveError(null);

    const res = await organizationMembersApi.remove(orgId, removingMember.id);
    setRemoveSubmitting(false);

    if (res.ok) {
      setMembers((prev) => prev.filter((m) => m.id !== removingMember.id));
      setRemovingMember(null);
      loadData();
    } else {
      setRemoveError(res.error?.message || 'Could not remove member.');
    }
  };

  const filteredMembers = members.filter((m) => {
    const matchesSearch =
      m.displayName?.toLowerCase().includes(search.toLowerCase()) ||
      m.email?.toLowerCase().includes(search.toLowerCase()) ||
      m.department?.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || m.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-stone-400 mb-1">
            <Link
              href={'/org/dashboard'}
              className="hover:text-stone-200 transition-colors flex items-center gap-1"
            >
              <ArrowLeft size={13} />
              <span>{org?.name || 'Organization'}</span>
            </Link>
            <span>/</span>
            <span className="text-stone-300 font-semibold">Protected Roster & Access</span>
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Users className="text-rose-500" size={22} />
            <span>Organisation Membership & Security</span>
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Manage members, review join requests, issue cryptographic invite links, and review immutable audit logs.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              setInviteError(null);
              setGeneratedInvite(null);
              setIsInviteOpen(true);
            }}
            className="px-3.5 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold flex items-center gap-2 transition shadow-md shadow-orange-950/40"
          >
            <Key size={15} />
            <span>Create Invite Link</span>
          </button>
          <button
            onClick={() => {
              setAddError(null);
              setIsAddOpen(true);
            }}
            className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold flex items-center gap-2 transition shadow-sm"
          >
            <Plus size={15} />
            <span>Add Member</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-stone-800 gap-2">
        <button
          onClick={() => setActiveTab('roster')}
          className={`pb-3 px-4 text-xs font-semibold border-b-2 flex items-center gap-2 transition ${
            activeTab === 'roster'
              ? 'border-rose-500 text-white'
              : 'border-transparent text-stone-400 hover:text-stone-300'
          }`}
        >
          <Users size={15} />
          <span>Active Roster ({members.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('pending')}
          className={`pb-3 px-4 text-xs font-semibold border-b-2 flex items-center gap-2 transition ${
            activeTab === 'pending'
              ? 'border-amber-500 text-white'
              : 'border-transparent text-stone-400 hover:text-stone-300'
          }`}
        >
          <Clock size={15} />
          <span>Pending Approvals ({pendingRequests.length})</span>
          {pendingRequests.length > 0 && (
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('invitations')}
          className={`pb-3 px-4 text-xs font-semibold border-b-2 flex items-center gap-2 transition ${
            activeTab === 'invitations'
              ? 'border-orange-500 text-white'
              : 'border-transparent text-stone-400 hover:text-stone-300'
          }`}
        >
          <Key size={15} />
          <span>Invitations ({invitations.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`pb-3 px-4 text-xs font-semibold border-b-2 flex items-center gap-2 transition ${
            activeTab === 'audit'
              ? 'border-blue-500 text-white'
              : 'border-transparent text-stone-400 hover:text-stone-300'
          }`}
        >
          <History size={15} />
          <span>Audit Trail ({auditLogs.length})</span>
        </button>
      </div>

      {/* ─── TAB 1: ACTIVE ROSTER ─── */}
      {activeTab === 'roster' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="md:col-span-2 relative">
              <Search size={15} className="absolute left-3.5 top-3 text-stone-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by student/employee name, email, or department..."
                className="w-full bg-stone-900 border border-stone-800 text-stone-200 text-xs rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:border-rose-500 placeholder-stone-500"
              />
            </div>

            <div>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full bg-stone-900 border border-stone-800 text-stone-300 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-rose-500"
              >
                <option value="ALL">All Roles</option>
                <option value="OWNER">Owner</option>
                <option value="ORG_ADMIN">Administrator</option>
                <option value="SECURITY_OFFICER">Security Officer</option>
                <option value="MEMBER">Member (Student / Staff)</option>
              </select>
            </div>

            <div className="flex items-center justify-end text-xs text-stone-400">
              Active Members: <span className="text-white font-bold ml-1">{members.length}</span>
            </div>
          </div>

          <div className="bg-stone-900/40 border border-stone-800 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-300">
                <thead className="bg-stone-950/80 border-b border-stone-800 text-[11px] uppercase tracking-wider text-stone-400">
                  <tr>
                    <th className="py-3 px-4">Member Name</th>
                    <th className="py-3 px-4">Role & Status</th>
                    <th className="py-3 px-4">Department</th>
                    <th className="py-3 px-4">Joined Date</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800/60">
                  {filteredMembers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-10 text-stone-500">
                        No members found in directory.
                      </td>
                    </tr>
                  ) : (
                    filteredMembers.map((m) => (
                      <tr key={m.id} className="hover:bg-stone-800/30 transition">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-xl bg-stone-800 border border-stone-700 flex items-center justify-center font-bold text-stone-200">
                              {m.displayName ? m.displayName[0].toUpperCase() : 'U'}
                            </div>
                            <div>
                              <div className="font-semibold text-white">{m.displayName}</div>
                              <div className="text-[11px] text-stone-400 flex items-center gap-1">
                                <Mail size={11} />
                                <span>{m.email}</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                              m.role === 'OWNER'
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                : m.role === 'ORG_ADMIN'
                                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                                : m.role === 'SECURITY_OFFICER'
                                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            }`}
                          >
                            {m.role}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-stone-300">
                          <div>{m.department || 'General'}</div>
                        </td>
                        <td className="py-3.5 px-4 text-stone-400 text-[11px]">
                          {m.joinedAt ? new Date(m.joinedAt).toLocaleDateString() : 'Active'}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setEditingMember(m);
                                setNewRole(m.role);
                                setRoleError(null);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-[11px] font-medium transition"
                            >
                              Edit Role
                            </button>
                            <button
                              onClick={() => {
                                setRemovingMember(m);
                                setRemoveError(null);
                              }}
                              className="p-1 rounded-lg hover:bg-rose-950/40 text-stone-500 hover:text-rose-400 transition"
                              title="Remove Member"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 2: PENDING APPROVALS ─── */}
      {activeTab === 'pending' && (
        <div className="bg-stone-900/40 border border-stone-800 rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-stone-800 bg-stone-950/60 flex items-center justify-between">
            <div className="text-xs font-bold text-stone-300 flex items-center gap-2">
              <Clock size={16} className="text-amber-400" />
              <span>Pending Join Requests ({pendingRequests.length})</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-300">
              <thead className="bg-stone-950/80 border-b border-stone-800 text-[11px] uppercase tracking-wider text-stone-400">
                <tr>
                  <th className="py-3 px-4">Applicant</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Applied Date</th>
                  <th className="py-3 px-4 text-right">Decision</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/60">
                {pendingRequests.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-10 text-stone-500">
                      No pending membership requests awaiting approval.
                    </td>
                  </tr>
                ) : (
                  pendingRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-stone-800/30 transition">
                      <td className="py-3.5 px-4 font-semibold text-white">
                        {req.displayName || 'Applicant'}
                      </td>
                      <td className="py-3.5 px-4 text-stone-400 font-mono">
                        {req.email}
                      </td>
                      <td className="py-3.5 px-4 text-stone-400 text-[11px]">
                        {req.joinedAt ? new Date(req.joinedAt).toLocaleDateString() : 'Recent'}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleReviewPending(req.id, true)}
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition"
                          >
                            <UserCheck size={13} />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => handleReviewPending(req.id, false)}
                            className="px-3 py-1 bg-stone-800 hover:bg-rose-950 text-stone-300 hover:text-rose-300 rounded-lg text-xs font-semibold flex items-center gap-1 transition"
                          >
                            <UserX size={13} />
                            <span>Reject</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── TAB 3: INVITATIONS ─── */}
      {activeTab === 'invitations' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-stone-900/60 border border-stone-800 p-4 rounded-xl">
            <div className="text-xs text-stone-300">
              <span className="font-bold text-white block">Cryptographic Invite Tokens</span>
              Tokens are generated using 256-bit CSPRNG entropy and stored as SHA-256 digests. Raw tokens are shown only upon creation.
            </div>
            <button
              onClick={() => {
                setInviteError(null);
                setGeneratedInvite(null);
                setIsInviteOpen(true);
              }}
              className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold rounded-xl flex items-center gap-2 transition"
            >
              <Key size={14} />
              <span>Create Invite Link</span>
            </button>
          </div>

          <div className="bg-stone-900/40 border border-stone-800 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-300">
                <thead className="bg-stone-950/80 border-b border-stone-800 text-[11px] uppercase tracking-wider text-stone-400">
                  <tr>
                    <th className="py-3 px-4">Role Assigned</th>
                    <th className="py-3 px-4">Restricted To Email</th>
                    <th className="py-3 px-4">Uses Count</th>
                    <th className="py-3 px-4">Status & Expiration</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800/60">
                  {invitations.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-10 text-stone-500">
                        No invitations created yet. Click Create Invite Link to generate one.
                      </td>
                    </tr>
                  ) : (
                    invitations.map((inv) => (
                      <tr key={inv.uuid} className="hover:bg-stone-800/30 transition">
                        <td className="py-3.5 px-4 font-semibold text-white">
                          <span className="px-2 py-0.5 rounded bg-stone-800 text-stone-300 text-[10px] font-bold">
                            {inv.role}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-stone-400 font-mono text-[11px]">
                          {inv.email || <span className="text-stone-500 italic">Any email</span>}
                        </td>
                        <td className="py-3.5 px-4 text-stone-300">
                          {inv.usedCount} / {inv.maxUses}
                        </td>
                        <td className="py-3.5 px-4">
                          {inv.isRevoked ? (
                            <span className="px-2 py-0.5 rounded text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/30 font-semibold">
                              Revoked
                            </span>
                          ) : new Date(inv.expiresAt) < new Date() ? (
                            <span className="px-2 py-0.5 rounded text-[10px] bg-stone-800 text-stone-400 border border-stone-700 font-semibold">
                              Expired
                            </span>
                          ) : (
                            <span className="text-emerald-400 text-[11px]">
                              Expires {new Date(inv.expiresAt).toLocaleDateString()}
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          {!inv.isRevoked && new Date(inv.expiresAt) >= new Date() && (
                            <button
                              onClick={() => handleRevokeInvite(inv.uuid)}
                              className="px-2.5 py-1 rounded bg-stone-800 hover:bg-rose-900/60 text-stone-300 hover:text-rose-200 text-xs font-semibold transition"
                            >
                              Revoke
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
        </div>
      )}

      {/* ─── TAB 4: AUDIT LOG VIEWER ─── */}
      {activeTab === 'audit' && (
        <div className="bg-stone-900/40 border border-stone-800 rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-stone-800 bg-stone-950/60 flex items-center justify-between">
            <div className="text-xs font-bold text-stone-300 flex items-center gap-2">
              <History size={16} className="text-blue-400" />
              <span>Immutable Organization Audit Trail (DPDP & CERT-In Compliant)</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-300">
              <thead className="bg-stone-950/80 border-b border-stone-800 text-[11px] uppercase tracking-wider text-stone-400">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Actor</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Resource</th>
                  <th className="py-3 px-4">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/60">
                {auditLogs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-10 text-stone-500">
                      No audit events recorded yet.
                    </td>
                  </tr>
                ) : (
                  auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-stone-800/30 transition">
                      <td className="py-3.5 px-4 text-stone-400 text-[11px]">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-white">
                        {log.actor}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px] text-amber-300">
                        {log.action}
                      </td>
                      <td className="py-3.5 px-4 text-stone-400 text-[11px]">
                        {log.resourceType}: {log.resourceId}
                      </td>
                      <td className="py-3.5 px-4 text-stone-300 text-[11px]">
                        {log.details || '—'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── CREATE INVITATION MODAL ─── */}
      {isInviteOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-stone-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Key size={16} className="text-orange-500" />
                <span>Create Cryptographic Invite Token</span>
              </h3>
              <button
                onClick={() => setIsInviteOpen(false)}
                className="p-1 rounded-lg hover:bg-stone-800 text-stone-400"
              >
                <X size={16} />
              </button>
            </div>

            {generatedInvite ? (
              <div className="space-y-4 text-xs">
                <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 size={16} className="shrink-0" />
                  <span>Invitation generated successfully!</span>
                </div>

                <div>
                  <label className="block text-stone-400 mb-1 font-semibold">
                    Cryptographic Raw Token (Share this once)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={generatedInvite.token || ''}
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-200 font-mono text-xs focus:outline-none"
                    />
                    <button
                      onClick={() => {
                        if (generatedInvite.token) {
                          navigator.clipboard.writeText(generatedInvite.token);
                          setCopiedToken(true);
                          setTimeout(() => setCopiedToken(false), 2000);
                        }
                      }}
                      className="px-3 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-xl flex items-center gap-1 font-semibold"
                    >
                      <Copy size={13} />
                      <span>{copiedToken ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <span className="text-[10px] text-stone-500 mt-1 block">
                    This token is never stored in plaintext and cannot be recovered if closed.
                  </span>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => {
                      setIsInviteOpen(false);
                      setGeneratedInvite(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-stone-800 text-stone-200 hover:bg-stone-700"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleCreateInvite} className="space-y-3 text-xs">
                {inviteError && (
                  <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-[11px] text-rose-300">
                    {inviteError}
                  </div>
                )}

                <div>
                  <label className="block text-stone-400 mb-1 font-semibold">Role to Grant</label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-200 focus:outline-none focus:border-orange-500"
                  >
                    <option value="MEMBER">Member (Student / Staff)</option>
                    <option value="SECURITY_OFFICER">Security Officer / Responder</option>
                    <option value="ORG_ADMIN">Organisation Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-400 mb-1 font-semibold">
                    Restrict to Specific Email (Optional)
                  </label>
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="Leave empty for public link"
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-200 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-stone-400 mb-1 font-semibold">Max Uses</label>
                    <input
                      type="number"
                      min={1}
                      max={100}
                      value={inviteMaxUses}
                      onChange={(e) => setInviteMaxUses(Number(e.target.value))}
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-200 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-400 mb-1 font-semibold">Expires In (Days)</label>
                    <input
                      type="number"
                      min={1}
                      max={30}
                      value={inviteDays}
                      onChange={(e) => setInviteDays(Number(e.target.value))}
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-200 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsInviteOpen(false)}
                    className="px-4 py-2 rounded-xl bg-stone-800 text-stone-300 hover:bg-stone-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-semibold flex items-center gap-1.5"
                  >
                    {submitting ? 'Generating...' : 'Generate Token'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ─── ROLE MANAGEMENT MODAL (RBAC & LAST-OWNER) ─── */}
      {editingMember && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck size={16} className="text-blue-500" />
                <span>Change Member Role</span>
              </h3>
              <button
                onClick={() => setEditingMember(null)}
                className="p-1 rounded-lg hover:bg-stone-800 text-stone-400"
              >
                <X size={16} />
              </button>
            </div>

            {roleError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-center gap-2">
                <AlertCircle size={14} className="shrink-0" />
                <span>{roleError}</span>
              </div>
            )}

            <div>
              <span className="text-stone-400 block mb-1">Target Member:</span>
              <span className="font-bold text-white block text-sm">{editingMember.displayName}</span>
              <span className="text-stone-500 font-mono text-[11px] block">{editingMember.email}</span>
            </div>

            <div>
              <label className="block text-stone-400 mb-1 font-semibold">Assign Role</label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-200 focus:outline-none focus:border-blue-500"
              >
                <option value="MEMBER">Member (Student / Staff)</option>
                <option value="SECURITY_OFFICER">Security Officer / Responder</option>
                <option value="ORG_ADMIN">Organisation Admin</option>
                <option value="OWNER">Owner</option>
              </select>
              <span className="text-[10px] text-stone-500 mt-1 block">
                Privilege escalation protection active. Last-owner protection ensures the organization is never orphaned.
              </span>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setEditingMember(null)}
                className="px-4 py-2 rounded-xl bg-stone-800 text-stone-300 hover:bg-stone-700"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveRole}
                disabled={roleUpdating}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition disabled:opacity-50"
              >
                {roleUpdating ? 'Updating...' : 'Save Role'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── REMOVE MEMBER MODAL ─── */}
      {removingMember && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Trash2 size={16} className="text-rose-500" />
                <span>Remove Member</span>
              </h3>
              <button
                onClick={() => setRemovingMember(null)}
                className="p-1 rounded-lg hover:bg-stone-800 text-stone-400"
              >
                <X size={16} />
              </button>
            </div>

            {removeError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-center gap-2">
                <AlertCircle size={14} className="shrink-0" />
                <span>{removeError}</span>
              </div>
            )}

            <p className="text-stone-300">
              Are you sure you want to remove <span className="font-bold text-white">{removingMember.displayName}</span>?
              Their organization access and privacy consents will be immediately terminated.
            </p>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setRemovingMember(null)}
                className="px-4 py-2 rounded-xl bg-stone-800 text-stone-300 hover:bg-stone-700"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRemove}
                disabled={removeSubmitting}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold transition disabled:opacity-50"
              >
                {removeSubmitting ? 'Removing...' : 'Confirm Remove'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
