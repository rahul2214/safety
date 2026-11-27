'use client';

import React, { useState } from 'react';
import { Ban, CheckCircle2, X } from 'lucide-react';
import { organizationsApi, type Organization } from '@/portals/admin/lib/api';

/**
 * Suspends or reactivates an organization. Suspending asks for a reason (kept in the
 * organization's audit log) and spells out what changes, because it cuts a whole campus's
 * security team off at once.
 */
export function SuspendOrgDialog({
  org,
  onClose,
  onChanged,
}: {
  org: Organization;
  onClose: () => void;
  onChanged: (org: Organization) => void;
}) {
  const suspending = !org.isSuspended;
  const [reason, setReason] = useState('');
  const [confirmName, setConfirmName] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const nameMatches = confirmName.trim().toLowerCase() === org.name.trim().toLowerCase();
  const canSubmit = !saving && (!suspending || (reason.trim().length >= 5 && nameMatches));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSaving(true);
    setError(null);
    const res = suspending
      ? await organizationsApi.suspend(org.id, reason.trim())
      : await organizationsApi.reactivate(org.id);
    setSaving(false);
    if (res.ok && res.data) {
      onChanged(res.data);
      onClose();
    } else {
      setError(res.error?.message || 'Could not update the organization. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 z-50 flex items-center justify-center p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="suspend-org-title"
        className="bg-white border border-[#e8e8f0] w-full max-w-md max-h-[90vh] overflow-y-auto rounded-[22px] p-5 sm:p-6 shadow-xl text-[#16161d]"
      >
        <div className="flex items-center justify-between pb-4 border-b border-[#e8e8f0]">
          <h2 id="suspend-org-title" className="text-base font-bold flex items-center gap-2">
            {suspending ? (
              <Ban size={18} className="text-red-600" />
            ) : (
              <CheckCircle2 size={18} className="text-emerald-600" />
            )}
            <span>{suspending ? 'Suspend organization' : 'Reactivate organization'}</span>
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-[#9797ab] hover:text-[#16161d] p-1.5 rounded-[10px] hover:bg-[#f7f7fa]"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={submit} className="space-y-4 mt-4">
          {suspending ? (
            <>
              <div className="text-xs text-[#5b5b6e] space-y-2">
                <p>
                  <span className="font-semibold text-[#16161d]">{org.name}</span>&apos;s owners, admins and security
                  officers lose access straight away:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>no organization portal, incidents, member details or live SOS alerts</li>
                  <li>no invitations, broadcasts or new members joining</li>
                </ul>
                <p>
                  Members keep their own safety features (SOS, posts, emergency contacts). Nothing is deleted, and you can
                  reactivate at any time.
                </p>
              </div>

              <div>
                <label htmlFor="suspend-reason" className="block text-xs font-semibold mb-1">
                  Reason (kept in the organization&apos;s audit log)
                </label>
                <textarea
                  id="suspend-reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  maxLength={500}
                  rows={3}
                  required
                  placeholder="e.g. Subscription not renewed"
                  className="w-full px-3 py-2 rounded-[12px] border border-[#e8e8f0] text-sm focus:outline-none focus:border-[#6d4aff]"
                />
              </div>

              <div>
                <label htmlFor="suspend-confirm" className="block text-xs font-semibold mb-1">
                  Type <span className="font-mono">{org.name}</span> to confirm
                </label>
                <input
                  id="suspend-confirm"
                  value={confirmName}
                  onChange={(e) => setConfirmName(e.target.value)}
                  autoComplete="off"
                  className="w-full px-3 py-2 rounded-[12px] border border-[#e8e8f0] text-sm focus:outline-none focus:border-[#6d4aff]"
                />
              </div>
            </>
          ) : (
            <p className="text-xs text-[#5b5b6e]">
              <span className="font-semibold text-[#16161d]">{org.name}</span>&apos;s staff get their portal access back
              on their next sign-in or page load, and new members can join again.
            </p>
          )}

          {error && (
            <p role="alert" className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-[10px] px-3 py-2">
              {error}
            </p>
          )}

          <div className="flex gap-2.5 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-3.5 py-2.5 rounded-[12px] border border-[#e8e8f0] text-xs font-bold hover:bg-[#f7f7fa]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!canSubmit}
              className={`flex-1 px-3.5 py-2.5 rounded-[12px] text-white text-xs font-bold disabled:opacity-50 ${
                suspending ? 'bg-red-600 hover:bg-red-700' : 'bg-emerald-600 hover:bg-emerald-700'
              }`}
            >
              {saving ? 'Saving…' : suspending ? 'Suspend organization' : 'Reactivate'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
