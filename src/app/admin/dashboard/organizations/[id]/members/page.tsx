'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Users,
  Search,
  Filter,
  Plus,
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  X,
  ShieldCheck,
  GraduationCap,
  Briefcase,
  Mail,
  Phone,
  MoreVertical,
  Download,
} from 'lucide-react';
import {
  organizationsApi,
  type Organization,
  type OrganizationMember,
} from '@/portals/admin/lib/api';

export default function OrganizationMembersRosterPage() {
  const params = useParams();
  const orgId = Number(params?.id);

  const [org, setOrg] = useState<Organization | null>(null);
  const [members, setMembers] = useState<OrganizationMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');

  // Single Add Modal
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [formEmail, setFormEmail] = useState('');
  const [formName, setFormName] = useState('');
  const [formRole, setFormRole] = useState('MEMBER');
  const [formType, setFormType] = useState('STUDENT');
  const [formDept, setFormDept] = useState('');
  const [formCode, setFormCode] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Bulk CSV Upload Modal
  const [isBulkOpen, setIsBulkOpen] = useState(false);
  const [csvText, setCsvText] = useState('');
  const [bulkResult, setBulkResult] = useState<{ added: number; errors: string[] } | null>(null);

  const loadData = async () => {
    if (!orgId) return;
    setLoading(true);
    const [orgRes, membersRes] = await Promise.all([
      organizationsApi.getByIdOrSlug(orgId),
      organizationsApi.getMembers(orgId),
    ]);

    if (orgRes.data) setOrg(orgRes.data);
    if (membersRes.data) setMembers(membersRes.data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [orgId]);

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formEmail) return;
    setSubmitting(true);

    const res = await organizationsApi.addMember(orgId, {
      email: formEmail,
      role: formRole,
      department: formDept,
      title: `${formType} - ${formCode || 'General'}`,
    });

    setSubmitting(false);
    if (res.data) {
      setMembers((prev) => [res.data!, ...prev]);
      setIsAddOpen(false);
      setFormEmail('');
      setFormName('');
      setFormCode('');
    }
  };

  const handleBulkImport = async () => {
    if (!csvText.trim()) return;
    setSubmitting(true);
    const lines = csvText.trim().split('\n');
    let added = 0;
    const errors: string[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line || line.startsWith('email,')) continue; // skip header or blanks

      const parts = line.split(',').map((p) => p.trim());
      const [email, name, role, dept, memberType] = parts;

      if (!email || !email.includes('@')) {
        errors.push(`Line ${i + 1}: Invalid email '${email}'`);
        continue;
      }

      const res = await organizationsApi.addMember(orgId, {
        email,
        role: role || 'MEMBER',
        department: dept || 'General',
        title: memberType || 'Enrolled Member',
      });

      if (res.data) {
        added++;
        setMembers((prev) => [res.data!, ...prev]);
      } else {
        errors.push(`Line ${i + 1}: Could not add ${email}`);
      }
    }

    setSubmitting(false);
    setBulkResult({ added, errors });
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
    <div className="space-y-6 select-none">
      {/* Header Banner */}
      <div className="bg-white border border-[#e8e8f0] p-6 rounded-[20px] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#5b5b6e] mb-1.5 font-semibold">
            <Link
              href={`/admin/dashboard/organizations/${orgId}`}
              className="hover:text-[#6d4aff] transition-colors flex items-center gap-1"
            >
              <ArrowLeft size={13} />
              <span>{org?.name || 'Organization'}</span>
            </Link>
            <span>/</span>
            <span className="text-[#16161d]">Protected Roster</span>
          </div>
          <h1 className="text-xl font-black text-[#16161d] tracking-tight flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-[10px] bg-[#f1edff] text-[#6d4aff] flex items-center justify-center">
              <Users size={18} />
            </div>
            <span>Students & Employees Directory</span>
          </h1>
          <p className="text-xs text-[#5b5b6e] mt-1">
            Manage organization members, verify safety statuses, and monitor real-time protection coverage.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsBulkOpen(true)}
            className="px-3.5 py-2.5 rounded-[12px] bg-white hover:bg-[#f7f7fa] text-[#16161d] border border-[#e8e8f0] text-xs font-bold flex items-center gap-2 transition shadow-2xs"
          >
            <FileSpreadsheet size={15} className="text-emerald-600" />
            <span>Bulk CSV Import</span>
          </button>
          <button
            onClick={() => setIsAddOpen(true)}
            className="px-3.5 py-2.5 rounded-[12px] bg-[#6d4aff] hover:bg-[#5325e8] text-white text-xs font-bold flex items-center gap-2 transition shadow-sm"
          >
            <Plus size={15} />
            <span>Add Member</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-white border border-[#e8e8f0] p-3 rounded-[16px] shadow-xs">
        <div className="md:col-span-2 relative">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9797ab]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by student/employee name, email, or department..."
            className="w-full bg-[#f7f7fa] border border-[#e8e8f0] text-[#16161d] text-xs rounded-[12px] pl-9 pr-4 py-2 focus:outline-none focus:border-[#6d4aff] focus:bg-white placeholder-[#9797ab]"
          />
        </div>

        <div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full bg-[#f7f7fa] border border-[#e8e8f0] text-[#16161d] text-xs rounded-[12px] px-3 py-2 focus:outline-none focus:border-[#6d4aff] focus:bg-white font-medium"
          >
            <option value="ALL">All Roles</option>
            <option value="OWNER">Owner</option>
            <option value="ORG_ADMIN">Administrator</option>
            <option value="SECURITY_OFFICER">Security Officer</option>
            <option value="MEMBER">Member (Student / Staff)</option>
          </select>
        </div>

        <div className="flex items-center justify-end text-xs text-[#5b5b6e] font-medium pr-2">
          Total Enrolled: <span className="text-[#16161d] font-black ml-1.5">{members.length}</span>
        </div>
      </div>

      {/* Roster Table */}
      <div className="bg-white border border-[#e8e8f0] rounded-[20px] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#16161d]">
            <thead className="bg-[#f7f7fa] border-b border-[#e8e8f0] text-[11px] uppercase tracking-wider text-[#747488] font-bold">
              <tr>
                <th className="py-3 px-4">Member Name</th>
                <th className="py-3 px-4">Role & Status</th>
                <th className="py-3 px-4">Department / Program</th>
                <th className="py-3 px-4">Safety Telemetry</th>
                <th className="py-3 px-4">Enrollment Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e8e8f0]">
              {filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-[#747488]">
                    No members match your criteria.
                  </td>
                </tr>
              ) : (
                filteredMembers.map((m) => (
                  <tr key={m.id} className="hover:bg-[#fafafc] transition">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-[10px] bg-[#f1edff] border border-[#ddd6fe] flex items-center justify-center font-bold text-[#6d4aff]">
                          {m.displayName ? m.displayName[0].toUpperCase() : 'U'}
                        </div>
                        <div>
                          <div className="font-bold text-[#16161d]">{m.displayName}</div>
                          <div className="text-[11px] text-[#5b5b6e] flex items-center gap-1 font-mono">
                            <Mail size={11} className="text-[#9797ab]" />
                            <span>{m.email}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded-[6px] text-[10px] font-bold ${
                            m.role === 'OWNER' || m.role === 'ORG_ADMIN'
                              ? 'bg-[#f1edff] text-[#6d4aff] border border-[#ddd6fe]'
                              : m.role === 'SECURITY_OFFICER'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}
                        >
                          {m.role}
                        </span>
                        <span className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                          Active
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-[#16161d]">
                      <div className="font-medium">{m.department || 'General'}</div>
                      <div className="text-[10px] text-[#747488]">{m.title || 'Standard Plan'}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[6px] bg-[#f7f7fa] text-[10px] text-[#5b5b6e] border border-[#e8e8f0]">
                        <ShieldCheck size={12} className="text-emerald-600" />
                        <span>Protected (24/7)</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[#5b5b6e] text-[11px] font-mono">
                      {new Date(m.joinedAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button className="p-1.5 rounded-[8px] hover:bg-[#f7f7fa] text-[#9797ab] hover:text-[#16161d]">
                        <MoreVertical size={15} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Single Member Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white border border-[#e8e8f0] rounded-[22px] p-6 shadow-xl text-[#16161d]">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#e8e8f0]">
              <h3 className="text-sm font-bold text-[#16161d] flex items-center gap-2">
                <Users size={16} className="text-[#6d4aff]" />
                <span>Enroll Member (Student or Employee)</span>
              </h3>
              <button
                onClick={() => setIsAddOpen(false)}
                className="p-1.5 rounded-[10px] hover:bg-[#f7f7fa] text-[#9797ab] hover:text-[#16161d]"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAddMember} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#16161d] mb-1 font-semibold">Institutional Email</label>
                <input
                  type="email"
                  required
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  placeholder="student@university.edu or emp@corp.com"
                  className="w-full bg-[#f7f7fa] border border-[#e8e8f0] rounded-[12px] px-3 py-2 text-[#16161d] focus:outline-none focus:border-[#6d4aff] focus:bg-white placeholder-[#9797ab]"
                />
              </div>

              <div>
                <label className="block text-[#16161d] mb-1 font-semibold">Member Type</label>
                <select
                  value={formType}
                  onChange={(e) => setFormType(e.target.value)}
                  className="w-full bg-[#f7f7fa] border border-[#e8e8f0] rounded-[12px] px-3 py-2 text-[#16161d] focus:outline-none focus:border-[#6d4aff] focus:bg-white"
                >
                  <option value="STUDENT">Student</option>
                  <option value="EMPLOYEE">Corporate Employee</option>
                  <option value="FACULTY">Faculty / Professor</option>
                  <option value="STAFF">Campus Staff / Resident</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[#16161d] mb-1 font-semibold">Role</label>
                  <select
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value)}
                    className="w-full bg-[#f7f7fa] border border-[#e8e8f0] rounded-[12px] px-3 py-2 text-[#16161d] focus:outline-none focus:border-[#6d4aff] focus:bg-white"
                  >
                    <option value="MEMBER">Member</option>
                    <option value="SECURITY_OFFICER">Security Officer</option>
                    <option value="ORG_ADMIN">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#16161d] mb-1 font-semibold">Roll No / Emp ID</label>
                  <input
                    type="text"
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value)}
                    placeholder="e.g. CS2026-089"
                    className="w-full bg-[#f7f7fa] border border-[#e8e8f0] rounded-[12px] px-3 py-2 text-[#16161d] focus:outline-none focus:border-[#6d4aff] focus:bg-white placeholder-[#9797ab]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#16161d] mb-1 font-semibold">Department / Faculty</label>
                <input
                  type="text"
                  value={formDept}
                  onChange={(e) => setFormDept(e.target.value)}
                  placeholder="e.g. Computer Science / Engineering"
                  className="w-full bg-[#f7f7fa] border border-[#e8e8f0] rounded-[12px] px-3 py-2 text-[#16161d] focus:outline-none focus:border-[#6d4aff] focus:bg-white placeholder-[#9797ab]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 rounded-[12px] bg-white border border-[#e8e8f0] text-[#5b5b6e] hover:text-[#16161d] font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-[12px] bg-[#6d4aff] hover:bg-[#5325e8] text-white font-bold flex items-center gap-1.5 shadow-sm transition"
                >
                  {submitting ? 'Enrolling...' : 'Confirm Enrollment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk CSV Upload Modal */}
      {isBulkOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="max-w-lg w-full bg-white border border-[#e8e8f0] rounded-[22px] p-6 shadow-xl text-[#16161d]">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#e8e8f0]">
              <h3 className="text-sm font-bold text-[#16161d] flex items-center gap-2">
                <FileSpreadsheet size={16} className="text-emerald-600" />
                <span>Bulk CSV Student / Employee Onboarding</span>
              </h3>
              <button
                onClick={() => {
                  setIsBulkOpen(false);
                  setBulkResult(null);
                }}
                className="p-1.5 rounded-[10px] hover:bg-[#f7f7fa] text-[#9797ab] hover:text-[#16161d]"
              >
                <X size={16} />
              </button>
            </div>

            {bulkResult ? (
              <div className="space-y-4 text-xs">
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-[14px] text-emerald-800 flex items-center gap-2 font-semibold">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                  <span>Successfully enrolled {bulkResult.added} members!</span>
                </div>

                {bulkResult.errors.length > 0 && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-[14px] text-rose-800 space-y-1">
                    <div className="font-bold flex items-center gap-1">
                      <AlertCircle size={14} className="text-rose-600 shrink-0" />
                      <span>Errors Encountered:</span>
                    </div>
                    {bulkResult.errors.map((err, idx) => (
                      <div key={idx} className="text-[11px] opacity-90">
                        {err}
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex justify-end">
                  <button
                    onClick={() => {
                      setIsBulkOpen(false);
                      setBulkResult(null);
                      setCsvText('');
                    }}
                    className="px-4 py-2 rounded-[12px] bg-[#6d4aff] hover:bg-[#5325e8] text-white font-bold shadow-sm"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                <p className="text-[#5b5b6e]">
                  Paste comma-separated rows with format:{' '}
                  <code className="text-[#16161d] bg-[#f7f7fa] px-1 py-0.5 rounded border border-[#e8e8f0] font-semibold">
                    email,name,role,department,memberType
                  </code>
                </p>

                <textarea
                  rows={7}
                  value={csvText}
                  onChange={(e) => setCsvText(e.target.value)}
                  placeholder={`rahul@college.edu,Rahul Naik,MEMBER,Computer Science,STUDENT\npriya@college.edu,Priya Sharma,MEMBER,Information Tech,STUDENT\nkapoor@college.edu,Prof. Kapoor,ORG_ADMIN,Faculty,FACULTY`}
                  className="w-full bg-[#f7f7fa] border border-[#e8e8f0] rounded-[14px] p-3 text-[#16161d] font-mono text-[11px] focus:outline-none focus:border-[#6d4aff] focus:bg-white placeholder-[#9797ab]"
                />

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[11px] text-[#747488]">
                    Format: email, name, role, dept, type
                  </span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setIsBulkOpen(false)}
                      className="px-4 py-2 rounded-[12px] bg-white border border-[#e8e8f0] text-[#5b5b6e] hover:text-[#16161d] font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      disabled={submitting || !csvText.trim()}
                      onClick={handleBulkImport}
                      className="px-4 py-2 rounded-[12px] bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1.5 disabled:opacity-50 shadow-sm"
                    >
                      <UploadCloud size={14} />
                      <span>{submitting ? 'Importing...' : 'Start Import'}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
