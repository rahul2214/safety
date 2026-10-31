/**
 * Sabhijude Structured Data / Schema.org Generators
 * Validated against Google Search Central Rich Results standards.
 */

export const SITE_URL = 'https://sabhijude.com';
export const SITE_NAME = 'Sabhijude';

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
    sameAs: [],
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
