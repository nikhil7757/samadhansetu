import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import {
  Menu,
  X,
  LogOut,
  User as UserIcon,
  ShieldAlert,
  ShieldCheck,
  PlusCircle,
  Compass,
  BarChart3,
  FileText,
  Search,
  Building2,
  Rocket,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LanguageToggle } from '@/components/shared/LanguageToggle';
import { NotificationBell } from '@/components/shared/NotificationBell';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { StateSeal } from '@/components/shared/StateSeal';
import { useAuth } from '@/lib/auth';
import { PLATFORM_CONFIG } from '@/config/platform';
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

  const isNodalAdmin = user?.role === 'INNOVATION_SOCIETY_ADMIN' || user?.role === 'ADMIN';
  const isDepartment = user?.role === 'DEPARTMENT_USER' || user?.role === 'CITIZEN';
  const isStartup = user?.role === 'STARTUP' || user?.role === 'UNIVERSITY' || user?.role === 'INDUSTRY';
  const isEvaluator = user?.role === 'EVALUATOR' || user?.role === 'VALIDATOR';

  const navLinks = [
    { to: '/problems', label: t('nav.marketplace', 'Startup Discovery'), icon: Compass, show: true },
    { to: '/templates', label: t('nav.templates', 'Standard Templates'), icon: FileText, show: true },
    { to: '/track', label: t('nav.trackDocket', 'Track Pilot'), icon: Search, show: true },
    { to: '/dashboard/analytics', label: t('nav.dashboard', 'Pipeline Dashboard'), icon: BarChart3, show: true },
    {
      to: '/my/submissions',
      label: isStartup ? t('nav.myProposals', 'My Proposals') : t('nav.mySubmissions', 'My Challenges'),
      icon: Rocket,
      show: !!user && (isDepartment || isStartup),
    },
    {
      to: '/admin',
      label: isEvaluator ? 'Evaluation Queue' : t('nav.admin', 'Approvals & Evaluation'),
      icon: ShieldAlert,
      show: isNodalAdmin || isEvaluator,
    },
  ].filter((l) => l.show);

  const isActive = (path: string) =>
    location.pathname === path || (path !== '/' && location.pathname.startsWith(path));

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-card/95 backdrop-blur-xl supports-[backdrop-filter]:bg-card/90 transition-colors">
      {/* Tiranga Tricolor Micro-Ribbon */}
      <div className="h-1 w-full bg-gradient-to-r from-amber-500 via-white to-emerald-600 dark:from-amber-600 dark:via-slate-200 dark:to-emerald-700" />

      {/* Sovereign Official Gazette Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-950 text-white py-1 px-4 text-[11px] font-medium tracking-wide flex items-center justify-between border-b border-white/10">
        <div className="flex items-center justify-between mx-auto max-w-7xl w-full">
          <div className="flex items-center gap-2.5">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 ring-1 ring-emerald-400/40" />
            <span className="font-semibold tracking-wide text-amber-300">
              {t('nav.topBannerGov', 'महाराष्ट्र शासन • Government of Maharashtra')}
            </span>
            <span className="hidden md:inline text-white/40">|</span>
            <span className="hidden md:inline text-white/80">
              {t('nav.topBannerDept', 'महाराष्ट्र राज्य नाविन्यता समाज (MSInS) • SIH 2026 Problem ID 26136')}
            </span>
          </div>

          <div className="flex items-center gap-4 text-white/80">
            <span className="hidden lg:inline-flex items-center gap-1.5 text-[10px] bg-white/10 px-2 py-0.5 rounded-full border border-white/15">
              <Building2 className="h-3 w-3 text-amber-300" />
              {t('nav.registriesActive', '36 District Innovation Desks Active')}
            </span>
          </div>
        </div>
      </div>

      {/* Primary Navigation Bar */}
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand identity */}
        <Link to="/" className="flex items-center gap-3 group focus:outline-hidden">
          <StateSeal size="md" className="group-hover:scale-105 transition-transform" />
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-lg font-black tracking-tight text-foreground font-serif">
                {PLATFORM_CONFIG.name}
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-primary/10 text-primary border border-primary/20">
                MSInS
              </span>
            </div>
            <span className="text-[11px] text-muted-foreground font-medium -mt-0.5">
              Innovation Procurement Platform
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-150',
                  active
                    ? 'bg-primary text-primary-foreground shadow-xs font-bold'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/70'
                )}
              >
                <Icon className={cn('h-3.5 w-3.5', active ? 'text-primary-foreground' : 'text-primary')} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Action Controls & User Account */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Post Challenge CTA */}
          <Link
            to="/report"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 shadow-xs transition-all cursor-pointer"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span>{t('nav.postChallenge', 'Post Challenge')}</span>
          </Link>

          <LanguageToggle />
          <ThemeToggle />

          {user ? (
            <div className="flex items-center gap-2 pl-1 border-l border-border/70">
              <NotificationBell />

              <div className="hidden sm:flex flex-col text-right">
                <div className="flex items-center justify-end gap-1">
                  <span className="text-xs font-bold text-foreground leading-tight truncate max-w-[130px]">
                    {user.name}
                  </span>
                  {user.mfaEnrolled ? (
                    <span title="2FA Active" className="inline-flex items-center text-emerald-600 dark:text-emerald-400">
                      <ShieldCheck className="h-3.5 w-3.5" />
                    </span>
                  ) : user.role === 'INNOVATION_SOCIETY_ADMIN' ? (
                    <Link to="/mfa/enroll" title="2FA Setup Required" className="inline-flex items-center text-amber-500 animate-pulse">
                      <ShieldAlert className="h-3.5 w-3.5" />
                    </Link>
                  ) : null}
                </div>
                <span className="text-[10px] text-primary font-mono capitalize">
                  {user.role.toLowerCase().replace('_', ' ')}
                </span>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="h-8 w-8 text-muted-foreground hover:text-destructive cursor-pointer"
                title={t('nav.logout', 'Sign Out')}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2 pl-1 border-l border-border/70">
              <Link to="/login">
                <Button variant="ghost" size="sm" className="text-xs font-bold cursor-pointer">
                  {t('nav.login', 'Sign In')}
                </Button>
              </Link>
              <Link to="/signup" className="hidden sm:block">
                <Button size="sm" className="text-xs font-bold cursor-pointer">
                  {t('nav.signup', 'Register')}
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile menu toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden h-8 w-8"
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-border bg-card px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-2 duration-200">
          <Link
            to="/report"
            onClick={() => setMobileOpen(false)}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-xs font-bold text-white bg-amber-600 shadow-xs"
          >
            <PlusCircle className="h-4 w-4" />
            <span>{t('nav.postChallenge', 'Post a Challenge')}</span>
          </Link>

          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    active ? 'bg-primary text-primary-foreground font-bold' : 'hover:bg-secondary'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {user && (
            <div className="pt-3 border-t border-border flex items-center justify-between text-xs">
              <div>
                <div className="font-bold text-foreground">{user.name}</div>
                <div className="text-muted-foreground">{user.email}</div>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout} className="text-destructive gap-1 text-xs">
                <LogOut className="h-3.5 w-3.5" />
                {t('nav.logout', 'Sign Out')}
              </Button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

export default TopNav;
