import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, HeartHandshake, Phone, Mail, MapPin, ExternalLink } from 'lucide-react';
import { StateSeal } from '@/components/shared/StateSeal';

export function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="border-t border-border bg-card mt-auto text-muted-foreground relative z-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Col 1: Platform identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <StateSeal size="md" />
              <div className="flex flex-col">
                <span className="font-black text-foreground text-base tracking-tight font-heading">
                  SamadhanSetu
                </span>
                <span className="text-[10.5px] font-medium text-muted-foreground">
                  समाधान सेतु • झारखण्ड सरकार
                </span>
              </div>
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Official Sovereign Civic Redressal & Academic Solver Exchange for the Government of Jharkhand.
              Connecting citizens across all 24 districts directly to administrative nodal officers, university solvers, and CSR field squads.
            </p>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-secondary text-[11px] font-mono text-foreground font-semibold border border-border">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" />
              <span>SIH 2026 • Problem Statement 043</span>
            </div>
          </div>

          {/* Col 2: Navigation Shortcuts */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold uppercase tracking-wider text-foreground text-[11px]">
              Civic Services
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/report" className="hover:text-primary hover:translate-x-0.5 inline-block transition-all">
                  File a Civic Grievance
                </Link>
              </li>
              <li>
                <Link to="/track" className="hover:text-primary hover:translate-x-0.5 inline-block transition-all">
                  Track Complaint Status
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-primary hover:translate-x-0.5 inline-block transition-all">
                  State Redressal Dashboard
                </Link>
              </li>
              <li>
                <Link to="/problems" className="hover:text-primary hover:translate-x-0.5 inline-block transition-all">
                  Browse 24 Districts Directory
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-primary hover:translate-x-0.5 inline-block transition-all">
                  Nodal Officer Command
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Information & FAQ */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold uppercase tracking-wider text-foreground text-[11px]">
              Citizen Resources
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/about" className="hover:text-primary hover:translate-x-0.5 inline-flex items-center gap-1.5 transition-all font-semibold text-foreground">
                  <span>About SamadhanSetu (Gazette)</span>
                  <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-primary/10 text-primary">Overview</span>
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-primary hover:translate-x-0.5 inline-flex items-center gap-1.5 transition-all font-semibold text-foreground">
                  <span>Citizen's Redressal Guide & FAQ</span>
                  <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400">Help</span>
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-primary hover:translate-x-0.5 inline-block transition-all">
                  District Nodal Directory (24 Districts)
                </Link>
              </li>
              <li>
                <Link to="/prototype" className="hover:text-primary hover:translate-x-0.5 inline-block transition-all font-semibold text-emerald-700 dark:text-emerald-400">
                  Interactive Prototype (State Machine)
                </Link>
              </li>
              <li>
                <a
                  href="/architecture-review.html"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-primary transition-colors flex items-center gap-1 group font-semibold text-teal-700 dark:text-teal-400"
                >
                  <span>Architecture Review Report</span>
                  <ExternalLink className="h-3 w-3 opacity-60 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
              <li>
                <a
                  href="https://jharkhand.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-primary transition-colors flex items-center gap-1 group"
                >
                  <span>Government of Jharkhand Portal</span>
                  <ExternalLink className="h-3 w-3 opacity-60 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Department & Helpline Card */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold uppercase tracking-wider text-foreground text-[11px] flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-primary" />
              Nodal Contact & Helpline
            </h4>
            <div className="p-4 rounded-xl border border-border/80 bg-secondary/30 space-y-3">
              <div>
                <p className="text-foreground font-bold text-xs">
                  Dept. of Higher & Technical Education
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Yojana Bhawan, Nepal House, Doranda, Ranchi — 834002
                </p>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-border/60">
                <a
                  href="tel:181"
                  className="flex items-center gap-2 p-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary font-bold text-xs transition-colors"
                >
                  <Phone className="h-4 w-4 shrink-0" />
                  <span>24x7 Citizen Helpline: <strong className="font-mono text-sm">181</strong></span>
                </a>
                <div className="flex items-center gap-2 text-muted-foreground text-[11px] px-1">
                  <Mail className="h-3.5 w-3.5 shrink-0 text-primary" />
                  <span className="font-mono truncate">nodal.sih@samadhansetu.gov.in</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <p>© 2026 Government of Jharkhand — SamadhanSetu. All rights reserved.</p>
          <div className="flex items-center gap-4 text-xs">
            <span className="text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1.5 bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              State Telemetry Active
            </span>
            <span className="font-mono text-[11px] text-muted-foreground">SIH26043 Release</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
