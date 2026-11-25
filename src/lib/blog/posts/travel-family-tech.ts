import type { BlogPost, Source } from '../types';

/**
 * Batch 3: travel, lost phones, online dating, deepfakes, children online, college freshers.
 * Lost phone: blocking via CEIR on Sanchar Saathi needs a police complaint copy, ID and the IMEI.
 * Tourist helpline 1363 / 1800-11-1363 (Ministry of Tourism). Deepfake guidance avoids exact
 * platform deadlines (MeitY advisories and IT Rules amendments change). Checked 2026-11-25.
 */

const ERSS: Source = { title: 'Emergency Response Support System (112)', publisher: 'Ministry of Home Affairs', url: 'https://112.gov.in/' };
const NCRP: Source = {
  title: 'National Cyber Crime Reporting Portal (cybercrime.gov.in)',
  publisher: 'Indian Cyber Crime Coordination Centre, Ministry of Home Affairs',
  url: 'https://cybercrime.gov.in/',
};
const SANCHAR: Source = { title: 'Sanchar Saathi: block a lost or stolen phone (CEIR)', publisher: 'Department of Telecommunications', url: 'https://www.sancharsaathi.gov.in/' };
const GAC: Source = { title: 'Grievance Appellate Committee', publisher: 'Ministry of Electronics and Information Technology', url: 'https://gac.gov.in/' };
const ANTI_RAGGING: Source = { title: 'National Anti-Ragging Helpline', publisher: 'University Grants Commission', url: 'https://www.antiragging.in/' };

