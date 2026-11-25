/**
 * The blog registry. Articles live in lib/blog/posts/*.ts as plain data rendered by
 * components/blog/ArticleBody.tsx; adding a post is adding an entry there. The index, category
 * pages, article pages, sitemap, social images and structured data all read from here.
 *
 * Writing rules (from the content strategy): one search intent per article, useful before
 * promotional, India-specific where relevant, official sources for every helpline, portal and
 * law, no invented statistics, quotes, experts or legal provisions. Bump `updatedAt` whenever a
 * helpline, law or procedure in an article changes.
 */
import type { Block, BlogPost, CategorySlug } from './blog/types';
import { BLOOD_POSTS } from './blog/posts/blood-donation';
import { ONLINE_HARASSMENT_POSTS } from './blog/posts/online-harassment';
import { CYBER_POSTS } from './blog/posts/cyber-safety';
import { PERSONAL_SAFETY_POSTS } from './blog/posts/personal-safety';
import { SCAM_AND_ACCOUNT_POSTS } from './blog/posts/scams-and-accounts';
import { DIGITAL_PRIVACY_POSTS } from './blog/posts/digital-privacy';
import { SUPPORT_AND_WORKPLACE_POSTS } from './blog/posts/support-and-workplace';
import { BLOOD_GUIDE_POSTS } from './blog/posts/blood-guides';
import { TRAVEL_FAMILY_TECH_POSTS } from './blog/posts/travel-family-tech';
import { COMMUNITY_AWARENESS_POSTS } from './blog/posts/community-awareness';
import { FAMILY_AND_SECURITY_POSTS } from './blog/posts/family-and-security';
import { PHASE1_CORE_POSTS } from './blog/posts/phase1-core';
import { PHASE1_INSTITUTION_POSTS } from './blog/posts/phase1-institutions';
import { PHASE1_PILLAR_POSTS } from './blog/posts/phase1-pillars';
import { PHASE1_BATCH3_POSTS } from './blog/posts/phase1-batch3';
import { PHASE1_BATCH4_POSTS } from './blog/posts/phase1-batch4';
import { PHASE2_BATCH1_POSTS } from './blog/posts/phase2-batch1';
import { PHASE2_BATCH2_POSTS } from './blog/posts/phase2-batch2';
import { PHASE2_BATCH3_POSTS } from './blog/posts/phase2-batch3';
import { PHASE2_BATCH4_POSTS } from './blog/posts/phase2-batch4';
import { PHASE3_BATCH1_POSTS } from './blog/posts/phase3-batch1';
import { PHASE3_BATCH2_POSTS } from './blog/posts/phase3-batch2';
import { PHASE3_BATCH3_POSTS } from './blog/posts/phase3-batch3';
import { CITY_POSTS } from './blog/posts/city-guides';

export type { Block, BlogPost, CategorySlug } from './blog/types';
export { CATEGORIES, getCategory, AUTHORS } from './blog/categories';

const ALL_POSTS: BlogPost[] = [
  ...ONLINE_HARASSMENT_POSTS,
  ...CYBER_POSTS,
  ...PERSONAL_SAFETY_POSTS,
  ...SCAM_AND_ACCOUNT_POSTS,
  ...DIGITAL_PRIVACY_POSTS,
  ...SUPPORT_AND_WORKPLACE_POSTS,
  ...TRAVEL_FAMILY_TECH_POSTS,
  ...COMMUNITY_AWARENESS_POSTS,
  ...FAMILY_AND_SECURITY_POSTS,
  ...PHASE1_CORE_POSTS,
  ...PHASE1_INSTITUTION_POSTS,
  ...PHASE1_PILLAR_POSTS,
  ...PHASE1_BATCH3_POSTS,
  ...PHASE1_BATCH4_POSTS,
  ...PHASE2_BATCH1_POSTS,
  ...PHASE2_BATCH2_POSTS,
  ...PHASE2_BATCH3_POSTS,
  ...PHASE2_BATCH4_POSTS,
  ...PHASE3_BATCH1_POSTS,
  ...PHASE3_BATCH2_POSTS,
  ...PHASE3_BATCH3_POSTS,
  ...CITY_POSTS,
  ...BLOOD_POSTS,
  ...BLOOD_GUIDE_POSTS,
];

