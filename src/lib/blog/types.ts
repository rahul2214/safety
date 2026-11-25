/**
 * Blog content model. The fields mirror the CMS columns in the content strategy (title, slug,
 * excerpt, content, category, tags, author, status, published/updated dates, SEO fields, related
 * posts, sources, featured), so moving the articles into a database later is a straight copy.
 *
 * Text in `p`, list items, callouts and FAQ answers may use two inline marks:
 *   [label](/blog/some-slug)  or  [label](https://official.site)   → a link
 *   **words**                                                    → bold
 */

export type Block =
  | { type: 'p'; text: string }
  /** `id` is optional; one is derived from the text for the table of contents. */
  | { type: 'h2'; text: string; id?: string }
  | { type: 'h3'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: string[] }
  | { type: 'callout'; tone: 'info' | 'warn' | 'success'; title: string; text: string }
  | { type: 'quote'; text: string; cite?: string }
  | { type: 'table'; head: string[]; rows: string[][]; caption?: string };

/** draft → review → scheduled/published → archived. Only `published` (and `scheduled` whose date has passed) is public. */
export type PostStatus = 'draft' | 'review' | 'scheduled' | 'published' | 'archived';

export type CategorySlug =
  | 'personal-safety'
  | 'womens-safety'
  | 'student-safety'
  | 'school-safety'
  | 'college-safety'
  | 'corporate-safety'
  | 'business-safety'
  | 'organization-safety'
  | 'cyber-safety'
  | 'cyberbullying'
  | 'online-harassment'
  | 'emergency-help'
  | 'live-location'
  | 'digital-privacy'
  | 'travel-safety'
  | 'workplace-safety'
  | 'blood-donation'
  | 'family-safety'
  | 'community-safety'
  | 'safety-awareness'
  | 'technology-ai-safety';

export type AuthorId = 'editorial';

export interface Source {
  title: string;
  /** Who publishes it, e.g. "Ministry of Home Affairs". */
  publisher: string;
  url: string;
}

export interface Faq {
  question: string;
  /** Plain sentences; inline marks allowed. Also used, stripped of marks, in FAQPage schema. */
  answer: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  /** <title> override when the H1 is too long or not search-shaped. */
  seoTitle?: string;
  /** Excerpt: one or two sentences for cards, meta description and social previews. */
  description: string;
  /** Meta description override (aim for 140–160 characters). */
  seoDescription?: string;
  category: CategorySlug;
  /** Narrow topics. Tags are free text; categories are the controlled list. */
  tags: string[];
  keywords: string[];
  authorId: AuthorId;
  /**
   * A real, named reviewer with a real qualification. Leave empty rather than invent one:
   * the page then says plainly that the team checked it against official sources.
   */
  reviewedBy?: { name: string; credential: string };
  status: PostStatus;
  /** ISO date, IST. */
  publishedAt: string;
  /** ISO date, IST. Bump it whenever a helpline, law or procedure in the article changes. */
  updatedAt: string;
  featured?: boolean;
  /** Slugs shown under "Keep reading"; the rest is filled from the same category. */
  related?: string[];
  /** Official and authoritative references, shown at the end of the article. */
  sources?: Source[];
  /** Only for questions the article genuinely answers; these also produce FAQPage schema. */
  faqs?: Faq[];
  /** Absolute canonical, only when the article is republished from elsewhere. */
  canonicalUrl?: string;
  /** Card artwork accent. */
  accent: 'red' | 'blue' | 'ink' | 'coral';
  /** Short label shown large on the card artwork and social image. */
  art: string;
  body: Block[];
}
