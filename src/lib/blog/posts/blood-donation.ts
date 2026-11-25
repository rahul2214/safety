import type { BlogPost } from '../types';

/**
 * Blood donation articles. Product claims must match what the app really does (see
 * BloodRequestsController and the blood screens): requests are shown to signed-in people within
 * about 25 km of the pinned place for up to 7 days; there are no push notifications for them;
 * donors respond by calling. Medical facts follow India's NBTC donor-selection guidelines and
 * always defer to the blood bank.
 */

export const BLOOD_POSTS: BlogPost[] = [
  {
    slug: 'introducing-blood-requests',
    related: ['how-to-respond-to-urgent-blood-request', 'how-to-write-a-blood-request', 'blood-donation-myths-and-facts'],
    title: 'Introducing blood requests: help from someone nearby',
    description:
      'Sabhijude now lets you ask for blood in under a minute. Your request is shown to people near the hospital, who can call you directly.',
    category: 'blood-donation',
    status: 'published',
    publishedAt: '2026-11-18',
    updatedAt: '2026-11-18',
    authorId: 'editorial',
    tags: ['Product update', 'Blood requests'],
    keywords: ['blood request', 'find blood donors near me', 'blood donor app India'],
    sources: [
      { title: 'National Blood Transfusion Council (NBTC)', publisher: 'Ministry of Health and Family Welfare', url: 'https://nbtc.naco.gov.in/' },
    ],
    accent: 'red',
    art: 'O+',
    body: [
      {
        type: 'p',
        text: 'When a family member needs blood, the hours that follow are some of the most stressful a person can face. Phones come out, messages are forwarded to every group, and people search for anyone with the right blood group. Very often, the person who could help lives a few streets from the hospital and simply never hears about it.',
      },
      {
        type: 'p',
        text: 'Sabhijude was built on a simple idea: when people connect, help gets closer. Today we are bringing that idea to blood requests.',
      },
      { type: 'h2', text: 'What is new' },
      {
        type: 'p',
        text: 'Anyone with a free Sabhijude account can now post a blood request. It takes four details: the blood group needed, how many units, where it is needed, and a number donors should call. You can add a short note if it helps, such as the ward or the patient’s name at the reception desk.',
      },
      {
        type: 'p',
        text: 'Your request then appears in the “Near you” section of the home screen for signed-in people within about 25 km of the place you pinned, for up to seven days or until you close it. People who can donate call you directly. There is no middleman and no fee.',
      },
      { type: 'h2', text: 'How it works' },
      {
        type: 'ol',
        items: [
          'Open Request blood and choose the blood group (A+, A−, B+, B−, AB+, AB−, O+ or O−).',
          'Set the units needed. The app shows the volume too: one unit is about 450 ml, so two units is about 900 ml.',
          'Pin the hospital. Use your current location, or pick the exact place on a map and search by hospital name.',
          'Add the number donors should call, and send. People near that place can now see your request.',
          'Share it. One tap sends a short message to WhatsApp or SMS with the group, the number, directions and a live status link.',
          'When you have the blood you need, tap Mark fulfilled. The request stops showing, and the live status page hides your number.',
        ],
      },
      { type: 'h2', text: 'A live status link for every request' },
      {
        type: 'p',
        text: 'Forwarded messages have a problem: they keep circulating long after the need has passed, and people keep calling. Every Sabhijude request now comes with its own public page. Anyone who receives the link can see whether help is still needed, call with one tap and get directions, even without the app. Once you mark the request fulfilled, that page says so and stops showing your number.',
      },
      {
        type: 'callout',
        tone: 'info',
        title: 'Sabhijude connects people. It is not a blood bank.',
        text: 'Donated blood always goes through the hospital’s blood bank, which checks the donor, tests the blood and cross-matches it with the patient. A donor who sees your request should call first, and then donate at the blood bank you name.',
      },
      { type: 'h2', text: 'Designed with care' },
      {
        type: 'ul',
        items: [
          'Your phone number appears only on your own request, so donors can reach you. Use a number you are comfortable sharing.',
          'You can edit an open request, mark it fulfilled, or delete it. Every delete asks you to confirm first.',
          'Blood requests are kept separate from incident reports. They never appear in the community safety feed.',
          'You never see requests from people you have blocked.',
        ],
      },
      { type: 'h2', text: 'Be there for the next one' },
      {
        type: 'p',
        text: 'Every request depends on someone nearby being willing to help. If you are healthy and between 18 and 65, consider adding your blood group to your Sabhijude profile and keeping an eye on “Near you”. The next request could be two streets away.',
      },
      { type: 'p', text: 'New to this? Read [how to write a blood request that gets answered](/blog/how-to-write-a-blood-request), [blood group compatibility](/blog/blood-group-compatibility-explained) and the [first-time donor guide](/blog/first-time-blood-donation-guide).' },
    ],
  },
  {
    slug: 'first-time-blood-donation-guide',
    title: 'Donating blood for the first time? Here is exactly what happens',
    seoTitle: 'First Time Donating Blood? What Happens, Step by Step',
    description:
      'From the health check to the juice afterwards: a calm, step-by-step guide to your first blood donation in India, and how to look after yourself.',
    category: 'blood-donation',
    status: 'published',
    featured: false,
    publishedAt: '2026-11-18',
    updatedAt: '2026-11-18',
    authorId: 'editorial',
    tags: ['First-time donors', 'Eligibility'],
    keywords: ['blood donation', 'first time blood donation', 'what happens during blood donation', 'blood donation process'],
    related: ['who-can-donate-blood-india', 'blood-donation-myths-and-facts', 'how-to-respond-to-urgent-blood-request'],
    sources: [
      { title: 'National Blood Transfusion Council (NBTC)', publisher: 'Ministry of Health and Family Welfare', url: 'https://nbtc.naco.gov.in/' },
    ],
    accent: 'blue',
    art: '45 min',
    body: [
      {
        type: 'p',
        text: 'Most first-time donors say the same thing afterwards: “That was much easier than I expected.” The whole visit usually takes 45 minutes to an hour, and the donation itself only about 8 to 10 minutes. Here is what to expect, step by step.',
      },
      { type: 'h2', text: 'Can I donate?' },
      {
        type: 'p',
        text: 'In India, blood banks follow the National Blood Transfusion Council’s guidelines. The basics are below. The blood bank will check all of this on the day, so if you are unsure, call them and ask.',
      },
      {
        type: 'table',
        head: ['Check', 'General guideline'],
        rows: [
          ['Age', '18 to 65 years (first-time donors are usually accepted up to 60)'],
          ['Weight', 'At least 45 kg (55 kg for a 450 ml donation)'],
          ['Haemoglobin', 'At least 12.5 g/dL, tested with a finger prick on the day'],
          ['Gap since last donation', 'At least 3 months for men, 4 months for women'],
          ['Health on the day', 'Feeling well, with normal pulse, blood pressure and temperature'],
        ],
        caption: 'Summary only. The blood bank’s doctor makes the final decision.',
      },
      {
        type: 'p',
        text: 'You may be asked to wait if you have recently had a tattoo or piercing, an illness, certain medicines or vaccines, surgery, or if you are pregnant or breastfeeding. Being asked to wait is not a judgement; it protects both you and the patient.',
      },
      { type: 'h2', text: 'The day before' },
      {
        type: 'ul',
        items: [
          'Sleep well and drink plenty of water.',
          'Avoid alcohol for at least 24 hours before donating.',
          'Eat iron-rich food if you can: dal, green leafy vegetables, jaggery, eggs, meat or fish.',
        ],
      },
      { type: 'h2', text: 'On the day, step by step' },
      {
        type: 'ol',
        items: [
          'Eat a normal meal 2 to 3 hours before. Do not donate on an empty stomach.',
          'Carry a photo ID. Wear a shirt with sleeves that roll up easily.',
          'Registration: you fill a short form and a health questionnaire. Answer honestly; it is confidential.',
          'Mini health check: weight, pulse, blood pressure and a quick finger-prick haemoglobin test.',
          'The donation: you lie back in a comfortable chair. A trained staff member uses a new, sterile, single-use needle. It takes about 8 to 10 minutes, and you will be asked to gently squeeze a soft ball.',
          'Rest for 10 to 15 minutes. You will be offered a drink and a snack. Take them.',
        ],
      },
      {
        type: 'callout',
        tone: 'success',
        title: 'It is safe',
        text: 'Every needle and blood bag is new, sterile and used only once. You cannot catch an infection by donating blood. Your body replaces the fluid within a day or two and the red cells over the following weeks.',
      },
      { type: 'h2', text: 'After you donate' },
      {
        type: 'ul',
        items: [
          'Drink extra water or juice for the rest of the day.',
          'Keep the plaster on for a few hours and avoid heavy lifting with that arm.',
          'Skip the gym and strenuous exercise for the day.',
          'If you feel light-headed, sit or lie down with your feet raised until it passes.',
          'If anything feels wrong later, call the blood bank. They want to know.',
        ],
      },
      { type: 'h2', text: 'One donation, more than one patient' },
      {
        type: 'p',
        text: 'Blood banks often separate a single donation into components such as red cells, plasma and platelets. Each component can go to a different patient, so one visit from you can help more than one person.',
      },
      {
        type: 'callout',
        tone: 'warn',
        title: 'Never pay, never accept money',
        text: 'Voluntary, unpaid donation is the law in India. Selling or buying blood is illegal. If anyone offers or asks for money to donate, say no and tell the hospital.',
      },
      {
        type: 'p',
        text: 'Ready to help? Add your blood group to your Sabhijude profile and watch the “Near you” section on your home screen. When someone nearby needs your group, you will be one call away.',
      },
      { type: 'p', text: 'Before you go, read [blood donation myths and facts](/blog/blood-donation-myths-and-facts) and [blood group compatibility](/blog/blood-group-compatibility-explained). Answering a request? See [how to respond to an urgent blood request](/blog/how-to-respond-to-urgent-blood-request).' },
    ],
  },
  {
    slug: 'how-to-write-a-blood-request',
    title: 'How to write a blood request that actually gets answered',
    description:
      'Clear details, the right place and an up-to-date status make the difference. Six practical tips for families looking for donors.',
    category: 'blood-donation',
    status: 'published',
    publishedAt: '2026-11-18',
    updatedAt: '2026-11-18',
    authorId: 'editorial',
    tags: ['Blood requests', 'Guides'],
    keywords: ['how to request blood', 'blood request', 'urgent blood requirement'],
    sources: [
      { title: 'National Blood Transfusion Council (NBTC)', publisher: 'Ministry of Health and Family Welfare', url: 'https://nbtc.naco.gov.in/' },
    ],
    accent: 'coral',
    art: '6 tips',
    body: [
      {
        type: 'p',
        text: 'In an emergency it is natural to send a message to everyone you know and hope for the best. But the requests that find donors fastest tend to have a few things in common. Here is what helps, based on how people actually respond.',
      },
      { type: 'h2', text: '1. Ask the blood bank first' },
      {
        type: 'p',
        text: 'Before you post, ask the hospital’s blood bank three questions: which blood group and component is needed, how many units, and whether donors of other groups can help through a replacement donation. Sometimes the blood bank has stock and only needs donors to replace it later, which widens who can help.',
      },
      { type: 'h2', text: '2. Be exact about the group and the amount' },
      {
        type: 'p',
        text: 'Write the full group, including positive or negative: “O+”, not “O”. Give the number of units. Sabhijude shows the volume alongside, so “2 units (~900 ml)” is clear even to someone who has never donated.',
      },
      { type: 'h2', text: '3. Pin the real place' },
      {
        type: 'p',
        text: 'Requests are shown to people near the place you pin, so pin the hospital, not your home. On Sabhijude you can search for the hospital or tap its exact spot on the map. Then give it a name people will recognise, such as “Government General Hospital, blood bank, ground floor”.',
      },
      { type: 'h2', text: '4. Use a number that will be answered' },
      {
        type: 'p',
        text: 'Choose one person who will keep their phone close and answer unknown numbers for the next day or two. A request with three different numbers confuses donors. A request with a switched-off phone loses them.',
      },
      { type: 'h2', text: '5. Share the link, not a screenshot' },
      {
        type: 'p',
        text: 'Screenshots and copied text cannot be updated. Use Share on your Sabhijude request: the message includes a live status link, so anyone who receives it, even weeks later, can see whether help is still needed.',
      },
      {
        type: 'quote',
        text: 'The most common complaint from donors is calling about a request that was fulfilled days ago.',
      },
      { type: 'h2', text: '6. Close it the moment you are covered' },
      {
        type: 'p',
        text: 'As soon as you have the blood you need, tap Mark fulfilled. The request stops showing to people nearby, the live status page thanks everyone who helped, and your number is hidden. It is the kindest thing you can do for the donors still trying to reach you.',
      },
      {
        type: 'callout',
        tone: 'info',
        title: 'A good request at a glance',
        text: 'O+ · 2 units (~900 ml) · City Hospital, blood bank · one reachable number · pinned on the hospital · shared with its live status link · closed when fulfilled.',
      },
      {
        type: 'callout',
        tone: 'warn',
        title: 'Watch out for paid “donors”',
        text: 'Selling blood is illegal in India. If someone offers blood or a donor in exchange for money, do not pay. Tell the hospital’s blood bank.',
      },
      { type: 'p', text: 'Donors can read [how to respond to an urgent blood request](/blog/how-to-respond-to-urgent-blood-request). For which groups can help, see [blood group compatibility](/blog/blood-group-compatibility-explained), and for the feature itself, [how blood requests work on Sabhijude](/blog/introducing-blood-requests).' },
    ],
  },
  {
    slug: 'blood-group-compatibility-explained',
    title: 'Blood group compatibility, explained simply',
    description:
      'Why O− is called the universal donor, who can give red cells to whom, and why the blood bank always cross-matches anyway.',
    category: 'blood-donation',
    status: 'published',
    publishedAt: '2026-11-18',
    updatedAt: '2026-11-18',
    authorId: 'editorial',
    tags: ['Blood groups'],
    keywords: ['blood group compatibility', 'universal donor', 'blood group chart'],
    sources: [
      { title: 'National Blood Transfusion Council (NBTC)', publisher: 'Ministry of Health and Family Welfare', url: 'https://nbtc.naco.gov.in/' },
    ],
    accent: 'ink',
    art: 'A·B·O',
    body: [
      {
        type: 'p',
        text: 'There are eight common blood groups: A, B, AB and O, each either Rh positive (+) or Rh negative (−). Your group decides whose red cells your body will accept, and whom yours can help.',
      },
      { type: 'h2', text: 'The two rules' },
      {
        type: 'ul',
        items: [
          'Letters: A can receive from A and O. B can receive from B and O. AB can receive from A, B, AB and O. O can receive only from O.',
          'Rh: Rh positive people can receive positive or negative. Rh negative people should receive negative.',
        ],
      },
      { type: 'h2', text: 'Who can give red cells to whom' },
      {
        type: 'table',
        head: ['Your group', 'You can give red cells to', 'You can receive red cells from'],
        rows: [
          ['O−', 'Everyone', 'O−'],
          ['O+', 'O+, A+, B+, AB+', 'O+, O−'],
          ['A−', 'A−, A+, AB−, AB+', 'A−, O−'],
          ['A+', 'A+, AB+', 'A+, A−, O+, O−'],
          ['B−', 'B−, B+, AB−, AB+', 'B−, O−'],
          ['B+', 'B+, AB+', 'B+, B−, O+, O−'],
          ['AB−', 'AB−, AB+', 'AB−, A−, B−, O−'],
          ['AB+', 'AB+', 'Everyone'],
        ],
        caption: 'Red cell compatibility. Plasma follows different rules.',
      },
      {
        type: 'p',
        text: 'That is why O− is called the universal red cell donor and AB+ the universal recipient. O+ is the most common group in India, so O+ donors are needed every day.',
      },
      {
        type: 'callout',
        tone: 'info',
        title: 'The blood bank always cross-matches',
        text: 'This chart shows the general rules. Before any transfusion, the hospital’s blood bank tests the donor’s blood and cross-matches it with the patient’s. Only they decide what is safe for a particular patient.',
      },
      { type: 'h2', text: 'Can a different group still help?' },
      {
        type: 'p',
        text: 'Often, yes. Many blood banks accept “replacement” donations: you donate any group, and the bank issues the matching group to the patient from its stock. Ask the blood bank whether this is possible before you post a request, because it lets many more people help.',
      },
      { type: 'h2', text: 'Know your group' },
      {
        type: 'p',
        text: 'If you do not know your blood group, a simple test at any pathology lab or a blood donation camp will tell you. Then add it to your Sabhijude profile, so you know at a glance which requests near you you can answer.',
      },
      { type: 'p', text: 'Next: [donating for the first time](/blog/first-time-blood-donation-guide), [blood donation myths and facts](/blog/blood-donation-myths-and-facts), and [how to write a blood request](/blog/how-to-write-a-blood-request).' },
    ],
  },
];
