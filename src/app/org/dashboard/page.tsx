'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Building2,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Users,
  Clock,
  Radio,
  MapPin,
  Send,
  Plus,
  ArrowLeft,
  RefreshCw,
  Phone,
  ChevronRight,
  TrendingUp,
  Activity,
  CheckCircle2,
  X,
  ExternalLink,
  Truck,
  FileText,
  UserPlus,
  Sparkles,
} from 'lucide-react';
import {
  organizationsApi,
  type Organization,
  type OrganizationMember,
  type OrgDashboardStats,
  type OrgIncident,
} from '@/portals/org/lib/api';
import { useOrgId } from '@/portals/org/lib/org-context';

export default function OrgCommandCenterPage() {
  const router = useRouter();
  const orgId = useOrgId();

  const [org, setOrg] = useState<Organization | null>(null);
  const [stats, setStats] = useState<OrgDashboardStats | null>(null);
  const [members, setMembers] = useState<OrganizationMember[]>([]);
  const [incidents, setIncidents] = useState<OrgIncident[]>([]);
  const [loading, setLoading] = useState(true);

  // Broadcast Alert Modal
  const [broadcastOpen, setBroadcastOpen] = useState(false);
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMsg, setBroadcastMsg] = useState('');
  const [broadcasting, setBroadcasting] = useState(false);
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);
  const [broadcastError, setBroadcastError] = useState<string | null>(null);

  // Add Member Modal
  const [memberModalOpen, setMemberModalOpen] = useState(false);
  const [memberEmail, setMemberEmail] = useState('');
  const [memberRole, setMemberRole] = useState('SECURITY_OFFICER');
  const [memberDept, setMemberDept] = useState('Safety Response');
  const [addingMember, setAddingMember] = useState(false);

  // Filter for incidents
  const [incidentTab, setIncidentTab] = useState<'ALL' | 'ACTIVE' | 'RESOLVED'>('ALL');

  // Interactive Live Triage Drawer & Dispatch Modals
  const [selectedIncident, setSelectedIncident] = useState<OrgIncident | null>(null);
  const [dispatchModalOpen, setDispatchModalOpen] = useState(false);
  const [dispatchUnit, setDispatchUnit] = useState('Patrol Unit Alpha-1');
  const [dispatchOfficer, setDispatchOfficer] = useState('Officer Marcus Vance');
  const [dispatchPriority, setDispatchPriority] = useState('HIGH');
  const [dispatchInstructions, setDispatchInstructions] = useState('');
  const [dispatching, setDispatching] = useState(false);

  // Sitrep Note
  const [sitrepNote, setSitrepNote] = useState('');
  const [savingNote, setSavingNote] = useState(false);

  const loadAll = async () => {
    if (orgId == null) return;
    setLoading(true);
    try {
      const [orgRes, statsRes, membersRes, incRes] = await Promise.all([
        organizationsApi.getByIdOrSlug(orgId),
        organizationsApi.getDashboardStats(orgId),
        organizationsApi.getMembers(orgId),
        organizationsApi.getIncidents(orgId),
      ]);

      if (orgRes.data) setOrg(orgRes.data);
      if (statsRes.data) setStats(statsRes.data);
      if (membersRes.data) setMembers(membersRes.data);
      if (incRes.data) setIncidents(incRes.data);
    } catch (e) {
      console.warn('Error loading org data, showing default state:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, [orgId]);

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle || !broadcastMsg || orgId == null) return;

    setBroadcasting(true);
    setBroadcastError(null);

    const res = await organizationsApi.sendBroadcast(orgId, {
      title: broadcastTitle.trim(),
      message: broadcastMsg.trim(),
      urgency: 'CRITICAL',
      targetAudience: 'ALL',
    });

    setBroadcasting(false);

    if (!res.ok) {
      setBroadcastError(res.error?.message ?? 'Could not send the broadcast.');
      return;
    }

    setBroadcastSuccess(true);
    setTimeout(() => {
      setBroadcastSuccess(false);
      setBroadcastOpen(false);
      setBroadcastTitle('');
      setBroadcastMsg('');
    }, 1500);
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberEmail.trim() || orgId == null) return;

    setAddingMember(true);
    const res = await organizationsApi.addMember(orgId, {
      email: memberEmail.trim(),
      role: memberRole,
      department: memberDept,
    });
    setAddingMember(false);

    if (res.data) {
      setMembers((prev) => [res.data!, ...prev]);
      setMemberModalOpen(false);
      setMemberEmail('');
    }
  };

  const handleUpdateStatus = async (incidentId: number, newStatus: string, note?: string) => {
    if (orgId == null) return;

    const res = await organizationsApi.updateIncidentStatus(orgId, incidentId, {
      status: newStatus,
      assignedOfficerName: dispatchOfficer,
      notes: note,
    });

    if (res.data) {
      const updated = res.data;
      setIncidents((prev) => prev.map((i) => (i.id === incidentId ? updated : i)));
      if (selectedIncident?.id === incidentId) {
        setSelectedIncident(updated);
      }
      organizationsApi.getDashboardStats(orgId).then((s) => s.data && setStats(s.data));
    }
  };

  const handleDispatchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIncident || orgId == null) return;

    setDispatching(true);
    const res = await organizationsApi.dispatchPatrol(orgId, selectedIncident.id, {
      unitName: dispatchUnit,
      officerName: dispatchOfficer,
      dispatchPriority: dispatchPriority,
      instructions: dispatchInstructions || undefined,
    });
    setDispatching(false);

    if (res.data) {
      const updated = res.data;
      setIncidents((prev) => prev.map((i) => (i.id === selectedIncident.id ? updated : i)));
      setSelectedIncident(updated);
      setDispatchModalOpen(false);
      setDispatchInstructions('');
      organizationsApi.getDashboardStats(orgId).then((s) => s.data && setStats(s.data));
    }
  };

  const handleAddSitrep = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIncident || !sitrepNote.trim() || orgId == null) return;

    setSavingNote(true);
    const res = await organizationsApi.updateIncidentStatus(orgId, selectedIncident.id, {
      status: selectedIncident.status,
      assignedOfficerName: selectedIncident.assignedOfficerName || 'Security Lead',
      notes: `SITREP NOTE: ${sitrepNote.trim()}`,
    });
    setSavingNote(false);

    if (res.data) {
      const updated = res.data;
      setIncidents((prev) => prev.map((i) => (i.id === selectedIncident.id ? updated : i)));
      setSelectedIncident(updated);
      setSitrepNote('');
    }
  };

  if (loading && !org) {
    return (
      <div className="py-24 text-center text-[#5b5b6e] text-xs flex items-center justify-center gap-2">
        <RefreshCw size={16} className="animate-spin text-[#6d4aff]" />
        <span>Connecting to Organization Command Center...</span>
      </div>
    );
  }

  const currentOrg = org || {
    id: 1,
    name: 'Metropolitan Campus Security',
    slug: 'metro-campus',
    type: 'UNIVERSITY',
    plan: 'ENTERPRISE',
    domain: 'metro.campus.edu',
  };

  const filteredIncidents = incidents.filter((inc) => {
    if (incidentTab === 'ACTIVE') return inc.status !== 'RESOLVED' && inc.status !== 'FALSE_ALARM';
    if (incidentTab === 'RESOLVED') return inc.status === 'RESOLVED' || inc.status === 'FALSE_ALARM';
    return true;
  });

  return (
    <div className="space-y-6 select-none pb-8">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-[#5b5b6e]">
        <Link href="/org/dashboard" className="hover:text-[#16161d] transition-colors flex items-center gap-1">
          <ArrowLeft size={13} />
          <span>Campus Command</span>
        </Link>
        <span>/</span>
        <span className="text-[#16161d] font-bold">{currentOrg.name}</span>
      </div>

      {/* Main Command Center Header Banner (Stitch Spec) */}
      <div className="bg-white border border-[#e8e8f0] p-6 rounded-[20px] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="h-3 w-3 rounded-full bg-[#059669] animate-pulse" />
            <h1 className="text-[22px] font-black text-[#16161d] tracking-tight">{currentOrg.name}</h1>
            <span className="text-[10.5px] font-bold uppercase px-2 py-0.5 rounded-full bg-[#f1edff] text-[#6d4aff]">
              {currentOrg.plan}
            </span>
            <span className="text-[10.5px] font-bold uppercase px-2 py-0.5 rounded-full bg-[#f1f1f6] text-[#5b5b6e]">
              {currentOrg.type}
            </span>
          </div>
          <p className="text-[12px] text-[#5b5b6e] mt-1 flex items-center gap-2">
            <span>Perimeter: {currentOrg.domain || 'campus.sabhijude.internal'}</span>
            <span className="text-[#9797ab]">â€¢</span>
            <span className="text-[#059669] font-semibold">Active Dispatch Ready</span>
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <Link
            href={`/org/dashboard/analytics`}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-[12px] bg-[#f1f1f6] hover:bg-[#e6e6ee] text-[#16161d] text-xs font-bold transition shadow-sm"
          >
            <TrendingUp size={15} className="text-[#6d4aff]" />
            <span>Analytics</span>
          </Link>

          <button
            onClick={loadAll}
            className="p-2.5 rounded-[12px] bg-[#f1f1f6] hover:bg-[#e6e6ee] text-[#5b5b6e] transition"
            title="Refresh"
          >
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          </button>

          <button
            onClick={() => setBroadcastOpen(true)}
            className="flex-1 md:flex-initial flex items-center justify-center gap-2 bg-[#e11d48] hover:bg-[#be123c] text-white px-4 py-2.5 rounded-[12px] text-xs font-bold shadow-sm transition active:scale-95"
          >
            <Radio size={16} />
            <span>Broadcast Alert</span>
          </button>
        </div>
      </div>

      {/* 5 Primary Operational KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* Safety Score */}
        <div className="bg-white border border-[#e8e8f0] p-4 rounded-[16px] shadow-sm">
          <div className="flex items-center justify-between text-[#9797ab] text-[10.5px] font-black uppercase tracking-wider">
            <span>Safety Index</span>
            <ShieldCheck size={16} className="text-[#059669]" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-[#059669]">{stats?.safetyScore ?? 96}%</span>
            <span className="text-[10px] text-[#059669] font-bold uppercase">Optimal</span>
          </div>
          <div className="w-full bg-[#e6e6ee] h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-[#059669] h-full rounded-full" style={{ width: `${stats?.safetyScore ?? 96}%` }} />
          </div>
        </div>

        {/* Active Incidents */}
        <div className="bg-white border border-[#e8e8f0] p-4 rounded-[16px] shadow-sm">
          <div className="flex items-center justify-between text-[#9797ab] text-[10.5px] font-black uppercase tracking-wider">
            <span>Active Incidents</span>
            <ShieldAlert size={16} className="text-[#d97706]" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-[#d97706]">{stats?.activeIncidents ?? 3}</span>
            <span className="text-[10px] text-[#5b5b6e]">Under Action</span>
          </div>
          <p className="text-[10px] text-[#5b5b6e] mt-2 flex items-center gap-1">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#d97706]" />
            <span>2 field units assigned</span>
          </p>
        </div>

        {/* SOS Panic Alerts */}
        <div className="bg-white border border-[#e8e8f0] p-4 rounded-[16px] shadow-sm">
          <div className="flex items-center justify-between text-[#9797ab] text-[10.5px] font-black uppercase tracking-wider">
            <span>Critical SOS</span>
            <AlertTriangle size={16} className="text-[#e11d48]" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-[#e11d48]">{stats?.sosAlertsToday ?? 1}</span>
            <span className="text-[10px] text-[#e11d48] font-bold">Today</span>
          </div>
          <p className="text-[10px] text-[#059669] mt-2 flex items-center gap-1">
            <CheckCircle2 size={11} />
            <span>Avg Response: 3.8m</span>
          </p>
        </div>

        {/* Protected Campus Members */}
        <Link
          href={`/org/dashboard/members`}
          className="bg-white border border-[#e8e8f0] hover:border-[#6d4aff] transition p-4 rounded-[16px] shadow-sm block group"
        >
          <div className="flex items-center justify-between text-[#9797ab] text-[10.5px] font-black uppercase tracking-wider">
            <span>Protected Members</span>
            <Users size={16} className="text-[#6d4aff]" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-[#16161d]">{stats?.totalMembers ?? 64}</span>
            <span className="text-[10px] text-[#5b5b6e]">Enrolled</span>
          </div>
          <p className="text-[10px] text-[#6d4aff] mt-2 flex items-center justify-between">
            <span>100% active</span>
            <span className="underline text-[9px]">Roster &rarr;</span>
          </p>
        </Link>

        {/* Avg Resolution Speed */}
        <div className="bg-white border border-[#e8e8f0] p-4 rounded-[16px] shadow-sm col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-[#9797ab] text-[10.5px] font-black uppercase tracking-wider">
            <span>Avg Triage Time</span>
            <Clock size={16} className="text-[#0891b2]" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-[#0891b2]">{stats?.avgResolutionTimeHours ?? 0.8}h</span>
            <span className="text-[10px] text-[#5b5b6e]">per case</span>
          </div>
          <p className="text-[10px] text-[#5b5b6e] mt-2">
            <span className="text-[#059669] font-bold">+{stats?.resolvedIncidentsThisMonth ?? 42}</span> resolved
          </p>
        </div>
      </div>

      {/* Main Grid: Live Incident Stream (2 Cols) + Campus Security Radar (1 Col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Incident Management & Stream (2 Cols) */}
        <div className="lg:col-span-2 bg-white border border-[#e8e8f0] rounded-[20px] p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between flex-wrap gap-2 border-b border-[#e8e8f0] pb-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black text-[#16161d]">Live Incident & Triage Stream</h3>
                <span className="text-[10.5px] font-bold px-2 py-0.5 rounded-full bg-[#f1edff] text-[#6d4aff]">
                  {filteredIncidents.length} Records
                </span>
              </div>
              <p className="text-[11.5px] text-[#5b5b6e]">
                Click any incident to open the Live Dispatch & OpenJev Decision Drawer
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 bg-[#f7f7fa] p-1 rounded-[12px] border border-[#e8e8f0] text-[11px]">
              {(['ALL', 'ACTIVE', 'RESOLVED'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setIncidentTab(tab)}
                  className={`px-3 py-1 rounded-[8px] font-bold transition-colors ${
                    incidentTab === tab
                      ? 'bg-[#6d4aff] text-white shadow-sm'
                      : 'text-[#5b5b6e] hover:text-[#16161d]'
                  }`}
                >
                  {tab.charAt(0) + tab.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {filteredIncidents.length === 0 ? (
              <div className="py-12 text-center text-xs text-[#5b5b6e]">
                No safety incidents reported in this view.
              </div>
            ) : (
              filteredIncidents.map((inc) => {
                const isCritical = inc.severity === 'IMMEDIATE_DANGER' || inc.severity === 'CRITICAL';
                const isConcerning = inc.severity === 'CONCERNING' || inc.severity === 'SERIOUS';
                const isResolved = inc.status === 'RESOLVED' || inc.status === 'FALSE_ALARM';
                const isDispatched = inc.status === 'DISPATCHED';

                return (
                  <div
                    key={inc.id}
                    onClick={() => setSelectedIncident(inc)}
                    className={`p-4 bg-white border rounded-[16px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 cursor-pointer transition shadow-sm hover:border-[#6d4aff] ${
                      selectedIncident?.id === inc.id
                        ? 'border-[#6d4aff] ring-2 ring-[#6d4aff]/20'
                        : isCritical
                        ? 'border-l-4 border-l-[#e11d48] border-[#e8e8f0]'
                        : 'border-[#e8e8f0]'
                    }`}
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`text-[9.5px] font-black uppercase px-2 py-0.5 rounded-full ${
                            isCritical
                              ? 'bg-[#e11d48]/10 text-[#e11d48]'
                              : isConcerning
                              ? 'bg-[#d97706]/10 text-[#d97706]'
                              : 'bg-[#0891b2]/10 text-[#0891b2]'
                          }`}
                        >
                          {inc.severity.replace('_', ' ')}
                        </span>

                        <span
                          className={`text-[9.5px] font-black uppercase px-2 py-0.5 rounded-full ${
                            isResolved
                              ? 'bg-[#059669]/10 text-[#059669]'
                              : isDispatched
                              ? 'bg-[#6d4aff]/10 text-[#6d4aff]'
                              : 'bg-[#d97706]/10 text-[#d97706]'
                          }`}
                        >
                          {inc.status}
                        </span>

                        <span className="text-[11px] text-[#9797ab]">
                          {new Date(inc.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-[#16161d]">{inc.title}</h4>
                      <p className="text-[11.5px] text-[#5b5b6e] line-clamp-1">{inc.description}</p>

                      <div className="flex items-center gap-3 text-[11px] text-[#5b5b6e] flex-wrap">
                        <span className="flex items-center gap-1 text-[#16161d]">
                          <MapPin size={11} className="text-[#e11d48]" />
                          <span>{inc.location || 'Perimeter Core'}</span>
                        </span>
                        <span>â€¢</span>
                        <span>Reporter: <strong>{inc.reporterName}</strong></span>
                        {inc.assignedOfficerName && (
                          <>
                            <span>â€¢</span>
                            <span className="text-[#6d4aff] font-semibold">Assigned: {inc.assignedOfficerName}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedIncident(inc);
                        }}
                        className="px-3 py-1.5 rounded-[10px] bg-[#f1f1f6] hover:bg-[#e6e6ee] text-[#16161d] text-xs font-bold flex items-center gap-1 transition"
                      >
                        <span>Triage</span>
                        <ChevronRight size={13} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Campus Safety Radar & Security Team */}
        <div className="space-y-6">
          {/* Virtual Radar */}
          <div className="bg-white border border-[#e8e8f0] rounded-[20px] p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-[#16161d]">Campus Perimeter Radar</h3>
                <p className="text-[11.5px] text-[#5b5b6e]">Live geofenced perimeter status</p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#ecfdf5] text-[#059669]">
                ACTIVE
              </span>
            </div>

            <div className="relative h-44 bg-[#f7f7fa] rounded-[16px] border border-[#e8e8f0] overflow-hidden flex items-center justify-center">
              <div className="w-32 h-32 rounded-full border border-[#d6d6e2]" />
              <div className="w-16 h-16 rounded-full border border-[#d6d6e2]" />

              {/* Dynamic Incident Pins */}
              {incidents.slice(0, 3).map((inc, idx) => {
                const pos = [
                  { top: '35%', left: '42%' },
                  { top: '65%', left: '68%' },
                  { top: '25%', left: '75%' },
                ][idx] || { top: '50%', left: '50%' };

                return (
                  <div
                    key={inc.id}
                    onClick={() => setSelectedIncident(inc)}
                    style={pos}
                    className="absolute cursor-pointer group"
                    title={inc.title}
                  >
                    <div className="relative flex items-center justify-center">
                      <span className="animate-ping absolute inline-flex h-4 w-4 rounded-full bg-[#e11d48] opacity-75" />
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-[#e11d48] border border-white" />
                    </div>
                  </div>
                );
              })}

              <div className="absolute bottom-2 left-2 bg-white/90 border border-[#e8e8f0] px-2 py-0.5 rounded text-[9px] font-bold text-[#5b5b6e]">
                {incidents.length} active zone events
              </div>
            </div>
          </div>

          {/* Security Team Roster */}
          <div className="bg-white border border-[#e8e8f0] rounded-[20px] p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-[#16161d]">On-Duty Responders</h3>
                <p className="text-[11.5px] text-[#5b5b6e]">{members.length} Officers & Responders</p>
              </div>
              <button
                onClick={() => setMemberModalOpen(true)}
                className="p-1.5 rounded-[10px] bg-[#f1edff] hover:bg-[#e6e6ee] text-[#6d4aff] text-xs flex items-center gap-1 font-bold transition"
              >
                <Plus size={13} />
                <span>Add</span>
              </button>
            </div>

            <div className="space-y-2">
              {members.slice(0, 4).map((m) => (
                <div key={m.id} className="flex items-center justify-between p-2.5 rounded-[12px] bg-[#f7f7fa] border border-[#e8e8f0]">
                  <div className="flex items-center gap-2.5">
                    <div className="h-7 w-7 rounded-[8px] bg-[#f1edff] text-[#6d4aff] flex items-center justify-center font-bold text-xs">
                      {m.displayName[0]?.toUpperCase() || 'U'}
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-[#16161d]">{m.displayName}</h5>
                      <span className="text-[10px] text-[#5b5b6e]">{m.title || m.role}</span>
                    </div>
                  </div>

                  <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full bg-[#ecfdf5] text-[#059669]">
                    Ready
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* INTERACTIVE LIVE TRIAGE DRAWER */}
      {selectedIncident && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
          <div className="w-full max-w-xl bg-white border-l border-[#e8e8f0] h-full overflow-y-auto p-6 space-y-6 shadow-2xl flex flex-col justify-between">
            <div className="space-y-6">
              {/* Drawer Top Header */}
              <div className="flex items-center justify-between border-b border-[#e8e8f0] pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#f1f1f6] text-[#16161d]">
                      INCIDENT #{selectedIncident.id}
                    </span>
                    <span
                      className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                        selectedIncident.severity === 'IMMEDIATE_DANGER' || selectedIncident.severity === 'CRITICAL'
                          ? 'bg-[#e11d48]/10 text-[#e11d48]'
                          : 'bg-[#d97706]/10 text-[#d97706]'
                      }`}
                    >
                      {selectedIncident.severity}
                    </span>
                    <span
                      className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                        selectedIncident.status === 'RESOLVED'
                          ? 'bg-[#059669]/10 text-[#059669]'
                          : 'bg-[#6d4aff]/10 text-[#6d4aff]'
                      }`}
                    >
                      {selectedIncident.status}
                    </span>
                  </div>
                  <h2 className="text-lg font-black text-[#16161d]">{selectedIncident.title}</h2>
                </div>

                <button
                  onClick={() => setSelectedIncident(null)}
                  className="p-2 rounded-[12px] bg-[#f1f1f6] hover:bg-[#e6e6ee] text-[#5b5b6e] hover:text-[#16161d] transition"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Action Buttons Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <button
                  onClick={() => setDispatchModalOpen(true)}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-[12px] bg-[#e11d48] hover:bg-[#be123c] text-white text-xs font-bold transition shadow-sm"
                >
                  <Truck size={14} />
                  <span>Dispatch Patrol</span>
                </button>

                {selectedIncident.status !== 'RESOLVED' ? (
                  <button
                    onClick={() => handleUpdateStatus(selectedIncident.id, 'RESOLVED', 'Resolved via command triage drawer')}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-[12px] bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold transition shadow-sm"
                  >
                    <CheckCircle2 size={14} />
                    <span>Mark Resolved</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleUpdateStatus(selectedIncident.id, 'INVESTIGATING', 'Re-opened for follow-up verification')}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-[12px] bg-[#f1f1f6] hover:bg-[#e6e6ee] text-[#16161d] text-xs font-bold transition"
                  >
                    <RefreshCw size={14} />
                    <span>Re-open Case</span>
                  </button>
                )}

                <a
                  href={`tel:${selectedIncident.reporterContact}`}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-[12px] bg-[#f1f1f6] hover:bg-[#e6e6ee] text-[#16161d] text-xs font-bold transition border border-[#e8e8f0]"
                >
                  <Phone size={14} />
                  <span>Call Reporter</span>
                </a>
              </div>

              {/* OpenJev Tactical Decision Support for Responders */}
              <div className="bg-[#f1edff] border border-[#6d4aff]/20 rounded-[16px] p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-[#6d4aff]" />
                  <span className="text-xs font-black uppercase text-[#6d4aff] tracking-wider">
                    OpenJev Responder Decision Support
                  </span>
                </div>
                <p className="text-xs text-[#16161d] leading-relaxed">
                  <strong>Recommended Tactical Action: </strong>
                  Deploy 2 officers to {selectedIncident.location || 'scene'} immediately. Verify reporter is in well-lit public reception before releasing unit.
                </p>
              </div>

              {/* Incident Details Card */}
              <div className="bg-[#f7f7fa] border border-[#e8e8f0] rounded-[16px] p-4 space-y-3">
                <h4 className="text-xs font-black text-[#5b5b6e] uppercase tracking-wider">Incident Overview</h4>
                <p className="text-xs text-[#16161d] leading-relaxed">{selectedIncident.description}</p>

                <div className="grid grid-cols-2 gap-3 pt-2 text-xs border-t border-[#e8e8f0]">
                  <div>
                    <span className="text-[#5b5b6e] text-[10px] block">Location</span>
                    <span className="font-bold text-[#16161d] flex items-center gap-1 mt-0.5">
                      <MapPin size={12} className="text-[#e11d48]" />
                      {selectedIncident.location}
                    </span>
                    {selectedIncident.latitude && (
                      <a
                        href={`https://www.google.com/maps?q=${selectedIncident.latitude},${selectedIncident.longitude}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] text-[#6d4aff] hover:underline flex items-center gap-1 mt-1 font-mono"
                      >
                        <span>GPS: {selectedIncident.latitude}, {selectedIncident.longitude}</span>
                        <ExternalLink size={10} />
                      </a>
                    )}
                  </div>

                  <div>
                    <span className="text-[#5b5b6e] text-[10px] block">Reporter</span>
                    <span className="font-bold text-[#16161d] block mt-0.5">{selectedIncident.reporterName}</span>
                    <span className="text-[11px] text-[#5b5b6e] font-mono">{selectedIncident.reporterContact}</span>
                  </div>
                </div>
              </div>

              {/* Add SITREP Note Form */}
              <form onSubmit={handleAddSitrep} className="bg-[#f7f7fa] border border-[#e8e8f0] rounded-[16px] p-3.5 space-y-2">
                <label className="text-[11px] font-bold text-[#16161d] flex items-center gap-1.5">
                  <FileText size={13} className="text-[#6d4aff]" />
                  <span>Add SITREP / Radio Dispatch Note</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={sitrepNote}
                    onChange={(e) => setSitrepNote(e.target.value)}
                    placeholder="e.g. Officer arrived at scene, perimeter cleared..."
                    className="flex-1 bg-white border border-[#e8e8f0] rounded-[10px] px-3 py-2 text-xs text-[#16161d] placeholder-[#9797ab] focus:outline-none focus:border-[#6d4aff]"
                  />
                  <button
                    type="submit"
                    disabled={savingNote || !sitrepNote.trim()}
                    className="px-3 py-2 rounded-[10px] bg-[#6d4aff] hover:bg-[#5325e8] text-white text-xs font-bold disabled:opacity-50 transition flex items-center gap-1"
                  >
                    {savingNote ? <RefreshCw size={12} className="animate-spin" /> : <Send size={12} />}
                    <span>Post</span>
                  </button>
                </div>
              </form>
            </div>

            <div className="pt-4 border-t border-[#e8e8f0] flex justify-between items-center text-xs text-[#5b5b6e]">
              <span>Campus Command Dispatch</span>
              <button
                onClick={() => setSelectedIncident(null)}
                className="px-4 py-2 rounded-[12px] bg-[#f1f1f6] text-[#16161d] hover:bg-[#e6e6ee] font-bold transition"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DISPATCH PATROL UNIT MODAL */}
      {dispatchModalOpen && selectedIncident && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-[#e8e8f0] rounded-[22px] w-full max-w-md p-6 space-y-5 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#e8e8f0] pb-3">
              <div className="flex items-center gap-2 text-[#e11d48]">
                <Truck size={18} />
                <h3 className="text-sm font-black text-[#16161d]">Dispatch Field Security Unit</h3>
              </div>
              <button
                onClick={() => setDispatchModalOpen(false)}
                className="text-[#9797ab] hover:text-[#16161d] p-1 rounded-lg"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleDispatchSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#5b5b6e] mb-1 font-bold">Select Patrol Unit</label>
                <select
                  value={dispatchUnit}
                  onChange={(e) => setDispatchUnit(e.target.value)}
                  className="w-full bg-[#f7f7fa] border border-[#e8e8f0] rounded-[12px] px-3 py-2 text-[#16161d] focus:outline-none focus:border-[#6d4aff]"
                >
                  <option value="Patrol Unit Alpha-1">Patrol Unit Alpha-1 (Vehicle)</option>
                  <option value="Patrol Unit Charlie">Patrol Unit Charlie (Bicycle)</option>
                  <option value="Hostel Safety Wardens">Hostel Safety Wardens (Foot Patrol)</option>
                  <option value="Rapid Medical Response">Rapid Medical Response</option>
                </select>
              </div>

              <div>
                <label className="block text-[#5b5b6e] mb-1 font-bold">Command Officer</label>
                <input
                  type="text"
                  value={dispatchOfficer}
                  onChange={(e) => setDispatchOfficer(e.target.value)}
                  className="w-full bg-[#f7f7fa] border border-[#e8e8f0] rounded-[12px] px-3 py-2 text-[#16161d] focus:outline-none focus:border-[#6d4aff]"
                />
              </div>

              <div>
                <label className="block text-[#5b5b6e] mb-1 font-bold">Radio / Tactical Instructions</label>
                <textarea
                  rows={3}
                  value={dispatchInstructions}
                  onChange={(e) => setDispatchInstructions(e.target.value)}
                  placeholder="e.g. Approach with siren off, secure the eastern stairwell, verify reporter safety..."
                  className="w-full bg-[#f7f7fa] border border-[#e8e8f0] rounded-[12px] p-3 text-[#16161d] placeholder-[#9797ab] focus:outline-none focus:border-[#6d4aff]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setDispatchModalOpen(false)}
                  className="px-4 py-2 rounded-[12px] bg-[#f1f1f6] text-[#5b5b6e] hover:bg-[#e6e6ee] font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={dispatching}
                  className="px-4 py-2 rounded-[12px] bg-[#e11d48] hover:bg-[#be123c] text-white font-bold transition shadow-sm flex items-center gap-1.5"
                >
                  {dispatching ? <RefreshCw size={13} className="animate-spin" /> : <Truck size={13} />}
                  <span>Authorize & Dispatch</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BROADCAST MODAL */}
      {broadcastOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-[#e8e8f0] rounded-[22px] w-full max-w-md p-6 space-y-5 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#e8e8f0] pb-3">
              <div className="flex items-center gap-2 text-[#e11d48]">
                <Radio size={18} />
                <h3 className="text-sm font-black text-[#16161d]">Broadcast Emergency Advisory</h3>
              </div>
              <button
                onClick={() => setBroadcastOpen(false)}
                className="text-[#9797ab] hover:text-[#16161d] p-1 rounded-lg"
              >
                <X size={16} />
              </button>
            </div>

            {broadcastSuccess ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 size={36} className="text-[#059669] mx-auto animate-bounce" />
                <h4 className="text-sm font-black text-[#16161d]">Broadcast Transmitted Successfully</h4>
                <p className="text-xs text-[#5b5b6e]">All active campus devices notified.</p>
              </div>
            ) : (
              <form onSubmit={handleBroadcast} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[#5b5b6e] mb-1 font-bold">Alert Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Safety Advisory: East Gate Traffic Diversion"
                    value={broadcastTitle}
                    onChange={(e) => setBroadcastTitle(e.target.value)}
                    className="w-full bg-[#f7f7fa] border border-[#e8e8f0] rounded-[12px] px-3 py-2 text-[#16161d] focus:outline-none focus:border-[#6d4aff]"
                  />
                </div>

                <div>
                  <label className="block text-[#5b5b6e] mb-1 font-bold">Message Content</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Enter urgent safety instructions dispatched to all active users on campus..."
                    value={broadcastMsg}
                    onChange={(e) => setBroadcastMsg(e.target.value)}
                    className="w-full bg-[#f7f7fa] border border-[#e8e8f0] rounded-[12px] p-3 text-[#16161d] focus:outline-none focus:border-[#6d4aff] placeholder-[#9797ab]"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setBroadcastOpen(false)}
                    className="px-4 py-2 rounded-[12px] bg-[#f1f1f6] text-[#5b5b6e] hover:bg-[#e6e6ee] font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={broadcasting}
                    className="px-4 py-2 rounded-[12px] bg-[#e11d48] hover:bg-[#be123c] text-white font-bold transition shadow-sm flex items-center gap-1.5"
                  >
                    {broadcasting ? <RefreshCw size={13} className="animate-spin" /> : <Send size={13} />}
                    <span>Transmit Alert</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ADD MEMBER MODAL */}
      {memberModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-[#e8e8f0] rounded-[22px] w-full max-w-md p-6 space-y-5 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#e8e8f0] pb-3">
              <div className="flex items-center gap-2 text-[#6d4aff]">
                <UserPlus size={18} />
                <h3 className="text-sm font-black text-[#16161d]">Enroll Safety Officer / Member</h3>
              </div>
              <button
                onClick={() => setMemberModalOpen(false)}
                className="text-[#9797ab] hover:text-[#16161d] p-1 rounded-lg"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAddMember} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#5b5b6e] mb-1 font-bold">User Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="officer@campus.edu"
                  value={memberEmail}
                  onChange={(e) => setMemberEmail(e.target.value)}
                  className="w-full bg-[#f7f7fa] border border-[#e8e8f0] rounded-[12px] px-3 py-2 text-[#16161d] focus:outline-none focus:border-[#6d4aff]"
                />
              </div>

              <div>
                <label className="block text-[#5b5b6e] mb-1 font-bold">Assigned Role</label>
                <select
                  value={memberRole}
                  onChange={(e) => setMemberRole(e.target.value)}
                  className="w-full bg-[#f7f7fa] border border-[#e8e8f0] rounded-[12px] px-3 py-2 text-[#16161d] focus:outline-none focus:border-[#6d4aff]"
                >
                  <option value="SECURITY_OFFICER">Security Officer</option>
                  <option value="ORG_ADMIN">Organization Admin</option>
                  <option value="MEMBER">Standard Campus Member</option>
                </select>
              </div>

              <div>
                <label className="block text-[#5b5b6e] mb-1 font-bold">Department / Unit</label>
                <input
                  type="text"
                  value={memberDept}
                  onChange={(e) => setMemberDept(e.target.value)}
                  className="w-full bg-[#f7f7fa] border border-[#e8e8f0] rounded-[12px] px-3 py-2 text-[#16161d] focus:outline-none focus:border-[#6d4aff]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setMemberModalOpen(false)}
                  className="px-4 py-2 rounded-[12px] bg-[#f1f1f6] text-[#5b5b6e] hover:bg-[#e6e6ee] font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addingMember}
                  className="px-4 py-2 rounded-[12px] bg-[#6d4aff] hover:bg-[#5325e8] text-white font-bold transition shadow-sm flex items-center gap-1.5"
                >
                  {addingMember ? <RefreshCw size={13} className="animate-spin" /> : <Plus size={13} />}
                  <span>Enroll Member</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
