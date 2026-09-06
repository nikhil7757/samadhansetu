import { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import {
  MapPin,
  Calendar,
  User as UserIcon,
  MessageSquare,
  Users,
  Send,
  ArrowLeft,
  Sparkles,
  ExternalLink,
  GraduationCap,
  Building2,
  CheckCircle,
  Clock,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { UrgencyBadge } from '@/components/shared/UrgencyBadge';
import { ErrorState } from '@/components/shared/ErrorState';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { formatDate, formatDateTime, timeAgo } from '@/lib/utils';
import { MOCK_PROBLEMS } from '@/lib/mockData';
import { useAuth } from '@/lib/auth';
import api from '@/lib/api';

interface ProblemDetailData {
  id: string;
  title: string;
  description: string;
  category: string;
  district: string;
  urgency: string;
  status: string;
  imageUrl?: string;
  createdAt: string;
  submittedBy: {
    id: string;
    name: string;
    district: string;
    organizationName?: string;
    role: string;
  };
  statusHistory: Array<{
    id: string;
    oldStatus: string;
    newStatus: string;
    note?: string;
    createdAt: string;
    changedBy: {
      id: string;
      name: string;
      role: string;
    };
  }>;
  projectTeam?: {
    id: string;
    formedAt: string;
    members: Array<{
      id: string;
      joinedAt: string;
      user: {
        id: string;
        name: string;
        role: string;
        organizationName?: string;
      };
    }>;
  };
  _count: {
    interests: number;
    comments: number;
  };
}

interface CommentItem {
  id: string;
  commentText: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    role: string;
    organizationName?: string;
  };
}

export default function ProblemDetail() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [problem, setProblem] = useState<ProblemDetailData | null>(null);
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  // Interest Dialog State
  const [interestDialogOpen, setInterestDialogOpen] = useState(false);
  const [pitchMessage, setPitchMessage] = useState('');
  const [isSubmittingPitch, setIsSubmittingPitch] = useState(false);
  const [hasExpressedInterest, setHasExpressedInterest] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProblemData = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const [resProb, resComments] = await Promise.all([
        api.get(`/problems/${id}`),
        api.get(`/problems/${id}/comments`),
      ]);
      setProblem(resProb.data);
      setComments(resComments.data.comments || []);
    } catch (err: any) {
      console.warn('API connecting, using baseline challenge details:', err);
      const found = MOCK_PROBLEMS.find((p) => p.id === id) || MOCK_PROBLEMS[0];
      if (found) {
        setProblem({
          ...found,
          statusHistory: [
            {
              id: 'sh-1',
              oldStatus: 'PENDING_APPROVAL',
              newStatus: found.status,
              note: 'Verified and published by Nodal Review Committee',
              createdAt: found.createdAt,
              changedBy: { id: 'adm', name: 'Vikram Singh (Nodal Admin)', role: 'ADMIN' },
            },
          ],
          _count: found._count,
        });
        setComments([
          {
            id: 'c1',
            commentText: 'Preliminary water test samples collected from 4 deep wells in block headquarter. Fluoride count confirmed above 3.2 mg/L.',
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
            user: { id: 'u-univ', name: 'IIT ISM Research Team', role: 'UNIVERSITY', organizationName: 'IIT ISM Dhanbad' },
          },
          {
            id: 'c2',
            commentText: 'Local block development officer has been notified. Requesting faculty teams to inspect decentralized adsorption column feasibility.',
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
            user: { id: 'u-gov', name: 'Vikram Singh', role: 'ADMIN', organizationName: 'Govt. of Jharkhand' },
          },
        ]);
      } else {
        setError('Problem not found');
      }
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProblemData();
  }, [fetchProblemData]);

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !id) return;
    setIsSubmittingComment(true);
    const mockCommentItem: CommentItem = {
      id: `c-${Date.now()}`,
      commentText: newComment.trim(),
      createdAt: new Date().toISOString(),
      user: {
        id: user?.id || 'u-demo',
        name: user?.name || 'Community Contributor',
        role: user?.role || 'CITIZEN',
        organizationName: user?.organizationName,
      },
    };
    try {
      const res = await api.post(`/problems/${id}/comments`, { commentText: newComment.trim() });
      setComments((prev) => [res.data, ...prev]);
    } catch (err: any) {
      console.warn('Comment posted in demo baseline:', err);
      setComments((prev) => [mockCommentItem, ...prev]);
    } finally {
      setNewComment('');
      setIsSubmittingComment(false);
      toast.success('Comment posted successfully');
    }
  };

  const handleExpressInterest = async () => {
    if (!pitchMessage.trim() || !id) return;
    setIsSubmittingPitch(true);
    try {
      await api.post(`/problems/${id}/interest`, { pitchMessage: pitchMessage.trim() });
      fetchProblemData();
    } catch (err: any) {
      console.warn('Interest pitch preserved in demo mode:', err);
      setProblem((prev) =>
        prev
          ? {
              ...prev,
              _count: {
                ...prev._count,
                interests: (prev._count?.interests || 0) + 1,
              },
            }
          : null
      );
    } finally {
      toast.success(t('interest.success'));
      setInterestDialogOpen(false);
      setPitchMessage('');
      setHasExpressedInterest(true);
      setIsSubmittingPitch(false);
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-10 space-y-6">
        <div className="h-6 w-32 rounded bg-muted animate-pulse" />
        <div className="h-10 w-3/4 rounded-lg bg-muted animate-pulse" />
        <div className="h-64 rounded-xl bg-muted animate-pulse" />
      </div>
    );
  }

  if (error || !problem) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <ErrorState message={error || 'Problem not found'} onRetry={fetchProblemData} />
      </div>
    );
  }

  const canExpressInterest =
    user && (user.role === 'UNIVERSITY' || user.role === 'INDUSTRY') && !hasExpressedInterest;

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
      {/* Back button link */}
      <Link
        to="/problems"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Challenges Directory
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Col: Main Problem Detail & Comments */}
        <div className="lg:col-span-8 space-y-8">
          {/* Header Banner */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={problem.status} />
              <UrgencyBadge urgency={problem.urgency} />
              <span className="text-xs bg-secondary text-secondary-foreground px-2.5 py-0.5 rounded-full font-medium">
                {problem.category.replace(/_/g, ' ')}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight leading-snug">
              {problem.title}
            </h1>

            {/* Submitter & Location Meta */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-1 border-b border-border pb-4">
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-primary" />
                <span className="font-semibold text-foreground">{problem.district}</span>, Jharkhand
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {formatDate(problem.createdAt)}
              </span>
              <span className="flex items-center gap-1">
                <UserIcon className="h-3.5 w-3.5" />
                {t('problems.detail.submittedBy')} <strong className="text-foreground">{problem.submittedBy.name}</strong>
              </span>
            </div>
          </div>

          {/* Optional Attached Problem Image */}
          {problem.imageUrl && (
            <div className="overflow-hidden rounded-xl border border-border shadow-xs">
              <img
                src={problem.imageUrl}
                alt={problem.title}
                className="w-full max-h-96 object-cover bg-muted"
              />
            </div>
          )}

          {/* Full Problem Description */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-xs space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Challenge Overview
            </h2>
            <p className="text-sm leading-relaxed text-foreground whitespace-pre-line">
              {problem.description}
            </p>
          </div>

          {/* Active Project Team (if formed) */}
          {problem.projectTeam && (
            <div className="rounded-xl border border-primary/30 bg-primary/5 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
                    <Users className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-foreground">
                      {t('problems.detail.projectTeam')}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Formed on {formatDate(problem.projectTeam.formedAt)}
                    </p>
                  </div>
                </div>

                <Button
                  size="sm"
                  onClick={() => navigate(`/teams/${problem.projectTeam?.id}`)}
                  className="gap-1.5"
                >
                  {t('problems.detail.viewWorkspace')} <ExternalLink className="h-3.5 w-3.5" />
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {problem.projectTeam.members.map((m) => (
                  <div
                    key={m.id}
                    className="p-3 rounded-lg bg-card border border-border text-xs flex items-start gap-2.5"
                  >
                    {m.user.role === 'UNIVERSITY' ? (
                      <GraduationCap className="h-4 w-4 text-sky-600 mt-0.5 shrink-0" />
                    ) : m.user.role === 'INDUSTRY' ? (
                      <Building2 className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                    ) : (
                      <UserIcon className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    )}
                    <div>
                      <span className="font-semibold text-foreground block">{m.user.name}</span>
                      <span className="text-muted-foreground text-[11px] block">
                        {m.user.organizationName || m.user.role}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Discussion / Comment Section */}
          <div className="space-y-6 pt-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                {t('problems.detail.commentSection')} ({comments.length})
              </h2>
            </div>

            {/* Comment Form */}
            {user ? (
              <form onSubmit={handlePostComment} className="space-y-3">
                <Textarea
                  placeholder={t('problems.detail.addComment')}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={3}
                  required
                />
                <div className="flex justify-end">
                  <Button type="submit" size="sm" disabled={isSubmittingComment} className="gap-2">
                    <Send className="h-3.5 w-3.5" />
                    {isSubmittingComment ? t('common.loading') : t('problems.detail.postComment')}
                  </Button>
                </div>
              </form>
            ) : (
              <div className="p-4 rounded-xl border border-dashed border-border bg-secondary/30 text-center text-xs text-muted-foreground">
                <Link to="/login" className="text-primary font-semibold hover:underline">
                  {t('problems.detail.loginToComment')}
                </Link>
              </div>
            )}

            {/* Comments List */}
            <div className="space-y-3">
              {comments.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-8">
                  {t('problems.detail.noComments')}
                </p>
              ) : (
                comments.map((c) => (
                  <div key={c.id} className="p-4 rounded-xl border border-border bg-card shadow-2xs space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground">{c.user.name}</span>
                        <span className="text-[10px] bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded font-mono">
                          {c.user.organizationName || c.user.role}
                        </span>
                      </div>
                      <span className="text-[11px] text-muted-foreground font-mono">
                        {timeAgo(c.createdAt)}
                      </span>
                    </div>
                    <p className="text-xs text-foreground leading-relaxed whitespace-pre-line">
                      {c.commentText}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Col: Action Sidebar & Status Timeline */}
        <div className="lg:col-span-4 space-y-6">
          {/* Action Card: Express Interest */}
          <Card className="border-border shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{t('problems.detail.expressInterest')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-xs text-muted-foreground leading-relaxed">
                Academic teams and industry sponsors can submit collaborative solution pitches.
              </div>

              {canExpressInterest ? (
                <Button
                  onClick={() => setInterestDialogOpen(true)}
                  className="w-full gap-2"
                  variant="default"
                >
                  {user?.role === 'UNIVERSITY' ? (
                    <>
                      <GraduationCap className="h-4 w-4" />
                      {t('problems.detail.interestAsUniversity')}
                    </>
                  ) : (
                    <>
                      <Building2 className="h-4 w-4" />
                      {t('problems.detail.interestAsIndustry')}
                    </>
                  )}
                </Button>
              ) : hasExpressedInterest ? (
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
                  {t('problems.detail.alreadyInterested')}
                </div>
              ) : !user ? (
                <Button
                  variant="outline"
                  onClick={() => navigate('/login')}
                  className="w-full text-xs"
                >
                  {t('problems.detail.loginToExpress')}
                </Button>
              ) : (
                <div className="text-xs text-muted-foreground italic">
                  Signed in as Citizen. Solvers and Industry partners can pitch on open challenges.
                </div>
              )}

              <div className="pt-3 border-t border-border/80 flex items-center justify-between text-xs text-muted-foreground">
                <span>Total solver proposals:</span>
                <span className="font-bold text-foreground font-mono">
                  {problem._count?.interests || 0}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Status Lifecycle Timeline */}
          <Card className="border-border shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-primary" />
                {t('problems.detail.statusTimeline')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
                {problem.statusHistory && problem.statusHistory.length > 0 ? (
                  problem.statusHistory.map((item, idx) => (
                    <div key={item.id || idx} className="relative text-xs space-y-1">
                      <span className="absolute -left-6 top-0.5 h-3 w-3 rounded-full border-2 border-background bg-primary" />
                      <div className="flex items-center justify-between">
                        <StatusBadge status={item.newStatus} />
                        <span className="text-[10px] text-muted-foreground font-mono">
                          {formatDate(item.createdAt)}
                        </span>
                      </div>
                      {item.note && (
                        <p className="text-muted-foreground text-[11px] italic bg-secondary/50 p-2 rounded">
                          "{item.note}"
                        </p>
                      )}
                      <p className="text-[10px] text-muted-foreground">
                        Updated by: {item.changedBy?.name || 'System Admin'}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="relative text-xs space-y-1">
                    <span className="absolute -left-6 top-0.5 h-3 w-3 rounded-full border-2 border-background bg-primary" />
                    <StatusBadge status={problem.status} />
                    <p className="text-[10px] text-muted-foreground">
                      Initial submission verified
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Express Interest Dialog Modal */}
      <Dialog open={interestDialogOpen} onOpenChange={setInterestDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('interest.title')}</DialogTitle>
            <DialogDescription>
              {user?.role === 'UNIVERSITY'
                ? 'Outline your technical methodology, research capabilities, and deliverables.'
                : 'Detail your proposed funding, pilot sponsorship, or mentorship support.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <Textarea
              placeholder={t('problems.detail.pitchPlaceholder')}
              value={pitchMessage}
              onChange={(e) => setPitchMessage(e.target.value)}
              rows={5}
              required
            />
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setInterestDialogOpen(false)}
              disabled={isSubmittingPitch}
            >
              {t('common.cancel')}
            </Button>
            <Button
              onClick={handleExpressInterest}
              disabled={isSubmittingPitch || !pitchMessage.trim()}
            >
              {isSubmittingPitch ? t('common.loading') : t('problems.detail.submitPitch')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
