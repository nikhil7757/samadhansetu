import { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft,
  Building2,
  Sparkles,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  ShieldCheck,
  Plus,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { MAHARASHTRA_DISTRICTS } from '@/lib/utils';
import { INNOVATION_SECTORS } from '@/config/platform';
import { evaluateChallengeQuality } from '@/lib/aiScoring';
import { useNavSetu } from '@/lib/navsetuStore';
import { useAuth } from '@/lib/auth';
import { cn } from '@/lib/utils';

export default function ReportPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addChallenge } = useNavSetu();

  const [department, setDepartment] = useState(() => user?.organizationName || user?.department || 'Department of Agriculture');
  const [district, setDistrict] = useState(() => user?.district || 'Nashik');
  const [sector, setSector] = useState('AGRICULTURE');
  const [title, setTitle] = useState('');
  const [desiredOutcome, setDesiredOutcome] = useState('');
  const [kpiInput, setKpiInput] = useState('');
  const [kpis, setKpis] = useState<string[]>([
    'Early detection accuracy > 92%',
    'Alert dispatch turnaround < 18 hours',
    'Farmer input cost reduction > 30%',
  ]);
  const [budgetMin, setBudgetMin] = useState(10);
  const [budgetMax, setBudgetMax] = useState(20);
  const [duration, setDuration] = useState(6);
  const [dataSensitivity, setDataSensitivity] = useState<'PUBLIC' | 'INTERNAL' | 'CONFIDENTIAL' | 'RESTRICTED'>('INTERNAL');
  const [ipPreference, setIpPreference] = useState<'STARTUP_OWNED' | 'JOINT_IP' | 'GOVT_EXCLUSIVE_LICENSE'>('STARTUP_OWNED');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Compute live Challenge Quality Score as user types
  const quality = useMemo(() => {
    return evaluateChallengeQuality({
      title,
      desiredOutcome,
      successMetrics: kpis,
      budgetMin,
      budgetMax,
      pilotDurationMonths: duration,
      dataSensitivity,
      ipPreference,
    });
  }, [title, desiredOutcome, kpis, budgetMin, budgetMax, duration, dataSensitivity, ipPreference]);

  const addKpi = () => {
    if (kpiInput.trim() && !kpis.includes(kpiInput.trim())) {
      setKpis([...kpis, kpiInput.trim()]);
      setKpiInput('');
    }
  };

  const removeKpi = (index: number) => {
    setKpis(kpis.filter((_, i) => i !== index));
  };

  const loadTemplate = () => {
    setTitle('Edge AI Early Crop Pest & Disease Diagnostic Network for Smallholders');
    setDepartment('Department of Agriculture');
    setDistrict('Nashik');
    setSector('AGRICULTURE');
    setDesiredOutcome(
      'Automated visual detection of Pink Bollworm and Spodoptera infestations at larval stage without reliable 4G connectivity, reducing farmer pesticide expenditure by at least 35%.'
    );
    setKpis([
      'Diagnostic accuracy > 93% on edge vision nodes',
      'Field alert turnaround < 18 hours via SMS',
      'Pesticide spend reduction > 30%',
      'Store-and-forward edge syncing resilience',
    ]);
    setBudgetMin(12);
    setBudgetMax(20);
    setDuration(6);
    setDataSensitivity('INTERNAL');
    setIpPreference('STARTUP_OWNED');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !desiredOutcome.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await addChallenge({
        title,
        department,
        district,
        sector,
        desiredOutcome,
        successMetrics: kpis,
        budgetMin,
        budgetMax,
        pilotDurationMonths: duration,
        dataSensitivity,
        ipPreference,
      });
      navigate(`/track/${res.challenge.id}`);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-10 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Navigation back bar */}
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="text-xs font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Platform Home</span>
          </Link>
          <span className="text-xs font-mono text-muted-foreground">
            MSInS • Outcome-Based Intake Portal
          </span>
        </div>

        {/* Page Header */}
        <div className="space-y-3 border-b border-border/80 pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-wide border border-primary/20 shadow-2xs">
            <Building2 className="h-3.5 w-3.5" />
            <span>Government Department Innovation Portal</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-foreground font-serif">
            Post an Outcome-Based Challenge
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-3xl leading-relaxed">
            Specify public needs by desired outcomes and quantifiable KPIs rather than proprietary hardware/software specifications.
            Our real-time AI Formulation Engine guides you to maximize clarity and attract eligible DPIIT startups.
          </p>
        </div>

        {/* Template Pre-fill Alert Banner */}
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-primary shrink-0" />
            <div className="text-xs">
              <span className="font-bold text-foreground block">Looking for approved standard formulation templates?</span>
              <span className="text-muted-foreground">
                Pre-fill this form using standard outcome-based matrices formulated under MSInS regulations.
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={loadTemplate}
              className="text-xs font-bold border-primary/40 text-primary hover:bg-primary/10 cursor-pointer"
            >
              Pre-Fill Agritech Sample
            </Button>
            <Link to="/templates">
              <Button type="button" variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-foreground cursor-pointer">
                Browse Library
              </Button>
            </Link>
          </div>
        </div>

        {/* Main Grid: Form + Live Quality Score Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Column (2 spans) */}
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <Card className="p-6 rounded-2xl border border-border bg-card shadow-xs space-y-5">
                <h3 className="text-base font-bold text-foreground border-b border-border pb-3">
                  1. Administrative Particulars
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="font-bold text-foreground block mb-1">Department / Directorate</label>
                    <Input
                      type="text"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      placeholder="e.g. Public Health Department"
                      className="text-xs"
                      required
                    />
                  </div>

                  <div>
                    <label className="font-bold text-foreground block mb-1">Target District (Maharashtra)</label>
                    <select
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full h-9 rounded-md border border-border bg-background px-3 text-xs"
                    >
                      {MAHARASHTRA_DISTRICTS.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="font-bold text-foreground block mb-1">Innovation Sector</label>
                    <select
                      value={sector}
                      onChange={(e) => setSector(e.target.value)}
                      className="w-full h-9 rounded-md border border-border bg-background px-3 text-xs"
                    >
                      {INNOVATION_SECTORS.map((s) => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </Card>

              <Card className="p-6 rounded-2xl border border-border bg-card shadow-xs space-y-5">
                <h3 className="text-base font-bold text-foreground border-b border-border pb-3">
                  2. Outcome-Based Formulation
                </h3>

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="font-bold text-foreground block mb-1">
                      Challenge Title (Outcome-Oriented)
                    </label>
                    <Input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Edge AI Early Crop Pest & Infestation Warning for Smallholder Farmers"
                      className="text-xs"
                      required
                    />
                    <span className="text-[10px] text-muted-foreground mt-1 block">
                      Avoid naming specific brands or proprietary architectures. State what functional need must be addressed.
                    </span>
                  </div>

                  <div>
                    <label className="font-bold text-foreground block mb-1">
                      Desired Measurable Public Outcome
                    </label>
                    <textarea
                      value={desiredOutcome}
                      onChange={(e) => setDesiredOutcome(e.target.value)}
                      placeholder="What quantifiable improvement must this solution deliver? (e.g. Detect Pink Bollworm at larval stage within 24 hours of emergence, reducing pesticide expenditure by 35% without requiring active 4G connectivity)"
                      rows={4}
                      className="w-full rounded-md border border-border bg-background p-3 text-xs leading-relaxed"
                      required
                    />
                  </div>

                  {/* Success Metrics / KPIs Builder */}
                  <div>
                    <label className="font-bold text-foreground block mb-1">
                      Measurable Success Metrics / KPIs
                    </label>
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        value={kpiInput}
                        onChange={(e) => setKpiInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addKpi(); } }}
                        placeholder="e.g. 95% detection accuracy, < 24h field alert turnaround"
                        className="text-xs flex-1"
                      />
                      <Button type="button" size="sm" onClick={addKpi} className="text-xs font-bold gap-1">
                        <Plus className="h-3.5 w-3.5" />
                        <span>Add KPI</span>
                      </Button>
                    </div>

                    {/* KPI chips */}
                    <div className="mt-3 flex flex-wrap gap-2">
                      {kpis.map((kpi, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs bg-secondary text-foreground font-medium border border-border"
                        >
                          <span>{kpi}</span>
                          <button
                            type="button"
                            onClick={() => removeKpi(idx)}
                            className="text-muted-foreground hover:text-destructive cursor-pointer"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6 rounded-2xl border border-border bg-card shadow-xs space-y-5">
                <h3 className="text-base font-bold text-foreground border-b border-border pb-3">
                  3. Sandbox Pilot Scope & Commercials
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="font-bold text-foreground block mb-1">
                      Min Pilot Grant (₹ Lakhs)
                    </label>
                    <Input
                      type="number"
                      value={budgetMin}
                      onChange={(e) => setBudgetMin(Number(e.target.value))}
                      className="text-xs font-mono"
                      min={1}
                      max={50}
                    />
                  </div>

                  <div>
                    <label className="font-bold text-foreground block mb-1">
                      Max Pilot Grant (₹ Lakhs)
                    </label>
                    <Input
                      type="number"
                      value={budgetMax}
                      onChange={(e) => setBudgetMax(Number(e.target.value))}
                      className="text-xs font-mono"
                      min={budgetMin}
                      max={100}
                    />
                  </div>

                  <div>
                    <label className="font-bold text-foreground block mb-1">
                      Sandbox Pilot Duration (Months)
                    </label>
                    <Input
                      type="number"
                      value={duration}
                      onChange={(e) => setDuration(Number(e.target.value))}
                      className="text-xs font-mono"
                      min={3}
                      max={18}
                    />
                  </div>

                  <div>
                    <label className="font-bold text-foreground block mb-1">Data Sensitivity Classification</label>
                    <select
                      value={dataSensitivity}
                      onChange={(e) => setDataSensitivity(e.target.value as any)}
                      className="w-full h-9 rounded-md border border-border bg-background px-3 text-xs"
                    >
                      <option value="PUBLIC">Level 1: Public Domain Data</option>
                      <option value="INTERNAL">Level 2: Internal Departmental (Non-PII)</option>
                      <option value="CONFIDENTIAL">Level 3: Confidential & PII Records</option>
                      <option value="RESTRICTED">Level 4: Restricted / Critical Infrastructure</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="font-bold text-foreground block mb-1">Intellectual Property Ownership Terms</label>
                    <select
                      value={ipPreference}
                      onChange={(e) => setIpPreference(e.target.value as any)}
                      className="w-full h-9 rounded-md border border-border bg-background px-3 text-xs"
                    >
                      <option value="STARTUP_OWNED">Startup Retains Core IP + Perpetual Govt License (Recommended)</option>
                      <option value="JOINT_IP">Joint Department–Startup IP Co-Ownership</option>
                      <option value="GOVT_EXCLUSIVE_LICENSE">Government Exclusive Departmental License</option>
                    </select>
                  </div>
                </div>
              </Card>

              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting || !title || !desiredOutcome}
                className="w-full h-12 font-bold text-sm bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white shadow-md cursor-pointer"
              >
                <span>{isSubmitting ? 'Submitting Challenge...' : 'Submit Challenge for MSInS Review'}</span>
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </form>
          </div>

          {/* Live AI Challenge Quality Score Card Sidebar */}
          <div className="space-y-6">
            <Card className="rounded-2xl border border-border bg-card p-6 shadow-xs sticky top-24">
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <div>
                  <span className="text-[11px] font-mono font-bold text-primary uppercase">AI SCORER</span>
                  <h4 className="text-base font-bold text-foreground">Challenge Quality Score</h4>
                </div>
                <div
                  className={cn(
                    'h-12 w-12 rounded-xl flex items-center justify-center font-black text-lg font-mono border-2 shadow-xs',
                    quality.score >= 75
                      ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/40'
                      : quality.score >= 50
                      ? 'bg-amber-500/10 text-amber-600 border-amber-500/40'
                      : 'bg-rose-500/10 text-rose-600 border-rose-500/40'
                  )}
                >
                  {quality.score}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                  <div
                    className={cn(
                      'h-full rounded-full transition-all duration-300',
                      quality.score >= 75 ? 'bg-emerald-600' : quality.score >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                    )}
                    style={{ width: `${quality.score}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-[10px] text-muted-foreground mt-1">
                  <span>Threshold: 70/100</span>
                  <span className="font-semibold text-foreground">
                    {quality.isReadyForPublication ? '✅ Ready for Publication' : '⚠️ Refinement Needed'}
                  </span>
                </div>
              </div>

              {/* Breakdown Matrix */}
              <div className="mt-6 space-y-2.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Outcome vs Prescriptive</span>
                  <span className="font-mono font-bold text-foreground">{quality.outcomeScore}/35</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Quantified Success KPIs</span>
                  <span className="font-mono font-bold text-foreground">{quality.kpiScore}/30</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Budget & Timeline Realism</span>
                  <span className="font-mono font-bold text-foreground">{quality.realismScore}/20</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Data/IP Governance</span>
                  <span className="font-mono font-bold text-foreground">{quality.complianceScore}/15</span>
                </div>
              </div>

              {/* Formulation Suggestions */}
              {quality.suggestions.length > 0 && (
                <div className="mt-6 pt-4 border-t border-border space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400">
                    <Lightbulb className="h-4 w-4" />
                    <span>AI Formulation Guidance:</span>
                  </div>
                  <ul className="space-y-1.5 text-[11px] text-muted-foreground">
                    {quality.suggestions.map((s, i) => (
                      <li key={i} className="flex items-start gap-1.5 leading-snug">
                        <span className="text-amber-500 shrink-0">•</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Verified Flags */}
              {quality.flags.length > 0 && (
                <div className="mt-4 pt-3 border-t border-border space-y-1">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase font-mono block">
                    Verified Signals:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {quality.flags.slice(0, 4).map((f, i) => (
                      <span key={i} className="px-2 py-0.5 rounded text-[10px] font-mono bg-secondary text-foreground">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
