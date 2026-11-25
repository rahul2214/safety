import type { BlogPost, Source } from '../types';

/**
 * Phase 2, batch 3: workplace safety culture, business risk assessment, hotel safety, teen digital
 * privacy, travel emergency checklist, workplace bullying, identity theft, social engineering.
 * Checked 2026-11-25:
 * - Sanchar Saathi "Know Mobile Connections in Your Name": OTP-based check of SIMs issued in your
 *   name, with an option to flag ones you never requested.
 * - UIDAI biometric lock (myAadhaar / mAadhaar) and the free annual credit report from credit
 *   information companies are stated generally and point to the official sites.
 */

const ERSS: Source = { title: 'Emergency Response Support System (112)', publisher: 'Ministry of Home Affairs', url: 'https://112.gov.in/' };
const NCRP: Source = { title: 'National Cyber Crime Reporting Portal (cybercrime.gov.in)', publisher: 'Ministry of Home Affairs', url: 'https://cybercrime.gov.in/' };
const CERTIN: Source = { title: 'Indian Computer Emergency Response Team (CERT-In)', publisher: 'Ministry of Electronics and Information Technology', url: 'https://www.cert-in.org.in/' };
const NDMA: Source = { title: 'National Disaster Management Authority', publisher: 'Government of India', url: 'https://ndma.gov.in/' };
const MOT: Source = { title: 'Incredible India tourist helpline (1363)', publisher: 'Ministry of Tourism', url: 'https://www.incredibleindia.gov.in/' };
const SANCHAR: Source = { title: 'Sanchar Saathi: Know Mobile Connections in Your Name', publisher: 'Department of Telecommunications', url: 'https://www.sancharsaathi.gov.in/' };
const SHE: Source = { title: 'SHe-Box', publisher: 'Ministry of Women and Child Development', url: 'https://shebox.wcd.gov.in/' };

