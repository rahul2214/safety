'use client';

import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, Eye, EyeOff, Loader2, X } from 'lucide-react';

/**
 * Small pieces shared by the forgot-password and verify-email pages, styled to match the
 * login and signup forms.
 */

export function FieldLabel({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="block text-xs font-semibold text-slate-700">
      {children}
    </label>
  );
}

const inputClass =
  'w-full h-12 bg-white border border-slate-300 focus:border-brand focus:ring-brand/15 rounded-xl pl-10 pr-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-colors';

export function IconInput({
  icon: Icon,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { icon: React.ComponentType<{ className?: string }> }) {
  return (
    <div className="relative flex items-center">
      <div className="absolute left-3.5 pointer-events-none text-slate-400">
        <Icon className="h-4 w-4" />
      </div>
      <input {...props} className={inputClass} />
    </div>
  );
}

export function PasswordInput({
  icon: Icon,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { icon: React.ComponentType<{ className?: string }> }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative flex items-center">
      <div className="absolute left-3.5 pointer-events-none text-slate-400">
        <Icon className="h-4 w-4" />
      </div>
      <input {...props} type={show ? 'text' : 'password'} className={`${inputClass} pr-10 tracking-wide`} />
      <button
        type="button"
        onClick={() => setShow(!show)}
        className="absolute right-3 p-1 text-slate-400 hover:text-slate-700 transition-colors focus:outline-none"
        aria-label={show ? 'Hide password' : 'Show password'}
      >
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}

export function SubmitButton({ busy, busyLabel, children }: { busy: boolean; busyLabel: string; children: React.ReactNode }) {
  return (
    <button
      type="submit"
      disabled={busy}
      className="w-full h-12 rounded-full bg-ink hover:bg-ink-soft active:bg-black text-white font-semibold text-sm shadow-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-60 cursor-pointer"
    >
      {busy ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin text-white" />
          <span>{busyLabel}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}

export function ErrorBanner({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  return (
    <div
      role="alert"
      className="mb-5 p-4 rounded-xl bg-red-50 border-2 border-red-300 text-red-900 text-xs font-medium flex items-start gap-3"
    >
      <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
      <p className="flex-1 leading-relaxed text-red-700 text-sm">{message}</p>
      <button
        type="button"
        onClick={onDismiss}
        className="p-1 text-red-400 hover:text-red-700 rounded transition-colors"
        aria-label="Dismiss error"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

export function NoticeBanner({ children }: { children: React.ReactNode }) {
  return (
    <div
      role="status"
      className="mb-5 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-start gap-3"
    >
      <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
      <div className="leading-relaxed">{children}</div>
    </div>
  );
}

/** Keeps only digits, for the emailed codes. */
export const digitsOnly = (v: string) => v.replace(/\D/g, '').slice(0, 10);
