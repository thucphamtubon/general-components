import * as math from 'mathjs';
import { ISelectOption, IValidationResult, IValidationRule } from './types';

// Validation utilities
export const validateInput = (value: any, rule: IValidationRule): IValidationResult => {
  // Required validation
  if (rule.required && (value === undefined || value === null || value === '')) {
    return {
      isValid: false,
      message: rule.message || 'Trường này là bắt buộc'
    };
  }

  // Skip other validations if value is empty and not required
  if (!rule.required && (value === undefined || value === null || value === '')) {
    return { isValid: true };
  }

  // Pattern validation
  if (rule.pattern && !rule.pattern.test(String(value))) {
    return {
      isValid: false,
      message: rule.message || 'Định dạng không hợp lệ'
    };
  }

  // Min/Max validation for numbers
  if (typeof value === 'number') {
    if (rule.min !== undefined && value < rule.min) {
      return {
        isValid: false,
        message: rule.message || `Giá trị phải >= ${rule.min}`
      };
    }
    if (rule.max !== undefined && value > rule.max) {
      return {
        isValid: false,
        message: rule.message || `Giá trị phải <= ${rule.max}`
      };
    }
  }

  // MinLength/MaxLength validation for strings
  if (typeof value === 'string') {
    if (rule.minLength !== undefined && value.length < rule.minLength) {
      return {
        isValid: false,
        message: rule.message || `Độ dài tối thiểu ${rule.minLength} ký tự`
      };
    }
    if (rule.maxLength !== undefined && value.length > rule.maxLength) {
      return {
        isValid: false,
        message: rule.message || `Độ dài tối đa ${rule.maxLength} ký tự`
      };
    }
  }

  // Custom validator
  if (rule.validator) {
    const result = rule.validator(value);
    if (result === false) {
      return {
        isValid: false,
        message: rule.message || 'Giá trị không hợp lệ'
      };
    }
    if (typeof result === 'string') {
      return {
        isValid: false,
        message: result
      };
    }
  }

  return { isValid: true };
};

// Format value for display
export const formatValue = (value: any, formatter?: (value: any) => string): string => {
  if (formatter) {
    return formatter(value);
  }

  if (value === null || value === undefined) {
    return '';
  }

  return String(value);
};

// Parse value from string
export const parseValue = (value: string, parser?: (value: string) => any): any => {
  if (parser) {
    return parser(value);
  }

  return value;
};

// Math expression evaluation
export const evaluateMathExpression = (expression: string): number | string => {
  // Only allow safe characters: digits, arithmetic operators, parentheses, decimal points and whitespace
  if (!/^[0-9+\-*/().\s]+$/.test(expression)) {
    return expression;
  }

  try {
    const result = math.evaluate(expression);
    if (typeof result === 'number' && !isNaN(result)) {
      return result;
    }
  } catch (_error) {
    // Ignore evaluation errors and fallback to original expression
  }
  return expression;
};

// Number formatting utilities
export const formatNumber = (value: number | string, options: {
  precision?: number;
  thousandSeparator?: string;
  decimalSeparator?: string;
} = {}): string => {
  const {
    precision,
    thousandSeparator = ',',
    decimalSeparator = '.'
  } = options;

  let num = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(num)) return String(value);

  if (precision !== undefined) {
    num = Number(num.toFixed(precision));
  }

  const parts = num.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator);

  return parts.join(decimalSeparator);
};

// Parse formatted number
export const parseNumber = (value: string, options: {
  thousandSeparator?: string;
  decimalSeparator?: string;
} = {}): number => {
  const {
    thousandSeparator = ',',
    decimalSeparator = '.'
  } = options;

  // Remove thousand separators and replace decimal separator
  const cleaned = value
    .replace(new RegExp(`\\${thousandSeparator}`, 'g'), '')
    .replace(decimalSeparator, '.');

  return parseFloat(cleaned) || 0;
};

// Date utilities
export const formatDate = (date: Date | string, format: string = 'DD/MM/YYYY'): string => {
  const d = typeof date === 'string' ? new Date(date) : date;

  if (!(d instanceof Date) || isNaN(d.getTime())) {
    return '';
  }

  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');

  return format
    .replace('DD', day)
    .replace('MM', month)
    .replace('YYYY', String(year))
    .replace('YY', String(year).slice(-2))
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
};

// Parse date from string
export const parseDate = (dateString: string, format: string = 'DD/MM/YYYY'): Date | null => {
  if (!dateString) return null;

  try {
    // Simple parsing for DD/MM/YYYY format
    if (format === 'DD/MM/YYYY') {
      const parts = dateString.split('/');
      if (parts.length === 3) {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
        const year = parseInt(parts[2], 10);
        return new Date(year, month, day);
      }
    }

    // Fallback to native Date parsing
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
  } catch (error) {
    return null;
  }
};

// Select options utilities
export const createSelectOptions = (items: any[], labelKey: string, valueKey: string): ISelectOption[] => {
  return items.map(item => ({
    label: item[labelKey],
    value: item[valueKey],
    disabled: item.disabled || false
  }));
};

export const filterSelectOptions = (options: ISelectOption[], searchText: string): ISelectOption[] => {
  if (!searchText) return options;

  const search = searchText.toLowerCase();
  return options.filter(option =>
    option.label.toLowerCase().includes(search) ||
    String(option.value).toLowerCase().includes(search)
  );
};

// CSS class utilities
export const mergeClassNames = (...classNames: (string | undefined | null | false)[]): string => {
  return classNames.filter(Boolean).join(' ');
};

// Input styles
export const inputStyles = {
  base: {
    width: '100%',
    padding: '4px 8px',
    border: '1px solid #d9d9d9',
    borderRadius: '4px',
    fontSize: '14px',
    lineHeight: '1.5',
    transition: 'border-color 0.2s ease-in-out',
    outline: 'none'
  } as React.CSSProperties,

  focused: {
    borderColor: '#1890ff',
    boxShadow: '0 0 0 2px rgba(24, 144, 255, 0.2)'
  } as React.CSSProperties,

  error: {
    borderColor: '#ff4d4f',
    boxShadow: '0 0 0 2px rgba(255, 77, 79, 0.2)'
  } as React.CSSProperties,

  disabled: {
    backgroundColor: '#f5f5f5',
    color: '#00000040',
    cursor: 'not-allowed'
  } as React.CSSProperties,

  small: {
    padding: '2px 6px',
    fontSize: '12px'
  } as React.CSSProperties,

  large: {
    padding: '6px 12px',
    fontSize: '16px'
  } as React.CSSProperties
};

// Debounce utility
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Throttle utility
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Noop function
export const noop = () => { };