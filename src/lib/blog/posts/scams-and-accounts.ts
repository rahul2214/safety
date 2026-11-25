import type { BlogPost, Source } from '../types';

/**
 * Online scams and hacked accounts (P1). Fraud reporting: 1930 / cybercrime.gov.in; suspected
 * fraud calls and messages without loss: Chakshu on Sanchar Saathi. "Digital arrest" guidance
 * follows the I4C public advisory (Oct 2024). Checked 2026-11-25.
 */

const NCRP: Source = {
  title: 'National Cyber Crime Reporting Portal (cybercrime.gov.in)',
  publisher: 'Indian Cyber Crime Coordination Centre, Ministry of Home Affairs',
  url: 'https://cybercrime.gov.in/',
};
const SANCHAR: Source = {
  title: 'Sanchar Saathi: Chakshu (report suspected fraud calls and messages) and CEIR (block a lost or stolen phone)',
  publisher: 'Department of Telecommunications',
  url: 'https://www.sancharsaathi.gov.in/',
};

export const SCAM_AND_ACCOUNT_POSTS: BlogPost[] = [
  /* ---------------------------------------------------------------- scams */
  {
    slug: 'common-online-scams-india',
    title: 'Common online scams in India, and how to spot them',
    seoTitle: 'Common Online Scams in India and How to Avoid Them',
    description:
      'Fake KYC messages, UPI collect requests, “digital arrest” calls, task-based job offers and more: how each scam works, the warning signs, and what to do if you have already paid.',
    seoDescription: 'How common online scams in India work, from digital arrest and fake KYC to UPI and job scams, the warning signs, and what to do if you lose money.',
    category: 'cyber-safety',
    tags: ['Scams', 'UPI', 'Fraud', 'Digital arrest'],
    keywords: ['online scams India', 'common online scams', 'how to recognise online scams', 'digital arrest scam', 'UPI fraud', 'what to do if scammed online'],
    authorId: 'editorial',
    status: 'published',
    publishedAt: '2026-11-25',
    updatedAt: '2026-11-25',
    related: ['social-engineering', 'phishing-explained', 'identity-theft-india', 'cyber-safety-guide'],
    sources: [NCRP, SANCHAR, { title: 'I4C advisory: agencies do not arrest people over video calls (news report)', publisher: 'ThePrint', url: 'https://theprint.in/india/cbi-ed-police-dont-arrest-people-through-video-calls-indian-cyber-crime-coordination-centre/2299608' }],
    accent: 'red',
    art: '1930',
    body: [
      {
        type: 'p',
        text: 'Online scams in India change their stories constantly, but almost all of them rely on the same few tricks: **urgency**, **fear or greed**, and getting you to **share a code, install an app or send money**. Once you can see the pattern, the stories stop working.',
      },
      {
        type: 'callout',
        tone: 'warn',
        title: 'Already lost money? Call 1930 now',
        text: 'Speed matters. Calling 1930, the national cybercrime helpline, as soon as possible gives the best chance of the money being frozen before it moves. Then file at cybercrime.gov.in and inform your bank.',
      },
      { type: 'h2', text: 'The golden rules' },
      {
        type: 'ul',
        items: [
          '**Never share an OTP, UPI PIN, CVV or password** with anyone, including someone claiming to be from your bank, the police or a company.',
          '**You never need to enter your UPI PIN to receive money.** A PIN request means money is leaving your account.',
          '**Do not install apps** (especially screen-sharing or “remote support” apps) because a caller asks you to.',
          '**Hang up and call back** on a number you find yourself, from the official website, your card or your passbook, never one from a message or a search ad.',
          '**Real officials do not threaten you on video calls** or ask you to transfer money to “verify” anything.',
        ],
      },
      { type: 'h2', text: 'Scams to know' },
      { type: 'h3', text: '“Digital arrest”' },
      {
        type: 'p',
        text: 'A caller claims to be from the police, CBI, customs, a court or another agency. They say a parcel in your name contains drugs, or your number is linked to a crime, and that you are under “digital arrest”. They keep you on a video call, sometimes for hours, in front of a fake police set, and demand money to “clear your name”. The Indian Cyber Crime Coordination Centre has publicly warned that **no agency arrests people over video calls**. Hang up, do not pay, and report it.',
      },
      { type: 'h3', text: 'Fake KYC, bill and account-blocked messages' },
      {
        type: 'p',
        text: 'An SMS or WhatsApp says your bank account, SIM or electricity connection will be blocked tonight unless you update KYC or pay through a link or a number. The link leads to a fake site or asks you to install an app. Banks and providers do not work this way. Check with them directly.',
      },
      { type: 'h3', text: 'UPI collect requests and “wrong transfer” refunds' },
      {
        type: 'p',
        text: 'A buyer on a marketplace, or someone claiming they sent you money by mistake, sends a “collect request” or a QR code and asks you to approve it to receive money. Approving with your PIN sends money **from** you. Scanning a QR code is for paying, not receiving.',
      },
      { type: 'h3', text: 'Part-time job and “task” scams' },
      {
        type: 'p',
        text: 'You are offered easy money for liking videos, writing reviews or rating hotels. The first few tasks pay small amounts to win trust. Then you are asked to “invest” or pay a deposit to unlock bigger tasks, and the money disappears. Genuine jobs do not ask you to pay to earn.',
      },
      { type: 'h3', text: 'Fake customer care numbers' },
      {
        type: 'p',
        text: 'You search for a company’s helpline and call a number in a search ad or a random page. The “agent” asks for card details or an app install to process a refund. Use only numbers on the company’s official website or app.',
      },
      { type: 'h3', text: 'Investment and trading groups' },
      {
        type: 'p',
        text: 'A WhatsApp or Telegram group shows screenshots of huge profits and invites you to trade through their app. The app shows rising gains, but you can never withdraw. Invest only through regulated, registered platforms.',
      },
      { type: 'h3', text: 'Sextortion video calls' },
      {
        type: 'p',
        text: 'A stranger video-calls you, records the call with explicit content on screen, and then threatens to send it to your contacts unless you pay. Do not pay. See [what to do if someone threatens to leak your photos](/blog/someone-threatening-to-leak-photos).',
      },
      { type: 'h2', text: 'If you lost money' },
      {
        type: 'ol',
        items: [
          'Call **1930** immediately and give the transaction details.',
          'File a complaint at [cybercrime.gov.in](https://cybercrime.gov.in) and note the acknowledgement number.',
          'Call your bank to block the card or account and dispute the transaction.',
          'Change passwords and PINs, and remove any app the scammer asked you to install.',
          'Save screenshots of chats, call logs, transaction IDs and the scammer’s UPI ID or account number.',
        ],
      },
      { type: 'h2', text: 'If you did not lose money' },
      {
        type: 'p',
        text: 'Report suspected fraud calls, SMS and WhatsApp messages on **Chakshu** at [Sanchar Saathi](https://www.sancharsaathi.gov.in), the Department of Telecommunications portal, so the numbers can be checked and disconnected. Chakshu is for suspected fraud communication; if you have already lost money, use 1930 or cybercrime.gov.in instead.',
      },
      {
        type: 'callout',
        tone: 'info',
        title: 'Talk to older family members',
        text: 'Many scams target parents and grandparents. Share the golden rules with them, and agree that they will call you before paying anyone who contacts them unexpectedly. See [helping older parents stay safe from scams](/blog/protect-older-parents-from-scams).',
      },
      { type: 'callout', tone: 'info', title: 'Real example: the official warning', text: 'In October 2024 the Indian Cyber Crime Coordination Centre issued a public advisory stating that the CBI, ED, police, customs and judges do not arrest people on video calls, after a rise in “digital arrest” cases. If a caller says otherwise, it is a scam.' },
      { type: 'p', text: 'Also read how to [protect older parents from scams](/blog/protect-older-parents-from-scams) and [what to do if your account gets hacked](/blog/account-hacked-what-to-do).' },
    ],
    faqs: [
      {
        question: 'What should I do immediately after an online fraud?',
        answer:
          'Call 1930, the national cybercrime helpline, as soon as possible, then file at [cybercrime.gov.in](https://cybercrime.gov.in) and inform your bank. Acting quickly gives the best chance of the money being frozen.',
      },
      {
        question: 'Can the police arrest me on a video call?',
        answer:
          'No. The Indian Cyber Crime Coordination Centre has warned that agencies such as the police, CBI, ED and customs do not arrest people through video calls. A “digital arrest” is a scam. Hang up and report it.',
      },
      {
        question: 'Do I need to enter my UPI PIN to receive money?',
        answer: 'No. You never enter your UPI PIN to receive money. If you are asked for your PIN, money is leaving your account.',
      },
    ],
  },

  /* ---------------------------------------------------------------- hacked account */
  {
    slug: 'account-hacked-what-to-do',
    title: 'What to do if your account gets hacked',
    seoTitle: 'Account Hacked? How to Recover It and Lock It Down',
    description:
      'Step-by-step recovery for a hacked email, Instagram, Facebook or WhatsApp account, how to lock it down afterwards, and what to tell your contacts.',
    category: 'cyber-safety',
    tags: ['Hacked account', 'Account recovery', 'Two-step verification'],
    keywords: ['account hacked what to do', 'how to recover hacked Instagram account', 'WhatsApp hacked', 'how to know if your account is hacked', 'two-factor authentication'],
    authorId: 'editorial',
    status: 'published',
    publishedAt: '2026-11-25',
    updatedAt: '2026-11-25',
    related: ['common-online-scams-india', 'social-media-privacy-settings', 'how-to-report-fake-profile'],
    sources: [
      NCRP,
      { title: 'Recover a hacked Instagram account', publisher: 'Instagram', url: 'https://www.instagram.com/hacked/' },
      { title: 'Recover a hacked Facebook account', publisher: 'Meta', url: 'https://www.facebook.com/hacked' },
      { title: 'Google account recovery', publisher: 'Google', url: 'https://accounts.google.com/signin/recovery' },
    ],
    accent: 'blue',
    art: 'Lock it',
    body: [
      {
        type: 'p',
        text: 'Signs of a hacked account include password-change emails you did not request, posts or messages you did not send, friends asking about strange messages from you, or simply being locked out. Act quickly: the first hour is when you are most likely to get it back.',
      },
      { type: 'h2', text: 'Start with your email' },
      {
        type: 'p',
        text: 'Your email is the master key: it is where every other password reset goes. If your email is compromised, recover it first, using [Google account recovery](https://accounts.google.com/signin/recovery) or your provider’s equivalent. Then change its password and turn on two-step verification before you move on.',
      },
      { type: 'h2', text: 'Use the official recovery pages' },
      {
        type: 'ul',
        items: [
          '**Instagram:** [instagram.com/hacked](https://www.instagram.com/hacked/). You may be asked to verify with a selfie video.',
          '**Facebook:** [facebook.com/hacked](https://www.facebook.com/hacked).',
          '**WhatsApp:** reinstall WhatsApp and register again with your phone number using the SMS code. This logs the other person out. If they set a two-step PIN, you may have to wait before you can register.',
          '**Other apps:** look for “Forgot password” or “My account was hacked” in the app’s help centre.',
        ],
      },
      {
        type: 'callout',
        tone: 'warn',
        title: 'Beware “account recovery” services',
        text: 'People who message or comment offering to recover your account, for a fee, are almost always scammers. Only use the platform’s own recovery pages.',
      },
      { type: 'h2', text: 'Once you are back in' },
      {
        type: 'ol',
        items: [
          'Change the password to a long, unique one you have not used anywhere else.',
          'Turn on two-step verification, preferably with an authenticator app rather than SMS. See [strong passwords and two-step verification](/blog/strong-passwords-two-step-verification).',
          'Check the email address and phone number on the account; hackers often change them.',
          'Sign out of all other sessions and remove devices you do not recognise.',
          'Remove connected apps you do not recognise.',
          'Check for posts, messages, forwarding rules (in email) or ads you did not create.',
        ],
      },
      { type: 'h2', text: 'Warn your contacts' },
      {
        type: 'p',
        text: 'Hacked accounts are often used to ask friends for money or OTPs. Post or send a short message: “My account was hacked. If you got a message from me asking for money or a code, please ignore it.”',
      },
      { type: 'h2', text: 'When to report to the police' },
      {
        type: 'p',
        text: 'If your account was used to cheat people, to harass or blackmail you, or to share private content, report it at [cybercrime.gov.in](https://cybercrime.gov.in) or call **1930** if money is involved. If you cannot recover the account and it is impersonating you, see [how to report a fake profile](/blog/how-to-report-fake-profile).',
      },
      { type: 'h2', text: 'How it usually happens' },
      {
        type: 'ul',
        items: [
          'Sharing an OTP with someone who asked for it, often a friend’s hacked account.',
          'Logging in through a fake page from a link in a message.',
          'Reusing a password that leaked from another site.',
          'Someone with access to your unlocked phone, or a lost phone. See [what to do if your phone is lost or stolen](/blog/lost-or-stolen-phone-india).',
        ],
      },
      {
        type: 'p',
        text: 'Two-step verification and unique passwords stop most of these. Next, review your [social media privacy settings](/blog/social-media-privacy-settings).',
      },
    ],
    faqs: [
      {
        question: 'How do I know if my account has been hacked?',
        answer:
          'Watch for password or email-change alerts you did not request, logins from unfamiliar places, posts or messages you did not send, friends asking about strange messages, or being unable to log in.',
      },
      {
        question: 'How do I recover a hacked Instagram account?',
        answer:
          'Go to [instagram.com/hacked](https://www.instagram.com/hacked/) and follow the steps. You may need access to the email or phone on the account, or to verify with a selfie video. Avoid anyone offering to recover it for a fee.',
      },
    ],
  },
];
