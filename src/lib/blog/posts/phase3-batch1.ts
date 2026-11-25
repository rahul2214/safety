import type { BlogPost, Source } from '../types';

/**
 * Phase 3, batch 1: technology and product-led guides (campus, schools, employee safety apps,
 * personal safety technology), delivery and field workers, seniors living alone, crowd safety,
 * voice-cloning scams. Checked 2026-11-25.
 *
 * Sabhijude organisation claims follow the app: members join an organisation and choose what to
 * share in Permissions: their name and profile (required), contact details,
 * and live location (most leave it off); they can change this later. Organisations receive
 * incident reports, see posts shared with them, and send broadcasts. SOS alerts are never sent to
 * organisations: they go only to the member's own trusted contacts.
 * - NDMA guide on managing crowds at events and venues of mass gathering.
 * - Elderline 14567 (8 am to 8 pm). Maintenance and Welfare of Parents and Senior Citizens Act, 2007.
 */

const ERSS: Source = { title: 'Emergency Response Support System (112)', publisher: 'Ministry of Home Affairs', url: 'https://112.gov.in/' };
const NCRP: Source = { title: 'National Cyber Crime Reporting Portal (cybercrime.gov.in)', publisher: 'Ministry of Home Affairs', url: 'https://cybercrime.gov.in/' };
const NDMA: Source = { title: 'National Disaster Management Authority (crowd management guidance)', publisher: 'Government of India', url: 'https://ndma.gov.in/' };
const DPDP: Source = { title: 'Digital Personal Data Protection Rules, 2025 notified (PIB)', publisher: 'Ministry of Electronics and Information Technology', url: 'https://static.pib.gov.in/WriteReadData/specificdocs/documents/2025/nov/doc20251117695301.pdf' };
const ELDER: Source = { title: 'Elderline (14567): National Helpline for Senior Citizens', publisher: 'Ministry of Social Justice and Empowerment', url: 'https://pib.gov.in/PressReleasePage.aspx?PRID=1759358' };
const UGC: Source = { title: 'University Grants Commission', publisher: 'Government of India', url: 'https://www.ugc.gov.in/' };

const ORG_PERMISSIONS =
  'Members choose what they share with their organisation: their name and profile (required), contact details, and live location, which most people leave off. They can change these choices at any time. SOS alerts are personal and are never sent to the organisation; they go only to the member’s own trusted contacts.';

