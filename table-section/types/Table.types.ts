import React, { Dispatch } from "react";

// Core types for the table module
export interface IConstantItem {
  id: string;
  name: string;
  [key: string]: any;
}

export interface ITableColumn {
  id: string;
  name: string;
  isSearch?: boolean;
  render?: (cell: any, row: any, index: number, props?: any) => React.ReactNode;
  children?: ITableColumn[];
  classNameSearch?: string;
  colSpan?: number;
  cellClassName?: string;
  valueStyle?: React.CSSProperties;
  valueClassName?: string;
  width?: number | string;
  fixed?: 'left' | 'right' | boolean;
  align?: 'left' | 'right' | 'center';
  sorter?: boolean | ((a: any, b: any) => number);
  filters?: Array<{ text: string; value: any }>;
  onFilter?: (value: any, record: any) => boolean;
}

export interface IConstants {
  getTableColumns?: () => ITableColumn[];
  [key: string]: any;
}

// Action types
type ActivePayload = {
  paths?: any[];
  id: string;
  propertyName: string;
  checked?: boolean;
}

type DeletePayload = {
  paths?: any[];
  updatedItem: any;
}

export interface ActionsReturn {
  onAddAsync?: (payload: any) => (dispatch: Dispatch<any>) => Promise<any>;
  onUpdateAsync?: (payload: any) => (dispatch: Dispatch<any>) => Promise<any>;
  onActiveAsync?: (payload: ActivePayload) => (dispatch: Dispatch<any>) => Promise<any>;
  onDeleteAsync?: (payload: DeletePayload) => (dispatch: Dispatch<any>) => Promise<any>;
}

// Internal state types
export interface TableState {
  selectedRowKeys: Record<string, React.Key[]>;
  [key: string]: any;
}

export interface AppState {
  table: TableState;
  hideColumns: Record<string, Record<string, boolean>>;
  [key: string]: any;
}

// State for useTable hook
export interface UseTableState {
  searchText: string;
  filters: Record<string, any>;
  sorter: any;
  pagination: {
    current: number;
    pageSize: number;
    total: number;
  };
  selectedRowKeys: React.Key[];
  selectedRows: any[];
  loading: boolean;
}

// Table context types
export interface TableContextState {
  setFilteredInfo?: (values?: any) => void;
  setSortedInfo?: (values?: any) => void;
  setSearchText?: any;
}

export interface TableContextType {
  // Legacy methods
  onClearSearchText: (modalId: string) => void;
  setSearchSortFilter: (modalId: any, methods: TableContextState) => void;
  setTableFilters: (tableId: string, tableFilters: any) => void;

  // Search methods
  setSearchText: (tableId: string, searchText: string) => void;
  getSearchText: (tableId: string) => string;
  
  // Filter methods
  setFilters: (tableId: string, filters: Record<string, any>) => void;
  getFilters: (tableId: string) => Record<string, any>;
  
  // Sorter methods
  setSorter: (tableId: string, sorter: any) => void;
  getSorter: (tableId: string) => any;
  
  // Pagination methods
  setPagination: (tableId: string, pagination: Partial<UseTableState['pagination']>) => void;
  getPagination: (tableId: string) => UseTableState['pagination'];
  
  // Selection methods
  setSelectedTable: (tableId: string, selectedRowKeys: React.Key[], selectedRows: any[]) => void;
  getSelectedTable: (modalId?: string, dataSource?: any[]) => any[];
  getSelectedRowKeys: (tableId: string) => React.Key[];
  clearSelectedTable: (modalId?: string) => void;
  
  // Loading methods
  setLoading: (tableId: string, loading: boolean) => void;
  getLoading: (tableId: string) => boolean;
  
  // Utility methods
  resetTable: (tableId: string) => void;
  getTableState: (tableId: string) => UseTableState;
  
  // Performance methods
  updateTable: (tableId: string, updates: Partial<UseTableState>) => void;
}

// Hook types
export interface UseTableReturn extends TableContextType {}

// Input options type
export interface InputOptions {
  deletedPaths?: any[];
  activePaths?: any[];
  [key: string]: any;
}

// App dispatch and state types (internal implementations)
export type AppDispatch = Dispatch<any>;
export type AppStateSelector<T> = (state: AppState) => T;

// Utility types
export type Noop = () => void;