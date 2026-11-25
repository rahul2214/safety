import type { BlogPost, Source } from '../types';

/**
 * Phase 1, batch 2: pillar guides (women's safety, student safety, personal safety, online
 * harassment), the cybercrime portal guide, blood donor eligibility, emergency contact list and
 * preparedness kit. Checked 2026-11-25:
 * - cybercrime.gov.in: separate sections for women/child related crime (anonymous option for
 *   sexual content) and other cybercrime; OTP login; complaints tracked by acknowledgement number;
 *   "Report and Check Suspect" (I4C suspect registry) launched 10 Sept 2024.
 * - Blood eligibility basics as in first-time-blood-donation-guide (NBTC 2017). Specific deferral
 *   periods were not confirmed, so none are quoted.
 */

const ERSS: Source = { title: 'Emergency Response Support System (112)', publisher: 'Ministry of Home Affairs', url: 'https://112.gov.in/' };
const NCRP: Source = { title: 'National Cyber Crime Reporting Portal (cybercrime.gov.in)', publisher: 'Indian Cyber Crime Coordination Centre, Ministry of Home Affairs', url: 'https://cybercrime.gov.in/' };
const WHL: Source = { title: 'Women Helpline (181)', publisher: 'Ministry of Women and Child Development (myScheme)', url: 'https://www.myscheme.gov.in/schemes/whl-181' };
const NCW: Source = { title: 'Helplines and online complaints', publisher: 'National Commission for Women', url: 'https://www.ncw.gov.in/' };
const NBTC: Source = { title: 'National Blood Transfusion Council (NBTC)', publisher: 'Ministry of Health and Family Welfare', url: 'https://nbtc.naco.gov.in/' };
const NDMA: Source = { title: 'National Disaster Management Authority', publisher: 'Government of India', url: 'https://ndma.gov.in/' };
const TELE: Source = { title: 'Tele MANAS (14416)', publisher: 'Ministry of Health and Family Welfare', url: 'https://telemanas.mohfw.gov.in/' };
const ANTI: Source = { title: 'National Anti-Ragging Helpline', publisher: 'University Grants Commission', url: 'https://www.antiragging.in/' };

