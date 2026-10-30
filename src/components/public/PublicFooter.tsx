import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';

const COLUMNS = [
  {
    title: 'Product',
    links: [
      { href: '/feed', label: 'Live safety feed' },
      { href: '/safety-measures', label: 'Safety guide' },
      { href: '/signup', label: 'Create free account' },
      { href: '/login', label: 'Member log in' },
    ],
  },
  {
    title: 'Organizations',
    links: [
      { href: '/organization-request', label: 'Bring Sabhijude to campus' },
      { href: '/org/login', label: 'Security desk log in' },
      { href: '/admin/login', label: 'Admin portal' },
    ],
  },
  {
    title: 'Company',
    links: [
      { href: '/about', label: 'About & mission' },
      { href: '/feed', label: 'Community reports' },
    ],
  },
];

const HELPLINES = [
  { n: '112', l: 'National emergency' },
  { n: '1091', l: 'Women helpline' },
  { n: '181', l: 'Women in distress' },
  { n: '1930', l: 'Cyber crime' },
];

export function PublicFooter() {
  return (
    <footer className="bg-ink text-white">
      <div className="public-container pt-16 pb-10">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4 space-y-5">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <span className="rounded-xl bg-white p-1"><Logo size={30} /></span>
              <span className="font-display text-xl font-extrabold tracking-tight">Sabhijude</span>
            </Link>
            <p className="text-[15px] leading-relaxed text-white/65 max-w-sm">
              A women-first safety network. Fast SOS, discreet exits, and a community that looks out for each other.
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-ink hover:bg-brand-tint transition-colors"
            >
              Join for free <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="lg:col-span-5 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {COLUMNS.map((col) => (
              <div key={col.title} className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-[0.14em] text-white/45">{col.title}</h4>
                <ul className="space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="text-[14px] text-white/80 hover:text-white transition-colors">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-[0.14em] text-white/45">24/7 helplines (India)</h4>
            <ul className="grid grid-cols-2 gap-2">
              {HELPLINES.map((h) => (
                <li key={h.n}>
                  <a
                    href={`tel:${h.n}`}
                    className="block rounded-2xl border border-white/10 bg-white/5 px-3.5 py-3 hover:border-white/30 hover:bg-white/10 transition-colors"
                  >
                    <span className={`block font-display text-xl font-extrabold ${h.n === '112' ? 'text-coral' : 'text-white'}`}>{h.n}</span>
                    <span className="block text-[11px] text-white/55">{h.l}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between gap-3 text-[13px] text-white/45">
          <p>&copy; {new Date().getFullYear()} Sabhijude. Free for every woman, always.</p>
          <p>Made in India with care.</p>
        </div>
      </div>
    </footer>
  );
}
