import { cn } from '@/lib/utils';

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn('rounded-xl border border-border bg-card p-5 shadow-xs animate-pulse', className)}>
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex gap-2">
          <div className="h-5 w-24 rounded-full bg-muted" />
          <div className="h-5 w-16 rounded-full bg-muted" />
        </div>
        <div className="h-4 w-20 rounded bg-muted" />
      </div>
      <div className="h-5 w-3/4 rounded-md bg-muted mb-3" />
      <div className="space-y-2 mb-4">
        <div className="h-3.5 w-full rounded bg-muted/80" />
        <div className="h-3.5 w-5/6 rounded bg-muted/80" />
      </div>
      <div className="flex items-center justify-between pt-3 border-t border-border/50">
        <div className="h-3.5 w-28 rounded bg-muted" />
        <div className="flex gap-3">
          <div className="h-3.5 w-12 rounded bg-muted" />
          <div className="h-3.5 w-12 rounded bg-muted" />
        </div>
      </div>
    </div>
  );
}
