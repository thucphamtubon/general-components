import React, { useEffect, useCallback } from 'react'
import { 
  EditOutlined, 
  PlusOutlined, 
  EyeOutlined, 
  DeleteOutlined 
} from '@ant-design/icons'
import { ICRUDModalProps, CRUDMode } from './types'
import { useCRUDModal } from './useCRUDModal'
import CRUDModalBase from './CRUDModalBase'

/**
 * Get default title based on mode and entity name
 */
const getDefaultTitle = (mode: CRUDMode, entityName: string): string => {
  switch (mode) {
    case 'create':
      return `Tạo ${entityName}`
    case 'edit':
      return `Chỉnh sửa ${entityName}`
    case 'view':
      return `Xem ${entityName}`
    case 'delete':
      return `Xóa ${entityName}`
    default:
      return entityName
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
      return <EditOutlined />
    case 'view':
      return <EyeOutlined />
    case 'delete':
      return <DeleteOutlined />
    default:
      return <EditOutlined />
  }
}

/**
 * CRUDModal Component
 * 
 * Responsibility: Main CRUD modal component with complete functionality
 * - Integrates all CRUD modal sub-components
 * - Provides complete CRUD operations (Create, Read, Update, Delete)
 * - Handles mode-specific behavior and validations
 * - Manages form integration and data transformations
 * - Provides hooks integration for state management
 * 
 * SRP: Single responsibility for CRUD modal orchestration and integration
 */
