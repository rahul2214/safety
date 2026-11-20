import type { Metadata } from 'next';
import { ForgotPasswordClient } from './ForgotPasswordClient';

export const metadata: Metadata = {
  title: 'Reset Password | Sabhijude Personal Safety',
  description: 'Reset the password of your Sabhijude account with a code sent to your email.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordClient />;
}