export const PHASE2_BATCH3_POSTS: BlogPost[] = [
  /* ---------------------------------------------------------------- safety culture */
  {
    slug: 'workplace-safety-culture',
    title: 'How to build a workplace safety culture',
    seoTitle: 'How to Build a Workplace Safety Culture That Lasts',
    description:
      'Policies are not enough. How leaders, managers and HR build a culture where people speak up, problems get fixed and everyone looks out for each other.',
    seoDescription:
      'Build a workplace safety culture where people speak up: leadership, manager behaviour, reporting that works, training that sticks, and measuring progress.',
    category: 'corporate-safety',
    tags: ['Safety culture', 'Leadership', 'HR', 'Speak-up'],
    keywords: ['workplace safety culture', 'how to build a safety culture', 'safety training', 'reporting culture', 'speak up culture'],
    authorId: 'editorial',
    status: 'published',
    publishedAt: '2026-11-25',
    updatedAt: '2026-11-25',
    related: ['organization-safety-framework', 'company-anonymous-reporting', 'hr-complaint-handling', 'workplace-safety-guide'],
    sources: [SHE, { title: 'Ministry of Labour and Employment', publisher: 'Government of India', url: 'https://labour.gov.in/' }],
    accent: 'blue',
    art: 'Culture',
    body: [
      {
        type: 'p',
        text: 'A safety culture is what people actually do when nobody is checking: whether they mention a hazard, step in when a colleague is harassed, or report a near miss. Policies set the rules; culture decides whether they are followed.',
      },
      { type: 'h2', text: '1. Leaders go first' },
      {
        type: 'ul',
        items: [
          'Talk about safety and respect regularly, not only after an incident.',
          'Follow the rules yourself, visibly.',
          'Act on reports, including about senior or high-performing people.',
          'Thank people who raise concerns, publicly where appropriate.',
        ],
      },
      { type: 'h2', text: '2. Managers make or break it' },
      {
        type: 'p',
        text: 'Most employees judge the organisation by their own manager. Train managers to respond well when someone raises a concern: listen, do not dismiss, protect from retaliation, and pass it on to the right channel. A manager who shrugs off one complaint silences the whole team.',
      },
      { type: 'h2', text: '3. Make reporting easy and safe' },
      {
        type: 'p',
        text: 'Several channels including an anonymous one, quick acknowledgement and visible action. See [how companies can build a safe, anonymous reporting channel](/blog/company-anonymous-reporting) and [how HR should handle harassment complaints](/blog/hr-complaint-handling).',
      },
      { type: 'h2', text: '4. Training that sticks' },
      {
        type: 'ul',
        items: [
          'Short, practical sessions using real scenarios from your workplace.',
          'POSH awareness for everyone, and deeper training for the Internal Committee and managers.',
          'Emergency basics and drills on every shift.',
          'Refreshers every year, not just at induction.',
        ],
      },
      { type: 'h2', text: '5. Close the loop' },
      {
        type: 'p',
        text: 'Share what changed because people spoke up: a fixed hazard, a new transport route, a policy update. Nothing builds trust faster than visible action.',
      },
      { type: 'h2', text: '6. Measure the right things' },
      {
        type: 'ul',
        items: [
          'Number of reports and near misses (rising reports often mean rising trust).',
          'Time to acknowledge and resolve.',
          'Anonymous survey results: “Do you feel safe to speak up?”',
          'Drill participation and completion.',
        ],
      },
      {
        type: 'p',
        text: 'Put it all together with the [organisation safety framework](/blog/organization-safety-framework) and share the [workplace safety guide](/blog/workplace-safety-guide) with employees.',
      },
    ],
    faqs: [
      {
        question: 'How do you build a safety culture at work?',
        answer:
          'Leaders model and talk about safety, managers are trained to respond well to concerns, reporting is easy and safe including anonymously, training is practical and repeated, people see what changed, and progress is measured.',
      },
    ],
  },

  /* ---------------------------------------------------------------- risk assessment */
  {
    slug: 'business-risk-assessment',
    title: 'Business safety risk assessment: step by step',
    seoTitle: 'Business Safety Risk Assessment: Step by Step',
    description:
      'A simple five-step method any shop, office, clinic or restaurant can use to find hazards, decide what to fix first, and keep a record.',
    seoDescription:
      'A simple five-step safety risk assessment for small businesses: find hazards, decide who could be harmed, rate the risk, fix what matters first, and review it.',
    category: 'business-safety',
    tags: ['Risk assessment', 'Small business', 'Safety audit', 'Checklist'],
    keywords: ['business risk assessment', 'safety risk assessment', 'business safety audit checklist', 'physical security checklist for businesses'],
    authorId: 'editorial',
    status: 'published',
    publishedAt: '2026-11-25',
    updatedAt: '2026-11-25',
    related: ['business-safety-guide', 'business-emergency-plan', 'incident-management-guide', 'customer-harassment-response'],
    sources: [NDMA, ERSS],
    accent: 'coral',
    art: 'Assess',
    body: [
      {
        type: 'p',
        text: 'A risk assessment is just a careful look at what could hurt people in your business, and what you are doing about it. It does not need to be complicated. Check any specific requirements for your sector, such as fire safety or food safety, with the relevant authority.',
      },
      { type: 'h2', text: 'Step 1: Find the hazards' },
      {
        type: 'p',
        text: 'Walk around at different times of day and ask staff. Look for:',
      },
      {
        type: 'ul',
        items: [
          'Fire: wiring, overloaded sockets, gas, blocked exits, missing extinguishers.',
          'Slips, trips and falls: wet floors, stairs, cables, poor lighting.',
          'Equipment and chemicals: kitchens, machines, cleaning products.',
          'People: aggressive customers, lone working, late closing, cash handling.',
          'Digital: shared passwords, payment fraud, phishing.',
        ],
      },
      { type: 'h2', text: 'Step 2: Decide who might be harmed' },
      {
        type: 'p',
        text: 'Staff, customers, delivery workers, visitors, children, older people, people with disabilities. Some are more at risk than others.',
      },
      { type: 'h2', text: 'Step 3: Rate each risk' },
      {
        type: 'table',
        head: ['', 'Unlikely', 'Possible', 'Likely'],
        rows: [
          ['Serious harm', 'Medium', 'High', 'High'],
          ['Moderate harm', 'Low', 'Medium', 'High'],
          ['Minor harm', 'Low', 'Low', 'Medium'],
        ],
        caption: 'Fix high risks first.',
      },
      { type: 'h2', text: 'Step 4: Control the risks' },
      {
        type: 'p',
        text: 'Remove the hazard if you can; if not, reduce it (guards, better lighting, a second person at closing time), and then train people and provide equipment. Write down who will do what by when.',
      },
      { type: 'h2', text: 'Step 5: Record and review' },
      {
        type: 'p',
        text: 'Keep a simple table of hazards, risk ratings, actions and owners. Review it every year, and after any incident, new equipment or change of premises.',
      },
      {
        type: 'callout',
        tone: 'info',
        title: 'Use what you already know',
        text: 'Your incident log is a goldmine: every near miss points to a hazard. See [safety incident management](/blog/incident-management-guide).',
      },
      {
        type: 'p',
        text: 'Turn the results into your [small business emergency plan](/blog/business-emergency-plan), and see the [business safety guide](/blog/business-safety-guide) for the full picture.',
      },
    ],
    faqs: [
      {
        question: 'How do I do a safety risk assessment for my business?',
        answer:
          'Find the hazards, decide who might be harmed, rate each risk by likelihood and severity, put controls in place starting with the highest risks, then record everything and review it at least yearly.',
      },
    ],
  },

  /* ---------------------------------------------------------------- hotel safety */
  {
    slug: 'hotel-safety-tips',
    title: 'Hotel safety tips for travellers',
    seoTitle: 'Hotel Safety Tips for Travellers (Especially Women)',
    description:
      'Choosing a safe hotel, check-in habits, securing your room, fire safety, and what to do if something feels wrong during your stay.',
    seoDescription:
      'Hotel safety tips for travellers in India: choosing a safe hotel, check-in habits, securing your room, fire exits, and what to do if something feels wrong.',
    category: 'travel-safety',
    tags: ['Hotels', 'Travel', 'Women travellers'],
    keywords: ['hotel safety tips', 'hotel safety for women', 'hotel room safety', 'travel safety'],
    authorId: 'editorial',
    status: 'published',
    publishedAt: '2026-11-25',
    updatedAt: '2026-11-25',
    related: ['solo-travel-safety-india', 'unsafe-while-travelling', 'travel-emergency-checklist', 'night-travel-safety-women'],
    sources: [MOT, ERSS],
    accent: 'ink',
    art: 'Room 0',
    body: [
      {
        type: 'p',
        text: 'Most hotel stays are uneventful. These habits take a few minutes and make it much harder for anyone to bother you, and much easier to get out quickly if there is a fire.',
      },
      { type: 'h2', text: 'Choosing a hotel' },
      {
        type: 'ul',
        items: [
          'Read recent reviews, especially from solo and women travellers.',
          'Prefer a staffed 24-hour reception and a busy, well-lit street.',
          'Check that the room has a working lock, a door chain or latch, and a peephole.',
          'Arrive in daylight if you can, especially in a new city.',
        ],
      },
      { type: 'h2', text: 'At check-in' },
      {
        type: 'ul',
        items: [
          'Ask reception not to say your room number aloud; ask them to write it down.',
          'Avoid ground-floor rooms with easy window access if you can.',
          'Take a hotel card with the address and phone number, in case your phone dies.',
        ],
      },
      { type: 'h2', text: 'In your room' },
      {
        type: 'ul',
        items: [
          'Lock the door and use the chain or latch every time you are inside.',
          'Check the door, windows and balcony lock; report anything broken.',
          'Do not open the door to unexpected visitors, including “staff”; call reception to check.',
          'Keep valuables and passports in the safe or with you.',
        ],
      },
      { type: 'h2', text: 'Fire safety' },
      {
        type: 'ul',
        items: [
          'Find the two nearest exits and count the doors between your room and each.',
          'Keep your phone, key and a torch by the bed.',
          'In a fire, never use the lift. If the corridor is full of smoke, stay low, or stay in the room with wet towels at the door and signal from the window.',
        ],
      },
      { type: 'h2', text: 'If something feels wrong' },
      {
        type: 'p',
        text: 'Call reception, ask to change rooms, or leave and stay somewhere else. If you feel in danger, call **112**. Travellers can also call the tourist helpline **1363**. See [feeling unsafe in an unfamiliar city](/blog/unsafe-while-travelling).',
      },
      {
        type: 'p',
        text: 'Plan the rest of your trip with [solo travel safety in India](/blog/solo-travel-safety-india) and the [travel emergency checklist](/blog/travel-emergency-checklist).',
      },
    ],
    faqs: [
      {
        question: 'How can I stay safe in a hotel room?',
        answer:
          'Ask reception not to say your room number aloud, lock the door and use the chain every time, never open the door to unexpected visitors without calling reception, know the two nearest fire exits, and keep your phone and key by the bed.',
      },
    ],
  },

  /* ---------------------------------------------------------------- teen privacy */
  {
    slug: 'teen-digital-privacy',
    title: 'How to teach teenagers about digital privacy',
    seoTitle: 'How to Teach Teenagers About Digital Privacy',
    description:
      'Why teens overshare, what they actually need to know, how to talk about it without lecturing, and the settings to go through together.',
    seoDescription:
      'Help teenagers protect their privacy online: why oversharing happens, what to teach about photos, location and strangers, and settings to check together.',
    category: 'family-safety',
    tags: ['Teenagers', 'Digital privacy', 'Parents', 'Social media'],
    keywords: ['teach teenagers about digital privacy', 'social media safety for students', 'teen online privacy', 'student digital privacy'],
    authorId: 'editorial',
    status: 'published',
    publishedAt: '2026-11-25',
    updatedAt: '2026-11-25',
    related: ['children-online-safety-parents', 'social-media-privacy-settings', 'digital-footprint', 'family-location-sharing'],
    sources: [NCRP, CERTIN],
    accent: 'blue',
    art: 'Teen',
    body: [
      {
        type: 'p',
        text: 'Teenagers live much of their social life online, and sharing is part of it. Banning apps rarely works. Helping them understand what is worth keeping private, and why, protects them far better.',
      },
      { type: 'h2', text: 'Start with why, not rules' },
      {
        type: 'p',
        text: 'Ask what they think strangers could work out from their profile: their school, area, routine, friends, what they look like. Then look together. It is usually a lot more than they expect, and seeing it is more persuasive than any lecture.',
      },
      { type: 'h2', text: 'What teenagers need to know' },
      {
        type: 'ul',
        items: [
          '**Photos last forever.** Anything sent can be screenshotted and shared, even on “disappearing” apps.',
          '**Location gives a lot away:** school uniforms, the view from a window, live location on maps.',
          '**Not everyone is who they say.** Fake profiles are easy to make; new “friends” who ask for photos or secrecy are a red flag.',
          '**Sextortion is a known scam.** If anyone threatens to share images, they should tell you straight away and not pay. See [what to do if someone threatens to leak photos](/blog/someone-threatening-to-leak-photos).',
          '**Passwords and OTPs are personal,** even with best friends.',
        ],
      },
      { type: 'h2', text: 'Settings to go through together' },
      {
        type: 'ol',
        items: [
          'Private accounts, with followers they actually know.',
          'Hidden friends lists, and limited who can message or tag them.',
          'Location tags and map features off.',
          'Two-step verification on their main accounts.',
          'A check of what is public, while logged out.',
        ],
      },
      {
        type: 'p',
        text: 'Use the [social media privacy settings](/blog/social-media-privacy-settings) checklist, and help them [reduce their digital footprint](/blog/digital-footprint) before college applications.',
      },
      { type: 'h2', text: 'Keep the door open' },
      {
        type: 'p',
        text: 'The most important rule: if something goes wrong online, they can come to you and will not be punished for it. Teenagers who fear losing their phone hide problems until they are serious. See [online safety for children](/blog/children-online-safety-parents).',
      },
    ],
    faqs: [
      {
        question: 'How do I teach my teenager about online privacy?',
        answer:
          'Start by looking together at what a stranger can see on their profiles, explain why photos, location and passwords matter, go through privacy settings together, and promise they will not be punished for telling you about a problem.',
      },
    ],
  },

  /* ---------------------------------------------------------------- travel checklist */
  {
    slug: 'travel-emergency-checklist',
    title: 'Travel emergency checklist: before you leave',
    seoTitle: 'Travel Emergency Checklist: What to Do Before You Leave',
    description:
      'Documents, money, phone, health, plans and contacts: a checklist to complete before any trip, so a lost phone or wallet does not become a crisis.',
    seoDescription:
      'A travel emergency checklist for India: documents and DigiLocker, money backups, phone and contacts, health, sharing plans, and what to do if things go wrong.',
    category: 'travel-safety',
    tags: ['Travel', 'Checklist', 'Documents', 'Planning'],
    keywords: ['travel emergency checklist', 'how to share travel plans safely', 'travel safety plan', 'lost ID while travelling'],
    authorId: 'editorial',
    status: 'published',
    publishedAt: '2026-11-25',
    updatedAt: '2026-11-25',
    related: ['solo-travel-safety-india', 'hotel-safety-tips', 'unsafe-while-travelling', 'lost-or-stolen-phone-india'],
    sources: [MOT, ERSS, { title: 'DigiLocker', publisher: 'Ministry of Electronics and Information Technology', url: 'https://www.digilocker.gov.in/' }],
    accent: 'coral',
    art: 'Packed',
    body: [
      {
        type: 'p',
        text: 'The best time to prepare for a travel emergency is the night before you leave. Work through this checklist and a lost phone, wallet or ID becomes an inconvenience, not a crisis.',
      },
      { type: 'h2', text: 'Documents' },
      {
        type: 'ul',
        items: [
          'Official digital copies of ID and driving licence in [DigiLocker](https://www.digilocker.gov.in).',
          'Photos of tickets, bookings and insurance saved offline.',
          'One printed copy of key documents, kept separately from the originals.',
        ],
      },
      { type: 'h2', text: 'Money' },
      {
        type: 'ul',
        items: [
          'Cards and cash split between two places.',
          'Your bank’s card-blocking number saved somewhere other than your phone.',
          'A UPI PIN on a different app from your banking login.',
        ],
      },
      { type: 'h2', text: 'Phone' },
      {
        type: 'ul',
        items: [
          'Power bank and cable packed.',
          'Find My Device or Find My turned on; IMEI noted elsewhere.',
          'Emergency contacts and medical ID filled in.',
          'Offline maps of where you are going.',
        ],
      },
      { type: 'h2', text: 'Health' },
      {
        type: 'ul',
        items: [
          'Regular medicines for the trip plus a few extra days.',
          'A small first-aid kit.',
          'Health insurance details and nearest hospitals noted.',
        ],
      },
      { type: 'h2', text: 'Plans and contacts' },
      {
        type: 'ul',
        items: [
          'Itinerary shared with one or two people, with daily check-in times.',
          'Numbers saved: 112, tourist helpline 1363, Rail Madad 139, your hotel.',
          'A paper card with one emergency contact and your hotel address.',
          'Plan to share your [live location](/blog/live-location-safety) on long or late journeys.',
        ],
      },
      { type: 'h2', text: 'If something goes wrong' },
      {
        type: 'ul',
        items: [
          'Lost phone: see [what to do if your phone is lost or stolen](/blog/lost-or-stolen-phone-india).',
          'Lost documents: report at the nearest police station and keep the complaint copy.',
          'Feeling unsafe: see [feeling unsafe in an unfamiliar city](/blog/unsafe-while-travelling).',
        ],
      },
      {
        type: 'p',
        text: 'Then read [solo travel safety in India](/blog/solo-travel-safety-india) and [hotel safety tips](/blog/hotel-safety-tips).',
      },
    ],
    faqs: [
      {
        question: 'What should I do before travelling to prepare for emergencies?',
        answer:
          'Save digital copies of documents in DigiLocker, split cards and cash, pack a power bank, turn on Find My Device, fill in emergency contacts, carry medicines, share your itinerary, and save 112, 1363 and your hotel’s number.',
      },
    ],
  },

  /* ---------------------------------------------------------------- workplace bullying */
  {
    slug: 'workplace-bullying',
    title: 'Workplace bullying: signs and what to do',
    seoTitle: 'Workplace Bullying: Signs and What to Do',
    description:
      'Constant criticism, exclusion, impossible deadlines, public humiliation: how to recognise workplace bullying, look after yourself, and raise it effectively.',
    seoDescription:
      'Recognise workplace bullying (humiliation, exclusion, impossible demands), protect yourself, document it, and raise it with HR or the Internal Committee.',
    category: 'workplace-safety',
    tags: ['Workplace bullying', 'Toxic workplace', 'Employees', 'HR'],
    keywords: ['workplace bullying', 'workplace bullying signs', 'toxic workplace', 'how to deal with a toxic workplace safely'],
    authorId: 'editorial',
    status: 'published',
    publishedAt: '2026-11-25',
    updatedAt: '2026-11-25',
    related: ['document-workplace-harassment', 'hr-complaint-handling', 'workplace-safety-guide', 'workplace-harassment-posh'],
    sources: [SHE, { title: 'Tele MANAS (14416)', publisher: 'Ministry of Health and Family Welfare', url: 'https://telemanas.mohfw.gov.in/' }],
    accent: 'ink',
    art: 'Not normal',
    body: [
      {
        type: 'p',
        text: 'Workplace bullying is repeated behaviour that humiliates, intimidates or undermines someone. It is different from firm management or a bad day. India does not have a separate law on workplace bullying, but most organisations’ conduct policies prohibit it, and some forms are covered by other laws.',
      },
      { type: 'h2', text: 'Signs of bullying' },
      {
        type: 'ul',
        items: [
          'Being shouted at, mocked or criticised in front of others.',
          'Deliberately being left out of meetings, emails or decisions.',
          'Impossible deadlines or workloads, or work taken away to undermine you.',
          'Constant nit-picking, or your work being taken credit for.',
          'Rumours, threats about your job, or messages outside work hours meant to intimidate.',
        ],
      },
      {
        type: 'p',
        text: 'If the behaviour is sexual in nature, it is sexual harassment and covered by the POSH Act. See [how to report workplace sexual harassment](/blog/workplace-harassment-posh).',
      },
      { type: 'h2', text: 'What to do' },
      {
        type: 'ol',
        items: [
          '**Keep a record:** dates, what was said or done, witnesses, emails and messages. See [how to document workplace harassment](/blog/document-workplace-harassment).',
          '**Talk to someone you trust** at work, so you are not isolated.',
          '**Consider raising it directly,** if you feel safe to: calm, specific, in writing afterwards.',
          '**Raise it formally** with HR, your manager’s manager, or the ethics or speak-up channel, attaching your record.',
          '**Ask what will happen next** and when, and keep copies of everything.',
        ],
      },
      { type: 'h2', text: 'Look after yourself' },
      {
        type: 'p',
        text: 'Bullying affects sleep, confidence and health. Talk to friends and family, use any employee assistance programme, and speak to a counsellor if it is getting you down. Tele MANAS, the free national mental health helpline, is on **14416**.',
      },
      { type: 'h2', text: 'For managers and HR' },
      {
        type: 'p',
        text: 'Take every report seriously, investigate fairly, and protect the person who raised it. See [how HR should handle harassment complaints](/blog/hr-complaint-handling) and the [workplace safety guide](/blog/workplace-safety-guide).',
      },
    ],
    faqs: [
      {
        question: 'Is workplace bullying illegal in India?',
        answer:
          'India has no separate workplace bullying law, but most employers’ conduct policies prohibit it, sexual harassment is covered by the POSH Act, and acts such as threats or assault are offences under criminal law.',
      },
      {
        question: 'What should I do if I am being bullied at work?',
        answer:
          'Keep a written record with dates and evidence, talk to someone you trust, raise it formally with HR or a senior manager, keep copies of everything, and look after your health.',
      },
    ],
  },

  /* ---------------------------------------------------------------- identity theft */
  {
    slug: 'identity-theft-india',
    title: 'Identity theft online: how to prevent and respond',
    seoTitle: 'Identity Theft in India: How to Prevent and Respond',
    description:
      'How criminals misuse Aadhaar, PAN, phone numbers and photos, the warning signs, how to check what is in your name, and what to do if your identity is misused.',
    seoDescription:
      'Identity theft in India: how Aadhaar, PAN and SIMs are misused, warning signs, how to check SIMs and loans in your name, and what to do if it happens.',
    category: 'cyber-safety',
    tags: ['Identity theft', 'Aadhaar', 'PAN', 'SIM'],
    keywords: ['identity theft', 'identity theft India', 'misuse of Aadhaar', 'PAN card misuse', 'how to protect yourself from identity theft'],
    authorId: 'editorial',
    status: 'published',
    publishedAt: '2026-11-25',
    updatedAt: '2026-11-25',
    related: ['how-to-report-fake-profile', 'phishing-explained', 'digital-privacy-guide', 'cybercrime-portal-guide'],
    sources: [SANCHAR, NCRP, { title: 'Unique Identification Authority of India (myAadhaar)', publisher: 'UIDAI', url: 'https://uidai.gov.in/' }],
    accent: 'red',
    art: 'Me?',
    body: [
      {
        type: 'p',
        text: '**Identity theft** is when someone uses your personal details, such as your Aadhaar, PAN, phone number, photos or bank details, to pretend to be you: to take out SIM cards or loans, open accounts, or cheat others. It is an offence under the Information Technology Act.',
      },
      { type: 'h2', text: 'How it happens' },
      {
        type: 'ul',
        items: [
          'Photocopies of ID left with shops, hotels or agents.',
          'Phishing messages and fake KYC calls.',
          'Data breaches at companies that held your details.',
          'Photos of ID cards posted online or sent on WhatsApp.',
          'A lost or stolen phone or wallet.',
        ],
      },
      { type: 'h2', text: 'Warning signs' },
      {
        type: 'ul',
        items: [
          'Loan or credit card statements, or recovery calls, for accounts you never opened.',
          'OTPs or messages you did not request.',
          'A SIM in your name you did not take.',
          'Friends receiving messages from a profile using your name and photos.',
        ],
      },
      { type: 'h2', text: 'Check what is in your name' },
      {
        type: 'ul',
        items: [
          '**Mobile numbers:** use “Know Mobile Connections in Your Name” on [Sanchar Saathi](https://www.sancharsaathi.gov.in) to see SIMs issued against your identity and flag any you did not request.',
          '**Loans and cards:** check your credit report from a credit bureau. Credit bureaus in India are required to provide a free full credit report once a year.',
          '**Aadhaar:** the UIDAI’s myAadhaar portal and mAadhaar app let you review your authentication history and lock or unlock your biometrics.',
        ],
      },
      { type: 'h2', text: 'Prevent it' },
      {
        type: 'ul',
        items: [
          'Write the purpose and date across ID photocopies you hand over, and share a masked Aadhaar where accepted.',
          'Never post or forward photos of ID cards, cheques or boarding passes.',
          'Never share OTPs; learn to spot phishing. See [how to recognise a phishing message](/blog/phishing-explained).',
          'Use unique passwords and two-step verification on email and banking.',
        ],
      },
      { type: 'h2', text: 'If your identity has been misused' },
      {
        type: 'ol',
        items: [
          'Call **1930** if money is involved, and inform your bank.',
          'File a complaint at cybercrime.gov.in and keep the acknowledgement. See [the cybercrime portal guide](/blog/cybercrime-portal-guide).',
          'Flag unauthorised SIMs on Sanchar Saathi, and dispute unknown loans with the lender and credit bureau.',
          'Report fake profiles using your identity. See [how to report a fake profile](/blog/how-to-report-fake-profile).',
          'Lock your Aadhaar biometrics and change passwords.',
        ],
      },
    ],
    faqs: [
      {
        question: 'How can I check if a SIM has been issued in my name?',
        answer:
          'Use the “Know Mobile Connections in Your Name” service on the Department of Telecommunications’ Sanchar Saathi portal. It lists numbers issued against your identity and lets you flag any you did not request.',
      },
      {
        question: 'What should I do if someone misused my Aadhaar or PAN?',
        answer:
          'Report it at cybercrime.gov.in (and call 1930 if money is involved), dispute any unknown loans with the lender and credit bureau, flag unauthorised SIMs on Sanchar Saathi, and lock your Aadhaar biometrics through myAadhaar or mAadhaar.',
      },
    ],
  },

  /* ---------------------------------------------------------------- social engineering */
  {
    slug: 'social-engineering',
    title: 'Social engineering: how scammers manipulate people',
    seoTitle: 'Social Engineering: How Scammers Manipulate People',
    description:
      'The psychological tricks behind scams and hacks, including urgency, authority, fear, helpfulness and trust, and how to recognise them before they work on you.',
    seoDescription:
      'Social engineering explained: the urgency, authority, fear and trust tricks scammers use, real Indian patterns, and simple habits that stop them working.',
    category: 'cyber-safety',
    tags: ['Social engineering', 'Scams', 'OTP', 'Employees'],
    keywords: ['social engineering', 'social engineering explained', 'why you should never share OTPs', 'how scammers use social engineering'],
    authorId: 'editorial',
    status: 'published',
    publishedAt: '2026-11-25',
    updatedAt: '2026-11-25',
    related: ['common-online-scams-india', 'phishing-explained', 'deepfakes-what-to-do', 'protect-older-parents-from-scams'],
    sources: [CERTIN, NCRP],
    accent: 'ink',
    art: 'Tricks',
    body: [
      {
        type: 'p',
        text: '**Social engineering** means manipulating people rather than hacking computers. Most scams and many data breaches start this way: someone persuades a person to share a code, click a link, transfer money or open a door. The good news is that the tricks are few and recognisable.',
      },
      { type: 'h2', text: 'The six levers' },
      {
        type: 'table',
        head: ['Lever', 'What it sounds like'],
        rows: [
          ['Urgency', '“Your account will be blocked in 30 minutes.”'],
          ['Authority', '“This is the police / your bank / the CEO’s office.”'],
          ['Fear', '“A parcel in your name contained drugs.” “Your son has been arrested.”'],
          ['Greed or reward', '“You have won a prize.” “Earn ₹5,000 a day liking videos.”'],
          ['Helpfulness', '“I sent money by mistake, please return it.” “Can you hold the door?”'],
          ['Trust and familiarity', 'A message from a friend’s account, a cloned voice, a known logo.'],
        ],
      },
      { type: 'h2', text: 'Common patterns in India' },
      {
        type: 'ul',
        items: [
          '“Digital arrest” video calls from fake officials.',
          'Fake KYC or electricity disconnection messages.',
          'Friends’ hacked accounts asking for OTPs or money.',
          'Fake customer care numbers in search results.',
          'Voice-cloned calls from “relatives” in trouble.',
        ],
      },
      {
        type: 'p',
        text: 'See [common online scams in India](/blog/common-online-scams-india) and [deepfakes and voice cloning](/blog/deepfakes-what-to-do).',
      },
      { type: 'h2', text: 'Habits that defeat it' },
      {
        type: 'ol',
        items: [
          '**Pause.** Urgency is the scammer’s most important tool. Take five minutes.',
          '**Verify independently:** hang up and call back on a number you already know.',
          '**Never share OTPs, PINs or passwords,** with anyone, for any reason.',
          '**Do not install apps** or share your screen because someone asks.',
          '**Agree a family code word** for genuine emergencies.',
          '**At work, follow the process:** payments and data requests are verified, however senior the requester.',
        ],
      },
      {
        type: 'callout',
        tone: 'info',
        title: 'It is not about intelligence',
        text: 'Social engineering works on everyone, because it targets emotions, not knowledge. The people who avoid it are the ones who have a habit of pausing and checking.',
      },
      {
        type: 'p',
        text: 'If you already shared something, act quickly: see [how to recognise a phishing message](/blog/phishing-explained) for what to do next, and help older relatives with [protecting parents from scams](/blog/protect-older-parents-from-scams).',
      },
    ],
    faqs: [
      {
        question: 'What is social engineering?',
        answer:
          'Social engineering is manipulating people, rather than hacking systems, into sharing codes, clicking links, sending money or giving access, using urgency, authority, fear, reward, helpfulness or trust.',
      },
      {
        question: 'How can I protect myself from social engineering?',
        answer:
          'Pause when a message feels urgent, verify by calling back on a number you already know, never share OTPs or PINs, never install apps or share your screen on request, and agree a family code word for emergencies.',
      },
    ],
  },
];
