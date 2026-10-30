'use client';

import { usePathname } from 'next/navigation';
import { useAdminAuth } from '@/portals/org/lib/auth-context';
import { useOrg } from '@/portals/org/lib/org-context';
import { Shield, Circle, Building2 } from 'lucide-react';

const TITLE_MAP: Record<string, { title: string; subtitle: string }> = {
  '/org/dashboard': {
    title: 'Safety Command Overview',
    subtitle: 'Real-time telemetry, campus incident triage, and responder dispatch',
  },
  '/org/dashboard/members': {
    title: 'Student & Employee Directory',
    subtitle: 'Enrolled members, trusted guardian circles, and safety roster',
  },
  '/org/dashboard/incidents': {
    title: 'Active Crisis & Incident Queue',
    subtitle: 'Real-time SOS emergencies and safety grievances in monitored zones',
  },
  '/org/dashboard/analytics': {
    title: 'Institutional Safety Analytics',
    subtitle: 'Safety indices, recurring hot-spots, and resolution timelines',
  },
  '/org/dashboard/broadcast': {
    title: 'Emergency Advisory Broadcast',
    subtitle: 'Push high-priority safety advisories to students and employees',
  },
  '/org/dashboard/settings': {
    title: 'Zone Management & Settings',
    subtitle: 'Geofenced campus safety perimeters and responder escalation rules',
  },
};

export default function Header() {
  const pathname = usePathname();
  const { admin } = useAdminAuth();
  const { organization, organizations, selectOrganization } = useOrg();

  const meta = TITLE_MAP[pathname] || {
    title: 'Sabhijude Org Command',
    subtitle: 'Institutional safety command console',
  };

  return (
    <header className="h-16 border-b border-[#e8e8f0] bg-white/80 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-20 select-none">
      <div>
        <h1 className="text-sm font-bold text-[#16161d]">{meta.title}</h1>
        <p className="text-[11.5px] text-[#5b5b6e]">{meta.subtitle}</p>
      </div>

      <div className="flex items-center gap-4">
        {/* Active organization switcher */}
        {organization && (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#f1edff] border border-[#6d4aff]/20 text-[11px] text-[#6d4aff]">
            <Building2 size={13} />
            {organizations.length > 1 ? (
              <select
                value={organization.id}
                onChange={(e) => selectOrganization(Number(e.target.value))}
                aria-label="Active organization"
                className="bg-transparent text-[#6d4aff] font-bold outline-none cursor-pointer"
              >
                {organizations.map((o) => (
                  <option key={o.id} value={o.id} className="bg-white text-[#16161d]">
                    {o.name}
                  </option>
                ))}
              </select>
            ) : (
              <span className="font-bold">{organization.name}</span>
            )}
          </div>
        )}

        {/* Live status badge */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ecfdf5] border border-[#059669]/20 text-[#059669] text-[11px] font-semibold">
          <Circle size={6} className="fill-[#059669] animate-pulse" />
          <span>API Connected</span>
        </div>

        {/* User preview */}
        <div className="flex items-center gap-2 pl-3 border-l border-[#e8e8f0]">
          <div className="h-8 w-8 rounded-[10px] bg-[#f1edff] text-[#6d4aff] flex items-center justify-center font-bold text-xs">
            <Shield size={16} />
          </div>
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-[#16161d]">{admin?.fullName || 'Campus Security'}</p>
            <p className="text-[10px] text-[#5b5b6e]">{admin?.role || 'ORGANIZATION_ADMIN'}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
