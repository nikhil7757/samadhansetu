import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import {
  Search,
  FileText,
  Compass,
  Building2,
  Rocket,
  ShieldCheck,
  BarChart3,
  Moon,
  Sun,
  Globe,
  ArrowRight,
  ExternalLink,
  Activity,
  Layers,
  X,
} from 'lucide-react';
import { useNavSetu } from '@/lib/navsetuStore';
import { STANDARD_TEMPLATES } from '@/lib/templatesData';
import { useAuth } from '@/lib/auth';

interface CommandItem {
  id: string;
  category: 'Navigation' | 'Challenges & Pilots' | 'Standard Templates' | 'Actions';
  title: string;
  subtitle?: string;
  icon: React.ElementType;
  action: () => void;
  keywords?: string[];
}

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function openCommandPalette() {
  window.dispatchEvent(new CustomEvent('toggle-command-palette', { detail: true }));
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { challenges, pilots } = useNavSetu();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Support global custom event trigger
  useEffect(() => {
    const handleToggle = (e: Event) => {
      const custom = e as CustomEvent<boolean | undefined>;
      if (typeof custom.detail === 'boolean') {
        onOpenChange(custom.detail);
      } else {
        onOpenChange(!open);
      }
    };
    window.addEventListener('toggle-command-palette', handleToggle);
    return () => window.removeEventListener('toggle-command-palette', handleToggle);
  }, [open, onOpenChange]);

  // Global keyboard shortcut: Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        onOpenChange(!open);
      } else if (e.key === 'Escape' && open) {
        e.preventDefault();
        onOpenChange(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onOpenChange]);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Command items catalog
  const items: CommandItem[] = useMemo(() => {
    const navItems: CommandItem[] = [
      {
        id: 'nav-home',
        category: 'Navigation',
        title: t('nav.home', 'Home Portal'),
        subtitle: 'SamadhanSetu Maharashtra Innovation Platform',
        icon: Building2,
        action: () => navigate('/'),
        keywords: ['home', 'landing', 'main'],
      },
      {
        id: 'nav-marketplace',
        category: 'Navigation',
        title: t('nav.marketplace', 'Startup Discovery Marketplace'),
        subtitle: 'Browse open government challenges across 36 districts',
        icon: Compass,
        action: () => navigate('/problems'),
        keywords: ['challenges', 'problems', 'marketplace', 'bids'],
      },
      {
        id: 'nav-report',
        category: 'Navigation',
        title: t('nav.postChallenge', 'Post a Department Challenge'),
        subtitle: 'Formulate an outcome-based challenge with AI scoring',
        icon: Rocket,
        action: () => navigate('/report'),
        keywords: ['create', 'post', 'submit', 'challenge', 'department'],
      },
      {
        id: 'nav-track',
        category: 'Navigation',
        title: t('nav.trackDocket', 'Track Pilot Lifecycle & Dossier'),
        subtitle: '11-stage statutory tracker, milestones & GeM export',
        icon: Activity,
        action: () => navigate('/track'),
        keywords: ['track', 'pilot', 'lifecycle', 'docket', 'gem'],
      },
      {
        id: 'nav-templates',
        category: 'Navigation',
        title: t('nav.templates', 'Standard Procurement Templates'),
        subtitle: '7 pre-approved legal, cybersecurity & risk contracts',
        icon: FileText,
        action: () => navigate('/templates'),
        keywords: ['templates', 'contracts', 'legal', 'ip', 'clauses'],
      },
      {
        id: 'nav-analytics',
        category: 'Navigation',
        title: t('nav.dashboard', 'Innovation Pipeline Dashboard'),
        subtitle: 'Statewide telemetry, sector analytics & turnaround times',
        icon: BarChart3,
        action: () => navigate('/dashboard/analytics'),
        keywords: ['analytics', 'metrics', 'stats', 'telemetry', 'impact'],
      },
    ];

    if (user?.role === 'ADMIN' || user?.role === 'INNOVATION_SOCIETY_ADMIN' || user?.role === 'EVALUATOR') {
      navItems.push({
        id: 'nav-admin',
        category: 'Navigation',
        title: 'Approvals & Evaluation Queue',
        subtitle: 'Inspect submitted challenges and score startup proposals',
        icon: ShieldCheck,
        action: () => navigate('/admin/pending'),
        keywords: ['admin', 'evaluation', 'approvals', 'scoring'],
      });
    }

    // Dynamic challenge items
    const challengeItems: CommandItem[] = challenges.slice(0, 5).map((c) => ({
      id: `ch-${c.id}`,
      category: 'Challenges & Pilots',
      title: `${c.id}: ${c.title}`,
      subtitle: `${c.department} • ${c.district} (Quality: ${c.aiQualityScore}/100)`,
      icon: Activity,
      action: () => navigate(`/problems/${c.id}`),
      keywords: [c.id, c.department, c.district, c.sector, c.title],
    }));

    // Dynamic pilot items
    const pilotItems: CommandItem[] = pilots.slice(0, 4).map((p) => ({
      id: `pilot-${p.id}`,
      category: 'Challenges & Pilots',
      title: `Pilot ${p.id}: ${p.startupName}`,
      subtitle: `Stage ${p.stageNumber}/11 • ₹${p.totalBudget}L (${p.district})`,
      icon: Layers,
      action: () => navigate(`/track/${p.id}`),
      keywords: [p.id, p.startupName, p.department, p.district],
    }));

    // Standard templates
    const templateItems: CommandItem[] = STANDARD_TEMPLATES.map((t) => ({
      id: `tpl-${t.id}`,
      category: 'Standard Templates',
      title: t.title,
      subtitle: `v${t.version} • ${t.type.replace(/_/g, ' ')}`,
      icon: FileText,
      action: () => navigate('/templates'),
      keywords: [t.id, t.title, t.type],
    }));

    // Actions
    const actionItems: CommandItem[] = [
      {
        id: 'act-theme',
        category: 'Actions',
        title: 'Toggle Light / Dark Mode',
        subtitle: 'Switch between light glass and dark indigo atmosphere',
        icon: document.documentElement.classList.contains('dark') ? Sun : Moon,
        action: () => {
          const isDark = document.documentElement.classList.toggle('dark');
          localStorage.setItem('theme', isDark ? 'dark' : 'light');
        },
        keywords: ['theme', 'dark', 'light', 'mode'],
      },
      {
        id: 'act-lang-mr',
        category: 'Actions',
        title: 'भाषा बदला: मराठी (Marathi)',
        subtitle: 'Switch interface language to Marathi',
        icon: Globe,
        action: () => {
          i18n.changeLanguage('mr');
          localStorage.setItem('i18nextLng', 'mr');
        },
        keywords: ['marathi', 'language', 'bhasha'],
      },
      {
        id: 'act-lang-hi',
        category: 'Actions',
        title: 'भाषा बदलें: हिन्दी (Hindi)',
        subtitle: 'Switch interface language to Hindi',
        icon: Globe,
        action: () => {
          i18n.changeLanguage('hi');
          localStorage.setItem('i18nextLng', 'hi');
        },
        keywords: ['hindi', 'language', 'bhasha'],
      },
      {
        id: 'act-lang-en',
        category: 'Actions',
        title: 'Switch Language: English',
        subtitle: 'Switch interface language to English',
        icon: Globe,
        action: () => {
          i18n.changeLanguage('en');
          localStorage.setItem('i18nextLng', 'en');
        },
        keywords: ['english', 'language'],
      },
    ];

    return [...navItems, ...challengeItems, ...pilotItems, ...templateItems, ...actionItems];
  }, [challenges, pilots, user, t, i18n, navigate]);

  // Filter items based on user search query
  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items.slice(0, 15);
    return items.filter((item) => {
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchSub = item.subtitle?.toLowerCase().includes(q);
      const matchCat = item.category.toLowerCase().includes(q);
      const matchKeywords = item.keywords?.some((k) => k.toLowerCase().includes(q));
      return matchTitle || matchSub || matchCat || matchKeywords;
    });
  }, [items, query]);

  // Keyboard navigation within filtered list
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(filteredItems.length, 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % Math.max(filteredItems.length, 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const selected = filteredItems[selectedIndex];
      if (selected) {
        selected.action();
        onOpenChange(false);
      }
    }
  };

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Global Command Palette"
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/40 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={() => onOpenChange(false)}
    >
      <div
        className="w-full max-w-2xl rounded-2xl glass-popover overflow-hidden shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-border/70 gap-3">
          <Search className="h-5 w-5 text-primary shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command, jump to challenge (SS-XXXX), pilot or template..."
            className="flex-1 bg-transparent text-sm font-medium text-foreground placeholder:text-muted-foreground outline-none"
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono font-semibold rounded bg-muted/60 text-muted-foreground border border-border">
            ESC
          </kbd>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="p-1 rounded-md text-muted-foreground hover:text-foreground cursor-pointer"
            aria-label="Close command palette"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-2 space-y-1">
          {filteredItems.length === 0 ? (
            <div className="py-10 text-center text-xs text-muted-foreground">
              No matching commands or dossiers found for <span className="font-mono font-semibold text-foreground">"{query}"</span>
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    item.action();
                    onOpenChange(false);
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-primary text-primary-foreground shadow-xs font-semibold'
                      : 'hover:bg-muted/50 text-foreground'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'bg-white/20 text-white'
                          : 'bg-primary/10 text-primary dark:bg-primary/20'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold truncate leading-snug">{item.title}</div>
                      {item.subtitle && (
                        <div
                          className={`text-[11px] truncate ${
                            isSelected ? 'text-white/80' : 'text-muted-foreground'
                          }`}
                        >
                          {item.subtitle}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                        isSelected
                          ? 'bg-white/20 text-white'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {item.category}
                    </span>
                    <ArrowRight className={`h-3.5 w-3.5 ${isSelected ? 'text-white' : 'text-muted-foreground'}`} />
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer info bar */}
        <div className="px-4 py-2.5 bg-muted/30 border-t border-border/50 text-[11px] text-muted-foreground flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span>Use <kbd className="font-mono bg-muted px-1.5 py-0.5 rounded text-[10px]">↑</kbd> <kbd className="font-mono bg-muted px-1.5 py-0.5 rounded text-[10px]">↓</kbd> to navigate</span>
            <span><kbd className="font-mono bg-muted px-1.5 py-0.5 rounded text-[10px]">↵</kbd> to select</span>
          </div>
          <span>SamadhanSetu Glass Palette</span>
        </div>
      </div>
    </div>
  );
}
