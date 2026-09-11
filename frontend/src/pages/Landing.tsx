import { useState, useRef } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Search,
  Sparkles,
  MapPin,
  Flame,
  Award,
  ChevronRight,
  Building2,
  GraduationCap,
  Scale,
  Activity,
  FileCheck,
  Compass,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { QuickReportWidget } from '@/components/shared/QuickReportWidget';
import { AnimatedStatCounter } from '@/components/shared/AnimatedStatCounter';
import { PrototypeSwitcher } from '@/components/shared/PrototypeSwitcher';
import { StateSeal } from '@/components/shared/StateSeal';
import { DistrictTelemetryMap } from '@/components/shared/DistrictTelemetryMap';
import { getPlatformStats, getStoredComplaints } from '@/lib/complaints';
import { cn } from '@/lib/utils';

// Official District Telemetry Data for Jharkhand
const DISTRICT_TELEMETRY = [
  {
    id: 'ranchi',
    name: 'Ranchi',
    hindi: 'राँची',
    type: 'State Capital & Urban Municipal Corp',
    dockets: 412,
    resolvedRate: '92.4%',
    avgSla: '2.1 Days',
    nodalOfficer: 'Sri R. K. Verma, IAS (Addl. Municipal Comm.)',
    solverHub: 'BIT Mesra & NIFFT Ranchi',
    primaryFocus: 'Drainage culverts, Smart Road expansion, LED grid',
  },
  {
    id: 'dhanbad',
    name: 'Dhanbad',
    hindi: 'धनबाद',
    type: 'Coal Capital & Mineral Belt Hub',
    dockets: 348,
    resolvedRate: '88.7%',
    avgSla: '2.6 Days',
    nodalOfficer: 'Smt. Priya Murmu, JPSC (Executive Engineer DWSD)',
    solverHub: 'IIT (ISM) Dhanbad & BIT Sindri',
    primaryFocus: 'Mine-affected borewell filtration, ash dust, transformer burns',
  },
  {
    id: 'east_singhbhum',
    name: 'East Singhbhum (Jamshedpur)',
    hindi: 'पूर्वी सिंहभूम',
    type: 'Industrial Hub & Steel City',
    dockets: 295,
    resolvedRate: '94.1%',
    avgSla: '1.8 Days',
    nodalOfficer: 'Sri A. P. Soren, JPSC (District Planning Officer)',
    solverHub: 'NIT Jamshedpur & XLRI Social Lab',
    primaryFocus: 'Subernarekha catchment sanitation, peripheral link roads',
  },
  {
    id: 'bokaro',
    name: 'Bokaro',
    hindi: 'बोकारो',
    type: 'Steel City & Chas Sub-Division',
    dockets: 184,
    resolvedRate: '90.2%',
    avgSla: '2.3 Days',
    nodalOfficer: 'Dr. M. K. Pandey (Executive Officer Chas)',
    solverHub: 'Gola Engineering Campus & DVC Tech Team',
    primaryFocus: 'Chas drainage overflow, rural 11kV feeder lines',
  },
  {
    id: 'deoghar',
    name: 'Deoghar',
    hindi: 'देवघर',
    type: 'Pilgrim Centre & Santhal Pargana',
    dockets: 162,
    resolvedRate: '91.8%',
    avgSla: '2.0 Days',
    nodalOfficer: 'Sri B. N. Singh (Nodal Officer Tourism/Civic)',
    solverHub: 'AIIMS Deoghar Community Health & BIT Extension',
    primaryFocus: 'Water distribution grid, crowd waste management',
  },
  {
    id: 'hazaribagh',
    name: 'Hazaribagh',
    hindi: 'हज़ारीबाग',
    type: 'North Chotanagpur Educational Division',
    dockets: 145,
    resolvedRate: '87.5%',
    avgSla: '2.8 Days',
    nodalOfficer: 'Smt. Anjali Minz (District Engineer Rural Works)',
    solverHub: 'Vinoba Bhave University Research Cell',
    primaryFocus: 'Rural checkdam desilting, culvert scour protection',
  },
];

