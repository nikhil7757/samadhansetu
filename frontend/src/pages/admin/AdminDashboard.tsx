import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, Clock, Users, ArrowRight, CheckCircle2, AlertTriangle, Layers, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { SkeletonCard } from '@/components/shared/SkeletonCard';
import api from '@/lib/api';

export default function AdminDashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [pendingCount, setPendingCount] = useState<number>(0);
  const [matchesCount, setMatchesCount] = useState<number>(0);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      setIsLoading(true);
      try {
        const [resPending, resMatches, resStats] = await Promise.all([
          api.get('/admin/problems/pending'),
          api.get('/admin/matches'),
          api.get('/dashboard/stats'),
        ]);
        setPendingCount(resPending.data.length || 0);
        setMatchesCount(resMatches.data.length || 0);
        setStats(resStats.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAdminStats();
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 space-y-8">
      {/* Console Header */}
      <div className="border-b border-border pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-2">
            <ShieldCheck className="h-3.5 w-3.5" />
            Nodal Officer Console
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            {t('admin.dashboard.title')}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Moderation review queue, matchmaking coordination, and state-level audit metrics
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={() => navigate('/admin/pending')} className="gap-2">
            <Clock className="h-4 w-4" />
            Review Queue ({pendingCount})
          </Button>
          <Button variant="outline" onClick={() => navigate('/admin/matches')} className="gap-2">
            <Users className="h-4 w-4" />
            Match Registry
          </Button>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="border-border shadow-xs">
          <CardContent className="p-6 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Moderation Queue
              </span>
              <Clock className="h-5 w-5 text-amber-600" />
            </div>
            <div className="text-3xl font-black text-foreground">{pendingCount}</div>
            <p className="text-xs text-muted-foreground">
              Challenges pending state nodal verification
            </p>
            <div className="pt-3">
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs"
                onClick={() => navigate('/admin/pending')}
              >
                Inspect Queue →
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-xs">
          <CardContent className="p-6 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Active Matches
              </span>
              <Users className="h-5 w-5 text-sky-600" />
            </div>
            <div className="text-3xl font-black text-primary">{matchesCount}</div>
            <p className="text-xs text-muted-foreground">
              Authorized university-industry collaboration teams
            </p>
            <div className="pt-3">
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs"
                onClick={() => navigate('/admin/matches')}
              >
                Inspect Teams →
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-xs">
          <CardContent className="p-6 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Total Live Problems
              </span>
              <Layers className="h-5 w-5 text-emerald-600" />
            </div>
            <div className="text-3xl font-black text-emerald-600">
              {stats?.totalProblems || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Published across 24 Jharkhand districts
            </p>
            <div className="pt-3">
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs"
                onClick={() => navigate('/problems')}
              >
                View Directory →
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
