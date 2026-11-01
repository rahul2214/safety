'use client';

import React, { useState, useEffect } from'react';
import Link from'next/link';
import { useRouter } from'next/navigation';
import {
  AlertCircle,
  ShieldAlert,
  Eye,
  AlertTriangle,
  MapPin,
  MapPinOff,
  Globe,
  Briefcase,
  GraduationCap,
  Home,
  Shield,
  HelpCircle,
  Clock,
  Calendar,
  Compass,
  CheckCircle2,
  Lock,
  ArrowLeft,
  ArrowRight,
  Info,
  FileText,
  Phone,
  Check,
  Users,
  User,
  Sparkles,
} from'lucide-react';
import { Button } from'@/components/ui/Button';
import { Card } from'@/components/ui/Card';
import { StatusBadge } from'@/components/ui/StatusBadge';
import { getCurrentCoordinates } from'@/lib/location';
import {
  ReportsStore,
  ReportCategory,
  ReportSeverity,
  ReportTimeframe,
  ReportLocationType,
  ReportVisibility,
  SafetyReport,
} from'@/lib/reports-store';
import { api, PostVisibility } from'@/lib/api-client';
import { useAuth } from'@/lib/auth-context';

// Client-side mirrors of the backend's SafetyContentModerator text checks, so problems surface on the Details step
const LINK_PATTERN = /(?:bit\.ly|tinyurl\.com|t\.me|wa\.me|chat\.whatsapp\.com|shorturl\.at|ow\.ly|is\.gd|buff\.ly)/i;
const CHAR_REPEAT_PATTERN = /(.)\1{5,}/;
const WORD_LOOP_PATTERN = /\b([a-z]{2,15})\b(?:\s+\1\b){3,}/i;
const CONSONANT_RUN_PATTERN = /\b[bcdfghjklmnpqrstvwxyz]{9,}\b/i;

