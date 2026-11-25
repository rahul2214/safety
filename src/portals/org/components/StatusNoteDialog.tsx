'use client';

import React, { useEffect, useRef, useState } from 'react';
import { CheckCircle2, Eye, RefreshCw, X } from 'lucide-react';

const COPY: Record<string, { title: string; action: string; placeholder: string; tone: string; icon: React.ReactNode }> = {
  INVESTIGATING: {
    title: 'Mark as under investigation',
    action: 'Mark investigating',
    placeholder: 'e.g. Security is checking the North Gate cameras today.',
    tone: 'bg-amber-500 hover:bg-amber-600',
    icon: <Eye size={14} />,
  },
  RESOLVED: {
    title: 'Mark as resolved',
    action: 'Mark resolved',
    placeholder: 'e.g. The lights near the hostel were repaired on 26 Nov.',
    tone: 'bg-[#059669] hover:bg-[#047857]',
    icon: <CheckCircle2 size={14} />,
  },
};

/**
 * Asks for a note whenever an admin changes an incident's status. On an incident opened from a
 * member's post, members of the organisation see this note on the post (under the
 * organisation's name, not the admin's).
 */
export function StatusNoteDialog({
  status,
  isSharedPost,
  saving,
  onCancel,
  onConfirm,
}: {
  /** The status being set; the dialog is closed while this is null. */
  status: string | null;
  isSharedPost: boolean;
  saving: boolean;
  onCancel: () => void;
  onConfirm: (note: string) => void;
}) {
  const [note, setNote] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);
  // Kept in a ref so a parent re-render (new callback) does not reset what the admin is typing.
  const cancelRef = useRef(onCancel);
  cancelRef.current = onCancel;

  useEffect(() => {
    if (!status) return;
    setNote('');
    const t = setTimeout(() => inputRef.current?.focus(), 30);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') cancelRef.current();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      clearTimeout(t);
      window.removeEventListener('keydown', onKey);
    };
  }, [status]);

  if (!status) return null;

  const copy = COPY[status] ?? {
    title: 'Update status',
    action: 'Save',
    placeholder: 'Add a note',
    tone: 'bg-[#16161d] hover:bg-black',
    icon: <RefreshCw size={14} />,
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!saving) onConfirm(note.trim());
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="status-note-title">
      <button aria-label="Cancel" onClick={onCancel} className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />
      <form onSubmit={submit} className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl border border-[#e8e8f0] p-5 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 id="status-note-title" className="text-base font-bold text-[#16161d]">{copy.title}</h2>
            <p className="text-xs text-[#5b5b6e] mt-1">
              {isSharedPost
                ? 'Add a note about what was done. Members of your organisation see it on the post, under your organisation\'s name.'
                : 'Add a note about what was done. It is saved on this incident.'}
            </p>
          </div>
          <button type="button" onClick={onCancel} aria-label="Close" className="p-1.5 rounded-lg hover:bg-[#f1f1f6] text-[#5b5b6e]">
            <X size={16} />
          </button>
        </div>

        <div>
          <label htmlFor="status-note" className="block text-[11px] font-semibold text-[#3f3f4e] mb-1">
            Note (optional)
          </label>
          <textarea
            id="status-note"
            ref={inputRef}
            rows={3}
            maxLength={1000}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) submit(e);
            }}
            placeholder={copy.placeholder}
            className="w-full rounded-xl border border-[#e8e8f0] bg-[#f7f7fa] px-3 py-2.5 text-sm text-[#16161d] placeholder-[#9797ab] focus:outline-none focus:border-rose-500 focus:bg-white resize-none"
          />
          {!note.trim() && (
            <p className="text-[11px] text-[#747488] mt-1">Without a note, members see only the new status{isSharedPost ? ' and your last note' : ''}.</p>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <button type="button" onClick={onCancel} className="px-4 py-2 rounded-xl border border-[#e8e8f0] text-xs font-semibold text-[#3f3f4e] hover:bg-[#f1f1f6]">
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className={`px-4 py-2 rounded-xl text-white text-xs font-bold inline-flex items-center gap-1.5 disabled:opacity-60 ${copy.tone}`}
          >
            {saving ? <RefreshCw size={14} className="animate-spin" /> : copy.icon}
            {copy.action}
          </button>
        </div>
      </form>
    </div>
  );
}
