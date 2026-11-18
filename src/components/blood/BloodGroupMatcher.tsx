'use client';

import React, { useState } from 'react';
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';

const GROUPS = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'] as const;
type Group = (typeof GROUPS)[number];
const show = (g: string) => g.replace('-', '−');

/** Red cell compatibility: can a donor of group d give to a recipient of group r? */
function canGive(d: Group, r: Group): boolean {
  const abo = (g: Group) => g.replace(/[+-]/, '');
  const dA = abo(d), rA = abo(r);
  const aboOk = dA === 'O' || dA === rA || rA === 'AB';
  const rhOk = d.endsWith('-') || r.endsWith('+');
  return aboOk && rhOk;
}

/** Pick your group: who you can give red cells to, and receive them from. */
export function BloodGroupMatcher() {
  const [group, setGroup] = useState<Group>('O+');
  const giveTo = GROUPS.filter((r) => canGive(group, r));
  const getFrom = GROUPS.filter((d) => canGive(d, group));

  const Pills = ({ list }: { list: readonly Group[] }) => (
    <div className="flex flex-wrap gap-2">
      {GROUPS.map((g) => {
        const on = list.includes(g);
        return (
          <span
            key={g}
            className={`inline-flex h-10 min-w-12 items-center justify-center rounded-xl px-3 text-sm font-extrabold transition-all duration-300 ${
              on ? 'bg-red-600 text-white shadow-[0_6px_16px_-6px_rgba(220,38,38,0.6)]' : 'bg-white text-slate-300 border border-slate-200'
            }`}
            aria-hidden={!on}
          >
            {show(g)}
          </span>
        );
      })}
    </div>
  );

  return (
    <div className="card-public p-6 sm:p-8 space-y-7">
      <div className="space-y-3">
        <p className="text-sm font-semibold text-slate-500" id="matcher-label">Choose your blood group</p>
        <div className="grid grid-cols-4 gap-2 sm:gap-3" role="radiogroup" aria-labelledby="matcher-label">
          {GROUPS.map((g) => (
            <button
              key={g}
              type="button"
              role="radio"
              aria-checked={group === g}
              onClick={() => setGroup(g)}
              className={`h-12 sm:h-14 rounded-2xl text-base sm:text-lg font-extrabold transition ${
                group === g ? 'bg-ink text-white scale-[1.03]' : 'bg-mist text-ink hover:bg-slate-200'
              }`}
            >
              {show(g)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-3" aria-live="polite">
          <p className="flex items-center gap-2 font-semibold text-ink">
            <ArrowUpRight className="h-4 w-4 text-red-600" /> You can give red cells to
            <span className="text-slate-400 font-medium">({giveTo.length === 8 ? 'everyone' : giveTo.length})</span>
          </p>
          <Pills list={giveTo} />
        </div>
        <div className="space-y-3" aria-live="polite">
          <p className="flex items-center gap-2 font-semibold text-ink">
            <ArrowDownLeft className="h-4 w-4 text-brand" /> You can receive from
            <span className="text-slate-400 font-medium">({getFrom.length === 8 ? 'everyone' : getFrom.length})</span>
          </p>
          <Pills list={getFrom} />
        </div>
      </div>

      <p className="text-[13px] leading-relaxed text-slate-500 border-t border-slate-100 pt-4">
        General red cell rules. The hospital blood bank always tests and cross-matches before any transfusion, and only it decides what is safe for a patient.
      </p>
    </div>
  );
}
