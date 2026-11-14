'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { AlertTriangle, CheckCircle2, EyeOff, Lock, LogOut, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/ui/Logo';
import { api, type AccountStatus } from '@/lib/api-client';

/** Fired by the API client when the server refuses a request because the account is suspended. */
export const ACCOUNT_SUSPENDED_EVENT = 'sabhijude_account_suspended';

const MIN_APPEAL = 20;
const MAX_APPEAL = 2000;

/**
 * The signed-in member's standing. Checked once per sign-in and again whenever the API turns
 * a request away for it, since an account can be suspended mid-session.
 *
 * A failed check reads as "in good standing": an unreachable server must never lock someone
 * out of a safety app they are entitled to use.
 */
export function useAccountStanding(enabled: boolean) {
  const [status, setStatus] = useState<AccountStatus | null>(null);

  const refresh = useCallback(async () => {
    const res = await api.getAccountStatus();
    setStatus(res.ok && res.data ? res.data : null);
  }, []);

  useEffect(() => {
    if (!enabled) {
      setStatus(null);
      return;
    }
    void refresh();
    const onSuspended = () => void refresh();
    window.addEventListener(ACCOUNT_SUSPENDED_EVENT, onSuspended);
    return () => window.removeEventListener(ACCOUNT_SUSPENDED_EVENT, onSuspended);
  }, [enabled, refresh]);

  return { status, refresh };
}

/**
 * Shown in place of the app while an account is suspended. Mirrors the mobile screen.
 *
 * The tone is deliberate. An automatic suspension is triggered by a count of reports, not by
 * anyone having read them, so it says so plainly and offers the right of reply at once.
 */
export function SuspendedScreen({
  status,
  onAppealSent,
  onSignOut,
}: {
  status: AccountStatus;
  onAppealSent: () => void;
  onSignOut: () => void;
}) {
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const automatic = status.kind === 'AUTOMATIC_REPORTS';
  const length = message.trim().length;

  const submit = async () => {
    if (length < MIN_APPEAL) {
      setError(`Please describe what happened in at least ${MIN_APPEAL} characters so someone can look into it properly.`);
      return;
    }
    setSubmitting(true);
    setError(null);
    const res = await api.submitAppeal(message.trim());
    setSubmitting(false);
    if (!res.ok) {
      setError(res.error || 'Your message could not be sent. Please try again.');
      return;
    }
    setMessage('');
    onAppealSent();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-start sm:items-center justify-center p-4 py-10">
      <div className="max-w-lg w-full space-y-4">
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 text-center space-y-3">
          <div className="flex justify-center">
            <Logo size={48} />
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
            <AlertTriangle className="h-3.5 w-3.5" /> Account on hold
          </span>
          <h1 className="font-display text-2xl font-extrabold text-ink">Your account is on hold</h1>
          <p className="text-sm text-slate-500 leading-relaxed">
            {automatic
              ? 'A number of members reported your account, so we have temporarily suspended it while we look into it. This happened automatically — no one has read the reports yet.'
              : 'A moderator has suspended your account while we look into reports about it.'}
          </p>
        </div>

        <ul className="bg-white p-5 rounded-3xl border border-slate-200 space-y-3 text-sm text-ink">
          <li className="flex gap-3">
            <EyeOff className="h-4 w-4 mt-0.5 shrink-0 text-slate-400" /> Your posts are hidden while this is reviewed.
          </li>
          <li className="flex gap-3">
            <Lock className="h-4 w-4 mt-0.5 shrink-0 text-slate-400" /> You cannot post, reply or react for now.
          </li>
          <li className="flex gap-3">
            <ShieldCheck className="h-4 w-4 mt-0.5 shrink-0 text-emerald-600" />
            <span>
              Your emergency contacts and SOS still work. Safety is never suspended.{' '}
              <Link href="/emergency" className="font-semibold text-red-600 underline">
                Open Emergency
              </Link>
            </span>
          </li>
        </ul>

        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 space-y-3">
          {status.appealPending ? (
            <div className="space-y-1.5">
              <p className="flex items-center gap-2 font-bold text-brand">
                <CheckCircle2 className="h-4 w-4" /> We have your message
              </p>
              <p className="text-sm text-slate-500">
                A moderator will read it and decide. You will be able to use your account again as soon as it is cleared.
              </p>
            </div>
          ) : (
            <>
              <div>
                <h2 className="font-bold text-ink">Think we have got this wrong?</h2>
                <p className="text-sm text-slate-500 mt-1">Tell us what happened in your own words. A person will read it.</p>
              </div>
              {status.appealOutcome === 'UPHELD' && (
                <p className="rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-500">
                  We reviewed your last message and the suspension stands. You can write to us again if something has changed.
                </p>
              )}
              <label htmlFor="appeal-message" className="sr-only">
                Your message
              </label>
              <textarea
                id="appeal-message"
                value={message}
                onChange={(e) => setMessage(e.target.value.slice(0, MAX_APPEAL))}
                rows={5}
                className="w-full rounded-2xl border border-slate-200 p-3 text-sm focus:border-brand focus:outline-none"
                placeholder="What happened?"
              />
              <p className="text-xs text-slate-400">
                {length < MIN_APPEAL ? `${MIN_APPEAL - length} more characters needed` : `${length} / ${MAX_APPEAL}`}
              </p>
              {error && (
                <p role="alert" className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
                  {error}
                </p>
              )}
              <Button className="w-full" onClick={submit} loading={submitting} disabled={length < MIN_APPEAL}>
                Send to a moderator
              </Button>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={onSignOut}
          className="mx-auto flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800"
        >
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </div>
    </div>
  );
}
