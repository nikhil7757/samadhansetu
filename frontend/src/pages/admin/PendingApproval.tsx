import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import {
  Check,
  X,
  MapPin,
  Building2,
  Rocket,
  ShieldCheck,
  Clock,
  Sparkles,
  Award,
  ArrowRight,
  TrendingUp,
  CreditCard,
  FileCheck2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { useNavSetu } from '@/lib/navsetuStore';
import { EvaluationScoringGrid } from '@/components/shared/EvaluationScoringGrid';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function PendingApproval() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    challenges,
    pilots,
    approveChallenge,
    validateMilestone,
    releaseMilestonePayment,
    recordScaleUpDecision,
  } = useNavSetu();

  const [activeTab, setActiveTab] = useState<'challenges' | 'scoring' | 'pilots'>('challenges');
  const [approvalNote, setApprovalNote] = useState('Quality score certified (>= 70/100). Approved for open startup discovery under MSInS regulations.');
  const [selectedChallengeId, setSelectedChallengeId] = useState<string | null>(null);

  const pendingChallenges = challenges.filter(
    (c) => c.status === 'PENDING_APPROVAL' || c.status === 'DRAFTED'
  );

  const handleApprove = async () => {
    if (!selectedChallengeId) return;
    await approveChallenge(selectedChallengeId, approvalNote);
    toast.success('Challenge Approved & Published to Startup Marketplace');
    setSelectedChallengeId(null);
  };

  const handleEvaluationSubmit = (data: any) => {
    toast.success('Evaluation Scorecard Affixed & Submitted', {
      description: `Weighted Total: ${data.weightedTotal}/100 • Verdict: ${data.verdict} • Stamp: ${data.auditHash}`,
    });
  };

  return (
    <div className="min-h-screen bg-background py-10 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="border-b border-border/80 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-3 shadow-2xs">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>MSInS Administrative & Evaluation Oversight Console</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-foreground font-heading tracking-tight">
              Approvals & Evaluation Queue
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-2xl leading-relaxed">
              Verify outcome-based challenge formulations, score technical proposals under GFR 192, and oversee live pilot milestone disbursements.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setActiveTab('challenges')}
              className={cn(
                'px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border',
                activeTab === 'challenges'
                  ? 'bg-primary text-primary-foreground border-primary shadow-2xs'
                  : 'bg-card border-border text-muted-foreground hover:text-foreground'
              )}
            >
              Challenge Approvals ({pendingChallenges.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('scoring')}
              className={cn(
                'px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border flex items-center gap-1.5',
                activeTab === 'scoring'
                  ? 'bg-primary text-primary-foreground border-primary shadow-2xs'
                  : 'bg-card border-border text-muted-foreground hover:text-foreground'
              )}
            >
              <Award className="h-3.5 w-3.5 text-accent" />
              <span>Proposal Scoring (GFR 192)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('pilots')}
              className={cn(
                'px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border',
                activeTab === 'pilots'
                  ? 'bg-primary text-primary-foreground border-primary shadow-2xs'
                  : 'bg-card border-border text-muted-foreground hover:text-foreground'
              )}
            >
              Active Pilots Oversight ({pilots.length})
            </button>
          </div>
        </div>

        {/* Tab 1: Challenge Approvals */}
        {activeTab === 'challenges' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
              <span>{pendingChallenges.length} challenges awaiting gazette publication review</span>
            </div>

            {pendingChallenges.length === 0 ? (
              <div className="p-12 text-center rounded-2xl solid-surface border border-border">
                <Check className="h-10 w-10 text-emerald-500 mx-auto mb-2" />
                <h3 className="font-bold text-foreground text-sm">No Pending Challenge Submissions</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  All submitted department challenges have been reviewed and published.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingChallenges.map((c) => (
                  <div
                    key={c.id}
                    className="p-6 rounded-2xl solid-surface border border-border space-y-4 hover:border-primary/40 transition-all"
                  >
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          <span className="font-mono text-xs font-bold text-primary px-2 py-0.5 rounded bg-primary/10">
                            {c.id}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {c.department} • <strong className="text-foreground">{c.district}</strong>
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-secondary font-semibold">
                            {c.sector}
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-foreground font-heading">
                          {c.title}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-2 leading-relaxed prose-measure">
                          {c.desiredOutcome}
                        </p>
                      </div>

                      {/* AI Scorer Badge */}
                      <div className="flex items-center gap-4 shrink-0 bg-secondary/50 p-3 rounded-xl border border-border">
                        <div className="text-right">
                          <div className="text-[10px] uppercase font-bold text-muted-foreground">AI Quality</div>
                          <div className="text-xl font-black font-heading text-primary font-mono">
                            {c.aiQualityScore}/100
                          </div>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => setSelectedChallengeId(c.id)}
                          className="font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer shadow-2xs"
                        >
                          Review & Authorize
                        </Button>
                      </div>
                    </div>

                    {/* KPIs Checklist */}
                    <div className="pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground">Estimated Pilot Grant:</span>
                        <span className="font-mono text-foreground font-bold">₹{c.budgetMin}L – ₹{c.budgetMax}L</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground">Target Duration:</span>
                        <span>{c.pilotDurationMonths} Months</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground">IP Preference:</span>
                        <span>{c.ipPreference.replace(/_/g, ' ')}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Proposal Scoring Grid (GFR 192) */}
        {activeTab === 'scoring' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Interactive Evaluation Matrix for Empanelled Committee Members</span>
              <span className="font-mono font-semibold text-primary">MSInS Evaluation Rule GFR 192</span>
            </div>

            <EvaluationScoringGrid
              proposalId="PROP-2026-0041"
              startupName="AgriScan Edge AI Technologies Pvt Ltd"
              challengeTitle="Computer Vision & Edge-AI Early Crop Pest Detection in Vineyards (Nashik)"
              onSubmitEvaluation={handleEvaluationSubmit}
            />
          </div>
        )}

        {/* Tab 3: Active Pilots Oversight */}
        {activeTab === 'pilots' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
              <span>{pilots.length} active pilots in statutory sandbox testbeds across Maharashtra</span>
            </div>

            <div className="space-y-4">
              {pilots.map((pilot) => (
                <div
                  key={pilot.id}
                  className="p-6 rounded-2xl solid-surface border border-border space-y-4 hover:border-primary/40 transition-all"
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span className="font-mono text-xs font-bold text-accent px-2 py-0.5 rounded bg-accent/15">
                          {pilot.id}
                        </span>
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-bold font-mono">
                          Stage {pilot.stageNumber}/11: {pilot.currentStage}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-foreground font-heading">
                        {pilot.challengeTitle}
                      </h3>
                      <div className="text-xs text-muted-foreground mt-1">
                        {pilot.department} • <strong className="text-foreground">{pilot.district}</strong> • Startup:{' '}
                        <strong className="text-foreground">{pilot.startupName}</strong>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link to={`/track/${pilot.id}`}>
                        <Button size="sm" variant="outline" className="text-xs font-bold gap-1 cursor-pointer">
                          <span>Inspect Full Dossier</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                    </div>
                  </div>

                  {/* Contracted Milestones */}
                  <div className="space-y-2 pt-2 border-t border-border">
                    <span className="text-xs font-bold text-muted-foreground uppercase font-mono block">
                      Contracted Milestones & Disbursals:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {pilot.milestones.map((m) => (
                        <div key={m.id} className="p-3 rounded-xl bg-secondary/40 border border-border text-xs space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="font-mono font-bold text-primary">M{m.milestoneNumber}</span>
                            <span className="font-bold text-[10px] px-2 py-0.5 rounded bg-background text-foreground border border-border">
                              {m.status}
                            </span>
                          </div>
                          <div className="font-semibold text-foreground truncate">{m.title}</div>
                          <div className="flex justify-between items-center text-[11px] text-muted-foreground pt-1 border-t border-border/60">
                            <span className="font-mono font-bold text-foreground">₹{m.paymentAmount}L</span>
                            <span>{m.daysSinceApproval > 0 ? `${m.daysSinceApproval}d timer` : m.dueDate.slice(0, 10)}</span>
                          </div>
                          {m.status === 'SUBMITTED' && (
                            <Button
                              size="sm"
                              onClick={() => {
                                validateMilestone(pilot.id, m.milestoneNumber);
                                toast.success(`Milestone ${m.milestoneNumber} validated by technical auditor`);
                              }}
                              className="w-full h-7 text-[10px] font-bold bg-sky-600 hover:bg-sky-700 text-white cursor-pointer"
                            >
                              Validate (Audit)
                            </Button>
                          )}
                          {m.status === 'VALIDATED' && (
                            <Button
                              size="sm"
                              onClick={() => {
                                releaseMilestonePayment(pilot.id, m.milestoneNumber);
                                toast.success(`Escrow tranche ₹${m.paymentAmount}L released to ${pilot.startupName}`);
                              }}
                              className="w-full h-7 text-[10px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                            >
                              Release Grant
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Approve Modal */}
      <Dialog open={!!selectedChallengeId} onOpenChange={() => setSelectedChallengeId(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Approve & Publish Challenge</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 text-xs py-2">
            <p className="text-muted-foreground leading-relaxed">
              This action validates that the problem statement is outcome-based, measurable KPIs are present, and releases the docket to the Startup Discovery Marketplace.
            </p>
            <div>
              <label className="font-bold text-foreground block mb-1">Administrative Endorsement Note</label>
              <textarea
                value={approvalNote}
                onChange={(e) => setApprovalNote(e.target.value)}
                rows={3}
                className="w-full rounded-md border border-border bg-background p-2 text-xs"
              />
            </div>
          </div>
          <DialogFooter>
            <Button size="sm" variant="outline" onClick={() => setSelectedChallengeId(null)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleApprove} className="font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white">
              Authorize & Publish
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
