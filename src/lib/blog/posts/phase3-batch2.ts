import type { BlogPost, Source } from '../types';

/**
 * Phase 3, batch 2 (cyber, AI, schools, colleges): AI scams, SIM-swap fraud, verifying images and
 * videos, generative AI safety, school cyber safety, school transport, college safety audit,
 * workplace fire and first aid. Checked 2026-11-25:
 * - DoT instruction of 27 Sept 2022: SMS (incoming and outgoing) barred for 24 hours on a new SIM
 *   after a SIM swap or replacement, with a notification to the customer.
 */

const ERSS: Source = { title: 'Emergency Response Support System (112)', publisher: 'Ministry of Home Affairs', url: 'https://112.gov.in/' };
const NCRP: Source = { title: 'National Cyber Crime Reporting Portal (cybercrime.gov.in)', publisher: 'Ministry of Home Affairs', url: 'https://cybercrime.gov.in/' };
const CERTIN: Source = { title: 'Indian Computer Emergency Response Team (CERT-In)', publisher: 'Ministry of Electronics and Information Technology', url: 'https://www.cert-in.org.in/' };
const NDMA: Source = { title: 'National Disaster Management Authority', publisher: 'Government of India', url: 'https://ndma.gov.in/' };
const SANCHAR: Source = { title: 'Sanchar Saathi', publisher: 'Department of Telecommunications', url: 'https://www.sancharsaathi.gov.in/' };
const DPDP: Source = { title: 'Digital Personal Data Protection Rules, 2025 notified (PIB)', publisher: 'Ministry of Electronics and Information Technology', url: 'https://static.pib.gov.in/WriteReadData/specificdocs/documents/2025/nov/doc20251117695301.pdf' };
const SCHOOL_GUIDE: Source = { title: 'Guidelines on School Safety and Security (2021)', publisher: 'Department of School Education & Literacy, Ministry of Education', url: 'https://dsel.education.gov.in/sites/default/files/update/guidelines_sss.pdf' };

