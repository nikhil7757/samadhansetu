import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  ChevronDown,
  ChevronUp,
  ExternalLink,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ProcurementStage {
  step: number;
  name: string;
  shortName: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  custodian: string;
  slaDays: number;
  statutoryRef: string;
  deliverables: string[];
}

export const PROCUREMENT_STAGES: ProcurementStage[] = [
  {
    step: 1,
    name: 'Problem Formulation',
    shortName: 'Problem',
    icon: FileEdit,
    description: 'Department nodal officer defines outcome KPIs, problem statement, and budget estimate.',
    custodian: 'Originating Department Nodal Officer',
    slaDays: 7,
    statutoryRef: 'MSInS Rule 4.1 — Outcome-Based Challenge Specification',
    deliverables: ['Problem Dossier', 'Baseline Metric Log', 'Directorate Sanction'],
  },
  {
    step: 2,
    name: 'MSInS Publication',
    shortName: 'Published',
    icon: CheckCircle2,
    description: 'Innovation Society conducts AI quality audit, validates baseline, and gazettes open challenge.',
    custodian: 'Maharashtra State Innovation Society (MSInS)',
    slaDays: 5,
    statutoryRef: 'MSInS Gazette Resolution 2026/GOM/INV',
    deliverables: ['AI Quality Clearance (Score ≥ 70)', 'Open Tender Gazette Notice'],
  },
  {
    step: 3,
    name: 'Startup Discovery',
    shortName: 'Discovery',
    icon: Compass,
    description: 'DPIIT/MSInS registered startups discover challenge and draft innovative technical proposals.',
    custodian: 'Open Startup Marketplace & Registry',
    slaDays: 21,
    statutoryRef: 'Maharashtra Innovative Startup Policy 2025-30',
    deliverables: ['Technical Pitch Deck', 'TRL 5+ Working Demo', 'Architecture Note'],
  },
  {
    step: 4,
    name: 'Eligibility Screening',
    shortName: 'Eligibility',
    icon: FileCheck2,
    description: 'Automated verification of DPIIT recognition and turnover/prior experience exemptions.',
    custodian: 'Automated DPIIT & MCA Regulatory Engine',
    slaDays: 3,
    statutoryRef: 'GFR 2017 Rule 170 / 173(i) Turnover & Prior Exp Exemptions',
    deliverables: ['DPIIT Certificate Verification', 'Solvency & Cyber Undertaking'],
  },
  {
    step: 5,
    name: 'Expert Evaluation',
    shortName: 'Evaluation',
    icon: Award,
    description: 'Empanelled independent committee scores proposals across 5 weighted statutory criteria.',
    custodian: 'Empanelled Technical Evaluation Committee',
    slaDays: 14,
    statutoryRef: 'GFR 2017 Rule 192 (Quality & Cost Based Selection)',
    deliverables: ['Weighted Scorecard (Min 75/100)', 'Technical Committee Recommendation'],
  },
  {
    step: 6,
    name: 'Sandbox & Pilot Design',
    shortName: 'Sandbox',
    icon: PenTool,
    description: 'Joint department-startup team defines sandbox perimeter, test data covenants, and success KPIs.',
    custodian: 'Joint Technical Taskforce (Dept + Startup)',
    slaDays: 14,
    statutoryRef: 'Maharashtra Regulatory Sandbox Framework Sec 12',
    deliverables: ['Sandbox Protocol', 'Data Privacy Agreement', 'Failure Fallback Plan'],
  },
  {
    step: 7,
    name: 'Tripartite Contract',
    shortName: 'Contracted',
    icon: FileSignature,
    description: 'Binding agreement executed between Department, Startup, and MSInS with IP protection.',
    custodian: 'State Legal Directorate & MSInS',
    slaDays: 10,
    statutoryRef: 'Standard Model Pilot Agreement (Govt of Maharashtra)',
    deliverables: ['Signed Tripartite Agreement', 'IP Assignment Schedule', 'Escrow Mandate'],
  },
  {
    step: 8,
    name: 'Pilot Running',
    shortName: 'Running',
    icon: Activity,
    description: 'Field execution of pilot within municipal/district perimeter with telemetry streaming.',
    custodian: 'District Field Engineering Unit & Startup',
    slaDays: 90,
    statutoryRef: 'Live Deployment Protocol & Safety Clearance',
    deliverables: ['Bi-Weekly Telemetry Logs', 'Field Trial Logs', 'Citizen Feedback Report'],
  },
  {
    step: 9,
    name: 'Independent Validation',
    shortName: 'Validation',
    icon: ShieldCheck,
    description: 'Accredited third-party quality bureau (e.g., VJTI, IIT-B, COEP) audits trial metrics against KPIs.',
    custodian: 'Third-Party Quality Assurance Bureau',
    slaDays: 15,
    statutoryRef: 'ISO 17025 / NABL / State QA Bureau Mandate',
    deliverables: ['Empirical Audit Report', 'KPI Achievement Certificate', 'Security Vulnerability Sign-off'],
  },
  {
    step: 10,
    name: 'Milestone Payment',
    shortName: 'Payment',
    icon: CreditCard,
    description: 'Automated treasury disbursement from escrow upon validator certification with SLA tracking.',
    custodian: 'Treasury & State Finance Directorate',
    slaDays: 7,
    statutoryRef: 'Maharashtra Public Finance Management Rules (MPFMR)',
    deliverables: ['Audit Clearance Note', 'PFMS Direct Escrow Transfer Receipt'],
  },
  {
    step: 11,
    name: 'Scale-Up Decision',
    shortName: 'Scale-Up',
    icon: TrendingUp,
    description: 'Governing board reviews certified outcome and decides: Statewide Scale, GeM Listing, or Closure.',
    custodian: 'State Innovation Steering Committee',
    slaDays: 15,
    statutoryRef: 'GFR 2017 Rule 194 & Rule 149 Single-Source Direct Scale-Up',
    deliverables: ['Statewide Rollout Sanction', 'GeM Custom Catalog Order', 'Lessons Dossier'],
  },
];

