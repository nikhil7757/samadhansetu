import { useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { Sparkles, ArrowRight, Loader2, CheckCircle2, Shield, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth, DEMO_PRESETS, type DemoAccountInfo } from '@/lib/auth';
import { cn } from '@/lib/utils';

interface DemoAccountPickerProps {
  onSuccess?: (role: string) => void;
  className?: string;
  compact?: boolean;
}

export function DemoAccountPicker({ onSuccess, className, compact = false }: DemoAccountPickerProps) {
  const { loginDemo, user } = useAuth();
  const navigate = useNavigate();
  const [activeLoggingRole, setActiveLoggingRole] = useState<string | null>(null);

  const handleSelectDemo = async (account: DemoAccountInfo) => {
    setActiveLoggingRole(account.role);
    try {
      const loggedUser = await loginDemo(account.role);
      toast.success(`Signed in as ${account.title}!`, {
        description: `Welcome, ${loggedUser.name}. Persona activated with verified role claims.`,
      });
      if (onSuccess) {
        onSuccess(account.role);
      } else {
        navigate(account.targetPath);
      }
    } catch (err: any) {
      toast.error('Demo authentication failed', {
        description: err.message || 'Please check your connection and try again.',
      });
    } finally {
      setActiveLoggingRole(null);
    }
  };

  const copyCredentials = (account: DemoAccountInfo, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`${account.email} / Demo@2026!`);
    toast.success(`Copied ${account.title} credentials to clipboard!`, {
      description: 'Email: ' + account.email + ' | Password: Demo@2026!',
    });
  };

  return (
    <div className={cn('space-y-3.5', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-lg bg-accent/20 text-accent flex items-center justify-center">
            <Sparkles className="h-3.5 w-3.5" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground font-heading">
              1-Click Demo Accounts
            </h3>
            <p className="text-[10px] text-muted-foreground font-mono">
              For Hackathon Judges, Evaluators & Policy Testers
            </p>
          </div>
        </div>

        <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20 font-semibold">
          Instant Login
        </span>
      </div>

      <div className={cn('grid gap-2', compact ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2')}>
        {DEMO_PRESETS.map((account) => {
          const isSelected = user?.role === account.role;
          const isLoading = activeLoggingRole === account.role;

          return (
            <div
              key={account.role}
              onClick={() => !isLoading && handleSelectDemo(account)}
              className={cn(
                'group relative rounded-xl border p-2.5 transition-all text-left cursor-pointer flex flex-col justify-between overflow-hidden',
                isSelected
                  ? 'border-accent bg-accent/10 ring-1 ring-accent shadow-xs'
                  : 'border-border/80 bg-card/60 hover:bg-card hover:border-accent/50 hover:shadow-md'
              )}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-1.5 mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-lg shrink-0 leading-none">{account.icon}</span>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-foreground group-hover:text-accent transition-colors font-heading leading-tight">
                        {account.title}
                      </span>
                      {isSelected && (
                        <CheckCircle2 className="h-3 w-3 text-accent shrink-0" />
                      )}
                    </div>
                    <span className="text-[9px] font-mono text-muted-foreground block truncate max-w-[130px]">
                      {account.badge}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => copyCredentials(account, e)}
                  title="Copy email & demo password"
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground"
                >
                  <Copy className="h-3 w-3" />
                </button>
              </div>

              {/* Description */}
              {!compact && (
                <p className="text-[10px] text-muted-foreground line-clamp-2 mb-2 leading-relaxed">
                  {account.description}
                </p>
              )}

              {/* Footer action button */}
              <div className="flex items-center justify-between pt-1 border-t border-border/40 mt-auto">
                <span className="text-[9px] font-mono text-muted-foreground truncate max-w-[120px]">
                  {account.email.split('@')[0]}
                </span>

                <Button
                  type="button"
                  size="sm"
                  variant={isSelected ? 'default' : 'outline'}
                  disabled={isLoading}
                  className={cn(
                    'h-6 px-2 text-[10px] font-bold rounded-lg gap-1 transition-all cursor-pointer',
                    isSelected
                      ? 'bg-accent text-accent-foreground font-black'
                      : 'hover:bg-accent hover:text-accent-foreground hover:border-accent'
                  )}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-2.5 w-2.5 animate-spin" />
                      <span>Signing in...</span>
                    </>
                  ) : isSelected ? (
                    <span>Active</span>
                  ) : (
                    <>
                      <span>Login</span>
                      <ArrowRight className="h-2.5 w-2.5 group-hover:translate-x-0.5 transition-transform" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between text-[10px] text-muted-foreground font-mono px-1">
        <span>Universal Demo Password: <code className="text-foreground font-bold font-mono">Demo@2026!</code></span>
        <span className="text-emerald-400 flex items-center gap-1 font-semibold">
          <Shield className="h-3 w-3" /> Zero Setup Needed
        </span>
      </div>
    </div>
  );
}
export default DemoAccountPicker;
