import type { OrgIncident, OrgPost } from '@/portals/org/lib/api';

/**
 * One thing a member reported to the organisation. Almost every report is a post shared with
 * the organisation plus the incident (case) opened for it; the dashboard shows them as one.
 * A post still held for moderation has no case yet, and a case logged by staff has no post.
 */
export interface Report {
  key: string;
  post?: OrgPost;
  incident?: OrgIncident;
  createdAt: string;
  state: ReportState;
}

/** NEW: needs action. HELD: post waiting for moderation. HIDDEN: post not published. */
export type ReportState = 'NEW' | 'INVESTIGATING' | 'RESOLVED' | 'CLOSED' | 'HELD' | 'HIDDEN';

const HELD = new Set(['PENDING', 'REVIEW']);

export function stateOf(post?: OrgPost, incident?: OrgIncident): ReportState {
  if (incident) {
    switch ((incident.status || '').toUpperCase()) {
      case 'INVESTIGATING':
      case 'DISPATCHED':
        return 'INVESTIGATING';
      case 'RESOLVED':
        return 'RESOLVED';
      case 'FALSE_ALARM':
        return 'CLOSED';
      default:
        return 'NEW';
    }
  }
  if (post) {
    if (post.moderationState === 'APPROVED') return 'NEW';
    if (HELD.has(post.moderationState)) return 'HELD';
    return 'HIDDEN';
  }
  return 'NEW';
}

export function buildReports(posts: OrgPost[], incidents: OrgIncident[]): Report[] {
  const byId = new Map(incidents.map((i) => [i.id, i]));
  const byPost = new Map(incidents.filter((i) => i.postId).map((i) => [i.postId as number, i]));
  const used = new Set<number>();

  const reports: Report[] = posts.map((post) => {
    const incident = (post.incidentId ? byId.get(post.incidentId) : undefined) ?? byPost.get(post.id);
    if (incident) used.add(incident.id);
    return { key: `post-${post.id}`, post, incident, createdAt: post.createdAt, state: stateOf(post, incident) };
  });

  // Cases with no post (logged by staff, or posts since deleted).
  for (const incident of incidents) {
    if (used.has(incident.id) || incident.postId) continue;
    reports.push({ key: `case-${incident.id}`, incident, createdAt: incident.createdAt, state: stateOf(undefined, incident) });
  }

  return reports.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export const STATE_META: Record<ReportState, { label: string; chip: string; dot: string }> = {
  NEW: { label: 'Needs action', chip: 'bg-rose-50 text-rose-700 border-rose-200', dot: 'bg-rose-500' },
  INVESTIGATING: { label: 'Investigating', chip: 'bg-amber-50 text-amber-800 border-amber-200', dot: 'bg-amber-500' },
  RESOLVED: { label: 'Resolved', chip: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
  CLOSED: { label: 'Closed', chip: 'bg-slate-100 text-slate-600 border-slate-200', dot: 'bg-slate-400' },
  HELD: { label: 'Held for review', chip: 'bg-violet-50 text-violet-700 border-violet-200', dot: 'bg-violet-500' },
  HIDDEN: { label: 'Not published', chip: 'bg-slate-100 text-slate-600 border-slate-200', dot: 'bg-slate-400' },
};

/** Text the dashboard or server added on its own; members never see it. */
const AUTOMATIC = [
  /^Status changed from/i,
  /^Status updated to/i,
  /^Resolved via command triage drawer/i,
  /^Re-opened for follow-up verification/i,
  /^Shared with the organization/i,
];

/** The note members currently see on the post (the latest one an admin wrote), if any. */
export function memberNote(incident?: OrgIncident): { note: string; at: string } | null {
  if (!incident) return null;
  const updates = (incident.dispatchTimeline || [])
    .filter((e) => /^STATUS_/i.test(e.action) || e.action === 'NOTE_ADDED')
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  for (const e of updates) {
    const text = (e.notes || '').replace(/^SITREP NOTE:\s*/i, '').trim();
    if (text && !AUTOMATIC.some((r) => r.test(text))) return { note: text, at: e.timestamp };
  }
  return null;
}

export function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.round(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.round(h / 24);
  if (d < 7) return `${d}d ago`;
  return formatWhen(iso);
}

export function formatWhen(iso: string) {
  return new Date(iso).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit', timeZone: 'Asia/Kolkata' });
}
