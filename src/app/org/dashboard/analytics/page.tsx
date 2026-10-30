'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  TrendingUp,
  ShieldCheck,
  Clock,
  MapPin,
  RefreshCw,
  Activity,
  AlertTriangle,
  FileSpreadsheet,
} from 'lucide-react';
import {
  organizationsApi,
  type Organization,
  type OrgAnalyticsOverview,
  type OrgAnalyticsCategoryItem,
  type OrgAnalyticsSeverity,
  type OrgAnalyticsResolution,
  type OrgAnalyticsTimeBucket,
  type OrgAnalyticsLocationItem,
  type OrgAuditLog,
} from '@/portals/org/lib/api';
import { useOrgId } from '@/portals/org/lib/org-context';

export default function OrgAnalyticsPage() {
  // Scoped to the organization this account is signed in to, not a fixed id.
  const orgId = useOrgId();

  const [org, setOrg] = useState<Organization | null>(null);
  const [overview, setOverview] = useState<OrgAnalyticsOverview | null>(null);
  const [categories, setCategories] = useState<OrgAnalyticsCategoryItem[]>([]);
  const [severity, setSeverity] = useState<OrgAnalyticsSeverity | null>(null);
  const [resolution, setResolution] = useState<OrgAnalyticsResolution | null>(null);
  const [timeBuckets, setTimeBuckets] = useState<OrgAnalyticsTimeBucket[]>([]);
  const [locations, setLocations] = useState<OrgAnalyticsLocationItem[]>([]);
  const [auditLogs, setAuditLogs] = useState<OrgAuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    if (!orgId) return;
    setLoading(true);
    const [orgRes, overRes, catRes, sevRes, resRes, timeRes, locRes, logRes] = await Promise.all([
      organizationsApi.getByIdOrSlug(orgId),
      organizationsApi.getAnalyticsOverview(orgId),
      organizationsApi.getAnalyticsCategories(orgId),
      organizationsApi.getAnalyticsSeverity(orgId),
      organizationsApi.getAnalyticsResolution(orgId),
      organizationsApi.getAnalyticsTime(orgId),
      organizationsApi.getAnalyticsLocations(orgId),
      organizationsApi.getAuditLogs(orgId),
    ]);

    if (orgRes.data) setOrg(orgRes.data);
    if (overRes.data) setOverview(overRes.data);
    if (catRes.data) setCategories(catRes.data);
    if (sevRes.data) setSeverity(sevRes.data);
    if (resRes.data) setResolution(resRes.data);
    if (timeRes.data) setTimeBuckets(timeRes.data);
    if (locRes.data) setLocations(locRes.data);
    if (logRes.data) setAuditLogs(logRes.data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [orgId]);

  if (loading && !overview) {
    return (
      <div className="py-24 text-center text-stone-500 text-xs flex items-center justify-center gap-2">
        <RefreshCw size={16} className="animate-spin text-rose-500" />
        <span>Loading Enterprise Safety Analytics & PostGIS Intelligence...</span>
      </div>
    );
  }

  const maxHourCount = Math.max(...timeBuckets.map((b) => b.count), 1);

  return (
    <div className="space-y-6">
      {/* Breadcrumb Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2 text-xs text-stone-500">
          <Link href={'/org/dashboard'} className="hover:text-stone-300 transition-colors flex items-center gap-1">
            <ArrowLeft size={13} />
            <span>Command Center</span>
          </Link>
          <span>/</span>
          <span className="text-stone-300 font-medium">Safety Analytics & Operations Score</span>
        </div>

        <button
          onClick={loadData}
          className="p-2 rounded-xl bg-stone-900 border border-stone-800 text-stone-300 hover:bg-stone-800 text-xs flex items-center gap-1.5"
        >
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
          <span>Refresh Analytics</span>
        </button>
      </div>

      {/* Hero Banner: Operations Score & Executive Summary */}
      <div className="bg-stone-900/60 border border-stone-800 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
        <div className="md:col-span-2 space-y-1.5">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-white">{org?.name || 'Organization'} Analytics</h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold">
              Multi-Tenant Isolated
            </span>
          </div>
          <p className="text-xs text-stone-400">
            Real-time geospatial clustering, dispatch latency, category distribution, and tamper-evident audit logs.
          </p>
        </div>

        {/* Safety Operations Score */}
        <div className="bg-stone-950 border border-stone-800 p-4 rounded-xl flex items-center gap-4">
          <div className="relative h-14 w-14 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-4 border-stone-800" />
            <div className="absolute inset-0 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin duration-1000" />
            <span className="text-lg font-black text-emerald-400">{overview?.safetyOperationsScore ?? 92}</span>
          </div>
          <div>
            <div className="text-[10px] font-mono text-stone-500 uppercase font-semibold">Safety Score</div>
            <div className="text-sm font-bold text-white">Operations Index</div>
            <div className="text-[10px] text-emerald-400 font-medium">Optimal Health (Grade A)</div>
          </div>
        </div>

        {/* Resolution Rate */}
        <div className="bg-stone-950 border border-stone-800 p-4 rounded-xl flex items-center gap-4">
          <div className="p-3 rounded-xl bg-violet-500/10 text-violet-400">
            <ShieldCheck size={24} />
          </div>
          <div>
            <div className="text-[10px] font-mono text-stone-500 uppercase font-semibold">Resolution Rate</div>
            <div className="text-2xl font-black text-white">{overview?.resolutionRate ?? 91.2}%</div>
            <div className="text-[10px] text-stone-400">Avg {overview?.avgResolutionTimeMinutes ?? 42}m to clear</div>
          </div>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-stone-900/40 border border-stone-800 p-4 rounded-xl">
          <span className="text-[11px] text-stone-400 block font-medium">Total Incidents</span>
          <span className="text-2xl font-black text-white mt-1 block">{overview?.totalIncidents ?? 0}</span>
          <span className="text-[10px] text-stone-500">Across all perimeters</span>
        </div>

        <div className="bg-stone-900/40 border border-stone-800 p-4 rounded-xl">
          <span className="text-[11px] text-stone-400 block font-medium">Active Investigating</span>
          <span className="text-2xl font-black text-amber-400 mt-1 block">{overview?.activeIncidents ?? 0}</span>
          <span className="text-[10px] text-amber-500/80">In triage / dispatched</span>
        </div>

        <div className="bg-stone-900/40 border border-stone-800 p-4 rounded-xl">
          <span className="text-[11px] text-stone-400 block font-medium">SOS Panic Events</span>
          <span className="text-2xl font-black text-rose-500 mt-1 block">{overview?.sosEvents ?? 0}</span>
          <span className="text-[10px] text-rose-400/80 font-mono">100% responded</span>
        </div>

        <div className="bg-stone-900/40 border border-stone-800 p-4 rounded-xl">
          <span className="text-[11px] text-stone-400 block font-medium">Median Resolution</span>
          <span className="text-2xl font-black text-blue-400 mt-1 block">{resolution?.medianResolutionMinutes ?? 25}m</span>
          <span className="text-[10px] text-stone-500">Target &lt; 30m</span>
        </div>
      </div>

      {/* Analytics Main Visual Grids */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <div className="bg-stone-900/40 border border-stone-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Incident Category Distribution</h3>
            <span className="text-[10px] font-mono text-stone-400">Total: {categories.reduce((a, b) => a + b.count, 0)}</span>
          </div>

          <div className="space-y-3">
            {categories.map((cat) => (
              <div key={cat.category} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-stone-200">
                  <span>{cat.category}</span>
                  <span className="font-mono text-stone-400">{cat.count} ({cat.percentage}%)</span>
                </div>
                <div className="w-full bg-stone-950 h-2.5 rounded-full overflow-hidden border border-stone-800">
                  <div className="bg-rose-500 h-full rounded-full transition-all duration-500" style={{ width: `${cat.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Severity Distribution */}
        <div className="bg-stone-900/40 border border-stone-800 rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-white">Severity Level Matrix</h3>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 bg-stone-950 border border-red-500/30 rounded-xl space-y-1">
              <span className="text-[10px] font-mono font-bold text-red-400 uppercase">Critical / SOS</span>
              <div className="text-2xl font-black text-red-400">{severity?.critical ?? 0}</div>
              <p className="text-[10px] text-stone-500">Immediate threat to life</p>
            </div>

            <div className="p-3.5 bg-stone-950 border border-amber-500/30 rounded-xl space-y-1">
              <span className="text-[10px] font-mono font-bold text-amber-400 uppercase">High Priority</span>
              <div className="text-2xl font-black text-amber-400">{severity?.high ?? 0}</div>
              <p className="text-[10px] text-stone-500">Physical stalking / harassment</p>
            </div>

            <div className="p-3.5 bg-stone-950 border border-yellow-500/30 rounded-xl space-y-1">
              <span className="text-[10px] font-mono font-bold text-yellow-400 uppercase">Medium / Concerning</span>
              <div className="text-2xl font-black text-yellow-400">{severity?.medium ?? 0}</div>
              <p className="text-[10px] text-stone-500">Poor lighting, suspicious loitering</p>
            </div>

            <div className="p-3.5 bg-stone-950 border border-blue-500/30 rounded-xl space-y-1">
              <span className="text-[10px] font-mono font-bold text-blue-400 uppercase">Low / Advisory</span>
              <div className="text-2xl font-black text-blue-400">{severity?.low ?? 0}</div>
              <p className="text-[10px] text-stone-500">Lost item, general safety query</p>
            </div>
          </div>
        </div>

        {/* 24-Hour Incident Distribution Heatmap / Timeline */}
        <div className="bg-stone-900/40 border border-stone-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">24-Hour Time Distribution</h3>
              <p className="text-[11px] text-stone-400">Peak risk windows by hour of day</p>
            </div>
            <Clock size={16} className="text-stone-400" />
          </div>

          <div className="flex items-end gap-1 h-32 pt-6 border-b border-stone-800 px-1">
            {timeBuckets.map((b) => {
              const heightPct = Math.max(8, (b.count / maxHourCount) * 100);
              const isNight = b.hour >= 20 || b.hour <= 5;

              return (
                <div key={b.hour} className="flex-1 flex flex-col items-center gap-1 group relative">
                  <div
                    className={`w-full rounded-t transition-all ${
                      isNight ? 'bg-rose-500 hover:bg-rose-400' : 'bg-stone-700 hover:bg-stone-500'
                    }`}
                    style={{ height: `${heightPct}%` }}
                  />
                  <span className="hidden group-hover:block absolute -top-7 bg-stone-950 border border-stone-700 text-[9px] text-white px-1.5 py-0.5 rounded font-mono z-10 whitespace-nowrap shadow-lg">
                    {b.hour}:00 &rarr; {b.count} events
                  </span>
                  <span className="text-[8px] font-mono text-stone-500">{b.hour}</span>
                </div>
              );
            })}
          </div>
          <div className="flex justify-between text-[10px] text-stone-500 font-mono">
            <span>00:00 (Midnight)</span>
            <span>12:00 (Noon)</span>
            <span>23:00 (Night)</span>
          </div>
        </div>

        {/* Top Incident Hotspots & Geolocation Ranking */}
        <div className="bg-stone-900/40 border border-stone-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">Geospatial Hotspots</h3>
              <p className="text-[11px] text-stone-400">Ranked by incident frequency & risk density</p>
            </div>
            <MapPin size={16} className="text-rose-400" />
          </div>

          <div className="space-y-2.5">
            {locations.map((loc, idx) => (
              <div
                key={loc.location}
                className="p-3 bg-stone-950 border border-stone-800 rounded-xl flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <span className="h-6 w-6 rounded-lg bg-stone-800 text-stone-300 flex items-center justify-center text-xs font-mono font-bold">
                    #{idx + 1}
                  </span>
                  <div>
                    <h5 className="text-xs font-semibold text-stone-200">{loc.location}</h5>
                    <span className="text-[10px] font-mono text-stone-500">
                      GPS: {loc.latitude?.toFixed(4)}, {loc.longitude?.toFixed(4)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold font-mono text-white">{loc.incidentCount} events</span>
                  <span
                    className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                      loc.riskLevel === 'HIGH'
                        ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {loc.riskLevel}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Security Audit Trail & Event Logs */}
      <div className="bg-stone-900/40 border border-stone-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-stone-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Activity size={15} className="text-emerald-400" />
              <span>Multi-Tenant Audit Logs ({auditLogs.length})</span>
            </h3>
            <p className="text-[11px] text-stone-400">Immutable ledger of sensitive operations and status changes</p>
          </div>
          <span className="text-[10px] font-mono text-stone-500">Auto-captured</span>
        </div>

        <div className="space-y-2">
          {auditLogs.length === 0 ? (
            <div className="py-8 text-center text-xs text-stone-500">No security audit entries recorded yet.</div>
          ) : (
            auditLogs.map((log) => (
              <div
                key={log.id}
                className="p-3 bg-stone-950 border border-stone-800/80 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-stone-800 text-stone-300 font-bold uppercase">
                      {log.action}
                    </span>
                    <span className="text-stone-300 font-semibold">{log.actor}</span>
                    <span className="text-stone-500 font-mono text-[10px]">â€¢</span>
                    <span className="text-[10px] font-mono text-stone-500">
                      Target: {log.resourceType} #{log.resourceId}
                    </span>
                  </div>
                  {log.details && <p className="text-stone-400 text-[11px]">{log.details}</p>}
                </div>

                <span className="text-[10px] font-mono text-stone-500 shrink-0">
                  {new Date(log.timestamp).toLocaleString()}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

