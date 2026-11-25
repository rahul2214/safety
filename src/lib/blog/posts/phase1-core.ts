import type { BlogPost, Source } from '../types';

/**
 * Phase 1 (roadmap ranks 1-16): cab safety, feeling unsafe, emergencies, private photos shared,
 * finding blood donors. Facts checked 2026-11-25:
 * - Rule 125H CMVR: public service vehicles must carry a location tracking device and emergency
 *   button; the Supreme Court (2026) directed states to enforce it, no fitness certificate without.
 * - Section 134A, Motor Vehicles Act (2019 amendment) protects Good Samaritans who help accident victims.
 * - e-RaktKosh (MoHFW) shows blood stock at blood banks by state/district.
 * Sabhijude claims follow the app: live share 1/4/8/24 h or until stopped, up to 5 people with
 * their own link; SOS has a 3-second countdown and texts a live-location link; the emergency
 * screen has a fake call and 112 button; blood requests reach members within ~25 km.
 */

const ERSS: Source = { title: 'Emergency Response Support System (112)', publisher: 'Ministry of Home Affairs', url: 'https://112.gov.in/' };
const WHL: Source = { title: 'Women Helpline (181)', publisher: 'Ministry of Women and Child Development (myScheme)', url: 'https://www.myscheme.gov.in/schemes/whl-181' };
const NCRP: Source = { title: 'National Cyber Crime Reporting Portal (cybercrime.gov.in)', publisher: 'Ministry of Home Affairs', url: 'https://cybercrime.gov.in/' };
const NBTC: Source = { title: 'National Blood Transfusion Council (NBTC)', publisher: 'Ministry of Health and Family Welfare', url: 'https://nbtc.naco.gov.in/' };

