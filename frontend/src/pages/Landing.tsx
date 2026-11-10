import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
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
  Radio,
  Cpu,
  Layers,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
    sampleRef: 'SS-2026-001046',
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
    sampleRef: 'SS-2026-001047',
  },
];

// Active Maharashtra Pilots for the Field HUD Reel
const FIELD_REEL_PILOTS = [
  {
    id: 'SS-2026-001043',
    stage: 'STAGE 08 // PILOT RUNNING',
    district: 'PUNE & SATARA',
    sector: 'HEALTHCARE / MEDTECH',
    title: 'Rural Tele-ICU & Predictive Sepsis Warning Network',
    department: 'Public Health Department',
    startup: 'MedPulse Diagnostics Pvt Ltd (DPIIT-MH-2022-44102)',
    metricLabel: 'CLINICAL SENSITIVITY',
    metricValue: '91.8%',
    budget: '₹24.5L',
    turnaround: '38 Days Elapsed',
    scalePathway: 'GFR Rule 194 Direct Scale',
    codePattern: 'M-ICU-MESH-V2',
  },
  {
    id: 'SS-2026-001042',
    stage: 'STAGE 09 // VALIDATION AUDIT',
    district: 'NASHIK (NIPHAD)',
    sector: 'AGRITECH / EDGE AI',
    title: 'Computer Vision & Edge-AI Early Crop Pest Detection',
    department: 'Department of Agriculture',
    startup: 'KisanDrishti Technologies (DPIIT-MH-2023-88310)',
    metricLabel: 'PEST PRECISION',
    metricValue: '94.2%',
    budget: '₹16.5L',
    turnaround: '42 Days Elapsed',
    scalePathway: 'GeM Custom Bid Scale-Up',
    codePattern: 'AGRI-VISION-40HA',
  },
  {
    id: 'SS-2026-001045',
    stage: 'STAGE 10 // ESCROW DISBURSEMENT',
    district: 'NAGPUR & WARDHA',
    sector: 'WATER SUPPLY & IOT',
    title: 'IoT Real-Time Chlorine Residual Monitoring Grid',
    department: 'Water Supply & Sanitation Dept',
    startup: 'JalShakti Sensors LLP (DPIIT-MH-2021-12093)',
    metricLabel: 'SENSOR UPTIME',
    metricValue: '99.4%',
    budget: '₹18.0L',
    turnaround: '31 Days Elapsed',
    scalePathway: 'Jal Jeevan Framework Order',
    codePattern: 'WATER-MESH-25NODE',
  },
  {
    id: 'SS-2026-001046',
    stage: 'STAGE 06 // SANDBOX DESIGN',
    district: 'MUMBAI SUBURBAN',
    sector: 'GOVTECH / SANITATION',
    title: 'Slum Sanitation Drainage Silt Telemetry & Early Overflow AI',
    department: 'Urban Development & BMC',
    startup: 'UrbanDrain Tech (DPIIT-MH-2024-91280)',
    metricLabel: 'OVERFLOW PREVENTION',
    metricValue: '87.5%',
    budget: '₹32.0L',
    turnaround: '14 Days Elapsed',
    scalePathway: 'Tripartite Sandbox Gate',
    codePattern: 'BMC-SILT-DRAIN-01',
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

const REEL_SLIDE_DURATION = 6000; // ms

export default function Landing() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [trackQuery, setTrackQuery] = useState('');
  const [selectedHub, setSelectedHub] = useState(MAHARASHTRA_DISTRICT_HUBS[0]);

  // Field Reel HUD State
  const [currentSlideIdx, setCurrentSlideIdx] = useState(0);
  const [reelProgress, setReelProgress] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const index = Math.floor(elapsed / REEL_SLIDE_DURATION) % FIELD_REEL_PILOTS.length;
      const progressPercent = ((elapsed % REEL_SLIDE_DURATION) / REEL_SLIDE_DURATION) * 100;
      setCurrentSlideIdx(index);
      setReelProgress(progressPercent);
    }, 60);

    return () => clearInterval(interval);
  }, []);

  const activePilot = FIELD_REEL_PILOTS[currentSlideIdx];

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = trackQuery.trim();
    if (!query) return;
    navigate(`/track/${encodeURIComponent(query)}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* ========================================================
          1. HERO SECTION (Field-Grade Editorial Aesthetic)
          Modeled after Kabadiwala Connect HeroReel:
          - Saffron leading rule & monospace civic kicker
          - Fluid display headline with outlined text-stroke
          - Field-grade telemetry HUD with corner brackets
          ======================================================== */}
      <section className="relative overflow-hidden pt-8 pb-14 lg:pt-14 lg:pb-20 border-b border-border">
        {/* Ambient atmospheric glow contained within boundary */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center min-w-0">
            {/* Left Column (7 cols): Editorial Typography & Direct Action */}
            <div className="lg:col-span-7 space-y-6 min-w-0">
              {/* Civic Kicker with Saffron Rule */}
              <div className="flex items-center gap-3">
                <span className="w-8 h-0.5 bg-accent shrink-0" />
                <span className="font-mono text-xs text-accent uppercase tracking-widest font-bold truncate">
                  GOVERNMENT OF MAHARASHTRA // SIH 2026 ID 26136
                </span>
              </div>

              {/* Bold Fluid Display Headline */}
              <div className="space-y-1 select-none font-display">
                <h1 className="fluid-headline uppercase tracking-tight text-foreground">
                  FROM CIVIC NEED.
                </h1>
                <div className="fluid-headline uppercase tracking-tight text-stroke">
                  TO SANDBOX PILOT.
                </div>
                <div className="fluid-headline uppercase tracking-tight text-accent">
                  STATEWIDE SCALE.
                </div>
              </div>

              {/* Marathi Subtitle & Problem Statement Grounding */}
              <div className="p-3 rounded-lg bg-card/60 border border-border/80 text-xs font-mono text-muted-foreground flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 truncate">
                  <StateSeal size="xs" />
                  <span className="font-devanagari font-bold text-foreground">समाधानसेतू</span>
                  <span className="text-border">|</span>
                  <span className="truncate">महाराष्ट्र राज्य नाविन्यता समाज (MSInS)</span>
                </div>
                <span className="text-[10px] uppercase font-bold text-accent px-2 py-0.5 rounded bg-accent/15 border border-accent/30 shrink-0 font-mono">
                  DPIIT WAIVER GFR 170
                </span>
              </div>

              {/* Editorial Description */}
              <p className="text-sm sm:text-base text-muted-foreground font-body leading-relaxed max-w-2xl">
                A transparent, competitive, legally compliant innovation-procurement pathway enabling Maharashtra's 36 district departments to formulate outcome-based needs, pilot novel startup technologies in safe-harbour sandboxes, disburse milestone payments in 7 days, and scale validated solutions directly under GFR Rule 194.
              </p>

              {/* Primary Action Buttons (Minimum 48px touch target) */}
              <div className="pt-2 flex flex-wrap items-center gap-3.5">
                <Link to="/report" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto min-h-[48px] px-6 py-3 bg-accent hover:bg-accent-hover text-accent-foreground font-heading text-sm font-bold uppercase tracking-wider rounded-sm glow-saffron active:scale-95 transition-all cursor-pointer shadow-md gap-2"
                  >
                    <Building2 className="h-4 w-4" />
                    <span>Post Department Challenge</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>

                <Link to="/problems" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto min-h-[48px] px-5 py-3 bg-card border-border hover:border-accent text-foreground font-mono text-xs uppercase tracking-wider rounded-sm hover:bg-secondary/50 transition cursor-pointer gap-2"
                  >
                    <Rocket className="h-4 w-4 text-accent" />
                    <span>Explore Open Challenges</span>
                  </Button>
                </Link>

                <Link to="/templates" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    variant="ghost"
                    className="w-full sm:w-auto min-h-[48px] px-4 py-3 text-muted-foreground hover:text-foreground font-mono text-xs uppercase tracking-wider gap-1.5 cursor-pointer"
                  >
                    <FileText className="h-4 w-4 text-accent" />
                    <span>Standard Legal Templates</span>
                  </Button>
                </Link>
              </div>

              {/* Statutory Trust Assurance Badges */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-mono text-muted-foreground pt-1 border-t border-border/60">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  <span>ZERO TURNOVER WAIVER (GFR 170/173)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-accent" />
                  <span>7-DAY ESCROW SLA</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Award className="h-4 w-4 text-primary" />
                  <span>GFR 194 DIRECT SCALE-UP</span>
                </div>
              </div>
            </div>

            {/* Right Column (5 cols): Real-Time Pilot Telemetry HUD (Field Grade) */}
            <div className="lg:col-span-5 min-w-0">
              <div className="relative rounded-sm border-2 border-border bg-card shadow-2xl corner-brackets overflow-hidden">
                {/* HUD Top Bar */}
                <div className="p-3.5 bg-secondary/80 border-b border-border flex items-center justify-between text-xs font-mono">
                  <div className="inline-flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-card border border-border text-accent font-bold text-[10px] tracking-wider">
                      <Radio className="h-3 w-3 animate-pulse text-accent" />
                      <span>LIVE TELEMETRY</span>
                    </span>
                    <span className="text-[10px] font-bold text-foreground truncate max-w-[130px] sm:max-w-[180px]">
                      {activePilot.district}
                    </span>
                  </div>
                  <span className="font-mono text-xs font-bold text-accent bg-card px-2 py-0.5 border border-border rounded-xs">
                    0{currentSlideIdx + 1} / 0{FIELD_REEL_PILOTS.length}
                  </span>
                </div>

                {/* HUD Active Dossier Body */}
                <div className="p-5 space-y-4 relative">
                  <div className="scanline absolute inset-0 opacity-40 pointer-events-none" />

                  {/* Stage Pill */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[10px] font-black tracking-wider uppercase px-2 py-0.5 rounded bg-accent/15 text-accent border border-accent/30">
                      {activePilot.stage}
                    </span>
                    <span className="font-mono text-xs font-black text-foreground">
                      REF: {activePilot.id}
                    </span>
                  </div>

                  {/* Title & Department */}
                  <div>
                    <h3 className="font-heading font-black text-base sm:text-lg text-foreground uppercase tracking-tight line-clamp-2">
                      {activePilot.title}
                    </h3>
                    <p className="font-mono text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
                      <Building2 className="h-3 w-3 text-accent shrink-0" />
                      <span className="truncate">{activePilot.department}</span>
                    </p>
                  </div>

                  {/* Startup Info Tag */}
                  <div className="p-2.5 rounded bg-secondary/50 border border-border/80 font-mono text-[11px] space-y-1">
                    <div className="text-muted-foreground uppercase text-[10px] font-bold">Contracted Startup:</div>
                    <div className="text-foreground font-semibold truncate">{activePilot.startup}</div>
                  </div>

                  {/* Telemetry Metric Grid */}
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div className="p-3 rounded bg-card border border-border space-y-1">
                      <div className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground font-bold">
                        {activePilot.metricLabel}
                      </div>
                      <div className="font-display text-2xl font-black text-emerald-500 tracking-tight">
                        {activePilot.metricValue}
                      </div>
                      <div className="font-mono text-[10px] text-muted-foreground">Certified by VJTI Audit</div>
                    </div>

                    <div className="p-3 rounded bg-card border border-border space-y-1">
                      <div className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground font-bold">
                        ESCROW PILOT GRANT
                      </div>
                      <div className="font-display text-2xl font-black text-accent tracking-tight">
                        {activePilot.budget}
                      </div>
                      <div className="font-mono text-[10px] text-muted-foreground">{activePilot.turnaround}</div>
                    </div>
                  </div>

                  {/* Scale Pathway Tag */}
                  <div className="flex items-center justify-between text-xs font-mono pt-1">
                    <span className="text-muted-foreground text-[10px]">SCALE-UP VERDICT:</span>
                    <span className="text-emerald-500 font-bold text-[11px]">{activePilot.scalePathway}</span>
                  </div>
                </div>

                {/* HUD Bottom Bar with Live Progress */}
                <div className="p-3 bg-secondary/90 border-t border-border space-y-2">
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span className="text-[10px] text-muted-foreground uppercase">
                      TELEMETRY MESH: {activePilot.codePattern}
                    </span>
                    <Link
                      to={`/track/${activePilot.id}`}
                      className="text-[11px] font-bold text-accent hover:underline inline-flex items-center gap-1 cursor-pointer"
                    >
                      <span>INSPECT DOSSIER</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>

                  {/* Progress Line */}
                  <div className="w-full h-1 bg-border rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent transition-all duration-75 ease-linear"
                      style={{ width: `${reelProgress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          2. PROVEN IMPACT STATS STRIP (2x2 Mobile, 4 Cols Desktop)
          With corner-brackets, count-up numbers & statutory units
          ======================================================== */}
      <section className="py-10 sm:py-14 bg-secondary/20 border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Section Marker */}
          <div className="flex items-center gap-3 mb-6 sm:mb-8">
            <span className="w-8 h-0.5 bg-accent" />
            <span className="font-mono text-xs text-accent tracking-widest uppercase font-bold">
              01 // STATEWIDE SANDBOX GAINS &amp; TELEMETRY
            </span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 min-w-0">
            {/* Stat 1 */}
            <div className="relative p-5 sm:p-6 bg-card border border-border corner-brackets space-y-2">
              <div className="flex items-center justify-between font-mono text-[10px] text-muted-foreground uppercase font-bold">
                <span>INNOVATION DESKS</span>
                <span className="text-emerald-500 font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                  100% ONLINE
                </span>
              </div>
              <div className="font-display text-3xl sm:text-4xl text-foreground font-black tracking-tight">
                <AnimatedStatCounter value={36} suffix=" DISTRICTS" />
              </div>
              <p className="font-mono text-xs text-muted-foreground">Active Department Innovation Cells Across Maharashtra</p>
            </div>

            {/* Stat 2 */}
            <div className="relative p-5 sm:p-6 bg-card border border-border corner-brackets space-y-2">
              <div className="flex items-center justify-between font-mono text-[10px] text-muted-foreground uppercase font-bold">
                <span>PILOT ESCROW DISBURSED</span>
                <span className="text-accent font-bold px-1.5 py-0.5 rounded bg-accent/10 border border-accent/20">
                  ZERO DELAY
                </span>
              </div>
              <div className="font-display text-3xl sm:text-4xl text-foreground font-black tracking-tight">
                ₹4.2 CRORE
              </div>
              <p className="font-mono text-xs text-muted-foreground">Direct Milestone Grants Released to DPIIT Startups</p>
            </div>

            {/* Stat 3 */}
            <div className="relative p-5 sm:p-6 bg-card border border-border corner-brackets space-y-2">
              <div className="flex items-center justify-between font-mono text-[10px] text-muted-foreground uppercase font-bold">
                <span>AVG PILOT DURATION</span>
                <span className="text-primary font-bold px-1.5 py-0.5 rounded bg-primary/10 border border-primary/20">
                  GFR SLA
                </span>
              </div>
              <div className="font-display text-3xl sm:text-4xl text-foreground font-black tracking-tight">
                <AnimatedStatCounter value={42} suffix=" DAYS" />
              </div>
              <p className="font-mono text-xs text-muted-foreground">Sandbox Testing to Statutory Audit (Target: 45 Days)</p>
            </div>

            {/* Stat 4 */}
            <div className="relative p-5 sm:p-6 bg-card border border-border corner-brackets space-y-2">
              <div className="flex items-center justify-between font-mono text-[10px] text-muted-foreground uppercase font-bold">
                <span>SCALE-UP SUCCESS</span>
                <span className="text-emerald-500 font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                  GFR 194
                </span>
              </div>
              <div className="font-display text-3xl sm:text-4xl text-foreground font-black tracking-tight">
                81.4%
              </div>
              <p className="font-mono text-xs text-muted-foreground">Pilots Transitioned to Direct Procurement or GeM</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          3. DOCKET TRACKER LOOKUP BAR (Monospace Field Bar)
          ======================================================== */}
      <section className="py-8 bg-card border-b border-border">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="flex items-center gap-3 mb-3">
            <span className="w-8 h-0.5 bg-accent" />
            <span className="font-mono text-xs text-accent tracking-widest uppercase font-bold">
              02 // PILOT DOCKET INSPECTION
            </span>
          </div>

          <form onSubmit={handleTrackSubmit} className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                value={trackQuery}
                onChange={(e) => setTrackQuery(e.target.value)}
                placeholder="Track any pilot or challenge (e.g. SS-2026-001043 or SS-2026-001042)..."
                className="pl-10 h-12 text-xs sm:text-sm bg-secondary/50 border-border font-mono rounded-sm focus-visible:ring-accent"
              />
            </div>
            <Button
              type="submit"
              size="lg"
              className="w-full sm:w-auto h-12 px-6 font-bold cursor-pointer bg-primary text-white hover:bg-primary-hover rounded-sm uppercase font-heading text-xs tracking-wider"
            >
              <span>Inspect Docket</span>
              <ArrowRight className="h-4 w-4 ml-1.5" />
            </Button>
          </form>

          {/* Quick-select chips */}
          <div className="mt-3.5 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-muted-foreground font-mono text-[11px] uppercase font-bold">Quick Pilots:</span>
            {FIELD_REEL_PILOTS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => navigate(`/track/${p.id}`)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-secondary border border-border text-[11px] font-mono text-foreground hover:border-accent hover:text-accent transition-colors cursor-pointer"
              >
                <Activity className="h-3 w-3 text-accent" />
                <span>{p.id}</span>
                <span className="text-muted-foreground truncate max-w-[120px]">({p.district})</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          4. DUAL GATEWAY ARCHITECTURE CARDS
          Demand Side (Government) vs Supply Side (Startups)
          ======================================================== */}
      <section className="py-14 sm:py-20 border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-0.5 bg-accent" />
            <span className="font-mono text-xs text-accent tracking-widest uppercase font-bold">
              03 // DUAL GATEWAY ARCHITECTURE
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <h2 className="font-display text-3xl sm:text-5xl text-foreground uppercase tracking-tight">
                TWO GATEWAYS TO PUBLIC INNOVATION
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-muted-foreground max-w-2xl font-body">
                Purpose-built workflows for government departments seeking outcome-driven technologies and innovative startups ready to deploy in real public infrastructure.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-stretch">
            {/* Department Gateway (Solid Dense Working Surface) */}
            <div className="relative rounded-sm bg-card border-2 border-border p-6 sm:p-8 flex flex-col justify-between corner-brackets hover:border-accent/60 transition-all">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-black uppercase tracking-wider text-accent bg-accent/15 px-2.5 py-1 rounded-xs border border-accent/30 font-mono">
                    DEMAND SIDE // GOVERNMENT BUYER
                  </span>
                  <Building2 className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-heading text-xl sm:text-2xl font-black text-foreground uppercase tracking-tight">
                  For Government Departments
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground mt-2 leading-relaxed font-body">
                  Formulate outcome-based challenges with pre-vetted legal templates, evaluate innovative solutions with expert panels, and run risk-managed sandbox pilots.
                </p>

                <ul className="mt-6 space-y-3 text-xs text-foreground/90 font-mono">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Pre-built outcome statements &amp; tripartite legal pilot templates</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Automated Challenge Quality scoring (0–100) before publication</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Direct access to 10,000+ DPIIT-recognized startups</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Milestone-based contracting with 7-day escrow release safeguards</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-6 border-t border-border">
                <Link to="/report">
                  <Button className="w-full min-h-[46px] font-bold text-xs uppercase tracking-wider bg-accent hover:bg-accent-hover text-accent-foreground cursor-pointer rounded-sm">
                    <span>Post a Department Challenge</span>
                    <ArrowRight className="h-4 w-4 ml-1.5" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Startup Gateway (Solid Dense Working Surface) */}
            <div className="relative rounded-sm bg-card border-2 border-border p-6 sm:p-8 flex flex-col justify-between corner-brackets hover:border-primary/60 transition-all">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-black uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-1 rounded-xs border border-primary/20 font-mono">
                    SUPPLY SIDE // STARTUP SOLVER
                  </span>
                  <Rocket className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-heading text-xl sm:text-2xl font-black text-foreground uppercase tracking-tight">
                  For Innovative Startups
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground mt-2 leading-relaxed font-body">
                  Overcome turnover and experience barriers with statutory DPIIT relaxation rules, bid for structured government pilots, receive guaranteed milestone escrow payments, and scale statewide.
                </p>

                <ul className="mt-6 space-y-3 text-xs text-foreground/90 font-mono">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Zero prior turnover/experience penalty under GFR Rule 170/173</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Objective, multi-expert weighted scoring matrix (5 dimensions)</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Protected intellectual property &amp; sandbox safe-harbour clauses</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Fast-track GFR 194 direct scale or GeM Startup Runway export</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-6 border-t border-border">
                <Link to="/problems">
                  <Button className="w-full min-h-[46px] font-bold text-xs uppercase tracking-wider cursor-pointer bg-primary hover:bg-primary-hover text-white rounded-sm">
                    <span>Explore Open Challenges</span>
                    <ArrowRight className="h-4 w-4 ml-1.5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          5. THE 11-STAGE STATUTORY PROCUREMENT PATHWAY
          ======================================================== */}
      <section className="py-14 sm:py-20 bg-secondary/20 border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-0.5 bg-accent" />
            <span className="font-mono text-xs text-accent tracking-widest uppercase font-bold">
              04 // STATUTORY INNOVATION LIFECYCLE
            </span>
          </div>

          <div className="max-w-3xl mb-10">
            <h2 className="font-display text-3xl sm:text-5xl text-foreground uppercase tracking-tight">
              11-STAGE STATUTORY PROCUREMENT PATHWAY
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-2 font-body">
              A legally compliant, audit-transparent route from initial problem framing to statewide procurement without repeat public bidding.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {STATUTORY_STEPS.map((st) => (
              <div
                key={st.step}
                className="relative rounded-sm bg-card border border-border p-4.5 hover:border-accent/50 hover:shadow-sm transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-black text-accent px-1.5 py-0.5 rounded-xs bg-accent/15 border border-accent/25">
                      STAGE {st.step}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-foreground font-heading uppercase">{st.title}</h4>
                  <p className="text-[11px] text-muted-foreground mt-1.5 leading-snug font-body">{st.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          6. 36-DISTRICT FIELD TELEMETRY HUBS
          ======================================================== */}
      <section className="py-14 sm:py-20 border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-0.5 bg-accent" />
            <span className="font-mono text-xs text-accent tracking-widest uppercase font-bold">
              05 // STATEWIDE FIELD RADAR
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <h2 className="font-display text-3xl sm:text-5xl text-foreground uppercase tracking-tight">
                36 DISTRICT INNOVATION DESKS
              </h2>
              <p className="text-xs text-muted-foreground mt-1 font-body">
                Live pilot telemetry, turnaround metrics, and scale-up graduation rates across Maharashtra.
              </p>
            </div>
            <Link to="/dashboard/analytics">
              <Button variant="outline" size="sm" className="text-xs font-mono uppercase tracking-wider font-bold gap-1.5 cursor-pointer border-border hover:border-accent">
                <span>View Full Telemetry Analytics</span>
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
                  'px-3.5 py-2 rounded-xs text-xs font-mono uppercase tracking-wider font-semibold whitespace-nowrap transition-all cursor-pointer border flex items-center gap-2',
                  selectedHub.id === hub.id
                    ? 'bg-accent text-accent-foreground border-accent font-bold shadow-xs'
                    : 'bg-card text-muted-foreground hover:text-foreground border-border'
                )}
              >
                <span>{hub.name}</span>
                <span className="text-[11px] font-devanagari opacity-90">({hub.marathi})</span>
              </button>
            ))}
          </div>

          {/* Selected District Telemetry Card (Solid Dense Surface with Corner Brackets) */}
          <div className="rounded-sm bg-card p-6 sm:p-8 mt-4 border-2 border-border corner-brackets">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-border">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <h3 className="text-xl sm:text-2xl font-black text-foreground font-heading uppercase">
                    {selectedHub.name} ({selectedHub.marathi})
                  </h3>
                  <span className="text-xs px-2.5 py-0.5 rounded-xs bg-primary/10 text-primary font-bold border border-primary/20 font-mono">
                    {selectedHub.tag}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground font-mono">
                  NODAL AUTHORITY: <strong className="text-foreground">{selectedHub.nodalSecretary}</strong>
                </p>
              </div>

              <div className="flex items-center gap-6">
                <div>
                  <div className="text-[10px] uppercase font-bold text-muted-foreground font-mono">ACTIVE CHALLENGES</div>
                  <div className="text-2xl sm:text-3xl font-black font-display text-foreground tabular-nums">
                    <AnimatedStatCounter value={selectedHub.activeChallenges} />
                  </div>
                </div>
                <div className="h-8 w-[1px] bg-border" />
                <div>
                  <div className="text-[10px] uppercase font-bold text-muted-foreground font-mono">PILOTS RUNNING</div>
                  <div className="text-2xl sm:text-3xl font-black font-display text-accent tabular-nums">
                    <AnimatedStatCounter value={selectedHub.pilotsRunning} />
                  </div>
                </div>
                <div className="h-8 w-[1px] bg-border" />
                <div>
                  <div className="text-[10px] uppercase font-bold text-muted-foreground font-mono">SCALE-UP RATE</div>
                  <div className="text-2xl sm:text-3xl font-black font-display text-emerald-500 tabular-nums">
                    {selectedHub.scaledRate}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 text-xs font-mono">
              <div>
                <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-1">
                  PRIMARY SECTORAL FOCUS
                </span>
                <p className="text-foreground font-medium leading-relaxed font-body text-xs">{selectedHub.primaryFocus}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-1">
                  AVERAGE SANDBOX PILOT TURNAROUND
                </span>
                <p className="text-foreground font-bold text-sm">{selectedHub.avgTurnaround} (Statutory Target: 45 Days)</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          7. RECENT SCALED PILOTS SHOWCASE (Field Evidence)
          ======================================================== */}
      <section className="py-14 sm:py-20 bg-secondary/15">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-0.5 bg-accent" />
            <span className="font-mono text-xs text-accent tracking-widest uppercase font-bold">
              06 // GRADUATED FIELD EVIDENCE
            </span>
          </div>

          <div className="text-left max-w-2xl mb-10">
            <h2 className="font-display text-3xl sm:text-5xl text-foreground uppercase tracking-tight">
              RECENT SCALED PILOTS IN MAHARASHTRA
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-2 font-body">
              Startups that successfully graduated through sandbox testing into statewide public procurement orders.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {RECENT_SCALED_PILOTS.map((pilot) => (
              <div
                key={pilot.id}
                className="rounded-sm bg-card border border-border p-5 flex flex-col justify-between corner-brackets hover:border-accent/60 transition-all space-y-4"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-xs border border-primary/20">
                      {pilot.id}
                    </span>
                    <span className="text-[11px] font-mono font-bold text-accent">₹{pilot.budgetLakhs}L</span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-foreground font-heading uppercase line-clamp-2">
                    {pilot.title}
                  </h4>
                  <div className="text-[11px] text-muted-foreground font-mono">
                    {pilot.department} • <strong className="text-foreground">{pilot.district}</strong>
                  </div>
                  <div className="p-3 rounded bg-secondary text-[11px] text-foreground font-mono leading-relaxed border border-border/80">
                    <div className="text-[9px] uppercase font-bold text-muted-foreground mb-0.5">VALIDATED OUTCOME:</div>
                    {pilot.validatedOutcome}
                  </div>
                </div>

                <div className="pt-3 border-t border-border flex items-center justify-between">
                  <span className="text-[10px] font-bold text-emerald-500 font-mono">{pilot.scalePathway}</span>
                  <Link
                    to={`/track/${pilot.id}`}
                    className="text-xs font-mono uppercase font-bold text-accent hover:underline flex items-center gap-1"
                  >
                    <span>INSPECT</span>
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