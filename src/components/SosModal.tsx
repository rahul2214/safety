'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';
import { SosDemo, HelplineLinks } from '@/components/SosDemo';

interface SosModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * The website's SOS button opens this: a demo of how SOS works in the mobile app. The website
 * itself sends no SOS. The helpline numbers stay callable for anyone who needs help now.
 */
export function SosModal({ isOpen, onClose }: SosModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/70 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="sos-showcase-title"
    >
      <div
        className="relative max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white p-5 sm:p-7 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-ink cursor-pointer"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-red-600">Emergency SOS</p>
        <h2 id="sos-showcase-title" className="mt-1 pr-8 font-display text-2xl font-extrabold tracking-tight text-ink">
          One tap alerts the people you trust
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          See how SOS works in the Sabhijude mobile app.
        </p>

        <div className="mt-6">
          <SosDemo />
        </div>

        <div className="mt-6 rounded-2xl bg-red-50 p-4">
          <p className="mb-2.5 text-sm font-bold text-red-800">In danger right now? Call for help directly.</p>
          <HelplineLinks />
        </div>

        <p className="mt-4 text-center text-xs text-slate-500">
          <Link href="/emergency" onClick={onClose} className="font-semibold text-brand hover:underline">
            Learn more about SOS
          </Link>
        </p>
      </div>
    </div>
  );
}
