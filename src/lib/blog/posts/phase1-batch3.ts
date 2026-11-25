import type { BlogPost, Source } from '../types';

/**
 * Phase 1, batch 3: hostels, location privacy, public transport, school checklist, persistent
 * messaging, being tracked online, corporate emergency plan, anonymous reporting for companies.
 * Checked 2026-11-25:
 * - RPF "Meri Saheli" (launched 29 Oct 2020): women RPF teams brief women travelling alone at
 *   the originating station and stay in touch through the journey. Rail Madad 139.
 * - Vigil mechanism: SEBI LODR regulation 22 (every listed entity) and Companies Act s.177(9)
 *   (listed companies and prescribed classes). Legal challenges exist; framed generally.
 * Sabhijude claims follow the app (see other post files).
 */

const ERSS: Source = { title: 'Emergency Response Support System (112)', publisher: 'Ministry of Home Affairs', url: 'https://112.gov.in/' };
const NCRP: Source = { title: 'National Cyber Crime Reporting Portal (cybercrime.gov.in)', publisher: 'Ministry of Home Affairs', url: 'https://cybercrime.gov.in/' };
const RAIL: Source = { title: 'Rail Madad (139)', publisher: 'Ministry of Railways', url: 'https://railmadad.indianrailways.gov.in/' };
const NDMA: Source = { title: 'National Disaster Management Authority', publisher: 'Government of India', url: 'https://ndma.gov.in/' };
const CERTIN: Source = { title: 'Indian Computer Emergency Response Team (CERT-In)', publisher: 'Ministry of Electronics and Information Technology', url: 'https://www.cert-in.org.in/' };

