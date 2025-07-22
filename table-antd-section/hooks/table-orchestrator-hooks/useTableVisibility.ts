import { useMemo, useCallback } from 'react';

/**
 * Interface định nghĩa các tham số đầu vào cho hook useTableVisibility
 */
interface UseTableVisibilityProps {
  columns: any[];
  defaultVisibleColumnKeys?: string[];
  visibleColumnKeys?: string[];
  setVisibleColumnKeys?: (keys: string[]) => void;
}

/**
 * Hook quản lý hiển thị của các cột trong bảng
 * Hook này cho phép ẩn/hiện các cột trong bảng dựa trên các khóa cột
 * và quản lý thay đổi trạng thái hiển thị của các cột
 */
export const useTableVisibility = ({
  columns = [],
  defaultVisibleColumnKeys = [],
  visibleColumnKeys: externalVisibleColumnKeys,
  setVisibleColumnKeys: externalSetVisibleColumnKeys,
}: UseTableVisibilityProps) => {
  // Sử dụng visibleColumnKeys từ bên ngoài nếu được cung cấp, nếu không sử dụng giá trị mặc định
  const visibleColumnKeys = externalVisibleColumnKeys || defaultVisibleColumnKeys;

  /**
   * Xử lý thay đổi hiển thị của các cột
   * Hàm này được gọi khi người dùng thay đổi các cột được hiển thị
   */
  const handleColumnsVisibilityChange = useCallback(
    (newVisibleColumns: string[]) => {
      if (externalSetVisibleColumnKeys) {
        externalSetVisibleColumnKeys(newVisibleColumns);
      }
    },
    [externalSetVisibleColumnKeys]
  );

  /**
   * Lọc các cột dựa trên cài đặt hiển thị
   * Trả về chỉ các cột được chọn để hiển thị dựa trên visibleColumnKeys
   */
  const visibleColumns = useMemo(() => {
    if (!visibleColumnKeys.length || !columns.length) return columns;

    return columns.filter((col) => {
      const columnKey = (col.key || col.dataIndex) as string;
      return visibleColumnKeys.includes(columnKey);
    });
  }, [columns, visibleColumnKeys]);

  return {
    visibleColumnKeys,
    visibleColumns,
    handleColumnsVisibilityChange,
  };
};
