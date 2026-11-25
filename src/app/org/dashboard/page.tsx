'use client';

import React, { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  CheckCircle2,
  ChevronRight,
  Clock,
  Eye,
  Heart,
  Inbox,
  MapPin,
  MessageCircle,
  Radio,
  RefreshCw,
  Search,
  ShieldAlert,
  UserRound,
  Users,
} from 'lucide-react';
import {
  organizationsApi,
  type OrgDashboardStats,
  type OrgIncident,
  type OrgPost,
  type Organization,
} from '@/portals/org/lib/api';
import { useOrgId } from '@/portals/org/lib/org-context';
import { buildReports, STATE_META, timeAgo, type Report, type ReportState } from '@/portals/org/lib/reports';
import { ReportPanel } from '@/portals/org/components/ReportPanel';

type Tab = 'NEEDS_ACTION' | 'INVESTIGATING' | 'RESOLVED' | 'HELD' | 'ALL';

const TABS: { key: Tab; label: string; states: ReportState[] | null }[] = [
  { key: 'NEEDS_ACTION', label: 'Needs action', states: ['NEW'] },
  { key: 'INVESTIGATING', label: 'Investigating', states: ['INVESTIGATING'] },
  { key: 'RESOLVED', label: 'Resolved', states: ['RESOLVED', 'CLOSED'] },
  { key: 'HELD', label: 'Held for review', states: ['HELD'] },
  { key: 'ALL', label: 'All', states: null },
];

const REFRESH_MS = 60_000;

/**
 * Campus Command: everything members reported to the organisation in one list. Each entry is
 * a member's post together with its case, so staff read the post and its comments, act on it,
 * and tell members what was done, all from one panel.
 */
export default function CampusCommandPage() {
  // useSearchParams needs a Suspense boundary for the production build.
  return (
    <Suspense fallback={<div className="h-40 rounded-[20px] bg-[#f1f1f6] animate-pulse" />}>
      <CampusCommand />
    </Suspense>
  );
}

