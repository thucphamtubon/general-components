import React, { createContext, useCallback, useContext, useReducer, useMemo } from 'react';
import { TableContextType, TableContextState, UseTableState } from '../types/Table.types';
import { noop } from '../utils/Table.logics';

// Enhanced table state
interface TableGlobalState {
  tables: Record<string, UseTableState>;
}

// Action types
type TableAction =
  | { type: 'SET_SEARCH_TEXT'; payload: { tableId: string; searchText: string } }
  | { type: 'SET_FILTERS'; payload: { tableId: string; filters: Record<string, any> } }
  | { type: 'SET_SORTER'; payload: { tableId: string; sorter: any } }
  | { type: 'SET_PAGINATION'; payload: { tableId: string; pagination: Partial<UseTableState['pagination']> } }
  | { type: 'SET_SELECTED'; payload: { tableId: string; selectedRowKeys: React.Key[]; selectedRows: any[] } }
  | { type: 'SET_LOADING'; payload: { tableId: string; loading: boolean } }
  | { type: 'CLEAR_TABLE'; payload: { tableId: string } }
  | { type: 'RESET_TABLE'; payload: { tableId: string } };

// Initial state factory
const createInitialTableState = (): UseTableState => ({
  searchText: '',
  filters: {},
  sorter: null,
  pagination: {
    current: 1,
    pageSize: 10,
    total: 0,
  },
  selectedRowKeys: [],
  selectedRows: [],
  loading: false,
});

// Reducer
const tableReducer = (state: TableGlobalState, action: TableAction): TableGlobalState => {
  const { tableId } = action.payload;
  
  switch (action.type) {
    case 'SET_SEARCH_TEXT':
      return {
        ...state,
        tables: {
          ...state.tables,
          [tableId]: {
            ...state.tables[tableId] || createInitialTableState(),
            searchText: action.payload.searchText,
            pagination: {
              ...state.tables[tableId]?.pagination || createInitialTableState().pagination,
              current: 1, // Reset to first page when searching
            },
          },
        },
      };
      
    case 'SET_FILTERS':
      return {
        ...state,
        tables: {
          ...state.tables,
          [tableId]: {
            ...state.tables[tableId] || createInitialTableState(),
            filters: action.payload.filters,
            pagination: {
              ...state.tables[tableId]?.pagination || createInitialTableState().pagination,
              current: 1, // Reset to first page when filtering
            },
          },
        },
      };
      
    case 'SET_SORTER':
      return {
        ...state,
        tables: {
          ...state.tables,
          [tableId]: {
            ...state.tables[tableId] || createInitialTableState(),
            sorter: action.payload.sorter,
          },
        },
      };
      
    case 'SET_PAGINATION':
      return {
        ...state,
        tables: {
          ...state.tables,
          [tableId]: {
            ...state.tables[tableId] || createInitialTableState(),
            pagination: {
              ...state.tables[tableId]?.pagination || createInitialTableState().pagination,
              ...action.payload.pagination,
            },
          },
        },
      };
      
    case 'SET_SELECTED':
      return {
        ...state,
        tables: {
          ...state.tables,
          [tableId]: {
            ...state.tables[tableId] || createInitialTableState(),
            selectedRowKeys: action.payload.selectedRowKeys,
            selectedRows: action.payload.selectedRows,
          },
        },
      };
      
    case 'SET_LOADING':
      return {
        ...state,
        tables: {
          ...state.tables,
          [tableId]: {
            ...state.tables[tableId] || createInitialTableState(),
            loading: action.payload.loading,
          },
        },
      };
      
    case 'CLEAR_TABLE':
      return {
        ...state,
        tables: {
          ...state.tables,
          [tableId]: {
            ...state.tables[tableId] || createInitialTableState(),
            selectedRowKeys: [],
            selectedRows: [],
          },
        },
      };
      
    case 'RESET_TABLE':
      return {
        ...state,
        tables: {
          ...state.tables,
          [tableId]: createInitialTableState(),
        },
      };
      
    default:
      return state;
  }
};

// Create context
export const TableContext = createContext<TableContextType>({
  onClearSearchText: noop,
  setSearchSortFilter: noop,
  setTableFilters: noop,
  setSearchText: noop,
  getSearchText: () => '',
  setFilters: noop,
  getFilters: () => ({}),
  setSorter: noop,
  getSorter: () => null,
  setPagination: noop,
  getPagination: () => ({ current: 1, pageSize: 10, total: 0 }),
  setSelectedTable: noop,
  getSelectedTable: () => [],
  getSelectedRowKeys: () => [],
  clearSelectedTable: noop,
  setLoading: noop,
  getLoading: () => false,
  resetTable: noop,
  getTableState: () => createInitialTableState(),
  updateTable: noop,
});

