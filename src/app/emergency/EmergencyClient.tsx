'use client';

import React from 'react';
import { BellRing, Clock, MapPin, ShieldCheck, Smartphone, Users } from 'lucide-react';
import { SosDemo, HelplineLinks } from '@/components/SosDemo';

/**
 * Shows what Emergency SOS does. The website only presents the feature: it sends no alert,
 * reads no location and loads no contacts. SOS itself runs in the Sabhijude mobile app.
 */
export function EmergencyClient() {
  const features = [
    { icon: BellRing, title: 'One tap, or a long press', body: 'Start an SOS from the home screen in a second, even with shaking hands.' },
    { icon: Clock, title: '3-second safety countdown', body: 'Pressed it by accident? Cancel before anything is sent.' },
    { icon: MapPin, title: 'Your exact location', body: 'Your contacts get a map link to where you are, not just a message.' },
    { icon: Users, title: 'Your whole circle at once', body: 'Every trusted contact you saved is alerted together, by message and notification.' },
    { icon: ShieldCheck, title: 'Works if your account is limited', body: 'SOS stays available whatever happens to your account.' },
    { icon: Smartphone, title: 'Built for your phone', body: 'It uses your phone’s GPS and messaging, which is why SOS lives in the app.' },
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-10 sm:space-y-14">
      {/* Hero */}
      <section className="text-center space-y-3">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-red-600">Emergency SOS</p>
        <h1 className="font-display text-3xl sm:text-5xl font-extrabold tracking-[-0.02em] text-ink">
          Help, one tap away
        </h1>
        <p className="mx-auto max-w-xl text-base text-slate-600">
          When you feel unsafe, Sabhijude sends your location to the people you trust in seconds.
          SOS works in the Sabhijude mobile app. Try the demo below to see how.
        </p>
      </section>

      {/* Live demo */}
      <section className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-8">
        <h2 className="mb-6 font-display text-xl font-bold text-ink">See it in action</h2>
        <SosDemo />
      </section>

      {/* Features */}
      <section>
        <h2 className="mb-5 font-display text-xl font-bold text-ink">What SOS does for you</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="rounded-2xl border border-slate-200 bg-white p-5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
                <f.icon className="h-5 w-5" />
              </span>
              <p className="mt-3 font-semibold text-ink">{f.title}</p>
              <p className="mt-1 text-sm text-slate-500">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* What contacts receive */}
      <section className="grid gap-6 md:grid-cols-2 md:items-center">
        <div className="space-y-2">
          <h2 className="font-display text-xl font-bold text-ink">What your contacts receive</h2>
          <p className="text-sm text-slate-600">
            A clear message saying you need help, with a link that opens your location on a map. They
            can call you or the police straight away.
          </p>
        </div>
        <div className="rounded-3xl bg-[#e7f6ee] p-4">
          <div className="ml-auto max-w-sm rounded-2xl rounded-tr-sm bg-white p-3.5 text-sm text-ink shadow-sm">
            <p className="font-semibold text-red-600">🚨 SOS from Ananya</p>
            <p className="mt-1">I need help. This is my current location:</p>
            <p className="mt-1 break-all text-brand underline">maps.google.com/?q=17.3850,78.4867</p>
            <p className="mt-2 text-right text-[10px] text-slate-400">Sample message</p>
          </div>
        </div>
      </section>

      {/* Real help, now */}
      <section className="rounded-3xl bg-red-50 p-5 sm:p-7">
        <h2 className="font-display text-lg font-bold text-red-800">In danger right now?</h2>
        <p className="mb-4 mt-1 text-sm text-red-900/80">Don&rsquo;t wait. Call one of these numbers directly.</p>
        <HelplineLinks />
      </section>
    </div>
  );
}
