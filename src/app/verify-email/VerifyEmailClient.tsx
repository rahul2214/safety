'use client';

import React, { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { KeyRound, Loader2 } from 'lucide-react';
import { api } from '@/lib/api-client';
import { useAuth } from '@/lib/auth-context';
import { safeRedirect } from '@/lib/safe-redirect';
import { useToast } from '@/components/Toast';
import { AuthLayout } from '@/components/public/AuthLayout';
import {
  digitsOnly,
  ErrorBanner,
  FieldLabel,
  IconInput,
  NoticeBanner,
  SubmitButton,
} from '@/components/public/AuthFormBits';

/** Seconds before another code can be requested. Supabase allows about one a minute. */
const RESEND_COOLDOWN = 60;

/**
 * Confirms a new account's email with the 6-digit code sent on sign-up. Reached from sign-up
 * and from login (for an address that was never confirmed). Confirming signs the member in.
 *
 * `next=profile` (from sign-up) continues to the profile step; otherwise to `redirect`.
 */
function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { verifyEmail } = useAuth();
  const { showToast } = useToast();

  const email = (searchParams.get('email') ?? '').trim();
  const redirectPath = safeRedirect(searchParams.get('redirect'));
  const toProfile = searchParams.get('next') === 'profile';

  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (code.length < 6) {
      setError('Type the 6-digit code from the email.');
      return;
    }

    setBusy(true);
    const result = await verifyEmail(email, code);
    setBusy(false);

    if (!result.success) {
      setError(result.error || 'That code is wrong or has expired.');
      return;
    }
    showToast('Email confirmed. Welcome to Sabhijude!', 'success');
    router.replace(
      toProfile ? `/signup?stage=profile&redirect=${encodeURIComponent(redirectPath)}` : redirectPath
    );
  };

  const resend = async () => {
    if (cooldown > 0 || !email) return;
    setError(null);
    const res = await api.resendVerification(email);
    if (!res.ok) {
      setError(res.error || 'Could not send a new code. Please try again shortly.');
      return;
    }
    setCooldown(RESEND_COOLDOWN);
    showToast('A new code is on its way.', 'success');
  };

  if (!email) {
    return (
      <AuthLayout title="Confirm your email" subtitle="This link is missing the email address to confirm.">
        <p className="text-sm text-slate-600">
          Try{' '}
          <Link href="/login" className="text-brand font-semibold hover:underline">
            logging in
          </Link>{' '}
          again; if your address still needs confirming, you will be brought back here.
        </p>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Confirm your email" subtitle="One last step to finish setting up your account.">
      {error ? (
        <ErrorBanner message={error} onDismiss={() => setError(null)} />
      ) : (
        <NoticeBanner>
          We sent a 6-digit code to <strong>{email}</strong>. Check your spam folder if it is not in
          your inbox.
        </NoticeBanner>
      )}

      <form onSubmit={submit} className="space-y-4">
        <div className="space-y-1.5">
          <FieldLabel htmlFor="code">Code from the email</FieldLabel>
          <IconInput
            id="code"
            icon={KeyRound}
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder="123456"
            value={code}
            onChange={(e) => setCode(digitsOnly(e.target.value))}
            autoFocus
            required
          />
        </div>
        <div className="pt-2">
          <SubmitButton busy={busy} busyLabel="Confirming...">
            <span>Confirm email</span>
          </SubmitButton>
        </div>
      </form>

      <div className="mt-6 pt-5 border-t border-slate-100 text-center text-sm">
        <button
          type="button"
          onClick={resend}
          disabled={cooldown > 0}
          className="font-semibold text-brand hover:underline disabled:text-slate-400 disabled:no-underline"
        >
          {cooldown > 0 ? `Send a new code in ${cooldown}s` : 'Did not get it? Send a new code'}
        </button>
      </div>
    </AuthLayout>
  );
}

export function VerifyEmailClient() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