const LIVE_DISPATCHES = [
  { id: 'SS-2026-894120', district: 'Ranchi', dept: 'RCD / PWD', title: 'Ring Road Culvert Desilted (Ward 14)', time: '12m ago' },
  { id: 'SS-2026-790548', district: 'Dhanbad', dept: 'DWSD', title: 'Govindpur Deep Borewell Restored', time: '28m ago' },
  { id: 'SS-2026-641092', district: 'Bokaro', dept: 'JBVNL', title: 'Sector 4 100kVA Transformer Replaced', time: '1h ago' },
  { id: 'SS-2026-532109', district: 'Deoghar', dept: 'UD&HD', title: 'VIP Chowk High-Volume Drainage Desilted', time: '2h ago' },
  { id: 'SS-2026-420918', district: 'Hazaribagh', dept: 'Rural Dev', title: 'Barhi Checkdam Remediation by BIT Mesra', time: '3h ago' },
  { id: 'SS-2026-319842', district: 'Jamshedpur', dept: 'PWD', title: 'Kadma Link Road Potholes Tarmac Patched', time: '4h ago' },
];

export default function Landing() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const variant = searchParams.get('variant')?.toUpperCase() || 'A';
  const quickReportRef = useRef<HTMLDivElement>(null);

  const [trackInput, setTrackInput] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState(DISTRICT_TELEMETRY[0]);
  const [stats] = useState(() => getPlatformStats());
  const [complaints] = useState(() => getStoredComplaints());

  const resolvedComplaints = complaints
    .filter((c) => c.status === 'resolved')
    .slice(0, 3);

  const handleScrollToReport = () => {
    quickReportRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackInput.trim()) return;
    navigate(`/track/${encodeURIComponent(trackInput.trim().toUpperCase())}`);
  };

  const sampleTrackingIds = [
    { id: 'SS-2026-000481', label: 'In Progress (JBVNL)' },
    { id: 'SS-2026-000482', label: 'Under Nodal Review (DWSD)' },
    { id: 'SS-2026-000484', label: 'Ground Verified (RCD)' },
    { id: 'SS-2026-000485', label: 'Appealable Admittance' },
  ];

  if (variant === 'B') {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <VariantBExecutiveTelemetry stats={stats} complaints={complaints} navigate={navigate} />
        <PrototypeSwitcher />
      </div>
    );
  }

  if (variant === 'C') {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <VariantCGuidedJourney navigate={navigate} />
        <PrototypeSwitcher />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* 1. Sovereign Editorial Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-14 sm:pt-20 sm:pb-18 border-b border-border bg-gradient-to-b from-primary/5 via-background to-background px-4 sm:px-6">
        <div className="absolute inset-0 hero-grid-pattern opacity-40 pointer-events-none" />

        <div className="relative max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Column: Sovereign Authority & Mission */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Official Gazette Badge */}
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-bold tracking-tight border border-primary/25 shadow-2xs">
                <StateSeal size="sm" />
                <span>{t('landing.hero.badge', 'झारखंड सरकार • SIH 2026 Problem Statement 043')}</span>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
              </div>

              {/* Editorial Display Heading */}
              <div className="space-y-2">
                <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-amber-700 dark:text-amber-400 font-mono block">
                  {t('landing.hero.kicker', 'प्रत्येक जनसमस्या का पारदर्शी निवारण')}
                </span>
                <h1 className="text-3xl sm:text-5xl lg:text-5xl font-black tracking-tight text-foreground leading-[1.14]">
                  {t('landing.hero.titlePart1', 'Sovereign Public Redressal &')} <br className="hidden sm:inline" />
                  <span className="bg-gradient-to-r from-emerald-800 via-teal-700 to-emerald-600 dark:from-emerald-300 dark:via-teal-300 dark:to-emerald-400 bg-clip-text text-transparent">
                    {t('landing.hero.titlePart2', 'Multi-Sector Solver Exchange')}
                  </span>
                </h1>
              </div>

              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl font-normal">
                {t('landing.hero.subtitle', 'Connecting 3.9 Crore citizens across 24 districts directly to District Nodal Officers, academic engineering teams from BIT Mesra, NIT Jamshedpur & IIT-ISM Dhanbad, and CSR delivery squads. Guaranteed algorithmic authenticity with human administrative accountability.')}
              </p>

              {/* Action Console */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Button
                  size="lg"
                  onClick={handleScrollToReport}
                  className="bg-accent hover:bg-accent-hover text-accent-foreground font-black shadow-md hover:shadow-xl transition-all h-12 px-6 rounded-xl cursor-pointer text-xs sm:text-sm gap-2 glow-accent"
                >
                  <FileCheck className="h-4 w-4" />
                  <span>{t('landing.hero.fileDocket', 'File Grievance Docket')}</span>
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate('/problems')}
                  className="font-bold h-12 px-5 rounded-xl border-border bg-card hover:bg-secondary text-foreground gap-2 text-xs sm:text-sm shadow-xs"
                >
                  <Compass className="h-4 w-4 text-primary" />
                  <span>{t('landing.hero.challengeBoard', 'Academic Challenge Board')}</span>
                </Button>
              </div>

              {/* Tripartite Sovereign Verification Highlights */}
              <div className="pt-4 grid grid-cols-3 gap-2 text-left border-t border-border/70 text-xs">
                <div className="p-2.5 rounded-lg bg-card/80 border border-border/80">
                  <span className="text-[10px] uppercase font-mono font-bold text-muted-foreground block">{t('landing.hero.aiPreCheck', 'AI Pre-Check')}</span>
                  <span className="font-bold text-foreground block mt-0.5 text-xs">{t('landing.hero.aiFactor', '0–100 Multi-Factor')}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-card/80 border border-border/80">
                  <span className="text-[10px] uppercase font-mono font-bold text-muted-foreground block">{t('landing.hero.slaProtection', 'SLA Protection')}</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 block mt-0.5 text-xs">{t('landing.hero.slaClock', '72-Hour Clock')}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-card/80 border border-border/80">
                  <span className="text-[10px] uppercase font-mono font-bold text-muted-foreground block">{t('landing.hero.publicAudit', 'Public Audit')}</span>
                  <span className="font-bold text-foreground block mt-0.5 text-xs">{t('landing.hero.permanentToken', 'Permanent Token')}</span>
                </div>
              </div>
            </div>

            {/* Right Column: Instant Public Tracker Card */}
            <div className="lg:col-span-5">
              <Card className="docket-sheet rounded-2xl overflow-hidden p-6 sm:p-7 space-y-5 border border-border shadow-xl">
                <div className="docket-ledger-rule -mx-6 sm:-mx-7 -mt-6 sm:-mt-7 mb-4" />

                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />
                    <span className="text-xs font-mono font-black uppercase tracking-wider text-foreground">
                      {t('landing.tracker.title', 'PUBLIC CASE DOCKET INQUIRY')}
                    </span>
                  </div>
                  <div className="docket-stamp docket-stamp-action text-[10px] py-0.5">
                    {t('landing.tracker.badge', 'REGISTRY 2026')}
                  </div>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  {t('landing.tracker.desc', 'Enter your official alphanumeric tracking code (format: SS-YYYY-NNNNNN) to inspect live field dispatches, officer orders, and AI diagnostic scorecards.')}
                </p>

                <form onSubmit={handleTrackSubmit} className="space-y-3">
                  <div className="relative">
                    <Search className="h-4 w-4 absolute left-3.5 top-3.5 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="e.g. SS-2026-000481"
                      value={trackInput}
                      onChange={(e) => setTrackInput(e.target.value)}
                      className="pl-10 h-12 text-sm font-mono uppercase font-bold tracking-wider bg-secondary/30"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full h-11 font-bold bg-primary hover:bg-primary-hover text-primary-foreground cursor-pointer shadow-sm rounded-xl transition-all text-xs"
                  >
                    <span>{t('landing.tracker.button', 'Retrieve Verified Case Dossier')}</span>
                    <ArrowRight className="h-3.5 w-3.5 ml-1" />
                  </Button>
                </form>

                {/* Sample Live Cases */}
                <div className="pt-3 border-t border-dashed border-border/80">
                  <span className="text-[10.5px] font-mono text-muted-foreground block mb-2 uppercase font-bold">
                    {t('landing.tracker.sampleHeading', 'Sample Verified Incidents on Live Feed:')}
                  </span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {sampleTrackingIds.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => navigate(`/track/${item.id}`)}
                        className="p-2 rounded-lg text-left text-[11px] bg-secondary/50 hover:bg-secondary text-foreground border border-border/70 hover:border-primary/50 transition-all font-mono group"
                      >
                        <span className="font-bold text-primary group-hover:underline block">{item.id}</span>
                        <span className="text-[10px] text-muted-foreground truncate block">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Embedded Grievance Intake Docket (Front & Center) */}
      <section ref={quickReportRef} className="py-12 sm:py-16 px-4 sm:px-6 bg-secondary/20 border-b border-border relative">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-primary bg-primary/10 px-3 py-1 rounded-md border border-primary/20">
              <Sparkles className="h-3 w-3" />
              <span>{t('landing.quickReport.badge', 'OFFICIAL INTAKE REGISTRY TERMINAL')}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
              {t('landing.quickReport.title', 'File an Official Grievance Docket')}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed">
              {t('landing.quickReport.desc', 'Submit your complaint with street particulars and evidence. Our multi-factor AI engine validates authenticity, eliminates duplicates, and dispatches the file to the responsible Nodal Officer.')}
            </p>
          </div>

          <QuickReportWidget />
        </div>
      </section>

      {/* 3. Live Civic Resolution Telemetry Ribbon (Marquee Ticker) */}
      <section className="bg-emerald-950 text-white border-b border-emerald-800/40 py-2.5 overflow-hidden relative">
        <div className="max-w-7xl mx-auto flex items-center">
          <div className="shrink-0 z-10 bg-emerald-950 pr-4 pl-4 font-mono text-xs font-black text-amber-300 flex items-center gap-2 border-r border-emerald-800/60">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span className="tracking-wider uppercase">{t('landing.liveDispatches', 'LIVE DISPATCHES')}</span>
          </div>

          <div className="overflow-hidden whitespace-nowrap w-full">
            <div className="ticker-marquee flex items-center gap-8 text-xs font-mono">
              {[...LIVE_DISPATCHES, ...LIVE_DISPATCHES].map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => navigate(`/track/${item.id}`)}
                  className="inline-flex items-center gap-2 cursor-pointer hover:text-emerald-300 transition-colors py-0.5"
                >
                  <span className="text-emerald-400 font-bold font-mono">{item.id}</span>
                  <span className="text-white/40">•</span>
                  <span className="text-amber-300 font-semibold">{item.district}</span>
                  <span className="text-white/40">({item.dept})</span>
                  <span className="text-white/90">{item.title}</span>
                  <span className="text-white/40 text-[10px]">[{item.time}]</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Official Platform Telemetry Counters (Real Database Metrics) */}
      <section className="py-10 bg-card border-b border-border shadow-xs relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
            {/* Metric 1 */}
            <div className="p-5 rounded-xl border border-border bg-secondary/20 docket-sheet card-hover-lift">
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center justify-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" />
                {t('landing.telemetry.verifiedRedressals', 'Verified Redressals')}
              </span>
              <div className="text-3xl sm:text-4xl font-black text-emerald-700 dark:text-emerald-400 mt-1">
                <AnimatedStatCounter value={stats.resolvedCount} />
              </div>
              <span className="text-[11px] text-muted-foreground font-mono">
                {t('landing.telemetry.geotagged', 'Geotagged & Inspected')}
              </span>
            </div>

            {/* Metric 2 */}
            <div className="p-5 rounded-xl border border-border bg-secondary/20 docket-sheet card-hover-lift">
              <span className="text-xs font-bold text-amber-700 dark:text-amber-400 flex items-center justify-center gap-1.5">
                <Clock className="h-4 w-4" />
                {t('landing.telemetry.activeScrutiny', 'Active Nodal Scrutiny')}
              </span>
              <div className="text-3xl sm:text-4xl font-black text-amber-600 dark:text-amber-400 mt-1">
                <AnimatedStatCounter value={stats.inReviewCount} />
              </div>
              <span className="text-[11px] text-muted-foreground font-mono">
                {t('landing.telemetry.assignedOfficers', 'Assigned to District Officers')}
              </span>
            </div>

            {/* Metric 3 */}
            <div className="p-5 rounded-xl border border-border bg-secondary/20 docket-sheet card-hover-lift">
              <span className="text-xs font-bold text-sky-700 dark:text-sky-400 flex items-center justify-center gap-1.5">
                <Zap className="h-4 w-4" />
                {t('landing.telemetry.fieldSquads', 'Field & Innovation Squads')}
              </span>
              <div className="text-3xl sm:text-4xl font-black text-sky-600 dark:text-sky-400 mt-1">
                <AnimatedStatCounter value={stats.inProgressCount} />
              </div>
              <span className="text-[11px] text-muted-foreground font-mono">
                {t('landing.telemetry.universityCsr', 'University & CSR Execution')}
              </span>
            </div>

            {/* Metric 4 */}
            <div className="p-5 rounded-xl border border-border bg-secondary/20 docket-sheet card-hover-lift">
              <span className="text-xs font-bold text-primary dark:text-emerald-400 flex items-center justify-center gap-1.5">
                <Award className="h-4 w-4" />
                {t('landing.telemetry.turnaround', 'Avg. Nodal Turnaround')}
              </span>
              <div className="text-3xl sm:text-4xl font-black text-foreground mt-1">
                <AnimatedStatCounter value={stats.avgResolutionTimeDays} decimals={1} suffix={` ${t('landing.telemetry.days', 'Days')}`} />
              </div>
              <span className="text-[11px] text-muted-foreground font-mono">
                {t('landing.telemetry.slaMandate', 'Within 72h Mandate')}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Interactive 24-District Operational Command Matrix */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 border-b border-border/80">
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-primary bg-primary/10 px-3 py-0.5 rounded-md mb-2 border border-primary/20">
                <MapPin className="h-3.5 w-3.5" />
                <span>{t('landing.districts.badge', 'STATE TELEMETRY MAP')}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
                {t('landing.districts.title', '24-District Administrative Matrix')}
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-prose">
                {t('landing.districts.desc', 'Select any district to inspect live case registry volumes, resolution compliance, assigned engineering solver institutions, and nodal oversight.')}
              </p>
            </div>

            <Button
              variant="outline"
              onClick={() => navigate('/problems')}
              className="text-xs font-bold border-border"
            >
              <span>{t('landing.districts.viewAll', 'View All District Challenges')}</span>
              <ChevronRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </div>

          {/* District Selector Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {DISTRICT_TELEMETRY.map((d) => {
              const isSelected = selectedDistrict.id === d.id;
              return (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setSelectedDistrict(d)}
                  className={cn(
                    'p-3 rounded-xl border text-left transition-all cursor-pointer group flex flex-col justify-between',
                    isSelected
                      ? 'border-emerald-600 bg-emerald-500/10 ring-2 ring-emerald-500/20 shadow-xs'
                      : 'border-border/80 bg-card hover:bg-secondary/60'
                  )}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs font-black text-foreground">{d.name}</span>
                    <span className="text-[10px] text-muted-foreground font-hindi">{d.hindi}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[10px] font-mono">
                    <span className="text-muted-foreground">{d.dockets} Dockets</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{d.resolvedRate}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Interactive Google Map Telemetry Showcase */}
          <DistrictTelemetryMap
            districts={DISTRICT_TELEMETRY}
            selectedDistrict={selectedDistrict}
            onSelectDistrict={(d) => setSelectedDistrict(d)}
          />

          {/* District Operational Deep-Dive Dossier */}
          <Card className="docket-sheet rounded-2xl p-6 sm:p-8 border border-border space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-black text-foreground">{selectedDistrict.name} District Command</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary font-mono font-bold">
                    {selectedDistrict.type}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground block font-mono">
                  Administrative Nodal Officer: <strong className="text-foreground">{selectedDistrict.nodalOfficer}</strong>
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-[10px] uppercase font-mono text-muted-foreground block">Verified Redressal Rate</span>
                  <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">{selectedDistrict.resolvedRate}</span>
                </div>
                <div className="h-8 w-px bg-border hidden sm:block" />
                <div className="text-right">
                  <span className="text-[10px] uppercase font-mono text-muted-foreground block">Avg Nodal Turnaround</span>
                  <span className="text-xl font-black text-foreground">{selectedDistrict.avgSla}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="space-y-2 p-4 rounded-xl border border-border bg-secondary/20">
                <div className="flex items-center gap-2 text-foreground font-bold">
                  <GraduationCap className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Academic Engineering Solver Hub</span>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Active innovation and field evaluation squads mobilized from <strong>{selectedDistrict.solverHub}</strong> to develop prototypes and execute verified pilot remediation.
                </p>
              </div>

              <div className="space-y-2 p-4 rounded-xl border border-border bg-secondary/20">
                <div className="flex items-center gap-2 text-foreground font-bold">
                  <Building2 className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  <span>Priority Civic Focus Areas</span>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {selectedDistrict.primaryFocus} under ongoing departmental works review.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* 6. The SIH 2026 PS-043 Tripartite Collaboration Model */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 border-b border-border/80">
        <div className="text-center space-y-2 max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-amber-700 dark:text-amber-400 bg-amber-500/10 px-3 py-1 rounded-md border border-amber-500/20">
            <Scale className="h-3 w-3" />
            <span>{t('landing.loop.badge', 'SIH 2026 ARCHITECTURAL BLUEPRINT')}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
            {t('landing.loop.title', 'The Multi-Sector Resolution Loop')}
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {t('landing.loop.desc', 'How SamadhanSetu converts citizen grievances into sustainable ground infrastructure using university talent and industry funding.')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            {
              step: '01',
              title: t('landing.loop.step1Title', 'Citizen Grievance Docket'),
              desc: t('landing.loop.step1Desc', 'Geo-tagged photograph and field facts uploaded with GPS triangulation lock.'),
              tag: t('landing.loop.step1Tag', 'Public Intake'),
            },
            {
              step: '02',
              title: t('landing.loop.step2Title', 'AI Multi-Factor Shield'),
              desc: t('landing.loop.step2Desc', '0-100 diagnostic score checks clarity, image forensics, and district deduplication.'),
              tag: t('landing.loop.step2Tag', 'Automated Check'),
            },
            {
              step: '03',
              title: t('landing.loop.step3Title', 'Nodal Officer Admittance'),
              desc: t('landing.loop.step3Desc', 'District administrative engineer verifies jurisdiction, assigns SLA and department order.'),
              tag: t('landing.loop.step3Tag', 'Official Oversight'),
            },
            {
              step: '04',
              title: t('landing.loop.step4Title', 'University Solver Squads'),
              desc: t('landing.loop.step4Desc', 'Engineering students from BIT Mesra, NIT & IIT engineer sustainable field prototypes.'),
              tag: t('landing.loop.step4Tag', 'R&D Innovation'),
            },
            {
              step: '05',
              title: t('landing.loop.step5Title', 'Verified Ground Redressal'),
              desc: t('landing.loop.step5Desc', 'Nodal inspector signs off with geotagged after-photo; permanent registry closure.'),
              tag: t('landing.loop.step5Tag', 'Permanent Record'),
            },
          ].map((s, idx) => (
            <Card key={idx} className="docket-sheet rounded-xl p-4 space-y-2.5 border border-border flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-xs font-mono font-black text-primary">{s.step}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-secondary text-muted-foreground font-bold">
                    {s.tag}
                  </span>
                </div>
                <h4 className="font-bold text-xs text-foreground mt-2 leading-snug">{s.title}</h4>
                <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">{s.desc}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 7. Recently Resolved Official Case Dossiers */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-3 py-0.5 rounded-md mb-2 border border-emerald-500/20">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>{t('landing.archive.badge', 'OFFICIAL DISPATCH ARCHIVE')}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              {t('landing.archive.title', 'Verified Ground Redressals')}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-prose">
              {t('landing.archive.desc', 'Inspection records signed off by District Nodal Engineers with permanent audit tokens.')}
            </p>
          </div>

          <Button
            variant="outline"
            onClick={() => navigate('/problems')}
            className="text-xs font-bold shrink-0 border-border"
          >
            <span>{t('landing.archive.browseAll', 'Browse All Case Files')}</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {resolvedComplaints.map((c) => (
            <Card
              key={c.id}
              onClick={() => navigate(`/track/${c.id}`)}
              className="docket-sheet rounded-2xl overflow-hidden cursor-pointer flex flex-col justify-between group border border-border shadow-md hover:shadow-xl transition-all"
            >
              <div>
                <div className="relative h-48 w-full bg-secondary overflow-hidden">
                  <img
                    src={c.media[0] || 'https://images.unsplash.com/photo-1541888946425-d0fbb186f5f8?auto=format&fit=crop&w=800&q=80'}
                    alt={c.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 docket-stamp docket-stamp-verified shadow-md">
                    {t('landing.archive.groundVerified', 'GROUND VERIFIED')}
                  </div>
                  <div className="absolute bottom-3 left-3 px-2.5 py-0.5 rounded-md bg-black/80 backdrop-blur-xs text-white text-[11px] font-mono font-bold">
                    {c.id}
                  </div>
                </div>

                <CardContent className="p-5 space-y-2.5">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1 font-bold text-foreground">
                      <MapPin className="h-3.5 w-3.5 text-primary" />
                      {c.location.district}
                    </span>
                    <span>•</span>
                    <span className="capitalize font-bold text-primary">{c.category} Division</span>
                  </div>

                  <h3 className="font-bold text-sm text-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                    {c.title}
                  </h3>

                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {c.description}
                  </p>
                </CardContent>
              </div>

              <div className="px-5 py-3 border-t border-border bg-secondary/30 flex items-center justify-between text-xs text-primary font-bold">
                <span>Inspect Stamped Case File</span>
                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Floating UI Variant Switcher */}
      <PrototypeSwitcher />
    </div>
  );
}

function VariantBExecutiveTelemetry({
  stats,
  complaints,
  navigate,
}: {
  stats: any;
  complaints: any[];
  navigate: any;
}) {
  const pending = complaints.filter(
    (c) => c.status === 'pending_officer' || c.status === 'officer_reviewing'
  );

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 space-y-7">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-border/80">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-bold mb-1.5 border border-primary/20">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Variant B: Executive Command & Telemetry Layout</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
            Jharkhand Civic Intake & Nodal Queue Monitor
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            High-density operational layout optimized for state directors, municipal commissioners, and district nodal officers.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => navigate('/admin/pending')}
            className="bg-accent hover:bg-accent-hover text-accent-foreground font-extrabold text-xs shadow-sm hover:shadow-md transition-all"
          >
            Review Queue ({pending.length})
          </Button>
          <Button variant="outline" onClick={() => navigate('/track')} className="text-xs font-bold border-border/80">
            Track ID
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 bg-card border-border/80 docket-sheet card-hover-lift">
          <span className="text-xs font-bold text-muted-foreground block">Verified Redressals</span>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{stats.resolvedCount}</div>
        </Card>
        <Card className="p-5 bg-card border-border/80 docket-sheet card-hover-lift">
          <span className="text-xs font-bold text-muted-foreground block">Flagged In Review</span>
          <div className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400 mt-1">{stats.inReviewCount}</div>
        </Card>
        <Card className="p-5 bg-card border-border/80 docket-sheet card-hover-lift">
          <span className="text-xs font-bold text-muted-foreground block">Active Field Squads</span>
          <div className="text-2xl sm:text-3xl font-black text-sky-600 dark:text-sky-400 mt-1">{stats.inProgressCount}</div>
        </Card>
        <Card className="p-5 bg-card border-border/80 docket-sheet card-hover-lift">
          <span className="text-xs font-bold text-muted-foreground block">Avg. SLA Turnaround</span>
          <div className="text-2xl sm:text-3xl font-black text-foreground mt-1">{stats.avgResolutionTimeDays} Days</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-foreground">Recent Verified Grievance Intake</span>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono font-bold flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live Stream
            </span>
          </div>
          <div className="space-y-2.5">
            {complaints.slice(0, 5).map((c) => (
              <Card
                key={c.id}
                onClick={() => navigate(`/track/${c.id}`)}
                className="p-4 border-border/80 hover:border-primary/50 cursor-pointer bg-card transition-all card-hover-lift"
              >
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="font-mono font-bold text-primary">{c.id}</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-secondary text-muted-foreground">
                    {c.status.replace(/_/g, ' ')}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-foreground mt-1.5 truncate">{c.title}</h4>
                <div className="flex items-center justify-between text-[11px] text-muted-foreground mt-2 pt-2 border-t border-border/50">
                  <span>{c.location.district}</span>
                  <span className="font-mono">
                    AI Score: <strong className="text-foreground">{c.ai_score}/100</strong>
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="lg:col-span-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-foreground">Priority Nodal Review Queue (Score 40-79)</span>
            <span className="text-[11px] text-amber-600 dark:text-amber-400 font-bold">{pending.length} Actionable</span>
          </div>
          <div className="space-y-2.5">
            {pending.slice(0, 4).map((c) => (
              <Card
                key={c.id}
                onClick={() => navigate(`/admin/pending`)}
                className="p-4 border-amber-500/30 bg-amber-500/5 hover:border-amber-500/60 cursor-pointer transition-all card-hover-lift"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-amber-700 dark:text-amber-400">{c.id}</span>
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-200 font-bold">
                    Score: {c.ai_score}/100
                  </span>
                </div>
                <h4 className="text-xs font-bold text-foreground mt-1.5 line-clamp-1">{c.title}</h4>
                <div className="flex flex-wrap gap-1 mt-2.5">
                  {c.ai_flags.slice(0, 2).map((flag: string, i: number) => (
                    <span
                      key={i}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-card border border-amber-500/20 font-mono text-muted-foreground"
                    >
                      #{flag}
                    </span>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function VariantCGuidedJourney({ navigate }: { navigate: any }) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 space-y-8">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-800 dark:text-teal-300 text-xs font-semibold">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Variant C: Citizen Guided Step-by-Step Flow</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          3-Step Guided Grievance Filing
        </h1>
        <p className="text-xs text-muted-foreground max-w-md mx-auto">
          Low cognitive load design calibrated for mobile users in rural blocks. Plain language, large touch targets, instant AI feedback.
        </p>
      </div>

      <QuickReportWidget />

      <div className="p-4 rounded-xl border border-border bg-card text-center space-y-2">
        <span className="text-xs font-semibold text-muted-foreground">Already have a tracking ID?</span>
        <div>
          <Button variant="outline" size="sm" onClick={() => navigate('/track')} className="text-xs font-bold">
            Enter Public Tracking Number
          </Button>
        </div>
      </div>
    </div>
  );
}
