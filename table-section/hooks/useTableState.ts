import { useState, useCallback, useMemo } from 'react';

export interface UseTableStateReturn {
  loading: boolean;
  error: Error | null;
  isEmpty: boolean;
  setLoading: (loading: boolean) => void;
  setError: (error: Error | null) => void;
  clearError: () => void;
  reset: () => void;
  refresh: () => Promise<void>;
  isRefreshing: boolean;
  hasData: boolean;
  getStateInfo: () => {
    loading: boolean;
    error: Error | null;
    isEmpty: boolean;
    hasData: boolean;
  };
}

export interface UseTableStateOptions {
  data?: any[];
  onRefresh?: () => Promise<void>;
  loading?: boolean; // Changed from initialLoading to loading
}

export function useTableState(
  options: UseTableStateOptions = {}
): UseTableStateReturn {
  const { 
    data = [], 
    onRefresh,
    loading = false // Directly use the loading prop
  } = options;

  const [error, setError] = useState<Error | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const isEmpty = useMemo(() => {
    return !loading && !error && data.length === 0;
  }, [loading, error, data.length]);

  const hasData = useMemo(() => {
    return data.length > 0;
  }, [data.length]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const reset = useCallback(() => {
    setError(null);
    setIsRefreshing(false);
  }, []);

  const refresh = useCallback(async () => {
    if (!onRefresh) return;

    try {
      setIsRefreshing(true);
      clearError();
      await onRefresh();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setIsRefreshing(false);
    }
  }, [onRefresh, clearError]);

  const getStateInfo = useCallback(() => {
    return {
      loading,
      error,
      isEmpty,
      hasData,
    };
  }, [loading, error, isEmpty, hasData]);

  return {
    loading,
    error,
    isEmpty,
    setLoading: () => {}, // No-op since we are using the prop
    setError,
    clearError,
    reset,
    refresh,
    isRefreshing,
    hasData,
    getStateInfo,
  };
} 