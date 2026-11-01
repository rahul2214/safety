'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Phone,
  ArrowRight,
  Users,
  Lock,
  CheckCircle2,
  Radio,
  MapPin,
  Building2,
  EyeOff,
  BellRing,
  Navigation,
  Sparkles,
  HelpCircle,
  ChevronDown,
} from 'lucide-react';
import { PostCard, type PostItem, getCategoryName } from '@/components/PostCard';
import { type Category } from '@/lib/api-client';
import { PostCardSkeleton } from '@/components/ui/Skeleton';
import { HOMEPAGE_FAQS } from '@/lib/seo-schemas';

interface PublicLandingProps {
  posts?: PostItem[];
  categories?: Category[];
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  onOpenSos: () => void;
  onOpenFakeCall: () => void;
}

const FEED_FILTERS = ['All', 'Harassment', 'Stalking', 'Lighting', 'Unsafe Area'];

const HELPLINES = [
  { number: '112', name: 'National Emergency', detail: 'Police, fire and ambulance', tone: 'red' },
  { number: '1091', name: 'Women Helpline', detail: 'Rapid response for women', tone: 'brand' },
  { number: '181', name: 'Women in Distress', detail: 'Domestic violence & shelter', tone: 'brand' },
  { number: '1098', name: 'Childline', detail: 'Child protection & rescue', tone: 'brand' },
  { number: '1930', name: 'Cyber Crime', detail: 'Online harassment & fraud', tone: 'brand' },
];

