import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import {
  FileText,
  Download,
  Copy,
  Check,
  Building2,
  Scale,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { STANDARD_TEMPLATES, type StandardTemplate } from '@/lib/templatesData';

export default function TemplatesPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedTemplate, setSelectedTemplate] = useState<StandardTemplate>(STANDARD_TEMPLATES[0]);
  const [copied, setCopied] = useState(false);

  const copyTemplateContent = () => {
    navigator.clipboard.writeText(selectedTemplate.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadMarkdown = () => {
    const blob = new Blob([selectedTemplate.content], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${selectedTemplate.id}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleUseInChallenge = () => {
    navigate('/report');
  };

  return (
    <div className="min-h-screen bg-background py-10 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="border-b border-border/80 pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-3 shadow-xs">
            <FileText className="h-3.5 w-3.5" />
            <span>Standardized Legal, Technical & Commercial Frameworks</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-foreground font-serif tracking-tight">
            Standard Innovation Procurement Templates
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-3xl leading-relaxed">
            Eliminate procedural friction and legal ambiguity in public innovation procurement.
            Pre-approved templates formulated under the Maharashtra State Innovative Startup Policy and GFR 2017 regulations.
          </p>
        </div>

        {/* Templates Two-Column Explorer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Template List (4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            <span className="text-xs font-bold text-muted-foreground uppercase font-mono tracking-wider block mb-1">
              Select Document Template ({STANDARD_TEMPLATES.length})
            </span>
            {STANDARD_TEMPLATES.map((tpl) => (
              <button
                key={tpl.id}
                type="button"
                onClick={() => setSelectedTemplate(tpl)}
                className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  selectedTemplate.id === tpl.id
                    ? 'bg-card border-primary ring-1 ring-primary/30 shadow-xs'
                    : 'bg-card/60 border-border/70 hover:bg-card hover:border-border'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground mb-1.5">
                    <span className="font-bold text-primary uppercase">{tpl.category}</span>
                    <span>{tpl.version}</span>
                  </div>
                  <h4 className="text-sm font-bold text-foreground leading-snug">{tpl.title}</h4>
                  <p className="text-[11px] text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed">
                    {tpl.summary}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* Right Column: Template Preview & Action Drawer (8 cols) */}
          <div className="lg:col-span-8">
            <Card className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-primary uppercase">{selectedTemplate.category}</span>
                    <span className="text-xs text-muted-foreground font-mono">• {selectedTemplate.version}</span>
                  </div>
                  <h3 className="text-xl font-bold text-foreground font-serif mt-1">
                    {selectedTemplate.title}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={copyTemplateContent}
                    className="text-xs font-bold gap-1.5 cursor-pointer"
                  >
                    {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copied ? 'Copied!' : 'Copy'}</span>
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={downloadMarkdown}
                    className="text-xs font-bold gap-1.5 cursor-pointer"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Download (.md)</span>
                  </Button>

                  <Button
                    size="sm"
                    onClick={handleUseInChallenge}
                    className="text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white gap-1.5 cursor-pointer"
                  >
                    <span>Use in Challenge</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>

              {/* Template Content Box */}
              <div className="rounded-xl border border-border bg-secondary/20 p-5 font-mono text-xs leading-relaxed text-foreground overflow-x-auto max-h-[600px] overflow-y-auto whitespace-pre-wrap select-text">
                {selectedTemplate.content}
              </div>

              <div className="pt-4 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-muted-foreground">
                <span>Governing Authority: Maharashtra State Innovation Society (MSInS)</span>
                <span className="font-semibold text-primary">Compliance Guaranteed under GFR 2017</span>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
