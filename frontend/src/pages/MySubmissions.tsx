import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import {
  PlusCircle,
  Building2,
  Rocket,
  ShieldCheck,
  Clock,
  Sparkles,
  ArrowRight,
  MapPin,
  CreditCard,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useNavSetu } from '@/lib/navsetuStore';
import { useAuth } from '@/lib/auth';
import { cn } from '@/lib/utils';

export default function MySubmissions() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { challenges, pilots } = useNavSetu();

  const isStartupRole = user?.role === 'STARTUP' || user?.role === 'UNIVERSITY' || user?.role === 'INDUSTRY';
  const [viewMode, setViewMode] = useState<'challenges' | 'proposals'>(() =>
    isStartupRole ? 'proposals' : 'challenges'
  );

  return (
    <div className="min-h-screen bg-background py-10 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="border-b border-border/80 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-3 shadow-xs">
              <Building2 className="h-3.5 w-3.5" />
              <span>Workspace Management</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-foreground font-serif tracking-tight">
              {viewMode === 'challenges' ? 'My Department Challenges' : 'My Startup Proposals & Pilots'}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-2xl leading-relaxed">
              Track your submitted challenges, monitor incoming startup proposals, review milestone deliverable status, and track disbursed payments.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setViewMode('challenges')}
              className={cn(
                'px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer',
                viewMode === 'challenges'
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'bg-card border border-border text-muted-foreground hover:text-foreground'
              )}
            >
              My Challenges ({challenges.length})
            </button>
            <button
              type="button"
              onClick={() => setViewMode('proposals')}
              className={cn(
                'px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer',
                viewMode === 'proposals'
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'bg-card border border-border text-muted-foreground hover:text-foreground'
              )}
            >
              My Proposals & Pilots ({pilots.length})
            </button>
          </div>
        </div>

        {/* View 1: Challenges (Department View) */}
        {viewMode === 'challenges' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-muted-foreground uppercase font-mono">
                Departmental Challenges Roster
              </span>
              <Link to="/report">
                <Button size="sm" className="font-bold text-xs bg-amber-600 hover:bg-amber-700 text-white gap-1.5 cursor-pointer">
                  <PlusCircle className="h-4 w-4" />
                  <span>Post New Challenge</span>
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {challenges.map((ch) => (
                <Card key={ch.id} className="p-6 rounded-2xl border border-border bg-card flex flex-col justify-between shadow-xs space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                        {ch.id}
                      </span>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600">
                        {ch.status.replace('_', ' ')}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-foreground">{ch.title}</h3>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                      <MapPin className="h-3.5 w-3.5 text-amber-500" />
                      <span>{ch.district}, Maharashtra</span>
                      <span>•</span>
                      <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                      <span>Quality: {ch.aiQualityScore}/100</span>
                    </div>

                    <p className="text-xs text-muted-foreground mt-3 line-clamp-2 leading-relaxed">
                      {ch.desiredOutcome}
                    </p>

                    <div className="mt-4 pt-3 border-t border-border/60 flex justify-between items-center text-xs font-mono">
                      <span>Grant: ₹{ch.budgetMin}L – ₹{ch.budgetMax}L</span>
                      <span>{ch.pilotDurationMonths} Months</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border flex items-center justify-between gap-3 text-xs">
                    <Link to={`/problems/${ch.id}`}>
                      <Button variant="ghost" size="sm" className="text-xs cursor-pointer">
                        View Public Specs
                      </Button>
                    </Link>
                    <Link to={`/track/${ch.id}`}>
                      <Button size="sm" className="text-xs font-bold gap-1 cursor-pointer">
                        <span>Track Lifecycle</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* View 2: Proposals & Pilots (Startup View) */}
        {viewMode === 'proposals' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-muted-foreground uppercase font-mono">
                Active Startup Pilots & Bids
              </span>
              <Link to="/problems">
                <Button size="sm" className="font-bold text-xs gap-1.5 cursor-pointer">
                  <Rocket className="h-4 w-4" />
                  <span>Discover Open Challenges</span>
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pilots.map((p) => (
                <Card key={p.id} className="p-6 rounded-2xl border border-border bg-card flex flex-col justify-between shadow-xs space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                        {p.id}
                      </span>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600">
                        {p.currentStage}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-foreground">{p.challengeTitle}</h3>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                      <Building2 className="h-3.5 w-3.5 text-primary" />
                      <span>{p.department}</span>
                      <span>•</span>
                      <MapPin className="h-3.5 w-3.5 text-amber-500" />
                      <span>{p.district}, MH</span>
                    </div>

                    <p className="text-xs text-muted-foreground mt-3 line-clamp-2 leading-relaxed">
                      {p.sandboxScope}
                    </p>

                    <div className="mt-4 pt-3 border-t border-border/60 flex justify-between items-center text-xs font-mono">
                      <span>Disbursed: ₹{p.disbursedBudget}L / ₹{p.totalBudget}L</span>
                      <span className="text-emerald-600 font-bold">{p.milestones.length} Milestones</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border flex items-center justify-between gap-3 text-xs">
                    <span className="font-mono text-muted-foreground text-[11px]">Agr: {p.agreementRef}</span>
                    <Link to={`/track/${p.id}`}>
                      <Button size="sm" className="text-xs font-bold gap-1 cursor-pointer">
                        <span>Open Pilot Tracker</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
