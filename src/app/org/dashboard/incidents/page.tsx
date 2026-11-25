import { redirect } from 'next/navigation';

/** Live Incidents is now part of Campus Command, where each report and its case are one entry. */
export default function IncidentsRedirect() {
  redirect('/org/dashboard?tab=all');
}
