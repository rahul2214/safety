import type { BlogPost, Source } from '../types';

/**
 * Phase 2/3 batch 4: employee cyber safety, NGO safety, NGO child safeguarding, corporate travel,
 * safety committees, smartphone security, blood donation drives, regular donors. Checked 2026-11-25:
 * - CERT-In directions of 28 April 2022 (s.70B(6) IT Act): listed cyber incidents must be
 *   reported to CERT-In within 6 hours of noticing them; in force from 27 June 2022.
 * - POCSO Act, 2012: mandatory reporting of child sexual abuse.
 * - National Voluntary Blood Donation Day is 1 October; World Blood Donor Day is 14 June.
 * - Blood donation camps are run with a licensed blood centre; donors are never paid.
 */

const ERSS: Source = { title: 'Emergency Response Support System (112)', publisher: 'Ministry of Home Affairs', url: 'https://112.gov.in/' };
const NCRP: Source = { title: 'National Cyber Crime Reporting Portal (cybercrime.gov.in)', publisher: 'Ministry of Home Affairs', url: 'https://cybercrime.gov.in/' };
const CERTIN: Source = { title: 'Indian Computer Emergency Response Team (CERT-In)', publisher: 'Ministry of Electronics and Information Technology', url: 'https://www.cert-in.org.in/' };
const NCPCR: Source = { title: 'National Commission for Protection of Child Rights', publisher: 'Government of India', url: 'https://ncpcr.gov.in/' };
const NBTC: Source = { title: 'National Blood Transfusion Council (NBTC)', publisher: 'Ministry of Health and Family Welfare', url: 'https://nbtc.naco.gov.in/' };
const ERAKT: Source = { title: 'e-RaktKosh', publisher: 'Ministry of Health and Family Welfare', url: 'https://eraktkosh.mohfw.gov.in/' };
const SHE: Source = { title: 'SHe-Box', publisher: 'Ministry of Women and Child Development', url: 'https://shebox.wcd.gov.in/' };
const MOT: Source = { title: 'Incredible India tourist helpline (1363)', publisher: 'Ministry of Tourism', url: 'https://www.incredibleindia.gov.in/' };

