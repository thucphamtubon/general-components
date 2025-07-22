/**
 * Defines common types used across table utilities
 */

// Search mode for table searching
export enum SearchMode {
  ExactMatch = 'exact',
  CaseInsensitive = 'caseInsensitive',
  AccentInsensitive = 'accentInsensitive'
}

// Sorting types
export type SortType = 'id' | 'text' | 'number' | 'date';

// Type for table utility configuration
export interface TableUtilConfig {
  searchMode?: SearchMode;
}
