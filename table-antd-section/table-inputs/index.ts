// Main exports for Table Input Components
export {
  TableInputText,
  TableInputNumber,
  TableInputSelect,
  TableInputDate,
  TableInputTextArea,
  TableInputSwitch,
  TableInputTextDefault,
  TableInputNumberDefault,
  TableInputSelectDefault,
  TableInputDateDefault,
  TableInputTextAreaDefault,
  TableInputSwitchDefault
} from './components';

// Export types
export type {
  ITableInputTextProps,
  ITableInputNumberProps,
  ITableInputSelectProps,
  ITableInputDateProps,
  ITableInputTextAreaProps,
  ITableInputSwitchProps,
  IBaseTableInputProps,
  ISelectOption,
  IValidationRule,
  IInputState
} from './shared/types';

// Export hooks
export {
  useTableInput,
  useDebounce,
  useInputFocus,
  useInputValidation
} from './shared/hooks';

// Export utilities
export {
  validateInput,
  formatValue,
  parseValue,
  evaluateMathExpression,
  formatNumber,
  parseNumber,
  formatDate,
  parseDate,
  createSelectOptions,
  filterSelectOptions,
  mergeClassNames,
  inputStyles,
  debounce,
  throttle,
  noop
} from './shared/utils';

// Export shared module
export * from './shared';