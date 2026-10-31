/**
 * Sabhijude Structured Data / Schema.org Generators
 * Validated against Google Search Central Rich Results standards.
 */

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://sabhijude.com')
).replace(/\/+$/, '');
export const SITE_NAME = 'Sabhijude';

export interface FaqItem {
  question: string;
  answer: string;
  linkHref?: string;
  linkText?: string;
}

export const HOMEPAGE_FAQS: FaqItem[] = [
  {
    question: 'What is Sabhijude and how does it protect me?',
    answer:
      'Sabhijude is a comprehensive personal safety app and emergency SOS platform designed for individuals, students, employees, and families. With one tap, users can trigger instant emergency SOS alerts, broadcast live GPS location coordinates to trusted contacts, access discreet fake call exits, and reach official national emergency helplines (112, 1091, 181, 1930).',
    linkHref: '/about',
    linkText: 'Learn more about Sabhijude',
  },
  {
    question: 'Is Sabhijude completely free to use for personal safety?',
    answer:
      'Yes, Sabhijude is 100% free for individual users, families, and students. There are no subscription fees, advertisements, or paywalls for core safety features such as emergency SOS, live GPS location sharing, discreet exit tools, and public incident feeds.',
    linkHref: '/emergency',
    linkText: 'Explore emergency SOS features',
  },
  {
    question: 'How does the emergency SOS alert work?',
    answer:
      'When you trigger an SOS alert, Sabhijude immediately captures your real-time GPS coordinates and dispatches an emergency notification to your designated emergency contacts and connected campus/organization security desks. The alert includes your live location map link and safety status, enabling immediate response.',
    linkHref: '/safety-measures',
    linkText: 'View emergency helpline directory',
  },
  {
    question: 'Does Sabhijude constantly track my location in the background?',
    answer:
      'No. Sabhijude strictly respects your privacy. Your GPS location is accessed only when you actively trigger an emergency SOS alert or explicitly choose to share your journey with trusted contacts. We never track your movements in the background, nor do we sell or monetize your location data.',
    linkHref: '/privacy',
    linkText: 'Read our privacy safeguards',
  },
  {
    question: 'How does the Fake Call feature help in uncomfortable situations?',
    answer:
      'The Fake Call simulation lets you schedule or immediately trigger an incoming call interface that looks and sounds authentic. It provides an immediate, discreet, and socially acceptable reason to step away from uncomfortable conversations, unsafe environments, or suspicious encounters without escalating conflict.',
    linkHref: '/emergency',
    linkText: 'Try the discreet exit tool',
  },
  {
    question: 'Can colleges, universities, and corporate offices integrate with Sabhijude?',
    answer:
      'Yes. Sabhijude offers dedicated security desk consoles for universities, corporate campuses, and residential communities. Security teams can monitor campus incident reports, dispatch emergency responders in real time, and verify student or employee requests with institutional email domains.',
    linkHref: '/organization-request',
    linkText: 'Request organization onboarding',
  },
];

export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/logo.png`,
      caption: 'Sabhijude Personal & Community Safety Platform',
    },
    description:
      'Sabhijude is a comprehensive personal and community safety platform delivering instant emergency SOS alerts, live GPS location sharing, discreet exit tools, and verified safety reports for individuals, campuses, and workplaces.',
    sameAs: [
      process.env.NEXT_PUBLIC_INSTAGRAM_URL || 'https://www.instagram.com/sabhijude',
      process.env.NEXT_PUBLIC_LINKEDIN_URL || 'https://www.linkedin.com/company/sabhijude',
    ],
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: '+91-6303563546',
        contactType: 'customer support',
        availableLanguage: ['English', 'Hindi'],
        areaServed: 'IN',
      },
      {
        '@type': 'ContactPoint',
        telephone: '112',
        contactType: 'emergency',
        areaServed: 'IN',
      },
    ],
  };
}

export function getWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    description: 'Personal safety app, emergency SOS, and community safety platform',
    publisher: {
      '@id': `${SITE_URL}/#organization`,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/feed?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function getSoftwareApplicationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Sabhijude',
    operatingSystem: 'Any (Web, iOS, Android)',
    applicationCategory: 'SecurityApplication',
    applicationSubCategory: 'Personal Safety',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'INR',
    },
    description:
      'Web-based personal safety tool providing instant emergency SOS alerts, live GPS location sharing, discreet fake call exits, and anonymous community safety reporting.',
    url: SITE_URL,
    featureList: [
      'One-tap emergency SOS dispatch with live GPS location sharing',
      'Realistic fake call simulation for discreet exits',
      'Verified anonymous community safety reporting',
      'Direct one-tap dialing to official emergency helplines (112, 1091, 181, 1930)',
      'Campus and enterprise safety desk consoles',
    ],
  };
}

export function getBreadcrumbSchema(items: Array<{ name: string; item: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((crumb, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: crumb.name,
      item: crumb.item.startsWith('http') ? crumb.item : `${SITE_URL}${crumb.item}`,
    })),
  };
}

export function getFaqSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function getArticleSchema(article: {
  title: string;
  description: string;
  url: string;
  datePublished?: string;
  dateModified?: string;
  category?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': article.url.startsWith('http') ? article.url : `${SITE_URL}${article.url}`,
    },
    author: {
      '@type': 'Organization',
      name: 'Sabhijude Safety Research & Legal Team',
      url: SITE_URL,
    },
    publisher: {
      '@id': `${SITE_URL}/#organization`,
    },
    datePublished: article.datePublished || '2026-01-15T00:00:00+05:30',
    dateModified: article.dateModified || '2026-10-31T00:00:00+05:30',
    articleSection: article.category || 'Personal Safety',
  };
}
