import { useState, useEffect } from 'react';
import { Outlet, useLocation, Link } from 'react-router';
import { TopNav } from './TopNav';
import { Footer } from './Footer';
import { Toaster } from 'sonner';
import { CommandPalette } from '@/components/shared/CommandPalette';
import { ProcurementTicker } from '@/components/common/ProcurementTicker';
import {
  Compass,
  PlusCircle,
  Home,
  Activity,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function AppShell() {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const location = useLocation();

  // Scroll to top on route navigation
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  const isActive = (path: string) =>
    location.pathname === path || (path !== '/' && location.pathname.startsWith(path));

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-accent/20 selection:text-accent relative overflow-x-clip bg-app-atmosphere">
      {/* Subtle Analog Texture Layer */}
      <div className="film-grain pointer-events-none" />

      {/* Main content wrapper with bottom padding so floating dock never overlaps footer or page content */}
      <div className="flex flex-col min-h-screen pb-24 sm:pb-28 relative z-10">
        <TopNav onOpenCommandPalette={() => setCommandPaletteOpen(true)} />
        <ProcurementTicker />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>

      {/* Permanently Pinned iOS Floating Bottom Glass Pill Dock (Streamlined Minimal Options for All Aspect Ratios & Devices) */}
      <nav
        aria-label="Primary Navigation Dock"
        className="fixed bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-50 ios-bottom-dock rounded-full p-1.5 flex items-center gap-1 sm:gap-2 shadow-2xl select-none shrink-0"
        style={{ bottom: 'max(0.75rem, env(safe-area-inset-bottom, 0.75rem))' }}
      >
        {/* 1. Home */}
        <Link
          to="/"
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 cursor-pointer shrink-0',
            location.pathname === '/'
              ? 'bg-primary text-primary-foreground font-bold shadow-xs scale-[1.02]'
              : 'text-muted-foreground hover:text-foreground hover:bg-foreground/5'
          )}
        >
          <Home className="h-3.5 w-3.5" />
          <span className="text-[11px] font-heading uppercase tracking-wider">Home</span>
        </Link>

        {/* 2. Startup Discovery / Marketplace */}
        <Link
          to="/problems"
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 cursor-pointer shrink-0',
            isActive('/problems')
              ? 'bg-primary text-primary-foreground font-bold shadow-xs scale-[1.02]'
              : 'text-muted-foreground hover:text-foreground hover:bg-foreground/5'
          )}
        >
          <Compass className="h-3.5 w-3.5" />
          <span className="text-[11px] font-heading uppercase tracking-wider">Market</span>
        </Link>

        {/* 3. Central Post Challenge Action Pill - Primary Highlight Action Contained 100% Inside */}
        <Link
          to="/report"
          className={cn(
            'flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-150 cursor-pointer shrink-0 shadow-sm active:scale-95',
            location.pathname === '/report'
              ? 'bg-accent text-accent-foreground ring-2 ring-accent/40 font-black'
              : 'bg-accent hover:bg-accent-hover text-accent-foreground glow-saffron'
          )}
          title="Post Department Challenge"
        >
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="text-[11px] font-heading">Post</span>
        </Link>

        {/* 4. Pilot Telemetry & Docket Tracker */}
        <Link
          to="/track"
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 cursor-pointer shrink-0',
            isActive('/track')
              ? 'bg-primary text-primary-foreground font-bold shadow-xs scale-[1.02]'
              : 'text-muted-foreground hover:text-foreground hover:bg-foreground/5'
          )}
        >
          <Activity className="h-3.5 w-3.5" />
          <span className="text-[11px] font-heading uppercase tracking-wider">Track</span>
        </Link>
      </nav>

      {/* Global Command Palette (Cmd+K) */}
      <CommandPalette open={commandPaletteOpen} onOpenChange={setCommandPaletteOpen} />
      <Toaster position="top-right" richColors closeButton />
    </div>
  );
}

export default AppShell;
