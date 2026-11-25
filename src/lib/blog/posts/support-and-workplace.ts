import type { BlogPost, Source } from '../types';

/**
 * Workplace harassment (POSH), harassment in public, supporting someone, and SOS / trusted
 * contacts. POSH timelines from the Sexual Harassment of Women at Workplace Act, 2013 (a 2024
 * bill proposed lengthening the filing window; re-check before updating). SOS claims match the
 * app: 3-second countdown you can cancel, up to 5 emergency contacts get a text with a live
 * location link (no app needed, position only), organisations are never notified, and "I'm safe"
 * ends it. Checked 2026-11-25.
 */

const SHEBOX: Source = { title: 'SHe-Box: file a workplace sexual harassment complaint online', publisher: 'Ministry of Women and Child Development', url: 'https://shebox.wcd.gov.in/' };
const ERSS: Source = { title: 'Emergency Response Support System (112)', publisher: 'Ministry of Home Affairs', url: 'https://112.gov.in/' };
const WHL: Source = { title: 'Women Helpline (181)', publisher: 'Ministry of Women and Child Development (myScheme)', url: 'https://www.myscheme.gov.in/schemes/whl-181' };
const NCW: Source = { title: 'Helplines and online complaints', publisher: 'National Commission for Women', url: 'https://www.ncw.gov.in/' };
const TELE_MANAS: Source = { title: 'Tele MANAS (14416)', publisher: 'Ministry of Health and Family Welfare', url: 'https://telemanas.mohfw.gov.in/' };

