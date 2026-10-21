import React from 'react';
import { PLATFORM_CONFIG } from '@/config/platform';

interface StateSealProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

/**
 * Official Emblem of SamadhanSetu (समाधानसेतू)
 * Maharashtra State Innovation Society (MSInS) • Government of Maharashtra
 * 
 * Features:
 * - Sovereign Double Gold & Deep Indigo Ring Seal
 * - The "Setu" (Innovation Arch & Launchpad) bridging departmental demand to startups
 * - Radiant 36-Pointed Starburst & Ashoka Chakra (representing Maharashtra's 36 districts)
 * - Innovation Gear & Shield Heraldry with Saffron & Forest Green accents
 */
export function StateSeal({ className = '', size = 'md' }: StateSealProps) {
  const dimension = {
    xs: 'w-5 h-5',
    sm: 'w-7 h-7',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
    '2xl': 'w-32 h-32',
  }[size];

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 ${dimension} ${className}`}
      aria-label={`${PLATFORM_CONFIG.fullName} Sovereign Emblem`}
    >
      <svg
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-sm select-none"
      >
        <defs>
          {/* Gradients */}
          <linearGradient id="ns-emblem-gold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="50%" stopColor="#D97706" />
            <stop offset="100%" stopColor="#B45309" />
          </linearGradient>

          <linearGradient id="ns-emblem-royal" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E3A8A" />
            <stop offset="50%" stopColor="#0F172A" />
            <stop offset="100%" stopColor="#0284C7" />
          </linearGradient>

          <radialGradient id="ns-sky-glow" cx="50%" cy="45%" r="55%">
            <stop offset="0%" stopColor="#FEF3C7" stopOpacity="0.45" />
            <stop offset="60%" stopColor="#E0F2FE" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#0F172A" stopOpacity="0.05" />
          </radialGradient>

          <linearGradient id="ns-bridge-grad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#D97706" />
            <stop offset="50%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>

          <linearGradient id="ns-ring-metal" x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stopColor="#FDE68A" />
            <stop offset="25%" stopColor="#F59E0B" />
            <stop offset="50%" stopColor="#D97706" />
            <stop offset="75%" stopColor="#FBBF24" />
            <stop offset="100%" stopColor="#92400E" />
          </linearGradient>
        </defs>

        {/* 1. Outer Concentric Shield Ring with Gold Rim */}
        <circle cx="60" cy="60" r="57" fill="url(#ns-emblem-royal)" stroke="url(#ns-ring-metal)" strokeWidth="3" />
        <circle cx="60" cy="60" r="51.5" stroke="#FDE68A" strokeWidth="0.75" strokeDasharray="3 1.5" opacity="0.85" />
        <circle cx="60" cy="60" r="48" fill="#0B132B" stroke="url(#ns-ring-metal)" strokeWidth="1.2" />

        {/* 2. Inner Sky Canvas */}
        <circle cx="60" cy="60" r="47" fill="url(#ns-sky-glow)" />

        {/* 3. 36 District Beads on Outer Ring (Maharashtra's 36 Districts) */}
        {Array.from({ length: 36 }).map((_, i) => {
          const angle = (i * 360) / 36;
          const rad = (angle * Math.PI) / 180;
          const cx = 60 + 49.8 * Math.cos(rad);
          const cy = 60 + 49.8 * Math.sin(rad);
          return (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r="0.9"
              fill={i % 3 === 0 ? '#F59E0B' : '#93C5FD'}
              opacity="0.9"
            />
          );
        })}

        {/* 4. Ashoka Chakra / Innovation Hub (Center Top) */}
        <g id="ashoka-chakra">
          <circle cx="60" cy="38" r="14" fill="#FFFFFF" stroke="url(#ns-ring-metal)" strokeWidth="1.6" />
          <circle cx="60" cy="38" r="11.5" fill="none" stroke="#1E3A8A" strokeWidth="0.75" />
          <circle cx="60" cy="38" r="3" fill="#D97706" stroke="#B45309" strokeWidth="0.5" />

          {/* 24 Spoked Core Wheel */}
          <g stroke="#1E3A8A" strokeWidth="0.7" opacity="0.85">
            {Array.from({ length: 24 }).map((_, idx) => {
              const rad = ((idx * 15) * Math.PI) / 180;
              const x2 = 60 + 11.5 * Math.sin(rad);
              const y2 = 38 - 11.5 * Math.cos(rad);
              return <line key={idx} x1="60" y1="38" x2={x2} y2={y2} />;
            })}
          </g>
        </g>

        {/* 5. The "Setu" (Suspension Arch Bridge & Innovation Gateway) */}
        <g id="setu-gateway">
          {/* Main Suspension Arc */}
          <path
            d="M 22 76 Q 60 48 98 76"
            stroke="url(#ns-emblem-gold)"
            strokeWidth="3.2"
            fill="none"
            strokeLinecap="round"
          />

          {/* Secondary Support Cable */}
          <path
            d="M 25 79 Q 60 54 95 79"
            stroke="#93C5FD"
            strokeWidth="1.2"
            fill="none"
            opacity="0.7"
          />

          {/* Suspension Cables */}
          <g stroke="#FDE68A" strokeWidth="0.7" opacity="0.75">
            <line x1="32" y1="71" x2="32" y2="82" />
            <line x1="42" y1="62" x2="42" y2="82" />
            <line x1="52" y1="56" x2="52" y2="82" />
            <line x1="60" y1="54" x2="60" y2="82" />
            <line x1="68" y1="56" x2="68" y2="82" />
            <line x1="78" y1="62" x2="78" y2="82" />
            <line x1="88" y1="71" x2="88" y2="82" />
          </g>

          {/* Roadway / Pipeline Deck */}
          <path
            d="M 20 82 L 100 82"
            stroke="url(#ns-ring-metal)"
            strokeWidth="2.8"
            strokeLinecap="round"
          />
          <path
            d="M 22 84 L 98 84"
            stroke="#059669"
            strokeWidth="1.5"
            strokeLinecap="round"
          />

          {/* Pier Foundations */}
          <rect x="29" y="82" width="6" height="10" rx="1" fill="#1E293B" stroke="#D97706" strokeWidth="0.8" />
          <rect x="85" y="82" width="6" height="10" rx="1" fill="#1E293B" stroke="#D97706" strokeWidth="0.8" />
        </g>

        {/* 6. Base Ribbon with Saffron & Green Accent */}
        <path
          d="M 32 96 Q 60 99 88 96 L 85 101 Q 60 104 35 101 Z"
          fill="url(#ns-ring-metal)"
          stroke="#78350F"
          strokeWidth="0.5"
        />

        {/* Text Ribbon */}
        <text
          x="60"
          y="100.5"
          fill="#1E1B4B"
          fontSize="4.8"
          fontWeight="900"
          fontFamily="system-ui, -apple-system, sans-serif"
          textAnchor="middle"
          letterSpacing="0.8"
        >
          {`${PLATFORM_CONFIG.name.toUpperCase()} • MSInS`}
        </text>
      </svg>
    </div>
  );
}

export default StateSeal;
