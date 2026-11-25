'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Bug, CheckCircle2, Heart, Lightbulb, Loader2, MessageCircle, Send, Star } from 'lucide-react';
import { api } from '@/lib/api-client';
import { useAuth } from '@/lib/auth-context';

type Category = 'BUG' | 'IDEA' | 'PRAISE' | 'OTHER';

const CATEGORIES: { value: Category; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { value: 'BUG', label: 'Something broke', icon: Bug },
  { value: 'IDEA', label: 'An idea', icon: Lightbulb },
  { value: 'PRAISE', label: 'Something I like', icon: Heart },
  { value: 'OTHER', label: 'Other', icon: MessageCircle },
];

const RATING_WORDS = ['', 'Poor', 'Could be better', 'Okay', 'Good', 'Love it'];
const MAX_LENGTH = 2000;

export function FeedbackClient() {
  const { isAuthenticated } = useAuth();
  const [rating, setRating] = useState<number | null>(null);
  const [hover, setHover] = useState<number | null>(null);
  const [category, setCategory] = useState<Category>('IDEA');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      setError('Please write a few words about your feedback.');
      return;
    }
    setSending(true);
    setError(null);
    const res = await api.submitFeedback({
      rating,
      category,
      message: message.trim(),
      page: typeof document !== 'undefined' ? document.referrer || '/feedback' : '/feedback',
      contactEmail: !isAuthenticated && email.trim() ? email.trim() : undefined,
    });
    setSending(false);
    if (!res.ok) {
      setError(res.error || 'Could not send your feedback. Please try again.');
      return;
    }
    setSent(true);
  };

  if (sent) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="mx-auto h-16 w-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h1 className="mt-5 text-2xl font-bold text-slate-900">Thank you</h1>
        <p className="mt-2 text-slate-600">
          Your feedback reached the Sabhijude team. It helps us decide what to fix and build next.
        </p>
        <Link href="/" className="mt-8 inline-flex rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3">
          Back to home
        </Link>
      </div>
    );
  }

  const shown = hover ?? rating ?? 0;

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Send feedback</h1>
      <p className="mt-2 text-slate-600">Rate Sabhijude, report a problem or share an idea. We read every message.</p>

      <form onSubmit={submit} className="mt-8 space-y-7">
        <section>
          <h2 className="text-xs font-bold tracking-wider text-slate-500 uppercase">How is Sabhijude for you?</h2>
          <div className="mt-3 flex items-center gap-1" onMouseLeave={() => setHover(null)}>
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                aria-label={`${n} star${n > 1 ? 's' : ''}`}
                aria-pressed={rating === n}
                onMouseEnter={() => setHover(n)}
                onClick={() => setRating(rating === n ? null : n)}
                className="p-1 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <Star className={`h-8 w-8 transition ${n <= shown ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
              </button>
            ))}
            <span className="ml-3 text-sm text-slate-500">{shown ? RATING_WORDS[shown] : 'Optional'}</span>
          </div>
        </section>

        <section>
          <h2 className="text-xs font-bold tracking-wider text-slate-500 uppercase">What is it about?</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {CATEGORIES.map((c) => {
              const on = category === c.value;
              return (
                <button
                  key={c.value}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setCategory(c.value)}
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                    on ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <c.icon className="h-4 w-4" />
                  {c.label}
                </button>
              );
            })}
          </div>
        </section>

        <section>
          <label htmlFor="feedback-message" className="text-xs font-bold tracking-wider text-slate-500 uppercase">
            Your feedback
          </label>
          <textarea
            id="feedback-message"
            value={message}
            onChange={(e) => {
              setMessage(e.target.value.slice(0, MAX_LENGTH));
              if (error) setError(null);
            }}
            rows={6}
            placeholder={category === 'BUG' ? 'What happened, and what did you expect instead?' : 'Tell us what you think…'}
            className={`mt-3 w-full rounded-xl border bg-white px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              error ? 'border-rose-400' : 'border-slate-200'
            }`}
          />
          <div className="mt-1 flex text-xs">
            <span className="flex-1 text-rose-600">{error}</span>
            <span className="text-slate-400">
              {message.length}/{MAX_LENGTH}
            </span>
          </div>
        </section>

        {!isAuthenticated && (
          <section>
            <label htmlFor="feedback-email" className="text-xs font-bold tracking-wider text-slate-500 uppercase">
              Email (optional)
            </label>
            <input
              id="feedback-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Only if you'd like a reply"
              className="mt-3 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </section>
        )}

        <p className="text-xs text-slate-500">
          {isAuthenticated ? 'Sent with your account so we can follow up if needed. ' : ''}
          For an emergency, use SOS or call 112.
        </p>

        <button
          type="submit"
          disabled={sending}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold px-6 py-3.5"
        >
          {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          {sending ? 'Sending…' : 'Send feedback'}
        </button>
      </form>
    </div>
  );
}
