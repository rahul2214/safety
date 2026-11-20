'use client';

import React, { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { KeyRound, Loader2, Lock, Mail } from 'lucide-react';
import { api } from '@/lib/api-client';
import { validatePassword } from '@/lib/password';
import { useToast } from '@/components/Toast';
import { AuthLayout } from '@/components/public/AuthLayout';
import {
  digitsOnly,
  ErrorBanner,
  FieldLabel,
  IconInput,
  NoticeBanner,
  PasswordInput,
  SubmitButton,
} from '@/components/public/AuthFormBits';

/**
 * Forgot password, in two steps on one page:
 *   1. enter the email, and a 6-digit code is emailed;
 *   2. enter that code and a new password.
 */
function ForgotPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();

  const [step, setStep] = useState<'email' | 'reset'>('email');
  const [email, setEmail] = useState(searchParams.get('email') ?? '');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendCode = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError(null);
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError('Enter the email address you signed up with.');
      return;
    }

    setBusy(true);
    const res = await api.forgotPassword(email);
    setBusy(false);

    if (!res.ok) {
      setError(res.error || 'Could not send the code. Please try again.');
      return;
    }
    setCode('');
    setStep('reset');
    if (e === undefined) showToast('A new code is on its way.', 'success');
  };

  const submitReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (code.length < 6) {
      setError('Type the 6-digit code from the email.');
      return;
    }
    const problem = validatePassword(password);
    if (problem) {
      setError(problem);
      return;
    }
    if (password !== confirm) {
      setError('The two new passwords do not match.');
      return;
    }

    setBusy(true);
    const res = await api.resetPassword(email, code, password);
    setBusy(false);

    if (!res.ok) {
      setError(res.error || 'Could not reset the password. Please try again.');
      return;
    }
    showToast('Password reset. Log in with your new password.', 'success');
    router.push(`/login?email=${encodeURIComponent(email.trim())}`);
  };

  if (step === 'email') {
    return (
      <AuthLayout
        title="Forgot your password?"
        subtitle="Enter the email you signed up with and we will send you a code to reset it."
      >
        {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}
        <form onSubmit={sendCode} className="space-y-4">
          <div className="space-y-1.5">
            <FieldLabel htmlFor="email">Email address</FieldLabel>
            <IconInput
              id="email"
              icon={Mail}
              type="email"
              autoComplete="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="pt-2">
            <SubmitButton busy={busy} busyLabel="Sending code...">
              <span>Send code</span>
            </SubmitButton>
          </div>
        </form>
        <p className="mt-6 pt-5 border-t border-slate-100 text-center text-sm text-slate-600">
          Remembered it?{' '}
          <Link href="/login" className="text-brand font-semibold hover:underline">
            Back to log in
          </Link>
        </p>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Set a new password" subtitle="Enter the code from the email and choose a new password.">
      {error ? (
        <ErrorBanner message={error} onDismiss={() => setError(null)} />
      ) : (
        <NoticeBanner>
          If <strong>{email.trim()}</strong> has an account, a 6-digit code is on its way. It can take a
          minute to arrive; check your spam folder too.
        </NoticeBanner>
      )}

      <form onSubmit={submitReset} className="space-y-4">
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
            required
          />
        </div>
        <div className="space-y-1.5">
          <FieldLabel htmlFor="new-password">New password</FieldLabel>
          <PasswordInput
            id="new-password"
            icon={Lock}
            autoComplete="new-password"
            placeholder="••••••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <p className="text-[11px] text-slate-500">At least 8 characters, with letters and a number or symbol.</p>
        </div>
        <div className="space-y-1.5">
          <FieldLabel htmlFor="confirm-password">Confirm new password</FieldLabel>
          <PasswordInput
            id="confirm-password"
            icon={Lock}
            autoComplete="new-password"
            placeholder="••••••••••••"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
        </div>
        <div className="pt-2">
          <SubmitButton busy={busy} busyLabel="Resetting...">
            <span>Reset password</span>
          </SubmitButton>
        </div>
      </form>

      <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between text-sm">
        <button
          type="button"
          onClick={() => {
            setError(null);
            setStep('email');
          }}
          className="text-slate-600 hover:text-ink font-medium"
        >
          Use a different email
        </button>
        <button
          type="button"
          onClick={() => void sendCode()}
          disabled={busy}
          className="text-brand font-semibold hover:underline disabled:opacity-60"
        >
          Send a new code
        </button>
      </div>
    </AuthLayout>
  );
}

export function ForgotPasswordClient() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
        </div>
      }
    >
      <ForgotPasswordContent />
    </Suspense>
  );
}
