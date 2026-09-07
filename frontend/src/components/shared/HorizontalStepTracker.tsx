import { CheckCircle2, Clock, AlertTriangle, ShieldCheck, Wrench, XCircle, ArrowRight } from 'lucide-react';
import type { ComplaintStatus, ComplaintHistoryItem } from '@/lib/complaints';
import { cn } from '@/lib/utils';

interface HorizontalStepTrackerProps {
  status: ComplaintStatus;
  aiScore: number;
  history: ComplaintHistoryItem[];
  submittedAt: string;
}

export function HorizontalStepTracker({
  status,
  aiScore,
  history,
  submittedAt,
}: HorizontalStepTrackerProps) {
  // Determine which steps are completed, active, or failed
  // Step 1: Submitted (Always completed)
  // Step 2: AI Verification (Completed or Failed if auto_rejected)
  // Step 3: Officer Review (Completed if approved/in_progress/resolved, Active if pending_officer/officer_reviewing, Skipped if auto_approved, Rejected if rejected_by_officer)
  // Step 4: In Progress (Active if verified_in_progress, Completed if resolved)
  // Step 5: Resolved (Active/Completed if resolved)

  const isAutoRejected = status === 'auto_rejected';
  const isOfficerRejected = status === 'rejected_by_officer';
  const isPendingOfficer = status === 'pending_officer';
  const isOfficerReviewing = status === 'officer_reviewing';
  const isInProgress = status === 'verified_in_progress';
  const isResolved = status === 'resolved';
  const isAutoApproved = status === 'auto_approved';

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

  return (
    <div className="w-full py-4">
      {/* Desktop Stepper */}
      <div className="hidden md:grid md:grid-cols-5 gap-2 relative">
        {/* Connecting Background Line */}
        <div className="absolute top-5 left-10 right-10 h-0.5 bg-border -z-0" />

        {steps.map((step, idx) => {
          let badgeBg = 'bg-secondary text-muted-foreground border-border';
          let lineBg = 'bg-border';

          if (step.isRejected) {
            badgeBg = 'bg-rose-500/10 text-rose-600 border-rose-500/30 dark:bg-rose-950/40 dark:text-rose-400';
          } else if (step.isCompleted) {
            badgeBg = 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30 dark:bg-emerald-950/40 dark:text-emerald-400';
          } else if (step.isActive) {
            badgeBg = 'bg-amber-500/15 text-amber-600 border-amber-500/40 dark:bg-amber-950/40 dark:text-amber-400 ring-4 ring-amber-500/10 animate-pulse';
          }

          return (
            <div key={step.id} className="flex flex-col items-center text-center relative z-10 px-2">
              <div
                className={cn(
                  'h-10 w-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 shadow-xs',
                  badgeBg
                )}
              >
                <step.icon className="h-5 w-5 shrink-0" />
              </div>

              <div className="mt-2.5 space-y-0.5">
                <span className="text-xs font-bold text-foreground block tracking-tight">
                  {step.label}
                </span>
                <span
                  className={cn(
                    'text-[10px] font-semibold block uppercase tracking-wider',
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
                <p className="text-[10px] text-muted-foreground line-clamp-2 max-w-[130px] mx-auto">
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
              'flex items-start gap-3 p-3 rounded-xl border transition-all',
              step.isActive
                ? 'bg-amber-500/5 border-amber-500/30 shadow-xs'
                : step.isCompleted
                ? 'bg-emerald-500/5 border-emerald-500/20'
                : step.isRejected
                ? 'bg-rose-500/5 border-rose-500/30'
                : 'bg-card border-border/60 opacity-70'
            )}
          >
            <div
              className={cn(
                'h-8 w-8 rounded-full flex items-center justify-center border mt-0.5 shrink-0',
                step.isRejected
                  ? 'bg-rose-500/10 text-rose-600 border-rose-500/30'
                  : step.isCompleted
                  ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30'
                  : step.isActive
                  ? 'bg-amber-500/15 text-amber-600 border-amber-500/40 animate-pulse'
                  : 'bg-secondary text-muted-foreground border-border'
              )}
            >
              <step.icon className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-foreground truncate">{step.label}</span>
                <span
                  className={cn(
                    'text-[10px] font-semibold uppercase',
                    step.isRejected
                      ? 'text-rose-600'
                      : step.isActive
                      ? 'text-amber-600'
                      : step.isCompleted
                      ? 'text-emerald-600'
                      : 'text-muted-foreground'
                  )}
                >
                  {step.sublabel}
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-0.5">{step.note}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