/** Today in IST, as YYYY-MM-DD, so a scheduled post goes live on its date in India. */
function todayIst(): string {
  return new Date(Date.now() + 5.5 * 3600 * 1000).toISOString().slice(0, 10);
}

function isLive(p: BlogPost): boolean {
  if (p.status === 'published') return p.publishedAt <= todayIst();
  if (p.status === 'scheduled') return p.publishedAt <= todayIst();
  return false;
}

/** Public articles, newest first (by publish date, then most recently updated). */
export const BLOG_POSTS: BlogPost[] = ALL_POSTS.filter(isLive).sort(
  (a, b) => b.publishedAt.localeCompare(a.publishedAt) || b.updatedAt.localeCompare(a.updatedAt),
);

export const getPost = (slug: string) => BLOG_POSTS.find((p) => p.slug === slug);

export const getPostsByCategory = (category: CategorySlug) => BLOG_POSTS.filter((p) => p.category === category);

export function getFeaturedPost(): BlogPost {
  return BLOG_POSTS.find((p) => p.featured) ?? BLOG_POSTS[0];
}

/** Articles per listing page (blog index and category pages). */
export const POSTS_PER_PAGE = 10;

export function pageCount(total: number): number {
  return Math.max(1, Math.ceil(total / POSTS_PER_PAGE));
}

/** One page (1-based) of a list, or null when the page does not exist. */
export function paginate<T>(items: T[], page: number): { items: T[]; totalPages: number } | null {
  const totalPages = pageCount(items.length);
  if (!Number.isInteger(page) || page < 1 || page > totalPages) return null;
  return { items: items.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE), totalPages };
}

/** Hand-picked related posts first, then the same category, then anything recent. */
export function getRelatedPosts(post: BlogPost, count = 3): BlogPost[] {
  const picked: BlogPost[] = [];
  const add = (p?: BlogPost) => {
    if (p && p.slug !== post.slug && !picked.some((x) => x.slug === p.slug)) picked.push(p);
  };
  post.related?.forEach((s) => add(getPost(s)));
  getPostsByCategory(post.category).forEach(add);
  BLOG_POSTS.forEach(add);
  return picked.slice(0, count);
}

/* ------------------------------------------------------------------ text helpers */

/** Removes the inline marks ([label](href), **bold**) for plain-text uses such as schema and word counts. */
export function stripMarks(text: string): string {
  return text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1').replace(/\*\*([^*]+)\*\*/g, '$1');
}

export function slugifyHeading(text: string): string {
  return stripMarks(text)
    .toLowerCase()
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export const headingId = (b: Extract<Block, { type: 'h2' }>) => b.id || slugifyHeading(b.text);

function blockText(b: Block): string {
  switch (b.type) {
    case 'p':
    case 'h2':
    case 'h3':
      return b.text;
    case 'ul':
    case 'ol':
      return b.items.join(' ');
    case 'callout':
      return `${b.title} ${b.text}`;
    case 'quote':
      return b.text;
    case 'table':
      return [...b.head, ...b.rows.flat()].join(' ');
  }
}

export function wordCount(post: BlogPost): number {
  const text = [...post.body.map(blockText), ...(post.faqs ?? []).flatMap((f) => [f.question, f.answer])].join(' ');
  return stripMarks(text).split(/\s+/).filter(Boolean).length;
}

/** At about 200 words a minute, which suits careful reading of safety steps. */
export function readingMinutes(post: BlogPost): number {
  return Math.max(1, Math.round(wordCount(post) / 200));
}

export function tableOfContents(post: BlogPost): Array<{ id: string; text: string }> {
  const items = post.body
    .filter((b): b is Extract<Block, { type: 'h2' }> => b.type === 'h2')
    .map((b) => ({ id: headingId(b), text: stripMarks(b.text) }));
  if (post.faqs?.length) items.push({ id: 'faqs', text: 'Frequently asked questions' });
  if (post.sources?.length) items.push({ id: 'sources', text: 'Sources and official resources' });
  return items;
}

export function formatPostDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return `${d} ${months[m - 1]} ${y}`;
}

