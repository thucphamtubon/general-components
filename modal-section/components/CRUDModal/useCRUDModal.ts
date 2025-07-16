import { message } from 'antd'
import { useCallback, useEffect, useState } from 'react'
import { useModalStore } from '../../shared/store'
import { ConfirmModal } from '../ConfirmModal'
import {
  ICRUDModalHookOptions,
  ICRUDModalHookReturn,
  ICRUDModalPermissions,
  ICRUDModalState
} from './types'

/**
 * useCRUDModal Hook
 * 
 * Responsibility: Manage CRUD modal state and provide handlers
 * - Manages modal visibility, loading states, errors
 * - Provides handlers for CRUD operations
 * - Handles confirmation dialogs for destructive actions
 * - Integrates with modal store for state management
 * 
 * SRP: Single responsibility for CRUD modal state management
 */
export const useCRUDModal = (options: ICRUDModalHookOptions): ICRUDModalHookReturn => {
  const {
    modalId,
    mode,
    initialData,
    permissions = {},
    onSuccess,
    onError,
    onCancel,
    validateBeforeSubmit,
    transformDataBeforeSubmit,
    entityName = 'dữ liệu'
  } = options

  // Modal store integration
  const isVisible = useModalStore(state => Boolean(state.modals[modalId]))
  const openModalStore = useModalStore(state => state.openModal)
  const closeModalStore = useModalStore(state => state.closeModal)

  // Internal state management
  const [loading, setLoading] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [isDirty, setIsDirty] = useState(false)
  const [errors, setErrors] = useState<string[]>([])

  // Computed modal state
  const modalState: ICRUDModalState = {
    loading,
    submitLoading,
    isDirty,
    errors,
    mode,
    isVisible
  }

  // Modal actions
  const openModal = useCallback(() => {
    openModalStore(modalId)
  }, [modalId, openModalStore])

  const closeModal = useCallback(() => {
    closeModalStore(modalId)
    // Reset state when closing
    setLoading(false)
    setSubmitLoading(false)
    setIsDirty(false)
    setErrors([])
  }, [modalId, closeModalStore])

  // Error management
  const addError = useCallback((error: string) => {
    setErrors(prev => [...prev, error])
  }, [])

  const clearErrors = useCallback(() => {
    setErrors([])
  }, [])

  // Validation
  const validateForm = useCallback(async (): Promise<boolean> => {
    try {
      if (validateBeforeSubmit) {
        const data = transformDataBeforeSubmit ? transformDataBeforeSubmit(initialData) : initialData
        const isValid = await validateBeforeSubmit(data)
        return isValid
      }
      return true
    } catch (error) {
      console.error('Form validation error:', error)
      return false
    }
  }, [validateBeforeSubmit, transformDataBeforeSubmit, initialData])

  // Permission utilities
  const canPerformAction = useCallback((action: keyof ICRUDModalPermissions): boolean => {
    return permissions[action] !== false
  }, [permissions])

  // Check if dirty confirmation is required
  const isDirtyConfirmRequired = useCallback((): boolean => {
    return isDirty && mode !== 'view'
  }, [isDirty, mode])

  // Handlers
  const handleSubmit = useCallback(async (): Promise<void> => {
    try {
      // Check permissions
      const canSubmit = (() => {
        switch (mode) {
          case 'create':
            return canPerformAction('canCreate')
          case 'edit':
            return canPerformAction('canEdit')
          case 'delete':
            return canPerformAction('canDelete')
          default:
            return canPerformAction('canSubmit')
        }
      })()

      if (!canSubmit) {
        const errorMsg = `Bạn không có quyền ${mode === 'create' ? 'tạo' : mode === 'edit' ? 'chỉnh sửa' : 'xóa'} ${entityName}`
        addError(errorMsg)
        message.error(errorMsg)
        return
      }

      // Validate form
      setSubmitLoading(true)
      const isValid = await validateForm()
      
      if (!isValid) {
        addError('Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.')
        return
      }

      // Transform data if needed
      const finalData = transformDataBeforeSubmit ? transformDataBeforeSubmit(initialData) : initialData

      // Call success callback
      if (onSuccess) {
        await onSuccess(finalData)
      }

      // Show success message
      const successMessage = (() => {
        switch (mode) {
          case 'create':
            return `Tạo ${entityName} thành công!`
          case 'edit':
            return `Cập nhật ${entityName} thành công!`
          case 'delete':
            return `Xóa ${entityName} thành công!`
          default:
            return `Lưu ${entityName} thành công!`
        }
      })()

      message.success(successMessage)
      closeModal()

    } catch (error: any) {
      console.error('CRUD operation error:', error)
      const errorMessage = error?.message || `Có lỗi xảy ra khi ${mode === 'create' ? 'tạo' : mode === 'edit' ? 'cập nhật' : 'xóa'} ${entityName}`
      addError(errorMessage)
      message.error(errorMessage)
      
      if (onError) {
        onError(error)
      }
    } finally {
      setSubmitLoading(false)
    }
  }, [
    mode,
    canPerformAction,
    entityName,
    validateForm,
    transformDataBeforeSubmit,
    initialData,
    onSuccess,
    onError,
    addError,
    closeModal
  ])

  const handleDelete = useCallback(async (): Promise<void> => {
    if (!canPerformAction('canDelete')) {
      const errorMsg = `Bạn không có quyền xóa ${entityName}`
      addError(errorMsg)
      message.error(errorMsg)
      return
    }

    // Show confirmation dialog
    ConfirmModal.show({
      title: `Xác nhận xóa ${entityName}`,
      content: `Bạn có chắc chắn muốn xóa ${entityName} này? Hành động này không thể hoàn tác.`,
      onOk: async () => {
        try {
          setSubmitLoading(true)
          
          // Transform data if needed
          const finalData = transformDataBeforeSubmit ? transformDataBeforeSubmit(initialData) : initialData
          
          // Call success callback
          if (onSuccess) {
            await onSuccess(finalData)
          }

          message.success(`Xóa ${entityName} thành công!`)
          closeModal()
        } catch (error: any) {
          console.error('Delete operation error:', error)
          const errorMessage = error?.message || `Có lỗi xảy ra khi xóa ${entityName}`
          addError(errorMessage)
          message.error(errorMessage)
          
          if (onError) {
            onError(error)
          }
        } finally {
          setSubmitLoading(false)
        }
      }
    })
  }, [
    canPerformAction,
    entityName,
    transformDataBeforeSubmit,
    initialData,
    onSuccess,
    onError,
    addError,
    closeModal
  ])

  const handleCancel = useCallback(() => {
    if (isDirtyConfirmRequired()) {
      ConfirmModal.show({
        title: 'Bạn có thay đổi chưa lưu',
        content: 'Bạn có chắc chắn muốn thoát không? Mọi thay đổi sẽ không được lưu lại.',
        onOk: () => {
          closeModal()
          if (onCancel) {
            onCancel()
          }
        }
      })
    } else {
      closeModal()
      if (onCancel) {
        onCancel()
      }
    }
  }, [isDirtyConfirmRequired, closeModal, onCancel])

  const handleClose = useCallback(() => {
    handleCancel()
  }, [handleCancel])

  const handleErrorClose = useCallback(() => {
    clearErrors()
  }, [clearErrors])

  // Reset state when mode changes
  useEffect(() => {
    setLoading(false)
    setSubmitLoading(false)
    setIsDirty(false)
    setErrors([])
  }, [mode])

  return {
    // State
    modalState,
    
    // Actions
    openModal,
    closeModal,
    setLoading,
    setSubmitLoading,
    setIsDirty,
    setErrors,
    addError,
    clearErrors,
    
    // Handlers
    handleSubmit,
    handleCancel,
    handleDelete,
    handleClose,
    handleErrorClose,
    
    // Validation
    validateForm,
    
    // Utilities
    isDirtyConfirmRequired,
    canPerformAction
  }
} 