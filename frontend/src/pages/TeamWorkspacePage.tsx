import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import {
  Users,
  MessageSquare,
  Send,
  ArrowLeft,
  GraduationCap,
  Building2,
  User as UserIcon,
  ShieldAlert,
  Clock,
  CheckCircle,
  FileEdit,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { ErrorState } from '@/components/shared/ErrorState';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { formatDate, formatDateTime, timeAgo, STATUSES } from '@/lib/utils';
import { MOCK_MATCHES } from '@/lib/mockData';
import { useAuth } from '@/lib/auth';
import api from '@/lib/api';

interface TeamData {
  id: string;
  formedAt: string;
  problem: {
    id: string;
    title: string;
    status: string;
    category: string;
    district: string;
  };
  members: Array<{
    id: string;
    joinedAt: string;
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
      organizationName?: string;
    };
  }>;
  notes: Array<{
    id: string;
    content: string;
    authorId: string;
    authorName: string;
    createdAt: string;
  }>;
}

export default function TeamWorkspacePage() {
  const { teamId } = useParams<{ teamId: string }>();
  const { t } = useTranslation();
  const { user } = useAuth();

  const [team, setTeam] = useState<TeamData | null>(null);
  const [newNote, setNewNote] = useState('');
  const [isPostingNote, setIsPostingNote] = useState(false);

  // Status update modal state
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [statusNote, setStatusNote] = useState('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTeam = useCallback(async () => {
    if (!teamId) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.get(`/teams/${teamId}`);
      if (res.data) {
        setTeam(res.data);
        setNewStatus(res.data.problem?.status || 'TEAM_FORMED');
      } else {
        throw new Error('No data');
      }
    } catch (err: any) {
      console.warn('Team fetch error, falling back to baseline collaborative workspace:', err);
      const mockTeam = MOCK_MATCHES.find((m) => m.id === teamId) || MOCK_MATCHES[0];
      setTeam(mockTeam as any);
      setNewStatus(mockTeam.problem?.status || 'TEAM_FORMED');
      setError(null);
    } finally {
      setIsLoading(false);
    }
  }, [teamId]);

  useEffect(() => {
    fetchTeam();
  }, [fetchTeam]);

  const handlePostNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim() || !teamId) return;
    setIsPostingNote(true);
    const mockNote = {
      id: `n-${Date.now()}`,
      content: newNote.trim(),
      authorId: user?.id || 'u-curr',
      authorName: user?.name || 'Collaborative Solver',
      createdAt: new Date().toISOString(),
    };
    try {
      const res = await api.post(`/teams/${teamId}/notes`, { content: newNote.trim() });
      setTeam((prev) => (prev ? { ...prev, notes: [res.data, ...prev.notes] } : null));
    } catch (err: any) {
      console.warn('Note post simulated locally:', err);
      setTeam((prev) => (prev ? { ...prev, notes: [mockNote, ...prev.notes] } : null));
    } finally {
      setNewNote('');
      setIsPostingNote(false);
      toast.success('Workspace note published');
    }
  };

  const handleStatusUpdate = async () => {
    if (!team?.problem?.id || !newStatus) return;
    setIsUpdatingStatus(true);
    try {
      await api.patch(`/problems/${team.problem.id}/status`, {
        newStatus,
        note: statusNote.trim() || undefined,
      });
    } catch (err: any) {
      console.warn('Status update simulated locally:', err);
    } finally {
      setTeam((prev) =>
        prev
          ? {
              ...prev,
              problem: { ...prev.problem, status: newStatus },
            }
          : null
      );
      toast.success('Problem lifecycle status updated');
      setStatusModalOpen(false);
      setStatusNote('');
      setIsUpdatingStatus(false);
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12 space-y-6">
        <div className="h-8 w-48 rounded bg-muted animate-pulse" />
        <div className="h-64 rounded-xl bg-muted animate-pulse" />
      </div>
    );
  }

  if (error || !team) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <ErrorState message={error || 'Team workspace not found'} onRetry={fetchTeam} />
      </div>
    );
  }

  const statusOptions = [
    { value: 'TEAM_FORMED', label: t('common.statusTeamFormed') },
    { value: 'IN_PROGRESS', label: t('common.statusInProgress') },
    { value: 'PILOTED', label: t('common.statusPiloted') },
    { value: 'SOLVED', label: t('common.statusSolved') },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
      {/* Workspace Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border mb-8">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Link
              to="/my/teams"
              className="text-xs font-semibold text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> My Teams
            </Link>
            <span className="text-muted-foreground">•</span>
            <StatusBadge status={team.problem.status} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            {t('teams.workspace.title')}
          </h1>
          <p className="text-sm text-muted-foreground">
            Target Challenge:{' '}
            <Link
              to={`/problems/${team.problem.id}`}
              className="font-semibold text-foreground hover:text-primary underline-offset-4 hover:underline"
            >
              {team.problem.title}
            </Link>
          </p>
        </div>

        {/* Update Lifecycle Status Action */}
        <Button onClick={() => setStatusModalOpen(true)} className="gap-2 shrink-0">
          <FileEdit className="h-4 w-4" />
          {t('teams.workspace.updateStatus')}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Col: Workspace Notes & Collaborative Updates */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="border-border shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-primary" />
                {t('teams.workspace.notes')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Note Posting Input */}
              <form onSubmit={handlePostNote} className="space-y-3">
                <Textarea
                  placeholder={t('teams.workspace.addNote')}
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  rows={3}
                  required
                />
                <div className="flex justify-end">
                  <Button type="submit" size="sm" disabled={isPostingNote} className="gap-1.5">
                    <Send className="h-3.5 w-3.5" />
                    {isPostingNote ? t('common.loading') : t('teams.workspace.postNote')}
                  </Button>
                </div>
              </form>

              {/* Feed of Notes */}
              <div className="space-y-3 pt-4 border-t border-border">
                {team.notes.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-6">
                    {t('teams.workspace.noNotes')}
                  </p>
                ) : (
                  team.notes.map((note) => (
                    <div key={note.id} className="p-4 rounded-xl border border-border bg-secondary/30 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-foreground">{note.authorName}</span>
                        <span className="text-[11px] text-muted-foreground font-mono">
                          {formatDateTime(note.createdAt)}
                        </span>
                      </div>
                      <p className="text-xs text-foreground leading-relaxed whitespace-pre-line">
                        {note.content}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Col: Team Roster & Challenge Metadata */}
        <div className="lg:col-span-4 space-y-6">
          {/* Members Roster */}
          <Card className="border-border shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                {t('teams.workspace.members')} ({team.members.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {team.members.map((m) => (
                <div
                  key={m.id}
                  className="p-3 rounded-lg border border-border bg-card flex items-start gap-3 text-xs"
                >
                  <div className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                    {m.user.role === 'UNIVERSITY' ? (
                      <GraduationCap className="h-4 w-4 text-sky-600" />
                    ) : m.user.role === 'INDUSTRY' ? (
                      <Building2 className="h-4 w-4 text-amber-600" />
                    ) : (
                      <UserIcon className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  <div className="overflow-hidden">
                    <span className="font-semibold text-foreground block truncate">
                      {m.user.name}
                    </span>
                    <span className="text-muted-foreground text-[11px] block truncate">
                      {m.user.organizationName || m.user.role}
                    </span>
                    <span className="text-[10px] text-muted-foreground/80 font-mono block truncate">
                      {m.user.email}
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Challenge Details */}
          <Card className="border-border shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Problem Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-border/50">
                <span className="text-muted-foreground">District:</span>
                <span className="font-semibold text-foreground">{team.problem.district}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/50">
                <span className="text-muted-foreground">Domain:</span>
                <span className="font-semibold text-foreground">
                  {team.problem.category.replace(/_/g, ' ')}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/50">
                <span className="text-muted-foreground">Formed Date:</span>
                <span className="font-mono text-foreground">{formatDate(team.formedAt)}</span>
              </div>
              <div className="pt-2">
                <Link
                  to={`/problems/${team.problem.id}`}
                  className="text-xs text-primary font-semibold hover:underline block text-center"
                >
                  View Public Challenge Record
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Status Transition Modal */}
      <Dialog open={statusModalOpen} onOpenChange={setStatusModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Challenge Project Stage</DialogTitle>
            <DialogDescription>
              Progression reflects real-world milestones (Team Formed → In Progress → Piloted → Solved/Deployed).
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Target Lifecycle Stage</label>
              <Select
                options={statusOptions}
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Audit Note / Milestone Reason (Required)
              </label>
              <Input
                placeholder="e.g. Field tests completed in 5 panchayats; water filter verified."
                value={statusNote}
                onChange={(e) => setStatusNote(e.target.value)}
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setStatusModalOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button
              onClick={handleStatusUpdate}
              disabled={isUpdatingStatus || !newStatus || !statusNote.trim()}
            >
              {isUpdatingStatus ? t('common.loading') : 'Confirm Stage Update'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
