'use client';

import React, { useState, useEffect, useCallback } from'react';
import Link from'next/link';
import { useRouter } from'next/navigation';
import {
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Lock,
  LogOut,
  User,
  ShieldAlert,
  Loader2,
  Phone,
  Mail,
  Users,
  Share2,
  Building2,
  Calendar,
  Briefcase,
  Award,
  Download,
  Trash2,
  Edit3,
  Bookmark,
  MessageSquare,
  Heart,
  Plus,
  ExternalLink,
  AlertTriangle,
  RefreshCw,
  Bell,
  Sparkles,
  Shield,
  Clock,
  ChevronRight,
  UserCheck,
} from'lucide-react';
import { getCurrentCoordinates } from'@/lib/location';
import { useAuth } from'@/lib/auth-context';
import {
  api,
  EmergencyContact,
  BackendPost,
  Gender,
} from'@/lib/api-client';
import { AuthGuard } from'@/components/AuthGuard';
import { Skeleton } from'@/components/ui/Skeleton';
import { Modal } from'@/components/ui/Modal';

interface UserProfileData {
  id?: number;
  authId?: string;
  email?: string;
  displayName?: string;
  avatarUrl?: string;
  bio?: string;
  isVerifiedExpert?: boolean;
  expertiseAreas?: string[];
  reputation?: number;
  genderId?: number | null;
  dob?: string | null;
  phoneNumber?: string | null;
  occupationStatusId?: number | null;
  pushNotifications?: boolean;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface UserStatsData {
  postCount: number;
  solutionCount: number;
  supportGivenCount: number;
  supportReceivedCount: number;
  resolvedPostCount: number;
}

interface UserOrgData {
  organizationId: number;
  organizationName: string;
  organizationSlug: string;
  organizationType: string;
  role: string;
  memberType: string;
  memberCode?: string;
  status: string;
  joinedAt: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const { user: authUser, isAuthenticated, logout } = useAuth();

  // Full DB Profile State
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [stats, setStats] = useState<UserStatsData>({
  postCount: 0,
  solutionCount: 0,
  supportGivenCount: 0,
  supportReceivedCount: 0,
  resolvedPostCount: 0,
  });
  const [guardians, setGuardians] = useState<EmergencyContact[]>([]);
  const [organizations, setOrganizations] = useState<UserOrgData[]>([]);
  const [recentPosts, setRecentPosts] = useState<BackendPost[]>([]);
  const [savedPostsCount, setSavedPostsCount] = useState<number>(0);
  const [genders, setGenders] = useState<Gender[]>([]);
  const [occupations, setOccupations] = useState<Array<{ id: number; name: string }>>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [testLocMsg, setTestLocMsg] = useState<string | null>(null);

