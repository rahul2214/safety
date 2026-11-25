import type { BlogPost, Source } from '../types';

/**
 * Phase 3, batch 3 (industry and role guides): factories and warehouses, hospitals and clinics,
 * hotels, restaurants and cafes, retail stores, managers, startups, physical security.
 * Legal references kept general: OSH Code 2020 (consolidates factory safety law), POSH Act 2013.
 * Checked 2026-11-25.
 */

const ERSS: Source = { title: 'Emergency Response Support System (112)', publisher: 'Ministry of Home Affairs', url: 'https://112.gov.in/' };
const NDMA: Source = { title: 'National Disaster Management Authority', publisher: 'Government of India', url: 'https://ndma.gov.in/' };
const LABOUR: Source = { title: 'Ministry of Labour and Employment (labour codes)', publisher: 'Government of India', url: 'https://labour.gov.in/' };
const SHE: Source = { title: 'SHe-Box', publisher: 'Ministry of Women and Child Development', url: 'https://shebox.wcd.gov.in/' };
const MOT: Source = { title: 'Ministry of Tourism', publisher: 'Government of India', url: 'https://tourism.gov.in/' };
const FSSAI: Source = { title: 'Food Safety and Standards Authority of India', publisher: 'Government of India', url: 'https://www.fssai.gov.in/' };
const NMC: Source = { title: 'Ministry of Health and Family Welfare', publisher: 'Government of India', url: 'https://mohfw.gov.in/' };

