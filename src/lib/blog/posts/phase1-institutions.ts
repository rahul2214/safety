import type { BlogPost, Source } from '../types';

/**
 * Phase 1 institution guides: ragging, school safety, workplace safety. Checked 2026-11-25:
 * - UGC Regulations on Curbing the Menace of Ragging in Higher Educational Institutions, 2009
 *   (amended): anti-ragging committee and squad, undertakings by students and parents at
 *   admission, punishments up to expulsion. Fine amounts differ between sources, so none quoted.
 * - School safety: Ministry of Education Guidelines on School Safety and Security (Oct 2021),
 *   NDMA School Safety Policy Guidelines, NCPCR Manual on Safety and Security of Children in Schools.
 * - Workplace: POSH Act 2013; OSH Code 2020 lets women work night shifts with consent and employer
 *   safety arrangements.
 */

const ERSS: Source = { title: 'Emergency Response Support System (112)', publisher: 'Ministry of Home Affairs', url: 'https://112.gov.in/' };
const ANTI: Source = { title: 'National Anti-Ragging Helpline (1800-180-5522)', publisher: 'University Grants Commission', url: 'https://www.antiragging.in/' };
const UGC: Source = { title: 'UGC Regulations on Curbing the Menace of Ragging, 2009 (and amendments)', publisher: 'University Grants Commission', url: 'https://www.ugc.gov.in/' };

