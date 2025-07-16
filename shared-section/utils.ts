import * as math from 'mathjs'
import { ISelectOption, IInputConfig } from './types'

// Math expression evaluation utility
export const evaluateMathExpression = (expression: string): number | string => {
  try {
    if (!expression || expression.trim() === '') {
      return ''
    }
    
    const result = math.evaluate(expression)
    if (result === undefined || isNaN(result)) {
      return expression
    }
    
    return result
  } catch (error) {
    console.error('Error evaluating math expression:', error)
    return expression
  }
}

// Number formatting utilities
export const formatNumber = (value: number | string | undefined, precision?: number): string => {
  if (value === undefined || value === null || value === '') {
    return ''
  }
  
  const num = typeof value === 'string' ? parseFloat(value) : value
  if (isNaN(num)) {
    return String(value)
  }
  
  if (precision !== undefined) {
    return num.toFixed(precision)
  }
  
  return String(num)
}

export const parseNumber = (value: string | undefined): number | string => {
  if (!value || value.trim() === '') {
    return ''
  }
  
  const num = parseFloat(value)
  if (isNaN(num)) {
    return value
  }
  
  return num
}

// Text utilities
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) {
    return text
  }
  return text.substring(0, maxLength) + '...'
}

export const removeExtraSpaces = (text: string): string => {
  return text.replace(/\s+/g, ' ').trim()
}

// Select option utilities
export const createSelectOption = (label: string, value: any, disabled = false): ISelectOption => ({
  label,
  value,
  disabled
})

export const createSelectOptionsFromArray = (items: any[], labelKey = 'label', valueKey = 'value'): ISelectOption[] => {
  return items.map(item => {
    if (typeof item === 'string' || typeof item === 'number') {
      return createSelectOption(String(item), item)
    }
    
    return createSelectOption(
      item[labelKey] || String(item),
      item[valueKey] !== undefined ? item[valueKey] : item
    )
  })
}

export const filterSelectOptions = (options: ISelectOption[], searchText: string): ISelectOption[] => {
  if (!searchText) {
    return options
  }
  
  const lowerSearchText = searchText.toLowerCase()
  return options.filter(option => 
    option.label.toLowerCase().includes(lowerSearchText) ||
    String(option.value).toLowerCase().includes(lowerSearchText)
  )
}

// Date utilities
export const formatDate = (date: Date | string | undefined, format = 'DD/MM/YYYY'): string => {
  if (!date) {
    return ''
  }
  
  const dateObj = typeof date === 'string' ? new Date(date) : date
  if (isNaN(dateObj.getTime())) {
    return ''
  }
  
  // Simple date formatting (you might want to use a library like dayjs for more complex formatting)
  const day = String(dateObj.getDate()).padStart(2, '0')
  const month = String(dateObj.getMonth() + 1).padStart(2, '0')
  const year = dateObj.getFullYear()
  
  return format
    .replace('DD', day)
    .replace('MM', month)
    .replace('YYYY', String(year))
}

export const parseDate = (dateString: string): Date | null => {
  if (!dateString) {
    return null
  }
  
  const date = new Date(dateString)
  if (isNaN(date.getTime())) {
    return null
  }
  
  return date
}

// Validation utilities
export const validators = {
  required: (value: any): boolean => {
    return value !== undefined && value !== null && value !== ''
  },
  
  email: (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(value)
  },
  
  phone: (value: string): boolean => {
    const phoneRegex = /^[0-9+\-\s()]+$/
    return phoneRegex.test(value) && value.replace(/[^0-9]/g, '').length >= 10
  },
  
  number: (value: any): boolean => {
    return !isNaN(Number(value))
  },
  
  positiveNumber: (value: any): boolean => {
    const num = Number(value)
    return !isNaN(num) && num > 0
  },
  
  minLength: (minLength: number) => (value: string): boolean => {
    return typeof value === 'string' && value.length >= minLength
  },
  
  maxLength: (maxLength: number) => (value: string): boolean => {
    return !value || value.length <= maxLength
  },
  
  range: (min: number, max: number) => (value: any): boolean => {
    const num = Number(value)
    return !isNaN(num) && num >= min && num <= max
  }
}

// Input configuration utilities
export const createInputConfig = (config: Partial<IInputConfig>): IInputConfig => {
  return {
    type: 'text',
    size: 'small',
    ...config
  }
}

export const mergeInputProps = <T extends Record<string, any>>(
  defaultProps: T,
  userProps: Partial<T>
): T => {
  return {
    ...defaultProps,
    ...userProps,
    style: {
      ...defaultProps.style,
      ...userProps.style
    } as any
  }
}

// Error handling utilities
export const handleInputError = (error: any, context?: string): void => {
  const errorMessage = error instanceof Error ? error.message : String(error)
  const fullMessage = context ? `${context}: ${errorMessage}` : errorMessage
  
  console.error('Input Error:', fullMessage)
  
  // You can extend this to send errors to a logging service
  // logErrorToService(fullMessage)
}

// Common input styles
export const inputStyles = {
  fullWidth: {
    width: '100%'
  },
  
  rightAlign: {
    textAlign: 'right' as const
  },
  
  centerAlign: {
    textAlign: 'center' as const
  },
  
  tableInput: {
    width: '100%',
    textAlign: 'right' as const
  },
  
  compactInput: {
    padding: '4px 8px'
  }
}

// Default configurations
export const defaultInputConfigs = {
  number: {
    type: 'number' as const,
    size: 'small' as const,
    style: inputStyles.tableInput,
    step: 1,
    allowMath: true
  },
  
  text: {
    type: 'text' as const,
    size: 'small' as const,
    style: inputStyles.fullWidth,
    allowClear: true
  },
  
  select: {
    type: 'select' as const,
    size: 'small' as const,
    style: inputStyles.fullWidth,
    allowClear: true,
    showSearch: true
  },
  
  date: {
    type: 'date' as const,
    size: 'small' as const,
    style: inputStyles.fullWidth,
    format: 'DD/MM/YYYY',
    allowClear: true
  },
  
  textarea: {
    type: 'textarea' as const,
    size: 'small' as const,
    style: inputStyles.fullWidth,
    rows: 3,
    showCount: true
  },
  
  switch: {
    type: 'switch' as const,
    size: 'small' as const
  }
}
