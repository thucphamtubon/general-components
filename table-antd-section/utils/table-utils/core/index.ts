/**
 * Core table utilities
 */

import { ColumnGroupType, ColumnsType, ColumnType } from 'antd/lib/table';
import { TableRecord } from '../../../types';

// Type guard for column with children
function hasChildren<T>(column: ColumnType<T> | ColumnGroupType<T>): column is ColumnGroupType<T> {
  return 'children' in column && Array.isArray((column as ColumnGroupType<T>).children);
}

/**
 * Lọc các cột theo breakpoint (loại trừ)
 */
export const filterColumnsByBreakpointExclusion = <T extends TableRecord = TableRecord>(
  columns: ColumnsType<T>,
  breakpoint: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'
): ColumnsType<T> => {
  return columns
    .filter(column => {
      if (!(column as any).responsive) return true;
      const responsive = (column as any).responsive as string[];
      return !responsive.includes(breakpoint);
    })
    .map(column => {
      const newColumn = { ...column };
      if (hasChildren(column)) {
        (newColumn as ColumnGroupType<T>).children = filterColumnsByBreakpointExclusion(column.children, breakpoint);
      }
      return newColumn;
    });
};

/**
 * So sánh hai mảng key
 */
export const compareKeyArrays = (array1: string[], array2: string[]): boolean => {
  if (array1.length !== array2.length) return false;
  for (const item of array1) {
    if (!array2.includes(item)) return false;
  }
  return true;
};

/**
 * Deep clone columns definition
 */
export const deepCloneColumns = <T extends TableRecord = TableRecord>(
  columns: ColumnsType<T>
): ColumnsType<T> => {
  return columns.map(col => {
    const newCol = { ...col };
    if (hasChildren(col)) {
      (newCol as ColumnGroupType<T>).children = deepCloneColumns(col.children);
    }
    return newCol;
  });
};

/**
 * Apply default properties for all columns
 */
export const applyDefaultColumnProps = <T extends TableRecord = TableRecord>(
  columns: ColumnsType<T>,
  defaultProps: Partial<ColumnType<T>>
): ColumnsType<T> => {
  return columns.map(col => {
    const newCol = { ...defaultProps, ...col };
    if (hasChildren(col)) {
      (newCol as ColumnGroupType<T>).children = applyDefaultColumnProps(col.children, defaultProps);
    }
    return newCol;
  });
};
