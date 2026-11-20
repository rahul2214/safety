'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Script from 'next/script';

/**
 * "Continue with Google", using Google Identity Services.
 *
 * Google renders its own button. When someone picks an account, Google hands back an ID token
 * (a "credential"), which the API exchanges for a Sabhijude session at /api/auth/google, the
 * same endpoint the mobile app uses.
 *
 * Needs NEXT_PUBLIC_GOOGLE_CLIENT_ID: the Web OAuth client ID from Google Cloud (the one also
 * entered in Supabase), with this site's origin listed under "Authorised JavaScript origins".
 * Without it, nothing is rendered.
 */

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

interface GoogleIdApi {
  initialize: (config: {
    client_id: string;
    callback: (response: { credential?: string }) => void;
    ux_mode?: 'popup' | 'redirect';
    auto_select?: boolean;
    cancel_on_tap_outside?: boolean;
  }) => void;
  renderButton: (parent: HTMLElement, options: Record<string, unknown>) => void;
}

function googleId(): GoogleIdApi | undefined {
  return (window as any).google?.accounts?.id;
}

export function GoogleSignInButton({
  onCredential,
  disabled = false,
  text = 'continue_with',
}: {
  /** Called with Google's ID token once someone has picked an account. */
  onCredential: (idToken: string) => void;
  /** While true, a cover stops a second sign-in starting. */
  disabled?: boolean;
  text?: 'continue_with' | 'signup_with' | 'signin_with';
}) {
  const holder = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  // Google keeps the first callback it was given, so route through a ref to always call the
  // latest one.
  const callbackRef = useRef(onCredential);
  useEffect(() => {
    callbackRef.current = onCredential;
  }, [onCredential]);

  const render = useCallback(() => {
    const id = googleId();
    if (!CLIENT_ID || !id || !holder.current) return;

    id.initialize({
      client_id: CLIENT_ID,
      callback: (response) => {
        if (response.credential) callbackRef.current(response.credential);
      },
      ux_mode: 'popup',
      auto_select: false,
      cancel_on_tap_outside: true,
    });

    holder.current.innerHTML = '';
    id.renderButton(holder.current, {
      type: 'standard',
      theme: 'outline',
      size: 'large',
      shape: 'pill',
      text,
      logo_alignment: 'center',
      width: Math.min(holder.current.offsetWidth || 400, 400),
    });
    setReady(true);
  }, [text]);

  // When the script is already on the page (coming back to this page), render straight away.
  useEffect(() => {
    if (googleId()) render();
  }, [render]);

  if (!CLIENT_ID) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-slate-200" />
        <span className="text-[11px] font-semibold tracking-wider text-slate-400">OR</span>
        <div className="h-px flex-1 bg-slate-200" />
      </div>

      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onReady={render}
        onError={() => setFailed(true)}
      />

      <div className="relative flex justify-center min-h-[44px]">
        <div ref={holder} className="w-full flex justify-center" />
        {!ready && !failed && (
          <div className="absolute inset-0 rounded-full border border-slate-200 bg-slate-50 animate-pulse" />
        )}
        {disabled && <div className="absolute inset-0 cursor-wait rounded-full bg-white/60" aria-hidden />}
      </div>

      {failed && (
        <p className="text-center text-xs text-slate-500">
          Google sign-in could not load. Check your connection or any content blockers, or use your email instead.
        </p>
      )}
    </div>
  );
}
