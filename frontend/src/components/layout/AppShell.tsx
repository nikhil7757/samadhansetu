import { Outlet } from 'react-router';
import { TopNav } from './TopNav';
import { Footer } from './Footer';
import { Toaster } from 'sonner';

export function AppShell() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary/20 selection:text-primary relative overflow-x-hidden">
      {/* Ambient background atmosphere */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-40 dark:opacity-25">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <TopNav />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
      <Toaster position="top-right" richColors closeButton />
    </div>
  );
}
