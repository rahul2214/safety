'use client';

import { useState } from 'react';
import { Check, Share2 } from 'lucide-react';

/**
 * Passes the request on from its public page: the share sheet where there is one,
 * otherwise the message is copied for pasting into WhatsApp or SMS.
 */
export function ShareButton({ title, text }: { title: string; text: string }) {
  const [state, setState] = useState<'idle' | 'copied' | 'failed'>('idle');

  const onClick = async () => {
    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({ title, text });
        return;
      } catch (err: any) {
        if (err?.name === 'AbortError') return;
      }
    }
    try {
      await navigator.clipboard.writeText(text);
      setState('copied');
    } catch {
      setState('failed');
    }
    setTimeout(() => setState('idle'), 2500);
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-ink transition hover:border-slate-300"
    >
      {state === 'copied' ? <Check className="h-4 w-4 text-emerald-600" /> : <Share2 className="h-4 w-4" />}
      <span aria-live="polite">{state === 'copied' ? 'Copied' : state === 'failed' ? 'Could not share' : 'Share'}</span>
    </button>
  );
}
