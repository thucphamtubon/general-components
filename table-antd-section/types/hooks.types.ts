import { Key } from 'react';
import { SorterResult } from 'antd/lib/table/interface';
import { FilterState, SortState } from './state.types';
import { TablePaginationConfig } from './base.types';
import { SearchMode } from './table-utils.types';

// Kiểu trả về của hook bộ lọc
export interface UseTableFiltersReturn {
  filters: FilterState; // Trạng thái bộ lọc
  setFilters: (filters: FilterState) => void; // Đặt lại bộ lọc
  handleFilterChange: (filters: Record<string, any>) => void; // Xử lý khi thay đổi bộ lọc
  clearFilters: () => void; // Xoá tất cả bộ lọc
}

export interface UseTableSorterReturn {
  sorter: SortState;
  setSorter: (sorter: SortState) => void;
  handleSorterChange: (sorter: SorterResult<any> | SorterResult<any>[]) => void;
  clearSorter: () => void;
}

export interface UseTablePaginationReturn {
  paginationConfig: TablePaginationConfig;
  handlePaginationChange: (page: number, pageSize?: number) => void;
  resetPaginationConfig: () => void;
}

export interface UseTableSelectionReturn {
  selectedRowKeys: Key[];
  setSelectedRowKeys: (keys: Key[]) => void;
  handleSelectionChange: (selectedRowKeys: Key[]) => void;
  clearSelection: () => void;
}

export interface UseTableSearchReturn {
  searchTerm: string;
  debouncedSearchTerm: string;
  searchMode: SearchMode;
  visibleColumnKeys: string[];
  setSearchTerm: (term: string) => void;
  setSearchMode: (mode: SearchMode) => void;
  setVisibleColumnKeys: (keys: string[]) => void;
  handleSearch: (term: string, mode?: SearchMode) => void;
  clearSearch: () => void;
}
