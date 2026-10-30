/**
 * Reports Store & Case Management Service
 * Manages safety reports, timelines, local caching, and synchronization with backend API.
 */

export type ReportCategory =
  | 'Harassment'
  | 'Stalking'
  | 'Threat'
  | 'Unsafe Location'
  | 'Cyber Harassment'
  | 'Workplace Issue'
  | 'College/University Issue'
  | 'Domestic/Social Issue'
  | 'Emergency'
  | 'Other';

export type ReportTimeframe =
  | 'Just now'
  | 'Today'
  | 'Yesterday'
  | 'Earlier'
  | 'Custom date/time';

export type ReportLocationType =
  | 'CURRENT_GPS'
  | 'MANUAL'
  | 'NONE';

export type ReportVisibility =
  | 'PUBLIC'
  | 'SAFETY_TEAM'
  | 'MY_ORGANIZATION'
  | 'AUTHORIZED_SUPPORT'
  | 'ONLY_ME';

export type ReportSeverity =
  | 'ADVICE_NEEDED'
  | 'CONCERNING'
  | 'SERIOUS'
  | 'IMMEDIATE_DANGER';

export type ReportStatus =
  | 'Submitted'
  | 'Under Review'
  | 'Action Required'
  | 'In Progress'
  | 'Resolved'
  | 'Closed';

export interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  completed: boolean;
  active?: boolean;
}

export interface SafetyReport {
  id: string; // e.g. "SR-10482"
  category: ReportCategory;
  severity?: ReportSeverity;
  timeframe: string;
  customDate?: string;
  locationType: ReportLocationType;
  locationName: string;
  latitude?: number;
  longitude?: number;
  description: string;
  hasEvidence: boolean;
  evidenceNames?: string[];
  visibility: ReportVisibility;
  audience?: 'EVERYONE' | 'WOMEN_ONLY' | 'MEN_ONLY' | 'OTHERS';
  audienceGenderId?: number | null;
  postVisibilityId?: number;
  isAnonymous: boolean;
  status: ReportStatus;
  createdAt: string;
  updatedAt: string;
  assignedOfficer?: string;
  organizationName?: string;
  timeline: TimelineEvent[];
  notes?: string[];
}

const STORAGE_KEY = 'safecircle_user_reports_v2';

export const ReportsStore = {
  getReports(): SafetyReport[] {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        return [];
      }
      const parsed = JSON.parse(stored);
      const list: SafetyReport[] = Array.isArray(parsed) ? parsed : [];
      // Purge any legacy mock seed report IDs from prior sessions
      const legacyMockIds = new Set(['SR-10482', 'SR-10391', 'SR-09941', 'SR-10419', 'SR-10390']);
      const cleaned = list.filter((r) => !legacyMockIds.has(r.id));
      if (cleaned.length !== list.length) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cleaned));
      }
      return cleaned;
    } catch {
      return [];
    }
  },

  getReportById(id: string): SafetyReport | undefined {
    const list = this.getReports();
    return list.find((r) => r.id === id);
  },

  saveReport(report: Omit<SafetyReport, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'timeline'>): SafetyReport {
    const list = this.getReports();
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const newId = `SR-${randomNum}`;
    const nowIso = new Date().toISOString();
    const formattedNow = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });

    const newReport: SafetyReport = {
      ...report,
      id: newId,
      status: 'Submitted',
      createdAt: nowIso,
      updatedAt: nowIso,
      timeline: [
        {
          id: 't-1',
          title: 'Report submitted',
          description: report.isAnonymous
            ? 'Filed anonymously. Personal identity stripped.'
            : 'Filed with authenticated Sabhijude profile.',
          timestamp: formattedNow,
          completed: true,
          active: true,
        },
        {
          id: 't-2',
          title: 'Safety team received report',
          description: 'Queued for triage by trained safety personnel.',
          timestamp: 'Pending queue',
          completed: false,
        },
        {
          id: 't-3',
          title: 'Report reviewed',
          description: 'Specialist evaluates risk severity and privacy safeguards.',
          timestamp: 'Pending review',
          completed: false,
        },
        {
          id: 't-4',
          title: 'Action taken',
          description: 'Protective actions and escalation to authorized responders.',
          timestamp: 'Pending action',
          completed: false,
        },
        {
          id: 't-5',
          title: 'Resolved',
          description: 'Case closure and follow-up safety confirmation.',
          timestamp: 'Pending resolution',
          completed: false,
        },
      ],
    };

    const updatedList = [newReport, ...list];
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
      } catch (e) {
        console.error('Error saving report to storage', e);
      }
    }
    return newReport;
  },

  addNote(reportId: string, noteText: string): SafetyReport | null {
    const list = this.getReports();
    const idx = list.findIndex((r) => r.id === reportId);
    if (idx === -1) return null;

    const existing = list[idx];
    const notes = existing.notes ? [...existing.notes, noteText] : [noteText];
    const updated: SafetyReport = {
      ...existing,
      notes,
      updatedAt: new Date().toISOString(),
    };
    list[idx] = updated;

    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    }
    return updated;
  },
};
