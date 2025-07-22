import { Breakpoint } from 'antd/lib/_util/responsiveObserve';
import { Key } from 'react';
import { ColumnType, ColumnsType, TableRecord } from '../types/table.types';

/**
 * Tiện ích loại bỏ dấu tiếng Việt để tìm kiếm dễ dàng hơn
 */
export const removeDiacritics = (str: string): string => {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
};

/**
 * Tiện ích loại bỏ dấu tiếng Việt mở rộng
 * Đối với tìm kiếm không phân biệt chữ hoa/thường và có dấu hay không có dấu
 */
export const xoaDauVietNam = (str: string): string => {
  if (!str) return '';
  return removeDiacritics(str.toLowerCase());
};

/**
 * Lọc dữ liệu theo từ khóa tìm kiếm trên tất cả các trường có thể tìm kiếm
 */
export const filterDataBySearchTerm = <T extends TableRecord = TableRecord>(
  data: T[],
  searchTerm: string,
  searchableColumns?: string[],
  searchMode: 'exact' | 'caseInsensitive' | 'accentInsensitive' = 'caseInsensitive'
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
 * Hàm so sánh giá trị theo chế độ tìm kiếm
 */
export const compareValues = (
  value: string,
  search: string,
  mode: 'exact' | 'caseInsensitive' | 'accentInsensitive'
): boolean => {
  // Tìm chính xác chữ hoa chữ thường
  if (mode === 'exact') {
    return value.includes(search);
  }
  
  // Tìm không phân biệt chữ hoa chữ thường
  if (mode === 'caseInsensitive') {
    return value.toLowerCase().includes(search.toLowerCase());
  }
  
  // Tìm không quan tâm hoa thường và có dấu hay không dấu
  if (mode === 'accentInsensitive') {
    return xoaDauVietNam(value).includes(xoaDauVietNam(search));
  }
  
  return false;
};

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
 * So sánh 2 mảng key để kiểm tra bằng nhau
 */
export const areKeysEqual = (keys1: Key[], keys2: Key[]): boolean => {
  if (keys1.length !== keys2.length) return false;
  return keys1.every(key => keys2.includes(key));
};

/**
 * Clone sâu định nghĩa cột để tránh lỗi tham chiếu
 */
export const cloneColumns = <T extends TableRecord = TableRecord>(
  columns: ColumnsType<T>
): ColumnsType<T> => {
  return columns.map(column => ({
    ...column,
    children: column.children ? cloneColumns(column.children) : undefined,
  }));
};

/**
 * Thêm các thuộc tính mặc định cho tất cả các cột
 */
export const applyColumnDefaults = <T extends TableRecord = TableRecord>(
  columns: ColumnsType<T>,
  defaults: Partial<ColumnType<T>> = {}
): ColumnsType<T> => {
  return columns.map(column => ({
    ...defaults,
    ...column,
    children: column.children ? applyColumnDefaults(column.children, defaults) : undefined,
  }));
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
      if (column.dataIndex && column.searchable) {
        searchableColumns.push(column.dataIndex.toString());
      }
      if (column.children) {
        extractSearchableColumns(column.children);
      }
    });
  };

  extractSearchableColumns(columns);
  return searchableColumns;
};

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
      if (column && column.onFilter) {
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

/**
 * Tìm column definition theo key
 */
const findColumnByKey = <T extends TableRecord = TableRecord>(
  columns: ColumnsType<T>,
  key: string
): ColumnType<T> | undefined => {
  for (const column of columns) {
    if (column.key === key || column.dataIndex === key) {
      return column;
    }
    if (column.children) {
      const found = findColumnByKey(column.children, key);
      if (found) return found;
    }
  }
  return undefined;
};

/**
 * Sorter function cho cột ID - hỗ trợ các loại ID khác nhau
 * - Số: sắp xếp theo số
 * - Chuỗi số: sắp xếp theo số (nếu có thể parse)
 * - Chuỗi: sắp xếp theo alphabet
 */
export const sorterId = <T extends TableRecord = TableRecord>(
  a: T,
  b: T,
  columnKey: string = 'id'
): number => {
  const valueA = a[columnKey];
  const valueB = b[columnKey];

  // Xử lý các giá trị undefined hoặc null
  if (valueA === undefined || valueA === null) return -1;
  if (valueB === undefined || valueB === null) return 1;
  
  // Nếu cả hai là số, so sánh trực tiếp
  if (typeof valueA === 'number' && typeof valueB === 'number') {
    return valueA - valueB;
  }
  
  // Thử parse thành số nếu là chuỗi số
  const numA = typeof valueA === 'string' ? parseFloat(valueA) : NaN;
  const numB = typeof valueB === 'string' ? parseFloat(valueB) : NaN;
  
  // Nếu cả hai parse được thành số, so sánh số
  if (!isNaN(numA) && !isNaN(numB)) {
    return numA - numB;
  }
  
  // Mặc định so sánh theo chuỗi
  return String(valueA).localeCompare(String(valueB));
};

/**
 * Sorter function cho cột text
 */
export const sorterText = <T extends TableRecord = TableRecord>(
  a: T,
  b: T,
  columnKey: string
): number => {
  const valueA = a[columnKey];
  const valueB = b[columnKey];

  // Xử lý các giá trị undefined hoặc null
  if (valueA === undefined || valueA === null) return -1;
  if (valueB === undefined || valueB === null) return 1;

  // So sánh theo chuỗi
  return String(valueA).localeCompare(String(valueB));
};

/**
 * Tạo hàm sorter cho bất kỳ cột nào
 * Đảm bảo kiểu trả về tương thích với CompareFn của Ant Design
 */
export const createSorterFunction = <T extends TableRecord = TableRecord>(
  columnKey: string,
  type: 'id' | 'text' | 'number' | 'date' = 'text'
) => {
  // Sử dụng any để đảm bảo tương thích với CompareFn của antd
  return (a: any, b: any): number => {
    switch (type) {
      case 'id':
        return sorterId(a, b, columnKey);
      case 'number':
        const numA = a[columnKey] as number;
        const numB = b[columnKey] as number;
        if (numA === undefined || numA === null) return -1;
        if (numB === undefined || numB === null) return 1;
        return numA - numB;
      case 'date':
        const dateA = a[columnKey] ? new Date(a[columnKey]).getTime() : 0;
        const dateB = b[columnKey] ? new Date(b[columnKey]).getTime() : 0;
        return dateA - dateB;
      case 'text':
      default:
        return sorterText(a, b, columnKey);
    }
  };
};

const tableUtils = {
  removeDiacritics,
  xoaDauVietNam,
  filterDataBySearchTerm,
  compareValues,
  getResponsiveColumns,
  areKeysEqual,
  cloneColumns,
  applyColumnDefaults,
  getSearchableColumnKeys,
  applyColumnFilters,
  sorterId,
  sorterText,
  createSorterFunction,
};

export default tableUtils;
