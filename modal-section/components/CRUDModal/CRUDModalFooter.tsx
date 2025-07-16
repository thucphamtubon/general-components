import {
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SaveOutlined
} from '@ant-design/icons'
import { Button, Space } from 'antd'
import React from 'react'
import { CRUDMode, ICRUDModalFooterProps } from './types'

/**
 * Get default texts based on mode
 */
const getDefaultTexts = (mode: CRUDMode) => {
  switch (mode) {
    case 'create':
      return {
        submit: 'Tạo mới',
        cancel: 'Hủy',
        delete: 'Xóa'
      }
    case 'edit':
      return {
        submit: 'Cập nhật',
        cancel: 'Hủy',
        delete: 'Xóa'
      }
    case 'view':
      return {
        submit: 'Chỉnh sửa',
        cancel: 'Đóng',
        delete: 'Xóa'
      }
    case 'delete':
      return {
        submit: 'Xóa',
        cancel: 'Hủy',
        delete: 'Xóa'
      }
    default:
      return {
        submit: 'Lưu',
        cancel: 'Hủy',
        delete: 'Xóa'
      }
  }
}

/**
 * Get default icon based on mode
 */
const getDefaultIcon = (mode: CRUDMode) => {
  switch (mode) {
    case 'create':
      return <PlusOutlined />
    case 'edit':
      return <SaveOutlined />
    case 'view':
      return <EditOutlined />
    case 'delete':
      return <DeleteOutlined />
    default:
      return <SaveOutlined />
  }
}

/**
 * CRUDModalFooter Component
 * 
 * Responsibility: Render footer with action buttons for CRUD operations
 * - Displays appropriate buttons based on mode and permissions
 * - Handles button states (loading, disabled)
 * - Provides consistent button styling and behavior
 * - Supports custom actions and button configurations
 * 
 * SRP: Single responsibility for footer rendering and button management
 */
const CRUDModalFooter: React.FC<ICRUDModalFooterProps> = ({
  mode,
  loading = false,
  submitLoading = false,
  submitDisabled = false,
  cancelDisabled = false,
  onSubmit,
  onCancel,
  onDelete,
  submitText,
  cancelText,
  deleteText,
  submitButtonAriaLabel,
  cancelButtonAriaLabel,
  deleteButtonAriaLabel,
  permissions = {},
  showDeleteButton = false,
  showSubmitButton = true,
  showCancelButton = true,
  customActions
}) => {
  const defaultTexts = getDefaultTexts(mode)
  const defaultIcon = getDefaultIcon(mode)

  // Determine button visibility based on permissions
  const canShowSubmitButton = showSubmitButton && (() => {
    switch (mode) {
      case 'create':
        return permissions.canCreate !== false
      case 'edit':
        return permissions.canEdit !== false
      case 'view':
        return permissions.canEdit !== false // In view mode, submit button becomes edit
      case 'delete':
        return permissions.canDelete !== false
      default:
        return permissions.canSubmit !== false
    }
  })()

  const canShowDeleteButton = showDeleteButton && permissions.canDelete !== false && mode !== 'delete'
  const canShowCancelButton = showCancelButton && permissions.canCancel !== false

  // Determine button type based on mode
  const getSubmitButtonType = () => {
    switch (mode) {
      case 'delete':
        return 'primary'
      case 'view':
        return 'default'
      default:
        return 'primary'
    }
  }

  const getSubmitButtonDanger = () => {
    return mode === 'delete'
  }

  return (
    <div 
      style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 24px',
        borderTop: '1px solid #f0f0f0',
        backgroundColor: '#fafafa'
      }}
      data-testid="crud-modal-footer"
    >
      {/* Left side - Delete button */}
      <div>
        {canShowDeleteButton && (
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={onDelete}
            disabled={loading || submitLoading}
            aria-label={deleteButtonAriaLabel || `Xóa ${mode}`}
            data-testid="crud-modal-delete-btn"
          >
            {deleteText || defaultTexts.delete}
          </Button>
        )}
      </div>

      {/* Right side - Main actions */}
      <Space>
        {/* Custom actions */}
        {customActions}

        {/* Cancel button */}
        {canShowCancelButton && (
          <Button
            icon={<CloseOutlined />}
            onClick={onCancel}
            disabled={cancelDisabled || loading}
            loading={loading && !submitLoading}
            aria-label={cancelButtonAriaLabel || `${defaultTexts.cancel} ${mode}`}
            data-testid="crud-modal-cancel-btn"
          >
            {cancelText || defaultTexts.cancel}
          </Button>
        )}

        {/* Submit button */}
        {canShowSubmitButton && (
          <Button
            type={getSubmitButtonType()}
            danger={getSubmitButtonDanger()}
            icon={defaultIcon}
            onClick={onSubmit}
            disabled={submitDisabled || loading}
            loading={submitLoading}
            aria-label={submitButtonAriaLabel || `${defaultTexts.submit} ${mode}`}
            data-testid="crud-modal-submit-btn"
          >
            {submitText || defaultTexts.submit}
          </Button>
        )}
      </Space>
    </div>
  )
}

export default CRUDModalFooter 