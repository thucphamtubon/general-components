import { Key, useEffect } from 'react';
import { SearchMode } from '../tuy-chon-table';
import { FilterState, PaginationState, SearchState, SortState, TablePaginationOptions, TableSearchOptions } from '../types/table.types';
import { useTableFiltersAndSorter } from './useTableFiltersAndSorter';
import { useTablePagination } from './useTablePagination';
import { useTableSearch } from './useTableSearch';
import { useTableSelection } from './useTableSelection';

// Import specialized hooks
import { useTableChangeHandler } from './table-orchestrator-hooks/useTableChangeHandler';
import { useTableClear } from './table-orchestrator-hooks/useTableClear';
import { useTableReset } from './table-orchestrator-hooks/useTableReset';
import { useTableRowSelectionConfig } from './table-orchestrator-hooks/useTableRowSelectionConfig';
import { useTableSearchHandler } from './table-orchestrator-hooks/useTableSearchHandler';
import { useTableVisibility } from './table-orchestrator-hooks/useTableVisibility';

interface UseTableOrchestratorOptions {
  defaultPagination?: PaginationState;
  defaultFilters?: FilterState;
  defaultSorter?: SortState;
  defaultSearchTerm?: string;
  defaultSearch?: SearchState;
  defaultSelectedRowKeys?: Key[];
  defaultVisibleColumnKeys?: string[];
  paginationOptions?: TablePaginationOptions;
  searchOptions?: TableSearchOptions;
  onSelectionChange?: (selectedRowKeys: Key[], selectedRows: any[]) => void;
  onFilterChange?: (filters: FilterState) => void;
  onSortChange?: (sorter: SortState) => void;
  onSearch?: (searchTerm: string) => void;
  externalSearchTerm?: string;
  dataSource?: any[];
  rowKey?: string;
  rowSelection?: boolean;
  columns?: any[];
}

export const useTableOrchestrator = (tableId: string, options: UseTableOrchestratorOptions = {}) => {
  const {
    defaultFilters,
    defaultSorter,
    defaultSearchTerm,
    defaultSearch,
    defaultSelectedRowKeys,
    defaultVisibleColumnKeys = [],
    searchOptions,
    onSelectionChange,
    onFilterChange,
    onSortChange,
    onSearch,
    externalSearchTerm,
    dataSource = [],
    rowKey = 'id',
    rowSelection = false,
    columns = [],
  } = options;

  // Use base hooks for filters, sorting, pagination, and selection
  const {
    filters,
    sorter,
    setFilters,
    setSorter,
    handleFilterChange,
    handleSorterChange,
    clearFilters,
    clearSorter
  } = useTableFiltersAndSorter(
    { filters: defaultFilters || {}, sorter: defaultSorter || {} },
    { tableId, saveUserPreferences: true }
  );

  const { paginationConfig, handlePaginationChange, resetPaginationConfig } = useTablePagination(tableId);

  const { selectedRowKeys, setSelectedRowKeys, handleSelectionChange, clearSelection } = useTableSelection(defaultSelectedRowKeys);

  // Prepare search state
  const searchState = defaultSearch || (defaultSearchTerm ? {
    searchTerm: defaultSearchTerm,
    searchMode: SearchMode.AccentInsensitive,
    visibleColumnKeys: defaultVisibleColumnKeys
  } : undefined);

  const {
    searchTerm,
    searchMode,
    visibleColumnKeys,
    setSearchTerm,
    setSearchMode,
    setVisibleColumnKeys,
    handleSearch,
    clearSearch
  } = useTableSearch(searchState, searchOptions, defaultVisibleColumnKeys);

  // Set up callbacks for filter and sorter changes
  useEffect(() => {
    if (onFilterChange) {
      onFilterChange(filters);
    }
  }, [filters, onFilterChange]);

  useEffect(() => {
    if (onSortChange) {
      onSortChange(sorter);
    }
  }, [sorter, onSortChange]);

  // Use specialized hooks
  const { handleTableChange } = useTableChangeHandler({
    handleFilterChange,
    handleSorterChange,
    handlePaginationChange
  });

  const { rowSelectionConfig } = useTableRowSelectionConfig({
    rowSelection,
    selectedRowKeys,
    handleSelectionChange,
    dataSource,
    rowKey,
    onSelectionChange
  });

  const { handleSearchChange, handleClearSearch } = useTableSearchHandler({
    searchTerm,
    setSearchTerm,
    setSearchMode,
    clearSearch,
    externalSearchTerm,
    onSearch
  });

  const { handleClearAll } = useTableClear({
    tableId,
    paginationConfig,
    clearSearch,
    handleTableChange
  });

  const { visibleColumns, handleColumnsVisibilityChange } = useTableVisibility({
    columns,
    defaultVisibleColumnKeys,
    visibleColumnKeys,
    setVisibleColumnKeys
  });

  const { resetTable } = useTableReset({
    resetPaginationConfig,
    clearFilters,
    clearSorter,
    clearSelection,
    clearSearch
  });

  return {
    filters,
    sorter,
    paginationConfig,
    selectedRowKeys,
    searchTerm,
    searchMode,
    visibleColumnKeys,
    visibleColumns,
    rowSelectionConfig,

    setFilters,
    setSorter,
    setSelectedRowKeys,
    setSearchTerm,
    setSearchMode,
    setVisibleColumnKeys,

    handleTableChange,
    handleSearch,
    handleSelectionChange,
    handleClearSearch,
    handleClearAll,
    handleSearchChange,
    handleColumnsVisibilityChange,

    resetTable,
    resetPaginationConfig,
    clearFilters,
    clearSorter,
    clearSelection,
    clearSearch,
  };
};

export default useTableOrchestrator;
