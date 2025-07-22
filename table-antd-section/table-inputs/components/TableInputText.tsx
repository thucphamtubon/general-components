import React, { forwardRef } from 'react';
import { useTableInput, useInputFocus } from '../shared/hooks';
import { ITableInputTextProps } from '../shared/types';
import { mergeClassNames } from '../shared/utils';
import '../styles/table-inputs.css';

export const TableInputText = forwardRef<HTMLInputElement, ITableInputTextProps>(
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
      type = 'text',
      maxLength,
      minLength,
      pattern,
      autoComplete,
      spellCheck,
      'aria-label': ariaLabel,
      'aria-describedby': ariaDescribedBy,
      'data-testid': dataTestId,
      row,
      index,
      field,
      ...htmlProps
    } = props;

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
      debounceMs: 300 // Debounce for better performance
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
      handleChange(event.target.value);
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
      handleKeyDown(event);
      onKeyDown?.(event);
    };

    const computedClassName = mergeClassNames(
      'table-input',
      'table-input-text',
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
          type={type}
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
          maxLength={maxLength}
          minLength={minLength}
          pattern={pattern}
          autoComplete={autoComplete}
          spellCheck={spellCheck}
          aria-label={ariaLabel}
          aria-describedby={ariaDescribedBy}
          aria-invalid={!isValid}
          data-testid={dataTestId || 'table-input-text'}
          data-row={row ? JSON.stringify(row) : undefined}
          data-index={index}
          data-field={field}
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

TableInputText.displayName = 'TableInputText';

export default TableInputText;