export const PHASE3_BATCH3_POSTS: BlogPost[] = [
  /* ---------------------------------------------------------------- industrial sites */
  {
    slug: 'industrial-site-safety',
    title: 'Factory, warehouse and construction site safety basics',
    seoTitle: 'Factory, Warehouse and Construction Site Safety Basics',
    description:
      'The essentials for workplaces with machines, vehicles, heights and heavy loads: protective equipment, safe systems of work, training, emergencies and reporting.',
    seoDescription:
      'Safety basics for factories, warehouses and construction sites: protective gear, machines, forklifts, working at height, training, emergencies and reporting.',
    category: 'business-safety',
    tags: ['Factories', 'Warehouses', 'Construction', 'Logistics'],
    keywords: ['warehouse safety', 'manufacturing safety', 'construction site safety', 'factory safety India', 'logistics safety'],
    authorId: 'editorial',
    status: 'published',
    publishedAt: '2026-11-25',
    updatedAt: '2026-11-25',
    related: ['business-risk-assessment', 'workplace-fire-first-aid', 'incident-management-guide', 'business-safety-guide'],
    sources: [LABOUR, NDMA, ERSS],
    accent: 'ink',
    art: 'Site',
    body: [
      {
        type: 'p',
        text: 'Factories, warehouses, construction sites and logistics hubs carry serious physical risks: machines, vehicles, heights, heavy loads and chemicals. India’s Occupational Safety, Health and Working Conditions Code, 2020 consolidates the earlier factory and construction safety laws; check the rules that apply to your establishment and state. These are the basics every site should have.',
      },
      { type: 'h2', text: '1. Assess the risks' },
      {
        type: 'p',
        text: 'Walk the site with supervisors and workers, list the hazards, and fix the highest risks first. See [business safety risk assessment](/blog/business-risk-assessment).',
      },
      { type: 'h2', text: '2. Protective equipment' },
      {
        type: 'ul',
        items: [
          'Helmets, safety shoes, gloves, eye and ear protection, high-visibility clothing, and harnesses for work at height.',
          'Provided free, in the right sizes, and actually worn: supervisors enforce it.',
        ],
      },
      { type: 'h2', text: '3. Safe systems of work' },
      {
        type: 'ul',
        items: [
          'Guards on moving machine parts; lock-out before maintenance.',
          'Marked pedestrian walkways separate from forklifts and vehicles; trained, licensed operators only.',
          'Safe stacking and load limits on racks.',
          'Edge protection, secure scaffolding and harnesses for work at height.',
          'Labelled, safely stored chemicals, with spill kits.',
        ],
      },
      { type: 'h2', text: '4. Training' },
      {
        type: 'p',
        text: 'Induction for every new worker in a language they understand, task-specific training for machines and vehicles, and short daily or weekly safety talks. Contract and daily-wage workers need the same training as permanent staff.',
      },
      { type: 'h2', text: '5. Emergencies' },
      {
        type: 'ul',
        items: [
          'Fire extinguishers, alarms, clear exits and drills. See [workplace fire safety and first aid](/blog/workplace-fire-first-aid).',
          'Trained first-aiders on every shift, and a plan for serious injuries with the nearest hospital.',
          'Emergency numbers displayed: 112, 108, the site supervisor.',
        ],
      },
      { type: 'h2', text: '6. Report and learn' },
      {
        type: 'p',
        text: 'Record every injury and near miss, investigate causes rather than blaming individuals, and share lessons. See [safety incident management](/blog/incident-management-guide). Women workers are protected by the POSH Act on every site.',
      },
    ],
    faqs: [
      {
        question: 'What are the basic safety rules for a factory or warehouse?',
        answer:
          'Assess risks, provide and enforce protective equipment, guard machines, separate pedestrians from forklifts, control work at height and chemicals, train every worker including contract staff, prepare for fires and injuries, and record and learn from incidents.',
      },
    ],
  },

  /* ---------------------------------------------------------------- hospitals */
  {
    slug: 'hospital-clinic-safety',
    title: 'Hospital and clinic safety: staff and patients',
    seoTitle: 'Hospital and Clinic Safety: Protecting Staff and Patients',
    description:
      'Preventing violence against healthcare workers, protecting patients, emergency preparedness, harassment, night shifts and reporting in hospitals and clinics.',
    seoDescription:
      'Safety in hospitals and clinics: preventing violence against staff, patient safety, fire and emergency readiness, harassment, night shifts and reporting.',
    category: 'business-safety',
    tags: ['Hospitals', 'Clinics', 'Healthcare workers', 'Night shifts'],
    keywords: ['hospital safety', 'clinic safety', 'violence against doctors', 'healthcare worker safety'],
    authorId: 'editorial',
    status: 'published',
    publishedAt: '2026-11-25',
    updatedAt: '2026-11-25',
    related: ['night-shift-employee-safety', 'customer-harassment-response', 'workplace-fire-first-aid', 'workplace-harassment-posh'],
    sources: [NMC, NDMA, SHE],
    accent: 'red',
    art: 'Care',
    body: [
      {
        type: 'p',
        text: 'Hospitals and clinics are high-stress places: emergencies, grief, long waits and night shifts. Staff face verbal and physical violence from patients’ relatives; patients, especially women, children and older people, need protection too. Several states have laws protecting healthcare workers from violence; check the law in your state.',
      },
      { type: 'h2', text: '1. Preventing violence against staff' },
      {
        type: 'ul',
        items: [
          'Trained security at emergency, casualty and ICU entrances, especially at night.',
          'Controlled entry: limited attendants per patient, visitor passes.',
          'Clear communication with families: a named person who updates them, so frustration does not build.',
          'De-escalation training for front-line staff.',
          'Panic alarms or a direct line to security in high-risk areas.',
          'Every incident reported and pursued, with the hospital supporting the staff member, including with police complaints.',
        ],
      },
      { type: 'h2', text: '2. Protecting patients' },
      {
        type: 'ul',
        items: [
          'Chaperones for intimate examinations, and women staff present for women patients where needed.',
          'Verified staff, ID badges, and controlled access to wards, especially children’s and maternity wards.',
          'Patient records kept confidential and access logged.',
        ],
      },
      { type: 'h2', text: '3. Harassment and night shifts' },
      {
        type: 'p',
        text: 'Hospitals with ten or more workers need an Internal Committee under the POSH Act, covering harassment by colleagues and by patients or visitors. Night-shift staff need safe rest areas and transport. See [night-shift employee safety](/blog/night-shift-employee-safety) and [customer harassment: how to respond](/blog/customer-harassment-response).',
      },
      { type: 'h2', text: '4. Fire and emergencies' },
      {
        type: 'p',
        text: 'Hospitals have patients who cannot walk, oxygen in use, and electrical equipment everywhere. Fire safety audits, staff trained to evacuate non-ambulatory patients horizontally, and regular drills are essential. See [workplace fire safety and first aid](/blog/workplace-fire-first-aid).',
      },
    ],
    faqs: [
      {
        question: 'How can hospitals prevent violence against doctors and nurses?',
        answer:
          'Trained security at high-risk entrances, controlled visitor entry, a named person updating families, de-escalation training, panic alarms, and reporting and pursuing every incident with full support for the staff member.',
      },
    ],
  },

  /* ---------------------------------------------------------------- hotels */
  {
    slug: 'hotel-business-safety',
    title: 'Hotel safety guide for owners and managers',
    seoTitle: 'Hotel Safety Guide for Owners and Managers',
    description:
      'Keeping guests and staff safe: room security, key control, women guests, fire safety, staff verification, harassment and responding to incidents.',
    seoDescription:
      'Hotel safety for owners and managers: room and key security, protecting women guests, fire safety, staff verification, harassment and incident response.',
    category: 'business-safety',
    tags: ['Hotels', 'Hospitality', 'Guests', 'Staff'],
    keywords: ['hotel safety guide', 'hotel security', 'guest safety', 'hospitality staff safety'],
    authorId: 'editorial',
    status: 'published',
    publishedAt: '2026-11-25',
    updatedAt: '2026-11-25',
    related: ['hotel-safety-tips', 'customer-harassment-response', 'workplace-fire-first-aid', 'business-safety-guide'],
    sources: [MOT, ERSS, SHE],
    accent: 'ink',
    art: 'Guest',
    body: [
      {
        type: 'p',
        text: 'Guests choose hotels they trust, and a single incident can undo years of reputation. Most of hotel safety comes down to controlling access, protecting privacy and being ready for fires.',
      },
      { type: 'h2', text: 'Guest rooms' },
      {
        type: 'ul',
        items: [
          'Working locks, chains or latches, peepholes and window locks in every room.',
          'Room numbers never said aloud at reception; written on the key card holder instead.',
          'Strict key control: duplicate keys only with ID; keys deactivated at checkout.',
          'Staff knock and announce, and never enter an occupied room without consent except in an emergency.',
        ],
      },
      { type: 'h2', text: 'Women and solo guests' },
      {
        type: 'ul',
        items: [
          'Rooms near lifts on lit corridors, not isolated ones, where possible.',
          'Women staff available for room service on request.',
          'Verified cab bookings and safe arrival support for late check-ins.',
        ],
      },
      { type: 'h2', text: 'Staff' },
      {
        type: 'ul',
        items: [
          'Police verification for all staff, including contract housekeeping and security.',
          'A clear code of conduct and training on guest privacy.',
          'Protection for staff from harassment by guests; the POSH Act covers harassment by guests too. See [customer harassment: how to respond](/blog/customer-harassment-response).',
          'Safe transport for staff on late shifts.',
        ],
      },
      { type: 'h2', text: 'Fire safety' },
      {
        type: 'p',
        text: 'Fire safety clearances, smoke detectors in rooms and corridors, evacuation maps on every room door, clear exits, and regular drills for staff. See [workplace fire safety and first aid](/blog/workplace-fire-first-aid).',
      },
      { type: 'h2', text: 'When something goes wrong' },
      {
        type: 'p',
        text: 'A duty manager available 24 hours, a clear process for guest complaints and emergencies, CCTV in common areas with controlled access, and full cooperation with the police. Share [hotel safety tips for travellers](/blog/hotel-safety-tips) with guests, and see the [business safety guide](/blog/business-safety-guide).',
      },
    ],
    faqs: [
      {
        question: 'How can hotels keep guests safe?',
        answer:
          'Good locks and key control, never announcing room numbers, staff who knock and announce, verified staff, support for women and solo guests, fire safety with evacuation maps and drills, and a 24-hour duty manager.',
      },
    ],
  },

  /* ---------------------------------------------------------------- managers */
  {
    slug: 'manager-safety-responsibilities',
    title: 'A manager’s guide to employee safety and incidents',
    seoTitle: 'A Manager’s Guide to Employee Safety and Incidents',
    description:
      'What managers are responsible for: noticing problems, responding when someone raises a concern, handling incidents and emergencies, and protecting the team.',
    seoDescription:
      'What managers must do for employee safety: spot problems early, respond well when someone raises a concern, handle incidents and emergencies, and protect staff.',
    category: 'corporate-safety',
    tags: ['Managers', 'Leadership', 'Incidents', 'Employee safety'],
    keywords: ['manager safety responsibilities', 'workplace incident management', 'employee emergency response', 'how managers handle harassment complaints'],
    authorId: 'editorial',
    status: 'published',
    publishedAt: '2026-11-25',
    updatedAt: '2026-11-25',
    related: ['hr-complaint-handling', 'workplace-safety-culture', 'incident-management-guide', 'corporate-emergency-response-plan'],
    sources: [SHE, LABOUR],
    accent: 'blue',
    art: 'Lead',
    body: [
      {
        type: 'p',
        text: 'For most employees, their manager is the organisation. Whether people feel safe to speak up, and whether problems are fixed, depends heavily on how managers behave day to day.',
      },
      { type: 'h2', text: '1. Notice' },
      {
        type: 'ul',
        items: [
          'Changes in someone’s mood, attendance or performance.',
          'Tension, exclusion or “jokes” within the team.',
          'Unsafe practices: late journeys home, lone working, ignored hazards.',
        ],
      },
      { type: 'h2', text: '2. When someone raises a concern' },
      {
        type: 'ol',
        items: [
          'Listen fully, privately, without judging or minimising.',
          'Thank them for telling you.',
          'Ask about immediate safety and what they need now.',
          'Explain the right route: sexual harassment goes to the Internal Committee; other issues to HR or the speak-up channel.',
          'Pass it on promptly; do not investigate it yourself or confront the person accused.',
          'Protect them from retaliation, and check in afterwards.',
        ],
      },
      {
        type: 'p',
        text: 'See [how HR should handle harassment complaints](/blog/hr-complaint-handling).',
      },
      { type: 'h2', text: '3. Incidents and emergencies' },
      {
        type: 'ul',
        items: [
          'Know your role in the [emergency response plan](/blog/corporate-emergency-response-plan) and where your team assembles.',
          'Keep your team’s emergency contacts current with HR.',
          'Report injuries and near misses through the incident process. See [safety incident management](/blog/incident-management-guide).',
        ],
      },
      { type: 'h2', text: '4. Set the tone' },
      {
        type: 'ul',
        items: [
          'Challenge inappropriate comments in the moment, calmly.',
          'Do not schedule people to work late without a safe way home.',
          'Make it normal to raise problems, and act visibly when they do.',
        ],
      },
      {
        type: 'p',
        text: 'Managers are the backbone of a [workplace safety culture](/blog/workplace-safety-culture).',
      },
    ],
    faqs: [
      {
        question: 'What should a manager do when an employee reports harassment?',
        answer:
          'Listen privately without judging, thank them, check their immediate safety, explain the right route (the Internal Committee for sexual harassment, HR for other issues), pass it on promptly without investigating yourself, and protect them from retaliation.',
      },
    ],
  },

  /* ---------------------------------------------------------------- restaurants */
  {
    slug: 'restaurant-cafe-safety',
    title: 'Restaurant and cafe safety guide',
    seoTitle: 'Restaurant and Cafe Safety Guide for Owners',
    description:
      'Kitchen fires and burns, food safety, gas, late closing, cash, customer harassment and staff safety: a practical guide for restaurants, cafes and food outlets.',
    seoDescription:
      'A safety guide for restaurants and cafes: kitchen fires and gas, burns, food safety, late closing and cash, customer harassment and staff getting home safely.',
    category: 'business-safety',
    tags: ['Restaurants', 'Cafes', 'Kitchens', 'Hospitality'],
    keywords: ['restaurant safety', 'cafe safety', 'kitchen fire safety', 'restaurant staff safety'],
    authorId: 'editorial',
    status: 'published',
    publishedAt: '2026-11-25',
    updatedAt: '2026-11-25',
    related: ['business-safety-guide', 'customer-harassment-response', 'workplace-fire-first-aid', 'business-emergency-plan'],
    sources: [FSSAI, ERSS, NDMA],
    accent: 'coral',
    art: 'Kitchen',
    body: [
      {
        type: 'p',
        text: 'Restaurants combine open flames, gas, hot oil, sharp knives, crowds and late nights. A few routines protect staff and customers and keep the business open.',
      },
      { type: 'h2', text: 'Kitchen and gas' },
      {
        type: 'ul',
        items: [
          'Gas lines and cylinders checked regularly; cylinders stored upright and away from heat.',
          'Exhaust hoods and ducts cleaned to prevent grease fires.',
          'A fire blanket and the right extinguisher near the cooking area; never water on an oil fire.',
          'Staff trained to shut off gas and power quickly.',
          'Non-slip mats and immediate cleaning of spills.',
        ],
      },
      { type: 'h2', text: 'Burns and cuts' },
      {
        type: 'p',
        text: 'Keep a well-stocked first-aid kit with burn dressings, cool burns under running water for at least 10 minutes, and get medical help for serious ones. See [workplace fire safety and first aid](/blog/workplace-fire-first-aid).',
      },
      { type: 'h2', text: 'Food safety' },
      {
        type: 'p',
        text: 'Follow FSSAI licensing and hygiene requirements, train staff on handwashing and storage temperatures, and list allergens where customers can see them.',
      },
      { type: 'h2', text: 'Late closing and cash' },
      {
        type: 'ul',
        items: [
          'At least two staff when closing; lock up before counting cash.',
          'Bank or move cash at varied times.',
          'Safe transport for staff leaving late. See [night-shift employee safety](/blog/night-shift-employee-safety).',
        ],
      },
      { type: 'h2', text: 'Customers' },
      {
        type: 'p',
        text: 'Have a clear policy on abusive or harassing customers and back your staff, especially waitstaff who face comments and touching. See [customer harassment: how to respond](/blog/customer-harassment-response). For the whole business, use the [small business emergency plan](/blog/business-emergency-plan).',
      },
    ],
    faqs: [
      {
        question: 'How can restaurants prevent kitchen fires?',
        answer:
          'Check gas lines and cylinders regularly, clean exhaust hoods and ducts, keep a fire blanket and the right extinguisher near the cooking area, never use water on oil fires, and train staff to shut off gas and power quickly.',
      },
    ],
  },

  /* ---------------------------------------------------------------- retail */
  {
    slug: 'retail-store-safety',
    title: 'Retail store safety: staff and customers',
    seoTitle: 'Retail Store Safety: Protecting Staff and Customers',
    description:
      'Shoplifting and robbery, aggressive customers, crowds and sales, slips and falls, stock storage, cash handling and late shifts: a guide for shops and showrooms.',
    seoDescription:
      'Retail safety for shops and showrooms: robbery and theft, aggressive customers, crowds during sales, slips and stock falls, cash handling and late shifts.',
    category: 'business-safety',
    tags: ['Retail', 'Shops', 'Customers', 'Staff'],
    keywords: ['retail store safety', 'customer safety in retail stores', 'employee safety in retail', 'shop security'],
    authorId: 'editorial',
    status: 'published',
    publishedAt: '2026-11-25',
    updatedAt: '2026-11-25',
    related: ['business-safety-guide', 'customer-harassment-response', 'business-risk-assessment', 'crowd-safety'],
    sources: [ERSS, NDMA, SHE],
    accent: 'blue',
    art: 'Store',
    body: [
      {
        type: 'p',
        text: 'Retail staff are on their feet, dealing with the public all day, often late into the evening. Safety covers theft and robbery, but also everyday hazards and difficult customers.',
      },
      { type: 'h2', text: 'Theft and robbery' },
      {
        type: 'ul',
        items: [
          'Good lighting, clear sightlines and CCTV covering entrances and tills, with visible signs.',
          'Limited cash at the counter; regular, varied banking.',
          'A firm rule: staff never chase or confront thieves, and never resist a robbery. Note descriptions and call 112.',
        ],
      },
      { type: 'h2', text: 'Difficult customers' },
      {
        type: 'p',
        text: 'Train staff to stay calm, set limits, and call a manager; back them when customers become abusive or harass them. See [customer harassment: how businesses should respond](/blog/customer-harassment-response).',
      },
      { type: 'h2', text: 'Crowds and sales' },
      {
        type: 'p',
        text: 'For big sales or launches, plan queues, limit entry, keep exits clear and add staff at pinch points. See [crowd safety](/blog/crowd-safety).',
      },
      { type: 'h2', text: 'Everyday hazards' },
      {
        type: 'ul',
        items: [
          'Heavy items stored low; shelving fixed to walls.',
          'Spills cleaned and marked immediately.',
          'Safe ladders and lifting training for stockrooms.',
          'Clear fire exits, extinguishers and a first-aid kit.',
        ],
      },
      { type: 'h2', text: 'Late shifts' },
      {
        type: 'p',
        text: 'Two people at closing, doors locked before counting cash, and a safe way home for staff. Assess your store with the [business risk assessment](/blog/business-risk-assessment), and see the [business safety guide](/blog/business-safety-guide).',
      },
    ],
    faqs: [
      {
        question: 'How should retail staff respond to a robbery?',
        answer:
          'Never resist or chase. Hand over what is demanded, stay calm, note descriptions, and call 112 once it is safe. Preserve CCTV footage for the police.',
      },
    ],
  },

  /* ---------------------------------------------------------------- startups */
  {
    slug: 'startup-workplace-safety',
    title: 'Workplace safety for startups: the first 10 policies',
    seoTitle: 'Workplace Safety for Startups: The First 10 Policies',
    description:
      'Small teams move fast and skip process. The ten safety basics every startup should have from early on: POSH, conduct, emergencies, travel, data and more.',
    seoDescription:
      'The 10 safety basics every startup in India needs early: POSH committee, code of conduct, speak-up channel, emergency plan, late work, travel and data security.',
    category: 'corporate-safety',
    tags: ['Startups', 'Founders', 'POSH', 'Policies'],
    keywords: ['startup workplace safety', 'POSH for startups', 'workplace safety for startups', 'startup HR policies'],
    authorId: 'editorial',
    status: 'published',
    publishedAt: '2026-11-25',
    updatedAt: '2026-11-25',
    related: ['workplace-harassment-posh', 'company-anonymous-reporting', 'corporate-emergency-response-plan', 'employee-cyber-safety'],
    sources: [SHE, LABOUR],
    accent: 'coral',
    art: '10',
    body: [
      {
        type: 'p',
        text: 'Startups often treat safety and HR policy as something for later. But the first serious incident usually arrives before the first HR hire, and handling it badly can damage a young company badly. These ten basics take a few days to set up.',
      },
      { type: 'h2', text: 'The first 10' },
      {
        type: 'ol',
        items: [
          '**POSH compliance:** a policy, and an Internal Committee once you have ten or more workers (counting interns and contract staff). See [how to report workplace sexual harassment](/blog/workplace-harassment-posh).',
          '**Code of conduct:** respect, harassment, discrimination, alcohol at work events.',
          '**A speak-up channel:** someone other than the founders, and an anonymous option. See [anonymous reporting for companies](/blog/company-anonymous-reporting).',
          '**Emergency plan:** one page, with roles, exits and contacts. See [corporate emergency response plan](/blog/corporate-emergency-response-plan).',
          '**Emergency contacts** for every employee.',
          '**Late work and travel:** safe transport home and a simple travel policy.',
          '**Account security:** two-step verification, a password manager, and offboarding that removes access the same day. See [cyber safety for employees](/blog/employee-cyber-safety).',
          '**Data protection:** collect only what you need about users and staff, and restrict access.',
          '**Office basics:** fire extinguisher, first-aid kit, clear exits.',
          '**Founder behaviour:** founders follow the same rules, and complaints about founders have a route that does not depend on the founders.',
        ],
      },
      {
        type: 'callout',
        tone: 'info',
        title: 'Why it matters early',
        text: 'In small teams, people often do not report problems because the person involved is a founder or the only manager. A route that bypasses them is what makes reporting possible.',
      },
    ],
    faqs: [
      {
        question: 'Do startups need a POSH committee?',
        answer:
          'Yes, once they have ten or more workers, including interns and contract staff, they must constitute an Internal Committee under the POSH Act. Smaller startups are covered by the district Local Committee.',
      },
    ],
  },

  /* ---------------------------------------------------------------- physical security */
  {
    slug: 'workplace-physical-security',
    title: 'Physical security and visitor safety at work',
    seoTitle: 'Physical Security and Visitor Safety at Work',
    description:
      'Access control, visitor management, CCTV, guards, deliveries, after-hours security and handling threats: the physical security basics for offices and campuses.',
    seoDescription:
      'Physical security for offices and campuses: access control, visitor management, CCTV, guards, deliveries, after-hours security and responding to threats.',
    category: 'corporate-safety',
    tags: ['Physical security', 'Visitors', 'Access control', 'Security teams'],
    keywords: ['workplace physical security', 'office visitor safety', 'visitor management', 'access control', 'security guard duties'],
    authorId: 'editorial',
    status: 'published',
    publishedAt: '2026-11-25',
    updatedAt: '2026-11-25',
    related: ['corporate-emergency-response-plan', 'field-delivery-worker-safety', 'night-shift-employee-safety', 'workplace-safety-guide'],
    sources: [ERSS, NDMA],
    accent: 'ink',
    art: 'Access',
    body: [
      {
        type: 'p',
        text: 'Physical security keeps the wrong people out, lets the right people move freely, and makes sure someone notices when something is wrong. It works best when it is consistent and respectful, not intimidating.',
      },
      { type: 'h2', text: '1. Access control' },
      {
        type: 'ul',
        items: [
          'ID cards or access cards for everyone, worn visibly.',
          'Access to sensitive areas limited by role.',
          'Cards deactivated the same day someone leaves.',
          'No tailgating: staff are encouraged to politely check unfamiliar people.',
        ],
      },
      { type: 'h2', text: '2. Visitors' },
      {
        type: 'ul',
        items: [
          'Every visitor registered with ID and the person they are visiting.',
          'Visitor badges, escorts beyond reception, and sign-out.',
          'A host who is responsible for their visitor throughout.',
        ],
      },
      { type: 'h2', text: '3. Deliveries and contractors' },
      {
        type: 'p',
        text: 'A delivery point at reception rather than deliveries to desks, and contractors verified, briefed on rules, and supervised in sensitive areas.',
      },
      { type: 'h2', text: '4. CCTV and guards' },
      {
        type: 'ul',
        items: [
          'Cameras at entrances, car parks and corridors, never in washrooms or changing rooms; footage access restricted and logged.',
          'Guards trained in de-escalation, first aid and the emergency plan, with a supervisor who answers at night. See [delivery and field worker safety](/blog/field-delivery-worker-safety) for guards’ own safety.',
        ],
      },
      { type: 'h2', text: '5. After hours' },
      {
        type: 'p',
        text: 'Know who is in the building late, keep car parks and walkways lit, and give late workers a way to call security and get home safely. See [night-shift employee safety](/blog/night-shift-employee-safety).',
      },
      { type: 'h2', text: '6. Threats' },
      {
        type: 'p',
        text: 'A clear lockdown procedure for an intruder or threat, a way to alert everyone, and coordination with the police on 112. Build this into the [corporate emergency response plan](/blog/corporate-emergency-response-plan).',
      },
    ],
    faqs: [
      {
        question: 'What should an office visitor management process include?',
        answer:
          'Registering every visitor with ID and their host, issuing visible visitor badges, escorting visitors beyond reception, a host responsible for them throughout, and signing out when they leave.',
      },
    ],
  },
];
