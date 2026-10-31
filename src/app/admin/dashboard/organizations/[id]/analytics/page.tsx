'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
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
} from '@/portals/admin/lib/api';

export default function OrgAnalyticsPage() {
  const params = useParams();
  const orgId = Number(params?.id);

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
      <div className="py-24 text-center text-[#5b5b6e] text-xs flex items-center justify-center gap-2 select-none">
        <RefreshCw size={16} className="animate-spin text-[#6d4aff]" />
        <span>Loading Enterprise Safety Analytics & PostGIS Intelligence...</span>
      </div>
    );
  }

  const maxHourCount = Math.max(...timeBuckets.map((b) => b.count), 1);

  return (
    <div className="space-y-6 select-none">
      {/* Breadcrumb Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2 text-xs text-[#5b5b6e]">
          <Link href={`/admin/dashboard/organizations/${orgId}`} className="hover:text-[#6d4aff] transition-colors flex items-center gap-1 font-semibold">
            <ArrowLeft size={13} />
            <span>Command Center</span>
          </Link>
          <span>/</span>
          <span className="text-[#16161d] font-semibold">Safety Analytics & Operations Score</span>
        </div>

        <button
          onClick={loadData}
          className="p-2 px-3 rounded-[12px] bg-white border border-[#e8e8f0] text-[#16161d] hover:bg-[#f7f7fa] text-xs flex items-center gap-1.5 shadow-2xs font-semibold"
        >
          <RefreshCw size={13} className={loading ? 'animate-spin text-[#6d4aff]' : ''} />
          <span>Refresh Analytics</span>
        </button>
      </div>

      {/* Hero Banner: Operations Score & Executive Summary */}
      <div className="bg-white border border-[#e8e8f0] rounded-[20px] p-6 grid grid-cols-1 md:grid-cols-4 gap-6 items-center shadow-xs">
        <div className="md:col-span-2 space-y-1.5">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-[#16161d]">{org?.name || 'Organization'} Analytics</h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-[8px] bg-[#f1edff] text-[#6d4aff] border border-[#ddd6fe] font-bold">
              Multi-Tenant Isolated
            </span>
          </div>
          <p className="text-xs text-[#5b5b6e]">
            Real-time geospatial clustering, dispatch latency, category distribution, and tamper-evident audit logs.
          </p>
        </div>

        {/* Safety Operations Score */}
        <div className="bg-[#fafafc] border border-[#ececf2] p-4 rounded-[16px] flex items-center gap-4">
          <div className="relative h-14 w-14 flex items-center justify-center shrink-0">
            <div className="absolute inset-0 rounded-full border-4 border-[#e8e8f0]" />
            <div className="absolute inset-0 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin duration-1000" />
            <span className="text-lg font-black text-emerald-600">
              {overview?.safetyOperationsScore != null ? overview.safetyOperationsScore : (loading ? '…' : 0)}
            </span>
          </div>
          <div>
            <div className="text-[10px] font-mono text-[#747488] uppercase font-semibold">Safety Score</div>
            <div className="text-sm font-bold text-[#16161d]">Operations Index</div>
            <div className="text-[10px] text-emerald-600 font-semibold">
              {overview?.safetyOperationsScore ? (overview.safetyOperationsScore >= 80 ? 'Optimal Health' : 'Needs Review') : 'No Telemetry'}
            </div>
          </div>
        </div>

        {/* Resolution Rate */}
        <div className="bg-[#fafafc] border border-[#ececf2] p-4 rounded-[16px] flex items-center gap-4">
          <div className="p-3 rounded-[12px] bg-[#f1edff] text-[#6d4aff] shrink-0">
            <ShieldCheck size={24} />
          </div>
          <div>
            <div className="text-[10px] font-mono text-[#747488] uppercase font-semibold">Resolution Rate</div>
            <div className="text-2xl font-black text-[#16161d]">
              {overview?.resolutionRate != null ? `${overview.resolutionRate}%` : (loading ? '…' : '0%')}
            </div>
            <div className="text-[10px] text-[#5b5b6e]">
              {overview?.avgResolutionTimeMinutes != null ? `Avg ${overview.avgResolutionTimeMinutes}m to clear` : 'No incident resolution history'}
            </div>
          </div>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-[#e8e8f0] p-4 rounded-[16px] shadow-xs">
          <span className="text-[11px] text-[#747488] block font-bold uppercase tracking-wider">Total Incidents</span>
          <span className="text-2xl font-black text-[#16161d] mt-1 block">{overview?.totalIncidents ?? 0}</span>
          <span className="text-[10px] text-[#5b5b6e]">Across all perimeters</span>
        </div>

        <div className="bg-white border border-[#e8e8f0] p-4 rounded-[16px] shadow-xs">
          <span className="text-[11px] text-[#747488] block font-bold uppercase tracking-wider">Active Investigating</span>
          <span className="text-2xl font-black text-amber-600 mt-1 block">{overview?.activeIncidents ?? 0}</span>
          <span className="text-[10px] text-amber-600 font-semibold">In triage / dispatched</span>
        </div>

        <div className="bg-white border border-[#e8e8f0] p-4 rounded-[16px] shadow-xs">
          <span className="text-[11px] text-[#747488] block font-bold uppercase tracking-wider">SOS Panic Events</span>
          <span className="text-2xl font-black text-rose-600 mt-1 block">{overview?.sosEvents ?? 0}</span>
          <span className="text-[10px] text-rose-600 font-mono font-semibold">100% responded</span>
        </div>

        <div className="bg-white border border-[#e8e8f0] p-4 rounded-[16px] shadow-xs">
          <span className="text-[11px] text-[#747488] block font-bold uppercase tracking-wider">Median Resolution</span>
          <span className="text-2xl font-black text-blue-600 mt-1 block">
            {resolution?.medianResolutionMinutes != null ? `${resolution.medianResolutionMinutes}m` : (loading ? '…' : '0m')}
          </span>
          <span className="text-[10px] text-[#5b5b6e]">Target &lt; 30m</span>
        </div>
      </div>

      {/* Analytics Main Visual Grids */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <div className="bg-white border border-[#e8e8f0] rounded-[20px] p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#16161d]">Incident Category Distribution</h3>
            <span className="text-[10px] font-mono text-[#747488]">Total: {categories.reduce((a, b) => a + b.count, 0)}</span>
          </div>

          {categories.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#747488]">
              No incident category data recorded yet for this organization.
            </div>
          ) : (
            <div className="space-y-3">
              {categories.map((cat) => (
                <div key={cat.category} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-[#16161d]">
                    <span>{cat.category}</span>
                    <span className="font-mono text-[#5b5b6e]">{cat.count} ({cat.percentage}%)</span>
                  </div>
                  <div className="w-full bg-[#f1f1f6] h-2.5 rounded-full overflow-hidden border border-[#ececf2]">
                    <div className="bg-[#6d4aff] h-full rounded-full transition-all duration-500" style={{ width: `${cat.percentage}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Severity Distribution */}
        <div className="bg-white border border-[#e8e8f0] rounded-[20px] p-5 space-y-4 shadow-xs">
          <h3 className="text-sm font-bold text-[#16161d]">Severity Level Matrix</h3>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 bg-rose-50/50 border border-rose-200 rounded-[14px] space-y-1">
              <span className="text-[10px] font-mono font-bold text-rose-700 uppercase">Critical / SOS</span>
              <div className="text-2xl font-black text-rose-600">{severity?.critical ?? 0}</div>
              <p className="text-[10px] text-[#5b5b6e]">Immediate threat to life</p>
            </div>

            <div className="p-3.5 bg-amber-50/50 border border-amber-200 rounded-[14px] space-y-1">
              <span className="text-[10px] font-mono font-bold text-amber-700 uppercase">High Priority</span>
              <div className="text-2xl font-black text-amber-600">{severity?.high ?? 0}</div>
              <p className="text-[10px] text-[#5b5b6e]">Physical stalking / harassment</p>
            </div>

            <div className="p-3.5 bg-yellow-50/50 border border-yellow-200 rounded-[14px] space-y-1">
              <span className="text-[10px] font-mono font-bold text-yellow-800 uppercase">Medium / Concerning</span>
              <div className="text-2xl font-black text-yellow-700">{severity?.medium ?? 0}</div>
              <p className="text-[10px] text-[#5b5b6e]">Poor lighting, suspicious loitering</p>
            </div>

            <div className="p-3.5 bg-blue-50/50 border border-blue-200 rounded-[14px] space-y-1">
              <span className="text-[10px] font-mono font-bold text-blue-700 uppercase">Low / Advisory</span>
              <div className="text-2xl font-black text-blue-600">{severity?.low ?? 0}</div>
              <p className="text-[10px] text-[#5b5b6e]">Lost item, general safety query</p>
            </div>
          </div>
        </div>

        {/* 24-Hour Incident Distribution Heatmap / Timeline */}
        <div className="bg-white border border-[#e8e8f0] rounded-[20px] p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[#16161d]">24-Hour Time Distribution</h3>
              <p className="text-[11px] text-[#5b5b6e]">Peak risk windows by hour of day</p>
            </div>
            <Clock size={16} className="text-[#747488]" />
          </div>

          {timeBuckets.length === 0 || timeBuckets.every((b) => b.count === 0) ? (
            <div className="py-12 text-center text-xs text-[#747488]">
              No timestamped incident telemetry recorded for this organization yet.
            </div>
          ) : (
            <>
              <div className="flex items-end gap-1 h-32 pt-6 border-b border-[#e8e8f0] px-1">
                {timeBuckets.map((b) => {
                  const heightPct = Math.max(8, (b.count / maxHourCount) * 100);
                  const isNight = b.hour >= 20 || b.hour <= 5;

                  return (
                    <div key={b.hour} className="flex-1 flex flex-col items-center gap-1 group relative">
                      <div
                        className={`w-full rounded-t transition-all ${
                          isNight ? 'bg-rose-500 hover:bg-rose-600' : 'bg-[#ddd6fe] hover:bg-[#6d4aff]'
                        }`}
                        style={{ height: `${heightPct}%` }}
                      />
                      <span className="hidden group-hover:block absolute -top-7 bg-white border border-[#e8e8f0] text-[9px] text-[#16161d] px-1.5 py-0.5 rounded font-mono z-10 whitespace-nowrap shadow-md font-bold">
                        {b.hour}:00 &rarr; {b.count} events
                      </span>
                      <span className="text-[8px] font-mono text-[#747488]">{b.hour}</span>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between text-[10px] text-[#747488] font-mono">
                <span>00:00 (Midnight)</span>
                <span>12:00 (Noon)</span>
                <span>23:00 (Night)</span>
              </div>
            </>
          )}
        </div>

        {/* Top Incident Hotspots & Geolocation Ranking */}
        <div className="bg-white border border-[#e8e8f0] rounded-[20px] p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[#16161d]">Geospatial Hotspots</h3>
              <p className="text-[11px] text-[#5b5b6e]">Ranked by incident frequency & risk density</p>
            </div>
            <MapPin size={16} className="text-[#6d4aff]" />
          </div>

          {locations.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#747488]">
              No geospatial incident coordinates logged for this organization yet.
            </div>
          ) : (
            <div className="space-y-2.5">
              {locations.map((loc, idx) => (
                <div
                  key={loc.location}
                  className="p-3 bg-[#fafafc] border border-[#ececf2] rounded-[14px] flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="h-6 w-6 rounded-[8px] bg-white border border-[#e8e8f0] text-[#16161d] flex items-center justify-center text-xs font-mono font-bold shadow-2xs">
                      #{idx + 1}
                    </span>
                    <div>
                      <h5 className="text-xs font-semibold text-[#16161d]">{loc.location}</h5>
                      <span className="text-[10px] font-mono text-[#747488]">
                        GPS: {loc.latitude?.toFixed(4)}, {loc.longitude?.toFixed(4)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold font-mono text-[#16161d]">{loc.incidentCount} events</span>
                    <span
                      className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-[6px] ${
                        loc.riskLevel === 'HIGH'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {loc.riskLevel}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Security Audit Trail & Event Logs */}
      <div className="bg-white border border-[#e8e8f0] rounded-[20px] p-5 space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-[#e8e8f0] pb-3">
          <div>
            <h3 className="text-sm font-bold text-[#16161d] flex items-center gap-1.5">
              <Activity size={15} className="text-emerald-600" />
              <span>Multi-Tenant Audit Logs ({auditLogs.length})</span>
            </h3>
            <p className="text-[11px] text-[#5b5b6e]">Immutable ledger of sensitive operations and status changes</p>
          </div>
          <span className="text-[10px] font-mono text-[#747488]">Auto-captured</span>
        </div>

        <div className="space-y-2">
          {auditLogs.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#747488]">No security audit entries recorded yet.</div>
          ) : (
            auditLogs.map((log) => (
              <div
                key={log.id}
                className="p-3 bg-[#fafafc] border border-[#ececf2] rounded-[14px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded-[6px] bg-white border border-[#e8e8f0] text-[#16161d] font-bold uppercase shadow-2xs">
                      {log.action}
                    </span>
                    <span className="text-[#16161d] font-semibold">{log.actor}</span>
                    <span className="text-[#9797ab] font-mono text-[10px]">•</span>
                    <span className="text-[10px] font-mono text-[#747488]">
                      Target: {log.resourceType} #{log.resourceId}
                    </span>
                  </div>
                  {log.details && <p className="text-[#5b5b6e] text-[11px]">{log.details}</p>}
                </div>

                <span className="text-[10px] font-mono text-[#747488] shrink-0">
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
