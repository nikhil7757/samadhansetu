import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Search,
  MapPin,
  Award,
  ChevronRight,
  Building2,
  Rocket,
  FileText,
  Activity,
  CreditCard,
  TrendingUp,
  Sparkles,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { StateSeal } from '@/components/shared/StateSeal';
import { PLATFORM_CONFIG } from '@/config/platform';
import { cn } from '@/lib/utils';

// Real Maharashtra Telemetry Data across major regional innovation hubs
const MAHARASHTRA_DISTRICT_HUBS = [
  {
    id: 'pune',
    name: 'Pune',
    marathi: 'पुणे',
    tag: 'Western Maharashtra MedTech & AI Hub',
    activeChallenges: 24,
    pilotsRunning: 8,
    avgTurnaround: '42 Days',
    scaledRate: '83.3%',
    primaryFocus: 'Rural Tele-ICU, Smart Mobility, Drone Deliveries, Agritech',
    nodalSecretary: 'Dr. Snehal Deshmukh (Health Directorate)',
    sampleRef: 'SS-2026-001043',
  },
  {
    id: 'nashik',
    name: 'Nashik',
    marathi: 'नाशिक',
    tag: 'Agritech & Perishable Supply Chain',
    activeChallenges: 18,
    pilotsRunning: 6,
    avgTurnaround: '48 Days',
    scaledRate: '75.0%',
    primaryFocus: 'Crop Pest Edge AI, Post-Harvest Cold Chain, Micro-Irrigation',
    nodalSecretary: 'Nitin Pawar (Joint Director Agriculture)',
    sampleRef: 'SS-2026-001042',
  },
  {
    id: 'nagpur',
    name: 'Nagpur',
    marathi: 'नागपूर',
    tag: 'Vidarbha Logistics & Urban Smart City',
    activeChallenges: 21,
    pilotsRunning: 7,
    avgTurnaround: '39 Days',
    scaledRate: '77.8%',
    primaryFocus: 'Adaptive Traffic Lights, Drone Forest Surveillance, Water Grid',
    nodalSecretary: 'Executive Engineer, Nagpur Municipal Corp',
    sampleRef: 'SS-2026-001045',
  },
  {
    id: 'mumbai_suburban',
    name: 'Mumbai Suburban',
    marathi: 'मुंबई उपनगर',
    tag: 'GovTech, Health AI & Urban Infrastructure',
    activeChallenges: 32,
    pilotsRunning: 11,
    avgTurnaround: '36 Days',
    scaledRate: '88.5%',
    primaryFocus: 'Civic Sensor Telemetry, Slum Sanitation AI, Coastal Protection',
    nodalSecretary: 'Director of Innovation (MSInS HQ)',
    sampleRef: 'SS-2026-001043',
  },
  {
    id: 'chhatrapati_sambhajinagar',
    name: 'Chhatrapati Sambhajinagar',
    marathi: 'छत्रपती संभाजीनगर',
    tag: 'Marathwada Clean Energy & Drought Resilience',
    activeChallenges: 14,
    pilotsRunning: 4,
    avgTurnaround: '51 Days',
    scaledRate: '71.4%',
    primaryFocus: 'Decentralized Solar Cold Storage, Water Filtration, EV Fleets',
    nodalSecretary: 'District Development Officer',
    sampleRef: 'SS-2026-001044',
  },
  {
    id: 'thane',
    name: 'Thane',
    marathi: 'ठाणे',
    tag: 'Urban-Tribal Convergence & Environmental Tech',
    activeChallenges: 16,
    pilotsRunning: 5,
    avgTurnaround: '44 Days',
    scaledRate: '73.3%',
    primaryFocus: 'Lake Water Quality Monitoring, Decentralized Waste-to-Energy',
    nodalSecretary: 'Chief Environmental Officer (TMC)',
    sampleRef: 'SS-2026-001045',
  },
];

