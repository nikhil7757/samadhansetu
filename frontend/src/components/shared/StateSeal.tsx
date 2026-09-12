import React from 'react';

interface StateSealProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

/**
 * Official Emblem of SamadhanSetu (समाधान सेतु) • Government of Jharkhand
 * 
 * Features:
 * - Sovereign Tri-Ring Seal (Jharkhand Emerald, Imperial Gold & Saffron)
 * - The "Setu" (Civic Suspension & Arch Bridge) bridging citizens to resolution
 * - Radiant 24-Spoked Ashoka Chakra rising above the bridge (representing Jharkhand's 24 districts)
 * - Tribal motifs & Palash flower petal heraldry on the outer crest
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
      aria-label="समाधान सेतु • SamadhanSetu Sovereign Civic Emblem"
    >
      <svg
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-sm select-none"
      >
        <defs>
          {/* Gradients */}
          <linearGradient id="ss-emblem-gold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="50%" stopColor="#D97706" />
            <stop offset="100%" stopColor="#B45309" />
          </linearGradient>

          <linearGradient id="ss-emblem-emerald" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="40%" stopColor="#059669" />
            <stop offset="100%" stopColor="#064E3B" />
          </linearGradient>

          <radialGradient id="ss-sky-glow" cx="50%" cy="40%" r="50%">
            <stop offset="0%" stopColor="#FEF3C7" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#047857" stopOpacity="0.05" />
          </radialGradient>

          <linearGradient id="ss-bridge-grad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#064E3B" />
            <stop offset="50%" stopColor="#059669" />
            <stop offset="100%" stopColor="#34D399" />
          </linearGradient>

          <linearGradient id="ss-ring-metal" x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stopColor="#FDE68A" />
            <stop offset="25%" stopColor="#F59E0B" />
            <stop offset="50%" stopColor="#D97706" />
            <stop offset="75%" stopColor="#FBBF24" />
            <stop offset="100%" stopColor="#92400E" />
          </linearGradient>
        </defs>

        {/* 1. Outer Concentric Shield Ring with Gold Rim */}
        <circle cx="60" cy="60" r="57" fill="url(#ss-emblem-emerald)" stroke="url(#ss-ring-metal)" strokeWidth="3" />
        <circle cx="60" cy="60" r="51.5" stroke="#FDE68A" strokeWidth="0.75" strokeDasharray="2.5 1.5" opacity="0.85" />
        <circle cx="60" cy="60" r="48" fill="#064E3B" stroke="url(#ss-ring-metal)" strokeWidth="1.2" />

        {/* 2. Inner Sky Canvas with Sunburst Radiance */}
        <circle cx="60" cy="60" r="47" fill="url(#ss-sky-glow)" />

        {/* 3. Radiant Ashoka Sun Rays (16 outward subtle rays) */}
        <g stroke="#FDE68A" strokeWidth="0.8" opacity="0.4" strokeLinecap="round">
          <line x1="60" y1="20" x2="60" y2="25" />
          <line x1="60" y1="51" x2="60" y2="47" />
          <line x1="44" y1="36" x2="48" y2="36" />
          <line x1="76" y1="36" x2="72" y2="36" />
          <line x1="49" y1="25" x2="52" y2="28" />
          <line x1="71" y1="25" x2="68" y2="28" />
          <line x1="49" y1="47" x2="52" y2="44" />
          <line x1="71" y1="47" x2="68" y2="44" />
        </g>

        {/* 4. Radiant Ashoka Chakra (24 Districts of Jharkhand) */}
        <g id="ashoka-chakra">
          {/* Chakra Halo Ring */}
          <circle cx="60" cy="36" r="13" fill="#FFFBEB" stroke="url(#ss-ring-metal)" strokeWidth="1.5" />
          <circle cx="60" cy="36" r="11" fill="none" stroke="#047857" strokeWidth="0.75" />
          <circle cx="60" cy="36" r="3.2" fill="#D97706" stroke="#B45309" strokeWidth="0.6" />

          {/* Chakra Spokes (24 Spokes) */}
          <g stroke="#047857" strokeWidth="0.7" opacity="0.85">
            <line x1="60" y1="25" x2="60" y2="47" />
            <line x1="49" y1="36" x2="71" y2="36" />
            <line x1="52.2" y1="28.2" x2="67.8" y2="43.8" />
            <line x1="52.2" y1="43.8" x2="67.8" y2="28.2" />
            {/* Intermediate spokes */}
            <line x1="55.5" y1="25.5" x2="64.5" y2="46.5" strokeWidth="0.5" />
            <line x1="64.5" y1="25.5" x2="55.5" y2="46.5" strokeWidth="0.5" />
            <line x1="49.5" y1="31.5" x2="70.5" y2="40.5" strokeWidth="0.5" />
            <line x1="49.5" y1="40.5" x2="70.5" y2="31.5" strokeWidth="0.5" />
          </g>
        </g>

        {/* 5. The "Setu" (Suspension & Arch Bridge of Governance & Resolution) */}
        <g id="samadhan-setu-bridge">
          {/* Left Civic Pillar */}
          <path d="M28 85 L32 58 L37 58 L41 85 Z" fill="url(#ss-ring-metal)" stroke="#78350F" strokeWidth="0.75" />
          <rect x="27" y="83" width="15" height="3" rx="1" fill="#B45309" />
          <rect x="30" y="56" width="9" height="2.5" rx="0.5" fill="#FDE68A" />

          {/* Right Civic Pillar */}
          <path d="M79 85 L83 58 L88 58 L92 85 Z" fill="url(#ss-ring-metal)" stroke="#78350F" strokeWidth="0.75" />
          <rect x="78" y="83" width="15" height="3" rx="1" fill="#B45309" />
          <rect x="81" y="56" width="9" height="2.5" rx="0.5" fill="#FDE68A" />

          {/* Main Suspension Cable (Catenary curve) */}
          <path
            d="M28 66 Q60 84 92 66"
            fill="none"
            stroke="url(#ss-ring-metal)"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path
            d="M28 66 Q60 84 92 66"
            fill="none"
            stroke="#FFFBEB"
            strokeWidth="0.6"
            opacity="0.8"
          />

          {/* Vertical Stay Cables */}
          <g stroke="#FDE68A" strokeWidth="0.7" opacity="0.75">
            <line x1="44" y1="71" x2="44" y2="79" />
            <line x1="52" y1="74" x2="52" y2="79" />
            <line x1="60" y1="75" x2="60" y2="79" />
            <line x1="68" y1="74" x2="68" y2="79" />
            <line x1="76" y1="71" x2="76" y2="79" />
          </g>

          {/* Horizontal Bridge Deck (The Path of Redressal) */}
          <rect x="20" y="79" width="80" height="4.5" rx="1.5" fill="url(#ss-bridge-grad)" stroke="url(#ss-ring-metal)" strokeWidth="1" />

          {/* Bridge Center Medallion / Keystone */}
          <circle cx="60" cy="81.2" r="2.2" fill="#F59E0B" stroke="#78350F" strokeWidth="0.5" />

          {/* Lower Keystone Arch Support */}
          <path
            d="M34 85 Q60 98 86 85"
            fill="none"
            stroke="url(#ss-ring-metal)"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </g>

        {/* 6. Flanking Palash Petal / Laurel Wreath (State Heritage) */}
        <g id="laurel-palash" fill="url(#ss-emblem-gold)" opacity="0.9">
          {/* Left floral sprays */}
          <path d="M16 50 C18 45 23 48 21 53 C19 54 16 53 16 50 Z" />
          <path d="M14 62 C16 57 21 60 19 65 C17 66 14 65 14 62 Z" />
          <path d="M17 74 C19 69 24 72 22 77 C20 78 17 77 17 74 Z" />

          {/* Right floral sprays */}
          <path d="M104 50 C102 45 97 48 99 53 C101 54 104 53 104 50 Z" />
          <path d="M106 62 C104 57 99 60 101 65 C103 66 106 65 106 62 Z" />
          <path d="M103 74 C101 69 96 72 98 77 C100 78 103 77 103 74 Z" />
        </g>

        {/* 7. Bottom Seal Ribbon Base with "झारखंड • SETU" Inscription */}
        <g id="base-ribbon">
          <path
            d="M38 101 L42 97 L78 97 L82 101 L78 105 L42 105 Z"
            fill="url(#ss-ring-metal)"
            stroke="#78350F"
            strokeWidth="0.8"
          />
          <text
            x="60"
            y="102.5"
            textAnchor="middle"
            fill="#451A03"
            fontSize="5.2"
            fontWeight="900"
            fontFamily="sans-serif"
            letterSpacing="0.8"
          >
            समाधान सेतु
          </text>
        </g>

        {/* 8. Four Cardinal Diamond Motifs (Jharkhand Tribal Art Tradition) */}
        <g fill="#FDE68A">
          <polygon points="60,6 62,9 60,12 58,9" />
          <polygon points="6,60 9,62 12,60 9,58" />
          <polygon points="114,60 111,62 108,60 111,58" />
        </g>
      </svg>
    </div>
  );
}

// Named alias for convenience
export const SamadhanSetuLogo = StateSeal;

