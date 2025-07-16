import React, { useCallback, useEffect, useRef, useState } from 'react';
import { IInputState, IUseTableInputOptions, IValidationResult, IValidationRule } from './types';
import { parseValue, validateInput } from './utils';

// Hook chính cho table input management
export interface IUseTableInputReturn {
  value: any;
  displayValue: string;
  isValid: boolean;
  errorMessage?: string;
  isFocused: boolean;
  isDirty: boolean;

  // Handlers
  handleChange: (newValue: any) => void;
  handleBlur: (event: React.FocusEvent) => void;
  handleFocus: (event: React.FocusEvent) => void;
  handleKeyDown: (event: React.KeyboardEvent) => void;

  // Utilities
  reset: () => void;
  validate: () => boolean;
  setValue: (value: any) => void;
  setError: (message: string) => void;
  clearError: () => void;
}

export const useTableInput = (options: IUseTableInputOptions = {}): IUseTableInputReturn => {
  const {
    initialValue,
    validation,
    formatter,
    parser,
    onChange,
    onValidation,
    debounceMs = 0
  } = options;

  // State
  const [state, setState] = useState<IInputState>({
    value: initialValue,
    displayValue: formatter ? formatter(initialValue) : String(initialValue || ''),
    isValid: true,
    isFocused: false,
    isDirty: false
  });

  // Refs
  const debounceRef = useRef<NodeJS.Timeout>();
  const initialValueRef = useRef(initialValue);

  // Update when initialValue changes
  useEffect(() => {
    if (initialValue !== initialValueRef.current) {
      initialValueRef.current = initialValue;
      setState(prev => ({
        ...prev,
        value: initialValue,
        displayValue: formatter ? formatter(initialValue) : String(initialValue || ''),
        isDirty: false
      }));
    }
  }, [initialValue, formatter]);

  // Validation function
  const validateValue = useCallback((value: any): IValidationResult => {
    if (!validation) return { isValid: true };
    return validateInput(value, validation);
  }, [validation]);

  // Debounced onChange
  const debouncedOnChange = useCallback((value: any) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (debounceMs > 0) {
      debounceRef.current = setTimeout(() => {
        onChange?.(value);
      }, debounceMs);
    } else {
      onChange?.(value);
    }
  }, [onChange, debounceMs]);

  // Handlers
  const handleChange = useCallback((newValue: any) => {
    const validationResult = validateValue(newValue);

    setState(prev => ({
      ...prev,
      value: newValue,
      displayValue: formatter ? formatter(newValue) : String(newValue || ''),
      isValid: validationResult.isValid,
      errorMessage: validationResult.message,
      isDirty: true
    }));

    onValidation?.(validationResult);
    debouncedOnChange(newValue);
  }, [validateValue, formatter, onValidation, debouncedOnChange]);

  const handleBlur = useCallback((event: React.FocusEvent) => {
    setState(prev => ({ ...prev, isFocused: false }));

    // Parse value on blur if parser is provided
    if (parser) {
      const inputValue = (event.target as HTMLInputElement).value;
      const parsedValue = parseValue(inputValue, parser);
      if (parsedValue !== state.value) {
        handleChange(parsedValue);
      }
    }
  }, [parser, state.value, handleChange]);

  const handleFocus = useCallback((event: React.FocusEvent) => {
    setState(prev => ({ ...prev, isFocused: true }));
  }, []);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    // Handle Enter key
    if (event.key === 'Enter') {
      event.preventDefault();
      (event.target as HTMLElement).blur();
    }

    // Handle Escape key
    if (event.key === 'Escape') {
      event.preventDefault();
      reset();
      (event.target as HTMLElement).blur();
    }
  }, []);

  // Utilities
  const reset = useCallback(() => {
    setState({
      value: initialValueRef.current,
      displayValue: formatter ? formatter(initialValueRef.current) : String(initialValueRef.current || ''),
      isValid: true,
      errorMessage: undefined,
      isFocused: false,
      isDirty: false
    });
  }, [formatter]);

  const validate = useCallback(() => {
    const validationResult = validateValue(state.value);
    setState(prev => ({
      ...prev,
      isValid: validationResult.isValid,
      errorMessage: validationResult.message
    }));
    return validationResult.isValid;
  }, [validateValue, state.value]);

  const setValue = useCallback((value: any) => {
    handleChange(value);
  }, [handleChange]);

  const setError = useCallback((message: string) => {
    setState(prev => ({
      ...prev,
      isValid: false,
      errorMessage: message
    }));
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({
      ...prev,
      isValid: true,
      errorMessage: undefined
    }));
  }, []);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return {
    value: state.value,
    displayValue: state.displayValue,
    isValid: state.isValid,
    errorMessage: state.errorMessage,
    isFocused: state.isFocused,
    isDirty: state.isDirty,

    handleChange,
    handleBlur,
    handleFocus,
    handleKeyDown,

    reset,
    validate,
    setValue,
    setError,
    clearError
  };
};

// Hook for debounced input
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Hook for input focus management
export const useInputFocus = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  const focus = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  const blur = useCallback(() => {
    inputRef.current?.blur();
  }, []);

  const select = useCallback(() => {
    inputRef.current?.select();
  }, []);

  return {
    inputRef,
    focus,
    blur,
    select
  };
};

// Hook for input validation
export const useInputValidation = (value: any, rules: IValidationRule[]) => {
  const [errors, setErrors] = useState<string[]>([]);
  const [isValid, setIsValid] = useState(true);

  const validate = useCallback(() => {
    const newErrors: string[] = [];

    rules.forEach(rule => {
      const result = validateInput(value, rule);
      if (!result.isValid && result.message) {
        newErrors.push(result.message);
      }
    });

    setErrors(newErrors);
    setIsValid(newErrors.length === 0);
    return newErrors.length === 0;
  }, [value, rules]);

  useEffect(() => {
    validate();
  }, [validate]);

  return {
    errors,
    isValid,
    validate
  };
};