import { useState } from 'react';
import { Link } from 'react-router';
import { HelpCircle, ChevronDown, ChevronUp, Sparkles, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'What is SamadhanSetu and who can use it?',
      a: 'SamadhanSetu is an initiative under SIH 2026 Problem Statement 043 sponsored by the Department of Higher & Technical Education, Govt. of Jharkhand. Any resident citizen of Jharkhand can report municipal, rural, water, road, or electrical issues. Technical universities and CSR foundations use the platform to adopt and resolve these challenges.',
    },
    {
      q: 'How does the automated AI verification scoring work?',
      a: 'Every submitted report is instantly evaluated by a 6-factor algorithm: text coherence (20%), duplicate check against ward reports (20%), geo-consistency with Jharkhand district landmarks (20%), image EXIF & manipulation check (15%), submitter historical reliability (15%), and category context match (10%). Scores ≥80 are auto-approved; scores 40–79 route to District Nodal Officers; scores <40 are flagged.',
    },
    {
      q: 'What happens if my complaint is flagged as invalid or rejected?',
      a: 'Unlike traditional portals where reports disappear, SamadhanSetu provides a visible public status and states the exact AI or officer reason. A prominent "Appeal this decision" button is always present, which immediately escalates the case into the human Nodal Officer queue for reconsideration.',
    },
    {
      q: 'How do I track my complaint without logging in?',
      a: 'Every complaint receives a public tracking ID (format: SS-2026-NNNNNN) upon submission. You can paste this ID into the search bar at /track or click the link in your confirmation dialog. No password or account login is required to inspect the public step-tracker and timestamped history.',
    },
    {
      q: 'Who actually fixes the problems reported on the platform?',
      a: 'Problems are matched with multi-stakeholder project teams: university faculty & student engineering teams (e.g. from IIT ISM Dhanbad or BIT Mesra) design the prototype or solution, while industrial CSR partners (e.g. Tata Steel Rural Development Society) provide milestone grants and district engineers execute the installation.',
    },
    {
      q: 'Is there a time limit (SLA) for resolving complaints?',
      a: 'Yes. State administrative guidelines set an initial nodal officer review target of < 48 hours for flagged cases and a target resolution window of under 7 days for community-scale challenges.',
    },
  ];

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-2 border-b border-border pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
            <HelpCircle className="h-3.5 w-3.5" />
            <span>Citizen Knowledge Base</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
            Frequently Asked Questions
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Find answers on complaint submission, AI scoring criteria, tracking, and appeal rights.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <Card
                key={idx}
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className={`p-5.5 rounded-2xl border bg-card specular-card shadow-xs transition-all duration-200 cursor-pointer ${
                  isOpen ? 'border-primary/50 shadow-sm' : 'border-border/80 hover:border-primary/40'
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <h3 className="font-bold text-sm text-foreground">{faq.q}</h3>
                  <div className={`h-7 w-7 rounded-lg flex items-center justify-center transition-colors ${
                    isOpen ? 'bg-primary/10 text-primary' : 'bg-secondary text-muted-foreground'
                  }`}>
                    {isOpen ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </div>
                </div>
                {isOpen && (
                  <p className="text-xs text-muted-foreground leading-relaxed mt-3 pt-3 border-t border-border/60 animate-fade-in">
                    {faq.a}
                  </p>
                )}
              </Card>
            );
          })}
        </div>

        <div className="p-6 rounded-2xl bg-secondary/30 border border-border/80 specular-card text-center space-y-3">
          <h3 className="text-sm font-bold text-foreground">Still have questions?</h3>
          <p className="text-xs text-muted-foreground">
            Call the Government of Jharkhand 24x7 Citizen Helpline at <strong className="text-foreground">181</strong> or contact your District Nodal Directorate.
          </p>
          <Button onClick={() => window.location.href = '/contact'} variant="outline" size="sm" className="text-xs font-bold gap-1.5 rounded-xl">
            <span>View District Directory</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
