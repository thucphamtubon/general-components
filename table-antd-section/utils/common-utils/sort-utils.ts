/**
 * Sort utilities - Generic sorting functions
 */

export type SorterType = 'id' | 'text' | 'number' | 'date';

/**
 * Sorter for ID column, handles different types of IDs (number, string, or mixed)
 */
export const sorterId = <T extends Record<string, any>>(
  a: T,
  b: T,
  columnKey: keyof T
): number => {
  const aValue = a[columnKey];
  const bValue = b[columnKey];

  // Handle null/undefined values
  if (aValue === undefined || aValue === null) return -1;
  if (bValue === undefined || bValue === null) return 1;

  // Convert to strings for consistent comparison
  const aStr = String(aValue);
  const bStr = String(bValue);

  // Try to parse as numbers if both are numeric strings
  const aNum = Number(aStr);
  const bNum = Number(bStr);

  // If both are valid numbers, compare numerically
  if (!isNaN(aNum) && !isNaN(bNum)) {
    return aNum - bNum;
  }

  // Otherwise compare as strings
  return aStr.localeCompare(bStr);
};

/**
 * Sorter for text columns, supports case-sensitive and accented text
 */
export const sorterText = <T extends Record<string, any>>(
  a: T,
  b: T,
  columnKey: keyof T
): number => {
  const aValue = a[columnKey];
  const bValue = b[columnKey];

  // Handle null/undefined values
  if (aValue === undefined || aValue === null) return -1;
  if (bValue === undefined || bValue === null) return 1;

  return String(aValue).localeCompare(String(bValue));
};

/**
 * Sorter for number columns
 */
export const sorterNumber = <T extends Record<string, any>>(
  a: T,
  b: T,
  columnKey: keyof T
): number => {
  const aValue = Number(a[columnKey]);
  const bValue = Number(b[columnKey]);

  // Handle NaN values
  if (isNaN(aValue)) return -1;
  if (isNaN(bValue)) return 1;

  return aValue - bValue;
};

/**
 * Sorter for date columns
 */
export const sorterDate = <T extends Record<string, any>>(
  a: T,
  b: T,
  columnKey: keyof T
): number => {
  const aValue = a[columnKey];
  const bValue = b[columnKey];

  // Handle null/undefined values
  if (aValue === undefined || aValue === null) return -1;
  if (bValue === undefined || bValue === null) return 1;

  const dateA = new Date(aValue as string | number);
  const dateB = new Date(bValue as string | number);

  return dateA.getTime() - dateB.getTime();
};

/**
 * Tạo hàm sorter cho bất kỳ cột nào
 * Đảm bảo kiểu trả về tương thích với CompareFn của Ant Design
 */
export const createSorterFunction = <T extends Record<string, any>>(
  columnKey: keyof T | string,
  type: SorterType = 'text'
) => {
  // Sử dụng any để đảm bảo tương thích với CompareFn của antd
  return (a: any, b: any): number => {
    switch (type) {
      case 'id':
        return sorterId(a, b, columnKey as keyof T);
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
        return sorterText(a, b, columnKey as keyof T);
    }
  };
};
