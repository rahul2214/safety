'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Building2,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Users,
  Clock,
  Radio,
  Lock,
  ChevronRight,
  AlertTriangle,
  Send,
  Sparkles,
  HelpCircle,
  FileCheck2,
} from 'lucide-react';
import { api, type CreateOrganizationRequestPayload } from '@/lib/api-client';

const ORG_TYPES = [
  { value: 'UNIVERSITY', label: 'University / Higher Education Institution' },
  { value: 'CORPORATE', label: 'Corporate Office / Tech Park' },
  { value: 'HEALTHCARE', label: 'Hospital / Healthcare Campus' },
  { value: 'RESIDENTIAL', label: 'Gated Residential Society / Hostel Complex' },
  { value: 'COMMUNITY', label: 'Civic Group / Non-Governmental Organization' },
];

const MEMBER_ESTIMATES = [
  { value: 'UNDER_500', label: 'Fewer than 500 members' },
  { value: '500_1000', label: '500 – 1,000 members' },
  { value: '1000_5000', label: '1,000 – 5,000 members' },
  { value: '5000_15000', label: '5,000 – 15,000 members' },
  { value: 'OVER_15000', label: '15,000+ members' },
];

const SAFETY_PILLARS = [
  {
    title: 'Silent Emergency Geofence',
    desc: 'Automatic high-priority dispatch alerts when an SOS is triggered inside your registered campus coordinates.',
  },
  {
    title: 'Dedicated Security Desk Console',
    desc: 'Empower your on-ground security officers with real-time incident tracking, live responder dispatch, and audit logs.',
  },
  {
    title: 'Anonymous Civic Reporting',
    desc: 'Enable students and staff to highlight safety hazards and harassment incidents without fear of retaliation.',
  },
  {
    title: 'Official Domain Verification',
    desc: 'Seamless onboarding with institutional emails (@nit.ac.in, @org.com) and instant verified membership badges.',
  },
];

