import { useCallback, useEffect, useState } from 'react';
import { SorterResult } from 'antd/lib/table/interface';
import { FilterState, SortState } from '../types/table.types';
import { DEFAULT_FILTERS_AND_SORTER, DEFAULT_TABLE_ID } from '../constants';
import { useTableFiltersAndSorterStore, getTableFiltersAndSorterState, FiltersAndSorterState } from '../stores/useTableFiltersAndSorterStore';

export interface TableFiltersAndSorterOptions {
  tableId?: string;
  saveUserPreferences?: boolean;
}

export interface UseTableFiltersAndSorterReturn {
  filters: FilterState;
  sorter: SortState;
  setFilters: (filters: FilterState) => void;
  setSorter: (sorter: SortState) => void;
  handleFilterChange: (filters: Record<string, any>) => void;
  handleSorterChange: (sorter: SorterResult<any> | SorterResult<any>[]) => void;
  clearFilters: () => void;
  clearSorter: () => void;
  clearAll: () => void;
  resetToDefault: () => void;
}

export const useTableFiltersAndSorter = (
  defaultConfig: FiltersAndSorterState = DEFAULT_FILTERS_AND_SORTER,
  options: TableFiltersAndSorterOptions = {},
): UseTableFiltersAndSorterReturn => {
  const {
    tableId = DEFAULT_TABLE_ID,
    saveUserPreferences = true,
  } = options;

  const {
    setFiltersAndSorterConfig,
    resetFiltersAndSorterConfig,
    setFilters: setStoreFilters,
    setSorter: setStoreSorter,
    clearFilters: clearStoreFilters,
    clearSorter: clearStoreSorter,
    clearAll: clearStoreAll,
  } = useTableFiltersAndSorterStore();

  const initialState = saveUserPreferences
    ? getTableFiltersAndSorterState(tableId, defaultConfig).filtersAndSorterConfig
    : defaultConfig;

  const [filters, setLocalFilters] = useState<FilterState>(initialState.filters);
  const [sorter, setLocalSorter] = useState<SortState>(initialState.sorter);

  useEffect(() => {
    if (saveUserPreferences) {
      setFiltersAndSorterConfig(tableId, { filters, sorter });
    }
  }, [filters, sorter, tableId, saveUserPreferences, setFiltersAndSorterConfig]);

  const setFilters = useCallback((newFilters: FilterState) => {
    setLocalFilters(newFilters);
    if (saveUserPreferences) {
      setStoreFilters(tableId, newFilters);
    }
  }, [tableId, saveUserPreferences, setStoreFilters]);

  const setSorter = useCallback((newSorter: SortState) => {
    setLocalSorter(newSorter);
    if (saveUserPreferences) {
      setStoreSorter(tableId, newSorter);
    }
  }, [tableId, saveUserPreferences, setStoreSorter]);

  const handleFilterChange = useCallback((newFilters: Record<string, any>) => {
    setFilters(newFilters);
  }, [setFilters]);

  const handleSorterChange = useCallback((
    newSorter: SorterResult<any> | SorterResult<any>[]
  ) => {
    if (Array.isArray(newSorter)) {
      if (newSorter.length > 0) {
        const primarySorter = newSorter[0];
        setSorter({
          columnKey: primarySorter.columnKey,
          order: primarySorter.order,
        });
      } else {
        setSorter({});
      }
      return;
    }
    setSorter({
      columnKey: newSorter.columnKey,
      order: newSorter.order,
    });
  }, [setSorter]);

  const clearFilters = useCallback(() => {
    setFilters({});
    if (saveUserPreferences) {
      clearStoreFilters(tableId);
    }
  }, [setFilters, tableId, saveUserPreferences, clearStoreFilters]);

  const clearSorter = useCallback(() => {
    setSorter({});
    if (saveUserPreferences) {
      clearStoreSorter(tableId);
    }
  }, [setSorter, tableId, saveUserPreferences, clearStoreSorter]);

  const clearAll = useCallback(() => {
    setLocalFilters({});
    setLocalSorter({});
    if (saveUserPreferences) {
      clearStoreAll(tableId);
    }
  }, [tableId, saveUserPreferences, clearStoreAll]);

  const resetToDefault = useCallback(() => {
    setLocalFilters(defaultConfig.filters);
    setLocalSorter(defaultConfig.sorter);
    if (saveUserPreferences) {
      resetFiltersAndSorterConfig(tableId, defaultConfig);
    }
  }, [defaultConfig, tableId, saveUserPreferences, resetFiltersAndSorterConfig]);

  return {
    filters,
    sorter,
    setFilters,
    setSorter,
    handleFilterChange,
    handleSorterChange,
    clearFilters,
    clearSorter,
    clearAll,
    resetToDefault,
  };
};