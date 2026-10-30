'use client';

import React, { useState, useEffect, useMemo, useRef, Suspense } from'react';
import Link from'next/link';
import { useSearchParams } from'next/navigation';
import {
  Radio,
  Search,
  Filter,
  SlidersHorizontal,
  Shield,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Phone,
  RefreshCw,
  Plus,
  Users,
  EyeOff,
  MapPin,
  Clock,
  Sparkles,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  LogIn,
  UserPlus,
  CheckCircle2,
  X,
  Calendar,
  ArrowUpDown,
  Flame,
  HelpCircle,
  Check,
  CheckSquare,
  Square,
  Tag,
  Layers,
} from'lucide-react';
import {
  api,
  type Category,
  type PostSeverityOption,
  type PostStatusOption,
} from'@/lib/api-client';
import { PostCard, type PostItem, getCategoryName } from'@/components/PostCard';
import { MultiSelectDropdown } from'@/components/ui/MultiSelectDropdown';
import { PostCardSkeleton } from'@/components/ui/Skeleton';
import { useAuth } from'@/lib/auth-context';

function FeedPageContent() {
  const { isAuthenticated } = useAuth();

  // Data loaded directly from DB tables
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [severities, setSeverities] = useState<PostSeverityOption[]>([]);
  const [statuses, setStatuses] = useState<PostStatusOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Multi-Selection Filters (Driven by database IDs)
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<(string | number)[]>([]);
  const [selectedSeverityIds, setSelectedSeverityIds] = useState<(string | number)[]>([]);
  const [selectedStatusIds, setSelectedStatusIds] = useState<(string | number)[]>([]);
  const [selectedAuthorTypes, setSelectedAuthorTypes] = useState<string[]>([]); // 'ANONYMOUS', 'IDENTIFIED'

  const searchParams = useSearchParams();
  const urlQuery = searchParams.get('q') || searchParams.get('search') || '';

  // Single-Value Filters & Sorting
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('ALL');
  const [locationQuery, setLocationQuery] = useState<string>('');
  const [hasLocationOnly, setHasLocationOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('NEWEST_INCIDENT');
  const [searchQuery, setSearchQuery] = useState<string>(urlQuery);

  // Sync searchQuery when URL query parameter updates
  useEffect(() => {
  if (urlQuery && urlQuery !== searchQuery) {
  setSearchQuery(urlQuery);
  }
  }, [urlQuery]);

  // Synchronize browser URL bar with active search query
  const handleSearchChange = (val: string) => {
  setSearchQuery(val);
  if (typeof window !== 'undefined') {
  const url = new URL(window.location.href);
  if (val.trim()) {
  url.searchParams.set('q', val.trim());
  } else {
  url.searchParams.delete('q');
  url.searchParams.delete('search');
  }
  window.history.replaceState({}, '', url.pathname + (url.searchParams.toString() ? '?' + url.searchParams.toString() : ''));
  }
  };

  const handleClearSearch = () => {
  handleSearchChange('');
  };

  // Expand search to PostgreSQL database via api.searchPosts for comprehensive matching
  useEffect(() => {
  const term = searchQuery.trim();
  if (term.length < 2) return;

  const timer = setTimeout(async () => {
  try {
  const res = await api.searchPosts(term);
  if (res.ok && res.data && res.data.length > 0) {
  setPosts((prev) => {
  const existingIds = new Set(prev.map((p) => p.id));
  const newPosts = res.data
  .filter((item: any) => !existingIds.has(item.id))
  .map((item: any) => ({
  ...item,
  categoryId: item.categoryId || item.category_id || item.category?.id,
  postSeverityId: item.postSeverityId || item.post_severity_id,
  postStatusId: item.postStatusId || item.post_status_id,
  categoryName: getCategoryName(item.category || item.categoryName),
  }));
  if (newPosts.length === 0) return prev;
  return [...newPosts, ...prev];
  });
  }
  } catch {
  // silent server search fallback
  }
  }, 350);

  return () => clearTimeout(timer);
  }, [searchQuery]);

  // More Filters Popover State
  const [isMoreFiltersOpen, setIsMoreFiltersOpen] = useState<boolean>(false);
  const moreFiltersRef = useRef<HTMLDivElement>(null);

  // Close more filters on click outside
  useEffect(() => {
  function handleClickOutside(event: MouseEvent) {
  if (moreFiltersRef.current && !moreFiltersRef.current.contains(event.target as Node)) {
  setIsMoreFiltersOpen(false);
  }
  }
  if (isMoreFiltersOpen) {
  document.addEventListener('mousedown', handleClickOutside);
  }
  return () => {
  document.removeEventListener('mousedown', handleClickOutside);
  };
  }, [isMoreFiltersOpen]);

  // Fetch feed and lookup data directly from live DB tables
  const loadFeedData = async (isManualRefresh = false) => {
  if (isManualRefresh) setRefreshing(true);
  else setLoading(true);
  setError(null);

  try {
  const [feedRes, catRes, sevRes, statusRes] = await Promise.all([
  api.getFeed({ limit: 50 }),
  api.getCategories(),
  api.getPostSeverities(),
  api.getPostStatuses(),
  ]);

  // Populate Categories from DB categories table
  if (catRes.ok && catRes.data && Array.isArray(catRes.data)) {
  setCategories(catRes.data);
  }

  // Populate Severities from DB post_severities table
  if (sevRes.ok && sevRes.data && Array.isArray(sevRes.data)) {
  setSeverities(sevRes.data);
  }

  // Populate Statuses from DB post_statuses table
  if (statusRes.ok && statusRes.data && Array.isArray(statusRes.data)) {
  setStatuses(statusRes.data);
  }

  // Handle Feed Response
  if (!feedRes.ok) {
  const errorMsg =
  feedRes.error || 'Failed to fetch community safety reports from database.';
  setError(errorMsg);
  setPosts([]);
  return;
  }

  if (feedRes.data && Array.isArray(feedRes.data)) {
  const dbPosts: PostItem[] = feedRes.data.map((item: any) => ({
  ...item,
  categoryId: item.categoryId || item.category_id || item.category?.id,
  postSeverityId: item.postSeverityId || item.post_severity_id,
  postStatusId: item.postStatusId || item.post_status_id,
  categoryName: getCategoryName(item.category || item.categoryName),
  }));
  setPosts(dbPosts);
  } else {
  setPosts([]);
  }
  } catch (err: any) {
  console.warn('Error loading public feed:', err);
  setError(
  err?.message ||
  'Unable to connect to the backend server. Please verify the backend API is running.'
  );
  setPosts([]);
  } finally {
  setLoading(false);
  setRefreshing(false);
  }
  };

  useEffect(() => {
  loadFeedData();
  }, []);

  // Compute live category post counts
  const categoryCounts = useMemo(() => {
  const counts: Record<string | number, number> = {};
  posts.forEach((post) => {
  if (post.categoryId) counts[post.categoryId] = (counts[post.categoryId] || 0) + 1;
  const name = getCategoryName(post.category || post.categoryName);
  if (name) counts[name] = (counts[name] || 0) + 1;
  });
  return counts;
  }, [posts]);

  // Compute live severity counts based on postSeverityId
  const severityCounts = useMemo(() => {
  const counts: Record<number, number> = {};
  posts.forEach((p) => {
  let id = p.postSeverityId;
  if (!id && p.severity) {
  const s = p.severity.toUpperCase();
  if (s.includes('CRITICAL') || s.includes('IMMEDIATE')) id = 4;
  else if (s.includes('SERIOUS')) id = 3;
  else if (s.includes('CONCERN')) id = 2;
  else id = 1;
  }
  if (id) counts[id] = (counts[id] || 0) + 1;
  });
  return counts;
  }, [posts]);

  // Compute live status counts based on postStatusId
  const statusCounts = useMemo(() => {
  const counts: Record<number, number> = {};
  posts.forEach((p) => {
  let id = p.postStatusId;
  if (!id && p.status) {
  const s = p.status.toUpperCase();
  if (s.includes('RESOLV')) id = 2;
  else if (s.includes('HELP')) id = 3;
  else id = 1;
  }
  if (id) counts[id] = (counts[id] || 0) + 1;
  });
  return counts;
  }, [posts]);

  // Helper toggle for generic list
  const toggleItemInList = (list: string[], item: string): string[] => {
  return list.includes(item) ? list.filter((i) => i !== item) : [...list, item];
  };

  const toggleAuthorType = (type: string) => {
  setSelectedAuthorTypes((prev) => toggleItemInList(prev, type));
  };

  const toggleCategoryById = (catId: number | string) => {
  setSelectedCategoryIds((prev) =>
  prev.includes(catId) ? prev.filter((id) => id !== catId) : [...prev, catId]
  );
  };

  // Convert DB categories table rows into MultiSelect options
  const categoryDropdownOptions = useMemo(() => {
  return categories.map((cat) => ({
  id: cat.id,
  label: cat.name,
  sublabel: cat.description,
  count: categoryCounts[cat.id] || categoryCounts[cat.name] || 0,
  }));
  }, [categories, categoryCounts]);

  // Convert DB post_severities table rows into MultiSelect options
  const severityDropdownOptions = useMemo(() => {
  const colorMap: Record<number, string> = {
  1: 'bg-emerald-500',
  2: 'bg-amber-500',
  3: 'bg-orange-500',
  4: 'bg-rose-500',
  };
  return severities.map((sev) => ({
  id: sev.id,
  label: sev.name,
  dotColor: colorMap[sev.id] || 'bg-slate-400',
  count: severityCounts[sev.id] || 0,
  }));
  }, [severities, severityCounts]);

  // Convert DB post_statuses table rows into MultiSelect options
  const statusDropdownOptions = useMemo(() => {
  const dotMap: Record<number, string> = {
  1: 'bg-cyan-500',
  2: 'bg-emerald-500',
  3: 'bg-amber-500',
  };
  return statuses.map((st) => ({
  id: st.id,
  label: st.name,
  dotColor: dotMap[st.id] || 'bg-slate-400',
  count: statusCounts[st.id] || 0,
  }));
  }, [statuses, statusCounts]);

  // Active filter count
  const activeFilterCount = useMemo(() => {
  let count = 0;
  count += selectedCategoryIds.length;
  count += selectedSeverityIds.length;
  count += selectedStatusIds.length;
  count += selectedAuthorTypes.length;
  if (selectedTimeframe !== 'ALL') count++;
  if (locationQuery.trim().length > 0) count++;
  if (hasLocationOnly) count++;
  if (sortBy !== 'NEWEST_INCIDENT') count++;
  return count;
  }, [
  selectedCategoryIds,
  selectedSeverityIds,
  selectedStatusIds,
  selectedAuthorTypes,
  selectedTimeframe,
  locationQuery,
  hasLocationOnly,
  sortBy,
  ]);

  // Reset all filters back to defaults
  const resetAllFilters = () => {
  setSelectedCategoryIds([]);
  setSelectedSeverityIds([]);
  setSelectedStatusIds([]);
  setSelectedAuthorTypes([]);
  setSelectedTimeframe('ALL');
  setLocationQuery('');
  setHasLocationOnly(false);
  setSortBy('NEWEST_INCIDENT');
  handleClearSearch();
  };

  // Filter & sort posts with multiple criteria matching
  const filteredPosts = useMemo(() => {
  const list = posts.filter((post) => {
  // 1. Multiple Category filter (from DB categories table)
  if (selectedCategoryIds.length > 0) {
  const postCatName = getCategoryName(post.category || post.categoryName).toLowerCase();
  const matchesCategory = selectedCategoryIds.some((selectedId) => {
  if (post.categoryId && post.categoryId === selectedId) return true;
  // Match by name if ID corresponds to category object
  const catObj = categories.find((c) => c.id === selectedId);
  if (catObj && catObj.name.toLowerCase() === postCatName) return true;
  if (typeof selectedId === 'string' && postCatName.includes(selectedId.toLowerCase()))
  return true;
  return false;
  });
  if (!matchesCategory) return false;
  }

  // 2. Multiple Severity filter (from DB post_severities table)
  if (selectedSeverityIds.length > 0) {
  let postSevId = post.postSeverityId;
  if (!postSevId && post.severity) {
  const s = post.severity.toUpperCase();
  if (s.includes('CRITICAL') || s.includes('IMMEDIATE')) postSevId = 4;
  else if (s.includes('SERIOUS')) postSevId = 3;
  else if (s.includes('CONCERN')) postSevId = 2;
  else postSevId = 1;
  }
  const matchesSeverity = selectedSeverityIds.some((selectedId) => selectedId === postSevId);
  if (!matchesSeverity) return false;
  }

  // 3. Multiple Status filter (from DB post_statuses table)
  if (selectedStatusIds.length > 0) {
  let postStatId = post.postStatusId;
  if (!postStatId && post.status) {
  const s = post.status.toUpperCase();
  if (s.includes('RESOLV')) postStatId = 2;
  else if (s.includes('HELP')) postStatId = 3;
  else postStatId = 1;
  }
  const matchesStatus = selectedStatusIds.some((selectedId) => selectedId === postStatId);
  if (!matchesStatus) return false;
  }

  // 4. Timeframe filter (based on incidentDateTime, fallback to createdAt)
  if (selectedTimeframe !== 'ALL') {
  const targetDate = post.incidentDateTime || post.createdAt;
  if (targetDate) {
  const postTime = new Date(targetDate).getTime();
  const now = Date.now();
  const diffMs = now - postTime;
  if (selectedTimeframe === '24H' && diffMs > 24 * 60 * 60 * 1000) return false;
  if (selectedTimeframe === '7D' && diffMs > 7 * 24 * 60 * 60 * 1000) return false;
  if (selectedTimeframe === '30D' && diffMs > 30 * 24 * 60 * 60 * 1000) return false;
  }
  }

  // 5. Location Search & Filter
  if (locationQuery.trim()) {
  const locLower = (post.location || '').toLowerCase();
  const qLower = locationQuery.toLowerCase().trim();
  if (!locLower.includes(qLower)) return false;
  }
  if (hasLocationOnly) {
  if (!post.location || post.location.trim().length === 0) return false;
  }

  // 6. Multiple Author Privacy filter
  if (selectedAuthorTypes.length > 0) {
  const isAnon = post.isAnonymous;
  const matchesAuth = selectedAuthorTypes.some((type) => {
  if (type === 'ANONYMOUS') return isAnon === true;
  if (type === 'IDENTIFIED') return isAnon === false;
  return false;
  });
  if (!matchesAuth) return false;
  }

  // 7. Search text query
  if (searchQuery.trim()) {
  const query = searchQuery.toLowerCase().trim();
  const contentMatch = (post.content || '').toLowerCase().includes(query);
  const authorMatch = (post.authorName || '').toLowerCase().includes(query);
  const catMatch = getCategoryName(post.category || post.categoryName)
  .toLowerCase()
  .includes(query);
  const locMatch = (post.location || '').toLowerCase().includes(query);
  const tagMatch = (post.hashtags || []).some((tag) => tag.toLowerCase().includes(query));

  if (!contentMatch && !authorMatch && !catMatch && !locMatch && !tagMatch) {
  return false;
  }
  }

  return true;
  });

  // 8. Sorting
  list.sort((a, b) => {
  if (sortBy === 'NEWEST_INCIDENT') {
  const dateA = new Date(a.incidentDateTime || a.createdAt || 0).getTime();
  const dateB = new Date(b.incidentDateTime || b.createdAt || 0).getTime();
  return dateB - dateA;
  }
  if (sortBy === 'NEWEST_REPORT') {
  const dateA = new Date(a.createdAt || 0).getTime();
  const dateB = new Date(b.createdAt || 0).getTime();
  return dateB - dateA;
  }
  if (sortBy === 'MOST_URGENT') {
  const rank = (p: PostItem) => {
  if (p.postSeverityId) return p.postSeverityId;
  const s = (p.severity || '').toUpperCase();
  if (s.includes('CRITICAL') || s.includes('IMMEDIATE')) return 4;
  if (s.includes('SERIOUS')) return 3;
  if (s.includes('CONCERN')) return 2;
  return 1;
  };
  return rank(b) - rank(a);
  }
  if (sortBy === 'MOST_SUPPORTED') {
  return (b.supportCount || 0) - (a.supportCount || 0);
  }
  return 0;
  });

  return list;
  }, [
  posts,
  categories,
  selectedCategoryIds,
  selectedSeverityIds,
  selectedStatusIds,
  selectedAuthorTypes,
  selectedTimeframe,
  locationQuery,
  hasLocationOnly,
  searchQuery,
  sortBy,
  ]);

  return (
  <div className="space-y-6 max-w-5xl mx-auto pb-16">
  {/* ============================================================ */}
  {/* 1. HERO HEADER: Public Safety Feed Banner */}
  {/* ============================================================ */}
  <section className="bg-white rounded-[24px] border border-[#e8e8f0] p-5 sm:p-7 shadow-sm space-y-5">
  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
  <div className="space-y-2">
   
  <h1 className="text-2xl sm:text-3xl font-black text-[#16161d] tracking-tight">
  Hyperlocal Safety Reports &amp; Verified Solutions
  </h1>
  <p className="text-xs sm:text-[13.5px] text-[#5b5b6e] max-w-2xl leading-relaxed">
  Explore real-time community alerts, transit warnings, and peer-verified safety alternatives submitted by women across communities in India.
  </p>
  </div>

  {/* Quick Action Buttons */}
  <div className="flex flex-wrap items-center gap-2 sm:self-start md:self-auto shrink-0">
  <a
  href="tel:112"
  className="px-3.5 py-2 rounded-[12px] bg-[#fef2f2] hover:bg-[#fee2e2] text-[#e11d48] text-xs font-bold transition flex items-center gap-1.5 shadow-2xs"
  >
  <Phone className="h-3.5 w-3.5" />
  <span>112 Police</span>
  </a>

  <a
  href="tel:1091"
  className="px-3.5 py-2 rounded-[12px] bg-[#f1edff] hover:bg-[#e6deff] text-[#6d4aff] text-xs font-bold transition flex items-center gap-1.5 shadow-2xs"
  >
  <ShieldAlert className="h-3.5 w-3.5" />
  <span>1091 Women Line</span>
  </a>

  {isAuthenticated ? (
  <Link
  href="/report"
  className="px-4 py-2 rounded-[12px] bg-[#6d4aff] hover:bg-[#5325e8] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm shadow-[#6d4aff]/30"
  >
  <Plus className="h-4 w-4" />
  <span>Post Alert</span>
  </Link>
  ) : (
  <Link
  href="/login?redirect=/report"
  className="px-4 py-2 rounded-[12px] bg-[#6d4aff] hover:bg-[#5325e8] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm shadow-[#6d4aff]/30"
  >
  <Plus className="h-4 w-4" />
  <span>Report Incident</span>
  </Link>
  )}
  </div>
  </div>

  </section>

  {/* Guest Sign-in Prompt Banner */}
  {!isAuthenticated && (
  <section className="bg-[#f4f0ff] rounded-[20px] border border-[#e8e8f0] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
  <div className="flex items-center gap-3">
  <div className="w-10 h-10 rounded-[12px] bg-[#6d4aff] text-white flex items-center justify-center shrink-0">
  <Shield className="h-5 w-5" />
  </div>
  <div className="space-y-0.5">
  <h3 className="text-xs sm:text-sm font-bold text-[#16161d]">
  Viewing Public Community Mesh
  </h3>
  <p className="text-[11px] sm:text-xs text-[#5b5b6e]">
  Create a free account to verify reports, post safety alerts, and connect trusted guardians.
  </p>
  </div>
  </div>
  <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
  <Link
  href="/login"
  className="px-3.5 py-1.5 rounded-[10px] bg-white border border-[#e8e8f0] text-xs font-bold text-[#16161d] hover:bg-[#f1f1f6] transition"
  >
  Sign In
  </Link>
  <Link
  href="/signup"
  className="px-3.5 py-1.5 rounded-[10px] bg-[#6d4aff] hover:bg-[#5325e8] text-white text-xs font-bold transition shadow-xs shadow-[#6d4aff]/20"
  >
  Join Free
  </Link>
  </div>
  </section>
  )}

  {/* ============================================================ */}
  {/* 2. MULTI-SELECTION DROPDOWNS & FILTER TOOLBAR */}
  {/* ============================================================ */}
  <section className="space-y-3.5">
  {/* Main Search Bar & Quick Controls */}
  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
  {/* Search Input */}
  <div className="relative flex-1">
  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#86869e]" />
  <input
  type="text"
  value={searchQuery}
  onChange={(e) => handleSearchChange(e.target.value)}
  placeholder="Search reports by incident description, location, category, or author..."
  className="w-full pl-10 pr-9 py-2.5 rounded-[14px] bg-white border border-[#e8e8f0] text-xs sm:text-[13px] text-[#16161d] placeholder-[#86869e] focus:outline-hidden focus:border-[#6d4aff] transition shadow-2xs"
  />
  {searchQuery && (
  <button
  onClick={handleClearSearch}
  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
  title="Clear Search"
  >
  <X className="h-4 w-4" />
  </button>
  )}
  </div>

  {/* Sort Dropdown */}
  <div className="relative shrink-0">
  <select
  value={sortBy}
  onChange={(e) => setSortBy(e.target.value)}
  className="w-full sm:w-auto appearance-none pl-8 pr-8 py-2.5 rounded-[14px] bg-white border border-[#e8e8f0] text-xs font-bold text-[#16161d] focus:outline-hidden focus:border-[#6d4aff] transition cursor-pointer shadow-2xs"
  >
  <option value="NEWEST_INCIDENT">Newest Incident First</option>
  <option value="NEWEST_REPORT">Newest Posted</option>
  <option value="MOST_URGENT">Most Urgent (Critical First)</option>
  <option value="MOST_SUPPORTED">Most Supported</option>
  </select>
  <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#86869e] pointer-events-none" />
  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#86869e] pointer-events-none" />
  </div>

  {/* Refresh Button */}
  <button
  onClick={() => loadFeedData(true)}
  disabled={refreshing}
  title="Refresh Safety Feed"
  className="p-2.5 rounded-[14px] bg-white border border-[#e8e8f0] text-[#5b5b6e] hover:text-[#16161d] transition shrink-0"
  >
  <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin text-[#6d4aff]' : ''}`} />
  </button>
  </div>

  {/* ============================================================ */}
  {/* MULTI-SELECT DROPDOWNS ROW (Driven directly from DB tables) */}
  {/* ============================================================ */}
  <div className="flex flex-wrap items-center gap-2 pt-1">
  {/* 1. Category Dropdown with Multiple Selection (from DB categories table) */}
  <MultiSelectDropdown
  label="Category"
  icon={<Filter className="h-3.5 w-3.5" />}
  options={categoryDropdownOptions}
  selectedValues={selectedCategoryIds}
  onChange={setSelectedCategoryIds}
  searchable={true}
  searchPlaceholder="Search categories..."
  loading={loading && categories.length === 0}
  emptyText="No categories found in database"
  />

  {/* 2. Severity Dropdown with Multiple Selection (from DB post_severities table) */}
  <MultiSelectDropdown
  label="Severity"
  icon={<ShieldAlert className="h-3.5 w-3.5 text-rose-500" />}
  options={severityDropdownOptions}
  selectedValues={selectedSeverityIds}
  onChange={setSelectedSeverityIds}
  loading={loading && severities.length === 0}
  emptyText="No severities found in database"
  />

  {/* 3. Status Dropdown with Multiple Selection (from DB post_statuses table) */}
  <MultiSelectDropdown
  label="Status"
  icon={<CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />}
  options={statusDropdownOptions}
  selectedValues={selectedStatusIds}
  onChange={setSelectedStatusIds}
  loading={loading && statuses.length === 0}
  emptyText="No statuses found in database"
  />

  {/* 4. Incident Timeframe Dropdown */}
  <div className="relative inline-block text-left">
  <select
  value={selectedTimeframe}
  onChange={(e) => setSelectedTimeframe(e.target.value)}
  className={`appearance-none pl-8 pr-8 py-2.5 rounded-[14px] text-xs font-bold transition shadow-2xs cursor-pointer border ${
  selectedTimeframe !== 'ALL'
  ? 'bg-[#6d4aff]/10 border-[#6d4aff] text-[#6d4aff]'
  : 'bg-white border-[#e8e8f0] text-[#16161d]'
  }`}
  >
  <option value="ALL">Timing: All Time</option>
  <option value="24H">Timing: Last 24 Hours</option>
  <option value="7D">Timing: Past 7 Days</option>
  <option value="30D">Timing: Past 30 Days</option>
  </select>
  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#6d4aff] pointer-events-none" />
  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#86869e] pointer-events-none" />
  </div>

  {/* 5. More Filters Dropdown (Location search & Author privacy) */}
  <div ref={moreFiltersRef} className="relative inline-block text-left">
  <button
  type="button"
  onClick={() => setIsMoreFiltersOpen((prev) => !prev)}
  className={`inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-[14px] text-xs font-bold transition shadow-2xs border ${
  locationQuery || hasLocationOnly || selectedAuthorTypes.length > 0 || isMoreFiltersOpen
  ? 'bg-[#6d4aff]/10 border-[#6d4aff] text-[#6d4aff]'
  : 'bg-white border-[#e8e8f0] text-[#16161d] hover:bg-[#f7f7fa]'
  }`}
  >
  <SlidersHorizontal className="h-3.5 w-3.5 text-[#6d4aff]" />
  <span>More Filters</span>
  {(locationQuery || hasLocationOnly || selectedAuthorTypes.length > 0) && (
  <span className="w-4 h-4 rounded-full bg-[#6d4aff] text-white text-[10px] font-black flex items-center justify-center">
  {(locationQuery ? 1 : 0) + (hasLocationOnly ? 1 : 0) + selectedAuthorTypes.length}
  </span>
  )}
  <ChevronDown
  className={`h-3.5 w-3.5 text-[#86869e] transition-transform ${
  isMoreFiltersOpen ? 'rotate-180' : ''
  }`}
  />
  </button>

  {isMoreFiltersOpen && (
  <div className="absolute right-0 sm:left-0 mt-2 w-72 sm:w-80 rounded-[18px] bg-white border border-[#e8e8f0] shadow-xl z-50 p-4 space-y-4 animate-in fade-in zoom-in-95 duration-150">
  <div className="flex items-center justify-between pb-2 border-b border-[#e8e8f0]">
  <h4 className="text-xs font-black text-[#16161d]">
  Location &amp; Author Filters
  </h4>
  <button
  type="button"
  onClick={() => {
  setLocationQuery('');
  setHasLocationOnly(false);
  setSelectedAuthorTypes([]);
  }}
  className="text-[11px] font-bold text-rose-500 hover:underline"
  >
  Reset
  </button>
  </div>

  {/* Location Search */}
  <div className="space-y-1.5">
  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
  <MapPin className="h-3.5 w-3.5 text-rose-500" />
  <span>Location Search</span>
  </label>
  <div className="relative">
  <input
  type="text"
  value={locationQuery}
  onChange={(e) => setLocationQuery(e.target.value)}
  placeholder="e.g. Madhapur, Transit, Campus..."
  className="w-full pl-3 pr-7 py-1.5 rounded-[10px] bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-[#6d4aff]"
  />
  {locationQuery && (
  <button
  onClick={() => setLocationQuery('')}
  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
  >
  <X className="h-3 w-3" />
  </button>
  )}
  </div>
  <label className="flex items-center gap-2 cursor-pointer pt-1">
  <input
  type="checkbox"
  checked={hasLocationOnly}
  onChange={(e) => setHasLocationOnly(e.target.checked)}
  className="rounded border-slate-300 text-[#6d4aff] focus:ring-[#6d4aff]"
  />
  <span className="text-[11px] text-slate-600 select-none">
  Only reports with location tagged
  </span>
  </label>
  </div>

  {/* Author Privacy Multi-Select */}
  <div className="space-y-2 pt-1 border-t border-[#e8e8f0]">
  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
  <EyeOff className="h-3.5 w-3.5 text-purple-500" />
  <span>Author Privacy (Multiple)</span>
  </label>
  <div className="space-y-1.5">
  {[
  { id: 'ANONYMOUS', label: 'Anonymous Reporters', icon: EyeOff },
  { id: 'IDENTIFIED', label: 'Verified Community Members', icon: Users },
  ].map((auth) => {
  const isSelected = selectedAuthorTypes.includes(auth.id);
  return (
  <button
  key={auth.id}
  type="button"
  onClick={() => toggleAuthorType(auth.id)}
  className={`w-full px-2.5 py-1.5 rounded-[10px] text-xs font-medium transition flex items-center gap-2 border text-left cursor-pointer ${
  isSelected
  ? 'bg-[#6d4aff]/10 border-[#6d4aff] text-[#6d4aff] font-bold'
  : 'bg-transparent border-transparent hover:bg-slate-50 text-slate-700'
  }`}
  >
  {isSelected ? (
  <CheckSquare className="h-4 w-4 text-[#6d4aff] shrink-0" />
  ) : (
  <Square className="h-4 w-4 text-slate-400 shrink-0" />
  )}
  <span className="truncate">{auth.label}</span>
  </button>
  );
  })}
  </div>
  </div>

  <div className="pt-2 border-t border-[#e8e8f0] flex justify-end">
  <button
  type="button"
  onClick={() => setIsMoreFiltersOpen(false)}
  className="px-3 py-1 rounded-[10px] bg-[#6d4aff] text-white text-xs font-bold hover:bg-[#5325e8]"
  >
  Done
  </button>
  </div>
  </div>
  )}
  </div>

  {/* Quick Clear All Button if any filter active */}
  {activeFilterCount > 0 && (
  <button
  onClick={resetAllFilters}
  className="text-xs font-bold text-rose-600 hover:text-rose-700 px-2 py-1 transition"
  >
  Reset All ({activeFilterCount})
  </button>
  )}
  </div>

  {/* ============================================================ */}
  {/* ACTIVE FILTER CHIPS ROW (Quick Removals) */}
  {/* ============================================================ */}
  {(activeFilterCount > 0 || searchQuery.trim().length > 0) && (
  <div className="flex flex-wrap items-center gap-1.5 p-3 rounded-[16px] bg-slate-50 border border-slate-200">
  <span className="text-xs font-bold text-slate-500 mr-1 flex items-center gap-1">
  <Filter className="h-3 w-3" /> Active ({activeFilterCount}):
  </span>

  {/* Search Query Chip */}
  {searchQuery.trim().length > 0 && (
  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-white border border-slate-200 text-slate-800">
  <span>Keyword: &quot;{searchQuery}&quot;</span>
  <button onClick={() => setSearchQuery('')} className="hover:text-rose-500">
  <X className="h-3 w-3" />
  </button>
  </span>
  )}

  {/* Selected Categories Chips (Multiple) */}
  {selectedCategoryIds.map((catId) => {
  const catObj = categories.find((c) => c.id === catId);
  const label = catObj?.name || `Category #${catId}`;
  return (
  <span
  key={catId}
  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-[#f1edff] text-[#6d4aff] border border-[#6d4aff]/30"
  >
  <span>Category: {label}</span>
  <button
  onClick={() => toggleCategoryById(catId)}
  className="hover:text-rose-500"
  >
  <X className="h-3 w-3" />
  </button>
  </span>
  );
  })}

  {/* Selected Severities Chips (Multiple) */}
  {selectedSeverityIds.map((sevId) => {
  const sevObj = severities.find((s) => s.id === sevId);
  const label = sevObj?.name || `Severity #${sevId}`;
  return (
  <span
  key={sevId}
  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200"
  >
  <span>Severity: {label}</span>
  <button
  onClick={() =>
  setSelectedSeverityIds((prev) => prev.filter((id) => id !== sevId))
  }
  className="hover:text-rose-900"
  >
  <X className="h-3 w-3" />
  </button>
  </span>
  );
  })}

  {/* Selected Statuses Chips (Multiple) */}
  {selectedStatusIds.map((stId) => {
  const stObj = statuses.find((s) => s.id === stId);
  const label = stObj?.name || `Status #${stId}`;
  return (
  <span
  key={stId}
  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200"
  >
  <span>Status: {label}</span>
  <button
  onClick={() =>
  setSelectedStatusIds((prev) => prev.filter((id) => id !== stId))
  }
  className="hover:text-emerald-900"
  >
  <X className="h-3 w-3" />
  </button>
  </span>
  );
  })}

  {/* Timeframe Chip */}
  {selectedTimeframe !== 'ALL' && (
  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">
  <span>Time: {selectedTimeframe}</span>
  <button
  onClick={() => setSelectedTimeframe('ALL')}
  className="hover:text-indigo-900"
  >
  <X className="h-3 w-3" />
  </button>
  </span>
  )}

  {/* Location Query Chip */}
  {locationQuery.trim().length > 0 && (
  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-200 text-slate-800">
  <MapPin className="h-3 w-3 text-rose-500" />
  <span>Loc: &quot;{locationQuery}&quot;</span>
  <button onClick={() => setLocationQuery('')} className="hover:text-rose-500">
  <X className="h-3 w-3" />
  </button>
  </span>
  )}

  {/* Has Location Only Chip */}
  {hasLocationOnly && (
  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-200 text-slate-800">
  <span>With Location Tag</span>
  <button onClick={() => setHasLocationOnly(false)} className="hover:text-rose-500">
  <X className="h-3 w-3" />
  </button>
  </span>
  )}

  {/* Selected Author Types (Multiple) */}
  {selectedAuthorTypes.map((auth) => (
  <span
  key={auth}
  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200"
  >
  <span>Author: {auth}</span>
  <button onClick={() => toggleAuthorType(auth)} className="hover:text-purple-900">
  <X className="h-3 w-3" />
  </button>
  </span>
  ))}

  {/* Sort Chip */}
  {sortBy !== 'NEWEST_INCIDENT' && (
  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-200 text-slate-800">
  <span>Sort: {sortBy.replace('_', ' ')}</span>
  <button onClick={() => setSortBy('NEWEST_INCIDENT')} className="hover:text-rose-500">
  <X className="h-3 w-3" />
  </button>
  </span>
  )}

  {/* Clear All Trigger */}
  <button
  onClick={resetAllFilters}
  className="text-xs font-bold text-rose-600 hover:text-rose-700 ml-auto transition px-2 py-1"
  >
  Clear All
  </button>
  </div>
  )}
  </section>

  {/* ============================================================ */}
  {/* 3. POSTS FEED LIST */}
  {/* ============================================================ */}
  <section className="space-y-3.5">
  {/* Results Count Header */}
  <div className="flex items-center justify-between text-xs text-slate-500 px-1">
  <span>
  Showing <strong>{filteredPosts.length}</strong> of <strong>{posts.length}</strong> reports
  {activeFilterCount > 0 ? ` (${activeFilterCount} filter criteria applied)` : ''}
  </span>
  {activeFilterCount > 0 && (
  <button onClick={resetAllFilters} className="text-[#6d4aff] hover:underline font-semibold">
  Reset Filters
  </button>
  )}
  </div>

  {error ? (
  /* Backend Connection Error Banner */
  <div className="p-8 sm:p-10 text-center bg-red-50 rounded-[24px] border border-red-200 space-y-4">
  <div className="w-14 h-14 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto shadow-xs">
  <AlertTriangle className="h-7 w-7" />
  </div>
  <div className="space-y-1.5 max-w-md mx-auto">
  <h3 className="text-base sm:text-lg font-bold text-red-950">
  Backend Connection Error
  </h3>
  <p className="text-xs sm:text-[13px] text-red-700 leading-relaxed">
  {error}
  </p>
  <p className="text-[11px] text-red-500">
  Sabhijude only serves verified data from the database. Please verify that the safety API service is running.
  </p>
  </div>
  <button
  onClick={() => loadFeedData(true)}
  disabled={refreshing}
  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[12px] bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition shadow-sm"
  >
  <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
  <span>Retry Connection</span>
  </button>
  </div>
  ) : loading ? (
  /* Loading Skeleton Slices */
  <div className="space-y-3">
  {[1, 2, 3, 4].map((n) => (
  <PostCardSkeleton key={n} />
  ))}
  </div>
  ) : filteredPosts.length > 0 ? (
  /* Rendered Public Posts */
  <div className="space-y-3">
  {filteredPosts.map((post) => (
  <PostCard key={post.id} post={post} />
  ))}
  </div>
  ) : (
  /* Empty Search / Filter State */
  <div className="p-10 text-center bg-white rounded-[24px] border border-[#e8e8f0] space-y-3">
  <div className="w-12 h-12 rounded-full bg-[#f1edff] text-[#6d4aff] flex items-center justify-center mx-auto">
  <Search className="h-6 w-6" />
  </div>
  <h3 className="text-base font-bold text-[#16161d]">
  No incident reports found
  </h3>
  <p className="text-xs text-[#5b5b6e] max-w-sm mx-auto">
  No public reports matched your current filters
  {searchQuery ? ` ("${searchQuery}")` : ''}.
  Try clearing some filter criteria or searching with broader keywords.
  </p>
  <button
  onClick={resetAllFilters}
  className="px-4 py-2 rounded-[12px] bg-[#6d4aff] text-white text-xs font-bold hover:bg-[#5325e8] transition shadow-xs"
  >
  Reset All Filters
  </button>
  </div>
  )}
  </section>
  </div>
  );
}

export default function PublicFeedPage() {
  return (
  <Suspense
  fallback={
  <div className="max-w-4xl mx-auto py-4 space-y-3">
  {[1, 2, 3].map((n) => (
  <PostCardSkeleton key={n} />
  ))}
  </div>
  }
  >
  <FeedPageContent />
  </Suspense>
  );
}
