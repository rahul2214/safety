import type { BlogPost, Source } from '../types';

/**
 * Online harassment cluster (P0): cyberstalking, reporting, evidence, threats, image-based abuse,
 * report vs block. Legal references are kept to well-established provisions and always framed as
 * "may apply"; the police or a lawyer decide what applies to a case. Helplines and portals checked
 * against official sources on 2026-11-25.
 */

const NCRP: Source = {
  title: 'National Cyber Crime Reporting Portal (cybercrime.gov.in)',
  publisher: 'Indian Cyber Crime Coordination Centre, Ministry of Home Affairs',
  url: 'https://cybercrime.gov.in/',
};
const ERSS: Source = {
  title: 'Emergency Response Support System (112)',
  publisher: 'Ministry of Home Affairs',
  url: 'https://112.gov.in/',
};
const NCW: Source = {
  title: 'Helplines and complaints',
  publisher: 'National Commission for Women',
  url: 'https://www.ncw.gov.in/',
};
const STOPNCII: Source = {
  title: 'StopNCII.org: stop intimate images being shared on partner platforms (18+)',
  publisher: 'Revenge Porn Helpline / SWGfL',
  url: 'https://stopncii.org/',
};
const TAKE_IT_DOWN: Source = {
  title: 'Take It Down: for images taken when you were under 18',
  publisher: 'National Center for Missing & Exploited Children',
  url: 'https://takeitdown.ncmec.org/',
};
const GAC: Source = {
  title: 'Grievance Appellate Committee: appeal a platform’s decision',
  publisher: 'Ministry of Electronics and Information Technology',
  url: 'https://gac.gov.in/',
};

