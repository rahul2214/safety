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
  ChevronDown,
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

const NAV_GROUPS = [
  { label: 'Overview', hrefs: ['/', '/feed', '/map'] },
  { label: 'Take action', hrefs: ['/report', '/myposts', '/contacts', '/emergency'] },
  { label: 'Learn & get help', hrefs: ['/resources', '/support'] },
  { label: 'Account', hrefs: ['/profile', '/settings'] },
];

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

  // Single posts are shareable, so /posts/<id> is readable without signing in
  const isPostPage = pathname?.startsWith('/posts/') ?? false;
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname) || isPostPage;
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
    { href: '/feed', label: 'Community feed', icon: Radio },
    { href: '/map', label: 'Safety map', icon: MapPin },
    { href: '/report', label: 'Report an incident', icon: AlertCircle, isAction: true },
    { href: '/myposts', label: 'My reports', icon: FileText },
    { href: '/contacts', label: 'Trusted contacts', icon: Users },
    { href: '/emergency', label: 'Emergency', icon: AlertTriangle, isEmergency: true },
    { href: '/resources', label: 'Safety guides', icon: BookOpen },
    { href: '/support', label: 'Help & support', icon: HelpCircle },
    { href: '/notifications', label: 'Notifications', icon: Bell },
    { href: '/profile', label: 'My profile', icon: User },
    { href: '/settings', label: 'Settings', icon: Settings },
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
    const isFullBleed = pathname !== '/feed' && !isPostPage;
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
  const activeItem = navItems.find((i) => i.href === pathname);
  const initial = user?.displayName ? user.displayName[0].toUpperCase() : 'U';

  const renderNav = (onNavigate?: () => void) => (
    <nav className="space-y-6">
      {NAV_GROUPS.map((group) => (
        <div key={group.label} className="space-y-1">
          <p className="px-3 pb-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white/35">{group.label}</p>
          {group.hrefs.map((href) => {
            const item = navItems.find((i) => i.href === href);
            if (!item) return null;
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-medium transition-colors ${
                  isActive ? 'bg-white text-ink shadow-sm' : 'text-white/70 hover:text-white hover:bg-white/[0.06]'
                }`}
              >
                <Icon className={`h-[18px] w-[18px] shrink-0 ${isActive ? 'text-brand' : 'text-white/45 group-hover:text-white/80'}`} />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );

  const sosCard = (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-500 to-red-700 p-4 text-white">
      <div aria-hidden className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/15 blur-xl" />
      <p className="relative text-[11px] font-semibold uppercase tracking-wider text-white/80">Feeling unsafe?</p>
      <Link
        href="/emergency"
        className="relative mt-2 flex items-center justify-between rounded-xl bg-white px-3.5 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 transition"
      >
        <span className="flex items-center gap-2"><AlertTriangle className="h-4 w-4" /> Emergency SOS</span>
        <ChevronRight className="h-4 w-4" />
      </Link>
      <a href="tel:112" className="relative mt-2 flex items-center justify-center gap-1.5 text-xs font-semibold text-white/90 hover:text-white">
        <Phone className="h-3.5 w-3.5" /> or call 112 directly
      </a>
    </div>
  );

  return (
    <div className="app-shell min-h-screen bg-mist text-ink">
      {/* Desktop sidebar */}
      <aside
        className="hidden md:flex fixed inset-y-0 left-0 z-40 w-72 flex-col bg-ink text-white select-none"
        aria-label="Sidebar Navigation"
      >
        <div aria-hidden className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-brand/30 blur-3xl" />
        <Link href="/" className="relative flex items-center gap-2.5 px-6 h-20 shrink-0">
          <span className="rounded-xl bg-white p-1"><Logo size={30} /></span>
          <span className="font-display text-xl font-extrabold tracking-tight">Sabhijude</span>
        </Link>

        <div className="relative flex-1 overflow-y-auto px-4 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {renderNav()}
        </div>

        <div className="relative shrink-0 space-y-3 p-4 border-t border-white/10">
          {sosCard}
          <div className="flex items-center gap-3 rounded-xl px-2 py-1.5">
            <div className="h-9 w-9 shrink-0 rounded-full bg-gradient-to-br from-brand to-coral flex items-center justify-center font-bold text-sm">
              {initial}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{user?.displayName || 'Member'}</p>
              <p className="truncate text-[11px] text-white/50">{user?.email}</p>
            </div>
            <button
              type="button"
              onClick={() => logout()}
              className="rounded-lg p-2 text-white/50 hover:text-white hover:bg-white/10 transition"
              aria-label="Sign out"
              title="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      <div className="md:pl-72 flex min-h-screen flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-mist/85 backdrop-blur-md">
          <div className="flex h-16 sm:h-20 items-center gap-3 px-4 sm:px-8">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden -ml-1 p-2 rounded-xl text-ink hover:bg-white transition-colors"
              aria-label="Open navigation menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <Link href="/" className="md:hidden flex items-center gap-2">
              <Logo size={28} />
              <span className="font-display font-extrabold tracking-tight">Sabhijude</span>
            </Link>

            <div className="hidden md:block min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">Sabhijude</p>
              <p className="font-display text-lg font-bold text-ink truncate">{activeItem?.label || 'Dashboard'}</p>
            </div>

            {/* Global search */}
            <div ref={searchContainerRef} className="hidden md:flex flex-1 max-w-lg ml-auto relative">
              <form onSubmit={handleSearchSubmit} className="w-full relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  id="global-search-input"
                  type="search"
                  placeholder="Search reports, guides, places…"
                  value={searchQuery}
                  onFocus={() => setIsSearchDropdownOpen(true)}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsSearchDropdownOpen(true);
                  }}
                  className="w-full h-11 rounded-full border border-slate-200 bg-white pl-11 pr-12 text-sm text-ink placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-brand/10 focus:border-brand transition"
                />
                <kbd className="absolute right-4 top-1/2 -translate-y-1/2 rounded-md border border-slate-200 bg-mist px-1.5 text-[11px] font-semibold text-slate-400">/</kbd>
              </form>

              {isSearchDropdownOpen && searchQuery.trim().length >= 2 && (
                <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl border border-slate-200 shadow-[0_20px_50px_-20px_rgba(11,22,48,0.35)] overflow-hidden z-50">
                  <div className="px-4 py-2.5 border-b border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="font-semibold text-ink">Search in</span>
                    {isSearching ? (
                      <span className="text-brand flex items-center gap-1">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        Searching…
                      </span>
                    ) : (
                      <span>Press Enter to see all</span>
                    )}
                  </div>

                  <div className="p-2 space-y-0.5">
                    {[
                      { icon: Radio, label: 'Safety reports', to: `/feed?q=`, tint: 'bg-brand-tint text-brand' },
                      { icon: BookOpen, label: 'Guides & legal rights', to: `/resources?q=`, tint: 'bg-coral-tint text-coral' },
                      { icon: MapPin, label: 'Places on the safety map', to: `/map?search=`, tint: 'bg-emerald-50 text-emerald-600' },
                    ].map((opt) => (
                      <button
                        key={opt.label}
                        type="button"
                        onClick={() => {
                          setIsSearchDropdownOpen(false);
                          router.push(`${opt.to}${encodeURIComponent(searchQuery.trim())}`);
                        }}
                        className="w-full text-left p-2 rounded-xl hover:bg-mist text-sm flex items-center gap-3 transition-colors"
                      >
                        <span className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${opt.tint}`}>
                          <opt.icon className="h-4 w-4" />
                        </span>
                        <span className="text-slate-700 truncate">
                          {opt.label} for &ldquo;<strong className="text-ink">{searchQuery}</strong>&rdquo;
                        </span>
                      </button>
                    ))}
                  </div>

                  {searchSuggestions.length > 0 && (
                    <div className="border-t border-slate-100 p-2 space-y-1 bg-mist/60">
                      <p className="px-2 py-1 text-[10px] uppercase font-bold tracking-wider text-slate-400">
                        Matching reports ({searchSuggestions.length})
                      </p>
                      {searchSuggestions.map((post) => (
                        <button
                          key={post.id}
                          type="button"
                          onClick={() => {
                            setIsSearchDropdownOpen(false);
                            router.push(`/feed?q=${encodeURIComponent(searchQuery.trim())}`);
                          }}
                          className="w-full text-left px-3 py-2 rounded-xl hover:bg-white text-xs transition-colors space-y-0.5"
                        >
                          <span className="block font-semibold text-ink truncate">
                            {post.location || post.categoryName || 'Incident report'}
                          </span>
                          <span className="block text-[11px] text-slate-500 line-clamp-1">{post.content}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 ml-auto md:ml-0">
              <Link
                href="/notifications"
                className={`relative h-11 w-11 rounded-full flex items-center justify-center border transition-colors ${
                  pathname === '/notifications' ? 'bg-ink text-white border-ink' : 'bg-white border-slate-200 text-ink hover:border-slate-300'
                }`}
                aria-label="Notifications"
              >
                <Bell className="h-[18px] w-[18px]" />
                <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-coral ring-2 ring-white" />
              </Link>

              <div className="relative hidden md:block">
                <button
                  type="button"
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="flex items-center gap-2 h-11 rounded-full border border-slate-200 bg-white pl-1 pr-3 hover:border-slate-300 transition-colors"
                  aria-expanded={profileMenuOpen}
                >
                  <span className="h-9 w-9 rounded-full bg-gradient-to-br from-brand to-coral text-white font-bold text-sm flex items-center justify-center">
                    {initial}
                  </span>
                  <ChevronDown className="h-4 w-4 text-slate-400" />
                </button>

                {profileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-slate-200 shadow-[0_20px_50px_-20px_rgba(11,22,48,0.35)] p-2 z-50">
                    <div className="px-3 py-2.5 mb-1 rounded-xl bg-mist">
                      <p className="text-sm font-semibold text-ink truncate">{user?.displayName || 'Member'}</p>
                      <p className="text-xs text-slate-500 truncate">{user?.email || 'Signed in'}</p>
                    </div>
                    {[
                      { href: '/profile', icon: User, label: 'My profile' },
                      { href: '/settings', icon: Settings, label: 'Account & security' },
                      { href: '/privacy', icon: Lock, label: 'Privacy center' },
                      { href: '/support', icon: HelpCircle, label: 'Help & support' },
                    ].map((l) => (
                      <Link
                        key={l.href}
                        href={l.href}
                        onClick={() => setProfileMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-slate-700 hover:bg-mist transition-colors"
                      >
                        <l.icon className="h-4 w-4 text-slate-400" />
                        {l.label}
                      </Link>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        setProfileMenuOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 mt-1 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors text-left"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="app-main flex-1 w-full max-w-7xl mx-auto px-4 sm:px-8 py-6 sm:py-8 pb-28 md:pb-12 overflow-x-hidden">
          {children}
        </main>
      </div>

      {/* Mobile bottom navigation */}
      <nav className="md:hidden fixed bottom-3 left-3 right-3 z-40 rounded-2xl bg-ink/95 backdrop-blur px-2 py-2 flex items-center justify-around shadow-[0_16px_40px_-12px_rgba(11,22,48,0.6)]">
        {[
          { href: '/', icon: Home, label: 'Home' },
          { href: '/report', icon: AlertCircle, label: 'Report' },
        ].map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={`flex flex-col items-center gap-0.5 px-3 py-1 text-[11px] font-medium ${pathname === l.href ? 'text-white' : 'text-white/50'}`}
          >
            <l.icon className="h-5 w-5" />
            {l.label}
          </Link>
        ))}
        <Link
          href="/emergency"
          className="-mt-8 flex h-16 w-16 flex-col items-center justify-center rounded-full bg-red-600 text-white ring-4 ring-mist shadow-[0_10px_24px_-6px_rgba(220,38,38,0.7)] active:bg-red-700"
          title="Emergency SOS"
        >
          <AlertTriangle className="h-5 w-5" />
          <span className="text-[10px] font-extrabold tracking-wider">SOS</span>
        </Link>
        {[
          { href: '/myposts', icon: FileText, label: 'My posts' },
          { href: '/profile', icon: User, label: 'Profile' },
        ].map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={`flex flex-col items-center gap-0.5 px-3 py-1 text-[11px] font-medium ${pathname === l.href ? 'text-white' : 'text-white/50'}`}
          >
            <l.icon className="h-5 w-5" />
            {l.label}
          </Link>
        ))}
      </nav>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="md:hidden fixed inset-0 z-50 bg-ink/50 backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="relative h-full w-80 max-w-[85vw] bg-ink text-white flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 h-16 shrink-0">
              <span className="flex items-center gap-2.5">
                <span className="rounded-xl bg-white p-1"><Logo size={26} /></span>
                <span className="font-display text-lg font-extrabold">Sabhijude</span>
              </span>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10"
                aria-label="Close navigation menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-4 pb-4">{renderNav(() => setMobileMenuOpen(false))}</div>
            <div className="shrink-0 space-y-3 p-4 border-t border-white/10">
              {sosCard}
              <button
                type="button"
                onClick={() => logout()}
                className="w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium text-white/70 hover:text-white hover:bg-white/10"
              >
                <LogOut className="h-4 w-4" /> Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
