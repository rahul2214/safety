'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Shield,
  Home,
  AlertCircle,
  FileText,
  MapPin,
  Users,
  AlertTriangle,
  BookOpen,
  Bell,
  HelpCircle,
  Settings,
  Search,
  Phone,
  LogOut,
  LogIn,
  UserPlus,
  Menu,
  X,
  Lock,
  ChevronRight,
  ShieldCheck,
  User,
  ArrowLeft,
  Loader2,
  Radio,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { api, type BackendPost } from '@/lib/api-client';
import { Button } from '@/components/ui/Button';
import { PageShellSkeleton } from '@/components/ui/Skeleton';
import { Logo } from '@/components/ui/Logo';
import { PublicHeader } from '@/components/public/PublicHeader';
import { PublicFooter } from '@/components/public/PublicFooter';

interface AppShellProps {
  children: React.ReactNode;
}

const PUBLIC_ROUTES = ['/', '/feed', '/about', '/safety-measures', '/organization-request', '/login', '/signup'];

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<BackendPost[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);
  const isAuthPage = pathname === '/login' || pathname === '/signup';

  // Close menus and search dropdown on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileMenuOpen(false);
    setIsSearchDropdownOpen(false);
  }, [pathname]);

  // Click outside to dismiss search dropdown
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch live search preview from database
  useEffect(() => {
    const term = searchQuery.trim();
    if (term.length < 2) {
      setSearchSuggestions([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(async () => {
      try {
        const res = await api.searchPosts(term, { limit: 4 });
        if (res.ok && res.data) {
          setSearchSuggestions(res.data);
        } else {
          setSearchSuggestions([]);
        }
      } catch {
        setSearchSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Global keyboard shortcut '/' to focus search (Only when authenticated)
  useEffect(() => {
    if (!isAuthenticated) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === '/' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        document.getElementById('global-search-input')?.focus();
        setIsSearchDropdownOpen(true);
      }
      if (e.key === 'Escape') {
        setIsSearchDropdownOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAuthenticated]);

  // Automatic redirect if unauthenticated user tries to visit private dashboard routes
  useEffect(() => {
    if (!isLoading && !isAuthenticated && !isPublicRoute) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [isLoading, isAuthenticated, isPublicRoute, pathname, router]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearchDropdownOpen(false);
    router.push(`/feed?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  const navItems: Array<{
    href: string;
    label: string;
    icon: any;
    isAction?: boolean;
    isEmergency?: boolean;
    badge?: number | string;
  }> = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/feed', label: 'Feed', icon: Radio },
    { href: '/report', label: 'Report a Problem', icon: AlertCircle, isAction: true },
    { href: '/myposts', label: 'My Posts', icon: FileText },
    { href: '/map', label: 'Safety Map', icon: MapPin },
    { href: '/contacts', label: 'Trusted Contacts', icon: Users },
    { href: '/emergency', label: 'Emergency', icon: AlertTriangle, isEmergency: true },
    { href: '/resources', label: 'Safety Resources', icon: BookOpen },
    { href: '/support', label: 'Support', icon: HelpCircle },
    { href: '/settings', label: 'Settings & Privacy', icon: Settings },
    { href: '/profile', label: 'Member Profile', icon: User },
  ];

  // Auth Pages (/login and /signup): Dedicated secure viewport layout - never unmount on auth loading checks
  if (isAuthPage) {
    return <>{children}</>;
  }

  // =========================================================================
  // 1. INITIAL SESSION LOADING STATE
  // =========================================================================
  if (isLoading) {
    return <PageShellSkeleton />;
  }

  // =========================================================================
  // 2. UNAUTHENTICATED GUEST: STRICT ACCESS CONTROL
  // =========================================================================
  if (!isAuthenticated) {
    // If guest attempts to open any private route, block & show authentication gate
    if (!isPublicRoute) {
      return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
          <div className="max-w-md w-full bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-sm text-center space-y-5">
            <div className="w-16 h-16 flex items-center justify-center mx-auto">
              <Logo size={56} />
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                Authentication Required
              </span>
              <h2 className="text-lg font-bold text-slate-900">
                Sign in to Access User Portal
              </h2>
              <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
                Dashboard features, incident tracking, emergency circles, and confidential case records are protected.
                Please sign in to proceed.
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <Link
                href={`/login?redirect=${encodeURIComponent(pathname)}`}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-colors"
              >
                <LogIn className="h-4 w-4" />
                <span>Log in to Sabhijude</span>
              </Link>

              <Link
                href={`/signup?redirect=${encodeURIComponent(pathname)}`}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 font-semibold text-xs transition-colors"
              >
                <UserPlus className="h-4 w-4 text-blue-600" />
                <span>Create Sabhijude Account</span>
              </Link>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Return to Public Safety Home</span>
              </Link>
            </div>
          </div>
        </div>
      );
    }

    // Auth Pages (/login and /signup): Dedicated secure viewport layout
    if (isAuthPage) {
      return <>{children}</>;
    }

    // Public Pages: marketing header + footer. Marketing pages are full-bleed; the feed keeps a content container.
    const isFullBleed = pathname !== '/feed';
    return (
      <div className="min-h-screen bg-white flex flex-col text-ink">
        <PublicHeader />
        <main className={isFullBleed ? 'flex-1 w-full overflow-x-hidden' : 'flex-1 w-full public-container py-8 overflow-x-hidden'}>
          {children}
        </main>
        <PublicFooter />
      </div>
    );
  }

  // =========================================================================
  // 3. AUTHENTICATED USER: FULL PRIVATE DASHBOARD SHELL
  // =========================================================================
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
      {/* Top Bar (Enterprise Header) */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-xs">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6 gap-3">
          {/* Left: Mobile Menu Toggle + Platform Identity */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            <Link href="/" className="flex items-center gap-2.5 group">
              <Logo size={36} />
              <div>
                <span className="font-bold text-slate-900 text-base tracking-tight flex items-center gap-1.5 group-hover:text-purple-600 transition-colors">
                  Sabhijude
                  <span className="h-2 w-2 rounded-full bg-emerald-500" title="Operational" />
                </span>
                <p className="text-[10px] text-slate-500 font-medium -mt-0.5 hidden xs:block">
                  Personal Safety Platform
                </p>
              </div>
            </Link>
          </div>

          {/* Center: Global Search (Desktop) */}
          <div ref={searchContainerRef} className="hidden md:flex flex-1 max-w-md mx-4 relative">
            <form onSubmit={handleSearchSubmit} className="w-full relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                id="global-search-input"
                type="search"
                placeholder="Search reports, resources, helplines... (Press /)"
                value={searchQuery}
                onFocus={() => setIsSearchDropdownOpen(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchDropdownOpen(true);
                }}
                className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-4 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-colors"
              />
            </form>

            {/* Instant Search Suggestions Dropdown */}
            {isSearchDropdownOpen && searchQuery.trim().length >= 2 && (
              <div className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden z-50">
                <div className="px-3 py-2 border-b border-slate-100 bg-slate-50 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="font-semibold text-slate-700">Search Options</span>
                  {isSearching ? (
                    <span className="text-blue-600 flex items-center gap-1">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Searching...
                    </span>
                  ) : (
                    <span>Press Enter to view all</span>
                  )}
                </div>

                <div className="p-1.5 space-y-0.5">
                  <button
                    type="button"
                    onClick={() => {
                      setIsSearchDropdownOpen(false);
                      router.push(`/feed?q=${encodeURIComponent(searchQuery.trim())}`);
                    }}
                    className="w-full text-left p-2 rounded-lg hover:bg-blue-50 text-xs flex items-center justify-between group transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Radio className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                      <span className="text-slate-800 font-medium truncate">
                        Search safety reports for &ldquo;<strong>{searchQuery}</strong>&rdquo;
                      </span>
                    </div>
                    <span className="text-[10px] text-blue-600 font-semibold shrink-0">
                      Feed &rarr;
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsSearchDropdownOpen(false);
                      router.push(`/resources?q=${encodeURIComponent(searchQuery.trim())}`);
                    }}
                    className="w-full text-left p-2 rounded-lg hover:bg-purple-50 text-xs flex items-center justify-between group transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-3.5 w-3.5 text-purple-600 shrink-0" />
                      <span className="text-slate-800 font-medium truncate">
                        Search legal rights &amp; guides for &ldquo;<strong>{searchQuery}</strong>&rdquo;
                      </span>
                    </div>
                    <span className="text-[10px] text-purple-600 font-semibold shrink-0">
                      Resources &rarr;
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsSearchDropdownOpen(false);
                      router.push(`/map?search=${encodeURIComponent(searchQuery.trim())}`);
                    }}
                    className="w-full text-left p-2 rounded-lg hover:bg-emerald-50 text-xs flex items-center justify-between group transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      <span className="text-slate-800 font-medium truncate">
                        Search locations on Safety Map for &ldquo;<strong>{searchQuery}</strong>&rdquo;
                      </span>
                    </div>
                    <span className="text-[10px] text-emerald-600 font-semibold shrink-0">
                      Map &rarr;
                    </span>
                  </button>
                </div>

                {/* Live Database Incident Matches */}
                {searchSuggestions.length > 0 && (
                  <div className="border-t border-slate-100 p-1.5 space-y-1 bg-slate-50/40">
                    <p className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider text-slate-400">
                      Matching Reports ({searchSuggestions.length})
                    </p>
                    {searchSuggestions.map((post) => (
                      <button
                        key={post.id}
                        type="button"
                        onClick={() => {
                          setIsSearchDropdownOpen(false);
                          router.push(`/feed?q=${encodeURIComponent(searchQuery.trim())}`);
                        }}
                        className="w-full text-left p-2 rounded-lg hover:bg-white text-xs border border-transparent hover:border-slate-200 transition-colors space-y-0.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-900 truncate">
                            {post.location || post.categoryName || 'Incident Report'}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">#{post.id}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-1">
                          {post.content}
                        </p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right: Notifications, Profile */}
          <div className="flex items-center gap-2">
            {/* Notifications Bell */}
            <Link
              href="/notifications"
              className={`relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors ${
                pathname === '/notifications' ? 'bg-slate-100 text-blue-600' : ''
              }`}
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600" />
              </span>
            </Link>

            {/* Profile Pill & Dropdown (Hidden on Mobile) */}
            <div className="relative hidden md:block">
              <button
                type="button"
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-left"
                aria-expanded={profileMenuOpen}
              >
                <div className="h-7 w-7 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center border border-blue-200">
                  {user?.displayName ? user.displayName[0].toUpperCase() : 'U'}
                </div>
                <span className="hidden xl:inline text-xs font-medium text-slate-700 max-w-[100px] truncate">
                  {user?.displayName || 'My Account'}
                </span>
              </button>

              {/* Profile Dropdown Menu */}
              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-lg bg-white border border-slate-200 shadow-lg py-1.5 z-50 animate-in fade-in duration-100">
                  <div className="px-3.5 py-2 border-b border-slate-100">
                    <p className="text-xs font-semibold text-slate-900 truncate">
                      {user?.displayName || 'User'}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">{user?.email || 'Active Session'}</p>
                  </div>

                  <Link
                    href="/settings"
                    onClick={() => setProfileMenuOpen(false)}
                    className="flex items-center gap-2 px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <Settings className="h-3.5 w-3.5 text-slate-400" />
                    <span>Account &amp; Security</span>
                  </Link>

                  <Link
                    href="/privacy"
                    onClick={() => setProfileMenuOpen(false)}
                    className="flex items-center gap-2 px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <Lock className="h-3.5 w-3.5 text-slate-400" />
                    <span>Privacy Center</span>
                  </Link>

                  <Link
                    href="/support"
                    onClick={() => setProfileMenuOpen(false)}
                    className="flex items-center gap-2 px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <HelpCircle className="h-3.5 w-3.5 text-slate-400" />
                    <span>Support &amp; Help</span>
                  </Link>

                  <div className="border-t border-slate-100 mt-1 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setProfileMenuOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2 px-3.5 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors text-left font-medium"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Body Shell: Fixed Left-Docked Sidebar + Main Content */}
      <div className="flex-1 w-full relative">
        {/* Desktop Fixed Sidebar Navigation: Docked to left screen edge, fixed & non-scrollable */}
        <aside
          className="hidden md:flex flex-col w-64 border-r border-slate-200 bg-white fixed left-0 top-16 bottom-0 z-30 py-4 px-3 justify-between overflow-hidden select-none"
          aria-label="Sidebar Navigation"
        >
          <nav className="space-y-1 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              const isAction = item.isAction;
              const isEmergency = item.isEmergency;

              if (isAction) {
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors mb-1.5 ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </div>
                    <ChevronRight className="h-3.5 w-3.5 opacity-70" />
                  </Link>
                );
              }

              if (isEmergency) {
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors mb-1.5 ${
                      isActive
                        ? 'bg-red-600 text-white'
                        : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="h-4 w-4 text-red-600" />
                      <span>{item.label}</span>
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 bg-red-100 text-red-700 rounded">
                      SOS
                    </span>
                  </Link>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-slate-100 text-blue-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={`h-4 w-4 ${
                        isActive ? 'text-blue-600' : 'text-slate-400'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Sidebar Footer: Sign Out Option */}
          <div className="mt-auto pt-3 border-t border-slate-200 shrink-0">
            {isAuthenticated ? (
              <div className="space-y-2">
                {user && (
                  <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg">
                    <p className="text-xs font-bold text-slate-900 truncate">
                      {user.displayName || 'Protected Member'}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => logout()}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors text-left"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold text-blue-600 hover:bg-blue-50 transition-colors text-left"
              >
                <LogIn className="h-4 w-4" />
                <span>Sign In</span>
              </Link>
            )}
          </div>
        </aside>

        {/* Main Application Content Area (Offset by sidebar width on desktop) */}
        <div className="flex-1 w-full md:pl-64 flex flex-col min-w-0">
          <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 pb-24 md:pb-12 overflow-x-hidden">
            {children}
          </main>
        </div>
      </div>

      {/* Mobile Bottom Navigation (Authenticated Only) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 px-2 py-1.5 flex items-center justify-around shadow-lg">
        <Link
          href="/"
          className={`flex flex-col items-center py-1 px-2.5 text-[11px] font-medium transition-colors ${
            pathname === '/' ? 'text-blue-600 font-semibold' : 'text-slate-500'
          }`}
        >
          <Home className="h-5 w-5 mb-0.5" />
          <span>Home</span>
        </Link>

        <Link
          href="/report"
          className={`flex flex-col items-center py-1 px-2.5 text-[11px] font-medium transition-colors ${
            pathname === '/report' ? 'text-blue-600 font-semibold' : 'text-slate-500'
          }`}
        >
          <AlertCircle className="h-5 w-5 mb-0.5" />
          <span>Report</span>
        </Link>

        {/* Prominent SOS Button in Mobile Bottom Bar */}
        <Link
          href="/emergency"
          className="flex flex-col items-center -mt-4 bg-red-600 text-white rounded-full p-2.5 shadow-md active:bg-red-700 transition-colors"
          title="Emergency SOS"
        >
          <AlertTriangle className="h-5 w-5" />
          <span className="text-[9px] font-bold uppercase tracking-wider mt-0.5">SOS</span>
        </Link>

        <Link
          href="/myposts"
          className={`flex flex-col items-center py-1 px-2.5 text-[11px] font-medium transition-colors ${
            pathname === '/myposts' ? 'text-blue-600 font-semibold' : 'text-slate-500'
          }`}
        >
          <FileText className="h-5 w-5 mb-0.5" />
          <span>My Posts</span>
        </Link>

        <Link
          href="/profile"
          className={`flex flex-col items-center py-1 px-2.5 text-[11px] font-medium transition-colors ${
            pathname === '/profile' ? 'text-blue-600 font-semibold' : 'text-slate-500'
          }`}
        >
          <User className="h-5 w-5 mb-0.5" />
          <span>Profile</span>
        </Link>
      </nav>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="md:hidden fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex justify-end"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="w-72 bg-white h-full p-5 space-y-5 overflow-y-auto shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Logo size={28} />
                <span className="text-sm font-bold text-slate-900">Sabhijude</span>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="space-y-1.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between p-2.5 rounded-lg text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 font-semibold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="h-4 w-4 text-slate-500" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            <div className="pt-3 border-t border-slate-100 space-y-2">
              <a
                href="tel:112"
                className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-red-50 text-red-700 font-semibold text-xs border border-red-200"
              >
                <Phone className="h-3.5 w-3.5" />
                <span>Call Police 112</span>
              </a>
              <a
                href="tel:1091"
                className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-slate-100 text-slate-700 font-semibold text-xs"
              >
                <Phone className="h-3.5 w-3.5" />
                <span>Women Helpline 1091</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
