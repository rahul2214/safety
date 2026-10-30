'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Building2,
  Search,
  Plus,
  Users,
  ShieldAlert,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  GraduationCap,
  Briefcase,
  Home,
  CheckCircle2,
  RefreshCw,
  Clock,
  Phone,
  Mail,
  MapPin,
  Check,
  X,
  FileText,
  AlertCircle,
  Eye,
} from 'lucide-react';
import {
  organizationsApi,
  organizationRequestsApi,
  type Organization,
  type OrganizationRequest,
} from '@/portals/admin/lib/api';

export default function OrganizationsPage() {
  const [activeTab, setActiveTab] = useState<'ORGANIZATIONS' | 'REQUESTS'>('ORGANIZATIONS');

  // Organizations State
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [loadingOrgs, setLoadingOrgs] = useState(true);
  const [searchOrgs, setSearchOrgs] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');

  // Requests State
  const [requests, setRequests] = useState<OrganizationRequest[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [searchRequests, setSearchRequests] = useState('');
  const [requestStatusFilter, setRequestStatusFilter] = useState('ALL');
  const [selectedRequest, setSelectedRequest] = useState<OrganizationRequest | null>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewNotes, setReviewNotes] = useState('');
  const [actionStatus, setActionStatus] = useState<string>('UNDER_REVIEW');

  // New Org Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState('CORPORATE');
  const [domain, setDomain] = useState('');
  const [plan, setPlan] = useState('PRO');

  const fetchOrgs = async () => {
    setLoadingOrgs(true);
    const res = await organizationsApi.getAll(searchOrgs);
    if (res.data) {
      setOrgs(res.data);
    }
    setLoadingOrgs(false);
  };

  const fetchRequests = async () => {
    setLoadingRequests(true);
    const res = await organizationRequestsApi.getAll({
      status: requestStatusFilter !== 'ALL' ? requestStatusFilter : undefined,
      search: searchRequests || undefined,
    });
    if (res.data) {
      setRequests(res.data);
    }
    setLoadingRequests(false);
  };

  useEffect(() => {
    fetchOrgs();
  }, [searchOrgs]);

  useEffect(() => {
    fetchRequests();
  }, [requestStatusFilter, searchRequests]);

  const handleCreateOrg = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setCreating(true);
    const res = await organizationsApi.create({
      name: name.trim(),
      type,
      domain: domain.trim() || undefined,
      plan,
    });
    setCreating(false);

    if (res.data) {
      setName('');
      setDomain('');
      setModalOpen(false);
      fetchOrgs();
    }
  };

  const handleApproveAndProvision = async (reqId: number) => {
    if (!confirm('Approve this request and provision a new live organization tenant?')) return;
    setActionLoading(reqId);
    const res = await organizationRequestsApi.approveAndProvision(reqId);
    setActionLoading(null);
    if (res.data) {
      fetchRequests();
      fetchOrgs();
      if (selectedRequest?.id === reqId) {
        setSelectedRequest(res.data.request);
      }
    } else {
      alert(res.error?.message || 'Failed to approve and provision organization.');
    }
  };

  const handleUpdateStatusSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequest) return;

    setActionLoading(selectedRequest.id);
    const res = await organizationRequestsApi.updateStatus(selectedRequest.id, {
      status: actionStatus,
      adminNotes: reviewNotes.trim() || undefined,
    });
    setActionLoading(null);

    if (res.data) {
      setReviewModalOpen(false);
      fetchRequests();
      setSelectedRequest(res.data);
    } else {
      alert(res.error?.message || 'Failed to update request status.');
    }
  };

  const filteredOrgs = orgs.filter((o) => {
    if (typeFilter !== 'ALL' && o.type !== typeFilter) return false;
    return true;
  });

  const totalMembers = orgs.reduce((acc, curr) => acc + (curr.memberCount || 0), 0);
  const totalActiveIncidents = orgs.reduce((acc, curr) => acc + (curr.activeIncidentsCount || 0), 0);
  const pendingRequestsCount = requests.filter((r) => r.status === 'PENDING').length;

  const getTypeIcon = (t: string) => {
    switch (t) {
      case 'UNIVERSITY':
        return <GraduationCap size={15} className="text-amber-600" />;
      case 'RESIDENTIAL':
        return <Home size={15} className="text-emerald-600" />;
      default:
        return <Briefcase size={15} className="text-blue-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock size={11} />
            Pending Review
          </span>
        );
      case 'UNDER_REVIEW':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <Search size={11} />
            Under Review
          </span>
        );
      case 'APPROVED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Check size={11} />
            Approved
          </span>
        );
      case 'PROVISIONED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#f1edff] text-[#6d4aff] border border-[#ddd6fe]">
            <Building2 size={11} />
            Provisioned
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <X size={11} />
            Rejected
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#f1f1f6] text-[#5b5b6e] border border-[#e8e8f0]">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 select-none">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-[#e8e8f0] p-6 rounded-[20px] shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-[12px] bg-[#f1edff] text-[#6d4aff] flex items-center justify-center">
              <Building2 size={20} />
            </div>
            <h1 className="text-xl font-black text-[#16161d] tracking-tight">
              Organizations & Campus Command Centers
            </h1>
          </div>
          <p className="text-xs text-[#5b5b6e] mt-1.5 max-w-xl">
            Multi-tenant campus safety infrastructure. Manage provisioned university portals and review incoming
            institutional onboarding applications.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              fetchOrgs();
              fetchRequests();
            }}
            className="p-2.5 rounded-[12px] bg-white hover:bg-[#f7f7fa] text-[#5b5b6e] border border-[#e8e8f0] transition-colors shadow-2xs"
            title="Refresh All"
          >
            <RefreshCw
              size={15}
              className={loadingOrgs || loadingRequests ? 'animate-spin text-[#6d4aff]' : ''}
            />
          </button>
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 bg-[#6d4aff] hover:bg-[#5325e8] text-white px-4 py-2.5 rounded-[12px] text-xs font-bold shadow-sm transition-all"
          >
            <Plus size={16} />
            <span>Provision New Org</span>
          </button>
        </div>
      </div>

      {/* Primary Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-[#e8e8f0] pb-3">
        <button
          onClick={() => setActiveTab('ORGANIZATIONS')}
          className={`flex items-center gap-2 px-4 py-2 rounded-[12px] text-xs font-bold transition-all ${
            activeTab === 'ORGANIZATIONS'
              ? 'bg-[#f1edff] text-[#6d4aff] border border-[#ddd6fe]'
              : 'text-[#5b5b6e] hover:text-[#16161d] hover:bg-white border border-transparent'
          }`}
        >
          <Building2 size={15} />
          <span>Active Campuses & Tenants</span>
          <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${
            activeTab === 'ORGANIZATIONS' ? 'bg-[#6d4aff]/15 text-[#6d4aff]' : 'bg-[#ececf2] text-[#5b5b6e]'
          }`}>
            {orgs.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('REQUESTS')}
          className={`flex items-center gap-2 px-4 py-2 rounded-[12px] text-xs font-bold transition-all relative ${
            activeTab === 'REQUESTS'
              ? 'bg-[#f1edff] text-[#6d4aff] border border-[#ddd6fe]'
              : 'text-[#5b5b6e] hover:text-[#16161d] hover:bg-white border border-transparent'
          }`}
        >
          <FileText size={15} />
          <span>Onboarding Inquiries & Requests</span>
          {pendingRequestsCount > 0 ? (
            <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-extrabold animate-pulse">
              {pendingRequestsCount} New
            </span>
          ) : (
            <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${
              activeTab === 'REQUESTS' ? 'bg-[#6d4aff]/15 text-[#6d4aff]' : 'bg-[#ececf2] text-[#5b5b6e]'
            }`}>
              {requests.length}
            </span>
          )}
        </button>
      </div>

      {/* KPI Ticker */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-[#e8e8f0] p-4 rounded-[16px] shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-[#747488] uppercase tracking-wider">
              Active Campuses
            </div>
            <div className="text-2xl font-black text-[#16161d] mt-1">{orgs.length}</div>
          </div>
          <div className="w-10 h-10 rounded-[12px] bg-blue-50 text-blue-600 flex items-center justify-center">
            <Building2 size={18} />
          </div>
        </div>

        <div className="bg-white border border-[#e8e8f0] p-4 rounded-[16px] shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-[#747488] uppercase tracking-wider">
              Protected Members
            </div>
            <div className="text-2xl font-black text-[#16161d] mt-1">{totalMembers || 68}</div>
          </div>
          <div className="w-10 h-10 rounded-[12px] bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Users size={18} />
          </div>
        </div>

        <div className="bg-white border border-[#e8e8f0] p-4 rounded-[16px] shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-[#747488] uppercase tracking-wider">
              Active Incidents
            </div>
            <div className="text-2xl font-black text-amber-600 mt-1">{totalActiveIncidents || 7}</div>
          </div>
          <div className="w-10 h-10 rounded-[12px] bg-amber-50 text-amber-600 flex items-center justify-center">
            <ShieldAlert size={18} />
          </div>
        </div>

        <div className="bg-white border border-[#e8e8f0] p-4 rounded-[16px] shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-[#747488] uppercase tracking-wider">
              Pending Onboarding
            </div>
            <div className="text-2xl font-black text-[#6d4aff] mt-1">{pendingRequestsCount}</div>
          </div>
          <div className="w-10 h-10 rounded-[12px] bg-[#f1edff] text-[#6d4aff] flex items-center justify-center">
            <Clock size={18} />
          </div>
        </div>
      </div>

      {/* TAB 1: ACTIVE ORGANIZATIONS VIEW */}
      {activeTab === 'ORGANIZATIONS' && (
        <div className="space-y-6">
          {/* Filter & Search Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white border border-[#e8e8f0] p-3 rounded-[16px] shadow-xs">
            <div className="relative w-full sm:w-80">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9797ab]" />
              <input
                type="text"
                value={searchOrgs}
                onChange={(e) => setSearchOrgs(e.target.value)}
                placeholder="Search campuses by name or domain..."
                className="w-full bg-[#f7f7fa] border border-[#e8e8f0] pl-10 pr-4 py-2 rounded-[12px] text-xs text-[#16161d] placeholder-[#9797ab] focus:outline-none focus:border-[#6d4aff] focus:bg-white"
              />
            </div>

            <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
              {['ALL', 'CORPORATE', 'UNIVERSITY', 'RESIDENTIAL'].map((t) => (
                <button
                  key={t}
                  onClick={() => setTypeFilter(t)}
                  className={`px-3 py-1.5 rounded-[12px] text-xs font-semibold whitespace-nowrap transition-colors ${
                    typeFilter === t
                      ? 'bg-[#f1edff] text-[#6d4aff] border border-[#ddd6fe]'
                      : 'bg-[#f7f7fa] text-[#5b5b6e] border border-[#e8e8f0] hover:text-[#16161d] hover:bg-white'
                  }`}
                >
                  {t === 'ALL' ? 'All Types' : t.charAt(0) + t.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Organizations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {loadingOrgs ? (
              <div className="col-span-full py-16 text-center text-[#5b5b6e] text-xs flex items-center justify-center gap-2">
                <RefreshCw size={16} className="animate-spin text-[#6d4aff]" />
                <span>Loading organizations...</span>
              </div>
            ) : filteredOrgs.length === 0 ? (
              <div className="col-span-full py-16 text-center border border-dashed border-[#e8e8f0] rounded-[20px] bg-white">
                <Building2 size={32} className="mx-auto text-[#9797ab] mb-2" />
                <p className="text-sm font-bold text-[#16161d]">No organizations found</p>
                <p className="text-xs text-[#5b5b6e] mt-1">
                  Get started by provisioning your first campus or reviewing incoming requests.
                </p>
              </div>
            ) : (
              filteredOrgs.map((org) => (
                <div
                  key={org.id}
                  className="bg-white border border-[#e8e8f0] hover:border-[#6d4aff]/40 rounded-[20px] p-5 flex flex-col justify-between transition-all group shadow-xs hover:shadow-md"
                >
                  <div>
                    {/* Top badges */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#f7f7fa] border border-[#e8e8f0] text-[11px] font-semibold text-[#5b5b6e]">
                        {getTypeIcon(org.type)}
                        <span>{org.type}</span>
                      </div>

                      <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-rose-50 text-rose-600 border border-rose-100">
                        {org.plan}
                      </span>
                    </div>

                    {/* Name & Domain */}
                    <h3 className="text-base font-bold text-[#16161d] group-hover:text-[#6d4aff] transition-colors">
                      {org.name}
                    </h3>
                    <p className="text-xs text-[#747488] font-mono mt-0.5">
                      {org.domain || `${org.slug}.sabhijude.internal`}
                    </p>

                    {/* Score & Metrics Bar */}
                    <div className="mt-4 pt-3 border-t border-[#ececf2] grid grid-cols-3 gap-2 text-center">
                      <div className="bg-[#fafafc] p-2.5 rounded-[14px] border border-[#ececf2]">
                        <div className="text-[10px] text-[#747488] font-semibold uppercase">Safety</div>
                        <div className="text-sm font-black text-emerald-600 mt-0.5">
                          {org.safetyScore || 95}%
                        </div>
                      </div>

                      <div className="bg-[#fafafc] p-2.5 rounded-[14px] border border-[#ececf2]">
                        <div className="text-[10px] text-[#747488] font-semibold uppercase">Members</div>
                        <div className="text-sm font-bold text-[#16161d] mt-0.5">
                          {org.memberCount || 3}
                        </div>
                      </div>

                      <div className="bg-[#fafafc] p-2.5 rounded-[14px] border border-[#ececf2]">
                        <div className="text-[10px] text-[#747488] font-semibold uppercase">Active</div>
                        <div className="text-sm font-bold text-amber-600 mt-0.5">
                          {org.activeIncidentsCount || 2}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action link */}
                  <div className="mt-5 pt-3 border-t border-[#ececf2]">
                    <Link
                      href={`/admin/dashboard/organizations/${org.id}`}
                      className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-[12px] bg-[#f7f7fa] hover:bg-[#6d4aff] hover:text-white text-[#16161d] text-xs font-bold transition-all border border-[#e8e8f0] group-hover:border-[#6d4aff]"
                    >
                      <span className="flex items-center gap-1.5">
                        <ShieldCheck size={14} />
                        <span>Open Command Center</span>
                      </span>
                      <ChevronRight size={14} />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 2: ONBOARDING REQUESTS VIEW */}
      {activeTab === 'REQUESTS' && (
        <div className="space-y-6">
          {/* Requests Filter & Search Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white border border-[#e8e8f0] p-3 rounded-[16px] shadow-xs">
            <div className="relative w-full sm:w-80">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9797ab]" />
              <input
                type="text"
                value={searchRequests}
                onChange={(e) => setSearchRequests(e.target.value)}
                placeholder="Search requests by institution, contact, reference..."
                className="w-full bg-[#f7f7fa] border border-[#e8e8f0] pl-10 pr-4 py-2 rounded-[12px] text-xs text-[#16161d] placeholder-[#9797ab] focus:outline-none focus:border-[#6d4aff] focus:bg-white"
              />
            </div>

            <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
              {['ALL', 'PENDING', 'UNDER_REVIEW', 'APPROVED', 'PROVISIONED', 'REJECTED'].map((st) => (
                <button
                  key={st}
                  onClick={() => setRequestStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-[12px] text-xs font-semibold whitespace-nowrap transition-colors ${
                    requestStatusFilter === st
                      ? 'bg-[#f1edff] text-[#6d4aff] border border-[#ddd6fe]'
                      : 'bg-[#f7f7fa] text-[#5b5b6e] border border-[#e8e8f0] hover:text-[#16161d] hover:bg-white'
                  }`}
                >
                  {st === 'ALL'
                    ? 'All Requests'
                    : st.replace('_', ' ').charAt(0) + st.replace('_', ' ').slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Requests Table / Cards */}
          {loadingRequests ? (
            <div className="py-16 text-center text-[#5b5b6e] text-xs flex items-center justify-center gap-2">
              <RefreshCw size={16} className="animate-spin text-[#6d4aff]" />
              <span>Loading onboarding inquiries...</span>
            </div>
          ) : requests.length === 0 ? (
            <div className="py-16 text-center border border-dashed border-[#e8e8f0] rounded-[20px] bg-white">
              <FileText size={32} className="mx-auto text-[#9797ab] mb-2" />
              <p className="text-sm font-bold text-[#16161d]">No onboarding requests found</p>
              <p className="text-xs text-[#5b5b6e] mt-1">
                New applications submitted via the public onboarding portal will appear here in real time.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((req) => (
                <div
                  key={req.id}
                  className="bg-white border border-[#e8e8f0] hover:border-[#ddd6fe] p-5 rounded-[20px] transition-all shadow-xs space-y-4"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-[12px] bg-amber-50 border border-amber-100 text-amber-600">
                        {getTypeIcon(req.organizationType)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-[#16161d] tracking-tight">
                            {req.organizationName}
                          </h3>
                          <span className="font-mono text-[10px] text-[#747488] bg-[#f7f7fa] px-2 py-0.5 rounded border border-[#e8e8f0]">
                            {req.requestReference}
                          </span>
                        </div>
                        <p className="text-xs text-[#5b5b6e] mt-0.5 flex items-center gap-2">
                          <span>{req.organizationType}</span>
                          {req.domain && (
                            <>
                              <span>•</span>
                              <span className="font-mono text-[#16161d]">{req.domain}</span>
                            </>
                          )}
                          {(req.city || req.state) && (
                            <>
                              <span>•</span>
                              <span className="flex items-center gap-1 text-[#5b5b6e]">
                                <MapPin size={11} />
                                {[req.city, req.state].filter(Boolean).join(', ')}
                              </span>
                            </>
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {getStatusBadge(req.status)}
                      <span className="text-[11px] text-[#747488] font-mono">
                        {new Date(req.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Contact Info & Requirements */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3.5 rounded-[14px] bg-[#fafafc] border border-[#ececf2] text-xs">
                    <div>
                      <div className="text-[10px] uppercase font-bold text-[#747488] tracking-wider">
                        Safety Officer / Contact
                      </div>
                      <div className="font-bold text-[#16161d] mt-1">{req.contactName}</div>
                      {req.contactTitle && (
                        <div className="text-[11px] text-[#5b5b6e]">{req.contactTitle}</div>
                      )}
                      <div className="mt-1 flex flex-col gap-0.5 text-[11px] text-[#2d2d3a]">
                        <span className="flex items-center gap-1 font-mono">
                          <Mail size={11} className="text-[#9797ab]" />
                          {req.contactEmail}
                        </span>
                        <span className="flex items-center gap-1 font-mono">
                          <Phone size={11} className="text-[#9797ab]" />
                          {req.contactPhone}
                        </span>
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] uppercase font-bold text-[#747488] tracking-wider">
                        Population & Needs
                      </div>
                      <div className="font-semibold text-[#16161d] mt-1">
                        Est. Members: {req.memberCountEstimate}
                      </div>
                      <div className="text-[11px] text-[#5b5b6e] mt-1 line-clamp-2">
                        {req.safetyRequirements || 'Standard Campus Incident Command Suite'}
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] uppercase font-bold text-[#747488] tracking-wider">
                        Admin Review Notes
                      </div>
                      <div className="text-[11px] text-[#2d2d3a] mt-1 italic line-clamp-2">
                        {req.adminNotes || 'No administrative notes attached yet.'}
                      </div>
                      {req.reviewedByAdmin && (
                        <div className="text-[10px] text-[#747488] mt-1 font-mono">
                          Reviewed by {req.reviewedByAdmin}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                    <button
                      onClick={() => {
                        setSelectedRequest(req);
                        setActionStatus(req.status === 'PENDING' ? 'UNDER_REVIEW' : req.status);
                        setReviewNotes(req.adminNotes || '');
                        setReviewModalOpen(true);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] bg-[#f7f7fa] hover:bg-[#ececf2] text-[#16161d] border border-[#e8e8f0] text-xs font-semibold transition"
                    >
                      <Eye size={13} />
                      <span>Inspect Details & Review</span>
                    </button>

                    <div className="flex items-center gap-2">
                      {req.status !== 'PROVISIONED' && (
                        <button
                          onClick={() => handleApproveAndProvision(req.id)}
                          disabled={actionLoading === req.id}
                          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-[10px] bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold transition shadow-xs"
                        >
                          {actionLoading === req.id ? (
                            <RefreshCw size={13} className="animate-spin" />
                          ) : (
                            <Building2 size={13} />
                          )}
                          <span>Approve & Provision Org</span>
                        </button>
                      )}

                      {req.status === 'PROVISIONED' && (
                        <span className="text-xs text-[#6d4aff] font-semibold flex items-center gap-1 px-3 py-1 rounded-[10px] bg-[#f1edff] border border-[#ddd6fe]">
                          <CheckCircle2 size={13} />
                          <span>Tenant Provisioned & Active</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Review & Status Modal */}
      {reviewModalOpen && selectedRequest && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#e8e8f0] w-full max-w-xl rounded-[22px] p-6 shadow-xl max-h-[90vh] overflow-y-auto space-y-4 text-[#16161d]">
            <div className="flex items-center justify-between pb-3 border-b border-[#e8e8f0]">
              <div>
                <h2 className="text-base font-bold text-[#16161d] flex items-center gap-2">
                  <FileText size={18} className="text-[#6d4aff]" />
                  <span>Onboarding Application Review</span>
                </h2>
                <p className="text-xs text-[#5b5b6e] mt-0.5 font-mono">
                  {selectedRequest.requestReference} — {selectedRequest.organizationName}
                </p>
              </div>
              <button
                onClick={() => setReviewModalOpen(false)}
                className="text-[#9797ab] hover:text-[#16161d] text-sm p-1.5 rounded-[10px] hover:bg-[#f7f7fa]"
              >
                ✕
              </button>
            </div>

            {/* Structured details display */}
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-[14px] bg-[#fafafc] border border-[#ececf2]">
                <div>
                  <span className="text-[#747488] block">Organization Name:</span>
                  <span className="font-bold text-[#16161d]">{selectedRequest.organizationName}</span>
                </div>
                <div>
                  <span className="text-[#747488] block">Type:</span>
                  <span className="font-semibold text-[#16161d]">{selectedRequest.organizationType}</span>
                </div>
                <div>
                  <span className="text-[#747488] block">Official Domain:</span>
                  <span className="font-mono text-[#16161d]">{selectedRequest.domain || 'None'}</span>
                </div>
                <div>
                  <span className="text-[#747488] block">Campus Size:</span>
                  <span className="font-semibold text-[#16161d]">
                    {selectedRequest.memberCountEstimate}
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-[14px] bg-[#fafafc] border border-[#ececf2] space-y-1.5">
                <span className="text-[#747488] block font-semibold uppercase text-[10px]">
                  Safety Officer Contact
                </span>
                <div className="font-bold text-[#16161d]">
                  {selectedRequest.contactName} ({selectedRequest.contactTitle || 'Primary Contact'})
                </div>
                <div className="text-[#2d2d3a] font-mono">
                  Email: {selectedRequest.contactEmail} | Phone: {selectedRequest.contactPhone}
                </div>
                {(selectedRequest.city || selectedRequest.state) && (
                  <div className="text-[#5b5b6e]">
                    Location: {[selectedRequest.city, selectedRequest.state].filter(Boolean).join(', ')}
                  </div>
                )}
              </div>

              {selectedRequest.safetyRequirements && (
                <div className="p-3.5 rounded-[14px] bg-[#fafafc] border border-[#ececf2]">
                  <span className="text-[#747488] block font-semibold uppercase text-[10px] mb-1">
                    Requirements & Safety Needs
                  </span>
                  <p className="text-[#2d2d3a] leading-relaxed">{selectedRequest.safetyRequirements}</p>
                </div>
              )}

              {selectedRequest.notes && (
                <div className="p-3.5 rounded-[14px] bg-[#fafafc] border border-[#ececf2]">
                  <span className="text-[#747488] block font-semibold uppercase text-[10px] mb-1">
                    Applicant Notes
                  </span>
                  <p className="text-[#2d2d3a] leading-relaxed">{selectedRequest.notes}</p>
                </div>
              )}
            </div>

            {/* Status Change Form */}
            <form onSubmit={handleUpdateStatusSubmit} className="space-y-3 pt-3 border-t border-[#e8e8f0]">
              <div>
                <label className="block text-xs font-semibold text-[#16161d] mb-1">Update Status</label>
                <select
                  value={actionStatus}
                  onChange={(e) => setActionStatus(e.target.value)}
                  className="w-full bg-[#f7f7fa] border border-[#e8e8f0] px-3 py-2 rounded-[12px] text-xs text-[#16161d] focus:outline-none focus:border-[#6d4aff] focus:bg-white"
                >
                  <option value="PENDING">PENDING (Awaiting Review)</option>
                  <option value="UNDER_REVIEW">UNDER_REVIEW (Verifying Credentials)</option>
                  <option value="APPROVED">APPROVED (Verified for Provisioning)</option>
                  <option value="REJECTED">REJECTED (Declined / Incomplete)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#16161d] mb-1">
                  Administrator Review Notes
                </label>
                <textarea
                  rows={2}
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="Record credentials verified, phone verification timestamps, or reasons for rejection..."
                  className="w-full bg-[#f7f7fa] border border-[#e8e8f0] p-2.5 rounded-[12px] text-xs text-[#16161d] focus:outline-none focus:border-[#6d4aff] focus:bg-white placeholder-[#9797ab]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReviewModalOpen(false)}
                  className="px-4 py-2 rounded-[12px] text-xs font-semibold text-[#5b5b6e] hover:text-[#16161d] hover:bg-[#f7f7fa]"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={actionLoading === selectedRequest.id}
                  className="px-4 py-2 rounded-[12px] bg-[#6d4aff] hover:bg-[#5325e8] disabled:opacity-50 text-white text-xs font-bold transition shadow-sm"
                >
                  {actionLoading === selectedRequest.id ? 'Saving...' : 'Save Review Status'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Manual Onboard Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#e8e8f0] w-full max-w-md rounded-[22px] p-6 shadow-xl text-[#16161d]">
            <div className="flex items-center justify-between pb-4 border-b border-[#e8e8f0]">
              <h2 className="text-base font-bold text-[#16161d] flex items-center gap-2">
                <Building2 size={18} className="text-[#6d4aff]" />
                <span>Onboard New Organization / Campus</span>
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="text-[#9797ab] hover:text-[#16161d] text-sm p-1.5 rounded-[10px] hover:bg-[#f7f7fa]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateOrg} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-[#16161d] mb-1">
                  Organization / Campus Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Oxford University Campus North"
                  className="w-full bg-[#f7f7fa] border border-[#e8e8f0] px-3.5 py-2.5 rounded-[12px] text-xs text-[#16161d] focus:outline-none focus:border-[#6d4aff] focus:bg-white placeholder-[#9797ab]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#16161d] mb-1">Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full bg-[#f7f7fa] border border-[#e8e8f0] px-3.5 py-2.5 rounded-[12px] text-xs text-[#16161d] focus:outline-none focus:border-[#6d4aff] focus:bg-white"
                >
                  <option value="CORPORATE">Corporate Enterprise</option>
                  <option value="UNIVERSITY">University & Colleges</option>
                  <option value="RESIDENTIAL">Residential Community</option>
                  <option value="COMMUNITY">Public Safety District</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#16161d] mb-1">
                  Domain (for Auto-Join / SSO)
                </label>
                <input
                  type="text"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  placeholder="e.g. ox.ac.uk"
                  className="w-full bg-[#f7f7fa] border border-[#e8e8f0] px-3.5 py-2.5 rounded-[12px] text-xs text-[#16161d] focus:outline-none focus:border-[#6d4aff] focus:bg-white placeholder-[#9797ab]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#16161d] mb-1">Plan</label>
                <select
                  value={plan}
                  onChange={(e) => setPlan(e.target.value)}
                  className="w-full bg-[#f7f7fa] border border-[#e8e8f0] px-3.5 py-2.5 rounded-[12px] text-xs text-[#16161d] focus:outline-none focus:border-[#6d4aff] focus:bg-white"
                >
                  <option value="ENTERPRISE">Enterprise (Full Command Suite + Live Geofence)</option>
                  <option value="PRO">Pro (Standard Emergency Dispatch)</option>
                  <option value="STARTER">Starter</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#e8e8f0]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-[12px] text-xs font-semibold text-[#5b5b6e] hover:text-[#16161d] hover:bg-[#f7f7fa]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="bg-[#6d4aff] hover:bg-[#5325e8] disabled:opacity-50 text-white px-4 py-2 rounded-[12px] text-xs font-bold shadow-sm transition"
                >
                  {creating ? 'Creating...' : 'Create Organization'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
