import { EyeInvisibleOutlined, EyeOutlined, SettingOutlined } from '@ant-design/icons';
import { Button, Divider, Modal, Space, Typography } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { ColumnsSection } from './ColumnsSection';
import { ARIA_LABELS, MODAL_CONFIG, MODAL_STYLES, UI_LABELS } from './constants';
import { ExportSection } from './ExportSection';
import { SearchModeSection } from './SearchModeSection';
import './TuyChonTable.modal.less';
import type { TuyChonModalProps } from './types';
import { useColumnVisibility } from './useColumnVisibility';
import { useDraggableModal } from './useDraggableModal';
import { useSearchMode } from './useSearchMode';
import { useTableModalPositionStore } from '../stores/useTableModalPositionStore';
import { SearchMode } from '../types';

const { Text } = Typography;

const TuyChonModal: React.FC<TuyChonModalProps> = ({
  visible,
  onCancel,
  columns,
  onColumnsVisibilityChange,
  onDownloadExcel,
  onDownloadPdf,
  tableTitle = 'Bảng dữ liệu',
  visibleColumnKeys = [],
  searchMode: externalSearchMode,
  initialSearchMode = SearchMode.AccentInsensitive,
  onSearchModeChange,
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportType, setExportType] = useState<'excel' | 'pdf' | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Sử dụng store để lưu trạng thái ẩn/hiện hướng dẫn
  const { showGuidance, toggleGuidance } = useTableModalPositionStore();

  const { isDragging, modalPosition, modalRef, handleMouseDown } = useDraggableModal();

  const { searchMode, handleSearchModeChange, getSearchModeOptions } = useSearchMode(
    externalSearchMode,
    initialSearchMode,
    onSearchModeChange
  );

  const { selectedColumns, handleColumnVisibilityChange, handleShowAll, handleHideAll } = useColumnVisibility(
    columns,
    visibleColumnKeys,
    visible,
    onColumnsVisibilityChange
  );

  useEffect(() => {
    const hasChanges = JSON.stringify(selectedColumns.sort()) !== JSON.stringify(visibleColumnKeys.sort());
    setHasUnsavedChanges(hasChanges);
  }, [selectedColumns, visibleColumnKeys]);

  const handleExportExcel = useCallback(async () => {
    if (!onDownloadExcel) return;

    setIsExporting(true);
    setExportType('excel');

    try {
      await onDownloadExcel();
    } catch (error) {
      console.error('Export Excel failed:', error);
    } finally {
      setIsExporting(false);
      setExportType(null);
    }
  }, [onDownloadExcel]);

  const handleExportPdf = useCallback(async () => {
    if (!onDownloadPdf) return;

    setIsExporting(true);
    setExportType('pdf');

    try {
      await onDownloadPdf();
    } catch (error) {
      console.error('Export PDF failed:', error);
    } finally {
      setIsExporting(false);
      setExportType(null);
    }
  }, [onDownloadPdf]);

  const handleClose = useCallback(() => {
    if (hasUnsavedChanges) {
    }
    onCancel();
  }, [hasUnsavedChanges, onCancel]);

  const handleHeaderKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const modalContent = modalRef.current?.querySelector('.tuy-chon-modal-content');
      if (modalContent) {
        (modalContent as HTMLElement).focus();
      }
    }
  }, [modalRef]);

  const handleModalKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      handleClose();
    }

    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
    }
  }, [handleClose]);

  useEffect(() => {
    if (!visible) {
      setIsExporting(false);
      setExportType(null);
      setHasUnsavedChanges(false);
    }
  }, [visible]);

  return (
    <Modal
      className="tuy-chon-table-modal"
      zIndex={1000}
      title={
        <div
          style={{ ...MODAL_STYLES.modalTitle, ...MODAL_STYLES.modalTitleDynamic(isDragging) }}
          onMouseDown={handleMouseDown}
          onKeyDown={handleHeaderKeyDown}
          tabIndex={0}
          role="button"
          aria-label={`${ARIA_LABELS.DRAG_MODAL} ${tableTitle}. Nhấn Enter để focus vào nội dung modal.`}
          title="Kéo để di chuyển modal"
          className="hoverClassBG"
        >
          <SettingOutlined
            className="modal-title-icon"
            style={{ ...MODAL_STYLES.modalTitleIcon, ...MODAL_STYLES.modalTitleIconDynamic(isDragging) }}
            aria-hidden="true"
          />
          <span style={MODAL_STYLES.modalTitleSpan}>
            {UI_LABELS.MODAL_TITLE} {tableTitle}
            {hasUnsavedChanges && (
              <Text type="warning" style={MODAL_STYLES.unsavedChangesText} aria-label="Có thay đổi chưa được lưu">(có thay đổi)</Text>
            )}
          </span>
        </div>
      }
      open={visible}
      onCancel={handleClose}
      footer={<Space style={MODAL_STYLES.footerSpace}>
        {showGuidance ? (
          <Text type="secondary" style={MODAL_STYLES.keyboardHintText}>Kéo tiêu đề để di chuyển modal • Dữ liệu tự động lưu riêng cho bảng</Text>
        ) : <div />}
        <Button
          type="text"
          size="small"
          icon={showGuidance ? <EyeInvisibleOutlined /> : <EyeOutlined />}
          onClick={toggleGuidance}
          style={{ fontSize: '12px', color: '#666' }}
        >
          {showGuidance ? 'Ẩn hướng dẫn' : 'Hiện hướng dẫn'}
        </Button>
      </Space>}
      width={MODAL_CONFIG.width}
      destroyOnClose
      mask={false}
      style={MODAL_STYLES.modalStyle(modalPosition)}
      getContainer={() => document.body}
      aria-label={`Modal tùy chọn cho ${tableTitle}`}
    >
      <div
        className="tuy-chon-modal-content"
        id="modal-content"
        tabIndex={-1}
        role="main"
        aria-label={ARIA_LABELS.MODAL_CONTENT}
        style={MODAL_STYLES.modalContent(isExporting)}
        onKeyDown={handleModalKeyDown}
      >
        {isExporting && (
          <div
            className="loading-overlay"
            style={MODAL_STYLES.loadingOverlay}
            aria-live="polite"
            aria-label={`Đang xuất ${exportType === 'excel' ? 'Excel' : 'PDF'}...`}
          >
            <Space direction="vertical" align="center">
              <div className="ant-spin ant-spin-spinning">
                <span className="ant-spin-dot ant-spin-dot-spin">
                  <i className="ant-spin-dot-item"></i>
                  <i className="ant-spin-dot-item"></i>
                  <i className="ant-spin-dot-item"></i>
                  <i className="ant-spin-dot-item"></i>
                </span>
              </div>
              <Text type="secondary">
                Đang xuất {exportType === 'excel' ? 'Excel' : 'PDF'}...
              </Text>
            </Space>
          </div>
        )}

        <section aria-labelledby="export-section-title">
          {showGuidance && (
            <div style={{ marginBottom: '8px' }}>
              <Text type="secondary" style={{ fontSize: '12px', fontStyle: 'italic' }}>
                💡 Xuất dữ liệu hiện tại của bảng ra file Excel hoặc PDF
              </Text>
            </div>
          )}
          <ExportSection
            onDownloadExcel={handleExportExcel}
            onDownloadPdf={handleExportPdf}
            isExporting={isExporting}
            exportType={exportType}
          />
        </section>

        <Divider aria-hidden="true" style={MODAL_STYLES.dividerStyle} />

        <section aria-labelledby="search-mode-section-title">
          {showGuidance && (
            <div style={{ marginBottom: '8px' }}>
              <Text type="secondary" style={{ fontSize: '12px', fontStyle: 'italic' }}>
                🔍 Chọn cách thức tìm kiếm: có phân biệt dấu, không phân biệt dấu, hoặc tìm chính xác
              </Text>
            </div>
          )}
          <SearchModeSection
            searchMode={searchMode}
            onSearchModeChange={handleSearchModeChange}
            getSearchModeOptions={getSearchModeOptions}
          />
        </section>

        <Divider aria-hidden="true" style={MODAL_STYLES.dividerStyle} />

        <section aria-labelledby="columns-section-title">
          {showGuidance && (
            <div style={{ marginBottom: '8px' }}>
              <Text type="secondary" style={{ fontSize: '12px', fontStyle: 'italic' }}>
                📋 Tùy chỉnh các cột hiển thị trong bảng. Bật/tắt từng cột hoặc sử dụng nút "Tất cả"/"Ẩn tất cả"
              </Text>
            </div>
          )}
          <ColumnsSection
            columns={columns}
            selectedColumns={selectedColumns}
            onColumnVisibilityChange={handleColumnVisibilityChange}
            onShowAll={handleShowAll}
            onHideAll={handleHideAll}
          />
        </section>
      </div>
    </Modal>
  );
};

export default TuyChonModal;