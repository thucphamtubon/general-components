import React from 'react'

/**
 * Base modal props shared by all modal components
 */
export interface IBaseModalProps {
  /** Modal title text */
  title: string
  /** Text for the confirm button (default varies by modal type) */
  okText?: string
  /** Text for the cancel button (default: 'Hủy') */
  cancelText?: string
  /** Icon to display in the modal */
  icon?: React.ReactNode
  /** Function to execute when user clicks confirm */
  onOk?: (...args: any[]) => Promise<void> | void
  /** Function to execute when user clicks cancel or closes modal */
  onCancel?: () => void
  /** Whether the modal is visible */
  visible?: boolean
  /** Whether to show loading state on confirm button */
  loading?: boolean
}

/**
 * Props for modals that display content
 */
export interface IContentModalProps extends IBaseModalProps {
  /** Modal content - can be string or React node */
  content?: React.ReactNode
}

/**
 * Props for modals with width customization
 */
export interface IWidthModalProps extends IBaseModalProps {
  /** Modal width (default varies by modal type) */
  width?: number
}

/**
 * Props for modals with validation
 */
export interface IValidatableModalProps extends IBaseModalProps {
  /** Whether input/selection is required */
  required?: boolean
  /** Custom validation function */
  validator?: (value: any) => string | null
}

/**
 * Alert modal types
 */
export type AlertType = 'info' | 'success' | 'warning' | 'error'

/**
 * Select option interface
 */
export interface ISelectOption {
  value: string | number
  label: string
  disabled?: boolean
}

/**
 * Modal component interface with static show method
 */
export interface IModalComponent<T> extends React.FC<T> {
  show: (props: Omit<T, 'visible'>) => void
}

/**
 * Base modal configuration for static methods
 */
export interface IBaseModalConfig {
  title: string
  icon?: React.ReactNode
  content?: React.ReactNode
  okText?: string
  cancelText?: string
  onOk?: (...args: any[]) => Promise<void> | void
  onCancel?: () => void
  loading?: boolean
  width?: number
} 