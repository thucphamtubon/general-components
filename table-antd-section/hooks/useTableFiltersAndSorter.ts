import { useCallback, useEffect, useState } from 'react';
import { SorterResult, TablePaginationConfig } from 'antd/lib/table/interface';
import { FilterState, SortState } from '../types';
import { DEFAULT_FILTERS_AND_SORTER } from '../constants';
import { useTableFiltersAndSorterStore, getTableFiltersAndSorterState, FiltersAndSorterState } from '../stores/useTableFiltersAndSorterStore';

export interface TableFiltersAndSorterOptions {
  saveUserPreferences?: boolean;
  onFilterChange?: (filters: FilterState) => void;
  onSortChange?: (sorter: SortState) => void;
}

export interface UseTableFiltersAndSorterReturn {
  filters: FilterState;
  sorter: SortState;
  setFilters: (filters: FilterState) => void;
  setSorter: (sorter: SortState) => void;
  handleFilterChange: (filters: Record<string, any>) => void;
  handleSorterChange: (sorter: SorterResult<any> | SorterResult<any>[]) => void;
  handleTableChange: (
    pagination: TablePaginationConfig,
    filters: Record<string, any>,
    sorter: SorterResult<any> | SorterResult<any>[],
  ) => void;
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
    saveUserPreferences = true,
    onFilterChange,
    onSortChange,
  } = options;
  
  const { tableId } = defaultConfig;

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
      setFiltersAndSorterConfig(tableId, { tableId, filters, sorter });
    }
    
    if (onFilterChange) {
      onFilterChange(filters);
    }
  }, [filters, sorter, tableId, saveUserPreferences, setFiltersAndSorterConfig, onFilterChange]);

  useEffect(() => {
    if (onSortChange) {
      onSortChange(sorter);
    }
  }, [sorter, onSortChange]);

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

  // Table Change Handler - Xử lý tất cả các thay đổi bảng
  const handleTableChange = useCallback(
    (
      pagination: TablePaginationConfig,
      filters: Record<string, any>,
      sorter: SorterResult<any> | SorterResult<any>[],
    ) => {
      if (filters) {
        handleFilterChange(filters);
      }

      if (sorter) {
        if (Array.isArray(sorter)) {
          if (sorter.length > 0) {
            handleSorterChange(sorter[0]);
          } else {
            // Xử lý trường hợp mảng sorter rỗng - đặt về sorter trống
            handleSorterChange({ columnKey: undefined, order: undefined });
          }
        } else if (sorter.columnKey || sorter.order) {
          // Chỉ xử lý sorter khi có columnKey hoặc order
          handleSorterChange(sorter);
        } else if (Object.keys(sorter).length === 0) {
          // Xử lý trường hợp sorter là object rỗng {}
          handleSorterChange({ columnKey: undefined, order: undefined });
        }
      }
    },
    [handleFilterChange, handleSorterChange]
  );

  return {
    filters,
    sorter,
    setFilters,
    setSorter,
    handleFilterChange,
    handleSorterChange,
    handleTableChange,
    clearFilters,
    clearSorter,
    clearAll,
    resetToDefault,
  };
};