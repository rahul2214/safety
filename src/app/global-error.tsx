'use client'; // Error boundaries must be Client Components

/**
 * Last resort, when the root layout itself fails. It replaces the whole document and gets
 * none of the site's styles, so everything here is inline. Keeps the 112 number on screen.
 */
export default function GlobalError({ error, retry }: { error: unknown; retry: () => void }) {
  const digest = error instanceof Error ? (error as Error & { digest?: string }).digest : undefined;

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
          background: '#f8fafc',
          color: '#0f172a',
          padding: 24,
          textAlign: 'center',
        }}
      >
        <title>Sabhijude</title>
        <div style={{ maxWidth: 420 }}>
          <h1 style={{ fontSize: 22, margin: '0 0 8px' }}>Sabhijude could not load</h1>
          <p style={{ fontSize: 15, lineHeight: 1.5, color: '#475569', margin: 0 }}>
            This is usually a brief connection or server problem. Please try again.
          </p>
          <div style={{ marginTop: 20, display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => retry()}
              style={{
                background: '#2563eb',
                color: '#fff',
                border: 0,
                borderRadius: 12,
                padding: '10px 20px',
                fontSize: 14,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Try again
            </button>
            <a
              href="tel:112"
              style={{
                border: '1px solid #fda4af',
                color: '#be123c',
                borderRadius: 12,
                padding: '10px 20px',
                fontSize: 14,
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              In danger? Call 112
            </a>
          </div>
          {digest && <p style={{ marginTop: 16, fontSize: 12, color: '#94a3b8' }}>Reference: {digest}</p>}
        </div>
      </body>
    </html>
  );
}
