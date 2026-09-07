import { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import {
  PlusCircle,
  Layers,
  MapPin,
  Calendar,
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  ArrowRight,
  Filter,
  Sparkles,
  Inbox,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { EmptyState } from '@/components/shared/EmptyState';
import { getStoredComplaints, type Complaint, type ComplaintStatus } from '@/lib/complaints';
import { formatDate, cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth';

export default function MySubmissions() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateSort, setDateSort] = useState<'newest' | 'oldest'>('newest');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [complaints] = useState<Complaint[]>(() => {
    const all = getStoredComplaints();
    // If logged in citizen has specific complaints or priya.kumar
    if (user?.id) {
      const userComplaints = all.filter(
        (c) =>
          c.citizen_id === user.id ||
          (user.email && c.citizen_email?.toLowerCase() === user.email.toLowerCase())
      );
      if (userComplaints.length > 0) return userComplaints;
    }
    // Default fallback to first 4 complaints for demo
    return all.slice(0, 4);
  });

  const filteredComplaints = useMemo(() => {
    const list = complaints.filter((c) => {
      const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
      const matchesSearch =
        !searchQuery ||
        c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.location.district.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });

    return list.sort((a, b) => {
      const timeA = new Date(a.submitted_at).getTime();
      const timeB = new Date(b.submitted_at).getTime();
      return dateSort === 'newest' ? timeB - timeA : timeA - timeB;
    });
  }, [complaints, statusFilter, dateSort, searchQuery]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/80">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-2 border border-primary/20 shadow-2xs">
            <Layers className="h-3.5 w-3.5" />
            <span>Citizen Redressal Workspace</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
            My Submissions & Grievances
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-2xl">
            Track all civic grievances reported across Jharkhand with automated AI scores and nodal verification steps.
          </p>
        </div>

        <Button
          onClick={() => navigate('/report')}
          className="gap-2 bg-accent hover:bg-accent-hover text-accent-foreground font-extrabold shadow-md hover:shadow-lg transition-all"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Report New Problem</span>
        </Button>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl border border-border/80 bg-card shadow-xs specular-card">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">Total Filed</span>
          <span className="text-2xl font-black font-mono text-foreground">{complaints.length}</span>
        </div>
        <div className="p-4 rounded-2xl border border-sky-500/30 bg-sky-500/5 shadow-xs specular-card">
          <span className="text-[11px] font-bold text-sky-700 dark:text-sky-400 uppercase tracking-wider block">In Progress</span>
          <span className="text-2xl font-black font-mono text-sky-600 dark:text-sky-400">
            {complaints.filter((c) => c.status === 'verified_in_progress' || c.status === 'pending_officer' || c.status === 'officer_reviewing').length}
          </span>
        </div>
        <div className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 shadow-xs specular-card">
          <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block">Resolved</span>
          <span className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
            {complaints.filter((c) => c.status === 'resolved').length}
          </span>
        </div>
      </div>

      {/* Filter & Search Bar */}
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
            <span className="text-xs font-bold text-muted-foreground shrink-0 flex items-center gap-1">
              <Filter className="h-3.5 w-3.5" /> Status:
            </span>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-card text-xs"
              options={[
                { value: 'all', label: 'All Statuses' },
                { value: 'resolved', label: '🟢 Resolved' },
                { value: 'verified_in_progress', label: '🔵 In Progress' },
                { value: 'pending_officer', label: '🟡 Pending Officer' },
                { value: 'auto_approved', label: '🟢 Auto-Approved' },
                { value: 'auto_rejected', label: '🔴 Auto-Rejected' },
              ]}
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-muted-foreground shrink-0 flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" /> Sort:
            </span>
            <Select
              value={dateSort}
              onChange={(e) => setDateSort(e.target.value as 'newest' | 'oldest')}
              className="bg-card text-xs"
              options={[
                { value: 'newest', label: '📅 Newest First' },
                { value: 'oldest', label: '📅 Oldest First' },
              ]}
            />
          </div>
        </div>
      </div>

      {/* Complaints List */}
      {filteredComplaints.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title="No Complaints Found"
          description="You have not submitted any complaints matching this filter. Report a new grievance to initiate automated AI verification."
          action={{
            label: 'Report Your First Problem',
            onClick: () => navigate('/report'),
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredComplaints.map((c) => (
            <Card
              key={c.id}
              onClick={() => navigate(`/track/${c.id}`)}
              className="docket-sheet rounded-2xl overflow-hidden card-hover-lift cursor-pointer flex flex-col justify-between border border-border shadow-sm hover:shadow-xl transition-all group"
            >
              <div>
                {/* Photo & Badge Header */}
                <div className="relative h-44 w-full bg-secondary overflow-hidden">
                  <img
                    src={c.media[0] || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80'}
                    alt={c.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-md bg-black/80 backdrop-blur-xs text-white text-[11px] font-mono font-bold">
                    {c.id}
                  </div>

                  {/* Official Ink-style Status Badge */}
                  <div
                    className={cn(
                      'absolute top-3 right-3 docket-stamp text-[10px] py-0.5 shadow-md',
                      c.status === 'resolved'
                        ? 'docket-stamp-verified bg-emerald-950/90 text-emerald-200 border-emerald-400'
                        : c.status === 'verified_in_progress'
                        ? 'docket-stamp-action bg-sky-950/90 text-sky-200 border-sky-400'
                        : c.status === 'pending_officer' || c.status === 'officer_reviewing'
                        ? 'docket-stamp-pending bg-amber-950/90 text-amber-200 border-amber-400'
                        : c.status === 'auto_approved'
                        ? 'docket-stamp-verified bg-emerald-950/90 text-emerald-200 border-emerald-400'
                        : 'docket-stamp-action bg-rose-950/90 text-rose-200 border-rose-400'
                    )}
                  >
                    <span>{c.status.replace(/_/g, ' ')}</span>
                  </div>
                </div>

                <CardContent className="p-5 space-y-3">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-primary" />
                      {c.location.district}
                    </span>
                    <span className="font-mono text-[11px]">
                      Score: <strong className="text-foreground">{c.ai_score}/100</strong>
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-foreground line-clamp-2 leading-snug">
                    {c.title}
                  </h3>

                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {c.description}
                  </p>
                </CardContent>
              </div>

              <div className="px-5 py-3 border-t border-border/60 bg-secondary/15 flex items-center justify-between text-xs">
                <span className="text-muted-foreground font-mono text-[11px]">
                  {formatDate(c.submitted_at)}
                </span>
                <span className="text-primary font-bold">
                  Track Status
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
