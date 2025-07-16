import { Modal, Spin, Result } from 'antd'
import React from 'react'
import { useModalStore } from '../../shared/store'
import { ICRUDModalBaseProps } from './types'
import CRUDModalFooter from './CRUDModalFooter'
import CRUDModalErrorAlert from './CRUDModalErrorAlert'

/**
 * CRUDModalBase Component
 * 
 * Responsibility: Core modal structure and rendering logic
 * - Manages modal visibility and basic structure
 * - Handles loading states and error display
 * - Provides consistent modal layout and styling
 * - Integrates with modal store for state management
 * 
 * SRP: Single responsibility for modal structure and rendering
 */
const CRUDModalBase: React.FC<ICRUDModalBaseProps> = ({
  modalId,
  mode,
  title,
  width = 1200,
  children,
  
  // State props
  loading = false,
  submitLoading = false,
  isDirty = false,
  errors = [],
  
  // Event handlers
  onSubmit,
  onCancel,
  onDelete,
  onClose,
  onErrorClose,
  
  // Button configurations
  submitDisabled = false,
  cancelDisabled = false,
  submitText,
  cancelText,
  deleteText,
  submitButtonAriaLabel,
  cancelButtonAriaLabel,
  deleteButtonAriaLabel,
  
  // Permissions and access
  permissions = {},
  canAccess = true,
  accessDeniedMessage = 'Bạn không có quyền thực hiện chức năng này.',
  
  // Footer customization
  showFooter = true,
  showDeleteButton = false,
  showSubmitButton = true,
  showCancelButton = true,
  customFooterActions,
  
  // Modal behavior
  maskClosable = false,
  destroyOnClose = true,
  closable = true,
  
  // Data and context
  initialData,
  entityName = 'dữ liệu',
  
  // Styling
  footerClassName,
  contentClassName,
  
  // Icon
  icon
}) => {
  // Get modal visibility from store
  const isVisible = useModalStore(state => Boolean(state.modals[modalId]))
  
  // Modal close handler
  const handleModalClose = () => {
    if (onClose) {
      onClose()
    } else if (onCancel) {
      onCancel()
    }
  }

  // Render modal content
  const renderContent = () => {
    // Access denied case
    if (!canAccess) {
      return (
        <Result
          status="403"
          title="403 - Phân quyền"
          subTitle={accessDeniedMessage}
          data-testid="crud-modal-access-denied"
        />
      )
    }

    // Normal content
    return (
      <div className={contentClassName}>
        {/* Error display */}
        {errors.length > 0 && (
          <CRUDModalErrorAlert 
            errors={errors} 
            onClose={onErrorClose}
            showClose={!!onErrorClose}
            type="error"
          />
        )}
        
        {/* Main content */}
        <div data-testid="crud-modal-content">
          {children}
        </div>
      </div>
    )
  }

  // Render footer
  const renderFooter = () => {
    if (!showFooter) {
      return null
    }

    return (
      <div className={footerClassName}>
        <CRUDModalFooter
          mode={mode}
          loading={loading}
          submitLoading={submitLoading}
          submitDisabled={submitDisabled}
          cancelDisabled={cancelDisabled}
          onSubmit={onSubmit}
          onCancel={onCancel}
          onDelete={onDelete}
          submitText={submitText}
          cancelText={cancelText}
          deleteText={deleteText}
          submitButtonAriaLabel={submitButtonAriaLabel}
          cancelButtonAriaLabel={cancelButtonAriaLabel}
          deleteButtonAriaLabel={deleteButtonAriaLabel}
          permissions={permissions}
          showDeleteButton={showDeleteButton}
          showSubmitButton={showSubmitButton}
          showCancelButton={showCancelButton}
          customActions={customFooterActions}
        />
      </div>
    )
  }

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {icon && <span>{icon}</span>}
          <span>{title}</span>
        </div>
      }
      open={isVisible}
      width={width}
      onCancel={handleModalClose}
      maskClosable={maskClosable}
      destroyOnClose={destroyOnClose}
      closable={closable}
      footer={renderFooter()}
      style={{ top: 20 }}
      wrapClassName={`crud-modal crud-modal-${mode}`}
      data-testid={`crud-modal-${modalId}`}
    >
      <Spin spinning={loading} tip="Đang xử lý...">
        {renderContent()}
      </Spin>
    </Modal>
  )
}

export default CRUDModalBase 