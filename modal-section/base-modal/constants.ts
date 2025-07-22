import React from 'react';
import type { ModalPosition, ModalConfig, ModalConstraints } from './types';

/**
 * Cấu hình kích thước và hành vi modal
 */
export const BASE_MODAL_CONFIG: ModalConfig = {
  defaultWidth: 600,
  defaultHeight: 400,
  defaultZIndex: 10002,
  mouseEnterDelay: 0.3,
} as const;

/**
 * Ràng buộc vị trí và kích thước cho modal có thể kéo thả
 */
export const BASE_MODAL_CONSTRAINTS: ModalConstraints = {
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
 * Cấu hình styling cho base modal
 */
export const BASE_MODAL_STYLES = {
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

  footerSpace: {
    width: '100%',
    justifyContent: 'space-between'
  } as React.CSSProperties,

  keyboardHintText: {
    fontSize: '12px'
  } as React.CSSProperties,

  modalStyle: (modalPosition: ModalPosition) => ({
    position: 'fixed',
    top: `${modalPosition.y}px`,
    left: `${modalPosition.x}px`,
    transform: 'none',
    margin: 0,
    paddingBottom: 0,
  } as React.CSSProperties),

  modalContent: (isLoading: boolean) => ({
    position: 'relative',
    opacity: isLoading ? 0.7 : 1,
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
 * Các aria-label cho accessibility
 */
export const BASE_MODAL_ARIA_LABELS = {
  DRAG_MODAL: 'Kéo thả modal',
  CLOSE_MODAL: 'Đóng modal',
  MODAL_CONTENT: 'Nội dung modal',
  TOGGLE_GUIDANCE: 'Bật/tắt hướng dẫn',
  SHOW_GUIDANCE: 'Hiện hướng dẫn',
  HIDE_GUIDANCE: 'Ẩn hướng dẫn',
} as const;

/**
 * Các thông điệp UI mặc định
 */
export const BASE_MODAL_UI_LABELS = {
  CLOSE_BUTTON: 'Đóng',
  SHOW_GUIDANCE: 'Hiện hướng dẫn',
  HIDE_GUIDANCE: 'Ẩn hướng dẫn',
  UNSAVED_CHANGES: '(có thay đổi)',
  DRAG_HINT: 'Kéo tiêu đề để di chuyển modal',
  LOADING_TEXT: 'Đang xử lý...',
} as const;