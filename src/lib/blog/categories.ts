import type { AuthorId, CategorySlug } from './types';

export interface Category {
  slug: CategorySlug;
  name: string;
  /** Used as the category page's intro and meta description. */
  description: string;
}

/** The controlled category list. Add tags for narrower topics instead of new categories. */
export const CATEGORIES: Category[] = [
  { slug: 'personal-safety', name: 'Personal Safety', description: 'Practical steps for feeling unsafe, being followed, and planning ahead, so you know what to do before you need it.' },
  { slug: 'womens-safety', name: "Women's Safety", description: "Women's safety in India: helplines, travel and night safety, harassment in public, and how to get help quickly." },
  { slug: 'student-safety', name: 'Student Safety', description: 'Safety for students in India: travel, hostels, online safety, emergencies, and how to get help and report problems.' },
  { slug: 'school-safety', name: 'School Safety', description: 'School safety for principals, teachers and parents in India: emergency preparedness, bullying, child protection, transport and reporting.' },
  { slug: 'college-safety', name: 'College Safety', description: 'Campus safety for colleges and universities in India: harassment and ragging complaints, hostels, events, emergency response and reporting systems.' },
  { slug: 'corporate-safety', name: 'Corporate Safety', description: 'Employee safety for companies: emergency response plans, night-shift and travel safety, incident reporting and safety culture.' },
  { slug: 'business-safety', name: 'Business Safety', description: 'Safety for small businesses, shops, restaurants, hotels, clinics and field teams: staff, customers, emergencies and incident reporting.' },
  { slug: 'organization-safety', name: 'Organization Safety', description: 'Safety frameworks for organisations, institutions and NGOs: reporting systems, anonymous complaints, incident management and governance.' },
  { slug: 'cyber-safety', name: 'Cyber Safety', description: 'Staying safe online: accounts, scams, fake profiles and what to do when something goes wrong.' },
  { slug: 'cyberbullying', name: 'Cyberbullying', description: 'What cyberbullying looks like, how to respond, and how students, parents and teachers can help.' },
  { slug: 'online-harassment', name: 'Online Harassment', description: 'Cyberstalking, threats, image-based abuse and online harassment: how to protect yourself, keep evidence and report it in India.' },
  { slug: 'emergency-help', name: 'Emergency Help', description: 'Emergency numbers in India, what to say on the call, and how to prepare yourself and the people around you.' },
  { slug: 'live-location', name: 'Live Location', description: 'How live location sharing works, when to use it, and how to keep your location private the rest of the time.' },
  { slug: 'digital-privacy', name: 'Digital Privacy', description: 'Protecting your personal information, digital footprint and accounts from strangers and misuse.' },
  { slug: 'travel-safety', name: 'Travel Safety', description: 'Safety for solo travel, night travel, cabs, trains and buses in India.' },
  { slug: 'workplace-safety', name: 'Workplace Safety', description: 'Workplace harassment, the POSH process, documentation and building safer workplaces.' },
  { slug: 'blood-donation', name: 'Blood Donation', description: 'Who can donate blood in India, how donation works, blood group compatibility and how to find donors.' },
  { slug: 'family-safety', name: 'Family Safety', description: 'Safety plans, emergency contacts and online safety for families, children and older relatives.' },
  { slug: 'community-safety', name: 'Community Safety', description: 'Reporting, blocking and building communities where people can speak up and get support.' },
  { slug: 'safety-awareness', name: 'Safety Awareness', description: 'Why safety education matters and how communities, colleges and organisations can build it.' },
  { slug: 'technology-ai-safety', name: 'Technology & AI Safety', description: 'Deepfakes, voice cloning, AI scams and staying safe as technology changes.' },
];

export const getCategory = (slug: string) => CATEGORIES.find((c) => c.slug === slug);

export interface Author {
  id: AuthorId;
  name: string;
  bio: string;
  url: string;
}

/**
 * Authors. Only real people or the team itself; never invent credentials (legal, medical,
 * police or NGO) for an author or reviewer.
 */
export const AUTHORS: Record<AuthorId, Author> = {
  editorial: {
    id: 'editorial',
    name: 'Sabhijude Editorial Team',
    bio: 'The team that builds Sabhijude. We check every helpline number, portal and procedure against official government sources before publishing, and update articles when they change.',
    url: '/about',
  },
};
