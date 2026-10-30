'use client';

import React, { useState, useRef, useEffect, useId } from'react';
import {
  ChevronDown,
  Search,
  Check,
  CheckSquare,
  Square,
  X,
  Loader2,
} from'lucide-react';

export interface MultiSelectOption {
  id: string | number;
  label: string;
  count?: number;
  dotColor?: string;
  sublabel?: string;
}

export interface MultiSelectDropdownProps {
  label: string;
  icon?: React.ReactNode;
  options: MultiSelectOption[];
  selectedValues: (string | number)[];
  onChange: (selected: (string | number)[]) => void;
  placeholder?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  loading?: boolean;
  emptyText?: string;
  className?: string;
}

export function MultiSelectDropdown({
  label,
  icon,
  options,
  selectedValues,
  onChange,
  placeholder = 'All',
  searchable,
  searchPlaceholder = 'Search...',
  loading = false,
  emptyText = 'No options available',
  className = '',
}: MultiSelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close when clicking outside
  useEffect(() => {
  function handleClickOutside(event: MouseEvent) {
  if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
  setIsOpen(false);
  }
  }
  if (isOpen) {
  document.addEventListener('mousedown', handleClickOutside);
  }
  return () => {
  document.removeEventListener('mousedown', handleClickOutside);
  };
  }, [isOpen]);

  // Focus search input when opened
  useEffect(() => {
  if (isOpen && (searchable || options.length > 6)) {
  setTimeout(() => {
  searchInputRef.current?.focus();
  }, 50);
  } else {
  setSearch('');
  }
  }, [isOpen, searchable, options.length]);

  const toggleOption = (id: string | number) => {
  if (selectedValues.includes(id)) {
  onChange(selectedValues.filter((v) => v !== id));
  } else {
  onChange([...selectedValues, id]);
  }
  };

  const selectAll = () => {
  onChange(options.map((o) => o.id));
  };

  const clearAll = () => {
  onChange([]);
  };

  const isAllSelected = options.length > 0 && selectedValues.length === options.length;
  const isNoneSelected = selectedValues.length === 0;

  // Filter options if searching
  const filteredOptions = options.filter((opt) => {
  if (!search.trim()) return true;
  const q = search.toLowerCase();
  return (
  opt.label.toLowerCase().includes(q) ||
  (opt.sublabel && opt.sublabel.toLowerCase().includes(q))
  );
  });

  // Display trigger text
  const getTriggerText = () => {
  if (isNoneSelected) return`${label}: ${placeholder}`;
  if (selectedValues.length === 1) {
  const single = options.find((o) => o.id === selectedValues[0]);
  return single ? `${label}: ${single.label}` : `${label} (1)`;
  }
  return`${label} (${selectedValues.length})`;
  };

  const shouldShowSearch = searchable ?? options.length > 6;

  return (
  <div ref={dropdownRef} className={`relative inline-block text-left ${className}`}>
  {/* Trigger Button */}
  <button
  type="button"
  onClick={() => setIsOpen((prev) => !prev)}
  aria-haspopup="listbox"
  aria-expanded={isOpen}
  className={`inline-flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-[14px] text-xs font-bold transition shadow-2xs cursor-pointer select-none border ${
  selectedValues.length > 0
  ? 'bg-brand/10 border-brand text-brand'
  : isOpen
  ? 'bg-white border-brand text-ink'
  : 'bg-white border-slate-200 text-ink hover:bg-mist'
  }`}
  >
  <div className="flex items-center gap-1.5 truncate max-w-[200px]">
  {icon && <span className="shrink-0 text-brand">{icon}</span>}
  <span className="truncate">{getTriggerText()}</span>
  </div>

  <div className="flex items-center gap-1 shrink-0">
  {selectedValues.length > 0 && (
  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-brand text-white">
  {selectedValues.length}
  </span>
  )}
  <ChevronDown
  className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-200 ${
  isOpen ? 'rotate-180 text-brand' : ''
  }`}
  />
  </div>
  </button>

  {/* Popover Dropdown Menu */}
  {isOpen && (
  <div className="absolute left-0 mt-2 w-72 sm:w-80 rounded-[18px] bg-white border border-slate-200 shadow-xl z-50 p-3 space-y-2.5 animate-in fade-in zoom-in-95 duration-150">
  {/* Header */}
  <div className="flex items-center justify-between px-1 pb-1 border-b border-slate-200">
  <div className="flex items-center gap-1.5">
  <span className="text-xs font-black text-ink">
  {label} Filter
  </span>
  {selectedValues.length > 0 && (
  <span className="text-[11px] font-bold text-brand bg-brand-tint px-1.5 py-0.2 rounded-full">
  {selectedValues.length}
  </span>
  )}
  </div>

  <div className="flex items-center gap-2">
  <button
  type="button"
  onClick={selectAll}
  className="text-[11px] font-semibold text-brand hover:underline"
  >
  Select All
  </button>
  <span className="text-slate-300">|</span>
  <button
  type="button"
  onClick={clearAll}
  disabled={selectedValues.length === 0}
  className="text-[11px] font-semibold text-rose-500 hover:underline disabled:opacity-40 disabled:hover:no-underline"
  >
  Clear
  </button>
  </div>
  </div>

  {/* Quick Search inside dropdown */}
  {shouldShowSearch && (
  <div className="relative">
  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
  <input
  ref={searchInputRef}
  type="text"
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  placeholder={searchPlaceholder}
  className="w-full pl-8 pr-7 py-1.5 rounded-[10px] bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-brand"
  />
  {search && (
  <button
  type="button"
  onClick={() => setSearch('')}
  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
  >
  <X className="h-3 w-3" />
  </button>
  )}
  </div>
  )}

  {/* Options List */}
  <div className="max-h-60 overflow-y-auto space-y-1 pr-1 scrollbar-thin">
  {loading ? (
  <div className="py-6 flex flex-col items-center justify-center gap-2 text-slate-400">
  <Loader2 className="h-5 w-5 animate-spin text-brand" />
  <span className="text-xs">Loading options from database...</span>
  </div>
  ) : filteredOptions.length === 0 ? (
  <div className="py-6 text-center text-xs text-slate-400">
  {emptyText}
  </div>
  ) : (
  filteredOptions.map((option) => {
  const isSelected = selectedValues.includes(option.id);
  return (
  <button
  key={option.id}
  type="button"
  onClick={() => toggleOption(option.id)}
  className={`w-full px-2.5 py-2 rounded-[12px] text-xs font-medium transition flex items-center justify-between text-left border cursor-pointer ${
  isSelected
  ? 'bg-brand/10 border-brand text-brand font-bold'
  : 'bg-transparent border-transparent hover:bg-slate-50 text-slate-700'
  }`}
  >
  <div className="flex items-center gap-2 truncate pr-2">
  {isSelected ? (
  <CheckSquare className="h-4 w-4 text-brand shrink-0" />
  ) : (
  <Square className="h-4 w-4 text-slate-400 shrink-0" />
  )}

  {option.dotColor && (
  <span className={`w-2 h-2 rounded-full shrink-0 ${option.dotColor}`} />
  )}

  <div className="truncate">
  <span className="truncate block">{option.label}</span>
  {option.sublabel && (
  <span className="text-[10px] text-slate-400 font-normal truncate block">
  {option.sublabel}
  </span>
  )}
  </div>
  </div>

  {option.count !== undefined && (
  <span
  className={`text-[10px] px-1.5 py-0.5 rounded-full shrink-0 font-bold ${
  isSelected
  ? 'bg-brand text-white'
  : 'bg-slate-100 text-slate-500'
  }`}
  >
  {option.count}
  </span>
  )}
  </button>
  );
  })
  )}
  </div>

  {/* Footer Controls */}
  <div className="flex items-center justify-between pt-2 border-t border-slate-200 px-1">
  <span className="text-[11px] text-slate-400 font-medium">
  {selectedValues.length === 0
  ? 'Showing all items'
  : `${selectedValues.length} of ${options.length} selected`}
  </span>
  <button
  type="button"
  onClick={() => setIsOpen(false)}
  className="px-3 py-1 rounded-[10px] bg-brand text-white text-xs font-bold hover:bg-brand-deep transition"
  >
  Done
  </button>
  </div>
  </div>
  )}
  </div>
  );
}