export default function ReportProblemPage() {
  const router = useRouter();
  const { user } = useAuth();

  // Wizard state: 1 to 7 (steps), 8 for submitted confirmation
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedReport, setSubmittedReport] = useState<SafetyReport | null>(null);

  // Form Fields
  const [category, setCategory] = useState<ReportCategory>('Harassment');
  const [severity, setSeverity] = useState<ReportSeverity>('CONCERNING');

  const getLocalNowInputString = () => {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;
  return new Date(now.getTime() - offset).toISOString().slice(0, 16);
  };

  const [incidentDateTime, setIncidentDateTime] = useState<string>(getLocalNowInputString());
  const [timeframe, setTimeframe] = useState<ReportTimeframe>('Just now');
  const [customDate, setCustomDate] = useState<string>('');

  const [locationType, setLocationType] = useState<ReportLocationType>('CURRENT_GPS');
  const [manualLocation, setManualLocation] = useState<string>('');
  const [gpsCoordinates, setGpsCoordinates] = useState<{ latitude: number; longitude: number; accuracy: number } | null>(null);
  const [locLoading, setLocLoading] = useState(false);
  const [locError, setLocError] = useState<string | null>(null);

  const [description, setDescription] = useState<string>('');

  const [visibility, setVisibility] = useState<ReportVisibility>('PUBLIC');
  const [postVisibilityId, setPostVisibilityId] = useState<number>(1);
  const [isAnonymous, setIsAnonymous] = useState<boolean>(true);

  // Dynamic PostVisibility lookup from database
  const [visibilities, setVisibilities] = useState<PostVisibility[]>([]);

  useEffect(() => {
  async function loadVisibilities() {
  try {
  const res = await api.getPostVisibilities();
  if (res.ok && res.data && res.data.length > 0) {
  setVisibilities(res.data);
  }
  } catch (err) {
  console.warn('Could not load post visibilities from database, using defaults:', err);
  }
  }
  loadVisibilities();
  }, []);

  // Validation errors
  const [stepError, setStepError] = useState<string | null>(null);

  // Categories config with clean industrial icons (NO EMOJIS)
  const categoriesList: { id: ReportCategory; title: string; subtitle: string; icon: React.ElementType }[] = [
  { id: 'Harassment', title: 'Harassment', subtitle: 'Verbal, street, or behavioral intimidation', icon: ShieldAlert },
  { id: 'Stalking', title: 'Stalking', subtitle: 'Repeated tracking, watching, or following', icon: Eye },
  { id: 'Threat', title: 'Threat', subtitle: 'Direct intimidation, coercion, or danger', icon: AlertTriangle },
  { id: 'Unsafe Location', title: 'Unsafe Location', subtitle: 'Poor lighting, isolated route, physical hazard', icon: MapPinOff },
  { id: 'Cyber Harassment', title: 'Cyber Harassment', subtitle: 'Online stalking, doxxing, abusive messages', icon: Globe },
  { id: 'Workplace Issue', title: 'Workplace Issue', subtitle: 'Hostile environment, boundary violation', icon: Briefcase },
  { id: 'College/University Issue', title: 'College/University Issue', subtitle: 'Campus safety, dorms, academic setting', icon: GraduationCap },
  { id: 'Domestic/Social Issue', title: 'Domestic/Social Issue', subtitle: 'Family, household, or partner safety concern', icon: Home },
  { id: 'Emergency', title: 'Immediate Danger / Emergency', subtitle: 'Active crisis requiring urgent escalation', icon: AlertCircle },
  { id: 'Other', title: 'Other Safety Concern', subtitle: 'General safety problem or non-listed incident', icon: HelpCircle },
  ];

  // Severities config
  const severityList: {
  id: ReportSeverity;
  title: string;
  level: string;
  subtitle: string;
  icon: React.ElementType;
  badgeClass: string;
  borderSelected: string;
  }[] = [
  {
  id: 'ADVICE_NEEDED',
  title: 'Advice Needed',
  level: 'Low',
  subtitle: 'Seeking guidance, non-urgent information, or sharing precautionary awareness.',
  icon: HelpCircle,
  badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  borderSelected: 'border-emerald-600 bg-emerald-50/40 ring-1 ring-emerald-600',
  },
  {
  id: 'CONCERNING',
  title: 'Concerning',
  level: 'Moderate',
  subtitle: 'Uncomfortable behavior, suspicious activity, poor lighting, or recurring hazard.',
  icon: AlertTriangle,
  badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
  borderSelected: 'border-amber-600 bg-amber-50/40 ring-1 ring-amber-600',
  },
  {
  id: 'SERIOUS',
  title: 'Serious',
  level: 'High',
  subtitle: 'Direct intimidation, repeated stalking, aggressive confrontation, or clear boundary breach.',
  icon: ShieldAlert,
  badgeClass: 'bg-orange-50 text-orange-700 border-orange-200',
  borderSelected: 'border-orange-600 bg-orange-50/40 ring-1 ring-orange-600',
  },
  {
  id: 'IMMEDIATE_DANGER',
  title: 'Immediate Danger',
  level: 'Critical',
  subtitle: 'Active threat, violent assault, or emergency situation requiring urgent intervention.',
  icon: AlertCircle,
  badgeClass: 'bg-red-50 text-red-700 border-red-200',
  borderSelected: 'border-red-600 bg-red-50/40 ring-1 ring-red-600',
  },
  ];

  // Geolocation acquisition
  const handleAcquireGps = async () => {
  setLocLoading(true);
  setLocError(null);
  try {
  const coords = await getCurrentCoordinates();
  setGpsCoordinates({
  latitude: coords.latitude,
  longitude: coords.longitude,
  accuracy: coords.accuracy,
  });
  setLocationType('CURRENT_GPS');
  } catch (err: any) {
  setLocError(err.message || 'Unable to access browser GPS sensor.');
  setLocationType('MANUAL');
  } finally {
  setLocLoading(false);
  }
  };

  // Step advancement validation
  const handleNextStep = () => {
  setStepError(null);

  if (currentStep === 1 && !category) {
  setStepError('Please select an incident category to continue.');
  return;
  }

  if (currentStep === 2 && !severity) {
  setStepError('Please select an incident severity level.');
  return;
  }

  if (currentStep === 3 && !incidentDateTime) {
  setStepError('Please specify the date and time when the incident took place.');
  return;
  }

  if (currentStep === 4) {
  if (locationType === 'MANUAL' && !manualLocation.trim()) {
  setStepError('Please enter a location name, landmark, or area description.');
  return;
  }
  if (locationType === 'CURRENT_GPS' && !gpsCoordinates) {
  // Trigger auto-fetch if not yet acquired
  handleAcquireGps();
  }
  }

  if (currentStep === 5) {
  const trimmed = description.trim();
  if (!trimmed || trimmed.length < 10) {
  setStepError('Please enter a brief description (at least 10 characters) of what happened.');
  return;
  }
  if (LINK_PATTERN.test(trimmed)) {
  setStepError('Your report contains prohibited external links or URL shorteners. Sabhijude is strictly reserved for safety incidents.');
  return;
  }
  if (CHAR_REPEAT_PATTERN.test(trimmed)) {
  setStepError('Please write a meaningful description. Repetitive characters or symbols cannot be published.');
  return;
  }
  if (WORD_LOOP_PATTERN.test(trimmed)) {
  setStepError('Please describe what happened. The same word repeated over and over can’t be published.');
  return;
  }
  if (CONSONANT_RUN_PATTERN.test(trimmed)) {
  setStepError('Part of your description looks like random letters. Please describe the situation in words.');
  return;
  }
  }

  setCurrentStep((prev) => Math.min(prev + 1, 7));
  };

  const handlePrevStep = () => {
  setStepError(null);
  setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // Final Submission
  const handleSubmitReport = async () => {
  setIsSubmitting(true);
  setStepError(null);

  const locationName =
  locationType === 'CURRENT_GPS'
  ? gpsCoordinates
  ? `Lat: ${gpsCoordinates.latitude.toFixed(4)}, Lon: ${gpsCoordinates.longitude.toFixed(4)} (±${Math.round(gpsCoordinates.accuracy)}m)`
  : 'Current GPS Coordinates'
  : locationType === 'MANUAL'
  ? manualLocation
  : 'Location not shared (Privacy protected)';

  const incidentIso = incidentDateTime
  ? new Date(incidentDateTime).toISOString()
  : new Date().toISOString();

  const timeframeText = incidentDateTime
  ? new Date(incidentDateTime).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })
  : 'Just now';

  try {
  // 1. Save to local reports store with case management timeline
  const saved = ReportsStore.saveReport({
  category,
  severity,
  timeframe: timeframeText,
  customDate: incidentDateTime,
  locationType,
  locationName,
  latitude: gpsCoordinates?.latitude,
  longitude: gpsCoordinates?.longitude,
  description,
  hasEvidence: false,
  evidenceNames: [],
  visibility,
  postVisibilityId: visibility === 'PUBLIC' ? postVisibilityId : 1,
  audienceGenderId: visibility === 'PUBLIC' ? (postVisibilityId === 2 ? 1 : postVisibilityId === 3 ? 2 : postVisibilityId === 4 ? 3 : null) : null,
  isAnonymous,
  });

  // 2. Also forward to backend API database
  try {
  const categoryIdMap: Record<ReportCategory, number> = {
  'Harassment': 1,
  'Stalking': 2,
  'Threat': 3,
  'Unsafe Location': 4,
  'Cyber Harassment': 5,
  'Workplace Issue': 6,
  'College/University Issue': 7,
  'Domestic/Social Issue': 8,
  'Emergency': 9,
  'Other': 10,
  };

  const severityIdMap: Record<ReportSeverity, number> = {
  'ADVICE_NEEDED': 1,
  'CONCERNING': 2,
  'SERIOUS': 3,
  'IMMEDIATE_DANGER': 4,
  };

  const backendVis = visibility === 'ONLY_ME' ? 'PRIVATE' : 'PUBLIC';
  const postRes = await api.createPost({
  content: description.trim(),
  categoryId: categoryIdMap[category] ?? 1,
  severity: severity,
  postSeverityId: severityIdMap[severity] ?? 2,
  postStatusId: 1,
  isAnonymous,
  visibility: backendVis,
  postVisibilityId,
  audienceGenderId: postVisibilityId === 2 ? 1 : postVisibilityId === 3 ? 2 : postVisibilityId === 4 ? 3 : null,
  incidentDateTime: incidentIso,
  location: locationName,
  });

  if (visibility !== 'ONLY_ME' && !postRes.ok) {
  setStepError(postRes.error || 'Your report could not be published due to content guidelines. Please review and ensure it describes a safety issue.');
  // A 400 means the moderator rejected the text, so take the user straight to the description
  if (postRes.status === 400) setCurrentStep(5);
  setIsSubmitting(false);
  return;
  }

  if (postRes.ok && postRes.data) {
  try {
  const rawIds = localStorage.getItem('safecircle_my_post_ids');
  const ids: number[] = rawIds ? JSON.parse(rawIds) : [];
  const newUuid = (postRes.data as any).uuid;
  const newId = (postRes.data as any).id;
  if (newUuid && !ids.includes(newUuid)) {
    ids.unshift(newUuid);
  }
  if (newId && !ids.includes(newId)) {
    ids.unshift(newId);
  }
  localStorage.setItem('safecircle_my_post_ids', JSON.stringify(ids.slice(0, 100)));
  const rawPosts = localStorage.getItem('safecircle_my_posted_posts');
  const postList: any[] = rawPosts ? JSON.parse(rawPosts) : [];
  postList.unshift(postRes.data);
  localStorage.setItem('safecircle_my_posted_posts', JSON.stringify(postList.slice(0, 100)));
  } catch (storageErr) {
  console.warn('Could not cache user post locally:', storageErr);
  }
  }
  } catch (backendErr: any) {
  setStepError(backendErr.message || 'Error connecting to the safety service.');
  setIsSubmitting(false);
  return;
  }

  setSubmittedReport(saved);
  setCurrentStep(8); // Show confirmation step
  } catch (err: any) {
  setStepError(err.message || 'Error submitting report. Please try again.');
  } finally {
  setIsSubmitting(false);
  }
  };

  const STEPS = [
    { label: 'Type', icon: FileText },
    { label: 'Severity', icon: AlertTriangle },
    { label: 'When', icon: Clock },
    { label: 'Where', icon: MapPin },
    { label: 'Details', icon: Info },
    { label: 'Privacy', icon: Lock },
    { label: 'Review', icon: CheckCircle2 },
  ];

  const SEVERITY_STYLE: Record<ReportSeverity, { dot: string; chip: string; ring: string; bar: number }> = {
    ADVICE_NEEDED: { dot: 'bg-emerald-500', chip: 'bg-emerald-50 text-emerald-700', ring: 'border-emerald-500 ring-4 ring-emerald-500/10', bar: 1 },
    CONCERNING: { dot: 'bg-amber-500', chip: 'bg-amber-50 text-amber-700', ring: 'border-amber-500 ring-4 ring-amber-500/10', bar: 2 },
    SERIOUS: { dot: 'bg-orange-500', chip: 'bg-orange-50 text-orange-700', ring: 'border-orange-500 ring-4 ring-orange-500/10', bar: 3 },
    IMMEDIATE_DANGER: { dot: 'bg-red-600', chip: 'bg-red-50 text-red-700', ring: 'border-red-600 ring-4 ring-red-600/10', bar: 4 },
  };

  const AUDIENCES = [
    { id: 1, label: 'Everyone', icon: Users },
    { id: 2, label: 'Women', icon: Shield },
    { id: 3, label: 'Men', icon: User },
    { id: 4, label: 'Other', icon: Sparkles },
  ];

  const currentSeverity = severityList.find((s) => s.id === severity);
  const currentCategory = categoriesList.find((c) => c.id === category);
  const audienceLabel = AUDIENCES.find((a) => a.id === postVisibilityId)?.label || 'Everyone';

  const locationSummary =
    locationType === 'CURRENT_GPS'
      ? gpsCoordinates
        ? `Current location (±${Math.round(gpsCoordinates.accuracy)} m)`
        : 'Current location'
      : locationType === 'MANUAL'
      ? manualLocation || 'Not entered yet'
      : 'Not shared';

  const whenSummary = incidentDateTime
    ? new Date(incidentDateTime).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
    : 'Not set';

  // Quick presets for step 3 — each returns a local datetime-local string
  const toLocalInput = (d: Date) => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  const TIME_PRESETS = [
    { label: 'Just now', get: () => new Date() },
    { label: '1 hour ago', get: () => new Date(Date.now() - 3600000) },
    { label: 'This morning', get: () => { const d = new Date(); d.setHours(9, 0, 0, 0); return d > new Date() ? new Date() : d; } },
    { label: 'Yesterday evening', get: () => { const d = new Date(); d.setDate(d.getDate() - 1); d.setHours(19, 0, 0, 0); return d; } },
  ];

  const hasBadLink = LINK_PATTERN.test(description);
  const hasRepeats = CHAR_REPEAT_PATTERN.test(description) || WORD_LOOP_PATTERN.test(description);
  const hasGibberish = CONSONANT_RUN_PATTERN.test(description);
  const descLen = description.trim().length;

  const goToStep = (step: number) => {
    if (step < currentStep) {
      setStepError(null);
      setCurrentStep(step);
    }
  };

  const optionClass = (selected: boolean) =>
    `relative w-full text-left rounded-2xl border bg-white transition ${
      selected ? 'border-brand ring-4 ring-brand/10' : 'border-slate-200 hover:border-slate-300 hover:shadow-[0_8px_24px_-16px_rgba(11,22,48,0.25)]'
    }`;

  const selectedTick = () => (
    <span className="absolute top-2.5 right-2.5 h-5 w-5 rounded-full bg-brand text-white flex items-center justify-center">
      <Check className="h-3 w-3" />
    </span>
  );

  const stepHeading = (title: string, subtitle: string) => (
    <div className="space-y-2">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand">Step {currentStep} of 7</p>
      <h2 className="font-display text-2xl sm:text-[1.75rem] leading-tight font-extrabold tracking-[-0.02em] text-ink">{title}</h2>
      <p className="text-slate-500">{subtitle}</p>
    </div>
  );

  const NEXT_LABEL: Record<number, string> = {
    1: 'Severity',
    2: 'When it happened',
    3: 'Location',
    4: 'Details',
    5: 'Privacy',
    6: 'Review',
  };

  return (
    <div className="space-y-6">
      {currentStep <= 7 && (
        <>
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1.5">
              
              <p className="text-slate-500">Takes about two minutes. You choose who sees it — and you can stay anonymous.</p>
            </div>
            <a
              href="tel:112"
              className="inline-flex items-center gap-2 self-start whitespace-nowrap rounded-full bg-red-50 border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100 transition"
            >
              <Phone className="h-4 w-4" /> In danger now? Call 112
            </a>
          </div>

          {/* Stepper */}
          <nav aria-label="Report progress" className="rounded-3xl bg-white border border-slate-200/80 p-3 sm:p-4">
            <ol className="flex items-center">
              {STEPS.map((s, i) => {
                const n = i + 1;
                const done = n < currentStep;
                const active = n === currentStep;
                const Icon = s.icon;
                return (
                  <li key={s.label} className={`flex items-center ${i < STEPS.length - 1 ? 'flex-1' : ''}`}>
                    <button
                      type="button"
                      onClick={() => goToStep(n)}
                      disabled={!done}
                      aria-current={active ? 'step' : undefined}
                      className={`group flex items-center gap-2 rounded-full transition ${done ? 'cursor-pointer' : 'cursor-default'} ${
                        active ? 'bg-ink text-white p-1 sm:pr-3.5' : ''
                      }`}
                    >
                      <span
                        className={`h-7 w-7 sm:h-8 sm:w-8 shrink-0 rounded-full flex items-center justify-center text-xs font-bold transition ${
                          active
                            ? 'bg-white/15 text-white'
                            : done
                            ? 'bg-brand text-white group-hover:bg-brand-deep'
                            : 'bg-mist text-slate-400'
                        }`}
                      >
                        {done ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                      </span>
                      <span className={`text-sm font-semibold ${active ? 'hidden sm:inline' : 'hidden xl:inline'} ${done ? 'text-ink' : active ? '' : 'text-slate-400'}`}>
                        {s.label}
                      </span>
                    </button>
                    {i < STEPS.length - 1 && (
                      <span className={`mx-1 sm:mx-2 h-0.5 min-w-2 flex-1 rounded-full ${n < currentStep ? 'bg-brand' : 'bg-slate-200'}`} />
                    )}
                  </li>
                );
              })}
            </ol>
          </nav>
        </>
      )}

      <div className={currentStep <= 7 ? 'grid xl:grid-cols-12 gap-6 items-start' : ''}>
        <div className={currentStep <= 7 ? 'xl:col-span-8' : 'max-w-2xl mx-auto'}>
          {currentStep <= 7 && (
            <div className="rounded-3xl bg-white border border-slate-200/80 overflow-hidden">
              <div className="p-5 sm:p-8 space-y-6">
                {stepError && (
                  <div role="alert" className="rounded-2xl bg-amber-50 border border-amber-200 p-4 text-sm text-amber-900 flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />
                    <span>{stepError}</span>
                  </div>
                )}

                {/* STEP 1 — category */}
                {currentStep === 1 && (
                  <>
                    {stepHeading('What happened?', 'Pick the closest match. It helps route your report to the right people.')}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {categoriesList.map((cat) => {
                        const Icon = cat.icon;
                        const selected = category === cat.id;
                        const urgent = cat.id === 'Emergency';
                        return (
                          <button key={cat.id} type="button" onClick={() => setCategory(cat.id)} className={`${optionClass(selected)} p-4 flex items-start gap-3.5`}>
                            <span
                              className={`h-11 w-11 shrink-0 rounded-xl flex items-center justify-center transition ${
                                selected ? (urgent ? 'bg-red-600 text-white' : 'bg-brand text-white') : urgent ? 'bg-red-50 text-red-600' : 'bg-brand-tint text-brand'
                              }`}
                            >
                              <Icon className="h-5 w-5" />
                            </span>
                            <span className="pr-7 min-w-0">
                              <span className="block font-semibold text-ink">{cat.title}</span>
                              <span className="block text-sm text-slate-500 leading-snug mt-0.5">{cat.subtitle}</span>
                            </span>
                            {selected && selectedTick()}
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}

                {/* STEP 2 — severity */}
                {currentStep === 2 && (
                  <>
                    {stepHeading('How serious is it?', 'This helps moderators and responders decide what to look at first.')}
                    <div className="space-y-3">
                      {severityList.map((sev) => {
                        const selected = severity === sev.id;
                        const style = SEVERITY_STYLE[sev.id];
                        const Icon = sev.icon;
                        return (
                          <button
                            key={sev.id}
                            type="button"
                            onClick={() => setSeverity(sev.id)}
                            className={`relative w-full text-left rounded-2xl border bg-white p-4 sm:p-5 flex items-center gap-4 transition ${
                              selected ? style.ring : 'border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            <span className={`h-12 w-12 shrink-0 rounded-xl flex items-center justify-center ${style.chip}`}>
                              <Icon className="h-5 w-5" />
                            </span>
                            <span className="flex-1 min-w-0">
                              <span className="flex flex-wrap items-center gap-2">
                                <span className="font-semibold text-ink">{sev.title}</span>
                                <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${style.chip}`}>{sev.level}</span>
                              </span>
                              <span className="block text-sm text-slate-500 mt-1 leading-snug">{sev.subtitle}</span>
                            </span>
                            {/* intensity meter */}
                            <span className="hidden sm:flex items-end gap-1 h-8" aria-hidden>
                              {[1, 2, 3, 4].map((b) => (
                                <span key={b} className={`w-1.5 rounded-full ${b <= style.bar ? style.dot : 'bg-slate-200'}`} style={{ height: `${b * 25}%` }} />
                              ))}
                            </span>
                            <span className={`h-5 w-5 shrink-0 rounded-full border-2 flex items-center justify-center ${selected ? 'border-ink' : 'border-slate-300'}`}>
                              {selected && <span className="h-2.5 w-2.5 rounded-full bg-ink" />}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {severity === 'IMMEDIATE_DANGER' && (
                      <div className="rounded-2xl bg-red-600 text-white p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                        <AlertTriangle className="h-6 w-6 shrink-0" />
                        <p className="flex-1 text-sm leading-relaxed">
                          <strong className="block text-base">Don&rsquo;t wait for a review.</strong>
                          If you or someone nearby is in danger right now, call the police first.
                        </p>
                        <a href="tel:112" className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 transition">
                          <Phone className="h-4 w-4" /> Call 112
                        </a>
                      </div>
                    )}
                  </>
                )}

                {/* STEP 3 — when */}
                {currentStep === 3 && (
                  <>
                    {stepHeading('When did it happen?', 'A rough time is fine. It helps match lighting, shifts and CCTV coverage.')}
                    <div className="flex flex-wrap gap-2">
                      {TIME_PRESETS.map((p) => {
                        const value = toLocalInput(p.get());
                        const selected = incidentDateTime === value;
                        return (
                          <button
                            key={p.label}
                            type="button"
                            onClick={() => setIncidentDateTime(value)}
                            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                              selected ? 'bg-ink text-white' : 'bg-mist text-ink hover:bg-slate-200'
                            }`}
                          >
                            {p.label}
                          </button>
                        );
                      })}
                    </div>
                    <div className="rounded-2xl bg-mist p-5 space-y-3">
                      <label htmlFor="incident-datetime-input" className="flex items-center gap-2 text-sm font-semibold text-ink">
                        <Calendar className="h-4 w-4 text-brand" /> Or pick an exact date and time
                      </label>
                      <input
                        id="incident-datetime-input"
                        type="datetime-local"
                        value={incidentDateTime}
                        onChange={(e) => setIncidentDateTime(e.target.value)}
                        max={getLocalNowInputString()}
                        className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-white text-ink font-medium focus:outline-none focus:ring-4 focus:ring-brand/10 focus:border-brand"
                      />
                      <p className="text-sm text-slate-500">
                        Selected: <strong className="text-ink">{whenSummary}</strong>
                      </p>
                    </div>
                  </>
                )}

                {/* STEP 4 — where */}
                {currentStep === 4 && (
                  <>
                    {stepHeading('Where did it happen?', 'Helps others avoid unsafe spots. Exact coordinates are never shown publicly.')}
                    <div className="space-y-3">
                      {/* Current location */}
                      <div className={`${optionClass(locationType === 'CURRENT_GPS')} p-4 sm:p-5`}>
                        <button
                          type="button"
                          onClick={() => {
                            setLocationType('CURRENT_GPS');
                            if (!gpsCoordinates) handleAcquireGps();
                          }}
                          className="w-full flex items-center gap-4 text-left"
                        >
                          <span className="h-11 w-11 shrink-0 rounded-xl bg-brand-tint text-brand flex items-center justify-center"><Compass className="h-5 w-5" /></span>
                          <span className="pr-8">
                            <span className="block font-semibold text-ink">Use my current location</span>
                            <span className="block text-sm text-slate-500">Best if you&rsquo;re still near where it happened</span>
                          </span>
                        </button>
                        {locationType === 'CURRENT_GPS' && selectedTick()}
                        {locationType === 'CURRENT_GPS' && (
                          <div className="mt-4 rounded-xl bg-mist px-4 py-3 text-sm flex flex-wrap items-center justify-between gap-2">
                            {locLoading ? (
                              <span className="flex items-center gap-2 text-brand font-medium">
                                <span className="h-4 w-4 rounded-full border-2 border-brand border-t-transparent animate-spin" /> Finding your location…
                              </span>
                            ) : gpsCoordinates ? (
                              <span className="flex items-center gap-2 text-emerald-700 font-medium">
                                <CheckCircle2 className="h-4 w-4" /> Location found (±{Math.round(gpsCoordinates.accuracy)} m)
                              </span>
                            ) : (
                              <Button variant="outline" size="sm" onClick={handleAcquireGps}>Get my location</Button>
                            )}
                            {locError && <span className="text-red-600 text-xs">{locError}</span>}
                          </div>
                        )}
                      </div>

                      {/* Manual */}
                      <div className={`${optionClass(locationType === 'MANUAL')} p-4 sm:p-5`}>
                        <button type="button" onClick={() => setLocationType('MANUAL')} className="w-full flex items-center gap-4 text-left">
                          <span className="h-11 w-11 shrink-0 rounded-xl bg-coral-tint text-coral flex items-center justify-center"><MapPin className="h-5 w-5" /></span>
                          <span className="pr-8">
                            <span className="block font-semibold text-ink">Type a place</span>
                            <span className="block text-sm text-slate-500">A landmark, street, building or bus stop</span>
                          </span>
                        </button>
                        {locationType === 'MANUAL' && selectedTick()}
                        {locationType === 'MANUAL' && (
                          <input
                            type="text"
                            autoFocus
                            placeholder="e.g. East Gate walkway, City Central Library"
                            value={manualLocation}
                            onChange={(e) => setManualLocation(e.target.value)}
                            className="mt-4 w-full h-12 px-4 rounded-xl border border-slate-200 bg-white text-ink placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-brand/10 focus:border-brand"
                          />
                        )}
                      </div>

                      {/* None */}
                      <button type="button" onClick={() => setLocationType('NONE')} className={`${optionClass(locationType === 'NONE')} p-4 sm:p-5 flex items-center gap-4`}>
                        <span className="h-11 w-11 shrink-0 rounded-xl bg-mist text-slate-500 flex items-center justify-center"><MapPinOff className="h-5 w-5" /></span>
                        <span className="pr-8">
                          <span className="block font-semibold text-ink">Don&rsquo;t share a location</span>
                          <span className="block text-sm text-slate-500">Good for online harassment, or if you&rsquo;d rather not say</span>
                        </span>
                        {locationType === 'NONE' && selectedTick()}
                      </button>
                    </div>
                  </>
                )}

                {/* STEP 5 — details */}
                {currentStep === 5 && (
                  <>
                    {stepHeading('Tell us what happened', 'In your own words. Share only what you’re comfortable with.')}
                    <div className="grid sm:grid-cols-3 gap-2">
                      {['What did you see or hear?', 'Who was involved?', 'Are you safe now?'].map((q) => (
                        <div key={q} className="rounded-xl bg-mist px-3.5 py-2.5 text-sm text-slate-600 flex items-center gap-2">
                          <HelpCircle className="h-4 w-4 text-brand shrink-0" /> {q}
                        </div>
                      ))}
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="incident-description" className="sr-only">Incident description</label>
                      <textarea
                        id="incident-description"
                        rows={7}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Describe what happened…"
                        className="w-full p-4 rounded-2xl border border-slate-200 bg-white text-ink leading-relaxed placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-brand/10 focus:border-brand resize-y"
                      />
                      <div className="flex items-center gap-3 text-xs">
                        <div className="h-1.5 flex-1 rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${descLen >= 10 ? 'bg-emerald-500' : 'bg-amber-400'}`}
                            style={{ width: `${Math.min(100, (descLen / 120) * 100)}%` }}
                          />
                        </div>
                        <span className={descLen >= 10 ? 'text-emerald-700 font-medium' : 'text-slate-500'}>
                          {descLen >= 10 ? 'Looks good' : `${10 - descLen} more characters`} · {description.length}
                        </span>
                      </div>
                    </div>
                    {hasBadLink && (
                      <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-700 flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 shrink-0" /> Links and URL shorteners aren&rsquo;t allowed, to keep out spam and scams.
                      </div>
                    )}
                    {hasRepeats && (
                      <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-sm text-amber-800 flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 shrink-0" /> Please avoid repeating the same character or word over and over.
                      </div>
                    )}
                    {hasGibberish && (
                      <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-sm text-amber-800 flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 shrink-0" /> Some of this looks like random letters. Please describe what happened in words.
                      </div>
                    )}
                    <p className="flex items-start gap-2 text-xs text-slate-500">
                      <Shield className="h-4 w-4 text-brand shrink-0" />
                      Reports are for safety incidents only. Promotions, links and off-topic posts are removed by moderators.
                    </p>
                  </>
                )}

                {/* STEP 6 — privacy */}
                {currentStep === 6 && (
                  <>
                    {stepHeading('Who can see this?', 'You’re in control of who sees your report.')}
                    <div className="grid sm:grid-cols-2 gap-3">
                      {[
                        { id: 'PUBLIC' as ReportVisibility, title: 'Community', desc: 'Shared on the safety feed to warn others nearby.', icon: Globe },
                        { id: 'ONLY_ME' as ReportVisibility, title: 'Only me', desc: 'A private record for yourself. Not shared with anyone.', icon: Lock },
                      ].map((v) => {
                        const selected = visibility === v.id;
                        return (
                          <button key={v.id} type="button" onClick={() => setVisibility(v.id)} className={`${optionClass(selected)} p-5 space-y-3`}>
                            <span className={`h-11 w-11 rounded-xl flex items-center justify-center ${selected ? 'bg-brand text-white' : 'bg-brand-tint text-brand'}`}>
                              <v.icon className="h-5 w-5" />
                            </span>
                            <span className="block">
                              <span className="block font-semibold text-ink">{v.title}</span>
                              <span className="block text-sm text-slate-500 mt-0.5">{v.desc}</span>
                            </span>
                            {selected && selectedTick()}
                          </button>
                        );
                      })}
                    </div>

                    {visibility === 'PUBLIC' && (
                      <div className="space-y-3">
                        <p className="text-sm font-semibold text-ink">Show it to</p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 rounded-2xl bg-mist p-1.5">
                          {AUDIENCES.map((a) => {
                            const selected = postVisibilityId === a.id;
                            return (
                              <button
                                key={a.id}
                                type="button"
                                onClick={() => setPostVisibilityId(a.id)}
                                className={`flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                                  selected ? 'bg-white text-ink shadow-sm' : 'text-slate-500 hover:text-ink'
                                }`}
                              >
                                <a.icon className={`h-4 w-4 ${selected ? 'text-brand' : ''}`} /> {a.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    <button
                      type="button"
                      role="switch"
                      aria-checked={isAnonymous}
                      onClick={() => setIsAnonymous(!isAnonymous)}
                      className={`w-full rounded-2xl border p-5 flex items-center gap-4 text-left transition ${
                        isAnonymous ? 'border-emerald-200 bg-emerald-50/60' : 'border-slate-200 bg-white'
                      }`}
                    >
                      <span className={`h-11 w-11 shrink-0 rounded-xl flex items-center justify-center ${isAnonymous ? 'bg-emerald-600 text-white' : 'bg-mist text-slate-500'}`}>
                        {isAnonymous ? <Shield className="h-5 w-5" /> : <User className="h-5 w-5" />}
                      </span>
                      <span className="flex-1">
                        <span className="block font-semibold text-ink">Post anonymously</span>
                        <span className="block text-sm text-slate-500">
                          {isAnonymous
                            ? 'Your name, email and phone are hidden from everyone.'
                            : `Moderators will see your name (${user?.displayName || 'your account'}) so they can reach you.`}
                        </span>
                      </span>
                      <span className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${isAnonymous ? 'bg-emerald-600' : 'bg-slate-300'}`}>
                        <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-transform ${isAnonymous ? 'translate-x-6' : 'translate-x-1'}`} />
                      </span>
                    </button>
                  </>
                )}

                {/* STEP 7 — review */}
                {currentStep === 7 && (
                  <>
                    {stepHeading('Check and submit', 'Make sure everything looks right. Tap Edit to change anything.')}
                    <dl className="rounded-2xl border border-slate-200 divide-y divide-slate-100">
                      {[
                        { step: 1, label: 'Type', value: currentCategory?.title || category },
                        {
                          step: 2,
                          label: 'Severity',
                          value: (
                            <span className="inline-flex items-center gap-2">
                              <span className={`h-2 w-2 rounded-full ${SEVERITY_STYLE[severity].dot}`} />
                              {currentSeverity?.title} · {currentSeverity?.level}
                            </span>
                          ),
                        },
                        { step: 3, label: 'When', value: whenSummary },
                        { step: 4, label: 'Where', value: locationSummary },
                        { step: 5, label: 'Details', value: <span className="line-clamp-3 whitespace-pre-wrap">{description}</span> },
                        {
                          step: 6,
                          label: 'Visibility',
                          value: `${visibility === 'ONLY_ME' ? 'Only me' : `Community · ${audienceLabel}`} · ${isAnonymous ? 'Anonymous' : 'Named'}`,
                        },
                      ].map((row) => (
                        <div key={row.label} className="flex items-start gap-4 px-4 sm:px-5 py-4">
                          <dt className="w-20 shrink-0 text-sm text-slate-500">{row.label}</dt>
                          <dd className="flex-1 min-w-0 text-sm font-medium text-ink">{row.value}</dd>
                          <button type="button" onClick={() => goToStep(row.step)} className="shrink-0 text-sm font-semibold text-brand hover:text-brand-deep">
                            Edit
                          </button>
                        </div>
                      ))}
                    </dl>
                    <p className="flex items-center gap-2 text-sm text-slate-500">
                      <Lock className="h-4 w-4 text-emerald-600" /> Stored securely and shared only as you chose above.
                    </p>
                  </>
                )}
              </div>

              {/* Footer navigation */}
              <div className="flex items-center justify-between gap-3 border-t border-slate-100 bg-mist/50 px-5 sm:px-8 py-4">
                {currentStep > 1 ? (
                  <Button variant="ghost" onClick={handlePrevStep} disabled={isSubmitting} leftIcon={<ArrowLeft className="h-4 w-4" />}>
                    Back
                  </Button>
                ) : (
                  <span />
                )}
                {currentStep < 7 ? (
                  <Button variant="primary" onClick={handleNextStep} rightIcon={<ArrowRight className="h-4 w-4" />} className="bg-ink hover:bg-ink-soft shadow-none">
                    <span className="hidden sm:inline">Next: {NEXT_LABEL[currentStep]}</span>
                    <span className="sm:hidden">Continue</span>
                  </Button>
                ) : (
                  <Button variant="primary" size="lg" onClick={handleSubmitReport} loading={isSubmitting} leftIcon={<Check className="h-4 w-4" />}>
                    Submit report
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* STEP 8 — confirmation */}
          {currentStep === 8 && submittedReport && (
            <div className="rounded-3xl bg-white border border-slate-200/80 overflow-hidden">
              <div className="relative overflow-hidden bg-ink text-white px-6 sm:px-10 pt-10 pb-12 text-center">
                <div aria-hidden className="absolute -top-20 -right-10 h-64 w-64 rounded-full bg-brand/40 blur-3xl" />
                <div aria-hidden className="absolute -bottom-24 -left-10 h-64 w-64 rounded-full bg-emerald-500/25 blur-3xl" />
                <span className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 shadow-[0_12px_30px_-8px_rgba(16,185,129,0.8)]">
                  <Check className="h-8 w-8" />
                </span>
                <h1 className="relative mt-5 font-display text-3xl font-extrabold tracking-[-0.02em]">Thank you for speaking up.</h1>
                <p className="relative mt-2 text-white/70 max-w-md mx-auto">
                  Your report is in. Every report helps make a place safer for the next person.
                </p>
              </div>

              <div className="p-6 sm:p-10 space-y-8">
                <div className="rounded-2xl bg-mist p-5 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-slate-500">Reference</p>
                    <p className="font-mono font-bold text-ink">{submittedReport.id}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Status</p>
                    <StatusBadge status="Submitted" />
                  </div>
                  <div>
                    <p className="text-slate-500">Type</p>
                    <p className="font-semibold text-ink">{submittedReport.category}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Severity</p>
                    <p className="font-semibold text-ink">{severityList.find((s) => s.id === submittedReport.severity)?.title}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">What happens next</p>
                  <ol className="space-y-4">
                    {[
                      { t: 'Review', b: 'A moderator checks your report and assesses any immediate risk.' },
                      { t: 'Action', b: 'It’s routed based on your privacy choices — for example to campus security.' },
                      { t: 'Updates', b: 'Follow progress and add notes anytime from My reports.' },
                    ].map((s, i) => (
                      <li key={s.t} className="flex gap-4">
                        <span className={`h-8 w-8 shrink-0 rounded-full flex items-center justify-center text-sm font-bold ${i === 0 ? 'bg-brand text-white' : 'bg-mist text-slate-500'}`}>
                          {i + 1}
                        </span>
                        <span>
                          <span className="block font-semibold text-ink">{s.t}</span>
                          <span className="block text-sm text-slate-500">{s.b}</span>
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href="/myposts" className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-ink hover:bg-ink-soft px-6 py-3 font-semibold text-white transition">
                    <FileText className="h-4 w-4" /> Track in My reports
                  </Link>
                  <Link href="/" className="flex-1 inline-flex items-center justify-center rounded-full border border-slate-200 hover:bg-mist px-6 py-3 font-semibold text-ink transition">
                    Back to home
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Live summary sidebar */}
        {currentStep <= 7 && (
          <aside className="hidden xl:block xl:col-span-4 xl:sticky xl:top-28 space-y-4">
            

            <div className="rounded-3xl bg-ink text-white p-6 space-y-3">
              <p className="flex items-center gap-2 font-semibold">
                <Shield className="h-5 w-5 text-emerald-400" /> Your privacy is protected
              </p>
              <p className="text-sm text-white/65 leading-relaxed">
                Exact coordinates are never shown publicly — maps only show general areas. Anonymous reports hide your identity from everyone.
              </p>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
