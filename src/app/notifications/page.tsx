'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import {
  Bell,
  CheckCheck,
  ShieldAlert,
  MessageCircle,
  Heart,
  Users,
  CheckCircle2,
  Building,
  Droplet,
  ChevronRight,
  WifiOff,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { NotificationSkeleton } from '@/components/ui/Skeleton';
import { useAuth } from '@/lib/auth-context';
import { api, type NotificationItem } from '@/lib/api-client';

type Filter = 'all' | 'unread';
type Bucket = 'Today' | 'Yesterday' | 'Earlier';

/** One icon and one tint per kind of alert. */
function visualFor(type: string = ''): { Icon: React.ElementType; tint: string } {
  const t = type.toUpperCase();
  if (t.includes('BLOOD')) return { Icon: Droplet, tint: 'bg-red-50 text-red-600' };
  if (t.includes('SOS') || t.includes('EMERGENCY')) return { Icon: ShieldAlert, tint: 'bg-red-50 text-red-600' };
  if (t.includes('SUPPORT')) return { Icon: Heart, tint: 'bg-rose-50 text-rose-600' };
  if (t.includes('SOLUTION') || t.includes('COMMENT') || t.includes('REPLY')) {
    return { Icon: MessageCircle, tint: 'bg-blue-50 text-blue-600' };
  }
  if (t.includes('RESOLVE')) return { Icon: CheckCircle2, tint: 'bg-emerald-50 text-emerald-600' };
  if (t.includes('SIMILAR') || t.includes('FACED')) return { Icon: Users, tint: 'bg-violet-50 text-violet-600' };
  if (t.includes('ORG') || t.includes('BROADCAST')) return { Icon: Building, tint: 'bg-amber-50 text-amber-700' };
  return { Icon: Bell, tint: 'bg-slate-100 text-slate-500' };
}

function bucketFor(iso?: string): Bucket {
  if (!iso) return 'Earlier';
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return 'Earlier';
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  if (then >= startOfToday.getTime()) return 'Today';
  if (then >= startOfToday.getTime() - 24 * 3600 * 1000) return 'Yesterday';
  return 'Earlier';
}

export default function NotificationsPage() {
  const { isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [filter, setFilter] = useState<Filter>('all');

  const loadNotifications = useCallback(async () => {
    setLoading(true);
    setFailed(false);
    try {
      const res = await api.getNotifications(true);
      if (res.ok && Array.isArray(res.data)) setNotifications(res.data);
      else setFailed(true);
    } catch {
      setFailed(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadNotifications();
  }, [isAuthenticated, loadNotifications]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    void api.markAllNotificationsRead().catch(() => {});
  };

  const markRead = (item: NotificationItem) => {
    if (item.isRead) return;
    setNotifications((prev) => prev.map((n) => (n.id === item.id ? { ...n, isRead: true } : n)));
    void api.markNotificationRead(item.id).catch(() => {});
  };

  const sections = useMemo(() => {
    const visible = filter === 'unread' ? notifications.filter((n) => !n.isRead) : notifications;
    return (['Today', 'Yesterday', 'Earlier'] as Bucket[])
      .map((title) => ({ title, items: visible.filter((n) => bucketFor(n.createdAt) === title) }))
      .filter((s) => s.items.length > 0);
  }, [notifications, filter]);

  const filters: { key: Filter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'unread', label: unreadCount > 0 ? `Unread · ${unreadCount}` : 'Unread' },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-extrabold tracking-[-0.02em] text-ink">Alerts</h1>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={markAllRead}>
            <CheckCheck className="h-3.5 w-3.5 mr-1" />
            <span>Mark all read</span>
          </Button>
        )}
      </div>

      {/* Filter */}
      <div className="flex gap-1.5" role="tablist" aria-label="Filter alerts">
        {filters.map((f) => {
          const active = filter === f.key;
          return (
            <button
              key={f.key}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setFilter(f.key)}
              className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                active ? 'border-ink bg-ink text-white' : 'border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden divide-y divide-slate-100">
          {[1, 2, 3, 4].map((i) => (
            <NotificationSkeleton key={i} />
          ))}
        </div>
      ) : failed ? (
        <div className="rounded-xl border border-slate-200 bg-white px-6 py-10 text-center">
          <WifiOff className="h-6 w-6 text-slate-300 mx-auto" />
          <p className="mt-2 text-sm font-semibold text-ink">Could not load alerts</p>
          <p className="mt-0.5 text-xs text-slate-500">Check your connection and try again.</p>
          <Button variant="outline" size="sm" onClick={loadNotifications} className="mt-4">
            Retry
          </Button>
        </div>
      ) : sections.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white px-6 py-10 text-center">
          <Bell className="h-6 w-6 text-slate-300 mx-auto" />
          <p className="mt-2 text-sm font-semibold text-ink">
            {filter === 'unread' ? "You're all caught up" : 'No alerts yet'}
          </p>
          <p className="mt-0.5 text-xs text-slate-500">
            {filter === 'unread'
              ? 'There is nothing unread.'
              : 'Replies, support and updates on your reports will appear here.'}
          </p>
        </div>
      ) : (
        sections.map((section) => (
          <section key={section.title}>
            <h2 className="mb-1.5 ml-0.5 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              {section.title}
            </h2>
            <ul className="rounded-xl border border-slate-200 bg-white overflow-hidden divide-y divide-slate-100">
              {section.items.map((item) => {
                const { Icon, tint } = visualFor(item.type);
                const rowClass = `flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors ${
                  item.isRead ? 'hover:bg-slate-50' : 'bg-blue-50/50 hover:bg-blue-50'
                }`;
                const content = (
                  <>
                    <span className={`h-9 w-9 shrink-0 rounded-lg flex items-center justify-center ${tint}`}>
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="flex items-baseline gap-2">
                        <span className={`flex-1 truncate text-sm text-ink ${item.isRead ? 'font-medium' : 'font-bold'}`}>
                          {item.title}
                        </span>
                        <span className="shrink-0 text-[11px] text-slate-400">{item.timeAgo}</span>
                      </span>
                      {item.body && <span className="block text-xs leading-snug text-slate-500 line-clamp-2">{item.body}</span>}
                    </span>
                    {!item.isRead ? (
                      <span className="h-2 w-2 shrink-0 rounded-full bg-blue-600" aria-label="Unread" />
                    ) : item.link ? (
                      <ChevronRight className="h-4 w-4 shrink-0 text-slate-300" />
                    ) : (
                      <span className="w-2 shrink-0" />
                    )}
                  </>
                );

                return (
                  <li key={item.id}>
                    {item.link ? (
                      <Link href={item.link} onClick={() => markRead(item)} className={rowClass}>
                        {content}
                      </Link>
                    ) : (
                      <button type="button" onClick={() => markRead(item)} className={rowClass}>
                        {content}
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        ))
      )}
    </div>
  );
}
