'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Ban, Flag, MoreVertical } from 'lucide-react';

/**
 * The "⋮" menu on someone else's comment or reply: Report, and — unless the author is shown
 * anonymously — Block and Report & block.
 */
export function ContentMenu({
  noun,
  displayName,
  canBlock,
  onReport,
  onBlock,
  onReportAndBlock,
  size = 'md',
}: {
  /** "comment" or "reply", for the labels. */
  noun: string;
  displayName: string;
  canBlock: boolean;
  onReport: () => void;
  onBlock: () => void;
  onReportAndBlock: () => void;
  size?: 'sm' | 'md';
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on a click elsewhere or Escape.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const choose = (fn: () => void) => () => {
    setOpen(false);
    fn();
  };

  const item = 'flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm font-medium transition cursor-pointer';

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`${noun === 'reply' ? 'Reply' : 'Comment'} options`}
        className={`rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer ${size === 'sm' ? 'p-1' : 'p-1.5'}`}
      >
        <MoreVertical className={size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4'} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-20 mt-1 w-52 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg"
        >
          <button type="button" role="menuitem" onClick={choose(onReport)} className={`${item} text-ink hover:bg-slate-50`}>
            <Flag className="h-4 w-4 text-slate-500" /> Report {noun}
          </button>
          {canBlock && (
            <>
              <button type="button" role="menuitem" onClick={choose(onBlock)} className={`${item} text-red-600 hover:bg-red-50`}>
                <Ban className="h-4 w-4" /> <span className="truncate">Block {displayName}</span>
              </button>
              <button type="button" role="menuitem" onClick={choose(onReportAndBlock)} className={`${item} text-red-600 hover:bg-red-50`}>
                <Flag className="h-4 w-4 fill-red-600" /> Report &amp; block
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
