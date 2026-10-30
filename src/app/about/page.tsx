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

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_LIST: FaqItem[] = [
  {
    question: 'How does Sabhijude keep me anonymous?',
    answer:
      'When you share a safety concern or incident report, your real name, email and phone number are never shown on the public feed. Reports are published under a pseudonym, and you choose whether to show your profile name or post anonymously.',
  },
  {
    question: 'What happens when I press SOS?',
    answer:
      'A 3-second countdown starts so accidental presses can be cancelled. Then your device’s GPS location is packaged into a distress message with a Google Maps link and sent over WhatsApp, with SMS as a fallback. You also get one-tap access to national helplines like 112 and 1091.',
  },
  {
    question: 'How does the fake call help?',
    answer:
      'It simulates a realistic incoming call — ringtone, vibration and a caller like “Mom” or “Dad”. Once answered, an in-call screen with a running timer shows you are on the phone, giving you a natural reason to step away.',
  },
  {
    question: 'Does Sabhijude support workplace safety and POSH?',
    answer:
      'Yes. Our guides cover the POSH Act 2013 — your right to file with the Internal Committee, the 90-day inquiry timeline, employer duties and Section 16 confidentiality — alongside relevant Bharatiya Nyaya Sanhita (BNS) provisions.',
  },
  {
    question: 'Is it really free?',
    answer:
      'Yes, 100% free. Personal safety is a right, not a product. There are no paywalls, no advertising and no commercial trackers.',
  },
  {
    question: 'Do I need to install an app?',
    answer:
      'No. Sabhijude works in any mobile browser — Chrome, Safari or Firefox. Add it to your home screen for one-tap access, just like an app.',
  },
];

const PILLARS = [
  {
    icon: Lock,
    title: 'Privacy first',
    body: 'Reports are published under pseudonyms and location data is only read when you ask. No data selling, no third-party brokers.',
    tint: 'bg-brand-tint text-brand',
  },
  {
    icon: Zap,
    title: 'SOS in seconds',
    body: 'One tap shares a live map pin over WhatsApp and SMS at the same time, so it still reaches people on weak networks.',
    tint: 'bg-red-50 text-red-600',
  },
  {
    icon: Scale,
    title: 'Know your rights',
    body: 'Plain-language guidance on the POSH Act 2013 and BNS — from Internal Committee complaints to confidentiality protections.',
    tint: 'bg-emerald-50 text-emerald-700',
  },
  {
    icon: Users,
    title: 'Community verified',
    body: 'Members confirm incidents, share safer routes and flag hazards like broken streetlights or isolated bus stops.',
    tint: 'bg-coral-tint text-coral',
  },
];

export default function AboutPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div aria-hidden className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-[480px] w-[900px] rounded-full bg-gradient-to-r from-brand/10 via-coral/10 to-brand/10 blur-3xl" />
        </div>
        <div className="public-container relative pt-20 pb-20 sm:pt-28 sm:pb-24 text-center max-w-4xl space-y-7">
          <span className="eyebrow justify-center"><Heart className="h-3.5 w-3.5" /> Our mission</span>
          <h1 className="display-1">
            Peace of mind for every woman, <span className="text-brand">every step of the way.</span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Sabhijude is a women-first safety network. We close the gap between that first uneasy feeling and getting real help —
            with fast alerts, discreet tools and a community that has your back.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
            <Link href="/signup" className="btn-brand">Join for free <ArrowRight className="h-4 w-4" /></Link>
            <Link href="/safety-measures" className="btn-ghost">Read the safety guide</Link>
          </div>
        </div>
      </section>

      {/* The problem */}
      <section className="bg-ink text-white py-24 sm:py-28">
        <div className="public-container grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5 space-y-5">
            <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-coral">Why we built this</span>
            <h2 className="font-display text-3xl sm:text-[2.6rem] leading-[1.12] font-extrabold tracking-[-0.02em]">
              Most safety apps wake up too late.
            </h2>
            <p className="text-white/70 text-lg leading-relaxed">
              They only help once something has already gone wrong. Sabhijude is designed for the moments before — a dark street,
              an unverified cab, someone following you.
            </p>
          </div>
          <div className="lg:col-span-7 grid sm:grid-cols-3 gap-4">
            {[
              { n: '01', t: 'Calling feels risky', b: 'Typing a message or calling someone can escalate things. Discreet triggers and a fake call help without drawing attention.' },
              { n: '02', t: 'Tracking feels invasive', b: 'Many women turn off apps that broadcast their whereabouts. We only use your location when you send an alert.' },
              { n: '03', t: 'Nobody should feel alone', b: 'Shared, anonymous alerts about unlit roads and unsafe spots help thousands of women protect each other.' },
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
                  <p.icon className="h-6 w-6" />
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
              <span className="eyebrow"><Gavel className="h-3.5 w-3.5" /> Built for India</span>
              <h2 className="display-2">Aligned with the laws that protect you.</h2>
            </div>
            <Link href="/safety-measures" className="inline-flex items-center gap-2 font-semibold text-brand hover:text-brand-deep">
              See all helplines <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { icon: ShieldCheck, t: 'POSH Act, 2013', b: 'Supports workplace complaints with the Internal Committee, the 90-day inquiry timeline and Section 16 confidentiality.' },
              { icon: Phone, t: 'Emergency Response (112)', b: 'One-tap dialing to 112, Women Helpline 1091, Women in Distress 181 and Cyber Crime 1930.' },
              { icon: Scale, t: 'Bharatiya Nyaya Sanhita', b: 'Report categories map to BNS Section 75 (sexual harassment), 78 (stalking) and 79 (insulting modesty).' },
            ].map((x) => (
              <div key={x.t} className="rounded-3xl bg-white border border-slate-200 p-7 space-y-3">
                <x.icon className="h-6 w-6 text-brand" />
                <h3 className="font-display text-lg font-bold text-ink">{x.t}</h3>
                <p className="text-slate-600 text-[15px] leading-relaxed">{x.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 sm:py-32">
        <div className="public-container grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4 space-y-4">
            <span className="eyebrow">FAQ</span>
            <h2 className="display-2">Questions, answered.</h2>
            <p className="text-slate-600 text-lg">Still unsure? Create a free account and explore at your own pace.</p>
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
                      <ChevronDown className="h-4 w-4" />
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
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight">Safety is better together.</h2>
              <p className="text-white/80 text-lg">Set up your trusted circle in under two minutes. It&rsquo;s free, forever.</p>
            </div>
            <div className="relative flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Link href="/signup" className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-4 font-semibold text-ink hover:bg-brand-tint transition">
                Create free account <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/safety-measures" className="inline-flex items-center justify-center rounded-full border border-white/30 px-7 py-4 font-semibold hover:bg-white/10 transition">
                Safety guide
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
