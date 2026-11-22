import type { Metadata } from 'next';
import { LiveLocationClient } from './LiveLocationClient';

/**
 * The page an SOS text message links to: https://sabhijude.veltria.in/live/<token>.
 *
 * Opened by family and friends who may not have the app, so it needs no sign-in. It shows a
 * person's live position, so it is kept out of search indexes and link previews say nothing
 * about where they are.
 */

export const metadata: Metadata = {
  title: 'Live SOS location',
  description: 'Someone in your trusted circle has raised an SOS. Open to see their live location.',
  robots: { index: false, follow: false },
  openGraph: {
    title: 'SOS: live location',
    description: 'Someone in your trusted circle needs help. Open to see their live location.',
    siteName: 'Sabhijude',
  },
};

interface Props {
  params: Promise<{ token: string }>;
}

export default async function LiveLocationPage({ params }: Props) {
  const { token } = await params;
  return <LiveLocationClient token={token} />;
}
