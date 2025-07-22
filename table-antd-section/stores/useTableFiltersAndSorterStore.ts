import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { FilterState, SortState } from '../types';
import { DEFAULT_FILTERS_AND_SORTER } from '../constants';

export interface FiltersAndSorterState {
  tableId: string;
  filters: FilterState;
  sorter: SortState;
}

interface TableFiltersAndSorterStore {
  // Cấu hình lưu trữ filters và sorters cho từng bảng
  filtersAndSorterConfig: Record<string, FiltersAndSorterState>;
  
  // Phương thức quản lý cấu hình
  setFiltersAndSorterConfig: (tableId: string, config: FiltersAndSorterState) => void;
  resetFiltersAndSorterConfig: (tableId: string, defaultConfig: FiltersAndSorterState) => void;
  
  // Phương thức quản lý filters và sorter
  setFilters: (tableId: string, filters: FilterState) => void;
  setSorter: (tableId: string, sorter: SortState) => void;
  clearFilters: (tableId: string) => void;
  clearSorter: (tableId: string) => void;
  clearAll: (tableId: string) => void;
  
  // Phương thức mới để quản lý filter cho từng cột
  getColumnFilterValue: (tableId: string, columnKey: string) => any[] | undefined;
  setColumnFilterValue: (tableId: string, columnKey: string, value: any[]) => void;
  clearColumnFilter: (tableId: string, columnKey: string) => void;
}

export const useTableFiltersAndSorterStore = create<TableFiltersAndSorterStore>()(persist((set, get) => (
  {
    filtersAndSorterConfig: {},
    
    // Phương thức quản lý cấu hình
    setFiltersAndSorterConfig: (tableId, newConfig) => set((state) => ({
      filtersAndSorterConfig: {
        ...state.filtersAndSorterConfig,
        [tableId]: newConfig,
      }
    })),
    
    resetFiltersAndSorterConfig: (tableId, defaultConfig) => set((state) => ({
      filtersAndSorterConfig: {
        ...state.filtersAndSorterConfig,
        [tableId]: defaultConfig,
      },
    })),
    
    // Phương thức quản lý filters và sorter
    setFilters: (tableId, filters) => set((state) => ({
      filtersAndSorterConfig: {
        ...state.filtersAndSorterConfig,
        [tableId]: {
          ...state.filtersAndSorterConfig[tableId],
          filters,
        },
      },
    })),
    
    setSorter: (tableId, sorter) => set((state) => ({
      filtersAndSorterConfig: {
        ...state.filtersAndSorterConfig,
        [tableId]: {
          ...state.filtersAndSorterConfig[tableId],
          sorter,
        },
      },
    })),
    
    clearFilters: (tableId) => set((state) => {
      const currentConfig = state.filtersAndSorterConfig[tableId] || { tableId, filters: {}, sorter: {} };
      return {
        filtersAndSorterConfig: {
          ...state.filtersAndSorterConfig,
          [tableId]: {
            ...currentConfig,
            filters: {},
          },
        },
      };
    }),
    
    clearSorter: (tableId) => set((state) => {
      const currentConfig = state.filtersAndSorterConfig[tableId] || { tableId, filters: {}, sorter: {} };
      return {
        filtersAndSorterConfig: {
          ...state.filtersAndSorterConfig,
          [tableId]: {
            ...currentConfig,
            sorter: {},
          },
        },
      };
    }),
    
    clearAll: (tableId) => set((state) => {
      const currentConfig = state.filtersAndSorterConfig[tableId] || { tableId, filters: {}, sorter: {} };
      return {
        filtersAndSorterConfig: {
          ...state.filtersAndSorterConfig,
          [tableId]: {
            tableId,
            filters: {},
            sorter: {},
          },
        },
      };
    }),
    
    // Phương thức mới để quản lý filter cho từng cột
    getColumnFilterValue: (tableId, columnKey) => {
      const state = get();
      return state.filtersAndSorterConfig[tableId]?.filters?.[columnKey];
    },
    
    setColumnFilterValue: (tableId, columnKey, value) => set((state) => {
      const currentFilters = state.filtersAndSorterConfig[tableId]?.filters || {};
      
      return {
        filtersAndSorterConfig: {
          ...state.filtersAndSorterConfig,
          [tableId]: {
            ...state.filtersAndSorterConfig[tableId],
            filters: {
              ...currentFilters,
              [columnKey]: value
            },
          },
        },
      };
    }),
    
    clearColumnFilter: (tableId, columnKey) => set((state) => {
      // Khởi tạo filters hiện tại, hoặc object rỗng nếu không có
      const currentFilters = state.filtersAndSorterConfig[tableId]?.filters 
        ? { ...state.filtersAndSorterConfig[tableId].filters }
        : {};
      
      // Xóa filter cho cột cụ thể
      delete currentFilters[columnKey];
      
      return {
        filtersAndSorterConfig: {
          ...state.filtersAndSorterConfig,
          [tableId]: {
            ...state.filtersAndSorterConfig[tableId],
            filters: currentFilters,
          },
        },
      };
    }),
  }),
  {
    name: 'table-filters-sorter-storage',
    partialize: (state) => {
      const filtersAndSorterConfig: Record<string, Partial<FiltersAndSorterState>> = {};
      for (const tableId in state.filtersAndSorterConfig) {
        if (Object.prototype.hasOwnProperty.call(state.filtersAndSorterConfig, tableId)) {
          filtersAndSorterConfig[tableId] = {
            filters: state.filtersAndSorterConfig[tableId].filters,
            sorter: state.filtersAndSorterConfig[tableId].sorter,
            // Lưu filters và sorter vào localStorage để giữ lại khi reload
          };
        }
      }
      return { filtersAndSorterConfig };
    },
    onRehydrateStorage: () => (state, error) => {
      if (error) {
        console.error('Lỗi khi khôi phục trạng thái filters và sorter:', error);
        return;
      }
      if (state) {
        console.log('Đã khôi phục tuỳ chỉnh filters và sorter bảng');
      }
    },
  },
),
);

export const getTableFiltersAndSorterState = (
  tableId: string = 'default-table',
  defaultConfig: FiltersAndSorterState = DEFAULT_FILTERS_AND_SORTER
): { filtersAndSorterConfig: FiltersAndSorterState } => {
  const store = useTableFiltersAndSorterStore.getState();
  const persistedConfig = store.filtersAndSorterConfig[tableId];

  // Merge với default, giữ lại filters và sorter từ persisted state
  const filtersAndSorterConfig = {
    ...defaultConfig,
    ...(persistedConfig && {
      filters: persistedConfig.filters || {},
      sorter: persistedConfig.sorter || {},
    }),
  };

  return {
    filtersAndSorterConfig,
  };
};