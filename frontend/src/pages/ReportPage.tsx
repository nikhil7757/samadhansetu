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
        <div className="space-y-2 border-b border-border pb-6">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-wide">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Official Civic Grievance Intake</span>
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
          <div className="p-3.5 rounded-xl border border-border bg-card space-y-1">
            <span className="font-bold text-foreground flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              1. Be Specific
            </span>
            <p className="text-muted-foreground text-[11px]">
              Name exact roads, ward numbers, or landmark crossings to maximize your AI geo-consistency score.
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-border bg-card space-y-1">
            <span className="font-bold text-foreground flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              2. Attach Photo Evidence
            </span>
            <p className="text-muted-foreground text-[11px]">
              Photographic evidence gives your grievance up to +30% AI authenticity boost and faster officer dispatch.
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-border bg-card space-y-1">
            <span className="font-bold text-foreground flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-accent" />
              3. Guaranteed Human Override
            </span>
            <p className="text-muted-foreground text-[11px]">
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
