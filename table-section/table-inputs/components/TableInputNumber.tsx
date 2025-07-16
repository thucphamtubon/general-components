import React, { forwardRef, useCallback } from 'react';
import { useTableInput, useInputFocus } from '../shared/hooks';
import { ITableInputNumberProps } from '../shared/types';
import { mergeClassNames, formatNumber, parseNumber, evaluateMathExpression } from '../shared/utils';
import '../styles/table-inputs.css';

export const TableInputNumber = forwardRef<HTMLInputElement, ITableInputNumberProps>(
  (props, ref) => {
    const {
      value: initialValue,
      onChange,
      onBlur,
      onFocus,
      onKeyDown,
      className,
      style,
      disabled,
      readOnly,
      placeholder,
      min,
      max,
      step,
      precision,
      allowMath = false,
      formatter,
      parser,
      'aria-label': ariaLabel,
      'aria-describedby': ariaDescribedBy,
      'data-testid': dataTestId,
      row,
      index,
      field,
      ...htmlProps
    } = props;

    // Custom formatter and parser for numbers
    const numberFormatter = useCallback((value: any) => {
      if (value === null || value === undefined || value === '') return '';
      
      if (formatter) {
        return formatter(value);
      }
      
      const num = typeof value === 'string' ? parseFloat(value) : value;
      if (isNaN(num)) return String(value);
      
      return formatNumber(num, { precision });
    }, [formatter, precision]);

    const numberParser = useCallback((value: string) => {
      if (!value) return null;
      
      if (parser) {
        return parser(value);
      }
      
      // Handle math expressions if allowed
      if (allowMath && (value.includes('+') || value.includes('-') || value.includes('*') || value.includes('/'))) {
        const result = evaluateMathExpression(value);
        if (typeof result === 'number') {
          return result;
        }
      }
      
      const num = parseNumber(value);
      
      // Apply min/max constraints
      if (min !== undefined && num < min) return min;
      if (max !== undefined && num > max) return max;
      
      return num;
    }, [parser, allowMath, min, max]);

    const {
      displayValue,
      isValid,
      errorMessage,
      isFocused,
      handleChange,
      handleBlur,
      handleFocus,
      handleKeyDown
    } = useTableInput({
      initialValue,
      onChange,
      formatter: numberFormatter,
      parser: numberParser,
      debounceMs: 300
    });

    const { inputRef } = useInputFocus();

    // Merge refs
    const mergedRef = (node: HTMLInputElement) => {
      if (inputRef) {
        (inputRef as React.MutableRefObject<HTMLInputElement>).current = node;
      }
      if (ref) {
        if (typeof ref === 'function') {
          ref(node);
        } else {
          ref.current = node;
        }
      }
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      
      // Allow empty value
      if (value === '') {
        handleChange(null);
        return;
      }
      
      // For math expressions, allow the raw input
      if (allowMath && (value.includes('+') || value.includes('-') || value.includes('*') || value.includes('/'))) {
        handleChange(value);
        return;
      }
      
      // For regular numbers, validate as we type
      const num = parseFloat(value);
      if (!isNaN(num)) {
        handleChange(num);
      } else {
        // Allow partial input like "1." or "-"
        handleChange(value);
      }
    };

    const handleInputBlur = (event: React.FocusEvent<HTMLInputElement>) => {
      handleBlur(event);
      onBlur?.(event);
    };

    const handleInputFocus = (event: React.FocusEvent<HTMLInputElement>) => {
      handleFocus(event);
      onFocus?.(event);
    };

    const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      // Handle arrow keys for increment/decrement
      if (event.key === 'ArrowUp' && step) {
        event.preventDefault();
        const currentValue = typeof displayValue === 'string' ? parseFloat(displayValue) || 0 : displayValue || 0;
        const newValue = currentValue + step;
        if (max === undefined || newValue <= max) {
          handleChange(newValue);
        }
      } else if (event.key === 'ArrowDown' && step) {
        event.preventDefault();
        const currentValue = typeof displayValue === 'string' ? parseFloat(displayValue) || 0 : displayValue || 0;
        const newValue = currentValue - step;
        if (min === undefined || newValue >= min) {
          handleChange(newValue);
        }
      }
      
      handleKeyDown(event);
      onKeyDown?.(event);
    };

    const computedClassName = mergeClassNames(
      'table-input',
      'table-input-number',
      !isValid && 'error',
      isFocused && 'focused',
      disabled && 'disabled',
      className
    );

    return (
      <>
        <input
          {...htmlProps}
          ref={mergedRef}
          type="text" // Use text to allow math expressions
          inputMode="decimal"
          value={displayValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onFocus={handleInputFocus}
          onKeyDown={handleInputKeyDown}
          className={computedClassName}
          style={style}
          disabled={disabled}
          readOnly={readOnly}
          placeholder={placeholder}
          min={min}
          max={max}
          step={step}
          aria-label={ariaLabel}
          aria-describedby={ariaDescribedBy}
          aria-invalid={!isValid}
          data-testid={dataTestId || 'table-input-number'}
          data-row={row ? JSON.stringify(row) : undefined}
          data-index={index}
          data-field={field}
          data-allow-math={allowMath}
        />
        {errorMessage && (
          <div className="table-input-error-message" role="alert">
            {errorMessage}
          </div>
        )}
      </>
    );
  }
);

TableInputNumber.displayName = 'TableInputNumber';

export default TableInputNumber;