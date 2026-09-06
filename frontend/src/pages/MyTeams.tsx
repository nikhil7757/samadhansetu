import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Users, ExternalLink, MapPin, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { EmptyState } from '@/components/shared/EmptyState';
import { SkeletonCard } from '@/components/shared/SkeletonCard';
import { formatDate } from '@/lib/utils';
import api from '@/lib/api';

export default function MyTeams() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [teams, setTeams] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTeams = async () => {
      setIsLoading(true);
      try {
        const res = await api.get('/teams/my');
        setTeams(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTeams();
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Users className="h-7 w-7 text-primary" />
            {t('teams.myTeams.title')}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {t('teams.myTeams.subtitle')}
          </p>
        </div>

        <Button onClick={() => navigate('/problems')} variant="outline">
          {t('teams.myTeams.emptyCta')}
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : teams.length === 0 ? (
        <EmptyState
          icon={Users}
          title={t('teams.myTeams.empty')}
          description="Once an admin pairs your institution with a community challenge, your collaborative workspace will appear here."
          action={{
            label: t('teams.myTeams.emptyCta'),
            onClick: () => navigate('/problems'),
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team) => (
            <Card key={team.id} className="border-border shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <StatusBadge status={team.problem?.status || 'TEAM_FORMED'} />
                  <span className="text-[11px] text-muted-foreground font-mono">
                    {formatDate(team.formedAt)}
                  </span>
                </div>

                <h3 className="font-bold text-base text-foreground leading-snug">
                  {team.problem?.title}
                </h3>

                <div className="space-y-2 text-xs text-muted-foreground pt-1">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-primary" />
                    <span>{team.problem?.district}, Jharkhand</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 text-sky-600" />
                    <span>{team.members?.length || 0} Collaborative Members</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-border flex justify-end">
                  <Button size="sm" onClick={() => navigate(`/teams/${team.id}`)} className="gap-1.5 w-full sm:w-auto">
                    Open Workspace <ExternalLink className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
