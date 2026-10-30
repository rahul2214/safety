'use client';

import React from 'react';
import { CheckCircle2, Circle, Clock, AlertCircle } from 'lucide-react';

export interface TimelineEvent {
  id: string | number;
  title: string;
  description?: string;
  timestamp?: string;
  status?: 'completed' | 'current' | 'upcoming' | 'action_required';
  completed?: boolean;
  active?: boolean;
}

interface TimelineItemProps {
  title: string;
  description?: string;
  timestamp?: string;
  completed?: boolean;
  active?: boolean;
  isAction?: boolean;
}

export function TimelineItem({
  title,
  description,
  timestamp,
  completed,
  active,
  isAction,
}: TimelineItemProps) {
  return (
    <div className="relative group">
      {/* Status node */}
      <div
        className={`absolute -left-6 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-white ring-4 ring-white ${
          completed
            ? 'text-emerald-600'
            : active
            ? 'text-blue-600'
            : isAction
            ? 'text-red-600'
            : 'text-slate-300'
        }`}
      >
        {completed ? (
          <CheckCircle2 className="h-5 w-5 fill-emerald-50 text-emerald-600" />
        ) : active ? (
          <Clock className="h-5 w-5 fill-blue-50 text-blue-600" />
        ) : isAction ? (
          <AlertCircle className="h-5 w-5 fill-red-50 text-red-600" />
        ) : (
          <Circle className="h-4 w-4 text-slate-300" />
        )}
      </div>

      {/* Event content */}
      <div className="space-y-1">
        <div className="flex items-center justify-between gap-2">
          <h4
            className={`text-sm font-semibold ${
              active
                ? 'text-blue-700'
                : isAction
                ? 'text-red-700'
                : 'text-slate-900'
            }`}
          >
            {title}
          </h4>
          {timestamp && (
            <span className="text-xs text-slate-400 shrink-0 font-medium">
              {timestamp}
            </span>
          )}
        </div>
        {description && (
          <p className="text-xs text-slate-600 leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

interface TimelineProps {
  events?: TimelineEvent[];
  children?: React.ReactNode;
}

export function Timeline({ events, children }: TimelineProps) {
  return (
    <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
      {children
        ? children
        : events?.map((event) => {
            const isCompleted = event.completed || event.status === 'completed';
            const isCurrent = event.active || event.status === 'current';
            const isAction = event.status === 'action_required';

            return (
              <TimelineItem
                key={event.id}
                title={event.title}
                description={event.description}
                timestamp={event.timestamp}
                completed={isCompleted}
                active={isCurrent}
                isAction={isAction}
              />
            );
          })}
    </div>
  );
}
