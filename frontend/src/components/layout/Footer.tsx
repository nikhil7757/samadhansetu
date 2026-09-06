import { useTranslation } from 'react-i18next';
import { ShieldCheck, HeartHandshake } from 'lucide-react';

export function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="border-t border-border bg-card/60 mt-auto text-muted-foreground">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Col 1: Platform info */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground font-black text-xs">
                SS
              </div>
              <span className="font-bold text-foreground text-base tracking-tight">
                {t('app.name')}
              </span>
            </div>
            <p className="text-xs leading-relaxed max-w-sm">{t('footer.tagline')}</p>
            <p className="text-xs text-muted-foreground/80 mt-2 font-mono">
              Problem ID: SIH26043
            </p>
          </div>

          {/* Col 2: Mission */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground mb-3 flex items-center gap-1.5">
              <HeartHandshake className="h-4 w-4 text-primary" />
              Civic Partnership Mission
            </h4>
            <p className="text-xs leading-relaxed">
              Bridging grassroots problem reporters in Jharkhand with over 20+ engineering colleges, premier institutes (IIT ISM, BIT Mesra, CNLU), and CSR enablers (Tata Steel, Usha Martin).
            </p>
          </div>

          {/* Col 3: Department */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground mb-3 flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-primary" />
              Government Governance
            </h4>
            <p className="text-xs leading-relaxed">{t('footer.govt')}</p>
            <p className="text-[11px] text-muted-foreground/90 mt-2 leading-normal">
              {t('footer.problem')}
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <p>© 2026 Government of Jharkhand — SamadhanSetu. All rights reserved.</p>
          <div className="flex items-center gap-4 text-xs">
            <span className="text-emerald-700 dark:text-emerald-400 font-medium">● System Operational</span>
            <span>SIH 2026 Edition</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
