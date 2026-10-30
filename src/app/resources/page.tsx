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

interface SafetyGuide {
  id: string;
  title: string;
  category:
    | 'Emergency Help'
    | 'Online Safety'
    | 'Travel Safety'
    | 'Workplace Safety'
    | 'College Safety'
    | 'Reporting Guidance'
    | 'Privacy & Security';
  readTime: string;
  summary: string;
  actionSteps: string[];
  helpline?: string;
  keyRule: string;
}

const RESOURCES_DATA: SafetyGuide[] = [
  {
    id: 'guide-posh',
    title: 'The POSH Act, 2013: Your Complete Legal Workplace Protections in India',
    category: 'Workplace Safety',
    readTime: '6 min read',
    summary: 'A definitive guide to the Sexual Harassment of Women at Workplace Act, 2013. Explains mandatory Internal Committees (IC), 90-day inquiry deadlines, interim relief rights, and penalty clauses for employers.',
    keyRule: 'Every organization with 10+ employees must maintain an IC with 50%+ women members. You have a legal right to up to 3 months paid interim leave during inquiries.',
    actionSteps: [
      'Document evidence contemporaneously: Record exact dates, times, direct quotes, and witnesses immediately in your private Sabhijude log.',
      'Submit written complaint within 3 months to the IC Presiding Officer (or District Local Committee if against the employer or in a small firm).',
      'Request interim relief: Complainants can legally request transfer of respondent, transfer to another department, or up to 3 months paid leave without using annual quota.',
      'Inquiry must conclude within 90 days: Employer is legally bound to implement IC recommendations within 60 days of the report.',
      'Section 16 Confidentiality: Publication or sharing of complainant identity, witness testimonies, or case files is strictly prohibited under penalty of law.',
    ],
    helpline: '181 / 1091 / NCW: 7827170170',
  },
  {
    id: 'guide-helplines-india',
    title: 'Official India Emergency Helplines: How ERSS 112, 1091, 181 & 1930 Operate',
    category: 'Emergency Help',
    readTime: '4 min read',
    summary: 'Directory and operational breakdown of Government of India emergency response infrastructure. Explains the difference between police rapid patrol, confidential crisis counseling, and cyber reporting.',
    keyRule: 'Dial 112 for immediate physical life-threatening danger. Dial 1091 for women police patrol, 181 for domestic counseling, and 1930 for online cyber crimes.',
    actionSteps: [
      'Dial 112 for All-in-One ERSS: Connects directly to state police control rooms with automated cellular tower triangulation.',
      'Dial 1091 for Dedicated Women Police: Dispatches specialized mobile PCR vans with female personnel.',
      'Dial 181 for Women in Distress: Ministry of WCD helpline providing shelter, psychological counseling, and legal aid.',
      'Dial 1090 for Women Power Line: Handles obscene calls, eve-teasing, and physical stalking with non-disclosure of victim identity.',
      'Dial 1930 / Visit cybercrime.gov.in: Instant freeze on cyber fraud and reporting of morphed photos, online blackmail, and doxxing.',
    ],
    helpline: '112 (National ERSS)',
  },
  {
    id: 'guide-night-shift',
    title: 'Night Shift & Commute Regulations: Mandatory Cab Escorts & Labor Laws',
    category: 'Workplace Safety',
    readTime: '4 min read',
    summary: 'Statutory requirements under the Factories Act and State Shops & Establishments rules governing women working shifts between 8:00 PM and 6:00 AM.',
    keyRule: 'Employers are legally mandated to provide door-to-door transportation with GPS tracking and security escorts for late-night female staff.',
    actionSteps: [
      'Verify company-provided transportation: Must be door-to-door (no dropping at main roads or isolated junctions).',
      'Security escort requirement: If you are the first passenger picked up or last dropped off, a vetted security guard must accompany the cab.',
      'Check cab safety equipment: Vehicle must have working GPS tracking, child-lock disabled, and driver identification displayed.',
      'Woman supervisor on floor: Establishments operating night shifts must have female supervisors and secure rest facilities.',
      'Report transport violations: Any drop-off violation can be formally escalated to the Labour Commissioner and internal safety ombudsman.',
    ],
    helpline: '112 / 1091',
  },
  {
    id: 'guide-bns-penal',
    title: 'Bharatiya Nyaya Sanhita (BNS) & IPC: Criminal Sanctions for Harassment & Stalking',
    category: 'Reporting Guidance',
    readTime: '5 min read',
    summary: 'Overview of Indian criminal law sections covering sexual harassment, stalking, and insult to modesty in office, transit, and digital spaces.',
    keyRule: 'Sexual harassment and stalking are cognizable criminal offenses in India carrying up to 3 to 5 years imprisonment.',
    actionSteps: [
      'Section 75 BNS (354A IPC) - Sexual Harassment: Unwelcome physical contact, advances, demand for sexual favors, or sexually colored remarks.',
      'Section 78 BNS (354D IPC) - Stalking: Following or repeatedly messaging despite disinterest carries up to 3 years imprisonment on first conviction.',
      'Section 79 BNS (509 IPC) - Insulting Modesty: Obscene gestures, intrusive comments, or elevator boundary violations in workplaces.',
      'Filing Zero FIR: If an incident occurs outside your home jurisdiction, any police station in India is legally mandated to register a Zero FIR.',
    ],
    helpline: '112 / NCW: 7827170170',
  },
  {
    id: 'guide-1',
    title: 'Emergency De-escalation & Immediate Exit Protocols',
    category: 'Emergency Help',
    readTime: '3 min read',
    summary: 'Essential procedures when faced with verbal aggression, isolated intimidation, or immediate physical threat in transit or public spaces.',
    keyRule: 'Prioritize physical exit over argument. Create distance toward brightly lit, populated commercial zones.',
    actionSteps: [
      'Disengage immediately without challenging hostility. Avoid cornered or dead-end passages.',
      'Head toward populated retail establishments (e.g. convenience stores, transit gates, pharmacies).',
      'Trigger Sabhijude SOS or dial 112 with your phone held visibly at chest height.',
      'Speak firmly to bystanders: "I do not know this person. Please call transit security immediately."',
    ],
    helpline: '112',
  },
  {
    id: 'guide-2',
    title: 'Digital Footprint Lockdown & Cyber Stalking Defense (1930 Helpline)',
    category: 'Online Safety',
    readTime: '4 min read',
    summary: 'A step-by-step checklist to revoke rogue device permissions, strip location metadata from shared photos, and audit social tracking.',
    keyRule: 'Disable background location permissions for social apps and report harassment directly to 1930 / cybercrime.gov.in.',
    actionSteps: [
      'Audit smartphone permissions: Deny "Always Allow" location for all apps except vetted emergency safety utilities.',
      'Strip EXIF metadata before sharing images online (disable camera geotagging in device settings).',
      'Enable two-factor authentication (2FA) using authenticator apps rather than plain SMS.',
      'Block and document repeated harassment: Save unedited screenshots with full URL, timestamps, and account handles.',
    ],
    helpline: '1930 (National Cyber Crime)',
  },
  {
    id: 'guide-3',
    title: 'Late Night Commuting & Rideshare Safety Standards',
    category: 'Travel Safety',
    readTime: '3 min read',
    summary: 'Verification protocols for cabs, metro travel, walking through unlit corridors, and active transit check-ins.',
    keyRule: 'Never enter a vehicle before cross-checking the driver photo, vehicle license plate, and door child-lock setting.',
    actionSteps: [
      'Verify license plate and driver identity through the app before unlocking or opening the vehicle door.',
      'Sit behind the driver seat rather than the front passenger seat to eliminate reach angles.',
      'Share trip link with a primary trusted contact immediately upon departure.',
      'Keep your live location sharing link active on your screen until arriving safely inside.',
    ],
    helpline: '1091 / 112',
  },
  {
    id: 'guide-5',
    title: 'Campus Safety: Navigating Dormitories & Night Classes',
    category: 'College Safety',
    readTime: '4 min read',
    summary: 'Best practices for university campuses, late library hours, off-campus housing leases, and campus security escorts.',
    keyRule: 'Save the campus security dispatch number on speed dial and familiarize yourself with emergency call boxes.',
    actionSteps: [
      'Utilize university campus security escort services when walking between labs and dorms after 9 PM.',
      'Verify peepholes and deadbolts on rental accommodation doors before signing room leases.',
      'Establish a check-in buddy system for study group sessions lasting past campus shuttle hours.',
      'Know the direct physical location of the nearest campus health and counseling center.',
    ],
    helpline: '112 / Campus Security',
  },
  {
    id: 'guide-7',
    title: 'Device Privacy: Preventing Location Snooping & Spyware',
    category: 'Privacy & Security',
    readTime: '4 min read',
    summary: 'How to check if someone has installed parental control tools, location relays, or unauthorized tracking apps on your phone.',
    keyRule: 'Regularly audit Apple Family Sharing, Google Family Link, and active WhatsApp Web sessions.',
    actionSteps: [
      'Check Settings -> Battery to spot unrecognized background apps consuming high power.',
      'Audit Bluetooth connected devices for unknown trackers (AirTags, Tile tags) using Bluetooth scanner apps.',
      'Review linked WhatsApp Web sessions and disconnect all sessions you did not personally authorize.',
      'Change lock-screen PIN to a non-obvious 6-digit combination and disable notification previews on lockscreen.',
    ],
    helpline: '1930',
  },
];

function SafetyResourcesContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [activeModalGuide, setActiveModalGuide] = useState<SafetyGuide | null>(null);

  useEffect(() => {
    if (initialQuery !== undefined) {
      setSearchQuery(initialQuery);
    }
  }, [initialQuery]);

  const categories = [
    'ALL',
    'Emergency Help',
    'Online Safety',
    'Travel Safety',
    'Workplace Safety',
    'College Safety',
    'Reporting Guidance',
    'Privacy & Security',
  ];

  const filteredGuides = RESOURCES_DATA.filter((guide) => {
    const matchesCategory = selectedCategory === 'ALL' || guide.category === selectedCategory;
    const query = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !query ||
      guide.title.toLowerCase().includes(query) ||
      guide.summary.toLowerCase().includes(query) ||
      guide.category.toLowerCase().includes(query) ||
      guide.keyRule.toLowerCase().includes(query);

    return matchesCategory && matchesQuery;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-[-0.02em] text-ink">Safety Knowledge &amp; Guidance Library</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Verified safety protocols, legal reporting guidance, and personal security checklists.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="search"
            placeholder="Search guides, laws, checklists..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-8 pr-3 rounded-lg border border-slate-200 bg-white text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-colors ${
              selectedCategory === cat
                ? 'bg-slate-900 text-white font-semibold shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {cat === 'ALL' ? 'All Guides' : cat}
          </button>
        ))}
      </div>

      {/* Guides Grid */}
      {filteredGuides.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredGuides.map((guide) => (
            <Card
              key={guide.id}
              className="p-5 flex flex-col justify-between hover:border-blue-300 transition-colors cursor-pointer group"
              onClick={() => setActiveModalGuide(guide)}
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded">
                    {guide.category}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">{guide.readTime}</span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                  {guide.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                  {guide.summary}
                </p>

                {/* Key takeaway callout */}
                <div className="p-2.5 rounded bg-slate-50 border border-slate-100 text-[11px] text-slate-700">
                  <strong className="text-slate-900">Key Rule:</strong> {guide.keyRule}
                </div>
              </div>

              <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-semibold text-blue-600 group-hover:underline flex items-center gap-1">
                  <span>View Protocol Checklist</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>

                {guide.helpline && (
                  <span className="text-[11px] text-slate-500 font-mono">
                    Helpline: {guide.helpline}
                  </span>
                )}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-10 text-center space-y-2 text-xs text-slate-500">
          <BookOpen className="h-8 w-8 text-slate-300 mx-auto" />
          <p className="font-bold text-slate-800 text-sm">No safety resources found</p>
          <p>Try clearing your search term or selecting another category.</p>
        </Card>
      )}

      {/* Guide Inspection Modal */}
      {activeModalGuide && (
        <Modal
          isOpen={!!activeModalGuide}
          onClose={() => setActiveModalGuide(null)}
          title={activeModalGuide.title}
          size="lg"
        >
          <div className="space-y-5">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-100">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                {activeModalGuide.category}
              </span>
              <span className="text-slate-400 font-medium">{activeModalGuide.readTime}</span>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed">
              {activeModalGuide.summary}
            </p>

            <div className="p-3.5 rounded-lg bg-blue-50 border border-blue-200 text-xs text-blue-900">
              <p className="font-bold mb-0.5">Core Operational Standard:</p>
              <p>{activeModalGuide.keyRule}</p>
            </div>

            {/* Action Steps Checklist */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wide text-slate-900">
                Action Steps Checklist
              </h4>
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
                    <Phone className="h-3.5 w-3.5" />
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

export default function SafetyResourcesPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-8 animate-in fade-in-50 duration-200">
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
