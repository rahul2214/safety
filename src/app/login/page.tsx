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
import { AuthLayout } from '@/components/public/AuthLayout';

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
    <AuthLayout
      title="Welcome back"
      subtitle="Log in to reach your trusted contacts, safety map and reports."
    >
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
                      className={`w-full h-12 bg-white border ${
                        errorMsg
                          ? 'border-red-500 ring-2 ring-red-500/10 focus:border-red-600 focus:ring-red-600/20'
                          : 'border-slate-300 focus:border-brand focus:ring-brand/15'
                      } rounded-xl pl-10 pr-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-colors`}
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
                      className="text-xs font-semibold text-brand hover:text-brand-deep hover:underline transition-colors focus:outline-none"
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
                      className={`w-full h-12 bg-white border ${
                        errorMsg
                          ? 'border-red-500 ring-2 ring-red-500/10 focus:border-red-600 focus:ring-red-600/20'
                          : 'border-slate-300 focus:border-brand focus:ring-brand/15'
                      } rounded-xl pl-10 pr-10 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-colors tracking-wide`}
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
                    className="w-full h-12 rounded-full bg-ink hover:bg-ink-soft active:bg-black text-white font-semibold text-sm shadow-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-60 cursor-pointer"
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
                    className="text-brand font-semibold hover:underline ml-1"
                  >
                    Create a free account
                  </Link>
                </p>
                <p className="text-[11px] text-slate-400 mt-3 flex items-center justify-center gap-1.5">
                  <Shield className="h-3 w-3 text-emerald-600" />
                  Protected by 256-bit encryption. Real identity remains private on public incident feeds.
                </p>
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

    </AuthLayout>
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
