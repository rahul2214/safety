'use client';

import Link from 'next/link';
import { Droplet, HeartHandshake } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

const JOIN_HREF = `/signup?redirect=${encodeURIComponent('/blood')}`;
const LOGIN_HREF = `/login?redirect=${encodeURIComponent('/blood')}`;

/**
 * The invitation to join, shown under a shared blood request. Only for visitors who are
 * signed out: hidden while the session is still being checked, so a member never sees it
 * flash, and never shown to someone already signed in.
 */
export function JoinCard() {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading || isAuthenticated) return null;

  return (
    <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-6">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-red-600">
          <HeartHandshake className="h-5 w-5" />
        </span>
        <h2 className="text-lg font-bold text-ink">Be there for the next one</h2>
      </div>
      <ul className="mt-4 space-y-2 text-sm text-slate-700">
        <li className="flex gap-2">
          <Droplet className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
          See open blood requests from people near you, right on your home screen.
        </li>
        <li className="flex gap-2">
          <Droplet className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
          Add your blood group to your profile, and ask for blood yourself if your family ever needs it.
        </li>
        <li className="flex gap-2">
          <Droplet className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
          Free to join, along with safety alerts and trusted contacts for your family.
        </li>
      </ul>
      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
        <Link
          href={JOIN_HREF}
          className="inline-flex flex-1 items-center justify-center rounded-xl bg-ink px-4 py-3 text-sm font-bold text-white transition hover:opacity-90"
        >
          Join Sabhijude
        </Link>
        <Link
          href={LOGIN_HREF}
          className="inline-flex flex-1 items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-bold text-ink transition hover:border-slate-400"
        >
          I already have an account
        </Link>
      </div>
    </section>
  );
}
