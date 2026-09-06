import type { ReactNode } from 'react';
import { type LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
  children?: ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action, children }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-2xl border border-dashed border-border bg-card/50">
      <div className="rounded-2xl bg-secondary/80 p-4 mb-4 ring-8 ring-secondary/30">
        <Icon className="h-8 w-8 text-primary" />
      </div>
      <h3 className="text-base font-semibold text-foreground mb-1.5">{title}</h3>
      {description && <p className="text-sm text-muted-foreground max-w-md mb-5 leading-relaxed">{description}</p>}
      {action && (
        <Button onClick={action.onClick} variant="default" size="default">
          {action.label}
        </Button>
      )}
      {children}
    </div>
  );
}
