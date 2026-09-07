import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import {
  BarChart3,
  ShieldCheck,
  CheckCircle2,
  Clock,
  XCircle,
  TrendingUp,
  Award,
  Users,
  Layers,
  ArrowRight,
  Sparkles,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AnimatedStatCounter } from '@/components/shared/AnimatedStatCounter';
import { getPlatformStats, getStoredComplaints } from '@/lib/complaints';

export default function AdminDashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [stats] = useState(() => getPlatformStats());
  const [complaints] = useState(() => getStoredComplaints());

  const pendingCount = complaints.filter(
    (c) => c.status === 'pending_officer' || c.status === 'officer_reviewing'
  ).length;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-2">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>State Nodal Oversight</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
            Platform Analytics & Verification Telemetry
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-2xl">
            Government of Jharkhand Civic Redressal Performance Metrics • SIH 2026 Problem Statement 043
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => navigate('/admin/pending')}
            className="gap-2 bg-accent hover:bg-accent-hover text-accent-foreground font-bold shadow-sm"
          >
            <Clock className="h-4 w-4" />
            <span>Review Queue ({pendingCount})</span>
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/dashboard')}
            className="text-xs font-semibold"
          >
            Impact Graphs
          </Button>
        </div>
      </div>

      {/* Primary KPI Grid (6 Metric Cards as Requested) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 1. Total Complaints */}
        <Card className="p-6 rounded-2xl border-border bg-card shadow-xs card-hover-lift">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold mb-2">
            <span>Total Grievances Indexed</span>
            <Layers className="h-4 w-4 text-primary" />
          </div>
          <div className="text-3xl sm:text-4xl font-black text-foreground">
            <AnimatedStatCounter value={stats.totalComplaints} />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Crowdsourced across all 24 Jharkhand administrative districts
          </p>
        </Card>

        {/* 2. AI Auto-Approved % */}
        <Card className="p-6 rounded-2xl border-border bg-card shadow-xs card-hover-lift">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold mb-2">
            <span>AI Auto-Approved Rate</span>
            <Sparkles className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="text-3xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-400">
            <AnimatedStatCounter value={stats.autoApprovedPct} suffix="%" />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            High authenticity confidence (Score ≥ 80) auto-forwarded immediately
          </p>
        </Card>

        {/* 3. AI Auto-Rejected % */}
        <Card className="p-6 rounded-2xl border-border bg-card shadow-xs card-hover-lift">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold mb-2">
            <span>AI Auto-Rejected Rate</span>
            <XCircle className="h-4 w-4 text-rose-600" />
          </div>
          <div className="text-3xl sm:text-4xl font-black text-rose-600 dark:text-rose-400">
            <AnimatedStatCounter value={stats.autoRejectedPct} suffix="%" />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Low quality or spam (Score &lt; 40); 100% appealable with human override
          </p>
        </Card>

        {/* 4. Officer Overturn Rate */}
        <Card className="p-6 rounded-2xl border-border bg-card shadow-xs card-hover-lift">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold mb-2">
            <span>Officer Overturn Rate</span>
            <RotateCcw className="h-4 w-4 text-amber-600" />
          </div>
          <div className="text-3xl sm:text-4xl font-black text-amber-600 dark:text-amber-400">
            <AnimatedStatCounter value={stats.overturnRatePct} suffix="%" />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Percentage of flagged grievances verified and greenlit after human review
          </p>
        </Card>

        {/* 5. Average Resolution Time */}
        <Card className="p-6 rounded-2xl border-border bg-card shadow-xs card-hover-lift">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold mb-2">
            <span>Avg. Resolution Time</span>
            <Clock className="h-4 w-4 text-primary" />
          </div>
          <div className="text-3xl sm:text-4xl font-black text-foreground">
            <AnimatedStatCounter value={stats.avgResolutionTimeDays} decimals={1} suffix=" Days" />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            From citizen report submission to independent lab/field sign-off
          </p>
        </Card>

        {/* 6. Total Resolved Ground Cases */}
        <Card className="p-6 rounded-2xl border-border bg-card shadow-xs card-hover-lift">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold mb-2">
            <span>Verified Resolutions</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="text-3xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-400">
            <AnimatedStatCounter value={stats.resolvedCount} />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Permanent infrastructure fixes delivered by universities & CSR
          </p>
        </Card>
      </div>

      {/* Fast Action Shortcuts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
        <div
          onClick={() => navigate('/admin/pending')}
          className="p-5 rounded-2xl border border-border bg-card hover:border-primary/50 transition-all cursor-pointer flex items-center justify-between card-hover-lift"
        >
          <div className="space-y-1">
            <span className="text-sm font-bold text-foreground flex items-center gap-2">
              <Clock className="h-4 w-4 text-amber-600" />
              Inspect Pending Officer Verification Queue
            </span>
            <p className="text-xs text-muted-foreground">
              {pendingCount} grievances currently require officer inspection and determination.
            </p>
          </div>
          <ArrowRight className="h-5 w-5 text-primary shrink-0" />
        </div>

        <div
          onClick={() => navigate('/admin/matches')}
          className="p-5 rounded-2xl border border-border bg-card hover:border-primary/50 transition-all cursor-pointer flex items-center justify-between card-hover-lift"
        >
          <div className="space-y-1">
            <span className="text-sm font-bold text-foreground flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              Manage Multi-Stakeholder University-CSR Matches
            </span>
            <p className="text-xs text-muted-foreground">
              Assign university student innovation teams and industry CSR milestone co-funding.
            </p>
          </div>
          <ArrowRight className="h-5 w-5 text-primary shrink-0" />
        </div>
      </div>
    </div>
  );
}
