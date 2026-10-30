import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Phone, CheckCircle2 } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';

interface AuthLayoutProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  badge?: React.ReactNode;
  children: React.ReactNode;
}

const POINTS = [
  'One-tap SOS with your live location',
  'Anonymous community safety alerts',
  'Your data is never sold — ever',
];

/** Split-screen shell shared by /login and /signup. */
export function AuthLayout({ title, subtitle, badge, children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-white text-ink lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      {/* Brand panel */}
      <aside className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-ink text-white p-12 xl:p-16">
        <div aria-hidden className="absolute -top-32 -right-32 h-[28rem] w-[28rem] rounded-full bg-brand/40 blur-3xl" />
        <div aria-hidden className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-coral/25 blur-3xl" />

        <Link href="/" className="relative inline-flex items-center gap-2.5">
          <span className="rounded-xl bg-white p-1"><Logo size={30} /></span>
          <span className="font-display text-xl font-extrabold tracking-tight">Sabhijude</span>
        </Link>

        <div className="relative space-y-8 max-w-md">
          <h2 className="font-display text-4xl xl:text-5xl leading-[1.08] font-extrabold tracking-[-0.03em]">
            Safety is better <span className="text-coral">together.</span>
          </h2>
          <ul className="space-y-4">
            {POINTS.map((p) => (
              <li key={p} className="flex items-center gap-3 text-white/80 text-[15px]">
                <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                {p}
              </li>
            ))}
          </ul>
        </div>

        <a
          href="tel:112"
          className="relative flex items-center justify-between rounded-2xl border border-white/15 bg-white/5 px-5 py-4 hover:bg-white/10 transition"
        >
          <span className="text-sm text-white/70">In danger? You don&rsquo;t need an account.</span>
          <span className="inline-flex items-center gap-2 rounded-full bg-red-600 px-4 py-2 text-sm font-semibold">
            <Phone className="h-4 w-4" /> 112
          </span>
        </a>
      </aside>

      {/* Form side */}
      <div className="flex min-h-screen flex-col">
        <div className="flex items-center justify-between px-5 sm:px-10 h-16">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-ink transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span className="lg:hidden inline-flex items-center gap-2"><Logo size={26} /> Sabhijude</span>
            <span className="hidden lg:inline">Back to home</span>
          </Link>
          <a href="tel:112" className="lg:hidden inline-flex items-center gap-1.5 rounded-full bg-red-600 px-3.5 py-1.5 text-xs font-semibold text-white">
            <Phone className="h-3.5 w-3.5" /> Call 112
          </a>
          {badge && <span className="hidden lg:inline-flex">{badge}</span>}
        </div>

        <main className="flex-1 flex items-center justify-center px-5 sm:px-10 py-10">
          <div className="w-full max-w-md">
            <div className="mb-8 space-y-2">
              {badge && <div className="lg:hidden mb-3">{badge}</div>}
              <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-[-0.02em] text-ink">{title}</h1>
              {subtitle && <p className="text-slate-600 leading-relaxed">{subtitle}</p>}
            </div>
            {children}
          </div>
        </main>

        <footer className="px-5 sm:px-10 py-5 text-xs text-slate-400 flex flex-wrap justify-between gap-2">
          <span>&copy; {new Date().getFullYear()} Sabhijude</span>
          <span className="flex gap-4">
            <Link href="/about" className="hover:text-ink">About</Link>
            <Link href="/safety-measures" className="hover:text-ink">Helplines &amp; rights</Link>
          </span>
        </footer>
      </div>
    </div>
  );
}
