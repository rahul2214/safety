'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Building2, Lock, Mail, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import { useAdminAuth } from '@/portals/org/lib/auth-context';

export default function OrgLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAdminAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const res = await login(email, password);
    setSubmitting(false);

    if (res.success) {
      window.location.href = '/org/dashboard';
    } else {
      setError(res.error || 'Invalid credentials or organization not enrolled.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f7f7fa] px-4 relative select-none">
      <div className="relative z-10 max-w-md w-full bg-white border border-[#e8e8f0] rounded-[22px] p-7 sm:p-8 shadow-sm">
        <div className="flex flex-col items-center mb-6 text-center">
          <div className="h-14 w-14 bg-[#6d4aff] rounded-[18px] flex items-center justify-center text-white shadow-md shadow-[#6d4aff]/20 mb-3.5">
            <Building2 size={26} />
          </div>
          <h1 className="text-[22px] font-black text-[#16161d] tracking-tight">
            Organization Safety Console
          </h1>
          <p className="text-[13px] text-[#5b5b6e] mt-1">
            Campus security, workplace protection & responder command
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3 bg-[#e11d48]/10 border border-[#e11d48]/20 rounded-[12px] flex items-center gap-2.5 text-[#e11d48] text-xs font-medium">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10.5px] font-black text-[#5b5b6e] uppercase tracking-[1px] mb-1.5">
              INSTITUTION / CORPORATE EMAIL
            </label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3.5 text-[#9797ab]" size={16} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="safety@campus.edu or security@workplace.com"
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
            <span>Sign In to Safety Command</span>
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-[#e8e8f0] text-center space-y-2">
          <p className="text-[10.5px] text-[#9797ab]">
            Protected by Sabhijude Multi-Tenant Security Command
          </p>
          <div className="pt-1">
            <Link
              href="/"
              className="text-xs font-semibold text-[#6d4aff] hover:underline inline-flex items-center gap-1"
            >
              ← Return to Sabhijude Community Portal
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
