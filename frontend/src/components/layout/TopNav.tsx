import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import {
  Menu,
  X,
  LogOut,
  ShieldAlert,
  ShieldCheck,
  PlusCircle,
  Compass,
  BarChart3,
  FileText,
  Search,
  Building2,
  Rocket,
  Activity,
  User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LanguageToggle } from '@/components/shared/LanguageToggle';
import { NotificationBell } from '@/components/shared/NotificationBell';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { StateSeal } from '@/components/shared/StateSeal';
import { useAuth } from '@/lib/auth';
import { PLATFORM_CONFIG } from '@/config/platform';
import { cn } from '@/lib/utils';

interface TopNavProps {
  onOpenCommandPalette?: () => void;
}

export function TopNav({ onOpenCommandPalette }: TopNavProps) {
  const { t, i18n } = useTranslation();
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
    { to: '/problems', label: t('nav.marketplace', 'Startup Discovery'), shortLabel: 'Discovery', icon: Compass, show: true },
    { to: '/track', label: t('nav.trackDocket', 'Track Pilot'), shortLabel: 'Pilots', icon: Activity, show: true },
    { to: '/templates', label: t('nav.templates', 'Standard Templates'), shortLabel: 'Templates', icon: FileText, show: true },
    { to: '/dashboard/analytics', label: t('nav.dashboard', 'Pipeline Dashboard'), shortLabel: 'Analytics', icon: BarChart3, show: true },
    {
      to: '/my/submissions',
      label: isStartup ? t('nav.myProposals', 'My Proposals') : t('nav.mySubmissions', 'My Challenges'),
      shortLabel: isStartup ? 'Proposals' : 'Challenges',
      icon: Rocket,
      show: !!user && (isDepartment || isStartup),
    },
    {
      to: '/admin',
      label: isEvaluator ? 'Evaluation Queue' : t('nav.admin', 'Approvals & Evaluation'),
      shortLabel: isEvaluator ? 'Queue' : 'Admin',
      icon: ShieldAlert,
      show: isNodalAdmin || isEvaluator,
    },
  ].filter((l) => l.show);

  const isActive = (path: string) =>
    location.pathname === path || (path !== '/' && location.pathname.startsWith(path));

  const currentLang = (i18n.language || 'en').slice(0, 2);
  const isDevanagari = currentLang === 'mr' || currentLang === 'hi';

  return (
    <header className="sticky top-0 z-40 w-full transition-all">
      {/* Sovereign Official Gazette Micro-Banner */}
      <div className="bg-neutral-950 text-white/90 py-0.5 px-3 sm:px-6 text-[10px] font-mono tracking-wide border-b border-neutral-800/80 backdrop-blur-md">
        <div className="flex items-center justify-between mx-auto max-w-7xl w-full">
          <div className="flex items-center gap-2 truncate">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 ring-1 ring-emerald-400/40 shrink-0" />
            <span className="font-semibold text-accent font-heading truncate">
              {t('nav.topBannerGov', 'महाराष्ट्र शासन • Government of Maharashtra')}
            </span>
            <span className="hidden sm:inline text-white/30">•</span>
            <span className="hidden md:inline text-white/70 truncate">
              {t('nav.topBannerDept', 'महाराष्ट्र राज्य नाविन्यता समाज (MSInS) • SIH 2026 Problem ID 26136')}
            </span>
          </div>

          <div className="flex items-center gap-3 text-white/70 text-[9px] font-mono shrink-0">
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
              <Building2 className="h-2.5 w-2.5 text-accent" />
              <span>{t('nav.registriesActive', '36 District Innovation Desks Active')}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Floating iOS Glass Pill Navigation Bar */}
      <div className="pt-2 sm:pt-3 pb-1 px-3 sm:px-6 max-w-7xl mx-auto w-full">
        <div className="ios-glass-pill rounded-full h-14 sm:h-16 px-2.5 sm:px-4 flex items-center justify-between gap-2 shadow-2xl relative">
          {/* Left: Brand Capsule */}
          <Link
            to="/"
            className="flex items-center gap-2 sm:gap-2.5 pl-1 pr-2 sm:pr-3 py-1 rounded-full hover:bg-secondary/40 transition-all group focus:outline-hidden shrink-0"
          >
            <StateSeal size="xs" className="group-hover:scale-105 transition-transform" />
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className={cn('text-sm sm:text-base font-black tracking-tight text-foreground font-heading', isDevanagari && 'font-devanagari')}>
                  {isDevanagari ? 'समाधानसेतू' : PLATFORM_CONFIG.name}
                </span>
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-accent/15 text-accent border border-accent/30 font-mono">
                  MSInS
                </span>
              </div>
              <span className="hidden sm:block text-[9px] text-muted-foreground font-mono -mt-0.5 truncate max-w-[120px]">
                Innovation Platform
              </span>
            </div>
          </Link>

          {/* Center: iOS Segmented Glass Pill Dock (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1 p-1 rounded-full ios-pill-dock shadow-inner">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={cn(
                    'relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 cursor-pointer',
                    active
                      ? 'bg-primary text-primary-foreground shadow-xs font-bold scale-[1.02]'
                      : 'text-muted-foreground hover:text-foreground hover:bg-background/60'
                  )}
                >
                  <Icon className={cn('h-3.5 w-3.5', active ? 'text-primary-foreground' : 'text-accent')} />
                  <span>{link.shortLabel}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right: Feature Actions Pill Group */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Spotlight Command Palette Pill Button */}
            <button
              type="button"
              onClick={onOpenCommandPalette}
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full ios-pill-dock hover:bg-background/80 text-muted-foreground hover:text-foreground text-xs font-medium transition-all hover:border-accent/40 cursor-pointer shadow-2xs"
              aria-label="Search platform or press Cmd+K"
              title="Quick Search (Cmd+K)"
            >
              <Search className="h-3.5 w-3.5 text-accent" />
              <span className="hidden xl:inline text-[11px]">Search...</span>
              <kbd className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-muted/80 text-muted-foreground border border-border">
                ⌘K
              </kbd>
            </button>

            {/* Post Challenge CTA Pill */}
            <Link to="/report" className="hidden sm:inline-flex">
              <Button
                size="sm"
                className="h-8 px-3.5 rounded-full text-xs font-bold uppercase tracking-wider bg-accent hover:bg-accent-hover text-accent-foreground shadow-sm hover:shadow-md transition-all active:scale-95 cursor-pointer glow-saffron gap-1.5"
              >
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="hidden md:inline">{t('nav.postChallenge', 'Post Challenge')}</span>
                <span className="md:hidden">Post</span>
              </Button>
            </Link>

            {/* Language & Theme Controls */}
            <LanguageToggle />
            <ThemeToggle />

            {/* User Profile / Auth Session Pill */}
            {user ? (
              <div className="flex items-center gap-1.5 pl-1.5 border-l border-border/80">
                <NotificationBell />

                <div className="hidden xl:flex flex-col text-right">
                  <div className="flex items-center justify-end gap-1">
                    <span className="text-xs font-bold text-foreground leading-tight truncate max-w-[110px]">
                      {user.name}
                    </span>
                    {user.mfaEnrolled ? (
                      <span title="2FA Active" className="inline-flex items-center text-emerald-500">
                        <ShieldCheck className="h-3.5 w-3.5" />
                      </span>
                    ) : user.role === 'INNOVATION_SOCIETY_ADMIN' ? (
                      <Link to="/mfa/enroll" title="2FA Setup Required" className="inline-flex items-center text-amber-500 animate-pulse">
                        <ShieldAlert className="h-3.5 w-3.5" />
                      </Link>
                    ) : null}
                  </div>
                  <span className="text-[9px] text-accent font-mono capitalize">
                    {(user.role || 'CITIZEN').toLowerCase().replace('_', ' ')}
                  </span>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLogout}
                  className="h-8 w-8 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                  title={t('nav.logout', 'Sign Out')}
                >
                  <LogOut className="h-3.5 w-3.5" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 pl-1 border-l border-border/70">
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="h-8 px-2.5 rounded-full text-xs font-bold cursor-pointer hover:bg-secondary/60">
                    {t('nav.login', 'Sign In')}
                  </Button>
                </Link>
                <Link to="/signup" className="hidden sm:block">
                  <Button size="sm" className="h-8 px-3 rounded-full text-xs font-bold cursor-pointer bg-primary hover:bg-primary-hover text-primary-foreground shadow-2xs">
                    {t('nav.signup', 'Register')}
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Pill Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden h-8 w-8 rounded-full bg-secondary/50 hover:bg-secondary cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile iOS Glass Dropdown Drawer */}
        {mobileOpen && (
          <div className="lg:hidden mt-2 rounded-3xl ios-glass-pill p-4 shadow-2xl space-y-3 animate-in slide-in-from-top-3 fade-in duration-200">
            {/* Quick Spotlight Search */}
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                onOpenCommandPalette?.();
              }}
              className="flex items-center justify-between w-full p-2.5 rounded-2xl border border-border/80 bg-background/60 text-xs font-medium text-muted-foreground shadow-2xs"
            >
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-accent" />
                <span>Search challenges, dockets, templates...</span>
              </div>
              <kbd className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
                ⌘K
              </kbd>
            </button>

            {/* Post Challenge CTA Button */}
            <Link
              to="/report"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-full text-xs font-bold text-accent-foreground bg-accent hover:bg-accent-hover shadow-md transition-all"
            >
              <PlusCircle className="h-4 w-4" />
              <span>{t('nav.postChallenge', 'Post a Department Challenge')}</span>
            </Link>

            {/* Navigation Links */}
            <nav className="flex flex-col space-y-1 pt-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.to);
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all',
                      active
                        ? 'bg-primary text-primary-foreground font-bold shadow-xs'
                        : 'hover:bg-secondary/60 text-foreground'
                    )}
                  >
                    <Icon className={cn('h-4 w-4', active ? 'text-primary-foreground' : 'text-accent')} />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Account / Authentication Footer */}
            {user ? (
              <div className="pt-3 border-t border-border/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center text-accent font-bold text-xs">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-bold text-foreground">{user.name}</div>
                    <div className="text-muted-foreground text-[10px] font-mono">{user.email}</div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="rounded-full text-destructive hover:bg-destructive/10 border-destructive/30 gap-1 text-xs cursor-pointer"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>{t('nav.logout', 'Sign Out')}</span>
                </Button>
              </div>
            ) : (
              <div className="pt-3 border-t border-border/80 flex items-center gap-2">
                <Link to="/login" onClick={() => setMobileOpen(false)} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full rounded-full text-xs font-bold">
                    {t('nav.login', 'Sign In')}
                  </Button>
                </Link>
                <Link to="/signup" onClick={() => setMobileOpen(false)} className="flex-1">
                  <Button size="sm" className="w-full rounded-full text-xs font-bold bg-primary text-primary-foreground">
                    {t('nav.signup', 'Register')}
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

export default TopNav;
