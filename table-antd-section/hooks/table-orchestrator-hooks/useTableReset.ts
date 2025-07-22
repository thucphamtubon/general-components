import { useCallback } from 'react';

/**
 * Interface định nghĩa các tham số đầu vào cho hook useTableReset
 */
interface UseTableResetProps {
  resetPaginationConfig: () => void;
  clearFilters: () => void;
  clearSorter: () => void;
  clearSelection: () => void;
  clearSearch: () => void;
}

/**
 * Hook xử lý chức năng đặt lại (reset) cho bảng
 * Hook này đặt lại tất cả các trạng thái của bảng về mặc định, bao gồm phân trang,
 * bộ lọc, sắp xếp, lựa chọn dòng và tìm kiếm
 */
export const useTableReset = ({
  resetPaginationConfig,
  clearFilters,
  clearSorter,
  clearSelection,
  clearSearch,
}: UseTableResetProps) => {
  /**
   * Đặt lại tất cả trạng thái của bảng
   * Hàm này gọi tất cả các hàm đặt lại khác nhau để đặt lại toàn bộ trạng thái của bảng
   */
  const resetTable = useCallback(() => {
    resetPaginationConfig();
    clearFilters();
    clearSorter();
    clearSelection();
    clearSearch();
  }, [resetPaginationConfig, clearFilters, clearSorter, clearSelection, clearSearch]);

  return {
    resetTable,
  };
};
