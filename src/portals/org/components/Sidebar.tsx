'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Building2,
  Users,
  ShieldAlert,
  BarChart3,
  Radio,
  Settings,
  Shield,
  LogOut,
  ChevronRight,
} from 'lucide-react';
import { useAdminAuth } from '@/portals/org/lib/auth-context';

export default function OrgSidebar() {
  const pathname = usePathname();
  const { admin, logout } = useAdminAuth();

  const navItems = [
    { label: 'Campus Command', href: '/org/dashboard', icon: Building2 },
    { label: 'Students & Staff', href: '/org/dashboard/members', icon: Users },
    { label: 'Live Incidents', href: '/org/dashboard/incidents', icon: ShieldAlert },
    { label: 'Safety Analytics', href: '/org/dashboard/analytics', icon: BarChart3 },
    { label: 'Emergency Broadcast', href: '/org/dashboard/broadcast', icon: Radio },
    { label: 'Settings & Zones', href: '/org/dashboard/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 border-r border-[#e8e8f0] bg-white flex flex-col justify-between shrink-0 select-none sticky top-0 h-screen overflow-hidden">
      <div>
        {/* Brand */}
        <div className="p-6 border-b border-[#e8e8f0]">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-[12px] bg-[#6d4aff] flex items-center justify-center text-white shadow-sm">
              <Shield size={18} className="fill-white/20" />
            </div>
            <div>
              <div className="text-sm font-black text-[#16161d] tracking-tight flex items-center gap-1.5">
                <span>Sabhijude</span>
                <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded-full bg-[#f1edff] text-[#6d4aff]">
                  Org
                </span>
              </div>
              <p className="text-[10.5px] text-[#5b5b6e]">Institutional Safety</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="p-3 space-y-1">
          <div className="text-[10px] uppercase font-black tracking-wider text-[#9797ab] px-3 py-2">
            SAFETY OPERATIONS
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === '/org/dashboard'
                ? pathname === '/org/dashboard'
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-[12px] text-xs font-semibold transition duration-150 ${
                  isActive
                    ? 'bg-[#f1edff] text-[#6d4aff] font-bold'
                    : 'text-[#5b5b6e] hover:text-[#16161d] hover:bg-[#f1f1f6]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon size={16} className={isActive ? 'text-[#6d4aff]' : 'text-[#9797ab]'} />
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight size={14} className="text-[#6d4aff]" />}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Footer / Account */}
      <div className="p-3 border-t border-[#e8e8f0]">
        <Link
          href="/"
          className="flex items-center justify-center gap-2 px-3 py-2 mb-2 text-xs font-semibold text-[#5b5b6e] hover:text-[#6d4aff] hover:bg-[#f1edff] rounded-[12px] transition-colors"
        >
          <span>← Back to Community Portal</span>
        </Link>
        <div className="p-3 bg-[#f7f7fa] border border-[#e8e8f0] rounded-[14px] flex items-center gap-3 mb-2">
          <div className="h-8 w-8 rounded-[10px] bg-[#f1edff] text-[#6d4aff] flex items-center justify-center font-bold text-xs">
            {admin?.fullName ? admin.fullName[0].toUpperCase() : 'O'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold text-[#16161d] truncate">
              {admin?.fullName || 'Campus Security'}
            </div>
            <div className="text-[10.5px] text-[#5b5b6e] truncate">{admin?.email}</div>
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-[12px] text-xs font-bold text-[#5b5b6e] hover:text-[#e11d48] hover:bg-[#e11d48]/10 transition"
        >
          <LogOut size={15} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
