import React from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/** Page 1 lives at the base path; later pages at <base>/page/<n>. */
export function pageHref(basePath: string, page: number): string {
  return page <= 1 ? basePath : `${basePath}/page/${page}`;
}

/** Page numbers to show: always the first and last, the current one and its neighbours, with gaps as "…". */
function pageList(current: number, total: number): Array<number | 'gap'> {
  const wanted = new Set([1, total, current - 1, current, current + 1].filter((n) => n >= 1 && n <= total));
  const sorted = [...wanted].sort((a, b) => a - b);
  const out: Array<number | 'gap'> = [];
  sorted.forEach((n, i) => {
    if (i > 0 && n - sorted[i - 1] > 1) out.push('gap');
    out.push(n);
  });
  return out;
}

/**
 * Previous / numbers / Next. Plain links, so every page is crawlable and works without
 * JavaScript. Renders nothing when everything fits on one page.
 */
export function Pagination({ current, total, basePath }: { current: number; total: number; basePath: string }) {
  if (total <= 1) return null;

  const edge =
    'inline-flex h-11 min-w-11 items-center justify-center gap-1.5 rounded-full border px-3 sm:px-4 text-sm font-semibold transition';
  const on = 'border-slate-200 bg-white text-ink hover:border-ink/40 hover:bg-slate-50';
  const off = 'pointer-events-none border-slate-100 bg-slate-50 text-slate-300';

  return (
    <nav aria-label="Blog pages" className="flex items-center justify-center gap-1.5 sm:gap-2 pt-4">
      {current > 1 ? (
        <Link href={pageHref(basePath, current - 1)} rel="prev" className={`${edge} ${on}`}>
          <ChevronLeft className="h-4 w-4" /><span className="sr-only sm:not-sr-only">Previous</span>
        </Link>
      ) : (
        <span aria-disabled="true" className={`${edge} ${off}`}>
          <ChevronLeft className="h-4 w-4" /><span className="sr-only sm:not-sr-only">Previous</span>
        </span>
      )}

      <ol className="flex items-center gap-0.5 sm:gap-1.5">
        {pageList(current, total).map((n, i) =>
          n === 'gap' ? (
            <li key={`gap-${i}`} aria-hidden className="w-6 text-center text-slate-400">…</li>
          ) : (
            <li key={n}>
              <Link
                href={pageHref(basePath, n)}
                aria-label={`Page ${n}`}
                aria-current={n === current ? 'page' : undefined}
                className={`flex h-11 min-w-10 sm:min-w-11 items-center justify-center rounded-full px-2.5 sm:px-3 text-sm font-semibold transition ${
                  n === current ? 'bg-ink text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-ink'
                }`}
              >
                {n}
              </Link>
            </li>
          ),
        )}
      </ol>

      {current < total ? (
        <Link href={pageHref(basePath, current + 1)} rel="next" className={`${edge} ${on}`}>
          <span className="sr-only sm:not-sr-only">Next</span><ChevronRight className="h-4 w-4" />
        </Link>
      ) : (
        <span aria-disabled="true" className={`${edge} ${off}`}>
          <span className="sr-only sm:not-sr-only">Next</span><ChevronRight className="h-4 w-4" />
        </span>
      )}
    </nav>
  );
}
