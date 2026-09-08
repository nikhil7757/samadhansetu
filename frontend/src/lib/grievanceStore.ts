/**
 * GrievanceStore — Deep Client-Side Data & Synchronization Seam
 * 
 * Implements Architecture Review Candidate 3:
 * Collapses fragmented localStorage calls, optimistic updates, and background API queries
 * into a single deep module interface.
 */

import { useState, useEffect, useCallback } from 'react';
import {
  getStoredComplaints,
  saveComplaints,
  getComplaintById,
  submitComplaint as libSubmitComplaint,
  appealComplaint as libAppealComplaint,
  executeOfficerAction as libExecuteOfficerAction,
  type Complaint,
  type ComplaintCategory,
  type ComplaintStatus,
} from './complaints';
import api from './api';

export interface GrievanceFilterOptions {
  category?: string;
  district?: string;
  status?: string;
  search?: string;
}

export interface UseGrievancesResult {
  grievances: Complaint[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export interface UseGrievanceResult {
  grievance: Complaint | null;
  isLoading: boolean;
  error: string | null;
  appeal: (note: string) => Promise<boolean>;
  takeOfficerAction: (action: 'approve' | 'reject' | 'escalate', note?: string) => Promise<boolean>;
  refresh: () => Promise<void>;
}

// Global in-memory subscribers for immediate reactivity across components
type StoreListener = () => void;
const listeners = new Set<StoreListener>();

function notifyListeners() {
  for (const listener of listeners) {
    listener();
  }
}

/**
 * Deep React Hook to access and filter the civic grievance registry
 */
export function useGrievances(filters?: GrievanceFilterOptions): UseGrievancesResult {
  const [grievances, setGrievances] = useState<Complaint[]>(() => {
    return applyFilters(getStoredComplaints(), filters);
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sync = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // 1. Instant hydration from client storage
      const local = getStoredComplaints();
      setGrievances(applyFilters(local, filters));

      // 2. Background synchronization with backend API
      const res = await api.get('/complaints');
      if (Array.isArray(res.data) && res.data.length > 0) {
        // Merge without losing locally submitted pending items
        const mergedMap = new Map<string, Complaint>();
        for (const item of local) mergedMap.set(item.id, item);
        for (const item of res.data) mergedMap.set(item.id, item);
        const merged = Array.from(mergedMap.values());
        saveComplaints(merged);
        setGrievances(applyFilters(merged, filters));
      }
    } catch (err: any) {
      console.warn('GrievanceStore remote sync note (local fallback active):', err?.message || err);
    } finally {
      setIsLoading(false);
    }
  }, [filters?.category, filters?.district, filters?.status, filters?.search]);

  useEffect(() => {
    const handleStoreChange = () => {
      setGrievances(applyFilters(getStoredComplaints(), filters));
    };

    listeners.add(handleStoreChange);
    sync();

    return () => {
      listeners.delete(handleStoreChange);
    };
  }, [sync]);

  return {
    grievances,
    isLoading,
    error,
    refresh: sync,
  };
}

/**
 * Deep React Hook to access and interact with a single grievance docket
 */
export function useGrievance(docketId?: string): UseGrievanceResult {
  const [grievance, setGrievance] = useState<Complaint | null>(() => {
    return docketId ? getComplaintById(docketId) || null : null;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGrievance = useCallback(async () => {
    if (!docketId) {
      setGrievance(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    // 1. Try local cache
    const local = getComplaintById(docketId);
    if (local) {
      setGrievance(local);
    }

    // 2. Query remote server
    try {
      const res = await api.get(`/complaints/${encodeURIComponent(docketId)}`);
      if (res.data && res.data.id) {
        setGrievance(res.data);
        // Update local cache
        const all = getStoredComplaints().filter((c) => c.id !== res.data.id);
        saveComplaints([res.data, ...all]);
        notifyListeners();
      }
    } catch (err: any) {
      if (!local) {
        setError('Docket not found on Jharkhand Civic Registry.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [docketId]);

  useEffect(() => {
    fetchGrievance();
  }, [fetchGrievance]);

  const appeal = useCallback(async (note: string): Promise<boolean> => {
    if (!docketId) return false;
    try {
      const updated = libAppealComplaint(docketId, note);
      if (updated) {
        setGrievance(updated);
        notifyListeners();
      }
      await api.post(`/complaints/${encodeURIComponent(docketId)}/appeal`, { note });
      return true;
    } catch (err: any) {
      console.warn('Appeal remote dispatch note:', err?.message || err);
      return true; // Local optimistic update already held
    }
  }, [docketId]);

  const takeOfficerAction = useCallback(
    async (action: 'approve' | 'reject' | 'escalate', note?: string): Promise<boolean> => {
      if (!docketId) return false;
      try {
        const updated = libExecuteOfficerAction(docketId, action, note);
        if (updated) {
          setGrievance(updated);
          notifyListeners();
        }
        await api.patch(`/complaints/${encodeURIComponent(docketId)}/officer-action`, {
          action,
          note,
        });
        return true;
      } catch (err: any) {
        console.warn('Officer action remote dispatch note:', err?.message || err);
        return true;
      }
    },
    [docketId]
  );

  return {
    grievance,
    isLoading,
    error,
    appeal,
    takeOfficerAction,
    refresh: fetchGrievance,
  };
}

/**
 * Filter helper
 */
function applyFilters(complaints: Complaint[], filters?: GrievanceFilterOptions): Complaint[] {
  let list = complaints;

  if (filters?.category && filters.category !== 'all') {
    list = list.filter((c) => c.category.toLowerCase() === filters.category?.toLowerCase());
  }

  if (filters?.district && filters.district !== 'all') {
    list = list.filter((c) => c.location.district.toLowerCase() === filters.district?.toLowerCase());
  }

  if (filters?.status && filters.status !== 'all') {
    list = list.filter((c) => c.status === filters.status);
  }

  if (filters?.search) {
    const q = filters.search.toLowerCase();
    list = list.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q) ||
        c.location.district.toLowerCase().includes(q)
    );
  }

  return list;
}
