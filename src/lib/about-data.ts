export interface FaqItem {
  question: string;
  answer: string;
}

export const FAQ_LIST: FaqItem[] = [
  {
    question: 'How does Sabhijude keep me anonymous?',
    answer:
      'When you share a safety concern or incident report, your real name, email, and phone number are never displayed on the public feed. Reports are published with privacy masking, and you choose whether to display your display name or post anonymously.',
  },
  {
    question: 'What happens when I trigger the Emergency SOS?',
    answer:
      'A 3-second safety countdown initiates to prevent accidental triggers. Your device’s real-time GPS coordinates are automatically packaged into a high-priority distress alert with a Google Maps pin, dispatched to your trusted contacts via WhatsApp and SMS, and provides one-tap dialing to 112.',
  },
  {
    question: 'How does the fake call exit tool work?',
    answer:
      'It simulates an incoming phone call complete with ringtone, vibration, and an authentic caller ID (e.g. “Mom” or “Dad”). Answering presents an active in-call screen with a timer, giving you a natural, discreet reason to step away from uncomfortable situations.',
  },
  {
    question: 'Does Sabhijude support workplace safety and POSH Act compliance?',
    answer:
      'Yes. Our platform provides comprehensive guidance on the POSH Act 2013 — including Internal Committee (IC) complaint procedures, the 90-day inquiry timeline, employer obligations, and Section 16 confidentiality — alongside relevant Bharatiya Nyaya Sanhita (BNS) provisions.',
  },
  {
    question: 'Is Sabhijude really free to use?',
    answer:
      'Yes, 100% free. Personal safety is a fundamental right. There are no paywalls, commercial advertisements, or data brokers. All emergency SOS tools and safety resources are open to everyone.',
  },
  {
    question: 'Do I need to download a mobile app to use Sabhijude?',
    answer:
      'No installation is required. Sabhijude operates in modern mobile browsers (Chrome, Safari, Firefox, Edge). You can also add it to your home screen as a Progressive Web App (PWA) for instant one-tap emergency access.',
  },
];
