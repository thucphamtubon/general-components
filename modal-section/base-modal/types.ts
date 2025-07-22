import React from 'react';

/**
 * Vị trí modal trên màn hình
 */
export interface ModalPosition {
  x: number;
  y: number;
}

/**
 * Trạng thái drag của modal
 */
export interface DragState {
  isDragging: boolean;
  dragOffset: ModalPosition;
  modalPosition: ModalPosition;
}

/**
 * Props cơ bản cho BaseModal
 */
export interface BaseModalProps {
  /** Hiển thị modal */
  visible: boolean;
  /** Callback khi đóng modal */
  onCancel: () => void;
  /** Tiêu đề modal */
  title?: string;
  /** Icon cho tiêu đề modal */
  titleIcon?: React.ReactNode;
  /** Nội dung modal */
  children: React.ReactNode;
  /** Footer modal */
  footer?: React.ReactNode;
  /** Chiều rộng modal */
  width?: number;
  /** ID duy nhất cho modal để lưu vị trí */
  modalId?: string;
  /** Có thể kéo thả modal không */
  draggable?: boolean;
  /** Có hiển thị mask không */
  mask?: boolean;
  /** Z-index của modal */
  zIndex?: number;
  /** Có destroy modal khi đóng không */
  destroyOnClose?: boolean;
  /** Aria label cho modal */
  ariaLabel?: string;
  /** Có hiển thị hướng dẫn không */
  showGuidance?: boolean;
  /** Callback khi toggle hướng dẫn */
  onToggleGuidance?: () => void;
  /** Text hướng dẫn */
  guidanceText?: string;
  /** Có hiển thị nút toggle hướng dẫn không */
  showGuidanceToggle?: boolean;
  /** Có hiển thị thông báo thay đổi chưa lưu không */
  hasUnsavedChanges?: boolean;
  /** Text thông báo thay đổi chưa lưu */
  unsavedChangesText?: string;
  /** Có hiển thị loading overlay không */
  isLoading?: boolean;
  /** Nội dung loading */
  loadingContent?: React.ReactNode;
  /** Callback xử lý phím tắt */
  onKeyDown?: (e: React.KeyboardEvent<HTMLDivElement>) => void;
  /** Class name tùy chỉnh */
  className?: string;
  /** Style tùy chỉnh cho modal */
  style?: React.CSSProperties;
}

/**
 * Cấu hình modal
 */
export interface ModalConfig {
  /** Chiều rộng mặc định */
  defaultWidth: number;
  /** Chiều cao mặc định */
  defaultHeight: number;
  /** Z-index mặc định */
  defaultZIndex: number;
  /** Delay khi hover */
  mouseEnterDelay: number;
}

/**
 * Ràng buộc vị trí modal
 */
export interface ModalConstraints {
  /** Khoảng cách tối thiểu từ cạnh trái */
  minX: number;
  /** Khoảng cách tối thiểu từ cạnh trên */
  minY: number;
  /** Chiều rộng mặc định */
  defaultWidth: number;
  /** Chiều cao mặc định */
  defaultHeight: number;
}