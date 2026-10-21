import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Award,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  Sparkles,
  Lock,
  Send,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ScoreRingMeter } from './ScoreRingMeter';

export interface EvaluationCriterion {
  id: string;
  name: string;
  weight: number; // e.g. 0.25 (25%)
  description: string;
  minBenchmark: number;
}

export const STATUTORY_CRITERIA: EvaluationCriterion[] = [
  {
    id: 'technical_merit',
    name: 'Technical Merit & Innovation',
    weight: 0.25,
    description: 'Novelty of technological approach, IP defensibility, and TRL 5+ prototype maturity.',
    minBenchmark: 70,
  },
  {
    id: 'pilot_viability',
    name: 'Pilot Viability & Sandbox Readiness',
    weight: 0.25,
    description: 'Feasibility of field deployment within municipal/district perimeter within 90 days.',
    minBenchmark: 70,
  },
  {
    id: 'cost_feasibility',
    name: 'Cost Feasibility & Milestone Structure',
    weight: 0.20,
    description: 'Rationality of capital allocation across tranches and value-for-money metrics.',
    minBenchmark: 65,
  },
  {
    id: 'team_capability',
    name: 'Team & DPIIT Startup Capability',
    weight: 0.15,
    description: 'Founder technical depth, track record, and DPIIT recognition certificate validity.',
    minBenchmark: 60,
  },
  {
    id: 'ip_security',
    name: 'IP Safeguards & Cybersecurity',
    weight: 0.15,
    description: 'Adherence to Maharashtra Data Privacy guidelines and Cert-In cyber readiness.',
    minBenchmark: 70,
  },
];

interface EvaluationScoringGridProps {
  proposalId: string;
  startupName: string;
  challengeTitle: string;
  evaluatorName?: string;
  evaluatorRole?: string;
  initialScores?: Record<string, number>;
  initialRemarks?: string;
  onSubmitEvaluation?: (data: {
    scores: Record<string, number>;
    weightedTotal: number;
    remarks: string;
    verdict: 'RECOMMENDED' | 'CONDITIONAL' | 'REJECTED';
    auditHash: string;
  }) => void;
  className?: string;
}

