export interface SafetyGuide {
  id: string;
  title: string;
  category:
    | 'Emergency Help'
    | 'Online Safety'
    | 'Travel Safety'
    | 'Workplace Safety'
    | 'College Safety'
    | 'Reporting Guidance'
    | 'Privacy & Security';
  readTime: string;
  summary: string;
  actionSteps: string[];
  helpline?: string;
  keyRule: string;
}

export const RESOURCES_DATA: SafetyGuide[] = [
  {
    id: 'guide-posh',
    title: 'The POSH Act, 2013: Your Complete Legal Workplace Protections in India',
    category: 'Workplace Safety',
    readTime: '6 min read',
    summary: 'A definitive guide to the Sexual Harassment of Women at Workplace Act, 2013. Explains mandatory Internal Committees (IC), 90-day inquiry deadlines, interim relief rights, and penalty clauses for employers.',
    keyRule: 'Every organization with 10+ employees must maintain an IC with 50%+ women members. You have a legal right to up to 3 months paid interim leave during inquiries.',
    actionSteps: [
      'Document evidence contemporaneously: Record exact dates, times, direct quotes, and witnesses immediately in your private Sabhijude log.',
      'Submit written complaint within 3 months to the IC Presiding Officer (or District Local Committee if against the employer or in a small firm).',
      'Request interim relief: Complainants can legally request transfer of respondent, transfer to another department, or up to 3 months paid leave without using annual quota.',
      'Inquiry must conclude within 90 days: Employer is legally bound to implement IC recommendations within 60 days of the report.',
      'Section 16 Confidentiality: Publication or sharing of complainant identity, witness testimonies, or case files is strictly prohibited under penalty of law.',
    ],
    helpline: '181 / 1091 / NCW: 7827170170',
  },
  {
    id: 'guide-helplines-india',
    title: 'Official India Emergency Helplines: How ERSS 112, 1091, 181 & 1930 Operate',
    category: 'Emergency Help',
    readTime: '4 min read',
    summary: 'Directory and operational breakdown of Government of India emergency response infrastructure. Explains the difference between police rapid patrol, confidential crisis counseling, and cyber reporting.',
    keyRule: 'Dial 112 for immediate physical life-threatening danger. Dial 1091 for women police patrol, 181 for domestic counseling, and 1930 for online cyber crimes.',
    actionSteps: [
      'Dial 112 for All-in-One ERSS: Connects directly to state police control rooms with automated cellular tower triangulation.',
      'Dial 1091 for Dedicated Women Police: Dispatches specialized mobile PCR vans with female personnel.',
      'Dial 181 for Women in Distress: Ministry of WCD helpline providing shelter, psychological counseling, and legal aid.',
      'Dial 1090 for Women Power Line: Handles obscene calls, eve-teasing, and physical stalking with non-disclosure of victim identity.',
      'Dial 1930 / Visit cybercrime.gov.in: Instant freeze on cyber fraud and reporting of morphed photos, online blackmail, and doxxing.',
    ],
    helpline: '112 (National ERSS)',
  },
  {
    id: 'guide-night-shift',
    title: 'Night Shift & Commute Regulations: Mandatory Cab Escorts & Labor Laws',
    category: 'Workplace Safety',
    readTime: '4 min read',
    summary: 'Statutory requirements under the Factories Act and State Shops & Establishments rules governing women working shifts between 8:00 PM and 6:00 AM.',
    keyRule: 'Employers are legally mandated to provide door-to-door transportation with GPS tracking and security escorts for late-night female staff.',
    actionSteps: [
      'Verify company-provided transportation: Must be door-to-door (no dropping at main roads or isolated junctions).',
      'Security escort requirement: If you are the first passenger picked up or last dropped off, a vetted security guard must accompany the cab.',
      'Check cab safety equipment: Vehicle must have working GPS tracking, child-lock disabled, and driver identification displayed.',
      'Woman supervisor on floor: Establishments operating night shifts must have female supervisors and secure rest facilities.',
      'Report transport violations: Any drop-off violation can be formally escalated to the Labour Commissioner and internal safety ombudsman.',
    ],
    helpline: '112 / 1091',
  },
  {
    id: 'guide-bns-penal',
    title: 'Bharatiya Nyaya Sanhita (BNS) & IPC: Criminal Sanctions for Harassment & Stalking',
    category: 'Reporting Guidance',
    readTime: '5 min read',
    summary: 'Essential criminal law sections under the newly enacted Bharatiya Nyaya Sanhita (BNS), replacing the Indian Penal Code (IPC), specifically Sections 75, 78, and 79.',
    keyRule: 'Stalking (BNS Sec 78) and Words/Gestures insulting modesty (BNS Sec 79) are cognizable criminal offenses punishable with rigorous imprisonment.',
    actionSteps: [
      'BNS Section 75 (Sexual Harassment): Unwelcome physical contact, demands for sexual favors, or showing pornography is punishable by up to 3 years imprisonment.',
      'BNS Section 78 (Stalking): Physical following or electronic monitoring of internet, email, or social media carries 3–5 years imprisonment upon conviction.',
      'BNS Section 79 (Insult to Modesty): Uttering words, making gestures, or intrusive exhibition in person or digitally is punishable by up to 3 years imprisonment.',
      'Zero FIR right: You can register a First Information Report (FIR) at ANY police station regardless of jurisdictional boundaries.',
      'Mandatory female officer recording: Statements of women survivors must legally be recorded by a woman police officer.',
    ],
    helpline: '112 / 1091',
  },
  {
    id: 'guide-college-safety',
    title: 'UGC Regulations on Campus Safety & Anti-Ragging Protocols',
    category: 'College Safety',
    readTime: '4 min read',
    summary: 'University Grants Commission (UGC) mandatory directives for student safety in colleges, hostels, universities, and coaching hubs.',
    keyRule: 'Ragging is a non-bailable criminal offense. Every higher education institution must maintain an active 24/7 Anti-Ragging Squad and Internal Complaints Committee.',
    actionSteps: [
      'Know the 24/7 National Anti-Ragging Helpline: Dial 1800-180-5522 (toll-free) or email helpline@antiragging.in.',
      'Campus Internal Complaints Committee: Students have the right to file POSH complaints against faculty, administration, or fellow students.',
      'Hostel security audits: Mandatory CCTV coverage at campus gates, boundary perimeter lighting, and vetted security guards.',
      'Counseling cells: Universities are mandated to provide confidential mental health and trauma support services.',
      'Escalate to District Magistrate: If an institution suppresses student complaints, escalate directly to the District Collector or NCW.',
    ],
    helpline: 'Anti-Ragging: 1800-180-5522',
  },
  {
    id: 'guide-digital-doxxing',
    title: 'Cyber Blackmail, Non-Consensual Imagery & Doxxing Defense',
    category: 'Online Safety',
    readTime: '5 min read',
    summary: 'A forensic guide to protecting yourself against deepfakes, morphed imagery, online blackmail, and harassment under the IT Act Section 66E & 67.',
    keyRule: 'Never pay extortion demands. Take timestamped evidence immediately and report directly to 1930 and the StopNCII.org hashing platform.',
    actionSteps: [
      'Preserve digital forensics: Capture full URL links, phone numbers, UPI handles, and message headers before accounts are deleted.',
      'Hash images with StopNCII.org: Generates unique digital fingerprints from your device to prevent non-consensual images from circulating on major tech platforms.',
      'Lodge complaint on cybercrime.gov.in: Select "Report Crime Against Women/Children" for immediate triage and takedown notices.',
      'Report to platform grievance officers: Indian IT Rules mandate social media platforms remove non-consensual sexual content within 24 hours of notice.',
      'Lock down connected accounts: Enable hardware/app-based 2-Factor Authentication (2FA) and revoke third-party app permissions.',
    ],
    helpline: '1930 (National Cyber Crime)',
  },
];
