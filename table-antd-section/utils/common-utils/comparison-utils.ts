/**
 * Comparison utilities - Functions for comparing values
 */

import { xoaDauVietNam } from './text-utils';

/**
 * Các chế độ tìm kiếm
 */
export type SearchMode = 'exact' | 'caseInsensitive' | 'accentInsensitive';

/**
 * Hàm so sánh giá trị theo chế độ tìm kiếm
 */
export const compareValues = (
  value: string,
  search: string,
  mode: SearchMode
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
