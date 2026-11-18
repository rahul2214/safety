import React from 'react';
import { CheckCircle2, MapPin, Navigation, Phone, Share2 } from 'lucide-react';

/**
 * A stylised "request reaching people nearby" illustration: a map with rings around a
 * hospital pin, the real "Near you" request card on top, and the shared message below.
 * Wording and layout mirror the real app screens. Server component, no client JS.
 */
export function RequestShowcaseVisual({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`relative mx-auto w-full ${compact ? 'max-w-[440px]' : 'max-w-[520px]'}`}>
      {/* map */}
      <div className="relative aspect-square overflow-hidden rounded-[2rem] border border-slate-200 bg-[#f3f6fb] shadow-[0_30px_80px_-30px_rgba(11,22,48,0.35)]">
        <svg aria-hidden viewBox="0 0 400 400" className="absolute inset-0 h-full w-full">
          <path d="M-20 300 C 80 270, 160 340, 260 300 S 420 290, 440 260" stroke="#d6e6fa" strokeWidth="34" fill="none" />
          {[
            'M0 120 L400 105', 'M0 210 L400 225', 'M0 330 L400 318', 'M90 0 L110 400', 'M205 0 L195 400', 'M310 0 L322 400', 'M0 60 L205 70',
          ].map((d, i) => (
            <g key={d}>
              <path d={d} stroke="#dde5f1" strokeWidth={i < 3 ? 15 : 11} />
              <path d={d} stroke="#ffffff" strokeWidth={i < 3 ? 11 : 7} />
            </g>
          ))}
          {[[30, 20], [140, 30], [250, 40], [30, 150], [140, 150], [250, 150], [345, 150], [30, 250], [250, 250], [345, 40]].map(([x, y]) => (
            <rect key={`${x}-${y}`} x={x} y={y} width="44" height="34" rx="6" fill="#e6ecf6" />
          ))}
          {/* paths to people nearby */}
          {[
            'M200 215 L200 105 L110 108', 'M200 215 L322 222 L318 120', 'M200 215 L110 212 L104 320', 'M200 215 L196 320 L300 318',
          ].map((d) => (
            <path key={d} d={d} stroke="#1d5bd8" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.85" />
          ))}
          {[[110, 108], [318, 120], [104, 320], [300, 318]].map(([x, y]) => (
            <g key={`${x}${y}`}>
              <circle cx={x} cy={y} r="13" fill="#1d5bd8" opacity="0.15" />
              <circle cx={x} cy={y} r="7" fill="#1d5bd8" />
              <circle cx={x} cy={y} r="3.5" fill="#fff" />
            </g>
          ))}
          <circle cx="200" cy="215" r="150" fill="#1d5bd8" opacity="0.05" stroke="#1d5bd8" strokeOpacity="0.25" strokeWidth="2" strokeDasharray="4 7" />
        </svg>
        {/* hospital pin */}
        <div className="absolute left-1/2 top-[53.75%] -translate-x-1/2 -translate-y-full">
          <span className="absolute left-1/2 top-[70%] h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500/30 animate-ring" />
          <svg viewBox="0 0 30 40" className="relative h-11 w-8 drop-shadow-md">
            <path d="M15 40 C 4 26, 0 20, 0 14 a15 15 0 0 1 30 0 c0 6 -4 12 -15 26Z" fill="#e11d48" />
            <circle cx="15" cy="14" r="5.5" fill="#fff" />
          </svg>
        </div>
        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold text-slate-600 shadow-sm">About 25 km around the hospital</span>
      </div>

      {/* the request card, as it appears in "Near you" */}
      <div className={`absolute ${compact ? '-left-3 sm:-left-8 top-[8%]' : '-left-4 sm:-left-10 top-[6%]'} w-[78%] max-w-[330px] rounded-2xl border border-red-200 bg-white p-4 shadow-[0_24px_48px_-20px_rgba(11,22,48,0.45)] animate-float`}>
        <div className="flex items-center gap-3">
          <span className="flex h-11 min-w-11 items-center justify-center rounded-xl bg-red-50 px-2 text-sm font-extrabold text-red-600">O+</span>
          <div className="min-w-0">
            <p className="truncate text-[15px] font-semibold text-ink">Blood needed · 2 units (~900 ml)</p>
            <p className="truncate text-xs font-semibold text-red-600">1.2 km away · 5 min ago</p>
          </div>
        </div>
        <p className="mt-2.5 flex items-center gap-1.5 text-[13px] text-slate-600"><MapPin className="h-3.5 w-3.5 text-slate-400" /> City Hospital, blood bank</p>
        <div className="mt-3 grid grid-cols-3 gap-2">
          <span className="inline-flex items-center justify-center gap-1 rounded-lg bg-red-600 py-2 text-[11px] font-bold text-white"><Phone className="h-3 w-3" /> Call</span>
          <span className="inline-flex items-center justify-center gap-1 rounded-lg border border-slate-200 py-2 text-[11px] font-bold text-ink"><Navigation className="h-3 w-3" /> Directions</span>
          <span className="inline-flex items-center justify-center gap-1 rounded-lg border border-slate-200 py-2 text-[11px] font-bold text-ink"><Share2 className="h-3 w-3" /> Share</span>
        </div>
      </div>

      {/* the shared message */}
      <div className={`absolute -right-3 sm:-right-8 ${compact ? 'bottom-[-6%]' : 'bottom-[-5%]'} w-[70%] max-w-[300px] rounded-2xl rounded-br-md bg-[#dcf8c6] p-3.5 text-[12.5px] leading-relaxed text-slate-800 shadow-[0_20px_40px_-18px_rgba(11,22,48,0.4)]`}>
        <p>🩸 Urgent: O+ blood needed · 2 units (~900 ml)</p>
        <p>📞 Call: +91 98••• •••10</p>
        <p className="truncate">🔗 Live status: <span className="text-brand underline">sabhijude.veltria.in/blood/…</span></p>
        <p className="mt-1 flex items-center justify-end gap-1 text-[10.5px] text-slate-500">6:41 pm <CheckCircle2 className="h-3 w-3 text-sky-500" /></p>
      </div>
    </div>
  );
}