export function PublicLanding({
  posts = [],
  loading = false,
  error = null,
  onRetry,
  onOpenSos,
  onOpenFakeCall,
}: PublicLandingProps) {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredPosts = (posts || []).filter((p) => {
    if (selectedCategory === 'All') return true;
    const cat = getCategoryName(p.category || (p as any).categoryName);
    return cat.toLowerCase() === selectedCategory.toLowerCase();
  });

  return (
    <div className="bg-white">
      {error && (
        <div className="bg-amber-50 border-b border-amber-200">
          <div className="public-container py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-[13px] text-amber-900">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
              <span>
                <strong>Working offline.</strong> Live reports can&rsquo;t load right now — SOS, fake call and helplines still work.
              </span>
            </div>
            {onRetry && (
              <button
                onClick={onRetry}
                className="rounded-full bg-amber-600 hover:bg-amber-700 px-4 py-1.5 text-xs font-semibold text-white transition shrink-0"
              >
                Try again
              </button>
            )}
          </div>
        </div>
      )}

      {/* ─── HERO ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 right-[-10%] h-[560px] w-[560px] rounded-full bg-brand/10 blur-3xl" />
          <div className="absolute top-40 left-[-15%] h-[420px] w-[420px] rounded-full bg-coral/10 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(#0b16300d_1px,transparent_1px)] [background-size:22px_22px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
        </div>

        <div className="public-container relative grid lg:grid-cols-12 gap-14 lg:gap-8 items-center pt-14 pb-20 sm:pt-20 lg:pt-24 lg:pb-28">
          <div className="lg:col-span-7 space-y-8">
            <h1 className="display-1">
              Feel safe,{' '}
              <span className="relative whitespace-nowrap">
                <span className="relative z-10 bg-gradient-to-r from-brand to-coral bg-clip-text text-transparent">wherever</span>
                <svg aria-hidden viewBox="0 0 300 20" className="absolute -bottom-2 left-0 w-full h-3 text-coral/40" preserveAspectRatio="none">
                  <path d="M2 15 C 80 2, 220 2, 298 13" stroke="currentColor" strokeWidth="6" fill="none" strokeLinecap="round" />
                </svg>
              </span>{' '}
              you go.
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-xl">
              One tap sends your live location to the people you trust. A fake call gets you out of uncomfortable moments. And a community of women keeps each other informed.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <button type="button" onClick={onOpenSos} className="btn-sos text-base px-7 py-4" aria-label="Send Emergency SOS Alert">
                <ShieldAlert className="h-5 w-5" aria-hidden="true" />
                Send SOS now
              </button>
              <Link href="/signup" className="btn-brand text-base px-7 py-4 bg-ink hover:bg-ink-soft shadow-none">
                Create free account
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-2 text-[14px] text-slate-600">
              {['Location shared only when you choose', 'Anonymous reporting', 'Works in any browser', 'For individuals, students & workplaces'].map((t) => (
                <span key={t} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" aria-hidden="true" />
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Phone mockup */}
          <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
            <PhoneMockup onOpenSos={onOpenSos} onOpenFakeCall={onOpenFakeCall} />
          </div>
        </div>
      </section>

      {/* ─── HELPLINE MARQUEE ─────────────────────────────────── */}
      <section className="border-y border-slate-200 bg-mist overflow-hidden" aria-label="Emergency helplines">
        <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
          {[...HELPLINES, ...HELPLINES, ...HELPLINES, ...HELPLINES].map((h, i) => (
            <a
              key={i}
              href={`tel:${h.number}`}
              className="flex items-center gap-3 px-8 py-5 text-[15px] whitespace-nowrap group"
              aria-hidden={i >= HELPLINES.length}
              tabIndex={i >= HELPLINES.length ? -1 : 0}
            >
              <span className={`font-display text-2xl font-extrabold ${h.tone === 'red' ? 'text-red-600' : 'text-ink'}`}>{h.number}</span>
              <span className="text-slate-500 group-hover:text-ink transition-colors">{h.name}</span>
              <span className="ml-5 h-1.5 w-1.5 rounded-full bg-slate-300" />
            </a>
          ))}
        </div>
      </section>

      {/* ─── FEATURES (BENTO) ─────────────────────────────────── */}
      <section className="py-24 sm:py-32">
        <div className="public-container space-y-14">
          <div className="max-w-2xl space-y-4">
            <span className="eyebrow"><span className="h-px w-6 bg-brand" />What you get</span>
            <h2 className="display-2">Emergency SOS &amp; instant safety tools built for seconds that matter.</h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              Four simple tools that work together — from the first feeling that something is off, to getting help fast.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-6">
            {/* SOS */}
            <div className="md:col-span-4 relative overflow-hidden rounded-3xl bg-ink p-8 sm:p-10 text-white min-h-[340px] flex flex-col justify-between">
              <div aria-hidden className="absolute -right-16 -top-16 h-72 w-72 rounded-full bg-red-500/25 blur-3xl" />
              <div className="relative space-y-4 max-w-md">
                <div className="h-12 w-12 rounded-2xl bg-red-500 flex items-center justify-center">
                  <ShieldAlert className="h-6 w-6" />
                </div>
                <h3 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">One-tap SOS with live location</h3>
                <p className="text-white/70 leading-relaxed">
                  A 3-second safety countdown prevents accidental alerts. Then your exact location goes to your trusted contacts
                  over WhatsApp and SMS — even on a weak connection.
                </p>
              </div>
              <button type="button" onClick={onOpenSos} className="relative mt-8 self-start inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-coral transition-colors">
                Try the SOS flow <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            {/* Fake call */}
            <div className="md:col-span-2 rounded-3xl bg-emerald-50 border border-emerald-100 p-8 flex flex-col justify-between min-h-[340px]">
              <div className="space-y-4">
                <div className="h-12 w-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center">
                  <Phone className="h-6 w-6" />
                </div>
                <h3 className="font-display text-2xl font-bold tracking-tight text-ink">A fake call to walk away</h3>
                <p className="text-slate-600 leading-relaxed">
                  A realistic incoming call from &ldquo;Dad&rdquo; gives you a calm reason to leave a cab, lift or crowd.
                </p>
              </div>
              <button type="button" onClick={onOpenFakeCall} className="mt-6 self-start inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-900">
                Ring my phone <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            {/* Community */}
            <div className="md:col-span-3 card-public p-8 flex flex-col justify-between min-h-[280px]">
              <div className="space-y-4">
                <div className="h-12 w-12 rounded-2xl bg-brand-tint text-brand flex items-center justify-center">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="font-display text-2xl font-bold tracking-tight text-ink">Anonymous community alerts</h3>
                <p className="text-slate-600 leading-relaxed">
                  Flag a dark street, a stalker, or a harassment hotspot without revealing who you are. Moderators verify every report.
                </p>
              </div>
              <Link href="/feed" className="mt-6 self-start inline-flex items-center gap-2 text-sm font-semibold text-brand hover:text-brand-deep">
                See the live feed <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Campus */}
            <div className="md:col-span-3 rounded-3xl bg-coral-tint border border-coral/15 p-8 flex flex-col justify-between min-h-[280px]">
              <div className="space-y-4">
                <div className="h-12 w-12 rounded-2xl bg-coral text-white flex items-center justify-center">
                  <Building2 className="h-6 w-6" />
                </div>
                <h3 className="font-display text-2xl font-bold tracking-tight text-ink">Campus &amp; workplace security desks</h3>
                <p className="text-slate-600 leading-relaxed">
                  Alerts from students and staff reach your own security team in real time — no extra hardware needed.
                </p>
              </div>
              <Link href="/organization-request" className="mt-6 self-start inline-flex items-center gap-2 text-sm font-semibold text-red-700 hover:text-red-900">
                Bring it to your campus <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─────────────────────────────────────── */}
      <section className="bg-mist py-24 sm:py-32">
        <div className="public-container space-y-14">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <span className="eyebrow">How it works</span>
            <h2 className="display-2">Ready in under two minutes.</h2>
          </div>

          <ol className="grid gap-6 md:grid-cols-3 relative">
            <div aria-hidden className="hidden md:block absolute top-8 left-[16%] right-[16%] h-px border-t-2 border-dashed border-slate-300" />
            {[
              { icon: Users, title: 'Add your trusted circle', body: 'Pick the family and friends who should hear from you first.' },
              { icon: BellRing, title: 'Tap SOS when you need it', body: 'Your live location and a clear message reach them instantly.' },
              { icon: Navigation, title: 'Stay informed on the go', body: 'Check community alerts before you head out, and share what you see.' },
            ].map((s, i) => (
              <li key={s.title} className="relative text-center space-y-4 px-4">
                <div className="relative mx-auto h-16 w-16 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center">
                  <s.icon className="h-7 w-7 text-brand" />
                  <span className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-ink text-white text-xs font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                </div>
                <h3 className="font-display text-xl font-bold text-ink">{s.title}</h3>
                <p className="text-slate-600 leading-relaxed max-w-xs mx-auto">{s.body}</p>
              </li>
            ))}
          </ol>

          <div className="flex justify-center">
            <Link href="/signup" className="btn-brand">
              Set up my circle <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── LIVE FEED PREVIEW ────────────────────────────────── */}
      <section className="py-24 sm:py-32">
        <div className="public-container space-y-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-4 max-w-xl">
              <span className="eyebrow">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-red-500 animate-ring" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
                </span>
                Live from the community
              </span>
              <h2 className="display-2">Verified community safety alerts &amp; women&rsquo;s incident reports.</h2>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-4 px-4 lg:mx-0 lg:px-0">
              {FEED_FILTERS.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition ${
                    selectedCategory === cat ? 'bg-ink text-white' : 'bg-mist text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="min-h-[280px]">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <PostCardSkeleton />
                <PostCardSkeleton />
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="rounded-3xl border-2 border-dashed border-slate-200 p-12 text-center space-y-3">
                <Radio className="h-8 w-8 text-slate-400 mx-auto" />
                <h4 className="font-display text-lg font-bold text-ink">No reports in this category yet</h4>
                <p className="text-slate-500 max-w-sm mx-auto">Every report is checked by moderators before it appears here.</p>
                <Link href="/report" className="inline-flex mt-2 btn-brand py-2.5 text-sm">
                  Report something anonymously
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filteredPosts.slice(0, 4).map((post, index) => (
                  <PostCard key={post.uuid || (post as any).id || `landing-post-${index}`} post={post} />
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-center">
            <Link href="/feed" className="btn-ghost">
              Open the full feed <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── PRIVACY ──────────────────────────────────────────── */}
      <section className="pb-24 sm:pb-32">
        <div className="public-container">
          <div className="rounded-[2rem] bg-gradient-to-br from-brand-tint via-white to-coral-tint border border-slate-200 p-8 sm:p-14 grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5 space-y-4">
              <span className="eyebrow"><Lock className="h-3.5 w-3.5" /> Privacy by design</span>
              <h2 className="display-2">Private live location sharing: your safety app shouldn&rsquo;t track you.</h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                We built Sabhijude so you stay in control — of your location, your identity and your data.
              </p>
            </div>
            <div className="lg:col-span-7 grid sm:grid-cols-3 gap-4">
              {[
                { icon: MapPin, title: 'No background tracking', body: 'Location is read only when you send an SOS or choose to share.' },
                { icon: EyeOff, title: 'Post anonymously', body: 'Reports are separated from your profile. No one sees who you are.' },
                { icon: ShieldCheck, title: 'Never sold', body: 'No ads, no data brokers, no paywalls. Ever.' },
              ].map((p) => (
                <div key={p.title} className="rounded-2xl bg-white/80 backdrop-blur border border-white p-6 space-y-3 shadow-sm">
                  <p.icon className="h-6 w-6 text-brand" />
                  <h3 className="font-semibold text-ink">{p.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{p.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── FREQUENTLY ASKED QUESTIONS (SEO & USER CLARITY) ── */}
      <section className="py-20 sm:py-24 bg-mist/60 border-t border-slate-200/60" id="faqs" aria-labelledby="faq-heading">
        <div className="public-container">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-14">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.16em] text-brand">
              <HelpCircle className="h-4 w-4" /> Frequently Asked Questions
            </span>
            <h2 id="faq-heading" className="display-2">
              Sabhijude FAQs: Personal, Campus &amp; Women&rsquo;s Safety
            </h2>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              Learn how Sabhijude safeguards your everyday commute, privacy, family, and campus with instant SOS alerts, live GPS location sharing, and verified incident response.
            </p>
          </div>

          <div className="max-w-3xl mx-auto divide-y divide-slate-200/80 rounded-2xl bg-white border border-slate-200/80 p-6 sm:p-8 shadow-sm">
            {HOMEPAGE_FAQS.map((faq, index) => (
              <details
                key={faq.question}
                className="group py-5 first:pt-0 last:pb-0"
                open={index === 0}
              >
                <summary className="flex cursor-pointer items-center justify-between text-left font-display text-lg font-bold text-ink hover:text-brand transition-colors list-none">
                  <span className="pr-4">{faq.question}</span>
                  <span className="ml-2 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-mist text-slate-500 group-open:rotate-180 group-open:bg-brand-tint group-open:text-brand transition-transform">
                    <ChevronDown className="h-4 w-4" />
                  </span>
                </summary>
                <div className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed pr-6 space-y-3">
                  <p>{faq.answer}</p>
                  {faq.linkHref && faq.linkText && (
                    <p>
                      <Link href={faq.linkHref} className="inline-flex items-center gap-1 font-semibold text-brand hover:text-brand-deep hover:underline">
                        {faq.linkText} <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </p>
                  )}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ─── ORGANIZATIONS CTA ────────────────────────────────── */}
      <section className="pb-24 sm:pb-32">
        <div className="public-container">
          <div className="relative overflow-hidden rounded-[2rem] bg-ink px-8 py-14 sm:px-14 sm:py-16 text-white">
            <div aria-hidden className="absolute -right-24 -bottom-24 h-96 w-96 rounded-full bg-brand/40 blur-3xl" />
            <div aria-hidden className="absolute -left-10 -top-24 h-72 w-72 rounded-full bg-coral/25 blur-3xl" />
            <div className="relative grid lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-8 space-y-5">
                <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-white/60">
                  <Building2 className="h-3.5 w-3.5" /> For colleges &amp; companies
                </span>
                <h2 className="font-display text-3xl sm:text-[2.6rem] leading-[1.12] font-extrabold tracking-[-0.02em]">
                  Give every student and employee a direct line to your security team.
                </h2>
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-white/75 text-[15px]">
                  {['Set up within 24 hours', 'Verified with your email domain', 'Dispatch guards in real time'].map((t) => (
                    <span key={t} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" />{t}</span>
                  ))}
                </div>
              </div>
              <div className="lg:col-span-4 flex flex-col gap-3">
                <Link href="/organization-request" className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-4 font-semibold text-ink hover:bg-brand-tint transition">
                  Request onboarding <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/org/login" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 px-6 py-4 font-semibold text-white hover:bg-white/10 transition">
                  Security desk log in
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* Hero visual: an illustrative phone showing the SOS screen. Buttons open the real SOS / fake-call flows. */
function PhoneMockup({ onOpenSos, onOpenFakeCall }: { onOpenSos: () => void; onOpenFakeCall: () => void }) {
  return (
    <div className="relative min-h-[580px] w-full flex items-center justify-center">
      <div className="relative w-[300px] sm:w-[320px] rounded-[3rem] bg-ink p-3 shadow-[0_40px_80px_-30px_rgba(11,22,48,0.55)] animate-float">
        <div className="rounded-[2.4rem] bg-gradient-to-b from-white to-mist overflow-hidden">
          <div className="flex items-center justify-between px-7 pt-4 text-[11px] font-semibold text-ink">
            <span>9:41</span>
            <span className="h-5 w-20 rounded-full bg-ink" />
            <span>5G</span>
          </div>

          <div className="px-6 pt-6 pb-8 space-y-6">
            <div>
              <p className="text-xs text-slate-500">Good evening, Ananya</p>
              <p className="font-display text-lg font-bold text-ink">You&rsquo;re protected</p>
            </div>

            <button type="button" onClick={onOpenSos} className="relative mx-auto flex h-44 w-44 items-center justify-center group" aria-label="Open SOS">
              <span className="absolute inset-0 rounded-full bg-red-500/30 animate-ring" />
              <span className="absolute inset-0 rounded-full bg-red-500/20 animate-ring [animation-delay:1.2s]" />
              <span className="relative flex h-36 w-36 flex-col items-center justify-center rounded-full bg-gradient-to-b from-red-500 to-red-600 text-white shadow-[0_16px_40px_-10px_rgba(220,38,38,0.7)] group-hover:scale-105 transition-transform">
                <span className="font-display text-4xl font-extrabold tracking-tight">SOS</span>
                <span className="text-[11px] text-white/85">Tap to alert</span>
              </span>
            </button>

            <div className="grid grid-cols-2 gap-2.5">
              <button type="button" onClick={onOpenFakeCall} className="rounded-2xl bg-white border border-slate-200 p-3 text-left hover:border-emerald-300 transition">
                <Phone className="h-4 w-4 text-emerald-600" />
                <p className="mt-2 text-[12px] font-semibold text-ink">Fake call</p>
              </button>
              <a href="tel:112" className="rounded-2xl bg-white border border-slate-200 p-3 text-left hover:border-red-300 transition">
                <ShieldAlert className="h-4 w-4 text-red-600" />
                <p className="mt-2 text-[12px] font-semibold text-ink">Call 112</p>
              </a>
            </div>

            <div className="rounded-2xl bg-white border border-slate-200 p-3 flex items-center gap-3">
              <div className="flex -space-x-2">
                {['bg-brand', 'bg-coral', 'bg-emerald-500'].map((c, i) => (
                  <span key={i} className={`h-7 w-7 rounded-full ${c} border-2 border-white`} />
                ))}
              </div>
              <div className="text-[11px] leading-tight">
                <p className="font-semibold text-ink">3 trusted contacts</p>
                <p className="text-slate-500">Ready to be alerted</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating notification cards */}
      <div className="absolute -left-6 sm:-left-20 top-48 rounded-2xl bg-white border border-slate-200 shadow-xl px-4 py-3 flex items-center gap-3 w-56">
        <span className="h-9 w-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
          <CheckCircle2 className="h-5 w-5" />
        </span>
        <div className="text-[12px] leading-tight">
          <p className="font-semibold text-ink">Location sent</p>
          <p className="text-slate-500">Mom, Priya &amp; Rahul notified</p>
        </div>
      </div>
      <div className="absolute -right-4 sm:-right-10 bottom-20 rounded-2xl bg-white border border-slate-200 shadow-xl px-4 py-3 flex items-center gap-3 w-52">
        <span className="h-9 w-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
          <AlertTriangle className="h-5 w-5" />
        </span>
        <div className="text-[12px] leading-tight">
          <p className="font-semibold text-ink">Alert nearby</p>
          <p className="text-slate-500">Streetlight out, 400 m</p>
        </div>
      </div>
    </div>
  );
}
