import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import {
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  Copy,
  MapPin,
  Calendar,
  User,
  ShieldAlert,
  ArrowLeft,
  Share2,
  ExternalLink,
  Sparkles,
  HelpCircle,
  RotateCcw,
  FileText,
  Printer,
} from 'lucide-react';
import { StateSeal } from '@/components/shared/StateSeal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { HorizontalStepTracker } from '@/components/shared/HorizontalStepTracker';
import {
  getComplaintById,
  getStoredComplaints,
  type Complaint,
} from '@/lib/complaints';
import { useGrievance } from '@/lib/grievanceStore';
import { cn, formatDate } from '@/lib/utils';

export default function ComplaintTrackerPage() {
  const { complaintId } = useParams<{ complaintId?: string }>();
  const navigate = useNavigate();

  const {
    grievance: storeGrievance,
    isLoading: isStoreLoading,
    error: storeError,
    appeal: storeAppeal,
  } = useGrievance(complaintId);

  const [searchInput, setSearchInput] = useState('');
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);

  // Appeal modal state
  const [appealModalOpen, setAppealModalOpen] = useState(false);
  const [appealReason, setAppealReason] = useState('');
  const [isSubmittingAppeal, setIsSubmittingAppeal] = useState(false);

  useEffect(() => {
    if (complaintId) {
      if (storeGrievance) {
        setComplaint(storeGrievance);
        setSearchInput(storeGrievance.id);
        setNotFound(false);
      } else if (!isStoreLoading && storeError) {
        setComplaint(null);
        setNotFound(true);
      }
    } else {
      // Default to first complaint if accessed at /track without param
      const all = getStoredComplaints();
      if (all.length > 0) {
        setComplaint(all[0]);
        setSearchInput(all[0].id);
        setNotFound(false);
      }
    }
  }, [complaintId, storeGrievance, isStoreLoading, storeError]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    navigate(`/track/${encodeURIComponent(searchInput.trim().toUpperCase())}`);
  };

  const handleCopyId = () => {
    if (!complaint) return;
    navigator.clipboard.writeText(complaint.id);
    setHasCopied(true);
    toast.success('Tracking ID copied to clipboard');
    setTimeout(() => setHasCopied(false), 2000);
  };

  const handleAppealSubmit = async () => {
    if (!complaint) return;
    setIsSubmittingAppeal(true);
    try {
      const note = appealReason.trim() || 'Citizen requested human officer review of automated rejection.';
      const ok = await storeAppeal(note);
      if (ok) {
        setAppealModalOpen(false);
        setAppealReason('');
        toast.success('Appeal submitted successfully! Assigned to Nodal Officer review queue.');
      } else {
        toast.error('Failed to submit appeal');
      }
    } catch {
      toast.error('Failed to submit appeal');
    } finally {
      setIsSubmittingAppeal(false);
    }
  };

  // Expected response date (3 business days after submission)
  const getExpectedResponseDate = (submittedAt: string) => {
    const d = new Date(submittedAt);
    d.setDate(d.getDate() + 3);
    return d.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-background pb-16">
      {/* Top Search Bar */}
      <div className="border-b border-border bg-card/60 backdrop-blur-xs py-4 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="text-xs font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Home</span>
            </Link>
            <span className="text-muted-foreground">•</span>
            <span className="text-xs font-semibold text-primary">
              Public Grievance Tracker
            </span>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex items-center gap-2 max-w-md w-full">
            <div className="relative flex-1">
              <Search className="h-4 w-4 absolute left-3 top-2.5 text-muted-foreground" />
              <Input
                placeholder="Enter Tracking ID (e.g. SS-2026-000481)..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-9 h-9 text-xs font-mono uppercase"
              />
            </div>
            <Button type="submit" size="sm" className="h-9 px-3 text-xs font-bold gap-1">
              <span>Track</span>
            </Button>
          </form>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 space-y-8">
        {isStoreLoading && !complaint ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4 text-center">
            <div className="h-10 w-10 animate-spin rounded-full border-3 border-primary border-t-transparent" />
            <div className="space-y-1">
              <span className="text-sm font-bold text-foreground block">
                Loading Official Civic Docket...
              </span>
              <span className="text-xs font-mono text-muted-foreground block">
                Synchronizing {complaintId || 'docket'} with Jharkhand Civic Registry
              </span>
            </div>
          </div>
        ) : notFound ? (
          <Card className="p-8 text-center border-dashed rounded-2xl space-y-4">
            <div className="h-12 w-12 rounded-full bg-amber-500/10 text-amber-600 mx-auto flex items-center justify-center">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-foreground">Complaint Not Found</h2>
              <p className="text-xs text-muted-foreground max-w-md mx-auto">
                No civic complaint was found with ID <span className="font-mono font-bold text-foreground">{complaintId}</span>. Please verify the ID or submit a new grievance.
              </p>
            </div>
            <div className="pt-2 flex justify-center gap-3">
              <Button variant="outline" size="sm" onClick={() => navigate('/track')}>
                Try Another ID
              </Button>
              <Button size="sm" onClick={() => navigate('/#report')}>
                Report a New Issue
              </Button>
            </div>
          </Card>
        ) : complaint ? (
          <>
            {/* Official Government Case Dossier Header Card */}
            <Card className="docket-sheet border-border rounded-2xl overflow-hidden shadow-xl">
              {/* Paper Ledger Rule */}
              <div className="docket-ledger-rule" />

              {/* Gazette Identity Banner */}
              <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-950 text-white p-4 sm:px-6 flex items-center justify-between border-b border-white/10">
                <div className="flex items-center gap-3">
                  <StateSeal size="sm" />
                  <div>
                    <span className="text-[10px] font-mono tracking-widest text-emerald-300 uppercase block">
                      झारखंड सरकार • GOVERNMENT OF JHARKHAND
                    </span>
                    <span className="text-xs font-bold text-white tracking-tight">
                      DEPARTMENT OF PUBLIC GRIEVANCES & CIVIC ACTION • REGISTRY DOSSIER
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.print()}
                    className="hidden sm:inline-flex gap-1.5 text-xs font-bold bg-white/10 hover:bg-white/20 text-white border-white/20 h-8"
                  >
                    <Printer className="h-3.5 w-3.5" />
                    <span>Print Action Order</span>
                  </Button>
                  <div className="docket-stamp docket-stamp-verified text-[10px] py-0.5">
                    GAZETTE INDEXED
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
                  <div className="space-y-1.5">
                    <span className="text-[10.5px] font-mono uppercase tracking-widest text-muted-foreground font-bold block">
                      OFFICIAL DOCKET IDENTIFIER & DISPATCH CODE
                    </span>
                    <div className="flex items-center gap-3">
                      <h1 className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-primary">
                        {complaint.id}
                      </h1>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCopyId}
                        className="h-8 gap-1.5 text-xs rounded-lg border-border/90 font-bold"
                      >
                        {hasCopied ? (
                          <>
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5" />
                            <span>Copy Token</span>
                          </>
                        )}
                      </Button>
                    </div>

                    {/* Barcode representation */}
                    <div className="barcode-stripe w-56 text-foreground/40 mt-1" />
                  </div>

                  {/* Physical Stamped Seal Status */}
                  <div className="flex flex-col items-start sm:items-end gap-2">
                    <div
                      className={cn(
                        'docket-stamp text-xs py-1 px-3',
                        complaint.status === 'resolved'
                          ? 'docket-stamp-verified'
                          : complaint.status === 'verified_in_progress'
                          ? 'docket-stamp-action'
                          : complaint.status === 'pending_officer' || complaint.status === 'officer_reviewing'
                          ? 'docket-stamp-pending'
                          : complaint.status === 'auto_approved'
                          ? 'docket-stamp-verified'
                          : 'docket-stamp-action'
                      )}
                    >
                      {complaint.status === 'resolved' && 'GROUND RESOLUTION VERIFIED'}
                      {complaint.status === 'verified_in_progress' && 'FIELD DISPATCH IN PROGRESS'}
                      {(complaint.status === 'pending_officer' || complaint.status === 'officer_reviewing') && 'UNDER NODAL SCRUTINY'}
                      {complaint.status === 'auto_approved' && 'AUTO-VALIDATED & QUEUED'}
                      {(complaint.status === 'auto_rejected' || complaint.status === 'rejected_by_officer') && 'REJECTED (APPEAL ADMISSIBLE)'}
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-mono text-muted-foreground">Target Nodal Agency:</span>
                      <span className="px-2 py-0.5 rounded bg-primary/10 text-primary font-bold uppercase font-mono">
                        {complaint.category}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Complaint Title & Meta */}
                <div className="space-y-2.5">
                  <h2 className="text-xl sm:text-2xl font-black text-foreground">
                    {complaint.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-3xl">
                    {complaint.description}
                  </p>

                  <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-muted-foreground font-mono">
                    <span className="flex items-center gap-1.5 text-foreground font-semibold">
                      <MapPin className="h-3.5 w-3.5 text-primary" />
                      {complaint.location.address}, {complaint.location.district}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      Submitted: {formatDate(complaint.submitted_at)}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      Citizen ID: {complaint.citizen_id || 'VERIFIED-CITIZEN'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Horizontal Step Tracker */}
              <div className="p-6 bg-secondary/10 border-t border-border">
                <HorizontalStepTracker
                  status={complaint.status}
                  aiScore={complaint.ai_score}
                  history={complaint.history}
                  submittedAt={complaint.submitted_at}
                  category={complaint.category}
                  district={complaint.location.district}
                  officerName={complaint.officer_name}
                />
              </div>
            </Card>

            {/* Special Notification Banners Based on Status */}
            {/* 1. Pending Officer Review Notice */}
            {(complaint.status === 'pending_officer' || complaint.status === 'officer_reviewing') && (
              <Card className="border-amber-500/30 bg-amber-500/5 rounded-2xl p-5 shadow-xs">
                <div className="flex items-start gap-3.5">
                  <div className="h-9 w-9 rounded-full bg-amber-500/15 text-amber-600 flex items-center justify-center shrink-0">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-foreground">
                      Under Review by {complaint.location.district} Nodal Officer
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Your report scored <span className="font-semibold text-foreground">{complaint.ai_score}/100</span> in automated checks and has been routed to the District Nodal Officer queue for manual ground verification. Expected review completion by <span className="font-bold text-foreground">{getExpectedResponseDate(complaint.submitted_at)}</span>.
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {/* 2. Rejection & One-Click Appeal Card */}
            {(complaint.status === 'auto_rejected' || complaint.status === 'rejected_by_officer') && (
              <Card className="border-rose-500/30 bg-rose-500/5 rounded-2xl p-6 shadow-xs space-y-4">
                <div className="flex items-start justify-between gap-4 flex-col sm:flex-row">
                  <div className="flex items-start gap-3.5">
                    <div className="h-10 w-10 rounded-full bg-rose-500/15 text-rose-600 flex items-center justify-center shrink-0">
                      <XCircle className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-sm font-bold text-rose-700 dark:text-rose-400">
                        {complaint.status === 'auto_rejected'
                          ? 'Flagged as Invalid by Automated Verification'
                          : 'Rejected by District Nodal Officer'}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {complaint.rejection_reason || 'The grievance did not meet minimum civic evidence thresholds.'}
                      </p>
                    </div>
                  </div>

                  {/* One-Click Appeal Button */}
                  <Button
                    onClick={() => setAppealModalOpen(true)}
                    className="bg-accent hover:bg-accent-hover text-accent-foreground font-bold text-xs gap-2 shrink-0 shadow-sm"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>Appeal this Decision</span>
                  </Button>
                </div>
              </Card>
            )}

            {/* Grid: AI Verification Diagnostics + Evidence Photo */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Col: AI Verification Breakdown */}
              <div className="lg:col-span-6 space-y-6">
                <Card className="border-border/80 rounded-2xl bg-card p-6 shadow-xs space-y-5 specular-card">
                  <div className="flex items-center justify-between border-b border-border/80 pb-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <Sparkles className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-black text-foreground leading-none">
                          AI Verification Diagnostics
                        </h3>
                        <span className="text-[10px] text-muted-foreground">Multi-Factor Engine v2.4</span>
                      </div>
                    </div>
                    <span
                      className={cn(
                        'text-xs font-mono font-black px-3 py-1 rounded-full border shadow-2xs',
                        complaint.ai_score >= 80
                          ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                          : complaint.ai_score >= 40
                          ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30'
                          : 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30'
                      )}
                    >
                      {complaint.ai_score} / 100 Authenticity
                    </span>
                  </div>

                  {/* AI Signal Flags */}
                  <div className="space-y-1.5">
                    <span className="text-xs font-bold text-foreground">Detected Signal Tags:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {complaint.ai_flags.map((flag, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-mono bg-secondary/80 border border-border/80 text-foreground font-semibold"
                        >
                          #{flag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Visual Weight Breakdown Bars */}
                  <div className="space-y-2.5 pt-2 border-t border-border/70">
                    <span className="text-xs font-bold text-foreground block">Verification Factor Breakdown:</span>
                    <div className="space-y-2 text-xs">
                      {[
                        { label: 'Text Coherence & Specificity', weight: '20%', score: complaint.ai_score >= 70 ? 92 : 65 },
                        { label: 'Duplicate Ward Screening', weight: '20%', score: 98 },
                        { label: `Geo-Consistency (${complaint.location.district})`, weight: '20%', score: complaint.ai_score >= 50 ? 88 : 45 },
                        { label: 'Image EXIF & Tamper Integrity', weight: '15%', score: complaint.media.length > 0 ? 94 : 30 },
                        { label: 'Citizen Historical Reliability', weight: '15%', score: 85 },
                        { label: 'Department Category Match', weight: '10%', score: 95 },
                      ].map((factor, idx) => (
                        <div key={idx} className="space-y-1">
                          <div className="flex justify-between text-[11px]">
                            <span className="text-muted-foreground">{factor.label} ({factor.weight})</span>
                            <span className="font-mono font-bold text-foreground">{factor.score}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                            <div
                              className={cn(
                                'h-full rounded-full transition-all duration-500',
                                factor.score >= 80 ? 'bg-emerald-500' : factor.score >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                              )}
                              style={{ width: `${factor.score}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>

                {/* Location Details */}
                <Card className="border-border/80 rounded-2xl bg-card p-6 shadow-xs space-y-3.5 specular-card">
                  <h3 className="text-sm font-black text-foreground flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    Geographical Coordinates & Jurisdiction
                  </h3>
                  <div className="grid grid-cols-2 gap-2.5 text-xs">
                    <div className="p-3 rounded-xl bg-secondary/50 border border-border/60">
                      <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">
                        District
                      </span>
                      <span className="font-bold text-foreground text-sm">{complaint.location.district}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-secondary/50 border border-border/60">
                      <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">
                        GPS Coordinates
                      </span>
                      <span className="font-mono text-foreground font-bold text-xs">
                        {complaint.location.lat.toFixed(4)}, {complaint.location.lng.toFixed(4)}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Address: <strong className="text-foreground">{complaint.location.address}</strong>
                  </p>
                </Card>
              </div>

              {/* Right Col: Media Evidence + Officer Notes */}
              <div className="lg:col-span-6 space-y-6">
                <Card className="border-border rounded-2xl bg-card p-6 shadow-xs space-y-4">
                  <h3 className="text-sm font-bold text-foreground">
                    Submitted Media Evidence
                  </h3>
                  {complaint.media.length > 0 ? (
                    <div className="space-y-2">
                      <div className="h-64 w-full rounded-xl overflow-hidden border border-border bg-secondary">
                        <img
                          src={complaint.media[0]}
                          alt="Evidence"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-[11px] text-muted-foreground font-mono">
                        1 original photo evidence archived with SHA-256 integrity hash
                      </span>
                    </div>
                  ) : (
                    <div className="h-36 rounded-xl border border-dashed border-border flex items-center justify-center text-xs text-muted-foreground">
                      No photographic evidence attached to this report
                    </div>
                  )}
                </Card>

                {complaint.officer_notes && (
                  <Card className="border-border rounded-2xl bg-primary/5 p-6 shadow-xs space-y-2 border-l-4 border-l-primary">
                    <span className="text-[10px] font-bold text-primary uppercase tracking-wider block">
                      Official Nodal Officer Endorsement
                    </span>
                    <p className="text-xs text-foreground italic">
                      "{complaint.officer_notes}"
                    </p>
                    <span className="text-[11px] text-muted-foreground font-medium block">
                      — {complaint.officer_name || 'Nodal Officer, Govt. of Jharkhand'}
                    </span>
                  </Card>
                )}
              </div>
            </div>

            {/* Official Gazette Dispatch & Audit Ledger */}
            <Card className="docket-sheet border-border rounded-2xl overflow-hidden p-6 sm:p-8 space-y-6 shadow-md">
              <div className="docket-ledger-rule -mx-6 sm:-mx-8 -mt-6 sm:-mt-8 mb-5" />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-4">
                <div>
                  <h3 className="text-base sm:text-lg font-black tracking-tight text-foreground flex items-center gap-2">
                    <FileText className="h-5 w-5 text-emerald-700 dark:text-emerald-400" />
                    <span>Official Gazette Inspection & Dispatch Ledger</span>
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Immutable chronological audit trail recording algorithmic assessments, nodal orders, and verified field closures.
                  </p>
                </div>
                <div className="docket-stamp docket-stamp-action text-[10px] py-0.5 self-start sm:self-auto">
                  CHAIN OF CUSTODY VALIDATED
                </div>
              </div>

              <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
                {complaint.history.map((h, idx) => (
                  <div key={idx} className="relative space-y-1.5 p-3 rounded-xl bg-secondary/30 border border-border/70">
                    <div className="absolute -left-[27px] top-4 h-3.5 w-3.5 rounded-full bg-emerald-600 ring-4 ring-card" />
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-card border border-border text-muted-foreground">
                          ENTRY #{String(idx + 1).padStart(2, '0')}
                        </span>
                        <span className="text-xs font-bold text-foreground">
                          {h.actor}
                        </span>
                      </div>
                      <span className="text-[11px] text-muted-foreground font-mono">
                        {formatDate(h.timestamp)}
                      </span>
                    </div>
                    <p className="text-xs text-foreground/90 pl-0.5 leading-relaxed">
                      {h.note || `Status transitioned to ${h.status.replace(/_/g, ' ')}`}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          </>
        ) : null}
      </div>

      {/* Appeal Dialog */}
      <Dialog open={appealModalOpen} onOpenChange={setAppealModalOpen}>
        <DialogContent className="max-w-md p-6 rounded-2xl">
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-lg font-bold text-foreground">
              Appeal Decision & Force Human Review
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              If you believe this automated evaluation was incorrect, submit an appeal note. It will bypass automated filters and directly enter the District Nodal Officer review queue.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 py-2">
            <label className="text-xs font-semibold text-foreground">
              Clarification / New Evidence Rationale
            </label>
            <Textarea
              placeholder="Explain why this issue is urgent or provide additional landmarks/details..."
              value={appealReason}
              onChange={(e) => setAppealReason(e.target.value)}
              rows={4}
              className="resize-none text-xs"
            />
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setAppealModalOpen(false)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={isSubmittingAppeal}
              onClick={handleAppealSubmit}
              className="text-xs font-bold bg-accent hover:bg-accent-hover text-accent-foreground"
            >
              {isSubmittingAppeal ? 'Submitting...' : 'Submit Formal Appeal'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
