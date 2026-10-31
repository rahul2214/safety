'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Lock,
  Users,
  Zap,
  ChevronDown,
  ArrowRight,
  Scale,
  Phone,
  Gavel,
  Heart,
} from 'lucide-react';

import { FAQ_LIST } from '@/lib/about-data';

const PILLARS = [
  {
    icon: Lock,
    title: 'Privacy first',
    body: 'Reports are published with pseudonym protection and location telemetry is only accessed upon your direct action. Zero commercial tracking, zero data selling.',
    tint: 'bg-brand-tint text-brand',
  },
  {
    icon: Zap,
    title: 'SOS in seconds',
    body: 'One tap shares your live GPS map pin over WhatsApp and SMS simultaneously, ensuring delivery even on weak cellular networks.',
    tint: 'bg-red-50 text-red-600',
  },
  {
    icon: Scale,
    title: 'Know your rights',
    body: 'Plain-language guidance on the POSH Act 2013, BNS, and criminal legal provisions — from Internal Committee filings to statutory workplace transport.',
    tint: 'bg-emerald-50 text-emerald-700',
  },
  {
    icon: Users,
    title: 'Community verified',
    body: 'Members confirm incidents, recommend safer travel routes, and highlight municipal hazards like broken streetlights or isolated stops.',
    tint: 'bg-coral-tint text-coral',
  },
];

