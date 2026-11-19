import type { Metadata } from 'next';
import Link from 'next/link';

/**
 * Public account and data deletion page. Google Play links to it from the Sabhijude store
 * listing ("Delete data URL"), so it must work without signing in and must state what is
 * deleted, what is kept, and for how long.
 *
 * Keep this page in step with AccountController.DeleteAccount. If that changes, change this.
 */
export const metadata: Metadata = {
  title: 'Delete your account or data',
  description:
    'How to delete your Sabhijude account or individual data, what is deleted, and what is kept and for how long.',
  alternates: { canonical: '/delete-account' },
};

const SUPPORT_EMAIL = 'admin@veltria.in';

const DELETED = [
  'Your sign-in (email and password). You can no longer log in.',
  'Your name, email address, phone number, bio, date of birth, gender, occupation and blood group.',
  'Your trusted contacts (their names and phone numbers).',
  'Your blood requests, including the phone number and location on them.',
  'Your saved posts, notifications, and the people you blocked or who blocked you.',
  'Your device notification token.',
  'The text and location of the safety reports you posted. They are removed from the app.',
  'Your membership of any college or workplace, and every permission you gave it.',
];

const KEPT = [
  {
    what: 'Solutions and replies you wrote on other people’s reports',
    why: 'They stay so those conversations still make sense, but show as “Erased User” with no name or contact details.',
  },
  {
    what: 'Support requests you sent us',
    why: 'The conversation is kept for our records with your name, email and phone removed.',
  },
  {
    what: 'A deletion record',
    why: 'Your internal account number and the date you deleted it, with no name, email or phone, kept for up to 3 years to show we honoured your request.',
  },
  {
    what: 'Backups',
    why: 'Copies in our encrypted database backups are removed as those backups expire, within 30 days.',
  },
];

const PARTIAL = [
  ['A trusted contact', 'Profile → Emergency contacts → delete the contact'],
  ['A safety report you posted', 'Open your report → Delete'],
  ['A solution or reply you wrote', 'Open the report → delete your solution or reply'],
  ['A blood request', 'Open your request → Delete'],
  ['Blood group and other optional profile details', 'Profile → Edit profile → clear the field'],
  [
    'What a college or workplace holds about you',
    'App: Profile → My institutions → Leave. Website: Organizations → Erase my data',
  ],
];

export default function DeleteAccountPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:py-14 text-ink">
      <p className="text-xs font-bold uppercase tracking-wider text-brand">Sabhijude by Veltria</p>
      <h1 className="mt-2 font-display text-3xl sm:text-4xl font-extrabold tracking-tight">
        Delete your account or data
      </h1>
      <p className="mt-3 text-slate-600 leading-relaxed">
        You can delete your Sabhijude account at any time, from the app, on this website, or by
        emailing us. Deleting your account is permanent and cannot be undone.
      </p>

      {/* ─── How to delete the account ─── */}
      <section className="mt-10 space-y-4" aria-labelledby="how">
        <h2 id="how" className="text-xl font-bold">How to delete your account</h2>

        <div className="rounded-2xl border border-slate-200 p-5">
          <h3 className="font-bold">Option 1: In the Sabhijude app</h3>
          <ol className="mt-2 list-decimal pl-5 space-y-1 text-slate-700">
            <li>Open Sabhijude and go to the <strong>Profile</strong> tab.</li>
            <li>Tap <strong>Settings &amp; DPDP privacy</strong>.</li>
            <li>Tap <strong>Right to Erasure: Permanent Account Deletion</strong>.</li>
            <li>Confirm with <strong>Erase account</strong>.</li>
          </ol>
        </div>

        <div className="rounded-2xl border border-slate-200 p-5">
          <h3 className="font-bold">Option 2: On this website</h3>
          <ol className="mt-2 list-decimal pl-5 space-y-1 text-slate-700">
            <li>
              <Link href="/login?redirect=/profile" className="font-semibold text-brand hover:underline">
                Sign in
              </Link>{' '}
              and open your <strong>Profile</strong>.
            </li>
            <li>Under <strong>Account</strong>, click <strong>Delete my account</strong>.</li>
            <li>Type <strong>DELETE</strong> to confirm.</li>
          </ol>
        </div>

        <div className="rounded-2xl border border-slate-200 p-5">
          <h3 className="font-bold">Option 3: By email (no app or sign-in needed)</h3>
          <p className="mt-2 text-slate-700">
            Email{' '}
            <a
              href={`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent('Delete my Sabhijude account')}`}
              className="font-semibold text-brand hover:underline"
            >
              {SUPPORT_EMAIL}
            </a>{' '}
            from the email address you signed up with, with the subject{' '}
            <strong>&ldquo;Delete my Sabhijude account&rdquo;</strong>. We confirm the request
            comes from you and delete the account within 30 days, then reply to let you know.
          </p>
        </div>
      </section>

      {/* ─── What is deleted ─── */}
      <section className="mt-10" aria-labelledby="deleted">
        <h2 id="deleted" className="text-xl font-bold">What is deleted</h2>
        <ul className="mt-3 list-disc pl-5 space-y-1.5 text-slate-700">
          {DELETED.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      {/* ─── What is kept ─── */}
      <section className="mt-10" aria-labelledby="kept">
        <h2 id="kept" className="text-xl font-bold">What is kept, and for how long</h2>
        <div className="mt-3 space-y-3">
          {KEPT.map((k) => (
            <div key={k.what} className="rounded-xl bg-slate-50 border border-slate-200 p-4">
              <p className="font-semibold">{k.what}</p>
              <p className="text-sm text-slate-600 mt-1">{k.why}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Partial deletion ─── */}
      <section className="mt-10" aria-labelledby="partial">
        <h2 id="partial" className="text-xl font-bold">Delete some data and keep your account</h2>
        <p className="mt-2 text-slate-600">You can remove individual items yourself in the app:</p>
        <div className="mt-3 overflow-hidden rounded-xl border border-slate-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-4 py-2 font-semibold">To delete</th>
                <th className="px-4 py-2 font-semibold">Go to</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {PARTIAL.map(([what, where]) => (
                <tr key={what}>
                  <td className="px-4 py-2.5 align-top">{what}</td>
                  <td className="px-4 py-2.5 align-top text-slate-600">{where}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm text-slate-600">
          For anything else, email{' '}
          <a href={`mailto:${SUPPORT_EMAIL}`} className="font-semibold text-brand hover:underline">
            {SUPPORT_EMAIL}
          </a>{' '}
          and tell us what you would like removed.
        </p>
      </section>

      <p className="mt-10 text-sm text-slate-500">
        More about how we handle your data:{' '}
        <Link href="/privacy" className="font-semibold text-brand hover:underline">
          Privacy policy
        </Link>
        .
      </p>
    </div>
  );
}
