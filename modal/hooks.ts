import { useState, useCallback } from 'react'
import { handleModalError, validate, showValidationError } from './utils'

/**
 * Hook for managing modal state and validation
 */
export interface IUseModalStateOptions {
  /** Initial value */
  defaultValue?: any
  /** Validation rules */
  validationRules?: Array<(value: any) => string | null>
  /** Whether field is required */
  required?: boolean
  /** Custom validation function */
  customValidator?: (value: any) => string | null
  /** Context for error logging */
  errorContext?: string
}

/**
 * Hook return type
 */
export interface IUseModalStateReturn<T = any> {
  /** Current value */
  value: T
  /** Set value */
  setValue: (value: T) => void
  /** Current error message */
  error: string | null
  /** Set error message */
  setError: (error: string | null) => void
  /** Validate current value */
  validateValue: () => string | null
  /** Handle value change with validation */
  handleChange: (value: T) => void
  /** Reset to default value */
  reset: () => void
  /** Create async handler with validation */
  createValidatedHandler: (callback: (value: T) => Promise<void> | void) => () => Promise<void>
}

/**
 * Hook for managing modal value state with validation
 */
export const useModalState = <T = any>(options: IUseModalStateOptions = {}): IUseModalStateReturn<T> => {
  const {
    defaultValue,
    validationRules = [],
    required = false,
    customValidator,
    errorContext = 'Modal'
  } = options

  const [value, setValue] = useState<T>(defaultValue)
  const [error, setError] = useState<string | null>(null)

  /**
   * Validate current value
   */
  const validateValue = useCallback((): string | null => {
    const rules = [...validationRules]
    
    // Add required validation if needed
    if (required) {
      rules.unshift((val) => {
        if (val === undefined || val === null || val === '' || (typeof val === 'string' && !val.trim())) {
          return 'Trường này là bắt buộc'
        }
        return null
      })
    }

    // Add custom validator if provided
    if (customValidator) {
      rules.push(customValidator)
    }

    return validate(value, rules)
  }, [value, validationRules, required, customValidator])

  /**
   * Handle value change with error clearing
   */
  const handleChange = useCallback((newValue: T) => {
    setValue(newValue)
    if (error) {
      setError(null)
    }
  }, [error])

  /**
   * Reset to default value
   */
  const reset = useCallback(() => {
    setValue(defaultValue)
    setError(null)
  }, [defaultValue])

  /**
   * Create validated async handler
   */
  const createValidatedHandler = useCallback((callback: (value: T) => Promise<void> | void) => {
    return async () => {
      const validationError = validateValue()
      if (validationError) {
        setError(validationError)
        return
      }

      try {
        await callback(value)
        setError(null)
      } catch (error) {
        handleModalError(error, errorContext)
      }
    }
  }, [value, validateValue, errorContext])

  return {
    value,
    setValue,
    error,
    setError,
    validateValue,
    handleChange,
    reset,
    createValidatedHandler
  }
}

/**
 * Hook for managing multiple modal values
 */
export interface IUseMultiModalStateReturn {
  /** Get value by key */
  getValue: (key: string) => any
  /** Set value by key */
  setValue: (key: string, value: any) => void
  /** Get error by key */
  getError: (key: string) => string | null
  /** Set error by key */
  setError: (key: string, error: string | null) => void
  /** Validate specific field */
  validateField: (key: string) => string | null
  /** Validate all fields */
  validateAll: () => Record<string, string | null>
  /** Check if all fields are valid */
  isValid: () => boolean
  /** Reset all fields */
  resetAll: () => void
  /** Create validated handler for form submission */
  createFormHandler: (callback: (values: Record<string, any>) => Promise<void> | void) => () => Promise<void>
}

/**
 * Hook for managing multiple modal values (useful for forms)
 */
export const useMultiModalState = (
  fieldsConfig: Record<string, IUseModalStateOptions> = {}
): IUseMultiModalStateReturn => {
  const [values, setValues] = useState<Record<string, any>>(() => {
    const initialValues: Record<string, any> = {}
    Object.keys(fieldsConfig).forEach(key => {
      initialValues[key] = fieldsConfig[key].defaultValue
    })
    return initialValues
  })

  const [errors, setErrors] = useState<Record<string, string | null>>({})

  const getValue = useCallback((key: string) => values[key], [values])

  const setValue = useCallback((key: string, value: any) => {
    setValues(prev => ({ ...prev, [key]: value }))
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: null }))
    }
  }, [errors])

  const getError = useCallback((key: string) => errors[key] || null, [errors])

  const setError = useCallback((key: string, error: string | null) => {
    setErrors(prev => ({ ...prev, [key]: error }))
  }, [])

  const validateField = useCallback((key: string): string | null => {
    const config = fieldsConfig[key]
    if (!config) return null

    const value = values[key]
    const rules = [...(config.validationRules || [])]
    
    if (config.required) {
      rules.unshift((val) => {
        if (val === undefined || val === null || val === '' || (typeof val === 'string' && !val.trim())) {
          return 'Trường này là bắt buộc'
        }
        return null
      })
    }

    if (config.customValidator) {
      rules.push(config.customValidator)
    }

    return validate(value, rules)
  }, [values, fieldsConfig])

  const validateAll = useCallback((): Record<string, string | null> => {
    const validationErrors: Record<string, string | null> = {}
    Object.keys(fieldsConfig).forEach(key => {
      validationErrors[key] = validateField(key)
    })
    setErrors(validationErrors)
    return validationErrors
  }, [fieldsConfig, validateField])

  const isValid = useCallback((): boolean => {
    const validationErrors = validateAll()
    return Object.values(validationErrors).every(error => !error)
  }, [validateAll])

  const resetAll = useCallback(() => {
    const initialValues: Record<string, any> = {}
    Object.keys(fieldsConfig).forEach(key => {
      initialValues[key] = fieldsConfig[key].defaultValue
    })
    setValues(initialValues)
    setErrors({})
  }, [fieldsConfig])

  const createFormHandler = useCallback((callback: (values: Record<string, any>) => Promise<void> | void) => {
    return async () => {
      if (!isValid()) {
        const firstError = Object.values(errors).find(error => error)
        if (firstError) {
          showValidationError(firstError)
        }
        return
      }

      try {
        await callback(values)
      } catch (error) {
        handleModalError(error, 'Form')
      }
    }
  }, [values, errors, isValid])

  return {
    getValue,
    setValue,
    getError,
    setError,
    validateField,
    validateAll,
    isValid,
    resetAll,
    createFormHandler
  }
} 