export const PHASE1_CORE_POSTS: BlogPost[] = [
  /* ---------------------------------------------------------------- cab safety */
  {
    slug: 'cab-safety-tips',
    title: 'Cab safety tips: what to check before and during a ride',
    seoTitle: 'Cab Safety Tips: What to Check Before and During a Ride',
    description:
      'Matching the car and driver, sharing your trip, the emergency button, what to do if the driver goes off route, and how to end a ride safely.',
    seoDescription:
      'Cab and auto safety in India: check the plate and driver, share your trip, use the emergency button, and know what to do if a ride starts to feel wrong.',
    category: 'travel-safety',
    tags: ['Cabs', 'Autos', 'Ride-hailing', 'Night travel'],
    keywords: ['cab safety tips', 'what to do if you feel unsafe in a cab', 'ride sharing safety', 'auto rickshaw safety', 'cab safety for women'],
    authorId: 'editorial',
    status: 'published',
    publishedAt: '2026-11-25',
    updatedAt: '2026-11-25',
    related: ['night-travel-safety-women', 'live-location-safety', 'what-to-do-if-you-feel-unsafe', 'solo-travel-safety-india'],
    sources: [
      ERSS,
      WHL,
      { title: 'Supreme Court: location tracking devices and panic buttons mandatory in public service vehicles (report)', publisher: 'Bar & Bench', url: 'https://www.barandbench.com/news/location-tracking-devices-panic-buttons-mandatory-in-taxis-public-vehicles-supreme-court' },
    ],
    accent: 'ink',
    art: 'Check',
    body: [
      {
        type: 'p',
        text: 'Most cab and auto rides are uneventful. A minute of checking before you get in, and one habit during the ride, mean that if something does go wrong, the right people know quickly.',
      },
      { type: 'h2', text: 'Before you get in' },
      {
        type: 'ol',
        items: [
          '**Match the number plate,** car model and colour with the app. Do this every time, including when you are in a hurry.',
          '**Match the driver** with the photo and name in the app. If someone else is driving, do not get in; cancel and report it.',
          '**Ask “Who are you here for?”** rather than saying your name first.',
          '**Prefer app-booked or prepaid rides** at stations and airports over offers from people who approach you.',
          '**Charge your phone** and keep it in your hand, not deep in a bag.',
        ],
      },
      { type: 'h2', text: 'During the ride' },
      {
        type: 'ul',
        items: [
          '**Share your trip** from the ride app, or share your [live location](/blog/live-location-safety) with one trusted person, and tell them your expected arrival time.',
          '**Sit in the back,** ideally behind the passenger seat, and check the door opens from inside.',
          '**Follow the route** on your own map app. A short detour for traffic is normal; a sudden turn into an empty road is not.',
          '**Stay reachable:** a short call with a friend, talking normally about where you are, is a quiet signal that someone knows.',
          'Keep your belongings with you rather than in the boot, so you can leave quickly.',
        ],
      },
      { type: 'h2', text: 'The emergency button' },
      {
        type: 'p',
        text: 'Ride apps have an in-app emergency or SOS button that alerts the company and can connect you to emergency services. Separately, under India’s motor vehicle rules, public service vehicles such as taxis are required to have a location tracking device and a physical emergency button linked to a state monitoring system. Not every vehicle complies yet, so do not rely on the physical button alone; use your phone too.',
      },
      {
        type: 'callout',
        tone: 'info',
        title: 'Real example: enforcement is being tightened',
        text: 'In 2026 the Supreme Court directed all states and union territories to strictly enforce the rule, and said a public service vehicle should not get a fitness certificate or permit unless it has a tracking device and emergency buttons fitted, after reports that only a small fraction of vehicles complied.',
      },
      { type: 'h2', text: 'If the ride starts to feel wrong' },
      {
        type: 'ol',
        items: [
          'Ask clearly, “Why are we going this way?” Many problems are simple misunderstandings.',
          'Call a friend on speaker and say the car number and where you are.',
          'Press the app’s emergency button.',
          'Ask the driver to stop at a busy place, such as a petrol pump, mall or hospital entrance, and get out there.',
          'If you feel in danger, call **112**, or **181** for the Women Helpline. Give the car number and your location.',
        ],
      },
      { type: 'h2', text: 'After the ride' },
      {
        type: 'p',
        text: 'Report any harassment, unsafe driving or a driver who did not match the app through the app’s safety or help section. If you were threatened or touched, you can also go to the police; the trip record in the app helps. See [what to do if you feel unsafe](/blog/what-to-do-if-you-feel-unsafe) and our [night travel safety tips](/blog/night-travel-safety-women).',
      },
      { type: 'h2', text: 'On Sabhijude' },
      {
        type: 'p',
        text: 'You can share your live location for the length of the ride (1, 4, 8 or 24 hours, or until you stop it) with up to five people, who each get their own link that opens without the app. If something goes wrong, the SOS button texts your trusted contacts a link to your live location. See [how to set up SOS and trusted contacts](/blog/sos-and-trusted-contacts).',
      },
    ],
    faqs: [
      {
        question: 'What should I do if I feel unsafe in a cab?',
        answer:
          'Press the app’s emergency button, call a friend on speaker with the car number and location, ask the driver to stop at a busy place and get out there. If you feel in danger, call 112.',
      },
      {
        question: 'Do taxis in India have panic buttons?',
        answer:
          'Under India’s motor vehicle rules, public service vehicles such as taxis are required to have a location tracking device and emergency button, and the Supreme Court has directed states to enforce this. Compliance is still incomplete, so also use your phone and the ride app’s emergency feature.',
      },
    ],
  },

  /* ---------------------------------------------------------------- feeling unsafe */
  {
    slug: 'what-to-do-if-you-feel-unsafe',
    title: 'What to do if you feel unsafe: calm, practical steps',
    seoTitle: 'What to Do If You Feel Unsafe: Calm, Practical Steps',
    description:
      'Trust the feeling, move towards people, tell someone, and know exactly how to ask for help, wherever you are and whatever the situation.',
    seoDescription:
      'Feeling unsafe? How to trust your instincts, move towards people, ask for help clearly, alert trusted contacts and call 112, with simple steps for India.',
    category: 'personal-safety',
    tags: ['Feeling unsafe', 'Asking for help', 'Instincts'],
    keywords: ['what to do if you feel unsafe', 'how to ask for help when you feel unsafe', 'recognise unsafe situations', 'personal safety tips'],
    authorId: 'editorial',
    status: 'published',
    publishedAt: '2026-11-25',
    updatedAt: '2026-11-25',
    related: ['what-to-do-if-someone-is-following-you', 'sos-and-trusted-contacts', 'emergency-helpline-numbers-india', 'personal-safety-plan'],
    sources: [ERSS, WHL],
    accent: 'coral',
    art: 'Trust it',
    body: [
      {
        type: 'p',
        text: 'The feeling that something is wrong often arrives before you can explain why. You do not need proof or a reason to act on it. Acting early, while you still have choices, is what keeps situations small.',
      },
      {
        type: 'callout',
        tone: 'warn',
        title: 'In danger right now? Call 112',
        text: 'Say where you are first, then what is happening. If you cannot speak freely, say as much as you can and keep the line open.',
      },
      { type: 'h2', text: 'Signs worth listening to' },
      {
        type: 'ul',
        items: [
          'Someone staying close to you, mirroring your direction, or watching you repeatedly.',
          'A person insisting on helping, or pushing you to go somewhere private.',
          'Being separated from your friends, or someone trying to make that happen.',
          'A place that has suddenly emptied, or where exits are blocked.',
          'Feeling much more drunk or unwell than you should.',
        ],
      },
      { type: 'h2', text: 'Five things to do' },
      {
        type: 'ol',
        items: [
          '**Move towards people and light:** a shop, pharmacy, petrol pump, hotel lobby, station office or a family. Go inside if you can.',
          '**Tell a specific person:** “I feel unsafe, can I wait here with you?” A direct request to one person works far better than a general call for help.',
          '**Call someone you trust** and stay on the line. Say where you are out loud.',
          '**Alert your trusted contacts** with your location, using your phone’s emergency feature or a safety app. See [SOS and trusted contacts](/blog/sos-and-trusted-contacts).',
          '**Call 112** if the feeling grows, or if someone follows, threatens or touches you.',
        ],
      },
      { type: 'h2', text: 'How to ask for help clearly' },
      {
        type: 'p',
        text: 'In a stressful moment, short sentences work best. Name the problem, the person and what you want: “That man has been following me since the station. Please stay with me until my friend comes.” If you need to leave without a scene, a phone call (real or fake) is a socially easy exit.',
      },
      { type: 'h2', text: 'Specific situations' },
      {
        type: 'ul',
        items: [
          'Being followed: see [what to do if someone is following you](/blog/what-to-do-if-someone-is-following-you).',
          'In a cab: see [cab safety tips](/blog/cab-safety-tips).',
          'Harassed in a public place: see [what to do if you are harassed in public](/blog/harassed-in-public-what-to-do).',
          'Threatened online: see [what to do if someone threatens you online](/blog/what-to-do-if-someone-threatens-you-online).',
        ],
      },
      { type: 'h2', text: 'If someone else seems unsafe' },
      {
        type: 'p',
        text: 'Check in quietly: “Are you okay? Do you want me to stay with you?” Stand nearby, help them call someone, or get staff. You do not need to confront anyone to help.',
      },
      { type: 'h2', text: 'Afterwards' },
      {
        type: 'p',
        text: 'Feeling shaken is normal, even if “nothing happened”. Talk to someone you trust. If it was a pattern rather than a one-off, write down dates and details and consider reporting it. A [personal safety plan](/blog/personal-safety-plan) helps you decide in advance where to go and who to call next time.',
      },
      {
        type: 'callout',
        tone: 'info',
        title: 'Tools on Sabhijude',
        text: 'The emergency screen has an SOS button (with a 3-second countdown you can cancel) that texts your trusted contacts a link to your live location, a one-tap call to 112, and a fake incoming call for a discreet exit.',
      },
    ],
    faqs: [
      {
        question: 'What should I do if I feel unsafe?',
        answer:
          'Move towards people and light, ask a specific person to stay with you, call someone you trust and share your location. If you feel in danger, call 112 and say where you are first.',
      },
      {
        question: 'How do I ask for help without making a scene?',
        answer:
          'Speak to one person directly and briefly, for example “I feel unsafe, can I wait here with you?”, or take a phone call as a reason to step away. Staff in shops, pharmacies and stations are usually glad to help.',
      },
    ],
  },

  /* ---------------------------------------------------------------- emergency first steps */
  {
    slug: 'what-to-do-during-an-emergency',
    title: 'What to do in an emergency: the first steps that matter',
    seoTitle: 'What to Do in an Emergency: First Steps That Matter',
    description:
      'Make it safe, call for help, give the right information, and help others without putting yourself at risk: a clear plan for the first few minutes.',
    seoDescription:
      'What to do in the first minutes of an emergency in India: check safety, call 112 or 108, what to say on the call, how to help others, and your legal protection.',
    category: 'emergency-help',
    tags: ['Emergency', 'First steps', 'Good Samaritan'],
    keywords: ['what to do during an emergency', 'what information to give during an emergency call', 'when to call emergency services', 'how to help someone in an emergency'],
    authorId: 'editorial',
    status: 'published',
    publishedAt: '2026-11-25',
    updatedAt: '2026-11-25',
    related: ['emergency-helpline-numbers-india', 'family-emergency-plan', 'sos-and-trusted-contacts', 'personal-safety-plan'],
    sources: [
      ERSS,
      { title: 'National Disaster Management Authority', publisher: 'Government of India', url: 'https://ndma.gov.in/' },
      { title: 'Motor Vehicles (Amendment) Act, 2019 (Good Samaritan protection, section 134A)', publisher: 'India Code', url: 'https://www.indiacode.nic.in/' },
    ],
    accent: 'red',
    art: '112',
    body: [
      {
        type: 'p',
        text: 'Whether it is an accident, a fire, someone collapsing or a threat to your safety, the first few minutes follow the same pattern: **make it safe, get help, give clear information, then help** if you can do so safely.',
      },
      { type: 'h2', text: '1. Check it is safe' },
      {
        type: 'p',
        text: 'Before going near anyone, look for danger: traffic, fire, smoke, electricity, water, an aggressive person. You cannot help anyone if you are hurt too. If it is not safe, stay back and call for help.',
      },
      { type: 'h2', text: '2. Call for help' },
      {
        type: 'table',
        head: ['Situation', 'Call'],
        rows: [
          ['Any emergency: police, fire or ambulance', '**112**'],
          ['Medical emergency or accident', '**108** (most states) or 112'],
          ['Fire', '**101** or 112'],
          ['Woman in danger or distress', '**181** or 112'],
          ['Child in danger', '**1098** or 112'],
        ],
        caption: 'If a number does not connect, call 112.',
      },
      {
        type: 'p',
        text: 'See the full list of [emergency helpline numbers in India](/blog/emergency-helpline-numbers-india). If there are other people around, point to one person and ask them directly to call: “You in the red shirt, call 108 now.” Everyone assuming someone else has called is a common reason help is delayed.',
      },
      { type: 'h2', text: '3. What to say on the call' },
      {
        type: 'ol',
        items: [
          '**Where you are:** the most important detail. Use a landmark, road, building or shop name, or read out your location from your phone’s map.',
          '**What has happened,** in one sentence.',
          '**How many people are hurt,** and whether they are awake and breathing.',
          '**Any ongoing danger:** fire, gas, an attacker, traffic.',
          '**Your name and number,** and stay on the line until told you can hang up.',
        ],
      },
      { type: 'h2', text: '4. Help, within your limits' },
      {
        type: 'ul',
        items: [
          'Stay with the person, keep them calm and warm, and tell them help is coming.',
          'Do not move someone who may have a neck or back injury unless they are in immediate danger, such as from fire or traffic.',
          'Follow the call-taker’s instructions; they are trained to guide you.',
          'If you have first-aid or CPR training, use it. If you do not, consider taking a course; many hospitals and organisations run them.',
        ],
      },
      {
        type: 'callout',
        tone: 'success',
        title: 'You are protected for helping',
        text: 'Under section 134A of the Motor Vehicles Act, a Good Samaritan who helps an accident victim in good faith is protected from civil and criminal liability, and is not obliged to give their identity. Fear of the police should not stop anyone from helping.',
      },
      { type: 'h2', text: '5. If you are alone' },
      {
        type: 'ul',
        items: [
          'Call 112 and put the phone on speaker so your hands are free.',
          'Alert your trusted contacts with your location in one tap. See [SOS and trusted contacts](/blog/sos-and-trusted-contacts).',
          'If you can, unlock the door or move somewhere responders can reach you.',
          'Fill in your phone’s medical ID now, so responders can see allergies and conditions even when the phone is locked.',
        ],
      },
      { type: 'h2', text: 'Prepare before it happens' },
      {
        type: 'p',
        text: 'Save key numbers, agree a plan with your household, and keep a small kit ready. Our [family emergency plan](/blog/family-emergency-plan) and [personal safety plan](/blog/personal-safety-plan) take an evening and make the first minutes far calmer.',
      },
    ],
    faqs: [
      {
        question: 'What information should I give during an emergency call?',
        answer:
          'Your exact location first, then what happened, how many people are hurt and whether they are breathing, any ongoing danger, and your name and number. Stay on the line until told you can hang up.',
      },
      {
        question: 'Will I get into trouble for helping an accident victim?',
        answer:
          'No. Section 134A of the Motor Vehicles Act protects Good Samaritans who help accident victims in good faith from civil and criminal liability, and they are not obliged to disclose their identity.',
      },
    ],
  },

  /* ---------------------------------------------------------------- private photos shared */
  {
    slug: 'private-photos-shared-without-consent',
    title: 'Private photos shared without consent: how to get them removed',
    seoTitle: 'Private Photos Shared Without Consent? Getting Them Removed',
    description:
      'If intimate images of you have been posted or sent around, here is how to get them taken down, stop them spreading, and report it in India.',
    seoDescription:
      'Intimate photos of you shared online? How to report them for removal, use StopNCII or Take It Down, escalate to grievance officers and file a police complaint.',
    category: 'online-harassment',
    tags: ['Image-based abuse', 'Takedown', 'Intimate images'],
    keywords: ['private photos shared without consent', 'how to remove intimate images', 'report unauthorized images', 'image based abuse India', 'StopNCII'],
    authorId: 'editorial',
    status: 'published',
    publishedAt: '2026-11-25',
    updatedAt: '2026-11-25',
    related: ['someone-threatening-to-leak-photos', 'deepfakes-what-to-do', 'how-to-preserve-digital-evidence', 'how-to-report-cyber-harassment'],
    sources: [
      NCRP,
      { title: 'StopNCII.org (images taken at 18 or older)', publisher: 'Revenge Porn Helpline / SWGfL', url: 'https://stopncii.org/' },
      { title: 'Take It Down (images taken under 18)', publisher: 'National Center for Missing & Exploited Children', url: 'https://takeitdown.ncmec.org/' },
      { title: 'Grievance Appellate Committee', publisher: 'Ministry of Electronics and Information Technology', url: 'https://gac.gov.in/' },
    ],
    accent: 'ink',
    art: 'Take down',
    body: [
      {
        type: 'p',
        text: 'Finding out that intimate images of you have been posted or shared is devastating. It is also **not your fault**, and it is a crime in India. Images can be taken down, and you can stop many of them from being uploaded again. Here is the order to do things in.',
      },
      {
        type: 'callout',
        tone: 'info',
        title: 'Being threatened, not yet shared?',
        text: 'If someone is threatening to share images or demanding money, read [what to do if someone threatens to leak your photos](/blog/someone-threatening-to-leak-photos) first. Do not pay.',
      },
      { type: 'h2', text: '1. Record where it is' },
      {
        type: 'p',
        text: 'For each place the image appears, note the link, the account or group name, and the date. Screenshot the post in a way that shows the account and caption. **Do not forward, download or re-share the images themselves**, even to friends as proof. Platforms and the police can see the content directly from the link. See [how to preserve digital evidence](/blog/how-to-preserve-digital-evidence).',
      },
      { type: 'h2', text: '2. Report it to each platform' },
      {
        type: 'ul',
        items: [
          'Use the report option on the post, message or profile and choose the most specific reason, usually “nudity or sexual content” and “shared without my consent”.',
          'Most major platforms have a dedicated form for non-consensual intimate images in their help centre.',
          'Under India’s IT Rules, platforms must act especially quickly on a complaint from the person shown in intimate or morphed images, and must publish a Grievance Officer’s contact. If the platform does not act, escalate to the Grievance Officer and then the [Grievance Appellate Committee](https://gac.gov.in).',
        ],
      },
      { type: 'h2', text: '3. Stop re-uploads' },
      {
        type: 'p',
        text: '[StopNCII.org](https://stopncii.org) (for images taken when you were 18 or over) and [Take It Down](https://takeitdown.ncmec.org) (under 18) create a digital fingerprint of the image on your own device. Only the fingerprint is shared, and participating platforms use it to block matching uploads. You need a copy of the image on your device, and it only covers participating platforms.',
      },
      { type: 'h2', text: '4. Remove it from search results' },
      {
        type: 'p',
        text: 'Google accepts requests to remove non-consensual explicit images of you from search results. The page may still exist, but it becomes much harder to find. Search for “remove non-consensual explicit images” in Google’s help centre.',
      },
      { type: 'h2', text: '5. Report to the police' },
      {
        type: 'p',
        text: 'File a complaint at [cybercrime.gov.in](https://cybercrime.gov.in), which has a section for crimes against women and children including an option to report sexual content anonymously, or at any police station or cyber cell. Publishing or transmitting intimate images without consent is an offence under the Information Technology Act and the Bharatiya Nyaya Sanhita. See [how to report cyber harassment in India](/blog/how-to-report-cyber-harassment).',
      },
      { type: 'h2', text: 'Morphed or AI-made images' },
      {
        type: 'p',
        text: 'The same routes apply when the image is fake, such as a morphed photo or a deepfake. Say clearly in your report that it is manipulated. See [deepfakes: what to do](/blog/deepfakes-what-to-do).',
      },
      { type: 'h2', text: 'Looking after yourself' },
      {
        type: 'p',
        text: 'Ask one trusted person to help with the reporting so you do not have to keep looking at the content. If you are struggling, the free national mental health helpline, Tele MANAS, is on **14416**. If you are under 18, please tell an adult you trust or call **1098**.',
      },
    ],
    faqs: [
      {
        question: 'How do I get my private photos removed from the internet?',
        answer:
          'Report each post to the platform as non-consensual intimate imagery, escalate to its Grievance Officer if needed, use StopNCII or Take It Down to block re-uploads, ask Google to remove the images from search, and file a complaint at cybercrime.gov.in.',
      },
      {
        question: 'Should I download the images as evidence?',
        answer:
          'No. Record the links, account names and dates and take screenshots that show the account, but do not download or forward the images. Platforms and the police can view them directly from the links.',
      },
    ],
  },

  /* ---------------------------------------------------------------- find blood donors */
  {
    slug: 'how-to-find-blood-donors',
    title: 'How to find blood donors near you in an emergency',
    seoTitle: 'How to Find Blood Donors Near You in an Emergency',
    description:
      'Start with the blood bank, check stock on e-RaktKosh, ask for replacement donation, and reach donors nearby: the fastest routes, in the right order.',
    seoDescription:
      'Need blood urgently? How to check blood bank stock on e-RaktKosh, ask about replacement donation, find donors near the hospital and avoid paid-donor scams.',
    category: 'blood-donation',
    tags: ['Finding donors', 'Blood banks', 'e-RaktKosh'],
    keywords: ['how to find blood donors', 'blood donors near me', 'emergency blood donor', 'blood bank stock', 'eRaktKosh'],
    authorId: 'editorial',
    status: 'published',
    publishedAt: '2026-11-25',
    updatedAt: '2026-11-25',
    related: ['how-to-write-a-blood-request', 'how-to-respond-to-urgent-blood-request', 'blood-group-compatibility-explained', 'introducing-blood-requests'],
    sources: [
      NBTC,
      { title: 'e-RaktKosh: blood stock availability at blood banks', publisher: 'Ministry of Health and Family Welfare', url: 'https://eraktkosh.mohfw.gov.in/' },
    ],
    accent: 'red',
    art: 'Find',
    body: [
      {
        type: 'p',
        text: 'When a doctor says a patient needs blood, families often start by forwarding messages to everyone they know. That can work, but it is rarely the fastest route. Follow these steps in order.',
      },
      { type: 'h2', text: '1. Talk to the hospital’s blood bank first' },
      {
        type: 'p',
        text: 'Ask exactly what is needed: the blood group, the component (whole blood, red cells, platelets or plasma), how many units, and by when. Often the blood bank already has stock and only needs **replacement donors** to give any group later, which means far more people can help.',
      },
      { type: 'h2', text: '2. Check stock at other blood banks' },
      {
        type: 'p',
        text: 'The Ministry of Health’s [e-RaktKosh](https://eraktkosh.mohfw.gov.in) portal and app show blood and component availability at blood banks, searchable by state and district, with each bank’s contact details. Check the “last updated” time, and always call the blood bank before travelling.',
      },
      { type: 'h2', text: '3. Ask donors near the hospital' },
      {
        type: 'ul',
        items: [
          'Post one clear request with the group, units, hospital and a reachable number. Our guide on [how to write a blood request](/blog/how-to-write-a-blood-request) shows exactly what to include.',
          'Share it with people who live near the hospital, not just your own contacts.',
          'Contact local donor groups, colleges and workplaces near the hospital, which often have donor lists.',
          'Use a request with a live status link, so people know when you are covered.',
        ],
      },
      { type: 'h2', text: '4. Know who can donate' },
      {
        type: 'p',
        text: 'Not every group can give to every patient, and the blood bank always cross-matches. See [blood group compatibility](/blog/blood-group-compatibility-explained). For red cells, O negative can be given to most patients in an emergency, which is why O− donors are always in demand.',
      },
      {
        type: 'callout',
        tone: 'warn',
        title: 'Never pay for blood or a donor',
        text: 'Selling blood is illegal in India. If anyone offers blood or a “professional donor” for money, refuse and tell the blood bank. Hospitals may charge standard processing fees for tested blood, but donors are never paid.',
      },
      { type: 'h2', text: '5. Close the loop' },
      {
        type: 'p',
        text: 'As soon as you have what you need, update or close every request you posted. Donors still on their way will thank you.',
      },
      { type: 'h2', text: 'On Sabhijude' },
      {
        type: 'p',
        text: 'A Sabhijude blood request is shown to signed-in members within about 25 km of the hospital you pin, for up to seven days or until you mark it fulfilled. Donors call you directly, and every request has a live status page you can share on WhatsApp. See [how blood requests work](/blog/introducing-blood-requests). If you are the donor, read [how to respond to an urgent blood request](/blog/how-to-respond-to-urgent-blood-request).',
      },
    ],
    faqs: [
      {
        question: 'How can I find a blood donor quickly?',
        answer:
          'Ask the hospital’s blood bank exactly what is needed and whether replacement donors of any group can help, check stock at nearby blood banks on e-RaktKosh, and post one clear request to people near the hospital.',
      },
      {
        question: 'How do I check blood availability at blood banks?',
        answer:
          'The Ministry of Health’s e-RaktKosh portal and app show blood and component stock at blood banks by state and district, with contact details. Check when the stock was last updated and call the blood bank before you travel.',
      },
    ],
  },
];
