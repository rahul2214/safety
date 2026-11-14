import type { Metadata } from 'next';

// Private, user-specific page: keep it out of search indexes.
export const metadata: Metadata = {
  title: 'Request Blood',
  robots: { index: false, follow: false },
};

export default function NoIndexLayout({ children }: { children: React.ReactNode }) {
  return children;
}
