'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Settings,
  Shield,
  MapPin,
  Clock,
  Key,
  Copy,
  CheckCircle2,
  Bell,
  Save,
} from 'lucide-react';

export default function OrgSettingsPage() {
  const [copied, setCopied] = useState(false);
  const [joinCode, setJoinCode] = useState('sabhijude-campus');
  const [orgName, setOrgName] = useState('Sabhijude Corporate Campus');
  const [contactPhone, setContactPhone] = useState('+91 98765 43210');
  const [contactEmail, setContactEmail] = useState('security.desk@sabhijude.org');
  const [saved, setSaved] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(joinCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
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
          <span className="text-stone-300 font-semibold">Settings</span>
        </div>
        <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2.5">
          <Settings className="text-rose-500" size={22} />
          <span>Campus Protection Settings & Student Onboarding Key</span>
        </h1>
        <p className="text-xs text-stone-400 mt-1">
          Configure security control room contacts, dispatch zones, and student self-enrollment codes.
        </p>
      </div>

      {saved && (
        <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center gap-2 text-emerald-300 text-xs font-semibold">
          <CheckCircle2 size={16} />
          <span>Organization safety configurations updated successfully!</span>
        </div>
      )}

      {/* Join Code Card */}
      <div className="bg-stone-900/60 border border-stone-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Key size={16} className="text-indigo-400" />
              <span>Mobile Student & Employee Join Code</span>
            </h2>
            <p className="text-xs text-stone-400 mt-0.5">
              Share this code or campus slug with students/employees to link their Sabhijude mobile app to this dashboard.
            </p>
          </div>
          <div className="px-2.5 py-1 bg-indigo-500/10 border border-indigo-500/30 rounded-lg text-indigo-300 text-[10px] font-black uppercase">
            Active
          </div>
        </div>

        <div className="flex items-center gap-3 mt-4 bg-stone-950 p-3 rounded-xl border border-stone-800">
          <code className="text-sm font-mono font-bold text-indigo-300 flex-1">{joinCode}</code>
          <button
            onClick={handleCopyCode}
            className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold flex items-center gap-1.5 transition"
          >
            {copied ? <CheckCircle2 size={13} className="text-emerald-400" /> : <Copy size={13} />}
            <span>{copied ? 'Copied' : 'Copy Code'}</span>
          </button>
        </div>
      </div>

      {/* Institutional Details */}
      <form onSubmit={handleSave} className="bg-stone-900/40 border border-stone-800 rounded-2xl p-6 space-y-4 text-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 border-b border-stone-800 pb-2">
          Control Room Dispatch Coordinates
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-stone-400 mb-1 font-semibold">Organization / Campus Name</label>
            <input
              type="text"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-200 focus:outline-none focus:border-rose-500"
            />
          </div>

          <div>
            <label className="block text-stone-400 mb-1 font-semibold">Emergency Desk Hot-line</label>
            <input
              type="text"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-200 focus:outline-none focus:border-rose-500"
            />
          </div>

          <div>
            <label className="block text-stone-400 mb-1 font-semibold">Dispatch Alert Email</label>
            <input
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-200 focus:outline-none focus:border-rose-500"
            />
          </div>

          <div>
            <label className="block text-stone-400 mb-1 font-semibold">Automatic Dispatch Radius</label>
            <select className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-300 focus:outline-none focus:border-rose-500">
              <option>Campus Boundary + 2 km Buffer</option>
              <option>Strict Campus Boundary Only</option>
              <option>Metro Region / City-Wide</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end pt-3">
          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold flex items-center gap-1.5 shadow-sm"
          >
            <Save size={14} />
            <span>Save Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
}
