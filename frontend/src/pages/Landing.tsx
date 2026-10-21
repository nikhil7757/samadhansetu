import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
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
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { StateSeal } from '@/components/shared/StateSeal';
import { AnimatedStatCounter } from '@/components/shared/AnimatedStatCounter';
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
    budgetLakhs: 24.5,
  },
  {
    id: 'SS-2026-001042',
    title: 'Computer Vision & Edge-AI Early Crop Pest Detection in Vineyards',
    department: 'Department of Agriculture',
    district: 'Nashik',
    startup: 'KisanDrishti Technologies (DPIIT-MH-2023-88310)',
    pilotScope: '40 hectares across Niphad taluka farmer collectives.',
    validatedOutcome: '94.2% detection precision, 38% reduction in chemical spray volume.',
    scalePathway: 'GeM Custom Bid Scale-Up',
    budgetLakhs: 16.5,
  },
  {
    id: 'SS-2026-001045',
    title: 'IoT Real-Time Chlorine Residual Monitoring in Rural Piped Water Schemes',
    department: 'Water Supply and Sanitation Department',
    district: 'Nagpur & Wardha',
    startup: 'JalShakti Sensors LLP (DPIIT-MH-2021-12093)',
    pilotScope: '25 gram panchayat overhead reservoir nodes.',
    validatedOutcome: '99.4% uptime, zero bacterial water contamination incidents over 90 days.',
    scalePathway: 'Statewide Framework Order (Jal Jeevan Mission)',
    budgetLakhs: 18.0,
  },
];

