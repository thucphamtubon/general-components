import { Breakpoint } from 'antd/lib/_util/responsiveObserve';
import { ColumnType as AntdColumnType, TableProps as AntdTableProps } from 'antd/lib/table';
import { SorterResult, TablePaginationConfig } from 'antd/lib/table/interface';
import { Key } from 'react';
import { SearchMode } from '../tuy-chon-table';

// Xuất trực tiếp các kiểu dữ liệu từ antd để tiện sử dụng
export type { TablePaginationConfig } from 'antd/lib/table/interface';

// Kiểu dữ liệu cơ bản cho mỗi bản ghi của bảng
export type TableRecord = Record<string, any>;

// Kiểu cột mở rộng với các thuộc tính bổ sung
export interface ColumnType<RecordType = TableRecord> extends AntdColumnType<RecordType> {
  hidden?: boolean; // Ẩn cột này
  responsive?: Breakpoint[]; // Các breakpoint hiển thị cột
  searchable?: boolean; // Cho phép tìm kiếm trên cột này
  children?: ColumnType<RecordType>[]; // Các cột con cho cấu trúc cột lồng nhau
}

// Kiểu mảng các cột
export type ColumnsType<RecordType = TableRecord> = ColumnType<RecordType>[];

// Props của bảng, mở rộng từ props của bảng Antd
export interface TableProps<RecordType = TableRecord> extends Omit<AntdTableProps<RecordType>, 'columns'> {
  columns?: ColumnsType<RecordType>; // Danh sách cột
  showHeader?: boolean; // Hiển thị header
  searchTerm?: string; // Từ khoá tìm kiếm
}

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

// Interface cấu hình bảng
export interface TableConfig {
  defaultPageSize?: number; // Số bản ghi mặc định mỗi trang
  pageSizeOptions?: string[]; // Các tuỳ chọn số bản ghi mỗi trang
  showSizeChanger?: boolean; // Hiển thị nút đổi số bản ghi/trang
  showQuickJumper?: boolean; // Hiển thị nút chuyển nhanh trang
}

// Interface context của bảng
export interface TableContextType {
  state: TableState; // Trạng thái hiện tại của bảng
  updateState: (state: Partial<TableState>) => void; // Hàm cập nhật trạng thái
  tableConfig: TableConfig; // Cấu hình bảng
}

// Kiểu trả về của hook bộ lọc
export interface UseTableFiltersReturn {
  filters: FilterState; // Trạng thái bộ lọc
  setFilters: (filters: FilterState) => void; // Đặt lại bộ lọc
  handleFilterChange: (filters: Record<string, any>) => void; // Xử lý khi thay đổi bộ lọc
  clearFilters: () => void; // Xoá tất cả bộ lọc
}

export interface UseTableSorterReturn {
  sorter: SortState;
  setSorter: (sorter: SortState) => void;
  handleSorterChange: (sorter: SorterResult<any> | SorterResult<any>[]) => void;
  clearSorter: () => void;
}

export interface TablePaginationOptions {
  tableId?: string;
  pageSizeOptions?: string[];
  saveUserPreferences?: boolean;
  showInfo?: boolean;
}

export interface TableSearchOptions {
  tableId?: string;
  saveUserPreferences?: boolean;
  debounceMs?: number;
}

export interface UseTablePaginationReturn {
  paginationConfig: TablePaginationConfig;
  handlePaginationChange: (page: number, pageSize?: number) => void;
  resetPaginationConfig: () => void;
}

export interface UseTableSelectionReturn {
  selectedRowKeys: Key[];
  setSelectedRowKeys: (keys: Key[]) => void;
  handleSelectionChange: (selectedRowKeys: Key[]) => void;
  clearSelection: () => void;
}

export interface UseTableSearchReturn {
  searchTerm: string;
  debouncedSearchTerm: string;
  searchMode: SearchMode;
  visibleColumnKeys: string[];
  setSearchTerm: (term: string) => void;
  setSearchMode: (mode: SearchMode) => void;
  setVisibleColumnKeys: (keys: string[]) => void;
  handleSearch: (term: string, mode?: SearchMode) => void;
  clearSearch: () => void;
}

// Interface cho EnhancedTable component props
export interface EnhancedTableProps<RecordType = TableRecord> {
  columns: ColumnsType<RecordType>;
  dataSource: RecordType[];
  rowKey?: string;
  loading?: boolean;
  bordered?: boolean;
  size?: 'small' | 'middle' | 'large';
  tableId: string; // Required table ID for identification and DOM targeting

  // Thuộc tính phân trang
  pagination?: boolean | PaginationState | TablePaginationConfig; // Bật/tắt hoặc cấu hình phân trang
  defaultPageSize?: number; // Kích thước trang mặc định
  paginationOptions?: TablePaginationOptions; // Tuỳ chọn nâng cao cho phân trang

  // Thuộc tính chọn dòng
  rowSelection?: boolean; // Bật/tắt chọn dòng
  defaultSelectedRowKeys?: Key[]; // Các khóa dòng được chọn mặc định
  onSelectionChange?: (selectedRowKeys: Key[], selectedRows: RecordType[]) => void; // Hàm callback khi thay đổi lựa chọn

  // Thuộc tính tìm kiếm
  searchTerm?: string; // Từ khóa tìm kiếm
  onSearch?: (searchTerm: string) => void; // Hàm callback khi tìm kiếm
  showTableSearchBar?: boolean; // Bật/tắt thanh tìm kiếm, mặc định là true

  // Sự kiện thay đổi sắp xếp và lọc
  onSortChange?: (sorter: any) => void; // Hàm callback khi thay đổi sắp xếp
  onFilterChange?: (filters: Record<string, any>) => void; // Hàm callback khi thay đổi bộ lọc

  // Thuộc tính scroll cho table
  scroll?: {
    x?: number | string | true;
    y?: number | string;
    scrollToFirstRowOnChange?: boolean;
  };

  // Thuộc tính cho modal Tùy Chọn
  tableTitle?: string; // Tiêu đề của bảng, dùng cho export và hiển thị
  enableExcelDownload?: boolean; // Cho phép download Excel
  enablePdfDownload?: boolean; // Cho phép download PDF
}

export type PdfPageSize = 'A4' | 'A3' | 'LETTER' | 'LEGAL';
export type PdfOrientation = 'portrait' | 'landscape';
