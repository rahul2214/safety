import type { BlogPost, Source } from '../types';

/**
 * Phase 2, batch 2: community safety and family safety pillars, incident management, workplace
 * safety for women, digital footprint, harassment from a coworker, documenting harassment,
 * teaching children personal safety. Checked 2026-11-25:
 * - Maternity Benefit Act (as amended in 2017, carried into the Code on Social Security, 2020):
 *   26 weeks' paid maternity leave for the first two children; creche facility where 50 or more
 *   employees. POSH Act as in other files.
 * - POCSO Act, 2012: anyone who knows of sexual abuse of a child must report it.
 */

const ERSS: Source = { title: 'Emergency Response Support System (112)', publisher: 'Ministry of Home Affairs', url: 'https://112.gov.in/' };
const NCRP: Source = { title: 'National Cyber Crime Reporting Portal (cybercrime.gov.in)', publisher: 'Ministry of Home Affairs', url: 'https://cybercrime.gov.in/' };
const WHL: Source = { title: 'Women Helpline (181)', publisher: 'Ministry of Women and Child Development (myScheme)', url: 'https://www.myscheme.gov.in/schemes/whl-181' };
const SHE: Source = { title: 'SHe-Box: file a workplace sexual harassment complaint online', publisher: 'Ministry of Women and Child Development', url: 'https://shebox.wcd.gov.in/' };
const NCPCR: Source = { title: 'National Commission for Protection of Child Rights', publisher: 'Government of India', url: 'https://ncpcr.gov.in/' };
const LABOUR: Source = { title: 'Ministry of Labour and Employment (labour codes)', publisher: 'Government of India', url: 'https://labour.gov.in/' };

