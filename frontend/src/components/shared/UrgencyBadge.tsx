import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { URGENCY_COLORS, cn } from '@/lib/utils';
import { AlertCircle, Clock, Zap } from 'lucide-react';

const URGENCY_KEYS: Record<string, string> = {
  LOW: 'common.urgencyLow',
  MEDIUM: 'common.urgencyMedium',
  HIGH: 'common.urgencyHigh',
};

export function UrgencyBadge({ urgency, className }: { urgency: string; className?: string }) {
  const { t } = useTranslation();
  const colorClass = URGENCY_COLORS[urgency] || 'bg-slate-100 text-slate-700 border-slate-300';
  const labelKey = URGENCY_KEYS[urgency] || urgency;

  const Icon = urgency === 'HIGH' ? Zap : urgency === 'MEDIUM' ? Clock : AlertCircle;

  return (
    <Badge
      variant="outline"
      className={cn('text-[11px] font-medium py-0.5 px-2 shadow-2xs gap-1', colorClass, className)}
    >
      <Icon className="h-3 w-3 shrink-0" />
      {t(labelKey)}
    </Badge>
  );
}
