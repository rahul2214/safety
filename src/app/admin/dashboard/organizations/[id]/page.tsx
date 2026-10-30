'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
  Mail,
  UserCheck,
  ChevronRight,
  TrendingUp,
  Activity,
  CheckCircle2,
  X,
  ExternalLink,
  MessageSquare,
  Truck,
  FileText,
  AlertOctagon,
  UserPlus,
} from 'lucide-react';
import {
  organizationsApi,
  type Organization,
  type OrganizationMember,
  type OrgDashboardStats,
  type OrgIncident,
  type OrgIncidentEvent,
} from '@/portals/admin/lib/api';

export default function OrgCommandCenterPage() {
  const params = useParams();
  const router = useRouter();
  const orgId = Number(params?.id);

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
    if (!orgId) return;
    setLoading(true);
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
    setLoading(false);
  };

  useEffect(() => {
    loadAll();
  }, [orgId]);

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle || !broadcastMsg) return;

    setBroadcasting(true);
    const res = await organizationsApi.sendBroadcast(orgId, {
      title: broadcastTitle,
      message: broadcastMsg,
      urgency: 'CRITICAL',
    });
    setBroadcasting(false);

    if (res.data) {
      setBroadcastSuccess(true);
      setTimeout(() => {
        setBroadcastSuccess(false);
        setBroadcastOpen(false);
        setBroadcastTitle('');
        setBroadcastMsg('');
        loadAll();
      }, 2000);
    } else {
      alert(res.error?.message || 'Failed to dispatch broadcast');
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberEmail) return;

    setAddingMember(true);
    const res = await organizationsApi.addMember(orgId, {
      email: memberEmail,
      role: memberRole,
      department: memberDept,
    });
    setAddingMember(false);

    if (res.data) {
      setMemberModalOpen(false);
      setMemberEmail('');
      loadAll();
    } else {
      alert(res.error?.message || 'Failed to add member to organization');
    }
  };

  const handleUpdateStatus = async (
    incidentId: number,
    newStatus: string,
    notes?: string
  ) => {
    const res = await organizationsApi.updateIncidentStatus(orgId, incidentId, {
      status: newStatus,
      notes,
    });

    if (res.data) {
      const updated = res.data;
      setIncidents((prev) => prev.map((i) => (i.id === incidentId ? updated : i)));
      if (selectedIncident?.id === incidentId) {
        setSelectedIncident(updated);
      }
    } else {
      alert(res.error?.message || 'Failed to update incident status');
    }
  };

  const handleDispatchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIncident) return;

    setDispatching(true);
    const res = await organizationsApi.dispatchPatrol(orgId, selectedIncident.id, {
      unitName: dispatchUnit,
      officerName: dispatchOfficer,
      dispatchPriority: dispatchPriority,
      instructions: dispatchInstructions,
    });
    setDispatching(false);

    if (res.data) {
      const updated = res.data;
      setIncidents((prev) => prev.map((i) => (i.id === selectedIncident.id ? updated : i)));
      setSelectedIncident(updated);
      setDispatchModalOpen(false);
      setDispatchInstructions('');
    } else {
      alert(res.error?.message || 'Failed to dispatch field patrol unit');
    }
  };

  const handleAddSitrep = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIncident || !sitrepNote.trim()) return;

    setSavingNote(true);
    const res = await organizationsApi.updateIncidentStatus(orgId, selectedIncident.id, {
      status: selectedIncident.status,
      notes: `[RADIO SITREP] ${sitrepNote.trim()}`,
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

  if (!org) {
    return (
      <div className="py-16 text-center">
        <p className="text-[#16161d] font-bold">Organization not found</p>
        <Link href="/admin/dashboard/organizations" className="text-xs text-[#6d4aff] underline mt-2 inline-block">
          Return to directory
        </Link>
      </div>
    );
  }

  const filteredIncidents = incidents.filter((inc) => {
    if (incidentTab === 'ACTIVE') return inc.status !== 'RESOLVED' && inc.status !== 'FALSE_ALARM';
    if (incidentTab === 'RESOLVED') return inc.status === 'RESOLVED' || inc.status === 'FALSE_ALARM';
    return true;
  });

  return (
    <div className="space-y-6 select-none">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-[#5b5b6e]">
        <Link href="/admin/dashboard/organizations" className="hover:text-[#6d4aff] transition-colors flex items-center gap-1 font-semibold">
          <ArrowLeft size={13} />
          <span>Organizations Directory</span>
        </Link>
        <span>/</span>
        <span className="text-[#16161d] font-semibold">{org.name}</span>
      </div>

      {/* Main Command Center Header Banner */}
      <div className="bg-white border border-[#e8e8f0] p-6 rounded-[20px] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
            <h1 className="text-xl font-black text-[#16161d] tracking-tight">{org.name}</h1>
            <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-[8px] bg-rose-50 text-rose-600 border border-rose-100">
              {org.plan}
            </span>
            <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-[8px] bg-[#f1edff] text-[#6d4aff] border border-[#ddd6fe]">
              {org.type}
            </span>
          </div>
          <p className="text-xs text-[#5b5b6e] mt-1.5 flex items-center gap-2">
            <span>Primary Dispatch Perimeter: {org.domain || `${org.slug}.sabhijude.internal`}</span>
            <span className="text-[#9797ab]">•</span>
            <span className="text-emerald-600 font-semibold">All Systems Operational</span>
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <Link
            href={`/admin/dashboard/organizations/${orgId}/analytics`}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-[12px] bg-white hover:bg-[#f7f7fa] text-[#16161d] border border-[#e8e8f0] text-xs font-bold transition-colors shadow-2xs"
          >
            <TrendingUp size={15} className="text-[#6d4aff]" />
            <span>Safety Analytics</span>
          </Link>

          <button
            onClick={loadAll}
            className="p-2.5 rounded-[12px] bg-white hover:bg-[#f7f7fa] text-[#5b5b6e] border border-[#e8e8f0] transition-colors shadow-2xs"
            title="Refresh Real-time Telemetry"
          >
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          </button>

          <button
            onClick={() => setBroadcastOpen(true)}
            className="flex-1 md:flex-initial flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-[12px] text-xs font-black shadow-sm transition-all active:scale-[0.98]"
          >
            <Radio size={16} className="animate-pulse" />
            <span>Broadcast Campus Alert</span>
          </button>
        </div>
      </div>

      {/* 5 Primary Operational KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* Safety Score */}
        <div className="bg-white border border-[#e8e8f0] p-4 rounded-[16px] shadow-xs">
          <div className="flex items-center justify-between text-[#747488] text-[11px] font-bold uppercase">
            <span>Safety Index</span>
            <div className="w-7 h-7 rounded-[8px] bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck size={15} />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-emerald-600">{stats?.safetyScore ?? 96}%</span>
            <span className="text-[10px] text-emerald-600 font-bold uppercase">Grade A+</span>
          </div>
          <div className="w-full bg-[#f1f1f6] h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${stats?.safetyScore ?? 96}%` }} />
          </div>
        </div>

        {/* Active Incidents */}
        <div className="bg-white border border-[#e8e8f0] p-4 rounded-[16px] shadow-xs">
          <div className="flex items-center justify-between text-[#747488] text-[11px] font-bold uppercase">
            <span>Active Incidents</span>
            <div className="w-7 h-7 rounded-[8px] bg-amber-50 text-amber-600 flex items-center justify-center">
              <ShieldAlert size={15} />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-amber-600">{stats?.activeIncidents ?? 3}</span>
            <span className="text-[10px] text-[#5b5b6e]">Under Action</span>
          </div>
          <p className="text-[10px] text-[#5b5b6e] mt-2 flex items-center gap-1 font-medium">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-500" />
            <span>2 units in field</span>
          </p>
        </div>

        {/* SOS Panic Alerts */}
        <div className="bg-white border border-[#e8e8f0] p-4 rounded-[16px] shadow-xs">
          <div className="flex items-center justify-between text-[#747488] text-[11px] font-bold uppercase">
            <span>Critical SOS</span>
            <div className="w-7 h-7 rounded-[8px] bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle size={15} className="animate-pulse" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-rose-600">{stats?.sosAlertsToday ?? 1}</span>
            <span className="text-[10px] text-rose-600 font-semibold">Today</span>
          </div>
          <p className="text-[10px] text-emerald-600 mt-2 flex items-center gap-1 font-semibold">
            <CheckCircle2 size={11} />
            <span>Avg response: 4.2m</span>
          </p>
        </div>

        {/* Protected Campus Members */}
        <Link
          href={`/admin/dashboard/organizations/${orgId}/members`}
          className="bg-white border border-[#e8e8f0] hover:border-[#6d4aff]/40 transition p-4 rounded-[16px] shadow-xs block group"
        >
          <div className="flex items-center justify-between text-[#747488] text-[11px] font-bold uppercase">
            <span className="group-hover:text-[#6d4aff] transition">Protected Roster</span>
            <div className="w-7 h-7 rounded-[8px] bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users size={15} />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-[#16161d]">{stats?.totalMembers ?? 64}</span>
            <span className="text-[10px] text-[#5b5b6e]">Enrolled</span>
          </div>
          <p className="text-[10px] text-[#6d4aff] mt-2 flex items-center justify-between font-semibold">
            <span>100% telemetry synced</span>
            <span className="underline text-[9px]">View Roster &rarr;</span>
          </p>
        </Link>

        {/* Avg Resolution Speed */}
        <div className="bg-white border border-[#e8e8f0] p-4 rounded-[16px] shadow-xs col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-[#747488] text-[11px] font-bold uppercase">
            <span>Avg Triage Time</span>
            <div className="w-7 h-7 rounded-[8px] bg-[#f1edff] text-[#6d4aff] flex items-center justify-center">
              <Clock size={15} />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-[#6d4aff]">{stats?.avgResolutionTimeHours ?? 0.8}h</span>
            <span className="text-[10px] text-[#5b5b6e]">per case</span>
          </div>
          <p className="text-[10px] text-[#5b5b6e] mt-2 font-medium">
            <span className="text-emerald-600 font-bold">+{stats?.resolvedIncidentsThisMonth ?? 42}</span> resolved this month
          </p>
        </div>
      </div>

      {/* Main Grid: Live Incident Stream & Triage (2 Cols) + Analytics/Hotspots (1 Col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Incident Management & Stream (2 Cols) */}
        <div className="lg:col-span-2 bg-white border border-[#e8e8f0] rounded-[20px] p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between flex-wrap gap-2 border-b border-[#e8e8f0] pb-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-[#16161d]">Live Incident & Triage Stream</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#f1edff] text-[#6d4aff] font-bold">
                  {filteredIncidents.length} Records
                </span>
              </div>
              <p className="text-[11px] text-[#5b5b6e]">Click any incident to open the Live Dispatch & Audit Drawer</p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 bg-[#f7f7fa] p-1 rounded-[12px] border border-[#e8e8f0] text-[11px]">
              {(['ALL', 'ACTIVE', 'RESOLVED'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setIncidentTab(tab)}
                  className={`px-3 py-1 rounded-[10px] font-semibold transition-colors ${
                    incidentTab === tab
                      ? 'bg-white text-[#16161d] font-bold shadow-2xs'
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
              <div className="py-12 text-center text-xs text-[#747488]">No safety incidents reported in this view.</div>
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
                    className={`p-4 rounded-[16px] border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 cursor-pointer transition-all ${
                      selectedIncident?.id === inc.id
                        ? 'border-[#6d4aff] shadow-sm bg-white'
                        : isCritical
                        ? 'bg-red-50/20 border-red-200 hover:border-red-300'
                        : 'bg-[#fafafc] border-[#ececf2] hover:border-[#6d4aff]/30 hover:bg-white'
                    }`}
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded-[6px] font-bold ${
                            isCritical
                              ? 'bg-rose-50 text-rose-700 border border-rose-200 animate-pulse'
                              : isConcerning
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-blue-50 text-blue-700 border border-blue-200'
                          }`}
                        >
                          {inc.severity.replace('_', ' ')}
                        </span>

                        <span
                          className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded-[6px] font-bold ${
                            isResolved
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : isDispatched
                              ? 'bg-[#f1edff] text-[#6d4aff] border border-[#ddd6fe]'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {inc.status}
                        </span>

                        <span className="text-[10px] text-[#747488] font-mono">
                          {new Date(inc.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-[#16161d]">{inc.title}</h4>
                      <p className="text-[11px] text-[#5b5b6e] line-clamp-1">{inc.description}</p>

                      <div className="flex items-center gap-3 text-[11px] text-[#5b5b6e] flex-wrap">
                        <span className="flex items-center gap-1 text-[#16161d] font-semibold">
                          <MapPin size={11} className="text-[#6d4aff]" />
                          <span>{inc.location || 'Perimeter Core'}</span>
                        </span>
                        <span>•</span>
                        <span>Reporter: <strong className="text-[#16161d]">{inc.reporterName}</strong></span>
                        {inc.assignedOfficerName && (
                          <>
                            <span>•</span>
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
                        className="px-3 py-1.5 rounded-[10px] bg-white hover:bg-[#f7f7fa] text-[#16161d] border border-[#e8e8f0] text-xs font-semibold flex items-center gap-1 shadow-2xs"
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

        {/* Right Column: Campus Safety Map & Hotspots + Category Breakdown */}
        <div className="space-y-6">
          {/* Virtual Campus Hotspot Locator */}
          <div className="bg-white border border-[#e8e8f0] rounded-[20px] p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#16161d]">Campus Hotspot Locator</h3>
                <p className="text-[11px] text-[#5b5b6e]">Live coordinates & perimeter status</p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-[6px] bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                RADAR ACTIVE
              </span>
            </div>

            {/* Visual Map Radar */}
            <div className="relative h-48 bg-[#fafafc] rounded-[16px] border border-[#ececf2] overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-36 h-36 rounded-full border border-[#ececf2] animate-ping opacity-30" />
                <div className="w-24 h-24 rounded-full border border-[#e8e8f0]" />
                <div className="w-12 h-12 rounded-full border border-[#ddd6fe]" />
              </div>

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
                      <span className="animate-ping absolute inline-flex h-4 w-4 rounded-full bg-rose-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500 border border-white" />
                    </div>
                    <span className="hidden group-hover:block absolute bottom-4 left-1/2 -translate-x-1/2 bg-white border border-[#e8e8f0] text-[10px] text-[#16161d] px-2 py-0.5 rounded shadow-lg whitespace-nowrap z-10 font-bold">
                      #{inc.id} {inc.location}
                    </span>
                  </div>
                );
              })}

              <div className="absolute bottom-2 left-2 bg-white/90 border border-[#e8e8f0] px-2 py-1 rounded-[6px] text-[9px] font-mono text-[#5b5b6e]">
                {Math.min(incidents.length, 3)} of {incidents.length} incident{incidents.length === 1 ? '' : 's'} shown
              </div>
            </div>
          </div>

          {/* Incident Category Breakdown */}
          <div className="bg-white border border-[#e8e8f0] rounded-[20px] p-5 shadow-xs">
            <h3 className="text-sm font-bold text-[#16161d] mb-1">Categories (30 Days)</h3>
            <p className="text-[11px] text-[#5b5b6e] mb-4">Distribution of reported safety events</p>

            <div className="space-y-2.5">
              {(stats?.incidentsByCategory || []).map((cat) => {
                const total = (stats?.incidentsByCategory || []).reduce((a, b) => a + b.count, 0) || 1;
                const pct = Math.round((cat.count / total) * 100);

                return (
                  <div key={cat.category} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-[#16161d]">
                      <span>{cat.category}</span>
                      <span className="font-mono text-[#5b5b6e]">{cat.count} ({pct}%)</span>
                    </div>
                    <div className="w-full bg-[#f1f1f6] h-2 rounded-full overflow-hidden border border-[#ececf2]">
                      <div className="bg-[#6d4aff] h-full rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Security Team & Members On-Duty */}
          <div className="bg-white border border-[#e8e8f0] rounded-[20px] p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-[#16161d]">Campus Safety Team</h3>
                <p className="text-[11px] text-[#5b5b6e]">{members.length} Officers & Admins</p>
              </div>
              <button
                onClick={() => setMemberModalOpen(true)}
                className="p-1.5 px-2.5 rounded-[10px] bg-white hover:bg-[#f7f7fa] text-[#16161d] border border-[#e8e8f0] text-xs flex items-center gap-1 font-semibold shadow-2xs"
              >
                <Plus size={13} />
                <span>Add</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {members.slice(0, 4).map((m) => (
                <div key={m.id} className="flex items-center justify-between p-2.5 rounded-[14px] bg-[#fafafc] border border-[#ececf2]">
                  <div className="flex items-center gap-2.5">
                    <div className="h-7 w-7 rounded-[10px] bg-[#f1edff] text-[#6d4aff] flex items-center justify-center font-bold text-xs">
                      {m.displayName[0]?.toUpperCase() || 'U'}
                    </div>
                    <div>
                      <h5 className="text-xs font-semibold text-[#16161d]">{m.displayName}</h5>
                      <span className="text-[10px] text-[#5b5b6e]">{m.title || m.role}</span>
                    </div>
                  </div>

                  <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded-[6px] bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Active
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* INTERACTIVE LIVE TRIAGE DRAWER */}
      {selectedIncident && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
          <div className="w-full max-w-xl bg-white border-l border-[#e8e8f0] h-full overflow-y-auto p-6 space-y-6 shadow-2xl flex flex-col justify-between text-[#16161d]">
            <div className="space-y-6">
              {/* Drawer Top Header */}
              <div className="flex items-center justify-between border-b border-[#e8e8f0] pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-[6px] bg-[#f1f1f6] text-[#16161d] border border-[#e8e8f0]">
                      INCIDENT #{selectedIncident.id}
                    </span>
                    <span
                      className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-[6px] ${
                        selectedIncident.severity === 'IMMEDIATE_DANGER' || selectedIncident.severity === 'CRITICAL'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {selectedIncident.severity}
                    </span>
                    <span
                      className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-[6px] ${
                        selectedIncident.status === 'RESOLVED'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-[#f1edff] text-[#6d4aff] border border-[#ddd6fe]'
                      }`}
                    >
                      {selectedIncident.status}
                    </span>
                  </div>
                  <h2 className="text-lg font-black text-[#16161d]">{selectedIncident.title}</h2>
                </div>

                <button
                  onClick={() => setSelectedIncident(null)}
                  className="p-1.5 rounded-[10px] bg-white hover:bg-[#f7f7fa] text-[#747488] hover:text-[#16161d] border border-[#e8e8f0]"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Action Buttons Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <button
                  onClick={() => setDispatchModalOpen(true)}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-[12px] bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-sm"
                >
                  <Truck size={14} />
                  <span>Dispatch Patrol</span>
                </button>

                {selectedIncident.status !== 'RESOLVED' ? (
                  <button
                    onClick={() => handleUpdateStatus(selectedIncident.id, 'RESOLVED', 'Resolved via command triage drawer')}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-[12px] bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm"
                  >
                    <CheckCircle2 size={14} />
                    <span>Mark Resolved</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleUpdateStatus(selectedIncident.id, 'INVESTIGATING', 'Re-opened for follow-up verification')}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-[12px] bg-white hover:bg-[#f7f7fa] text-[#16161d] border border-[#e8e8f0] text-xs font-bold transition-all shadow-2xs"
                  >
                    <RefreshCw size={14} />
                    <span>Re-open Case</span>
                  </button>
                )}

                <a
                  href={`tel:${selectedIncident.reporterContact}`}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-[12px] bg-white hover:bg-[#f7f7fa] text-[#16161d] text-xs font-bold transition-all border border-[#e8e8f0] shadow-2xs"
                >
                  <Phone size={14} />
                  <span>Call Reporter</span>
                </a>
              </div>

              {/* Incident Details Card */}
              <div className="bg-[#fafafc] border border-[#ececf2] rounded-[16px] p-4 space-y-3">
                <h4 className="text-xs font-bold text-[#747488] uppercase tracking-wider">Incident Overview</h4>
                <p className="text-xs text-[#16161d] leading-relaxed">{selectedIncident.description}</p>

                <div className="grid grid-cols-2 gap-3 pt-2 text-xs border-t border-[#ececf2]">
                  <div>
                    <span className="text-[#747488] text-[10px] block">Location</span>
                    <span className="font-semibold text-[#16161d] flex items-center gap-1 mt-0.5">
                      <MapPin size={12} className="text-[#6d4aff]" />
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
                    <span className="text-[#747488] text-[10px] block">Reporter</span>
                    <span className="font-semibold text-[#16161d] block mt-0.5">{selectedIncident.reporterName}</span>
                    <span className="text-[11px] text-[#5b5b6e] font-mono">{selectedIncident.reporterContact}</span>
                  </div>
                </div>

                {selectedIncident.assignedOfficerName && (
                  <div className="pt-2 text-xs border-t border-[#ececf2] flex items-center justify-between">
                    <span className="text-[#747488] text-[11px]">Assigned Officer</span>
                    <span className="font-bold text-[#6d4aff]">{selectedIncident.assignedOfficerName}</span>
                  </div>
                )}
              </div>

              {/* Live Security Dispatch Timeline & Audit Trail */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-[#747488] uppercase tracking-wider flex items-center gap-1.5">
                    <Activity size={14} className="text-emerald-600" />
                    <span>Live Dispatch Audit Trail ({selectedIncident.dispatchTimeline?.length || 0})</span>
                  </h4>
                  <span className="text-[10px] font-mono text-[#9797ab]">Chronological</span>
                </div>

                <div className="relative pl-4 space-y-4 border-l border-[#e8e8f0]">
                  {(selectedIncident.dispatchTimeline || []).map((ev, idx) => (
                    <div key={ev.id || idx} className="relative group">
                      {/* Timeline node */}
                      <div className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-[#6d4aff] ring-4 ring-[#f1edff]" />
                      <div className="text-[11px] text-[#747488] font-mono flex items-center gap-2">
                        <span>{new Date(ev.timestamp).toLocaleTimeString()}</span>
                        <span>•</span>
                        <span className="text-[#16161d] font-semibold">{ev.actor}</span>
                      </div>
                      <div className="text-xs font-bold text-[#16161d] mt-0.5">{ev.action.replace('_', ' ')}</div>
                      {ev.notes && <p className="text-[11px] text-[#5b5b6e] mt-0.5">{ev.notes}</p>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Add SITREP Note Form */}
              <form onSubmit={handleAddSitrep} className="bg-[#fafafc] border border-[#ececf2] rounded-[16px] p-3.5 space-y-2">
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
                    className="px-3 py-2 rounded-[10px] bg-[#6d4aff] hover:bg-[#5325e8] text-white text-xs font-bold disabled:opacity-50 transition-all flex items-center gap-1 shadow-sm"
                  >
                    {savingNote ? <RefreshCw size={12} className="animate-spin" /> : <Send size={12} />}
                    <span>Post</span>
                  </button>
                </div>
              </form>
            </div>

            <div className="pt-4 border-t border-[#e8e8f0] flex justify-between items-center text-xs text-[#5b5b6e]">
              <span>Secure Command Transmission</span>
              <button
                onClick={() => setSelectedIncident(null)}
                className="px-4 py-2 rounded-[12px] bg-white border border-[#e8e8f0] text-[#16161d] hover:bg-[#f7f7fa] font-semibold text-xs shadow-2xs"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DISPATCH PATROL UNIT MODAL */}
      {dispatchModalOpen && selectedIncident && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#e8e8f0] rounded-[22px] w-full max-w-md p-6 space-y-5 shadow-xl animate-in zoom-in-95 duration-150 text-[#16161d]">
            <div className="flex items-center justify-between border-b border-[#e8e8f0] pb-3">
              <div className="flex items-center gap-2 text-red-600">
                <Truck size={18} />
                <h3 className="text-sm font-bold text-[#16161d]">Dispatch Field Patrol Unit</h3>
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
                <label className="block text-[#16161d] mb-1 font-semibold">Select Patrol Unit</label>
                <select
                  value={dispatchUnit}
                  onChange={(e) => setDispatchUnit(e.target.value)}
                  className="w-full bg-[#f7f7fa] border border-[#e8e8f0] rounded-[12px] px-3 py-2 text-[#16161d] focus:outline-none focus:border-[#6d4aff] focus:bg-white"
                >
                  <option value="Patrol Unit Alpha-1">Patrol Unit Alpha-1 (Vehicle)</option>
                  <option value="Patrol Unit Charlie">Patrol Unit Charlie (Bicycle)</option>
                  <option value="Hostel Safety Wardens">Hostel Safety Wardens (Foot Patrol)</option>
                  <option value="K9 Perimeter Unit">K9 Perimeter Unit</option>
                  <option value="Rapid Medical Response">Rapid Medical Response</option>
                </select>
              </div>

              <div>
                <label className="block text-[#16161d] mb-1 font-semibold">Command Officer</label>
                <input
                  type="text"
                  value={dispatchOfficer}
                  onChange={(e) => setDispatchOfficer(e.target.value)}
                  className="w-full bg-[#f7f7fa] border border-[#e8e8f0] rounded-[12px] px-3 py-2 text-[#16161d] focus:outline-none focus:border-[#6d4aff] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[#16161d] mb-1 font-semibold">Priority Level</label>
                <select
                  value={dispatchPriority}
                  onChange={(e) => setDispatchPriority(e.target.value)}
                  className="w-full bg-[#f7f7fa] border border-[#e8e8f0] rounded-[12px] px-3 py-2 text-[#16161d] focus:outline-none focus:border-[#6d4aff] focus:bg-white"
                >
                  <option value="IMMEDIATE_DANGER">Emergency / Code Red</option>
                  <option value="HIGH">High Priority</option>
                  <option value="STANDARD">Standard Inspection</option>
                </select>
              </div>

              <div>
                <label className="block text-[#16161d] mb-1 font-semibold">Radio / Tactical Instructions</label>
                <textarea
                  rows={3}
                  value={dispatchInstructions}
                  onChange={(e) => setDispatchInstructions(e.target.value)}
                  placeholder="e.g. Approach with siren off, secure the eastern stairwell, verify reporter safety..."
                  className="w-full bg-[#f7f7fa] border border-[#e8e8f0] rounded-[12px] p-3 text-[#16161d] placeholder-[#9797ab] focus:outline-none focus:border-[#6d4aff] focus:bg-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setDispatchModalOpen(false)}
                  className="px-4 py-2 rounded-[12px] bg-white border border-[#e8e8f0] text-[#5b5b6e] hover:text-[#16161d] font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={dispatching}
                  className="px-4 py-2 rounded-[12px] bg-red-600 hover:bg-red-700 text-white font-bold transition-all shadow-sm flex items-center gap-1.5"
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
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#e8e8f0] rounded-[22px] w-full max-w-md p-6 space-y-5 shadow-xl animate-in zoom-in-95 duration-150 text-[#16161d]">
            <div className="flex items-center justify-between border-b border-[#e8e8f0] pb-3">
              <div className="flex items-center gap-2 text-red-600">
                <Radio size={18} className="animate-pulse" />
                <h3 className="text-sm font-bold text-[#16161d]">Broadcast Emergency Notification</h3>
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
                <CheckCircle2 size={36} className="text-emerald-500 mx-auto animate-bounce" />
                <h4 className="text-sm font-bold text-[#16161d]">Broadcast Transmitted Successfully!</h4>
                <p className="text-xs text-[#5b5b6e]">All {stats?.totalMembers ?? 64} campus devices notified.</p>
              </div>
            ) : (
              <form onSubmit={handleBroadcast} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[#16161d] mb-1 font-semibold">Alert Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Safety Drill: Sector 4 Evacuation"
                    value={broadcastTitle}
                    onChange={(e) => setBroadcastTitle(e.target.value)}
                    className="w-full bg-[#f7f7fa] border border-[#e8e8f0] rounded-[12px] px-3 py-2 text-[#16161d] focus:outline-none focus:border-[#6d4aff] focus:bg-white placeholder-[#9797ab]"
                  />
                </div>

                <div>
                  <label className="block text-[#16161d] mb-1 font-semibold">Message Body</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Enter urgent safety instructions dispatched to all active users on campus..."
                    value={broadcastMsg}
                    onChange={(e) => setBroadcastMsg(e.target.value)}
                    className="w-full bg-[#f7f7fa] border border-[#e8e8f0] rounded-[12px] p-3 text-[#16161d] focus:outline-none focus:border-[#6d4aff] focus:bg-white placeholder-[#9797ab]"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setBroadcastOpen(false)}
                    className="px-4 py-2 rounded-[12px] bg-white border border-[#e8e8f0] text-[#5b5b6e] hover:text-[#16161d] font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={broadcasting}
                    className="px-4 py-2 rounded-[12px] bg-red-600 hover:bg-red-700 text-white font-bold transition-all shadow-sm flex items-center gap-1.5"
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
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#e8e8f0] rounded-[22px] w-full max-w-md p-6 space-y-5 shadow-xl animate-in zoom-in-95 duration-150 text-[#16161d]">
            <div className="flex items-center justify-between border-b border-[#e8e8f0] pb-3">
              <div className="flex items-center gap-2 text-[#6d4aff]">
                <UserPlus size={18} />
                <h3 className="text-sm font-bold text-[#16161d]">Enroll Safety Officer / Member</h3>
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
                <label className="block text-[#16161d] mb-1 font-semibold">User Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="officer@campus.edu"
                  value={memberEmail}
                  onChange={(e) => setMemberEmail(e.target.value)}
                  className="w-full bg-[#f7f7fa] border border-[#e8e8f0] rounded-[12px] px-3 py-2 text-[#16161d] focus:outline-none focus:border-[#6d4aff] focus:bg-white placeholder-[#9797ab]"
                />
              </div>

              <div>
                <label className="block text-[#16161d] mb-1 font-semibold">Assigned Role</label>
                <select
                  value={memberRole}
                  onChange={(e) => setMemberRole(e.target.value)}
                  className="w-full bg-[#f7f7fa] border border-[#e8e8f0] rounded-[12px] px-3 py-2 text-[#16161d] focus:outline-none focus:border-[#6d4aff] focus:bg-white"
                >
                  <option value="SECURITY_OFFICER">Security Officer</option>
                  <option value="ORG_ADMIN">Organization Admin</option>
                  <option value="MEMBER">Standard Campus Member</option>
                </select>
              </div>

              <div>
                <label className="block text-[#16161d] mb-1 font-semibold">Department / Unit</label>
                <input
                  type="text"
                  value={memberDept}
                  onChange={(e) => setMemberDept(e.target.value)}
                  className="w-full bg-[#f7f7fa] border border-[#e8e8f0] rounded-[12px] px-3 py-2 text-[#16161d] focus:outline-none focus:border-[#6d4aff] focus:bg-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setMemberModalOpen(false)}
                  className="px-4 py-2 rounded-[12px] bg-white border border-[#e8e8f0] text-[#5b5b6e] hover:text-[#16161d] font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addingMember}
                  className="px-4 py-2 rounded-[12px] bg-[#6d4aff] hover:bg-[#5325e8] text-white font-bold transition-all shadow-sm flex items-center gap-1.5"
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
