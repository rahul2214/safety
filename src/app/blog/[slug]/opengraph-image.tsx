import { ImageResponse } from 'next/og';
import { BLOG_POSTS, getCategory, getPost } from '@/lib/blog-posts';
import { SITE_URL } from '@/lib/seo-schemas';

export const alt = 'Sabhijude blog article';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

const BG: Record<string, string> = {
  red: 'linear-gradient(135deg, #dc2626 0%, #f43f5e 55%, #fb7185 100%)',
  blue: 'linear-gradient(135deg, #123c94 0%, #1d5bd8 55%, #38bdf8 100%)',
  coral: 'linear-gradient(135deg, #b91c1c 0%, #e11d48 60%, #fb7185 100%)',
  ink: 'linear-gradient(135deg, #0b1630 0%, #1b2a4a 55%, #123c94 100%)',
};

/** Social card for each article: title, category and the site name, in the article's colours. */
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  const title = post?.title ?? 'Sabhijude blog';
  const category = post ? getCategory(post.category)?.name ?? '' : '';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px 72px',
          background: BG[post?.accent ?? 'ink'],
          color: 'white',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div
            style={{
              display: 'flex',
              padding: '10px 22px',
              borderRadius: 999,
              background: 'rgba(255,255,255,0.18)',
              fontSize: 28,
              fontWeight: 700,
            }}
          >
            {category}
          </div>
          <div style={{ display: 'flex', fontSize: 34, fontWeight: 800, letterSpacing: -0.5 }}>Sabhijude</div>
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: title.length > 70 ? 58 : 68,
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: -1.5,
            maxWidth: 1000,
          }}
        >
          {title}
        </div>
        <div style={{ display: 'flex', fontSize: 26, opacity: 0.85 }}>{SITE_URL.replace(/^https?:\/\//, '')}/blog</div>
      </div>
    ),
    size,
  );
}
