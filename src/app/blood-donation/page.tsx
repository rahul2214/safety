import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight, BadgeCheck, Ban, CalendarClock, CheckCircle2, Droplet, Eye, HandHeart, Hospital, Link2, MapPinned,
  PhoneCall, Ruler, Scale, ShieldCheck, Timer, UserRound,
} from 'lucide-react';
import { JsonLd } from '@/components/seo/JsonLd';
import { getBreadcrumbSchema, getFaqSchema } from '@/lib/seo-schemas';
import { getPostsByCategory } from '@/lib/blog-posts';
import { BlogPostCard } from '@/components/blog/PostCard';
import { BloodGroupMatcher } from '@/components/blood/BloodGroupMatcher';
import { RequestShowcaseVisual } from '@/components/blood/RequestShowcaseVisual';

export const metadata: Metadata = {
  title: 'Request Blood or Donate Near You',
  description:
    'Post a blood request in under a minute. People near the hospital see it and can call you directly. Free, no middlemen. Learn how to request and how to donate.',
  alternates: { canonical: '/blood-donation' },
  openGraph: {
    title: 'Help is often a few streets away · Sabhijude blood requests',
    description: 'Post a blood request in under a minute. People near the hospital can see it and call you directly.',
    url: '/blood-donation',
    type: 'website',
  },
};

// Every product claim here matches the app: ~25 km, up to 7 days, call to respond, no push alerts.
const FAQS = [
  {
    question: 'Who sees my blood request?',
    answer:
      'Signed-in Sabhijude members within about 25 km of the place you pin see it in the “Near you” section of their home screen, for up to seven days or until you close it. Anyone you share the link with can also see its live status page.',
  },
  {
    question: 'Does it cost anything?',
    answer: 'No. Posting a request, sharing it and calling about it are free. Sabhijude never charges for blood requests, and never asks donors to pay or be paid.',
  },
  {
    question: 'Is Sabhijude a blood bank?',
    answer:
      'No. Sabhijude connects people. Donated blood always goes through the hospital’s blood bank, which checks the donor, tests the blood and cross-matches it with the patient.',
  },
  {
    question: 'Will donors get a notification?',
    answer:
      'Not today. Your request appears on the home screen of people nearby when they open the app, and you can share it on WhatsApp or SMS with one tap so it reaches people right away.',
  },
  {
    question: 'What happens to my phone number?',
    answer:
      'The number you enter is shown on your request so donors can call you, so use one you are comfortable sharing. When you mark the request fulfilled or cancel it, the live status page stops showing your number.',
  },
  {
    question: 'I want to donate. What should I do when I see a request?',
    answer:
      'Call the number first to check that blood is still needed and which blood bank to go to. Then donate at that blood bank, which will run its own health check before you give.',
  },
];

const STATS = [
  { k: '< 1 min', v: 'to post a request' },
  { k: '~25 km', v: 'around the hospital' },
  { k: '7 days', v: 'visible, or until you close it' },
  { k: '₹0', v: 'always free, no middlemen' },
];

