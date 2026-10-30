'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Phone, PhoneOff, User, Mic, MicOff, Volume2, VolumeX, Grid, Plus } from 'lucide-react';
import { soundEngine } from '@/lib/audio';

interface FakeCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  callerName?: string;
}

const CALLER_PRESETS = [
  { id: 'mom', name: 'Mom' },
  { id: 'dad', name: 'Dad' },
  { id: 'police', name: 'Inspector Sharma' },
  { id: 'cab', name: 'Cab Driver' },
];

export function FakeCallModal({ isOpen, onClose }: FakeCallModalProps) {
  const [selectedPreset, setSelectedPreset] = useState(CALLER_PRESETS[0]);
  const [callState, setCallState] = useState<'RINGING' | 'CONNECTED'>('RINGING');
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  
  const vibrateInterval = useRef<any>(null);

  // Vibration helper
  const startVibration = () => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([500, 300, 500, 300, 800]);
        vibrateInterval.current = setInterval(() => {
          navigator.vibrate([500, 300, 500, 300, 800]);
        }, 2500);
      } catch {}
    }
  };

  const stopVibration = () => {
    if (vibrateInterval.current) {
      clearInterval(vibrateInterval.current);
      vibrateInterval.current = null;
    }
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(0);
      } catch {}
    }
  };

  useEffect(() => {
    if (isOpen) {
      setCallState('RINGING');
      setDuration(0);
      setIsMuted(false);
      setIsSpeakerOn(false);
      soundEngine.startRingtone();
      startVibration();
    } else {
      soundEngine.stopRingtone();
      stopVibration();
    }

    return () => {
      soundEngine.stopRingtone();
      stopVibration();
    };
  }, [isOpen]);

  useEffect(() => {
    let interval: any = null;
    if (callState === 'CONNECTED') {
      interval = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [callState]);

  if (!isOpen) return null;

  const handleAccept = () => {
    soundEngine.stopRingtone();
    stopVibration();
    setCallState('CONNECTED');
  };

  const handleDeclineOrEnd = () => {
    soundEngine.stopRingtone();
    stopVibration();
    onClose();
  };

  const formatDuration = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${remainder < 10 ? '0' : ''}${remainder}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm rounded-[36px] bg-[#10101a] border border-ink-soft p-6 text-white shadow-2xl flex flex-col items-center justify-between min-h-[590px]">
        

        {/* Caller Avatar Header */}
        <div className="flex flex-col items-center mt-3 text-center space-y-3">
          <div className="relative flex items-center justify-center h-28 w-28 rounded-full bg-brand shadow-2xl shadow-brand/30">
            <User className="h-14 w-14 text-white" />
            {callState === 'RINGING' && (
              <>
                <span className="absolute -inset-2 rounded-full border-2 border-brand animate-ping opacity-60 pointer-events-none" />
                <span className="absolute -inset-5 rounded-full border border-[#e11d48] animate-pulse opacity-40 pointer-events-none" />
              </>
            )}
          </div>

          <div>
            <h3 className="text-2xl font-bold tracking-tight text-white">{selectedPreset.name}</h3>
            <p className="text-xs text-[#a6a6be] font-mono mt-1">
              {callState === 'RINGING' ? 'Incoming Call...' : formatDuration(duration)}
            </p>
          </div>
        </div>

        {/* Connected Phone Dialpad / In-Call Controls */}
        {callState === 'CONNECTED' ? (
          <div className="my-6 grid grid-cols-3 gap-y-6 gap-x-8 w-full max-w-[260px]">
            {/* Mute Button */}
            <div className="flex flex-col items-center gap-1.5">
              <button
                type="button"
                onClick={() => setIsMuted(!isMuted)}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
                  isMuted ? 'bg-white text-slate-900' : 'bg-[#222234] text-white hover:bg-ink-soft'
                }`}
              >
                {isMuted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
              </button>
              <span className="text-[11px] text-slate-400 font-medium">mute</span>
            </div>

            {/* Keypad Button */}
            <div className="flex flex-col items-center gap-1.5">
              <button
                type="button"
                className="w-14 h-14 rounded-full bg-[#222234] text-white flex items-center justify-center hover:bg-ink-soft transition-colors"
              >
                <Grid className="h-6 w-6" />
              </button>
              <span className="text-[11px] text-slate-400 font-medium">keypad</span>
            </div>

            {/* Speaker Button */}
            <div className="flex flex-col items-center gap-1.5">
              <button
                type="button"
                onClick={() => setIsSpeakerOn(!isSpeakerOn)}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
                  isSpeakerOn ? 'bg-white text-slate-900' : 'bg-[#222234] text-white hover:bg-ink-soft'
                }`}
              >
                {isSpeakerOn ? <Volume2 className="h-6 w-6" /> : <VolumeX className="h-6 w-6" />}
              </button>
              <span className="text-[11px] text-slate-400 font-medium">speaker</span>
            </div>

            {/* Add Call Button */}
            <div className="flex flex-col items-center gap-1.5">
              <button
                type="button"
                className="w-14 h-14 rounded-full bg-[#222234] text-white flex items-center justify-center hover:bg-ink-soft transition-colors"
              >
                <Plus className="h-6 w-6" />
              </button>
              <span className="text-[11px] text-slate-400 font-medium">add call</span>
            </div>

            {/* Audio Button */}
            <div className="flex flex-col items-center gap-1.5">
              <button
                type="button"
                className="w-14 h-14 rounded-full bg-[#222234] text-white flex items-center justify-center hover:bg-ink-soft transition-colors"
              >
                <Phone className="h-6 w-6" />
              </button>
              <span className="text-[11px] text-slate-400 font-medium">audio</span>
            </div>

            {/* Contacts Button */}
            <div className="flex flex-col items-center gap-1.5">
              <button
                type="button"
                className="w-14 h-14 rounded-full bg-[#222234] text-white flex items-center justify-center hover:bg-ink-soft transition-colors"
              >
                <User className="h-6 w-6" />
              </button>
              <span className="text-[11px] text-slate-400 font-medium">contacts</span>
            </div>
          </div>
        ) : (
          <div className="my-4 text-center space-y-1 max-w-[260px]">
           
          </div>
        )}

        {/* Action Controls */}
        {callState === 'RINGING' ? (
          <div className="w-full flex items-center justify-around mb-2">
            {/* Decline */}
            <div className="flex flex-col items-center gap-2">
              <button
                onClick={handleDeclineOrEnd}
                className="h-16 w-16 rounded-full bg-[#e11d48] hover:bg-[#be123c] flex items-center justify-center text-white shadow-lg shadow-[#e11d48]/40 transition active:scale-95"
                title="Decline"
              >
                <PhoneOff className="h-7 w-7" />
              </button>
              <span className="text-xs font-semibold text-slate-400">Decline</span>
            </div>

            {/* Accept */}
            <div className="flex flex-col items-center gap-2">
              <button
                onClick={handleAccept}
                className="h-16 w-16 rounded-full bg-[#059669] hover:bg-[#047857] flex items-center justify-center text-white shadow-lg shadow-[#059669]/40 transition active:scale-95 animate-bounce"
                title="Accept"
              >
                <Phone className="h-7 w-7" />
              </button>
              <span className="text-xs font-semibold text-slate-400">Accept</span>
            </div>
          </div>
        ) : (
          <div className="w-full flex flex-col items-center justify-center mb-2 gap-3">
            <button
              onClick={handleDeclineOrEnd}
              className="h-16 w-16 rounded-full bg-[#e11d48] hover:bg-[#be123c] flex items-center justify-center text-white shadow-xl shadow-[#e11d48]/50 transition active:scale-95"
              title="Hang up"
            >
              <PhoneOff className="h-7 w-7" />
            </button>
            <span className="text-xs font-semibold text-slate-400">End Call</span>
          </div>
        )}
      </div>
    </div>
  );
}