export const PHASE1_BATCH3_POSTS: BlogPost[] = [
  /* ---------------------------------------------------------------- hostels */
  {
    slug: 'hostel-safety-tips',
    title: 'Hostel and PG safety tips for students',
    seoTitle: 'Hostel and PG Safety Tips for Students',
    description:
      'Choosing a safe hostel or PG, securing your room and belongings, roommates and visitors, late returns, and what to do when something goes wrong.',
    seoDescription:
      'Hostel and PG safety for students in India: choosing a safe place, securing your room, visitors and late returns, and who to call when something goes wrong.',
    category: 'student-safety',
    tags: ['Hostels', 'PG', 'Students', 'Checklist'],
    keywords: ['hostel safety tips', 'PG safety', 'hostel safety checklist', 'students living away from home'],
    authorId: 'editorial',
    status: 'published',
    publishedAt: '2026-11-25',
    updatedAt: '2026-11-25',
    related: ['college-freshers-safety-checklist', 'student-safety-india-guide', 'ragging-guide', 'emergency-contact-checklist'],
    sources: [ERSS, { title: 'National Anti-Ragging Helpline', publisher: 'University Grants Commission', url: 'https://www.antiragging.in/' }],
    accent: 'blue',
    art: 'Room',
    body: [
      {
        type: 'p',
        text: 'A hostel or PG is home for most of the year, so it is worth getting the basics right in the first week. This checklist works for college hostels, private hostels, PGs and shared flats.',
      },
      { type: 'h2', text: 'Choosing a PG or private hostel' },
      {
        type: 'ul',
        items: [
          'Visit in person, ideally once in the evening, to see the lighting and the road.',
          'Check the main door, room locks, window grills and whether there is a guard or warden at night.',
          'Ask whether staff such as cooks, cleaners and guards are police-verified.',
          'Talk to current residents away from the owner.',
          'Get a written agreement with rules on visitors, timings and deposits.',
          'Note the distance to the nearest hospital, police station and main road.',
        ],
      },
      { type: 'h2', text: 'Your room and belongings' },
      {
        type: 'ul',
        items: [
          'Lock your room and cupboard every time, even for a few minutes.',
          'Keep valuables, documents and cash locked away; keep digital copies of IDs in DigiLocker.',
          'Do not lend your room key, ID card or hostel card.',
          'Use a screen lock on your laptop and phone.',
        ],
      },
      { type: 'h2', text: 'People and visitors' },
      {
        type: 'ul',
        items: [
          'Do not share your room number or hostel address on public social media.',
          'Do not open the door to unexpected visitors; check with the warden or security.',
          'Agree basic rules with roommates about guests and locking up.',
          'If a senior, staff member or anyone else makes you uncomfortable, tell the warden. Ragging in hostels is banned; see our [guide to ragging](/blog/ragging-guide).',
        ],
      },
      { type: 'h2', text: 'Late returns and going out' },
      {
        type: 'ul',
        items: [
          'Know the curfew and who to call if you will be late.',
          'Tell a roommate where you are going and when you expect to be back.',
          'Share your [live location](/blog/live-location-safety) for late journeys, and book cabs through an app.',
        ],
      },
      { type: 'h2', text: 'Emergencies' },
      {
        type: 'ul',
        items: [
          'Save 112, the warden, hostel security and the nearest hospital. See [emergency contact list](/blog/emergency-contact-checklist).',
          'Know the fire exits and where the extinguishers are.',
          'Keep a small first-aid kit and any medicines you need.',
        ],
      },
      {
        type: 'p',
        text: 'Starting out? Use the [college freshers safety checklist](/blog/college-freshers-safety-checklist), and for everything else read the [student safety guide](/blog/student-safety-india-guide).',
      },
    ],
    faqs: [
      {
        question: 'How do I choose a safe PG?',
        answer:
          'Visit in the evening, check door and window locks and night security, ask whether staff are police-verified, talk to current residents privately, and get a written agreement on rules and deposits.',
      },
    ],
  },

  /* ---------------------------------------------------------------- location privacy */
  {
    slug: 'location-privacy-checklist',
    title: 'Location privacy: who can see where you are?',
    seoTitle: 'Location Privacy Checklist: Who Can See Where You Are?',
    description:
      'Apps, people, photos and devices can all reveal your location. A ten-minute check of your phone, accounts and posts, and how to share your location on your terms.',
    seoDescription:
      'Check who can see your location: phone permissions, Google and Apple sharing, social media maps, photo location data and trackers, in a 10-minute checklist.',
    category: 'live-location',
    tags: ['Location privacy', 'App permissions', 'Checklist'],
    keywords: ['location privacy', 'how to protect location privacy', 'location permissions', 'stop location tracking', 'location privacy checklist'],
    authorId: 'editorial',
    status: 'published',
    publishedAt: '2026-11-25',
    updatedAt: '2026-11-25',
    related: ['live-location-safety', 'someone-tracking-me-online', 'social-media-privacy-settings', 'cyberstalking-india'],
    sources: [
      CERTIN,
      { title: 'Google Maps Help: location sharing', publisher: 'Google', url: 'https://support.google.com/maps/' },
      { title: 'Find My (Apple Support)', publisher: 'Apple', url: 'https://support.apple.com/find-my' },
    ],
    accent: 'ink',
    art: 'Where?',
    body: [
      {
        type: 'p',
        text: 'Sharing your location on purpose, with the right person for a journey, is a safety tool. Sharing it by accident, with apps you forgot about or people you no longer trust, is a risk. This checklist takes about ten minutes.',
      },
      { type: 'h2', text: '1. App permissions on your phone' },
      {
        type: 'ul',
        items: [
          'Open your phone’s location settings and review which apps have access.',
          'Set most apps to “only while using” or “ask every time”; very few need “always”.',
          'Turn off precise location for apps that only need your city.',
          'Remove apps you do not use or do not recognise.',
        ],
      },
      { type: 'h2', text: '2. People who can see you' },
      {
        type: 'ul',
        items: [
          'Google Maps location sharing: check who you share with, and stop any you no longer need.',
          'Apple Find My (iPhone): check “People” for anyone you share with.',
          'WhatsApp and other chats: check any live location you are still sharing.',
          'Family-safety and tracking apps installed by someone else, especially a former partner.',
        ],
      },
      { type: 'h2', text: '3. Social media' },
      {
        type: 'ul',
        items: [
          'Turn off location tags on posts, and map features that show friends your location.',
          'Post photos after you have left a place, not while you are there.',
          'Check photos for house numbers, street signs, vehicle plates and school or college logos.',
          'Go through the full [social media privacy settings](/blog/social-media-privacy-settings) checklist.',
        ],
      },
      { type: 'h2', text: '4. Photos' },
      {
        type: 'p',
        text: 'Photos taken on a phone can store the exact location in the file. Turn off location in your camera settings, or remove location data before sending original files. Most social media apps strip this data when you post, but files sent as documents or by email may keep it.',
      },
      { type: 'h2', text: '5. Devices and trackers' },
      {
        type: 'ul',
        items: [
          'Check your Google or Apple account for devices you do not own, and remove them.',
          'Both Android and iPhone can warn you about unknown Bluetooth trackers travelling with you; make sure these alerts are on.',
          'If you suspect someone is tracking you, read [is someone tracking you online?](/blog/someone-tracking-me-online) before removing anything, so you keep evidence.',
        ],
      },
      { type: 'h2', text: 'Share on your terms' },
      {
        type: 'p',
        text: 'When you do share, share with one or two people, for a set time, and stop when you arrive. See [live location sharing: when to share and when to stop](/blog/live-location-safety). On Sabhijude, live location sharing always has a timer (1, 4, 8 or 24 hours) or runs until you stop it, and you can see who opened your link.',
      },
    ],
    faqs: [
      {
        question: 'How do I check which apps can see my location?',
        answer:
          'Open your phone’s location settings and review app permissions. Set most apps to “only while using” or “ask every time”, turn off precise location where it is not needed, and remove apps you do not use.',
      },
      {
        question: 'Can someone see my location from a photo?',
        answer:
          'Photos can store the location where they were taken. Most social media apps remove it when you post, but original files sent as documents or by email may keep it. Turn off location in your camera settings to avoid this.',
      },
    ],
  },

  /* ---------------------------------------------------------------- public transport */
  {
    slug: 'public-transport-safety',
    title: 'Public transport safety: buses, trains and the metro',
    seoTitle: 'Public Transport Safety: Buses, Trains and the Metro',
    description:
      'Choosing where to sit, keeping your belongings safe, dealing with harassment, and the help available on Indian trains, buses and metros.',
    seoDescription:
      'Stay safe on buses, trains and the metro in India: where to sit, guarding belongings, handling harassment, Rail Madad 139, and help for women travelling alone.',
    category: 'travel-safety',
    tags: ['Public transport', 'Trains', 'Buses', 'Metro'],
    keywords: ['public transport safety', 'train travel safety', 'bus travel safety', 'metro safety', 'public transport safety for women'],
    authorId: 'editorial',
    status: 'published',
    publishedAt: '2026-11-25',
    updatedAt: '2026-11-25',
    related: ['harassed-in-public-what-to-do', 'night-travel-safety-women', 'cab-safety-tips', 'solo-travel-safety-india'],
    sources: [
      RAIL,
      ERSS,
      { title: 'Operation Meri Saheli for women travelling alone', publisher: 'Ministry of Railways (PIB)', url: 'https://pib.gov.in/PressReleasePage.aspx?PRID=2068720' },
    ],
    accent: 'blue',
    art: 'Metro',
    body: [
      {
        type: 'p',
        text: 'Buses, trains and metros carry millions of people safely every day. A few habits help you avoid trouble, and knowing where help is means you can get it fast if you need it.',
      },
      { type: 'h2', text: 'Before you travel' },
      {
        type: 'ul',
        items: [
          'Plan your route and the last service time, so you are not stranded late at night.',
          'Charge your phone and keep a little cash for a backup cab or auto.',
          'Tell someone your route and expected arrival, or share your [live location](/blog/live-location-safety).',
        ],
      },
      { type: 'h2', text: 'Where to wait and sit' },
      {
        type: 'ul',
        items: [
          'Wait in lit areas near other passengers, staff, CCTV or a security post.',
          'Choose busier compartments, or women’s coaches and seats where available.',
          'Sit near the driver, conductor, guard or the door, not in an empty compartment.',
          'On overnight trains, keep your luggage locked and chained and valuables on you.',
        ],
      },
      { type: 'h2', text: 'Help on Indian Railways' },
      {
        type: 'ul',
        items: [
          'Call **139** (Rail Madad) for security, medical or other help during your journey, or use the Rail Madad app or website.',
          'The Railway Protection Force (RPF) and Government Railway Police (GRP) are present at major stations; tell the TTE or guard on the train.',
        ],
      },
      {
        type: 'callout',
        tone: 'info',
        title: 'Real example: Meri Saheli',
        text: 'Since October 2020, the Railway Protection Force has run “Operation Meri Saheli” for women travelling alone on long-distance trains. Teams of women RPF personnel meet them at the starting station, share safety advice and how to get help, and keep in touch through the journey.',
      },
      { type: 'h2', text: 'If someone harasses you' },
      {
        type: 'ol',
        items: [
          'Move away, towards other passengers or staff.',
          'Say clearly and loudly what is happening; other passengers often step in.',
          'Tell the conductor, driver, guard or station staff, or call 139 on a train.',
          'Note the bus number, route, coach number or time.',
          'Call 112 if you are in danger.',
        ],
      },
      {
        type: 'p',
        text: 'More in [what to do if you are harassed in public](/blog/harassed-in-public-what-to-do).',
      },
      { type: 'h2', text: 'Protecting your belongings' },
      {
        type: 'ul',
        items: [
          'Keep your phone and wallet in a front pocket or zipped bag, especially in crowds.',
          'Be careful with your phone near doors and windows.',
          'Do not accept food or drinks from strangers on long journeys.',
          'If your phone is taken, see [what to do if your phone is lost or stolen](/blog/lost-or-stolen-phone-india).',
        ],
      },
      { type: 'h2', text: 'The last mile' },
      {
        type: 'p',
        text: 'The walk or ride from the station is often the riskiest part of a late journey. Book a cab from the app before you arrive, or ask someone to meet you. See [night travel safety](/blog/night-travel-safety-women) and [cab safety tips](/blog/cab-safety-tips).',
      },
    ],
    faqs: [
      {
        question: 'What is the helpline number for safety on trains?',
        answer: '139 is the Rail Madad helpline for security, medical and other help during a train journey. For any emergency, call 112.',
      },
      {
        question: 'What is Meri Saheli?',
        answer:
          'Operation Meri Saheli is a Railway Protection Force initiative, running since October 2020, in which women RPF personnel meet women travelling alone on long-distance trains, share safety advice and keep in touch through the journey.',
      },
    ],
  },

  /* ---------------------------------------------------------------- school safety checklist */
  {
    slug: 'school-safety-checklist',
    title: 'School safety checklist for principals',
    seoTitle: 'School Safety Checklist for Principals and Managements',
    description:
      'A term-by-term checklist covering staff, premises, child protection, emergencies, transport, health and reporting, based on India’s official school safety guidance.',
    seoDescription:
      'A practical school safety checklist for principals in India: staff checks, premises, child protection, drills, transport, health and reporting, term by term.',
    category: 'school-safety',
    tags: ['Schools', 'Checklist', 'Principals', 'Audit'],
    keywords: ['school safety checklist', 'school safety audit checklist', 'school safety policy checklist', 'school emergency preparedness'],
    authorId: 'editorial',
    status: 'published',
    publishedAt: '2026-11-25',
    updatedAt: '2026-11-25',
    related: ['school-safety-guide', 'what-to-do-during-an-emergency', 'children-online-safety-parents', 'why-anonymous-reporting-matters'],
    sources: [
      { title: 'Guidelines on School Safety and Security (2021)', publisher: 'Department of School Education & Literacy, Ministry of Education', url: 'https://dsel.education.gov.in/sites/default/files/update/guidelines_sss.pdf' },
      { title: 'Manual on Safety and Security of Children in Schools', publisher: 'National Commission for Protection of Child Rights', url: 'https://ncpcr.gov.in/uploads/165650391762bc3e6d27f93_manual-on-safety-and-security-of-children-in-schools-sep-2021.pdf' },
      NDMA,
    ],
    accent: 'coral',
    art: '✓',
    body: [
      {
        type: 'p',
        text: 'Use this as a working checklist alongside the official documents: the Ministry of Education’s Guidelines on School Safety and Security (2021), the NDMA’s school safety guidance and the NCPCR safety manual, plus your state’s directions. For the reasoning behind each item, read the [school safety guide](/blog/school-safety-guide).',
      },
      { type: 'h2', text: 'At the start of the year' },
      {
        type: 'ul',
        items: [
          'Written safety, child protection and anti-bullying policies, shared with staff and parents.',
          'A named staff member responsible for child protection, and a school safety committee.',
          'Police verification for all staff, including drivers, conductors, guards and contractors.',
          'Child protection training for every staff member, including POCSO reporting duties.',
          'Emergency contacts for every child, checked and up to date.',
          'Emergency numbers (112, 1098, nearest police station and hospital) displayed in offices and buses.',
        ],
      },
      { type: 'h2', text: 'Premises' },
      {
        type: 'ul',
        items: [
          'Controlled entry with a visitor register and ID badges; a clear pickup policy.',
          'Boundary walls, gates, lighting and CCTV in common areas checked.',
          'Electrical fittings, labs, water tanks, railings and playground equipment inspected.',
          'Clean, supervised washrooms separate for girls and boys.',
          'Fire extinguishers serviced, exits clear and signed.',
        ],
      },
      { type: 'h2', text: 'Every term' },
      {
        type: 'ul',
        items: [
          'Fire and earthquake drills, with evacuation timed and reviewed.',
          'First-aid kits restocked; trained first-aiders on every floor.',
          'A safety walk-through using the NCPCR inspection checklist.',
          'Review of any incidents and concerns reported, and actions taken.',
          'A session for students on body safety, bullying and who to tell.',
        ],
      },
      { type: 'h2', text: 'Transport' },
      {
        type: 'ul',
        items: [
          'Verified drivers and an attendant on every bus, with a woman attendant where girls travel.',
          'Vehicle fitness, speed governor, first-aid kit and fire extinguisher checked.',
          'Attendance on boarding and leaving; handover only to authorised adults.',
          'Route, driver and emergency contact displayed in the bus.',
        ],
      },
      { type: 'h2', text: 'Reporting and response' },
      {
        type: 'ul',
        items: [
          'More than one way for children to raise a concern, including an anonymous option. See [why anonymous reporting helps people speak up](/blog/why-anonymous-reporting-matters).',
          'A written log of every concern, who handled it and what was done.',
          'Sexual abuse concerns reported to the police under POCSO, not handled internally only.',
          'A plan for informing parents quickly in an emergency.',
          'An emergency plan staff can follow. See [what to do in an emergency](/blog/what-to-do-during-an-emergency).',
        ],
      },
      { type: 'h2', text: 'Online safety' },
      {
        type: 'ul',
        items: [
          'Rules for staff–student contact on messaging apps and social media.',
          'Filters on school devices and networks, and lessons on online safety.',
          'Parents given guidance; share [online safety for children](/blog/children-online-safety-parents).',
        ],
      },
    ],
    faqs: [
      {
        question: 'What should a school safety checklist include?',
        answer:
          'Policies and a child protection lead, staff verification and training, premises checks, regular drills and first aid, transport checks, multiple reporting routes including anonymous ones, POCSO reporting, and online safety rules.',
      },
      {
        question: 'How often should schools hold safety drills?',
        answer:
          'Follow your state’s directions and the NDMA guidance; a practical minimum is at least one fire or evacuation drill every term, reviewed afterwards.',
      },
    ],
  },

  /* ---------------------------------------------------------------- keeps messaging */
  {
    slug: 'someone-keeps-messaging-me',
    title: 'Someone keeps messaging you or making new accounts: what to do',
    seoTitle: 'Someone Keeps Messaging You or Making New Accounts?',
    description:
      'When blocking does not work and the messages keep coming from new numbers and accounts: how to stop seeing them, keep a record, and report it as harassment.',
    seoDescription:
      'Someone keeps messaging you or creating new accounts after you block them? How to filter it out, log it as evidence, report block evasion and go to police.',
    category: 'online-harassment',
    tags: ['Unwanted messages', 'Block evasion', 'Cyberstalking'],
    keywords: ['someone keeps messaging me', 'someone keeps creating new accounts to contact me', 'unwanted messages', 'block evasion'],
    authorId: 'editorial',
    status: 'published',
    publishedAt: '2026-11-25',
    updatedAt: '2026-11-25',
    related: ['cyberstalking-india', 'how-to-preserve-digital-evidence', 'report-vs-block', 'how-to-report-cyber-harassment'],
    sources: [NCRP, { title: 'Sanchar Saathi: report suspected fraud and spam communication (Chakshu)', publisher: 'Department of Telecommunications', url: 'https://www.sancharsaathi.gov.in/' }],
    accent: 'coral',
    art: 'Enough',
    body: [
      {
        type: 'p',
        text: 'You have said no, you have blocked them, and the messages still come: from new numbers, new profiles, a friend’s account. Repeated unwanted contact after you have made your wishes clear is not something you have to put up with. In many cases it is stalking.',
      },
      { type: 'h2', text: '1. Stop replying' },
      {
        type: 'p',
        text: 'Every reply, even an angry one, tells the person their messages reach you. If you have not already, send one clear message, “Do not contact me again”, and then stop responding entirely.',
      },
      { type: 'h2', text: '2. Keep a log, not the conversation in your head' },
      {
        type: 'p',
        text: 'Screenshot each new message with the number or account and the date, and add it to a simple log: date, time, platform, account, what was said. Patterns of repeated contact are what turn “annoying” into a complaint the police act on. See [how to preserve digital evidence](/blog/how-to-preserve-digital-evidence).',
      },
      { type: 'h2', text: '3. Filter it out so you do not have to see it' },
      {
        type: 'ul',
        items: [
          'Limit messages to people you follow or contacts only, so new accounts land in a separate requests folder you can ignore.',
          'Turn on “silence unknown callers” on your phone and WhatsApp.',
          'Use keyword filters to hide messages containing their name or common words they use.',
          'Ask a friend to check the requests folder occasionally to collect evidence, so you do not have to.',
        ],
      },
      { type: 'h2', text: '4. Report every new account' },
      {
        type: 'p',
        text: 'Report each new profile and say in the report that it is the same person evading a block. Platforms treat block evasion seriously. See [report vs block](/blog/report-vs-block).',
      },
      { type: 'h2', text: '5. Tell people around you' },
      {
        type: 'p',
        text: 'If they are reaching you through friends or family, ask them not to pass on messages or share your new number. If the person knows where you study or work, tell security or HR.',
      },
      { type: 'h2', text: '6. Report it to the police' },
      {
        type: 'p',
        text: 'Repeatedly contacting someone despite clear disinterest can be stalking under the Bharatiya Nyaya Sanhita, especially combined with threats or monitoring. Report it at [cybercrime.gov.in](https://cybercrime.gov.in) or a police station with your log. See [cyberstalking: what to do](/blog/cyberstalking-india) and [how to report cyber harassment](/blog/how-to-report-cyber-harassment).',
      },
      {
        type: 'callout',
        tone: 'warn',
        title: 'If they turn up in person',
        text: 'If the person appears where you live, study or work, or threatens you, treat it as urgent. Go somewhere with other people and call 112.',
      },
    ],
    faqs: [
      {
        question: 'What can I do if someone keeps creating new accounts to message me?',
        answer:
          'Stop replying, log every account with screenshots and dates, restrict messages to contacts so new accounts go to a requests folder, report each account as block evasion, and report the pattern to the police as possible stalking.',
      },
      {
        question: 'Is repeatedly messaging someone a crime in India?',
        answer:
          'Repeated contact despite a clear indication of disinterest can amount to stalking, especially with threats or monitoring. Keep a record and report it at cybercrime.gov.in or a police station.',
      },
    ],
  },

  /* ---------------------------------------------------------------- tracked online */
  {
    slug: 'someone-tracking-me-online',
    title: 'Is someone tracking or monitoring you? How to check',
    seoTitle: 'Is Someone Tracking Your Phone or Accounts? How to Check',
    description:
      'Signs that someone may be reading your messages or tracking your location, how to check your phone and accounts, and how to regain control safely.',
    seoDescription:
      'Signs someone is tracking your phone or reading your accounts, how to check for stalkerware, shared locations and unknown devices, and how to regain control.',
    category: 'online-harassment',
    tags: ['Stalkerware', 'Account security', 'Location tracking'],
    keywords: ['someone tracking my phone', 'stalkerware', 'someone monitoring my social media', 'is my phone being tracked', 'spyware on phone'],
    authorId: 'editorial',
    status: 'published',
    publishedAt: '2026-11-25',
    updatedAt: '2026-11-25',
    related: ['cyberstalking-india', 'location-privacy-checklist', 'account-hacked-what-to-do', 'how-to-preserve-digital-evidence'],
    sources: [CERTIN, NCRP],
    accent: 'ink',
    art: 'Watched?',
    body: [
      {
        type: 'p',
        text: 'If someone seems to know where you have been, what you said in private chats, or who you met, they may have access to your phone, your accounts or your location. Often it is someone who once had your phone or passwords, such as a former partner or family member.',
      },
      {
        type: 'callout',
        tone: 'warn',
        title: 'Think about safety before you act',
        text: 'Suddenly removing tracking can alert the person. If they have been controlling or violent, plan first with someone you trust or the Women Helpline 181, and save evidence before changing anything. In danger, call 112.',
      },
      { type: 'h2', text: 'Signs worth checking' },
      {
        type: 'ul',
        items: [
          'They know your location or plans without you sharing them.',
          'They mention things from private messages, emails or photos.',
          'Login alerts, password-reset emails or new devices you do not recognise.',
          'Apps you did not install, or settings you did not change.',
          'Your phone warns that an unknown tracker is moving with you.',
        ],
      },
      {
        type: 'p',
        text: 'Battery drain or a warm phone alone is not proof; most phones do this for ordinary reasons.',
      },
      { type: 'h2', text: 'Check your accounts' },
      {
        type: 'ol',
        items: [
          'Your Google or Apple account: review signed-in devices, location sharing and recovery phone and email.',
          'WhatsApp: Settings → Linked devices. Log out anything you do not recognise.',
          'Email: check active sessions, forwarding rules and filters.',
          'Social media: check active sessions and connected apps.',
        ],
      },
      {
        type: 'p',
        text: 'Then change passwords from a device the other person has never had, and turn on two-step verification. See [what to do if your account gets hacked](/blog/account-hacked-what-to-do).',
      },
      { type: 'h2', text: 'Check your phone' },
      {
        type: 'ul',
        items: [
          'Look through installed apps for anything unfamiliar, including apps with generic names.',
          'On Android, check which apps have device admin or accessibility access; spyware often hides there.',
          'On iPhone, check for unknown configuration profiles in settings.',
          'Review location sharing in Google Maps, Find My, WhatsApp and family-safety apps. See the [location privacy checklist](/blog/location-privacy-checklist).',
          'Make sure unknown-tracker alerts are on, and check bags and vehicles if an alert appears.',
        ],
      },
      { type: 'h2', text: 'Regain control' },
      {
        type: 'ol',
        items: [
          'Save evidence first: screenshots of unknown apps, devices, login alerts and anything they said that they should not know. See [how to preserve digital evidence](/blog/how-to-preserve-digital-evidence).',
          'Change passwords and add two-step verification from a safe device.',
          'Remove unknown apps, devices and sharing.',
          'If you are still unsure, back up photos and contacts and factory-reset the phone, then restore only what you need.',
          'Change your phone’s screen lock to something the person cannot guess.',
        ],
      },
      { type: 'h2', text: 'Report it' },
      {
        type: 'p',
        text: 'Installing spyware, accessing someone’s accounts without permission, and monitoring a woman’s use of the internet or electronic communication can be offences. Report it at [cybercrime.gov.in](https://cybercrime.gov.in) or a police station. See [cyberstalking: what to do](/blog/cyberstalking-india).',
      },
    ],
    faqs: [
      {
        question: 'How can I tell if someone is tracking my phone?',
        answer:
          'Check for unknown apps, devices signed into your Google or Apple account, linked devices on WhatsApp, location sharing you did not set up, unknown-tracker alerts, and apps with device admin or accessibility access. Battery drain alone is not proof.',
      },
      {
        question: 'Should I remove spyware straight away?',
        answer:
          'Save evidence first, and if the person has been controlling or violent, plan with someone you trust before removing it, because removal can alert them. In danger, call 112.',
      },
    ],
  },

  /* ---------------------------------------------------------------- corporate emergency plan */
  {
    slug: 'corporate-emergency-response-plan',
    title: 'Corporate emergency response plan: template and checklist',
    seoTitle: 'Corporate Emergency Response Plan: Template and Checklist',
    description:
      'What an office emergency plan must cover: roles, alerting, evacuation, medical emergencies, threats, communication and drills, with a template you can adapt.',
    seoDescription:
      'Build a workplace emergency response plan: roles, alerts, evacuation, medical emergencies, threats, employee communication and drills, with a simple template.',
    category: 'corporate-safety',
    tags: ['Emergency plan', 'Offices', 'HR', 'Facilities'],
    keywords: ['workplace emergency response plan', 'corporate emergency plan', 'office emergency preparedness checklist', 'corporate emergency communication'],
    authorId: 'editorial',
    status: 'published',
    publishedAt: '2026-11-25',
    updatedAt: '2026-11-25',
    related: ['workplace-safety-guide', 'workplace-fire-first-aid', 'workplace-physical-security', 'night-shift-employee-safety'],
    sources: [NDMA, ERSS, { title: 'Ministry of Labour and Employment (labour codes)', publisher: 'Government of India', url: 'https://labour.gov.in/' }],
    accent: 'blue',
    art: 'Plan',
    body: [
      {
        type: 'p',
        text: 'An emergency plan is a short document that tells every employee what to do, and every responder what they are responsible for, when something goes wrong at work. It should be simple enough to follow under stress. Check your obligations under fire safety rules, building codes and labour laws that apply to your premises and state.',
      },
      { type: 'h2', text: '1. Scope' },
      {
        type: 'p',
        text: 'List the emergencies the plan covers: fire, medical emergency, earthquake, flood, power and network failure, a violent or threatening person, a bomb threat, an employee in danger outside the office (for example, on a late cab ride), and a data or IT security incident.',
      },
      { type: 'h2', text: '2. Roles' },
      {
        type: 'table',
        head: ['Role', 'Responsibilities'],
        rows: [
          ['Incident lead', 'Decides on evacuation or lockdown, coordinates with emergency services, approves communication.'],
          ['Floor wardens', 'Sweep their area, guide people out, report headcounts.'],
          ['First-aiders', 'Respond to injuries and medical emergencies until help arrives.'],
          ['Security / facilities', 'Calls 112 and building services, controls access, meets responders.'],
          ['HR / communications', 'Contacts families, keeps employees informed, handles follow-up.'],
        ],
        caption: 'Name a deputy for every role, and cover every shift.',
      },
      { type: 'h2', text: '3. Raising the alarm' },
      {
        type: 'ul',
        items: [
          'How anyone raises an alarm: fire alarm points, a security number, an app.',
          'Who calls 112, and what information they give: address, floor, what happened, number of people affected.',
          'How employees outside the office, including those travelling or working late, can reach the security desk quickly.',
        ],
      },
      { type: 'h2', text: '4. Evacuation and shelter' },
      {
        type: 'ul',
        items: [
          'Marked exit routes and assembly points, with an alternative for each.',
          'Headcount method using attendance or access-card data.',
          'Named buddies for employees with disabilities or who need help moving.',
          'When to shelter in place or lock down instead of evacuating.',
        ],
      },
      { type: 'h2', text: '5. Communication' },
      {
        type: 'ul',
        items: [
          'A way to alert all employees at once, including those not at their desks.',
          'Up-to-date emergency contacts for every employee.',
          'Message templates for “evacuate”, “stay away from the building”, “all clear”.',
          'Who speaks to families, clients and the media.',
        ],
      },
      { type: 'h2', text: '6. Drills and review' },
      {
        type: 'p',
        text: 'Run evacuation drills regularly and at least once for every shift, time them, and review what went wrong. Update the plan after every drill, incident, office move or change in headcount.',
      },
      { type: 'h2', text: 'One-page template' },
      {
        type: 'ol',
        items: [
          'Site address and emergency numbers (112, nearest hospital, building security).',
          'Incident lead and deputies, with phone numbers.',
          'Wardens and first-aiders by floor.',
          'Assembly points (primary and alternative).',
          'How to raise the alarm and alert everyone.',
          'Evacuation, shelter-in-place and lockdown steps.',
          'Contact sheet for families and key clients.',
          'Date of the last drill and the next review.',
        ],
      },
      {
        type: 'p',
        text: 'Share the employee-facing part as a simple guide; see [workplace safety for employees](/blog/workplace-safety-guide) and [what to do in an emergency](/blog/what-to-do-during-an-emergency). For how people report concerns, see [anonymous reporting channels for companies](/blog/company-anonymous-reporting).',
      },
      {
        type: 'callout',
        tone: 'info',
        title: 'Where Sabhijude fits',
        text: 'Organisations on Sabhijude can send safety broadcasts to all members at once and receive incident reports. Members’ SOS alerts are personal: they go only to each member’s own trusted contacts, not to the organisation.',
      },
    ],
    faqs: [
      {
        question: 'What should a workplace emergency response plan contain?',
        answer:
          'The emergencies covered, named roles with deputies, how to raise the alarm and call 112, evacuation and lockdown steps with assembly points and headcounts, how to alert all employees and families, and a schedule of drills and reviews.',
      },
    ],
  },

  /* ---------------------------------------------------------------- anonymous reporting for companies */
  {
    slug: 'company-anonymous-reporting',
    title: 'How companies can build a safe, anonymous reporting channel',
    seoTitle: 'How Companies Can Build a Safe Anonymous Reporting Channel',
    description:
      'Why employees stay silent, what a trusted reporting channel needs, how to protect people who report, and how anonymous channels fit with POSH and vigil mechanisms.',
    seoDescription:
      'Build a reporting channel employees trust: anonymous options, protection from retaliation, how it fits POSH and vigil mechanism rules, and handling reports.',
    category: 'corporate-safety',
    tags: ['Anonymous reporting', 'Whistle-blowing', 'HR', 'Speak-up culture'],
    keywords: ['anonymous reporting system', 'employee safe reporting channels', 'whistleblower policy India', 'vigil mechanism', 'speak up culture'],
    authorId: 'editorial',
    status: 'published',
    publishedAt: '2026-11-25',
    updatedAt: '2026-11-25',
    related: ['workplace-safety-culture', 'why-anonymous-reporting-matters', 'workplace-harassment-posh', 'what-happens-after-you-report'],
    sources: [
      { title: 'SHe-Box', publisher: 'Ministry of Women and Child Development', url: 'https://shebox.wcd.gov.in/' },
      { title: 'Securities and Exchange Board of India (LODR Regulations)', publisher: 'SEBI', url: 'https://www.sebi.gov.in/' },
      { title: 'Ministry of Corporate Affairs (Companies Act, 2013)', publisher: 'Government of India', url: 'https://www.mca.gov.in/' },
    ],
    accent: 'ink',
    art: 'Speak up',
    body: [
      {
        type: 'p',
        text: 'Most problems at work, from harassment to safety hazards to fraud, are known to someone long before they become a crisis. Whether that person speaks up depends on one thing: whether they believe reporting is safe and will make a difference.',
      },
      { type: 'h2', text: 'Why employees stay silent' },
      {
        type: 'ul',
        items: [
          'Fear of retaliation, especially when the problem involves a manager.',
          'Not knowing where to report, or whether it is “serious enough”.',
          'Believing nothing will happen.',
          'Worry about being known as a complainer.',
        ],
      },
      { type: 'h2', text: 'What a trusted channel needs' },
      {
        type: 'ol',
        items: [
          '**More than one route:** manager, HR, an ethics or speak-up line, and a digital form, so nobody has to report to the person involved.',
          '**An anonymous option** for people who would otherwise say nothing, with a way to ask follow-up questions without revealing who they are.',
          '**Clear protection from retaliation,** written into policy and enforced visibly.',
          '**Fast acknowledgement** and a realistic timeline for the outcome.',
          '**Confidential handling** by a small, trained group.',
          '**Feedback:** tell the reporter what happened, as far as privacy allows, and publish anonymised summaries of issues raised and actions taken.',
        ],
      },
      { type: 'h2', text: 'How it fits with the law' },
      {
        type: 'ul',
        items: [
          '**POSH Act:** sexual harassment complaints must go to the Internal Committee (or the district Local Committee), and employees can also use SHe-Box. An anonymous tip can prompt action, but a formal POSH inquiry needs a complainant. See [how to report workplace sexual harassment](/blog/workplace-harassment-posh).',
          '**Vigil mechanism:** listed companies, and certain other companies under the Companies Act, must have a vigil mechanism (whistle-blower policy) for directors and employees, with safeguards against victimisation and access to the audit committee chair. Check which rules apply to your company.',
          '**Criminal matters** such as assault or threats should also be reported to the police.',
        ],
      },
      { type: 'h2', text: 'Handling anonymous reports well' },
      {
        type: 'ul',
        items: [
          'Treat every report seriously, but investigate before acting against anyone. One report alone should not lead to punishment.',
          'Look for patterns: several reports about the same team or person matter.',
          'Ask follow-up questions through the anonymous channel where possible.',
          'Keep a log of every report, decision and outcome.',
          'Be honest that “anonymous” means hidden from the people involved, and say who can see what.',
        ],
      },
      {
        type: 'p',
        text: 'For the reasoning behind anonymity, read [why anonymous reporting helps people speak up](/blog/why-anonymous-reporting-matters), and for how a fair review process works, [what happens after you report](/blog/what-happens-after-you-report).',
      },
      {
        type: 'callout',
        tone: 'info',
        title: 'Where Sabhijude fits',
        text: 'Organisations on Sabhijude receive incident reports from their members, who can post anonymously to other members, and can broadcast safety updates back. Members choose what they share with the organisation in their permissions.',
      },
    ],
    faqs: [
      {
        question: 'Do companies in India need a whistle-blower policy?',
        answer:
          'Listed companies must have a vigil mechanism under SEBI’s listing regulations, and the Companies Act requires one for listed companies and certain other classes of companies. Check which rules apply to yours.',
      },
      {
        question: 'Can a POSH complaint be anonymous?',
        answer:
          'A formal POSH inquiry needs a complainant, but an anonymous report can still alert the organisation to act, for example through awareness, monitoring or checking for patterns. Complaints can also be filed on SHe-Box.',
      },
    ],
  },
];
