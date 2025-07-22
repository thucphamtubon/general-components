import { ClearOutlined, CloseOutlined, SearchOutlined, SettingOutlined } from '@ant-design/icons';
import { Button, Col, Input, Row, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import React, { useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { useMediaQuery } from 'react-responsive';
import { SearchMode, TuyChonModal } from '../tuy-chon-table';

export interface TableSearchBarProps {
  onClearAll?: () => void;
  columns?: ColumnsType<any>;
  onColumnsVisibilityChange?: (visibleColumns: string[]) => void;
  onDownloadExcel?: () => void;
  onDownloadPdf?: () => void;
  tableTitle?: string;
  tableId: string; // ID duy nhất cho table để lưu vị trí modal
  visibleColumnKeys?: string[];
  searchText: string;
  searchMode?: SearchMode;
  onSearchChange: (text: string, mode?: SearchMode) => void;
  onClearSearch: () => void;
  placeholder?: string;
  className?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
  responsive?: boolean;
}

export function TableSearchBar(props: TableSearchBarProps) {
  const {
    searchText,
    searchMode,
    onSearchChange,
    onClearSearch,
    onClearAll,
    placeholder = 'Tìm kiếm...',
    className = '',
    style,
    disabled = false,
    columns,
    onColumnsVisibilityChange,
    onDownloadExcel,
    onDownloadPdf,
    tableTitle,
    tableId,
    visibleColumnKeys,
  } = props;

  const [isTuyChonModalVisible, setIsTuyChonModalVisible] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape' && searchText) {
      onClearSearch();
    }
  };

  const suffix = searchText ? (
    <Tooltip title="Xóa tìm kiếm">
      <CloseOutlined
        onClick={onClearSearch}
        style={{ color: 'rgba(0, 0, 0, 0.45)', cursor: 'pointer' }}
        data-testid="table-search-clear"
        aria-label="Xóa tìm kiếm"
      />
    </Tooltip>
  ) : (
    <SearchOutlined style={{ color: 'rgba(0, 0, 0, 0.45)' }} aria-hidden="true" />
  );

  const handleOpenTuyChonModal = () => {
    setIsTuyChonModalVisible(true);
  };

  const handleCloseTuyChonModal = () => {
    setIsTuyChonModalVisible(false);
  };

  // Keyboard shortcut: Shift+T to open TuyChonModal
  useHotkeys('shift+t', () => {
    if (columns && !disabled) handleOpenTuyChonModal();
  }, { enabled: !!columns && !disabled, preventDefault: true },
    [columns, disabled]
  );

  const isSmallScreen = useMediaQuery({ maxWidth: 767 });

  return (
    <div className={`table-search-bar ${className}`} style={{ ...style }} role="search" aria-label="Tìm kiếm trong bảng">
      <Row gutter={[8, 8]} wrap={isSmallScreen} align="middle">
        <Col xs={24} sm={20} md={12}>
          <Input
            placeholder={placeholder}
            value={searchText}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            suffix={suffix}
            aria-label="Nhập từ khóa tìm kiếm"
            data-testid="table-search-input"
            style={{ width: '100%', minHeight: '32px' }}
            allowClear
            autoFocus={!searchText}
          />
        </Col>

        {onClearAll && <Col>
          <Tooltip title="Xóa tất cả bộ lọc, sắp xếp và tìm kiếm">
            <Button
              icon={<ClearOutlined />}
              onClick={onClearAll}
              type="default"
              aria-label="Xóa tất cả"
              data-testid="clear-all-button"
            />
          </Tooltip>
        </Col>}

        {columns && <Col>
          <Tooltip title="Tùy chọn bảng (Shift+T)">
            <Button icon={<SettingOutlined />} onClick={handleOpenTuyChonModal} type="default" aria-label="Tùy chọn bảng" />
          </Tooltip>
        </Col>}
      </Row>

      {columns && (
        <TuyChonModal
          visible={isTuyChonModalVisible}
          onCancel={handleCloseTuyChonModal}
          columns={columns}
          onColumnsVisibilityChange={onColumnsVisibilityChange || (() => { })}
          onDownloadExcel={onDownloadExcel}
          onDownloadPdf={onDownloadPdf}
          tableTitle={tableTitle}
          tableId={tableId}
          visibleColumnKeys={visibleColumnKeys}
          searchMode={searchMode}
          onSearchModeChange={(mode) => {
            // Luôn gọi onSearchChange để lưu searchMode, kể cả khi searchText rỗng
            onSearchChange(searchText, mode);
          }}
        />
      )}
    </div>
  );
}

export default TableSearchBar;