export const PHASE1_INSTITUTION_POSTS: BlogPost[] = [
  /* ---------------------------------------------------------------- ragging */
  {
    slug: 'ragging-guide',
    title: 'Ragging in India: your rights and how to report it',
    seoTitle: 'Ragging in India: Your Rights and How to Report It',
    description:
      'What counts as ragging, why it is banned, what your college must do, and how students and parents can report it safely, including anonymously.',
    seoDescription:
      'What counts as ragging, what UGC rules require colleges to do, and how to report it on the anti-ragging helpline 1800-180-5522, to your college or the police.',
    category: 'college-safety',
    tags: ['Ragging', 'Students', 'Anti-ragging helpline', 'Parents'],
    keywords: ['ragging', 'how to report ragging', 'anti-ragging helpline', 'what is ragging', 'ragging in India'],
    authorId: 'editorial',
    status: 'published',
    publishedAt: '2026-11-25',
    updatedAt: '2026-11-25',
    related: ['harassment-in-college', 'college-freshers-safety-checklist', 'how-colleges-can-build-safer-campus', 'how-to-support-someone-being-harassed'],
    sources: [ANTI, UGC, ERSS],
    accent: 'coral',
    art: 'No',
    body: [
      {
        type: 'p',
        text: 'Ragging is banned in every college and university in India. You never have to go along with a “tradition” that humiliates, frightens or hurts you, and the rules put the responsibility on the institution, not on you, to stop it.',
      },
      { type: 'h2', text: 'What counts as ragging' },
      {
        type: 'p',
        text: 'Under the University Grants Commission’s anti-ragging regulations, ragging covers any act by students that causes, or is likely to cause, physical or psychological harm, fear or humiliation to another student, especially a fresher. It includes:',
      },
      {
        type: 'ul',
        items: [
          'Teasing, abuse or insults, in person or in messages and group chats.',
          'Forcing someone to do things they do not want to, from “introductions” and errands to anything sexual or degrading.',
          'Physical abuse, or threats of it.',
          'Taking money or belongings, or making someone do another student’s work.',
          'Isolating or targeting someone because of their region, language, caste, religion, gender, appearance or background.',
          'Abetting, encouraging or attempting any of the above.',
        ],
      },
      { type: 'h2', text: 'What your college must do' },
      {
        type: 'ul',
        items: [
          'Have an **Anti-Ragging Committee** and an **Anti-Ragging Squad**, with members’ contact details publicly displayed.',
          'Take undertakings from students and parents at admission that the student will not rag anyone.',
          'Act on complaints quickly and protect the student who complained.',
          'Punish students found guilty, with penalties that can include suspension, withholding results, debarment from hostels or exams, fines and expulsion.',
        ],
      },
      { type: 'h2', text: 'How to report ragging' },
      {
        type: 'ol',
        items: [
          '**Call the National Anti-Ragging Helpline on 1800-180-5522** (toll-free, 24 hours) or email helpline@antiragging.in. You can also register a complaint at [antiragging.in](https://www.antiragging.in). Complaints are passed to the college and monitored.',
          '**Tell your college:** the Anti-Ragging Committee or Squad, your warden, the dean of students or the principal.',
          '**Call 112** if you are hurt, threatened with violence or in danger.',
          '**Keep a record:** dates, places, names or descriptions, and screenshots of any messages. See [how to preserve digital evidence](/blog/how-to-preserve-digital-evidence).',
        ],
      },
      {
        type: 'callout',
        tone: 'info',
        title: 'Worried about being found out?',
        text: 'You can ask the helpline and your college to protect your identity. Retaliation against a student who reports ragging is itself something the institution must act on.',
      },
      { type: 'h2', text: 'If it is happening online' },
      {
        type: 'p',
        text: 'Ragging in class or hostel WhatsApp groups, or through anonymous accounts, still counts. Save the messages before leaving the group. Threats, sexual content and stalking can also be reported to the police at cybercrime.gov.in. See [cyberbullying: what to do](/blog/cyberbullying-india).',
      },
      { type: 'h2', text: 'For parents' },
      {
        type: 'ul',
        items: [
          'Ask open questions in the first weeks: who are they spending time with, how are seniors treating them?',
          'Watch for sudden withdrawal, not wanting to go back after a holiday, unexplained requests for money, or changes in sleep and mood.',
          'Save the helpline number yourself; parents can call it too.',
          'Support your child’s decision about reporting, and offer to go with them.',
        ],
      },
      { type: 'h2', text: 'If a friend is being ragged' },
      {
        type: 'p',
        text: 'Do not join in, even as a joke. Stay with them, help them record what happened, and offer to report together. See [how to support someone who is being harassed](/blog/how-to-support-someone-being-harassed). For sexual harassment by anyone on campus, the Internal Complaints Committee is the route: see [harassment in college](/blog/harassment-in-college).',
      },
    ],
    faqs: [
      {
        question: 'How do I report ragging in India?',
        answer:
          'Call the National Anti-Ragging Helpline on 1800-180-5522 (toll-free, 24 hours), email helpline@antiragging.in, or register at antiragging.in. Also tell your college’s Anti-Ragging Committee or warden, and call 112 if you are in danger.',
      },
      {
        question: 'Can I report ragging without revealing my name?',
        answer:
          'You can ask the helpline and your college to keep your identity protected. Colleges must also protect students who report ragging from retaliation.',
      },
      {
        question: 'Is ragging a criminal offence?',
        answer:
          'Ragging is banned in all higher education institutions under UGC regulations, and acts involved in ragging, such as assault, threats or sexual harassment, can also be offences under criminal law. Serious cases can be reported to the police as well as the college.',
      },
    ],
  },

  /* ---------------------------------------------------------------- school safety */
  {
    slug: 'school-safety-guide',
    title: 'School safety: a complete guide for schools in India',
    seoTitle: 'School Safety: A Complete Guide for Schools in India',
    description:
      'For principals, managements and teachers: the official guidelines, physical safety, child protection, emergencies, transport, bullying and how to make reporting work.',
    seoDescription:
      'A practical school safety guide for principals and teachers in India: official guidelines, child protection, emergencies, transport, bullying and reporting.',
    category: 'school-safety',
    tags: ['Schools', 'Child protection', 'Emergency preparedness', 'Principals'],
    keywords: ['school safety', 'school safety guidelines India', 'school safety checklist', 'child protection in schools', 'school emergency preparedness'],
    authorId: 'editorial',
    status: 'published',
    publishedAt: '2026-11-25',
    updatedAt: '2026-11-25',
    related: ['school-safety-checklist', 'school-emergency-preparedness', 'school-transport-safety', 'school-cyber-safety'],
    sources: [
      { title: 'Guidelines on School Safety and Security (2021)', publisher: 'Department of School Education & Literacy, Ministry of Education', url: 'https://dsel.education.gov.in/sites/default/files/update/guidelines_sss.pdf' },
      { title: 'Manual on Safety and Security of Children in Schools', publisher: 'National Commission for Protection of Child Rights', url: 'https://ncpcr.gov.in/uploads/165650391762bc3e6d27f93_manual-on-safety-and-security-of-children-in-schools-sep-2021.pdf' },
      { title: 'School Safety Policy Guidelines', publisher: 'National Disaster Management Authority', url: 'https://ndma.gov.in/' },
      { title: 'Childline 1098 and 112', publisher: 'Ministry of Home Affairs', url: 'https://112.gov.in/' },
    ],
    accent: 'blue',
    art: 'School',
    body: [
      {
        type: 'p',
        text: 'School safety is the management’s responsibility, and in India that responsibility is written down. This guide brings the main expectations together in one place, with practical steps for principals, managements and teachers. Always read the official documents in full, along with your state’s own directions.',
      },
      { type: 'h2', text: 'The official guidance' },
      {
        type: 'ul',
        items: [
          '**Guidelines on School Safety and Security (2021)** from the Ministry of Education, which fix accountability on school managements for children’s safety and apply to government and private schools.',
          '**School Safety Policy Guidelines** from the National Disaster Management Authority, covering disaster preparedness, drills and safety audits.',
          '**Manual on Safety and Security of Children in Schools** from the National Commission for Protection of Child Rights, with a safety plan and inspection checklist.',
          'The **POCSO Act, 2012**, under which anyone who knows of sexual abuse of a child must report it to the police or the Special Juvenile Police Unit.',
        ],
      },
      { type: 'h2', text: '1. Physical safety and access' },
      {
        type: 'ul',
        items: [
          'Control entry: visitor registers, ID badges, and a clear rule on who may collect a child.',
          'Police verification for all staff, including drivers, conductors, guards, cleaners and contractors.',
          'Regular checks of buildings, electrical fittings, water tanks, labs and playground equipment.',
          'Supervision of washrooms, corridors and play areas, with female staff where girls are concerned.',
          'CCTV in common areas where appropriate, with access to footage restricted and logged.',
        ],
      },
      { type: 'h2', text: '2. Child protection' },
      {
        type: 'ul',
        items: [
          'A written child protection policy that every staff member signs and is trained on.',
          'Clear rules on one-to-one contact, private messaging and social media contact between staff and students.',
          'Age-appropriate lessons on body safety, consent and who to tell.',
          'A named staff member responsible for child protection, known to every child and parent.',
          'Mandatory reporting under POCSO: concerns go to the police, not only to the management.',
        ],
      },
      { type: 'h2', text: '3. Emergency preparedness' },
      {
        type: 'ol',
        items: [
          'A written emergency plan for fire, earthquake, flood, medical emergencies, a missing child and an intruder.',
          'Mock drills at regular intervals, with evacuation routes and assembly points marked.',
          'Fire extinguishers checked and staff trained to use them; first-aid kits and trained first-aiders on every floor.',
          'An up-to-date emergency contact for every child, and a way to message all parents quickly.',
        ],
      },
      {
        type: 'p',
        text: 'The first minutes of any incident follow the same steps; see [what to do in an emergency](/blog/what-to-do-during-an-emergency).',
      },
      { type: 'h2', text: '4. Transport' },
      {
        type: 'ul',
        items: [
          'Verified, trained drivers and a conductor or attendant on every bus, with a female attendant where girls travel.',
          'Speed governors, first-aid kits, fire extinguishers and working doors and windows.',
          'Attendance on boarding and leaving, and a clear handover to a known adult.',
          'GPS tracking and an emergency contact number displayed in the bus.',
        ],
      },
      { type: 'h2', text: '5. Bullying and online safety' },
      {
        type: 'p',
        text: 'Have a written anti-bullying policy that covers online behaviour, train teachers to respond, and teach students how to block, report and tell an adult. Our guides on [cyberbullying](/blog/cyberbullying-india) and [online safety for children](/blog/children-online-safety-parents) can be shared with parents.',
      },
      { type: 'h2', text: '6. Make reporting easy and trusted' },
      {
        type: 'ul',
        items: [
          'Several ways to raise a concern: a trusted teacher, the counsellor, a complaint box and a digital form.',
          'An anonymous option for students who are afraid to be named. See [why anonymous reporting helps people speak up](/blog/why-anonymous-reporting-matters).',
          'A record of every concern, who handled it, and what was done.',
          'Feedback to the child and parents on what happened next.',
        ],
      },
      { type: 'h2', text: '7. Audit and review' },
      {
        type: 'p',
        text: 'Carry out a safety audit at least once a term using the NCPCR checklist, involve parents through the School Management Committee or PTA, and update your plans after every drill or incident.',
      },
      {
        type: 'callout',
        tone: 'info',
        title: 'Keep these numbers visible',
        text: '112 for any emergency, 1098 for Childline, and your nearest police station and hospital, displayed in the staff room, office and every school bus.',
      },
    ],
    faqs: [
      {
        question: 'What are the school safety guidelines in India?',
        answer:
          'The main references are the Ministry of Education’s Guidelines on School Safety and Security (2021), the NDMA School Safety Policy Guidelines, and the NCPCR Manual on Safety and Security of Children in Schools, along with the POCSO Act and your state’s directions.',
      },
      {
        question: 'Who is responsible for student safety in a school?',
        answer:
          'Under the 2021 guidelines, the school management is accountable for the safety and security of children while they are in school and on school transport.',
      },
    ],
  },

  /* ---------------------------------------------------------------- workplace safety */
  {
    slug: 'workplace-safety-guide',
    title: 'Workplace safety for employees: a complete guide',
    seoTitle: 'Workplace Safety for Employees: A Complete Guide',
    description:
      'Your rights, harassment and the POSH process, late-night and travel safety, emergencies at work, digital safety and how to raise a concern without fear.',
    seoDescription:
      'A practical workplace safety guide for employees in India: POSH rights, night shifts, travel, emergencies at the office, digital safety and how to report.',
    category: 'workplace-safety',
    tags: ['Employees', 'POSH', 'Night shifts', 'Emergencies'],
    keywords: ['workplace safety', 'employee safety', 'workplace safety for women', 'night shift safety', 'how to report workplace harassment'],
    authorId: 'editorial',
    status: 'published',
    publishedAt: '2026-11-25',
    updatedAt: '2026-11-25',
    related: ['workplace-harassment-posh', 'corporate-emergency-response-plan', 'company-anonymous-reporting', 'cab-safety-tips'],
    sources: [
      { title: 'SHe-Box: file a workplace sexual harassment complaint online', publisher: 'Ministry of Women and Child Development', url: 'https://shebox.wcd.gov.in/' },
      { title: 'Ministry of Labour and Employment (labour codes)', publisher: 'Government of India', url: 'https://labour.gov.in/' },
      ERSS,
    ],
    accent: 'ink',
    art: 'Work',
    body: [
      {
        type: 'p',
        text: 'Everyone has the right to work without being harassed, put in danger or afraid to speak up. This guide covers the main safety areas for employees in India, what your employer should provide, and what you can do yourself.',
      },
      { type: 'h2', text: '1. Harassment and the POSH Act' },
      {
        type: 'p',
        text: 'Sexual harassment at work, including messages, calls and behaviour outside office hours, is covered by the POSH Act, 2013. Organisations with ten or more workers must have an Internal Committee; others are covered by the district’s Local Committee. Complaints should normally be made in writing within three months. Read the full process in [how to report workplace sexual harassment](/blog/workplace-harassment-posh).',
      },
      {
        type: 'p',
        text: 'Bullying and harassment that are not sexual should still be reported to your manager or HR, and documented: dates, what was said or done, witnesses and messages.',
      },
      { type: 'h2', text: '2. Late hours and night shifts' },
      {
        type: 'ul',
        items: [
          'Under the Occupational Safety, Health and Working Conditions Code, 2020, women may work night shifts with their consent, and the employer must make prescribed arrangements for their safety, including transport.',
          'Ask what your company provides: verified cab services, doorstep drops, an escort or guard on late routes where the policy provides one, and a security contact on duty.',
          'Share your trip or live location on the way home. See [cab safety tips](/blog/cab-safety-tips).',
        ],
      },
      { type: 'h2', text: '3. Emergencies at work' },
      {
        type: 'ul',
        items: [
          'Know two exits from your floor and where the assembly point is.',
          'Find out who the first-aiders and fire wardens are, and where the first-aid kit and extinguishers are kept.',
          'Take part in drills; they are what make an evacuation orderly.',
          'Keep an emergency contact up to date with HR.',
        ],
      },
      {
        type: 'p',
        text: 'For the first minutes of any incident, see [what to do in an emergency](/blog/what-to-do-during-an-emergency).',
      },
      { type: 'h2', text: '4. Work travel' },
      {
        type: 'ul',
        items: [
          'Share your itinerary with a colleague or family member, and your company’s travel desk.',
          'Choose accommodation your company has vetted, and arrive in daylight where possible.',
          'Save local emergency numbers and the address of your hotel offline.',
        ],
      },
      { type: 'h2', text: '5. Digital safety' },
      {
        type: 'ul',
        items: [
          'Use unique passwords and two-step verification on work and personal accounts. See [strong passwords and two-step verification](/blog/strong-passwords-two-step-verification).',
          'Be suspicious of urgent requests for payments, gift cards or passwords, even if they appear to come from a senior colleague. Verify by phone.',
          'Report phishing emails to your IT team rather than just deleting them.',
        ],
      },
      { type: 'h2', text: '6. Raising a concern safely' },
      {
        type: 'ol',
        items: [
          'Write down what happened as soon as possible, with dates and witnesses.',
          'Use the channel that fits: your manager, HR, the Internal Committee, an ethics or whistle-blower line, or an anonymous reporting tool if your company has one.',
          'Keep copies of anything you submit.',
          'If you face retaliation, record it and report that too.',
          'For criminal behaviour, such as threats, assault or stalking, you can always go to the police as well.',
        ],
      },
      {
        type: 'p',
        text: 'If a colleague confides in you, read [how to support someone who is being harassed](/blog/how-to-support-someone-being-harassed).',
      },
      {
        type: 'callout',
        tone: 'info',
        title: 'For organisations',
        text: 'Sabhijude works with companies and institutions: employees can report incidents to their organisation’s team and receive safety broadcasts. Their SOS alerts go only to their own trusted contacts, never to the employer.',
      },
    ],
    faqs: [
      {
        question: 'Can women work night shifts in India?',
        answer:
          'Yes. Under the Occupational Safety, Health and Working Conditions Code, 2020, women may work night shifts with their consent, provided the employer makes the prescribed safety arrangements, including transport. State rules set the details.',
      },
      {
        question: 'Where can I report workplace harassment?',
        answer:
          'Sexual harassment goes to your organisation’s Internal Committee, or the district Local Committee if there is none, and can be filed online on SHe-Box. Other harassment can be raised with your manager or HR. Criminal behaviour can also be reported to the police.',
      },
    ],
  },
];
