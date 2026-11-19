import type { Metadata } from 'next';
import Link from 'next/link';

/**
 * Child safety standards (CSAE). Google Play requires apps with social features to publish
 * their standards against child sexual abuse and exploitation and a point of contact.
 * Linked from Play Console ("Safety standards URL") and the site footer.
 *
 * Every statement here is an operational commitment. Keep it true: if moderation practice or
 * the report flow changes, change this page.
 */
export const metadata: Metadata = {
  title: 'Child Safety Standards',
  description:
    'Sabhijude’s standards against child sexual abuse and exploitation (CSAE): what is prohibited, how to report, and how we act.',
  alternates: { canonical: '/child-safety' },
};

const LAST_UPDATED = '19 November 2026';
const CONTACT_EMAIL = 'admin@veltria.in';

export default function ChildSafetyPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:py-14 text-ink">
      <p className="text-xs font-bold uppercase tracking-wider text-brand">Sabhijude by Veltria</p>
      <h1 className="mt-2 font-display text-3xl sm:text-4xl font-extrabold tracking-tight">
        Child Safety Standards
      </h1>
      <p className="mt-2 text-sm text-slate-500">Last updated: {LAST_UPDATED}</p>

      <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-900 space-y-1">
        <p>
          <strong>If a child is in immediate danger, call 112.</strong> For children in need of care
          or protection, call <strong>CHILDLINE 1098</strong>.
        </p>
        <p>
          You can also report child sexual abuse material to the government at{' '}
          <a href="https://cybercrime.gov.in" className="font-semibold underline" rel="noopener">
            cybercrime.gov.in
          </a>
          .
        </p>
      </div>

      <div
        className="mt-8 space-y-10 text-slate-700 leading-relaxed
          [&_p]:mt-3 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5
          [&_a]:font-semibold [&_a]:text-brand hover:[&_a]:underline [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-ink"
      >
        <section aria-labelledby="commitment">
          <h2 id="commitment">Our commitment</h2>
          <p>
            Sabhijude is a personal and community safety app. We have zero tolerance for child
            sexual abuse and exploitation (CSAE) and child sexual abuse material (CSAM). We remove
            it, ban the accounts involved, and report it to the authorities.
          </p>
        </section>

        <section aria-labelledby="prohibited">
          <h2 id="prohibited">What is prohibited</h2>
          <p>Anywhere in Sabhijude, including reports, replies, profiles and blood requests:</p>
          <ul>
            <li>Any sexual content involving a minor (anyone under 18), real or fictional, including drawings or AI-generated material.</li>
            <li>Grooming: building contact or trust with a child for sexual purposes.</li>
            <li>Sexualising children, or asking a child for sexual images, messages or meetings.</li>
            <li>Sharing, requesting, or linking to child sexual abuse material.</li>
            <li>Trafficking, sextortion, or any other exploitation of children.</li>
            <li>Content that identifies a child victim of abuse.</li>
          </ul>
          <p>
            These rules are part of our <Link href="/terms">Terms of Service</Link>, which every user
            agrees to.
          </p>
        </section>

        <section aria-labelledby="report">
          <h2 id="report">How to report a concern</h2>
          <ul>
            <li>
              <strong>In the app or on the website:</strong> open the post or reply, choose{' '}
              <strong>Report</strong>, and select <strong>Child safety concern</strong>. You can add
              details. The person you report is not told who reported them.
            </li>
            <li>
              <strong>By email:</strong> write to{' '}
              <a href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Child safety concern')}`}>
                {CONTACT_EMAIL}
              </a>{' '}
              with the subject &ldquo;Child safety concern&rdquo;. Describe what you saw and where. Do not
              attach or forward abusive images; we will find the content ourselves.
            </li>
          </ul>
        </section>

        <section aria-labelledby="act">
          <h2 id="act">How we act on reports</h2>
          <ul>
            <li>Child safety reports are reviewed before all other reports, and within 24 hours.</li>
            <li>Content that breaks these standards is removed, and the accounts involved are banned.</li>
            <li>
              We report CSAM and child exploitation to the authorities in India, including the
              National Cybercrime Reporting Portal (cybercrime.gov.in) and the police, as required
              by the Protection of Children from Sexual Offences (POCSO) Act, 2012 and the
              Information Technology Act, 2000.
            </li>
            <li>We preserve the relevant records for law enforcement, as the law requires, and cooperate with lawful requests.</li>
          </ul>
        </section>

        <section aria-labelledby="design">
          <h2 id="design">How Sabhijude is designed to protect children</h2>
          <ul>
            <li>There is no private messaging between users, so strangers cannot contact a child privately through the app.</li>
            <li>Users can post anonymously, and reports never reveal who reported whom.</li>
            <li>Posts and replies are screened automatically, and our team reviews reported content.</li>
            <li>Location is shared only when the user chooses (for example, an SOS to their own trusted contacts).</li>
            <li>Users under 18 may use Sabhijude only with a parent&rsquo;s or guardian&rsquo;s consent.</li>
          </ul>
        </section>

        <section aria-labelledby="contact">
          <h2 id="contact">Child safety point of contact</h2>
          <p>
            Our designated contact for child safety, including our CSAM prevention practices and
            compliance, is reachable at{' '}
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
