'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  HelpCircle,
  Plus,
  MessageSquare,
  Phone,
  Mail,
  CheckCircle2,
  Clock,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  ArrowLeft,
  LifeBuoy,
  RefreshCw,
  Tag,
  Shield,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { SupportTicketSkeleton } from '@/components/ui/Skeleton';
import { useToast } from '@/components/Toast';
import {
  api,
  type SupportTicket,
  type SupportConfig,
} from '@/lib/api-client';

export type TicketStatus =
  | 'Open'
  | 'In Progress'
  | 'Waiting for User'
  | 'Resolved'
  | 'Closed';

const FAQS = [
  {
    q: 'How does Sabhijude protect my personal privacy when I submit a report?',
    a: 'When you choose "Report Anonymously", all personally identifying markers (your name, email address, IP address, and phone number) are stripped from the record before submission. The triage officer only sees the incident category, approximate timeframe, and description.',
  },
  {
    q: 'What happens immediately after I activate Emergency SOS?',
    a: 'The portal captures your current GPS coordinates, arms the live tracking telemetry, and dispatches high-priority SMS and WhatsApp alerts to your verified trusted contacts. If configured, you can also dial 112 directly.',
  },
  {
    q: 'Are incident locations shown on the public safety map?',
    a: 'No. Exact individual coordinates are never publicly plotted. Incident reports are aggregated into broad geographic zones (minimum 250m radii) to protect survivor anonymity and prevent pattern identification.',
  },
  {
    q: 'How quickly does the safety triage team review submitted reports?',
    a: 'Reports categorized as Immediate Danger or Threat are evaluated within 15–30 minutes. Non-urgent community infrastructure hazards (e.g. broken streetlights) are processed during standard municipal review shifts within 24 hours.',
  },
  {
    q: 'Can I delete or withdraw a filed report?',
    a: 'Yes. You can request case file sealing or deletion at any time by opening a support ticket referencing your Report ID.',
  },
];

