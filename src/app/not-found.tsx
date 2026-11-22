import Link from 'next/link';
import { Compass, Home } from 'lucide-react';

/** Any address that does not exist on the site. */
export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-6 py-16 text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/40">
        <Compass className="h-8 w-8" aria-hidden />
      </div>
      <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">Page not found</h1>
      <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
        This link may be old or mistyped, or the page may have been removed.
      </p>
      <Link
        href="/"
        className="mt-6 flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-700"
      >
        <Home className="h-4 w-4" aria-hidden /> Go to home
      </Link>
    </main>
  );
}
