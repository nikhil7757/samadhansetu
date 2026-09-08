import { Outlet } from 'react-router';
import { TopNav } from './TopNav';
import { Footer } from './Footer';
import { Toaster } from 'sonner';

export function AppShell() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary/20 selection:text-primary relative overflow-x-hidden">
      <div className="flex flex-col min-h-screen">
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
