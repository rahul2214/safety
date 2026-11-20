import type { Metadata } from 'next';
import { VerifyEmailClient } from './VerifyEmailClient';

export const metadata: Metadata = {
  title: 'Confirm Your Email | Sabhijude Personal Safety',
  description: 'Confirm the email address of your new Sabhijude account.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function VerifyEmailPage() {
  return <VerifyEmailClient />;
}
