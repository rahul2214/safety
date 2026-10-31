'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Bell,
  CheckCheck,
  ShieldAlert,
  FileText,
  Users,
  Building,
  Info,
  ArrowLeft,
  Clock,
  Lock,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { NotificationSkeleton } from '@/components/ui/Skeleton';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api-client';

export type NotificationCategory = 'Safety' | 'Reports' | 'Trusted Contacts' | 'Organization' | 'System';

interface PortalNotification {
  id: string;
  category: NotificationCategory;
  title: string;
  message: string;
  timeAgo: string;
  isRead: boolean;
  linkHref?: string;
}

const DEFAULT_PORTAL_NOTIFICATIONS: PortalNotification[] = [
  {
    id: 'n-welcome',
    category: 'System',
    title: 'Welcome to Sabhijude Safety Network',
    message: 'Your personal safety account is active. One-tap Emergency SOS, live location tracking, and fake call exits are ready to protect you.',
    timeAgo: 'Just now',
    isRead: false,
    linkHref: '/emergency',
  },
  {
    id: 'n-contacts',
    category: 'Trusted Contacts',
    title: 'Action Recommended: Set Up Emergency Circle',
    message: 'Add at least 1 trusted emergency contact to receive automated distress messages with your live GPS location during an emergency.',
    timeAgo: '15 min ago',
    isRead: false,
    linkHref: '/contacts',
  },
  {
    id: 'n-fakecall',
    category: 'Safety',
    title: 'Discreet Exit: Try a Practice Fake Call',
    message: 'Test how incoming fake caller audio and countdown work so you can exit uncomfortable or risky situations smoothly.',
    timeAgo: '1 hour ago',
    isRead: true,
  },
];

const mapTypeToCategory = (type: string = ''): NotificationCategory => {
  const t = type.toUpperCase();
  if (t.includes('SAFETY') || t.includes('SUPPORT') || t.includes('ALERT') || t.includes('SOS')) return 'Safety';
  if (t.includes('SOLUTION') || t.includes('POST') || t.includes('REPORT') || t.includes('RESOLVED')) return 'Reports';
  if (t.includes('SIMILAR') || t.includes('CONTACT') || t.includes('CIRCLE')) return 'Trusted Contacts';
  if (t.includes('ORG') || t.includes('BROADCAST') || t.includes('CAMPUS')) return 'Organization';
  return 'System';
};

