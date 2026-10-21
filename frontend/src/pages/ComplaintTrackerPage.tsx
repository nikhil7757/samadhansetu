import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import {
  Search,
  CheckCircle2,
  Clock,
  Copy,
  MapPin,
  Calendar,
  Building2,
  Rocket,
  ShieldCheck,
  CreditCard,
  TrendingUp,
  FileText,
  Printer,
  ChevronRight,
  ExternalLink,
  Award,
  Share2,
  Check,
  Download,
} from 'lucide-react';
import { StateSeal } from '@/components/shared/StateSeal';
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
import { HorizontalStepTracker } from '@/components/shared/HorizontalStepTracker';
import { useNavSetu, type Pilot } from '@/lib/navsetuStore';
import { cn } from '@/lib/utils';

export default function ComplaintTrackerPage() {
  const { t } = useTranslation();
  const { complaintId } = useParams<{ complaintId?: string }>();
  const navigate = useNavigate();
  const {
    pilots,
    challenges,
    submitMilestoneDeliverable,
    validateMilestone,
    releaseMilestonePayment,
    recordScaleUpDecision,
  } = useNavSetu();

  const [searchInput, setSearchInput] = useState(() => complaintId || 'NS-2026-001042');
  const [selectedPilot, setSelectedPilot] = useState<Pilot | null>(null);

  // Modals for walkthrough actions
  const [deliverableModal, setDeliverableModal] = useState<{ open: boolean; milestoneNumber: number }>({ open: false, milestoneNumber: 1 });
  const [deliverableUrl, setDeliverableUrl] = useState('https://storage.navsetu.gov.in/milestones/field-telemetry-v1.pdf');
  const [deliverableNotes, setDeliverableNotes] = useState('Field sensor telemetry logs & verification metrics attached.');

  const [scaleUpModal, setScaleUpModal] = useState(false);
  const [decisionVerdict, setDecisionVerdict] = useState<'SCALE' | 'EXTEND' | 'STOP'>('SCALE');
  const [pathway, setPathway] = useState<'DIRECT_PILOT_AWARD' | 'LIMITED_TENDER' | 'GEM_LISTING'>('DIRECT_PILOT_AWARD');
  const [decisionRationale, setDecisionRationale] = useState(
    'Validated in MSInS testbed sandbox with 94.2% KPI compliance. Recommended for immediate statewide procurement under GFR Rule 194.'
  );

  // GeM Startup Runway Demo Integration State
  const [gemModalOpen, setGemModalOpen] = useState(false);
  const [copiedGemId, setCopiedGemId] = useState(false);

  const gemDocketId = `GEM-MH-RUNWAY-2026-${(selectedPilot?.id || 'NS-2026-001042').replace(/[^0-9]/g, '').slice(-6) || '001042'}`;
  const gemListingPayload = selectedPilot ? {
    isSimulated: true,
    gemDocketId,
    catalogCategory: 'Public Innovation & Smart Governance Solutions',
    offeringType: 'INTEGRATED_SOLUTION',
    originatingDepartment: selectedPilot.department,
    startupName: selectedPilot.startupName,
    dpiitNumber: selectedPilot.dpiitNumber,
    state: 'Maharashtra',
    pilotRef: selectedPilot.id,
    agreementRef: selectedPilot.agreementRef,
    certifiedKpis: selectedPilot.kpis.map((k) => `${k.kpi} (${k.achieved || 'Verified'})`),
    procurementPathway: 'GeM Startup Runway Direct Purchase (GFR Rule 149)',
    statutoryCeilingINR: '₹50,00,000',
    contractValueLakhs: `₹${selectedPilot.totalBudget} Lakhs`,
    exportStatus: 'READY_FOR_STATEWIDE_INDENTING',
    timestamp: new Date().toISOString(),
  } : null;

  const copyGemDocketId = () => {
    navigator.clipboard.writeText(gemDocketId);
    setCopiedGemId(true);
    setTimeout(() => setCopiedGemId(false), 2000);
  };

  const downloadGemJson = () => {
    if (!gemListingPayload) return;
    const blob = new Blob([JSON.stringify(gemListingPayload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${gemDocketId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    const raw = (complaintId || searchInput || 'NS-2026-001042').trim().toUpperCase();
    const altRaw = raw.startsWith('SS-') ? raw.replace('SS-', 'NS-') : (raw.startsWith('NS-') ? raw.replace('NS-', 'SS-') : raw);
    const found = pilots.find(
      (p) =>
        p.id.toUpperCase() === raw ||
        p.id.toUpperCase() === altRaw ||
        p.challengeId.toUpperCase() === raw ||
        p.challengeId.toUpperCase() === altRaw
    );
    if (found) {
      setSelectedPilot(found);
    } else if (pilots.length > 0) {
      setSelectedPilot(pilots[0]);
    }
  }, [complaintId, pilots]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchInput.trim().toUpperCase();
    if (!query) return;
    navigate(`/track/${query}`);
  };

  const copyRefCode = () => {
    if (!selectedPilot) return;
    navigator.clipboard.writeText(selectedPilot.id);
  };

  const handleDeliverableSubmit = () => {
    if (!selectedPilot) return;
    submitMilestoneDeliverable(selectedPilot.id, deliverableModal.milestoneNumber, deliverableUrl, deliverableNotes);
    setDeliverableModal({ open: false, milestoneNumber: 1 });
  };

  const handleScaleUpSubmit = () => {
    if (!selectedPilot) return;
    recordScaleUpDecision(selectedPilot.id, decisionVerdict, pathway, decisionRationale);
    setScaleUpModal(false);
  };

  const activeChallenge = challenges.find((c) => c.id === selectedPilot?.challengeId);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* 1. Header Banner & Search */}
      <section className="bg-card border-b border-border/80 pt-8 pb-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-3 shadow-xs">
                <StateSeal size="xs" />
                <span>Maharashtra State Innovation Society (MSInS) • Dossier Registry</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-foreground font-serif tracking-tight">
                Procurement Lifecycle Dossier
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-2xl leading-relaxed">
                Legally binding state audit trail tracking challenge formulation, expert evaluation, pilot sandbox milestones, independent validation, and scale-up procurement decisions.
              </p>
            </div>

            {/* Quick Lookup Input */}
            <form onSubmit={handleSearch} className="w-full md:w-96 flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="NS-YYYY-NNNNNN"
                  className="pl-9 h-11 text-xs font-mono uppercase bg-background shadow-xs"
                />
              </div>
              <Button type="submit" size="sm" className="h-11 px-4 font-bold text-xs cursor-pointer">
                Track
              </Button>
            </form>
          </div>

          {/* Quick Pilot Selector Chips */}
          <div className="mt-5 flex flex-wrap items-center gap-2 text-xs pt-4 border-t border-border/60">
            <span className="text-muted-foreground font-medium">Sample Pilots:</span>
            {pilots.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  setSearchInput(p.id);
                  navigate(`/track/${p.id}`);
                }}
                className={cn(
                  'px-2.5 py-1 rounded-md text-[11px] font-mono border transition-all cursor-pointer flex items-center gap-1.5',
                  selectedPilot?.id === p.id
                    ? 'bg-primary text-primary-foreground border-primary font-bold shadow-xs'
                    : 'bg-secondary/60 border-border text-foreground hover:bg-secondary'
                )}
              >
                <span>{p.id}</span>
                <span className="text-[10px] opacity-80 truncate max-w-[140px]">({p.department})</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Main Dossier Content */}
      {selectedPilot && (
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
          {/* Top Pilot Docket Header Card */}
          <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <button
                  type="button"
                  onClick={copyRefCode}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-bold bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors cursor-pointer"
                  title="Click to copy tracking ID"
                >
                  <Copy className="h-3.5 w-3.5" />
                  <span>{selectedPilot.id}</span>
                </button>
                <span className="px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                  {selectedPilot.currentStage}
                </span>
                <span className="text-xs text-muted-foreground font-mono">
                  Agr: {selectedPilot.agreementRef}
                </span>
              </div>

              <h2 className="text-lg sm:text-2xl font-bold text-foreground font-serif">
                {selectedPilot.challengeTitle}
              </h2>

              <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground mt-3">
                <span className="flex items-center gap-1.5 font-medium text-foreground">
                  <Building2 className="h-3.5 w-3.5 text-primary" />
                  {selectedPilot.department}
                </span>
                <span className="flex items-center gap-1.5 font-medium text-foreground">
                  <MapPin className="h-3.5 w-3.5 text-amber-500" />
                  {selectedPilot.district}, Maharashtra
                </span>
                <span className="flex items-center gap-1.5 font-medium text-foreground">
                  <Rocket className="h-3.5 w-3.5 text-indigo-500" />
                  {selectedPilot.startupName} ({selectedPilot.dpiitNumber})
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.print()}
                className="gap-1.5 text-xs font-medium cursor-pointer"
              >
                <Printer className="h-4 w-4" />
                <span>Print Dossier</span>
              </Button>
            </div>
          </div>

          {/* 3. The 11-Stage Procurement Lifecycle Tracker */}
          <HorizontalStepTracker
            currentStageNumber={selectedPilot.stageNumber || 8}
            currentStageName={selectedPilot.currentStage}
            history={selectedPilot.history}
            department={selectedPilot.department}
            district={selectedPilot.district}
            daysSinceApproval={
              selectedPilot.milestones.find((m) => m.status === 'SUBMITTED' || m.status === 'VALIDATED')?.daysSinceApproval || 3
            }
            totalBudget={selectedPilot.totalBudget}
            disbursedBudget={selectedPilot.disbursedBudget}
            agreementRef={selectedPilot.agreementRef}
          />

          {/* 4. Two Columns: Outcome KPIs + Sandbox Scope */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Outcome KPIs Card */}
            <Card className="rounded-2xl border border-border bg-card p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-border/70">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-emerald-600" />
                  <h3 className="font-bold text-base text-foreground">Target Outcome KPIs</h3>
                </div>
                <span className="text-[11px] font-mono text-muted-foreground uppercase">
                  Verified Benchmarks
                </span>
              </div>

              <div className="space-y-3">
                {selectedPilot.kpis.map((kpi, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-secondary/40 border border-border/60 text-xs flex items-center justify-between gap-3">
                    <span className="font-medium text-foreground">{kpi.kpi}</span>
                    <span className="font-bold font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20 shrink-0">
                      {kpi.achieved || 'In Test'}
                    </span>
                  </div>
                ))}
              </div>

              {activeChallenge && (
                <div className="mt-4 pt-4 border-t border-border/70 text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground block mb-1">Desired Public Outcome:</span>
                  <p className="leading-relaxed">{activeChallenge.desiredOutcome}</p>
                </div>
              )}
            </Card>

            {/* Controlled Sandbox Scope Card */}
            <Card className="rounded-2xl border border-border bg-card p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-border/70">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    <h3 className="font-bold text-base text-foreground">Controlled Sandbox Parameters</h3>
                  </div>
                  <span className="text-[11px] font-mono text-muted-foreground uppercase">
                    Testbed Scope
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-muted-foreground block text-[11px]">Field Sandbox Testbed Scope</span>
                    <p className="font-medium text-foreground mt-0.5 leading-relaxed">{selectedPilot.sandboxScope}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="p-2.5 rounded-lg bg-secondary/40 border border-border/60">
                      <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Start Date</span>
                      <span className="font-mono font-bold text-foreground text-xs">{selectedPilot.startDate.slice(0, 10)}</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-secondary/40 border border-border/60">
                      <span className="text-muted-foreground block text-[10px] uppercase font-semibold">End Date</span>
                      <span className="font-mono font-bold text-foreground text-xs">{selectedPilot.endDate.slice(0, 10)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Governing Policy:</span>
                <span className="font-semibold text-primary">MSInS Sandbox Regulations 2026</span>
              </div>
            </Card>
          </div>

          {/* 5. Contracted Pilot Milestones & Payments Table */}
          <Card className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-border/70">
              <div>
                <h3 className="text-lg font-bold text-foreground font-serif">
                  Contracted Pilot Milestones & Disbursals
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Milestone grants released upon independent validation with SLA delay monitoring.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                  Total Disbursed: ₹{selectedPilot.disbursedBudget}L / ₹{selectedPilot.totalBudget}L
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border/70 text-muted-foreground font-semibold uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-3">#</th>
                    <th className="py-3 px-3">Milestone Deliverable</th>
                    <th className="py-3 px-3">Due Date</th>
                    <th className="py-3 px-3">Grant Amount</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3">Turnaround / Timer</th>
                    <th className="py-3 px-3 text-right">Workflow Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 font-medium">
                  {selectedPilot.milestones.map((m) => (
                    <tr key={m.id} className="hover:bg-secondary/30 transition-colors">
                      <td className="py-3.5 px-3 font-mono font-bold text-primary">{m.milestoneNumber}</td>
                      <td className="py-3.5 px-3 max-w-[280px]">
                        <div className="font-bold text-foreground">{m.title}</div>
                        <div className="text-[11px] text-muted-foreground truncate">{m.deliverable}</div>
                        {m.submissionUrl && (
                          <a
                            href={m.submissionUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-[10px] text-primary hover:underline mt-1"
                          >
                            <FileText className="h-3 w-3" />
                            <span>View Deliverable Document</span>
                          </a>
                        )}
                      </td>
                      <td className="py-3.5 px-3 font-mono text-muted-foreground">{m.dueDate.slice(0, 10)}</td>
                      <td className="py-3.5 px-3 font-mono font-bold text-foreground">₹{m.paymentAmount}L</td>
                      <td className="py-3.5 px-3">
                        <span
                          className={cn(
                            'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider',
                            m.status === 'PAID'
                              ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20'
                              : m.status === 'VALIDATED'
                              ? 'bg-sky-500/10 text-sky-700 dark:text-sky-400 border border-sky-500/20'
                              : m.status === 'SUBMITTED'
                              ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20'
                              : 'bg-secondary text-muted-foreground border border-border'
                          )}
                        >
                          {m.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 font-mono text-xs">
                        {m.status === 'PAID' ? (
                          <span className="text-muted-foreground text-[11px]">Paid in {m.daysSinceApproval} days</span>
                        ) : m.status === 'VALIDATED' ? (
                          <span className="text-amber-600 font-bold">{m.daysSinceApproval}d since validation</span>
                        ) : m.status === 'SUBMITTED' ? (
                          <span className="text-sky-600">Pending validator</span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        {/* Interactive testing buttons */}
                        {m.status === 'PENDING' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setDeliverableModal({ open: true, milestoneNumber: m.milestoneNumber })}
                            className="h-8 text-xs font-bold text-primary hover:bg-primary/10 cursor-pointer"
                          >
                            Submit Files
                          </Button>
                        )}
                        {m.status === 'SUBMITTED' && (
                          <Button
                            size="sm"
                            onClick={() => validateMilestone(selectedPilot.id, m.milestoneNumber)}
                            className="h-8 text-xs font-bold bg-sky-600 hover:bg-sky-700 text-white cursor-pointer"
                          >
                            Validate (Audit)
                          </Button>
                        )}
                        {m.status === 'VALIDATED' && (
                          <Button
                            size="sm"
                            onClick={() => releaseMilestonePayment(selectedPilot.id, m.milestoneNumber)}
                            className="h-8 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                          >
                            Release Grant
                          </Button>
                        )}
                        {m.status === 'PAID' && (
                          <span className="text-[11px] font-mono text-emerald-600 font-semibold">
                            Ref: {m.paymentRef || 'TREASURY-MH'}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* 6. Validation Certificate & Scale-Up Decision Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Independent Validation Sign-off */}
            <Card className="rounded-2xl border border-border bg-card p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-border/70">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-emerald-600" />
                    <h3 className="font-bold text-base text-foreground">Independent Validation Report</h3>
                  </div>
                  <span className="text-[11px] font-mono text-emerald-600 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">
                    Score: {selectedPilot.validationReport?.kpiAchievementScore || 95}/100
                  </span>
                </div>

                {selectedPilot.validationReport ? (
                  <div className="space-y-3 text-xs leading-relaxed">
                    <div>
                      <span className="text-muted-foreground block text-[11px]">Empanelled Validator</span>
                      <span className="font-bold text-foreground text-sm">{selectedPilot.validationReport.validatorName}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[11px]">Audit Methodology</span>
                      <p className="text-foreground/90">{selectedPilot.validationReport.methodology}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[11px]">Certified Findings</span>
                      <p className="text-foreground/90">{selectedPilot.validationReport.findings}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Independent field audit will be conducted by an empanelled technical bureau (such as VJTI or IIT Bombay) upon completion of Milestone 2 deliverables.
                  </p>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Verdict:</span>
                <span className="font-bold text-emerald-600 uppercase">
                  RECOMMENDATION: {selectedPilot.validationReport?.recommendation || 'SCALE'}
                </span>
              </div>
            </Card>

            {/* Scale-Up Decision Card */}
            <Card className="rounded-2xl border border-border bg-card p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-border/70">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <h3 className="font-bold text-base text-foreground">Scale-Up & Procurement Decision</h3>
                  </div>
                  <span className="text-[11px] font-mono text-primary font-bold bg-primary/10 px-2 py-0.5 rounded">
                    Statutory Verdict
                  </span>
                </div>

                {selectedPilot.scaleUpDecision ? (
                  <div className="space-y-3 text-xs leading-relaxed">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-muted-foreground block text-[11px]">Decision Verdict</span>
                        <span className="font-black text-emerald-600 text-sm">{selectedPilot.scaleUpDecision.decision}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-muted-foreground block text-[11px]">Procurement Pathway</span>
                        <span className="font-bold text-primary">{selectedPilot.scaleUpDecision.procurementPathway}</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[11px]">Statutory Rationale</span>
                      <p className="text-foreground/90">{selectedPilot.scaleUpDecision.rationale}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[11px]">Decided By</span>
                      <span className="font-semibold text-foreground">{selectedPilot.scaleUpDecision.decidedBy}</span>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Following independent validation, the MSInS Governing Committee evaluates pilot telemetry to grant direct procurement scale-up under GFR Rule 194 or list on GeM Startup Runway.
                    </p>
                    <div className="mt-4">
                      <Button
                        size="sm"
                        onClick={() => setScaleUpModal(true)}
                        className="w-full text-xs font-bold cursor-pointer"
                      >
                        Record Scale-Up Decision
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {selectedPilot.scaleUpDecision && (
                <div className="mt-4 pt-3 border-t border-border flex flex-col gap-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Certified Date:</span>
                    <span className="font-mono text-foreground">{selectedPilot.scaleUpDecision.decidedAt.slice(0, 10)}</span>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => setGemModalOpen(true)}
                    className="w-full text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white gap-2 cursor-pointer shadow-xs mt-1"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    <span>Inspect GeM Startup Runway Export (Demo Integration)</span>
                  </Button>
                </div>
              )}
            </Card>
          </div>

          {/* 7. Chronological Status History Log */}
          <Card className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-xs">
            <h3 className="text-lg font-bold text-foreground font-serif mb-4 pb-3 border-b border-border/70">
              Chronological Audit Trail & Status History
            </h3>
            <div className="space-y-4">
              {selectedPilot.history.map((h, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs pb-3 border-b border-border/40 last:border-0">
                  <div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 font-mono text-[10px] font-bold">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <span className="font-bold text-foreground">{h.stage}</span>
                      <span className="text-[11px] text-muted-foreground font-mono">{h.timestamp}</span>
                    </div>
                    <p className="text-muted-foreground mt-0.5">{h.note}</p>
                    <span className="text-[10px] text-primary/80 font-mono">Actor: {h.actor}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </main>
      )}

      {/* Deliverable Submission Modal */}
      <Dialog open={deliverableModal.open} onOpenChange={(open) => setDeliverableModal((prev) => ({ ...prev, open }))}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Submit Milestone Deliverable</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-xs py-2">
            <div>
              <label className="font-bold text-foreground block mb-1">Deliverable Document / Telemetry URL</label>
              <Input
                type="text"
                value={deliverableUrl}
                onChange={(e) => setDeliverableUrl(e.target.value)}
                className="text-xs"
              />
            </div>
            <div>
              <label className="font-bold text-foreground block mb-1">Submission Notes & Technical Highlights</label>
              <textarea
                value={deliverableNotes}
                onChange={(e) => setDeliverableNotes(e.target.value)}
                rows={3}
                className="w-full rounded-md border border-border bg-background p-2 text-xs"
              />
            </div>
          </div>
          <DialogFooter>
            <Button size="sm" variant="outline" onClick={() => setDeliverableModal((prev) => ({ ...prev, open: false }))}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleDeliverableSubmit} className="font-bold text-xs">
              Confirm & Submit to Validator
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Scale-Up Decision Modal */}
      <Dialog open={scaleUpModal} onOpenChange={setScaleUpModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Record Statutory Scale-Up Decision</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-xs py-2">
            <div>
              <label className="font-bold text-foreground block mb-1">Decision Verdict</label>
              <div className="grid grid-cols-3 gap-2">
                {(['SCALE', 'EXTEND', 'STOP'] as const).map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setDecisionVerdict(v)}
                    className={cn(
                      'py-2 rounded-lg border font-bold text-xs transition-colors cursor-pointer',
                      decisionVerdict === v ? 'bg-primary text-primary-foreground border-primary' : 'bg-card border-border hover:bg-secondary'
                    )}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="font-bold text-foreground block mb-1">Recommended Procurement Pathway</label>
              <select
                value={pathway}
                onChange={(e) => setPathway(e.target.value as any)}
                className="w-full rounded-md border border-border bg-background p-2 text-xs"
              >
                <option value="DIRECT_PILOT_AWARD">Direct Pilot Award (GFR Rule 194 single-source expansion)</option>
                <option value="GEM_LISTING">GeM Startup Runway Fast-Track Cataloging (Rule 149)</option>
                <option value="LIMITED_TENDER">Limited Innovation Tender with Swiss-Challenge</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-foreground block mb-1">Statutory Rationale & Justification</label>
              <textarea
                value={decisionRationale}
                onChange={(e) => setDecisionRationale(e.target.value)}
                rows={3}
                className="w-full rounded-md border border-border bg-background p-2 text-xs"
              />
            </div>
          </div>
          <DialogFooter>
            <Button size="sm" variant="outline" onClick={() => setScaleUpModal(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleScaleUpSubmit} className="font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white">
              Authorize Scale-Up
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* GeM Startup Runway Export Modal (Demo Integration) */}
      <Dialog open={gemModalOpen} onOpenChange={setGemModalOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 uppercase tracking-wider w-fit mb-1">
              <span>Demo Integration • Simulated GeM v4.2 Adapter</span>
            </div>
            <DialogTitle className="text-base font-bold text-foreground">
              Government e-Marketplace (GeM) Startup Runway Handoff
            </DialogTitle>
          </DialogHeader>

          {gemListingPayload && (
            <div className="space-y-4 text-xs py-2">
              <div className="p-3 rounded-xl bg-secondary/50 border border-border/70 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground font-mono text-[11px]">GeM Export Docket ID:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-primary">{gemListingPayload.gemDocketId}</span>
                    <button
                      type="button"
                      onClick={copyGemDocketId}
                      className="p-1 rounded hover:bg-secondary text-muted-foreground hover:text-foreground cursor-pointer"
                      title="Copy GeM ID"
                    >
                      {copiedGemId ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-muted-foreground">Catalog Category:</span>
                  <span className="font-medium text-foreground">{gemListingPayload.catalogCategory}</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-muted-foreground">Listing Pathway:</span>
                  <span className="font-bold text-amber-600 dark:text-amber-400">{gemListingPayload.procurementPathway}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-card border border-border">
                  <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Originating Department</span>
                  <span className="font-bold text-foreground text-xs">{gemListingPayload.originatingDepartment}</span>
                </div>
                <div className="p-3 rounded-lg bg-card border border-border">
                  <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Awarded Startup</span>
                  <span className="font-bold text-foreground text-xs">{gemListingPayload.startupName}</span>
                  <span className="text-[10px] text-muted-foreground font-mono block">{gemListingPayload.dpiitNumber}</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-card border border-border space-y-1.5">
                <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Certified Sandbox Outcomes</span>
                {gemListingPayload.certifiedKpis.map((k, i) => (
                  <div key={i} className="flex items-center gap-2 text-[11px]">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span className="font-medium text-foreground">{k}</span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Statutory Ceiling (Rule 149)</span>
                  <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400 text-xs">{gemListingPayload.statutoryCeilingINR}</span>
                </div>
                <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                  <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Procurement Indent Status</span>
                  <span className="font-mono font-bold text-primary text-xs">{gemListingPayload.exportStatus}</span>
                </div>
              </div>

              <p className="text-[11px] text-muted-foreground leading-relaxed italic">
                * Note: This is a demo integration simulation. In production, this handoff signs and posts the audit certificate directly to the Government e-Marketplace API.
              </p>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button size="sm" variant="outline" onClick={downloadGemJson} className="gap-1.5 text-xs font-bold">
              <Download className="h-3.5 w-3.5" />
              <span>Download GeM Package (.json)</span>
            </Button>
            <Button size="sm" onClick={() => setGemModalOpen(false)} className="text-xs font-bold">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
