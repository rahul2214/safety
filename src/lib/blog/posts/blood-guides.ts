import type { BlogPost } from '../types';

/**
 * Blood donation guides (P0, batch 3). Medical statements stay general and defer to the blood
 * bank; eligibility follows India's NBTC guidelines as summarised in first-time-blood-donation-guide.
 * Product claims follow the blood request feature (see blood-donation.ts). Checked 2026-11-25.
 */

const NBTC = { title: 'National Blood Transfusion Council (NBTC)', publisher: 'Ministry of Health and Family Welfare', url: 'https://nbtc.naco.gov.in/' };

export const BLOOD_GUIDE_POSTS: BlogPost[] = [
  /* ---------------------------------------------------------------- myths */
  {
    slug: 'blood-donation-myths-and-facts',
    title: 'Blood donation myths and facts',
    seoTitle: 'Blood Donation Myths and Facts: What Is True and What Is Not',
    description:
      'Will it make you weak? Can you catch an infection? Can vegetarians or women donate? Common worries about donating blood, answered plainly.',
    category: 'blood-donation',
    tags: ['Myths', 'Eligibility', 'First-time donors'],
    keywords: ['blood donation myths and facts', 'is blood donation safe', 'benefits of blood donation', 'who should not donate blood', 'common questions about blood donation'],
    authorId: 'editorial',
    status: 'published',
    publishedAt: '2026-11-25',
    updatedAt: '2026-11-25',
    related: ['regular-blood-donor', 'first-time-blood-donation-guide', 'blood-donation-drive', 'how-to-respond-to-urgent-blood-request'],
    sources: [NBTC],
    accent: 'red',
    art: 'Myth?',
    body: [
      {
        type: 'p',
        text: 'Many people who could donate blood never do, often because of something they heard years ago. Here are the most common worries, and what is actually true. The blood bank’s doctor always makes the final decision about whether you can donate on a given day.',
      },
      { type: 'h2', text: '“Donating blood makes you weak”' },
      {
        type: 'p',
        text: '**Fact:** a healthy adult has around 5 litres of blood, and a donation is about 350 to 450 ml. Your body replaces the lost fluid within a day or two, and the red cells over the following weeks. Most people return to normal activities the same day. You are asked to rest briefly, eat a snack and avoid heavy exertion for the rest of the day.',
      },
      { type: 'h2', text: '“You can catch an infection from donating”' },
      {
        type: 'p',
        text: '**Fact:** every needle and blood bag is new, sterile and used only once. You cannot catch an infection by donating at a licensed blood bank or camp.',
      },
      { type: 'h2', text: '“It hurts a lot”' },
      {
        type: 'p',
        text: '**Fact:** you feel a brief pinch when the needle goes in, similar to a blood test. The donation itself takes about 8 to 10 minutes and most people feel little or nothing during it.',
      },
      { type: 'h2', text: '“Vegetarians cannot donate”' },
      {
        type: 'p',
        text: '**Fact:** diet does not decide eligibility. What matters is your haemoglobin level on the day, which is checked with a quick finger-prick test. Vegetarians with normal haemoglobin donate regularly.',
      },
      { type: 'h2', text: '“Women cannot donate”' },
      {
        type: 'p',
        text: '**Fact:** women can donate if they meet the same checks for age, weight and haemoglobin. Under India’s guidelines the gap between donations is longer for women (about four months) than for men (about three). Women are asked not to donate during pregnancy or while breastfeeding; the blood bank can advise on anything else.',
      },
      { type: 'h2', text: '“If I take medicines, I can never donate”' },
      {
        type: 'p',
        text: '**Fact:** it depends on the medicine and the condition. Some medicines mean a short wait, some are no problem, and some conditions mean you should not donate. Tell the blood bank what you take and let them decide.',
      },
      { type: 'h2', text: '“I donated recently, so I cannot help”' },
      {
        type: 'p',
        text: '**Fact:** you may not be able to donate again yet, but you can still help: share requests, tell friends of the right group, or help the family find the blood bank. Our guide to [responding to an urgent blood request](/blog/how-to-respond-to-urgent-blood-request) explains how.',
      },
      { type: 'h2', text: '“They will sell my blood”' },
      {
        type: 'p',
        text: '**Fact:** selling blood is illegal in India. Licensed blood banks test, process and issue blood to patients. Hospitals may charge processing fees for testing and storage, but donors are never paid. If someone offers to buy or sell blood, report it to the blood bank.',
      },
      { type: 'h2', text: '“My blood group is common, so it is not needed”' },
      {
        type: 'p',
        text: '**Fact:** common groups such as O+ and B+ are needed most often, precisely because so many patients have them. Every group is needed. See [blood group compatibility](/blog/blood-group-compatibility-explained).',
      },
      {
        type: 'callout',
        tone: 'success',
        title: 'Ready to try?',
        text: 'Our [first-time donor guide](/blog/first-time-blood-donation-guide) walks through the whole visit, from the health check to the snack afterwards.',
      },
    ],
    faqs: [
      {
        question: 'Is blood donation safe?',
        answer:
          'Yes, for healthy adults who pass the blood bank’s checks. Every needle and bag is new, sterile and used once, so you cannot catch an infection by donating, and your body replaces the fluid within a day or two.',
      },
      {
        question: 'How often can you donate blood in India?',
        answer:
          'Under India’s guidelines, the usual minimum gap between whole blood donations is about three months for men and four months for women. The blood bank will confirm on the day.',
      },
      {
        question: 'Can vegetarians donate blood?',
        answer: 'Yes. Diet does not decide eligibility; your haemoglobin level does, and it is checked on the day with a quick finger-prick test.',
      },
    ],
  },

  /* ---------------------------------------------------------------- responding to a request */
  {
    slug: 'how-to-respond-to-urgent-blood-request',
    title: 'How to respond to an urgent blood request',
    seoTitle: 'How to Respond to an Urgent Blood Request Safely',
    description:
      'You have seen a request for your blood group. How to check it is genuine, what to ask, how donation at the hospital works, and how to help even if you cannot donate.',
    seoDescription: 'Seen a request for your blood group? How to check it is genuine, what to ask, how donating works, and how to help even if you cannot donate today.',
    category: 'blood-donation',
    tags: ['Blood requests', 'Donors', 'Scams'],
    keywords: ['how to respond to urgent blood request', 'blood donors near me', 'emergency blood donor', 'how to help someone looking for blood', 'fake blood request'],
    authorId: 'editorial',
    status: 'published',
    publishedAt: '2026-11-25',
    updatedAt: '2026-11-25',
    related: ['how-to-find-blood-donors', 'how-to-write-a-blood-request', 'blood-donation-myths-and-facts', 'first-time-blood-donation-guide'],
    sources: [NBTC],
    accent: 'coral',
    art: 'I can help',
    body: [
      {
        type: 'p',
        text: 'A message pops up: “Urgent: O− needed at City Hospital.” You have that group and want to help. A few minutes of checking makes sure your help reaches the patient, and protects you from the occasional fake request.',
      },
      { type: 'h2', text: '1. Check whether you can donate today' },
      {
        type: 'ul',
        items: [
          'You are 18 to 65, weigh at least 45 kg and feel well.',
          'It has been at least three months (men) or four months (women) since your last whole blood donation.',
          'No recent tattoo, piercing, illness, surgery or medicine that you know requires a wait.',
        ],
      },
      {
        type: 'p',
        text: 'If you are unsure, say so when you call; the blood bank will check on the day. See [blood donation myths and facts](/blog/blood-donation-myths-and-facts) for common questions.',
      },
      { type: 'h2', text: '2. Call before you travel' },
      {
        type: 'p',
        text: 'Call the number on the request and ask:',
      },
      {
        type: 'ol',
        items: [
          'Is blood still needed? Requests are often forwarded long after they are fulfilled.',
          'Which hospital and which blood bank, exactly? Where should you go when you arrive?',
          'Which group and component is needed, and how many donors?',
          'Could you donate as a replacement donor if your group is different?',
          'Whose name should you give at the blood bank?',
        ],
      },
      { type: 'h2', text: '3. Watch for warning signs' },
      {
        type: 'callout',
        tone: 'warn',
        title: 'Never pay to donate or to “arrange” blood',
        text: 'Selling blood is illegal in India. Be cautious if a caller asks you for money, an advance, a registration fee or your bank details, will not name the hospital, or asks you to meet somewhere other than the hospital. Real requests need your blood, not your money.',
      },
      { type: 'h2', text: '4. Donate at the hospital blood bank' },
      {
        type: 'p',
        text: 'Go to the blood bank, give the patient’s name, and carry a photo ID. The blood bank will do a short health check and, if you are eligible, take the donation. Your blood is then tested and processed before it is used. Eat a meal two to three hours before, and drink plenty of water. Our [first-time donor guide](/blog/first-time-blood-donation-guide) covers the whole visit.',
      },
      { type: 'h2', text: '5. Let the family know' },
      {
        type: 'p',
        text: 'Once you have donated, message the person who posted the request so they can update it. It saves other donors a wasted journey.',
      },
      { type: 'h2', text: 'If you cannot donate, you can still help' },
      {
        type: 'ul',
        items: [
          'Share the request with people of the right group in that city, using the original link rather than a screenshot, so they see the latest status.',
          'Offer to call blood banks or help the family with logistics.',
          'Note when you will next be eligible, and make sure your blood group is on your profile.',
        ],
      },
      { type: 'h2', text: 'On Sabhijude' },
      {
        type: 'p',
        text: 'Signed-in members see open blood requests within about 25 km of the place the requester pinned, under “Near you” on the home screen. Each request shows the blood group, units and hospital, and you can call the requester directly. Every request also has a live status page, so a link you receive always shows whether help is still needed. If you are the one looking for blood, see [how to write a blood request that gets answered](/blog/how-to-write-a-blood-request).',
      },
    ],
    faqs: [
      {
        question: 'How can I tell if a blood request is genuine?',
        answer:
          'Call the number and confirm the hospital, the blood bank, the patient’s name and whether blood is still needed. Be cautious if anyone asks for money, an advance or bank details, or will not name the hospital. Selling blood is illegal in India.',
      },
      {
        question: 'Can I help if my blood group does not match?',
        answer:
          'Often, yes. Many blood banks accept replacement donations of any group and issue the matching group to the patient from stock. Ask the requester or the blood bank whether this is possible.',
      },
    ],
  },
];
