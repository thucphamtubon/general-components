/**
 * Table column utilities
 */

import { Breakpoint } from 'antd/lib/_util/responsiveObserve';
import { ColumnType, ColumnsType, TableRecord } from '../../../types';
import { deepCloneArray } from '../../common-utils/array-utils';

/**
 * Lọc các cột hiển thị theo breakpoint hiện tại (responsive)
 */
export const getResponsiveColumns = <T extends TableRecord = TableRecord>(
  columns: ColumnsType<T>,
  breakpoint: Breakpoint
): ColumnsType<T> => {
  return columns.filter(column => {
    // Nếu không có thuộc tính responsive thì luôn hiển thị cột đó
    if (!column.responsive || column.responsive.length === 0) return true;
    // Nếu có responsive, kiểm tra breakpoint hiện tại có nằm trong đó không
    return column.responsive.includes(breakpoint);
  });
};

/**
 * Clone sâu định nghĩa cột để tránh lỗi tham chiếu
 */
export const cloneColumns = <T extends TableRecord = TableRecord>(
  columns: ColumnsType<T>
): ColumnsType<T> => {
  return deepCloneArray(columns) as ColumnsType<T>;
};

/**
 * Thêm các thuộc tính mặc định cho tất cả các cột
 */
export const applyColumnDefaults = <T extends TableRecord = TableRecord>(
  columns: ColumnsType<T>,
  defaults: Partial<ColumnType<T>> = {}
): ColumnsType<T> => {
  return columns.map(column => {
    // Check if column is a ColumnGroupType with children
    if ('children' in column) {
      return {
        ...defaults,
        ...column,
        children: column.children ? applyColumnDefaults(column.children, defaults) : undefined,
      };
    }
    
    // Regular column without children
    return {
      ...defaults,
      ...column,
    };
  });
};

/**
 * Tìm column definition theo key
 */
export const findColumnByKey = <T extends TableRecord = TableRecord>(
  columns: ColumnsType<T>,
  key: string
): ColumnType<T> | undefined => {
  for (const column of columns) {
    if ('key' in column && column.key === key || 'dataIndex' in column && column.dataIndex === key) {
      return column as ColumnType<T>;
    }
    if ('children' in column && column.children) {
      const found = findColumnByKey(column.children, key);
      if (found) return found;
    }
  }
  return undefined;
};
