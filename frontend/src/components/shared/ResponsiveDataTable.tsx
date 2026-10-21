import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  LayoutGrid,
  Table as TableIcon,
  ChevronLeft,
  ChevronRight,
  Filter,
  X,
  SlidersHorizontal,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface ColumnDef<T> {
  key: string;
  header: string;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  className?: string;
  render: (row: T) => React.ReactNode;
  getRawValue?: (row: T) => string | number | boolean;
}

interface ResponsiveDataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  keyExtractor: (row: T) => string;
  searchPlaceholder?: string;
  searchKeys?: (row: T) => string[];
  filterOptions?: Array<{
    key: string;
    label: string;
    values: string[];
    extractor: (row: T) => string;
  }>;
  renderCard?: (row: T) => React.ReactNode;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: {
    label: string;
    onClick: () => void;
  };
  pageSize?: number;
  initialViewMode?: 'table' | 'cards';
  className?: string;
}

export function ResponsiveDataTable<T>({
  data,
  columns,
  keyExtractor,
  searchPlaceholder = 'Search records...',
  searchKeys,
  filterOptions = [],
  renderCard,
  emptyTitle = 'No matching records found',
  emptyDescription = 'Try adjusting your search criteria or active filters.',
  emptyAction,
  pageSize = 10,
  initialViewMode = 'table',
  className,
}: ResponsiveDataTableProps<T>) {
  const [query, setQuery] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>(initialViewMode);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string>>({});
  const [page, setPage] = useState(1);

  // Filter logic
  const filteredData = useMemo(() => {
    return data.filter((row) => {
      // 1. Text search
      if (query.trim()) {
        const q = query.toLowerCase();
        if (searchKeys) {
          const keys = searchKeys(row);
          const hasMatch = keys.some((k) => k?.toLowerCase().includes(q));
          if (!hasMatch) return false;
        }
      }

      // 2. Custom category filters
      for (const [filterKey, selectedVal] of Object.entries(selectedFilters)) {
        if (!selectedVal || selectedVal === 'ALL') continue;
        const option = filterOptions.find((o) => o.key === filterKey);
        if (option) {
          const rowVal = option.extractor(row);
          if (rowVal !== selectedVal) return false;
        }
      }

      return true;
    });
  }, [data, query, searchKeys, selectedFilters, filterOptions]);

  // Sort logic
  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;
    const col = columns.find((c) => c.key === sortKey);
    if (!col || !col.getRawValue) return filteredData;

    return [...filteredData].sort((a, b) => {
      const valA = col.getRawValue!(a);
      const valB = col.getRawValue!(b);

      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortDirection === 'asc' ? valA - valB : valB - valA;
      }

      const strA = String(valA || '').toLowerCase();
      const strB = String(valB || '').toLowerCase();
      return sortDirection === 'asc' ? strA.localeCompare(strB) : strB.localeCompare(strA);
    });
  }, [filteredData, sortKey, sortDirection, columns]);

  // Pagination
  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, page, pageSize]);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      if (sortDirection === 'asc') setSortDirection('desc');
      else {
        setSortKey(null);
        setSortDirection('asc');
      }
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const handleClearFilters = () => {
    setQuery('');
    setSelectedFilters({});
    setSortKey(null);
    setPage(1);
  };

  const hasActiveFilters = query.trim().length > 0 || Object.values(selectedFilters).some((v) => v && v !== 'ALL');

  return (
    <div className={cn('space-y-4', className)}>
      {/* Control Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder={searchPlaceholder}
            className="w-full pl-9 pr-8 py-2 rounded-xl text-xs font-medium bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/20"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Filter Dropdowns & View Toggle */}
        <div className="flex items-center gap-2 flex-wrap">
          {filterOptions.map((opt) => (
            <select
              key={opt.key}
              value={selectedFilters[opt.key] || 'ALL'}
              onChange={(e) => {
                setSelectedFilters((prev) => ({ ...prev, [opt.key]: e.target.value }));
                setPage(1);
              }}
              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-card border border-border text-foreground cursor-pointer"
            >
              <option value="ALL">All {opt.label}</option>
              {opt.values.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          ))}

          {/* View mode toggle (Table / Grid) */}
          {renderCard && (
            <div className="flex items-center rounded-lg border border-border bg-card p-0.5">
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={cn(
                  'p-1.5 rounded-md text-xs transition-colors cursor-pointer',
                  viewMode === 'table' ? 'bg-primary text-white' : 'text-muted-foreground hover:text-foreground'
                )}
                title="Table View"
              >
                <TableIcon className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('cards')}
                className={cn(
                  'p-1.5 rounded-md text-xs transition-colors cursor-pointer',
                  viewMode === 'cards' ? 'bg-primary text-white' : 'text-muted-foreground hover:text-foreground'
                )}
                title="Cards View"
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
            </div>
          )}

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              className="text-xs text-muted-foreground hover:text-destructive cursor-pointer h-8 px-2"
            >
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      {sortedData.length === 0 ? (
        <div className="rounded-2xl solid-surface p-12 text-center space-y-3">
          <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground">
            <Search className="h-6 w-6" />
          </div>
          <h4 className="text-base font-bold text-foreground font-heading">{emptyTitle}</h4>
          <p className="text-xs text-muted-foreground max-w-md mx-auto">{emptyDescription}</p>
          {emptyAction ? (
            <Button size="sm" onClick={emptyAction.onClick} className="text-xs font-bold mt-2">
              {emptyAction.label}
            </Button>
          ) : (
            hasActiveFilters && (
              <Button size="sm" variant="outline" onClick={handleClearFilters} className="text-xs font-bold mt-2">
                Clear Filters
              </Button>
            )
          )}
        </div>
      ) : viewMode === 'table' ? (
        /* Solid Dense Table Surface */
        <div className="rounded-2xl solid-surface overflow-hidden border border-border">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      onClick={() => col.sortable && handleSort(col.key)}
                      className={cn(
                        'py-3 px-4 font-bold text-foreground uppercase tracking-wider text-[11px]',
                        col.sortable && 'cursor-pointer hover:bg-muted/70 select-none transition-colors',
                        col.align === 'center' && 'text-center',
                        col.align === 'right' && 'text-right',
                        col.className
                      )}
                    >
                      <div
                        className={cn(
                          'flex items-center gap-1.5',
                          col.align === 'center' && 'justify-center',
                          col.align === 'right' && 'justify-end'
                        )}
                      >
                        <span>{col.header}</span>
                        {col.sortable && (
                          <span className="text-muted-foreground">
                            {sortKey === col.key ? (
                              sortDirection === 'asc' ? (
                                <ArrowUp className="h-3 w-3 text-primary" />
                              ) : (
                                <ArrowDown className="h-3 w-3 text-primary" />
                              )
                            ) : (
                              <ArrowUpDown className="h-3 w-3 opacity-40 hover:opacity-100" />
                            )}
                          </span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {paginatedData.map((row) => (
                  <tr
                    key={keyExtractor(row)}
                    className="hover:bg-muted/20 transition-colors group cursor-default"
                  >
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className={cn(
                          'py-3 px-4 text-foreground align-middle font-medium',
                          col.align === 'center' && 'text-center',
                          col.align === 'right' && 'text-right font-mono',
                          col.className
                        )}
                      >
                        {col.render(row)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Card / Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedData.map((row) => (
            <React.Fragment key={keyExtractor(row)}>
              {renderCard ? renderCard(row) : null}
            </React.Fragment>
          ))}
        </div>
      )}

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2 px-1 text-xs text-muted-foreground">
          <div>
            Showing <strong className="text-foreground">{(page - 1) * pageSize + 1}</strong> to{' '}
            <strong className="text-foreground">{Math.min(page * pageSize, sortedData.length)}</strong> of{' '}
            <strong className="text-foreground">{sortedData.length}</strong> records
          </div>

          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="icon"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              className="h-8 w-8 cursor-pointer disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="font-mono text-xs px-2">
              {page} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              className="h-8 w-8 cursor-pointer disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResponsiveDataTable;
