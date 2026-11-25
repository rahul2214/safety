'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Building2, CheckCircle2, Clock, Loader2, ShieldCheck, XCircle } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { api, type AcceptStudentInviteResult, type StudentInvitePreview } from '@/lib/api-client';
import { AuthLayout } from '@/components/public/AuthLayout';

/**
 * The page an emailed invitation link opens: /join#t=<token>.
 *
 * The token sits after "#", so browsers never send it to any server in the URL, logs or
 * Referer header. It is moved into sessionStorage (this tab only) and wiped from the address
 * bar, so it survives the trip through sign-in / sign-up and is gone when the tab closes.
 */
const STORAGE_KEY = 'sabhijude_pending_invite';

const OPTIONAL_CONSENTS = [
  {
    scope: 'contact_info',
    label: 'Contact details',
    help: 'Your phone number and email, so campus security can reach you.',
  },
  {
    scope: 'location_sharing',
    label: 'Live location sharing',
    help: 'Your location at other times. Most students leave this off.',
  },
];

type Stage = 'loading' | 'invalid' | 'ready' | 'submitting' | 'done' | 'declined';

function readToken(): string | null {
  if (typeof window === 'undefined') return null;
  const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''));
  const fromHash = hash.get('t');
  try {
    if (fromHash) {
      sessionStorage.setItem(STORAGE_KEY, fromHash);
      // Remove the token from the visible URL so it isn't copied or screenshotted.
      window.history.replaceState(null, '', window.location.pathname);
      return fromHash;
    }
    return sessionStorage.getItem(STORAGE_KEY);
  } catch {
    return fromHash;
  }
}

function forgetToken() {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    /* storage unavailable */
  }
}

