/**
 * Search utilities for table data
 */

import { compareValues } from '../../common-utils';
import { SearchMode, TableRecord } from '../../../types';
import { ColumnsType } from 'antd/lib/table';

/**
 * Lọc dữ liệu theo từ khóa tìm kiếm trên tất cả các trường có thể tìm kiếm
 */
export const filterDataBySearchTerm = <T extends TableRecord = TableRecord>(
  data: T[],
  searchTerm: string,
  searchableColumns?: string[],
  searchMode: SearchMode = SearchMode.CaseInsensitive
): T[] => {
  if (!searchTerm) return data;

  return data.filter(item => {
    // Nếu chỉ định searchableColumns, chỉ tìm trong các cột đó
    if (searchableColumns && searchableColumns.length > 0) {
      return searchableColumns.some(key => {
        const value = item[key];
        if (value === null || value === undefined) return false;
        return compareValues(String(value), searchTerm, searchMode);
      });
    }

    // Nếu không, tìm kiếm trên tất cả các trường string, number
    return Object.values(item).some(value => {
      if (value === null || value === undefined) return false;
      if (typeof value === 'object') return false;
      return compareValues(String(value), searchTerm, searchMode);
    });
  });
};

/**
 * Lấy danh sách key của các cột có thể tìm kiếm (searchable)
 */
export const getSearchableColumnKeys = <T extends TableRecord = TableRecord>(
  columns: ColumnsType<T>
): string[] => {
  const searchableColumns: string[] = [];

  const extractSearchableColumns = (cols: ColumnsType<T>) => {
    cols.forEach(column => {
      if ('dataIndex' in column && column.dataIndex && (column as any).searchable) {
        searchableColumns.push(column.dataIndex.toString());
      }
      if ('children' in column && column.children) {
        extractSearchableColumns(column.children);
      }
    });
  };

  extractSearchableColumns(columns);
  return searchableColumns;
};
