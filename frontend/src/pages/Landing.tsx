import { useState, useRef } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Search,
  Sparkles,
  MapPin,
  Flame,
  Award,
  ChevronRight,
  ArrowDown,
  Layers,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { QuickReportWidget } from '@/components/shared/QuickReportWidget';
import { AnimatedStatCounter } from '@/components/shared/AnimatedStatCounter';
import { PrototypeSwitcher } from '@/components/shared/PrototypeSwitcher';
import { getPlatformStats, getStoredComplaints } from '@/lib/complaints';

export default function Landing() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const variant = searchParams.get('variant')?.toUpperCase() || 'A';
  const quickReportRef = useRef<HTMLDivElement>(null);

  const [trackInput, setTrackInput] = useState('');
  const [stats] = useState(() => getPlatformStats());
  const [complaints] = useState(() => getStoredComplaints());

  const resolvedComplaints = complaints
    .filter((c) => c.status === 'resolved')
    .slice(0, 3);

  const handleScrollToReport = () => {
    quickReportRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackInput.trim()) return;
    navigate(`/track/${encodeURIComponent(trackInput.trim().toUpperCase())}`);
  };

  const sampleTrackingIds = [
    { id: 'SS-2026-000481', label: 'In Progress' },
    { id: 'SS-2026-000482', label: 'Pending Officer' },
    { id: 'SS-2026-000484', label: 'Resolved' },
    { id: 'SS-2026-000485', label: 'Auto-Rejected (Appealable)' },
  ];

  if (variant === 'B') {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <VariantBExecutiveTelemetry stats={stats} complaints={complaints} navigate={navigate} />
        <PrototypeSwitcher />
      </div>
    );
  }

  if (variant === 'C') {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <VariantCGuidedJourney navigate={navigate} />
        <PrototypeSwitcher />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-14 sm:pt-20 sm:pb-18 border-b border-border bg-gradient-to-b from-primary/10 via-background to-background text-center px-4 sm:px-6">
        {/* Subtle patterned background grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px]" />

        <div className="relative max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-wide border border-primary/20">
            <ShieldCheck className="h-4 w-4" />
            <span>Government of Jharkhand • SIH 2026 Problem Statement 043</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-foreground leading-[1.12]">
            Bridging Civic Grievances to <br />
            <span className="text-primary font-extrabold">Verified Ground Action</span>
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Report infrastructure, water, road, sanitation, or electrical failures across Jharkhand.
            Powered by multi-factor AI verification, student innovation squads, and CSR delivery.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Button
              size="lg"
              onClick={handleScrollToReport}
              className="bg-accent hover:bg-accent-hover text-accent-foreground font-bold shadow-md h-12 px-7 rounded-xl cursor-pointer text-sm"
            >
              <span>Report a Problem</span>
            </Button>

            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/track')}
              className="font-bold h-12 px-6 rounded-xl border-border hover:bg-secondary gap-2 text-sm"
            >
              <Search className="h-4 w-4 text-primary" />
              <span>Track Existing Complaint</span>
            </Button>
          </div>

          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Instant Public Tracking ID
            </span>
            <span className="flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-primary" /> Automated 0–100 AI Scoring
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-amber-600" /> Guaranteed Human Appeal Path
            </span>
          </div>
        </div>
      </section>

      {/* 2. Embedded Quick-Report Widget */}
      <section ref={quickReportRef} className="py-12 px-4 sm:px-6 bg-secondary/15 border-b border-border">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="text-center space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
              Report a Civic Grievance
            </h2>
            <p className="text-xs text-muted-foreground max-w-xl mx-auto">
              Select a category, describe the issue with local landmark context, and attach photo evidence. Our AI pipeline verifies and routes it automatically.
            </p>
          </div>

          <QuickReportWidget />
        </div>
      </section>

      {/* 3. Live Stats Bar (Pulled from Real Data with Animated Counters) */}
      <section className="py-10 bg-card border-b border-border shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
            {/* Stat 1: Resolved */}
            <div className="p-5 rounded-2xl border border-border/80 bg-secondary/20 flex flex-col justify-center space-y-1">
              <span className="text-xs font-semibold text-muted-foreground flex items-center justify-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                Complaints Resolved
              </span>
              <div className="text-3xl sm:text-4xl font-bold text-emerald-700 dark:text-emerald-400">
                <AnimatedStatCounter value={stats.resolvedCount} />
              </div>
              <span className="text-[11px] text-muted-foreground">
                Verified ground completions
              </span>
            </div>

            {/* Stat 2: In Review */}
            <div className="p-5 rounded-2xl border border-border/80 bg-secondary/20 flex flex-col justify-center space-y-1">
              <span className="text-xs font-semibold text-muted-foreground flex items-center justify-center gap-1.5">
                <Clock className="h-4 w-4 text-amber-600" />
                In Officer Review
              </span>
              <div className="text-3xl sm:text-4xl font-bold text-amber-600 dark:text-amber-400">
                <AnimatedStatCounter value={stats.inReviewCount} />
              </div>
              <span className="text-[11px] text-muted-foreground">
                Under Nodal Officer scrutiny
              </span>
            </div>

            {/* Stat 3: Active In Progress */}
            <div className="p-5 rounded-2xl border border-border/80 bg-secondary/20 flex flex-col justify-center space-y-1">
              <span className="text-xs font-semibold text-muted-foreground flex items-center justify-center gap-1.5">
                <Sparkles className="h-4 w-4 text-sky-600" />
                Active In-Progress
              </span>
              <div className="text-3xl sm:text-4xl font-bold text-sky-600 dark:text-sky-400">
                <AnimatedStatCounter value={stats.inProgressCount} />
              </div>
              <span className="text-[11px] text-muted-foreground">
                Assigned to field squads
              </span>
            </div>

            {/* Stat 4: Avg Resolution Time */}
            <div className="p-5 rounded-2xl border border-border/80 bg-secondary/20 flex flex-col justify-center space-y-1">
              <span className="text-xs font-semibold text-muted-foreground flex items-center justify-center gap-1.5">
                <Award className="h-4 w-4 text-primary" />
                Avg. Resolution Time
              </span>
              <div className="text-3xl sm:text-4xl font-bold text-foreground">
                <AnimatedStatCounter value={stats.avgResolutionTimeDays} decimals={1} suffix=" Days" />
              </div>
              <span className="text-[11px] text-muted-foreground">
                Real-time turnaround telemetry
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. "Track Your Complaint" Input Box */}
      <section className="py-14 bg-secondary/30 border-b border-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <Card className="border-border shadow-md rounded-2xl p-6 sm:p-8 bg-card text-center space-y-6">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-md">
                <Search className="h-3.5 w-3.5" />
                <span>Live Status Tracker</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Track Your Complaint
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto">
                Paste your public tracking ID to inspect live progress, AI authenticity metrics, and timestamped officer inspection logs.
              </p>
            </div>

            <form onSubmit={handleTrackSubmit} className="flex flex-col sm:flex-row gap-2.5 max-w-xl mx-auto">
              <div className="relative flex-1">
                <Search className="h-4 w-4 absolute left-3.5 top-3.5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="e.g. SS-2026-000481"
                  value={trackInput}
                  onChange={(e) => setTrackInput(e.target.value)}
                  className="pl-10 h-12 text-sm font-mono uppercase font-bold"
                  required
                />
              </div>
              <Button
                type="submit"
                className="h-12 px-6 font-bold bg-primary hover:bg-primary-hover text-primary-foreground cursor-pointer shadow-sm rounded-xl"
              >
                <span>Check Status</span>
              </Button>
            </form>

            <div className="pt-2 border-t border-dashed border-border/80">
              <span className="text-[11px] font-medium text-muted-foreground block mb-2">
                Click any sample tracking ID to inspect live verification states:
              </span>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {sampleTrackingIds.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => navigate(`/track/${item.id}`)}
                    className="px-3 py-1.5 rounded-lg text-xs font-mono bg-secondary hover:bg-secondary/80 text-foreground border border-border/60 transition-colors flex items-center gap-1.5 cursor-pointer font-medium"
                  >
                    <span className="font-bold text-primary">{item.id}</span>
                    <span className="text-[10px] text-muted-foreground">({item.label})</span>
                  </button>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* 5. Recent (Anonymized) Resolved Complaints as Social Proof */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-md mb-2">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Verified Ground Redressal</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Recently Resolved Complaints
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-prose">
              Real community issues resolved across Jharkhand through university solver innovation and district engineer deployment.
            </p>
          </div>

          <Button
            variant="outline"
            onClick={() => navigate('/problems')}
            className="text-xs font-bold shrink-0"
          >
            <span>Browse All 24 Districts</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {resolvedComplaints.map((c) => (
            <Card
              key={c.id}
              onClick={() => navigate(`/track/${c.id}`)}
              className="border-border rounded-2xl overflow-hidden card-hover-lift cursor-pointer bg-card flex flex-col justify-between"
            >
              <div>
                <div className="relative h-44 w-full bg-secondary overflow-hidden">
                  <img
                    src={c.media[0] || 'https://images.unsplash.com/photo-1541888946425-d0fbb186f5f8?auto=format&fit=crop&w=800&q=80'}
                    alt={c.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold shadow-xs flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Verified Resolved
                  </div>
                  <div className="absolute bottom-3 left-3 px-2 py-0.5 rounded bg-black/60 backdrop-blur-xs text-white text-[10px] font-mono font-bold">
                    {c.id}
                  </div>
                </div>

                <CardContent className="p-5 space-y-2.5">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-primary" />
                      {c.location.district}
                    </span>
                    <span>•</span>
                    <span className="capitalize font-semibold text-foreground">{c.category}</span>
                  </div>

                  <h3 className="font-bold text-sm text-foreground line-clamp-2 leading-snug">
                    {c.title}
                  </h3>

                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {c.description}
                  </p>
                </CardContent>
              </div>

              <div className="px-5 py-3 border-t border-border/60 bg-secondary/20 flex items-center justify-between text-xs text-primary font-bold">
                <span>View Verified Audit Trail</span>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Floating UI Variant Switcher per Prototype Skill */}
      <PrototypeSwitcher />
    </div>
  );
}

function VariantBExecutiveTelemetry({
  stats,
  complaints,
  navigate,
}: {
  stats: any;
  complaints: any[];
  navigate: any;
}) {
  const pending = complaints.filter(
    (c) => c.status === 'pending_officer' || c.status === 'officer_reviewing'
  );

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-800 dark:text-teal-300 text-xs font-semibold mb-1">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Variant B: Executive Command & Telemetry Layout</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Jharkhand Civic Intake & Nodal Queue Monitor
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            High-density operational layout optimized for state directors, municipal commissioners, and district nodal officers.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => navigate('/admin/pending')}
            className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs"
          >
            Review Queue ({pending.length})
          </Button>
          <Button variant="outline" onClick={() => navigate('/track')} className="text-xs">
            Track ID
          </Button>
        </div>
      </div>

      {/* 4 Telemetry Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-card border-border">
          <span className="text-[11px] font-semibold text-muted-foreground block">Verified Ground Redressals</span>
          <div className="text-2xl sm:text-3xl font-bold text-emerald-600">{stats.resolvedCount}</div>
        </Card>
        <Card className="p-4 bg-card border-border">
          <span className="text-[11px] font-semibold text-muted-foreground block">Flagged In Review</span>
          <div className="text-2xl sm:text-3xl font-bold text-amber-600">{stats.inReviewCount}</div>
        </Card>
        <Card className="p-4 bg-card border-border">
          <span className="text-[11px] font-semibold text-muted-foreground block">Active Field Squads</span>
          <div className="text-2xl sm:text-3xl font-bold text-sky-600">{stats.inProgressCount}</div>
        </Card>
        <Card className="p-4 bg-card border-border">
          <span className="text-[11px] font-semibold text-muted-foreground block">Avg. SLA Turnaround</span>
          <div className="text-2xl sm:text-3xl font-bold text-foreground">{stats.avgResolutionTimeDays} Days</div>
        </Card>
      </div>

      {/* Split Stream: Live Intake Stream (left) + Pending Inspection Queue (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-foreground">Recent Verified Grievance Intake</span>
            <span className="text-[11px] text-muted-foreground font-mono">Live Feed</span>
          </div>
          <div className="space-y-2.5">
            {complaints.slice(0, 5).map((c) => (
              <Card
                key={c.id}
                onClick={() => navigate(`/track/${c.id}`)}
                className="p-3.5 border-border hover:border-primary/40 cursor-pointer bg-card transition-all"
              >
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="font-mono font-bold text-primary">{c.id}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase bg-secondary text-muted-foreground">
                    {c.status.replace(/_/g, ' ')}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-foreground mt-1 truncate">{c.title}</h4>
                <div className="flex items-center justify-between text-[11px] text-muted-foreground mt-1.5">
                  <span>{c.location.district}</span>
                  <span className="font-mono">
                    AI Score: <strong>{c.ai_score}/100</strong>
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="lg:col-span-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-foreground">Priority Nodal Review Queue (Score 40-79)</span>
            <span className="text-[11px] text-amber-600 font-bold">{pending.length} Actionable</span>
          </div>
          <div className="space-y-2.5">
            {pending.slice(0, 4).map((c) => (
              <Card
                key={c.id}
                onClick={() => navigate(`/admin/pending`)}
                className="p-3.5 border-amber-500/30 bg-amber-500/5 hover:border-amber-500/60 cursor-pointer transition-all"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-amber-700 dark:text-amber-300">{c.id}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-200 font-bold">
                    Score: {c.ai_score}/100
                  </span>
                </div>
                <h4 className="text-xs font-bold text-foreground mt-1 line-clamp-1">{c.title}</h4>
                <div className="flex flex-wrap gap-1 mt-2">
                  {c.ai_flags.slice(0, 2).map((flag: string, i: number) => (
                    <span
                      key={i}
                      className="text-[10px] px-1.5 py-0.5 rounded bg-card border border-amber-500/20 font-mono text-muted-foreground"
                    >
                      #{flag}
                    </span>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function VariantCGuidedJourney({ navigate }: { navigate: any }) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 space-y-8">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-800 dark:text-teal-300 text-xs font-semibold">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Variant C: Citizen Guided Step-by-Step Flow</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          3-Step Guided Grievance Filing
        </h1>
        <p className="text-xs text-muted-foreground max-w-md mx-auto">
          Low cognitive load design calibrated for mobile users in rural blocks. Plain language, large touch targets, instant AI feedback.
        </p>
      </div>

      <QuickReportWidget />

      <div className="p-4 rounded-xl border border-border bg-card text-center space-y-2">
        <span className="text-xs font-semibold text-muted-foreground">Already have a tracking ID?</span>
        <div>
          <Button variant="outline" size="sm" onClick={() => navigate('/track')} className="text-xs font-bold">
            Enter Public Tracking Number
          </Button>
        </div>
      </div>
    </div>
  );
}