const RECENT_SCALED_PILOTS = [
  {
    id: 'SS-2026-001043',
    title: 'Rural Tele-ICU & Predictive Sepsis Early-Warning Network',
    department: 'Public Health Department',
    district: 'Pune & Satara',
    startup: 'MedPulse Diagnostics Pvt Ltd (DPIIT-MH-2022-44102)',
    pilotScope: '10 rural sub-district hospitals tested for 6 months.',
    validatedOutcome: '91.8% sepsis sensitivity, 28.4% reduction in transfer mortality.',
    scalePathway: 'Direct Pilot Award (GFR Rule 194)',
    scaleDetails: 'Procurement awarded to expand to 50 additional sub-district hospitals.',
    grantDisbursed: '₹22.0 Lakhs',
  },
  {
    id: 'SS-2026-001042',
    title: 'Edge AI Crop Pest Early Warning for Cotton Farmers',
    department: 'Department of Agriculture',
    district: 'Nashik & Marathwada',
    startup: 'AgriScan Technologies Pvt Ltd (DPIIT-MH-2023-88192)',
    pilotScope: '500 smallholder farmer cotton plots with 40 solar sensor nodes.',
    validatedOutcome: '94.2% pest identification accuracy, 34.8% pesticide cost savings.',
    scalePathway: 'GeM Startup Runway Fast-Track Listing',
    scaleDetails: 'Direct purchase catalog listing under GFR Rule 149 for all talukas.',
    grantDisbursed: '₹16.5 Lakhs',
  },
  {
    id: 'SS-2026-001044',
    title: 'Decentralized Solar-Powered Cold Storage Pods',
    department: 'Dept. of Skills, Employment, Entrepreneurship & Innovation',
    district: 'Chhatrapati Sambhajinagar',
    startup: 'UrjaKisan CleanTech Pvt Ltd',
    pilotScope: '3 farmer producer clusters handling 15 metric tonnes.',
    validatedOutcome: '72-hour zero-grid thermal backup, 40% reduction in tomato distress sales.',
    scalePathway: 'Limited Departmental Innovation Tender',
    scaleDetails: 'Tender issued for 120 village pods with Swiss-challenge startup right.',
    grantDisbursed: '₹24.0 Lakhs',
  },
];

const STATUTORY_STEPS = [
  { step: '01', title: 'Challenge Drafted', desc: 'Department formulates outcome-based need with quantifiable KPIs & IP preference.' },
  { step: '02', title: 'Approved & Published', desc: 'MSInS validates Challenge Quality Score (0–100) and releases challenge to public.' },
  { step: '03', title: 'Startup Discovery', desc: 'Startups browse open marketplace with automated AI match compatibility scoring.' },
  { step: '04', title: 'Eligibility Screening', desc: 'Rule engine applies statutory turnover & experience waivers for DPIIT startups.' },
  { step: '05', title: 'Expert Evaluation', desc: 'Independent panel scores proposals across 6 weighted multi-criteria benchmarks.' },
  { step: '06', title: 'Pilot Design', desc: 'Controlled sandbox testbed, telemetry protocols, and milestone gates structured.' },
  { step: '07', title: 'Contract Signed', desc: 'Tripartite sandbox agreement locked with IP safeguards and non-liability terms.' },
  { step: '08', title: 'Pilot Running', desc: 'Startup deploys field tech in live environment with real-time telemetry.' },
  { step: '09', title: 'Independent Validation', desc: 'Third-party auditor (e.g. VJTI/IIT) independently tests and certifies KPIs.' },
  { step: '10', title: 'Payment Released', desc: 'Milestone grant released with automated turnaround tracking clock.' },
  { step: '11', title: 'Scale-up Decision', desc: 'Statutory verdict: Direct Award (GFR 194), GeM Listing, or limited tender.' },
];

