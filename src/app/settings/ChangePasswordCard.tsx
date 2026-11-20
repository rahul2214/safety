'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/Toast';
import { api } from '@/lib/api-client';
import { passwordStrength, validatePassword } from '@/lib/password';

const fieldClass =
  'w-full h-9 pl-3 pr-9 rounded-lg border border-slate-200 text-xs text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600';

function PasswordField({
  id,
  label,
  value,
  onChange,
  autoComplete,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-semibold text-slate-700 mb-1">
        {label}
      </label>
      <div className="relative flex items-center">
        <input
          id={id}
          type={show ? 'text' : 'password'}
          autoComplete={autoComplete}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={fieldClass}
          required
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-2 p-1 text-slate-400 hover:text-slate-700"
          aria-label={show ? 'Hide password' : 'Show password'}
        >
          {show ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
        </button>
      </div>
    </div>
  );
}

/** Change the signed-in member's password. Needs the current one. */
export function ChangePasswordCard({ email }: { email?: string }) {
  const { showToast } = useToast();
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const strength = passwordStrength(next);
  const strengthClass =
    strength.score >= 3 ? 'text-emerald-600' : strength.score === 2 ? 'text-amber-600' : 'text-red-600';

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const problem = validatePassword(next);
    if (problem) return setError(problem);
    if (next !== confirm) return setError('The two new passwords do not match.');
    if (next === current) return setError('Choose a password different from your current one.');

    setBusy(true);
    const res = await api.changePassword(current, next);
    setBusy(false);

    if (!res.ok) {
      setError(res.error || 'Could not change the password. Please try again.');
      return;
    }
    setCurrent('');
    setNext('');
    setConfirm('');
    showToast('Password changed. Use the new one next time you log in.', 'success');
  };

  return (
    <Card className="p-6 space-y-5">
      <div>
        <h2 className="text-sm font-bold text-slate-900">Change Password</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Enter your current password, then choose a new one.
        </p>
      </div>

      {error && (
        <div role="alert" className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={submit} className="space-y-4">
        <PasswordField
          id="current-password"
          label="Current Password"
          value={current}
          onChange={setCurrent}
          autoComplete="current-password"
        />
        <div>
          <PasswordField
            id="new-password"
            label="New Password"
            value={next}
            onChange={setNext}
            autoComplete="new-password"
          />
          <p className="text-[11px] text-slate-400 mt-1">
            At least 8 characters, with letters and a number or symbol.
            {strength.label && <span className={`ml-2 font-semibold ${strengthClass}`}>{strength.label}</span>}
          </p>
        </div>
        <PasswordField
          id="confirm-password"
          label="Confirm New Password"
          value={confirm}
          onChange={setConfirm}
          autoComplete="new-password"
        />

        <div className="pt-2 flex items-center justify-between gap-3">
          {/* Accounts made with Google have no password to type, and someone who has forgotten
              theirs needs a way through that does not need it. */}
          <Link
            href={`/forgot-password${email ? `?email=${encodeURIComponent(email)}` : ''}`}
            className="text-xs font-semibold text-blue-700 hover:underline"
          >
            Forgot it, or signed up with Google?
          </Link>
          <Button type="submit" variant="primary" disabled={busy}>
            {busy ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Changing...</span>
              </>
            ) : (
              <span>Change Password</span>
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
}
