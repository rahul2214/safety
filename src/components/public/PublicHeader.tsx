'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Phone, ArrowRight } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';

export const PUBLIC_NAV = [
  { href: '/', label: 'Home' },
  { href: '/emergency', label: 'Emergency SOS' },
  { href: '/feed', label: 'Live feed' },
  { href: '/safety-measures', label: 'Helplines' },
  { href: '/resources', label: 'Safety guides' },
  { href: '/about', label: 'About' },
  { href: '/organization-request', label: 'For campuses' },
];

export function PublicHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="sticky top-0 z-40 w-full">
      {/* Emergency strip: always one tap away */}
      <div className="bg-ink text-white">
        <div className="public-container flex h-9 items-center justify-between gap-4 text-[12px]">
          <span className="hidden sm:inline text-white/70">In immediate danger? Call for help now.</span>
          <div className="flex items-center gap-4 sm:gap-5 font-semibold">
            <a href="tel:112" className="flex items-center gap-1.5 text-white hover:text-coral transition-colors">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-red-500 animate-ring" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
              </span>
              Police 112
            </a>
            <a href="tel:1091" className="text-white/80 hover:text-white transition-colors">Women 1091</a>
            <a href="tel:181" className="hidden sm:inline text-white/80 hover:text-white transition-colors">Distress 181</a>
          </div>
        </div>
      </div>

      <div
        className={`border-b transition-all duration-300 ${
          scrolled ? 'border-slate-200 bg-white/90 backdrop-blur-md shadow-[0_4px_20px_-12px_rgba(11,22,48,0.25)]' : 'border-transparent bg-white'
        }`}
      >
        <div className="public-container flex h-16 items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2.5 group" aria-label="Sabhijude home">
            <Logo size={34} />
            <span className="font-display text-[19px] font-extrabold tracking-tight text-ink">Sabhijude</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1" aria-label="Main">
            {PUBLIC_NAV.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative rounded-full px-4 py-2 text-[14px] font-medium transition-colors ${
                    active ? 'text-ink bg-mist' : 'text-slate-600 hover:text-ink hover:bg-mist'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="hidden sm:inline-flex rounded-full px-4 py-2 text-[14px] font-semibold text-ink hover:bg-mist transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 sm:px-5 py-2.5 text-[13px] sm:text-[14px] font-semibold text-white hover:bg-ink-soft transition-colors"
            >
              Get started <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="lg:hidden ml-1 p-2 rounded-full text-ink hover:bg-mist transition-colors"
              aria-label="Toggle navigation menu"
              aria-expanded={open}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {open && (
          <div className="lg:hidden border-t border-slate-100 bg-white">
            <nav className="public-container py-4 flex flex-col gap-1" aria-label="Mobile">
              {PUBLIC_NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-xl px-4 py-3 text-[15px] font-medium ${
                    pathname === item.href ? 'bg-brand-tint text-brand' : 'text-ink hover:bg-mist'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <Link href="/login" className="rounded-xl px-4 py-3 text-[15px] font-medium text-ink hover:bg-mist sm:hidden">
                Log in
              </Link>
              <div className="grid grid-cols-2 gap-2 pt-3 mt-2 border-t border-slate-100">
                <a href="tel:112" className="flex items-center justify-center gap-2 rounded-xl bg-red-600 py-3 text-sm font-semibold text-white">
                  <Phone className="h-4 w-4" /> Call 112
                </a>
                <a href="tel:1091" className="flex items-center justify-center gap-2 rounded-xl bg-coral-tint py-3 text-sm font-semibold text-red-700">
                  <Phone className="h-4 w-4" /> Call 1091
                </a>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