export default function BloodDonationPage() {
  const posts = getPostsByCategory('blood-donation').slice(0, 3);
  return (
    <div className="bg-white">
      <JsonLd data={getBreadcrumbSchema([{ name: 'Home', item: '/' }, { name: 'Blood requests', item: '/blood-donation' }])} />
      <JsonLd data={getFaqSchema(FAQS)} />

      {/* ─── HERO ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 right-[-10%] h-[560px] w-[560px] rounded-full bg-red-500/10 blur-3xl" />
          <div className="absolute top-60 left-[-15%] h-[420px] w-[420px] rounded-full bg-brand/10 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(#0b16300d_1px,transparent_1px)] [background-size:22px_22px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
        </div>
        <div className="public-container relative grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-10 items-center pt-14 pb-24 sm:pt-20 lg:pt-24 lg:pb-32">
          <div className="lg:col-span-6 space-y-8">
            <span className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3.5 py-1.5 text-xs font-bold text-red-600">
              <Droplet className="h-3.5 w-3.5" /> New on Sabhijude · Blood requests
            </span>
            <h1 className="display-1">
              Help is often{' '}
              <span className="bg-gradient-to-r from-red-600 to-coral bg-clip-text text-transparent">a few streets</span>{' '}
              away.
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-xl">
              Post a blood request in under a minute. People near the hospital see it on their home screen and can call you directly. Share it in one tap, and close it the moment you are covered.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/blood" className="btn-sos text-base px-7 py-4">
                <Droplet className="h-5 w-5" /> Request blood
              </Link>
              <Link href="/signup" className="btn-brand text-base px-7 py-4 bg-ink hover:bg-ink-soft shadow-none">
                Become a donor <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-3 text-[14px] text-slate-600">
              {['Free, always', 'No middlemen', 'Works on any phone through a shared link'].map((t) => (
                <span key={t} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-600" /> {t}</span>
              ))}
            </div>
          </div>
          <div className="lg:col-span-6 px-4 sm:px-8">
            <RequestShowcaseVisual />
          </div>
        </div>
      </section>

      {/* ─── STATS ────────────────────────────────────────────── */}
      <section className="border-y border-slate-200 bg-mist">
        <div className="public-container grid grid-cols-2 lg:grid-cols-4 lg:divide-x divide-slate-200">
          {STATS.map((s) => (
            <div key={s.k} className="px-4 py-8 sm:py-10 text-center">
              <p className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-ink">{s.k}</p>
              <p className="mt-1 text-sm text-slate-500">{s.v}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── TWO SIDES ────────────────────────────────────────── */}
      <section className="py-24 sm:py-32">
        <div className="public-container space-y-14">
          <div className="max-w-2xl space-y-4">
            <span className="eyebrow"><span className="h-px w-6 bg-brand" />How it works</span>
            <h2 className="display-2">One request. Two ways to help.</h2>
            <p className="text-lg text-slate-600 leading-relaxed">Whether you are looking for blood or ready to give it, it takes a few taps.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[
              {
                tone: 'bg-ink text-white',
                badge: 'bg-red-500',
                icon: Hospital,
                title: 'I need blood',
                sub: 'For a family member or friend in hospital',
                steps: [
                  ['Choose the group and units', 'A+ to O−. The app shows the volume too: 2 units is about 900 ml.'],
                  ['Pin the hospital', 'Use your location, or search and tap the exact place on the map.'],
                  ['Send and share', 'People nearby see it. Share to WhatsApp with a live status link.'],
                  ['Mark it fulfilled', 'It stops showing, and your number is hidden from the link.'],
                ],
                cta: { href: '/blood', label: 'Request blood' },
              },
              {
                tone: 'bg-red-50 text-ink border border-red-100',
                badge: 'bg-brand',
                icon: HandHeart,
                title: 'I can donate',
                sub: 'Healthy, 18 to 65, and ready to help',
                steps: [
                  ['Create a free account', 'Add your blood group to your profile.'],
                  ['Check “Near you”', 'Open blood requests close to you appear on your home screen.'],
                  ['Call first', 'Confirm it is still needed and which blood bank to visit.'],
                  ['Donate at the blood bank', 'They run a quick health check, then it takes about 10 minutes.'],
                ],
                cta: { href: '/signup', label: 'Become a donor' },
              },
            ].map((side, si) => (
              <div key={side.title} className={`relative overflow-hidden rounded-[2rem] p-8 sm:p-10 ${side.tone}`}>
                {si === 0 && <div aria-hidden className="absolute -right-16 -top-16 h-72 w-72 rounded-full bg-red-500/25 blur-3xl" />}
                <div className="relative space-y-8">
                  <div className="flex items-center gap-4">
                    <span className={`flex h-12 w-12 items-center justify-center rounded-2xl text-white ${side.badge}`}><side.icon className="h-6 w-6" /></span>
                    <div>
                      <h3 className="font-display text-2xl font-bold tracking-tight">{side.title}</h3>
                      <p className={si === 0 ? 'text-white/60' : 'text-slate-500'}>{side.sub}</p>
                    </div>
                  </div>
                  <ol className="space-y-5">
                    {side.steps.map(([t, b], i) => (
                      <li key={t} className="flex gap-4">
                        <span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${si === 0 ? 'bg-white/10 text-white' : 'bg-white text-red-600 border border-red-100'}`}>{i + 1}</span>
                        <div>
                          <p className="font-semibold">{t}</p>
                          <p className={`text-[15px] leading-relaxed ${si === 0 ? 'text-white/65' : 'text-slate-600'}`}>{b}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                  <Link href={side.cta.href} className={si === 0 ? 'btn-sos' : 'btn-brand'}>
                    {side.cta.label} <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── DETAILS (BENTO) ──────────────────────────────────── */}
      <section className="bg-mist py-24 sm:py-32">
        <div className="public-container space-y-14">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <span className="eyebrow">Built for real emergencies</span>
            <h2 className="display-2">Small details that save time when it matters.</h2>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {[
              { icon: MapPinned, title: 'Pin the exact hospital', body: 'Search by name or tap the spot on a map, so the request reaches people near the right place, not near your home.' },
              { icon: Ruler, title: 'Units, in millilitres', body: 'Every request shows the volume alongside the units, so “2 units (~900 ml)” is clear even to a first-time donor.' },
              { icon: Link2, title: 'A live status link', body: 'Every request has its own page. Anyone you send it to can see if help is still needed, call or get directions, without the app.' },
              { icon: PhoneCall, title: 'One tap to call', body: 'Donors reach you directly. No forms, no waiting for someone to pass on a message.' },
              { icon: Eye, title: 'Your number, your call', body: 'Your number shows only on your request. Close the request and the live page stops showing it.' },
              { icon: Timer, title: 'Never out of date', body: 'Requests disappear after seven days or when you mark them fulfilled, so nobody calls about help that already arrived.' },
            ].map((f) => (
              <div key={f.title} className="card-public p-7 space-y-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-tint text-brand"><f.icon className="h-5 w-5" /></span>
                <h3 className="font-display text-lg font-bold text-ink">{f.title}</h3>
                <p className="text-[15px] leading-relaxed text-slate-600">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── BLOOD GROUP MATCHER ──────────────────────────────── */}
      <section className="py-24 sm:py-32">
        <div className="public-container grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-5">
            <span className="eyebrow"><span className="h-px w-6 bg-brand" />Know your group</span>
            <h2 className="display-2">Whose request can you answer?</h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              Pick your blood group to see who you can give red cells to, and who can give to you. O− can help everyone; AB+ can receive from everyone.
            </p>
            <Link href="/blog/blood-group-compatibility-explained" className="inline-flex items-center gap-2 font-semibold text-brand hover:text-brand-deep">
              Blood groups, explained simply <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="lg:col-span-7">
            <BloodGroupMatcher />
          </div>
        </div>
      </section>

      {/* ─── CAN I DONATE ─────────────────────────────────────── */}
      <section className="pb-24 sm:pb-32">
        <div className="public-container">
          <div className="rounded-[2rem] bg-gradient-to-br from-red-50 via-white to-brand-tint border border-slate-200 p-8 sm:p-14 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5 space-y-4">
              <span className="eyebrow"><BadgeCheck className="h-3.5 w-3.5" /> Before you donate</span>
              <h2 className="display-2">Can I donate? The quick check.</h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                Based on India&rsquo;s national guidelines. The blood bank checks everything on the day, so if you are unsure, call and ask.
              </p>
              <Link href="/blog/first-time-blood-donation-guide" className="inline-flex items-center gap-2 font-semibold text-brand hover:text-brand-deep">
                Your first donation, step by step <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: UserRound, title: '18 to 65 years', body: 'First-time donors are usually accepted up to 60.' },
                { icon: Scale, title: 'At least 45 kg', body: '55 kg or more for a 450 ml donation.' },
                { icon: Droplet, title: 'Haemoglobin 12.5+', body: 'Tested with a quick finger prick on the day.' },
                { icon: CalendarClock, title: '3 or 4 months apart', body: 'At least 3 months for men, 4 months for women.' },
              ].map((c) => (
                <div key={c.title} className="rounded-2xl bg-white/80 backdrop-blur border border-white p-6 space-y-2 shadow-sm">
                  <c.icon className="h-6 w-6 text-red-600" />
                  <h3 className="font-semibold text-ink">{c.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{c.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── TRUST ────────────────────────────────────────────── */}
      <section className="pb-24 sm:pb-32">
        <div className="public-container grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { icon: Ban, tone: 'text-red-600 bg-red-50', title: 'Never pay, never be paid', body: 'Voluntary, unpaid donation is the law in India. If anyone asks for or offers money, say no and tell the hospital.' },
            { icon: ShieldCheck, tone: 'text-brand bg-brand-tint', title: 'Not a blood bank', body: 'Sabhijude connects people. The hospital blood bank screens donors, tests blood and cross-matches it for the patient.' },
            { icon: PhoneCall, tone: 'text-emerald-700 bg-emerald-50', title: 'Always call first', body: 'Before you travel, call the family to confirm blood is still needed and which blood bank to visit.' },
          ].map((t) => (
            <div key={t.title} className="rounded-3xl border border-slate-200 p-7 space-y-3">
              <span className={`flex h-11 w-11 items-center justify-center rounded-2xl ${t.tone}`}><t.icon className="h-5 w-5" /></span>
              <h3 className="font-display text-lg font-bold text-ink">{t.title}</h3>
              <p className="text-[15px] leading-relaxed text-slate-600">{t.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── FAQ ──────────────────────────────────────────────── */}
      <section className="py-20 sm:py-24 bg-mist/60 border-t border-slate-200/60" aria-labelledby="blood-faq">
        <div className="public-container grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4 space-y-4">
            <span className="eyebrow">Questions</span>
            <h2 id="blood-faq" className="display-2">Good to know.</h2>
          </div>
          <div className="lg:col-span-8 divide-y divide-slate-200 rounded-3xl border border-slate-200 bg-white">
            {FAQS.map((f) => (
              <details key={f.question} className="group p-6 sm:p-7 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-lg font-bold text-ink">
                  {f.question}
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-mist text-slate-500 transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-[15.5px] leading-relaxed text-slate-600">{f.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FROM THE BLOG ────────────────────────────────────── */}
      <section className="py-24 sm:py-28">
        <div className="public-container space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-3">
              <span className="eyebrow"><span className="h-px w-6 bg-brand" />From the blog</span>
              <h2 className="display-2">Read before you need it.</h2>
            </div>
            <Link href="/blog" className="btn-ghost self-start sm:self-auto">All articles <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <div className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => <BlogPostCard key={p.slug} post={p} />)}
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ────────────────────────────────────────── */}
      <section className="pb-24 sm:pb-32">
        <div className="public-container">
          <div className="relative overflow-hidden rounded-[2rem] bg-ink px-8 py-14 sm:px-14 sm:py-20 text-center text-white">
            <div aria-hidden className="absolute -left-20 -top-24 h-80 w-80 rounded-full bg-red-500/25 blur-3xl" />
            <div aria-hidden className="absolute -right-24 -bottom-24 h-80 w-80 rounded-full bg-brand/30 blur-3xl" />
            <div className="relative mx-auto max-w-2xl space-y-6">
              <h2 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight">When people connect, help gets closer.</h2>
              <p className="text-lg text-white/70">Be the person nearby someone is hoping for.</p>
              <div className="flex flex-col sm:flex-row justify-center gap-3">
                <Link href="/blood" className="btn-sos text-base px-7 py-4"><Droplet className="h-5 w-5" /> Request blood</Link>
                <Link href="/signup" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 px-7 py-4 text-base font-semibold text-white hover:bg-white/10 transition">
                  Become a donor <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
