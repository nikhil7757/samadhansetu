import React from 'react';
import { Link } from 'react-router';
import { TrendingUp, ArrowUpRight, Activity, ShieldCheck } from 'lucide-react';

const LIVE_PIPELINE_ITEMS = [
  {
    id: 'SS-2026-001043',
    district: 'PUNE',
    sector: 'HEALTHCARE',
    title: 'Rural Tele-ICU & Sepsis Warning',
    budget: '₹24.5L',
    status: 'GFR 194 DIRECT AWARD',
    accentColor: 'text-emerald-500',
  },
  {
    id: 'SS-2026-001042',
    district: 'NASHIK',
    sector: 'AGRITECH',
    title: 'Vineyard Crop Pest Vision AI',
    budget: '₹16.5L',
    status: 'VALIDATED 94.2%',
    accentColor: 'text-accent',
  },
  {
    id: 'SS-2026-001045',
    district: 'NAGPUR',
    sector: 'WATER SUPPLY',
    title: 'Real-Time Water Chlorine IoT',
    budget: '₹18.0L',
    status: 'STAGE 08 LIVE',
    accentColor: 'text-sky-400',
  },
  {
    id: 'SS-2026-001046',
    district: 'MUMBAI',
    sector: 'GOVTECH',
    title: 'Slum Sanitation Drainage Telemetry',
    budget: '₹32.0L',
    status: 'EVALUATION GFR 192',
    accentColor: 'text-amber-400',
  },
  {
    id: 'SS-2026-001044',
    district: 'SAMBHAJINAGAR',
    sector: 'CLEAN ENERGY',
    title: 'Decentralized Solar Cold Storage',
    budget: '₹14.0L',
    status: 'DISCOVERY OPEN',
    accentColor: 'text-emerald-400',
  },
  {
    id: 'SS-2026-001047',
    district: 'THANE',
    sector: 'ENVIRONMENT',
    title: 'Lake Water Quality Sensor Grid',
    budget: '₹16.0L',
    status: 'SANDBOX APPROVED',
    accentColor: 'text-accent',
  },
  {
    id: 'SS-2026-001048',
    district: 'KOLHAPUR',
    sector: 'AGRI-LOGISTICS',
    title: 'Perishable Milk Cold Chain Mesh',
    budget: '₹20.0L',
    status: 'GeM RUNWAY EXPORT',
    accentColor: 'text-emerald-500',
  },
];

export function ProcurementTicker() {
  return (
    <div className="relative z-20 border-y border-border bg-card/90 py-2 overflow-hidden select-none">
      <div className="flex items-center min-w-0">
        {/* Responsive Title Tag with Saffron Highlight (Kabadiwala Connect Style) */}
        <div className="shrink-0 bg-accent text-accent-foreground px-2.5 sm:px-3.5 py-1 text-xs font-mono font-black uppercase tracking-wider flex items-center gap-1.5 z-10 shadow-xs">
          <TrendingUp className="h-3.5 w-3.5 stroke-[2.5]" />
          <span className="hidden sm:inline">MSInS LIVE PIPELINE</span>
          <span className="sm:hidden">PIPELINE</span>
        </div>

        {/* Scrolling Ticker Track */}
        <div className="overflow-hidden whitespace-nowrap flex-1 min-w-0">
          <div className="animate-marquee font-mono text-xs flex items-center">
            {[...LIVE_PIPELINE_ITEMS, ...LIVE_PIPELINE_ITEMS].map((item, idx) => (
              <Link
                key={idx}
                to={`/track/${item.id}`}
                className="inline-flex items-center gap-2 mx-4 text-muted-foreground hover:text-foreground transition-colors cursor-pointer group"
              >
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-secondary text-foreground border border-border">
                  {item.district}
                </span>
                <span className="font-bold text-foreground uppercase tracking-wide group-hover:text-accent truncate max-w-[160px] sm:max-w-[220px]">
                  {item.title}
                </span>
                <span className="text-foreground font-black tracking-tight font-mono">
                  {item.budget}
                </span>
                <span className={`text-[10px] font-bold ${item.accentColor} inline-flex items-center gap-0.5`}>
                  {item.status}
                  <ArrowUpRight className="h-3 w-3" />
                </span>
                <span className="text-border font-bold mx-2">/</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProcurementTicker;
