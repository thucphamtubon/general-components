import React from 'react'
import * as math from 'mathjs'

// Hook for managing input value state
export interface IUseInputValueOptions {
  initialValue?: any
  onValueChange?: (value: any) => void
  allowMath?: boolean
  parser?: (value: string) => any
  formatter?: (value: any) => any
}

export interface IUseInputValueReturn {
  value: any
  setValue: (value: any) => void
  displayValue: string
  setDisplayValue: (value: string) => void
  handleChange: (newValue: any) => void
  handleBlur: (event: React.FocusEvent) => void
  reset: () => void
}

export const useInputValue = (options: IUseInputValueOptions = {}): IUseInputValueReturn => {
  const {
    initialValue,
    onValueChange,
    allowMath = false,
    parser,
    formatter
  } = options

  const [value, setValue] = React.useState<any>(initialValue)
  const [displayValue, setDisplayValue] = React.useState<string>(
    formatter ? formatter(initialValue) : String(initialValue || '')
  )

  // Update value when initialValue changes
  React.useEffect(() => {
    setValue(initialValue)
    setDisplayValue(formatter ? formatter(initialValue) : String(initialValue || ''))
  }, [initialValue, formatter])

  const handleChange = React.useCallback((newValue: any) => {
    setValue(newValue)
    setDisplayValue(formatter ? formatter(newValue) : String(newValue || ''))
    onValueChange?.(newValue)
  }, [onValueChange, formatter])

  const handleBlur = React.useCallback((event: React.FocusEvent) => {
    try {
      const inputValue = (event.target as HTMLInputElement).value
      let parsedValue = inputValue

      if (parser) {
        parsedValue = parser(inputValue)
      } else if (allowMath && inputValue) {
        // Try to evaluate math expression
        try {
          const evaluated = math.evaluate(inputValue)
          if (evaluated !== undefined && !isNaN(evaluated)) {
            parsedValue = evaluated
          }
        } catch {
          // If math evaluation fails, keep original value
        }
      }

      handleChange(parsedValue)
    } catch (error) {
      console.error('Error parsing input value:', error)
    }
  }, [allowMath, parser, handleChange])

  const reset = React.useCallback(() => {
    setValue(initialValue)
    setDisplayValue(formatter ? formatter(initialValue) : String(initialValue || ''))
  }, [initialValue, formatter])

  return {
    value,
    setValue,
    displayValue,
    setDisplayValue,
    handleChange,
    handleBlur,
    reset
  }
}

// Hook for table input management
export interface IUseTableInputOptions {
  cell: any
  row: any
  index: any
  onInputed?: (value: any, row: any, index: any, event?: any) => void
  allowMath?: boolean
  parser?: (value: string) => any
  formatter?: (value: any) => any
}

export interface IUseTableInputReturn extends IUseInputValueReturn {
  handleTableBlur: (event: React.FocusEvent) => void
  handleTableChange: (newValue: any, event?: any) => void
}

export const useTableInput = (options: IUseTableInputOptions): IUseTableInputReturn => {
  const { cell, row, index, onInputed, ...inputOptions } = options

  const inputValue = useInputValue({
    ...inputOptions,
    initialValue: cell
  })

  const handleTableBlur = React.useCallback((event: React.FocusEvent) => {
    inputValue.handleBlur(event)
    onInputed?.(inputValue.value, row, index, event)
  }, [inputValue, onInputed, row, index])

  const handleTableChange = React.useCallback((newValue: any, event?: any) => {
    inputValue.handleChange(newValue)
    onInputed?.(newValue, row, index, event)
  }, [inputValue, onInputed, row, index])

  return {
    ...inputValue,
    handleTableBlur,
    handleTableChange
  }
}

// Hook for input validation
export interface IUseInputValidationOptions {
  value: any
  required?: boolean
  pattern?: RegExp
  validator?: (value: any) => boolean | string
  errorMessage?: string
}

export interface IUseInputValidationReturn {
  isValid: boolean
  errorMessage: string | null
  validate: () => boolean
}

export const useInputValidation = (options: IUseInputValidationOptions): IUseInputValidationReturn => {
  const { value, required, pattern, validator, errorMessage } = options
  const [isValid, setIsValid] = React.useState(true)
  const [currentErrorMessage, setCurrentErrorMessage] = React.useState<string | null>(null)

  const validate = React.useCallback(() => {
    // Required validation
    if (required && (value === undefined || value === null || value === '')) {
      setIsValid(false)
      setCurrentErrorMessage(errorMessage || 'This field is required')
      return false
    }

    // Pattern validation
    if (pattern && value && !pattern.test(String(value))) {
      setIsValid(false)
      setCurrentErrorMessage(errorMessage || 'Invalid format')
      return false
    }

    // Custom validator
    if (validator && value !== undefined && value !== null && value !== '') {
      const result = validator(value)
      if (result === false) {
        setIsValid(false)
        setCurrentErrorMessage(errorMessage || 'Invalid value')
        return false
      }
      if (typeof result === 'string') {
        setIsValid(false)
        setCurrentErrorMessage(result)
        return false
      }
    }

    setIsValid(true)
    setCurrentErrorMessage(null)
    return true
  }, [value, required, pattern, validator, errorMessage])

  // Validate when value changes
  React.useEffect(() => {
    validate()
  }, [validate])

  return {
    isValid,
    errorMessage: currentErrorMessage,
    validate
  }
}
