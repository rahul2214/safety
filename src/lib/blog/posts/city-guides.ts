import type { BlogPost, Source } from '../types';

/**
 * Local pages (Phase 3). Only details found in official or reputable sources on 2026-11-25 are
 * stated; numbers that conflicted between sources (for example SHE Teams WhatsApp numbers, which
 * differ by commissionerate) are not printed, and readers are sent to the official site instead.
 * Local schemes change often: review these pages every 3-6 months and bump updatedAt.
 *
 * Verified points used:
 * - Bengaluru: Suraksha app (Bengaluru City Police, 2017; SOS via button or power button five
 *   times; two emergency contacts); Pink Hoysala patrol vehicles; eight CEN (cyber, economic
 *   offences, narcotics) police stations in Bengaluru, one per division; complaints also at local
 *   stations; 1930.
 * - Telangana: SHE Teams (women safety wing); TGCSB: 1930, cybercrime.gov.in, WhatsApp 8712672222
 *   (as published by TGCSB); seven cyber crime police stations functioning since 2024.
 * - Tamil Nadu: Kavalan SOS app (2018), to be integrated into the Kaaval Uthavi app (2022).
 * - Mumbai: Mumbai Police women helpline 103 and Nirbhaya Squads (2021); GRP railway helpline
 *   1512; Rail Madad 139; police deployment in ladies' coaches at night announced in 2023.
 * - Delhi: Delhi Police women helpline 1091; Himmat Plus (QR code in autos/taxis, 2019); Delhi
 *   Metro first coach reserved for women; DMRC helpline 155370; ₹250 fine for men in women's coach.
 * - Pune: 112 as the single emergency number; Damini Squads (Damini Marshals) under the Bharosa
 *   Cell; Buddy Cop WhatsApp groups for working women.
 */

const ERSS: Source = { title: 'Emergency Response Support System (112)', publisher: 'Ministry of Home Affairs', url: 'https://112.gov.in/' };
const NCRP: Source = { title: 'National Cyber Crime Reporting Portal (cybercrime.gov.in)', publisher: 'Ministry of Home Affairs', url: 'https://cybercrime.gov.in/' };
const WHL: Source = { title: 'Women Helpline (181)', publisher: 'Ministry of Women and Child Development (myScheme)', url: 'https://www.myscheme.gov.in/schemes/whl-181' };

const LOCAL_NOTE = {
  type: 'callout' as const,
  tone: 'info' as const,
  title: 'Local details change',
  text: 'City police apps, WhatsApp numbers and special squads are updated often. We list what official and reputable sources confirmed when this page was last updated; check the police website linked below before relying on a number. In any emergency, 112 always works.',
};

