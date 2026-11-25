import type { BlogPost } from '../types';

/** Cyberbullying and fake-profile articles (P0). Checked against official sources on 2026-11-25. */

export const CYBER_POSTS: BlogPost[] = [
  /* ---------------------------------------------------------------- cyberbullying */
  {
    slug: 'cyberbullying-india',
    title: 'Being cyberbullied? What to do, and how to report it',
    seoTitle: 'Cyberbullying in India: What to Do and How to Report It',
    description:
      'What counts as cyberbullying, how to respond without making it worse, how to report it to the app, your school or college and the police, and how friends and parents can help.',
    seoDescription: 'What cyberbullying looks like, how to respond without making it worse, and how to report it to the app, your school or college, or the police in India.',
    category: 'cyberbullying',
    tags: ['Cyberbullying', 'Students', 'Parents', 'Reporting'],
    keywords: ['cyberbullying', 'cyber bullying India', 'what to do if you are cyberbullied', 'report cyberbullying', 'cyberbullying for students', 'online bullying'],
    authorId: 'editorial',
    status: 'published',
    publishedAt: '2026-11-25',
    updatedAt: '2026-11-25',
    related: ['report-vs-block', 'how-to-support-someone-being-harassed', 'harassment-in-college', 'how-to-report-cyber-harassment'],
    sources: [
      { title: 'National Cyber Crime Reporting Portal (cybercrime.gov.in)', publisher: 'Ministry of Home Affairs', url: 'https://cybercrime.gov.in/' },
      { title: 'National Anti-Ragging Helpline', publisher: 'University Grants Commission', url: 'https://www.antiragging.in/' },
    ],
    accent: 'coral',
    art: 'You’re not alone',
    body: [
      {
        type: 'p',
        text: 'Cyberbullying is repeated, deliberate behaviour online that is meant to hurt, embarrass, frighten or exclude someone. It follows you home, it can be seen by everyone you know, and it can feel impossible to escape. It is never something you deserve.',
      },
      { type: 'h2', text: 'What cyberbullying can look like' },
      {
        type: 'ul',
        items: [
          'Mean or humiliating comments, memes or posts about you.',
          'Being deliberately left out of, or mocked in, group chats.',
          'Rumours or lies spread about you.',
          'Fake accounts pretending to be you, or made to mock you.',
          'Sharing your photos, screenshots of your messages or your personal details without permission.',
          'Threats, or pressure to do things you do not want to do.',
        ],
      },
      { type: 'h2', text: 'What to do if it is happening to you' },
      {
        type: 'ol',
        items: [
          '**Do not respond in anger.** Bullies often want a reaction. Not giving one takes away some of their power.',
          '**Save the evidence.** Screenshot messages and posts with names and dates before anything is deleted. See [how to preserve evidence](/blog/how-to-preserve-digital-evidence).',
          '**Block and report.** Block the accounts and report the posts on the app. Here is [when to report and when to block](/blog/report-vs-block).',
          '**Tighten your privacy.** Make your accounts private, limit who can comment or message you, and remove people you do not trust.',
          '**Tell someone.** A friend, parent, teacher, counsellor or warden. Telling is not “snitching”; it is how bullying stops.',
        ],
      },
      { type: 'h2', text: 'Reporting it at school or college' },
      {
        type: 'p',
        text: 'If the bullying involves classmates, your school or college can act even when it happens online. Take your evidence to a teacher, counsellor, the anti-bullying or anti-ragging committee, or the Internal Complaints Committee if it is sexual in nature. In colleges, bullying of a student by others can count as ragging, and you can contact the National Anti-Ragging Helpline on **1800-180-5522**. Our guide on [harassment in college](/blog/harassment-in-college) explains each route.',
      },
      { type: 'h2', text: 'When to go to the police' },
      {
        type: 'p',
        text: 'Some cyberbullying is also a crime: threats, sexual comments or images, impersonation, sharing private photos, stalking or blackmail. You can report these on [cybercrime.gov.in](https://cybercrime.gov.in), by calling **1930**, or at a police station. If you are under 18, ask a parent or another trusted adult to help you. See [how to report cyber harassment](/blog/how-to-report-cyber-harassment).',
      },
      { type: 'h2', text: 'If you are a parent' },
      {
        type: 'ul',
        items: [
          'Stay calm and listen. Your child may be afraid you will take their phone away, which is often why children do not tell.',
          'Do not blame them for what they posted or who they talked to.',
          'Help them save evidence, then block and report together.',
          'Talk to the school, and keep a written record of what you reported and when.',
          'Watch for changes in sleep, mood, eating or wanting to go to school, and seek help from a counsellor if you are worried. Our [online safety guide for parents](/blog/children-online-safety-parents) has more.',
        ],
      },
      { type: 'h2', text: 'If a friend is being bullied' },
      {
        type: 'p',
        text: 'Do not like, share or join in, even as a joke. Message your friend privately to say you are with them. Report the posts. If you are worried about their safety, tell a trusted adult. One person standing with them makes a real difference. More on [supporting someone who is being harassed](/blog/how-to-support-someone-being-harassed).',
      },
      {
        type: 'callout',
        tone: 'info',
        title: 'If it is affecting how you feel',
        text: 'Feeling anxious, low or hopeless because of bullying is common and it is not weakness. Talk to someone today. The free national mental health helpline, Tele MANAS, is on 14416. If you or someone else is in danger, call 112.',
      },
    ],
    faqs: [
      {
        question: 'Can I report cyberbullying in India?',
        answer:
          'Yes. Report it on the app first, and to your school or college. If it involves threats, sexual content, impersonation, stalking or blackmail, you can also report it at [cybercrime.gov.in](https://cybercrime.gov.in), on 1930 or at a police station.',
      },
      {
        question: 'Is cyberbullying a crime in India?',
        answer:
          'India does not have a single law called “cyberbullying”, but many forms of it are offences under other laws, such as criminal intimidation, stalking, defamation, identity theft and sharing private or sexual images. The police decide which provisions apply.',
      },
    ],
  },

  /* ---------------------------------------------------------------- fake profiles */
  {
    slug: 'how-to-report-fake-profile',
    title: 'How to report a fake profile or someone pretending to be you',
    seoTitle: 'How to Report a Fake Profile or Impersonation in India',
    description:
      'Someone made an account with your name or photos? How to collect evidence, report it on Instagram, Facebook and other apps (even without an account), and when to go to the police.',
    seoDescription: 'Someone using your name or photos? Collect evidence, report it on Instagram, Facebook or WhatsApp, escalate to the grievance officer, or go to police.',
    category: 'cyber-safety',
    tags: ['Fake profiles', 'Impersonation', 'Reporting'],
    keywords: ['how to report fake profile', 'fake Instagram account', 'someone created fake profile using my name', 'impersonation online', 'fake social media account', 'report fake profile India'],
    authorId: 'editorial',
    status: 'published',
    publishedAt: '2026-11-25',
    updatedAt: '2026-11-25',
    related: ['identity-theft-india', 'account-hacked-what-to-do', 'how-to-preserve-digital-evidence', 'how-to-report-cyber-harassment'],
    sources: [
      { title: 'National Cyber Crime Reporting Portal (cybercrime.gov.in)', publisher: 'Ministry of Home Affairs', url: 'https://cybercrime.gov.in/' },
      { title: 'Grievance Appellate Committee', publisher: 'Ministry of Electronics and Information Technology', url: 'https://gac.gov.in/' },
      { title: 'Instagram Help Centre: impersonation accounts', publisher: 'Instagram', url: 'https://help.instagram.com/446663175382270' },
      { title: 'Facebook Help Centre', publisher: 'Meta', url: 'https://www.facebook.com/help/' },
    ],
    accent: 'blue',
    art: 'Not me',
    body: [
      {
        type: 'p',
        text: 'Finding an account that uses your name, photos or identity is unsettling, especially if it is messaging your friends, asking for money or posting things you would never say. Fake profiles can be removed. Here is how to do it quickly.',
      },
      { type: 'h2', text: '1. Collect evidence first' },
      {
        type: 'ul',
        items: [
          'Copy the fake profile’s link (URL) and username. The display name can change; the link and username are what platforms need.',
          'Screenshot the profile page, its posts and photos, especially any that are yours.',
          'Ask friends who were contacted to screenshot what they received.',
          'Note the date you found it.',
        ],
      },
      {
        type: 'p',
        text: 'Do this before reporting, in case the account is renamed or deleted. More tips in [how to preserve digital evidence](/blog/how-to-preserve-digital-evidence).',
      },
      { type: 'h2', text: '2. Report it to the platform' },
      {
        type: 'p',
        text: 'Choose “pretending to be someone” or “impersonation”, not just “spam”. Impersonation reports usually go to a different team and are handled faster.',
      },
      {
        type: 'ul',
        items: [
          '**Instagram:** open the profile, tap the three dots, then Report, and choose that it is pretending to be someone. If you do not have an Instagram account, use Instagram’s [impersonation report form](https://help.instagram.com/446663175382270) in its Help Centre.',
          '**Facebook:** open the profile, choose Report profile, then pretending to be someone. If you do not have a Facebook account, search “impersonation” in the [Facebook Help Centre](https://www.facebook.com/help/) for the current form.',
          '**WhatsApp:** open the chat, tap the contact’s name, then Report. WhatsApp can act on the number, but cannot see message content unless you report specific messages.',
          '**Other apps:** look for Report on the profile, and the “impersonation” option in the app’s help centre.',
        ],
      },
      {
        type: 'p',
        text: 'Platforms may ask you to confirm your identity with a photo of an ID. Share it only through the platform’s own official form, never with someone who contacts you claiming to be from the platform.',
      },
      { type: 'h2', text: '3. Ask friends to report too' },
      {
        type: 'p',
        text: 'Multiple reports of the same account help. Ask friends to report it as impersonating you, and to warn others not to accept requests, reply or send money.',
      },
      { type: 'h2', text: '4. Escalate if the platform does not act' },
      {
        type: 'p',
        text: 'Under India’s IT Rules, platforms must publish a Grievance Officer’s contact details and act on complaints within fixed timelines, and impersonation in electronic form is one of the issues they must handle quickly. If the platform still does not act, you can appeal to the government’s [Grievance Appellate Committee](https://gac.gov.in).',
      },
      { type: 'h2', text: '5. When to go to the police' },
      {
        type: 'p',
        text: 'Report the fake profile to the police if it is being used to cheat people out of money, to harass or threaten you, to share intimate or morphed images, or to damage your reputation. Identity theft and cheating by impersonation are offences under the Information Technology Act. File at [cybercrime.gov.in](https://cybercrime.gov.in), call **1930** if money is involved, or visit a police station. See [how to report cyber harassment](/blog/how-to-report-cyber-harassment).',
      },
      { type: 'h2', text: 'Making it harder next time' },
      {
        type: 'ul',
        items: [
          'Make your accounts private and limit who can see your photos and friends list.',
          'Avoid posting clear photos of ID documents, boarding passes or anything with your signature.',
          'Search your own name on the main platforms every few months.',
          'Tell friends you will never ask for money by message, so they know to check with you by phone.',
        ],
      },
      { type: 'p', text: 'If your own account was taken over rather than copied, see [what to do if your account gets hacked](/blog/account-hacked-what-to-do).' },
    ],
    faqs: [
      {
        question: 'How do I report a fake Instagram account using my photos?',
        answer:
          'Open the profile, tap the three dots, choose Report and select that it is pretending to be someone. If you do not have an Instagram account, use the impersonation form in Instagram’s Help Centre. Save the profile link and screenshots first.',
      },
      {
        question: 'Is making a fake profile of someone a crime in India?',
        answer:
          'It can be. Using someone’s identity to cheat, harass or defame them may be an offence under the Information Technology Act and the Bharatiya Nyaya Sanhita. If a fake profile is used this way, report it at cybercrime.gov.in or at a police station.',
      },
      {
        question: 'What if the platform does not remove the fake account?',
        answer:
          'Contact the platform’s Grievance Officer, whose details must be published under India’s IT Rules. If you are still not satisfied, you can appeal to the Grievance Appellate Committee at [gac.gov.in](https://gac.gov.in).',
      },
    ],
  },
];
