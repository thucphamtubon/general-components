import { ITableColumn } from '../../types/Table.types';

/**
 * Lấy column theo id
 */
export const getColumnById = (columns: ITableColumn[], id: string): ITableColumn | undefined =>
  columns.find(col => col.id === id);

/**
 * Lấy các column hỗ trợ search
 */
export const getSearchableColumns = (columns: ITableColumn[]): ITableColumn[] =>
  columns.filter(col => col.isSearch);

/**
 * Lấy các column hiển thị (không ẩn)
 */
export const getVisibleColumns = (
  columns: ITableColumn[],
  hiddenColumns: string[] = []
): ITableColumn[] => columns.filter(col => !hiddenColumns.includes(col.id));

/**
 * Validate cấu hình column
 */
export const validateColumn = (column: ITableColumn): boolean =>
  !!(column && column.id && column.name);

/**
 * Sắp xếp column theo field
 */
export const sortColumns = (
  columns: ITableColumn[],
  orderBy: 'name' | 'id' = 'name'
): ITableColumn[] =>
  [...columns].sort((a, b) => {
    const valueA = a[orderBy] || '';
    const valueB = b[orderBy] || '';
    return valueA.localeCompare(valueB);
  });

/**
 * Lọc column theo điều kiện tuỳ ý
 */
export const filterColumns = (
  columns: ITableColumn[],
  criteria: (column: ITableColumn) => boolean
): ITableColumn[] => columns.filter(criteria);