type Props = {
  children: React.ReactNode;
  // Optional configuration
  defaultPageSize?: number;
  persistState?: boolean;
  storageKey?: string;
};

export const TableProvider: React.FC<Props> = ({
  children,
  defaultPageSize = 10,
  persistState = false,
  storageKey = 'table-state',
}) => {
  // Initialize state with optional persistence
  const getInitialState = useCallback((): TableGlobalState => {
    if (persistState && typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(storageKey);
        if (stored) {
          return JSON.parse(stored);
        }
      } catch (error) {
        console.warn('Failed to load persisted table state:', error);
      }
    }
    return { tables: {} };
  }, [persistState, storageKey]);

  const [state, dispatch] = useReducer(tableReducer, getInitialState());

  // Persist state when it changes
  React.useEffect(() => {
    if (persistState && typeof window !== 'undefined') {
      try {
        localStorage.setItem(storageKey, JSON.stringify(state));
      } catch (error) {
        console.warn('Failed to persist table state:', error);
      }
    }
  }, [state, persistState, storageKey]);

  // Helper function to get table state
  const getTableState = useCallback((tableId: string): UseTableState => {
    return state.tables[tableId] || createInitialTableState();
  }, [state]);

  // Search methods
  const setSearchText = useCallback((tableId: string, searchText: string) => {
    dispatch({ type: 'SET_SEARCH_TEXT', payload: { tableId, searchText } });
  }, []);

  const getSearchText = useCallback((tableId: string) => {
    return getTableState(tableId).searchText;
  }, [getTableState]);

  // Filter methods
  const setFilters = useCallback((tableId: string, filters: Record<string, any>) => {
    dispatch({ type: 'SET_FILTERS', payload: { tableId, filters } });
  }, []);

  const getFilters = useCallback((tableId: string) => {
    return getTableState(tableId).filters;
  }, [getTableState]);

  // Sorter methods
  const setSorter = useCallback((tableId: string, sorter: any) => {
    dispatch({ type: 'SET_SORTER', payload: { tableId, sorter } });
  }, []);

  const getSorter = useCallback((tableId: string) => {
    return getTableState(tableId).sorter;
  }, [getTableState]);

  // Pagination methods
  const setPagination = useCallback((tableId: string, pagination: Partial<UseTableState['pagination']>) => {
    dispatch({ type: 'SET_PAGINATION', payload: { tableId, pagination } });
  }, []);

  const getPagination = useCallback((tableId: string) => {
    const tableState = getTableState(tableId);
    return {
      ...tableState.pagination,
      pageSize: tableState.pagination.pageSize || defaultPageSize,
    };
  }, [getTableState, defaultPageSize]);

  // Selection methods
  const setSelectedTable = useCallback((tableId: string, selectedRowKeys: React.Key[], selectedRows: any[]) => {
    dispatch({ type: 'SET_SELECTED', payload: { tableId, selectedRowKeys, selectedRows } });
  }, []);

  const getSelectedTable = useCallback((modalId?: string, dataSource?: any[]) => {
    if (!modalId) return [];
    const tableState = getTableState(modalId);
    if (!dataSource) {
      return tableState.selectedRows;
    }
    return dataSource.filter((item: any) => 
      tableState.selectedRowKeys.includes(item.id)
    );
  }, [getTableState]);

  const getSelectedRowKeys = useCallback((tableId: string) => {
    return getTableState(tableId).selectedRowKeys;
  }, [getTableState]);

  const clearSelectedTable = useCallback((modalId?: string) => {
    if (!modalId) return;
    dispatch({ type: 'CLEAR_TABLE', payload: { tableId: modalId } });
  }, []);

  // Loading methods
  const setLoading = useCallback((tableId: string, loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: { tableId, loading } });
  }, []);

  const getLoading = useCallback((tableId: string) => {
    return getTableState(tableId).loading;
  }, [getTableState]);

  // Utility methods
  const resetTable = useCallback((tableId: string) => {
    dispatch({ type: 'RESET_TABLE', payload: { tableId } });
  }, []);

  const updateTable = useCallback((tableId: string, updates: Partial<UseTableState>) => {
    // Batch multiple updates for performance
    if (updates.searchText !== undefined) {
      dispatch({ type: 'SET_SEARCH_TEXT', payload: { tableId, searchText: updates.searchText } });
    }
    if (updates.filters !== undefined) {
      dispatch({ type: 'SET_FILTERS', payload: { tableId, filters: updates.filters } });
    }
    if (updates.sorter !== undefined) {
      dispatch({ type: 'SET_SORTER', payload: { tableId, sorter: updates.sorter } });
    }
    if (updates.pagination !== undefined) {
      dispatch({ type: 'SET_PAGINATION', payload: { tableId, pagination: updates.pagination } });
    }
    if (updates.selectedRowKeys !== undefined && updates.selectedRows !== undefined) {
      dispatch({ 
        type: 'SET_SELECTED', 
        payload: { 
          tableId, 
          selectedRowKeys: updates.selectedRowKeys, 
          selectedRows: updates.selectedRows 
        } 
      });
    }
    if (updates.loading !== undefined) {
      dispatch({ type: 'SET_LOADING', payload: { tableId, loading: updates.loading } });
    }
  }, []);

  // Legacy methods for backward compatibility
  const onClearSearchText = useCallback((tableId: string) => {
    setSearchText(tableId, '');
    setFilters(tableId, {});
    setSorter(tableId, null);
  }, [setSearchText, setFilters, setSorter]);

  const setSearchSortFilter = useCallback((tableId: string, methods: TableContextState) => {
    // This method is kept for backward compatibility
    // In the new version, we handle state internally
  }, []);

  const setTableFilters = useCallback((tableId: string, filters: Record<string, any>) => {
    setFilters(tableId, filters);
  }, [setFilters]);

  // Memoize context value
  const contextValue: TableContextType = useMemo(() => ({
    // Legacy methods
    onClearSearchText,
    setSearchSortFilter,
    setTableFilters,
    
    // New methods
    setSearchText,
    getSearchText,
    setFilters,
    getFilters,
    setSorter,
    getSorter,
    setPagination,
    getPagination,
    setSelectedTable,
    getSelectedTable,
    getSelectedRowKeys,
    clearSelectedTable,
    setLoading,
    getLoading,
    resetTable,
    getTableState,
    updateTable,
  }), [
    onClearSearchText,
    setSearchSortFilter,
    setTableFilters,
    setSearchText,
    getSearchText,
    setFilters,
    getFilters,
    setSorter,
    getSorter,
    setPagination,
    getPagination,
    setSelectedTable,
    getSelectedTable,
    getSelectedRowKeys,
    clearSelectedTable,
    setLoading,
    getLoading,
    resetTable,
    getTableState,
    updateTable,
  ]);

  return (
    <TableContext.Provider value={contextValue}>
      {children}
    </TableContext.Provider>
  );
};

