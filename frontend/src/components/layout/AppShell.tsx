import { Outlet } from 'react-router';
import { TopNav } from './TopNav';
import { Footer } from './Footer';
import { Toaster } from 'sonner';

export function AppShell() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      <TopNav />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <Toaster position="top-right" richColors closeButton />
    </div>
  );
}
