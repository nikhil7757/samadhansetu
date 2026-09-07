import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router';
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
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { QuickReportWidget } from '@/components/shared/QuickReportWidget';
import { AnimatedStatCounter } from '@/components/shared/AnimatedStatCounter';
import { getPlatformStats, getStoredComplaints } from '@/lib/complaints';

export default function Landing() {
  const { t } = useTranslation();
  const navigate = useNavigate();
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
              className="bg-accent hover:bg-accent-hover text-accent-foreground font-extrabold shadow-md gap-2 h-12 px-7 rounded-xl cursor-pointer text-sm"
            >
              <span>Report a Problem</span>
              <ArrowDown className="h-4 w-4 animate-bounce" />
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
            <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
              File Your Grievance Front-and-Center
            </h2>
            <p className="text-xs text-muted-foreground">
              Select category, describe the issue, and attach photo evidence. Our AI pipeline verifies and routes it automatically.
            </p>
          </div>

          <QuickReportWidget />
        </div>
      </section>

      {/* 3. Live Stats Bar (Pulled from Real Data with Animated Counters) */}
      <section className="py-10 bg-card border-b border-border shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            {/* Stat 1: Resolved */}
            <div className="p-6 rounded-2xl border border-border/80 bg-secondary/20 flex flex-col justify-center space-y-1 card-hover-lift">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                Total Complaints Resolved
              </span>
              <div className="text-4xl sm:text-5xl font-black text-emerald-700 dark:text-emerald-400">
                <AnimatedStatCounter value={stats.resolvedCount} />
              </div>
              <span className="text-xs text-muted-foreground">
                Verified ground completions across Jharkhand
              </span>
            </div>

            {/* Stat 2: In Review */}
            <div className="p-6 rounded-2xl border border-border/80 bg-secondary/20 flex flex-col justify-center space-y-1 card-hover-lift">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-center gap-1.5">
                <Clock className="h-4 w-4 text-amber-600" />
                Currently in Review
              </span>
              <div className="text-4xl sm:text-5xl font-black text-amber-600 dark:text-amber-400">
                <AnimatedStatCounter value={stats.inReviewCount} />
              </div>
              <span className="text-xs text-muted-foreground">
                Active in District Nodal Officer queues
              </span>
            </div>

            {/* Stat 3: Avg Resolution Time */}
            <div className="p-6 rounded-2xl border border-border/80 bg-secondary/20 flex flex-col justify-center space-y-1 card-hover-lift">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-center gap-1.5">
                <Award className="h-4 w-4 text-primary" />
                Average Resolution Time
              </span>
              <div className="text-4xl sm:text-5xl font-black text-foreground">
                <AnimatedStatCounter value={stats.avgResolutionTimeDays} decimals={1} suffix=" Days" />
              </div>
              <span className="text-xs text-muted-foreground">
                Real-time turnaround telemetry (Target &lt; 7 days)
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
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-primary uppercase tracking-wider bg-primary/10 px-3 py-1 rounded-md">
                <Search className="h-3.5 w-3.5" />
                Live Status Tracker
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
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
                className="h-12 px-6 font-bold bg-primary hover:bg-primary-hover text-primary-foreground gap-2 cursor-pointer shadow-sm rounded-xl"
              >
                <span>Track Status</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>

            <div className="pt-2 border-t border-dashed border-border/80">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block mb-2">
                Click any sample tracking ID to test live lifecycle views:
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
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 uppercase tracking-wider bg-emerald-500/10 px-2.5 py-0.5 rounded-md mb-2">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Proof of Ground Resolution
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              Recently Resolved Complaints
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Real community issues fixed on the ground through academic solvers, CSR funding, and district engineers.
            </p>
          </div>

          <Button
            variant="outline"
            onClick={() => navigate('/problems')}
            className="text-xs font-bold gap-1.5 shrink-0"
          >
            <span>Browse All 24 Districts</span>
            <ChevronRight className="h-3.5 w-3.5" />
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
                <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