export function JoinInviteClient() {
  const { user, isAuthenticated, isLoading } = useAuth();

  const [token, setToken] = useState<string | null>(null);
  const [stage, setStage] = useState<Stage>('loading');
  const [invite, setInvite] = useState<StudentInvitePreview | null>(null);
  const [consents, setConsents] = useState<Record<string, boolean>>({});
  const [stopEmails, setStopEmails] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AcceptStudentInviteResult | null>(null);

  useEffect(() => {
    const t = readToken();
    setToken(t);
    if (!t) {
      setStage('invalid');
      return;
    }
    api.previewStudentInvite(t).then((res) => {
      if (res.ok && res.data) {
        setInvite(res.data);
        setStage('ready');
      } else {
        forgetToken();
        setStage('invalid');
      }
    });
  }, []);

  const accept = async () => {
    if (!token) return;
    setStage('submitting');
    setError(null);
    const granted = Object.entries(consents).filter(([, v]) => v).map(([k]) => k);
    const res = await api.acceptStudentInvite({ token, consents: ['profile', ...granted] });
    if (res.ok && res.data) {
      forgetToken();
      setResult(res.data);
      setStage('done');
    } else {
      setError(res.error ?? 'Could not accept the invitation. Please try again.');
      setStage('ready');
    }
  };

  const decline = async () => {
    if (!token) return;
    setStage('submitting');
    await api.declineStudentInvite({ token, stopEmails });
    forgetToken();
    setStage('declined');
  };

  const expires = invite?.expiresAt
    ? new Date(invite.expiresAt).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })
    : null;

  // ─── Terminal states ────────────────────────────────────────────
  if (stage === 'loading' || isLoading) {
    return (
      <AuthLayout title="Opening invitation…">
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-brand" aria-label="Loading" />
        </div>
      </AuthLayout>
    );
  }

  if (stage === 'invalid') {
    return (
      <AuthLayout title="This link isn't valid" subtitle="It may have expired, been used already, or been replaced by a newer email.">
        <div className="space-y-4">
          <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            <XCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <p>Ask your college to resend the invitation, then open the newest email. Each link works once.</p>
          </div>
          <Link href="/" className="inline-block text-sm font-semibold text-brand hover:underline">
            Go to Sabhijude
          </Link>
        </div>
      </AuthLayout>
    );
  }

  if (stage === 'declined') {
    return (
      <AuthLayout title="Invitation declined">
        <p className="text-sm text-slate-600">
          Nothing was shared with the organization.
          {stopEmails ? ' You will not receive further invitation emails at this address.' : ''}
        </p>
      </AuthLayout>
    );
  }

  if (stage === 'done' && result) {
    const pending = result.result === 'PENDING_APPROVAL';
    return (
      <AuthLayout title={pending ? 'Request sent' : "You're in"}>
        <div className="space-y-4">
          <div
            className={`flex items-start gap-3 rounded-xl border p-4 text-sm ${
              pending ? 'border-amber-200 bg-amber-50 text-amber-900' : 'border-emerald-200 bg-emerald-50 text-emerald-900'
            }`}
          >
            {pending ? <Clock className="h-5 w-5 shrink-0 mt-0.5" /> : <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />}
            <p>{result.message}</p>
          </div>
          <Link href="/organizations" className="inline-block text-sm font-semibold text-brand hover:underline">
            View my organizations
          </Link>
        </div>
      </AuthLayout>
    );
  }

  // ─── Invitation ─────────────────────────────────────────────────
  const orgName = invite?.orgName ?? 'An organization';
  const busy = stage === 'submitting';

  return (
    <AuthLayout title="You're invited" subtitle={`${orgName} invited you to join its community on Sabhijude.`}>
      <div className="space-y-6">
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 p-4">
          {invite?.orgLogoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={invite.orgLogoUrl} alt="" className="h-12 w-12 rounded-lg object-cover" />
          ) : (
            <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100">
              <Building2 className="h-6 w-6 text-slate-500" />
            </span>
          )}
          <div className="min-w-0">
            <p className="font-semibold text-slate-900 truncate">{orgName}</p>
            {expires && <p className="text-xs text-slate-500">Link valid until {expires}</p>}
          </div>
        </div>

        {!isAuthenticated ? (
          <div className="space-y-3">
            <p className="text-sm text-slate-600">
              Sign in or create a free account to continue. You can use any email address.
            </p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Link
                href="/login?redirect=/join"
                className="flex-1 rounded-xl bg-brand px-4 py-3 text-center text-sm font-semibold text-white hover:opacity-90"
              >
                Sign in
              </Link>
              <Link
                href="/signup?redirect=/join"
                className="flex-1 rounded-xl border border-slate-300 px-4 py-3 text-center text-sm font-semibold text-slate-800 hover:bg-slate-50"
              >
                Create account
              </Link>
            </div>
          </div>
        ) : (
          <>
            <p className="text-sm text-slate-600">
              Signed in as <span className="font-semibold text-slate-900">{user?.email}</span>. If this isn't the
              email the invitation was sent to, {orgName} will confirm it's you before you join.
            </p>

            <fieldset className="space-y-3">
              <legend className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-900">
                <ShieldCheck className="h-4 w-4 text-brand" /> What {orgName} can see
              </legend>

              <label className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
                <input type="checkbox" checked disabled className="mt-1" />
                <span className="text-sm">
                  <span className="font-medium text-slate-900">Your name and profile</span>
                  <span className="block text-slate-500">Required, so they know who joined.</span>
                </span>
              </label>

              {OPTIONAL_CONSENTS.map((c) => (
                <label key={c.scope} className="flex items-start gap-3 rounded-xl border border-slate-200 p-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="mt-1"
                    checked={!!consents[c.scope]}
                    onChange={(e) => setConsents((prev) => ({ ...prev, [c.scope]: e.target.checked }))}
                  />
                  <span className="text-sm">
                    <span className="font-medium text-slate-900">{c.label}</span>
                    <span className="block text-slate-500">{c.help}</span>
                  </span>
                </label>
              ))}
              <p className="text-xs text-slate-500">You can change these or leave the organization at any time.</p>
            </fieldset>

            {error && (
              <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                {error}
              </div>
            )}

            <button
              type="button"
              onClick={accept}
              disabled={busy}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-4 py-3 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
            >
              {busy && <Loader2 className="h-4 w-4 animate-spin" />}
              Accept and join
            </button>
          </>
        )}

        <details className="rounded-xl border border-slate-200 p-4 text-sm">
          <summary className="cursor-pointer font-medium text-slate-700">Don't know this organization or don't want to join?</summary>
          <div className="mt-3 space-y-3">
            <label className="flex items-center gap-2 text-slate-600">
              <input type="checkbox" checked={stopEmails} onChange={(e) => setStopEmails(e.target.checked)} />
              Don't email me invitations again
            </label>
            <button
              type="button"
              onClick={decline}
              disabled={busy}
              className="rounded-lg border border-slate-300 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
            >
              Decline invitation
            </button>
          </div>
        </details>
      </div>
    </AuthLayout>
  );
}
