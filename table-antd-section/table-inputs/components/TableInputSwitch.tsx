import React, { forwardRef, useRef } from 'react';
import { useTableInput, useInputFocus } from '../shared/hooks';
import { ITableInputSwitchProps } from '../shared/types';
import { mergeClassNames } from '../shared/utils';
import '../styles/table-inputs.css';

export const TableInputSwitch = forwardRef<HTMLInputElement, ITableInputSwitchProps>(
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
      size = 'medium',
      checkedChildren,
      unCheckedChildren,
      loading = false,
      'aria-label': ariaLabel,
      'aria-describedby': ariaDescribedBy,
      'data-testid': dataTestId,
      row,
      index,
      field,
      ...htmlProps
    } = props;

    const inputRef = useRef<HTMLInputElement>(null);

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
      initialValue: Boolean(initialValue),
      onChange,
      debounceMs: 0 // No debounce for switch
    });

    const { inputRef: focusRef } = useInputFocus();

    const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!disabled && !readOnly && !loading) {
        handleChange(event.target.checked);
      }
    };

    const handleSwitchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === ' ' || event.key === 'Enter') {
        event.preventDefault();
        if (!disabled && !readOnly && !loading) {
          handleChange(!value);
        }
      }
      
      handleKeyDown(event);
      onKeyDown?.(event);
    };

    const handleSwitchBlur = (event: React.FocusEvent<HTMLInputElement>) => {
      handleBlur(event);
      onBlur?.(event);
    };

    const handleSwitchFocus = (event: React.FocusEvent<HTMLInputElement>) => {
      handleFocus(event);
      onFocus?.(event);
    };

    const handleLabelClick = () => {
      if (!disabled && !readOnly && !loading) {
        handleChange(!value);
        inputRef.current?.focus();
      }
    };

    const computedClassName = mergeClassNames(
      'table-input-switch',
      `table-input-switch--${size}`,
      value && 'checked',
      !isValid && 'error',
      isFocused && 'focused',
      disabled && 'disabled',
      loading && 'loading',
      className
    );

    const isChecked = Boolean(value);

    return (
      <div className="table-input-switch-wrapper">
        <label 
          className={computedClassName}
          style={style}
          onClick={handleLabelClick}
          data-testid={dataTestId || 'table-input-switch'}
          data-row={row ? JSON.stringify(row) : undefined}
          data-index={index}
          data-field={field}
        >
          <input
            {...htmlProps}
            ref={(node) => {
              if (typeof ref === 'function') {
                ref(node);
              } else if (ref) {
                ref.current = node;
              }
              // Set local ref using Object.assign to avoid readonly issues
              Object.assign(inputRef, { current: node });
            }}
            type="checkbox"
            checked={isChecked}
            onChange={handleSwitchChange}
            onBlur={handleSwitchBlur}
            onFocus={handleSwitchFocus}
            onKeyDown={handleSwitchKeyDown}
            disabled={disabled || loading}
            readOnly={readOnly}
            className="table-input-switch-input"
            aria-label={ariaLabel}
            aria-describedby={ariaDescribedBy}
            aria-invalid={!isValid}
            aria-checked={isChecked}
            role="switch"
          />
          
          <span className="table-input-switch-slider">
            <span className="table-input-switch-handle">
              {loading && (
                <span className="table-input-switch-loading-icon" aria-hidden="true">
                  ⟳
                </span>
              )}
            </span>
            
            {(checkedChildren || unCheckedChildren) && (
              <span className="table-input-switch-inner">
                {isChecked ? checkedChildren : unCheckedChildren}
              </span>
            )}
          </span>
        </label>
        
        {errorMessage && (
          <div className="table-input-error-message" role="alert">
            {errorMessage}
          </div>
        )}
      </div>
    );
  }
);

TableInputSwitch.displayName = 'TableInputSwitch';

export default TableInputSwitch;