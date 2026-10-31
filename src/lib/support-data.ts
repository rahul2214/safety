export interface SupportFaq {
  q: string;
  a: string;
}

export const FAQS: SupportFaq[] = [
  {
    q: 'How does Sabhijude protect my personal privacy when I submit a report?',
    a: 'When you choose "Report Anonymously", all personally identifying markers (your name, email address, IP address, and phone number) are stripped from the record before submission. The triage officer only sees the incident category, approximate timeframe, and description.',
  },
  {
    q: 'What happens immediately after I activate Emergency SOS?',
    a: 'The portal captures your current GPS coordinates, arms the live tracking telemetry, and dispatches high-priority SMS and WhatsApp alerts to your verified trusted contacts. If configured, you can also dial 112 directly.',
  },
  {
    q: 'Are incident locations shown on the public safety map?',
    a: 'No. Exact individual coordinates are never publicly plotted. Incident reports are aggregated into broad geographic zones (minimum 250m radii) to protect survivor anonymity and prevent pattern identification.',
  },
  {
    q: 'How quickly does the safety triage team review submitted reports?',
    a: 'Reports categorized as Immediate Danger or Threat are evaluated within 15–30 minutes. Non-urgent community infrastructure hazards (e.g. broken streetlights) are processed during standard municipal review shifts within 24 hours.',
  },
  {
    q: 'Can I delete or withdraw a filed report?',
    a: 'Yes. Open My Posts and tap the bin icon on the report, or open it and choose Delete post. Deleting is permanent. If the issue has been sorted out, you can choose Mark as resolved instead to keep it visible to others.',
  },
];