export default function Landing() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [trackQuery, setTrackQuery] = useState('');
  const [selectedHub, setSelectedHub] = useState(MAHARASHTRA_DISTRICT_HUBS[0]);

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = trackQuery.trim();
    if (!query) return;
    navigate(`/track/${encodeURIComponent(query)}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-10 pb-16 lg:pt-14 lg:pb-24 border-b border-border/80">
        {/* Subtle geometric gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-background -z-10" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute bottom-10 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            {/* Government badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-6 shadow-xs">
              <StateSeal size="xs" />
              <span>{t('landing.hero.badge', 'Government of Maharashtra • MSInS Innovation Sandbox')}</span>
              <span className="text-muted-foreground">•</span>
              <span className="font-mono text-amber-600 dark:text-amber-400 font-bold">{PLATFORM_CONFIG.problemStatementId}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-foreground tracking-tight leading-[1.12] font-serif">
              {t('landing.hero.titlePart1', 'Startup-Friendly Public Procurement')}
              <span className="block mt-2 bg-gradient-to-r from-primary via-indigo-600 to-amber-600 bg-clip-text text-transparent">
                {t('landing.hero.titlePart2', '& Scaling Pathway for Maharashtra')}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mt-5 text-sm sm:text-lg text-muted-foreground max-w-3xl leading-relaxed">
              {t(
                'landing.hero.subtitle',
                "Enabling government departments across Maharashtra's 36 districts to formulate outcome-based problem statements, discover eligible DPIIT-recognized startups, conduct controlled sandboxed pilots, release milestone payments, and scale verified technologies seamlessly."
              )}
            </p>

            {/* TWO PRIMARY ENTRY POINTS */}
            <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <Link to="/report" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto font-bold text-sm bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white shadow-md gap-2 px-6 h-12 cursor-pointer"
                >
                  <Building2 className="h-4 w-4" />
                  <span>{t('landing.hero.postChallenge', 'Post Department Challenge')}</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>

              <Link to="/problems" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto font-bold text-sm border-primary/30 hover:bg-primary/5 text-foreground shadow-xs gap-2 px-6 h-12 cursor-pointer"
                >
                  <Rocket className="h-4 w-4 text-primary" />
                  <span>{t('landing.hero.findChallenges', 'Find Challenges (Startups)')}</span>
                </Button>
              </Link>

              <Link to="/templates" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="ghost"
                  className="w-full sm:w-auto font-medium text-xs text-muted-foreground hover:text-foreground gap-1.5 h-12 cursor-pointer"
                >
                  <FileText className="h-4 w-4 text-amber-500" />
                  <span>{t('landing.hero.exploreTemplates', 'Browse Standard Templates')}</span>
                </Button>
              </Link>
            </div>

            {/* 3 Core Pillars Pill Ribbon */}
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-3xl pt-8 border-t border-border/60">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border/70 text-left shadow-xs">
                <div className="h-9 w-9 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-foreground">Outcome AI Scorer</div>
                  <div className="text-[11px] text-muted-foreground">0–100 Quality Formulation Guidance</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border/70 text-left shadow-xs">
                <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-foreground">Timely Startup Payments</div>
                  <div className="text-[11px] text-muted-foreground">Milestone Escrow & SLA Turnaround Timer</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border/70 text-left shadow-xs">
                <div className="h-9 w-9 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-foreground">Statutory Scale-Up</div>
                  <div className="text-[11px] text-muted-foreground">GFR 194 Direct Award & GeM Handoff</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. DOCKET TRACKER LOOKUP BAR */}
      <section className="py-8 bg-secondary/30 border-b border-border/80">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <form onSubmit={handleTrackSubmit} className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                value={trackQuery}
                onChange={(e) => setTrackQuery(e.target.value)}
                placeholder="Track any pilot or challenge (e.g. SS-2026-001042)..."
                className="pl-10 h-12 text-sm bg-card border-border font-mono shadow-xs"
              />
            </div>
            <Button type="submit" size="lg" className="w-full sm:w-auto h-12 px-6 font-bold cursor-pointer">
              <span>{t('landing.tracker.button', 'Inspect Dossier')}</span>
              <ArrowRight className="h-4 w-4 ml-1.5" />
            </Button>
          </form>

          {/* Quick-select chips */}
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-muted-foreground font-medium">Quick Pilots:</span>
            {RECENT_SCALED_PILOTS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => navigate(`/track/${p.id}`)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-card border border-border text-[11px] font-mono text-foreground hover:bg-primary/5 hover:border-primary/40 transition-colors cursor-pointer"
              >
                <Activity className="h-3 w-3 text-primary" />
                <span>{p.id}</span>
                <span className="text-muted-foreground truncate max-w-[120px]">({p.district})</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 3. DUAL GATEWAY ARCHITECTURE CARDS */}
      <section className="py-16 border-b border-border/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground font-serif">
              {t('landing.entryPoints.title', 'Two Gateways to Public Sector Innovation')}
            </h2>
            <p className="text-sm text-muted-foreground mt-2">
              {t(
                'landing.entryPoints.subtitle',
                'Purpose-built workflows for government departments seeking solutions and startups ready to deploy.'
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Department Gateway */}
            <Card className="rounded-2xl border-2 border-border hover:border-primary/40 transition-all p-6 sm:p-8 bg-card flex flex-col justify-between shadow-xs">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20">
                    BUYER / DEMAND
                  </span>
                  <Building2 className="h-6 w-6 text-amber-600" />
                </div>
                <h3 className="text-xl font-bold text-foreground">For Government Departments</h3>
                <p className="text-xs sm:text-sm text-muted-foreground mt-2 leading-relaxed">
                  Formulate outcome-based challenges with pre-vetted legal templates, evaluate innovative solutions with expert panels, and run risk-managed sandbox pilots.
                </p>

                <ul className="mt-6 space-y-2.5 text-xs text-foreground/90">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Pre-built outcome statement & legal pilot templates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Automated Challenge Quality scoring (0–100) before publication</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Direct access to 10,000+ DPIIT-recognized startups</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Milestone-based contracting with escrow release safeguards</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-6 border-t border-border">
                <Link to="/report">
                  <Button className="w-full font-bold text-xs bg-amber-600 hover:bg-amber-700 text-white cursor-pointer">
                    <span>Post a Department Challenge</span>
                    <ArrowRight className="h-4 w-4 ml-1.5" />
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Startup Gateway */}
            <Card className="rounded-2xl border-2 border-border hover:border-primary/40 transition-all p-6 sm:p-8 bg-card flex flex-col justify-between shadow-xs">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-1 rounded-md border border-primary/20">
                    SOLVER / SUPPLY
                  </span>
                  <Rocket className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground">For Innovative Startups</h3>
                <p className="text-xs sm:text-sm text-muted-foreground mt-2 leading-relaxed">
                  Overcome turnover and experience barriers with DPIIT relaxation rules, bid for structured government pilots, get guaranteed milestone payments, and secure scale-up contracts.
                </p>

                <ul className="mt-6 space-y-2.5 text-xs text-foreground/90">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Zero prior turnover/experience penalty under GFR Rule 170/173</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Objective, multi-expert weighted scoring matrix</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Protected intellectual property & sandbox safe-harbour clauses</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Fast-track GeM Startup Runway listing post validation</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-6 border-t border-border">
                <Link to="/problems">
                  <Button className="w-full font-bold text-xs cursor-pointer">
                    <span>Explore Open Challenges</span>
                    <ArrowRight className="h-4 w-4 ml-1.5" />
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* 4. THE 11-STAGE STATUTORY PROCUREMENT PATHWAY */}
      <section className="py-16 bg-secondary/20 border-b border-border/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-[11px] font-bold uppercase tracking-wider text-primary font-mono bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
              11-STAGE STATUTORY PROCUREMENT PATHWAY
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mt-3 font-serif">
              The End-to-End Innovation Procurement Lifecycle
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-2">
              A legally compliant, transparent route from initial problem framing to statewide procurement.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {STATUTORY_STEPS.map((st) => (
              <div
                key={st.step}
                className="rounded-xl border border-border/80 bg-card p-4 hover:border-primary/40 hover:shadow-xs transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold text-primary px-2 py-0.5 rounded bg-primary/10">
                      STAGE {st.step}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-foreground">{st.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{st.desc}</p>
                </div>
              </div>
            ))}
            <div className="rounded-xl border border-primary/40 bg-gradient-to-br from-primary/10 to-indigo-500/10 p-4 flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-primary px-2 py-0.5 rounded bg-primary/20">
                  CORE STANDARD
                </span>
                <h4 className="text-sm font-bold text-foreground mt-2">Standard Templates Library</h4>
                <p className="text-xs text-muted-foreground mt-1.5">
                  Pre-approved legal agreements, IP clauses, and scoring matrices removing red tape.
                </p>
              </div>
              <Link to="/templates" className="mt-4">
                <Button size="sm" variant="outline" className="w-full text-xs font-bold cursor-pointer">
                  <span>Browse Templates</span>
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. RECENT SCALED PILOTS (SOCIAL PROOF) */}
      <section className="py-16 border-b border-border/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-mono bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                PROVEN RESULTS & SOCIAL PROOF
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mt-2 font-serif">
                Recent Scaled Pilots in Maharashtra
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                High-impact startup technologies that graduated from sandbox testing to departmental procurement.
              </p>
            </div>
            <Link to="/problems">
              <Button variant="outline" size="sm" className="text-xs font-bold gap-1.5 cursor-pointer">
                <span>View All Challenges</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {RECENT_SCALED_PILOTS.map((pilot) => (
              <Card key={pilot.id} className="rounded-2xl border border-border/80 bg-card p-6 flex flex-col justify-between hover:shadow-md transition-all">
                <div>
                  <div className="flex items-center justify-between text-xs mb-3">
                    <span className="font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                      {pilot.id}
                    </span>
                    <span className="text-muted-foreground font-medium flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-amber-500" />
                      {pilot.district}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-foreground leading-snug">
                    {pilot.title}
                  </h3>
                  <div className="text-xs text-muted-foreground font-medium mt-1">
                    {pilot.department}
                  </div>

                  <div className="mt-4 pt-4 border-t border-border/60 space-y-2 text-xs">
                    <div>
                      <span className="text-muted-foreground block text-[11px]">Startup Entity</span>
                      <span className="font-semibold text-foreground">{pilot.startup}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[11px]">Validated Outcome</span>
                      <span className="font-medium text-emerald-600 dark:text-emerald-400">{pilot.validatedOutcome}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[11px]">Scale-Up Procurement Pathway</span>
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-secondary text-foreground mt-0.5">
                        {pilot.scalePathway}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-foreground">Grant: {pilot.grantDisbursed}</span>
                  <Link to={`/track/${pilot.id}`}>
                    <Button variant="ghost" size="sm" className="h-8 text-xs font-bold text-primary hover:bg-primary/10 cursor-pointer">
                      Inspect Dossier →
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 6. MAHARASHTRA DISTRICT TELEMETRY MATRIX */}
      <section className="py-16 bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground font-serif">
              36-District Innovation Telemetry
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-2">
              Select any regional innovation hub to inspect active challenges, running pilots, and administrative oversight.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Hub selector buttons */}
            <div className="space-y-2">
              {MAHARASHTRA_DISTRICT_HUBS.map((hub) => (
                <button
                  key={hub.id}
                  type="button"
                  onClick={() => setSelectedHub(hub)}
                  className={cn(
                    'w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between',
                    selectedHub.id === hub.id
                      ? 'bg-card border-primary ring-1 ring-primary/30 shadow-xs'
                      : 'bg-card/60 border-border/60 hover:bg-card hover:border-border'
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <MapPin className={cn('h-4 w-4', selectedHub.id === hub.id ? 'text-primary' : 'text-muted-foreground')} />
                    <div>
                      <div className="text-sm font-bold text-foreground flex items-center gap-1.5">
                        <span>{hub.name}</span>
                        <span className="text-xs text-muted-foreground font-normal">({hub.marathi})</span>
                      </div>
                      <div className="text-[11px] text-muted-foreground truncate max-w-[200px]">{hub.tag}</div>
                    </div>
                  </div>
                  <ChevronRight className={cn('h-4 w-4', selectedHub.id === hub.id ? 'text-primary' : 'text-muted-foreground')} />
                </button>
              ))}
            </div>

            {/* Hub Detail Panel */}
            <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-6 sm:p-8 flex flex-col justify-between shadow-xs">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-border">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-primary uppercase">REGIONAL DESK</span>
                      <span className="text-xs text-muted-foreground font-mono">36-District Network</span>
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mt-0.5">
                      {selectedHub.name} ({selectedHub.marathi})
                    </h3>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                    {selectedHub.tag}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-6">
                  <div className="p-3 rounded-xl bg-secondary/50 border border-border/50 text-center">
                    <div className="text-xl font-black text-foreground font-mono">{selectedHub.activeChallenges}</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">Active Challenges</div>
                  </div>
                  <div className="p-3 rounded-xl bg-secondary/50 border border-border/50 text-center">
                    <div className="text-xl font-black text-foreground font-mono">{selectedHub.pilotsRunning}</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">Pilots Running</div>
                  </div>
                  <div className="p-3 rounded-xl bg-secondary/50 border border-border/50 text-center">
                    <div className="text-xl font-black text-foreground font-mono">{selectedHub.avgTurnaround}</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">Avg Turnaround</div>
                  </div>
                  <div className="p-3 rounded-xl bg-secondary/50 border border-border/50 text-center">
                    <div className="text-xl font-black text-emerald-600 font-mono">{selectedHub.scaledRate}</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">Scaled Rate</div>
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-muted-foreground font-medium block">Nodal Oversight Officer:</span>
                    <span className="font-semibold text-foreground text-sm">{selectedHub.nodalSecretary}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground font-medium block">Priority Innovation Focus Areas:</span>
                    <span className="text-foreground">{selectedHub.primaryFocus}</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-border flex items-center justify-between">
                <span className="text-xs text-muted-foreground font-mono">Sample Pilot: {selectedHub.sampleRef}</span>
                <Link to={`/track/${selectedHub.sampleRef}`}>
                  <Button size="sm" className="font-bold text-xs cursor-pointer">
                    <span>Inspect Hub Pilots</span>
                    <ArrowRight className="h-3.5 w-3.5 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
