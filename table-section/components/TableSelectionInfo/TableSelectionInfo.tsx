import React from 'react';
import './TableSelectionInfo.less';

export interface TableSelectionInfoProps {
  selectedCount: number;
  onClearSelection: () => void;
  className?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
  showClearButton?: boolean;
  countText?: (count: number) => string;
  clearButtonText?: string;
}

/**
 * TableSelectionInfo component following SRP
 * - Chỉ hiển thị thông tin selection
 * - Có thể tái sử dụng trong nhiều table khác nhau
 * - Dễ test và maintain
 */
export function TableSelectionInfo(props: TableSelectionInfoProps) {
  const {
    selectedCount,
    onClearSelection,
    className = '',
    style,
    disabled = false,
    showClearButton = true,
    countText = (count: number) => `Đã chọn ${count} mục`,
    clearButtonText = 'Bỏ chọn tất cả',
  } = props;

  // Don't render if no selection
  if (selectedCount === 0) {
    return null;
  }

  const handleClearClick = () => {
    if (!disabled) {
      onClearSelection();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClearClick();
    }
  };

  return (
    <div 
      className={`table-selection-info ${className}`} 
      style={style}
      role="status"
      aria-live="polite"
      data-testid="table-selection-info"
    >
      <span className="table-selection-info__count">
        {countText(selectedCount)}
      </span>
      
      {showClearButton && (
        <button
          type="button"
          onClick={handleClearClick}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          className="table-selection-info__clear-button"
          aria-label={clearButtonText}
          data-testid="table-selection-clear"
        >
          {clearButtonText}
        </button>
      )}
    </div>
  );
}

export default TableSelectionInfo; 