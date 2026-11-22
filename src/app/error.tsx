'use client'; // Error boundaries must be Client Components

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AlertTriangle, CloudOff, Home, Phone, RefreshCw } from 'lucide-react';

/**
 * Shown in place of a page that failed to load or crashed, inside the normal site layout, so
 * the navigation and the SOS button stay usable. Tells a lost connection apart from a fault.
 */
export default function Error({ error, retry }: { error: unknown; retry: () => void }) {
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    console.error(error);
    setOffline(!navigator.onLine);
    const on = () => setOffline(false);
    const off = () => setOffline(true);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => {
      window.removeEventListener('online', on);
      window.removeEventListener('offline', off);
    };
  }, [error]);

  const digest = error instanceof Error ? (error as Error & { digest?: string }).digest : undefined;

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-6 py-16 text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-950/40">
        {offline ? <CloudOff className="h-8 w-8" aria-hidden /> : <AlertTriangle className="h-8 w-8" aria-hidden />}
      </div>
      <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
        {offline ? 'You are offline' : 'This page could not load'}
      </h1>
      <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
        {offline
          ? 'Check your Wi-Fi or mobile data, then try again.'
          : 'Something went wrong on our side. Trying again usually fixes it.'}
      </p>

      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={() => retry()}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-700"
        >
          <RefreshCw className="h-4 w-4" aria-hidden /> Try again
        </button>
        <Link
          href="/"
          className="flex items-center gap-2 rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 dark:border-slate-600 dark:text-slate-200"
        >
          <Home className="h-4 w-4" aria-hidden /> Home
        </Link>
      </div>

      <a href="tel:112" className="mt-8 flex items-center gap-2 text-sm font-bold text-rose-600">
        <Phone className="h-4 w-4" aria-hidden /> In danger? Call 112
      </a>
      {digest && <p className="mt-4 text-xs text-slate-400">Reference: {digest}</p>}
    </main>
  );
}
