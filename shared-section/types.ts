import React from 'react'

// Base Input Props
export interface IBaseInputProps {
  id?: string
  tabIndex?: number
  placeholder?: string
  disabled?: boolean
  size?: 'small' | 'middle' | 'large'
  style?: React.CSSProperties
  className?: string
  'data-testid'?: string
}

// Table Input Props (for table cells)
export interface ITableInputProps extends IBaseInputProps {
  cell: any
  row: any
  index: any
  onInputed?: (value: any, row: any, index: any, event?: any) => void
  onPressEnter?: () => void
}

// Number Input Specific Props
export interface INumberInputProps extends ITableInputProps {
  min?: number
  max?: number
  step?: number
  precision?: number
  formatter?: (value: number | string | undefined) => string
  parser?: (displayValue: string | undefined) => number | string
  allowMath?: boolean // Enable math expression evaluation
}

// Text Input Specific Props
export interface ITextInputProps extends ITableInputProps {
  maxLength?: number
  showCount?: boolean
  allowClear?: boolean
}

// Select Input Specific Props
export interface ISelectOption {
  label: string
  value: any
  disabled?: boolean
}

export interface ISelectInputProps extends ITableInputProps {
  options: ISelectOption[]
  mode?: 'multiple' | 'tags'
  allowClear?: boolean
  showSearch?: boolean
  filterOption?: boolean | ((input: string, option?: ISelectOption) => boolean)
}

// Date Input Specific Props
export interface IDateInputProps extends ITableInputProps {
  format?: string
  showTime?: boolean
  allowClear?: boolean
}

// TextArea Input Specific Props
export interface ITextAreaInputProps extends ITableInputProps {
  rows?: number
  maxLength?: number
  showCount?: boolean
  autoSize?: boolean | { minRows?: number; maxRows?: number }
}

// Switch Input Specific Props
export interface ISwitchInputProps extends ITableInputProps {
  checkedChildren?: React.ReactNode
  unCheckedChildren?: React.ReactNode
}

// Input Component Type
export type IInputComponent<T = any> = React.ComponentType<T>

// Common Input Events
export interface IInputEvents {
  onFocus?: (event: React.FocusEvent) => void
  onBlur?: (event: React.FocusEvent) => void
  onChange?: (value: any, event?: any) => void
  onPressEnter?: (event: React.KeyboardEvent) => void
}

// Input Validation
export interface IInputValidation {
  required?: boolean
  pattern?: RegExp
  validator?: (value: any) => boolean | string
  errorMessage?: string
}

// Input Configuration
export interface IInputConfig extends IBaseInputProps, IInputEvents, IInputValidation {
  type: 'number' | 'text' | 'select' | 'date' | 'textarea' | 'switch'
  label?: string
  tooltip?: string
}

// Shared Select Component Props
export interface SelectProps {
  /** Unique identifier (useful for table cells) */
  id?: string;
  /** Select mode: 'multiple' or 'tags' */
  mode?: 'multiple' | 'tags';
  /** Form item label */
  label?: string;
  /** Form item name */
  name?: string;
  /** Ant Design Form rules */
  rules?: any;
  /** Disable the select */
  disabled?: boolean;
  /** Custom inline styles */
  style?: React.CSSProperties;
  /** Auto focus when component mounts */
  autoFocus?: boolean;
  /** Placeholder text */
  placeholder?: string;
  /** Flag to filter bếp nấu catering */
  isCatering?: boolean;
  /** Flag to ignore data-permission filter */
  notDataPermissions?: boolean;
  /** Callback when a value is selected */
  onSelected?: (id: any, data?: any) => any;
  /** Additional props forwarded to Form.Item */
  formProps?: any;
}
