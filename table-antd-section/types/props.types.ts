import { TableProps as AntdTableProps } from 'antd/lib/table';
import { TablePaginationConfig } from 'antd/lib/table/interface';
import { Key } from 'react';
import { ColumnsType, TableRecord } from './base.types';
import { PaginationState } from './state.types';
import { TablePaginationOptions } from './options.types';

// Props của bảng, mở rộng từ props của bảng Antd
export interface TableProps<RecordType = TableRecord> extends Omit<AntdTableProps<RecordType>, 'columns'> {
  columns?: ColumnsType<RecordType>; // Danh sách cột
  showHeader?: boolean; // Hiển thị header
  searchTerm?: string; // Từ khoá tìm kiếm
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
