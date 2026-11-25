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
  type StudentInvite,
  type StudentInviteInput,
  type StudentInviteQuota,
  type StudentInviteStatus,
} from '@/portals/org/lib/api';
import { useOrgId } from '@/portals/org/lib/org-context';

const STUDENT_INVITE_BADGE: Record<StudentInviteStatus, { label: string; cls: string }> = {
  QUEUED: { label: 'Queued', cls: 'bg-[#f1f1f6] text-[#3f3f4e] border-[#e8e8f0]' },
  SENT: { label: 'Sent', cls: 'bg-blue-500/15 text-blue-700 border-blue-500/30' },
  FAILED: { label: 'Send failed', cls: 'bg-rose-500/15 text-rose-700 border-rose-500/30' },
  UNDELIVERABLE: { label: 'Undeliverable', cls: 'bg-rose-500/15 text-rose-700 border-rose-500/30' },
  ACCEPTED: { label: 'Accepted', cls: 'bg-emerald-500/15 text-emerald-700 border-emerald-500/30' },
  PENDING_APPROVAL: { label: 'Needs approval', cls: 'bg-amber-500/15 text-amber-700 border-amber-500/30' },
  REVOKED: { label: 'Revoked', cls: 'bg-[#f1f1f6] text-[#5b5b6e] border-[#e8e8f0]' },
  EXPIRED: { label: 'Expired', cls: 'bg-[#f1f1f6] text-[#5b5b6e] border-[#e8e8f0]' },
};

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

/** Minimal CSV parser: commas, quoted fields ("a, b"), doubled quotes, CRLF. */
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(field); field = '';
      if (row.some((f) => f.trim() !== '')) rows.push(row);
      row = [];
    } else field += c;
  }
  row.push(field);
  if (row.some((f) => f.trim() !== '')) rows.push(row);
  return rows;
}

/**
 * Turns pasted/uploaded CSV into invite rows. Columns are found by header name when there is
 * a header (name, email, roll/roll number, department); otherwise the order
 * name, email, roll number, department is assumed.
 */
function csvToStudents(text: string): { students: StudentInviteInput[]; skipped: number } {
  const rows = parseCsv(text);
  if (rows.length === 0) return { students: [], skipped: 0 };

  const header = rows[0].map((h) => h.trim().toLowerCase());
  const hasHeader = header.some((h) => h.includes('email'));
  const find = (...keys: string[]) => header.findIndex((h) => keys.some((k) => h.includes(k)));
  const idx = hasHeader
    ? { name: find('name'), email: find('email'), roll: find('roll', 'reg', 'admission'), dept: find('dept', 'department', 'branch') }
    : { name: 0, email: 1, roll: 2, dept: 3 };

  const students: StudentInviteInput[] = [];
  let skipped = 0;
  for (const r of hasHeader ? rows.slice(1) : rows) {
    const get = (i: number) => (i >= 0 && i < r.length ? r[i].trim() : '');
    const email = get(idx.email).toLowerCase();
    const fullName = get(idx.name);
    if (!EMAIL_RE.test(email) || !fullName) { skipped++; continue; }
    students.push({
      fullName,
      email,
      rollNumber: get(idx.roll) || undefined,
      department: get(idx.dept) || undefined,
    });
  }
  return { students, skipped };
}

