import type { BlogPost, Source } from '../types';

/**
 * Phase 2, batch 1: family location sharing, helping a family member, unsafe in a new city,
 * business safety pillar, customer harassment, digital privacy pillar, organisation framework,
 * HR complaint handling. Checked 2026-11-25:
 * - DPDP Rules 2025 notified 14 Nov 2025 with phased commencement (Nov 2025, Nov 2026, May 2027);
 *   core obligations after ~18 months. Exact start of individual rights not confirmed: framed as phased.
 * - POSH Act: Internal Committee led by a senior woman employee, at least half women, one external
 *   member; inquiry within 90 days; employer acts within 60 days of the report.
 * - Tourist helpline 1363 / 1800-11-1363.
 */

const ERSS: Source = { title: 'Emergency Response Support System (112)', publisher: 'Ministry of Home Affairs', url: 'https://112.gov.in/' };
const NCRP: Source = { title: 'National Cyber Crime Reporting Portal (cybercrime.gov.in)', publisher: 'Ministry of Home Affairs', url: 'https://cybercrime.gov.in/' };
const WHL: Source = { title: 'Women Helpline (181)', publisher: 'Ministry of Women and Child Development (myScheme)', url: 'https://www.myscheme.gov.in/schemes/whl-181' };
const SHE: Source = { title: 'SHe-Box: file a workplace sexual harassment complaint online', publisher: 'Ministry of Women and Child Development', url: 'https://shebox.wcd.gov.in/' };
const NDMA: Source = { title: 'National Disaster Management Authority', publisher: 'Government of India', url: 'https://ndma.gov.in/' };
const DPDP: Source = { title: 'Digital Personal Data Protection Rules, 2025 notified (PIB)', publisher: 'Ministry of Electronics and Information Technology', url: 'https://static.pib.gov.in/WriteReadData/specificdocs/documents/2025/nov/doc20251117695301.pdf' };

