import { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import {
  Search,
  MapPin,
  Building2,
  Rocket,
  ShieldCheck,
  Clock,
  Sparkles,
  ArrowRight,
  FilterX,
  FileCheck2,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { MAHARASHTRA_DISTRICTS } from '@/lib/utils';
import { INNOVATION_SECTORS } from '@/config/platform';
import { useNavSetu, type Challenge } from '@/lib/navsetuStore';
import { screenStartupEligibility, type EligibilityResult } from '@/lib/aiScoring';
import { useAuth } from '@/lib/auth';
import { cn } from '@/lib/utils';

export default function ProblemFeed() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const { challenges } = useNavSetu();
  const { user } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSector, setSelectedSector] = useState(searchParams.get('sector') || 'ALL');
  const [selectedDistrict, setSelectedDistrict] = useState(searchParams.get('district') || 'ALL');
  const [selectedStage, setSelectedStage] = useState('ALL');

  // Eligibility Modal State
  const [eligibilityModal, setEligibilityModal] = useState<{ open: boolean; challenge: Challenge | null }>({
    open: false,
    challenge: null,
  });
  const [dpiitNumber, setDpiitNumber] = useState('DPIIT-MH-2023-88192');
  const [turnover, setTurnover] = useState(15.0);
  const [years, setYears] = useState(2);
  const [trl, setTrl] = useState(6);
  const [eligibilityResult, setEligibilityResult] = useState<EligibilityResult | null>(null);

  // Filtered Challenges
  const filteredChallenges = useMemo(() => {
    return challenges.filter((c) => {
      const matchesSearch =
        !searchTerm.trim() ||
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.desiredOutcome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.id.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesSector = selectedSector === 'ALL' || c.sector === selectedSector;
      const matchesDistrict = selectedDistrict === 'ALL' || c.district === selectedDistrict;
      const matchesStage = selectedStage === 'ALL' || c.status === selectedStage;

      return matchesSearch && matchesSector && matchesDistrict && matchesStage;
    });
  }, [challenges, searchTerm, selectedSector, selectedDistrict, selectedStage]);

  const handleOpenEligibility = (challenge: Challenge) => {
    const res = screenStartupEligibility({
      dpiitNumber,
      dpiitVerified: true,
      annualTurnoverLakhs: turnover,
      yearsInOperation: years,
      sector: challenge.sector,
      techReadinessLevel: trl,
      priorGovtExperience: false,
      challengeSector: challenge.sector,
    });
    setEligibilityResult(res);
    setEligibilityModal({ open: true, challenge });
  };

  const handleRunEligibilityCheck = () => {
    if (!eligibilityModal.challenge) return;
    const res = screenStartupEligibility({
      dpiitNumber,
      dpiitVerified: dpiitNumber.toUpperCase().startsWith('DPIIT'),
      annualTurnoverLakhs: turnover,
      yearsInOperation: years,
      sector: eligibilityModal.challenge.sector,
      techReadinessLevel: trl,
      priorGovtExperience: false,
      challengeSector: eligibilityModal.challenge.sector,
    });
    setEligibilityResult(res);
  };

  return (
    <div className="min-h-screen bg-background py-10 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/80 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-3 shadow-xs">
              <Rocket className="h-3.5 w-3.5" />
              <span>Maharashtra State Innovation Society • Startup Discovery</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-foreground font-serif tracking-tight">
              Startup Discovery Marketplace
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-2xl leading-relaxed">
              Browse outcome-based public challenges posted by Maharashtra government departments.
              DPIIT-recognized startups receive statutory exemptions on prior turnover and years of experience under GFR Rule 170/173.
            </p>
          </div>

          <Link to="/report">
            <Button size="sm" className="font-bold text-xs bg-amber-600 hover:bg-amber-700 text-white cursor-pointer">
              Post Department Challenge
            </Button>
          </Link>
        </div>

        {/* Filter Controls Bar */}
        <div className="rounded-2xl border border-border bg-card p-4 sm:p-6 shadow-xs space-y-4">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by keyword, department, sector, or tracking ID (e.g. SS-2026-001042)..."
              className="pl-10 h-11 text-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="text-[11px] font-bold text-muted-foreground block mb-1">Sector Domain</label>
              <select
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
                className="w-full h-9 rounded-md border border-border bg-background px-3 text-xs"
              >
                <option value="ALL">All Innovation Sectors</option>
                {INNOVATION_SECTORS.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-muted-foreground block mb-1">Maharashtra District</label>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full h-9 rounded-md border border-border bg-background px-3 text-xs"
              >
                <option value="ALL">All 36 Districts</option>
                {MAHARASHTRA_DISTRICTS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-muted-foreground block mb-1">Procurement Stage</label>
              <select
                value={selectedStage}
                onChange={(e) => setSelectedStage(e.target.value)}
                className="w-full h-9 rounded-md border border-border bg-background px-3 text-xs"
              >
                <option value="ALL">All Lifecycle Stages</option>
                <option value="APPROVED_PUBLISHED">Approved & Published (Open for Bids)</option>
                <option value="EXPERT_EVALUATION">Under Expert Evaluation</option>
                <option value="PILOT_RUNNING">Active Sandboxed Pilot</option>
                <option value="SCALE_UP_DECISION">Scale-Up Decision Recorded</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Counter & List */}
        <div>
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
            <span>Showing {filteredChallenges.length} of {challenges.length} active challenge dockets</span>
            {(selectedSector !== 'ALL' || selectedDistrict !== 'ALL' || selectedStage !== 'ALL' || searchTerm) && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedSector('ALL');
                  setSelectedDistrict('ALL');
                  setSelectedStage('ALL');
                }}
                className="flex items-center gap-1 text-primary hover:underline cursor-pointer"
              >
                <FilterX className="h-3.5 w-3.5" />
                <span>Reset All Filters</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredChallenges.map((challenge) => (
              <Card
                key={challenge.id}
                className="rounded-2xl border border-border/80 bg-card p-6 flex flex-col justify-between hover:border-primary/40 hover:shadow-md transition-all"
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-primary bg-primary/10 px-2 py-0.5 rounded">
                        {challenge.id}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-secondary text-foreground">
                        {challenge.sector.replace('_', ' ')}
                      </span>
                    </div>

                    <span className="flex items-center gap-1 text-xs text-muted-foreground font-medium">
                      <MapPin className="h-3.5 w-3.5 text-amber-500" />
                      {challenge.district}, MH
                    </span>
                  </div>

                  {/* Title & Department */}
                  <Link to={`/problems/${challenge.id}`}>
                    <h3 className="text-base sm:text-lg font-bold text-foreground hover:text-primary transition-colors leading-snug">
                      {challenge.title}
                    </h3>
                  </Link>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                    <Building2 className="h-3.5 w-3.5 text-primary" />
                    <span>{challenge.department}</span>
                  </div>

                  {/* Outcome Description Excerpt */}
                  <p className="text-xs text-muted-foreground mt-3 line-clamp-3 leading-relaxed">
                    {challenge.desiredOutcome}
                  </p>

                  {/* KPIs Pill Preview */}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {challenge.successMetrics.slice(0, 2).map((kpi, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20"
                      >
                        ✓ {kpi}
                      </span>
                    ))}
                  </div>

                  {/* Commercials Bar */}
                  <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-border/60 text-xs">
                    <div>
                      <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Grant Budget</span>
                      <span className="font-mono font-bold text-foreground">
                        ₹{challenge.budgetMin}L – ₹{challenge.budgetMax}L
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Sandbox Duration</span>
                      <span className="font-mono font-bold text-foreground">
                        {challenge.pilotDurationMonths} Months
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="mt-6 pt-4 border-t border-border flex items-center justify-between gap-3 text-xs">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenEligibility(challenge)}
                    className="gap-1.5 text-xs font-semibold text-primary hover:bg-primary/10 border-primary/30 cursor-pointer"
                  >
                    <FileCheck2 className="h-3.5 w-3.5" />
                    <span>Check Eligibility</span>
                  </Button>

                  <Link to={`/problems/${challenge.id}`}>
                    <Button size="sm" className="gap-1.5 text-xs font-bold cursor-pointer">
                      <span>View Specs & Bid</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* DPIIT Regulatory Eligibility Check Modal */}
      <Dialog
        open={eligibilityModal.open}
        onOpenChange={(open) => setEligibilityModal((prev) => ({ ...prev, open }))}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 uppercase tracking-wider w-fit mb-1">
              <span>Demo Integration • Simulated DPIIT Database Lookup</span>
            </div>
            <DialogTitle className="flex items-center gap-2 text-base">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <span>DPIIT Startup Eligibility Screening Engine</span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 text-xs py-2">
            <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 text-muted-foreground text-[11px] leading-relaxed">
              Under GFR 2017 Rule 170(i) and Rule 173(i), recognized startups are granted relaxation on prior turnover and experience criteria.
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-foreground block mb-1">DPIIT Recognition Number</label>
                <Input
                  type="text"
                  value={dpiitNumber}
                  onChange={(e) => setDpiitNumber(e.target.value)}
                  placeholder="DPIIT-MH-2023-88192"
                  className="text-xs font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-foreground block mb-1">Annual Turnover (₹ Lakhs)</label>
                <Input
                  type="number"
                  value={turnover}
                  onChange={(e) => setTurnover(Number(e.target.value))}
                  className="text-xs font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-foreground block mb-1">Years in Operation</label>
                <Input
                  type="number"
                  value={years}
                  onChange={(e) => setYears(Number(e.target.value))}
                  className="text-xs font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-foreground block mb-1">Tech Readiness Level (TRL)</label>
                <select
                  value={trl}
                  onChange={(e) => setTrl(Number(e.target.value))}
                  className="w-full h-9 rounded-md border border-border bg-background px-3 text-xs"
                >
                  <option value={4}>TRL 4 (Lab validated prototype)</option>
                  <option value={5}>TRL 5 (Integrated in simulated environment)</option>
                  <option value={6}>TRL 6 (Prototype tested in relevant env)</option>
                  <option value={7}>TRL 7 (System prototype in operational env)</option>
                  <option value={8}>TRL 8 (System complete and qualified)</option>
                </select>
              </div>
            </div>

            <Button
              type="button"
              onClick={handleRunEligibilityCheck}
              size="sm"
              className="w-full text-xs font-bold"
            >
              Re-Calculate Statutory Relaxations
            </Button>

            {/* Screening Result Report Card */}
            {eligibilityResult && (
              <div
                className={cn(
                  'mt-4 p-4 rounded-xl border space-y-2.5',
                  eligibilityResult.status === 'PASS'
                    ? 'bg-emerald-500/10 border-emerald-500/30'
                    : eligibilityResult.status === 'NEEDS_REVIEW'
                    ? 'bg-amber-500/10 border-amber-500/30'
                    : 'bg-rose-500/10 border-rose-500/30'
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm">
                    Eligibility Status: {eligibilityResult.status}
                  </span>
                  <span className="font-mono font-bold text-xs">
                    Score: {eligibilityResult.score}/100
                  </span>
                </div>

                <div className="space-y-1 text-[11px]">
                  {eligibilityResult.reasons.map((r, i) => (
                    <div key={i} className="flex items-start gap-1.5">
                      <span className="font-bold shrink-0">•</span>
                      <span>{r}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-border/50 flex flex-wrap gap-1 text-[10px] font-mono">
                  {eligibilityResult.turnoverRelaxationApplied && (
                    <span className="px-2 py-0.5 rounded bg-emerald-600 text-white font-bold">
                      Turnover Waived (Rule 170)
                    </span>
                  )}
                  {eligibilityResult.experienceRelaxationApplied && (
                    <span className="px-2 py-0.5 rounded bg-emerald-600 text-white font-bold">
                      Experience Waived (Rule 173)
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setEligibilityModal({ open: false, challenge: null })}
            >
              Close
            </Button>
            {eligibilityModal.challenge && (
              <Link to={`/problems/${eligibilityModal.challenge.id}`}>
                <Button size="sm" className="font-bold text-xs">
                  Proceed to Proposal
                </Button>
              </Link>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
