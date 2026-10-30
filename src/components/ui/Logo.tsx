'use client';

import React, { useState, useId } from 'react';

export interface LogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  showWordmark?: boolean;
  useImage?: boolean;
  variant?: 'cyber' | 'shield' | 'vector';
}

export function Logo({
  className = '',
  size = 'md',
  showWordmark = false,
  useImage = true,
  variant = 'cyber',
}: LogoProps) {
  const [imgError, setImgError] = useState(false);
  const reactId = useId().replace(/:/g, '_');

  // Resolve dimension in pixels
  const dim =
    typeof size === 'number'
      ? size
      : size === 'xs'
      ? 26
      : size === 'sm'
      ? 34
      : size === 'md'
      ? 40
      : size === 'lg'
      ? 52
      : 64;

  const glowId = `sabhijude_glow_${reactId}`;

  const shouldRenderImage = useImage && !imgError && variant !== 'vector';
  const imgSrc = variant === 'shield' ? '/logo-shield.png' : '/logo.png';

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {shouldRenderImage ? (
        <img
          src={imgSrc}
          alt="Sabhijude Logo"
          width={dim}
          height={dim}
          onError={() => setImgError(true)}
          className="rounded-full shrink-0 shadow-sm object-cover border border-[#6d4aff]/30 transition-transform duration-300 group-hover:scale-105"
          style={{ width: `${dim}px`, height: `${dim}px` }}
          loading="eager"
        />
      ) : (
        <svg
          width={dim}
          height={dim}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="shrink-0 transition-transform duration-300 group-hover:scale-105"
          aria-label="Sabhijude Logo"
        >
          <defs>
            <filter id={glowId} x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow
                dx="0"
                dy="3"
                stdDeviation="4"
                floodColor="#6d4aff"
                floodOpacity="0.32"
              />
            </filter>
          </defs>

          {/* Outer Protection Ring */}
          <circle
            cx="50"
            cy="50"
            r="46"
            stroke="#6d4aff"
            strokeWidth="3"
            strokeOpacity="0.95"
            filter={`url(#${glowId})`}
          />

          {/* Protective Shield Base */}
          <path
            d="M50 18 L76 28 C76 54 64 72 50 82 C36 72 24 54 24 28 Z"
            fill="#f4f0ff"
            stroke="#6d4aff"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />

          {/* Left Wing (Civilian Peer Community) */}
          <path
            d="M50 48 C42 36 28 35 24 45 C22 55 32 66 42 70 C46 66 48 58 50 48 Z"
            fill="none"
            stroke="#10b981"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M48 55 C40 46 32 46 28 53 C27 59 34 66 42 68"
            fill="none"
            stroke="#10b981"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeOpacity="0.8"
          />

          {/* Right Wing (Campus & Enterprise Dispatch) */}
          <path
            d="M50 48 C58 36 72 35 76 45 C78 55 68 66 58 70 C54 66 52 58 50 48 Z"
            fill="none"
            stroke="#6d4aff"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M52 55 C60 46 68 46 72 53 C73 59 66 66 58 68"
            fill="none"
            stroke="#6d4aff"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeOpacity="0.8"
          />

          {/* Center Blooming Lotus (Dignity & Resilience) */}
          <path
            d="M50 26 C46 34 46 44 50 54 C54 44 54 34 50 26 Z"
            fill="#6d4aff"
          />
          <path
            d="M47 34 C40 37 36 44 42 50 C46 45 47 39 47 34 Z"
            fill="#10b981"
            fillOpacity="0.9"
          />
          <path
            d="M53 34 C60 37 64 44 58 50 C54 45 53 39 53 34 Z"
            fill="#8b5cf6"
            fillOpacity="0.9"
          />

          {/* Central Beacon of Hope */}
          <circle cx="50" cy="46" r="3.5" fill="#ffffff" stroke="#6d4aff" strokeWidth="1" />
        </svg>
      )}

      {showWordmark && (
        <div className="flex flex-col">
          <span className="font-black text-[#16161d] dark:text-[#f4f4f8] text-[16px] sm:text-[17px] tracking-tight leading-none flex items-center gap-1.5">
            Sabhijude
            <span className="h-2 w-2 rounded-full bg-[#10b981] animate-pulse" />
          </span>
          <span className="text-[10px] sm:text-[10.5px] font-semibold text-[#5b5b6e] dark:text-[#a6a6be] tracking-wider uppercase mt-0.5">
            Women Safety Network
          </span>
        </div>
      )}
    </div>
  );
}

export default Logo;
