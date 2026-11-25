'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  AlertCircle,
  CheckCircle2,
  Copy,
  Eye,
  EyeOff,
  Key,
  Loader2,
  Lock,
  RefreshCw,
  Save,
  Settings,
} from 'lucide-react';
import { useOrg } from '@/portals/org/lib/org-context';
import { useAdminAuth } from '@/portals/org/lib/auth-context';
import {
  accountApi,
  organizationsApi,
  type OrgSettings,
  type OrgSettingsInput,
} from '@/portals/org/lib/api';

const inputClass =
  'w-full bg-[#f7f7fa] border border-[#e8e8f0] rounded-xl px-3 py-2 text-[#16161d] placeholder-[#9797ab] focus:outline-none focus:border-rose-500 disabled:opacity-60';

/** Mirrors the API's password rules (InputGuard.ValidatePassword) so problems show before submitting. */
function passwordProblem(pw: string): string | null {
  if (pw.length < 8) return 'Use at least 8 characters.';
  if (!/[A-Za-z]/.test(pw) || !/[\d\W_]/.test(pw)) return 'Use letters and at least one number or symbol.';
  return null;
}

export default function OrgSettingsPage() {
  const { organization, loading: orgLoading } = useOrg();
  const orgId = organization?.id ?? null;

  const [settings, setSettings] = useState<OrgSettings | null>(null);
  const [form, setForm] = useState<OrgSettingsInput | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (orgId == null) return;
    let cancelled = false;
    setLoading(true);
    setLoadError(null);
    organizationsApi.getSettings(orgId).then((res) => {
      if (cancelled) return;
      if (res.ok && res.data) {
        setSettings(res.data);
        setForm(toForm(res.data));
      } else {
        setLoadError(res.error?.message || 'Could not load the settings.');
      }
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [orgId]);

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="border-b border-[#e8e8f0] pb-5">
        <div className="flex items-center gap-2 text-xs text-[#5b5b6e] mb-1">
          <Link href="/org/dashboard" className="hover:text-[#16161d] transition-colors">
            Dashboard
          </Link>
          <span>/</span>
          <span className="text-[#3f3f4e] font-semibold">Settings</span>
        </div>
        <h1 className="text-xl font-bold text-[#16161d] tracking-tight flex items-center gap-2.5">
          <Settings className="text-rose-500" size={22} />
          <span>Settings</span>
        </h1>
        <p className="text-xs text-[#5b5b6e] mt-1">
          Your organization&apos;s contact details, member join code and your account password.
        </p>
      </div>

      {orgLoading || (loading && orgId != null) ? (
        <div className="flex items-center gap-2 text-xs text-[#5b5b6e] py-10 justify-center">
          <Loader2 size={16} className="animate-spin" />
          <span>Loading settings…</span>
        </div>
      ) : orgId == null ? (
        <Notice tone="error">No organization is linked to this account.</Notice>
      ) : loadError ? (
        <Notice tone="error">{loadError}</Notice>
      ) : settings && form ? (
        <>
          <JoinCodeCard
            orgId={orgId}
            joinCode={settings.joinCode ?? null}
            onChange={(joinCode) => setSettings({ ...settings, joinCode })}
          />
          <DetailsForm
            orgId={orgId}
            settings={settings}
            form={form}
            setForm={setForm}
            onSaved={(next) => {
              setSettings(next);
              setForm(toForm(next));
            }}
          />
        </>
      ) : null}

      <ChangePasswordCard />
    </div>
  );
}

function toForm(s: OrgSettings): OrgSettingsInput {
  return {
    name: s.name ?? '',
    officialEmail: s.officialEmail ?? '',
    officialPhone: s.officialPhone ?? '',
    website: s.website ?? '',
    address: s.address ?? '',
    city: s.city ?? '',
    state: s.state ?? '',
  };
}

