import { useState } from 'react';
import { Link } from 'react-router';
import { HelpCircle, ChevronDown, ChevronUp, Sparkles, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PLATFORM_CONFIG } from '@/config/platform';

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: `What is ${PLATFORM_CONFIG.name} and who can participate?`,
      a: `${PLATFORM_CONFIG.name} is the sovereign innovation procurement platform of the Maharashtra State Innovation Society (MSInS), Department of Skills, Employment, Entrepreneurship & Innovation, Government of Maharashtra (SIH 2026 Problem ID 26136). Government departments post functional challenges, eligible DPIIT-recognized startups pitch innovative solutions, and expert panels evaluate and contract pilots.`,
    },
    {
      q: 'What exemptions apply to startups under GFR Rule 170 and Rule 173?',
      a: 'Under General Financial Rules (GFR) Rule 170 and 173 guidelines, recognized startups are exempted from prior turnover criteria and prior experience requirements, provided they demonstrate technical capability and innovation. Startups are also exempted from submitting Earnest Money Deposit (EMD / Bid Security).',
    },
    {
      q: 'How does the AI Challenge Quality Scoring work?',
      a: `When a department officer drafts a challenge, ${PLATFORM_CONFIG.name} analyzes the text across 4 core dimensions: outcome-based formulation (no prescriptive tech brand lock-in), measurable SMART KPIs, budget and pilot duration realism, and open IP/data rights compliance. Challenges must score ≥75 before public tenders can be issued.`,
    },
    {
      q: 'How are pilot contracts structured and payments released?',
      a: 'Pilots use standardized MSInS legal agreements with 3 milestone gates: Milestone 1 (Design & Baseline Deployment, 30%), Milestone 2 (Live Sandbox Testing & Telemetry, 40%), and Milestone 3 (Final Acceptance & Impact Audit, 30%). Third-party academic validators (e.g. VJTI, IIT Bombay) certify deliverables, triggering automated payment delay clocks against department finance desks.',
    },
    {
      q: 'What is the scale-up mechanism after pilot completion?',
      a: 'Pilots achieving verified KPI targets receive a Scale-Up Approval from the MSInS Steering Committee. Departments can issue scaled work orders under the innovation procurement route or export the validated product directly to the GeM (Government e-Marketplace) Startup Runway catalog for nationwide government purchasing.',
    },
    {
      q: 'Can a startup appeal an eligibility screening determination?',
      a: 'Yes. If a startup is flagged as ineligible during automated DPIIT/financial screening, a formal appeal can be submitted within 7 calendar days. The MSInS Innovation Ombudsman panel reviews appeals within 5 working days with human oversight.',
    },
  ];

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-2 border-b border-border pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
            <HelpCircle className="h-3.5 w-3.5" />
            <span>Procurement & Startup Knowledge Base</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground font-serif">
            Frequently Asked Questions
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Guidelines on GFR relaxations, challenge formulation, milestone verification, and scale-up pathways.
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
          <h3 className="text-sm font-bold text-foreground">Need specialized assistance?</h3>
          <p className="text-xs text-muted-foreground">
            Contact the MSInS Innovation Procurement Helpdesk or reach out to your District Innovation Officer.
          </p>
          <Link to="/contact">
            <Button variant="outline" size="sm" className="text-xs font-bold gap-1.5 rounded-xl">
              <span>View MSInS Directory</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