export const CITY_POSTS: BlogPost[] = [
  /* ---------------------------------------------------------------- Bengaluru */
  {
    slug: 'womens-safety-bengaluru',
    title: 'Women’s and student safety in Bengaluru: local help',
    seoTitle: 'Women’s Safety in Bengaluru: Helplines and Local Help',
    description:
      'Bengaluru’s police safety app and women’s patrols, where to report cybercrime, transport tips, and a section for students new to the city.',
    seoDescription:
      'Women’s and student safety in Bengaluru: city police safety app and Pink Hoysala patrols, reporting cybercrime at CEN stations, transport and key helplines.',
    category: 'womens-safety',
    tags: ['Bengaluru', 'Karnataka', 'Local guide', 'Students'],
    keywords: ['women safety Bengaluru', 'Bengaluru police women helpline', 'Suraksha app Bengaluru', 'student safety Bengaluru', 'Karnataka emergency resources'],
    authorId: 'editorial',
    status: 'published',
    publishedAt: '2026-11-25',
    updatedAt: '2026-11-25',
    related: ['cybercrime-reporting-karnataka', 'womens-safety-india-guide', 'cab-safety-tips', 'student-safety-india-guide'],
    sources: [
      { title: 'Bengaluru City Police', publisher: 'Government of Karnataka', url: 'https://bcp.karnataka.gov.in/' },
      ERSS,
      { title: 'Pink Hoysalas and Suraksha app for women and children in Bengaluru (report)', publisher: 'YourStory', url: 'https://yourstory.com/2017/04/pink-hoysala-suraksha-app/' },
    ],
    accent: 'coral',
    art: 'Bengaluru',
    body: [
      {
        type: 'p',
        text: 'Bengaluru draws students and young professionals from across India, many living away from home for the first time. Here is the local help worth knowing, alongside the national numbers that work everywhere.',
      },
      LOCAL_NOTE,
      { type: 'h2', text: 'Numbers to save' },
      {
        type: 'table',
        head: ['Number', 'For'],
        rows: [
          ['112', 'Any emergency in Karnataka and across India'],
          ['181', 'Women Helpline'],
          ['1930', 'Online fraud and cybercrime'],
          ['1098', 'Childline'],
        ],
      },
      { type: 'h2', text: 'Bengaluru City Police help for women' },
      {
        type: 'ul',
        items: [
          '**Suraksha app:** launched by Bengaluru City Police in 2017, it sends a distress alert to the police control room and nearby patrol, from a red SOS button or by pressing the phone’s power button five times, and alerts two emergency contacts you register. Check the app store listing to confirm it is still current.',
          '**Pink Hoysala patrols:** police patrol vehicles dedicated to the safety of women and children, to which women’s safety alerts are directed.',
          'Contact details for police stations and special units are on the [Bengaluru City Police website](https://bcp.karnataka.gov.in).',
        ],
      },
      { type: 'h2', text: 'Reporting cybercrime in Bengaluru' },
      {
        type: 'p',
        text: 'Call **1930** first if money is involved, file at cybercrime.gov.in, and register a complaint at a police station. Bengaluru has dedicated CEN (cyber, economic offences and narcotics) police stations, and local stations also accept cybercrime complaints. See [cybercrime reporting in Karnataka](/blog/cybercrime-reporting-karnataka).',
      },
      { type: 'h2', text: 'Getting around' },
      {
        type: 'ul',
        items: [
          'Book cabs and autos through apps, check the plate and driver, and share your trip. See [cab safety tips](/blog/cab-safety-tips).',
          'On the metro and buses, choose busier coaches and wait near staff or security late at night.',
          'Plan the last mile from the metro station after dark: an app cab or someone meeting you.',
        ],
      },
      { type: 'h2', text: 'For students new to Bengaluru' },
      {
        type: 'ul',
        items: [
          'Choose PGs and hostels carefully: visit in the evening, check locks and night security. See [hostel and PG safety](/blog/hostel-safety-tips).',
          'Save your college security number, warden and the anti-ragging helpline 1800-180-5522.',
          'Be wary of “part-time job” and “digital arrest” scams that target students. See [common online scams in India](/blog/common-online-scams-india).',
          'Read the full [student safety guide](/blog/student-safety-india-guide).',
        ],
      },
      {
        type: 'p',
        text: 'For everything that applies across India, see [women’s safety in India](/blog/womens-safety-india-guide).',
      },
    ],
    faqs: [
      {
        question: 'What is the women’s safety app of Bengaluru police?',
        answer:
          'Bengaluru City Police launched the Suraksha app in 2017. It sends an SOS to the police control room and nearby patrol and alerts two emergency contacts. Check the app store to confirm it is current. In any emergency, call 112.',
      },
      {
        question: 'Where do I report cybercrime in Bengaluru?',
        answer:
          'Call 1930 immediately for financial fraud, file at cybercrime.gov.in, and register a complaint at a CEN police station or your local police station.',
      },
    ],
  },

  /* ---------------------------------------------------------------- Karnataka cyber */
  {
    slug: 'cybercrime-reporting-karnataka',
    title: 'How to report cybercrime in Karnataka',
    seoTitle: 'How to Report Cybercrime in Karnataka: 1930 and CEN Stations',
    description:
      'The fastest way to report online fraud and cybercrime in Karnataka: 1930, cybercrime.gov.in, CEN police stations and your local station, and what to bring.',
    seoDescription:
      'Report cybercrime in Karnataka: call 1930 for fraud, file on cybercrime.gov.in, and register a complaint at a CEN or local police station, with what to bring.',
    category: 'online-harassment',
    tags: ['Karnataka', 'Bengaluru', 'Cybercrime', 'Local guide'],
    keywords: ['cybercrime complaint Karnataka', 'CEN police station Bengaluru', 'Bengaluru cyber police', 'report online fraud Karnataka'],
    authorId: 'editorial',
    status: 'published',
    publishedAt: '2026-11-25',
    updatedAt: '2026-11-25',
    related: ['cybercrime-portal-guide', 'how-to-report-cyber-harassment', 'womens-safety-bengaluru', 'common-online-scams-india'],
    sources: [
      NCRP,
      { title: 'Karnataka State Police', publisher: 'Government of Karnataka', url: 'https://ksp.karnataka.gov.in/' },
      { title: 'Cybercrime in Karnataka: 1930 calls and complaints (report)', publisher: 'Deccan Herald', url: 'https://www.deccanherald.com/india/karnataka/cybercrime-in-karnataka-over-1-lakh-calls-but-only-around-20k-firs-3397688' },
    ],
    accent: 'blue',
    art: 'KA 1930',
    body: [
      {
        type: 'p',
        text: 'Karnataka, and Bengaluru in particular, sees a large share of India’s cyber fraud. Reporting quickly, through the right channel, gives the best chance of stopping the money and catching those responsible.',
      },
      LOCAL_NOTE,
      { type: 'h2', text: 'Step 1: Call 1930 for money fraud' },
      {
        type: 'p',
        text: 'If money has been taken or a fraud is in progress, call **1930** immediately. The helpline can start the process of freezing the money before it is moved. Keep your transaction IDs and the scammer’s UPI ID, account or phone number ready.',
      },
      { type: 'h2', text: 'Step 2: File online' },
      {
        type: 'p',
        text: 'File a complaint at cybercrime.gov.in and save the acknowledgement number. See [how to use cybercrime.gov.in](/blog/cybercrime-portal-guide).',
      },
      { type: 'h2', text: 'Step 3: Register a complaint at a police station' },
      {
        type: 'ul',
        items: [
          'Karnataka has **CEN (cyber, economic offences and narcotics) police stations**: Bengaluru has eight, one in each police division, and each district has one.',
          'Local police stations can also accept cybercrime complaints.',
          'Reports say the 1930 helpline is for reporting and immediate help, and you may still need to visit a station to register a formal complaint.',
        ],
      },
      { type: 'h2', text: 'What to bring' },
      {
        type: 'ul',
        items: [
          'Your 1930 reference and cybercrime.gov.in acknowledgement numbers.',
          'Screenshots of chats, profiles and messages with dates. See [how to preserve digital evidence](/blog/how-to-preserve-digital-evidence).',
          'Bank statements showing the transactions, and the scammer’s identifiers.',
          'Your ID proof.',
        ],
      },
      { type: 'h2', text: 'Harassment, not fraud?' },
      {
        type: 'p',
        text: 'Stalking, threats, fake profiles and image-based abuse follow the same route: cybercrime.gov.in and a police station. See [how to report cyber harassment in India](/blog/how-to-report-cyber-harassment). For local help in the city, see [women’s safety in Bengaluru](/blog/womens-safety-bengaluru).',
      },
    ],
    faqs: [
      {
        question: 'What is a CEN police station in Karnataka?',
        answer:
          'CEN stands for cyber, economic offences and narcotics. Karnataka has dedicated CEN police stations: eight in Bengaluru, one per police division, and one in each district. Local stations can also accept cybercrime complaints.',
      },
      {
        question: 'How do I report online fraud in Karnataka?',
        answer:
          'Call 1930 immediately, file at cybercrime.gov.in, and register a complaint at a CEN or local police station with your evidence and reference numbers.',
      },
    ],
  },

  /* ---------------------------------------------------------------- Hyderabad */
  {
    slug: 'womens-safety-hyderabad',
    title: 'Women’s and student safety in Hyderabad: local help',
    seoTitle: 'Women’s Safety in Hyderabad: SHE Teams and Local Help',
    description:
      'How Hyderabad’s SHE Teams work and how to reach them, reporting cybercrime in Telangana, getting around safely, and a section for students.',
    seoDescription:
      'Women’s and student safety in Hyderabad: how to reach SHE Teams, report cybercrime to the Telangana Cyber Security Bureau, transport and key helplines.',
    category: 'womens-safety',
    tags: ['Hyderabad', 'Telangana', 'SHE Teams', 'Students'],
    keywords: ['women safety Hyderabad', 'SHE Teams Hyderabad', 'Telangana emergency resources', 'student safety Hyderabad'],
    authorId: 'editorial',
    status: 'published',
    publishedAt: '2026-11-25',
    updatedAt: '2026-11-25',
    related: ['cybercrime-reporting-telangana', 'womens-safety-india-guide', 'harassed-in-public-what-to-do', 'student-safety-india-guide'],
    sources: [
      { title: 'Hyderabad City Police', publisher: 'Government of Telangana', url: 'https://www.hyderabadpolice.gov.in/' },
      { title: 'Cyberabad Police', publisher: 'Government of Telangana', url: 'https://cyberabadpolice.gov.in/' },
      { title: 'How women can report harassment to Hyderabad SHE Teams (report)', publisher: 'Telangana Today', url: 'https://telanganatoday.com/how-women-can-report-harassment-to-hyderabad-she-teams-safely-confidentially' },
      ERSS,
    ],
    accent: 'blue',
    art: 'Hyderabad',
    body: [
      {
        type: 'p',
        text: 'Hyderabad and its neighbouring police commissionerates, Cyberabad and Rachakonda, run some of India’s best-known women’s safety initiatives. Here is how to use them, alongside the national numbers.',
      },
      LOCAL_NOTE,
      { type: 'h2', text: 'Numbers to save' },
      {
        type: 'table',
        head: ['Number', 'For'],
        rows: [
          ['112', 'Any emergency'],
          ['181', 'Women Helpline'],
          ['1930', 'Online fraud and cybercrime'],
          ['1800-180-5522', 'National Anti-Ragging Helpline (students)'],
        ],
      },
      { type: 'h2', text: 'SHE Teams' },
      {
        type: 'p',
        text: 'SHE Teams are Telangana Police units that act against harassment of women in public places, at work and online, often in plain clothes. You can complain by WhatsApp, phone, email or in person, and complaints are kept confidential. The WhatsApp number differs by commissionerate (Hyderabad, Cyberabad, Rachakonda), so take it from the official police website for your area, linked below.',
      },
      { type: 'h2', text: 'Reporting cybercrime' },
      {
        type: 'p',
        text: 'Call **1930** for fraud, file at cybercrime.gov.in, and use the Telangana Cyber Security Bureau’s channels. See [cybercrime reporting in Telangana](/blog/cybercrime-reporting-telangana).',
      },
      { type: 'h2', text: 'Getting around' },
      {
        type: 'ul',
        items: [
          'Use app-booked cabs and autos, check the driver and plate, and share your trip. See [cab safety tips](/blog/cab-safety-tips).',
          'On the metro and buses, choose busier coaches and plan the last mile home after dark.',
          'If you are harassed in public, move to people, call 112, and report to SHE Teams. See [what to do if you are harassed in public](/blog/harassed-in-public-what-to-do).',
        ],
      },
      { type: 'h2', text: 'For students' },
      {
        type: 'ul',
        items: [
          'Hyderabad has many colleges and coaching centres; check PGs and hostels carefully. See [hostel and PG safety](/blog/hostel-safety-tips).',
          'Report ragging on 1800-180-5522 and harassment to your college’s Internal Complaints Committee. See [harassment in college](/blog/harassment-in-college).',
          'Read the [student safety guide](/blog/student-safety-india-guide).',
        ],
      },
      {
        type: 'p',
        text: 'For everything that applies across India, see [women’s safety in India](/blog/womens-safety-india-guide).',
      },
    ],
    faqs: [
      {
        question: 'How do I contact SHE Teams in Hyderabad?',
        answer:
          'SHE Teams accept complaints by WhatsApp, phone, email or in person. The WhatsApp number differs between Hyderabad, Cyberabad and Rachakonda commissionerates, so use the number on the official police website for your area. In an emergency, call 112.',
      },
    ],
  },

  /* ---------------------------------------------------------------- Telangana cyber */
  {
    slug: 'cybercrime-reporting-telangana',
    title: 'How to report cybercrime in Telangana',
    seoTitle: 'How to Report Cybercrime in Telangana (1930 and TGCSB)',
    description:
      'Reporting online fraud and cybercrime in Hyderabad and across Telangana: 1930, cybercrime.gov.in, the Telangana Cyber Security Bureau and cyber crime police stations.',
    seoDescription:
      'Report cybercrime in Telangana: call 1930 for fraud, file on cybercrime.gov.in, use the Telangana Cyber Security Bureau’s channels and cyber crime stations.',
    category: 'online-harassment',
    tags: ['Telangana', 'Hyderabad', 'Cybercrime', 'Local guide'],
    keywords: ['cybercrime complaint Telangana', 'Telangana Cyber Security Bureau', 'Hyderabad cyber crime police', 'report online fraud Hyderabad'],
    authorId: 'editorial',
    status: 'published',
    publishedAt: '2026-11-25',
    updatedAt: '2026-11-25',
    related: ['cybercrime-portal-guide', 'how-to-report-cyber-harassment', 'womens-safety-hyderabad', 'common-online-scams-india'],
    sources: [
      NCRP,
      { title: 'TGCSB asks people to call 1930 for any help on cybercrimes (report)', publisher: 'Deccan Chronicle', url: 'https://deccanchronicle.com/southern-states/telangana/tgcsb-asks-people-to-call-1930-for-any-help-on-cybercrimes-1829819' },
      { title: 'Cyberabad Police: Cyber Crime', publisher: 'Government of Telangana', url: 'https://cyberabadpolice.gov.in/' },
    ],
    accent: 'blue',
    art: 'TG 1930',
    body: [
      {
        type: 'p',
        text: 'Telangana has a dedicated state agency for cybercrime, the **Telangana Cyber Security Bureau (TGCSB)**, alongside cyber crime police stations. Here is the route that gives the best chance of stopping a fraud.',
      },
      LOCAL_NOTE,
      { type: 'h2', text: 'Step 1: Call 1930' },
      {
        type: 'p',
        text: 'For any financial fraud, call **1930** immediately. Fast reporting is what allows money to be frozen in transit. TGCSB also publishes a WhatsApp number for reporting (8712672222 at the time of writing).',
      },
      { type: 'h2', text: 'Step 2: File at cybercrime.gov.in' },
      {
        type: 'p',
        text: 'File the complaint online and keep the acknowledgement number. See [how to use cybercrime.gov.in](/blog/cybercrime-portal-guide).',
      },
      { type: 'h2', text: 'Step 3: Police station' },
      {
        type: 'ul',
        items: [
          'Telangana has dedicated cyber crime police stations, including for Hyderabad and Cyberabad, functioning across the state since 2024.',
          'Smaller losses may be handled by your local law-and-order police station; check the current rule with the police.',
          'Bring screenshots, transaction details, the scammer’s identifiers, your reference numbers and ID. See [how to preserve digital evidence](/blog/how-to-preserve-digital-evidence).',
        ],
      },
      {
        type: 'callout',
        tone: 'info',
        title: 'Real example: fast reporting pays',
        text: 'TGCSB has reported helping victims recover significant sums, including refunds of about ₹85 crore between March and July 2024, largely because frauds were reported quickly on 1930.',
      },
      { type: 'h2', text: 'Harassment and women’s safety' },
      {
        type: 'p',
        text: 'Online harassment of women can also be reported to SHE Teams. See [women’s safety in Hyderabad](/blog/womens-safety-hyderabad) and [how to report cyber harassment in India](/blog/how-to-report-cyber-harassment).',
      },
    ],
    faqs: [
      {
        question: 'How do I report cybercrime in Telangana?',
        answer:
          'Call 1930 immediately for financial fraud, file at cybercrime.gov.in, use the Telangana Cyber Security Bureau’s published channels, and register a complaint at a cyber crime or local police station with your evidence.',
      },
    ],
  },

  /* ---------------------------------------------------------------- Chennai */
  {
    slug: 'womens-safety-chennai',
    title: 'Women’s safety in Chennai: helplines and local help',
    seoTitle: 'Women’s Safety in Chennai: Helplines and Local Help',
    description:
      'Tamil Nadu Police’s SOS app, the numbers to save, reporting harassment and cybercrime, and getting around Chennai safely.',
    seoDescription:
      'Women’s safety in Chennai: Tamil Nadu Police’s Kaaval Uthavi SOS app, helplines to save, reporting harassment and cybercrime, and getting around safely.',
    category: 'womens-safety',
    tags: ['Chennai', 'Tamil Nadu', 'Local guide'],
    keywords: ['women safety Chennai', 'Kavalan app', 'Kaaval Uthavi app', 'Chennai police women helpline'],
    authorId: 'editorial',
    status: 'published',
    publishedAt: '2026-11-25',
    updatedAt: '2026-11-25',
    related: ['womens-safety-india-guide', 'cab-safety-tips', 'how-to-report-cyber-harassment', 'sos-and-trusted-contacts'],
    sources: [
      { title: 'Tamil Nadu Police', publisher: 'Government of Tamil Nadu', url: 'https://www.tnpolice.gov.in/' },
      { title: 'TN CM launches Kaaval Uthavi app for public during emergency (report)', publisher: 'ThePrint', url: 'https://theprint.in/india/tn-cm-launches-kaaval-uthavi-app-for-public-during-emergency/901996' },
      ERSS,
      WHL,
    ],
    accent: 'coral',
    art: 'Chennai',
    body: [
      {
        type: 'p',
        text: 'Chennai has its own police SOS tools in addition to the national numbers. Here is what to save and how to use it.',
      },
      LOCAL_NOTE,
      { type: 'h2', text: 'Numbers to save' },
      {
        type: 'table',
        head: ['Number', 'For'],
        rows: [
          ['112', 'Any emergency'],
          ['181', 'Women Helpline'],
          ['1091', 'Women’s helpline run by the police'],
          ['1930', 'Online fraud and cybercrime'],
        ],
      },
      { type: 'h2', text: 'Tamil Nadu Police’s SOS app' },
      {
        type: 'p',
        text: 'Tamil Nadu Police launched the **Kavalan SOS** app in 2018: pressing its SOS button alerts the police control centre and nearby station and sends your location to registered contacts. In 2022 the state launched the **Kaaval Uthavi** app, with many emergency and police services, into which Kavalan’s SOS features were to be integrated. Check the app stores for the current version.',
      },
      { type: 'h2', text: 'Reporting harassment and cybercrime' },
      {
        type: 'ul',
        items: [
          'In danger: call 112.',
          'Harassment in public: move to people, ask for help, report at the nearest police station. See [harassed in public](/blog/harassed-in-public-what-to-do).',
          'Online harassment or fraud: 1930 and cybercrime.gov.in. See [how to report cyber harassment](/blog/how-to-report-cyber-harassment).',
        ],
      },
      { type: 'h2', text: 'Getting around' },
      {
        type: 'ul',
        items: [
          'Prefer app-booked cabs and autos, check the driver and plate, and share your trip. See [cab safety tips](/blog/cab-safety-tips).',
          'On suburban trains and the metro, choose busier or women’s coaches, and call 139 (Rail Madad) on trains.',
          'Set up your trusted contacts before late journeys. See [SOS and trusted contacts](/blog/sos-and-trusted-contacts).',
        ],
      },
      {
        type: 'p',
        text: 'For everything that applies across India, see [women’s safety in India](/blog/womens-safety-india-guide).',
      },
    ],
    faqs: [
      {
        question: 'What is the Tamil Nadu police app for women’s safety?',
        answer:
          'Tamil Nadu Police launched the Kavalan SOS app in 2018 and the Kaaval Uthavi app in 2022, into which Kavalan’s SOS features were to be integrated. Check the app stores for the current version. In an emergency, call 112.',
      },
    ],
  },

  /* ---------------------------------------------------------------- Mumbai */
  {
    slug: 'womens-safety-mumbai',
    title: 'Women’s safety in Mumbai: helplines and local help',
    seoTitle: 'Women’s Safety in Mumbai: Helplines and Local Trains',
    description:
      'Mumbai Police’s women’s helpline and Nirbhaya Squads, railway police help on local trains, and practical tips for commuting safely in Mumbai.',
    seoDescription:
      'Women’s safety in Mumbai: Mumbai Police helpline 103 and Nirbhaya Squads, railway police helpline 1512 on local trains, and tips for commuting safely.',
    category: 'womens-safety',
    tags: ['Mumbai', 'Maharashtra', 'Local trains', 'Local guide'],
    keywords: ['women safety Mumbai', 'Mumbai police women helpline 103', 'Nirbhaya Squad Mumbai', 'Mumbai local train women safety', 'GRP helpline 1512'],
    authorId: 'editorial',
    status: 'published',
    publishedAt: '2026-11-25',
    updatedAt: '2026-11-25',
    related: ['public-transport-safety', 'womens-safety-india-guide', 'harassed-in-public-what-to-do', 'night-travel-safety-women'],
    sources: [
      { title: 'Mumbai Police', publisher: 'Government of Maharashtra', url: 'https://mumbaipolice.gov.in/' },
      { title: 'Mumbai Police forms Nirbhaya Squad, issues helpline number (report)', publisher: 'Republic World', url: 'https://www.republicworld.com/india/mumbai-police-to-form-nirbhaya-squad-launches-helpline-number-for-womens-safety' },
      { title: 'Central Railway safety measures for women commuters (report)', publisher: 'Free Press Journal', url: 'https://www.freepressjournal.in/amp/mumbai/mumbai-central-railway-introduces-enhanced-safety-security-and-hygiene-measures-for-women-commuters' },
      ERSS,
    ],
    accent: 'ink',
    art: 'Mumbai',
    body: [
      {
        type: 'p',
        text: 'Millions of women commute in Mumbai every day, much of it on local trains. The city has its own police and railway helplines worth saving alongside 112.',
      },
      LOCAL_NOTE,
      { type: 'h2', text: 'Numbers to save' },
      {
        type: 'table',
        head: ['Number', 'For'],
        rows: [
          ['112', 'Any emergency'],
          ['103', 'Mumbai Police women’s helpline'],
          ['1512', 'Government Railway Police (GRP) helpline, for local trains and stations'],
          ['139', 'Rail Madad: railway help'],
          ['1930', 'Online fraud and cybercrime'],
        ],
      },
      { type: 'h2', text: 'Mumbai Police: Nirbhaya Squads' },
      {
        type: 'p',
        text: 'After 2021, Mumbai Police set up Nirbhaya Squads at police stations: patrol teams focused on women’s safety, reachable through the women’s helpline 103. Women can report harassment, stalking and molestation, as well as emergencies.',
      },
      { type: 'h2', text: 'On local trains' },
      {
        type: 'ul',
        items: [
          'Use ladies’ compartments, and avoid an empty compartment late at night; move to one with other passengers.',
          'Railway police have been deployed in ladies’ compartments at night; if you find none and feel unsafe, call **1512**.',
          'Note the train, compartment and time if anyone harasses you, and tell police at the next station.',
          'Plan the last mile from the station after dark. See [public transport safety](/blog/public-transport-safety).',
        ],
      },
      { type: 'h2', text: 'Harassment in public' },
      {
        type: 'p',
        text: 'Move towards people, say clearly what is happening, and call 103 or 112. See [what to do if you are harassed in public](/blog/harassed-in-public-what-to-do) and [night travel safety](/blog/night-travel-safety-women).',
      },
      {
        type: 'p',
        text: 'For everything that applies across India, see [women’s safety in India](/blog/womens-safety-india-guide).',
      },
    ],
    faqs: [
      {
        question: 'What is the Mumbai police helpline for women?',
        answer: 'Mumbai Police’s women’s helpline is 103, linked to its Nirbhaya Squads. In any emergency, call 112. On local trains, the railway police helpline is 1512.',
      },
      {
        question: 'Who do I call if I feel unsafe on a Mumbai local train?',
        answer:
          'Call 1512, the Government Railway Police helpline, or 112 in an emergency. Move to a compartment with other passengers, and tell police at the next station.',
      },
    ],
  },

  /* ---------------------------------------------------------------- Delhi */
  {
    slug: 'womens-safety-delhi',
    title: 'Women’s safety in Delhi: helplines and local help',
    seoTitle: 'Women’s Safety in Delhi: Helplines, Metro and Local Help',
    description:
      'Delhi Police’s women’s helpline and safety app, help on the Delhi Metro, autos and cabs, and how to report harassment and cybercrime in Delhi.',
    seoDescription:
      'Women’s safety in Delhi: Delhi Police women helpline 1091 and Himmat app, the Metro’s women-only coach and helpline 155370, autos, cabs and reporting.',
    category: 'womens-safety',
    tags: ['Delhi', 'Delhi Metro', 'Local guide'],
    keywords: ['women safety Delhi', 'Delhi police women helpline 1091', 'Himmat app', 'Delhi metro women coach', 'DMRC helpline 155370'],
    authorId: 'editorial',
    status: 'published',
    publishedAt: '2026-11-25',
    updatedAt: '2026-11-25',
    related: ['public-transport-safety', 'cab-safety-tips', 'womens-safety-india-guide', 'harassed-in-public-what-to-do'],
    sources: [
      { title: 'Delhi Police', publisher: 'Government of NCT of Delhi', url: 'https://delhipolice.gov.in/' },
      { title: 'Delhi Metro Rail Corporation', publisher: 'DMRC', url: 'https://www.delhimetrorail.com/' },
      { title: 'Over 2,300 men fined for entering women’s coach in Delhi Metro in 2024-25 (report)', publisher: 'ThePrint', url: 'https://theprint.in/india/2320-men-fined-for-unlawfully-entering-womens-coach-in-delhi-metro-in-2024-25/2695695' },
      ERSS,
    ],
    accent: 'red',
    art: 'Delhi',
    body: [
      {
        type: 'p',
        text: 'Delhi has dedicated women’s helplines, police safety apps and women-only coaches on the Metro. Here is what to save and how to use them.',
      },
      LOCAL_NOTE,
      { type: 'h2', text: 'Numbers to save' },
      {
        type: 'table',
        head: ['Number', 'For'],
        rows: [
          ['112', 'Any emergency'],
          ['1091', 'Delhi Police women’s helpline (24 hours)'],
          ['181', 'Women Helpline'],
          ['155370', 'Delhi Metro (DMRC) helpline, including women’s coach complaints'],
          ['1930', 'Online fraud and cybercrime'],
        ],
      },
      { type: 'h2', text: 'Delhi Police safety apps' },
      {
        type: 'p',
        text: 'Delhi Police’s **Himmat** app sends an SOS with your location to the police control room. **Himmat Plus** added a QR-code feature for autos and taxis: scan the code displayed in the vehicle to share the driver and vehicle details. Check the app stores for the current version.',
      },
      { type: 'h2', text: 'On the Delhi Metro' },
      {
        type: 'ul',
        items: [
          'The **first coach in the direction of travel is reserved for women** at all times; men entering it can be fined ₹250.',
          'Report harassment or men in the women’s coach to the DMRC helpline **155370**, or to staff and security at the next station.',
          'Plan the last mile home from the station after dark. See [public transport safety](/blog/public-transport-safety).',
        ],
      },
      {
        type: 'callout',
        tone: 'info',
        title: 'Real example: enforcement',
        text: 'Delhi Metro has run regular drives against men travelling in women’s coaches; more than 2,300 men were fined for it in 2024-25, according to reports.',
      },
      { type: 'h2', text: 'Autos and cabs' },
      {
        type: 'p',
        text: 'Prefer app-booked rides, match the plate and driver, sit in the back and share your trip. See [cab safety tips](/blog/cab-safety-tips).',
      },
      { type: 'h2', text: 'Harassment and cybercrime' },
      {
        type: 'p',
        text: 'In public, move to people and call 1091 or 112; see [what to do if you are harassed in public](/blog/harassed-in-public-what-to-do). Online, call 1930 and file at cybercrime.gov.in. For everything else, see [women’s safety in India](/blog/womens-safety-india-guide).',
      },
    ],
    faqs: [
      {
        question: 'What is the women helpline number in Delhi?',
        answer: 'Delhi Police’s women’s helpline is 1091 (24 hours). 181 is the Women Helpline, and 112 is for any emergency.',
      },
      {
        question: 'Which Delhi Metro coach is for women?',
        answer:
          'The first coach in the direction of travel is reserved for women at all times. Report men in the women’s coach or any harassment to the DMRC helpline 155370 or to staff.',
      },
    ],
  },

  /* ---------------------------------------------------------------- Pune */
  {
    slug: 'womens-safety-pune',
    title: 'Women’s safety in Pune: helplines and local help',
    seoTitle: 'Women’s Safety in Pune: Damini Squads and Local Help',
    description:
      'Pune Police’s Damini Squads and Buddy Cop groups for working women, the numbers to save, and getting around and reporting harassment in Pune.',
    seoDescription:
      'Women’s safety in Pune: 112 as the emergency number, Pune Police’s Damini Squads and Buddy Cop groups for working women, transport and reporting harassment.',
    category: 'womens-safety',
    tags: ['Pune', 'Maharashtra', 'Local guide', 'Working women'],
    keywords: ['women safety Pune', 'Damini squad Pune', 'Buddy Cop Pune', 'Pune police women helpline'],
    authorId: 'editorial',
    status: 'published',
    publishedAt: '2026-11-25',
    updatedAt: '2026-11-25',
    related: ['womens-safety-india-guide', 'workplace-safety-for-women', 'night-shift-employee-safety', 'cab-safety-tips'],
    sources: [
      { title: 'Pune City Police', publisher: 'Government of Maharashtra', url: 'https://punepolice.gov.in/' },
      { title: 'Pune police relaunch Buddy Cop initiative for working women (report)', publisher: 'Careers360', url: 'https://news.careers360.com/after-covid-19-break-pune-police-relaunch-buddy-cop-initiative-ensure-safety-of-working-women' },
      { title: 'Damini Squad raises awareness about emergency helpline numbers (report)', publisher: 'The Bridge Chronicle', url: 'https://www.thebridgechronicle.com/news/damini-squad-takes-to-streets-to-raise-awareness-about-emergency-helpline-numbers' },
      ERSS,
    ],
    accent: 'blue',
    art: 'Pune',
    body: [
      {
        type: 'p',
        text: 'Pune is home to many students and working women in IT and other industries, often commuting late. Pune Police runs dedicated women’s safety squads and groups in addition to the emergency number.',
      },
      LOCAL_NOTE,
      { type: 'h2', text: 'Numbers to save' },
      {
        type: 'table',
        head: ['Number', 'For'],
        rows: [
          ['112', 'Any emergency (Pune moved to 112 as its single emergency number)'],
          ['181', 'Women Helpline'],
          ['1930', 'Online fraud and cybercrime'],
        ],
      },
      { type: 'h2', text: 'Damini Squads' },
      {
        type: 'p',
        text: 'Pune Police’s **Damini Squads**, staffed by women officers called Damini Marshals under the Bharosa Cell, patrol crowded places, colleges and schools and act against people harassing women in public. Contact details for squads in your area are published by Pune Police.',
      },
      { type: 'h2', text: 'Buddy Cop for working women' },
      {
        type: 'p',
        text: 'Under the **Buddy Cop** initiative, police stations run WhatsApp groups that connect working women in their area with a designated police officer, so concerns can be raised quickly. Ask your local police station or your company’s HR whether a group covers your workplace.',
      },
      { type: 'h2', text: 'Late commutes' },
      {
        type: 'ul',
        items: [
          'Use company transport or app-booked cabs, check the driver and plate, and share your trip. See [cab safety tips](/blog/cab-safety-tips).',
          'Know what your employer must provide for late shifts. See [night-shift employee safety](/blog/night-shift-employee-safety) and [workplace safety for women](/blog/workplace-safety-for-women).',
        ],
      },
      {
        type: 'p',
        text: 'For harassment online, call 1930 and file at cybercrime.gov.in. For everything else, see [women’s safety in India](/blog/womens-safety-india-guide).',
      },
    ],
    faqs: [
      {
        question: 'What is the Damini Squad in Pune?',
        answer:
          'Damini Squads are Pune Police teams of women officers, called Damini Marshals, under the Bharosa Cell, who patrol crowded places, colleges and schools and act against harassment of women in public.',
      },
      {
        question: 'What number should I call for help in Pune?',
        answer: 'Call 112 for any emergency in Pune. 181 is the Women Helpline and 1930 is for online fraud and cybercrime.',
      },
    ],
  },
];
