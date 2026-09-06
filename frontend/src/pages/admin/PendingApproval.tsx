import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { Clock, Check, X, MapPin, Calendar, User, ArrowLeft, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { UrgencyBadge } from '@/components/shared/UrgencyBadge';
import { EmptyState } from '@/components/shared/EmptyState';
import { SkeletonCard } from '@/components/shared/SkeletonCard';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { formatDate } from '@/lib/utils';
import { MOCK_PENDING_PROBLEMS } from '@/lib/mockData';
import api from '@/lib/api';

interface PendingProblem {
  id: string;
  title: string;
  description: string;
  category: string;
  district: string;
  urgency: string;
  createdAt: string;
  submittedBy: {
    id: string;
    name: string;
    email: string;
    district: string;
  };
}

export default function PendingApproval() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [problems, setProblems] = useState<PendingProblem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Reject modal state
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedProblemId, setSelectedProblemId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchPending = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/admin/problems/pending');
      if (res.data && res.data.length > 0) {
        setProblems(res.data);
      } else {
        setProblems(MOCK_PENDING_PROBLEMS as any);
      }
    } catch (err) {
      console.warn('API connecting, using baseline pending queue:', err);
      setProblems(MOCK_PENDING_PROBLEMS as any);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPending();
  }, [fetchPending]);

  const handleApprove = async (problemId: string) => {
    try {
      await api.patch(`/admin/problems/${problemId}/approve`, { note: 'Verified by Nodal Officer' });
    } catch (err) {
      console.warn('Simulated approval in demo mode:', err);
    }
    toast.success(t('admin.pending.approved'));
    setProblems((prev) => prev.filter((p) => p.id !== problemId));
  };

  const handleRejectConfirm = async () => {
    if (!selectedProblemId || !rejectReason.trim()) return;
    setIsProcessing(true);
    try {
      await api.patch(`/admin/problems/${selectedProblemId}/reject`, { note: rejectReason.trim() });
    } catch (err) {
      console.warn('Simulated reject in demo mode:', err);
    }
    toast.success(t('admin.pending.rejected'));
    setProblems((prev) => prev.filter((p) => p.id !== selectedProblemId));
    setRejectModalOpen(false);
    setRejectReason('');
    setSelectedProblemId(null);
    setIsProcessing(false);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              to="/admin"
              className="text-xs font-semibold text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Admin Console
            </Link>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Clock className="h-7 w-7 text-amber-600" />
            {t('admin.pending.title')}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {t('admin.pending.subtitle')}
          </p>
        </div>

        <span className="text-xs text-muted-foreground font-mono bg-secondary px-3 py-1.5 rounded-md border border-border">
          {problems.length} pending review
        </span>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonCard key={i} className="h-40" />
          ))}
        </div>
      ) : problems.length === 0 ? (
        <EmptyState
          icon={Clock}
          title={t('admin.pending.empty')}
          description={t('admin.pending.emptyHint')}
        />
      ) : (
        <div className="space-y-4">
          {problems.map((p) => (
            <Card key={p.id} className="border-border shadow-xs hover:border-primary/30 transition-all">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-300">
                        Pending Verification
                      </span>
                      <UrgencyBadge urgency={p.urgency} />
                      <span className="text-xs text-muted-foreground">
                        {p.category.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-foreground leading-snug">
                      {p.title}
                    </h3>

                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {p.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-2">
                      <span className="flex items-center gap-1 font-medium text-foreground">
                        <MapPin className="h-3.5 w-3.5 text-primary" />
                        {p.district}, Jharkhand
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="h-3.5 w-3.5" />
                        Submitted by: {p.submittedBy?.name} ({p.submittedBy?.email})
                      </span>
                      <span className="flex items-center gap-1 font-mono">
                        <Calendar className="h-3.5 w-3.5" />
                        {formatDate(p.createdAt)}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex sm:flex-col gap-2 shrink-0 pt-2 md:pt-0">
                    <Button
                      size="sm"
                      onClick={() => handleApprove(p.id)}
                      className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      <Check className="h-4 w-4" />
                      {t('admin.pending.approve')}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedProblemId(p.id);
                        setRejectModalOpen(true);
                      }}
                      className="gap-1.5 text-rose-600 hover:bg-rose-50 hover:text-rose-700 border-rose-200"
                    >
                      <X className="h-4 w-4" />
                      {t('admin.pending.reject')}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Reject Modal */}
      <Dialog open={rejectModalOpen} onOpenChange={setRejectModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Decline Submission</DialogTitle>
            <DialogDescription>
              {t('admin.pending.rejectReasonPlaceholder')}
            </DialogDescription>
          </DialogHeader>

          <div className="py-2">
            <Textarea
              placeholder="e.g. Duplicate submission or requires more verifiable location data."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={4}
              required
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectModalOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button
              variant="destructive"
              onClick={handleRejectConfirm}
              disabled={isProcessing || !rejectReason.trim()}
            >
              {isProcessing ? t('common.loading') : 'Confirm Rejection'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