export const TRAVEL_FAMILY_TECH_POSTS: BlogPost[] = [
  /* ---------------------------------------------------------------- solo travel */
  {
    slug: 'solo-travel-safety-india',
    title: 'Solo travel safety in India: a practical guide',
    seoTitle: 'Solo Travel Safety Tips for India: A Practical Guide',
    description:
      'Planning, where to stay, getting around, keeping your documents and phone safe, and what to do if something goes wrong when you travel alone in India.',
    category: 'travel-safety',
    tags: ['Solo travel', 'Hotels', 'Documents', 'Travel planning'],
    keywords: ['solo travel safety tips', 'women solo travel India', 'travel safety plan', 'hotel safety tips', 'how to share travel plans with family'],
    authorId: 'editorial',
    status: 'published',
    publishedAt: '2026-11-25',
    updatedAt: '2026-11-25',
    related: ['travel-emergency-checklist', 'hotel-safety-tips', 'unsafe-while-travelling', 'lost-or-stolen-phone-india'],
    sources: [
      ERSS,
      { title: 'Incredible India tourist helpline (1363)', publisher: 'Ministry of Tourism', url: 'https://www.incredibleindia.gov.in/' },
      { title: 'DigiLocker: official digital copies of your documents', publisher: 'Ministry of Electronics and Information Technology', url: 'https://www.digilocker.gov.in/' },
      { title: 'Rail Madad (139)', publisher: 'Ministry of Railways', url: 'https://railmadad.indianrailways.gov.in/' },
    ],
    accent: 'blue',
    art: 'Solo',
    body: [
      {
        type: 'p',
        text: 'Travelling alone can be one of the best ways to see a place. Most of what keeps solo travellers safe is preparation that takes an evening before you leave, plus a few habits on the road.',
      },
      { type: 'h2', text: 'Before you go' },
      {
        type: 'ol',
        items: [
          '**Share your itinerary** with one or two people: where you are staying each night, how you are travelling and when you expect to check in.',
          '**Agree check-in times,** such as a message every evening, and what they should do if you miss one.',
          '**Save documents digitally.** Keep official copies of your ID and driving licence in [DigiLocker](https://www.digilocker.gov.in), and photos of your tickets and bookings.',
          '**Research arrival.** Plan how you will get from the station or airport to your stay, especially if you arrive late. Prepaid or app-based cabs are easier to trace.',
          '**Save local numbers:** 112, your hotel’s number and the tourist helpline **1363** (toll-free 1800-11-1363), which helps travellers with information and in distress.',
        ],
      },
      { type: 'h2', text: 'Where you stay' },
      {
        type: 'ul',
        items: [
          'Choose places with recent reviews from solo travellers, a staffed reception and a location on a busy street.',
          'Check the door locks properly, and use the chain or latch.',
          'Do not announce your room number aloud at reception; ask them to write it down.',
          'Do not open the door to unexpected visitors; call reception to check.',
          'Note the emergency exits on your floor.',
        ],
      },
      { type: 'h2', text: 'Getting around' },
      {
        type: 'ul',
        items: [
          'In cabs, match the number plate and driver with the app, share your trip and sit in the back. See [night travel safety](/blog/night-travel-safety-women).',
          'On trains, keep valuables close, and call **139** (Rail Madad) for help during the journey.',
          'Share your [live location](/blog/live-location-safety) with someone for long or late journeys.',
          'Avoid arriving in a new place after dark if you can.',
        ],
      },
      { type: 'h2', text: 'Money, phone and documents' },
      {
        type: 'ul',
        items: [
          'Split your money and cards between your bag and your body.',
          'Carry a power bank and a cheap backup charger.',
          'Keep a paper card with one emergency contact, your hotel address and key numbers, in case your phone is lost.',
          'If your phone is lost or stolen, see [what to do if your phone is lost or stolen](/blog/lost-or-stolen-phone-india).',
          'Avoid public Wi-Fi for banking; use mobile data.',
        ],
      },
      { type: 'h2', text: 'Meeting people' },
      {
        type: 'p',
        text: 'Meeting other travellers is part of the fun. Keep the early meetings in public places, do not share exactly where you are staying until you trust someone, watch your drink, and keep your own way back. If you are meeting someone from an app, see [online dating safety](/blog/online-dating-safety).',
      },
      { type: 'h2', text: 'If something goes wrong' },
      {
        type: 'ul',
        items: [
          'Call **112** for any emergency.',
          'Ask your hotel or hostel staff for help; they know the local police and hospitals.',
          'Report theft at the nearest police station and ask for a copy of the complaint; you will need it to block a phone or replace documents.',
          'If you feel unsafe, move to a busy, staffed place and call someone you trust. See [what to do if someone is following you](/blog/what-to-do-if-someone-is-following-you).',
        ],
      },
    ],
    faqs: [
      {
        question: 'What is the tourist helpline number in India?',
        answer:
          'The Ministry of Tourism’s tourist helpline is 1363, or toll-free 1800-11-1363. It provides travel information and helps travellers in distress. For emergencies, call 112.',
      },
      {
        question: 'How should I share my travel plans with family?',
        answer:
          'Send one or two people your itinerary with where you stay each night and how you travel, agree a daily check-in time and what they should do if you miss it, and share your live location on long or late journeys.',
      },
    ],
  },

  /* ---------------------------------------------------------------- lost phone */
  {
    slug: 'lost-or-stolen-phone-india',
    title: 'What to do if your phone is lost or stolen in India',
    seoTitle: 'Phone Lost or Stolen in India? Block It and Protect UPI',
    description:
      'The steps to take in the first hour: locate or wipe the phone, block your SIM and UPI, block the handset through Sanchar Saathi, and protect your accounts.',
    category: 'cyber-safety',
    tags: ['Lost phone', 'Stolen phone', 'CEIR', 'UPI'],
    keywords: ['what to do if your phone is stolen', 'lost phone India', 'block lost mobile', 'Sanchar Saathi CEIR', 'how to find a lost smartphone', 'protect phone if lost'],
    authorId: 'editorial',
    status: 'published',
    publishedAt: '2026-11-25',
    updatedAt: '2026-11-25',
    related: ['smartphone-security-checklist', 'account-hacked-what-to-do', 'common-online-scams-india', 'solo-travel-safety-india'],
    sources: [
      { title: 'Over 6 lakh lost and stolen handsets recovered through Sanchar Saathi', publisher: 'Department of Telecommunications', url: 'https://www.sancharsaathi.gov.in/SancharSaathiDocuments/ImportantDocuments/Over%206%20Lakh%20Lost%20and%20Stolen%20Mobile%20Handsets%20recovered%20on%20DoT%E2%80%99s%20Sanchar%20Saathi%20Initiative.pdf' },
      SANCHAR,
      { title: 'Find, lock or erase a lost Android device', publisher: 'Google', url: 'https://www.google.com/android/find' },
      { title: 'Find My (iCloud)', publisher: 'Apple', url: 'https://www.icloud.com/find' },
      NCRP,
    ],
    accent: 'ink',
    art: 'IMEI',
    body: [
      {
        type: 'p',
        text: 'Your phone holds your bank apps, UPI, email, photos and the OTPs that unlock everything else. If it is lost or stolen, act quickly and in this order.',
      },
      { type: 'h2', text: '1. Try to locate it, then lock it' },
      {
        type: 'p',
        text: 'From another device, sign in to [Google Find My Device](https://www.google.com/android/find) (Android) or [Find My](https://www.icloud.com/find) (iPhone). You can see its last location, play a sound, lock it and show a message with a contact number. If you think it was stolen, do not go to the location yourself; tell the police.',
      },
      {
        type: 'p',
        text: 'If you are sure you will not get it back, erase it remotely. You will no longer be able to locate it afterwards, so do this after you have noted its last location.',
      },
      { type: 'h2', text: '2. Block your SIM' },
      {
        type: 'p',
        text: 'Call your mobile operator’s customer care from another phone, or visit a store, and ask them to block the SIM. This stops anyone receiving your OTPs. Ask for a replacement SIM with the same number; you will need your ID.',
      },
      { type: 'h2', text: '3. Protect your money' },
      {
        type: 'ul',
        items: [
          'Call your bank to block mobile banking, UPI and cards linked to the phone.',
          'If money has already been taken, call **1930** immediately and report at [cybercrime.gov.in](https://cybercrime.gov.in).',
        ],
      },
      { type: 'h2', text: '4. Report it to the police' },
      {
        type: 'p',
        text: 'File a complaint at the nearest police station, or online where your state police allow it, and keep a copy with the complaint number. You need it to block the handset, and it protects you if the phone is misused.',
      },
      { type: 'h2', text: '5. Block the handset on Sanchar Saathi' },
      {
        type: 'p',
        text: 'The Department of Telecommunications’ [Sanchar Saathi](https://www.sancharsaathi.gov.in) portal lets you block a lost or stolen phone by its IMEI number, so it cannot be used on any Indian network. If someone puts a SIM into it later, the system can alert you and the police. You will need:',
      },
      {
        type: 'ul',
        items: [
          'The phone’s IMEI number, printed on the box and the purchase invoice.',
          'A copy of your police complaint and its number.',
          'An ID proof.',
          'A working mobile number to receive the OTP (such as your replacement SIM).',
        ],
      },
      {
        type: 'p',
        text: 'Keep the request ID you receive. If you find the phone, you can unblock it through the same portal.',
      },
      { type: 'h2', text: '6. Secure your accounts' },
      {
        type: 'ol',
        items: [
          'Change your email password first, then social media, from another device.',
          'Sign the lost phone out of your Google or Apple account, WhatsApp and other apps.',
          'Re-register WhatsApp on your replacement SIM, which logs out the lost phone.',
          'Warn your contacts that messages from your old phone may not be from you.',
        ],
      },
      {
        type: 'p',
        text: 'See [what to do if your account gets hacked](/blog/account-hacked-what-to-do) if anything looks wrong.',
      },
      { type: 'h2', text: 'Set this up today' },
      {
        type: 'ul',
        items: [
          'Note your IMEI (dial *#06#) and keep it somewhere other than the phone.',
          'Turn on Find My Device or Find My, and a strong screen lock.',
          'Add a separate PIN to your UPI and banking apps, and a SIM PIN.',
          'Turn on backups for your photos and contacts.',
        ],
      },
      { type: 'callout', tone: 'success', title: 'Real example: it works', text: 'In September 2025 the Department of Telecommunications reported that more than 6 lakh lost and stolen phones had been recovered through blocking and tracing on Sanchar Saathi. Blocking quickly gives you the best chance.' },
      { type: 'p', text: 'Travelling? See [solo travel safety](/blog/solo-travel-safety-india). Worried about follow-up fraud calls? See [common online scams in India](/blog/common-online-scams-india).' },
    ],
    faqs: [
      {
        question: 'How do I block my lost phone in India?',
        answer:
          'Block your SIM through your operator, file a police complaint, then use the Sanchar Saathi portal to block the handset by its IMEI number. You will need the IMEI, a copy of the police complaint, an ID proof and a mobile number for the OTP.',
      },
      {
        question: 'How do I find my IMEI number?',
        answer: 'Dial *#06# on the phone, or check the box, the purchase invoice or your Google or Apple account’s device list.',
      },
    ],
  },

  /* ---------------------------------------------------------------- dating */
  {
    slug: 'online-dating-safety',
    title: 'Online dating safety: meeting someone from the internet',
    seoTitle: 'Online Dating Safety Tips: Red Flags and First Meetings',
    description:
      'How to check someone is who they say they are, red flags of romance scams, how to plan a safe first meeting, and what to do if things turn threatening.',
    category: 'womens-safety',
    tags: ['Online dating', 'Romance scams', 'First meetings'],
    keywords: ['online dating safety tips', 'how to stay safe when meeting someone from the internet', 'romance scam', 'red flags online relationships', 'how to safely meet someone you met online'],
    authorId: 'editorial',
    status: 'published',
    publishedAt: '2026-11-25',
    updatedAt: '2026-11-25',
    related: ['someone-threatening-to-leak-photos', 'live-location-safety', 'common-online-scams-india', 'cyberstalking-india'],
    sources: [NCRP, ERSS],
    accent: 'coral',
    art: 'Meet safe',
    body: [
      {
        type: 'p',
        text: 'Most people you meet online are exactly who they say they are. A few simple checks protect you from the ones who are not, without spoiling the fun.',
      },
      { type: 'h2', text: 'Before you meet' },
      {
        type: 'ul',
        items: [
          '**Video call first.** A short video call is the easiest way to confirm someone is real. Repeated excuses not to are a red flag.',
          '**Check their photos.** A reverse image search shows whether the pictures belong to someone else.',
          '**Keep it on the app** until you are comfortable, rather than moving straight to WhatsApp with your number.',
          '**Share little at first:** not your home address, workplace details, daily routine or financial information.',
        ],
      },
      { type: 'h2', text: 'Red flags' },
      {
        type: 'ul',
        items: [
          'Intense affection very quickly, or talk of a future together within days.',
          'They cannot meet or video call, always with a dramatic reason.',
          'Any request for money, gift cards, crypto, or help with an “investment” or “customs fee”.',
          'Pressure to send intimate photos, or to move to a private app.',
          'Anger or guilt-tripping when you say no.',
        ],
      },
      {
        type: 'callout',
        tone: 'warn',
        title: 'Romance scams',
        text: 'Romance scammers spend weeks building trust before asking for money for an emergency, a ticket or an investment. However real it feels, never send money to someone you have not met. If you already have, call 1930 and report at cybercrime.gov.in. See [common online scams in India](/blog/common-online-scams-india).',
      },
      { type: 'h2', text: 'The first meeting' },
      {
        type: 'ol',
        items: [
          'Meet in a busy public place, during the day if possible.',
          'Get there and back on your own; do not accept a pickup from home.',
          'Tell a friend who you are meeting, where and when, and share your [live location](/blog/live-location-safety) for the evening.',
          'Agree a check-in message, and a code word that means “call me with an excuse”.',
          'Keep your drink with you, and leave whenever you want to.',
        ],
      },
      { type: 'h2', text: 'Intimate photos' },
      {
        type: 'p',
        text: 'It is your choice what you share, and it is never your fault if someone misuses it. Know that anything sent can be saved. If someone threatens to share images of you, read [what to do if someone threatens to leak your photos](/blog/someone-threatening-to-leak-photos).',
      },
      { type: 'h2', text: 'If it turns threatening' },
      {
        type: 'p',
        text: 'Stop replying, save the evidence, block and report the account on the app, and tell someone you trust. Threats, blackmail and stalking can be reported at [cybercrime.gov.in](https://cybercrime.gov.in) or a police station. In danger, call **112**. See [what to do if someone is cyberstalking you](/blog/cyberstalking-india).',
      },
    ],
    faqs: [
      {
        question: 'How do I stay safe when meeting someone from the internet?',
        answer:
          'Video call first, meet in a busy public place, travel there and back on your own, tell a friend the plan and share your live location, and leave whenever you want. Never send money to someone you have not met.',
      },
      {
        question: 'What is a romance scam?',
        answer:
          'A romance scam is when someone builds a fake relationship online, often over weeks, and then asks for money for an emergency, travel or an investment. They usually avoid video calls and meeting in person.',
      },
    ],
  },

  /* ---------------------------------------------------------------- deepfakes */
  {
    slug: 'deepfakes-what-to-do',
    title: 'Deepfakes and voice cloning: how to spot them and what to do',
    seoTitle: 'Deepfake of You? How to Spot It and Get It Removed',
    description:
      'What deepfakes and cloned voices are, how they are used to harass and scam people, how to check suspicious videos and calls, and how to get fake content of you taken down.',
    seoDescription: 'What deepfakes and voice clones are, how they are used to harass and scam people, how to check suspicious media, and how to get fake content removed.',
    category: 'technology-ai-safety',
    tags: ['Deepfakes', 'Voice cloning', 'AI scams', 'Morphed images'],
    keywords: ['what are deepfakes', 'what to do if someone creates a deepfake of you', 'how to identify a deepfake', 'voice cloning scam', 'AI scams', 'morphed photos'],
    authorId: 'editorial',
    status: 'published',
    publishedAt: '2026-11-25',
    updatedAt: '2026-11-25',
    related: ['verify-images-and-videos', 'voice-cloning-scams', 'ai-scams', 'someone-threatening-to-leak-photos'],
    sources: [NCRP, GAC, { title: 'StopNCII.org (18+)', publisher: 'Revenge Porn Helpline / SWGfL', url: 'https://stopncii.org/' }, { title: 'Centre issues advisory to social media platforms on deepfakes (Nov 2023)', publisher: 'Business Standard', url: 'https://business-standard.com/india-news/centre-issues-advisory-for-social-media-platforms-regarding-deepfakes-123110701225_1.html' }],
    accent: 'ink',
    art: 'AI?',
    body: [
      {
        type: 'p',
        text: 'A **deepfake** is a video, image or audio clip made or altered with AI so that it shows someone saying or doing something they never did. **Voice cloning** uses a few seconds of someone’s voice to make new speech in that voice. The tools are now easy to use, which means anyone can be targeted.',
      },
      { type: 'h2', text: 'How they are misused' },
      {
        type: 'ul',
        items: [
          '**Fake intimate images or videos** made from ordinary photos, used to humiliate or blackmail.',
          '**Impersonation:** fake videos of someone endorsing a product, or saying something offensive.',
          '**Voice-cloning scams:** a call that sounds like a relative in trouble, urgently asking for money.',
          '**Fake officials** on video calls, as in “digital arrest” scams.',
        ],
      },
      { type: 'h2', text: 'If someone makes a deepfake of you' },
      {
        type: 'ol',
        items: [
          '**It is not your fault,** and it is not real. Say so to the people who matter to you.',
          '**Save evidence:** links, account names, screenshots and dates. See [preserving digital evidence](/blog/how-to-preserve-digital-evidence).',
          '**Report it to every platform** where it appears, choosing impersonation, non-consensual intimate imagery or manipulated media. Platforms in India must act on complaints about impersonation and morphed or intimate images of a person; if they do not, escalate to their Grievance Officer and then the [Grievance Appellate Committee](https://gac.gov.in).',
          '**Report it to the police** at [cybercrime.gov.in](https://cybercrime.gov.in) or a police station, especially if it is sexual, used for blackmail or used to defraud people.',
          '**If it is sexual and you are 18 or over,** [StopNCII.org](https://stopncii.org) can help stop copies being uploaded to partner platforms, if you have a copy of the image. Read [what to do if someone threatens to leak your photos](/blog/someone-threatening-to-leak-photos).',
        ],
      },
      { type: 'h2', text: 'How to check a suspicious video or image' },
      {
        type: 'ul',
        items: [
          '**Check the source.** Who posted it first? Is it on the person’s official account or a reputable news site?',
          '**Look closely:** mismatched lip movement, odd blinking, blurred edges around the face or hair, strange hands, lighting that does not match.',
          '**Listen:** flat emotion, odd pauses or unnatural breathing in audio.',
          '**Search for it:** a reverse image search, or a search for the claim, often shows the original or a fact-check.',
          '**Be wary of urgency:** content designed to make you angry or scared fast is the content most worth checking.',
        ],
      },
      {
        type: 'p',
        text: 'Detection is getting harder as tools improve, so checking the source matters more than spotting flaws.',
      },
      { type: 'h2', text: 'Protect your family from voice-cloning scams' },
      {
        type: 'ul',
        items: [
          'Agree a **family code word** that a genuine caller in trouble can say.',
          'If a call asks for money urgently, **hang up and call the person back** on the number you already have.',
          'Ask a question only the real person would know.',
          'Tell older relatives that voices can now be faked, and that they should always check before paying.',
        ],
      },
      {
        type: 'p',
        text: 'See [common online scams in India](/blog/common-online-scams-india) for more.',
      },
      { type: 'callout', tone: 'info', title: 'Real example: why platforms were told to act', text: 'In November 2023, after a deepfake video of a well-known actor spread widely, the Ministry of Electronics and IT issued an advisory reminding social media platforms of their legal duty to remove such content quickly once it is reported. The same reporting routes are open to anyone targeted.' },
    ],
    faqs: [
      {
        question: 'What should I do if someone makes a deepfake of me?',
        answer:
          'Save the links and screenshots, report the content to each platform as impersonation or non-consensual imagery, escalate to the platform’s Grievance Officer if needed, and report it at cybercrime.gov.in or a police station. For sexual content of adults, StopNCII.org can help stop re-uploads.',
      },
      {
        question: 'How can I tell if a video is a deepfake?',
        answer:
          'Check who posted it first and whether reputable sources carry it, then look for mismatched lip movement, odd blinking, blurred edges or unnatural audio. A reverse image search often finds the original. Checking the source is more reliable than spotting flaws.',
      },
    ],
  },

  /* ---------------------------------------------------------------- children online */
  {
    slug: 'children-online-safety-parents',
    title: 'Keeping children safe online: a guide for parents',
    seoTitle: 'Online Safety for Children: A Guide for Parents',
    description:
      'How to talk to children about online safety, recognise signs of grooming and cyberbullying, set sensible controls without spying, and get help if something goes wrong.',
    seoDescription: 'How to talk to children about online safety, spot grooming and cyberbullying, set sensible controls, and get help in India if something goes wrong.',
    category: 'family-safety',
    tags: ['Parents', 'Children', 'Online grooming', 'Cyberbullying'],
    keywords: ['how to talk to children about online safety', 'how to protect children online', 'how to recognise online grooming', 'internet safety for students', 'parents cyberbullying'],
    authorId: 'editorial',
    status: 'published',
    publishedAt: '2026-11-25',
    updatedAt: '2026-11-25',
    related: ['help-family-member-harassment', 'family-location-sharing', 'cyberbullying-india', 'social-media-privacy-settings'],
    sources: [NCRP, { title: 'Take It Down: for images taken under 18', publisher: 'National Center for Missing & Exploited Children', url: 'https://takeitdown.ncmec.org/' }],
    accent: 'blue',
    art: 'Talk',
    body: [
      {
        type: 'p',
        text: 'The most effective online safety tool for a child is not an app. It is knowing they can tell you anything that happens online, without being punished for it. Controls help, but trust is what gets you told when something goes wrong.',
      },
      { type: 'h2', text: 'Start the conversation early' },
      {
        type: 'ul',
        items: [
          'Ask what they enjoy online, which games and apps, and who they talk to. Be curious, not suspicious.',
          'Agree simple rules together: no sharing your address, school or phone number; no meeting online friends without a parent; tell an adult if anything feels wrong.',
          'Promise that if they tell you about a problem, you will help, not take their phone away. Then keep that promise.',
          'Keep talking as they grow; the conversation for a 9-year-old is different from a 15-year-old’s.',
        ],
      },
      { type: 'h2', text: 'Signs of online grooming' },
      {
        type: 'p',
        text: 'Grooming is when someone builds a relationship with a child online to exploit them. Watch for a new online “friend” who:',
      },
      {
        type: 'ul',
        items: [
          'Gives lots of attention, compliments or gifts, such as game credits or recharges.',
          'Asks the child to keep their friendship secret, or to move to a private app.',
          'Asks for photos, or tries to turn conversations sexual.',
          'Tries to come between the child and their family: “Your parents would not understand.”',
          'Wants to meet in person.',
        ],
      },
      {
        type: 'p',
        text: 'In your child, look for secrecy about devices, new gifts or money you cannot explain, being upset after being online, or using devices late at night.',
      },
      { type: 'h2', text: 'Sensible controls' },
      {
        type: 'ul',
        items: [
          'Use the parental controls built into phones, app stores, YouTube and games, suited to your child’s age.',
          'Keep devices out of bedrooms at night for younger children.',
          'Set social media accounts to private, and go through the [privacy settings](/blog/social-media-privacy-settings) together.',
          'Explain the controls you use. Secret monitoring can damage trust, especially for teenagers.',
        ],
      },
      { type: 'h2', text: 'If something goes wrong' },
      {
        type: 'ol',
        items: [
          'Stay calm, thank them for telling you, and make it clear they are not in trouble.',
          'Save evidence, but **do not forward or save sexual images of a child**, even as proof. Note the account and links instead.',
          'Block and report the account on the platform.',
          'Report it to the police at [cybercrime.gov.in](https://cybercrime.gov.in), which has a dedicated section for crimes against children, or at a police station. Call **1098** (Childline) for help.',
          'If intimate images of your child are being shared, [Take It Down](https://takeitdown.ncmec.org) can help stop them spreading on participating platforms.',
          'Tell the school if other students are involved, and consider counselling support.',
        ],
      },
      {
        type: 'p',
        text: 'For bullying by classmates, see [cyberbullying: what to do](/blog/cyberbullying-india).',
      },
      { type: 'p', text: 'Older children should also go through [WhatsApp safety settings](/blog/whatsapp-safety-settings) with you.' },
    ],
    faqs: [
      {
        question: 'How do I talk to my child about online safety?',
        answer:
          'Start with curiosity about what they enjoy online, agree a few simple rules together, and promise that if they tell you about a problem you will help rather than punish them. Keep the conversation going as they grow.',
      },
      {
        question: 'What are the signs of online grooming?',
        answer:
          'An online “friend” who gives lots of attention or gifts, asks for secrecy, asks for photos, tries to separate the child from their family or wants to meet. In the child, watch for secrecy, unexplained gifts, distress after being online or late-night device use.',
      },
    ],
  },

  /* ---------------------------------------------------------------- freshers */
  {
    slug: 'college-freshers-safety-checklist',
    title: 'Safety checklist for college freshers',
    seoTitle: 'College Freshers Safety Checklist: Campus and Hostel',
    description:
      'Twenty things to sort out in your first weeks at college: contacts, campus help, hostel safety, travel, ragging, online safety and money.',
    category: 'student-safety',
    tags: ['College freshers', 'Hostel safety', 'Checklist', 'Ragging'],
    keywords: ['safety checklist for college freshers', 'college safety tips', 'hostel safety tips for students', 'campus safety', 'student safety India'],
    authorId: 'editorial',
    status: 'published',
    publishedAt: '2026-11-25',
    updatedAt: '2026-11-25',
    related: ['student-safety-india-guide', 'hostel-safety-tips', 'ragging-guide', 'party-safety-tips'],
    sources: [ANTI_RAGGING, ERSS],
    accent: 'coral',
    art: 'Day 1',
    body: [
      {
        type: 'p',
        text: 'Starting college means a new city, new people and a lot of freedom at once. A little setup in the first couple of weeks means you know where to go and who to call if you ever need to.',
      },
      { type: 'h2', text: 'People and numbers' },
      {
        type: 'ul',
        items: [
          'Add two or three [trusted contacts](/blog/sos-and-trusted-contacts): a family member, a friend nearby and a roommate.',
          'Save 112, the campus security number, your warden, and the National Anti-Ragging Helpline **1800-180-5522**.',
          'Find out who is on the college’s Internal Complaints Committee and Anti-Ragging Committee. Their details should be on the notice board or website.',
          'Know where the campus health centre and nearest hospital are.',
        ],
      },
      { type: 'h2', text: 'Hostel and PG' },
      {
        type: 'ul',
        items: [
          'Lock your room and cupboard, and do not lend your keys or ID card.',
          'Know the hostel timings and who to call if you are late.',
          'Do not share your room number or hostel details on public social media.',
          'If you are in a PG, check that the owner has done police verification of staff, and that the building has working locks and lighting.',
        ],
      },
      { type: 'h2', text: 'Ragging and harassment' },
      {
        type: 'ul',
        items: [
          'Ragging is banned. You never have to go along with “traditions” that humiliate or hurt you.',
          'If it happens, call **1800-180-5522**, report at [antiragging.in](https://www.antiragging.in), or tell the Anti-Ragging Committee.',
          'For sexual harassment, go to the Internal Complaints Committee. See [harassed in college: how to report it](/blog/harassment-in-college).',
        ],
      },
      { type: 'h2', text: 'Getting around' },
      {
        type: 'ul',
        items: [
          'Learn the safe, well-lit routes between hostel, campus and the nearest station.',
          'Share your trip or [live location](/blog/live-location-safety) on late journeys.',
          'Read [night travel safety tips](/blog/night-travel-safety-women) before your first late trip.',
        ],
      },
      { type: 'h2', text: 'Online' },
      {
        type: 'ul',
        items: [
          'Go through your [social media privacy settings](/blog/social-media-privacy-settings) before you add a hundred new classmates.',
          'Be careful in big class groups: screenshots last forever.',
          'Never share OTPs, and be wary of “part-time job” offers that ask you to pay first. See [common online scams](/blog/common-online-scams-india).',
        ],
      },
      { type: 'h2', text: 'Parties and nights out' },
      {
        type: 'ul',
        items: [
          'Go with friends and leave with friends.',
          'Keep your drink with you, and do not accept drinks you did not see being poured.',
          'Plan your way home before you go.',
          'Look out for each other. If someone seems unwell or unsafe, get help. See [party safety tips](/blog/party-safety-tips).',
        ],
      },
      { type: 'h2', text: 'Your wellbeing' },
      {
        type: 'p',
        text: 'Homesickness, stress and loneliness are common in the first months. Most colleges have a counsellor; using them is normal. The free national mental health helpline, Tele MANAS, is on **14416**.',
      },
      {
        type: 'callout',
        tone: 'info',
        title: 'If your college uses Sabhijude',
        text: 'Students can report unsafe incidents to their campus team and receive safety alerts from the college. Ask your student affairs office, or point them to the organisation request page on the Sabhijude website.',
      },
    ],
    faqs: [
      {
        question: 'What should every college fresher do for safety?',
        answer:
          'Save trusted contacts and key numbers including campus security and the anti-ragging helpline 1800-180-5522, find out who is on the complaints and anti-ragging committees, learn safe routes, tighten social media privacy, and plan how you will get home from nights out.',
      },
    ],
  },
];
