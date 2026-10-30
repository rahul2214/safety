# Sabhijude - Women Safety Command Center & Web Portal

A high-reliability safety management web portal and emergency dispatch command center built with Next.js, React, Tailwind CSS, and SignalR.

## 🚀 Features

- **Executive Safety Dashboard**: Real-time situation tracking, active SOS alerts, team readiness, and emergency activity feed.
- **Interactive Live Map**: Leaflet-based geospatial tracking of emergency beacons, patrol units, and safe zones.
- **Incident & SOS Management**: Incident triage, patrol dispatch, evidence collection, and status workflows.
- **Community & Campus Hub**: Safe route navigation, community posts moderation, safety check-ins, and verified alerts.
- **Organizations & Campuses**: Multi-organization hierarchy, campus division, subscription plans, and seat management.
- **Real-Time Telemetry**: Instant alert broadcasting via SignalR push channels.
- **Solid Executive Theme**: High-contrast, clean, and accessible UI without distraction gradients.

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **UI & Components**: [React 19](https://react.dev/), [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Maps**: [Leaflet](https://leafletjs.com/)
- **Real-Time Communication**: [@microsoft/signalr](https://www.npmjs.com/package/@microsoft/signalr)
- **Language**: [TypeScript](https://www.typescriptlang.org/)

## 🏁 Getting Started

### Prerequisites

- Node.js 18.x or 20.x
- npm / yarn / pnpm

### Installation

1. Clone repository:
   ```bash
   git clone https://github.com/rahul2214/safety.git
   cd safety
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Copy `.env.example` to `.env.local` and set your API URLs:
   ```bash
   cp .env.example .env.local
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3002](http://localhost:3002) in your browser.

5. Production Build:
   ```bash
   npm run build
   npm run start
   ```

## 🔒 Security

All environment files (`.env*.local`, credentials, and keys) are kept out of version control via `.gitignore`.