export default function OrganizationRequestPage() {
  const [formData, setFormData] = useState<CreateOrganizationRequestPayload>({
    organizationName: '',
    organizationType: 'UNIVERSITY',
    domain: '',
    contactName: '',
    contactTitle: '',
    contactEmail: '',
    contactPhone: '',
    memberCountEstimate: '1000_5000',
    address: '',
    city: '',
    state: '',
    safetyRequirements: '',
    notes: '',
  });

  const [selectedNeeds, setSelectedNeeds] = useState<string[]>([
    'Silent SOS Geofencing',
    'Campus Security Desk Dispatch',
  ]);

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  const toggleNeed = (need: string) => {
    setSelectedNeeds((prev) =>
      prev.includes(need) ? prev.filter((n) => n !== need) : [...prev, need]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!formData.organizationName.trim()) {
      setErrorMsg('Please enter your institution or organization name.');
      return;
    }
    if (!formData.contactName.trim()) {
      setErrorMsg('Please enter the primary safety contact or administrator name.');
      return;
    }
    if (!formData.contactEmail.trim() || !formData.contactEmail.includes('@')) {
      setErrorMsg('Please provide a valid official contact email address.');
      return;
    }
    if (!formData.contactPhone.trim()) {
      setErrorMsg('Please provide a contact phone number for security verification.');
      return;
    }

    setSubmitting(true);

    try {
      const combinedRequirements = [
        ...selectedNeeds,
        formData.safetyRequirements ? `Custom note: ${formData.safetyRequirements}` : '',
      ]
        .filter(Boolean)
        .join('; ');

      const res = await api.submitOrganizationRequest({
        ...formData,
        safetyRequirements: combinedRequirements,
      });

      if (res.ok && res.data) {
        setSubmittedRef(res.data.requestReference || `REQ-${Date.now().toString().slice(-6)}`);
      } else {
        setErrorMsg(res.error || 'Unable to submit onboarding request. Please try again.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Network error occurred while submitting request.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-mist text-ink">
      <section className="relative overflow-hidden bg-ink text-white">
        <div aria-hidden className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-brand/40 blur-3xl pointer-events-none" />
        <div aria-hidden className="absolute -bottom-32 left-0 h-80 w-80 rounded-full bg-coral/20 blur-3xl pointer-events-none" />
        <div className="public-container relative pt-16 pb-28 sm:pt-20 sm:pb-32 max-w-6xl">
          <div className="flex items-center gap-2 text-sm text-white/55 mb-8">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-white/90">For campuses &amp; organizations</span>
          </div>
          <div className="max-w-3xl space-y-6">
            <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-coral">
              <Building2 className="h-3.5 w-3.5" /> Campus &amp; workplace program
            </span>
            <h1 className="font-display text-[2.4rem] sm:text-6xl leading-[1.05] font-extrabold tracking-[-0.03em]">
              A safer campus starts with a direct line to help.
            </h1>
            <p className="text-lg sm:text-xl text-white/70 leading-relaxed">
              Give students and staff instant SOS alerts that reach your own security desk, plus a verified way to report
              and resolve incidents. We review every request within 24 hours.
            </p>
            <div className="flex flex-wrap gap-x-6 gap-y-3 pt-2 text-[15px] text-white/80">
              <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" />No hardware to install</span>
              <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-emerald-400" />Encrypted incident records</span>
              <span className="flex items-center gap-2"><Clock className="h-4 w-4 text-emerald-400" />Portal ready in 24 hours</span>
            </div>
          </div>
        </div>
      </section>

      <div className="public-container max-w-6xl relative -mt-16 pb-24 space-y-8">

        {/* Success Confirmation View */}
        {submittedRef ? (
          <div className="card-public p-8 sm:p-12 text-center max-w-2xl mx-auto space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-xs">
              <FileCheck2 className="h-8 w-8" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded">
                Application Received Successfully
              </span>
              <h2 className="text-2xl font-bold text-slate-900">
                Institutional Request Registered
              </h2>
              <p className="text-sm text-slate-600 max-w-lg mx-auto">
                Thank you for prioritizing community safety. Your onboarding inquiry has been queued for platform
                administrator review.
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl max-w-md mx-auto text-left space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-medium">Tracking Reference:</span>
                <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  {submittedRef}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-medium">Organization:</span>
                <span className="font-semibold text-slate-800">{formData.organizationName}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-medium">Primary Contact:</span>
                <span className="font-semibold text-slate-800">{formData.contactName} ({formData.contactEmail})</span>
              </div>
            </div>

            <div className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              Our safety operations team will verify your institution credentials and contact you via phone or email to
              provision your organization command center credentials.
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/"
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-brand hover:bg-brand-deep text-white font-semibold text-sm transition-colors"
              >
                Return to Safety Home
              </Link>
              <button
                type="button"
                onClick={() => {
                  setSubmittedRef(null);
                  setFormData({
                    organizationName: '',
                    organizationType: 'UNIVERSITY',
                    domain: '',
                    contactName: '',
                    contactTitle: '',
                    contactEmail: '',
                    contactPhone: '',
                    memberCountEstimate: '1000_5000',
                    address: '',
                    city: '',
                    state: '',
                    safetyRequirements: '',
                    notes: '',
                  });
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-mist hover:bg-slate-200 text-ink font-semibold text-sm transition-colors"
              >
                Submit Another Request
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Form (7 cols) */}
            <div className="lg:col-span-7 card-public p-6 sm:p-9">
              <div className="border-b border-slate-100 pb-5 mb-6">
                <h2 className="font-display text-2xl font-bold text-ink">Request onboarding</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Provide verified institutional information to initialize your dedicated campus safety tenant.
                </p>
              </div>

              {errorMsg && (
                <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-3">
                  <AlertTriangle className="h-4 w-4 shrink-0 text-red-600" />
                  <p>{errorMsg}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Section 1: Organization Details */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    1. Organization & Campus Details
                  </h3>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Organization / Campus Legal Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. National Institute of Technology, Warangal"
                      value={formData.organizationName}
                      onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden transition-all placeholder:text-slate-400"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Institution Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.organizationType}
                        onChange={(e) => setFormData({ ...formData, organizationType: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden bg-white font-medium"
                      >
                        {ORG_TYPES.map((t) => (
                          <option key={t.value} value={t.value}>
                            {t.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Official Domain / Website
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. nitw.ac.in or company.com"
                        value={formData.domain || ''}
                        onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden transition-all placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">City</label>
                      <input
                        type="text"
                        placeholder="e.g. Warangal"
                        value={formData.city || ''}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden placeholder:text-slate-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">State / Province</label>
                      <input
                        type="text"
                        placeholder="e.g. Telangana"
                        value={formData.state || ''}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden placeholder:text-slate-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Campus Population</label>
                      <select
                        value={formData.memberCountEstimate}
                        onChange={(e) => setFormData({ ...formData, memberCountEstimate: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden bg-white font-medium"
                      >
                        {MEMBER_ESTIMATES.map((m) => (
                          <option key={m.value} value={m.value}>
                            {m.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Section 2: Safety Contact */}
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    2. Primary Authorized Safety Contact
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Full Legal Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Dr. Sunita Sharma"
                        value={formData.contactName}
                        onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden placeholder:text-slate-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Designation / Role
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Dean of Student Welfare / Head of Security"
                        value={formData.contactTitle || ''}
                        onChange={(e) => setFormData({ ...formData, contactTitle: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Official Work Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. dean.welfare@nitw.ac.in"
                        value={formData.contactEmail}
                        onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden placeholder:text-slate-400"
                      />
                      <p className="text-[10px] text-slate-400 mt-1">Please use an institutional email domain when possible.</p>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Emergency Contact Phone <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. +91 98765 43210"
                        value={formData.contactPhone}
                        onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden placeholder:text-slate-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 3: Safety Requirements & Notes */}
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    3. Safety Infrastructure Requirements
                  </h3>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-2">
                      Priority Features Needed
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {[
                        'Silent SOS Geofencing',
                        'Campus Security Desk Dispatch',
                        'Night Transit Escort Protocol',
                        'Anonymous Harassment Reporting',
                        'Hostel Curfew & Check-in Safety',
                        'Mass Broadcast Safety Alerts',
                      ].map((need) => (
                        <label
                          key={need}
                          className={`flex items-center gap-2.5 p-2.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                            selectedNeeds.includes(need)
                              ? 'bg-blue-50 border-blue-200 text-blue-900 font-semibold'
                              : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={selectedNeeds.includes(need)}
                            onChange={() => toggleNeed(need)}
                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span>{need}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Implementation Timeline & Additional Context
                    </label>
                    <textarea
                      rows={3}
                      placeholder="e.g. We have 4 girls hostels and academic buildings requiring immediate geo-coverage before the upcoming semester..."
                      value={formData.notes || ''}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden placeholder:text-slate-400"
                    />
                  </div>
                </div>

                {/* Submission CTA */}
                <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                    <Lock className="h-3.5 w-3.5 text-slate-400" />
                    <span>Inquiry verified strictly by platform admins. No public listing.</span>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-brand hover:bg-brand-deep disabled:opacity-60 text-white font-semibold text-sm transition-colors"
                  >
                    {submitting ? (
                      <>
                        <div className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Submitting Application...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-3.5 w-3.5" />
                        <span>Submit Organization Request</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Right Column: Trust Pillars & FAQs (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              {/* Pillars Card */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-blue-600" />
                  <span>Institutional Safety Capabilities</span>
                </h3>

                <div className="space-y-4">
                  {SAFETY_PILLARS.map((p, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                        {i + 1}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{p.title}</h4>
                        <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{p.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Protocol SLA Card */}
              <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xs space-y-4">
                <div className="flex items-center gap-2 text-rose-400 text-xs font-bold">
                  <Radio className="h-4 w-4 animate-pulse" />
                  <span>Administrative Verification Protocol</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  To prevent unauthorized impersonation of educational or corporate institutions, all tenant creation
                  requests undergo human credential verification by Sabhijude platform administrators.
                </p>
                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-[11px] text-slate-300 space-y-1">
                  <div className="font-semibold text-white">Expected Onboarding Turnaround:</div>
                  <div>• Initial Review: Under 12 Business Hours</div>
                  <div>• Console Tenant Provisioning: 24 Business Hours</div>
                  <div>• Member Join Code Activation: Immediate Upon Approval</div>
                </div>
              </div>

              {/* Urgent Help Reference */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                  <HelpCircle className="h-4 w-4 text-slate-500" />
                  <span>Need Immediate Assistance?</span>
                </div>
                <p className="text-xs text-slate-500">
                  If this is an active emergency or immediate safety threat, do not wait for an onboarding ticket.
                  Reach direct emergency response hotlines immediately:
                </p>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <a
                    href="tel:112"
                    className="p-2.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-center font-bold text-xs transition"
                  >
                    112 National Police
                  </a>
                  <a
                    href="tel:1091"
                    className="p-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-center font-bold text-xs transition"
                  >
                    1091 Women Helpline
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
