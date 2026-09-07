import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import {
  Menu,
  X,
  LogOut,
  User as UserIcon,
  ShieldAlert,
  PlusCircle,
  Compass,
  BarChart3,
  Layers,
  Building2,
  Search,
  HelpCircle,
  Phone,
  Info,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LanguageToggle } from '@/components/shared/LanguageToggle';
import { NotificationBell } from '@/components/shared/NotificationBell';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { StateSeal } from '@/components/shared/StateSeal';
import { useAuth } from '@/lib/auth';
import { cn } from '@/lib/utils';

export function TopNav() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { to: '/report', label: 'File Grievance', icon: PlusCircle, show: true, highlight: true },
    { to: '/track', label: 'Track Docket', icon: Search, show: true },
    { to: '/dashboard', label: 'Operations', icon: BarChart3, show: true },
    { to: '/problems', label: 'Challenge Board', icon: Compass, show: true },
    { to: '/admin', label: 'Nodal Officer', icon: ShieldAlert, show: user?.role === 'ADMIN' },
    { to: '/about', label: 'Gazette / About', icon: Info, show: true },
    { to: '/faq', label: 'Citizen Guide', icon: HelpCircle, show: true },
  ].filter((l) => l.show);

  const isActive = (path: string) =>
    location.pathname === path || (path !== '/' && location.pathname.startsWith(path));

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-card/95 backdrop-blur-xl supports-[backdrop-filter]:bg-card/90 transition-colors">
      {/* Tiranga Tricolor Micro-Ribbon */}
      <div className="h-1 w-full bg-gradient-to-r from-amber-500 via-white to-emerald-600 dark:from-amber-600 dark:via-slate-200 dark:to-emerald-700" />

      {/* Sovereign Official Gazette Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-950 text-white py-1 px-4 text-[11px] font-medium tracking-wide flex items-center justify-between border-b border-white/10">
        <div className="flex items-center justify-between mx-auto max-w-7xl w-full">
          <div className="flex items-center gap-2.5">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse ring-2 ring-emerald-400/30" />
            <span className="font-bold tracking-tight text-emerald-200">
              झारखंड सरकार • Government of Jharkhand
            </span>
            <span className="text-white/30 hidden md:inline">|</span>
            <span className="text-white/80 hidden md:inline text-[10.5px]">
              योजना एवं विकास विभाग • SIH 2026 Problem Statement 043
            </span>
          </div>

          <div className="flex items-center gap-4 text-[10.5px]">
            <span className="hidden sm:flex items-center gap-1.5 font-mono text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
              24 District Registries Live
            </span>
            <span className="hidden sm:inline text-white/30">•</span>
            <span className="flex items-center gap-1.5 text-white/90">
              Citizen Redressal Helpline: <strong className="text-amber-400 font-mono font-bold bg-amber-400/20 px-1.5 py-0.2 rounded">181</strong>
            </span>
          </div>
        </div>
      </div>

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Sovereign Brand Logo with State Seal */}
        <Link to="/" className="flex items-center gap-3.5 font-bold text-lg text-foreground hover:opacity-95 transition-all group">
          <StateSeal size="md" className="group-hover:scale-105 transition-transform" />
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 font-black text-lg sm:text-xl leading-tight tracking-tight font-heading">
              <span className="text-foreground">Samadhan</span>
              <span className="text-emerald-700 dark:text-emerald-400">Setu</span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20">
                PORTAL
              </span>
            </div>
            <span className="text-[10px] text-muted-foreground font-semibold leading-none tracking-normal">
              समाधान सेतु • लोक समस्या एवं नवाचार समाधान महाप्रणाली
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-secondary/40 p-1 rounded-xl border border-border/50">
          {navLinks.map((link) => {
            const active = isActive(link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  'px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 rounded-lg flex items-center gap-1.5 relative',
                  link.highlight && !active
                    ? 'bg-accent/15 text-accent-foreground border border-accent/30 hover:bg-accent/25 hover:shadow-xs'
                    : active
                    ? 'bg-card text-primary font-bold shadow-xs border border-border/80'
                    : 'text-muted-foreground hover:text-foreground hover:bg-card/50'
                )}
              >
                <link.icon className={cn('h-3.5 w-3.5 shrink-0', active ? 'text-primary' : 'opacity-70')} />
                <span>{link.label}</span>
                {active && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-primary rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Action Bar */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <ThemeToggle />
          <LanguageToggle />
          <NotificationBell />

          {user ? (
            <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-border/80">
              <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-secondary/80 border border-border/60 text-xs shadow-2xs">
                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-[11px]">
                  {user.name.charAt(0)}
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-semibold text-foreground max-w-[110px] truncate leading-tight">
                    {user.name}
                  </span>
                  <span className="text-[9px] font-mono uppercase tracking-wider text-primary font-bold leading-none">
                    {user.role}
                  </span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg"
                title="Logout"
              >
                <LogOut className="h-3.5 w-3.5" />
              </Button>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-border/80">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/login')}
                className="text-xs font-semibold px-3 h-8 rounded-lg"
              >
                Sign In
              </Button>
              <Button
                size="sm"
                onClick={() => navigate('/report')}
                className="text-xs font-bold bg-accent hover:bg-accent-hover text-accent-foreground shadow-sm hover:shadow-md transition-all gap-1.5 px-3.5 h-8 rounded-lg cursor-pointer"
              >
                <PlusCircle className="h-3.5 w-3.5" />
                <span>Report Issue</span>
              </Button>
            </div>
          )}

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden h-9 w-9 p-0 rounded-lg border border-border/50"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-border bg-card px-4 py-4 space-y-2 animate-fade-in shadow-lg">
          {navLinks.map((link) => {
            const active = isActive(link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                  active
                    ? 'bg-primary/10 text-primary font-bold'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                )}
              >
                <link.icon className="h-4 w-4 shrink-0" />
                {link.label}
              </Link>
            );
          })}

          <div className="pt-3 border-t border-border space-y-2">
            {user ? (
              <>
                <div className="px-3 py-1 text-xs text-muted-foreground">
                  Signed in as <strong className="text-foreground">{user.name}</strong> ({user.role})
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    handleLogout();
                    setMobileOpen(false);
                  }}
                  className="w-full text-xs font-medium gap-2 text-destructive border-destructive/30"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Logout</span>
                </Button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    navigate('/login');
                    setMobileOpen(false);
                  }}
                  className="w-full text-xs"
                >
                  Sign In
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    navigate('/report');
                    setMobileOpen(false);
                  }}
                  className="w-full text-xs font-bold bg-accent hover:bg-accent-hover text-accent-foreground"
                >
                  Report Problem
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
