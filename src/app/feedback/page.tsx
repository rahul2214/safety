import type { Metadata } from 'next';
import { FeedbackClient } from './FeedbackClient';

export const metadata: Metadata = {
  title: 'Send feedback | Sabhijude',
  description: 'Rate Sabhijude, report a problem or share an idea with the team.',
  alternates: { canonical: '/feedback' },
};

export default function FeedbackPage() {
  return <FeedbackClient />;
}
