import { Link } from 'react-router';
import { ArrowLeft, ShieldCheck, Sparkles, FileText, CheckCircle2 } from 'lucide-react';
import { QuickReportWidget } from '@/components/shared/QuickReportWidget';

export default function ReportPage() {
  return (
    <div className="min-h-screen bg-background py-10 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Back Link */}
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="text-xs font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Homepage</span>
          </Link>
          <span className="text-xs font-mono text-muted-foreground">
            SIH 2026 • Problem Statement 043
          </span>
        </div>

        {/* Page Header */}
        <div className="space-y-3 border-b border-border/80 pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-wide border border-primary/20 shadow-2xs">
            <Sparkles className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Official Civic Grievance Intake • Govt. of Jharkhand</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-foreground">
            Report a Civic Problem in Jharkhand
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Submit infrastructure, water, sanitation, electricity, or public service grievances directly.
            Every submission undergoes instant automated AI scoring and receives an immutable public tracking ID.
          </p>
        </div>

        {/* Instructions & Tips Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl border border-border/80 bg-card shadow-xs space-y-1.5 specular-card card-hover-lift">
            <span className="font-bold text-foreground flex items-center gap-2">
              <div className="h-6 w-6 rounded-lg bg-emerald-500/15 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="h-3.5 w-3.5" />
              </div>
              <span>1. Be Specific</span>
            </span>
            <p className="text-muted-foreground text-[11px] leading-relaxed">
              Name exact roads, ward numbers, or landmark crossings to maximize your AI geo-consistency score.
            </p>
          </div>

          <div className="p-4 rounded-2xl border border-border/80 bg-card shadow-xs space-y-1.5 specular-card card-hover-lift">
            <span className="font-bold text-foreground flex items-center gap-2">
              <div className="h-6 w-6 rounded-lg bg-primary/15 text-primary flex items-center justify-center">
                <Sparkles className="h-3.5 w-3.5" />
              </div>
              <span>2. Attach Photo</span>
            </span>
            <p className="text-muted-foreground text-[11px] leading-relaxed">
              Photographic evidence gives your grievance up to +30% AI authenticity boost and faster officer dispatch.
            </p>
          </div>

          <div className="p-4 rounded-2xl border border-border/80 bg-card shadow-xs space-y-1.5 specular-card card-hover-lift">
            <span className="font-bold text-foreground flex items-center gap-2">
              <div className="h-6 w-6 rounded-lg bg-accent/15 text-accent-foreground flex items-center justify-center">
                <ShieldCheck className="h-3.5 w-3.5 text-accent" />
              </div>
              <span>3. Appeal Rights</span>
            </span>
            <p className="text-muted-foreground text-[11px] leading-relaxed">
              If automated checks score your grievance under 40, you always retain a one-click human officer appeal path.
            </p>
          </div>
        </div>

        {/* The Form Widget */}
        <QuickReportWidget />
      </div>
    </div>
  );
}
