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
import { safeRedirect } from '@/lib/safe-redirect';
import { useToast } from '@/components/Toast';
import { Logo } from '@/components/ui/Logo';
import { AuthLayout } from '@/components/public/AuthLayout';
import { GoogleSignInButton } from '@/components/public/GoogleSignInButton';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = safeRedirect(searchParams.get('redirect'));

  const { login, loginWithGoogle, isAuthenticated, isLoading } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState(searchParams.get('email') ?? '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [googleBusy, setGoogleBusy] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Set while a Google sign-in is deciding where to go, so the "already signed in" redirect
  // below does not send a brand-new account past its profile step.
  const googleRef = React.useRef(false);

  const handleGoogle = async (idToken: string) => {
    setErrorMsg(null);
    setGoogleBusy(true);
    googleRef.current = true;
    const result = await loginWithGoogle(idToken);
    setGoogleBusy(false);

    if (!result.success) {
      googleRef.current = false;
      const message = result.error || 'Google sign-in did not work. Please try again.';
      setErrorMsg(message);
      showToast(message, 'error');
      return;
    }
    showToast('Signed in with Google.', 'success');
    router.push(
      result.needsProfile
        ? `/signup?stage=profile&redirect=${encodeURIComponent(redirectPath)}`
        : redirectPath
    );
  };

  // If already logged in, redirect immediately to target route
  useEffect(() => {
    if (!isLoading && isAuthenticated && !googleRef.current) {
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
      } else if (result.code === 'EMAIL_NOT_VERIFIED') {
        // The password was right; the address just was never confirmed.
        showToast('Please confirm your email first. Enter the code we emailed you.', 'info');
        router.push(
          `/verify-email?email=${encodeURIComponent(email.trim())}&redirect=${encodeURIComponent(redirectPath)}`
        );
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
                    <Link
                      href={`/forgot-password${email.trim() ? `?email=${encodeURIComponent(email.trim())}` : ''}`}
                      className="text-xs font-semibold text-brand hover:text-brand-deep hover:underline transition-colors focus:outline-none"
                    >
                      Forgot password?
                    </Link>
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
                    disabled={isSubmitting || googleBusy}
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

              <div className="mt-5">
                <GoogleSignInButton onCredential={handleGoogle} disabled={isSubmitting || googleBusy} />
              </div>

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


    </AuthLayout>
  );
}

export function LoginClient() {
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
