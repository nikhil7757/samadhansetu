import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Building2, GraduationCap, MapPin, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { EmptyState } from '@/components/shared/EmptyState';
import { SkeletonCard } from '@/components/shared/SkeletonCard';
import { formatDate } from '@/lib/utils';
import { MOCK_MATCHES } from '@/lib/mockData';
import api from '@/lib/api';

export default function MyInterests() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [interests, setInterests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInterests = async () => {
      setIsLoading(true);
      try {
        const res = await api.get('/teams/my');
        if (res.data && res.data.length > 0) {
          setInterests(res.data);
        } else {
          setInterests(MOCK_MATCHES);
        }
      } catch (err) {
        console.warn('API connecting, using baseline interest collaborations:', err);
        setInterests(MOCK_MATCHES);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInterests();
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Building2 className="h-7 w-7 text-primary" />
            {t('interest.myInterests.title')}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {t('interest.myInterests.subtitle')}
          </p>
        </div>

        <Button onClick={() => navigate('/problems')} variant="outline" className="gap-2">
          {t('interest.myInterests.emptyCta')}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : interests.length === 0 ? (
        <EmptyState
          icon={GraduationCap}
          title={t('interest.myInterests.empty')}
          description="When you express interest with a solution pitch or CSR sponsorship offer on an open challenge, your proposals and active team assignments will appear here."
          action={{
            label: t('interest.myInterests.emptyCta'),
            onClick: () => navigate('/problems'),
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {interests.map((item) => (
            <Card key={item.id} className="border-border shadow-xs hover:shadow-md transition-shadow">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <StatusBadge status={item.problem?.status || 'OPEN'} />
                  <span className="text-xs text-muted-foreground font-mono">
                    Formed: {formatDate(item.formedAt)}
                  </span>
                </div>

                <h3 className="font-bold text-base text-foreground leading-snug">
                  {item.problem?.title}
                </h3>

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5 text-primary" />
                  <span>{item.problem?.district}</span>
                  <span>•</span>
                  <span>{item.problem?.category?.replace(/_/g, ' ')}</span>
                </div>

                <div className="pt-3 border-t border-border flex items-center justify-between">
                  <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Workspace Active
                  </span>
                  <Button size="sm" onClick={() => navigate(`/teams/${item.id}`)} className="gap-1.5">
                    Open Workspace <ArrowRight className="h-3.5 w-3.5" />
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
