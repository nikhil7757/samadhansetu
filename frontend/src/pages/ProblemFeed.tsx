import { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Search, MapPin, MessageSquare, Users, ChevronLeft, ChevronRight, FilterX, HelpCircle, Layers } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { UrgencyBadge } from '@/components/shared/UrgencyBadge';
import { SkeletonCard } from '@/components/shared/SkeletonCard';
import { EmptyState } from '@/components/shared/EmptyState';
import { ErrorState } from '@/components/shared/ErrorState';
import { JHARKHAND_DISTRICTS, CATEGORIES, STATUSES, formatDate } from '@/lib/utils';
import { MOCK_PROBLEMS } from '@/lib/mockData';
import { getStoredComplaints, type Complaint } from '@/lib/complaints';
import api from '@/lib/api';

interface ProblemSummary {
  id: string;
  title: string;
  description: string;
  category: string;
  district: string;
  urgency: string;
  status: string;
  createdAt: string;
  submittedBy: {
    id: string;
    name: string;
    district: string;
  };
  _count: {
    interests: number;
    comments: number;
  };
}

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

function mapComplaintToProblemSummary(c: Complaint): ProblemSummary {
  const statusMap: Record<string, string> = {
    resolved: 'SOLVED',
    verified_in_progress: 'IN_PROGRESS',
    auto_approved: 'AI_VERIFIED',
    pending_officer: 'PENDING_APPROVAL',
    officer_reviewing: 'IN_PROGRESS',
    auto_rejected: 'REJECTED',
    rejected_by_officer: 'REJECTED',
  };

  const categoryMap: Record<string, string> = {
    roads: 'ROADS',
    water: 'WATER',
    electricity: 'ELECTRICITY',
    sanitation: 'SANITATION',
    corruption: 'OTHER',
    other: 'OTHER',
  };

  return {
    id: c.id,
    title: c.title,
    description: c.description,
    category: categoryMap[c.category] || c.category.toUpperCase(),
    district: c.location.district,
    urgency: c.ai_score >= 80 ? 'HIGH' : c.ai_score >= 50 ? 'MEDIUM' : 'LOW',
    status: statusMap[c.status] || 'SUBMITTED',
    createdAt: c.submitted_at,
    submittedBy: {
      id: c.citizen_id || 'citizen',
      name: c.citizen_name || 'Verified Citizen',
      district: c.location.district,
    },
    _count: {
      interests: Math.max(1, Math.floor(c.ai_score / 10)),
      comments: c.history ? c.history.length : 1,
    },
  };
}

