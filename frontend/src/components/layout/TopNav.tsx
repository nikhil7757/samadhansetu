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
    { to: '/report', label: 'Report Problem', icon: PlusCircle, show: true, highlight: true },
    { to: '/track', label: 'Track Status', icon: Search, show: true },
    { to: '/dashboard', label: 'Dashboard', icon: BarChart3, show: true },
    { to: '/problems', label: 'Directory', icon: Compass, show: true },
    { to: '/admin', label: 'Admin', icon: ShieldAlert, show: user?.role === 'ADMIN' },
    { to: '/about', label: 'About', icon: Info, show: true },
    { to: '/faq', label: 'FAQ', icon: HelpCircle, show: true },
    { to: '/contact', label: 'Contact', icon: Phone, show: true },
  ].filter((l) => l.show);

  const isActive = (path: string) =>
    location.pathname === path || (path !== '/' && location.pathname.startsWith(path));

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-card/95 backdrop-blur-md supports-[backdrop-filter]:bg-card/85">
      {/* Gov banner top bar */}
      <div className="bg-primary text-primary-foreground py-1 px-4 text-[11px] font-medium tracking-wide flex items-center justify-between">
        <div className="flex items-center gap-2 mx-auto max-w-7xl w-full">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
          <span>Government of Jharkhand • Civic Challenge Resolution Platform (SIH 2026 PS-043)</span>
        </div>
      </div>

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 font-bold text-lg text-foreground hover:opacity-90 transition-opacity">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs font-black tracking-tight text-sm">
            SS
          </div>
          <div className="flex flex-col">
            <span className="font-black text-base leading-tight tracking-tight text-primary font-heading">
              SamadhanSetu
            </span>
            <span className="text-[10px] text-muted-foreground font-normal leading-none hidden sm:inline">
              समाधान सेतु • Civic Grievance Portal
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            const active = isActive(link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  'px-3 py-1.5 text-xs font-semibold transition-all duration-150 rounded-lg flex items-center gap-1.5',
                  link.highlight && !active
                    ? 'bg-accent/15 text-accent-foreground border border-accent/30 hover:bg-accent/25'
                    : active
                    ? 'bg-primary/10 text-primary font-bold'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                )}
              >
                <link.icon className="h-3.5 w-3.5 shrink-0 opacity-80" />
                {link.label}
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
            <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-border">
              <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-secondary text-xs">
                <UserIcon className="h-3.5 w-3.5 text-primary" />
                <div className="flex flex-col text-left">
                  <span className="font-semibold text-foreground max-w-[120px] truncate leading-tight">
                    {user.name}
                  </span>
                  <span className="text-[10px] text-muted-foreground font-medium capitalize leading-none">
                    {user.role.toLowerCase()}
                  </span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="h-8 px-2 text-muted-foreground hover:text-destructive"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-border">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/login')}
                className="text-xs font-semibold"
              >
                Sign In
              </Button>
              <Button
                size="sm"
                onClick={() => navigate('/report')}
                className="text-xs font-bold bg-accent hover:bg-accent-hover text-accent-foreground shadow-xs gap-1.5"
              >
                <PlusCircle className="h-3.5 w-3.5" />
                <span>Report</span>
              </Button>
            </div>
          )}

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden h-9 w-9 p-0"
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