  // Edit Profile Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editForm, setEditForm] = useState({
  displayName: '',
  bio: '',
  dob: '',
  genderId: '',
  occupationStatusId: '',
  });
  const [editSaving, setEditSaving] = useState<boolean>(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [editSuccess, setEditSuccess] = useState<string | null>(null);

  // Join Organization by Code State
  const [joinCodeInput, setJoinCodeInput] = useState<string>('');
  const [isJoiningOrg, setIsJoiningOrg] = useState<boolean>(false);
  const [joinOrgMsg, setJoinOrgMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // DPDP Export & Account Erasure State
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState<string>('');

  // ─── Fetch All Related Profile Data ──────────────────────────────────────
  const loadAllProfileData = useCallback(async (isRefresh = false) => {
  if (!isAuthenticated) return;
  if (isRefresh) setRefreshing(true);
  else setLoading(true);

  try {
  const [
  profileRes,
  statsRes,
  guardiansRes,
  orgsRes,
  gendersRes,
  occupationsRes,
  postsRes,
  savedRes,
  ] = await Promise.all([
  api.getMyProfile(isRefresh),
  api.getMyStats(isRefresh),
  api.getEmergencyContacts(isRefresh),
  api.getMyOrganizations(isRefresh),
  api.getGenders(isRefresh),
  api.getOccupationStatuses(isRefresh),
  api.getMyPosts({ limit: 4, forceRefresh: isRefresh }),
  api.getSavedPosts(50),
  ]);

  // 1. User Profile Data
  if (profileRes.ok && profileRes.data) {
  const u = (profileRes.data as any).user || profileRes.data;
  setProfile(u);
  setEditForm({
  displayName: u.displayName || authUser?.displayName || '',
  bio: u.bio || '',
  dob: u.dob || '',
  genderId: u.genderId ? u.genderId.toString() : '',
  occupationStatusId: u.occupationStatusId ? u.occupationStatusId.toString() : '',
  });
  }

  // 2. User Activity Stats
  if (statsRes.ok && statsRes.data) {
  setStats(statsRes.data);
  }

  // 3. Emergency Contacts
  if (guardiansRes.ok && guardiansRes.data) {
  setGuardians(guardiansRes.data);
  }

  // 4. Organizations
  if (orgsRes.ok && orgsRes.data) {
  setOrganizations(orgsRes.data);
  }

  // 5. Lookups
  if (gendersRes.ok && gendersRes.data) {
  setGenders(gendersRes.data);
  }
  if (occupationsRes.ok && occupationsRes.data) {
  setOccupations(occupationsRes.data);
  }

  // 6. Recent Posts & Saved
  if (postsRes.ok && postsRes.data) {
  setRecentPosts(postsRes.data);
  }
  if (savedRes.ok && savedRes.data) {
  setSavedPostsCount(Array.isArray(savedRes.data) ? savedRes.data.length : 0);
  }
  } catch (err) {
  console.warn('Error loading related profile data:', err);
  } finally {
  setLoading(false);
  setRefreshing(false);
  }
  }, [isAuthenticated, authUser?.displayName]);

  useEffect(() => {
  loadAllProfileData();
  }, [loadAllProfileData]);

  // ─── Formatting Helpers ──────────────────────────────────────────────────
  const formatDate = (dateStr?: string | null) => {
  if (!dateStr) return'Not set';
  try {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-IN', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  });
  } catch {
  return dateStr;
  }
  };

  const calculateAge = (dobStr?: string | null) => {
  if (!dobStr) return null;
  try {
  const dob = new Date(dobStr);
  if (isNaN(dob.getTime())) return null;
  const diffMs = Date.now() - dob.getTime();
  const ageDt = new Date(diffMs);
  const age = Math.abs(ageDt.getUTCFullYear() - 1970);
  return isNaN(age) || age < 1 || age > 120 ? null : `${age} yrs`;
  } catch {
  return null;
  }
  };

  // Resolved lookup values
  const currentGenderName =
  genders.find((g) => g.id === profile?.genderId)?.name ||
  (profile?.genderId ? `Gender #${profile.genderId}` : 'Not specified');

  const currentOccupationName =
  occupations.find((o) => o.id === profile?.occupationStatusId)?.name ||
  (profile?.occupationStatusId ? `Occupation #${profile.occupationStatusId}` : 'Not specified');

  // Safety Readiness Calculation
  let readinessScore = 20; // Base user registration
  if (guardians.length >= 1) readinessScore += 25;
  if (guardians.length >= 2) readinessScore += 25;
  if (profile?.phoneNumber || authUser?.phoneNumber) readinessScore += 15;
  if (profile?.dob || profile?.genderId || profile?.occupationStatusId) readinessScore += 15;
  const readinessPercent = Math.min(readinessScore, 100);

  // ─── Actions ─────────────────────────────────────────────────────────────
  const handleTestLocation = async () => {
  setTestLocMsg('Acquiring high-accuracy browser GPS sensor...');
  try {
  const loc = await getCurrentCoordinates();
  setTestLocMsg(
  `✓ GPS Connected: ${loc.latitude.toFixed(4)}, ${loc.longitude.toFixed(4)} (accuracy ±${Math.round(
  loc.accuracy
  )}m)`
  );
  } catch (e: any) {
  setTestLocMsg(`✕ Location Sensor: ${e.message}`);
  }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
  e.preventDefault();
  setEditSaving(true);
  setEditError(null);
  setEditSuccess(null);

  try {
  const res = await api.updateProfile({
  displayName: editForm.displayName.trim(),
  bio: editForm.bio.trim(),
  dob: editForm.dob.trim() || undefined,
  genderId: editForm.genderId ? Number(editForm.genderId) : undefined,
  occupationStatusId: editForm.occupationStatusId ? Number(editForm.occupationStatusId) : undefined,
  });

  if (res.ok) {
  setEditSuccess('Profile saved successfully!');
  await loadAllProfileData(true);
  setTimeout(() => {
  setIsEditModalOpen(false);
  setEditSuccess(null);
  }, 800);
  } else {
  setEditError(res.error || 'Failed to update profile.');
  }
  } catch (err: any) {
  setEditError(err.message || 'An unexpected error occurred.');
  } finally {
  setEditSaving(false);
  }
  };

  const handleJoinOrg = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!joinCodeInput.trim()) return;
  setIsJoiningOrg(true);
  setJoinOrgMsg(null);

  try {
  const res = await api.joinOrganizationByCode(joinCodeInput.trim());
  if (res.ok) {
  setJoinOrgMsg({ type: 'success', text: 'Joined organization successfully!' });
  setJoinCodeInput('');
  const updatedOrgs = await api.getMyOrganizations(true);
  if (updatedOrgs.ok && updatedOrgs.data) {
  setOrganizations(updatedOrgs.data);
  }
  } else {
  setJoinOrgMsg({ type: 'error', text: res.error || 'Invalid or expired join code.' });
  }
  } catch (err: any) {
  setJoinOrgMsg({ type: 'error', text: err.message || 'Error joining organization.' });
  } finally {
  setIsJoiningOrg(false);
  }
  };

  const handleLeaveOrg = async (orgId: number, orgName: string) => {
  if (!confirm(`Are you sure you want to leave ${orgName}?`)) return;
  try {
  const res = await api.leaveOrganization(orgId);
  if (res.ok) {
  setOrganizations((prev) => prev.filter((o) => o.organizationId !== orgId));
  } else {
  alert(res.error || 'Failed to leave organization.');
  }
  } catch (e: any) {
  alert(e.message || 'Error leaving organization.');
  }
  };

  const handleExportData = async () => {
  setIsExporting(true);
  try {
  const res = await api.exportAccountData();
  if (res.ok && res.data) {
  const blob = new Blob([JSON.stringify(res.data, null, 2)], {
  type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `sabhijude_profile_data_export_${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  } else {
  alert(res.error || 'Could not export profile data archive.');
  }
  } catch (e: any) {
  alert(e.message || 'Error exporting profile data.');
  } finally {
  setIsExporting(false);
  }
  };

  const handleDeleteAccount = async () => {
  if (deleteConfirmText.trim().toUpperCase() !== 'DELETE') return;
  setIsDeleting(true);
  try {
  const res = await api.deleteAccount();
  if (res.ok) {
  alert('Your account and personal data have been completely deleted per DPDP regulations.');
  logout();
  router.push('/');
  } else {
  alert(res.error || 'Failed to process account deletion request.');
  }
  } catch (e: any) {
  alert(e.message || 'Error processing deletion.');
  } finally {
  setIsDeleting(false);
  setIsDeleteModalOpen(false);
  }
  };

  const handleLogout = () => {
  logout();
  router.push('/login');
  };

  return (
  <AuthGuard
  title="Member Profile Protected"
  description="Your personal identity, phone verification, and emergency circle diagnostics are confidential. Please sign in to view and manage your profile."
  >
  <div className="space-y-6 max-w-4xl mx-auto select-none pb-12">
  {/* Top Header */}
  <div className="flex items-center justify-between">
  <div>
  <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-[-0.02em] text-ink">
  Member Profile & Identity
  </h1>
  <p className="text-[13.5px] text-slate-600 mt-0.5">
  Comprehensive account details, emergency readiness, and safety telemetry.
  </p>
  </div>

  <button
  onClick={() => loadAllProfileData(true)}
  disabled={refreshing || loading}
  title="Refresh database records"
  className="p-2.5 rounded-[12px] bg-white border border-slate-200 text-slate-600 hover:text-brand transition shadow-xs flex items-center gap-1.5 text-xs font-semibold"
  >
  <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin text-brand' : ''}`} />
  <span className="hidden sm:inline">Refresh</span>
  </button>
  </div>

  {/* ─── 1. Primary Identity Card ────────────────────────────────────── */}
  <section className="bg-white rounded-[24px] border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row items-center gap-6 relative overflow-hidden">
  <div className="w-24 h-24 rounded-full bg-brand text-white flex items-center justify-center text-4xl font-black shrink-0 shadow-md">
  {profile?.displayName
  ? profile.displayName.charAt(0).toUpperCase()
  : authUser?.displayName
  ? authUser.displayName.charAt(0).toUpperCase()
  : 'U'}
  </div>

  <div className="text-center md:text-left space-y-2 flex-1 min-w-0">
  <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
  <h2 className="text-[22px] font-black text-ink truncate">
  {profile?.displayName || authUser?.displayName || 'Protected Member'}
  </h2>
  {profile?.isVerifiedExpert ? (
  <span className="px-2.5 py-0.5 rounded-full bg-brand-tint text-brand text-xs font-bold flex items-center gap-1">
  <Sparkles className="h-3 w-3" /> Verified Safety Expert
  </span>
  ) : (
  <span className="px-2.5 py-0.5 rounded-full bg-[#ecfdf5] text-[#059669] text-xs font-bold flex items-center gap-1">
  <CheckCircle2 className="h-3.5 w-3.5" /> Good Standing
  </span>
  )}
   
  </div>

  <div className="text-[13px] text-slate-600 flex flex-wrap items-center justify-center md:justify-start gap-4">
  <span className="flex items-center gap-1.5">
  <Mail className="h-3.5 w-3.5 text-slate-400" />
  {profile?.email || authUser?.email || 'No email registered'}
  </span>
  <span className="flex items-center gap-1.5">
  <Phone className="h-3.5 w-3.5 text-slate-400" />
  {profile?.phoneNumber || authUser?.phoneNumber || 'No phone added'}
  </span>
  <span className="flex items-center gap-1.5">
  <Clock className="h-3.5 w-3.5 text-slate-400" />
  Joined {formatDate(profile?.createdAt)}
  </span>
  </div>

  {profile?.bio && (
  <p className="text-[13px] text-ink italic bg-mist p-2.5 rounded-[12px] border border-slate-200 max-w-xl">
  &ldquo;{profile.bio}&rdquo;
  </p>
  )}

  </div>

  <div className="flex md:flex-col gap-2 shrink-0">
  <button
  onClick={() => setIsEditModalOpen(true)}
  className="px-4 py-2.5 rounded-[14px] bg-brand hover:bg-[#5b3adb] text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
  >
  <Edit3 className="h-4 w-4" />
  <span>Edit Profile</span>
  </button>
   
  </div>
  </section>

  {/* ─── 2. Safety Readiness & Live Activity Stats (6-Block Grid) ──── */}
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
  {/* Guardians */}
  <Link
  href="/contacts"
  className="p-4 rounded-[18px] bg-white border border-slate-200 text-center shadow-xs hover:border-brand transition block group"
  >
  <span className="text-[22px] font-black text-ink block group-hover:text-brand">
  {loading ? <Skeleton className="h-6 w-10 mx-auto rounded-md" /> : guardians.length}
  </span>
  <p className="text-[11.5px] font-medium text-slate-600 mt-0.5">Guardians</p>
  </Link>

  {/* Readiness */}
  <div className="p-4 rounded-[18px] bg-white border border-slate-200 text-center shadow-xs">
  <span
  className={`text-[22px] font-black block ${
  readinessPercent >= 80
  ? 'text-[#059669]'
  : readinessPercent >= 50
  ? 'text-[#d97706]'
  : 'text-[#e11d48]'
  }`}
  >
  {loading ? <Skeleton className="h-6 w-12 mx-auto rounded-md" /> : `${readinessPercent}%`}
  </span>
  <p className="text-[11.5px] font-medium text-slate-600 mt-0.5">Readiness</p>
  </div>

  {/* Incidents Shared */}
  <Link
  href="/myposts"
  className="p-4 rounded-[18px] bg-white border border-slate-200 text-center shadow-xs hover:border-brand transition block group"
  >
  <span className="text-[22px] font-black text-brand block group-hover:underline">
  {loading ? <Skeleton className="h-6 w-10 mx-auto rounded-md" /> : stats.postCount}
  </span>
  <p className="text-[11.5px] font-medium text-slate-600 mt-0.5">Posts Shared</p>
  </Link>

  {/* Solutions Given */}
  <div className="p-4 rounded-[18px] bg-white border border-slate-200 text-center shadow-xs">
  <span className="text-[22px] font-black text-ink block">
  {loading ? <Skeleton className="h-6 w-10 mx-auto rounded-md" /> : stats.solutionCount}
  </span>
  <p className="text-[11.5px] font-medium text-slate-600 mt-0.5">Advice Given</p>
  </div>

  {/* Support Given */}
  <div className="p-4 rounded-[18px] bg-white border border-slate-200 text-center shadow-xs">
  <span className="text-[22px] font-black text-ink block">
  {loading ? <Skeleton className="h-6 w-10 mx-auto rounded-md" /> : stats.supportGivenCount}
  </span>
  <p className="text-[11.5px] font-medium text-slate-600 mt-0.5">Faced This Too</p>
  </div>

  {/* Saved Posts */}
  <div className="p-4 rounded-[18px] bg-white border border-slate-200 text-center shadow-xs">
  <span className="text-[22px] font-black text-ink block">
  {loading ? <Skeleton className="h-6 w-10 mx-auto rounded-md" /> : savedPostsCount}
  </span>
  <p className="text-[11.5px] font-medium text-slate-600 mt-0.5">Saved Guides</p>
  </div>
  </div>

  {/* ─── 3. Demographic & Account Metadata ──────────────────────────── */}
  <section className="bg-white rounded-[24px] border border-slate-200 p-6 shadow-sm space-y-4">
  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
  <div className="flex items-center gap-2">
  <UserCheck className="h-5 w-5 text-brand" />
  <h3 className="text-[16px] font-black text-ink">
  Personal & Safety Demographics
  </h3>
  </div>
  <button
  onClick={() => setIsEditModalOpen(true)}
  className="text-xs font-bold text-brand hover:underline flex items-center gap-1"
  >
  <Edit3 className="h-3.5 w-3.5" /> Edit Details
  </button>
  </div>

  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
  <div className="p-3.5 rounded-[16px] bg-mist border border-slate-200">
  <p className="text-[11.5px] font-medium text-slate-600">Display Name</p>
  <p className="text-[14px] font-bold text-ink mt-0.5">
  {profile?.displayName || 'Not configured'}
  </p>
  </div>

  <div className="p-3.5 rounded-[16px] bg-mist border border-slate-200">
  <p className="text-[11.5px] font-medium text-slate-600">Date of Birth</p>
  <p className="text-[14px] font-bold text-ink mt-0.5 flex items-center gap-2">
  {formatDate(profile?.dob)}
  {calculateAge(profile?.dob) && (
  <span className="text-[11px] px-2 py-0.5 rounded-full bg-brand-tint text-brand font-bold">
  {calculateAge(profile?.dob)}
  </span>
  )}
  </p>
  </div>

  <div className="p-3.5 rounded-[16px] bg-mist border border-slate-200">
  <p className="text-[11.5px] font-medium text-slate-600">Gender</p>
  <p className="text-[14px] font-bold text-ink mt-0.5">
  {currentGenderName}
  </p>
  </div>

  <div className="p-3.5 rounded-[16px] bg-mist border border-slate-200">
  <p className="text-[11.5px] font-medium text-slate-600">Occupation</p>
  <p className="text-[14px] font-bold text-ink mt-0.5">
  {currentOccupationName}
  </p>
  </div>

  <div className="p-3.5 rounded-[16px] bg-mist border border-slate-200">
  <p className="text-[11.5px] font-medium text-slate-600">Emergency Phone</p>
  <p className="text-[14px] font-bold text-ink mt-0.5">
  {profile?.phoneNumber || authUser?.phoneNumber || 'None linked'}
  </p>
  </div>

  <div className="p-3.5 rounded-[16px] bg-mist border border-slate-200">
  <p className="text-[11.5px] font-medium text-slate-600">Push Notifications</p>
  <p className="text-[14px] font-bold text-[#059669] mt-0.5 flex items-center gap-1.5">
  <Bell className="h-3.5 w-3.5" />
  {profile?.pushNotifications !== false ? 'Enabled' : 'Disabled'}
  </p>
  </div>
  </div>
  </section>

  {/* ─── 4. Emergency Circle Guardians ─────────────────────────────── */}
  <section className="bg-white rounded-[24px] border border-slate-200 p-6 shadow-sm space-y-4">
  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
  <div className="flex items-center gap-2">
  <Users className="h-5 w-5 text-brand" />
  <h3 className="text-[16px] font-black text-ink">
  Emergency Circle & Trusted Guardians ({guardians.length})
  </h3>
  </div>
  <Link
  href="/contacts"
  className="text-xs font-bold text-brand hover:underline flex items-center gap-1"
  >
  Manage Circle <ChevronRight className="h-3.5 w-3.5" />
  </Link>
  </div>

  {loading ? (
  <div className="space-y-2">
  <Skeleton className="h-14 w-full rounded-[16px]" />
  <Skeleton className="h-14 w-full rounded-[16px]" />
  </div>
  ) : guardians.length === 0 ? (
  <div className="p-6 rounded-[18px] bg-mist text-center space-y-2 border border-dashed border-slate-200">
  <AlertTriangle className="h-6 w-6 text-[#d97706] mx-auto" />
  <p className="text-sm font-bold text-ink">
  No emergency contacts added yet
  </p>
  <p className="text-xs text-slate-600 max-w-md mx-auto">
  Add at least two trusted contacts (parents, friends, siblings) so emergency SMS and
  real-time GPS dispatch can alert them instantly.
  </p>
  <Link
  href="/contacts"
  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[12px] bg-brand text-white text-xs font-bold shadow-xs hover:bg-[#5b3adb] transition mt-2"
  >
  <Plus className="h-3.5 w-3.5" /> Add First Guardian
  </Link>
  </div>
  ) : (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
  {guardians.map((c) => (
  <div
  key={c.id}
  className="p-4 rounded-[16px] bg-mist border border-slate-200 flex items-center justify-between"
  >
  <div className="space-y-0.5">
  <div className="flex items-center gap-2">
  <span className="text-sm font-bold text-ink">
  {c.name}
  </span>
  {c.isPrimary && (
  <span className="px-2 py-0.5 rounded-full bg-[#ecfdf5] text-[#059669] text-[10px] font-bold">
  Primary
  </span>
  )}
  </div>
  <p className="text-xs text-slate-600 flex items-center gap-2">
  <span>{c.relationship || 'Guardian'}</span>
  <span>•</span>
  <span className="font-mono">{c.phoneNumber}</span>
  </p>
  </div>
  <Link
  href={`tel:${c.phoneNumber}`}
  className="p-2 rounded-[10px] bg-white text-[#059669] hover:bg-[#ecfdf5] transition border border-slate-200"
  title="Call contact"
  >
  <Phone className="h-4 w-4" />
  </Link>
  </div>
  ))}
  </div>
  )}
  </section>

   
  {/* ─── 6. Recent Incident Posts & Community Shares ────────────────── */}
  <section className="bg-white rounded-[24px] border border-slate-200 p-6 shadow-sm space-y-4">
  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
  <div className="flex items-center gap-2">
  <Share2 className="h-5 w-5 text-brand" />
  <h3 className="text-[16px] font-black text-ink">
  My Recent Safety Shares ({stats.postCount})
  </h3>
  </div>
  <Link
  href="/myposts"
  className="text-xs font-bold text-brand hover:underline flex items-center gap-1"
  >
  View All Posts <ChevronRight className="h-3.5 w-3.5" />
  </Link>
  </div>

  {recentPosts.length === 0 ? (
  <p className="text-xs text-slate-600 py-2">
  You haven&apos;t shared any incident reports or safety spots yet. Your contributions help
  warn others in your neighborhood.
  </p>
  ) : (
  <div className="space-y-2.5">
  {recentPosts.map((post) => (
  <div
  key={post.id}
  className="p-3.5 rounded-[16px] bg-mist border border-slate-200 flex items-center justify-between gap-3"
  >
  <div className="min-w-0 space-y-1">
  <div className="flex items-center gap-2">
  <span className="px-2 py-0.5 rounded-full bg-brand-tint text-brand text-[10px] font-bold">
  {post.categoryName || 'General Safety'}
  </span>
  {post.isAnonymous && (
  <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-medium">
  Anonymous
  </span>
  )}
  <span className="text-[11px] text-slate-600">
  {formatDate(post.createdAt)}
  </span>
  </div>
  <p className="text-xs text-ink font-medium truncate">
  {post.content}
  </p>
  </div>

  <span className="text-[11px] font-bold text-[#059669] shrink-0">
  {post.status || 'Active'}
  </span>
  </div>
  ))}
  </div>
  )}
  </section>

  {/* ─── 7. Device Diagnostics & Geolocation Sensor ────────────────── */}
  <section className="bg-white rounded-[24px] border border-slate-200 p-6 shadow-sm space-y-4">
  <div className="flex items-center gap-2">
  <MapPin className="h-5 w-5 text-brand" />
  <h3 className="text-[16px] font-black text-ink">
  Device Diagnostics & Sensor Readiness
  </h3>
  </div>

  <div className="space-y-3">
  <div className="p-4 rounded-[16px] bg-mist border border-slate-200 flex items-center justify-between">
  <div>
  <p className="text-[13.5px] font-bold text-ink">
  High-Accuracy Geolocation Sensor
  </p>
  <p className="text-[12px] text-slate-600">
  Verifies browser GPS telemetry fix for zero-delay emergency SOS dispatch
  </p>
  </div>
  <button
  onClick={handleTestLocation}
  className="px-4 py-2 rounded-[12px] bg-white border border-slate-200 text-ink text-xs font-bold transition hover:border-brand shadow-xs"
  >
  Test Sensor
  </button>
  </div>

  {testLocMsg && (
  <div className="p-3.5 rounded-[14px] bg-brand-tint border border-brand/30 text-brand text-xs font-semibold">
  {testLocMsg}
  </div>
  )}
  </div>
  </section>

   
  {/* ─── Edit Profile Modal ─────────────────────────────────────────── */}
  <Modal
  isOpen={isEditModalOpen}
  onClose={() => setIsEditModalOpen(false)}
  title="Edit Member Profile"
  description="Update your personal details. Changes will reflect across your safety telemetry."
  >
  <form onSubmit={handleSaveProfile} className="space-y-4">
  {editError && (
  <div className="p-3 rounded-lg bg-red-50 text-red-700 text-xs font-medium border border-red-200">
  {editError}
  </div>
  )}
  {editSuccess && (
  <div className="p-3 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-200">
  {editSuccess}
  </div>
  )}

  <div>
  <label className="block text-xs font-bold text-slate-700 mb-1">Display Name</label>
  <input
  type="text"
  required
  maxLength={50}
  value={editForm.displayName}
  onChange={(e) => setEditForm({ ...editForm, displayName: e.target.value })}
  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand"
  placeholder="Your full or preferred name"
  />
  </div>

  <div>
  <label className="block text-xs font-bold text-slate-700 mb-1">Bio / Notes</label>
  <textarea
  rows={2}
  maxLength={200}
  value={editForm.bio}
  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand"
  placeholder="Optional short note about yourself or trusted campus dorm"
  />
  </div>

  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
  <div>
  <label className="block text-xs font-bold text-slate-700 mb-1">Date of Birth</label>
  <input
  type="date"
  value={editForm.dob}
  onChange={(e) => setEditForm({ ...editForm, dob: e.target.value })}
  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand"
  />
  </div>

  <div>
  <label className="block text-xs font-bold text-slate-700 mb-1">Gender</label>
  <select
  value={editForm.genderId}
  onChange={(e) => setEditForm({ ...editForm, genderId: e.target.value })}
  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand bg-white"
  >
  <option value="">Select Gender</option>
  {genders.map((g) => (
  <option key={g.id} value={g.id.toString()}>
  {g.name}
  </option>
  ))}
  </select>
  </div>
  </div>

  <div>
  <label className="block text-xs font-bold text-slate-700 mb-1">Occupation Status</label>
  <select
  value={editForm.occupationStatusId}
  onChange={(e) => setEditForm({ ...editForm, occupationStatusId: e.target.value })}
  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand bg-white"
  >
  <option value="">Select Occupation</option>
  {occupations.map((o) => (
  <option key={o.id} value={o.id.toString()}>
  {o.name}
  </option>
  ))}
  </select>
  </div>

  <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
  <button
  type="button"
  onClick={() => setIsEditModalOpen(false)}
  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
  >
  Cancel
  </button>
  <button
  type="submit"
  disabled={editSaving}
  className="px-5 py-2 rounded-xl bg-brand hover:bg-[#5b3adb] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
  >
  {editSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save Changes'}
  </button>
  </div>
  </form>
  </Modal>

  {/* ─── Delete Account Confirmation Modal ──────────────────────────── */}
  <Modal
  isOpen={isDeleteModalOpen}
  onClose={() => setIsDeleteModalOpen(false)}
  title="Confirm Account Erasure (DPDP Act)"
  description="This action is permanent and irrecoverable. All your emergency circles, posts, and verification will be permanently erased."
  >
  <div className="space-y-4">
  <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs space-y-1">
  <p className="font-bold">Permanent deletion warning:</p>
  <p>
  By proceeding, all your personal records, emergency guardians, and database telemetry
  will be scrubbed immediately per your DPDP right to be forgotten.
  </p>
  </div>

  <div>
  <label className="block text-xs font-bold text-slate-700 mb-1">
  Type <span className="font-mono text-red-600">DELETE</span> to confirm:
  </label>
  <input
  type="text"
  value={deleteConfirmText}
  onChange={(e) => setDeleteConfirmText(e.target.value)}
  placeholder="DELETE"
  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-mono focus:outline-none focus:border-red-500"
  />
  </div>

  <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
  <button
  type="button"
  onClick={() => setIsDeleteModalOpen(false)}
  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
  >
  Cancel
  </button>
  <button
  type="button"
  onClick={handleDeleteAccount}
  disabled={deleteConfirmText.trim().toUpperCase() !== 'DELETE' || isDeleting}
  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition disabled:opacity-40 flex items-center gap-1.5 shadow-sm"
  >
  {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Permanently Delete'}
  </button>
  </div>
  </div>
  </Modal>
  </div>
  </AuthGuard>
  );
}
