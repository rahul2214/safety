import type { BlogPost, Source } from '../types';

/**
 * Personal, women's and student safety, emergencies and live location (P0).
 *
 * Sabhijude claims must match the app: live location sharing runs for 1, 4, 8 or 24 hours or
 * until stopped, to up to 5 people who each get their own link (no app needed) and you can see
 * who opened it (LocationShareService); SOS sends your location to your emergency contacts.
 * Helpline numbers checked against official sources on 2026-11-25; re-check when updating.
 */

const ERSS: Source = { title: 'Emergency Response Support System (112)', publisher: 'Ministry of Home Affairs', url: 'https://112.gov.in/' };
const NCRP: Source = {
  title: 'National Cyber Crime Reporting Portal (cybercrime.gov.in)',
  publisher: 'Indian Cyber Crime Coordination Centre, Ministry of Home Affairs',
  url: 'https://cybercrime.gov.in/',
};
const WHL: Source = { title: 'Women Helpline (181)', publisher: 'Ministry of Women and Child Development (myScheme)', url: 'https://www.myscheme.gov.in/schemes/whl-181' };
const NCW: Source = { title: 'Helplines and online complaints', publisher: 'National Commission for Women', url: 'https://www.ncw.gov.in/' };
const INDIA_HELPLINES: Source = { title: 'Helpline directory', publisher: 'National Portal of India', url: 'https://www.india.gov.in/directory/helpline' };
const TELE_MANAS: Source = { title: 'Tele MANAS (14416)', publisher: 'Ministry of Health and Family Welfare', url: 'https://telemanas.mohfw.gov.in/' };
const ANTI_RAGGING: Source = { title: 'National Anti-Ragging Helpline', publisher: 'University Grants Commission', url: 'https://www.antiragging.in/' };
const UGC: Source = { title: 'UGC regulations on sexual harassment and ragging in higher education', publisher: 'University Grants Commission', url: 'https://www.ugc.gov.in/' };

