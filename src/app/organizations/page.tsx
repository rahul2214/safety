'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Building2,
  Plus,
  Shield,
  ShieldCheck,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Lock,
  Download,
  Trash2,
  LogOut,
  ChevronRight,
  ExternalLink,
  Info,
  RefreshCw,
  HelpCircle,
  Eye,
  UserCheck,
  MapPin,
  Phone,
  User
} from 'lucide-react';
import {
  apiClient,
  type UserOrganizationConnection,
  type OrgConsentItem,
  type DpdpExportResult
} from '@/lib/api-client';

const SCOPE_DETAILS: Record<string, { label: string; desc: string; icon: any }> = {
  profile: {
    label: 'Profile Identification',
    desc: 'Allows organization safety officers to view your real name and avatar instead of an anonymized placeholder.',
    icon: User,
  },
  contact_info: {
    label: 'Emergency Contact Info',
    desc: 'Allows responders to view your phone number and verified email during campus emergency alerts.',
    icon: Phone,
  },
  location_during_sos: {
    label: 'Location During Active SOS',
    desc: 'Grants real-time GPS visibility to campus security ONLY while you have an active SOS alert open. Auto-expires when the alert is closed.',
    icon: MapPin,
  },
  location_sharing: {
    label: 'Continuous Location Sharing',
    desc: 'Allows campus safety officers to view your live location during campus hours for preventive security patrols.',
    icon: ShieldCheck,
  },
};