export default function SupportPage() {
  const { showToast } = useToast();

  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loadingTickets, setLoadingTickets] = useState(true);
  const [supportConfig, setSupportConfig] = useState<SupportConfig>({
    helplinePhone: '+91 6303563546',
    supportEmail: 'admin@veltria.in',
    emergencyPolice: '112',
    womenHelpline: '1091',
    operatingHours: '24/7 Response Support',
  });

  const [newTicketModal, setNewTicketModal] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Form states
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('Report Status');
  const [priority, setPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [description, setDescription] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactName, setContactName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Load config & tickets from backend DB
  const loadData = async () => {
    setLoadingTickets(true);
    try {
      // 1. Fetch dynamic support channels
      const cfgRes = await api.getSupportConfig();
      if (cfgRes.ok && cfgRes.data) {
        setSupportConfig(cfgRes.data);
      }

      // 2. Fetch user's tickets from database
      let userEmail = '';
      if (typeof window !== 'undefined') {
        try {
          const stored = localStorage.getItem('safecircle_user');
          if (stored) {
            const u = JSON.parse(stored);
            if (u.email) userEmail = u.email;
            if (u.displayName || u.username) setContactName(u.displayName || u.username);
            if (u.email) setContactEmail(u.email);
          }
        } catch {
          // ignore
        }
      }

      const ticketsRes = await api.getSupportTickets(userEmail);
      if (ticketsRes.ok && ticketsRes.data) {
        setTickets(ticketsRes.data);
      }
    } catch (err) {
      console.warn('Failed to load support data from DB:', err);
    } finally {
      setLoadingTickets(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) return;

    setSubmitting(true);
    try {
      const res = await api.createSupportTicket({
        subject: subject.trim(),
        category,
        priority,
        description: description.trim(),
        userName: contactName.trim() || undefined,
        userEmail: contactEmail.trim() || undefined,
      });

      if (res.ok && res.data) {
        setTickets((prev) => [res.data!, ...prev]);
        showToast(
          `Support ticket ${res.data.ticketCode} created successfully.`,
          'success'
        );
        setSubject('');
        setDescription('');
        setNewTicketModal(false);
      } else {
        showToast(res.error || 'Failed to submit support ticket. Please try again.', 'error');
      }
    } catch (err: any) {
      showToast(err?.message || 'Error communicating with support service.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Open':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
            OPEN
          </span>
        );
      case 'In Progress':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
            IN PROGRESS
          </span>
        );
      case 'Waiting for User':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
            WAITING FOR YOU
          </span>
        );
      case 'Resolved':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            RESOLVED
          </span>
        );
      case 'Closed':
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
            CLOSED
          </span>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Need Help? Safety Support &amp; Help Desk
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Raise confidential support tickets, track resolution status, and access verified safety guidelines.
          </p>
        </div>

        <div className="flex items-center gap-2">
          
          <Button variant="primary" onClick={() => setNewTicketModal(true)}>
           
            <span>Raise Ticket</span>
          </Button>
        </div>
      </div>

      {/* Direct Contact Channels Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-lg border border-slate-200 bg-white space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
            <Phone className="h-4 w-4 text-blue-600" />
            <span>Support Helpline</span>
          </div>
          <p className="text-[11px] text-slate-500">{supportConfig.operatingHours}</p>
          <a
            href={`tel:${supportConfig.helplinePhone.replace(/\s+/g, '')}`}
            className="font-mono text-xs font-bold text-slate-900 hover:text-blue-600 hover:underline pt-1 block"
          >
            {supportConfig.helplinePhone}
          </a>
        </div>

        <div className="p-4 rounded-lg border border-slate-200 bg-white space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
            <Mail className="h-4 w-4 text-blue-600" />
            <span>Confidential Email</span>
          </div>
          <p className="text-[11px] text-slate-500">Official Assistance &amp; Escalation</p>
          <a
            href={`mailto:${supportConfig.supportEmail}`}
            className="font-mono text-xs font-bold text-slate-900 hover:text-blue-600 hover:underline pt-1 block"
          >
            {supportConfig.supportEmail}
          </a>
        </div>

        <div className="p-4 rounded-lg border border-red-200 bg-red-50/50 space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-red-900">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <span>Immediate Danger?</span>
          </div>
          <p className="text-[11px] text-red-700">Call national police emergency</p>
          <a
            href={`tel:${supportConfig.emergencyPolice}`}
            className="font-mono text-xs font-bold text-red-700 hover:underline pt-1 block"
          >
            Dial {supportConfig.emergencyPolice} (ERSS) &rarr;
          </a>
        </div>
      </div>

      {/* Support Tickets Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            My Support Tickets ({tickets.length})
          </h2>
          <span className="text-xs text-slate-400">Live Database Sync &bull; Encrypted</span>
        </div>

        {loadingTickets ? (
          <div className="space-y-2.5">
            {[1, 2, 3].map((i) => (
              <SupportTicketSkeleton key={i} />
            ))}
          </div>
        ) : tickets.length > 0 ? (
          <div className="space-y-2.5">
            {tickets.map((t) => (
              <Card key={t.id} className="p-4 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#6d4aff] px-2 py-0.5 rounded bg-[#f1edff]">
                      {t.ticketCode}
                    </span>
                    <span className="text-slate-300">&bull;</span>
                    <span className="text-xs font-bold text-slate-900">{t.subject}</span>
                    <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                      {t.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(t.status)}
                    <span className="text-[11px] text-slate-400">
                      {new Date(t.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{t.description}</p>

                {t.lastReply && (
                  <div className="p-2.5 rounded bg-slate-50 border border-slate-100 flex items-start gap-2 text-[11px] text-slate-700">
                    <Clock className="h-3.5 w-3.5 text-blue-500 shrink-0 mt-0.5" />
                    <span>
                      <strong>Latest Status Note:</strong> {t.lastReply}
                    </span>
                  </div>
                )}
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center text-xs text-slate-500">
            <LifeBuoy className="h-8 w-8 text-slate-300 mx-auto mb-2" />
            <p className="font-bold text-slate-900">No support tickets</p>
            <p>You have not raised any technical or case inquiries yet.</p>
          </Card>
        )}
      </div>

      {/* FAQ Accordion */}
      <div className="space-y-3 pt-2">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Frequently Asked Questions
        </h2>

        <div className="space-y-2">
          {FAQS.map((faq, index) => {
            const isExpanded = expandedFaq === index;
            return (
              <Card
                key={index}
                className="p-4 cursor-pointer hover:border-slate-300 transition-colors"
                onClick={() => setExpandedFaq(isExpanded ? null : index)}
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-xs font-bold text-slate-900 leading-snug">{faq.q}</h3>
                  <button type="button" className="text-slate-400 shrink-0">
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </button>
                </div>

                {isExpanded && (
                  <p className="text-xs text-slate-600 leading-relaxed pt-3 border-t border-slate-100 mt-3">
                    {faq.a}
                  </p>
                )}
              </Card>
            );
          })}
        </div>
      </div>

      {/* New Ticket Modal */}
      <Modal
        isOpen={newTicketModal}
        onClose={() => setNewTicketModal(false)}
        title="Raise Confidential Support Ticket"
        size="md"
      >
        <form onSubmit={handleCreateTicket} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Your Name
              </label>
              <input
                type="text"
                placeholder="Optional or Anonymous"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Contact Email
              </label>
              <input
                type="email"
                placeholder="For status updates"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Inquiry Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="Report Status">Report Case File Status</option>
              <option value="Privacy Inquiry">Privacy &amp; Data Safeguards</option>
              <option value="Technical Problem">Technical Bug / GPS Glitch</option>
              <option value="Organization Access">College or Corporate Affiliation</option>
              <option value="Other">General Support Inquiry</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Subject <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Status of case file #SR-10482"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Urgency Level
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as any)}
              className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="High">High (Urgent Case)</option>
              <option value="Medium">Medium (Normal Response)</option>
              <option value="Low">Low (General Feedback)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              placeholder="Provide relevant details or ticket references..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full p-3 rounded-lg border border-slate-200 text-xs text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setNewTicketModal(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={submitting}
            >
              Submit Ticket
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
