'use client';

import React, { useEffect, useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { api } from '@/lib/api-client';

/**
 * Reporting a post, or the person who wrote it. Mirrors the mobile app's report sheet.
 *
 * Reporting the author goes through the post rather than a user id, so an anonymous author
 * stays anonymous: the reporter never learns who they reported.
 *
 * The reasons are a closed list because moderation triages on them.
 */
export type ReportTarget = 'post' | 'author';

const REASONS: { value: string; label: string; blurb: string; postOnly?: boolean }[] = [
  { value: 'HARASSMENT', label: 'Harassment or bullying', blurb: 'Repeatedly targeting, mocking or intimidating someone.' },
  { value: 'THREAT', label: 'Threats or violence', blurb: 'Threatening to hurt someone, or encouraging others to.' },
  { value: 'DOXXING', label: 'Sharing private details', blurb: "Posting someone's address, phone number, workplace or photos." },
  { value: 'SEXUAL_CONTENT', label: 'Sexual content or advances', blurb: 'Unwanted sexual messages, or explicit material.' },
  { value: 'IMPERSONATION', label: 'Pretending to be someone', blurb: 'Posing as another person, an organisation or an official.' },
  { value: 'SCAM', label: 'Scam or fraud', blurb: 'Asking for money, or trying to trick people.' },
  { value: 'FALSE_INFORMATION', label: 'False information', blurb: 'Something in this post is untrue or misleading.', postOnly: true },
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
  onReported: (target: ReportTarget) => void;
}

export function ReportDialog({ isOpen, onClose, postUuid, target, onReported }: ReportDialogProps) {
  const [reason, setReason] = useState<string | null>(null);
  const [details, setDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Each opening starts clean.
  useEffect(() => {
    if (isOpen) {
      setReason(null);
      setDetails('');
      setError(null);
    }
  }, [isOpen, target]);

  const reasons = REASONS.filter((r) => target === 'post' || !r.postOnly);

  const submit = async () => {
    if (!reason) {
      setError('Choose what the problem is so we can act on it.');
      return;
    }
    setSubmitting(true);
    setError(null);
    const trimmed = details.trim() || undefined;
    const res =
      target === 'post'
        ? await api.reportPost(postUuid, reason, trimmed)
        : await api.reportPostAuthor(postUuid, reason, trimmed);
    setSubmitting(false);

    if (!res.ok) {
      setError(res.error || 'The report could not be sent. Please try again.');
      return;
    }
    onReported(target);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => !submitting && onClose()}
      title={target === 'post' ? 'Report this post' : 'Report the person who posted this'}
      size="md"
    >
      <div className="space-y-4">
        <p className="text-sm text-slate-500">
          {target === 'post'
            ? 'Moderators will review this post. The author is not told who reported it.'
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
            Send report
          </Button>
        </div>
      </div>
    </Modal>
  );
}