export const PHASE2_BATCH4_POSTS: BlogPost[] = [
  /* ---------------------------------------------------------------- employee cyber safety */
  {
    slug: 'employee-cyber-safety',
    title: 'Cyber safety for employees: protecting you and the company',
    seoTitle: 'Cyber Safety for Employees: Protect You and Your Company',
    description:
      'The everyday habits that stop most attacks at work: passwords, phishing, payment fraud, devices, data handling, and reporting incidents fast.',
    seoDescription:
      'Cyber safety for employees in India: strong logins, spotting phishing and fake payment requests, safe devices and data, and why fast incident reporting matters.',
    category: 'corporate-safety',
    tags: ['Employees', 'Cyber security', 'Phishing', 'Data protection'],
    keywords: ['cyber safety for employees', 'workplace cybersecurity awareness', 'protect company data', 'insider threat awareness', 'employee digital safety'],
    authorId: 'editorial',
    status: 'published',
    publishedAt: '2026-11-25',
    updatedAt: '2026-11-25',
    related: ['phishing-explained', 'social-engineering', 'strong-passwords-two-step-verification', 'cyber-safety-guide'],
    sources: [CERTIN, NCRP, { title: 'CERT-In Directions of 28 April 2022 on incident reporting (analysis)', publisher: 'Khaitan & Co', url: 'https://khaitanco.com/sites/default/files/2022-04/Ergo_30042022.pdf' }],
    accent: 'blue',
    art: 'Secure',
    body: [
      {
        type: 'p',
        text: 'Most cyber incidents at work start with a person, not a computer: a reused password, a convincing email, an urgent request to pay a “new” supplier account. That makes every employee part of the company’s defence, and a few habits cover most of the risk.',
      },
      { type: 'h2', text: '1. Logins' },
      {
        type: 'ul',
        items: [
          'A unique password for work accounts, never reused on personal sites.',
          'Two-step verification everywhere it is offered; approve only sign-in prompts you started yourself.',
          'Lock your screen when you step away.',
        ],
      },
      { type: 'h2', text: '2. Phishing and payment fraud' },
      {
        type: 'ul',
        items: [
          'Be suspicious of urgency, secrecy and requests to bypass the usual process.',
          'Verify any change to a supplier’s or employee’s bank details by phone on a known number.',
          'Never buy gift cards or make transfers because a “senior” asked by message.',
          'Report suspicious emails to IT rather than just deleting them.',
        ],
      },
      {
        type: 'p',
        text: 'See [how to recognise a phishing message](/blog/phishing-explained) and [social engineering](/blog/social-engineering).',
      },
      { type: 'h2', text: '3. Devices' },
      {
        type: 'ul',
        items: [
          'Install updates promptly; use only approved software.',
          'Do not plug unknown USB drives into work devices.',
          'Avoid public Wi-Fi for work, or use the company VPN.',
          'Report a lost laptop or phone immediately, even if you think you will find it.',
        ],
      },
      { type: 'h2', text: '4. Handling data' },
      {
        type: 'ul',
        items: [
          'Share customer and employee data only with people who need it, through approved tools.',
          'Do not forward work documents to personal email or messaging apps.',
          'Under India’s data protection law, organisations must protect personal data and report breaches; careless handling by one person can put the whole company at risk.',
        ],
      },
      { type: 'h2', text: '5. Report fast' },
      {
        type: 'p',
        text: 'If you clicked a link, entered a password or sent money by mistake, tell IT straight away. Speed matters for containing the damage, and for the company’s legal obligations.',
      },
      {
        type: 'callout',
        tone: 'info',
        title: 'Real rule: six hours',
        text: 'Under directions issued by CERT-In on 28 April 2022, companies, service providers and government bodies must report specified types of cyber incidents to CERT-In within six hours of noticing them. That only works if employees raise the alarm immediately, without fear of blame.',
      },
      {
        type: 'p',
        text: 'For your personal accounts too, see [strong passwords and two-step verification](/blog/strong-passwords-two-step-verification) and the [cyber safety guide](/blog/cyber-safety-guide).',
      },
    ],
    faqs: [
      {
        question: 'What are the most important cyber safety habits for employees?',
        answer:
          'Unique passwords with two-step verification, checking any payment or bank-detail change by phone, reporting suspicious emails, keeping devices updated, handling data only through approved tools, and reporting mistakes to IT immediately.',
      },
      {
        question: 'How quickly must companies in India report cyber incidents?',
        answer:
          'Under CERT-In’s directions of 28 April 2022, covered organisations must report specified cyber incidents to CERT-In within six hours of noticing them.',
      },
    ],
  },

  /* ---------------------------------------------------------------- NGO safety */
  {
    slug: 'ngo-safety-guide',
    title: 'NGO safety: staff, volunteer and field worker safety',
    seoTitle: 'NGO Safety: Staff, Volunteer and Field Worker Safety',
    description:
      'A practical guide for NGOs in India: keeping staff and volunteers safe in the field, travel, emergencies, harassment, data and safeguarding the people you serve.',
    seoDescription:
      'Safety for NGOs in India: field visits and travel, volunteer emergency contacts, harassment and POSH, data privacy, and safeguarding the people you serve.',
    category: 'organization-safety',
    tags: ['NGOs', 'Volunteers', 'Field workers', 'Safeguarding'],
    keywords: ['NGO safety', 'volunteer safety', 'NGO field visit safety', 'NGO safety policy checklist', 'field worker safety'],
    authorId: 'editorial',
    status: 'published',
    publishedAt: '2026-11-25',
    updatedAt: '2026-11-25',
    related: ['ngo-child-safeguarding', 'organization-safety-framework', 'incident-management-guide', 'workplace-harassment-posh'],
    sources: [SHE, NCPCR, ERSS],
    accent: 'coral',
    art: 'NGO',
    body: [
      {
        type: 'p',
        text: 'NGO staff and volunteers often work in unfamiliar places, late hours and sensitive situations, with limited budgets for safety. A few clear practices protect them, and the communities they serve.',
      },
      { type: 'h2', text: '1. Field visits' },
      {
        type: 'ul',
        items: [
          'Plan visits in pairs where possible, especially to new areas or homes.',
          'Leave an itinerary with the office: where, who, and expected return time.',
          'Agree check-in times and what happens if someone misses one.',
          'Share live location during the visit with a named colleague.',
          'Give staff the right to leave any situation that feels unsafe, without justification.',
        ],
      },
      { type: 'h2', text: '2. Travel' },
      {
        type: 'p',
        text: 'Use verified transport, avoid travelling after dark in unfamiliar areas, and book stays the organisation has checked. See [solo travel safety in India](/blog/solo-travel-safety-india) and [corporate travel safety](/blog/corporate-travel-safety), which applies equally to NGOs.',
      },
      { type: 'h2', text: '3. Volunteers' },
      {
        type: 'ul',
        items: [
          'Emergency contact and any medical needs for every volunteer.',
          'A short induction on the code of conduct, safeguarding and how to report concerns.',
          'A named staff contact on every volunteer activity.',
          'Clear limits on what volunteers should not do alone, such as home visits to vulnerable people.',
        ],
      },
      { type: 'h2', text: '4. Harassment' },
      {
        type: 'p',
        text: 'The POSH Act applies to NGOs: with ten or more workers you need an Internal Committee, and volunteers and interns are protected too. See [how to report workplace sexual harassment](/blog/workplace-harassment-posh).',
      },
      { type: 'h2', text: '5. Safeguarding the people you serve' },
      {
        type: 'p',
        text: 'If your work involves children or vulnerable adults, you need a written safeguarding policy, trained staff and a clear reporting route. See [child safeguarding for NGOs](/blog/ngo-child-safeguarding).',
      },
      { type: 'h2', text: '6. Data and digital safety' },
      {
        type: 'ul',
        items: [
          'Collect only the beneficiary data you need, and store it securely with limited access.',
          'Never share beneficiaries’ photos or stories without informed consent, and never for children without a guardian’s consent.',
          'Two-step verification on email and shared drives.',
        ],
      },
      { type: 'h2', text: '7. Incidents and review' },
      {
        type: 'p',
        text: 'Log every incident and near miss and review them regularly. See [safety incident management](/blog/incident-management-guide) and the [organisation safety framework](/blog/organization-safety-framework).',
      },
    ],
    faqs: [
      {
        question: 'How can NGOs keep field staff safe?',
        answer:
          'Plan visits in pairs, leave itineraries with the office, agree check-in times, share live location during visits, use verified transport, and give staff the right to leave any unsafe situation.',
      },
      {
        question: 'Does the POSH Act apply to NGOs?',
        answer:
          'Yes. NGOs with ten or more workers must have an Internal Committee, and the Act protects volunteers and interns as well as employees.',
      },
    ],
  },

  /* ---------------------------------------------------------------- NGO child safeguarding */
  {
    slug: 'ngo-child-safeguarding',
    title: 'Child safeguarding for NGOs: policy and reporting',
    seoTitle: 'Child Safeguarding for NGOs: Policy and Reporting',
    description:
      'What a child safeguarding policy must cover, safe recruitment, codes of conduct, photos and data, and how to report concerns under the POCSO Act.',
    seoDescription:
      'A child safeguarding policy for NGOs in India: safe recruitment, code of conduct, photos and data, a designated lead, and reporting concerns under POCSO.',
    category: 'organization-safety',
    tags: ['Child safeguarding', 'NGOs', 'POCSO', 'Policy'],
    keywords: ['child safeguarding policy', 'NGO child safety', 'POCSO reporting', 'safe recruitment', 'NGO incident reporting'],
    authorId: 'editorial',
    status: 'published',
    publishedAt: '2026-11-25',
    updatedAt: '2026-11-25',
    related: ['ngo-safety-guide', 'teach-children-personal-safety', 'school-safety-guide', 'incident-management-guide'],
    sources: [NCPCR, ERSS, NCRP],
    accent: 'blue',
    art: 'Protect',
    body: [
      {
        type: 'p',
        text: 'Any organisation that works with children, whether in education, health, shelters, sports or community programmes, carries a duty to keep them safe from harm by its own staff and volunteers as well as others. A safeguarding policy turns that duty into everyday practice.',
      },
      { type: 'h2', text: 'What the policy should cover' },
      {
        type: 'ol',
        items: [
          '**Commitment:** a clear statement that the organisation does not tolerate harm to children.',
          '**Designated safeguarding lead:** a named, trained person (and a deputy) responsible for concerns.',
          '**Safe recruitment:** reference checks and police verification for staff and volunteers working with children.',
          '**Code of conduct:** no one-to-one contact in private, no private messaging or social media contact, no physical punishment, appropriate language and touch.',
          '**Photos and data:** guardian consent, no identifying details, secure storage.',
          '**Reporting:** how anyone raises a concern, and what happens next.',
          '**Training and review:** induction for everyone, refreshers, and an annual review.',
        ],
      },
      { type: 'h2', text: 'Reporting under the POCSO Act' },
      {
        type: 'p',
        text: 'Under the Protection of Children from Sexual Offences Act, 2012, anyone who knows or suspects that a child has been sexually abused must report it to the police or the Special Juvenile Police Unit. An organisation cannot handle such a concern only internally. Failing to report is itself an offence.',
      },
      {
        type: 'callout',
        tone: 'warn',
        title: 'If a child tells you something',
        text: 'Listen, believe them, do not question them in detail, tell them it is not their fault and that you will get help. Write down what they said in their words, inform the safeguarding lead immediately, and report to the police. In an emergency call 112; Childline is 1098.',
      },
      { type: 'h2', text: 'Online safeguarding' },
      {
        type: 'ul',
        items: [
          'Staff and volunteers use official channels, not personal accounts, to contact children or families.',
          'Children’s images are never shared without consent and never with identifying details.',
          'Child sexual abuse material is reported, never forwarded, at cybercrime.gov.in, which has a section for crimes against children.',
        ],
      },
      { type: 'h2', text: 'Making it work' },
      {
        type: 'p',
        text: 'Display the safeguarding lead’s contact where children and parents will see it, teach children their rights in age-appropriate ways (see [how to teach children personal safety](/blog/teach-children-personal-safety)), and log and review every concern (see [safety incident management](/blog/incident-management-guide)). For the wider organisation, see the [NGO safety guide](/blog/ngo-safety-guide).',
      },
    ],
    faqs: [
      {
        question: 'Do NGOs have to report child abuse to the police?',
        answer:
          'Yes. Under the POCSO Act, 2012, anyone who knows or suspects a child has been sexually abused must report it to the police or the Special Juvenile Police Unit; it cannot be handled only internally.',
      },
      {
        question: 'What should a child safeguarding policy include?',
        answer:
          'A commitment statement, a designated safeguarding lead, safe recruitment, a code of conduct, rules on photos and data, a clear reporting process including POCSO reporting, and regular training and review.',
      },
    ],
  },

  /* ---------------------------------------------------------------- corporate travel */
  {
    slug: 'corporate-travel-safety',
    title: 'Corporate travel safety: a checklist for companies',
    seoTitle: 'Corporate Travel Safety: A Checklist for Companies',
    description:
      'Duty of care for employees on work trips: approved travel and stays, itineraries, check-ins, women travellers, emergencies, and support when something goes wrong.',
    seoDescription:
      'A corporate travel safety checklist: approved travel and hotels, itineraries and check-ins, women travellers, emergency support, and handling incidents.',
    category: 'corporate-safety',
    tags: ['Business travel', 'Employees', 'HR', 'Duty of care'],
    keywords: ['corporate travel safety', 'employee travel safety', 'corporate travel safety checklist', 'business travel safety India'],
    authorId: 'editorial',
    status: 'published',
    publishedAt: '2026-11-25',
    updatedAt: '2026-11-25',
    related: ['travel-emergency-checklist', 'hotel-safety-tips', 'night-shift-employee-safety', 'corporate-emergency-response-plan'],
    sources: [MOT, ERSS],
    accent: 'ink',
    art: 'Trip',
    body: [
      {
        type: 'p',
        text: 'When a company sends someone on a trip, it remains responsible for their safety. A simple travel policy and a 24-hour contact go a long way, and most of it costs very little.',
      },
      { type: 'h2', text: 'Before the trip' },
      {
        type: 'ul',
        items: [
          'Approved airlines, cab services and hotels with good security and 24-hour reception.',
          'Arrival times planned for daylight where possible, with airport or station pickups for late arrivals.',
          'Itinerary recorded with the travel desk or manager.',
          'Emergency contacts and medical information on file.',
          'A short briefing for unfamiliar destinations: local emergency numbers, hospitals, areas to avoid.',
        ],
      },
      { type: 'h2', text: 'During the trip' },
      {
        type: 'ul',
        items: [
          'Agreed check-ins, such as a message on arrival at the hotel each evening.',
          'A 24-hour company number that answers and can act.',
          'Permission for employees to change hotels or transport if they feel unsafe, with costs reimbursed.',
          'Live location sharing for late journeys, with a colleague or family member.',
        ],
      },
      { type: 'h2', text: 'Women travellers' },
      {
        type: 'ul',
        items: [
          'Hotels vetted for safety, and rooms not on the ground floor where possible.',
          'No pressure to attend late, off-site social events or travel alone at night.',
          'Clear access to the Internal Committee for any harassment on the trip; the POSH Act covers places visited during employment, including transport provided by the employer.',
        ],
      },
      { type: 'h2', text: 'When something goes wrong' },
      {
        type: 'ol',
        items: [
          'Employee calls 112 if in danger, then the company’s 24-hour number.',
          'The company coordinates help: transport, a new hotel, medical care, contact with family.',
          'Lost documents or devices are reported to the police and the company; see [lost or stolen phone](/blog/lost-or-stolen-phone-india).',
          'The incident is logged and reviewed.',
        ],
      },
      {
        type: 'p',
        text: 'Share the [travel emergency checklist](/blog/travel-emergency-checklist) and [hotel safety tips](/blog/hotel-safety-tips) with employees, and include travel in your [emergency response plan](/blog/corporate-emergency-response-plan).',
      },
    ],
    faqs: [
      {
        question: 'What should a corporate travel safety policy include?',
        answer:
          'Approved transport and hotels, daylight arrivals or pickups, recorded itineraries, emergency contacts, a 24-hour company number, check-ins, freedom to change arrangements if unsafe, and a process for incidents.',
      },
    ],
  },

  /* ---------------------------------------------------------------- safety committee */
  {
    slug: 'safety-committee-guide',
    title: 'How to set up a safety committee',
    seoTitle: 'How to Set Up a Safety Committee That Works',
    description:
      'Who should be on it, what it does, how often it meets, and how it works alongside the statutory committees your organisation may already need.',
    seoDescription:
      'Set up a workplace or campus safety committee that works: who should be on it, its role, meeting rhythm, and how it fits with POSH and other committees.',
    category: 'organization-safety',
    tags: ['Safety committee', 'Governance', 'Organisations', 'Training'],
    keywords: ['safety committee', 'how to create a safety committee', 'safety training checklist for organizations', 'safety governance'],
    authorId: 'editorial',
    status: 'published',
    publishedAt: '2026-11-25',
    updatedAt: '2026-11-25',
    related: ['organization-safety-framework', 'workplace-safety-culture', 'incident-management-guide', 'hr-complaint-handling'],
    sources: [SHE, { title: 'University Grants Commission', publisher: 'Government of India', url: 'https://www.ugc.gov.in/' }],
    accent: 'blue',
    art: 'Committee',
    body: [
      {
        type: 'p',
        text: 'A safety committee brings together the people who see risks every day and the people who can fix them. It does not replace statutory committees such as the POSH Internal Committee; it looks after safety as a whole.',
      },
      { type: 'h2', text: 'Who should be on it' },
      {
        type: 'ul',
        items: [
          'A senior leader who can approve action and budgets (chair).',
          'Representatives from different teams, shifts and levels, including frontline staff.',
          'Facilities or security, HR, and IT.',
          'In colleges, student representatives and wardens; in schools, parents and teachers.',
          'A balance of women and men, and someone who can represent people with disabilities.',
        ],
      },
      { type: 'h2', text: 'What it does' },
      {
        type: 'ol',
        items: [
          'Reviews incidents, near misses and reports for patterns. See [safety incident management](/blog/incident-management-guide).',
          'Agrees priorities and tracks actions to completion.',
          'Oversees drills, audits and risk assessments.',
          'Plans training and awareness.',
          'Listens to concerns from staff or students and feeds back what changed.',
        ],
      },
      { type: 'h2', text: 'How it works with other committees' },
      {
        type: 'table',
        head: ['Committee', 'Role'],
        rows: [
          ['POSH Internal Committee', 'Handles sexual harassment complaints; confidential; the safety committee does not see case details.'],
          ['Anti-ragging committee (colleges)', 'Handles ragging; can share anonymised trends.'],
          ['Safety committee', 'Looks at safety overall: hazards, emergencies, trends, training.'],
        ],
      },
      { type: 'h2', text: 'Making it effective' },
      {
        type: 'ul',
        items: [
          'Meet regularly, such as monthly or quarterly, with short minutes and an action list.',
          'Rotate frontline members so more voices are heard.',
          'Publish what the committee changed, so people see the point of reporting.',
          'Give it a small budget for quick fixes.',
        ],
      },
      {
        type: 'p',
        text: 'The committee is one building block of the [organisation safety framework](/blog/organization-safety-framework), and a key driver of a [workplace safety culture](/blog/workplace-safety-culture).',
      },
    ],
    faqs: [
      {
        question: 'Who should be on a safety committee?',
        answer:
          'A senior leader as chair, representatives from different teams, shifts and levels including frontline staff, facilities or security, HR and IT, and in education, student or parent representatives.',
      },
    ],
  },

  /* ---------------------------------------------------------------- smartphone security */
  {
    slug: 'smartphone-security-checklist',
    title: 'Smartphone security checklist',
    seoTitle: 'Smartphone Security Checklist: 15 Settings to Check',
    description:
      'Fifteen settings and habits that protect your phone, accounts, photos and money: locks, updates, app permissions, backups, SIM safety and lost-phone readiness.',
    seoDescription:
      'Secure your smartphone in 15 steps: screen lock, updates, app permissions, SIM PIN, backups, safe apps, UPI protection and being ready if your phone is lost.',
    category: 'cyber-safety',
    tags: ['Smartphone', 'Mobile security', 'App permissions', 'Checklist'],
    keywords: ['smartphone security checklist', 'how to secure your smartphone', 'check app permissions', 'mobile privacy', 'protect phone from cyber threats'],
    authorId: 'editorial',
    status: 'published',
    publishedAt: '2026-11-25',
    updatedAt: '2026-11-25',
    related: ['lost-or-stolen-phone-india', 'someone-tracking-me-online', 'location-privacy-checklist', 'strong-passwords-two-step-verification'],
    sources: [CERTIN, { title: 'Sanchar Saathi', publisher: 'Department of Telecommunications', url: 'https://www.sancharsaathi.gov.in/' }],
    accent: 'ink',
    art: '15',
    body: [
      {
        type: 'p',
        text: 'Your phone holds your bank, UPI, email, photos and the OTPs that unlock everything else. Go through this checklist once; it takes about 20 minutes.',
      },
      { type: 'h2', text: 'Lock and update' },
      {
        type: 'ol',
        items: [
          'A strong screen lock (six-digit PIN or more), with fingerprint or face unlock if you like.',
          'Automatic system updates on.',
          'Automatic app updates on.',
          'Lock-screen notifications set to hide message content.',
        ],
      },
      { type: 'h2', text: 'Apps' },
      {
        type: 'ol',
        items: [
          'Install apps only from the official app store; never APK files from messages.',
          'Review permissions: location, camera, microphone, contacts, SMS and accessibility. Remove what an app does not need.',
          'Delete apps you no longer use.',
          'Check for apps with device admin or accessibility access you did not grant; see [is someone tracking you?](/blog/someone-tracking-me-online).',
        ],
      },
      { type: 'h2', text: 'Money and accounts' },
      {
        type: 'ol',
        items: [
          'A separate PIN or biometric lock on banking and UPI apps.',
          'Two-step verification on email and WhatsApp. See [strong passwords and two-step verification](/blog/strong-passwords-two-step-verification).',
          'A SIM PIN, so a stolen SIM cannot be used in another phone.',
        ],
      },
      { type: 'h2', text: 'If it is lost' },
      {
        type: 'ol',
        items: [
          'Find My Device (Android) or Find My (iPhone) turned on.',
          'Your IMEI noted somewhere else (dial *#06#).',
          'Backups of photos and contacts turned on.',
          'Emergency contacts and medical ID filled in, so a finder or responder can reach your family.',
        ],
      },
      {
        type: 'p',
        text: 'If your phone goes missing, follow [what to do if your phone is lost or stolen](/blog/lost-or-stolen-phone-india). For location settings, use the [location privacy checklist](/blog/location-privacy-checklist).',
      },
    ],
    faqs: [
      {
        question: 'How do I secure my smartphone?',
        answer:
          'Use a strong screen lock, keep the system and apps updated, install apps only from the official store, review app permissions, lock banking and UPI apps separately, set a SIM PIN, turn on Find My Device and backups, and note your IMEI.',
      },
    ],
  },

  /* ---------------------------------------------------------------- blood donation drive */
  {
    slug: 'blood-donation-drive',
    title: 'How to organise a blood donation drive',
    seoTitle: 'How to Organise a Blood Donation Drive (Step by Step)',
    description:
      'For colleges, companies, RWAs and NGOs: partnering with a licensed blood centre, planning the day, encouraging first-time donors, and looking after everyone.',
    seoDescription:
      'Organise a blood donation camp at your college, company or community: partner with a licensed blood centre, plan the day, reach donors and look after them.',
    category: 'blood-donation',
    tags: ['Blood donation camp', 'Colleges', 'Companies', 'Organisers'],
    keywords: ['how to organise a blood donation drive', 'blood donation camp', 'organise blood donation camp in college', 'corporate blood donation drive'],
    authorId: 'editorial',
    status: 'published',
    publishedAt: '2026-11-25',
    updatedAt: '2026-11-25',
    related: ['who-can-donate-blood-india', 'first-time-blood-donation-guide', 'blood-donation-myths-and-facts', 'regular-blood-donor'],
    sources: [NBTC, ERAKT],
    accent: 'red',
    art: 'Camp',
    body: [
      {
        type: 'p',
        text: 'A blood donation drive at a college, office or housing society can collect dozens of units in a single day, and turn many first-time donors into regular ones. The medical side is handled by a licensed blood centre; your job is to bring people and make the day go smoothly.',
      },
      { type: 'h2', text: '1. Partner with a licensed blood centre' },
      {
        type: 'p',
        text: 'Contact a government or licensed blood centre (blood bank) near you; you can find them on e-RaktKosh. They bring trained staff, equipment and supplies, screen donors, and take the blood for testing and processing. Agree the date, expected number of donors, space and timings with them first.',
      },
      { type: 'h2', text: '2. Pick the date and place' },
      {
        type: 'ul',
        items: [
          'Choose a weekday when people are around, avoiding exams and holidays.',
          'Consider meaningful dates such as World Blood Donor Day (14 June) or National Voluntary Blood Donation Day (1 October).',
          'You need a clean, well-ventilated hall with space for registration, screening, donation beds, and a rest and refreshment area.',
        ],
      },
      { type: 'h2', text: '3. Reach donors' },
      {
        type: 'ul',
        items: [
          'Announce two to three weeks ahead, with a simple sign-up form.',
          'Share who can donate and what to expect. See [who can donate blood](/blog/who-can-donate-blood-india) and the [first-time donor guide](/blog/first-time-blood-donation-guide).',
          'Address common fears directly. See [blood donation myths and facts](/blog/blood-donation-myths-and-facts).',
          'Send a reminder the day before: eat a normal meal, drink water, carry ID.',
        ],
      },
      { type: 'h2', text: '4. On the day' },
      {
        type: 'ul',
        items: [
          'Volunteers for registration, guiding donors and refreshments.',
          'Snacks and drinks for donors after donating, and a place to rest.',
          'First aid arranged with the blood centre team.',
          'Respect every deferral: some people will be asked to wait, and that is not a failure.',
        ],
      },
      {
        type: 'callout',
        tone: 'warn',
        title: 'Voluntary and unpaid, always',
        text: 'Donors must never be paid or pressured. Appreciation such as a certificate or refreshments is fine; cash or gifts in exchange for blood are not.',
      },
      { type: 'h2', text: '5. After the drive' },
      {
        type: 'p',
        text: 'Thank donors, share the total collected, and invite them to become regular donors. See [how to become a regular blood donor](/blog/regular-blood-donor).',
      },
    ],
    faqs: [
      {
        question: 'How do I organise a blood donation camp?',
        answer:
          'Partner with a licensed blood centre, which handles the medical side, pick a date and a suitable hall, announce it two to three weeks ahead with a sign-up form, arrange volunteers and refreshments, and thank donors afterwards.',
      },
    ],
  },

  /* ---------------------------------------------------------------- regular donor */
  {
    slug: 'regular-blood-donor',
    title: 'How to become a regular blood donor',
    seoTitle: 'How to Become a Regular Blood Donor',
    description:
      'Why regular donors matter, how often you can give, how to stay eligible, and simple ways to make donating a habit, including for students.',
    seoDescription:
      'Become a regular blood donor: why it matters, how often you can donate in India, staying eligible and healthy, and simple ways to make it a habit.',
    category: 'blood-donation',
    tags: ['Regular donors', 'Students', 'Donors'],
    keywords: ['become a blood donor', 'regular blood donor', 'how students can become blood donors', 'how often can you donate blood'],
    authorId: 'editorial',
    status: 'published',
    publishedAt: '2026-11-25',
    updatedAt: '2026-11-25',
    related: ['who-can-donate-blood-india', 'blood-donation-drive', 'how-to-respond-to-urgent-blood-request', 'blood-group-compatibility-explained'],
    sources: [NBTC, ERAKT],
    accent: 'red',
    art: 'Again',
    body: [
      {
        type: 'p',
        text: 'Blood cannot be manufactured, and it has a limited shelf life, so blood banks rely on people who give again and again rather than only in emergencies. Regular voluntary donors are also among the safest donors, because they are screened every time.',
      },
      { type: 'h2', text: 'How often you can give' },
      {
        type: 'p',
        text: 'Under India’s guidelines, the usual minimum gap between whole blood donations is about three months for men and four months for women. Platelet and plasma donations follow different rules. See [who can donate blood in India](/blog/who-can-donate-blood-india).',
      },
      { type: 'h2', text: 'Make it a habit' },
      {
        type: 'ul',
        items: [
          'Book your next donation before you leave the blood bank, or set a calendar reminder for three or four months.',
          'Pair it with dates you will remember, such as your birthday or 1 October, National Voluntary Blood Donation Day.',
          'Donate with a friend or colleague.',
          'Keep your donor card or records; many blood banks keep a donor register and may call you when your group is needed.',
          'Add your blood group to your profile on donor platforms so you see requests near you.',
        ],
      },
      { type: 'h2', text: 'Stay eligible and well' },
      {
        type: 'ul',
        items: [
          'Eat iron-rich food: dal, green leafy vegetables, jaggery, eggs, meat or fish.',
          'Sleep well and drink water before donating; avoid alcohol for a day before.',
          'Tell the blood bank about new medicines, illnesses, tattoos or travel; they will advise on waiting periods.',
        ],
      },
      { type: 'h2', text: 'Students' },
      {
        type: 'p',
        text: 'Once you turn 18 and meet the checks, college camps are an easy start. Volunteer to help organise one, too. See [how to organise a blood donation drive](/blog/blood-donation-drive).',
      },
      { type: 'h2', text: 'Answer requests near you' },
      {
        type: 'p',
        text: 'Between regular donations, you can help when someone nearby needs your group. See [how to respond to an urgent blood request](/blog/how-to-respond-to-urgent-blood-request) and [blood group compatibility](/blog/blood-group-compatibility-explained). On Sabhijude, open requests within about 25 km show under “Near you” on your home screen.',
      },
    ],
    faqs: [
      {
        question: 'How often can I donate blood in India?',
        answer: 'The usual minimum gap between whole blood donations is about three months for men and four months for women. The blood bank confirms eligibility each time.',
      },
      {
        question: 'Why are regular blood donors important?',
        answer:
          'Blood cannot be made and has a limited shelf life, so blood banks need a steady supply. Regular voluntary donors keep stocks up and are among the safest donors because they are screened every time.',
      },
    ],
  },
];
