import type { BlogPost } from '../types';

/**
 * Batch 4: reporting, anonymity and campus safety (community / safety awareness, partly
 * product-led). Sabhijude claims follow the backend: new posts get an automatic check for spam
 * and off-topic content (SafetyContentModerator); anonymous posts show "Anonymous Member" and can
 * be reported but not blocked; one report per member per post; 3 distinct reporters flag an
 * account for a moderator; automatic suspension needs 20 distinct reporters whose accounts are
 * at least a day old (AccountStandingService). Checked 2026-11-25.
 */

export const COMMUNITY_AWARENESS_POSTS: BlogPost[] = [
  /* ---------------------------------------------------------------- anonymous reporting */
  {
    slug: 'why-anonymous-reporting-matters',
    title: 'Why anonymous reporting helps people speak up',
    seoTitle: 'Anonymous Reporting: How It Works and Why It Helps',
    description:
      'Many people never report harassment or unsafe places because they fear being identified. How anonymous reporting works, what it protects, and its limits.',
    category: 'safety-awareness',
    tags: ['Anonymous reporting', 'Community', 'Privacy'],
    keywords: ['anonymous reporting', 'how does anonymous reporting work', 'can you report something without revealing your identity', 'why reporting unsafe behaviour matters'],
    authorId: 'editorial',
    status: 'published',
    publishedAt: '2026-11-25',
    updatedAt: '2026-11-25',
    related: ['community-safety-guide', 'what-happens-after-you-report', 'report-vs-block', 'how-colleges-can-build-safer-campus'],
    sources: [
      { title: 'National Cyber Crime Reporting Portal (cybercrime.gov.in)', publisher: 'Ministry of Home Affairs', url: 'https://cybercrime.gov.in/' },
    ],
    accent: 'ink',
    art: 'Anon',
    body: [
      {
        type: 'p',
        text: 'Most harassment and unsafe situations are never reported. Not because people do not care, but because reporting feels risky: the person might find out, friends might judge, or nothing will happen anyway. Anonymous reporting removes the biggest of those barriers.',
      },
      { type: 'h2', text: 'Why people stay silent' },
      {
        type: 'ul',
        items: [
          'Fear of retaliation from the person they report, especially a classmate, colleague or neighbour.',
          'Fear of being blamed, gossiped about or not believed.',
          'Not being sure it is “serious enough” to report.',
          'Believing nothing will change.',
        ],
      },
      { type: 'h2', text: 'What anonymous reporting changes' },
      {
        type: 'p',
        text: 'When people can share what happened without their name attached, more incidents come to light. A single report may not prove much, but several reports about the same street, bus route or person show a pattern that others, and institutions, can act on. It also lets people warn others quickly: “The lights on this road have been out for a week”, “Someone has been following women near the station gate”.',
      },
      { type: 'h2', text: 'What anonymous does and does not mean' },
      {
        type: 'p',
        text: 'Anonymous usually means **anonymous to other users**, not invisible to the platform. That distinction matters, and good platforms are honest about it:',
      },
      {
        type: 'ul',
        items: [
          'Other people cannot see your name, profile, phone number or email.',
          'The platform still knows which account posted, so abuse of anonymity, such as false accusations, can be dealt with.',
          'Like any service, a platform can be legally required to share information with the police in an investigation.',
        ],
      },
      {
        type: 'callout',
        tone: 'info',
        title: 'Anonymous reporting to the authorities',
        text: 'For sexual content involving women and children, the National Cyber Crime Reporting Portal at cybercrime.gov.in has an option to report anonymously. For most other crimes, the police need a way to contact you to investigate.',
      },
      { type: 'h2', text: 'Reporting responsibly' },
      {
        type: 'ul',
        items: [
          'Describe what happened, where and when, as factually as you can.',
          'Avoid naming or posting photos of private individuals in a public post; report people through the proper channels instead.',
          'Do not exaggerate. Accurate reports are the ones people trust and act on.',
          'If someone is in danger now, call 112 rather than posting.',
        ],
      },
      { type: 'h2', text: 'How it works on Sabhijude' },
      {
        type: 'p',
        text: 'When you post an incident on Sabhijude, you can choose to post anonymously. Other members then see “Anonymous Member” instead of your name, and your name, phone number and email are never shown. Anonymous posts can be reported like any other, but they cannot be used to block the author, so blocking cannot be used to work out who wrote them. Every new post gets an automatic check for spam and off-topic content before it appears. See [what happens after you report something](/blog/what-happens-after-you-report).',
      },
      { type: 'p', text: 'Learn [what happens after you report](/blog/what-happens-after-you-report), when to [report or block](/blog/report-vs-block), and how [colleges can build a safer campus](/blog/how-colleges-can-build-safer-campus).' },
    ],
    faqs: [
      {
        question: 'Can I report something without revealing my identity?',
        answer:
          'On many community platforms, including Sabhijude, you can post anonymously so other users do not see who you are. The platform still knows which account posted. For sexual content involving women and children, cybercrime.gov.in has an anonymous reporting option; most police complaints need your contact details.',
      },
      {
        question: 'Does anonymous mean the platform does not know who I am?',
        answer:
          'Usually not. Anonymous normally means hidden from other users. The platform keeps a record of which account posted so it can deal with abuse, and may be legally required to share information with the police.',
      },
    ],
  },

  /* ---------------------------------------------------------------- after you report */
  {
    slug: 'what-happens-after-you-report',
    title: 'What happens after you report a post or account?',
    seoTitle: 'What Happens After You Report Someone Online?',
    description:
      'Where your report goes, how platforms decide what to do, why you may not hear back, and what to do if nothing happens.',
    seoDescription: 'Where your report goes, how platforms decide what to do, why you may not hear back, and what to do in India if a harmful account is not removed.',
    category: 'community-safety',
    tags: ['Reporting', 'Moderation', 'Platforms'],
    keywords: ['what happens after you report something', 'how safety platforms handle reports', 'what happens when you report someone on Instagram', 'why reports should be reviewed before bans'],
    authorId: 'editorial',
    status: 'published',
    publishedAt: '2026-11-25',
    updatedAt: '2026-11-25',
    related: ['report-vs-block', 'why-anonymous-reporting-matters', 'how-to-report-cyber-harassment'],
    sources: [{ title: 'Grievance Appellate Committee', publisher: 'Ministry of Electronics and Information Technology', url: 'https://gac.gov.in/' }],
    accent: 'blue',
    art: 'Reported',
    body: [
      {
        type: 'p',
        text: 'You tap Report, choose a reason and submit. Then, often, nothing visible happens. Here is what usually goes on behind the scenes, and what you can do next.',
      },
      { type: 'h2', text: 'Where a report goes' },
      {
        type: 'ol',
        items: [
          '**It is logged** against the post, comment or account, with the reason you chose.',
          '**It is prioritised.** Reports involving threats, self-harm, children or intimate images are usually handled first. Choosing the most accurate reason helps.',
          '**It is reviewed,** by automated systems, people, or both, against the platform’s rules.',
          '**Action is taken** if a rule was broken: a warning, removal of the content, restrictions, or suspension of the account.',
        ],
      },
      { type: 'h2', text: 'Why you may not hear back' },
      {
        type: 'p',
        text: 'Many platforms only tell you whether content was removed, and some say nothing. They rarely share what happened to the other person’s account, for privacy reasons. The person you reported is generally not told who reported them.',
      },
      { type: 'h2', text: 'Why one report does not ban someone' },
      {
        type: 'p',
        text: 'It can be frustrating when an account stays up after you report it. But if a single report could remove anyone, reporting would become a weapon: people being harassed are often reported by their harassers. Responsible platforms look for evidence of a rule being broken, or for reports from several different people, before restricting an account.',
      },
      { type: 'h2', text: 'If nothing happens' },
      {
        type: 'ul',
        items: [
          'Report each harmful post or message individually, not just the profile.',
          'Block the account so you do not have to see it. See [report vs block](/blog/report-vs-block).',
          'In India, contact the platform’s Grievance Officer, whose details must be published, and if you are still not satisfied, appeal to the [Grievance Appellate Committee](https://gac.gov.in).',
          'For threats, stalking, blackmail or intimate images, report to the police as well. See [how to report cyber harassment](/blog/how-to-report-cyber-harassment).',
        ],
      },
      { type: 'h2', text: 'How reports work on Sabhijude' },
      {
        type: 'ul',
        items: [
          'You can report a post, a comment or a person, and choose Report & block to do both at once.',
          'Each member can report a post once; reporting again does not count twice.',
          'When several different members report the same person, the account is flagged for a moderator to review.',
          'Accounts are only suspended automatically after reports from many different, established members. Reports from accounts created in the last day do not count towards that.',
          'Anonymous posts can be reported, but not used to block their author.',
        ],
      },
      {
        type: 'p',
        text: 'Read more about [why anonymous reporting matters](/blog/why-anonymous-reporting-matters).',
      },
    ],
    faqs: [
      {
        question: 'Will the person know I reported them?',
        answer:
          'Major platforms, including Sabhijude, do not tell the reported person who reported them. They may be told that their content broke a rule or was removed.',
      },
      {
        question: 'Why was the account I reported not removed?',
        answer:
          'Platforms act when they find a rule was broken, or when several different people report the same account, so that reporting cannot be used to silence people unfairly. Report each harmful post individually, block the account, and escalate to the platform’s Grievance Officer or the police if needed.',
      },
    ],
  },

  /* ---------------------------------------------------------------- colleges */
  {
    slug: 'how-colleges-can-build-safer-campus',
    title: 'How colleges can build a safer campus',
    seoTitle: 'Campus Safety for Colleges in India: A Practical Framework',
    description:
      'For principals, deans, wardens and student affairs teams: the committees you need, how to make reporting easy and trusted, and how to respond and communicate in an emergency.',
    seoDescription: 'For principals, deans and student affairs teams in India: the committees you need, how to make reporting trusted, and how to handle emergencies.',
    category: 'college-safety',
    tags: ['Colleges', 'Campus safety', 'Institutions'],
    keywords: ['how colleges can improve student safety', 'campus safety', 'student safety India', 'college safety culture', 'how organizations can improve safety reporting'],
    authorId: 'editorial',
    status: 'published',
    publishedAt: '2026-11-25',
    updatedAt: '2026-11-25',
    related: ['campus-safety-technology', 'college-safety-reporting-system', 'college-emergency-plan', 'harassment-in-college'],
    sources: [
      { title: 'UGC regulations on sexual harassment and ragging in higher education', publisher: 'University Grants Commission', url: 'https://www.ugc.gov.in/' },
      { title: 'National Anti-Ragging Helpline', publisher: 'University Grants Commission', url: 'https://www.antiragging.in/' },
    ],
    accent: 'blue',
    art: 'Campus',
    body: [
      {
        type: 'p',
        text: 'A safe campus is not only CCTV and guards. It is a place where students know where to go, trust that reporting will be taken seriously, and see the institution act. This framework is for the people who make that happen.',
      },
      { type: 'h2', text: '1. Get the required structures right' },
      {
        type: 'ul',
        items: [
          'An **Internal Complaints Committee** for sexual harassment, as required by University Grants Commission regulations, with members’ names and contact details on notice boards and the website.',
          'An **Anti-Ragging Committee** and **Anti-Ragging Squad**, with the National Anti-Ragging Helpline (1800-180-5522) displayed prominently.',
          'Clear written policies, in plain language and in the languages your students use.',
        ],
      },
      { type: 'h2', text: '2. Make reporting easy and safe' },
      {
        type: 'ul',
        items: [
          'Offer more than one way to report: in person, by email, by phone and digitally.',
          'Allow anonymous reporting for concerns such as unsafe places, so students can raise issues without fear.',
          'Protect complainants from retaliation, and say so publicly.',
          'Acknowledge every report quickly, even if the full response takes time.',
        ],
      },
      { type: 'h2', text: '3. Respond, and show that you respond' },
      {
        type: 'p',
        text: 'Students judge a system by what happens after a report. Track reports, fix the physical issues that come up (lighting, broken locks, unsafe shortcuts), and publish an anonymised summary each term of what was reported and what changed. Visible action is what builds trust.',
      },
      { type: 'h2', text: '4. Prepare for emergencies' },
      {
        type: 'ul',
        items: [
          'A security desk that is reachable around the clock, with a number every student has saved.',
          'A way to alert all students quickly: a campus-wide message for a security incident, weather emergency or missing student.',
          'Agreed procedures with local police and the nearest hospital.',
          'Wardens and security staff trained in how to respond to harassment disclosures sensitively.',
        ],
      },
      { type: 'h2', text: '5. Build awareness from day one' },
      {
        type: 'ul',
        items: [
          'Cover safety, consent, ragging and reporting in orientation, not just in a rule book.',
          'Share a [freshers’ safety checklist](/blog/college-freshers-safety-checklist).',
          'Involve student volunteers and the women’s cell in awareness sessions.',
        ],
      },
      { type: 'h2', text: 'Where Sabhijude fits' },
      {
        type: 'p',
        text: 'Sabhijude works with colleges and organisations. Students can report incidents to their campus team, including anonymously to other students, and see campus posts; the campus team can send safety broadcasts to students. A student’s SOS goes only to their own trusted contacts, never to the college. Students choose what they share with the organisation and can change those permissions later. Colleges can request onboarding through the organisation request page on the Sabhijude website.',
      },
      { type: 'p', text: 'Share [how to report harassment in college](/blog/harassment-in-college) and [why anonymous reporting matters](/blog/why-anonymous-reporting-matters) with your staff and student volunteers.' },
    ],
  },
];
