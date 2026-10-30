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
const INDIA_HELPLINES = [
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
    purpose: 'Dedicated women safety rapid response teams, mobile PCR dispatch, and instant distress intervention.',
    timing: '24/7 · Toll-free',
    type: 'WOMEN_POLICE',
    badge: 'RAPID PATROL',
  },
  {
    number: '181',
    title: 'Women in Distress Helpline',
    authority: 'Ministry of Women and Child Development',
    purpose: 'Confidential support, counseling, domestic violence intervention, rescue shelter, and legal guidance.',
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
    purpose: 'Direct central intervention for women facing violence, dowry harassment, acid attacks, or institutional denial of justice.',
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
    badge: 'AMBULANCE',
  },
  {
    number: '1098',
    title: 'Childline India',
    authority: 'Ministry of Women & Child Development',
    purpose: 'Emergency protection for minors, runaway girls, child abuse, and trafficking defense.',
    timing: '24/7 · Toll-free',
    type: 'CHILDREN',
    badge: 'MINORS / YOUTH',
  },
];

// Workplace Laws & Rights in India
const WORKPLACE_LAWS = [
  {
    act: 'The POSH Act, 2013',
    fullName: 'Sexual Harassment of Women at Workplace (Prevention, Prohibition and Redressal) Act, 2013',
    keyPoints: [
      'Mandatory Internal Committee (IC/ICC): Every organization with 10 or more employees must constitute an Internal Committee headed by a senior woman presiding officer, with minimum 50% women members and an external NGO/legal specialist.',
      'Local Committee (LC) for Small Establishments: For workplaces with fewer than 10 workers or where the complaint is against the employer, complaints are filed with the District Local Committee.',
      '"Extended Workplace" Doctrine: Protects women beyond office premises—covers business trips, office transport, client sites, offsite events, WFH communications, and virtual meeting rooms.',
      '90-Day Inquiry Mandate: IC must complete inquiry within 90 days. Employer must act on recommendations within 60 days of the inquiry report.',
      'Interim Relief: Complainants have the legal right to request paid leave up to 3 months (in addition to normal leave), transfer of the respondent or complainant, or restraining orders against appraisal interference.',
      'Strict Statutory Confidentiality (Section 16): Prohibits publication or disclosure of the complaint contents, identity of complainant, witnesses, or proceedings. Penalty of ₹5,000 for violation.',
    ],
  },
  {
    act: 'Bharatiya Nyaya Sanhita (BNS) & IPC Criminal Sanctions',
    fullName: 'Penal Codes Protecting Women Against Harassment, Stalking & Coercion',
    keyPoints: [
      'Section 75 BNS (Old 354A IPC) - Sexual Harassment: Physical contact involving unwelcome advances, demand/request for sexual favors, showing pornography, or sexually colored remarks. Punishable with up to 3 years rigorous imprisonment.',
      'Section 78 BNS (Old 354D IPC) - Stalking: Following a woman, attempting to contact repeatedly despite clear disinterest, or monitoring use of internet/email/electronic communication. First offense: up to 3 years imprisonment; second offense: up to 5 years.',
      'Section 79 BNS (Old 509 IPC) - Word, Gesture or Act Insulting Modesty: Uttering words, making sounds/gestures, or intruding on privacy in office corridors, elevators, or transit. Punishable with up to 3 years imprisonment and fine.',
      'Section 351 BNS (Old 506 IPC) - Criminal Intimidation: Threatening injury to person, reputation, or employment livelihood.',
    ],
  },
  {
    act: 'Night Shift & Transit Safety Standards',
    fullName: 'Factories Act, 1948 & State Shops and Establishments Enactments',
    keyPoints: [
      'Mandatory Door-to-Door Transportation: Employers operating shifts between 8:00 PM and 6:00 AM must provide secure door-to-door cab transport with vetted drivers and GPS tracking.',
      'Security Escort Protocol: If a female employee is the first to be picked up or last to be dropped off, a trained security guard must accompany the cab.',
      'Woman Supervisor Requirement: At least one female supervisor or warden must be on duty on the floor during night shifts.',
      'Crèche Facility Mandate (Maternity Benefit Act): Mandatory in every establishment with 50 or more employees, with allowed 4 daily visits for nursing mothers.',
      'Equal Remuneration Act / Code on Wages: Prohibits gender-based wage disparity for same work or work of similar nature.',
    ],
  },
];