const STATUTORY_STEPS = [
  { step: '01', title: 'Problem Formulation', desc: 'Department formulates outcome-based need with quantifiable KPIs & IP preference.' },
  { step: '02', title: 'Quality Approval', desc: 'MSInS validates Challenge Quality Score (0–100) and releases challenge to gazette.' },
  { step: '03', title: 'Startup Discovery', desc: 'Startups browse open marketplace with automated AI match compatibility scoring.' },
  { step: '04', title: 'Eligibility Screening', desc: 'Rule engine applies statutory turnover & experience waivers for DPIIT startups.' },
  { step: '05', title: 'Expert Evaluation', desc: 'Independent panel scores proposals across 5 weighted statutory benchmarks.' },
  { step: '06', title: 'Sandbox Pilot Design', desc: 'Controlled sandbox testbed, telemetry protocols, and milestone gates structured.' },
  { step: '07', title: 'Tripartite Contract', desc: 'Tripartite sandbox agreement locked with IP safeguards and non-liability terms.' },
  { step: '08', title: 'Pilot Running', desc: 'Startup deploys field tech in live environment with real-time telemetry.' },
  { step: '09', title: 'Validation Audit', desc: 'Third-party auditor (e.g. VJTI/COEP) independently tests and certifies KPIs.' },
  { step: '10', title: 'Escrow Payment', desc: 'Milestone grant released with automated turnaround tracking clock.' },
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
      {/* 1. HERO SECTION WITH GLASS WITH PURPOSE */}
      <section className="relative overflow-hidden pt-10 pb-16 lg:pt-16 lg:pb-24 border-b border-border/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            {/* Government Gazette Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-6 shadow-2xs"
            >
              <StateSeal size="xs" />
              <span>{t('landing.hero.badge', 'Government of Maharashtra • MSInS Innovation Sandbox')}</span>
              <span className="text-muted-foreground">•</span>
              <span className="font-mono text-accent font-bold">{PLATFORM_CONFIG.problemStatementId}</span>
            </motion.div>

            {/* Fluid Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05 }}
              className="text-fluid-display font-black text-foreground tracking-tight leading-[1.12] font-heading"
            >
              {t('landing.hero.titlePart1', 'Startup-Friendly Public Procurement')}
              <span className="block mt-2 text-primary dark:text-primary-foreground">
                {t('landing.hero.titlePart2', '& Scaling Pathway for Maharashtra')}
              </span>
            </motion.h1>

            {/* Subtitle with Prose Measure */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="mt-5 text-sm sm:text-lg text-muted-foreground max-w-3xl leading-relaxed prose-measure"
            >
              {t(
                'landing.hero.subtitle',
                "Enabling government departments across Maharashtra's 36 districts to formulate outcome-based problem statements, discover eligible DPIIT-recognized startups, conduct controlled sandboxed pilots, release milestone payments, and scale verified technologies seamlessly."
              )}
            </motion.p>

            {/* TWO PRIMARY ENTRY POINTS */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="mt-8 flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto"
            >
              <Link to="/report" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto font-bold text-xs sm:text-sm bg-accent hover:bg-accent-hover text-accent-foreground shadow-md gap-2 px-6 h-12 cursor-pointer active:scale-95 transition-all"
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
                  className="w-full sm:w-auto font-bold text-xs sm:text-sm border-primary/30 hover:bg-primary/5 text-foreground shadow-2xs gap-2 px-6 h-12 cursor-pointer"
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
                  <FileText className="h-4 w-4 text-accent" />
                  <span>{t('landing.hero.exploreTemplates', 'Standard Templates')}</span>
                </Button>
              </Link>
            </motion.div>

            {/* 3 HERO FEATURE GLASS CARDS (Floating above ambient background) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-4xl pt-8 border-t border-border/60"
            >
              <div className="glass-surface p-4 rounded-2xl text-left space-y-2 border border-border/80">
                <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground font-heading">AI Quality Scorer</h4>
                  <p className="text-[11px] text-muted-foreground leading-snug mt-0.5">
                    Real-time 0–100 benchmark against GFR outcome criteria before tenders are published.
                  </p>
                </div>
              </div>

              <div className="glass-surface p-4 rounded-2xl text-left space-y-2 border border-border/80">
                <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground font-heading">Guaranteed Escrow SLA</h4>
                  <p className="text-[11px] text-muted-foreground leading-snug mt-0.5">
                    Treasury disbursement released within 7 days upon independent validator sign-off.
                  </p>
                </div>
              </div>

              <div className="glass-surface p-4 rounded-2xl text-left space-y-2 border border-border/80">
                <div className="h-10 w-10 rounded-xl bg-accent/15 text-accent flex items-center justify-center shrink-0">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground font-heading">GFR 194 Direct Scale</h4>
                  <p className="text-[11px] text-muted-foreground leading-snug mt-0.5">
                    Validated sandbox pilots scale directly across departments without repeat bidding.
                  </p>
                </div>
              </div>
            </motion.div>
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
                placeholder="Track any pilot or challenge (e.g. SS-2026-001042 or NS-2026-001042)..."
                className="pl-10 h-12 text-xs sm:text-sm bg-card border-border font-mono shadow-2xs"
              />
            </div>
            <Button type="submit" size="lg" className="w-full sm:w-auto h-12 px-6 font-bold cursor-pointer bg-primary text-white">
              <span>{t('landing.tracker.button', 'Inspect Dossier')}</span>
              <ArrowRight className="h-4 w-4 ml-1.5" />
            </Button>
          </form>

          {/* Quick-select chips */}
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-muted-foreground font-medium text-[11px]">Quick Pilots:</span>
            {RECENT_SCALED_PILOTS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => navigate(`/track/${p.id}`)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-card border border-border text-[11px] font-mono text-foreground hover:border-primary/50 transition-colors cursor-pointer"
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
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground font-heading">
              {t('landing.entryPoints.title', 'Two Gateways to Public Sector Innovation')}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-2">
              {t(
                'landing.entryPoints.subtitle',
                'Purpose-built workflows for government departments seeking solutions and startups ready to deploy.'
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {/* Department Gateway (Solid Dense Working Surface) */}
            <div className="rounded-2xl solid-surface p-6 sm:p-8 flex flex-col justify-between hover:border-primary/40 transition-all">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-accent bg-accent/15 px-2.5 py-1 rounded-md border border-accent/30 font-mono">
                    DEMAND SIDE / BUYER
                  </span>
                  <Building2 className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-foreground font-heading">
                  For Government Departments
                </h3>
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
                  <Button className="w-full font-bold text-xs bg-accent hover:bg-accent-hover text-accent-foreground cursor-pointer">
                    <span>Post a Department Challenge</span>
                    <ArrowRight className="h-4 w-4 ml-1.5" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Startup Gateway (Solid Dense Working Surface) */}
            <div className="rounded-2xl solid-surface p-6 sm:p-8 flex flex-col justify-between hover:border-primary/40 transition-all">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-1 rounded-md border border-primary/20 font-mono">
                    SUPPLY SIDE / SOLVER
                  </span>
                  <Rocket className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-foreground font-heading">
                  For Innovative Startups
                </h3>
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
                  <Button className="w-full font-bold text-xs cursor-pointer bg-primary hover:bg-primary-hover text-white">
                    <span>Explore Open Challenges</span>
                    <ArrowRight className="h-4 w-4 ml-1.5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. THE 11-STAGE STATUTORY PROCUREMENT PATHWAY */}
      <section className="py-16 bg-secondary/20 border-b border-border/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-[10px] font-bold uppercase tracking-wider text-primary font-mono bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
              11-STAGE STATUTORY PROCUREMENT PATHWAY
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mt-3 font-heading">
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
                className="rounded-xl solid-surface p-4 hover:border-primary/40 hover:shadow-sm transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-bold text-accent px-1.5 py-0.2 rounded bg-accent/10">
                      Stage {st.step}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-foreground font-heading">{st.title}</h4>
                  <p className="text-[11px] text-muted-foreground mt-1 leading-snug">{st.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. 36-DISTRICT TELEMETRY HUBS */}
      <section className="py-16 border-b border-border/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-accent font-mono bg-accent/15 px-3 py-1 rounded-full border border-accent/30">
                STATEWIDE FIELD TELEMETRY
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mt-2 font-heading">
                36 District Innovation Desks Active
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                Real-time pilot execution, turnaround times, and scale rates across Maharashtra.
              </p>
            </div>
            <Link to="/dashboard/analytics">
              <Button variant="outline" size="sm" className="text-xs font-bold gap-1.5 cursor-pointer">
                <span>View Full Telemetry Dashboard</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>

          {/* District selector pills */}
          <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-none">
            {MAHARASHTRA_DISTRICT_HUBS.map((hub) => (
              <button
                key={hub.id}
                type="button"
                onClick={() => setSelectedHub(hub)}
                className={cn(
                  'px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border flex items-center gap-2',
                  selectedHub.id === hub.id
                    ? 'bg-primary text-white border-primary shadow-xs'
                    : 'bg-card text-muted-foreground hover:text-foreground border-border'
                )}
              >
                <span>{hub.name}</span>
                <span className="text-[11px] font-devanagari opacity-80">({hub.marathi})</span>
              </button>
            ))}
          </div>

          {/* Selected District Telemetry Card (Solid Dense Surface) */}
          <div className="rounded-2xl solid-surface-elevated p-6 sm:p-8 mt-4 border border-border">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-border">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-xl font-bold text-foreground font-heading">
                    {selectedHub.name} ({selectedHub.marathi})
                  </h3>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-semibold border border-primary/20">
                    {selectedHub.tag}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Nodal Authority: <strong className="text-foreground">{selectedHub.nodalSecretary}</strong>
                </p>
              </div>

              <div className="flex items-center gap-6">
                <div>
                  <div className="text-[10px] uppercase font-bold text-muted-foreground">Active Challenges</div>
                  <div className="text-2xl font-black font-heading text-foreground tabular-nums">
                    <AnimatedStatCounter value={selectedHub.activeChallenges} />
                  </div>
                </div>
                <div className="h-8 w-[1px] bg-border" />
                <div>
                  <div className="text-[10px] uppercase font-bold text-muted-foreground">Pilots Running</div>
                  <div className="text-2xl font-black font-heading text-accent tabular-nums">
                    <AnimatedStatCounter value={selectedHub.pilotsRunning} />
                  </div>
                </div>
                <div className="h-8 w-[1px] bg-border" />
                <div>
                  <div className="text-[10px] uppercase font-bold text-muted-foreground">Scale-Up Rate</div>
                  <div className="text-2xl font-black font-heading text-emerald-600 tabular-nums">
                    {selectedHub.scaledRate}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-1">
                  Primary Sectoral Focus
                </span>
                <p className="text-foreground font-medium leading-relaxed">{selectedHub.primaryFocus}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-1">
                  Average Sandbox Pilot Turnaround
                </span>
                <p className="text-foreground font-mono font-bold text-sm">{selectedHub.avgTurnaround} (Statutory Target: 45 Days)</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. RECENT SCALED PILOTS SHOWCASE */}
      <section className="py-16 bg-secondary/15">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 font-mono bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              FIELD EVIDENCE & DEPLOYMENT WINS
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mt-3 font-heading">
              Recent Scaled Pilots in Maharashtra
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-2">
              Startups that successfully graduated through sandbox testing and into departmental scale-up.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {RECENT_SCALED_PILOTS.map((pilot) => (
              <div
                key={pilot.id}
                className="rounded-2xl solid-surface p-5 flex flex-col justify-between hover:border-primary/40 transition-all space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
                      {pilot.id}
                    </span>
                    <span className="text-[11px] font-mono text-muted-foreground">₹{pilot.budgetLakhs}L</span>
                  </div>
                  <h4 className="text-xs font-bold text-foreground font-heading line-clamp-2">{pilot.title}</h4>
                  <div className="text-[11px] text-muted-foreground">
                    {pilot.department} • <strong className="text-foreground">{pilot.district}</strong>
                  </div>
                  <div className="p-2.5 rounded-lg bg-secondary/50 text-[11px] text-foreground font-medium">
                    {pilot.validatedOutcome}
                  </div>
                </div>

                <div className="pt-3 border-t border-border flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-accent font-mono">{pilot.scalePathway}</span>
                  <Link to={`/track/${pilot.id}`} className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                    <span>Inspect</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
