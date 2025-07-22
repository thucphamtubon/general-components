import { Breakpoint } from 'antd/lib/_util/responsiveObserve';
import { ColumnType as AntdColumnType } from 'antd/lib/table';

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
