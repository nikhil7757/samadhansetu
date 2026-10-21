import { useState, useEffect } from 'react';
import { Outlet, useLocation, Link } from 'react-router';
import { TopNav } from './TopNav';
import { Footer } from './Footer';
import { Toaster } from 'sonner';
import { CommandPalette } from '@/components/shared/CommandPalette';
import { Compass, PlusCircle, Search, Rocket, Home } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { cn } from '@/lib/utils';

export function AppShell() {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  // Scroll to top on route navigation
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  const isStartup = user?.role === 'STARTUP' || user?.role === 'UNIVERSITY' || user?.role === 'INDUSTRY';

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary/20 selection:text-primary relative overflow-x-hidden bg-app-atmosphere">
      <div className="flex flex-col min-h-screen pb-16 lg:pb-0">
        <TopNav onOpenCommandPalette={() => setCommandPaletteOpen(true)} />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>

      {/* Floating mobile bottom navigation bar */}
      <nav
        aria-label="Mobile Navigation"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 glass-surface border-t border-border/80 px-2 py-1.5 flex items-center justify-around"
      >
        <Link
          to="/"
          className={cn(
            'flex flex-col items-center justify-center py-1 px-2.5 rounded-lg text-[10px] font-medium transition-colors',
            location.pathname === '/' ? 'text-primary font-bold' : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <Home className="h-4 w-4 mb-0.5" />
          <span>Home</span>
        </Link>

        <Link
          to="/problems"
          className={cn(
            'flex flex-col items-center justify-center py-1 px-2.5 rounded-lg text-[10px] font-medium transition-colors',
            location.pathname.startsWith('/problems') ? 'text-primary font-bold' : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <Compass className="h-4 w-4 mb-0.5" />
          <span>Market</span>
        </Link>

        <Link
          to="/report"
          className="flex flex-col items-center justify-center -mt-4 bg-gradient-to-tr from-amber-600 to-amber-500 text-white rounded-full h-11 w-11 shadow-lg shadow-amber-600/30 ring-2 ring-background focus:outline-hidden"
          title="Post Challenge"
        >
          <PlusCircle className="h-5 w-5" />
        </Link>

        <button
          type="button"
          onClick={() => setCommandPaletteOpen(true)}
          className="flex flex-col items-center justify-center py-1 px-2.5 rounded-lg text-[10px] font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          <Search className="h-4 w-4 mb-0.5" />
          <span>Search</span>
        </button>

        <Link
          to={user ? '/my/submissions' : '/track'}
          className={cn(
            'flex flex-col items-center justify-center py-1 px-2.5 rounded-lg text-[10px] font-medium transition-colors',
            location.pathname.startsWith('/my') || location.pathname.startsWith('/track')
              ? 'text-primary font-bold'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <Rocket className="h-4 w-4 mb-0.5" />
          <span>{user ? (isStartup ? 'Proposals' : 'Challenges') : 'Track'}</span>
        </Link>
      </nav>

      {/* Global Command Palette (Cmd+K) */}
      <CommandPalette open={commandPaletteOpen} onOpenChange={setCommandPaletteOpen} />
      <Toaster position="top-right" richColors closeButton />
    </div>
  );
}
