import React from 'react';
import './TableSearchBar.less';

export interface TableSearchBarProps {
  searchText: string;
  onSearchChange: (text: string) => void;
  onClearSearch: () => void;
  placeholder?: string;
  className?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
  width?: number | string;
}

/**
 * TableSearchBar component following SRP
 * - Chỉ xử lý search functionality
 * - Có thể tái sử dụng trong nhiều table khác nhau
 * - Dễ test và maintain
 */
export function TableSearchBar(props: TableSearchBarProps) {
  const {
    searchText,
    onSearchChange,
    onClearSearch,
    placeholder = 'Tìm kiếm...',
    className = '',
    style,
    disabled = false,
    width = 300,
  } = props;

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape' && searchText) {
      onClearSearch();
    }
  };

  return (
    <div className={`table-search-bar ${className}`} style={style}>
      <div className="table-search-bar__input-wrapper" style={{ width }}>
        <input
          type="text"
          value={searchText}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className="table-search-bar__input"
          aria-label="Tìm kiếm trong bảng"
          data-testid="table-search-input"
        />
        
        {searchText && (
          <button
            type="button"
            onClick={onClearSearch}
            disabled={disabled}
            className="table-search-bar__clear-button"
            aria-label="Xóa tìm kiếm"
            data-testid="table-search-clear"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}

export default TableSearchBar; 