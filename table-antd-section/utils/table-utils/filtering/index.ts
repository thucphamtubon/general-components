/**
 * Filtering utilities for table data
 */

import { TableRecord } from '../../../types';
import { ColumnType, ColumnsType } from 'antd/lib/table';
import { findColumnByKey } from '../columns';

// findColumnByKey has been moved to columns/index.ts

/**
 * Áp dụng column filters lên dữ liệu
 */
export const applyColumnFilters = <T extends TableRecord = TableRecord>(
  data: T[],
  filters: Record<string, any>,
  columns: ColumnsType<T>
): T[] => {
  if (!filters || Object.keys(filters).length === 0) return data;

  return data.filter(record => {
    return Object.entries(filters).every(([columnKey, filterValue]) => {
      if (!filterValue || (Array.isArray(filterValue) && filterValue.length === 0)) {
        return true;
      }

      // Tìm column definition để lấy onFilter function
      const column = findColumnByKey(columns, columnKey);
      if (column && 'onFilter' in column && column.onFilter) {
        if (Array.isArray(filterValue)) {
          return filterValue.some(value => column.onFilter!(value, record));
        } else {
          return column.onFilter(filterValue, record);
        }
      }

      // Fallback: so sánh trực tiếp với giá trị trong record
      const recordValue = record[columnKey];
      if (Array.isArray(filterValue)) {
        return filterValue.includes(recordValue);
      }
      return recordValue === filterValue;
    });
  });
};
