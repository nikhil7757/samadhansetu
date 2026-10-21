import { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import {
  MapPin,
  Calendar,
  Building2,
  Rocket,
  ShieldCheck,
  Award,
  Clock,
  ArrowLeft,
  Sparkles,
  ExternalLink,
  ChevronRight,
  FileCheck2,
  TrendingUp,
  CreditCard,
  AlertTriangle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { useNavSetu, type Proposal } from '@/lib/navsetuStore';
import { calculateStartupChallengeMatch, screenStartupEligibility } from '@/lib/aiScoring';
import { useAuth } from '@/lib/auth';
import { cn } from '@/lib/utils';

export default function ProblemDetail() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { challenges, pilots } = useNavSetu();
  const { user } = useAuth();

  const challenge = useMemo(() => {
    if (!id) return challenges[0];
    const raw = id.trim().toUpperCase();
    const altRaw = raw.startsWith('SS-') ? raw.replace('SS-', 'NS-') : (raw.startsWith('NS-') ? raw.replace('NS-', 'SS-') : raw);
    return challenges.find((c) => c.id.toUpperCase() === raw || c.id.toUpperCase() === altRaw) || challenges[0];
  }, [challenges, id]);

  const associatedPilot = useMemo(() => {
    if (!challenge) return undefined;
    const cid = challenge.id.toUpperCase();
    const altCid = cid.startsWith('SS-') ? cid.replace('SS-', 'NS-') : (cid.startsWith('NS-') ? cid.replace('NS-', 'SS-') : cid);
    return pilots.find(
      (p) =>
        p.challengeId.toUpperCase() === cid ||
        p.challengeId.toUpperCase() === altCid ||
        p.id.toUpperCase() === cid ||
        p.id.toUpperCase() === altCid
    );
  }, [pilots, challenge]);

  // Proposal Submission State
  const [proposalModal, setProposalModal] = useState(false);
  const [approach, setApproach] = useState(
    'Deploy specialized offline edge AI camera hardware with INT8 quantized computer vision models fine-tuned on local agronomic datasets.'
  );
  const [techDescription, setTechDescription] = useState(
    'Micro-controller node with integrated solar charging, local LoRa mesh communication, and daily SMS alerts to village extension workers.'
  );
  const [proposedCost, setProposedCost] = useState(16.5);
  const [proposedWeeks, setProposedWeeks] = useState(24);
  const [proposals, setProposals] = useState<Proposal[]>([
    {
      id: 'prop-1',
      challengeId: challenge?.id || '',
      startupId: 'u-agriai',
      startupName: 'AgriScan Technologies Pvt Ltd',
      dpiitNumber: 'DPIIT-MH-2023-88192',
      approach: 'Edge AI computer vision with low-power solar nodes for real-time larval pest warning.',
      techDescription: 'INT8 quantized YOLOv8 on Coral TPU with store-and-forward edge syncing.',
      proposedCost: 16.5,
      proposedTimelineWeeks: 24,
      aiMatchScore: 94,
      status: 'SELECTED_FOR_PILOT',
      evaluations: [
        {
          evaluatorName: 'Prof. Jayant Joshi (IIT Bombay)',
          totalScore: 92,
          conflictFlag: false,
          comments: 'High technical readiness and proven edge resilience for rural Maharashtra conditions.',
        },
      ],
      createdAt: '90d ago',
    },
  ]);

  // Evaluator scoring modal state
  const [evalModal, setEvalModal] = useState(false);
  const [selectedPropId, setSelectedPropId] = useState<string>('prop-1');
  const [innovationScore, setInnovationScore] = useState(19);
  const [feasibilityScore, setFeasibilityScore] = useState(18);
  const [teamScore, setTeamScore] = useState(18);
  const [costScore, setCostScore] = useState(14);
  const [securityScore, setSecurityScore] = useState(9);
  const [scalabilityScore, setScalabilityScore] = useState(14);
  const [evalComments, setEvalComments] = useState(
    'Strong alignment with GFR Rule 194 pilot criteria. High likelihood of successful departmental scale-up.'
  );

  // Live match score calculation
  const matchResult = useMemo(() => {
    return calculateStartupChallengeMatch(
      {
        companyName: user?.organizationName || 'Innovative Startup',
        sector: challenge?.sector || 'OTHER',
        coreKeywords: ['ai', 'edge', 'iot', 'sensors'],
        techReadinessLevel: 7,
        district: user?.district || 'Pune',
      },
      {
        title: challenge?.title || '',
        desiredOutcome: challenge?.desiredOutcome || '',
        sector: challenge?.sector || '',
        district: challenge?.district || '',
      }
    );
  }, [user, challenge]);

  const handleProposalSubmit = () => {
    const newProp: Proposal = {
      id: `prop-${Date.now()}`,
      challengeId: challenge.id,
      startupId: user?.id || 'u-startup',
      startupName: user?.organizationName || user?.name || 'AgriScan Technologies Pvt Ltd',
      dpiitNumber: 'DPIIT-MH-2023-88192',
      approach,
      techDescription,
      proposedCost,
      proposedTimelineWeeks: proposedWeeks,
      aiMatchScore: matchResult.score,
      status: 'SUBMITTED',
      evaluations: [],
      createdAt: 'Just now',
    };
    setProposals([newProp, ...proposals]);
    setProposalModal(false);
  };

  const handleScoreSubmit = () => {
    const total = innovationScore + feasibilityScore + teamScore + costScore + securityScore + scalabilityScore;
    setProposals(
      proposals.map((p) => {
        if (p.id !== selectedPropId) return p;
        return {
          ...p,
          evaluations: [
            ...p.evaluations,
            {
              evaluatorName: user?.name || 'Prof. Jayant Joshi (IIT Bombay)',
              totalScore: total,
              conflictFlag: false,
              comments: evalComments,
            },
          ],
        };
      })
    );
    setEvalModal(false);
  };

  if (!challenge) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <h2 className="text-xl font-bold">Challenge not found</h2>
        <Link to="/problems" className="text-primary mt-2">Return to marketplace</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-10 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Back Link */}
        <div className="flex items-center justify-between">
          <Link
            to="/problems"
            className="text-xs font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Startup Discovery Marketplace</span>
          </Link>
          <span className="text-xs font-mono text-muted-foreground">
            Ref: {challenge.id}
          </span>
        </div>

        {/* Hero Header Card */}
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-xs text-primary bg-primary/10 px-2.5 py-1 rounded">
                {challenge.id}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-secondary text-foreground">
                {challenge.sector.replace('_', ' ')}
              </span>
              <span className="px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                {challenge.status.replace('_', ' ')}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 text-amber-500" />
              <span className="font-medium text-foreground">{challenge.district}, Maharashtra</span>
            </div>
          </div>

          <h1 className="text-xl sm:text-3xl font-black text-foreground font-serif leading-tight">
            {challenge.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-1">
            <span className="flex items-center gap-1.5 font-semibold text-foreground">
              <Building2 className="h-3.5 w-3.5 text-primary" />
              {challenge.department}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-muted-foreground" />
              Duration: {challenge.pilotDurationMonths} Months
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <CreditCard className="h-3.5 w-3.5 text-emerald-600" />
              Grant Budget: ₹{challenge.budgetMin}L – ₹{challenge.budgetMax}L
            </span>
          </div>

          {/* Action Row */}
          <div className="mt-6 pt-6 border-t border-border flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                onClick={() => setProposalModal(true)}
                className="font-bold text-xs bg-primary text-primary-foreground gap-1.5 cursor-pointer"
              >
                <Rocket className="h-4 w-4" />
                <span>Submit Technical Proposal</span>
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setEvalModal(true)}
                className="font-bold text-xs gap-1.5 cursor-pointer"
              >
                <Award className="h-4 w-4 text-amber-500" />
                <span>Score Proposal (Evaluator)</span>
              </Button>
            </div>

            {associatedPilot && (
              <Link to={`/track/${associatedPilot.id}`}>
                <Button size="sm" variant="secondary" className="gap-1.5 text-xs font-bold border border-primary/20 text-primary cursor-pointer">
                  <span>Inspect Running Pilot ({associatedPilot.currentStage})</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Challenge Formulation & Outcomes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2 rounded-2xl border border-border bg-card p-6 shadow-xs space-y-6">
            <div>
              <h3 className="text-base font-bold text-foreground border-b border-border pb-2 mb-3">
                1. Desired Public Outcome
              </h3>
              <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed">
                {challenge.desiredOutcome}
              </p>
            </div>

            <div>
              <h3 className="text-base font-bold text-foreground border-b border-border pb-2 mb-3">
                2. Quantifiable Success Metrics & KPIs
              </h3>
              <div className="space-y-2.5">
                {challenge.successMetrics.map((kpi, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-secondary/40 border border-border/60 text-xs flex items-center gap-2.5">
                    <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span className="font-medium text-foreground">{kpi}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-base font-bold text-foreground border-b border-border pb-2 mb-3">
                3. Governance & IP Specifications
              </h3>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-secondary/30 border border-border/50">
                  <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Data Sensitivity</span>
                  <span className="font-bold text-foreground text-xs">{challenge.dataSensitivity}</span>
                </div>
                <div className="p-3 rounded-xl bg-secondary/30 border border-border/50">
                  <span className="text-muted-foreground block text-[10px] uppercase font-semibold">IP Ownership Model</span>
                  <span className="font-bold text-foreground text-xs">{challenge.ipPreference.replace('_', ' ')}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* AI Quality Score Card Sidebar */}
          <div className="space-y-6">
            <Card className="rounded-2xl border border-border bg-card p-6 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <span className="text-[11px] font-mono font-bold text-primary uppercase">QUALITY AUDIT</span>
                <span className="text-xs font-mono font-black text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded">
                  Score: {challenge.aiQualityScore}/100
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
                Certified outcome-based problem formulation with validated measurable KPIs and realistic pilot duration.
              </p>
              <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Legal Sandbox:</span>
                <span className="font-bold text-foreground">Rule 194 Eligible</span>
              </div>
            </Card>

            <Card className="rounded-2xl border border-border bg-card p-6 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <span className="text-[11px] font-mono font-bold text-primary uppercase">STARTUP FIT</span>
                <span className="text-xs font-mono font-black text-primary bg-primary/10 px-2 py-0.5 rounded">
                  Match: {matchResult.score}/100
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
                {matchResult.rationale}
              </p>
            </Card>
          </div>
        </div>

        {/* Submitted Startup Proposals Section */}
        <Card className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-border mb-6">
            <div>
              <h3 className="text-lg font-bold text-foreground font-serif">
                Submitted Technical Proposals ({proposals.length})
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Proposals evaluated by independent technical panels across 6 weighted criteria.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {proposals.map((prop) => (
              <div key={prop.id} className="p-5 rounded-xl border border-border/80 bg-secondary/20 space-y-3 text-xs">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-foreground">{prop.startupName}</span>
                    <span className="text-[10px] font-mono text-muted-foreground">({prop.dpiitNumber})</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                      {prop.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-mono text-primary font-bold">Match: {prop.aiMatchScore}/100</span>
                    <span className="font-mono font-bold text-foreground">₹{prop.proposedCost}L ({prop.proposedTimelineWeeks} wks)</span>
                  </div>
                </div>

                <p className="text-muted-foreground leading-relaxed">
                  <span className="font-semibold text-foreground">Proposed Approach: </span>
                  {prop.approach}
                </p>

                {prop.evaluations.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-border/60 space-y-2">
                    <span className="font-bold text-[11px] text-foreground block">Expert Panel Review:</span>
                    {prop.evaluations.map((ev, i) => (
                      <div key={i} className="p-3 rounded-lg bg-card border border-border text-[11px] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <span className="font-semibold text-primary">{ev.evaluatorName}: </span>
                          <span className="text-muted-foreground">"{ev.comments}"</span>
                        </div>
                        <span className="font-mono font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded shrink-0">
                          {ev.totalScore}/100
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Submit Proposal Modal */}
      <Dialog open={proposalModal} onOpenChange={setProposalModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Submit Technical Proposal & Bid</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-xs py-2">
            <div>
              <label className="font-bold text-foreground block mb-1">Proposed Technical Approach</label>
              <textarea
                value={approach}
                onChange={(e) => setApproach(e.target.value)}
                rows={3}
                className="w-full rounded-md border border-border bg-background p-2 text-xs"
              />
            </div>
            <div>
              <label className="font-bold text-foreground block mb-1">Architecture & Offline Resilience</label>
              <textarea
                value={techDescription}
                onChange={(e) => setTechDescription(e.target.value)}
                rows={2}
                className="w-full rounded-md border border-border bg-background p-2 text-xs"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-foreground block mb-1">Proposed Pilot Cost (₹ Lakhs)</label>
                <Input
                  type="number"
                  value={proposedCost}
                  onChange={(e) => setProposedCost(Number(e.target.value))}
                  className="text-xs font-mono"
                />
              </div>
              <div>
                <label className="font-bold text-foreground block mb-1">Execution Timeline (Weeks)</label>
                <Input
                  type="number"
                  value={proposedWeeks}
                  onChange={(e) => setProposedWeeks(Number(e.target.value))}
                  className="text-xs font-mono"
                />
              </div>
            </div>
            <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 text-xs">
              <span className="font-bold text-primary block">AI Compatibility Match: {matchResult.score}/100</span>
              <span className="text-muted-foreground text-[11px]">{matchResult.rationale}</span>
            </div>
          </div>
          <DialogFooter>
            <Button size="sm" variant="outline" onClick={() => setProposalModal(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleProposalSubmit} className="font-bold text-xs">
              Confirm & Submit Proposal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Evaluator Scoring Modal */}
      <Dialog open={evalModal} onOpenChange={setEvalModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Expert Panel Multi-Criteria Evaluation</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-xs py-2">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-foreground block mb-1">Innovation & Novelty (Max 20)</label>
                <Input
                  type="number"
                  max={20}
                  value={innovationScore}
                  onChange={(e) => setInnovationScore(Number(e.target.value))}
                  className="text-xs font-mono"
                />
              </div>
              <div>
                <label className="font-bold text-foreground block mb-1">Technical Feasibility (Max 20)</label>
                <Input
                  type="number"
                  max={20}
                  value={feasibilityScore}
                  onChange={(e) => setFeasibilityScore(Number(e.target.value))}
                  className="text-xs font-mono"
                />
              </div>
              <div>
                <label className="font-bold text-foreground block mb-1">Team Competence (Max 20)</label>
                <Input
                  type="number"
                  max={20}
                  value={teamScore}
                  onChange={(e) => setTeamScore(Number(e.target.value))}
                  className="text-xs font-mono"
                />
              </div>
              <div>
                <label className="font-bold text-foreground block mb-1">Cost & Value for Money (Max 15)</label>
                <Input
                  type="number"
                  max={15}
                  value={costScore}
                  onChange={(e) => setCostScore(Number(e.target.value))}
                  className="text-xs font-mono"
                />
              </div>
              <div>
                <label className="font-bold text-foreground block mb-1">Data & Cybersecurity (Max 10)</label>
                <Input
                  type="number"
                  max={10}
                  value={securityScore}
                  onChange={(e) => setSecurityScore(Number(e.target.value))}
                  className="text-xs font-mono"
                />
              </div>
              <div>
                <label className="font-bold text-foreground block mb-1">Scalability & Rollout (Max 15)</label>
                <Input
                  type="number"
                  max={15}
                  value={scalabilityScore}
                  onChange={(e) => setScalabilityScore(Number(e.target.value))}
                  className="text-xs font-mono"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-foreground block mb-1">Expert Remarks & Technical Rationale</label>
              <textarea
                value={evalComments}
                onChange={(e) => setEvalComments(e.target.value)}
                rows={3}
                className="w-full rounded-md border border-border bg-background p-2 text-xs"
              />
            </div>

            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs flex justify-between items-center">
              <span className="font-bold text-foreground">Computed Total Weighted Score:</span>
              <span className="font-mono font-black text-emerald-600 text-sm">
                {innovationScore + feasibilityScore + teamScore + costScore + securityScore + scalabilityScore} / 100
              </span>
            </div>
          </div>
          <DialogFooter>
            <Button size="sm" variant="outline" onClick={() => setEvalModal(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleScoreSubmit} className="font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white">
              Authorize Score
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