function CampusCommand() {
  const orgId = useOrgId();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [org, setOrg] = useState<Organization | null>(null);
  const [stats, setStats] = useState<OrgDashboardStats | null>(null);
  const [posts, setPosts] = useState<OrgPost[]>([]);
  const [incidents, setIncidents] = useState<OrgIncident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>(() => {
    const t = searchParams.get('tab')?.toUpperCase();
    return (TABS.find((x) => x.key === t)?.key as Tab) ?? 'NEEDS_ACTION';
  });
  const [search, setSearch] = useState('');
  const [selectedKey, setSelectedKey] = useState<string | null>(() => searchParams.get('report'));

  const load = useCallback(
    async (fresh = false) => {
      if (orgId == null) return;
      setLoading(true);
      setError(null);
      const [orgRes, statsRes, postsRes, incRes] = await Promise.all([
        organizationsApi.getByIdOrSlug(orgId),
        organizationsApi.getDashboardStats(orgId, fresh),
        organizationsApi.getPosts(orgId, fresh),
        organizationsApi.getIncidents(orgId, undefined, fresh),
      ]);
      if (orgRes.data) setOrg(orgRes.data);
      if (statsRes.data) setStats(statsRes.data);
      if (postsRes.data) setPosts(postsRes.data);
      if (incRes.data) setIncidents(incRes.data);
      if (!postsRes.ok && !incRes.ok) setError(postsRes.error?.message || 'Could not load reports. Please try again.');
      setLoading(false);
    },
    [orgId],
  );

  useEffect(() => {
    void load();
    const t = setInterval(() => void load(true), REFRESH_MS);
    return () => clearInterval(t);
  }, [load]);

  const reports = useMemo(() => buildReports(posts, incidents), [posts, incidents]);

  const counts = useMemo(() => {
    const c: Record<Tab, number> = { NEEDS_ACTION: 0, INVESTIGATING: 0, RESOLVED: 0, HELD: 0, ALL: 0 };
    for (const r of reports) {
      for (const t of TABS) if (!t.states || t.states.includes(r.state)) c[t.key]++;
    }
    return c;
  }, [reports]);

  const visible = useMemo(() => {
    const states = TABS.find((t) => t.key === tab)?.states;
    const q = search.trim().toLowerCase();
    return reports.filter((r) => {
      if (states && !states.includes(r.state)) return false;
      if (!q) return true;
      return [r.post?.content, r.post?.categoryName, r.post?.location, r.post?.authorName, r.incident?.title, r.incident?.location, r.incident?.assignedOfficerName]
        .some((v) => v?.toLowerCase().includes(q));
    });
  }, [reports, tab, search]);

  const selected = reports.find((r) => r.key === selectedKey) ?? null;

  const select = (key: string | null) => {
    setSelectedKey(key);
    const params = new URLSearchParams(searchParams.toString());
    if (key) params.set('report', key);
    else params.delete('report');
    router.replace(`/org/dashboard${params.toString() ? `?${params}` : ''}`, { scroll: false });
  };

  const changeTab = (t: Tab) => {
    setTab(t);
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', t.toLowerCase());
    router.replace(`/org/dashboard?${params}`, { scroll: false });
  };

  const onIncidentChanged = (updated: OrgIncident) => {
    setIncidents((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
    setPosts((prev) => prev.map((p) => (p.incidentId === updated.id ? { ...p, incidentStatus: updated.status } : p)));
    if (orgId != null) organizationsApi.getDashboardStats(orgId, true).then((s) => s.data && setStats(s.data));
  };

  const tiles: { key: Tab | 'MEMBERS'; label: string; value: number | string; icon: React.ReactNode; tone: string; hint: string }[] = [
    { key: 'NEEDS_ACTION', label: 'Needs action', value: counts.NEEDS_ACTION, icon: <Inbox size={16} />, tone: 'text-rose-600', hint: 'New reports' },
    { key: 'INVESTIGATING', label: 'Investigating', value: counts.INVESTIGATING, icon: <Eye size={16} />, tone: 'text-amber-600', hint: 'In progress' },
    { key: 'RESOLVED', label: 'Resolved', value: stats?.resolvedIncidentsThisMonth ?? 0, icon: <CheckCircle2 size={16} />, tone: 'text-emerald-600', hint: 'This month' },
    { key: 'HELD', label: 'Held for review', value: counts.HELD, icon: <ShieldAlert size={16} />, tone: 'text-violet-600', hint: 'Awaiting moderation' },
    { key: 'MEMBERS', label: 'Members', value: stats?.totalMembers ?? '–', icon: <Users size={16} />, tone: 'text-[#16161d]', hint: 'Enrolled' },
  ];

  return (
    <div className="space-y-5 pb-8">
      {/* Header */}
      <div className="bg-white border border-[#e8e8f0] p-4 sm:p-5 rounded-[20px] flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-sm">
        <div className="min-w-0">
          <h1 className="text-xl font-black text-[#16161d] tracking-tight truncate">{org?.name ?? 'Campus Command'}</h1>
          <p className="text-xs text-[#5b5b6e] mt-0.5">
            Reports your members shared with the organisation. Open one to read it, see the comments and act on it.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => void load(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#f1f1f6] hover:bg-[#e6e6ee] text-[#16161d] text-xs font-semibold"
            title="Refresh"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin text-rose-500' : ''} />
            Refresh
          </button>
          <Link
            href="/org/dashboard/broadcast"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#e11d48] hover:bg-[#be123c] text-white text-xs font-bold"
          >
            <Radio size={14} />
            Broadcast alert
          </Link>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {tiles.map((t) => {
          const inner = (
            <>
              <div className="flex items-center justify-between text-[10.5px] font-black uppercase tracking-wider text-[#9797ab]">
                <span>{t.label}</span>
                <span className={t.tone}>{t.icon}</span>
              </div>
              <div className={`mt-1.5 text-2xl font-black ${t.tone}`}>{t.value}</div>
              <p className="text-[10.5px] text-[#5b5b6e]">{t.hint}</p>
            </>
          );
          const cls = `text-left bg-white border p-4 rounded-[16px] shadow-sm transition hover:border-[#6d4aff] ${
            t.key === tab ? 'border-[#6d4aff] ring-2 ring-[#6d4aff]/15' : 'border-[#e8e8f0]'
          } ${t.key === 'MEMBERS' ? 'col-span-2 lg:col-span-1' : ''}`;
          return t.key === 'MEMBERS' ? (
            <Link key={t.key} href="/org/dashboard/members" className={cls}>
              {inner}
            </Link>
          ) : (
            <button key={t.key} onClick={() => changeTab(t.key as Tab)} className={cls}>
              {inner}
            </button>
          );
        })}
      </div>

      {/* Reports */}
      <section className="bg-white border border-[#e8e8f0] rounded-[20px] p-4 sm:p-5 space-y-4 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Filter reports">
            {TABS.map((t) => (
              <button
                key={t.key}
                role="tab"
                aria-selected={tab === t.key}
                onClick={() => changeTab(t.key)}
                className={`px-3 py-1.5 rounded-full border text-xs font-semibold transition ${
                  tab === t.key ? 'bg-[#16161d] text-white border-[#16161d]' : 'bg-white text-[#3f3f4e] border-[#e8e8f0] hover:bg-[#f1f1f6]'
                }`}
              >
                {t.label} <span className="opacity-60">{counts[t.key]}</span>
              </button>
            ))}
          </div>
          <div className="relative lg:w-80">
            <Search size={15} className="absolute left-3.5 top-2.5 text-[#747488]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search text, category, place, author…"
              className="w-full bg-white border border-[#e8e8f0] text-[#16161d] text-xs rounded-xl pl-9 pr-4 py-2 focus:outline-none focus:border-rose-500"
            />
          </div>
        </div>

        {error ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-700">{error}</div>
        ) : loading && reports.length === 0 ? (
          <div className="space-y-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-24 rounded-2xl bg-[#f1f1f6] animate-pulse" />
            ))}
          </div>
        ) : visible.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#e8e8f0] p-10 text-center">
            <Inbox className="mx-auto text-[#a1a1b5]" size={26} />
            <p className="mt-3 text-sm font-semibold text-[#16161d]">
              {reports.length === 0 ? 'No reports yet' : tab === 'NEEDS_ACTION' ? 'Nothing needs action right now' : 'Nothing here'}
            </p>
            <p className="mt-1 text-xs text-[#5b5b6e]">
              {reports.length === 0
                ? 'When members share a post with your organisation, it appears here.'
                : 'Try another filter or search.'}
            </p>
          </div>
        ) : (
          <ul className="space-y-2.5">
            {visible.map((r) => (
              <ReportRow key={r.key} report={r} active={r.key === selectedKey} onOpen={() => select(r.key)} />
            ))}
          </ul>
        )}
      </section>

      {selected && orgId != null && (
        <ReportPanel orgId={orgId} report={selected} onClose={() => select(null)} onIncidentChanged={onIncidentChanged} />
      )}
    </div>
  );
}

