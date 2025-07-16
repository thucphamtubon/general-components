import React from 'react'
import { IWidthModalProps } from '../../shared/types'

/**
 * CRUD operation modes
 */
export type CRUDMode = 'create' | 'edit' | 'view' | 'delete'

/**
 * CRUD modal state interface
 */
export interface ICRUDModalState {
  loading: boolean
  submitLoading: boolean
  isDirty: boolean
  errors: string[]
  mode: CRUDMode
  isVisible: boolean
}

/**
 * CRUD modal permissions interface
 */
export interface ICRUDModalPermissions {
  canCreate?: boolean
  canEdit?: boolean
  canView?: boolean
  canDelete?: boolean
  canSubmit?: boolean
  canCancel?: boolean
}

/**
 * CRUD modal footer props
 */
export interface ICRUDModalFooterProps {
  mode: CRUDMode
  loading?: boolean
  submitLoading?: boolean
  submitDisabled?: boolean
  cancelDisabled?: boolean
  onSubmit?: () => void
  onCancel?: () => void
  onDelete?: () => void
  submitText?: string
  cancelText?: string
  deleteText?: string
  submitButtonAriaLabel?: string
  cancelButtonAriaLabel?: string
  deleteButtonAriaLabel?: string
  permissions?: ICRUDModalPermissions
  showDeleteButton?: boolean
  showSubmitButton?: boolean
  showCancelButton?: boolean
  customActions?: React.ReactNode
}

/**
 * CRUD modal error alert props
 */
export interface ICRUDModalErrorAlertProps {
  errors: string[]
  onClose?: () => void
  showClose?: boolean
  type?: 'error' | 'warning'
}

/**
 * CRUD modal base props
 */
export interface ICRUDModalBaseProps extends IWidthModalProps {
  modalId: string
  mode: CRUDMode
  children: React.ReactNode
  
  // State props
  loading?: boolean
  submitLoading?: boolean
  isDirty?: boolean
  errors?: string[]
  
  // Event handlers
  onSubmit?: () => void
  onCancel?: () => void
  onDelete?: () => void
  onClose?: () => void
  onErrorClose?: () => void
  
  // Button configurations
  submitDisabled?: boolean
  cancelDisabled?: boolean
  submitText?: string
  cancelText?: string
  deleteText?: string
  submitButtonAriaLabel?: string
  cancelButtonAriaLabel?: string
  deleteButtonAriaLabel?: string
  
  // Permissions and access
  permissions?: ICRUDModalPermissions
  canAccess?: boolean
  accessDeniedMessage?: string
  
  // Footer customization
  showFooter?: boolean
  showDeleteButton?: boolean
  showSubmitButton?: boolean
  showCancelButton?: boolean
  customFooterActions?: React.ReactNode
  
  // Modal behavior
  maskClosable?: boolean
  destroyOnClose?: boolean
  closable?: boolean
  
  // Data and context
  initialData?: any
  entityName?: string
  
  // Styling
  footerClassName?: string
  contentClassName?: string
}

/**
 * CRUD modal hook options
 */
export interface ICRUDModalHookOptions {
  modalId: string
  mode: CRUDMode
  initialData?: any
  permissions?: ICRUDModalPermissions
  onSuccess?: (data?: any) => void
  onError?: (error: any) => void
  onCancel?: () => void
  validateBeforeSubmit?: (data: any) => Promise<boolean> | boolean
  transformDataBeforeSubmit?: (data: any) => any
  entityName?: string
}

/**
 * CRUD modal hook return type
 */
export interface ICRUDModalHookReturn {
  // State
  modalState: ICRUDModalState
  
  // Actions
  openModal: () => void
  closeModal: () => void
  setLoading: (loading: boolean) => void
  setSubmitLoading: (loading: boolean) => void
  setIsDirty: (isDirty: boolean) => void
  setErrors: (errors: string[]) => void
  addError: (error: string) => void
  clearErrors: () => void
  
  // Handlers
  handleSubmit: () => Promise<void>
  handleCancel: () => void
  handleDelete: () => Promise<void>
  handleClose: () => void
  handleErrorClose: () => void
  
  // Validation
  validateForm: () => Promise<boolean>
  
  // Utilities
  isDirtyConfirmRequired: () => boolean
  canPerformAction: (action: keyof ICRUDModalPermissions) => boolean
}

/**
 * CRUD modal main component props
 */
export interface ICRUDModalProps extends Omit<ICRUDModalBaseProps, 'children'> {
  children: React.ReactNode | ((state: ICRUDModalState) => React.ReactNode)
  
  // CRUD operation callbacks
  onCreateSubmit?: (data: any) => Promise<void>
  onEditSubmit?: (data: any) => Promise<void>
  onDeleteSubmit?: (data: any) => Promise<void>
  
  // Form integration
  form?: any
  formRef?: React.RefObject<any>
  
  // Data transformation
  transformDataBeforeSubmit?: (data: any) => any
  validateBeforeSubmit?: (data: any) => Promise<boolean> | boolean
  
  // Modal lifecycle
  onModalOpen?: (mode: CRUDMode) => void
  onModalClose?: (mode: CRUDMode) => void
  onModeChange?: (newMode: CRUDMode, oldMode: CRUDMode) => void
  
  // Error handling
  onValidationError?: (errors: string[]) => void
  onSubmitError?: (error: any) => void
  
  // Confirmation dialogs
  confirmBeforeDelete?: boolean
  confirmBeforeCancel?: boolean
  deleteConfirmTitle?: string
  deleteConfirmContent?: string
  cancelConfirmTitle?: string
  cancelConfirmContent?: string
} 