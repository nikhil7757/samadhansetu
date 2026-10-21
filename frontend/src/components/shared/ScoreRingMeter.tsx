import { useState } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, AlertTriangle, AlertCircle, Info, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ScoreBreakdownItem {
  key: string;
  label: string;
  score: number; // 0-100
  weight?: number; // e.g. 0.25
  description?: string;
}

interface ScoreRingMeterProps {
  score: number; // 0-100
  title?: string;
  subtitle?: string;
  breakdown?: ScoreBreakdownItem[];
  size?: 'sm' | 'md' | 'lg';
  showBreakdown?: boolean;
  className?: string;
}

export function ScoreRingMeter({
  score = 75,
  title = 'AI Quality Score',
  subtitle = 'Statutory Evaluation Benchmark',
  breakdown = [
    { key: 'clarity', label: 'Outcome Clarity', score: 85, weight: 0.25, description: 'Measurable KPIs and clear problem scope' },
    { key: 'feasibility', label: 'Technical Feasibility', score: 78, weight: 0.25, description: 'Viability under sandbox constraints' },
    { key: 'cost', label: 'Cost Justification', score: 80, weight: 0.20, description: 'Competitive milestone budget structure' },
    { key: 'ip', label: 'IP & Data Terms', score: 72, weight: 0.15, description: 'Compliance with Maharashtra IP safeguards' },
    { key: 'dpiit', label: 'DPIIT Alignment', score: 90, weight: 0.15, description: 'Exemptions under GFR 170 / 173(i)' },
  ],
  size = 'md',
  showBreakdown = true,
  className,
}: ScoreRingMeterProps) {
  const [activeChip, setActiveChip] = useState<ScoreBreakdownItem | null>(null);

  // Normalize score between 0 and 100
  const normalizedScore = Math.min(Math.max(Math.round(score), 0), 100);

  // Color bands
  let bandColor = '#1E9E7A'; // emerald
  let bandBg = 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20';
  let bandLabel = 'Gazette Ready (Passed)';
  let BandIcon = ShieldCheck;

  if (normalizedScore < 50) {
    bandColor = '#D64545'; // crimson
    bandBg = 'bg-danger/10 text-danger border-danger/20';
    bandLabel = 'Rework Required';
    BandIcon = AlertCircle;
  } else if (normalizedScore < 75) {
    bandColor = '#E0A100'; // amber
    bandBg = 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20';
    bandLabel = 'Conditional Review';
    BandIcon = AlertTriangle;
  }

  // Dimensions based on size prop
  const dimensions = {
    sm: { radius: 36, stroke: 6, width: 90, height: 90, textSize: 'text-xl' },
    md: { radius: 52, stroke: 8, width: 130, height: 130, textSize: 'text-3xl' },
    lg: { radius: 70, stroke: 10, width: 170, height: 170, textSize: 'text-4xl' },
  }[size];

  const circumference = 2 * Math.PI * dimensions.radius;
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;

  return (
    <div className={cn('rounded-2xl solid-surface p-4 sm:p-5 transition-all', className)}>
      <div className="flex flex-col sm:flex-row items-center gap-5">
        {/* SVG Radial Meter */}
        <div className="relative flex items-center justify-center shrink-0">
          <svg
            width={dimensions.width}
            height={dimensions.height}
            className="rotate-[-90deg] overflow-visible"
            aria-label={`${title}: ${normalizedScore} out of 100`}
          >
            {/* Background Track */}
            <circle
              cx={dimensions.width / 2}
              cy={dimensions.height / 2}
              r={dimensions.radius}
              stroke="currentColor"
              strokeWidth={dimensions.stroke}
              fill="transparent"
              className="text-muted/60"
            />
            {/* Animated Progress Arc */}
            <motion.circle
              cx={dimensions.width / 2}
              cy={dimensions.height / 2}
              r={dimensions.radius}
              stroke={bandColor}
              strokeWidth={dimensions.stroke}
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ type: 'spring', stiffness: 60, damping: 15 }}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>

          {/* Centered Score Number */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className={cn('font-black font-heading tracking-tight tabular-nums', dimensions.textSize)}>
              {normalizedScore}
            </span>
            <span className="text-[10px] uppercase font-semibold text-muted-foreground -mt-1">/ 100</span>
          </div>
        </div>

        {/* Title, Badge & Explanation */}
        <div className="flex-1 text-center sm:text-left space-y-1.5">
          <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
            <h4 className="text-sm font-bold text-foreground font-heading">{title}</h4>
            <span
              className={cn(
                'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border',
                bandBg
              )}
            >
              <BandIcon className="h-3 w-3" />
              <span>{bandLabel}</span>
            </span>
          </div>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
          <div className="text-[11px] text-muted-foreground flex items-center justify-center sm:justify-start gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            <span>Automated benchmark calculated against MSInS GFR criteria</span>
          </div>
        </div>
      </div>

      {/* Breakdown Chips */}
      {showBreakdown && breakdown && breakdown.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border/70 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-semibold text-muted-foreground">
            <span>Evaluation Criteria Breakdown</span>
            <span>Hover or tap chip for details</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {breakdown.map((item) => {
              const isChipActive = activeChip?.key === item.key;
              const chipColor =
                item.score >= 75
                  ? 'border-emerald-500/30 hover:border-emerald-500'
                  : item.score >= 50
                  ? 'border-amber-500/30 hover:border-amber-500'
                  : 'border-danger/30 hover:border-danger';

              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setActiveChip(isChipActive ? null : item)}
                  onMouseEnter={() => setActiveChip(item)}
                  className={cn(
                    'px-2.5 py-1 rounded-lg text-xs font-medium border bg-secondary/50 hover:bg-secondary transition-all cursor-pointer flex items-center gap-1.5',
                    chipColor,
                    isChipActive && 'bg-primary text-white border-primary shadow-xs font-semibold'
                  )}
                >
                  <span className={isChipActive ? 'text-white' : 'text-foreground'}>{item.label}</span>
                  <span
                    className={cn(
                      'text-[10.5px] font-mono font-bold px-1.5 py-0.2 rounded',
                      isChipActive
                        ? 'bg-white/20 text-white'
                        : item.score >= 75
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        : item.score >= 50
                        ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                        : 'bg-danger/10 text-danger'
                    )}
                  >
                    {item.score}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Chip Details Glass Popover/Drawer */}
          {activeChip && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 p-2.5 rounded-lg glass-surface text-xs space-y-1 border border-border/80"
            >
              <div className="flex items-center justify-between font-semibold">
                <span className="text-foreground">{activeChip.label}</span>
                <span className="font-mono text-primary font-bold">
                  Score: {activeChip.score}/100 {activeChip.weight ? `(Weight: ${activeChip.weight * 100}%)` : ''}
                </span>
              </div>
              {activeChip.description && (
                <p className="text-muted-foreground text-[11px] leading-relaxed">{activeChip.description}</p>
              )}
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}

export default ScoreRingMeter;