export default function UserOrganizationsPage() {
  const [orgs, setOrgs] = useState<UserOrganizationConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Join Modal State
  const [isJoinOpen, setIsJoinOpen] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [isInviteToken, setIsInviteToken] = useState(false);
  const [joinConsents, setJoinConsents] = useState<Record<string, boolean>>({
    profile: true,
    contact_info: true,
    location_during_sos: true,
    location_sharing: false,
  });
  const [joining, setJoining] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);
  const [joinSuccess, setJoinSuccess] = useState<string | null>(null);

  // Consents Modal State
  const [selectedOrg, setSelectedOrg] = useState<UserOrganizationConnection | null>(null);
  const [consentModalOpen, setConsentModalOpen] = useState(false);
  const [activeConsents, setActiveConsents] = useState<Record<string, boolean>>({});
  const [updatingConsents, setUpdatingConsents] = useState(false);
  const [consentMessage, setConsentMessage] = useState<string | null>(null);

  // Leave / Erase State
  const [actionOrg, setActionOrg] = useState<UserOrganizationConnection | null>(null);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [isEraseModalOpen, setIsEraseModalOpen] = useState(false);
  const [performingAction, setPerformingAction] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const loadOrganizations = async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true); else setLoading(true);
    setError(null);

    const res = await apiClient.getMyOrganizations(true);
    setLoading(false);
    setRefreshing(false);

    if (res.ok && res.data) {
      setOrgs(res.data);
    } else {
      setError(res.error || 'Failed to load your organizations.');
    }
  };

  useEffect(() => {
    loadOrganizations();
  }, []);

  const handleOpenConsents = (org: UserOrganizationConnection) => {
    setSelectedOrg(org);
    const map: Record<string, boolean> = {};
    org.consents.forEach((c) => {
      map[c.scope] = c.isGranted;
    });
    // Ensure all 4 scopes exist
    ['profile', 'contact_info', 'location_during_sos', 'location_sharing'].forEach((s) => {
      if (map[s] === undefined) map[s] = false;
    });
    setActiveConsents(map);
    setConsentMessage(null);
    setConsentModalOpen(true);
  };

  const handleSaveConsents = async () => {
    if (!selectedOrg) return;
    setUpdatingConsents(true);
    setConsentMessage(null);

    const updates = Object.entries(activeConsents).map(([scope, granted]) => ({
      scope,
      granted,
    }));

    const res = await apiClient.updateOrganizationConsents(selectedOrg.organizationId, updates);
    setUpdatingConsents(false);

    if (res.ok && res.data) {
      setConsentMessage('Consent permissions updated immediately.');
      // Refresh list
      loadOrganizations(true);
    } else {
      setConsentMessage(res.error || 'Failed to update consents.');
    }
  };

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCode.trim()) return;

    setJoining(true);
    setJoinError(null);
    setJoinSuccess(null);

    const grantedScopes = Object.entries(joinConsents)
      .filter(([_, v]) => v)
      .map(([k]) => k);

    let res;
    if (isInviteToken || joinCode.trim().startsWith('sabhi_inv_')) {
      res = await apiClient.joinOrganizationByInvite(joinCode.trim(), grantedScopes);
    } else {
      res = await apiClient.joinOrganizationByCode(joinCode.trim(), grantedScopes);
    }

    setJoining(false);

    if (res.ok) {
      const data = res.data as any;
      if (data?.isPendingApproval) {
        setJoinSuccess('Join request submitted! An organization administrator will review your application.');
      } else {
        setJoinSuccess('Joined organization successfully!');
      }
      setJoinCode('');
      loadOrganizations(true);
      setTimeout(() => {
        setIsJoinOpen(false);
        setJoinSuccess(null);
      }, 2000);
    } else {
      setJoinError(res.error || 'Failed to join organization. Please verify your code.');
    }
  };

  const handleExportData = async (org: UserOrganizationConnection) => {
    const res = await apiClient.exportOrganizationData(org.organizationId);
    if (res.ok && res.data) {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(res.data, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `DPDP_Export_${org.organizationSlug}_${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } else {
      alert(res.error || 'Failed to export data.');
    }
  };

  const handleConfirmLeave = async () => {
    if (!actionOrg) return;
    setPerformingAction(true);
    setActionError(null);

    const res = await apiClient.leaveOrganization(actionOrg.organizationId);
    setPerformingAction(false);

    if (res.ok) {
      setIsLeaveModalOpen(false);
      setActionOrg(null);
      loadOrganizations(true);
    } else {
      setActionError(res.error || 'Could not leave organization.');
    }
  };

  const handleConfirmErase = async () => {
    if (!actionOrg) return;
    setPerformingAction(true);
    setActionError(null);

    const res = await apiClient.eraseOrganizationData(actionOrg.organizationId);
    setPerformingAction(false);

    if (res.ok) {
      setIsEraseModalOpen(false);
      setActionOrg(null);
      loadOrganizations(true);
    } else {
      setActionError(res.error || 'Could not process data erasure.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      {/* Top Banner / Header */}
      <div className="bg-[#1e293b] text-white border-b border-slate-700">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-700/60 text-blue-200 text-xs font-medium mb-3">
                <ShieldCheck className="w-4 h-4 text-orange-400" />
                Verified Campus & Workplace Safety Network
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                My Connected Organisations
              </h1>
              <p className="mt-1 text-sm sm:text-base text-blue-200 max-w-2xl">
                Connect securely with your university, company, or residential campus for localized safety alerts,
                rapid SOS responder dispatch, and full data consent autonomy under the DPDP Act 2023.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => loadOrganizations(true)}
                disabled={loading || refreshing}
                className="p-2.5 rounded-xl bg-blue-800/80 hover:bg-blue-700 text-blue-200 hover:text-white transition border border-blue-700/60"
                title="Refresh Organizations"
              >
                <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={() => {
                  setJoinError(null);
                  setJoinSuccess(null);
                  setIsJoinOpen(true);
                }}
                className="flex items-center gap-2 px-5 py-2.5 bg-orange-600 hover:bg-orange-500 active:bg-orange-700 text-white font-semibold rounded-xl shadow-lg shadow-orange-600/25 transition transform active:scale-95"
              >
                <Plus className="w-5 h-5" />
                <span>Join Organisation</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1 text-sm font-medium">{error}</div>
            <button
              onClick={() => loadOrganizations(true)}
              className="text-xs bg-rose-200/60 hover:bg-rose-200 text-rose-900 px-3 py-1 rounded-md font-semibold"
            >
              Retry
            </button>
          </div>
        )}

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-500">
            <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mb-3" />
            <p className="text-sm font-medium">Loading your organisation connections...</p>
          </div>
        ) : orgs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center shadow-sm max-w-xl mx-auto mt-6">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-100">
              <Building2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No Organisations Connected</h3>
            <p className="text-sm text-slate-600 mt-2 max-w-md mx-auto">
              You have not joined any campus or workplace organization yet. Enter your university or company join code
              or invitation link to receive emergency alerts.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => setIsJoinOpen(true)}
                className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition"
              >
                Join with Code or Link
              </button>
              <Link
                href="/organization-request"
                className="w-full sm:w-auto px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium rounded-xl transition"
              >
                Register an Organisation
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {orgs.map((org) => {
              const isPending = org.status?.toLowerCase() === 'pending';
              const isSuspended = org.orgStatus?.toLowerCase() === 'suspended';
              const activeConsentsCount = org.consents.filter((c) => c.isGranted).length;

              return (
                <div
                  key={org.organizationId}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition overflow-hidden flex flex-col"
                >
                  {/* Card Header */}
                  <div className="p-6 border-b border-slate-100 flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-xl bg-[#6d4aff] text-white flex items-center justify-center font-bold text-lg shadow-sm">
                        {org.organizationName.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-lg leading-snug">
                          {org.organizationName}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium uppercase tracking-wider">
                            {org.organizationType || 'Campus'}
                          </span>
                          <span className="text-xs text-slate-400">•</span>
                          <span className="text-xs text-slate-500 font-mono">
                            {org.organizationSlug}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div>
                      {isPending ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          Pending Approval
                        </span>
                      ) : isSuspended ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-200">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                          Org Suspended
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Connected
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 flex-1 flex flex-col justify-between gap-4">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <span className="text-xs text-slate-500 font-medium block">Your Role</span>
                        <span className="font-semibold text-slate-900 mt-0.5 block capitalize">
                          {org.role.toLowerCase().replace('_', ' ')}
                        </span>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <span className="text-xs text-slate-500 font-medium block">Connected Since</span>
                        <span className="font-semibold text-slate-900 mt-0.5 block">
                          {org.joinedAt ? new Date(org.joinedAt).toLocaleDateString() : 'Recent'}
                        </span>
                      </div>
                    </div>

                    {/* Privacy & Consents Summary */}
                    <div className="bg-blue-50/60 border border-blue-100 rounded-xl p-3.5 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <Shield className="w-5 h-5 text-blue-600 shrink-0" />
                        <div>
                          <div className="text-xs font-bold text-blue-900">
                            Privacy & Consent Shields
                          </div>
                          <div className="text-xs text-blue-700">
                            {activeConsentsCount} of {org.consents.length || 4} data permissions active
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleOpenConsents(org)}
                        className="text-xs font-semibold text-blue-700 hover:text-blue-900 bg-white px-3 py-1.5 rounded-lg border border-blue-200 hover:border-blue-300 shadow-sm transition"
                      >
                        Manage Toggles
                      </button>
                    </div>

                    {/* Pending Notice */}
                    {isPending && (
                      <div className="text-xs bg-amber-50 border border-amber-200 text-amber-800 p-3 rounded-xl flex items-start gap-2">
                        <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <span>
                          Your join request has been sent to the organization administrators. You will be able to access
                          campus emergency broadcasts once approved.
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Card Footer Actions */}
                  <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                    <button
                      onClick={() => handleExportData(org)}
                      className="inline-flex items-center gap-1.5 text-slate-600 hover:text-slate-900 font-medium p-1.5 rounded-lg hover:bg-slate-200/60 transition"
                      title="Download DPDP Act Section 11 Data Report"
                    >
                      <Download className="w-4 h-4 text-slate-500" />
                      <span>Export Data</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setActionOrg(org);
                          setActionError(null);
                          setIsEraseModalOpen(true);
                        }}
                        className="inline-flex items-center gap-1.5 text-rose-600 hover:text-rose-700 font-medium p-1.5 rounded-lg hover:bg-rose-50 transition"
                        title="Right to Erasure (DPDP Act 2023)"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Erase & Leave</span>
                      </button>
                      <button
                        onClick={() => {
                          setActionOrg(org);
                          setActionError(null);
                          setIsLeaveModalOpen(true);
                        }}
                        className="inline-flex items-center gap-1.5 text-slate-600 hover:text-slate-900 font-medium p-1.5 rounded-lg hover:bg-slate-200/60 transition"
                        title="Leave this organization"
                      >
                        <LogOut className="w-4 h-4 text-slate-500" />
                        <span>Leave</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ─── JOIN ORGANISATION MODAL ─── */}
      {isJoinOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-6 bg-[#1e293b] text-white flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">Join an Organisation</h3>
                <p className="text-xs text-blue-200 mt-0.5">
                  Enter your campus join code or cryptographic invite token
                </p>
              </div>
              <button
                onClick={() => setIsJoinOpen(false)}
                className="text-blue-300 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleJoin} className="p-6 space-y-5">
              {joinError && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{joinError}</span>
                </div>
              )}

              {joinSuccess && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{joinSuccess}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Join Code or Invitation Link
                </label>
                <input
                  type="text"
                  value={joinCode}
                  onChange={(e) => {
                    setJoinCode(e.target.value);
                    if (e.target.value.startsWith('sabhi_inv_')) setIsInviteToken(true);
                  }}
                  placeholder="e.g. CAMPUS-8492 or sabhi_inv_..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm font-mono uppercase placeholder:font-sans placeholder:normal-case"
                  required
                />
                <span className="text-[11px] text-slate-500 mt-1.5 block">
                  You can get this from your university administrator, HR department, or campus safety coordinator.
                </span>
              </div>

              {/* Data Disclosures & Consent Toggles */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                  <Lock className="w-4 h-4 text-blue-600" />
                  <span>Data Privacy & Consent Disclosures (DPDP Act 2023)</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Choose what personal safety information this organization is authorized to access upon joining.
                  You can modify or revoke any permission at any time.
                </p>

                <div className="space-y-2.5 pt-2">
                  {Object.entries(SCOPE_DETAILS).map(([key, info]) => {
                    const isChecked = joinConsents[key] ?? false;
                    return (
                      <label
                        key={key}
                        className="flex items-start gap-3 p-2.5 rounded-lg bg-white border border-slate-200 hover:border-slate-300 cursor-pointer transition"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) =>
                            setJoinConsents((prev) => ({ ...prev, [key]: e.target.checked }))
                          }
                          className="mt-1 w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                        />
                        <div className="text-xs">
                          <span className="font-semibold text-slate-900 block">{info.label}</span>
                          <span className="text-slate-500 text-[11px] leading-tight block mt-0.5">
                            {info.desc}
                          </span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsJoinOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-sm font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={joining}
                  className="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 active:bg-orange-700 text-white text-sm font-semibold shadow-md shadow-orange-600/20 transition disabled:opacity-50"
                >
                  {joining ? 'Connecting...' : 'Join Organisation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── CONSENT MANAGEMENT MODAL ─── */}
      {consentModalOpen && selectedOrg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">Privacy & Consent Permissions</h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Organisation: <span className="text-blue-300 font-semibold">{selectedOrg.organizationName}</span>
                </p>
              </div>
              <button
                onClick={() => setConsentModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="text-xs text-slate-600 bg-blue-50 p-3 rounded-xl border border-blue-100 flex items-start gap-2">
                <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>
                  Under Section 6 of the DPDP Act 2023, consent withdrawal takes immediate effect. Revoking a scope
                  instantly redacts your data from campus responder screens.
                </span>
              </div>

              {consentMessage && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{consentMessage}</span>
                </div>
              )}

              <div className="space-y-3">
                {Object.entries(SCOPE_DETAILS).map(([key, info]) => {
                  const isChecked = activeConsents[key] ?? false;
                  const Icon = info.icon;
                  return (
                    <div
                      key={key}
                      className="p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 transition bg-white flex items-start justify-between gap-3"
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-blue-50 text-blue-700 shrink-0 mt-0.5">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900">{info.label}</div>
                          <div className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                            {info.desc}
                          </div>
                        </div>
                      </div>

                      <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) =>
                            setActiveConsents((prev) => ({ ...prev, [key]: e.target.checked }))
                          }
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setConsentModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold transition"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={handleSaveConsents}
                  disabled={updatingConsents}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md shadow-blue-600/20 transition disabled:opacity-50"
                >
                  {updatingConsents ? 'Saving...' : 'Save Permissions'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── LEAVE MODAL ─── */}
      {isLeaveModalOpen && actionOrg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center mx-auto">
              <LogOut className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="text-base font-bold text-slate-900">
                Leave {actionOrg.organizationName}?
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                You will immediately stop receiving campus security advisories and local SOS responders will no longer
                be automatically assigned to your emergencies.
              </p>
            </div>

            {actionError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{actionError}</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setIsLeaveModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-medium transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmLeave}
                disabled={performingAction}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold transition disabled:opacity-50"
              >
                {performingAction ? 'Leaving...' : 'Confirm Leave'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── ERASE & LEAVE MODAL (DPDP) ─── */}
      {isEraseModalOpen && actionOrg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-100">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="text-base font-bold text-slate-900">
                Exercise DPDP Right to Erasure?
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                This will revoke all granted consents, scrub your member identification details, and detach your account
                from <span className="font-semibold text-slate-800">{actionOrg.organizationName}</span> permanently.
              </p>
            </div>

            {actionError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{actionError}</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setIsEraseModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-medium transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmErase}
                disabled={performingAction}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition disabled:opacity-50"
              >
                {performingAction ? 'Processing Erasure...' : 'Erase My Data'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
