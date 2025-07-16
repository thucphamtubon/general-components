import React, { forwardRef, useRef, useEffect, useCallback } from 'react';
import { useTableInput, useInputFocus } from '../shared/hooks';
import { ITableInputTextAreaProps } from '../shared/types';
import { mergeClassNames } from '../shared/utils';
import '../styles/table-inputs.css';

export const TableInputTextArea = forwardRef<HTMLTextAreaElement, ITableInputTextAreaProps>(
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
      rows = 3,
      cols,
      minLength,
      maxLength,
      resize = 'vertical',
      autoResize = false,
      'aria-label': ariaLabel,
      'aria-describedby': ariaDescribedBy,
      'data-testid': dataTestId,
      row,
      index,
      field,
      ...htmlProps
    } = props;

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const {
      value,
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
      debounceMs: 300
    });

    const { inputRef } = useInputFocus();

    // Auto resize functionality
    const adjustHeight = useCallback(() => {
      if (autoResize && textareaRef.current) {
        const textarea = textareaRef.current;
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
      }
    }, [autoResize]);

    // Adjust height when value changes
    useEffect(() => {
      adjustHeight();
    }, [value, adjustHeight]);

    // Adjust height on mount
    useEffect(() => {
      adjustHeight();
    }, [adjustHeight]);

    const handleTextAreaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = event.target.value;
      
      // Check maxLength
      if (maxLength && newValue.length > maxLength) {
        return;
      }
      
      handleChange(newValue);
      adjustHeight();
    };

    const handleTextAreaKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      // Handle special key combinations
      if (event.key === 'Tab') {
        // Allow default tab behavior unless specifically handled
      } else if (event.key === 'Enter' && event.ctrlKey) {
        // Ctrl+Enter could trigger form submission or other actions
        event.preventDefault();
        // You can add custom logic here
      } else if (event.key === 'Escape') {
        // Blur the textarea on Escape
        textareaRef.current?.blur();
      }
      
      handleKeyDown(event);
      onKeyDown?.(event);
    };

    const handleTextAreaBlur = (event: React.FocusEvent<HTMLTextAreaElement>) => {
      handleBlur(event);
      onBlur?.(event);
    };

    const handleTextAreaFocus = (event: React.FocusEvent<HTMLTextAreaElement>) => {
      handleFocus(event);
      onFocus?.(event);
    };

    const computedClassName = mergeClassNames(
      'table-input',
      'table-input-textarea',
      !isValid && 'error',
      isFocused && 'focused',
      disabled && 'disabled',
      autoResize && 'auto-resize',
      `resize-${resize}`,
      className
    );

    const computedStyle = {
      ...style,
      resize: autoResize ? 'none' : resize
    };

    const characterCount = typeof value === 'string' ? value.length : 0;
    const showCharacterCount = maxLength && maxLength > 0;

    return (
      <div className="table-input-textarea-wrapper">
        <textarea
          {...htmlProps}
          ref={(node) => {
            if (typeof ref === 'function') {
              ref(node);
            } else if (ref) {
              ref.current = node;
            }
            // Set local ref using Object.assign to avoid readonly issues
            Object.assign(textareaRef, { current: node });
          }}
          value={value || ''}
          onChange={handleTextAreaChange}
          onBlur={handleTextAreaBlur}
          onFocus={handleTextAreaFocus}
          onKeyDown={handleTextAreaKeyDown}
          className={computedClassName}
          style={computedStyle}
          disabled={disabled}
          readOnly={readOnly}
          placeholder={placeholder}
          rows={rows}
          cols={cols}
          minLength={minLength}
          maxLength={maxLength}
          aria-label={ariaLabel}
          aria-describedby={ariaDescribedBy}
          aria-invalid={!isValid}
          data-testid={dataTestId || 'table-input-textarea'}
          data-row={row ? JSON.stringify(row) : undefined}
          data-index={index}
          data-field={field}
        />
        
        {showCharacterCount && (
          <div className="table-input-textarea-character-count">
            <span className={characterCount > maxLength! ? 'over-limit' : ''}>
              {characterCount}
            </span>
            <span className="separator">/</span>
            <span>{maxLength}</span>
          </div>
        )}
        
        {errorMessage && (
          <div className="table-input-error-message" role="alert">
            {errorMessage}
          </div>
        )}
      </div>
    );
  }
);

TableInputTextArea.displayName = 'TableInputTextArea';

export default TableInputTextArea;