import { useTranslation } from 'react-i18next';
import { FileText, ShieldCheck, BookOpen } from 'lucide-react';
import { StandardTemplateReader } from '@/components/shared/StandardTemplateReader';

export default function TemplatesPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background py-10 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="border-b border-border/80 pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-3 shadow-2xs">
            <FileText className="h-3.5 w-3.5" />
            <span>Standardized Legal, Technical & Commercial Frameworks</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-foreground font-heading tracking-tight">
            Standard Innovation Procurement Templates
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-3xl leading-relaxed prose-measure">
            Eliminate procedural friction and legal ambiguity in public innovation procurement.
            Pre-approved contracts formulated under the Maharashtra State Innovative Startup Policy and GFR 2017 statutory relaxations.
          </p>
        </div>

        {/* Signature Interactive Template Reader */}
        <StandardTemplateReader />
      </div>
    </div>
  );
}
