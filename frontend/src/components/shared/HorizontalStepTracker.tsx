import { CheckCircle2, Clock, AlertTriangle, ShieldCheck, Wrench, XCircle, ArrowRight } from 'lucide-react';
import type { ComplaintStatus, ComplaintHistoryItem } from '@/lib/complaints';
import { cn } from '@/lib/utils';

interface HorizontalStepTrackerProps {
  status: ComplaintStatus;
  aiScore: number;
  history: ComplaintHistoryItem[];
  submittedAt: string;
  category?: string;
  district?: string;
  officerName?: string | null;
}

export function HorizontalStepTracker({
  status,
  aiScore,
  history,
  submittedAt,
  category,
  district,
  officerName,
}: HorizontalStepTrackerProps) {
  // Determine which steps are completed, active, or failed
  const isAutoRejected = status === 'auto_rejected';
  const isOfficerRejected = status === 'rejected_by_officer';
  const isPendingOfficer = status === 'pending_officer';
  const isOfficerReviewing = status === 'officer_reviewing';
  const isInProgress = status === 'verified_in_progress';
  const isResolved = status === 'resolved';
  const isAutoApproved = status === 'auto_approved';

  // Calculate 72-hour statutory SLA countdown
  const submissionTime = new Date(submittedAt).getTime();
  const slaDeadline = submissionTime + 72 * 60 * 60 * 1000;
  const hoursLeft = Math.max(0, Math.round((slaDeadline - Date.now()) / (1000 * 60 * 60)));
  const slaText = isResolved
    ? 'Complied within 72H'
    : isAutoRejected || isOfficerRejected
    ? 'Docket Closed'
    : hoursLeft > 0
    ? `${hoursLeft}H remaining`
    : 'SLA Elapsed (Pushed to Escalation)';

  // Current physical/administrative file custodian
  const currentCustodian = isResolved
    ? 'State Archive & Public Gazette'
    : isInProgress
    ? 'Field Engineering Squad & CSR Solvers'
    : isPendingOfficer || isOfficerReviewing
    ? `${district || 'District'} Nodal Desk (${officerName || 'Assigned Officer'})`
    : isAutoApproved
    ? 'Dispatched to Department Works Section'
    : 'Grievance Review & Appeal Registry';

  // Department designation
  const deptMap: Record<string, string> = {
    roads: 'Road Construction Dept (RCD / PWD)',
    water: 'Drinking Water & Sanitation Dept (DWSD)',
    electricity: 'Jharkhand Bijli Vitran Nigam (JBVNL)',
    sanitation: 'Urban Development & Housing (UD&HD)',
    corruption: 'District Administration / Anti-Corruption',
    other: 'Rural Development Dept',
  };
  const departmentName = (category && deptMap[category.toLowerCase()]) || 'District Works Division';

  const steps = [
    {
      id: 'submitted',
      label: 'Submitted',
      sublabel: new Date(submittedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      icon: CheckCircle2,
      isCompleted: true,
      isActive: false,
      isRejected: false,
      note: 'Indexed on Jharkhand Civic Registry',
    },
    {
      id: 'ai_verification',
      label: 'AI Verification',
      sublabel: `Score: ${aiScore}/100`,
      icon: isAutoRejected ? XCircle : ShieldCheck,
      isCompleted: !isAutoRejected,
      isActive: false,
      isRejected: isAutoRejected,
      note: isAutoRejected
        ? 'Flagged: Score < 40'
        : aiScore >= 80
        ? 'Auto-Approved (Score ≥ 80)'
        : 'Routed for Review (Score 40–79)',
    },
    {
      id: 'officer_review',
      label: 'Officer Review',
      sublabel: isOfficerRejected
        ? 'Rejected'
        : isPendingOfficer
        ? 'In Queue'
        : isOfficerReviewing
        ? 'Under Review'
        : aiScore >= 80 && !isOfficerRejected
        ? 'Bypassed (Auto-Pass)'
        : 'Approved',
      icon: isOfficerRejected ? XCircle : isPendingOfficer || isOfficerReviewing ? Clock : CheckCircle2,
      isCompleted: isInProgress || isResolved || (aiScore >= 80 && !isPendingOfficer && !isOfficerReviewing),
      isActive: isPendingOfficer || isOfficerReviewing,
      isRejected: isOfficerRejected,
      note: isOfficerRejected
        ? 'Rejected by District Officer'
        : isPendingOfficer
        ? 'Assigned to Nodal Officer'
        : isOfficerReviewing
        ? 'Officer Inspecting Details'
        : aiScore >= 80
        ? 'Passed High-Confidence Threshold'
        : 'Officer Approved & Forwarded',
    },
    {
      id: 'in_progress',
      label: 'In Progress',
      sublabel: isInProgress ? 'Action On Ground' : isResolved ? 'Completed' : 'Pending',
      icon: Wrench,
      isCompleted: isResolved,
      isActive: isInProgress,
      isRejected: false,
      note: isInProgress
        ? 'Field team & innovation solvers deployed'
        : isResolved
        ? 'Work completed'
        : 'Awaiting team assignment',
    },
    {
      id: 'resolved',
      label: isAutoRejected || isOfficerRejected ? 'Closed (Rejected)' : 'Resolved',
      sublabel: isResolved ? 'Verified Closed' : isAutoRejected || isOfficerRejected ? 'Needs Appeal' : 'Final Step',
      icon: isAutoRejected || isOfficerRejected ? XCircle : CheckCircle2,
      isCompleted: isResolved,
      isActive: isResolved,
      isRejected: isAutoRejected || isOfficerRejected,
      note: isResolved
        ? 'Independent verification test passed'
        : isAutoRejected || isOfficerRejected
        ? 'Citizen appeal path available'
        : 'Quality audit pending',
    },
  ];

  // Calculate completion percentage for the connector line
  const lastActiveOrCompletedIdx = steps.reduce((acc, s, i) => (s.isCompleted || s.isActive || s.isRejected ? i : acc), 0);
  const progressPercent = Math.min(100, Math.max(0, (lastActiveOrCompletedIdx / (steps.length - 1)) * 100));

  const progressGradient = isAutoRejected || isOfficerRejected
    ? 'bg-rose-500'
    : isPendingOfficer || isOfficerReviewing
    ? 'bg-gradient-to-r from-emerald-500 via-amber-500 to-amber-500'
    : 'bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500';

  return (
    <div className="w-full py-2">
      {/* Sovereign File Movement Ledger Header */}
      <div className="mb-6 p-4 rounded-xl border border-border bg-card/95 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs shadow-2xs">
        <div className="space-y-0.5">
          <span className="text-[10px] uppercase font-mono font-bold text-muted-foreground block">
            Current File Custodian
          </span>
          <span className="font-bold text-foreground truncate block font-mono text-[11px]">
            {currentCustodian}
          </span>
        </div>
        <div className="space-y-0.5">
          <span className="text-[10px] uppercase font-mono font-bold text-muted-foreground block">
            Responsible Department
          </span>
          <span className="font-bold text-primary truncate block">
            {departmentName}
          </span>
        </div>
        <div className="space-y-0.5 sm:text-right">
          <span className="text-[10px] uppercase font-mono font-bold text-muted-foreground block">
            Statutory SLA Mandate
          </span>
          <span className="font-bold font-mono text-[11px] text-emerald-600 dark:text-emerald-400">
            72H Standard • {slaText}
          </span>
        </div>
      </div>

      {/* Desktop Stepper */}
      <div className="hidden md:grid md:grid-cols-5 gap-3 relative">
        {/* Background Track Line */}
        <div className="absolute top-[21px] left-[10%] right-[10%] h-1 bg-border/70 rounded-full -z-0" />
        {/* Filled Dynamic Progress Line */}
        <div
          className={cn('absolute top-[21px] left-[10%] h-1 rounded-full transition-all duration-700 -z-0', progressGradient)}
          style={{ width: `${(progressPercent * 0.8)}%` }}
        />

        {steps.map((step, idx) => {
          let nodeClasses = 'bg-card text-muted-foreground border-border/80 shadow-2xs';

          if (step.isRejected) {
            nodeClasses = 'bg-rose-600 text-white border-rose-300 shadow-lg shadow-rose-600/30 ring-4 ring-rose-500/20';
          } else if (step.isCompleted) {
            nodeClasses = 'bg-emerald-600 text-white border-emerald-300 shadow-md shadow-emerald-600/25 ring-4 ring-emerald-500/15';
          } else if (step.isActive) {
            nodeClasses = 'bg-amber-500 text-white border-amber-200 shadow-lg shadow-amber-500/40 ring-4 ring-amber-500/25 animate-pulse';
          }

          return (
            <div key={step.id} className="flex flex-col items-center text-center relative z-10 px-2 group">
              <div
                className={cn(
                  'h-11 w-11 rounded-full flex items-center justify-center border-2 transition-all duration-300 group-hover:scale-105 relative cursor-default',
                  nodeClasses
                )}
              >
                <step.icon className="h-5 w-5 shrink-0" />
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-secondary text-[9px] font-mono font-bold text-foreground border border-border flex items-center justify-center">
                  {idx + 1}
                </span>
              </div>

              <div className="mt-3 space-y-1">
                <span className="text-xs font-black text-foreground block tracking-tight">
                  {step.label}
                </span>
                <span
                  className={cn(
                    'text-[10px] font-bold block uppercase tracking-wider',
                    step.isRejected
                      ? 'text-rose-600 dark:text-rose-400'
                      : step.isActive
                      ? 'text-amber-600 dark:text-amber-400'
                      : step.isCompleted
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-muted-foreground'
                  )}
                >
                  {step.sublabel}
                </span>
                <p className="text-[10px] text-muted-foreground line-clamp-2 max-w-[130px] mx-auto leading-relaxed">
                  {step.note}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile Stepper (Vertical Card Timeline) */}
      <div className="md:hidden space-y-3">
        {steps.map((step, idx) => (
          <div
            key={step.id}
            className={cn(
              'flex items-start gap-3 p-3.5 rounded-xl border transition-all',
              step.isActive
                ? 'bg-amber-500/10 border-amber-500/30 shadow-xs'
                : step.isCompleted
                ? 'bg-emerald-500/10 border-emerald-500/25'
                : step.isRejected
                ? 'bg-rose-500/10 border-rose-500/30'
                : 'bg-card border-border/70 opacity-80'
            )}
          >
            <div
              className={cn(
                'h-8 w-8 rounded-full flex items-center justify-center border mt-0.5 shrink-0 shadow-2xs',
                step.isRejected
                  ? 'bg-rose-500 text-white border-rose-400'
                  : step.isCompleted
                  ? 'bg-emerald-600 text-white border-emerald-400'
                  : step.isActive
                  ? 'bg-amber-500 text-white border-amber-300 animate-pulse'
                  : 'bg-secondary text-muted-foreground border-border'
              )}
            >
              <step.icon className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-black text-foreground truncate flex items-center gap-1.5">
                  <span className="font-mono text-[10px] text-muted-foreground font-normal">#{idx + 1}</span>
                  <span>{step.label}</span>
                </span>
                <span
                  className={cn(
                    'text-[10px] font-bold uppercase tracking-wider',
                    step.isRejected
                      ? 'text-rose-600 dark:text-rose-400'
                      : step.isActive
                      ? 'text-amber-600 dark:text-amber-400'
                      : step.isCompleted
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-muted-foreground'
                  )}
                >
                  {step.sublabel}
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-1 leading-snug">{step.note}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
