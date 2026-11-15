'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAdminAuth } from '@/portals/admin/lib/auth-context';
import {
  LayoutDashboard,
  Building2,
  Users,
  ShieldAlert,
  Flag,
  FileText,
  Tags,
  ShieldCheck,
  LogOut,
  ChevronRight,
  Shield,
  LifeBuoy,
  X,
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/admin/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/dashboard/support', label: 'Support & Help Desk', icon: LifeBuoy },
  { href: '/admin/dashboard/organizations', label: 'Organizations & Campuses', icon: Building2 },
  { href: '/admin/dashboard/users', label: 'User Directory', icon: Users },
  { href: '/admin/dashboard/moderation', label: 'Moderation Queue', icon: ShieldAlert },
  { href: '/admin/dashboard/reports', label: 'Safety Reports', icon: Flag },
  { href: '/admin/dashboard/posts', label: 'Community Posts', icon: FileText },
  { href: '/admin/dashboard/categories', label: 'Categories', icon: Tags },
  { href: '/admin/dashboard/admins', label: 'Staff & Roles', icon: ShieldCheck, superAdminOnly: true },
];

/**
 * The admin portal's navigation.
 *
 * From the md breakpoint up it is a fixed column beside the content. Below that it would
 * leave a phone about 120px for the page, so it becomes a drawer instead: hidden until the
 * header's menu button opens it, and closed again on navigation, on the backdrop or on Escape.
 */
export default function Sidebar({ open = false, onClose }: { open?: boolean; onClose?: () => void }) {
  const pathname = usePathname();

  // Navigating closes the drawer.
  useEffect(() => {
    onClose?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose?.();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <>
      <aside className="hidden md:flex w-64 bg-white border-r border-[#e8e8f0] flex-col justify-between shrink-0 select-none sticky top-0 h-screen overflow-hidden">
        <SidebarContent />
      </aside>

      {open && (
        <div className="md:hidden fixed inset-0 z-40" role="dialog" aria-modal="true" aria-label="Navigation">
          <button
            type="button"
            aria-label="Close menu"
            onClick={onClose}
            className="absolute inset-0 bg-black/40"
          />
          <aside className="absolute inset-y-0 left-0 w-72 max-w-[85vw] bg-white flex flex-col justify-between overflow-y-auto shadow-xl select-none">
            <button
              type="button"
              onClick={onClose}
              aria-label="Close menu"
              className="absolute right-3 top-3.5 h-9 w-9 rounded-[10px] flex items-center justify-center text-[#5b5b6e] hover:bg-[#f1f1f6]"
            >
              <X size={18} />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}
    </>
  );
}

function SidebarContent() {
  const pathname = usePathname();
  const { admin, logout } = useAdminAuth();

  const isSuperAdmin = admin?.role === 'SUPER_ADMIN';

  return (
    <>
      <div>
        {/* Brand */}
        <div className="h-16 flex items-center px-6 border-b border-[#e8e8f0] gap-3">
          <img
            src="/logo.webp"
            alt="Sabhijude Logo"
            width={36}
            height={36}
            className="h-9 w-9 object-contain shrink-0 drop-shadow-xs"
          />
          <div>
            <div className="font-black text-sm tracking-tight text-[#16161d] flex items-center gap-1.5">
              Sabhijude
              <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded-full bg-[#f1edff] text-[#6d4aff]">
                Admin
              </span>
            </div>
            <div className="text-[11px] text-[#5b5b6e]">Safety Management</div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-1">
          <div className="px-3 py-2 text-[10px] font-black uppercase tracking-[1px] text-[#9797ab]">
            CONTROL CENTER
          </div>
          {NAV_ITEMS.map((item) => {
            if (item.superAdminOnly && !isSuperAdmin) return null;
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-[12px] text-xs font-semibold transition-colors ${
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
        </nav>
      </div>

      {/* User Footer */}
      <div className="p-3 border-t border-[#e8e8f0]">
        <Link
          href="/"
          className="flex items-center justify-center gap-2 px-3 py-2 mb-2 text-xs font-semibold text-[#5b5b6e] hover:text-[#6d4aff] hover:bg-[#f1edff] rounded-[12px] transition-colors"
        >
          <span>← Back to Community Portal</span>
        </Link>
        <div className="bg-[#f7f7fa] border border-[#e8e8f0] rounded-[14px] p-3 mb-2 flex items-center justify-between">
          <div className="overflow-hidden pr-2">
            <p className="text-xs font-bold text-[#16161d] truncate">
              {admin?.fullName || 'Administrator'}
            </p>
            <p className="text-[11px] text-[#5b5b6e] truncate">{admin?.email}</p>
            <span className="inline-block mt-1 text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full bg-[#f1edff] text-[#6d4aff]">
              {admin?.role || 'ADMIN'}
            </span>
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold text-[#5b5b6e] hover:text-[#e11d48] hover:bg-[#e11d48]/10 rounded-[12px] transition-colors"
        >
          <LogOut size={15} />
          <span>Sign Out</span>
        </button>
      </div>
    </>
  );
}
