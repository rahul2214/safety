'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/portals/admin/lib/auth-context';
import { Shield, Lock, Mail, AlertCircle, Loader2, ArrowRight, KeyRound, ChevronLeft } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mfaCode, setMfaCode] = useState('');
  const [challengeToken, setChallengeToken] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login, verifyMfa } = useAdminAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const res = await login(email, password);
    setSubmitting(false);

    if (res.success) {
      window.location.href = '/admin/dashboard';
    } else if (res.mfaRequired && res.challengeToken) {
      setChallengeToken(res.challengeToken);
    } else {
      setError(res.error || 'Invalid administrator credentials');
    }
  };

  const handleMfaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!challengeToken) return;
    setError('');
    setSubmitting(true);

    const res = await verifyMfa(challengeToken, mfaCode);
    setSubmitting(false);

    if (res.success) {
      window.location.href = '/admin/dashboard';
    } else {
      setError(res.error || 'Invalid verification code. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f7f7fa] px-4 relative select-none">
      <div className="relative z-10 max-w-md w-full bg-white border border-[#e8e8f0] rounded-[22px] p-7 sm:p-8 shadow-sm">
        <div className="flex flex-col items-center mb-6 text-center">
          <div className="h-14 w-14 bg-[#6d4aff] rounded-[18px] flex items-center justify-center text-white shadow-md shadow-[#6d4aff]/20 mb-3.5">
            {challengeToken ? <KeyRound size={28} /> : <Shield size={28} className="fill-white/20" />}
          </div>
          <h1 className="text-[22px] font-black text-[#16161d] tracking-tight">
            {challengeToken ? 'Two-Factor Verification' : 'Sabhijude Admin Console'}
          </h1>
          <p className="text-[13px] text-[#5b5b6e] mt-1">
            {challengeToken
              ? 'Enter the 6-digit code from your authenticator app or recovery code'
              : 'Platform moderation, incident triage & responder operations'}
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3 bg-[#e11d48]/10 border border-[#e11d48]/20 rounded-[12px] flex items-center gap-2.5 text-[#e11d48] text-xs font-medium">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {challengeToken ? (
          <form onSubmit={handleMfaSubmit} className="space-y-4">
            <div>
              <label className="block text-[10.5px] font-black text-[#5b5b6e] uppercase tracking-[1px] mb-1.5">
                AUTHENTICATOR OR RECOVERY CODE
              </label>
              <div className="relative flex items-center">
                <KeyRound className="absolute left-3.5 text-[#9797ab]" size={16} />
                <input
                  type="text"
                  required
                  autoFocus
                  maxLength={16}
                  value={mfaCode}
                  onChange={(e) => setMfaCode(e.target.value)}
                  placeholder="123456 or ABCD-1234"
                  className="w-full bg-[#f7f7fa] border border-[#e8e8f0] text-[#16161d] tracking-widest font-mono text-center rounded-[14px] pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#6d4aff] focus:bg-white transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-2 bg-[#6d4aff] hover:bg-[#5835e5] disabled:opacity-50 text-white font-bold py-3 rounded-[14px] transition-all duration-150 flex items-center justify-center gap-2 shadow-sm text-xs"
            >
              {submitting ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={16} />}
              <span>Verify & Access Dashboard</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setChallengeToken(null);
                setMfaCode('');
                setError('');
              }}
              className="w-full text-center text-xs text-[#5b5b6e] hover:text-[#16161d] font-semibold flex items-center justify-center gap-1 mt-2"
            >
              <ChevronLeft size={14} /> Back to Sign In
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10.5px] font-black text-[#5b5b6e] uppercase tracking-[1px] mb-1.5">
                ADMINISTRATOR EMAIL
              </label>
              <div className="relative flex items-center">
                <Mail className="absolute left-3.5 text-[#9797ab]" size={16} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="w-full bg-[#f7f7fa] border border-[#e8e8f0] text-[#16161d] rounded-[14px] pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-[#6d4aff] focus:bg-white transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10.5px] font-black text-[#5b5b6e] uppercase tracking-[1px] mb-1.5">
                PASSWORD
              </label>
              <div className="relative flex items-center">
                <Lock className="absolute left-3.5 text-[#9797ab]" size={16} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#f7f7fa] border border-[#e8e8f0] text-[#16161d] rounded-[14px] pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-[#6d4aff] focus:bg-white transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-2 bg-[#6d4aff] hover:bg-[#5835e5] disabled:opacity-50 text-white font-bold py-3 rounded-[14px] transition-all duration-150 flex items-center justify-center gap-2 shadow-sm text-xs"
            >
              {submitting ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={16} />}
              <span>Sign In to Dashboard</span>
            </button>
          </form>
        )}

        <div className="mt-6 pt-5 border-t border-[#e8e8f0] text-center">
          <Link
            href="/"
            className="text-xs font-semibold text-[#6d4aff] hover:underline inline-flex items-center gap-1"
          >
            ← Return to Sabhijude Community Portal
          </Link>
        </div>
      </div>
    </div>
  );
}
