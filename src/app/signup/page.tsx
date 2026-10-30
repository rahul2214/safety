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
  Calendar,
  Briefcase,
  GraduationCap,
  User,
  AlertCircle,
  MapPin,
  Users,
  Check,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api-client';
import { Logo } from '@/components/ui/Logo';

function SignupFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/';

  const { register, isAuthenticated, isLoading } = useAuth();

  // Wizard Stage: 1 = Account Credentials, 2 = Safety Profile Onboarding
  const [stage, setStage] = useState<1 | 2>(1);

  // Stage 1 Fields (Matching mobile-app signup.tsx & backend validation)
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isAgeConfirmed, setIsAgeConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Stage 2 Fields (Matching mobile-app onboarding.tsx)
  const [genders, setGenders] = useState<Array<{ id: number; code: string; name: string }>>([
    { id: 1, code: 'female', name: 'Female' },
    { id: 2, code: 'male', name: 'Male' },
    { id: 3, code: 'other', name: 'Other / Prefer not to say' },
  ]);
  const [selectedGenderId, setSelectedGenderId] = useState<number | null>(1);
  const [dob, setDob] = useState('');
  const [occupations, setOccupations] = useState<Array<{ id: number; name: string }>>([
    { id: 1, name: 'Student' },
    { id: 2, name: 'Working Professional' },
  ]);
  const [selectedOccupationId, setSelectedOccupationId] = useState<number | null>(1);
  const [savingProfile, setSavingProfile] = useState(false);

  // If already logged in on initial load, redirect
  useEffect(() => {
    if (!isLoading && isAuthenticated && stage === 1) {
      router.replace(redirectPath);
    }
  }, [isLoading, isAuthenticated, redirectPath, router, stage]);

  // Load lookup tables for Stage 2 onboarding
  useEffect(() => {
    if (stage === 2) {
      api.getGenders().then((res) => {
        if (res.ok && res.data && res.data.length > 0) {
          setGenders(res.data);
          setSelectedGenderId(res.data[0].id);
        }
      });
      api.getOccupationStatuses().then((res) => {
        if (res.ok && res.data && res.data.length > 0) {
          setOccupations(res.data);
          setSelectedOccupationId(res.data[0].id);
        }
      });
    }
  }, [stage]);

  // Real-time password strength calculation
  const hasMinLength = password.length >= 8;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasDigitOrSpecial = /[\d\W]/.test(password);

  let strengthScore = 0;
  if (hasMinLength) strengthScore++;
  if (hasLetter) strengthScore++;
  if (hasDigitOrSpecial) strengthScore++;

  const isPasswordMatch = password.length > 0 && password === confirmPassword;

  // Handle Stage 1 Submit
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanName = displayName.trim();
    const cleanEmail = email.trim();
    const cleanDigits = phoneNumber.replace(/\D/g, '');

    if (!cleanName || !cleanEmail || !cleanDigits || !password) {
      setErrorMsg('Please complete all required fields including your mobile number.');
      return;
    }

    if (cleanDigits.length < 10) {
      setErrorMsg('Please enter a valid 10-digit Indian mobile number.');
      return;
    }

    if (password.length < 8) {
      setErrorMsg('Password must be at least 8 characters in length.');
      return;
    }

    if (!hasLetter || !hasDigitOrSpecial) {
      setErrorMsg('Password must contain letters and at least one number or special character.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please ensure both password fields are identical.');
      return;
    }

    if (!isAgeConfirmed) {
      setErrorMsg('You must confirm you are 18 years of age or older to join Sabhijude.');
      return;
    }

    setIsSubmitting(true);

    const standardPhone = cleanDigits.length === 10 ? '+91' + cleanDigits : '+' + cleanDigits;
    const result = await register(cleanName, cleanEmail, standardPhone, password);

    setIsSubmitting(false);

    if (result.success) {
      // Advance to mobile app Onboarding Stage
      setStage(2);
    } else {
      const err = result.error?.toLowerCase() || '';
      if (err.includes('phone') || err.includes('mobile')) {
        setErrorMsg(
          'This mobile number is already registered with another Sabhijude account. Use a different number, or sign in.'
        );
      } else if (err.includes('email') || err.includes('already exists')) {
        setErrorMsg(
          'This email address is already registered in the Sabhijude database. Would you like to sign in instead?'
        );
      } else {
        setErrorMsg(
          result.error ||
            'Registration could not be completed. Please verify your details and network connection.'
        );
      }
    }
  };

  // Handle Stage 2 Complete
  const handleCompleteOnboarding = async () => {
    setSavingProfile(true);
    try {
      const selectedOcc = occupations.find((o) => o.id === selectedOccupationId);
      await api.updateProfile({
        genderId: selectedGenderId ?? undefined,
        dob: dob.trim() || undefined,
        occupationStatusId: selectedOccupationId ?? undefined,
        occupationStatus: selectedOcc?.name.toLowerCase(),
      });
      router.push(redirectPath);
    } catch {
      // Gracefully advance even if optional profile update encountered an issue
      router.push(redirectPath);
    } finally {
      setSavingProfile(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between text-slate-900">
      {/* 1. URGENT CRISIS ESCALATION BANNER (Life-Safety Priority) */}
      <div className="bg-red-700 text-white border-b border-red-800 px-4 py-2.5 text-xs font-medium">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <AlertTriangle className="h-4 w-4 shrink-0 text-red-200" />
            <span>
              <strong>Immediate danger?</strong> You do not need an account to call emergency services.
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
          {/* LEFT COLUMN: Why Join Sabhijude & Safety Commitments (Desktop) */}
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

              {/* Step indicator overview */}
              <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-300">Registration Progress</span>
                  <span className="text-blue-400">{stage === 1 ? '50% Complete' : '100% Complete'}</span>
                </div>
                <div className="h-1.5 w-full bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 transition-all duration-300 rounded-full"
                    style={{ width: stage === 1 ? '50%' : '100%' }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-400 pt-1">
                  <span className={stage === 1 ? 'text-white font-medium' : 'text-slate-400'}>
                    1. Account Credentials
                  </span>
                  <span className={stage === 2 ? 'text-white font-medium' : 'text-slate-400'}>
                    2. Safety Profile
                  </span>
                </div>
              </div>

              {/* Core Features */}
              <div className="space-y-4 pt-1">
                <h3 className="text-xs font-semibold text-slate-300 tracking-wider uppercase">
                  Included Member Protections
                </h3>

                <div className="space-y-3.5 text-xs">
                  <div className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-md bg-slate-800 border border-slate-700 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                      <Phone className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-200">1-Touch Emergency Broadcast</h4>
                      <p className="text-slate-400 mt-0.5 leading-relaxed">
                        Dispatch high-priority SMS and location telemetry to your trusted emergency contacts
                        with single-touch confirmation.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-md bg-slate-800 border border-slate-700 flex items-center justify-center text-blue-400 shrink-0 mt-0.5">
                      <Scale className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-200">POSH Act &amp; Statutory Evidence Locker</h4>
                      <p className="text-slate-400 mt-0.5 leading-relaxed">
                        Log timestamped incident records admissible for internal inquiry committees (IC) and
                        police complaint filings.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-md bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                      <MapPin className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-200">Privacy-Safe Geo Safety Map</h4>
                      <p className="text-slate-400 mt-0.5 leading-relaxed">
                        Explore street lighting reports, verified transit hubs, and harassment alerts aggregated
                        to protect home privacy.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-md bg-slate-800 border border-slate-700 flex items-center justify-center text-purple-400 shrink-0 mt-0.5">
                      <Users className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-200">Zero-Judgment Community Support</h4>
                      <p className="text-slate-400 mt-0.5 leading-relaxed">
                        Share advice and practical safety guidance under verified pseudonyms without exposing
                        your personal contact details.
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
                  Government Standards Aligned
                </span>
                <span>DPDP Act 2023 Compliant</span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Senior Enterprise Sign-Up & Onboarding Card */}
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
              <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full">
                {stage === 1 ? 'Step 1 of 2: Account' : 'Step 2 of 2: Profile'}
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
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                  {stage === 1 ? 'Create Member Account' : 'Set Up Your Safety Profile'}
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  {stage === 1
                    ? 'A protected, encrypted space to access safety tools, manage trusted contacts, and report incidents.'
                    : 'This shapes relevant safety alerts and workplace guidance for your demographic. You can modify this at any time.'}
                </p>
              </div>

              {/* Error Callout Banner */}
              {errorMsg && (
                <div
                  role="alert"
                  className="mb-5 p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs font-medium flex items-start gap-2.5 animate-in fade-in"
                >
                  <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
                  <div className="flex-1 leading-relaxed">
                    <span className="font-semibold block mb-0.5">Please review your information</span>
                    {errorMsg}
                    {errorMsg.toLowerCase().includes('already registered') && (
                      <div className="mt-2">
                        <Link
                          href={`/login?redirect=${encodeURIComponent(redirectPath)}`}
                          className="inline-flex items-center gap-1 font-bold text-blue-700 hover:underline"
                        >
                          Proceed to Sign In →
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ============================================================== */}
              {/* STAGE 1: ACCOUNT REGISTRATION (Mobile App Parity & DB Security) */}
              {/* ============================================================== */}
              {stage === 1 && (
                <form onSubmit={handleSignup} className="space-y-4">
                  {/* Display Name Input */}
                  <div className="space-y-1.5 text-left">
                    <label htmlFor="displayName" className="block text-xs font-semibold text-slate-700">
                      Full Name / Display Name
                    </label>
                    <div className="relative flex items-center">
                      <div className="absolute left-3.5 pointer-events-none text-slate-400">
                        <User className="h-4 w-4" />
                      </div>
                      <input
                        id="displayName"
                        type="text"
                        autoComplete="name"
                        placeholder="How you wish to be addressed"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        required
                        className="w-full h-11 bg-white border border-slate-300 rounded-lg pl-10 pr-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Email Input */}
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
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full h-11 bg-white border border-slate-300 rounded-lg pl-10 pr-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Indian Mobile Number with Country Code Prefix */}
                  <div className="space-y-1.5 text-left">
                    <label htmlFor="phone" className="block text-xs font-semibold text-slate-700">
                      Mobile Number (India)
                    </label>
                    <div className="flex items-center h-11 bg-white border border-slate-300 rounded-lg px-3 focus-within:ring-2 focus-within:ring-blue-600/20 focus-within:border-blue-600 transition-colors">
                      <span className="text-xs font-bold text-blue-700 pr-2.5 border-r border-slate-200">
                        +91
                      </span>
                      <input
                        id="phone"
                        type="tel"
                        autoComplete="tel"
                        placeholder="9876543210"
                        maxLength={10}
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                        required
                        className="w-full bg-transparent border-0 pl-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none tracking-wider font-mono"
                      />
                    </div>
                    <p className="text-[11px] text-slate-500 pl-0.5">
                      Used for emergency SOS broadcast telemetry and account recovery. Never displayed
                      publicly.
                    </p>
                  </div>

                  {/* Password Input */}
                  <div className="space-y-1.5 text-left">
                    <label htmlFor="password" className="block text-xs font-semibold text-slate-700">
                      Password
                    </label>
                    <div className="relative flex items-center">
                      <div className="absolute left-3.5 pointer-events-none text-slate-400">
                        <Lock className="h-4 w-4" />
                      </div>
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        placeholder="Minimum 8 characters"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full h-11 bg-white border border-slate-300 rounded-lg pl-10 pr-10 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors tracking-wide"
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

                    {/* Real-time 3-segment strength meter (Mobile App Parity) */}
                    {password.length > 0 && (
                      <div className="pt-1.5 space-y-1">
                        <div className="flex gap-1.5">
                          <div
                            className={`h-1.5 flex-1 rounded-full transition-colors ${
                              strengthScore >= 1 ? 'bg-red-500' : 'bg-slate-200'
                            }`}
                          />
                          <div
                            className={`h-1.5 flex-1 rounded-full transition-colors ${
                              strengthScore >= 2 ? 'bg-amber-500' : 'bg-slate-200'
                            }`}
                          />
                          <div
                            className={`h-1.5 flex-1 rounded-full transition-colors ${
                              strengthScore >= 3 ? 'bg-emerald-600' : 'bg-slate-200'
                            }`}
                          />
                        </div>
                        <span className="text-[11px] font-medium text-slate-500 block">
                          {strengthScore === 1 && 'Weak: Add letters and numbers or symbols.'}
                          {strengthScore === 2 && 'Fair password: Add special characters for maximum safety.'}
                          {strengthScore >= 3 && 'Strong password.'}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Confirm Password with Live Match Confirmation */}
                  <div className="space-y-1.5 text-left">
                    <label htmlFor="confirmPassword" className="block text-xs font-semibold text-slate-700">
                      Confirm Password
                    </label>
                    <div className="relative flex items-center">
                      <div className="absolute left-3.5 pointer-events-none text-slate-400">
                        <Lock className="h-4 w-4" />
                      </div>
                      <input
                        id="confirmPassword"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        placeholder="••••••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="w-full h-11 bg-white border border-slate-300 rounded-lg pl-10 pr-10 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors tracking-wide"
                      />
                      {confirmPassword.length > 0 && (
                        <div className="absolute right-3">
                          {isPasswordMatch ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-amber-500" />
                          )}
                        </div>
                      )}
                    </div>
                    {confirmPassword.length > 0 && (
                      <p
                        className={`text-[11px] font-semibold pl-1 ${
                          isPasswordMatch ? 'text-emerald-700' : 'text-amber-700'
                        }`}
                      >
                        {isPasswordMatch ? '✓ Passwords match' : '✕ Passwords do not match yet'}
                      </p>
                    )}
                  </div>

                  {/* Age Verification Checkbox (Indian Statutory Requirement) */}
                  <div className="pt-2 flex items-start gap-2.5">
                    <input
                      id="ageCheck"
                      type="checkbox"
                      checked={isAgeConfirmed}
                      onChange={(e) => setIsAgeConfirmed(e.target.checked)}
                      required
                      className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="ageCheck" className="text-xs text-slate-600 leading-snug cursor-pointer">
                      I confirm I am <strong className="text-slate-900">18 years of age or older</strong> and
                      agree to the Sabhijude Community Guidelines and Emergency Response Protocols.
                    </label>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-3">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-11 rounded-lg bg-slate-900 hover:bg-slate-800 active:bg-black text-white font-semibold text-sm shadow-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-60 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin text-white" />
                          <span>Creating account...</span>
                        </>
                      ) : (
                        <span>Continue to Profile Setup →</span>
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* ============================================================== */}
              {/* STAGE 2: ONBOARDING PROFILE SETUP (From mobile-app onboarding) */}
              {/* ============================================================== */}
              {stage === 2 && (
                <div className="space-y-5 animate-in fade-in">
                  {/* Gender Selection */}
                  <div className="space-y-2 text-left">
                    <label className="block text-xs font-semibold text-slate-700">
                      Gender Identification
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {genders.map((g) => {
                        const selected = selectedGenderId === g.id;
                        return (
                          <button
                            key={g.id}
                            type="button"
                            onClick={() => setSelectedGenderId(g.id)}
                            className={`h-11 rounded-lg text-xs font-semibold transition flex items-center justify-center gap-2 border ${
                              selected
                                ? 'bg-blue-50 border-blue-600 text-blue-700 ring-1 ring-blue-600'
                                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            <User className="h-3.5 w-3.5" />
                            <span>{g.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Date of Birth Input */}
                  <div className="space-y-1.5 text-left">
                    <label htmlFor="dob" className="block text-xs font-semibold text-slate-700">
                      Date of Birth
                    </label>
                    <div className="flex items-center h-11 bg-white border border-slate-300 rounded-lg px-3 focus-within:ring-2 focus-within:ring-blue-600/20 focus-within:border-blue-600 transition-colors">
                      <Calendar className="h-4 w-4 text-slate-400 mr-2 shrink-0" />
                      <input
                        id="dob"
                        type="date"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        className="w-full bg-transparent border-0 text-sm text-slate-900 focus:outline-none"
                      />
                    </div>
                    <p className="text-[11px] text-slate-500 pl-0.5">
                      Must be 18 years or older. Used strictly for demographic safety auditing and support
                      triage.
                    </p>
                  </div>

                  {/* Occupation Status */}
                  <div className="space-y-2 text-left">
                    <label className="block text-xs font-semibold text-slate-700">
                      Occupation Category
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {occupations.map((occ) => {
                        const selected = selectedOccupationId === occ.id;
                        const isStudent = occ.name.toLowerCase().includes('student');
                        return (
                          <button
                            key={occ.id}
                            type="button"
                            onClick={() => setSelectedOccupationId(occ.id)}
                            className={`p-3.5 rounded-lg text-left transition border ${
                              selected
                                ? 'bg-blue-50 border-blue-600 text-blue-900 ring-1 ring-blue-600'
                                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              {isStudent ? (
                                <GraduationCap className="h-4 w-4 text-blue-600" />
                              ) : (
                                <Briefcase className="h-4 w-4 text-blue-600" />
                              )}
                              <span className="font-bold text-xs">{occ.name}</span>
                            </div>
                            <p className="text-[11px] text-slate-500 leading-tight">
                              {isStudent
                                ? 'Higher education campus, hostel, or commute'
                                : 'Corporate, healthcare, enterprise, or night shifts'}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 space-y-2.5">
                    <button
                      type="button"
                      onClick={handleCompleteOnboarding}
                      disabled={savingProfile}
                      className="w-full h-11 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm shadow-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-60 cursor-pointer"
                    >
                      {savingProfile ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin text-white" />
                          <span>Saving profile to database...</span>
                        </>
                      ) : (
                        <span>Complete Profile &amp; Open Portal</span>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => router.push(redirectPath)}
                      className="w-full py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors text-center"
                    >
                      Skip this step &amp; proceed to dashboard →
                    </button>
                  </div>
                </div>
              )}

              {/* Footer Switch to Sign In */}
              <div className="mt-6 pt-5 border-t border-slate-100 text-center">
                <p className="text-xs sm:text-sm text-slate-600">
                  Already have an account?{' '}
                  <Link
                    href={`/login?redirect=${encodeURIComponent(redirectPath)}`}
                    className="text-blue-600 font-bold hover:underline ml-1"
                  >
                    Sign in to your account
                  </Link>
                </p>
                <p className="text-[11px] text-slate-400 mt-3 flex items-center justify-center gap-1.5">
                  <Shield className="h-3 w-3 text-emerald-600" />
                  Your phone number and identity remain confidential under DPDP Act 2023 guidelines.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. FOOTER NOTE */}
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

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="flex items-center gap-3 text-slate-600 text-xs font-semibold">
            <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
            <span>Loading registration gateway...</span>
          </div>
        </div>
      }
    >
      <SignupFormContent />
    </Suspense>
  );
}