export const PHASE2_BATCH1_POSTS: BlogPost[] = [
  /* ---------------------------------------------------------------- family location sharing */
  {
    slug: 'family-location-sharing',
    title: 'Location sharing for families: safety without spying',
    seoTitle: 'Location Sharing for Families: Safety Without Spying',
    description:
      'How parents, teenagers and partners can use location sharing to stay safe without turning it into surveillance: agreements, settings and when to switch it off.',
    seoDescription:
      'Use location sharing in your family without it becoming surveillance: when it helps, agreeing the rules with teenagers, privacy settings and when to stop.',
    category: 'live-location',
    tags: ['Families', 'Teenagers', 'Location sharing', 'Privacy'],
    keywords: ['family location sharing', 'parents and students location sharing', 'live location for families', 'is it okay to track my teenager'],
    authorId: 'editorial',
    status: 'published',
    publishedAt: '2026-11-25',
    updatedAt: '2026-11-25',
    related: ['live-location-safety', 'location-privacy-checklist', 'family-emergency-plan', 'children-online-safety-parents'],
    sources: [{ title: 'Google Maps Help: location sharing', publisher: 'Google', url: 'https://support.google.com/maps/' }, { title: 'Find My (Apple Support)', publisher: 'Apple', url: 'https://support.apple.com/find-my' }],
    accent: 'blue',
    art: 'Home safe',
    body: [
      {
        type: 'p',
        text: 'Location sharing can bring real peace of mind: knowing a teenager reached college, a parent got home from the hospital, a partner is on the way. It can also slowly turn into checking, worry and control. The difference is in how it is agreed and used.',
      },
      { type: 'h2', text: 'When it genuinely helps' },
      {
        type: 'ul',
        items: [
          'Late journeys, long trips and first days in a new city.',
          'Children travelling alone to school or classes for the first time.',
          'Older relatives with health conditions, or who sometimes get disoriented.',
          'Emergencies, when someone needs to find you quickly.',
        ],
      },
      { type: 'h2', text: 'Agree it, do not impose it' },
      {
        type: 'ol',
        items: [
          'Talk about why: safety, not checking up.',
          'Agree when sharing is on (journeys, late nights) and when it is off.',
          'Agree what each person will and will not do with it: no surprise questions about where someone was, no sharing with others.',
          'Make it two-way where it makes sense; parents can share their location too.',
          'Review it as children grow. What suits a 12-year-old does not suit an 18-year-old.',
        ],
      },
      { type: 'h2', text: 'With teenagers and young adults' },
      {
        type: 'p',
        text: 'Secret tracking tends to backfire: when teenagers find out, trust drops and they find ways around it. Open, agreed sharing for journeys, plus a promise that they can call you from anywhere without getting into trouble, keeps them safer than constant monitoring. For college students, sharing [live location](/blog/live-location-safety) for specific trips is usually enough.',
      },
      { type: 'h2', text: 'Privacy settings to get right' },
      {
        type: 'ul',
        items: [
          'Prefer time-limited sharing over permanent sharing.',
          'Check who else can see the location in each app.',
          'Turn off location on social media posts for the whole family.',
          'Go through the [location privacy checklist](/blog/location-privacy-checklist) together.',
        ],
      },
      { type: 'h2', text: 'When to stop sharing' },
      {
        type: 'ul',
        items: [
          'When the journey or reason has ended.',
          'When a child becomes an adult and asks you to.',
          'After a relationship ends; switch off all sharing set up together.',
          'If sharing is being used to control someone. Monitoring a partner without consent can be a form of abuse; see [is someone tracking you?](/blog/someone-tracking-me-online).',
        ],
      },
      { type: 'h2', text: 'Build it into the family plan' },
      {
        type: 'p',
        text: 'Make location sharing one part of a [family emergency plan](/blog/family-emergency-plan) that also covers contacts, meeting places and what each person should do.',
      },
      {
        type: 'callout',
        tone: 'info',
        title: 'How Sabhijude does it',
        text: 'Live location sharing on Sabhijude always has a timer (1, 4, 8 or 24 hours) or runs until you stop it, each person gets their own link, and you can see who opened it. SOS alerts go to the trusted contacts you choose.',
      },
    ],
    faqs: [
      {
        question: 'Should parents track their teenager’s location?',
        answer:
          'Open, agreed location sharing for journeys and late nights usually works better than secret or constant tracking, which damages trust. Agree why, when and how it is used, and review it as your child grows.',
      },
    ],
  },

  /* ---------------------------------------------------------------- family member harassed */
  {
    slug: 'help-family-member-harassment',
    title: 'How parents can help when a child is harassed online',
    seoTitle: 'How Parents Can Respond to Online Harassment',
    description:
      'Your child, sibling or parent is being harassed or bullied online. How to respond in the first conversation, what to do practically, and when to involve the school or police.',
    seoDescription:
      'What to do when your child or a family member is harassed online: the first conversation, saving evidence, reporting to apps, the school or police, and support.',
    category: 'family-safety',
    tags: ['Parents', 'Online harassment', 'Cyberbullying', 'Family'],
    keywords: ['how parents can respond to online harassment', 'parents respond to cyberbullying', 'help a family member experiencing harassment', 'how parents can recognize cyberbullying'],
    authorId: 'editorial',
    status: 'published',
    publishedAt: '2026-11-25',
    updatedAt: '2026-11-25',
    related: ['cyberbullying-india', 'children-online-safety-parents', 'how-to-support-someone-being-harassed', 'how-to-preserve-digital-evidence'],
    sources: [NCRP, ERSS, { title: 'Tele MANAS (14416)', publisher: 'Ministry of Health and Family Welfare', url: 'https://telemanas.mohfw.gov.in/' }],
    accent: 'coral',
    art: 'With you',
    body: [
      {
        type: 'p',
        text: 'When a child, teenager or any family member tells you they are being harassed online, your first reaction shapes whether they keep telling you. Stay calm, stay on their side, and take the practical steps together.',
      },
      { type: 'h2', text: 'Signs to notice' },
      {
        type: 'ul',
        items: [
          'Becoming upset, withdrawn or anxious after using their phone.',
          'Avoiding school, friends or activities they used to enjoy.',
          'Deleting accounts, or suddenly being secretive about devices.',
          'Changes in sleep, appetite or marks.',
        ],
      },
      { type: 'h2', text: 'The first conversation' },
      {
        type: 'ol',
        items: [
          'Listen without interrupting. Thank them for telling you.',
          'Say clearly: “This is not your fault.”',
          'Do not take the phone away as a punishment; it teaches them not to tell you next time.',
          'Ask what they want to happen, and agree next steps together.',
        ],
      },
      { type: 'h2', text: 'Practical steps' },
      {
        type: 'ul',
        items: [
          'Help them save evidence before blocking: screenshots with names and dates. See [how to preserve digital evidence](/blog/how-to-preserve-digital-evidence). Do not save or forward sexual images of a child; note the details instead.',
          'Block and report the accounts on each app together. See [report vs block](/blog/report-vs-block).',
          'Tighten privacy settings and two-step verification.',
          'If classmates are involved, inform the school in writing and ask what it will do. See [how schools should handle bullying](/blog/school-bullying-reports).',
        ],
      },
      { type: 'h2', text: 'When to involve the police' },
      {
        type: 'p',
        text: 'Threats, sexual messages or images, blackmail, impersonation and stalking can be crimes. Report them at [cybercrime.gov.in](https://cybercrime.gov.in), which has a section for crimes against children, or at a police station, and call **1098** (Childline) for help. If intimate images of a child are involved, read [what to do if someone threatens to leak photos](/blog/someone-threatening-to-leak-photos), which covers Take It Down for under-18s.',
      },
      { type: 'h2', text: 'Looking after them afterwards' },
      {
        type: 'p',
        text: 'Keep checking in for weeks, not days. Encourage time with friends and activities offline. If they seem very low or talk about hurting themselves, get help straight away: a counsellor, Tele MANAS on **14416**, or 112 in an emergency.',
      },
      { type: 'h2', text: 'If the person being harassed is an adult' },
      {
        type: 'p',
        text: 'With an adult family member, offer help rather than taking over: help them save evidence, explain the options, and go with them to report if they want. See [how to support someone who is being harassed](/blog/how-to-support-someone-being-harassed).',
      },
    ],
    faqs: [
      {
        question: 'What should parents do if their child is being cyberbullied?',
        answer:
          'Listen calmly, reassure them it is not their fault, do not take the phone away as punishment, help them save evidence, block and report together, inform the school if classmates are involved, and involve the police for threats, sexual content or blackmail.',
      },
    ],
  },

  /* ---------------------------------------------------------------- unsafe while travelling */
  {
    slug: 'unsafe-while-travelling',
    title: 'Feeling unsafe in an unfamiliar city? Where to get help',
    seoTitle: 'Feeling Unsafe in an Unfamiliar City? Where to Get Help',
    description:
      'You are somewhere new and something feels wrong. Where to go, who to call, how to share your location and how to get help when you do not know the area or language.',
    seoDescription:
      'Feeling unsafe while travelling in India? Where to go, who to call (112, 1363 tourist helpline), how to share your location, and getting help in a new city.',
    category: 'travel-safety',
    tags: ['Travel', 'New city', 'Getting help', 'Tourist helpline'],
    keywords: ['feel unsafe while travelling', 'help in an unfamiliar city', 'tourist helpline India', 'use live location while travelling'],
    authorId: 'editorial',
    status: 'published',
    publishedAt: '2026-11-25',
    updatedAt: '2026-11-25',
    related: ['solo-travel-safety-india', 'what-to-do-if-you-feel-unsafe', 'live-location-safety', 'public-transport-safety'],
    sources: [ERSS, { title: 'Incredible India tourist helpline (1363)', publisher: 'Ministry of Tourism', url: 'https://www.incredibleindia.gov.in/' }, { title: 'Rail Madad (139)', publisher: 'Ministry of Railways', url: 'https://railmadad.indianrailways.gov.in/' }],
    accent: 'ink',
    art: 'Lost?',
    body: [
      {
        type: 'p',
        text: 'Being in an unfamiliar place makes everything harder: you do not know which streets are busy, where the police station is, or sometimes even the language. The good news is that the main sources of help in India work the same everywhere.',
      },
      { type: 'h2', text: 'If you feel in danger right now' },
      {
        type: 'ol',
        items: [
          '**Call 112.** It works across India. Read your location from your map app if you do not know the address.',
          '**Go into a staffed place:** a hotel lobby, hospital, pharmacy, petrol pump, large shop, railway or metro station.',
          '**Share your live location** with someone you trust, and tell them what is happening.',
        ],
      },
      { type: 'h2', text: 'Numbers that work anywhere in India' },
      {
        type: 'table',
        head: ['Number', 'For'],
        rows: [
          ['112', 'Any emergency'],
          ['1363 / 1800-11-1363', 'Tourist helpline: information and help for travellers in distress'],
          ['139', 'Rail Madad: help on trains and at stations'],
          ['181', 'Women Helpline'],
          ['108', 'Ambulance (most states)'],
        ],
      },
      { type: 'h2', text: 'Finding help on the map' },
      {
        type: 'ul',
        items: [
          'Search your map app for the nearest police station, hospital and pharmacy, and save them when you arrive.',
          'Keep your hotel’s address and phone number written down and saved offline.',
          'In a language you do not speak, show the address or the word “police” or “hospital” on your phone; a translation app can help.',
        ],
      },
      { type: 'h2', text: 'Stay connected' },
      {
        type: 'ul',
        items: [
          'Carry a power bank. A dead phone is the most common reason travellers cannot get help.',
          'Share your [live location](/blog/live-location-safety) for journeys in a new place, and check in with someone each evening.',
          'Keep a little cash and a paper card with one emergency contact and your hotel address.',
        ],
      },
      { type: 'h2', text: 'If something goes wrong' },
      {
        type: 'ul',
        items: [
          'Theft or loss of documents: report it at the nearest police station and keep the complaint copy. For a lost phone, see [lost or stolen phone](/blog/lost-or-stolen-phone-india).',
          'Harassment: move to a busy place, ask staff for help, call 112. See [what to do if you feel unsafe](/blog/what-to-do-if-you-feel-unsafe).',
          'Scams aimed at travellers, such as fake taxis or touts: use prepaid or app-booked transport and book stays yourself.',
        ],
      },
      {
        type: 'p',
        text: 'Plan the rest of your trip with [solo travel safety in India](/blog/solo-travel-safety-india) and [public transport safety](/blog/public-transport-safety).',
      },
    ],
    faqs: [
      {
        question: 'What is the tourist helpline number in India?',
        answer: 'The Ministry of Tourism’s tourist helpline is 1363, or toll-free 1800-11-1363. For emergencies anywhere in India, call 112.',
      },
      {
        question: 'Where should I go if I feel unsafe in a new city?',
        answer:
          'Go into a staffed place such as a hotel lobby, hospital, pharmacy, petrol pump or station, share your live location with someone you trust, and call 112 if you feel in danger.',
      },
    ],
  },

  /* ---------------------------------------------------------------- business pillar */
  {
    slug: 'business-safety-guide',
    title: 'Business safety: a complete guide for small businesses',
    seoTitle: 'Business Safety: A Complete Guide for Small Businesses',
    description:
      'Staff safety, customer safety, emergencies, harassment, cyber safety and incident reporting for shops, restaurants, clinics, offices and service businesses in India.',
    seoDescription:
      'A complete safety guide for small businesses in India: staff and customer safety, emergencies, harassment, cyber safety, incident reporting and policies.',
    category: 'business-safety',
    tags: ['Small business', 'Employee safety', 'Customer safety', 'Pillar guide'],
    keywords: ['business safety', 'small business safety checklist', 'employee safety', 'customer safety', 'business security'],
    authorId: 'editorial',
    status: 'published',
    publishedAt: '2026-11-25',
    updatedAt: '2026-11-25',
    related: ['business-risk-assessment', 'retail-store-safety', 'restaurant-cafe-safety', 'customer-harassment-response'],
    sources: [NDMA, SHE, { title: 'Indian Computer Emergency Response Team (CERT-In)', publisher: 'Ministry of Electronics and Information Technology', url: 'https://www.cert-in.org.in/' }],
    accent: 'coral',
    art: 'Shop safe',
    body: [
      {
        type: 'p',
        text: 'Small businesses rarely have a safety team, so the owner is the safety team. This guide covers the essentials in plain terms. Check the fire safety, licensing, labour and local rules that apply to your type of business and state.',
      },
      { type: 'h2', text: '1. Emergencies' },
      {
        type: 'p',
        text: 'Write a one-page plan: who is in charge, two exits and a meeting point, where the extinguisher, first-aid kit and main switches are, and what to do in a fire, medical emergency, theft or gas leak. Use our [small business emergency plan](/blog/business-emergency-plan) template.',
      },
      { type: 'h2', text: '2. Staff safety' },
      {
        type: 'ul',
        items: [
          'Avoid lone opening and closing, especially late at night.',
          'Safe ways home for staff working late; see [night-shift employee safety](/blog/night-shift-employee-safety).',
          'Training on lifting, equipment, chemicals and hot surfaces relevant to your work.',
          'Emergency contacts for every staff member.',
        ],
      },
      { type: 'h2', text: '3. Customer safety' },
      {
        type: 'ul',
        items: [
          'Clear walkways and exits, non-slip floors, safe stairs and lighting.',
          'Food hygiene and allergy information in food businesses.',
          'First aid available and someone trained to give it.',
          'A way for customers to raise a concern, and a log of incidents.',
        ],
      },
      { type: 'h2', text: '4. Harassment' },
      {
        type: 'p',
        text: 'Staff should never have to put up with harassment from colleagues or customers. Businesses with ten or more workers must have an Internal Committee under the POSH Act; smaller ones are covered by the district Local Committee, and complaints can be filed on SHe-Box. See [customer harassment: how businesses should respond](/blog/customer-harassment-response) and [how to report workplace sexual harassment](/blog/workplace-harassment-posh).',
      },
      { type: 'h2', text: '5. Theft and security' },
      {
        type: 'ul',
        items: [
          'Good lighting, working locks, and CCTV covering entrances and tills, with signs.',
          'Limit cash on the premises; bank regularly at varied times.',
          'A clear rule: staff never resist a robbery.',
        ],
      },
      { type: 'h2', text: '6. Cyber safety' },
      {
        type: 'ul',
        items: [
          'Separate accounts for each staff member, strong passwords and two-step verification.',
          'Verify any change in a supplier’s bank details by phone.',
          'Train staff to spot fake payment screenshots, refund scams and phishing. See [how to recognise a phishing message](/blog/phishing-explained).',
          'Back up important records regularly.',
        ],
      },
      { type: 'h2', text: '7. Incident reporting' },
      {
        type: 'p',
        text: 'Write down every accident, near miss, theft, complaint and harassment report: what happened, when, who was involved and what you did. Patterns help you fix problems before they get worse, and records protect you if questions are asked later.',
      },
      {
        type: 'callout',
        tone: 'success',
        title: 'The 10-minute owner check',
        text: 'Extinguisher serviced? First-aid kit stocked? Exits clear? Staff emergency contacts up to date? Everyone knows the one-page plan?',
      },
    ],
    faqs: [
      {
        question: 'What safety measures should a small business have?',
        answer:
          'A one-page emergency plan, fire extinguisher and first-aid kit, clear exits, safe opening and closing routines, a policy against harassment with access to a POSH committee, basic cyber security, and a simple log of incidents.',
      },
    ],
  },

  /* ---------------------------------------------------------------- customer harassment */
  {
    slug: 'customer-harassment-response',
    title: 'Customer harassment: how businesses should respond',
    seoTitle: 'Customer Harassment: How Businesses Should Respond',
    description:
      'When customers abuse, threaten or sexually harass your staff: a clear policy, what staff should do in the moment, how managers back them up, and when to call the police.',
    seoDescription:
      'Protect staff from abusive or harassing customers: a clear policy, what to do in the moment, how managers should back staff up, records and when to call police.',
    category: 'business-safety',
    tags: ['Customer harassment', 'Staff safety', 'Retail', 'Hospitality'],
    keywords: ['customer harassment', 'protect staff from abusive customers', 'customer incident management', 'harassment of employees by customers'],
    authorId: 'editorial',
    status: 'published',
    publishedAt: '2026-11-25',
    updatedAt: '2026-11-25',
    related: ['business-safety-guide', 'workplace-harassment-posh', 'harassed-in-public-what-to-do', 'business-emergency-plan'],
    sources: [SHE, ERSS, WHL],
    accent: 'red',
    art: 'Not okay',
    body: [
      {
        type: 'p',
        text: 'Shop assistants, waiters, delivery staff, nurses, receptionists and call-centre agents often face abuse from the public. “The customer is always right” does not extend to threats, slurs, groping or stalking. Staff stay, and perform better, when they know the business will back them.',
      },
      { type: 'h2', text: '1. Write a clear policy' },
      {
        type: 'ul',
        items: [
          'Abuse, threats, discrimination and sexual harassment of staff by anyone will not be tolerated.',
          'Staff may end an interaction, step away, or refuse service when they are abused.',
          'Every incident should be reported, and the business will support the staff member.',
          'Display a short version for customers where appropriate.',
        ],
      },
      { type: 'h2', text: '2. What staff should do in the moment' },
      {
        type: 'ol',
        items: [
          'Stay calm, keep a counter or distance between you, and do not argue.',
          'Set a clear limit: “I will help you, but I will not be spoken to like that.”',
          'Call a colleague or manager, using an agreed code word if needed.',
          'Leave the interaction if it continues; never stay alone with a threatening customer.',
          'Call 112 if there is a threat, violence or the person will not leave.',
        ],
      },
      { type: 'h2', text: '3. What managers should do' },
      {
        type: 'ul',
        items: [
          'Take over the interaction and back the staff member publicly.',
          'Ask the customer to leave or refuse service where needed.',
          'Check on the staff member afterwards; offer a break and time to recover.',
          'Record the incident: date, time, what was said or done, witnesses, CCTV.',
          'Ban repeat offenders and share their description with the team.',
        ],
      },
      { type: 'h2', text: 'Sexual harassment by customers' },
      {
        type: 'p',
        text: 'The POSH Act covers sexual harassment of women at the workplace, including by people who are not employees, such as customers or clients. A woman can complain to the Internal Committee (or the Local Committee for small businesses, or on SHe-Box), and the employer should help her report to the police if she chooses to. See [how to report workplace sexual harassment](/blog/workplace-harassment-posh).',
      },
      { type: 'h2', text: 'Delivery and field staff' },
      {
        type: 'p',
        text: 'Staff who work at customers’ homes or on the road need a way to call for help with their location, a rule that they can leave any unsafe situation, and a manager who answers. See the [business safety guide](/blog/business-safety-guide) and the [small business emergency plan](/blog/business-emergency-plan).',
      },
    ],
    faqs: [
      {
        question: 'Does the POSH Act cover harassment by customers?',
        answer:
          'Yes. The POSH Act covers sexual harassment of women at the workplace, including by people who are not employees such as customers or clients. Complaints go to the Internal Committee or the Local Committee, or can be filed on SHe-Box.',
      },
      {
        question: 'Can staff refuse service to an abusive customer?',
        answer:
          'A good policy lets staff end the interaction, step away and call a manager when they are abused, and lets managers refuse service. Call 112 if there are threats or violence.',
      },
    ],
  },

  /* ---------------------------------------------------------------- digital privacy pillar */
  {
    slug: 'digital-privacy-guide',
    title: 'Digital privacy: a complete guide for Indians',
    seoTitle: 'Digital Privacy: A Complete Guide for Indians',
    description:
      'What personal data is, who collects it, your rights under India’s data protection law, and practical steps to protect your privacy on your phone, apps and social media.',
    seoDescription:
      'A complete digital privacy guide for India: your rights under the DPDP Act, protecting personal information online, and app and social media settings to check.',
    category: 'digital-privacy',
    tags: ['Digital privacy', 'DPDP Act', 'Personal data', 'Pillar guide'],
    keywords: ['digital privacy', 'protect personal information online', 'DPDP Act', 'online privacy India', 'how to protect your identity online'],
    authorId: 'editorial',
    status: 'published',
    publishedAt: '2026-11-25',
    updatedAt: '2026-11-25',
    related: ['digital-footprint', 'social-media-privacy-settings', 'location-privacy-checklist', 'doxxing-what-to-do'],
    sources: [DPDP, { title: 'Indian Computer Emergency Response Team (CERT-In)', publisher: 'Ministry of Electronics and Information Technology', url: 'https://www.cert-in.org.in/' }],
    accent: 'ink',
    art: 'Mine',
    body: [
      {
        type: 'p',
        text: '**Digital privacy** means having control over your personal information online: who has it, what they do with it, and who can see it. It matters for safety as much as for marketing. The more of your life that is public, the easier it is for scammers, stalkers and harassers to use it.',
      },
      { type: 'h2', text: 'What counts as personal data' },
      {
        type: 'p',
        text: 'Your name, phone number, email, address, photos, location, ID numbers such as Aadhaar and PAN, financial details, health information, contacts and even your browsing and app activity can all identify you or reveal things about you.',
      },
      { type: 'h2', text: 'Your rights under India’s data protection law' },
      {
        type: 'p',
        text: 'The Digital Personal Data Protection Act, 2023 sets rules for organisations that collect personal data, including asking for clear consent for specified purposes, keeping data secure and reporting breaches. It gives individuals rights such as getting information about how their data is used, correcting and erasing it, withdrawing consent, having grievances addressed, and nominating someone to act for them. The Digital Personal Data Protection Rules, 2025 were notified in November 2025 and are being brought into force in phases, with most obligations on organisations applying from 2027.',
      },
      {
        type: 'callout',
        tone: 'info',
        title: 'Real example: a phased rollout',
        text: 'When the government notified the DPDP Rules on 14 November 2025, it set the Data Protection Board up immediately and gave organisations a staged timeline of up to 18 months to put consent notices and other processes in place.',
      },
      { type: 'h2', text: 'Practical steps that matter most' },
      {
        type: 'ol',
        items: [
          '**Lock your accounts:** unique passwords and two-step verification. See [strong passwords](/blog/strong-passwords-two-step-verification).',
          '**Tighten social media:** private profiles, hidden friends lists, no phone number or address in public. See [social media privacy settings](/blog/social-media-privacy-settings).',
          '**Control your location:** app permissions, sharing and photo location data. See the [location privacy checklist](/blog/location-privacy-checklist).',
          '**Share ID carefully:** give a masked Aadhaar where accepted, and never post photos of ID cards, boarding passes or cheques.',
          '**Review app permissions** for contacts, photos, microphone and accessibility, and remove apps you do not use.',
          '**Think before you post** routines, children’s schools and your home’s location.',
        ],
      },
      { type: 'h2', text: 'If your information is already out there' },
      {
        type: 'ul',
        items: [
          'Ask websites and platforms to remove it, and ask Google to remove search results showing your contact details. See [doxxing: what to do](/blog/doxxing-what-to-do).',
          'If an account using your identity appears, see [how to report a fake profile](/blog/how-to-report-fake-profile).',
          'If your data was exposed in a breach, change the affected passwords and watch for phishing.',
        ],
      },
      {
        type: 'p',
        text: 'For the wider picture of staying safe online, see the [cyber safety guide](/blog/cyber-safety-guide).',
      },
    ],
    faqs: [
      {
        question: 'What rights do I have over my personal data in India?',
        answer:
          'Under the Digital Personal Data Protection Act, 2023, individuals have rights such as getting information about how their data is used, correcting and erasing it, withdrawing consent, grievance redressal and nominating someone to act for them. The rules are being brought into force in phases from November 2025.',
      },
      {
        question: 'How can I protect my personal information online?',
        answer:
          'Use unique passwords with two-step verification, make social profiles private, keep your phone number and address off public pages, control location sharing, share ID documents carefully, and review app permissions.',
      },
    ],
  },

  /* ---------------------------------------------------------------- organisation framework */
  {
    slug: 'organization-safety-framework',
    title: 'Organisation safety framework: policies, reporting, response',
    seoTitle: 'Organisation Safety Framework: Policies, Reporting, Response',
    description:
      'A practical framework for institutions, companies and NGOs: governance, policies, reporting channels, incident management, emergencies, training and review.',
    seoDescription:
      'A practical safety framework for organisations in India: governance, policies, reporting channels, incident management, emergencies, training and review.',
    category: 'organization-safety',
    tags: ['Organisations', 'Safety governance', 'Framework', 'Institutions'],
    keywords: ['organization safety', 'safety governance', 'organizational safety framework', 'safety management', 'safety culture'],
    authorId: 'editorial',
    status: 'published',
    publishedAt: '2026-11-25',
    updatedAt: '2026-11-25',
    related: ['safety-committee-guide', 'incident-management-guide', 'ngo-safety-guide', 'company-anonymous-reporting'],
    sources: [SHE, NDMA, { title: 'University Grants Commission', publisher: 'Government of India', url: 'https://www.ugc.gov.in/' }],
    accent: 'blue',
    art: 'Framework',
    body: [
      {
        type: 'p',
        text: 'Whether you run a company, a college, a hospital or an NGO, safety comes down to the same building blocks. This framework sets them out in order, so you can see what you have, what is missing, and what to do next.',
      },
      { type: 'h2', text: '1. Governance: who owns safety' },
      {
        type: 'ul',
        items: [
          'A named senior leader accountable for safety.',
          'A safety committee that meets regularly, with members from different teams and levels.',
          'The statutory committees that apply to you: an Internal Committee under the POSH Act for ten or more workers; an Internal Complaints Committee and anti-ragging committee in higher education; child protection arrangements where you work with children.',
        ],
      },
      { type: 'h2', text: '2. Policies' },
      {
        type: 'ul',
        items: [
          'Code of conduct and anti-harassment policy.',
          'Emergency response plan.',
          'Child or vulnerable-adult safeguarding policy, if relevant.',
          'Data protection and digital safety policy.',
          'Whistle-blower or speak-up policy, with protection from retaliation.',
        ],
      },
      { type: 'h2', text: '3. Reporting channels' },
      {
        type: 'p',
        text: 'Several ways to report, an anonymous option, quick acknowledgement and routing to the right body. See [how companies can build a safe, anonymous reporting channel](/blog/company-anonymous-reporting) and, for education, [how colleges can build a safety reporting system](/blog/college-safety-reporting-system).',
      },
      { type: 'h2', text: '4. Incident management' },
      {
        type: 'ol',
        items: [
          'Log every report with a reference number.',
          'Triage: immediate danger first.',
          'Investigate fairly; protect both the reporter and the person accused until findings are made.',
          'Decide and act, with records of reasons.',
          'Tell the reporter the outcome as far as privacy allows.',
          'Look for patterns across incidents each quarter.',
        ],
      },
      { type: 'h2', text: '5. Emergencies' },
      {
        type: 'p',
        text: 'A written plan with roles, alerting, evacuation and communication, drilled regularly. See the [corporate emergency response plan](/blog/corporate-emergency-response-plan) template, which adapts to most organisations.',
      },
      { type: 'h2', text: '6. Training' },
      {
        type: 'ul',
        items: [
          'Induction for everyone: policies, how to report, emergency basics.',
          'Specialist training for committee members, managers, wardens and first-aiders.',
          'Short refreshers every year, and after policy changes.',
        ],
      },
      { type: 'h2', text: '7. Review and improve' },
      {
        type: 'p',
        text: 'Each year, review incidents, drills, audits and feedback; update policies; and report a short summary to leadership and members. The best measure of a safe organisation is not zero reports, but people feeling safe to report.',
      },
      {
        type: 'callout',
        tone: 'info',
        title: 'Where Sabhijude fits',
        text: 'Organisations on Sabhijude can receive incident reports from members and send safety broadcasts. Members control what they share in their permissions, and their SOS alerts are never shared with the organisation.',
      },
    ],
    faqs: [
      {
        question: 'What should an organisation safety framework include?',
        answer:
          'Clear ownership and a safety committee, the statutory committees that apply, written policies, several reporting channels including anonymous ones, an incident management process, an emergency plan with drills, training, and an annual review.',
      },
    ],
  },

  /* ---------------------------------------------------------------- HR complaint handling */
  {
    slug: 'hr-complaint-handling',
    title: 'How HR should handle harassment complaints',
    seoTitle: 'How HR Should Handle Harassment Complaints',
    description:
      'From first contact to closure: how HR and the Internal Committee should receive, investigate and resolve harassment complaints fairly, confidentially and on time.',
    seoDescription:
      'How HR and the Internal Committee should handle harassment complaints in India: first contact, POSH timelines, fair inquiry, interim relief and confidentiality.',
    category: 'workplace-safety',
    tags: ['HR', 'POSH', 'Internal Committee', 'Complaints'],
    keywords: ['HR complaint handling', 'POSH inquiry process', 'employee complaint management', 'how companies should handle safety complaints'],
    authorId: 'editorial',
    status: 'published',
    publishedAt: '2026-11-25',
    updatedAt: '2026-11-25',
    related: ['workplace-harassment-posh', 'company-anonymous-reporting', 'organization-safety-framework', 'how-to-support-someone-being-harassed'],
    sources: [SHE, { title: 'Ministry of Women and Child Development (POSH Act, 2013)', publisher: 'Government of India', url: 'https://wcd.gov.in/' }],
    accent: 'ink',
    art: 'Fair',
    body: [
      {
        type: 'p',
        text: 'How the first complaint is handled decides whether anyone else comes forward. A fair, confidential, timely process protects the complainant, gives the person accused a proper hearing, and protects the organisation.',
      },
      { type: 'h2', text: 'The first conversation' },
      {
        type: 'ul',
        items: [
          'Listen, without judging or minimising. Thank them for coming forward.',
          'Explain the options and the process, including that sexual harassment complaints go to the Internal Committee.',
          'Ask about immediate safety and any interim needs.',
          'Explain confidentiality, and who will need to know.',
          'Do not promise an outcome; promise a fair process.',
        ],
      },
      { type: 'h2', text: 'Sexual harassment: the POSH process' },
      {
        type: 'ul',
        items: [
          'The **Internal Committee** must be led by a senior woman employee, have at least half women members, and include an external member from an NGO or a person familiar with the issues.',
          'Complaints are normally made in writing within three months of the incident; the committee can extend this by up to three months. Members should help a complainant put it in writing.',
          'Conciliation can be tried only if the complainant asks, and not on the basis of a monetary settlement.',
          'The inquiry should be completed within **90 days**, giving both sides a fair hearing.',
          'The employer should act on the committee’s recommendations within **60 days** of receiving the report.',
          'During the inquiry, the complainant can ask for interim relief such as a transfer or leave.',
          'Identities and details must be kept confidential.',
        ],
      },
      {
        type: 'p',
        text: 'Complainants can also file on the government’s SHe-Box portal. For the employee’s view of the process, see [how to report workplace sexual harassment](/blog/workplace-harassment-posh).',
      },
      { type: 'h2', text: 'Other complaints (bullying, discrimination, safety)' },
      {
        type: 'ol',
        items: [
          'Acknowledge in writing within a day or two.',
          'Appoint an investigator with no conflict of interest.',
          'Interview the complainant, the person accused and witnesses; collect documents and messages.',
          'Reach findings on the balance of evidence, and record the reasons.',
          'Decide on action, communicate the outcome, and follow up after a month.',
        ],
      },
      { type: 'h2', text: 'Mistakes to avoid' },
      {
        type: 'ul',
        items: [
          'Moving the complainant instead of the person accused, without their agreement.',
          'Treating a senior or high-performing employee differently.',
          'Leaking details, even informally.',
          'Letting the complainant face retaliation from colleagues.',
          'Closing a complaint without telling the complainant.',
        ],
      },
      { type: 'h2', text: 'Build the system' },
      {
        type: 'p',
        text: 'Complaint handling works best inside a wider system: a trusted reporting channel and an organisation-wide approach. See [anonymous reporting channels for companies](/blog/company-anonymous-reporting) and the [organisation safety framework](/blog/organization-safety-framework).',
      },
    ],
    faqs: [
      {
        question: 'How long does a POSH inquiry take?',
        answer:
          'Under the POSH Act, the Internal Committee should complete its inquiry within 90 days, and the employer should act on its recommendations within 60 days of receiving the report.',
      },
      {
        question: 'Who should be on the Internal Committee?',
        answer:
          'A presiding officer who is a senior woman employee, at least two employee members, and one external member from an NGO or a person familiar with the issues, with at least half the members being women.',
      },
    ],
  },
];
