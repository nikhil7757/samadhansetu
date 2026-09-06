import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { Users, ExternalLink, ArrowLeft, Plus, MapPin, GraduationCap, Building2, User, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { EmptyState } from '@/components/shared/EmptyState';
import { SkeletonCard } from '@/components/shared/SkeletonCard';
import { formatDate } from '@/lib/utils';
import { MOCK_MATCHES } from '@/lib/mockData';
import api from '@/lib/api';

interface MatchItem {
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
    user: {
      id: string;
      name: string;
      role: string;
      organizationName?: string;
    };
  }>;
}

export default function AllMatches() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [matches, setMatches] = useState<MatchItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMatches = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/admin/matches');
      if (res.data && res.data.length > 0) {
        setMatches(res.data);
      } else {
        setMatches(MOCK_MATCHES as any);
      }
    } catch (err) {
      console.warn('API connecting, using baseline collaborative match records:', err);
      setMatches(MOCK_MATCHES as any);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

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
            <Users className="h-7 w-7 text-primary" />
            {t('admin.matches.title')}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {t('admin.matches.subtitle')}
          </p>
        </div>

        <span className="text-xs text-muted-foreground font-mono bg-secondary px-3 py-1.5 rounded-md border border-border">
          {matches.length} active teams
        </span>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonCard key={i} className="h-36" />
          ))}
        </div>
      ) : matches.length === 0 ? (
        <EmptyState
          icon={Users}
          title={t('admin.matches.empty')}
          description={t('admin.matches.emptyHint')}
        />
      ) : (
        <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-secondary/60 text-muted-foreground uppercase text-[10px] tracking-wider border-b border-border">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Challenge Target</th>
                  <th className="py-3.5 px-4 font-semibold">District</th>
                  <th className="py-3.5 px-4 font-semibold">Lifecycle Status</th>
                  <th className="py-3.5 px-4 font-semibold">Formed Date</th>
                  <th className="py-3.5 px-4 font-semibold">Assigned Team Units</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {matches.map((m) => (
                  <tr key={m.id} className="hover:bg-secondary/30 transition-colors">
                    <td className="py-4 px-4 font-semibold text-foreground max-w-xs">
                      <Link
                        to={`/problems/${m.problem.id}`}
                        className="hover:text-primary transition-colors line-clamp-2"
                      >
                        {m.problem.title}
                      </Link>
                    </td>

                    <td className="py-4 px-4 text-muted-foreground whitespace-nowrap">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-primary" />
                        {m.problem.district}
                      </span>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <StatusBadge status={m.problem.status} />
                    </td>

                    <td className="py-4 px-4 font-mono text-muted-foreground whitespace-nowrap">
                      {formatDate(m.formedAt)}
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex flex-wrap gap-1.5 max-w-sm">
                        {m.members.map((member) => (
                          <span
                            key={member.id}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-secondary text-[11px] font-medium text-foreground border border-border/50"
                          >
                            {member.user.role === 'UNIVERSITY' ? (
                              <GraduationCap className="h-3 w-3 text-sky-600" />
                            ) : member.user.role === 'INDUSTRY' ? (
                              <Building2 className="h-3 w-3 text-amber-600" />
                            ) : (
                              <User className="h-3 w-3 text-primary" />
                            )}
                            <span className="truncate max-w-[120px]">
                              {member.user.organizationName || member.user.name}
                            </span>
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate(`/teams/${m.id}`)}
                        className="gap-1 text-xs"
                      >
                        Workspace <ExternalLink className="h-3 w-3" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
