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

  const [activeTab, setActiveTab] = useState<'challenges' | 'pilots'>('challenges');
  const [approvalNote, setApprovalNote] = useState('Quality score certified (>= 70/100). Approved for open startup discovery under MSInS regulations.');
  const [selectedChallengeId, setSelectedChallengeId] = useState<string | null>(null);

  const pendingChallenges = challenges.filter(
    (c) => c.status === 'PENDING_APPROVAL' || c.status === 'DRAFTED'
  );

  const handleApprove = async () => {
    if (!selectedChallengeId) return;
    await approveChallenge(selectedChallengeId, approvalNote);
    setSelectedChallengeId(null);
  };

  return (
    <div className="min-h-screen bg-background py-10 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="border-b border-border/80 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-3 shadow-xs">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>MSInS Administrative & Evaluation Oversight Console</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-foreground font-serif tracking-tight">
              Approvals & Evaluation Queue
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-2xl leading-relaxed">
              Verify outcome-based challenge formulations, assign expert panels, track milestone delivery, and authorize statutory scale-up procurement.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('challenges')}
              className={cn(
                'px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer',
                activeTab === 'challenges'
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'bg-card border border-border text-muted-foreground hover:text-foreground'
              )}
            >
              Challenge Approvals ({pendingChallenges.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('pilots')}
              className={cn(
                'px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer',
                activeTab === 'pilots'
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'bg-card border border-border text-muted-foreground hover:text-foreground'
              )}
            >
              Active Pilots Oversight ({pilots.length})
            </button>
          </div>
        </div>

        {/* TAB 1: CHALLENGE APPROVALS */}
        {activeTab === 'challenges' && (
          <div className="space-y-6">
            <div className="text-xs text-muted-foreground">
              Review challenges submitted by departments. Challenges with Quality Score ≥ 70 can be published directly for startup bidding.
            </div>

            {pendingChallenges.length === 0 ? (
              <Card className="p-8 rounded-2xl border border-border bg-card text-center text-xs text-muted-foreground">
                No challenges currently awaiting MSInS administrative approval.
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pendingChallenges.map((ch) => (
                  <Card key={ch.id} className="p-6 rounded-2xl border border-border bg-card flex flex-col justify-between shadow-xs space-y-4">
                    <div>
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                          {ch.id}
                        </span>
                        <div className="flex items-center gap-1 font-mono font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded">
                          <Sparkles className="h-3 w-3" />
                          <span>Quality: {ch.aiQualityScore}/100</span>
                        </div>
                      </div>

                      <h3 className="text-base font-bold text-foreground">{ch.title}</h3>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        <Building2 className="h-3.5 w-3.5 text-primary" />
                        <span>{ch.department}</span>
                        <span>•</span>
                        <MapPin className="h-3.5 w-3.5 text-amber-500" />
                        <span>{ch.district}, MH</span>
                      </div>

                      <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
                        {ch.desiredOutcome}
                      </p>

                      <div className="mt-4 pt-3 border-t border-border/60 grid grid-cols-2 gap-2 text-xs font-mono">
                        <div>
                          <span className="text-muted-foreground block text-[10px]">Budget</span>
                          <span className="font-bold">₹{ch.budgetMin}L – ₹{ch.budgetMax}L</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground block text-[10px]">Duration</span>
                          <span className="font-bold">{ch.pilotDurationMonths} Months</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border flex items-center justify-between gap-3 text-xs">
                      <Link to={`/problems/${ch.id}`}>
                        <Button variant="ghost" size="sm" className="text-xs cursor-pointer">
                          Inspect Specs
                        </Button>
                      </Link>

                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedChallengeId(ch.id);
                        }}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs gap-1.5 cursor-pointer"
                      >
                        <Check className="h-3.5 w-3.5" />
                        <span>Approve & Publish</span>
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ACTIVE PILOTS OVERSIGHT */}
        {activeTab === 'pilots' && (
          <div className="space-y-6">
            <div className="text-xs text-muted-foreground">
              Monitor active sandboxes across Maharashtra. Trigger milestone validations, release payments, and execute scale-up decisions.
            </div>

            <div className="space-y-6">
              {pilots.map((pilot) => (
                <Card key={pilot.id} className="p-6 sm:p-8 rounded-2xl border border-border bg-card shadow-xs space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono font-bold text-xs text-primary bg-primary/10 px-2 py-0.5 rounded">
                          {pilot.id}
                        </span>
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600">
                          {pilot.currentStage}
                        </span>
                        <span className="text-xs text-muted-foreground font-mono">
                          Agr: {pilot.agreementRef}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-foreground font-serif">
                        {pilot.challengeTitle}
                      </h3>
                      <div className="text-xs text-muted-foreground mt-1">
                        {pilot.department} • {pilot.district}, MH • {pilot.startupName}
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

                  {/* Milestones in this pilot */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-muted-foreground uppercase font-mono block">
                      Contracted Milestones & Disbursals:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {pilot.milestones.map((m) => (
                        <div key={m.id} className="p-3 rounded-xl bg-secondary/30 border border-border text-xs space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="font-mono font-bold text-primary">Milestone {m.milestoneNumber}</span>
                            <span className="font-bold text-[10px] px-2 py-0.5 rounded bg-secondary text-foreground">
                              {m.status}
                            </span>
                          </div>
                          <div className="font-semibold text-foreground truncate">{m.title}</div>
                          <div className="flex justify-between items-center text-[11px] text-muted-foreground pt-1 border-t border-border/50">
                            <span>₹{m.paymentAmount}L</span>
                            <span>{m.daysSinceApproval > 0 ? `${m.daysSinceApproval}d timer` : m.dueDate.slice(0, 10)}</span>
                          </div>
                          {m.status === 'SUBMITTED' && (
                            <Button
                              size="sm"
                              onClick={() => validateMilestone(pilot.id, m.milestoneNumber)}
                              className="w-full h-7 text-[10px] font-bold bg-sky-600 hover:bg-sky-700 text-white"
                            >
                              Validate (Audit)
                            </Button>
                          )}
                          {m.status === 'VALIDATED' && (
                            <Button
                              size="sm"
                              onClick={() => releaseMilestonePayment(pilot.id, m.milestoneNumber)}
                              className="w-full h-7 text-[10px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white"
                            >
                              Release Grant
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
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