export const PERSONAL_SAFETY_POSTS: BlogPost[] = [
  /* ---------------------------------------------------------------- helplines */
  {
    slug: 'emergency-helpline-numbers-india',
    title: 'Emergency helpline numbers in India everyone should know',
    seoTitle: 'Emergency Helpline Numbers in India: 112, 181, 1930',
    description:
      'The national numbers for police, ambulance, women, children, cybercrime, mental health and travel, with what each is for and what to say when you call.',
    seoDescription: 'India’s key emergency numbers in one place: 112, women helplines 181 and 1091, cybercrime 1930, Childline 1098, ambulance 108, and what to say.',
    category: 'emergency-help',
    tags: ['Helplines', "Women's safety", 'Emergency'],
    keywords: ['emergency helpline numbers India', 'emergency number India', 'women helpline number', 'women safety helpline India', '112 India', 'cyber crime helpline number'],
    authorId: 'editorial',
    status: 'published',
    publishedAt: '2026-11-25',
    updatedAt: '2026-11-25',
    related: ['what-to-do-during-an-emergency', 'sos-and-trusted-contacts', 'personal-safety-plan', 'what-to-do-if-someone-is-following-you'],
    sources: [ERSS, WHL, NCW, NCRP, INDIA_HELPLINES, TELE_MANAS, ANTI_RAGGING],
    accent: 'red',
    art: '112',
    body: [
      {
        type: 'p',
        text: 'In an emergency, you should not have to search for a number. If you remember only one, remember **112**. It is India’s single emergency number for police, fire and ambulance, and it works across the country. The other numbers below are for specific kinds of help.',
      },
      { type: 'h2', text: 'The one number to remember: 112' },
      {
        type: 'p',
        text: '112 connects you to the Emergency Response Support System, which can send police, fire or medical help. You can call it from any phone. The free 112 India app also lets you raise an alert. Older numbers such as 100 (police), 101 (fire) and 108 (ambulance) still work in most places.',
      },
      { type: 'h2', text: 'National helpline numbers' },
      {
        type: 'table',
        head: ['Number', 'What it is for'],
        rows: [
          ['112', 'Any emergency: police, fire, ambulance'],
          ['100', 'Police (in many states this now connects to 112)'],
          ['101', 'Fire'],
          ['108', 'Ambulance and medical emergencies (most states)'],
          ['102', 'Ambulance, especially for pregnant women and infants (many states)'],
          ['181', 'Women Helpline: women facing violence or in distress, linked to One Stop Centres, police and legal help'],
          ['1091', 'Women’s helpline run by the police in many states'],
          ['1098', 'Childline: children in need of care or protection'],
          ['1930', 'Cybercrime helpline: online fraud, scams and cybercrime'],
          ['14416', 'Tele MANAS: free mental health support, 24 hours'],
          ['14567', 'Elderline: help for senior citizens, 8 am to 8 pm'],
          ['139', 'Rail Madad: safety and help on trains and at stations'],
          ['1800-180-5522', 'National Anti-Ragging Helpline for students'],
        ],
        caption: 'Some numbers are run by states and may differ locally. If one does not connect, call 112.',
      },
      {
        type: 'p',
        text: 'The National Commission for Women also runs a helpline and accepts complaints online; check the current details on the [NCW website](https://www.ncw.gov.in). For cybercrime you can also report online at [cybercrime.gov.in](https://cybercrime.gov.in); see [how to report cyber harassment](/blog/how-to-report-cyber-harassment).',
      },
      { type: 'h2', text: 'What to say when you call' },
      {
        type: 'p',
        text: 'Call-takers are trained to ask questions, so you do not need a script. It helps to be ready with:',
      },
      {
        type: 'ol',
        items: [
          '**Where you are.** The most important detail. Give a landmark, road name, building, or the nearest shop if you do not know the address.',
          '**What is happening,** in one sentence: “A man is following me”, “There has been an accident”, “Someone has collapsed”.',
          '**Whether anyone is hurt** or in immediate danger.',
          '**Your name and number,** so they can call back if the line drops.',
        ],
      },
      {
        type: 'p',
        text: 'Stay on the line unless it is unsafe to talk, and follow their instructions. If you cannot speak freely, say as much as you can and leave the line open.',
      },
      { type: 'h2', text: 'Save them before you need them' },
      {
        type: 'ul',
        items: [
          'Save 112, 181 and 1930 in your phone contacts now.',
          'Set up your phone’s built-in emergency SOS and medical ID.',
          'Add two or three trusted people as emergency contacts in a safety app, so one tap can alert them with your location. See [how to set up SOS and trusted contacts](/blog/sos-and-trusted-contacts).',
          'Write a few numbers on paper and keep them in your wallet, in case your phone is lost or dead.',
        ],
      },
      {
        type: 'p',
        text: 'For more, see how to make a [personal safety plan](/blog/personal-safety-plan).',
      },
    ],
    faqs: [
      {
        question: 'What is the emergency number in India?',
        answer:
          '112 is India’s single emergency number for police, fire and ambulance. It works across the country from any phone. 100, 101 and 108 also still work in most places.',
      },
      {
        question: 'What is the women helpline number in India?',
        answer:
          '181 is the national Women Helpline for women facing violence or in distress, and 1091 is a women’s helpline run by the police in many states. In an emergency, call 112.',
      },
      {
        question: 'What is the cybercrime helpline number in India?',
        answer:
          '1930 is the national cybercrime helpline. Call it as soon as possible if you have lost money to online fraud. You can also report at [cybercrime.gov.in](https://cybercrime.gov.in).',
      },
    ],
  },

  /* ---------------------------------------------------------------- being followed */
  {
    slug: 'what-to-do-if-someone-is-following-you',
    title: 'What to do if someone is following you',
    seoTitle: 'What to Do If Someone Is Following You: Safety Steps',
    description:
      'Calm, practical steps if you think someone is following you on foot, in a vehicle or towards your home: how to check, where to go and who to call.',
    category: 'womens-safety',
    tags: ['Being followed', 'Street safety', 'Night safety'],
    keywords: ['what to do if someone is following you', 'someone following me home', 'being followed', 'personal safety tips', 'women safety tips'],
    authorId: 'editorial',
    status: 'published',
    publishedAt: '2026-11-25',
    updatedAt: '2026-11-25',
    related: ['womens-safety-india-guide', 'harassed-in-public-what-to-do', 'what-to-do-if-you-feel-unsafe', 'night-travel-safety-women'],
    sources: [ERSS, WHL],
    accent: 'ink',
    art: 'Trust it',
    body: [
      {
        type: 'p',
        text: 'If you have a feeling someone is following you, trust it. You lose nothing by acting on it, even if you turn out to be wrong. The goal is simple: get to people, light and help, and let someone know where you are.',
      },
      {
        type: 'callout',
        tone: 'warn',
        title: 'If you feel in danger, call 112 now',
        text: 'You do not need to be certain. Tell the call-taker where you are and that someone is following you. Keep moving towards people while you talk.',
      },
      { type: 'h2', text: 'Check without confronting' },
      {
        type: 'p',
        text: 'If you are unsure, you can test it safely. Cross the road, or change direction, and see whether the person does the same. Stop at a shop window and use the reflection. Do not turn into a quiet lane or stop somewhere isolated to check.',
      },
      { type: 'h2', text: 'If you are on foot' },
      {
        type: 'ol',
        items: [
          '**Head for people.** A busy shop, pharmacy, petrol pump, hotel lobby, hospital, metro station or police booth. Go inside.',
          '**Tell someone there.** “I think that man is following me. Can I wait here?” Staff are usually glad to help.',
          '**Call someone you trust** and stay on the call. Describe where you are and what the person looks like out loud; it also signals that someone knows.',
          '**Do not go home** if they are still behind you. You do not want them to learn where you live.',
          '**Call 112** if they do not leave, or wait inside until help or a trusted person arrives.',
        ],
      },
      { type: 'h2', text: 'If a vehicle is following you' },
      {
        type: 'ul',
        items: [
          'If you are walking, turn and walk in the opposite direction; a vehicle cannot easily follow.',
          'If you are driving, do not drive home. Drive to a police station or a busy, well-lit place, and keep your doors locked.',
          'Note the vehicle’s number, colour and model if you can do so safely.',
          'If you are in a cab and feel unsafe, use the app’s emergency button and share your trip; see [night travel safety](/blog/night-travel-safety-women).',
        ],
      },
      { type: 'h2', text: 'If you think someone is following you home' },
      {
        type: 'p',
        text: 'Walk past your building and go to a busy place nearby instead. Call a neighbour, family member or friend to meet you. Once you are inside, tell your building security or neighbours, and consider reporting it to the police, especially if it happens more than once.',
      },
      { type: 'h2', text: 'Let people know where you are' },
      {
        type: 'p',
        text: 'Share your [live location](/blog/live-location-safety) with one or two trusted people until you are safe. Many phones and safety apps can send your location with one tap. On Sabhijude, SOS alerts your emergency contacts with your location.',
      },
      { type: 'h2', text: 'If it keeps happening' },
      {
        type: 'p',
        text: 'Repeatedly following someone despite their clear disinterest can be stalking, which is an offence. Write down dates, times, places and descriptions, keep any photos you took safely, and report it to the police. If the same person is also contacting you online, see [what to do about cyberstalking](/blog/cyberstalking-india).',
      },
    ],
    faqs: [
      {
        question: 'What should I do if someone is following me at night?',
        answer:
          'Go towards people and light, such as a shop, pharmacy, petrol pump or station, and go inside. Call someone you trust and stay on the line. Do not go home while they are behind you. If you feel in danger, call 112.',
      },
      {
        question: 'Should I confront someone who is following me?',
        answer:
          'It is usually safer not to. Move towards other people and tell someone there, call a trusted person, and call 112 if you feel in danger.',
      },
    ],
  },

  /* ---------------------------------------------------------------- safety plan */
  {
    slug: 'personal-safety-plan',
    title: 'How to create a personal safety plan (with a checklist)',
    seoTitle: 'How to Create a Personal Safety Plan: Step-by-Step Checklist',
    description:
      'A safety plan is a few decisions made calmly in advance: who to call, where to go, what to carry. Here is how to make one in 20 minutes.',
    category: 'personal-safety',
    tags: ['Safety plan', 'Emergency contacts', 'Checklist'],
    keywords: ['personal safety plan', 'how to create a safety plan', 'safety plan checklist', 'emergency contacts', 'personal safety tips'],
    authorId: 'editorial',
    status: 'published',
    publishedAt: '2026-11-25',
    updatedAt: '2026-11-25',
    related: ['personal-safety-tips', 'sos-and-trusted-contacts', 'emergency-contact-checklist', 'family-emergency-plan'],
    sources: [ERSS, WHL, TELE_MANAS],
    accent: 'blue',
    art: '20 min',
    body: [
      {
        type: 'p',
        text: 'In a frightening moment, it is hard to think clearly. A personal safety plan means you have already decided the important things: who you will call, where you will go and what you need. It takes about 20 minutes, and you hope you never use it.',
      },
      { type: 'h2', text: '1. Choose your trusted contacts' },
      {
        type: 'p',
        text: 'Pick two or three people who usually answer their phone, live or work reasonably near you, and would act calmly. Ask them first. Tell them what you would want them to do if you called or sent an alert: call you back, come to you, or call the police.',
      },
      {
        type: 'ul',
        items: [
          'Save them as favourites or emergency contacts on your phone.',
          'Add them as emergency contacts in a safety app, so one tap can send them your location.',
          'Agree a code word that means “I am not safe, call me and get me out of here”.',
          'Agree what each of them should do when an alert arrives. See [SOS and trusted contacts](/blog/sos-and-trusted-contacts).',
        ],
      },
      { type: 'h2', text: '2. Save the numbers that matter' },
      {
        type: 'p',
        text: 'Save **112** (any emergency), **181** (Women Helpline), **1930** (cybercrime) and your local police station. Write them on paper too. Our list of [emergency helpline numbers](/blog/emergency-helpline-numbers-india) explains what each one is for.',
      },
      { type: 'h2', text: '3. Know your safe places' },
      {
        type: 'p',
        text: 'For the routes you take most (home, college, work, the bus stop), think about where you could go if you felt unsafe: a 24-hour pharmacy, a petrol pump, a hotel, a hospital, a police booth, a friend’s home. Places that are open late and have staff are best.',
      },
      { type: 'h2', text: '4. Set up your phone' },
      {
        type: 'ul',
        items: [
          'Turn on your phone’s emergency SOS feature and fill in your medical ID.',
          'Keep your phone charged and carry a small power bank.',
          'Learn how to share your [live location](/blog/live-location-safety) quickly with trusted contacts.',
          'Put a lock screen on, but make sure emergency calls work from it.',
        ],
      },
      { type: 'h2', text: '5. Carry a small kit' },
      {
        type: 'ul',
        items: [
          'Some cash, in case UPI or your phone fails.',
          'A card with emergency numbers and one contact, in case your phone is lost.',
          'Any medicines you need.',
          'A copy of your ID.',
        ],
      },
      { type: 'h2', text: '6. Plan for specific situations' },
      {
        type: 'table',
        head: ['Situation', 'Decide in advance'],
        rows: [
          ['Travelling late', 'Who you will share your trip with, and how you will get home. See [night travel safety](/blog/night-travel-safety-women).'],
          ['Being followed', 'Your nearest safe places. See [what to do if someone is following you](/blog/what-to-do-if-someone-is-following-you).'],
          ['Online threats or stalking', 'How you will save evidence and who you will tell. See [online threats](/blog/what-to-do-if-someone-threatens-you-online).'],
          ['A medical emergency', 'Your nearest hospital and how to reach it.'],
        ],
      },
      { type: 'h2', text: '7. Review it' },
      {
        type: 'p',
        text: 'Check your plan every few months, and whenever you move, change jobs or start college. Make sure your trusted contacts still have the right number for you.',
      },
      {
        type: 'callout',
        tone: 'info',
        title: 'If someone close to you is the danger',
        text: 'If the person you are afraid of is a partner or family member, a safety plan matters even more. The Women Helpline 181 can help you plan and connect you to a One Stop Centre for shelter, legal and medical support.',
      },
    ],
    faqs: [
      {
        question: 'What should a personal safety plan include?',
        answer:
          'Your trusted contacts and a code word, saved emergency numbers, safe places along your usual routes, a phone set up for SOS and location sharing, a small kit with cash and emergency numbers on paper, and plans for specific situations like travelling late.',
      },
      {
        question: 'How many emergency contacts should I have?',
        answer:
          'Two or three is usually right: enough that someone will answer, few enough that they each know what to do. Choose people who answer their phone and live or work near you.',
      },
    ],
  },

  /* ---------------------------------------------------------------- live location */
  {
    slug: 'live-location-safety',
    title: 'Live location sharing: when to use it, and how to keep it private',
    seoTitle: 'Live Location Sharing: When to Share and When to Stop',
    description:
      'How live location sharing works, the moments it helps most, who to share with, how long for, and how to make sure nobody is tracking you without your knowledge.',
    category: 'live-location',
    tags: ['Live location', 'Privacy', 'Travel'],
    keywords: ['live location sharing', 'share live location', 'is sharing live location safe', 'location sharing safety', 'emergency location sharing'],
    authorId: 'editorial',
    status: 'published',
    publishedAt: '2026-11-25',
    updatedAt: '2026-11-25',
    related: ['location-privacy-checklist', 'sos-and-trusted-contacts', 'social-media-privacy-settings', 'night-travel-safety-women'],
    sources: [
      { title: 'Google Maps Help: location sharing', publisher: 'Google', url: 'https://support.google.com/maps/' },
      { title: 'Find My (Apple Support)', publisher: 'Apple', url: 'https://support.apple.com/find-my' },
    ],
    accent: 'blue',
    art: 'On my way',
    body: [
      {
        type: 'p',
        text: 'Live location sharing lets chosen people see where you are on a map, updating as you move, for a limited time. Used well, it means someone knows you are on your way and can act quickly if something goes wrong. Used carelessly, it can expose where you are to people who should not know.',
      },
      { type: 'h2', text: 'Live location vs a one-time location' },
      {
        type: 'table',
        head: ['', 'One-time location', 'Live location'],
        rows: [
          ['What it shares', 'A single point, at the moment you send it', 'Your position, updating as you move'],
          ['Best for', 'Telling someone where to meet you, or where you are right now', 'Journeys, late returns, uncertain situations'],
          ['Privacy', 'Out of date as soon as you move', 'Ends when you stop it or the timer runs out'],
        ],
      },
      { type: 'h2', text: 'When sharing your live location helps' },
      {
        type: 'ul',
        items: [
          'Taking a cab or auto, especially at night or in an unfamiliar city.',
          'Walking home late, or along a route you do not know.',
          'Travelling alone between cities.',
          'Meeting someone for the first time, such as from a dating app. See [online dating safety](/blog/online-dating-safety).',
          'Going on a trek, hike or anywhere with patchy network.',
          'Any time you feel uneasy and want someone to keep an eye on you.',
        ],
      },
      { type: 'h2', text: 'Who to share with' },
      {
        type: 'p',
        text: 'Share with one or two people you trust completely and who will actually look. Tell them you are sharing, where you are going and when you expect to arrive, and what they should do if you go quiet. Never share your live location in public posts, large groups or with people you have just met.',
      },
      { type: 'h2', text: 'How long to share' },
      {
        type: 'p',
        text: 'Share for the journey, not forever. Choose a time slightly longer than the trip you are taking, and stop sharing when you arrive. Permanent location sharing, even with family, is worth reviewing; it is easy to forget it is on, and relationships change.',
      },
      { type: 'h2', text: 'Check nobody is tracking you' },
      {
        type: 'ol',
        items: [
          'In your phone’s settings, review which apps have location access, and set most to “only while using” or “never”.',
          'In Google Maps, WhatsApp, Instagram, Snapchat and other apps, check whether location sharing is on and with whom.',
          'On iPhone, check Find My; on Android, check Google’s location sharing settings.',
          'Check your Google or Apple account for devices you do not recognise.',
          'If you ended a relationship, change passwords and turn off any sharing you set up together.',
        ],
      },
      {
        type: 'p',
        text: 'If someone seems to know where you are without you sharing it, read [what to do about cyberstalking](/blog/cyberstalking-india).',
      },
      { type: 'h2', text: 'How it works on Sabhijude' },
      {
        type: 'p',
        text: 'On Sabhijude you choose how long to share: 1, 4, 8 or 24 hours, or until you stop it. You pick up to five people, and each gets their own private link by SMS, which opens in a browser, so they do not need the app. You can see who has opened their link, and you can stop sharing at any moment. Separately, the SOS button sends your location to your emergency contacts when you need help.',
      },
      { type: 'p', text: 'For emergencies, pair location sharing with [SOS and trusted contacts](/blog/sos-and-trusted-contacts) and a [personal safety plan](/blog/personal-safety-plan).' },
    ],
    faqs: [
      {
        question: 'Is it safe to share my live location?',
        answer:
          'It is safe when you share with one or two people you trust, for a limited time, for a specific journey. Avoid sharing it publicly, in large groups or indefinitely, and regularly check which apps and people can see your location.',
      },
      {
        question: 'How long should I share my live location for?',
        answer:
          'For the length of the journey plus a little extra. Stop sharing when you arrive. Most apps let you set a timer so sharing ends automatically.',
      },
    ],
  },

  /* ---------------------------------------------------------------- college harassment */
  {
    slug: 'harassment-in-college',
    title: 'Harassed in college? How to report it, including ragging',
    seoTitle: 'Harassment or Ragging in College? How to Report It',
    description:
      'Your rights as a student in India, the committees every college must have, how to report sexual harassment and ragging, and what to do if your college does not act.',
    seoDescription: 'How students in India can report sexual harassment to the college ICC and ragging to the anti-ragging helpline 1800-180-5522, and what if no action.',
    category: 'college-safety',
    tags: ['College', 'Ragging', 'Sexual harassment', 'Students'],
    keywords: ['harassment in college', 'how to report harassment in college', 'ragging', 'how to report ragging', 'student safety India', 'college harassment'],
    authorId: 'editorial',
    status: 'published',
    publishedAt: '2026-11-25',
    updatedAt: '2026-11-25',
    related: ['ragging-guide', 'college-freshers-safety-checklist', 'cyberbullying-india', 'how-to-support-someone-being-harassed'],
    sources: [UGC, ANTI_RAGGING, NCW, ERSS],
    accent: 'coral',
    art: 'Speak up',
    body: [
      {
        type: 'p',
        text: 'Every student has the right to study without being harassed, humiliated or threatened. If it is happening to you, from seniors, classmates, staff or anyone else on campus, there are committees whose job is to act, and national helplines if they do not.',
      },
      { type: 'h2', text: 'Know the two main routes' },
      {
        type: 'table',
        head: ['What is happening', 'Who handles it'],
        rows: [
          ['Sexual harassment: unwelcome comments, messages, touching, demands, sharing images', 'The **Internal Complaints Committee (ICC)** of your college'],
          ['Ragging: bullying, humiliation, forced acts or abuse, usually of juniors by seniors', 'The college **Anti-Ragging Committee** and **Anti-Ragging Squad**, and the national helpline'],
          ['Violence, threats or immediate danger', 'The police: call **112**'],
        ],
      },
      {
        type: 'p',
        text: 'Under University Grants Commission regulations, higher education institutions in India must have an Internal Complaints Committee for sexual harassment, and must take measures against ragging. Colleges are expected to display the committee members’ contact details on notice boards and their website.',
      },
      { type: 'h2', text: 'Reporting sexual harassment' },
      {
        type: 'ol',
        items: [
          'Write down what happened, when and where, and who was there. Do it soon, while details are fresh.',
          'Save messages, emails, call logs and posts. See [how to preserve evidence](/blog/how-to-preserve-digital-evidence).',
          'Find your ICC’s contact details on the college notice board or website, or ask the women’s cell.',
          'Submit a written complaint to the ICC. You can ask for help writing it. Keep a copy and note the date.',
          'The ICC should keep your identity confidential and protect you from retaliation during the process.',
        ],
      },
      { type: 'h2', text: 'Reporting ragging' },
      {
        type: 'ul',
        items: [
          'Call the **National Anti-Ragging Helpline on 1800-180-5522** (toll-free, 24 hours) or email helpline@antiragging.in. You can also register a complaint at [antiragging.in](https://www.antiragging.in). See our full [guide to ragging](/blog/ragging-guide).',
          'Tell your college’s Anti-Ragging Committee, warden or principal.',
          'If you are hurt or in danger, call **112**.',
        ],
      },
      {
        type: 'p',
        text: 'Complaints to the national helpline are passed to the college and monitored. You can ask for your identity to be protected.',
      },
      { type: 'h2', text: 'If it is happening online' },
      {
        type: 'p',
        text: 'Harassment in class WhatsApp groups, on Instagram or through fake accounts still counts. Save the evidence and report it to your college as above. Threats, sexual images, impersonation and stalking can also be reported to the police at [cybercrime.gov.in](https://cybercrime.gov.in). See [cyberbullying](/blog/cyberbullying-india) and [how to report cyber harassment](/blog/how-to-report-cyber-harassment).',
      },
      { type: 'h2', text: 'If your college does not act' },
      {
        type: 'ul',
        items: [
          'Write to the head of the institution and keep a copy.',
          'For ragging, escalate through the national anti-ragging helpline.',
          'Women can approach the [National Commission for Women](https://www.ncw.gov.in) or their State Commission for Women.',
          'For a criminal offence, you can always go to the police directly, whatever the college decides.',
        ],
      },
      { type: 'h2', text: 'Supporting a friend' },
      {
        type: 'p',
        text: 'Believe them, do not push them to act before they are ready, and offer to go with them to the committee or warden. Do not share their story without permission. A friend who listens is often what makes reporting possible. See [how to support someone who is being harassed](/blog/how-to-support-someone-being-harassed).',
      },
      {
        type: 'callout',
        tone: 'info',
        title: 'For colleges',
        text: 'Sabhijude works with colleges and organisations so students can report unsafe incidents to their campus team, and so campus teams can send safety alerts to their students. Institutions can request onboarding on the Sabhijude website.',
      },
    ],
    faqs: [
      {
        question: 'How do I report ragging in college?',
        answer:
          'Call the National Anti-Ragging Helpline on 1800-180-5522, email helpline@antiragging.in or register at antiragging.in. Also tell your college’s Anti-Ragging Committee or warden. If you are in danger, call 112.',
      },
      {
        question: 'Where do I report sexual harassment in college?',
        answer:
          'To your college’s Internal Complaints Committee (ICC), which UGC regulations require higher education institutions to have. Its members’ contact details should be on the notice board and website. You can also go to the police.',
      },
    ],
  },

  /* ---------------------------------------------------------------- night travel */
  {
    slug: 'night-travel-safety-women',
    title: 'Safety tips for women travelling alone at night',
    seoTitle: '12 Practical Safety Tips for Women Travelling Alone at Night',
    description:
      'Practical, non-alarmist tips for cabs, autos, trains, buses and walking at night: planning, sharing your trip, what to do if something feels wrong.',
    category: 'womens-safety',
    tags: ['Night safety', 'Cabs', 'Public transport', 'Solo travel'],
    keywords: ['safety tips for women travelling alone at night', 'women safety tips', 'cab safety tips', 'night travel safety', 'solo travel safety women India'],
    authorId: 'editorial',
    status: 'published',
    publishedAt: '2026-11-25',
    updatedAt: '2026-11-25',
    related: ['public-transport-safety', 'cab-safety-tips', 'solo-travel-safety-india', 'harassed-in-public-what-to-do'],
    sources: [ERSS, WHL, { title: 'Rail Madad (139)', publisher: 'Ministry of Railways', url: 'https://railmadad.indianrailways.gov.in/' }],
    accent: 'ink',
    art: 'Night',
    body: [
      {
        type: 'p',
        text: 'Nobody should have to plan around being unsafe, but a few habits make late journeys noticeably safer and calmer. None of these are about blaming anyone. They are about making it easier to get help quickly if you ever need it.',
      },
      { type: 'h2', text: 'Before you leave' },
      {
        type: 'ol',
        items: [
          '**Charge your phone** and carry a small power bank. A dead phone is the most common reason people cannot call for help.',
          '**Tell someone your plan:** where you are going, how, and when you expect to arrive.',
          '**Know your route** and how you will get from the drop point to your door.',
          '**Keep some cash** in case your phone or UPI stops working.',
        ],
      },
      { type: 'h2', text: 'In a cab or auto' },
      {
        type: 'ol',
        items: [
          '**Check before you get in:** match the number plate, car model and driver’s photo with the app. If anything does not match, do not get in. More in our [cab safety tips](/blog/cab-safety-tips).',
          '**Share your trip** using the app’s share option, or share your [live location](/blog/live-location-safety) with a trusted person.',
          '**Sit in the back,** and check that the doors open from inside.',
          '**Follow the route** on your own map. If the driver goes off route without a reason, ask why, firmly.',
          '**Use the app’s emergency button** if you feel unsafe. It typically alerts the company and can connect to emergency services.',
        ],
      },
      { type: 'h2', text: 'On trains, metros and buses' },
      {
        type: 'ul',
        items: [
          'Choose busier compartments, or women’s coaches where available, and sit near other women or families.',
          'On trains, **139** (Rail Madad) is the helpline for safety and help during your journey.',
          'Wait for buses and trains in well-lit areas with other people, close to staff or security.',
          'If someone bothers you, move, tell the staff, and say loudly what is happening. Other passengers often step in. See [what to do if you are harassed in public](/blog/harassed-in-public-what-to-do).',
        ],
      },
      { type: 'h2', text: 'Walking' },
      {
        type: 'ul',
        items: [
          'Stick to lit, busier roads even if they take longer.',
          'Keep one ear free and your eyes up, rather than both earphones in.',
          'Have your keys ready before you reach your door.',
          'If you think someone is following you, go towards people, not home. See [what to do if someone is following you](/blog/what-to-do-if-someone-is-following-you).',
        ],
      },
      { type: 'h2', text: 'If something feels wrong' },
      {
        type: 'p',
        text: 'Trust the feeling. You can always end a ride early at a busy place, call a friend and talk loudly, or walk into a shop. Call **112** in an emergency or **181**, the Women Helpline, for help and advice. Keep a list of [emergency helpline numbers](/blog/emergency-helpline-numbers-india) saved on your phone.',
      },
      {
        type: 'callout',
        tone: 'success',
        title: 'A 30-second habit',
        text: 'Before any late journey: phone charged, trip shared with one person, cab details checked. That is most of what matters.',
      },
    ],
    faqs: [
      {
        question: 'What should I do if I feel unsafe in a cab?',
        answer:
          'Use the app’s emergency button, share your trip or live location with someone you trust, and ask the driver to stop at a busy, well-lit place. Call 112 if you feel in danger.',
      },
      {
        question: 'Which helpline should women call while travelling in India?',
        answer:
          'Call 112 in any emergency. 181 is the Women Helpline. On trains, 139 is the Rail Madad helpline for safety and assistance.',
      },
    ],
  },
];
