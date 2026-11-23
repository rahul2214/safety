import type { Metadata } from 'next';
import { ShareLocationClient } from './ShareLocationClient';

/**
 * The page a Live Location Sharing text links to: https://sabhijude.veltria.in/share/<token>.
 * Opened by people who may not have the app, so no sign-in. It shows someone's live position,
 * so it is kept out of search indexes and link previews say nothing about where they are.
 */

export const metadata: Metadata = {
  title: 'Live location',
  description: 'Someone is sharing their live location with you on Sabhijude.',
  robots: { index: false, follow: false },
  openGraph: {
    title: 'Live location',
    description: 'Someone is sharing their live location with you. Open to see where they are.',
    siteName: 'Sabhijude',
  },
};

interface Props {
  params: Promise<{ token: string }>;
}

export default async function ShareLocationPage({ params }: Props) {
  const { token } = await params;
  return <ShareLocationClient token={token} />;
}
