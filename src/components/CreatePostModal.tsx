'use client';

import React, { useState } from'react';
import {
  X,
  ArrowLeft,
  ArrowRight,
  EyeOff,
  User,
  MapPin,
  Shield,
  ShieldCheck,
  Globe,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Lock,
  Loader2,
} from'lucide-react';
import { api, type Category } from'@/lib/api-client';
import { useAuth } from'@/lib/auth-context';
import { useToast } from'@/components/Toast';
import { getCurrentCoordinates } from'@/lib/location';

interface CreatePostModalProps {
  isOpen: boolean;
  categories: Category[];
  onClose: () => void;
  onPostCreated: () => void;
}

const TOTAL_STEPS = 5;
const MIN_CONTENT = 10;

export function CreatePostModal({ isOpen, categories, onClose, onPostCreated }: CreatePostModalProps) {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [step, setStep] = useState(1);
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [content, setContent] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
  categories.length > 0 ? categories[0].id : null
  );
  const [severity, setSeverity] = useState<'ADVICE_NEEDED' | 'CONCERNING' | 'CRITICAL'>('CONCERNING');
  const [visibility, setVisibility] = useState<'PUBLIC' | 'COMMUNITY_ONLY'>('PUBLIC');
  const [locationTag, setLocationTag] = useState<string | null>(null);
  const [locating, setLocating] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const canContinue = () => {
  if (step === 2) return content.trim().length >= MIN_CONTENT;
  if (step === 3) return selectedCategoryId !== null;
  return true;
  };

  const handleNext = () => {
  if (!canContinue()) {
  if (step === 2) {
  showToast(`Please describe what happened in at least ${MIN_CONTENT} characters.`, 'info');
  } else if (step === 3) {
  showToast('Please select a category for your post.', 'info');
  }
  return;
  }

  if (step === TOTAL_STEPS) {
  handleSubmit();
  return;
  }

  setStep((s) => Math.min(TOTAL_STEPS, s + 1));
  };

  const handleBack = () => {
  if (step === 1) {
  onClose();
  return;
  }
  setStep((s) => Math.max(1, s - 1));
  };

  const handleAttachLocation = async () => {
  setLocating(true);
  try {
  const coords = await getCurrentCoordinates();
  const tag = `Near ${coords.latitude.toFixed(4)}° N, ${coords.longitude.toFixed(4)}° E`;
  setLocationTag(tag);
  showToast('Approximate location attached to report.', 'success');
  } catch {
  showToast('Could not acquire GPS sensor fix.', 'info');
  } finally {
  setLocating(false);
  }
  };

  const handleSubmit = async () => {
  if (!selectedCategoryId) return;

  const trimmed = content.trim();
  if (trimmed.length < 10) {
  showToast('Please describe what happened (at least 10 characters).', 'info');
  return;
  }
  if (/(?:bit\.ly|tinyurl\.com|t\.me|wa\.me|chat\.whatsapp\.com|shorturl\.at|ow\.ly|is\.gd|buff\.ly)/i.test(trimmed)) {
  showToast('External links and shorteners are prohibited on Sabhijude to prevent spam and scams.', 'error');
  return;
  }
  if (/(.)\1{5,}/.test(trimmed)) {
  showToast('Please avoid repetitive characters or gibberish.', 'error');
  return;
  }

  setSubmitting(true);
  try {
  const res = await api.createPost({
  content: trimmed,
  categoryId: selectedCategoryId,
  severity,
  postSeverityId: severity === 'ADVICE_NEEDED' ? 1 : severity === 'CONCERNING' ? 2 : 4,
  postStatusId: 1,
  isAnonymous,
  visibility: 'PUBLIC',
  postVisibilityId: visibility === 'COMMUNITY_ONLY' ? 2 : 1,
  audienceGenderId: visibility === 'COMMUNITY_ONLY' ? 1 : null,
  incidentDateTime: new Date().toISOString(),
  location: locationTag || undefined,
  });

  if (res.ok) {
  showToast('Your post has been securely published to the circle.', 'success');
  setContent('');
  setLocationTag(null);
  setStep(1);
  onPostCreated();
  onClose();
  } else {
  showToast(res.error || 'Failed to publish post to database.', 'error');
  }
  } catch (err: any) {
  showToast(err.message || 'Error connecting to database.', 'error');
  } finally {
  setSubmitting(false);
  }
  };

  return (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm select-none">
  <div className="relative w-full max-w-lg bg-white rounded-[24px] border border-[#e8e8f0] shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
  {/* Top Wizard Navigation Bar (Matching mobile create.tsx) */}
  <div className="flex items-center justify-between px-5 py-4 border-b border-[#e8e8f0]">
  <button
  onClick={handleBack}
  className="w-9 h-9 rounded-full bg-[#f1f1f6] hover:bg-[#e8e8f0] flex items-center justify-center text-[#16161d] transition"
  >
  {step === 1 ? <X className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
  </button>

  <span className="text-[16px] font-black text-[#16161d]">
  Share what happened
  </span>

  <span className="px-2.5 py-1 rounded-full bg-[#f1edff] text-[#6d4aff] text-xs font-black">
  {step} / {TOTAL_STEPS}
  </span>
  </div>

  {/* 3px Progress Bar */}
  <div className="h-[3px] bg-[#f1f1f6] w-full">
  <div
  className="h-full bg-[#6d4aff] transition-all duration-300 ease-out"
  style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
  />
  </div>

  {/* Scrollable Step Body */}
  <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
  {/* STEP 1: POSTED AS (Anonymous vs Profile) */}
  {step === 1 && (
  <div className="space-y-3">
  <span className="text-[11px] font-black uppercase text-[#5b5b6e] tracking-[1px] block">
  POSTED AS
  </span>

  <div className="grid grid-cols-2 gap-3">
  {/* Anonymous Card */}
  <button
  type="button"
  onClick={() => setIsAnonymous(true)}
  className={`p-4 rounded-[18px] border text-left transition relative flex flex-col justify-between h-[120px] ${
  isAnonymous
  ? 'bg-[#f1edff] border-[#6d4aff]'
  : 'bg-white border-[#e8e8f0]'
  }`}
  >
  <div className="flex items-center justify-between">
  <div className="w-8 h-8 rounded-full bg-white text-[#6d4aff] flex items-center justify-center shadow-xs">
  <EyeOff className="h-4 w-4" />
  </div>
  {isAnonymous && <CheckCircle2 className="h-4 w-4 text-[#6d4aff]" />}
  </div>
  <div>
  <span className="text-sm font-bold text-[#16161d] block">
  Anonymous
  </span>
  <span className="text-xs text-[#6d4aff]">
  Your name stays hidden
  </span>
  </div>
  </button>

  {/* Show My Name Card */}
  <button
  type="button"
  onClick={() => setIsAnonymous(false)}
  className={`p-4 rounded-[18px] border text-left transition relative flex flex-col justify-between h-[120px] ${
  !isAnonymous
  ? 'bg-[#f1edff] border-[#6d4aff]'
  : 'bg-white border-[#e8e8f0]'
  }`}
  >
  <div className="flex items-center justify-between">
  <div className="w-8 h-8 rounded-full bg-[#f1f1f6] text-[#5b5b6e] flex items-center justify-center shadow-xs">
  <User className="h-4 w-4" />
  </div>
  {!isAnonymous && <CheckCircle2 className="h-4 w-4 text-[#6d4aff]" />}
  </div>
  <div>
  <span className="text-sm font-bold text-[#16161d] block truncate max-w-[130px]">
  {user?.displayName || 'My Profile'}
  </span>
  <span className="text-xs text-[#5b5b6e]">
  Posted as your profile
  </span>
  </div>
  </button>
  </div>
  </div>
  )}

  {/* STEP 2: YOUR STORY */}
  {step === 2 && (
  <div className="space-y-3">
  <span className="text-[11px] font-black uppercase text-[#5b5b6e] tracking-[1px] block">
  YOUR STORY
  </span>

  <div className="p-3.5 rounded-[16px] bg-[#f7f7fa] border border-[#e8e8f0] focus-within:border-[#6d4aff] focus-within:bg-white transition-colors">
  <textarea
  rows={5}
  maxLength={1000}
  value={content}
  onChange={(e) => setContent(e.target.value)}
  placeholder="Start with what happened, then what you need…"
  className="w-full bg-transparent border-0 p-0 text-[14.5px] text-[#16161d] focus:outline-none resize-none leading-relaxed"
  />

  <div className="pt-2 border-t border-[#e8e8f0] flex items-center justify-between text-xs text-[#5b5b6e]">
  <button
  type="button"
  onClick={handleAttachLocation}
  disabled={locating}
  className="flex items-center gap-1 hover:text-[#6d4aff] transition"
  >
  <MapPin className="h-3.5 w-3.5 text-[#6d4aff]" />
  <span>{locating ? 'Locating...' : locationTag ? 'Location Attached' : 'Attach Area Pin'}</span>
  </button>
  <span>{content.length} / 1000</span>
  </div>
  </div>

  {/(?:bit\.ly|tinyurl\.com|t\.me|wa\.me|chat\.whatsapp\.com|shorturl\.at)/i.test(content) && (
  <div className="p-2.5 rounded-[12px] bg-red-50 border border-red-200 text-[11px] text-red-700 flex items-center gap-2">
  <AlertTriangle className="h-3.5 w-3.5 text-red-600 shrink-0" />
  <span>External links and shorteners are prohibited on Sabhijude.</span>
  </div>
  )}
  </div>
  )}

  {/* STEP 3: CATEGORY */}
  {step === 3 && (
  <div className="space-y-3">
  <span className="text-[11px] font-black uppercase text-[#5b5b6e] tracking-[1px] block">
  CATEGORY
  </span>

  <div className="flex flex-wrap gap-2">
  {categories.map((cat) => {
  const selected = selectedCategoryId === cat.id;
  return (
  <button
  key={cat.id}
  type="button"
  onClick={() => setSelectedCategoryId(cat.id)}
  className={`px-4 py-2 rounded-full text-xs font-bold transition ${
  selected
  ? 'bg-[#6d4aff] text-white shadow-xs'
  : 'bg-[#f7f7fa] border border-[#e8e8f0] text-[#16161d]'
  }`}
  >
  {cat.name}
  </button>
  );
  })}
  </div>
  </div>
  )}

  {/* STEP 4: SEVERITY */}
  {step === 4 && (
  <div className="space-y-3">
  <div className="flex items-center justify-between">
  <span className="text-[11px] font-black uppercase text-[#5b5b6e] tracking-[1px] block">
  SEVERITY
  </span>
  <span className="text-[11px] text-[#9797ab]">Helps prioritize safety feed</span>
  </div>

  <div className="grid grid-cols-3 gap-2.5">
  {/* Low */}
  <button
  type="button"
  onClick={() => setSeverity('ADVICE_NEEDED')}
  className={`p-3 rounded-[16px] text-center transition border ${
  severity === 'ADVICE_NEEDED'
  ? 'bg-[#ecfdf5] border-[#059669] text-[#059669]'
  : 'bg-[#f7f7fa] border-[#e8e8f0] text-[#16161d]'
  }`}
  >
  <span className="w-2 h-2 rounded-full bg-[#059669] mx-auto block mb-1.5" />
  <span className="text-xs font-bold block">Low</span>
  </button>

  {/* Concerning */}
  <button
  type="button"
  onClick={() => setSeverity('CONCERNING')}
  className={`p-3 rounded-[16px] text-center transition border ${
  severity === 'CONCERNING'
  ? 'bg-[#fffbeb] border-[#d97706] text-[#d97706]'
  : 'bg-[#f7f7fa] border-[#e8e8f0] text-[#16161d]'
  }`}
  >
  <span className="w-2 h-2 rounded-full bg-[#d97706] mx-auto block mb-1.5" />
  <span className="text-xs font-bold block">Concerning</span>
  </button>

  {/* Urgent */}
  <button
  type="button"
  onClick={() => setSeverity('CRITICAL')}
  className={`p-3 rounded-[16px] text-center transition border ${
  severity === 'CRITICAL'
  ? 'bg-[#fff1f2] border-[#e11d48] text-[#e11d48]'
  : 'bg-[#f7f7fa] border-[#e8e8f0] text-[#16161d]'
  }`}
  >
  <span className="w-2 h-2 rounded-full bg-[#e11d48] mx-auto block mb-1.5" />
  <span className="text-xs font-bold block">Urgent</span>
  </button>
  </div>
  </div>
  )}

  {/* STEP 5: VISIBLE TO */}
  {step === 5 && (
  <div className="space-y-3">
  <span className="text-[11px] font-black uppercase text-[#5b5b6e] tracking-[1px] block">
  VISIBLE TO
  </span>

  <div className="grid grid-cols-2 gap-3">
  {/* Everyone */}
  <button
  type="button"
  onClick={() => setVisibility('PUBLIC')}
  className={`p-3.5 rounded-[16px] border text-left flex items-center justify-between transition ${
  visibility === 'PUBLIC'
  ? 'bg-[#f1edff] border-[#6d4aff] text-[#6d4aff]'
  : 'bg-[#f7f7fa] border-[#e8e8f0] text-[#16161d]'
  }`}
  >
  <div className="flex items-center gap-2">
  <Globe className="h-4 w-4" />
  <span className="text-xs font-bold">Everyone</span>
  </div>
  {visibility === 'PUBLIC' && <CheckCircle2 className="h-4 w-4" />}
  </button>

  {/* Women Only */}
  <button
  type="button"
  onClick={() => setVisibility('COMMUNITY_ONLY')}
  className={`p-3.5 rounded-[16px] border text-left flex items-center justify-between transition ${
  visibility === 'COMMUNITY_ONLY'
  ? 'bg-[#f1edff] border-[#6d4aff] text-[#6d4aff]'
  : 'bg-[#f7f7fa] border-[#e8e8f0] text-[#16161d]'
  }`}
  >
  <div className="flex items-center gap-2">
  <ShieldCheck className="h-4 w-4 text-[#059669]" />
  <span className="text-xs font-bold">Women only</span>
  </div>
  {visibility === 'COMMUNITY_ONLY' && <CheckCircle2 className="h-4 w-4" />}
  </button>
  </div>
  </div>
  )}

  {/* Privacy Footnote */}
  <div className="flex items-center justify-center gap-1.5 text-center text-[11px] text-[#9797ab] pt-2">
  <Lock className="h-3 w-3" />
  <span>All data is end-to-end encrypted and stripped of IP headers.</span>
  </div>
  </div>

  {/* Bottom Action Bar */}
  <div className="p-4 bg-white border-t border-[#e8e8f0]">
  <button
  type="button"
  onClick={handleNext}
  disabled={submitting}
  className="w-full h-[52px] rounded-[16px] bg-[#6d4aff] hover:bg-[#5325e8] text-white font-bold text-[14.5px] shadow-md shadow-[#6d4aff]/25 flex items-center justify-center gap-2 active:scale-[0.98] transition-transform disabled:opacity-50"
  >
  {submitting ? (
  <div className="flex items-center gap-2">
  <Loader2 className="h-4 w-4 animate-spin" />
  <span>Publishing to circle...</span>
  </div>
  ) : step === TOTAL_STEPS ? (
  <span>Publish Post to Circle</span>
  ) : (
  <>
  <span>Continue</span>
  <ArrowRight className="h-4 w-4" />
  </>
  )}
  </button>
  </div>
  </div>
  </div>
  );
}
