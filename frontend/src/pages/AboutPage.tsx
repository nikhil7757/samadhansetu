import { Link } from 'react-router';
import { ShieldCheck, Sparkles, Building2, GraduationCap, Users, CheckCircle2, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="space-y-3 text-center sm:text-left border-b border-border pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-wide">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>SIH 2026 Problem Statement 043 • Govt. of Jharkhand</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
            About SamadhanSetu
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed">
            A state-wide digital platform empowering citizens to crowdsource localized societal challenges
            and bridging collaborative problem-solving through academic innovation and CSR partnerships.
          </p>
        </div>

        {/* The 4-Pillar Model */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-foreground">Our Four-Pillar Architecture</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="p-5 rounded-2xl border-border/80 bg-card specular-card card-hover-lift shadow-xs">
              <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3">
                <Users className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-sm text-foreground">1. Citizen Crowdsourcing</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Citizens report grassroots infrastructure, water, sanitation, and electrical failures with instant public tracking IDs and photo evidence.
              </p>
            </Card>

            <Card className="p-5 rounded-2xl border-border/80 bg-card specular-card card-hover-lift shadow-xs">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-3">
                <Sparkles className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-sm text-foreground">2. Multi-Factor AI Verification</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Automated 0–100 scoring checks text coherence, geo-consistency with Jharkhand blocks, duplicate reports, and image authenticity.
              </p>
            </Card>

            <Card className="p-5 rounded-2xl border-border/80 bg-card specular-card card-hover-lift shadow-xs">
              <div className="h-10 w-10 rounded-xl bg-sky-500/10 text-sky-600 flex items-center justify-center mb-3">
                <GraduationCap className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-sm text-foreground">3. University Innovation Solvers</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Technical institutions like IIT (ISM) Dhanbad, BIT Mesra, and NIT Jamshedpur pitch practical, low-cost engineering solutions.
              </p>
            </Card>

            <Card className="p-5 rounded-2xl border-border/80 bg-card specular-card card-hover-lift shadow-xs">
              <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center mb-3">
                <Building2 className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-sm text-foreground">4. Industry CSR Sponsoring</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Leading regional corporations like Tata Steel Rural Development Society co-fund milestone-based pilot rollouts and ground installations.
              </p>
            </Card>
          </div>
        </div>

        {/* Nodal Oversight & Human Override */}
        <Card className="p-6 sm:p-8 rounded-2xl border-primary/30 bg-primary/5 specular-card shadow-xs space-y-3">
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            Human-in-the-Loop Nodal Governance
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Under administrative rules from the Department of Higher & Technical Education, no civic complaint can be permanently dismissed by AI alone. Any grievance scored below 40 retains an immediate citizen appeal button, forcing a District Nodal Officer to inspect and record an official determination on the public tracker.
          </p>
          <div className="pt-2">
            <Button onClick={() => window.location.href = '/#report'} className="gap-2 font-bold text-xs rounded-xl shadow-xs">
              <span>File a Grievance Now</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
