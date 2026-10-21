import { useState } from 'react';
import { motion } from 'motion/react';
import {
  CreditCard,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ShieldCheck,
  Building2,
  FileCheck,
  ArrowRight,
  ExternalLink,
  Lock,
  Unlock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface MilestoneItem {
  id: string;
  number: number;
  title: string;
  description: string;
  tranchePercentage: number;
  amountInrLakhs: number;
  dueDate: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'SUBMITTED' | 'VALIDATED' | 'DISBURSED';
  validatorSignOff?: {
    validatorName: string;
    organization: string; // e.g. VJTI / COEP / State QA
    validatedAt?: string;
    reportRef?: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
  };
  daysSinceApproval?: number;
}

interface MilestonePaymentTimelineProps {
  pilotId: string;
  startupName: string;
  totalBudgetLakhs: number;
  milestones?: MilestoneItem[];
  onTriggerDisbursement?: (milestoneId: string) => void;
  className?: string;
}

export function MilestonePaymentTimeline({
  pilotId,
  startupName,
  totalBudgetLakhs = 16.5,
  milestones = [
    {
      id: 'm1',
      number: 1,
      title: 'Tranche 1: Sandbox Perimeter & Hardware Setup',
      description: 'Sensor calibration in Nashik vineyard cluster, live gateway connectivity, baseline validation.',
      tranchePercentage: 40,
      amountInrLakhs: 6.6,
      dueDate: '2026-03-15',
      status: 'DISBURSED',
      validatorSignOff: {
        validatorName: 'Dr. S. K. Deshmukh',
        organization: 'VJTI Quality Assurance Bureau',
        validatedAt: '2026-03-18',
        reportRef: 'VJTI-QA-2026-042',
        status: 'APPROVED',
      },
      daysSinceApproval: 0,
    },
    {
      id: 'm2',
      number: 2,
      title: 'Tranche 2: Mid-Pilot Yield & Early Blight Detection',
      description: 'Minimum 92% automated detection accuracy over 40 hectares, bi-weekly telemetry delivery.',
      tranchePercentage: 40,
      amountInrLakhs: 6.6,
      dueDate: '2026-05-15',
      status: 'VALIDATED',
      validatorSignOff: {
        validatorName: 'Prof. Anjali Ranade',
        organization: 'COEP Autonomous Audit Cell',
        validatedAt: '2026-05-12',
        reportRef: 'COEP-AUD-2026-118',
        status: 'APPROVED',
      },
      daysSinceApproval: 5,
    },
    {
      id: 'm3',
      number: 3,
      title: 'Tranche 3: Final Empirical Validation & GeM Scale-Up Dossier',
      description: 'Final audit report, IP handover schedule, and GFR 194 single-source scale-up recommendation.',
      tranchePercentage: 20,
      amountInrLakhs: 3.3,
      dueDate: '2026-07-30',
      status: 'IN_PROGRESS',
      validatorSignOff: {
        validatorName: 'Independent Technical Auditor',
        organization: 'State Technical Evaluation Committee',
        status: 'PENDING',
      },
      daysSinceApproval: 0,
    },
  ],
  onTriggerDisbursement,
  className,
}: MilestonePaymentTimelineProps) {
  const [selectedMilestone, setSelectedMilestone] = useState<MilestoneItem>(milestones[1] || milestones[0]);

  // Aggregate disbursed amounts
  const totalDisbursed = milestones
    .filter((m) => m.status === 'DISBURSED')
    .reduce((sum, m) => sum + m.amountInrLakhs, 0);

  const percentDisbursed = Math.round((totalDisbursed / Math.max(totalBudgetLakhs, 0.1)) * 100);

  return (
    <div className={cn('rounded-2xl solid-surface p-4 sm:p-6 space-y-6', className)}>
      {/* Header Escrow Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-border">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <CreditCard className="h-4 w-4 text-primary" />
            <h3 className="text-base font-bold text-foreground font-heading">
              Milestone Escrow & Disbursement Schedule
            </h3>
          </div>
          <p className="text-xs text-muted-foreground">
            Pilot: <strong className="text-foreground">{pilotId}</strong> ({startupName}) • Under Maharashtra Public Finance Rules
          </p>
        </div>

        <div className="flex items-center gap-4 bg-secondary/60 p-3 rounded-xl border border-border shrink-0">
          <div>
            <div className="text-[10px] uppercase font-bold text-muted-foreground">Disbursed from Escrow</div>
            <div className="text-sm font-mono font-bold text-foreground">
              ₹{totalDisbursed.toFixed(2)}L / ₹{totalBudgetLakhs.toFixed(2)}L
            </div>
          </div>
          <div className="h-8 w-[1px] bg-border" />
          <div>
            <div className="text-[10px] uppercase font-bold text-muted-foreground">Escrow Balance</div>
            <div className="text-sm font-mono font-bold text-primary">
              ₹{(totalBudgetLakhs - totalDisbursed).toFixed(2)}L ({100 - percentDisbursed}%)
            </div>
          </div>
        </div>
      </div>

      {/* Visual Timeline of Milestone Cards */}
      <div className="space-y-4">
        {milestones.map((m, idx) => {
          const isSelected = selectedMilestone.id === m.id;
          const isDelayed = (m.daysSinceApproval || 0) > 14;

          return (
            <motion.div
              key={m.id}
              whileHover={{ y: -2 }}
              onClick={() => setSelectedMilestone(m)}
              className={cn(
                'rounded-xl border p-4 transition-all cursor-pointer relative',
                isSelected
                  ? 'border-primary ring-2 ring-primary/20 bg-card shadow-sm'
                  : 'border-border bg-card/60 hover:bg-card hover:border-border/80'
              )}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Left: Milestone Details */}
                <div className="flex items-start gap-3 min-w-0">
                  <div
                    className={cn(
                      'h-9 w-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0',
                      m.status === 'DISBURSED' && 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20',
                      m.status === 'VALIDATED' && 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20',
                      m.status === 'IN_PROGRESS' && 'bg-primary/10 text-primary border border-primary/20',
                      m.status === 'PENDING' && 'bg-muted text-muted-foreground'
                    )}
                  >
                    {m.status === 'DISBURSED' ? <CheckCircle2 className="h-5 w-5" /> : `M${m.number}`}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-bold text-foreground font-heading">{m.title}</h4>
                      <span
                        className={cn(
                          'text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border',
                          m.status === 'DISBURSED' && 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
                          m.status === 'VALIDATED' && 'bg-amber-500/10 text-amber-600 border-amber-500/20',
                          m.status === 'IN_PROGRESS' && 'bg-primary/10 text-primary border-primary/20',
                          m.status === 'PENDING' && 'bg-muted text-muted-foreground'
                        )}
                      >
                        {m.status}
                      </span>
                      {isDelayed && (
                        <span className="text-[10px] font-semibold text-danger bg-danger/10 px-1.5 py-0.5 rounded flex items-center gap-1 border border-danger/20">
                          <AlertTriangle className="h-3 w-3" />
                          SLA Exceeded (+{m.daysSinceApproval}d)
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{m.description}</p>
                  </div>
                </div>

                {/* Right: Tranche Amount & Action */}
                <div className="flex items-center justify-between md:justify-end gap-5 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-border/50">
                  <div className="text-right">
                    <div className="text-sm font-mono font-bold text-foreground">
                      ₹{m.amountInrLakhs.toFixed(2)} Lakhs
                    </div>
                    <div className="text-[11px] text-muted-foreground font-medium">
                      Tranche: <strong className="text-primary font-mono">{m.tranchePercentage}%</strong> • Due:{' '}
                      {new Date(m.dueDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                    </div>
                  </div>

                  {m.status === 'VALIDATED' && (
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onTriggerDisbursement?.(m.id);
                      }}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold gap-1.5 shadow-xs cursor-pointer"
                    >
                      <Unlock className="h-3.5 w-3.5" />
                      <span>Release Escrow</span>
                    </Button>
                  )}

                  {m.status === 'DISBURSED' && (
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Transferred</span>
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Selected Milestone Inspection Panel */}
      {selectedMilestone && (
        <div className="rounded-xl glass-surface p-4 sm:p-5 border border-border/80 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <h5 className="text-xs font-bold uppercase tracking-wider text-foreground">
                Independent Quality Validation Report
              </h5>
            </div>
            <span className="text-[11px] font-mono text-muted-foreground">
              Milestone {selectedMilestone.number}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-2.5 rounded-lg bg-card/70 border border-border/60">
              <div className="text-[10px] uppercase font-bold text-muted-foreground">Auditing Organization</div>
              <div className="font-semibold text-foreground mt-0.5">
                {selectedMilestone.validatorSignOff?.organization || 'State Accredited Testing Bureau'}
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-card/70 border border-border/60">
              <div className="text-[10px] uppercase font-bold text-muted-foreground">Validator Authority</div>
              <div className="font-semibold text-foreground mt-0.5">
                {selectedMilestone.validatorSignOff?.validatorName || 'Pending Assignment'}
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-card/70 border border-border/60">
              <div className="text-[10px] uppercase font-bold text-muted-foreground">Audit Certificate Reference</div>
              <div className="font-mono text-primary font-semibold mt-0.5">
                {selectedMilestone.validatorSignOff?.reportRef || 'Awaiting Field Completion'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MilestonePaymentTimeline;