export default function NotificationsPage() {
  const { isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState<PortalNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  // Categories list
  const categories = ['All', 'Safety', 'Reports', 'Trusted Contacts', 'Organization', 'System'];

  const loadNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getNotifications(true);
      if (res.ok && res.data && Array.isArray(res.data) && res.data.length > 0) {
        const mapped: PortalNotification[] = res.data.map((item: any) => ({
          id: item.id?.toString() || `n-${Math.random()}`,
          category: mapTypeToCategory(item.type),
          title: item.title || 'Notification',
          message: item.body || item.message || '',
          timeAgo: item.timeAgo || (item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Recently'),
          isRead: Boolean(item.isRead),
          linkHref: item.link || (item.referenceType === 'CONTACTS' ? '/contacts' : item.referenceId ? `/feed` : undefined),
        }));
        setNotifications(mapped);
      } else {
        // Fallback to initial system notices if user has no notification rows yet
        setNotifications(DEFAULT_PORTAL_NOTIFICATIONS);
      }
    } catch (err: any) {
      console.warn('Error fetching notifications:', err);
      setNotifications(DEFAULT_PORTAL_NOTIFICATIONS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, [isAuthenticated]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    try {
      api.markAllNotificationsRead();
    } catch {
      // Local fallback
    }
  };

  const markSingleRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const filteredNotifications = notifications.filter((n) => {
    if (activeCategory === 'All') return true;
    return n.category === activeCategory;
  });

  const getCategoryIcon = (cat: NotificationCategory) => {
    switch (cat) {
      case 'Safety':
        return <ShieldAlert className="h-4 w-4 text-red-600" />;
      case 'Reports':
        return <FileText className="h-4 w-4 text-blue-600" />;
      case 'Trusted Contacts':
        return <Users className="h-4 w-4 text-emerald-600" />;
      case 'Organization':
        return <Building className="h-4 w-4 text-purple-600" />;
      case 'System':
      default:
        return <Info className="h-4 w-4 text-slate-500" />;
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-[-0.02em] text-ink">Notifications</h1>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-coral/10 text-coral text-xs font-bold">
                {unreadCount} unread
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">Real-time alerts, safety advisories, and community solutions.</p>
        </div>

        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={markAllRead}>
            <CheckCheck className="h-3.5 w-3.5 mr-1" />
            <span>Mark All as Read</span>
          </Button>
        )}
      </div>

     

      {/* Error state */}
      {error && (
        <Card className="p-8 text-center bg-red-50 border-red-200 space-y-3">
          <ShieldAlert className="h-8 w-8 text-red-600 mx-auto" />
          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="text-sm font-bold text-red-900">Backend Connection Error</h3>
            <p className="text-xs text-red-700">{error}</p>
          </div>
          <Button variant="outline" size="sm" onClick={loadNotifications} className="border-red-300 text-red-700 hover:bg-red-100">
            Retry Connection
          </Button>
        </Card>
      )}

      {/* Loading state */}
      {loading && !error && (
        <Card className="p-0 overflow-hidden divide-y divide-slate-100">
          {[1, 2, 3, 4].map((i) => (
            <NotificationSkeleton key={i} />
          ))}
        </Card>
      )}

      {/* Notifications List */}
      {!loading && !error && (
        <Card className="p-0 overflow-hidden divide-y divide-slate-100">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((item) => (
              <div
                key={item.id}
                onClick={() => markSingleRead(item.id)}
                className={`p-4 flex items-start justify-between gap-3.5 cursor-pointer transition-colors ${!item.isRead ? 'bg-blue-50/40 hover:bg-blue-50/70' : 'bg-white hover:bg-slate-50'
                  }`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-slate-100 shrink-0 mt-0.5">
                    {getCategoryIcon(item.category)}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        {item.category}
                      </span>
                      <span className="text-slate-300">&bull;</span>
                      <span className="text-[11px] text-slate-400">{item.timeAgo}</span>
                    </div>

                    <h3 className="text-xs font-bold text-slate-900 leading-snug">
                      {item.title}
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed max-w-xl">
                      {item.message}
                    </p>

                    {item.linkHref && (
                      <div className="pt-1">
                        <Link
                          href={item.linkHref}
                          className="text-xs font-semibold text-blue-600 hover:underline inline-flex items-center gap-1"
                        >
                          <span>Inspect in portal</span>
                          <ChevronRight className="h-3 w-3" />
                        </Link>
                      </div>
                    )}
                  </div>
                </div>

                {!item.isRead && (
                  <div
                    className="w-2 h-2 rounded-full bg-blue-600 shrink-0 mt-2"
                    title="Unread notification"
                  />
                )}
              </div>
            ))
          ) : (
            <div className="p-10 text-center space-y-2 text-xs text-slate-500">
              <Bell className="h-6 w-6 text-slate-300 mx-auto" />
              <p className="font-bold text-slate-800">No notifications in this category</p>
              <p>You have reviewed all relevant notices and audit logs from the database.</p>
            </div>
          )}
        </Card>
      )}

      {/* Privacy Footnote */}
      <div className="flex items-center justify-center gap-1.5 text-center text-xs text-slate-400 pt-2">
        <Lock className="h-3.5 w-3.5 text-slate-400" />
        <span>Safety alerts and case updates are stored in your encrypted personal audit trail.</span>
      </div>
    </div>
  );
}
