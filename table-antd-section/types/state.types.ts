import { Key } from 'react';
import { SearchMode } from './table-utils.types';

// Interface trạng thái bộ lọc
export interface FilterState {
  [key: string]: any;
}

// Interface trạng thái sắp xếp
export interface SortState {
  columnKey?: Key; // Khoá của cột sắp xếp
  order?: 'ascend' | 'descend' | null; // Thứ tự sắp xếp
}

// Interface trạng thái phân trang
export interface PaginationState {
  current: number; // Trang hiện tại
  pageSize: number; // Số bản ghi mỗi trang
  total?: number; // Tổng số bản ghi
}

// Interface trạng thái tìm kiếm
export interface SearchState {
  visibleColumnKeys: string[];
  searchTerm: string; // Từ khóa tìm kiếm
  searchMode: SearchMode; // Chế độ tìm kiếm
}

// Interface trạng thái tổng thể của bảng
export interface TableState {
  filters: FilterState; // Trạng thái bộ lọc
  sorter: SortState; // Trạng thái sắp xếp
  paginationConfig: PaginationState; // Trạng thái phân trang
  searchTerm: string; // Từ khoá tìm kiếm
  selectedRowKeys: Key[]; // Các khoá dòng được chọn
}
