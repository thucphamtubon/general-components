import { CheckCircleOutlined, ExclamationCircleOutlined, InfoCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
import { Modal } from 'antd'
import React from 'react'
import { AlertType, IBaseModalConfig } from './types'

/**
 * Handle modal errors with consistent logging
 */
export const handleModalError = (error: any, context: string) => {
  if (error?.errorFields) {
    // Form validation error - don't close modal
    console.warn(`${context} validation failed:`, error)
  } else {
    // Other error
    console.error(`${context} error:`, error)
  }
}

/**
 * Create async error handler for modal callbacks
 */
export const createAsyncHandler = (callback?: (...args: any[]) => Promise<void> | void, context: string = 'Modal') => {
  return async (...args: any[]) => {
    try {
      if (callback) {
        await callback(...args)
      }
    } catch (error) {
      handleModalError(error, context)
      throw error // Re-throw for component-specific handling
    }
  }
}

/**
 * Get default icon based on alert type
 */
export const getAlertIcon = (type: AlertType): React.ReactNode => {
  switch (type) {
    case 'info':
      return React.createElement(InfoCircleOutlined, { style: { color: '#1890ff' } })
    case 'success':
      return React.createElement(CheckCircleOutlined, { style: { color: '#52c41a' } })
    case 'warning':
      return React.createElement(ExclamationCircleOutlined, { style: { color: '#faad14' } })
    case 'error':
      return React.createElement(CloseCircleOutlined, { style: { color: '#ff4d4f' } })
    default:
      return React.createElement(InfoCircleOutlined, { style: { color: '#1890ff' } })
  }
}

/**
 * Common validation utilities
 */
export const validators = {
  /**
   * Validate required field
   */
  required: (value: any, message: string = 'Trường này là bắt buộc'): string | null => {
    if (value === undefined || value === null || value === '' || (typeof value === 'string' && !value.trim())) {
      return message
    }
    return null
  },

  /**
   * Validate minimum length
   */
  minLength: (value: string, min: number, message?: string): string | null => {
    if (value && value.length < min) {
      return message || `Phải có ít nhất ${min} ký tự`
    }
    return null
  },

  /**
   * Validate maximum length
   */
  maxLength: (value: string, max: number, message?: string): string | null => {
    if (value && value.length > max) {
      return message || `Không được vượt quá ${max} ký tự`
    }
    return null
  },

  /**
   * Validate email format
   */
  email: (value: string, message: string = 'Email không hợp lệ'): string | null => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (value && !emailRegex.test(value)) {
      return message
    }
    return null
  }
}

/**
 * Validate value with multiple validators
 */
export const validate = (value: any, validationRules: Array<(value: any) => string | null>): string | null => {
  for (const rule of validationRules) {
    const error = rule(value)
    if (error) {
      return error
    }
  }
  return null
}

/**
 * Create base modal configuration
 */
export const createModalConfig = (config: IBaseModalConfig) => {
  return {
    title: config.title,
    icon: config.icon,
    content: config.content,
    okText: config.okText || 'OK',
    cancelText: config.cancelText || 'Hủy',
    onOk: config.onOk ? createAsyncHandler(config.onOk, 'Modal') : undefined,
    onCancel: config.onCancel,
    okButtonProps: { loading: config.loading },
    width: config.width
  }
}

/**
 * Show info modal with common configuration
 */
export const showInfoModal = (config: IBaseModalConfig) => {
  Modal.info(createModalConfig({
    ...config,
    okText: config.okText || 'OK'
  }))
}

/**
 * Show confirm modal with common configuration
 */
export const showConfirmModal = (config: IBaseModalConfig) => {
  Modal.confirm(createModalConfig({
    ...config,
    okText: config.okText || 'Xác nhận',
    icon: config.icon || React.createElement(ExclamationCircleOutlined)
  }))
}

/**
 * Show error modal for validation errors
 */
export const showValidationError = (message: string, title: string = 'Lỗi nhập liệu') => {
  Modal.error({
    title,
    content: message
  })
}

/**
 * Default modal texts in Vietnamese
 */
export const defaultTexts = {
  ok: 'OK',
  confirm: 'Xác nhận',
  cancel: 'Hủy',
  close: 'Đóng',
  required: 'Trường này là bắt buộc',
  validationError: 'Lỗi nhập liệu',
  formValidationError: 'Vui lòng kiểm tra thông tin nhập vào'
} 