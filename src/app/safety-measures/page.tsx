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
    timing: '24/7 &bull; Toll-Free',
    type: 'POLICE',
    badge: 'ALL-IN-ONE',
  },
  {
    number: '1091',
    title: 'Women Safety Helpline',
    authority: 'State Police Departments',
    purpose: 'Dedicated women safety rapid response teams, mobile PCR dispatch, and instant distress intervention.',
    timing: '24/7 &bull; Toll-Free',
    type: 'WOMEN_POLICE',
    badge: 'RAPID PATROL',
  },
  {
    number: '181',
    title: 'Women in Distress Helpline',
    authority: 'Ministry of Women and Child Development',
    purpose: 'Confidential support, counseling, domestic violence intervention, rescue shelter, and legal guidance.',
    timing: '24/7 &bull; Toll-Free',
    type: 'CRISIS_AID',
    badge: 'DOMESTIC & CRISIS',
  },
  {
    number: '1090',
    title: 'Women Power Line',
    authority: 'Special Crime Branch / Police',
    purpose: 'Anti-harassment unit for stalking, obscene calls, cyber bullying, and street intimidation without revealing victim identity.',
    timing: '24/7 &bull; Toll-Free',
    type: 'ANTI_STALKING',
    badge: 'STALKING & CYBER',
  },
  {
    number: '1930',
    title: 'National Cyber Crime Helpline',
    authority: 'Indian Cyber Crime Coordination Centre (I4C)',
    purpose: 'Reporting online harassment, cyber stalking, image morphing, doxxing, fake social profiles, and financial extortion.',
    timing: '24/7 &bull; Toll-Free',
    type: 'CYBER',
    badge: 'CYBER SAFETY',
  },
  {
    number: '7827170170',
    title: 'NCW 24/7 Crisis Line',
    authority: 'National Commission for Women (NCW)',
    purpose: 'Direct central intervention for women facing violence, dowry harassment, acid attacks, or institutional denial of justice.',
    timing: '24/7 &bull; Standard Call',
    type: 'LEGAL',
    badge: 'LEGAL ESCALATION',
  },
  {
    number: '108',
    title: 'Emergency Medical & Ambulance',
    authority: 'National Health Mission',
    purpose: 'Emergency trauma care, ambulance dispatch, and disaster medical assistance.',
    timing: '24/7 &bull; Toll-Free',
    type: 'MEDICAL',
    badge: 'AMBULANCE',
  },
  {
    number: '1098',
    title: 'Childline India',
    authority: 'Ministry of Women & Child Development',
    purpose: 'Emergency protection for minors, runaway girls, child abuse, and trafficking defense.',
    timing: '24/7 &bull; Toll-Free',
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
    <div className="space-y-12 max-w-5xl mx-auto pb-12 select-none">
      {/* ============================================================ */}
      {/* 1. HERO HEADER: Defense Matrix Overview                      */}
      {/* ============================================================ */}
      <section className="pt-2 sm:pt-6 text-center max-w-3xl mx-auto space-y-4">
      

        <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-slate-900 leading-tight">
          Practical Safety Protocols, Official Helplines &amp; Workplace Rights
        </h1>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl mx-auto">
          Equip yourself with validated legal protections under the POSH Act, official Government of India emergency hotlines,
          and situational defense tools designed for transit and workplaces.
        </p>
      </section>

      {/* ============================================================ */}
      {/* 2. OFFICIAL INDIA EMERGENCY & SAFETY HELPLINE DIRECTORY      */}
      {/* ============================================================ */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pb-2 border-b border-slate-200">
          <div>
            <span className="text-[10px] font-bold uppercase text-red-600 tracking-wider block">
              OFFICIAL GOVERNMENT OF INDIA DIRECTORY
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              National Emergency &amp; Women Safety Numbers
            </h2>
          </div>
          <span className="text-xs text-slate-500">
            Toll-Free &bull; 24/7 Verified Emergency Dispatch
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {INDIA_HELPLINES.map((hl) => (
            <div
              key={hl.number}
              className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs hover:border-slate-300 transition-colors flex flex-col justify-between space-y-3 group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-2xl font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                    {hl.number}
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                    {hl.badge}
                  </span>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-slate-900">{hl.title}</h3>
                  <p className="text-[11px] text-slate-500 font-medium">{hl.authority}</p>
                </div>

                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {hl.purpose}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[10px] text-emerald-700 font-semibold">{hl.timing}</span>
                <a
                  href={`tel:${hl.number}`}
                  className="inline-flex items-center gap-1 font-bold text-blue-600 hover:text-blue-700 hover:underline"
                >
                  <Phone className="h-3 w-3" />
                  <span>Call {hl.number}</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. WORKPLACE LAWS & LEGAL PROTECTIONS (POSH, BNS, LABOR)      */}
      {/* ============================================================ */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pb-2 border-b border-slate-200">
          <div>
            <span className="text-[10px] font-bold uppercase text-blue-600 tracking-wider block">
              STATUTORY WORKPLACE RIGHTS IN INDIA
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              Workplace Safety, POSH Act &amp; Criminal Penalties
            </h2>
          </div>
          <span className="text-xs text-slate-500">
            Know your legal rights under Indian Law
          </span>
        </div>

        <div className="space-y-3">
          {WORKPLACE_LAWS.map((law, idx) => {
            const isExpanded = expandedLaw === idx;
            return (
              <div
                key={law.act}
                className="rounded-xl bg-white border border-slate-200 shadow-xs overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setExpandedLaw(isExpanded ? null : idx)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-slate-50/80 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold shrink-0">
                      <Scale className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{law.act}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">{law.fullName}</p>
                    </div>
                  </div>

                  <div className="text-slate-400 p-1">
                    {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-5 pb-5 pt-2 border-t border-slate-100 bg-slate-50/40 space-y-3">
                    <div className="space-y-2 text-xs">
                      {law.keyPoints.map((point, pIdx) => {
                        const [title, desc] = point.split(':');
                        return (
                          <div
                            key={pIdx}
                            className="p-3 rounded-lg bg-white border border-slate-200 text-slate-700 leading-relaxed flex items-start gap-2.5"
                          >
                            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                            <div>
                              {desc ? (
                                <>
                                  <strong className="text-slate-900">{title}:</strong>
                                  <span>{desc}</span>
                                </>
                              ) : (
                                <span>{point}</span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Step-by-Step SOP Card: How to file a POSH complaint */}
        <div className="p-5 sm:p-6 rounded-xl bg-blue-50/40 border border-blue-200 space-y-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-blue-100 text-blue-700 shrink-0">
              <Briefcase className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Standard Operating Procedure: How to File a POSH Complaint
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Recommended legal steps to ensure your case is documented and investigated without prejudice.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
            <div className="p-3.5 rounded-lg bg-white border border-blue-100 space-y-1">
              <span className="font-bold text-blue-700 text-[10px] uppercase">Step 1 &bull; Document</span>
              <p className="font-semibold text-slate-900">Contemporaneous Records</p>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Log exact dates, times, statements, locations, and any bystander witnesses. Save screenshots to a personal drive.
              </p>
            </div>

            <div className="p-3.5 rounded-lg bg-white border border-blue-100 space-y-1">
              <span className="font-bold text-blue-700 text-[10px] uppercase">Step 2 &bull; Submit</span>
              <p className="font-semibold text-slate-900">Submit to IC / LC</p>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Submit a written complaint to the Internal Committee within 3 months of incident. Request written acknowledgment.
              </p>
            </div>

            <div className="p-3.5 rounded-lg bg-white border border-blue-100 space-y-1">
              <span className="font-bold text-blue-700 text-[10px] uppercase">Step 3 &bull; Safeguard</span>
              <p className="font-semibold text-slate-900">Request Interim Relief</p>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Exercise right to up to 3 months paid leave or transfer if continued proximity causes distress or appraisal threats.
              </p>
            </div>

            <div className="p-3.5 rounded-lg bg-white border border-blue-100 space-y-1">
              <span className="font-bold text-blue-700 text-[10px] uppercase">Step 4 &bull; Inquire</span>
              <p className="font-semibold text-slate-900">90-Day Closure</p>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                IC must conclude inquiry within 90 days. Management must enforce penalties or action within 60 days of report.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. INTERACTIVE PREPAREDNESS LAB: SOS & Hardware Simulation   */}
      {/* ============================================================ */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pb-2 border-b border-slate-200">
          <div>
            <span className="text-[10px] font-bold uppercase text-blue-600 tracking-wider block">
              INTERACTIVE PREPAREDNESS LAB
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              Test Emergency Hardware &amp; Deterrence Tools
            </h2>
          </div>
          <span className="text-xs text-slate-500">
            Zero-risk browser simulation
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Module 1: SOS Simulator */}
          <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-lg bg-red-50 text-red-600 flex items-center justify-center font-bold">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">SOS Dispatch Simulator</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Tests the 3-second abort guard, GPS lock telemetry, and simulated contact dispatch.
              </p>
            </div>

            <div className="pt-2">
              {simulatingSos ? (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-center space-y-2">
                  <div className="w-10 h-10 rounded-full bg-red-600 text-white font-bold text-lg flex items-center justify-center mx-auto animate-pulse">
                    {countdown}
                  </div>
                  <p className="text-xs font-semibold text-red-700">Arming GPS broadcast...</p>
                  <button
                    onClick={handleStartSosSimulation}
                    className="text-xs text-slate-600 underline"
                  >
                    Abort
                  </button>
                </div>
              ) : simDispatched ? (
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-center space-y-1">
                  <CheckCircle2 className="h-6 w-6 text-emerald-600 mx-auto" />
                  <p className="text-xs font-bold text-emerald-800">Distress Dispatched (Simulated)</p>
                  <button
                    onClick={handleStartSosSimulation}
                    className="text-xs text-blue-600 font-semibold underline pt-1 block mx-auto"
                  >
                    Reset
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleStartSosSimulation}
                  className="w-full py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold text-xs transition-colors"
                >
                  Test 3s SOS Trigger
                </button>
              )}
            </div>
          </div>

          {/* Module 2: National Helpline 112 */}
          <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">National Emergency Line (112)</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Integrated Emergency Response Support System (ERSS) across India for police, fire, and medical aid.
              </p>
            </div>

            <div className="pt-2">
              <a
                href="tel:112"
                className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <Phone className="h-3.5 w-3.5" />
                <span>Call Emergency 112</span>
              </a>
            </div>
          </div>

          {/* Module 3: Discreet Fake Call */}
          <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Phone className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Discreet Fake Call</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Realistic incoming phone screen with synthesized conversation to deter followers.
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setFakeCallOpen(true)}
                className="w-full py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition-colors"
              >
                Simulate Incoming Call
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Global Modals for interactive testing */}
      <SosModal isOpen={sosModalOpen} onClose={() => setSosModalOpen(false)} />
      <FakeCallModal isOpen={fakeCallOpen} onClose={() => setFakeCallOpen(false)} />
    </div>
  );
}
