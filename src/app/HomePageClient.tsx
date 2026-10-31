'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldAlert,
  AlertTriangle,
  MapPin,
  Share2,
  Users,
  FileText,
  AlertCircle,
  Phone,
  ArrowRight,
  Clock,
  CheckCircle2,
  Circle,
  Bell,
  BookOpen,
  MessageCircle,
  Heart,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/components/Toast';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Modal } from '@/components/ui/Modal';
import { PublicLanding } from '@/components/PublicLanding';
import { SosModal } from '@/components/SosModal';
import { FakeCallModal } from '@/components/FakeCallModal';
import { api, type Category, type EmergencyContact, type NotificationItem } from '@/lib/api-client';
import { getCurrentCoordinates, buildEmergencySosText, buildWhatsAppLink } from '@/lib/location';
import { PostCardSkeleton } from '@/components/ui/Skeleton';

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function timeAgo(iso?: string) {
  if (!iso) return 'Recently';
  const diff = Date.now() - new Date(iso).getTime();
  if (Number.isNaN(diff)) return 'Recently';
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'Just now';
  if (m < 60) return `${m} min ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} h ago`;
  return `${Math.floor(h / 24)} d ago`;
}

export function HomePageClient() {
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [sosModalOpen, setSosModalOpen] = useState(false);
  const [fakeCallOpen, setFakeCallOpen] = useState(false);
  const [sosConfirmOpen, setSosConfirmOpen] = useState(false);
  const [shareLocationLoading, setShareLocationLoading] = useState(false);

  const [categories, setCategories] = useState<Category[]>([]);
  const [recentReports, setRecentReports] = useState<any[]>([]);
  const [contacts, setContacts] = useState<EmergencyContact[] | null>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboardData = async () => {
    setLoadingData(true);
    setError(null);
    try {
      const [catRes, feedRes] = await Promise.all([api.getCategories(), api.getFeed({ limit: 4 })]);

      if (catRes.ok && catRes.data) {
        setCategories(catRes.data);
      }
      if (feedRes.ok && feedRes.data) {
        setRecentReports(feedRes.data);
      }

      if (!catRes.ok || !feedRes.ok) {
        const err = feedRes.error || catRes.error || 'Unable to connect to the Sabhijude database server.';
        setError(err);
      }
    } catch (err: any) {
      console.warn('Failed to load dashboard data:', err);
      setError(err?.message || 'Unable to connect to backend server. Please verify backend API is running.');
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Personal data only exists for signed-in members
  useEffect(() => {
    if (!isAuthenticated) return;
    api
      .getEmergencyContacts()
      .then((res) => setContacts(res.ok && Array.isArray(res.data) ? res.data : []))
      .catch(() => setContacts([]));
    api
      .getNotifications()
      .then((res) => res.ok && Array.isArray(res.data) && setNotifications(res.data))
      .catch(() => undefined);
  }, [isAuthenticated]);

  const handleShareLiveLocation = async () => {
    setShareLocationLoading(true);
    try {
      const coords = await getCurrentCoordinates();
      const msg = buildEmergencySosText(coords);
      const url = buildWhatsAppLink('', msg);
      window.open(url, '_blank');
      showToast('Live GPS location link created. Dispatched to WhatsApp.', 'success');
    } catch (err: any) {
      showToast(err.message || 'Unable to retrieve device GPS coordinates.', 'error');
    } finally {
      setShareLocationLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <>
        <PublicLanding
          posts={recentReports as any}
          categories={categories}
          loading={loadingData}
          error={error}
          onRetry={() => loadDashboardData()}
          onOpenSos={() => setSosModalOpen(true)}
          onOpenFakeCall={() => setFakeCallOpen(true)}
        />
        <SosModal isOpen={sosModalOpen} onClose={() => setSosModalOpen(false)} />
        <FakeCallModal isOpen={fakeCallOpen} onClose={() => setFakeCallOpen(false)} />
      </>
    );
  }

  const firstName = (user?.displayName || 'there').split(' ')[0];
  const contactCount = contacts?.length ?? 0;
  const unread = notifications.filter((n) => !n.isRead).length;

  const checklist = [
    { done: contactCount > 0, label: 'Add a trusted contact', hint: contactCount > 0 ? `${contactCount} saved` : 'They get your SOS alerts', href: '/contacts' },
    { done: contactCount >= 3, label: 'Build a circle of three', hint: 'More people, faster help', href: '/contacts' },
    { done: false, label: 'Practise a fake call', hint: 'Know how it feels before you need it', action: () => setFakeCallOpen(true) },
    { done: false, label: 'Read the safety guides', hint: 'Your rights, in plain language', href: '/resources' },
  ];
  const doneCount = checklist.filter((c) => c.done).length;
  const progress = Math.round((doneCount / checklist.length) * 100);

  const quickActions = [
    { label: 'Report an incident', hint: 'Anonymous if you prefer', icon: AlertCircle, href: '/report', tint: 'bg-brand-tint text-brand' },
    { label: 'Share my location', hint: 'Send a live GPS link', icon: Share2, onClick: handleShareLiveLocation, tint: 'bg-emerald-50 text-emerald-600', loading: shareLocationLoading },
    { label: 'Trusted contacts', hint: contacts === null ? 'Loading…' : `${contactCount} in your circle`, icon: Users, href: '/contacts', tint: 'bg-coral-tint text-coral' },
    { label: 'Safety map', hint: 'Alerts near you', icon: MapPin, href: '/map', tint: 'bg-amber-50 text-amber-600' },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      {error && (
        <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-sm text-amber-900">
            <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
            <span><strong>Can&rsquo;t reach the server.</strong> SOS, fake call and helplines still work.</span>
          </div>
          <Button variant="outline" size="sm" onClick={() => loadDashboardData()} className="shrink-0">
            Try again
          </Button>
        </div>
      )}

      {/* ── Hero: greeting + SOS ───────────────────────────── */}
      <section className="relative overflow-hidden rounded-[1.75rem] bg-ink text-white p-6 sm:p-10">
        <div aria-hidden className="absolute -top-24 -right-20 h-80 w-80 rounded-full bg-brand/40 blur-3xl" />
        <div aria-hidden className="absolute -bottom-28 left-1/3 h-72 w-72 rounded-full bg-coral/25 blur-3xl" />
        <div className="relative grid lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-5">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/80">
              <span className="h-2 w-2 rounded-full bg-emerald-400" /> You&rsquo;re protected
            </span>
            <h1 className="font-display text-3xl sm:text-[2.75rem] leading-[1.1] font-extrabold tracking-[-0.02em]">
              {greeting()}, {firstName}.
            </h1>
            <p className="text-white/70 text-base sm:text-lg max-w-lg">
              Help is one tap away. Your trusted circle and emergency helplines are ready whenever you need them.
            </p>
            <div className="flex flex-wrap gap-2.5 pt-1">
              <a href="tel:112" className="inline-flex items-center gap-2 rounded-full bg-white/10 hover:bg-white/15 border border-white/10 px-4 py-2.5 text-sm font-semibold transition">
                <Phone className="h-4 w-4 text-coral" /> Police 112
              </a>
              <a href="tel:1091" className="inline-flex items-center gap-2 rounded-full bg-white/10 hover:bg-white/15 border border-white/10 px-4 py-2.5 text-sm font-semibold transition">
                <Phone className="h-4 w-4" /> Women 1091
              </a>
              <button
                type="button"
                onClick={() => setFakeCallOpen(true)}
                className="inline-flex items-center gap-2 rounded-full bg-white/10 hover:bg-white/15 border border-white/10 px-4 py-2.5 text-sm font-semibold transition"
              >
                <Phone className="h-4 w-4 text-emerald-400" /> Fake call
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <button
              type="button"
              onClick={() => setSosConfirmOpen(true)}
              className="relative flex h-48 w-48 sm:h-56 sm:w-56 items-center justify-center group"
              aria-label="Send emergency SOS"
            >
              <span className="absolute inset-0 rounded-full bg-red-500/30 animate-ring" />
              <span className="absolute inset-0 rounded-full bg-red-500/20 animate-ring [animation-delay:1.2s]" />
              <span className="relative flex h-40 w-40 sm:h-44 sm:w-44 flex-col items-center justify-center rounded-full bg-gradient-to-b from-red-500 to-red-700 shadow-[0_20px_50px_-12px_rgba(220,38,38,0.8)] ring-8 ring-white/10 group-hover:scale-105 group-active:scale-95 transition-transform">
                <ShieldAlert className="h-8 w-8 mb-1" />
                <span className="font-display text-4xl font-extrabold tracking-tight">SOS</span>
                <span className="text-xs text-white/80">Tap for help</span>
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* ── Quick actions ──────────────────────────────────── */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {quickActions.map((a) => {
          const inner = (
            <>
              <span className={`h-11 w-11 rounded-2xl flex items-center justify-center ${a.tint}`}>
                {a.loading ? <span className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" /> : <a.icon className="h-5 w-5" />}
              </span>
              <span className="mt-4 block font-semibold text-ink">{a.label}</span>
              <span className="block text-xs text-slate-500 mt-0.5">{a.hint}</span>
              <ArrowRight className="absolute top-5 right-5 h-4 w-4 text-slate-300 group-hover:text-ink group-hover:translate-x-0.5 transition" />
            </>
          );
          const cls = 'group relative text-left rounded-3xl bg-white border border-slate-200/80 p-5 hover:border-slate-300 hover:shadow-[0_12px_32px_-16px_rgba(11,22,48,0.2)] hover:-translate-y-0.5 transition';
          return a.href ? (
            <Link key={a.label} href={a.href} className={cls}>{inner}</Link>
          ) : (
            <button key={a.label} type="button" onClick={a.onClick} disabled={a.loading} className={cls}>{inner}</button>
          );
        })}
      </section>

      <section className="grid lg:grid-cols-3 gap-6">
        {/* ── Recent community reports ─────────────────────── */}
        <div className="lg:col-span-2 rounded-3xl bg-white border border-slate-200/80 p-5 sm:p-7">
          <div className="flex items-center justify-between gap-3 mb-5">
            <div>
              <h2 className="font-display text-xl font-bold text-ink">Around you</h2>
              <p className="text-sm text-slate-500">Latest verified reports from the community</p>
            </div>
            <Link href="/feed" className="inline-flex items-center gap-1.5 rounded-full bg-mist hover:bg-slate-200 px-4 py-2 text-sm font-semibold text-ink transition">
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {loadingData ? (
              <>
                <PostCardSkeleton />
                <PostCardSkeleton />
              </>
            ) : recentReports.length > 0 ? (
              recentReports.map((report) => (
                <Link
                  key={report.id}
                  href="/feed"
                  className="block rounded-2xl border border-slate-100 bg-mist/60 p-4 hover:bg-white hover:border-slate-200 transition"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="rounded-full bg-white border border-slate-200 px-2.5 py-0.5 text-xs font-semibold text-ink truncate">
                        {report.category?.name || report.categoryName || 'General safety'}
                      </span>
                      {report.location && (
                        <span className="hidden sm:flex items-center gap-1 text-xs text-slate-500 truncate">
                          <MapPin className="h-3 w-3" /> {report.location}
                        </span>
                      )}
                    </div>
                    <StatusBadge status={report.status || 'Under Review'} />
                  </div>
                  <p className="mt-2.5 text-sm text-slate-700 leading-relaxed line-clamp-2">{report.content}</p>
                  <div className="mt-3 flex items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{timeAgo(report.createdAt)}</span>
                    <span className="flex items-center gap-1"><Heart className="h-3.5 w-3.5" />{report.supportCount || 0}</span>
                    <span className="flex items-center gap-1"><MessageCircle className="h-3.5 w-3.5" />{report.solutionsCount || 0} solutions</span>
                  </div>
                </Link>
              ))
            ) : (
              <div className="rounded-2xl border-2 border-dashed border-slate-200 p-10 text-center">
                <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto" />
                <p className="mt-3 font-semibold text-ink">All quiet nearby</p>
                <p className="text-sm text-slate-500">No recent incidents reported in your area.</p>
              </div>
            )}
          </div>
        </div>

        {/* ── Right column ─────────────────────────────────── */}
        <div className="space-y-6">
          {/* Preparedness */}
          <div className="rounded-3xl bg-white border border-slate-200/80 p-5 sm:p-6">
            <div className="flex items-center gap-4">
              <div
                className="relative h-16 w-16 shrink-0 rounded-full"
                style={{ background: `conic-gradient(var(--color-brand) ${progress * 3.6}deg, #e2e8f0 0deg)` }}
                aria-label={`${progress}% ready`}
              >
                <div className="absolute inset-1.5 rounded-full bg-white flex items-center justify-center font-display font-extrabold text-ink">
                  {progress}%
                </div>
              </div>
              <div>
                <h2 className="font-display text-lg font-bold text-ink">Safety readiness</h2>
                <p className="text-sm text-slate-500">{doneCount} of {checklist.length} steps done</p>
              </div>
            </div>
            <ul className="mt-5 space-y-1">
              {checklist.map((c) => {
                const body = (
                  <>
                    {c.done ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                    ) : (
                      <Circle className="h-5 w-5 text-slate-300 shrink-0" />
                    )}
                    <span className="min-w-0 flex-1">
                      <span className={`block text-sm font-medium ${c.done ? 'text-slate-400 line-through' : 'text-ink'}`}>{c.label}</span>
                      <span className="block text-xs text-slate-500">{c.hint}</span>
                    </span>
                    {!c.done && <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-ink transition" />}
                  </>
                );
                const cls = 'group w-full flex items-center gap-3 rounded-xl px-2 py-2.5 text-left hover:bg-mist transition';
                return (
                  <li key={c.label}>
                    {c.href ? (
                      <Link href={c.href} className={cls}>{body}</Link>
                    ) : (
                      <button type="button" onClick={c.action} className={cls}>{body}</button>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Notifications teaser */}
          <Link
            href="/notifications"
            className="flex items-center gap-4 rounded-3xl bg-white border border-slate-200/80 p-5 hover:border-slate-300 transition group"
          >
            <span className="relative h-11 w-11 rounded-2xl bg-brand-tint text-brand flex items-center justify-center">
              <Bell className="h-5 w-5" />
              {unread > 0 && (
                <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-coral text-white text-[11px] font-bold flex items-center justify-center">
                  {unread}
                </span>
              )}
            </span>
            <span className="flex-1">
              <span className="block font-semibold text-ink">Notifications</span>
              <span className="block text-xs text-slate-500">{unread > 0 ? `${unread} unread updates` : 'You’re all caught up'}</span>
            </span>
            <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-ink transition" />
          </Link>

          {/* Guides */}
          <Link
            href="/resources"
            className="block relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand to-brand-deep p-6 text-white group"
          >
            <div aria-hidden className="absolute -right-10 -bottom-10 h-40 w-40 rounded-full bg-coral/30 blur-2xl" />
            <BookOpen className="relative h-6 w-6" />
            <p className="relative mt-3 font-display text-lg font-bold">Know your rights</p>
            <p className="relative text-sm text-white/75">POSH Act, BNS and step-by-step guides for staying safe.</p>
            <span className="relative mt-4 inline-flex items-center gap-1.5 text-sm font-semibold">
              Open guides <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition" />
            </span>
          </Link>
        </div>
      </section>

      {/* ── My activity shortcut ───────────────────────────── */}
      <section className="rounded-3xl bg-white border border-slate-200/80 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="h-11 w-11 rounded-2xl bg-mist text-ink flex items-center justify-center"><FileText className="h-5 w-5" /></span>
          <div>
            <p className="font-semibold text-ink">Track your reports</p>
            <p className="text-sm text-slate-500">See status updates and solutions on everything you&rsquo;ve shared.</p>
          </div>
        </div>
        <Link href="/myposts" className="inline-flex items-center justify-center gap-2 rounded-full bg-ink hover:bg-ink-soft px-5 py-2.5 text-sm font-semibold text-white transition">
          My reports <ArrowRight className="h-4 w-4" />
        </Link>
      </section>

      {/* SOS confirmation */}
      <Modal
        isOpen={sosConfirmOpen}
        onClose={() => setSosConfirmOpen(false)}
        title="Send an emergency SOS?"
        description="Confirm you need help right now."
        maxWidth="sm"
      >
        <div className="space-y-5 text-sm text-slate-700">
          <ul className="space-y-2.5">
            {[
              'Your precise GPS location is captured from this device.',
              'An alert with a Google Maps pin goes to your trusted contacts.',
              'A direct call to Police (112) is prepared for you.',
            ].map((t) => (
              <li key={t} className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
                {t}
              </li>
            ))}
          </ul>
          <div className="flex items-center justify-end gap-2.5">
            <Button variant="outline" onClick={() => setSosConfirmOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="emergency"
              leftIcon={<AlertTriangle className="h-4 w-4" />}
              onClick={() => {
                setSosConfirmOpen(false);
                setSosModalOpen(true);
              }}
            >
              Send SOS
            </Button>
          </div>
        </div>
      </Modal>

      <SosModal isOpen={sosModalOpen} onClose={() => setSosModalOpen(false)} />
      <FakeCallModal isOpen={fakeCallOpen} onClose={() => setFakeCallOpen(false)} />
    </div>
  );
}
