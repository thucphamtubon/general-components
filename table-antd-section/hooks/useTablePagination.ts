import { useCallback, useEffect } from 'react';
import { getTablePaginationState, useTablePaginationStore } from '../stores/useTablePaginationStore';
import { TablePaginationConfig, UseTablePaginationReturn, PaginationState } from '../types';
import { DEFAULT_PAGINATION } from '../constants';

export interface TablePaginationOptions {
  defaultPagination?: PaginationState;
}

export const useTablePagination = (tableId: string, options: TablePaginationOptions = {}): UseTablePaginationReturn => {
  const {
    defaultPagination
  } = options;

  const {
    setPaginationConfig,
    resetPaginationConfig: resetStorePagination,
  } = useTablePaginationStore();

  useEffect(() => {
    const persistedState = getTablePaginationState(tableId);
    const initialState = { ...DEFAULT_PAGINATION, ...defaultPagination, ...persistedState.paginationConfig };

    setPaginationConfig(tableId, initialState);
  }, [tableId, defaultPagination]);

  const state = useTablePaginationStore(state => ({
    paginationConfig: state.paginationConfig[tableId] || DEFAULT_PAGINATION,
  }));

  // Xử lý thay đổi trạng thái phân trang
  const handlePaginationChange = useCallback((page: number, pageSize?: number) => {
    if (
      state.paginationConfig.current === page &&
      (!pageSize || state.paginationConfig.pageSize === pageSize)
    ) {
      return;
    }

    const newPageSize = pageSize || state.paginationConfig.pageSize;
    setPaginationConfig(tableId, {
      ...state.paginationConfig,
      current: page,
      pageSize: newPageSize,
    });
  }, [tableId, state.paginationConfig, setPaginationConfig]);

  // Đặt lại cấu hình phân trang về mặc định
  const resetPaginationConfig = useCallback(() => {
    resetStorePagination(tableId, DEFAULT_PAGINATION);
  }, [tableId, resetStorePagination]);
  
  // Xử lý xóa tất cả cài đặt bảng liên quan đến phân trang
  const handleClearAll = useCallback(() => {
    resetPaginationConfig();
  }, [resetPaginationConfig]);

  const paginationConfig: TablePaginationConfig = {
    ...state.paginationConfig,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total) => {
      const start = (state.paginationConfig.current - 1) * state.paginationConfig.pageSize + 1;
      const end = Math.min(state.paginationConfig.current * state.paginationConfig.pageSize, total || 0);
      return `${start}-${end} của ${total} bản ghi`;
    },
    itemRender: (page, type, originalElement) => {
      if (type === 'prev') {
        return originalElement;
      }
      if (type === 'next') {
        return originalElement;
      }
      if (type === 'page') {
        return originalElement;
      }
      return originalElement;
    },
  };

  return {
    paginationConfig,
    handlePaginationChange,
    resetPaginationConfig,
  };
};