export const PHASE2_BATCH2_POSTS: BlogPost[] = [
  /* ---------------------------------------------------------------- community pillar */
  {
    slug: 'community-safety-guide',
    title: 'Community safety: how neighbourhoods become safer',
    seoTitle: 'Community Safety: How Neighbourhoods Become Safer',
    description:
      'What makes a neighbourhood, colony or campus safer: people who know each other, safe places, responsible reporting, working with the police, and quick ways to help.',
    seoDescription:
      'How neighbourhoods, colonies and RWAs in India can become safer: knowing neighbours, fixing unsafe places, responsible reporting and working with local police.',
    category: 'community-safety',
    tags: ['Community safety', 'Neighbourhoods', 'RWAs', 'Pillar guide'],
    keywords: ['community safety', 'neighbourhood safety', 'how communities can become safer', 'community reporting', 'RWA safety'],
    authorId: 'editorial',
    status: 'published',
    publishedAt: '2026-11-25',
    updatedAt: '2026-11-25',
    related: ['why-anonymous-reporting-matters', 'what-happens-after-you-report', 'how-to-support-someone-being-harassed', 'emergency-preparedness-checklist'],
    sources: [ERSS, { title: 'National Disaster Management Authority', publisher: 'Government of India', url: 'https://ndma.gov.in/' }],
    accent: 'blue',
    art: 'Together',
    body: [
      {
        type: 'p',
        text: 'Safe neighbourhoods are rarely the ones with the most cameras. They are the ones where people know each other, notice when something is wrong, and know what to do about it. Every resident, RWA, shopkeeper and college can contribute.',
      },
      { type: 'h2', text: '1. Know your neighbours' },
      {
        type: 'ul',
        items: [
          'A building or street group with emergency contacts, kept for safety and practical help, not gossip.',
          'A list of residents who might need help in an emergency: older people living alone, people with disabilities, families with infants.',
          'Shopkeepers, guards and auto drivers who know regulars are part of the safety net.',
        ],
      },
      { type: 'h2', text: '2. Fix unsafe places' },
      {
        type: 'ul',
        items: [
          'Walk the area at night and note dark stretches, broken streetlights, empty lots and blind corners.',
          'Report broken lights, open drains and damaged footpaths to the municipal body, and follow up.',
          'Keep pathways and bus stops clear and visible.',
        ],
      },
      { type: 'h2', text: '3. Report responsibly' },
      {
        type: 'p',
        text: 'Share facts about places and incidents, not rumours about people, and do not post names or photos of private individuals as accusations. Anonymous reporting helps people speak up without fear; see [why anonymous reporting helps](/blog/why-anonymous-reporting-matters). Emergencies always go to **112**, not to a group chat.',
      },
      { type: 'h2', text: '4. Work with the local police' },
      {
        type: 'ul',
        items: [
          'Find out who your beat officer is and save the local police station number.',
          'Many city police forces run community policing or citizen programmes; ask how your RWA can join.',
          'Invite the police for an awareness session, especially on scams and women’s safety.',
        ],
      },
      { type: 'h2', text: '5. Prepare together' },
      {
        type: 'ul',
        items: [
          'Agree an assembly point and a phone tree for fires, floods or power cuts.',
          'Keep a shared first-aid kit and a list of residents trained in first aid.',
          'Run a short annual safety meeting. See the [emergency preparedness checklist](/blog/emergency-preparedness-checklist).',
        ],
      },
      { type: 'h2', text: '6. Look out for each other' },
      {
        type: 'p',
        text: 'Check on neighbours who live alone, notice when someone seems frightened, and step in safely when you see harassment. See [how to support someone who is being harassed](/blog/how-to-support-someone-being-harassed) and [what to do if you are harassed in public](/blog/harassed-in-public-what-to-do).',
      },
      {
        type: 'callout',
        tone: 'info',
        title: 'How Sabhijude helps communities',
        text: 'Members can post reports of unsafe places and incidents to the community feed near them, anonymously if they prefer. Posts are checked for spam, and repeated reports from different members flag problem accounts for review. See [what happens after you report](/blog/what-happens-after-you-report).',
      },
    ],
    faqs: [
      {
        question: 'How can a neighbourhood become safer?',
        answer:
          'Residents who know each other and share emergency contacts, fixing unsafe places like dark stretches, responsible reporting of facts rather than rumours, working with the local beat officer, and preparing together for emergencies.',
      },
    ],
  },

  /* ---------------------------------------------------------------- family pillar */
  {
    slug: 'family-safety-guide',
    title: 'Family safety: a complete guide',
    seoTitle: 'Family Safety: A Complete Guide for Indian Families',
    description:
      'Emergency plans, children’s personal and online safety, teenagers, older parents, location sharing and digital rules, with links to detailed guides for each.',
    seoDescription:
      'A complete family safety guide: emergency plans, children’s personal and online safety, teenagers, older parents, location sharing and digital rules at home.',
    category: 'family-safety',
    tags: ['Family safety', 'Parents', 'Children', 'Pillar guide'],
    keywords: ['family safety', 'family safety checklist', 'family safety network', 'digital safety rules for families', 'how families can use technology for safety'],
    authorId: 'editorial',
    status: 'published',
    publishedAt: '2026-11-25',
    updatedAt: '2026-11-25',
    related: ['family-emergency-plan', 'children-online-safety-parents', 'teach-children-personal-safety', 'protect-older-parents-from-scams'],
    sources: [ERSS, NCPCR, NCRP],
    accent: 'coral',
    art: 'Family',
    body: [
      {
        type: 'p',
        text: 'Family safety is not about worrying more. It is about a few conversations and decisions that mean everyone, from the youngest child to the oldest grandparent, knows what to do and who to call. This guide brings them together.',
      },
      { type: 'h2', text: '1. A family emergency plan' },
      {
        type: 'p',
        text: 'A shared contact list, two meeting places, medical information, documents and a small kit. Our [family emergency plan](/blog/family-emergency-plan) takes one evening; the [emergency preparedness checklist](/blog/emergency-preparedness-checklist) covers the kit.',
      },
      { type: 'h2', text: '2. Young children' },
      {
        type: 'ul',
        items: [
          'Teach body safety, their parents’ names and number, and who they can go to if lost. See [how to teach children personal safety](/blog/teach-children-personal-safety).',
          'Know the adults in their lives: drivers, tutors, coaches, and how pickups work.',
          'Keep conversations open so they tell you when something feels wrong.',
        ],
      },
      { type: 'h2', text: '3. Children and teenagers online' },
      {
        type: 'p',
        text: 'Agree simple rules, use sensible controls, and make sure they know they will not be punished for telling you about a problem. See [online safety for children](/blog/children-online-safety-parents) and [how parents can help when a child is harassed online](/blog/help-family-member-harassment).',
      },
      { type: 'h2', text: '4. Location sharing' },
      {
        type: 'p',
        text: 'Use it for journeys and late nights, agreed openly rather than secretly. See [location sharing for families](/blog/family-location-sharing).',
      },
      { type: 'h2', text: '5. Older parents' },
      {
        type: 'ul',
        items: [
          'Agree a “call me first” rule for any request for money or codes. See [protecting older parents from scams](/blog/protect-older-parents-from-scams).',
          'Set up emergency contacts and medical ID on their phone.',
          'Save Elderline, **14567**, the national helpline for senior citizens.',
        ],
      },
      { type: 'h2', text: '6. Digital rules for the whole family' },
      {
        type: 'ul',
        items: [
          'Never share OTPs or PINs, even with family members over the phone.',
          'Two-step verification on everyone’s email and WhatsApp.',
          'No posting children’s school, routine or location publicly.',
          'A family code word for genuine emergencies, to beat voice-cloning scams.',
        ],
      },
      { type: 'h2', text: '7. A safety network beyond the family' },
      {
        type: 'p',
        text: 'Trusted neighbours, a friend in the same city, the school and the building guard are all part of your family’s safety network. Make sure they have the numbers they need. See [SOS and trusted contacts](/blog/sos-and-trusted-contacts).',
      },
    ],
    faqs: [
      {
        question: 'What is a family safety plan?',
        answer:
          'A family safety plan covers a shared emergency contact list, meeting places, medical information, a small kit, what each person should do in an emergency, rules for online safety, and how location sharing is used.',
      },
    ],
  },

  /* ---------------------------------------------------------------- incident management */
  {
    slug: 'incident-management-guide',
    title: 'Safety incident management: from report to resolution',
    seoTitle: 'Safety Incident Management: From Report to Resolution',
    description:
      'A clear process for any organisation or business: logging incidents, triage, investigation, action, communication, records and learning from patterns.',
    seoDescription:
      'A simple safety incident management process for organisations and businesses: log, triage, investigate, act, communicate, keep records and learn from patterns.',
    category: 'organization-safety',
    tags: ['Incident management', 'Reporting', 'Organisations', 'Businesses'],
    keywords: ['incident management', 'safety incident reporting', 'how to track safety incidents', 'incident response process', 'business incident reporting'],
    authorId: 'editorial',
    status: 'published',
    publishedAt: '2026-11-25',
    updatedAt: '2026-11-25',
    related: ['organization-safety-framework', 'company-anonymous-reporting', 'hr-complaint-handling', 'business-safety-guide'],
    sources: [SHE, ERSS],
    accent: 'ink',
    art: 'Resolve',
    body: [
      {
        type: 'p',
        text: 'An incident is anything that harmed someone, or could have: an injury, a near miss, a threat, harassment, a theft, a data leak. Organisations that handle incidents well use the same simple steps every time, so nothing is forgotten and nobody is treated unfairly.',
      },
      { type: 'h2', text: 'The six steps' },
      {
        type: 'ol',
        items: [
          '**Log:** record every report with a reference number, date, place, people involved and what happened, in the reporter’s words.',
          '**Triage:** decide urgency. Immediate danger goes straight to security and 112. Sexual harassment goes to the Internal Committee. Everything else gets an owner and a deadline.',
          '**Investigate:** gather facts from all sides, documents, messages and CCTV. Keep it proportionate and confidential.',
          '**Act:** fix the hazard, apply discipline, offer support, or close the report with reasons if it is not substantiated.',
          '**Communicate:** tell the reporter what happened, as far as privacy allows, and update anyone affected.',
          '**Learn:** review all incidents regularly to spot patterns and prevent the next one.',
        ],
      },
      { type: 'h2', text: 'What to record' },
      {
        type: 'table',
        head: ['Field', 'Why it matters'],
        rows: [
          ['Reference, date, time, location', 'Lets you find and group incidents later.'],
          ['Type and severity', 'Drives triage and reporting to leadership.'],
          ['People involved and witnesses', 'Needed for investigation; restrict access.'],
          ['Evidence received', 'Screenshots, CCTV, documents.'],
          ['Owner and deadline', 'Makes someone accountable.'],
          ['Actions and outcome, with reasons', 'Shows fairness and protects the organisation.'],
        ],
      },
      { type: 'h2', text: 'Fairness and confidentiality' },
      {
        type: 'ul',
        items: [
          'Limit access to a small group who need to know.',
          'Hear both sides before deciding; one report alone is not proof.',
          'Protect reporters from retaliation, and act if it happens.',
          'Follow the statutory process where one applies, such as POSH. See [how HR should handle harassment complaints](/blog/hr-complaint-handling).',
        ],
      },
      { type: 'h2', text: 'For small businesses' },
      {
        type: 'p',
        text: 'You do not need software to start: a notebook or spreadsheet with the fields above, reviewed monthly by the owner, is enough. See the [business safety guide](/blog/business-safety-guide).',
      },
      { type: 'h2', text: 'Where incidents come from' },
      {
        type: 'p',
        text: 'You only manage the incidents you hear about. Make reporting easy and safe, including anonymously. See [how companies can build a safe, anonymous reporting channel](/blog/company-anonymous-reporting) and the [organisation safety framework](/blog/organization-safety-framework).',
      },
    ],
    faqs: [
      {
        question: 'What are the steps of incident management?',
        answer:
          'Log the report, triage by urgency, investigate fairly, take action, communicate the outcome to the reporter as far as privacy allows, and review incidents regularly to learn from patterns.',
      },
    ],
  },

  /* ---------------------------------------------------------------- women at work */
  {
    slug: 'workplace-safety-for-women',
    title: 'Workplace safety for women in India: your rights',
    seoTitle: 'Workplace Safety for Women in India: Your Rights',
    description:
      'The protections women have at work in India: harassment complaints under POSH, night shifts, maternity benefits, safe transport, and what to do if your rights are ignored.',
    seoDescription:
      'Women’s rights at work in India: POSH complaints, night-shift consent and transport, maternity benefits, safe facilities, and what to do if they are ignored.',
    category: 'workplace-safety',
    tags: ['Women employees', 'POSH', 'Maternity benefits', 'Night shifts'],
    keywords: ['workplace safety for women', 'women rights at workplace India', 'POSH', 'women employees night shift', 'maternity benefit'],
    authorId: 'editorial',
    status: 'published',
    publishedAt: '2026-11-25',
    updatedAt: '2026-11-25',
    related: ['workplace-harassment-posh', 'night-shift-employee-safety', 'workplace-safety-guide', 'womens-safety-india-guide'],
    sources: [SHE, LABOUR, WHL, { title: 'National Commission for Women', publisher: 'Government of India', url: 'https://www.ncw.gov.in/' }],
    accent: 'coral',
    art: 'Rights',
    body: [
      {
        type: 'p',
        text: 'Indian law gives women specific protections at work, in offices, factories, shops, hospitals, homes where they are employed, and anywhere their work takes them. Knowing them is the first step to using them.',
      },
      { type: 'h2', text: '1. Freedom from sexual harassment' },
      {
        type: 'p',
        text: 'The POSH Act, 2013 protects every woman at the workplace, whether employee, intern, contract worker or visitor, from harassment by anyone, including colleagues, clients and customers. Workplaces with ten or more workers must have an Internal Committee; others are covered by the district Local Committee. You can also complain on SHe-Box. See [how to report workplace sexual harassment](/blog/workplace-harassment-posh).',
      },
      { type: 'h2', text: '2. Night shifts, by choice' },
      {
        type: 'p',
        text: 'Under the Occupational Safety, Health and Working Conditions Code, 2020, women may work night shifts with their consent, and the employer must make the prescribed safety arrangements, including transport. See [night-shift employee safety](/blog/night-shift-employee-safety).',
      },
      { type: 'h2', text: '3. Maternity benefits' },
      {
        type: 'ul',
        items: [
          'Paid maternity leave of up to 26 weeks for the first two children, under the maternity benefit provisions now in the Code on Social Security, 2020.',
          'Establishments with 50 or more employees must provide a crèche facility.',
          'Dismissal because of pregnancy or maternity leave is not allowed.',
        ],
      },
      {
        type: 'p',
        text: 'Eligibility conditions and details apply; check with HR or the labour department.',
      },
      { type: 'h2', text: '4. Safe and decent facilities' },
      {
        type: 'ul',
        items: [
          'Separate, clean washrooms and, where needed, rest rooms.',
          'Safe transport for late shifts where the law or company policy requires it.',
          'Equal pay for equal work, and no discrimination in hiring or promotion.',
        ],
      },
      { type: 'h2', text: '5. Practical safety at work' },
      {
        type: 'ul',
        items: [
          'Save HR, security and the Internal Committee’s contacts.',
          'Share your trip on late journeys home. See [cab safety tips](/blog/cab-safety-tips).',
          'Keep a record of anything that makes you uncomfortable: dates, what happened, witnesses. See [how to document workplace harassment](/blog/document-workplace-harassment).',
        ],
      },
      { type: 'h2', text: 'If your rights are ignored' },
      {
        type: 'ul',
        items: [
          'Raise it in writing with HR or the Internal Committee, and keep a copy.',
          'Use SHe-Box for sexual harassment, or the Local Committee if your workplace has no Internal Committee.',
          'Approach the labour department for leave, pay or facilities issues.',
          'Contact the National Commission for Women or your State Commission for Women.',
          'Go to the police for criminal behaviour such as assault or stalking.',
        ],
      },
      {
        type: 'p',
        text: 'For the full picture beyond work, see [women’s safety in India](/blog/womens-safety-india-guide) and the [workplace safety guide](/blog/workplace-safety-guide).',
      },
    ],
    faqs: [
      {
        question: 'What are women’s rights at the workplace in India?',
        answer:
          'Protection from sexual harassment under the POSH Act, the choice to work night shifts with employer safety arrangements, paid maternity leave of up to 26 weeks for the first two children, crèche facilities in establishments with 50 or more employees, and equal pay and non-discrimination.',
      },
    ],
  },

  /* ---------------------------------------------------------------- digital footprint */
  {
    slug: 'digital-footprint',
    title: 'How to reduce your digital footprint',
    seoTitle: 'How to Reduce Your Digital Footprint: A Practical Guide',
    description:
      'Find out what the internet knows about you, clean up old accounts and posts, remove personal details from search results, and share less from now on.',
    seoDescription:
      'Find what the internet shows about you, delete old accounts and posts, remove your number and address from search results, and share less from now on.',
    category: 'digital-privacy',
    tags: ['Digital footprint', 'Privacy', 'Search results', 'Students'],
    keywords: ['digital footprint', 'how to reduce your digital footprint', 'remove personal information from internet', 'protect your digital footprint'],
    authorId: 'editorial',
    status: 'published',
    publishedAt: '2026-11-25',
    updatedAt: '2026-11-25',
    related: ['digital-privacy-guide', 'social-media-privacy-settings', 'doxxing-what-to-do', 'location-privacy-checklist'],
    sources: [{ title: 'Remove personal information from Google Search', publisher: 'Google', url: 'https://support.google.com/websearch/answer/12719076' }, { title: 'Indian Computer Emergency Response Team (CERT-In)', publisher: 'Ministry of Electronics and Information Technology', url: 'https://www.cert-in.org.in/' }],
    accent: 'blue',
    art: 'Less',
    body: [
      {
        type: 'p',
        text: 'Your **digital footprint** is everything about you that exists online: profiles, posts, photos, comments, old accounts, mentions by others, and data held by apps and companies. You cannot erase all of it, but you can make far less of it public, which makes you a harder target for scammers and stalkers.',
      },
      { type: 'h2', text: '1. See what is out there' },
      {
        type: 'ul',
        items: [
          'Search your full name, phone number, email address and usernames, with and without your city.',
          'Check image search for your profile photos.',
          'Look at your own profiles while logged out to see what strangers see.',
        ],
      },
      { type: 'h2', text: '2. Clean up old accounts and posts' },
      {
        type: 'ul',
        items: [
          'Delete accounts you no longer use: old social networks, forums, shopping sites and apps.',
          'Archive or delete old posts that reveal your school, home, routine or family details.',
          'Untag yourself from photos you do not want public, and ask friends to remove them.',
          'Remove your phone number and address from public profiles, old resumes and listings.',
        ],
      },
      { type: 'h2', text: '3. Remove details from search results' },
      {
        type: 'p',
        text: 'Google lets you request the removal of search results that show your personal contact details, such as your phone number or home address. The page may still exist, so also ask the website to remove the information at the source. See [doxxing: what to do](/blog/doxxing-what-to-do) if your details were posted to target you.',
      },
      { type: 'h2', text: '4. Lock down what remains' },
      {
        type: 'p',
        text: 'Make profiles private, hide friends lists and limit who can find you by phone number. Our [social media privacy settings](/blog/social-media-privacy-settings) checklist and [location privacy checklist](/blog/location-privacy-checklist) go through each setting.',
      },
      { type: 'h2', text: '5. Share less from now on' },
      {
        type: 'ul',
        items: [
          'Post after you leave a place, not while you are there.',
          'Avoid photos showing your house, vehicle plate, ID cards or school uniform.',
          'Use a separate email for shopping and sign-ups.',
          'Before you post, ask: would I be comfortable with a stranger knowing this?',
        ],
      },
      {
        type: 'callout',
        tone: 'info',
        title: 'For students and job seekers',
        text: 'Employers and colleges often search candidates online. A cleaner footprint protects your safety and your reputation at the same time.',
      },
      {
        type: 'p',
        text: 'For the wider picture, see the [digital privacy guide](/blog/digital-privacy-guide).',
      },
    ],
    faqs: [
      {
        question: 'How do I reduce my digital footprint?',
        answer:
          'Search yourself to see what is public, delete old accounts and revealing posts, remove your number and address from profiles, request removal of contact details from search results, make remaining profiles private, and share less going forward.',
      },
    ],
  },

  /* ---------------------------------------------------------------- coworker online */
  {
    slug: 'digital-harassment-at-work',
    title: 'Online harassment from a coworker: what to do',
    seoTitle: 'Online Harassment From a Coworker: What to Do',
    description:
      'Unwanted messages, abusive comments in work groups, stalking on social media or leaked images, when it comes from a colleague: how to respond and report it.',
    seoDescription:
      'When a colleague harasses you online: messages, work-group abuse, social media stalking or images. How to save evidence and report it to HR, the IC or police.',
    category: 'workplace-safety',
    tags: ['Digital harassment', 'Coworkers', 'POSH', 'WhatsApp groups'],
    keywords: ['digital harassment in the workplace', 'online harassment from a coworker', 'harassment on WhatsApp by colleague', 'harassment from a coworker'],
    authorId: 'editorial',
    status: 'published',
    publishedAt: '2026-11-25',
    updatedAt: '2026-11-25',
    related: ['workplace-harassment-posh', 'document-workplace-harassment', 'online-harassment-guide', 'hr-complaint-handling'],
    sources: [SHE, NCRP],
    accent: 'ink',
    art: 'At work',
    body: [
      {
        type: 'p',
        text: 'Harassment by a colleague does not stop being workplace harassment because it happens on WhatsApp, Instagram or email, or after office hours. The same routes to report it apply, and online harassment often leaves clearer evidence.',
      },
      { type: 'h2', text: 'What it can look like' },
      {
        type: 'ul',
        items: [
          'Repeated personal or sexual messages, late-night calls, or pressure to meet.',
          'Insults, mockery or exclusion in work WhatsApp or Slack groups.',
          'Following, commenting on or monitoring your personal social media after you have said no.',
          'Sharing your photos, screenshots of your messages or rumours about you.',
          'Threats, or sharing intimate or morphed images.',
        ],
      },
      { type: 'h2', text: '1. Save the evidence' },
      {
        type: 'p',
        text: 'Screenshot messages with the sender’s name or number and the date, keep emails in their original form, and note any witnesses in group chats. Do this before blocking or leaving a group. See [how to document workplace harassment](/blog/document-workplace-harassment).',
      },
      { type: 'h2', text: '2. Set a boundary, once' },
      {
        type: 'p',
        text: 'If it is safe to, send one clear message in writing: “Please do not message me about anything other than work.” This shows the behaviour was unwelcome. You do not have to do this before reporting.',
      },
      { type: 'h2', text: '3. Report it at work' },
      {
        type: 'ul',
        items: [
          '**Sexual harassment** (sexual messages, images, advances or remarks) goes to the Internal Committee under the POSH Act, or on SHe-Box. See [how to report workplace sexual harassment](/blog/workplace-harassment-posh).',
          '**Bullying and other harassment** goes to your manager or HR, or the company’s ethics or speak-up channel.',
        ],
      },
      { type: 'h2', text: '4. Protect your accounts and privacy' },
      {
        type: 'ul',
        items: [
          'Block or restrict the person on personal social media.',
          'Make your profiles private and review who can see your posts.',
          'Change passwords if they may have had access to your devices.',
        ],
      },
      { type: 'h2', text: '5. When to go to the police' },
      {
        type: 'p',
        text: 'Threats, stalking, sharing intimate images, impersonation and blackmail can be crimes. You can report them at cybercrime.gov.in or a police station alongside an internal complaint. See [online harassment: how to respond safely](/blog/online-harassment-guide).',
      },
    ],
    faqs: [
      {
        question: 'Is harassment on WhatsApp by a colleague covered by POSH?',
        answer:
          'Yes, sexual harassment by a colleague is covered whether it happens in person, by message, by email or on social media, including outside office hours. Complain to the Internal Committee or on SHe-Box.',
      },
    ],
  },

  /* ---------------------------------------------------------------- documenting harassment */
  {
    slug: 'document-workplace-harassment',
    title: 'How to document workplace harassment',
    seoTitle: 'How to Document Workplace Harassment (With Template)',
    description:
      'What to write down, what to keep, and how to store it, so your complaint to HR, the Internal Committee or the police is clear and credible.',
    seoDescription:
      'How to record workplace harassment so your complaint is clear and credible: what to write down, evidence to keep, a simple log template, and storing it safely.',
    category: 'workplace-safety',
    tags: ['Documentation', 'Evidence', 'POSH', 'Employees'],
    keywords: ['how to document workplace harassment', 'evidence for POSH complaint', 'harassment log template', 'workplace incident record'],
    authorId: 'editorial',
    status: 'published',
    publishedAt: '2026-11-25',
    updatedAt: '2026-11-25',
    related: ['workplace-harassment-posh', 'how-to-preserve-digital-evidence', 'digital-harassment-at-work', 'hr-complaint-handling'],
    sources: [SHE, NCRP],
    accent: 'coral',
    art: 'Write it',
    body: [
      {
        type: 'p',
        text: 'A clear record turns “it has been going on for months” into specific incidents a committee or investigator can act on. You do not need to be sure you will complain to start keeping one.',
      },
      { type: 'h2', text: 'What to write down' },
      {
        type: 'ul',
        items: [
          'Date, time and place of each incident.',
          'Exactly what was said or done, in the words used, as soon as possible afterwards.',
          'Who else was present, or saw or heard it.',
          'How it affected you and your work.',
          'Anyone you told at the time, such as a friend or colleague.',
        ],
      },
      { type: 'h2', text: 'What to keep' },
      {
        type: 'ul',
        items: [
          'Messages, emails and chat screenshots with names and dates. See [how to preserve digital evidence](/blog/how-to-preserve-digital-evidence).',
          'Any changes to your work after you objected: shift changes, reviews, emails.',
          'Medical or counselling notes if the harassment affected your health.',
          'Copies of anything you submit to HR or the committee, with dates.',
        ],
      },
      { type: 'h2', text: 'A simple log' },
      {
        type: 'table',
        head: ['Date and time', 'Place', 'What happened', 'Witnesses', 'Evidence'],
        rows: [
          ['3 Nov, 6:40 pm', 'Floor 4 pantry', 'Comment about my clothes after I said stop last week', 'R. (team)', 'Note written same evening'],
          ['5 Nov, 11:15 pm', 'WhatsApp', 'Personal message asking to meet', '—', 'Screenshot 7'],
        ],
        caption: 'An example. Keep adding to it; patterns over time matter.',
      },
      { type: 'h2', text: 'Store it safely' },
      {
        type: 'ul',
        items: [
          'Keep it on a personal device or account, not only on work systems.',
          'Back it up somewhere secure, and share a copy with one person you trust.',
          'Do not record conversations without checking the rules; ask HR, the committee or a lawyer.',
        ],
      },
      { type: 'h2', text: 'Using it' },
      {
        type: 'p',
        text: 'Attach your log and evidence to a written complaint. Under the POSH Act, complaints are normally made within three months of the last incident, so do not wait too long. See [how to report workplace sexual harassment](/blog/workplace-harassment-posh). If the harassment is online, also read [online harassment from a coworker](/blog/digital-harassment-at-work).',
      },
    ],
    faqs: [
      {
        question: 'What evidence do I need for a POSH complaint?',
        answer:
          'There is no fixed list. A written account of each incident with dates, places and witnesses, plus messages, emails and anything showing how you were treated after objecting, makes a complaint clear and credible.',
      },
    ],
  },

  /* ---------------------------------------------------------------- teaching children */
  {
    slug: 'teach-children-personal-safety',
    title: 'How to teach children personal safety',
    seoTitle: 'How to Teach Children Personal Safety, by Age',
    description:
      'Body safety, safe and unsafe touch, secrets, getting lost, strangers and trusted adults: what to teach children at each age, in a way that builds confidence, not fear.',
    seoDescription:
      'Teach children personal safety by age: body safety, safe and unsafe touch, secrets, getting lost and trusted adults, in a way that builds confidence, not fear.',
    category: 'family-safety',
    tags: ['Children', 'Body safety', 'Parents', 'Child protection'],
    keywords: ['teach children personal safety', 'good touch bad touch', 'body safety for kids', 'child safety rules', 'personal safety for children'],
    authorId: 'editorial',
    status: 'published',
    publishedAt: '2026-11-25',
    updatedAt: '2026-11-25',
    related: ['family-safety-guide', 'children-online-safety-parents', 'school-safety-guide', 'family-emergency-plan'],
    sources: [NCPCR, ERSS],
    accent: 'blue',
    art: 'Safe',
    body: [
      {
        type: 'p',
        text: 'Children who know the right words, the rules about their bodies and exactly who to tell are much better protected, and much more likely to speak up. The aim is confidence, not fear. Short, repeated conversations work better than one big talk.',
      },
      { type: 'h2', text: 'Ages 3 to 6' },
      {
        type: 'ul',
        items: [
          'Teach the correct names for body parts. It helps children explain if something happens.',
          'The parts covered by a swimsuit are private. Nobody should touch them or ask to see them, except a parent or doctor helping keep them clean or healthy, with a parent there.',
          'Safe touch feels okay; unsafe touch feels scary, confusing or hurts. They can say “No” and must tell you.',
          'Their full name, a parent’s name and phone number, as a song or rhyme.',
        ],
      },
      { type: 'h2', text: 'Ages 7 to 10' },
      {
        type: 'ul',
        items: [
          '**No secrets about touching,** even from family or a teacher. Surprises (like a gift) are fine; secrets that feel bad must be told.',
          'A list of trusted adults they can go to if you are not there.',
          'If lost: stay where you are, find a mother with children, a shopkeeper or a police officer.',
          'Never go anywhere with anyone, even someone they know, without checking with you; use a family code word.',
          'The basics of online safety. See [online safety for children](/blog/children-online-safety-parents).',
        ],
      },
      { type: 'h2', text: 'Ages 11 and up' },
      {
        type: 'ul',
        items: [
          'Consent and respect: their body, their choice, and the same for others.',
          'Recognising grooming: an adult or older child who gives special attention, gifts or secrets.',
          'Peer pressure, and that they can always call you for a lift home, no questions in the moment.',
          'What to do if someone shares or asks for images.',
        ],
      },
      { type: 'h2', text: 'How to talk so they tell you' },
      {
        type: 'ul',
        items: [
          'Use everyday moments: bath time, a story, the news.',
          'Praise them for telling you things, even small things.',
          'Stay calm if they tell you something worrying; your reaction decides whether they tell you again.',
          'Never force them to hug or kiss relatives; it teaches that their “no” does not count.',
        ],
      },
      {
        type: 'callout',
        tone: 'warn',
        title: 'If a child tells you about abuse',
        text: 'Believe them, stay calm, tell them it is not their fault and that you will keep them safe. Do not question them repeatedly. Under the POCSO Act, sexual abuse of a child must be reported to the police; you can also call Childline 1098 or 112.',
      },
      {
        type: 'p',
        text: 'Make this part of a wider [family safety plan](/blog/family-safety-guide), and ask your child’s school how it teaches body safety; see the [school safety guide](/blog/school-safety-guide).',
      },
    ],
    faqs: [
      {
        question: 'At what age should I teach my child body safety?',
        answer:
          'From around age 3, using correct names for body parts and simple rules about private parts and safe and unsafe touch, building up with each age to secrets, trusted adults, consent and recognising grooming.',
      },
      {
        question: 'What should I do if my child tells me about abuse?',
        answer:
          'Believe them, stay calm, tell them it is not their fault and that you will keep them safe, and report it to the police as required by the POCSO Act. You can also call Childline 1098 or 112.',
      },
    ],
  },
];
