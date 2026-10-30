'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Phone,
  ArrowRight,
  Users,
  Lock,
  CheckCircle2,
  ChevronRight,
  Radio,
  Clock,
  MapPin,
  HelpCircle,
  Building2,
  Share2,
  FileText,
  Volume2,
  X,
  ExternalLink,
} from 'lucide-react';
import { PostCard, type PostItem, getCategoryName } from '@/components/PostCard';
import { type Category } from '@/lib/api-client';
import { PostCardSkeleton } from '@/components/ui/Skeleton';
import { Logo } from '@/components/ui/Logo';

interface PublicLandingProps {
  posts?: PostItem[];
  categories?: Category[];
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  onOpenSos: () => void;
  onOpenFakeCall: () => void;
}

export function PublicLanding({
  posts = [],
  categories = [],
  loading = false,
  error = null,
  onRetry,
  onOpenSos,
  onOpenFakeCall,
}: PublicLandingProps) {
  // Simulator State
  const [simulatorMode, setSimulatorMode] = useState<'sos' | 'fakecall' | 'campus'>('sos');
  const [demoSosCountdown, setDemoSosCountdown] = useState<number | null>(null);
  const [demoSosSent, setDemoSosSent] = useState(false);
  const [fakeCallRinging, setFakeCallRinging] = useState(false);
  const [fakeCallAnswered, setFakeCallAnswered] = useState(false);

  // Selected Category Filter for Feed Preview
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Interactive Demo SOS Handler
  const handleTriggerDemoSos = () => {
    if (demoSosCountdown !== null || demoSosSent) {
      setDemoSosCountdown(null);
      setDemoSosSent(false);
      return;
    }
    setDemoSosCountdown(3);
    const t1 = setTimeout(() => setDemoSosCountdown(2), 1000);
    const t2 = setTimeout(() => setDemoSosCountdown(1), 2000);
    const t3 = setTimeout(() => {
      setDemoSosCountdown(null);
      setDemoSosSent(true);
    }, 3000);
  };

  // Interactive Demo Fake Call Handler
  const handleToggleDemoFakeCall = () => {
    if (fakeCallRinging || fakeCallAnswered) {
      setFakeCallRinging(false);
      setFakeCallAnswered(false);
      return;
    }
    setFakeCallRinging(true);
  };

  // Filter posts
  const filteredPosts = (posts || []).filter((p) => {
    if (selectedCategory === 'All') return true;
    const cat = getCategoryName(p.category || (p as any).categoryName);
    return cat.toLowerCase() === selectedCategory.toLowerCase();
  });

  return (
    <div className="space-y-16 pb-20 select-none">
      {/* ─── 1. TOP STATUTORY HELPLINES & OPERATIONAL STATUS TICKER ────── */}
      <div className="bg-slate-900 text-slate-200 text-xs py-2.5 px-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto font-medium">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold text-[11px] uppercase tracking-wider shrink-0">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-400 animate-ping" />
            24/7 Helplines
          </span>
          <span className="text-slate-400 hidden md:inline">National Emergency Services:</span>
          <a href="tel:112" className="text-white hover:text-rose-400 font-semibold underline underline-offset-2 shrink-0">
            Police 112
          </a>
          <span className="text-slate-600">•</span>
          <a href="tel:1091" className="text-white hover:text-rose-400 font-semibold underline underline-offset-2 shrink-0">
            Women Helpline 1091
          </a>
          <span className="text-slate-600">•</span>
          <a href="tel:181" className="text-white hover:text-rose-400 font-semibold underline underline-offset-2 shrink-0">
            Domestic Distress 181
          </a>
          <span className="text-slate-600">•</span>
          <a href="tel:1098" className="text-white hover:text-rose-400 font-semibold underline underline-offset-2 shrink-0">
            Childline 1098
          </a>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium shrink-0">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          <span>Sabhijude Mesh: Operational</span>
        </div>
      </div>

      {/* Backend Connection Error Banner (if offline/disconnected) */}
      {error && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
            <div>
              <span className="font-bold">Offline Resilience Mode:</span> Live backend database sync is currently unavailable. Emergency contact links and local deterrence calls remain operable.
            </div>
          </div>
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs transition shrink-0"
            >
              Reconnect Backend
            </button>
          )}
        </div>
      )}

      {/* ─── 2. HERO SECTION: STRICT CIVIC ARCHITECTURE ────────────────── */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        {/* Left Hero Content (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-3 px-3.5 py-1.5 rounded-full bg-slate-900 text-white shadow-md border border-slate-800">
            <Logo size={24} />
            <span className="text-xs font-bold tracking-wide">
              Sabhijude Women Safety Network
            </span>
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
            Real-Time Emergency SOS, Geofenced Campus Response & Anonymous Alerts
          </h1>

          <p className="text-base text-slate-600 leading-relaxed max-w-2xl">
            Sabhijude provides rapid personal protection across transit, campuses, and neighborhoods.
            Instant sub-meter GPS dispatch to emergency circles, discrete simulated exit calls to deter harassment,
            and integrated command desks for university and workplace security.
          </p>

          {/* Action Center: Direct Hardware Tools */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onOpenSos}
              className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-sm transition-all focus:ring-4 focus:ring-rose-200"
            >
              <ShieldAlert className="h-5 w-5" />
              <span>Activate Emergency SOS</span>
            </button>

            <button
              type="button"
              onClick={onOpenFakeCall}
              className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-semibold text-sm shadow-xs transition-colors"
            >
              <Phone className="h-4 w-4 text-emerald-600" />
              <span>Simulate Discrete Call</span>
            </button>

            <Link
              href="/feed"
              className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition-colors"
            >
              <Radio className="h-4 w-4 text-red-500 animate-pulse" />
              <span>Live Reports Feed</span>
            </Link>
          </div>

          {/* Verified Telemetry Strip */}
          <div className="pt-4 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-4 text-slate-800">
            <div>
              <div className="text-2xl font-black text-slate-900">&lt; 3.0s</div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">SOS Dispatch Latency</div>
            </div>
            <div>
              <div className="text-2xl font-black text-blue-600">Sub-meter</div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">GPS Pin Accuracy</div>
            </div>
            <div>
              <div className="text-2xl font-black text-emerald-600">100%</div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">Anonymous Reports</div>
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900">24/7</div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">Campus Desk Ready</div>
            </div>
          </div>
        </div>

        {/* Right Hero: Hardware Interactive Simulator (5 cols) */}
        <div className="lg:col-span-5">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl text-white space-y-4">
            {/* Simulator Header Tabs */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-bold text-slate-300">Live Device Simulation</span>
              </div>
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-[11px] font-semibold">
                <button
                  type="button"
                  onClick={() => setSimulatorMode('sos')}
                  className={`px-2.5 py-1 rounded transition ${
                    simulatorMode === 'sos' ? 'bg-rose-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  SOS Alert
                </button>
                <button
                  type="button"
                  onClick={() => setSimulatorMode('fakecall')}
                  className={`px-2.5 py-1 rounded transition ${
                    simulatorMode === 'fakecall' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Discrete Call
                </button>
                <button
                  type="button"
                  onClick={() => setSimulatorMode('campus')}
                  className={`px-2.5 py-1 rounded transition ${
                    simulatorMode === 'campus' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Campus Desk
                </button>
              </div>
            </div>

            {/* Mode A: SOS Simulator */}
            {simulatorMode === 'sos' && (
              <div className="space-y-4 py-2">
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between text-slate-400 text-[11px]">
                    <span>STATUS: {demoSosSent ? 'DISPATCHED' : demoSosCountdown !== null ? 'COUNTDOWN' : 'STANDBY'}</span>
                    <span>BATTERY: 88%</span>
                  </div>
                  <div className="p-2.5 rounded bg-slate-900 border border-slate-800 text-slate-300 text-[11px] leading-relaxed">
                    {demoSosSent ? (
                      <span className="text-emerald-400 font-sans">
                        ✓ Dispatched: "EMERGENCY SOS: Immediate danger reported. Live coordinates: 17.4435° N, 78.3842° E. Dispatched to 3 trusted contacts & WhatsApp."
                      </span>
                    ) : demoSosCountdown !== null ? (
                      <span className="text-rose-400 font-sans font-bold">
                        Triggering dispatch in {demoSosCountdown}s... Press Cancel to abort.
                      </span>
                    ) : (
                      <span className="text-slate-400 font-sans">
                        Press button below to test the 3-second safeguard dispatch broadcast.
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-500 font-sans">
                    GPS Coordinates: 17.4435° N, 78.3842° E (High Accuracy)
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleTriggerDemoSos}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                      demoSosSent
                        ? 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                        : demoSosCountdown !== null
                        ? 'bg-rose-700 text-white animate-pulse'
                        : 'bg-rose-600 hover:bg-rose-500 text-white'
                    }`}
                  >
                    <ShieldAlert size={15} />
                    <span>
                      {demoSosSent
                        ? 'Reset Demo'
                        : demoSosCountdown !== null
                        ? `Cancel Dispatch (${demoSosCountdown}s)`
                        : 'Simulate SOS Button Press'}
                    </span>
                  </button>
                </div>
              </div>
            )}

            {/* Mode B: Fake Call Simulator */}
            {simulatorMode === 'fakecall' && (
              <div className="space-y-4 py-2">
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-slate-800 text-emerald-400 flex items-center justify-center mx-auto">
                    <Phone size={22} className={fakeCallRinging ? 'animate-bounce text-emerald-400' : ''} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      {fakeCallAnswered ? 'Call Connected (00:14)' : fakeCallRinging ? 'Incoming Call...' : 'Discrete Deterrence Standby'}
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {fakeCallAnswered
                        ? 'Speaker: "Hey, I\'m right outside in the car waiting for you."'
                        : fakeCallRinging
                        ? 'Contact: Dad / Family Member'
                        : 'Produces realistic ringtone and speech script to exit uncomfortable situations safely.'}
                    </p>
                  </div>
                  {fakeCallRinging && !fakeCallAnswered && (
                    <div className="flex items-center justify-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setFakeCallAnswered(true)}
                        className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition"
                      >
                        Accept Call
                      </button>
                      <button
                        type="button"
                        onClick={handleToggleDemoFakeCall}
                        className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition"
                      >
                        Decline
                      </button>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleToggleDemoFakeCall}
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center justify-center gap-2"
                >
                  <Phone size={15} />
                  <span>{fakeCallRinging || fakeCallAnswered ? 'End Call Simulation' : 'Ring My Phone Now'}</span>
                </button>
              </div>
            )}

            {/* Mode C: Campus Desk Simulator */}
            {simulatorMode === 'campus' && (
              <div className="space-y-4 py-2">
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-400 text-[11px]">
                    <span className="text-blue-400 font-bold">CAMPUS COMMAND DESK</span>
                    <span>ONLINE</span>
                  </div>
                  <div className="space-y-1.5 text-[11px] text-slate-300">
                    <div className="p-2 rounded bg-slate-900 border border-slate-800 flex items-center justify-between">
                      <span>• South Gate Night Escort</span>
                      <span className="text-emerald-400 font-bold">DISPATCHED</span>
                    </div>
                    <div className="p-2 rounded bg-slate-900 border border-slate-800 flex items-center justify-between">
                      <span>• Library Footpath Light Failure</span>
                      <span className="text-amber-400 font-bold">LOGGED</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400 pt-1 leading-relaxed">
                    Universities deploy Sabhijude to route student panic alerts directly to campus guard desks.
                  </p>
                </div>

                <Link
                  href="/organization-request"
                  className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition flex items-center justify-center gap-2"
                >
                  <Building2 size={15} />
                  <span>Explore Campus Onboarding</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ─── 3. THE 4 OPERATIONAL SAFETY PILLARS ────────────────────────── */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Engineered for High-Pressure Safety Decisions
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Four interconnected protective mechanisms designed for rapid execution when seconds count.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Pillar 1 */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs hover:border-slate-300 transition space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Immediate GPS SOS</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                One-tap activation with a 3-second abort buffer. Broadcasts real-time Google Maps coordinates, phone battery level, and emergency SMS alerts to your circle.
              </p>
            </div>
            <button
              type="button"
              onClick={onOpenSos}
              className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 pt-2"
            >
              <span>Test SOS Dialog</span>
              <ChevronRight size={14} />
            </button>
          </div>

          {/* Pillar 2 */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs hover:border-slate-300 transition space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Phone className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Discrete Deterrence Call</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Trigger a realistic simulated phone call with natural audio prompts. Provides a socially discrete, face-saving excuse to immediately exit suspicious taxis, lifts, or gatherings.
              </p>
            </div>
            <button
              type="button"
              onClick={onOpenFakeCall}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 pt-2"
            >
              <span>Trigger Fake Call</span>
              <ChevronRight size={14} />
            </button>
          </div>

          {/* Pillar 3 */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs hover:border-slate-300 transition space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Users className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Anonymous Civic Mesh</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Report stalking, broken streetlights, or harassment hotspots. Verified by civic moderators with 100% pseudonymity, protecting you from retaliation.
              </p>
            </div>
            <Link
              href="/feed"
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 pt-2"
            >
              <span>Explore Public Mesh</span>
              <ChevronRight size={14} />
            </Link>
          </div>

          {/* Pillar 4 */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs hover:border-slate-300 transition space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Building2 className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Campus Command Desks</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Dedicated incident command portals for college campuses and workplaces. Directly dispatch verified internal security patrols to students in distress.
              </p>
            </div>
            <Link
              href="/organization-request"
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 pt-2"
            >
              <span>Request Onboarding</span>
              <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── 4. INSTITUTIONAL & CAMPUS ONBOARDING PARTNERSHIP BANNER ────── */}
      <section className="bg-slate-900 text-white border border-slate-800 rounded-2xl p-6 sm:p-10 shadow-sm relative overflow-hidden">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-wider">
              <Building2 className="h-3.5 w-3.5" />
              <span>Campus & Enterprise Safety Program</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Are You a Dean of Student Welfare or Campus Security Director?
            </h3>

            <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
              Equip your hostels, academic buildings, and night transit routes with Sabhijude’s geofenced dispatch system.
              Verified student rosters, zero hardware deployment required, and emergency alerts routed directly to your campus control room.
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-400 pt-1">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={15} className="text-emerald-400" />
                24-Hour Admin Provisioning
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={15} className="text-emerald-400" />
                Multi-Officer Patrol Dispatch
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={15} className="text-emerald-400" />
                Official @domain Verification
              </span>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
            <Link
              href="/organization-request"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-sm transition"
            >
              <Building2 size={16} />
              <span>Submit Campus Onboarding Request</span>
            </Link>

            <Link
              href="/org/login"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs transition"
            >
              <span>Security Officer Console Sign In</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── 5. LIVE INCIDENT FEED PREVIEW ─────────────────────────────── */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500 animate-ping" />
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Live Community Incident Mesh
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Verified anonymous community alerts and neighborhood safety warnings.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
            {['All', 'Harassment', 'Stalking', 'Lighting', 'Unsafe Area'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white font-bold'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Posts Rendering Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <PostCardSkeleton />
            <PostCardSkeleton />
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-10 text-center space-y-3">
            <Radio className="h-8 w-8 text-slate-400 mx-auto" />
            <h4 className="text-sm font-bold text-slate-800">No active incidents reported in this category</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Our community moderation mesh filters spam and validates genuine reports.
            </p>
            <div className="pt-2">
              <Link
                href="/report"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition"
              >
                <span>Report a Safety Incident Anonymously</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPosts.slice(0, 4).map((post) => (
              <PostCard
                key={post.id}
                post={post}
              />
            ))}
          </div>
        )}

        {/* View all link */}
        <div className="flex justify-center pt-2">
          <Link
            href="/feed"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-semibold text-xs transition shadow-xs"
          >
            <span>Browse Full Public Incident Feed & Safety Map</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* ─── 6. STATUTORY HELPLINES DIRECTORY ─────────────────────────── */}
      <section className="space-y-6">
        <div className="border-b border-slate-200 pb-3">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Phone size={18} className="text-rose-600" />
            <span>Statutory Emergency Response Directory</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Government emergency helplines operational 24/7 across all states and Union Territories.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <a
            href="tel:112"
            className="bg-white border border-slate-200 hover:border-red-300 p-5 rounded-2xl transition shadow-xs space-y-2 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-2xl font-black text-rose-600 font-mono">112</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
                National Police
              </span>
            </div>
            <h4 className="text-xs font-bold text-slate-900 group-hover:text-rose-600 transition">
              Emergency Response Support System
            </h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Unified emergency services for police dispatch, fire emergencies, and medical ambulances.
            </p>
          </a>

          <a
            href="tel:1091"
            className="bg-white border border-slate-200 hover:border-blue-300 p-5 rounded-2xl transition shadow-xs space-y-2 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-2xl font-black text-blue-600 font-mono">1091</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                Women Helpline
              </span>
            </div>
            <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition">
              24/7 Women in Distress Support
            </h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Immediate police coordination, rescue escorts, and dedicated women cell dispatch.
            </p>
          </a>

          <a
            href="tel:181"
            className="bg-white border border-slate-200 hover:border-indigo-300 p-5 rounded-2xl transition shadow-xs space-y-2 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-2xl font-black text-indigo-600 font-mono">181</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                Domestic Abuse
              </span>
            </div>
            <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition">
              Domestic Violence & Shelter Care
            </h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Legal counsel, psychological first aid, and safe institutional shelter placement.
            </p>
          </a>

          <a
            href="tel:1098"
            className="bg-white border border-slate-200 hover:border-amber-300 p-5 rounded-2xl transition shadow-xs space-y-2 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-2xl font-black text-amber-600 font-mono">1098</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                Childline
              </span>
            </div>
            <h4 className="text-xs font-bold text-slate-900 group-hover:text-amber-600 transition">
              Child Protection & Rescue
            </h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Specialized intervention for minors, runaway youth, and child abuse reporting.
            </p>
          </a>
        </div>
      </section>

      {/* ─── 7. DATA PRIVACY & CRYPTOGRAPHIC COMPLIANCE ────────────────── */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-600">
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <Lock size={15} className="text-blue-600" />
              <span>Zero Standby Location Tracking</span>
            </div>
            <p className="leading-relaxed text-[11px]">
              Your GPS coordinates are never polled or recorded until you explicitly tap Emergency SOS or choose to share your live route with verified trusted contacts.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <Users size={15} className="text-emerald-600" />
              <span>Pseudonymous Incident Mesh</span>
            </div>
            <p className="leading-relaxed text-[11px]">
              Community hazard reports are detached from your identity using randomized pseudonym tokens. Protect your neighborhood without exposing personal profiles.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <Building2 size={15} className="text-indigo-600" />
              <span>Statutory Civic Compliance</span>
            </div>
            <p className="leading-relaxed text-[11px]">
              Built in adherence to personal data privacy standards and national police emergency protocol requirements. We never sell user data.
            </p>
          </div>
        </div>
      </section>

      {/* ─── 8. CIVIC PLATFORM FOOTER ───────────────────────────────────── */}
      <footer className="pt-8 border-t border-slate-200 text-xs text-slate-500 space-y-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              <Logo size={28} />
              <div className="font-bold text-slate-900 text-sm">Sabhijude</div>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Civilian safety mesh and institutional emergency dispatch infrastructure.
            </p>
            <div className="text-[11px] text-slate-400">
              © {new Date().getFullYear()} Sabhijude. All rights reserved.
            </div>
          </div>

          <div className="space-y-2">
            <div className="font-bold text-slate-800">Safety Features</div>
            <ul className="space-y-1.5 text-[11px]">
              <li>
                <button type="button" onClick={onOpenSos} className="hover:text-slate-900 text-left">
                  Emergency SOS
                </button>
              </li>
              <li>
                <button type="button" onClick={onOpenFakeCall} className="hover:text-slate-900 text-left">
                  Discrete Deterrence Call
                </button>
              </li>
              <li>
                <Link href="/feed" className="hover:text-slate-900">
                  Live Public Feed
                </Link>
              </li>
              <li>
                <Link href="/safety-measures" className="hover:text-slate-900">
                  Safety Measures & Tips
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <div className="font-bold text-slate-800">Institutions & Campus</div>
            <ul className="space-y-1.5 text-[11px]">
              <li>
                <Link href="/organization-request" className="text-blue-600 hover:text-blue-800 font-semibold">
                  Request Campus Onboarding
                </Link>
              </li>
              <li>
                <Link href="/org/login" className="hover:text-slate-900">
                  Campus Security Desk Login
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="hover:text-slate-900">
                  Administrative Portal
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <div className="font-bold text-slate-800">Statutory Helplines</div>
            <ul className="space-y-1.5 text-[11px]">
              <li>
                <a href="tel:112" className="text-rose-600 font-bold hover:underline">
                  112 Police Dispatch
                </a>
              </li>
              <li>
                <a href="tel:1091" className="hover:text-slate-900">
                  1091 Women Helpline
                </a>
              </li>
              <li>
                <a href="tel:181" className="hover:text-slate-900">
                  181 Domestic Distress
                </a>
              </li>
              <li>
                <a href="tel:1098" className="hover:text-slate-900">
                  1098 Childline
                </a>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