export const PHASE1_PILLAR_POSTS: BlogPost[] = [
  /* ---------------------------------------------------------------- women's safety pillar */
  {
    slug: 'womens-safety-india-guide',
    title: 'Women’s safety in India: a complete, practical guide',
    seoTitle: 'Women’s Safety in India: A Complete Practical Guide',
    description:
      'Helplines, everyday safety habits, travel, harassment in public and online, workplace rights and how to report: everything in one place, with links to detailed guides.',
    seoDescription:
      'Women’s safety in India in one guide: helplines 112 and 181, travel and night safety, harassment in public and online, workplace rights, and how to report.',
    category: 'womens-safety',
    tags: ['Women’s safety', 'Helplines', 'Rights', 'Pillar guide'],
    keywords: ['women’s safety in India', 'women safety tips', 'women helpline number', 'women safety app', 'safety for women'],
    authorId: 'editorial',
    status: 'published',
    publishedAt: '2026-11-25',
    updatedAt: '2026-11-25',
    featured: true,
    related: ['emergency-helpline-numbers-india', 'night-travel-safety-women', 'cyberstalking-india', 'workplace-harassment-posh'],
    sources: [ERSS, WHL, NCW, NCRP, { title: 'SHe-Box', publisher: 'Ministry of Women and Child Development', url: 'https://shebox.wcd.gov.in/' }],
    accent: 'coral',
    art: 'Her',
    body: [
      {
        type: 'p',
        text: 'Safety is a right, not a list of things women must avoid. This guide gathers what helps in practice: the numbers to save, habits that make help faster, your rights at work and online, and how to report when something goes wrong. Each section links to a detailed guide.',
      },
      { type: 'h2', text: 'Numbers every woman should save' },
      {
        type: 'table',
        head: ['Number', 'For'],
        rows: [
          ['112', 'Any emergency: police, fire, ambulance'],
          ['181', 'Women Helpline: violence or distress, linked to One Stop Centres for shelter, legal and medical help'],
          ['1091', 'Women’s helpline run by the police in many states'],
          ['1930', 'Online fraud and cybercrime'],
          ['14416', 'Tele MANAS: free mental health support'],
        ],
        caption: 'Full list: emergency helpline numbers in India.',
      },
      {
        type: 'p',
        text: 'See all of them, and what to say on the call, in [emergency helpline numbers in India](/blog/emergency-helpline-numbers-india).',
      },
      { type: 'h2', text: 'Everyday habits that make help faster' },
      {
        type: 'ul',
        items: [
          'Choose two or three trusted contacts and agree what they will do if you send an alert. See [SOS and trusted contacts](/blog/sos-and-trusted-contacts).',
          'Share your [live location](/blog/live-location-safety) for journeys, not permanently.',
          'Keep your phone charged and a little cash with you.',
          'Know your safe places on routes you use often: open shops, pharmacies, petrol pumps, stations.',
          'Trust the feeling that something is wrong. See [what to do if you feel unsafe](/blog/what-to-do-if-you-feel-unsafe).',
        ],
      },
      { type: 'h2', text: 'Travel and getting home' },
      {
        type: 'ul',
        items: [
          '[Cab safety tips](/blog/cab-safety-tips): checking the car and driver, sharing your trip, the emergency button.',
          '[Night travel safety](/blog/night-travel-safety-women) for cabs, trains, buses and walking.',
          '[Solo travel safety in India](/blog/solo-travel-safety-india) for longer trips.',
        ],
      },
      { type: 'h2', text: 'Harassment in public' },
      {
        type: 'p',
        text: 'Comments, following, groping and stalking are offences, and never your fault. Move towards people, name the behaviour if it is safe, ask a specific person for help, and call 112 if you are in danger. Read [what to do if you are harassed in public](/blog/harassed-in-public-what-to-do) and [what to do if someone is following you](/blog/what-to-do-if-someone-is-following-you).',
      },
      { type: 'h2', text: 'Online safety' },
      {
        type: 'ul',
        items: [
          '[Cyberstalking](/blog/cyberstalking-india): repeated contact, new accounts, someone who always knows where you are.',
          '[Threats to leak photos](/blog/someone-threatening-to-leak-photos) and [private photos shared without consent](/blog/private-photos-shared-without-consent).',
          '[Fake profiles and impersonation](/blog/how-to-report-fake-profile) and [deepfakes](/blog/deepfakes-what-to-do).',
          '[Social media privacy settings](/blog/social-media-privacy-settings) to check today.',
        ],
      },
      { type: 'h2', text: 'At work and in college' },
      {
        type: 'p',
        text: 'Under the POSH Act, workplaces with ten or more workers must have an Internal Committee for sexual harassment complaints, and complaints can also be filed on the government’s SHe-Box portal. Colleges must have an Internal Complaints Committee. See [how to report workplace sexual harassment](/blog/workplace-harassment-posh), the [workplace safety guide](/blog/workplace-safety-guide) and [harassment in college](/blog/harassment-in-college).',
      },
      { type: 'h2', text: 'Reporting to the police' },
      {
        type: 'ul',
        items: [
          'You can file a complaint at any police station. If the incident happened elsewhere, ask for a Zero FIR, which is transferred to the right station.',
          'Online crimes can be reported at cybercrime.gov.in or on 1930. See [how to report cyber harassment](/blog/how-to-report-cyber-harassment).',
          'The National Commission for Women and State Commissions for Women also accept complaints.',
        ],
      },
      { type: 'h2', text: 'If the danger is at home' },
      {
        type: 'p',
        text: 'Violence or control by a partner or family member is not a private matter. The Women Helpline 181 can connect you to a One Stop Centre for shelter, medical, legal and counselling support. A [personal safety plan](/blog/personal-safety-plan) helps you prepare quietly.',
      },
      {
        type: 'callout',
        tone: 'info',
        title: 'How Sabhijude helps',
        text: 'Trusted contacts, an SOS button that texts them your live location, live location sharing for journeys, a fake call for discreet exits, and community reports of unsafe places, anonymously if you prefer.',
      },
      { type: 'h2', text: 'City guides' },
      {
        type: 'p',
        text: 'Local police apps, squads and helplines: [Bengaluru](/blog/womens-safety-bengaluru), [Hyderabad](/blog/womens-safety-hyderabad), [Chennai](/blog/womens-safety-chennai), [Mumbai](/blog/womens-safety-mumbai), [Delhi](/blog/womens-safety-delhi) and [Pune](/blog/womens-safety-pune).',
      },
    ],
    faqs: [
      {
        question: 'What is the women helpline number in India?',
        answer: '181 is the national Women Helpline. 1091 is a women’s helpline run by the police in many states. In any emergency, call 112.',
      },
      {
        question: 'Can a woman file a police complaint at any police station?',
        answer:
          'Yes. You can file at any police station; if the incident happened in another area, ask for a Zero FIR, which is registered and transferred to the station with jurisdiction. Online crimes can also be reported at cybercrime.gov.in.',
      },
    ],
  },

  /* ---------------------------------------------------------------- student safety pillar */
  {
    slug: 'student-safety-india-guide',
    title: 'Student safety in India: a complete guide',
    seoTitle: 'Student Safety in India: A Complete Guide',
    description:
      'Campus and hostel life, travel, ragging and harassment, online safety, money scams, emergencies and wellbeing, for students and the parents who worry about them.',
    seoDescription:
      'A complete student safety guide for India: hostel and campus safety, travel, ragging and harassment, online safety, scams, emergencies and where to get help.',
    category: 'student-safety',
    tags: ['Students', 'Campus', 'Hostels', 'Pillar guide'],
    keywords: ['student safety India', 'student safety tips', 'campus safety', 'students living away from home', 'student safety app'],
    authorId: 'editorial',
    status: 'published',
    publishedAt: '2026-11-25',
    updatedAt: '2026-11-25',
    related: ['college-freshers-safety-checklist', 'ragging-guide', 'harassment-in-college', 'cyberbullying-india'],
    sources: [ANTI, ERSS, TELE, NCRP],
    accent: 'blue',
    art: 'Campus',
    body: [
      {
        type: 'p',
        text: 'For many students, college is the first time living away from home: a new city, new people, late nights and money to manage. Most of it is exciting. This guide covers the parts worth preparing for, with links to detailed guides.',
      },
      { type: 'h2', text: 'Your first weeks' },
      {
        type: 'p',
        text: 'Save your trusted contacts and key numbers, find out who is on the college’s complaints and anti-ragging committees, and learn the safe routes around campus. Our [college freshers safety checklist](/blog/college-freshers-safety-checklist) covers it all in one page.',
      },
      { type: 'h2', text: 'Ragging and harassment' },
      {
        type: 'ul',
        items: [
          'Ragging is banned. Call the National Anti-Ragging Helpline on **1800-180-5522**. See our [guide to ragging](/blog/ragging-guide).',
          'Sexual harassment by anyone on campus goes to the Internal Complaints Committee. See [harassment in college](/blog/harassment-in-college).',
          'Bullying in class groups or on social media still counts. See [cyberbullying: what to do](/blog/cyberbullying-india).',
        ],
      },
      { type: 'h2', text: 'Hostels, PGs and flats' },
      {
        type: 'ul',
        items: [
          'Lock your room and cupboard; do not lend keys or ID cards.',
          'Keep your room number and address off public social media.',
          'For a PG or flat, check locks, lighting, and that the owner has verified staff.',
          'Know who to call if you are locked out or late.',
        ],
      },
      { type: 'h2', text: 'Getting around' },
      {
        type: 'ul',
        items: [
          'Share your trip on late journeys. See [cab safety tips](/blog/cab-safety-tips) and [night travel safety](/blog/night-travel-safety-women).',
          'Plan how you get home before going out. See [party safety tips](/blog/party-safety-tips).',
          'Use [live location sharing](/blog/live-location-safety) with a friend or parent for trips, not as permanent tracking.',
        ],
      },
      { type: 'h2', text: 'Online safety and scams' },
      {
        type: 'ul',
        items: [
          'Tighten your [social media privacy settings](/blog/social-media-privacy-settings) before adding hundreds of classmates.',
          'Turn on [two-step verification](/blog/strong-passwords-two-step-verification) on email and social media.',
          'Students are targeted by fake part-time jobs, fake scholarships and “digital arrest” calls. See [common online scams in India](/blog/common-online-scams-india).',
        ],
      },
      { type: 'h2', text: 'Emergencies' },
      {
        type: 'p',
        text: 'Save 112, campus security and your warden. Set up [SOS and trusted contacts](/blog/sos-and-trusted-contacts) and read [what to do in an emergency](/blog/what-to-do-during-an-emergency).',
      },
      { type: 'h2', text: 'Your wellbeing' },
      {
        type: 'p',
        text: 'Homesickness, exam stress and loneliness are common, especially in the first year. Talk to friends, family or the college counsellor. The free national mental health helpline, Tele MANAS, is on **14416**, at any hour.',
      },
      { type: 'h2', text: 'For parents' },
      {
        type: 'ul',
        items: [
          'Save the anti-ragging helpline and the college’s security number yourself.',
          'Agree on check-ins that respect their independence rather than constant tracking.',
          'Ask open questions about friends, seniors and how they are feeling, and listen without judging.',
        ],
      },
      {
        type: 'callout',
        tone: 'info',
        title: 'If your college uses Sabhijude',
        text: 'Students can report incidents to their campus team, see campus safety posts and receive alerts from the college, and choose what they share with it.',
      },
    ],
    faqs: [
      {
        question: 'How can students stay safe on campus?',
        answer:
          'Save trusted contacts and campus security numbers, know who is on the complaints and anti-ragging committees, use well-lit routes, share trips at night, tighten social media privacy, and know where to get help, including the anti-ragging helpline 1800-180-5522.',
      },
      {
        question: 'What should I do if I am harassed in college?',
        answer:
          'For sexual harassment, complain to the college’s Internal Complaints Committee; for ragging, call 1800-180-5522 or tell the Anti-Ragging Committee. Keep a record of what happened. If you are in danger, call 112.',
      },
    ],
  },

  /* ---------------------------------------------------------------- personal safety tips */
  {
    slug: 'personal-safety-tips',
    title: 'Personal safety tips everyone should know',
    seoTitle: 'Personal Safety Tips Everyone Should Know',
    description:
      'Simple, practical habits for staying safe in public, at night, online and at home, and for getting help fast when you need it.',
    seoDescription:
      'Practical personal safety tips for India: staying alert without fear, safe habits in public and at night, online safety, and how to get help fast when needed.',
    category: 'personal-safety',
    tags: ['Personal safety', 'Safety tips', 'Pillar guide'],
    keywords: ['personal safety tips', 'what is personal safety', 'safety awareness', 'how to stay safe in public', 'safety tips'],
    authorId: 'editorial',
    status: 'published',
    publishedAt: '2026-11-25',
    updatedAt: '2026-11-25',
    related: ['personal-safety-plan', 'what-to-do-if-you-feel-unsafe', 'emergency-helpline-numbers-india', 'sos-and-trusted-contacts'],
    sources: [ERSS, WHL, NCRP],
    accent: 'ink',
    art: 'Aware',
    body: [
      {
        type: 'p',
        text: '**Personal safety** means having the awareness, plans and tools to avoid harm where you can, and to get help quickly when you cannot. It is not about living in fear. Most of it comes down to a few habits that become automatic.',
      },
      { type: 'h2', text: '1. Stay aware, not anxious' },
      {
        type: 'ul',
        items: [
          'Keep your eyes up and at least one ear free when walking.',
          'Notice exits when you enter a place.',
          'Trust the feeling that something is wrong; you do not need a reason to leave. See [what to do if you feel unsafe](/blog/what-to-do-if-you-feel-unsafe).',
        ],
      },
      { type: 'h2', text: '2. Make help easy to reach' },
      {
        type: 'ul',
        items: [
          'Save 112 and two or three trusted contacts as favourites. See [emergency helpline numbers](/blog/emergency-helpline-numbers-india).',
          'Set up your phone’s emergency SOS and medical ID.',
          'Agree with your contacts what they should do if you send an alert. See [SOS and trusted contacts](/blog/sos-and-trusted-contacts).',
          'Keep your phone charged, and carry a little cash.',
        ],
      },
      { type: 'h2', text: '3. In public and at night' },
      {
        type: 'ul',
        items: [
          'Stick to lit, busier routes, even if they take longer.',
          'Know your safe places: open shops, pharmacies, petrol pumps, stations.',
          'If someone follows you, go towards people, not home. See [what to do if someone is following you](/blog/what-to-do-if-someone-is-following-you).',
          'Check the car and driver before getting in a cab. See [cab safety tips](/blog/cab-safety-tips).',
        ],
      },
      { type: 'h2', text: '4. Let someone know where you are' },
      {
        type: 'p',
        text: 'For late journeys, trips and first meetings, share your [live location](/blog/live-location-safety) with one trusted person for the length of the journey, and stop sharing when you arrive.',
      },
      { type: 'h2', text: '5. Protect yourself online' },
      {
        type: 'ul',
        items: [
          'Never share OTPs or PINs, and turn on two-step verification. See [strong passwords and two-step verification](/blog/strong-passwords-two-step-verification).',
          'Keep your address, routine and live location off public profiles. See [social media privacy settings](/blog/social-media-privacy-settings).',
          'Learn the common scams. See [common online scams in India](/blog/common-online-scams-india).',
        ],
      },
      { type: 'h2', text: '6. Plan once' },
      {
        type: 'p',
        text: 'Twenty minutes spent on a [personal safety plan](/blog/personal-safety-plan), deciding who you will call, where you will go and what you carry, makes every one of these habits easier.',
      },
      { type: 'h2', text: '7. Look out for others' },
      {
        type: 'p',
        text: 'If someone seems unsafe, a simple “Are you okay?” and staying nearby can change everything. See [how to support someone who is being harassed](/blog/how-to-support-someone-being-harassed).',
      },
    ],
    faqs: [
      {
        question: 'What is personal safety?',
        answer:
          'Personal safety is having the awareness, plans and tools to avoid harm where you can and to get help quickly when you cannot, such as trusted contacts, saved emergency numbers, and safe habits in public and online.',
      },
      {
        question: 'What are the most important personal safety tips?',
        answer:
          'Stay aware without fear, save 112 and trusted contacts, keep your phone charged, use lit and busy routes, share your live location on journeys, never share OTPs, and trust the feeling that something is wrong.',
      },
    ],
  },

  /* ---------------------------------------------------------------- online harassment pillar */
  {
    slug: 'online-harassment-guide',
    title: 'Online harassment: how to respond safely',
    seoTitle: 'Online Harassment: How to Respond Safely and Report It',
    description:
      'Abusive comments, repeated messages, threats, fake accounts or leaked photos: how to respond without escalating, protect yourself and report it in India.',
    seoDescription:
      'How to deal with online harassment: respond without escalating, save evidence, block and report, protect your accounts, and report it in India via 1930.',
    category: 'online-harassment',
    tags: ['Online harassment', 'Abusive comments', 'Pillar guide'],
    keywords: ['online harassment', 'how to deal with online harassment', 'cyber harassment India', 'abusive comments', 'online abuse'],
    authorId: 'editorial',
    status: 'published',
    publishedAt: '2026-11-25',
    updatedAt: '2026-11-25',
    related: ['how-to-report-cyber-harassment', 'cyberstalking-india', 'how-to-preserve-digital-evidence', 'report-vs-block'],
    sources: [NCRP, { title: 'Grievance Appellate Committee', publisher: 'Ministry of Electronics and Information Technology', url: 'https://gac.gov.in/' }, TELE],
    accent: 'ink',
    art: 'Respond',
    body: [
      {
        type: 'p',
        text: 'Online harassment ranges from a single cruel comment to coordinated abuse, stalking and threats. The response depends on what is happening, but the same steps help in almost every case: **do not engage, save, block and report, protect your accounts, and get support**.',
      },
      { type: 'h2', text: 'Identify what is happening' },
      {
        type: 'table',
        head: ['If it is…', 'Read'],
        rows: [
          ['Repeated contact, new accounts, someone watching you', '[Cyberstalking](/blog/cyberstalking-india)'],
          ['Threats of violence', '[Online threats](/blog/what-to-do-if-someone-threatens-you-online)'],
          ['Threats to share intimate photos, demands for money', '[Photo blackmail](/blog/someone-threatening-to-leak-photos)'],
          ['Intimate photos already shared', '[Getting them removed](/blog/private-photos-shared-without-consent)'],
          ['An account pretending to be you', '[Fake profiles](/blog/how-to-report-fake-profile)'],
          ['Your address or number posted', '[Doxxing](/blog/doxxing-what-to-do)'],
          ['Bullying by classmates', '[Cyberbullying](/blog/cyberbullying-india)'],
        ],
      },
      { type: 'h2', text: '1. Do not engage' },
      {
        type: 'p',
        text: 'Harassers usually want a reaction. Replying, arguing or explaining tends to escalate things and gives them material. If you must respond, one calm line is enough: “Do not contact me again.”',
      },
      { type: 'h2', text: '2. Save the evidence' },
      {
        type: 'p',
        text: 'Screenshot messages and comments with the account name and date, copy profile links, and keep a simple log. Do this before blocking. See [how to preserve digital evidence](/blog/how-to-preserve-digital-evidence).',
      },
      { type: 'h2', text: '3. Control what you see' },
      {
        type: 'ul',
        items: [
          'Hide or filter comments with keyword filters; restrict or mute accounts.',
          'Limit who can message, tag or mention you.',
          'Ask a friend to monitor your inbox for evidence so you do not have to read everything.',
        ],
      },
      { type: 'h2', text: '4. Block and report' },
      {
        type: 'p',
        text: 'Report the specific posts and the account, then block. If the platform does not act, escalate to its Grievance Officer and then the [Grievance Appellate Committee](https://gac.gov.in). See [report vs block](/blog/report-vs-block).',
      },
      { type: 'h2', text: '5. Protect your accounts and privacy' },
      {
        type: 'p',
        text: 'Change passwords, turn on two-step verification, and review your [social media privacy settings](/blog/social-media-privacy-settings) so less of your life is visible to the person harassing you.',
      },
      { type: 'h2', text: '6. Report to the police when it crosses the line' },
      {
        type: 'p',
        text: 'Threats, stalking, sexual content, impersonation, blackmail and doxxing can be crimes. Report at [cybercrime.gov.in](https://cybercrime.gov.in), on **1930**, or at a police station. See [how to report cyber harassment in India](/blog/how-to-report-cyber-harassment).',
      },
      { type: 'h2', text: '7. Get support' },
      {
        type: 'p',
        text: 'Online abuse can be exhausting and isolating. Tell someone you trust, step away from the app when you need to, and talk to a counsellor if it is affecting your sleep or mood. Tele MANAS, the free national mental health helpline, is on **14416**.',
      },
    ],
    faqs: [
      {
        question: 'How should I respond to online harassment?',
        answer:
          'Do not engage, save the evidence, filter or restrict what you see, report the posts and account and then block, secure your accounts, and report to the police if it involves threats, stalking, sexual content, impersonation or blackmail.',
      },
      {
        question: 'Is online harassment a crime in India?',
        answer:
          'Many forms are, including stalking, threats, sharing intimate images, impersonation and extortion. You can report them at cybercrime.gov.in, on 1930 or at any police station.',
      },
    ],
  },

  /* ---------------------------------------------------------------- cybercrime portal guide */
  {
    slug: 'cybercrime-portal-guide',
    title: 'cybercrime.gov.in: how the National Cyber Crime Reporting Portal works',
    seoTitle: 'cybercrime.gov.in: How to Use the National Cyber Portal',
    description:
      'What you can report on the government’s cybercrime portal, the two complaint sections, anonymous reporting, tracking your complaint, and checking a suspect number.',
    seoDescription:
      'A plain guide to cybercrime.gov.in: what to report, which section to use, anonymous reports, tracking your complaint, and the Report and Check Suspect tool.',
    category: 'online-harassment',
    tags: ['Cybercrime portal', 'Reporting', '1930', 'Suspect registry'],
    keywords: ['national cyber crime reporting portal', 'cybercrime.gov.in', 'cybercrime complaint', 'report cyber crime online', 'check suspect number'],
    authorId: 'editorial',
    status: 'published',
    publishedAt: '2026-11-25',
    updatedAt: '2026-11-25',
    related: ['how-to-report-cyber-harassment', 'common-online-scams-india', 'how-to-preserve-digital-evidence', 'online-harassment-guide'],
    sources: [
      NCRP,
      { title: 'Suspect registry and “Report and Check Suspect” (explainer)', publisher: 'Drishti IAS', url: 'https://www.drishtiias.com/daily-updates/daily-news-analysis/india-s-suspect-registry-and-cybersecurity-initiatives' },
    ],
    accent: 'blue',
    art: 'Portal',
    body: [
      {
        type: 'p',
        text: 'The **National Cyber Crime Reporting Portal**, at [cybercrime.gov.in](https://cybercrime.gov.in), is run by the Indian Cyber Crime Coordination Centre under the Ministry of Home Affairs. It lets anyone in India report cybercrime online. Complaints are passed to the police of the relevant state or union territory.',
      },
      { type: 'h2', text: 'What you can report' },
      {
        type: 'ul',
        items: [
          'Online financial fraud: UPI, card, banking, investment and job scams.',
          'Harassment, stalking, threats and blackmail.',
          'Sharing of intimate or sexual images without consent, and child sexual abuse material.',
          'Fake profiles, impersonation and hacked accounts.',
          'Other cybercrime, such as data theft or ransomware.',
        ],
      },
      {
        type: 'callout',
        tone: 'warn',
        title: 'Lost money? Call 1930 first',
        text: 'For financial fraud, calling the 1930 helpline straight away is the fastest way to try to get the money frozen. Then complete the complaint on the portal.',
      },
      { type: 'h2', text: 'The two complaint sections' },
      {
        type: 'table',
        head: ['Section', 'Use it for', 'Notes'],
        rows: [
          ['Women and child related crime', 'Sexual content, intimate images, child sexual abuse material, and related crimes against women and children', 'Includes an option to report sexual content anonymously, as well as reporting with your details so you can be contacted and track it.'],
          ['Other cybercrime', 'Financial fraud, hacking, harassment, impersonation and everything else', 'Needs registration with your mobile number and an OTP.'],
        ],
        caption: 'Labels on the portal change from time to time; the portal’s own instructions take priority.',
      },
      { type: 'h2', text: 'Filing a complaint, step by step' },
      {
        type: 'ol',
        items: [
          'Prepare your evidence first: screenshots with dates, profile links, transaction IDs and a short timeline. See [how to preserve digital evidence](/blog/how-to-preserve-digital-evidence).',
          'Open cybercrime.gov.in, choose “File a complaint” and accept the terms.',
          'Pick the right section, then register or log in with your mobile number and OTP.',
          'Fill in the incident details: what happened, when, where, and any details of the suspect.',
          'Upload your evidence files.',
          'Submit and save the acknowledgement number. Use it to track your complaint on the portal.',
        ],
      },
      { type: 'h2', text: 'Check a number, UPI ID or account before you pay' },
      {
        type: 'p',
        text: 'The portal’s **Report and Check Suspect** feature lets you search the government’s suspect registry for a mobile number, UPI ID, bank account or other identifier that has been reported in cyber fraud complaints, and report a suspicious one yourself.',
      },
      {
        type: 'callout',
        tone: 'info',
        title: 'Real example: the suspect registry',
        text: 'The Indian Cyber Crime Coordination Centre launched its suspect registry with banks and financial institutions on 10 September 2024, and opened “Report and Check Suspect” on the portal so citizens could check identifiers before paying. A match is a warning, not proof of guilt, and no match does not mean someone is safe.',
      },
      { type: 'h2', text: 'What happens next' },
      {
        type: 'p',
        text: 'The state police review the complaint and may contact you for more information or ask you to visit. Keep your phone reachable and your evidence safe. Investigations can take time, especially when accounts are abroad. You can add new evidence to your complaint using the acknowledgement number.',
      },
      { type: 'h2', text: 'Related guides' },
      {
        type: 'p',
        text: 'For harassment, see [how to report cyber harassment in India](/blog/how-to-report-cyber-harassment). For fraud, see [common online scams in India](/blog/common-online-scams-india). For the overall approach, see [online harassment: how to respond safely](/blog/online-harassment-guide). State guides: [Karnataka](/blog/cybercrime-reporting-karnataka) and [Telangana](/blog/cybercrime-reporting-telangana).',
      },
    ],
    faqs: [
      {
        question: 'How do I file a complaint on cybercrime.gov.in?',
        answer:
          'Choose “File a complaint”, pick the women and child section or the other cybercrime section, log in with your mobile number and OTP, fill in what happened, upload your evidence, and save the acknowledgement number to track it.',
      },
      {
        question: 'Can I report anonymously on cybercrime.gov.in?',
        answer:
          'The women and child related crime section has an option to report sexual content anonymously. Other complaints need your mobile number so the police can follow up.',
      },
      {
        question: 'How can I check if a number or UPI ID is linked to fraud?',
        answer:
          'Use “Report and Check Suspect” on cybercrime.gov.in, which searches the government’s registry of identifiers reported in cyber fraud complaints. Treat a match as a warning and no match as no guarantee.',
      },
    ],
  },

  /* ---------------------------------------------------------------- who can donate blood */
  {
    slug: 'who-can-donate-blood-india',
    title: 'Who can donate blood in India? Eligibility explained',
    seoTitle: 'Who Can Donate Blood in India? Eligibility Explained',
    description:
      'Age, weight, haemoglobin, gaps between donations, and the common reasons you might be asked to wait, based on India’s national guidelines.',
    seoDescription:
      'Blood donation eligibility in India: age, weight, haemoglobin and gaps between donations under national guidelines, plus the common reasons to wait.',
    category: 'blood-donation',
    tags: ['Eligibility', 'Donors', 'NBTC'],
    keywords: ['who can donate blood', 'blood donation eligibility India', 'how often can you donate blood', 'who should not donate blood'],
    authorId: 'editorial',
    status: 'published',
    publishedAt: '2026-11-25',
    updatedAt: '2026-11-25',
    related: ['first-time-blood-donation-guide', 'blood-donation-myths-and-facts', 'how-to-respond-to-urgent-blood-request', 'blood-group-compatibility-explained'],
    sources: [NBTC, { title: 'e-RaktKosh', publisher: 'Ministry of Health and Family Welfare', url: 'https://eraktkosh.mohfw.gov.in/' }],
    accent: 'red',
    art: '18–65',
    body: [
      {
        type: 'p',
        text: 'Most healthy adults can donate blood. Blood banks in India follow the National Blood Transfusion Council’s donor selection guidelines, and the blood bank’s doctor makes the final decision on the day. Here is what they check.',
      },
      { type: 'h2', text: 'The basic checks' },
      {
        type: 'table',
        head: ['Check', 'General guideline'],
        rows: [
          ['Age', '18 to 65 years. First-time donors are usually accepted up to 60.'],
          ['Weight', 'At least 45 kg. A higher weight is needed for a larger (450 ml) donation.'],
          ['Haemoglobin', 'At least 12.5 g/dL, checked with a finger-prick test on the day.'],
          ['Gap since last whole blood donation', 'At least about 3 months for men and 4 months for women.'],
          ['Health on the day', 'Feeling well, with normal pulse, blood pressure and temperature.'],
        ],
        caption: 'Summary only. The blood bank applies the full guidelines.',
      },
      { type: 'h2', text: 'Common reasons you may be asked to wait' },
      {
        type: 'ul',
        items: [
          'A recent tattoo, piercing or acupuncture.',
          'A recent illness, infection or fever.',
          'Certain medicines, or recent vaccinations.',
          'Recent surgery or dental treatment.',
          'Pregnancy, recent delivery or miscarriage, or breastfeeding.',
          'Drinking alcohol in the previous day.',
          'Recent travel to areas with certain infections.',
        ],
      },
      {
        type: 'p',
        text: 'The waiting period depends on the reason. Being deferred is not a judgement on you; it protects both you and the patient. If you are unsure, call the blood bank before you go; you can find blood banks and their numbers on e-RaktKosh.',
      },
      { type: 'h2', text: 'Who should not donate' },
      {
        type: 'p',
        text: 'Some conditions, including certain heart, blood and long-term illnesses and some infections, mean a person should not donate, for their own safety or the patient’s. Answer the health questionnaire honestly; it is confidential.',
      },
      { type: 'h2', text: 'How often can you donate?' },
      {
        type: 'p',
        text: 'Under India’s guidelines, the usual minimum gap between whole blood donations is about three months for men and four months for women. Platelet and plasma donations follow different rules; the blood bank will advise.',
      },
      { type: 'h2', text: 'Ready to donate?' },
      {
        type: 'p',
        text: 'Read the [first-time donor guide](/blog/first-time-blood-donation-guide) for what happens on the day, and [blood donation myths and facts](/blog/blood-donation-myths-and-facts) if you have worries. If you are answering a request, see [how to respond to an urgent blood request](/blog/how-to-respond-to-urgent-blood-request).',
      },
    ],
    faqs: [
      {
        question: 'Who can donate blood in India?',
        answer:
          'Generally, healthy adults aged 18 to 65 (first-time donors usually up to 60), weighing at least 45 kg, with haemoglobin of at least 12.5 g/dL, who feel well on the day. The blood bank’s doctor makes the final decision.',
      },
      {
        question: 'How often can I donate blood?',
        answer: 'The usual minimum gap between whole blood donations is about three months for men and four months for women.',
      },
    ],
  },

  /* ---------------------------------------------------------------- emergency contact list */
  {
    slug: 'emergency-contact-checklist',
    title: 'Emergency contact list: what to save and who to choose',
    seoTitle: 'Emergency Contact List: What to Save and Who to Choose',
    description:
      'The numbers to save, how to choose trusted contacts, what they should know about you, and how to make your list reachable even when your phone is locked or lost.',
    seoDescription:
      'Build an emergency contact list that works: which numbers to save, who to choose as trusted contacts, what they should know, and how to reach it if locked out.',
    category: 'emergency-help',
    tags: ['Emergency contacts', 'Checklist', 'Trusted contacts'],
    keywords: ['emergency contact list', 'how to create an emergency contact list', 'emergency contact checklist', 'what information should emergency contacts have'],
    authorId: 'editorial',
    status: 'published',
    publishedAt: '2026-11-25',
    updatedAt: '2026-11-25',
    related: ['sos-and-trusted-contacts', 'emergency-helpline-numbers-india', 'family-emergency-plan', 'emergency-preparedness-checklist'],
    sources: [ERSS, WHL],
    accent: 'coral',
    art: 'List',
    body: [
      {
        type: 'p',
        text: 'An emergency contact list is only useful if it is short, current, and reachable when you need it, including by someone else holding your phone. Here is how to build one in ten minutes.',
      },
      { type: 'h2', text: '1. Official numbers' },
      {
        type: 'ul',
        items: [
          '**112** for any emergency.',
          '**108** ambulance (most states), **181** Women Helpline, **1930** cybercrime, **1098** Childline.',
          'Your local police station and nearest hospital.',
        ],
      },
      {
        type: 'p',
        text: 'See what each one is for in [emergency helpline numbers in India](/blog/emergency-helpline-numbers-india).',
      },
      { type: 'h2', text: '2. Two to five trusted people' },
      {
        type: 'ul',
        items: [
          'People who answer their phone, including at night.',
          'At least one who lives or works near you.',
          'A mix: family, a local friend, a flatmate or colleague.',
          'Ask them first, and agree what they should do if you call or send an alert. See [SOS and trusted contacts](/blog/sos-and-trusted-contacts).',
        ],
      },
      { type: 'h2', text: '3. Practical contacts' },
      {
        type: 'ul',
        items: [
          'Your doctor, and anyone who holds a spare key.',
          'Your building security, warden or landlord.',
          'Your bank’s card-blocking number and your mobile operator’s helpline.',
          'Your workplace or college security desk.',
        ],
      },
      { type: 'h2', text: 'What your trusted contacts should know' },
      {
        type: 'ul',
        items: [
          'Your home and work or college addresses, and usual routes.',
          'Your blood group, allergies, conditions and medicines.',
          'The names and numbers of your other trusted contacts, so they can coordinate.',
          'Your code word that means “I am not safe, call me”.',
        ],
      },
      { type: 'h2', text: 'Make it reachable' },
      {
        type: 'ol',
        items: [
          'Fill in the emergency contacts and medical ID on your phone, so they show on the lock screen.',
          'Mark one contact “ICE” (in case of emergency) in your contacts.',
          'Keep a paper copy in your wallet or bag.',
          'Add the same people as trusted contacts in a safety app, so one tap can reach them with your location.',
        ],
      },
      { type: 'h2', text: 'Keep it current' },
      {
        type: 'p',
        text: 'Review the list every six months, and whenever you move, change jobs or start college. For the whole household, see the [family emergency plan](/blog/family-emergency-plan) and the [emergency preparedness checklist](/blog/emergency-preparedness-checklist).',
      },
    ],
    faqs: [
      {
        question: 'Who should be my emergency contact?',
        answer:
          'Two to five people who answer their phone, at least one living or working near you, who have agreed to be your contact and know what to do if you call or send an alert.',
      },
      {
        question: 'What information should an emergency contact have?',
        answer:
          'Your addresses and usual routes, blood group, allergies, conditions and medicines, the other contacts’ numbers so they can coordinate, and any code word you have agreed.',
      },
    ],
  },

  /* ---------------------------------------------------------------- preparedness checklist */
  {
    slug: 'emergency-preparedness-checklist',
    title: 'Emergency preparedness checklist and kit for Indian homes',
    seoTitle: 'Emergency Preparedness Checklist and Kit for Indian Homes',
    description:
      'A practical checklist for fires, floods, earthquakes, medical emergencies and power cuts: what to keep in your kit, what to plan, and what to practise.',
    seoDescription:
      'An emergency preparedness checklist for Indian homes: what to keep in your emergency kit, documents to save, plans for fire, flood, earthquake and illness.',
    category: 'emergency-help',
    tags: ['Emergency kit', 'Preparedness', 'Checklist', 'Disasters'],
    keywords: ['emergency preparedness checklist', 'emergency kit checklist', 'emergency plan', 'disaster preparedness India'],
    authorId: 'editorial',
    status: 'published',
    publishedAt: '2026-11-25',
    updatedAt: '2026-11-25',
    related: ['family-emergency-plan', 'what-to-do-during-an-emergency', 'emergency-contact-checklist', 'emergency-helpline-numbers-india'],
    sources: [NDMA, ERSS, { title: 'DigiLocker', publisher: 'Ministry of Electronics and Information Technology', url: 'https://www.digilocker.gov.in/' }],
    accent: 'blue',
    art: 'Ready',
    body: [
      {
        type: 'p',
        text: 'Emergencies give little warning. A kit by the door and a plan everyone knows turn panic into a few clear actions. Follow your state disaster management authority and the [National Disaster Management Authority](https://ndma.gov.in) for warnings and guidance specific to your area.',
      },
      { type: 'h2', text: 'Emergency kit checklist' },
      {
        type: 'ul',
        items: [
          'Drinking water and dry, ready-to-eat food for a few days.',
          'Torch, spare batteries, power bank and charging cables.',
          'First-aid kit, and at least a week of regular medicines with prescriptions.',
          'Copies of IDs and important documents in a waterproof pouch; official digital copies in [DigiLocker](https://www.digilocker.gov.in).',
          'Some cash in small notes.',
          'A printed list of emergency contacts.',
          'A whistle, a basic multi-tool, a raincoat or blanket, and sanitary supplies.',
          'Anything specific: baby supplies, spectacles, hearing aid batteries, pet food.',
        ],
      },
      { type: 'h2', text: 'Plan checklist' },
      {
        type: 'ul',
        items: [
          'Two meeting places: one just outside home, one in your area.',
          'Who calls 112, who checks on children or older relatives, who brings the kit.',
          'How to switch off gas, electricity and water.',
          'An emergency contact list on every phone and on paper. See [emergency contact list](/blog/emergency-contact-checklist).',
          'A plan for anyone who needs help moving, such as older relatives or people with disabilities.',
        ],
      },
      { type: 'h2', text: 'By type of emergency' },
      {
        type: 'table',
        head: ['Emergency', 'Prepare'],
        rows: [
          ['Fire', 'A working extinguisher, a smoke alarm, gas cylinder checks, two ways out.'],
          ['Flood or heavy rain', 'Documents and electronics kept high, a plan to move to higher ground, follow official warnings.'],
          ['Earthquake', 'Heavy furniture secured, and everyone knows to drop, cover and hold on.'],
          ['Medical emergency', 'Nearest hospital known, medical IDs filled in, someone trained in first aid.'],
          ['Power and network cuts', 'Charged power bank, torch, a little cash, and a paper contact list.'],
        ],
      },
      { type: 'h2', text: 'Practise' },
      {
        type: 'p',
        text: 'Walk through one scenario with your household twice a year, and replace expired food, water and medicines. For the first minutes of any incident, read [what to do in an emergency](/blog/what-to-do-during-an-emergency), and for the whole household, the [family emergency plan](/blog/family-emergency-plan).',
      },
    ],
    faqs: [
      {
        question: 'What should be in an emergency kit?',
        answer:
          'Water and dry food for a few days, a torch and power bank, a first-aid kit and a week of medicines, copies of documents in a waterproof pouch, cash, a printed contact list, and anything specific to your family such as baby supplies or spectacles.',
      },
      {
        question: 'What should an emergency plan contain?',
        answer:
          'Meeting places, who does what, how to switch off gas and electricity, an emergency contact list on every phone and on paper, and a plan for anyone who needs help moving.',
      },
    ],
  },
];
