'use client';

import React, { useState, useEffect } from'react';
import Link from'next/link';
import {
  Users,
  UserPlus,
  Phone,
  Share2,
  Star,
  Trash2,
  ShieldCheck,
  ArrowLeft,
  CheckCircle2,
  Clock,
  AlertCircle,
  Lock,
  Plus,
  X,
  Info,
} from'lucide-react';
import { Button } from'@/components/ui/Button';
import { Card } from'@/components/ui/Card';
import { Modal } from'@/components/ui/Modal';
import { ContactCardSkeleton } from'@/components/ui/Skeleton';
import { getCurrentCoordinates, buildEmergencySosText, buildWhatsAppLink } from'@/lib/location';
import { api, EmergencyContact } from'@/lib/api-client';
import { useAuth } from'@/lib/auth-context';
import { useToast } from'@/components/Toast';

export default function TrustedContactsPage() {
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form Fields
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('Parent');
  const [phone, setPhone] = useState('');
  const [isPrimary, setIsPrimary] = useState(false);

  // Emergency Policy Settings
  const [autoShareLocation, setAutoShareLocation] = useState(true);
  const [smsNotification, setSmsNotification] = useState(true);

  const loadContacts = async () => {
  if (!isAuthenticated) return;
  setLoading(true);
  setError(null);
  try {
  const res = await api.getEmergencyContacts();
  if (res.ok && res.data) {
  setContacts(res.data);
  } else if (!res.ok) {
  setError(res.error || 'Failed to load emergency contacts from database.');
  setContacts([]);
  } else {
  setContacts([]);
  }
  } catch (e: any) {
  console.warn('Error loading contacts:', e);
  setError(e?.message || 'Unable to connect to backend database.');
  setContacts([]);
  } finally {
  setLoading(false);
  }
  };

  useEffect(() => {
  if (isAuthenticated) {
  loadContacts();
  }
  }, [isAuthenticated]);

  const handleAdd = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!name.trim() || !phone.trim()) return;

  setSubmitting(true);
  try {
  const res = await api.createEmergencyContact({
  name: name.trim(),
  phoneNumber: phone.trim(),
  relationship,
  isPrimary: isPrimary || contacts.length === 0,
  });

  if (res.ok) {
  showToast('Emergency contact added successfully.', 'success');
  setName('');
  setPhone('');
  setIsPrimary(false);
  setAddModalOpen(false);
  loadContacts();
  } else {
  showToast(res.error || 'Failed to save contact.', 'error');
  }
  } catch (err: any) {
  showToast(err.message || 'Error communicating with database.', 'error');
  } finally {
  setSubmitting(false);
  }
  };

  const handleDelete = async (phoneToDelete: string | number) => {
  try {
  const res = await api.deleteEmergencyContact(phoneToDelete);
  if (res.ok) {
  showToast('Emergency contact removed.', 'success');
  loadContacts();
  } else {
  showToast(res.error || 'Failed to remove contact.', 'error');
  }
  } catch (err: any) {
  showToast(err.message || 'Error deleting contact.', 'error');
  }
  };

  const handleSetPrimary = async (targetPhone: string) => {
  try {
  const res = await api.updateEmergencyContact(targetPhone, { isPrimary: true });
  if (res.ok) {
  showToast('Primary emergency responder updated.', 'success');
  loadContacts();
  } else {
  showToast(res.error || 'Could not update primary contact.', 'error');
  }
  } catch (err: any) {
  showToast(err.message || 'Error updating contact.', 'error');
  }
  };

  const handleSendWhatsAppSos = async (targetPhone: string) => {
  try {
  const coords = await getCurrentCoordinates();
  const msg = buildEmergencySosText(coords);
  const url = buildWhatsAppLink(targetPhone, msg);
  window.open(url, '_blank');
  } catch {
  const msg = buildEmergencySosText();
  const url = buildWhatsAppLink(targetPhone, msg);
  window.open(url, '_blank');
  }
  };

  return (
  <div className="max-w-4xl mx-auto space-y-6">
  {/* Header */}
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
  <div>
   
  <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-[-0.02em] text-ink">Trusted Emergency Contacts</h1>
  <p className="text-xs text-slate-500 mt-0.5">
  Designate guardians who will receive instantaneous coordinate dispatches when SOS is triggered.
  </p>
  </div>

  <Button variant="primary"onClick={() => setAddModalOpen(true)}>
  <UserPlus className="h-4 w-4 mr-1.5" />
  <span>Add Trusted Contact</span>
  </Button>
  </div>

  {/* Emergency Mode Dispatch Policy Configuration Card */}
  <Card className="p-5 border-blue-200 bg-blue-50/30 space-y-3">
  <div className="flex items-start gap-3">
  <div className="p-2 rounded-lg bg-blue-100 text-blue-700 shrink-0">
  <ShieldCheck className="h-5 w-5" />
  </div>
  <div className="space-y-1">
  <h2 className="text-xs font-bold text-slate-900">
  Emergency Dispatch Policy: Automatic Location Sharing
  </h2>
  <p className="text-xs text-slate-600 leading-relaxed">
  When SOS is activated, Sabhijude will automatically package your real-time GPS coordinates and dispatch an SMS alert to your verified contacts.
  </p>
  </div>
  </div>

  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-blue-100 text-xs">
  <label className="flex items-center justify-between p-3 rounded-lg bg-white border border-slate-200 cursor-pointer">
  <div className="space-y-0.5">
  <span className="font-semibold text-slate-900 block">Share Live GPS on SOS</span>
  <span className="text-[11px] text-slate-500 block">Sends high-accuracy map coordinates link</span>
  </div>
  <input
  type="checkbox"
  checked={autoShareLocation}
  onChange={(e) => setAutoShareLocation(e.target.checked)}
  className="h-4 w-4 rounded text-blue-600 focus:ring-blue-600"
  />
  </label>

  <label className="flex items-center justify-between p-3 rounded-lg bg-white border border-slate-200 cursor-pointer">
  <div className="space-y-0.5">
  <span className="font-semibold text-slate-900 block">High-Priority SMS Relay</span>
  <span className="text-[11px] text-slate-500 block">Delivers offline SMS bypass if data is weak</span>
  </div>
  <input
  type="checkbox"
  checked={smsNotification}
  onChange={(e) => setSmsNotification(e.target.checked)}
  className="h-4 w-4 rounded text-blue-600 focus:ring-blue-600"
  />
  </label>
  </div>
  </Card>

  {/* Contacts List */}
  <div className="space-y-3">
  <div className="flex items-center justify-between px-1">
  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
  Verified Contacts ({contacts.length} of 5 registered)
  </span>
  <span className="text-xs text-slate-500">
  Primary responder receives first telephone escalation
  </span>
  </div>

  {error ? (
  <Card className="p-8 text-center bg-red-50 border-red-200 space-y-3">
  <AlertCircle className="h-8 w-8 text-red-600 mx-auto" />
  <div className="space-y-1 max-w-md mx-auto">
  <h3 className="text-sm font-bold text-red-900">
  {error.toLowerCase().includes('logged in') || error.toLowerCase().includes('unauthorized')
  ? 'Authentication Required'
  : 'Backend Connection Error'}
  </h3>
  <p className="text-xs text-red-700">{error}</p>
  </div>
  {error.toLowerCase().includes('logged in') || error.toLowerCase().includes('unauthorized') ? (
  <Link href={`/login?redirect=/contacts`} className="inline-block">
  <Button size="sm">Sign In to Manage Contacts</Button>
  </Link>
  ) : (
  <Button variant="outline"size="sm"onClick={loadContacts} className="border-red-300 text-red-700 hover:bg-red-100">
  Retry Connection
  </Button>
  )}
  </Card>
  ) : loading ? (
  <div className="space-y-2.5">
  {[1, 2, 3].map((i) => (
  <ContactCardSkeleton key={i} />
  ))}
  </div>
  ) : contacts.length > 0 ? (
  <div className="space-y-2.5">
  {contacts.map((contact, index) => (
  <Card
  key={`${contact.id || contact.phoneNumber}-${contact.relationship || ''}-${index}`}
  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
  >
  {/* Contact Identity */}
  <div className="flex items-center gap-3.5">
  <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-700 font-bold text-sm flex items-center justify-center border border-slate-200 shrink-0">
  {contact.name.charAt(0).toUpperCase()}
  </div>

  <div className="space-y-0.5">
  <div className="flex items-center gap-2">
  <span className="text-xs font-bold text-slate-900">{contact.name}</span>
  {contact.isPrimary && (
  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
  PRIMARY RESPONDER
  </span>
  )}
  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
  <CheckCircle2 className="h-3 w-3 text-emerald-600" />
  Verified
  </span>
  </div>

  <p className="text-xs text-slate-500">
  {contact.relationship} • {contact.phoneNumber}
  </p>
  </div>
  </div>

  {/* Actions */}
  <div className="flex items-center gap-2 self-end sm:self-center">
  <a
  href={`tel:${contact.phoneNumber}`}
  className="p-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
  title="Call Contact"
  >
  <Phone className="h-4 w-4" />
  </a>

  <button
  type="button"
  onClick={() => handleSendWhatsAppSos(contact.phoneNumber)}
  className="px-3 py-1.5 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-semibold text-xs transition-colors flex items-center gap-1.5"
  title="Send Live GPS"
  >
  <Share2 className="h-3.5 w-3.5 text-emerald-700" />
  <span>Send GPS</span>
  </button>

  {!contact.isPrimary && (
  <button
  type="button"
  onClick={() => handleSetPrimary(contact.phoneNumber)}
  className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:text-amber-600 hover:bg-slate-50 transition-colors"
  title="Set as Primary Responder"
  >
  <Star className="h-4 w-4" />
  </button>
  )}

  <button
  type="button"
  onClick={() => handleDelete(contact.phoneNumber)}
  className="p-2 rounded-lg border border-slate-200 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
  title="Remove Contact"
  >
  <Trash2 className="h-4 w-4" />
  </button>
  </div>
  </Card>
  ))}
  </div>
  ) : (
  <Card className="p-10 text-center space-y-3">
  <Users className="h-8 w-8 text-slate-300 mx-auto" />
  <div>
  <p className="text-xs font-bold text-slate-900">No emergency contacts registered</p>
  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
  Add parents, siblings, partners, or trusted friends. They will receive automated notifications when you trigger emergency SOS.
  </p>
  </div>
  <div className="pt-2">
  <Button variant="primary"onClick={() => setAddModalOpen(true)}>
  <UserPlus className="h-4 w-4 mr-1.5" />
  <span>Add First Contact</span>
  </Button>
  </div>
  </Card>
  )}
  </div>

  {/* 24/7 Verified National Helplines */}
  <Card className="p-5 space-y-3">
  <div className="flex items-center justify-between">
  <div className="flex items-center gap-2">
  <ShieldCheck className="h-5 w-5 text-emerald-600" />
  <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
  Official 24/7 National Emergency Helplines
  </h2>
  </div>
  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
  Toll-Free &bull; 24/7
  </span>
  </div>

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
  <a
  href="tel:112"
  className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-white hover:border-red-300 transition-colors flex items-center justify-between group"
  >
  <div>
  <p className="text-xs font-bold text-slate-900">National Emergency</p>
  <p className="text-[11px] text-slate-500">Police / Medical (ERSS)</p>
  </div>
  <span className="font-mono text-sm font-black text-red-600">112</span>
  </a>

  <a
  href="tel:1091"
  className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-white hover:border-blue-300 transition-colors flex items-center justify-between group"
  >
  <div>
  <p className="text-xs font-bold text-slate-900">Women Safety Patrol</p>
  <p className="text-[11px] text-slate-500">Dedicated Police Unit</p>
  </div>
  <span className="font-mono text-sm font-black text-blue-600">1091</span>
  </a>

  <a
  href="tel:181"
  className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-white hover:border-purple-300 transition-colors flex items-center justify-between group"
  >
  <div>
  <p className="text-xs font-bold text-slate-900">Women in Distress</p>
  <p className="text-[11px] text-slate-500">Crisis &amp; Domestic Aid</p>
  </div>
  <span className="font-mono text-sm font-black text-purple-600">181</span>
  </a>

  <a
  href="tel:1930"
  className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-white hover:border-cyan-300 transition-colors flex items-center justify-between group"
  >
  <div>
  <p className="text-xs font-bold text-slate-900">Cyber Crime Cell</p>
  <p className="text-[11px] text-slate-500">Online Abuse / Stalking</p>
  </div>
  <span className="font-mono text-sm font-black text-cyan-600">1930</span>
  </a>
  </div>
  </Card>

  {/* Add Contact Modal */}
  <Modal
  isOpen={addModalOpen}
  onClose={() => setAddModalOpen(false)}
  title="Add Trusted Emergency Contact"
  size="md"
  >
  <form onSubmit={handleAdd} className="space-y-4">
  <div>
  <label className="block text-xs font-semibold text-slate-700 mb-1">
  Full Name <span className="text-red-500">*</span>
  </label>
  <input
  type="text"
  placeholder="e.g. Mom, Elena, or Brother"
  value={name}
  onChange={(e) => setName(e.target.value)}
  required
  className="w-full h-10 px-3 rounded-lg border border-slate-200 text-xs text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
  />
  </div>

  <div>
  <label className="block text-xs font-semibold text-slate-700 mb-1">
  Relationship <span className="text-red-500">*</span>
  </label>
  <select
  value={relationship}
  onChange={(e) => setRelationship(e.target.value)}
  className="w-full h-10 px-3 rounded-lg border border-slate-200 text-xs text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
  >
  <option value="Parent">Parent</option>
  <option value="Sibling">Sibling</option>
  <option value="Spouse">Spouse / Partner</option>
  <option value="Friend">Friend</option>
  <option value="Colleague">Colleague / Peer</option>
  <option value="Guardian">Legal Guardian</option>
  </select>
  </div>

  <div>
  <label className="block text-xs font-semibold text-slate-700 mb-1">
  Phone Number <span className="text-red-500">*</span>
  </label>
  <input
  type="tel"
  placeholder="+91 98765 43210"
  value={phone}
  onChange={(e) => setPhone(e.target.value)}
  required
  className="w-full h-10 px-3 rounded-lg border border-slate-200 text-xs text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
  />
  <p className="text-[11px] text-slate-400 mt-1">
  Include country code for reliable SMS dispatch.
  </p>
  </div>

  <label className="flex items-center gap-2 cursor-pointer pt-1">
  <input
  type="checkbox"
  checked={isPrimary}
  onChange={(e) => setIsPrimary(e.target.checked)}
  className="h-4 w-4 rounded text-blue-600 focus:ring-blue-600"
  />
  <span className="text-xs font-medium text-slate-700">
  Set as primary emergency responder
  </span>
  </label>

  <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
  <Button
  type="button"
  variant="outline"
  onClick={() => setAddModalOpen(false)}
  >
  Cancel
  </Button>
  <Button
  type="submit"
  variant="primary"
  loading={submitting}
  >
  Save Contact
  </Button>
  </div>
  </form>
  </Modal>
  </div>
  );
}
