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
    return complaints.filter((c) => {
      const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
      const matchesSearch =
        !searchQuery ||
        c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.location.district.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [complaints, statusFilter, searchQuery]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-2">
            <Layers className="h-3.5 w-3.5" />
            <span>Citizen Workspace</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
            My Registered Complaints
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Track all civic issues you have reported across Jharkhand with live AI scores and nodal verification steps.
          </p>
        </div>

        <Button
          onClick={() => navigate('/report')}
          className="gap-2 bg-accent hover:bg-accent-hover text-accent-foreground font-bold shadow-sm"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Report New Problem</span>
        </Button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="h-4 w-4 absolute left-3 top-2.5 text-muted-foreground" />
          <Input
            placeholder="Search by Tracking ID, title, or district..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 text-xs"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-semibold text-muted-foreground shrink-0 flex items-center gap-1">
            <Filter className="h-3.5 w-3.5" /> Filter Status:
          </span>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: 'all', label: 'All Statuses' },
              { value: 'resolved', label: '🟢 Resolved' },
              { value: 'verified_in_progress', label: '🔵 In Progress' },
              { value: 'pending_officer', label: '🟡 Pending Officer Review' },
              { value: 'auto_approved', label: '🟢 Auto-Approved' },
              { value: 'auto_rejected', label: '🔴 Auto-Rejected' },
            ]}
          />
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
              className="border-border rounded-2xl overflow-hidden card-hover-lift cursor-pointer bg-card flex flex-col justify-between"
            >
              <div>
                {/* Photo & Badge Header */}
                <div className="relative h-44 w-full bg-secondary overflow-hidden">
                  <img
                    src={c.media[0] || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80'}
                    alt={c.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-white text-[11px] font-mono font-bold">
                    {c.id}
                  </div>

                  {/* Color-coded Status Badge */}
                  <div
                    className={cn(
                      'absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-xs flex items-center gap-1',
                      c.status === 'resolved'
                        ? 'bg-emerald-600 text-white'
                        : c.status === 'verified_in_progress'
                        ? 'bg-sky-600 text-white'
                        : c.status === 'pending_officer' || c.status === 'officer_reviewing'
                        ? 'bg-amber-500 text-white animate-pulse'
                        : c.status === 'auto_approved'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-rose-600 text-white'
                    )}
                  >
                    {c.status === 'resolved' && <CheckCircle2 className="h-3 w-3" />}
                    {c.status === 'verified_in_progress' && <Clock className="h-3 w-3" />}
                    {(c.status === 'pending_officer' || c.status === 'officer_reviewing') && (
                      <Clock className="h-3 w-3" />
                    )}
                    {(c.status === 'auto_rejected' || c.status === 'rejected_by_officer') && (
                      <XCircle className="h-3 w-3" />
                    )}
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
                <span className="text-primary font-bold flex items-center gap-1">
                  Track Live →
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
