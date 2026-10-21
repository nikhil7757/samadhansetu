import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import {
  FileText,
  Copy,
  Check,
  Download,
  Share2,
  ExternalLink,
  ChevronRight,
  Sparkles,
  BookOpen,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { STANDARD_TEMPLATES, StandardTemplate } from '@/lib/templatesData';
import { cn } from '@/lib/utils';

interface StandardTemplateReaderProps {
  initialTemplateId?: string;
  onSelectTemplate?: (tpl: StandardTemplate) => void;
  className?: string;
}

export function StandardTemplateReader({
  initialTemplateId = 'tpl-outcome-statement',
  onSelectTemplate,
  className,
}: StandardTemplateReaderProps) {
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState(initialTemplateId);
  const [copied, setCopied] = useState(false);

  const activeTemplate = useMemo(() => {
    return STANDARD_TEMPLATES.find((t) => t.id === selectedId) || STANDARD_TEMPLATES[0];
  }, [selectedId]);

  // Extract table of contents headings (lines starting with ### or ##)
  const headings = useMemo(() => {
    const lines = activeTemplate.content.split('\n');
    return lines
      .filter((line) => line.startsWith('## ') || line.startsWith('### '))
      .map((line) => line.replace(/^#{2,3}\s+/, '').trim());
  }, [activeTemplate]);

  const handleCopy = () => {
    navigator.clipboard.writeText(activeTemplate.content);
    setCopied(true);
    toast.success('Template copied to clipboard', {
      description: `${activeTemplate.title} (${activeTemplate.version})`,
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([activeTemplate.content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${activeTemplate.id}-${activeTemplate.version}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('Downloaded template Markdown file');
  };

  const handleUseTemplate = () => {
    if (activeTemplate.type === 'PROBLEM_STATEMENT') {
      navigate('/report?template=' + activeTemplate.id);
    } else {
      toast.info('Template Selected', {
        description: `Reference ${activeTemplate.title} loaded into your procurement draft.`,
      });
      onSelectTemplate?.(activeTemplate);
    }
  };

  return (
    <div className={cn('rounded-2xl border border-border bg-card shadow-sm overflow-hidden', className)}>
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
        {/* Left Column: Template Catalog Navigation */}
        <aside className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-border bg-secondary/30 p-4 space-y-3">
          <div className="flex items-center gap-2 px-1">
            <BookOpen className="h-4 w-4 text-primary" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground font-heading">
              Standard Model Contracts (7)
            </h3>
          </div>
          <p className="text-[11px] text-muted-foreground px-1">
            Approved by MSInS & State Law Directorate for frictionless startup procurement.
          </p>

          <div className="space-y-1.5 pt-2">
            {STANDARD_TEMPLATES.map((tpl) => {
              const isSelected = tpl.id === activeTemplate.id;
              return (
                <button
                  key={tpl.id}
                  type="button"
                  onClick={() => {
                    setSelectedId(tpl.id);
                    onSelectTemplate?.(tpl);
                  }}
                  className={cn(
                    'w-full text-left p-3 rounded-xl transition-all cursor-pointer border flex flex-col gap-1',
                    isSelected
                      ? 'bg-card text-foreground border-primary shadow-xs ring-1 ring-primary/20'
                      : 'bg-transparent text-muted-foreground hover:bg-card/60 hover:text-foreground border-transparent'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-mono font-bold px-1.5 py-0.2 rounded bg-muted">
                      {tpl.version}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-medium">{tpl.category}</span>
                  </div>
                  <div className="text-xs font-bold leading-snug line-clamp-1">{tpl.title}</div>
                  <div className="text-[11px] text-muted-foreground line-clamp-2">{tpl.summary}</div>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Right Column: Active Template Solid Reader */}
        <main className="lg:col-span-8 flex flex-col bg-card">
          {/* Reader Top Bar */}
          <div className="p-4 sm:p-5 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-muted/20">
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                  {activeTemplate.id}
                </span>
                <span className="text-[10px] font-semibold text-muted-foreground">
                  Category: {activeTemplate.category}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-foreground font-heading">
                {activeTemplate.title}
              </h2>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="text-xs font-semibold gap-1.5 cursor-pointer"
                title="Copy template content"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                className="text-xs font-semibold gap-1.5 cursor-pointer"
                title="Download as Markdown"
              >
                <Download className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Export</span>
              </Button>

              <Button
                size="sm"
                onClick={handleUseTemplate}
                className="text-xs font-bold gap-1.5 bg-primary hover:bg-primary-hover text-white shadow-xs cursor-pointer"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Use This Template</span>
              </Button>
            </div>
          </div>

          {/* Quick Table of Contents Jump Links */}
          {headings.length > 0 && (
            <div className="px-5 py-2.5 bg-secondary/40 border-b border-border text-xs flex items-center gap-2 overflow-x-auto scrollbar-none">
              <span className="text-[10px] uppercase font-bold text-muted-foreground shrink-0">Sections:</span>
              {headings.map((h, i) => (
                <span key={i} className="text-[11px] font-medium text-primary hover:underline shrink-0 cursor-default">
                  {h} {i < headings.length - 1 ? '•' : ''}
                </span>
              ))}
            </div>
          )}

          {/* Markdown Content Display (High Contrast, Readable Measure) */}
          <div className="p-6 sm:p-8 flex-1 overflow-y-auto space-y-4">
            <div className="prose prose-sm dark:prose-invert prose-measure max-w-none text-xs sm:text-sm font-sans leading-relaxed text-foreground">
              <pre className="whitespace-pre-wrap font-sans text-foreground bg-transparent p-0 border-0 leading-relaxed">
                {activeTemplate.content}
              </pre>
            </div>
          </div>

          {/* Bottom Compliance Disclaimer */}
          <div className="p-4 border-t border-border bg-muted/20 text-[11px] text-muted-foreground flex items-center justify-between">
            <span>Standardized under Maharashtra Innovation Procurement Framework</span>
            <span className="font-mono">{activeTemplate.version} Legal Review Completed</span>
          </div>
        </main>
      </div>
    </div>
  );
}

export default StandardTemplateReader;