function ReportRow({ report, active, onOpen }: { report: Report; active: boolean; onOpen: () => void }) {
  const { post, incident } = report;
  const meta = STATE_META[report.state];
  const content = post?.content ?? incident?.description ?? '';
  const author = post ? (post.isAnonymous ? 'Anonymous member' : post.authorName || 'Member') : incident?.reporterName || 'Staff';
  const location = post?.location || incident?.location;
  const risky = post?.riskLevel === 'CRITICAL' || post?.riskLevel === 'HIGH';

  return (
    <li>
      <button
        onClick={onOpen}
        className={`w-full text-left rounded-2xl border bg-white p-4 transition hover:border-[#6d4aff] hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6d4aff]/40 ${
          active ? 'border-[#6d4aff] ring-2 ring-[#6d4aff]/15' : risky && report.state === 'NEW' ? 'border-l-4 border-l-rose-500 border-[#e8e8f0]' : 'border-[#e8e8f0]'
        }`}
      >
        <div className="flex items-start gap-3">
          <span className={`mt-1.5 h-2.5 w-2.5 rounded-full shrink-0 ${meta.dot}`} aria-hidden />
          <div className="min-w-0 flex-1 space-y-1.5">
            <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
              <span className={`px-2 py-0.5 rounded-full border font-semibold ${meta.chip}`}>{meta.label}</span>
              {post?.categoryName && <span className="px-2 py-0.5 rounded-full bg-[#f1f1f6] text-[#3f3f4e] font-semibold">{post.categoryName}</span>}
              {risky && (
                <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-semibold">
                  {post?.riskLevel === 'CRITICAL' ? 'Critical risk' : 'High risk'}
                </span>
              )}
              {!post && <span className="px-2 py-0.5 rounded-full bg-[#f1f1f6] text-[#3f3f4e] font-semibold">Logged by staff</span>}
            </div>

            {!post && incident?.title && <p className="text-sm font-bold text-[#16161d] line-clamp-1">{incident.title}</p>}
            <p className="text-sm text-[#16161d] leading-relaxed line-clamp-2 whitespace-pre-line break-words">{content}</p>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#5b5b6e]">
              <span className="inline-flex items-center gap-1">
                <UserRound size={12} /> {author}
              </span>
              <span className="inline-flex items-center gap-1" title={new Date(report.createdAt).toLocaleString()}>
                <Clock size={12} /> {timeAgo(report.createdAt)}
              </span>
              {location && (
                <span className="inline-flex items-center gap-1 min-w-0">
                  <MapPin size={12} /> <span className="truncate max-w-[180px]">{location}</span>
                </span>
              )}
              {post && (
                <>
                  <span className="inline-flex items-center gap-1">
                    <Heart size={12} /> {post.supportCount ?? 0}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <MessageCircle size={12} /> {post.commentCount ?? 0}
                  </span>
                </>
              )}
              {incident?.assignedOfficerName && <span className="text-[#6d4aff] font-semibold">Handled by {incident.assignedOfficerName}</span>}
            </div>
          </div>
          <ChevronRight size={16} className="text-[#a1a1b5] mt-1 shrink-0" />
        </div>
      </button>
    </li>
  );
}
