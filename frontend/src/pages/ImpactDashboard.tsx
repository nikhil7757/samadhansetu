import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  LineChart,
  Line,
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  Clock,
  ShieldCheck,
  Building2,
  Rocket,
  MapPin,
  CreditCard,
  CheckCircle2,
  Layers,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { StateSeal } from '@/components/shared/StateSeal';

const SECTOR_DATA = [
  { name: 'Healthcare', count: 34, fill: '#3B82F6' },
  { name: 'Agritech', count: 28, fill: '#10B981' },
  { name: 'Urban Gov', count: 25, fill: '#8B5CF6' },
  { name: 'Clean Energy', count: 22, fill: '#F59E0B' },
  { name: 'Water & San', count: 18, fill: '#06B6D4' },
  { name: 'Edu & Skills', count: 12, fill: '#EC4899' },
  { name: 'Cyber & AI', count: 9, fill: '#6366F1' },
];

const DISTRICT_DATA = [
  { district: 'Pune', count: 24 },
  { district: 'Mumbai Sub', count: 32 },
  { district: 'Nagpur', count: 21 },
  { district: 'Nashik', count: 18 },
  { district: 'Chh. Sambhajinagar', count: 14 },
  { district: 'Thane', count: 16 },
  { district: 'Kolhapur', count: 11 },
  { district: 'Solapur', count: 12 },
];

const TURNAROUND_TREND = [
  { period: 'Q1 2025', days: 68 },
  { period: 'Q2 2025', days: 56 },
  { period: 'Q3 2025', days: 48 },
  { period: 'Q4 2025', days: 41 },
  { period: 'Q1 2026', days: 36 },
];

const OUTCOME_SCALING_DATA = [
  { name: 'Scaled Statewide (GFR 194)', value: 74, fill: '#10B981' },
  { name: 'Extended Pilot Sandbox', value: 18, fill: '#3B82F6' },
  { name: 'Stopped with Learnings', value: 8, fill: '#94A3B8' },
];

const PAYMENT_VELOCITY_DATA = [
  { month: 'Oct 2025', avgDays: 6.2 },
  { month: 'Nov 2025', avgDays: 5.1 },
  { month: 'Dec 2025', avgDays: 4.8 },
  { month: 'Jan 2026', avgDays: 4.0 },
  { month: 'Feb 2026', avgDays: 3.4 },
];

