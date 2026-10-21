import React, { useState } from 'react';
import {
  FileEdit,
  CheckCircle2,
  Compass,
  FileCheck2,
  Award,
  PenTool,
  FileSignature,
  Activity,
  ShieldCheck,
  CreditCard,
  TrendingUp,
  Clock,
  Building2,
  Calendar,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ProcurementStageInfo {
  step: number;
  name: string;
  shortName: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  custodian: string;
}

export const PROCUREMENT_STAGES: ProcurementStageInfo[] = [
  { step: 1, name: 'Challenge Drafted', shortName: 'Drafted', icon: FileEdit, description: 'Department outlines outcome KPIs, budget range, and IP terms.', custodian: 'Originating Department Nodal Officer' },
  { step: 2, name: 'Approved & Published', shortName: 'Published', icon: CheckCircle2, description: 'MSInS validates quality score and releases challenge publicly.', custodian: 'Maharashtra State Innovation Society' },
  { step: 3, name: 'Startup Discovery', shortName: 'Discovery', icon: Compass, description: 'Startups discover open demand and prepare technical proposals.', custodian: 'Open Startup Marketplace' },
  { step: 4, name: 'Eligibility Screening', shortName: 'Screening', icon: FileCheck2, description: 'Automated DPIIT turnover/experience relaxations verified.', custodian: 'DPIIT Regulatory Rule Engine' },
  { step: 5, name: 'Expert Evaluation', shortName: 'Evaluation', icon: Award, description: 'Independent panel scores proposals across 6 weighted criteria.', custodian: 'Empanelled Expert Committee' },
  { step: 6, name: 'Pilot Design', shortName: 'Pilot Design', icon: PenTool, description: 'Sandbox scope, telemetry KPIs, and milestones structured.', custodian: 'Joint Department–Startup Working Group' },
  { step: 7, name: 'Contract Signed', shortName: 'Contracted', icon: FileSignature, description: 'Tripartite agreement executed with statutory safe harbour.', custodian: 'MSInS Legal & Department Directorate' },
  { step: 8, name: 'Pilot Running', shortName: 'Running', icon: Activity, description: 'Startup executes field deployment in controlled sandbox.', custodian: 'Field Engineering Squad & Startup Team' },
  { step: 9, name: 'Independent Validation', shortName: 'Validation', icon: ShieldCheck, description: 'Third-party auditor certifies outcome KPI benchmark data.', custodian: 'Third-Party Quality Audit Bureau (e.g. VJTI)' },
  { step: 10, name: 'Payment Released', shortName: 'Payment', icon: CreditCard, description: 'Milestone grant disbursed with delay monitoring SLA clock.', custodian: 'State Finance & Treasury Escrow Desk' },
  { step: 11, name: 'Scale-up Decision', shortName: 'Scale-up', icon: TrendingUp, description: 'Verdict recorded: Statewide Scale (GFR 194), Extend, or Stop.', custodian: 'MSInS Governing Committee' },
];

interface HorizontalStepTrackerProps {
  currentStageNumber?: number; // 1 to 11
  currentStageName?: string;
  history?: Array<{
    stage?: string;
    actor?: string;
    timestamp?: string;
    note?: string;
  }>;
  submittedAt?: string;
  department?: string;
  district?: string;
  daysSinceApproval?: number;
  totalBudget?: number;
  disbursedBudget?: number;
  agreementRef?: string;
  status?: string;
  aiScore?: number;
}

export function HorizontalStepTracker({
  currentStageNumber = 8,
  currentStageName = 'Pilot Running',
  history = [],
  submittedAt = new Date().toISOString(),
  department = 'Department of Agriculture',
  district = 'Nashik',
  daysSinceApproval = 3,
  totalBudget = 16.5,
  disbursedBudget = 6.6,
  agreementRef = 'AGR-MSINS-2026-089',
}: HorizontalStepTrackerProps) {
  // Map legacy complaint status or resolve stage index
  let activeIndex = currentStageNumber - 1;
  if (activeIndex < 0) activeIndex = 0;
  if (activeIndex > 10) activeIndex = 10;

  const [selectedStageIndex, setSelectedStageIndex] = useState<number>(activeIndex);

  const activeStage = PROCUREMENT_STAGES[activeIndex] || PROCUREMENT_STAGES[0];
  const inspectedStage = PROCUREMENT_STAGES[selectedStageIndex] || activeStage;

  // SLA payment timer computation
  const isPaymentPending = activeIndex === 9 || daysSinceApproval > 0;
  const isDelayed = daysSinceApproval > 14;

  return (
    <div className="w-full rounded-2xl border border-border/80 bg-card p-4 sm:p-6 shadow-sm">
      {/* Header telemetry summary */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-border/60">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase bg-primary/10 text-primary border border-primary/20">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              Stage {activeStage.step} of 11: {activeStage.name}
            </span>
            <span className="text-xs text-muted-foreground font-mono">
              Ref: {agreementRef}
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-foreground">
            Procurement Lifecycle Pathway
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Legally compliant innovation pathway from challenge identification to statewide scale.
          </p>
        </div>

        {/* Timers & Turnaround SLA Pill */}
        <div className="flex items-center gap-3 bg-secondary/50 rounded-xl p-2.5 border border-border/60 text-xs">
          <div className="flex items-center gap-2 pr-3 border-r border-border">
            <Clock className={cn('h-4 w-4', isDelayed ? 'text-destructive animate-bounce' : 'text-amber-500')} />
            <div>
              <div className="text-[10px] text-muted-foreground font-semibold uppercase">Payment Turnaround</div>
              <div className={cn('font-bold font-mono', isDelayed ? 'text-destructive font-black' : 'text-foreground')}>
                {daysSinceApproval} days since approval {isDelayed && '⚠️ Over SLA'}
              </div>
            </div>
          </div>
          <div className="pl-1">
            <div className="text-[10px] text-muted-foreground font-semibold uppercase">Disbursed Grant</div>
            <div className="font-bold text-foreground font-mono">
              ₹{disbursedBudget}L / ₹{totalBudget}L
            </div>
          </div>
        </div>
      </div>

      {/* 11-Stage Step Progress Stepper */}
      <div className="pt-6 pb-4">
        {/* Mobile Horizontal Scroll Container */}
        <div className="overflow-x-auto pb-3 scrollbar-thin">
          <div className="min-w-[850px] relative">
            {/* Background connecting track */}
            <div className="absolute top-5 left-4 right-4 h-1 bg-secondary rounded-full -z-0" />
            {/* Active connecting track */}
            <div
              className="absolute top-5 left-4 h-1 bg-gradient-to-r from-emerald-500 via-primary to-sky-500 rounded-full transition-all duration-500 -z-0"
              style={{
                width: `${(activeIndex / (PROCUREMENT_STAGES.length - 1)) * 96}%`,
              }}
            />

            <div className="grid grid-cols-11 gap-1 relative z-10">
              {PROCUREMENT_STAGES.map((st, idx) => {
                const Icon = st.icon;
                const isCompleted = idx < activeIndex;
                const isCurrent = idx === activeIndex;
                const isSelected = idx === selectedStageIndex;

                return (
                  <button
                    key={st.step}
                    type="button"
                    onClick={() => setSelectedStageIndex(idx)}
                    className={cn(
                      'flex flex-col items-center group cursor-pointer focus:outline-hidden text-center transition-all p-1 rounded-xl',
                      isSelected ? 'bg-secondary/80 ring-1 ring-primary/40' : 'hover:bg-secondary/40'
                    )}
                    aria-label={`Step ${st.step}: ${st.name}`}
                  >
                    <div
                      className={cn(
                        'h-9 w-9 rounded-full flex items-center justify-center transition-all duration-200 border-2 text-xs font-bold shadow-xs',
                        isCompleted
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : isCurrent
                          ? 'bg-primary border-primary text-primary-foreground ring-4 ring-primary/20 scale-110'
                          : 'bg-card border-muted text-muted-foreground group-hover:border-foreground/30'
                      )}
                    >
                      {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                    </div>

                    <div className="mt-2 flex flex-col items-center">
                      <span className="text-[10px] font-mono text-muted-foreground font-semibold">
                        0{st.step}
                      </span>
                      <span
                        className={cn(
                          'text-[11px] leading-tight font-medium line-clamp-1 max-w-[70px]',
                          isCurrent
                            ? 'text-primary font-bold'
                            : isCompleted
                            ? 'text-foreground font-semibold'
                            : 'text-muted-foreground'
                        )}
                      >
                        {st.shortName}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Inspected Stage Detail Dossier Card */}
      <div className="mt-4 rounded-xl border border-primary/20 bg-primary/5 p-4 transition-all">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-primary/10">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-xs shrink-0">
              {React.createElement(inspectedStage.icon, { className: 'h-5 w-5' })}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-primary uppercase tracking-wider font-mono">
                  Stage 0{inspectedStage.step}
                </span>
                {selectedStageIndex === activeIndex && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                    CURRENT STATE
                  </span>
                )}
                {selectedStageIndex < activeIndex && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                    COMPLETED
                  </span>
                )}
              </div>
              <h4 className="text-sm sm:text-base font-bold text-foreground">
                {inspectedStage.name}
              </h4>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Building2 className="h-3.5 w-3.5 text-primary shrink-0" />
            <span className="font-medium text-foreground">{inspectedStage.custodian}</span>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-muted-foreground mt-2 leading-relaxed">
          {inspectedStage.description}
        </p>

        {/* Historic note for this step if available */}
        {(() => {
          const matchingHistory = history.find(
            (h) => h.stage?.toLowerCase() === inspectedStage.name.toLowerCase() || h.stage?.toLowerCase() === inspectedStage.shortName.toLowerCase()
          );
          if (matchingHistory) {
            return (
              <div className="mt-3 pt-3 border-t border-primary/10 flex items-start gap-2 text-xs">
                <span className="font-bold text-primary shrink-0">Audit Record:</span>
                <span className="text-foreground/90 font-mono text-[11px]">
                  "{matchingHistory.note}" — <span className="text-muted-foreground">({matchingHistory.actor}, {matchingHistory.timestamp})</span>
                </span>
              </div>
            );
          }
          return null;
        })()}
      </div>
    </div>
  );
}

export default HorizontalStepTracker;
