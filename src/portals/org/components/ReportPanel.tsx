'use client';

import React, { useCallback, useEffect, useState } from 'react';
import {
  BadgeCheck,
  CheckCircle2,
  Clock,
  CornerDownRight,
  ExternalLink,
  Eye,
  Heart,
  Loader2,
  MapPin,
  MessageCircle,
  Phone,
  RefreshCw,
  Send,
  ShieldCheck,
  ThumbsDown,
  ThumbsUp,
  UserRound,
  Users,
  X,
} from 'lucide-react';
import { organizationsApi, type OrgIncident, type OrgPostDetail, type OrgPostReply } from '@/portals/org/lib/api';
import { STATE_META, formatWhen, memberNote, timeAgo, type Report } from '@/portals/org/lib/reports';
import { StatusNoteDialog } from '@/portals/org/components/StatusNoteDialog';

function Avatar({ name, url, size = 36, anonymous = false }: { name: string; url?: string | null; size?: number; anonymous?: boolean }) {
  if (url && !anonymous) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={url} alt="" width={size} height={size} className="rounded-full object-cover shrink-0" style={{ width: size, height: size }} />;
  }
  return (
    <span
      aria-hidden
      className={`rounded-full shrink-0 inline-flex items-center justify-center font-bold ${anonymous ? 'bg-[#e8e8f0] text-[#5b5b6e]' : 'bg-rose-100 text-rose-700'}`}
      style={{ width: size, height: size, fontSize: size * 0.42 }}
    >
      {anonymous ? '?' : (name.trim()[0] || 'M').toUpperCase()}
    </span>
  );
}

function AuthorLine({ c }: { c: OrgPostReply }) {
  return (
    <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
      <span className="text-[13px] font-semibold text-[#16161d]">{c.authorName}</span>
      {c.isVerifiedExpert && <BadgeCheck size={14} className="text-sky-600" aria-label="Verified expert" />}
      {c.isOriginalPoster && (
        <span className="px-1.5 py-px rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold">Author</span>
      )}
      <span className="text-[11px] text-[#747488]" title={formatWhen(c.createdAt)}>
        · {timeAgo(c.createdAt)}
      </span>
    </div>
  );
}

/**
 * Everything about one report in one place: the member's post with its reactions and
 * comments, the case status and the actions on it, the update members see, and how to
 * reach the reporter.
 */
