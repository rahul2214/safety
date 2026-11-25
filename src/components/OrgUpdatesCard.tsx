import React from 'react';
import { Building2, CheckCircle2, Clock, Search, ShieldCheck, StickyNote, XCircle } from 'lucide-react';

export interface PostOrgUpdateItem {
  /** The status it moved to, or null when the entry is only a note. */
  status?: string | null;
  note?: string | null;
  createdAt: string;
}

export interface PostOrgUpdates {
  organizationName: string;
  status: string;
  updatedAt?: string;
  /** At most one entry: the latest update. */
  updates: PostOrgUpdateItem[];
}

const STATUS: Record<string, { label: string; chip: string; icon: React.ReactNode }> = {
  PENDING: { label: 'Received', chip: 'bg-slate-100 text-slate-700 border-slate-200', icon: <Clock className="h-3.5 w-3.5" /> },
  INVESTIGATING: { label: 'Under investigation', chip: 'bg-amber-50 text-amber-800 border-amber-200', icon: <Search className="h-3.5 w-3.5" /> },
  DISPATCHED: { label: 'Action in progress', chip: 'bg-sky-50 text-sky-800 border-sky-200', icon: <ShieldCheck className="h-3.5 w-3.5" /> },
  RESOLVED: { label: 'Resolved', chip: 'bg-emerald-50 text-emerald-800 border-emerald-200', icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
  FALSE_ALARM: { label: 'Closed, no action needed', chip: 'bg-slate-100 text-slate-700 border-slate-200', icon: <XCircle className="h-3.5 w-3.5" /> },
};

export function orgStatusLabel(status?: string | null) {
  return STATUS[(status ?? '').toUpperCase()]?.label ?? 'Received';
}

function when(iso: string) {
  return new Date(iso).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
}

/** What the organization has done about a post shared with it: status plus admin notes. */
export function OrgUpdatesCard({ data }: { data: PostOrgUpdates }) {
  const current = STATUS[data.status?.toUpperCase()] ?? STATUS.PENDING;

  return (
    <section
      aria-label={`Updates from ${data.organizationName}`}
      className="rounded-3xl bg-white border border-slate-200/80 p-4 sm:p-6 md:p-8 space-y-4"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 font-display text-lg sm:text-xl font-bold text-ink">
          <Building2 className="h-5 w-5 text-brand" />
          Updates from {data.organizationName}
        </h2>
        <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${current.chip}`}>
          {current.icon}
          {current.label}
        </span>
      </div>

      {data.updates.length === 0 ? (
        <p className="text-sm text-slate-500">
          {data.organizationName} has received this post. Their updates will appear here.
        </p>
      ) : (
        <div className="rounded-2xl bg-mist/60 border border-slate-100 p-4">
          {data.updates[0].note ? (
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line break-words">{data.updates[0].note}</p>
          ) : (
            <p className="text-sm text-slate-500">Marked {current.label.toLowerCase()}.</p>
          )}
          <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-slate-400">
            <StickyNote className="h-3.5 w-3.5" />
            Last updated <time dateTime={data.updates[0].createdAt}>{when(data.updates[0].createdAt)}</time>
          </p>
        </div>
      )}
    </section>
  );
}
