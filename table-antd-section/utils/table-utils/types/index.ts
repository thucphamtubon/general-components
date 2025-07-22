/**
 * Defines common types used across table utilities
 */

import { TableRecord as OriginalTableRecord } from '../../../types/table.types';
import { ColumnType as AntdColumnType, ColumnsType as AntdColumnsType } from 'antd/lib/table';

// Re-export types from main module for easier imports
export type TableRecord = OriginalTableRecord;

// Search mode for table searching
export type SearchMode = 'exact' | 'caseInsensitive' | 'accentInsensitive';

// Sorting types
export type SortType = 'id' | 'text' | 'number' | 'date';

// Column types for convenience
export type ColumnType<T> = AntdColumnType<T>;
export type ColumnsType<T = any> = AntdColumnsType<T>;

// Type for table utility configuration
export interface TableUtilConfig {
  searchMode?: SearchMode;
}
