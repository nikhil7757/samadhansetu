import React from 'react';

interface StateSealProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

/**
 * Official Emblem of Government of Jharkhand (झारखंड सरकार)
 * Features Ashoka Lion Capital inside concentric rings of tribal motifs & Palash flower petals
 */
export function StateSeal({ className = '', size = 'md' }: StateSealProps) {
  const dimension = {
    sm: 'w-7 h-7',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  }[size];

  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 ${dimension} ${className}`} aria-label="झारखंड सरकार • Government of Jharkhand Emblem">
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-xs"
      >
        {/* Outer Circular Ring */}
        <circle cx="50" cy="50" r="47" stroke="currentColor" strokeWidth="2.5" className="text-emerald-800 dark:text-emerald-500" />
        <circle cx="50" cy="50" r="43" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" className="text-amber-600 dark:text-amber-400" />

        {/* Concentric Decorative Band */}
        <circle cx="50" cy="50" r="37" stroke="currentColor" strokeWidth="1.5" className="text-emerald-900/60 dark:text-emerald-400/60" />
        <circle cx="50" cy="50" r="27" fill="currentColor" className="text-emerald-900/10 dark:text-emerald-500/10" stroke="currentColor" strokeWidth="1" />

        {/* Ashoka Pillar Lion Capital Representation */}
        <g className="text-amber-700 dark:text-amber-400" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
          {/* Abacus Base */}
          <rect x="36" y="60" width="28" height="4" rx="1" fill="currentColor" />
          <path d="M40 60 L42 42 L58 42 L60 60 Z" fill="currentColor" fillOpacity="0.15" />

          {/* Central Chakra */}
          <circle cx="50" cy="54" r="3.5" fill="none" strokeWidth="1" />
          <line x1="50" y1="50.5" x2="50" y2="57.5" strokeWidth="0.8" />
          <line x1="46.5" y1="54" x2="53.5" y2="54" strokeWidth="0.8" />

          {/* Three Lions Silhouette */}
          <path d="M45 42 Q50 34 55 42" strokeWidth="1.8" />
          <path d="M48 34 L52 34" strokeWidth="1.5" />
          <circle cx="47" cy="38" r="0.8" fill="currentColor" />
          <circle cx="53" cy="38" r="0.8" fill="currentColor" />
          <path d="M41 44 Q38 38 43 35" strokeWidth="1.5" />
          <path d="M59 44 Q62 38 57 35" strokeWidth="1.5" />
        </g>

        {/* Four Tribal Motifs / Palash Petals on Cardinal Points */}
        <circle cx="50" cy="11" r="2.5" fill="currentColor" className="text-emerald-700 dark:text-emerald-400" />
        <circle cx="50" cy="89" r="2.5" fill="currentColor" className="text-emerald-700 dark:text-emerald-400" />
        <circle cx="11" cy="50" r="2.5" fill="currentColor" className="text-emerald-700 dark:text-emerald-400" />
        <circle cx="89" cy="50" r="2.5" fill="currentColor" className="text-emerald-700 dark:text-emerald-400" />

        {/* Diagonal Petal Dots */}
        <circle cx="22" cy="22" r="1.8" fill="currentColor" className="text-amber-600" />
        <circle cx="78" cy="22" r="1.8" fill="currentColor" className="text-amber-600" />
        <circle cx="22" cy="78" r="1.8" fill="currentColor" className="text-amber-600" />
        <circle cx="78" cy="78" r="1.8" fill="currentColor" className="text-amber-600" />
      </svg>
    </div>
  );
}
