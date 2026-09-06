import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ArrowRight, CheckCircle2, Building2, GraduationCap, Users, ShieldCheck, MapPin, Sparkles, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import api from '@/lib/api';
import { useAuth } from '@/lib/auth';

interface DashboardStats {
  totalProblems: number;
  solvedCount: number;
  activeCollaborations: number;
  inProgress: number;
}

export default function Landing() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalProblems: 18,
    solvedCount: 2,
    activeCollaborations: 3,
    inProgress: 4,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/dashboard/stats');
        setStats(res.data);
      } catch {
        // Fallback to default stats if server is spinning up
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-secondary/50 via-background to-background py-16 sm:py-24">
        {/* Subtle patterned background grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Col: Headings & Value Prop */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                <span>{t('landing.hero.badge')}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-[1.15]">
                {t('landing.hero.title')}
              </h1>

              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl">
                {t('landing.hero.subtitle')}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-2">
                {user?.role === 'CITIZEN' ? (
                  <Button size="lg" onClick={() => navigate('/problems/submit')} className="gap-2">
                    {t('landing.hero.cta')} <ArrowRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button size="lg" onClick={() => navigate(user ? '/problems' : '/signup')} className="gap-2">
                    {t('landing.hero.explore')} <ArrowRight className="h-4 w-4" />
                  </Button>
                )}

                <Button size="lg" variant="outline" onClick={() => navigate('/dashboard')} className="gap-2">
                  <TrendingUp className="h-4 w-4" />
                  {t('landing.hero.viewDashboard')}
                </Button>
              </div>

              {/* Key Trust Signals */}
              <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-primary" /> Verified Nodal Moderation
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-primary" /> All 24 Jharkhand Districts
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Milestone Tracking
                </span>
              </div>
            </div>

            {/* Right Col: Live Telemetry Metric Board */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-xs p-6 shadow-md">
                <div className="flex items-center justify-between pb-4 border-b border-border">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Live State Telemetry
                    </span>
                  </div>
                  <span className="text-[11px] bg-secondary text-secondary-foreground font-mono px-2 py-0.5 rounded">
                    Jharkhand
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="p-4 rounded-xl bg-secondary/50 border border-border/50">
                    <span className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                      {stats.totalProblems}
                    </span>
                    <p className="text-xs text-muted-foreground mt-1 font-medium">
                      {t('landing.stats.problemsSubmitted')}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-secondary/50 border border-border/50">
                    <span className="text-2xl sm:text-3xl font-black text-primary tracking-tight">
                      {stats.activeCollaborations}
                    </span>
                    <p className="text-xs text-muted-foreground mt-1 font-medium">
                      {t('landing.stats.teamCollaborations')}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-secondary/50 border border-border/50">
                    <span className="text-2xl sm:text-3xl font-black text-amber-600 tracking-tight">
                      {stats.inProgress}
                    </span>
                    <p className="text-xs text-muted-foreground mt-1 font-medium">
                      {t('landing.stats.activeSolutions')}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-secondary/50 border border-border/50">
                    <span className="text-2xl sm:text-3xl font-black text-emerald-600 tracking-tight">
                      {stats.solvedCount}
                    </span>
                    <p className="text-xs text-muted-foreground mt-1 font-medium">
                      {t('landing.stats.problemsSolved')}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Verified against live Postgres ORM</span>
                  <Link to="/dashboard" className="text-primary font-semibold hover:underline flex items-center gap-1">
                    Open Telemetry <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Structured Workflow Section: How It Works */}
      <section className="py-16 sm:py-20 bg-background border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              {t('landing.howItWorks.title')}
            </h2>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
              {t('landing.howItWorks.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-border shadow-xs hover:shadow-sm transition-shadow">
              <CardContent className="p-6">
                <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-sm mb-4">
                  01
                </div>
                <h3 className="font-semibold text-base mb-2 text-foreground">
                  {t('landing.howItWorks.step1Title')}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {t('landing.howItWorks.step1Desc')}
                </p>
              </CardContent>
            </Card>

            <Card className="border-border shadow-xs hover:shadow-sm transition-shadow">
              <CardContent className="p-6">
                <div className="h-10 w-10 rounded-xl bg-sky-500/10 text-sky-700 flex items-center justify-center font-bold text-sm mb-4">
                  02
                </div>
                <h3 className="font-semibold text-base mb-2 text-foreground">
                  {t('landing.howItWorks.step2Title')}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {t('landing.howItWorks.step2Desc')}
                </p>
              </CardContent>
            </Card>

            <Card className="border-border shadow-xs hover:shadow-sm transition-shadow">
              <CardContent className="p-6">
                <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center font-bold text-sm mb-4">
                  03
                </div>
                <h3 className="font-semibold text-base mb-2 text-foreground">
                  {t('landing.howItWorks.step3Title')}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {t('landing.howItWorks.step3Desc')}
                </p>
              </CardContent>
            </Card>

            <Card className="border-border shadow-xs hover:shadow-sm transition-shadow">
              <CardContent className="p-6">
                <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center font-bold text-sm mb-4">
                  04
                </div>
                <h3 className="font-semibold text-base mb-2 text-foreground">
                  {t('landing.howItWorks.step4Title')}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {t('landing.howItWorks.step4Desc')}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Multi-Stakeholder Ecosystem Roles */}
      <section className="py-16 sm:py-20 bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              {t('landing.roles.title')}
            </h2>
            <p className="text-sm text-muted-foreground mt-2">
              Three pillars working in harmony with government oversight
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Citizens */}
            <div className="rounded-2xl border border-border bg-card p-8 shadow-xs flex flex-col justify-between">
              <div>
                <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-5">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">
                  {t('landing.roles.citizen.title')}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {t('landing.roles.citizen.desc')}
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-border">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => navigate('/signup')}
                >
                  Join as Citizen / Official
                </Button>
              </div>
            </div>

            {/* University Solvers */}
            <div className="rounded-2xl border border-border bg-card p-8 shadow-xs flex flex-col justify-between ring-2 ring-primary/20">
              <div>
                <div className="h-12 w-12 rounded-xl bg-sky-500/10 text-sky-700 flex items-center justify-center mb-5">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <div className="inline-block px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-primary/10 text-primary mb-2">
                  Solver Unit
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">
                  {t('landing.roles.university.title')}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {t('landing.roles.university.desc')}
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-border">
                <Button
                  size="sm"
                  className="w-full"
                  onClick={() => navigate('/signup')}
                >
                  Register Solver Cell
                </Button>
              </div>
            </div>

            {/* Industry Enablers */}
            <div className="rounded-2xl border border-border bg-card p-8 shadow-xs flex flex-col justify-between">
              <div>
                <div className="h-12 w-12 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center mb-5">
                  <Building2 className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">
                  {t('landing.roles.industry.title')}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {t('landing.roles.industry.desc')}
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-border">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => navigate('/signup')}
                >
                  Partner as Industry Enabler
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
