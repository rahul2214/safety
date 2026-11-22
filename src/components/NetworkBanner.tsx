'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { CheckCircle2, CloudOff, RefreshCw, ServerCrash } from 'lucide-react';
import { NETWORK_EVENT } from '@/lib/api-client';

type Status = 'online' | 'offline' | 'server-down';

/** How often to check, while something is wrong, whether it has recovered. */
const PROBE_MS = 8_000;

/**
 * A strip at the bottom of the screen while the site cannot reach the internet or its server,
 * so an empty or half-loaded page is never mistaken for "nothing here". Checks by itself until
 * things recover, then says "Back online".
 */
export function NetworkBanner() {
  const [status, setStatus] = useState<Status>('online');
  const [showBack, setShowBack] = useState(false);
  const [checking, setChecking] = useState(false);
  const statusRef = useRef<Status>('online');

  const update = useCallback((next: Status) => {
    const prev = statusRef.current;
    if (prev === next) return;
    statusRef.current = next;
    setStatus(next);
    if (next === 'online' && prev !== 'online') {
      setShowBack(true);
      setTimeout(() => setShowBack(false), 3_000);
    }
  }, []);

  const probe = useCallback(async () => {
    if (!navigator.onLine) return update('offline');
    try {
      const res = await fetch('/api/health', { cache: 'no-store' });
      update(res.ok ? 'online' : 'server-down');
    } catch {
      update(navigator.onLine ? 'server-down' : 'offline');
    }
  }, [update]);

  useEffect(() => {
    if (!navigator.onLine) update('offline');

    const onOffline = () => update('offline');
    const onOnline = () => void probe();
    const onApi = (e: Event) => {
      const state = (e as CustomEvent<'up' | 'down'>).detail;
      if (state === 'up') update('online');
      else void probe();
    };

    window.addEventListener('offline', onOffline);
    window.addEventListener('online', onOnline);
    window.addEventListener(NETWORK_EVENT, onApi);
    return () => {
      window.removeEventListener('offline', onOffline);
      window.removeEventListener('online', onOnline);
      window.removeEventListener(NETWORK_EVENT, onApi);
    };
  }, [probe, update]);

  // Keep checking while something is wrong.
  useEffect(() => {
    if (status === 'online') return;
    const t = setInterval(() => void probe(), PROBE_MS);
    return () => clearInterval(t);
  }, [status, probe]);

  if (status === 'online' && !showBack) return null;

  const back = status === 'online';
  const retry = async () => {
    setChecking(true);
    await probe();
    setChecking(false);
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed inset-x-0 bottom-0 z-[9999] flex items-center gap-3 px-4 py-3 text-sm text-white shadow-lg sm:inset-x-auto sm:bottom-4 sm:left-1/2 sm:-translate-x-1/2 sm:rounded-2xl sm:max-w-xl ${
        back ? 'bg-emerald-600' : status === 'offline' ? 'bg-slate-700' : 'bg-amber-700'
      }`}
    >
      {back ? (
        <CheckCircle2 className="h-5 w-5 shrink-0" aria-hidden />
      ) : status === 'offline' ? (
        <CloudOff className="h-5 w-5 shrink-0" aria-hidden />
      ) : (
        <ServerCrash className="h-5 w-5 shrink-0" aria-hidden />
      )}
      <div className="min-w-0 flex-1">
        <p className="font-bold">
          {back ? 'Back online' : status === 'offline' ? 'You are offline' : 'Cannot reach Sabhijude right now'}
        </p>
        {!back && (
          <p className="text-xs text-white/85">
            {status === 'offline'
              ? 'Check your Wi-Fi or mobile data. In an emergency, call 112.'
              : 'Our server is not responding. We will keep trying.'}
          </p>
        )}
      </div>
      {!back && (
        <button
          type="button"
          onClick={() => void retry()}
          disabled={checking}
          className="flex shrink-0 items-center gap-1 rounded-lg bg-white/15 px-3 py-1.5 text-xs font-bold hover:bg-white/25 disabled:opacity-60"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${checking ? 'animate-spin' : ''}`} aria-hidden />
          Retry
        </button>
      )}
    </div>
  );
}
