import { useState } from 'react';
import { Link } from 'react-router';
import {
  Sparkles,
  ExternalLink,
  Layers,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Compass,
  ArrowRight,
  ShieldAlert,
  GraduationCap,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StateSeal } from '@/components/shared/StateSeal';

export default function PrototypePage() {
  const [activeTab, setActiveTab] = useState<'embed' | 'info'>('embed');

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 space-y-8">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-950 text-white p-6 sm:p-8 border border-emerald-800/40 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <StateSeal size="md" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Interactive Prototype Seam
                </span>
                <span className="text-xs text-white/50">•</span>
                <span className="text-xs text-emerald-200 font-mono">Matt Pocock Prototype Skill</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black font-heading tracking-tight mt-1 text-white">
                Complaint Verification & Solver State Machine
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <a
              href="/prototype.html"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md"
            >
              <span>Open Standalone Prototype</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
            <a
              href="/architecture-review.html"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-emerald-100 text-xs font-bold border border-white/20 transition-all"
            >
              <span>Architecture Review</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-4xl">
          This interactive logic prototype answers the core architectural question: 
          <em> "Does the 6-factor AI verification pipeline, Nodal Officer escalation, citizen appeal override, and academic solver matching feel robust and clear to non-technical stakeholders?"</em>
        </p>

        {/* Quick Nav Tabs */}
        <div className="flex items-center gap-2 pt-2 border-t border-white/10">
          <button
            onClick={() => setActiveTab('embed')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'embed'
                ? 'bg-white text-slate-900 font-bold'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            Live Embedded Workbench
          </button>
          <button
            onClick={() => setActiveTab('info')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'info'
                ? 'bg-white text-slate-900 font-bold'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            Scenario Matrix & Invariants
          </button>
        </div>
      </div>

      {activeTab === 'embed' ? (
        <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden min-h-[850px] flex flex-col">
          <div className="bg-muted/50 px-4 py-2.5 border-b border-border flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-mono text-[11px] flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Runtime Sandbox: /prototype.html
            </span>
            <a
              href="/prototype.html"
              target="_blank"
              rel="noreferrer"
              className="hover:text-primary transition-colors flex items-center gap-1"
            >
              <span>Full Screen Window</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
          <iframe
            src="/prototype.html"
            title="SamadhanSetu Verification Logic Prototype"
            className="w-full flex-1 min-h-[800px] border-0"
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="border-border shadow-xs">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                  Scenario 1
                </span>
                <span className="text-xs text-muted-foreground font-mono">Score ≥ 80</span>
              </div>
              <CardTitle className="text-base mt-2">Auto-Approval Fast Track</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground space-y-2 leading-relaxed">
              <p>
                A geotagged submission with clean EXIF photos and high textual coherence skips human officer bottlenecks and automatically dispatches to municipal engineering crews.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border shadow-xs">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-400">
                  Scenario 2
                </span>
                <span className="text-xs text-muted-foreground font-mono">Score 40–79</span>
              </div>
              <CardTitle className="text-base mt-2">Nodal Officer Amber Review</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground space-y-2 leading-relaxed">
              <p>
                Borderline reports with generic landmarks are routed to the District Nodal Officer queue with flag chips for physical field inspection.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border shadow-xs">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-rose-500/10 text-rose-700 dark:text-rose-400">
                  Scenario 3
                </span>
                <span className="text-xs text-muted-foreground font-mono">Score &lt; 40</span>
              </div>
              <CardTitle className="text-base mt-2">Citizen Appeal Override</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground space-y-2 leading-relaxed">
              <p>
                Auto-rejected low quality submissions offer a one-click Appeal mechanism. Furnishing specific landmark proof overrides AI auto-rejection and triggers human re-review.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border shadow-xs">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-slate-500/10 text-slate-700 dark:text-slate-400">
                  Scenario 4
                </span>
                <span className="text-xs text-muted-foreground font-mono">Administrative</span>
              </div>
              <CardTitle className="text-base mt-2">Officer Rejection with Audit</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground space-y-2 leading-relaxed">
              <p>
                Officers cannot arbitrarily dismiss a docket. Every rejection requires an official public reason (e.g. NHAI central highway jurisdiction) logged permanently on the public tracker.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border shadow-xs md:col-span-2">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-teal-500/10 text-teal-700 dark:text-teal-400">
                  Scenario 5 (SIH PS-043 Core)
                </span>
                <span className="text-xs text-muted-foreground font-mono">Academic Exchange</span>
              </div>
              <CardTitle className="text-base mt-2">Academic Solver & University Consortium Matching</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground space-y-2 leading-relaxed">
              <p>
                Complex recurring problems (e.g., deep arsenic filtration in Deoghar or coal haulage road fatigue in Dhanbad) are escalated by Nodal Officers to academic institutions (IIT ISM Dhanbad, BIT Mesra, NIT Jamshedpur) to form Solver Teams and test field engineering pilots.
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