interface ProcurementLifecycleTrackerProps {
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
  className?: string;
}

export function ProcurementLifecycleTracker({
  currentStageNumber = 8,
  currentStageName = 'Pilot Running',
  history = [],
  submittedAt = new Date().toISOString(),
  department = 'Department of Agriculture',
  district = 'Nashik',
  daysSinceApproval = 4,
  totalBudget = 16.5,
  disbursedBudget = 6.6,
  agreementRef = 'SS-MSINS-2026-089',
  className,
}: ProcurementLifecycleTrackerProps) {
  let activeIndex = currentStageNumber - 1;
  if (activeIndex < 0) activeIndex = 0;
  if (activeIndex > 10) activeIndex = 10;

  const [selectedStageIndex, setSelectedStageIndex] = useState<number>(activeIndex);
  const [drawerOpen, setDrawerOpen] = useState(true);

  const activeStage = PROCUREMENT_STAGES[activeIndex] || PROCUREMENT_STAGES[0];
  const inspectedStage = PROCUREMENT_STAGES[selectedStageIndex] || activeStage;

  // SLA delay check (Flag warning if current stage days exceeded standard SLA)
  const isDelayed = daysSinceApproval > inspectedStage.slaDays;

  return (
    <div className={cn('w-full rounded-2xl solid-surface-elevated p-4 sm:p-6 transition-all', className)}>
      {/* Header Telemetry Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-border">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              Stage {activeStage.step} of 11: {activeStage.name}
            </span>
            <span className="text-xs text-muted-foreground font-mono font-medium">
              Ref: <strong className="text-foreground">{agreementRef}</strong>
            </span>
            {isDelayed && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-danger bg-danger/10 px-2 py-0.5 rounded-md border border-danger/20">
                <AlertTriangle className="h-3 w-3" />
                SLA Review Active (+{daysSinceApproval - inspectedStage.slaDays}d)
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {department} • District: <strong className="text-foreground">{district}</strong> • Initiated:{' '}
            {new Date(submittedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </p>
        </div>

        {/* Tranche budget summary */}
        <div className="flex items-center gap-3 bg-secondary/60 dark:bg-secondary/40 p-2.5 rounded-xl border border-border/70 shrink-0">
          <div className="text-right">
            <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Escrow Budget</div>
            <div className="text-sm font-bold font-mono text-foreground">
              ₹{disbursedBudget.toFixed(1)}L / ₹{totalBudget.toFixed(1)}L
            </div>
          </div>
          <div className="h-8 w-[1px] bg-border" />
          <div className="text-left">
            <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Progress</div>
            <div className="text-sm font-bold text-primary font-mono">
              {Math.round((disbursedBudget / Math.max(totalBudget, 0.1)) * 100)}% Released
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Horizontal Stepper (hidden on small screens) */}
      <div className="hidden lg:block pt-6 pb-4 overflow-x-auto">
        <div className="relative flex items-center justify-between min-w-[860px] px-2">
          {/* Connector Background Line */}
          <div className="absolute left-6 right-6 top-5 h-1 bg-muted rounded-full -z-0" />

          {/* Active Connector Progress Line */}
          <motion.div
            className="absolute left-6 top-5 h-1 bg-primary rounded-full -z-0"
            initial={{ width: 0 }}
            animate={{ width: `${(activeIndex / (PROCUREMENT_STAGES.length - 1)) * 96}%` }}
            transition={{ type: 'spring', stiffness: 80, damping: 20 }}
          />

          {PROCUREMENT_STAGES.map((stage, idx) => {
            const Icon = stage.icon;
            const isCompleted = idx < activeIndex;
            const isCurrent = idx === activeIndex;
            const isSelected = idx === selectedStageIndex;

            return (
              <button
                key={stage.step}
                type="button"
                onClick={() => {
                  setSelectedStageIndex(idx);
                  setDrawerOpen(true);
                }}
                className="relative z-10 flex flex-col items-center group cursor-pointer focus:outline-hidden"
              >
                {/* Node Circle */}
                <motion.div
                  whileHover={{ scale: 1.12 }}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    'h-10 w-10 rounded-full flex items-center justify-center transition-all shadow-sm font-bold text-xs',
                    isCompleted && 'bg-primary text-white ring-4 ring-primary/20',
                    isCurrent && 'bg-accent text-accent-foreground ring-4 ring-accent/30 font-extrabold shadow-md',
                    !isCompleted && !isCurrent && 'bg-card text-muted-foreground border-2 border-border group-hover:border-primary/50'
                  )}
                >
                  {isCompleted ? <CheckCircle2 className="h-5 w-5" /> : <Icon className="h-4 w-4" />}
                </motion.div>

                {/* Step Short Label */}
                <span
                  className={cn(
                    'mt-2 text-[11px] font-medium max-w-[70px] text-center leading-tight transition-colors',
                    isCurrent && 'text-accent font-bold',
                    isSelected && !isCurrent && 'text-primary font-bold',
                    !isCurrent && !isSelected && 'text-muted-foreground group-hover:text-foreground'
                  )}
                >
                  {stage.shortName}
                </span>

                {/* Selected Indicator Pill */}
                {isSelected && (
                  <motion.div
                    layoutId="stepperSelectedIndicator"
                    className="absolute -bottom-2 h-1 w-6 bg-primary rounded-full"
                    transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile Stepper (Stacked cards / Vertical selector) */}
      <div className="lg:hidden pt-4 pb-2">
        <div className="flex items-center justify-between text-xs font-semibold mb-2 text-muted-foreground">
          <span>Stage {selectedStageIndex + 1} of 11</span>
          <span className="font-mono text-primary font-bold">
            {Math.round(((activeIndex + 1) / PROCUREMENT_STAGES.length) * 100)}% Completed
          </span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {PROCUREMENT_STAGES.map((stage, idx) => {
            const isCompleted = idx < activeIndex;
            const isCurrent = idx === activeIndex;
            const isSelected = idx === selectedStageIndex;

            return (
              <button
                key={stage.step}
                type="button"
                onClick={() => {
                  setSelectedStageIndex(idx);
                  setDrawerOpen(true);
                }}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 flex items-center gap-1.5 transition-all border',
                  isSelected
                    ? 'bg-primary text-white border-primary shadow-xs'
                    : isCurrent
                    ? 'bg-accent/15 text-accent-foreground border-accent/40 font-bold'
                    : isCompleted
                    ? 'bg-secondary text-foreground border-border'
                    : 'bg-card text-muted-foreground border-border'
                )}
              >
                <span>{stage.step}.</span>
                <span>{stage.shortName}</span>
                {isCompleted && <CheckCircle2 className="h-3 w-3 text-emerald-500" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Expandable Stage Details Glass Drawer */}
      <div className="mt-4 pt-4 border-t border-border">
        <button
          type="button"
          onClick={() => setDrawerOpen(!drawerOpen)}
          className="w-full flex items-center justify-between text-xs font-bold text-foreground hover:text-primary transition-colors cursor-pointer py-1"
        >
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 text-primary" />
            <span>
              Stage {inspectedStage.step} Governance Dossier: {inspectedStage.name}
            </span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground text-[11px]">
            <span>{drawerOpen ? 'Collapse' : 'Expand Details'}</span>
            {drawerOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </div>
        </button>

        <AnimatePresence>
          {drawerOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden pt-3"
            >
              <div className="rounded-xl glass-surface p-4 sm:p-5 border border-border/80 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Custodian & SLA */}
                  <div className="space-y-1">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      Designated Custodian
                    </div>
                    <div className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      <Building2 className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span>{inspectedStage.custodian}</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      Statutory SLA Mandate
                    </div>
                    <div className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-accent shrink-0" />
                      <span>{inspectedStage.slaDays} Days Standard Turnaround</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      Statutory Compliance Anchor
                    </div>
                    <div className="text-xs font-medium text-foreground truncate" title={inspectedStage.statutoryRef}>
                      {inspectedStage.statutoryRef}
                    </div>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed prose-measure">
                  {inspectedStage.description}
                </p>

                {/* Mandatory Deliverables Checklist */}
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
                    Required Statutory Deliverables & Evidence
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {inspectedStage.deliverables.map((del, dIdx) => (
                      <div
                        key={dIdx}
                        className="flex items-center gap-2 p-2 rounded-lg bg-card/80 border border-border/60 text-xs font-medium text-foreground"
                      >
                        <CheckCircle2
                          className={cn(
                            'h-3.5 w-3.5 shrink-0',
                            selectedStageIndex < activeIndex
                              ? 'text-emerald-500'
                              : selectedStageIndex === activeIndex
                              ? 'text-amber-500'
                              : 'text-muted-foreground'
                          )}
                        />
                        <span className="truncate">{del}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Audit History Log for this stage */}
                {history.length > 0 && (
                  <div className="pt-2 border-t border-border/60">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                      Execution Audit Trail
                    </div>
                    <div className="space-y-1">
                      {history
                        .filter((h) => !h.stage || h.stage === inspectedStage.name)
                        .slice(0, 3)
                        .map((entry, hIdx) => (
                          <div key={hIdx} className="text-[11px] text-muted-foreground flex items-center justify-between">
                            <span>
                              <strong className="text-foreground">{entry.actor || 'System'}</strong>: {entry.note || 'Stage updated'}
                            </span>
                            <span className="font-mono text-[10px]">
                              {entry.timestamp ? new Date(entry.timestamp).toLocaleDateString() : ''}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Re-export for compatibility with legacy HorizontalStepTracker imports
export { ProcurementLifecycleTracker as HorizontalStepTracker };
export default ProcurementLifecycleTracker;
