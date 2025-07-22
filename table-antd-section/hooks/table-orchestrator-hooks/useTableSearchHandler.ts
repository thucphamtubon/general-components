import { useCallback, useEffect } from 'react';
import { SearchMode } from '../../tuy-chon-table';

/**
 * Interface định nghĩa các tham số đầu vào cho hook useTableSearchHandler
 */
interface UseTableSearchHandlerProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  setSearchMode: (mode: SearchMode) => void;
  clearSearch: () => void;
  externalSearchTerm?: string;
  onSearch?: (searchTerm: string) => void;
}

/**
 * Hook xử lý chức năng tìm kiếm cho bảng
 * Hook này quản lý các tương tác tìm kiếm, bao gồm thay đổi nội dung tìm kiếm, 
 * thay đổi chế độ tìm kiếm, và xóa tìm kiếm
 */
export const useTableSearchHandler = ({
  searchTerm,
  setSearchTerm,
  setSearchMode,
  clearSearch,
  externalSearchTerm,
  onSearch,
}: UseTableSearchHandlerProps) => {
  // Đồng bộ với điều kiện tìm kiếm từ bên ngoài nếu được cung cấp
  useEffect(() => {
    if (externalSearchTerm !== undefined && externalSearchTerm !== searchTerm) {
      setSearchTerm(externalSearchTerm);
    }
  }, [externalSearchTerm, setSearchTerm, searchTerm]);

  // Kích hoạt callback onSearch khi điều kiện tìm kiếm thay đổi
  useEffect(() => {
    if (onSearch) {
      onSearch(searchTerm);
    }
  }, [searchTerm, onSearch]);

  /**
   * Xử lý thay đổi đầu vào tìm kiếm
   * Hàm này cập nhật cả chuỗi tìm kiếm và chế độ tìm kiếm (nếu được cung cấp)
   */
  const handleSearchChange = useCallback(
    (text: string, mode?: SearchMode) => {
      setSearchTerm(text);
      if (mode) {
        setSearchMode(mode);
      }
    },
    [setSearchTerm, setSearchMode]
  );

  /**
   * Xóa đầu vào tìm kiếm
   * Hàm này đặt lại trạng thái tìm kiếm về trạng thái ban đầu
   */
  const handleClearSearch = useCallback(() => {
    clearSearch();
  }, [clearSearch]);

  return {
    handleSearchChange,
    handleClearSearch,
  };
};
