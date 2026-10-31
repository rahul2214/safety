'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Phone,
  Share2,
  Sparkles,
  ArrowRight,
  EyeOff,
  Users,
  Lock,
  CheckCircle2,
  ExternalLink,
  Zap,
  Radio,
  Clock,
  Play,
  UserPlus,
  LogIn,
  MapPin,
  HelpCircle,
  Briefcase,
  Scale,
  FileText,
  AlertCircle,
  Building,
  Check,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { FakeCallModal } from '@/components/FakeCallModal';
import { SosModal } from '@/components/SosModal';

// Official India Emergency & Women Safety Helplines
export const INDIA_HELPLINES = [
  {
    number: '112',
    title: 'National Emergency (ERSS)',
    authority: 'Ministry of Home Affairs, Govt. of India',
    purpose: 'All-in-one unified emergency response: Police, Fire, Ambulance, and Disaster Support across all States & UTs.',
    timing: '24/7 · Toll-free',
    type: 'POLICE',
    badge: 'ALL-IN-ONE',
  },
  {
    number: '1091',
    title: 'Women Safety Helpline',
    authority: 'State Police Departments',
    purpose: 'Dedicated rapid response teams, mobile PCR patrol dispatch, and instant distress intervention.',
    timing: '24/7 · Toll-free',
    type: 'WOMEN_POLICE',
    badge: 'RAPID PATROL',
  },
  {
    number: '181',
    title: 'Women in Distress Helpline',
    authority: 'Ministry of Women and Child Development',
    purpose: 'Confidential support, crisis counseling, domestic violence intervention, rescue shelter, and legal guidance.',
    timing: '24/7 · Toll-free',
    type: 'CRISIS_AID',
    badge: 'DOMESTIC & CRISIS',
  },
  {
    number: '1090',
    title: 'Women Power Line',
    authority: 'Special Crime Branch / Police',
    purpose: 'Anti-harassment unit for stalking, obscene calls, cyber bullying, and street intimidation without revealing victim identity.',
    timing: '24/7 · Toll-free',
    type: 'ANTI_STALKING',
    badge: 'STALKING & CYBER',
  },
  {
    number: '1930',
    title: 'National Cyber Crime Helpline',
    authority: 'Indian Cyber Crime Coordination Centre (I4C)',
    purpose: 'Reporting online harassment, cyber stalking, image morphing, doxxing, fake social profiles, and financial extortion.',
    timing: '24/7 · Toll-free',
    type: 'CYBER',
    badge: 'CYBER SAFETY',
  },
  {
    number: '7827170170',
    title: 'NCW 24/7 Crisis Line',
    authority: 'National Commission for Women (NCW)',
    purpose: 'Direct central intervention for individuals facing violence, dowry harassment, acid attacks, or institutional denial of justice.',
    timing: '24/7 · Standard call',
    type: 'LEGAL',
    badge: 'LEGAL ESCALATION',
  },
  {
    number: '108',
    title: 'Emergency Medical & Ambulance',
    authority: 'National Health Mission',
    purpose: 'Emergency trauma care, ambulance dispatch, and disaster medical assistance.',
    timing: '24/7 · Toll-free',
    type: 'MEDICAL',
    badge: 'TRAUMA CARE',
  },
  {
    number: '1098',
    title: 'Childline India',
    authority: 'Ministry of Women and Child Development',
    purpose: 'Emergency protection, rescue, and care for children and minors in distress.',
    timing: '24/7 · Toll-free',
    type: 'CHILD_AID',
    badge: 'CHILDREN & MINORS',
  },
];

