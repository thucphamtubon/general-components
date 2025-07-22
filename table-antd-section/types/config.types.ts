import { TableState } from './state.types';

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
