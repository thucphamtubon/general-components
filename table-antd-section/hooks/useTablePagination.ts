import { useCallback, useEffect } from 'react';
import { getTablePaginationState, useTablePaginationStore } from '../stores/useTablePaginationStore';
import { TablePaginationConfig, UseTablePaginationReturn } from '../types/table.types';
import { DEFAULT_PAGINATION } from '../constants';

export const useTablePagination = (tableId: string): UseTablePaginationReturn => {

  const {
    setPaginationConfig,
    resetPaginationConfig: resetStorePagination,
  } = useTablePaginationStore();

  useEffect(() => {
    const persistedState = getTablePaginationState(tableId);
    const initialState = { ...DEFAULT_PAGINATION, ...persistedState.paginationConfig };

    setPaginationConfig(tableId, initialState);
  }, [tableId]);

  const state = useTablePaginationStore(state => ({
    paginationConfig: state.paginationConfig[tableId] || DEFAULT_PAGINATION,
  }));

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

  const resetPaginationConfig = useCallback(() => {
    resetStorePagination(tableId, DEFAULT_PAGINATION);
  }, [tableId, resetStorePagination]);

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
