'use client';

import { usePathname } from 'next/navigation';
import { useAdminAuth } from '@/portals/admin/lib/auth-context';
import { Shield, Circle } from 'lucide-react';

const TITLE_MAP: Record<string, { title: string; subtitle: string }> = {
  '/admin/dashboard': {
    title: 'Platform Overview',
    subtitle: 'System telemetry, safety incidents, and live health metrics',
  },
  '/admin/dashboard/support': {
    title: 'Support & Help Desk Operations',
    subtitle: 'Manage user inquiries, technical tickets, and grievance workflows',
  },
  '/admin/dashboard/organizations': {
    title: 'Organizations & Campuses',
    subtitle: 'Verified campus security teams, workplace hubs, and NGO networks',
  },
  '/admin/dashboard/users': {
    title: 'User Management',
    subtitle: 'Directory of registered members, roles, and safety restrictions',
  },
  '/admin/dashboard/moderation': {
    title: 'Content Moderation Queue',
    subtitle: 'High-risk automated flags, urgent reports, and post triage',
  },
  '/admin/dashboard/reports': {
    title: 'Safety Reports & Grievances',
    subtitle: 'Direct reports filed by community members against posts or users',
  },
  '/admin/dashboard/posts': {
    title: 'Community Posts Explorer',
    subtitle: 'Browse, filter, inspect solutions, and manage post visibility',
  },
  '/admin/dashboard/categories': {
    title: 'Safety Categories',
    subtitle: 'Manage topics, categories, and organize community knowledge',
  },
  '/admin/dashboard/admins': {
    title: 'Administrative Access & Staff',
    subtitle: 'Manage administrative roles, team privileges, and credentials',
  },
};

export default function Header() {
  const pathname = usePathname();
  const { admin } = useAdminAuth();

  const meta = TITLE_MAP[pathname] || {
    title: 'Sabhijude Admin',
    subtitle: 'Administrative control portal',
  };

  return (
    <header className="h-16 border-b border-[#e8e8f0] bg-white/80 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-20 select-none">
      <div>
        <h1 className="text-sm font-bold text-[#16161d]">{meta.title}</h1>
        <p className="text-[11.5px] text-[#5b5b6e]">{meta.subtitle}</p>
      </div>

      <div className="flex items-center gap-4">
        {/* Live status badge */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ecfdf5] border border-[#059669]/20 text-[#059669] text-[11px] font-semibold">
          <Circle size={6} className="fill-[#059669] animate-pulse" />
          <span>Cloud Run API Live</span>
        </div>

        {/* User preview */}
        <div className="flex items-center gap-2 pl-3 border-l border-[#e8e8f0]">
          <div className="h-8 w-8 rounded-[10px] bg-[#f1edff] text-[#6d4aff] flex items-center justify-center font-bold text-xs">
            <Shield size={16} />
          </div>
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-[#16161d]">{admin?.fullName || 'Admin'}</p>
            <p className="text-[10px] text-[#5b5b6e]">{admin?.role || 'SUPER_ADMIN'}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