function JoinCodeCard({
  orgId,
  joinCode,
  onChange,
}: {
  orgId: number;
  joinCode: string | null;
  onChange: (code: string) => void;
}) {
  const [copied, setCopied] = useState(false);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const copy = async () => {
    if (!joinCode) return;
    try {
      await navigator.clipboard.writeText(joinCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked; the code is on screen to copy by hand.
    }
  };

  const regenerate = async () => {
    if (
      joinCode &&
      !confirm('Create a new join code? The current code will stop working for anyone who has not joined yet.')
    )
      return;
    setWorking(true);
    setError(null);
    const res = await organizationsApi.regenerateJoinCode(orgId);
    setWorking(false);
    if (res.ok && res.data?.joinCode) onChange(res.data.joinCode);
    else setError(res.error?.message || 'Could not create a new join code.');
  };

  return (
    <div className="bg-white border border-[#e8e8f0] rounded-2xl p-4 sm:p-6">
      <h2 className="text-sm font-bold text-[#16161d] flex items-center gap-2">
        <Key size={16} className="text-indigo-600" />
        <span>Member join code</span>
      </h2>
      <p className="text-xs text-[#5b5b6e] mt-0.5">
        Members enter this code in the Sabhijude mobile app to join your organization.
      </p>

      <div className="flex flex-wrap items-center gap-3 mt-4 bg-[#f7f7fa] p-3 rounded-xl border border-[#e8e8f0]">
        <code className="text-sm font-mono font-bold text-indigo-700 flex-1 min-w-0 break-all">
          {joinCode || 'No join code yet'}
        </code>
        {joinCode && (
          <button
            onClick={copy}
            className="px-3 py-1.5 rounded-lg bg-[#f1f1f6] hover:bg-[#e8e8f0] text-[#16161d] text-xs font-semibold flex items-center gap-1.5 transition"
          >
            {copied ? <CheckCircle2 size={13} className="text-emerald-600" /> : <Copy size={13} />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        )}
        <button
          onClick={regenerate}
          disabled={working}
          className="px-3 py-1.5 rounded-lg bg-[#f1f1f6] hover:bg-[#e8e8f0] text-[#16161d] text-xs font-semibold flex items-center gap-1.5 transition disabled:opacity-50"
        >
          <RefreshCw size={13} className={working ? 'animate-spin' : ''} />
          <span>{joinCode ? 'New code' : 'Create code'}</span>
        </button>
      </div>
      {error && <div className="mt-3"><Notice tone="error">{error}</Notice></div>}
    </div>
  );
}

function DetailsForm({
  orgId,
  settings,
  form,
  setForm,
  onSaved,
}: {
  orgId: number;
  settings: OrgSettings;
  form: OrgSettingsInput;
  setForm: (f: OrgSettingsInput) => void;
  onSaved: (s: OrgSettings) => void;
}) {
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ tone: 'ok' | 'error'; text: string } | null>(null);

  const field = (key: keyof OrgSettingsInput) => ({
    value: form[key] ?? '',
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [key]: e.target.value }),
  });

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    const res = await organizationsApi.updateSettings(orgId, form);
    setSaving(false);
    if (res.ok && res.data) {
      onSaved(res.data);
      setMessage({ tone: 'ok', text: 'Settings saved.' });
    } else {
      setMessage({ tone: 'error', text: res.error?.message || 'Could not save the settings.' });
    }
  };

  return (
    <form onSubmit={save} className="bg-white border border-[#e8e8f0] rounded-2xl p-4 sm:p-6 space-y-4 text-xs">
      <h3 className="text-xs font-bold uppercase tracking-wider text-[#5b5b6e] border-b border-[#e8e8f0] pb-2">
        Organization details
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Labeled label="Organization name *">
          <input type="text" required className={inputClass} {...field('name')} />
        </Labeled>
        <Labeled label="Contact email">
          <input type="email" placeholder="security@college.edu" className={inputClass} {...field('officialEmail')} />
        </Labeled>
        <Labeled label="Contact phone">
          <input type="tel" placeholder="+91 …" className={inputClass} {...field('officialPhone')} />
        </Labeled>
        <Labeled label="Website">
          <input type="text" placeholder="https://…" className={inputClass} {...field('website')} />
        </Labeled>
        <Labeled label="Address">
          <input type="text" className={inputClass} {...field('address')} />
        </Labeled>
        <div className="grid grid-cols-2 gap-4">
          <Labeled label="City">
            <input type="text" className={inputClass} {...field('city')} />
          </Labeled>
          <Labeled label="State">
            <input type="text" className={inputClass} {...field('state')} />
          </Labeled>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-[#e8e8f0]">
        <ReadOnly label="Type" value={settings.type} />
        <ReadOnly label="Plan" value={settings.plan} />
        <ReadOnly label="Email domain" value={settings.domain || 'Not set'} />
      </div>
      <p className="text-[11px] text-[#747488]">
        Type, plan and email domain are managed by the Sabhijude team.
      </p>

      {message && <Notice tone={message.tone === 'ok' ? 'ok' : 'error'}>{message.text}</Notice>}

      <div className="flex justify-end pt-1">
        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold flex items-center gap-1.5"
        >
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          <span>{saving ? 'Saving…' : 'Save changes'}</span>
        </button>
      </div>
    </form>
  );
}

