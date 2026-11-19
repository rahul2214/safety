import type { Metadata } from 'next';
import Link from 'next/link';

/**
 * Terms of Service. Linked from Google Play ("Terms of Service URL"), the site footer and
 * sign-up. Written in plain language; have it reviewed by a lawyer before relying on it,
 * and update LAST_UPDATED whenever the text changes.
 */
export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    'The terms for using Sabhijude: emergency limits, community rules, blood requests, organizations, accounts and your rights.',
  alternates: { canonical: '/terms' },
};

const LAST_UPDATED = '19 November 2026';
const CONTACT_EMAIL = 'admin@veltria.in';

type Section = { id: string; title: string; body: React.ReactNode };

const SECTIONS: Section[] = [
  {
    id: 'about',
    title: '1. About these terms',
    body: (
      <>
        <p>
          These terms apply to the Sabhijude mobile app and the website at sabhijude.veltria.in
          (together, &ldquo;Sabhijude&rdquo;), provided by Veltria (&ldquo;we&rdquo;, &ldquo;us&rdquo;). By
          creating an account or using Sabhijude, you agree to these terms and to our{' '}
          <Link href="/privacy">Privacy Policy</Link>. If you do not agree, please do not use Sabhijude.
        </p>
        <p>Sabhijude is free to use. We do not sell your personal data.</p>
      </>
    ),
  },
  {
    id: 'emergencies',
    title: '2. Sabhijude is not an emergency service',
    body: (
      <>
        <p className="font-semibold text-ink">
          In immediate danger, call 112 (or your local emergency number) first.
        </p>
        <p>
          Sabhijude helps you alert people you trust and find help, but it does not replace the
          police, ambulance or other emergency services, and we do not monitor alerts or send help
          ourselves.
        </p>
        <p>An SOS alert depends on things outside our control, including:</p>
        <ul>
          <li>your phone having battery, a network or internet connection, and location turned on;</li>
          <li>the app having the permissions it needs;</li>
          <li>your trusted contacts&rsquo; details being correct, and them seeing and acting on the alert;</li>
          <li>the services we rely on (such as mobile networks and notification services) working.</li>
        </ul>
        <p>
          We work hard to make alerts reliable, but we cannot guarantee that every alert is
          delivered, delivered on time, or that your location is exact. Keep your trusted contacts
          up to date and test the app before you need it.
        </p>
      </>
    ),
  },
  {
    id: 'eligibility',
    title: '3. Who can use Sabhijude',
    body: (
      <>
        <p>
          You must be at least 10 years old to create an account. If you are under 18, you may use
          Sabhijude only with the consent and supervision of a parent or lawful guardian, who agrees
          to these terms on your behalf.
        </p>
        <p>You may not use Sabhijude if we have previously removed you from it.</p>
      </>
    ),
  },
  {
    id: 'account',
    title: '4. Your account',
    body: (
      <ul>
        <li>Give accurate information and keep it up to date, especially your phone number and trusted contacts.</li>
        <li>Keep your password private. You are responsible for activity on your account.</li>
        <li>Only add trusted contacts who know you have added them and are happy to receive your alerts.</li>
        <li>
          You can delete your account at any time. See{' '}
          <Link href="/delete-account">how to delete your account or data</Link>.
        </li>
      </ul>
    ),
  },
  {
    id: 'community',
    title: '5. Community reports and your content',
    body: (
      <>
        <p>
          You can post safety reports, solutions, replies and blood requests (&ldquo;your content&rdquo;).
          You remain the owner of your content. You give us permission to store, display and share
          it within Sabhijude, in the way you choose (for example, to everyone or only to some
          audiences, and with or without your name), so the service can work.
        </p>
        <p>You must not post anything that:</p>
        <ul>
          <li>is false or misleading, including false reports of incidents;</li>
          <li>names, identifies, threatens or harasses another person, or shares their personal details;</li>
          <li>is abusive, hateful, sexually explicit or graphically violent;</li>
          <li>encourages violence, self-harm or illegal activity;</li>
          <li>infringes someone else&rsquo;s rights, or that you do not have the right to share;</li>
          <li>is spam, advertising or an attempt to mislead others.</li>
        </ul>
        <p>
          You can report content or users from within the app. We may review, hide or remove
          content, and limit, suspend or close accounts, when content breaks these terms or the law,
          or to keep people safe. If your account is suspended, you can appeal from within the app.
        </p>
        <p>
          Reports are written by other users. We do not verify every report and are not responsible
          for what users post. Use your own judgement.
        </p>
      </>
    ),
  },
  {
    id: 'blood',
    title: '6. Blood donation requests',
    body: (
      <p>
        Blood requests connect people who need blood with people who may be able to help. We do
        not collect, test or supply blood, check donors&rsquo; health, or give medical advice. Donation
        and treatment are always between donors, patients, hospitals and blood banks. Post only
        genuine requests, and remove them when they are no longer needed.
      </p>
    ),
  },
  {
    id: 'organizations',
    title: '7. Colleges and workplaces',
    body: (
      <>
        <p>
          If your college, employer or other organization uses Sabhijude, you can join it by
          invitation or code. You choose what it can see about you (for example, your contact
          details or your location during an SOS), and you can change this or leave at any time.
        </p>
        <p>
          Each organization is responsible for how its own staff use the information you share with
          it, and for its own security response. Sabhijude does not control how quickly or whether
          an organization responds.
        </p>
      </>
    ),
  },
  {
    id: 'acceptable-use',
    title: '8. Using Sabhijude responsibly',
    body: (
      <>
        <p>You must not:</p>
        <ul>
          <li>send false SOS alerts or misuse emergency features;</li>
          <li>use Sabhijude to track, stalk or monitor anyone without their knowledge;</li>
          <li>pretend to be someone else, or create accounts on someone else&rsquo;s behalf without permission;</li>
          <li>try to access accounts or data that are not yours, or interfere with the service;</li>
          <li>copy or collect other users&rsquo; information, including by automated means.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'information',
    title: '9. Safety information',
    body: (
      <p>
        Safety guides, legal information and helpline numbers in Sabhijude are for general
        awareness. They are not legal or medical advice. Helpline numbers and laws can change;
        check with the official source, a lawyer or a doctor when it matters.
      </p>
    ),
  },
  {
    id: 'privacy',
    title: '10. Privacy',
    body: (
      <p>
        Our <Link href="/privacy">Privacy Policy</Link> explains what we collect, including your
        location when you use location features, and how we use and protect it, in line with the
        Digital Personal Data Protection Act, 2023.
      </p>
    ),
  },
  {
    id: 'changes',
    title: '11. Changes to Sabhijude and these terms',
    body: (
      <p>
        We may improve, change or stop parts of Sabhijude. We may also update these terms. If a
        change is significant, we will let you know in the app or by email before it takes effect.
        Continuing to use Sabhijude after that means you accept the updated terms.
      </p>
    ),
  },
  {
    id: 'liability',
    title: '12. Our responsibility to you',
    body: (
      <>
        <p>
          We provide Sabhijude with reasonable care and skill, but &ldquo;as is&rdquo;: we cannot
          promise it will always be available, error-free or able to prevent harm.
        </p>
        <p>
          To the extent the law allows, we are not responsible for loss or harm caused by: events
          outside our reasonable control; failures of networks, devices or third-party services;
          the actions of other users, trusted contacts or organizations; or content posted by others.
          Nothing in these terms limits any responsibility that cannot be limited under Indian law.
        </p>
      </>
    ),
  },
  {
    id: 'ending',
    title: '13. Ending your use',
    body: (
      <p>
        You can stop using Sabhijude and delete your account at any time. We may suspend or close
        an account that seriously or repeatedly breaks these terms, or where needed to protect
        people or comply with the law. Where appropriate, we will tell you why and how to appeal.
      </p>
    ),
  },
  {
    id: 'law',
    title: '14. Law and disputes',
    body: (
      <p>
        These terms are governed by the laws of India. Any dispute will be handled by the courts
        in India. Before going to court, please contact us so we can try to resolve the issue.
      </p>
    ),
  },
  {
    id: 'contact',
    title: '15. Grievances and contact',
    body: (
      <>
        <p>
          For complaints about content, your account or these terms, or any other concern, contact
          our Grievance Officer at{' '}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. We acknowledge complaints within
          24 hours and aim to resolve them within 15 days.
        </p>
        <p>
          To report content that is unlawful or that harms you, you can also use the
          &ldquo;Report&rdquo; option in the app.
        </p>
      </>
    ),
  },
];

export default function TermsPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:py-14 text-ink">
      <p className="text-xs font-bold uppercase tracking-wider text-brand">Sabhijude by Veltria</p>
      <h1 className="mt-2 font-display text-3xl sm:text-4xl font-extrabold tracking-tight">Terms of Service</h1>
      <p className="mt-2 text-sm text-slate-500">Last updated: {LAST_UPDATED}</p>

      <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-900">
        <strong>In immediate danger, call 112.</strong> Sabhijude helps you reach people you trust,
        but it is not an emergency service and cannot guarantee that alerts are delivered.
      </div>

      <nav aria-label="Contents" className="mt-8 rounded-2xl border border-slate-200 p-5">
        <p className="text-sm font-bold">Contents</p>
        <ol className="mt-2 grid gap-1 sm:grid-cols-2 text-sm">
          {SECTIONS.map((s) => (
            <li key={s.id}>
              <a href={`#${s.id}`} className="text-brand hover:underline">
                {s.title}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div
        className="mt-8 space-y-10 text-slate-700 leading-relaxed
          [&_p]:mt-3 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5
          [&_a]:font-semibold [&_a]:text-brand hover:[&_a]:underline"
      >
        {SECTIONS.map((s) => (
          <section key={s.id} id={s.id} aria-labelledby={`${s.id}-title`} className="scroll-mt-24">
            <h2 id={`${s.id}-title`} className="text-xl font-bold text-ink">
              {s.title}
            </h2>
            {s.body}
          </section>
        ))}
      </div>
    </div>
  );
}