/* ------------------------------------------------------------------ integrity check */

/**
 * Minimum SEO standard for a published article; the build fails below it.
 * - Titles over ~60 characters are cut off in Google results.
 * - Descriptions of 120-160 characters show in full and say enough to earn the click.
 * - In-text links build topic clusters; "Keep reading" cards come on top of these.
 * - Every article cites at least one official or authoritative source.
 */
export const SEO_RULES = { maxTitle: 60, minDescription: 120, maxDescription: 160, minInternalLinks: 3, minExternalSources: 1 } as const;

/** <title> with " | Sabhijude" when that still fits in 60 characters, otherwise the SEO title alone. */
export function documentTitle(seoTitle: string): string | { absolute: string } {
  return seoTitle.length + ' | Sabhijude'.length <= SEO_RULES.maxTitle ? seoTitle : { absolute: seoTitle };
}

/**
 * Fails the build on a broken internal link, a related slug that does not exist, a duplicate
 * slug or a malformed date, so a typo can never ship as a 404 link.
 */
function validate(posts: BlogPost[]) {
  const slugs = new Set<string>();
  const problems: string[] = [];
  for (const p of posts) {
    if (slugs.has(p.slug)) problems.push(`duplicate slug "${p.slug}"`);
    slugs.add(p.slug);
    for (const d of [p.publishedAt, p.updatedAt]) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(d)) problems.push(`${p.slug}: bad date "${d}"`);
    }
    if (p.updatedAt < p.publishedAt) problems.push(`${p.slug}: updatedAt is before publishedAt`);
  }
  // A live article may only link to another live article (a draft would be a 404 for readers).
  const live = new Set(posts.filter(isLive).map((p) => p.slug));
  for (const p of posts) {
    p.related?.forEach((s) => slugs.has(s) || problems.push(`${p.slug}: related "${s}" does not exist`));
    if (!live.has(p.slug)) continue;
    const text = [...p.body.map(blockText), ...(p.faqs ?? []).map((f) => f.answer)].join(' ');
    for (const m of text.matchAll(/\]\((\/blog\/[^)#]+)/g)) {
      const slug = m[1].slice('/blog/'.length);
      if (!live.has(slug)) problems.push(`${p.slug}: links to "${m[1]}", which is missing or not published`);
    }

    // SEO floor for every published article (see SEO_RULES).
    const title = p.seoTitle || p.title;
    const desc = p.seoDescription || p.description;
    if (title.length > SEO_RULES.maxTitle) problems.push(`${p.slug}: SEO title is ${title.length} characters (max ${SEO_RULES.maxTitle})`);
    if (desc.length < SEO_RULES.minDescription || desc.length > SEO_RULES.maxDescription)
      problems.push(`${p.slug}: meta description is ${desc.length} characters (aim ${SEO_RULES.minDescription}-${SEO_RULES.maxDescription})`);
    const internal = new Set([...text.matchAll(/\]\((\/blog\/[^)#]+)/g)].map((m) => m[1])).size;
    if (internal < SEO_RULES.minInternalLinks)
      problems.push(`${p.slug}: ${internal} in-text links to other articles (need ${SEO_RULES.minInternalLinks})`);
    const external = (p.sources?.length ?? 0) + [...text.matchAll(/\]\((https?:[^)]+)\)/g)].length;
    if (external < SEO_RULES.minExternalSources) problems.push(`${p.slug}: no external source or official reference`);
  }
  if (problems.length) throw new Error(`Blog content problems:\n  ${problems.join('\n  ')}`);
}

validate(ALL_POSTS);
