import { xoaDauVietNam } from '../utils/Table.logics';

export interface SearchServiceOptions {
  searchText: string;
  onSearch: (value: string) => void;
  onReset: () => void;
  placeholder?: string;
  className?: string;
}

/**
 * Filter data by search terms
 */
export function filterData(data: any[], searchText: string, searchableFields: string[]): any[] {
  if (!searchText.trim()) return data;

  const normalizedSearch = xoaDauVietNam(searchText.toLowerCase());

  return data.filter(item => {
    return searchableFields.some(field => {
      const value = item[field];
      if (value === null || value === undefined) return false;

      const normalizedValue = xoaDauVietNam(String(value).toLowerCase());
      return normalizedValue.includes(normalizedSearch);
    });
  });
}

/**
 * Get searchable fields from table columns
 */
export function getSearchableFields(columns: any[]): string[] {
  return columns
    .filter(col => col.isSearch)
    .map(col => col.id || col.dataIndex || col.key);
}

/**
 * Tạo filter function cho table column
 */
export function createFilterFunction(dataIndex: string) {
  return (value: string, record: any) => {
    const recordValue = record[dataIndex];
    if (!recordValue) return false;

    const normalizedValue = xoaDauVietNam(String(recordValue).toLowerCase());
    const normalizedSearchValue = xoaDauVietNam(String(value).toLowerCase());

    return normalizedValue.includes(normalizedSearchValue);
  };
}

/**
 * Normalize text for search comparison
 */
export function normalizeText(text: string): string {
  return xoaDauVietNam(String(text || '').toLowerCase());
}

/**
 * Check if text matches search term
 */
export function matchesSearch(text: string, searchTerm: string): boolean {
  if (!searchTerm) return true;

  const normalizedText = normalizeText(text);
  const normalizedSearch = normalizeText(searchTerm);

  return normalizedText.includes(normalizedSearch);
}

/**
 * Create search configuration for table columns
 */
export function createSearchConfig(dataIndex: string, searchText: string = '') {
  return {
    onFilter: createFilterFunction(dataIndex),
    filteredValue: searchText ? [searchText] : null,
  };
}

/**
 * Extract searchable content from record
 */
export function extractSearchableContent(record: any, fields: string[]): string {
  return fields
    .map(field => String(record[field] || ''))
    .join(' ')
    .toLowerCase();
} 