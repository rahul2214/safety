'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { getCurrentCoordinates } from '@/lib/location';
import {
  ReportsStore,
  ReportCategory,
  ReportSeverity,
  ReportTimeframe,
  ReportLocationType,
  ReportVisibility,
  SafetyReport,
} from '@/lib/reports-store';
import { api, PostVisibility } from '@/lib/api-client';
import { useAuth } from '@/lib/auth-context';

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
      if (/(?:bit\.ly|tinyurl\.com|t\.me|wa\.me|chat\.whatsapp\.com|shorturl\.at|ow\.ly|is\.gd|buff\.ly)/i.test(trimmed)) {
        setStepError('Your report contains prohibited external links or URL shorteners. Sabhijude is strictly reserved for safety incidents.');
        return;
      }
      if (/(.)\1{5,}/.test(trimmed)) {
        setStepError('Please write a meaningful description. Repetitive characters or symbols cannot be published.');
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
          hashtags: [category.toLowerCase().replace(/[^a-z0-9]/g, '')],
          incidentDateTime: incidentIso,
          location: locationName,
        });

        if (visibility !== 'ONLY_ME' && !postRes.ok) {
          setStepError(postRes.error || 'Your report could not be published due to content guidelines. Please review and ensure it describes a safety issue.');
          setIsSubmitting(false);
          return;
        }

        if (postRes.ok && postRes.data) {
          try {
            const rawIds = localStorage.getItem('safecircle_my_post_ids');
            const ids: number[] = rawIds ? JSON.parse(rawIds) : [];
            const newId = (postRes.data as any).id;
            if (newId && !ids.includes(newId)) {
              ids.unshift(newId);
              localStorage.setItem('safecircle_my_post_ids', JSON.stringify(ids.slice(0, 100)));
            }
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

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Top Breadcrumb & Title */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        

        {currentStep <= 7 && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500">
              Step {currentStep} of 7
            </span>
            <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 transition-all duration-300 rounded-full"
                style={{ width: `${(currentStep / 7) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Immediate Emergency Callout Banner */}
      {currentStep <= 7 && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-red-800">
            <AlertTriangle className="h-4 w-4 text-red-600 shrink-0" />
            <span>
              <strong>Are you in immediate physical danger?</strong> Call emergency services right now.
            </span>
          </div>
          <a
            href="tel:112"
            className="px-3 py-1 rounded bg-red-600 text-white font-semibold shrink-0 hover:bg-red-700 transition-colors"
          >
            Call 112
          </a>
        </div>
      )}

      {/* Step Error Notice */}
      {stepError && (
        <div className="p-3.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
          <span>{stepError}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 1: What happened?                                                    */}
      {/* ========================================================================= */}
      {currentStep === 1 && (
        <Card className="p-6 space-y-5">
          <div>
            <h1 className="text-lg font-bold text-slate-900">What happened?</h1>
            <p className="text-xs text-slate-500 mt-1">
              Select the category that best describes the incident. This helps route it to the appropriate responders.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {categoriesList.map((cat) => {
              const Icon = cat.icon;
              const isSelected = category === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`p-4 rounded-lg border text-left flex items-start gap-3 transition-colors ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/50 ring-1 ring-blue-600'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/80 bg-white'
                  }`}
                >
                  <div
                    className={`p-2 rounded-lg shrink-0 ${
                      isSelected
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-900">{cat.title}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{cat.subtitle}</p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <Button variant="primary" onClick={handleNextStep}>
              <span>Continue to Incident Severity</span>
              <ArrowRight className="h-4 w-4 ml-1.5" />
            </Button>
          </div>
        </Card>
      )}

      {/* ========================================================================= */}
      {/* STEP 2: Incident Severity                                                 */}
      {/* ========================================================================= */}
      {currentStep === 2 && (
        <Card className="p-6 space-y-5">
          <div>
            <h1 className="text-lg font-bold text-slate-900">How severe or urgent is this situation?</h1>
            <p className="text-xs text-slate-500 mt-1">
              Severity helps responders triage safety reports, prioritize interventions, and dispatch appropriate resources.
            </p>
          </div>

          <div className="space-y-3">
            {severityList.map((sev) => {
              const isSelected = severity === sev.id;
              const Icon = sev.icon;
              return (
                <div
                  key={sev.id}
                  onClick={() => setSeverity(sev.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? sev.borderSelected
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg shrink-0 ${isSelected ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-bold text-slate-900">{sev.title}</p>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${sev.badgeClass}`}>
                            {sev.level}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                          {sev.subtitle}
                        </p>
                      </div>
                    </div>
                    <div className="shrink-0 pt-0.5">
                      <input
                        type="radio"
                        name="severity"
                        checked={isSelected}
                        onChange={() => setSeverity(sev.id)}
                        className="h-4 w-4 text-blue-600 border-slate-300 focus:ring-blue-600"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {severity === 'IMMEDIATE_DANGER' && (
            <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 flex items-start gap-3 text-xs text-red-800">
              <AlertTriangle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Immediate Physical Danger Notice</p>
                <p className="text-[11px] mt-0.5 leading-relaxed">
                  If you or someone nearby is in active danger or being pursued, please contact emergency police dispatch (<strong>112</strong>) immediately instead of waiting for safety feed triage.
                </p>
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <Button variant="outline" onClick={handlePrevStep}>
              <ArrowLeft className="h-4 w-4 mr-1.5" />
              <span>Back</span>
            </Button>
            <Button variant="primary" onClick={handleNextStep}>
              <span>Continue to Date &amp; Time</span>
              <ArrowRight className="h-4 w-4 ml-1.5" />
            </Button>
          </div>
        </Card>
      )}

      {/* ========================================================================= */}
      {/* STEP 3: When did this happen?                                             */}
      {/* ========================================================================= */}
      {currentStep === 3 && (
        <Card className="p-6 space-y-5">
          <div>
            <h1 className="text-lg font-bold text-slate-900">When did this happen?</h1>
            <p className="text-xs text-slate-500 mt-1">
              Timing helps verify lighting, shift rosters, and CCTV coverage if applicable.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-blue-200 bg-blue-50/30 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-blue-100 text-blue-700 shrink-0">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <label htmlFor="incident-datetime-input" className="block text-xs font-bold text-slate-900">
                  Incident Date &amp; Time
                </label>
                <p className="text-[11px] text-slate-500">
                  Specify when this incident took place. Defaults to current date and time.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <input
                id="incident-datetime-input"
                type="datetime-local"
                value={incidentDateTime}
                onChange={(e) => setIncidentDateTime(e.target.value)}
                max={getLocalNowInputString()}
                className="w-full h-11 px-3.5 rounded-lg border border-slate-300 text-xs sm:text-sm font-medium text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-2xs"
              />

              <div className="flex items-center justify-between text-[11.5px] text-slate-500 pt-0.5 px-0.5">
                <span>
                  Selected:{' '}
                  <strong className="text-slate-800">
                    {incidentDateTime
                      ? new Date(incidentDateTime).toLocaleString('en-US', {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        })
                      : 'None'}
                  </strong>
                </span>
                <button
                  type="button"
                  onClick={() => setIncidentDateTime(getLocalNowInputString())}
                  className="text-blue-600 hover:text-blue-800 hover:underline font-semibold transition"
                >
                  Set to Right Now
                </button>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <Button variant="outline" onClick={handlePrevStep}>
              <ArrowLeft className="h-4 w-4 mr-1.5" />
              <span>Back</span>
            </Button>
            <Button variant="primary" onClick={handleNextStep}>
              <span>Continue to Location</span>
              <ArrowRight className="h-4 w-4 ml-1.5" />
            </Button>
          </div>
        </Card>
      )}

      {/* ========================================================================= */}
      {/* STEP 4: Where did this happen?                                            */}
      {/* ========================================================================= */}
      {currentStep === 4 && (
        <Card className="p-6 space-y-5">
          <div>
            <h1 className="text-lg font-bold text-slate-900">Where did this happen?</h1>
            <p className="text-xs text-slate-500 mt-1">
              Location details allow safety teams to identify hazardous areas and dispatch resources.
            </p>
          </div>

          <div className="space-y-3">
            {/* Option 1: Use Current Location */}
            <div
              onClick={() => {
                setLocationType('CURRENT_GPS');
                if (!gpsCoordinates) handleAcquireGps();
              }}
              className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                locationType === 'CURRENT_GPS'
                  ? 'border-blue-600 bg-blue-50/40 ring-1 ring-blue-600'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-100 text-blue-700">
                    <Compass className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-900">Use current location</p>
                    <p className="text-[11px] text-slate-500">
                      Acquires coordinates from your browser sensor
                    </p>
                  </div>
                </div>
                <input
                  type="radio"
                  name="locOption"
                  checked={locationType === 'CURRENT_GPS'}
                  onChange={() => setLocationType('CURRENT_GPS')}
                  className="h-4 w-4 text-blue-600 border-slate-300"
                />
              </div>

              {locationType === 'CURRENT_GPS' && (
                <div className="mt-3 pt-3 border-t border-blue-100 flex items-center justify-between text-xs">
                  {locLoading ? (
                    <span className="text-blue-700 font-medium">Acquiring sensor coordinates...</span>
                  ) : gpsCoordinates ? (
                    <span className="text-emerald-700 font-medium flex items-center gap-1.5">
                      <Check className="h-3.5 w-3.5" />
                      Coordinates: {gpsCoordinates.latitude.toFixed(4)}, {gpsCoordinates.longitude.toFixed(4)} (±{Math.round(gpsCoordinates.accuracy)}m)
                    </span>
                  ) : (
                    <Button variant="outline" size="sm" onClick={handleAcquireGps}>
                      Click to get GPS fix
                    </Button>
                  )}
                  {locError && <span className="text-red-600 text-[11px]">{locError}</span>}
                </div>
              )}
            </div>

            {/* Option 2: Select Location Manually */}
            <div
              onClick={() => setLocationType('MANUAL')}
              className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                locationType === 'MANUAL'
                  ? 'border-blue-600 bg-blue-50/40 ring-1 ring-blue-600'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-slate-100 text-slate-700">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-900">Select location manually</p>
                    <p className="text-[11px] text-slate-500">
                      Enter landmark, street name, building number, or transit stop
                    </p>
                  </div>
                </div>
                <input
                  type="radio"
                  name="locOption"
                  checked={locationType === 'MANUAL'}
                  onChange={() => setLocationType('MANUAL')}
                  className="h-4 w-4 text-blue-600 border-slate-300"
                />
              </div>

              {locationType === 'MANUAL' && (
                <div className="mt-3 pt-3 border-t border-slate-200">
                  <input
                    type="text"
                    placeholder="e.g. City Central Library, East Gate walkway, or Bus Stop #14"
                    value={manualLocation}
                    onChange={(e) => setManualLocation(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              )}
            </div>

            {/* Option 3: Don't share location */}
            <div
              onClick={() => setLocationType('NONE')}
              className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                locationType === 'NONE'
                  ? 'border-blue-600 bg-blue-50/40 ring-1 ring-blue-600'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-slate-100 text-slate-700">
                    <MapPinOff className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-900">Don&apos;t share location</p>
                    <p className="text-[11px] text-slate-500">
                      For online harassment or situations where you prefer total spatial anonymity
                    </p>
                  </div>
                </div>
                <input
                  type="radio"
                  name="locOption"
                  checked={locationType === 'NONE'}
                  onChange={() => setLocationType('NONE')}
                  className="h-4 w-4 text-blue-600 border-slate-300"
                />
              </div>
            </div>
          </div>

          {/* Privacy Notice Box */}
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-slate-800">
              <Lock className="h-3.5 w-3.5 text-blue-600" />
              <span>Location Privacy Guarantee</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Your exact coordinates are strictly protected and never displayed to the general public.
              Safety maps only show generalized zone-level clusters to protect individual anonymity.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <Button variant="outline" onClick={handlePrevStep}>
              <ArrowLeft className="h-4 w-4 mr-1.5" />
              <span>Back</span>
            </Button>
            <Button variant="primary" onClick={handleNextStep}>
              <span>Continue to Description</span>
              <ArrowRight className="h-4 w-4 ml-1.5" />
            </Button>
          </div>
        </Card>
      )}

      {/* ========================================================================= */}
      {/* STEP 5: Tell us what happened                                             */}
      {/* ========================================================================= */}
      {currentStep === 5 && (
        <Card className="p-6 space-y-5">
          <div>
            <h1 className="text-lg font-bold text-slate-900">Tell us what happened</h1>
            <p className="text-xs text-slate-500 mt-1">
              Please share as much detail as you feel comfortable with. Write in your own words.
            </p>
          </div>

          <div className="p-3 bg-purple-50/70 dark:bg-purple-950/20 rounded-lg border border-purple-100 dark:border-purple-900/40 text-[11.5px] text-purple-900 dark:text-purple-300 flex items-start gap-2.5">
            <Shield className="h-4 w-4 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold block mb-0.5">Community Safety Guardrails</span>
              <span className="opacity-90">Sabhijude is strictly reserved for safety incidents, hazards, and mutual alerts. Commercial promotions, links, gibberish, and unrelated topics (sales, recipes, sports) are automatically moderated to keep our circle safe.</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Incident Description <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what occurred, any individuals involved, what was said or done, and if you are currently in a secure environment..."
              className="w-full p-3 rounded-lg border border-slate-200 text-xs text-slate-900 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors"
            />
            {/(?:bit\.ly|tinyurl\.com|t\.me|wa\.me|chat\.whatsapp\.com|shorturl\.at|ow\.ly|is\.gd|buff\.ly)/i.test(description) && (
              <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-[11px] text-red-700 flex items-center gap-2">
                <AlertCircle className="h-3.5 w-3.5 text-red-600 shrink-0" />
                <span>External links and shorteners are prohibited on Sabhijude to prevent spam and scams.</span>
              </div>
            )}
            {/(.)\1{5,}/.test(description) && (
              <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-[11px] text-amber-800 flex items-center gap-2">
                <AlertCircle className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                <span>Please avoid repeated character loops or gibberish.</span>
              </div>
            )}
            <div className="flex justify-between items-center text-[11px] text-slate-400">
              <span>Minimum 10 characters</span>
              <span>{description.length} characters</span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <Button variant="outline" onClick={handlePrevStep}>
              <ArrowLeft className="h-4 w-4 mr-1.5" />
              <span>Back</span>
            </Button>
            <Button variant="primary" onClick={handleNextStep}>
              <span>Continue to Privacy</span>
              <ArrowRight className="h-4 w-4 ml-1.5" />
            </Button>
          </div>
        </Card>
      )}

      {/* ========================================================================= */}
      {/* STEP 6: Who should be able to see this?                                   */}
      {/* ========================================================================= */}
      {currentStep === 6 && (
        <Card className="p-6 space-y-5">
          <div>
            <h1 className="text-lg font-bold text-slate-900">Who should be able to see this?</h1>
            <p className="text-xs text-slate-500 mt-1">
              Select access permissions. You have full control over who receives this report.
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                id: 'PUBLIC' as ReportVisibility,
                title: 'Everyone (Public Community Feed)',
                description: 'Broadcast community safety alert visible on the public feed.',
              },
              {
                id: 'ONLY_ME' as ReportVisibility,
                title: 'Only Me',
                description: 'Private encrypted personal log for documentation purposes. No external escalation.',
              },
            ].map((vis) => {
              const isSelected = visibility === vis.id;
              return (
                <label
                  key={vis.id}
                  className={`flex items-start justify-between p-4 rounded-lg border cursor-pointer transition-colors ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/40 ring-1 ring-blue-600'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="visibility"
                      checked={isSelected}
                      onChange={() => setVisibility(vis.id)}
                      className="h-4 w-4 mt-0.5 text-blue-600 border-slate-300 focus:ring-blue-600"
                    />
                    <div>
                      <p className="text-xs font-semibold text-slate-900">{vis.title}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{vis.description}</p>
                    </div>
                  </div>
                </label>
              );
            })}
          </div>

          {/* Target Audience (When Public/Everyone is selected) */}
          {visibility === 'PUBLIC' && (
            <div className="p-4 rounded-xl border border-blue-200/80 bg-blue-50/40 space-y-3">
              <div>
                <p className="text-xs font-bold text-slate-900">Who should see this?</p>
                <p className="text-[11px] text-slate-500">
                  Select to whom this report is addressed:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  {
                    id: 1,
                    label: 'Everyone',
                    desc: 'Visible to all community members on the public feed',
                    icon: Users,
                  },
                  {
                    id: 2,
                    label: 'Women',
                    desc: 'Restricted to female accounts for privacy & safety',
                    icon: Shield,
                  },
                  {
                    id: 3,
                    label: 'Men',
                    desc: 'Addressed specifically to male community members',
                    icon: User,
                  },
                  {
                    id: 4,
                    label: 'Other',
                    desc: 'Non-binary and other gender identities',
                    icon: Sparkles,
                  },
                ].map((aud) => {
                  const isAudSelected = postVisibilityId === aud.id;
                  const Icon = aud.icon;
                  return (
                    <button
                      type="button"
                      key={aud.label}
                      onClick={() => setPostVisibilityId(aud.id)}
                      className={`p-3 rounded-lg border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                        isAudSelected
                          ? 'border-blue-600 bg-white ring-2 ring-blue-600/20 shadow-xs'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div
                        className={`p-1.5 rounded shrink-0 ${
                          isAudSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-900 flex items-center justify-between">
                          <span>{aud.label}</span>
                          {isAudSelected && <Check className="h-3 w-3 text-blue-600 ml-1" />}
                        </p>
                        <p className="text-[10px] text-slate-500 leading-tight mt-0.5">{aud.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Anonymous Reporting Switch */}
          <div className="p-4 rounded-lg border border-slate-200 bg-slate-50 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-900">Report Anonymously</p>
                <p className="text-[11px] text-slate-500">
                  Strip your name, email, and phone number from the report record.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAnonymous(!isAnonymous)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  isAnonymous ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isAnonymous ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="pt-2 text-[11px] text-slate-600 border-t border-slate-200/80 leading-relaxed">
              {isAnonymous ? (
                <span className="text-emerald-700 font-medium">
                  ✓ Anonymity Active: The review team will only see incident details, category, and timestamps.
                </span>
              ) : (
                <span className="text-slate-600">
                  Identified mode: Your account name ({user?.displayName || 'User'}) will be available to case officers to reach you directly.
                </span>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <Button variant="outline" onClick={handlePrevStep}>
              <ArrowLeft className="h-4 w-4 mr-1.5" />
              <span>Back</span>
            </Button>
            <Button variant="primary" onClick={handleNextStep}>
              <span>Review Before Submission</span>
              <ArrowRight className="h-4 w-4 ml-1.5" />
            </Button>
          </div>
        </Card>
      )}

      {/* ========================================================================= */}
      {/* STEP 7: Review before submission                                          */}
      {/* ========================================================================= */}
      {currentStep === 7 && (
        <Card className="p-6 space-y-5">
          <div>
            <h1 className="text-lg font-bold text-slate-900">Review before submission</h1>
            <p className="text-xs text-slate-500 mt-1">
              Please verify your report details. You will receive a unique tracking ID upon submission.
            </p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white divide-y divide-slate-100 text-xs">
            {/* Incident Category */}
            <div className="p-3.5 flex items-center justify-between">
              <span className="font-medium text-slate-500">Incident Category</span>
              <span className="font-semibold text-slate-900">{category}</span>
            </div>

            {/* Incident Severity */}
            <div className="p-3.5 flex items-center justify-between">
              <span className="font-medium text-slate-500">Incident Severity</span>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-900">
                  {severity === 'ADVICE_NEEDED'
                    ? 'Advice Needed'
                    : severity === 'CONCERNING'
                    ? 'Concerning'
                    : severity === 'SERIOUS'
                    ? 'Serious'
                    : 'Immediate Danger'}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                    severity === 'ADVICE_NEEDED'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : severity === 'CONCERNING'
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : severity === 'SERIOUS'
                      ? 'bg-orange-50 text-orange-700 border-orange-200'
                      : 'bg-red-50 text-red-700 border-red-200'
                  }`}
                >
                  {severity === 'ADVICE_NEEDED'
                    ? 'LOW'
                    : severity === 'CONCERNING'
                    ? 'MODERATE'
                    : severity === 'SERIOUS'
                    ? 'HIGH'
                    : 'CRITICAL'}
                </span>
              </div>
            </div>

            {/* Incident Date & Time */}
            <div className="p-3.5 flex items-center justify-between">
              <span className="font-medium text-slate-500">Incident Date & Time</span>
              <span className="font-semibold text-slate-900">
                {incidentDateTime ? new Date(incidentDateTime).toLocaleString() : 'Not specified'}
              </span>
            </div>

            {/* Location */}
            <div className="p-3.5 flex items-center justify-between">
              <span className="font-medium text-slate-500">Location</span>
              <span className="font-semibold text-slate-900 max-w-[280px] text-right truncate">
                {locationType === 'CURRENT_GPS'
                  ? gpsCoordinates
                    ? `GPS Sensor (±${Math.round(gpsCoordinates.accuracy)}m)`
                    : 'Current GPS'
                  : locationType === 'MANUAL'
                  ? manualLocation
                  : 'Location not shared'}
              </span>
            </div>

            {/* Description */}
            <div className="p-3.5 flex items-start justify-between gap-4">
              <span className="font-medium text-slate-500 shrink-0">Description</span>
              <p className="text-slate-800 text-right leading-relaxed max-w-sm line-clamp-3">
                {description}
              </p>
            </div>

            {/* Visibility & Target Audience */}
            <div className="p-3.5 flex items-center justify-between">
              <span className="font-medium text-slate-500">Visibility &amp; Target Audience</span>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-900">
                  {visibility === 'ONLY_ME'
                    ? 'Only Me (Private Log)'
                    : postVisibilityId === 2
                    ? 'Public • Women'
                    : postVisibilityId === 3
                    ? 'Public • Men'
                    : postVisibilityId === 4
                    ? 'Public • Other'
                    : 'Public • Everyone'}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    isAnonymous ? 'bg-slate-100 text-slate-700' : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  {isAnonymous ? 'ANONYMOUS' : 'IDENTIFIED'}
                </span>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>
              Your report will be stored securely with full encryption and routed according to your privacy settings.
            </span>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <Button variant="outline" onClick={handlePrevStep} disabled={isSubmitting}>
              <ArrowLeft className="h-4 w-4 mr-1.5" />
              <span>Back to Edit</span>
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmitReport}
              loading={isSubmitting}
            >
              <Check className="h-4 w-4 mr-1.5" />
              <span>Submit Confidential Report</span>
            </Button>
          </div>
        </Card>
      )}

      {/* ========================================================================= */}
      {/* STEP 8: Confirmation & Next Steps                                         */}
      {/* ========================================================================= */}
      {currentStep === 8 && submittedReport && (
        <Card className="p-6 sm:p-8 space-y-6 text-center">
          <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="h-8 w-8" />
          </div>

          <div className="space-y-1.5">
            <h1 className="text-xl font-bold text-slate-900">Your report has been submitted</h1>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Your report has been encrypted and recorded into our safety registry. Case officers have been alerted.
            </p>
          </div>

          {/* Case Reference Card */}
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 max-w-md mx-auto text-left space-y-2.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">Report Reference ID</span>
              <span className="font-mono font-bold text-slate-900 text-sm">{submittedReport.id}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">Incident Category</span>
              <span className="font-semibold text-slate-800">{submittedReport.category}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">Severity</span>
              <span className="font-semibold text-slate-800">
                {submittedReport.severity === 'ADVICE_NEEDED'
                  ? 'Advice Needed (Low)'
                  : submittedReport.severity === 'CONCERNING'
                  ? 'Concerning (Moderate)'
                  : submittedReport.severity === 'SERIOUS'
                  ? 'Serious (High)'
                  : 'Immediate Danger (Critical)'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">Initial Status</span>
              <StatusBadge status="Submitted" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">Logged Timestamp</span>
              <span className="text-slate-800 font-medium">Just now</span>
            </div>
          </div>

          {/* What Happens Next Timeline */}
          <div className="max-w-md mx-auto text-left space-y-3 pt-2">
            <p className="text-xs font-bold text-slate-900 uppercase tracking-wide">
              What happens next
            </p>
            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Triage &amp; Assessment</p>
                  <p className="text-[11px] text-slate-500">
                    A safety officer reviews your report within 15–30 minutes to evaluate immediate risk factors.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Coordinated Action</p>
                  <p className="text-[11px] text-slate-500">
                    Escalations occur based on your visibility settings (e.g. municipal patrol dispatch or campus security).
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Timeline &amp; Resolution</p>
                  <p className="text-[11px] text-slate-500">
                    You can track updates and post follow-up notes anytime under My Posts.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Action Buttons */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/myposts">
              <Button variant="primary">
                <FileText className="h-4 w-4 mr-1.5" />
                <span>Track in My Posts</span>
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline">
                <span>Return to Dashboard</span>
              </Button>
            </Link>
          </div>
        </Card>
      )}
    </div>
  );
}