const CRUDModal: React.FC<ICRUDModalProps> = ({
  modalId,
  mode,
  title,
  children,
  
  // CRUD operation callbacks
  onCreateSubmit,
  onEditSubmit,
  onDeleteSubmit,
  
  // Form integration
  form,
  formRef,
  
  // Data transformation
  transformDataBeforeSubmit,
  validateBeforeSubmit,
  
  // Modal lifecycle
  onModalOpen,
  onModalClose,
  onModeChange,
  
  // Error handling
  onValidationError,
  onSubmitError,
  
  // Confirmation dialogs
  confirmBeforeDelete = true,
  confirmBeforeCancel = true,
  deleteConfirmTitle,
  deleteConfirmContent,
  cancelConfirmTitle,
  cancelConfirmContent,
  
  // Base props
  entityName = 'dữ liệu',
  initialData,
  permissions = {},
  canAccess = true,
  accessDeniedMessage,
  icon,
  width,
  loading: externalLoading,
  submitLoading: externalSubmitLoading,
  isDirty: externalIsDirty,
  errors: externalErrors,
  
  // Event handlers
  onSubmit: externalOnSubmit,
  onCancel: externalOnCancel,
  onDelete: externalOnDelete,
  onClose: externalOnClose,
  onErrorClose: externalOnErrorClose,
  
  // Button configurations
  submitDisabled,
  cancelDisabled,
  submitText,
  cancelText,
  deleteText,
  submitButtonAriaLabel,
  cancelButtonAriaLabel,
  deleteButtonAriaLabel,
  
  // Footer customization
  showFooter,
  showDeleteButton,
  showSubmitButton,
  showCancelButton,
  customFooterActions,
  
  // Modal behavior
  maskClosable,
  destroyOnClose,
  closable,
  
  // Styling
  footerClassName,
  contentClassName
}) => {
  // Initialize CRUD modal hook
  const crudModal = useCRUDModal({
    modalId,
    mode,
    initialData,
    permissions,
    onSuccess: async (data) => {
      // Call appropriate CRUD operation callback
      switch (mode) {
        case 'create':
          if (onCreateSubmit) {
            await onCreateSubmit(data)
          }
          break
        case 'edit':
          if (onEditSubmit) {
            await onEditSubmit(data)
          }
          break
        case 'delete':
          if (onDeleteSubmit) {
            await onDeleteSubmit(data)
          }
          break
      }
    },
    onError: (error) => {
      if (onSubmitError) {
        onSubmitError(error)
      }
    },
    onCancel: externalOnCancel,
    validateBeforeSubmit: validateBeforeSubmit || (async () => {
      // Default form validation if form is provided
      if (form || formRef?.current) {
        try {
          const formInstance = form || formRef?.current
          await formInstance.validateFields()
          return true
        } catch (error: any) {
          if (onValidationError) {
            const errorMessages = error?.errorFields?.map((field: any) => field.errors[0]) || ['Form validation failed']
            onValidationError(errorMessages)
          }
          return false
        }
      }
      return true
    }),
    transformDataBeforeSubmit: transformDataBeforeSubmit || (() => {
      // Default data transformation from form
      if (form || formRef?.current) {
        const formInstance = form || formRef?.current
        return formInstance.getFieldsValue()
      }
      return initialData
    }),
    entityName
  })

  // Modal lifecycle effects
  useEffect(() => {
    if (crudModal.modalState.isVisible && onModalOpen) {
      onModalOpen(mode)
    }
  }, [crudModal.modalState.isVisible, mode, onModalOpen])

  useEffect(() => {
    if (!crudModal.modalState.isVisible && onModalClose) {
      onModalClose(mode)
    }
  }, [crudModal.modalState.isVisible, mode, onModalClose])

  // Handle mode changes
  useEffect(() => {
    if (onModeChange) {
      onModeChange(mode, mode) // Current implementation assumes single mode
    }
  }, [mode, onModeChange])

  // Merge external state with hook state
  const mergedState = {
    loading: externalLoading ?? crudModal.modalState.loading,
    submitLoading: externalSubmitLoading ?? crudModal.modalState.submitLoading,
    isDirty: externalIsDirty ?? crudModal.modalState.isDirty,
    errors: externalErrors ?? crudModal.modalState.errors
  }

  // Create enhanced handlers that can be overridden
  const handleSubmit = useCallback(() => {
    if (externalOnSubmit) {
      externalOnSubmit()
    } else {
      crudModal.handleSubmit()
    }
  }, [externalOnSubmit, crudModal.handleSubmit])

  const handleCancel = useCallback(() => {
    if (externalOnCancel) {
      externalOnCancel()
    } else {
      crudModal.handleCancel()
    }
  }, [externalOnCancel, crudModal.handleCancel])

  const handleDelete = useCallback(() => {
    if (externalOnDelete) {
      externalOnDelete()
    } else {
      crudModal.handleDelete()
    }
  }, [externalOnDelete, crudModal.handleDelete])

  const handleClose = useCallback(() => {
    if (externalOnClose) {
      externalOnClose()
    } else {
      crudModal.handleClose()
    }
  }, [externalOnClose, crudModal.handleClose])

  const handleErrorClose = useCallback(() => {
    if (externalOnErrorClose) {
      externalOnErrorClose()
    } else {
      crudModal.handleErrorClose()
    }
  }, [externalOnErrorClose, crudModal.handleErrorClose])

  // Render children with state injection if function
  const renderChildren = () => {
    if (typeof children === 'function') {
      return children({
        ...crudModal.modalState,
        ...mergedState
      })
    }
    return children
  }

  return (
    <CRUDModalBase
      modalId={modalId}
      mode={mode}
      title={title || getDefaultTitle(mode, entityName)}
      width={width}
      icon={icon || getDefaultIcon(mode)}
      
      // State
      loading={mergedState.loading}
      submitLoading={mergedState.submitLoading}
      isDirty={mergedState.isDirty}
      errors={mergedState.errors}
      
      // Handlers
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      onDelete={handleDelete}
      onClose={handleClose}
      onErrorClose={handleErrorClose}
      
      // Button configurations
      submitDisabled={submitDisabled}
      cancelDisabled={cancelDisabled}
      submitText={submitText}
      cancelText={cancelText}
      deleteText={deleteText}
      submitButtonAriaLabel={submitButtonAriaLabel}
      cancelButtonAriaLabel={cancelButtonAriaLabel}
      deleteButtonAriaLabel={deleteButtonAriaLabel}
      
      // Permissions and access
      permissions={permissions}
      canAccess={canAccess}
      accessDeniedMessage={accessDeniedMessage}
      
      // Footer customization
      showFooter={showFooter}
      showDeleteButton={showDeleteButton}
      showSubmitButton={showSubmitButton}
      showCancelButton={showCancelButton}
      customFooterActions={customFooterActions}
      
      // Modal behavior
      maskClosable={maskClosable}
      destroyOnClose={destroyOnClose}
      closable={closable}
      
      // Data and context
      initialData={initialData}
      entityName={entityName}
      
      // Styling
      footerClassName={footerClassName}
      contentClassName={contentClassName}
    >
      {renderChildren()}
    </CRUDModalBase>
  )
}

export default CRUDModal 