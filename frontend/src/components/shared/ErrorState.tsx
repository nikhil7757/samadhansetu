import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

export function ErrorState({ message, onRetry }: { message?: string; onRetry?: () => void }) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center rounded-2xl border border-destructive/20 bg-destructive/5">
      <div className="rounded-full bg-destructive/10 p-3 mb-3 text-destructive">
        <AlertCircle className="h-6 w-6" />
      </div>
      <h3 className="text-base font-semibold text-foreground mb-1">{t('common.error')}</h3>
      {message && <p className="text-sm text-muted-foreground max-w-md mb-4">{message}</p>}
      {onRetry && (
        <Button onClick={onRetry} variant="outline" size="sm" className="gap-2">
          <RefreshCw className="h-3.5 w-3.5" />
          {t('common.retry')}
        </Button>
      )}
    </div>
  );
}