export function AboutPageClient() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div aria-hidden className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-[480px] w-[900px] rounded-full bg-gradient-to-r from-brand/10 via-coral/10 to-brand/10 blur-3xl" />
        </div>
        <div className="public-container relative pt-16 pb-20 sm:pt-24 sm:pb-24 text-center max-w-4xl space-y-7">
          <span className="eyebrow justify-center">
            <Heart className="h-3.5 w-3.5" aria-hidden="true" /> Our mission
          </span>
          <h1 className="display-1">
            Peace of mind for everyone, <span className="text-brand">every step of the way.</span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Sabhijude is a comprehensive personal and community safety network. We close the gap between that first uneasy feeling and getting real help —
            with fast emergency alerts, discreet tools, verified local intelligence, and organizational security desks.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
            <Link href="/signup" className="btn-brand">
              Join for free <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link href="/safety-measures" className="btn-ghost">
              Read the safety guide
            </Link>
          </div>
        </div>
      </section>

      {/* The problem */}
      <section className="bg-ink text-white py-24 sm:py-28">
        <div className="public-container grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5 space-y-5">
            <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-coral">Why we built this</span>
            <h2 className="font-display text-3xl sm:text-[2.6rem] leading-[1.12] font-extrabold tracking-[-0.02em]">
              Most safety tools wake up too late.
            </h2>
            <p className="text-white/70 text-lg leading-relaxed">
              Traditional solutions often trigger only after harm has occurred. Sabhijude is engineered for the crucial moments before — a deserted street,
              an unverified cab, a persistent follower, or a hostile workplace environment.
            </p>
          </div>
          <div className="lg:col-span-7 grid sm:grid-cols-3 gap-4">
            {[
              { n: '01', t: 'Calling draws attention', b: 'Making a phone call in an escalated situation can be dangerous. Discreet emergency triggers and realistic fake calls help without alerting bystanders.' },
              { n: '02', t: 'Continuous tracking feels invasive', b: 'Constant GPS surveillance drains batteries and invades privacy. We access location telemetry strictly upon your direct emergency request.' },
              { n: '03', t: 'No one should navigate alone', b: 'Shared, anonymous alerts about unlit roads, harassment hotspots, and local hazards empower entire communities to stay safe.' },
            ].map((x) => (
              <div key={x.n} className="rounded-3xl border border-white/10 bg-white/5 p-6 space-y-3">
                <span className="font-display text-3xl font-extrabold text-coral">{x.n}</span>
                <h3 className="font-semibold text-lg">{x.t}</h3>
                <p className="text-sm text-white/65 leading-relaxed">{x.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="py-24 sm:py-32">
        <div className="public-container space-y-14">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <span className="eyebrow">What we stand for</span>
            <h2 className="display-2">Four principles behind everything we build.</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {PILLARS.map((p) => (
              <div key={p.title} className="card-public p-7 space-y-4 hover:-translate-y-1 transition-transform">
                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${p.tint}`}>
                  <p.icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="font-display text-xl font-bold text-ink">{p.title}</h3>
                <p className="text-slate-600 leading-relaxed text-[15px]">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Legal alignment */}
      <section className="bg-mist py-24 sm:py-28">
        <div className="public-container space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4 max-w-xl">
              <span className="eyebrow">
                <Gavel className="h-3.5 w-3.5" aria-hidden="true" /> Built for India
              </span>
              <h2 className="display-2">Aligned with the statutory laws that protect you.</h2>
            </div>
            <Link href="/safety-measures" className="inline-flex items-center gap-2 font-semibold text-brand hover:text-brand-deep">
              See all emergency helplines <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { icon: ShieldCheck, t: 'POSH Act, 2013', b: 'Supports workplace grievance redressal with Internal Committees (IC), 90-day inquiry timelines, and Section 16 strict confidentiality.' },
              { icon: Phone, t: 'Emergency Response Support (112)', b: 'One-tap dialing to unified 112 ERSS, Women Helpline 1091, Distress 181, and National Cyber Crime 1930.' },
              { icon: Scale, t: 'Bharatiya Nyaya Sanhita (BNS)', b: 'Categorized incident tags map to BNS Section 75 (sexual harassment), Section 78 (stalking), and Section 79 (insulting modesty).' },
            ].map((x) => (
              <div key={x.t} className="rounded-3xl bg-white border border-slate-200 p-7 space-y-3">
                <x.icon className="h-6 w-6 text-brand" aria-hidden="true" />
                <h3 className="font-display text-lg font-bold text-ink">{x.t}</h3>
                <p className="text-slate-600 text-[15px] leading-relaxed">{x.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 sm:py-32" aria-labelledby="faq-heading">
        <div className="public-container grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4 space-y-4">
            <span className="eyebrow">FAQ</span>
            <h2 id="faq-heading" className="display-2">Frequently asked questions.</h2>
            <p className="text-slate-600 text-lg">Still have questions? Create a free account and explore the safety network at your own pace.</p>
          </div>
          <div className="lg:col-span-8 divide-y divide-slate-200 border-y border-slate-200">
            {FAQ_LIST.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div key={faq.question}>
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    aria-expanded={isOpen}
                    className="w-full py-6 text-left flex items-center justify-between gap-6 group"
                  >
                    <span className="font-display text-lg font-semibold text-ink group-hover:text-brand transition-colors">{faq.question}</span>
                    <span className={`h-9 w-9 shrink-0 rounded-full border flex items-center justify-center transition ${isOpen ? 'bg-ink border-ink text-white rotate-180' : 'border-slate-300 text-ink'}`}>
                      <ChevronDown className="h-4 w-4" aria-hidden="true" />
                    </span>
                  </button>
                  {isOpen && <p className="pb-6 pr-14 text-slate-600 leading-relaxed">{faq.answer}</p>}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-24 sm:pb-32">
        <div className="public-container">
          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand to-brand-deep px-8 py-14 sm:px-14 text-white flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div aria-hidden className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-coral/30 blur-3xl" />
            <div className="relative space-y-3 max-w-xl">
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight">Safety is stronger together.</h2>
              <p className="text-white/80 text-lg">Build your trusted emergency circle in under two minutes. Free for everyone, forever.</p>
            </div>
            <div className="relative flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Link href="/signup" className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-4 font-semibold text-ink hover:bg-brand-tint transition">
                Create free account <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link href="/safety-measures" className="inline-flex items-center justify-center rounded-full border border-white/30 px-7 py-4 font-semibold hover:bg-white/10 transition">
                Emergency helplines
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
