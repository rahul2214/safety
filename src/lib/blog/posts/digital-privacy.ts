import type { BlogPost } from '../types';

/** Digital privacy (P1): doxxing and social media privacy. Checked 2026-11-25. */

export const DIGITAL_PRIVACY_POSTS: BlogPost[] = [
  /* ---------------------------------------------------------------- doxxing */
  {
    slug: 'doxxing-what-to-do',
    title: 'Doxxing: what to do if someone publishes your personal information',
    seoTitle: 'Doxxing: What to Do If Your Address or Number Is Posted',
    description:
      'If your address, phone number or other personal details have been posted online to target you, here is how to stay safe, get it taken down and report it.',
    category: 'digital-privacy',
    tags: ['Doxxing', 'Personal information', 'Takedown'],
    keywords: ['doxxing', 'what is doxxing', 'my phone number was leaked online', 'address posted online', 'remove personal information from internet'],
    authorId: 'editorial',
    status: 'published',
    publishedAt: '2026-11-25',
    updatedAt: '2026-11-25',
    related: ['social-media-privacy-settings', 'how-to-preserve-digital-evidence', 'what-to-do-if-someone-threatens-you-online', 'cyberstalking-india'],
    sources: [
      { title: 'National Cyber Crime Reporting Portal (cybercrime.gov.in)', publisher: 'Ministry of Home Affairs', url: 'https://cybercrime.gov.in/' },
      { title: 'Remove personal information from Google Search', publisher: 'Google', url: 'https://support.google.com/websearch/answer/12719076' },
    ],
    accent: 'ink',
    art: 'Private',
    body: [
      {
        type: 'p',
        text: '**Doxxing** is when someone collects and publishes a person’s private details, such as their home address, phone number, workplace, college, family members or photos of their house, usually to encourage others to harass or frighten them. It often follows an online argument or a post that went viral.',
      },
      {
        type: 'callout',
        tone: 'warn',
        title: 'Your physical safety comes first',
        text: 'If your home address has been posted alongside threats, or strangers have turned up, call 112. Consider staying with someone you trust for a few days, and tell your building security or neighbours.',
      },
      { type: 'h2', text: '1. Document it' },
      {
        type: 'p',
        text: 'Screenshot every post that shares your information, with the account name, the date and the link. Capture threatening replies too. Do this before reporting, because posts may be deleted. See [how to preserve digital evidence](/blog/how-to-preserve-digital-evidence).',
      },
      { type: 'h2', text: '2. Report it for removal' },
      {
        type: 'ul',
        items: [
          '**Platforms:** most social networks ban posting someone’s private information without consent. Report each post under “private information” or “harassment”.',
          '**Search engines:** Google lets you [request removal](https://support.google.com/websearch/answer/12719076) of search results that show personal contact details, such as your phone number or home address. The page stays on the original site, but it becomes much harder to find.',
          '**Websites:** for other sites, look for a contact or abuse address and ask for the information to be removed.',
        ],
      },
      { type: 'h2', text: '3. Lock down your accounts' },
      {
        type: 'ol',
        items: [
          'Make your social profiles private, temporarily if you prefer.',
          'Hide your friends and followers lists, which can be used to find your family.',
          'Change passwords and turn on two-step verification.',
          'Ask family and close friends to make their profiles private for a while too.',
        ],
      },
      { type: 'h2', text: '4. Deal with a leaked phone number' },
      {
        type: 'ul',
        items: [
          'Do not answer unknown numbers for a few days; let calls go to voicemail.',
          'Use your phone’s settings to silence unknown callers, and block abusive numbers.',
          'Report abusive or fraudulent calls and messages. Suspected fraud can be reported on Chakshu at sancharsaathi.gov.in.',
          'If it continues, consider changing your number and sharing the new one only with people you trust.',
        ],
      },
      { type: 'h2', text: '5. Report it to the police' },
      {
        type: 'p',
        text: 'Publishing someone’s details to get them harassed can amount to criminal intimidation, stalking or other offences, especially when combined with threats. Report it at [cybercrime.gov.in](https://cybercrime.gov.in) or a police station, with your evidence. See [what to do if someone threatens you online](/blog/what-to-do-if-someone-threatens-you-online).',
      },
      { type: 'h2', text: 'Reducing what can be found' },
      {
        type: 'ul',
        items: [
          'Search your name, phone number and email to see what is public.',
          'Remove your phone number and address from public profiles, old listings and resumes posted online.',
          'Avoid posting photos that show your house, street, vehicle number plate or college ID.',
          'Turn off location tags, and post travel photos after you have left a place.',
        ],
      },
      {
        type: 'p',
        text: 'Our checklist of [social media privacy settings](/blog/social-media-privacy-settings) goes through each of these.',
      },
    ],
    faqs: [
      {
        question: 'What is doxxing?',
        answer:
          'Doxxing is publishing someone’s private information, such as their address, phone number, workplace or family details, without consent, usually so that others will harass or intimidate them.',
      },
      {
        question: 'Can I get my address or phone number removed from Google?',
        answer:
          'Google lets you request the removal of search results that show personal contact information such as your phone number or home address. The information may still exist on the original site, so also ask that site or platform to remove it.',
      },
    ],
  },

  /* ---------------------------------------------------------------- privacy settings */
  {
    slug: 'social-media-privacy-settings',
    title: 'Social media privacy settings everyone should check',
    seoTitle: 'Social Media Privacy Settings Checklist (15 Minutes)',
    description:
      'A 15-minute checklist for Instagram, Facebook, WhatsApp, Snapchat and other apps: who can see you, find you, message you and know where you are.',
    category: 'digital-privacy',
    tags: ['Privacy settings', 'Social media', 'Checklist'],
    keywords: ['social media privacy settings', 'how to protect privacy on social media', 'online privacy checklist', 'protect personal information online', 'digital footprint'],
    authorId: 'editorial',
    status: 'published',
    publishedAt: '2026-11-25',
    updatedAt: '2026-11-25',
    related: ['digital-privacy-guide', 'account-hacked-what-to-do', 'doxxing-what-to-do', 'location-privacy-checklist'],
    sources: [
      { title: 'Instagram Help Centre', publisher: 'Instagram', url: 'https://help.instagram.com/' },
      { title: 'WhatsApp Help Center', publisher: 'WhatsApp', url: 'https://faq.whatsapp.com/' },
      { title: 'Google Safety Center', publisher: 'Google', url: 'https://safety.google/' },
    ],
    accent: 'blue',
    art: '15 min',
    body: [
      {
        type: 'p',
        text: 'Most people set up their apps once and never look at the settings again. Apps add features and change defaults all the time. This checklist takes about 15 minutes, and works whichever apps you use; the menu names differ slightly, but the settings exist almost everywhere.',
      },
      { type: 'h2', text: 'Who can see your profile and posts' },
      {
        type: 'ul',
        items: [
          'Set your account to **private**, or limit posts to friends or followers you have approved.',
          'Review your followers and remove people you do not know.',
          'Hide your **friends or followers list**. It is one of the main ways strangers find your family.',
          'Limit who can see older posts, and archive anything you would not want a stranger to see.',
          'Use “close friends” lists for personal stories.',
        ],
      },
      { type: 'h2', text: 'Who can contact you' },
      {
        type: 'ul',
        items: [
          'Limit messages from people you do not follow to a separate requests folder, or turn them off.',
          'Limit who can comment, tag or mention you, and turn on manual approval of tags.',
          'Use comment filters to hide offensive words.',
          'On WhatsApp, limit who can add you to groups, and who can see your profile photo, “about” and last seen.',
        ],
      },
      { type: 'h2', text: 'Who can find you' },
      {
        type: 'ul',
        items: [
          'Turn off “find me by phone number” or “suggest my account to contacts” where it is offered.',
          'Remove your phone number, email, date of birth and address from your public profile.',
          'Think twice before listing your college, workplace or home town publicly.',
        ],
      },
      { type: 'h2', text: 'Who knows where you are' },
      {
        type: 'ul',
        items: [
          'Turn off location tagging on posts, and camera location in your phone’s camera settings.',
          'Check map-sharing features (such as Snapchat’s map, Instagram’s map or Google Maps location sharing) and switch them off or limit them.',
          'Post photos after you have left a place, not while you are there.',
          'Read [when to share your live location](/blog/live-location-safety), and with whom.',
        ],
      },
      { type: 'h2', text: 'Account security' },
      {
        type: 'ul',
        items: [
          'Turn on two-step verification on every account.',
          'Use a different password for each, ideally with a password manager.',
          'Check logged-in devices and connected apps, and remove anything you do not recognise.',
          'Make sure your recovery email and phone number are up to date.',
        ],
      },
      {
        type: 'p',
        text: 'If you ever lose access, see [what to do if your account gets hacked](/blog/account-hacked-what-to-do).',
      },
      { type: 'h2', text: 'Before you post' },
      {
        type: 'ul',
        items: [
          'Check photos for house numbers, street signs, vehicle number plates, ID cards and boarding passes.',
          'Avoid posting your daily routine in real time.',
          'Remember screenshots last forever, even for “disappearing” posts.',
        ],
      },
      {
        type: 'callout',
        tone: 'success',
        title: 'Make it a habit',
        text: 'Repeat this check every few months, and after any app update that adds a new feature. It also helps to do it together with younger family members.',
      },
      { type: 'p', text: 'If your details are already public, see [doxxing](/blog/doxxing-what-to-do). If someone seems to be watching your accounts, see [cyberstalking](/blog/cyberstalking-india).' },
    ],
  },
];