function ChangePasswordCard() {
  const { admin } = useAdminAuth();
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [show, setShow] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ tone: 'ok' | 'error'; text: string } | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    const problem = passwordProblem(next);
    if (problem) return setMessage({ tone: 'error', text: problem });
    if (next !== confirmPw) return setMessage({ tone: 'error', text: 'The new passwords do not match.' });
    if (next === current) return setMessage({ tone: 'error', text: 'Choose a password different from your current one.' });

    setSaving(true);
    const res = await accountApi.changePassword(admin?.kind === 'admin' ? 'admin' : 'staff', current, next);
    setSaving(false);

    if (res.ok) {
      setCurrent('');
      setNext('');
      setConfirmPw('');
      setMessage({ tone: 'ok', text: 'Your password has been changed. Use the new one next time you sign in.' });
    } else {
      setMessage({ tone: 'error', text: res.error?.message || 'Could not change the password.' });
    }
  };

  const type = show ? 'text' : 'password';

  return (
    <form onSubmit={submit} className="bg-white border border-[#e8e8f0] rounded-2xl p-4 sm:p-6 space-y-4 text-xs">
      <div className="flex items-start justify-between gap-3 border-b border-[#e8e8f0] pb-2">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#5b5b6e] flex items-center gap-2">
            <Lock size={13} />
            <span>Change password</span>
          </h3>
          {admin?.email && <p className="text-[11px] text-[#747488] mt-1">Signed in as {admin.email}</p>}
        </div>
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="text-[#5b5b6e] hover:text-[#16161d] flex items-center gap-1 text-[11px] font-semibold"
        >
          {show ? <EyeOff size={13} /> : <Eye size={13} />}
          <span>{show ? 'Hide' : 'Show'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Labeled label="Current password">
          <input
            type={type}
            required
            autoComplete="current-password"
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            className={inputClass}
          />
        </Labeled>
        <Labeled label="New password">
          <input
            type={type}
            required
            autoComplete="new-password"
            value={next}
            onChange={(e) => setNext(e.target.value)}
            className={inputClass}
          />
        </Labeled>
        <Labeled label="Confirm new password">
          <input
            type={type}
            required
            autoComplete="new-password"
            value={confirmPw}
            onChange={(e) => setConfirmPw(e.target.value)}
            className={inputClass}
          />
        </Labeled>
      </div>
      <p className="text-[11px] text-[#747488]">At least 8 characters, with letters and a number or symbol.</p>

      {message && <Notice tone={message.tone === 'ok' ? 'ok' : 'error'}>{message.text}</Notice>}

      <div className="flex justify-end pt-1">
        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold flex items-center gap-1.5"
        >
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Lock size={14} />}
          <span>{saving ? 'Changing…' : 'Change password'}</span>
        </button>
      </div>
    </form>
  );
}

function Labeled({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[#5b5b6e] mb-1 font-semibold">{label}</label>
      {children}
    </div>
  );
}

function ReadOnly({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[#747488] mb-1 font-semibold">{label}</div>
      <div className="text-[#3f3f4e] font-mono break-all">{value}</div>
    </div>
  );
}

function Notice({ tone, children }: { tone: 'ok' | 'error'; children: React.ReactNode }) {
  return tone === 'ok' ? (
    <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center gap-2 text-emerald-700 text-xs font-semibold">
      <CheckCircle2 size={15} className="shrink-0" />
      <span>{children}</span>
    </div>
  ) : (
    <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center gap-2 text-rose-700 text-xs font-semibold">
      <AlertCircle size={15} className="shrink-0" />
      <span>{children}</span>
    </div>
  );
}
