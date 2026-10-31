'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  BookOpen,
  Search,
  Shield,
  Smartphone,
  Navigation,
  Briefcase,
  GraduationCap,
  FileCheck,
  Lock,
  Phone,
  ArrowRight,
  CheckCircle2,
  Download,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { ResourceCardSkeleton, Skeleton } from '@/components/ui/Skeleton';

import { RESOURCES_DATA, type SafetyGuide } from '@/lib/resources-data';

function SafetyResourcesContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialCategory = searchParams.get('category') || 'All';

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [activeModalGuide, setActiveModalGuide] = useState<SafetyGuide | null>(null);

  useEffect(() => {
    if (initialQuery) setSearchQuery(initialQuery);
    if (initialCategory) setSelectedCategory(initialCategory);
  }, [initialQuery, initialCategory]);

  const categories = [
    'All',
    'Emergency Help',
    'Workplace Safety',
    'College Safety',
    'Online Safety',
    'Reporting Guidance',
  ];

  const filteredGuides = RESOURCES_DATA.filter((guide) => {
    const matchesCategory =
      selectedCategory === 'All' || guide.category === selectedCategory;
    const matchesQuery =
      searchQuery.trim() === '' ||
      guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide.keyRule.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-in fade-in-50 duration-200">
      {/* Header */}
      <div className="space-y-3 max-w-3xl">
        <span className="eyebrow">
          <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
          Safety &amp; Legal Knowledge Base
        </span>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-ink">
          Know your rights, safety protocols &amp; legal remedies
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Statutory workplace rights under the POSH Act, Bharatiya Nyaya Sanhita (BNS) penal protections,
          college campus anti-ragging mandates, and official emergency response procedures.
        </p>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" aria-hidden="true" />
          <input
            type="search"
            placeholder="Search POSH Act, 112, BNS sections, cab rules..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-ink text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Guide Cards Grid */}
      {filteredGuides.length === 0 ? (
        <Card className="p-12 text-center space-y-3 border-dashed">
          <BookOpen className="h-8 w-8 text-slate-400 mx-auto" aria-hidden="true" />
          <h2 className="text-base font-bold text-slate-900">No matching safety guides found</h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search terms or select &ldquo;All&rdquo; to browse every statutory safety resource.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
          >
            Reset Filters
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGuides.map((guide) => (
            <Card
              key={guide.id}
              className="p-6 flex flex-col justify-between hover:shadow-md hover:border-slate-300 transition-all group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-brand bg-brand-tint px-2.5 py-0.5 rounded-full">
                    {guide.category}
                  </span>
                  <span className="text-slate-400">{guide.readTime}</span>
                </div>

                <div className="space-y-1.5">
                  <h2 className="font-display text-lg font-bold text-ink group-hover:text-brand transition-colors line-clamp-2">
                    {guide.title}
                  </h2>
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {guide.summary}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 space-y-1">
                  <span className="font-bold text-[10px] uppercase tracking-wider text-slate-500 block">
                    Statutory Rule
                  </span>
                  <p className="line-clamp-2 font-medium text-[11px] leading-relaxed">
                    {guide.keyRule}
                  </p>
                </div>
              </div>

              <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                {guide.helpline ? (
                  <span className="text-[11px] text-slate-500 font-medium truncate max-w-[140px]">
                    Helpline: <strong className="text-ink">{guide.helpline.split(' ')[0]}</strong>
                  </span>
                ) : (
                  <span />
                )}
                <button
                  type="button"
                  onClick={() => setActiveModalGuide(guide)}
                  className="inline-flex items-center gap-1 font-bold text-brand hover:underline"
                >
                  <span>Read protocol</span>
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Guide Detail Modal */}
      {activeModalGuide && (
        <Modal
          isOpen={!!activeModalGuide}
          onClose={() => setActiveModalGuide(null)}
          title={activeModalGuide.title}
          description={`${activeModalGuide.category} • ${activeModalGuide.readTime}`}
          maxWidth="lg"
        >
          <div className="space-y-6 text-sm text-slate-700">
            {/* Key Rule Highlight */}
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 block">
                Statutory / Legal Mandate
              </span>
              <p className="text-xs font-semibold text-amber-950 leading-relaxed">
                {activeModalGuide.keyRule}
              </p>
            </div>

            {/* Summary */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Summary &amp; Legal Context
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {activeModalGuide.summary}
              </p>
            </div>

            {/* Action Steps */}
            <div className="space-y-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Action Steps Checklist
              </h3>
              <div className="space-y-2">
                {activeModalGuide.actionSteps.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg border border-slate-200 bg-white text-xs text-slate-800 flex items-start gap-3"
                  >
                    <div className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <p className="leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer helpline and buttons */}
            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
              {activeModalGuide.helpline && (
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">Emergency Helpline:</span>
                  <a
                    href={`tel:${activeModalGuide.helpline.split(' ')[0]}`}
                    className="font-mono font-bold text-red-600 hover:underline flex items-center gap-1"
                  >
                    <Phone className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>{activeModalGuide.helpline}</span>
                  </a>
                </div>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveModalGuide(null)}
              >
                Close Protocol
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export function ResourcesClient() {
  return (
    <Suspense
      fallback={
        <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-in fade-in-50 duration-200">
          <div className="space-y-3">
            <Skeleton className="h-8 w-64 rounded-lg" />
            <Skeleton className="h-4 w-96 rounded-md" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ResourceCardSkeleton />
            <ResourceCardSkeleton />
            <ResourceCardSkeleton />
            <ResourceCardSkeleton />
            <ResourceCardSkeleton />
            <ResourceCardSkeleton />
          </div>
        </div>
      }
    >
      <SafetyResourcesContent />
    </Suspense>
  );
}
