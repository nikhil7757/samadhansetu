import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Menu, X, LogOut, User as UserIcon, ShieldAlert, PlusCircle, Compass, BarChart3, Layers, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LanguageToggle } from '@/components/shared/LanguageToggle';
import { NotificationBell } from '@/components/shared/NotificationBell';
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
    { to: '/problems', label: t('nav.problems'), icon: Compass, show: true },
    { to: '/dashboard', label: t('nav.dashboard'), icon: BarChart3, show: true },
    { to: '/problems/submit', label: t('nav.submitProblem'), icon: PlusCircle, show: user?.role === 'CITIZEN' },
    { to: '/my/submissions', label: t('nav.mySubmissions'), icon: Layers, show: user?.role === 'CITIZEN' },
    { to: '/my/interests', label: t('nav.myInterests'), icon: Building2, show: user?.role === 'UNIVERSITY' || user?.role === 'INDUSTRY' },
    { to: '/my/teams', label: t('nav.myTeams'), icon: Layers, show: !!user },
    { to: '/admin', label: t('nav.admin'), icon: ShieldAlert, show: user?.role === 'ADMIN' },
  ].filter((l) => l.show);

  const isActive = (path: string) => location.pathname === path || (path !== '/' && location.pathname.startsWith(path));

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-card/95 backdrop-blur-md supports-[backdrop-filter]:bg-card/85">
      {/* Gov banner top bar */}
      <div className="bg-primary-hover text-primary-foreground py-1 px-4 text-[11px] font-medium tracking-wide flex items-center justify-between">
        <div className="flex items-center gap-2 mx-auto max-w-7xl w-full">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
          <span>{t('landing.hero.badge')} | Government of Jharkhand Civic Innovation Portal</span>
        </div>
      </div>

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 font-bold text-lg text-foreground hover:opacity-90 transition-opacity">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs font-black tracking-tight">
            SS
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base leading-tight tracking-tight text-primary">
              {t('app.name')}
            </span>
            <span className="text-[10px] text-muted-foreground font-normal leading-none hidden sm:inline">
              {t('app.tagline')}
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
                  'px-3 py-1.5 text-sm font-medium transition-all duration-150 rounded-md flex items-center gap-1.5',
                  active
                    ? 'bg-primary/10 text-primary font-semibold'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                )}
              >
                <link.icon className="h-4 w-4 shrink-0 opacity-80" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Action Bar */}
        <div className="flex items-center gap-2 sm:gap-3">
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
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider leading-none">
                    {user.role}
                  </span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                aria-label={t('nav.logout')}
                title={t('nav.logout')}
                className="text-muted-foreground hover:text-destructive h-8 w-8"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-border">
              <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
                {t('nav.login')}
              </Button>
              <Button size="sm" onClick={() => navigate('/signup')}>
                {t('nav.signup')}
              </Button>
            </div>
          )}

          {/* Mobile menu trigger */}
          <button
            type="button"
            className="lg:hidden p-2 rounded-md hover:bg-secondary text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle Navigation Menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-border bg-card animate-in slide-in-from-top-2 duration-150">
          <nav className="flex flex-col p-4 gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'px-3.5 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2.5',
                  isActive(link.to)
                    ? 'bg-primary/10 text-primary font-semibold'
                    : 'text-foreground hover:bg-secondary'
                )}
              >
                <link.icon className="h-4 w-4 shrink-0 opacity-80" />
                {link.label}
              </Link>
            ))}

            {user ? (
              <>
                <div className="border-t border-border my-2 pt-2" />
                <div className="px-3.5 py-2 text-xs text-muted-foreground flex items-center justify-between">
                  <span className="font-semibold text-foreground">{user.name}</span>
                  <span className="bg-secondary px-2 py-0.5 rounded text-[10px] uppercase font-mono">
                    {user.role}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    handleLogout();
                    setMobileOpen(false);
                  }}
                  className="px-3.5 py-2 text-sm font-medium rounded-lg text-destructive hover:bg-destructive/10 text-left flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" /> {t('nav.logout')}
                </button>
              </>
            ) : (
              <>
                <div className="border-t border-border my-2 pt-2" />
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      navigate('/login');
                      setMobileOpen(false);
                    }}
                  >
                    {t('nav.login')}
                  </Button>
                  <Button
                    className="w-full"
                    onClick={() => {
                      navigate('/signup');
                      setMobileOpen(false);
                    }}
                  >
                    {t('nav.signup')}
                  </Button>
                </div>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
