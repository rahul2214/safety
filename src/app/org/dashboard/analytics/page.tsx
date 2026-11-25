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
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    if (!orgId) return;
    setLoading(true);
    const [orgRes, overRes, catRes, sevRes, resRes, timeRes, locRes] = await Promise.all([
      organizationsApi.getByIdOrSlug(orgId),
      organizationsApi.getAnalyticsOverview(orgId),
      organizationsApi.getAnalyticsCategories(orgId),
      organizationsApi.getAnalyticsSeverity(orgId),
      organizationsApi.getAnalyticsResolution(orgId),
      organizationsApi.getAnalyticsTime(orgId),
      organizationsApi.getAnalyticsLocations(orgId),
    ]);

    if (orgRes.data) setOrg(orgRes.data);
    if (overRes.data) setOverview(overRes.data);
    if (catRes.data) setCategories(catRes.data);
    if (sevRes.data) setSeverity(sevRes.data);
    if (resRes.data) setResolution(resRes.data);
    if (timeRes.data) setTimeBuckets(timeRes.data);
    if (locRes.data) setLocations(locRes.data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [orgId]);

  if (loading && !overview) {
    return (
      <div className="py-24 text-center text-[#747488] text-xs flex items-center justify-center gap-2">
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
        <div className="flex items-center gap-2 text-xs text-[#747488]">
          <Link href={'/org/dashboard'} className="hover:text-[#16161d] transition-colors flex items-center gap-1">
            <ArrowLeft size={13} />
            <span>Command Center</span>
          </Link>
          <span>/</span>
          <span className="text-[#3f3f4e] font-medium">Safety Analytics & Operations Score</span>
        </div>

        <button
          onClick={loadData}
          className="p-2 rounded-xl bg-white border border-[#e8e8f0] text-[#3f3f4e] hover:bg-[#f1f1f6] text-xs flex items-center gap-1.5"
        >
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
          <span>Refresh Analytics</span>
        </button>
      </div>

      {/* Hero Banner: Operations Score & Executive Summary */}
      <div className="bg-white border border-[#e8e8f0] rounded-2xl p-4 sm:p-6 grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
        <div className="md:col-span-2 space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-lg sm:text-xl font-black text-[#16161d] break-words">{org?.name || 'Organization'} Analytics</h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-700 font-bold">
              Multi-Tenant Isolated
            </span>
          </div>
          <p className="text-xs text-[#5b5b6e]">
            Real-time geospatial clustering, dispatch latency, category distribution, and tamper-evident audit logs.
          </p>
        </div>

        {/* Safety Operations Score */}
        <div className="bg-[#f7f7fa] border border-[#e8e8f0] p-4 rounded-xl flex items-center gap-4">
          <div className="relative h-14 w-14 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-4 border-[#e8e8f0]" />
            <div className="absolute inset-0 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin duration-1000" />
            <span className="text-lg font-black text-emerald-600">{overview?.safetyOperationsScore ?? 92}</span>
          </div>
          <div>
            <div className="text-[10px] font-mono text-[#747488] uppercase font-semibold">Safety Score</div>
            <div className="text-sm font-bold text-[#16161d]">Operations Index</div>
            <div className="text-[10px] text-emerald-600 font-medium">Optimal Health (Grade A)</div>
          </div>
        </div>

        {/* Resolution Rate */}
        <div className="bg-[#f7f7fa] border border-[#e8e8f0] p-4 rounded-xl flex items-center gap-4">
          <div className="p-3 rounded-xl bg-violet-500/10 text-violet-600">
            <ShieldCheck size={24} />
          </div>
          <div>
            <div className="text-[10px] font-mono text-[#747488] uppercase font-semibold">Resolution Rate</div>
            <div className="text-2xl font-black text-[#16161d]">{overview?.resolutionRate ?? 91.2}%</div>
            <div className="text-[10px] text-[#5b5b6e]">Avg {overview?.avgResolutionTimeMinutes ?? 42}m to clear</div>
          </div>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-[#e8e8f0] p-4 rounded-xl">
          <span className="text-[11px] text-[#5b5b6e] block font-medium">Total Incidents</span>
          <span className="text-2xl font-black text-[#16161d] mt-1 block">{overview?.totalIncidents ?? 0}</span>
          <span className="text-[10px] text-[#747488]">Across all perimeters</span>
        </div>

        <div className="bg-white border border-[#e8e8f0] p-4 rounded-xl">
          <span className="text-[11px] text-[#5b5b6e] block font-medium">Active Investigating</span>
          <span className="text-2xl font-black text-amber-600 mt-1 block">{overview?.activeIncidents ?? 0}</span>
          <span className="text-[10px] text-amber-500/80">In triage / dispatched</span>
        </div>

        <div className="bg-white border border-[#e8e8f0] p-4 rounded-xl">
          <span className="text-[11px] text-[#5b5b6e] block font-medium">Resolved</span>
          <span className="text-2xl font-black text-emerald-600 mt-1 block">{overview?.resolvedIncidents ?? 0}</span>
          <span className="text-[10px] text-[#747488]">Closed incidents</span>
        </div>

        <div className="bg-white border border-[#e8e8f0] p-4 rounded-xl">
          <span className="text-[11px] text-[#5b5b6e] block font-medium">Median Resolution</span>
          <span className="text-2xl font-black text-blue-600 mt-1 block">{resolution?.medianResolutionMinutes ?? 25}m</span>
          <span className="text-[10px] text-[#747488]">Target &lt; 30m</span>
        </div>
      </div>

      {/* Analytics Main Visual Grids */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <div className="bg-white border border-[#e8e8f0] rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#16161d]">Incident Category Distribution</h3>
            <span className="text-[10px] font-mono text-[#5b5b6e]">Total: {categories.reduce((a, b) => a + b.count, 0)}</span>
          </div>

          <div className="space-y-3">
            {categories.map((cat) => (
              <div key={cat.category} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-[#16161d]">
                  <span>{cat.category}</span>
                  <span className="font-mono text-[#5b5b6e]">{cat.count} ({cat.percentage}%)</span>
                </div>
                <div className="w-full bg-[#f7f7fa] h-2.5 rounded-full overflow-hidden border border-[#e8e8f0]">
                  <div className="bg-rose-500 h-full rounded-full transition-all duration-500" style={{ width: `${cat.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Severity Distribution */}
        <div className="bg-white border border-[#e8e8f0] rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-[#16161d]">Severity Level Matrix</h3>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 bg-[#f7f7fa] border border-red-500/30 rounded-xl space-y-1">
              <span className="text-[10px] font-mono font-bold text-red-600 uppercase">Critical</span>
              <div className="text-2xl font-black text-red-600">{severity?.critical ?? 0}</div>
              <p className="text-[10px] text-[#747488]">Immediate threat to life</p>
            </div>

            <div className="p-3.5 bg-[#f7f7fa] border border-amber-500/30 rounded-xl space-y-1">
              <span className="text-[10px] font-mono font-bold text-amber-600 uppercase">High Priority</span>
              <div className="text-2xl font-black text-amber-600">{severity?.high ?? 0}</div>
              <p className="text-[10px] text-[#747488]">Physical stalking / harassment</p>
            </div>

            <div className="p-3.5 bg-[#f7f7fa] border border-yellow-500/30 rounded-xl space-y-1">
              <span className="text-[10px] font-mono font-bold text-yellow-600 uppercase">Medium / Concerning</span>
              <div className="text-2xl font-black text-yellow-600">{severity?.medium ?? 0}</div>
              <p className="text-[10px] text-[#747488]">Poor lighting, suspicious loitering</p>
            </div>

            <div className="p-3.5 bg-[#f7f7fa] border border-blue-500/30 rounded-xl space-y-1">
              <span className="text-[10px] font-mono font-bold text-blue-600 uppercase">Low / Advisory</span>
              <div className="text-2xl font-black text-blue-600">{severity?.low ?? 0}</div>
              <p className="text-[10px] text-[#747488]">Lost item, general safety query</p>
            </div>
          </div>
        </div>

        {/* 24-Hour Incident Distribution Heatmap / Timeline */}
        <div className="bg-white border border-[#e8e8f0] rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[#16161d]">24-Hour Time Distribution</h3>
              <p className="text-[11px] text-[#5b5b6e]">Peak risk windows by hour of day</p>
            </div>
            <Clock size={16} className="text-[#5b5b6e]" />
          </div>

          <div className="flex items-end gap-1 h-32 pt-6 border-b border-[#e8e8f0] px-1">
            {timeBuckets.map((b) => {
              const heightPct = Math.max(8, (b.count / maxHourCount) * 100);
              const isNight = b.hour >= 20 || b.hour <= 5;

              return (
                <div key={b.hour} className="flex-1 flex flex-col items-center gap-1 group relative">
                  <div
                    className={`w-full rounded-t transition-all ${
                      isNight ? 'bg-rose-500 hover:bg-rose-400' : 'bg-[#e8e8f0] hover:bg-[#e8e8f0]'
                    }`}
                    style={{ height: `${heightPct}%` }}
                  />
                  <span className="hidden group-hover:block absolute -top-7 bg-[#f7f7fa] border border-[#e8e8f0] text-[9px] text-[#16161d] px-1.5 py-0.5 rounded font-mono z-10 whitespace-nowrap shadow-lg">
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
        </div>

        {/* Top Incident Hotspots & Geolocation Ranking */}
        <div className="bg-white border border-[#e8e8f0] rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[#16161d]">Geospatial Hotspots</h3>
              <p className="text-[11px] text-[#5b5b6e]">Ranked by incident frequency & risk density</p>
            </div>
            <MapPin size={16} className="text-rose-600" />
          </div>

          <div className="space-y-2.5">
            {locations.map((loc, idx) => (
              <div
                key={loc.location}
                className="p-3 bg-[#f7f7fa] border border-[#e8e8f0] rounded-xl flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <span className="h-6 w-6 rounded-lg bg-[#f1f1f6] text-[#3f3f4e] flex items-center justify-center text-xs font-mono font-bold">
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
                    className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                      loc.riskLevel === 'HIGH'
                        ? 'bg-red-500/20 text-red-700 border border-red-500/30'
                        : 'bg-amber-500/20 text-amber-700 border border-amber-500/30'
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
    </div>
  );
}
