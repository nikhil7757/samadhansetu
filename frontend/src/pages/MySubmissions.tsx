import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { PlusCircle, Layers, MapPin, Users, MessageSquare, ExternalLink, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { UrgencyBadge } from '@/components/shared/UrgencyBadge';
import { EmptyState } from '@/components/shared/EmptyState';
import { SkeletonCard } from '@/components/shared/SkeletonCard';
import { formatDate } from '@/lib/utils';
import api from '@/lib/api';

export default function MySubmissions() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [problems, setProblems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSubmissions = async () => {
      setIsLoading(true);
      try {
        // Fetch all problems and filter by current user's submittedById on the client, or query by my submissions
        const res = await api.get('/problems?limit=50');
        // Let's filter client-side or use submissions endpoint
        setProblems(res.data.problems || []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSubmissions();
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Layers className="h-7 w-7 text-primary" />
            {t('problems.mySubmissions.title')}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {t('problems.mySubmissions.subtitle')}
          </p>
        </div>

        <Button onClick={() => navigate('/problems/submit')} className="gap-2">
          <PlusCircle className="h-4 w-4" />
          {t('problems.submit.title')}
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : problems.length === 0 ? (
        <EmptyState
          icon={Layers}
          title={t('problems.mySubmissions.empty')}
          description="Submitted problems will display here with live status tracking and team assignments."
          action={{
            label: t('problems.mySubmissions.emptyCta'),
            onClick: () => navigate('/problems/submit'),
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {problems.map((p) => (
            <Link
              key={p.id}
              to={`/problems/${p.id}`}
              className="flex flex-col justify-between rounded-xl border border-border bg-card p-5 shadow-xs hover:shadow-md hover:border-primary/40 transition-all"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex gap-1.5">
                    <StatusBadge status={p.status} />
                    <UrgencyBadge urgency={p.urgency} />
                  </div>
                  <span className="text-[11px] text-muted-foreground font-mono">
                    {formatDate(p.createdAt)}
                  </span>
                </div>

                <h3 className="font-bold text-base text-foreground mb-2 leading-snug">
                  {p.title}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed mb-4">
                  {p.description}
                </p>
              </div>

              <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1 font-medium">
                  <MapPin className="h-3.5 w-3.5 text-primary" />
                  {p.district}
                </span>
                <span className="flex items-center gap-1 text-primary font-semibold">
                  Track Status <ExternalLink className="h-3 w-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
