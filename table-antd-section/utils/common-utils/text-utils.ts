/**
 * Text utilities - Common text manipulation functions
 */

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
