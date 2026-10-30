'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Lock,
  Eye,
  MapPin,
  Shield,
  Smartphone,
  CheckCircle2,
  ArrowLeft,
  LogOut,
  Info,
  UserX,
  ExternalLink,
  Users,
  Bell,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useToast } from '@/components/Toast';
import { useAuth } from '@/lib/auth-context';
import { api, PostVisibility, EmergencyContact } from '@/lib/api-client';
import { Skeleton } from '@/components/ui/Skeleton';

interface BlockedUserItem {
  userId: number;
  blockedUserId: number;
  createdAt: string;
}

export default function PrivacyCenterPage() {
  const { user, token, logout } = useAuth();
  const { showToast } = useToast();

  const [isLoading, setIsLoading] = useState(true);

  // User privacy preferences
  const [visibilities, setVisibilities] = useState<PostVisibility[]>([]);
  const [defaultVisibilityId, setDefaultVisibilityId] = useState<number>(1);
  const [anonymizeReportsDefault, setAnonymizeReportsDefault] = useState<boolean>(true);
  const [locationSharingEnabled, setLocationSharingEnabled] = useState<boolean>(true);
  const [pushAlertsEnabled, setPushAlertsEnabled] = useState<boolean>(true);

  // Contacts and blocked accounts
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);
  const [blockedUsers, setBlockedUsers] = useState<BlockedUserItem[]>([]);

  // Browser diagnostics
  const [browserInfo, setBrowserInfo] = useState<string>('Web Browser');

  // Load privacy settings
  const fetchPrivacyData = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch audience visibility options
      const visRes = await api.getPostVisibilities();
      if (visRes.ok && visRes.data) {
        setVisibilities(visRes.data);
      }

      // 2. Fetch user profile
      const profRes = await api.getMyProfile();
      if (profRes.ok && profRes.data?.user) {
        if (typeof profRes.data.user.pushNotifications === 'boolean') {
          setPushAlertsEnabled(profRes.data.user.pushNotifications);
        }
      }

      // 3. Fetch registered emergency contacts
      const contactsRes = await api.getEmergencyContacts();
      if (contactsRes.ok && contactsRes.data) {
        setEmergencyContacts(contactsRes.data);
      }

      // 4. Fetch blocked users
      const blockedRes = await api.getBlockedUsers();
      if (blockedRes.ok && blockedRes.data) {
        setBlockedUsers(blockedRes.data);
      }
    } catch (err: any) {
      console.warn('Error loading privacy options:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPrivacyData();

    // Load saved local preferences
    try {
      const savedAnon = localStorage.getItem('safecircle_pref_anonymize_default');
      if (savedAnon !== null) {
        setAnonymizeReportsDefault(savedAnon === 'true');
      }
      const savedVis = localStorage.getItem('safecircle_pref_default_visibility_id');
      if (savedVis !== null) {
        setDefaultVisibilityId(Number(savedVis));
      }
      const savedLoc = localStorage.getItem('safecircle_pref_location_sharing');
      if (savedLoc !== null) {
        setLocationSharingEnabled(savedLoc === 'true');
      }
    } catch {
      // Ignore localStorage exceptions
    }

    // Detect browser platform
    if (typeof window !== 'undefined') {
      const ua = navigator.userAgent;
      let os = 'Unknown OS';
      if (ua.indexOf('Win') !== -1) os = 'Windows';
      else if (ua.indexOf('Mac') !== -1) os = 'macOS';
      else if (ua.indexOf('Linux') !== -1) os = 'Linux';
      else if (ua.indexOf('Android') !== -1) os = 'Android';
      else if (ua.indexOf('iPhone') !== -1 || ua.indexOf('iPad') !== -1) os = 'iOS';

      let browser = 'Browser';
      if (ua.indexOf('Firefox') !== -1) browser = 'Firefox';
      else if (ua.indexOf('Chrome') !== -1) browser = 'Chrome';
      else if (ua.indexOf('Safari') !== -1) browser = 'Safari';
      else if (ua.indexOf('Edge') !== -1) browser = 'Edge';

      setBrowserInfo(`${os} (${browser})`);
    }
  }, []);

  // Save privacy defaults
  const handleToggleAnonymity = () => {
    const nextVal = !anonymizeReportsDefault;
    setAnonymizeReportsDefault(nextVal);
    localStorage.setItem('safecircle_pref_anonymize_default', String(nextVal));
    showToast(
      nextVal
        ? 'Default reporting set to Anonymous'
        : 'Default reporting set to Identified Name',
      'success'
    );
  };

  const handleChangeVisibility = (visId: number) => {
    setDefaultVisibilityId(visId);
    localStorage.setItem('safecircle_pref_default_visibility_id', String(visId));
    const selected = visibilities.find((v) => v.id === visId)?.name || 'Everyone';
    showToast(`Default audience set to "${selected}"`, 'success');
  };

  const handleToggleLocation = () => {
    const nextVal = !locationSharingEnabled;
    setLocationSharingEnabled(nextVal);
    localStorage.setItem('safecircle_pref_location_sharing', String(nextVal));
    showToast(
      nextVal
        ? 'High-accuracy GPS enabled for emergency dispatches'
        : 'GPS sharing restricted to manual landmarks only',
      'info'
    );
  };

  const handleTogglePushNotifications = () => {
    const nextVal = !pushAlertsEnabled;
    setPushAlertsEnabled(nextVal);
    showToast(
      nextVal
        ? 'Emergency safety alerts enabled'
        : 'Emergency safety alerts silenced',
      'info'
    );
  };

  const handleUnblockUser = async (blockedUserId: number) => {
    try {
      const res = await api.unblockUser(blockedUserId);
      if (res.ok) {
        setBlockedUsers((prev) => prev.filter((u) => u.blockedUserId !== blockedUserId));
        showToast('Account unblocked successfully.', 'success');
      } else {
        showToast('Unable to unblock user. Please try again.', 'error');
      }
    } catch {
      showToast('Network error while unblocking user.', 'error');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200">
        <div className="flex items-center gap-2 mb-1">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Dashboard</span>
          </Link>
          <span className="text-slate-300">&bull;</span>
          <Link
            href="/settings"
            className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
          >
            Settings
          </Link>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Privacy Center &amp; Personal Safeguards
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage your personal privacy, anonymous reporting, emergency location sharing, and account protection.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchPrivacyData}
            disabled={isLoading}
            className="text-xs"
          >
            <RefreshCw className={`h-3.5 w-3.5 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh Settings</span>
          </Button>
        </div>
      </div>

      {/* The Sabhijude Privacy Guarantee Banner */}
      <Card className="p-5 border-emerald-200 bg-emerald-50/50 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs">
            <Shield className="h-4 w-4 text-emerald-600" />
            <span>The Sabhijude Privacy Guarantee</span>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-200/80 text-emerald-900 uppercase tracking-wide">
            Verified Active
          </span>
        </div>
        <p className="text-xs text-emerald-800 leading-relaxed">
          Sabhijude is designed around strict privacy-first principles. We never sell personal information,
          display commercial advertisements, or track your location without your explicit action.
          You maintain full ownership and control over your identity, safety submissions, and emergency alerts.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-1 text-[11px] text-emerald-900">
          <div className="flex items-center gap-1.5 bg-white/70 px-2.5 py-1.5 rounded border border-emerald-200/60 font-medium">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
            <span>Zero Commercial Data Sharing</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white/70 px-2.5 py-1.5 rounded border border-emerald-200/60 font-medium">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
            <span>Anonymous Reporting by Default</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white/70 px-2.5 py-1.5 rounded border border-emerald-200/60 font-medium">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
            <span>Encrypted Emergency Telemetry</span>
          </div>
        </div>
      </Card>

      {/* Core Privacy Controls */}
      <div className="space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Core Privacy Controls
        </h2>

        {/* 1. Anonymity in Reports */}
        <Card className="p-5 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
                <Eye className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Incident Masking &amp; Anonymous Reporting
                </h3>
                <p className="text-xs text-slate-500">
                  Default reporting mode: <strong className={anonymizeReportsDefault ? 'text-emerald-600' : 'text-slate-600'}>
                    {anonymizeReportsDefault ? 'Anonymous Masking Active' : 'Public Display Name'}
                  </strong>
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleToggleAnonymity}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                anonymizeReportsDefault ? 'bg-blue-600' : 'bg-slate-300'
              }`}
              aria-label="Toggle Anonymity"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  anonymizeReportsDefault ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 border-t border-slate-100 text-xs">
            <div className="p-3 rounded-lg bg-slate-50 space-y-1">
              <p className="font-bold text-slate-800 uppercase text-[10px] tracking-wider">
                How It Works
              </p>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Strips your name, avatar, and contact details from community submissions by default.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 space-y-1">
              <p className="font-bold text-slate-800 uppercase text-[10px] tracking-wider">
                Who Can See It
              </p>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Community members only see the incident description and neighborhood. You appear as &ldquo;Anonymous Member&rdquo;.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 space-y-1">
              <p className="font-bold text-slate-800 uppercase text-[10px] tracking-wider">
                Emergency Triage
              </p>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Your report receives immediate support and verification while keeping your real identity completely protected.
              </p>
            </div>
          </div>
        </Card>

        {/* 2. Target Audience Visibility */}
        <Card className="p-5 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-50 text-purple-600 border border-purple-100">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Default Target Audience
                </h3>
                <p className="text-xs text-slate-500">
                  Select which group can view your community safety reports by default.
                </p>
              </div>
            </div>
          </div>

          {/* Visibility Selector */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            {visibilities.length > 0 ? (
              visibilities.map((vis) => {
                const isSelected = defaultVisibilityId === vis.id;
                return (
                  <button
                    key={vis.id}
                    type="button"
                    onClick={() => handleChangeVisibility(vis.id)}
                    className={`p-3 rounded-lg text-left border transition-all ${
                      isSelected
                        ? 'border-purple-600 bg-purple-50/60 shadow-xs'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-900">{vis.name}</span>
                    </div>
                    <p className="text-[10px] text-slate-500">
                      {vis.id === 1 && 'Visible to all community members'}
                      {vis.id === 2 && 'Restricted to verified women members only'}
                      {vis.id === 3 && 'Restricted to verified men members only'}
                      {vis.id === 4 && 'Restricted to non-binary members only'}
                    </p>
                  </button>
                );
              })
            ) : (
              <>
                <Skeleton className="h-16 rounded-xl" />
                <Skeleton className="h-16 rounded-xl" />
                <Skeleton className="h-16 rounded-xl" />
                <Skeleton className="h-16 rounded-xl" />
              </>
            )}
          </div>

          <div className="p-3 rounded-lg bg-purple-50/50 border border-purple-100 text-[11px] text-purple-900 flex items-start gap-2">
            <Info className="h-4 w-4 text-purple-600 shrink-0 mt-0.5" />
            <div>
              <strong>Audience Protection:</strong> Posts restricted to specific groups are only viewable by verified members of that group.
            </div>
          </div>
        </Card>

        {/* 3. Location Sharing */}
        <Card className="p-5 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-rose-50 text-rose-600 border border-rose-100">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Location Precision &amp; GPS Sharing
                </h3>
                <p className="text-xs text-slate-500">
                  Status:{' '}
                  <strong className={locationSharingEnabled ? 'text-blue-600' : 'text-slate-500'}>
                    {locationSharingEnabled ? 'GPS Fix Enabled for SOS & Hazards' : 'Manual Landmarks Only'}
                  </strong>
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleToggleLocation}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                locationSharingEnabled ? 'bg-blue-600' : 'bg-slate-300'
              }`}
              aria-label="Toggle Location Telemetry"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  locationSharingEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 border-t border-slate-100 text-xs">
            <div className="p-3 rounded-lg bg-slate-50 space-y-1">
              <p className="font-bold text-slate-800 uppercase text-[10px] tracking-wider">
                When Used
              </p>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Your device coordinates are captured only when you trigger Emergency SOS or press &ldquo;Use Current Location&rdquo;.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 space-y-1">
              <p className="font-bold text-slate-800 uppercase text-[10px] tracking-wider">
                Who Receives It
              </p>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Sent only to your designated emergency contacts and authorized first responders during active SOS broadcasts.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 space-y-1">
              <p className="font-bold text-slate-800 uppercase text-[10px] tracking-wider">
                Map Anonymization
              </p>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Public Safety Map incidents display neighborhood vicinities rather than exact private addresses.
              </p>
            </div>
          </div>
        </Card>

        {/* 4. Push Alerts */}
        <Card className="p-5 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-50 text-amber-600 border border-amber-100">
                <Bell className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Critical Safety &amp; Emergency Alerts
                </h3>
                <p className="text-xs text-slate-500">
                  Status:{' '}
                  <strong className={pushAlertsEnabled ? 'text-emerald-600' : 'text-slate-500'}>
                    {pushAlertsEnabled ? 'Active (Critical Advisories Enabled)' : 'Muted'}
                  </strong>
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleTogglePushNotifications}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                pushAlertsEnabled ? 'bg-blue-600' : 'bg-slate-300'
              }`}
              aria-label="Toggle Push Alerts"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  pushAlertsEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </Card>
      </div>

      {/* Emergency Contacts & Blocklist Management */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        {/* Emergency Contacts Summary */}
        <Card className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-rose-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Emergency SOS Contacts
              </h3>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
              {emergencyContacts.length} Registered
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Only contacts explicitly saved in your trusted contacts list receive high-priority SMS alerts and real-time location fixes during an emergency SOS.
          </p>

          <div className="pt-2">
            <Link href="/contacts">
              <Button variant="outline" size="sm" className="w-full text-xs">
                <span>Manage Emergency Contacts</span>
                <ExternalLink className="h-3.5 w-3.5 ml-1.5" />
              </Button>
            </Link>
          </div>
        </Card>

        {/* Blocked Accounts Summary */}
        <Card className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UserX className="h-4 w-4 text-slate-700" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Blocked Accounts
              </h3>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
              {blockedUsers.length} Blocked
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Blocked accounts cannot view your reports or contact you, and their posts are automatically hidden from your community feed.
          </p>

          {blockedUsers.length > 0 ? (
            <div className="space-y-1.5 max-h-36 overflow-y-auto divide-y divide-slate-100 border border-slate-100 rounded-lg p-2 bg-slate-50 text-xs">
              {blockedUsers.map((bu) => (
                <div key={bu.blockedUserId} className="flex items-center justify-between py-1 px-1">
                  <span className="font-medium text-slate-800">Account #{bu.blockedUserId}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleUnblockUser(bu.blockedUserId)}
                    className="h-6 text-[10px] text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-2"
                  >
                    Unblock
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-2.5 rounded bg-slate-50 border border-slate-100 text-[11px] text-slate-500 text-center">
              No blocked accounts on record.
            </div>
          )}
        </Card>
      </div>

      {/* Active Session & Device Authentication */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Active Browser Session
            </h2>
            <p className="text-xs text-slate-500">
              Verified identity and session status for this device.
            </p>
          </div>

          {token && (
            <Button variant="outline" size="sm" onClick={logout} className="text-xs">
              <LogOut className="h-3.5 w-3.5 mr-1" />
              <span>Sign Out This Device</span>
            </Button>
          )}
        </div>

        <Card className="p-4 flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-slate-100 text-slate-700">
              <Smartphone className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-bold text-slate-900">{browserInfo}</p>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700">
                  CURRENT ACTIVE SESSION
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {user?.email || 'Authenticated Member'} &bull; Verified Session
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
              <CheckCircle2 className="h-3 w-3" />
              PROTECTED
            </span>
          </div>
        </Card>
      </div>
    </div>
  );
}
