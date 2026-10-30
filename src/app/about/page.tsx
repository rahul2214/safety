'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Shield,
  ShieldCheck,
  Lock,
  Sparkles,
  Users,
  EyeOff,
  Zap,
  Phone,
  Heart,
  ChevronDown,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Volume2,
  FileText,
  UserPlus,
  LogIn,
} from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_LIST: FaqItem[] = [
  {
    question: 'How does Sabhijude ensure my complete anonymity?',
    answer:
      'Sabhijude utilizes cryptographic pseudonyms and zero-knowledge privacy architecture. When you share a safety concern or incident report, your real name, email, and phone number are never exposed to the public feed. You can choose whether to display your verified profile name or post as an anonymous community member.',
  },
  {
    question: 'What happens during an Emergency SOS trigger?',
    answer:
      'When you trigger SOS, a 3-second abort countdown begins to prevent accidental presses. Once confirmed, high-precision GPS coordinates are gathered from your device and packaged into an immediate distress dispatch with a direct Google Maps link via WhatsApp and native SMS fallback. You also gain 1-tap access to national emergency hotlines (112, 1091).',
  },
  {
    question: 'How does the Discreet Fake Call deter potential harassers?',
    answer:
      'The Fake Call tool simulates a realistic incoming phone call on your mobile device, complete with standard ringing vibrations, audio ringtones, and caller profiles like "Mom", "Dad", or "Inspector Sharma". When answered, a realistic ongoing call screen displays dialer controls and an active timer, signaling that you are actively on a call.',
  },
  {
    question: 'How does Sabhijude support workplace safety and POSH compliance?',
    answer:
      'Sabhijude incorporates statutory guides for the POSH Act 2013, outlining mandatory Internal Committee (IC) filing rights, 90-day timebound inquiry procedures, employer compliance mandates, and Section 16 non-disclosure confidentiality protections, alongside Bharatiya Nyaya Sanhita (BNS) provisions.',
  },
  {
    question: 'Is Sabhijude free for women and community members?',
    answer:
      'Yes, Sabhijude is 100% free and open for public safety. We believe personal safety and community defense are fundamental rights, and our platform is built without paywalls, commercial trackers, or advertising surveillance.',
  },
  {
    question: 'Can I use Sabhijude on my smartphone without installing an app?',
    answer:
      'Yes! Sabhijude is built as a progressive, highly responsive web application. You can open it in any mobile browser (Safari, Chrome, Firefox) and add it to your home screen for immediate 1-tap launcher access without going through app store downloads.',
  },
];

