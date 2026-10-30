'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  AlertTriangle,
  MapPin,
  Phone,
  X,
  Share2,
  CheckCircle2,
  MessageSquare,
  ShieldAlert,
  Radio,
} from 'lucide-react';
import { getCurrentCoordinates, buildEmergencySosText, buildWhatsAppLink, type GeoLocationResult } from '@/lib/location';

interface SosModalProps {
  isOpen: boolean;
  onClose: () => void;
  primaryContactPhone?: string;
}

export function SosModal({ isOpen, onClose, primaryContactPhone = '919876543210' }: SosModalProps) {
  const [stage, setStage] = useState<'COUNTDOWN' | 'ACTIVE'>('COUNTDOWN');
  const [countdown, setCountdown] = useState(3);
  const [location, setLocation] = useState<GeoLocationResult | null>(null);
  const [locLoading, setLocLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const countdownTimer = useRef<any>(null);

  useEffect(() => {
    if (isOpen) {
      setStage('COUNTDOWN');
      setCountdown(3);
      setLocation(null);
      setLocLoading(true);

      // Start countdown
      countdownTimer.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownTimer.current);
            setStage('ACTIVE');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Fetch Geolocation
      getCurrentCoordinates()
        .then((loc) => {
          setLocation(loc);
          setLocLoading(false);
        })
        .catch(() => {
          setLocLoading(false);
        });
    } else {
      if (countdownTimer.current) clearInterval(countdownTimer.current);
    }

    return () => {
      if (countdownTimer.current) clearInterval(countdownTimer.current);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAbort = () => {
    if (countdownTimer.current) clearInterval(countdownTimer.current);
    onClose();
  };

  const sosText = buildEmergencySosText(location || undefined);
  const whatsAppLink = buildWhatsAppLink(primaryContactPhone, sosText);
  const smsLink = `sms:${primaryContactPhone}?body=${encodeURIComponent(sosText)}`;

  const copySosMessage = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(sosText);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#141420] border border-[#e11d48]/40 p-6 text-white shadow-2xl overflow-hidden">
        {/* Ambient warning wash */}
        <div className="absolute -top-24 -left-24 h-48 w-48 rounded-full bg-[#e11d48]/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 h-48 w-48 rounded-full bg-brand/20 blur-3xl pointer-events-none" />

        {stage === 'COUNTDOWN' ? (
          <div className="flex flex-col items-center text-center py-6">
            <div className="relative flex items-center justify-center h-32 w-32 rounded-full bg-[#e11d48]/10 border-4 border-[#e11d48] animate-pulse mb-6">
              <span className="text-6xl font-black text-[#e11d48]">{countdown}</span>
            </div>

            <h2 className="text-2xl font-bold tracking-tight text-white mb-2">Emergency SOS Triggering</h2>
            <p className="text-xs text-[#a6a6be] max-w-xs mb-8 leading-relaxed">
              Acquiring high-accuracy GPS coordinates and locking emergency alert channels. Tap cancel if this was accidental.
            </p>

            <button
              onClick={handleAbort}
              className="w-full py-3.5 rounded-2xl bg-[#242436] hover:bg-[#2e2e44] text-[#f4f4f8] font-bold transition border border-[#3b3b54] text-sm"
            >
              Cancel SOS (False Alarm)
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#26263a]">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#e11d48] opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#e11d48]" />
                </span>
                <span className="font-extrabold text-[#f43f5e] text-base uppercase tracking-wider flex items-center gap-1.5">
                  SOS Distress Active
                </span>
              </div>
              <button
                onClick={handleAbort}
                className="p-1.5 rounded-full hover:bg-[#26263a] text-slate-400 hover:text-white transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Live GPS Card */}
            <div className="rounded-2xl bg-[#1b1b2a] border border-ink-soft p-3.5 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[#f43f5e] text-[11px] font-bold uppercase tracking-wider">
                  <MapPin className="h-3.5 w-3.5" /> High-Accuracy Coordinates
                </span>
                <span className="text-[10px] text-[#059669] bg-[#ecfdf5]/10 px-2 py-0.5 rounded-full font-semibold">
                  Live Sync
                </span>
              </div>
              {locLoading ? (
                <p className="text-xs text-[#a6a6be] animate-pulse">Acquiring accurate GPS fix...</p>
              ) : location ? (
                <div>
                  <p className="text-xs text-[#f4f4f8] font-mono">
                    {location.latitude.toFixed(5)}, {location.longitude.toFixed(5)}{' '}
                    <span className="text-slate-400">(±{Math.round(location.accuracy)}m)</span>
                  </p>
                  <a
                    href={location.mapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-brand hover:underline inline-flex items-center gap-1 mt-0.5 font-semibold"
                  >
                    Open Live Pin in Google Maps &rarr;
                  </a>
                </div>
              ) : (
                <p className="text-xs text-slate-400">GPS signal pending. Enable browser location permission.</p>
              )}
            </div>

            {/* Immediate Safety Guidance */}
            <div className="rounded-2xl bg-brand/10 border border-brand/30 p-3 flex items-start gap-2.5">
              <ShieldAlert className="h-4 w-4 text-[#a78bfa] shrink-0 mt-0.5" />
              <div className="text-left space-y-0.5">
                <p className="text-[11px] font-bold text-[#c4b5fd]">Immediate Safety Guidance</p>
                <p className="text-[11px] text-[#e4e4ed] leading-relaxed">
                  Distress alert active. Move towards well-lit public areas, commercial storefronts, or security personnel.
                </p>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="grid grid-cols-2 gap-2.5">
              <a
                href={whatsAppLink}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 p-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] font-bold text-neutral-950 transition text-xs shadow-md shadow-[#25D366]/20"
              >
                <Share2 className="h-4 w-4" /> WhatsApp Distress
              </a>

              <a
                href={smsLink}
                className="flex items-center justify-center gap-2 p-3 rounded-xl bg-brand hover:bg-brand-deep font-bold text-white transition text-xs shadow-md shadow-brand/20"
              >
                <MessageSquare className="h-4 w-4" /> SMS Fallback
              </a>
            </div>



            {/* Direct Helplines */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Emergency Priority Helplines
              </span>
              <div className="grid grid-cols-3 gap-2">
                <a
                  href="tel:112"
                  className="flex flex-col items-center p-2 rounded-xl bg-[#1b1b2a] hover:bg-[#25253a] border border-ink-soft transition text-center"
                >
                  <span className="text-[10px] text-slate-400">Police / ER</span>
                  <span className="text-sm font-extrabold text-[#f43f5e]">112</span>
                </a>

                <a
                  href="tel:1091"
                  className="flex flex-col items-center p-2 rounded-xl bg-[#1b1b2a] hover:bg-[#25253a] border border-ink-soft transition text-center"
                >
                  <span className="text-[10px] text-slate-400">Women Helpline</span>
                  <span className="text-sm font-extrabold text-[#a78bfa]">1091</span>
                </a>

                <a
                  href="tel:181"
                  className="flex flex-col items-center p-2 rounded-xl bg-[#1b1b2a] hover:bg-[#25253a] border border-ink-soft transition text-center"
                >
                  <span className="text-[10px] text-slate-400">Distress / NCW</span>
                  <span className="text-sm font-extrabold text-[#059669]">181</span>
                </a>
              </div>
            </div>

            {/* Copy SOS details */}
            <button
              onClick={copySosMessage}
              className="w-full py-2 rounded-xl bg-[#1b1b2a] hover:bg-[#25253a] text-[11px] text-[#a6a6be] hover:text-white border border-ink-soft transition flex items-center justify-center gap-1.5 font-medium"
            >
              {copied ? <CheckCircle2 className="h-3.5 w-3.5 text-[#059669]" /> : null}
              {copied ? 'Copied Emergency Coordinates!' : 'Copy SOS Message with Live Coordinates'}
            </button>

            <button
              onClick={handleAbort}
              className="w-full py-2.5 rounded-xl bg-[#26263a] hover:bg-[#33334d] text-[#e4e4ed] font-bold transition text-xs"
            >
              Deactivate SOS & Stand Down
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
