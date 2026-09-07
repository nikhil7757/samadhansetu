import { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import {
  Clock,
  Check,
  X,
  MapPin,
  Calendar,
  User,
  ShieldAlert,
  ArrowLeft,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  TrendingUp,
  AlertTriangle,
  Flame,
  Award,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  getStoredComplaints,
  executeOfficerAction,
  type Complaint,
} from '@/lib/complaints';
import { formatDate, cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth';

export default function PendingApproval() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [complaints, setComplaints] = useState<Complaint[]>(() => getStoredComplaints());
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [dateRangeFilter, setDateRangeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Action Dialog states
  const [actionType, setActionType] = useState<'approve' | 'reject' | 'escalate' | null>(null);
  const [officerNote, setOfficerNote] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Filter only complaints needing officer review (pending_officer or officer_reviewing)
  const pendingComplaints = useMemo(() => {
    return complaints.filter((c) => {
      const isPending = c.status === 'pending_officer' || c.status === 'officer_reviewing';
      const matchesCategory = categoryFilter === 'all' || c.category === categoryFilter;

      let matchesDate = true;
      if (dateRangeFilter !== 'all') {
        const submittedTime = new Date(c.submitted_at).getTime();
        const now = Date.now();
        if (dateRangeFilter === '24h') {
          matchesDate = now - submittedTime <= 24 * 60 * 60 * 1000;
        } else if (dateRangeFilter === '7d') {
          matchesDate = now - submittedTime <= 7 * 24 * 60 * 60 * 1000;
        } else if (dateRangeFilter === '30d') {
          matchesDate = now - submittedTime <= 30 * 24 * 60 * 60 * 1000;
        }
      }

      const matchesSearch =
        !searchQuery ||
        c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.location.district.toLowerCase().includes(searchQuery.toLowerCase());
      return isPending && matchesCategory && matchesDate && matchesSearch;
    });
  }, [complaints, categoryFilter, dateRangeFilter, searchQuery]);

  const handleActionConfirm = () => {
    if (!selectedComplaint || !actionType) return;
    if (actionType === 'reject' && !officerNote.trim()) {
      toast.error('Rejection reason is mandatory');
      return;
    }

    setIsProcessing(true);
    try {
      const officerName = user?.name || 'Vikram Singh (District Nodal Officer)';
      const officerId = user?.id || 'u-admin';
      const defaultNote =
        actionType === 'approve'
          ? 'Grievance verified on-ground. Sanctioned and dispatched to field execution team.'
          : actionType === 'escalate'
          ? 'Escalated to State Directorate for on-site physical engineering audit.'
          : officerNote.trim();

      const updated = executeOfficerAction(
        selectedComplaint.id,
        actionType,
        officerId,
        officerName,
        officerNote.trim() || defaultNote
      );

      if (updated) {
        setComplaints(getStoredComplaints());
        toast.success(
          actionType === 'approve'
            ? 'Complaint Approved & Forwarded!'
            : actionType === 'reject'
            ? 'Complaint Rejected. Citizen notified.'
            : 'Complaint Escalated to State Directorate.'
        );
        setSelectedComplaint(null);
        setActionType(null);
        setOfficerNote('');
      }
    } catch {
      toast.error('Failed to process action');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/80">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link
              to="/admin"
              className="text-xs font-bold text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Executive Dashboard</span>
            </Link>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-amber-500/15 text-amber-600 flex items-center justify-center">
              <Clock className="h-5 w-5 animate-pulse" />
            </div>
            <span>Nodal Officer Verification Queue</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Official human review queue for complaints scored 40–79 by AI or appealed by citizens requiring physical verification.
          </p>
        </div>

        {/* Officer Personal Stats Widget */}
        <div className="flex items-center gap-4 bg-secondary/50 border border-border/80 p-3.5 rounded-2xl shadow-xs specular-card">
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
              In Review
            </span>
            <span className="text-2xl font-black font-mono text-amber-600 dark:text-amber-400">
              {pendingComplaints.length}
            </span>
          </div>
          <div className="h-8 w-px bg-border/80" />
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
              Avg SLA
            </span>
            <span className="text-2xl font-black font-mono text-primary">
              1.4h
            </span>
          </div>
        </div>
      </div>

      {/* Filter & Search Controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between p-2 rounded-2xl bg-secondary/30 border border-border/70">
        <div className="relative w-full sm:w-80">
          <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
          <Input
            placeholder="Search by Tracking ID, title, district..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 text-xs bg-card"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-muted-foreground flex items-center gap-1">
              <Filter className="h-3.5 w-3.5" /> Category:
            </span>
            <Select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-card text-xs"
              options={[
                { value: 'all', label: 'All Categories' },
                { value: 'roads', label: '🛣️ Roads' },
                { value: 'water', label: '🚰 Water' },
                { value: 'electricity', label: '⚡ Electricity' },
                { value: 'sanitation', label: '🧹 Sanitation' },
                { value: 'corruption', label: '⚖️ Public Scheme' },
              ]}
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-muted-foreground flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" /> Date:
            </span>
            <Select
              value={dateRangeFilter}
              onChange={(e) => setDateRangeFilter(e.target.value)}
              className="bg-card text-xs"
              options={[
                { value: 'all', label: 'All Time' },
                { value: '24h', label: 'Past 24 Hours' },
                { value: '7d', label: 'Past 7 Days' },
                { value: '30d', label: 'Past 30 Days' },
              ]}
            />
          </div>
        </div>
      </div>

      {/* Main Queue & Expanded Detail View */}
      {pendingComplaints.length === 0 ? (
        <Card className="p-12 text-center border-dashed rounded-2xl space-y-3">
          <div className="h-12 w-12 rounded-full bg-emerald-500/10 text-emerald-600 mx-auto flex items-center justify-center">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <h2 className="text-lg font-bold text-foreground">Queue Clear</h2>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            There are currently no complaints awaiting officer verification. All submissions have either been auto-approved or resolved.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Col: Queue List (7 cols) */}
          <div className="lg:col-span-7 space-y-3">
            <span className="text-xs font-semibold text-muted-foreground block">
              Grievance Inspection Queue ({pendingComplaints.length})
            </span>

            {pendingComplaints.map((c) => {
              const isSelected = selectedComplaint?.id === c.id;
              return (
                <Card
                  key={c.id}
                  onClick={() => setSelectedComplaint(c)}
                  className={cn(
                    'p-4 rounded-xl border transition-all cursor-pointer card-hover-lift docket-sheet',
                    isSelected
                      ? 'border-emerald-600 ring-2 ring-emerald-500/30 bg-emerald-500/5 shadow-md'
                      : 'border-border bg-card hover:border-emerald-500/40'
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-black text-primary">
                          {c.id}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-secondary uppercase font-bold text-muted-foreground font-mono">
                          {c.category}
                        </span>
                        {c.appealed && (
                          <span className="docket-stamp docket-stamp-pending text-[9px] py-0.2">
                            CITIZEN APPEAL
                          </span>
                        )}
                      </div>

                      <h3 className="text-sm font-bold text-foreground line-clamp-1">
                        {c.title}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {c.description}
                      </p>

                      <div className="flex items-center gap-3 pt-1 text-[11px] text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-primary" />
                          {c.location.district}
                        </span>
                        <span>•</span>
                        <span>{formatDate(c.submitted_at)}</span>
                      </div>
                    </div>

                    {/* AI Score Badge */}
                    <div className="text-right shrink-0">
                      <span className="text-[10px] text-muted-foreground block">AI Score</span>
                      <span className="font-mono text-sm font-black text-amber-600">
                        {c.ai_score}/100
                      </span>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Right Col: Detail & Action Panel (5 cols) */}
          <div className="lg:col-span-5">
            {selectedComplaint ? (
              <Card className="p-6 rounded-2xl border-border bg-card shadow-md space-y-5 sticky top-24">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                      Case Inspector
                    </span>
                    <span className="font-mono text-sm font-black text-primary">
                      {selectedComplaint.id}
                    </span>
                  </div>
                  <Link
                    to={`/track/${selectedComplaint.id}`}
                    target="_blank"
                    className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                  >
                    <span>Public View</span>
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>

                {/* Evidence Photo */}
                {selectedComplaint.media.length > 0 && (
                  <div className="h-44 w-full rounded-xl overflow-hidden border border-border bg-secondary">
                    <img
                      src={selectedComplaint.media[0]}
                      alt="Complaint evidence"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* AI Flag Chips */}
                <div className="space-y-1.5">
                  <span className="text-xs font-semibold text-foreground">AI Flags & Detection Signals:</span>
                  <div className="flex flex-wrap gap-1">
                    {selectedComplaint.ai_flags.map((flag, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-2 py-0.5 rounded bg-secondary border border-border text-foreground font-mono"
                      >
                        #{flag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Location Details */}
                <div className="p-3 rounded-xl bg-secondary/30 border border-border/60 text-xs space-y-1">
                  <span className="font-semibold text-foreground flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-primary" />
                    {selectedComplaint.location.address}
                  </span>
                  <span className="text-[11px] text-muted-foreground block font-mono">
                    Jurisdiction: {selectedComplaint.location.district} (GPS: {selectedComplaint.location.lat.toFixed(4)}, {selectedComplaint.location.lng.toFixed(4)})
                  </span>
                </div>

                {/* Submitter Info */}
                <div className="text-xs text-muted-foreground space-y-0.5">
                  <span>Submitter: <strong className="text-foreground">{selectedComplaint.citizen_name}</strong></span>
                  <span className="block">Email: {selectedComplaint.citizen_email}</span>
                </div>

                {/* 3 Actions: Approve, Reject, Escalate */}
                <div className="pt-2 space-y-2 border-t border-border">
                  <span className="text-xs font-bold text-foreground block">
                    Nodal Officer Determination:
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      size="sm"
                      onClick={() => setActionType('approve')}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold gap-1"
                    >
                      <Check className="h-3.5 w-3.5" />
                      <span>Approve</span>
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setActionType('reject')}
                      className="border-rose-500/40 text-rose-600 hover:bg-rose-500/10 text-xs font-bold gap-1"
                    >
                      <X className="h-3.5 w-3.5" />
                      <span>Reject</span>
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setActionType('escalate')}
                      className="border-primary/40 text-primary hover:bg-primary/10 text-xs font-bold gap-1"
                    >
                      <TrendingUp className="h-3.5 w-3.5" />
                      <span>Escalate</span>
                    </Button>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="p-8 text-center border-dashed rounded-2xl text-xs text-muted-foreground">
                Select a grievance from the queue to inspect photo evidence, location coordinates, and issue officer determination.
              </Card>
            )}
          </div>
        </div>
      )}

      {/* Officer Determination Modal */}
      <Dialog open={!!actionType} onOpenChange={(open) => !open && setActionType(null)}>
        <DialogContent className="max-w-md p-6 rounded-2xl">
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-lg font-bold text-foreground">
              {actionType === 'approve' && 'Approve & Dispatch Grievance'}
              {actionType === 'reject' && 'Reject Complaint (Reason Mandatory)'}
              {actionType === 'escalate' && 'Escalate to State Directorate'}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              {actionType === 'approve' && 'This overrides the automated flag, marks the complaint In Progress, and notifies the citizen.'}
              {actionType === 'reject' && 'Enter the official reason for rejection. This note will appear on the citizen public tracker.'}
              {actionType === 'escalate' && 'Flags this grievance for physical on-site engineering audit by the State Directorate.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 py-2">
            <label className="text-xs font-semibold text-foreground">
              {actionType === 'reject' ? 'Rejection Reason (Required)' : 'Officer Field Note (Optional)'}
            </label>
            <Textarea
              placeholder={
                actionType === 'reject'
                  ? 'Explain why this report was rejected (e.g. Jurisdiction belongs to NHAI, or invalid landmark)...'
                  : 'Enter inspection notes, contractor assignment, or work order details...'
              }
              value={officerNote}
              onChange={(e) => setOfficerNote(e.target.value)}
              rows={4}
              className="resize-none text-xs"
              required={actionType === 'reject'}
            />
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setActionType(null)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={isProcessing}
              onClick={handleActionConfirm}
              className={cn(
                'text-xs font-bold',
                actionType === 'approve'
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : actionType === 'reject'
                  ? 'bg-rose-600 hover:bg-rose-700 text-white'
                  : 'bg-primary hover:bg-primary-hover text-primary-foreground'
              )}
            >
              {isProcessing ? 'Processing...' : 'Confirm Determination'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
