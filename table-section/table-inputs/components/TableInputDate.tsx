import React, { forwardRef, useState, useRef, useEffect, useCallback } from 'react';
import { useTableInput, useInputFocus } from '../shared/hooks';
import { ITableInputDateProps } from '../shared/types';
import { mergeClassNames, formatDate, parseDate } from '../shared/utils';
import '../styles/table-inputs.css';

export const TableInputDate = forwardRef<HTMLInputElement, ITableInputDateProps>(
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
      format = 'dd/MM/yyyy',
      showTime = false,
      timeFormat = 'HH:mm',
      'aria-label': ariaLabel,
      'aria-describedby': ariaDescribedBy,
      'data-testid': dataTestId,
      row,
      index,
      field,
      ...htmlProps
    } = props;

    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [displayValue, setDisplayValue] = useState('');
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const calendarRef = useRef<HTMLDivElement>(null);
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
      initialValue,
      onChange,
      debounceMs: 300
    });

    const { inputRef: focusRef } = useInputFocus();

    // Initialize display value and selected date
    useEffect(() => {
      if (value) {
        const date = parseDate(value, format);
        if (date) {
          setSelectedDate(date);
          setDisplayValue(formatDate(date, format));
          setCurrentMonth(date);
        } else {
          setDisplayValue(String(value));
        }
      } else {
        setDisplayValue('');
        setSelectedDate(null);
      }
    }, [value, format]);

    // Close calendar when clicking outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
          setIsCalendarOpen(false);
        }
      };

      if (isCalendarOpen) {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
      }
    }, [isCalendarOpen]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = event.target.value;
      setDisplayValue(inputValue);
      
      // Try to parse the input value
      const parsedDate = parseDate(inputValue, format);
      if (parsedDate) {
        setSelectedDate(parsedDate);
        handleChange(parsedDate);
      } else if (inputValue === '') {
        setSelectedDate(null);
        handleChange(null);
      }
    };

    const handleDateSelect = (date: Date) => {
      setSelectedDate(date);
      setDisplayValue(formatDate(date, format));
      handleChange(date);
      setIsCalendarOpen(false);
    };

    const handleCalendarToggle = () => {
      if (!disabled && !readOnly) {
        setIsCalendarOpen(!isCalendarOpen);
      }
    };

    const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        if (isCalendarOpen) {
          setIsCalendarOpen(false);
        } else {
          handleCalendarToggle();
        }
      } else if (event.key === 'Escape') {
        setIsCalendarOpen(false);
      } else if (event.key === 'ArrowDown' && !isCalendarOpen) {
        event.preventDefault();
        setIsCalendarOpen(true);
      }
      
      handleKeyDown(event);
      onKeyDown?.(event);
    };

    const handleInputBlur = (event: React.FocusEvent<HTMLInputElement>) => {
      // Don't close if focus is moving to calendar
      if (!calendarRef.current?.contains(event.relatedTarget as Node)) {
        setIsCalendarOpen(false);
        handleBlur(event);
        onBlur?.(event);
      }
    };

    const handleInputFocus = (event: React.FocusEvent<HTMLInputElement>) => {
      handleFocus(event);
      onFocus?.(event);
    };

    const isDateInRange = useCallback((date: Date) => {
      if (min && date < parseDate(min, format)!) return false;
      if (max && date > parseDate(max, format)!) return false;
      return true;
    }, [min, max, format]);

    const generateCalendarDays = useCallback(() => {
      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth();
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const startDate = new Date(firstDay);
      startDate.setDate(startDate.getDate() - firstDay.getDay());
      
      const days: Date[] = [];
      const current = new Date(startDate);
      
      for (let i = 0; i < 42; i++) {
        days.push(new Date(current));
        current.setDate(current.getDate() + 1);
      }
      
      return days;
    }, [currentMonth]);

    const navigateMonth = (direction: 'prev' | 'next') => {
      setCurrentMonth(prev => {
        const newMonth = new Date(prev);
        if (direction === 'prev') {
          newMonth.setMonth(newMonth.getMonth() - 1);
        } else {
          newMonth.setMonth(newMonth.getMonth() + 1);
        }
        return newMonth;
      });
    };

    const computedClassName = mergeClassNames(
      'table-input',
      'table-input-date',
      !isValid && 'error',
      isFocused && 'focused',
      disabled && 'disabled',
      isCalendarOpen && 'open',
      className
    );

    const calendarDays = generateCalendarDays();
    const monthNames = [
      'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
      'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
    ];
    const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

    return (
      <div className="table-input-date-wrapper" ref={calendarRef}>
        <div className="table-input-date-input-wrapper">
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
            type="text"
            value={displayValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onFocus={handleInputFocus}
            onKeyDown={handleInputKeyDown}
            className={computedClassName}
            style={style}
            disabled={disabled}
            readOnly={readOnly}
            placeholder={placeholder || format}
            aria-label={ariaLabel}
            aria-describedby={ariaDescribedBy}
            aria-invalid={!isValid}
            aria-expanded={isCalendarOpen}
            aria-haspopup="dialog"
            data-testid={dataTestId || 'table-input-date'}
            data-row={row ? JSON.stringify(row) : undefined}
            data-index={index}
            data-field={field}
          />
          
          <button
            type="button"
            className="table-input-date-calendar-button"
            onClick={handleCalendarToggle}
            disabled={disabled}
            aria-label="Mở lịch"
            tabIndex={-1}
          >
            📅
          </button>
        </div>

        {isCalendarOpen && (
          <div className="table-input-date-calendar" role="dialog" aria-label="Chọn ngày">
            <div className="table-input-date-calendar-header">
              <button
                type="button"
                className="table-input-date-nav-button"
                onClick={() => navigateMonth('prev')}
                aria-label="Tháng trước"
              >
                ‹
              </button>
              
              <span className="table-input-date-month-year">
                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </span>
              
              <button
                type="button"
                className="table-input-date-nav-button"
                onClick={() => navigateMonth('next')}
                aria-label="Tháng sau"
              >
                ›
              </button>
            </div>
            
            <div className="table-input-date-calendar-grid">
              <div className="table-input-date-weekdays">
                {dayNames.map(day => (
                  <div key={day} className="table-input-date-weekday">
                    {day}
                  </div>
                ))}
              </div>
              
              <div className="table-input-date-days">
                {calendarDays.map((day, dayIndex) => {
                  const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
                  const isSelected = selectedDate && 
                    day.getDate() === selectedDate.getDate() &&
                    day.getMonth() === selectedDate.getMonth() &&
                    day.getFullYear() === selectedDate.getFullYear();
                  const isToday = 
                    day.getDate() === new Date().getDate() &&
                    day.getMonth() === new Date().getMonth() &&
                    day.getFullYear() === new Date().getFullYear();
                  const isDisabled = !isDateInRange(day);
                  
                  return (
                    <button
                      key={dayIndex}
                      type="button"
                      className={mergeClassNames(
                        'table-input-date-day',
                        !isCurrentMonth && 'other-month',
                        isSelected && 'selected',
                        isToday && 'today',
                        isDisabled && 'disabled'
                      )}
                      onClick={() => !isDisabled && handleDateSelect(day)}
                      disabled={isDisabled}
                      aria-label={formatDate(day, 'dd/MM/yyyy')}
                    >
                      {day.getDate()}
                    </button>
                  );
                })}
              </div>
            </div>
            
            {showTime && selectedDate && (
              <div className="table-input-date-time-picker">
                <input
                  type="time"
                  className="table-input table-input-time"
                  value={formatDate(selectedDate, timeFormat)}
                  onChange={(e) => {
                    const [hours, minutes] = e.target.value.split(':').map(Number);
                    const newDate = new Date(selectedDate);
                    newDate.setHours(hours, minutes);
                    handleDateSelect(newDate);
                  }}
                />
              </div>
            )}
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

TableInputDate.displayName = 'TableInputDate';

export default TableInputDate;