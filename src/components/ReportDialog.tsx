'use client';

import React, { useEffect, useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { api } from '@/lib/api-client';

/**
 * Reporting a post, a comment (or reply) under it, or the person who wrote the post. Mirrors
 * the mobile app's report sheet.
 *
 * Everything is addressed through the post, never a user id, so an anonymous author stays
 * anonymous: the reporter never learns who they reported. Anything shown anonymously can only
 * be reported; for everyone else the dialog offers "Also block".
 *
 * The reasons are a closed list because moderation triages on them.
 */
export type ReportTarget = 'post' | 'author' | 'comment';

const REASONS: { value: string; label: string; blurb: string; contentOnly?: boolean }[] = [
  // First on purpose: Google Play's child safety policy requires an obvious way to report
  // child sexual abuse or exploitation. Needs API + migration 00034 to be live.
  { value: 'CHILD_SAFETY', label: 'Child safety concern', blurb: 'Sexual content involving a child, grooming, or any risk to a child.' },
  { value: 'HARASSMENT', label: 'Harassment or bullying', blurb: 'Repeatedly targeting, mocking or intimidating someone.' },
  { value: 'THREAT', label: 'Threats or violence', blurb: 'Threatening to hurt someone, or encouraging others to.' },
  { value: 'DOXXING', label: 'Sharing private details', blurb: "Posting someone's address, phone number, workplace or photos." },
  { value: 'SEXUAL_CONTENT', label: 'Sexual content or advances', blurb: 'Unwanted sexual messages, or explicit material.' },
  { value: 'IMPERSONATION', label: 'Pretending to be someone', blurb: 'Posing as another person, an organisation or an official.' },
  { value: 'SCAM', label: 'Scam or fraud', blurb: 'Asking for money, or trying to trick people.' },
  { value: 'FALSE_INFORMATION', label: 'False information', blurb: 'Something in it is untrue or misleading.', contentOnly: true },
  { value: 'DANGEROUS_ADVICE', label: 'Dangerous advice', blurb: 'Suggesting something that could put someone at risk.' },
  { value: 'SPAM', label: 'Spam', blurb: 'Repetitive posting, or advertising.' },
  { value: 'OTHER', label: 'Something else', blurb: "Tell us what happened and we'll look at it." },
];

const MAX_DETAILS = 1000;

interface ReportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  /** The post's public uuid. */
  postUuid: string;
  target: ReportTarget;
  /** For target 'comment': the comment, and the reply under it when a reply is reported. */
  solutionId?: number;
  replyId?: number;
  /** How the author appears, for wording only. */
  displayName?: string;
  /** Offer "Also block". False for anything shown anonymously. */
  canBlock?: boolean;
  /** Start with "Also block" ticked: the menu's "Report & block". */
  initialAlsoBlock?: boolean;
  onReported: (target: ReportTarget, blocked: boolean) => void;
}

export function ReportDialog({
  isOpen,
  onClose,
  postUuid,
  target,
  solutionId,
  replyId,
  displayName = 'this person',
  canBlock = false,
  initialAlsoBlock = false,
  onReported,
}: ReportDialogProps) {
  const [reason, setReason] = useState<string | null>(null);
  const [details, setDetails] = useState('');
  const [alsoBlock, setAlsoBlock] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isContent = target !== 'author';
  const thing = target === 'comment' ? (replyId ? 'reply' : 'comment') : 'post';

  // Each opening starts clean, with "Also block" as the menu asked.
  useEffect(() => {
    if (isOpen) {
      setReason(null);
      setDetails('');
      setError(null);
      setAlsoBlock(canBlock && initialAlsoBlock);
    }
  }, [isOpen, target, canBlock, initialAlsoBlock]);

  const reasons = REASONS.filter((r) => isContent || !r.contentOnly);

  const submit = async () => {
    if (!reason) {
      setError('Choose what the problem is so we can act on it.');
      return;
    }
    setSubmitting(true);
    setError(null);
    const trimmed = details.trim() || undefined;
    const block = canBlock && alsoBlock;
    const res =
      target === 'post'
        ? await api.reportPost(postUuid, reason, trimmed, block)
        : target === 'comment' && solutionId != null
          ? await api.reportComment(postUuid, solutionId, { reason, details: trimmed, replyId, alsoBlock: block })
          : await api.reportPostAuthor(postUuid, reason, trimmed);
    setSubmitting(false);

    if (!res.ok) {
      setError(res.error || 'The report could not be sent. Please try again.');
      return;
    }
    const blocked = !!(res.data as { blocked?: boolean } | undefined)?.blocked;
    onReported(target, blocked);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => !submitting && onClose()}
      title={isContent ? `Report this ${thing}` : 'Report the person who posted this'}
      size="md"
    >
      <div className="space-y-4">
        <p className="text-sm text-slate-500">
          {isContent
            ? `Moderators will review this ${thing}. The author is not told who reported it.`
            : 'Moderators will review this account. They are not told who reported them, and if the post is anonymous you will not learn who they are either.'}
        </p>

        <fieldset className="space-y-2">
          <legend className="sr-only">Reason</legend>
          {reasons.map((option) => {
            const selected = reason === option.value;
            return (
              <label
                key={option.value}
                className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-3 transition-colors ${
                  selected ? 'border-brand bg-brand-tint' : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="report-reason"
                  value={option.value}
                  checked={selected}
                  onChange={() => setReason(option.value)}
                  className="mt-1 accent-current"
                />
                <span>
                  <span className="block text-sm font-semibold text-ink">{option.label}</span>
                  <span className="block text-xs text-slate-500">{option.blurb}</span>
                </span>
              </label>
            );
          })}
        </fieldset>

        {canBlock && (
          <label
            className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-3 transition-colors ${
              alsoBlock ? 'border-red-300 bg-red-50' : 'border-slate-200 hover:bg-slate-50'
            }`}
          >
            <input
              type="checkbox"
              checked={alsoBlock}
              onChange={(e) => setAlsoBlock(e.target.checked)}
              className="mt-1 accent-red-600"
            />
            <span>
              <span className="block text-sm font-semibold text-ink">Also block {displayName}</span>
              <span className="block text-xs text-slate-500">Hide their posts and comments from you. They are not told.</span>
            </span>
          </label>
        )}

        {reason && (
          <div className="space-y-1">
            <label htmlFor="report-details" className="text-sm font-semibold text-ink">
              Anything else? <span className="font-normal text-slate-400">(optional)</span>
            </label>
            <textarea
              id="report-details"
              value={details}
              onChange={(e) => setDetails(e.target.value.slice(0, MAX_DETAILS))}
              rows={3}
              className="w-full rounded-2xl border border-slate-200 p-3 text-sm focus:border-brand focus:outline-none"
              placeholder="What should the moderators know?"
            />
            <p className="text-right text-xs text-slate-400">
              {details.length}/{MAX_DETAILS}
            </p>
          </div>
        )}

        {error && (
          <p role="alert" className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        <div className="flex justify-end gap-2 pt-1">
          <Button variant="ghost" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button variant="emergency" onClick={submit} loading={submitting} disabled={!reason}>
            {canBlock && alsoBlock ? 'Report & block' : 'Send report'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