export function SafetyMeasuresClient() {
  const [filterType, setFilterType] = useState<string>('ALL');
  const [fakeCallOpen, setFakeCallOpen] = useState(false);
  const [sosModalOpen, setSosModalOpen] = useState(false);
  const [simulatingSos, setSimulatingSos] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [simDispatched, setSimDispatched] = useState(false);

  const filteredHelplines =
    filterType === 'ALL'
      ? INDIA_HELPLINES
      : INDIA_HELPLINES.filter((h) => h.type === filterType || (filterType === 'POLICE' && (h.type === 'POLICE' || h.type === 'WOMEN_POLICE')));

  const handleStartSosSimulation = () => {
    if (simulatingSos || simDispatched) {
      setSimulatingSos(false);
      setSimDispatched(false);
      setCountdown(3);
      return;
    }
    setSimulatingSos(true);
    setCountdown(3);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setSimulatingSos(false);
          setSimDispatched(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div className="bg-white">
      {/* ─── HERO ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div aria-hidden className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-[480px] w-[900px] rounded-full bg-gradient-to-r from-brand/10 via-coral/10 to-brand/10 blur-3xl" />
        </div>
        <div className="public-container relative pt-16 pb-16 sm:pt-24 sm:pb-20 text-center max-w-4xl space-y-6">
          <span className="eyebrow justify-center">
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" /> India Emergency Directory &amp; Safety Guide
          </span>
          <h1 className="display-1">
            Emergency helplines &amp; <span className="text-brand">safety measures.</span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Official government emergency contacts, statutory workplace protections, and practical safety protocols — organized in one accessible, verified directory.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <a href="#helplines" className="btn-brand">
              Browse emergency numbers <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <a href="#tools" className="btn-ghost">
              Practice SOS rehearsal
            </a>
          </div>
        </div>
      </section>

      {/* ─── HELPLINE DIRECTORY ───────────────────────────────── */}
      <section id="helplines" className="py-16 sm:py-24 border-t border-slate-200 scroll-mt-24">
        <div className="public-container space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div className="space-y-3 max-w-xl">
              <span className="eyebrow">Direct Intervention</span>
              <h2 className="display-2">Official 24/7 Helplines in India</h2>
              <p className="text-slate-600 text-base">
                Toll-free emergency numbers operating 24 hours a day, 365 days a year across all Indian states and Union Territories.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'All numbers', val: 'ALL' },
                { label: 'Police & patrol', val: 'POLICE' },
                { label: 'Crisis & domestic', val: 'CRISIS_AID' },
                { label: 'Cyber safety', val: 'CYBER' },
                { label: 'Legal escalation', val: 'LEGAL' },
              ].map((btn) => (
                <button
                  key={btn.val}
                  type="button"
                  onClick={() => setFilterType(btn.val)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                    filterType === btn.val ? 'bg-ink text-white' : 'bg-mist text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredHelplines.map((h) => (
              <div key={h.number} className="card-public p-6 flex flex-col justify-between space-y-5 hover:border-slate-300 transition">
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-brand bg-brand-tint px-2.5 py-1 rounded-full">
                      {h.badge}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">{h.timing}</span>
                  </div>
                  <div>
                    <a href={`tel:${h.number}`} className="font-display text-3xl font-extrabold text-ink hover:text-brand transition flex items-center gap-2">
                      <Phone className="h-6 w-6 text-coral" aria-hidden="true" />
                      {h.number}
                    </a>
                    <h3 className="font-bold text-base text-ink mt-1">{h.title}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{h.authority}</p>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">{h.purpose}</p>
                </div>
                <a
                  href={`tel:${h.number}`}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-ink hover:bg-ink-soft py-2.5 text-xs font-bold text-white transition"
                  aria-label={`Dial ${h.title}: ${h.number}`}
                >
                  <Phone className="h-3.5 w-3.5" aria-hidden="true" /> Call {h.number} now
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PROCEDURES & MEASURES ────────────────────────────── */}
      <section className="bg-mist py-20 sm:py-28 border-t border-slate-200">
        <div className="public-container space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <span className="eyebrow">Practical Measures</span>
            <h2 className="display-2">Actionable Safety Protocols</h2>
            <p className="text-slate-600 text-lg">Clear steps to take during different safety scenarios.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="rounded-3xl bg-white border border-slate-200 p-8 space-y-4">
              <span className="h-12 w-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
                <AlertCircle className="h-6 w-6" aria-hidden="true" />
              </span>
              <h3 className="font-display text-xl font-bold text-ink">Street or Commute Danger</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
                  Trigger Emergency SOS or WhatsApp location pin to your circle immediately.
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
                  Head directly toward lit, staffed establishments (pharmacies, petrol pumps, metro stations).
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
                  Dial 112 ERSS. Keep the line active; cellular tower triangulation operates continuously.
                </li>
              </ul>
            </div>

            <div className="rounded-3xl bg-white border border-slate-200 p-8 space-y-4">
              <span className="h-12 w-12 rounded-2xl bg-brand-tint text-brand flex items-center justify-center font-bold">
                <Briefcase className="h-6 w-6" aria-hidden="true" />
              </span>
              <h3 className="font-display text-xl font-bold text-ink">Workplace Harassment (POSH)</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
                  Keep contemporaneous written logs with exact dates, direct quotes, and witnesses.
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
                  Submit a formal complaint to your organization&rsquo;s Internal Committee (IC) within 3 months.
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
                  Request statutory interim relief, including transfer or up to 3 months paid leave.
                </li>
              </ul>
            </div>

            <div className="rounded-3xl bg-white border border-slate-200 p-8 space-y-4">
              <span className="h-12 w-12 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
                <Lock className="h-6 w-6" aria-hidden="true" />
              </span>
              <h3 className="font-display text-xl font-bold text-ink">Cyber Harassment &amp; Doxxing</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
                  Take complete screenshots showing profile URLs, usernames, timestamps, and messages.
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
                  File on cybercrime.gov.in or dial national helpline 1930 immediately.
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
                  Do not delete messages or interact with the perpetrator prior to taking digital evidence.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ─── TRY THE TOOLS ────────────────────────────────────── */}
      <section id="tools" className="pb-24 sm:pb-32 pt-16 scroll-mt-28">
        <div className="public-container space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <span className="eyebrow">Practice makes calm</span>
            <h2 className="display-2">Try the tools before you need them.</h2>
            <p className="text-slate-600 text-lg">Nothing here contacts anyone — it&rsquo;s a safe rehearsal.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            <div className="card-public p-7 flex flex-col justify-between gap-6">
              <div className="space-y-3">
                <span className="h-12 w-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6" aria-hidden="true" />
                </span>
                <h3 className="font-display text-xl font-bold text-ink">SOS countdown</h3>
                <p className="text-slate-600 leading-relaxed">See how the 3-second cancel window works before an alert dispatches.</p>
              </div>
              {simulatingSos ? (
                <div className="rounded-2xl bg-red-50 border border-red-200 p-4 text-center space-y-2">
                  <div className="h-12 w-12 rounded-full bg-red-600 text-white font-display font-extrabold text-xl flex items-center justify-center mx-auto animate-pulse">
                    {countdown}
                  </div>
                  <p className="text-sm font-semibold text-red-700">Preparing alert…</p>
                  <button onClick={handleStartSosSimulation} className="text-sm text-slate-600 underline">
                    Cancel
                  </button>
                </div>
              ) : simDispatched ? (
                <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-center space-y-1">
                  <CheckCircle2 className="h-7 w-7 text-emerald-600 mx-auto" aria-hidden="true" />
                  <p className="text-sm font-semibold text-emerald-800">Alert simulated (practice only)</p>
                  <button onClick={handleStartSosSimulation} className="text-sm text-brand font-semibold underline">
                    Reset
                  </button>
                </div>
              ) : (
                <button onClick={handleStartSosSimulation} className="btn-sos w-full">
                  Start practice SOS
                </button>
              )}
            </div>

            <div className="card-public p-7 flex flex-col justify-between gap-6">
              <div className="space-y-3">
                <span className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <Phone className="h-6 w-6" aria-hidden="true" />
                </span>
                <h3 className="font-display text-xl font-bold text-ink">Fake incoming call</h3>
                <p className="text-slate-600 leading-relaxed">A realistic call screen with audio — your polite, discreet exit.</p>
              </div>
              <button
                type="button"
                onClick={() => setFakeCallOpen(true)}
                className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 hover:bg-emerald-700 px-6 py-3.5 text-sm font-semibold text-white transition"
              >
                Ring my phone
              </button>
            </div>

            <div className="card-public p-7 flex flex-col justify-between gap-6">
              <div className="space-y-3">
                <span className="h-12 w-12 rounded-2xl bg-brand-tint text-brand flex items-center justify-center">
                  <ShieldCheck className="h-6 w-6" aria-hidden="true" />
                </span>
                <h3 className="font-display text-xl font-bold text-ink">Set up your circle</h3>
                <p className="text-slate-600 leading-relaxed">Add trusted contacts so a real SOS reaches the right people instantly.</p>
              </div>
              <Link href="/signup" className="btn-brand w-full">
                Create free account <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <SosModal isOpen={sosModalOpen} onClose={() => setSosModalOpen(false)} />
      <FakeCallModal isOpen={fakeCallOpen} onClose={() => setFakeCallOpen(false)} />
    </div>
  );
}
