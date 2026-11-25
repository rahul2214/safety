import type { BlogPost, Source } from '../types';

/**
 * Batch 4 (end of Phase 1, start of Phase 2): college emergency plan and reporting system, night
 * shifts, school bullying and emergency drills, cyber safety pillar, phishing, small business plan.
 * Checked 2026-11-25:
 * - CBSE Circular Acad-17/2015 (9 March 2015): an Anti-Bullying Committee may be constituted;
 *   schools should have a bullying prevention plan and display committee contacts and 1098.
 * - NCPCR "Preventing Bullying and Cyberbullying: Guidelines for Schools" (2023).
 * - RBI circular of 6 July 2017 on limiting customer liability: zero liability for third-party
 *   breaches reported within 3 working days; if the customer shared credentials, the customer
 *   bears the loss until it is reported.
 * - CERT-In's phishing-report address was not confirmed, so not quoted.
 */

const ERSS: Source = { title: 'Emergency Response Support System (112)', publisher: 'Ministry of Home Affairs', url: 'https://112.gov.in/' };
const NCRP: Source = { title: 'National Cyber Crime Reporting Portal (cybercrime.gov.in)', publisher: 'Ministry of Home Affairs', url: 'https://cybercrime.gov.in/' };
const NDMA: Source = { title: 'National Disaster Management Authority', publisher: 'Government of India', url: 'https://ndma.gov.in/' };
const CERTIN: Source = { title: 'Indian Computer Emergency Response Team (CERT-In)', publisher: 'Ministry of Electronics and Information Technology', url: 'https://www.cert-in.org.in/' };
const UGC: Source = { title: 'UGC regulations on sexual harassment and ragging in higher education', publisher: 'University Grants Commission', url: 'https://www.ugc.gov.in/' };
const RBI: Source = { title: 'Customer Protection: Limiting Liability of Customers in Unauthorised Electronic Banking Transactions (6 July 2017)', publisher: 'Reserve Bank of India', url: 'https://www.rbi.org.in/Scripts/NotificationUser.aspx?Id=11040' };

