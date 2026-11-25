'use client';

import React, { useState } from 'react';
import { Check, Copy, KeyRound, X } from 'lucide-react';
import { organizationsApi, type OrgStaffAccount } from '@/portals/admin/lib/api';

const ROLE_OPTIONS = [
  { value: 'OWNER', label: 'Owner (full control)' },
  { value: 'ORG_ADMIN', label: 'Organization admin' },
  { value: 'SECURITY_OFFICER', label: 'Security officer (incidents only)' },
];

/**
 * Creates the login an organization uses for its portal and shows the credentials once.
 *
 * The temporary password is only ever held in this component's state: it is not stored by
 * the API, so closing the dialog is the last chance to copy it.
 */
export function StaffAccountDialog({
  orgId,
  orgName,
  onClose,
  initialName = '',
  initialEmail = '',
}: {
  orgId: number;
  orgName: string;
  onClose: () => void;
  initialName?: string;
  initialEmail?: string;
}) {
  const [fullName, setFullName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [role, setRole] = useState('OWNER');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<OrgStaffAccount | null>(null);

  const send = async (resetPassword: boolean) => {
    setSaving(true);
    setError(null);
    const res = await organizationsApi.createStaffAccount(orgId, {
      fullName: fullName.trim() || undefined,
      email: email.trim(),
      role,
      resetPassword,
    });
    setSaving(false);
    if (res.ok && res.data) setResult(res.data);
    else setError(res.error?.message || 'Could not create the login.');
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    await send(false);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-[#e8e8f0] w-full max-w-md max-h-[90vh] overflow-y-auto rounded-[22px] p-5 sm:p-6 shadow-xl text-[#16161d]">
        <div className="flex items-center justify-between pb-4 border-b border-[#e8e8f0]">
          <h2 className="text-base font-bold flex items-center gap-2">
            <KeyRound size={18} className="text-[#6d4aff]" />
            <span>{result ? 'Login ready to share' : 'Create organization login'}</span>
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-[#9797ab] hover:text-[#16161d] p-1.5 rounded-[10px] hover:bg-[#f7f7fa]"
          >
            <X size={16} />
          </button>
        </div>

        {result ? (
          <CredentialsView
            result={result}
            onDone={onClose}
            onResetPassword={() => void send(true)}
            resetting={saving}
            error={error}
          />
        ) : (
          <form onSubmit={submit} className="space-y-4 mt-4">
            <p className="text-xs text-[#5b5b6e]">
              Creates a login for <span className="font-semibold text-[#16161d]">{orgName}</span>. They sign in
              at <span className="font-mono">/org/login</span> with the email and the password shown next.
            </p>

            <Field label="Full name">
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Priya Sharma"
                className={inputClass}
              />
            </Field>

            <Field label="Email *">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="security@college.edu"
                className={inputClass}
              />
            </Field>

            <Field label="Role">
              <select value={role} onChange={(e) => setRole(e.target.value)} className={inputClass}>
                {ROLE_OPTIONS.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </Field>

            {error && (
              <p className="text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-[12px] px-3 py-2">{error}</p>
            )}

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#e8e8f0]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-[12px] text-xs font-semibold text-[#5b5b6e] hover:text-[#16161d] hover:bg-[#f7f7fa]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="bg-[#6d4aff] hover:bg-[#5325e8] disabled:opacity-50 text-white px-4 py-2 rounded-[12px] text-xs font-bold transition"
              >
                {saving ? 'Creating…' : 'Create login'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function CredentialsView({
  result,
  onDone,
  onResetPassword,
  resetting,
  error,
}: {
  result: OrgStaffAccount;
  onDone: () => void;
  onResetPassword: () => void;
  resetting: boolean;
  error: string | null;
}) {
  const loginUrl = typeof window !== 'undefined' ? `${window.location.origin}/org/login` : '/org/login';

  const shareText = result.temporaryPassword
    ? `Sabhijude organization portal for ${result.organizationName}\nLogin: ${loginUrl}\nEmail: ${result.email}\nTemporary password: ${result.temporaryPassword}`
    : `Sabhijude organization portal for ${result.organizationName}\nLogin: ${loginUrl}\nEmail: ${result.email}\nUse your existing Sabhijude password.`;

  return (
    <div className="space-y-4 mt-4">
      {result.existingAccount && !result.temporaryPassword ? (
        <div className="space-y-2.5">
          <p className="text-xs text-[#5b5b6e]">
            <span className="font-semibold text-[#16161d]">{result.email}</span> already had a Sabhijude account. It now
            has <span className="font-semibold">{result.role}</span> access to {result.organizationName} and can sign in
            with its existing password.
          </p>
          <p className="text-xs text-[#5b5b6e]">
            If they don&apos;t know that password, generate a new one to share. Their old password will stop working.
          </p>
          <button
            type="button"
            onClick={onResetPassword}
            disabled={resetting}
            className="w-full flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-[12px] border border-[#ddd6fe] bg-[#f1edff] text-[#6d4aff] text-xs font-bold hover:bg-[#e9e3ff] disabled:opacity-50"
          >
            <KeyRound size={14} />
            {resetting ? 'Generating…' : 'Generate new password'}
          </button>
          {error && (
            <p className="text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-[12px] px-3 py-2">{error}</p>
          )}
        </div>
      ) : (
        <p className="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-[12px] px-3 py-2">
          Copy these details now. The password is shown only once and is not stored anywhere you can see it again.
        </p>
      )}

      <div className="rounded-[14px] border border-[#e8e8f0] divide-y divide-[#ececf2]">
        <Row label="Login page" value={loginUrl} />
        <Row label="Email" value={result.email} />
        {result.temporaryPassword && <Row label="Password" value={result.temporaryPassword} mono />}
        <Row label="Role" value={result.role} />
      </div>

      <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#e8e8f0]">
        <CopyButton text={shareText} label="Copy all" />
        <button
          onClick={onDone}
          className="bg-[#6d4aff] hover:bg-[#5325e8] text-white px-4 py-2 rounded-[12px] text-xs font-bold transition"
        >
          Done
        </button>
      </div>
    </div>
  );
}

function Row({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 px-3.5 py-2.5">
      <div className="min-w-0">
        <div className="text-[10px] font-bold uppercase tracking-wider text-[#747488]">{label}</div>
        <div className={`text-xs text-[#16161d] break-all mt-0.5 ${mono ? 'font-mono text-sm font-bold' : ''}`}>
          {value}
        </div>
      </div>
      <CopyButton text={value} />
    </div>
  );
}

function CopyButton({ text, label }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard can be blocked; the value is still on screen to copy by hand.
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      className="shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-[10px] border border-[#e8e8f0] text-[11px] font-semibold text-[#5b5b6e] hover:text-[#16161d] hover:bg-[#f7f7fa]"
    >
      {copied ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
      {label && <span>{copied ? 'Copied' : label}</span>}
    </button>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-[#16161d] mb-1">{label}</label>
      {children}
    </div>
  );
}

const inputClass =
  'w-full bg-[#f7f7fa] border border-[#e8e8f0] px-3.5 py-2.5 rounded-[12px] text-xs text-[#16161d] focus:outline-none focus:border-[#6d4aff] focus:bg-white placeholder-[#9797ab]';
