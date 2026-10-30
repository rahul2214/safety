'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Shield,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  Loader2,
  Phone,
  AlertTriangle,
  CheckCircle2,
  Scale,
  FileText,
  Info,
  AlertCircle,
  X,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/components/Toast';
import { Logo } from '@/components/ui/Logo';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/';

  const { login, isAuthenticated, isLoading } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  // If already logged in, redirect immediately to target route
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace(redirectPath);
    }
  }, [isLoading, isAuthenticated, redirectPath, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      const emptyMsg = 'Please enter both your registered email address and password.';
      setErrorMsg(emptyMsg);
      showToast(emptyMsg, 'error');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const result = await login(email.trim(), password);

      if (result.success) {
        showToast('Signed in successfully!', 'success');
        router.push(redirectPath);
      } else {
        const err = typeof result.error === 'string' ? result.error : '';
        let message = 'Invalid email or password. Please verify your credentials or create a new account.';
        if (
          err.toLowerCase().includes('network') ||
          err.toLowerCase().includes('failed to fetch') ||
          err.toLowerCase().includes('connection')
        ) {
          message =
            'Unable to reach the safety verification server. Please check your network connection and retry.';
        } else if (err) {
          message = err;
        }

        setErrorMsg(message);
        showToast(message, 'error');
      }
    } catch (err: any) {
      const message =
        err?.message || 'Authentication encountered an unexpected error. Please try again.';
      setErrorMsg(message);
      showToast(message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) return;
    setForgotSuccess(true);
    setTimeout(() => {
      setShowForgotPasswordModal(false);
      setForgotSuccess(false);
      setForgotEmail('');
    }, 3200);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between text-slate-900">
      {/* 1. URGENT CRISIS ESCALATION BANNER (Life-Safety Priority) */}
      <div className="bg-red-700 text-white border-b border-red-800 px-4 py-2.5 text-xs font-medium">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <AlertTriangle className="h-4 w-4 shrink-0 text-red-200" />
            <span>
              <strong>Immediate danger?</strong> You do not need to sign in to get emergency assistance.
            </span>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="tel:112"
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-white text-red-700 hover:bg-red-50 font-bold rounded shadow-xs text-xs transition-colors"
            >
              <Phone className="h-3 w-3" />
              Dial 112 (National ERSS)
            </a>
            <a
              href="tel:1091"
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-800 hover:bg-red-900 text-white font-bold rounded border border-red-600 text-xs transition-colors"
            >
              <Phone className="h-3 w-3" />
              1091 (Women Police)
            </a>
            <Link
              href="/safety-measures"
              className="underline hover:text-red-100 hidden md:inline-block"
            >
              View directory &amp; legal rights →
            </Link>
          </div>
        </div>
      </div>

      {/* 2. MAIN WORKSPACE CONTAINER */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex items-center justify-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch max-w-5xl">
          {/* LEFT COLUMN: Institutional Trust & Legal Protections Panel (Desktop) */}
          <div className="hidden lg:flex lg:col-span-5 flex-col justify-between bg-slate-900 text-white rounded-2xl p-8 border border-slate-800 shadow-sm relative overflow-hidden">
            <div className="relative z-10 space-y-6">
              {/* Brand Header */}
              <div className="flex items-center gap-3">
                <Logo size={42} />
                <div>
                  <h2 className="text-lg font-bold tracking-tight text-white">Sabhijude Portal</h2>
                  <p className="text-xs text-slate-400">National Personal Safety &amp; Legal Network</p>
                </div>
              </div>

              {/* Core Security & Privacy Guarantees */}
              <div className="space-y-4 pt-2">
                <h3 className="text-xs font-semibold text-slate-300 tracking-wider uppercase">
                  Protected System Guarantees
                </h3>

                <div className="space-y-3.5 text-xs">
                  <div className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-md bg-slate-800 border border-slate-700 flex items-center justify-center text-blue-400 shrink-0 mt-0.5">
                      <Shield className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-200">Zero Public Identity Exposure</h4>
                      <p className="text-slate-400 mt-0.5 leading-relaxed">
                        Community posts, area hazard alerts, and emergency markers preserve strict
                        anonymity. Your legal identity is never broadcast.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-md bg-slate-800 border border-slate-700 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                      <Scale className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-200">POSH Act 2013 &amp; BNS Compliance</h4>
                      <p className="text-slate-400 mt-0.5 leading-relaxed">
                        Formal workplace incident records include tamper-evident timestamping and
                        confidentiality under Section 16 of the POSH Act.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-md bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                      <Phone className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-200">National ERSS 112 Dispatch Ready</h4>
                      <p className="text-slate-400 mt-0.5 leading-relaxed">
                        Direct SOS dispatch capability connecting to local police control rooms and
                        designated emergency contacts.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-md bg-slate-800 border border-slate-700 flex items-center justify-center text-blue-400 shrink-0 mt-0.5">
                      <Lock className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-200">DPDP Act 2023 Encrypted Storage</h4>
                      <p className="text-slate-400 mt-0.5 leading-relaxed">
                        256-bit AES encryption at rest and in transit. Your contact numbers and location logs
                        are never sold, rented, or monetized.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Institutional Seal */}
            <div className="relative z-10 pt-6 mt-6 border-t border-slate-800/80">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  API Gateway Operational
                </span>
                <span>ISO 27001 &bull; DPDP Certified</span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Senior Enterprise Sign-In Card */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Top Navigation Row */}
            <div className="mb-4 flex items-center justify-between">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to Public Portal
              </Link>
              <span className="text-[11px] font-medium text-slate-500 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-full">
                Encrypted Session
              </span>
            </div>

            {/* White Form Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
              {/* Header Title & Subtitle */}
              <div className="mb-6">
                <div className="lg:hidden flex items-center gap-2.5 mb-3">
                  <Logo size={32} />
                  <span className="text-sm font-bold text-slate-900">Sabhijude</span>
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">Member Sign In</h1>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Enter your registered credentials to access your safety dashboard, emergency contacts, and
                  incident records.
                </p>
              </div>

              {/* Error Callout Banner */}
              {errorMsg && (
                <div
                  role="alert"
                  className="mb-5 p-4 rounded-xl bg-red-50 border-2 border-red-300 text-red-900 text-xs font-medium flex items-start gap-3 shadow-xs animate-in fade-in slide-in-from-top-1"
                >
                  <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                  <div className="flex-1 leading-relaxed">
                    <span className="font-bold text-sm text-red-800 block mb-0.5">Authentication Failed</span>
                    <p className="text-red-700 text-xs">{errorMsg}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setErrorMsg(null)}
                    className="p-1 text-red-400 hover:text-red-700 rounded transition-colors"
                    aria-label="Dismiss error"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}

              {/* Main Sign-In Form */}
              <form onSubmit={handleSubmit} className="space-y-4.5">
                {/* Email Address */}
                <div className="space-y-1.5 text-left">
                  <label htmlFor="email" className="block text-xs font-semibold text-slate-700">
                    Email Address
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3.5 pointer-events-none text-slate-400">
                      <Mail className="h-4 w-4" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      placeholder="name@organization.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errorMsg) setErrorMsg(null);
                      }}
                      required
                      className={`w-full h-11 bg-white border ${
                        errorMsg
                          ? 'border-red-500 ring-2 ring-red-500/10 focus:border-red-600 focus:ring-red-600/20'
                          : 'border-slate-300 focus:border-blue-600 focus:ring-blue-600/20'
                      } rounded-lg pl-10 pr-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-colors`}
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-1.5 text-left">
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="block text-xs font-semibold text-slate-700">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowForgotPasswordModal(true)}
                      className="text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline transition-colors focus:outline-none"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative flex items-center">
                    <div className="absolute left-3.5 pointer-events-none text-slate-400">
                      <Lock className="h-4 w-4" />
                    </div>
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errorMsg) setErrorMsg(null);
                      }}
                      required
                      className={`w-full h-11 bg-white border ${
                        errorMsg
                          ? 'border-red-500 ring-2 ring-red-500/10 focus:border-red-600 focus:ring-red-600/20'
                          : 'border-slate-300 focus:border-blue-600 focus:ring-blue-600/20'
                      } rounded-lg pl-10 pr-10 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-colors tracking-wide`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 p-1 text-slate-400 hover:text-slate-700 transition-colors focus:outline-none"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me Checkbox */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-xs text-slate-600">Keep me signed in on this device</span>
                  </label>
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-11 rounded-lg bg-slate-900 hover:bg-slate-800 active:bg-black text-white font-semibold text-sm shadow-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-60 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin text-white" />
                        <span>Verifying credentials...</span>
                      </>
                    ) : (
                      <span>Sign In to Dashboard</span>
                    )}
                  </button>
                </div>
              </form>

              {/* Registration Link Footer */}
              <div className="mt-6 pt-5 border-t border-slate-100 text-center">
                <p className="text-xs sm:text-sm text-slate-600">
                  Don&apos;t have an account yet?{' '}
                  <Link
                    href={`/signup?redirect=${encodeURIComponent(redirectPath)}`}
                    className="text-blue-600 font-bold hover:underline ml-1"
                  >
                    Create a free account
                  </Link>
                </p>
                <p className="text-[11px] text-slate-400 mt-3 flex items-center justify-center gap-1.5">
                  <Shield className="h-3 w-3 text-emerald-600" />
                  Protected by 256-bit encryption. Real identity remains private on public incident feeds.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. FORGOT PASSWORD MODAL */}
      {showForgotPasswordModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Reset Your Password</h3>
                <p className="text-xs text-slate-600 mt-1">
                  Enter your registered email address. We will verify your account against the safety database
                  and send an encrypted recovery link.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowForgotPasswordModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-semibold p-1"
              >
                ✕
              </button>
            </div>

            {forgotSuccess ? (
              <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <span className="font-semibold block mb-0.5">Recovery instructions dispatched</span>
                  If this email is registered in the Sabhijude database, a secure password reset link has
                  been dispatched to your inbox.
                </div>
              </div>
            ) : (
              <form onSubmit={handleForgotPasswordSubmit} className="space-y-3.5">
                <div>
                  <label htmlFor="forgotEmail" className="block text-xs font-semibold text-slate-700 mb-1">
                    Registered Email Address
                  </label>
                  <input
                    id="forgotEmail"
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    required
                    placeholder="name@example.com"
                    className="w-full h-10 border border-slate-300 rounded-lg px-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotPasswordModal(false)}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition"
                  >
                    Send Recovery Link
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 4. FOOTER NOTE */}
      <footer className="py-4 border-t border-slate-200 text-center text-xs text-slate-500 bg-white">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>&copy; {new Date().getFullYear()} Sabhijude National Safety Portal. All rights reserved.</span>
          <div className="flex items-center gap-4 text-xs">
            <Link href="/about" className="hover:text-slate-800 transition">
              About
            </Link>
            <Link href="/safety-measures" className="hover:text-slate-800 transition">
              Indian Helplines &amp; Workplace Laws
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="flex items-center gap-3 text-slate-600 text-xs font-semibold">
            <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
            <span>Loading security gateway...</span>
          </div>
        </div>
      }
    >
      <LoginFormContent />
    </Suspense>
  );
}
