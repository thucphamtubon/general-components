import React from 'react';
import { SearchMode } from '../types';

/**
 * Mô tả các chế độ tìm kiếm cho người dùng
 */
export const SEARCH_MODE_DESCRIPTIONS = {
  [SearchMode.ExactMatch]: 'Tìm kiếm chính xác (phân biệt hoa thường và dấu)',
  [SearchMode.CaseInsensitive]: 'Không phân biệt hoa thường (vẫn phân biệt dấu)',
  [SearchMode.AccentInsensitive]: 'Không phân biệt hoa thường và dấu',
} as const;

/**
 * Cấu hình styling cho modal
 */
export const MODAL_STYLES = {
  modalTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '4px 0',
  } as React.CSSProperties,

  modalTitleDynamic: (isDragging: boolean) => ({
    cursor: isDragging ? 'grabbing' : 'grab',
    userSelect: 'none',
    width: '100%',
    padding: '8px 0',
    transition: 'all 0.2s ease'
  } as React.CSSProperties),

  modalTitleIcon: {
    fontSize: '16px',
    color: '#1890ff',
    pointerEvents: 'none',
  } as React.CSSProperties,

  modalTitleIconDynamic: (isDragging: boolean) => ({
    transform: isDragging ? 'scale(1.1)' : 'scale(1)',
    transition: 'transform 0.2s ease'
  } as React.CSSProperties),

  modalTitleSpan: {
    pointerEvents: 'none'
  } as React.CSSProperties,

  unsavedChangesText: {
    marginLeft: 8,
    fontSize: '12px'
  } as React.CSSProperties,

  exportButton: {
    height: '60px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  } as React.CSSProperties,

  exportButtonText: {
    marginTop: 4
  } as React.CSSProperties,

  searchModeContainer: {
    position: 'relative',
    width: '100%',
    marginBottom: '16px'
  } as React.CSSProperties,

  searchModeSelect: {
    width: '100%'
  } as React.CSSProperties,

  searchModeTooltipIcon: {
    cursor: 'help'
  } as React.CSSProperties,

  searchModeQuestionIcon: {
    fontSize: '14px'
  } as React.CSSProperties,

  columnsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  } as React.CSSProperties,

  columnsTitle: {
    margin: 0
  } as React.CSSProperties,

  showAllButton: {
    marginRight: 8
  } as React.CSSProperties,

  columnItem: {
    display: 'flex',
    alignItems: 'center'
  } as React.CSSProperties,

  columnText: {
    marginLeft: 8
  } as React.CSSProperties,

  tooltipOverlay: {
    maxWidth: 350
  } as React.CSSProperties,

  footerSpace: {
    width: '100%',
    justifyContent: 'space-between'
  } as React.CSSProperties,

  keyboardHintText: {
    fontSize: '12px'
  } as React.CSSProperties,

  modalStyle: (modalPosition: { x: number; y: number }) => ({
    position: 'fixed',
    top: `${modalPosition.y}px`,
    left: `${modalPosition.x}px`,
    transform: 'none',
    margin: 0,
    paddingBottom: 0,
    zIndex: 10002,
  } as React.CSSProperties),

  modalContent: (isExporting: boolean) => ({
    position: 'relative',
    opacity: isExporting ? 0.7 : 1,
    transition: 'opacity 0.3s ease'
  } as React.CSSProperties),

  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(255, 255, 255, 0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    borderRadius: '6px'
  } as React.CSSProperties,

  dividerStyle: {
    margin: '16px 0'
  } as React.CSSProperties
} as const;

/**
 * Cấu hình kích thước và hành vi modal
 */
export const MODAL_CONFIG = {
  width: 600,
  mouseEnterDelay: 0.3
} as const;

/**
 * Ràng buộc vị trí và kích thước cho modal có thể kéo thả
 */
export const MODAL_CONSTRAINTS = {
  /** Khoảng cách tối thiểu từ cạnh trái màn hình */
  minX: 0,
  /** Khoảng cách tối thiểu từ cạnh trên màn hình */
  minY: 0,
  /** Chiều rộng mặc định của modal */
  defaultWidth: 600,
  /** Chiều cao mặc định của modal */
  defaultHeight: 400,
} as const;

/**
 * Cấu hình lưới hiển thị cột
 */
export const GRID_CONFIG = {
  gutter: [16, 16] as [number, number],
  exportSection: [16, 16] as [number, number],
  columnsSection: [16, 8] as [number, number]
} as const;

/**
 * Cấu hình responsive cho các cột trong grid
 */
export const COLUMN_RESPONSIVE = {
  xs: 24,  // Mobile: full width
  sm: 12,  // Tablet: half width
  md: 8,   // Desktop: 1/3 width
  lg: 6,   // Large desktop: 1/4 width
  exportButton: { xs: 12, md: 8 },
  columnItem: { xs: 24, sm: 12 }
} as const;

/**
 * Các thông điệp và nhãn UI
 */
export const UI_LABELS = {
  MODAL_TITLE: 'Tùy chọn cho',
  CLOSE_BUTTON: 'Đóng',
  SHOW_ALL_COLUMNS: 'Tất cả',
  HIDE_ALL_COLUMNS: 'Ẩn tất cả',
  EXPORT_SECTION_TITLE: 'Xuất dữ liệu',
  SEARCH_MODE_SECTION_TITLE: 'Chế độ tìm kiếm',
  COLUMNS_SECTION_TITLE: 'Hiển thị cột',
  EXPORT_EXCEL: 'Xuất Excel',
  EXPORT_PDF: 'Xuất PDF',
} as const;

/**
 * Các aria-label cho accessibility
 */
export const ARIA_LABELS = {
  DRAG_MODAL: 'Kéo thả modal tùy chọn cho',
  CLOSE_MODAL: 'Đóng modal tùy chọn',
  MODAL_CONTENT: 'Nội dung modal tùy chọn',
  EXPORT_SECTION: 'Phần xuất dữ liệu',
  SEARCH_MODE_SECTION: 'Phần chế độ tìm kiếm',
  COLUMNS_SECTION: 'Phần quản lý hiển thị cột',
  SHOW_ALL_COLUMNS: 'Hiển thị tất cả các cột',
  HIDE_ALL_COLUMNS: 'Ẩn tất cả các cột',
  TOGGLE_COLUMN: 'Bật/tắt hiển thị cột',
  SEARCH_MODE_SELECT: 'Chọn chế độ tìm kiếm',
  SEARCH_MODE_HELP: 'Thông tin về chế độ tìm kiếm',
  EXPORT_EXCEL: 'Xuất dữ liệu ra file Excel',
  EXPORT_PDF: 'Xuất dữ liệu ra file PDF',
} as const;