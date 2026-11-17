import type { Metadata } from 'next';
import { CheckCircle2, Clock, MapPin, Navigation, Phone } from 'lucide-react';
import { getPublicBloodRequest, type PublicBloodRequest } from '@/lib/blood-public';
import { bloodRequestShareText, formatUnits } from '@/lib/requests';
import { formatPhone, withCountryCode } from '@/lib/phone';
import { JoinCard } from './JoinCard';
import { ShareButton } from './ShareButton';

/**
 * The page a shared blood request links to. Readable without signing in, so anyone who gets
 * the message on WhatsApp can see whether help is still needed, call, and get directions.
 * Below that, visitors who are signed out are invited to join (see JoinCard).
 *
 * Kept out of search indexes (see ../layout.tsx): it carries a phone number.
 */

interface Props {
  params: Promise<{ uuid: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { uuid } = await params;
  const req = await getPublicBloodRequest(uuid);
  if (typeof req === 'string') {
    return { title: 'Blood request | Sabhijude' };
  }

  const open = req.status === 'OPEN';
  const title = open
    ? `Urgent: ${req.bloodGroup} blood needed · ${formatUnits(req.unitsNeeded)}`
    : `${req.bloodGroup} blood request · ${req.status === 'FULFILLED' ? 'Fulfilled' : 'Closed'}`;
  const description = open
    ? `${req.location}. Tap to call the family, get directions, and see if help is still needed.`
    : `This request at ${req.location} is no longer open. Join Sabhijude to see blood requests near you.`;

  return {
    title,
    description,
    openGraph: { title, description, url: `/blood/${req.uuid}`, type: 'website', siteName: 'Sabhijude' },
    twitter: { card: 'summary', title, description },
  };
}

function postedAgo(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return '';
  const minutes = Math.max(0, Math.round((Date.now() - then) / 60_000));
  if (minutes < 1) return 'Posted just now';
  if (minutes < 60) return `Posted ${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `Posted ${hours} h ago`;
  const days = Math.round(hours / 24);
  return `Posted ${days} day${days === 1 ? '' : 's'} ago`;
}

export default async function BloodRequestPage({ params }: Props) {
  const { uuid } = await params;
  const req = await getPublicBloodRequest(uuid);

  return (
    <div className="mx-auto w-full max-w-xl space-y-6 px-4 py-6 sm:py-10">
      {req === 'not-found' ? (
        <Notice
          title="This blood request is not available"
          body="The link may be wrong, or the person who asked for blood removed the request."
        />
      ) : req === 'error' ? (
        <Notice
          title="Could not load this request"
          body="Please check your connection and try again in a moment."
        />
      ) : (
        <RequestCard req={req} />
      )}

      <JoinCard />
    </div>
  );
}

function RequestCard({ req }: { req: PublicBloodRequest }) {
  const open = req.status === 'OPEN' && !!req.contactPhone;

  return (
    <section className="rounded-2xl border border-red-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-center gap-4">
        <span className="flex h-16 min-w-16 shrink-0 items-center justify-center rounded-2xl bg-red-50 px-3 text-2xl font-extrabold text-red-600">
          {req.bloodGroup}
        </span>
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-wider text-red-600">
            {open ? 'Urgent · Blood needed' : req.status === 'FULFILLED' ? 'Fulfilled' : 'Closed'}
          </p>
          <h1 className="text-xl font-bold text-ink">{formatUnits(req.unitsNeeded)}</h1>
          <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
            <Clock className="h-3 w-3" /> {postedAgo(req.createdAt)}
          </p>
        </div>
      </div>

      <p className="mt-4 flex items-start gap-2 text-sm text-slate-700">
        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
        <span>{req.location}</span>
      </p>
      {open && req.note ? <p className="mt-2 text-sm text-slate-600">{req.note}</p> : null}

      {open ? (
        <>
          <a
            href={`tel:${withCountryCode(req.contactPhone!)}`}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-base font-bold text-white transition hover:bg-red-700"
          >
            <Phone className="h-5 w-5" /> Call {formatPhone(req.contactPhone!)}
          </a>
          <div className="mt-2 flex gap-2">
            {req.latitude != null && req.longitude != null ? (
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${req.latitude},${req.longitude}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-ink transition hover:border-slate-300"
              >
                <Navigation className="h-4 w-4" /> Directions
              </a>
            ) : null}
            <ShareButton
              title={`${req.bloodGroup} blood needed`}
              text={bloodRequestShareText({
                ...req,
                latitude: req.latitude ?? 0,
                longitude: req.longitude ?? 0,
                contactPhone: req.contactPhone!,
              })}
            />
          </div>
          <p className="mt-3 text-xs text-slate-500">
            Before you go, call to check that blood is still needed and which blood bank to visit.
          </p>
        </>
      ) : (
        <p className="mt-4 flex items-start gap-2 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          {req.status === 'FULFILLED'
            ? 'This request has been fulfilled. Thank you to everyone who helped and shared it.'
            : 'This request was closed by the person who made it, so no more donors are needed.'}
        </p>
      )}
    </section>
  );
}

function Notice({ title, body }: { title: string; body: string }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 text-center">
      <h1 className="text-lg font-bold text-ink">{title}</h1>
      <p className="mt-2 text-sm text-slate-600">{body}</p>
    </section>
  );
}