export const PHASE3_BATCH2_POSTS: BlogPost[] = [
  /* ---------------------------------------------------------------- AI scams */
  {
    slug: 'ai-scams',
    title: 'How AI is used in online scams, and how to stay ahead',
    seoTitle: 'How AI Is Used in Online Scams (and How to Stay Safe)',
    description:
      'Cloned voices, deepfake video calls, fake celebrity investment ads and flawless phishing messages: how scammers use AI, and the habits that still beat them.',
    seoDescription:
      'How scammers use AI: cloned voices, deepfake video calls, fake celebrity investment ads and polished phishing, plus the simple habits that still stop them.',
    category: 'technology-ai-safety',
    tags: ['AI scams', 'Deepfakes', 'Voice cloning', 'Investment scams'],
    keywords: ['AI scams', 'how AI is used in online scams', 'protect yourself from AI scams', 'deepfake investment scam'],
    authorId: 'editorial',
    status: 'published',
    publishedAt: '2026-11-25',
    updatedAt: '2026-11-25',
    related: ['voice-cloning-scams', 'deepfakes-what-to-do', 'verify-images-and-videos', 'common-online-scams-india'],
    sources: [NCRP, CERTIN, SANCHAR],
    accent: 'ink',
    art: 'AI?',
    body: [
      {
        type: 'p',
        text: 'AI has not invented new scams so much as made old ones more convincing. The tricks are the same, urgency, authority, fear and greed, but the voices, faces and messages now look and sound far more real.',
      },
      { type: 'h2', text: 'How scammers use AI' },
      {
        type: 'table',
        head: ['Technique', 'What it looks like'],
        rows: [
          ['Voice cloning', 'A call in a relative’s voice asking for urgent money.'],
          ['Deepfake video', 'A video call from a “boss”, “officer” or “relative”, or a fake celebrity endorsing an investment.'],
          ['Polished phishing', 'Messages with perfect grammar and personal details pulled from your social media.'],
          ['Chatbot “agents”', 'Fake customer support or investment advisers who chat convincingly for days.'],
          ['Fake documents', 'AI-generated IDs, payment screenshots, offer letters or court notices.'],
        ],
      },
      { type: 'h2', text: 'Habits that still work' },
      {
        type: 'ol',
        items: [
          '**Verify through a second channel:** hang up and call back on a number you already have.',
          '**Use a family code word** for emergencies. See [voice cloning scams](/blog/voice-cloning-scams).',
          '**Distrust investment ads** featuring celebrities; invest only through regulated platforms.',
          '**Check payment screenshots** against your actual bank or UPI app, never the screenshot.',
          '**Never share OTPs or install apps** because a convincing person asked.',
          '**Slow down.** AI makes fakes better; it does not change the urgency trick.',
        ],
      },
      { type: 'h2', text: 'Check what you see' },
      {
        type: 'p',
        text: 'For suspicious videos and images, see [how to verify a suspicious image or video](/blog/verify-images-and-videos). If a deepfake of you is circulating, see [deepfakes: what to do](/blog/deepfakes-what-to-do).',
      },
      { type: 'h2', text: 'If you have been targeted' },
      {
        type: 'p',
        text: 'Lost money: call **1930** and your bank immediately, then file at cybercrime.gov.in. No loss: report the number or message on Chakshu at sancharsaathi.gov.in. More scams to know: [common online scams in India](/blog/common-online-scams-india).',
      },
    ],
    faqs: [
      {
        question: 'How do scammers use AI?',
        answer:
          'To clone voices, create deepfake video calls and celebrity endorsements, write polished personalised phishing messages, run convincing chatbot “agents”, and fake documents and payment screenshots.',
      },
      {
        question: 'How can I protect myself from AI scams?',
        answer:
          'Verify through a second channel by calling back on a known number, use a family code word, distrust celebrity investment ads, check payments in your own banking app, never share OTPs, and slow down when a message feels urgent.',
      },
    ],
  },

  /* ---------------------------------------------------------------- SIM swap */
  {
    slug: 'sim-swap-fraud',
    title: 'SIM-swap fraud: how it works and how to prevent it',
    seoTitle: 'SIM-Swap Fraud: How It Works and How to Prevent It',
    description:
      'Criminals get a new SIM on your number to receive your OTPs. How SIM-swap fraud works, the warning signs, India’s 24-hour SMS safeguard, and what to do.',
    seoDescription:
      'SIM-swap fraud lets criminals receive your OTPs. Learn how it works, warning signs like sudden loss of signal, India’s 24-hour SMS rule, and what to do fast.',
    category: 'cyber-safety',
    tags: ['SIM swap', 'OTP fraud', 'Mobile security', 'Banking'],
    keywords: ['SIM swap fraud', 'protect SIM card', 'how to prevent SIM swap fraud', 'SIM swap India'],
    authorId: 'editorial',
    status: 'published',
    publishedAt: '2026-11-25',
    updatedAt: '2026-11-25',
    related: ['smartphone-security-checklist', 'identity-theft-india', 'phishing-explained', 'strong-passwords-two-step-verification'],
    sources: [
      SANCHAR,
      NCRP,
      { title: 'DoT instruction: 24-hour SMS barring on new SIM after swap (27 Sept 2022)', publisher: 'Department of Telecommunications', url: 'https://dotws.cdot.in/sites/default/files/SIM%20Exchange%2024%20Hours%20Barring%20formal%20instructions%2027092022.pdf' },
    ],
    accent: 'red',
    art: 'No signal?',
    body: [
      {
        type: 'p',
        text: 'In **SIM-swap fraud**, a criminal convinces or bribes someone at a mobile store, or uses forged documents, to issue a new SIM card on your number. Your phone loses signal, and their phone starts receiving your calls and OTPs, which they use to empty bank accounts or take over email and WhatsApp.',
      },
      { type: 'h2', text: 'Warning signs' },
      {
        type: 'ul',
        items: [
          'Your phone suddenly shows “No service” or “SIM not registered” for a long time in an area with normal signal.',
          'An SMS or call from your operator about a SIM change you did not request.',
          'You stop receiving calls and OTPs, but friends say your number rings.',
          'Unexpected login or transaction alerts by email.',
        ],
      },
      {
        type: 'callout',
        tone: 'info',
        title: 'Real safeguard: 24 hours without SMS',
        text: 'Under a Department of Telecommunications instruction of 27 September 2022, operators bar incoming and outgoing SMS on a new SIM for 24 hours after a SIM swap or replacement, and notify the customer of the request. That window gives you time to act if the change was not yours.',
      },
      { type: 'h2', text: 'If you suspect a SIM swap' },
      {
        type: 'ol',
        items: [
          'Call your operator immediately from another phone and ask them to block the new SIM.',
          'Call your bank to freeze accounts, cards and UPI.',
          'If money is gone, call **1930** and file at cybercrime.gov.in.',
          'Change your email password from a safe device, and secure WhatsApp.',
        ],
      },
      { type: 'h2', text: 'Prevent it' },
      {
        type: 'ul',
        items: [
          'Do not share your Aadhaar, date of birth or OTPs with callers; SIM-swap often starts with phishing. See [how to recognise a phishing message](/blog/phishing-explained).',
          'Keep your number and personal details off public profiles.',
          'Use authenticator apps or passkeys for important accounts rather than SMS where offered. See [strong passwords and two-step verification](/blog/strong-passwords-two-step-verification).',
          'Set a SIM PIN, and check which numbers are issued in your name on Sanchar Saathi. See [identity theft](/blog/identity-theft-india).',
        ],
      },
    ],
    faqs: [
      {
        question: 'What is SIM-swap fraud?',
        answer:
          'SIM-swap fraud is when a criminal gets a new SIM issued on your number, so their phone receives your calls and OTPs, which they use to access your bank, UPI, email or WhatsApp.',
      },
      {
        question: 'What should I do if my phone suddenly loses signal?',
        answer:
          'If it lasts in an area with normal coverage, call your operator from another phone to check for a SIM change, block it if it was not you, and alert your bank. Call 1930 if money has been taken.',
      },
    ],
  },

  /* ---------------------------------------------------------------- verify media */
  {
    slug: 'verify-images-and-videos',
    title: 'How to verify a suspicious image or video',
    seoTitle: 'How to Verify a Suspicious Image or Video',
    description:
      'Before you believe or forward it: how to check who posted it first, find the original with reverse image search, spot AI and editing, and use fact-checkers.',
    seoDescription:
      'Check suspicious photos and videos before you share: trace the original source, use reverse image search, spot AI and editing clues, and use fact-checkers.',
    category: 'technology-ai-safety',
    tags: ['Fact-checking', 'Deepfakes', 'Misinformation', 'Reverse image search'],
    keywords: ['how to verify suspicious videos', 'how to verify suspicious images', 'reverse image search', 'fake news check', 'how to identify a deepfake'],
    authorId: 'editorial',
    status: 'published',
    publishedAt: '2026-11-25',
    updatedAt: '2026-11-25',
    related: ['deepfakes-what-to-do', 'ai-scams', 'generative-ai-safety', 'report-vs-block'],
    sources: [{ title: 'PIB Fact Check', publisher: 'Press Information Bureau, Government of India', url: 'https://pib.gov.in/factcheck.aspx' }, CERTIN],
    accent: 'blue',
    art: 'Real?',
    body: [
      {
        type: 'p',
        text: 'A shocking video in a family group, a screenshot of an “official order”, a photo of an accident: much of what is forwarded is old, edited, taken out of context or made with AI. A few minutes of checking stops you from spreading it, and from being fooled by it.',
      },
      { type: 'h2', text: '1. Pause before you react' },
      {
        type: 'p',
        text: 'Content designed to make you angry, afraid or proud is the content most worth checking. Ask: who wants me to believe this, and why now?',
      },
      { type: 'h2', text: '2. Find the source' },
      {
        type: 'ul',
        items: [
          'Who posted it first? Is it from an official account or a reputable news outlet?',
          'Search the claim in a few words; real events are usually reported by several sources.',
          'Check the date: old images and videos are often recycled as “today”.',
        ],
      },
      { type: 'h2', text: '3. Reverse search the image' },
      {
        type: 'p',
        text: 'Use reverse image search (for example in Google Lens) on the photo or a screenshot of a video frame. It often finds the original, with its real date and context.',
      },
      { type: 'h2', text: '4. Look for signs of editing or AI' },
      {
        type: 'ul',
        items: [
          'Faces: mismatched lip movement, odd blinking, blurred edges around hair or ears.',
          'Hands and text: extra fingers, warped signs or unreadable lettering.',
          'Lighting and shadows that do not match.',
          'Audio: flat emotion, odd pauses, or a voice that does not match the mouth.',
        ],
      },
      {
        type: 'p',
        text: 'Detection gets harder as tools improve, so the source matters more than spotting flaws. See [deepfakes: how to spot them](/blog/deepfakes-what-to-do).',
      },
      { type: 'h2', text: '5. Use fact-checkers' },
      {
        type: 'p',
        text: 'For claims about the government, [PIB Fact Check](https://pib.gov.in/factcheck.aspx) publishes clarifications. Independent fact-checking organisations also check viral claims.',
      },
      { type: 'h2', text: 'If it is false' },
      {
        type: 'p',
        text: 'Do not forward it, even to say it is fake. Reply privately to the person who sent it, and report it on the platform. See [report vs block](/blog/report-vs-block) and [how AI is used in scams](/blog/ai-scams).',
      },
    ],
    faqs: [
      {
        question: 'How can I check if a video is real?',
        answer:
          'Find who posted it first and whether reputable sources report it, check the date, reverse-search a frame with a tool like Google Lens, look for signs of editing or AI, and check fact-checkers such as PIB Fact Check.',
      },
    ],
  },

  /* ---------------------------------------------------------------- generative AI */
  {
    slug: 'generative-ai-safety',
    title: 'Online safety in the age of generative AI',
    seoTitle: 'Online Safety in the Age of Generative AI',
    description:
      'Using chatbots and AI image tools safely: what not to share, protecting your photos from misuse, checking AI answers, and guidance for students and employees.',
    seoDescription:
      'Use AI chatbots and image tools safely: what never to share, protecting your photos from misuse, checking AI answers, and tips for students and employees.',
    category: 'technology-ai-safety',
    tags: ['Generative AI', 'Privacy', 'Students', 'Employees'],
    keywords: ['generative AI safety', 'AI and digital privacy', 'AI safety for students', 'AI safety for employees', 'is it safe to use AI chatbots'],
    authorId: 'editorial',
    status: 'published',
    publishedAt: '2026-11-25',
    updatedAt: '2026-11-25',
    related: ['ai-scams', 'deepfakes-what-to-do', 'digital-privacy-guide', 'verify-images-and-videos'],
    sources: [DPDP, CERTIN],
    accent: 'ink',
    art: 'Gen AI',
    body: [
      {
        type: 'p',
        text: 'Generative AI tools, chatbots that write and image tools that create pictures, are now part of study, work and everyday life. They are useful, and like any online service they come with privacy and safety risks worth understanding.',
      },
      { type: 'h2', text: '1. What not to share with AI tools' },
      {
        type: 'ul',
        items: [
          'Passwords, OTPs, bank, card or Aadhaar details.',
          'Other people’s personal information without their consent.',
          'Confidential work documents, unless your employer has approved the tool for that use.',
          'Intimate photos or anything you would not want stored or reviewed.',
        ],
      },
      {
        type: 'p',
        text: 'Check the tool’s privacy settings: many let you turn off chat history or opt out of your conversations being used for training.',
      },
      { type: 'h2', text: '2. Protect your photos' },
      {
        type: 'p',
        text: 'Public photos can be used to create fake or explicit images. Keep personal photos to private accounts and trusted audiences, and think twice before uploading other people’s photos to AI apps. If fake images of you appear, see [deepfakes: what to do](/blog/deepfakes-what-to-do).',
      },
      { type: 'h2', text: '3. Check what AI tells you' },
      {
        type: 'ul',
        items: [
          'AI can be confidently wrong. Verify facts, especially legal, medical, financial or safety information, with official sources.',
          'Do not rely on AI for emergency help; call 112.',
          'Be sceptical of AI-generated images and videos you see. See [how to verify a suspicious image or video](/blog/verify-images-and-videos).',
        ],
      },
      { type: 'h2', text: '4. For students' },
      {
        type: 'ul',
        items: [
          'Follow your institution’s rules on using AI for assignments.',
          'Never use AI tools to create images of classmates; it can be harassment and a crime.',
          'Report AI-made images of you or friends to the platform and a trusted adult.',
        ],
      },
      { type: 'h2', text: '5. For employees' },
      {
        type: 'ul',
        items: [
          'Use only approved AI tools for work data.',
          'Be alert to AI-powered phishing and voice or video impersonation of colleagues. See [how AI is used in scams](/blog/ai-scams).',
        ],
      },
      {
        type: 'p',
        text: 'For the bigger picture of protecting your information, see the [digital privacy guide](/blog/digital-privacy-guide).',
      },
    ],
    faqs: [
      {
        question: 'Is it safe to share personal information with AI chatbots?',
        answer:
          'Avoid sharing passwords, OTPs, financial or ID details, other people’s personal information, confidential work data or intimate images. Check the tool’s privacy settings, such as turning off chat history or training use.',
      },
    ],
  },

  /* ---------------------------------------------------------------- school cyber safety */
  {
    slug: 'school-cyber-safety',
    title: 'Cyber safety for schools: policy and lessons',
    seoTitle: 'Cyber Safety for Schools: Policy and Lessons',
    description:
      'A practical cyber safety policy for schools: devices and networks, staff–student communication, children’s data, age-appropriate lessons and handling incidents.',
    seoDescription:
      'A cyber safety plan for schools in India: devices and filters, staff–student messaging rules, children’s data, lessons by age, and handling online incidents.',
    category: 'school-safety',
    tags: ['Schools', 'Cyber safety', 'Children’s data', 'Teachers'],
    keywords: ['school cyber safety', 'cyber safety for schools', 'digital safety rules every student should know', 'internet safety checklist for students'],
    authorId: 'editorial',
    status: 'published',
    publishedAt: '2026-11-25',
    updatedAt: '2026-11-25',
    related: ['school-bullying-reports', 'children-online-safety-parents', 'school-safety-guide', 'teen-digital-privacy'],
    sources: [SCHOOL_GUIDE, CERTIN, NCRP],
    accent: 'blue',
    art: 'Online class',
    body: [
      {
        type: 'p',
        text: 'Schools now run on devices, apps and messaging groups, and children carry phones from an early age. A clear cyber safety policy protects students, staff and the school, and good lessons prepare children for life online.',
      },
      { type: 'h2', text: '1. Devices and networks' },
      {
        type: 'ul',
        items: [
          'Content filtering on school Wi-Fi and devices.',
          'Individual logins for staff, strong passwords and two-step verification on admin accounts.',
          'Software kept updated; only approved apps on school devices.',
        ],
      },
      { type: 'h2', text: '2. Staff–student communication' },
      {
        type: 'ul',
        items: [
          'Official channels only, such as the school app or class groups with more than one staff member and, for younger children, parents.',
          'No private one-to-one messaging or social media contact with students.',
          'No sharing of students’ photos on personal accounts.',
        ],
      },
      { type: 'h2', text: '3. Children’s data' },
      {
        type: 'p',
        text: 'India’s data protection law gives children’s personal data extra protection, including parental consent. Collect only what is necessary, restrict access, and ask vendors where data is stored and for how long.',
      },
      { type: 'h2', text: '4. Lessons by age' },
      {
        type: 'table',
        head: ['Age', 'Focus'],
        rows: [
          ['6–9', 'Telling a trusted adult, not talking to strangers online, keeping personal details private.'],
          ['10–13', 'Privacy settings, kindness online, cyberbullying, not sharing photos, recognising grooming.'],
          ['14–18', 'Digital footprint, sextortion and scams, consent, misinformation and AI, how to report.'],
        ],
      },
      { type: 'h2', text: '5. Handling incidents' },
      {
        type: 'p',
        text: 'Use the same process as for bullying: listen, record, involve parents, act under the policy, and involve the police for threats, sexual content or blackmail. Never forward or keep sexual images of a child as evidence. See [how schools should handle bullying and cyberbullying](/blog/school-bullying-reports).',
      },
      {
        type: 'p',
        text: 'Share [online safety for children](/blog/children-online-safety-parents) and [teen digital privacy](/blog/teen-digital-privacy) with parents, and fold this into your [school safety guide](/blog/school-safety-guide).',
      },
    ],
    faqs: [
      {
        question: 'What should a school cyber safety policy include?',
        answer:
          'Filtering and secure accounts on school devices, rules for staff–student communication through official channels only, protection of children’s data, age-appropriate lessons, and a clear process for online incidents.',
      },
    ],
  },

  /* ---------------------------------------------------------------- school transport */
  {
    slug: 'school-transport-safety',
    title: 'School bus and transport safety guide',
    seoTitle: 'School Bus and Transport Safety Guide for India',
    description:
      'For schools and parents: vehicle and driver checks, attendants, boarding and handover, vans and autos, road safety lessons and what to do in an emergency.',
    seoDescription:
      'School transport safety for schools and parents: vehicle and driver checks, attendants, safe boarding and handover, vans and autos, and emergency steps.',
    category: 'school-safety',
    tags: ['School bus', 'Transport', 'Parents', 'Road safety'],
    keywords: ['school bus safety', 'school transportation safety', 'school van safety', 'school bus guidelines India'],
    authorId: 'editorial',
    status: 'published',
    publishedAt: '2026-11-25',
    updatedAt: '2026-11-25',
    related: ['school-safety-guide', 'school-safety-checklist', 'school-safety-technology', 'school-emergency-preparedness'],
    sources: [SCHOOL_GUIDE, ERSS],
    accent: 'coral',
    art: 'Bus',
    body: [
      {
        type: 'p',
        text: 'The school journey is one of the riskiest parts of a child’s day. Many boards and states set specific rules for school buses; follow those, and use this guide to cover the practical side.',
      },
      { type: 'h2', text: 'For schools' },
      {
        type: 'ul',
        items: [
          'Drivers with valid licences, clean records and police verification; no drivers with a history of traffic offences.',
          'An attendant on every bus, and a woman attendant where girls travel.',
          'Vehicles with valid fitness certificates, speed governors, first-aid kits, fire extinguishers, working doors and window grills.',
          'GPS tracking and, where possible, CCTV inside buses.',
          'Attendance at boarding and alighting; children handed only to authorised adults.',
          'A final check of every seat when the bus is parked, so no child is left inside.',
          'Driver and route details, and an emergency number, displayed in the bus.',
        ],
      },
      { type: 'h2', text: 'For parents' },
      {
        type: 'ul',
        items: [
          'Know the driver, attendant, route and timing, and save their numbers.',
          'For private vans and autos, check the driver’s verification, the number of children carried and that seats are not overloaded.',
          'Teach children to stay seated, keep hands and heads inside, and cross only in front of the bus where the driver can see them.',
          'Agree a rule: never go with anyone else, even someone known, without your confirmation.',
        ],
      },
      { type: 'h2', text: 'In an emergency' },
      {
        type: 'ol',
        items: [
          'Driver stops safely; attendant checks every child.',
          'Call 112 or 108 for injuries; inform the school immediately.',
          'School informs parents of every child on the bus quickly and clearly.',
        ],
      },
      {
        type: 'p',
        text: 'Bus tracking and parent alerts help; see [how schools can use technology](/blog/school-safety-technology). Add transport to the termly [school safety checklist](/blog/school-safety-checklist) and your [school safety guide](/blog/school-safety-guide).',
      },
    ],
    faqs: [
      {
        question: 'What safety measures should a school bus have?',
        answer:
          'Verified, licensed drivers, an attendant (a woman attendant where girls travel), fitness certificates, speed governors, first aid, a fire extinguisher, working doors and window grills, GPS tracking, attendance at boarding and handover, and a final seat check.',
      },
    ],
  },

  /* ---------------------------------------------------------------- college audit */
  {
    slug: 'college-safety-audit',
    title: 'College safety audit and policy checklist',
    seoTitle: 'College Safety Audit and Policy Checklist',
    description:
      'A checklist for college and university administrators: committees and policies, hostels, campus security, emergencies, reporting, cyber safety and students’ wellbeing.',
    seoDescription:
      'A college safety audit checklist for administrators: statutory committees, policies, hostels, security, emergencies, reporting, cyber safety and wellbeing.',
    category: 'college-safety',
    tags: ['Colleges', 'Audit', 'Checklist', 'Administrators'],
    keywords: ['college safety checklist', 'college safety audit', 'college safety policy checklist', 'campus safety checklist'],
    authorId: 'editorial',
    status: 'published',
    publishedAt: '2026-11-25',
    updatedAt: '2026-11-25',
    related: ['how-colleges-can-build-safer-campus', 'college-emergency-plan', 'college-safety-reporting-system', 'ragging-guide'],
    sources: [{ title: 'University Grants Commission', publisher: 'Government of India', url: 'https://www.ugc.gov.in/' }, { title: 'National Anti-Ragging Helpline', publisher: 'University Grants Commission', url: 'https://www.antiragging.in/' }, NDMA],
    accent: 'blue',
    art: '✓',
    body: [
      {
        type: 'p',
        text: 'Use this checklist once a semester with your safety committee. Each “no” is an action item. For the reasoning behind each area, see [how colleges can build a safer campus](/blog/how-colleges-can-build-safer-campus).',
      },
      { type: 'h2', text: 'Committees and policies' },
      {
        type: 'ul',
        items: [
          'Internal Complaints Committee constituted, trained, with contacts displayed on notice boards and the website.',
          'Anti-Ragging Committee and Squad in place; anti-ragging undertakings collected at admission.',
          'Written policies on harassment, ragging, conduct, hostels, digital use and emergencies.',
          'A safety committee with student representatives that meets regularly.',
        ],
      },
      { type: 'h2', text: 'Campus and hostels' },
      {
        type: 'ul',
        items: [
          'Lighting on all paths, car parks and between hostels and academic blocks.',
          'Access control and night-time security at hostels.',
          'Police verification for security, hostel and contract staff.',
          'CCTV in common areas, with controlled footage access.',
          'Fire safety equipment checked; exits clear.',
        ],
      },
      { type: 'h2', text: 'Emergencies' },
      {
        type: 'ul',
        items: [
          'A written emergency plan with 24-hour roles. See [college emergency response plan](/blog/college-emergency-plan).',
          'A way to alert every student quickly, tested each term.',
          'Drills in academic blocks and hostels, including at night.',
          'Medical response and hospital tie-ups; ambulance access.',
        ],
      },
      { type: 'h2', text: 'Reporting' },
      {
        type: 'ul',
        items: [
          'Several reporting channels, including anonymous. See [college safety reporting system](/blog/college-safety-reporting-system).',
          'A log of reports and outcomes, reviewed each semester.',
          'Protection from retaliation for students who report.',
        ],
      },
      { type: 'h2', text: 'Cyber safety and students’ data' },
      {
        type: 'ul',
        items: [
          'A digital conduct policy covering harassment in class groups and social media.',
          'Student data collected only as needed, with restricted access.',
          'Secure accounts and two-step verification for staff systems.',
        ],
      },
      { type: 'h2', text: 'Wellbeing' },
      {
        type: 'ul',
        items: [
          'Counselling services that students know about and can reach quickly.',
          'Orientation covering safety, consent, ragging and how to get help. See our [guide to ragging](/blog/ragging-guide).',
        ],
      },
    ],
    faqs: [
      {
        question: 'What should a college safety audit cover?',
        answer:
          'Statutory committees and policies, campus lighting and hostel security, staff verification, CCTV and fire safety, an emergency plan with drills and alerts, reporting channels and records, cyber safety and student data, and counselling and orientation.',
      },
    ],
  },

  /* ---------------------------------------------------------------- workplace fire & first aid */
  {
    slug: 'workplace-fire-first-aid',
    title: 'Workplace fire safety and first-aid basics',
    seoTitle: 'Workplace Fire Safety and First-Aid Basics',
    description:
      'Preventing fires at work, using an extinguisher correctly, evacuating safely, and the first-aid basics every office, shop and factory should have in place.',
    seoDescription:
      'Fire safety and first aid at work: preventing fires, choosing and using an extinguisher, evacuating safely, first-aid kits and trained first-aiders.',
    category: 'corporate-safety',
    tags: ['Fire safety', 'First aid', 'Offices', 'Facilities'],
    keywords: ['workplace fire safety', 'first aid at work', 'how to use a fire extinguisher', 'office fire safety'],
    authorId: 'editorial',
    status: 'published',
    publishedAt: '2026-11-25',
    updatedAt: '2026-11-25',
    related: ['corporate-emergency-response-plan', 'what-to-do-during-an-emergency', 'business-emergency-plan', 'workplace-safety-guide'],
    sources: [NDMA, ERSS],
    accent: 'red',
    art: 'Fire',
    body: [
      {
        type: 'p',
        text: 'Most workplace fires start with something ordinary: overloaded sockets, faulty wiring, a kitchen, stored waste. Most injuries are made worse by delays. A little prevention and a few trained people change both. Follow the fire safety rules and building codes that apply to your premises and state.',
      },
      { type: 'h2', text: 'Prevent fires' },
      {
        type: 'ul',
        items: [
          'No overloaded sockets or daisy-chained extension boards; get wiring checked.',
          'Switch off equipment at the end of the day.',
          'Keep exits, stairs and corridors clear of boxes and furniture.',
          'Store flammable materials safely; keep kitchens and pantries clean.',
          'Smoke detectors and alarms installed and tested.',
        ],
      },
      { type: 'h2', text: 'Using an extinguisher' },
      {
        type: 'p',
        text: 'Only tackle a small fire, with a clear exit behind you, and only if you have been trained. Remember **PASS**: Pull the pin, Aim at the base of the fire, Squeeze the handle, Sweep side to side. Use the right type: water for paper and wood only; CO2 for electrical fires; dry powder for most mixed fires. Never use water on electrical or oil fires.',
      },
      { type: 'h2', text: 'Evacuating' },
      {
        type: 'ol',
        items: [
          'Raise the alarm and call 101 or 112.',
          'Leave by the nearest safe exit; never use lifts.',
          'Stay low if there is smoke; feel doors for heat before opening.',
          'Go to the assembly point and report to the floor warden.',
          'Never go back inside for belongings.',
        ],
      },
      { type: 'h2', text: 'First aid at work' },
      {
        type: 'ul',
        items: [
          'Stocked first-aid kits on every floor, checked monthly.',
          'Trained first-aiders on every shift, their names displayed.',
          'Some staff trained in CPR.',
          'The nearest hospital and ambulance number (108 or 112) displayed.',
          'A record of every injury and the treatment given.',
        ],
      },
      {
        type: 'p',
        text: 'Build these into your [corporate emergency response plan](/blog/corporate-emergency-response-plan) or [small business emergency plan](/blog/business-emergency-plan). For any emergency, see [what to do in an emergency](/blog/what-to-do-during-an-emergency).',
      },
    ],
    faqs: [
      {
        question: 'How do you use a fire extinguisher?',
        answer:
          'Only on a small fire with a clear exit behind you: Pull the pin, Aim at the base of the fire, Squeeze the handle and Sweep side to side. Use CO2 for electrical fires and never use water on electrical or oil fires.',
      },
    ],
  },
];
