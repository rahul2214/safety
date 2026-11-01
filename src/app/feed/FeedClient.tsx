'use client';

import React, { useState, useEffect, useMemo, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
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
} from 'lucide-react';
import {
  api,
  type Category,
  type PostSeverityOption,
  type PostStatusOption,
} from '@/lib/api-client';
import { PostCard, type PostItem, getCategoryName } from '@/components/PostCard';
import { PostCardSkeleton } from '@/components/ui/Skeleton';
import { useAuth } from '@/lib/auth-context';

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

  // Single Filter Modal State
  const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false);
  const [categorySearch, setCategorySearch] = useState<string>('');
  const filterModalRef = useRef<HTMLDivElement>(null);

  // Lock body scroll & close on Escape key when filter modal is open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFilterModalOpen) {
        setIsFilterModalOpen(false);
      }
    };
    if (isFilterModalOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFilterModalOpen]);

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
        const dbPosts: PostItem[] = feedRes.data.map((item: any, idx: number) => ({
          ...item,
          uuid: item.uuid || item.Uuid || '',
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

  const toggleSeverityById = (sevId: number | string) => {
    setSelectedSeverityIds((prev) =>
      prev.includes(sevId) ? prev.filter((id) => id !== sevId) : [...prev, sevId]
    );
  };

  const toggleStatusById = (stId: number | string) => {
    setSelectedStatusIds((prev) =>
      prev.includes(stId) ? prev.filter((id) => id !== stId) : [...prev, stId]
    );
  };

  // Filter categories by categorySearch inside the filter modal
  const filteredCategories = useMemo(() => {
    if (!categorySearch.trim()) return categories;
    const q = categorySearch.toLowerCase().trim();
    return categories.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.description && c.description.toLowerCase().includes(q))
    );
  }, [categories, categorySearch]);

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

        if (!contentMatch && !authorMatch && !catMatch && !locMatch) {
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

      {/* Guest Sign-in Prompt Banner */}
      {!isAuthenticated && (
        <section className="bg-brand-tint rounded-[20px] border border-slate-200 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[12px] bg-brand text-white flex items-center justify-center shrink-0">
              <Shield className="h-5 w-5" />
            </div>
            <div className="space-y-0.5">
              <h3 className="text-xs sm:text-sm font-bold text-ink">
                Viewing Public Community Mesh
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-600">
                Create a free account to verify reports, post safety alerts, and connect trusted guardians.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            <Link
              href="/login"
              className="px-3.5 py-1.5 rounded-[10px] bg-white border border-slate-200 text-xs font-bold text-ink hover:bg-slate-100 transition"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="px-3.5 py-1.5 rounded-[10px] bg-brand hover:bg-brand-deep text-white text-xs font-bold transition shadow-xs shadow-brand/20"
            >
              Join Free
            </Link>
          </div>
        </section>
      )}

      {/* ============================================================ */}
      {/* 2. SEARCH & SINGLE UNIFIED FILTER TOOLBAR */}
      {/* ============================================================ */}
      <section className="space-y-3.5">
        {/* Main Search Bar with Search Button & Filter Icon Button Beside It */}
        <div className="flex items-center gap-2">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  (e.target as HTMLInputElement).blur();
                }
              }}
              placeholder="Search reports by incident description, location, category, or author..."
              className="w-full pl-10 pr-9 py-2.5 rounded-[14px] bg-white border border-slate-200 text-xs sm:text-[13px] text-ink placeholder-slate-400 focus:outline-hidden focus:border-brand transition shadow-2xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition p-0.5"
                title="Clear Search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          

          {/* Single Filter Icon Button Beside Search Button */}
          <button
            type="button"
            onClick={() => setIsFilterModalOpen(true)}
            className={`h-10 inline-flex items-center gap-2 px-3.5 sm:px-4 rounded-[14px] text-xs sm:text-[13px] font-bold transition shadow-2xs shrink-0 cursor-pointer border ${
              activeFilterCount > 0
                ? 'bg-brand/10 border-brand text-brand hover:bg-brand/15'
                : 'bg-white border-slate-200 text-ink hover:bg-slate-50'
            }`}
            title="Filter Options"
            aria-label="Filter Options"
          >
            <Filter className={`h-4 w-4 ${activeFilterCount > 0 ? 'text-brand' : 'text-slate-600'}`} />
            <span className="hidden sm:inline">Filter</span>
            {activeFilterCount > 0 && (
              <span className="min-w-5 h-5 px-1.5 rounded-full bg-brand text-white text-[10px] font-black flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
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
                <button type="button" onClick={() => handleSearchChange('')} className="hover:text-rose-500">
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
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-brand-tint text-brand border border-brand/30"
                >
                  <span>Category: {label}</span>
                  <button
                    type="button"
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
                    type="button"
                    onClick={() => toggleSeverityById(sevId)}
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
                    type="button"
                    onClick={() => toggleStatusById(stId)}
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
                  type="button"
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
                <button type="button" onClick={() => setLocationQuery('')} className="hover:text-rose-500">
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            {/* Has Location Only Chip */}
            {hasLocationOnly && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-200 text-slate-800">
                <span>With Location Tag</span>
                <button type="button" onClick={() => setHasLocationOnly(false)} className="hover:text-rose-500">
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
                <span>Author: {auth === 'ANONYMOUS' ? 'Anonymous' : 'Verified'}</span>
                <button type="button" onClick={() => toggleAuthorType(auth)} className="hover:text-purple-900">
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}

            {/* Sort Chip */}
            {sortBy !== 'NEWEST_INCIDENT' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-200 text-slate-800">
                <span>Sort: {sortBy.replace('_', ' ')}</span>
                <button type="button" onClick={() => setSortBy('NEWEST_INCIDENT')} className="hover:text-rose-500">
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            {/* Clear All Trigger */}
            <button
              type="button"
              onClick={resetAllFilters}
              className="text-xs font-bold text-rose-600 hover:text-rose-700 ml-auto transition px-2 py-1"
            >
              Clear All
            </button>
          </div>
        )}

        {/* ============================================================ */}
        {/* 3. ALL-IN-ONE FILTER MODAL (All Options in Single Filter) */}
        {/* ============================================================ */}
        {isFilterModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsFilterModalOpen(false);
            }}
          >
            <div
              ref={filterModalRef}
              className="relative w-full max-w-2xl bg-white rounded-[24px] shadow-2xl border border-slate-200 flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200"
              role="dialog"
              aria-modal="true"
              aria-labelledby="filter-modal-title"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-200 bg-slate-50/70">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-brand/10 text-brand flex items-center justify-center">
                    <Filter className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 id="filter-modal-title" className="text-sm sm:text-base font-bold text-ink">
                      Filter &amp; Sort Reports
                    </h3>
                    <p className="text-[11px] sm:text-xs text-slate-500">
                      Refine feed by category, severity, status, location, and timeframe
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsFilterModalOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-ink hover:bg-slate-200/60 transition"
                  aria-label="Close filters"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Modal Body - Scrollable */}
              <div className="overflow-y-auto px-5 sm:px-6 py-5 space-y-6 divide-y divide-slate-100">
                {/* 1. Sort Order */}
                <div className="space-y-2.5">
                  <div className="flex items-center gap-1.5">
                    <ArrowUpDown className="h-4 w-4 text-brand" />
                    <span className="text-xs sm:text-sm font-bold text-ink">Sort Order</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'NEWEST_INCIDENT', label: 'Newest Incident' },
                      { id: 'NEWEST_REPORT', label: 'Newest Posted' },
                      { id: 'MOST_URGENT', label: 'Most Urgent' },
                      { id: 'MOST_SUPPORTED', label: 'Most Supported' },
                    ].map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setSortBy(s.id)}
                        className={`px-3 py-2 rounded-xl text-xs font-semibold transition text-center border cursor-pointer ${
                          sortBy === s.id
                            ? 'bg-brand/10 border-brand text-brand font-bold shadow-2xs'
                            : 'bg-slate-50/80 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Incident Timeframe */}
                <div className="space-y-2.5 pt-5">
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-brand" />
                    <span className="text-xs sm:text-sm font-bold text-ink">Incident Timeframe</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'ALL', label: 'All Time' },
                      { id: '24H', label: 'Last 24 Hours' },
                      { id: '7D', label: 'Past 7 Days' },
                      { id: '30D', label: 'Past 30 Days' },
                    ].map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setSelectedTimeframe(t.id)}
                        className={`px-3 py-2 rounded-xl text-xs font-semibold transition text-center border cursor-pointer ${
                          selectedTimeframe === t.id
                            ? 'bg-brand/10 border-brand text-brand font-bold shadow-2xs'
                            : 'bg-slate-50/80 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Categories (from DB categories table) */}
                <div className="space-y-2.5 pt-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Layers className="h-4 w-4 text-brand" />
                      <span className="text-xs sm:text-sm font-bold text-ink">Categories</span>
                      {selectedCategoryIds.length > 0 && (
                        <span className="text-[11px] font-bold text-brand bg-brand/10 px-2 py-0.5 rounded-full">
                          {selectedCategoryIds.length} selected
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[11px]">
                      <button
                        type="button"
                        onClick={() => setSelectedCategoryIds(categories.map((c) => c.id))}
                        className="text-brand hover:underline font-bold"
                      >
                        Select All
                      </button>
                      <span className="text-slate-300">•</span>
                      <button
                        type="button"
                        onClick={() => setSelectedCategoryIds([])}
                        className="text-slate-500 hover:underline font-semibold"
                      >
                        Clear
                      </button>
                    </div>
                  </div>

                  {categories.length > 6 && (
                    <div className="relative">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                      <input
                        type="text"
                        value={categorySearch}
                        onChange={(e) => setCategorySearch(e.target.value)}
                        placeholder="Search categories..."
                        className="w-full pl-8 pr-7 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-ink placeholder-slate-400 focus:outline-hidden focus:border-brand"
                      />
                      {categorySearch && (
                        <button
                          type="button"
                          onClick={() => setCategorySearch('')}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1">
                    {filteredCategories.map((cat) => {
                      const isSelected = selectedCategoryIds.includes(cat.id);
                      const count = categoryCounts[cat.id] || categoryCounts[cat.name] || 0;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => toggleCategoryById(cat.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-medium transition flex items-center gap-1.5 border cursor-pointer ${
                            isSelected
                              ? 'bg-brand/10 border-brand text-brand font-bold shadow-2xs'
                              : 'bg-slate-50/80 border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {isSelected ? (
                            <Check className="h-3.5 w-3.5 text-brand shrink-0" />
                          ) : (
                            <Square className="h-3.5 w-3.5 text-slate-300 shrink-0" />
                          )}
                          <span>{cat.name}</span>
                          {count > 0 && (
                            <span
                              className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                                isSelected ? 'bg-brand text-white' : 'bg-slate-200 text-slate-600'
                              }`}
                            >
                              {count}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 4. Severity Level (from DB post_severities table) */}
                <div className="space-y-2.5 pt-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <ShieldAlert className="h-4 w-4 text-rose-500" />
                      <span className="text-xs sm:text-sm font-bold text-ink">Severity Level</span>
                      {selectedSeverityIds.length > 0 && (
                        <span className="text-[11px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                          {selectedSeverityIds.length} selected
                        </span>
                      )}
                    </div>
                    {selectedSeverityIds.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setSelectedSeverityIds([])}
                        className="text-[11px] text-slate-500 hover:underline font-semibold"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {severities.map((sev) => {
                      const isSelected = selectedSeverityIds.includes(sev.id);
                      const count = severityCounts[sev.id] || 0;
                      const dotColor =
                        sev.id === 4
                          ? 'bg-rose-500'
                          : sev.id === 3
                          ? 'bg-orange-500'
                          : sev.id === 2
                          ? 'bg-amber-500'
                          : 'bg-emerald-500';

                      return (
                        <button
                          key={sev.id}
                          type="button"
                          onClick={() => toggleSeverityById(sev.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-medium transition flex items-center gap-2 border cursor-pointer ${
                            isSelected
                              ? 'bg-rose-50/80 border-rose-300 text-rose-800 font-bold shadow-2xs'
                              : 'bg-slate-50/80 border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${dotColor}`} />
                          <span>{sev.name}</span>
                          {count > 0 && (
                            <span
                              className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                                isSelected ? 'bg-rose-600 text-white' : 'bg-slate-200 text-slate-600'
                              }`}
                            >
                              {count}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 5. Report Status (from DB post_statuses table) */}
                <div className="space-y-2.5 pt-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      <span className="text-xs sm:text-sm font-bold text-ink">Report Status</span>
                      {selectedStatusIds.length > 0 && (
                        <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                          {selectedStatusIds.length} selected
                        </span>
                      )}
                    </div>
                    {selectedStatusIds.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setSelectedStatusIds([])}
                        className="text-[11px] text-slate-500 hover:underline font-semibold"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {statuses.map((st) => {
                      const isSelected = selectedStatusIds.includes(st.id);
                      const count = statusCounts[st.id] || 0;
                      const dotColor =
                        st.id === 2 ? 'bg-emerald-500' : st.id === 3 ? 'bg-amber-500' : 'bg-cyan-500';

                      return (
                        <button
                          key={st.id}
                          type="button"
                          onClick={() => toggleStatusById(st.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-medium transition flex items-center gap-2 border cursor-pointer ${
                            isSelected
                              ? 'bg-emerald-50/80 border-emerald-300 text-emerald-800 font-bold shadow-2xs'
                              : 'bg-slate-50/80 border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${dotColor}`} />
                          <span>{st.name}</span>
                          {count > 0 && (
                            <span
                              className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                                isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                              }`}
                            >
                              {count}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 6. Location Filter */}
                <div className="space-y-2.5 pt-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4 text-rose-500" />
                      <span className="text-xs sm:text-sm font-bold text-ink">Location</span>
                    </div>
                    {(locationQuery || hasLocationOnly) && (
                      <button
                        type="button"
                        onClick={() => {
                          setLocationQuery('');
                          setHasLocationOnly(false);
                        }}
                        className="text-[11px] text-slate-500 hover:underline font-semibold"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                    <input
                      type="text"
                      value={locationQuery}
                      onChange={(e) => setLocationQuery(e.target.value)}
                      placeholder="e.g. Madhapur, Transit, Campus, City..."
                      className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-ink placeholder-slate-400 focus:outline-hidden focus:border-brand"
                    />
                    {locationQuery && (
                      <button
                        type="button"
                        onClick={() => setLocationQuery('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer pt-0.5 select-none">
                    <input
                      type="checkbox"
                      checked={hasLocationOnly}
                      onChange={(e) => setHasLocationOnly(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-brand focus:ring-brand cursor-pointer"
                    />
                    <span className="text-xs text-slate-600">
                      Only reports with physical location tag attached
                    </span>
                  </label>
                </div>

                {/* 7. Author Privacy */}
                <div className="space-y-2.5 pt-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Users className="h-4 w-4 text-purple-500" />
                      <span className="text-xs sm:text-sm font-bold text-ink">Author Privacy</span>
                      {selectedAuthorTypes.length > 0 && (
                        <span className="text-[11px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
                          {selectedAuthorTypes.length} selected
                        </span>
                      )}
                    </div>
                    {selectedAuthorTypes.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setSelectedAuthorTypes([])}
                        className="text-[11px] text-slate-500 hover:underline font-semibold"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      { id: 'ANONYMOUS', label: 'Anonymous Reporters', icon: EyeOff },
                      { id: 'IDENTIFIED', label: 'Verified Community Members', icon: Users },
                    ].map((auth) => {
                      const isSelected = selectedAuthorTypes.includes(auth.id);
                      const Icon = auth.icon;
                      return (
                        <button
                          key={auth.id}
                          type="button"
                          onClick={() => toggleAuthorType(auth.id)}
                          className={`px-3 py-2 rounded-xl text-xs font-medium transition flex items-center gap-2 border cursor-pointer ${
                            isSelected
                              ? 'bg-purple-50/80 border-purple-300 text-purple-800 font-bold shadow-2xs'
                              : 'bg-slate-50/80 border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {isSelected ? (
                            <CheckSquare className="h-4 w-4 text-purple-600 shrink-0" />
                          ) : (
                            <Square className="h-4 w-4 text-slate-300 shrink-0" />
                          )}
                          <Icon className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                          <span className="truncate">{auth.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Modal Sticky Footer */}
              <div className="flex items-center justify-between px-5 sm:px-6 py-3.5 border-t border-slate-200 bg-white">
                <button
                  type="button"
                  onClick={resetAllFilters}
                  disabled={activeFilterCount === 0}
                  className="text-xs sm:text-[13px] font-bold text-rose-600 hover:text-rose-700 disabled:opacity-40 disabled:cursor-not-allowed transition py-2 px-3 rounded-xl hover:bg-rose-50"
                >
                  Reset All {activeFilterCount > 0 ? `(${activeFilterCount})` : ''}
                </button>
                <button
                  type="button"
                  onClick={() => setIsFilterModalOpen(false)}
                  className="px-5 py-2.5 rounded-[14px] bg-brand hover:bg-brand-deep text-white text-xs sm:text-[13px] font-bold transition shadow-xs shadow-brand/20 flex items-center gap-2 cursor-pointer"
                >
                  <span>Show {filteredPosts.length} Reports</span>
                </button>
              </div>
            </div>
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
            <button onClick={resetAllFilters} className="text-brand hover:underline font-semibold">
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
            {filteredPosts.map((post, index) => (
              <PostCard key={post.uuid || (post as any).id || `post-${index}`} post={post} />
            ))}
          </div>
        ) : (
          /* Empty Search / Filter State */
          <div className="p-10 text-center bg-white rounded-[24px] border border-slate-200 space-y-3">
            <div className="w-12 h-12 rounded-full bg-brand-tint text-brand flex items-center justify-center mx-auto">
              <Search className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-ink">
              No incident reports found
            </h3>
            <p className="text-xs text-slate-600 max-w-sm mx-auto">
              No public reports matched your current filters
              {searchQuery ? ` ("${searchQuery}")` : ''}.
              Try clearing some filter criteria or searching with broader keywords.
            </p>
            <button
              onClick={resetAllFilters}
              className="px-4 py-2 rounded-[12px] bg-brand text-white text-xs font-bold hover:bg-brand-deep transition shadow-xs"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

export function FeedClient() {
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