export const ONLINE_HARASSMENT_POSTS: BlogPost[] = [
  /* ---------------------------------------------------------------- cyberstalking */
  {
    slug: 'cyberstalking-india',
    title: 'What to do if someone is cyberstalking you',
    seoTitle: 'Cyberstalking in India: What to Do and How to Report It',
    description:
      'Repeated messages, new accounts after you block them, someone who always knows where you are: how to recognise cyberstalking, protect yourself, keep evidence and report it in India.',
    seoDescription: 'Being stalked online? How to secure your accounts, keep evidence, block safely and report cyberstalking in India through 1930, cybercrime.gov.in or police.',
    category: 'online-harassment',
    tags: ['Cyberstalking', 'Reporting', 'Evidence'],
    keywords: ['cyberstalking', 'cyber stalking India', 'what to do if someone is stalking me online', 'report cyberstalking', 'online stalking'],
    authorId: 'editorial',
    status: 'published',
    publishedAt: '2026-11-25',
    updatedAt: '2026-11-25',
    related: ['someone-keeps-messaging-me', 'someone-tracking-me-online', 'how-to-preserve-digital-evidence', 'how-to-report-cyber-harassment'],
    sources: [NCRP, ERSS, NCW],
    accent: 'ink',
    art: 'Stop.',
    body: [
      {
        type: 'p',
        text: 'Cyberstalking is when someone repeatedly uses phones, messages, social media or other technology to follow, contact, watch or frighten a person who has made it clear they do not want that contact. It is not “just online”. It affects sleep, work, studies and the sense of being safe at home, and it sometimes moves offline.',
      },
      {
        type: 'p',
        text: 'If you think it is happening to you, you are not overreacting. Here is what to do, roughly in order.',
      },
      {
        type: 'callout',
        tone: 'warn',
        title: 'If you feel in physical danger',
        text: 'If the person knows where you are, has turned up, or has threatened to hurt you, call **112** now. Tell someone you trust where you are. Online steps can wait until you are safe.',
      },
      { type: 'h2', text: 'Signs that it may be cyberstalking' },
      {
        type: 'ul',
        items: [
          'Repeated messages, calls or comments after you have said no, ignored them or blocked them.',
          'New accounts or numbers appearing to contact you each time you block one.',
          'They know where you have been, who you met or what you posted in private groups.',
          'They contact your friends, family, college or workplace about you.',
          'Accounts you did not create are using your name or photos.',
          'Threats, including threats to share private photos or messages.',
          'Logins to your accounts that you do not recognise, or your phone behaving strangely.',
        ],
      },
      {
        type: 'p',
        text: 'One unwanted message is not stalking. A pattern that continues after you have made your wishes clear usually is.',
      },
      { type: 'h2', text: 'Step 1: Save the evidence before you block' },
      {
        type: 'p',
        text: 'Blocking can hide earlier messages, and the other person may delete theirs. Before you block or report, take screenshots that show the message, the sender’s profile name and username or number, and the date and time. Note the profile link (URL) as well, because names can be changed but links rarely are.',
      },
      {
        type: 'p',
        text: 'Keep everything in one folder and a simple log: date, platform, what happened. Our guide on [how to preserve digital evidence](/blog/how-to-preserve-digital-evidence) explains exactly what to capture so police and platforms can act on it.',
      },
      { type: 'h2', text: 'Step 2: Lock down your accounts' },
      {
        type: 'ol',
        items: [
          'Change the passwords of your email, phone account and social media, starting with your main email. Use a different password for each.',
          'Turn on two-step verification everywhere it is offered.',
          'Check active sessions and logged-in devices on each account and sign out of any you do not recognise.',
          'Review which apps have access to your accounts and remove anything unfamiliar.',
          'Make your profiles private, hide your friends list, and remove your phone number, address, college and workplace from public view. Our [social media privacy checklist](/blog/social-media-privacy-settings) goes through each setting.',
          'Turn off location tags on posts, and check whether any app is sharing your live location with someone you no longer trust.',
        ],
      },
      {
        type: 'callout',
        tone: 'info',
        title: 'If they seem to know everything',
        text: 'If someone knows things they could only learn from your phone, they may have had access to it. Check for unknown apps, check your Google or Apple account for devices you do not own, and consider a factory reset after you have saved your evidence. If it was someone close to you, change your passwords from a device they have never touched.',
      },
      { type: 'h2', text: 'Step 3: Block and report on the platform' },
      {
        type: 'p',
        text: 'Once your evidence is saved, block the person and report the account on every platform they use. Reporting tells the platform about the behaviour; blocking only protects you. Both are worth doing. Read [report vs block](/blog/report-vs-block) if you are unsure which to use when.',
      },
      {
        type: 'p',
        text: 'If they keep creating new accounts, report each one and say in the report that it is the same person evading a block. Most platforms treat block evasion seriously.',
      },
      { type: 'h2', text: 'Step 4: Tell someone you trust' },
      {
        type: 'p',
        text: 'Stalking thrives on isolation. Tell a friend or family member what is happening and share your evidence folder with them (and point them to [how to support someone being harassed](/blog/how-to-support-someone-being-harassed)). If the person is contacting your college or workplace, a quiet word with a teacher, the Internal Committee or HR now means they will not be caught off guard later.',
      },
      { type: 'h2', text: 'Step 5: Report it to the police' },
      {
        type: 'p',
        text: 'Cyberstalking is a crime in India. You can report it in three ways, and you can use more than one:',
      },
      {
        type: 'ul',
        items: [
          '**Online:** file a complaint on the [National Cyber Crime Reporting Portal](https://cybercrime.gov.in). You can upload screenshots and track your complaint.',
          '**By phone:** call **1930**, the national cybercrime helpline, especially if money is involved.',
          '**In person:** go to your nearest police station or cyber cell. A police station should not turn you away because the incident happened online or elsewhere; you can ask for a Zero FIR, which is then transferred to the right station.',
        ],
      },
      {
        type: 'p',
        text: 'Laws that may apply include the Bharatiya Nyaya Sanhita’s provision on stalking (which covers monitoring a woman’s use of the internet, email or other electronic communication), criminal intimidation, and parts of the Information Technology Act on identity theft and privacy. You do not need to know the sections; the police decide which apply. Our step-by-step guide to [reporting cyber harassment in India](/blog/how-to-report-cyber-harassment) walks through the portal.',
      },
      { type: 'h2', text: 'What not to do' },
      {
        type: 'ul',
        items: [
          'Do not reply to threats or argue. Responding often fuels the behaviour.',
          'Do not agree to meet the person “to sort it out”.',
          'Do not pay anyone who demands money to stop, or to delete something.',
          'Do not delete the conversation, even if it is upsetting to keep.',
          'Do not try to hack or expose them back; it can harm your own case.',
        ],
      },
      { type: 'h2', text: 'Looking after yourself' },
      {
        type: 'p',
        text: 'Being watched is exhausting. It is fine to step away from social media for a while, to ask a friend to monitor your inbox for evidence, or to speak to a counsellor. The free national mental health helpline, Tele MANAS, is available on **14416**.',
      },
    ],
    faqs: [
      {
        question: 'Is cyberstalking a crime in India?',
        answer:
          'Yes. The Bharatiya Nyaya Sanhita treats stalking as an offence, and its definition includes monitoring a woman’s use of the internet, email or other electronic communication. Other laws, such as provisions on criminal intimidation and the Information Technology Act, may also apply depending on what happened. The police decide which sections apply to a complaint.',
      },
      {
        question: 'Can I report cyberstalking online?',
        answer:
          'Yes. You can file a complaint on the National Cyber Crime Reporting Portal at [cybercrime.gov.in](https://cybercrime.gov.in), call the 1930 helpline, or visit any police station or cyber cell.',
      },
      {
        question: 'Should I block someone who is stalking me online?',
        answer:
          'Usually yes, but save your evidence first. Take screenshots showing the messages, the profile and the dates, and note the profile link, then block and report the account.',
      },
      {
        question: 'What if the stalker keeps creating new accounts?',
        answer:
          'Report every new account and mention that it is the same person evading a block. Keep adding each one to your evidence log. Repeated contact through new accounts strengthens a police complaint.',
      },
    ],
  },

  /* ---------------------------------------------------------------- report cyber harassment */
  {
    slug: 'how-to-report-cyber-harassment',
    title: 'How to report cyber harassment in India, step by step',
    seoTitle: 'How to Report Cyber Harassment in India, Step by Step',
    description:
      'Where to report online harassment in India, what to prepare, how the National Cyber Crime Reporting Portal works, and what happens after you file.',
    seoDescription: 'Report online harassment in India: the 1930 helpline, cybercrime.gov.in, police stations and platform grievance officers, and what to prepare first.',
    category: 'online-harassment',
    tags: ['Reporting', 'Cybercrime portal', 'Police'],
    keywords: ['how to report cyber harassment', 'report online harassment India', 'cybercrime complaint', 'cybercrime.gov.in', '1930 helpline', 'how to file cyber crime complaint'],
    authorId: 'editorial',
    status: 'published',
    publishedAt: '2026-11-25',
    updatedAt: '2026-11-25',
    related: ['cybercrime-portal-guide', 'how-to-preserve-digital-evidence', 'cyberstalking-india', 'online-harassment-guide'],
    sources: [NCRP, ERSS, NCW, GAC],
    accent: 'blue',
    art: '1930',
    body: [
      {
        type: 'p',
        text: 'If someone is harassing, threatening, impersonating or abusing you online, you can report it to the platform, to the national cybercrime system, and to the police. You can do all three. This guide explains each route, what to prepare and what to expect.',
      },
      {
        type: 'table',
        head: ['Situation', 'Where to start'],
        rows: [
          ['You are in physical danger', 'Call **112**'],
          ['Money has been taken or a fraud is in progress', 'Call **1930** immediately'],
          ['Harassment, stalking, threats, fake profiles', '[cybercrime.gov.in](https://cybercrime.gov.in) or your local police station'],
          ['Sexual images of you shared or threatened', '[cybercrime.gov.in](https://cybercrime.gov.in), the platform, and see [this guide](/blog/someone-threatening-to-leak-photos)'],
          ['Content you want taken down', 'Report to the platform, then its grievance officer'],
        ],
        caption: 'You can use several routes at once. Reporting to a platform does not stop you from going to the police.',
      },
      { type: 'h2', text: 'Before you report: gather your evidence' },
      {
        type: 'p',
        text: 'Ten minutes of preparation makes your complaint far easier to act on. Collect:',
      },
      {
        type: 'ul',
        items: [
          'Screenshots of the messages, posts or comments, showing the date and time.',
          'The profile link (URL), username, phone number or email address of the person.',
          'Links to specific posts or videos.',
          'A short timeline: when it started, what happened, and anything that has happened offline.',
          'Your ID proof, if you are filing in person.',
        ],
      },
      {
        type: 'p',
        text: 'Our guide to [preserving digital evidence](/blog/how-to-preserve-digital-evidence) covers what makes a screenshot useful and how to store it safely.',
      },
      { type: 'h2', text: 'Option 1: The National Cyber Crime Reporting Portal' },
      {
        type: 'p',
        text: 'The [National Cyber Crime Reporting Portal](https://cybercrime.gov.in), run by the Ministry of Home Affairs, accepts complaints about all kinds of cybercrime, with a special focus on crimes against women and children. Complaints are passed to the police in the relevant state.',
      },
      {
        type: 'ol',
        items: [
          'Open cybercrime.gov.in and choose to file a complaint. Read and accept the terms.',
          'Choose the right section. There is a separate section for crimes against women and children, which includes an option to report sexual content anonymously, and a section for other cybercrime.',
          'Register or sign in with your mobile number using a one-time password (OTP).',
          'Fill in the incident details: what happened, when, on which platform, and the suspect’s details if you know them.',
          'Upload your screenshots and any files.',
          'Submit, and save the acknowledgement number. You can use it to track the complaint on the portal.',
        ],
      },
      {
        type: 'callout',
        tone: 'info',
        title: 'Portal screens change',
        text: 'The labels on the portal are updated from time to time. If a step looks different, follow the portal’s own instructions; the information it asks for stays much the same.',
      },
      { type: 'h2', text: 'Option 2: Call 1930' },
      {
        type: 'p',
        text: '**1930** is the national cybercrime helpline. It is the fastest route when money is involved: calling quickly gives the best chance that the money can be frozen before it is moved on. You can also call it for guidance on other cybercrime. If you cannot get through, file on the portal and keep trying.',
      },
      { type: 'h2', text: 'Option 3: Go to a police station or cyber cell' },
      {
        type: 'p',
        text: 'You can file a complaint at any police station, and many cities have a dedicated cyber cell. Take your evidence on your phone and printed copies if you can. If the incident happened outside that station’s area, you can ask for a **Zero FIR**, which is registered and then transferred to the station with jurisdiction.',
      },
      {
        type: 'p',
        text: 'Ask for a copy of your complaint or FIR, and write down the name of the officer you spoke to. Women can also approach the National Commission for Women or their State Commission for Women for support.',
      },
      { type: 'h2', text: 'Option 4: Report to the platform' },
      {
        type: 'p',
        text: 'Every major platform has a report option on posts, messages and profiles. Report each item separately and choose the most specific reason, such as harassment, impersonation or non-consensual intimate images.',
      },
      {
        type: 'p',
        text: 'Under India’s IT Rules, platforms must publish the contact details of a **Grievance Officer** and respond to complaints within fixed timelines; complaints about intimate images of you must be acted on especially quickly. If you are not satisfied with a platform’s decision, you can appeal to the government’s [Grievance Appellate Committee](https://gac.gov.in).',
      },
      { type: 'h2', text: 'What happens after you report' },
      {
        type: 'ul',
        items: [
          'Portal complaints are routed to the police of the relevant state, who may contact you for more details. Keep your phone reachable and your evidence safe.',
          'The police may register an FIR and investigate. This can take time, especially if the account is anonymous or abroad.',
          'Platforms may remove content or suspend accounts, often without telling you the details.',
          'Keep logging anything new and add it to your complaint using your acknowledgement number.',
        ],
      },
      { type: 'h2', text: 'If you are under 18' },
      {
        type: 'p',
        text: 'Tell a parent, teacher or another adult you trust. You can also call **1098** (Childline) for help. Reports involving children are treated with extra seriousness, and you will not be in trouble for asking for help.',
      },
      { type: 'p', text: 'If the harassment comes from a fake account, see [how to report a fake profile](/blog/how-to-report-fake-profile). If it includes threats, read [what to do if someone threatens you online](/blog/what-to-do-if-someone-threatens-you-online).' },
    ],
    faqs: [
      {
        question: 'How do I file a cyber harassment complaint in India?',
        answer:
          'File online at [cybercrime.gov.in](https://cybercrime.gov.in), call the 1930 helpline, or visit any police station or cyber cell. Keep screenshots with dates, profile links and a short timeline ready.',
      },
      {
        question: 'Can I report online harassment anonymously?',
        answer:
          'The National Cyber Crime Reporting Portal has an option to report sexual content involving women and children anonymously. Most other complaints need your mobile number so the police can follow up with you. Your details are not shared with the person you report.',
      },
      {
        question: 'Is 1930 only for financial fraud?',
        answer:
          '1930 is the national cybercrime helpline and is the priority number for financial fraud, because speed matters for freezing money. For other online harassment you can also use the portal or a police station.',
      },
      {
        question: 'Can the police refuse my complaint because it happened online?',
        answer:
          'Online harassment is a matter for the police. If a station says it is outside their area, you can ask for a Zero FIR, which is registered and transferred to the right station. You can also file directly on cybercrime.gov.in.',
      },
    ],
  },

  /* ---------------------------------------------------------------- evidence */
  {
    slug: 'how-to-preserve-digital-evidence',
    title: 'How to preserve evidence of online harassment',
    seoTitle: 'How to Preserve Digital Evidence of Online Harassment',
    description:
      'What to screenshot, what to write down and how to store it, so the police and platforms can act on your report of harassment, threats or abuse.',
    category: 'online-harassment',
    tags: ['Evidence', 'Screenshots', 'Reporting'],
    keywords: ['how to preserve digital evidence', 'evidence of online harassment', 'screenshots for cyber complaint', 'what screenshots to save'],
    authorId: 'editorial',
    status: 'published',
    publishedAt: '2026-11-25',
    updatedAt: '2026-11-25',
    related: ['how-to-report-cyber-harassment', 'cyberstalking-india', 'someone-threatening-to-leak-photos'],
    sources: [NCRP],
    accent: 'coral',
    art: 'Save it',
    body: [
      {
        type: 'p',
        text: 'Evidence is what turns “someone is harassing me” into a complaint that a platform or the police can act on. The good news is that you do not need special tools. You need screenshots taken the right way, the links behind them, and a simple record of what happened.',
      },
      {
        type: 'callout',
        tone: 'warn',
        title: 'Save first, block second',
        text: 'When you block someone, some apps hide the earlier conversation, and the other person can delete their messages. Capture everything before you block, report or leave a group.',
      },
      { type: 'h2', text: 'What a useful screenshot shows' },
      {
        type: 'ul',
        items: [
          '**The content itself:** the full message, post or comment, not cropped.',
          '**Who sent it:** the profile name and, wherever possible, the username, handle or phone number. Names can be changed; usernames and numbers are harder to change.',
          '**When:** the date and time. In chats, scroll so the date header is visible, or long-press the message to show its time.',
          '**Where:** the app or site, which is usually clear from the screen layout.',
        ],
      },
      {
        type: 'p',
        text: 'Take several screenshots rather than one, and include the messages before and after so the context is clear. Do not edit, crop or annotate the originals. If you want to highlight something, make a copy.',
      },
      { type: 'h2', text: 'Copy the links too' },
      {
        type: 'p',
        text: 'A screenshot shows what was said. A link helps a platform or investigator find it. For each profile, post or video, copy the link (usually under Share or Copy link) and paste it into your notes. For a profile, open it and copy the address of the profile page itself.',
      },
      { type: 'h2', text: 'Keep a simple log' },
      {
        type: 'p',
        text: 'A short written timeline is one of the most useful things you can give the police. A notes file or a spreadsheet is enough:',
      },
      {
        type: 'table',
        head: ['Date and time', 'Platform', 'What happened', 'Evidence'],
        rows: [
          ['12 Nov, 10:40 pm', 'Instagram', 'New account messaged again after I blocked the old one', 'Screenshot 14, profile link'],
          ['13 Nov, 8:15 am', 'Phone', 'Three calls from an unknown number', 'Call log screenshot 15'],
        ],
        caption: 'An example log. Keep adding to it; patterns over time matter.',
      },
      { type: 'h2', text: 'Special cases' },
      { type: 'h3', text: 'Voice notes, calls and videos' },
      {
        type: 'p',
        text: 'Save voice notes and videos using the app’s own save or export option. For calls, screenshot the call log showing the number and time. Before recording a call, be aware that the rules on recording vary; ask the police how to handle recordings.',
      },
      { type: 'h3', text: 'Disappearing messages and stories' },
      {
        type: 'p',
        text: 'If something will vanish, capture it immediately. If you cannot screenshot it, photograph the screen with another phone, and write down exactly what it said and when.',
      },
      { type: 'h3', text: 'Emails' },
      {
        type: 'p',
        text: 'Keep the original email; do not just forward it. Most email services let you view the “original” or “full headers”, which show where it came from. Save that too.',
      },
      { type: 'h3', text: 'Intimate images' },
      {
        type: 'p',
        text: 'If the harassment involves sexual images of you, do not forward or re-share the images, even to friends as proof. Record the links, the account and the time, and screenshot the posts in a way that shows the account and caption. When you report, the police and the platform can view the content directly. Read [what to do if someone threatens to leak your photos](/blog/someone-threatening-to-leak-photos).',
      },
      { type: 'h2', text: 'Store it safely' },
      {
        type: 'ol',
        items: [
          'Put everything into one folder with clear file names, such as “2026-11-12 instagram message”.',
          'Back it up somewhere the other person cannot reach, such as a cloud account with a new password and two-step verification.',
          'Share a copy with one person you trust, in case your phone is lost or taken.',
          'Do not keep it only on a shared or family device.',
        ],
      },
      {
        type: 'p',
        text: 'When you are ready, our guide to [reporting cyber harassment](/blog/how-to-report-cyber-harassment) explains where to send it.',
      },
      { type: 'p', text: 'Good evidence matters most in [cyberstalking](/blog/cyberstalking-india) and [online threat](/blog/what-to-do-if-someone-threatens-you-online) cases, where the pattern over time is what convinces the police.' },
    ],
    faqs: [
      {
        question: 'Are screenshots enough evidence for a cybercrime complaint?',
        answer:
          'Screenshots are the starting point and are accepted with complaints on cybercrime.gov.in and at police stations. They are much stronger with the profile links, dates and a written timeline. The police can request original records from platforms during an investigation.',
      },
      {
        question: 'Should I delete the messages after taking screenshots?',
        answer:
          'No. Keep the original conversation on your device as well. It helps if anyone questions whether a screenshot is genuine.',
      },
    ],
  },

  /* ---------------------------------------------------------------- threats */
  {
    slug: 'what-to-do-if-someone-threatens-you-online',
    title: 'What to do if someone threatens you online',
    seoTitle: 'Someone Is Threatening Me Online: What Should I Do?',
    description:
      'How to judge the risk, stay safe, keep evidence and report online threats in India, whether they come by message, comment, email or a fake account.',
    category: 'online-harassment',
    tags: ['Threats', 'Reporting', 'Safety planning'],
    keywords: ['someone threatening me online', 'online threats', 'threatening messages', 'report online threats India', 'what to do if someone threatens you'],
    authorId: 'editorial',
    status: 'published',
    publishedAt: '2026-11-25',
    updatedAt: '2026-11-25',
    related: ['how-to-preserve-digital-evidence', 'how-to-report-cyber-harassment', 'personal-safety-plan', 'cyberstalking-india'],
    sources: [ERSS, NCRP],
    accent: 'red',
    art: '112',
    body: [
      {
        type: 'p',
        text: 'A threat received on a screen can feel unreal and terrifying at the same time. Take it seriously, but you do not have to handle it alone or decide immediately how dangerous it is. Here is how to think it through and what to do.',
      },
      { type: 'h2', text: 'First: are you in immediate danger?' },
      {
        type: 'p',
        text: 'Treat a threat as urgent and call **112** if any of these are true:',
      },
      {
        type: 'ul',
        items: [
          'The person knows where you live, study or work, or where you are right now.',
          'They mention a specific time, place or weapon.',
          'They have been violent before, or have turned up in person.',
          'The threats are increasing in frequency or detail.',
          'Your gut says this person means it.',
        ],
      },
      {
        type: 'p',
        text: 'If so, go somewhere with other people, tell someone you trust, and let them know your location. Then come back to the steps below.',
      },
      { type: 'h2', text: 'Do not reply' },
      {
        type: 'p',
        text: 'It is natural to want to argue, apologise or plead. Most of the time, a response gives the person what they want and escalates things. If you must respond once, keep it to one calm line, such as “Do not contact me again”, and nothing more.',
      },
      { type: 'h2', text: 'Save the evidence' },
      {
        type: 'p',
        text: 'Screenshot every threat with the sender’s profile, username or number and the date and time. Copy profile links. Keep a log of every incident. Do this before blocking. Our guide on [preserving digital evidence](/blog/how-to-preserve-digital-evidence) shows what to capture.',
      },
      { type: 'h2', text: 'Make yourself harder to find' },
      {
        type: 'ul',
        items: [
          'Make your social profiles private and remove your phone number, address, college and workplace from public view. If your details have already been posted, see [doxxing](/blog/doxxing-what-to-do).',
          'Turn off location on posts and stop sharing your live location with anyone outside a very small, trusted circle.',
          'Vary routines that are visible online, such as check-ins at the same gym or café.',
          'Change passwords and turn on two-step verification on your main accounts.',
        ],
      },
      { type: 'h2', text: 'Tell people who can help' },
      {
        type: 'p',
        text: 'Let a few trusted people know what is happening and share your evidence with them. If the threat mentions your college or workplace, tell security, the Internal Committee or HR, so they can watch for the person. A [personal safety plan](/blog/personal-safety-plan) helps you decide in advance who to call and where to go.',
      },
      { type: 'h2', text: 'Report it' },
      {
        type: 'ul',
        items: [
          '**Platform:** report the message and the account as threatening or violent.',
          '**Police:** file at [cybercrime.gov.in](https://cybercrime.gov.in), call **1930**, or go to a police station. Criminal intimidation is an offence under the Bharatiya Nyaya Sanhita, and threats to share private images or to extort money are treated seriously.',
        ],
      },
      {
        type: 'p',
        text: 'See [how to report cyber harassment](/blog/how-to-report-cyber-harassment) for each step.',
      },
      { type: 'h2', text: 'If the threat demands money or something else' },
      {
        type: 'p',
        text: 'Do not pay and do not send anything else, including more photos. Paying rarely ends the demands; it usually leads to more. Stop responding, save everything and report it. If the threat involves intimate images, read [what to do if someone threatens to leak your photos](/blog/someone-threatening-to-leak-photos).',
      },
    ],
    faqs: [
      {
        question: 'Can I file a police complaint for threatening messages?',
        answer:
          'Yes. You can report threatening messages at a police station, on [cybercrime.gov.in](https://cybercrime.gov.in), or by calling 1930. Criminal intimidation is an offence in India. Take screenshots with dates and the sender’s details.',
      },
      {
        question: 'Should I reply to someone threatening me online?',
        answer:
          'It is usually best not to. Replies often escalate the situation. If you respond at all, one calm line asking them not to contact you again is enough.',
      },
    ],
  },

  /* ---------------------------------------------------------------- image-based abuse */
  {
    slug: 'someone-threatening-to-leak-photos',
    title: 'What to do if someone threatens to leak your private photos',
    seoTitle: 'Someone Threatening to Leak Your Photos? What to Do',
    description:
      'Sextortion and threats to share intimate images are crimes. What to do right now, how to stop images spreading, and how to report it in India, without blame.',
    seoDescription: 'Being blackmailed with private photos? Do not pay. Save evidence, stop images spreading with StopNCII or Take It Down, and report it in India.',
    category: 'online-harassment',
    tags: ['Image-based abuse', 'Sextortion', 'Blackmail'],
    keywords: ['someone threatening to leak my photos', 'blackmail with photos', 'sextortion India', 'private photos shared without consent', 'image based abuse', 'online blackmail what to do'],
    authorId: 'editorial',
    status: 'published',
    publishedAt: '2026-11-25',
    updatedAt: '2026-11-25',
    related: ['private-photos-shared-without-consent', 'how-to-preserve-digital-evidence', 'deepfakes-what-to-do', 'how-to-report-cyber-harassment'],
    sources: [NCRP, STOPNCII, TAKE_IT_DOWN, GAC],
    accent: 'ink',
    art: 'Not your fault',
    body: [
      {
        type: 'p',
        text: 'If someone is threatening to share intimate photos or videos of you, or already has, the first thing to know is this: **it is not your fault**. Sharing a picture with someone you trusted is not a crime. Threatening to leak it, or leaking it, is. You can get help, and there are real ways to stop images spreading.',
      },
      { type: 'h2', text: 'Right now: five things to do' },
      {
        type: 'ol',
        items: [
          '**Do not pay or send anything.** Not money, not more photos, not a video call. Paying almost never ends it; it tells the person you will pay again.',
          '**Stop replying.** You do not need to negotiate or explain. Silence is safer than conversation.',
          '**Save the evidence.** Screenshot the threats, the account name, username or number, and any payment details they gave (UPI ID, account number, wallet address). Copy profile links. Do this before blocking.',
          '**Tell one person you trust.** You do not have to go through this alone.',
          '**Report it.** To the platform and to the police, as explained below.',
        ],
      },
      {
        type: 'callout',
        tone: 'info',
        title: 'This happens to many people',
        text: 'Sextortion is often run by organised scammers who target thousands of people with fake profiles and the same script. It is not personal, and you were not foolish. These schemes are designed to be convincing.',
      },
      { type: 'h2', text: 'Stop the images being shared' },
      {
        type: 'p',
        text: 'Two free services can stop intimate images being posted on the major platforms that take part, without you having to upload the images anywhere:',
      },
      {
        type: 'ul',
        items: [
          '**[StopNCII.org](https://stopncii.org)** is for images taken when you were 18 or older. On your own device, it creates a digital fingerprint (a “hash”) of the image. Only the fingerprint is shared with partner platforms, which use it to detect and block matching uploads. The image itself never leaves your phone.',
          '**[Take It Down](https://takeitdown.ncmec.org)** works the same way for images taken when you were under 18.',
        ],
      },
      {
        type: 'p',
        text: 'These tools work only on participating platforms and only for images you have a copy of, so also report directly to any platform where the image appears.',
      },
      { type: 'h2', text: 'Report to the platform' },
      {
        type: 'p',
        text: 'Report the account and any posts as non-consensual intimate imagery, sextortion or blackmail. Under India’s IT Rules, platforms must act very quickly on a complaint from the person shown in intimate images, and must provide a Grievance Officer. If a platform does not act, you can appeal to the [Grievance Appellate Committee](https://gac.gov.in).',
      },
      { type: 'h2', text: 'Report to the police' },
      {
        type: 'p',
        text: 'File a complaint on the [National Cyber Crime Reporting Portal](https://cybercrime.gov.in). Its section on crimes against women and children has an option to report sexual content, including anonymously. If money was demanded or paid, call **1930** as well. You can also go to any police station or cyber cell.',
      },
      {
        type: 'p',
        text: 'Capturing, publishing or transmitting intimate images without consent is an offence under the Information Technology Act and the Bharatiya Nyaya Sanhita, and so is demanding money with threats. If the person in the images is under 18, stronger child-protection laws apply.',
      },
      { type: 'h2', text: 'Protect your accounts' },
      {
        type: 'ul',
        items: [
          'Make your profiles private and hide your friends and followers lists, which scammers use to threaten to send images to people you know.',
          'Change passwords and turn on two-step verification, especially if the images were taken from your phone or cloud.',
          'Consider warning close friends or family that a fake or abusive account may contact them, and that they should not open or forward anything.',
        ],
      },
      { type: 'h2', text: 'If you are under 18' },
      {
        type: 'p',
        text: 'Please tell an adult you trust: a parent, relative, teacher or counsellor. You can also call **1098** (Childline). You will not get into trouble for asking for help. Use [Take It Down](https://takeitdown.ncmec.org) to stop the images spreading.',
      },
      { type: 'h2', text: 'Looking after yourself' },
      {
        type: 'p',
        text: 'Fear, shame and panic are normal reactions, and they pass. If you are struggling, talk to someone today. The free national mental health helpline, Tele MANAS, is on **14416**. If you are thinking about harming yourself, call **112** or go to the nearest hospital.',
      },
      { type: 'p', text: 'Related guides: how to [preserve digital evidence](/blog/how-to-preserve-digital-evidence), how to [report cyber harassment in India](/blog/how-to-report-cyber-harassment), and what to do about [deepfakes and morphed images](/blog/deepfakes-what-to-do).' },
    ],
    faqs: [
      {
        question: 'Should I pay someone who is threatening to leak my photos?',
        answer:
          'No. Paying rarely ends the threats and usually leads to more demands. Stop replying, save the evidence including any payment details they gave, and report it to the platform and to the police at [cybercrime.gov.in](https://cybercrime.gov.in) or 1930.',
      },
      {
        question: 'Can I report image-based abuse anonymously in India?',
        answer:
          'The National Cyber Crime Reporting Portal has an option to report sexual content involving women and children anonymously. For the police to follow up with you, you would need to file with your details.',
      },
      {
        question: 'How does StopNCII work?',
        answer:
          'StopNCII creates a digital fingerprint of your image on your own device. Only that fingerprint is shared with partner platforms, which use it to detect and block matching uploads. It is for images taken when you were 18 or older; Take It Down covers images taken under 18.',
      },
    ],
  },

  /* ---------------------------------------------------------------- report vs block */
  {
    slug: 'report-vs-block',
    title: 'Report vs block: what is the difference, and when to use each?',
    seoTitle: 'Report vs Block Online: Which Should You Use and When?',
    description:
      'Blocking protects you; reporting can protect others too. When to use each, what the other person sees, and why you should save evidence first.',
    category: 'community-safety',
    tags: ['Reporting', 'Blocking', 'Community'],
    keywords: ['report vs block', 'when should you block someone online', 'when should you report someone online', 'what happens when you report someone'],
    authorId: 'editorial',
    status: 'published',
    publishedAt: '2026-11-25',
    updatedAt: '2026-11-25',
    related: ['what-happens-after-you-report', 'how-to-preserve-digital-evidence', 'cyberstalking-india', 'how-to-report-fake-profile'],
    sources: [
      { title: 'National Cyber Crime Reporting Portal (cybercrime.gov.in)', publisher: 'Ministry of Home Affairs', url: 'https://cybercrime.gov.in/' },
      { title: 'Grievance Appellate Committee', publisher: 'Ministry of Electronics and Information Technology', url: 'https://gac.gov.in/' },
    ],
    accent: 'blue',
    art: 'Block · Report',
    body: [
      {
        type: 'p',
        text: 'Blocking and reporting are the two tools every app gives you when someone makes you uncomfortable. They do different jobs, and in most serious cases the answer is to do both, in the right order.',
      },
      {
        type: 'table',
        head: ['', 'Block', 'Report'],
        rows: [
          ['What it does', 'Stops that account contacting you or seeing your content', 'Asks the platform’s safety team to review the account or content'],
          ['Who it protects', 'You', 'You and other people the account may target'],
          ['Can lead to removal?', 'No', 'Yes: content can be removed and accounts suspended'],
          ['Does the other person know?', 'They may notice', 'Platforms generally do not tell them who reported'],
        ],
      },
      { type: 'h2', text: 'When to block' },
      {
        type: 'ul',
        items: [
          'Someone is contacting you after you have said no.',
          'An account is rude, creepy or making you uneasy, even if it has not broken any rule.',
          'You simply want distance. You never need a reason to block someone.',
        ],
      },
      { type: 'h2', text: 'When to report' },
      {
        type: 'ul',
        items: [
          'Harassment, threats, hate or bullying.',
          'Fake profiles, impersonation or scams. See [how to report a fake profile](/blog/how-to-report-fake-profile).',
          'Sharing private information or intimate images without consent.',
          'Anything that suggests someone is at risk of harm.',
        ],
      },
      {
        type: 'p',
        text: 'Report the specific posts or messages, not only the profile. Choose the most accurate reason; it routes your report to the right reviewers.',
      },
      { type: 'h2', text: 'The right order: save, report, block' },
      {
        type: 'ol',
        items: [
          '**Save:** screenshot the messages and profile, and copy the profile link. Blocking can hide the conversation. See [preserving digital evidence](/blog/how-to-preserve-digital-evidence).',
          '**Report:** report the messages, posts and account.',
          '**Block:** then block, so you do not have to see any more.',
        ],
      },
      { type: 'h2', text: 'What blocking does not do' },
      {
        type: 'p',
        text: 'Blocking does not stop a determined person from making a new account, and it does not remove anything they have already posted about you. If someone keeps coming back, that pattern may be [cyberstalking](/blog/cyberstalking-india), and it is worth reporting to the police as well as the platform.',
      },
      { type: 'h2', text: 'On Sabhijude' },
      {
        type: 'p',
        text: 'Sabhijude lets you report a post or comment, block a person, or do both at once with Report & block. A single report never gets an account suspended. Once several different members report the same person, the account is flagged for a moderator to look at, and only reports from many different, established members can suspend it automatically. Reporting a post twice does not count twice; see [what happens after you report](/blog/what-happens-after-you-report). Once you block someone, their posts no longer appear for you.',
      },
    ],
    faqs: [
      {
        question: 'Does the person know if I report them?',
        answer:
          'Major platforms generally do not tell the reported person who reported them. They may be told that their content broke a rule or was removed.',
      },
      {
        question: 'Should I block or report someone who is harassing me?',
        answer:
          'Usually both. Save your evidence first, then report the messages and the account, then block. Blocking protects you; reporting lets the platform act and can protect others.',
      },
    ],
  },
];