export default function OrganizationMembersRosterPage() {
  const orgId = useOrgId();

  const [activeTab, setActiveTab] = useState<'roster' | 'pending' | 'students' | 'invitations' | 'audit'>('roster');

  const [org, setOrg] = useState<Organization | null>(null);
  const [members, setMembers] = useState<OrganizationMember[]>([]);
  const [pendingRequests, setPendingRequests] = useState<OrganizationMember[]>([]);
  const [invitations, setInvitations] = useState<OrgInvitation[]>([]);
  const [auditLogs, setAuditLogs] = useState<OrgAuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  // Student email invitations
  const [studentInvites, setStudentInvites] = useState<StudentInvite[]>([]);
  const [quota, setQuota] = useState<StudentInviteQuota | null>(null);
  const [isStudentInviteOpen, setIsStudentInviteOpen] = useState(false);
  const [inviteMode, setInviteMode] = useState<'single' | 'csv'>('single');
  const [single, setSingle] = useState<StudentInviteInput>({ fullName: '', email: '', rollNumber: '', department: '' });
  const [csvText, setCsvText] = useState('');
  const [studentInviteError, setStudentInviteError] = useState<string | null>(null);
  const [studentInviteResult, setStudentInviteResult] = useState<string | null>(null);
  const [inviteActionError, setInviteActionError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const csvPreview = csvText.trim() ? csvToStudents(csvText) : { students: [], skipped: 0 };

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
    const [orgRes, membersRes, pendingRes, invitesRes, auditRes, studentRes, quotaRes] = await Promise.all([
      organizationsApi.getByIdOrSlug(orgId),
      organizationsApi.getMembers(orgId),
      organizationsApi.getJoinRequests(orgId),
      organizationsApi.getInvitations(orgId),
      organizationsApi.getAuditLogs(orgId),
      organizationsApi.getStudentInvites(orgId),
      organizationsApi.getStudentInviteQuota(orgId),
    ]);

    if (orgRes.data) setOrg(orgRes.data);
    if (membersRes.data) setMembers(membersRes.data);
    if (pendingRes.data) setPendingRequests(pendingRes.data);
    if (invitesRes.data) setInvitations(invitesRes.data);
    if (auditRes.data) setAuditLogs(auditRes.data);
    if (studentRes.data) setStudentInvites(studentRes.data);
    if (quotaRes.data) setQuota(quotaRes.data);
    setLoading(false);
  };

  const openStudentInvite = () => {
    setStudentInviteError(null);
    setStudentInviteResult(null);
    setSingle({ fullName: '', email: '', rollNumber: '', department: '' });
    setCsvText('');
    setIsStudentInviteOpen(true);
  };

  const handleSendStudentInvites = async (e: React.FormEvent) => {
    e.preventDefault();
    if (orgId == null) return;

    let students: StudentInviteInput[];
    if (inviteMode === 'single') {
      const email = single.email.trim().toLowerCase();
      if (!single.fullName.trim() || !EMAIL_RE.test(email)) {
        setStudentInviteError("Enter the student's name and a valid email address.");
        return;
      }
      students = [{
        fullName: single.fullName.trim(),
        email,
        rollNumber: single.rollNumber?.trim() || undefined,
        department: single.department?.trim() || undefined,
      }];
    } else {
      students = csvPreview.students;
      if (students.length === 0) {
        setStudentInviteError('No valid rows found. Each row needs a name and an email address.');
        return;
      }
    }

    setSubmitting(true);
    setStudentInviteError(null);
    const res = await organizationsApi.createStudentInvites(orgId, students);
    setSubmitting(false);

    if (!res.ok || !res.data) {
      setStudentInviteError(res.error?.message ?? 'Could not send invitations.');
      return;
    }

    const r = res.data;
    const parts = [`${r.created} invitation${r.created === 1 ? '' : 's'} queued for sending.`];
    if (r.duplicates) parts.push(`${r.duplicates} already had an open invitation.`);
    if (r.suppressed) parts.push(`${r.suppressed} skipped (address bounced or asked not to be emailed).`);
    if (r.invalid) parts.push(`${r.invalid} invalid row${r.invalid === 1 ? '' : 's'} skipped.`);
    setStudentInviteResult(parts.join(' '));
    setActiveTab('students');
    loadData();
  };

  const handleResendStudentInvite = async (inviteId: string) => {
    if (orgId == null) return;
    setInviteActionError(null);
    const res = await organizationsApi.resendStudentInvite(orgId, inviteId);
    if (!res.ok) setInviteActionError(res.error?.message ?? 'Could not resend the invitation.');
    loadData();
  };

  const handleRevokeStudentInvite = async (inviteId: string) => {
    if (orgId == null) return;
    setInviteActionError(null);
    const res = await organizationsApi.revokeStudentInvite(orgId, inviteId);
    if (!res.ok) setInviteActionError(res.error?.message ?? 'Could not revoke the invitation.');
    loadData();
  };

  useEffect(() => {
    loadData();
  }, [orgId]);

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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#e8e8f0] pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#5b5b6e] mb-1">
            <Link
              href={'/org/dashboard'}
              className="hover:text-[#16161d] transition-colors flex items-center gap-1"
            >
              <ArrowLeft size={13} />
              <span>{org?.name || 'Organization'}</span>
            </Link>
            <span>/</span>
            <span className="text-[#3f3f4e] font-semibold">Protected Roster & Access</span>
          </div>
          <h1 className="text-xl font-bold text-[#16161d] tracking-tight flex items-center gap-2.5">
            <Users className="text-rose-500" size={22} />
            <span>Organisation Membership & Security</span>
          </h1>
          <p className="text-xs text-[#5b5b6e] mt-1">
            Manage members, review join requests, issue cryptographic invite links, and review immutable audit logs.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
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
            onClick={openStudentInvite}
            className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold flex items-center gap-2 transition shadow-sm"
          >
            <Plus size={15} />
            <span>Invite Students</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-[#e8e8f0] gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('roster')}
          className={`pb-3 px-3 sm:px-4 shrink-0 whitespace-nowrap text-xs font-semibold border-b-2 flex items-center gap-2 transition ${
            activeTab === 'roster'
              ? 'border-rose-500 text-[#16161d]'
              : 'border-transparent text-[#5b5b6e] hover:text-[#16161d]'
          }`}
        >
          <Users size={15} />
          <span>Active Roster ({members.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('pending')}
          className={`pb-3 px-3 sm:px-4 shrink-0 whitespace-nowrap text-xs font-semibold border-b-2 flex items-center gap-2 transition ${
            activeTab === 'pending'
              ? 'border-amber-500 text-[#16161d]'
              : 'border-transparent text-[#5b5b6e] hover:text-[#16161d]'
          }`}
        >
          <Clock size={15} />
          <span>Pending Approvals ({pendingRequests.length})</span>
          {pendingRequests.length > 0 && (
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('students')}
          className={`pb-3 px-3 sm:px-4 shrink-0 whitespace-nowrap text-xs font-semibold border-b-2 flex items-center gap-2 transition ${
            activeTab === 'students'
              ? 'border-rose-500 text-[#16161d]'
              : 'border-transparent text-[#5b5b6e] hover:text-[#16161d]'
          }`}
        >
          <Mail size={15} />
          <span>Student Invites ({studentInvites.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('invitations')}
          className={`pb-3 px-3 sm:px-4 shrink-0 whitespace-nowrap text-xs font-semibold border-b-2 flex items-center gap-2 transition ${
            activeTab === 'invitations'
              ? 'border-orange-500 text-[#16161d]'
              : 'border-transparent text-[#5b5b6e] hover:text-[#16161d]'
          }`}
        >
          <Key size={15} />
          <span>Invitations ({invitations.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`pb-3 px-3 sm:px-4 shrink-0 whitespace-nowrap text-xs font-semibold border-b-2 flex items-center gap-2 transition ${
            activeTab === 'audit'
              ? 'border-blue-500 text-[#16161d]'
              : 'border-transparent text-[#5b5b6e] hover:text-[#16161d]'
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
              <Search size={15} className="absolute left-3.5 top-3 text-[#747488]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by student/employee name, email, or department..."
                className="w-full bg-white border border-[#e8e8f0] text-[#16161d] text-xs rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:border-rose-500 placeholder-[#9797ab]"
              />
            </div>

            <div>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full bg-white border border-[#e8e8f0] text-[#3f3f4e] text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-rose-500"
              >
                <option value="ALL">All Roles</option>
                <option value="OWNER">Owner</option>
                <option value="ORG_ADMIN">Administrator</option>
                <option value="SECURITY_OFFICER">Security Officer</option>
                <option value="MEMBER">Member (Student / Staff)</option>
              </select>
            </div>

            <div className="flex items-center justify-end text-xs text-[#5b5b6e]">
              Active Members: <span className="text-[#16161d] font-bold ml-1">{members.length}</span>
            </div>
          </div>

          <div className="bg-white border border-[#e8e8f0] rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#3f3f4e]">
                <thead className="bg-[#f7f7fa] border-b border-[#e8e8f0] text-[11px] uppercase tracking-wider text-[#5b5b6e]">
                  <tr>
                    <th className="py-3 px-4">Member Name</th>
                    <th className="py-3 px-4">Role & Status</th>
                    <th className="py-3 px-4">Department</th>
                    <th className="py-3 px-4">Joined Date</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ececf2]">
                  {filteredMembers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-10 text-[#747488]">
                        No members found in directory.
                      </td>
                    </tr>
                  ) : (
                    filteredMembers.map((m) => (
                      <tr key={m.id} className="hover:bg-[#fafafc] transition">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-xl bg-[#f1f1f6] border border-[#e8e8f0] flex items-center justify-center font-bold text-[#16161d]">
                              {m.displayName ? m.displayName[0].toUpperCase() : 'U'}
                            </div>
                            <div>
                              <div className="font-semibold text-[#16161d]">{m.displayName}</div>
                              <div className="text-[11px] text-[#5b5b6e] flex items-center gap-1">
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
                                ? 'bg-amber-500/20 text-amber-700 border border-amber-500/30'
                                : m.role === 'ORG_ADMIN'
                                ? 'bg-purple-500/20 text-purple-700 border border-purple-500/30'
                                : m.role === 'SECURITY_OFFICER'
                                ? 'bg-blue-500/20 text-blue-700 border border-blue-500/30'
                                : 'bg-emerald-500/20 text-emerald-700 border border-emerald-500/30'
                            }`}
                          >
                            {m.role}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-[#3f3f4e]">
                          <div>{m.department || 'General'}</div>
                        </td>
                        <td className="py-3.5 px-4 text-[#5b5b6e] text-[11px]">
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
                              className="px-2.5 py-1 rounded-lg bg-[#f1f1f6] hover:bg-[#e8e8f0] text-[#3f3f4e] text-[11px] font-medium transition"
                            >
                              Edit Role
                            </button>
                            <button
                              onClick={() => {
                                setRemovingMember(m);
                                setRemoveError(null);
                              }}
                              className="p-1 rounded-lg hover:bg-rose-50 text-[#747488] hover:text-rose-600 transition"
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
        <div className="bg-white border border-[#e8e8f0] rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-[#e8e8f0] bg-[#f7f7fa] flex items-center justify-between">
            <div className="text-xs font-bold text-[#3f3f4e] flex items-center gap-2">
              <Clock size={16} className="text-amber-600" />
              <span>Pending Join Requests ({pendingRequests.length})</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#3f3f4e]">
              <thead className="bg-[#f7f7fa] border-b border-[#e8e8f0] text-[11px] uppercase tracking-wider text-[#5b5b6e]">
                <tr>
                  <th className="py-3 px-4">Applicant</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Applied Date</th>
                  <th className="py-3 px-4 text-right">Decision</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ececf2]">
                {pendingRequests.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-10 text-[#747488]">
                      No pending membership requests awaiting approval.
                    </td>
                  </tr>
                ) : (
                  pendingRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-[#fafafc] transition">
                      <td className="py-3.5 px-4 font-semibold text-[#16161d]">
                        {req.displayName || 'Applicant'}
                        {req.invitedEmail && (
                          <div className="mt-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2 py-1.5 text-[11px] font-normal text-amber-800">
                            Used the emailed invite sent to <span className="font-mono">{req.invitedEmail}</span>
                            {' '}for <span className="font-semibold">{req.invitedName}</span>
                            {req.invitedRollNumber ? ` (roll ${req.invitedRollNumber})` : ''}, but signed in with a
                            different email. Approve only if this is the same student.
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-[#5b5b6e] font-mono">
                        {req.email}
                      </td>
                      <td className="py-3.5 px-4 text-[#5b5b6e] text-[11px]">
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
                            className="px-3 py-1 bg-[#f1f1f6] hover:bg-rose-50 text-[#3f3f4e] hover:text-rose-700 rounded-lg text-xs font-semibold flex items-center gap-1 transition"
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

      {/* ─── TAB: STUDENT EMAIL INVITES ─── */}
      {activeTab === 'students' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-[#e8e8f0] p-4 rounded-xl">
            <div className="text-xs text-[#3f3f4e] space-y-1">
              <span className="font-bold text-[#16161d] block">Emailed student invitations</span>
              <span className="block">
                Each student gets a single-use link that expires in 7 days. If they sign in with a different email,
                the request appears under Pending Approvals for you to confirm.
              </span>
              {quota && (
                <span className="block text-[#5b5b6e]">
                  Emails used: {quota.dayUsed}/{quota.dayLimit} today · {quota.monthUsed}/{quota.monthLimit} in 30 days
                </span>
              )}
            </div>
            <button
              onClick={openStudentInvite}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-xl flex items-center gap-2 transition shrink-0"
            >
              <Send size={14} />
              <span>Invite Students</span>
            </button>
          </div>

          {studentInviteResult && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 text-xs flex items-start gap-2">
              <CheckCircle2 size={14} className="shrink-0 mt-0.5" />
              <span>{studentInviteResult}</span>
            </div>
          )}
          {inviteActionError && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-700 text-xs flex items-start gap-2">
              <AlertCircle size={14} className="shrink-0 mt-0.5" />
              <span>{inviteActionError}</span>
            </div>
          )}

          <div className="bg-white border border-[#e8e8f0] rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#3f3f4e]">
                <thead className="bg-[#f7f7fa] border-b border-[#e8e8f0] text-[11px] uppercase tracking-wider text-[#5b5b6e]">
                  <tr>
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Roll No.</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Last emailed</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ececf2]">
                  {studentInvites.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-10 text-[#747488]">
                        No student invitations yet. Click Invite Students to add one or upload a CSV.
                      </td>
                    </tr>
                  ) : (
                    studentInvites.map((inv) => {
                      const badge = STUDENT_INVITE_BADGE[inv.status] ?? STUDENT_INVITE_BADGE.EXPIRED;
                      return (
                        <tr key={inv.id} className="hover:bg-[#fafafc] transition">
                          <td className="py-3.5 px-4 font-semibold text-[#16161d]">
                            {inv.fullName}
                            {inv.department && <span className="block text-[11px] font-normal text-[#747488]">{inv.department}</span>}
                          </td>
                          <td className="py-3.5 px-4 text-[#5b5b6e] font-mono text-[11px]">{inv.email}</td>
                          <td className="py-3.5 px-4 text-[#5b5b6e]">{inv.rollNumber || '—'}</td>
                          <td className="py-3.5 px-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] border font-semibold ${badge.cls}`}>{badge.label}</span>
                          </td>
                          <td className="py-3.5 px-4 text-[#5b5b6e] text-[11px]">
                            {inv.lastSentAt ? new Date(inv.lastSentAt).toLocaleString() : '—'}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {inv.canResend && (
                                <button
                                  onClick={() => handleResendStudentInvite(inv.id)}
                                  className="px-2.5 py-1 rounded bg-[#f1f1f6] hover:bg-[#e8e8f0] text-[#16161d] text-xs font-semibold flex items-center gap-1 transition"
                                >
                                  <RefreshCw size={12} />
                                  <span>Resend</span>
                                </button>
                              )}
                              {inv.canRevoke && (
                                <button
                                  onClick={() => handleRevokeStudentInvite(inv.id)}
                                  className="px-2.5 py-1 rounded bg-[#f1f1f6] hover:bg-rose-50 text-[#3f3f4e] hover:text-rose-800 text-xs font-semibold transition"
                                >
                                  Revoke
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 3: INVITATIONS ─── */}
      {activeTab === 'invitations' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-white border border-[#e8e8f0] p-4 rounded-xl">
            <div className="text-xs text-[#3f3f4e]">
              <span className="font-bold text-[#16161d] block">Cryptographic Invite Tokens</span>
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

          <div className="bg-white border border-[#e8e8f0] rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#3f3f4e]">
                <thead className="bg-[#f7f7fa] border-b border-[#e8e8f0] text-[11px] uppercase tracking-wider text-[#5b5b6e]">
                  <tr>
                    <th className="py-3 px-4">Role Assigned</th>
                    <th className="py-3 px-4">Restricted To Email</th>
                    <th className="py-3 px-4">Uses Count</th>
                    <th className="py-3 px-4">Status & Expiration</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ececf2]">
                  {invitations.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-10 text-[#747488]">
                        No invitations created yet. Click Create Invite Link to generate one.
                      </td>
                    </tr>
                  ) : (
                    invitations.map((inv) => (
                      <tr key={inv.uuid} className="hover:bg-[#fafafc] transition">
                        <td className="py-3.5 px-4 font-semibold text-[#16161d]">
                          <span className="px-2 py-0.5 rounded bg-[#f1f1f6] text-[#3f3f4e] text-[10px] font-bold">
                            {inv.role}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-[#5b5b6e] font-mono text-[11px]">
                          {inv.email || <span className="text-[#747488] italic">Any email</span>}
                        </td>
                        <td className="py-3.5 px-4 text-[#3f3f4e]">
                          {inv.usedCount} / {inv.maxUses}
                        </td>
                        <td className="py-3.5 px-4">
                          {inv.isRevoked ? (
                            <span className="px-2 py-0.5 rounded text-[10px] bg-rose-500/20 text-rose-700 border border-rose-500/30 font-semibold">
                              Revoked
                            </span>
                          ) : new Date(inv.expiresAt) < new Date() ? (
                            <span className="px-2 py-0.5 rounded text-[10px] bg-[#f1f1f6] text-[#5b5b6e] border border-[#e8e8f0] font-semibold">
                              Expired
                            </span>
                          ) : (
                            <span className="text-emerald-600 text-[11px]">
                              Expires {new Date(inv.expiresAt).toLocaleDateString()}
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          {!inv.isRevoked && new Date(inv.expiresAt) >= new Date() && (
                            <button
                              onClick={() => handleRevokeInvite(inv.uuid)}
                              className="px-2.5 py-1 rounded bg-[#f1f1f6] hover:bg-rose-50 text-[#3f3f4e] hover:text-rose-800 text-xs font-semibold transition"
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
        <div className="bg-white border border-[#e8e8f0] rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-[#e8e8f0] bg-[#f7f7fa] flex items-center justify-between">
            <div className="text-xs font-bold text-[#3f3f4e] flex items-center gap-2">
              <History size={16} className="text-blue-600" />
              <span>Immutable Organization Audit Trail (DPDP & CERT-In Compliant)</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#3f3f4e]">
              <thead className="bg-[#f7f7fa] border-b border-[#e8e8f0] text-[11px] uppercase tracking-wider text-[#5b5b6e]">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Actor</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Resource</th>
                  <th className="py-3 px-4">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ececf2]">
                {auditLogs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-10 text-[#747488]">
                      No audit events recorded yet.
                    </td>
                  </tr>
                ) : (
                  auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-[#fafafc] transition">
                      <td className="py-3.5 px-4 text-[#5b5b6e] text-[11px]">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-[#16161d]">
                        {log.actor}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px] text-amber-700">
                        {log.action}
                      </td>
                      <td className="py-3.5 px-4 text-[#5b5b6e] text-[11px]">
                        {log.resourceType}: {log.resourceId}
                      </td>
                      <td className="py-3.5 px-4 text-[#3f3f4e] text-[11px]">
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
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full max-h-[90vh] overflow-y-auto bg-white border border-[#e8e8f0] rounded-2xl p-5 sm:p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#e8e8f0]">
              <h3 className="text-sm font-bold text-[#16161d] flex items-center gap-2">
                <Key size={16} className="text-orange-500" />
                <span>Create Cryptographic Invite Token</span>
              </h3>
              <button
                onClick={() => setIsInviteOpen(false)}
                className="p-1 rounded-lg hover:bg-[#f1f1f6] text-[#5b5b6e]"
              >
                <X size={16} />
              </button>
            </div>

            {generatedInvite ? (
              <div className="space-y-4 text-xs">
                <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-700 flex items-center gap-2">
                  <CheckCircle2 size={16} className="shrink-0" />
                  <span>Invitation generated successfully!</span>
                </div>

                <div>
                  <label className="block text-[#5b5b6e] mb-1 font-semibold">
                    Cryptographic Raw Token (Share this once)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={generatedInvite.token || ''}
                      className="w-full bg-[#f7f7fa] border border-[#e8e8f0] rounded-xl px-3 py-2 text-[#16161d] font-mono text-xs focus:outline-none"
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
                  <span className="text-[10px] text-[#747488] mt-1 block">
                    This token is never stored in plaintext and cannot be recovered if closed.
                  </span>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => {
                      setIsInviteOpen(false);
                      setGeneratedInvite(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-[#f1f1f6] text-[#16161d] hover:bg-[#e8e8f0]"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleCreateInvite} className="space-y-3 text-xs">
                {inviteError && (
                  <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-[11px] text-rose-700">
                    {inviteError}
                  </div>
                )}

                <div>
                  <label className="block text-[#5b5b6e] mb-1 font-semibold">Role to Grant</label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value)}
                    className="w-full bg-[#f7f7fa] border border-[#e8e8f0] rounded-xl px-3 py-2 text-[#16161d] focus:outline-none focus:border-orange-500"
                  >
                    <option value="MEMBER">Member (Student / Staff)</option>
                    <option value="SECURITY_OFFICER">Security Officer / Responder</option>
                    <option value="ORG_ADMIN">Organisation Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#5b5b6e] mb-1 font-semibold">
                    Restrict to Specific Email (Optional)
                  </label>
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="Leave empty for public link"
                    className="w-full bg-[#f7f7fa] border border-[#e8e8f0] rounded-xl px-3 py-2 text-[#16161d] focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[#5b5b6e] mb-1 font-semibold">Max Uses</label>
                    <input
                      type="number"
                      min={1}
                      max={100}
                      value={inviteMaxUses}
                      onChange={(e) => setInviteMaxUses(Number(e.target.value))}
                      className="w-full bg-[#f7f7fa] border border-[#e8e8f0] rounded-xl px-3 py-2 text-[#16161d] focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[#5b5b6e] mb-1 font-semibold">Expires In (Days)</label>
                    <input
                      type="number"
                      min={1}
                      max={30}
                      value={inviteDays}
                      onChange={(e) => setInviteDays(Number(e.target.value))}
                      className="w-full bg-[#f7f7fa] border border-[#e8e8f0] rounded-xl px-3 py-2 text-[#16161d] focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsInviteOpen(false)}
                    className="px-4 py-2 rounded-xl bg-[#f1f1f6] text-[#3f3f4e] hover:bg-[#e8e8f0]"
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

      {/* ─── INVITE STUDENTS MODAL ─── */}
      {isStudentInviteOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-lg w-full max-h-[90vh] overflow-y-auto bg-white border border-[#e8e8f0] rounded-2xl p-5 sm:p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#e8e8f0]">
              <h3 className="text-sm font-bold text-[#16161d] flex items-center gap-2">
                <Mail size={16} className="text-rose-500" />
                <span>Invite Students by Email</span>
              </h3>
              <button
                onClick={() => setIsStudentInviteOpen(false)}
                className="p-1 rounded-lg hover:bg-[#f1f1f6] text-[#5b5b6e]"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>

            {studentInviteResult ? (
              <div className="space-y-4 text-xs">
                <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-700 flex items-start gap-2">
                  <CheckCircle2 size={16} className="shrink-0" />
                  <span>{studentInviteResult}</span>
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={() => setIsStudentInviteOpen(false)}
                    className="px-4 py-2 rounded-xl bg-[#f1f1f6] text-[#16161d] hover:bg-[#e8e8f0]"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSendStudentInvites} className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-1 p-1 bg-[#f7f7fa] rounded-xl border border-[#e8e8f0]">
                  {(['single', 'csv'] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => { setInviteMode(m); setStudentInviteError(null); }}
                      className={`py-2 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition ${
                        inviteMode === m ? 'bg-[#f1f1f6] text-[#16161d]' : 'text-[#5b5b6e] hover:text-[#16161d]'
                      }`}
                    >
                      {m === 'single' ? <Plus size={13} /> : <FileSpreadsheet size={13} />}
                      <span>{m === 'single' ? 'One student' : 'Upload CSV'}</span>
                    </button>
                  ))}
                </div>

                {studentInviteError && (
                  <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-[11px] text-rose-700">
                    {studentInviteError}
                  </div>
                )}

                {inviteMode === 'single' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {([
                      ['fullName', 'Full name *', 'text', 'Priya Sharma'],
                      ['email', 'Email *', 'email', 'student@example.com'],
                      ['rollNumber', 'Roll number', 'text', '21CS042'],
                      ['department', 'Department', 'text', 'Computer Science'],
                    ] as const).map(([key, label, type, ph]) => (
                      <div key={key}>
                        <label className="block text-[#5b5b6e] mb-1 font-semibold">{label}</label>
                        <input
                          type={type}
                          value={single[key] ?? ''}
                          onChange={(e) => setSingle((prev) => ({ ...prev, [key]: e.target.value }))}
                          placeholder={ph}
                          className="w-full bg-[#f7f7fa] border border-[#e8e8f0] rounded-xl px-3 py-2 text-[#16161d] focus:outline-none focus:border-rose-500 placeholder-[#9797ab]"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-[#5b5b6e]">
                      Columns: <span className="font-mono text-[#3f3f4e]">name, email, roll number, department</span>.
                      A header row is optional. Use whatever email the college has on file.
                    </p>
                    <input
                      type="file"
                      accept=".csv,text/csv"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) setCsvText(await file.text());
                      }}
                      className="block w-full text-[#5b5b6e] file:mr-3 file:rounded-lg file:border-0 file:bg-[#f1f1f6] file:px-3 file:py-2 file:text-[#16161d]"
                    />
                    <textarea
                      value={csvText}
                      onChange={(e) => setCsvText(e.target.value)}
                      rows={6}
                      placeholder={'name,email,roll number,department\nPriya Sharma,priya@example.com,21CS042,CSE'}
                      className="w-full bg-[#f7f7fa] border border-[#e8e8f0] rounded-xl px-3 py-2 text-[#16161d] font-mono text-[11px] focus:outline-none focus:border-rose-500 placeholder-[#9797ab]"
                    />
                    {csvText.trim() && (
                      <p className="text-[#5b5b6e]">
                        {csvPreview.students.length} student{csvPreview.students.length === 1 ? '' : 's'} ready
                        {csvPreview.skipped > 0 && `, ${csvPreview.skipped} row${csvPreview.skipped === 1 ? '' : 's'} skipped (missing name or invalid email)`}.
                      </p>
                    )}
                  </div>
                )}

                <p className="text-[11px] text-[#747488]">
                  Students choose whether to accept and what to share. You will see whether each invitation was
                  accepted, but not whether an address belongs to a Sabhijude account.
                </p>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsStudentInviteOpen(false)}
                    className="px-4 py-2 rounded-xl bg-[#f1f1f6] text-[#3f3f4e] hover:bg-[#e8e8f0]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <Send size={13} />
                    {submitting
                      ? 'Sending...'
                      : inviteMode === 'csv'
                        ? `Send ${csvPreview.students.length} invitation${csvPreview.students.length === 1 ? '' : 's'}`
                        : 'Send invitation'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ─── ROLE MANAGEMENT MODAL (RBAC & LAST-OWNER) ─── */}
      {editingMember && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full max-h-[90vh] overflow-y-auto bg-white border border-[#e8e8f0] rounded-2xl p-5 sm:p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#e8e8f0]">
              <h3 className="text-sm font-bold text-[#16161d] flex items-center gap-2">
                <ShieldCheck size={16} className="text-blue-500" />
                <span>Change Member Role</span>
              </h3>
              <button
                onClick={() => setEditingMember(null)}
                className="p-1 rounded-lg hover:bg-[#f1f1f6] text-[#5b5b6e]"
              >
                <X size={16} />
              </button>
            </div>

            {roleError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-700 flex items-center gap-2">
                <AlertCircle size={14} className="shrink-0" />
                <span>{roleError}</span>
              </div>
            )}

            <div>
              <span className="text-[#5b5b6e] block mb-1">Target Member:</span>
              <span className="font-bold text-[#16161d] block text-sm">{editingMember.displayName}</span>
              <span className="text-[#747488] font-mono text-[11px] block">{editingMember.email}</span>
            </div>

            <div>
              <label className="block text-[#5b5b6e] mb-1 font-semibold">Assign Role</label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className="w-full bg-[#f7f7fa] border border-[#e8e8f0] rounded-xl px-3 py-2 text-[#16161d] focus:outline-none focus:border-blue-500"
              >
                <option value="MEMBER">Member (Student / Staff)</option>
                <option value="SECURITY_OFFICER">Security Officer / Responder</option>
                <option value="ORG_ADMIN">Organisation Admin</option>
                <option value="OWNER">Owner</option>
              </select>
              <span className="text-[10px] text-[#747488] mt-1 block">
                Privilege escalation protection active. Last-owner protection ensures the organization is never orphaned.
              </span>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setEditingMember(null)}
                className="px-4 py-2 rounded-xl bg-[#f1f1f6] text-[#3f3f4e] hover:bg-[#e8e8f0]"
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
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full max-h-[90vh] overflow-y-auto bg-white border border-[#e8e8f0] rounded-2xl p-5 sm:p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#e8e8f0]">
              <h3 className="text-sm font-bold text-[#16161d] flex items-center gap-2">
                <Trash2 size={16} className="text-rose-500" />
                <span>Remove Member</span>
              </h3>
              <button
                onClick={() => setRemovingMember(null)}
                className="p-1 rounded-lg hover:bg-[#f1f1f6] text-[#5b5b6e]"
              >
                <X size={16} />
              </button>
            </div>

            {removeError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-700 flex items-center gap-2">
                <AlertCircle size={14} className="shrink-0" />
                <span>{removeError}</span>
              </div>
            )}

            <p className="text-[#3f3f4e]">
              Are you sure you want to remove <span className="font-bold text-[#16161d]">{removingMember.displayName}</span>?
              Their organization access and privacy consents will be immediately terminated.
            </p>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setRemovingMember(null)}
                className="px-4 py-2 rounded-xl bg-[#f1f1f6] text-[#3f3f4e] hover:bg-[#e8e8f0]"
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
