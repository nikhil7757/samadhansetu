import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, Phone, Mail, MapPin, ExternalLink, Rocket } from 'lucide-react';
import { StateSeal } from '@/components/shared/StateSeal';
import { PLATFORM_CONFIG } from '@/config/platform';

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
                  {PLATFORM_CONFIG.name}
                </span>
                <span className="text-[10.5px] font-medium text-muted-foreground">
                  महाराष्ट्र राज्य नाविन्यता समाज (MSInS)
                </span>
              </div>
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Official Startup-Friendly Public Procurement Platform for the Government of Maharashtra.
              Enabling departments across all 36 districts to identify, pilot, procure, and scale innovative solutions from eligible startups.
            </p>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-secondary text-[11px] font-mono text-foreground font-semibold border border-border">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" />
              <span>SIH 2026 • Problem ID 26136</span>
            </div>
          </div>

          {/* Col 2: Navigation Shortcuts */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold uppercase tracking-wider text-foreground text-[11px]">
              Procurement Pathway
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/report" className="hover:text-primary hover:translate-x-0.5 inline-block transition-all">
                  Post Department Challenge
                </Link>
              </li>
              <li>
                <Link to="/problems" className="hover:text-primary hover:translate-x-0.5 inline-block transition-all">
                  Startup Discovery Marketplace
                </Link>
              </li>
              <li>
                <Link to="/templates" className="hover:text-primary hover:translate-x-0.5 inline-block transition-all">
                  Standard Template Library
                </Link>
              </li>
              <li>
                <Link to="/track" className="hover:text-primary hover:translate-x-0.5 inline-block transition-all">
                  Track Pilot Lifecycle (SS-XXXX / NS-XXXX)
                </Link>
              </li>
              <li>
                <Link to="/dashboard/analytics" className="hover:text-primary hover:translate-x-0.5 inline-block transition-all">
                  Innovation Pipeline Telemetry
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Statutory Policies & Relaxations */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold uppercase tracking-wider text-foreground text-[11px]">
              Compliance & Policy
            </h4>
            <ul className="space-y-2.5">
              <li>
                <span className="text-foreground/90 font-medium block">
                  GFR 2017 Rule 170 / 173(i)
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Turnover & experience exemptions for DPIIT startups
                </span>
              </li>
              <li>
                <span className="text-foreground/90 font-medium block">
                  GFR 2017 Rule 194 & 149
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Single-source R&D pilot direct scaling & GeM handoff
                </span>
              </li>
              <li>
                <span className="text-foreground/90 font-medium block">
                  Maharashtra State Innovative Startup Policy
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Sandbox testbed regulations and intellectual property safeguards
                </span>
              </li>
            </ul>
          </div>

          {/* Col 4: Authority Helpdesk */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold uppercase tracking-wider text-foreground text-[11px]">
              MSInS Nodal Secretariat
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>
                  Maharashtra State Innovation Society,
                  Dept. of Skills, Employment, Entrepreneurship & Innovation,
                  Madam Cama Road, Mantralaya, Mumbai — 400032
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>022-2202-5360 / 1800-120-8040 (Toll Free)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>support@msins.maharashtra.gov.in</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} Maharashtra State Innovation Society (MSInS), Government of Maharashtra. All rights reserved.</p>
          <div className="flex items-center gap-4 text-muted-foreground">
            <Link to="/about" className="hover:text-foreground">About MSInS</Link>
            <Link to="/faq" className="hover:text-foreground">Procurement FAQs</Link>
            <Link to="/contact" className="hover:text-foreground">District Desks</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