export default function SafetyMeasuresPage() {
  const [sosModalOpen, setSosModalOpen] = useState(false);
  const [fakeCallOpen, setFakeCallOpen] = useState(false);

  // SOS Simulation state
  const [simulatingSos, setSimulatingSos] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [simDispatched, setSimDispatched] = useState(false);

  // Expandable workplace legal cards
  const [expandedLaw, setExpandedLaw] = useState<number | null>(0);

  // Handle SOS simulation
  const handleStartSosSimulation = () => {
    if (simulatingSos || simDispatched) {
      setSimulatingSos(false);
      setCountdown(null);
      setSimDispatched(false);
      return;
    }

    setSimulatingSos(true);
    setCountdown(3);

    setTimeout(() => setCountdown(2), 1000);
    setTimeout(() => setCountdown(1), 2000);
    setTimeout(() => {
      setCountdown(null);
      setSimulatingSos(false);
      setSimDispatched(true);
    }, 3000);
  };

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-ink text-white">
        <div aria-hidden className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-brand/40 blur-3xl" />
          <div className="absolute bottom-0 -left-24 h-80 w-80 rounded-full bg-coral/20 blur-3xl" />
        </div>
        <div className="public-container relative pt-20 pb-16 sm:pt-24 sm:pb-20 grid lg:grid-cols-12 gap-10 items-end">
          <div className="lg:col-span-7 space-y-6">
            <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-coral">Safety guide</span>
            <h1 className="font-display text-[2.5rem] sm:text-6xl leading-[1.05] font-extrabold tracking-[-0.03em]">
              Know who to call. Know your rights.
            </h1>
            <p className="text-lg sm:text-xl text-white/70 leading-relaxed max-w-xl">
              Official Indian helplines, workplace protections under the POSH Act and BNS, and tools you can try right now.
            </p>
          </div>
          <div className="lg:col-span-5 grid grid-cols-2 gap-3">
            <a href="tel:112" className="col-span-2 rounded-3xl bg-red-600 hover:bg-red-700 transition p-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-white/80">In danger right now?</p>
                <p className="font-display text-4xl font-extrabold">Call 112</p>
              </div>
              <span className="h-14 w-14 rounded-full bg-white/15 flex items-center justify-center"><Phone className="h-6 w-6" /></span>
            </a>
            <a href="tel:1091" className="rounded-3xl bg-white/10 hover:bg-white/15 border border-white/10 transition p-5">
              <p className="font-display text-2xl font-extrabold">1091</p>
              <p className="text-sm text-white/65">Women helpline</p>
            </a>
            <a href="tel:181" className="rounded-3xl bg-white/10 hover:bg-white/15 border border-white/10 transition p-5">
              <p className="font-display text-2xl font-extrabold">181</p>
              <p className="text-sm text-white/65">Women in distress</p>
            </a>
          </div>
        </div>
        <nav className="public-container relative pb-8 flex flex-wrap gap-2 text-sm" aria-label="On this page">
          {[
            ['#helplines', 'Helplines'],
            ['#habits', 'Everyday habits'],
            ['#rights', 'Workplace rights'],
            ['#tools', 'Try the tools'],
          ].map(([href, label]) => (
            <a key={href} href={href} className="rounded-full border border-white/15 px-4 py-2 text-white/80 hover:text-white hover:border-white/40 transition">
              {label}
            </a>
          ))}
        </nav>
      </section>

      {/* Helplines */}
      <section id="helplines" className="py-24 sm:py-28 scroll-mt-28">
        <div className="public-container space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-4 max-w-xl">
              <span className="eyebrow">Official directory</span>
              <h2 className="display-2">National emergency &amp; women safety numbers.</h2>
            </div>
            <p className="text-slate-500">Tap any number to call. Most are toll-free and open 24/7.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {INDIA_HELPLINES.map((hl) => (
              <a
                key={hl.number}
                href={`tel:${hl.number}`}
                className={`group card-public p-6 flex flex-col justify-between gap-6 hover:-translate-y-1 hover:border-brand/40 transition ${hl.number === '112' ? 'ring-2 ring-red-500/70' : ''}`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className={`font-display text-3xl font-extrabold tracking-tight ${hl.number === '112' ? 'text-red-600' : 'text-ink'}`}>
                      {hl.number}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider rounded-full bg-mist px-2.5 py-1 text-slate-600">{hl.badge}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-ink">{hl.title}</h3>
                    <p className="text-xs text-slate-500">{hl.authority}</p>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">{hl.purpose}</p>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-sm">
                  <span className="text-emerald-700 font-medium">{hl.timing}</span>
                  <span className="inline-flex items-center gap-1.5 font-semibold text-brand group-hover:gap-2.5 transition-all">
                    <Phone className="h-3.5 w-3.5" /> Call
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Everyday habits */}
      <section id="habits" className="bg-mist py-24 sm:py-28 scroll-mt-28">
        <div className="public-container space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <span className="eyebrow">Everyday habits</span>
            <h2 className="display-2">Small habits that make a big difference.</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: MapPin, t: 'Share your trip', b: 'Before a late cab or a long walk, share your route and expected arrival time with someone you trust.' },
              { icon: Users, t: 'Keep your circle current', b: 'Make sure at least three trusted contacts are saved and know they might get an alert from you.' },
              { icon: Clock, t: 'Check before you go', b: 'Look at recent community alerts for the area — broken lights, harassment hotspots or closed routes.' },
              { icon: EyeOff, t: 'Trust your instincts', b: 'If something feels off, leave. A fake call is a perfectly good reason to step away.' },
              { icon: Briefcase, t: 'Document everything', b: 'Note dates, times, words and witnesses. Screenshots saved to a personal drive can matter later.' },
              { icon: Lock, t: 'Lock down your profiles', b: 'Limit who can see your location, workplace and daily routine on social media.' },
            ].map((x) => (
              <div key={x.t} className="rounded-3xl bg-white border border-slate-200 p-7 space-y-3">
                <span className="h-11 w-11 rounded-2xl bg-brand-tint text-brand flex items-center justify-center">
                  <x.icon className="h-5 w-5" />
                </span>
                <h3 className="font-display text-lg font-bold text-ink">{x.t}</h3>
                <p className="text-slate-600 text-[15px] leading-relaxed">{x.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workplace rights */}
      <section id="rights" className="py-24 sm:py-28 scroll-mt-28">
        <div className="public-container grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-32 self-start">
            <span className="eyebrow"><Scale className="h-3.5 w-3.5" /> Your rights</span>
            <h2 className="display-2">Workplace safety &amp; the law.</h2>
            <p className="text-slate-600 text-lg leading-relaxed">
              What the POSH Act, the Bharatiya Nyaya Sanhita and labour laws guarantee you — in plain language.
            </p>
          </div>

          <div className="lg:col-span-8 space-y-4">
            {WORKPLACE_LAWS.map((law, idx) => {
              const isExpanded = expandedLaw === idx;
              return (
                <div key={law.act} className={`rounded-3xl border transition-colors ${isExpanded ? 'border-brand/30 bg-brand-tint/40' : 'border-slate-200 bg-white'}`}>
                  <button
                    type="button"
                    onClick={() => setExpandedLaw(isExpanded ? null : idx)}
                    aria-expanded={isExpanded}
                    className="w-full p-6 flex items-center justify-between gap-4 text-left"
                  >
                    <div>
                      <h3 className="font-display text-lg font-bold text-ink">{law.act}</h3>
                      <p className="text-sm text-slate-500 mt-1">{law.fullName}</p>
                    </div>
                    <span className={`h-9 w-9 shrink-0 rounded-full border flex items-center justify-center transition ${isExpanded ? 'bg-ink border-ink text-white rotate-180' : 'border-slate-300 text-ink'}`}>
                      <ChevronDown className="h-4 w-4" />
                    </span>
                  </button>
                  {isExpanded && (
                    <ul className="px-6 pb-6 space-y-3">
                      {law.keyPoints.map((point, pIdx) => {
                        const sep = point.indexOf(':');
                        const title = sep > -1 ? point.slice(0, sep) : '';
                        const desc = sep > -1 ? point.slice(sep + 1) : point;
                        return (
                          <li key={pIdx} className="flex items-start gap-3 rounded-2xl bg-white border border-slate-200 p-4 text-[15px] leading-relaxed text-slate-700">
                            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>
                              {title && <strong className="text-ink">{title}:</strong>}
                              {desc}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              );
            })}

            <div className="rounded-3xl bg-ink text-white p-7 sm:p-8 space-y-6 mt-8">
              <div className="flex items-center gap-3">
                <span className="h-11 w-11 rounded-2xl bg-white/10 flex items-center justify-center"><Briefcase className="h-5 w-5" /></span>
                <div>
                  <h3 className="font-display text-lg font-bold">How to file a POSH complaint</h3>
                  <p className="text-sm text-white/60">Four steps to make sure your case is documented and heard.</p>
                </div>
              </div>
              <ol className="grid sm:grid-cols-2 gap-4">
                {[
                  ['Document', 'Log dates, times, statements, places and witnesses. Save screenshots somewhere personal.'],
                  ['Submit', 'File a written complaint with the Internal Committee within 3 months. Ask for written acknowledgement.'],
                  ['Safeguard', 'Request interim relief — up to 3 months of paid leave or a transfer if needed.'],
                  ['Follow up', 'The inquiry must finish within 90 days, and management must act within 60 days of the report.'],
                ].map(([t, b], i) => (
                  <li key={t} className="rounded-2xl bg-white/5 border border-white/10 p-5 space-y-2">
                    <span className="text-xs font-bold text-coral">Step {i + 1}</span>
                    <p className="font-semibold">{t}</p>
                    <p className="text-sm text-white/65 leading-relaxed">{b}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* Try the tools */}
      <section id="tools" className="pb-24 sm:pb-32 scroll-mt-28">
        <div className="public-container space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <span className="eyebrow">Practice makes calm</span>
            <h2 className="display-2">Try the tools before you need them.</h2>
            <p className="text-slate-600 text-lg">Nothing here contacts anyone — it&rsquo;s a safe rehearsal.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            <div className="card-public p-7 flex flex-col justify-between gap-6">
              <div className="space-y-3">
                <span className="h-12 w-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center"><AlertTriangle className="h-6 w-6" /></span>
                <h3 className="font-display text-xl font-bold text-ink">SOS countdown</h3>
                <p className="text-slate-600 leading-relaxed">See how the 3-second cancel window works before an alert goes out.</p>
              </div>
              {simulatingSos ? (
                <div className="rounded-2xl bg-red-50 border border-red-200 p-4 text-center space-y-2">
                  <div className="h-12 w-12 rounded-full bg-red-600 text-white font-display font-extrabold text-xl flex items-center justify-center mx-auto animate-pulse">{countdown}</div>
                  <p className="text-sm font-semibold text-red-700">Preparing alert…</p>
                  <button onClick={handleStartSosSimulation} className="text-sm text-slate-600 underline">Cancel</button>
                </div>
              ) : simDispatched ? (
                <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-center space-y-1">
                  <CheckCircle2 className="h-7 w-7 text-emerald-600 mx-auto" />
                  <p className="text-sm font-semibold text-emerald-800">Alert sent (practice only)</p>
                  <button onClick={handleStartSosSimulation} className="text-sm text-brand font-semibold underline">Reset</button>
                </div>
              ) : (
                <button onClick={handleStartSosSimulation} className="btn-sos w-full">Start practice SOS</button>
              )}
            </div>

            <div className="card-public p-7 flex flex-col justify-between gap-6">
              <div className="space-y-3">
                <span className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center"><Phone className="h-6 w-6" /></span>
                <h3 className="font-display text-xl font-bold text-ink">Fake incoming call</h3>
                <p className="text-slate-600 leading-relaxed">A realistic call screen with a voice on the line — your polite exit.</p>
              </div>
              <button onClick={() => setFakeCallOpen(true)} className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 hover:bg-emerald-700 px-6 py-3.5 text-sm font-semibold text-white transition">
                Ring my phone
              </button>
            </div>

            <div className="card-public p-7 flex flex-col justify-between gap-6">
              <div className="space-y-3">
                <span className="h-12 w-12 rounded-2xl bg-brand-tint text-brand flex items-center justify-center"><ShieldCheck className="h-6 w-6" /></span>
                <h3 className="font-display text-xl font-bold text-ink">Set up your circle</h3>
                <p className="text-slate-600 leading-relaxed">Add trusted contacts so a real SOS reaches the right people instantly.</p>
              </div>
              <Link href="/signup" className="btn-brand w-full">Create free account <ArrowRight className="h-4 w-4" /></Link>
            </div>
          </div>
        </div>
      </section>

      <SosModal isOpen={sosModalOpen} onClose={() => setSosModalOpen(false)} />
      <FakeCallModal isOpen={fakeCallOpen} onClose={() => setFakeCallOpen(false)} />
    </div>
  );
}
