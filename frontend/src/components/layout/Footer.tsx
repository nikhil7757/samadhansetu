import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, HeartHandshake, Phone, Mail, MapPin, ExternalLink } from 'lucide-react';

export function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="border-t border-border bg-card/80 mt-auto text-muted-foreground">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1: Platform identity */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-primary-foreground font-black text-xs">
                SS
              </div>
              <span className="font-black text-foreground text-base tracking-tight font-heading">
                SamadhanSetu
              </span>
            </div>
            <p className="text-xs leading-relaxed">
              Govt. of Jharkhand Civic Challenge Resolution Platform. Crowdsourcing societal grievances with automated AI verification and academic/CSR ground resolution.
            </p>
            <div className="text-[11px] font-mono text-muted-foreground/90">
              SIH 2026 • Problem Statement 043
            </div>
          </div>

          {/* Col 2: Navigation Shortcuts */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold uppercase tracking-wider text-foreground">
              Portal Shortcuts
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/report" className="hover:text-primary transition-colors">
                  Report a Problem
                </Link>
              </li>
              <li>
                <Link to="/track" className="hover:text-primary transition-colors">
                  Track Your Complaint Status
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-primary transition-colors">
                  Citizen & Officer Dashboard
                </Link>
              </li>
              <li>
                <Link to="/problems" className="hover:text-primary transition-colors">
                  Browse 24 Districts Directory
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-primary transition-colors">
                  State Nodal Analytics
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Information & FAQ */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold uppercase tracking-wider text-foreground">
              Citizen Resources
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="hover:text-primary transition-colors">
                  About SamadhanSetu
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-primary transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-primary transition-colors">
                  District Nodal Directory
                </Link>
              </li>
              <li>
                <a
                  href="https://jharkhand.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-primary transition-colors flex items-center gap-1"
                >
                  <span>Government of Jharkhand Portal</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Department & Helpline */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-primary" />
              Department & Helplines
            </h4>
            <div className="space-y-2">
              <p className="text-foreground font-semibold">
                Department of Higher & Technical Education
              </p>
              <p className="text-[11px] leading-relaxed">
                Yojana Bhawan, Nepal House, Doranda, Ranchi — 834002
              </p>
              <div className="pt-1 space-y-1">
                <div className="flex items-center gap-1.5 text-foreground">
                  <Phone className="h-3.5 w-3.5 text-primary" />
                  <span>24x7 Citizen Helpline: <strong>181</strong></span>
                </div>
                <div className="flex items-center gap-1.5 text-foreground">
                  <Mail className="h-3.5 w-3.5 text-primary" />
                  <span>nodal.sih@samadhansetu.gov.in</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <p>© 2026 Government of Jharkhand — SamadhanSetu. All rights reserved.</p>
          <div className="flex items-center gap-4 text-xs">
            <span className="text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              State Telemetry Live
            </span>
            <span className="font-mono text-[11px]">SIH26043 Edition</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
