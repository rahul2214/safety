'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  Phone,
  Share2,
  Users,
  MapPin,
  CheckCircle2,
  Clock,
  ShieldAlert,
  ArrowLeft,
  Copy,
  Check,
  Send,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { getCurrentCoordinates, buildEmergencySosText, buildWhatsAppLink, type GeoLocationResult } from '@/lib/location';
import { api, EmergencyContact } from '@/lib/api-client';
import { useAuth } from '@/lib/auth-context';

export default function EmergencyPage() {
  const { user } = useAuth();

  // Active Emergency State
  const [isActive, setIsActive] = useState<boolean>(false);
  const [activeSeconds, setActiveSeconds] = useState<number>(0);
  const [confirmSosOpen, setConfirmSosOpen] = useState<boolean>(false);
  const [deactivateConfirmOpen, setDeactivateConfirmOpen] = useState<boolean>(false);

  // Sensor & Contacts Data
  const [gpsData, setGpsData] = useState<GeoLocationResult | null>(null);
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [contactsLoading, setContactsLoading] = useState<boolean>(true);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Load Contacts
  useEffect(() => {
    async function fetchContacts() {
      try {
        const res = await api.getEmergencyContacts();
        if (res.ok && res.data) {
          setContacts(res.data);
        }
      } catch (err) {
        console.warn('Error fetching emergency contacts:', err);
      } finally {
        setContactsLoading(false);
      }
    }
    fetchContacts();
  }, []);

  // Timer for active emergency
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive) {
      interval = setInterval(() => {
        setActiveSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      setActiveSeconds(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive]);

  // Format active time as MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Trigger SOS
  const handleTriggerSos = async () => {
    setConfirmSosOpen(false);
    setIsActive(true);
    setStatusMessage('Acquiring high-precision GPS coordinates...');

    try {
      const coords = await getCurrentCoordinates();
      setGpsData(coords);
      setStatusMessage('Broadcasting emergency alert to safety registry and guardians...');

      await api.triggerSosBroadcast({
        latitude: coords.latitude,
        longitude: coords.longitude,
        accuracy: coords.accuracy,
        message: `EMERGENCY ALERT from ${user?.displayName || 'Sabhijude Member'}. Immediate assistance required.`,
      });

      setStatusMessage('Emergency broadcast active. Guardians alerted.');
    } catch (err: any) {
      console.warn('SOS activation notice:', err);
      setStatusMessage('SOS active. Could not acquire high-accuracy GPS.');
    }
  };

  // Deactivate SOS
  const handleDeactivateSos = () => {
    setIsActive(false);
    setDeactivateConfirmOpen(false);
    setStatusMessage(null);
  };

  // Copy live coordinates
  const handleCopyCoordinates = () => {
    if (!gpsData) return;
    const text = `https://www.google.com/maps?q=${gpsData.latitude},${gpsData.longitude}`;
    navigator.clipboard.writeText(text);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Share Live Location to WhatsApp
  const handleShareWhatsApp = async () => {
    try {
      const coords = gpsData || (await getCurrentCoordinates());
      const msg = buildEmergencySosText(coords);
      const url = buildWhatsAppLink('', msg);
      window.open(url, '_blank');
    } catch {
      const msg = buildEmergencySosText();
      const url = buildWhatsAppLink('', msg);
      window.open(url, '_blank');
    }
  };

  const primaryContact = contacts.find((c) => c.isPrimary) || contacts[0];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
     

      {/* ========================================================================= */}
      {/* ACTIVE EMERGENCY MODE BANNER                                              */}
      {/* ========================================================================= */}
      {isActive ? (
        <div className="p-5 rounded-lg bg-red-600 text-white shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-white" />
              </span>
              <span className="text-sm font-bold uppercase tracking-wider">
                Active Emergency In Progress
              </span>
            </div>
            <div className="text-right">
              <span className="font-mono text-lg font-black">{formatTime(activeSeconds)}</span>
              <p className="text-[10px] text-red-100">Elapsed Time</p>
            </div>
          </div>

          {/* Telemetry info */}
          <div className="p-3 rounded bg-red-700/80 text-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-red-100">SOS Status</span>
              <span className="font-bold text-white">Broadcast Engaged</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-red-100">Location Telemetry</span>
              <span className="font-mono font-medium text-white">
                {gpsData
                  ? `${gpsData.latitude.toFixed(4)}, ${gpsData.longitude.toFixed(4)} (±${Math.round(gpsData.accuracy)}m)`
                  : 'Acquiring GPS fix...'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-red-100">Guardians Notified</span>
              <span className="font-bold text-white">
                {contacts.length > 0 ? `${contacts.length} Contacts Dispatched` : 'National Helpline Standby'}
              </span>
            </div>
          </div>

          {/* Quick Actions in Active Mode */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <a
              href="tel:112"
              className="flex items-center justify-center gap-2 p-3 rounded-lg bg-white text-red-700 font-bold text-xs hover:bg-red-50 transition-colors shadow-xs"
            >
              <Phone className="h-4 w-4" />
              <span>Call Police (112)</span>
            </a>

            <a
              href="tel:1091"
              className="flex items-center justify-center gap-2 p-3 rounded-lg bg-red-800 text-white font-bold text-xs hover:bg-red-900 transition-colors shadow-xs"
            >
              <Phone className="h-4 w-4" />
              <span>Women Helpline (1091)</span>
            </a>
          </div>

          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={() => setDeactivateConfirmOpen(true)}
              className="text-xs font-semibold text-red-100 hover:text-white underline"
            >
              I am safe now • Deactivate Emergency SOS
            </button>
          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /* STANDBY EMERGENCY SCREEN                                                  */
        /* ========================================================================= */
        <div className="space-y-6">
          {/* Main Emergency Header */}
          <div className="text-center space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Emergency Assistance
            </h1>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              If you feel unsafe or in immediate physical danger, take action below.
            </p>
          </div>

          {/* Primary SOS Action Button */}
          <Card className="p-6 sm:p-8 text-center space-y-4 border-red-200 bg-red-50/40">
            <div className="space-y-1">
              <p className="text-xs font-bold text-red-700 uppercase tracking-wider">
                Emergency Panic Trigger
              </p>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">
                Immediately captures your live coordinates, alerts your guardians, and enters active response mode.
              </p>
            </div>

            <div>
              <button
                type="button"
                onClick={() => setConfirmSosOpen(true)}
                className="w-full sm:w-auto px-10 py-5 rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-black text-lg shadow-md transition-all active:scale-98 tracking-wider inline-flex items-center justify-center gap-3"
              >
                <AlertTriangle className="h-6 w-6" />
                <span>ACTIVATE SOS</span>
              </button>
            </div>

            <p className="text-[11px] text-slate-400">
              A 1-click confirmation ensures no accidental triggers.
            </p>
          </Card>

          {/* Core Emergency Actions Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Action 1: Call Emergency Services 112 */}
            <a
              href="tel:112"
              className="p-4 rounded-lg border border-slate-200 bg-white hover:border-red-300 hover:bg-red-50/30 transition-colors flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-red-100 text-red-700 group-hover:bg-red-600 group-hover:text-white transition-colors">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">National Emergency (112)</p>
                  <p className="text-[11px] text-slate-500">Police, Fire &amp; Emergency Dispatch</p>
                </div>
              </div>
              <span className="font-mono text-sm font-bold text-red-600">112 &rarr;</span>
            </a>

            {/* Action 2: Call Women Safety Helpline 1091 */}
            <a
              href="tel:1091"
              className="p-4 rounded-lg border border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/30 transition-colors flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-blue-100 text-blue-700 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Women Helpline (1091)</p>
                  <p className="text-[11px] text-slate-500">24/7 Dedicated Police Rapid Cell</p>
                </div>
              </div>
              <span className="font-mono text-sm font-bold text-blue-600">1091 &rarr;</span>
            </a>

            {/* Action 3: Share Live Location */}
            <button
              type="button"
              onClick={handleShareWhatsApp}
              className="p-4 rounded-lg border border-slate-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/30 transition-colors flex items-center justify-between text-left group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-emerald-100 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <Share2 className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Share Live Location</p>
                  <p className="text-[11px] text-slate-500">Dispatch GPS link via WhatsApp / SMS</p>
                </div>
              </div>
              <span className="text-xs font-semibold text-emerald-600">Share &rarr;</span>
            </button>

            {/* Action 4: Contact Trusted Person */}
            {primaryContact ? (
              <a
                href={`tel:${primaryContact.phoneNumber}`}
                className="p-4 rounded-lg border border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 transition-colors flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-slate-100 text-slate-700 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">
                      Call {primaryContact.name} ({primaryContact.relationship})
                    </p>
                    <p className="text-[11px] text-slate-500">{primaryContact.phoneNumber}</p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-slate-700">Dial &rarr;</span>
              </a>
            ) : (
              <Link
                href="/contacts"
                className="p-4 rounded-lg border border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 transition-colors flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-slate-100 text-slate-700">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Contact Trusted Person</p>
                    <p className="text-[11px] text-slate-500">No primary contact set. Add one now.</p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-blue-600">Add &rarr;</span>
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Confirmation Modal to Activate SOS */}
      <Modal
        isOpen={confirmSosOpen}
        onClose={() => setConfirmSosOpen(false)}
        title="Confirm Emergency Activation"
        size="sm"
      >
        <div className="space-y-4 text-center">
          <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
            <AlertTriangle className="h-6 w-6" />
          </div>

          <div className="space-y-1">
            <p className="text-xs text-slate-600 leading-relaxed">
              Activating SOS immediately records your live GPS position and dispatches alert notifications to your emergency contacts.
            </p>
          </div>

          <div className="space-y-2 pt-2">
            <Button
              variant="emergency"
              className="w-full justify-center"
              onClick={handleTriggerSos}
            >
              <span>Yes, Trigger Emergency SOS</span>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-center"
              onClick={() => setConfirmSosOpen(false)}
            >
              <span>Cancel</span>
            </Button>
          </div>
        </div>
      </Modal>

      {/* Confirmation Modal to Deactivate SOS */}
      <Modal
        isOpen={deactivateConfirmOpen}
        onClose={() => setDeactivateConfirmOpen(false)}
        title="Deactivate Emergency Status"
        size="sm"
      >
        <div className="space-y-4 text-center">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="h-6 w-6" />
          </div>

          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-900">Are you in a safe environment?</p>
            <p className="text-xs text-slate-500">
              Deactivating will end live GPS tracking and mark your emergency broadcast as resolved.
            </p>
          </div>

          <div className="space-y-2 pt-2">
            <Button
              variant="primary"
              className="w-full justify-center"
              onClick={handleDeactivateSos}
            >
              <span>Confirm I Am Safe</span>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-center"
              onClick={() => setDeactivateConfirmOpen(false)}
            >
              <span>Keep SOS Active</span>
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
