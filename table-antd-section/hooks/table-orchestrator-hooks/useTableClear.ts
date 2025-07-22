import { useCallback } from 'react';
import { useTableFiltersAndSorterStore } from '../../stores/useTableFiltersAndSorterStore';

/**
 * Interface định nghĩa các tham số đầu vào cho hook useTableClear
 */
interface UseTableClearProps {
  tableId: string;
  paginationConfig: any;
  clearSearch: () => void;
  handleTableChange: (pagination: any, filters: Record<string, any>, sorter: any) => void;
}

/**
 * Hook xử lý việc xóa (clear) bộ lọc, sắp xếp và tìm kiếm của bảng
 * Hook này cung cấp một hàm để xóa toàn bộ bộ lọc, sắp xếp và tìm kiếm trong một lần gọi
 */
export const useTableClear = ({
  tableId,
  paginationConfig,
  clearSearch,
  handleTableChange,
}: UseTableClearProps) => {
  /**
   * Xóa tất cả bộ lọc, sắp xếp và tìm kiếm
   * Hàm này sẽ đặt lại tất cả trạng thái bảng về mặc định
   */
  const handleClearAll = useCallback(() => {
    // Clear search state
    clearSearch();

    if (tableId) {
      // Clear filters and sorter in the store
      const filtersAndSorterStore = useTableFiltersAndSorterStore.getState();
      filtersAndSorterStore.clearAll(tableId);

      // Trigger table change with empty filters and explicitly empty sorter
      // Using an object with columnKey: undefined and order: undefined to ensure
      // the sorter is properly reset in the Table component
      const emptySorter = { columnKey: undefined, order: undefined };
      handleTableChange(paginationConfig, {}, emptySorter);
    }
  }, [clearSearch, tableId, handleTableChange, paginationConfig]);

  return {
    handleClearAll,
  };
};
