import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { STATUS_COLORS, STATUS_DOT_COLORS, cn } from '@/lib/utils';

const STATUS_KEYS: Record<string, string> = {
  PENDING_APPROVAL: 'common.statusPending',
  REJECTED: 'common.statusRejected',
  OPEN: 'common.statusOpen',
  TEAM_FORMED: 'common.statusTeamFormed',
  IN_PROGRESS: 'common.statusInProgress',
  PILOTED: 'common.statusPiloted',
  SOLVED: 'common.statusSolved',
};

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  const { t } = useTranslation();
  const colorClass = STATUS_COLORS[status] || 'bg-slate-100 text-slate-700 border-slate-300';
  const dotColor = STATUS_DOT_COLORS[status] || 'bg-slate-400';
  const labelKey = STATUS_KEYS[status] || status;

  return (
    <Badge
      variant="outline"
      className={cn('text-[11px] font-medium tracking-wide py-0.5 px-2.5 shadow-2xs', colorClass, className)}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full inline-block mr-1.5 shrink-0', dotColor)} />
      {t(labelKey)}
    </Badge>
  );
}
