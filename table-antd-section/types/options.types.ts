// Interface tùy chọn cho phân trang
export interface TablePaginationOptions {
  tableId?: string;
  pageSizeOptions?: string[];
  saveUserPreferences?: boolean;
  showInfo?: boolean;
}

// Interface tùy chọn cho tìm kiếm
export interface TableSearchOptions {
  tableId?: string;
  saveUserPreferences?: boolean;
  debounceMs?: number;
}
