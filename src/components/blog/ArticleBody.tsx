import React from 'react';
import Link from 'next/link';
import { AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import { headingId, type Block } from '@/lib/blog-posts';

/**
 * Renders the two inline marks the articles use: [label](href) and **bold**. Internal links use
 * Next's Link; external links open in a new tab and send no referrer details.
 */
export function Inline({ text }: { text: string }) {
  const parts: React.ReactNode[] = [];
  const re = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let k = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    if (m[3] !== undefined) {
      parts.push(<strong key={k++} className="font-semibold text-ink">{m[3]}</strong>);
    } else {
      const [label, href] = [m[1], m[2]];
      const cls = 'font-medium text-brand underline decoration-brand/30 underline-offset-[3px] hover:decoration-brand';
      parts.push(
        href.startsWith('/') ? (
          <Link key={k++} href={href} className={cls}>{label}</Link>
        ) : (
          <a key={k++} href={href} target="_blank" rel="noopener noreferrer" className={cls}>{label}</a>
        ),
      );
    }
    last = re.lastIndex;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <>{parts}</>;
}

/** Renders a blog article's blocks with the site's typography. Server component. */
export function ArticleBody({ blocks }: { blocks: Block[] }) {
  return (
    <div className="space-y-6 text-[17px] leading-[1.75] text-slate-700">
      {blocks.map((b, i) => {
        switch (b.type) {
          case 'p':
            return <p key={i}><Inline text={b.text} /></p>;
          case 'h2':
            return (
              <h2 key={i} id={headingId(b)} className="font-display text-2xl sm:text-[1.7rem] font-bold tracking-tight text-ink pt-6 scroll-mt-24">
                <Inline text={b.text} />
              </h2>
            );
          case 'h3':
            return <h3 key={i} className="font-display text-xl font-bold text-ink pt-2">{b.text}</h3>;
          case 'ul':
            return (
              <ul key={i} className="space-y-3">
                {b.items.map((it) => (
                  <li key={it} className="flex gap-3">
                    <span aria-hidden className="mt-[0.7em] h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                    <span><Inline text={it} /></span>
                  </li>
                ))}
              </ul>
            );
          case 'ol':
            return (
              <ol key={i} className="space-y-4">
                {b.items.map((it, n) => (
                  <li key={it} className="flex gap-4">
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ink text-[13px] font-bold text-white">{n + 1}</span>
                    <span><Inline text={it} /></span>
                  </li>
                ))}
              </ol>
            );
          case 'callout': {
            const tone = {
              info: { box: 'bg-brand-tint border-brand/15', icon: <Info className="h-5 w-5 text-brand" />, title: 'text-brand-deep' },
              warn: { box: 'bg-amber-50 border-amber-200', icon: <AlertTriangle className="h-5 w-5 text-amber-600" />, title: 'text-amber-900' },
              success: { box: 'bg-emerald-50 border-emerald-200', icon: <CheckCircle2 className="h-5 w-5 text-emerald-600" />, title: 'text-emerald-900' },
            }[b.tone];
            return (
              <aside key={i} className={`flex gap-4 rounded-2xl border p-5 sm:p-6 ${tone.box}`}>
                <span className="mt-0.5 shrink-0">{tone.icon}</span>
                <div className="space-y-1.5">
                  <p className={`font-semibold ${tone.title}`}>{b.title}</p>
                  <p className="text-[15.5px] leading-relaxed text-slate-700"><Inline text={b.text} /></p>
                </div>
              </aside>
            );
          }
          case 'quote':
            return (
              <blockquote key={i} className="border-l-4 border-coral pl-5 sm:pl-6 py-1 font-display text-xl sm:text-2xl font-semibold leading-snug text-ink">
                “{b.text}”
                {b.cite && <footer className="mt-2 text-sm font-medium text-slate-500">{b.cite}</footer>}
              </blockquote>
            );
          case 'table':
            return (
              <figure key={i} className="space-y-2">
                <div className="overflow-x-auto rounded-2xl border border-slate-200">
                  <table className="w-full min-w-[480px] text-left text-[15px]">
                    <thead className="bg-mist">
                      <tr>
                        {b.head.map((h) => (
                          <th key={h} scope="col" className="px-4 py-3 font-semibold text-ink">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {b.rows.map((r) => (
                        <tr key={r.join('|')}>
                          {r.map((c, k) => (
                            <td key={k} className={`px-4 py-3 align-top ${k === 0 ? 'font-semibold text-ink whitespace-nowrap' : ''}`}><Inline text={c} /></td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {b.caption && <figcaption className="text-sm text-slate-500"><Inline text={b.caption} /></figcaption>}
              </figure>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