export const PHASE3_BATCH1_POSTS: BlogPost[] = [
  /* ---------------------------------------------------------------- campus technology */
  {
    slug: 'campus-safety-technology',
    title: 'How colleges can use technology for campus safety',
    seoTitle: 'How Colleges Can Use Technology for Campus Safety',
    description:
      'What technology genuinely helps on campus, what to avoid, and how to respect student privacy: alerts, SOS, incident reporting, access and CCTV.',
    seoDescription:
      'Campus safety technology that helps: SOS with location, incident reporting, campus-wide alerts, access control and CCTV, chosen with student privacy in mind.',
    category: 'college-safety',
    tags: ['Campus safety', 'Technology', 'Student privacy', 'Administrators'],
    keywords: ['campus safety app', 'campus safety technology', 'student safety app', 'how technology can improve campus safety'],
    authorId: 'editorial',
    status: 'published',
    publishedAt: '2026-11-25',
    updatedAt: '2026-11-25',
    related: ['how-colleges-can-build-safer-campus', 'college-emergency-plan', 'college-safety-reporting-system', 'why-anonymous-reporting-matters'],
    sources: [UGC, DPDP],
    accent: 'blue',
    art: 'Campus tech',
    body: [
      {
        type: 'p',
        text: 'Technology does not make a campus safe on its own; people and processes do. But the right tools make it faster to get help, easier to report problems, and possible to reach every student in minutes. The wrong ones add cost and erode trust.',
      },
      { type: 'h2', text: 'What genuinely helps' },
      {
        type: 'table',
        head: ['Tool', 'What it does well'],
        rows: [
          ['SOS with location', 'Lets a student in trouble, on or off campus, alert the people they trust with their location in seconds.'],
          ['Incident reporting', 'Gives students an easy, private way to report harassment, ragging and unsafe places, including anonymously.'],
          ['Campus-wide alerts', 'Reaches every phone during an emergency, far faster than email.'],
          ['Access control', 'Controls who enters hostels and buildings, especially at night.'],
          ['CCTV in common areas', 'Deters some incidents and helps investigations, if footage access is controlled.'],
        ],
      },
      { type: 'h2', text: 'Questions to ask before buying' },
      {
        type: 'ul',
        items: [
          'Does it solve a problem students and staff actually report?',
          'Who receives alerts and reports, and are they staffed 24 hours?',
          'What data does it collect, who can see it, and for how long is it kept?',
          'Can students control what they share, and change their minds?',
          'Does it work for students off campus, at night, on poor networks?',
        ],
      },
      { type: 'h2', text: 'Respect privacy' },
      {
        type: 'p',
        text: 'Students are adults. Continuous location tracking or monitoring of personal devices damages trust and may conflict with data protection law, which requires clear consent for specific purposes. Collect only what the safety purpose needs, and be transparent about it.',
      },
      { type: 'h2', text: 'Technology supports the plan' },
      {
        type: 'p',
        text: 'Tools work best inside a clear [college emergency plan](/blog/college-emergency-plan) and a trusted [safety reporting system](/blog/college-safety-reporting-system). For the full picture, see [how colleges can build a safer campus](/blog/how-colleges-can-build-safer-campus).',
      },
      {
        type: 'callout',
        tone: 'info',
        title: 'How Sabhijude works for colleges',
        text: `Colleges on Sabhijude can invite students, receive incident reports, post to their students and send safety broadcasts, and see the posts students share with the college. ${ORG_PERMISSIONS}`,
      },
    ],
    faqs: [
      {
        question: 'What technology improves campus safety?',
        answer:
          'SOS with location, easy and anonymous incident reporting, campus-wide emergency alerts, access control for hostels and buildings, and CCTV in common areas, chosen with clear limits on data and student privacy.',
      },
    ],
  },

  /* ---------------------------------------------------------------- employee safety apps */
  {
    slug: 'employee-safety-app',
    title: 'Employee safety apps: what companies should know',
    seoTitle: 'Employee Safety Apps: What Companies Should Know',
    description:
      'What an employee safety app should do, the privacy questions to ask, how to roll it out so employees trust it, and how it fits your emergency plan.',
    seoDescription:
      'Choosing an employee safety app: SOS with location, incident reporting and alerts, privacy and consent under India’s data law, and rolling it out with trust.',
    category: 'corporate-safety',
    tags: ['Employee safety app', 'Technology', 'Privacy', 'HR'],
    keywords: ['employee safety app', 'workplace safety system', 'employee emergency contact systems', 'how technology can improve workplace safety'],
    authorId: 'editorial',
    status: 'published',
    publishedAt: '2026-11-25',
    updatedAt: '2026-11-25',
    related: ['corporate-emergency-response-plan', 'night-shift-employee-safety', 'company-anonymous-reporting', 'workplace-safety-culture'],
    sources: [DPDP, ERSS],
    accent: 'ink',
    art: 'App',
    body: [
      {
        type: 'p',
        text: 'Employee safety apps promise faster help in emergencies and better reporting. Done well, they protect people on late shifts, field visits and work trips. Done badly, they feel like surveillance and nobody uses them.',
      },
      { type: 'h2', text: 'What the app should do' },
      {
        type: 'ul',
        items: [
          '**SOS with location** that alerts the employee’s own trusted contacts; whether the company is told should be the employee’s choice.',
          '**Incident reporting,** including an anonymous option.',
          '**Broadcast alerts** to all employees or a site in an emergency.',
          '**Journey sharing** for late shifts and travel, chosen by the employee.',
          '**Work in poor network conditions,** with an SMS fallback.',
        ],
      },
      { type: 'h2', text: 'Privacy and consent' },
      {
        type: 'p',
        text: 'India’s Digital Personal Data Protection Act requires clear consent for specified purposes and limits on what is collected. Ask any vendor: what data is collected, when location is shared, who in the company can see it, where it is stored, and how employees can withdraw consent. Location only during an emergency is very different from location all day.',
      },
      { type: 'h2', text: 'Rolling it out with trust' },
      {
        type: 'ol',
        items: [
          'Explain the purpose: safety, not monitoring performance.',
          'Show employees exactly what is shared and when, and let them control it.',
          'Make sure someone answers alerts 24 hours a day before launch.',
          'Test it with a pilot group, including night-shift and field staff.',
          'Build it into your [emergency response plan](/blog/corporate-emergency-response-plan) and drills.',
        ],
      },
      {
        type: 'p',
        text: 'An app supports a safety culture; it does not replace one. See [workplace safety culture](/blog/workplace-safety-culture) and [night-shift employee safety](/blog/night-shift-employee-safety).',
      },
      {
        type: 'callout',
        tone: 'info',
        title: 'How Sabhijude works for companies',
        text: `Companies on Sabhijude can invite employees, receive incident reports, send broadcasts, and see the posts employees share with the company. ${ORG_PERMISSIONS}`,
      },
    ],
    faqs: [
      {
        question: 'What should an employee safety app include?',
        answer:
          'SOS with location to the employee’s personal trusted contacts, incident reporting with an anonymous option, emergency broadcasts, optional journey sharing, and an SMS fallback, with clear employee control over what is shared.',
      },
      {
        question: 'Can companies track employees’ location through a safety app?',
        answer:
          'Under India’s data protection law, personal data needs clear consent for specified purposes. Location shared only during an emergency, with the employee’s consent and control, is very different from continuous tracking.',
      },
    ],
  },

  /* ---------------------------------------------------------------- delivery & field workers */
  {
    slug: 'field-delivery-worker-safety',
    title: 'Delivery and field worker safety',
    seoTitle: 'Delivery and Field Worker Safety: A Practical Guide',
    description:
      'For businesses and workers: road safety, customer homes, harassment, late shifts, check-ins and emergencies for delivery riders, technicians, sales staff and guards.',
    seoDescription:
      'Safety for delivery riders, technicians, sales staff and guards: road safety, customer homes, harassment, late shifts, check-ins and emergency help.',
    category: 'business-safety',
    tags: ['Delivery workers', 'Field staff', 'Security guards', 'Lone working'],
    keywords: ['delivery worker safety', 'field worker safety', 'security guard safety', 'lone worker safety'],
    authorId: 'editorial',
    status: 'published',
    publishedAt: '2026-11-25',
    updatedAt: '2026-11-25',
    related: ['customer-harassment-response', 'business-safety-guide', 'night-shift-employee-safety', 'what-to-do-during-an-emergency'],
    sources: [ERSS, { title: 'Women Helpline (181)', publisher: 'Ministry of Women and Child Development (myScheme)', url: 'https://www.myscheme.gov.in/schemes/whl-181' }],
    accent: 'coral',
    art: 'On the go',
    body: [
      {
        type: 'p',
        text: 'Delivery riders, technicians, sales staff, nurses on home visits and security guards often work alone, on the road, at night and in strangers’ homes. Their employers can do a lot to keep them safe, and so can they.',
      },
      { type: 'h2', text: 'For employers' },
      {
        type: 'ul',
        items: [
          'A way to raise an alert with location, and a manager or control room that answers at all hours.',
          'Regular check-ins for lone and late work.',
          'A clear rule that workers can refuse or leave any unsafe job without penalty.',
          'Realistic delivery times that do not push unsafe riding.',
          'Helmets and protective gear, and vehicle checks.',
          'A policy on customer harassment, backed by action. See [customer harassment: how businesses should respond](/blog/customer-harassment-response).',
          'Accident cover and a clear process if a worker is injured.',
        ],
      },
      { type: 'h2', text: 'For workers' },
      {
        type: 'ul',
        items: [
          '**On the road:** helmet always, no phone while riding, slow down in rain and at night.',
          '**At a customer’s door:** stay at the threshold where possible; you do not have to enter a home if you feel unsafe.',
          '**Home visits:** tell someone where you are and when you expect to finish; keep your phone charged and in your hand.',
          '**If something feels wrong:** leave, call your manager, and call 112 if you are in danger.',
          '**After an incident:** report it to your employer and keep a record. See [what to do in an emergency](/blog/what-to-do-during-an-emergency).',
        ],
      },
      { type: 'h2', text: 'Security guards' },
      {
        type: 'p',
        text: 'Guards on night duty need a working phone, a supervisor who answers, regular check-ins, and clear instructions: observe and report, call 112, do not confront armed or violent people alone.',
      },
      {
        type: 'p',
        text: 'For late shifts, see [night-shift employee safety](/blog/night-shift-employee-safety), and for the wider picture, the [business safety guide](/blog/business-safety-guide).',
      },
    ],
    faqs: [
      {
        question: 'How can businesses keep delivery and field workers safe?',
        answer:
          'Provide a way to raise an alert with location and someone who answers at all hours, regular check-ins, the right to refuse unsafe jobs, realistic timings, protective gear, a customer-harassment policy, and accident cover.',
      },
    ],
  },

  /* ---------------------------------------------------------------- school technology */
  {
    slug: 'school-safety-technology',
    title: 'How schools can use technology for student safety',
    seoTitle: 'How Schools Can Use Technology for Student Safety',
    description:
      'Parent alerts, bus tracking, visitor management, attendance and safe reporting: what helps in schools, what to avoid, and protecting children’s data.',
    seoDescription:
      'School safety technology that helps: parent alerts, bus tracking, visitor management and safe reporting, with care for children’s data and privacy.',
    category: 'school-safety',
    tags: ['Schools', 'Technology', 'Parents', 'Children’s data'],
    keywords: ['school safety system', 'emergency communication systems for schools', 'school bus tracking', 'student emergency contact systems'],
    authorId: 'editorial',
    status: 'published',
    publishedAt: '2026-11-25',
    updatedAt: '2026-11-25',
    related: ['school-safety-guide', 'school-emergency-preparedness', 'school-safety-checklist', 'school-bullying-reports'],
    sources: [{ title: 'Guidelines on School Safety and Security (2021)', publisher: 'Department of School Education & Literacy, Ministry of Education', url: 'https://dsel.education.gov.in/sites/default/files/update/guidelines_sss.pdf' }, DPDP],
    accent: 'blue',
    art: 'School tech',
    body: [
      {
        type: 'p',
        text: 'For schools, the most valuable technology is often the simplest: reaching every parent quickly, knowing where the buses are, and knowing who is on the premises. Children’s data needs extra care, so choose tools carefully.',
      },
      { type: 'h2', text: 'What helps' },
      {
        type: 'table',
        head: ['Tool', 'Use'],
        rows: [
          ['Parent messaging', 'Emergency alerts, early closures, a child not arriving at school.'],
          ['Bus tracking', 'Live location of school buses for the transport team and parents.'],
          ['Visitor management', 'Registering visitors, issuing badges, controlling pickups.'],
          ['Attendance alerts', 'Notifying parents quickly when a child is absent without notice.'],
          ['Safe reporting', 'A way for older students to raise bullying or safety concerns privately.'],
          ['CCTV', 'Gates, corridors and buses, with footage access restricted and logged.'],
        ],
      },
      { type: 'h2', text: 'Children’s data' },
      {
        type: 'p',
        text: 'India’s data protection law treats children’s personal data with extra protection, including parental consent. Collect only what is needed, restrict who can see it, never share photos or locations of children publicly, and ask vendors where data is stored and for how long.',
      },
      { type: 'h2', text: 'Avoid' },
      {
        type: 'ul',
        items: [
          'Tools that need far more data than their purpose requires.',
          'Systems nobody monitors: an alert that no one reads is worse than none.',
          'Technology as a substitute for supervision, training and a clear plan.',
        ],
      },
      {
        type: 'p',
        text: 'Use technology to support your [school emergency preparedness](/blog/school-emergency-preparedness) plan and the [school safety checklist](/blog/school-safety-checklist), and give students a safe way to report bullying (see [how schools should handle bullying](/blog/school-bullying-reports)).',
      },
    ],
    faqs: [
      {
        question: 'How can technology improve school safety?',
        answer:
          'Through fast parent messaging, school bus tracking, visitor management, attendance alerts, safe reporting channels for students and CCTV in common areas, chosen with strict care for children’s data.',
      },
    ],
  },

  /* ---------------------------------------------------------------- seniors living alone */
  {
    slug: 'senior-emergency-safety',
    title: 'Emergency safety for senior citizens living alone',
    seoTitle: 'Emergency Safety for Senior Citizens Living Alone',
    description:
      'Falls, medical emergencies, scams and isolation: how families and neighbours can help older people living alone stay safe, and where to get support in India.',
    seoDescription:
      'Help older people living alone stay safe: preventing falls, medical emergencies, daily check-ins, scams, Elderline 14567 and support from family and neighbours.',
    category: 'family-safety',
    tags: ['Senior citizens', 'Living alone', 'Elderline', 'Family'],
    keywords: ['emergency safety for senior citizens', 'elderly living alone safety', 'elderline 14567', 'senior citizen emergency plan'],
    authorId: 'editorial',
    status: 'published',
    publishedAt: '2026-11-25',
    updatedAt: '2026-11-25',
    related: ['protect-older-parents-from-scams', 'family-safety-guide', 'emergency-contact-checklist', 'sos-and-trusted-contacts'],
    sources: [ELDER, ERSS],
    accent: 'coral',
    art: 'Check in',
    body: [
      {
        type: 'p',
        text: 'Many older people in India now live alone or with only a spouse, while children work in other cities. A few practical arrangements make it far more likely that help arrives quickly when something goes wrong.',
      },
      { type: 'h2', text: '1. Prevent falls' },
      {
        type: 'ul',
        items: [
          'Good lighting, including night lights to the bathroom.',
          'Grab bars in the bathroom and anti-slip mats.',
          'No loose rugs or wires across walkways.',
          'Commonly used things kept at waist height.',
          'Regular eye checks and a review of medicines that cause dizziness.',
        ],
      },
      { type: 'h2', text: '2. Make help reachable' },
      {
        type: 'ul',
        items: [
          'A phone that is always charged and within reach, with large-font contacts.',
          'Emergency contacts and medical ID set up on the phone. See [emergency contact list](/blog/emergency-contact-checklist).',
          'A simple SOS that alerts family with location. See [SOS and trusted contacts](/blog/sos-and-trusted-contacts).',
          'A spare key with a trusted neighbour.',
          'Medicines, prescriptions and a summary of conditions kept in one known place.',
        ],
      },
      { type: 'h2', text: '3. Daily check-ins' },
      {
        type: 'p',
        text: 'Agree a daily call or message at a set time, and what happens if it is missed: who calls next, and who goes round. Neighbours, building staff or a local friend are often the fastest responders.',
      },
      { type: 'h2', text: '4. Scams and fraud' },
      {
        type: 'p',
        text: 'Older people living alone are frequent targets of phone scams. Agree a “call me first” rule for any request for money or codes. See [protecting older parents from scams](/blog/protect-older-parents-from-scams).',
      },
      { type: 'h2', text: '5. Support in India' },
      {
        type: 'ul',
        items: [
          '**Elderline, 14567:** the national helpline for senior citizens, 8 am to 8 pm, for information on health, pensions and legal matters and help in cases of abuse or neglect.',
          '**112** for any emergency.',
          'The Maintenance and Welfare of Parents and Senior Citizens Act, 2007 lets senior citizens claim maintenance from their children and protects them from abandonment.',
        ],
      },
      {
        type: 'p',
        text: 'Make this part of your [family safety plan](/blog/family-safety-guide).',
      },
    ],
    faqs: [
      {
        question: 'How can I keep an elderly parent living alone safe?',
        answer:
          'Prevent falls with lighting and grab bars, keep a charged phone with emergency contacts and an SOS feature in reach, leave a spare key with a neighbour, agree daily check-ins, and set a “call me first” rule for money requests. Elderline 14567 offers support.',
      },
    ],
  },

  /* ---------------------------------------------------------------- personal safety technology */
  {
    slug: 'technology-and-personal-safety',
    title: 'How technology can improve your personal safety',
    seoTitle: 'How Technology Can Improve Your Personal Safety',
    description:
      'The phone features and safety apps that actually help in an emergency, how to set them up, and how to use them without giving away your privacy.',
    seoDescription:
      'The phone features and safety apps that help in emergencies: SOS, trusted contacts, live location, medical ID and fake calls, and how to set them up safely.',
    category: 'safety-awareness',
    tags: ['Safety apps', 'Technology', 'SOS', 'Personal safety'],
    keywords: ['personal safety app', 'safety app features', 'how safety apps can help during emergencies', 'personal safety technology'],
    authorId: 'editorial',
    status: 'published',
    publishedAt: '2026-11-25',
    updatedAt: '2026-11-25',
    related: ['sos-and-trusted-contacts', 'live-location-safety', 'personal-safety-tips', 'location-privacy-checklist'],
    sources: [ERSS, { title: '112 India (ERSS)', publisher: 'Ministry of Home Affairs', url: 'https://112.gov.in/' }],
    accent: 'ink',
    art: 'Tech',
    body: [
      {
        type: 'p',
        text: 'Your phone is the most powerful safety tool you carry, but only if it is set up before you need it. Here is what helps, in order of importance.',
      },
      { type: 'h2', text: '1. Built into your phone' },
      {
        type: 'ul',
        items: [
          '**Emergency SOS:** both Android and iPhone can call emergency services and alert contacts with a button sequence. Turn it on and learn the gesture.',
          '**Medical ID and emergency contacts** visible on the lock screen.',
          '**Location sharing** with a few trusted people for journeys.',
          '**Find My Device / Find My** for a lost phone.',
        ],
      },
      { type: 'h2', text: '2. What a good safety app adds' },
      {
        type: 'table',
        head: ['Feature', 'Why it helps'],
        rows: [
          ['One-tap SOS with location', 'Alerts several trusted people at once with a link to where you are, even if you cannot talk.'],
          ['Trusted contacts', 'The people who actually act, chosen and briefed in advance.'],
          ['Time-limited live location', 'Someone can follow your journey; sharing ends automatically.'],
          ['Fake call', 'A socially easy way to leave an uncomfortable situation.'],
          ['Community reports', 'Warnings about unsafe places near you, from people nearby.'],
        ],
      },
      { type: 'h2', text: '3. Use them without giving away your privacy' },
      {
        type: 'ul',
        items: [
          'Prefer apps that share location only when you choose, for a set time.',
          'Check what an app collects and who can see it.',
          'Review location permissions regularly. See the [location privacy checklist](/blog/location-privacy-checklist).',
        ],
      },
      { type: 'h2', text: '4. Technology is only half of it' },
      {
        type: 'p',
        text: 'A tool helps only if the people on the other end know what to do. Brief your contacts (see [SOS and trusted contacts](/blog/sos-and-trusted-contacts)), keep your phone charged, and pair technology with the habits in [personal safety tips](/blog/personal-safety-tips). The 112 India app is another option for reaching emergency services.',
      },
      {
        type: 'callout',
        tone: 'info',
        title: 'How Sabhijude fits',
        text: 'Sabhijude brings these together: up to five trusted contacts, an SOS with a 3-second countdown that texts them a live-location link, time-limited [live location sharing](/blog/live-location-safety), a fake call, and community reports of unsafe places.',
      },
    ],
    faqs: [
      {
        question: 'How can technology help my personal safety?',
        answer:
          'Phone features like emergency SOS, medical ID and location sharing, plus safety apps that alert trusted contacts with your location in one tap, share journeys for a set time, offer a fake call, and warn about unsafe places nearby.',
      },
    ],
  },

  /* ---------------------------------------------------------------- crowds */
  {
    slug: 'crowd-safety',
    title: 'How to stay safe in crowded places and events',
    seoTitle: 'How to Stay Safe in Crowded Places and Events',
    description:
      'Festivals, concerts, stations, temples and rallies: how to spot a dangerous crowd early, protect yourself and children, and what organisers must plan for.',
    seoDescription:
      'Stay safe in crowds at festivals, concerts, stations and temples: spot danger early, protect children, what to do in a crush, and what organisers must plan.',
    category: 'personal-safety',
    tags: ['Crowds', 'Events', 'Festivals', 'Organisers'],
    keywords: ['crowd safety', 'how to stay safe in crowded places', 'stampede safety', 'event safety checklist', 'college event safety'],
    authorId: 'editorial',
    status: 'published',
    publishedAt: '2026-11-25',
    updatedAt: '2026-11-25',
    related: ['party-safety-tips', 'what-to-do-during-an-emergency', 'college-emergency-plan', 'personal-safety-tips'],
    sources: [NDMA, ERSS],
    accent: 'red',
    art: 'Crowd',
    body: [
      {
        type: 'p',
        text: 'Crowds are part of life in India: festivals, temple fairs, railway stations, concerts, college fests and sports events. Most are joyful. A few become dangerous very quickly, and knowing the early signs is what keeps you out of trouble.',
      },
      { type: 'h2', text: 'Before you go' },
      {
        type: 'ul',
        items: [
          'Go with others, agree a meeting point, and set a time to regroup.',
          'Carry a charged phone, a little cash and water; leave valuables at home.',
          'For children, write your phone number on a card in their pocket or on their wrist.',
          'Note the exits when you arrive.',
        ],
      },
      { type: 'h2', text: 'Signs a crowd is becoming dangerous' },
      {
        type: 'ul',
        items: [
          'You can no longer move freely, or you are being pushed without moving your own feet.',
          'The crowd sways or surges.',
          'People are climbing barriers or falling.',
          'Exits or narrow passages are packed solid.',
        ],
      },
      {
        type: 'p',
        text: 'If you notice these, leave early, moving diagonally towards the edge of the crowd, not against it.',
      },
      { type: 'h2', text: 'If you are caught in a crush' },
      {
        type: 'ol',
        items: [
          'Keep your arms up in front of your chest, like a boxer, to protect your breathing space.',
          'Stay on your feet; if you fall, get up immediately or curl up protecting your head.',
          'Move with the crowd’s flow and edge sideways between surges.',
          'Do not stop to pick up dropped belongings.',
          'Call 112 when you can, and help others up if it is safe.',
        ],
      },
      { type: 'h2', text: 'For organisers' },
      {
        type: 'ul',
        items: [
          'Plan capacity, entry and exit routes, and keep exits clear at all times.',
          'Trained volunteers and security at pinch points; a single control point in touch with the police.',
          'Medical posts and an ambulance on standby; a lost-children point.',
          'Clear announcements in local languages.',
          'Follow the National Disaster Management Authority’s guidance on managing crowds at events and venues of mass gathering, and get the required police and local permissions.',
        ],
      },
      {
        type: 'p',
        text: 'For college fests, add these to your [college emergency plan](/blog/college-emergency-plan). For nights out, see [party safety tips](/blog/party-safety-tips), and for the first minutes of any incident, [what to do in an emergency](/blog/what-to-do-during-an-emergency).',
      },
    ],
    faqs: [
      {
        question: 'What should I do if I am caught in a crowd crush?',
        answer:
          'Keep your arms up in front of your chest to protect your breathing, stay on your feet, move with the flow and edge sideways towards the side between surges, do not stop for belongings, and call 112 when you can.',
      },
      {
        question: 'How can event organisers prevent crowd accidents?',
        answer:
          'Plan capacity and keep entry and exit routes clear, place trained volunteers at pinch points, coordinate with the police from a single control point, provide medical posts, and follow NDMA’s crowd management guidance.',
      },
    ],
  },

  /* ---------------------------------------------------------------- voice cloning */
  {
    slug: 'voice-cloning-scams',
    title: 'Voice cloning scams: how to protect your family',
    seoTitle: 'Voice Cloning Scams: How to Protect Your Family',
    description:
      'A call that sounds exactly like your child or parent, asking for urgent money: how AI voice cloning works, the warning signs, and the simple family plan that defeats it.',
    seoDescription:
      'AI voice cloning scams use a few seconds of audio to fake a relative in trouble. Learn the warning signs, set a family code word, and know what to do if hit.',
    category: 'technology-ai-safety',
    tags: ['Voice cloning', 'AI scams', 'Family', 'Senior citizens'],
    keywords: ['voice cloning scam', 'what is voice cloning', 'AI scam calls', 'family code word', 'protect your family from AI scams'],
    authorId: 'editorial',
    status: 'published',
    publishedAt: '2026-11-25',
    updatedAt: '2026-11-25',
    related: ['ai-scams', 'deepfakes-what-to-do', 'social-engineering', 'protect-older-parents-from-scams'],
    sources: [NCRP, { title: 'Indian Computer Emergency Response Team (CERT-In)', publisher: 'Ministry of Electronics and Information Technology', url: 'https://www.cert-in.org.in/' }],
    accent: 'ink',
    art: 'Is it you?',
    body: [
      {
        type: 'p',
        text: '**Voice cloning** uses AI to copy a person’s voice from a short recording, such as a social media video or a voice note. Scammers use it to call relatives pretending to be a child, parent or friend in trouble, asking for money urgently. The voice can sound convincing, especially over a bad line and under stress.',
      },
      { type: 'h2', text: 'How the scam usually goes' },
      {
        type: 'ol',
        items: [
          'A call from an unknown number, often at night or when the person “in trouble” is known to be travelling.',
          'A familiar voice, crying or panicking: an accident, an arrest, a hospital, a kidnapping.',
          'Someone else takes over: a “police officer”, “doctor” or “lawyer”.',
          'An urgent demand for money by UPI or bank transfer, and a request to keep it secret.',
        ],
      },
      { type: 'h2', text: 'Warning signs' },
      {
        type: 'ul',
        items: [
          'Extreme urgency and secrecy: “Do not tell anyone, do not hang up.”',
          'A new or unknown number for someone you know.',
          'Payment by UPI, gift cards or crypto to someone else’s account.',
          'The person avoids questions or the call is short and emotional.',
        ],
      },
      { type: 'h2', text: 'The family plan that defeats it' },
      {
        type: 'ol',
        items: [
          '**Agree a family code word** that a genuine caller in trouble can say, and that is never posted online.',
          '**Hang up and call back** on the number you already have for that person, or someone who is with them.',
          '**Ask a question** only the real person would know.',
          '**Never pay** on the strength of a phone call alone.',
          'Tell older relatives that voices can now be faked, so they know to check.',
        ],
      },
      { type: 'h2', text: 'If you have paid' },
      {
        type: 'p',
        text: 'Call **1930** immediately, then your bank, and file a complaint at cybercrime.gov.in. Report the number on Chakshu at sancharsaathi.gov.in. See [common online scams in India](/blog/common-online-scams-india).',
      },
      {
        type: 'p',
        text: 'Voice cloning is one form of AI misuse; see [deepfakes: how to spot them](/blog/deepfakes-what-to-do), [social engineering](/blog/social-engineering), and [protecting older parents from scams](/blog/protect-older-parents-from-scams).',
      },
    ],
    faqs: [
      {
        question: 'How do voice cloning scams work?',
        answer:
          'Scammers copy a relative’s voice from a short recording online, call pretending they are in trouble, and demand urgent money, often handing over to a fake police officer or doctor and asking for secrecy.',
      },
      {
        question: 'How can I protect my family from voice cloning scams?',
        answer:
          'Agree a family code word, hang up and call back on a number you already have, ask a question only the real person would know, and never pay on the strength of a call alone. If you paid, call 1930 immediately.',
      },
    ],
  },
];