export const SUPPORT_AND_WORKPLACE_POSTS: BlogPost[] = [
  /* ---------------------------------------------------------------- POSH */
  {
    slug: 'workplace-harassment-posh',
    title: 'Sexual harassment at work: how to report it under the POSH Act',
    seoTitle: 'How to Report Workplace Sexual Harassment (POSH Guide)',
    description:
      'What counts as sexual harassment at work, how the Internal Committee and Local Committee work, the time limits, and how to file a complaint, including on SHe-Box.',
    seoDescription: 'How to report sexual harassment at work in India under the POSH Act: Internal and Local Committees, the 3-month limit, the inquiry and SHe-Box.',
    category: 'workplace-safety',
    tags: ['POSH', 'Workplace harassment', 'Internal Committee', 'SHe-Box'],
    keywords: ['workplace harassment', 'how to report workplace harassment', 'POSH Act complaint', 'sexual harassment at work India', 'Internal Committee', 'SHe-Box'],
    authorId: 'editorial',
    status: 'published',
    publishedAt: '2026-11-25',
    updatedAt: '2026-11-25',
    related: ['document-workplace-harassment', 'workplace-safety-for-women', 'hr-complaint-handling', 'digital-harassment-at-work'],
    sources: [SHEBOX, NCW, WHL],
    accent: 'ink',
    art: 'POSH',
    body: [
      {
        type: 'p',
        text: 'The **Sexual Harassment of Women at Workplace (Prevention, Prohibition and Redressal) Act, 2013**, usually called the POSH Act, gives every woman the right to a workplace free of sexual harassment, and sets out how complaints must be handled. Here is what it means in practice.',
      },
      { type: 'h2', text: 'What counts as sexual harassment' },
      {
        type: 'ul',
        items: [
          'Unwelcome physical contact or advances.',
          'Demands or requests for sexual favours.',
          'Sexually coloured remarks, jokes or messages.',
          'Showing pornography or sexual images.',
          'Any other unwelcome physical, verbal or non-verbal conduct of a sexual nature.',
        ],
      },
      {
        type: 'p',
        text: 'It also covers implied promises of better treatment, or threats of worse treatment, linked to such conduct, and creating a hostile or intimidating work environment. Messages, calls and online behaviour by a colleague count, even outside office hours.',
      },
      {
        type: 'p',
        text: 'The “workplace” is broad. It includes offices, client sites, places you visit for work, and transport provided by the employer. The Act protects any woman at the workplace, including employees, interns, trainees, contract staff and visitors.',
      },
      { type: 'h2', text: 'Who you complain to' },
      {
        type: 'table',
        head: ['Your situation', 'Where to complain'],
        rows: [
          ['Organisation with 10 or more workers', 'The **Internal Committee (IC)**, sometimes still called the ICC'],
          ['Fewer than 10 workers, or the complaint is against the employer', 'The **Local Committee (LC)** set up by the District Officer'],
          ['Informal or unorganised work, including domestic work', 'The Local Committee'],
        ],
      },
      {
        type: 'p',
        text: 'Your employer must display the IC members’ names and contact details. If you cannot find them, ask HR, or check the policy on the intranet.',
      },
      { type: 'h2', text: 'How to file a complaint' },
      {
        type: 'ol',
        items: [
          '**Write down what happened:** dates, times, places, what was said or done, and any witnesses. Do it as soon as you can.',
          '**Keep evidence:** messages, emails, call logs and screenshots. See [how to preserve digital evidence](/blog/how-to-preserve-digital-evidence).',
          '**Submit a written complaint** to the IC or LC, within **three months** of the incident (or of the last incident, if there were several). The committee can extend this by up to three more months if there were good reasons for the delay. If you cannot write it yourself, committee members are expected to help.',
          '**Or file online on [SHe-Box](https://shebox.wcd.gov.in)**, the government portal, which forwards your complaint to the relevant committee.',
          '**Keep copies** of everything you submit and note the date.',
        ],
      },
      { type: 'h2', text: 'What happens next' },
      {
        type: 'ul',
        items: [
          'The committee sends a copy of the complaint to the person you complained about, who can respond.',
          'At your request, the committee can try conciliation first, but a monetary settlement cannot be the basis of conciliation.',
          'Otherwise, it holds an inquiry, which should be completed within **90 days**. Both sides can present evidence and witnesses.',
          'During the inquiry you can ask for interim relief, such as a transfer of either person or leave.',
          'The committee sends its findings and recommendations to the employer, who should act on them within **60 days**.',
          'The identities of the people involved and the details of the case must be kept confidential.',
        ],
      },
      {
        type: 'callout',
        tone: 'info',
        title: 'You can also go to the police',
        text: 'A POSH complaint does not stop you from filing a police complaint when the behaviour is a criminal offence, such as sexual harassment, stalking or assault. You can do both.',
      },
      { type: 'h2', text: 'If you are afraid of retaliation' },
      {
        type: 'p',
        text: 'Victimising someone for complaining is itself a serious matter for the committee and the employer. Keep a record of any changes in how you are treated after you complain, and report them to the committee. Women can also approach the [National Commission for Women](https://www.ncw.gov.in) or their State Commission for Women, or call **181**, the Women Helpline.',
      },
      { type: 'h2', text: 'Supporting a colleague' },
      {
        type: 'p',
        text: 'If a colleague confides in you, listen, believe them, and let them decide what to do. Offer to be a witness if you saw something. Our guide on [supporting someone who is being harassed](/blog/how-to-support-someone-being-harassed) has more.',
      },
      { type: 'p', text: 'If the harassment continues online, see [how to report cyber harassment](/blog/how-to-report-cyber-harassment). Students should read [harassment in college](/blog/harassment-in-college).' },
    ],
    faqs: [
      {
        question: 'What is the time limit to file a POSH complaint?',
        answer:
          'Under the POSH Act, a written complaint should be made within three months of the incident, or of the last incident in a series. The committee can extend this by up to three more months if there were good reasons for the delay.',
      },
      {
        question: 'Where do I complain if my company has no Internal Committee?',
        answer:
          'Complain to the Local Committee constituted by the District Officer in your district. You can also file online on [SHe-Box](https://shebox.wcd.gov.in).',
      },
      {
        question: 'Can I file a police complaint as well as a POSH complaint?',
        answer: 'Yes. Where the behaviour is a criminal offence, you can file a police complaint in addition to the POSH complaint.',
      },
    ],
  },

  /* ---------------------------------------------------------------- harassment in public */
  {
    slug: 'harassed-in-public-what-to-do',
    title: 'What to do if you are harassed in public',
    seoTitle: 'Harassed in Public? What to Do and How Bystanders Help',
    description:
      'Practical ways to respond to street harassment, groping or stalking in public places and on buses, trains and metros, and how bystanders can help safely.',
    category: 'womens-safety',
    tags: ['Street harassment', 'Public transport', 'Bystanders'],
    keywords: ['what to do if you are harassed in public', 'street harassment', 'how to handle street harassment safely', 'harassment on public transport', 'what to do if you feel unsafe in public'],
    authorId: 'editorial',
    status: 'published',
    publishedAt: '2026-11-25',
    updatedAt: '2026-11-25',
    related: ['what-to-do-if-you-feel-unsafe', 'what-to-do-if-someone-is-following-you', 'night-travel-safety-women', 'how-to-support-someone-being-harassed'],
    sources: [ERSS, WHL, { title: 'Rail Madad (139)', publisher: 'Ministry of Railways', url: 'https://railmadad.indianrailways.gov.in/' }],
    accent: 'coral',
    art: 'Not okay',
    body: [
      {
        type: 'p',
        text: 'Harassment in public, whether comments, staring, following, groping or someone exposing themselves, is not something you have to put up with, and it is never your fault. There is no single right response. The right one is whatever keeps you safest in that moment.',
      },
      { type: 'h2', text: 'In the moment' },
      {
        type: 'ul',
        items: [
          '**Move away** towards other people, staff, a shop or a well-lit area.',
          '**Make it visible** if you feel safe to: say clearly and loudly what is happening, such as “Stop touching me” or “This man is following me”. Naming the behaviour often makes the harasser back off and gets others to notice.',
          '**Ask a specific person for help:** “You in the blue shirt, please stay with me.” A direct request works better than a general appeal.',
          '**Do not engage** in an argument if you feel unsafe. Leaving is a strong response, not a weak one.',
          '**Call 112** if you feel in danger, or if the person follows you or touches you.',
        ],
      },
      { type: 'h2', text: 'On buses, trains and the metro' },
      {
        type: 'ul',
        items: [
          'Tell the conductor, driver, guard or station staff; they can stop the vehicle, move the person or call police.',
          'On trains, call **139** (Rail Madad) for help during the journey.',
          'Move to a busier part of the vehicle, or a women’s coach where available.',
          'Note the bus number, route, coach number or time, which helps any complaint.',
        ],
      },
      { type: 'h2', text: 'Afterwards' },
      {
        type: 'ol',
        items: [
          'Write down what happened, where and when, and what the person looked like.',
          'If you took a photo or video, or a witness did, keep it safe. Only record if it is safe to do so.',
          'Report it. Sexual harassment in public is an offence, and you can complain at any police station or call 112. **181**, the Women Helpline, can also guide you.',
          'Talk to someone you trust. Feeling shaken, angry or numb afterwards is normal.',
        ],
      },
      {
        type: 'p',
        text: 'On Sabhijude, you can report an unsafe place or incident to the community feed, anonymously if you prefer, so others nearby are aware.',
      },
      { type: 'h2', text: 'If you see someone being harassed' },
      {
        type: 'p',
        text: 'You do not have to confront anyone to help. Choose whatever is safe for you:',
      },
      {
        type: 'ul',
        items: [
          '**Distract:** interrupt with an ordinary question, such as asking the person being harassed for directions or the time, or stand between them.',
          '**Get help:** tell the driver, staff or security, or call 112.',
          '**Stay:** simply standing nearby and making eye contact with the person being harassed shows they are not alone.',
          '**Check in afterwards:** ask if they are okay and whether they want help reporting.',
          '**Record only if helpful:** if you film, keep a safe distance and give the recording to the person harassed; do not post it without their consent.',
        ],
      },
      {
        type: 'p',
        text: 'If you are being followed after an incident, see [what to do if someone is following you](/blog/what-to-do-if-someone-is-following-you).',
      },
      { type: 'p', text: 'Plan ahead with our [night travel safety tips](/blog/night-travel-safety-women), and keep the [emergency helpline numbers](/blog/emergency-helpline-numbers-india) saved on your phone.' },
    ],
    faqs: [
      {
        question: 'What should I do if I feel unsafe in public?',
        answer:
          'Move towards other people, staff or a shop, ask a specific person to stay with you, and call someone you trust. If you feel in danger, call 112.',
      },
      {
        question: 'How can bystanders help someone being harassed?',
        answer:
          'Without confronting anyone, you can distract, for example by asking the person a simple question, alert staff or call 112, stand nearby so they are not alone, and check in afterwards.',
      },
    ],
  },

  /* ---------------------------------------------------------------- supporting someone */
  {
    slug: 'how-to-support-someone-being-harassed',
    title: 'How to support someone who is being harassed',
    seoTitle: 'How to Support Someone Who Is Being Harassed',
    description:
      'What to say, what not to say, and practical ways to help a friend, family member or colleague who is being harassed, online or offline, without taking over.',
    category: 'community-safety',
    tags: ['Supporting victims', 'Friends', 'Family'],
    keywords: ['how to support someone experiencing harassment', 'what to say to someone who has been harassed', 'how to help a friend being cyberbullied', 'support victims of harassment'],
    authorId: 'editorial',
    status: 'published',
    publishedAt: '2026-11-25',
    updatedAt: '2026-11-25',
    related: ['personal-safety-plan', 'how-to-report-cyber-harassment', 'cyberbullying-india', 'workplace-harassment-posh'],
    sources: [WHL, TELE_MANAS, ERSS],
    accent: 'blue',
    art: 'I believe you',
    body: [
      {
        type: 'p',
        text: 'When someone tells you they are being harassed, how you respond in the first few minutes matters a lot. It can decide whether they seek help, or go silent. You do not need to have the answers. You need to listen, believe them and help them stay in control.',
      },
      { type: 'h2', text: 'What to say' },
      {
        type: 'ul',
        items: [
          '“I believe you.”',
          '“It is not your fault.”',
          '“Thank you for telling me.”',
          '“What would help right now?”',
          '“You do not have to decide anything today.”',
        ],
      },
      { type: 'h2', text: 'What not to say' },
      {
        type: 'ul',
        items: [
          'Anything that questions their choices: “Why did you reply?”, “Why were you out so late?”, “Why did you send that photo?”',
          'Minimising: “Just ignore it”, “That’s just how he is”, “It’s only online.”',
          'Pressure: “You have to report it now”, or the opposite, “Don’t make a fuss.”',
          'Making it about you: “I’m going to sort him out.”',
        ],
      },
      {
        type: 'p',
        text: 'People often stay silent because they fear being blamed, not being believed, or losing control of what happens next. Every response above feeds one of those fears.',
      },
      { type: 'h2', text: 'Practical ways to help' },
      {
        type: 'ol',
        items: [
          '**Check immediate safety.** If they are in danger, help them call 112 or get somewhere safe.',
          '**Help them keep evidence.** Offer to take screenshots or keep a log for them, so they do not have to keep rereading abuse. See [how to preserve evidence](/blog/how-to-preserve-digital-evidence).',
          '**Explain the options** without choosing for them: reporting to a platform, the college or workplace committee, the police, or a helpline.',
          '**Offer to go with them** to the police station, the committee or a counsellor.',
          '**Help make a plan:** trusted contacts, safe routes, code words. See [how to create a personal safety plan](/blog/personal-safety-plan).',
          '**Keep checking in** over the following weeks, not just on the first day.',
        ],
      },
      { type: 'h2', text: 'Respect their privacy' },
      {
        type: 'p',
        text: 'Do not share their story, screenshots or the harasser’s name with others, or post about it, without their clear permission. Confronting the harasser yourself can make things more dangerous for them. The exception is when you believe someone is at serious risk of harm, especially a child; then involve a trusted adult, a helpline or the police.',
      },
      { type: 'h2', text: 'Where to point them' },
      {
        type: 'ul',
        items: [
          '**112** for any emergency.',
          '**181**, the Women Helpline, for advice, shelter and legal support through One Stop Centres.',
          '**1930** or [cybercrime.gov.in](https://cybercrime.gov.in) for online harassment. See [how to report cyber harassment](/blog/how-to-report-cyber-harassment).',
          '**1098** (Childline) if the person is a child.',
          '**14416** (Tele MANAS) for free mental health support.',
        ],
      },
      { type: 'h2', text: 'Look after yourself too' },
      {
        type: 'p',
        text: 'Supporting someone through harassment can be draining. It is okay to set limits, to ask others to share the load, and to talk to someone yourself.',
      },
    ],
    faqs: [
      {
        question: 'What should I say to someone who has been harassed?',
        answer:
          'Simple, steady words help most: “I believe you”, “It is not your fault”, “Thank you for telling me” and “What would help right now?” Avoid questions that sound like blame.',
      },
      {
        question: 'Should I report harassment on someone’s behalf?',
        answer:
          'Usually, let them decide, and offer to help them report. Reporting without their consent can take away their sense of control. If you believe someone, especially a child, is at serious risk, involve a trusted adult, a helpline or the police.',
      },
    ],
  },

  /* ---------------------------------------------------------------- SOS & trusted contacts */
  {
    slug: 'sos-and-trusted-contacts',
    title: 'SOS and trusted contacts: set them up so they actually help',
    seoTitle: 'How to Set Up SOS and Emergency Contacts That Work',
    description:
      'How to choose your emergency contacts, what they should do when an alert arrives, how SOS features work, and why SOS and calling 112 are different.',
    category: 'emergency-help',
    tags: ['SOS', 'Trusted contacts', 'Emergency contacts'],
    keywords: ['what is a trusted contact', 'how to set up emergency contacts', 'SOS emergency feature', 'emergency contact checklist', 'SOS vs calling emergency services'],
    authorId: 'editorial',
    status: 'published',
    publishedAt: '2026-11-25',
    updatedAt: '2026-11-25',
    related: ['technology-and-personal-safety', 'personal-safety-plan', 'emergency-helpline-numbers-india', 'live-location-safety'],
    sources: [ERSS],
    accent: 'red',
    art: 'SOS',
    body: [
      {
        type: 'p',
        text: 'An SOS feature is only as good as the people on the other end. Most people add a couple of contacts once and never tell them. Then, when an alert arrives, the contact is asleep, confused, or unsure what to do. Here is how to set things up so help actually happens.',
      },
      { type: 'h2', text: 'SOS vs calling 112' },
      {
        type: 'table',
        head: ['', 'SOS alert', 'Calling 112'],
        rows: [
          ['Who it reaches', 'People you chose: family and friends', 'Police, fire and ambulance services'],
          ['What they get', 'Usually your location, and a message that you need help', 'What you tell them on the call'],
          ['Best for', 'Letting people who know you act fast, even when you cannot talk', 'Any situation that needs police or medical help'],
        ],
        caption: 'They work together. In a real emergency, do both if you can.',
      },
      { type: 'h2', text: 'Choosing your trusted contacts' },
      {
        type: 'ul',
        items: [
          'People who **answer their phone**, including at night.',
          'People who **live or work near you**, or can reach you quickly.',
          'People who stay **calm** and will act, not panic.',
          'A **mix**: for example, a family member, a friend in your city and a flatmate or colleague.',
        ],
      },
      { type: 'h2', text: 'Tell them, and agree what to do' },
      {
        type: 'p',
        text: 'Ask each person before you add them, and agree what they should do if an alert arrives:',
      },
      {
        type: 'ol',
        items: [
          'Try calling you once. If you do not answer, do not keep calling; your phone ringing may not be safe.',
          'Open the location link and watch where you are.',
          'Call 112 with your location if they cannot reach you, or if your location looks wrong.',
          'Call or message the other contacts, so they coordinate instead of duplicating.',
          'Go to you if they are close and it is safe.',
        ],
      },
      {
        type: 'p',
        text: 'Give them the details they would need: your address, workplace or college, usual routes, a recent photo, and any medical conditions.',
      },
      { type: 'h2', text: 'Test it' },
      {
        type: 'p',
        text: 'Tell your contacts you are about to send a test, then send one, and check it reached everyone and the link opened. Test again whenever you change phones or SIMs. Never send a test without warning people first.',
      },
      { type: 'h2', text: 'Use it responsibly' },
      {
        type: 'ul',
        items: [
          'Keep SOS for real emergencies or genuine fear. False alarms make people slower to respond next time.',
          'If you trigger it by mistake, cancel it and message your contacts straight away.',
          'Once you are safe, end the alert so people know.',
        ],
      },
      { type: 'h2', text: 'How SOS works on Sabhijude' },
      {
        type: 'p',
        text: 'You can add up to five emergency contacts. When you press SOS, there is a short 3-second countdown you can cancel. Then your contacts get a text message with a link to your live location, which opens in any browser without the app and shows only your position. Your SOS is never sent to your college or employer, even if you belong to one on Sabhijude. When you are safe, tap “I’m safe” to end the alert and stop sharing your location. The emergency screen also lets you call 112 directly.',
      },
      {
        type: 'callout',
        tone: 'info',
        title: 'Your phone has one too',
        text: 'Android and iPhone both have built-in emergency SOS and medical ID features. Turn them on as well; they work even if an app is not open.',
      },
      {
        type: 'p',
        text: 'Trusted contacts are one part of a wider [personal safety plan](/blog/personal-safety-plan).',
      },
      { type: 'p', text: 'Add [live location sharing](/blog/live-location-safety) for journeys, and keep the [emergency helpline numbers](/blog/emergency-helpline-numbers-india) saved as well.' },
    ],
    faqs: [
      {
        question: 'What is a trusted contact?',
        answer:
          'A trusted contact is someone you choose to be alerted, with your location, if you need help. Choose people who answer their phone, live or work nearby and will act calmly, and agree with them in advance what they should do.',
      },
      {
        question: 'Is an SOS alert the same as calling 112?',
        answer:
          'No. An SOS alert reaches the people you chose, usually with your location. Calling 112 reaches police, fire and ambulance services. In an emergency, do both if you can.',
      },
      {
        question: 'How many emergency contacts should I have?',
        answer: 'Two to five. Enough that someone will answer, and few enough that each person knows what to do.',
      },
    ],
  },
];
