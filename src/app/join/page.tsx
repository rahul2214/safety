import type { Metadata } from 'next';
import { JoinInviteClient } from './JoinInviteClient';

export const metadata: Metadata = {
  title: 'Invitation | Sabhijude',
  description: 'Accept or decline an invitation to join your college on Sabhijude.',
  // Invitation pages are personal; keep them out of search engines and referrer headers.
  robots: { index: false, follow: false },
  referrer: 'no-referrer',
};

export default function JoinPage() {
  return <JoinInviteClient />;
}