export function useTable(): TableContextType {
  const context = useContext(TableContext);
  if (!context) {
    throw new Error('useTable must be used within a TableProvider');
  }
  return context;
}

// Hook for specific table instance
export function useTableInstance(tableId: string) {
  const context = useTable();
  
  return useMemo(() => ({
    searchText: context.getSearchText(tableId),
    setSearchText: (text: string) => context.setSearchText(tableId, text),
    
    filters: context.getFilters(tableId),
    setFilters: (filters: Record<string, any>) => context.setFilters(tableId, filters),
    
    sorter: context.getSorter(tableId),
    setSorter: (sorter: any) => context.setSorter(tableId, sorter),
    
    pagination: context.getPagination(tableId),
    setPagination: (pagination: Partial<UseTableState['pagination']>) => 
      context.setPagination(tableId, pagination),
    
    selectedRowKeys: context.getSelectedRowKeys(tableId),
    selectedRows: context.getSelectedTable(tableId),
    setSelected: (keys: React.Key[], rows: any[]) => 
      context.setSelectedTable(tableId, keys, rows),
    clearSelected: () => context.clearSelectedTable(tableId),
    
    loading: context.getLoading(tableId),
    setLoading: (loading: boolean) => context.setLoading(tableId, loading),
    
    reset: () => context.resetTable(tableId),
    state: context.getTableState(tableId),
    update: (updates: Partial<UseTableState>) => context.updateTable(tableId, updates),
  }), [context, tableId]);
}
