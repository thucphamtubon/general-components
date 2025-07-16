import React from 'react';

// Base input props cho tất cả table input components
export interface IBaseTableInputProps {
  // Core props
  value?: any;
  onChange?: (value: any) => void;
  onBlur?: (event: React.FocusEvent) => void;
  onFocus?: (event: React.FocusEvent) => void;
  onKeyDown?: (event: React.KeyboardEvent) => void;

  // HTML attributes
  id?: string;
  name?: string;
  className?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
  readOnly?: boolean;
  tabIndex?: number;
  placeholder?: string;

  // Accessibility
  'aria-label'?: string;
  'aria-describedby'?: string;
  'data-testid'?: string;

  // Table specific
  row?: any;
  index?: number;
  field?: string;
}

// Text input specific props
export interface ITableInputTextProps extends IBaseTableInputProps {
  type?: 'text' | 'email' | 'url' | 'tel';
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  autoComplete?: string;
  spellCheck?: boolean;
}

// Number input specific props
export interface ITableInputNumberProps extends IBaseTableInputProps {
  min?: number;
  max?: number;
  step?: number;
  precision?: number;
  allowMath?: boolean;
  formatter?: (value: number | string) => string;
  parser?: (value: string) => number;
}

// Select input specific props
export interface ISelectOption {
  label: string;
  value: any;
  disabled?: boolean;
  group?: string;
}

export interface ITableInputSelectProps extends IBaseTableInputProps {
  options: ISelectOption[];
  multiple?: boolean;
  searchable?: boolean;
  clearable?: boolean;
  placeholder?: string;
}

// Date input specific props
export interface ITableInputDateProps extends IBaseTableInputProps {
  format?: string;
  showTime?: boolean;
  timeFormat?: string;
  min?: string;
  max?: string;
  minDate?: string;
  maxDate?: string;
}

// Textarea specific props
export interface ITableInputTextAreaProps extends IBaseTableInputProps {
  rows?: number;
  cols?: number;
  minLength?: number;
  maxLength?: number;
  resize?: 'none' | 'both' | 'horizontal' | 'vertical';
  autoResize?: boolean;
}

// Switch/Checkbox specific props
export interface ITableInputSwitchProps extends IBaseTableInputProps {
  checked?: boolean;
  checkedValue?: any;
  uncheckedValue?: any;
  size?: 'small' | 'medium' | 'large';
  checkedChildren?: React.ReactNode;
  unCheckedChildren?: React.ReactNode;
  loading?: boolean;
}

// Input validation
export interface IValidationRule {
  required?: boolean;
  pattern?: RegExp;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  validator?: (value: any) => boolean | string;
  message?: string;
}

export interface IValidationResult {
  isValid: boolean;
  message?: string;
}

// Input state
export interface IInputState {
  value: any;
  displayValue: string;
  isValid: boolean;
  errorMessage?: string;
  isFocused: boolean;
  isDirty: boolean;
}

// Hook options
export interface IUseTableInputOptions {
  initialValue?: any;
  validation?: IValidationRule;
  formatter?: (value: any) => string;
  parser?: (value: string) => any;
  onChange?: (value: any) => void;
  onValidation?: (result: IValidationResult) => void;
  debounceMs?: number;
}

// Common input sizes
export type InputSize = 'small' | 'medium' | 'large';

// Input themes
export type InputTheme = 'default' | 'minimal' | 'bordered';

// Export utility types
export type Noop = () => void;
export type InputChangeHandler = (value: any) => void;
export type InputEventHandler = (event: React.FormEvent) => void;