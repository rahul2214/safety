'use client';

import React, { useEffect, useRef, useState } from 'react';
import { AlertTriangle, CheckCircle2, MapPin, MessageSquare, Play, RotateCcw, Users } from 'lucide-react';

/**
 * A walk-through of the mobile app's SOS, for the website. It is a simulation only: it reads
 * no location, loads no contacts and sends nothing. SOS itself works in the mobile app.
 */
type Stage = 'idle' | 'countdown' | 'locating' | 'alerting' | 'sent';

const SAMPLE_CONTACTS = ['Amma', 'Priya (friend)', 'Ravi (brother)'];

export function SosDemo({ compact = false }: { compact?: boolean }) {
  const [stage, setStage] = useState<Stage>('idle');
  const [count, setCount] = useState(3);
  const [alerted, setAlerted] = useState(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clear = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };
  useEffect(() => clear, []);

  const at = (ms: number, fn: () => void) => timers.current.push(setTimeout(fn, ms));

  const play = () => {
    clear();
    setStage('countdown');
    setCount(3);
    setAlerted(0);
    at(1000, () => setCount(2));
    at(2000, () => setCount(1));
    at(3000, () => setStage('locating'));
    at(4400, () => setStage('alerting'));
    SAMPLE_CONTACTS.forEach((_, i) => at(4900 + i * 500, () => setAlerted(i + 1)));
    at(4900 + SAMPLE_CONTACTS.length * 500, () => setStage('sent'));
  };

  const reset = () => {
    clear();
    setStage('idle');
    setAlerted(0);
  };

  const steps: { key: Stage[]; icon: React.ElementType; label: string }[] = [
    { key: ['countdown'], icon: AlertTriangle, label: '3-second countdown, so a slip can be cancelled' },
    { key: ['locating'], icon: MapPin, label: 'Your exact location is captured' },
    { key: ['alerting', 'sent'], icon: MessageSquare, label: 'Trusted contacts get a message with a live map link' },
  ];
  const order: Stage[] = ['idle', 'countdown', 'locating', 'alerting', 'sent'];
  const reached = (s: Stage[]) => order.indexOf(stage) >= Math.min(...s.map((x) => order.indexOf(x)));

  return (
    <div className={`grid gap-6 ${compact ? '' : 'md:grid-cols-2 md:items-center'}`}>
      {/* The phone screen */}
      <div className="mx-auto w-full max-w-[260px] rounded-[2.25rem] border-[6px] border-ink bg-ink p-1.5 shadow-xl">
        <div className="relative flex h-[340px] flex-col items-center justify-center overflow-hidden rounded-[1.75rem] bg-[#141420] px-5 text-center text-white">
          <span className="absolute left-3 top-3 rounded-full bg-white/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white/70">
            Demo
          </span>

          {stage === 'idle' && (
            <>
              <button
                type="button"
                onClick={play}
                className="relative flex h-32 w-32 items-center justify-center rounded-full bg-red-600 text-2xl font-black tracking-wider shadow-[0_0_0_10px_rgba(220,38,38,0.18)] transition hover:bg-red-700 cursor-pointer"
                aria-label="Play the SOS demo"
              >
                SOS
              </button>
              <p className="mt-5 text-xs text-white/60">Tap to see what happens</p>
            </>
          )}

          {stage === 'countdown' && (
            <>
              <div className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-red-500 bg-red-500/10 animate-pulse">
                <span className="text-6xl font-black text-red-500">{count}</span>
              </div>
              <p className="mt-5 text-sm font-bold">Sending SOS…</p>
              <p className="text-[11px] text-white/50">Cancel anytime during the countdown</p>
            </>
          )}

          {stage === 'locating' && (
            <>
              <MapPin className="h-12 w-12 animate-bounce text-red-400" />
              <p className="mt-4 text-sm font-bold">Finding your location</p>
              <p className="font-mono text-[11px] text-white/50">17.3850, 78.4867 (±8 m)</p>
            </>
          )}

          {(stage === 'alerting' || stage === 'sent') && (
            <div className="w-full space-y-2 text-left">
              <p className="text-center text-sm font-bold">
                {stage === 'sent' ? 'Your circle has been alerted' : 'Alerting your circle…'}
              </p>
              {SAMPLE_CONTACTS.map((name, i) => (
                <div
                  key={name}
                  className={`flex items-center justify-between rounded-xl px-3 py-2 text-xs transition ${
                    i < alerted ? 'bg-emerald-500/15 text-white' : 'bg-white/5 text-white/40'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Users className="h-3.5 w-3.5" /> {name}
                  </span>
                  {i < alerted && <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
                </div>
              ))}
              {stage === 'sent' && (
                <button
                  type="button"
                  onClick={reset}
                  className="mx-auto mt-2 flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-semibold hover:bg-white/15 cursor-pointer"
                >
                  <RotateCcw className="h-3 w-3" /> Watch again
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* What is happening, step by step */}
      <div className="space-y-3">
        <ol className="space-y-2.5">
          {steps.map((s, i) => {
            const done = stage !== 'idle' && reached(s.key);
            return (
              <li
                key={s.label}
                className={`flex items-start gap-3 rounded-2xl border p-3 transition ${
                  done ? 'border-red-200 bg-red-50' : 'border-slate-200 bg-white'
                }`}
              >
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${
                    done ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  <s.icon className="h-4 w-4" />
                </span>
                <span className="pt-1 text-sm text-ink">
                  <span className="font-semibold text-slate-400">{i + 1}. </span>
                  {s.label}
                </span>
              </li>
            );
          })}
        </ol>
        {stage === 'idle' && (
          <button
            type="button"
            onClick={play}
            className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white hover:bg-ink-soft cursor-pointer"
          >
            <Play className="h-4 w-4" /> Play the demo
          </button>
        )}
        <p className="text-xs text-slate-500">
          This is a demonstration. Nothing is sent from the website: SOS works in the Sabhijude mobile app.
        </p>
      </div>
    </div>
  );
}

/** Real helplines. Calling them is a phone call, not the SOS feature, so they stay live. */
export function HelplineLinks({ dark = false }: { dark?: boolean }) {
  const lines = [
    { number: '112', label: 'Police / emergency' },
    { number: '1091', label: 'Women helpline' },
    { number: '181', label: 'Women in distress' },
  ];
  return (
    <div className="grid grid-cols-3 gap-2">
      {lines.map((l) => (
        <a
          key={l.number}
          href={`tel:${l.number}`}
          className={`flex flex-col items-center rounded-xl border p-2.5 text-center transition ${
            dark
              ? 'border-white/10 bg-white/5 hover:bg-white/10'
              : 'border-slate-200 bg-white hover:border-red-300 hover:bg-red-50'
          }`}
        >
          <span className={`text-lg font-extrabold ${dark ? 'text-red-400' : 'text-red-600'}`}>{l.number}</span>
          <span className={`text-[10.5px] ${dark ? 'text-white/60' : 'text-slate-500'}`}>{l.label}</span>
        </a>
      ))}
    </div>
  );
}