export default function AboutPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="relative space-y-12 select-none pb-12">
      {/* Background Brand Wash */}
      <div className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 w-[800px] h-[360px] bg-[#6d4aff]/5 blur-3xl z-0" />

      {/* ============================================================ */}
      {/* 1. HERO HEADER: Mission & Vision                             */}
      {/* ============================================================ */}
      <section className="relative z-10 pt-4 sm:pt-8 text-center max-w-3xl mx-auto space-y-5">
      

        <h1 className="text-[32px] sm:text-[44px] md:text-[50px] font-[900] tracking-[-1px] leading-[1.15] text-[#16161d] dark:text-[#f4f4f8]">
          Engineered for Women&rsquo;s Peace of Mind.{' '}
          <span className="text-[#6d4aff]">
            Every Step of the Way.
          </span>
        </h1>

        <p className="text-[15px] sm:text-[17px] text-[#5b5b6e] dark:text-[#a6a6be] leading-relaxed max-w-2xl mx-auto font-normal">
          Sabhijude is a women-first situational safety and community defense network.
          We bridge the critical gap between early discomfort, immediate deterrence, and emergency rescue
          with rapid GPS alerts, psychological defense tools, and peer-verified intelligence.
        </p>

        {/* Quick Nav Action Buttons */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/safety-measures"
            className="px-5 py-2.5 rounded-[14px] bg-[#6d4aff] hover:bg-[#5325e8] text-white font-bold text-xs shadow-md transition flex items-center gap-1.5"
          >
            <ShieldCheck className="h-4 w-4" />
            <span>Explore Safety Measures</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <Link
            href="/signup"
            className="px-5 py-2.5 rounded-[14px] bg-white dark:bg-[#141420] border border-[#e8e8f0] dark:border-[#26263a] hover:border-[#6d4aff] text-[#16161d] dark:text-[#f4f4f8] font-bold text-xs shadow-2xs transition flex items-center gap-1.5"
          >
            <UserPlus className="h-4 w-4 text-[#6d4aff]" />
            <span>Create Free Account</span>
          </Link>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. THE PROBLEM WE SOLVE                                       */}
      {/* ============================================================ */}
      <section className="relative z-10 bg-white dark:bg-[#141420] rounded-[24px] border border-[#e8e8f0] dark:border-[#26263a] p-6 sm:p-9 shadow-sm space-y-6">
        <div className="max-w-2xl space-y-2">
          <span className="text-[11px] font-black uppercase text-[#e11d48] tracking-[1.5px] block">
            WHY CONVENTIONAL SAFETY APPS FALL SHORT
          </span>
          <h2 className="text-[22px] sm:text-[26px] font-black text-[#16161d] dark:text-[#f4f4f8] tracking-tight">
            The Critical 90 Seconds Before Escalation
          </h2>
          <p className="text-[13.5px] text-[#5b5b6e] dark:text-[#a6a6be] leading-relaxed">
            Most emergency tools only activate when physical violence is already underway.
            Sabhijude was engineered from the ground up to address the <em>pre-crisis window</em>—when you notice
            a dark alley, an unverified cab driver, a pursuer, or a tense transit interchange.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-5 rounded-[20px] bg-[#f7f7fa] dark:bg-[#1d1d2c] border border-[#e8e8f0] dark:border-[#26263a] space-y-3">
            <div className="w-10 h-10 rounded-[12px] bg-[#fdeef6] text-[#e11d48] flex items-center justify-center font-black">
              01
            </div>
            <h3 className="text-[16px] font-bold text-[#16161d] dark:text-[#f4f4f8]">
              Too Late For Calls
            </h3>
            <p className="text-xs text-[#5b5b6e] dark:text-[#a6a6be] leading-relaxed">
              When followed or cornered, typing a message or calling relatives often provokes immediate aggression.
              Discreet haptic triggers and synthesized dialogue neutralize threats without raising suspicion.
            </p>
          </div>

          <div className="p-5 rounded-[20px] bg-[#f7f7fa] dark:bg-[#1d1d2c] border border-[#e8e8f0] dark:border-[#26263a] space-y-3">
            <div className="w-10 h-10 rounded-[12px] bg-[#f1edff] text-[#6d4aff] flex items-center justify-center font-black">
              02
            </div>
            <h3 className="text-[16px] font-bold text-[#16161d] dark:text-[#f4f4f8]">
              Invasive Tracking Fears
            </h3>
            <p className="text-xs text-[#5b5b6e] dark:text-[#a6a6be] leading-relaxed">
              Women frequently disable legacy tracking apps because they broadcast daily whereabouts.
              Sabhijude strictly practices Zero-Knowledge privacy—your location is only accessed when you explicitly dispatch SOS.
            </p>
          </div>

          <div className="p-5 rounded-[20px] bg-[#f7f7fa] dark:bg-[#1d1d2c] border border-[#e8e8f0] dark:border-[#26263a] space-y-3">
            <div className="w-10 h-10 rounded-[12px] bg-[#ecfdf5] text-[#059669] flex items-center justify-center font-black">
              03
            </div>
            <h3 className="text-[16px] font-bold text-[#16161d] dark:text-[#f4f4f8]">
              Isolated Individuals
            </h3>
            <p className="text-xs text-[#5b5b6e] dark:text-[#a6a6be] leading-relaxed">
              Safety isn&rsquo;t just personal; it&rsquo;s collective. By pooling anonymous alerts about unlit roads,
              suspicious vehicles, and safe shelters, thousands of women protect each other before incidents happen.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. CORE ARCHITECTURAL PILLARS                                */}
      {/* ============================================================ */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-[11px] font-black uppercase text-[#6d4aff] tracking-[1.5px] block">
            HOW SABHIJUDE PROTECTS YOU
          </span>
          <h2 className="text-[24px] sm:text-[28px] font-black text-[#16161d] dark:text-[#f4f4f8] tracking-tight">
            Our Four Core Defense Pillars
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Pillar 1 */}
          <div className="p-6 rounded-[22px] bg-white dark:bg-[#141420] border border-[#e8e8f0] dark:border-[#26263a] shadow-sm space-y-3 flex flex-col justify-between">
            <div className="space-y-2.5">
              <div className="w-11 h-11 rounded-[14px] bg-[#f1edff] dark:bg-[#241a4d] text-[#6d4aff] flex items-center justify-center">
                <Lock className="h-5 w-5" />
              </div>
              <h3 className="text-[18px] font-bold text-[#16161d] dark:text-[#f4f4f8]">
                1. Zero-Knowledge Identity &amp; Privacy
              </h3>
              <p className="text-xs text-[#5b5b6e] dark:text-[#a6a6be] leading-relaxed">
                Your personal details never leak. Incident reports are published under cryptographic pseudonyms,
                and location metadata is scrubbed after emergency delivery. Zero data monetization, zero third-party brokers.
              </p>
            </div>
            <div className="pt-2 text-xs font-bold text-[#6d4aff] flex items-center gap-1">
              <span>Cryptographic Anonymity</span>
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="p-6 rounded-[22px] bg-white dark:bg-[#141420] border border-[#e8e8f0] dark:border-[#26263a] shadow-sm space-y-3 flex flex-col justify-between">
            <div className="space-y-2.5">
              <div className="w-11 h-11 rounded-[14px] bg-[#fdeef6] dark:bg-[#3b0f2b] text-[#e11d48] flex items-center justify-center">
                <Zap className="h-5 w-5" />
              </div>
              <h3 className="text-[18px] font-bold text-[#16161d] dark:text-[#f4f4f8]">
                2. Sub-3-Second Dual-Channel SOS
              </h3>
              <p className="text-xs text-[#5b5b6e] dark:text-[#a6a6be] leading-relaxed">
                A single tap initiates our low-latency distress protocol. Live GPS pins with Google Maps integration
                broadcast simultaneously through WhatsApp and native SMS, guaranteeing reach even in low-data network zones.
              </p>
            </div>
            <div className="pt-2 text-xs font-bold text-[#e11d48] flex items-center gap-1">
              <span>Instant Emergency Escalation</span>
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="p-6 rounded-[22px] bg-white dark:bg-[#141420] border border-[#e8e8f0] dark:border-[#26263a] shadow-sm space-y-3 flex flex-col justify-between">
            <div className="space-y-2.5">
              <div className="w-11 h-11 rounded-[14px] bg-[#ecfdf5] dark:bg-[#064e3b] text-[#059669] flex items-center justify-center">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="text-[18px] font-bold text-[#16161d] dark:text-[#f4f4f8]">
                3. Statutory POSH & Legal Compliance
              </h3>
              <p className="text-xs text-[#5b5b6e] dark:text-[#a6a6be] leading-relaxed">
                Clear statutory guidance under the POSH Act 2013 and Bharatiya Nyaya Sanhita (BNS). Access structured frameworks for Internal Committee escalations, 90-day timebound inquiries, and strict Section 16 identity confidentiality.
              </p>
            </div>
            <div className="pt-2 text-xs font-bold text-[#059669] flex items-center gap-1">
              <span>Statutory Legal Protection</span>
            </div>
          </div>

          {/* Pillar 4 */}
          <div className="p-6 rounded-[22px] bg-white dark:bg-[#141420] border border-[#e8e8f0] dark:border-[#26263a] shadow-sm space-y-3 flex flex-col justify-between">
            <div className="space-y-2.5">
              <div className="w-11 h-11 rounded-[14px] bg-[#f1f1f6] dark:bg-[#1d1d2c] text-[#e0308e] flex items-center justify-center">
                <Users className="h-5 w-5" />
              </div>
              <h3 className="text-[18px] font-bold text-[#16161d] dark:text-[#f4f4f8]">
                4. Peer-Verified Collective Mesh
              </h3>
              <p className="text-xs text-[#5b5b6e] dark:text-[#a6a6be] leading-relaxed">
                A community-moderated safety feed where verified members confirm incidents, share safe alternative paths,
                and flag infrastructure hazards like malfunctioning street lighting or isolated bus stations.
              </p>
            </div>
            <div className="pt-2 text-xs font-bold text-[#e0308e] flex items-center gap-1">
              <span>Community-Driven Defense</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. TECHNICAL & INDUSTRIAL COMPLIANCE                         */}
      {/* ============================================================ */}
      <section className="bg-white dark:bg-[#141420] rounded-[24px] border border-[#e8e8f0] dark:border-[#26263a] p-6 sm:p-8 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[11px] font-black uppercase text-[#6d4aff] tracking-[1.5px] block">
              INDUSTRIAL STANDARDS &amp; ARCHITECTURE
            </span>
            <h3 className="text-[20px] font-black text-[#16161d] dark:text-[#f4f4f8]">
              Built with Modern Resilience
            </h3>
          </div>
          <span className="px-3 py-1 rounded-full bg-[#ecfdf5] text-[#059669] text-xs font-bold self-start sm:self-auto">
            100% Cloud Native &amp; Encrypted
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          <div className="p-3.5 rounded-[16px] bg-[#f7f7fa] dark:bg-[#1d1d2c] border border-[#e8e8f0] dark:border-[#26263a] space-y-1">
            <span className="text-xs font-bold text-[#16161d] dark:text-white block">Google Cloud Run</span>
            <p className="text-[11px] text-[#5b5b6e] dark:text-[#a6a6be]">Auto-scaling backend with 99.9% uptime</p>
          </div>

          <div className="p-3.5 rounded-[16px] bg-[#f7f7fa] dark:bg-[#1d1d2c] border border-[#e8e8f0] dark:border-[#26263a] space-y-1">
            <span className="text-xs font-bold text-[#16161d] dark:text-white block">Geolocation API</span>
            <p className="text-[11px] text-[#5b5b6e] dark:text-[#a6a6be]">Hardware GPS lock with pinpoint precision</p>
          </div>

          <div className="p-3.5 rounded-[16px] bg-[#f7f7fa] dark:bg-[#1d1d2c] border border-[#e8e8f0] dark:border-[#26263a] space-y-1">
            <span className="text-xs font-bold text-[#16161d] dark:text-white block">Speech Synthesis</span>
            <p className="text-[11px] text-[#5b5b6e] dark:text-[#a6a6be]">Dynamic audio dialogue for deterrence calls</p>
          </div>

          <div className="p-3.5 rounded-[16px] bg-[#f7f7fa] dark:bg-[#1d1d2c] border border-[#e8e8f0] dark:border-[#26263a] space-y-1">
            <span className="text-xs font-bold text-[#16161d] dark:text-white block">JWT &amp; PostgreSQL</span>
            <p className="text-[11px] text-[#5b5b6e] dark:text-[#a6a6be]">Row-level security and encrypted storage</p>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4B. NATIONAL LEGAL ALIGNMENT & INDIA INFRASTRUCTURE          */}
      {/* ============================================================ */}
      <section className="bg-white dark:bg-[#141420] rounded-[24px] border border-[#e8e8f0] dark:border-[#26263a] p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-[11px] font-black uppercase text-[#e11d48] tracking-[1.5px] block">
              NATIONAL COMPLIANCE &amp; LEGAL PROTECTIONS
            </span>
            <h3 className="text-[20px] font-black text-[#16161d] dark:text-[#f4f4f8]">
              Aligned with Indian Statutory Frameworks
            </h3>
          </div>
          <Link
            href="/safety-measures"
            className="text-xs font-bold text-[#6d4aff] hover:underline flex items-center gap-1"
          >
            <span>View all 8 Indian Helplines &rarr;</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1 text-xs text-[#5b5b6e] dark:text-[#a6a6be]">
          <div className="p-4 rounded-[16px] bg-[#f7f7fa] dark:bg-[#1d1d2c] border border-[#e8e8f0] dark:border-[#26263a] space-y-1.5">
            <span className="font-bold text-[#16161d] dark:text-white block text-sm">
              The POSH Act, 2013
            </span>
            <p className="leading-relaxed text-[11px]">
              Supports workplace safety documentation. Aligned with Internal Committee (IC) 90-day inquiry protocols and Section 16 strict confidentiality protections.
            </p>
          </div>

          <div className="p-4 rounded-[16px] bg-[#f7f7fa] dark:bg-[#1d1d2c] border border-[#e8e8f0] dark:border-[#26263a] space-y-1.5">
            <span className="font-bold text-[#16161d] dark:text-white block text-sm">
              Emergency Response Support (112)
            </span>
            <p className="leading-relaxed text-[11px]">
              Direct cellular speed-dials to National ERSS 112, Women Safety 1091, Women in Distress 181, and Cyber Crime Helpline 1930.
            </p>
          </div>

          <div className="p-4 rounded-[16px] bg-[#f7f7fa] dark:bg-[#1d1d2c] border border-[#e8e8f0] dark:border-[#26263a] space-y-1.5">
            <span className="font-bold text-[#16161d] dark:text-white block text-sm">
              BNS &amp; IPC Criminal Codes
            </span>
            <p className="leading-relaxed text-[11px]">
              Incident categories are mapped directly against Section 75 (Sexual Harassment), Section 78 (Stalking), and Section 79 (Insult to Modesty) of Bharatiya Nyaya Sanhita.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 5. FREQUENTLY ASKED QUESTIONS (FAQ)                          */}
      {/* ============================================================ */}
      <section className="space-y-4">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <span className="text-[11px] font-black uppercase text-[#6d4aff] tracking-[1.5px] block">
            QUESTIONS &amp; CLARIFICATIONS
          </span>
          <h2 className="text-[22px] sm:text-[26px] font-black text-[#16161d] dark:text-[#f4f4f8] tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-2.5 max-w-3xl mx-auto">
          {FAQ_LIST.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={faq.question}
                className="rounded-[18px] bg-white dark:bg-[#141420] border border-[#e8e8f0] dark:border-[#26263a] overflow-hidden transition-all shadow-2xs"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="w-full p-4.5 text-left flex items-center justify-between gap-3 cursor-pointer hover:bg-[#f7f7fa] dark:hover:bg-[#1d1d2c] transition-colors"
                >
                  <span className="text-[14px] font-bold text-[#16161d] dark:text-[#f4f4f8]">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 text-[#6d4aff] shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4.5 pb-4 pt-1 text-[13px] text-[#5b5b6e] dark:text-[#a6a6be] leading-relaxed border-t border-[#f1f1f6] dark:border-[#202030]">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ============================================================ */}
      {/* 6. CONVERSION FOOTER BANNER                                  */}
      {/* ============================================================ */}
      <section className="relative rounded-[24px] bg-[#6d4aff] text-white p-7 sm:p-10 shadow-lg text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6 overflow-hidden">
        <div className="pointer-events-none absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-2xl" />

        <div className="relative z-10 space-y-2 max-w-xl">
          <h3 className="text-[24px] sm:text-[28px] font-black tracking-tight leading-tight">
            Ready to explore our complete defense suite?
          </h3>
          <p className="text-white/85 text-[13.5px]">
            Test our live emergency triggers, deterrence tools, and verified hotlines on the Safety Measures page.
          </p>
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
          <Link
            href="/safety-measures"
            className="w-full sm:w-auto px-6 py-3.5 rounded-[16px] bg-white text-[#6d4aff] font-black text-xs hover:bg-[#f7f7fa] transition shadow-md active:scale-95 text-center"
          >
            Safety Measures Guide
          </Link>
          <Link
            href="/signup"
            className="w-full sm:w-auto px-6 py-3.5 rounded-[16px] bg-white/15 hover:bg-white/25 text-white font-bold text-xs border border-white/20 transition text-center"
          >
            Join Free
          </Link>
        </div>
      </section>
    </div>
  );
}