export default function ProblemFeed() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const [problems, setProblems] = useState<ProblemSummary[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 1,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Read URL search params
  const searchQuery = searchParams.get('search') || '';
  const categoryFilter = searchParams.get('category') || '';
  const districtFilter = searchParams.get('district') || '';
  const statusFilter = searchParams.get('status') || '';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  const fetchProblems = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // 1. Fetch complaints from local store & backend API
      const localComplaints = getStoredComplaints();
      let remoteComplaints: Complaint[] = [];
      try {
        const cRes = await api.get('/complaints');
        if (Array.isArray(cRes.data)) {
          remoteComplaints = cRes.data;
        }
      } catch {
        // Fall back to localComplaints
      }

      const mergedComplaintsMap = new Map<string, Complaint>();
      for (const c of [...remoteComplaints, ...localComplaints]) {
        if (c?.id && !mergedComplaintsMap.has(c.id)) {
          mergedComplaintsMap.set(c.id, c);
        }
      }

      // Convert complaints to problem summaries (exclude auto_rejected from public feed)
      const complaintProblems = Array.from(mergedComplaintsMap.values())
        .filter((c) => c.status !== 'auto_rejected')
        .map(mapComplaintToProblemSummary);

      // 2. Fetch problems from /problems API or mock baseline
      let baseProblems: ProblemSummary[] = [];
      try {
        const res = await api.get('/problems');
        if (res.data?.problems && Array.isArray(res.data.problems)) {
          baseProblems = res.data.problems;
        } else {
          baseProblems = [...MOCK_PROBLEMS];
        }
      } catch {
        baseProblems = [...MOCK_PROBLEMS];
      }

      // Combine complaints + problems, deduplicating by ID
      const allProblemsMap = new Map<string, ProblemSummary>();
      // Put complaints first so newly submitted grievances appear prominently
      for (const p of [...complaintProblems, ...baseProblems]) {
        if (!allProblemsMap.has(p.id)) {
          allProblemsMap.set(p.id, p);
        }
      }

      let filtered = Array.from(allProblemsMap.values());

      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        filtered = filtered.filter(
          (p) =>
            p.id.toLowerCase().includes(q) ||
            p.title.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            p.district.toLowerCase().includes(q)
        );
      }
      if (categoryFilter) {
        filtered = filtered.filter((p) => p.category.toLowerCase() === categoryFilter.toLowerCase());
      }
      if (districtFilter) {
        filtered = filtered.filter((p) => p.district.toLowerCase() === districtFilter.toLowerCase());
      }
      if (statusFilter) {
        filtered = filtered.filter((p) => p.status.toLowerCase() === statusFilter.toLowerCase());
      }

      // Sort newest first
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      // Paginate
      const limit = 12;
      const startIndex = (currentPage - 1) * limit;
      const paginated = filtered.slice(startIndex, startIndex + limit);

      setProblems(paginated);
      setPagination({
        page: currentPage,
        limit,
        total: filtered.length,
        totalPages: Math.max(1, Math.ceil(filtered.length / limit)),
      });
    } catch (err: any) {
      console.warn('Error fetching problems:', err);
      setError('Unable to load problems');
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, searchQuery, categoryFilter, districtFilter, statusFilter]);

  useEffect(() => {
    fetchProblems();
  }, [fetchProblems]);

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    next.set('page', '1'); // Reset to page 1 on filter changes
    setSearchParams(next);
  };

  const handlePageChange = (newPage: number) => {
    const next = new URLSearchParams(searchParams);
    next.set('page', newPage.toString());
    setSearchParams(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearAllFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const hasActiveFilters = searchQuery || categoryFilter || districtFilter || statusFilter;

  const categoryOptions = CATEGORIES.map((c) => ({
    value: c.value,
    label: t(c.labelKey),
  }));

  const districtOptions = JHARKHAND_DISTRICTS.map((d) => ({
    value: d,
    label: d,
  }));

  const statusOptions = STATUSES.filter((s) => s.value !== 'PENDING_APPROVAL' && s.value !== 'REJECTED').map((s) => ({
    value: s.value,
    label: t(s.labelKey),
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
      {/* Feed Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-border">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[11px] font-bold tracking-wide">
            <Layers className="h-3 w-3" />
            <span>SIH 2026 Problem Statement 043 • State Directory</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
            {t('problems.feed.title')}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {t('problems.feed.subtitle')}
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/50 border border-border text-xs text-muted-foreground font-mono self-start md:self-auto">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          {!isLoading && t('problems.feed.showing', { count: problems.length, total: pagination.total })}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="my-6 p-4 rounded-2xl border border-border/80 bg-card/60 specular-card backdrop-blur-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Keyword Search */}
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('problems.feed.search')}
              value={searchQuery}
              onChange={(e) => updateParam('search', e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Category Dropdown */}
          <Select
            placeholder={t('problems.feed.filterCategory')}
            options={categoryOptions}
            value={categoryFilter}
            onChange={(e) => updateParam('category', e.target.value)}
          />

          {/* District Dropdown */}
          <Select
            placeholder={t('problems.feed.filterDistrict')}
            options={districtOptions}
            value={districtFilter}
            onChange={(e) => updateParam('district', e.target.value)}
          />

          {/* Status Dropdown */}
          <Select
            placeholder={t('problems.feed.filterStatus')}
            options={statusOptions}
            value={statusFilter}
            onChange={(e) => updateParam('status', e.target.value)}
          />
        </div>

        {/* Clear filters pill */}
        {hasActiveFilters && (
          <div className="flex items-center gap-2 pt-1 border-t border-border/60">
            <span className="text-xs text-muted-foreground">Active filters applied:</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="h-6 text-xs text-primary gap-1 hover:bg-primary/10 px-2 rounded-lg"
            >
              <FilterX className="h-3 w-3" />
              {t('problems.feed.clearFilters')}
            </Button>
          </div>
        )}
      </div>

      {/* Main Grid View */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={fetchProblems} />
      ) : problems.length === 0 ? (
        <EmptyState
          icon={HelpCircle}
          title={t('problems.feed.noResults')}
          description={t('problems.feed.noResultsHint')}
          action={
            hasActiveFilters
              ? { label: t('problems.feed.clearFilters'), onClick: clearAllFilters }
              : undefined
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {problems.map((problem) => {
            const isDocket = problem.id.startsWith('SS-');
            const targetUrl = isDocket ? `/track/${problem.id}` : `/problems/${problem.id}`;

            return (
              <Link
                key={problem.id}
                to={targetUrl}
                className="group flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-5.5 specular-card card-hover-lift hover:border-primary/50 transition-all duration-200"
              >
                <div>
                  {/* Header metadata */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex flex-wrap gap-1.5 items-center">
                      <StatusBadge status={problem.status} />
                      <UrgencyBadge urgency={problem.urgency} />
                      {isDocket && (
                        <span className="font-mono text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
                          {problem.id}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-muted-foreground font-mono shrink-0">
                      {formatDate(problem.createdAt)}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors leading-snug line-clamp-2 mb-2">
                    {problem.title}
                  </h3>

                {/* Description snippet */}
                <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed mb-4">
                  {problem.description}
                </p>
              </div>

              {/* Bottom Card Footer */}
              <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5 font-medium truncate max-w-[160px]">
                  <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span className="truncate">{problem.district}</span>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-secondary/50 font-medium" title="Universities / Enablers interested">
                    <Users className="h-3.5 w-3.5 text-sky-600" />
                    <span>{problem._count?.interests || 0}</span>
                  </span>
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-secondary/50 font-medium" title="Discussion comments">
                    <MessageSquare className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{problem._count?.comments || 0}</span>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {!isLoading && pagination.totalPages > 1 && (
        <div className="mt-10 pt-6 border-t border-border flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page <= 1}
            className="gap-1.5"
          >
            <ChevronLeft className="h-4 w-4" />
            {t('common.previous')}
          </Button>

          <span className="text-xs text-muted-foreground font-mono">
            Page {pagination.page} of {pagination.totalPages}
          </span>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page >= pagination.totalPages}
            className="gap-1.5"
          >
            {t('common.next')}
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
