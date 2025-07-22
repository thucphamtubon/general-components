import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PaginationState } from '../types';
import { DEFAULT_PAGINATION } from '../constants';

interface TablePaginationStore {
  paginationConfig: Record<string, PaginationState>;
  setPaginationConfig: (tableId: string, paginationConfig: PaginationState) => void;
  resetPaginationConfig: (tableId: string, defaultPagination: PaginationState) => void;
}

export const useTablePaginationStore = create<TablePaginationStore>()(persist((set) => (
  {
    paginationConfig: {},
    setPaginationConfig: (tableId, newPagination) => set((state) => ({
      paginationConfig: {
        ...state.paginationConfig,
        [tableId]: newPagination,
      }
    })),
    resetPaginationConfig: (tableId, defaultPagination) => set((state) => ({
      paginationConfig: {
        ...state.paginationConfig,
        [tableId]: defaultPagination,
      },
    })),
  }),
  {
    name: 'table-pagination-storage',
    partialize: (state) => {
      const paginationConfig: Record<string, Partial<PaginationState>> = {};
      for (const tableId in state.paginationConfig) {
        if (Object.prototype.hasOwnProperty.call(state.paginationConfig, tableId)) {
          paginationConfig[tableId] = {
            pageSize: state.paginationConfig[tableId].pageSize,
          };
        }
      }
      return { paginationConfig };
    },
    onRehydrateStorage: () => (state, error) => {
      if (error) {
        console.error('Lỗi khi khôi phục trạng thái phân trang:', error);
        return;
      }
      if (state) {
        console.log('Đã khôi phục tuỳ chỉnh phân trang bảng');
      }
    },
  },
),
);

export const getTablePaginationState = (
  tableId: string = 'default-table',
  defaultPagination: PaginationState = DEFAULT_PAGINATION
): { paginationConfig: PaginationState } => {
  const store = useTablePaginationStore.getState();
  return {
    paginationConfig: store.paginationConfig[tableId] || defaultPagination,
  };
};
