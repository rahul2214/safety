import type { Metadata } from 'next';
import { BlogIndex } from '@/components/blog/BlogIndex';

export const metadata: Metadata = {
  title: 'Safety Guides: Online Harassment, Women’s Safety, Emergencies & Blood Donation',
  description:
    'Practical, India-focused guides on cyberstalking, online harassment, reporting cybercrime, personal and student safety, emergency helplines and blood donation.',
  alternates: { canonical: '/blog' },
  openGraph: {
    title: 'The Sabhijude Blog: practical safety guides',
    description: 'What to do, who to call and how to report: safety guides for India, checked against official sources.',
    url: '/blog',
    type: 'website',
  },
};

export default function BlogIndexPage() {
  return <BlogIndex page={1} />;
}
