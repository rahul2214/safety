'use client';

import React, { useEffect, useState } from 'react';
import { AlertCircle, ArrowRight, Check, ChevronLeft, Copy, Download, KeyRound, Loader2 } from 'lucide-react';
import { useAdminAuth, type MfaSetupData } from '@/portals/admin/lib/auth-context';

/**
 * First-time two-step verification setup, shown at sign-in when the account has none yet.
 * Two-step verification is mandatory for administrators, so there is no "skip".
 */
export function MfaSetupStep({ setupToken, onDone, onCancel }: { setupToken: string; onDone: () => void; onCancel: () => void }) {
  const { beginMfaSetup, completeMfaSetup } = useAdminAuth();
  const [setup, setSetup] = useState<MfaSetupData | null>(null);
  const [qr, setQr] = useState<string | null>(null);
  const [code, setCode] = useState('');
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await beginMfaSetup(setupToken);
      if (cancelled) return;
      if (!res.data) {
        setError(res.error || 'Could not start setup.');
        setBusy(false);
        return;
      }
      setSetup(res.data);
      try {
        const QRCode = (await import('qrcode')).default;
        const url = await QRCode.toDataURL(res.data.qrCodeUri, { margin: 1, width: 200 });
        if (!cancelled) setQr(url);
      } catch {
        // The key below still works for manual entry.
      }
      setBusy(false);
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setupToken]);

  const codesText = setup ? setup.recoveryCodes.join('\n') : '';

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!setup) return;
    setError('');
    setBusy(true);
    const res = await completeMfaSetup(setupToken, setup, code.replace(/\s/g, ''));
    setBusy(false);
    if (res.success) onDone();
    else setError(res.error || 'That code did not match.');
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-3 bg-[#e11d48]/10 border border-[#e11d48]/20 rounded-[12px] flex items-center gap-2.5 text-[#e11d48] text-xs font-medium">
          <AlertCircle size={16} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {!setup ? (
        busy ? (
          <div className="py-10 flex justify-center">
            <Loader2 className="animate-spin text-[#6d4aff]" />
          </div>
        ) : null
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <ol className="space-y-4 text-xs text-[#3f3f4e]">
            <li>
              <p className="font-bold text-[#16161d]">1. Scan this with an authenticator app</p>
              <p className="text-[#5b5b6e] mt-0.5">Google Authenticator, Microsoft Authenticator, Authy or 1Password.</p>
              <div className="mt-2 flex flex-col items-center gap-2">
                {qr ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={qr} alt="QR code for your authenticator app" width={180} height={180} className="rounded-xl border border-[#e8e8f0]" />
                ) : null}
                <p className="text-[11px] text-[#5b5b6e]">Can&apos;t scan? Enter this key:</p>
                <code className="px-2 py-1 rounded-lg bg-[#f1f1f6] font-mono text-[11px] tracking-wider break-all text-center">{setup.secret}</code>
              </div>
            </li>

            <li>
              <p className="font-bold text-[#16161d]">2. Save your recovery codes</p>
              <p className="text-[#5b5b6e] mt-0.5">Each works once if you lose your phone. Keep them somewhere safe, not on this computer&apos;s desktop.</p>
              <div className="mt-2 grid grid-cols-2 gap-1.5 rounded-xl bg-[#f7f7fa] border border-[#e8e8f0] p-3 font-mono text-[11px] text-center">
                {setup.recoveryCodes.map((c) => (
                  <span key={c}>{c}</span>
                ))}
              </div>
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(codesText);
                      setCopied(true);
                    } catch {
                      /* copy blocked: download still works */
                    }
                  }}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-xl border border-[#e8e8f0] font-semibold hover:bg-[#f1f1f6]"
                >
                  {copied ? <Check size={13} /> : <Copy size={13} />} {copied ? 'Copied' : 'Copy'}
                </button>
                <a
                  href={`data:text/plain;charset=utf-8,${encodeURIComponent(`Sabhijude admin recovery codes\n\n${codesText}\n`)}`}
                  download="sabhijude-recovery-codes.txt"
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-xl border border-[#e8e8f0] font-semibold hover:bg-[#f1f1f6]"
                >
                  <Download size={13} /> Download
                </a>
              </div>
              <label className="mt-2 flex items-center gap-2 font-semibold text-[#16161d]">
                <input type="checkbox" checked={saved} onChange={(e) => setSaved(e.target.checked)} className="accent-[#6d4aff]" />
                I have saved my recovery codes
              </label>
            </li>

            <li>
              <p className="font-bold text-[#16161d]">3. Enter the 6-digit code from the app</p>
              <div className="relative flex items-center mt-2">
                <KeyRound className="absolute left-3.5 text-[#9797ab]" size={16} />
                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  required
                  maxLength={7}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="123456"
                  className="w-full bg-[#f7f7fa] border border-[#e8e8f0] text-[#16161d] tracking-widest font-mono text-center rounded-[14px] pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#6d4aff] focus:bg-white"
                />
              </div>
            </li>
          </ol>

          <button
            type="submit"
            disabled={busy || !saved || code.replace(/\s/g, '').length < 6}
            className="w-full bg-[#6d4aff] hover:bg-[#5835e5] disabled:opacity-50 text-white font-bold py-3 rounded-[14px] flex items-center justify-center gap-2 text-xs"
          >
            {busy ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={16} />}
            <span>Turn on & continue</span>
          </button>
        </form>
      )}

      <button
        type="button"
        onClick={onCancel}
        className="w-full text-center text-xs text-[#5b5b6e] hover:text-[#16161d] font-semibold flex items-center justify-center gap-1"
      >
        <ChevronLeft size={14} /> Back to Sign In
      </button>
    </div>
  );
}
