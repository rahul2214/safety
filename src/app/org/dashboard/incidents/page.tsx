'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldAlert,
  Search,
  Clock,
  MapPin,
  CheckCircle2,
  PhoneCall,
  Send,
  Radio,
  Eye,
  RefreshCw,
  BellRing,
} from 'lucide-react';
import { organizationsApi, type OrgIncident } from '@/portals/org/lib/api';
import { SafetyHubClient, type SosAlertEvent } from '@/portals/org/lib/safety-hub';
import { useOrgId } from '@/portals/org/lib/org-context';

export default function OrgIncidentsTriagePage() {
  // Scoped to the organization this account is signed in to.
  const orgId = useOrgId();
  const [incidents, setIncidents] = useState<OrgIncident[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterSeverity, setFilterSeverity] = useState('ALL');
  const [search, setSearch] = useState('');
  const [selectedIncident, setSelectedIncident] = useState<OrgIncident | null>(null);
  const [officerInput, setOfficerInput] = useState('Officer Marcus Vance');
  const [notesInput, setNotesInput] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [liveSosAlert, setLiveSosAlert] = useState<SosAlertEvent | null>(null);

  // Connect SignalR Live Safety Dispatch Stream
  useEffect(() => {
    if (orgId == null) return;

    const hub = new SafetyHubClient(orgId, (sos) => {
      setLiveSosAlert(sos);
      // Prepend the new live incident to queue immediately
      const newIncident: OrgIncident = {
        id: sos.incidentId,
        organizationId: sos.organizationId,
        title: `EMERGENCY SOS: ${sos.userName}`,
        description: `Student distress signal triggered from mobile application. Student Code: ${sos.memberCode || 'N/A'}. Location: ${sos.address || 'GPS Coordinates'}.`,
        severity: 'IMMEDIATE_DANGER',
        status: 'PENDING',
        location: sos.address || `${sos.latitude.toFixed(5)}, ${sos.longitude.toFixed(5)}`,
        latitude: sos.latitude,
        longitude: sos.longitude,
        reporterName: sos.userName,
        reporterContact: sos.userPhone,
        createdAt: sos.createdAt,
        dispatchTimeline: [
          {
            id: '1',
            timestamp: sos.createdAt,
            actor: 'Sabhijude Mobile App',
            action: 'SOS Distress Signal Triggered',
            notes: `Auto-routed to Campus Security Control Room. Accuracy: Â±${sos.accuracy || 10}m.`,
          },
        ],
      };
      setIncidents((prev) => [newIncident, ...prev]);
      setSelectedIncident(newIncident);
    });

    hub.start();
    return () => {
      hub.stop();
    };
  }, [orgId]);

  const fetchIncidents = async () => {
    setLoading(true);
    if (orgId == null) return;

    const res = await organizationsApi.getIncidents(orgId, {
      status: filterStatus === 'ALL' ? undefined : filterStatus,
      severity: filterSeverity === 'ALL' ? undefined : filterSeverity,
    });
    if (res.data) {
      setIncidents(res.data);
      if (res.data.length > 0 && !selectedIncident) {
        setSelectedIncident(res.data[0]);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchIncidents();
  }, [filterStatus, filterSeverity]);

  const handleUpdateStatus = async (newStatus: string) => {
    if (!selectedIncident) return;
    setActionLoading(true);
    if (orgId == null) return;

    const res = await organizationsApi.updateIncidentStatus(orgId, selectedIncident.id, {
      status: newStatus,
      assignedOfficerName: officerInput,
      notes: notesInput || `Status updated to ${newStatus}`,
    });

    setActionLoading(false);
    if (res.data) {
      setNotesInput('');
      fetchIncidents();
      setSelectedIncident((prev) => (prev ? { ...prev, status: newStatus, assignedOfficerName: officerInput } : null));
    }
  };

  const handleDispatchPatrol = async () => {
    if (!selectedIncident) return;
    setActionLoading(true);
    if (orgId == null) return;

    const res = await organizationsApi.dispatchPatrol(orgId, selectedIncident.id, {
      unitName: 'Rapid Campus Response Unit Alpha',
      officerName: officerInput,
      dispatchPriority: 'HIGH',
      instructions: notesInput || 'Immediate campus escort and perimeter inspection.',
    });

    setActionLoading(false);
    if (res.data) {
      setNotesInput('');
      fetchIncidents();
      setSelectedIncident((prev) => (prev ? { ...prev, status: 'DISPATCHED', assignedOfficerName: officerInput } : null));
    }
  };

  const filteredIncidents = incidents.filter((i) => {
    const matchesSearch =
      i.title.toLowerCase().includes(search.toLowerCase()) ||
      i.location.toLowerCase().includes(search.toLowerCase()) ||
      i.reporterName.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Live In-App SOS Siren Banner */}
      {liveSosAlert && (
        <div className="bg-rose-950 border-2 border-rose-500 rounded-2xl p-4 text-white shadow-2xl animate-pulse flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-600 flex items-center justify-center shrink-0 shadow-md">
              <BellRing className="animate-bounce text-white" size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-widest text-rose-300">
                  REAL-TIME DISTRESS TRANSMISSION
                </span>
                <span className="px-2 py-0.5 rounded bg-rose-500 text-white font-mono text-[10px] font-black">
                  LIVE SOS
                </span>
              </div>
              <div className="text-sm font-black text-white mt-0.5">
                {liveSosAlert.userName} ({liveSosAlert.memberType || 'Member'}) â€¢ ID: {liveSosAlert.memberCode || 'Unassigned'}
              </div>
              <div className="text-xs text-rose-200/90 flex items-center gap-2 mt-0.5">
                <span>GPS: {liveSosAlert.latitude.toFixed(5)}, {liveSosAlert.longitude.toFixed(5)}</span>
                <span>â€¢</span>
                <span>Phone: {liveSosAlert.userPhone}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setSelectedIncident({
                  id: liveSosAlert.incidentId,
                  organizationId: liveSosAlert.organizationId,
                  title: `EMERGENCY SOS: ${liveSosAlert.userName}`,
                  description: `Distress alert triggered via mobile app. Roll: ${liveSosAlert.memberCode}. Contact: ${liveSosAlert.userPhone}`,
                  severity: 'IMMEDIATE_DANGER',
                  status: 'PENDING',
                  location: `${liveSosAlert.latitude.toFixed(5)}, ${liveSosAlert.longitude.toFixed(5)}`,
                  latitude: liveSosAlert.latitude,
                  longitude: liveSosAlert.longitude,
                  reporterName: liveSosAlert.userName,
                  reporterContact: liveSosAlert.userPhone,
                  createdAt: liveSosAlert.createdAt,
                  dispatchTimeline: [
                    {
                      id: '1',
                      timestamp: liveSosAlert.createdAt,
                      actor: 'Sabhijude Mobile App',
                      action: 'SOS Distress Signal Triggered',
                      notes: 'Auto-routed to Campus Security Control Room.',
                    },
                  ],
                });
              }}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-500 rounded-xl text-white font-bold text-xs transition shadow-md"
            >
              Take Control & Dispatch
            </button>
            <button
              onClick={() => setLiveSosAlert(null)}
              className="px-3 py-2 bg-stone-900/80 hover:bg-stone-800 text-stone-300 rounded-xl text-xs"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-stone-400 mb-1">
            <Link href="/org/dashboard" className="hover:text-stone-200 transition-colors">
              Campus Command
            </Link>
            <span>/</span>
            <span className="text-stone-300 font-semibold">Incident Triage</span>
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <ShieldAlert className="text-rose-500" size={22} />
            <span>Active Campus Incidents & Emergency SOS Feed</span>
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Live incident queue, fast-response patrol dispatch, and student safety status verification.
          </p>
        </div>

        <button
          onClick={fetchIncidents}
          className="px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-700 text-xs font-semibold flex items-center gap-2 transition"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin text-rose-500' : ''} />
          <span>Refresh Queue</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="relative">
          <Search size={15} className="absolute left-3.5 top-3 text-stone-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, location, or reporter..."
            className="w-full bg-stone-900 border border-stone-800 text-stone-200 text-xs rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:border-rose-500"
          />
        </div>

        <div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full bg-stone-900 border border-stone-800 text-stone-300 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-rose-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending (New)</option>
            <option value="INVESTIGATING">Investigating</option>
            <option value="DISPATCHED">Patrol Dispatched</option>
            <option value="RESOLVED">Resolved</option>
          </select>
        </div>

        <div>
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="w-full bg-stone-900 border border-stone-800 text-stone-300 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-rose-500"
          >
            <option value="ALL">All Severities</option>
            <option value="IMMEDIATE_DANGER">Immediate Danger (SOS)</option>
            <option value="CRITICAL">Critical</option>
            <option value="CONCERNING">Concerning</option>
            <option value="LOW">Low</option>
          </select>
        </div>
      </div>

      {/* Split Triage Screen */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Incidents List */}
        <div className="lg:col-span-5 space-y-3">
          {filteredIncidents.length === 0 ? (
            <div className="bg-stone-900/40 border border-stone-800 rounded-2xl p-8 text-center text-stone-500 text-xs">
              No incidents match current filters.
            </div>
          ) : (
            filteredIncidents.map((incident) => {
              const isSelected = selectedIncident?.id === incident.id;
              const isEmergency = incident.severity === 'IMMEDIATE_DANGER' || incident.severity === 'CRITICAL';

              return (
                <div
                  key={incident.id}
                  onClick={() => setSelectedIncident(incident)}
                  className={`p-4 rounded-2xl border transition cursor-pointer ${
                    isSelected
                      ? 'bg-rose-950/20 border-rose-500/50 shadow-md shadow-rose-950/20'
                      : 'bg-stone-900/40 border-stone-800/80 hover:bg-stone-900/80'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${
                        isEmergency
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {incident.severity.replace('_', ' ')}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        incident.status === 'RESOLVED'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : incident.status === 'DISPATCHED'
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-stone-800 text-stone-300'
                      }`}
                    >
                      {incident.status}
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-white mb-1.5 leading-snug">{incident.title}</h3>
                  <div className="flex items-center gap-3 text-[11px] text-stone-400">
                    <span className="flex items-center gap-1 truncate max-w-[180px]">
                      <MapPin size={12} className="text-stone-500 shrink-0" />
                      {incident.location}
                    </span>
                    <span className="flex items-center gap-1 shrink-0">
                      <Clock size={12} className="text-stone-500 shrink-0" />
                      {new Date(incident.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Incident Detail & Action Panel */}
        <div className="lg:col-span-7">
          {selectedIncident ? (
            <div className="bg-stone-900/50 border border-stone-800 rounded-2xl p-6 space-y-6">
              {/* Header Details */}
              <div className="border-b border-stone-800/80 pb-4">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[11px] text-stone-400 font-mono">INCIDENT #{selectedIncident.id}</span>
                  <span
                    className={`px-2.5 py-0.5 rounded-md text-[11px] font-black uppercase ${
                      selectedIncident.severity === 'IMMEDIATE_DANGER'
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    {selectedIncident.severity.replace('_', ' ')}
                  </span>
                </div>
                <h2 className="text-base font-bold text-white mb-2">{selectedIncident.title}</h2>
                <p className="text-xs text-stone-300 leading-relaxed bg-stone-950/60 p-3 rounded-xl border border-stone-800/60">
                  {selectedIncident.description}
                </p>
              </div>

              {/* Telemetry and Location Info */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-stone-950/60 p-3 rounded-xl border border-stone-800/60">
                  <div className="text-[10px] uppercase font-bold text-stone-500 mb-1">Reporter Information</div>
                  <div className="font-semibold text-white">{selectedIncident.reporterName}</div>
                  <div className="text-[11px] text-stone-400 flex items-center gap-1 mt-0.5">
                    <PhoneCall size={11} />
                    <span>{selectedIncident.reporterContact || 'Not provided'}</span>
                  </div>
                </div>

                <div className="bg-stone-950/60 p-3 rounded-xl border border-stone-800/60">
                  <div className="text-[10px] uppercase font-bold text-stone-500 mb-1">Campus Coordinates</div>
                  <div className="font-semibold text-white truncate">{selectedIncident.location}</div>
                  <div className="text-[11px] text-emerald-400 mt-0.5 flex items-center gap-1">
                    <MapPin size={11} />
                    <span>GPS Telemetry Locked</span>
                  </div>
                </div>
              </div>

              {/* Responder Assignment & Notes Form */}
              <div className="space-y-3 pt-2">
                <div className="text-xs font-bold text-stone-200 flex items-center gap-1.5">
                  <Radio size={14} className="text-rose-500" />
                  <span>Dispatcher Action & Responder Assignment</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-stone-400 font-semibold mb-1">
                      Assigned Security Officer
                    </label>
                    <input
                      type="text"
                      value={officerInput}
                      onChange={(e) => setOfficerInput(e.target.value)}
                      placeholder="Officer Name"
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-rose-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-stone-400 font-semibold mb-1">
                      Action Note / Instructions
                    </label>
                    <input
                      type="text"
                      value={notesInput}
                      onChange={(e) => setNotesInput(e.target.value)}
                      placeholder="e.g. Escort dispatched to North Gate"
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-rose-500"
                    />
                  </div>
                </div>

                {/* Triage Action Buttons */}
                <div className="flex flex-wrap gap-2.5 pt-2">
                  <button
                    disabled={actionLoading}
                    onClick={handleDispatchPatrol}
                    className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm disabled:opacity-50"
                  >
                    <Send size={14} />
                    <span>Dispatch Patrol Unit</span>
                  </button>

                  <button
                    disabled={actionLoading}
                    onClick={() => handleUpdateStatus('INVESTIGATING')}
                    className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-xs flex items-center gap-2 disabled:opacity-50"
                  >
                    <Eye size={14} />
                    <span>Mark Investigating</span>
                  </button>

                  <button
                    disabled={actionLoading}
                    onClick={() => handleUpdateStatus('RESOLVED')}
                    className="px-4 py-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 font-bold text-xs flex items-center gap-2 disabled:opacity-50"
                  >
                    <CheckCircle2 size={14} />
                    <span>Mark Resolved</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-stone-900/40 border border-stone-800 rounded-2xl p-12 text-center text-stone-500 text-xs">
              Select an incident from the queue to view full telemetry and dispatch responders.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
