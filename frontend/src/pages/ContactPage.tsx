import { MapPin, Phone, Mail, Clock, Building2, ShieldCheck, Send } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

export default function ContactPage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Inquiry received. State Nodal Helpdesk will respond within 24 hours.');
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center space-y-2 border-b border-border pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
            <Building2 className="h-3.5 w-3.5" />
            <span>Official Government Directory</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
            Contact Nodal Authorities
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Get in touch with the Department of Higher & Technical Education or district nodal officers across Jharkhand.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Contact Details (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            <Card className="p-5.5 rounded-2xl border-border/80 bg-card specular-card shadow-xs space-y-3">
              <span className="text-xs font-bold uppercase text-muted-foreground tracking-wider block">
                Central State Directorate
              </span>
              <div className="space-y-2.5 text-xs">
                <div className="flex items-start gap-2.5 text-foreground">
                  <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>
                    Yojana Bhawan, Nepal House, Doranda, Ranchi — 834002, Jharkhand
                  </span>
                </div>
                <div className="flex items-center gap-2.5 text-foreground">
                  <Phone className="h-4 w-4 text-primary shrink-0" />
                  <span>24x7 Citizen Helpline: <strong>181</strong> / 0651-2490000</span>
                </div>
                <div className="flex items-center gap-2.5 text-foreground">
                  <Mail className="h-4 w-4 text-primary shrink-0" />
                  <span>nodal.sih@samadhansetu.gov.in</span>
                </div>
                <div className="flex items-center gap-2.5 text-muted-foreground">
                  <Clock className="h-4 w-4 text-primary shrink-0" />
                  <span>Working Hours: Mon – Fri (09:30 – 18:00 IST)</span>
                </div>
              </div>
            </Card>

            <Card className="p-5.5 rounded-2xl border-border/80 bg-card specular-card shadow-xs space-y-2.5">
              <span className="text-xs font-bold uppercase text-muted-foreground tracking-wider block">
                Key District Nodal Desks
              </span>
              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-secondary/40 border border-border/50">
                  <span className="font-bold text-foreground block">Ranchi & Khunti Directorate</span>
                  <span className="text-muted-foreground text-[11px]">ranchi.nodal@samadhansetu.gov.in • 0651-2201928</span>
                </div>
                <div className="p-2.5 rounded-xl bg-secondary/40 border border-border/50">
                  <span className="font-bold text-foreground block">Dhanbad, Bokaro & Giridih Desk</span>
                  <span className="text-muted-foreground text-[11px]">dhanbad.nodal@samadhansetu.gov.in • 0326-2312091</span>
                </div>
                <div className="p-2.5 rounded-xl bg-secondary/40 border border-border/50">
                  <span className="font-bold text-foreground block">Santhal Pargana (Deoghar & Dumka)</span>
                  <span className="text-muted-foreground text-[11px]">deoghar.nodal@samadhansetu.gov.in • 06432-224102</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Inquiry Form (7 cols) */}
          <div className="md:col-span-7">
            <Card className="p-6 sm:p-8 rounded-2xl border-border/80 bg-card specular-card shadow-sm space-y-4">
              <h3 className="text-base font-bold text-foreground">Send Official Inquiry / Feedback</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-foreground">Your Full Name</label>
                    <Input placeholder="Priya Kumar" required className="text-xs" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-foreground">Contact Email / Phone</label>
                    <Input placeholder="priya.kumar@gmail.com" required className="text-xs" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Subject / Department Division</label>
                  <Input placeholder="e.g. Inquiry regarding CSR partnership guidelines" required className="text-xs" />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Detailed Message</label>
                  <Textarea placeholder="Type your message or inquiry here..." rows={4} required className="text-xs resize-none" />
                </div>

                <Button type="submit" className="w-full font-bold text-xs bg-primary hover:bg-primary-hover gap-2 shadow-sm rounded-xl">
                  <Send className="h-4 w-4" />
                  <span>Transmit Official Inquiry</span>
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