export function EvaluationScoringGrid({
  proposalId,
  startupName,
  challengeTitle,
  evaluatorName = 'Dr. R. V. Kulkarni',
  evaluatorRole = 'Empanelled Technical Expert (MSInS)',
  initialScores = {
    technical_merit: 85,
    pilot_viability: 80,
    cost_feasibility: 75,
    team_capability: 90,
    ip_security: 80,
  },
  initialRemarks = 'The startup demonstrates exceptional algorithm maturity for on-device detection. Field sandbox risks in Nashik are mitigated by the modular battery-backed architecture.',
  onSubmitEvaluation,
  className,
}: EvaluationScoringGridProps) {
  const [scores, setScores] = useState<Record<string, number>>(initialScores);
  const [remarks, setRemarks] = useState(initialRemarks);
  const [isSignOffModalOpen, setIsSignOffModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate live weighted sum
  const weightedTotal = useMemo(() => {
    let sum = 0;
    for (const c of STATUTORY_CRITERIA) {
      const score = scores[c.id] || 0;
      sum += score * c.weight;
    }
    return Math.round(sum);
  }, [scores]);

  // Determine verdict based on GFR thresholds (min 75/100)
  const verdict: 'RECOMMENDED' | 'CONDITIONAL' | 'REJECTED' =
    weightedTotal >= 75 ? 'RECOMMENDED' : weightedTotal >= 60 ? 'CONDITIONAL' : 'REJECTED';

  const handleScoreChange = (criterionId: string, val: number) => {
    setScores((prev) => ({
      ...prev,
      [criterionId]: Math.min(Math.max(val, 0), 100),
    }));
  };

  // Generate simulated audit hash for statutory non-repudiation
  const auditHash = useMemo(() => {
    const raw = `${proposalId}:${evaluatorName}:${weightedTotal}:${remarks.slice(0, 20)}`;
    let hash = 0;
    for (let i = 0; i < raw.length; i++) {
      hash = (hash << 5) - hash + raw.charCodeAt(i);
      hash |= 0;
    }
    return `SHA256-${Math.abs(hash).toString(16).padStart(8, '0').toUpperCase()}MSINS`;
  }, [proposalId, evaluatorName, weightedTotal, remarks]);

  const handleConfirmSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSignOffModalOpen(false);
      onSubmitEvaluation?.({
        scores,
        weightedTotal,
        remarks,
        verdict,
        auditHash,
      });
    }, 600);
  };

  return (
    <div className={cn('rounded-2xl solid-surface p-4 sm:p-6 space-y-6', className)}>
      {/* Header Evaluation Details */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-border">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Award className="h-4 w-4 text-primary" />
            <h3 className="text-base font-bold text-foreground font-heading">
              Statutory Proposal Scoring Grid (GFR 192)
            </h3>
          </div>
          <p className="text-xs text-muted-foreground">
            Proposal: <strong className="text-foreground">{proposalId}</strong> ({startupName}) • Challenge:{' '}
            <span className="text-foreground font-medium">{challengeTitle}</span>
          </p>
        </div>

        {/* Live Weighted Score Display */}
        <div className="flex items-center gap-4 bg-secondary/50 p-2.5 rounded-xl border border-border shrink-0">
          <div className="text-right">
            <div className="text-[10px] uppercase font-bold text-muted-foreground">Weighted Total</div>
            <div className="text-2xl font-black font-heading tabular-nums text-primary">
              {weightedTotal} <span className="text-xs text-muted-foreground font-normal">/ 100</span>
            </div>
          </div>
          <div className="h-9 w-[1px] bg-border" />
          <div>
            <div className="text-[10px] uppercase font-bold text-muted-foreground">Statutory Verdict</div>
            <span
              className={cn(
                'inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md border mt-0.5',
                verdict === 'RECOMMENDED' && 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
                verdict === 'CONDITIONAL' && 'bg-amber-500/10 text-amber-600 border-amber-500/20',
                verdict === 'REJECTED' && 'bg-danger/10 text-danger border-danger/20'
              )}
            >
              {verdict === 'RECOMMENDED' && <CheckCircle2 className="h-3 w-3" />}
              {verdict === 'CONDITIONAL' && <AlertTriangle className="h-3 w-3" />}
              {verdict === 'REJECTED' && <X className="h-3 w-3" />}
              <span>{verdict}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Criteria Scoring Sliders & Inputs */}
      <div className="space-y-4">
        {STATUTORY_CRITERIA.map((criterion) => {
          const currentVal = scores[criterion.id] ?? 70;
          const isBelowBenchmark = currentVal < criterion.minBenchmark;

          return (
            <div
              key={criterion.id}
              className="p-4 rounded-xl border border-border/80 bg-card/60 hover:bg-card transition-colors space-y-2.5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-foreground font-heading">{criterion.name}</h4>
                    <span className="text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded bg-primary/10 text-primary border border-primary/20">
                      Weight: {criterion.weight * 100}%
                    </span>
                    {isBelowBenchmark && (
                      <span className="text-[10px] text-danger font-medium flex items-center gap-0.5">
                        <AlertTriangle className="h-3 w-3" />
                        Below min ({criterion.minBenchmark})
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{criterion.description}</p>
                </div>

                {/* Score Number Input */}
                <div className="flex items-center gap-2 shrink-0">
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={currentVal}
                    onChange={(e) => handleScoreChange(criterion.id, parseInt(e.target.value) || 0)}
                    className="w-16 h-8 text-center font-mono font-bold text-sm rounded-lg bg-background border border-border text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                  />
                  <span className="text-xs text-muted-foreground font-mono">/ 100</span>
                </div>
              </div>

              {/* Range Slider */}
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={currentVal}
                  onChange={(e) => handleScoreChange(criterion.id, parseInt(e.target.value))}
                  className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <span className="text-[11px] font-mono text-muted-foreground w-12 text-right">
                  {(currentVal * criterion.weight).toFixed(1)} pts
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Remarks & Justification Box */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs font-semibold">
          <label htmlFor="eval-remarks" className="text-foreground">
            Independent Evaluator Justification & Caveats
          </label>
          <span className="text-[11px] font-mono text-muted-foreground">{remarks.length} characters</span>
        </div>
        <textarea
          id="eval-remarks"
          rows={3}
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          placeholder="State technical justification, sandbox covenants, or required modifications..."
          className="w-full p-3 rounded-xl text-xs bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-border">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          <span>Evaluator: <strong className="text-foreground">{evaluatorName}</strong> ({evaluatorRole})</span>
        </div>

        <Button
          onClick={() => setIsSignOffModalOpen(true)}
          className="w-full sm:w-auto text-xs font-bold gap-2 cursor-pointer bg-primary hover:bg-primary-hover text-white shadow-xs"
        >
          <Lock className="h-3.5 w-3.5" />
          <span>Sign & Submit Scorecard ({weightedTotal}/100)</span>
        </Button>
      </div>

      {/* Confirmation & Audit Stamp Modal */}
      {isSignOffModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm animate-in fade-in"
        >
          <div className="w-full max-w-lg rounded-2xl glass-popover p-6 border border-border shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <h4 className="text-sm font-bold text-foreground font-heading">
                  Statutory Evaluation Sign-Off Preview
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setIsSignOffModalOpen(false)}
                className="p-1 rounded-md text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              You are certifying this evaluation under <strong>GFR 2017 Rule 192</strong> and the Maharashtra State Innovative Startup Policy.
              Your verdict will be permanently stamped in the state audit registry.
            </p>

            <div className="p-3.5 rounded-xl bg-card border border-border space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Proposal:</span>
                <span className="font-semibold text-foreground">{proposalId} ({startupName})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Certified Score:</span>
                <span className="font-mono font-bold text-primary">{weightedTotal} / 100</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Final Recommendation:</span>
                <span className="font-bold text-foreground">{verdict}</span>
              </div>
              <div className="pt-2 border-t border-border flex justify-between items-center text-[11px]">
                <span className="text-muted-foreground">Audit Fingerprint:</span>
                <span className="font-mono text-primary font-bold">{auditHash}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsSignOffModalOpen(false)}
                className="text-xs font-semibold cursor-pointer"
              >
                Edit Scores
              </Button>
              <Button
                size="sm"
                onClick={handleConfirmSubmit}
                disabled={isSubmitting}
                className="text-xs font-bold gap-1.5 cursor-pointer bg-primary text-white"
              >
                <Send className="h-3.5 w-3.5" />
                <span>{isSubmitting ? 'Signing...' : 'Affix Digital Signature & Submit'}</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EvaluationScoringGrid;
