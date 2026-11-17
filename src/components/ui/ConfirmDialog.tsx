'use client';

import React, { useCallback, useRef, useState } from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';

export interface ConfirmOptions {
  title: string;
  message: React.ReactNode;
  /** Label of the action button, e.g. "Delete permanently". */
  confirmText?: string;
  cancelText?: string;
  /** Red action button and warning box, for anything that removes data. Default true. */
  destructive?: boolean;
}

/**
 * An in-page "are you sure?" popup, in place of the browser's own confirm() box.
 *
 *   const [confirm, confirmDialog] = useConfirm();
 *   if (!(await confirm({ title: 'Delete this request?', message: '…' }))) return;
 *   …
 *   return <>{…}{confirmDialog}</>;
 *
 * Closing the popup (Escape, the X, a click outside, or Cancel) answers false.
 */
export function useConfirm(): [(options: ConfirmOptions) => Promise<boolean>, React.ReactNode] {
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const resolveRef = useRef<((ok: boolean) => void) | null>(null);

  const confirm = useCallback((next: ConfirmOptions) => {
    // A second request while one is open answers the first with "no".
    resolveRef.current?.(false);
    setOptions(next);
    return new Promise<boolean>((resolve) => {
      resolveRef.current = resolve;
    });
  }, []);

  const answer = useCallback((ok: boolean) => {
    resolveRef.current?.(ok);
    resolveRef.current = null;
    setOptions(null);
  }, []);

  const destructive = options?.destructive ?? true;

  const dialog = (
    <Modal isOpen={!!options} onClose={() => answer(false)} title={options?.title} size="sm">
      {options && (
        <div className="space-y-5">
          {destructive ? (
            <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
              <div className="text-sm leading-relaxed text-red-900">{options.message}</div>
            </div>
          ) : (
            <div className="text-sm leading-relaxed text-slate-600">{options.message}</div>
          )}
          <div className="flex flex-col-reverse gap-2.5 sm:flex-row sm:items-center sm:justify-end">
            <Button variant="outline" onClick={() => answer(false)}>
              {options.cancelText ?? 'Cancel'}
            </Button>
            <Button
              variant={destructive ? 'emergency' : 'primary'}
              onClick={() => answer(true)}
              leftIcon={destructive ? <Trash2 className="h-4 w-4" /> : undefined}
              autoFocus
            >
              {options.confirmText ?? (destructive ? 'Delete' : 'Confirm')}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );

  return [confirm, dialog];
}