export const PHASE1_BATCH4_POSTS: BlogPost[] = [
  /* ---------------------------------------------------------------- college emergency plan */
  {
    slug: 'college-emergency-plan',
    title: 'College emergency response plan: a practical template',
    seoTitle: 'College Emergency Response Plan: A Practical Template',
    description:
      'For colleges and universities: roles, alerting students and staff, hostels, medical emergencies, missing students, threats and drills, with a template you can adapt.',
    seoDescription:
      'A practical emergency response plan for colleges in India: roles, campus-wide alerts, hostels, medical emergencies, missing students, threats and drills.',
    category: 'college-safety',
    tags: ['Colleges', 'Emergency plan', 'Hostels', 'Administrators'],
    keywords: ['college emergency plan', 'campus emergency preparedness', 'student emergency response plan', 'emergency communication for colleges'],
    authorId: 'editorial',
    status: 'published',
    publishedAt: '2026-11-25',
    updatedAt: '2026-11-25',
    related: ['how-colleges-can-build-safer-campus', 'college-safety-reporting-system', 'corporate-emergency-response-plan', 'what-to-do-during-an-emergency'],
    sources: [NDMA, ERSS, UGC],
    accent: 'blue',
    art: 'Campus plan',
    body: [
      {
        type: 'p',
        text: 'A campus is a small town: classrooms, labs, hostels, sports grounds, events and thousands of young people, many living away from home for the first time. An emergency plan makes sure that whatever happens, at 2 pm or 2 am, someone knows what to do and every student hears about it.',
      },
      { type: 'h2', text: '1. What the plan covers' },
      {
        type: 'ul',
        items: [
          'Fire, earthquake, flood and building incidents, including in labs and hostels.',
          'Medical emergencies, including mental health crises.',
          'A missing student, or a student in danger off campus.',
          'Violence, threats, or an intruder on campus.',
          'Large events: fests, sports days, convocations.',
          'Serious incidents online, such as threats or leaked images affecting students.',
        ],
      },
      { type: 'h2', text: '2. Roles, around the clock' },
      {
        type: 'table',
        head: ['Role', 'Responsibilities'],
        rows: [
          ['Incident lead (e.g. registrar or dean of students)', 'Decides on evacuation or lockdown, coordinates with police and hospitals, approves messages.'],
          ['Security control room', 'Takes alerts 24 hours a day, calls 112, dispatches guards, meets responders.'],
          ['Wardens', 'Hostel headcounts, student welfare at night, contact with families.'],
          ['Medical officer / first-aiders', 'Immediate care, ambulance coordination, hospital tie-ups.'],
          ['Counsellor', 'Support for students affected, during and after the incident.'],
          ['Communications', 'Campus-wide alerts, updates to parents and the public.'],
        ],
        caption: 'Name deputies for every role, and cover nights, weekends and holidays.',
      },
      { type: 'h2', text: '3. How students raise an alarm' },
      {
        type: 'ul',
        items: [
          'One security number every student saves on day one, displayed in hostels and classrooms.',
          'A way to alert security from anywhere, including off campus at night, that shares the student’s location.',
          'Clear guidance: call 112 first in a life-threatening emergency, then campus security.',
        ],
      },
      { type: 'h2', text: '4. Alerting everyone fast' },
      {
        type: 'p',
        text: 'Emails are too slow in an emergency. Plan a campus-wide alert that reaches phones directly, with ready templates for “evacuate”, “stay indoors”, “avoid this area” and “all clear”. Keep emergency contacts for every student and staff member, and test the alert each term.',
      },
      { type: 'h2', text: '5. Hostels' },
      {
        type: 'ul',
        items: [
          'Night-time headcount procedure and a register of students out late.',
          'Fire exits, extinguishers and alarms checked regularly; drills at night as well as by day.',
          'A clear procedure for a student who does not return: when to call family, when to call police.',
        ],
      },
      { type: 'h2', text: '6. Events' },
      {
        type: 'p',
        text: 'For fests and large events, add crowd limits, entry and exit plans, medical and security posts, a lost-and-found point for people as well as things, and a single control point in touch with the police.',
      },
      { type: 'h2', text: '7. Drills and review' },
      {
        type: 'p',
        text: 'Run drills each term in academic blocks and hostels, follow the National Disaster Management Authority’s guidance and your state’s directions, and review the plan after every incident.',
      },
      {
        type: 'p',
        text: 'For the wider picture, see [how colleges can build a safer campus](/blog/how-colleges-can-build-safer-campus) and [how colleges can build a safety reporting system](/blog/college-safety-reporting-system). The structure is similar to a [corporate emergency response plan](/blog/corporate-emergency-response-plan).',
      },
      {
        type: 'callout',
        tone: 'info',
        title: 'Where Sabhijude fits',
        text: 'Colleges on Sabhijude can send safety broadcasts to all their students at once and receive incident reports. A student’s SOS stays personal: it goes only to their own trusted contacts.',
      },
    ],
    faqs: [
      {
        question: 'What should a college emergency plan include?',
        answer:
          'The emergencies covered, 24-hour roles with deputies, one security number every student knows, a fast campus-wide alert, hostel procedures including missing students, event plans, and regular drills and reviews.',
      },
    ],
  },

  /* ---------------------------------------------------------------- college reporting system */
  {
    slug: 'college-safety-reporting-system',
    title: 'How colleges can build a safety reporting system',
    seoTitle: 'How Colleges Can Build a Safety Reporting System',
    description:
      'Make it easy and safe for students to report harassment, ragging, unsafe places and threats: channels, anonymity, triage, the statutory committees and feedback.',
    seoDescription:
      'Build a student safety reporting system that works: easy channels, anonymous reports, triage to the ICC and anti-ragging committee, records and feedback.',
    category: 'college-safety',
    tags: ['Colleges', 'Incident reporting', 'Anonymous reporting', 'Administrators'],
    keywords: ['incident reporting system for colleges', 'anonymous reporting in colleges', 'student incident reporting', 'how colleges handle safety complaints'],
    authorId: 'editorial',
    status: 'published',
    publishedAt: '2026-11-25',
    updatedAt: '2026-11-25',
    related: ['how-colleges-can-build-safer-campus', 'why-anonymous-reporting-matters', 'ragging-guide', 'harassment-in-college'],
    sources: [UGC, { title: 'National Anti-Ragging Helpline', publisher: 'University Grants Commission', url: 'https://www.antiragging.in/' }],
    accent: 'coral',
    art: 'Report',
    body: [
      {
        type: 'p',
        text: 'Most campus incidents are never reported. Students do not know where to go, fear being identified, or doubt anything will happen. A good reporting system fixes all three, and it is the foundation of every other safety effort, because you cannot fix what you never hear about.',
      },
      { type: 'h2', text: '1. Make it easy to report' },
      {
        type: 'ul',
        items: [
          'Several channels: a digital form or app, an email, a phone number, a box, and named staff.',
          'Available at any hour, including from off campus.',
          'Simple language and a short form: what, where, when, who (if known).',
          'Publicised from orientation onwards, in every hostel and department.',
        ],
      },
      { type: 'h2', text: '2. Offer anonymity, honestly' },
      {
        type: 'p',
        text: 'Let students report concerns such as unsafe places, patterns of behaviour or ragging without giving their name, and be clear about what anonymity means: hidden from other students and the people involved, not from a small, trained team. See [why anonymous reporting helps people speak up](/blog/why-anonymous-reporting-matters).',
      },
      { type: 'h2', text: '3. Route reports to the right body' },
      {
        type: 'table',
        head: ['Type of report', 'Goes to'],
        rows: [
          ['Sexual harassment', 'Internal Complaints Committee, under UGC regulations'],
          ['Ragging', 'Anti-Ragging Committee and Squad; the national helpline monitors complaints'],
          ['Immediate danger, violence, threats', 'Security control room and police (112)'],
          ['Unsafe places, lighting, infrastructure', 'Estates or facilities team, with a deadline'],
          ['Online harassment between students', 'Discipline committee, and police where it is a crime'],
          ['Mental health concerns', 'Counselling centre, urgently if there is risk'],
        ],
      },
      { type: 'h2', text: '4. Respond quickly and fairly' },
      {
        type: 'ul',
        items: [
          'Acknowledge every report within a day.',
          'Triage: anything involving immediate risk goes to security straight away.',
          'Investigate before acting against anyone; one report alone is not proof.',
          'Protect the reporter from retaliation, and act visibly when it happens.',
        ],
      },
      { type: 'h2', text: '5. Keep records and look for patterns' },
      {
        type: 'p',
        text: 'Log every report, decision and outcome. Several reports about the same place or person matter more than any single one. Review the log each term with the safety committee.',
      },
      { type: 'h2', text: '6. Close the loop' },
      {
        type: 'p',
        text: 'Tell the reporter what happened, as far as privacy allows, and publish an anonymised summary each term: what was reported, what changed. Visible action is what makes the next student report.',
      },
      {
        type: 'p',
        text: 'Share [how to report harassment in college](/blog/harassment-in-college) and the [guide to ragging](/blog/ragging-guide) with students so they know the routes.',
      },
      {
        type: 'callout',
        tone: 'info',
        title: 'Where Sabhijude fits',
        text: 'Students in a college on Sabhijude can report incidents to their campus team from the app, including anonymously to other students, and the campus team can broadcast safety updates back.',
      },
    ],
    faqs: [
      {
        question: 'How can colleges make students feel safe to report?',
        answer:
          'Offer several channels including an anonymous one, acknowledge reports quickly, route them to the right committee, protect reporters from retaliation, and publish what changed as a result.',
      },
    ],
  },

  /* ---------------------------------------------------------------- night shift */
  {
    slug: 'night-shift-employee-safety',
    title: 'Night-shift and late-working employee safety',
    seoTitle: 'Night-Shift Employee Safety: A Guide for Companies',
    description:
      'What employers should provide for employees working late or on night shifts, especially women, and what employees can do: consent, transport, security and emergencies.',
    seoDescription:
      'Keeping night-shift and late-working employees safe: consent and the OSH Code, safe transport, security at work, emergency contacts, and what employees can do.',
    category: 'corporate-safety',
    tags: ['Night shifts', 'Women employees', 'Transport', 'HR'],
    keywords: ['night shift employee safety', 'women employees night shift', 'employee transport safety', 'late night work safety'],
    authorId: 'editorial',
    status: 'published',
    publishedAt: '2026-11-25',
    updatedAt: '2026-11-25',
    related: ['workplace-safety-guide', 'cab-safety-tips', 'corporate-emergency-response-plan', 'workplace-harassment-posh'],
    sources: [{ title: 'Ministry of Labour and Employment (labour codes)', publisher: 'Government of India', url: 'https://labour.gov.in/' }, ERSS, { title: 'Women Helpline (181)', publisher: 'Ministry of Women and Child Development (myScheme)', url: 'https://www.myscheme.gov.in/schemes/whl-181' }],
    accent: 'ink',
    art: 'Late',
    body: [
      {
        type: 'p',
        text: 'Late shifts are normal in many industries, from IT and BPOs to hospitals, retail and logistics. The journey home and the quiet hours at work are where most of the risk lies, and where an employer’s planning makes the biggest difference.',
      },
      { type: 'h2', text: 'The legal position, briefly' },
      {
        type: 'p',
        text: 'Under the Occupational Safety, Health and Working Conditions Code, 2020, women may work night shifts with their consent, and the employer must make the safety arrangements prescribed by the government, including transport. State rules set the details, so check the rules that apply to your workplace. The POSH Act applies at all hours, including in company transport.',
      },
      { type: 'h2', text: 'What employers should provide' },
      {
        type: 'ul',
        items: [
          '**Consent and choice:** written consent for night work, with no penalty for declining.',
          '**Transport:** verified drivers and vehicles, GPS tracking, doorstep drops, sensible routing so no one is left alone with the driver for long stretches where avoidable, and an escort on late routes where your policy requires.',
          '**Security at work:** guarded entrances, lit car parks and walkways, CCTV in common areas, and staff not left alone in isolated areas.',
          '**A 24-hour contact:** a security or transport desk that answers and can act.',
          '**Emergency response:** a way for employees to raise an alert with their location, during the shift and on the way home.',
          '**Welfare:** rest areas, food, and access to the Internal Committee at any hour.',
        ],
      },
      { type: 'h2', text: 'What employees can do' },
      {
        type: 'ul',
        items: [
          'Check the cab’s number and driver against the transport roster or app before getting in. See [cab safety tips](/blog/cab-safety-tips).',
          'Share your trip with a family member or friend and message when you are home.',
          'Save the security desk and 112 as favourites.',
          'Report any unsafe driving, harassment or a mismatched vehicle immediately.',
          'Know your rights. See the [workplace safety guide](/blog/workplace-safety-guide) and [how to report workplace sexual harassment](/blog/workplace-harassment-posh).',
        ],
      },
      { type: 'h2', text: 'Put it in the emergency plan' },
      {
        type: 'p',
        text: 'Night shifts need their own section in the company’s [emergency response plan](/blog/corporate-emergency-response-plan): who leads at night, how wardens and first-aiders are covered, and how a late-shift employee in trouble on the way home is helped.',
      },
      {
        type: 'callout',
        tone: 'info',
        title: 'Where Sabhijude fits',
        text: 'Employees can share their live location with family for the ride home, and an SOS alerts their own trusted contacts with their location. SOS alerts are never sent to the employer.',
      },
    ],
    faqs: [
      {
        question: 'Can women work night shifts in India?',
        answer:
          'Yes. Under the OSH Code, 2020, women may work night shifts with their consent, provided the employer makes the prescribed safety arrangements, including transport. State rules set the details.',
      },
      {
        question: 'What transport safety should companies provide for night shifts?',
        answer:
          'Verified drivers and vehicles, GPS tracking, doorstep drops, careful routing, escorts on late routes where policy requires, and a 24-hour transport or security desk.',
      },
    ],
  },

  /* ---------------------------------------------------------------- school bullying */
  {
    slug: 'school-bullying-reports',
    title: 'How schools should handle bullying and cyberbullying',
    seoTitle: 'How Schools Should Handle Bullying and Cyberbullying',
    description:
      'Prevention, an anti-bullying committee, how teachers should respond to a report, working with parents, and cyberbullying that happens outside school hours.',
    seoDescription:
      'How schools in India should prevent and handle bullying and cyberbullying: anti-bullying committees, responding to reports, parents, and online incidents.',
    category: 'school-safety',
    tags: ['Bullying', 'Cyberbullying', 'Teachers', 'Schools'],
    keywords: ['cyberbullying prevention in schools', 'how schools handle bullying reports', 'anti bullying committee', 'how teachers respond to cyberbullying'],
    authorId: 'editorial',
    status: 'published',
    publishedAt: '2026-11-25',
    updatedAt: '2026-11-25',
    related: ['school-cyber-safety', 'cyberbullying-india', 'school-safety-guide', 'children-online-safety-parents'],
    sources: [
      { title: 'CBSE Circular: Prevention of Bullying and Ragging in Schools (Acad-17/2015)', publisher: 'Central Board of Secondary Education', url: 'https://cbseacademic.nic.in/web_material/Circulars/2015/17_Prevention%20of%20Bullying%20&%20Ragging%20in%20Schools.pdf' },
      { title: 'Preventing Bullying and Cyberbullying: Guidelines for Schools', publisher: 'National Commission for Protection of Child Rights', url: 'https://www.ncpcr.gov.in/uploads/1702548255657ad31ff39b4_preventing-bullying-and-cyberbullying-guidelines-for-schools.pdf' },
    ],
    accent: 'coral',
    art: 'Stop it',
    body: [
      {
        type: 'p',
        text: 'Bullying is repeated, deliberate behaviour meant to hurt, frighten or exclude, and today much of it happens on phones. Schools cannot control every group chat, but they can make bullying unacceptable, easy to report and consistently dealt with.',
      },
      { type: 'h2', text: 'What the guidance says' },
      {
        type: 'ul',
        items: [
          'The CBSE’s 2015 circular on preventing bullying and ragging recommends an **Anti-Bullying Committee** (for example the vice-principal, a senior teacher, the counsellor, the school doctor, a parent and a management representative), a school bullying prevention plan, awareness programmes, and displaying the committee’s contacts and Childline 1098.',
          'The National Commission for Protection of Child Rights has published guidelines on preventing bullying and cyberbullying in schools, which also address incidents that happen online.',
          'Check the directions from your own board and state as well.',
        ],
      },
      { type: 'h2', text: 'Prevention' },
      {
        type: 'ul',
        items: [
          'A written anti-bullying policy that explicitly covers online behaviour and is shared with students and parents.',
          'Lessons on kindness, consent, online behaviour and being an upstander rather than a bystander.',
          'Supervision of the places bullying happens: corridors, toilets, buses, playgrounds.',
          'Teachers trained to notice signs: isolation, falling marks, reluctance to come to school.',
        ],
      },
      { type: 'h2', text: 'When a child reports bullying' },
      {
        type: 'ol',
        items: [
          'Listen, believe them, and thank them for telling you.',
          'Make sure they are safe now, and agree what will happen next.',
          'Record what they said, with dates, and save any screenshots they share. Do not forward or keep sexual images of a child; note the details instead.',
          'Inform the anti-bullying committee or designated staff member.',
          'Speak to the children involved separately; focus on stopping the behaviour and repairing harm.',
          'Inform parents of both sides, and follow up with the child after a week and a month.',
        ],
      },
      { type: 'h2', text: 'Cyberbullying outside school hours' },
      {
        type: 'p',
        text: 'If it involves students and affects school life, the school should act. Help the child save evidence, block and report on the app, and involve parents. Threats, sexual content and impersonation can be crimes: involve the police, and use cybercrime.gov.in’s section for crimes against children. Parents can read [cyberbullying: what to do](/blog/cyberbullying-india) and [online safety for children](/blog/children-online-safety-parents).',
      },
      { type: 'h2', text: 'Working with parents' },
      {
        type: 'p',
        text: 'Share the policy at admission, explain how to report, and keep parents informed about incidents involving their child. Parents of children who bully need support too; the aim is to change behaviour.',
      },
      {
        type: 'p',
        text: 'Build this into your wider [school safety guide](/blog/school-safety-guide) and the termly [school safety checklist](/blog/school-safety-checklist).',
      },
    ],
    faqs: [
      {
        question: 'Do schools in India need an anti-bullying committee?',
        answer:
          'The CBSE’s 2015 circular recommends an anti-bullying committee and a school bullying prevention plan, and the NCPCR has issued guidelines for schools on bullying and cyberbullying. Check your board’s and state’s current directions.',
      },
      {
        question: 'Should schools act on cyberbullying that happens at home?',
        answer:
          'Yes, when it involves students and affects school life. Help the child save evidence, involve parents, apply the school’s policy, and involve the police where it may be a crime.',
      },
    ],
  },

  /* ---------------------------------------------------------------- school emergency */
  {
    slug: 'school-emergency-preparedness',
    title: 'School emergency preparedness: plan and drills',
    seoTitle: 'School Emergency Preparedness: Plan and Drills',
    description:
      'A school emergency plan for fire, earthquake, flood, medical emergencies, a missing child and an intruder: roles, evacuation, parent communication and drills.',
    seoDescription:
      'School emergency preparedness in India: an emergency plan for fire, earthquake, medical incidents, a missing child or intruder, with drills and parent alerts.',
    category: 'school-safety',
    tags: ['Schools', 'Emergency plan', 'Drills', 'Fire safety'],
    keywords: ['school emergency preparedness', 'school emergency plan', 'school fire drill', 'first aid in schools', 'school disaster management plan'],
    authorId: 'editorial',
    status: 'published',
    publishedAt: '2026-11-25',
    updatedAt: '2026-11-25',
    related: ['school-safety-guide', 'school-safety-checklist', 'what-to-do-during-an-emergency', 'emergency-preparedness-checklist'],
    sources: [NDMA, ERSS, { title: 'Guidelines on School Safety and Security (2021)', publisher: 'Department of School Education & Literacy, Ministry of Education', url: 'https://dsel.education.gov.in/sites/default/files/update/guidelines_sss.pdf' }],
    accent: 'red',
    art: 'Drill',
    body: [
      {
        type: 'p',
        text: 'Children follow the adults around them in an emergency. A plan that every teacher knows, practised in regular drills, is what turns panic into a calm walk to the assembly point. The National Disaster Management Authority’s school safety guidance and your state’s directions are the starting point; this is how to put them into practice.',
      },
      { type: 'h2', text: '1. Know your risks' },
      {
        type: 'p',
        text: 'List the hazards that apply to your school: fire, earthquake (depending on your seismic zone), flood or waterlogging, heat waves, building or wall collapse, road accidents near the gate, medical emergencies, a missing child, and an intruder or threat.',
      },
      { type: 'h2', text: '2. Assign roles' },
      {
        type: 'ul',
        items: [
          '**Incident lead:** the principal or a deputy, who decides and calls 112.',
          '**Class teachers:** lead their class out and take the register at the assembly point.',
          '**Floor marshals:** check toilets, labs and empty rooms.',
          '**First-aiders:** at least one trained person per floor and on every bus.',
          '**Gate and office staff:** control entry, meet emergency services, manage parent pickup.',
          '**Support for children with disabilities:** a named adult for each child who needs help moving.',
        ],
      },
      { type: 'h2', text: '3. Evacuation, shelter and lockdown' },
      {
        type: 'table',
        head: ['Situation', 'Response'],
        rows: [
          ['Fire', 'Evacuate by the nearest safe route to the assembly point; never use lifts; do not stop for bags.'],
          ['Earthquake', 'Drop, cover and hold on until shaking stops, then evacuate to open ground away from buildings and walls.'],
          ['Intruder or threat', 'Lockdown: children inside rooms away from doors and windows, doors locked, silence, wait for the all clear.'],
          ['Severe weather or flood', 'Shelter in safe, higher parts of the building; follow official warnings.'],
        ],
      },
      { type: 'h2', text: '4. Medical emergencies' },
      {
        type: 'ul',
        items: [
          'Medical information for every child, including allergies, asthma and epilepsy, available to class teachers.',
          'First-aid kits on every floor and bus; staff trained in first aid and, ideally, CPR.',
          'A tie-up with the nearest hospital, and a clear process: call 108 or 112, inform parents, send a staff member with the child.',
        ],
      },
      { type: 'h2', text: '5. A missing child' },
      {
        type: 'p',
        text: 'Act immediately: search the premises and bus, check with the class teacher and friends, call the parents, and inform the police without delay. Never wait to “see if they turn up”.',
      },
      { type: 'h2', text: '6. Communicating with parents' },
      {
        type: 'ul',
        items: [
          'Up-to-date emergency contacts for every child.',
          'A way to message all parents at once, with ready templates.',
          'A controlled pickup point and an ID check before releasing any child.',
        ],
      },
      { type: 'h2', text: '7. Drills' },
      {
        type: 'p',
        text: 'Run fire and earthquake drills at least once a term, and practise lockdown with older children. Time each drill, note what went wrong, and fix it. Check equipment such as extinguishers and alarms on a schedule.',
      },
      {
        type: 'p',
        text: 'For everything else, see the [school safety guide](/blog/school-safety-guide) and the termly [school safety checklist](/blog/school-safety-checklist). Staff can also read [what to do in an emergency](/blog/what-to-do-during-an-emergency).',
      },
    ],
    faqs: [
      {
        question: 'What should a school emergency plan include?',
        answer:
          'The hazards that apply, named roles, evacuation, shelter and lockdown procedures, medical emergency steps, a missing-child procedure, parent communication and pickup, and a schedule of drills and equipment checks.',
      },
    ],
  },

  /* ---------------------------------------------------------------- cyber safety pillar */
  {
    slug: 'cyber-safety-guide',
    title: 'Cyber safety: a complete guide to staying safe online',
    seoTitle: 'Cyber Safety: A Complete Guide to Staying Safe Online',
    description:
      'Accounts, passwords, scams, privacy, devices and what to do when something goes wrong: the essentials of staying safe online in India, with links to detailed guides.',
    seoDescription:
      'A complete cyber safety guide for India: secure accounts, spot scams and phishing, protect your privacy and phone, and know where to report cybercrime.',
    category: 'cyber-safety',
    tags: ['Cyber safety', 'Online safety', 'Pillar guide'],
    keywords: ['cyber safety', 'online safety', 'how to stay safe online', 'what is cyber safety', 'cybersecurity awareness checklist'],
    authorId: 'editorial',
    status: 'published',
    publishedAt: '2026-11-25',
    updatedAt: '2026-11-25',
    related: ['common-online-scams-india', 'strong-passwords-two-step-verification', 'social-media-privacy-settings', 'cybercrime-portal-guide'],
    sources: [CERTIN, NCRP, { title: 'Sanchar Saathi', publisher: 'Department of Telecommunications', url: 'https://www.sancharsaathi.gov.in/' }],
    accent: 'blue',
    art: 'Online',
    body: [
      {
        type: 'p',
        text: '**Cyber safety** means protecting yourself, your accounts, your money and your privacy online. You do not need to be technical. A handful of habits stop most problems, and knowing where to report the rest means you can act fast.',
      },
      { type: 'h2', text: '1. Lock down your accounts' },
      {
        type: 'ul',
        items: [
          'A unique, long password for your email, with two-step verification.',
          'Two-step verification on WhatsApp, social media and banking.',
          'Never share an OTP or PIN with anyone.',
        ],
      },
      {
        type: 'p',
        text: 'Details: [strong passwords and two-step verification](/blog/strong-passwords-two-step-verification) and [WhatsApp safety settings](/blog/whatsapp-safety-settings).',
      },
      { type: 'h2', text: '2. Recognise scams and phishing' },
      {
        type: 'p',
        text: 'Most scams rely on urgency, fear or greed, and on getting you to click a link, install an app, share a code or send money. Learn the patterns in [common online scams in India](/blog/common-online-scams-india) and [how to recognise a phishing message](/blog/phishing-explained).',
      },
      { type: 'h2', text: '3. Protect your privacy' },
      {
        type: 'ul',
        items: [
          'Make profiles private, hide friends lists, and keep your phone number and address off public pages. See [social media privacy settings](/blog/social-media-privacy-settings).',
          'Control who can see your location. See the [location privacy checklist](/blog/location-privacy-checklist).',
          'Think before posting photos that show your home, routine or documents.',
        ],
      },
      { type: 'h2', text: '4. Secure your phone' },
      {
        type: 'ul',
        items: [
          'Screen lock, automatic updates, and apps only from official stores.',
          'Review app permissions, especially location, contacts and accessibility.',
          'Note your IMEI number, and know how to block a lost phone. See [lost or stolen phone](/blog/lost-or-stolen-phone-india).',
        ],
      },
      { type: 'h2', text: '5. Know what to do when something goes wrong' },
      {
        type: 'table',
        head: ['Problem', 'First step'],
        rows: [
          ['Lost money to fraud', 'Call **1930** immediately, then your bank'],
          ['Account hacked', '[Recover and lock it down](/blog/account-hacked-what-to-do)'],
          ['Harassment or threats', '[Respond safely and report](/blog/online-harassment-guide)'],
          ['Photos threatened or shared', '[Do not pay; get them removed](/blog/someone-threatening-to-leak-photos)'],
          ['Suspicious call or SMS, no loss', 'Report on Chakshu at sancharsaathi.gov.in'],
          ['Any cybercrime', 'File at [cybercrime.gov.in](/blog/cybercrime-portal-guide)'],
        ],
      },
      { type: 'h2', text: '6. Help your family' },
      {
        type: 'p',
        text: 'Children and older relatives are often targeted. See [online safety for children](/blog/children-online-safety-parents) and [protecting older parents from scams](/blog/protect-older-parents-from-scams).',
      },
      {
        type: 'callout',
        tone: 'success',
        title: 'The five-minute version',
        text: 'Unique email password with two-step verification. Never share OTPs. Private profiles. Updates on. 1930 saved in your phone.',
      },
    ],
    faqs: [
      {
        question: 'What is cyber safety?',
        answer:
          'Cyber safety means protecting yourself, your accounts, money and privacy online: secure passwords and two-step verification, recognising scams, privacy settings, a secure phone, and knowing where to report problems.',
      },
      {
        question: 'Where do I report cybercrime in India?',
        answer:
          'Call 1930 for financial fraud and file a complaint at cybercrime.gov.in for any cybercrime. You can also go to a police station or cyber cell.',
      },
    ],
  },

  /* ---------------------------------------------------------------- phishing */
  {
    slug: 'phishing-explained',
    title: 'How to recognise a phishing message (with examples)',
    seoTitle: 'How to Recognise a Phishing Message (With Examples)',
    description:
      'The tell-tale signs of fake SMS, WhatsApp messages, emails and calls, typical Indian examples, and exactly what to do if you have already clicked or paid.',
    seoDescription:
      'Spot phishing SMS, WhatsApp and emails: warning signs, typical Indian examples, what to do if you clicked a link, and how fast reporting protects your money.',
    category: 'cyber-safety',
    tags: ['Phishing', 'Scams', 'SMS', 'Email'],
    keywords: ['phishing', 'how to recognize phishing', 'clicked a suspicious link', 'phishing awareness for employees', 'fake SMS'],
    authorId: 'editorial',
    status: 'published',
    publishedAt: '2026-11-25',
    updatedAt: '2026-11-25',
    related: ['employee-cyber-safety', 'common-online-scams-india', 'account-hacked-what-to-do', 'social-engineering'],
    sources: [NCRP, RBI, { title: 'Sanchar Saathi: Chakshu', publisher: 'Department of Telecommunications', url: 'https://www.sancharsaathi.gov.in/' }],
    accent: 'red',
    art: 'Fake?',
    body: [
      {
        type: 'p',
        text: '**Phishing** is a message designed to trick you into giving away a password, OTP, card details or money, or into installing a harmful app. It arrives by SMS, WhatsApp, email, social media or phone call, and it usually pretends to come from someone you trust: your bank, a delivery company, the electricity board, the government, your boss.',
      },
      { type: 'h2', text: 'Warning signs' },
      {
        type: 'ul',
        items: [
          '**Urgency or fear:** “Your account will be blocked today”, “Your power will be cut at 9:30 pm”.',
          '**A link to click** or an app (often an APK file) to install.',
          '**A request for a code,** PIN, password or card details.',
          '**A sender that does not quite match:** a personal mobile number claiming to be a bank, or a website address with extra words or misspellings.',
          '**Too good to be true:** refunds, prizes, jobs that pay for likes.',
          '**Unusual requests from a “boss” or friend:** buy gift cards, transfer money urgently, keep it confidential.',
        ],
      },
      { type: 'h2', text: 'Typical examples in India' },
      {
        type: 'ul',
        items: [
          'An SMS saying your KYC has expired and your account will be frozen unless you click a link.',
          'A WhatsApp message with a “wedding invitation” or “challan” file that is actually an app.',
          'A “courier” message about a failed delivery asking for a small fee.',
          'An email that looks like your company’s IT team asking you to “verify” your password.',
          'A message from a new number with a friend’s photo, asking for urgent money.',
        ],
      },
      { type: 'h2', text: 'Check before you act' },
      {
        type: 'ol',
        items: [
          'Do not click. Open the official app or type the website address yourself.',
          'Call the organisation or person on a number you already know.',
          'Never install apps from links in messages.',
          'Check numbers and UPI IDs with “Report and Check Suspect” on the cybercrime portal. See [the cybercrime.gov.in guide](/blog/cybercrime-portal-guide).',
        ],
      },
      { type: 'h2', text: 'If you already clicked, typed or paid' },
      {
        type: 'ol',
        items: [
          '**Lost money?** Call **1930** immediately, then your bank, and file at cybercrime.gov.in.',
          '**Entered a password?** Change it now, everywhere you used it, and turn on two-step verification. See [account hacked](/blog/account-hacked-what-to-do).',
          '**Installed an app?** Uninstall it, disconnect from mobile data and Wi-Fi, and check banking apps; consider a factory reset after backing up.',
          '**Shared card details?** Block the card through your bank’s app or helpline.',
        ],
      },
      {
        type: 'callout',
        tone: 'info',
        title: 'Real rule: report fast to limit your loss',
        text: 'Under the Reserve Bank of India’s 2017 directions on unauthorised electronic transactions, a customer has zero liability for a third-party fraud reported to the bank within three working days. If the loss happened because you shared credentials such as an OTP, you bear the loss until you report it, so report the moment you realise.',
      },
      { type: 'h2', text: 'Report it even if you did not fall for it' },
      {
        type: 'p',
        text: 'Report suspected fraud calls, SMS and WhatsApp messages on **Chakshu** at sancharsaathi.gov.in so the numbers can be checked and disconnected. At work, forward phishing emails to your IT or security team. More scams to watch for: [common online scams in India](/blog/common-online-scams-india).',
      },
    ],
    faqs: [
      {
        question: 'How do I recognise a phishing message?',
        answer:
          'Look for urgency or fear, a link or app to install, a request for a code, PIN or password, a sender that does not match the organisation, offers that are too good to be true, or unusual money requests from a “boss” or friend.',
      },
      {
        question: 'What should I do if I clicked a suspicious link?',
        answer:
          'If you lost money, call 1930 and your bank immediately. If you entered a password, change it and turn on two-step verification. If you installed an app, uninstall it and disconnect from the internet, and consider a factory reset after backing up.',
      },
    ],
  },

  /* ---------------------------------------------------------------- small business plan */
  {
    slug: 'business-emergency-plan',
    title: 'Small business emergency plan: a one-page template',
    seoTitle: 'Small Business Emergency Plan: A One-Page Template',
    description:
      'For shops, restaurants, clinics and offices: a simple plan for fire, medical emergencies, theft, abusive customers and power cuts, that your whole team can follow.',
    seoDescription:
      'A one-page emergency plan for small businesses in India: fire, medical emergencies, theft, abusive customers and power cuts, with roles and a staff checklist.',
    category: 'business-safety',
    tags: ['Small business', 'Emergency plan', 'Shops', 'Restaurants'],
    keywords: ['business emergency plan', 'small business emergency preparedness', 'small business safety checklist', 'business emergency response plan'],
    authorId: 'editorial',
    status: 'published',
    publishedAt: '2026-11-25',
    updatedAt: '2026-11-25',
    related: ['business-safety-guide', 'customer-harassment-response', 'corporate-emergency-response-plan', 'what-to-do-during-an-emergency'],
    sources: [NDMA, ERSS],
    accent: 'coral',
    art: '1 page',
    body: [
      {
        type: 'p',
        text: 'A small business does not need a thick manual. It needs one page that every staff member has read, a few things in the right place, and a quick practice now and then. Check the fire safety and licensing rules that apply to your premises and state.',
      },
      { type: 'h2', text: 'The one-page plan' },
      {
        type: 'ol',
        items: [
          '**Address and numbers:** your exact address and landmark, 112, 108, 101, the nearest hospital and police station, your landlord or building manager.',
          '**Who is in charge:** the owner or manager on each shift, and a deputy.',
          '**Exits and meeting point:** two ways out, and where everyone meets outside.',
          '**Where things are:** fire extinguisher, first-aid kit, main power switch, gas valve, torch.',
          '**What to do** in each situation below.',
          '**Staff contacts:** an emergency contact for every staff member.',
        ],
      },
      { type: 'h2', text: 'What to do' },
      {
        type: 'table',
        head: ['Situation', 'Steps'],
        rows: [
          ['Fire', 'Raise the alarm, get everyone out, call 101 or 112, use an extinguisher only on a small fire with a clear exit behind you, switch off gas if safe.'],
          ['Customer or staff collapses', 'Call 108 or 112, send someone to meet the ambulance, give first aid if trained, keep the area clear.'],
          ['Theft or robbery', 'Do not resist; your safety matters more than stock or cash. Note descriptions, call 112, preserve CCTV.'],
          ['Abusive or threatening customer', 'Stay calm, keep a counter between you, call a colleague, ask them to leave, call 112 if they threaten or become violent.'],
          ['Power cut or gas leak', 'Torches ready; for a gas smell, no switches or flames, open windows, shut the valve, get out and call for help.'],
        ],
      },
      { type: 'h2', text: 'Protecting your staff' },
      {
        type: 'ul',
        items: [
          'Nobody should open or close alone late at night if it can be avoided.',
          'Staff working late should have a safe way home; see [night-shift employee safety](/blog/night-shift-employee-safety).',
          'A clear rule that staff never have to put up with harassment from customers, and that they will be backed up.',
          'If you have ten or more workers, you need an Internal Committee under the POSH Act; smaller businesses are covered by the district Local Committee. See the [workplace safety guide](/blog/workplace-safety-guide).',
        ],
      },
      { type: 'h2', text: 'Practise' },
      {
        type: 'p',
        text: 'Walk new staff through the plan on their first day, and run a short drill every few months. Check that extinguishers are serviced and the first-aid kit is stocked. Larger premises can follow the fuller [corporate emergency response plan](/blog/corporate-emergency-response-plan), and every staff member can read [what to do in an emergency](/blog/what-to-do-during-an-emergency).',
      },
    ],
    faqs: [
      {
        question: 'What should a small business emergency plan include?',
        answer:
          'Your address and key emergency numbers, who is in charge on each shift, two exits and a meeting point, where safety equipment and switches are, simple steps for fire, medical emergencies, theft, abusive customers and power cuts, and staff emergency contacts.',
      },
    ],
  },
];
