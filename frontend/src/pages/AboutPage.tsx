import { Link } from 'react-router';
import { ShieldCheck, Sparkles, Building2, Rocket, Award, CheckCircle2, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PLATFORM_CONFIG } from '@/config/platform';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="space-y-3 text-center sm:text-left border-b border-border pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-wide">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>SIH 2026 Problem ID 26136 • Govt. of Maharashtra (MSInS)</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground font-serif">
            About {PLATFORM_CONFIG.name}
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed">
            A startup-friendly public procurement mechanism enabling Maharashtra government departments to
            identify, pilot, procure, and scale innovative solutions from eligible startups with outcome-based contracting and GFR relaxations.
          </p>
        </div>

        {/* The 4-Pillar Model */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-foreground">Our Four-Pillar Procurement Architecture</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="p-5 rounded-2xl border-border/80 bg-card specular-card card-hover-lift shadow-xs">
              <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3">
                <Building2 className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-sm text-foreground">1. Outcome-Based Challenge Quality</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Departments post functional challenges rather than rigid specifications. Real-time AI quality scoring ensures SMART KPIs, realistic budgets, and balanced IP terms before publication.
              </p>
            </Card>

            <Card className="p-5 rounded-2xl border-border/80 bg-card specular-card card-hover-lift shadow-xs">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-3">
                <Rocket className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-sm text-foreground">2. GFR Rule 170/173 Startup Relaxations</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Automated screening verifies DPIIT recognition and applies mandatory exemptions from prior turnover, past experience, and EMD deposits for innovative ventures.
              </p>
            </Card>

            <Card className="p-5 rounded-2xl border-border/80 bg-card specular-card card-hover-lift shadow-xs">
              <div className="h-10 w-10 rounded-xl bg-sky-500/10 text-sky-600 flex items-center justify-center mb-3">
                <Award className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-sm text-foreground">3. Milestone Pilot Contracting</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Deploy fast-track sandbox pilots (3–6 months) under standard legal templates. Deliverables are independently verified by academic institutions (e.g. VJTI, IIT Bombay) with automated payment delay clocks.
              </p>
            </Card>

            <Card className="p-5 rounded-2xl border-border/80 bg-card specular-card card-hover-lift shadow-xs">
              <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center mb-3">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-sm text-foreground">4. Work Order Scale-Up & GeM Export</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Successful pilots graduate into multi-district rollout contracts or direct GeM Startup Runway catalogue integration across all 36 Maharashtra districts.
              </p>
            </Card>
          </div>
        </div>

        {/* Nodal Oversight & Human Override */}
        <Card className="p-6 sm:p-8 rounded-2xl border-primary/30 bg-primary/5 specular-card shadow-xs space-y-3">
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            Maharashtra State Innovation Society (MSInS) Governance
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Administered under the Department of Skills, Employment, Entrepreneurship & Innovation, Government of Maharashtra. Every challenge is vetted by the MSInS Secretariat, pilot disbursements are protected by transparent SLA clocks, and decisions are backed by independent third-party audit reports.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <Link to="/problems">
              <Button className="gap-2 font-bold text-xs rounded-xl shadow-xs">
                <span>Explore Innovation Challenges</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
            <Link to="/templates">
              <Button variant="outline" className="gap-2 font-bold text-xs rounded-xl">
                <span>Browse Standard Templates</span>
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
