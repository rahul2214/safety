'use client';

import React, { createContext, useContext, useState, ReactNode } from'react';
import { CheckCircle2, AlertCircle, Info, X } from'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: ToastType = 'info') => {
  const id = Date.now().toString() + Math.random().toString(36).slice(2, 5);
  setToasts((prev) => [...prev, { id, message, type }]);

  setTimeout(() => {
  setToasts((prev) => prev.filter((t) => t.id !== id));
  }, 4000);
  };

  const removeToast = (id: string) => {
  setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
  <ToastContext.Provider value={{ showToast }}>
  {children}
  {/* Toast Render Cluster */}
  <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
  {toasts.map((toast) => (
  <div
  key={toast.id}
  className={`pointer-events-auto flex items-center justify-between gap-3 p-3.5 rounded-[14px] shadow-lg border text-xs font-semibold animate-in slide-in-from-bottom-2 duration-150 ${
  toast.type === 'success'
  ? 'bg-[#ecfdf5] border-[#059669]/30 text-[#059669]'
  : toast.type === 'error'
  ? 'bg-[#fff1f2] border-[#e11d48]/30 text-[#e11d48]'
  : 'bg-white border-[#e8e8f0] text-[#16161d]'
  }`}
  >
  <div className="flex items-center gap-2">
  {toast.type === 'success' && <CheckCircle2 className="h-4 w-4 shrink-0" />}
  {toast.type === 'error' && <AlertCircle className="h-4 w-4 shrink-0" />}
  {toast.type === 'info' && <Info className="h-4 w-4 shrink-0 text-[#6d4aff]" />}
  <span>{toast.message}</span>
  </div>
  <button
  onClick={() => removeToast(toast.id)}
  className="p-1 hover:opacity-75 transition-opacity"
  >
  <X className="h-3.5 w-3.5" />
  </button>
  </div>
  ))}
  </div>
  </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
  return {
  showToast: (msg: string) => console.log('Toast:', msg),
  };
  }
  return context;
}