export default function ImpactDashboard() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background py-10 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="border-b border-border/80 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-3 shadow-xs">
              <BarChart3 className="h-3.5 w-3.5" />
              <span>Statewide Innovation Telemetry & Analytics</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-foreground font-serif tracking-tight">
              Innovation Pipeline Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-2xl leading-relaxed">
              Real-time telemetry measuring challenge turnaround, startup participation, pilot success rates, and disbursement velocity across Maharashtra's 36 districts.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground bg-secondary/50 px-3 py-1.5 rounded-lg border border-border">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Live Data Sync: Active</span>
          </div>
        </div>

        {/* Top 5 KPI Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          <Card className="p-4 rounded-xl border border-border bg-card shadow-xs">
            <span className="text-[11px] font-bold text-muted-foreground uppercase block">Active Challenges</span>
            <span className="text-2xl font-black text-foreground font-mono mt-1 block">148</span>
            <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">Across 36 Districts</span>
          </Card>

          <Card className="p-4 rounded-xl border border-border bg-card shadow-xs">
            <span className="text-[11px] font-bold text-muted-foreground uppercase block">Screened Startups</span>
            <span className="text-2xl font-black text-foreground font-mono mt-1 block">1,240</span>
            <span className="text-[10px] text-primary font-semibold mt-1 block">88% DPIIT Recognized</span>
          </Card>

          <Card className="p-4 rounded-xl border border-border bg-card shadow-xs">
            <span className="text-[11px] font-bold text-muted-foreground uppercase block">Active Pilots</span>
            <span className="text-2xl font-black text-foreground font-mono mt-1 block">38</span>
            <span className="text-[10px] text-amber-600 font-semibold mt-1 block">Controlled Sandboxes</span>
          </Card>

          <Card className="p-4 rounded-xl border border-border bg-card shadow-xs">
            <span className="text-[11px] font-bold text-muted-foreground uppercase block">Grant Disbursed</span>
            <span className="text-2xl font-black text-emerald-600 font-mono mt-1 block">₹4.8 Cr</span>
            <span className="text-[10px] text-muted-foreground font-semibold mt-1 block">100% Milestone-Based</span>
          </Card>

          <Card className="p-4 rounded-xl border border-border bg-card shadow-xs">
            <span className="text-[11px] font-bold text-muted-foreground uppercase block">Pilots Scaled</span>
            <span className="text-2xl font-black text-primary font-mono mt-1 block">74%</span>
            <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">GFR 194 & GeM Handoff</span>
          </Card>
        </div>

        {/* Charts Row 1: Challenges by Sector & Challenges by District */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Challenges by Sector */}
          <Card className="p-6 rounded-2xl border border-border bg-card shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-border/70 mb-4">
              <div>
                <h3 className="text-base font-bold text-foreground">Challenges by Innovation Sector</h3>
                <p className="text-xs text-muted-foreground">Departmental demand distribution</p>
              </div>
              <Layers className="h-4 w-4 text-primary" />
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={SECTOR_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-25} textAnchor="end" />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--color-card, #fff)',
                      borderRadius: '8px',
                      border: '1px solid var(--color-border, #ddd)',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {SECTOR_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* District Deployments */}
          <Card className="p-6 rounded-2xl border border-border bg-card shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-border/70 mb-4">
              <div>
                <h3 className="text-base font-bold text-foreground">Deployments by Maharashtra District</h3>
                <p className="text-xs text-muted-foreground">Active challenges & sandboxes in key clusters</p>
              </div>
              <MapPin className="h-4 w-4 text-amber-500" />
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={DISTRICT_DATA} layout="vertical" margin={{ top: 10, right: 20, left: 40, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis dataKey="district" type="category" tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--color-card, #fff)',
                      borderRadius: '8px',
                      border: '1px solid var(--color-border, #ddd)',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="count" fill="#3B82F6" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Charts Row 2: Turnaround Trend, Pilot Scaling Ratio, Payment SLA Velocity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Turnaround Time (Challenge to Pilot) */}
          <Card className="p-6 rounded-2xl border border-border bg-card shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-border/70 mb-4">
              <div>
                <h3 className="text-base font-bold text-foreground">Avg. Days to Pilot</h3>
                <p className="text-xs text-muted-foreground">Challenge posting to contract signing</p>
              </div>
              <Clock className="h-4 w-4 text-primary" />
            </div>

            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={TURNAROUND_TREND} margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="period" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--color-card, #fff)',
                      borderRadius: '8px',
                      border: '1px solid var(--color-border, #ddd)',
                      fontSize: '12px',
                    }}
                  />
                  <Line type="monotone" dataKey="days" stroke="#10B981" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="text-center text-xs font-mono text-emerald-600 font-bold mt-2">
              Reduced from 68 days to 36 days (-47%)
            </div>
          </Card>

          {/* Pilot Scaling Outcomes (% Scaled / Extended / Stopped) */}
          <Card className="p-6 rounded-2xl border border-border bg-card shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-border/70 mb-4">
              <div>
                <h3 className="text-base font-bold text-foreground">Pilot Scaling Verdicts</h3>
                <p className="text-xs text-muted-foreground">Post-independent validation results</p>
              </div>
              <TrendingUp className="h-4 w-4 text-emerald-600" />
            </div>

            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={OUTCOME_SCALING_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {OUTCOME_SCALING_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--color-card, #fff)',
                      borderRadius: '8px',
                      border: '1px solid var(--color-border, #ddd)',
                      fontSize: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-1.5 text-xs mt-1">
              {OUTCOME_SCALING_DATA.map((entry, i) => (
                <div key={i} className="flex justify-between items-center text-[11px]">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: entry.fill }} />
                    <span className="text-muted-foreground">{entry.name}</span>
                  </span>
                  <span className="font-mono font-bold text-foreground">{entry.value}%</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Payment Velocity (Days Since Approval) */}
          <Card className="p-6 rounded-2xl border border-border bg-card shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-border/70 mb-4">
              <div>
                <h3 className="text-base font-bold text-foreground">Payment SLA Turnaround</h3>
                <p className="text-xs text-muted-foreground">Average days to release validated grant</p>
              </div>
              <CreditCard className="h-4 w-4 text-amber-500" />
            </div>

            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={PAYMENT_VELOCITY_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--color-card, #fff)',
                      borderRadius: '8px',
                      border: '1px solid var(--color-border, #ddd)',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="avgDays" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="text-center text-xs font-mono text-emerald-600 font-bold mt-2">
              Current Average: 3.4 Days (Statutory SLA: 7 Days)
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