export function ReportPanel({
  orgId,
  report,
  onClose,
  onIncidentChanged,
}: {
  orgId: number;
  report: Report;
  onClose: () => void;
  onIncidentChanged: (incident: OrgIncident) => void;
}) {
  const { post, incident } = report;
  const [detail, setDetail] = useState<OrgPostDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);

  const [pendingStatus, setPendingStatus] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [officer, setOfficer] = useState(incident?.assignedOfficerName ?? '');

  useEffect(() => setOfficer(incident?.assignedOfficerName ?? ''), [incident?.id, incident?.assignedOfficerName]);

  const loadDetail = useCallback(
    async (fresh = false) => {
      if (!post) return;
      setLoadingDetail(true);
      setDetailError(null);
      const res = await organizationsApi.getPostDetail(orgId, post.id, fresh);
      if (res.ok && res.data) setDetail(res.data);
      else setDetailError(res.error?.message || 'Could not load comments.');
      setLoadingDetail(false);
    },
    [orgId, post],
  );

  useEffect(() => {
    setDetail(null);
    void loadDetail();
  }, [loadDetail]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !pendingStatus) onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, pendingStatus]);

  const update = async (data: { status: string; notes?: string; assignedOfficerName?: string }) => {
    if (!incident) return false;
    setSaving(true);
    setActionError(null);
    const res = await organizationsApi.updateIncidentStatus(orgId, incident.id, data);
    setSaving(false);
    if (res.ok && res.data) {
      onIncidentChanged(res.data);
      return true;
    }
    setActionError(res.error?.message || 'Could not save. Please try again.');
    return false;
  };

  const meta = STATE_META[report.state];
  const p = detail?.post ?? post;
  const anonymous = !!p?.isAnonymous;
  const authorName = p ? (anonymous ? 'Anonymous member' : p.authorName || 'Member') : incident?.reporterName || 'Member';
  const content = p?.content ?? incident?.description ?? '';
  const location = p?.location || incident?.location;
  const shown = memberNote(incident);
  const comments = detail?.comments ?? [];
  const status = (incident?.status || '').toUpperCase();
  const isClosed = status === 'RESOLVED' || status === 'FALSE_ALARM';

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-labelledby="report-title">
      <button aria-label="Close" onClick={onClose} className="absolute inset-0 bg-black/30 backdrop-blur-[1px]" />
      <aside className="relative h-full w-full sm:max-w-2xl bg-[#f7f7fa] shadow-2xl flex flex-col">
        {/* Top bar */}
        <div className="flex items-center justify-between gap-3 px-5 py-3.5 bg-white border-b border-[#e8e8f0]">
          <div className="min-w-0 flex items-center gap-2 flex-wrap">
            <h2 id="report-title" className="text-sm font-bold text-[#16161d]">
              {post ? `Post #${post.id}` : `Case #${incident?.id}`}
            </h2>
            {incident && post && <span className="text-[11px] text-[#747488]">Case #{incident.id}</span>}
            <span className={`px-2 py-0.5 rounded-full border text-[11px] font-semibold ${meta.chip}`}>{meta.label}</span>
          </div>
          <div className="flex items-center gap-1">
            {post && (
              <button onClick={() => void loadDetail(true)} aria-label="Refresh" className="p-2 rounded-xl hover:bg-[#f1f1f6] text-[#3f3f4e]">
                <RefreshCw size={16} className={loadingDetail ? 'animate-spin text-rose-500' : ''} />
              </button>
            )}
            <button onClick={onClose} aria-label="Close" className="p-2 rounded-xl hover:bg-[#f1f1f6] text-[#3f3f4e]">
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Actions */}
          <section className="bg-white border-b border-[#e8e8f0] px-5 py-4 space-y-3">
            {incident ? (
              <>
                <div className="flex flex-wrap gap-2">
                  {status !== 'INVESTIGATING' && status !== 'DISPATCHED' && (
                    <button
                      onClick={() => setPendingStatus('INVESTIGATING')}
                      disabled={saving}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold disabled:opacity-60"
                    >
                      {isClosed ? <RefreshCw size={14} /> : <Eye size={14} />}
                      {isClosed ? 'Re-open' : 'Start investigating'}
                    </button>
                  )}
                  {!isClosed && (
                    <button
                      onClick={() => setPendingStatus('RESOLVED')}
                      disabled={saving}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold disabled:opacity-60"
                    >
                      <CheckCircle2 size={14} />
                      Mark resolved
                    </button>
                  )}
                  {incident.reporterContact ? (
                    <a
                      href={`tel:${incident.reporterContact}`}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#e8e8f0] bg-white hover:bg-[#f1f1f6] text-[#16161d] text-xs font-bold"
                    >
                      <Phone size={14} />
                      Call reporter
                    </a>
                  ) : (
                    <span
                      title="The member has not shared a phone number with your organisation, or posted anonymously."
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-dashed border-[#e8e8f0] text-[#a1a1b5] text-xs font-semibold cursor-not-allowed"
                    >
                      <Phone size={14} />
                      No contact shared
                    </span>
                  )}
                </div>

                {/* What members see */}
                {post && (
                  <div className="rounded-xl bg-[#f7f7fa] border border-[#eeeef4] p-3 space-y-2">
                    <p className="text-[11px] font-bold uppercase tracking-wide text-[#5b5b6e] flex items-center gap-1.5">
                      <Users size={12} /> What members see on the post
                    </p>
                    {shown ? (
                      <div>
                        <p className="text-sm text-[#16161d] whitespace-pre-line break-words">{shown.note}</p>
                        <p className="text-[11px] text-[#747488] mt-0.5">Updated {timeAgo(shown.at)}</p>
                      </div>
                    ) : (
                      <p className="text-xs text-[#747488]">Only the status ({meta.label.toLowerCase()}). Add a note to tell them what you are doing.</p>
                    )}
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        if (!note.trim()) return;
                        if (await update({ status: incident.status, notes: note.trim() })) setNote('');
                      }}
                      className="flex gap-2"
                    >
                      <input
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        maxLength={1000}
                        placeholder="Add an update for members…"
                        className="flex-1 min-w-0 rounded-lg border border-[#e8e8f0] bg-white px-3 py-2 text-xs text-[#16161d] focus:outline-none focus:border-rose-500"
                      />
                      <button
                        type="submit"
                        disabled={saving || !note.trim()}
                        className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-[#16161d] hover:bg-black text-white text-xs font-bold disabled:opacity-50"
                      >
                        {saving ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
                        Post
                      </button>
                    </form>
                  </div>
                )}

                {/* Who is handling it (staff only) */}
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (officer.trim() === (incident.assignedOfficerName ?? '')) return;
                    await update({ status: incident.status, assignedOfficerName: officer.trim() || undefined });
                  }}
                  className="flex items-center gap-2"
                >
                  <label htmlFor="officer" className="text-[11px] font-semibold text-[#5b5b6e] shrink-0 flex items-center gap-1">
                    <ShieldCheck size={13} /> Handled by
                  </label>
                  <input
                    id="officer"
                    value={officer}
                    onChange={(e) => setOfficer(e.target.value)}
                    placeholder="Name of the staff member (members don't see this)"
                    className="flex-1 min-w-0 rounded-lg border border-[#e8e8f0] bg-white px-3 py-1.5 text-xs text-[#16161d] focus:outline-none focus:border-rose-500"
                  />
                  {officer.trim() !== (incident.assignedOfficerName ?? '') && officer.trim() && (
                    <button type="submit" disabled={saving} className="px-3 py-1.5 rounded-lg border border-[#e8e8f0] text-xs font-semibold hover:bg-[#f1f1f6]">
                      Save
                    </button>
                  )}
                </form>

                {actionError && <p className="text-xs text-rose-600">{actionError}</p>}
              </>
            ) : report.state === 'HELD' ? (
              <p className="text-xs text-violet-700 bg-violet-50 border border-violet-200 rounded-xl px-3 py-2.5">
                This post is held for moderation review. Once it is published, a case opens here and you can act on it.
              </p>
            ) : report.state === 'HIDDEN' ? (
              <p className="text-xs text-[#5b5b6e] bg-[#f1f1f6] rounded-xl px-3 py-2.5">
                This post was not published by moderation, so no case was opened.
              </p>
            ) : (
              <p className="text-xs text-[#5b5b6e] bg-[#f1f1f6] rounded-xl px-3 py-2.5">
                A case is being opened for this post. Refresh in a minute to act on it.
              </p>
            )}
          </section>

          {/* The post */}
          <article className="bg-white border-b border-[#e8e8f0] px-5 py-5 space-y-4">
            <div className="flex items-start gap-3">
              <Avatar name={authorName} anonymous={anonymous} size={44} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-[#16161d] flex items-center gap-1.5">
                  {authorName}
                  {!post && <UserRound size={13} className="text-[#747488]" />}
                </p>
                <p className="text-xs text-[#5b5b6e] flex flex-wrap items-center gap-x-2 gap-y-0.5">
                  <span className="inline-flex items-center gap-1">
                    <Clock size={12} /> {formatWhen(report.createdAt)}
                  </span>
                  {location && (
                    <span className="inline-flex items-center gap-1">
                      <MapPin size={12} /> {location}
                    </span>
                  )}
                  {incident?.latitude != null && incident?.longitude != null && (
                    <a
                      href={`https://www.google.com/maps?q=${incident.latitude},${incident.longitude}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-[#6d4aff] hover:underline"
                    >
                      Open map <ExternalLink size={11} />
                    </a>
                  )}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-[11px]">
              {p?.categoryName && <span className="px-2 py-0.5 rounded-full bg-[#f1f1f6] text-[#3f3f4e] font-semibold">{p.categoryName}</span>}
              {(p?.riskLevel === 'CRITICAL' || p?.riskLevel === 'HIGH') && (
                <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-semibold">
                  {p.riskLevel === 'CRITICAL' ? 'Critical risk' : 'High risk'}
                </span>
              )}
              {!post && incident?.severity && (
                <span className="px-2 py-0.5 rounded-full bg-[#f1f1f6] text-[#3f3f4e] font-semibold">{incident.severity.replace(/_/g, ' ').toLowerCase()}</span>
              )}
            </div>

            {!post && incident?.title && <h3 className="text-base font-bold text-[#16161d]">{incident.title}</h3>}
            <p className="text-[15px] text-[#16161d] leading-relaxed whitespace-pre-line break-words">{content}</p>

            {post && (
              <div className="grid grid-cols-3 gap-2">
                {[
                  { icon: <Heart size={16} className="text-rose-500" />, value: detail?.supportCount ?? post.supportCount, label: 'Support' },
                  { icon: <Users size={16} className="text-violet-600" />, value: detail?.similarCount ?? post.similarCount, label: 'Faced this too' },
                  { icon: <MessageCircle size={16} className="text-sky-600" />, value: detail?.commentCount ?? post.commentCount, label: 'Comments' },
                ].map((r) => (
                  <div key={r.label} className="rounded-xl bg-[#f7f7fa] border border-[#eeeef4] px-3 py-2.5">
                    <div className="flex items-center gap-1.5">
                      {r.icon}
                      <span className="text-base font-bold text-[#16161d]">{r.value ?? '–'}</span>
                    </div>
                    <p className="text-[11px] text-[#5b5b6e] mt-0.5">{r.label}</p>
                  </div>
                ))}
              </div>
            )}
          </article>

          {/* Comments */}
          {post && (
            <section className="px-5 py-5 space-y-3" aria-label="Comments">
              <h3 className="text-xs font-bold uppercase tracking-wide text-[#5b5b6e]">
                What members are saying{detail ? ` (${detail.commentCount})` : ''}
              </h3>

              {detailError ? (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{detailError}</div>
              ) : loadingDetail && !detail ? (
                <div className="space-y-3">
                  {[0, 1].map((i) => (
                    <div key={i} className="h-20 rounded-2xl bg-white border border-[#e8e8f0] animate-pulse" />
                  ))}
                </div>
              ) : comments.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-[#e8e8f0] bg-white p-6 text-center">
                  <MessageCircle className="mx-auto text-[#a1a1b5]" size={22} />
                  <p className="mt-2 text-sm font-semibold text-[#16161d]">No comments yet</p>
                </div>
              ) : (
                <ul className="space-y-3">
                  {comments.map((c) => (
                    <li key={c.id} className={`rounded-2xl bg-white border p-4 ${c.isAccepted ? 'border-emerald-300' : 'border-[#e8e8f0]'}`}>
                      <div className="flex items-start gap-3">
                        <Avatar name={c.authorName} url={c.authorAvatarUrl} anonymous={c.isOriginalPoster && anonymous} />
                        <div className="min-w-0 flex-1 space-y-1.5">
                          <AuthorLine c={c} />
                          {c.isAccepted && (
                            <p className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                              <CheckCircle2 size={13} /> Marked helpful by the author
                            </p>
                          )}
                          <p className="text-sm text-[#16161d] leading-relaxed whitespace-pre-line break-words">{c.content}</p>
                          <div className="flex items-center gap-4 text-[11px] text-[#5b5b6e]">
                            <span className="inline-flex items-center gap-1">
                              <ThumbsUp size={12} /> {c.helpfulCount} helpful
                            </span>
                            {c.notHelpfulCount > 0 && (
                              <span className="inline-flex items-center gap-1">
                                <ThumbsDown size={12} /> {c.notHelpfulCount}
                              </span>
                            )}
                          </div>
                          {c.replies.length > 0 && (
                            <ul className="mt-2 space-y-2.5 border-l-2 border-[#eeeef4] pl-3">
                              {c.replies.map((r) => (
                                <li key={r.id} className="flex items-start gap-2.5">
                                  <CornerDownRight size={13} className="mt-2 text-[#a1a1b5] shrink-0" />
                                  <Avatar name={r.authorName} url={r.authorAvatarUrl} size={28} anonymous={r.isOriginalPoster && anonymous} />
                                  <div className="min-w-0 flex-1 space-y-0.5">
                                    <AuthorLine c={r} />
                                    <p className="text-[13px] text-[#16161d] leading-relaxed whitespace-pre-line break-words">{r.content}</p>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}
        </div>
      </aside>

      <StatusNoteDialog
        status={pendingStatus}
        isSharedPost={!!post}
        saving={saving}
        onCancel={() => setPendingStatus(null)}
        onConfirm={async (n) => {
          if (!pendingStatus) return;
          if (await update({ status: pendingStatus, notes: n || undefined })) setPendingStatus(null);
        }}
      />
    </div>
  );
}
