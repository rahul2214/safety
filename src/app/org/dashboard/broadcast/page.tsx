'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Radio,
  AlertTriangle,
  Send,
  Users,
  Building,
  Bell,
  CheckCircle2,
  AlertCircle,
  Shield,
  Smartphone,
} from 'lucide-react';
import { organizationsApi } from '@/portals/org/lib/api';
import { useOrg } from '@/portals/org/lib/org-context';

export default function OrgBroadcastPage() {
  const { organization } = useOrg();

  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [urgency, setUrgency] = useState<'HIGH' | 'CRITICAL' | 'INFO'>('HIGH');
  const [targetAudience, setTargetAudience] = useState<'ALL' | 'STUDENTS' | 'STAFF'>('ALL');
  const [sending, setSending] = useState(false);
  const [successStatus, setSuccessStatus] = useState<string | null>(null);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);

  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle || !broadcastMessage || !organization) return;

    setSending(true);
    setSuccessStatus(null);
    setErrorStatus(null);

    const res = await organizationsApi.sendBroadcast(organization.id, {
      title: broadcastTitle,
      message: broadcastMessage,
      urgency,
      targetAudience,
    });

    setSending(false);

    // This screen used to declare success unconditionally, so a rejected broadcast still
    // told the operator that the whole campus had been alerted.
    if (!res.ok) {
      setErrorStatus(res.error?.message ?? 'The broadcast could not be sent.');
      return;
    }

    setSuccessStatus(
      `"${broadcastTitle}" was sent to ${
        targetAudience === 'ALL' ? 'all members' : targetAudience.toLowerCase()
      } of ${organization.name}.`
    );
    setBroadcastTitle('');
    setBroadcastMessage('');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="border-b border-stone-800 pb-5">
        <div className="flex items-center gap-2 text-xs text-stone-400 mb-1">
          <Link href="/org/dashboard" className="hover:text-stone-200 transition-colors">
            Campus Command
          </Link>
          <span>/</span>
          <span className="text-stone-300 font-semibold">Broadcast Center</span>
        </div>
        <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2.5">
          <Radio className="text-rose-500" size={22} />
          <span>Campus-Wide Emergency Broadcast System</span>
        </h1>
        <p className="text-xs text-stone-400 mt-1">
          Broadcast critical safety announcements, weather emergencies, or campus lockdown notices directly to mobile devices.
        </p>
      </div>

      {successStatus && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-start gap-3 text-emerald-300 text-xs">
          <CheckCircle2 size={18} className="shrink-0 mt-0.5 text-emerald-400" />
          <div className="leading-relaxed font-medium">{successStatus}</div>
        </div>
      )}

      {errorStatus && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-start gap-3 text-rose-300 text-xs">
          <AlertCircle size={18} className="shrink-0 mt-0.5 text-rose-400" />
          <div className="leading-relaxed font-medium">
            <span className="font-bold">Broadcast not sent. </span>
            {errorStatus}
          </div>
        </div>
      )}

      {/* Broadcast Form */}
      <div className="bg-stone-900/50 border border-stone-800 rounded-2xl p-6">
        <form onSubmit={handleSendBroadcast} className="space-y-4 text-xs">
          <div>
            <label className="block text-stone-400 font-semibold mb-1.5 uppercase tracking-wider text-[10px]">
              Broadcast Urgency Level
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'CRITICAL', label: 'Critical Emergency', color: 'border-rose-500 bg-rose-500/10 text-rose-300' },
                { id: 'HIGH', label: 'High Alert', color: 'border-amber-500 bg-amber-500/10 text-amber-300' },
                { id: 'INFO', label: 'Safety Advisory', color: 'border-blue-500 bg-blue-500/10 text-blue-300' },
              ].map((lvl) => (
                <button
                  type="button"
                  key={lvl.id}
                  onClick={() => setUrgency(lvl.id as any)}
                  className={`p-3 rounded-xl border text-center font-bold transition ${
                    urgency === lvl.id
                      ? lvl.color + ' ring-1 ring-white/20'
                      : 'border-stone-800 bg-stone-950 text-stone-500 hover:border-stone-700'
                  }`}
                >
                  {lvl.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-stone-400 font-semibold mb-1.5 uppercase tracking-wider text-[10px]">
                Broadcast Headline
              </label>
              <input
                type="text"
                required
                value={broadcastTitle}
                onChange={(e) => setBroadcastTitle(e.target.value)}
                placeholder="e.g. North Gate Perimeter Lockdown in Progress"
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-stone-200 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-stone-400 font-semibold mb-1.5 uppercase tracking-wider text-[10px]">
                Target Audience
              </label>
              <select
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value as any)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-stone-300 focus:outline-none focus:border-rose-500"
              >
                <option value="ALL">All Enrolled Campus Members (Students & Staff)</option>
                <option value="STUDENTS">Students Only</option>
                <option value="STAFF">Campus Security & Staff Only</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-stone-400 font-semibold mb-1.5 uppercase tracking-wider text-[10px]">
              Detailed Instructions / Action Required
            </label>
            <textarea
              rows={4}
              required
              value={broadcastMessage}
              onChange={(e) => setBroadcastMessage(e.target.value)}
              placeholder="Provide clear, concise instructions for students and faculty (e.g. Stay indoors inside Hall 4 until campus security gives all clear)."
              className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3.5 text-stone-200 focus:outline-none focus:border-rose-500"
            />
          </div>

          {/* Warning Banner */}
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center gap-2.5 text-amber-300/80 text-[11px]">
            <AlertTriangle size={15} className="shrink-0 text-amber-400" />
            <span>
              This will trigger an immediate push alert to all connected mobile devices linked to this organization.
            </span>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={sending}
              className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold flex items-center gap-2 shadow-sm disabled:opacity-50 transition"
            >
              <Send size={14} />
              <span>{sending ? 'Transmitting Alert...' : 'Broadcast to All Campus Devices'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
