import type { ColumnType, SortOrder, TableLocale } from 'antd/lib/table/interface';
import React, { Dispatch } from "react";

// Core types for the table module
export interface IConstantItem {
  id: string;
  name: string;
  [key: string]: any;
}

/**
 * Interface representing a table column using Ant Design's ColumnType
 */
export interface ITableColumn extends ColumnType<any> {
  // Nested columns structure (already part of ColumnType but needs to be explicitly typed)
  children?: ITableColumn[];
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

// Internal state types aligned with Ant Design Table
export interface TableState {
  selectedRowKeys: Record<string, React.Key[]>;
  [key: string]: any;
}

export interface AppState {
  table: TableState;
  hideColumns: Record<string, Record<string, boolean>>;
  [key: string]: any;
}

/**
 * State interface for useTable hook aligned with Ant Design Table
 */
export interface UseTableState {
  // Search state
  searchText: string;
  
  // Filter state - aligns with Ant Design's FilterValue type
  filters: Record<string, (React.Key | boolean)[]>;
  
  // Sorter state - aligns with Ant Design's SorterResult
  sorter: {
    column?: ITableColumn;
    order?: SortOrder;
    field?: React.Key | readonly React.Key[]; // field refers to dataIndex in Ant Design
    columnKey?: React.Key;
  } | null;
  
  // Pagination state - aligns with Ant Design's TablePaginationConfig
  pagination: {
    current: number;
    pageSize: number;
    total: number;
    position?: ('topLeft' | 'topCenter' | 'topRight' | 'bottomLeft' | 'bottomCenter' | 'bottomRight')[];
    showSizeChanger?: boolean;
    showQuickJumper?: boolean;
    showTotal?: (total: number, range: [number, number]) => React.ReactNode;
  };
  
  // Selection state
  selectedRowKeys: React.Key[];
  selectedRows: any[];
  
  // Loading state
  loading: boolean;
}

/**
 * Table context types aligned with Ant Design Table API
 */
export interface TableContextState {
  setFilteredInfo?: (values?: Record<string, (React.Key | boolean)[]>) => void;
  setSortedInfo?: (values?: UseTableState['sorter']) => void;
  setSearchText?: (text: string) => void;
}

export interface TableContextType {
  // Legacy methods
  onClearSearchText: (tableId: string) => void;
  setSearchSortFilter: (tableId: string, methods: TableContextState) => void;
  setTableFilters: (tableId: string, tableFilters: Record<string, (React.Key | boolean)[]>) => void;

  // Search methods
  setSearchText: (tableId: string, searchText: string) => void;
  getSearchText: (tableId: string) => string;
  
  // Filter methods - updated to align with Ant Design's FilterValue type
  setFilters: (tableId: string, filters: Record<string, (React.Key | boolean)[]>) => void;
  getFilters: (tableId: string) => Record<string, (React.Key | boolean)[]>;
  
  // Sorter methods - updated to align with Ant Design's SorterResult
  setSorter: (tableId: string, sorter: UseTableState['sorter']) => void;
  getSorter: (tableId: string) => UseTableState['sorter'];
  
  // Pagination methods - aligned with Ant Design's TablePaginationConfig
  setPagination: (tableId: string, pagination: Partial<UseTableState['pagination']>) => void;
  getPagination: (tableId: string) => UseTableState['pagination'];
  
  // Selection methods - aligned with Ant Design's rowSelection
  setSelectedTable: (tableId: string, selectedRowKeys: React.Key[], selectedRows: any[]) => void;
  getSelectedTable: (tableId?: string, dataSource?: any[]) => any[];
  getSelectedRowKeys: (tableId: string) => React.Key[];
  clearSelectedTable: (tableId?: string) => void;
  
  // Loading methods
  setLoading: (tableId: string, loading: boolean) => void;
  getLoading: (tableId: string) => boolean;
  
  // Utility methods
  resetTable: (tableId: string) => void;
  getTableState: (tableId: string) => UseTableState;
  
  // Performance methods
  updateTable: (tableId: string, updates: Partial<UseTableState>) => void;
}

/**
 * Hook return type to provide Table context functionality
 */
export interface UseTableReturn extends TableContextType {}

/**
 * Input options type for handling path-based operations
 */
export interface InputOptions {
  deletedPaths?: any[];
  activePaths?: any[];
  [key: string]: any;
}

/**
 * Application dispatch and state types for Redux integration
 */
export type AppDispatch = Dispatch<any>;
export type AppStateSelector<T> = (state: AppState) => T;

/**
 * Utility types
 */
export type Noop = () => void;

/**
 * Table change handler type definition aligned with Ant Design Table
 */
export type OnTableChange = (
  pagination: UseTableState['pagination'],
  filters: Record<string, (React.Key | boolean)[]>,
  sorter: UseTableState['sorter'],
  extra: { currentDataSource: any[]; action: 'paginate' | 'sort' | 'filter' }
) => void;

/**
 * Row selection change handler type definition aligned with Ant Design Table
 */
export type OnSelectChange = (selectedRowKeys: React.Key[], selectedRows: any[]) => void;

/**
 * Table locale customization aligned with Ant Design TableLocale
 */
export interface EnhancedTableLocale extends TableLocale {
  // Add any custom locale properties here
  searchPlaceholder?: string;
  selectionText?: string;
  clearSelectionText?: string;
}