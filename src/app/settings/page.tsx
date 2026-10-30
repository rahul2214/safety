'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Settings,
  User,
  Shield,
  Lock,
  Bell,
  MapPin,
  Smartphone,
  CheckCircle2,
  ArrowLeft,
  ChevronRight,
  ExternalLink,
  Compass,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/components/Toast';
import { getCurrentCoordinates } from '@/lib/location';

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<string>('Account');

  // Form states
  const [displayName, setDisplayName] = useState(user?.displayName || 'Protected Member');
  const [phone, setPhone] = useState(user?.phoneNumber || '+91 98765 00000');
  const [emergencySmsEnabled, setEmergencySmsEnabled] = useState(true);
  const [pushAlertsEnabled, setPushAlertsEnabled] = useState(true);
  const [weeklyAdvisoryEnabled, setWeeklyAdvisoryEnabled] = useState(false);

  // Diagnostics
  const [locDiagnostic, setLocDiagnostic] = useState<string | null>(null);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Profile information updated successfully.', 'success');
  };

  const handleTestGps = async () => {
    setLocDiagnostic('Testing GPS sensor fix...');
    try {
      const loc = await getCurrentCoordinates();
      setLocDiagnostic(`✓ Sensor Operational: Lat ${loc.latitude.toFixed(4)}, Lon ${loc.longitude.toFixed(4)} (±${Math.round(loc.accuracy)}m)`);
    } catch (err: any) {
      setLocDiagnostic(`✕ Sensor Error: ${err.message}`);
    }
  };

  const sections = [
    { id: 'Account', label: 'Account & Identity', icon: User },
    { id: 'Privacy', label: 'Privacy & Sharing', icon: Lock },
    { id: 'Notifications', label: 'Notification Preferences', icon: Bell },
    { id: 'Diagnostics', label: 'Device Diagnostics', icon: Smartphone },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200">
        
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-[-0.02em] text-ink">Portal Settings &amp; Preferences</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Manage your verified identity, emergency dispatches, and device diagnostics.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Settings Navigation Sidebar (4 cols) */}
        <div className="md:col-span-4 space-y-1">
          {sections.map((sec) => {
            const Icon = sec.icon;
            const isSelected = activeTab === sec.id;
            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => setActiveTab(sec.id)}
                className={`w-full flex items-center justify-between p-3 rounded-lg text-xs font-medium transition-colors text-left ${
                  isSelected
                    ? 'bg-slate-900 text-white font-semibold shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200/80'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="h-4 w-4" />
                  <span>{sec.label}</span>
                </div>
                <ChevronRight className="h-3.5 w-3.5 opacity-60" />
              </button>
            );
          })}

          <div className="pt-3">
            <Link
              href="/privacy"
              className="w-full flex items-center justify-between p-3 rounded-lg text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 hover:bg-blue-100 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                <span>Open Privacy Center</span>
              </div>
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Tab Content Panel (8 cols) */}
        <div className="md:col-span-8">
          {activeTab === 'Account' && (
            <Card className="p-6 space-y-5">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Personal Information &amp; Account</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Your identity is protected and only disclosed according to your visibility rules.
                </p>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Registered Email
                  </label>
                  <input
                    type="email"
                    value={user?.email || 'user@sabhijude.local'}
                    disabled
                    className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs text-slate-500 bg-slate-50 cursor-not-allowed"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Contact safety administration to update your primary security email.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Verified Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <Button type="submit" variant="primary">
                    <span>Save Changes</span>
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {activeTab === 'Privacy' && (
            <Card className="p-6 space-y-5">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Privacy &amp; Location Sharing</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Manage how your location is shared during emergencies.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-blue-50/60 border border-blue-100 text-xs space-y-1">
                <p className="font-semibold text-blue-900">Privacy First Architecture</p>
                <p className="text-blue-800 leading-relaxed text-[11px]">
                  All sensitive incident reports are aggregated into approximate geographic zones to safeguard your identity.
                </p>
              </div>

              <div className="space-y-3 text-xs">
                <Link
                  href="/privacy"
                  className="p-3.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors flex items-center justify-between"
                >
                  <div>
                    <p className="font-bold text-slate-900">Dedicated Privacy Center</p>
                    <p className="text-slate-500 text-[11px]">
                      View plain-language explanations of all 6 privacy safeguards
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                </Link>

                <Link
                  href="/contacts"
                  className="p-3.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors flex items-center justify-between"
                >
                  <div>
                    <p className="font-bold text-slate-900">Configure Emergency Contacts</p>
                    <p className="text-slate-500 text-[11px]">
                      Manage who receives live coordinates when SOS is triggered
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                </Link>
              </div>
            </Card>
          )}

          {activeTab === 'Notifications' && (
            <Card className="p-6 space-y-5">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Notification Delivery Preferences</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Choose channels for emergency dispatches and case progression alerts.
                </p>
              </div>

              <div className="space-y-3 text-xs">
                <label className="flex items-center justify-between p-3.5 rounded-lg border border-slate-200 bg-white cursor-pointer">
                  <div className="space-y-0.5">
                    <p className="font-bold text-slate-900">Emergency SMS Relay</p>
                    <p className="text-[11px] text-slate-500">
                      Dispatches direct cellular SMS if internet network connectivity is lost
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={emergencySmsEnabled}
                    onChange={(e) => setEmergencySmsEnabled(e.target.checked)}
                    className="h-4 w-4 text-blue-600 rounded"
                  />
                </label>

                <label className="flex items-center justify-between p-3.5 rounded-lg border border-slate-200 bg-white cursor-pointer">
                  <div className="space-y-0.5">
                    <p className="font-bold text-slate-900">Browser &amp; Push Alerts</p>
                    <p className="text-[11px] text-slate-500">
                      Case status transitions and triage updates
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={pushAlertsEnabled}
                    onChange={(e) => setPushAlertsEnabled(e.target.checked)}
                    className="h-4 w-4 text-blue-600 rounded"
                  />
                </label>

                <label className="flex items-center justify-between p-3.5 rounded-lg border border-slate-200 bg-white cursor-pointer">
                  <div className="space-y-0.5">
                    <p className="font-bold text-slate-900">Weekly Community Safety Digest</p>
                    <p className="text-[11px] text-slate-500">
                      Summarized municipal transit notices and lighting infrastructure audits
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={weeklyAdvisoryEnabled}
                    onChange={(e) => setWeeklyAdvisoryEnabled(e.target.checked)}
                    className="h-4 w-4 text-blue-600 rounded"
                  />
                </label>
              </div>
            </Card>
          )}

          {activeTab === 'Diagnostics' && (
            <Card className="p-6 space-y-5">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Device Diagnostics &amp; Sensor Calibration</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Verify browser hardware sensors to ensure emergency readiness.
                </p>
              </div>

              <div className="space-y-3">
                {/* GPS Calibration */}
                <div className="p-4 rounded-lg border border-slate-200 bg-white flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold text-slate-900">Geolocation Fix</p>
                    <p className="text-[11px] text-slate-500">Verifies browser GPS hardware accuracy</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleTestGps}>
                    <Compass className="h-3.5 w-3.5 mr-1" />
                    <span>Test Sensor</span>
                  </Button>
                </div>

                {locDiagnostic && (
                  <div className="p-2.5 rounded bg-blue-50 text-blue-900 text-xs font-mono">
                    {locDiagnostic}
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
