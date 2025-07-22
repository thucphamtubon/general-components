import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Modal, Space, Typography } from 'antd';
import React, { useCallback, useEffect } from 'react';
import './BaseModal.less';
import {
  BASE_MODAL_ARIA_LABELS,
  BASE_MODAL_CONFIG,
  BASE_MODAL_STYLES,
  BASE_MODAL_UI_LABELS,
} from './constants';
import type { BaseModalProps } from './types';
import { useBaseModalStore } from './useBaseModalStore';
import { useDraggableBaseModal } from './useDraggableBaseModal';

const { Text } = Typography;

const BaseModal: React.FC<BaseModalProps> = ({
  visible,
  onCancel,
  title = 'Modal',
  titleIcon,
  children,
  footer,
  width = BASE_MODAL_CONFIG.defaultWidth,
  modalId = 'default-modal',
  draggable = true,
  mask = false,
  zIndex = BASE_MODAL_CONFIG.defaultZIndex,
  destroyOnClose = true,
  ariaLabel,
  showGuidance: externalShowGuidance,
  onToggleGuidance,
  guidanceText,
  showGuidanceToggle = true,
  hasUnsavedChanges = false,
  unsavedChangesText = BASE_MODAL_UI_LABELS.UNSAVED_CHANGES,
  isLoading = false,
  loadingContent,
  onKeyDown,
  className = '',
  style,
}) => {
  // Zustand store
  const { showGuidance: storeShowGuidance, toggleGuidance } = useBaseModalStore();
  
  // Sử dụng external showGuidance nếu có, nếu không thì dùng từ store
  const showGuidance = externalShowGuidance !== undefined ? externalShowGuidance : storeShowGuidance;
  
  // Draggable modal hook
  const { isDragging, modalPosition, modalRef, handleMouseDown } = useDraggableBaseModal(modalId);

  const handleClose = useCallback(() => {
    if (hasUnsavedChanges) {
      // Có thể thêm confirmation dialog ở đây nếu cần
    }
    onCancel();
  }, [hasUnsavedChanges, onCancel]);

  const handleHeaderKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const modalContent = modalRef.current?.querySelector('.base-modal-content');
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

    // Gọi callback tùy chỉnh nếu có
    onKeyDown?.(e);
  }, [handleClose, onKeyDown]);

  const handleToggleGuidance = useCallback(() => {
    if (onToggleGuidance) {
      onToggleGuidance();
    } else {
      toggleGuidance();
    }
  }, [onToggleGuidance, toggleGuidance]);

  // Reset loading state khi modal đóng
  useEffect(() => {
    if (!visible) {
      // Có thể reset các state khác ở đây nếu cần
    }
  }, [visible]);

  // Render title với drag functionality
  const renderTitle = () => (
    <div
      style={{
        ...BASE_MODAL_STYLES.modalTitle,
        ...(draggable ? BASE_MODAL_STYLES.modalTitleDynamic(isDragging) : {}),
      }}
      onMouseDown={draggable ? handleMouseDown : undefined}
      onKeyDown={draggable ? handleHeaderKeyDown : undefined}
      tabIndex={draggable ? 0 : undefined}
      role={draggable ? 'button' : undefined}
      aria-label={
        draggable
          ? `${BASE_MODAL_ARIA_LABELS.DRAG_MODAL} ${title}. Nhấn Enter để focus vào nội dung modal.`
          : title
      }
      title={draggable ? BASE_MODAL_UI_LABELS.DRAG_HINT : undefined}
      className={`base-modal-title ${draggable ? 'draggable' : ''} ${isDragging ? 'dragging' : ''} hoverClassBG`}
    >
      {titleIcon && (
        <span
          className={`base-modal-title-icon ${isDragging ? 'dragging' : ''}`}
          style={{
            ...BASE_MODAL_STYLES.modalTitleIcon,
            ...(draggable ? BASE_MODAL_STYLES.modalTitleIconDynamic(isDragging) : {}),
          }}
          aria-hidden="true"
        >
          {titleIcon}
        </span>
      )}
      <span style={BASE_MODAL_STYLES.modalTitleSpan}>
        {title}
        {hasUnsavedChanges && (
          <Text
            type="warning"
            style={BASE_MODAL_STYLES.unsavedChangesText}
            aria-label="Có thay đổi chưa được lưu"
            className="base-modal-unsaved-changes"
          >
            {unsavedChangesText}
          </Text>
        )}
      </span>
    </div>
  );

  // Render footer với guidance toggle
  const renderFooter = () => {
    if (footer === null) return null;
    
    if (footer) return footer;

    return (
      <Space style={BASE_MODAL_STYLES.footerSpace} className="base-modal-footer">
        {showGuidance && guidanceText ? (
          <Text type="secondary" style={BASE_MODAL_STYLES.keyboardHintText} className="keyboard-hint">
            {guidanceText}
          </Text>
        ) : (
          <div></div>
        )}
        {showGuidanceToggle && (
          <Button
            type="text"
            size="small"
            icon={showGuidance ? <EyeInvisibleOutlined /> : <EyeOutlined />}
            onClick={handleToggleGuidance}
            className="guidance-toggle"
            style={{ fontSize: '12px', color: '#666' }}
            aria-label={showGuidance ? BASE_MODAL_ARIA_LABELS.HIDE_GUIDANCE : BASE_MODAL_ARIA_LABELS.SHOW_GUIDANCE}
          >
            {showGuidance ? BASE_MODAL_UI_LABELS.HIDE_GUIDANCE : BASE_MODAL_UI_LABELS.SHOW_GUIDANCE}
          </Button>
        )}
      </Space>
    );
  };

  // Render loading overlay
  const renderLoadingOverlay = () => {
    if (!isLoading) return null;

    return (
      <div
        className="base-modal-loading-overlay"
        style={BASE_MODAL_STYLES.loadingOverlay}
        aria-live="polite"
        aria-label="Đang xử lý..."
      >
        {loadingContent || (
          <Space direction="vertical" align="center">
            <div className="ant-spin ant-spin-spinning">
              <span className="ant-spin-dot ant-spin-dot-spin">
                <i className="ant-spin-dot-item"></i>
                <i className="ant-spin-dot-item"></i>
                <i className="ant-spin-dot-item"></i>
                <i className="ant-spin-dot-item"></i>
              </span>
            </div>
            <Text type="secondary">{BASE_MODAL_UI_LABELS.LOADING_TEXT}</Text>
          </Space>
        )}
      </div>
    );
  };

  return (
    <Modal
      className={`base-modal ${className}`}
      title={renderTitle()}
      open={visible}
      onCancel={handleClose}
      footer={renderFooter()}
      width={width}
      destroyOnClose={destroyOnClose}
      mask={mask}
      zIndex={zIndex}
      style={{
        ...BASE_MODAL_STYLES.modalStyle(modalPosition),
        ...style,
      }}
      getContainer={() => document.body}
      aria-label={ariaLabel || `Modal ${title}`}
    >
      <div
        ref={modalRef}
        className="base-modal-content"
        id={`modal-content-${modalId}`}
        tabIndex={-1}
        role="main"
        aria-label={BASE_MODAL_ARIA_LABELS.MODAL_CONTENT}
        style={BASE_MODAL_STYLES.modalContent(isLoading)}
        onKeyDown={handleModalKeyDown}
      >
        {renderLoadingOverlay()}
        {children}
      </div>
    </Modal>
  );
};

export default BaseModal;