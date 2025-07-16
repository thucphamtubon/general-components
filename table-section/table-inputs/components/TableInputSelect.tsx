import React, { forwardRef, useState, useRef, useEffect, useCallback } from 'react';
import { useTableInput, useInputFocus } from '../shared/hooks';
import { ITableInputSelectProps, ISelectOption } from '../shared/types';
import { mergeClassNames, filterSelectOptions } from '../shared/utils';
import '../styles/table-inputs.css';

export const TableInputSelect = forwardRef<HTMLSelectElement, ITableInputSelectProps>(
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
      options = [],
      multiple = false,
      searchable = false,
      clearable = false,
      'aria-label': ariaLabel,
      'aria-describedby': ariaDescribedBy,
      'data-testid': dataTestId,
      row,
      index,
      field,
      ...htmlProps
    } = props;

    const [isOpen, setIsOpen] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [filteredOptions, setFilteredOptions] = useState(options);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

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
      debounceMs: 100
    });

    const { inputRef } = useInputFocus();

    // Filter options based on search text
    useEffect(() => {
      if (searchable && searchText) {
        setFilteredOptions(filterSelectOptions(options, searchText));
      } else {
        setFilteredOptions(options);
      }
    }, [options, searchText, searchable]);

    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setIsOpen(false);
          setSearchText('');
        }
      };

      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
      }
    }, [isOpen]);

    // Focus search input when dropdown opens
    useEffect(() => {
      if (isOpen && searchable && searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }, [isOpen, searchable]);

    const getDisplayValue = useCallback(() => {
      if (multiple && Array.isArray(value)) {
        if (value.length === 0) return placeholder || '';
        if (value.length === 1) {
          const option = options.find(opt => opt.value === value[0]);
          return option?.label || value[0];
        }
        return `${value.length} mục đã chọn`;
      }
      
      if (value === null || value === undefined || value === '') {
        return placeholder || '';
      }
      
      const option = options.find(opt => opt.value === value);
      return option?.label || value;
    }, [value, options, multiple, placeholder]);

    const handleOptionSelect = (optionValue: any) => {
      if (multiple) {
        const currentValues = Array.isArray(value) ? value : [];
        const newValues = currentValues.includes(optionValue)
          ? currentValues.filter(v => v !== optionValue)
          : [...currentValues, optionValue];
        handleChange(newValues);
      } else {
        handleChange(optionValue);
        setIsOpen(false);
        setSearchText('');
      }
    };

    const handleClear = (event: React.MouseEvent) => {
      event.stopPropagation();
      handleChange(multiple ? [] : null);
    };

    const handleDropdownToggle = () => {
      if (!disabled && !readOnly) {
        setIsOpen(!isOpen);
        if (!isOpen) {
          setSearchText('');
        }
      }
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchText(event.target.value);
    };

    const handleInputKeyDown = (event: React.KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleDropdownToggle();
      } else if (event.key === 'Escape') {
        setIsOpen(false);
        setSearchText('');
      } else if (event.key === 'ArrowDown' && !isOpen) {
        event.preventDefault();
        setIsOpen(true);
      }
      
      handleKeyDown(event);
      onKeyDown?.(event);
    };

    const handleInputBlur = (event: React.FocusEvent) => {
      // Don't close if focus is moving to dropdown
      if (!dropdownRef.current?.contains(event.relatedTarget as Node)) {
        setIsOpen(false);
        setSearchText('');
        handleBlur(event);
        onBlur?.(event);
      }
    };

    const handleInputFocus = (event: React.FocusEvent) => {
      handleFocus(event);
      onFocus?.(event);
    };

    const computedClassName = mergeClassNames(
      'table-input',
      'table-input-select',
      !isValid && 'error',
      isFocused && 'focused',
      disabled && 'disabled',
      isOpen && 'open',
      className
    );

    const hasValue = multiple 
      ? Array.isArray(value) && value.length > 0
      : value !== null && value !== undefined && value !== '';

    return (
      <div className="table-input-select-wrapper" ref={dropdownRef}>
        <div
          className={computedClassName}
          style={style}
          onClick={handleDropdownToggle}
          onKeyDown={handleInputKeyDown}
          onBlur={handleInputBlur}
          onFocus={handleInputFocus}
          tabIndex={disabled ? -1 : 0}
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-label={ariaLabel}
          aria-describedby={ariaDescribedBy}
          aria-invalid={!isValid}
          data-testid={dataTestId || 'table-input-select'}
          data-row={row ? JSON.stringify(row) : undefined}
          data-index={index}
          data-field={field}
        >
          <span className="table-input-select-value">
            {getDisplayValue()}
          </span>
          
          {clearable && hasValue && !disabled && !readOnly && (
            <button
              type="button"
              className="table-input-select-clear"
              onClick={handleClear}
              aria-label="Xóa lựa chọn"
            >
              ×
            </button>
          )}
          
          <span className="table-input-select-arrow" aria-hidden="true">
            {isOpen ? '▲' : '▼'}
          </span>
        </div>

        {isOpen && (
          <div className="table-input-select-dropdown" role="listbox">
            {searchable && (
              <div className="table-input-select-search">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchText}
                  onChange={handleSearchChange}
                  placeholder="Tìm kiếm..."
                  className="table-input table-input-text"
                />
              </div>
            )}
            
            <div className="table-input-select-options">
              {filteredOptions.length === 0 ? (
                <div className="table-input-select-option table-input-select-option--empty">
                  Không có dữ liệu
                </div>
              ) : (
                filteredOptions.map((option, optionIndex) => {
                  const isSelected = multiple
                    ? Array.isArray(value) && value.includes(option.value)
                    : value === option.value;
                  
                  return (
                    <div
                      key={`${option.value}-${optionIndex}`}
                      className={mergeClassNames(
                        'table-input-select-option',
                        isSelected && 'selected',
                        option.disabled && 'disabled'
                      )}
                      onClick={() => !option.disabled && handleOptionSelect(option.value)}
                      role="option"
                      aria-selected={isSelected}
                      data-value={option.value}
                    >
                      {multiple && (
                        <input
                          type="checkbox"
                          checked={isSelected}
                          readOnly
                          className="table-input-select-checkbox"
                        />
                      )}
                      <span>{option.label}</span>
                    </div>
                  );
                })
              )}
            </div>
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

TableInputSelect.displayName = 'TableInputSelect';

export default TableInputSelect;