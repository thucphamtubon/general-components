import { useCallback } from 'react';
import { SorterResult, TablePaginationConfig } from 'antd/lib/table/interface';

/**
 * Interface định nghĩa các tham số đầu vào cho hook useTableChangeHandler
 */
interface UseTableChangeHandlerProps {
  handleFilterChange: (filters: Record<string, any>) => void;
  handleSorterChange: (sorter: SorterResult<any>) => void;
  handlePaginationChange: (current: number, pageSize?: number) => void;
}

/**
 * Hook xử lý các sự kiện thay đổi tổng hợp từ bảng Ant Design
 * Hook này kết hợp việc xử lý các sự kiện thay đổi bộ lọc, sắp xếp và phân trang
 * để giảm thiểu việc phải viết nhiều hàm xử lý riêng biệt
 */
export const useTableChangeHandler = ({
  handleFilterChange,
  handleSorterChange,
  handlePaginationChange,
}: UseTableChangeHandlerProps) => {
  /**
   * Hàm xử lý tổng hợp cho sự kiện onChange của bảng Ant Design
   * Hàm này xử lý đồng thời việc thay đổi phân trang, bộ lọc và sắp xếp
   */
  const handleTableChange = useCallback(
    (
      pagination: TablePaginationConfig,
      filters: Record<string, any>,
      sorter: SorterResult<any> | SorterResult<any>[],
    ) => {
      if (filters) {
        handleFilterChange(filters);
      }

      if (sorter) {
        if (Array.isArray(sorter)) {
          if (sorter.length > 0) {
            handleSorterChange(sorter[0]);
          } else {
            // Xử lý trường hợp mảng sorter rỗng - đặt về sorter trống
            handleSorterChange({ columnKey: undefined, order: undefined });
          }
        } else if (sorter.columnKey || sorter.order) {
          // Chỉ xử lý sorter khi có columnKey hoặc order
          handleSorterChange(sorter);
        } else if (Object.keys(sorter).length === 0) {
          // Xử lý trường hợp sorter là object rỗng {}
          handleSorterChange({ columnKey: undefined, order: undefined });
        }
      }

      if (pagination) {
        const { current, pageSize } = pagination;
        if (current !== undefined) {
          handlePaginationChange(current, pageSize);
        }
      }
    },
    [handleFilterChange, handleSorterChange, handlePaginationChange]
  );

  return {
    handleTableChange,
  };
};
