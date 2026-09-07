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
} from 'lucide-react';
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
  appealComplaint,
  getStoredComplaints,
  type Complaint,
} from '@/lib/complaints';
import { cn, formatDate } from '@/lib/utils';

export default function ComplaintTrackerPage() {
  const { complaintId } = useParams<{ complaintId?: string }>();
  const navigate = useNavigate();

  const [searchInput, setSearchInput] = useState('');
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);

  // Appeal modal state
  const [appealModalOpen, setAppealModalOpen] = useState(false);
  const [appealReason, setAppealReason] = useState('');
  const [isSubmittingAppeal, setIsSubmittingAppeal] = useState(false);

  useEffect(() => {
    if (!complaintId) {
      // Default to first complaint if accessed at /track without param
      const all = getStoredComplaints();
      if (all.length > 0) {
        setComplaint(all[0]);
        setSearchInput(all[0].id);
      }
      return;
    }

    const found = getComplaintById(complaintId);
    if (found) {
      setComplaint(found);
      setSearchInput(found.id);
      setNotFound(false);
    } else {
      setComplaint(null);
      setNotFound(true);
    }
  }, [complaintId]);

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

  const handleAppealSubmit = () => {
    if (!complaint) return;
    setIsSubmittingAppeal(true);
    try {
      const updated = appealComplaint(complaint.id, appealReason.trim() || 'Citizen requested human officer review of automated rejection.');
      if (updated) {
        setComplaint({ ...updated });
        setAppealModalOpen(false);
        setAppealReason('');
        toast.success('Appeal submitted successfully! Assigned to Nodal Officer review queue.');
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
        {notFound ? (
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
            {/* Header Card */}
            <Card className="border-border shadow-sm rounded-2xl overflow-hidden bg-card">
              <div className="p-6 sm:p-8 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground font-medium">
                      Official Public Tracking Identifier
                    </span>
                    <div className="flex items-center gap-3">
                      <h1 className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-primary">
                        {complaint.id}
                      </h1>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCopyId}
                        className="h-8 gap-1.5 text-xs rounded-lg"
                      >
                        {hasCopied ? (
                          <>
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5" />
                            <span>Copy</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Status Badges */}
                  <div className="flex flex-wrap items-center gap-2">
                    <div
                      className={cn(
                        'px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border flex items-center gap-1.5',
                        complaint.status === 'resolved'
                          ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30'
                          : complaint.status === 'verified_in_progress'
                          ? 'bg-sky-500/10 text-sky-600 border-sky-500/30'
                          : complaint.status === 'pending_officer' || complaint.status === 'officer_reviewing'
                          ? 'bg-amber-500/15 text-amber-600 border-amber-500/40 animate-pulse'
                          : complaint.status === 'auto_approved'
                          ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30'
                          : 'bg-rose-500/10 text-rose-600 border-rose-500/30'
                      )}
                    >
                      {complaint.status === 'resolved' && <CheckCircle2 className="h-3.5 w-3.5" />}
                      {complaint.status === 'verified_in_progress' && <Clock className="h-3.5 w-3.5" />}
                      {(complaint.status === 'pending_officer' || complaint.status === 'officer_reviewing') && (
                        <Clock className="h-3.5 w-3.5" />
                      )}
                      {(complaint.status === 'auto_rejected' || complaint.status === 'rejected_by_officer') && (
                        <XCircle className="h-3.5 w-3.5" />
                      )}
                      <span>{complaint.status.replace(/_/g, ' ')}</span>
                    </div>

                    <div className="px-2.5 py-1 rounded-full bg-secondary text-xs font-semibold capitalize text-foreground border border-border">
                      {complaint.category}
                    </div>
                  </div>
                </div>

                {/* Complaint Title & Meta */}
                <div className="space-y-2">
                  <h2 className="text-xl sm:text-2xl font-black text-foreground">
                    {complaint.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {complaint.description}
                  </p>

                  <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-primary" />
                      {complaint.location.address}, {complaint.location.district}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      Submitted {formatDate(complaint.submitted_at)}
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
                />
              </div>
            </Card>

            {/* Special Notification Banners Based on Status */}
            {/* 1. Pending Officer Review Notice */}
            {(complaint.status === 'pending_officer' || complaint.status === 'officer_reviewing') && (
              <Card className="border-amber-500/30 bg-amber-500/5 rounded-2xl p-5 shadow-xs">
                <div className="flex items-start gap-3.5">
                  <div className="h-9 w-9 rounded-full bg-amber-500/15 text-amber-600 flex items-center justify-center shrink-0">
                    <Clock className="h-5 w-5 animate-pulse" />
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
                <Card className="border-border rounded-2xl bg-card p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-border pb-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-primary" />
                      <h3 className="text-sm font-bold text-foreground">
                        AI Verification Diagnostics
                      </h3>
                    </div>
                    <span
                      className={cn(
                        'text-xs font-mono font-black px-2.5 py-0.5 rounded-full border',
                        complaint.ai_score >= 80
                          ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30'
                          : complaint.ai_score >= 40
                          ? 'bg-amber-500/10 text-amber-600 border-amber-500/30'
                          : 'bg-rose-500/10 text-rose-600 border-rose-500/30'
                      )}
                    >
                      {complaint.ai_score} / 100 Authenticity
                    </span>
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-foreground">AI Signal Flags:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {complaint.ai_flags.map((flag, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md text-[11px] font-mono bg-secondary border border-border text-foreground"
                        >
                          #{flag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-border/80 text-xs text-muted-foreground space-y-1">
                    <p>• Text Coherence & Civic Specificity (20% weight)</p>
                    <p>• Duplicate Check against Ward Reports (20% weight)</p>
                    <p>• Geo-Consistency with {complaint.location.district} (20% weight)</p>
                    <p>• Image EXIF & Tamper Analysis (15% weight)</p>
                    <p>• Submitter Historical Reliability (15% weight)</p>
                    <p>• Category Match Check (10% weight)</p>
                  </div>
                </Card>

                {/* Location Details */}
                <Card className="border-border rounded-2xl bg-card p-6 shadow-xs space-y-3">
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    Geographical Coordinates & Jurisdiction
                  </h3>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-secondary/40 border border-border/50">
                      <span className="text-[10px] text-muted-foreground uppercase font-bold block">
                        District
                      </span>
                      <span className="font-semibold text-foreground">{complaint.location.district}</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-secondary/40 border border-border/50">
                      <span className="text-[10px] text-muted-foreground uppercase font-bold block">
                        GPS Coordinates
                      </span>
                      <span className="font-mono text-foreground font-semibold">
                        {complaint.location.lat.toFixed(4)}, {complaint.location.lng.toFixed(4)}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Address: {complaint.location.address}
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

            {/* Full History / Audit Trail (Fixes the "disappeared complaints" bug) */}
            <Card className="border-border rounded-2xl bg-card p-6 sm:p-8 shadow-xs space-y-6">
              <div className="border-b border-border pb-4">
                <h3 className="text-base sm:text-lg font-black tracking-tight text-foreground flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Official Timestamped History Log
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Immutable audit trail tracking every system event, AI score evaluation, and officer decision.
                </p>
              </div>

              <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
                {complaint.history.map((h, idx) => (
                  <div key={idx} className="relative space-y-1">
                    <div className="absolute -left-[27px] top-1 h-3.5 w-3.5 rounded-full bg-primary ring-4 ring-background" />
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <span className="text-xs font-bold text-foreground">
                        {h.actor}
                      </span>
                      <span className="text-[11px] text-muted-foreground font-mono">
                        {formatDate(h.timestamp)}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
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
