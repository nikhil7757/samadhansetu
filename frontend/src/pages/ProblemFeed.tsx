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
      const params: Record<string, string> = {
        page: currentPage.toString(),
        limit: '12',
      };
      if (searchQuery) params.search = searchQuery;
      if (categoryFilter) params.category = categoryFilter;
      if (districtFilter) params.district = districtFilter;
      if (statusFilter) params.status = statusFilter;

      const res = await api.get('/problems', { params });
      if (res.data?.problems) {
        setProblems(res.data.problems);
        setPagination(res.data.pagination);
      } else {
        throw new Error('Invalid response');
      }
    } catch (err: any) {
      console.warn('API connecting, using baseline directory:', err);
      let filtered = [...MOCK_PROBLEMS];
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        filtered = filtered.filter(
          (p) => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
        );
      }
      if (categoryFilter) {
        filtered = filtered.filter((p) => p.category === categoryFilter);
      }
      if (districtFilter) {
        filtered = filtered.filter((p) => p.district === districtFilter);
      }
      if (statusFilter) {
        filtered = filtered.filter((p) => p.status === statusFilter);
      }
      setProblems(filtered);
      setPagination({
        page: 1,
        limit: 12,
        total: filtered.length,
        totalPages: 1,
      });
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
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            {t('problems.feed.title')}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {t('problems.feed.subtitle')}
          </p>
        </div>

        <div className="text-xs text-muted-foreground font-mono">
          {!isLoading && t('problems.feed.showing', { count: problems.length, total: pagination.total })}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="my-6 space-y-3">
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
          <div className="flex items-center gap-2 pt-1">
            <span className="text-xs text-muted-foreground">Active filters applied</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="h-7 text-xs text-primary gap-1 hover:bg-primary/10"
            >
              <FilterX className="h-3.5 w-3.5" />
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
          {problems.map((problem) => (
            <Link
              key={problem.id}
              to={`/problems/${problem.id}`}
              className="group flex flex-col justify-between rounded-xl border border-border bg-card p-5 shadow-xs hover:shadow-md hover:border-primary/40 transition-all duration-200"
            >
              <div>
                {/* Header metadata */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex flex-wrap gap-1.5 items-center">
                    <StatusBadge status={problem.status} />
                    <UrgencyBadge urgency={problem.urgency} />
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
                  <span className="flex items-center gap-1" title="Universities / Enablers interested">
                    <Users className="h-3.5 w-3.5 text-sky-600" />
                    <span>{problem._count?.interests || 0}</span>
                  </span>
                  <span className="flex items-center gap-1" title="Discussion comments">
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
