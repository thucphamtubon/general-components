import { useMemo, useEffect } from 'react';
import { useTableSearch } from './useTableSearch';
import { useTableSelection } from './useTableSelection';
import { useTablePagination } from './useTablePagination';
import { useTableState } from './useTableState';
import { IConstants } from '../types/Table.types';
import { generateColumns } from '../services/column-service';
import { getSearchableFields } from '../services/search.service';

export interface UseTableOrchestratorOptions {
  constants: Partial<IConstants>;
  data: any[];
  rowKey?: string;
  initialPageSize?: number;
  enableSearch?: boolean;
  enableSelection?: boolean;
  enablePagination?: boolean;
  onRefresh?: () => Promise<void>;
  onSelectionChange?: (keys: React.Key[], rows: any[]) => void;
  onPageChange?: (page: number, pageSize: number) => void;
  loading?: boolean;
}

export interface UseTableOrchestratorReturn {
  // Data
  displayData: any[];
  columns: any[];
  
  // Search
  search: ReturnType<typeof useTableSearch>;
  
  // Selection
  selection: ReturnType<typeof useTableSelection>;
  
  // Pagination
  pagination: ReturnType<typeof useTablePagination>;
  
  // State
  state: ReturnType<typeof useTableState>;
  
  // Computed
  searchableFields: string[];
  hasData: boolean;
  isEmpty: boolean;
  totalCount: number;
}

/**
 * Orchestrator hook theo nguyên tắc Single Responsibility Principle
 * - Chỉ kết nối các hooks chuyên biệt
 * - Không chứa logic phức tạp
 * - Dễ test và maintain
 */
export function useTableOrchestrator(
  options: UseTableOrchestratorOptions
): UseTableOrchestratorReturn {
  const {
    constants,
    data = [],
    rowKey = 'id',
    initialPageSize = 10,
    enableSearch = true,
    enableSelection = true,
    enablePagination = true,
    onRefresh,
    onSelectionChange,
    onPageChange,
    loading,
  } = options;

  // Initialize specialized hooks
  const search = useTableSearch();
  
  const selection = useTableSelection({
    enabled: enableSelection,
    onSelectionChange,
  });
  
  const pagination = useTablePagination({
    enabled: enablePagination,
    initialPageSize,
    onPageChange,
  });
  
  const state = useTableState({
    data,
    onRefresh,
    loading,
  });

  // Generate columns using service
  const columns = useMemo(() => {
    return generateColumns(constants);
  }, [constants]);

  // Get searchable fields using service  
  const searchableFields = useMemo(() => {
    const tableColumns = constants?.getTableColumns?.() || [];
    return getSearchableFields(tableColumns);
  }, [constants]);

  // Apply search filter
  const searchFilteredData = useMemo(() => {
    if (!enableSearch || !search.searchText) {
      return data;
    }
    return search.filterBySearch(data, searchableFields);
  }, [data, search.searchText, searchableFields, enableSearch, search.filterBySearch]);

  // Update pagination total when data changes - USE useEffect instead of useMemo
  useEffect(() => {
    pagination.setTotal(searchFilteredData.length);
  }, [searchFilteredData.length, pagination.setTotal]);

  // Get paginated data
  const displayData = useMemo(() => {
    return pagination.getPaginatedData(searchFilteredData);
  }, [searchFilteredData, pagination.getPaginatedData]);

  // Computed values
  const hasData = data.length > 0;
  const isEmpty = !state.loading && !hasData;
  const totalCount = data.length;

  return {
    // Data
    displayData,
    columns,
    
    // Specialized hooks
    search,
    selection,
    pagination,
    state,
    
    // Computed
    searchableFields,
    hasData,
    isEmpty,
    totalCount,
  };
} 