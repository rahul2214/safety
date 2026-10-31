import type { Metadata } from 'next';
import { SignupClient } from './SignupClient';

export const metadata: Metadata = {
  title: 'Create Free Account | Sabhijude Personal Safety',
  description: 'Join Sabhijude for free. Set up your trusted emergency circle, configure live GPS location alerts, and access community safety protections.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function SignupPage() {
  return <SignupClient />;
}
