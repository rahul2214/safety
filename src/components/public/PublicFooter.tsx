import React from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';

const COLUMNS = [
  {
    title: 'Safety Tools',
    links: [
      { href: '/emergency', label: 'Emergency SOS' },
      { href: '/feed', label: 'Community Safety Feed' },
      { href: '/safety-measures', label: 'Helplines Directory' },
      { href: '/resources', label: 'Safety & Legal Guides' },
      { href: '/map', label: 'Interactive Safety Map' },
    ],
  },
  {
    title: 'Organizations',
    links: [
      { href: '/organization-request', label: 'Campus & Workplace Desks' },
      { href: '/org/login', label: 'Security Desk Portal' },
      { href: '/admin/login', label: 'Administration Console' },
    ],
  },
  {
    title: 'Platform & Trust',
    links: [
      { href: '/about', label: 'About Sabhijude' },
      { href: '/privacy', label: 'Privacy Policy & Safeguards' },
      { href: '/support', label: 'Help Center & Contact' },
      { href: '/signup', label: 'Create Free Account' },
      { href: '/login', label: 'Member Log In' },
    ],
  },
];

const HELPLINES = [
  { n: '112', l: 'National Emergency (Police/Fire/Med)' },
  { n: '1091', l: 'Women Safety Helpline' },
  { n: '181', l: 'Women in Distress' },
  { n: '1930', l: 'Cyber Crime Helpline' },
];

export function PublicFooter() {
  return (
    <footer className="bg-ink text-white" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Sabhijude Footer
      </h2>
      <div className="public-container pt-16 pb-10">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4 space-y-5">
            <Link href="/" className="inline-flex items-center gap-2.5 group" aria-label="Sabhijude Home">
              <span className="rounded-xl bg-white p-1">
                <Logo size={30} />
              </span>
              <span className="font-display text-xl font-extrabold tracking-tight">Sabhijude</span>
            </Link>
            <p className="text-[15px] leading-relaxed text-white/70 max-w-sm">
              An all-in-one personal and community safety platform for everyone — individuals, students, workplaces, and neighborhoods.
              Rapid SOS alerts, live GPS location sharing, discreet exit tools, and verified community defense.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-ink hover:bg-brand-tint transition-colors"
              >
                Join for free <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/emergency"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
              >
                Emergency SOS
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {COLUMNS.map((col) => (
              <div key={col.title} className="space-y-4">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/50">{col.title}</p>
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
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/50">24/7 Helplines (India)</p>
            <ul className="grid grid-cols-2 gap-2">
              {HELPLINES.map((h) => (
                <li key={h.n}>
                  <a
                    href={`tel:${h.n}`}
                    className="block rounded-2xl border border-white/10 bg-white/5 px-3.5 py-3 hover:border-white/30 hover:bg-white/10 transition-colors"
                    aria-label={`Call ${h.l}: ${h.n}`}
                  >
                    <span className={`block font-display text-xl font-extrabold ${h.n === '112' ? 'text-coral' : 'text-white'}`}>
                      {h.n}
                    </span>
                    <span className="block text-[11px] text-white/60 leading-tight">{h.l}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between gap-3 text-[13px] text-white/50">
          <p>&copy; {new Date().getFullYear()} Sabhijude. Open, free, and privacy-protected for everyone, always.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <span>&bull;</span>
            <Link href="/support" className="hover:text-white transition-colors">
              Help &amp; Support
            </Link>
            <span>&bull;</span>
            <span>Made in India</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
