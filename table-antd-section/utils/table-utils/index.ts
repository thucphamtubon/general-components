/**
 * Table Utilities index file
 * 
 * Note: Sorting and comparison utilities have been moved to common-utils
 */

// Core utils
export * from './core';

// Column utilities
export * from './column-utils';

// Filtering
export * from './filtering';
export * from './filter-utils';

// Search
export * from './search';

// Types
export * from './types';

// Re-export selected common utilities for backward compatibility
export { 
  compareValues,
  sorterId, 
  sorterText, 
  sorterNumber, 
  sorterDate,
  compareKeyArrays,
  removeDiacritics, 
  xoaDauVietNam
} from '../common-utils';
