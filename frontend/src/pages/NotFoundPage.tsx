import { Link } from 'react-router';
import { motion } from 'motion/react';
import {
  Compass,
  Search,
  FileText,
  Rocket,
  Home,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StateSeal } from '@/components/shared/StateSeal';
import { openCommandPalette } from '@/components/shared/CommandPalette';

export function NotFoundPage() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-xl rounded-2xl glass-surface p-6 sm:p-10 border border-border shadow-2xl text-center space-y-6"
      >
        <div className="flex flex-col items-center">
          <StateSeal size="md" className="mb-4" />
          <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-danger/10 text-danger border border-danger/20">
            Error 404 • Gazette Route Not Found
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground font-heading tracking-tight mt-3">
            Dossier or Page Not Found
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-2 max-w-md prose-measure">
            The requested procurement record, docket identifier, or navigation path does not exist in the Maharashtra State Innovation Procurement registry.
          </p>
        </div>

        {/* Quick Search Action */}
        <div className="p-3 rounded-xl bg-card border border-border/80 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
            <Search className="h-4 w-4 text-primary" />
            <span>Search challenges, pilots, or templates</span>
          </div>
          <button
            type="button"
            onClick={openCommandPalette}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary text-foreground text-xs font-semibold hover:bg-secondary/80 transition-colors cursor-pointer"
          >
            <span>Open Palette</span>
            <kbd className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-background border border-border">⌘K</kbd>
          </button>
        </div>

        {/* Quick Route Shortcuts */}
        <div className="space-y-2 text-left">
          <div className="text-[10px] uppercase font-bold text-muted-foreground px-1">
            Recommended Portals
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Link
              to="/problems"
              className="p-3 rounded-xl bg-card border border-border hover:border-primary/50 transition-all flex items-center justify-between text-xs group"
            >
              <div className="flex items-center gap-2.5">
                <Compass className="h-4 w-4 text-primary" />
                <span className="font-semibold text-foreground">Discovery Marketplace</span>
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
            </Link>

            <Link
              to="/track"
              className="p-3 rounded-xl bg-card border border-border hover:border-primary/50 transition-all flex items-center justify-between text-xs group"
            >
              <div className="flex items-center gap-2.5">
                <Search className="h-4 w-4 text-accent" />
                <span className="font-semibold text-foreground">Track Pilot Dossier</span>
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
            </Link>

            <Link
              to="/templates"
              className="p-3 rounded-xl bg-card border border-border hover:border-primary/50 transition-all flex items-center justify-between text-xs group"
            >
              <div className="flex items-center gap-2.5">
                <FileText className="h-4 w-4 text-primary" />
                <span className="font-semibold text-foreground">Standard Templates</span>
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
            </Link>

            <Link
              to="/report"
              className="p-3 rounded-xl bg-card border border-border hover:border-primary/50 transition-all flex items-center justify-between text-xs group"
            >
              <div className="flex items-center gap-2.5">
                <Rocket className="h-4 w-4 text-amber-500" />
                <span className="font-semibold text-foreground">Post Civic Challenge</span>
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        <div className="pt-2">
          <Link to="/">
            <Button className="w-full text-xs font-bold gap-2 cursor-pointer bg-primary hover:bg-primary-hover text-white">
              <Home className="h-3.5 w-3.5" />
              <span>Return to SamadhanSetu Home</span>
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default NotFoundPage;
