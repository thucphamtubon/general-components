// Shared Types
export type {
  IBaseInputProps,
  ITableInputProps,
  INumberInputProps,
  ITextInputProps,
  ISelectInputProps,
  ISelectOption,
  IDateInputProps,
  ITextAreaInputProps,
  ISwitchInputProps,
  IInputComponent,
  IInputEvents,
  IInputValidation,
  IInputConfig
} from './types'

// Shared Hooks
export {
  useInputValue,
  useTableInput,
  useInputValidation,
  type IUseInputValueOptions,
  type IUseInputValueReturn,
  type IUseTableInputOptions,
  type IUseTableInputReturn,
  type IUseInputValidationOptions,
  type IUseInputValidationReturn
} from './hooks'

// Shared Utilities
export {
  evaluateMathExpression,
  formatNumber,
  parseNumber,
  truncateText,
  removeExtraSpaces,
  createSelectOption,
  createSelectOptionsFromArray,
  filterSelectOptions,
  formatDate,
  parseDate,
  validators,
  createInputConfig,
  mergeInputProps,
  handleInputError,
  inputStyles,
  defaultInputConfigs
} from './utils'

export * from './logics';
export * from './math';