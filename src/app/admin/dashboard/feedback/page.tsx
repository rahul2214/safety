'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Bug, CheckCircle2, Eye, Heart, Lightbulb, Loader2, MessageCircle, MessageSquareHeart, RefreshCw, Smartphone, Star, Globe } from 'lucide-react';
import { feedbackApi, type FeedbackItem } from '@/portals/admin/lib/api';

const STATUS_TABS = [
  { value: '', label: 'All' },
  { value: 'NEW', label: 'New' },
  { value: 'REVIEWED', label: 'Reviewed' },
  { value: 'RESOLVED', label: 'Resolved' },
];

const CATEGORY_META: Record<string, { label: string; icon: React.ComponentType<{ size?: number; className?: string }>; cls: string }> = {
  BUG: { label: 'Bug', icon: Bug, cls: 'bg-rose-50 text-rose-700 border-rose-200' },
  IDEA: { label: 'Idea', icon: Lightbulb, cls: 'bg-amber-50 text-amber-800 border-amber-200' },
  PRAISE: { label: 'Praise', icon: Heart, cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  OTHER: { label: 'Other', icon: MessageCircle, cls: 'bg-slate-100 text-slate-700 border-slate-200' },
};

const STATUS_CLS: Record<string, string> = {
  NEW: 'bg-[#f1edff] text-[#6d4aff] border-[#ddd6fe]',
  REVIEWED: 'bg-blue-50 text-blue-700 border-blue-200',
  RESOLVED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

export default function AdminFeedbackPage() {
  const [items, setItems] = useState<FeedbackItem[]>([]);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    const res = await feedbackApi.list(status ? { status } : undefined);
    if (res.ok && res.data) setItems(res.data);
    else setError(res.error?.message || 'Could not load feedback.');
    setLoading(false);
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const setItemStatus = async (item: FeedbackItem, next: string) => {
    setBusyId(item.id);
    const res = await feedbackApi.update(item.id, { status: next });
    setBusyId(null);
    if (res.ok) {
      setItems((list) =>
        status && status !== next
          ? list.filter((i) => i.id !== item.id)
          : list.map((i) => (i.id === item.id ? { ...i, status: next, reviewedAt: new Date().toISOString() } : i))
      );
    } else {
      alert(res.error?.message || 'Could not update this feedback.');
    }
  };

  const stats = useMemo(() => {
    const rated = items.filter((i) => i.rating);
    const avg = rated.length ? rated.reduce((s, i) => s + (i.rating || 0), 0) / rated.length : null;
    return {
      total: items.length,
      newCount: items.filter((i) => i.status === 'NEW').length,
      bugs: items.filter((i) => i.category === 'BUG').length,
      avg,
    };
  }, [items]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-[#e8e8f0] p-6 rounded-[20px] shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-[12px] bg-[#f1edff] text-[#6d4aff] flex items-center justify-center">
              <MessageSquareHeart size={20} />
            </div>
            <h1 className="text-xl font-black text-[#16161d] tracking-tight">User Feedback</h1>
          </div>
          <p className="text-xs text-[#5b5b6e] mt-1.5">Ratings, bug reports and ideas sent from the mobile app and the website.</p>
        </div>
        <button
          onClick={() => void load()}
          className="p-2.5 rounded-[12px] bg-white hover:bg-[#f7f7fa] text-[#5b5b6e] border border-[#e8e8f0]"
          title="Refresh"
        >
          <RefreshCw size={15} className={loading ? 'animate-spin text-[#6d4aff]' : ''} />
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Stat label="Showing" value={stats.total} />
        <Stat label="New" value={stats.newCount} accent="text-[#6d4aff]" />
        <Stat label="Bug reports" value={stats.bugs} accent="text-rose-600" />
        <Stat label="Average rating" value={stats.avg ? `${stats.avg.toFixed(1)} ★` : '—'} accent="text-amber-600" />
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto">
        {STATUS_TABS.map((t) => (
          <button
            key={t.value}
            onClick={() => setStatus(t.value)}
            className={`px-3.5 py-1.5 rounded-[12px] text-xs font-semibold whitespace-nowrap border ${
              status === t.value
                ? 'bg-[#f1edff] text-[#6d4aff] border-[#ddd6fe]'
                : 'bg-white text-[#5b5b6e] border-[#e8e8f0] hover:text-[#16161d]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {error && <div className="p-3 rounded-[12px] bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">{error}</div>}

      {loading ? (
        <div className="py-16 flex items-center justify-center gap-2 text-xs text-[#5b5b6e]">
          <Loader2 size={16} className="animate-spin text-[#6d4aff]" /> Loading feedback…
        </div>
      ) : items.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-[#e8e8f0] rounded-[20px] bg-white">
          <MessageSquareHeart size={30} className="mx-auto text-[#9797ab] mb-2" />
          <p className="text-sm font-bold text-[#16161d]">No feedback here yet</p>
          <p className="text-xs text-[#5b5b6e] mt-1">Feedback from the app and website appears here as it arrives.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => {
            const cat = CATEGORY_META[item.category] ?? CATEGORY_META.OTHER;
            return (
              <div key={item.id} className="bg-white border border-[#e8e8f0] rounded-[18px] p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${cat.cls}`}>
                    <cat.icon size={12} /> {cat.label}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${STATUS_CLS[item.status] ?? STATUS_CLS.NEW}`}>
                    {item.status}
                  </span>
                  {item.rating ? (
                    <span className="inline-flex items-center gap-0.5 text-amber-500">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={13} className={i < (item.rating ?? 0) ? 'fill-amber-400' : 'text-slate-300'} />
                      ))}
                    </span>
                  ) : null}
                  <span className="ml-auto inline-flex items-center gap-1 text-[11px] text-[#747488]">
                    {item.platform === 'WEB' ? <Globe size={12} /> : <Smartphone size={12} />}
                    {item.platform}
                    {item.appVersion ? ` · v${item.appVersion}` : ''} · {new Date(item.createdAt).toLocaleString()}
                  </span>
                </div>

                <p className="mt-3 text-sm text-[#16161d] whitespace-pre-wrap break-words">{item.message}</p>

                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-[#5b5b6e]">
                  <span>
                    From <span className="font-semibold text-[#16161d]">{item.senderName || 'Visitor'}</span>
                    {item.senderEmail ? <> · <a className="text-[#6d4aff] hover:underline" href={`mailto:${item.senderEmail}`}>{item.senderEmail}</a></> : null}
                  </span>
                  <div className="ml-auto flex gap-2">
                    {item.status !== 'REVIEWED' && item.status !== 'RESOLVED' && (
                      <button
                        disabled={busyId === item.id}
                        onClick={() => void setItemStatus(item, 'REVIEWED')}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-[10px] border border-[#e8e8f0] bg-white hover:bg-[#f7f7fa] font-semibold text-[#16161d] disabled:opacity-50"
                      >
                        <Eye size={13} /> Mark reviewed
                      </button>
                    )}
                    {item.status !== 'RESOLVED' && (
                      <button
                        disabled={busyId === item.id}
                        onClick={() => void setItemStatus(item, 'RESOLVED')}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-[10px] bg-[#6d4aff] hover:bg-[#5325e8] text-white font-semibold disabled:opacity-50"
                      >
                        <CheckCircle2 size={13} /> Resolve
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, accent = 'text-[#16161d]' }: { label: string; value: React.ReactNode; accent?: string }) {
  return (
    <div className="bg-white border border-[#e8e8f0] p-4 rounded-[16px]">
      <div className="text-[11px] font-bold text-[#747488] uppercase tracking-wider">{label}</div>
      <div className={`text-2xl font-black mt-1 ${accent}`}>{value}</div>
    </div>
  );
}
