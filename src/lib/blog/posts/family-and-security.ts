import type { BlogPost, Source } from '../types';

/**
 * Batch 4: family emergency plan, older relatives and scams, parties, passwords and two-step
 * verification, WhatsApp settings. Elderline 14567 runs 8 am to 8 pm (Ministry of Social Justice
 * and Empowerment). Checked 2026-11-25.
 */

const ERSS: Source = { title: 'Emergency Response Support System (112)', publisher: 'Ministry of Home Affairs', url: 'https://112.gov.in/' };
const NCRP: Source = {
  title: 'National Cyber Crime Reporting Portal (cybercrime.gov.in)',
  publisher: 'Indian Cyber Crime Coordination Centre, Ministry of Home Affairs',
  url: 'https://cybercrime.gov.in/',
};

export const FAMILY_AND_SECURITY_POSTS: BlogPost[] = [
  /* ---------------------------------------------------------------- family plan */
  {
    slug: 'family-emergency-plan',
    title: 'How to make a family emergency plan',
    seoTitle: 'Family Emergency Plan: A Simple Checklist',
    description:
      'Who calls whom, where you meet, what every family member should know by heart, and the documents and kit to keep ready: a one-evening plan for the whole family.',
    category: 'family-safety',
    tags: ['Family', 'Emergency plan', 'Checklist', 'Children'],
    keywords: ['family emergency plan', 'how families can create a safety plan', 'family emergency contact checklist', 'how to prepare your family for emergencies', 'family safety checklist'],
    authorId: 'editorial',
    status: 'published',
    publishedAt: '2026-11-25',
    updatedAt: '2026-11-25',
    related: ['family-safety-guide', 'emergency-preparedness-checklist', 'emergency-contact-checklist', 'teach-children-personal-safety'],
    sources: [ERSS, { title: 'DigiLocker', publisher: 'Ministry of Electronics and Information Technology', url: 'https://www.digilocker.gov.in/' }],
    accent: 'coral',
    art: 'Family',
    body: [
      {
        type: 'p',
        text: 'Emergencies rarely happen when everyone is together. A family plan means that whether it is a medical emergency, a fire, a child who has not come home or a phone that is lost, everyone already knows what to do. It takes one evening.',
      },
      { type: 'h2', text: '1. A contact list everyone has' },
      {
        type: 'ul',
        items: [
          'Every family member’s number, plus two relatives or neighbours who can help.',
          'The family doctor, nearest hospital, and children’s school or college.',
          '112 for emergencies; see our list of [emergency helpline numbers](/blog/emergency-helpline-numbers-india).',
          'Save it on every phone, and keep a printed copy on the fridge and in each bag or school bag.',
        ],
      },
      { type: 'h2', text: '2. What children should know by heart' },
      {
        type: 'ul',
        items: [
          'Their full name, their parents’ names and at least one parent’s phone number.',
          'Their home address or a nearby landmark.',
          'That **112** is for emergencies, and how to call it from a locked phone.',
          'Who they can go to if they are lost: a shopkeeper, a police officer, a mother with children, the school.',
          'A family code word that a stranger collecting them would have to know.',
        ],
      },
      { type: 'h2', text: '3. Meeting places' },
      {
        type: 'p',
        text: 'Pick two: one just outside your home (in case of fire), and one in your area that everyone can reach (in case you cannot get home or phones are down). For large crowds, such as festivals and railway stations, agree a meeting point before you go in.',
      },
      { type: 'h2', text: '4. Medical information' },
      {
        type: 'ul',
        items: [
          'Blood groups, allergies, long-term conditions and regular medicines for each person.',
          'Fill in the medical ID on each family member’s phone.',
          'Keep a copy of health insurance details somewhere everyone can find.',
        ],
      },
      { type: 'h2', text: '5. Documents' },
      {
        type: 'p',
        text: 'Keep official digital copies of IDs and important documents in [DigiLocker](https://www.digilocker.gov.in), and photocopies in a waterproof folder you can grab quickly.',
      },
      { type: 'h2', text: '6. A small emergency kit' },
      {
        type: 'ul',
        items: [
          'Torch, power bank and charging cables.',
          'First-aid kit and a few days of regular medicines.',
          'Some cash.',
          'Drinking water and dry snacks.',
          'Copies of the contact list and documents.',
        ],
      },
      { type: 'h2', text: '7. Who does what' },
      {
        type: 'p',
        text: 'Decide who calls 112, who calls relatives, who looks after younger children or older members, and who brings the kit. Then walk through one or two situations together, such as “Grandmother falls and cannot get up” or “Your sister has not come home and is not answering”.',
      },
      { type: 'h2', text: '8. Use technology together' },
      {
        type: 'p',
        text: 'Set each other as [trusted contacts](/blog/sos-and-trusted-contacts) in a safety app, so one tap can share a location in an emergency. Talk openly about [location sharing](/blog/live-location-safety): sharing during journeys works better, and builds more trust, than permanent tracking.',
      },
      {
        type: 'callout',
        tone: 'success',
        title: 'Review it twice a year',
        text: 'Update numbers, medicines and meeting places when something changes, such as a new school, job or home. Ask children to tell you the plan back in their own words.',
      },
    ],
    faqs: [
      {
        question: 'What should a family emergency plan include?',
        answer:
          'A shared contact list, what children should know by heart, two meeting places, each person’s medical information, copies of documents, a small kit, and who does what in an emergency.',
      },
    ],
  },

  /* ---------------------------------------------------------------- seniors */
  {
    slug: 'protect-older-parents-from-scams',
    title: 'Helping older parents stay safe from scams',
    seoTitle: 'Protect Older Parents From Scams: A Family Guide',
    description:
      'Scams that target older people in India, how to talk about them without being patronising, simple phone settings that help, and what to do if a parent has been cheated.',
    seoDescription: 'Scams that target senior citizens in India, how to talk about them without lecturing, phone settings that help, and what to do if a parent is cheated.',
    category: 'family-safety',
    tags: ['Senior citizens', 'Scams', 'Phone calls'],
    keywords: ['online safety tips for senior citizens', 'scams targeting senior citizens', 'how seniors can avoid phone scams', 'how families can help seniors stay safe online', 'scam calls'],
    authorId: 'editorial',
    status: 'published',
    publishedAt: '2026-11-25',
    updatedAt: '2026-11-25',
    related: ['senior-emergency-safety', 'voice-cloning-scams', 'common-online-scams-india', 'family-emergency-plan'],
    sources: [
      NCRP,
      { title: 'Elderline (14567): National Helpline for Senior Citizens', publisher: 'Ministry of Social Justice and Empowerment', url: 'https://pib.gov.in/PressReleasePage.aspx?PRID=1759358' },
      { title: 'Sanchar Saathi: Chakshu', publisher: 'Department of Telecommunications', url: 'https://www.sancharsaathi.gov.in/' },
    ],
    accent: 'blue',
    art: 'Call me first',
    body: [
      {
        type: 'p',
        text: 'Older people are often targeted by scammers: they may have savings, be less familiar with how apps work, and be more trusting of callers who sound official. The best protection is not a lecture but an agreement: **“If anyone asks for money or a code, call me first.”**',
      },
      { type: 'h2', text: 'Scams that commonly target older people' },
      {
        type: 'ul',
        items: [
          '**“Digital arrest”:** a caller posing as police or CBI says a parcel or bank account in their name is linked to a crime. No agency arrests anyone over a video call.',
          '**Pension, KYC and bank calls** asking for card details, OTPs or an app install.',
          '**A relative in trouble:** a call, sometimes with a voice that sounds like a grandchild, urgently asking for money. Voices can now be faked. See [deepfakes and voice cloning](/blog/deepfakes-what-to-do).',
          '**Fake customer care or tech support** that asks to install a remote-access app.',
          '**Investment schemes** promising guaranteed high returns.',
          '**Electricity or gas disconnection** messages demanding immediate payment.',
        ],
      },
      {
        type: 'p',
        text: 'More detail on each is in [common online scams in India](/blog/common-online-scams-india).',
      },
      { type: 'h2', text: 'The rules to agree on' },
      {
        type: 'ol',
        items: [
          'Never share an OTP, PIN or card number with anyone who calls, even if they know your name and account details.',
          'Never install an app because a caller asks.',
          'Banks, police and government offices do not ask for money over the phone or a video call.',
          'If a call feels urgent or frightening, hang up and call a family member.',
          'Use a family code word for genuine emergencies.',
        ],
      },
      { type: 'h2', text: 'How to talk about it' },
      {
        type: 'ul',
        items: [
          'Share stories rather than rules: “This happened to my colleague’s father.”',
          'Make it clear that being targeted says nothing about intelligence; scammers fool everyone.',
          'Promise there will be no blame if they ever fall for one, so they tell you quickly.',
        ],
      },
      { type: 'h2', text: 'Helpful phone settings' },
      {
        type: 'ul',
        items: [
          'Turn on spam call identification and silence unknown callers where the phone supports it.',
          'Set a separate PIN on UPI and banking apps, and a screen lock.',
          'Remove apps they do not use, and check that no remote-access apps are installed.',
          'Save your number as an “ICE” (in case of emergency) contact and as a favourite.',
          'Report suspected fraud calls and messages on Chakshu at sancharsaathi.gov.in.',
        ],
      },
      { type: 'h2', text: 'If they have been cheated' },
      {
        type: 'ol',
        items: [
          'Call **1930** immediately, then the bank.',
          'File at [cybercrime.gov.in](https://cybercrime.gov.in) together.',
          'Reassure them. Shame is the biggest reason older victims do not report.',
        ],
      },
      {
        type: 'callout',
        tone: 'info',
        title: 'Elderline 14567',
        text: 'The national helpline for senior citizens, 14567, runs from 8 am to 8 pm and helps with information on healthcare, pensions and legal matters, and with cases of abuse or neglect.',
      },
      { type: 'p', text: 'Help them set up [strong passwords and two-step verification](/blog/strong-passwords-two-step-verification) and the right [WhatsApp safety settings](/blog/whatsapp-safety-settings).' },
    ],
    faqs: [
      {
        question: 'How can I protect my parents from phone scams?',
        answer:
          'Agree that they will call you before paying anyone or sharing a code, explain that banks and police never ask for money or OTPs on calls, turn on spam protection and app PINs on their phone, and promise there will be no blame if they are ever cheated.',
      },
      {
        question: 'Is there a helpline for senior citizens in India?',
        answer: 'Yes. Elderline, 14567, is the national helpline for senior citizens and runs from 8 am to 8 pm. For emergencies, call 112.',
      },
    ],
  },

  /* ---------------------------------------------------------------- parties */
  {
    slug: 'party-safety-tips',
    title: 'Staying safe at parties and nights out',
    seoTitle: 'Party Safety Tips: Drinks, Friends and Getting Home',
    description:
      'How to plan a night out, protect your drink, look out for your friends, and what to do if someone suddenly becomes very unwell.',
    category: 'personal-safety',
    tags: ['Parties', 'Nights out', 'Friends'],
    keywords: ['how to stay safe at parties and social events', 'party safety tips', 'drink spiking', 'night out safety', 'personal safety tips'],
    authorId: 'editorial',
    status: 'published',
    publishedAt: '2026-11-25',
    updatedAt: '2026-11-25',
    related: ['crowd-safety', 'night-travel-safety-women', 'live-location-safety', 'college-freshers-safety-checklist'],
    sources: [ERSS],
    accent: 'ink',
    art: 'Night out',
    body: [
      {
        type: 'p',
        text: 'A good night out is one where everyone gets home safely. Most of that comes down to a plan made before you go, and friends who look out for each other.',
      },
      { type: 'h2', text: 'Before you go' },
      {
        type: 'ul',
        items: [
          'Go with friends, and agree that you will leave together or check in before anyone leaves.',
          'Plan how you will get home, and keep money for a cab aside.',
          'Charge your phone, and tell someone at home where you will be.',
          'Eat beforehand if you plan to drink.',
        ],
      },
      { type: 'h2', text: 'Your drink' },
      {
        type: 'ul',
        items: [
          'Watch your drink being poured, and keep it with you.',
          'Do not accept drinks from people you do not know.',
          'If you leave your drink unattended, get a new one.',
          'Pace yourself, and alternate with water.',
        ],
      },
      {
        type: 'callout',
        tone: 'warn',
        title: 'If someone suddenly seems very unwell',
        text: 'If you or a friend feel much more drunk than you should, or become confused, very drowsy or unable to stand after little alcohol, get help immediately. Tell staff, stay with the person, keep them away from anyone they do not know, and call 112 or 108 for medical help. Do not let them leave alone or with a stranger.',
      },
      { type: 'h2', text: 'Look out for each other' },
      {
        type: 'ul',
        items: [
          'Agree a signal or code word that means “I want to leave now”.',
          'Check in on friends during the night, especially anyone who has gone quiet.',
          'If someone is too drunk to decide, they are too drunk to consent, and too drunk to go home with anyone. Take them home yourselves.',
          'If someone is being harassed, step in safely: interrupt, get staff, stay with them. See [what to do if you are harassed in public](/blog/harassed-in-public-what-to-do).',
        ],
      },
      { type: 'h2', text: 'Getting home' },
      {
        type: 'ul',
        items: [
          'Book cabs from the app, check the plate, and share your trip. See [night travel safety](/blog/night-travel-safety-women).',
          'Share your [live location](/blog/live-location-safety) with a friend until you are in.',
          'Message your group when you are home.',
        ],
      },
      { type: 'h2', text: 'If something happened' },
      {
        type: 'p',
        text: 'If you think you were drugged or assaulted, you are not to blame. Get to a safe place and seek medical care as soon as possible. Call **112** in an emergency, or **181**, the Women Helpline, for support, including access to One Stop Centres that provide medical, legal and counselling help.',
      },
    ],
    faqs: [
      {
        question: 'How do I keep my drink safe at a party?',
        answer:
          'Watch it being poured, keep it with you, do not accept drinks from people you do not know, and get a new one if you leave it unattended.',
      },
      {
        question: 'What should I do if a friend suddenly seems very drunk or unwell?',
        answer:
          'Stay with them, tell staff, keep them away from strangers, and call 112 or 108 for medical help. Do not let them leave alone or with someone they do not know.',
      },
    ],
  },

  /* ---------------------------------------------------------------- passwords & 2FA */
  {
    slug: 'strong-passwords-two-step-verification',
    title: 'Strong passwords and two-step verification, made simple',
    seoTitle: 'Strong Passwords and Two-Step Verification Made Simple',
    description:
      'What actually makes a password strong, why reusing passwords is the real danger, how password managers and passkeys help, and how to turn on two-step verification.',
    seoDescription: 'What makes a password strong, why reusing passwords is the real risk, how password managers and passkeys help, and how to turn on two-step login.',
    category: 'cyber-safety',
    tags: ['Passwords', 'Two-step verification', 'Account security'],
    keywords: ['how to create a strong password', 'how to use two-factor authentication', 'two-step verification', 'why you should never share OTPs', 'password manager'],
    authorId: 'editorial',
    status: 'published',
    publishedAt: '2026-11-25',
    updatedAt: '2026-11-25',
    related: ['account-hacked-what-to-do', 'whatsapp-safety-settings', 'social-media-privacy-settings'],
    sources: [
      { title: 'Indian Computer Emergency Response Team (CERT-In)', publisher: 'Ministry of Electronics and Information Technology', url: 'https://www.cert-in.org.in/' },
      { title: 'Google Safety Center', publisher: 'Google', url: 'https://safety.google/' },
    ],
    accent: 'blue',
    art: '2-step',
    body: [
      {
        type: 'p',
        text: 'Most accounts are not broken into by clever hacking. They are opened with a password that leaked from another site, a code someone was tricked into sharing, or a password that was easy to guess. Three habits stop nearly all of it.',
      },
      { type: 'h2', text: '1. Use a different password for every important account' },
      {
        type: 'p',
        text: 'When any website is breached, attackers try the leaked email and password on email, social media and shopping sites. If you reuse passwords, one breach opens everything. Start with your email: it should have a password used nowhere else.',
      },
      { type: 'h2', text: '2. Make passwords long, not complicated' },
      {
        type: 'ul',
        items: [
          'Length matters most. A passphrase of four or five unrelated words is strong and easy to remember: “mango bicycle river lantern”.',
          'Avoid names, birthdays, phone numbers, “password”, “123456” and your favourite team.',
          'Do not just add “@123” to an old password.',
        ],
      },
      { type: 'h2', text: '3. Turn on two-step verification' },
      {
        type: 'p',
        text: 'Two-step verification (also called two-factor authentication or 2FA) means a stolen password is not enough: someone also needs your phone or security key. Turn it on for email, social media, WhatsApp and anything with money in it. The options, from strongest to simplest:',
      },
      {
        type: 'table',
        head: ['Method', 'Notes'],
        rows: [
          ['Passkeys or security keys', 'Strongest, and resistant to fake login pages. Increasingly supported by Google, Apple and others.'],
          ['Authenticator app', 'A six-digit code on your phone that changes every 30 seconds. Works without network.'],
          ['SMS code', 'Much better than nothing, but can be intercepted or diverted, for example through SIM swap fraud.'],
        ],
      },
      {
        type: 'p',
        text: 'Save the backup codes the service gives you somewhere safe, offline, in case you lose your phone.',
      },
      { type: 'h2', text: 'Never share a code' },
      {
        type: 'p',
        text: 'A one-time code is the key to your account at that moment. No bank, company or friend needs it. If someone asks for an OTP, they are trying to get into your account or your money, even if the message comes from a friend’s account (which may itself be hacked).',
      },
      { type: 'h2', text: 'Let a password manager remember them' },
      {
        type: 'p',
        text: 'Nobody can remember dozens of unique passwords. A password manager, including the ones built into Google and Apple accounts, creates and stores them for you, and fills them in only on the real website, which also protects you from fake login pages. Protect it with one strong passphrase and two-step verification.',
      },
      { type: 'h2', text: 'Quick checklist' },
      {
        type: 'ol',
        items: [
          'Change your email password to a unique passphrase and turn on two-step verification.',
          'Do the same for WhatsApp; see [WhatsApp safety settings](/blog/whatsapp-safety-settings).',
          'Then social media, banking and shopping accounts.',
          'Check for old devices and sessions you no longer use, and sign them out.',
        ],
      },
      {
        type: 'p',
        text: 'Already locked out? See [what to do if your account gets hacked](/blog/account-hacked-what-to-do).',
      },
      { type: 'p', text: 'Then review your [social media privacy settings](/blog/social-media-privacy-settings).' },
    ],
    faqs: [
      {
        question: 'What makes a password strong?',
        answer:
          'Length and uniqueness. A passphrase of four or five unrelated words that you use nowhere else is strong and easy to remember. Avoid names, dates and common patterns.',
      },
      {
        question: 'Why should I never share an OTP?',
        answer:
          'A one-time code is the final key to your account or a payment. No genuine bank, company or friend needs it, so anyone asking for one is trying to access your account or money.',
      },
    ],
  },

  /* ---------------------------------------------------------------- whatsapp */
  {
    slug: 'whatsapp-safety-settings',
    title: 'WhatsApp safety and privacy settings to turn on today',
    seoTitle: 'How to Protect Your WhatsApp Account: 10 Settings to Check',
    description:
      'Two-step verification, who can add you to groups, silencing unknown callers, linked devices and more: the WhatsApp settings that stop takeovers, spam and unwanted contact.',
    seoDescription: 'Two-step verification, group privacy, silencing unknown callers, linked devices and more: the WhatsApp settings that stop takeovers and spam.',
    category: 'digital-privacy',
    tags: ['WhatsApp', 'Privacy settings', 'Account security'],
    keywords: ['how to protect your WhatsApp account', 'WhatsApp privacy settings', 'WhatsApp two-step verification', 'secure messaging apps', 'WhatsApp hacked'],
    authorId: 'editorial',
    status: 'published',
    publishedAt: '2026-11-25',
    updatedAt: '2026-11-25',
    related: ['strong-passwords-two-step-verification', 'social-media-privacy-settings', 'account-hacked-what-to-do'],
    sources: [{ title: 'WhatsApp Help Center', publisher: 'WhatsApp', url: 'https://faq.whatsapp.com/' }],
    accent: 'ink',
    art: 'Chat safe',
    body: [
      {
        type: 'p',
        text: 'WhatsApp is how most people in India talk to family, classmates and colleagues, which also makes it a favourite target for scammers and harassers. These settings take ten minutes. Menu names can change slightly between versions; most are under **Settings → Privacy** and **Settings → Account**.',
      },
      { type: 'h2', text: 'Stop account takeovers' },
      {
        type: 'ol',
        items: [
          '**Turn on two-step verification** (Settings → Account). You choose a PIN that is needed when your number is registered on a new phone. Add an email so you can reset it. This stops the common scam where someone tricks you into sharing your six-digit registration code.',
          '**Check linked devices** (Settings → Linked devices). Log out of any computer or browser you do not recognise.',
          '**Never share your registration code** with anyone, even a friend who “sent it to you by mistake”.',
        ],
      },
      { type: 'h2', text: 'Control who can reach you' },
      {
        type: 'ol',
        items: [
          '**Groups:** set who can add you to groups to “My contacts” so strangers cannot drop you into scam groups.',
          '**Silence unknown callers:** calls from numbers not in your contacts go silent but still appear in your call list.',
          '**Block and report** anyone who sends abuse or scams, directly from the chat.',
        ],
      },
      { type: 'h2', text: 'Control what people see' },
      {
        type: 'ol',
        items: [
          '**Profile photo, about and last seen:** limit them to “My contacts” or “Nobody”.',
          '**Read receipts and online status:** turn them off if you want less pressure to reply.',
          '**Live location:** check which chats you are sharing live location with, and stop any you no longer need. See [live location safety](/blog/live-location-safety).',
          '**Disappearing messages** can be turned on for sensitive chats, but remember the other person can still take screenshots.',
        ],
      },
      {
        type: 'p',
        text: 'WhatsApp also has a built-in **Privacy checkup** that walks you through these settings.',
      },
      { type: 'h2', text: 'If something goes wrong' },
      {
        type: 'ul',
        items: [
          '**Locked out or hijacked:** reinstall WhatsApp and register your number again with the SMS code; it logs the other person out. See [account hacked](/blog/account-hacked-what-to-do).',
          '**Harassment:** save screenshots with the number and dates before blocking. See [preserving digital evidence](/blog/how-to-preserve-digital-evidence).',
          '**Scam messages:** do not click links or reply; report suspected fraud on Chakshu at sancharsaathi.gov.in, or call **1930** if you lost money.',
        ],
      },
    ],
    faqs: [
      {
        question: 'How do I protect my WhatsApp account from being hacked?',
        answer:
          'Turn on two-step verification with a PIN and a recovery email, never share your six-digit registration code, and check linked devices regularly for computers or browsers you do not recognise.',
      },
      {
        question: 'How do I stop strangers adding me to WhatsApp groups?',
        answer: 'In the privacy settings, set who can add you to groups to “My contacts”. Others will have to send you an invite instead.',
      },
    ],
  },
];
