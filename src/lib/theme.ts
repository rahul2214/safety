/**
 * SafeCircle design tokens matching the Stitch design and mobile app 1:1.
 */
export const PALETTE = {
  canvas: '#09090f',
  canvasLight: '#f7f7fa',
  surface: '#141420',
  surfaceLight: '#ffffff',
  surfaceMuted: '#1d1d2c',
  surfaceBorder: '#26263a',
  foreground: '#f4f4f8',
  foregroundLight: '#16161d',
  muted: '#a6a6be',
  mutedLight: '#5b5b6e',
  
  // Brand Hues
  primary: '#6d4aff',
  primaryHover: '#5325e8',
  primarySoft: 'rgba(109, 74, 255, 0.12)',
  accent: '#e0308e',
  accentSoft: 'rgba(224, 48, 142, 0.12)',
  
  // Emergency Red
  danger: '#e11d48',
  dangerBright: '#f43f5e',
  dangerSoft: 'rgba(225, 29, 72, 0.14)',
  
  // Status Colors
  warning: '#fbbf24',
  warningSoft: 'rgba(251, 191, 36, 0.12)',
  success: '#10b981',
  successSoft: 'rgba(16, 185, 129, 0.12)',
  info: '#06b6d4',
  infoSoft: 'rgba(6, 182, 212, 0.12)',
};

export const EMERGENCY_NUMBERS = [
  { name: 'National Emergency', number: '112', icon: 'shield-alert', description: 'Immediate Police / Fire / Ambulance' },
  { name: 'Women Helpline', number: '1091', icon: 'heart-handshake', description: '24/7 dedicated support for women' },
  { name: 'Police Control Room', number: '100', icon: 'badge-alert', description: 'Direct emergency police dispatch' },
  { name: 'Ambulance', number: '108', icon: 'cross', description: 'Emergency medical services' },
];
