import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SearchMode } from '../tuy-chon-table';
import { DEFAULT_SEARCH } from '../constants';

export interface SearchState {
  searchTerm: string;
  searchMode: SearchMode;
  visibleColumnKeys?: string[];
}

interface TableSearchStore {
  searchConfig: Record<string, SearchState>;
  setSearchConfig: (tableId: string, searchConfig: SearchState) => void;
  resetSearchConfig: (tableId: string, defaultSearch: SearchState) => void;
  setSearchTerm: (tableId: string, searchTerm: string) => void;
  setSearchMode: (tableId: string, searchMode: SearchMode) => void;
  setVisibleColumnKeys: (tableId: string, visibleColumnKeys: string[]) => void;
}

export const useTableSearchStore = create<TableSearchStore>()(persist((set) => (
  {
    searchConfig: {},
    setSearchConfig: (tableId, newSearch) => set((state) => ({
      searchConfig: {
        ...state.searchConfig,
        [tableId]: newSearch,
      }
    })),
    resetSearchConfig: (tableId, defaultSearch) => set((state) => ({
      searchConfig: {
        ...state.searchConfig,
        [tableId]: defaultSearch,
      },
    })),
    setSearchTerm: (tableId, searchTerm) => set((state) => ({
      searchConfig: {
        ...state.searchConfig,
        [tableId]: {
          ...state.searchConfig[tableId],
          searchTerm,
        },
      },
    })),
    setSearchMode: (tableId, searchMode) => set((state) => ({
      searchConfig: {
        ...state.searchConfig,
        [tableId]: {
          ...state.searchConfig[tableId],
          searchMode,
        },
      },
    })),
    setVisibleColumnKeys: (tableId, visibleColumnKeys) => set((state) => ({
      searchConfig: {
        ...state.searchConfig,
        [tableId]: {
          ...state.searchConfig[tableId],
          visibleColumnKeys,
        },
      },
    })),
  }),
  {
    name: 'table-search-storage',
    partialize: (state) => {
      const searchConfig: Record<string, Partial<SearchState>> = {};
      for (const tableId in state.searchConfig) {
        if (Object.prototype.hasOwnProperty.call(state.searchConfig, tableId)) {
          searchConfig[tableId] = {
            searchTerm: state.searchConfig[tableId].searchTerm,
            searchMode: state.searchConfig[tableId].searchMode,
            visibleColumnKeys: state.searchConfig[tableId].visibleColumnKeys,
            // Lưu searchTerm vào localStorage để giữ lại search text khi reload
          };
        }
      }
      return { searchConfig };
    },
    onRehydrateStorage: () => (state, error) => {
      if (error) {
        console.error('Lỗi khi khôi phục trạng thái tìm kiếm:', error);
        return;
      }
      if (state) {
        console.log('Đã khôi phục tuỳ chỉnh tìm kiếm bảng');
      }
    },
  },
),
);

export const getTableSearchState = (
  tableId: string = 'default-table',
  defaultSearch: SearchState = DEFAULT_SEARCH
): { searchConfig: SearchState } => {
  const store = useTableSearchStore.getState();
  const persistedConfig = store.searchConfig[tableId];

  // Merge với default, giữ lại searchTerm, searchMode và visibleColumnKeys từ persisted state
  const searchConfig = {
    ...defaultSearch,
    ...(persistedConfig && {
      searchTerm: persistedConfig.searchTerm,
      searchMode: persistedConfig.searchMode,
      ...(persistedConfig.visibleColumnKeys && { visibleColumnKeys: persistedConfig.visibleColumnKeys })
    }),
  };

  return {
    searchConfig,
  };
};