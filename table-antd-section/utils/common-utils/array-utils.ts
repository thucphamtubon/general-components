/**
 * Array and object utilities
 */

import { Key } from 'react';

/**
 * So sánh 2 mảng key để kiểm tra bằng nhau
 */
export const compareKeyArrays = (keys1: Key[], keys2: Key[]): boolean => {
  if (keys1.length !== keys2.length) return false;
  return keys1.every(key => keys2.includes(key));
};

/**
 * Clone sâu một mảng các đối tượng
 */
export const deepCloneArray = <T>(items: T[]): T[] => {
  return items.map(item => ({
    ...item,
    children: (item as any).children ? deepCloneArray((item as any).children) : undefined,
  }));
};
