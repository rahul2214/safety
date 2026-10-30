'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Shield,
  ShieldCheck,
  Info,
  Home,
  Compass,
  Gamepad2,
  Users,
  User,
  AlertTriangle,
  Phone,
  LogOut,
  LogIn,
  UserPlus,
  Bell,
  Sparkles,
  Radio,
  MapPin,
  Building2,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { Logo } from '@/components/ui/Logo';

interface NavbarProps {
  onOpenSos: () => void;
  onOpenFakeCall: () => void;
}

export function Navbar({ onOpenSos, onOpenFakeCall }: NavbarProps) {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();
  const [portalsMenuOpen, setPortalsMenuOpen] = useState(false);
  const portalsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (portalsRef.current && !portalsRef.current.contains(event.target as Node)) {
        setPortalsMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Authenticated nav links for signed-in members
  const authNavLinks = [
    { href: '/', label: 'Feed', icon: Home },
    { href: '/map', label: 'Map', icon: MapPin },
    { href: '/discover', label: 'Discover', icon: Compass },
    { href: '/contacts', label: 'Circle', icon: Users },
    { href: '/safety-measures', label: 'Measures', icon: ShieldCheck },
    { href: '/play', label: 'Scenarios', icon: Gamepad2 },
  ];

  // Mobile bottom bar links for signed-in members
  const authMobileLinks = [
    { href: '/', label: 'Feed', icon: Home },
    { href: '/discover', label: 'Discover', icon: Compass },
    { href: '/contacts', label: 'Circle', icon: Users },
    { href: '/notifications', label: 'Alerts', icon: Bell },
    { href: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <>
      {/* Top Header */}
      <header className="sticky top-0 z-40 w-full border-b border-[#e8e8f0] dark:border-[#26263a] bg-white/90 dark:bg-[#141420]/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-3 sm:px-6">
          {/* Logo & Identity */}
          <Link href="/" className="flex items-center gap-2 sm:gap-2.5 group shrink-0">
            <Logo size={36} />
            <div>
              <span className="font-black text-[#16161d] dark:text-[#f4f4f8] text-[15px] sm:text-[16px] tracking-tight flex items-center gap-1.5 group-hover:text-[#6d4aff] transition-colors">
                Sabhijude
                <span className="h-2 w-2 rounded-full bg-[#10b981]" />
              </span>
              <p className="text-[10px] sm:text-[10.5px] text-[#5b5b6e] dark:text-[#a6a6be] -mt-0.5 font-medium hidden xs:block">
                Women Safety Network
              </p>
            </div>
          </Link>

          {/* Navigation Links */}
          {isAuthenticated ? (
            /* Authenticated Desktop Nav Links */
            <nav className="hidden md:flex items-center gap-1">
              {authNavLinks.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-[12px] text-[13px] font-semibold transition ${
                      isActive
                        ? 'bg-[#f1edff] dark:bg-[#241a4d] text-[#6d4aff] dark:text-[#a78bfa]'
                        : 'text-[#5b5b6e] dark:text-[#a6a6be] hover:text-[#16161d] dark:hover:text-white hover:bg-[#f1f1f6] dark:hover:bg-[#1d1d2c]'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          ) : (
            /* Public Nav Links: Home, Feed, About, and Safety Measures with Active Indicators */
            <nav className="flex items-center gap-0.5 sm:gap-1.5">
              <Link
                href="/"
                className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 rounded-[12px] text-[12px] sm:text-[13px] font-semibold transition ${
                  pathname === '/'
                    ? 'bg-[#f1edff] dark:bg-[#241a4d] text-[#6d4aff] dark:text-[#a78bfa]'
                    : 'text-[#5b5b6e] dark:text-[#a6a6be] hover:text-[#16161d] dark:hover:text-white hover:bg-[#f1f1f6] dark:hover:bg-[#1d1d2c]'
                }`}
              >
                <Home className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#6d4aff]" />
                <span>Home</span>
              </Link>
              <Link
                href="/feed"
                className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 rounded-[12px] text-[12px] sm:text-[13px] font-semibold transition ${
                  pathname === '/feed'
                    ? 'bg-[#f1edff] dark:bg-[#241a4d] text-[#6d4aff] dark:text-[#a78bfa]'
                    : 'text-[#5b5b6e] dark:text-[#a6a6be] hover:text-[#16161d] dark:hover:text-white hover:bg-[#f1f1f6] dark:hover:bg-[#1d1d2c]'
                }`}
              >
                <Radio className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#e11d48]" />
                <span>Feed</span>
              </Link>
              <Link
                href="/map"
                className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 rounded-[12px] text-[12px] sm:text-[13px] font-semibold transition ${
                  pathname === '/map'
                    ? 'bg-[#f1edff] dark:bg-[#241a4d] text-[#6d4aff] dark:text-[#a78bfa]'
                    : 'text-[#5b5b6e] dark:text-[#a6a6be] hover:text-[#16161d] dark:hover:text-white hover:bg-[#f1f1f6] dark:hover:bg-[#1d1d2c]'
                }`}
              >
                <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#6d4aff]" />
                <span>Map</span>
              </Link>
              <Link
                href="/about"
                className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 rounded-[12px] text-[12px] sm:text-[13px] font-semibold transition ${
                  pathname === '/about'
                    ? 'bg-[#f1edff] dark:bg-[#241a4d] text-[#6d4aff] dark:text-[#a78bfa]'
                    : 'text-[#5b5b6e] dark:text-[#a6a6be] hover:text-[#16161d] dark:hover:text-white hover:bg-[#f1f1f6] dark:hover:bg-[#1d1d2c]'
                }`}
              >
                <Info className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#6d4aff]" />
                <span>About</span>
              </Link>
              <Link
                href="/safety-measures"
                className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 rounded-[12px] text-[12px] sm:text-[13px] font-semibold transition ${
                  pathname === '/safety-measures'
                    ? 'bg-[#f1edff] dark:bg-[#241a4d] text-[#6d4aff] dark:text-[#a78bfa]'
                    : 'text-[#5b5b6e] dark:text-[#a6a6be] hover:text-[#16161d] dark:hover:text-white hover:bg-[#f1f1f6] dark:hover:bg-[#1d1d2c]'
                }`}
              >
                <ShieldCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#059669]" />
                <span className="hidden sm:inline">Safety Measures</span>
                <span className="sm:hidden">Safety</span>
              </Link>
            </nav>
          )}

          {/* Right Action Cluster */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Desktop-Only Portals Switcher */}
            <div className="relative hidden md:block" ref={portalsRef}>
              <button
                type="button"
                onClick={() => setPortalsMenuOpen((prev) => !prev)}
                aria-expanded={portalsMenuOpen}
                aria-label="Switch platform portals"
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-[12px] text-xs font-semibold border transition ${
                  portalsMenuOpen
                    ? 'bg-[#f1edff] dark:bg-[#241a4d] text-[#6d4aff] dark:text-[#a78bfa] border-[#6d4aff]/30 shadow-sm'
                    : 'bg-[#f7f7fa] dark:bg-[#1d1d2c] text-[#5b5b6e] dark:text-[#a6a6be] border-[#e8e8f0] dark:border-[#26263a] hover:text-[#16161d] dark:hover:text-white'
                }`}
              >
                <Building2 className="h-3.5 w-3.5 text-[#6d4aff]" />
                <span>Portals</span>
                <ChevronDown
                  className={`h-3 w-3 text-[#9797ab] transition-transform duration-200 ${
                    portalsMenuOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {portalsMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-[16px] bg-white dark:bg-[#1a1a28] border border-[#e8e8f0] dark:border-[#26263a] shadow-xl p-2 z-50 animate-in fade-in slide-in-from-top-1">
                  <div className="px-2.5 py-1.5 text-[10px] font-black uppercase tracking-wider text-[#9797ab]">
                    Sabhijude Unified Portals
                  </div>
                  <Link
                    href="/"
                    onClick={() => setPortalsMenuOpen(false)}
                    className="flex items-center gap-2.5 px-2.5 py-2 rounded-[10px] text-xs text-[#16161d] dark:text-[#f4f4f8] hover:bg-[#f1f1f6] dark:hover:bg-[#252538] transition"
                  >
                    <div className="h-7 w-7 rounded-[8px] bg-[#f1edff] text-[#6d4aff] flex items-center justify-center shrink-0">
                      <Home className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-bold flex items-center gap-1">
                        Community Portal
                        <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-100 dark:bg-emerald-900/40 text-[#059669] font-bold">
                          Current
                        </span>
                      </div>
                      <div className="text-[10.5px] text-[#5b5b6e] dark:text-[#a6a6be]">
                        Member feed & safety circles
                      </div>
                    </div>
                  </Link>

                  <Link
                    href="/org"
                    onClick={() => setPortalsMenuOpen(false)}
                    className="flex items-center gap-2.5 px-2.5 py-2 rounded-[10px] text-xs text-[#16161d] dark:text-[#f4f4f8] hover:bg-[#f1f1f6] dark:hover:bg-[#252538] transition"
                  >
                    <div className="h-7 w-7 rounded-[8px] bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                      <Building2 className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-bold text-[#16161d] dark:text-[#f4f4f8]">
                        Org & Campus Command
                      </div>
                      <div className="text-[10.5px] text-[#5b5b6e] dark:text-[#a6a6be]">
                        Campus security & enterprise desk
                      </div>
                    </div>
                  </Link>

                  <Link
                    href="/admin"
                    onClick={() => setPortalsMenuOpen(false)}
                    className="flex items-center gap-2.5 px-2.5 py-2 rounded-[10px] text-xs text-[#16161d] dark:text-[#f4f4f8] hover:bg-[#f1f1f6] dark:hover:bg-[#252538] transition"
                  >
                
                    <div>
                      <div className="font-bold text-[#16161d] dark:text-[#f4f4f8]">
                        System Admin Console
                      </div>
                      <div className="text-[10.5px] text-[#5b5b6e] dark:text-[#a6a6be]">
                        Moderation & platform control
                      </div>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {isAuthenticated ? (
              /* Authenticated Member Actions Cluster */
              <>
                <button
                  onClick={onOpenFakeCall}
                  title="Discreet Deterrence Call"
                  className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-[12px] bg-[#f1f1f6] dark:bg-[#1d1d2c] hover:bg-[#e6e6ee] dark:hover:bg-[#2a2a3d] border border-[#e8e8f0] dark:border-[#26263a] text-[#16161d] dark:text-[#f4f4f8] text-xs font-bold transition"
                >
                  <Phone className="h-3.5 w-3.5 text-[#6d4aff]" />
                  <span className="hidden sm:inline">Fake Call</span>
                </button>

                {/* Quick SOS Button */}
                <button
                  onClick={onOpenSos}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-[12px] bg-[#e11d48] hover:bg-[#be123c] font-bold text-white text-xs shadow-sm transition active:scale-95"
                >
                  <AlertTriangle className="h-3.5 w-3.5" />
                  <span>SOS</span>
                </button>

                <div className="flex items-center gap-1.5 sm:gap-2 pl-1 border-l border-[#e8e8f0] dark:border-[#26263a]">
                  {/* Notifications Bell (Private) */}
                  <Link
                    href="/notifications"
                    title="Safety Notifications"
                    className={`p-2 rounded-[10px] text-[#5b5b6e] dark:text-[#a6a6be] hover:text-[#16161d] dark:hover:text-white hover:bg-[#f1f1f6] dark:hover:bg-[#1d1d2c] transition relative ${
                      pathname === '/notifications' ? 'bg-[#f1edff] dark:bg-[#241a4d] text-[#6d4aff]' : ''
                    }`}
                  >
                    <Bell className="h-4 w-4" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#e11d48] ring-2 ring-white dark:ring-[#141420]" />
                  </Link>

                  {/* Profile Pill (Private - Desktop Only) */}
                  <Link
                    href="/profile"
                    className={`hidden md:flex items-center gap-2 px-2.5 py-1.5 rounded-[12px] hover:bg-[#f1f1f6] dark:hover:bg-[#1d1d2c] text-xs font-semibold text-[#16161d] dark:text-[#f4f4f8] transition ${
                      pathname === '/profile' ? 'bg-[#f1edff] dark:bg-[#241a4d] text-[#6d4aff]' : ''
                    }`}
                  >
                    <div className="h-6 w-6 rounded-full bg-[#f1edff] text-[#6d4aff] font-bold text-xs flex items-center justify-center">
                      {user?.displayName ? user.displayName[0].toUpperCase() : 'U'}
                    </div>
                    <span className="hidden lg:inline max-w-[80px] truncate">{user?.displayName}</span>
                  </Link>

                  <button
                    onClick={logout}
                    title="Sign out"
                    className="p-1.5 text-[#5b5b6e] hover:text-[#e11d48] rounded-[8px] hover:bg-[#f1f1f6] dark:hover:bg-[#1d1d2c] transition"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              </>
            ) : (
              /* Public Right Cluster: Only Login & Join/Signup Buttons */
              <div className="flex items-center gap-1.5 sm:gap-2 pl-1 border-l border-[#e8e8f0] dark:border-[#26263a]">
                <Link
                  href="/login"
                  className={`px-2.5 sm:px-3 py-1.5 rounded-[10px] text-xs font-bold transition flex items-center gap-1 ${
                    pathname === '/login'
                      ? 'bg-[#f1edff] dark:bg-[#241a4d] text-[#6d4aff] dark:text-[#a78bfa]'
                      : 'text-[#5b5b6e] dark:text-[#a6a6be] hover:text-[#16161d] dark:hover:text-white hover:bg-[#f1f1f6] dark:hover:bg-[#1d1d2c]'
                  }`}
                >
                  <LogIn className="h-3.5 w-3.5" />
                  <span>Log in</span>
                </Link>
                <Link
                  href="/signup"
                  className={`px-3 sm:px-3.5 py-1.5 rounded-[10px] text-xs font-bold transition shadow-sm flex items-center gap-1 ${
                    pathname === '/signup'
                      ? 'bg-[#5325e8] text-white ring-2 ring-[#6d4aff]/30'
                      : 'bg-[#6d4aff] hover:bg-[#5325e8] text-white'
                  }`}
                >
                  <UserPlus className="h-3.5 w-3.5" />
                  <span>Join</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar: ONLY shown for Authenticated Members */}
      {isAuthenticated && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#141420]/95 border-t border-[#e8e8f0] dark:border-[#26263a] backdrop-blur-lg px-2 py-2">
          <div className="flex items-center justify-around max-w-md mx-auto">
            {authMobileLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex flex-col items-center py-1 px-3 rounded-full text-[10.5px] font-bold transition ${
                    isActive
                      ? 'text-[#6d4aff] dark:text-[#a78bfa]'
                      : 'text-[#9797ab] dark:text-[#6e6e8a] hover:text-[#16161d] dark:hover:text-white'
                  }`}
                >
                  <div
                    className={`w-[52px] h-[30px] rounded-full flex items-center justify-center transition-colors ${
                      isActive ? 'bg-[#f1edff] dark:bg-[#241a4d]' : 'bg-transparent'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="mt-0.5">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
