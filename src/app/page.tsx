'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Shield,
  ShieldCheck,
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
  Lock,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/components/Toast';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Modal } from '@/components/ui/Modal';
import { PublicLanding } from '@/components/PublicLanding';
import { SosModal } from '@/components/SosModal';
import { FakeCallModal } from '@/components/FakeCallModal';
import { api, type Category, type BackendPost } from '@/lib/api-client';
import { getCurrentCoordinates, buildEmergencySosText, buildWhatsAppLink } from '@/lib/location';
import { PostCardSkeleton } from '@/components/ui/Skeleton';

export default function HomePage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { showToast } = useToast();

  const [sosModalOpen, setSosModalOpen] = useState(false);
  const [fakeCallOpen, setFakeCallOpen] = useState(false);
  const [sosConfirmOpen, setSosConfirmOpen] = useState(false);
  const [shareLocationLoading, setShareLocationLoading] = useState(false);

  const [categories, setCategories] = useState<Category[]>([]);
  const [recentReports, setRecentReports] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboardData = async () => {
    setLoadingData(true);
    setError(null);
    try {
      const [catRes, feedRes] = await Promise.all([
        api.getCategories(),
        api.getFeed({ limit: 4 }),
      ]);

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

  // If unauthenticated guest, render the clean redesigned Public Landing
  if (!isAuthenticated && !isLoading) {
    return (
      <PublicLanding
        posts={recentReports as any}
        categories={categories}
        loading={loadingData}
        error={error}
        onRetry={() => loadDashboardData()}
        onOpenSos={() => setSosModalOpen(true)}
        onOpenFakeCall={() => setFakeCallOpen(true)}
      />
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Backend Connection Error Banner for Authenticated Users */}
      {error && (
        <Card className="p-4 sm:p-5 bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-red-600 shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-red-900 dark:text-red-100">Backend Connection Error</h4>
              <p className="text-xs text-red-700 dark:text-red-300">{error}</p>
              <p className="text-[11px] text-red-500 mt-0.5">Please check if the backend API service is running.</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => loadDashboardData()}
            className="border-red-300 text-red-700 hover:bg-red-100 shrink-0"
          >
            Retry Connection
          </Button>
        </Card>
      )}

      {/* ============================================================ */}
      {/* 1. WELCOME HEADER                                            */}
      {/* ============================================================ */}
      <section className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
         

          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Welcome back, {user?.displayName || 'Member'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Stay safe. We&rsquo;re here when you need us.
          </p>
        </div>

        {/* Rapid speed-dials */}
        <div className="flex items-center gap-2 shrink-0">
          <a
            href="tel:112"
            className="px-3 py-2 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 text-xs font-bold transition-colors flex items-center gap-1.5"
            title="National Police Emergency Direct Call"
          >
            <Phone className="h-3.5 w-3.5 text-red-600" />
            <span>Police 112</span>
          </a>

          <a
            href="tel:1091"
            className="px-3 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-semibold transition-colors flex items-center gap-1.5"
            title="Dedicated Women Safety Helpline"
          >
            <Phone className="h-3.5 w-3.5 text-slate-600" />
            <span>Women 1091</span>
          </a>
        </div>
      </section>


      {/* ============================================================ */}
      {/* 3. QUICK ACTIONS (Compact & Minimalist)                      */}
      {/* ============================================================ */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        {/* Action 1: Report a Problem */}
        <Link
          href="/report"
          className="p-2.5 sm:px-3 sm:py-2.5 rounded-xl bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50/20 transition-colors group flex items-center gap-2.5 shadow-2xs"
        >
          <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <AlertCircle className="h-3.5 w-3.5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-semibold text-slate-900 group-hover:text-blue-600 truncate flex items-center justify-between">
              <span>Report Problem</span>
              <ChevronRight className="h-3 w-3 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-transform shrink-0" />
            </div>
            <p className="text-[10px] text-slate-500 truncate -mt-0.5">
              Log incident or hazard
            </p>
          </div>
        </Link>

        {/* Action 2: Share Location */}
        <button
          type="button"
          onClick={handleShareLiveLocation}
          disabled={shareLocationLoading}
          className="p-2.5 sm:px-3 sm:py-2.5 rounded-xl bg-white border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/20 transition-colors group flex items-center gap-2.5 shadow-2xs text-left cursor-pointer"
        >
          <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            {shareLocationLoading ? (
              <div className="h-3.5 w-3.5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Share2 className="h-3.5 w-3.5" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-semibold text-slate-900 group-hover:text-emerald-600 truncate flex items-center justify-between">
              <span>Share Location</span>
              <ChevronRight className="h-3 w-3 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-transform shrink-0" />
            </div>
            <p className="text-[10px] text-slate-500 truncate -mt-0.5">
              Send live GPS link
            </p>
          </div>
        </button>

        {/* Action 3: Trusted Contacts */}
        <Link
          href="/contacts"
          className="p-2.5 sm:px-3 sm:py-2.5 rounded-xl bg-white border border-slate-200 hover:border-purple-400 hover:bg-purple-50/20 transition-colors group flex items-center gap-2.5 shadow-2xs"
        >
          <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Users className="h-3.5 w-3.5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-semibold text-slate-900 group-hover:text-purple-600 truncate flex items-center justify-between">
              <span>Trusted Contacts</span>
              <ChevronRight className="h-3 w-3 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-0.5 transition-transform shrink-0" />
            </div>
            <p className="text-[10px] text-slate-500 truncate -mt-0.5">
              Manage emergency circle
            </p>
          </div>
        </Link>

        {/* Action 4: View My Posts */}
        <Link
          href="/myposts"
          className="p-2.5 sm:px-3 sm:py-2.5 rounded-xl bg-white border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/20 transition-colors group flex items-center gap-2.5 shadow-2xs"
        >
          <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <FileText className="h-3.5 w-3.5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-semibold text-slate-900 group-hover:text-indigo-600 truncate flex items-center justify-between">
              <span>My Posts</span>
              <ChevronRight className="h-3 w-3 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-transform shrink-0" />
            </div>
            <p className="text-[10px] text-slate-500 truncate -mt-0.5">
              Track shared reports
            </p>
          </div>
        </Link>
      </section>

      {/* ============================================================ */}
      {/* 4. RECENT ACTIVITY & COMMUNITY SAFETY ADVISORIES             */}
      {/* ============================================================ */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Column (2 Cols): Recent Community Reports */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900">
              Recent Safety Reports &amp; Verified Advisories
            </h3>
            
          </div>

          <div className="space-y-2.5">
            {loadingData ? (
              <>
                <PostCardSkeleton />
                <PostCardSkeleton />
                <PostCardSkeleton />
              </>
            ) : recentReports.length > 0 ? (
              recentReports.map((report) => (
                <div
                  key={report.id}
                  className="rounded-lg border border-slate-200 bg-white p-4 hover:border-slate-300 transition-colors space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-800">
                        {report.category?.name || report.categoryName || 'General Safety'}
                      </span>
                      <span className="text-[11px] text-slate-400">&bull;</span>
                      <span className="text-[11px] text-slate-500">
                        {report.isAnonymous ? 'Reported Anonymously' : report.authorName || 'Community Member'}
                      </span>
                    </div>
                    <StatusBadge status={report.status || 'Under Review'} />
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed line-clamp-2">
                    {report.content}
                  </p>

                  <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Recently reported
                    </span>
                    <span className="text-blue-600 font-medium">
                      {report.solutionsCount || 0} community solutions verified
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-lg border border-slate-200 bg-white p-6 text-center text-xs text-slate-500">
                No recent incidents reported in your active zone.
              </div>
            )}
          </div>
        </div>

        {/* Right Column (1 Col): Safety Status & Preparedness Checklist */}
        <div className="space-y-4">
          <Card>
            <CardHeader
              title="Preparedness Status"
              subtitle="Essential safety checklist"
            />
            <div className="space-y-3 pt-3">
              <div className="flex items-start gap-2.5 text-xs">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-800 block">Emergency SOS Ready</span>
                  <span className="text-slate-500">Fast trigger armed with GPS capture</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 text-xs">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-800 block">Helplines Connected</span>
                  <span className="text-slate-500">112, 1091, and 181 speed dials active</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 text-xs">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-800 block">Zero-Knowledge Guard</span>
                  <span className="text-slate-500">Session encryption &amp; privacy enabled</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <Link
                  href="/safety-measures"
                  className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                >
                  <span>Review Safety Measures Guide</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </Card>

          {/* Discreet Deterrence Card */}
          <div className="p-4 rounded-lg bg-slate-100 border border-slate-200 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
              Discreet Deterrence
            </span>
            <p className="text-xs text-slate-700 leading-relaxed">
              If followed or feeling uncomfortable, trigger a realistic fake call on speaker to establish active surveillance.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="w-full bg-white"
              leftIcon={<Phone className="h-3.5 w-3.5 text-blue-600" />}
              onClick={() => setFakeCallOpen(true)}
            >
              Test Fake Call
            </Button>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 5. SOS CONFIRMATION MODAL                                    */}
      {/* ============================================================ */}
      <Modal
        isOpen={sosConfirmOpen}
        onClose={() => setSosConfirmOpen(false)}
        title="Confirm Emergency SOS Activation"
        description="Please confirm you require immediate emergency assistance."
        maxWidth="sm"
      >
        <div className="space-y-4 text-xs text-slate-700">
          <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 space-y-2">
            <p className="font-semibold text-red-900">What happens when you confirm:</p>
            <ul className="list-disc pl-4 space-y-1 text-red-800">
              <li>High-accuracy GPS coordinates will be captured from your device.</li>
              <li>An emergency distress alert with Google Maps pin will be sent to your trusted contacts.</li>
              <li>A direct cellular call connection to Police (112) will be prepared.</li>
            </ul>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSosConfirmOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="emergency"
              size="sm"
              leftIcon={<AlertTriangle className="h-3.5 w-3.5" />}
              onClick={() => {
                setSosConfirmOpen(false);
                setSosModalOpen(true);
              }}
            >
              Confirm &amp; Dispatch SOS
            </Button>
          </div>
        </div>
      </Modal>

      {/* Global Safety Modals */}
      <SosModal isOpen={sosModalOpen} onClose={() => setSosModalOpen(false)} />
      <FakeCallModal isOpen={fakeCallOpen} onClose={() => setFakeCallOpen(false)} />
    </div>
  );
}
