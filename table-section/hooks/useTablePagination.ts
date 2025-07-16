import { useState, useCallback, useMemo } from 'react';

export interface PaginationConfig {
  current?: number;
  pageSize?: number;
  total?: number;
  showTotal?: (total: number, range: [number, number]) => string;
  showSizeChanger?: boolean;
  showQuickJumper?: boolean;
  showLessItems?: boolean;
  size?: 'default' | 'small';
  position?: ('topLeft' | 'topCenter' | 'topRight' | 'bottomLeft' | 'bottomCenter' | 'bottomRight')[];
  pageSizeOptions?: string[];
  onChange?: (page: number, pageSize: number) => void;
  onShowSizeChange?: (current: number, size: number) => void;
}

export interface UseTablePaginationReturn {
  currentPage: number;
  pageSize: number;
  total: number;
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setTotal: (total: number) => void;
  getPaginatedData: (data: any[]) => any[];
  getPaginationConfig: () => PaginationConfig | false;
  reset: () => void;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  totalPages: number;
  startIndex: number;
  endIndex: number;
}

export interface UseTablePaginationOptions {
  enabled?: boolean;
  initialPage?: number;
  initialPageSize?: number;
  showTotal?: (total: number, range: [number, number]) => string;
  showSizeChanger?: boolean;
  showQuickJumper?: boolean;
  pageSizeOptions?: string[];
  onPageChange?: (page: number, pageSize: number) => void;
  onPageSizeChange?: (current: number, size: number) => void;
}

export function useTablePagination(
  options: UseTablePaginationOptions = {}
): UseTablePaginationReturn {
  const {
    enabled = true,
    initialPage = 1,
    initialPageSize = 10,
    showTotal = (total, range) => `${range[0]}-${range[1]} của ${total} mục`,
    showSizeChanger = true,
    showQuickJumper = true,
    pageSizeOptions = ['10', '20', '50', '100'],
    onPageChange,
    onPageSizeChange,
  } = options;

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [total, setTotal] = useState(0);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    onPageChange?.(page, pageSize);
  }, [pageSize, onPageChange]);

  const handlePageSizeChange = useCallback((size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page when page size changes
    onPageSizeChange?.(1, size);
  }, [onPageSizeChange]);

  const getPaginatedData = useCallback((data: any[]) => {
    if (!enabled) return data;
    
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return data.slice(start, end);
  }, [enabled, currentPage, pageSize]);

  const getPaginationConfig = useCallback((): PaginationConfig | false => {
    if (!enabled) return false;

    return {
      current: currentPage,
      pageSize: pageSize,
      total: total,
      showTotal: showTotal,
      showSizeChanger: showSizeChanger,
      showQuickJumper: showQuickJumper,
      pageSizeOptions: pageSizeOptions,
      onChange: handlePageChange,
      onShowSizeChange: handlePageSizeChange,
    };
  }, [
    enabled,
    currentPage,
    pageSize,
    total,
    showTotal,
    showSizeChanger,
    showQuickJumper,
    pageSizeOptions,
    handlePageChange,
    handlePageSizeChange,
  ]);

  const reset = useCallback(() => {
    setCurrentPage(initialPage);
    setPageSize(initialPageSize);
    setTotal(0);
  }, [initialPage, initialPageSize]);

  const totalPages = useMemo(() => {
    return Math.ceil(total / pageSize);
  }, [total, pageSize]);

  const hasNextPage = useMemo(() => {
    return currentPage < totalPages;
  }, [currentPage, totalPages]);

  const hasPreviousPage = useMemo(() => {
    return currentPage > 1;
  }, [currentPage]);

  const startIndex = useMemo(() => {
    return (currentPage - 1) * pageSize;
  }, [currentPage, pageSize]);

  const endIndex = useMemo(() => {
    return Math.min(startIndex + pageSize - 1, total - 1);
  }, [startIndex, pageSize, total]);

  return {
    currentPage,
    pageSize,
    total,
    setCurrentPage: handlePageChange,
    setPageSize: handlePageSizeChange,
    setTotal,
    getPaginatedData,
    getPaginationConfig,
    reset,
    hasNextPage,
    hasPreviousPage,
    totalPages,
    startIndex,
    endIndex,
  };
} 