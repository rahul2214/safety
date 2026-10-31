import type { Metadata } from 'next';
import { LoginClient } from './LoginClient';

export const metadata: Metadata = {
  title: 'Log In | Sabhijude Personal Safety',
  description: 'Log in to your Sabhijude personal safety account to manage trusted contacts, track incident reports, and configure emergency settings.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function LoginPage() {
  return <LoginClient />;
}
